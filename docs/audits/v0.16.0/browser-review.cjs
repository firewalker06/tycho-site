const {chromium}=require('/Users/didik/Code/personal/tycho-site/node_modules/playwright');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
console.log('Chrome '+browser.version());
const routes=['/','/docs/getting-started/','/docs/getting-started/remote-ui/','/docs/configuration/','/docs/configuration/harnesses/','/docs/configuration/schedules/','/docs/reference/','/docs/concept/','/docs/concept/delegation/','/docs/concept/lifecycle/','/docs/reference/glossary/'];
for(const [name,size] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
 const page=await browser.newPage({viewport:size});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of routes){
 const response=await page.goto('http://127.0.0.1:4322'+route,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{for(const image of document.images){if(image.closest('[hidden]'))continue;image.scrollIntoView();await new Promise(r=>requestAnimationFrame(r));await image.decode().catch(()=>{});}scrollTo(0,0)});
 const issues=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.closest('[hidden]')&&(!i.complete||!i.naturalWidth)).map(i=>i.src)}));
 if(response.status()!==200||issues.overflow||issues.broken.length||errors.length)throw Error(JSON.stringify({name,route,status:response.status(),issues,errors}));
 if(route==='/'){
 const badge=await page.locator('.version-badge').getAttribute('href');if(badge!=='https://github.com/firewalker06/tycho/releases/tag/v0.16.0')throw Error('badge');
 await page.screenshot({path:`/tmp/tycho-site-v0160/evidence/home-${name}.png`,fullPage:true});
 const tabs=page.locator('[data-carousel-tab]');await tabs.nth(2).click();if(await tabs.nth(2).getAttribute('aria-selected')!=='true')throw Error('carousel click');
 await tabs.nth(2).press('ArrowRight');if(await tabs.nth(3).getAttribute('aria-selected')!=='true')throw Error('carousel keyboard');
 await tabs.nth(3).press('Home');if(await tabs.nth(0).getAttribute('aria-selected')!=='true')throw Error('carousel Home');
 }
 if(route==='/docs/getting-started/')await page.screenshot({path:`/tmp/tycho-site-v0160/evidence/install-${name}.png`,fullPage:true});
 if(route==='/docs/reference/'){
 await page.goto('http://127.0.0.1:4322/docs/reference/#agent-focus');if(!await page.locator('#agent-focus').isVisible())throw Error('anchor');
 if(name==='mobile'){const menu=page.getByRole('button',{name:'Menu',exact:true});await menu.click();if(!(await page.locator('#starlight__sidebar').evaluate(e=>e.matches(':popover-open'))))throw Error('mobile menu');await page.keyboard.press('Escape');if(await page.locator('#starlight__sidebar').evaluate(e=>e.matches(':popover-open')))throw Error('Escape');}
 }
 console.log(name+' '+route+' 200; images, overflow, errors passed');
 }
 await page.close();
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

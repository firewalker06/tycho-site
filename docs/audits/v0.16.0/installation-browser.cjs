const {chromium}=require('/Users/didik/Code/personal/tycho-site/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});console.log('Chrome '+b.version());
for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
 const context=await b.newContext({viewport,permissions:['clipboard-read','clipboard-write']});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});await page.getByRole('link',{name:'Install Tycho',exact:true}).click();if(!page.url().endsWith('#install'))throw Error('install anchor');
 const group=page.getByRole('tablist',{name:'Installation platform'});const tabs=group.getByRole('tab');const panels=page.locator('tycho-install-tabs [role="tabpanel"]');if(await tabs.count()!==3||await panels.count()!==3)throw Error('three tabs/panels');
 async function selected(index){
  for(let i=0;i<3;i++){
   const tab=tabs.nth(i),panel=panels.nth(i);if(await tab.getAttribute('aria-controls')!==await panel.getAttribute('id'))throw Error('controls');
   if(await panel.getAttribute('aria-labelledby')!==await tab.getAttribute('id'))throw Error('label');
   if(await tab.getAttribute('aria-selected')!==String(i===index))throw Error('selection');
   if(await tab.getAttribute('tabindex')!==(i===index?'0':'-1'))throw Error('roving focus');
   if(await panel.isVisible()!==(i===index))throw Error('one panel visible');
  }
 }
 await selected(0);
 await tabs.nth(1).click();await selected(1);
 for(const [key,index] of [['ArrowRight',2],['ArrowRight',0],['ArrowLeft',2],['Home',0],['End',2]]){await page.keyboard.press(key);await selected(index);if(!await tabs.nth(index).evaluate(e=>e===document.activeElement))throw Error('keyboard focus');}
 await tabs.nth(0).focus();await page.keyboard.press('Enter');await selected(0);await tabs.nth(1).focus();await page.keyboard.press('Space');await selected(1);
 await page.keyboard.press('Tab');if(!await panels.nth(1).evaluate(e=>e===document.activeElement))throw Error('tab into panel');await page.keyboard.press('Shift+Tab');if(!await tabs.nth(1).evaluate(e=>e===document.activeElement))throw Error('return to selected tab');
 const colors=await tabs.evaluateAll(els=>els.map(e=>getComputedStyle(e).borderColor));if(colors[1]===colors[0])throw Error('selected visual state');
 for(let i=0;i<3;i++){
  await tabs.nth(i).click();await selected(i);const panel=panels.nth(i);const button=panel.getByRole('button');const command=await panel.locator('code').textContent();await button.click();if(await page.evaluate(()=>navigator.clipboard.readText())!==command)throw Error('clipboard bytes');
  await page.locator('#install').screenshot({path:`/tmp/tycho-site-v0160/rework/evidence/tabs-${i}-${name}.png`});
 }
 const prompt=page.locator('.first-run-grid .command-block');await prompt.getByRole('button').click();if(await page.evaluate(()=>navigator.clipboard.readText())!==await prompt.locator('code').textContent())throw Error('prompt copy');
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('denied by test')};});await panels.nth(2).getByRole('button').click();await panels.nth(2).getByRole('status').getByText('Copy unavailable. Select the command text to copy it.').waitFor();
 const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,tabs:[...document.querySelectorAll('.install-tabs button')].map(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth})}));if(layout.overflow||layout.tabs.some(v=>!v)||errors.length)throw Error(JSON.stringify({layout,errors}));
 console.log(name+': mouse, ArrowLeft/Right wrap, Home/End, Enter/Space, Tab/Shift+Tab, ARIA links, one panel, selected style, all clipboard bytes, denied-copy fallback, layout/errors PASS');await context.close();
}
await b.close();})().catch(e=>{console.error(e);process.exit(1)});

const{chromium}=require('/Users/didik/Code/personal/tycho-site/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});console.log('Chrome '+b.version());
for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
 const ctx=await b.newContext({viewport,permissions:['clipboard-read','clipboard-write']});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});
 await p.getByRole('link',{name:'Install Tycho',exact:true}).click();if(!p.url().endsWith('#install'))throw Error('install CTA');
 const section=p.locator('#install');if(await section.locator('.platform-card').count()!==3)throw Error('platform cards');
 for(const button of await section.locator('[data-copy-command]').all()){
  const expected=await button.locator('..').locator('..').locator('code').textContent();await button.click();
  if(await p.evaluate(()=>navigator.clipboard.readText())!==expected)throw Error('copy mismatch');
 }
 await section.screenshot({path:`/tmp/tycho-site-v0160/evidence/installation-${name}.png`});
 await p.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('test permission rejection')};});
 await section.locator('[data-copy-command]').first().click();await section.getByRole('status').first().getByText('Copy unavailable. Select the command text to copy it.').waitFor();
 const dimensions=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));if(dimensions.scroll>dimensions.width||errors.length)throw Error(JSON.stringify({dimensions,errors}));
 console.log(name+' CTA, three platform paths, all four clipboard buttons, permission fallback, overflow, errors: PASS');
 await ctx.close();}
await b.close();})().catch(e=>{console.error(e);process.exit(1)});

// Probe 14: leaving the game from the keyboard only (menu, Abbandona, confirmation) and the inspection of a card with I, then Esc.
import {startServer,stopServer,launch,login,startDuel,state,saveJson,wait} from './lib.mjs';
await startServer();
const {browser,page}=await launch({width:1366,height:768,reducedMotion:true});
const timer=setTimeout(()=>process.exit(2),200000);
const out={};
const info=()=>page.evaluate(()=>{const e=document.activeElement;return e&&e!==document.body?{label:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,30),dlg:!!e.closest('dialog')}:null;});
const tabTo=async(re,max=30)=>{for(let i=1;i<=max;i++){await page.keyboard.press('Tab');await page.waitForTimeout(60);const x=await info();if(x&&re.test(x.label))return i;}return -1;};
try{
 await login(page);await startDuel(page);await page.waitForTimeout(1500);
 // inspect with I
 await page.keyboard.press('Tab');await page.waitForTimeout(100);
 out.firstFocus=await info();
 await page.keyboard.press('i');await page.waitForTimeout(400);out.inspectOpen=await page.evaluate(()=>!!document.querySelector('dialog[open] .inspection'));out.inspectFocus=await info();
 await page.keyboard.press('Escape');await page.waitForTimeout(400);out.afterEsc=await info();
 // leave
 out.tabsToMenu=await tabTo(/Apri menu/);await page.keyboard.press('Enter');await page.waitForTimeout(400);
 out.tabsToLeave=await tabTo(/Abbandona la partita/);await page.keyboard.press('Enter');await page.waitForTimeout(400);
 out.leaveFocus=await info();
 out.tabsToYes=await tabTo(/Sì, abbandona/);await page.keyboard.press('Enter');
 await page.getByTestId('quick').waitFor({timeout:15000}).then(()=>out.hubReached=true,()=>out.hubReached=false);
 out.focusAtHub=await info();
 await saveJson('leave',out);console.log(JSON.stringify(out));
}catch(e){console.error('ERR',e);console.log(JSON.stringify(out));}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

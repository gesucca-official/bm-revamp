// Probe 13: keyboard in the hub (tab order, arrow keys on role=radio and role=tab) and the deck dialog.
import {startServer,stopServer,launch,login,saveJson} from './lib.mjs';
await startServer();
const {browser,page}=await launch({width:1366,height:768});
const timer=setTimeout(()=>process.exit(2),200000);
const out={};
const info=()=>page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;return {tag:e.tagName,role:e.getAttribute('role'),label:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,28),checked:e.getAttribute('aria-checked'),selected:e.getAttribute('aria-selected')};});
try{
 await login(page);
 await page.mouse.click(5,5);
 const order=[];for(let i=0;i<20;i++){await page.keyboard.press('Tab');const x=await info();order.push(x?`${x.role??x.tag}:${x.label}${x.checked!==null?` [checked=${x.checked}]`:''}${x.selected!==null?` [selected=${x.selected}]`:''}`:'BODY');if(!x)break;}
 out.hubOrder=order;
 // arrow keys on the mode radios
 await page.getByRole('radio',{name:'Contro il computer'}).focus();
 const before=await page.evaluate(()=>[...document.querySelectorAll('[role=radio]')].map(r=>r.getAttribute('aria-checked')));
 await page.keyboard.press('ArrowRight');const afterArrow=await page.evaluate(()=>[...document.querySelectorAll('[role=radio]')].map(r=>r.getAttribute('aria-checked')));
 out.radio={before,afterArrow,focusAfter:await info()};
 await page.getByRole('tab',{name:'Gioca'}).focus();await page.keyboard.press('ArrowRight');
 out.tab={focusAfterArrow:await info(),selected:await page.evaluate(()=>[...document.querySelectorAll('[role=tab]')].map(r=>r.getAttribute('aria-selected')))};
 // enter on Collezione
 await page.getByRole('tab',{name:'Collezione'}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(300);
 out.collectionSelected=await page.evaluate(()=>[...document.querySelectorAll('[role=tab]')].map(r=>r.getAttribute('aria-selected')));
 // does a tabpanel exist?
 out.tabpanel=await page.evaluate(()=>document.querySelectorAll('[role=tabpanel]').length);
 // deck dialog
 await page.getByRole('tab',{name:'Gioca'}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(200);
 await page.getByRole('radio',{name:'Con un tuo mazzo'}).focus();await page.keyboard.press('Space');await page.keyboard.press('Tab');
 out.afterRadioTab=await info();
 await saveJson('hub-keys',out);console.log(JSON.stringify(out).slice(0,1800));
}catch(e){console.error('ERR',e);}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

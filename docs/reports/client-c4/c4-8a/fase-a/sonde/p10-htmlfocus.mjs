// Probe 10: focus on the HTML controls over the table (✓, ×, (i), menu, dialog buttons) with a card chosen, plus the (i) reachability by Tab.
import {startServer,stopServer,launch,login,startDuel,state,shot,saveJson,wait} from './lib.mjs';
const [w,h]=(process.env.VP??'1366x768').split('x').map(Number),tag=`htmlfocus-${w}x${h}`;
await startServer();
const {browser,page,errors}=await launch({width:w,height:h,reducedMotion:true});
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},300000);
const out={tag,notes:[]};
const info=()=>page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const cs=getComputedStyle(e),r=e.getBoundingClientRect();return {test:e.getAttribute('data-testid'),label:(e.getAttribute('aria-label')||e.textContent||'').slice(0,30),hit:e.getAttribute('data-hit'),outline:`${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} off ${cs.outlineOffset}`,box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],fv:e.matches(':focus-visible')};});
try{
 await login(page);await startDuel(page);await page.waitForTimeout(1500);
 const tap=async x=>{const c=x.kind==='hand'?{x:x.x-x.w*.22,y:x.y}:x.kind==='person'?{x:x.x,y:x.y+x.h*.15}:{x:x.x-x.w*.2,y:x.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(200);};
 let s=await state(page);
 // pick a card with an opponent target and no discard if possible
 for(const c of s.hits.filter(x=>x.kind==='hand')){await tap(c);s=await state(page);if(!s.selected)continue;const opp=s.hits.find(x=>x.kind==='person'&&x.target.owner!==s.me);await tap(opp);s=await state(page);if(s.target&&!/scartare/i.test(s.message))break;if(s.target&&/scartare/i.test(s.message)){const r=s.hits.find(x=>x.kind==='hand'&&x.id!==s.selected);await tap(r);s=await state(page);if(s.discard)break;}await page.keyboard.press('Escape');}
 await page.waitForTimeout(400);
 out.confirmState={target:s.target,discard:s.discard,confirmCard:s.confirmCard};
 // Tab from the menu button on to ✓ and ×
 await page.evaluate(()=>document.querySelector('.menu-button')?.focus());
 for(let i=0;i<6;i++){await page.keyboard.press('Tab');await page.waitForTimeout(150);const x=await info();out.notes.push({i,x});if(x&&(x.test==='confirm'||/Annulla/.test(x.label))){const cc=s.confirmCard;const clip={x:Math.max(0,cc.x-cc.w/2-40),y:Math.max(0,cc.y-cc.h/2-40),width:Math.min(w,cc.w+80),height:Math.min(h-Math.max(0,cc.y-cc.h/2-40),cc.h+80)};await shot(page,`${tag}-${x.test==='confirm'?'confirm':'cancel'}`,{clip});}}
 // (i): focus a hand card by keyboard, see whether Tab reaches the (i) button
 await page.keyboard.press('Escape');await page.waitForTimeout(300);
 await page.evaluate(()=>document.querySelector('[data-hit=card-3]')?.focus());await page.waitForTimeout(300);
 out.infoVisible=await page.evaluate(()=>!!document.querySelector('[data-testid=info]'));
 const reach=[];for(let i=0;i<5;i++){await page.keyboard.press('Tab');await page.waitForTimeout(120);const x=await info();reach.push(x&&(x.test??x.hit??x.label));}
 out.tabAfterCard3=reach;
 // menu button and dialog
 await page.evaluate(()=>document.querySelector('.menu-button')?.focus());await page.waitForTimeout(200);
 await shot(page,`${tag}-menu-button`,{clip:{x:w-200,y:0,width:200,height:90}});
 await page.keyboard.press('Enter');await page.waitForTimeout(400);
 out.dialogFirst=await info();
 await shot(page,`${tag}-dialog-first`);
 // tab order inside the menu dialog
 const inner=[];for(let i=0;i<12;i++){await page.keyboard.press('Tab');await page.waitForTimeout(80);const x=await info();inner.push(x&&x.label);}
 out.menuTabOrder=inner;
 // close with Escape: focus returns to the menu button?
 await page.keyboard.press('Escape');await page.waitForTimeout(400);out.afterClose=await info();
 await saveJson(tag,{...out,errors});console.log(JSON.stringify(out).slice(0,1800));
}catch(e){console.error('ERR',e);}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

// Probe 3: contrast on the real drawing, several table states, one viewport. Writes JSON (unique pairs) + a few captures.
import {startServer,stopServer,launch,login,startDuel,startFfa,state,shot,saveJson,wait} from './lib.mjs';
import {patchBundle,measurePage,summarize} from './measure.mjs';
const [w,h]=(process.env.VP??'1366x768').split('x').map(Number),mode=process.env.MODE??'duel',tag=`contrast-${mode}-${w}x${h}`;
await startServer();
const {browser,context,page,errors}=await launch({width:w,height:h,reducedMotion:true});
await patchBundle(context);
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},420000);
const all=[];
const take=async(label,cap)=>{await page.waitForTimeout(500);const r=await measurePage(page,label);console.log(label,'items',r.items.length);all.push(r);if(cap)await shot(page,`${tag}-${label}`);};
const click=async h=>{await page.mouse.click(h.kind==='hand'?h.x-h.w*.22:h.x,h.kind==='person'?h.y+h.h*.15:h.y);await page.waitForTimeout(120);};
try{
 await login(page);
 if(mode==='duel')await startDuel(page);else await startFfa(page);
 await page.waitForTimeout(1500);
 let s=await state(page);console.log('scene exposed:',await page.evaluate(()=>!!window.__bm.scene));
 await take('table-start',true);
 // select a card
 const hand=s.hits.filter(x=>x.kind==='hand');
 // pick first card with a damage role and an opponent target; for bound cards a discard is needed
 for(const c of hand){await click(c);s=await state(page);if(s.selected===c.key){break;}}
 await take('card-selected');
 const opp=s.hits.find(x=>x.kind==='person'&&x.target.owner!==s.me);
 if(opp){await click(opp);s=await state(page);}
 await take('target-chosen-or-discard',true);
 if(/scartare/i.test(s.message)){const r=s.hits.find(x=>x.kind==='hand'&&x.id!==s.selected);if(r){await click(r);}await take('discard-chosen',true);}
 // confirm and wait for the next turn
 const ok=page.getByTestId('confirm');
 if(await ok.count()&&await ok.isEnabled()){await ok.click();await wait(page,x=>x.turn>=1||x.over,40000,'turn1').catch(()=>{});await page.waitForTimeout(1200);await take('after-round',true);}
 // modals
 await page.getByRole('button',{name:'Apri menu'}).click();await page.waitForTimeout(400);await take('menu-modal',true);
 await page.getByRole('button',{name:'Ultimo turno'}).click();await page.waitForTimeout(400);await take('report-modal',true);
 await page.keyboard.press('Escape');await page.waitForTimeout(300);
 s=await state(page);
 const own=s.hits.find(x=>x.kind==='hand');
 if(own){await page.keyboard.down('Alt');await page.keyboard.up('Alt');await page.mouse.move(own.x,own.y);await page.keyboard.press('Tab');}
 // inspection from the keyboard: focus a hand card, press I
 await page.evaluate(()=>document.querySelector('[data-hit^=card-]')?.focus());await page.keyboard.press('i');await page.waitForTimeout(500);await take('inspect-card',true);
 await page.keyboard.press('Escape');await page.waitForTimeout(300);
 await page.evaluate(()=>document.querySelector('[data-hit^=person-]')?.focus());await page.keyboard.press('i');await page.waitForTimeout(500);await take('inspect-character',true);
 const sums=all.map(r=>({label:r.label,pairs:summarize(r)}));
 await saveJson(tag,{tag,errors,sums,raw:all.map(r=>({label:r.label,n:r.items.length}))});
 // print the worst pairs overall
 const flat=sums.flatMap(x=>x.pairs.map(p=>({label:x.label,...p})));
 const thr=p=>p.large?3:4.5;
 const bad=flat.filter(p=>p.typ<thr(p)).sort((a,b)=>a.typ-b.typ);
 const risk=flat.filter(p=>p.typ>=thr(p)&&p.low<thr(p)).sort((a,b)=>a.low-b.low);
 console.log('pairs',flat.length,'typ under threshold',bad.length,'only low under',risk.length);
 const line=p=>`${p.k} ${p.label} "${p.t}" ${p.px}px${p.large?' L':''} fg ${p.eff} bg ${p.bg} typ ${p.typ} low ${p.low} n=${p.count}`;
 for(const p of bad.slice(0,40))console.log('FAIL',line(p));
 for(const p of risk.slice(0,25))console.log('RISK',line(p));
}catch(e){console.error('ERR',e);}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

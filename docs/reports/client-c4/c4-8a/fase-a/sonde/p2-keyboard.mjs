// Probe 2: a whole game from the keyboard only (no pointer after login). Counts Tabs, records where focus goes and where it is lost.
import {measurePage,summarize} from './measure.mjs';
import {startServer,stopServer,launch,login,startDuel,startFfa,state,shot,saveJson,wait} from './lib.mjs';
const [w,h]=(process.env.VP??'1366x768').split('x').map(Number),mode=process.env.MODE??'duel',reduced=process.env.REDUCED==='1',maxTurns=Number(process.env.TURNS??40),tag=`kbd-${mode}-${w}x${h}${reduced?'-reduced':''}`;
await startServer();
const {browser,page,errors}=await launch({width:w,height:h,reducedMotion:reduced});
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},Number(process.env.LIMIT??900000));
const log=[],t0=Date.now();const note=(k,d)=>{log.push({t:Date.now()-t0,k,...d});console.log(((Date.now()-t0)/1000).toFixed(0)+'s',k,JSON.stringify(d).slice(0,300));};
const info=()=>page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;return {hit:e.getAttribute('data-hit'),test:e.getAttribute('data-testid'),cls:String(e.className||'').slice(0,40),label:(e.getAttribute('aria-label')||e.textContent||'').slice(0,50),dis:e.disabled===true,dlg:!!e.closest('dialog')};});
let tabsTotal=0;
// Tab (forward) until pred(info) holds. Returns {ok,tabs,path}.
async function tabTo(pred,max=70,back=false){const path=[];for(let i=1;i<=max;i++){await page.keyboard.press(back?'Shift+Tab':'Tab');tabsTotal++;await page.waitForTimeout(40);const x=await info();path.push(x?(x.hit??x.test??x.cls):'BODY');if(x&&pred(x))return {ok:true,tabs:i,path};}return {ok:false,tabs:max,path};}
const sx=async()=>await state(page);
const stats={turns:0,moves:0,cancelEsc:0,cancelBtn:0,confirmTabs:[],cardTabs:[],targetTabs:[],lostFocus:0,rejected:0,discardUsed:0};
try{
 await login(page);
 if(mode==='duel')await startDuel(page);else await startFfa(page);
 await page.waitForTimeout(2000);
 const me=(await sx()).me;
 let cancelBtnDone=false,cancelEscDone=false,turn0=-1;
 for(let n=0;n<maxTurns;n++){
  let s=await sx();
  if(s.over||s.eliminated)break;
  // wait for a choosable phase
  s=await wait(page,x=>!x||x.over||x.eliminated||x.phase==='choose',60000,'choose');
  if(!s||s.over||s.eliminated)break;
  const startTurn=s.turn;let played=false;
  for(const card of s.order){
   let st=await sx();if(st.selected&&st.selected!==card.key){await page.keyboard.press('Escape');}
   const t1=await tabTo(x=>x.hit===card.key,70);
   if(!t1.ok){note('card-unreachable',{card:card.name,tabs:t1.tabs,path:t1.path.slice(-6)});continue;}
   stats.cardTabs.push(t1.tabs);
   await page.keyboard.press(stats.moves===1?'Space':'Enter');await page.waitForTimeout(150);
   st=await sx();if(st.selected!==card.key){note('select-failed',{card:card.name,sel:st.selected,msg:st.message});continue;}
   const fa=await info();if(!fa)stats.lostFocus++;
   // target candidates: persons then items, opponents first
   const cand=st.hits.filter(x=>x.kind==='person'||x.kind==='item').sort((a,b)=>(a.target?.owner===me)-(b.target?.owner===me));
   let aimed=false,tt=0;
   for(const t of cand){
    const cur=await sx();if(cur.selected!==card.key){await tabTo(x=>x.hit===card.key,70);await page.keyboard.press('Enter');await page.waitForTimeout(120);}
    const r=await tabTo(x=>x.hit===t.id,70);if(!r.ok)continue;tt+=r.tabs;
    await page.keyboard.press('Enter');await page.waitForTimeout(200);
    if((await sx()).target){aimed=true;stats.targetTabs.push(tt);break;}}
   if(!aimed){await page.keyboard.press('Escape');note('no-target',{card:card.name});continue;}
   st=await sx();
   const afterAim=await info();if(!afterAim)stats.lostFocus++;
   note('aimed',{card:card.name,target:st.target,msg:st.message,focusAfter:afterAim&&(afterAim.hit??afterAim.test??afterAim.label)});
   if(n===0)await shot(page,`${tag}-confirm-state`);
   // discard for bound cards
   if(/scartare/i.test(st.message)){
    let ok=false;for(const r of st.hits.filter(x=>x.kind==='hand'&&x.id!==card.key)){const rr=await tabTo(x=>x.hit===r.id,70);if(!rr.ok)continue;await page.keyboard.press('Enter');await page.waitForTimeout(200);if((await sx()).discard){ok=true;stats.discardUsed++;break;}}
    if(!ok){await page.keyboard.press('Escape');note('discard-failed',{card:card.name});continue;}}
   // cancellation paths once each, then confirm
   if(!cancelBtnDone&&n===0){cancelBtnDone=true;const c=await tabTo(x=>/Annulla/.test(x.label),40);note('cancel-button',{tabs:c.tabs,ok:c.ok,path:c.path.slice(-8)});if(c.ok){await page.keyboard.press('Enter');await page.waitForTimeout(250);const z=await sx();stats.cancelBtn++;note('after-cancel',{sel:z.selected,target:z.target,focus:await info()});}
    continue;}
   if(!cancelEscDone&&n===1){cancelEscDone=true;await page.keyboard.press('Escape');await page.waitForTimeout(250);const z=await sx();stats.cancelEsc++;note('after-escape',{sel:z.selected,target:z.target,focus:await info()});continue;}
   const c=await tabTo(x=>x.test==='confirm',70);if(!c.ok){note('confirm-unreachable',{path:c.path.slice(-10)});await page.keyboard.press('Escape');continue;}
   stats.confirmTabs.push(c.tabs);
   if(c.tabs>20)note('confirm-far',{tabs:c.tabs});
   await page.keyboard.press('Enter');
   const r=await wait(page,x=>!x||x.phase==='pending'||x.turn!==startTurn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),20000,'answer');
   if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===startTurn){stats.rejected++;await page.keyboard.press('Escape');continue;}
   played=true;stats.moves++;break;
  }
  if(!played){if(n===0||n===1)continue;note('no-playable',{turn:startTurn});break;}
  // wait for next turn; record where focus is when the new turn starts
  s=await wait(page,x=>!x||x.over||x.eliminated||x.turn!==startTurn,90000,'next turn');
  await page.waitForTimeout(400);
  const f=await info();note('turn-start',{turn:s&&s.turn,focus:f&&(f.hit??f.test??f.label),seq:s&&s.sequence});if(!f)stats.lostFocus++;
  stats.turns++;
 }
 let s=await sx();
 note('end',{over:s?.over,elim:s?.eliminated,turns:stats.turns});
 await page.waitForTimeout(1500);
 // outcome panel from the keyboard
 const panel=await page.evaluate(()=>!!document.querySelector('.outcome'));
 if(panel){await shot(page,`${tag}-outcome`);if(process.env.MEASURE==='1'){const r=await measurePage(page,'outcome');const sm=summarize(r);await saveJson(`${tag}-outcome-contrast`,{items:r.items.length,pairs:sm});console.log('OUTCOME pairs',sm.length,JSON.stringify(sm.filter(p=>p.typ<(p.large?3:4.5)||p.low<(p.large?3:4.5)).slice(0,8)));}
  const first=await tabTo(x=>/Nuova partita|again/.test(x.label+(x.test||'')),25);note('outcome-tab-to-again',{ok:first.ok,tabs:first.tabs,path:first.path});
  if(first.ok){await page.keyboard.press('Enter');await wait(page,x=>x&&x.hits.some(z=>z.id.startsWith('person-'))&&!x.over,40000,'new game').then(()=>note('new-game-started',{}),e=>note('new-game-fail',{e:String(e)}));}}
 await saveJson(tag,{tag,stats,errors,tabsTotal,log});
 console.log(JSON.stringify(stats),'errors',errors.length);
}catch(e){console.error('ERR',e);await saveJson(tag+'-err',{stats,log,e:String(e)});}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

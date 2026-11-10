// Probe 8: what a sighted player with reduced motion gets after a round (vs normal motion), plus the text of «Ultimo turno» (D5 b: type of damage).
import {startServer,stopServer,launch,login,startDuel,state,shot,saveJson,wait} from './lib.mjs';
const [w,h]=(process.env.VP??'1366x768').split('x').map(Number),reduced=process.env.REDUCED==='1',tag=`reduced-${reduced?'on':'off'}-${w}x${h}`;
await startServer();
const {browser,page,errors}=await launch({width:w,height:h,reducedMotion:reduced});
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},400000);
const out={tag,rounds:[]};
const dialogOpen=()=>page.evaluate(()=>!!document.querySelector('dialog[open]'));
const tap=async x=>{const c=x.kind==='hand'?{x:x.x-x.w*.22,y:x.y}:x.kind==='person'?{x:x.x,y:x.y+x.h*.15}:{x:x.x-x.w*.2,y:x.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await page.keyboard.press('Escape');await page.waitForTimeout(60);}};
async function playOne(){
 for(const card of (await state(page)).order){
  const own=(await state(page)).hits.find(x=>x.id===card.key);if(!own)continue;await tap(own);if((await state(page)).selected!==card.key)continue;
  let aimed=false;for(const t of (await state(page)).hits.filter(x=>x.kind==='person'||x.kind==='item')){if((await state(page)).selected!==card.key){const o=(await state(page)).hits.find(x=>x.id===card.key);if(o)await tap(o);}await tap(t);if((await state(page)).target){aimed=true;break;}}
  if(!aimed){await page.keyboard.press('Escape');continue;}
  const s=await state(page);
  if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(x=>x.kind==='hand'&&x.id!==card.key)){await tap(r);if((await state(page)).discard){ok=true;break;}}if(!ok){await page.keyboard.press('Escape');continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await page.keyboard.press('Escape');continue;}
  await page.getByTestId('confirm').click();
  await wait(page,x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'answer');
  const r=await state(page);if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await page.keyboard.press('Escape');continue;}
  return {card:card.name,turn:s.turn};}
 return null;}
try{
 await login(page);await startDuel(page);await page.waitForTimeout(1500);
 for(let k=0;k<4;k++){
  const s0=await wait(page,x=>x&&x.phase==='choose',60000,'choose');
  const p=await playOne();if(!p)break;
  const s1=await wait(page,x=>!x||x.over||x.eliminated||x.turn!==p.turn,60000,'next');
  // a moment after the view: what is visible
  await page.waitForTimeout(700);
  const snap=await page.evaluate(()=>({toast:!!document.querySelector('[data-testid=toast]'),toastText:document.querySelector('[data-testid=toast]')?.textContent??null,srBrief:document.querySelector('[data-testid=brief]')?.textContent??null,srOnly:document.querySelector('[data-testid=brief]')?.classList.contains('sr-only')??null}));
  const st=await state(page);
  const row={turn:p.turn,played:p.card,...snap,shortSummary:st.shortSummary,seqRunning:st.sequence.running,summaries:st.sequence.summaries,playedCards:st.readout.played?.length??0,round:st.round};
  out.rounds.push(row);console.log(JSON.stringify(row).slice(0,400));
  if(k===0)await shot(page,`${tag}-after-round-0700ms`);
  await page.waitForTimeout(3000);
  if(k===0){await shot(page,`${tag}-after-round-3700ms`);
   // «Ultimo turno»
   await page.getByRole('button',{name:'Apri menu'}).click();await page.waitForTimeout(300);await page.getByRole('button',{name:'Ultimo turno'}).click();await page.waitForTimeout(400);
   out.report=await page.evaluate(()=>({facts:[...document.querySelectorAll('[data-testid=report-facts] li')].map(li=>li.textContent),changes:[...document.querySelectorAll('[data-testid=report-changes] li')].map(li=>li.textContent),end:document.querySelector('[data-testid=report-end]')?.textContent??null}));
   console.log('REPORT',JSON.stringify(out.report).slice(0,900));await shot(page,`${tag}-report`);await page.keyboard.press('Escape');await page.waitForTimeout(300);}
 }
 await saveJson(tag,{...out,errors});
}catch(e){console.error('ERR',e);await saveJson(tag+'-err',{...out,e:String(e)});}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

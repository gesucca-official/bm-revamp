// C4-12: captures of an elimination in FFA (four computers) and of an outcome in a duel (quick 1vCom) at the same moments of the sequence,
// to compare a build before and after C4-12 (BM_TAG=prima|dopo). Not a verification: no check fails on the product; it records, per moment,
// a screenshot, a crop of the seat stamped at the tail, whether the outcome panel and the hint are in the page and the time in the sequence.
// Moments, from the sequence start of the round with the death or the outcome: `coda-250` (just before the tail's stamp), `coda+350` (the stamp)
// and `fine+400` (after the end of the sequence). Prerequisites: port 8080 free (own server on a temporary database), preview on 4320, jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320',out=process.env.BM_OUT??join(tmpdir(),'bm-c4-12-captures'),tagB=process.env.BM_TAG??'build';
const size=process.env.BM_SIZE??'1366x768',modes=(process.env.BM_MODES??'ffa,duel').split(','),maxTurns=Number(process.env.BM_TURNS??60);
await mkdir(out,{recursive:true});
const evidence={date:new Date().toISOString(),url,tag:tagB,size,kind:'Edge via Playwright on PC against a local server on a temporary database; not a physical device',runs:[],errors:[]};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const api='http://127.0.0.1:8080',data=await mkdtemp(join(tmpdir(),'bm-c4-12-'));
if(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error('port 8080 is in use: stop the other server first');
const slog=createWriteStream(join(data,'server.log'),{flags:'a'});
const server=spawn(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local','--app.dev.seed-accounts=true','--server.port=8080'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
server.stdout.pipe(slog);server.stderr.pipe(slog);
const stop=()=>{try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{}};
process.on('exit',stop);
{const end=Date.now()+90000;let ok=false;while(Date.now()<end&&!ok){if(server.exitCode!==null)throw new Error(`server exited; log in ${data}`);
 try{ok=(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})})).ok;}catch{}if(!ok)await new Promise(r=>setTimeout(r,500));}
 if(!ok)throw new Error('server did not start');}
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const timer=setTimeout(()=>{evidence.errors.push('global timeout');void finish(2);},40*60000);
async function finish(code){clearTimeout(timer);try{await browser.close();}catch{}await writeFile(join(out,`c4-12-${tagB}-${size}.json`),JSON.stringify(evidence,null,1));stop();process.exit(code);}

async function run(mode){
 const [vw,vh]=size.split('x').map(Number),tag=`${mode}-${tagB}-${size}`,rec={mode,turns:0,moments:[],found:null,log:[]};evidence.runs.push(rec);
 const context=await browser.newContext({viewport:{width:vw,height:vh},reducedMotion:'no-preference'}),page=await context.newPage();
 page.on('pageerror',e=>evidence.errors.push(`${tag}: ${e}`));
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(s&&await pred(s))return s;await page.waitForTimeout(40);}throw new Error(`${tag}: timeout ${what}`);};
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(70);
  if(await page.evaluate(()=>!!document.querySelector('dialog[open]'))){await page.keyboard.press('Escape');await page.waitForTimeout(60);}};
 const esc=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(80);};
 await page.goto(`${url}#/accedi`);await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});
 if(mode==='ffa'){await page.getByRole('radio',{name:'Tutti contro tutti'}).click();await page.getByTestId('quick').click();await page.getByTestId('ffa-list').waitFor({timeout:10000});
  for(let i=0;i<4;i++){await page.getByTestId('add-computer').click();await page.waitForTimeout(400);}}
 else{await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
 await wait(s=>s.hits.some(h=>h.kind==='hand'),30000,'table');await page.mouse.move(2,2);
 for(let t=0;t<maxTurns&&!rec.found;t++){
  const s0=await wait(s=>s.over||s.eliminated||(s.phase==='choose'&&!s.sequence.running&&s.hits.some(h=>h.kind==='hand')),90000,'turn');
  if(s0.over||s0.eliminated){rec.log.push({turn:s0.turn,stop:{over:s0.over,eliminated:s0.eliminated},plans:s0.stats.sequencePlans.length,ends:s0.stats.sequenceEnds.slice(-2)});break;}rec.turns++;
  const plans=s0.stats.sequencePlans.length;let sent=false;
  for(const card of s0.order){
   const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.target?.owner===s0.me?1:0)-(b.target?.owner===s0.me?1:0)||(a.kind==='person'?0:1)-(b.kind==='person'?0:1));
   let aimed=false;
   for(const tg of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await state()).hits.find(h=>h.id===tg.id);if(!now)continue;await tap(now);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}
   let s=await state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   s=await state();await page.getByTestId('confirm').click();await page.mouse.move(2,2);
   const r=await wait(x=>x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
   sent=true;break;}
  if(!sent){await esc();await wait(x=>x.turn!==s0.turn||x.over||x.eliminated,60000,'turn without a playable card');}
  // The round's sequence: the one with a death (FFA) or the outcome (duel) is captured, the others are skipped.
  let s=null;try{s=await wait(x=>x.stats.sequencePlans.length>plans&&x.sequence.running,6000,'sequence');}catch{const x=await state();rec.log.push({turn:x?.turn,noSequence:true,over:x?.over,eliminated:x?.eliminated,plans:x?.stats.sequencePlans.length,ends:x?.stats.sequenceEnds.slice(-2)});continue;}
  const plan=s.stats.sequencePlans.at(-1),em=s.stats.emphasis.filter(e=>e.key===plan.key),died=em.filter(e=>e.kind==='died').map(e=>e.seat);
  const wanted=mode==='ffa'?died.length>0:em.some(e=>e.kind==='outcome');rec.log.push({turn:s.turn,key:plan.key,emphasis:em,wanted});
  if(!wanted){await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Salta effetti'}).click();continue;}
  const P=plan.pace,seatId=died[0]??null;rec.found={key:plan.key,turn:s.turn,died,outcome:em.find(e=>e.kind==='outcome')?.text??null,eliminatedMe:s.eliminated,over:s.over,tail:P.tail.at,total:P.total};
  for(const [name,at] of [['coda-250',P.tail.at-250],['coda+350',P.tail.at+350],['fine+400',P.total+400]]){
   const left=await page.evaluate(ms=>{const p=window.__bm.state.stats.sequencePlans.at(-1);return p.started+ms-performance.now();},at);if(left>0)await page.waitForTimeout(left);
   const file=`c4-12-${tag}-${name}.jpg`;await page.screenshot({path:join(out,file),type:'jpeg',quality:70});
   const st=await state(),seat=seatId?st.hits.find(h=>h.id===`person-${seatId}`):null;let crop=null;
   if(seat){crop=`c4-12-${tag}-${name}-posto.jpg`;const w=seat.w*1.6,h=seat.h*1.4;await page.screenshot({path:join(out,crop),type:'jpeg',quality:75,clip:{x:Math.max(0,seat.x-w/2),y:Math.max(0,seat.y-h/2),width:Math.min(w,vw),height:Math.min(h,vh)}});}
   const dom=await page.evaluate(()=>({panel:document.querySelector('.outcome h2')?.textContent??null,hint:document.querySelector('.hint')?.textContent??null}));
   const t=await page.evaluate(()=>{const p=window.__bm.state.stats.sequencePlans.at(-1);return Math.round(performance.now()-p.started);});
   rec.moments.push({name,at:Math.round(at),t,running:st.sequence.running,panel:dom.panel,hint:dom.hint,file,crop});log(tag,name,t,'panel',dom.panel,'running',st.sequence.running);}}
 // Leave the game, so that the next run starts from the hub.
 try{await esc();await page.waitForTimeout(300);const s=await state();
  if(s?.over||s?.eliminated){await page.locator('.outcome').waitFor({timeout:25000});await page.getByRole('button',{name:'Torna all’hub'}).first().click();}
  else{await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
  await page.getByTestId('quick').waitFor({timeout:15000});}catch(e){evidence.errors.push(`${tag}: leave ${e}`);}
 await context.close();
}
try{for(const mode of modes){try{await run(mode);}catch(e){evidence.errors.push(String(e?.stack??e));log('ERROR',String(e));}}}
finally{log('done',out,evidence.errors.length,'errors');await finish(0);}

// C4-7-ter: outcome at panel, including immediate exit and reduced-motion panels without a sequence.
// The prior wait/tapAll/tapCross/skip/resize paths remain covered. The outcome no longer waits for a cue.
// C4-7-bis: the outcome sound on real games. Quick 1v1 between devAlice and devBob on its own temporary server (port 8080 free,
// Serve running on 4320), so that every game gives a win and a loss. In the final round each side does one thing: lets the
// sequence run (wait), taps the empty table until the end (tapAll), taps once just before the cue (tapCross), presses «Salta
// effetti» (skip) or resizes the window (resize) before the cue. The sounds are counted by the audio probe
// (NODE_OPTIONS=--import=./tools/verify-audio-probe.mjs, BM_AUDIO_PROBE=on, BM_AUDIO_LOG) and checked by check-audio-probe.mjs.
// Prints and writes its evidence (BM_OUT); fails on a table error, a sequence that does not end as its action says, or no win seen.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';
import assert from 'node:assert/strict';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320',out=process.env.BM_OUT??'../docs/reports/client-c4/c4-7-bis/fase-b/esito';
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`${vw}x${vh}`;
const plan=(process.env.BM_OUTCOME_MODES??'wait/tapAll,tapCross/skip,resize/exit,reduced/reduced').split(',').map(x=>x.split('/'));
await mkdir(out,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:tag,kind:'automated browser run on PC (Edge via Playwright), quick 1v1 between two accounts on a temporary database; not a physical device',games:[],errors:[]};
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar',data=await mkdtemp(join(tmpdir(),'bm-outcome-audio-')),api='http://127.0.0.1:8080';
if(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error('port 8080 is in use: stop the other server first');
const log=createWriteStream(join(data,'server.log'));
const server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true','--server.port=8080'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
server.stdout.pipe(log);server.stderr.pipe(log);
let browser=null;
const stop=async code=>{try{await writeFile(`${out}/outcome-audio-${tag}.json`,JSON.stringify(evidence,null,1));}catch{}try{await browser?.close();}catch{}
 if(server.exitCode===null){try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}}process.exit(code);};
const timer=setTimeout(()=>{evidence.errors.push('global timeout');void stop(2);},45*60000);
try{
 for(let end=Date.now()+90000;;){if(server.exitCode!==null)throw new Error(`server exited; log in ${data}`);if(Date.now()>end)throw new Error('server did not start in 90 s');
  try{const r=await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
 const open=async(user,password)=>{const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();const p={user,page};
  page.on('pageerror',e=>evidence.errors.push(`${user}: ${e}`));
  p.state=()=>page.evaluate(()=>window.__bm?.state??null);
  p.wait=async(pred,ms,what)=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(80);}throw new Error(`${user}: timeout ${what}`);};
  await page.goto(`${url}#/accedi`);await page.getByLabel('Nome').fill(user);await page.getByLabel('Password').fill(password);
  await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});return p;};
 const A=await open('devAlice','local-alice'),B=await open('devBob','local-bob');
 const dialogOpen=p=>p.page.evaluate(()=>!!document.querySelector('dialog[open]'));
 // One move through the UI, as playOne in verify-resolution.mjs (cards in hand order, object targets first).
 async function playOne(p){const {page}=p,esc=()=>page.keyboard.press('Escape');
  const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen(p)){await esc();await page.waitForTimeout(60);}};
  const start=await p.state();
  for(const card of start.order){const own=(await p.state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await p.state()).selected!==card.key)continue;
   let aimed=false;const targets=(await p.state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
   for(const t of targets){if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const n=(await p.state()).hits.find(h=>h.id===t.id);if(!n)continue;await tap(n);if((await p.state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}const s=await p.state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}await page.getByTestId('confirm').click();
   const r=await p.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}return card.name;}
  throw new Error(`${p.user}: no playable card`);}
 const empty=async p=>{const st=await p.state();for(let y=vh*.12;y<vh*.6;y+=vh*.04)for(let x=vw*.25;x<vw*.8;x+=vw*.04){
  if(st.hits.some(h=>Math.abs(x-h.x)<h.w/2+6&&Math.abs(y-h.y)<h.h/2+6))continue;if(await p.page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.tagName==='CANVAS',[x,y]))return {x,y};}return null;};
 // Waits until `ms` of the final sequence have passed on the page clock.
 const until=async(p,ms)=>{const d=await p.page.evaluate(ms=>{const plan=window.__bm.state.stats.sequencePlans.at(-1);return plan.started+ms-performance.now();},ms);if(d>0)await p.page.waitForTimeout(d);};
 async function final(p,mode){const s=await p.state(),last=s.stats.sequencePlans.at(-1),key=last?.key??null,row={user:p.user,mode,key,result:s.winner==='NONE'?'draw':s.winner===p.user?'win':'loss',running:s.sequence.running,cue:last?.cue??null,total:last?.total??null};
  assert.ok(await p.page.locator('.outcome').isVisible(),'outcome panel visible');
  if(mode==='exit'){await p.page.getByTestId('again').click();row.note='left immediately after panel';return row;}
  if(mode==='reduced'){assert.equal(s.sequence.running,false,'reduced motion: outcome without sequence');row.note='live panel without sequence';return row;}
  if(!s.sequence.running){row.note='sequence already over';return row;}
  const cueAt=last.cues?.[0]?.at??0;
  if(mode==='wait')await p.page.waitForTimeout(last.total+1500);
  if(mode==='tapAll'){let taps=0;for(;taps<40;taps++){if(!(await p.state()).sequence.running)break;const e=await empty(p);if(!e)break;await p.page.mouse.click(e.x,e.y);await p.page.waitForTimeout(120);}row.taps=taps;await p.page.waitForTimeout(2500);}
  if(mode==='tapCross'){await until(p,Math.max(0,cueAt-150));const e=await empty(p);await p.page.mouse.click(e.x,e.y);row.tapAt=await p.page.evaluate(()=>{const plan=window.__bm.state.stats.sequencePlans.at(-1);return Math.round(performance.now()-plan.started);});await p.page.waitForTimeout(last.total+1500);}
  if(mode==='skip'){await until(p,Math.min(300,cueAt/2));await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Salta effetti'}).click();await p.page.waitForTimeout(2500);}
  if(mode==='resize'){await until(p,Math.min(300,cueAt/2));await p.page.setViewportSize({width:vw,height:vh-60});await p.page.waitForTimeout(2500);await p.page.setViewportSize({width:vw,height:vh});await p.page.waitForTimeout(800);}
  const end=(await p.state()).stats.sequenceEnds.filter(e=>e.key===key).at(-1)??null;row.end=end;
  const want={wait:'complete',tapAll:'input',skip:'skip',resize:'resize'}[mode];
  if(want)assert.equal(end?.reason,want,`${p.user} ${mode}: end ${JSON.stringify(end)}`);
  return row;}
 for(const [i,[ma,mb]] of plan.entries()){
  for(const [p,mode] of [[A,ma],[B,mb]])await p.page.emulateMedia({reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  for(const p of [A,B]){if(i===0){await p.page.getByRole('radio',{name:'Uno contro uno'}).click();await p.page.getByTestId('quick').click();}}
  await Promise.all([A,B].map(p=>p.wait(x=>x&&!x.over&&x.hits.some(h=>h.kind==='hand'),60000,'table')));
  let turns=0;
  for(;;){const ss=await Promise.all([A,B].map(p=>p.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),120000,'turn')));if(ss.some(s=>s.over))break;
   // devAlice lets each sequence end before choosing; devBob chooses at once (the choice ends his sequence, rule 4).
   await Promise.all([(async()=>{await A.wait(x=>x.over||!x.sequence.running,30000,'sequence');if(!(await A.state()).over)await playOne(A);})(),playOne(B)]);
   const turn=ss[0].turn;await Promise.all([A,B].map(p=>p.wait(x=>!x||x.over||x.turn!==turn,60000,'resolved')));turns++;}
  const rows=await Promise.all([final(A,ma),final(B,mb)]);evidence.games.push({game:i+1,turns,rows});console.log(JSON.stringify({game:i+1,turns,rows:rows.map(r=>({user:r.user,mode:r.mode,result:r.result,cue:r.cue?.kind,end:r.end?.reason}))}));
  await writeFile(`${out}/outcome-audio-${tag}.json`,JSON.stringify(evidence,null,1));
  if(i<plan.length-1){for(const [p,mode] of [[A,ma],[B,mb]])if(mode!=='exit')await p.page.getByTestId('again').click();}}
 assert.deepEqual(evidence.errors,[],'page errors');
 assert.ok(evidence.games.some(g=>g.rows.some(r=>r.result==='win'&&r.running)),'at least one win with its sequence');
 await stop(0);
}catch(e){evidence.errors.push(String(e?.stack??e));console.error(e);await stop(1);}

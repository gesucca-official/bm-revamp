// C4-7-bis Fase A: diagnostic probe, not part of the repository. Real 1vCom games (devAlice) on a temporary
// server and the built client; in the final round of each game one action is applied, and every
// HTMLMediaElement.play call is logged with the page clock. Usage: node outcome-probe.mjs <outDir>
import {chromium} from 'file:///E:/bm/client-web/node_modules/@playwright/test/index.mjs';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,writeFile,readFile,mkdir} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const repo='E:/bm',client=join(repo,'client-web'),out=process.argv[2];await mkdir(out,{recursive:true});
const modes=(process.env.MODES??'wait,tapAll,tapTail,resize,blur,again').split(',');
const [vw,vh]=(process.env.VIEWPORT??'1366x768').split('x').map(Number);
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const node=join(repo,'.tools/client-c0/node-v24.13.0-win-x64/node.exe');
const data=await mkdtemp(join(tmpdir(),'bm-outcome-probe-'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let server=null,preview=null,browser=null;const result={date:new Date().toISOString(),viewport:`${vw}x${vh}`,jar:'server/target/bm-server-0.0.1-SNAPSHOT.jar (built 2026-11-06 11:35, rules 1.11)',games:[],errors:[]};
const kill=p=>{if(!p||p.exitCode!==null)return;try{execFileSync('taskkill',['/PID',String(p.pid),'/T','/F'],{stdio:'ignore'});}catch{p.kill('SIGKILL');}};
const timer=setTimeout(()=>{result.errors.push('global timeout');finish(2);},40*60000);
async function finish(code){clearTimeout(timer);try{await writeFile(join(out,`outcome-probe-${vw}x${vh}.json`),JSON.stringify(result,null,1));}catch{}try{await browser?.close();}catch{}kill(server);kill(preview);process.exit(code);}
try{
 const log=createWriteStream(join(data,'server.log'));
 server=spawn(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local','--app.dev.seed-accounts=true','--server.port=8080'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 preview=spawn(node,['node_modules/vite/bin/vite.js','preview'],{cwd:client,stdio:'ignore'});
 for(let end=Date.now()+90000;;){if(Date.now()>end)throw Error('server/preview not up');
  try{const r=await fetch('http://127.0.0.1:8080/api/rest/v1/sign-in/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});const q=await fetch('http://127.0.0.1:4320/');if(r.ok&&q.ok)break;}catch{}await sleep(500);}
 browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:vw,height:vh}});
 page.on('pageerror',e=>result.errors.push(String(e)));
 await page.addInitScript(()=>{window.__plays=[];window.__panels=[];const orig=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){let running=null;try{running=window.__bm?.state?.sequence?.running??null;}catch{}window.__plays.push({t:Math.round(performance.now()),file:(this.currentSrc||this.src).split('/').pop(),muted:this.muted,running});return orig.call(this);};
  let had=false;new MutationObserver(()=>{const has=!!document.querySelector('.outcome');if(has&&!had)window.__panels.push(Math.round(performance.now()));had=has;}).observe(document,{subtree:true,childList:true});});
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const now=()=>page.evaluate(()=>Math.round(performance.now()));
 const wait=async(pred,ms,what)=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(await pred(s))return s;await page.waitForTimeout(80);}throw Error(`timeout ${what}`);};
 const dialogOpen=()=>page.evaluate(()=>!!document.querySelector('dialog[open]'));
 const esc=()=>page.keyboard.press('Escape');
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await esc();await page.waitForTimeout(60);}};
 const empty=async()=>{const st=await state();for(let y=vh*.12;y<vh*.6;y+=vh*.04)for(let x=vw*.25;x<vw*.8;x+=vw*.04){
  if(st.hits.some(h=>Math.abs(x-h.x)<h.w/2+6&&Math.abs(y-h.y)<h.h/2+6))continue;if(await page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.tagName==='CANVAS',[x,y]))return {x,y};}return null;};
 // Same move search as verify-resolution playOne (without the SEND count).
 async function playOne(){const start=await state();
  for(const card of start.order){const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   let aimed=false;const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
   for(const t of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const n=(await state()).hits.find(h=>h.id===t.id);if(!n)continue;await tap(n);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}const s=await state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   await page.getByTestId('confirm').click();
   const r=await wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}return s.turn;}
  throw Error('no playable card');}
 await page.goto('http://127.0.0.1:4320/#/accedi');await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});
 await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();
 for(const mode of modes){
  const game={mode,startAt:await now()};
  await wait(x=>x&&!x.over&&x.hits.some(h=>h.kind==='hand'),30000,'table');
  let s;for(;;){s=await wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),300000,'turn');if(s.over)break;
   const turn=await playOne();s=await wait(x=>!x||x.over||x.eliminated||x.turn!==turn,120000,'resolved');if(s.over)break;}
  const seen=await now(),panelAt=(await page.evaluate(()=>window.__panels.at(-1)))??null;
  const plan=s.stats.sequencePlans.at(-1);
  Object.assign(game,{turn:s.turn,winner:s.winner,me:s.me,result:s.winner==='NONE'?'draw':s.winner===s.me?'win':'loss',panelAt,detectedAt:seen,runningAtDetection:s.sequence.running,
   plan:plan&&{key:plan.key,total:plan.pace.total,tail:plan.pace.tail,moves:plan.pace.moves.map(m=>({at:m.at,flight:m.flight,target:m.target,changes:m.changes}))},emphasis:s.stats.emphasis.filter(e=>e.key===plan?.key)});
  const at=async ms=>{const d=panelAt+ms-(await now());if(d>0)await page.waitForTimeout(d);};
  game.actions=[];
  if(mode==='wait')await page.waitForTimeout(25000);
  if(mode==='tapAll'){for(let i=0;i<30;i++){const st=await state();if(!st.sequence.running)break;const p=await empty();if(!p){game.actions.push('no empty spot');break;}await page.mouse.click(p.x,p.y);game.actions.push({tap:await now()});await page.waitForTimeout(60);}await page.waitForTimeout(3000);}
  if(mode==='tapTail'){await at(plan.pace.tail.at+150);const p=await empty();await page.mouse.click(p.x,p.y);game.actions.push({tap:await now()});await page.waitForTimeout(3000);}
  if(mode==='resize'){await at(1500);await page.setViewportSize({width:vw,height:vh-60});game.actions.push({resize:await now()});await page.waitForTimeout(25000);await page.setViewportSize({width:vw,height:vh});}
  if(mode==='blur'){await at(1500);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));game.actions.push({blur:await now()});await page.waitForTimeout(25000);}
  if(mode==='again'){await at(1500);await page.getByTestId('again').click();game.actions.push({again:await now()});await page.waitForTimeout(12000);}
  const end=await state();game.sequenceEnd=end?.stats?.sequenceEnds?.filter(e=>e.key===plan?.key)??'table replaced';
  game.plays=(await page.evaluate(()=>window.__plays)).filter(p=>p.t>=game.startAt);
  game.finalRound=game.plays.filter(p=>p.t>=panelAt-50);
  game.outcomePlays=game.finalRound.filter(p=>!p.muted&&p.file==='confirmation_002.ogg').map(p=>({...p,afterPanelMs:p.t-panelAt}));
  game.impactPlaysFinal=game.finalRound.filter(p=>!p.muted&&p.file==='drop_004.ogg').length;
  result.games.push(game);console.log(JSON.stringify({mode,result:game.result,total:game.plan?.total,tailAt:game.plan?.tail?.at,outcome:game.outcomePlays,ends:game.sequenceEnd}));
  await writeFile(join(out,`outcome-probe-${vw}x${vh}.json`),JSON.stringify(result,null,1));
  if(mode!=='again'){await page.getByTestId('again').click();}
 }
 await finish(0);
}catch(e){result.errors.push(String(e?.stack??e));console.error(e);await finish(1);}

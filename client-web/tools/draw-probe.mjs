// C4-8b, option 0 chosen by the owner on 11 November 2026 («Misura, poi sfocature»): a MEASUREMENT tool, not a check. It changes no
// threshold and asserts nothing about the game; it only says where the time of the table goes and where the isolated long frames fall.
// Like VerifyLayout it starts the server on a temporary database (port 8080 free, ./client-web/run.ps1 -Task Serve running, jar built)
// and plays the duel (quick 1vCom) and the five-seat FFA through the UI. For each measured turn (choosing, sending, the whole sequence):
//  - every animation frame from a wrapper of requestAnimationFrame installed before the page (frame time, sum of the callbacks);
//  - the same frame intervals of the scene (window.__bm.measureStart/End), so the numbers compare with VerifyLayout;
//  - a CPU profile of the page (Chrome DevTools Protocol, sampling every BM_SAMPLE_US µs, default 200), aligned with the page clock by
//    a named busy mark; each long frame (over BM_LONG_MS, default 50) gets the functions on the stack while it ran.
// Environment: BM_VIEWPORT (default 1366x768), BM_OUT (default %TEMP%/bm-draw-probe), BM_TURNS (default 2), BM_SCENARIOS=duel,ffa.
// Names: the production build keeps class methods (draw, card, beginSequence) but renames local functions; to read them, build without
// minification into a temporary folder (vite build --minify false --outDir <tmp>) and serve it on 4320 (vite preview --outDir <tmp>):
// declared as a different build, for attribution only. BM_KEEP_PROFILES=1 also writes the .cpuprofile of each turn.
// Exit code 0 when the measurement ran, 1 when the tool failed (never because of a number). Edge on a PC: says nothing about an iPhone.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??join(tmpdir(),'bm-draw-probe');
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number);
const TURNS=Number(process.env.BM_TURNS??2),LONG=Number(process.env.BM_LONG_MS??50),SAMPLE=Number(process.env.BM_SAMPLE_US??200);
const scenarios=(process.env.BM_SCENARIOS??'duel,ffa').split(',');
await mkdir(out,{recursive:true});
const say=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);

// Our scene's methods (class methods keep their names in the production build) and the runtime's buckets.
const KEYS=['draw','frame','face','card','back','board','text','halo','drawAim','tick','guideTick','render','destroy','beginSequence','pop','finish','stopEffects','applyFilter','(garbage collector)'];

const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-draw-probe-'));
const serverPort=process.env.BM_SERVER_PORT??'8080',api=`http://127.0.0.1:${serverPort}`;
let server=null,browser=null;
async function startServer(){
 const log=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true',`--server.port=${serverPort}`],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 const end=Date.now()+90000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited (${server.exitCode}); log in ${data}`);
  try{const r=await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start in 90 s');
}
async function stopServer(){
 if(!server||server.exitCode!==null)return;
 const gone=new Promise(r=>server.once('exit',r));
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}
 await gone;server=null;
}

// Installed before the page: every rAF callback with its frame time and duration, and the mark that aligns the profile.
const INIT=()=>{
 const P=window.__probe={on:false,raf:[]};const orig=window.requestAnimationFrame.bind(window);
 window.requestAnimationFrame=cb=>orig(t=>{const s=performance.now();try{cb(t);}finally{if(P.on)P.raf.push([t,s,performance.now()-s]);}});
 window.__probeMark=function __probeMark(){const s=performance.now();while(performance.now()-s<8){}return s;};
};

async function open(){
 const context=await browser.newContext({viewport:{width:vw,height:vh},hasTouch:true}),page=await context.newPage();
 await page.addInitScript(INIT);
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const p={page,context,errors,cdp:await context.newCDPSession(page)};
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`timeout ${what}`);};
 return p;
}
async function login(p){
 await p.page.goto(`${url}#/accedi`);
 await p.page.getByLabel('Nome').fill('devAlice');await p.page.getByLabel('Password').fill('local-alice');
 await p.page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await p.page.getByTestId('quick').waitFor({timeout:15000});
}
const dialogOpen=p=>p.page.evaluate(()=>!!document.querySelector('dialog[open]'));
const list=async p=>(await p.page.locator('[data-testid=ffa-list] li:not(.free)').allInnerTexts()).length;
const waitList=(p,n)=>p.page.waitForFunction(n=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length===n,n,{timeout:10000});
// Same move through the UI as VerifyLayout and VerifyAim: the first card the server accepts, taps on card, target and discard.
async function playOne(p){
 const {page}=p,esc=()=>page.keyboard.press('Escape');
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen(p)){await esc();await page.waitForTimeout(60);}};
 const start=await p.state();
 for(const card of start.order){
  const own=(await p.state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await p.state()).selected!==card.key)continue;
  let aimed=false;
  const targets=(await p.state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
  for(const t of targets){if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await p.state()).hits.find(h=>h.id===t.id);if(!now)continue;await tap(now);if((await p.state()).target){aimed=true;break;}}
  if(!aimed){await esc();continue;}
  const s=await p.state();
  if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
  await page.getByTestId('confirm').click();
  const r=await p.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
  return card.name;
 }
 throw new Error('no playable card');
}

// Leave the table as VerifyLayout does, so the next scenario starts from the hub.
async function leave(p){
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(100);const s=await p.state();
 if(s?.over&&await p.page.getByRole('button',{name:'Torna all’hub'}).count()){await p.page.getByRole('button',{name:'Torna all’hub'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
 else{await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
}

// Profile analysis: sample times in page milliseconds (aligned on the mark), stacks by function name.
function analyse(profile,markAt,raf){
 const byId=new Map(profile.nodes.map(n=>[n.id,n])),parent=new Map();for(const n of profile.nodes)for(const c of n.children??[])parent.set(c,n.id);
 const name=n=>n.callFrame.functionName||`(anonymous ${n.callFrame.url.split('/').pop()}:${n.callFrame.lineNumber})`;
 const stackOf=new Map();const stack=id=>{if(stackOf.has(id))return stackOf.get(id);const s=[];for(let x=id;x!=null;x=parent.get(x))s.push(name(byId.get(x)));stackOf.set(id,s);return s;};
 let t=profile.startTime;const samples=profile.samples.map((id,i)=>{t+=profile.timeDeltas[i];return {id,us:t};});
 const marks=samples.filter(s=>stack(s.id).includes('__probeMark'));
 if(!marks.length)throw new Error('profile alignment mark not sampled');
 // The mark busy-loops 8 ms from markAt: its samples' midpoint is markAt+4.
 const mid=(marks[0].us+marks.at(-1).us)/2/1000,offset=mid-(markAt+4);
 const ms=samples.map((s,i)=>({...s,at:s.us/1000-offset,dt:(profile.timeDeltas[i+1]??SAMPLE)/1000}));
 const window=(a,b)=>{const self=new Map(),incl=new Map();let total=0;
  for(const s of ms){if(s.at<a||s.at>=b)continue;const st=stack(s.id);total+=s.dt;const top=st[0];if(top!=='(idle)'&&top!=='(program)')self.set(top,(self.get(top)??0)+s.dt);
   for(const k of new Set(st))if(KEYS.includes(k)||/Filter|Blur/i.test(k))incl.set(k,(incl.get(k)??0)+s.dt);}
  const r=m=>Object.fromEntries([...m].sort((x,y)=>y[1]-x[1]).map(([k,v])=>[k,+v.toFixed(1)]));
  // The longest stretch without samples that overlaps the window, with the stack of the sample before it: a thread blocked outside
  // JavaScript (a synchronous GPU call, a texture upload, the compositor) shows as a hole in the sampling, not as a function.
  let hole=null;for(const s of ms){if(s.at+s.dt<a||s.at>=b)continue;if(!hole||s.dt>hole.ms)hole={ms:+s.dt.toFixed(1),at:+(s.at-a).toFixed(1),stack:stack(s.id).slice(0,10)};}
  const inside=ms.filter(s=>s.at>=a&&s.at<b);
  return {hole,samples:inside.length,firstAt:inside.length?+(inside[0].at-a).toFixed(1):null,lastAt:inside.length?+(inside.at(-1).at-a).toFixed(1):null,windowMs:+(b-a).toFixed(1),sampledMs:+total.toFixed(1),idleMs:+[...ms].filter(s=>s.at>=a&&s.at<b&&stack(s.id)[0]==='(idle)').reduce((x,s)=>x+s.dt,0).toFixed(1),self:Object.fromEntries(Object.entries(r(self)).slice(0,12)),inclusive:r(incl)};};
 // Frames: the distinct rAF frame times; the interval to the previous frame, and the callbacks run in it.
 const frames=[];for(const [ft,s,d] of raf){const f=frames.at(-1);if(f&&f.t===ft){f.cb+=d;f.end=Math.max(f.end,s+d);}else frames.push({t:ft,start:s,end:s+d,cb:d});}
 // A long interval is measured between callback starts (as the scene's own frame intervals); the time that matters is the stretch
 // between the end of the previous frame's callbacks and the start of the late one: the main thread was busy outside the rAF callbacks.
 const long=[];for(let i=1;i<frames.length;i++){const gap=frames[i].start-frames[i-1].start;if(gap>LONG){const a=frames[i-1].end,b=frames[i].start;long.push({at:+(a-frames[0].start).toFixed(0),gapMs:+gap.toFixed(1),lateMs:+(frames[i].start-frames[i].t).toFixed(1),callbacksBeforeMs:+frames[i-1].cb.toFixed(1),callbacksAfterMs:+frames[i].cb.toFixed(1),...window(a,b)});}}
 const all=window(frames[0]?.start??0,frames.at(-1)?.end??0);
 return {alignmentSamples:marks.length,frames:frames.length,long,whole:all,callbacks:{p95:q(frames.map(f=>f.cb),.95),max:q(frames.map(f=>f.cb),1)}};
}
const q=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s.length?+s[Math.min(s.length-1,Math.floor(s.length*p))].toFixed(1):null;};

async function scenario(name,ffa){
 const A=await open();await login(A);const rec={ffa,turns:[]};
 try{
  if(ffa){await A.page.getByRole('radio',{name:'Tutti contro tutti'}).click();await A.page.getByTestId('quick').click();await A.page.getByTestId('ffa-list').waitFor({timeout:10000});await waitList(A,1);
   for(let i=0;i<4;i++){const before=await list(A);await A.page.getByTestId('add-computer').click();if(before+1<5)await waitList(A,before+1);}}
  else{await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();}
  await A.wait(x=>x&&x.hits.some(h=>h.kind==='hand'||h.id.startsWith('person-')),30000,'table');
  await A.cdp.send('Profiler.enable');await A.cdp.send('Profiler.setSamplingInterval',{interval:SAMPLE});
  for(let t=0;t<TURNS;t++){
   const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),60000,'turn');
   if(s.over||s.eliminated)break;
   const counts=await A.page.evaluate(()=>({hits:window.__bm.state.hits.length,players:window.__bm.state.players.length}));
   await A.cdp.send('Profiler.start');
   const markAt=await A.page.evaluate(()=>{window.__probe.raf=[];window.__probe.on=true;window.__bm.measureStart();return window.__probeMark();});
   const card=await playOne(A);
   await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,40000,'resolved');
   await A.wait(x=>!x||!x.sequence.running,30000,'sequence end');
   const page=await A.page.evaluate(()=>{window.__probe.on=false;const st=window.__bm.measureEnd();return {raf:window.__probe.raf,frames:st.frames,inputMs:st.inputMs};});
   const {profile}=await A.cdp.send('Profiler.stop');
   const fr=[...page.frames].sort((a,b)=>a-b),limit=vw<1000?33:20;
   const scene={intervals:fr.length,p95:q(fr,.95),max:q(fr,1),within:fr.length?+(fr.filter(x=>x<=limit).length/fr.length).toFixed(3):null,limit,inputMax:page.inputMs.length?+Math.max(...page.inputMs).toFixed(1):null,inputs:page.inputMs.length,inputP95:q(page.inputMs,.95)};
   const r={turn:s.turn,card,...counts,scene,...analyse(profile,markAt,page.raf)};rec.turns.push(r);
   say(`${name} ${vw}x${vh} T${s.turn}`,JSON.stringify({scene,long:r.long.map(l=>({at:l.at,gap:l.gapMs,self:Object.entries(l.self).slice(0,4),incl:l.inclusive})),whole:r.whole.inclusive}).slice(0,1800));
   if(process.env.BM_KEEP_PROFILES==='1')await writeFile(join(out,`${name}-${vw}x${vh}-T${s.turn}.cpuprofile`),JSON.stringify(profile));
  }
  await leave(A);
 }finally{if(A.errors.length)rec.errors=A.errors;await A.context.close();}
 return rec;
}

const result={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},sampleUs:SAMPLE,longMs:LONG,kind:'measurement tool (C4-8b option 0): Edge via Playwright on a PC, production build, CPU profile via CDP; not a check, says nothing about an iPhone',scenarios:{}};
let code=0;
try{
 if(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error(`port ${serverPort} is in use: stop the other server first`);
 await startServer();browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
 if(scenarios.includes('duel'))result.scenarios.duel=await scenario('duel',false);
 if(scenarios.includes('ffa'))result.scenarios.ffa=await scenario('ffa',true);
}catch(e){code=1;result.error=String(e?.stack??e);console.error(e);}
finally{
 await writeFile(join(out,`draw-probe-${vw}x${vh}.json`),JSON.stringify(result,null,1));
 try{await browser?.close();}catch{}await stopServer();say(`written ${join(out,`draw-probe-${vw}x${vh}.json`)}`);process.exit(code);
}

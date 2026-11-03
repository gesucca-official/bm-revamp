// C4-1 (O23): one launch for the whole client verification, in series, on a declared build. Tooling only: no game effect.
// Starts and stops only the processes it starts (server on a temporary database, preview of the production build).
// Evidence goes to a temporary folder and is copied to --publish=<dir> only after a complete, green, non-quick run.
// Usage (from client-web, via ./client-web/run.ps1 -Task VerifyAll): see README «Lancio unico».
import {spawn,spawnSync,execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,readFile,writeFile,cp,stat,readdir,rm} from 'node:fs/promises';
import {createWriteStream,existsSync,statSync,readFileSync,unlinkSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createConnection} from 'node:net';
import {tmpdir} from 'node:os';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url)),web=resolve(here,'..'),repo=resolve(web,'..');
const args=process.argv.slice(2);
const flag=n=>args.includes(`--${n}`);
const opt=(n,d)=>{const a=args.find(x=>x.startsWith(`--${n}=`));return a?a.slice(n.length+3):d;};
const quick=flag('quick'),reuseJar=flag('reuse-jar'),reuseClient=flag('reuse-client');
const measures=(opt('measures',quick?'1366x768':'1366x768,844x390')).split(',').filter(Boolean);
const only=opt('only','')?.split(',').filter(Boolean);
const publish=opt('publish','');
const stepTimeoutMin=Number(process.env.BM_STEP_TIMEOUT_MIN??120);
const SERVER_PORT=8080,CLIENT_PORT=4320;
const CAPTURE_BUDGET=Number(process.env.BM_CAPTURE_BUDGET_MB??10)*1024*1024;

// Reduced scenarios of the quick mode (only where the script already has BM_SCENARIOS). NOT equivalent to the consolidation.
const QUICK_SCENARIOS={ffa:'queue,five',aim:'duel,ffa',layout:'duel,ffa',resolution:'quick,reduced'};
// Counters that must be above zero when the evidence has them: a zero means the check ran on nothing. Only warns, never changes a verdict.
const MUST_BE_POSITIVE=['turnsChecked','cardsChecked','boardChecks','unpayableSeen','arrowsDrawn','turnsSeen'];

const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const work=await mkdtemp(join(tmpdir(),`bm-verify-all-${stamp}-`));
const evidence=join(work,'evidence'),logs=join(work,'logs'),evidenceDir=evidence;
await mkdir(evidence,{recursive:true});await mkdir(logs,{recursive:true});

const say=m=>console.log(`[${new Date().toISOString().slice(11,19)}] ${m}`);
const children=new Set();
const killTree=p=>{if(!p||p.exitCode!==null)return;try{execFileSync('taskkill',['/PID',String(p.pid),'/T','/F'],{stdio:'ignore'});}catch{try{p.kill('SIGKILL');}catch{}}};
const portBusy=port=>new Promise(r=>{const s=createConnection({host:'127.0.0.1',port});s.once('connect',()=>{s.destroy();r(true);});s.once('error',()=>r(false));s.setTimeout(1500,()=>{s.destroy();r(false);});});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitFree(port,ms=30000){const end=Date.now()+ms;while(Date.now()<end){if(!await portBusy(port))return true;await sleep(500);}return false;}
process.on('SIGINT',()=>{for(const c of children)killTree(c);process.exit(130);});

// Runs a command with output to a log file; resolves {code,out}. Never throws on a non-zero exit.
function run(cmd,cmdArgs,{cwd=web,env={},log,shell=false,timeoutMin=stepTimeoutMin}={}){
  return new Promise(res=>{
    const file=createWriteStream(join(logs,log),{flags:'a'});let out='';
    const p=spawn(cmd,cmdArgs,{cwd,env:{...process.env,...env},shell,stdio:['ignore','pipe','pipe']});children.add(p);
    const grab=d=>{file.write(d);out=(out+d).slice(-200000);};p.stdout.on('data',grab);p.stderr.on('data',grab);
    const t=setTimeout(()=>{file.write(`\n[verify-all] timeout after ${timeoutMin} min\n`);killTree(p);},timeoutMin*60000);
    p.on('exit',code=>{clearTimeout(t);children.delete(p);file.end();res({code:code??1,out});});
    p.on('error',e=>{clearTimeout(t);children.delete(p);file.end();res({code:1,out:String(e)});});
  });
}

// Self-test of the publication rules only (no verification is run): BM_PUBLISH_SELFTEST=<evidence folder> with --publish=<dir>.
if(process.env.BM_PUBLISH_SELFTEST&&publish){await publishEvidence(resolve(repo,publish),process.env.BM_PUBLISH_SELFTEST);process.exit(0);}
// ---- preconditions ----
// One run at a time: a lock file naming the pid; a lock whose process is gone is stale and replaced.
const lockPath=join(tmpdir(),'bm-verify-all.lock');
if(existsSync(lockPath)){
  const other=Number((await readFile(lockPath,'utf8').catch(()=>''))||0);
  let alive=false;if(other){try{process.kill(other,0);alive=true;}catch{}}
  if(alive){say(`ERROR: another VerifyAll is running (pid ${other}). Not starting a second one.`);process.exit(2);}
}
await writeFile(lockPath,String(process.pid));
process.on('exit',()=>{try{if(existsSync(lockPath)&&Number(readFileSync(lockPath,'utf8'))===process.pid)unlinkSync(lockPath);}catch{}});
if(await portBusy(SERVER_PORT)){say(`ERROR: port ${SERVER_PORT} is in use (not mine, not stopping it). Free it and retry.`);process.exit(2);}
if(!reuseClient&&await portBusy(CLIENT_PORT)){say(`ERROR: port ${CLIENT_PORT} is in use (not mine, not stopping it). Free it, or pass --reuse-client to use that preview as it is.`);process.exit(2);}
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jarPath=join(repo,'server','target','bm-server-0.0.1-SNAPSHOT.jar');

const git=a=>{const r=spawnSync('git',a,{cwd:repo,encoding:'utf8'});return (r.stdout??'').trim();};
const head=git(['rev-parse','HEAD']),dirty=git(['status','--porcelain','--','server','client-web/src','client-web/tools','client-web/package.json','client-web/vite.config.ts']).split('\n').filter(Boolean);

// ---- jar ----
const warnings=[];
if(reuseJar){
  if(!existsSync(jarPath)){say(`ERROR: --reuse-jar but ${jarPath} does not exist.`);process.exit(2);}
  say('jar: REUSED, not rebuilt (declared)');
}else{
  say('jar: rebuilding from source (scripts/build.ps1 -Task Server -Offline) …');
  const b=await run('powershell',['-NoProfile','-File',join(repo,'scripts','build.ps1'),'-Task','Server','-Offline'],{cwd:repo,log:'jar-build.log',timeoutMin:30});
  if(b.code!==0||!existsSync(jarPath)){say(`ERROR: jar build failed (exit ${b.code}); see ${join(logs,'jar-build.log')}`);process.exit(2);}
}
if(!existsSync(jarPath)){say('ERROR: server jar missing.');process.exit(2);}
const jarStat=statSync(jarPath),jarSha=createHash('sha256').update(await readFile(jarPath)).digest('hex').slice(0,16);
async function newestMtime(dir){let m=0;for(const d of await readdir(dir,{withFileTypes:true})){const p=join(dir,d.name);m=Math.max(m,d.isDirectory()?await newestMtime(p):(await stat(p)).mtimeMs);}return m;}
const srcNewest=await newestMtime(join(repo,'server','src'));
if(srcNewest>jarStat.mtimeMs)warnings.push(`STALE JAR: server/src has files newer than the jar (${new Date(srcNewest).toISOString()} > ${jarStat.mtime.toISOString()}); face-of-card checks may pass on nothing.`);
const build={head,dirtyPaths:dirty,jar:{path:'server/target/bm-server-0.0.1-SNAPSHOT.jar',modified:jarStat.mtime.toISOString(),bytes:jarStat.size,sha256_16:jarSha,rebuilt:!reuseJar}};
if(dirty.length)warnings.push(`Working tree has uncommitted changes in verified paths: ${dirty.slice(0,6).join('; ')}`);
say(`build verified: HEAD ${head.slice(0,7)}${dirty.length?' + uncommitted changes':''}, jar ${build.jar.modified} (${jarSha}) ${reuseJar?'REUSED':'rebuilt'}`);
const STANDARD=['1366x768','844x390'],extra=measures.filter(m=>!STANDARD.includes(m));
if(extra.length)say(`*** NON-STANDARD MEASURE (${extra.join(', ')}): declared run, NOT equivalent to the consolidation; nothing is published. ***`);
if(quick)say('*** QUICK MODE: reduced scenarios and one measure. NOT equivalent to the consolidation; nothing is published. ***');

// ---- steps ----
const results=[];
async function hashDir(dir){const h=createHash('sha256');let n=0;
  const walk=async d=>{for(const e of (await readdir(d,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const p=join(d,e.name);if(e.isDirectory())await walk(p);else{h.update(p.slice(dir.length)).update(await readFile(p));n++;}}};
  await walk(dir);return {files:n,sha256_16:h.digest('hex').slice(0,16)};}
const want=n=>!only?.length||only.includes(n);
const node=process.execPath;
async function step(name,measure,cmd,cmdArgs,env={},shell=false){
  if(!want(name))return;
  const t0=Date.now(),tag=`${name}${measure?'-'+measure:''}`;
  say(`▶ ${tag}`);
  const r=await run(cmd,cmdArgs,{env,log:`${tag}.log`,shell});
  const secs=Math.round((Date.now()-t0)/1000);
  const row={name,measure:measure??'—',ok:r.code===0,seconds:secs,exit:r.code,problems:(r.out.match(/^PROBLEM /gm)||[]).length};
  results.push(row);say(`${row.ok?'✔':'✘'} ${tag} (${secs} s${row.ok?'':`, exit ${r.code}, log ${join(logs,tag+'.log')}`})`);
  await scanVacuous(name,measure);
}
// npm through the isolated node (no shell: a shell child prints a deprecation warning on stderr, which breaks PowerShell 5.1)
const npmCli=join(dirname(process.execPath),'node_modules','npm','bin','npm-cli.js');
const npmRun=(script,env={})=>[node,[npmCli,'run',script],env];

// Vacuous-check scan: look in this verification's JSON evidence for the known counters at zero.
async function scanVacuous(name,measure){
  const files=(await readdir(evidence)).filter(f=>f.endsWith('.json')&&(!measure||f.includes(measure))&&f.toLowerCase().includes(({verify:'verify',modes:'modes',lifecycle:'lifecycle',ffa:'ffa',decks:'decks',public:'public',profile:'profile',resolution:'resolution',aim:'aim',layout:'layout'})[name]??'\u0000'));
  for(const f of files){
    let j;try{j=JSON.parse(await readFile(join(evidence,f),'utf8'));}catch{continue;}
    (function walk(o,p){if(o&&typeof o==='object')for(const[k,v]of Object.entries(o)){if(MUST_BE_POSITIVE.includes(k)&&v===0)warnings.push(`VACUOUS? ${f}: ${p}.${k} = 0`);walk(v,`${p}.${k}`);}})(j,'');
    if(j&&j.ok===false)warnings.push(`${f}: evidence says ok=false`);
  }
}

const sizeEnv={BM_OUT:evidence};
const env=m=>({BM_OUT:evidence,BM_VIEWPORT:m});
async function serverUp(){
  const data=await mkdtemp(join(tmpdir(),'bm-verify-all-db-'));
  const log=createWriteStream(join(logs,'shared-server.log'));
  const p=spawn(java,['-jar',jarPath,'--spring.profiles.active=local','--app.dev.seed-accounts=true'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
  children.add(p);p.stdout.pipe(log);p.stderr.pipe(log);
  const end=Date.now()+90000;
  while(Date.now()<end){
    if(p.exitCode!==null)throw new Error(`shared server exited (${p.exitCode})`);
    try{const r=await fetch(`http://127.0.0.1:${SERVER_PORT}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return {p,data};}catch{}
    await sleep(500);
  }
  killTree(p);throw new Error('shared server did not start in 90 s');
}
async function serverDown(s){killTree(s.p);children.delete(s.p);await sleep(500);await rm(s.data,{recursive:true,force:true}).catch(()=>{});}

let preview=null;
try{
  // 1. Test, Build, Size (Size on a copy: BM_OUT, the tracked size.json is left alone)
  await step('test',null,...npmRun('test'));
  await step('build',null,...npmRun('build'));
  await step('size',null,...npmRun('size',sizeEnv));
  build.dist=await hashDir(join(web,'dist')).catch(()=>null);
  if(build.dist)say(`dist verified: ${build.dist.files} files, sha256 ${build.dist.sha256_16}`);

  // 2. preview of the production build just made
  if(!reuseClient){
    say('starting preview of the production build on 4320');
    preview=spawn(node,[npmCli,'run','serve'],{cwd:web,stdio:['ignore','pipe','pipe']});children.add(preview);const pl=createWriteStream(join(logs,'preview.log'));preview.stdout.pipe(pl);preview.stderr.pipe(pl);
    const end=Date.now()+60000;while(Date.now()<end&&!await portBusy(CLIENT_PORT))await sleep(500);
    if(!await portBusy(CLIENT_PORT))throw new Error('preview did not start on 4320');
  }else warnings.push('--reuse-client: the preview on 4320 is not mine; its build is not declared.');

  // 3. verifications that need an external server: ONE server for all measures
  if(want('verify')||want('modes')){
    if(!await waitFree(SERVER_PORT,5000))throw new Error('port 8080 is not free');
    const s=await serverUp();say('shared server up (temporary database, seed accounts)');
    try{for(const m of measures){await step('verify',m,node,['tools/verify.mjs'],env(m));await step('modes',m,node,['tools/verify-modes.mjs'],env(m));}}
    finally{await serverDown(s);say('shared server stopped');}
  }

  // 4. verifications that start their own server (8080 free between them); per measure
  const own=[['lifecycle','verify-lifecycle.mjs'],['ffa','verify-ffa.mjs'],['decks','verify-decks.mjs'],['public','verify-public.mjs'],['profile','verify-profile.mjs'],['resolution','verify-resolution.mjs'],['aim','verify-aim.mjs'],['layout','verify-layout.mjs']];
  for(const m of measures)for(const[n,f]of own){
    if(!want(n))continue;
    if(!await waitFree(SERVER_PORT,30000)){results.push({name:n,measure:m,ok:false,seconds:0,exit:-1,problems:0});say(`✘ ${n}-${m}: port 8080 not free, skipped`);continue;}
    const e=env(m);if(quick&&QUICK_SCENARIOS[n])e.BM_SCENARIOS=QUICK_SCENARIOS[n];
    await step(n,m,node,[`tools/${f}`],e);
  }
}catch(e){say(`ABORT: ${e.message}`);results.push({name:'orchestrator',measure:'—',ok:false,seconds:0,exit:1,problems:0});}
finally{killTree(preview);for(const c of children)killTree(c);}

// ---- table ----
const pad=(s,n)=>String(s).padEnd(n);
const fmt=s=>s>=60?`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} s`:`${s} s`;
console.log(`\n${quick?'*** QUICK MODE — NOT equivalent to the consolidation (reduced scenarios, one measure) ***\n':''}${extra.length?`*** NON-STANDARD MEASURE ${extra.join(', ')} — NOT equivalent to the consolidation ***\n`:''}build: HEAD ${head.slice(0,7)}${dirty.length?' + uncommitted':''} · jar ${build.jar.modified} ${jarSha} ${reuseJar?'(REUSED)':'(rebuilt)'}\n`);
console.log(`${pad('verification',14)}${pad('measure',11)}${pad('result',8)}duration`);
for(const r of results)console.log(`${pad(r.name,14)}${pad(r.measure,11)}${pad(r.ok?'OK':'FAIL',8)}${fmt(r.seconds)}`);
const total=results.reduce((s,r)=>s+r.seconds,0),failed=results.filter(r=>!r.ok);
console.log(`\ntotal ${fmt(total)} · ${results.length-failed.length}/${results.length} green${failed.length?` · FAILED: ${failed.map(r=>`${r.name} ${r.measure}`).join(', ')}`:''}`);
if(warnings.length){console.log('\nWARNINGS (no threshold or expectation was changed):');for(const w of warnings)console.log(' - '+w);}

const complete=!quick&&!only?.length&&!extra.length&&STANDARD.every(m=>measures.includes(m))&&!reuseClient;
const summary={date:new Date().toISOString(),quick,nonStandardMeasures:extra,equivalentToConsolidation:complete&&!reuseJar,measures,only:only??null,build,results,warnings};
await writeFile(join(evidence,'run-summary.json'),JSON.stringify(summary,null,2));
// D13 (C4 plan): final JSON always; only final captures, recompressed, up to about 10 MB per block (an indication, not a threshold); the rest stays in the temporary folder.
async function publishEvidence(dest,evidence=evidenceDir){
  await mkdir(dest,{recursive:true});
  for(const f of await readdir(evidence))if(f.endsWith('.json')||f.endsWith('.md'))await cp(join(evidence,f),join(dest,f));
  const shots=existsSync(join(evidence,'screens'))?(await readdir(join(evidence,'screens'))).filter(f=>/\.(jpe?g|png)$/i.test(f)).sort():[];
  const packed=[];let browser=null;
  try{
    const {chromium}=await import('@playwright/test');
    browser=await chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage();
    for(const f of shots){
      const raw=await readFile(join(evidence,'screens',f));
      const b64=await page.evaluate(async([data,type])=>{const img=new Image();await new Promise((ok,ko)=>{img.onload=ok;img.onerror=ko;img.src=`data:${type};base64,${data}`;});const c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/jpeg',0.55).split(',')[1];},[raw.toString('base64'),/png$/i.test(f)?'image/png':'image/jpeg']);
      const out=Buffer.from(b64,'base64');packed.push({name:f.replace(/\.\w+$/,'.jpg'),data:out.length<raw.length||!/jpe?g$/i.test(f)?out:raw});
    }
  }catch(e){say(`capture recompression unavailable (${e.message}); copying originals within the budget`);packed.length=0;for(const f of shots)packed.push({name:f,data:await readFile(join(evidence,'screens',f))});}
  finally{await browser?.close().catch(()=>{});}
  let used=0,kept=0;await mkdir(join(dest,'screens'),{recursive:true});
  for(const p of packed){if(used+p.data.length>CAPTURE_BUDGET)continue;await writeFile(join(dest,'screens',p.name),p.data);used+=p.data.length;kept++;}
  say(`captures: ${kept} of ${shots.length} kept (${(used/1048576).toFixed(1)} MB, budget about ${CAPTURE_BUDGET/1048576} MB); the rest stays in ${join(evidence,'screens')}`);
  return dest;
}
let published=null;
if(publish){
  if(failed.length||!complete||!results.length)say(`NOT publishing to ${publish}: ${quick?'quick mode':extra.length?'non-standard measure':failed.length?'there are failures':'partial run'}. Evidence stays in ${evidence}`);
  else{published=await publishEvidence(resolve(repo,publish));say(`evidence published to ${published}`);}
}
if(!published)console.log(`\nevidence (temporary, not tracked): ${evidence}\nlogs: ${logs}`);
process.exitCode=failed.length?1:0;

// C4-1c (phase A prototype): parallel mode of verify-all.mjs, only with --parallel=N. Tooling only: no game effect, no check changed.
// Every job runs on its own slot: its own temporary server on its own port (BM_SERVER_PORT), its own preview of the same
// dist on its own port (BM_PORT, proxying to that server through BM_SERVER), its own evidence folder (BM_OUT). Every script is
// launched unchanged; only ports and folders differ. Verifications that measure frames or input (--solo, by default aim and
// layout) run after the pool, one at a time, with nothing else running. --split=resolution,ffa runs one job per scenario of the
// script (BM_SCENARIOS=<one name>, the names read from the script itself so a new scenario cannot be left out) and merges
// the parts into the same JSON file a whole run writes, with every part kept under evidence/parts.
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,cp,readdir} from 'node:fs/promises';
import {createWriteStream,existsSync} from 'node:fs';
import {join} from 'node:path';

const SCRIPTS={lifecycle:'verify-lifecycle.mjs',ffa:'verify-ffa.mjs',decks:'verify-decks.mjs',public:'verify-public.mjs',profile:'verify-profile.mjs',resolution:'verify-resolution.mjs',aim:'verify-aim.mjs',layout:'verify-layout.mjs'};
const EVIDENCE_NAME={lifecycle:'lifecycle',ffa:'ffa',decks:'decks',public:'public',profile:'profile',resolution:'resolution',aim:'aim',layout:'layout'};
// Seconds per job measured on the serial run of 10 November 2026 (docs/reports/client-c4/c4-1c): only the ORDER of the queue
// (longest first), never a limit. Unknown jobs get 120 s.
const ESTIMATE={'verify+modes':205,lifecycle:165,decks:40,public:11,profile:48,ffa:400,resolution:2030,aim:160,layout:155,
  'resolution:quick':210,'resolution:report':160,'resolution:reduced':25,'resolution:interrupt':35,'resolution:info':320,'resolution:infoFfa':290,
  'resolution:infoTouch':290,'resolution:ffa':340,'resolution:jump':60,'resolution:humans':215,'resolution:open':295,
  'ffa:queue':25,'ffa:five':100,'ffa:two':75,'ffa:start':50,'ffa:leave':60,'ffa:timeout':115,'ffa:drop':100};

export async function scenariosOf(web,name){
  const src=await readFile(join(web,'tools',SCRIPTS[name]),'utf8');
  return [...new Set([...src.matchAll(/\brun\('([A-Za-z]+)'\)/g)].map(m=>m[1]))];
}

// Merge of the parts of one split verification at one measure, in the shape of a whole run: objects of the evidence are joined
// key by key (a key written by more than one part is kept from the first part; every part's value is under split.duplicateValues); lists are
// concatenated; ok only if every part is ok. Resolution: the per-case lists and the two summaries computed at the end of the
// script (casesOnRealServer, reportConsistency) are recomputed on the union, with the same rule the script uses.
export function mergeParts(name,parts){
  const merged={},duplicates=[],dupValues={};
  for(const {scenario,json} of parts){
    for(const [k,v] of Object.entries(json)){
      if(['ok','failure'].includes(k))continue;
      if(!(k in merged)){merged[k]=structuredClone(v);continue;}
      if(Array.isArray(v)&&Array.isArray(merged[k])){merged[k].push(...v);continue;}
      if(v&&typeof v==='object'&&merged[k]&&typeof merged[k]==='object'&&!Array.isArray(v)){
        for(const [kk,vv] of Object.entries(v)){
          if(!(kk in merged[k])){merged[k][kk]=structuredClone(vv);continue;}
          if(Array.isArray(vv)&&Array.isArray(merged[k][kk])&&(k==='cases'))merged[k][kk].push(...vv);
          else{duplicates.push(`${k}.${kk} (${scenario})`);(dupValues[`${k}.${kk}`]??={})[scenario]=vv;}
        }
      }
    }
  }
  const failures=parts.filter(p=>p.json.ok!==true).map(p=>({scenario:p.scenario,failure:p.json.failure??'no ok:true in the evidence'}));
  merged.ok=parts.length>0&&failures.length===0;
  if(failures.length)merged.failure=failures.map(f=>`[${f.scenario}] ${f.failure}`).join('\n');
  if(name==='resolution'&&merged.checks){
    const cases=merged.cases??{};
    const wanted=['impactHIT','impactRole','impactVoid','impactCUT','outcomeBanner','void','itemConsumed','itemFromOther','drawnToTable','death','deathWithMove','lethalEndOfTurn','boundDiscard','over','jump','rejoinSame'];
    merged.checks.casesOnRealServer={seen:Object.fromEntries(Object.entries(cases).map(([k,v])=>[k,v.length])),missing:wanted.filter(k=>!cases[k])};
    const rc=parts.map(p=>p.json.reportConsistency).filter(Boolean);
    if(rc.length){merged.reportConsistency={rounds:rc.reduce((s,x)=>s+x.rounds,0),sumOk:rc.reduce((s,x)=>s+x.sumOk,0),chainOk:rc.reduce((s,x)=>s+x.chainOk,0),unknownCost:rc.reduce((s,x)=>s+x.unknownCost,0),failures:rc.flatMap(x=>x.failures)};
      merged.checks.reportConsistency={rounds:merged.reportConsistency.rounds,sumOk:merged.reportConsistency.sumOk,chainOk:merged.reportConsistency.chainOk};}
  }
  merged.split={scenarios:parts.map(p=>p.scenario),parts:parts.map(p=>({scenario:p.scenario,ok:p.json.ok===true,seconds:p.seconds})),duplicates,duplicateValues:dupValues};
  return merged;
}

export async function runParallel(ctx){
  const {N,solo,split,measures,quick,want,QUICK_SCENARIOS,evidence,logs,web,node,say,run,results,warnings,scanVacuous,serverUp,serverDown,children,killTree,portBusy,waitFree,sleep}=ctx;
  const SERVER_BASE=Number(process.env.BM_PARALLEL_SERVER_BASE??18080),CLIENT_BASE=Number(process.env.BM_PARALLEL_CLIENT_BASE??14320);
  const slots=[...Array(N).keys()].map(i=>({i,server:SERVER_BASE+i,client:CLIENT_BASE+i,preview:null}));
  for(const s of slots)for(const p of [s.server,s.client])if(await portBusy(p))throw new Error(`port ${p} (slot ${s.i}) is in use (not mine, not stopping it)`);
  const previews=[];
  try{
    // One preview of the same dist per slot, each proxying to its slot's server port.
    for(const s of slots){
      const p=spawn(node,[ctx.npmCli,'run','serve'],{cwd:web,env:{...process.env,BM_PORT:String(s.client),BM_SERVER:`http://127.0.0.1:${s.server}`},stdio:['ignore','pipe','pipe']});
      children.add(p);previews.push(p);const pl=createWriteStream(join(logs,`preview-slot${s.i}.log`));p.stdout.pipe(pl);p.stderr.pipe(pl);s.preview=p;
    }
    for(const s of slots){const end=Date.now()+60000;while(Date.now()<end&&!await portBusy(s.client))await sleep(300);if(!await portBusy(s.client))throw new Error(`preview of slot ${s.i} did not start on ${s.client}`);}
    say(`parallel: ${N} slots, servers ${slots.map(s=>s.server).join(',')}, previews ${slots.map(s=>s.client).join(',')} (same dist)`);

    // ---- jobs ----
    const jobs=[];
    if(want('verify')||want('modes'))jobs.push({key:'verify+modes',kind:'shared'});
    for(const m of measures)for(const n of ['lifecycle','ffa','decks','public','profile','resolution','aim','layout']){
      if(!want(n)||solo.includes(n))continue;
      const quickSet=quick&&QUICK_SCENARIOS[n]?QUICK_SCENARIOS[n].split(','):null;
      if(split.includes(n)){for(const sc of quickSet??await scenariosOf(web,n))jobs.push({key:`${n}:${sc}`,name:n,measure:m,scenario:sc,kind:'part'});}
      else jobs.push({key:n,name:n,measure:m,kind:'own',scenarios:quickSet?.join(',')});
    }
    jobs.sort((a,b)=>(ESTIMATE[b.key]??120)-(ESTIMATE[a.key]??120));
    const partsDone={};
    const t0=Date.now();
    const runOn=async(job,s)=>{
      const tag=job.kind==='shared'?'verify+modes':`${job.name}-${job.measure}${job.scenario?'.'+job.scenario:''}`;
      const out=join(evidence,'jobs',tag.replace(/[+]/g,'_'));await mkdir(out,{recursive:true});
      const env={BM_OUT:out,BM_CLIENT:`http://127.0.0.1:${s.client}`,BM_SERVER_PORT:String(s.server)};
      if(!await waitFree(s.server,30000)){say(`✘ ${tag}: port ${s.server} not free`);results.push({name:job.name??'verify',measure:job.measure??'—',ok:false,seconds:0,exit:-1,problems:0,slot:s.i});return;}
      if(job.kind==='shared'){
        const srv=await serverUp(s.server);say(`slot ${s.i}: shared server up on ${s.server}`);
        try{for(const m of measures)for(const [n,f] of [['verify','verify.mjs'],['modes','verify-modes.mjs']]){
          if(!want(n))continue;const st=Date.now();say(`▶ ${n}-${m} (slot ${s.i})`);
          const r=await run(node,[`tools/${f}`],{env:{...env,BM_VIEWPORT:m},log:`${n}-${m}.log`});
          const row={name:n,measure:m,ok:r.code===0,seconds:Math.round((Date.now()-st)/1000),exit:r.code,problems:(r.out.match(/^PROBLEM /gm)||[]).length,slot:s.i,startedAt:Math.round((st-t0)/1000)};
          results.push(row);say(`${row.ok?'✔':'✘'} ${n}-${m} (${row.seconds} s, slot ${s.i})`);}}
        finally{await serverDown(srv);}
        return;
      }
      const e={...env,BM_VIEWPORT:job.measure};if(job.scenario)e.BM_SCENARIOS=job.scenario;else if(job.scenarios)e.BM_SCENARIOS=job.scenarios;
      const st=Date.now();say(`▶ ${tag} (slot ${s.i})`);
      const r=await run(node,[`tools/${SCRIPTS[job.name]}`],{env:e,log:`${tag}.log`});
      const secs=Math.round((Date.now()-st)/1000);
      if(job.kind==='part'){(partsDone[`${job.name}@${job.measure}`]??=[]).push({scenario:job.scenario,out,code:r.code,seconds:secs,problems:(r.out.match(/^PROBLEM /gm)||[]).length,slot:s.i,startedAt:Math.round((st-t0)/1000)});say(`${r.code===0?'✔':'✘'} ${tag} (${secs} s, slot ${s.i})`);return;}
      const row={name:job.name,measure:job.measure,ok:r.code===0,seconds:secs,exit:r.code,problems:(r.out.match(/^PROBLEM /gm)||[]).length,slot:s.i,startedAt:Math.round((st-t0)/1000)};
      results.push(row);say(`${row.ok?'✔':'✘'} ${tag} (${secs} s, slot ${s.i})`);
    };
    const queue=[...jobs];
    await Promise.all(slots.map(async s=>{while(queue.length){const job=queue.shift();await runOn(job,s);}}));
    const poolSeconds=Math.round((Date.now()-t0)/1000);say(`pool done in ${poolSeconds} s`);

    // ---- solo phase: nothing else runs (frames and input are measured): the other slots' previews are stopped and the machine
    // gets BM_SOLO_SETTLE_S seconds (15) to finish closing the pool's servers and browsers before the first measure ----
    for(const s of slots.slice(1))killTree(s.preview);
    await sleep(Number(process.env.BM_SOLO_SETTLE_S??15)*1000);
    const t1=Date.now();
    for(const m of measures)for(const n of solo){if(!want(n))continue;const e=quick&&QUICK_SCENARIOS[n]?{scenarios:QUICK_SCENARIOS[n]}:{};await runOn({key:n,name:n,measure:m,kind:'own',...e},slots[0]);}
    const soloSeconds=Math.round((Date.now()-t1)/1000);

    // ---- collect: whole jobs copied as they are, split jobs merged; screens into one folder ----
    await mkdir(join(evidence,'screens'),{recursive:true});
    const jobsDir=join(evidence,'jobs');
    for(const d of existsSync(jobsDir)?await readdir(jobsDir):[]){
      const dir=join(jobsDir,d),isPart=d.includes('.');
      for(const f of await readdir(dir)){
        if(f==='screens'){for(const sf of await readdir(join(dir,f))){let dest=join(evidence,'screens',sf);if(existsSync(dest))dest=join(evidence,'screens',`${d}--${sf}`);await cp(join(dir,f,sf),dest);}continue;}
        if(!isPart&&f.endsWith('.json'))await cp(join(dir,f),join(evidence,f));
      }
    }
    for(const [k,parts] of Object.entries(partsDone)){
      const [name,measure]=k.split('@');const file=`${EVIDENCE_NAME[name]}-${measure}.json`;const loaded=[];
      const order=await scenariosOf(web,name);parts.sort((a,b)=>order.indexOf(a.scenario)-order.indexOf(b.scenario));
      for(const p of parts){let json={ok:false,failure:`no evidence written (exit ${p.code})`};try{json=JSON.parse(await readFile(join(p.out,file),'utf8'));}catch{}
        if(p.code!==0&&json.ok===true){json.ok=false;json.failure=`exit ${p.code} with ok:true in the evidence`;}
        loaded.push({scenario:p.scenario,json,seconds:p.seconds});
        await mkdir(join(evidence,'parts'),{recursive:true});await writeFile(join(evidence,'parts',`${EVIDENCE_NAME[name]}-${measure}.${p.scenario}.json`),JSON.stringify(json,null,1));}
      const merged=mergeParts(name,loaded);
      await writeFile(join(evidence,file),JSON.stringify(merged,null,1));
      const start=Math.min(...parts.map(p=>p.startedAt)),end=Math.max(...parts.map(p=>p.startedAt+p.seconds));
      results.push({name,measure,ok:merged.ok,seconds:parts.reduce((s,p)=>s+p.seconds,0),exit:merged.ok?0:1,problems:parts.reduce((s,p)=>s+p.problems,0),split:parts.map(p=>({scenario:p.scenario,ok:p.code===0,seconds:p.seconds,slot:p.slot,startedAt:p.startedAt})),spanSeconds:end-start});
    }
    for(const r of results)if(r.measure!=='—')await scanVacuous(r.name,r.measure);
    return {slots:N,solo,split,poolSeconds,soloSeconds,ports:slots.map(s=>({server:s.server,client:s.client}))};
  }finally{for(const p of previews)killTree(p);}
}

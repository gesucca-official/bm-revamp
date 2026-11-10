// C4-1c negative integration probes, deliberately synthetic; never product evidence.
// Run after all real verifications have stopped: node tools/verify-all-faults.mjs.
// All mutations, logs and publications stay in a disposable copy under %TEMP%.
import {mkdtemp,mkdir,cp,writeFile,readFile,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {createServer} from 'node:net';
import assert from 'node:assert/strict';
const repo=resolve(import.meta.dirname,'../..'),node=process.execPath;
const root=await mkdtemp(join(tmpdir(),'bm-c4-1c-faults-')),web=join(root,'client-web'),tools=join(web,'tools');
await mkdir(tools,{recursive:true});await mkdir(join(root,'server/src'),{recursive:true});await mkdir(join(root,'server/target'),{recursive:true});await mkdir(join(root,'scripts'));
for(const f of ['verify-all.mjs','verify-all-parallel.mjs','verify-processes.mjs'])await cp(join(repo,'client-web/tools',f),join(tools,f));
await cp(join(repo,'scripts/toolchain.json'),join(root,'scripts/toolchain.json'));
// Fake build success only for publication-gate fixtures below (not a product build).
await writeFile(join(root,'scripts/build.ps1'),'exit 0\n');
await cp(join(repo,'server/target/bm-server-0.0.1-SNAPSHOT.jar'),join(root,'server/target/bm-server-0.0.1-SNAPSHOT.jar'));
await mkdir(join(web,'dist'));await writeFile(join(web,'dist/index.html'),'synthetic orchestration fixture');
await writeFile(join(web,'preview.mjs'),"import {createServer} from 'node:http';createServer((q,s)=>s.end('fixture')).listen(Number(process.env.BM_PORT??4320),'127.0.0.1');");
await writeFile(join(web,'package.json'),JSON.stringify({type:'module',scripts:{serve:'node preview.mjs',test:'node -e ""',build:'node -e ""',size:'node -e ""'}}));
const tc=JSON.parse(await readFile(join(root,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',tc.tools.find(t=>t.name==='java').directory,'bin/java.exe');
const prefix="import {writeFile} from 'node:fs/promises';import {join} from 'node:path';const run=n=>!process.env.BM_SCENARIOS||process.env.BM_SCENARIOS.split(',').includes(n);const write=async(ok=true)=>writeFile(join(process.env.BM_OUT,`ffa-${process.env.BM_VIEWPORT}.json`),JSON.stringify({ok,checks:{fixture:true}}));\n";
const good=prefix+"if(run('one'))await write();\n";
await writeFile(join(tools,'verify-ffa.mjs'),good);
const reports=[];
async function probe(label,args,env={},reuse=true){
 const started=Date.now();let output='';
 const p=spawn(node,[join(tools,'verify-all.mjs'),...(reuse?['--reuse-jar']:[]),...args],{cwd:web,env:{...process.env,BM_JAVA:java,...env},windowsHide:true,stdio:['ignore','pipe','pipe']});
 p.stdout.on('data',d=>output+=d);p.stderr.on('data',d=>output+=d);
 const timer=setTimeout(()=>{try{execFileSync('taskkill',['/PID',String(p.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{}},180000);
 const exit=await new Promise((ok,ko)=>{p.on('error',ko);p.on('close',ok);});clearTimeout(timer);
 await writeFile(join(root,`${label}.log`),output);
 const match=output.match(/evidence \(temporary, not tracked\): (.+)/)??output.match(/evidence published to (.+)/);
 const evidence=match?.[1].trim();const summary=evidence?JSON.parse(await readFile(join(evidence,'run-summary.json'),'utf8')):null;
 const r={label,exit,seconds:Math.round((Date.now()-started)/1000),evidence,summary};reports.push(r);console.log(label,exit,r.seconds,'s');return r;
}
const args=['--only=ffa','--parallel=1','--split=ffa','--measures=1366x768'];
// Even a misleading ok:true file cannot turn exit 1 into green.
await writeFile(join(tools,'verify-ffa.mjs'),prefix+"if(run('one')){await write();process.exitCode=1;}\n");
const failed=await probe('exit-one',args);assert.equal(failed.exit,1);assert.equal(failed.summary.results.find(r=>r.name==='ffa').ok,false);
// Hung split job with a REAL owned Java server; timeout must identify and stop it.
await writeFile(join(tools,'verify-ffa.mjs'),prefix+"import {spawn} from 'node:child_process';if(run('one')){const s=spawn(process.env.BM_JAVA,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local','--app.dev.seed-accounts=true',`--server.port=${process.env.BM_SERVER_PORT}`],{cwd:'../server',env:{...process.env,BM_DATABASE_PATH:join(process.env.BM_OUT,'hang.sqlite')},stdio:'ignore'});console.log('fixture server PID',s.pid);setInterval(()=>{},1000);}\n");
const hung=await probe('hang',args,{BM_PART_TIMEOUT_MIN:'0.5'});assert.equal(hung.exit,1);
const partLog=await readFile(join(hung.evidence,'../logs/ffa-1366x768.one.log'),'utf8');assert.match(partLog,/timeout after 0.5 min; no retry/);assert.match(partLog,/verified server PID \d+.*command:/);assert.match(partLog,/stopping owned PID/);
// A newly added literal scenario (digits/underscore included) is discovered and run.
await writeFile(join(tools,'verify-ffa.mjs'),good+"if(run('added_2')){await write(false);process.exitCode=1;}\n");
const added=await probe('new-scenario',args);assert.equal(added.exit,1);assert.deepEqual(added.summary.results.find(r=>r.name==='ffa').split.map(p=>p.scenario),['one','added_2']);
// Occupied port is refused and the external listener survives.
const listener=createServer();await new Promise((ok,ko)=>{listener.once('error',ko);listener.listen(18080,'127.0.0.1',ok);});
try{const occupied=await probe('occupied-port',args);assert.equal(occupied.exit,1);assert.equal(listener.listening,true);}finally{await new Promise(ok=>listener.close(ok));}
// Synthetic full matrix: assert exact official viewport allocation and N>4 gate.
for(const n of ['verify','modes','lifecycle','ffa','decks','public','profile','resolution','aim','layout']){
 const filename=n==='verify'?'verify.mjs':`verify-${n}.mjs`;
 await writeFile(join(tools,filename),`import {writeFile} from 'node:fs/promises';import {join} from 'node:path';const run=n=>!process.env.BM_SCENARIOS||process.env.BM_SCENARIOS.split(',').includes(n);if(run('one'))await writeFile(join(process.env.BM_OUT,'${n}-'+process.env.BM_VIEWPORT+'.json'),JSON.stringify({ok:true,checks:{fixture:true}}));`);
}
const serial=await probe('default-matrix',[]);assert.equal(serial.exit,0);assert.equal(serial.summary.complete,true);assert.equal(serial.summary.results.length,25);
assert.deepEqual(serial.summary.results.filter(r=>r.measure==='1920x1080').map(r=>r.name).sort(),['layout','verify']);
const n4=await probe('four-published',['--parallel=4','--split=resolution,ffa',`--publish=${join(root,'published')}`],{},false);assert.equal(n4.exit,0);assert.equal(n4.summary.complete,true);assert.equal(n4.summary.equivalentToConsolidation,true);assert.equal(JSON.parse(await readFile(join(root,'published/run-summary.json'),'utf8')).complete,true);
const n6=await probe('six-not-published',['--parallel=6','--split=resolution,ffa',`--publish=${join(root,'must-not-publish')}`],{},false);assert.equal(n6.exit,0);assert.equal(n6.summary.complete,false);assert.equal(n6.summary.equivalentToConsolidation,false);assert.equal((await readdir(root)).includes('must-not-publish'),false);
// Two simultaneous starters: one runs, the other must fail at the machine lock,
// rather than starting and merely colliding with a port later.
const race=await Promise.all([probe('lock-a',['--only=ffa','--parallel=1']),probe('lock-b',['--only=ffa','--parallel=1'])]);
assert.deepEqual(race.map(r=>r.exit).sort(),[0,2]);
await writeFile(join(root,'fault-results.json'),JSON.stringify({kind:'synthetic orchestration fixtures, not product verifications',reports},null,2));
console.log('PASS; all fixtures and logs:',root);

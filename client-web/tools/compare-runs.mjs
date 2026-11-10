// C4-1c (phase A): compares the evidence of two or more VerifyAll runs (serial and parallel) without judging them again.
// For every verification and measure: verdict, names of the checks and of the scenes recorded, the zero-guard counters,
// the cases seen, and the timing the verifications measure (resolution: drift of every completed sequence from its plan,
// label readability, 30 s clock at the end of a sequence; aim and layout: frame intervals within the limit, p95, input).
// Usage (client-web): node tools/compare-runs.mjs <label>=<evidence dir> <label>=<evidence dir> ... [--json=<out file>]
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

const args=process.argv.slice(2),outArg=args.find(a=>a.startsWith('--json='))?.slice(7);
const runs=args.filter(a=>!a.startsWith('--')).map(a=>{const i=a.indexOf('=');return {label:a.slice(0,i),dir:a.slice(i+1)};});
const COUNTERS=['turnsChecked','cardsChecked','boardChecks','unpayableSeen','arrowsDrawn','turnsSeen'];
const q=(xs,p)=>{if(!xs.length)return null;const s=[...xs].sort((a,b)=>a-b);return +s[Math.min(s.length-1,Math.floor(p*(s.length-1)+.5))].toFixed(1);};
const r1=x=>x==null?null:+(+x).toFixed(1);

// Verdict: the evidence's own ok where it has one, otherwise the run summary's (verify and modes write no ok field).
function summarise(name,j,verdict){
  const s={ok:'ok' in j?j.ok===true:verdict===true,checks:Object.keys(j.checks??{}).sort(),scenes:Object.keys(j.scene??j.scenarios??{}).sort(),counters:{},failure:j.failure?String(j.failure).slice(0,300):null};
  (function walk(o){if(o&&typeof o==='object')for(const [k,v] of Object.entries(o)){if(k==='split'||k==='duplicateValues')continue;if(COUNTERS.includes(k)&&typeof v==='number')s.counters[k]=(s.counters[k]??0)+v;walk(v);}})(j);
  if(name==='resolution'){
    const drift=[],readable=[],clockLeft=[];let rounds=0,complete=0;const rules={};
    for(const [label,sc] of Object.entries(j.scene??{})){
      for(const r of Array.isArray(sc.rounds)?sc.rounds:[]){rounds++;if(r.end==='complete'&&Number.isFinite(r.ms)&&Number.isFinite(r.planned)){complete++;drift.push(Math.abs(r.ms-r.planned));}}
      if(sc.labelReadable?.min!=null)readable.push(sc.labelReadable.min);
      for(const [k,v] of Object.entries(sc.rules??{}))rules[k]=(rules[k]??0)+(v.violations?.length??0);
      for(const c of Array.isArray(sc.clock)?sc.clock:[])if(Number.isFinite(c.clockAtSequenceEnd))clockLeft.push(c.clockAtSequenceEnd);
    }
    s.cases=Object.fromEntries(Object.entries(j.cases??{}).map(([k,v])=>[k,v.length]).sort());
    s.missingCases=j.checks?.casesOnRealServer?.missing??null;
    s.timing={rounds,completeSequences:complete,driftMsP50:q(drift,.5),driftMsP95:q(drift,.95),driftMsMax:drift.length?Math.max(...drift):null,over250:drift.filter(x=>x>250).length,labelReadableMin:readable.length?Math.min(...readable):null,clockAtEndMin:clockLeft.length?Math.min(...clockLeft):null,ruleViolations:rules};
  }
  if(name==='aim'||name==='layout'){
    const per=[];
    (function walk(o,p){if(o&&typeof o==='object')for(const [k,v] of Object.entries(o)){if(k==='perf'&&v&&!p.startsWith('.checks'))for(const x of [].concat(v))per.push({where:`${p}${Array.isArray(v)?' T'+x.turn:''}`,within:x.withinLimit!=null?x.withinLimit/100:x.within,p95:x.p95,max:x.max,inputMax:x.inputMax});else walk(v,`${p}.${k}`);}})(j,'');
    s.timing={samples:per.length,withinMin:per.length?Math.min(...per.map(x=>x.within)):null,p95Max:per.length?Math.max(...per.map(x=>x.p95)):null,frameMax:per.length?Math.max(...per.map(x=>x.max)):null,inputMax:per.length?Math.max(...per.map(x=>x.inputMax??0)):null,per};
    s.problems=(j.problems??[]).length;
  }
  return s;
}

const table={};
for(const run of runs){
  const sum=existsSync(join(run.dir,'run-summary.json'))?JSON.parse(await readFile(join(run.dir,'run-summary.json'),'utf8')):null;
  table[run.label]={dir:run.dir,wallSeconds:sum?.parallel?.wallSeconds??null,summedSeconds:sum?sum.results.reduce((a,r)=>a+r.seconds,0):null,
    dist:sum?.build?.dist??null,jar:sum?.build?.jar?.sha256_16??null,results:Object.fromEntries((sum?.results??[]).map(r=>[`${r.name}@${r.measure}`,{ok:r.ok,seconds:r.seconds,span:r.spanSeconds??null}])),files:{}};
  for(const f of (await readdir(run.dir)).filter(f=>/^(verify|modes|lifecycle|ffa|decks|public|profile|resolution|aim|layout)-\d+x\d+\.json$/.test(f)).sort()){
    const name=f.split('-')[0];try{table[run.label].files[f]=summarise(name,JSON.parse(await readFile(join(run.dir,f),'utf8')),table[run.label].results[`${name}@${f.slice(name.length+1,-5)}`]?.ok);}catch(e){table[run.label].files[f]={error:String(e)};}
  }
}
// Differences against the first run: verdicts, check names, scene names, cases seen (zero vs non-zero).
const [base,...others]=runs.map(r=>r.label),diffs=[];
for(const o of others)for(const f of new Set([...Object.keys(table[base].files),...Object.keys(table[o].files)])){
  const a=table[base].files[f],b=table[o].files[f];
  if(!a||!b){diffs.push(`${o} ${f}: ${!a?'missing in '+base:'missing in '+o}`);continue;}
  if(a.ok!==b.ok)diffs.push(`${o} ${f}: ok ${a.ok} vs ${b.ok}`);
  for(const k of ['checks','scenes']){const x=(a[k]??[]).filter(n=>!(b[k]??[]).includes(n)),y=(b[k]??[]).filter(n=>!(a[k]??[]).includes(n));if(x.length||y.length)diffs.push(`${o} ${f}: ${k} only in ${base}: [${x.join(', ')}] only in ${o}: [${y.join(', ')}]`);}
  if(a.cases){const x=Object.keys(a.cases).filter(k=>!b.cases[k]),y=Object.keys(b.cases).filter(k=>!a.cases[k]);if(x.length||y.length)diffs.push(`${o} ${f}: cases only in ${base}: [${x.join(', ')}] only in ${o}: [${y.join(', ')}]`);}
  for(const c of new Set([...Object.keys(a.counters??{}),...Object.keys(b.counters??{})]))if(!a.counters?.[c]!==!b.counters?.[c])diffs.push(`${o} ${f}: counter ${c} ${a.counters[c]??'—'} vs ${b.counters[c]??'—'}`);
}
const out={runs:table,differences:diffs};
if(outArg)await writeFile(outArg,JSON.stringify(out,null,1));
// Printed table: one row per file, timing columns per run.
const labels=runs.map(r=>r.label);
console.log(`runs: ${labels.map(l=>`${l} (wall ${table[l].wallSeconds??'serial'} s, summed ${table[l].summedSeconds} s, dist ${table[l].dist?.sha256_16??'?'}, jar ${table[l].jar??'?'})`).join(' · ')}`);
for(const f of Object.keys(table[base].files)){
  const row=labels.map(l=>{const s=table[l].files[f];if(!s)return `${l}: —`;const t=s.timing;
    const tt=!t?'':t.driftMsP95!==undefined?` drift p50/p95/max ${t.driftMsP50}/${t.driftMsP95}/${t.driftMsMax} ms (>250: ${t.over250}, n ${t.completeSequences}) label min ${t.labelReadableMin} clock min ${t.clockAtEndMin}`:` within min ${r1(t.withinMin)} p95 max ${t.p95Max} frame max ${t.frameMax} input max ${t.inputMax} (n ${t.samples})`;
    if(s.error)return `${l}: unreadable ${s.error}`;return `${l}: ${s.ok?'OK':'FAIL'} ${s.checks.length}c/${s.scenes.length}s${tt}`;});
  console.log(`${f}\n  ${row.join('\n  ')}`);
}
console.log(diffs.length?`\nDIFFERENCES vs ${base}:\n - ${diffs.join('\n - ')}`:`\nno difference in verdicts, check names, scene names, cases or zero-guard counters vs ${base}`);

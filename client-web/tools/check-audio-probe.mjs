// Check the optional audio-probe log without changing the existing verifiers.
// C4-7-bis: sequences are followed through the scene's trace (begin with the round's cue, end with its reason) and the sounds
// through AudioBufferSourceNode.start. Rules: one sequence sound at most per round, only while its sequence is open and of the
// kind of its cue; a round with an outcome whose sequence ends complete or by input (taps, a chosen card) has exactly one
// outcome sound (win or loss); a round with an impact cue that completes has exactly one impact. No HTMLMediaElement playback.
// Each record carries the page that wrote it (`page`), so two players of the same game are told apart.
// Options: --blocked (audio denied: nothing audible at all); --require win,loss,input (coverage the log must contain).
import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const args=process.argv.slice(2),path=args.find(a=>!a.startsWith('--'));if(!path)throw Error('Indicare il registro JSONL');
const blocked=args.includes('--blocked'),require=(args.find(a=>a.startsWith('--require='))?.slice(10)??'').split(',').filter(Boolean);
const rows=readFileSync(path,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
const FILE={impact:'drop_004.ogg',win:'jingles_SAX10.ogg',loss:'jingles_SAX07.ogg'},SEQ=new Set(Object.values(FILE)),KIND=Object.fromEntries(Object.entries(FILE).map(([k,f])=>[f,k]));
assert.deepEqual(rows.filter(x=>!['play','begin','end'].includes(x.type)),[],'errori pagina/console, risposte HTTP o origini esterne');
assert.ok(rows.some(x=>x.type==='play'),'nessun tentativo audio osservato');
assert.deepEqual(rows.filter(x=>x.type==='play'&&x.api==='media'),[],'riproduzione con HTMLMediaElement: il client usa solo Web Audio');
const audible=rows.filter(x=>x.type==='play'&&!x.muted);
if(blocked)assert.deepEqual(audible,[],'audio negato: nessun suono deve partire');
const seq=audible.filter(x=>SEQ.has(x.file));
assert.deepEqual(seq.filter(x=>!x.running),[],'suono della sequenza fuori da una sequenza aperta');
// Two players of one game share the round key and often the viewport: rounds are counted per page.
const rounds=new Map(),at=(v,k)=>{const id=`${v}/${k}`;if(!rounds.has(id))rounds.set(id,{id,cue:null,end:null,plays:[]});return rounds.get(id);};
for(const r of rows){if(r.type==='begin')Object.assign(at(r.page??r.viewport,r.key),{cue:r.cue});if(r.type==='end')at(r.page??r.viewport,r.key).end=r.reason;}
for(const r of seq)at(r.page??r.viewport,r.round).plays.push(KIND[r.file]);
const problems=[];const seen={win:0,loss:0,impact:0,input:0,complete:0,silentAfterStop:0};
for(const r of rounds.values()){
 if(r.plays.length>1)problems.push(`${r.id}: ${r.plays.length} suoni nella stessa risoluzione`);
 if(r.plays.some(k=>k!==r.cue))problems.push(`${r.id}: suono ${r.plays} per un segnale ${r.cue}`);
 const ends=r.end==='complete'||r.end==='input';
 if(!blocked&&ends&&(r.cue==='win'||r.cue==='loss')&&r.plays.length!==1)problems.push(`${r.id}: esito ${r.cue} senza suono (fine ${r.end})`);
 if(!blocked&&r.end==='complete'&&r.cue==='impact'&&r.plays.length!==1)problems.push(`${r.id}: impatto senza suono a sequenza completa`);
 for(const k of r.plays)seen[k]++;if(r.plays.length&&(r.cue==='win'||r.cue==='loss'))seen[r.end==='input'?'input':'complete']++;
 if(!r.plays.length&&r.end&&!ends)seen.silentAfterStop++;}
assert.deepEqual(problems,[],problems.join('\n'));
for(const need of require)assert.ok(seen[need]>0,`copertura mancante: ${need} (${JSON.stringify(seen)})`);
console.log(JSON.stringify({plays:rows.filter(x=>x.type==='play').length,audible:audible.length,rounds:rounds.size,outcomes:{win:seen.win,loss:seen.loss,byInput:seen.input,complete:seen.complete},impacts:seen.impact,silentAfterStop:seen.silentAfterStop,maxPerRound:Math.max(0,...[...rounds.values()].map(r=>r.plays.length))}));

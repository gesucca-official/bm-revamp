// Check the optional audio-probe log without changing the existing verifiers.
import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const path=process.argv[2];if(!path)throw Error('Indicare il registro JSONL');
const rows=readFileSync(path,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
assert.ok(rows.some(x=>x.type==='play'),'nessun tentativo audio osservato');assert.deepEqual(rows.filter(x=>x.type!=='play'),[],'errori pagina/console, risposte HTTP o origini esterne');
const sequence=rows.filter(x=>x.type==='play'&&!x.muted&&/(drop_004|confirmation_002)\.ogg$/.test(x.file));assert.deepEqual(sequence.filter(x=>!x.running),[],'suono della sequenza dopo la sua fine');
const rounds=new Map();for(const r of rows.filter(x=>x.type==='play'&&!x.muted&&x.running&&/(drop_004|confirmation_002)\.ogg$/.test(x.file))){const key=`${r.viewport}/${r.round}`;rounds.set(key,(rounds.get(key)??0)+1);}
assert.ok([...rounds.values()].every(n=>n<=1),`più suoni per risoluzione: ${JSON.stringify([...rounds].filter(([,n])=>n>1))}`);
console.log(JSON.stringify({plays:rows.length,rounds:rounds.size,maxPerRound:Math.max(0,...rounds.values())}));

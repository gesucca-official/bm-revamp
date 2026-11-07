// C4-7-bis: from an audio-probe log, when each outcome sound started, measured from the begin of its sequence (page clock).
// Usage: node tempi-esito.mjs <audio-probe.jsonl>
import {readFileSync} from 'node:fs';
const rows=readFileSync(process.argv[2],'utf8').trim().split('\n').map(l=>JSON.parse(l));
const begin=new Map(),ends=new Map(),out=[];
for(const r of rows){const id=`${r.page}/${r.key??r.round}`;if(r.type==='begin')begin.set(id,r);if(r.type==='end')ends.set(id,r);}
for(const r of rows)if(r.type==='play'&&/jingles/.test(r.file)){const id=`${r.page}/${r.round}`,b=begin.get(id),e=ends.get(id);out.push({page:r.page,kind:r.file.includes('SAX10')?'win':'loss',cueAt:b?.at,playedAt:b?r.t-b.t:null,end:e?.reason,endAt:e&&b?e.t-b.t:null});}
console.log(JSON.stringify(out));

// C4-7-ter: exact identity per reached nominal hit and per live personal outcome, independently of the sequence.
import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const args=process.argv.slice(2),path=args.find(a=>!a.startsWith('--'));if(!path)throw Error('Indicare il registro JSONL');
const blocked=args.includes('--blocked'),required=(args.find(a=>a.startsWith('--require='))?.slice(10)??'').split(',').filter(Boolean);
const rows=readFileSync(path,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const allowed=['play','begin','end','event','reach','panel-plan','panel','panel-dom','stop-all','source-stop'];
assert.deepEqual(rows.filter(x=>!allowed.includes(x.type)),[],'errori pagina/console, HTTP o origini esterne');
assert.ok(rows.some(x=>x.type==='play'),'nessun tentativo audio osservato');
assert.deepEqual(rows.filter(x=>x.type==='play'&&x.api==='media'),[],'vietato HTMLMediaElement');
const audible=rows.filter(x=>x.type==='play'&&!x.muted);if(blocked)assert.deepEqual(audible,[],'audio negato');
const FILE={hit:'impactPunch_heavy_001.ogg',cut:'knifeSlice.ogg',win:'jingles_SAX10.ogg',loss:'jingles_SAX07.ogg'};
const id=r=>`${r.page}/${r.id}`,round=r=>`${r.page}/${r.key}`,plays=audible.filter(x=>Object.values(FILE).includes(x.file)),events=rows.filter(x=>x.type==='event');
const seen=new Set();for(const e of events){assert.ok(!seen.has(id(e)),`evento duplicato ${id(e)}`);seen.add(id(e));
 const pp=plays.filter(p=>p.page===e.page&&p.event?.id===e.id);assert.equal(pp.length,!blocked&&e.available?1:0,`conteggio evento ${id(e)}`);
 for(const p of pp){assert.equal(p.file,FILE[e.kind]);if(e.scope==='hit')assert.ok(p.running,'colpo fuori sequenza');else{assert.ok(p.panelVisible,'esito senza pannello DOM');const panel=rows.find(r=>r.type==='panel'&&id(r)===id(e));assert.ok(panel);assert.equal(p.panelTask,e.id,'esito non avviato nello stesso turno sincrono del pannello');}}}
for(const p of plays)assert.ok(events.some(e=>e.page===p.page&&e.id===p.event?.id),'suono senza evento');
const begins=rows.filter(x=>x.type==='begin');let maxPerRound=0;
for(const b of begins){const reaches=rows.filter(r=>r.type==='reach'&&round(r)===round(b)),end=rows.find(r=>r.type==='end'&&round(r)===round(b));
 const expected=b.impacts.filter(i=>!i.void).flatMap(i=>{const kind=i.kinds.includes('CUT')?'cut':i.kinds.includes('HIT')?'hit':null;return kind?[{move:i.move,kind}]:[]});
 assert.deepEqual(b.cues.map(c=>({move:c.move,kind:c.kind})),expected,'piano audio diverso dai segni disegnati');
 if(end?.reason==='complete')assert.deepEqual(reaches.map(r=>r.move),b.cues.map(c=>c.move),'colpi persi a sequenza completa');
 for(const reach of reaches){assert.ok(b.cues.some(c=>c.move===reach.move&&c.kind===reach.kind&&c.at<=reach.at),'colpo non raggiunto o tipo errato');assert.ok(!end||reach.t<=end.t,'recupero dopo chiusura');assert.equal(events.filter(e=>e.page===b.page&&e.scope==='hit'&&e.id===`${b.key}/${reach.move}`).length,1,'colpo raggiunto senza evento');}
 maxPerRound=Math.max(maxPerRound,reaches.length);}
for(const panel of rows.filter(x=>x.type==='panel-plan'))assert.equal(events.filter(e=>e.page===panel.page&&e.scope==='outcome'&&e.id===panel.id).length,panel.live?1:0,'esito live perso o recupero storico');
const seenKinds={win:plays.filter(p=>p.file===FILE.win).length,loss:plays.filter(p=>p.file===FILE.loss).length,input:0};
for(const p of plays.filter(p=>p.event?.scope==='outcome'))if(rows.some(r=>r.page===p.page&&r.type==='end'&&r.reason==='input'&&r.key?.startsWith(p.event.id.slice(0,p.event.id.lastIndexOf('/'))+'/')&&r.t>=p.t))seenKinds.input++;
for(const need of required)assert.ok(seenKinds[need]>0,`copertura mancante: ${need}`);
console.log(JSON.stringify({audible:audible.length,events:events.length,rounds:begins.length,maxPerRound,outcomes:seenKinds,panelDom:rows.filter(r=>r.type==='panel-dom').length,sourceStops:rows.filter(r=>r.type==='source-stop').length}));

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,roundReport,timeline,type ReportContext} from '../src/resolution.ts';
import type {Card,View} from '../src/contracts.ts';

// SB-16f0 (D56): the search and the reason of a void as optional structured fields of the public move (playground rules).
// The views are the real ones recorded by tools/verify-resolution.mjs; only the two new fields are added, as the server sends them
// with the profile `bozza` (server tests: RegoleD50Test, «SB-16f0»). With the live rules the fields are absent and nothing changes.
const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
type Pair={me:string;note:string;previous:View;next:View};
const pair=(name:string):Pair=>structuredClone(recorded.cases[name]);
const catalog:Card[]=[...(recorded.catalog??[]),...Object.values(recorded.cases as Record<string,Pair>).flatMap(c=>[c.previous,c.next]).flatMap(v=>Object.values(v.players).flatMap(p=>[...(Array.isArray(p.cardsInHand)?p.cardsInHand:[]),...p.character.items]))];
const ctx=(me:string):ReportContext=>({me,name:id=>id,forfeit:(id,code)=>`${id} ${code}`,costOf:()=>null,nameOf:b=>catalog.find(c=>c.bindingName===b)?.name??null});
const OLD='Annullata durante il round (la vista non dice da quale mossa).';
/** A regular action of the catalog, not an object: the card a search found. */
const found=catalog.find(c=>!c.item&&!c.basicAction&&!c.characterBound&&!c.lastResort)!;

test('void with a known reason: «Annullata: a terra.» in place of the sentence that does not know why',()=>{
 const c=pair('void'),i=c.next.resolvedMoves.findIndex(m=>m.void);assert.ok(i>=0);
 const before=roundReport(resolve(c.previous,c.next,c.me,catalog),false,ctx(c.me)).moves[i].lines;
 assert.ok(before.includes(OLD),'without the field, the sentence of before');
 c.next.resolvedMoves[i].voidReason='a terra';
 const f=resolve(c.previous,c.next,c.me,catalog);assert.equal(f.moves[i].voidReason,'a terra');
 const lines=roundReport(f,false,ctx(c.me)).moves[i].lines;
 assert.ok(lines.includes('Annullata: a terra.'),lines.join(' | '));assert.ok(!lines.includes(OLD));
 assert.equal(lines.filter(l=>/^Annullata/.test(l)).length,1);
});

test('search that found a card: said in Italian, the card offered for inspection, and it flies face up to the opponent\'s hand',()=>{
 const c=pair('boundDiscard'),i=c.next.resolvedMoves.findIndex(m=>m.playerId!==c.me&&!m.void);assert.ok(i>=0);
 const author=c.next.resolvedMoves[i].playerId,plain=timeline(c.previous,c.next,resolve(c.previous,c.next,c.me,catalog),catalog)!;
 const backs=plain.draws.filter(d=>d.seat===author&&d.to==='hand');assert.ok(backs.length>=1&&backs.every(d=>d.name===null),'opponent draws are backs');
 c.next.resolvedMoves[i].search={card:found.bindingName,found:true,revealed:found};
 const f=resolve(c.previous,c.next,c.me,catalog),r=roundReport(f,false,ctx(c.me)).moves[i];
 assert.ok(r.lines.includes(`Ricerca al posto della pesca: trovata «${found.name}», mostrata a tutti.`),r.lines.join(' | '));
 assert.deepEqual(r.revealed,{card:found,owner:author});
 const draws=timeline(c.previous,c.next,f,catalog)!.draws.filter(d=>d.seat===author&&d.to==='hand');
 assert.equal(draws.length,backs.length,'as many cards leave the deck as before');
 assert.equal(draws[0].name,found.name,'the found card face up');assert.ok(draws.slice(1).every(d=>d.name===null),'the other draws stay backs');
});

test('search that found nothing: the card searched for by name, no card to inspect, the draw stays a back',()=>{
 const c=pair('boundDiscard'),i=c.next.resolvedMoves.findIndex(m=>m.playerId!==c.me&&!m.void),author=c.next.resolvedMoves[i].playerId;
 c.next.resolvedMoves[i].search={card:found.bindingName,found:false};
 const f=resolve(c.previous,c.next,c.me,catalog),r=roundReport(f,false,ctx(c.me)).moves[i];
 assert.ok(r.lines.includes(`Ricerca al posto della pesca: «${found.name}» non è nel mazzo, pesca normale.`),r.lines.join(' | '));
 assert.equal(r.revealed,undefined);
 // The outcome is the field `found`: a card next to found:false is never offered as found.
 c.next.resolvedMoves[i].search={card:found.bindingName,found:false,revealed:found};
 assert.equal(roundReport(resolve(c.previous,c.next,c.me,catalog),false,ctx(c.me)).moves[i].revealed,undefined);
 c.next.resolvedMoves[i].search={card:found.bindingName,found:false};
 assert.ok(timeline(c.previous,c.next,f,catalog)!.draws.filter(d=>d.seat===author).every(d=>d.name===null));
 // An unknown binding is said as it is.
 c.next.resolvedMoves[i].search={card:'base.nessuno.Ignota',found:false};
 assert.ok(roundReport(resolve(c.previous,c.next,c.me,catalog),false,ctx(c.me)).moves[i].lines.includes('Ricerca al posto della pesca: «base.nessuno.Ignota» non è nel mazzo, pesca normale.'));
});

test('a found object goes to the table as a draw already does; a voided move\'s search is never shown face up',()=>{
 const c=pair('boundDiscard'),i=c.next.resolvedMoves.findIndex(m=>m.playerId!==c.me&&!m.void),author=c.next.resolvedMoves[i].playerId;
 const item=catalog.find(x=>x.item)!;
 c.next.resolvedMoves[i].search={card:item.bindingName,found:true,revealed:item};
 assert.ok(timeline(c.previous,c.next,resolve(c.previous,c.next,c.me,catalog),catalog)!.draws.filter(d=>d.seat===author&&d.to==='hand').every(d=>d.name===null));
 c.next.resolvedMoves[i].search={card:found.bindingName,found:true,revealed:found};c.next.resolvedMoves[i].void=true;
 assert.ok(timeline(c.previous,c.next,resolve(c.previous,c.next,c.me,catalog),catalog)!.draws.filter(d=>d.seat===author&&d.to==='hand').every(d=>d.name===null));
});

test('live rules: without the new fields the facts, the report and the draws are exactly those of before',()=>{
 for(const name of Object.keys(recorded.cases)){const c=pair(name);
  for(const m of c.next.resolvedMoves){assert.equal(m.search,undefined,name);assert.equal(m.voidReason,undefined,name);}
  const f=resolve(c.previous,c.next,c.me,catalog);
  for(const m of f.moves){assert.ok(!('search' in m),name);assert.ok(!('voidReason' in m),name);}
  for(const m of roundReport(f,false,ctx(c.me)).moves){assert.ok(!('revealed' in m),name);assert.ok(!m.lines.some(l=>l.startsWith('Ricerca')),name);}}
});

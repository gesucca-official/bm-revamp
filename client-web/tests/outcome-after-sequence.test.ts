// C4-12: elimination and outcome after the sequence (owner's trial of C4-9, 11 November 2026: «si vede subito l'overlay "eliminato"…
// prima ancora che le animazioni del turno avvengano»; «vittoria e sconfitta compaiono prima che le animazioni abbiano fatto il loro giro»).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,timeline,plays,PACE,type Round,type Timeline} from '../src/resolution.ts';
import {seatMark,heldBack,outcomeWait,OUTCOME_WAIT_MS} from '../src/lifecycle.ts';
import {clone} from '../src/model.ts';
import type {Card,View} from '../src/contracts.ts';

const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
type Pair={me:string;previous:View;next:View};
const cases=recorded.cases as Record<string,Pair>;
const catalog:Card[]=[...(recorded.catalog??[]),...Object.values(cases).flatMap(c=>[c.previous,c.next]).flatMap(v=>Object.values(v.players).flatMap(p=>[...(Array.isArray(p.cardsInHand)?p.cardsInHand:[]),...p.character.items]))];
const still={reduced:false,hidden:false,contextLost:false};
const roundOf=(c:Pair):Round=>({facts:resolve(c.previous,c.next,c.me,catalog),crossed:false} as Round);
const timelineOf=(c:Pair):Timeline=>timeline(c.previous,c.next,resolve(c.previous,c.next,c.me,catalog),catalog)!;
/** The recorded five-seat FFA round, with `who` dying in it while the game goes on. */
function ffaDeath(who:(c:Pair)=>string):Pair{const c=clone(cases.void) as unknown as Pair,next=clone(c.next),id=who(c);
 next.players[id].character.dead=true;next.players[id].character.resources.HEALTH=0;next.over=false;return {...c,next};}
const other=(c:Pair)=>Object.keys(c.next.players).find(id=>id!==c.me&&!c.previous.players[id].character.dead)!;
/** End of the last card's changes, the latest beat before the tail. */
const lastBeat=(t:Timeline)=>Math.max(0,...t.pace.moves.map(m=>m.changes.at+m.changes.dur));

test('FFA: un avversario eliminato nel round non ha «ELIMINATO» fino al cartello della coda, dopo tutte le carte',()=>{
 const c=ffaDeath(other),id=other(c),t=timelineOf(c),h=heldBack(t,c.me),p={dead:true,forfeit:false};
 assert.equal(plays(roundOf(c),'',still),true,'the round has its sequence');
 assert.deepEqual(t.emphasis,[{seat:id,kind:'died'}]);assert.equal(t.outcome,null,'the FFA goes on');
 assert.ok(h.seats.has(id),'the death waits for the stamp');assert.equal(h.ending,false,'not the end of the game for me');
 assert.equal(seatMark(p,h.seats.has(id)),null,'no mark while the sequence runs');
 assert.ok(t.pace.tail.at>=lastBeat(t),`tail ${t.pace.tail.at} after the last card ${lastBeat(t)}`);
 assert.equal(seatMark(p,false),'ELIMINATO','the mark from the tail on, and with no sequence');
 for(const s of Object.keys(c.next.players).filter(x=>x!==id))assert.equal(h.seats.has(s),false,`${s} is not held`);});

test('FORFAIT segue la stessa regola; senza sequenza i segni restano quelli della vista',()=>{
 assert.equal(seatMark({dead:false,forfeit:true},true),null);assert.equal(seatMark({dead:false,forfeit:true},false),'FORFAIT');
 assert.equal(seatMark({dead:true,forfeit:true},false),'ELIMINATO');assert.equal(seatMark({dead:false,forfeit:false},false),null);
 const h=heldBack({emphasis:[{seat:'x'}],outcome:null},'me');assert.deepEqual([...h.seats],['x']);assert.equal(h.ending,false);});

test('fine partita: la sequenza del duello e la propria eliminazione in FFA (D11) trattengono il pannello',()=>{
 for(const name of ['over','death','deathWithMove','lethalEndOfTurn']){const c=cases[name],t=timelineOf(c);assert.ok(t,name);const h=heldBack(t,c.me);
  assert.ok(t.outcome,name);assert.equal(h.ending,true,name);for(const e of t.emphasis)assert.ok(h.seats.has(e.seat),`${name} ${e.seat}`);}
 const own=ffaDeath(c=>c.me),t=timelineOf(own),h=heldBack(t,own.me);assert.equal(t.outcome,null);assert.equal(h.ending,true,'own death in FFA');assert.ok(h.seats.has(own.me));});

test('niente pannello prima della fine della sequenza: l’attesa copre ogni sequenza, striscione compreso',()=>{
 for(const name of ['over','death','deathWithMove','lethalEndOfTurn']){const t=timelineOf(cases[name]);assert.ok(t,name);
  // The banner is the last beat: it ends with the sequence.
  assert.ok(t.pace.tail.at+t.pace.tail.dur<=t.pace.total,name);
  for(const elapsed of [0,t.pace.total/2,t.pace.total-1])assert.ok(outcomeWait({finished:true,since:1000,now:1000+elapsed,dialog:false,opened:false})>t.pace.total-elapsed-1,`${name} at ${elapsed}`);}
 assert.ok(OUTCOME_WAIT_MS>=PACE.budget,'the cap is never under the cap of a round (rule 9)');});

test('pannello garantito: saltata, interrotta, assente, movimento ridotto, dialogo, già aperto, oltre il limite',()=>{
 const base={finished:true,since:1000,now:1500,dialog:false,opened:false};
 assert.ok(outcomeWait(base)>0,'held while the ending sequence runs');
 assert.equal(outcomeWait({...base,since:null}),0,'no ending sequence: skipped, interrupted (hidden, resize, new view), absent');
 assert.equal(plays(roundOf(cases.over),'',{...still,reduced:true}),false,'reduced motion: no sequence, so no wait');
 assert.equal(outcomeWait({...base,dialog:true}),0,'a dialog opens it');
 assert.equal(outcomeWait({...base,opened:true}),0,'once open it stays open');
 assert.equal(outcomeWait({...base,finished:false}),0);
 assert.equal(outcomeWait({...base,now:1000+OUTCOME_WAIT_MS}),0,'never past the cap');
 assert.equal(outcomeWait({...base,now:1000+OUTCOME_WAIT_MS-1}),1);
 assert.equal(outcomeWait({...base,now:900}),OUTCOME_WAIT_MS,'a clock behind the start does not lengthen it');});

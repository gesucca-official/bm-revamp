import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,relation,mismatches,resolutionKey} from '../src/resolution.ts';
import type {Card,View} from '../src/contracts.ts';
// Real view pairs recorded by tools/verify-resolution.mjs (BM_RECORD=1) on the real server, temporary database.
const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
type Pair={me:string;note:string;previous:View;next:View};
const pair=(name:string):Pair=>{const c=recorded.cases[name];assert.ok(c,`recorded case ${name}`);return c;};
const clone=<T>(v:T):T=>structuredClone(v);
// Catalog as the client has it: the account catalog recorded from the real server (C3-4, also the computers' cards),
// then every card the own hands and the tables of the recordings show, with its cost.
const catalog:Card[]=[...(recorded.catalog??[]),...Object.values(recorded.cases as Record<string,Pair>).flatMap(c=>[c.previous,c.next]).flatMap(v=>Object.values(v.players).flatMap(p=>[...(Array.isArray(p.cardsInHand)?p.cardsInHand:[]),...p.character.items]))];
const facts=(name:string)=>{const c=pair(name);return resolve(c.previous,c.next,c.me,catalog);};
const contiguous=['itemConsumed','boundDiscard','drawnToTable','death','over','void','itemNamedNotGone','itemFromOther','itemGoneBefore','deathWithMove','lethalEndOfTurn'];

test('recordings come from the real server and cover the cases of the plan',()=>{
 for(const name of [...contiguous,'jump','jumpAfterForfeits','rejoinSame'])assert.ok(recorded.cases[name],name);
 assert.match(recorded.source,/real server/);assert.ok(recorded.catalog?.length,'account catalog recorded (C3-4)');
});

test('relation: first, same, next, jump, other game, older',()=>{
 const {previous,next}=pair('void');
 assert.equal(relation(null,next),'first');
 assert.equal(relation(previous,next),'next');
 assert.equal(relation(next,clone(next)),'same');
 assert.equal(relation(next,previous),'older');
 assert.equal(relation(previous,{...clone(next),gameId:'another'}),'other-game');
 const j=pair('jumpAfterForfeits');assert.equal(relation(j.previous,j.next),'jump');
 assert.equal(resolutionKey(next),`${next.gameId}/${next.turn}`);
});

test('every contiguous recorded round: differences added to the previous view give the new view',()=>{
 for(const name of contiguous){const c=pair(name),f=resolve(c.previous,c.next,c.me,catalog);
  assert.equal(f.contiguous,true,name);assert.equal(f.turnsAdvanced,1,name);
  assert.deepEqual(mismatches(c.previous,c.next,f),[],name);
  assert.deepEqual(Object.keys(f.seats!).sort(),Object.keys(c.next.players).sort(),name);
  // Moves in the server order, with author, card and target as published.
  assert.deepEqual(f.moves.map(m=>[m.author,m.card,m.void]),c.next.resolvedMoves.map(m=>[m.playerId,m.playedCardName,!!m.void]),name);
  for(const [i,m] of f.moves.entries()){const w=c.next.resolvedMoves[i];assert.equal(m.target,w.targetId==='SELF'?w.playerId:w.targetId);assert.equal(m.self,m.target===m.author);}
 }
});

test('a wrong difference is caught by the sum check',()=>{
 const c=pair('death'),f=resolve(c.previous,c.next,c.me,catalog);const id=Object.keys(f.seats!)[0];
 f.seats![id].resources.HEALTH!.delta+=1;assert.match(mismatches(c.previous,c.next,f).join(),/HEALTH/);
 const g=resolve(c.previous,c.next,c.me,catalog);g.seats![id].itemsAppeared.push('Inventato');assert.match(mismatches(c.previous,c.next,g).join(),/items/);
});

test('voided move: flagged, still listed in order with its nominal cost when the catalog knows the name',()=>{
 const f=facts('void'),voided=f.moves.filter(m=>m.void);
 assert.ok(voided.length>=1);
 // Which counter voided it is not published: no field links them.
 for(const m of voided){assert.equal(m.itemGone,false);assert.deepEqual(Object.keys(m).sort(),['author','card','cost','discard','index','item','itemAtAuthor','itemGone','self','target','void']);}
 for(const m of f.moves){const known=catalog.find(c=>c.name===m.card);assert.deepEqual(m.cost,known?known.cost:null,m.card);}
});

test('object consumed near the author: linked through TARGET_ITEM on the seat it left',()=>{
 const f=facts('itemConsumed'),m=f.moves.find(x=>x.item)!;
 assert.equal(m.item!.owner,m.author);assert.equal(m.itemGone,true);assert.equal(m.itemAtAuthor,false);
 assert.ok(f.seats![m.author].itemsGone.includes(m.item!.name));assert.deepEqual(f.seats![m.author].itemsLinked,[m.item!.name]);
});

test('object taken from another seat: linked, and the same name appeared at the author (co-occurrence only)',()=>{
 const f=facts('itemFromOther'),m=f.moves.find(x=>x.item&&x.author!==x.item.owner)!;
 assert.equal(m.itemGone,true);assert.equal(m.itemAtAuthor,true);
 assert.deepEqual(f.seats![m.item!.owner].itemsLinked,[m.item!.name]);
 // An object pushed out by capacity at the author is gone but linked to nothing.
 const own=f.seats![m.author];assert.ok(own.itemsAppeared.includes(m.item!.name));
 for(const n of own.itemsGone)assert.ok(!own.itemsLinked.includes(n));
});

test('named object that did not disappear by name is not linked (consumed and one more drawn compensate)',()=>{
 const c=pair('itemNamedNotGone'),f=resolve(c.previous,c.next,c.me,catalog),m=f.moves.find(x=>x.author===c.me&&x.item)!;
 assert.equal(m.itemGone,false);assert.deepEqual(f.seats![c.me].itemsGone,[]);
 assert.equal(f.seats![c.me].deck.before-f.seats![c.me].deck.after,2,'two cards left the deck');
});

test('two moves claiming one disappearance: no link at all',()=>{
 const c=pair('itemConsumed'),next=clone(c.next),m=next.resolvedMoves.find(x=>x.choices?.TARGET_ITEM)!;
 next.resolvedMoves.push({...clone(m)});
 const f=resolve(c.previous,next,c.me,catalog);assert.ok(f.moves.every(x=>!x.itemGone));assert.deepEqual(f.seats![m.playerId].itemsLinked,[]);
});

test('object drawn to the table: appears on the own seat, the deck drops more than the cards that reached the hand',()=>{
 const c=pair('drawnToTable'),f=resolve(c.previous,c.next,c.me,catalog),s=f.seats![c.me];
 assert.ok(s.itemsAppeared.length>=1);assert.ok(s.deck.before-s.deck.after>s.handArrived!.length);
 for(const n of s.itemsAppeared)assert.ok(!f.moves.some(m=>m.item?.name===n&&m.itemGone&&m.author===c.me&&m.item.owner!==c.me));
});

test('own hand: played and drawn by name; opponents only as counts',()=>{
 const c=pair('boundDiscard'),f=resolve(c.previous,c.next,c.me,catalog);
 for(const [id,s] of Object.entries(f.seats!)){if(id===c.me){assert.ok(Array.isArray(s.handLeft)&&Array.isArray(s.handArrived));}else{assert.equal(s.handLeft,undefined);assert.equal(s.handArrived,undefined);}}
 const bound=f.moves.find(m=>m.discard)!;assert.equal(bound.discard,c.next.resolvedMoves[bound.index].choices!.DISCARD_ONE);
});

test('death and end of the game in the same round',()=>{
 const f=facts('over');const died=Object.entries(f.seats!).filter(([,s])=>s.died).map(([id])=>id);
 assert.ok(died.length>=1);assert.equal(f.outcome.over,true);assert.ok(!died.includes(f.outcome.winner));
 const c=pair('over');for(const id of died)assert.equal(c.next.players[id].character.dead,true);
});

test('turn jump: recognised, last moves kept, no difference and no link (rule 3)',()=>{
 for(const name of ['jump','jumpAfterForfeits']){const c=pair(name),f=resolve(c.previous,c.next,c.me,catalog);
  assert.equal(f.relation,'jump');assert.equal(f.contiguous,false);assert.equal(f.seats,null);
  assert.equal(f.turnsAdvanced,c.next.turn-c.previous.turn);assert.ok(f.turnsAdvanced>1);
  assert.equal(f.moves.length,c.next.resolvedMoves.length);assert.ok(f.moves.every(m=>!m.itemGone&&!m.itemAtAuthor));
  assert.deepEqual(mismatches(c.previous,c.next,f),[]);}
 const j=facts('jumpAfterForfeits');assert.ok(j.turnsAdvanced>=20);assert.equal(j.outcome.over,true);
});

test('rejoin with the same resolution: same turn, nothing to animate',()=>{
 const c=pair('rejoinSame'),f=resolve(c.previous,c.next,c.me,catalog);
 assert.equal(f.relation,'same');assert.equal(f.seats,null);assert.equal(f.turnsAdvanced,0);assert.equal(f.key,resolutionKey(c.previous));
 assert.deepEqual(c.next.resolvedMoves,c.previous.resolvedMoves);
});

test('other game: no difference even when the turn is the next one',()=>{
 const c=pair('death'),other={...clone(c.next),gameId:'other'};
 const f=resolve(c.previous,other,c.me,catalog);assert.equal(f.relation,'other-game');assert.equal(f.seats,null);
});

test('D1: facts do not depend on the server sentences',()=>{
 for(const name of Object.keys(recorded.cases)){const c=pair(name),a=resolve(c.previous,c.next,c.me,catalog);
  const scramble=(v:View)=>{const x=clone(v);for(const m of x.resolvedMoves)for(const k of Object.keys(m.moveReport) as ('SELF'|'OPPONENT')[])m.moveReport[k]=m.moveReport[k]!.map(()=>'HEALTH: 1->999 (998)');
   for(const k of Object.keys(x.timeBasedEffects))x.timeBasedEffects[k]=x.timeBasedEffects[k].map(()=>'Timer expired');return x;};
  assert.deepEqual(resolve(scramble(c.previous),scramble(c.next),c.me,catalog),a,name);}
});

test('end of turn: who has lines, never what they say; empty lists do not count',()=>{
 const c=pair('jumpAfterForfeits'),f=resolve(c.previous,c.next,c.me,catalog);
 assert.deepEqual(f.endOfTurn,Object.entries(c.next.timeBasedEffects).filter(([,l])=>l.length).map(([id])=>id));
 const v=clone(c.next);for(const k of Object.keys(v.timeBasedEffects))v.timeBasedEffects[k]=[];
 assert.deepEqual(resolve(c.previous,v,c.me,catalog).endOfTurn,[]);
});

test('computers send {} as choices: no object, no discard',()=>{
 const f=facts('void'),w=pair('void').next;
 for(const m of f.moves){const ch=w.resolvedMoves[m.index].choices;if(!ch||!Object.keys(ch).length){assert.equal(m.item,null);assert.equal(m.discard,null);}}
});

test('forfeit appearing in a contiguous round is a fact of the seat',()=>{
 const c=pair('death'),next=clone(c.next),id=Object.keys(next.players).find(x=>x!==c.me)!;next.forfeits={...next.forfeits,[id]:'leave'};
 assert.equal(resolve(c.previous,next,c.me,catalog).seats![id].forfeit,'leave');
 assert.equal(resolve(next,{...clone(next),turn:next.turn+1},c.me,catalog).seats![id].forfeit,null,'an old forfeit is not new');
});

// C3-2: what the scene and the shell may show of a round.
import {Model} from '../src/model.ts';
import {seatMarks,roundNote,plays,hasDifference,type Round} from '../src/resolution.ts';
const round=(name:string,crossed=false):Round=>({facts:facts(name),crossed});
const still={reduced:false,hidden:false,contextLost:false};

test('static summary: every non-zero resource change and the objects of each seat, as the facts give them',()=>{
 for(const name of contiguous){const r=round(name),marks=seatMarks(r)!;
  for(const [id,s] of Object.entries(r.facts.seats!)){
   const res=Object.entries(s.resources).filter(([,c])=>c!.delta).map(([k,c])=>`${k}:${c!.delta}`);
   assert.deepEqual(marks[id].filter(m=>m.key!=='ITEMS').map(m=>`${m.key}:${m.delta}`),res,`${name} ${id}`);
   assert.equal(marks[id].filter(m=>m.key==='ITEMS'&&m.delta<0).reduce((n,m)=>n-m.delta,0),s.itemsGone.length);
   assert.equal(marks[id].filter(m=>m.key==='ITEMS'&&m.delta>0).reduce((n,m)=>n+m.delta,0),s.itemsAppeared.length);}}
 const c=pair('death'),f=round('death'),id=Object.keys(f.facts.seats!).find(i=>f.facts.seats![i].resources.HEALTH?.delta)!;
 const d=f.facts.seats![id].resources.HEALTH!.delta;
 assert.ok(seatMarks(f)![id].some(m=>m.text===`H ${d>0?'+':'−'}${Math.abs(d)}`));void c;
});

test('no summary, no sequence, a note instead after a jump or from an earlier connection (D4, rule 3)',()=>{
 for(const name of ['jump','jumpAfterForfeits']){const r=round(name);assert.equal(seatMarks(r),null);assert.equal(plays(r,'',still),false);
  assert.match(roundNote(r)!,new RegExp(`Risolti ${r.facts.turnsAdvanced} turni fino al turno ${r.facts.turn}`));assert.match(roundNote(r)!,/Ultimo turno/);}
 const crossed=round('void',true);assert.equal(hasDifference(crossed),false);assert.equal(seatMarks(crossed),null);assert.equal(plays(crossed,'',still),false);assert.match(roundNote(crossed)!,/fuori linea/);
 const fine=round('void');assert.equal(roundNote(fine),null);assert.equal(roundNote(null),null);
});

test('sequence plays once per key and never without motion (rules 1, 3; K3)',()=>{
 const r=round('void');assert.equal(plays(r,'',still),true);assert.equal(plays(r,r.facts.key,still),false);
 for(const k of ['reduced','hidden','contextLost'] as const){assert.equal(plays(r,'',{...still,[k]:true}),false,k);assert.ok(seatMarks(r),`${k}: the summary is still there`);}
 const empty={facts:{...r.facts,moves:[]},crossed:false};assert.equal(plays(empty,'',still),false);
});

test('model round: set by a new turn, kept by views of the same turn, crossed after a drop or a reset',()=>{
 const c=pair('void'),m=new Model(c.previous,c.me);assert.equal(m.round,null);
 m.receive(clone(c.next));const r=m.round!;assert.equal(r.facts.relation,'next');assert.equal(r.crossed,false);assert.ok(hasDifference(r));
 const pending=clone(c.next);pending.pendingMove={...clone(c.next.resolvedMoves[0]),playerId:c.me};m.receive(pending);assert.equal(m.round,r,'same turn keeps the round');
 // A drop between the two views: the round of the next view is not a difference.
 const d=new Model(c.previous,c.me);d.disconnect();d.receive(clone(c.next),d.generation,false,true);assert.equal(d.round!.crossed,true);assert.equal(hasDifference(d.round),false);
 const s=new Model(c.previous,c.me);s.reset(clone(c.next));assert.equal(s.round!.crossed,true);
 const j=pair('jumpAfterForfeits'),jm=new Model(j.previous,j.me);jm.receive(clone(j.next));assert.equal(jm.round!.facts.relation,'jump');assert.equal(hasDifference(jm.round),false);
});

// C3-4 revision (owner, D13; D10 raised to a 20 s cap): every card has the same six beats in order — cost, author close-up,
// back to its seat, flight and impact, target close-up, changes — then draws, end of turn and tail; a tap goes to the next
// beat. This replaces the pace of C3-2/C3-4 (costs of every author first, then the cards): a deliberate change of D13.
import {pace,nextStop,directionProblems,PACE,BEATS} from '../src/resolution.ts';
const needSets=[{},{cost:true},{changes:true},{cost:true,changes:true}];
const phaseSets=[{},{draws:true},{draws:true,endOfTurn:true},{endOfTurn:true}];
test('D13 pace: every card has its beats in order, back to back, within the 20 s cap',()=>{
 for(const n of [1,2,3,4,5,8])for(const need of needSets)for(const ph of phaseSets){const p=pace(Array.from({length:n},()=>need),ph);
  assert.deepEqual(directionProblems(p),[],`${n} cards ${JSON.stringify(need)} ${JSON.stringify(ph)}`);
  assert.ok(p.total<=PACE.budget+1,`${n} cards within the cap (${p.total})`);
  for(const m of p.moves){assert.equal(m.cost.dur>0,!!need.cost);assert.equal(m.changes.dur>0,!!need.changes);
   assert.ok(m.cost.at<=m.author.at&&m.author.at<m.back.at&&m.back.at<m.flight.at&&m.flight.at<m.target.at&&m.target.at<=m.changes.at,'cost, author, back, flight, target, changes');}}
 // Duel: two cards with everything and every phase stay well under the cap, at the full pace.
 const duel=pace(2,{draws:true,endOfTurn:true});assert.equal(duel.total,2*BEATS.reduce((n,b)=>n+PACE[b],0)+PACE.draws+PACE.endOfTurn+PACE.tail);assert.ok(duel.total<10000);
 // FFA: five cards with everything still at the full pace, within 20 s; the close-ups in the ranges proposed to the owner.
 const ffa=pace(5,{draws:true,endOfTurn:true});assert.ok(ffa.total<=PACE.budget,`five cards ${ffa.total}`);
 for(const m of ffa.moves){assert.ok(m.author.dur>=600&&m.author.dur<=1000);assert.ok(m.target.dur>=400&&m.target.dur<=600);assert.equal(m.author.dur,PACE.author);}
 // Beyond the cap (eight cards) everything is scaled, still in order.
 const many=pace(8,{draws:true,endOfTurn:true});assert.ok(many.total<=PACE.budget+1&&many.total>=PACE.budget-8);assert.ok(many.moves[0].author.dur<PACE.author);
 assert.deepEqual(pace(0).moves,[]);
});
test('D12 with D13: each tap jumps to the next beat that shows something, then the draws, the end of turn, the tail and the end',()=>{
 const p=pace([{cost:true,changes:true},{},{changes:true}],{draws:true,endOfTurn:true});
 const stops=[...p.moves.flatMap(m=>BEATS.filter(b=>m[b].dur>0).map(b=>m[b].at)),p.draws!.at,p.endOfTurn!.at,p.tail.at,p.total];let t=1;
 assert.equal(stops.length,6+4+5+4,'zero-length beats are no stop');
 for(const s of stops.slice(1)){t=nextStop(p,t);assert.equal(t,s);}
 assert.equal(nextStop(p,p.total),p.total,'past the last stop: the end');
});
test('D13 order checker: a plan out of order, overlapping or beyond the cap is reported',()=>{
 const p=pace(2,{draws:true});assert.deepEqual(directionProblems(p),[]);
 const swapped=structuredClone(p);[swapped.moves[0].flight,swapped.moves[0].back]=[swapped.moves[0].back,swapped.moves[0].flight];assert.ok(directionProblems(swapped).length);
 const late=structuredClone(p);late.total=PACE.budget+500;assert.ok(directionProblems(late).some(x=>x.includes('cap')));
 const lap=structuredClone(p);lap.moves[1]={...lap.moves[1],at:lap.moves[0].at+10};assert.ok(directionProblems(lap).some(x=>x.includes('overlaps')));
 const flat=structuredClone(p);flat.moves[0].author={at:flat.moves[0].author.at,dur:0};assert.ok(directionProblems(flat).some(x=>x.includes('no author')));
});

// C3-4: per-card changes from the regular report lines (D1 reopened), verified on the views, and the round timeline.
import {regularLine,reportSteps,timeline,beats,type Step} from '../src/resolution.ts';
const stepsOf=(name:string)=>{const c=pair(name);return reportSteps(c.previous,c.next,facts(name));};
const timelineOf=(name:string)=>{const c=pair(name);return timeline(c.previous,c.next,facts(name),catalog)!;};
test('regular line: only the form RESOURCE: a->b (d), at the end, after at most a label in parentheses',()=>{
 assert.deepEqual(regularLine('HEALTH: 100->95 (-5)'),{resource:'HEALTH',from:100,to:95,consistent:true});
 assert.deepEqual(regularLine('(TOXICITY effect) HEALTH: 12->-3 (-15)'),{resource:'HEALTH',from:12,to:-3,consistent:true});
 assert.equal(regularLine('HEALTH: 100->95 (-4)')!.consistent,false);
 for(const free of ['Grabbed and consumed Item Negroni Trovato per Terra',"Countered Target's own Move",'Lost HEALTH: 100->95 (-5) somehow','HEALTH: 100 -> 95','Timer expired for MarvelousCocktail effect triggered','POWER: 1->2 (1)'])
  assert.equal(regularLine(free),null,free);
});
const chained=(list:Step[],start:Record<string,Record<string,number>>)=>{const v=structuredClone(start);for(const s of list){assert.equal(v[s.seat][s.resource]??0,s.from,`${s.seat} ${s.resource} chain`);v[s.seat][s.resource]=s.to;}return v;};
test('every recorded contiguous round: steps chain from the previous view to the new one',()=>{
 for(const name of contiguous){const c=pair(name),r=stepsOf(name);assert.ok(r.verified,`${name}: ${!r.verified&&r.reason}`);if(!r.verified)continue;
  const start=Object.fromEntries(Object.entries(c.previous.players).map(([id,p])=>[id,{...p.character.resources}]));
  const end=chained([...r.costs,...r.moves.flat(),...r.endOfTurn],start as Record<string,Record<string,number>>);
  for(const [id,p] of Object.entries(c.next.players))for(const [k,v] of Object.entries(p.character.resources))assert.equal(end[id][k],v,`${name} ${id} ${k}`);
  assert.equal(r.moves.length,c.next.resolvedMoves.length);}
 // Costs come first and leave the author (R04).
 const v=stepsOf('void');assert.ok(v.verified&&v.costs.length&&v.costs.every(s=>s.to<s.from));
});
test('fallback to the totals (D5) when the lines do not rebuild the views, with the reason',()=>{
 const c=pair('death'),f=facts('death');
 // As with MarvelousCocktail: 20 HEALTH lost to a timer the server reports without numbers.
 const timer=clone(c.next),id=Object.keys(timer.players)[0];timer.players[id].character.resources.HEALTH!-=20;
 const a=reportSteps(c.previous,timer,resolve(c.previous,timer,c.me,catalog));assert.equal(a.verified,false);assert.match((a as {reason:string}).reason,/HEALTH: steps end/);
 // A line that does not start where the previous step left.
 const broken=clone(c.next),m=broken.resolvedMoves.find(x=>(x.moveReport.OPPONENT??[]).some(l=>l.startsWith('HEALTH')))!;
 m.moveReport.OPPONENT=m.moveReport.OPPONENT!.map(l=>l.replace(/^HEALTH: (-?\d+)->(-?\d+) \((-?\d+)\)/,(_,x,y,d)=>`HEALTH: ${+x+1}->${+y+1} (${d})`));
 const b=reportSteps(c.previous,broken,f);assert.equal(b.verified,false);assert.match((b as {reason:string}).reason,/previous step left/);
 // Unknown nominal cost: no per-card bars.
 assert.equal(reportSteps(c.previous,c.next,{...f,moves:f.moves.map(x=>({...x,cost:null}))}).verified,false);
 // No difference, no steps.
 assert.equal(reportSteps(pair('jump').previous,pair('jump').next,facts('jump')).verified,false);
 const t=timeline(c.previous,timer,resolve(c.previous,timer,c.me,catalog),catalog)!;assert.equal(t.bars,'total');assert.ok(t.moves.every(x=>!x.steps.length));
 assert.ok(t.totals.some(s=>s.seat===id&&s.resource==='HEALTH'));
});
test('D1: replacing the server sentences never changes the numbers shown, it only drops to the totals',()=>{
 for(const name of contiguous){const c=pair(name),t=timelineOf(name);
  const s=clone(c.next);for(const m of s.resolvedMoves)for(const k of Object.keys(m.moveReport) as ('SELF'|'OPPONENT')[])m.moveReport[k]=m.moveReport[k]!.map(()=>'∅');for(const k of Object.keys(s.timeBasedEffects))s.timeBasedEffects[k]=s.timeBasedEffects[k].map(()=>'∅');
  const u=timeline(c.previous,s,resolve(c.previous,s,c.me,catalog),catalog)!;
  // Without lines only the costs remain: they rebuild a round only when nothing else changed, otherwise the totals.
  if(u.bars==='per-card')assert.ok(u.moves.every(m=>!m.steps.length)&&!u.endOfTurn.steps.length&&u.moves.reduce((n,m)=>n+m.costSteps.length,0)===u.totals.length,`${name}: only costs`);else assert.equal(u.reason!.length>0,true);
  assert.deepEqual({...beats(u),steps:0},{...beats(t),steps:0},`${name}: same beats`);assert.deepEqual(u.totals,t.totals);}
});
test('timeline: cards, voids, costs, objects, draws, end of turn and deaths as the facts give them',()=>{
 for(const name of contiguous){const f=facts(name),t=timelineOf(name),b=beats(t);
  assert.equal(t.bars,'per-card',name);
  assert.equal(b.drops,f.moves.length,name);assert.equal(b.stamps,f.moves.filter(m=>m.void).length,name);
  assert.equal(b.tokens,f.moves.reduce((n,m)=>n+Object.values(m.cost??{}).filter(v=>v).length,0),`${name} tokens`);
  assert.equal(b.consumed+b.passed+b.broken,f.moves.filter(m=>m.itemGone).length,name);
  assert.equal(b.endOfTurn,f.endOfTurn.length);assert.equal(b.emphasis,Object.values(f.seats!).filter(s=>s.died||s.forfeit).length);
  assert.ok(t.pace.total<=PACE.budget+1);
  for(const [id,s] of Object.entries(f.seats!)){const d=t.draws.filter(x=>x.seat===id),left=Math.max(0,s.deck.before-s.deck.after);
   assert.ok(d.filter(x=>x.to==='table').length<=Math.min(left,s.itemsAppeared.length),`${name} ${id}: table draws only from the deck count`);
   if(s.handArrived)assert.deepEqual(d.filter(x=>x.to==='hand').map(x=>x.name),s.handArrived);else assert.equal(d.length,left,`${name} ${id}: as many backs as cards left the deck`);}}
 assert.equal(timelineOf('void').moves.find(m=>m.void)!.card,'SVEGLIAMOCI MA TU NO');
 assert.equal(timelineOf('itemConsumed').moves.find(m=>m.item)!.item!.fate,'consumed');
 assert.equal(timelineOf('itemFromOther').moves.find(m=>m.item)!.item!.fate,'passed');
 const named=timelineOf('itemNamedNotGone');assert.equal(named.moves.find(m=>m.card==='Grab')!.item,null,'nothing animated without a disappearance');
 // The token created in that round is not a deck card: it appears in place, never from the deck.
 assert.ok(!named.draws.some(d=>d.to==='table'&&d.name==='Broken Beer Bottle'),'token not drawn');
 // Object gone before the resolution (real game): a Steal takes devAlice's Negroni, devAlice's ADOPERIAMOTI on it finds
 // nothing; two claims for one disappearance, so neither move animates the object (C3-1 rule), the summary keeps it.
 const contested=timelineOf('itemGoneBefore');assert.ok(contested.moves.filter(m=>m.card!=='').length>=2&&contested.moves.every(m=>!m.item));
 assert.ok(beats(timelineOf('boundDiscard')).discards>=1);
 const drawn=timelineOf('drawnToTable');assert.ok(drawn.draws.some(d=>d.seat===pair('drawnToTable').me&&d.to==='table'),'object drawn to the own table');
 // Lethal end of turn: the TOXICITY line after the moves takes devAlice from 12 to -3.
 const death=timelineOf('death'),dead=death.emphasis.find(e=>e.kind==='died')!;assert.ok(dead);
 assert.ok(death.endOfTurn.steps.some(s=>s.seat===dead.seat&&s.resource==='HEALTH'&&s.from>0&&s.to<=0),'lethal end of turn');
 assert.equal(timeline(pair('jump').previous,pair('jump').next,facts('jump'),catalog),null,'no timeline after a jump');
 // Rule 7 (real game): the author dies in the round and the move already presented is still played, with its steps.
 const dwm=pair('deathWithMove'),df=facts('deathWithMove'),dt=timelineOf('deathWithMove');
 const late=dt.moves.find(m=>df.seats![m.author].died)!;assert.ok(late,'a move of a player who dies');assert.equal(dt.moves.length,dwm.next.resolvedMoves.length);
 assert.ok(dt.emphasis.some(e=>e.seat===late.author&&e.kind==='died'));
 const lt=timelineOf('lethalEndOfTurn');assert.ok(lt.endOfTurn.steps.some(s=>s.resource==='HEALTH'&&s.from>0&&s.to<=0));
 // A voided bound keeps its extra card (R04): no discard shown.
 const vf=facts('boundDiscard'),vb=timeline(pair('boundDiscard').previous,pair('boundDiscard').next,{...vf,moves:vf.moves.map(m=>({...m,void:!!m.discard}))},catalog)!;assert.equal(beats(vb).discards,0);
});

// C3-4 revision (D13): each card's cost is shown just before it, so the steps are re-chained from what the boards show.
test('D13: per card, its cost then its changes, re-chained from the previous view, end exactly on the new view',()=>{
 let drift=0;
 for(const name of contiguous){const c=pair(name),t=timelineOf(name);
  const start=Object.fromEntries(Object.entries(c.previous.players).map(([id,p])=>[id,{...p.character.resources}]));
  const end=chained([...t.moves.flatMap(m=>[...m.costSteps,...m.steps]),...t.endOfTurn.steps],start as Record<string,Record<string,number>>);
  for(const [id,p] of Object.entries(c.next.players))for(const [k,v] of Object.entries(p.character.resources))assert.equal(end[id][k],v,`${name} ${id} ${k}`);
  // Same changes as the server's lines, only the starting values may move (drift), and the costs are this card's own.
  const r=stepsOf(name);if(!r.verified)continue;
  t.moves.forEach((m,i)=>{assert.deepEqual(m.costSteps.map(x=>[x.seat,x.resource,x.to-x.from]),r.moveCosts[i].map(x=>[x.seat,x.resource,x.to-x.from]));
   assert.deepEqual(m.steps.map(x=>[x.seat,x.resource,x.to-x.from]),r.moves[i].map(x=>[x.seat,x.resource,x.to-x.from]));
   assert.ok(m.costSteps.every(x=>x.seat===m.author),'cost at the author');assert.equal(m.tokens.length,m.costSteps.length,'one token per cost step');});
  drift+=t.drift;
  assert.deepEqual(directionProblems(t.pace),[],name);
  t.pace.moves.forEach((p,i)=>{assert.equal(p.cost.dur>0,t.moves[i].tokens.length>0||!!t.moves[i].discard,`${name}: cost beat only to pay`);assert.equal(p.changes.dur>0,t.moves[i].steps.length>0);});}
 assert.ok(drift>=0);
});
test('D13 drift: a later author paying with a resource an earlier card changed starts from the shown value, still ends on the view',()=>{
 // Built from a real round: move j's author was hit (HEALTH line) by an earlier move i; j's card is given a HEALTH cost
 // of 1 and every server value of that seat's HEALTH after the costs moves down by 1, as the server would write it.
 let done=false;
 for(const name of contiguous){const c=pair(name),f=facts(name);
  for(const [i,mi] of f.moves.entries()){if(mi.self)continue;const j=f.moves.findIndex((m,k)=>k>i&&m.author===mi.target);if(j<0)continue;
   if(!(c.next.resolvedMoves[i].moveReport.OPPONENT??[]).some(l=>l.startsWith('HEALTH:')))continue;
   const seat=mi.target,next=clone(c.next),shift=(l:string)=>l.replace(/^(\([^()]*\) )?HEALTH: (-?\d+)->(-?\d+) \((-?\d+)\)$/,(_,lab,a,b,d)=>`${lab??''}HEALTH: ${+a-1}->${+b-1} (${d})`);
   next.resolvedMoves.forEach((m,k)=>{const who=(side:string)=>side==='SELF'?m.playerId:(f.moves[k].target);for(const side of ['SELF','OPPONENT'] as const)if(who(side)===seat&&m.moveReport[side])m.moveReport[side]=m.moveReport[side]!.map(shift);});
   if(next.timeBasedEffects[seat])next.timeBasedEffects[seat]=next.timeBasedEffects[seat].map(shift);
   next.players[seat].character.resources.HEALTH!-=1;
   const cat=[{...catalog.find(x=>x.name===f.moves[j].card)!,cost:{...catalog.find(x=>x.name===f.moves[j].card)!.cost,HEALTH:1}},...catalog];
   const nf=resolve(c.previous,next,c.me,cat),t=timeline(c.previous,next,nf,cat)!;
   assert.equal(t.bars,'per-card',`${name}: still verified`);assert.ok(t.drift>=1,`${name}: drift ${t.drift}`);
   const start=Object.fromEntries(Object.entries(c.previous.players).map(([id,p])=>[id,{...p.character.resources}]));
   const end=chained([...t.moves.flatMap(m=>[...m.costSteps,...m.steps]),...t.endOfTurn.steps],start as Record<string,Record<string,number>>);
   for(const [id,p] of Object.entries(next.players))for(const [k,v] of Object.entries(p.character.resources))assert.equal(end[id][k],v,`${name} ${id} ${k}`);
   done=true;break;}
  if(done)break;}
 assert.ok(done,'a recorded round with an author hit before playing');
});

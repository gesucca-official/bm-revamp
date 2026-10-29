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
// Catalog as the client has it: every card the own hands and the tables of the recordings show, with its cost.
const catalog:Card[]=Object.values(recorded.cases as Record<string,Pair>).flatMap(c=>[c.previous,c.next]).flatMap(v=>Object.values(v.players).flatMap(p=>[...(Array.isArray(p.cardsInHand)?p.cardsInHand:[]),...p.character.items]));
const facts=(name:string)=>{const c=pair(name);return resolve(c.previous,c.next,c.me,catalog);};
const contiguous=['itemConsumed','boundDiscard','drawnToTable','death','over','void','itemNamedNotGone','itemFromOther'];

test('recordings come from the real server and cover the cases of the plan',()=>{
 for(const name of [...contiguous,'jump','jumpAfterForfeits','rejoinSame'])assert.ok(recorded.cases[name],name);
 assert.match(recorded.source,/real server/);
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

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Move, Status, View} from '../src/contracts.ts';
import {statusSequence, plays, resolve} from '../src/resolution.ts';
import {chipsOf} from '../src/readability.ts';
const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
const sample=Object.values(recorded.cases)[0] as {previous:View};
const status=(name='MADE OF STONE',extra:Partial<Status>={}):Status=>({name,description:'Tagli ricevuti ×0,5',type:'GOOD',flow:'INPUT',impactedProperty:'CUT',lastsForTurns:2,equip:false,singleUse:false,amountFunction:{},typeFunction:{},...extra});
const token=(id=41)=>['HIT','CUT','POISON'].map(impactedProperty=>status('Vulnerable',{type:'BAD',impactedProperty,exposure:id,factor:1.5,untilPlayed:'Il colpo',lastsForTurns:null}));
function round(){
 const previous=structuredClone(sample.previous),ids=Object.keys(previous.players),[me,other]=ids;
 for(const p of Object.values(previous.players)){p.character.statuses=[];p.character.immunities=[];p.character.timers=[];}
 const next=structuredClone(previous);next.turn++;next.resolvedMoves=[];
 const move=(author=me,target='SELF',extra:Partial<Move>={}):Move=>({playerId:author,targetId:target,gameId:next.gameId,playedCardName:'Caricamento',choices:null,void:false,moveReport:{},...extra});
 return {previous,next,me,other,move};
}
const chipLabels=(id:string,frame:Parameters<typeof chipsOf>[1])=>chipsOf(id,frame).map(c=>c.title);

test('charge: no token before the move, one ×1,5 chip at its resolution, grouped by exposure',()=>{
 const {previous,next,me,other,move}=round();next.players[me].character.statuses=token();
 next.resolvedMoves=[move(other),move(me,'SELF',{search:{card:'hit',found:true,copy:41}})];
 const saved=structuredClone({previous,next}),plan=statusSequence(previous,next);
 assert.deepEqual(chipLabels(me,plan.before[me]),[]);assert.deepEqual(plan.moves[0],{});
 plan.before[me].statuses.push(...plan.moves[1][me]);
 const chips=chipsOf(me,plan.before[me]);assert.equal(chips.length,1);assert.match(chips[0].title,/×1,5/);assert.equal(chips[0].short,'∞');
 assert.deepEqual({previous,next},saved,'staging must not mutate the wire views');
});

test('hit: token remains through every move and end-of-turn effects; final view removes it',()=>{
 const {previous,next,me,other,move}=round();previous.players[me].character.statuses=token();
 next.resolvedMoves=[move(me,'OPPONENT',{playedCardName:'Il colpo'}),move(other,me)];
 const plan=statusSequence(previous,next);
 for(const additions of plan.moves){for(const [id,list] of Object.entries(additions))plan.before[id].statuses.push(...list);assert.match(chipLabels(me,plan.before[me]).join(),/×1,5/);}
 assert.equal(chipsOf(me,plan.before[me]).length,1,'also during the end-of-turn/tail');
 assert.deepEqual(chipsOf(me,next.players[me].character),[],'only completion reveals removal');
});

test('normal status: exact report adds it at the right move on SELF or OPPONENT; old states expire only at completion',()=>{
 for(const self of [true,false]){
  const {previous,next,me,other,move}=round(),owner=self?me:other;
  previous.players[owner].character.statuses=[status('Old',{lastsForTurns:0})];
  next.players[owner].character.statuses=[status()];next.resolvedMoves=[move(me,self?'SELF':other,{moveReport:{[self?'SELF':'OPPONENT']:['Gained Status: MADE OF STONE']}})];
  const plan=statusSequence(previous,next);assert.match(chipLabels(owner,plan.before[owner]).join(),/Old/);
  plan.before[owner].statuses.push(...plan.moves[0][owner]);assert.equal(chipsOf(owner,plan.before[owner]).length,2);
  assert.deepEqual(chipLabels(owner,next.players[owner].character),['Stato positivo: MADE OF STONE']);
 }
});

test('unknown, approximate, voided or ambiguous reports defer ordinary additions to completion',()=>{
 for(const mode of ['missing','approximate','void','ambiguous','multiplicity']){
  const {previous,next,me,move}=round();next.players[me].character.statuses=[status()];
  const line=mode==='approximate'?'Gained Status: MADE OF STON':mode==='missing'?'Something happened':'Gained status: MADE OF STONE';
  next.resolvedMoves=[move(me,'SELF',{void:mode==='void',moveReport:{SELF:[line]}})];
  if(mode==='ambiguous')next.resolvedMoves.push(structuredClone(next.resolvedMoves[0]));
  if(mode==='multiplicity')next.players[me].character.statuses.push(status());
  const plan=statusSequence(previous,next);assert.deepEqual(plan.moves.map(x=>Object.keys(x)),next.resolvedMoves.map(()=>[]),mode);
  assert.equal(chipsOf(me,plan.before[me]).length,0,mode);assert.ok(chipsOf(me,next.players[me].character).length>0);
 }
});

test('search attribution requires its exact exposure, owner, success and a resolved move',()=>{
 for(const mode of ['wrong-id','wrong-owner','failed','void','no-copy','ambiguous']){
  const {previous,next,me,other,move}=round();next.players[me].character.statuses=token();
  const search={card:'hit',found:mode!=='failed',...(mode==='no-copy'?{}:{copy:mode==='wrong-id'?42:41})};
  next.resolvedMoves=[move(mode==='wrong-owner'?other:me,'SELF',{void:mode==='void',search})];
  if(mode==='ambiguous')next.resolvedMoves.push(structuredClone(next.resolvedMoves[0]));
  const plan=statusSequence(previous,next);assert.ok(plan.moves.every(m=>Object.keys(m).length===0),mode);
 }
});

test('existing counters, immunities and timers stay at their previous values; matching ignores countdown and list index',()=>{
 const {previous,next,me,move}=round(),old=status('Existing',{lastsForTurns:3});
 previous.players[me].character.statuses=[status('Expired'),old,...token()];
 previous.players[me].character.immunities=['TOXICITY'];previous.players[me].character.timers=[{name:'Bad Trip',timer:2,callback:{}}];
 next.players[me].character.statuses=[{...old,lastsForTurns:2},...token()];next.resolvedMoves=[move(me,'SELF',{moveReport:{SELF:['Gained Status: Existing']}})];
 const plan=statusSequence(previous,next);assert.deepEqual(plan.moves,[{}]);
 assert.deepEqual(plan.before[me],{statuses:previous.players[me].character.statuses,immunities:['TOXICITY'],timers:[{name:'Bad Trip',timer:2,callback:{}}]});
 assert.equal(chipsOf(me,plan.before[me]).length,5);assert.equal(chipsOf(me,next.players[me].character).length,2);
});

test('a further exposure adds a separate token without replacing the previous one',()=>{
 const {previous,next,me,move}=round();previous.players[me].character.statuses=token(40);next.players[me].character.statuses=[...token(40),...token(41)];
 next.resolvedMoves=[move(me,'SELF',{search:{card:'hit',found:true,copy:41}})];const plan=statusSequence(previous,next);
 assert.equal(chipsOf(me,plan.before[me]).length,1);plan.before[me].statuses.push(...plan.moves[0][me]);assert.equal(chipsOf(me,plan.before[me]).length,2);
});

test('reduced motion bypasses the sequence; the scene can use the final state immediately',()=>{
 const {previous,next,me,move}=round();previous.players[me].character.statuses=token();next.resolvedMoves=[move()];
 const resolved={facts:resolve(previous,next,me),crossed:false};assert.equal(plays(resolved,'',{reduced:true,hidden:false,contextLost:false}),false);
 assert.equal(chipsOf(me,next.players[me].character).length,0);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Model,clone,type LocalCard} from '../src/model.ts';
import {handCardState} from '../src/readability.ts';
import type {Card} from '../src/contracts.ts';
const f=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));
const make=(flags:Partial<Card>={}):Card=>({...f.cards.stop,item:false,basicAction:false,characterBound:false,lastResort:false,...flags});
const categories=[
 {name:'regular',card:make(),no:false},
 {name:'basic',card:make({basicAction:true}),no:true},
 {name:'bound',card:make({characterBound:true}),no:true},
 {name:'last resort',card:make({lastResort:true}),no:true},
 {name:'item',card:make({item:true}),no:true},
 {name:'token',card:make({item:true,bindingName:'com.tokens.BrokenBeerBottle'}),no:true},
 {name:'unknown regular',card:make({bindingName:'future.Regular'}),no:false},
];
const calm={focused:false,hovered:false,payable:true,dragged:false};

test('O26: discard phase comes from model choice, with or without target; ends with discard or lock',()=>{
 for(const targeted of [false,true])for(const phase of ['choose','sending','pending','uncertain'] as const)
 for(const ended of ['waiting','discard','cancel','regular','over','dead','forfeit'] as const){
  const m=new Model(f.before,'Tu');m.select(m.hand[1].key);if(targeted)m.aim({owner:'Bice'});
  if(ended==='discard'){m.aim({owner:'Bice'});m.select(m.hand[2].key);}
  if(ended==='cancel')m.cancel();if(ended==='regular'){m.cancel();m.select(m.hand[2].key);}
  if(ended==='over')m.view.over=true;if(ended==='dead')m.view.players.Tu.character.dead=true;if(ended==='forfeit')m.view.forfeits.Tu='leave';
  m.phase=phase;m.message='Testo che non parla di scarto';
  assert.equal(m.choosingDiscard,phase==='choose'&&ended==='waiting',`${targeted}/${phase}/${ended}`);
 }
 const m=new Model(f.before,'Tu');m.select(m.hand[1].key);m.aim({owner:'Bice'});m.select(m.hand[2].key);
 assert.equal(m.choosingDiscard,false);m.hand=m.hand.filter(c=>c.key!==m.discard);assert.equal(m.choosingDiscard,true,'a missing discard needs a new choice');
});

test('O26: every hand category, before/after target, every focus/hover/payment/drag combination',()=>{
 for(const targeted of [false,true])for(const active of [false,true])for(const category of categories)
 for(const selected of [false,true])for(const focused of [false,true])for(const hovered of [false,true])
 for(const payable of [false,true])for(const dragged of [false,true]){
  const local:LocalCard={key:'card',card:category.card},choice={choosingDiscard:active,selected:selected?'card':'other',target:targeted?{owner:'Tu'}:null};
  // A selected bound is the ordinary active case; the other categories also
  // exercise the presentation helper on its full input space.
  const r=handCardState(local,choice,{focused,hovered,payable,dragged}),label=JSON.stringify({targeted,active,category:category.name,selected,focused,hovered,payable,dragged});
  assert.equal(r.inPreview,selected&&targeted,label);
  assert.equal(r.chosen,selected&&!targeted&&!active,label);
  assert.equal(r.nonDiscardable,active&&category.no,label);
  assert.equal(r.alpha,dragged?.22:active&&category.no?.55:payable?1:.66,label);
  if(selected&&(active||targeted)){assert.equal(r.raised,false,label);assert.equal(r.wideHit,false,label);}
  else{assert.equal(r.raised,selected&&!targeted||focused||hovered&&!selected,label);assert.equal(r.wideHit,(selected&&!targeted||focused),label);}
 }
});

test('owner decision: every preview card leaves only its local slot; cancelling restores key and order, with seven cards too',()=>{
 for(const category of categories){
  const v=clone(f.before);v.players.Tu.cardsInHand=[...v.players.Tu.cardsInHand,make()];
  const m=new Model(v,'Tu'),local=m.hand[2];local.card=make({...category.card,canTarget:['OPPONENT']});
  const keys=m.hand.map(c=>c.key),before=clone(m.view);m.select(local.key);m.aim({owner:'Bice'});
  assert.equal(handCardState(local,m,calm).inPreview,true,category.name);assert.deepEqual(m.hand.map(c=>c.key),keys);
  m.cancel();assert.equal(handCardState(local,m,calm).inPreview,false);assert.deepEqual(m.hand.map(c=>c.key),keys);
  assert.equal(m.hand.length,7);assert.deepEqual(m.view,before);assert.equal(m.commandCount,0);
 }
});

test('O26: taps on all categories retain existing model behavior; presentation never validates or sends',()=>{
 for(const targeted of [false,true])for(const category of categories){
  const m=new Model(f.before,'Tu'),bound=m.hand[1],other=m.hand[2];other.card=category.card;
  m.select(bound.key);if(targeted)m.aim({owner:'Bice'});const before=clone(m.view);
  handCardState(other,m,{...calm,payable:false});m.select(other.key);
  if(!targeted){assert.equal(m.selected,other.key);assert.equal(m.discard,null);}
  else{assert.equal(m.selected,bound.key);assert.equal(m.discard,category.no?null:other.key);}
  assert.deepEqual(m.view,before);assert.equal(m.commandCount,0);
 }
});

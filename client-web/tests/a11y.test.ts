import {test} from 'node:test';
import assert from 'node:assert/strict';
import {InputMode,aimOrder,deckLabel,handNeighbour,isKeyboardKey,roundLabel,semanticOrder,shouldFocusConfirm,shouldFocusHand,stepInGroup,tabStop} from '../src/a11y.ts';

// C4-8a (owner's choice of 10 November 2026, points 2, 7 and 8): the decisions of keyboard access, apart from the DOM.
test('2a/2b: the last input is the keyboard after Tab, Enter, Space, Escape, arrows and I; a pointer press says it is not; Ctrl/Meta combinations do not count',()=>{
 const m=new InputMode();assert.equal(m.keyboard,false,'starts as a pointer');
 for(const k of ['Tab','Enter',' ','Escape','ArrowLeft','ArrowRight','i','I']){const x=new InputMode();x.key(k);assert.equal(x.keyboard,true,k);assert.equal(isKeyboardKey(k),true);}
 for(const k of ['a','Shift','Control','F5','Meta']){const x=new InputMode();x.key(k);assert.equal(x.keyboard,false,k);}
 m.key('Tab');m.pointer();assert.equal(m.keyboard,false);m.key('Enter',true);assert.equal(m.keyboard,false,'Ctrl+Enter is not play');
});

test('2a: ✓ takes the focus only from the keyboard, with the move ready and no discard still due',()=>{
 const base={keyboard:true,confirmShown:true,needsDiscard:false};
 assert.equal(shouldFocusConfirm(base),true);
 assert.equal(shouldFocusConfirm({...base,keyboard:false}),false,'a finger or a mouse never gets a ring it did not ask for');
 assert.equal(shouldFocusConfirm({...base,confirmShown:false}),false);
 assert.equal(shouldFocusConfirm({...base,needsDiscard:true}),false,'the discard is chosen first, from the hand');
});

test('2b: the first card takes the focus only from the keyboard, when a choice is open, the game goes on, no dialog is open and the focus was lost',()=>{
 const base={keyboard:true,phase:'choose',finished:false,dialogOpen:false,focusLost:true};
 assert.equal(shouldFocusHand(base),true);
 assert.equal(shouldFocusHand({...base,keyboard:false}),false);
 assert.equal(shouldFocusHand({...base,phase:'pending'}),false,'not while the move is sent or the round resolves');
 assert.equal(shouldFocusHand({...base,finished:true}),false,'the outcome panel has its own buttons');
 assert.equal(shouldFocusHand({...base,dialogOpen:true}),false);
 assert.equal(shouldFocusHand({...base,focusLost:false}),false,'a focus that is somewhere stays there');
});

const hits=[{id:'person-b',kind:'person'},{id:'status-b-0',kind:'status'},{id:'card-1',kind:'hand'},{id:'person-a',kind:'person'},{id:'card-2',kind:'hand'},{id:'item-a-0',kind:'item'},{id:'card-3',kind:'hand'},{id:'prev',kind:'preview'}];
test('2c: the hand (and the preview) come first in the order of Tab, each group in the order of the view, nothing lost or repeated',()=>{
 const o=semanticOrder(hits).map(h=>h.id);
 assert.deepEqual(o,['card-1','card-2','card-3','prev','person-b','status-b-0','person-a','item-a-0']);
 assert.deepEqual([...o].sort(),hits.map(h=>h.id).sort());assert.deepEqual(semanticOrder([]),[]);
 assert.equal(hits[0].id,'person-b','the input is not changed');
});

test('2c: the arrows walk the hand one card at a time and stop at the ends; other keys, other controls and a card out of the hand give nothing',()=>{
 assert.equal(handNeighbour(hits,'card-2','ArrowRight'),'card-3');assert.equal(handNeighbour(hits,'card-2','ArrowLeft'),'card-1');
 assert.equal(handNeighbour(hits,'card-1','ArrowLeft'),'card-1','stops at the left end');assert.equal(handNeighbour(hits,'card-3','ArrowRight'),'card-3','stops at the right end');
 assert.equal(handNeighbour(hits,'card-2','ArrowUp'),null);assert.equal(handNeighbour(hits,'card-2','Enter'),null);
 assert.equal(handNeighbour(hits,'person-a','ArrowRight'),null);assert.equal(handNeighbour(hits,'prev','ArrowRight'),null);assert.equal(handNeighbour(hits,'nope','ArrowRight'),null);
});

test('P8: the arrows of a radio group or a tab list wrap around, skip the disabled, and Home and End reach the ends',()=>{
 const on=[true,true,true,true];
 assert.equal(stepInGroup(on,0,'ArrowRight'),1);assert.equal(stepInGroup(on,3,'ArrowRight'),0,'wraps forward');assert.equal(stepInGroup(on,0,'ArrowLeft'),3,'wraps back');
 assert.equal(stepInGroup(on,1,'ArrowDown'),2);assert.equal(stepInGroup(on,1,'ArrowUp'),0);
 assert.equal(stepInGroup([true,false,true,false],0,'ArrowRight'),2,'skips the disabled');assert.equal(stepInGroup([true,false,true,false],2,'ArrowRight'),0);
 assert.equal(stepInGroup([false,true,true,false],2,'Home'),1);assert.equal(stepInGroup([false,true,true,false],1,'End'),2);
 assert.equal(stepInGroup([false,false],0,'ArrowRight'),null,'nothing can be used');assert.equal(stepInGroup(on,0,'Enter'),null);assert.equal(stepInGroup(on,-1,'ArrowRight'),null,'the focus is not in the group');
 assert.equal(stepInGroup([true],0,'ArrowRight'),0,'a group of one stays');
});

test('P8: Tab enters a group once, on the checked button, or on the first usable one when none is checked',()=>{
 assert.equal(tabStop([false,true,false],[true,true,true]),1);assert.equal(tabStop([false,false,false],[true,true,true]),0);
 assert.equal(tabStop([false,false,false],[false,true,true]),1,'the first usable');assert.equal(tabStop([true,false,false],[false,true,true]),1,'a checked button that cannot be used does not hold the stop');
 assert.equal(tabStop([false,false],[false,false]),-1);
});

test('7a: the box of the round says how many cards, and on the pile the top card and its author; the deck is said in cards',()=>{
 const who=(id:string)=>id==='me'?'te':id,p=[{name:'Punch',author:'me',void:false},{name:'Dodge',author:'b',void:true},{name:'Sip',author:'c',void:false}];
 assert.equal(roundLabel([],false,who),'Carte del round: apri Ultimo turno');
 assert.equal(roundLabel([p[0]],false,who),'Carte del round: 1 carta; apri Ultimo turno');
 assert.equal(roundLabel(p,false,who),'Carte del round: 3 carte, 1 annullata; apri Ultimo turno');
 assert.equal(roundLabel(p,true,who),'Carte del round: 3 carte, in cima «Sip» di c, 1 annullata; apri Ultimo turno');
 assert.equal(roundLabel([p[0],p[1]],true,who),'Carte del round: 2 carte, in cima «Dodge» di b (annullata); apri Ultimo turno','the voided top is said once');
 assert.equal(deckLabel(1),'mazzo 1 carta');assert.equal(deckLabel(14),'mazzo 14 carte');assert.equal(deckLabel(0),'mazzo 0 carte');assert.equal(deckLabel(null),'');assert.equal(deckLabel(undefined),'');
});

// Owner's trial of 11 November 2026: Invio on a card, Tab, Invio did not show the confirmation (Tab went to another card, or to a target the card does not admit and Invio cancelled).
test('2c: while a card is chosen, Tab reaches the card, the targets it admits, the rest; the targets it does not admit leave the order',()=>{
 const h=[{id:'c1',kind:'hand'},{id:'c2',kind:'hand'},{id:'c3',kind:'hand'},{id:'prev',kind:'preview'},{id:'person-b',kind:'person'},{id:'status-b',kind:'status'},{id:'person-a',kind:'person'},{id:'item-a-0',kind:'item'}];
 const base={selected:'prev',targeted:false,discarding:false,allowed:(x:{id:string})=>x.id==='item-a-0'||x.id==='person-b',discardable:()=>false};
 const r=aimOrder(h,base);
 assert.deepEqual(r.order.map(x=>x.id),['c1','c2','c3','prev','person-b','item-a-0','status-b','person-a'],'the admitted targets right after the chosen card, the rest in order, what is skipped last');
 const mid=aimOrder(h,{...base,selected:'c2'}).order.map(x=>x.id);
 assert.deepEqual(mid.slice(0,4),['c1','c2','person-b','item-a-0'],'a card still in the hand (before the target is chosen): the targets come right after it, so the first Tab reaches one');
 assert.deepEqual([...r.skipped],['person-a'],'a target not admitted is out of the order of Tab');
 assert.deepEqual(aimOrder(h,{...base,selected:null}).order.map(x=>x.id),semanticOrder(h).map(x=>x.id),'no card chosen: the resting order, nothing skipped');
 assert.equal(aimOrder(h,{...base,selected:null}).skipped.size,0);
 assert.deepEqual(aimOrder(h,{...base,targeted:true}).order.map(x=>x.id),semanticOrder(h).map(x=>x.id),'the target is chosen: the resting order');
 assert.equal(aimOrder(h,{...base,targeted:true}).skipped.size,0);
 const d=aimOrder(h,{...base,targeted:true,discarding:true,discardable:x=>x.id==='c2'||x.id==='c3'});
 assert.deepEqual(d.order.slice(0,2).map(x=>x.id),['c2','c3'],'a discard is due: the cards that can be thrown away come first');
 assert.deepEqual([...d.order.map(x=>x.id)].sort(),h.map(x=>x.id).sort(),'nothing lost or repeated');
 assert.equal(aimOrder(h,{...base,allowed:()=>false}).order.length,h.length,'no admitted target: all the same present');
});

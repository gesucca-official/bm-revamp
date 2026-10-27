import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {affordable,shortfall,roleOf,gainsOf,gainText,meter,chipsOf,statusText,tableLayout,overlap,inside,ROLES,type Box} from '../src/readability.ts';
import {Model} from '../src/model.ts';
import type {Card} from '../src/contracts.ts';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));
const card=(over:Partial<Card>):Card=>({...fixtures.cards.stop,...over});

test('O11: affordability mirrors the server comparison, missing resources count as zero',()=>{
 const c=card({cost:{VIOLENCE:10,ALERTNESS:10}});
 assert.equal(affordable(c,{VIOLENCE:10,ALERTNESS:10}),true,'equal is enough');
 assert.deepEqual(shortfall(c,{VIOLENCE:9,ALERTNESS:30}),['VIOLENCE']);
 assert.deepEqual(shortfall(c,{}),['VIOLENCE','ALERTNESS']);
 assert.equal(affordable(c,{VIOLENCE:-5,ALERTNESS:10}),false,'negative resources stay negative');
 assert.equal(affordable(card({cost:{}}),{}),true,'free cards are always payable');
});
test('O11: attenuation is visual only; the card stays selectable and sendable',()=>{
 const m=new Model(fixtures.before,'Tu');const local=m.hand[2];local.card.cost={VIOLENCE:999};
 assert.equal(affordable(local.card,m.view.players.Tu.character.resources),false);
 m.select(local.key);m.aim({owner:'Bice'});const before=structuredClone(m.view);
 assert.equal(m.confirm()?.playedCardName,local.card.name,'the server stays the judge');assert.deepEqual(m.view,before,'no cost subtracted');
});
test('O14: roles come from the catalog field; unknown or missing values show no mark',()=>{
 assert.equal(roleOf(card({role:'COUNTER'})),'COUNTER');assert.equal(ROLES.COUNTER.label,'CONTRASTO');
 assert.equal(roleOf(card({role:'OTHER'})),'OTHER');
 assert.equal(roleOf(card({role:null})),null);assert.equal(roleOf(card({role:'toString'})),null);assert.equal(roleOf(card({})),null);
 // Every role allowed by the regulation has a label.
 const rules=readFileSync(new URL('../../docs/game-rules.md',import.meta.url),'utf8').split('## R07a')[1].split('## R08')[0];
 const allowed=[...rules.matchAll(/^\| ([A-Z]+) \| [A-Z]/gm)].map(m=>m[1]);assert.deepEqual(allowed.sort(),Object.keys(ROLES).sort());
});
test('O13: gains parse fixed and variable amounts, nothing for no gains',()=>{
 assert.deepEqual(gainsOf(card({gains:'+20 V, +15 L, +5 T'})),[{resource:'VIOLENCE',amount:20},{resource:'ALCOHOL',amount:15},{resource:'TOXICITY',amount:5}]);
 assert.deepEqual(gainsOf(card({gains:'+x H'})),[{resource:'HEALTH',amount:null}]);assert.equal(gainText({resource:'HEALTH',amount:null}),'+x H');
 assert.deepEqual(gainsOf(card({gains:'—'})),[]);assert.deepEqual(gainsOf(card({})),[]);
 // The whole published catalog parses: one token per "+n X" in the annex.
 const annex=JSON.parse(readFileSync(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8'));
 for(const c of [...annex.cards,...annex.tokens])assert.equal(gainsOf(c).length,(c.gains.match(/\+/g)||[]).length,c.class);
});
test('O4: health starts full, other resources at half the bar; no cap or floor',()=>{
 assert.deepEqual(meter(100,100,true),{reference:100,start:1,fill:1,excess:0,negative:0,beyond:false});
 assert.equal(meter(50,100,true).fill,.5);
 const v=meter(25,25);assert.equal(v.reference,50);assert.equal(v.fill,.5);assert.equal(v.start,.5);
 const over=meter(65,25);assert.equal(over.fill,1);assert.ok(Math.abs(over.excess-.3)<1e-9);
 assert.equal(meter(120,25).beyond,true,'far excess is flagged, the number still says it');
 const neg=meter(-10,25);assert.equal(neg.fill,0);assert.equal(neg.negative,.2);
 assert.equal(meter(5,0).reference,20,'resources starting at zero still get a scale');assert.equal(meter(5,0).start,0);
 assert.equal(meter(10,10).reference,20,'Junkie toxicity: start at half');
});
test('statuses, equipment, immunities and timers become chips with a short summary',()=>{
 const c={...fixtures.before.players.Tu.character,immunities:['TOXICITY'],timers:[{name:'Bad Trip',timer:3,callback:{}}],statuses:[
  {name:'YOU CARESS ME',description:'Hit Damage Taken: x0.35',type:'GOOD',flow:'INPUT',impactedProperty:'HIT',lastsForTurns:0,equip:false,singleUse:false,amountFunction:{},typeFunction:{}},
  {name:'BROKEN BEER',description:'x',type:'GOOD',flow:'OUTPUT',impactedProperty:'HIT',lastsForTurns:null,equip:true,singleUse:true,amountFunction:{},typeFunction:{}},
  {name:'NEW THING',description:'Server text',type:'BAD',flow:'INPUT',impactedProperty:'CUT',lastsForTurns:2,equip:false,singleUse:false,amountFunction:{},typeFunction:{}}]};
 const chips=chipsOf('Tu',c);assert.deepEqual(chips.map(x=>x.kind),['immunity','good','equip','bad','timer']);
 assert.match(chips[1].text,/×0,35.*fine turno/);assert.equal(chips[2].short,'∞');assert.match(chips[3].text,/Server text.*2 turni/);assert.match(chips[4].text,/tra 3 fine turno/);
 assert.equal(new Set(chips.map(x=>x.id)).size,chips.length);
});
test('status summaries agree with the multipliers of R07',()=>{
 const r07=readFileSync(new URL('../../docs/game-rules.md',import.meta.url),'utf8').split(/\r?\n/);
 for(const [name,card] of [['YOU CARESS ME','CantFeelAnything'],['ONLY A LITTLE DISCOMFORT','LittleRage'],['NO PATIENCE - Damage Intake Boost','Glare'],['MADE OF STONE','MadeOfStone'],['BROKEN BEER','BrokenBeerBottle']]){
  const factor=statusText(name,'').match(/×[\d,]+/)![0],row=r07.find(l=>l.startsWith(`| ${card} |`)&&l.includes('×'))!;assert.ok(row.includes(factor),`${name} ${factor} in R07 ${card}`);}
});
const VIEWPORTS:[number,number][]=[[1366,768],[844,390]];
const blocks=(s:ReturnType<typeof tableLayout>['seats'][number])=>[s.person,...s.items,s.board];
const handBox=(l:ReturnType<typeof tableLayout>,n:number):Box=>({x:l.hand.center,y:l.hand.y,w:l.hand.w+(n-1)*l.hand.step,h:l.hand.h});
for(const [w,h] of VIEWPORTS)for(const players of [2,5])test(`O12: ${players===2?'duel':'five-seat FFA'} at ${w}×${h} fits without covering seats or hand`,()=>{
 const ids=['me','b','c','d','e'].slice(0,players),items=Object.fromEntries(ids.map(id=>[id,3]));
 const l=tableLayout(w,h,ids,'me',items),hand=handBox(l,7);
 // Larger than C1 (hand 164×226 / 94×130), cards readable at both formats.
 assert.ok(l.hand.w>=(h<550?120:210),`hand card ${l.hand.w}`);
 assert.ok(inside(hand,w,h),'seven-card hand inside the viewport');
 for(const s of l.seats){
  for(const b of [...blocks(s),s.backs])assert.ok(inside(b,w,h),`${s.id} inside ${JSON.stringify(b)}`);
  for(const b of blocks(s))assert.equal(overlap(b,hand),0,`${s.id} clear of the hand ${JSON.stringify(b)}`);
  assert.equal(overlap(s.person,s.board),0,`${s.id} board beside its character`);assert.ok(Math.abs(overlap(s.person,s.status)-s.status.w*s.status.h)<1e-6,`${s.id} statuses on its character card`);
  if(!s.me)for(const b of blocks(s))assert.equal(overlap(b,s.backs),0,`${s.id} covered hand clear of its seat`);
  for(const o of l.seats)if(o!==s)for(const a of blocks(s))for(const b of blocks(o))assert.equal(overlap(a,b),0,`${s.id}/${o.id} ${JSON.stringify(a)} ${JSON.stringify(b)}`);
  // FFA objects may overlap a little (at most a quarter); duel objects never.
  s.items.forEach((a,i)=>{const b=s.items[i+1];if(b)assert.ok(overlap(a,b)<=a.w*a.h*(players>2?.26:0),'objects overlap only slightly');});
 }
 const me=l.seats.find(s=>s.me)!;assert.ok(me.person.w>=(players>2?(h<550?60:117):(h<550?80:150))-1);
});

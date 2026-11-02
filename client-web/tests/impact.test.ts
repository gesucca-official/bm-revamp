import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {damageOf,damageText,damageLabel,leftV,impactOf,impactMotion,DAMAGE_SHAPES,ROLES,type ImpactKind} from '../src/readability.ts';
import {pace,directionProblems,PACE} from '../src/resolution.ts';
import type {Card} from '../src/contracts.ts';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));
const card=(over:Partial<Card>):Card=>({...fixtures.cards.stop,cost:{},...over});
// The catalog attachment of regulation 1.10 (rules-catalog.json): the 37 cards with role, nominal damage and amount.
const attachment=JSON.parse(readFileSync(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8'));
const toCard=(c:Record<string,string>)=>card({name:c.name,bindingName:c.class.split('.').pop()!,role:c.role,gains:c.gains,damage:c.damage,damageAmount:c.damageAmount});
const catalog:Card[]=attachment.cards.map(toCard),tokens:Card[]=attachment.tokens.map(toCard);

test('C3-5: the nominal damage is read from the catalog fields, never computed',()=>{
 assert.deepEqual(damageOf(card({damage:'HIT',damageAmount:'HIT 15'})),[{type:'HIT',base:15,x:false}]);
 assert.deepEqual(damageOf(card({damage:'HIT, CUT',damageAmount:'HIT 10, CUT 5'})).map(e=>`${e.type}${e.base}`),['HIT10','CUT5']);
 assert.deepEqual(damageOf(card({damage:'POISON',damageAmount:'POISON 20'})),[{type:'POISON',base:20,x:false}]);
 assert.deepEqual(damageOf(card({damage:'—',damageAmount:'—'})),[],'no nominal damage');
 assert.deepEqual(damageOf(card({damage:'CUT'})),[{type:'CUT',base:null,x:false}],'an older server without the amount still gives the type');
 assert.deepEqual(damageOf(card({damage:undefined,damageAmount:undefined})),[],'a server without either field gives none');
 assert.deepEqual(damageOf(card({damage:'HIT',damageAmount:'HIT bogus'})),[{type:'HIT',base:null,x:false}],'an amount that does not parse falls back to the type');
});

test('A3 notation: 20+x resolves with half the V left after the cost, truncated toward zero; «20+» when the V is not known',()=>{
 const blow=card({damage:'HIT',damageAmount:'HIT 20+x',cost:{VIOLENCE:20}}),e=damageOf(blow)[0];
 assert.deepEqual(e,{type:'HIT',base:20,x:true});
 assert.equal(leftV(blow,{VIOLENCE:50}),30);assert.equal(damageText(e,30),'35');
 assert.equal(damageText(e,31),'35','half is truncated');
 assert.equal(damageText(e,-3),'19','toward zero, as the server\'s integer division');
 assert.equal(leftV(blow,null),null);assert.equal(leftV(blow,{HEALTH:90}),null,'no V in the view: unknown');
 assert.equal(damageText(e,null),'20+');
 assert.equal(damageLabel(blow,null),'colpo 20+');assert.equal(damageLabel(card({damage:'CUT',damageAmount:'CUT 5'}),null),'taglio 5');
 assert.equal(damageLabel(card({damage:'—',damageAmount:'—'}),null),'');
});

test('C3-5: every symbol has a shape with at least three points, the three of them different',()=>{
 for(const [type,polys] of Object.entries(DAMAGE_SHAPES)){assert.ok(polys.length>=1,type);for(const p of polys){assert.ok(p.length>=6&&p.length%2===0,type);assert.ok(p.every(v=>Math.abs(v)<=1),`${type} inside -1..1`);}}
 assert.equal(new Set(Object.values(DAMAGE_SHAPES).map(p=>JSON.stringify(p))).size,3);
});

test('C3-5: the impact of every card of the catalog is that of its type of damage, else of its role (O7, D2)',()=>{
 assert.equal(catalog.length,37);
 const withType=catalog.filter(c=>damageOf(c).length);
 assert.equal(withType.length,12,'12 cards with a nominal damage (11 HIT, PatheticBlade CUT)');
 for(const c of catalog){
  const types=damageOf(c).map(e=>e.type),imp=impactOf(c),role=c.role&&Object.hasOwn(ROLES,c.role)?c.role:null;
  const want:ImpactKind[]=types.length?types:role?[role as ImpactKind]:['PLAIN'];
  assert.deepEqual(imp.kinds,want,c.name);
  assert.equal(imp.shake,types.includes('HIT')?1:0,`${c.name}: only a blow knocks`);
  assert.equal(impactOf(c,true).shake,0,`${c.name}: reduced motion never knocks`);
  assert.deepEqual(impactOf(c,true).kinds,imp.kinds,`${c.name}: the same mark with reduced motion`);
 }
 const by=(binding:string)=>[...catalog,...tokens].find(c=>c.bindingName===binding)!;
 assert.deepEqual(impactOf(by('PatheticBlade')).kinds,['CUT']);
 assert.deepEqual(impactOf(by('ExtremelyViolentBlow')).kinds,['HIT']);
 // A conversion is not visible: the bottle makes the impact of its role, not of a cut (1.9).
 assert.deepEqual(impactOf(by('BrokenBeerBottle')).kinds,['OTHER']);
 assert.deepEqual(impactOf(by('MarvelousCocktail')).kinds,['RESOURCES'],'the poison of its timer is not the card\'s damage');
 assert.deepEqual(impactOf(by('MadeOfStone')).kinds,['DEFENSE']);
 assert.deepEqual(impactOf(by('YouStop')).kinds,['COUNTER']);
 assert.deepEqual(impactOf(by('Cough')).kinds,['DISRUPT']);
 assert.deepEqual(impactOf(by('Grab')).kinds,['ITEMS']);
 // Older servers: the damage fields are missing, the role decides; a card with neither gets the plain ring.
 assert.deepEqual(impactOf(card({role:'DAMAGE',damage:undefined})).kinds,['DAMAGE']);
 assert.deepEqual(impactOf(card({role:undefined,damage:undefined})).kinds,['PLAIN']);
 // Several types: one mark each, in the catalog's order.
 assert.deepEqual(impactOf(card({damage:'HIT, POISON',damageAmount:'HIT 10, POISON 5'})).kinds,['HIT','POISON']);
});

test('C3-5: the motion of a mark keeps the mark and drops rise and turn with reduced motion',()=>{
 for(const kind of ['HIT','CUT','POISON','VOID','DEFENSE','PLAIN'] as const){
  for(const p of [0,.25,.5,1]){const m=impactMotion(kind,p),r=impactMotion(kind,p,true);
   assert.ok(m.alpha>=0&&m.alpha<=1&&m.scale>0,`${kind} ${p}`);assert.equal(r.scale,m.scale);assert.equal(r.alpha,m.alpha);assert.equal(r.dy,0);assert.equal(r.rot,0);}}
 assert.ok(impactMotion('POISON',.5).dy<0,'poison rises');assert.ok(impactMotion('HIT',.2).rot!==0,'a blow turns');
 assert.equal(impactMotion('VOID',0).scale,1.8,'the cross is pressed down');
});

test('C3-5: the outcome emphasis lengthens only the tail and keeps the plan inside the cap and in order',()=>{
 const plain=pace(2,{clear:true,draws:true}),over=pace(2,{clear:true,draws:true,outcome:true});
 assert.equal(over.tail.dur-plain.tail.dur,PACE.outcome);assert.equal(over.total-plain.total,PACE.outcome);
 assert.deepEqual(directionProblems(over),[]);
 const longest=pace(5,{clear:true,draws:true,endOfTurn:true,totals:true,outcome:true});
 assert.ok(longest.total<=PACE.budget+1,'five cards with every phase and the outcome stay within the cap');assert.deepEqual(directionProblems(longest),[]);
 assert.equal(plain.moves.length,over.moves.length);assert.deepEqual(plain.moves,over.moves,'the cards keep their times');
});

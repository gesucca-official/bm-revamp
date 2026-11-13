import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chipsOf,vulnerabilitiesOf,vulnerabilityText,revealedNote,factorText} from '../src/readability.ts';
import {Model} from '../src/model.ts';
import {resolve,roundReport,type ReportContext} from '../src/resolution.ts';
import type {Card,Status,View} from '../src/contracts.ts';

// SB-16g 2a (D58, D59, D64–D66): the copy found by a search stays face up in the hand, and the vulnerability of the charge is read
// where it applies. The views are the real ones recorded by tools/verify-resolution.mjs; only the new fields are added, in the
// shape the server sends them with the profile `bozza` (server tests: VulnerabilitaD59Test). With the live rules they are absent.
const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
type Pair={me:string;note:string;previous:View;next:View};
const pair=(name:string):Pair=>structuredClone(recorded.cases[name]);
const catalog:Card[]=[...(recorded.catalog??[]),...Object.values(recorded.cases as Record<string,Pair>).flatMap(c=>[c.previous,c.next])
 .flatMap(v=>Object.values(v.players).flatMap(p=>Array.isArray(p.cardsInHand)?p.cardsInHand:[]))];
const strike=catalog.find(c=>!c.item&&!c.basicAction&&!c.characterBound&&!c.lastResort)!;
const ctx=(me:string):ReportContext=>({me,name:id=>id,forfeit:(id,code)=>`${id} ${code}`,costOf:()=>null,nameOf:b=>catalog.find(c=>c.bindingName===b)?.name??null});

/** The three statuses of a vulnerability as the server sends them (Vulnerability.statuses). */
const exposure=(id:number,left:number,heldBy?:number,types=['HIT','CUT','POISON'],factor=1.5):Status[]=>types.map(t=>({
 name:'Vulnerable',description:`${t} received x${factor}`,type:'BAD',flow:'INPUT',impactedProperty:t,lastsForTurns:left,equip:false,singleUse:false,
 amountFunction:{},typeFunction:{},exposure:id,factor,...(heldBy!==undefined?{heldBy}:{})}));
const parry:Status={name:'YOU CARESS ME',description:'HIT x0.35',type:'GOOD',flow:'INPUT',impactedProperty:'HIT',lastsForTurns:0,equip:false,singleUse:false,amountFunction:{},typeFunction:{}};

/** A recorded view in the middle of a match, with the given face-up copy and statuses on `seat`. */
function withReveal(seat:'me'|'other',left:number,heldBy=true){
 const c=pair('boundDiscard'),v=c.next,other=Object.keys(v.players).find(id=>id!==c.me)!,id=seat==='me'?c.me:other,p=v.players[id];
 const copy=7,ch=p.character;ch.statuses=[...ch.statuses,...exposure(copy,left,heldBy?copy:undefined)];
 if(heldBy){if(seat==='me'){const hand=p.cardsInHand as Card[];hand.push(structuredClone(strike));p.revealed=[{copy,card:hand[hand.length-1],turn:v.turn-2,slot:hand.length-1}];}
  else{p.cardsInHand=(p.cardsInHand as number)+1;p.revealed=[{copy,card:structuredClone(strike),turn:v.turn-2}];}}
 return {c,v,id,p};
}

test('the three statuses of a vulnerability are one chip, beside the other statuses, with the card that holds it',()=>{
 const {v,id,p}=withReveal('other',-1);p.character.statuses.unshift(parry);
 const chips=chipsOf(id,p.character,p.revealed),without=chipsOf(id,{...p.character,statuses:p.character.statuses.filter(s=>s.exposure===undefined)},p.revealed);
 assert.equal(chips.length,without.length+1,'one chip more, not three');
 assert.equal(chips.filter(c=>c.title.startsWith('Stato negativo: Vulnerabile')).length,1);
 assert.ok(chips.some(c=>c.title.endsWith('YOU CARESS ME')),'the other statuses as before');
 const chip=chips.find(c=>c.id===`status-${id}-vu-7`)!;
 assert.equal(chip.kind,'bad');assert.equal(chip.short,'∞');assert.equal(chip.title,'Stato negativo: Vulnerabile ×1,5');
 assert.equal(chip.text,`Danni da colpo, taglio e veleno ricevuti ×1,5. Il minimo è finito: dura finché «${strike.name}», la carta scoperta, resta in mano.`);
 assert.ok(v.turn>0);
});

test('the minimum is said as the other durations; a failed search only has the minimum',()=>{
 const held=vulnerabilitiesOf({...withReveal('other',1).p.character});
 assert.deepEqual(held.map(x=>[x.exposure,x.factor,x.types,x.left,x.heldBy]),[[7,1.5,['HIT','CUT','POISON'],1,7]]);
 assert.equal(vulnerabilityText(held[0],'X'),'Danni da colpo, taglio e veleno ricevuti ×1,5. Almeno per 1 turno dopo questo, poi finché «X», la carta scoperta, resta in mano.');
 const failed=withReveal('other',0,false),chip=chipsOf(failed.id,failed.p.character,failed.p.revealed).find(c=>c.id.includes('-vu-'))!;
 assert.equal(chip.short,'0');assert.equal(chip.text,'Danni da colpo, taglio e veleno ricevuti ×1,5. Almeno fino a fine turno.');
 assert.equal(failed.p.revealed,undefined);
});

test('two vulnerabilities: two chips, and the text says that they multiply',()=>{
 const {id,p}=withReveal('other',1);p.character.statuses.push(...exposure(9,1,undefined,['HIT']));
 const chips=chipsOf(id,p.character,p.revealed).filter(c=>c.id.includes('-vu-'));
 assert.deepEqual(chips.map(c=>c.id),[`status-${id}-vu-7`,`status-${id}-vu-9`]);
 assert.ok(chips.every(c=>c.text.endsWith('Più vulnerabilità si moltiplicano.')));
 assert.ok(chips[1].text.startsWith('Danni da colpo ricevuti ×1,5.'));
});

test('the note of a face-up copy: whose, since when, what it holds; the badge carries the factor',()=>{
 const {v,p}=withReveal('other',-1),r=p.revealed![0],n=revealedNote(r,'Mara',p.character);
 assert.equal(n.badge,'SCOPERTA ×1,5');assert.equal(n.label,'scoperta, tiene una vulnerabilità ×1,5');
 assert.ok(n.text.startsWith(`Carta scoperta: Mara l’ha trovata con una ricerca al turno ${v.turn-1} e la vedono tutti finché resta nella sua mano. Tiene la sua vulnerabilità:`),n.text);
 const own=revealedNote(r,null,p.character);assert.ok(own.text.startsWith('Carta scoperta: l’hai trovata')&&own.text.includes('Tiene la tua vulnerabilità'));
 // Another vulnerability, not held by this copy (a failed search), does not change its badge.
 const other=revealedNote(r,'Mara',{...p.character,statuses:[...p.character.statuses,...exposure(9,1,undefined,['HIT'],2)]});
 assert.equal(other.badge,'SCOPERTA ×1,5');assert.ok(!other.text.includes('×2'));
 const plain=revealedNote(r,'Mara',{...p.character,statuses:[]});assert.equal(plain.badge,'SCOPERTA');assert.ok(!plain.text.includes('vulnerabilità'));
 assert.equal(factorText(1.5*1.5),'×2,25');assert.equal(factorText(2),'×2');
});

test('the model takes a view with face-up copies: the opponent hand stays a number, the own copy is a card of the hand',()=>{
 const a=withReveal('other',1),m=new Model(a.v,a.c.me);
 assert.equal(typeof m.view.players[a.id].cardsInHand,'number');assert.equal(m.view.players[a.id].revealed!.length,1);
 const b=withReveal('me',1),mine=new Model(b.v,b.c.me),p=mine.view.players[b.c.me],slot=p.revealed![0].slot!;
 assert.ok(mine.hand.some(l=>l.card===(p.cardsInHand as Card[])[slot]),'the face-up copy is the very card of the hand (by identity)');
});

test('the round report and the facts do not change with face-up copies (they are read from the view, not inferred)',()=>{
 for(const seat of ['me','other'] as const){const plain=pair('boundDiscard'),{c}=withReveal(seat,1);
  const strip=(v:View)=>{const x=structuredClone(v);for(const p of Object.values(x.players)){delete p.revealed;}return x;};
  const before=roundReport(resolve(plain.previous,plain.next,plain.me,catalog),false,ctx(plain.me)).moves.map(m=>m.lines);
  const after=roundReport(resolve(c.previous,strip(c.next),c.me,catalog),false,ctx(c.me)).moves.map(m=>m.lines);
  assert.deepEqual(after,before,seat);}
});

test('with the live rules nothing of this is in the recorded views',()=>{
 for(const c of Object.values(recorded.cases as Record<string,Pair>))for(const v of [c.previous,c.next])for(const p of Object.values(v.players)){
  assert.equal(p.revealed,undefined);for(const s of p.character.statuses){assert.equal(s.exposure,undefined);assert.equal(s.heldBy,undefined);}
  assert.ok(!chipsOf(p.playerId,p.character,p.revealed).some(c=>c.id.includes('-vu-')));}
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,timeline,nextStop,decisiveMove,roundCue,hitAt,type Timeline,type RoundSound} from '../src/resolution.ts';
import {RoundCue} from '../src/sound.ts';
import type {Card,View} from '../src/contracts.ts';
// C4-7-bis (owner's test of C4-7: the outcome was not heard, or very late). Real final rounds recorded by
// tools/verify-resolution.mjs on the real server; the scene's sequence clock is driven by hand with the real stops.
const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
type Pair={me:string;previous:View;next:View};
const catalog:Card[]=[...(recorded.catalog??[]),...Object.values(recorded.cases as Record<string,Pair>).flatMap(c=>[c.previous,c.next]).flatMap(v=>Object.values(v.players).flatMap(p=>[...(Array.isArray(p.cardsInHand)?p.cardsInHand:[]),...p.character.items]))];
const final=(name:string)=>{const c:Pair=recorded.cases[name];const t=timeline(c.previous,c.next,resolve(c.previous,c.next,c.me,catalog),catalog)!;assert.ok(t?.outcome,`${name}: final round`);return {t,me:c.me,winner:c.next.winner};};
// The same round with the death moved onto the opponent's card (the recordings die of poison at the end of the turn).
const byCard=(t:Timeline):Timeline=>{const u=structuredClone(t),dead=u.emphasis[0].seat,i=u.moves.findIndex(m=>m.target===dead&&m.author!==dead);
 u.moves[i].steps=[{seat:dead,resource:'HEALTH',from:17,to:-3}];u.endOfTurn.steps=u.endOfTurn.steps.filter(s=>!(s.seat===dead&&s.resource==='HEALTH'));return u;};
/** The scene's clock: time runs by frames of `frame` ms; a tap at `tapAt` jumps to the next stop, then more taps every `every` ms. */
function run(t:Timeline,me:string,o:{taps?:number[];end?:{at:number;reason:string}}={}){const played:RoundSound[]=[],cue=new RoundCue({round:(_k,kind)=>{played.push(kind);return true;}});
 const plan=roundCue(t,me);cue.arm('k',plan);let elapsed=0,offset=0;const taps=[...(o.taps??[])];const total=t.pace.total;
 for(let now=0;now<60000;now+=16){elapsed=now+offset;
  if(o.end&&now>=o.end.at){cue.end(o.end.reason);break;}
  if(taps.length&&now>=taps[0]){taps.shift();const next=nextStop(t.pace,elapsed);cue.advance(next,total);if(next>=total){cue.end('input');break;}offset+=next-elapsed;elapsed=next;}
  if(elapsed>=total){cue.end('complete');break;}cue.tick(elapsed);}
 return {played,plan};}

test('C4-7-bis: lasciando scorrere, esattamente un suono d’esito, del tipo giusto',()=>{
 for(const name of ['over','death','deathWithMove','lethalEndOfTurn']){const {t,me,winner}=final(name);
  assert.deepEqual(run(t,me).played,['loss'],`${name}: sconfitta`);assert.deepEqual(run(t,winner).played,['win'],`${name}: vittoria vista dal vincitore`);
  const draw=structuredClone(t);draw.outcome={winner:'NONE'};assert.deepEqual(run(draw,me).played,['loss'],`${name}: il pareggio usa il suono della sconfitta`);}});

// Cause (a): ffb9c2d dropped every sound a tap jumped over, so tapping to the end silenced the outcome.
test('C4-7-bis: avanzando col tocco fino alla fine, l’esito suona una volta, da qualunque punto si cominci',()=>{
 for(const name of ['over','lethalEndOfTurn'])for(const t of [final(name).t,byCard(final(name).t)]){const me=final(name).me;
  for(let start=0;start<t.pace.total;start+=97){const r=run(t,me,{taps:Array.from({length:40},(_,i)=>start+i*120)});assert.deepEqual(r.played,['loss'],`${name} da ${start} ms`);}
  for(let at=0;at<t.pace.total;at+=97)assert.deepEqual(run(t,me,{taps:[at]}).played,['loss'],`${name}: un solo tocco a ${at} ms`);}});

// Cause (b): ffb9c2d put the outcome at the end of the tail, after every card, the draws and the end of the turn.
test('C4-7-bis: l’esito sul colpo decisivo, altrimenti all’inizio della coda',()=>{
 const {t,me}=final('over');assert.equal(decisiveMove(t),null,'morte per veleno a fine turno: non viene da una carta');assert.equal(roundCue(t,me)!.at,t.pace.tail.at);
 const c=byCard(t),d=decisiveMove(c)!;assert.equal(c.moves[d].target,c.emphasis[0].seat);assert.equal(roundCue(c,me)!.at,hitAt(c.pace.moves[d]));assert.ok(roundCue(c,me)!.at<t.pace.tail.at);
 const total={...structuredClone(c),bars:'total' as const};assert.equal(decisiveMove(total),null,'senza passi verificati per carta non si sa quale carta');
 const forfeit=structuredClone(c);forfeit.emphasis.push({seat:'x',kind:'forfeit'});assert.equal(decisiveMove(forfeit),null,'un forfait non viene da una carta');
 const two=structuredClone(c);two.moves[0].steps.push({seat:'altro',resource:'HEALTH',from:5,to:0});two.emphasis.push({seat:'altro',kind:'died'});
 assert.equal(decisiveMove(two),d,'più morti da carta: la partita finisce all’ultima');
 const late=structuredClone(c);late.emphasis.push({seat:'altro',kind:'died'});assert.equal(decisiveMove(late),null,'una morte non attribuita a una carta rimanda alla coda');});

test('C4-7-bis: salto, interruzione e fine dopo una scelta di carta',()=>{const {t,me}=final('over'),c=byCard(t),at=roundCue(c,me)!.at;
 for(const reason of ['skip','resize','background','view','disconnect','stop'])assert.deepEqual(run(c,me,{end:{at:at-200,reason}}).played,[],`${reason} prima del colpo: nessun recupero`);
 assert.deepEqual(run(c,me,{end:{at:at+100,reason:'skip'}}).played,['loss'],'già suonato prima del salto: resta uno');
 assert.deepEqual(run(c,me,{end:{at:200,reason:'input'}}).played,['loss'],'una carta scelta chiude la sequenza: l’esito suona al tocco');
 const round={...structuredClone(c),outcome:null};assert.equal(roundCue(round,me)!.kind,'impact');
 assert.deepEqual(run(round,me,{end:{at:200,reason:'input'}}).played,[],'una carta scelta prima dell’impatto non lo fa suonare');
 for(let s=0;s<round.pace.total;s+=97)assert.deepEqual(run(round,me,{taps:Array.from({length:40},(_,i)=>s+i*120)}).played,['impact'],`impatto, tocchi da ${s} ms`);});

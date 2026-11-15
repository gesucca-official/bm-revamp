import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,roundReport,type ReportContext} from '../src/resolution.ts';
import {Model} from '../src/model.ts';
import {playsNote,lastResortPlays} from '../src/readability.ts';
import type {Card,View} from '../src/contracts.ts';

// SB-16i, client step (D97 (2) and (4), D101, D102): the choice between the two names of «Annuncia X o Y», the search that says both,
// «Gioca d'anticipo» and the play counter of «Rincara». The views are the real ones recorded by tools/verify-resolution.mjs; only the
// new fields are added, as the server sends them with the profile `bozza` (server tests: Sb16iClientFieldsTest, Sb16iRulesTest).
// With the live rules the fields are absent and nothing changes.
const recorded=JSON.parse(readFileSync(new URL('./resolution-views.json',import.meta.url),'utf8'));
type Pair={me:string;note:string;previous:View;next:View};
const pair=(name:string):Pair=>structuredClone(recorded.cases[name]);
const catalog:Card[]=[...(recorded.catalog??[]),...Object.values(recorded.cases as Record<string,Pair>).flatMap(c=>[c.previous,c.next]).flatMap(v=>Object.values(v.players).flatMap(p=>[...(Array.isArray(p.cardsInHand)?p.cardsInHand:[]),...p.character.items]))];
const ctx=(me:string):ReportContext=>({me,name:id=>id,forfeit:(id,code)=>`${id} ${code}`,costOf:()=>null,nameOf:b=>catalog.find(c=>c.bindingName===b)?.name??null});
const regulars=catalog.filter(c=>!c.item&&!c.basicAction&&!c.characterBound&&!c.lastResort);
const [x,y]=[regulars[0],regulars.find(c=>c.name!==regulars[0].name)!];
const lastResort=catalog.find(c=>c.lastResort)!;
const linesOf=(c:Pair,i:number)=>roundReport(resolve(c.previous,c.next,c.me,catalog),false,ctx(c.me)).moves[i].lines;
/** boundDiscard: the opponent plays on me, then I play on myself. */
const opponentMove=(c:Pair)=>{const i=c.next.resolvedMoves.findIndex(m=>m.playerId!==c.me&&!m.void);assert.ok(i>=0);return i;};

// ---- the search between two names ----

test('two-name search that found the chosen card: both names, the one chosen, shown to everyone, and the card to inspect',()=>{
 const c=pair('boundDiscard'),i=opponentMove(c);
 c.next.resolvedMoves[i].search={card:y.bindingName,found:true,revealed:y,announced:[x.bindingName,y.bindingName]};
 const r=roundReport(resolve(c.previous,c.next,c.me,catalog),false,ctx(c.me)).moves[i];
 assert.ok(r.lines.includes(`Ricerca al posto della pesca: «${x.name}» o «${y.name}», scelta «${y.name}», trovata e mostrata a tutti.`),r.lines.join(' | '));
 assert.equal(r.lines.filter(l=>l.startsWith('Ricerca')).length,1,'one line for the search');
 assert.deepEqual(r.revealed,{card:y,owner:c.next.resolvedMoves[i].playerId});
});

test('two-name search that found nothing: neither of the two in the deck, normal draw, nothing to inspect',()=>{
 const c=pair('boundDiscard'),i=opponentMove(c);
 c.next.resolvedMoves[i].search={card:x.bindingName,found:false,announced:[x.bindingName,y.bindingName]};
 const r=roundReport(resolve(c.previous,c.next,c.me,catalog),false,ctx(c.me)).moves[i];
 assert.ok(r.lines.includes(`Ricerca al posto della pesca: «${x.name}» o «${y.name}», nessuna delle due nel mazzo, pesca normale.`),r.lines.join(' | '));
 assert.equal(r.revealed,undefined);
 // An unknown binding is said as it is.
 c.next.resolvedMoves[i].search={card:'t.Ignota',found:false,announced:['t.Ignota',y.bindingName]};
 assert.ok(linesOf(c,i).includes(`Ricerca al posto della pesca: «t.Ignota» o «${y.name}», nessuna delle due nel mazzo, pesca normale.`));
});

test('a one-name search keeps the sentences of SB-16f0',()=>{
 const c=pair('boundDiscard'),i=opponentMove(c);
 c.next.resolvedMoves[i].search={card:x.bindingName,found:true,revealed:x};
 assert.ok(linesOf(c,i).includes(`Ricerca al posto della pesca: trovata «${x.name}», mostrata a tutti.`));
 c.next.resolvedMoves[i].search={card:x.bindingName,found:false,announced:[x.bindingName]};
 assert.ok(linesOf(c,i).includes(`Ricerca al posto della pesca: «${x.name}» non è nel mazzo, pesca normale.`),'one announced name is not a choice');
});

// ---- «Gioca d'anticipo» ----

test('«Gioca d’anticipo»: yes before the card the target played, yes alone without one, no',()=>{
 const c=pair('boundDiscard'),i=opponentMove(c),mine=c.next.resolvedMoves.find(m=>m.playerId===c.me)!;
 assert.equal(c.next.resolvedMoves[i].targetId,c.me);
 c.next.resolvedMoves[i].ahead=true;
 assert.ok(linesOf(c,i).includes(`Gioca d’anticipo: sì, prima di «${mine.playedCardName}».`),linesOf(c,i).join(' | '));
 c.next.resolvedMoves[i].ahead=false;
 assert.ok(linesOf(c,i).includes('Gioca d’anticipo: no.'));
 assert.ok(!linesOf(c,i).some(l=>l.includes('prima di')));
 // The target sent no move this round: yes, before nothing in particular.
 const alone=pair('boundDiscard'),j=opponentMove(alone);alone.next.resolvedMoves=[alone.next.resolvedMoves[j]];alone.next.resolvedMoves[0].ahead=true;
 assert.ok(linesOf(alone,0).includes('Gioca d’anticipo: sì.'),linesOf(alone,0).join(' | '));
 // On itself the move has no target move to precede.
 const self=pair('boundDiscard'),k=self.next.resolvedMoves.findIndex(m=>m.playerId===self.me);self.next.resolvedMoves[k].ahead=true;
 assert.ok(linesOf(self,k).includes('Gioca d’anticipo: sì.'));
});

// ---- «Rincara» ----

test('«Rincara» on the move: first play, then the earlier plays',()=>{
 const c=pair('boundDiscard'),i=opponentMove(c);
 c.next.resolvedMoves[i].plays=0;assert.ok(linesOf(c,i).includes('Rincara: prima giocata della partita.'));
 c.next.resolvedMoves[i].plays=1;assert.ok(linesOf(c,i).includes('Rincara: già giocata 1 volta prima di questa.'));
 c.next.resolvedMoves[i].plays=3;assert.ok(linesOf(c,i).includes('Rincara: già giocata 3 volte prima di questa.'));
});

test('the counter beside a last resort: never, once, n times; nothing for other cards or without the counter',()=>{
 const character=structuredClone(pair('boundDiscard').next.players.devAlice.character);
 assert.equal(playsNote(lastResort,character),null,'live rules: no counter, nothing drawn');
 assert.equal(lastResortPlays(character,catalog),null);
 character.plays={};
 assert.deepEqual(playsNote(lastResort,character),{badge:'MAI GIOCATA',text:'Mai giocata in questa partita.',label:'mai giocata'});
 assert.equal(lastResortPlays(character,catalog),'mai giocata');
 character.plays={[lastResort.name.toLowerCase()]:1,[x.name.toLowerCase()]:4};
 assert.equal(playsNote(lastResort,character)!.badge,'GIOCATA 1 VOLTA');
 assert.equal(lastResortPlays(character,catalog),`«${lastResort.name}» giocata 1 volta`,'only the last resorts, not the other titles');
 character.plays[lastResort.name.toLowerCase()]=3;
 assert.deepEqual(playsNote(lastResort,character),{badge:'GIOCATA 3 VOLTE',text:'Giocata 3 volte in questa partita, contando anche quelle annullate.',label:'giocata 3 volte'});
 assert.equal(playsNote(x,character),null,'a regular card shows no counter');
});

// ---- the choice when playing ----

/** A model on the recorded view, with «STORDIAMOTI HO DETTO» aimed at the opponent and the given names available for it. */
function aimed(available?:string[]){
 const c=pair('boundDiscard'),me=c.me,opponent=Object.keys(c.next.players).find(id=>id!==me)!;
 const card=(c.next.players[me].cardsInHand as Card[]).find(k=>k.canTarget.includes('OPPONENT')&&!k.characterBound)!;
 if(available)c.next.players[me].searchable={[card.bindingName]:available,'t.Altra':['t.Q','t.R']};
 const m=new Model(c.next,me);m.select(m.hand.find(l=>l.card.name===card.name)!.key);assert.ok(m.aim({owner:opponent}));assert.ok(m.ready);
 return {m,card};
}

test('two names available: the move waits for a choice among them, then carries it',()=>{
 const {m}=aimed([x.bindingName,y.bindingName]);
 assert.deepEqual(m.searchOptions,[x.bindingName,y.bindingName]);
 assert.equal(m.confirm(),null,'no command without a choice');assert.equal(m.phase,'choose');assert.equal(m.message,'Scegli quale carta cercare');
 assert.equal(m.confirm(false,'t.Q'),null,'a name of another card is not a choice');assert.equal(m.commandCount,0);
 const cmd=m.confirm(false,y.bindingName)!;
 assert.equal(cmd.searchChoice,y.bindingName);assert.equal(m.phase,'sending');assert.equal(m.lastCommand!.searchChoice,y.bindingName);
});

test('one name available: played without asking and without the field; none: played as before',()=>{
 for(const available of [[y.bindingName],[]]){
  const {m}=aimed(available);
  assert.equal(m.searchOptions.length,available.length);
  const cmd=m.confirm()!;assert.ok(cmd,'sent at once');assert.ok(!('searchChoice' in cmd),JSON.stringify(cmd));
 }
});

test('live rules: no `searchable`, the command has exactly the five fields of before',()=>{
 const {m}=aimed();
 assert.deepEqual(m.searchOptions,[]);
 const cmd=m.confirm()!;
 assert.deepEqual(Object.keys(cmd),['playedCardName','playerId','targetId','gameId','choices']);
 assert.ok(!JSON.stringify(cmd).includes('searchChoice'));
});

test('live rules: the recorded views have none of the new fields and the report none of the new lines',()=>{
 for(const name of Object.keys(recorded.cases)){const c=pair(name);
  for(const v of [c.previous,c.next]){for(const p of Object.values(v.players)){assert.ok(!('searchable' in p),name);assert.ok(!('plays' in p.character),name);}
   for(const m of v.resolvedMoves){assert.ok(!('ahead' in m)&&!('plays' in m)&&!('searchChoice' in m),name);}}
  const f=resolve(c.previous,c.next,c.me,catalog);
  for(const m of f.moves){assert.ok(!('ahead' in m)&&!('plays' in m),name);}
  for(const m of roundReport(f,false,ctx(c.me)).moves)assert.ok(!m.lines.some(l=>/anticipo|Rincara| o «/.test(l)),name);}
});

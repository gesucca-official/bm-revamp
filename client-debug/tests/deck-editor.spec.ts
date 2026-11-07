import {strict as assert} from 'assert';
import {EditDeckComponent} from '../src/app/user-hub/collection/edit-deck/edit-deck.component';
import {CollectionComponent} from '../src/app/user-hub/collection/collection.component';

const BRUISER = 'bruiser.character.BigBadBruiser', JUNKIE = 'junkie.character.ToxicJunkie';
const card = (name: string, kind: any = {}): any => ({name, basicAction: false, lastResort: false, characterBound: false, boundToCharacter: null,
  exclusiveToCharacter: null, ...kind});
const grab = card('BruiserGrab', {basicAction: true, exclusiveToCharacter: BRUISER});
const toxicGrab = card('ToxicGrab', {basicAction: true, exclusiveToCharacter: JUNKIE});
const struggle = card('Struggle', {lastResort: true});
const smack = card('LittleSmack', {characterBound: true, boundToCharacter: BRUISER});
const rage = card('LittleRage', {characterBound: true, boundToCharacter: BRUISER});
const blade = card('PatheticBlade', {characterBound: true, boundToCharacter: JUNKIE});
const regular = Array.from({length: 11}, (_, i) => card('Regular' + i));
const spazienzio: any = {name: 'Spazienzio', bindingName: BRUISER}, tossico: any = {name: 'Tossico', bindingName: JUNKIE};
const twenty = () => regular.slice(0, 10).reduce((all: any[], c) => all.concat([c, c]), []);

export const tests = [{name:'I15 editing cancellation preserves saved data', run:() => {
  const session:any = {userAccountData:{collection:{cards:[],characters:[]}}};
  const original:any = {deckId:'fixture',character:spazienzio,basicActionCard:grab,lastResortCard:struggle,regularCards:twenty(),characterBoundCards:[smack, rage]};
  const collection = new CollectionComponent(session, {} as any);
  collection.editDeck(original); collection.targetDeck.regularCards.push({} as any);
  assert.equal(original.regularCards.length,20);
}}, {name:'R02 1.12 deck rules: 20 regular cards, 2 copies, own basic, two different own bound cards, last resort', run:() => {
  // Replaces the I15 case "variable sizes and initial count" (one regular card, five bound cards, 21 cards all valid under 1.4).
  const session:any = {userAccountData:{collection:{cards:[grab, toxicGrab, struggle, smack, rage, blade, ...regular],characters:[]}}};
  const editor = new EditDeckComponent(session);
  editor.deck = {deckId:'fixture',character:null,basicActionCard:null,lastResortCard:null,regularCards:[],characterBoundCards:[]} as any;
  assert.deepEqual(editor.filterBasicActionCards(), []);
  editor.selectCharacter(spazienzio);
  assert.equal(editor.deck.basicActionCard, grab, 'the basic comes with the character');
  assert.deepEqual(editor.filterCharacterBoundCards(), [smack, rage]);
  assert.deepEqual(editor.filterLastResortCards(), [struggle]);
  editor.deck.lastResortCard = struggle;
  editor.addCharacterBoundCard(smack); editor.addCharacterBoundCard(rage); editor.addCharacterBoundCard(smack);
  assert.deepEqual(editor.deck.characterBoundCards, [rage], 'a click leaves a chosen bound');
  editor.addCharacterBoundCard(smack);
  for (const c of regular) { editor.addOrRemoveFromDeck(c); editor.addOrRemoveFromDeck(c); editor.addOrRemoveFromDeck(c); }
  assert.equal(editor.deck.regularCards.length, 20, 'third copies and the 21st card are ignored');
  assert(editor.isDeckValid(), editor.deckProblems().join('; '));
  editor.deck.regularCards = twenty().slice(1); assert.deepEqual(editor.deckProblems(), ['Exactly 20 regular cards required, found 19']);
  editor.deck.regularCards = [...twenty(), regular[10]]; assert.deepEqual(editor.deckProblems(), ['Exactly 20 regular cards required, found 21']);
  editor.deck.regularCards = [...twenty().slice(1), regular[1]]; assert.deepEqual(editor.deckProblems(), ['At most 2 copies per card: Regular1 has 3']);
  editor.deck.regularCards = twenty();
  editor.deck.characterBoundCards = [smack, blade]; assert.deepEqual(editor.deckProblems(), ['Bound card of another character: PatheticBlade']);
  editor.deck.characterBoundCards = [smack, smack]; assert.deepEqual(editor.deckProblems(), ['Bound cards must be different: LittleSmack']);
  editor.deck.characterBoundCards = [smack]; assert.deepEqual(editor.deckProblems(), ['Two different bound cards required, found 1']);
  editor.deck.characterBoundCards = [smack, rage];
  editor.deck.basicActionCard = toxicGrab; assert.deepEqual(editor.deckProblems(), ['Basic of another character: ToxicGrab']);
  editor.deck.basicActionCard = grab;
  editor.deck.lastResortCard = null; assert.deepEqual(editor.deckProblems(), ['Last resort required']);
  editor.deck.lastResortCard = card('Siringa', {lastResort: true, exclusiveToCharacter: JUNKIE});
  assert.deepEqual(editor.deckProblems(), ['Last resort reserved to another character: Siringa']);
  editor.selectCharacter(tossico);
  assert.equal(editor.deck.basicActionCard, toxicGrab);
  assert.deepEqual(editor.deck.characterBoundCards, [], 'bound cards of the other character are dropped');
  editor.deck.deckId = ' '; assert(!editor.isDeckValid());
}}];

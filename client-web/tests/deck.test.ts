import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Card, CharacterCard, UserGuiDeck} from '../src/contracts.ts';
import {addRegular, allowedLastResorts, basics, bounds, canAdd, catalogOrder, clearBound, copies, editCopy, emptyDraft, initialCards, lastResorts,
  ownBasics, ownBounds, payload, problems, removeRegular, serverMessage, setBasic, setCharacter, setLastResort, setName, shown, toggleBound, valid,
  BOUND_CARDS, INITIAL_CARDS, MAX_COPIES, REGULAR_CARDS} from '../src/deck.ts';

const BRUISER = 'bruiser.character.BigBadBruiser', JUNKIE = 'junkie.character.ToxicJunkie';
const card = (bindingName: string, name: string, kind: Partial<Card> = {}): Card => ({
  name, bindingName, effect: `<p>${name} effetto</p>`, item: false, basicAction: false, lastResort: false, characterBound: false,
  boundToCharacter: null, priority: 0, canTarget: ['OPPONENT'], cost: {}, image: null, sprite: null, exclusiveToCharacter: null, ...kind
});
// Catalog fields of regulation 1.12 R02: a basic reserved to its character, Struggle generic, bound cards bound to a character.
const grab = card('com.basic.BruiserGrab', 'BruiserGrab', {basicAction: true, exclusiveToCharacter: BRUISER});
const toxicGrab = card('com.basic.ToxicGrab', 'ToxicGrab', {basicAction: true, exclusiveToCharacter: JUNKIE});
const struggle = card('com.last.Struggle', 'Struggle', {lastResort: true});
// No catalog last resort is reserved yet (D29): this one stands in for one.
const junkieLast = card('junkie.last.Siringa', 'Siringa', {lastResort: true, exclusiveToCharacter: JUNKIE});
const smack = card('bruiser.character.LittleSmack', 'LittleSmack', {characterBound: true, boundToCharacter: BRUISER});
const rage = card('bruiser.character.LittleRage', 'LittleRage', {characterBound: true, boundToCharacter: BRUISER});
const wall = card('bruiser.character.Muro', 'Muro', {characterBound: true, boundToCharacter: BRUISER});
const blade = card('junkie.character.PatheticBlade', 'PatheticBlade', {characterBound: true, boundToCharacter: JUNKIE});
const kick = card('com.Kick', 'Calcio', {effect: '<p>10 HIT al bersaglio</p>'});
const beer = card('com.items.Beer', 'Birra', {item: true, canTarget: []});
const regular = Array.from({length: 10}, (_, i) => i === 9 ? beer : card(`com.Regular${i}`, `Regolare ${i}`));
const catalog = [grab, toxicGrab, struggle, junkieLast, smack, rage, wall, blade, kick, ...regular];
const spazienzio: CharacterCard = {name: 'Spazienzio de la Ucciso', bindingName: BRUISER, itemsSize: 1, resources: {HEALTH: 100}};
const tossico: CharacterCard = {name: 'Tossico del Serraglio', bindingName: JUNKIE, itemsSize: 3, resources: {HEALTH: 100}};

const fill = (d: ReturnType<typeof emptyDraft>) => regular.reduce((x, c) => addRegular(addRegular(x, c), c), d);
/** A valid Bruiser deck: own basic (set with the character), Struggle, LittleSmack and LittleRage, ten cards twice. */
const complete = () => fill(toggleBound(toggleBound(setLastResort(setCharacter(setName(emptyDraft(), 'Strano'), spazienzio, catalog), struggle), smack), rage));

test('constants of R02 1.12', () => {
  assert.deepEqual([REGULAR_CARDS, MAX_COPIES, BOUND_CARDS, INITIAL_CARDS], [20, 2, 2, 3]);
});

test('slot lists follow subtype and ownership: own basic and bound cards, generic or own last resort', () => {
  assert.deepEqual(basics(catalog), [grab, toxicGrab]);
  assert.deepEqual(lastResorts(catalog), [struggle, junkieLast]);
  assert.deepEqual(bounds(catalog), [smack, rage, wall, blade]);
  assert.deepEqual(ownBasics(catalog, spazienzio), [grab]);
  assert.deepEqual(ownBasics(catalog, tossico), [toxicGrab]);
  assert.deepEqual(ownBasics(catalog, null), []);
  // Three bound cards for Spazienzio, like a Set Base character: the deck takes two of them.
  assert.deepEqual(ownBounds(catalog, spazienzio), [smack, rage, wall]);
  assert.deepEqual(ownBounds(catalog, tossico), [blade]);
  assert.deepEqual(allowedLastResorts(catalog, spazienzio), [struggle]);
  assert.deepEqual(allowedLastResorts(catalog, tossico), [struggle, junkieLast]);
});

test('an empty draft lists every missing requirement and is not sendable', () => {
  const d = emptyDraft();
  assert.deepEqual(problems(d), ['Dai un nome al mazzo.', 'Scegli il personaggio.', 'Scegli l’azione base.', 'Scegli l’ultima risorsa.',
    'Scegli 2 azioni legate diverse (ne hai 0).', 'Servono esattamente 20 carte regolari: ne hai 0.']);
  assert.equal(valid(d), false);
  assert.throws(() => payload(d));
});

test('a deck following R02 1.12 is valid: three initial cards, twenty regular cards', () => {
  const d = complete();
  assert.deepEqual(problems(d), []);
  assert.equal(d.basicActionCard?.bindingName, grab.bindingName, 'the basic comes with the character');
  assert.equal(initialCards(d), 3);
  assert.equal(payload(d).regularCards.length, 20);
});

test('a blank name or a name with a slash is refused (R02 1.8); other characters are free', () => {
  assert.deepEqual(problems(setName(complete(), '   ')), ['Dai un nome al mazzo.']);
  assert.deepEqual(problems(setName(complete(), 'a/b')), ['Il nome non può contenere «/».']);
  assert.ok(valid(setName(complete(), 'Mazzo #1 è "strano" & co.')));
});

test('19 or 21 regular cards are refused; the editor ignores a 21st card', () => {
  const d = complete();
  assert.deepEqual(problems(removeRegular(d, 'Calcio')), [], 'removing a card that is not in the deck changes nothing');
  const nineteen = removeRegular(d, 'Regolare 0');
  assert.deepEqual(problems(nineteen), ['Servono esattamente 20 carte regolari: ne hai 19.']);
  assert.equal(canAdd(d, kick), false);
  assert.deepEqual(addRegular(d, kick), d, 'a 21st card is ignored');
  // A deck saved under older rules (never from this editor) is still reported.
  assert.deepEqual(problems({...d, regularCards: [...d.regularCards, kick]}), ['Servono esattamente 20 carte regolari: ne hai 21.']);
});

test('a third copy is refused, items included; removing takes away one copy with the same name', () => {
  let d = removeRegular(removeRegular(complete(), 'Regolare 0'), 'Regolare 0');
  assert.equal(canAdd(d, beer), false);
  assert.deepEqual(addRegular(d, beer), d, 'a third copy is ignored');
  assert.equal(canAdd(d, kick), true);
  d = addRegular(addRegular(addRegular(d, kick), kick), kick);
  assert.deepEqual(copies(d.regularCards).find(e => e.card.name === 'Calcio')?.n, 2);
  assert.deepEqual(problems(d), []);
  const third = {...d, regularCards: [...d.regularCards.slice(1), beer]};
  assert.deepEqual(problems(third), ['Al massimo 2 copie per carta: Birra ne ha 3.']);
  assert.deepEqual(removeRegular(d, 'Assente'), d);
  assert.equal(removeRegular(d, 'Birra').regularCards.filter(c => c.name === 'Birra').length, 1);
});

test('bound cards: two different of the character, taken and left with a click', () => {
  let d = complete();
  assert.deepEqual(toggleBound(d, wall), d, 'a third bound is ignored');
  d = toggleBound(d, smack);
  assert.deepEqual(d.characterBoundCards.map(c => c.name), ['LittleRage']);
  assert.deepEqual(problems(d), ['Scegli 2 azioni legate diverse (ne hai 1).']);
  d = toggleBound(d, wall);
  assert.deepEqual(problems(d), []);
  assert.deepEqual(clearBound(d).characterBoundCards, []);
  // Saved under older rules: repeated, foreign, or too many bound cards are all reported.
  assert.deepEqual(problems({...d, characterBoundCards: [smack, smack]}), ['Le azioni legate devono essere diverse: LittleSmack è ripetuta.']);
  assert.deepEqual(problems({...d, characterBoundCards: [smack, blade]}), ['PatheticBlade è legata a un altro personaggio.']);
  assert.deepEqual(problems({...d, characterBoundCards: [smack, rage, wall]}), ['Scegli 2 azioni legate diverse (ne hai 3).']);
});

test('changing character sets its basic and drops bound cards and a last resort of the other one', () => {
  const junkie = setLastResort(complete(), struggle);
  const d = setCharacter(junkie, tossico, catalog);
  assert.equal(d.basicActionCard?.bindingName, toxicGrab.bindingName);
  assert.deepEqual(d.characterBoundCards, []);
  assert.equal(d.lastResortCard?.bindingName, struggle.bindingName, 'Struggle is generic and stays');
  assert.equal(d.regularCards.length, 20, 'regular cards are shared by every character');
  const own = setCharacter(setLastResort(d, junkieLast), spazienzio, catalog);
  assert.equal(own.lastResortCard, null, 'a last resort reserved to the Junkie leaves a Bruiser deck');
});

test('basic and last resort of another character are reported', () => {
  assert.deepEqual(problems(setBasic(complete(), toxicGrab)), ['ToxicGrab non è l’azione base di Spazienzio de la Ucciso.']);
  assert.deepEqual(problems(setLastResort(complete(), junkieLast)), ['Siringa è riservata a un altro personaggio.']);
  assert.deepEqual(problems({...complete(), lastResortCard: null}), ['Scegli l’ultima risorsa.']);
  const tossicoDeck = fill(toggleBound(setLastResort(setCharacter(setName(emptyDraft(), 'T'), tossico, catalog), junkieLast), blade));
  assert.deepEqual(problems(tossicoDeck), ['Scegli 2 azioni legate diverse (ne hai 1).'], 'own reserved last resort is accepted');
});

test('the search matches the serialized card like the debug, in the collection or in the deck', () => {
  const d = removeRegular(removeRegular(complete(), 'Birra'), 'Birra');
  assert.deepEqual(shown(d, catalog, 'collection', 'hit'), [kick]);
  assert.deepEqual(shown(d, catalog, 'collection', 'com.items'), [beer]);
  assert.deepEqual(shown(d, catalog, 'deck', 'birra'), []);
  assert.deepEqual(shown(complete(), catalog, 'deck', 'birra'), [beer, beer]);
  // Basic, last resort and bound never appear among regular cards.
  assert.deepEqual(shown(d, catalog, 'collection', 'Grab'), []);
});

test('editing works on a copy: the saved deck is untouched until the server answers', () => {
  const saved: UserGuiDeck = payload(complete());
  const d = removeRegular(toggleBound(editCopy(saved), smack), 'Regolare 1');
  assert.equal(saved.characterBoundCards.length, 2);
  assert.equal(saved.regularCards.length, 20);
  assert.equal(d.characterBoundCards.length, 1);
  assert.equal(d.regularCards.length, 19);
  assert.equal(valid(d), false);
});

test('the catalog order is stable whatever order the server set arrives in', () => {
  const order = catalogOrder([beer, kick, struggle, blade, smack, grab]).map(c => c.name);
  assert.deepEqual(order, ['BruiserGrab', 'LittleSmack', 'PatheticBlade', 'Struggle', 'Calcio', 'Birra']);
  assert.deepEqual(catalogOrder([beer, kick, struggle, blade, smack, grab].reverse()).map(c => c.name), order);
});

test('server replies are shown in Italian; unknown texts pass through', () => {
  assert.equal(serverMessage('Invalid deck: Basic and last resort required'), 'Il server ha rifiutato il mazzo (Basic and last resort required).');
  assert.equal(serverMessage('Invalid deck: Exactly 20 regular cards required, found 1. Edit or delete it in your collection.'),
    'Il mazzo non rispetta le regole attuali (Exactly 20 regular cards required, found 1): correggilo o cancellalo nella collezione.');
  assert.equal(serverMessage('Deck unavailable. Choose a saved deck from your account and retry.'), 'Mazzo non disponibile sul server: scegli un mazzo salvato e riprova.');
  assert.equal(serverMessage('Account data unavailable'), 'Dati dell’account non disponibili. Riprova.');
  assert.equal(serverMessage('Leave or resume the current game first'), 'Leave or resume the current game first');
});

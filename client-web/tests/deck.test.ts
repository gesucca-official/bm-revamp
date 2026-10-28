import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Card, CharacterCard, UserGuiDeck} from '../src/contracts.ts';
import {addBound, addRegular, basics, bounds, catalogOrder, clearBound, copies, editCopy, emptyDraft, initialCards, lastResorts, payload, problems,
  removeRegular, serverMessage, setBasic, setCharacter, setLastResort, setName, shown, valid, MAX_BOUND} from '../src/deck.ts';

const card = (bindingName: string, name: string, kind: Partial<Card> = {}): Card => ({
  name, bindingName, effect: `<p>${name} effetto</p>`, item: false, basicAction: false, lastResort: false, characterBound: false,
  boundToCharacter: null, priority: 0, canTarget: ['OPPONENT'], cost: {}, image: null, sprite: null, ...kind
});
const grab = card('com.basic.BruiserGrab', 'BruiserGrab', {basicAction: true});
const struggle = card('com.last.Struggle', 'Struggle', {lastResort: true});
const smack = card('bruiser.character.LittleSmack', 'LittleSmack', {characterBound: true, boundToCharacter: 'bruiser.character.BigBadBruiser'});
// A Junkie bound: no compatibility filter, a Bruiser deck may take it.
const blade = card('junkie.character.PatheticBlade', 'PatheticBlade', {characterBound: true, boundToCharacter: 'junkie.character.ToxicJunkie'});
const kick = card('com.Kick', 'Calcio', {effect: '<p>10 HIT al bersaglio</p>'});
const beer = card('com.items.Beer', 'Birra', {item: true, canTarget: []});
const catalog = [grab, struggle, smack, blade, kick, beer];
const spazienzio: CharacterCard = {name: 'Spazienzio de la Ucciso', bindingName: 'bruiser.character.BigBadBruiser', itemsSize: 3, resources: {HEALTH: 100}};

const complete = () => addRegular(setLastResort(setBasic(setCharacter(setName(emptyDraft(), 'Strano'), spazienzio), grab), struggle), kick);

test('slot filters follow the subtypes, without compatibility filters', () => {
  assert.deepEqual(basics(catalog), [grab]);
  assert.deepEqual(lastResorts(catalog), [struggle]);
  assert.deepEqual(bounds(catalog), [smack, blade]);
});

test('an empty draft lists every missing requirement of R02 and is not sendable', () => {
  const d = emptyDraft();
  assert.equal(problems(d).length, 5);
  assert.equal(valid(d), false);
  assert.throws(() => payload(d));
});

test('name, character, basic, last resort and one regular card are enough (no 20+2, no bound required)', () => {
  const d = complete();
  assert.deepEqual(problems(d), []);
  assert.equal(initialCards(d), 1);
  assert.equal(payload(d).regularCards.length, 1);
});

test('a blank name or a name with a slash is refused (R02 1.8); other characters are free', () => {
  assert.deepEqual(problems(setName(complete(), '   ')), ['Dai un nome al mazzo.']);
  assert.deepEqual(problems(setName(complete(), 'a/b')), ['Il nome non può contenere «/».']);
  assert.ok(valid(setName(complete(), 'Mazzo #1 è "strano" & co.')));
});

test('bound cards repeat up to five, six initial cards at most; clear empties them', () => {
  let d = complete();
  for (let i = 0; i < 7; i++) d = addBound(d, i % 2 ? blade : smack);
  assert.equal(d.characterBoundCards.length, MAX_BOUND);
  assert.equal(initialCards(d), 6);
  assert.ok(valid(d));
  assert.deepEqual(clearBound(d).characterBoundCards, []);
  // A stored deck with more bound cards (never from this editor) is still reported.
  assert.ok(problems({...d, characterBoundCards: Array(6).fill(smack)}).includes('Al massimo 5 azioni legate.'));
});

test('regular cards have no copy limit; removing takes away one copy with the same name', () => {
  let d = complete();
  for (let i = 0; i < 39; i++) d = addRegular(d, kick);
  d = addRegular(d, beer);
  assert.deepEqual(copies(d.regularCards).map(e => [e.card.name, e.n]), [['Calcio', 40], ['Birra', 1]]);
  d = removeRegular(d, 'Calcio');
  assert.equal(d.regularCards.filter(c => c.name === 'Calcio').length, 39);
  assert.deepEqual(removeRegular(d, 'Assente'), d);
  d = removeRegular(d, 'Birra');
  assert.equal(d.regularCards.some(c => c.name === 'Birra'), false);
});

test('the search matches the serialized card like the debug, in the collection or in the deck', () => {
  const d = addRegular(complete(), beer);
  assert.deepEqual(shown(d, catalog, 'collection', ''), [kick, beer]);
  assert.deepEqual(shown(d, catalog, 'collection', 'hit'), [kick]);
  assert.deepEqual(shown(d, catalog, 'collection', 'com.items'), [beer]);
  assert.deepEqual(shown(d, catalog, 'deck', 'birra'), [beer]);
  assert.deepEqual(shown(complete(), catalog, 'deck', 'birra'), []);
  // Basic, last resort and bound never appear among regular cards.
  assert.deepEqual(shown(d, catalog, 'collection', 'Grab'), []);
});

test('editing works on a copy: the saved deck is untouched until the server answers', () => {
  const saved: UserGuiDeck = payload(addBound(complete(), smack));
  const d = removeRegular(addBound(editCopy(saved), blade), 'Calcio');
  assert.equal(saved.characterBoundCards.length, 1);
  assert.equal(saved.regularCards.length, 1);
  assert.equal(d.characterBoundCards.length, 2);
  assert.equal(d.regularCards.length, 0);
  assert.equal(valid(d), false);
});

test('the catalog order is stable whatever order the server set arrives in', () => {
  const order = catalogOrder([beer, kick, struggle, blade, smack, grab]).map(c => c.name);
  assert.deepEqual(order, ['BruiserGrab', 'LittleSmack', 'PatheticBlade', 'Struggle', 'Calcio', 'Birra']);
  assert.deepEqual(catalogOrder([...catalog].reverse()).map(c => c.name), order);
});

test('server replies are shown in Italian; unknown texts pass through', () => {
  assert.equal(serverMessage('Invalid deck: Basic and last resort required'), 'Il server ha rifiutato il mazzo (Basic and last resort required).');
  assert.equal(serverMessage('Deck unavailable. Choose a saved deck from your account and retry.'), 'Mazzo non disponibile sul server: scegli un mazzo salvato e riprova.');
  assert.equal(serverMessage('Account data unavailable'), 'Dati dell’account non disponibili. Riprova.');
  assert.equal(serverMessage('Leave or resume the current game first'), 'Leave or resume the current game first');
});

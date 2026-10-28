import type {Card, CharacterCard, UserGuiDeck} from './contracts.ts';

/**
 * Deck editor rules: those of the debug editor and of regulation R02, nothing more. Character, basic and
 * last resort are one reference each; bound cards may repeat up to five (basic + bound <= 6 initial cards);
 * at least one regular card. No copy limit, no 20+2, no bound/character compatibility filter.
 * The server stays the judge: a deck accepted here can still be refused on account/error.
 */
export interface Draft {
  deckId: string; character: CharacterCard | null; basicActionCard: Card | null; lastResortCard: Card | null;
  characterBoundCards: Card[]; regularCards: Card[];
}
export const MAX_BOUND = 5, MAX_INITIAL = 6;
export type Pool = 'collection' | 'deck';

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
export const emptyDraft = (): Draft => ({deckId: '', character: null, basicActionCard: null, lastResortCard: null, characterBoundCards: [], regularCards: []});
/** Editing works on a copy: cancelling leaves the saved deck untouched. */
export const editCopy = (deck: UserGuiDeck): Draft => copy(deck);

export const isRegular = (c: Card) => !c.basicAction && !c.lastResort && !c.characterBound;
export const basics = (catalog: Card[]) => catalog.filter(c => c.basicAction);
export const lastResorts = (catalog: Card[]) => catalog.filter(c => c.lastResort);
export const bounds = (catalog: Card[]) => catalog.filter(c => c.characterBound);

const KIND = (c: Card) => c.basicAction ? 0 : c.characterBound ? 1 : c.lastResort ? 2 : c.item ? 4 : 3;
/** Stable catalog order (the server sends a set): basic, bound, last resort, regular actions, items; then by name. */
export const catalogOrder = (catalog: Card[]) => [...catalog].sort((a, b) => KIND(a) - KIND(b) || a.name.localeCompare(b.name) || a.bindingName.localeCompare(b.bindingName));

export const setName = (d: Draft, deckId: string): Draft => ({...d, deckId});
export const setCharacter = (d: Draft, character: CharacterCard): Draft => ({...d, character});
export const setBasic = (d: Draft, basicActionCard: Card): Draft => ({...d, basicActionCard});
export const setLastResort = (d: Draft, lastResortCard: Card): Draft => ({...d, lastResortCard});
/** Bound cards may be duplicated; beyond five the click is ignored, like the debug. */
export const addBound = (d: Draft, card: Card): Draft => d.characterBoundCards.length < MAX_BOUND ? {...d, characterBoundCards: [...d.characterBoundCards, card]} : d;
export const clearBound = (d: Draft): Draft => ({...d, characterBoundCards: []});
export const addRegular = (d: Draft, card: Card): Draft => ({...d, regularCards: [...d.regularCards, card]});
/** Removes one copy with the same name (the first one), like the debug deck view. */
export const removeRegular = (d: Draft, name: string): Draft => {
  const i = d.regularCards.findIndex(c => c.name === name);
  return i < 0 ? d : {...d, regularCards: d.regularCards.filter((_, j) => j !== i)};
};

/** Basic plus every bound copy, counted before the draws (R02). */
export const initialCards = (d: Draft) => (d.basicActionCard ? 1 : 0) + d.characterBoundCards.length;

/**
 * Regular cards shown by the editor: the whole collection or the deck, filtered like the debug search
 * (case-insensitive substring of the serialized card, so name, effect text and fields all match).
 */
export const shown = (d: Draft, catalog: Card[], pool: Pool, term: string) => {
  const t = term.toUpperCase();
  return (pool === 'deck' ? d.regularCards : catalog).filter(c => isRegular(c) && JSON.stringify(c).toUpperCase().includes(t));
};

/** Copies per name in first-appearance order: the deck view groups identical cards. */
export const copies = (cards: Card[]) => {
  const out = new Map<string, {card: Card; n: number}>();
  cards.forEach(card => { const e = out.get(card.name); if (e) e.n++; else out.set(card.name, {card, n: 1}); });
  return [...out.values()];
};

/** What is still missing, in the editor order; empty means the deck can be sent. */
export function problems(d: Draft): string[] {
  const out: string[] = [];
  if (!d.deckId.trim()) out.push('Dai un nome al mazzo.');
  // R02 1.8: the name is a path segment of the open start request.
  else if (d.deckId.includes('/')) out.push('Il nome non può contenere «/».');
  if (!d.character) out.push('Scegli il personaggio.');
  if (!d.basicActionCard) out.push('Scegli l’azione base.');
  if (!d.lastResortCard) out.push('Scegli l’ultima risorsa.');
  if (d.characterBoundCards.length > MAX_BOUND) out.push(`Al massimo ${MAX_BOUND} azioni legate.`);
  if (!d.regularCards.length) out.push('Metti almeno una carta regolare nel mazzo.');
  return out;
}
export const valid = (d: Draft) => problems(d).length === 0;

/** The UserGuiDeck sent to the server; only called on a valid draft. */
export function payload(d: Draft): UserGuiDeck {
  if (!valid(d)) throw new Error('Mazzo incompleto');
  return copy(d) as UserGuiDeck;
}

/** Server replies on account/error and open/1vCom/error, in Italian (D1); unknown texts pass through. */
export function serverMessage(body: string): string {
  if (body.startsWith('Invalid deck: ')) return `Il server ha rifiutato il mazzo (${body.slice(14)}).`;
  if (body.startsWith('Deck unavailable')) return 'Mazzo non disponibile sul server: scegli un mazzo salvato e riprova.';
  if (body === 'Account data unavailable') return 'Dati dell’account non disponibili. Riprova.';
  return body;
}

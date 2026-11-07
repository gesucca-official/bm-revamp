import type {Card, CharacterCard, UserGuiDeck} from './contracts.ts';

/**
 * Deck editor rules: those of regulation 1.12 R02, the same the server applies. The character's own basic (fixed: chosen
 * with the character), two different bound cards of the character, a generic or own last resort, exactly 20 regular
 * cards with at most 2 copies each, items included. Ownership comes from the catalog: `boundToCharacter` for a bound,
 * `exclusiveToCharacter` for a basic or a last resort (absent = generic).
 * The editor prevents what it can (lists only allowed cards, ignores a third copy or a 21st card) and still reports every
 * broken rule, because a deck saved under older rules can be opened here. The server stays the judge.
 */
export interface Draft {
  deckId: string; character: CharacterCard | null; basicActionCard: Card | null; lastResortCard: Card | null;
  characterBoundCards: Card[]; regularCards: Card[];
}
export const REGULAR_CARDS = 20, MAX_COPIES = 2, BOUND_CARDS = 2, INITIAL_CARDS = 1 + BOUND_CARDS;
export type Pool = 'collection' | 'deck';

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
export const emptyDraft = (): Draft => ({deckId: '', character: null, basicActionCard: null, lastResortCard: null, characterBoundCards: [], regularCards: []});
/** Editing works on a copy: cancelling leaves the saved deck untouched. */
export const editCopy = (deck: UserGuiDeck): Draft => copy(deck);

export const isRegular = (c: Card) => !c.basicAction && !c.lastResort && !c.characterBound;
export const basics = (catalog: Card[]) => catalog.filter(c => c.basicAction);
export const lastResorts = (catalog: Card[]) => catalog.filter(c => c.lastResort);
export const bounds = (catalog: Card[]) => catalog.filter(c => c.characterBound);

const own = (owner: string | null | undefined, character: CharacterCard | null) => !!character && owner === character.bindingName;
/** The character's fixed basic(s): one per character in the catalog. Nothing before the character is chosen. */
export const ownBasics = (catalog: Card[], character: CharacterCard | null) => basics(catalog).filter(c => own(c.exclusiveToCharacter, character));
/** The bound cards of the character, among which the deck takes two. */
export const ownBounds = (catalog: Card[], character: CharacterCard | null) => bounds(catalog).filter(c => own(c.boundToCharacter, character));
/** Generic last resorts, plus those reserved to the character. */
export const allowedLastResorts = (catalog: Card[], character: CharacterCard | null) =>
  lastResorts(catalog).filter(c => !c.exclusiveToCharacter || own(c.exclusiveToCharacter, character));

const KIND = (c: Card) => c.basicAction ? 0 : c.characterBound ? 1 : c.lastResort ? 2 : c.item ? 4 : 3;
/** Stable catalog order (the server sends a set): basic, bound, last resort, regular actions, items; then by name. */
export const catalogOrder = (catalog: Card[]) => [...catalog].sort((a, b) => KIND(a) - KIND(b) || a.name.localeCompare(b.name) || a.bindingName.localeCompare(b.bindingName));

export const setName = (d: Draft, deckId: string): Draft => ({...d, deckId});
/**
 * Choosing the character sets its fixed basic and drops what belongs to another character (bound cards, a reserved
 * last resort). Regular cards are shared by every character and stay.
 */
export const setCharacter = (d: Draft, character: CharacterCard, catalog: Card[] = []): Draft => {
  const basic = ownBasics(catalog, character);
  return {...d, character,
    basicActionCard: basic.length === 1 ? basic[0] : d.basicActionCard && own(d.basicActionCard.exclusiveToCharacter, character) ? d.basicActionCard : null,
    characterBoundCards: d.characterBoundCards.filter(c => own(c.boundToCharacter, character)),
    lastResortCard: d.lastResortCard && (!d.lastResortCard.exclusiveToCharacter || own(d.lastResortCard.exclusiveToCharacter, character)) ? d.lastResortCard : null};
};
export const setBasic = (d: Draft, basicActionCard: Card): Draft => ({...d, basicActionCard});
export const setLastResort = (d: Draft, lastResortCard: Card): Draft => ({...d, lastResortCard});
/** A bound is taken or left with one click; never a repeat, never more than two. */
export const toggleBound = (d: Draft, card: Card): Draft => d.characterBoundCards.some(c => c.bindingName === card.bindingName)
  ? {...d, characterBoundCards: d.characterBoundCards.filter(c => c.bindingName !== card.bindingName)}
  : d.characterBoundCards.length < BOUND_CARDS ? {...d, characterBoundCards: [...d.characterBoundCards, card]} : d;
export const clearBound = (d: Draft): Draft => ({...d, characterBoundCards: []});
export const copiesOf = (d: Draft, card: Card) => d.regularCards.filter(c => c.bindingName === card.bindingName).length;
/** Room for one more copy: below 2 copies of that card and below 20 regular cards. */
export const canAdd = (d: Draft, card: Card) => d.regularCards.length < REGULAR_CARDS && copiesOf(d, card) < MAX_COPIES;
/** A third copy or a 21st card is ignored, like a third bound. */
export const addRegular = (d: Draft, card: Card): Draft => canAdd(d, card) ? {...d, regularCards: [...d.regularCards, card]} : d;
/** Removes one copy with the same name (the first one), like the debug deck view. */
export const removeRegular = (d: Draft, name: string): Draft => {
  const i = d.regularCards.findIndex(c => c.name === name);
  return i < 0 ? d : {...d, regularCards: d.regularCards.filter((_, j) => j !== i)};
};

/** Basic plus every bound, counted before the draws (R02): three in a valid deck. */
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

/** What is still missing or broken, in the editor order; empty means the deck can be sent (R02 1.12). */
export function problems(d: Draft): string[] {
  const out: string[] = [];
  if (!d.deckId.trim()) out.push('Dai un nome al mazzo.');
  // R02 1.8: the name is a path segment of the open start request.
  else if (d.deckId.includes('/')) out.push('Il nome non può contenere «/».');
  if (!d.character) out.push('Scegli il personaggio.');
  if (!d.basicActionCard) out.push('Scegli l’azione base.');
  else if (d.character && !own(d.basicActionCard.exclusiveToCharacter, d.character))
    out.push(`${d.basicActionCard.name} non è l’azione base di ${d.character.name}.`);
  if (!d.lastResortCard) out.push('Scegli l’ultima risorsa.');
  else if (d.character && d.lastResortCard.exclusiveToCharacter && !own(d.lastResortCard.exclusiveToCharacter, d.character))
    out.push(`${d.lastResortCard.name} è riservata a un altro personaggio.`);
  const seen = new Set<string>();
  for (const b of d.characterBoundCards) {
    if (d.character && !own(b.boundToCharacter, d.character)) out.push(`${b.name} è legata a un altro personaggio.`);
    if (seen.has(b.bindingName)) out.push(`Le azioni legate devono essere diverse: ${b.name} è ripetuta.`);
    seen.add(b.bindingName);
  }
  if (d.characterBoundCards.length !== BOUND_CARDS) out.push(`Scegli ${BOUND_CARDS} azioni legate diverse (ne hai ${d.characterBoundCards.length}).`);
  if (d.regularCards.length !== REGULAR_CARDS) out.push(`Servono esattamente ${REGULAR_CARDS} carte regolari: ne hai ${d.regularCards.length}.`);
  for (const e of copies(d.regularCards)) if (e.n > MAX_COPIES) out.push(`Al massimo ${MAX_COPIES} copie per carta: ${e.card.name} ne ha ${e.n}.`);
  return out;
}
export const valid = (d: Draft) => problems(d).length === 0;

/** The UserGuiDeck sent to the server; only called on a valid draft. */
export function payload(d: Draft): UserGuiDeck {
  if (!valid(d)) throw new Error('Mazzo incompleto');
  return copy(d) as UserGuiDeck;
}

const AT_USE = '. Edit or delete it in your collection.';
/** Server replies on account/error and open/1vCom/error, in Italian (D1); unknown texts pass through. */
export function serverMessage(body: string): string {
  // R02 1.12: a deck saved under older rules is refused at the open start, with the broken rule.
  if (body.startsWith('Invalid deck: ') && body.endsWith(AT_USE))
    return `Il mazzo non rispetta le regole attuali (${body.slice(14, -AT_USE.length)}): correggilo o cancellalo nella collezione.`;
  if (body.startsWith('Invalid deck: ')) return `Il server ha rifiutato il mazzo (${body.slice(14)}).`;
  if (body.startsWith('Deck unavailable')) return 'Mazzo non disponibile sul server: scegli un mazzo salvato e riprova.';
  if (body === 'Account data unavailable') return 'Dati dell’account non disponibili. Riprova.';
  return body;
}

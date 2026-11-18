// Ritaglio dei DTO wire correnti, non un modello del motore.
export type Resource = 'HEALTH' | 'ALERTNESS' | 'VIOLENCE' | 'TOXICITY' | 'ALCOHOL';
export interface Card {
  name: string; bindingName: string; effect: string; item: boolean;
  basicAction: boolean; lastResort: boolean; characterBound: boolean;
  boundToCharacter: string | null; priority: number;
  canTarget: ('SELF' | 'OPPONENT' | 'NEAR_ITEM' | 'FAR_ITEM')[];
  cost: Partial<Record<Resource, number>>;
  image: string | null; sprite: string | null;
  // Descriptive catalog fields (regulation 1.7 R07a, 1.9 and 1.10); absent on older servers.
  // `damage`: "HIT", "CUT", "POISON", several as "HIT, CUT" or "—"; `damageAmount`: "HIT 15", "HIT 20+x", "—".
  // SB-19 (RP-27, RP-28): the «In campo» effect of an item as short text, e.g. "−3 A" or "+2 T"; absent on every other card.
  inPlay?: string | null;
  role?: string | null; gains?: string | null; damage?: string | null; damageAmount?: string | null;
  // Regulation 1.12 R02: the character a basic or last resort is reserved to (null = generic); read by the deck editor.
  exclusiveToCharacter?: string | null;
}
export interface Status {
  name: string; description: string; type: string; flow: string;
  impactedProperty: string; lastsForTurns: number | null; equip: boolean;
  singleUse: boolean; amountFunction: object; typeFunction: object;
  /**
   * SB-16g 2a (D64, D66, D69), playground rules only: the vulnerability token of a charge, one status per damage type with the
   * same `exposure`; `factor` multiplies the damage received. `untilPlayed`: the name of the card whose play ends it at turn end (any copy),
   * D71: no timer while copies remain, one whole turn after exhaustion. D72: no token on failed search. Absent on
   * every other status.
   */
  exposure?: number; factor?: number; untilPlayed?: string;
}
export interface Character {
  name: string; bindingName: string; dead: boolean; itemsSize: number;
  items: Card[]; resources: Partial<Record<Resource, number>>;
  statuses: Status[]; immunities: Resource[];
  timers: {name: string; timer: number; callback: object}[]; sprite: string | null;
  /**
   * SB-16i («Rincara», D97), playground rules only: the public counter of this character's plays in the match, voided ones
   * included, by card name in lower case; always present with those rules (empty before the first play), absent with the live rules.
   */
  plays?: Record<string, number>;
}
/**
 * SB-16g 2a (D58), playground rules only: a copy found by a search, face up in its owner's hand for everyone until it is played or
 * discarded. `copy` is its stable id, `turn` the turn it was found, `slot` its index in `cardsInHand` (own view only).
 */
export interface RevealedCard {copy: number; card: Card; turn: number; slot?: number}
/**
 * `searchable`: SB-16i (D97, D102), own view and playground rules only: for each card in hand announcing two names, by its binding,
 * the announced names with a copy in the own deck, in printed order (two: the player chooses; one: searched without asking; none:
 * the search will fail). Absent with the live rules.
 */
export interface Player {playerId: string; character: Character; cardsInHand: Card[] | number; deck: number; revealed?: RevealedCard[]; lastTokenCopies?: string[]; searchable?: Record<string, string[]>}
export interface Command {
  playedCardName: string; playerId: string; targetId: string; gameId: string;
  choices: Partial<Record<'DISCARD_ONE' | 'TARGET_ITEM', string>> | null;
  /** SB-16i (D102), playground rules only: the binding chosen between the two names of «Annuncia X o Y»; never sent otherwise. */
  searchChoice?: string;
}
/**
 * SB-16f0 (D56): with the playground rules (profile `bozza`) a move may carry why the engine voided it (`voidReason`, today only
 * «a terra», D50 point 1) and the search that replaced its draw (D50 point 6): the binding searched for, whether a copy was found
 * and the card found, shown to everyone. Both are absent with the live rules.
 */
export interface MoveSearch {card: string; found: boolean; revealed?: Card; copy?: number; /** SB-16i: the two names announced, in printed order; `card` is the one chosen. */ announced?: string[]}
/**
 * SB-16i (D97), playground rules only and absent otherwise: `ahead`, for a card with «Gioca d'anticipo», whether it resolved before
 * the target's move; `plays`, for a card with «Rincara», how many times its author had already played it.
 */
export interface Move extends Command {
  void: boolean; moveReport: Partial<Record<'SELF' | 'OPPONENT', string[]>>;
  voidReason?: string; search?: MoveSearch; ahead?: boolean; plays?: number;
}
export interface View {
  gameId: string; players: Record<string, Player>; resolvedMoves: Move[];
  timeBasedEffects: Record<string, string[]>; over: boolean; winner: string;
  turn: number; pendingMove: Move | null; forfeits: Record<string, string>;
  moveDeadlines: Record<string, number>; reconnectDeadlines: Record<string, number>;
  outcomeReason: string | null;
}
export interface CharacterCard {name: string; bindingName: string; itemsSize: number; resources: Partial<Record<Resource, number>>}
export interface UserGuiDeck {
  deckId: string; character: CharacterCard; basicActionCard: Card; lastResortCard: Card;
  characterBoundCards: Card[]; regularCards: Card[];
}
export interface Presence {userLogin: string; activity: string}
/** One entry of the public FFA queue list; queued computers all share the id QueuedComPlayer. */
export interface FfaEntry {playerId: string; human: boolean}
export interface Account {username: string; email: string | null; role: string; decks?: UserGuiDeck[]; collection: {cards: Card[]; characters?: CharacterCard[]} | null}
export interface Outcome {over: boolean; result: string; winner: string | null; reason: string}
export interface ResumeState {status: 'none' | 'resumed' | 'finished'; gameId?: string; view?: View; archived?: boolean; outcome?: Outcome}

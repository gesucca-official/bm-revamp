// Ritaglio dei DTO wire correnti, non un modello del motore.
export type Resource = 'HEALTH' | 'ALERTNESS' | 'VIOLENCE' | 'TOXICITY' | 'ALCOHOL';
export interface Card {
  name: string; bindingName: string; effect: string; item: boolean;
  basicAction: boolean; lastResort: boolean; characterBound: boolean;
  boundToCharacter: string | null; priority: number;
  canTarget: ('SELF' | 'OPPONENT' | 'NEAR_ITEM' | 'FAR_ITEM')[];
  cost: Partial<Record<Resource, number>>;
  image: string | null; sprite: string | null;
  // Descriptive catalog fields (regulation 1.7 R07a); absent on older servers.
  role?: string | null; gains?: string | null;
}
export interface Status {
  name: string; description: string; type: string; flow: string;
  impactedProperty: string; lastsForTurns: number | null; equip: boolean;
  singleUse: boolean; amountFunction: object; typeFunction: object;
}
export interface Character {
  name: string; bindingName: string; dead: boolean; itemsSize: number;
  items: Card[]; resources: Partial<Record<Resource, number>>;
  statuses: Status[]; immunities: Resource[];
  timers: {name: string; timer: number; callback: object}[]; sprite: string | null;
}
export interface Player {playerId: string; character: Character; cardsInHand: Card[] | number; deck: number}
export interface Command {
  playedCardName: string; playerId: string; targetId: string; gameId: string;
  choices: Partial<Record<'DISCARD_ONE' | 'TARGET_ITEM', string>> | null;
}
export interface Move extends Command {void: boolean; moveReport: Partial<Record<'SELF' | 'OPPONENT', string[]>>}
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

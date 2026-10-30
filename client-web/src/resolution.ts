import type {Card, Move, Resource, View} from './contracts.ts';

// Certain facts of one resolved round (C3-1, plan D1). Built only from structured fields of two views and the
// catalog: the server's sentences (moveReport, timeBasedEffects lines) are never read, no card effect is computed
// and nothing is attributed to a single move unless the view says so.

/** How the new view relates to the previous one. Only `next` carries a round difference (D4). */
export type Relation = 'first' | 'same' | 'next' | 'jump' | 'other-game' | 'older';

export type MoveFact = {
  index: number; author: string; card: string;
  /** Target player id: SELF resolved to the author. */
  target: string; self: boolean;
  /** TARGET_ITEM as published, with the owner it was chosen on (the target player). */
  item: {owner: string; name: string} | null;
  /** DISCARD_ONE as published (bound cards). */
  discard: string | null;
  void: boolean;
  /** Nominal cost from the catalog by display name; null if the name is unknown. The paid amount may differ (R05). */
  cost: Partial<Record<Resource, number>> | null;
  /** Only on a contiguous round: the chosen object disappeared from that seat and this move is the only one naming it. */
  itemGone: boolean;
  /** Only on a contiguous round: an object of the same name appeared at the author's seat in the same round. */
  itemAtAuthor: boolean;
};

export type ResourceChange = {before: number | null; after: number | null; delta: number};

export type SeatFact = {
  /** Every resource present in either view; delta = after - before, a missing value counts as absent (0 in the sum). */
  resources: Partial<Record<Resource, ResourceChange>>;
  /** Objects by name, with multiplicity: gone from this seat and appeared at it. */
  itemsGone: string[]; itemsAppeared: string[];
  /** Objects gone that a move's TARGET_ITEM names on this seat (see MoveFact.itemGone). */
  itemsLinked: string[];
  hand: {before: number; after: number}; deck: {before: number; after: number};
  /** Own seat only: card names that left the hand and arrived in it. */
  handLeft?: string[]; handArrived?: string[];
  died: boolean; forfeit: string | null;
};

export type ResolutionFacts = {
  gameId: string; turn: number; key: string;
  relation: Relation; contiguous: boolean;
  /** Turns resolved between the two views (0 for first/same/other). */
  turnsAdvanced: number;
  /** Moves of the LAST round in resolution order; always certain, also after a jump. */
  moves: MoveFact[];
  /** Per-seat differences: only for a contiguous round, otherwise null (rule 3). */
  seats: Record<string, SeatFact> | null;
  /** Players with end-of-turn lines in the last round (who, never what). */
  endOfTurn: string[];
  outcome: {over: boolean; winner: string; reason: string | null};
};

export const resolutionKey = (v: View) => `${v.gameId}/${v.turn}`;

export function relation(previous: View | null, next: View): Relation {
  if (!previous) return 'first';
  if (previous.gameId !== next.gameId) return 'other-game';
  if (next.turn === previous.turn) return 'same';
  if (next.turn < previous.turn) return 'older';
  return next.turn === previous.turn + 1 ? 'next' : 'jump';
}

const count = (names: string[]) => names.reduce((m, n) => m.set(n, (m.get(n) ?? 0) + 1), new Map<string, number>());
/** Multiset difference a - b, in the order of a. */
function minus(a: string[], b: string[]) {
  const left = count(b);
  return a.filter(n => { const k = left.get(n) ?? 0; if (k > 0) { left.set(n, k - 1); return false; } return true; });
}
const handSize = (h: Card[] | number) => typeof h === 'number' ? h : h.length;
const RESOURCE_ORDER: Resource[] = ['HEALTH', 'ALERTNESS', 'VIOLENCE', 'TOXICITY', 'ALCOHOL'];

function moveFact(m: Move, index: number, costs: Map<string, Card>): MoveFact {
  const self = m.targetId === 'SELF' || m.targetId === m.playerId, target = self ? m.playerId : m.targetId;
  const choices = m.choices ?? {}, card = costs.get(m.playedCardName);
  return {
    index, author: m.playerId, card: m.playedCardName, target, self,
    item: choices.TARGET_ITEM ? {owner: target, name: choices.TARGET_ITEM} : null,
    discard: choices.DISCARD_ONE ?? null, void: !!m.void,
    cost: card ? {...card.cost} : null, itemGone: false, itemAtAuthor: false,
  };
}

function seatFact(id: string, before: View, after: View, me: string): SeatFact {
  const p = before.players[id], n = after.players[id];
  const resources: SeatFact['resources'] = {};
  const keys = new Set([...Object.keys(p?.character.resources ?? {}), ...Object.keys(n.character.resources)] as Resource[]);
  for (const r of [...RESOURCE_ORDER.filter(r => keys.has(r)), ...[...keys].filter(r => !RESOURCE_ORDER.includes(r))]) {
    const b = p?.character.resources[r] ?? null, a = n.character.resources[r] ?? null;
    resources[r] = {before: b, after: a, delta: (a ?? 0) - (b ?? 0)};
  }
  const oldItems = (p?.character.items ?? []).map(c => c.name), newItems = n.character.items.map(c => c.name);
  const fact: SeatFact = {
    resources, itemsGone: minus(oldItems, newItems), itemsAppeared: minus(newItems, oldItems), itemsLinked: [],
    hand: {before: p ? handSize(p.cardsInHand) : 0, after: handSize(n.cardsInHand)},
    deck: {before: p?.deck ?? 0, after: n.deck},
    died: !p?.character.dead && n.character.dead,
    forfeit: !before.forfeits[id] && after.forfeits[id] ? after.forfeits[id] : null,
  };
  if (id === me && Array.isArray(n.cardsInHand)) {
    const old = Array.isArray(p?.cardsInHand) ? p.cardsInHand.map(c => c.name) : [], now = n.cardsInHand.map(c => c.name);
    fact.handLeft = minus(old, now); fact.handArrived = minus(now, old);
  }
  return fact;
}

/**
 * Facts of the round published by `next`, relative to the last view the client held.
 * `catalog` gives nominal costs by display name (the own hand may be passed too).
 */
export function resolve(previous: View | null, next: View, me: string, catalog: Card[] = []): ResolutionFacts {
  const rel = relation(previous, next), contiguous = rel === 'next';
  const costs = new Map<string, Card>();
  for (const c of catalog) if (!costs.has(c.name)) costs.set(c.name, c);
  const moves = next.resolvedMoves.map((m, i) => moveFact(m, i, costs));
  let seats: ResolutionFacts['seats'] = null;
  if (contiguous) {
    seats = Object.fromEntries(Object.keys(next.players).map(id => [id, seatFact(id, previous!, next, me)]));
    // An object gone from a seat is linked to a move only when that move (not voided) names it on that seat and
    // no other move competes for the same name there with fewer disappearances than claims.
    const claims = new Map<string, MoveFact[]>();
    for (const m of moves) if (m.item && !m.void) {
      const k = `${m.item.owner}\u0000${m.item.name}`; claims.set(k, [...(claims.get(k) ?? []), m]);
    }
    for (const [k, list] of claims) {
      const [owner, name] = k.split('\u0000'), seat = seats[owner];
      if (!seat) continue;
      const gone = seat.itemsGone.filter(n => n === name).length;
      if (gone < list.length) continue;
      for (const m of list) {
        m.itemGone = true; seat.itemsLinked.push(name);
        m.itemAtAuthor = m.author !== owner && !!seats[m.author]?.itemsAppeared.includes(name);
      }
    }
  }
  return {
    gameId: next.gameId, turn: next.turn, key: resolutionKey(next), relation: rel, contiguous,
    turnsAdvanced: rel === 'next' || rel === 'jump' ? next.turn - previous!.turn : 0,
    moves, seats,
    endOfTurn: Object.entries(next.timeBasedEffects ?? {}).filter(([, lines]) => Array.isArray(lines) && lines.length > 0).map(([id]) => id),
    outcome: {over: next.over, winner: next.winner, reason: next.outcomeReason ?? null},
  };
}

/**
 * Applies the per-seat differences to the previous view and lists every mismatch with the new view
 * (completion check of C3-1). Empty for a correct contiguous round.
 */
export function mismatches(previous: View, next: View, facts: ResolutionFacts): string[] {
  if (!facts.seats) return facts.contiguous ? ['contiguous round without seats'] : [];
  const out: string[] = [];
  const sorted = (a: string[]) => [...a].sort().join('|');
  for (const [id, n] of Object.entries(next.players)) {
    const s = facts.seats[id], p = previous.players[id];
    if (!s) { out.push(`${id}: no seat`); continue; }
    const keys = new Set([...Object.keys(p?.character.resources ?? {}), ...Object.keys(n.character.resources)] as Resource[]);
    for (const r of keys) {
      const c = s.resources[r], b = p?.character.resources[r], a = n.character.resources[r];
      if (!c) { out.push(`${id} ${r}: missing`); continue; }
      if ((b ?? 0) + c.delta !== (a ?? 0) || (c.after ?? undefined) !== a || (c.before ?? undefined) !== b) out.push(`${id} ${r}: ${b}+${c.delta}≠${a}`);
    }
    const items = minus([...(p?.character.items ?? []).map(c => c.name), ...s.itemsAppeared], s.itemsGone);
    if (sorted(items) !== sorted(n.character.items.map(c => c.name))) out.push(`${id} items: ${sorted(items)} ≠ ${sorted(n.character.items.map(c => c.name))}`);
    if (s.hand.after !== handSize(n.cardsInHand) || s.deck.after !== n.deck) out.push(`${id} counts`);
    if (p && (s.hand.before !== handSize(p.cardsInHand) || s.deck.before !== p.deck)) out.push(`${id} previous counts`);
    if (s.handLeft && Array.isArray(n.cardsInHand)) {
      const own = Array.isArray(p?.cardsInHand) ? p.cardsInHand.map(c => c.name) : [];
      if (sorted(minus([...own, ...s.handArrived!], s.handLeft)) !== sorted(n.cardsInHand.map(c => c.name))) out.push(`${id} own hand`);
    }
    if (s.died !== (!p?.character.dead && n.character.dead)) out.push(`${id} death`);
  }
  return out;
}

/** One round as the client holds it (C3-2): facts plus whether they may be shown as a difference. */
export type Round = {
  facts: ResolutionFacts;
  /** The previous view belongs to an earlier connection or to a reset: never a difference (rule 3). */
  crossed: boolean;
};
/** A round has a per-seat difference only when contiguous and from the same connection (D4, rule 3). */
export const hasDifference = (r: Round | null) => !!r && r.facts.contiguous && !r.crossed && !!r.facts.seats;
/** The sequence plays only for such a round with moves, at most once per key, and only when motion is possible. */
export function plays(r: Round | null, seen: string, motion: {reduced: boolean; hidden: boolean; contextLost: boolean}) {
  return hasDifference(r) && r!.facts.moves.length > 0 && r!.facts.key !== seen && !motion.reduced && !motion.hidden && !motion.contextLost;
}

export type SeatMark = {key: Resource | 'ITEMS'; delta: number; text: string};
const MARK_LETTER: Record<Resource, string> = {HEALTH: 'H', ALERTNESS: 'A', VIOLENCE: 'V', TOXICITY: 'T', ALCOHOL: 'L'};
const signed = (n: number) => `${n > 0 ? '+' : '−'}${Math.abs(n)}`;
/**
 * Static round summary per seat (rule 5): the overall change of every resource and the objects gone and
 * appeared, as the model gives them. Null without a difference (jump, other game, earlier connection).
 */
export function seatMarks(r: Round | null): Record<string, SeatMark[]> | null {
  if (!hasDifference(r)) return null;
  return Object.fromEntries(Object.entries(r!.facts.seats!).map(([id, s]) => {
    const marks: SeatMark[] = (Object.entries(s.resources) as [Resource, ResourceChange][]).filter(([, c]) => c.delta)
      .map(([k, c]) => ({key: k, delta: c.delta, text: `${MARK_LETTER[k] ?? k} ${signed(c.delta)}`}));
    if (s.itemsGone.length) marks.push({key: 'ITEMS', delta: -s.itemsGone.length, text: `ogg ${signed(-s.itemsGone.length)}`});
    if (s.itemsAppeared.length) marks.push({key: 'ITEMS', delta: s.itemsAppeared.length, text: `ogg ${signed(s.itemsAppeared.length)}`});
    return [id, marks];
  }));
}

/** The line shown instead of a difference (D4); null when the round has its difference. Turns are shown 1-based. */
export function roundNote(r: Round | null): string | null {
  if (!r || hasDifference(r)) return null;
  const f = r.facts, last = `Turno ${f.turn}`;
  if (f.relation === 'jump') return `Risolti ${f.turnsAdvanced} turni fino al ${last.toLowerCase()}: valori finali della vista. L’ultimo turno è in «Ultimo turno».`;
  if (r.crossed) return `${last} risolto mentre eri fuori linea: valori finali della vista. Dettagli in «Ultimo turno».`;
  return null;
}

/**
 * Pace of the round sequence (C3-2 revision, owner after the C3-2 trial; D10 raised to 10 s, D12; phases of C3-4): the
 * costs leave the authors together, then one card at a time — it appears at the author, flies to the target and hits it
 * — then the draws, the end of turn and the tail (total bars of D5, deaths). Moves share what the 10 s budget leaves,
 * between moveMin and moveMax; with many moves everything is scaled to stay within the budget.
 */
export const PACE = {budget: 10000, moveMin: 850, moveMax: 1500, costs: 650, draws: 650, endOfTurn: 750, tail: 800};
/** Phases inside a move, as fractions of its duration: appear at the author, fly, hit the target (then to the discard). */
export const MOVE_PHASE = {appear: .22, fly: .72};
export type Span = {at: number; dur: number};
export type Pace = {costs: Span | null; moves: Span[]; draws: Span | null; endOfTurn: Span | null; tail: Span; total: number};
export function pace(moves: number, phases: {costs?: boolean; draws?: boolean; endOfTurn?: boolean} = {}): Pace {
  const fixed = PACE.tail + (phases.costs ? PACE.costs : 0) + (phases.draws ? PACE.draws : 0) + (phases.endOfTurn ? PACE.endOfTurn : 0);
  const move = moves ? Math.max(PACE.moveMin, Math.min(PACE.moveMax, (PACE.budget - fixed) / moves)) : 0;
  const scale = Math.min(1, PACE.budget / (fixed + moves * move));
  let at = 0;
  const span = (d: number): Span => { const s = {at: Math.round(at), dur: Math.round(d * scale)}; at += d * scale; return s; };
  const costs = phases.costs ? span(PACE.costs) : null, list = Array.from({length: moves}, () => span(move));
  const draws = phases.draws ? span(PACE.draws) : null, endOfTurn = phases.endOfTurn ? span(PACE.endOfTurn) : null, tail = span(PACE.tail);
  return {costs, moves: list, draws, endOfTurn, tail, total: Math.round(at)};
}
/** D12: a tap jumps to the next card (then the draws, the end of turn, the tail); past the last stop it means the end. */
export function nextStop(p: Pace, elapsed: number) {
  const stops = [...p.moves.map(m => m.at), ...[p.draws, p.endOfTurn].flatMap(x => x ? [x.at] : []), p.tail.at, p.total];
  return stops.find(s => s > elapsed + 1) ?? p.total;
}

// --- C3-4: per-card changes from the regular report lines, verified on the views (plan D1 as reopened by the owner) ---

/** One change of a resource at a seat, from a nominal cost or a regular report line. */
export type Step = {seat: string; resource: Resource; from: number; to: number};
export type ReportSteps =
  | {verified: true; costs: Step[]; moves: Step[][]; endOfTurn: Step[]}
  | {verified: false; reason: string};

// The only form read: "RESOURCE: before->after (delta)", written by one server method, ending the line and preceded at
// most by a label in parentheses (end-of-turn lines). Any other line, or any other part of a line, is free text and is
// never interpreted (D1).
const REGULAR = /^(?:\([^()]*\) )?(HEALTH|ALERTNESS|VIOLENCE|TOXICITY|ALCOHOL): (-?\d+)->(-?\d+) \((-?\d+)\)$/;
export function regularLine(line: string): {resource: Resource; from: number; to: number; consistent: boolean} | null {
  const m = REGULAR.exec(line);
  if (!m) return null;
  const from = Number(m[2]), to = Number(m[3]);
  return {resource: m[1] as Resource, from, to, consistent: to - from === Number(m[4])};
}

/**
 * Steps of a contiguous round in resolution order (R04): the nominal costs of every move first, then the regular lines
 * of each move (SELF at the author, OPPONENT at the target, which for a move on oneself is the author), then the
 * end-of-turn lines. Accepted only when every line starts where the previous step on that seat and resource left it
 * and the steps end exactly at the new view; otherwise the round falls back to its totals (D5) with the reason.
 */
export function reportSteps(previous: View, next: View, facts: ResolutionFacts, costOf: (card: string) => MoveFact['cost'] = () => null): ReportSteps {
  if (!facts.contiguous || !facts.seats) return {verified: false, reason: 'round without a difference'};
  const fail = (reason: string): ReportSteps => ({verified: false, reason});
  const value: Record<string, Partial<Record<Resource, number>>> = {};
  for (const id of Object.keys(next.players)) value[id] = {...(previous.players[id]?.character.resources ?? {})};
  const costs: Step[] = [];
  for (const m of facts.moves) {
    const cost = m.cost ?? costOf(m.card);
    if (!cost) return fail(`unknown cost of ${m.card}`);
    if (!value[m.author]) return fail(`unknown seat ${m.author}`);
    for (const r of RESOURCE_ORDER) {
      const c = cost[r];
      if (!c) continue;
      const from = value[m.author][r] ?? 0;
      costs.push({seat: m.author, resource: r, from, to: from - c}); value[m.author][r] = from - c;
    }
  }
  let problem: string | null = null;
  const apply = (seat: string, lines: string[] | undefined, where: string, into: Step[]) => {
    for (const line of lines ?? []) {
      const l = regularLine(line);
      if (!l || problem) continue;
      if (!l.consistent) { problem = `${where}: delta of ${l.resource}`; return; }
      if (!value[seat]) { problem = `${where}: unknown seat ${seat}`; return; }
      const at = value[seat][l.resource] ?? 0;
      if (at !== l.from) { problem = `${where}: ${seat} ${l.resource} from ${l.from}, previous step left ${at}`; return; }
      into.push({seat, resource: l.resource, from: l.from, to: l.to}); value[seat][l.resource] = l.to;
    }
  };
  const moves = facts.moves.map((m, i) => {
    const steps: Step[] = [], report = next.resolvedMoves[i]?.moveReport ?? {};
    apply(m.author, report.SELF, `move ${i} SELF`, steps); apply(m.target, report.OPPONENT, `move ${i} OPPONENT`, steps);
    return steps;
  });
  const endOfTurn: Step[] = [];
  for (const [id, lines] of Object.entries(next.timeBasedEffects ?? {})) apply(id, lines, `end of turn ${id}`, endOfTurn);
  if (problem) return fail(problem);
  for (const [id, p] of Object.entries(next.players)) {
    const keys = new Set([...Object.keys(previous.players[id]?.character.resources ?? {}), ...Object.keys(p.character.resources)] as Resource[]);
    for (const r of keys) if ((value[id]?.[r] ?? 0) !== (p.character.resources[r] ?? 0))
      return fail(`${id} ${r}: steps end at ${value[id]?.[r] ?? 0}, view ${p.character.resources[r] ?? 0}`);
  }
  return {verified: true, costs, moves, endOfTurn};
}

/** What happens to the object a move chose and that left its seat: consumed by its owner, passed to the author, or gone. */
export type ItemFate = 'consumed' | 'passed' | 'broken';
export type MoveBeat = {
  index: number; author: string; target: string; card: string; void: boolean;
  item: {owner: string; name: string; fate: ItemFate} | null;
  /** The card a bound move discarded (DISCARD_ONE); not for a voided bound, which keeps it (R04). */
  discard: string | null;
  /** Verified changes of this move (empty when the round falls back to totals). */
  steps: Step[];
};
export type Draw = {seat: string; to: 'hand' | 'table'; name: string | null};
export type Timeline = {
  key: string; pace: Pace;
  /** per-card: the verified lines move the bars step by step; total: previous to final in the tail (D5). */
  bars: 'per-card' | 'total'; reason: string | null;
  /** Nominal cost tokens leaving each author, voided moves included (one per move and resource). */
  tokens: {seat: string; move: number; resource: Resource; amount: number}[];
  costSteps: Step[]; moves: MoveBeat[]; draws: Draw[];
  endOfTurn: {seats: string[]; steps: Step[]};
  /** Previous to final of every changed resource: the tail of the total mode and the end state of both modes. */
  totals: Step[];
  emphasis: {seat: string; kind: 'died' | 'forfeit'}[];
};

/**
 * The round as the scene plays it (C3-4), only for a round with a difference: every element comes from the facts,
 * the catalog (nominal costs, which names are deck objects) and the verified report lines.
 */
export function timeline(previous: View, next: View, facts: ResolutionFacts, catalog: Card[] = []): Timeline | null {
  if (!facts.contiguous || !facts.seats) return null;
  const known = new Map<string, Card>();
  for (const c of catalog) if (!known.has(c.name)) known.set(c.name, c);
  const costOf = (name: string) => { const c = known.get(name); return c ? {...c.cost} : null; };
  const steps = reportSteps(previous, next, facts, costOf), seats = facts.seats;
  const tokens: Timeline['tokens'] = [];
  for (const m of facts.moves) {
    const cost = m.cost ?? costOf(m.card);
    for (const r of RESOURCE_ORDER) if (cost?.[r]) tokens.push({seat: m.author, move: m.index, resource: r, amount: cost[r]!});
  }
  const moves: MoveBeat[] = facts.moves.map((m, i) => ({
    index: m.index, author: m.author, target: m.target, card: m.card, void: m.void,
    item: m.item && m.itemGone ? {...m.item, fate: m.author === m.item.owner ? 'consumed' : m.itemAtAuthor ? 'passed' : 'broken'} : null,
    discard: m.void ? null : m.discard,
    steps: steps.verified ? steps.moves[i] : [],
  }));
  // Cards leaving each deck: deck objects that appeared without a move passing them go to the table (the token is not in
  // the catalog), the rest to the hand; own arrivals by name, opponents as backs, and only as many as the deck count says.
  const draws: Draw[] = [];
  for (const [id, s] of Object.entries(seats)) {
    const left = Math.max(0, s.deck.before - s.deck.after);
    const passedIn = moves.filter(m => m.item?.fate === 'passed' && m.author === id).map(m => m.item!.name);
    const table = minus(s.itemsAppeared, passedIn).filter(n => known.get(n)?.item).slice(0, left);
    for (const name of table) draws.push({seat: id, to: 'table', name});
    if (s.handArrived) for (const name of s.handArrived) draws.push({seat: id, to: 'hand', name});
    else for (let k = 0; k < left - table.length; k++) draws.push({seat: id, to: 'hand', name: null});
  }
  const totals: Step[] = [];
  for (const [id, s] of Object.entries(seats)) for (const [r, c] of Object.entries(s.resources) as [Resource, ResourceChange][])
    if (c.delta) totals.push({seat: id, resource: r, from: c.before ?? 0, to: c.after ?? 0});
  const emphasis = Object.entries(seats).flatMap(([id, s]) => [
    ...(s.died ? [{seat: id, kind: 'died' as const}] : []), ...(s.forfeit ? [{seat: id, kind: 'forfeit' as const}] : [])]);
  return {
    key: facts.key,
    pace: pace(moves.length, {costs: tokens.length > 0, draws: draws.length > 0, endOfTurn: facts.endOfTurn.length > 0}),
    bars: steps.verified ? 'per-card' : 'total', reason: steps.verified ? null : steps.reason,
    tokens, costSteps: steps.verified ? steps.costs : [], moves, draws,
    endOfTurn: {seats: facts.endOfTurn, steps: steps.verified ? steps.endOfTurn : []},
    totals, emphasis,
  };
}

/** What a sequence of the timeline animates, counted the same way by the scene and by the checks. */
export function beats(t: Timeline) {
  const items = t.moves.filter(m => m.item);
  return {
    drops: t.moves.length, stamps: t.moves.filter(m => m.void).length, tokens: t.tokens.length,
    objects: items.length + t.draws.filter(d => d.to === 'table').length,
    consumed: items.filter(m => m.item!.fate === 'consumed').length, passed: items.filter(m => m.item!.fate === 'passed').length,
    broken: items.filter(m => m.item!.fate === 'broken').length, discards: t.moves.filter(m => m.discard).length,
    draws: t.draws.length, endOfTurn: t.endOfTurn.seats.length, emphasis: t.emphasis.length,
    steps: t.bars === 'per-card' ? t.costSteps.length + t.moves.reduce((n, m) => n + m.steps.length, 0) + t.endOfTurn.steps.length : t.totals.length,
  };
}

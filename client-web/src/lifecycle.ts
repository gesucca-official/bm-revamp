import type {View} from './contracts.ts';

// Game lifecycle as the server reports it (outcome, forfeits, deadlines). Nothing here decides an
// outcome: the countdown is indicative, computed from the epoch carried by the view.
const REASONS: Record<string, string> = {combat: 'Rissa conclusa al tavolo', leave: 'Abbandono', timeout: 'Tempo scaduto', 'riavvio server': 'Riavvio del server'};
const OTHER: Record<string, string> = {leave: 'ha abbandonato', 'move timeout': 'non ha mosso entro 30 secondi', 'reconnect timeout': 'non è rientrato entro 30 secondi'};
const OWN: Record<string, string> = {leave: 'Hai abbandonato', 'move timeout': 'Non hai mosso entro 30 secondi', 'reconnect timeout': 'Non sei rientrato entro 30 secondi'};

/** Forfeit reason of another player (K5); an unknown wire code stays visible as it is. */
export const forfeitLabel = (code: string) => OTHER[code] ?? `forfait (${code})`;

/** Forfeit reason of the own player; an unknown wire code stays visible as it is. */
export const forfeitOwn = (code: string) => OWN[code] ?? `Forfait (${code})`;

export type Outcome = {title: string; reason: string; lines: string[]};
export function outcome(view: View, me: string, name: (id: string) => string): Outcome {
  const title = view.over ? (view.winner === 'NONE' ? 'Pareggio' : view.winner === me ? 'Hai vinto' : 'Hai perso') : 'Sei fuori dalla partita';
  const ids = Object.keys(view.forfeits), everyone = ids.length > 1 && ids.length === Object.keys(view.players).length;
  let reason = REASONS[view.outcomeReason || ''] || (view.over ? 'Partita conclusa' : '');
  if (view.over && view.winner === 'NONE' && view.outcomeReason === 'timeout' && everyone) reason = 'Tempo scaduto per tutti';
  // FFA (D11): after the own death the game goes on and can be watched until the outcome.
  if (!view.over && view.players[me]?.character.dead && !view.forfeits[me]) reason = 'Eliminato: puoi guardare fino all’esito';
  // In the FFA a loss does not tell who won: name the winner.
  const winner = view.over && view.winner !== 'NONE' && view.winner !== me && Object.keys(view.players).length > 2 ? [`Vince ${name(view.winner)}`] : [];
  const lines = winner.concat(ids.sort((a, b) => a === me ? -1 : b === me ? 1 : 0).map(id => {
    const code = view.forfeits[id];
    return id === me ? OWN[code] ?? `Forfait (${code})` : `${name(id)} ${forfeitLabel(code)}`;
  }));
  return {title, reason, lines};
}

/** Whole seconds until an epoch deadline, or null without one. */
export const secondsLeft = (deadline: number | undefined, now: number) => deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;

/** Other players dropped and still within their reconnect deadline. */
export const reconnecting = (view: View, me: string, now: number) => view.over ? [] :
  Object.entries(view.reconnectDeadlines ?? {}).filter(([id]) => id !== me).map(([id, d]) => ({id, seconds: secondsLeft(d, now)!}));

// ---- C4-12: elimination and outcome after the sequence (owner's trial of C4-9, 11 November 2026).

/** The mark on a seat: the view's death or forfeit, unless the running sequence has still to stamp it at its tail (as the boards follow `display`). */
export function seatMark(p: {dead: boolean; forfeit: boolean}, pending: boolean): 'ELIMINATO' | 'FORFAIT' | null {
  if (pending) return null;
  return p.dead ? 'ELIMINATO' : p.forfeit ? 'FORFAIT' : null;
}

/** What a round's sequence holds back until its tail: the seats it stamps (died, forfeit) and whether it shows the end of the game for `me`
 * (the outcome banner, or the own stamp in an FFA that goes on, D11 of C2b). */
export function heldBack(t: {emphasis: {seat: string}[]; outcome: unknown}, me: string) {
  return {seats: new Set(t.emphasis.map(e => e.seat)), ending: !!t.outcome || t.emphasis.some(e => e.seat === me)};
}

/** Longest wait of the outcome panel: the cap of 20 s per round (rule 9) and 2 s of margin. No outcome stays without its panel past it. */
export const OUTCOME_WAIT_MS = 22000;

/** Milliseconds the outcome panel (and its sound, J2) still waits; 0 opens it. It waits only while the sequence that shows the end of the game
 * runs (`since`, its start): skipped, interrupted (hidden view, resize, a new view), absent (reduced motion, a jump) or ended, it opens at once.
 * A dialog opens it too (the sequence goes on behind it); once open for the same stage of the game it stays open. */
export function outcomeWait(s: {finished: boolean; since: number | null; now: number; dialog: boolean; opened: boolean}): number {
  if (!s.finished || s.opened || s.dialog || s.since === null) return 0;
  return Math.max(0, OUTCOME_WAIT_MS - Math.max(0, s.now - s.since));
}

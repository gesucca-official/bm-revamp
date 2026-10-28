import type {View} from './contracts.ts';

// Game lifecycle as the server reports it (outcome, forfeits, deadlines). Nothing here decides an
// outcome: the countdown is indicative, computed from the epoch carried by the view.
const REASONS: Record<string, string> = {combat: 'Rissa conclusa al tavolo', leave: 'Abbandono', timeout: 'Tempo scaduto', 'riavvio server': 'Riavvio del server'};
const OTHER: Record<string, string> = {leave: 'ha abbandonato', 'move timeout': 'non ha mosso entro 30 secondi', 'reconnect timeout': 'non è rientrato entro 30 secondi'};
const OWN: Record<string, string> = {leave: 'Hai abbandonato', 'move timeout': 'Non hai mosso entro 30 secondi', 'reconnect timeout': 'Non sei rientrato entro 30 secondi'};

/** Forfeit reason of another player (K5); an unknown wire code stays visible as it is. */
export const forfeitLabel = (code: string) => OTHER[code] ?? `forfait (${code})`;

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

import type {FfaEntry, Presence} from './contracts.ts';

export type PresenceSort = {by: 'userLogin' | 'activity'; asc: boolean};
export const PAGE_SIZES = [5, 10, 20] as const;

// The server sends "Free", "Playing" or "Queued for <queue>"; the label is display only.
export const activityLabel = (activity: string) => activity === 'Free' ? 'Libero' : activity === 'Playing' ? 'In partita' : activity.startsWith('Queued') ? 'In coda' : activity;

/** One page of the presence list: sorted by column (ties by name), the page clamped into range. */
export function presencePage(users: Presence[], sort: PresenceSort, size: number, page: number) {
  const key = (u: Presence) => sort.by === 'activity' ? activityLabel(u.activity) : u.userLogin;
  const sorted = [...users].sort((a, b) => (key(a).localeCompare(key(b), 'it', {sensitivity: 'base'}) || a.userLogin.localeCompare(b.userLogin, 'it', {sensitivity: 'base'})) * (sort.asc ? 1 : -1));
  const pages = Math.max(1, Math.ceil(sorted.length / size)), at = Math.min(Math.max(0, page), pages - 1);
  return {rows: sorted.slice(at * size, at * size + size), page: at, pages, total: sorted.length};
}

/** Display name (K4, D9): one computer is "Computer", several are "Computer 1–4" in the order of `ids`
 * (join order of the view). The full id stays visible in the inspection and the tools. */
export function playerName(id: string, ids: string[] = [id]) {
  if (!id.startsWith('ComPlayer_')) return id;
  const bots = ids.filter(x => x.startsWith('ComPlayer_'));
  return bots.length > 1 && bots.includes(id) ? `Computer ${bots.indexOf(id) + 1}` : 'Computer';
}

/** The public FFA queue in join order, with the same computer numbering as the table. */
export function queueNames(entries: FfaEntry[], me: string) {
  const bots = entries.filter(e => !e.human).length;
  let n = 0;
  return entries.map(e => ({human: e.human, me: e.human && e.playerId === me,
    label: e.human ? `${e.playerId}${e.playerId === me ? ' (tu)' : ''}` : bots > 1 ? `Computer ${++n}` : 'Computer'}));
}

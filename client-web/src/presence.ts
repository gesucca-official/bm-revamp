import type {Presence} from './contracts.ts';

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

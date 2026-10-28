import type {Timers} from './session.ts';

// Client error reports (P44, D14): only unhandled errors, to the public POST of the debug (ClientErrorHandler).
// One send at a time with a 5 s timeout; errors raised while a report is in flight are dropped, not queued;
// a failed send is never reported again; at most LIMIT reports per page load. The text carries no credentials,
// no username and no game data: only the error name and message, cut before any JSON and without quoted values.
export const REPORT_URL = '/rest/logs/client/web/';
const TIMEOUT = 5000, LIMIT = 10, LENGTH = 300;
const browserTimers: Timers = {set: (fn, ms) => globalThis.setTimeout(fn, ms) as unknown as number, clear: id => globalThis.clearTimeout(id)};
export type Post = (url: string, init: RequestInit) => Promise<unknown>;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The message sent for one error: never the value of a non-Error object (it could be a view or a frame). */
export function reportText(error: unknown, secrets: string[] = []): string {
  let text = error instanceof Error ? `${error.name}: ${error.message}`
    : typeof error === 'string' ? error
    : `Valore non gestito di tipo ${error === null ? 'null' : typeof error}`;
  // A JSON parse error quotes the input: drop everything from the first brace or bracket, and quoted values.
  const json = text.search(/[{[]/);
  if (json >= 0) text = `${text.slice(0, json)}…`;
  text = text.replace(/"[^"]*"?|'[^']*'?|`[^`]*`?/g, '"…"');
  for (const secret of secrets.filter(Boolean)) {
    // Short values only as whole words, so a one-letter name does not erase the message.
    text = text.replace(new RegExp(secret.length < 4 ? `\\b${escape(secret)}\\b` : escape(secret), 'g'), '***');
  }
  text = text.replace(/\s+/g, ' ').trim();
  return text.length > LENGTH ? `${text.slice(0, LENGTH - 1)}…` : text || 'Errore senza messaggio';
}

export function errorReporter({post = (url, init) => fetch(url, init), secrets = () => [], timers = browserTimers, now = () => new Date(), limit = LIMIT, timeout = TIMEOUT}:
  {post?: Post; secrets?: () => string[]; timers?: Timers; now?: () => Date; limit?: number; timeout?: number} = {}) {
  let busy = false;
  const stats = {sent: 0, dropped: 0, failed: 0};
  /** Sends one report if none is in flight and the limit is not reached; true when a send started. */
  function report(error: unknown): boolean {
    if (busy || stats.sent >= limit) { stats.dropped++; return false; }
    busy = true;
    try {
      const body = JSON.stringify({timestamp: now().toISOString(), message: reportText(error, secrets()), additional: ['client-web']});
      const abort = new AbortController(), timer = timers.set(() => abort.abort(), timeout);
      stats.sent++;
      // Whatever happens to the send (refused, unreachable, timeout) ends here: nothing is reported about it.
      Promise.resolve().then(() => post(REPORT_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body, signal: abort.signal}))
        .then(answer => {
          if (!(answer instanceof Response)) return;
          if (!answer.ok) stats.failed++;
          // Read the (empty) body: an unread stream is cancelled later by the browser and shows as a failed request.
          return answer.text().then(() => {}, () => {});
        }, () => { stats.failed++; })
        .finally(() => { timers.clear(timer); busy = false; });
      return true;
    } catch { busy = false; return false; }
  }
  return {report, stats, get busy() { return busy; }};
}
export type ErrorReporter = ReturnType<typeof errorReporter>;

/** Window listeners for uncaught errors and unhandled rejections; a fault in the handler is swallowed (no loop). */
export function installReporter(reporter: ErrorReporter, target: Pick<Window, 'addEventListener' | 'removeEventListener'> = window) {
  let inside = false;
  const handle = (value: unknown) => { if (inside) return; inside = true; try { reporter.report(value); } catch { /* never report the reporter */ } finally { inside = false; } };
  // Script errors only: a failed image or script load fires a plain Event without message.
  const onError = (e: Event) => { const ev = e as ErrorEvent; if (ev.error != null || typeof ev.message === 'string') handle(ev.error ?? ev.message); };
  const onRejection = (e: Event) => handle((e as PromiseRejectionEvent).reason);
  target.addEventListener('error', onError); target.addEventListener('unhandledrejection', onRejection);
  return () => { target.removeEventListener('error', onError); target.removeEventListener('unhandledrejection', onRejection); };
}

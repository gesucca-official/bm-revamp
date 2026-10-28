import type {Failure} from '../signup.ts';

const TIMEOUT = 10000;
type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

/** A request that failed: HTTP status, or null when the server did not answer in time or at all. */
export class RestError extends Error implements Failure {
  readonly status: number | null;
  constructor(status: number | null) { super(status === null ? 'no answer' : `HTTP ${status}`); this.status = status; }
}

// Sign-up endpoints of the debug (UserSignUpController) through the same /rest proxy. Every call ends:
// an answer, a RestError with the status, or a RestError(null) after the timeout; nothing is retried.
async function request(fetcher: Fetch, url: string, timeout: number, init?: RequestInit): Promise<Response> {
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), timeout);
  let response: Response;
  try { response = await fetcher(url, {...init, signal: abort.signal}); }
  catch { throw new RestError(null); }
  finally { clearTimeout(timer); }
  if (!response.ok) throw new RestError(response.status);
  return response;
}

export function signUpApi(fetcher: Fetch = (i, init) => fetch(i, init), timeout = TIMEOUT) {
  const call = (path: string, init?: RequestInit) => request(fetcher, `/rest/sign-up${path}`, timeout, init);
  const post = (path: string, body: object) => call(path, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  const available = async (path: string) => {
    const value = await (await call(path)).json().catch(() => null);
    if (typeof value !== 'boolean') throw new RestError(null);
    return value;
  };
  return {
    usernameAvailable: (username: string) => available(`/users/${encodeURIComponent(username)}/available`),
    mailAvailable: (email: string) => available(`/mail/${encodeURIComponent(email)}/available`),
    verify: async (username: string, email: string) => { await post('/verify', {username, email}); },
    register: async (username: string, password: string, email: string, code: string) => { await post('/register', {username, password, email, code}); }
  };
}
export type SignUpApi = ReturnType<typeof signUpApi>;

// Admin panel of the debug (AdminControlPanelComponent), P40-P43. HTTP Basic is a separate identity left to the
// browser (D6): its own prompt answers the 401 challenge, the client never asks for, sees or keeps the credentials.
// The prompt is human time, hence the longer timeout. Every answer is checked: only the expected shape is a success.
const ADMIN_TIMEOUT = 120000;
export type LogKind = 'games' | 'client';
const base: Record<LogKind, string> = {games: '/rest/logs/back/games', client: '/rest/logs/client/web'};
export interface GameLogRecord {gameId: string; players: string | null; type: string | null; date: string | null; status: string | null}

export function adminApi(fetcher: Fetch = (i, init) => fetch(i, init), timeout = ADMIN_TIMEOUT) {
  const call = (kind: LogKind, path: string, init?: RequestInit) => request(fetcher, `${base[kind]}${path}`, timeout, {cache: 'no-store', ...init});
  const json = async (response: Response) => { try { return JSON.parse(await response.text()); } catch { throw new RestError(null); } };
  return {
    count: async (kind: LogKind) => {
      const value = await json(await call(kind, '/qty'));
      if (typeof value !== 'number') throw new RestError(null);
      return value;
    },
    /** Games still STARTED or IN_PROGRESS (the debug opens the same JSON in a new tab). */
    openGames: async (): Promise<GameLogRecord[]> => {
      const value = await json(await call('games', '/open'));
      if (!Array.isArray(value)) throw new RestError(null);
      return value;
    },
    /** The whole log as JSON text (drain exports, it does not delete); readable means a JSON array. */
    drain: async (kind: LogKind) => {
      const text = await (await call(kind, '/drain')).text();
      let records: unknown;
      try { records = JSON.parse(text); } catch { throw new RestError(null); }
      if (!Array.isArray(records)) throw new RestError(null);
      return {text, records: records.length};
    },
    /** Deletes every record of that log; the server answers true. */
    clear: async (kind: LogKind) => {
      if (await json(await call(kind, '/delete', {method: 'DELETE'})) !== true) throw new RestError(null);
    }
  };
}
export type AdminApi = ReturnType<typeof adminApi>;

/** 401/403 is never a success: the Basic credentials are missing, refused or not configured in this environment. */
export function adminMessage({status}: {status: number | null}): string {
  if (status === 401 || status === 403) return 'Non autorizzato in questo ambiente: servono le credenziali HTTP del server, che chiede il browser. Nessuna operazione eseguita.';
  if (status === null) return 'Il server non ha risposto in modo valido. Nessuna operazione confermata.';
  if (status === 502 || status === 503 || status === 504) return 'Server non raggiungibile. Riprova tra poco.';
  return `Il server ha rifiutato la richiesta (errore ${status}). Nessuna operazione confermata.`;
}

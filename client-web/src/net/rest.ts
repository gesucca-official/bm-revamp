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
export function signUpApi(fetcher: Fetch = (i, init) => fetch(i, init), timeout = TIMEOUT) {
  async function call(path: string, init?: RequestInit): Promise<Response> {
    const abort = new AbortController(), timer = setTimeout(() => abort.abort(), timeout);
    let response: Response;
    try { response = await fetcher(`/rest/sign-up${path}`, {...init, signal: abort.signal}); }
    catch { throw new RestError(null); }
    finally { clearTimeout(timer); }
    if (!response.ok) throw new RestError(response.status);
    return response;
  }
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

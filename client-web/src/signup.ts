// Sign-up form rules and server answers (P07, P08), as pure functions. The rules are the debug's
// (sign-up.component.ts): alphanumeric username, Angular email check, six-digit code, password and
// confirmation equal. The server stays the judge; these only keep obviously wrong requests from leaving.

export type SignUpForm = {username: string; email: string; password: string; confirm: string; code: string};
export type Field = keyof SignUpForm;

// Angular Validators.email, the check of the debug form.
const EMAIL = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function fieldErrors(form: SignUpForm): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!form.username) errors.username = 'Scegli un nome.';
  else if (!/^[A-Za-z0-9]+$/.test(form.username)) errors.username = 'Solo lettere latine e cifre, senza spazi.';
  if (!form.email) errors.email = 'Serve un indirizzo email.';
  else if (!EMAIL.test(form.email)) errors.email = 'Indirizzo email non valido.';
  if (!form.code) errors.code = 'Inserisci il codice ricevuto per email.';
  else if (!/^\d{6}$/.test(form.code)) errors.code = 'Il codice è di sei cifre.';
  if (!form.password) errors.password = 'Scegli una password.';
  if (form.confirm !== form.password) errors.confirm = 'Le due password non coincidono.';
  return errors;
}

/** "Invia codice" needs only name and email, like the debug. */
export const canSendCode = (form: SignUpForm) => { const e = fieldErrors(form); return !e.username && !e.email; };
export const canRegister = (form: SignUpForm) => Object.keys(fieldErrors(form)).length === 0;

/** HTTP status of a failed request, or null when the server did not answer (network, timeout). */
export type Failure = {status: number | null};
export type Step = 'available' | 'verify' | 'register';

// Observed on the local server (C2b-5, profile local, app.mail.enabled false):
// - available: 200 true/false; 400 from the web container for a value with "/" (only reachable through the email);
// - verify: 409 if the name or the email is already used; 500 when sending the email fails ("Email is disabled");
// - register: 409 for a wrong code (also without a previous verify) or a used name/email; nothing is created;
// - server down behind the Vite proxy: 502; a fetch that does not complete: network error or timeout.
export function failureMessage(step: Step, {status}: Failure): string {
  if (status === null || status === 502 || status === 503 || status === 504) return 'Server non raggiungibile. Riprova tra poco.';
  if (step === 'available' && status === 400) return 'Il server non accetta questo valore: controlla nome ed email.';
  if (step === 'verify' && status === 409) return 'Nome o email già usati: scegline altri.';
  if (step === 'verify' && status >= 500) return 'Registrazione non disponibile in questo ambiente: il server non può inviare il codice per email. Nessun account è stato creato.';
  if (step === 'register' && status === 409) return 'Registrazione rifiutata: il codice non è quello inviato per email, oppure nome o email sono già usati. Nessun account è stato creato.';
  return `Registrazione non disponibile (errore ${status}). Nessun account è stato creato.`;
}

export const takenMessage = (what: 'username' | 'email') => what === 'username'
  ? 'Questo nome è già usato: scegline un altro.'
  : 'Questa email è già usata per un altro account.';

type Api = {
  usernameAvailable(username: string): Promise<boolean>;
  mailAvailable(email: string): Promise<boolean>;
  verify(username: string, email: string): Promise<void>;
  register(username: string, password: string, email: string, code: string): Promise<void>;
};
export type Outcome = {ok: true} | {ok: false; error: string; field?: Field};
const failed = (step: Step, e: unknown): Outcome => ({ok: false, error: failureMessage(step, {status: (e as Failure)?.status ?? null})});

/** "Invia codice", the debug sequence: name available, email available, then the verification request. */
export async function sendCode(api: Api, form: SignUpForm): Promise<Outcome> {
  try { if (!(await api.usernameAvailable(form.username))) return {ok: false, error: takenMessage('username'), field: 'username'}; }
  catch (e) { return failed('available', e); }
  try { if (!(await api.mailAvailable(form.email))) return {ok: false, error: takenMessage('email'), field: 'email'}; }
  catch (e) { return failed('available', e); }
  try { await api.verify(form.username, form.email); return {ok: true}; }
  catch (e) { return failed('verify', e); }
}

export async function register(api: Api, form: SignUpForm): Promise<Outcome> {
  try { await api.register(form.username, form.password, form.email, form.code); return {ok: true}; }
  catch (e) { return failed('register', e); }
}

/** Pre-login screens behind the hash (#/, #/regole, #/accedi, #/registrati); anything else is the home. */
export type Route = 'home' | 'rules' | 'login' | 'signup';
const routes: Record<string, Route> = {'#/regole': 'rules', '#/accedi': 'login', '#/registrati': 'signup'};
export const routeOf = (hash: string): Route => routes[hash.split('?')[0]] ?? 'home';
export const hashOf = (route: Route) => route === 'home' ? '#/' : Object.keys(routes).find(k => routes[k] === route)!;

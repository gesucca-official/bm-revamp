import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseInline, parseRules, plain, rulesVersion, type Block} from '../src/rules.ts';
import {canRegister, canSendCode, failureMessage, fieldErrors, hashOf, register, routeOf, sendCode, type SignUpForm} from '../src/signup.ts';
import {RestError, signUpApi} from '../src/net/rest.ts';

const source = readFileSync(new URL('../../docs/game-rules.md', import.meta.url), 'utf8');
const blocks = parseRules(source);
const headings = (level: number) => blocks.flatMap(b => b.kind === 'heading' && b.level === level ? [b.text] : []);

test('rules: every heading, the version and the revisions of docs/game-rules.md', () => {
  const expected = [...source.matchAll(/^(#{1,6}) (.*)$/gm)].map(m => `${m[1].length} ${m[2]}`);
  assert.deepEqual(blocks.flatMap(b => b.kind === 'heading' ? [`${b.level} ${b.text}`] : []), expected);
  assert.deepEqual(headings(2).map(h => h.split(' — ')[0]), ['R00', 'R01', 'R01a', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R07a', 'R08', 'R09', 'Revisioni']);
  assert.equal(rulesVersion(blocks), /Versione \*\*(\S+) —/.exec(source)![1]);
  const revisions = blocks.at(-1) as Extract<Block, {kind: 'list'}>;
  assert.equal(revisions.kind, 'list');
  assert.deepEqual(revisions.items.map(i => /^(\d+\.\d+) —/.exec(plain(i))?.[1]), [...source.matchAll(/^- \*\*(\d+\.\d+) —/gm)].map(m => m[1]));
});

test('rules: tables keep every row and cell (R07, R07a), with the alignment of the separator', () => {
  const tables = blocks.filter((b): b is Extract<Block, {kind: 'table'}> => b.kind === 'table');
  assert.equal(tables.length, source.split('\n').filter(l => /^\|-/.test(l)).length);
  const rows = source.split('\n').filter(l => l.startsWith('|') && !/^\|-/.test(l)).length;
  assert.equal(tables.reduce((n, t) => n + 1 + t.rows.length, 0), rows);
  for (const t of tables) for (const r of t.rows) assert.equal(r.length, t.head.length);
  const characters = tables.find(t => t.head.length > 3 && plain(t.head[3]) === 'HEALTH')!;
  assert.deepEqual(characters.rows.map(r => plain(r[2])), ['Spazienzio de la Ucciso', 'Tossico del Serraglio']);
  assert.equal(characters.align[3], 'right');
  const roles = tables.find(t => t.head.length === 3 && plain(t.head[1]) === 'Ruolo' && plain(t.head[2]) === 'Guadagni a sé')!;
  assert.ok(roles.rows.some(r => plain(r[0]) === 'BigBadBruiser'));
});

test('rules: the full text survives (paragraphs, lists, cells), markup aside', () => {
  const text = (b: Block): string => b.kind === 'heading' ? b.text : b.kind === 'paragraph' ? plain(b.inlines)
    : b.kind === 'list' ? b.items.map(plain).join(' ') : [...b.head, ...b.rows.flat()].map(plain).join(' ');
  const words = (s: string) => s.replace(/[*`]/g, '').replace(/[#|]|^- |^\d+\. /gm, ' ').split(/\s+/).filter(w => w && !/^-+:?$/.test(w) && !/^:?-+:?$/.test(w));
  assert.deepEqual(words(blocks.map(text).join(' ')), words(source.replace(/^\|[-:| ]+\|$/gm, '')));
});

test('inline: bold, italic and code; links keep the label; raw HTML stays text', () => {
  assert.deepEqual(parseInline('a **b *c* f** `d` *e*'), [
    {kind: 'text', text: 'a '}, {kind: 'strong', children: [{kind: 'text', text: 'b '}, {kind: 'em', children: [{kind: 'text', text: 'c'}]}, {kind: 'text', text: ' f'}]},
    {kind: 'text', text: ' '}, {kind: 'code', text: 'd'}, {kind: 'text', text: ' '}, {kind: 'em', children: [{kind: 'text', text: 'e'}]}]);
  assert.deepEqual(parseInline('vedi [R02](#r02--mazzo) e [allegato](rules-catalog.json)'), [{kind: 'text', text: 'vedi R02 e allegato'}]);
  assert.deepEqual(parseInline('HEALTH <= 0 <script>x</script>'), [{kind: 'text', text: 'HEALTH <= 0 <script>x</script>'}]);
  assert.deepEqual(parseInline('2 * 3 e 4 * 5'), [{kind: 'text', text: '2 * 3 e 4 * 5'}]);
});

const form = (over: Partial<SignUpForm> = {}): SignUpForm => ({username: 'nuovo1', email: 'nuovo@esempio.it', password: 'pw', confirm: 'pw', code: '123456', ...over});

test('sign-up fields: the debug validators', () => {
  assert.deepEqual(fieldErrors(form()), {});
  assert.ok(fieldErrors(form({username: ''})).username);
  for (const bad of ['a b', 'ciao!', 'àbc', 'a/b', 'a.b']) assert.ok(fieldErrors(form({username: bad})).username, bad);
  for (const bad of ['', 'senza-chiocciola', 'a@', '@b.it', 'a b@c.it']) assert.ok(fieldErrors(form({email: bad})).email, bad);
  for (const ok of ['a@b', 'x.y+z@dominio.it', 'a/b@x.it']) assert.equal(fieldErrors(form({email: ok})).email, undefined, ok);
  for (const bad of ['', '12345', '1234567', '12345a', ' 12345']) assert.ok(fieldErrors(form({code: bad})).code, bad);
  assert.ok(fieldErrors(form({password: '', confirm: ''})).password);
  assert.ok(fieldErrors(form({confirm: 'altro'})).confirm);
  assert.equal(canSendCode(form({code: '', password: '', confirm: 'x'})), true);
  assert.equal(canSendCode(form({username: 'a b'})), false);
  assert.equal(canRegister(form({code: '12'})), false);
  assert.equal(canRegister(form()), true);
});

test('sign-up answers: mapping of the statuses observed on the local server', () => {
  assert.match(failureMessage('verify', {status: 500}), /non disponibile in questo ambiente.*Nessun account/);
  assert.doesNotMatch(failureMessage('verify', {status: 500}), /arriv|inviato|controlla/i);
  assert.match(failureMessage('verify', {status: 409}), /già usati/);
  assert.match(failureMessage('register', {status: 409}), /codice.*Nessun account/);
  for (const status of [null, 502, 503, 504]) assert.match(failureMessage('register', {status}), /non raggiungibile/);
  assert.match(failureMessage('available', {status: 400}), /non accetta/);
  assert.match(failureMessage('register', {status: 500}), /errore 500/);
});

type Call = [string, string?];
const fakeApi = (answers: {user?: boolean | number; mail?: boolean | number; verify?: number; register?: number}) => {
  const calls: Call[] = [];
  const step = async <T>(name: string, value: T | number | undefined, ok: T) => { calls.push([name]); if (typeof value === 'number') throw new RestError(value === 0 ? null : value); return value ?? ok; };
  return {calls, api: {
    usernameAvailable: (u: string) => step('user', answers.user, true) as Promise<boolean>,
    mailAvailable: (m: string) => step('mail', answers.mail, true) as Promise<boolean>,
    verify: async () => { await step('verify', answers.verify, undefined); },
    register: async () => { await step('register', answers.register, undefined); }
  }};
};

test('send code: name, then email, then verify; stops at the first refusal', async () => {
  let f = fakeApi({user: false});
  assert.deepEqual(await sendCode(f.api, form()), {ok: false, error: 'Questo nome è già usato: scegline un altro.', field: 'username'});
  assert.deepEqual(f.calls, [['user']]);
  f = fakeApi({mail: false});
  assert.equal((await sendCode(f.api, form())).ok, false);
  assert.deepEqual(f.calls, [['user'], ['mail']]);
  f = fakeApi({verify: 500});
  const local = await sendCode(f.api, form());
  assert.equal(local.ok, false);
  assert.match(local.ok ? '' : local.error, /non disponibile in questo ambiente/);
  assert.deepEqual(f.calls, [['user'], ['mail'], ['verify']]);
  f = fakeApi({user: 0});
  assert.match((await sendCode(f.api, form()) as {error: string}).error, /non raggiungibile/);
  assert.deepEqual(await sendCode(fakeApi({}).api, form()), {ok: true});
  assert.match((await register(fakeApi({register: 409}).api, form()) as {error: string}).error, /codice/);
  assert.deepEqual(await register(fakeApi({}).api, form()), {ok: true});
});

test('rest: paths, bodies, statuses, timeout and non-boolean answers', async () => {
  const seen: {url: string; method?: string; body?: string}[] = [];
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}});
  let next: () => Promise<Response> = async () => reply(200, true);
  const api = signUpApi(async (url, init) => { seen.push({url, method: init?.method, body: init?.body as string}); return next(); }, 50);
  assert.equal(await api.usernameAvailable('devAlice'), true);
  next = async () => reply(200, false);
  assert.equal(await api.mailAvailable('a/b@x.it'), false);
  next = async () => reply(200, null);
  await api.verify('nuovo1', 'n@x.it');
  await api.register('nuovo1', 'pw', 'n@x.it', '123456');
  assert.deepEqual(seen, [
    {url: '/rest/sign-up/users/devAlice/available', method: undefined, body: undefined},
    {url: '/rest/sign-up/mail/a%2Fb%40x.it/available', method: undefined, body: undefined},
    {url: '/rest/sign-up/verify', method: 'POST', body: '{"username":"nuovo1","email":"n@x.it"}'},
    {url: '/rest/sign-up/register', method: 'POST', body: '{"username":"nuovo1","password":"pw","email":"n@x.it","code":"123456"}'}]);
  next = async () => reply(500, {status: 500});
  await assert.rejects(api.verify('a', 'b'), (e: RestError) => e.status === 500);
  next = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(api.usernameAvailable('a'), (e: RestError) => e.status === null);
  next = async () => reply(200, 'sì');
  await assert.rejects(api.usernameAvailable('a'), (e: RestError) => e.status === null);
  const hang = signUpApi((_url, init) => new Promise((_ok, fail) => init!.signal!.addEventListener('abort', () => fail(new Error('aborted')))), 20);
  await assert.rejects(hang.register('a', 'b', 'c', 'd'), (e: RestError) => e.status === null);
});

test('routes: hash to screen and back; unknown hashes are the home', () => {
  for (const r of ['home', 'rules', 'login', 'signup'] as const) assert.equal(routeOf(hashOf(r)), r);
  assert.equal(hashOf('rules'), '#/regole');
  for (const h of ['', '#', '#/', '#/hub', '#r02--mazzo', '#/regole/x']) assert.equal(routeOf(h), 'home', h);
});

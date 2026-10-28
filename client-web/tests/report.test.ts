import {test} from 'node:test';
import assert from 'node:assert/strict';
import {REPORT_URL, errorReporter, installReporter, reportText} from '../src/report.ts';
import {RestError, adminApi, adminMessage} from '../src/net/rest.ts';

// Manual timers: the 5 s abort fires only when the test says so.
function fakeTimers() {
  let next = 1; const pending = new Map<number, () => void>();
  return {set: (fn: () => void, _ms: number) => { pending.set(next, fn); return next++; }, clear: (id: number) => { pending.delete(id); },
    fire: () => { const all = [...pending.values()]; pending.clear(); all.forEach(fn => fn()); }, get size() { return pending.size; }};
}
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
type Call = {url: string; init: RequestInit; resolve: (v: unknown) => void; reject: (e: unknown) => void};
function fakePost() {
  const calls: Call[] = [];
  const post = (url: string, init: RequestInit) => new Promise((resolve, reject) => {
    calls.push({url, init, resolve, reject});
    init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  });
  return {calls, post};
}

test('report text: name and message only, no JSON, no quoted values, no credentials', () => {
  assert.equal(reportText(new TypeError('x is undefined')), 'TypeError: x is undefined');
  const parse = new SyntaxError('Unexpected token \'o\', "{"gameId":"g1","players":{"devBob":{"cardsInHand":[{"name":"Sberla"}]}}}" is not valid JSON');
  const text = reportText(parse);
  assert.ok(!/gameId|devBob|Sberla|cardsInHand/.test(text), text);
  assert.equal(text, 'SyntaxError: Unexpected token "…", "…"');
  assert.equal(reportText(new Error('login devAlice failed with local-alice'), ['devAlice', 'local-alice']), 'Error: login *** failed with ***');
  // A short name is replaced only as a word: the message stays readable.
  assert.equal(reportText(new Error('bad value for ab in a tab'), ['ab']), 'Error: bad value for *** in a tab');
  // Objects (a view, a frame) are never stringified.
  assert.equal(reportText({gameId: 'g1', players: {}}), 'Valore non gestito di tipo object');
  assert.equal(reportText(null), 'Valore non gestito di tipo null');
  assert.equal(reportText('plain text'), 'plain text');
  assert.equal(reportText(new Error('z'.repeat(1000))).length, 300);
});

test('reporter: the debug body to the public POST, one send at a time, others dropped', async () => {
  const timers = fakeTimers(), {calls, post} = fakePost();
  const reporter = errorReporter({post, timers, now: () => new Date('2026-10-28T10:00:00.000Z'), secrets: () => ['devAlice', 'local-alice']});
  assert.equal(reporter.report(new Error('first for devAlice')), true);
  await settle();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, REPORT_URL);
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), {timestamp: '2026-10-28T10:00:00.000Z', message: 'Error: first for ***', additional: ['client-web']});
  assert.ok(!String(calls[0].init.body).includes('local-alice'));
  // While the first is in flight, further errors are not queued.
  assert.equal(reporter.report(new Error('second')), false);
  assert.equal(reporter.report(new Error('third')), false);
  await settle();
  assert.equal(calls.length, 1);
  calls[0].resolve(new Response(null, {status: 200}));
  await settle(); await settle();
  assert.equal(reporter.busy, false);
  assert.equal(timers.size, 0, 'timeout cleared');
  assert.equal(reporter.report(new Error('fourth')), true);
  await settle();
  assert.equal(calls.length, 2);
  assert.deepEqual(reporter.stats, {sent: 2, dropped: 2, failed: 0});
});

test('reporter: timeout of 5 s aborts, a failed send is not reported again', async () => {
  const timers = fakeTimers(), {calls, post} = fakePost();
  let ms = 0;
  const reporter = errorReporter({post, timers: {...timers, set: (fn, t) => { ms = t; return timers.set(fn, t); }}});
  reporter.report(new Error('hang'));
  await settle();
  assert.equal(ms, 5000);
  timers.fire();
  await settle(); await settle();
  assert.equal(calls[0].init.signal?.aborted, true);
  assert.equal(reporter.busy, false);
  assert.equal(calls.length, 1, 'no report about the failed report');
  assert.equal(reporter.stats.failed, 1);
  // Unreachable ingestion (rejected fetch, or an HTTP error): still one call per reported error.
  reporter.report(new Error('next'));
  await settle();
  calls[1].reject(new TypeError('Failed to fetch'));
  await settle(); await settle();
  reporter.report(new Error('again'));
  await settle();
  calls[2].resolve(new Response(null, {status: 502}));
  await settle(); await settle();
  assert.equal(calls.length, 3);
  assert.deepEqual(reporter.stats, {sent: 3, dropped: 0, failed: 3});
});

test('reporter: at most ten reports per page load; a throwing post does not stay busy', async () => {
  const {calls, post} = fakePost();
  const reporter = errorReporter({post, timers: fakeTimers()});
  for (let i = 0; i < 15; i++) { reporter.report(new Error(`e${i}`)); await settle(); calls.at(-1)?.resolve(new Response(null)); await settle(); await settle(); }
  assert.equal(calls.length, 10);
  assert.equal(reporter.stats.dropped, 5);
  const broken = errorReporter({post: () => { throw new Error('sync'); }, timers: fakeTimers()});
  broken.report(new Error('a')); await settle(); await settle();
  assert.equal(broken.busy, false);
  assert.equal(broken.stats.failed, 1);
});

test('install: error and unhandledrejection reach the reporter; resource errors and handler faults do not loop', () => {
  const listeners = new Map<string, (e: Event) => void>();
  const target = {addEventListener: (type: string, fn: (e: Event) => void) => listeners.set(type, fn), removeEventListener: (type: string) => listeners.delete(type)};
  const seen: unknown[] = [];
  let throwing = false;
  const reporter = {report: (v: unknown) => { seen.push(v); if (throwing) throw new Error('inside'); return true; }, stats: {sent: 0, dropped: 0, failed: 0}, busy: false};
  const remove = installReporter(reporter, target as never);
  const boom = new Error('boom');
  listeners.get('error')!({error: boom, message: 'Uncaught Error: boom'} as never);
  listeners.get('error')!({message: 'Script error.', error: null} as never);
  listeners.get('error')!({type: 'error'} as never); // an image that failed to load
  listeners.get('unhandledrejection')!({reason: 'rejected'} as never);
  throwing = true;
  assert.doesNotThrow(() => listeners.get('error')!({error: new Error('x')} as never));
  assert.deepEqual(seen.map(String), ['Error: boom', 'Script error.', 'rejected', 'Error: x']);
  remove();
  assert.equal(listeners.size, 0);
});

test('admin api: paths, Basic left to the browser, only the expected answers are a success', async () => {
  const calls: {url: string; method?: string; headers?: unknown}[] = [];
  const answers: Record<string, () => Response> = {
    '/rest/logs/back/games/qty': () => new Response('3', {status: 200}),
    '/rest/logs/client/web/qty': () => new Response('12', {status: 200}),
    '/rest/logs/back/games/open': () => new Response('[{"gameId":"g1","players":"devBob,ComPlayer_1","type":"quick1vCom","date":"d","status":"IN_PROGRESS"}]'),
    '/rest/logs/back/games/drain': () => new Response('[{"gameId":"g1"},{"gameId":"g2"}]'),
    '/rest/logs/client/web/drain': () => new Response('not json'),
    '/rest/logs/back/games/delete': () => new Response('true'),
    '/rest/logs/client/web/delete': () => new Response('false')
  };
  const api = adminApi(async (url, init) => { calls.push({url, method: init?.method, headers: init?.headers}); return answers[url](); });
  assert.equal(await api.count('games'), 3);
  assert.equal(await api.count('client'), 12);
  assert.equal((await api.openGames())[0].status, 'IN_PROGRESS');
  assert.deepEqual(await api.drain('games'), {text: '[{"gameId":"g1"},{"gameId":"g2"}]', records: 2});
  await assert.rejects(api.drain('client'), (e: RestError) => e.status === null);
  await api.clear('games');
  await assert.rejects(api.clear('client'), (e: RestError) => e.status === null, 'false is not a deletion');
  assert.deepEqual(calls.map(c => `${c.method ?? 'GET'} ${c.url}`), ['GET /rest/logs/back/games/qty', 'GET /rest/logs/client/web/qty', 'GET /rest/logs/back/games/open',
    'GET /rest/logs/back/games/drain', 'GET /rest/logs/client/web/drain', 'DELETE /rest/logs/back/games/delete', 'DELETE /rest/logs/client/web/delete']);
  assert.ok(calls.every(c => c.headers === undefined), 'no Authorization from the client');
  for (const status of [401, 403]) {
    const denied = adminApi(async () => new Response('', {status}));
    await assert.rejects(denied.count('games'), (e: RestError) => e.status === status);
    await assert.rejects(denied.clear('games'), (e: RestError) => e.status === status);
  }
  // A 200 that is not the expected shape (an HTML page, a string) is not a success either.
  await assert.rejects(adminApi(async () => new Response('<html>')).count('games'), (e: RestError) => e.status === null);
  await assert.rejects(adminApi(async () => new Response('{}')).openGames(), (e: RestError) => e.status === null);
  await assert.rejects(adminApi((_u, init) => new Promise((_r, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted')))), 20).count('games'), (e: RestError) => e.status === null);
});

test('admin messages: 401/403 is "not authorized in this environment", never a success', () => {
  assert.match(adminMessage({status: 401}), /^Non autorizzato in questo ambiente/);
  assert.equal(adminMessage({status: 403}), adminMessage({status: 401}));
  assert.match(adminMessage({status: 401}), /Nessuna operazione eseguita/);
  assert.match(adminMessage({status: null}), /non ha risposto/);
  assert.match(adminMessage({status: 502}), /non raggiungibile/);
  assert.match(adminMessage({status: 500}), /errore 500/);
});

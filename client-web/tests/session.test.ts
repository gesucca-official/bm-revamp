import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Session, type Timers} from '../src/session.ts';
import type {Connector, Link} from '../src/net/link.ts';
import type {View} from '../src/contracts.ts';
import {clone} from '../src/model.ts';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures.json', import.meta.url), 'utf8'));
const flush = () => new Promise(resolve => setImmediate(resolve));

// A duel view for player Tu against a bot, derived from the synthetic fixture.
function duel(turn = 1): View {
  const v = clone(fixtures.before) as View;
  v.gameId = 'g1'; v.turn = turn; v.players = {Tu: v.players.Tu, ComPlayer_7: v.players.Bice};
  v.players.ComPlayer_7.playerId = 'ComPlayer_7'; v.moveDeadlines = {}; v.reconnectDeadlines = {}; v.forfeits = {};
  return v;
}

class FakeServer implements Connector {
  sent: {destination: string; body: string}[] = [];
  handlers = new Map<string, (body: string) => void>();
  drops: (() => void)[] = [];
  valid = true; connects = 0;
  async validate() { return this.valid; }
  async connect(_user: string, _password: string, onDrop: () => void): Promise<Link> {
    this.connects++; this.drops.push(onDrop);
    const handlers = new Map<string, (body: string) => void>();
    this.handlers = handlers;
    return {
      subscribe: async (destination, handler) => { handlers.set(destination, handler); return () => { handlers.delete(destination); }; },
      send: (destination, body = '') => { this.sent.push({destination, body}); },
      close: () => {}, drop: () => this.drops.at(-1)!()
    };
  }
  deliver(destination: string, body: unknown) {
    const handler = this.handlers.get(destination);
    assert.ok(handler, `no subscription for ${destination}`);
    handler(typeof body === 'string' ? body : JSON.stringify(body));
  }
  count(destination: string) { return this.sent.filter(s => s.destination === destination).length; }
}
const timers = (): Timers & {fire(): void} => {
  let n = 0; const pending = new Map<number, () => void>();
  return {set: fn => { pending.set(++n, fn); return n; }, clear: id => { pending.delete(id); }, fire: () => { const all = [...pending.values()]; pending.clear(); all.forEach(fn => fn()); }};
};
const account = {username: 'Tu', email: null, role: 'USER', collection: {cards: Object.values(fixtures.cards)}};

async function inHub() {
  const server = new FakeServer(), clock = timers(), session = new Session(server, clock);
  await session.login('Tu', 'secret'); await flush();
  assert.deepEqual(server.sent.map(s => s.destination), ['/app/session/resume', '/app/user/Tu/account', '/app/connections/users/tell/me']);
  server.deliver('/user/queue/session/resume', {status: 'none'});
  server.deliver('/user/queue/account/data', account);
  assert.equal(session.phase, 'hub');
  return {server, clock, session};
}
async function inGame(view = duel()) {
  const ctx = await inHub();
  ctx.session.join('quick/1vCom'); await flush();
  assert.deepEqual(ctx.server.sent.at(-1), {destination: '/app/game/quick/1vCom/join', body: 'Tu'});
  ctx.server.deliver('/user/queue/game/quick/1vCom/ready', 'g1'); await flush();
  assert.deepEqual(ctx.server.sent.at(-1), {destination: '/app/game/g1/Tu/view', body: ''});
  ctx.server.deliver('/user/queue/game/g1/view', view);
  assert.equal(ctx.session.phase, 'game');
  return ctx;
}

test('K1: a repeated account/data does not reapply the login resume', async () => {
  const {session, server} = await inGame();
  const m = session.model!;
  server.deliver('/user/queue/account/data', account);
  assert.equal(session.phase, 'game'); assert.equal(session.model, m); assert.equal(session.notice, '');
  // Same for the hub and the restart receipt: a later profile refresh must not bring them back.
  const hub = await inHub();
  hub.session.receipt = null;
  hub.server.deliver('/user/queue/account/data', account);
  assert.equal(hub.session.receipt, null); assert.equal(hub.session.phase, 'hub');
});

test('K1: a profile refresh after a rejoin keeps the rejoined game', async () => {
  const {session, server} = await inGame();
  server.drops.at(-1)!();
  await session.rejoin(); await flush();
  server.deliver('/user/queue/session/resume', {status: 'resumed', gameId: 'g1', view: duel()});
  server.deliver('/user/queue/account/data', account); await flush();
  const m = session.model!; session.notice = '';
  server.deliver('/user/queue/account/data', account);
  assert.equal(session.model, m); assert.equal(session.phase, 'game'); assert.equal(session.notice, '');
});

test('wrong credentials stay on login without opening STOMP', async () => {
  const server = new FakeServer(); server.valid = false;
  const session = new Session(server, timers());
  await session.login('Tu', 'bad');
  assert.equal(session.phase, 'login'); assert.equal(server.connects, 0); assert.match(session.error, /Credenziali/);
});

test('login waits for profile and resume, then quick 1vCom subscribes before joining and reading the view', async () => {
  const {session, server} = await inGame();
  assert.equal(session.model?.me, 'Tu');
  for (const d of ['/user/queue/game/g1/view', '/user/queue/illegalMove', '/topic/game/g1/update', '/topic/game/g1/move']) assert.ok(server.handlers.has(d), d);
  assert.equal(server.count('/app/game/g1/Tu/view'), 1);
});

test('one SEND per confirmation with the five wire fields; topics only trigger a private reread', async () => {
  const {session, server} = await inGame();
  const m = session.model!;
  m.select(m.hand[2].key); m.aim({owner: 'ComPlayer_7'});
  session.submit(); session.submit();
  const moves = server.sent.filter(s => s.destination === '/app/game/g1/move');
  assert.equal(moves.length, 1);
  assert.deepEqual(JSON.parse(moves[0].body), {playedCardName: 'FAI BASTA', playerId: 'Tu', targetId: 'ComPlayer_7', gameId: 'g1', choices: null});
  assert.equal(m.phase, 'sending');
  // Already one view request in flight from the attach: notifications collapse into one more.
  server.deliver('/user/queue/game/g1/view', duel());
  server.deliver('/topic/game/g1/move', 'Tu submitted a Move');
  server.deliver('/topic/game/g1/update', 'g1');
  assert.equal(server.count('/app/game/g1/Tu/view'), 2);
  const next = duel(2); next.resolvedMoves = [{...JSON.parse(moves[0].body), void: false, moveReport: {}}];
  server.deliver('/user/queue/game/g1/view', next);
  assert.equal(server.count('/app/game/g1/Tu/view'), 3);
  assert.equal(m.phase, 'choose'); assert.equal(m.view.turn, 2); assert.equal(m.commandCount, 1);
});

test('illegalMove leaves the choice correctable and rereads the view', async () => {
  const {session, server} = await inGame();
  server.deliver('/user/queue/game/g1/view', duel());
  const m = session.model!;
  m.select(m.hand[2].key); m.aim({owner: 'ComPlayer_7'}); session.submit();
  server.deliver('/user/queue/illegalMove', 'Not enough VIOLENCE');
  assert.equal(m.phase, 'choose'); assert.equal(m.ready, true); assert.match(m.message, /VIOLENCE/);
  assert.equal(server.count('/app/game/g1/Tu/view'), 2);
});

test('a drop never resends; rejoin subscribes, resumes and keeps the pending move', async () => {
  const {session, server} = await inGame();
  server.deliver('/user/queue/game/g1/view', duel());
  const m = session.model!;
  m.select(m.hand[2].key); m.aim({owner: 'ComPlayer_7'}); session.submit();
  const oldView = server.handlers.get('/user/queue/game/g1/view')!;
  server.drops.at(-1)!();
  assert.equal(session.phase, 'lost'); assert.equal(m.phase, 'uncertain');
  const moves = server.count('/app/game/g1/move');
  oldView(JSON.stringify(duel(5)));
  assert.equal(m.view.turn, 1, 'callbacks of the old connection are ignored');
  await session.rejoin(); await flush();
  const pending = duel(); pending.pendingMove = {playedCardName: 'FAI BASTA', playerId: 'Tu', targetId: 'ComPlayer_7', gameId: 'g1', choices: null, void: false, moveReport: {}};
  server.deliver('/user/queue/session/resume', {status: 'resumed', gameId: 'g1', view: pending});
  server.deliver('/user/queue/account/data', account); await flush();
  assert.equal(session.phase, 'game'); assert.equal(session.model, m); assert.equal(m.phase, 'pending');
  assert.equal(server.count('/app/game/g1/move'), moves);
});

test('restart receipt without view goes to the hub and touches no old game destination', async () => {
  const server = new FakeServer(), session = new Session(server, timers());
  await session.login('Tu', 'secret'); await flush();
  server.deliver('/user/queue/session/resume', {status: 'finished', gameId: 'old', archived: true, outcome: {over: true, result: 'draw', winner: null, reason: 'riavvio server'}});
  server.deliver('/user/queue/account/data', account);
  assert.equal(session.phase, 'hub'); assert.equal(session.receipt?.outcome?.reason, 'riavvio server');
  assert.ok(!server.sent.some(s => s.destination.includes('/old')));
});

test('outcome, leave acknowledgement and a new quick game', async () => {
  const {session, server} = await inGame();
  const over = duel(4); over.over = true; over.winner = 'Tu'; over.outcomeReason = 'combat';
  server.deliver('/user/queue/game/g1/view', over);
  assert.equal(session.model!.message, 'Hai vinto');
  session.leave('again'); await flush();
  assert.ok(!server.handlers.has('/topic/game/g1/update'), 'game topics dropped before leaving');
  const views = server.count('/app/game/g1/Tu/view'); session.requestView();
  assert.equal(server.count('/app/game/g1/Tu/view'), views, 'no view request towards a game being left');
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/g1/Tu/leave', body: ''});
  server.deliver('/user/queue/game/g1/leave', 'true'); await flush();
  assert.equal(session.model, null); assert.equal(session.phase, 'queue');
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/1vCom/join', body: 'Tu'});
});

test('queue error returns to the hub with the server message', async () => {
  const {session, server} = await inHub();
  session.join('quick/1vCom'); await flush();
  server.deliver('/user/queue/game/error', 'Partita da riprendere');
  assert.equal(session.phase, 'hub'); assert.equal(session.error, 'Partita da riprendere');
});

test('1v1: joins on its own ready channel and plays like any game', async () => {
  const {session, server} = await inHub();
  session.join('quick/1v1'); await flush();
  assert.equal(session.queued, 'quick/1v1');
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/1v1/join', body: 'Tu'});
  assert.ok(!server.handlers.has('/user/queue/game/quick/1vCom/ready'));
  server.deliver('/user/queue/game/quick/1v1/ready', 'g1'); await flush();
  assert.equal(session.queued, null); assert.ok(!server.handlers.has('/user/queue/game/quick/1v1/ready'), 'queue subscription closed');
  const v = duel(); v.players = {Tu: v.players.Tu, devBob: {...v.players.ComPlayer_7, playerId: 'devBob'}};
  server.deliver('/user/queue/game/g1/view', v);
  assert.equal(session.phase, 'game');
});

test('new game repeats the mode just played (D11)', async () => {
  const {session, server} = await inHub();
  session.join('quick/1v1'); await flush();
  server.deliver('/user/queue/game/quick/1v1/ready', 'g1'); await flush();
  const over = duel(4); over.over = true; over.winner = 'Tu'; over.outcomeReason = 'combat';
  server.deliver('/user/queue/game/g1/view', over);
  session.leave('again'); await flush();
  server.deliver('/user/queue/game/g1/leave', 'true'); await flush();
  assert.equal(session.phase, 'queue'); assert.equal(session.queued, 'quick/1v1');
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/1v1/join', body: 'Tu'});
});

test('leaving the queue: ACK closes the subscriptions and returns to an active hub', async () => {
  const {session, server} = await inHub();
  session.join('quick/1v1'); await flush();
  session.leaveQueue(); await flush();
  assert.deepEqual(server.sent.at(-1), {destination: '/app/session/queue/leave', body: ''});
  assert.equal(session.phase, 'queue'); assert.equal(session.leavingQueue, true);
  session.leaveQueue(); assert.equal(server.count('/app/session/queue/leave'), 1, 'one leave while waiting for the ACK');
  server.deliver('/user/queue/session/queue/leave', 'true'); await flush();
  assert.equal(session.phase, 'hub'); assert.equal(session.queued, null); assert.equal(session.leavingQueue, false);
  assert.ok(!server.handlers.has('/user/queue/game/quick/1v1/ready'), 'ready subscription closed');
  assert.ok(!server.handlers.has('/user/queue/session/queue/leave'), 'ACK subscription closed');
  session.join('quick/1v1'); await flush();
  assert.equal(server.count('/app/game/quick/1v1/join'), 2, 'joining again after the ACK is a new join');
});

test('leaving the queue without ACK stays in the queue with an error, never a stuck spinner', async () => {
  const {session, server, clock} = await inHub();
  session.join('quick/1v1'); await flush();
  session.leaveQueue(); await flush();
  clock.fire();
  assert.equal(session.phase, 'queue'); assert.equal(session.leavingQueue, false); assert.match(session.error, /uscita dalla coda/);
  session.leaveQueue(); await flush();
  assert.equal(server.count('/app/session/queue/leave'), 2);
});

test('cancelling before the subscription is confirmed never sends the join', async () => {
  const {session, server} = await inHub();
  session.join('quick/1v1'); session.leaveQueue(); await flush();
  assert.equal(session.phase, 'hub'); assert.equal(server.count('/app/game/quick/1v1/join'), 0); assert.equal(server.count('/app/session/queue/leave'), 0);
  assert.ok(!server.handlers.has('/user/queue/game/quick/1v1/ready'));
});

test('a ready that wins the race against the leave starts the game', async () => {
  const {session, server} = await inHub();
  session.join('quick/1v1'); await flush();
  session.leaveQueue(); await flush();
  server.deliver('/user/queue/game/quick/1v1/ready', 'g1'); await flush();
  server.deliver('/user/queue/session/queue/leave', 'true'); await flush();
  assert.equal(session.phase, 'queue'); assert.equal(session.gameId, 'g1'); assert.equal(session.queued, null);
  server.deliver('/user/queue/game/g1/view', duel());
  assert.equal(session.phase, 'game');
});

test('presence follows the public topic and is cleared on logout', async () => {
  const {session, server} = await inHub();
  server.deliver('/topic/connections/users', [{userLogin: 'Tu', activity: 'Free'}, {userLogin: 'devBob', activity: 'Playing'}]);
  assert.deepEqual(session.presence.map(u => u.userLogin), ['Tu', 'devBob']);
  server.deliver('/topic/connections/users', [{userLogin: 'Tu', activity: 'Free'}]);
  assert.equal(session.presence.length, 1);
  const out = session.logout(); await flush();
  server.deliver('/user/queue/session/logout', 'true'); await out;
  assert.deepEqual(session.presence, []);
});

test('missing profile within the technical timeout returns to login', async () => {
  const server = new FakeServer(), clock = timers(), session = new Session(server, clock);
  await session.login('Tu', 'secret'); await flush();
  clock.fire();
  assert.equal(session.phase, 'login'); assert.match(session.error, /Profilo/);
});

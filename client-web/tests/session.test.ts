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

// C2b-2: lifecycle in 1v1.
const versus = (turn = 1): View => { const v = duel(turn); v.players = {Tu: v.players.Tu, devBob: {...v.players.ComPlayer_7, playerId: 'devBob'}}; return v; };

test('K6: logout during a game stops listening to it before the logout, then returns to login', async () => {
  const {session, server} = await inGame(versus());
  server.deliver('/user/queue/game/g1/view', versus());
  const views = server.count('/app/game/g1/Tu/view');
  const out = session.logout(); await flush();
  for (const d of ['/user/queue/game/g1/view', '/topic/game/g1/update', '/topic/game/g1/move', '/user/queue/illegalMove']) assert.ok(!server.handlers.has(d), `${d} closed before the logout`);
  assert.deepEqual(server.sent.at(-1), {destination: '/app/session/logout', body: ''});
  server.deliver('/user/queue/session/logout', 'true'); await out;
  assert.equal(session.phase, 'login'); assert.equal(session.model, null); assert.equal(session.gameId, null);
  assert.equal(server.count('/app/game/g1/Tu/view'), views, 'no view request after the logout');
  assert.equal(server.count('/app/game/g1/move'), 0); assert.equal(server.count('/app/game/g1/Tu/leave'), 0, 'the server turns the logout into the forfeit');
});

test('a second leave while the first waits for its ACK sends nothing more', async () => {
  const {session, server} = await inGame(versus());
  session.leave('hub'); session.leave('hub'); await flush();
  assert.equal(server.count('/app/game/g1/Tu/leave'), 1);
  server.deliver('/user/queue/game/g1/leave', 'true'); await flush();
  assert.equal(session.phase, 'hub');
  session.leave('hub'); await flush();
  assert.equal(server.count('/app/game/g1/Tu/leave'), 1, 'after the ACK there is no game left to leave');
});

test('rejoin after the deadline shows the own forfeit from the server and never resubscribes the game', async () => {
  const {session, server} = await inGame(versus());
  const m = session.model!;
  m.select(m.hand[2].key); m.aim({owner: 'devBob'}); session.submit();
  const moves = server.count('/app/game/g1/move');
  server.drops.at(-1)!();
  await session.rejoin(); await flush();
  const lost = versus(); Object.assign(lost, {over: true, winner: 'devBob', outcomeReason: 'timeout', forfeits: {Tu: 'reconnect timeout'}});
  const sent = server.sent.length;
  server.deliver('/user/queue/session/resume', {status: 'finished', gameId: 'g1', view: lost});
  server.deliver('/user/queue/account/data', account); await flush();
  assert.equal(session.phase, 'game'); assert.equal(session.model!.view.over, true); assert.equal(session.model!.message, 'Hai perso');
  assert.ok(!server.handlers.has('/user/queue/game/g1/view'), 'no subscription to a finished game');
  assert.deepEqual(server.sent.slice(sent), [], 'no SEND after the resume');
  assert.equal(server.count('/app/game/g1/move'), moves, 'the old choice is never resent');
  session.leave('hub'); await flush();
  server.deliver('/user/queue/game/g1/leave', 'true'); await flush();
  assert.equal(session.phase, 'hub'); assert.equal(session.notice, '', 'no stale rejoin notice in the hub');
});

test('rejoin within the deadline keeps the same game and pending move with zero SEND after the resume', async () => {
  const {session, server} = await inGame(versus());
  const m = session.model!;
  m.select(m.hand[2].key); m.aim({owner: 'devBob'}); session.submit();
  server.drops.at(-1)!();
  await session.rejoin(); await flush();
  const pending = versus(); pending.pendingMove = {...m.lastCommand!, void: false, moveReport: {}}; pending.moveDeadlines = {devBob: Date.now() + 20000};
  server.deliver('/user/queue/session/resume', {status: 'resumed', gameId: 'g1', view: pending});
  server.deliver('/user/queue/account/data', account); await flush();
  const after = server.sent.length - 1; // the reattach asks the private view once
  assert.equal(session.model, m); assert.equal(m.phase, 'pending'); assert.equal(session.gameId, 'g1');
  assert.deepEqual(server.sent.slice(after).map(s => s.destination), ['/app/game/g1/Tu/view']);
  assert.equal(server.count('/app/game/g1/move'), 1);
});

// C2b-3: FFA queue and five-seat games.
const QUEUE = '/topic/game/quick/ffa/joined';
const entry = (playerId: string, human = true) => ({playerId, human});
const bot = () => entry('QueuedComPlayer', false);
function five(turn = 1): View {
  const v = clone(fixtures.before) as View;
  v.gameId = 'f1'; v.turn = turn; v.moveDeadlines = {}; v.reconnectDeadlines = {}; v.forfeits = {};
  const [tu, ...others] = Object.values(v.players);
  v.players = {Tu: tu, devBob: {...others[0], playerId: 'devBob'}, ComPlayer_31: {...others[1], playerId: 'ComPlayer_31'}, ComPlayer_8: {...others[2], playerId: 'ComPlayer_8'}, ComPlayer_502: {...others[3], playerId: 'ComPlayer_502'}};
  return v;
}

test('P13: FFA subscribes the ready and the public list before joining; the list follows the topic', async () => {
  const {session, server} = await inHub();
  session.join('quick/ffa'); await flush();
  assert.ok(server.handlers.has('/user/queue/game/quick/ffa/ready')); assert.ok(server.handlers.has(QUEUE));
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/ffa/join', body: 'Tu'});
  server.deliver(QUEUE, [entry('Tu')]);
  assert.deepEqual(session.ffaQueue, [entry('Tu')]);
  server.deliver(QUEUE, [entry('Tu'), bot(), entry('devBob')]);
  assert.equal(session.ffaQueue.length, 3);
});

test('P14/P15: add a computer; start now only with at least two entries (the server never answers with fewer)', async () => {
  const {session, server} = await inHub();
  session.join('quick/ffa'); await flush();
  server.deliver(QUEUE, [entry('Tu')]);
  assert.equal(session.canStart, false);
  session.startNow(); assert.equal(server.count('/app/game/quick/ffa/start'), 0, 'no start with one entry');
  session.addComputer();
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/ffa/join/com', body: 'Tu'});
  server.deliver(QUEUE, [entry('Tu'), bot()]);
  assert.equal(session.canStart, true);
  session.startNow(); session.startNow();
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/ffa/start', body: 'Tu'});
  assert.equal(server.count('/app/game/quick/ffa/start'), 1, 'one start while waiting for the game');
  assert.equal(session.canAddComputer, false, 'no more computers once the start is asked');
  server.deliver(QUEUE, []);
  server.deliver('/user/queue/game/quick/ffa/ready', 'f1'); await flush();
  assert.ok(!server.handlers.has(QUEUE), 'public list closed with the queue'); assert.deepEqual(session.ffaQueue, []);
  server.deliver('/user/queue/game/f1/view', five());
  assert.equal(session.phase, 'game');
});

test('P14: no computer beyond five entries, none outside the FFA queue', async () => {
  const {session, server} = await inHub();
  session.addComputer(); assert.equal(server.count('/app/game/quick/ffa/join/com'), 0, 'not in a queue');
  session.join('quick/1v1'); await flush();
  session.addComputer(); assert.equal(server.count('/app/game/quick/ffa/join/com'), 0, 'not in the FFA queue');
  const ffa = await inHub();
  ffa.session.join('quick/ffa'); await flush();
  ffa.server.deliver(QUEUE, [entry('Tu'), bot(), bot(), bot(), bot()]);
  assert.equal(ffa.session.canAddComputer, false); ffa.session.addComputer();
  assert.equal(ffa.server.count('/app/game/quick/ffa/join/com'), 0);
});

test('P17: leaving the FFA queue closes the public list after the ACK', async () => {
  const {session, server} = await inHub();
  session.join('quick/ffa'); await flush();
  server.deliver(QUEUE, [entry('Tu'), bot(), bot()]);
  session.leaveQueue(); await flush();
  assert.deepEqual(server.sent.at(-1), {destination: '/app/session/queue/leave', body: ''});
  server.deliver('/user/queue/session/queue/leave', 'true'); await flush();
  assert.equal(session.phase, 'hub'); assert.deepEqual(session.ffaQueue, []);
  assert.ok(!server.handlers.has(QUEUE)); assert.ok(!server.handlers.has('/user/queue/game/quick/ffa/ready'));
});

test('D11: new game after an FFA repeats the FFA; after a rejoin a five-seat game is recognised as FFA', async () => {
  const {session, server} = await inHub();
  session.join('quick/ffa'); await flush();
  server.deliver('/user/queue/game/quick/ffa/ready', 'f1'); await flush();
  server.deliver('/user/queue/game/f1/view', Object.assign(five(3), {over: true, winner: 'devBob', outcomeReason: 'combat'}));
  session.leave('again'); await flush();
  server.deliver('/user/queue/game/f1/leave', 'true'); await flush();
  assert.equal(session.queued, 'quick/ffa'); assert.deepEqual(server.sent.at(-1), {destination: '/app/game/quick/ffa/join', body: 'Tu'});
  // A fresh login that resumes a five-seat game does not know the queue: the view says FFA.
  const again = new FakeServer(), other = new Session(again, timers());
  await other.login('Tu', 'secret'); await flush();
  again.deliver('/user/queue/session/resume', {status: 'resumed', gameId: 'f1', view: Object.assign(five(3), {over: true, winner: 'Tu', outcomeReason: 'combat'})});
  again.deliver('/user/queue/account/data', account); await flush();
  other.leave('again'); await flush();
  again.deliver('/user/queue/game/f1/leave', 'true'); await flush();
  assert.deepEqual(again.sent.at(-1), {destination: '/app/game/quick/ffa/join', body: 'Tu'});
});

test('P33: in the FFA another player\'s forfeit keeps the game going; own death keeps watching until the outcome', async () => {
  const {session, server} = await inHub();
  session.join('quick/ffa'); await flush();
  server.deliver('/user/queue/game/quick/ffa/ready', 'f1'); await flush();
  server.deliver('/user/queue/game/f1/view', five());
  const m = session.model!;
  const left = five(2); left.forfeits = {devBob: 'leave'};
  server.deliver('/user/queue/game/f1/view', left);
  assert.equal(m.locked, false); assert.equal(m.message, 'Scegli una carta');
  const dead = five(3); dead.forfeits = {devBob: 'leave'}; dead.players.Tu.character.dead = true;
  server.deliver('/topic/game/f1/update', 'f1'); server.deliver('/user/queue/game/f1/view', dead);
  assert.equal(session.phase, 'game'); assert.equal(m.eliminated, true); assert.equal(m.view.over, false);
  server.deliver('/topic/game/f1/update', 'f1');
  assert.ok(server.handlers.has('/user/queue/game/f1/view'), 'still listening to the game');
  const end = five(5); end.players.Tu.character.dead = true; Object.assign(end, {over: true, winner: 'ComPlayer_8', outcomeReason: 'combat'});
  server.deliver('/user/queue/game/f1/view', end);
  assert.equal(m.view.over, true); assert.equal(m.message, 'Hai perso');
});

// C2b-4: decks and open 1vCom.
const savedDeck = {deckId: 'Strano', character: {name: 'Spazienzio', bindingName: 'bruiser.character.BigBadBruiser', itemsSize: 3, resources: {}},
  basicActionCard: fixtures.cards.grab ?? Object.values(fixtures.cards)[0], lastResortCard: Object.values(fixtures.cards)[0], characterBoundCards: [], regularCards: [Object.values(fixtures.cards)[0]]} as any;

test('saving a deck waits for the refreshed profile; the login resume is not reapplied (K1)', async () => {
  const {session, server} = await inHub();
  server.deliver('/user/queue/session/resume', {status: 'resumed', gameId: 'old', view: duel()});
  const saved = session.saveDeck(savedDeck);
  assert.equal(session.deckBusy, true);
  assert.deepEqual(server.sent.at(-1), {destination: '/app/user/Tu/deck', body: JSON.stringify(savedDeck)});
  assert.equal(await Promise.race([saved, flush().then(() => 'pending')]), 'pending');
  server.deliver('/user/queue/account/data', {...account, decks: [savedDeck]});
  assert.equal(await saved, null);
  assert.equal(session.deckBusy, false);
  assert.deepEqual(session.decks.map(d => d.deckId), ['Strano']);
  assert.equal(session.phase, 'hub');
  assert.equal(session.model, null);
});

test('a refused save keeps the editor open with the server reason in Italian; delete answers the same way', async () => {
  const {session, server} = await inHub();
  const refused = session.saveDeck(savedDeck);
  server.deliver('/user/queue/account/error', 'Invalid deck: Deck identifier cannot contain /');
  assert.equal(await refused, 'Il server ha rifiutato il mazzo (Deck identifier cannot contain /).');
  assert.equal(session.error, '');
  const deleted = session.deleteDeck(savedDeck);
  assert.equal(server.sent.at(-1)!.destination, '/app/user/Tu/deck/delete');
  server.deliver('/user/queue/account/data', {...account, decks: []});
  assert.equal(await deleted, null);
  assert.deepEqual(session.decks, []);
});

test('a deck request without answer times out once; a later profile is only a refresh', async () => {
  const {session, server, clock} = await inHub();
  const saved = session.saveDeck(savedDeck);
  assert.equal(await session.saveDeck(savedDeck), 'Operazione non disponibile adesso.', 'one request at a time');
  assert.equal(server.count('/app/user/Tu/deck'), 1);
  clock.fire();
  assert.match(String(await saved), /non ha risposto/);
  server.deliver('/user/queue/account/data', {...account, decks: [savedDeck]});
  assert.equal(session.deckBusy, false);
  assert.equal(session.decks.length, 1);
});

test('a drop during a save resolves it instead of leaving the editor waiting', async () => {
  const {session, server} = await inHub();
  const saved = session.saveDeck(savedDeck);
  server.drops.at(-1)!();
  assert.match(String(await saved), /Connessione interrotta/);
  assert.equal(session.deckBusy, false);
});

test('open 1vCom subscribes ready and its error channel, then joins with user and deckId', async () => {
  const {session, server} = await inHub();
  session.join('open/1vCom', null);
  assert.equal(session.phase, 'hub', 'open needs a deck');
  session.join('open/1vCom', 'Strano'); await flush();
  assert.ok(server.handlers.has('/user/queue/game/open/1vCom/ready'));
  assert.ok(server.handlers.has('/user/queue/game/open/1vCom/error'));
  assert.deepEqual(server.sent.at(-1), {destination: '/app/game/open/1vCom/join/Tu/Strano', body: 'Tu'});
  server.deliver('/user/queue/game/open/1vCom/error', 'Deck unavailable. Choose a saved deck from your account and retry.');
  assert.equal(session.phase, 'hub');
  assert.equal(session.error, 'Mazzo non disponibile sul server: scegli un mazzo salvato e riprova.');
  assert.ok(!server.handlers.has('/user/queue/game/open/1vCom/ready'), 'queue subscriptions closed');
  assert.ok(!server.handlers.has('/user/queue/game/open/1vCom/error'));
});

test('new game after an open game repeats open with the same deck (D11)', async () => {
  const {session, server} = await inHub();
  session.join('open/1vCom', 'Strano'); await flush();
  server.deliver('/user/queue/game/open/1vCom/ready', 'g1'); await flush();
  server.deliver('/user/queue/game/g1/view', {...duel(), over: true, winner: 'Tu'});
  session.leave('again'); await flush();
  server.deliver('/user/queue/game/g1/leave', 'true'); await flush();
  assert.equal(server.count('/app/game/open/1vCom/join/Tu/Strano'), 2);
  assert.equal(server.count('/app/game/quick/1vCom/join'), 0);
});

test('switching hub tab clears the messages of the previous tab', async () => {
  const {session, server} = await inHub();
  session.join('open/1vCom', 'Assente'); await flush();
  server.deliver('/user/queue/game/open/1vCom/error', 'Deck unavailable. Choose a saved deck from your account and retry.');
  assert.ok(session.error);
  session.clearMessages();
  assert.equal(session.error, '');
});

'use strict';
// D76: real matches against the computer on the development server started with -Bozza (isolated SQLite, port 8080).
// Usage, from the repository root, after ./scripts/build.ps1 -Task Server -Offline:
//   node docs/reports/set-base/sb-16g-bot-letale/partita.cjs <repo> <out-dir> [games]
// With BM_SERVER_DIR (a server/ folder with a packaged jar) and BM_PORT, it runs that jar with the same arguments as
// dev.ps1 -Bozza on that port instead of dev.ps1 on 8080: for when 8080 and the jar of the checkout are in use.
// The human plays Spazienzio and shows its 40 HIT on purpose: «PAZIENZA: FINITA» first, then it keeps the shown hit until the
// computer is at 40 health or less, so that the computer meets both the lethal hit it can see (D76, point 1) and the token
// it can exploit (D76, point 2). Each turn is logged as the human sees it; the export of the server is kept as evidence.
const {spawn, execFileSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const [repo, out, gamesArg] = process.argv.slice(2);
const {Client} = require(path.join(repo, 'scripts/bm-cli.cjs'));
const GAMES = Number(gamesArg || 3);
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(out, {recursive: true});
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-d76-'));
const PORT = Number(process.env.BM_PORT || 8080), DIR = process.env.BM_SERVER_DIR;
const args = ['-NoProfile', '-File', path.join(repo, 'scripts/dev.ps1'), '-Task', 'Server', '-Bozza', '-SeedAccounts',
  '-Pool', 'starter-spazienzio', '-Com', 'starter-mara', '-Bot', 'prudente'];
const jarArgs = ['-jar', 'target/bm-server-0.0.1-SNAPSHOT.jar', '--spring.profiles.active=local,bozza', '--app.bozza.pool=starter-spazienzio',
  '--app.bozza.com=starter-mara', '--app.bozza.bot=prudente', '--app.dev.seed-accounts=true', '--server.port=' + PORT];
const java = path.join(repo, '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64/bin/java.exe');
const log = {command: DIR ? 'java ' + jarArgs.join(' ') + ' (in ' + DIR + ')' : './scripts/dev.ps1 ' + args.slice(3).join(' '),
  database: path.join(data, 'bozza.sqlite'), games: []};
const env = {...process.env, BM_DATABASE_PATH: log.database};
const server = DIR ? spawn(java, jarArgs, {cwd: DIR, windowsHide: true, env})
  : spawn('powershell.exe', args, {cwd: repo, windowsHide: true, env});
const serverLog = fs.createWriteStream(path.join(data, 'server.log'));
server.stdout.pipe(serverLog); server.stderr.pipe(serverLog);
log.serverLog = path.join(data, 'server.log');

async function next(c, mark, destinations, timeout = 15000) {
  const until = Date.now() + timeout;
  for (;;) {
    const found = c.events.slice(mark).find(e => destinations.includes(e.destination));
    if (found) return found;
    if (Date.now() > until) throw new Error('Event timeout: ' + destinations.join(', '));
    await sleep(15);
  }
}

const SHOWN = 'GARGANTUESCO IMPATTO SUL TU', CHARGE = 'PAZIENZA: FINITA';

/** The human's moves in order of preference; the server refuses what is not legal. */
function candidates(view, user) {
  const me = view.players[user], foeId = Object.keys(view.players).find(p => p !== user);
  const foe = view.players[foeId], hand = me.cardsInHand, res = me.character.resources, foeHealth = foe.character.resources.HEALTH;
  const shown = (me.revealed || []).some(r => r.card.name === SHOWN);
  const affordable = c => Object.entries(c.cost || {}).every(([k, v]) => (res[k] || 0) >= v);
  const move = (card, target, choices) => ({playedCardName: card.name, targetId: target, choices: choices || null});
  const out = [];
  const big = hand.find(c => c.name === SHOWN);
  if (big && affordable(big) && (!shown || foeHealth <= 40)) out.push(move(big, foeId));
  const charge = hand.find(c => c.name === CHARGE);
  if (charge && !shown && !big) out.push(move(charge, 'SELF'));
  const others = hand.filter(c => !c.item && c.name !== SHOWN && c.name !== CHARGE && affordable(c))
    .sort((a, b) => (a.lastResort ? 3 : a.basicAction ? 2 : a.characterBound ? 1 : 0) - (b.lastResort ? 3 : b.basicAction ? 2 : b.characterBound ? 1 : 0));
  for (const card of others) {
    const far = card.canTarget.includes('OPPONENT') || card.canTarget.includes('FAR_ITEM');
    const target = far ? foeId : 'SELF', choices = {};
    if (card.canTarget.includes('NEAR_ITEM') || card.canTarget.includes('FAR_ITEM')) {
      const items = (target === 'SELF' ? me : foe).character.items;
      if (!items.length) continue;
      choices.TARGET_ITEM = items[0].name;
    }
    if (card.characterBound) {
      const discard = hand.find(c => c !== card && c.name !== SHOWN && !c.basicAction && !c.characterBound && !c.lastResort);
      if (!discard) continue;
      choices.DISCARD_ONE = discard.name;
    }
    out.push(move(card, target, Object.keys(choices).length ? choices : null));
  }
  if (big && affordable(big)) out.push(move(big, foeId));
  return out;
}

function snapshot(view, user) {
  const me = view.players[user], foeId = Object.keys(view.players).find(p => p !== user), foe = view.players[foeId];
  return {
    turn: view.turn,
    human: {resources: me.character.resources, shown: (me.revealed || []).map(r => r.card.name),
      token: (me.character.statuses || []).filter(s => s.exposure != null).map(s => s.description)},
    computer: {resources: foe.character.resources, statuses: (foe.character.statuses || []).map(s => s.name),
      shown: (foe.revealed || []).map(r => r.card.name)},
  };
}

async function play(c, user) {
  const mark = c.events.length;
  await c.command({command: 'join', mode: 'quick/1vCom'});
  const id = (await c.wait('/user/queue/game/quick/1vCom/ready', mark)).data;
  await c.command({command: 'watch', gameId: id});
  let view = (await c.command({command: 'view', gameId: id})).data;
  const turns = [];
  while (!view.over && turns.length < 60) {
    if (view.players[user].character.dead) break;
    const seen = snapshot(view, user);
    let sent = null;
    for (const move of candidates(view, user)) {
      const m = c.events.length;
      await c.command({command: 'move', move: Object.assign({gameId: id, playerId: user}, move)});
      const reply = await next(c, m, ['/user/queue/illegalMove', '/topic/game/' + id + '/update']);
      if (reply.destination === '/user/queue/illegalMove') continue;
      sent = move; break;
    }
    if (!sent) throw new Error('No accepted move');
    turns.push(Object.assign(seen, {humanMove: sent}));
    view = (await c.command({command: 'view', gameId: id})).data;
  }
  while (!view.over) { await sleep(50); view = (await c.command({command: 'view', gameId: id})).data; }
  const exported = (await c.command({command: 'export', gameId: id})).data;
  await c.command({command: 'leave', gameId: id});
  return {gameId: id, turns, final: snapshot(view, user), exported};
}

async function main() {
  let up = false;
  for (let i = 0; i < 240 && !up; i++) {
    if (server.exitCode !== null) throw new Error('Server exited');
    try {
      const r = await fetch('http://127.0.0.1:' + PORT + '/api/rest/v1/sign-in/validate', {method: 'POST',
        headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'devAlice', password: 'local-alice'})});
      up = r.ok;
    } catch (_) { /* not yet */ }
    if (!up) await sleep(500);
  }
  if (!up) throw new Error('Startup timeout');
  const c = new Client('http://127.0.0.1:' + PORT + '/api', 'devAlice', 'local-alice', 15000);
  await c.connect();
  try {
    for (let g = 0; g < GAMES; g++) {
      const game = await play(c, 'devAlice');
      fs.writeFileSync(path.join(out, 'export-' + (g + 1) + '.json'), JSON.stringify(game.exported));
      delete game.exported;
      log.games.push(game);
    }
  } finally { await c.close(); }
}

main().then(() => { log.ok = true; }, e => { log.error = String(e.stack || e); process.exitCode = 1; }).finally(() => {
  fs.writeFileSync(path.join(out, 'partite.json'), JSON.stringify(log, null, 1));
  try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], {stdio: 'ignore', windowsHide: true}); } catch (_) { /* gone */ }
});

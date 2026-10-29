'use strict';
const assert = require('assert');
const crypto = require('crypto');
const {Client} = require('./bm-cli.cjs');
async function main() {
  const c = new Client(process.env.BM_URL, process.env.BM_USER, process.env.BM_PASSWORD, 6000);
  try {
    await c.connect();
    const mark = c.events.length;
    await c.command({command: 'join', mode: 'quick/1vCom'});
    const id = (await c.wait('/user/queue/game/quick/1vCom/ready', mark)).data;
    assert.strictEqual(id, process.env.BM_GAME);
    await c.command({command: 'watch', gameId: id});
    const before = (await c.command({command: 'view', gameId: id})).data;
    assert.strictEqual(before.over, false);
    const raw = JSON.parse(process.env.BM_MOVE);
    const move = {gameId: raw.gameId, playerId: raw.playerId, playedCardName: raw.playedCardName, targetId: raw.targetId, choices: raw.choices};
    let after = c.events.length;
    await c.command({command: 'move', move: {...move, targetId: null}});
    await c.wait('/user/queue/illegalMove', after);
    after = c.events.length;
    await c.command({command: 'move', move});
    await c.wait('/topic/game/' + id + '/update', after);
    const view = (await c.command({command: 'view', gameId: id})).data;
    assert.strictEqual(view.over, true);
    const exported = (await c.command({command: 'export', gameId: id})).data;
    const failed = process.env.BM_FAULT === 'true';
    assert.strictEqual(exported.recording.status, failed ? 'WRITE_FAILED' : 'OK');
    assert.strictEqual(exported.recording.complete, !failed);
    assert.strictEqual(exported.events.length, failed ? 1 : 7);
    assert.strictEqual(exported.unpersistedEvents.length, failed ? 6 : 0);
    const all = exported.events.concat(exported.unpersistedEvents);
    let previous = '';
    for (let i = 0; i < all.length; i++) {
      const event = all[i];
      assert.strictEqual(event.sequence, i); assert.strictEqual(event.previousHash, previous);
      assert.strictEqual(event.hash, crypto.createHash('sha256').update(id + '\n' + i + '\n' + previous + '\n' + event.json).digest('hex'));
      previous = event.hash;
    }
    assert.deepStrictEqual(all.map(e => JSON.parse(e.json).kind),
      ['INITIAL', 'MOVE_ACCEPTED', 'ROUND_READY', 'ENGINE_REPORT', 'ROUND_COMMITTED', 'COMMAND_COMMITTED', 'OUTCOME']);
    const initial = JSON.parse(all[0].json).data;
    assert.strictEqual(initial.state.mode, 'quick1vCom'); assert.strictEqual(initial.state.players.length, 2);
    assert.strictEqual(initial.versions.rulesVersion, '1.8');
    assert.strictEqual(initial.state.players[0].initialDeckDrawOrder.length, 20);
    assert.strictEqual(JSON.parse(all[2].json).data.pendingMoves.length, 2);
    const result = JSON.parse(all[4].json).data;
    assert.strictEqual(result.resolvedMoves.length, 2);
    assert.strictEqual(result.players[0].resources.HEALTH, 85);
    assert.strictEqual(result.players[1].resources.HEALTH, -5);
    assert.strictEqual(result.outcome.result, 'win'); assert.strictEqual(result.outcome.winner, process.env.BM_USER);
    assert(Object.keys(result.resolvedMoves[0].report).length > 0);
    await c.command({command: 'leave', gameId: id});
    const again = (await c.command({command: 'export', gameId: id})).data;
    assert.deepStrictEqual(again, exported);
    const stranger = new Client(process.env.BM_URL, process.env.BM_OBSERVER, process.env.BM_PASSWORD, 3000);
    try {
      await stranger.connect();
      await assert.rejects(stranger.command({command: 'export', gameId: id}));
      assert(!stranger.events.some(e => e.destination === '/user/queue/archive/' + id + '/export'));
    } finally { await stranger.close(); }
    console.log(JSON.stringify({ok: true, fault: failed, exported}));
  } finally { await c.close(); }
}
main().catch(() => {console.error('CLI match/export assertion failed'); process.exitCode = 1;});

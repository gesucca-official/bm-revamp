'use strict';
// SB-3: partite quick/1vCom sul server vero, con scelte casuali legali come ComPlayer; salva gli export
// per SimulationControlTest. Uso: node scripts/cli-sim-control.cjs PARTITE CARTELLA (BM_URL, BM_USER, BM_PASSWORD).
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {Client} = require('./bm-cli.cjs');
const pick = list => list[Math.floor(Math.random() * list.length)];
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function move(view, user, gameId) {
  const me = view.players[user];
  const bot = Object.keys(view.players).find(id => id !== user);
  const myItems = me.character.items || [];
  const botItems = view.players[bot].character.items || [];
  for (const card of shuffled(me.cardsInHand)) {
    const targets = card.canTarget || [];
    const affordable = Object.entries(card.cost || {}).every(([res, qty]) => (me.character.resources[res] || 0) >= qty);
    if (!affordable) continue;
    const choices = {};
    if (card.characterBound) {
      const discard = shuffled(me.cardsInHand).find(c => !c.characterBound && !c.basicAction && !c.lastResort);
      if (!discard) continue;
      choices.DISCARD_ONE = discard.name;
    }
    if (targets.includes('NEAR_ITEM')) {
      if (!myItems.length) continue;
      choices.TARGET_ITEM = pick(myItems).name;
    } else if (targets.includes('FAR_ITEM')) {
      if (!botItems.length) continue;
      choices.TARGET_ITEM = pick(botItems).name;
    }
    const self = targets.includes('SELF') || targets.includes('NEAR_ITEM');
    return {gameId, playerId: user, playedCardName: card.name, targetId: self ? 'SELF' : bot,
      choices: Object.keys(choices).length ? choices : null};
  }
  throw new Error('Nessuna mossa legale in mano');
}
async function main() {
  const games = Number(process.argv[2]);
  const directory = process.argv[3];
  const user = process.env.BM_USER;
  fs.mkdirSync(directory, {recursive: true});
  const c = new Client(process.env.BM_URL, user, process.env.BM_PASSWORD, 10000);
  await c.connect();
  try {
    for (let game = 0; game < games; game++) {
      let mark = c.events.length;
      await c.command({command: 'join', mode: 'quick/1vCom'});
      const id = (await c.wait('/user/queue/game/quick/1vCom/ready', mark)).data;
      await c.command({command: 'watch', gameId: id});
      let view = (await c.command({command: 'view', gameId: id})).data;
      for (let turn = 0; !view.over; turn++) {
        assert(turn < 200, 'Partita bloccata');
        mark = c.events.length;
        await c.command({command: 'move', move: move(view, user, id)});
        await c.wait('/topic/game/' + id + '/update', mark);
        assert.strictEqual(c.events.slice(mark).filter(e => e.destination === '/user/queue/illegalMove').length, 0);
        view = (await c.command({command: 'view', gameId: id})).data;
      }
      const exported = (await c.command({command: 'export', gameId: id})).data;
      assert.strictEqual(exported.recording.complete, true);
      fs.writeFileSync(path.join(directory, String(game).padStart(4, '0') + '.json'), JSON.stringify(exported));
      await c.command({command: 'leave', gameId: id});
      c.events.length = 0;
      if ((game + 1) % 25 === 0) console.log('partite', game + 1);
    }
  } finally { await c.close(); }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });

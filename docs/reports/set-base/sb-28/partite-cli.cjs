'use strict';
// SB-28, Fase C: real matches of the live game (regulation 2.0, Set Base 1.0) through the CLI, against a running server.
// For each of the five starters of the live set file and the two booster characters (the decks prova-sergio and prova-duccio
// of the test decks, built with live cards), the runner saves the deck, plays an open 1vCom to the outcome and checks the
// export (rules 2.0, set 1.0, integrity). Then a few quick 1vCom, to see the random starters of D182 (1). Moves are tried in a
// fixed order (regular, bound, basic, last resort); the server refuses what is not legal. Saved decks are deleted at the end.
//
//   $env:BM_URL='http://localhost:8080/api'; $env:BM_USER='devAlice'; $env:BM_PASSWORD='...'
//   node docs/reports/set-base/sb-28/partite-cli.cjs [QUICK] > partite.json
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../../..');
const {Client} = require(path.join(root, 'scripts/bm-cli.cjs'));

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function next(c, mark, destinations, timeout = 15000) {
  const until = Date.now() + timeout;
  for (;;) {
    const found = c.events.slice(mark).find(e => destinations.includes(e.destination));
    if (found) return found;
    if (Date.now() > until) throw new Error('Event timeout: ' + destinations.join(', '));
    await sleep(15);
  }
}

function candidates(view, user) {
  const me = view.players[user], hand = me.cardsInHand, resources = me.character.resources;
  const opponents = Object.keys(view.players).filter(p => p !== user && !view.players[p].character.dead);
  const rank = c => c.lastResort ? 3 : c.basicAction ? 2 : c.characterBound ? 1 : 0;
  const affordable = c => Object.entries(c.cost || {}).every(([k, v]) => (resources[k] || 0) >= v);
  const out = [];
  for (const card of hand.filter(c => !c.item && affordable(c)).sort((a, b) => rank(a) - rank(b))) {
    const far = card.canTarget.includes('OPPONENT') || card.canTarget.includes('FAR_ITEM');
    for (const target of far ? opponents : ['SELF']) {
      const choices = {};
      if (card.canTarget.includes('NEAR_ITEM') || card.canTarget.includes('FAR_ITEM')) {
        const owner = target === 'SELF' ? me : view.players[target];
        if (!owner.character.items.length) continue;
        choices.TARGET_ITEM = owner.character.items[0].name;
      }
      if (card.characterBound) {
        const discard = hand.find(c => c !== card && !c.basicAction && !c.characterBound && !c.lastResort);
        if (!discard) continue;
        choices.DISCARD_ONE = discard.name;
      }
      out.push({playedCardName: card.name, targetId: target, choices: Object.keys(choices).length ? choices : null});
    }
  }
  return out;
}

async function play(c, id, user) {
  await c.command({command: 'watch', gameId: id});
  let view = (await c.command({command: 'view', gameId: id})).data, turns = 0, refused = 0;
  const played = [];
  while (!view.over) {
    assert(turns < 80, 'Runner stall bound; no outcome manufactured');
    if (view.players[user].character.dead) break;
    let accepted = false;
    for (const move of candidates(view, user)) {
      const mark = c.events.length;
      await c.command({command: 'move', move: Object.assign({gameId: id, playerId: user}, move)});
      const reply = await next(c, mark, ['/user/queue/illegalMove', '/topic/game/' + id + '/update']);
      if (reply.destination === '/user/queue/illegalMove') { refused++; continue; }
      accepted = true; played.push(move.playedCardName); break;
    }
    assert(accepted, 'No accepted move: the last resort is always playable (R02)');
    view = (await c.command({command: 'view', gameId: id})).data;
    turns++;
  }
  while (!view.over) { await sleep(50); view = (await c.command({command: 'view', gameId: id})).data; }
  return {view, turns, played, refused};
}

function events(exported) {
  let previous = '';
  const parsed = exported.events.map((entry, i) => {
    assert.strictEqual(entry.sequence, i); assert.strictEqual(entry.previousHash, previous);
    assert.strictEqual(entry.hash, crypto.createHash('sha256').update(exported.gameId + '\n' + i + '\n' + previous + '\n' + entry.json).digest('hex'));
    previous = entry.hash; return JSON.parse(entry.json);
  });
  assert.strictEqual(exported.integrity.headHash, previous);
  return parsed;
}

async function main() {
  const user = process.env.BM_USER, quick = Number(process.argv[2] || 5);
  const live = JSON.parse(fs.readFileSync(path.join(root, 'server/src/main/resources/sets/base.json'), 'utf8'));
  const tests = JSON.parse(fs.readFileSync(path.join(root, 'server/src/test/resources/set-base/mazzi-prova.json'), 'utf8'));
  const decks = live.decks.concat(tests.decks.filter(d => ['prova-sergio', 'prova-duccio'].includes(d.id)));
  assert.strictEqual(decks.length, 7);
  const c = new Client(process.env.BM_URL, user, process.env.BM_PASSWORD, 8000);
  const report = {decks: [], quick: []};
  const saved = [];
  try {
    await c.connect();
    const profile = (await c.command({command: 'profile'})).data;
    const card = b => { const found = profile.collection.cards.find(x => x.bindingName === b); assert(found, 'not in the collection: ' + b); return found; };
    const character = b => { const found = profile.collection.characters.find(x => x.bindingName === b); assert(found, b); return found; };
    // The collection is the live set: its seven characters and its cards; no card carries «Ultimo colpo» (D183 (3)).
    assert.deepStrictEqual(profile.collection.characters.map(x => x.bindingName).sort(), live.characters.map(x => x.id).sort());
    report.collection = {characters: profile.collection.characters.length, cards: profile.collection.cards.length};
    const basicOf = Object.fromEntries(live.characters.map(x => [x.id, x.basic]));

    async function finish(id, mode, result) {
      const exported = (await c.command({command: 'export', gameId: id})).data;
      assert.deepStrictEqual(exported.unpersistedEvents, []);
      assert.strictEqual(exported.recording.complete, true); assert.strictEqual(exported.recording.status, 'OK');
      const list = events(exported), initial = list[0].data, final = list[list.length - 1].data;
      assert.strictEqual(list[0].kind, 'INITIAL'); assert.strictEqual(list[list.length - 1].kind, 'OUTCOME');
      assert.strictEqual(initial.state.mode, mode);
      await c.command({command: 'leave', gameId: id});
      return {gameId: id, versions: initial.versions, character: initial.state.players.find(p => p.playerId === user).character,
        foe: initial.state.players.find(p => p.playerId !== user).character, turns: result.turns, refused: result.refused,
        outcome: final.outcome, played: result.played.length, distinct: [...new Set(result.played)].length};
    }

    for (const d of decks) {
      const deck = {deckId: 'sb28-' + d.id, character: character(d.character), basicActionCard: card(basicOf[d.character]),
        characterBoundCards: d.bound.map(card), lastResortCard: card(d.lastResort),
        regularCards: [].concat(...Object.entries(d.cards).map(([b, n]) => Array(n).fill(b))).map(card)};
      const after = (await c.command({command: 'save', deck})).data;
      assert(after.decks.some(x => x.deckId === deck.deckId), 'saved ' + deck.deckId);
      saved.push(deck);
      const mark = c.events.length;
      await c.command({command: 'join', mode: 'open/1vCom', deckId: deck.deckId});
      const id = (await c.wait('/user/queue/game/open/1vCom/ready', mark, 15000)).data;
      const row = await finish(id, 'open1vCom', await play(c, id, user));
      assert.strictEqual(row.character, d.character);
      report.decks.push(Object.assign({deck: d.id, name: d.name || null, category: d.category || null}, row));
    }
    for (let i = 0; i < quick; i++) {
      const mark = c.events.length;
      await c.command({command: 'join', mode: 'quick/1vCom'});
      const id = (await c.wait('/user/queue/game/quick/1vCom/ready', mark, 15000)).data;
      report.quick.push(await finish(id, 'quick1vCom', await play(c, id, user)));
    }
  } finally {
    for (const deck of saved) await c.command({command: 'delete', deck}).catch(() => {});
    await c.close();
  }
  console.log(JSON.stringify(report, null, 2));
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });

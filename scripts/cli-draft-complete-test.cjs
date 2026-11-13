'use strict';
// SB-8: real matches with the set draft on the development server (profile bozza), driven by BozzaCliTest.
// Collection and ready decks from the draft; open 1vCom with two starters whose Java draft cards exist only in the draft;
// quick 1vCom; quick 1v1 between two accounts. Every match ends with an outcome decided by the server; the runner only tries
// moves in a fixed order and lets the server refuse what is not legal. Exports carry versions.draft.
const assert = require('assert');
const crypto = require('crypto');
const {Client} = require('./bm-cli.cjs');

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

// Moves in a fixed order: draft cards (`base.`) first, so that the match plays them; regular, bound, basic, last resort.
// Shapes follow the move contract (target category, discard for a bound, item for an item card); legality is the server's.
function candidates(view, user) {
  const me = view.players[user], hand = me.cardsInHand, resources = me.character.resources;
  const opponents = Object.keys(view.players).filter(p => p !== user && !view.players[p].character.dead);
  const rank = c => (c.lastResort ? 3 : c.basicAction ? 2 : c.characterBound ? 1 : 0) + (c.bindingName.startsWith('base.') ? 0 : 4);
  const affordable = c => Object.entries(c.cost || {}).every(([k, v]) => (resources[k] || 0) >= v);
  const out = [];
  for (const card of hand.filter(c => !c.item && affordable(c)).sort((a, b) => rank(a) - rank(b))) {
    const far = card.canTarget.includes('OPPONENT') || card.canTarget.includes('FAR_ITEM');
    for (const target of far ? opponents : ['SELF']) {
      const choices = {};
      if (card.canTarget.includes('NEAR_ITEM') || card.canTarget.includes('FAR_ITEM')) {
        const owner = target === 'SELF' ? me : view.players[target];
        const items = owner.character.items;
        if (!items.length) continue;
        choices.TARGET_ITEM = items[0].name;
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
  let view = (await c.command({command: 'view', gameId: id})).data, turns = 0;
  const played = [];
  while (!view.over) {
    assert(turns < 80, 'Runner stall bound; no outcome manufactured');
    if (view.players[user].character.dead) break;
    let accepted = false;
    for (const move of candidates(view, user)) {
      const mark = c.events.length;
      await c.command({command: 'move', move: Object.assign({gameId: id, playerId: user}, move)});
      const reply = await next(c, mark, ['/user/queue/illegalMove', '/topic/game/' + id + '/update']);
      if (reply.destination === '/user/queue/illegalMove') continue;
      accepted = true; played.push(move.playedCardName); break;
    }
    assert(accepted, 'No accepted move: the last resort is always playable (R02)');
    view = (await c.command({command: 'view', gameId: id})).data;
    turns++;
  }
  while (!view.over) { await sleep(50); view = (await c.command({command: 'view', gameId: id})).data; }
  return {view, turns, played};
}

function events(exported) {
  let previous = '';
  const id = exported.gameId;
  const parsed = exported.events.map((entry, i) => {
    assert.strictEqual(entry.sequence, i); assert.strictEqual(entry.previousHash, previous);
    assert.strictEqual(entry.hash, crypto.createHash('sha256').update(id + '\n' + i + '\n' + previous + '\n' + entry.json).digest('hex'));
    previous = entry.hash; return JSON.parse(entry.json);
  });
  assert.strictEqual(exported.integrity.headHash, previous);
  return parsed;
}

async function main() {
  const user = process.env.BM_USER, otherUser = process.env.BM_OTHER;
  const decks = JSON.parse(process.env.BM_DECKS), characters = JSON.parse(process.env.BM_CHARACTERS);
  const c = new Client(process.env.BM_URL, user, process.env.BM_PASSWORD, 8000);
  const o = new Client(process.env.BM_URL, otherUser, process.env.BM_PASSWORD, 8000);
  const exports = [], summary = [];
  try {
    await c.connect(); await o.connect();
    const profile = (await c.command({command: 'profile'})).data;
    // The collection is the draft: its five characters, its cards (Java draft classes included), its ready decks.
    assert.deepStrictEqual(profile.collection.characters.map(x => x.bindingName).sort(), characters.slice().sort());
    const binding = {};
    for (const card of profile.collection.cards) binding[card.name] = card.bindingName;
    for (const b of ['base.pino.UltimoGiro', 'base.pino.GoingBerserk', 'base.gigi.LavoroFattoBene', 'base.mara.Sgommata'])
      assert(profile.collection.cards.some(x => x.bindingName === b), b);
    assert(profile.collection.cards.every(x => x.image === 'no-img.png'), 'catalog image fallback');
    assert.deepStrictEqual(profile.decks.map(d => d.deckId).filter(d => decks.includes(d)).sort(), decks.slice().sort());
    const mara = profile.decks.find(d => d.deckId === 'starter-mara');
    assert.strictEqual(mara.character.name, 'Mara Contromano');
    assert.strictEqual(mara.regularCards.length, 20);
    assert.strictEqual(mara.basicActionCard.exclusiveToCharacter, 'base.character.Mara');
    // A ready deck is read-only; a deck built with the draft's cards can be saved and deleted.
    await assert.rejects(c.command({command: 'save', deck: mara}), /reserved for a ready deck/);
    const copy = Object.assign({}, mara, {deckId: 'sb8-mara'});
    assert((await c.command({command: 'save', deck: copy})).data.decks.some(d => d.deckId === 'sb8-mara'));
    assert(!(await c.command({command: 'delete', deck: copy})).data.decks.some(d => d.deckId === 'sb8-mara'));

    async function finish(id, mode, result, expect) {
      assert(result.view.over);
      const exported = (await c.command({command: 'export', gameId: id})).data;
      assert.deepStrictEqual(exported.unpersistedEvents, []);
      assert.strictEqual(exported.recording.complete, true); assert.strictEqual(exported.recording.status, 'OK');
      const list = events(exported), initial = list[0].data, final = list[list.length - 1].data;
      assert.strictEqual(list[0].kind, 'INITIAL'); assert.strictEqual(list[list.length - 1].kind, 'OUTCOME');
      assert.strictEqual(initial.state.mode, mode);
      assert.strictEqual(initial.versions.draft.sets.base.version, 'bozza');
      assert.strictEqual(initial.versions.draft.sources[0].sha256, process.env.BM_DRAFT_SHA);
      assert.strictEqual(initial.versions.draft.bot, 'risorse');
      // D74: the draft bot keeps its base style and records the public announced-hit timing policy.
      assert.strictEqual(initial.versions.draft.soughtHitTiming, 'ALWAYS');
      // D76: around it, the awareness of the lethal hit of the current turn.
      assert.strictEqual(initial.versions.draft.lethalAware, true);
      assert.strictEqual(initial.configuration.botPolicy,
        expect.bot ? 'LethalAwarePolicy(SoughtHitPolicy(ALWAYS,ResourceAwarePolicy))' : 'random');
      for (const p of initial.state.players) assert(characters.includes(p.character), p.character);
      if (expect.character) assert.strictEqual(initial.state.players.find(p => p.playerId === user).character, expect.character);
      assert(['win', 'draw'].includes(final.outcome.result), JSON.stringify(final.outcome));
      const draftPlayed = result.played.filter(name => (binding[name] || '').startsWith('base.'));
      assert(draftPlayed.length > 0, 'at least one card of the draft played');
      summary.push({mode, gameId: id, turns: result.turns, outcome: final.outcome, played: result.played.length,
        draftPlayed: [...new Set(draftPlayed.map(n => binding[n]))].sort()});
      await c.command({command: 'leave', gameId: id});
      exports.push(exported);
    }

    for (const [deck, character] of [['starter-pino', 'base.character.Pino'], ['starter-gigi', 'base.character.Gigi']]) {
      const mark = c.events.length;
      await c.command({command: 'join', mode: 'open/1vCom', deckId: deck});
      const id = (await c.wait('/user/queue/game/open/1vCom/ready', mark)).data;
      await finish(id, 'open1vCom', await play(c, id, user), {bot: true, character});
    }
    {
      const mark = c.events.length;
      await c.command({command: 'join', mode: 'quick/1vCom'});
      const id = (await c.wait('/user/queue/game/quick/1vCom/ready', mark)).data;
      await finish(id, 'quick1vCom', await play(c, id, user), {bot: true});
    }
    {
      const mc = c.events.length, mo = o.events.length;
      await c.command({command: 'join', mode: 'quick/1v1'});
      await o.command({command: 'join', mode: 'quick/1v1'});
      const id = (await c.wait('/user/queue/game/quick/1v1/ready', mc, 15000)).data;
      assert.strictEqual((await o.wait('/user/queue/game/quick/1v1/ready', mo, 15000)).data, id);
      const [mine] = await Promise.all([play(c, id, user), play(o, id, otherUser)]);
      await finish(id, 'quick1v1', mine, {bot: false});
      await o.command({command: 'leave', gameId: id});
    }
    console.log(JSON.stringify({ok: true, summary, exports}));
  } finally { await c.close(); await o.close(); }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });

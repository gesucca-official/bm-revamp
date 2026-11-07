'use strict';
// Assertions run as part of the existing Spring/JUnit isolated runner.
const assert = require('assert');
const {Client} = require('./bm-cli.cjs');
const clients = [];
function client(user, password = 'synthetic') {
  const c = new Client(process.env.BM_URL, user, password, 2000); clients.push(c); return c;
}
(async () => {
  const alice = client('cliSecurity'); await alice.connect();
  await assert.rejects(client('cliSecurity').connect());
  await assert.rejects(client('cliStranger', 'wrong').connect());
  const id = process.env.BM_GAME;
  await alice.command({command:'watch', gameId:id});
  const view = await alice.command({command:'view', gameId:id});
  assert(Array.isArray(view.data.players.cliSecurity.cardsInHand));
  assert.strictEqual(typeof view.data.players.cliOther.cardsInHand, 'number');
  const move = JSON.parse(process.env.BM_MOVE);
  let mark = alice.events.length;
  await alice.command({command:'move',move:Object.assign({},move,{choices:{DISCARD_ONE:'invalid'}})});
  await alice.wait('/user/queue/illegalMove',mark);
  mark = alice.events.length;
  await alice.command({command:'move', move});
  await alice.wait('/topic/game/' + id + '/move', mark);
  mark = alice.events.length;
  await alice.command({command:'move', move});
  await alice.wait('/user/queue/illegalMove', mark);
  const eve = client('cliStranger'); await eve.connect();
  await assert.rejects(eve.command({command:'view',gameId:id}));
  assert(!eve.events.some(e => e.destination.includes(id)));
  await assert.rejects(alice.command({command:'wait',destination:'/never',timeout:30}));
  await alice.command({command:'profile'}); // timeout did not destroy the session
  
  const a = client('cliModesA'), b = client('cliModesB'); await a.connect(); await b.connect();
  const profile = (await a.command({command:'profile'})).data;
  assert.strictEqual(profile.collection.cards.length, 37);
  const card = binding => {const c = profile.collection.cards.find(c => c.bindingName === binding); assert(c, binding); return c;};
  // R02 1.12: own basic, two different own bound cards, Struggle, 20 regular cards with at most 2 copies each.
  const twice = bindings => [].concat(...bindings.map(b => [card(b), card(b)]));
  const bruiser = profile.collection.characters.find(c => c.bindingName === 'bruiser.character.BigBadBruiser');
  const ten = ['bruiser.SuperImpact','bruiser.Glare','bruiser.StunningBlow','bruiser.YouStop','bruiser.MadeOfStone',
    'bruiser.SeagullFly','com.ShuffleFeet','com.Steal','com.items.RottenBeer','com.items.CocktailOnTheGround'];
  const deck = {deckId:'cli-fixture', character:bruiser,
    basicActionCard:card('com.basic.BruiserGrab'), lastResortCard:card('com.last.Struggle'),
    characterBoundCards:[card('bruiser.character.LittleSmack'), card('bruiser.character.LittleRage')], regularCards:twice(ten)};
  assert(deck.character);
  assert((await a.command({command:'save',deck})).data.decks.some(d => d.deckId === deck.deckId));
  assert(!(await b.command({command:'profile'})).data.decks.some(d => d.deckId === deck.deckId));
  // I15 / R02 1.12: canonical catalog validation and atomic rejection; the overwrite changes bound order and regular cards.
  const otherTen = ten.map(x => x === 'bruiser.SuperImpact' ? 'com.Grab' : x);
  const modified = Object.assign({}, deck, {regularCards:twice(otherTen), characterBoundCards:deck.characterBoundCards.slice().reverse()});
  const overwritten = (await a.command({command:'save',deck:modified})).data.decks.find(d => d.deckId === deck.deckId);
  assert.deepStrictEqual(overwritten.characterBoundCards.map(c => c.bindingName), ['bruiser.character.LittleRage','bruiser.character.LittleSmack']);
  assert.strictEqual(overwritten.regularCards.filter(c => c.bindingName === 'com.Grab').length, 2);
  const smack = card('bruiser.character.LittleSmack'), rage = card('bruiser.character.LittleRage');
  const regular = modified.regularCards;
  const invalid = [
    // Requirements kept from I15 and 1.8.
    {basicActionCard:null}, {lastResortCard:null}, {character:null}, {regularCards:[]},
    {regularCards:[null].concat(regular.slice(1))}, {regularCards:[smack].concat(regular.slice(1))},
    {characterBoundCards:[smack, card('com.Grab')]}, {basicActionCard:card('com.Grab')},
    {regularCards:[{bindingName:'missing.Card'}].concat(regular.slice(1))}, {deckId:'   '}, {deckId:'a/b'}, {characterBoundCards:null},
    // R02 1.12: 19 and 21 regular cards, a third copy (action and item), bound of another character, equal bound cards,
    // one or three bound cards, basic of another character, last resort in the wrong slot.
    {regularCards:regular.slice(1)}, {regularCards:regular.concat([card('junkie.Cough')])},
    {regularCards:[card('bruiser.Glare')].concat(regular.slice(1))}, {regularCards:[card('com.items.RottenBeer')].concat(regular.slice(1))},
    {characterBoundCards:[smack, card('junkie.character.PatheticBlade')]}, {characterBoundCards:[smack, smack]},
    {characterBoundCards:[smack]}, {characterBoundCards:[smack, rage, card('junkie.character.RottenSmile')]},
    {basicActionCard:card('com.basic.ToxicGrab')}, {lastResortCard:card('com.Grab')}
  ];
  const reasons = [];
  for (const patch of invalid) {
    const mark = a.events.length;
    a.send('/app/user/cliModesA/deck', Object.assign({},modified,patch));
    const error = await a.wait('/user/queue/account/error',mark);
    assert(String(error.data).includes('Invalid deck'));
    reasons.push(String(error.data));
    const stored = (await a.command({command:'profile'})).data.decks.find(d => d.deckId === deck.deckId);
    assert.deepStrictEqual(stored.regularCards.map(c => c.bindingName), modified.regularCards.map(c => c.bindingName));
    assert.deepStrictEqual(stored.characterBoundCards.map(c => c.bindingName), ['bruiser.character.LittleRage','bruiser.character.LittleSmack']);
  }
  for (const reason of ['Exactly 20 regular cards required, found 19', 'Exactly 20 regular cards required, found 21',
    'At most 2 copies per card: bruiser.Glare has 3', 'At most 2 copies per card: com.items.RottenBeer has 3',
    'Bound card of another character: junkie.character.PatheticBlade', 'Bound cards must be different: bruiser.character.LittleSmack',
    'Two different bound cards of the character required, found 1', 'Two different bound cards of the character required, found 3',
    'Basic of another character: com.basic.ToxicGrab'])
    assert(reasons.includes('Invalid deck: ' + reason), reason);
  await b.command({command:'delete',deck});
  assert((await a.command({command:'profile'})).data.decks.some(d => d.deckId === deck.deckId));
  await a.command({command:'save',deck});
  for (const mode of ['quick/1vCom','open/1vCom','quick/1v1','quick/ffa']) {
    const dest = (mode.includes('Com') || mode === 'quick/1v1' || mode === 'quick/ffa' ? '/user/queue' : '/topic') + '/game/' + mode + '/ready';
    const mark = a.events.length;
    await a.command({command:'join', mode, deckId:deck.deckId});
    if (mode === 'quick/1v1') await b.command({command:'join',mode});
    if (mode === 'quick/ffa') {
      await a.wait('/topic/game/quick/ffa/joined',mark);
      const next = a.events.length; await a.command({command:'add-bot'});
      await a.wait('/topic/game/quick/ffa/joined',next);
      await a.command({command:'start'});
    }
    const ready = await a.wait(dest,mark);
    const gameId = ready.data;
    const state = (await a.command({command:'view',gameId})).data;
    assert(state.players.cliModesA);
    await a.command({command:'leave',gameId});
    // Profile response is an application round trip after leave on the same connection.
    await a.command({command:'profile'});
  }
  assert(!(await a.command({command:'delete',deck})).data.decks.some(d => d.deckId === deck.deckId));
  
  const {spawnSync} = require('child_process');
  const fs = require('fs'); const os = require('os'); const path = require('path');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'bm-cli-'));
  const scenario = '{"command":"profile"}\n{"command":"logout"}\n';
  function run(args, input, password='synthetic') {
    const result = spawnSync(process.execPath,[path.join(__dirname,'bm-cli.cjs'),...args],
      {input,encoding:'utf8',timeout:6000,env:Object.assign({},process.env,{BM_USER:'cliModesB',BM_PASSWORD:password})});
    assert(!result.error, 'CLI must terminate');
    assert(!result.stdout.includes(password)); assert(!result.stderr.includes(password));
    return result;
  }
  try {
    const file = path.join(dir,'input.jsonl'); fs.writeFileSync(file,scenario);
    // Close b before exercising another process for that account.
    await b.close();
    for (const args of [[],[file]]) {
      const r = run(args,scenario); assert.strictEqual(r.status,0,r.stderr); assert.strictEqual(r.stderr,'');
      const rows = r.stdout.trim().split('\n').map(JSON.parse);
      assert.strictEqual(rows[0].type,'connected');
      assert(rows.some(r => r.type === 'result' && r.command === 'profile' && r.result.data.collection));
    }
    assert.strictEqual(run([],scenario,'wrong-secret-fixture').status,1);
    assert.strictEqual(run([],'not JSON\n').status,1);
    assert.strictEqual(run([],'null\n').status,1);
    assert.strictEqual(run([path.join(dir,'missing')],'').status,1);
  } finally {for (const file of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir,file)); fs.rmdirSync(dir);}
  console.log('CLI security, mode and process assertions passed');


})().catch(error => {console.error('CLI assertions failed:', error.message); process.exitCode=1;})
  .finally(async () => {for (const c of clients) await c.close();});



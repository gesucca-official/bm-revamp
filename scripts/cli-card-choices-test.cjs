'use strict';
// Real CLI transports, synthetic match installed by the existing JUnit runner.
const assert = require('assert');
const {Client} = require('./bm-cli.cjs');
const clients = ['cliCardsA','cliCardsB'].map(user => new Client(process.env.BM_URL,user,'synthetic',3000));
(async () => {
  const [a,b] = clients, id = process.env.BM_GAME;
  const rounds = JSON.parse(process.env.BM_ROUNDS).map(round => round.map(m => ({
    gameId:m.gameId, playerId:m.playerId, playedCardName:m.playedCardName, targetId:m.targetId, choices:m.choices
  })));
  for (const c of clients) { await c.connect(); await c.command({command:'watch',gameId:id}); await c.command({command:'view',gameId:id}); }
  async function reject(c,move) {
    const mark=c.events.length;
    await c.command({command:'move',move}); await c.wait('/user/queue/illegalMove',mark);
  }
  const initial=(await a.command({command:'view',gameId:id})).data;
  await reject(a,Object.assign({},rounds[0][0],{choices:{TARGET_ITEM:'absent'}}));
  assert.deepStrictEqual((await a.command({command:'view',gameId:id})).data,initial);
  for (let i=0;i<rounds.length;i++) {
    if(i===1) {
      await reject(a,Object.assign({},rounds[i][0],{choices:{DISCARD_ONE:'absent'}}));
      await reject(a,Object.assign({},rounds[i][0],{choices:null}));
    }
    const mark=a.events.length;
    await a.command({command:'move',move:rounds[i][0]});
    await a.wait('/topic/game/'+id+'/move',mark);
    await b.command({command:'move',move:rounds[i][1]});
    await a.wait('/topic/game/'+id+'/update',mark);
    const state=(await a.command({command:'view',gameId:id})).data;
    assert.strictEqual(state.players.cliCardsA.character.resources.HEALTH,[100,100,80][i]);
    assert.strictEqual(state.players.cliCardsB.character.resources.HEALTH,[100,95,78][i]);
    assert.strictEqual(state.players.cliCardsA.character.resources.ALERTNESS,[10,15,15][i]);
    assert.strictEqual(state.players.cliCardsB.character.resources.ALERTNESS,[13,5,5][i]); // final ALCOHOL=1: integer 1/2=0
  }
  console.log('CLI card choices: three rounds and recoverable item/discard errors passed');
})().catch(error => {console.error(error.stack); process.exitCode=1;})
  .finally(async () => {for(const c of clients) await c.close();});

'use strict';
const assert = require('assert');
const crypto = require('crypto');
const {Client} = require('./bm-cli.cjs');
async function main() {
  const c = new Client(process.env.BM_URL, process.env.BM_USER, process.env.BM_PASSWORD, 6000);
  const exports = [];
  try {
    await c.connect();
    const ids = JSON.parse(process.env.BM_IDS);
    for (let match = 0; match < 2; match++) {
      let mark = c.events.length;
      await c.command({command:'join',mode:'quick/1vCom'});
      const id = (await c.wait('/user/queue/game/quick/1vCom/ready',mark)).data;
      assert.strictEqual(id,ids[match]);
      await c.command({command:'watch',gameId:id});
      let view = (await c.command({command:'view',gameId:id})).data;
      const user = process.env.BM_USER;
      const bot = Object.keys(view.players).find(p=>p!==user);
      let turns = 0, lastMove;
      while (!view.over) {
        assert(turns < 40,'Stall detected by runner; no outcome manufactured');
        const hand = view.players[user].cardsInHand;
        const card = hand.find(c=>c.bindingName==='com.ShuffleFeet') || hand.find(c=>c.lastResort);
        assert(card,'Fixture must offer its prescribed legal action');
        lastMove={gameId:id,playerId:user,playedCardName:card.name,targetId:bot,choices:null};
        mark=c.events.length;
        await c.command({command:'move',move:lastMove});
        await c.wait('/topic/game/'+id+'/update',mark);
        view=(await c.command({command:'view',gameId:id})).data;
        turns++;
        const struggleTurns=match===0 ? Math.max(0,turns-20) : turns;
        assert.strictEqual(view.players[user].character.resources.HEALTH,100-struggleTurns*(match===0?5:15));
        assert.strictEqual(view.players[bot].character.resources.HEALTH,100-struggleTurns*(match===0?10:15));
        assert.strictEqual(view.players[user].deck,match===0?Math.max(0,17-turns):0);
      }
      assert.strictEqual(turns,match===0?30:7);
      const exported=(await c.command({command:'export',gameId:id})).data;
      assert.strictEqual(exported.recording.complete,true);
      assert.strictEqual(exported.recording.status,'OK');
      assert.deepStrictEqual(exported.unpersistedEvents,[]);
      const expectedKinds=['INITIAL'];
      for(let i=0;i<turns;i++) expectedKinds.push('MOVE_ACCEPTED','ROUND_READY','ENGINE_REPORT','ROUND_COMMITTED','COMMAND_COMMITTED');
      expectedKinds.push('OUTCOME');
      let previous='';
      const events=exported.events.map((entry,i)=>{
        assert.strictEqual(entry.sequence,i); assert.strictEqual(entry.previousHash,previous);
        assert.strictEqual(entry.hash,crypto.createHash('sha256').update(id+'\n'+i+'\n'+previous+'\n'+entry.json).digest('hex'));
        previous=entry.hash; return JSON.parse(entry.json);
      });
      assert.deepStrictEqual(events.map(e=>e.kind),expectedKinds);
      assert.strictEqual(exported.integrity.headHash,previous);
      const initial=events[0].data;
      assert.strictEqual(initial.configuration.botPolicy,'random');
      assert.strictEqual(initial.versions.rulesVersion,process.env.BM_RULES_VERSION);
      assert.strictEqual(initial.state.players[0].initialDeckDrawOrder.length,match===0?20:0);
      for(const key of ['codeSha256','rulesSha256','catalogSha256','rulesCatalogSha256']) assert(/^[a-f0-9]{64}$/.test(initial.versions[key]),key);
      assert.strictEqual(initial.state.players[0].character,user==='i13Junkie'?'junkie.character.ToxicJunkie':'bruiser.character.BigBadBruiser');
      events.filter(e=>e.kind==='ROUND_READY').forEach(e=>{
        assert.strictEqual(e.data.pendingMoves.length,2);
        assert.strictEqual(e.data.pendingMoves.find(m=>m.playerId===bot).void,match===0);
      });
      events.filter(e=>e.kind==='ROUND_COMMITTED').forEach((e,i)=>{
        assert.strictEqual(e.data.turn,i+1);
        const n=match===0?Math.max(0,i+1-20):i+1;
        assert.strictEqual(e.data.players[0].resources.HEALTH,100-n*(match===0?5:15));
        assert.strictEqual(e.data.players[1].resources.HEALTH,100-n*(match===0?10:15));
        assert.strictEqual(e.data.resolvedMoves.length,match===0?1:2);
        e.data.players.forEach(p=>{
          for(const field of ['hand','deckDrawOrder','items','statuses','timers','immunities','resources','specialCards','character']) assert(p[field]!==undefined,field);
        });
        assert(Object.keys(e.data.resolvedMoves[0].report).length>0);
      });
      events.filter(e=>e.kind==='ENGINE_REPORT').forEach(e=>assert(e.data.length>0));
      const final=events[events.length-1].data;
      assert.strictEqual(final.outcome.result,match===0?'win':'draw');
      assert.strictEqual(final.outcome.winner,match===0?user:null);
      assert.strictEqual(final.turn,turns);
      mark=c.events.length;
      await c.command({command:'move',move:lastMove});
      const illegal=await c.wait('/user/queue/illegalMove',mark);
      assert(String(illegal.data).includes('Game is over'));
      assert.deepStrictEqual((await c.command({command:'view',gameId:id})).data,view);
      assert.deepStrictEqual((await c.command({command:'export',gameId:id})).data,exported);
      await c.command({command:'leave',gameId:id});
      assert.deepStrictEqual((await c.command({command:'export',gameId:id})).data,exported);
      exports.push(exported);
    }
    assert.notStrictEqual(ids[0],ids[1]);
    assert.deepStrictEqual((await c.command({command:'export',gameId:ids[0]})).data,exports[0]);
    console.log(JSON.stringify({ok:true,exports}));
  } finally { await c.close(); }
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});


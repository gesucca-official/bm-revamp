'use strict';
const assert = require('assert');
const crypto = require('crypto');
const {Client} = require('./bm-cli.cjs');
async function main() {
  const user=process.env.BM_USER;
  const c=new Client(process.env.BM_URL,user,process.env.BM_PASSWORD,6000);
  const other=new Client(process.env.BM_URL,'i16Other',process.env.BM_PASSWORD,6000);
  const exports=[];
  try {
    await c.connect(); await other.connect();
    const profile=(await c.command({command:'profile'})).data;
    const card=b=>{const found=profile.collection.cards.find(c=>c.bindingName===b); assert(found,b); return found;};
    const character=b=>profile.collection.characters.find(c=>c.bindingName===b);
    // R02 1.12: two valid decks, 20 regular actions (no items, so no draw chain) with two copies each. Every turn the human
    // plays the bound without damage (`quiet`) discarding a regular card; with no regular card left in hand, Struggle.
    // The bot (fixed by OpenCompleteCliTest) has no move, so HEALTH and deck counts are exact.
    const n=20;
    const configs=[
      {id:'i16-bruiser',character:'bruiser.character.BigBadBruiser',basic:'com.basic.BruiserGrab',
        bound:['bruiser.character.LittleSmack','bruiser.character.LittleRage'],quiet:'bruiser.character.LittleRage',quietSelf:true,
        regular:['bruiser.Glare','bruiser.StunningBlow','bruiser.SuperImpact','bruiser.YouStop','bruiser.MadeOfStone',
          'bruiser.SeagullFly','bruiser.HealingBlow','com.ShuffleFeet','com.Grab','com.Steal']},
      {id:'i16-junkie',character:'junkie.character.ToxicJunkie',basic:'com.basic.ToxicGrab',
        bound:['junkie.character.RottenSmile','junkie.character.PatheticBlade'],quiet:'junkie.character.RottenSmile',quietSelf:false,
        regular:['junkie.Cough','junkie.BadTrip','junkie.GoingBerserk','junkie.MethDrivenRage','junkie.AmphetamineReflexes',
          'junkie.PervertedMetabolism','junkie.ToxicBloodDrain','com.ShuffleFeet','com.Grab','com.Steal']}
    ];
    const twice=bindings=>[].concat(...bindings.map(b=>[b,b]));
    function deck(cfg) { return {deckId:cfg.id,character:character(cfg.character),basicActionCard:card(cfg.basic),
      characterBoundCards:cfg.bound.map(card),lastResortCard:card('com.last.Struggle'),regularCards:twice(cfg.regular).map(card)}; }
    const foreign=Object.assign({},deck(configs[0]),{deckId:'i16-only-other'});
    await other.command({command:'save',deck:foreign});
    for (const id of ['i16-missing',foreign.deckId]) {
      const mark=c.events.length;
      await c.command({command:'join',mode:'open/1vCom',deckId:id});
      const error=await c.wait('/user/queue/game/open/1vCom/error',mark);
      assert.strictEqual(error.data,'Deck unavailable. Choose a saved deck from your account and retry.');
      await c.command({command:'profile'}); // same connection remains usable, no private ready
      assert(!c.events.slice(mark).some(e=>e.destination==='/user/queue/game/open/1vCom/ready'));
    }
    {
      // R02 1.12 (D20): a deck saved under 1.11 (stored by OpenCompleteCliTest, one regular card) stays listed but is refused.
      assert((await c.command({command:'profile'})).data.decks.some(d=>d.deckId==='i16-old-rules'));
      const mark=c.events.length;
      await c.command({command:'join',mode:'open/1vCom',deckId:'i16-old-rules'});
      const error=await c.wait('/user/queue/game/open/1vCom/error',mark);
      assert.strictEqual(error.data,'Invalid deck: Exactly 20 regular cards required, found 1. Edit or delete it in your collection.');
      await c.command({command:'profile'});
      assert(!c.events.slice(mark).some(e=>e.destination==='/user/queue/game/open/1vCom/ready'));
    }
    for (const cfg of configs) {
      const selected=deck(cfg);
      assert.deepStrictEqual((await c.command({command:'save',deck:selected})).data.decks.find(d=>d.deckId===cfg.id),selected);
      let mark=c.events.length;
      await c.command({command:'join',mode:'open/1vCom',deckId:cfg.id});
      const id=(await c.wait('/user/queue/game/open/1vCom/ready',mark)).data;
      await c.command({command:'watch',gameId:id});
      let view=(await c.command({command:'view',gameId:id})).data;
      const bot=Object.keys(view.players).find(p=>p!==user);
      assert.strictEqual(view.players[user].character.bindingName,cfg.character);
      assert.strictEqual(view.players[user].deck,Math.max(0,n-(5-cfg.bound.length)));
      assert.strictEqual(view.players[user].cardsInHand.filter(c=>c.characterBound).length,cfg.bound.length);
      // Replace the character, basic, bound and regular configuration, then delete the live record.
      const replacement=deck(configs.find(x=>x!==cfg)); replacement.deckId=cfg.id;
      const saved=(await c.command({command:'save',deck:replacement})).data.decks.find(d=>d.deckId===cfg.id);
      assert.deepStrictEqual(saved,replacement);
      assert.deepStrictEqual((await c.command({command:'view',gameId:id})).data,view);
      await c.command({command:'delete',deck:replacement});
      assert.deepStrictEqual((await c.command({command:'view',gameId:id})).data,view);
      let turns=0,lastMove;
      while(!view.over) {
        assert(turns<40,'Runner stall bound; no game timeout');
        const hand=view.players[user].cardsInHand;
        const discard=hand.find(c=>!c.basicAction&&!c.characterBound&&!c.lastResort);
        if (discard) {
          const quiet=hand.find(c=>c.bindingName===cfg.quiet); assert(quiet);
          lastMove={gameId:id,playerId:user,playedCardName:quiet.name,targetId:cfg.quietSelf?'SELF':bot,choices:{DISCARD_ONE:discard.name}};
        } else {
          const struggle=hand.find(c=>c.lastResort); assert(struggle);
          lastMove={gameId:id,playerId:user,playedCardName:struggle.name,targetId:bot,choices:null};
        }
        mark=c.events.length;
        await c.command({command:'move',move:lastMove});
        await c.wait('/topic/game/'+id+'/update',mark);
        view=(await c.command({command:'view',gameId:id})).data;
        turns++;
        const damage=Math.max(0,turns-n);
        assert.strictEqual(view.players[user].character.resources.HEALTH,100-5*damage);
        assert.strictEqual(view.players[bot].character.resources.HEALTH,100-10*damage);
        assert.strictEqual(view.players[user].deck,Math.max(0,n-(5-cfg.bound.length)-turns));
      }
      assert.strictEqual(turns,n+10);
      const exported=(await c.command({command:'export',gameId:id})).data;
      assert.deepStrictEqual(exported.unpersistedEvents,[]);
      assert.strictEqual(exported.recording.complete,true); assert.strictEqual(exported.recording.status,'OK');
      let previous='';
      const events=exported.events.map((entry,i)=>{
        assert.strictEqual(entry.sequence,i); assert.strictEqual(entry.previousHash,previous);
        assert.strictEqual(entry.hash,crypto.createHash('sha256').update(id+'\n'+i+'\n'+previous+'\n'+entry.json).digest('hex'));
        previous=entry.hash; return JSON.parse(entry.json);
      });
      assert.strictEqual(exported.integrity.headHash,previous);
      const kinds=['INITIAL'];
      for(let i=0;i<turns;i++) kinds.push('MOVE_ACCEPTED','ROUND_READY','ENGINE_REPORT','ROUND_COMMITTED','COMMAND_COMMITTED');
      kinds.push('OUTCOME'); assert.deepStrictEqual(events.map(e=>e.kind),kinds);
      const initial=events[0].data;
      assert.strictEqual(initial.versions.rulesVersion,process.env.BM_RULES_VERSION);
      // Regulation 1.13 (SB-2): the set documents loaded by the server, with version and hash.
      assert.deepStrictEqual(initial.versions.sets,JSON.parse(process.env.BM_SETS));
      assert.strictEqual(initial.versions.sets.base.version,'0.1');
      assert.strictEqual(initial.configuration.botPolicy,'random');
      const human=initial.state.players.find(p=>p.playerId===user);
      assert.strictEqual(initial.state.mode,'open1vCom');
      assert.strictEqual(human.character,cfg.character);
      assert.deepStrictEqual(human.specialCards,[cfg.basic,...cfg.bound]);
      assert.deepStrictEqual(human.initialDeckDrawOrder.slice().sort(),twice(cfg.regular).sort());
      assert.strictEqual(human.lastResort,'com.last.Struggle');
      events.filter(e=>e.kind==='ROUND_READY').forEach(e=>assert.strictEqual(e.data.pendingMoves.find(m=>m.playerId===bot).void,true));
      const final=events[events.length-1].data;
      assert.strictEqual(final.outcome.result,'win'); assert.strictEqual(final.outcome.winner,user);
      assert.strictEqual(final.turn,turns);
      mark=c.events.length; await c.command({command:'move',move:lastMove});
      assert(String((await c.wait('/user/queue/illegalMove',mark)).data).includes('Game is over'));
      assert.deepStrictEqual((await c.command({command:'export',gameId:id})).data,exported);
      await c.command({command:'leave',gameId:id});
      assert.deepStrictEqual((await c.command({command:'export',gameId:id})).data,exported);
      exports.push(exported);
    }
    assert.notStrictEqual(exports[0].gameId,exports[1].gameId);
    console.log(JSON.stringify({ok:true,exports}));
  } finally { await c.close(); await other.close(); }
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});

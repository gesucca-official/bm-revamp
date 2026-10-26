'use strict';
const assert=require('assert'), fs=require('fs'), crypto=require('crypto');
const {Client}=require('./bm-cli.cjs');
const clients=[], fixtures=process.env.BM_I24_FIXTURES;
async function connect(user) {const c=new Client(process.env.BM_URL,user,'synthetic',6000);clients.push(c);await c.connect();return c;}
async function join(c,mode,deckId) {const mark=c.events.length;await c.command({command:'join',mode,deckId});
  await c.command({command:'profile'});return (await c.wait('/user/queue/game/'+mode+'/ready',mark)).data;}
async function view(c,id) {await c.command({command:'watch',gameId:id});return (await c.command({command:'view',gameId:id})).data;}
function inspect(id,x) {
  assert.strictEqual(x.recording.complete,true);assert.strictEqual(x.recording.status,'OK');assert.deepStrictEqual(x.unpersistedEvents,[]);
  let previous='';const events=x.events.map((e,i)=>{assert.strictEqual(e.sequence,i);assert.strictEqual(e.previousHash,previous);
    assert.strictEqual(e.hash,crypto.createHash('sha256').update(id+'\n'+i+'\n'+previous+'\n'+e.json).digest('hex'));previous=e.hash;return JSON.parse(e.json);});
  assert.strictEqual(events.filter(e=>e.kind==='OUTCOME').length,1);return events;
}
(async()=>{
  if(process.env.BM_I24_ACTION==='prepare') {
    const result={active:[],done:null};
    const q=await connect('restartQuick'), o=await connect('restartOpen');
    const profile=(await o.command({command:'profile'})).data;
    const card=b=>profile.collection.cards.find(c=>c.bindingName===b);
    await o.command({command:'save',deck:{deckId:'restart-deck',
      character:profile.collection.characters.find(c=>c.bindingName==='bruiser.character.BigBadBruiser'),
      basicActionCard:card('com.basic.BruiserGrab'),characterBoundCards:[],lastResortCard:card('com.last.Struggle'),regularCards:[card('com.ShuffleFeet')]}});
    result.active.push({id:await join(q,'quick/1vCom'),users:[q.user],mode:'quick1vCom'});
    result.active.push({id:await join(o,'open/1vCom','restart-deck'),users:[o.user],mode:'open1vCom'});
    const a=await connect('restartDuelA'), b=await connect('restartDuelB');
    const mark=a.events.length;await a.command({command:'join',mode:'quick/1v1'});await a.command({command:'profile'});
    const duel=await join(b,'quick/1v1');assert.strictEqual((await a.wait('/user/queue/game/quick/1v1/ready',mark)).data,duel);
    result.active.push({id:duel,users:[a.user,b.user],mode:'quick1v1'});
    const current=await view(a,duel), hand=current.players[a.user].cardsInHand;
    // Bound attack from either real starter is free and takes a regular discard.
    const chosen=hand.find(c=>c.characterBound && c.canTarget.includes('OPPONENT'));assert(chosen);
    {
      const discard=hand.find(c=>!c.basicAction&&!c.characterBound&&!c.lastResort);
      assert(discard);const choices={DISCARD_ONE:discard.name};
      const n=a.events.length;await a.command({command:'move',move:{gameId:duel,playerId:a.user,playedCardName:chosen.name,targetId:b.user,choices}});
      await a.wait('/topic/game/'+duel+'/move',n);assert((await view(a,duel)).pendingMove);
    }
    const f=await connect('restartFfaA'),g=await connect('restartFfaB');
    const mf=f.events.length;for(const c of [f,g]){await c.command({command:'join',mode:'quick/ffa'});await c.command({command:'profile'});}
    await f.command({command:'add-bot'});await f.command({command:'profile'});await f.command({command:'start'});
    const ffa=(await f.wait('/user/queue/game/quick/ffa/ready',mf)).data;
    result.active.push({id:ffa,users:[f.user,g.user],mode:'quickFFA'});
    const d=await connect('restartDone'), done=await join(d,'quick/1vCom');await view(d,done);
    await d.command({command:'leave',gameId:done});await d.command({command:'profile'});
    result.done={id:done,user:d.user,exported:(await d.command({command:'export',gameId:done})).data};inspect(done,result.done.exported);
    for(const match of result.active) {const client=clients.find(c=>c.user===match.users[0]);assert.strictEqual((await view(client,match.id)).over,false);}
    fs.writeFileSync(fixtures+'.tmp',JSON.stringify(result));fs.renameSync(fixtures+'.tmp',fixtures);
    console.log(JSON.stringify({ok:true,prepared:result.active.map(m=>m.mode)}));
    // Keep the real transports alive until the server is stopped by the Java orchestrator.
    await new Promise(resolve=>{process.stdin.resume();process.stdin.once('data',()=>{process.stdin.pause();resolve();});});
  } else {
    const fixture=JSON.parse(fs.readFileSync(fixtures,'utf8')), exports={};
    for(const match of fixture.active) {
      let first;
      for(const user of match.users) {
        const c=await connect(user), receipt=(await c.command({command:'resume'})).data;
        assert.deepStrictEqual(receipt,{status:'finished',gameId:match.id,archived:true,
          outcome:{over:true,result:'draw',winner:null,reason:'riavvio server'}});
        assert.deepStrictEqual((await c.command({command:'resume'})).data,receipt);
        const x=(await c.command({command:'export',gameId:match.id})).data, events=inspect(match.id,x);
        assert.strictEqual(events[events.length-1].data.outcomeReason,'riavvio server');
        assert.deepStrictEqual(events[events.length-1].data.outcome,{over:true,result:'draw',winner:null});
        if(first)assert.deepStrictEqual(x,first);first=x;
      }
      exports[match.id]=first;
      // The authenticated former participant cannot resubscribe to a playable runtime.
      const c=await connectAfterClose(match.users[0]);let denied=false;
      try{await c.command({command:'view',gameId:match.id});}catch(_){denied=true;}assert(denied,'old runtime accepted view');
      const mover=await connectAfterClose(match.users[0]);denied=false;
      try {
        await mover.command({command:'move',move:{gameId:match.id,playerId:mover.user,playedCardName:'old card',targetId:'SELF',choices:null}});
        await mover.command({command:'profile'});
      } catch(_){denied=true;}
      assert(denied,'old runtime accepted move destination');
    }
    const d=await connect('restartDone');assert.strictEqual((await d.command({command:'resume'})).data.status,'none');
    assert.deepStrictEqual((await d.command({command:'export',gameId:fixture.done.id})).data,fixture.done.exported);
    const outsider=await connect('restartOutsider');assert.strictEqual((await outsider.command({command:'resume'})).data.status,'none');
    let denied=false;try{await outsider.command({command:'export',gameId:fixture.active[0].id});}catch(_){denied=true;}assert(denied);
    console.log(JSON.stringify({ok:true,exports}));
  }
})().catch(e=>{console.error(e.stack);process.exitCode=1;}).finally(async()=>{
  for(const c of clients)await c.close();
  // These scenarios deliberately kill the server; bound any residual SockJS timers in this test runner.
  process.exit(process.exitCode||0);
});
async function connectAfterClose(user) {
  for(const c of clients.filter(c=>c.user===user && !c.closed))await c.close();
  // stompjs disconnect calls back before the server handles transport teardown.
  // Retry only this deliberate reconnect, within the existing scenario deadline.
  const until=Date.now()+6000;
  while(true) {
    try { return await connect(user); }
    catch(error) {
      if(error.message!=='Login rejected' || Date.now()>=until) throw error;
      await new Promise(resolve=>setTimeout(resolve,25));
    }
  }
}

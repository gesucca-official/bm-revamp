'use strict';
const assert=require('assert'), fs=require('fs'), path=require('path'), crypto=require('crypto');
const {Client}=require('./bm-cli.cjs');
const accounts=JSON.parse(process.env.BM_ACCOUNTS), scenario=process.env.BM_SCENARIO;
const clients=[], savedExports=[], checks=[];
const READY='/user/queue/game/quick/1v1/ready';
let sequence=0;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function advance(delta) {
  const n=sequence++, file=path.join(process.env.BM_CONTROLS,n+'.request');
  fs.writeFileSync(file+'.tmp',String(delta)); fs.renameSync(file+'.tmp',file);
  const response=path.join(process.env.BM_CONTROLS,n+'.response'), until=Date.now()+5000;
  while(!fs.existsSync(response)) {assert(Date.now()<until,'clock coordination stalled');await sleep(10);}
}
async function connect(user) {
  const c=new Client(process.env.BM_URL,user,'synthetic',2500); clients.push(c); await c.connect(); return c;
}
async function view(c,id) {return (await c.command({command:'view',gameId:id})).data;}
async function barrier(c) {await c.command({command:'profile'});}
function privateView(c,v) {
  assert(Array.isArray(v.players[c.user].cardsInHand));
  Object.keys(v.players).filter(p=>p!==c.user).forEach(p=>assert.strictEqual(typeof v.players[p].cardsInHand,'number'));
  Object.values(v.players).forEach(p=>assert.strictEqual(typeof p.deck,'number'));
  assert(!Object.prototype.hasOwnProperty.call(v,'pendingMoves'));
  if(v.pendingMove) assert.strictEqual(v.pendingMove.playerId,c.user);
}
async function commandMove(c,id,target,binding) {
  const v=await view(c,id); privateView(c,v);
  const card=v.players[c.user].cardsInHand.find(x=>x.bindingName===binding);
  assert(card,'fixture card '+binding);
  return {gameId:id,playerId:c.user,playedCardName:card.name,targetId:target,choices:null};
}
async function accepted(c,m) {
  const mark=c.events.length; await c.command({command:'move',move:m});
  await c.wait('/topic/game/'+m.gameId+'/move',mark);
}
async function watch(c,id) {await c.command({command:'watch',gameId:id}); await view(c,id);}
async function pair(a,b) {
  const mark=a.events.length, other=b.events.length;
  await Promise.all([a.command({command:'join',mode:'quick/1v1'}),b.command({command:'join',mode:'quick/1v1'})]);
  const x=await a.wait(READY,mark), y=await b.wait(READY,other);assert.strictEqual(x.data,y.data);
  await Promise.all([watch(a,x.data),watch(b,x.data)]);return x.data;
}
async function denied(user,operation,id) {
  const c=await connect(user), mark=c.events.length;
  // A round trip detects the STOMP rejection without mistaking an event timeout for authorization.
  await assert.rejects(async()=>{await operation(c);await barrier(c);});
  assert(c.failure,'authorization must reject the transport');
  assert(!c.events.slice(mark).some(e=>e.destination.includes(id)));await c.close();
}
function inspectExport(x,expected) {
  assert.strictEqual(x.recording.complete,true);assert.strictEqual(x.recording.status,'OK');
  assert.deepStrictEqual(x.unpersistedEvents,[]);
  let previous='';
  const events=x.events.map((entry,i)=>{
    assert.strictEqual(entry.sequence,i);assert.strictEqual(entry.previousHash,previous);
    assert.strictEqual(entry.hash,crypto.createHash('sha256').update(x.gameId+'\n'+i+'\n'+previous+'\n'+entry.json).digest('hex'));
    previous=entry.hash;return JSON.parse(entry.json);
  });
  assert.strictEqual(x.integrity.headHash,previous);
  const initial=events[0].data.state;
  assert.strictEqual(initial.mode,'quick1v1');assert.strictEqual(initial.players.length,2);
  const members=initial.players.map(p=>p.playerId).sort();assert.deepStrictEqual(members,expected.slice().sort());
  initial.players.forEach(p=>assert.strictEqual(p.controller,'human'));
  events.forEach(e=>{
    const state=e.kind==='INITIAL'?e.data.state:e.data;
    if(state.players && Array.isArray(state.players)) assert.deepStrictEqual(state.players.map(p=>p.playerId).sort(),members);
    if(e.kind==='MOVE_ACCEPTED') {assert(members.includes(e.data.playerId));assert.strictEqual(e.data.gameId,x.gameId);}
  });
  assert.strictEqual(events.filter(e=>e.kind==='OUTCOME').length,1);
  assert.strictEqual(events[events.length-1].kind,'OUTCOME');
  return events;
}
async function finish(a,b,id) {
  const x=(await a.command({command:'export',gameId:id})).data;
  assert.deepStrictEqual((await b.command({command:'export',gameId:id})).data,x);
  inspectExport(x,[a.user,b.user]);
  await Promise.all([a.command({command:'leave',gameId:id}),b.command({command:'leave',gameId:id})]);
  assert.deepStrictEqual((await a.command({command:'export',gameId:id})).data,x);
  savedExports.push(x);return x;
}
(async()=>{
  const [a,b,c,d,e]=await Promise.all(accounts.map(connect));
  for(const client of [a,b,c,d,e]) {client.subscribe(READY);await barrier(client);}
  await assert.rejects(connect(a.user));checks.push('one active session/account');
  if(scenario==='concurrent-join') {
    await Promise.all([a,b,c,d].map(x=>x.command({command:'join',mode:'quick/1v1'})));
    const ids=await Promise.all([a,b,c,d].map(async x=>(await x.wait(READY,0)).data));
    const groups=new Map();[a,b,c,d].forEach((x,i)=>{if(!groups.has(ids[i]))groups.set(ids[i],[]);groups.get(ids[i]).push(x);});
    assert.strictEqual(groups.size,2);assert(!e.events.some(x=>x.destination===READY),'outsider received ready');
    for(const [id,members] of groups) {
      assert.strictEqual(members.length,2);await Promise.all(members.map(x=>watch(x,id)));
      members.forEach(x=>assert.strictEqual(x.events.filter(e=>e.destination===READY).length,1));
    }
    for(let turn=0;turn<7;turn++) {
      await Promise.all(Array.from(groups).map(async ([id,[x,y]])=>{
        const marks=[x.events.length,y.events.length];
        const moves=await Promise.all([commandMove(x,id,y.user,'com.last.Struggle'),commandMove(y,id,x.user,'com.last.Struggle')]);
        await Promise.all([x.command({command:'move',move:moves[0]}),y.command({command:'move',move:moves[1]})]);
        await Promise.all([x.wait('/topic/game/'+id+'/update',marks[0]),y.wait('/topic/game/'+id+'/update',marks[1])]);
        for(const client of [x,y]) {const v=await view(client,id);privateView(client,v);assert.strictEqual(v.turn,turn+1);}
      }));
    }
    for(const [id,[x,y]] of groups) {const v=await view(x,id);assert(v.over);assert.strictEqual(v.winner,'NONE');await finish(x,y,id);}
    checks.push('four concurrent joins, exactly two disjoint matches; concurrent moves and complete draws');
  } else {
    // Repeated join must leave one slot while a second distinct human is still absent.
    await a.command({command:'join',mode:'quick/1v1'});await barrier(a);
    await Promise.all(Array.from({length:8},()=>a.command({command:'join',mode:'quick/1v1'})));await barrier(a);
    assert(!a.events.some(x=>x.destination===READY),'duplicate join started a match');
    const id=await pair(a,b);const initial=await view(a,id);privateView(a,initial);
    assert.deepStrictEqual(Object.keys(initial.players).sort(),[a.user,b.user].sort());
    await Promise.all([barrier(c),barrier(d),barrier(e)]);
    assert(![c,d,e].some(x=>x.events.some(e=>e.destination===READY)),'ready contaminated an unrelated session');
    checks.push('duplicate join keeps one slot; private ready only to two participants');
    if(scenario==='complete') {
      const other=await pair(c,d);assert.notStrictEqual(id,other);
      await barrier(a);await barrier(b);
      assert.strictEqual(a.events.filter(x=>x.destination===READY).length,1);
      const untouched=await view(c,other), mark=c.events.length;
      // Denials use disposable outsider connections, never a shared identity/session.
      await e.close();
      for(const destination of ['/user/queue/game/'+id+'/view','/topic/game/'+id+'/update','/topic/game/'+id+'/move']) {
        await denied(e.user,x=>x.command({command:'subscribe',destination}),id);
      }
      await denied(e.user,x=>x.command({command:'send',destination:'/app/game/'+id+'/'+e.user+'/view'}),id);
      await denied(e.user,x=>x.command({command:'send',destination:'/app/game/'+id+'/move',data:{gameId:id,playerId:e.user}}),id);
      await denied(e.user,x=>x.command({command:'send',destination:'/app/game/'+id+'/'+a.user+'/leave'}),id);
      await denied(e.user,x=>x.command({command:'send',destination:'/app/archive/'+id+'/export'}),id);
      const impersonated=await commandMove(a,id,b.user,'bruiser.MadeOfStone');
      await denied(e.user,x=>x.command({command:'send',destination:'/app/game/'+id+'/move',data:impersonated}),id);
      // A member of the other running duel cannot cross the game boundary either.
      await denied(e.user,x=>x.command({command:'subscribe',destination:'/user/'+a.user+'/queue/game/'+id+'/view'}),id);
      const first=await commandMove(a,id,a.user,'bruiser.MadeOfStone');
      const acceptedMark=a.events.length;await Promise.all([a.command({command:'move',move:first}),a.command({command:'move',move:first})]);
      await a.wait('/topic/game/'+id+'/move',acceptedMark);await a.wait('/user/queue/illegalMove',acceptedMark);
      assert((await view(a,id)).pendingMove);assert.strictEqual((await view(b,id)).pendingMove,null);
      assert.deepStrictEqual(await view(c,other),untouched);
      const roundMark=b.events.length;await accepted(b,await commandMove(b,id,a.user,'com.ShuffleFeet'));
      await b.wait('/topic/game/'+id+'/update',roundMark);
      const after=await view(a,id);assert.strictEqual(after.turn,1);assert(after.players[a.user].character.statuses.length>0);
      assert.deepStrictEqual(await view(c,other),untouched);
      assert(!c.events.slice(mark).some(x=>x.destination.includes(id)));
      for(let turn=1;turn<=10;turn++) {
        const m=b.events.length;
        const moves=await Promise.all([commandMove(a,id,b.user,'com.last.Struggle'),commandMove(b,id,a.user,'com.ShuffleFeet')]);
        await Promise.all([a.command({command:'move',move:moves[0]}),b.command({command:'move',move:moves[1]})]);
        await b.wait('/topic/game/'+id+'/update',m);
        const v=await view(a,id);assert.strictEqual(v.turn,turn+1);
        assert.strictEqual(v.players[a.user].character.resources.HEALTH,100-5*turn);
        assert.strictEqual(v.players[b.user].character.resources.HEALTH,100-10*turn);
        assert.deepStrictEqual(await view(c,other),untouched);
      }
      const final=await view(a,id);assert(final.over);assert.strictEqual(final.winner,a.user);
      const beforeExport=(await a.command({command:'export',gameId:id})).data;
      const rejected=a.events.length;await a.command({command:'move',move:first});await a.wait('/user/queue/illegalMove',rejected);
      assert.deepStrictEqual((await a.command({command:'export',gameId:id})).data,beforeExport);
      const x=await finish(a,b,id);const events=inspectExport(x,[a.user,b.user]);
      assert.strictEqual(events.filter(x=>x.kind==='MOVE_ACCEPTED').length,22);
      assert.strictEqual(events.filter(x=>x.kind==='ROUND_COMMITTED').length,11);
      await denied(e.user,x=>x.command({command:'export',gameId:id}),id);
      for(let turn=0;turn<7;turn++) {
        const m=c.events.length;
        await Promise.all([accepted(c,await commandMove(c,other,d.user,'com.last.Struggle')),accepted(d,await commandMove(d,other,c.user,'com.last.Struggle'))]);
        await c.wait('/topic/game/'+other+'/update',m);
        const v=await view(c,other);assert.strictEqual(v.turn,turn+1);
        assert.strictEqual(v.players[c.user].character.resources.HEALTH,100-15*(turn+1));
        assert.strictEqual(v.players[d.user].character.resources.HEALTH,100-15*(turn+1));
        assert.deepStrictEqual((await a.command({command:'export',gameId:id})).data,x);
      }
      assert.strictEqual((await view(c,other)).winner,'NONE');await finish(c,d,other);
      checks.push('foreign SEND/SUBSCRIBE/identity/export denied; duplicate move atomic; private pending; independent states, clocks, events and journals; full-health win and draw');
      // A second match in the same sessions must not inherit outcome/pending/state.
      const again=await pair(a,b);assert.notStrictEqual(again,id);assert.strictEqual((await view(a,again)).turn,0);
      await a.command({command:'leave',gameId:again});await finish(a,b,again);
      checks.push('second match on same connections; leave outcome preserved');
    } else {
      const other=await pair(c,d);const isolated=await view(c,other);
      // Stop only c's move clock; d's deadline must stay independent of the tested match.
      await accepted(c,await commandMove(c,other,d.user,'com.last.Struggle'));
      // The other match must follow its own deadline and preserve unspent health/resources.
      if(scenario.startsWith('move')) {
        if(scenario==='move-before') {
          await advance(29999);await accepted(a,await commandMove(a,id,b.user,'com.last.Struggle'));
          assert.strictEqual((await view(a,id)).over,false);await advance(1);
          const v=await view(a,id);assert.strictEqual(v.winner,a.user);assert.strictEqual(v.forfeits[b.user],'move timeout');
        } else {
          const move=await commandMove(a,id,b.user,'com.last.Struggle');await advance(scenario==='move-exact'?30000:30001);
          const m=a.events.length;await a.command({command:'move',move});await a.wait('/user/queue/illegalMove',m);
          const v=await view(a,id);assert(v.over);assert.strictEqual(v.winner,'NONE');assert.strictEqual(Object.keys(v.forfeits).length,2);
        }
      } else if(scenario.endsWith('resume')) {
        const pending=scenario==='pending-resume';
        const move=await commandMove(a,id,b.user,'com.last.Struggle');
        if(pending) await accepted(a,move);
        await advance(1000);const mark=b.events.length;a.drop();await b.wait('/topic/game/'+id+'/update',mark);
        await advance(28999);const returned=await connect(a.user), state=(await returned.command({command:'resume'})).data;
        assert.strictEqual(state.status,'resumed');assert.strictEqual(state.gameId,id);assert.strictEqual(state.view.turn,0);
        privateView(returned,state.view);assert.strictEqual(Boolean(state.view.pendingMove),pending);
        assert.strictEqual(state.view.moveDeadlines[b.user],2030000);
        await watch(returned,id);
        if(pending) {
          const rejected=returned.events.length;await returned.command({command:'move',move});
          await returned.wait('/user/queue/illegalMove',rejected);
        } else await accepted(returned,move);
        assert.throws(()=>a.send('/app/game/'+id+'/move',move));
        await advance(1);assert.strictEqual((await view(returned,id)).winner,a.user);
        const x=await finish(returned,b,id);
        assert.strictEqual(inspectExport(x,[a.user,b.user]).filter(e=>e.kind==='MOVE_ACCEPTED').length,1);
      } else {
        // Accepted move survives drop; only the other player's move deadline remains.
        await accepted(a,await commandMove(a,id,b.user,'com.last.Struggle'));
        await advance(1000);const m=b.events.length;a.drop();await b.wait('/topic/game/'+id+'/update',m);
        const dropped=await view(b,id);assert.strictEqual(dropped.reconnectDeadlines[a.user],2031000);
        assert.strictEqual(dropped.moveDeadlines[b.user],2030000);
        // Submit b just before its deadline, resolving one round while a remains disconnected.
        await advance(28999);const before=b.events.length;await accepted(b,await commandMove(b,id,a.user,'com.last.Struggle'));
        await b.wait('/topic/game/'+id+'/update',before);
        const delta=scenario==='reconnect-before'?1000:scenario==='reconnect-exact'?1001:1002;
        await advance(delta);const returned=await connect(a.user), state=(await returned.command({command:'resume'})).data;
        assert.strictEqual(state.gameId,id);privateView(returned,state.view);
        if(scenario==='reconnect-before') {
          assert.strictEqual(state.status,'resumed');assert.strictEqual(state.view.turn,1);assert.strictEqual(state.view.pendingMove,null);
          assert.strictEqual(state.view.players[a.user].character.resources.HEALTH,85);
          await watch(returned,id);await returned.command({command:'leave',gameId:id});
        } else {assert.strictEqual(state.status,'finished');assert.strictEqual(state.view.forfeits[a.user],'reconnect timeout');}
        await finish(returned,b,id);
      }
      if(scenario.startsWith('move')) await finish(a,b,id);
      const untouched=await view(c,other);
      assert.strictEqual(untouched.turn,isolated.turn);assert.strictEqual(untouched.winner,c.user);
      assert.strictEqual(untouched.players[c.user].character.resources.HEALTH,100);
      assert.deepStrictEqual(untouched.players[c.user].character.statuses,isolated.players[c.user].character.statuses);
      assert.strictEqual(untouched.forfeits[d.user],'move timeout');
      await finish(c,d,other);
      checks.push('controlled '+scenario+'; other match follows only its own clock with no combat contamination');
    }
  }
  const transcript=clients.map(c=>({user:c.user,rejected:Boolean(c.failure),events:c.events.filter(e=>e.destination!=='/user/queue/account/data')}));
  console.log(JSON.stringify({ok:true,scenario,checks,exports:savedExports,transcript}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;})
  .finally(async()=>{for(const client of clients) await client.close();});

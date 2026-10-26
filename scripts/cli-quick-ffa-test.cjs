'use strict';
const assert=require('assert'), fs=require('fs'), path=require('path'), crypto=require('crypto');
const {Client}=require('./bm-cli.cjs');
const accounts=JSON.parse(process.env.BM_ACCOUNTS), scenario=process.env.BM_SCENARIO;
const clients=[], savedExports=[], checks=[];
const READY='/user/queue/game/quick/ffa/ready';
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
  let cursor=mark;
  while (true) {
    const event=await c.wait('/topic/game/'+m.gameId+'/move',cursor);
    if(event.data===c.user+' submitted a Move') break;
    cursor=c.events.indexOf(event)+1;
  }
}
async function watch(c,id) {await c.command({command:'watch',gameId:id}); await view(c,id);}
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
  assert.strictEqual(initial.mode,'quickFFA');assert(initial.players.length>=2 && initial.players.length<=5);
  const members=initial.players.map(p=>p.playerId).sort();assert.deepStrictEqual(members,expected.slice().sort());

  events.forEach(e=>{
    const state=e.kind==='INITIAL'?e.data.state:e.data;
    if(state.players && Array.isArray(state.players)) assert.deepStrictEqual(state.players.map(p=>p.playerId).sort(),members);
    if(e.kind==='MOVE_ACCEPTED') {assert(members.includes(e.data.playerId));assert.strictEqual(e.data.gameId,x.gameId);}
  });
  assert.strictEqual(events.filter(e=>e.kind==='OUTCOME').length,1);
  assert.strictEqual(events[events.length-1].kind,'OUTCOME');
  return events;
}

async function join(c) {await c.command({command:'join',mode:'quick/ffa'});await barrier(c);}
async function start(members,auto=false) {
  const marks=members.map(c=>c.events.length);
  for(const c of members) await join(c);
  if(!auto) {await members[members.length-1].command({command:'start'});}
  const ids=await Promise.all(members.map((c,i)=>c.wait(READY,marks[i]).then(e=>e.data)));
  assert(ids.every(id=>id===ids[0]));
  await Promise.all(members.map(c=>watch(c,ids[0])));
  for(const c of members) privateView(c,await view(c,ids[0]));
  return ids[0];
}
async function finish(members,id) {
  const x=(await members[0].command({command:'export',gameId:id})).data;
  const expected=JSON.parse(x.events[0].json).data.state.players.map(p=>p.playerId);
  inspectExport(x,expected);
  for(const c of members) {
    assert.deepStrictEqual((await c.command({command:'export',gameId:id})).data,x);
    await c.command({command:'leave',gameId:id});
  }
  assert.deepStrictEqual((await members[0].command({command:'export',gameId:id})).data,x);
  savedExports.push(x);return x.events.map(e=>JSON.parse(e.json));
}
async function round(members,id,targets) {
  const turn=(await view(members[0],id)).turn;
  await Promise.all(members.map(async (c,i)=>accepted(c,await commandMove(c,id,targets[i],'com.last.Struggle'))));
  const v=await view(members[0],id);assert.strictEqual(v.turn,turn+1);return v;
}
(async()=>{
  let [a,b,c,d,e,f]=await Promise.all(accounts.map(connect));
  const all=[a,b,c,d,e,f];
  for(const x of all) {x.subscribe(READY);await barrier(x);}
  if(scenario==='early' || scenario==='full') {
    const members=scenario==='early'?[a,b]:[a,b,c,d,e];
    const id=await start(members,scenario==='full');
    await barrier(f);assert(!f.events.some(e=>e.destination===READY),'FFA ready contaminated an unrelated session');
    const initial=await view(a,id);assert.strictEqual(Object.keys(initial.players).length,members.length);
    await accepted(a,await commandMove(a,id,b.user,'com.last.Struggle'));
    assert((await view(a,id)).pendingMove);assert.strictEqual((await view(b,id)).pendingMove,null);
    const duplicate=a.events.length;await a.command({command:'move',move:await commandMove(a,id,b.user,'com.last.Struggle')});
    await a.wait('/user/queue/illegalMove',duplicate);assert.strictEqual((await view(a,id)).turn,0);
    const pendingBefore=await view(a,id), dropped=a, dropMark=b.events.length;
    a.drop();await b.wait('/topic/game/'+id+'/update',dropMark);await advance(1000);
    a=await connect(a.user);members[0]=a;
    const restored=(await a.command({command:'resume'})).data;
    assert.strictEqual(restored.status,'resumed');assert.strictEqual(restored.gameId,id);
    assert.strictEqual(restored.view.turn,0);privateView(a,restored.view);
    assert.deepStrictEqual(restored.view.pendingMove,pendingBefore.pendingMove);
    assert.deepStrictEqual(restored.view.players[a.user],pendingBefore.players[a.user]);
    assert.deepStrictEqual(restored.view.moveDeadlines,pendingBefore.moveDeadlines);
    assert.throws(()=>dropped.send('/app/game/'+id+'/move',pendingBefore.pendingMove));
    await watch(a,id);const replay=a.events.length;
    await a.command({command:'move',move:await commandMove(a,id,b.user,'com.last.Struggle')});
    await a.wait('/user/queue/illegalMove',replay);
    checks.push('pending restored in same FFA turn; original deadlines; replay rejected; old transport closed');
    await Promise.all(members.slice(1).map(async (x,i)=>accepted(x,await commandMove(x,id,members[(i+2)%members.length].user,'com.last.Struggle'))));
    for(let turn=1;turn<7;turn++) {
      const v=await round(members,id,members.map((x,i)=>members[(i+1)%members.length].user));
      members.forEach(x=>assert.strictEqual(v.players[x.user].character.resources.HEALTH,100-15*(turn+1)));
    }
    const final=await view(a,id);assert(final.over);assert.strictEqual(final.winner,'NONE');
    await f.close();
    await denied(f.user,x=>x.command({command:'subscribe',destination:'/user/queue/game/'+id+'/view'}),id);
    await denied(f.user,x=>x.command({command:'send',destination:'/app/game/'+id+'/move',data:{gameId:id,playerId:a.user}}),id);
    const events=await finish(members,id);
    assert.strictEqual(events.filter(e=>e.kind==='ROUND_COMMITTED').length,7);
    assert.strictEqual(events.filter(e=>e.kind==='MOVE_ACCEPTED').length,7*members.length);
    checks.push('complete ring from HEALTH 100; seven rounds; private hands, pending, ready; concurrent moves; outsider denied');
  } else if(scenario==='concurrent') {
    await join(a);await join(b);
    await Promise.all([c,d,e].map(x=>x.command({command:'join',mode:'quick/ffa'})).concat([a.command({command:'start'}),b.command({command:'start'})]));
    await Promise.all(all.map(barrier));
    const groups=new Map();
    for(const x of [a,b,c,d,e]) {
      const ready=x.events.filter(e=>e.destination===READY);assert(ready.length<=1,'duplicate ready');
      if(ready.length) {const id=ready[0].data;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(x);}
    }
    assert(groups.size>=1);assert(!f.events.some(e=>e.destination===READY));
    for(const [id,members] of groups) {
      const v=await view(members[0],id);assert.deepStrictEqual(Object.keys(v.players).sort(),members.map(c=>c.user).sort());
      assert(members.length>=2 && members.length<=5);
      for(const x of members.slice(0,-1)) await x.command({command:'leave',gameId:id});
      assert((await view(members[members.length-1],id)).over);await finish(members,id);
    }
    for(const x of [a,b,c,d,e]) await x.command({command:'leave-queue'});
    const again=await start([d,e]);await d.command({command:'leave',gameId:again});await finish([d,e],again);
    checks.push('join/start race: disjoint membership, capacity, one ready, requeue and second start');
  } else if(scenario==='bots') {
    await join(a);for(let n=0;n<8;n++) await join(a);
    assert(!a.events.some(e=>e.destination===READY));
    await a.command({command:'add-bot'});await barrier(a);
    await a.command({command:'leave-queue'});await barrier(a);
    const latest=a.events.filter(e=>e.destination==='/topic/game/quick/ffa/joined').pop();assert.deepStrictEqual(latest.data,[]);
    await join(a);await join(b);await b.command({command:'add-bot'});await barrier(b);
    await b.command({command:'start'});const id=(await a.wait(READY,0)).data;assert.strictEqual((await b.wait(READY,0)).data,id);
    await watch(a,id);await watch(b,id);const v=await view(a,id), bot=Object.keys(v.players).find(p=>![a.user,b.user].includes(p));assert(bot);
    await b.command({command:'leave',gameId:id});assert(!(await view(a,id)).over);
    for(let n=0;n<10;n++) await round([a],id,[bot]);
    const final=await view(a,id);assert(final.over);assert.strictEqual(final.winner,a.user);assert.strictEqual(final.players[a.user].character.resources.HEALTH,50);
    const events=await finish([a,b],id);assert.strictEqual(events.filter(e=>e.kind==='ROUND_COMMITTED').length,10);
    checks.push('duplicate join; add bot by second participant; leave/reinsert clears orphan bots; bot moves once per round; full win');
  } else {
    const members=[a,b,c,d,e], id=await start(members,true);
    if(scenario==='leave') {
      await accepted(a,await commandMove(a,id,b.user,'com.last.Struggle'));
      await accepted(b,await commandMove(b,id,a.user,'com.last.Struggle'));
      await a.command({command:'leave',gameId:id});await a.command({command:'leave',gameId:id});
      let v=await view(b,id);assert(!v.over);assert.strictEqual(v.players[a.user].character.resources.HEALTH,100);
      assert(v.pendingMove);assert.strictEqual(v.forfeits[a.user],'leave');
      await Promise.all([c,d,e].map(async x=>accepted(x,await commandMove(x,id,a.user,'com.last.Struggle'))));
      v=await view(b,id);assert.strictEqual(v.turn,1);assert.strictEqual(v.players[a.user].character.resources.HEALTH,60);
      assert.strictEqual(v.players[b.user].character.resources.HEALTH,95);
      const again=await start([a,f]);assert.notStrictEqual(again,id);await f.command({command:'leave',gameId:again});await finish([a,f],again);
      for(const x of [c,d,e]) await x.command({command:'leave',gameId:id});
      assert.strictEqual((await view(b,id)).winner,b.user);
      checks.push('only leaver forfeits; own pending cancelled; others retain moves targeting leaver; requeue during old FFA; others continue to winner');
    } else if(scenario==='batch') {
      for(const x of [c,d,e]) await accepted(x,await commandMove(x,id,a.user,'com.last.Struggle'));
      await advance(30000);let v=await view(c,id);assert(!v.over);assert.strictEqual(v.turn,1);
      assert.deepStrictEqual(Object.keys(v.forfeits).sort(),[a.user,b.user].sort());
      assert.strictEqual(v.players[a.user].character.resources.HEALTH,70);
      await advance(30000);v=await view(c,id);assert(v.over);assert.strictEqual(v.winner,'NONE');assert.strictEqual(Object.keys(v.forfeits).length,5);
      checks.push('two simultaneous expiries preserve three survivors and their pending; next simultaneous batch draws');
    } else if(scenario.startsWith('move') || scenario==='all-timeout') {
      if(scenario==='move-before') {
        await advance(29999);await accepted(a,await commandMove(a,id,b.user,'com.last.Struggle'));await advance(1);
        assert.strictEqual((await view(a,id)).winner,a.user);
      } else {
        const m=await commandMove(a,id,b.user,'com.last.Struggle');await advance(scenario==='move-after'?30001:30000);
        const mark=a.events.length;await a.command({command:'move',move:m});await a.wait('/user/queue/illegalMove',mark);
        const v=await view(a,id);assert(v.over);assert.strictEqual(v.winner,'NONE');assert.strictEqual(Object.keys(v.forfeits).length,5);
      }
      assert.strictEqual((await view(a,id)).turn,0);assert.strictEqual((await view(a,id)).players[a.user].character.resources.HEALTH,100);
      checks.push('absolute move boundary '+scenario+'; no cost/pickup on forfeited pending');
    } else {
      await accepted(a,await commandMove(a,id,b.user,'com.last.Struggle'));await advance(1000);
      const mark=b.events.length;a.drop();await b.wait('/topic/game/'+id+'/update',mark);
      await advance(28999);
      await Promise.all([b,c,d,e].map(async(x,i)=>accepted(x,await commandMove(x,id,[c,d,e,a][i].user,'com.last.Struggle'))));
      // Turn completed while A was disconnected: reconnect clock must remain at the original drop.
      await advance(scenario==='reconnect-before'?1000:scenario==='reconnect-exact'?1001:1002);
      a=await connect(a.user);members[0]=a;const state=(await a.command({command:'resume'})).data;
      assert.strictEqual(state.gameId,id);privateView(a,state.view);assert.strictEqual(state.view.turn,1);
      if(scenario==='reconnect-before') {assert.strictEqual(state.status,'resumed');assert.strictEqual(state.view.forfeits[a.user],undefined);}
      else {assert.strictEqual(state.status,'finished');assert.strictEqual(state.view.forfeits[a.user],'reconnect timeout');assert(!state.view.over);}
      await watch(a,id);
      for(const x of [b,c,d]) await x.command({command:'leave',gameId:id});
      if(scenario==='reconnect-before') await a.command({command:'leave',gameId:id});
      assert.strictEqual((await view(e,id)).winner,e.user);
      checks.push('pending reconnect '+scenario+'; same match; continuous move clock; late own forfeit with other survivors');
    }
    const events=await finish(members,id);assert.strictEqual(events.filter(e=>e.kind==='OUTCOME').length,1);
  }
  const transcript=clients.map(c=>({user:c.user,rejected:Boolean(c.failure),events:c.events.filter(e=>e.destination!=='/user/queue/account/data')}));
  console.log(JSON.stringify({ok:true,scenario,checks,exports:savedExports,transcript}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;})
  .finally(async()=>{for(const client of clients) await client.close();});

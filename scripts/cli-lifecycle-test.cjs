'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {Client} = require('./bm-cli.cjs');
const {BM_URL:url, BM_A:a, BM_B:b, BM_C:c, BM_GAME:id, BM_SCENARIO:scenario, BM_CONTROLS:dir} = process.env;
const clients = [];
let sequence = 0;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function advance(ms) {
  const n = sequence++;
  const input = path.join(dir,n+'.request');
  fs.writeFileSync(input+'.tmp',String(ms)); fs.renameSync(input+'.tmp',input);
  const response=path.join(dir,n+'.response'), until=Date.now()+5000;
  while(!fs.existsSync(response)) { assert(Date.now()<until,'clock control timeout'); await sleep(10); }
  return Number(fs.readFileSync(response,'utf8'));
}
async function connect(user) {
  const client=new Client(url,user,'synthetic',3000);clients.push(client);await client.connect();return client;
}
async function view(client) {return (await client.command({command:'view',gameId:id})).data;}
async function resume(client) {return (await client.command({command:'resume'})).data;}
async function watch(client) {await client.command({command:'watch',gameId:id});await view(client);}
async function move(client,target) {
  const state=await view(client), card=state.players[client.user].cardsInHand.find(x=>x.bindingName==='com.last.Struggle');
  return {playedCardName:card.name,playerId:client.user,targetId:target,gameId:id,choices:null};
}
async function submit(client,command) {
  const mark=client.events.length;await client.command({command:'move',move:command});await client.wait('/topic/game/'+id+'/move',mark);
}
async function drop(client,observer) {
  const mark=observer ? observer.events.length : 0;client.drop();
  if(observer) await observer.wait('/topic/game/'+id+'/update',mark);
  else {
    // A new claim succeeds only after the server has released the dropped session.
    await sleep(80);
  }
}
(async()=>{
  let first=await connect(a);await watch(first);
  await assert.rejects(connect(a)); // one active STOMP session, distinct physical connection
  let second=null, third=null;
  if(!scenario.startsWith('com')) {second=await connect(b);await watch(second);}
  if(scenario==='ffa') {third=await connect(c);await watch(third);}
  const original=await view(first);
  assert.strictEqual(original.gameId,id);assert.strictEqual(original.turn,0);
  if(scenario.startsWith('com')) {
    assert.deepStrictEqual(original.moveDeadlines,{});
    await advance(900000);assert.strictEqual((await view(first)).over,false);
    await drop(first);
    // A transport reconnect alone is not an effective game resume; repeated drops retain the first deadline.
    let attempt=await connect(a);const pending=await view(attempt);const deadline=pending.reconnectDeadlines[a];
    assert(deadline);await drop(attempt);await advance(10000);
    attempt=await connect(a);assert.strictEqual((await view(attempt)).reconnectDeadlines[a],deadline);
    await drop(attempt);
    await advance(scenario==='com-before'?19999:scenario==='com-exact'?20000:20001);
    const returned=await connect(a);const state=await resume(returned);
    assert.strictEqual(state.gameId,id);
    if(scenario==='com-before') {
      assert.strictEqual(state.status,'resumed');assert.strictEqual(state.view.over,false);
      assert.deepStrictEqual(state.view.moveDeadlines,{});await returned.command({command:'leave',gameId:id});
      await returned.command({command:'profile'});
    } else {
      assert.strictEqual(state.status,'finished');assert.strictEqual(state.view.over,true);
      assert.strictEqual(state.view.forfeits[a],'reconnect timeout');
      assert.deepStrictEqual(await resume(returned),state);
    }
  } else if(scenario==='ffa') {
    await submit(third,await move(third,a));
    await advance(30000);
    const state=await view(third);assert.strictEqual(state.winner,c);
    assert.deepStrictEqual(Object.keys(state.forfeits).sort(),[a,b].sort());
    for(const client of [first,second,third]) {await client.command({command:'leave',gameId:id});await client.command({command:'profile'});await client.command({command:'leave',gameId:id});}
  } else if(scenario==='move-exact') {
    const command=await move(first,b);await advance(30000);
    const mark=first.events.length;await first.command({command:'move',move:command});await first.wait('/user/queue/illegalMove',mark);
    const state=await view(first);assert.strictEqual(state.over,true);assert.strictEqual(state.winner,'NONE');
  } else {
    const command=await move(first,b);
    if(scenario==='pending') {await submit(first,command);}
    await advance(1000);await drop(first,second);
    const disconnected=await view(second);const deadline=disconnected.reconnectDeadlines[a];assert.strictEqual(deadline,1031000);
    assert.strictEqual(disconnected.moveDeadlines[b],1030000); // multiplayer clock never pauses
    await advance(28999);const returned=await connect(a);const state=await resume(returned);
    assert.strictEqual(state.status,'resumed');assert.strictEqual(state.gameId,id);assert.strictEqual(state.view.turn,0);
    assert.strictEqual(Boolean(state.view.pendingMove),scenario==='pending');
    await watch(returned);
    if(scenario==='pending') {
      const mark=returned.events.length;await returned.command({command:'move',move:command});await returned.wait('/user/queue/illegalMove',mark);
    } else {await submit(returned,command);}
    assert.throws(()=>first.send('/app/game/'+id+'/move',command)); // closed transport cannot inject old command
    const before=await view(returned);assert(before.pendingMove);assert.strictEqual(before.pendingMove.playerId,a);
    await advance(1);const final=await view(returned);assert.strictEqual(final.winner,a);assert.strictEqual(final.forfeits[b],'move timeout');
    await returned.command({command:'logout'});await returned.command({command:'profile'});
  }
  // Queue removal is an explicit application operation, distinct from network drop.
  if(second) {await second.command({command:'leave',gameId:id});await second.command({command:'profile'});}
  if(first && !first.closed) {await first.command({command:'leave',gameId:id});await first.command({command:'profile'});}
  const active=clients.find(x=>!x.closed && !x.failure && x.stomp && x.stomp.connected);
  if(active) {
    await active.command({command:'join',mode:'quick/ffa'});
    await active.wait('/topic/game/quick/ffa/joined',0);
    await active.command({command:'leave-queue'});
  }
  console.log(JSON.stringify({ok:true,scenario,gameId:id}));
})().catch(error=>{console.error(error.stack);process.exitCode=1;})
  .finally(async()=>{for(const client of clients) await client.close();});

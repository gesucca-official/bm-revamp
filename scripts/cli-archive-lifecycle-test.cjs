'use strict';
const assert=require('assert'), fs=require('fs'), path=require('path'), crypto=require('crypto');
const {Client}=require('./bm-cli.cjs');
const {BM_URL:url,BM_MODE:mode,BM_SCENARIO:scenario,BM_GAME:id,BM_CONTROLS:dir}=process.env;
const accounts=JSON.parse(process.env.BM_ACCOUNTS), clients=[], expected=['INITIAL'];
let request=0;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function control(value) {
  const n=request++, file=path.join(dir,n+'.request');
  fs.writeFileSync(file+'.tmp',value); fs.renameSync(file+'.tmp',file);
  const response=path.join(dir,n+'.response'), until=Date.now()+8000;
  while(!fs.existsSync(response)) {assert(Date.now()<until,'control stalled');await sleep(10);}
}
async function connect(user) {const c=new Client(url,user,'synthetic',6000);clients.push(c);await c.connect();return c;}
async function view(c) {return (await c.command({command:'view',gameId:id})).data;}
async function barrier(c) {await c.command({command:'profile'});}
async function accepted(c,target,last) {
  const v=await view(c), card=v.players[c.user].cardsInHand.find(x=>x.bindingName==='com.last.Struggle');assert(card);
  const mark=c.events.length;
  await c.command({command:'move',move:{gameId:id,playerId:c.user,playedCardName:card.name,targetId:target,choices:null}});
  await c.wait('/topic/game/'+id+'/move',mark); await view(c);
  expected.push('MOVE_ACCEPTED');
  if(last) expected.push('ROUND_READY','ENGINE_REPORT','ROUND_COMMITTED');
  expected.push('COMMAND_COMMITTED');
}
async function leave(c,terminal) {
  await c.command({command:'leave',gameId:id});await barrier(c);
  expected.push('FORFEIT','LIFECYCLE_COMMITTED');if(terminal) expected.push('OUTCOME');
}
function inspect(x,complete) {
  assert.strictEqual(x.recording.complete,complete);assert.strictEqual(x.recording.status,complete?'OK':'WRITE_FAILED');
  const entries=x.events.concat(x.unpersistedEvents);let previous='';
  entries.forEach((e,i)=>{assert.strictEqual(e.sequence,i);assert.strictEqual(e.previousHash,previous);
    assert.strictEqual(e.hash,crypto.createHash('sha256').update(id+'\n'+i+'\n'+previous+'\n'+e.json).digest('hex'));previous=e.hash;});
  const data=entries.map(e=>JSON.parse(e.json));
  assert.deepStrictEqual(data.map(e=>e.kind),expected);
  assert.strictEqual(data[0].data.state.mode,mode);
  assert.strictEqual(data.filter(e=>e.kind==='OUTCOME').length,1);
  assert.strictEqual(data[data.length-1].data.outcome.over,true);
  const forfeits=data.filter(e=>e.kind==='FORFEIT');
  if(scenario==='timeout') {
    assert.deepStrictEqual(forfeits[0].data.players,{[accounts[0]]:accounts.length===1?'reconnect timeout':'move timeout'});
    assert.strictEqual(forfeits[0].data.deadline,1030000);
    if(accounts.length===3) {
      assert.deepStrictEqual(forfeits[1].data.players,{[accounts[1]]:'move timeout',[accounts[2]]:'move timeout'});
      assert.strictEqual(data[data.length-1].data.outcome.result,'draw');
    }
  } else {
    assert.deepStrictEqual(forfeits.map(e=>e.data),accounts.slice(0,accounts.length===3?2:1).map(playerId=>({playerId,reason:'leave'})));
    assert.strictEqual(data.filter(e=>e.kind==='RECONNECTED').length,1);
  }
  return entries;
}
(async()=>{
  let a=await connect(accounts[0]), b=accounts.length>1?await connect(accounts[1]):null,
    c=accounts.length>2?await connect(accounts[2]):null;
  const human=[a,b,c].filter(Boolean), route={quick1vCom:'quick/1vCom',open1vCom:'open/1vCom',quick1v1:'quick/1v1',quickFFA:'quick/ffa'}[mode];
  const marks=human.map(c=>c.events.length);
  for(const client of human) {await client.command({command:'join',mode:route,deckId:'fixture'});await barrier(client);}
  if(mode==='quickFFA') {await a.command({command:'start'});await barrier(a);}
  for(let i=0;i<human.length;i++) assert.strictEqual((await human[i].wait('/user/queue/game/'+route+'/ready',marks[i])).data,id);
  for(const client of human) {await client.command({command:'watch',gameId:id});await view(client);}
  await control('active'); // Assert persistent admission while the game is still live.
  // R07 Struggle: -5 self, -10 target. Use an explicit A→B→C→A cycle in FFA;
  // the order of keys in the private view is not the insertion order of the engine.
  const initial=await view(a), opponent=b?b.user:Object.keys(initial.players).find(p=>p!==a.user);
  await accepted(a,opponent,human.length===1);
  if(b) await accepted(b,c?c.user:a.user,!c);
  if(c) await accepted(c,a.user,true);
  const round=await view(a);assert.strictEqual(round.turn,1);
  Object.values(round.players).forEach(p=>assert.strictEqual(p.character.resources.HEALTH,85));
  if(scenario==='timeout') {
    if(b) await accepted(b,c?c.user:a.user,false);
    if(c) await accepted(c,b.user,false);
  } else if(b) {await accepted(a,b.user,false);}
  const pending=(await view(a)).pendingMove;
  const dropMark=b?b.events.length:0;a.drop();
  if(b) await b.wait('/topic/game/'+id+'/update',dropMark);else await sleep(100);
  expected.push('DISCONNECTED');
  if(scenario==='timeout') {
    await control('30000');expected.push('FORFEIT');
    if(c) expected.push('ROUND_READY','ENGINE_REPORT','ROUND_COMMITTED');
    expected.push('LIFECYCLE_COMMITTED');
    if(c) {await control('30000');expected.push('FORFEIT','LIFECYCLE_COMMITTED');}
    expected.push('OUTCOME');
    a=await connect(accounts[0]);const resumed=(await a.command({command:'resume'})).data;
    assert.strictEqual(resumed.status,'finished');assert.strictEqual(resumed.view.over,true);
    if(human.length===1) assert.strictEqual(resumed.view.forfeits[a.user],'reconnect timeout');
  } else {
    await control('1');a=await connect(accounts[0]);
    if(scenario==='recover') {
      const deliver=a.event.bind(a);let lost=false;
      a.event=(destination,body)=>{
        if(destination==='/user/queue/session/resume' && !lost) {lost=true;return;}
        deliver(destination,body);
      };
    }
    const resumed=(await a.command({command:'resume'})).data;expected.push('RECONNECTED');
    assert.strictEqual(resumed.status,'resumed');assert.strictEqual(resumed.gameId,id);
    assert.deepStrictEqual(resumed.view.pendingMove,pending);
    await a.command({command:'watch',gameId:id});await view(a);
    await leave(a,!c);if(c) {assert.strictEqual((await view(c)).over,false);await leave(b,true);}
  }
  let exported=(await a.command({command:'export',gameId:id})).data;
  const bytes=inspect(exported,scenario!=='recover');
  if(scenario==='recover') {
    assert.strictEqual(exported.events.length,1);assert(exported.unpersistedEvents.length>0);
    await control('recover');exported=(await a.command({command:'export',gameId:id})).data;
    assert.deepStrictEqual(inspect(exported,true),bytes);
  }
  for(const client of [a,b,c].filter(Boolean)) {
    assert.deepStrictEqual((await client.command({command:'export',gameId:id})).data,exported);
    await client.command({command:'leave',gameId:id});await barrier(client);
    await client.command({command:'leave',gameId:id});await barrier(client);
    assert.deepStrictEqual((await client.command({command:'export',gameId:id})).data,exported);
  }
  console.log(JSON.stringify({ok:true,mode,scenario,expected,exported}));
})().catch(e=>{console.error(e.stack);process.exitCode=1;})
  .finally(async()=>{for(const client of clients) await client.close();});

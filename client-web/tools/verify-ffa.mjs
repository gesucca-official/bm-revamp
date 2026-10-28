// C2b-3 end-to-end check against the REAL server: five-seat FFA with devAlice, devBob and computers.
// Like VerifyLifecycle it starts the server itself on a temporary database (the local data is never
// touched) and stops it at the end. Waits of 30 s are real. At every turn of a five-seat game the scene
// is read back and checked with the same geometry functions as the unit tests, on the real views.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {fan,overlap,inside} from '../src/readability.ts';

const repo=resolve(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c2/c2b-3';
const accounts={A:{user:'devAlice',password:'local-alice'},B:{user:'devBob',password:'local-bob'}};
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
const only=process.env.BM_SCENARIOS?.split(',');
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright, two contexts, A with touch emulation) against the local server started by this script on a temporary database; real 30 s waits; not a physical device',checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,600));};

// --- Server on a temporary database (same command as scripts/dev.ps1 -Task Server -SeedAccounts) ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-ffa-'));
let server=null;
async function startServer(){
 const log=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 const end=Date.now()+90000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited (${server.exitCode}); log in ${data}`);
  try{const r=await fetch('http://127.0.0.1:8080/api/rest/v1/sign-in/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start in 90 s');
}
async function stopServer(){
 if(!server||server.exitCode!==null)return;
 const gone=new Promise(r=>server.once('exit',r));
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}
 await gone;server=null;
}
if(await fetch('http://127.0.0.1:8080/api/rest/v1/sign-in/validate',{method:'POST'}).then(()=>true,()=>false))throw new Error('port 8080 is in use: stop the other server first');

// --- Browser helpers ---
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const stompFrames=payload=>{let s=String(payload);if(s.startsWith('a['))s=s.slice(1);else if(!s.startsWith('['))return[];try{return JSON.parse(s).map(raw=>{const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');return{at:Date.now(),command:lines[0],headers:Object.fromEntries(lines.slice(1).map(l=>[l.slice(0,l.indexOf(':')),l.slice(l.indexOf(':')+1)])),body:rest.join('\n\n').replace(/\u0000$/,'')};});}catch{return[];}};

async function open(name,touch=false){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh},hasTouch:touch}),page=await context.newPage();
 const p={name,user,password,page,context,sent:[],received:[],hand:new Set()};
 page.on('pageerror',e=>evidence.errors.push(`${name}: ${e}`));
 page.on('websocket',ws=>{ws.on('framesent',f=>p.sent.push(...stompFrames(f.payload)));ws.on('framereceived',f=>p.received.push(...stompFrames(f.payload)));});
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/ffa-${n}${tag}.jpg`,type:'jpeg',quality:70});
 p.views=(game)=>p.received.filter(f=>f.command==='MESSAGE'&&/\/user\/queue\/game\/[^/]+\/view$/.test(f.headers.destination)).map(f=>JSON.parse(f.body)).filter(v=>!game||v.gameId===game);
 p.lastResume=()=>JSON.parse(p.received.filter(f=>f.command==='MESSAGE'&&f.headers.destination==='/user/queue/session/resume').at(-1).body);
 p.sends=(from=0)=>p.sent.slice(from).filter(f=>f.command==='SEND').map(f=>f.headers.destination);
 p.text=async sel=>(await page.locator(sel).first().innerText()).replace(/\s+/g,' ').trim();
 return p;
}
async function login(p){
 await p.page.goto(url);
 await p.page.getByLabel('Nome').fill(p.user);await p.page.getByLabel('Password').fill(p.password);
 await p.page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await p.page.getByTestId('quick').waitFor({timeout:15000});
}
const readyId=p=>p.received.filter(f=>f.command==='MESSAGE'&&/quick\/ffa\/ready$/.test(f.headers.destination)).at(-1)?.body;
const list=async p=>(await p.page.locator('[data-testid=ffa-list] li:not(.free)').allInnerTexts()).map(t=>t.trim());
const waitList=(p,n)=>p.page.waitForFunction(n=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length===n,n,{timeout:10000});
async function joinFfa(p){
 await p.page.getByRole('radio',{name:'Tutti contro tutti'}).click();
 await p.page.getByTestId('quick').click();await p.page.getByTestId('ffa-list').waitFor({timeout:10000});
}
async function addComputers(p,n){for(let i=0;i<n;i++){const before=(await list(p)).length;await p.page.getByTestId('add-computer').click();if(before+1<5)await waitList(p,before+1);}}
const table=(p,game)=>p.wait(x=>x&&x.hits.some(h=>h.id.startsWith('person-'))&&(!game||readyId(p)===game),30000,'table');
const toHub=async p=>{await p.page.getByRole('button',{name:'Torna all’hub'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});};
const dialogOpen=p=>p.page.evaluate(()=>!!document.querySelector('dialog[open]'));

// Scene read back against the view of the same turn: seats, fans, objects, no overlap between seats, hand and edges.
function sceneCheck(p,s,game,seats){
 const v=p.views(game).filter(x=>x.turn===s.turn).at(-1);if(!v)return null;
 const L=s.layout,ids=Object.keys(v.players),problems=[];
 // Seats and computer numbers follow the order of the view: it must not change during the game.
 if(ids.join()!==Object.keys(p.views(game)[0].players).join())problems.push(`player order changed: ${ids}`);
 if(L.seats.length!==seats)problems.push(`seats ${L.seats.length}`);
 if(s.hits.filter(h=>h.kind==='person').length!==seats)problems.push('person hits');
 const fans={};
 for(const id of ids.filter(id=>id!==s.me)){
  const count=v.players[id].cardsInHand;if(typeof count!=='number')problems.push(`${id} hand not a number`);
  if(s.backs[id]!==count)problems.push(`${id} fan ${s.backs[id]} != cardsInHand ${count}`);fans[id]=count;
  const items=s.hits.filter(h=>h.kind==='item'&&h.target.owner===id).length;if(items!==v.players[id].character.items.length)problems.push(`${id} objects ${items}`);}
 const n=s.order.length,hand={x:L.hand.center,y:L.hand.y,w:L.hand.w+Math.max(0,n-1)*L.hand.step,h:L.hand.h};
 if(!inside(hand,vw,vh))problems.push('hand outside');
 const blocks=seat=>[seat.person,...seat.items,seat.board];
 for(const seat of L.seats){
  // Fans are checked on the FFA table; a two-player game uses the duel layout of C2a, unchanged.
  const fanBox=seat.me||seats<3?null:fan(seat.backs,seat.back,fans[seat.id]??0).box;
  for(const b of [...blocks(seat),...(fanBox?[fanBox]:[])]){if(!inside(b,vw,vh))problems.push(`${seat.id} outside ${JSON.stringify(b)}`);if(overlap(b,hand)>0)problems.push(`${seat.id} over the hand`);}
  for(const o of L.seats)if(o!==seat){for(const a of blocks(seat))for(const b of blocks(o))if(overlap(a,b)>0)problems.push(`${seat.id}/${o.id} overlap`);
   if(fanBox)for(const b of blocks(o))if(overlap(fanBox,b)>0)problems.push(`${seat.id} fan over ${o.id}`);}
  if(fanBox)for(const b of blocks(seat))if(overlap(fanBox,b)>0)problems.push(`${seat.id} fan over its seat`);
 }
 return {turn:s.turn,seats:L.seats.length,hand:n,fans,objects:Object.fromEntries(ids.map(id=>[id,v.players[id].character.items.length])),problems};
}

// One move through the UI (card, target, discard if bound, ✓); the server decides legality.
async function playOne(p){
 const {page}=p,esc=()=>page.keyboard.press('Escape');
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen(p)){await esc();await page.waitForTimeout(60);}};
 const moves=()=>p.sends().filter(d=>/\/app\/game\/[^/]+\/move$/.test(d)).length;
 for(const card of (await p.state()).order){
  const own=(await p.state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await p.state()).selected!==card.key)continue;
  let aimed=false;
  for(const t of (await p.state()).hits.filter(h=>h.kind==='person'||h.kind==='item')){if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}await tap(t);if((await p.state()).target){aimed=true;break;}}
  if(!aimed){await esc();continue;}
  const s=await p.state();
  if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
  const before=moves();await page.getByTestId('confirm').click();
  const r=await p.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  assert.equal(moves()-before,1,`${p.name}: one SEND per confirmation`);
  if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
  return card.name;
 }
 throw new Error(`${p.name}: no playable card`);
}

// K7 on a covered opponent object: the mouse raises it on hover, a first touch raises it, the next touch aims (or inspects).
const k7={mouse:null,touch:null,raiseOnly:null};
async function tryK7(p,game){
 if(k7.mouse&&k7.touch)return;
 const {page}=p;let s=await p.state();
 // The visible left part of a covered opponent object, where nothing of the HTML shell lies on top of the canvas.
 const onCanvas=h=>page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.tagName==='CANVAS',[h.x-h.w*.3,h.y]);
 let covered=null;for(const h of s.hits.filter(h=>h.kind==='item'&&h.covered&&h.target.owner!==s.me))if(await onCanvas(h)){covered=h;break;}
 if(!covered)return;
 const v=p.views(game).filter(x=>x.turn===s.turn).at(-1),hand=v?.players[s.me].cardsInHand??[];
 const far=s.order.find(c=>hand.find(h=>h.name===c.name)?.canTarget.includes('FAR_ITEM'));
 const owner=covered.target.owner,index=covered.target.itemIndex,spot={x:covered.x-covered.w*.3,y:covered.y};
 const item=st=>st.hits.find(h=>h.id===covered.id);
 if(!k7.raiseOnly){
  // No card chosen: touch raises, a second touch inspects; the mouse raises on hover.
  await page.touchscreen.tap(spot.x,spot.y);await page.waitForTimeout(150);s=await p.state();
  const peek=s.peek,raisedW=item(s)?.w;await p.shot('k7-touch-raised');
  await page.touchscreen.tap(spot.x,spot.y);await page.waitForTimeout(300);const inspected=await dialogOpen(p);
  const title=inspected?await p.text('dialog h2'):null;if(inspected)await page.keyboard.press('Escape');await page.waitForTimeout(150);
  await page.mouse.move(spot.x,spot.y);await page.waitForTimeout(250);const hover=item(await p.state())?.w;await p.shot('k7-mouse-raised');await page.mouse.move(5,vh/2);
  k7.raiseOnly={item:covered.id,restingW:covered.w,peekAfterFirstTouch:peek,widthAfterFirstTouch:raisedW,secondTouchInspects:inspected,inspectionTitle:title,widthOnHover:hover};
  assert.equal(peek,covered.id,'first touch raises the covered object');assert.ok(raisedW>covered.w,'raised by the first touch');assert.ok(inspected,'second touch acts (inspection)');assert.ok(hover>covered.w,'raised by hover');
  step('k7RaiseOnly',k7.raiseOnly);
 }
 if(!far)return;
 const select=async how=>{const h=(await p.state()).hits.find(x=>x.id===far.key);if(how==='touch')await page.touchscreen.tap(h.x-h.w*.22,h.y);else await page.mouse.click(h.x-h.w*.22,h.y);await page.waitForTimeout(150);return (await p.state()).selected===far.key;};
 if(!k7.mouse&&await select('mouse')){
  await page.mouse.move(spot.x,spot.y);await page.waitForTimeout(200);const w=item(await p.state())?.w;
  await page.mouse.click(spot.x,spot.y);await page.waitForTimeout(200);const t=(await p.state()).target;await p.shot('k7-mouse-target');
  k7.mouse={card:far.name,owner,index,raisedOnHover:w>covered.w,target:t};
  assert.deepEqual(t,{owner,itemIndex:index},'mouse: one click on the hovered covered object aims it');
  await page.keyboard.press('Escape');await page.mouse.move(5,vh/2);step('k7Mouse',k7.mouse);
 }
 if(!k7.touch&&await select('touch')){
  await page.touchscreen.tap(spot.x,spot.y);await page.waitForTimeout(200);const first=await p.state();
  await page.touchscreen.tap(spot.x,spot.y);await page.waitForTimeout(200);const second=await p.state();await p.shot('k7-touch-target');
  k7.touch={card:far.name,owner,index,afterFirst:{peek:first.peek,target:first.target,selected:first.selected===far.key},afterSecond:{target:second.target}};
  assert.equal(first.peek,covered.id);assert.equal(first.target,null,'first touch only raises');assert.deepEqual(second.target,{owner,itemIndex:index},'second touch aims');
  await page.keyboard.press('Escape');step('k7Touch',k7.touch);
 }
}

// Plays every turn until the outcome, checking the scene at each turn; after the own death it watches (D11).
async function playToEnd(p,game,{seats,checks,shots=true,beforeMove}={}){
 const turns=[];let watched=null,shot=0;
 while(true){
  const s=await p.wait(x=>x&&(x.over||x.eliminated||x.phase==='choose'),150000,'next turn');
  if(s.over)break;
  if(s.eliminated){
   const panel=await p.text('.outcome');await p.shot(`${checks}-out`);
   if(await p.page.getByTestId('watch').count()){await p.page.getByTestId('watch').click();watched={turn:s.turn,panel};
    await p.page.waitForTimeout(400);const hint=await p.text('.hint');watched.hint=hint;await p.shot(`${checks}-watching`);
    const end=await p.wait(x=>x.over,300000,'outcome while watching');watched.outcomeTurn=end.turn;}
   else watched={turn:s.turn,panel,forfeit:true};
   break;}
  if(seats){const c=sceneCheck(p,s,game,seats);if(c){turns.push(c);assert.deepEqual(c.problems,[],`${p.name} turn ${s.turn}: ${c.problems.join('; ')}`);}}
  if(shots&&(s.turn===0||s.turn===3))await p.shot(`${checks}-turn${s.turn}`);
  if(beforeMove)await beforeMove(p,s);
  await playOne(p);
  await p.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,150000,'turn resolved');
 }
 const end=await p.state();
 return {turns,watched,end};
}
function privacy(me,other,game){
 const views=me.views(game);assert.ok(views.length>=2,`${me.name}: views captured`);
 const own=new Set(views.flatMap(v=>v.players[me.user].cardsInHand.map(c=>c.name))),theirs=new Set(other.views(game).flatMap(v=>Array.isArray(v.players[other.user].cardsInHand)?v.players[other.user].cardsInHand.map(c=>c.name):[]));
 const onlyOther=[...theirs].filter(n=>!own.has(n));
 for(const v of views){
  assert.ok(Array.isArray(v.players[me.user].cardsInHand),`${me.name}: own hand is an array`);
  for(const [id,pl] of Object.entries(v.players))if(id!==me.user)assert.equal(typeof pl.cardsInHand,'number',`${me.name}: ${id}'s hand is only a count`);
  const rest=JSON.parse(JSON.stringify(v));delete rest.resolvedMoves;delete rest.pendingMove;delete rest.timeBasedEffects;
  for(const pl of Object.values(rest.players))delete pl.character;
  const text=JSON.stringify(rest);
  for(const n of onlyOther)assert.ok(!text.includes(JSON.stringify(n)),`${me.name}: ${n} (only in ${other.name}'s hand) leaked in a view`);
 }
 return {views:views.length,otherHandsNumbers:true,otherOnlyNames:onlyOther.length,leaks:0};
}
const characters=(p,game)=>{const v=p.views(game).at(-1);return Object.fromEntries(Object.entries(v.players).map(([id,pl])=>[id,pl.character.name]));};
const outcomeOf=(p,game)=>{const v=p.views(game).find(x=>x.over)??p.views(game).at(-1);return {winner:v.winner,outcomeReason:v.outcomeReason,forfeits:v.forfeits,dead:Object.entries(v.players).filter(([,pl])=>pl.character.dead).map(([id])=>id),turns:v.turn};};
const run=name=>!only||only.includes(name);
let A=null,B=null;

try{
 await startServer();step('server',{database:'temporary',jar});
 A=await open('A',true);B=await open('B');
 await login(A);await login(B);

 // 1. Queue exit: A with two computers leaves; the computers left without humans disappear (B then sees only itself).
 if(run('queue')){
  await joinFfa(A);await waitList(A,1);
  const alone={list:await list(A),startEnabled:await A.page.getByTestId('start-now').isEnabled(),addEnabled:await A.page.getByTestId('add-computer').isEnabled()};
  assert.deepEqual(alone.list,['devAlice (tu)']);assert.equal(alone.startEnabled,false,'start now needs two entries');
  await addComputers(A,2);const withBots=await list(A);assert.deepEqual(withBots,['devAlice (tu)','Computer 1','Computer 2']);
  assert.ok(await A.page.getByTestId('start-now').isEnabled());await A.shot('01-queue');
  const mark=A.sent.length;await A.page.getByTestId('leave-queue').click();await A.page.getByTestId('quick').waitFor({timeout:10000});
  assert.ok(A.received.some(f=>f.headers.destination==='/user/queue/session/queue/leave'),'leave ACK');
  const lastTopic=JSON.parse(A.received.filter(f=>f.headers.destination==='/topic/game/quick/ffa/joined').at(-1).body);
  await joinFfa(B);await waitList(B,1);await B.page.waitForTimeout(800);const bList=await list(B);
  assert.deepEqual(bList,['devBob (tu)'],'computers left without humans are gone');assert.equal(await B.page.getByTestId('start-now').isEnabled(),false);
  await B.shot('02-queue-after-exit');
  await B.page.getByTestId('leave-queue').click();await B.page.getByTestId('quick').waitFor({timeout:10000});
  assert.ok(!A.sends().includes('/app/game/quick/ffa/start'),'no start ever sent with one entry');
  step('queueExit',{alone,withBots,sendsOnExit:A.sends(mark),lastListSeenByA:lastTopic,listSeenByBAfterwards:bList});
 }

 // 2. A + four computers: automatic start at five, played to the outcome with the scene checked at every turn; K7.
 if(run('five')){
  await joinFfa(A);await waitList(A,1);await addComputers(A,4);
  const g=await (async()=>{await table(A);return readyId(A);})();
  assert.ok(!A.sends().includes('/app/game/quick/ffa/start'),'five entries start by themselves');
  const v0=A.views(g)[0];assert.equal(Object.keys(v0.players).length,5);
  const names=await A.page.evaluate(()=>window.__bm.state.hits.filter(h=>h.kind==='person').map(h=>h.label.split(',')[0]));
  const r=await playToEnd(A,g,{seats:5,checks:'five',beforeMove:p=>tryK7(p,g)});
  await A.shot('five-outcome');const text=await A.text('.outcome');
  step('fiveWithComputers',{gameId:g,players:Object.keys(v0.players),characters:characters(A,g),seatNames:names,turnsChecked:r.turns.length,maxHand:Math.max(...r.turns.map(t=>t.hand)),maxObjects:Math.max(...r.turns.flatMap(t=>Object.values(t.objects))),fansSeen:[...new Set(r.turns.flatMap(t=>Object.values(t.fans)))].sort(),watched:r.watched,outcome:outcomeOf(A,g),text});
  // "New game" repeats the FFA: back in the FFA queue, alone.
  await A.page.getByTestId('again').click();await A.page.getByTestId('ffa-list').waitFor({timeout:15000});await waitList(A,1);
  const again=await list(A);assert.deepEqual(again,['devAlice (tu)']);
  await A.page.getByTestId('leave-queue').click();await A.page.getByTestId('quick').waitFor({timeout:10000});
  step('newGameRepeatsFfa',{list:again});
 }
 // Inspection of a numbered computer shows its full id (K4, D9).
 const inspectBot=async(p)=>{const s=await p.state();const bot=s.hits.find(h=>h.kind==='person'&&h.target.owner.startsWith('ComPlayer_'));if(!bot)return null;
  await p.page.mouse.move(bot.x,bot.y);await p.page.waitForTimeout(200);await p.page.getByTestId('info').click();const text=await p.text('dialog .receipt');await p.shot('inspect-bot');await p.page.keyboard.press('Escape');
  return {owner:bot.target.owner,label:bot.label,text};};

 // 3. A + B + three computers: two humans in the same FFA, private views; both play to the outcome.
 if(run('two')){
  await joinFfa(A);await waitList(A,1);await joinFfa(B);await waitList(A,2);await addComputers(A,3);
  await Promise.all([table(A),table(B)]);const g=readyId(A);assert.equal(g,readyId(B),'same gameId');
  const bot=await inspectBot(A);assert.ok(bot&&bot.text.includes(`ID ${bot.owner}`)&&/^Computer \d/.test(bot.label),'numbered computer with its full id');
  const [ra,rb]=await Promise.all([playToEnd(A,g,{seats:5,checks:'two-A'}),playToEnd(B,g,{seats:5,checks:'two-B',shots:false})]);
  await Promise.all([A.wait(x=>x.over,300000,'A outcome'),B.wait(x=>x.over,300000,'B outcome')]);
  await A.shot('two-outcome-A');await B.shot('two-outcome-B');
  step('twoHumansThreeComputers',{gameId:g,characters:characters(A,g),inspectedComputer:bot,turnsCheckedA:ra.turns.length,turnsCheckedB:rb.turns.length,watchedA:ra.watched,watchedB:rb.watched,privacyA:privacy(A,B,g),privacyB:privacy(B,A,g),outcome:outcomeOf(A,g),textA:await A.text('.outcome'),textB:await B.text('.outcome')});
  await toHub(A);await toHub(B);
 }

 // 4. A + B, "start now" with two entries: a two-player FFA to the outcome.
 if(run('start')){
  await joinFfa(A);await waitList(A,1);const disabled=!(await A.page.getByTestId('start-now').isEnabled());
  await joinFfa(B);await waitList(A,2);await A.shot('start-two-queue');
  await A.page.getByTestId('start-now').click();await Promise.all([table(A),table(B)]);const g=readyId(A);assert.equal(g,readyId(B));
  assert.equal(A.sends().filter(d=>d==='/app/game/quick/ffa/start').length,1);
  const v0=A.views(g)[0];assert.deepEqual(Object.keys(v0.players).sort(),['devAlice','devBob']);
  await Promise.all([playToEnd(A,g,{seats:2,checks:'start-A'}),playToEnd(B,g,{seats:2,checks:'start-B',shots:false})]);
  await Promise.all([A.wait(x=>x.over,300000),B.wait(x=>x.over,300000)]);await A.shot('start-outcome');
  step('startNowWithTwo',{gameId:g,startDisabledAlone:disabled,players:Object.keys(v0.players),characters:characters(A,g),outcome:outcomeOf(A,g),textA:await A.text('.outcome'),textB:await B.text('.outcome')});
  await toHub(A);await toHub(B);
 }

 const ffaWithB=async()=>{await joinFfa(A);await waitList(A,1);await joinFfa(B);await waitList(A,2);await addComputers(A,3);await Promise.all([table(A),table(B)]);const g=readyId(A);assert.equal(g,readyId(B));return g;};
 // 5. B abandons: A goes on to the outcome; B's seat shows the forfeit.
 if(run('leave')){
  const g=await ffaWithB();
  await B.page.getByLabel('Apri menu').click();await B.page.getByRole('button',{name:'Abbandona la partita'}).click();await B.page.getByRole('button',{name:'Sì, abbandona'}).click();
  await B.page.getByTestId('quick').waitFor({timeout:15000});
  const seen=await A.wait(x=>x.hits.some(h=>h.id==='person-devBob'&&h.label.includes('forfait')),20000,'A sees the forfeit');
  await A.shot('leave-forfeit');
  const r=await playToEnd(A,g,{seats:5,checks:'leave'});await A.shot('leave-outcome');
  const o=outcomeOf(A,g);assert.equal(o.forfeits.devBob,'leave');
  step('otherLeaves',{gameId:g,characters:characters(A,g),forfeitSeenAtTurn:seen.turn,turnsAfter:r.turns.length,watched:r.watched,outcome:o,textA:await A.text('.outcome')});
  await toHub(A);
 }

 // 6. B lets its clock run out: forfeit for move timeout after 30 s, A goes on to the outcome.
 if(run('timeout')){
  const g=await ffaWithB();const t0=Date.now();
  await B.page.locator('.clock:not(.away)').waitFor({timeout:5000});const clockB=await B.page.locator('.clock:not(.away)').allInnerTexts();
  await playOne(A);
  const outB=await B.wait(x=>x.eliminated||x.over,50000,'B move timeout');const secs=Math.round((Date.now()-t0)/1000);
  const panelB=await B.text('.outcome');await B.shot('timeout-B');
  assert.match(panelB,/Non hai mosso entro 30 secondi/);
  await toHub(B);
  const r=await playToEnd(A,g,{seats:5,checks:'timeout'});await A.shot('timeout-outcome');
  const o=outcomeOf(A,g);assert.equal(o.forfeits.devBob,'move timeout');
  step('otherMoveTimeout',{gameId:g,characters:characters(A,g),clockB,secondsToForfeit:secs,bOver:outB.over,panelB,turnsAfter:r.turns.length,watched:r.watched,outcome:o,textA:await A.text('.outcome')});
  await toHub(A);
 }

 // 7. B drops and rejoins after the deadline: own forfeit and the current state; A goes on to the outcome.
 if(run('drop')){
  // B sends its move, then drops: its reconnect deadline runs out before the move deadline of the next turn.
  const g=await ffaWithB();
  await playOne(B);
  await B.page.getByLabel('Apri menu').click();await B.page.getByRole('button',{name:'Strumenti'}).click();await B.page.getByRole('button',{name:'Simula disconnessione'}).click();
  await B.page.getByRole('button',{name:'Rientra'}).waitFor({timeout:10000});const dropped=Date.now();
  await playOne(A);await A.wait(x=>x.over||x.eliminated||(x.turn>0&&x.phase==='choose'),30000,'next turn');
  const away=await A.page.locator('.clock.away').allInnerTexts();await A.shot('drop-away');
  if(!(await A.state()).over&&!(await A.state()).eliminated)await playOne(A);
  await A.wait(x=>x.hits.some(h=>h.id==='person-devBob'&&h.label.includes('forfait'))||x.over,50000,'A sees the reconnect forfeit');
  await B.page.waitForTimeout(Math.max(0,dropped+31000-Date.now()));
  const mark=B.sent.length;await B.page.getByRole('button',{name:'Rientra'}).click();
  const back=await B.wait(x=>x&&(x.eliminated||x.over),15000,'B sees its forfeit');
  const resume=B.lastResume(),panel=await B.text('.outcome'),stateA=await A.state();await B.shot('drop-late-rejoin');
  assert.match(panel,/Non sei rientrato entro 30 secondi/);assert.equal(resume.view.forfeits.devBob,'reconnect timeout');
  const framesB=B.sent.slice(mark).filter(f=>f.command==='SUBSCRIBE'||f.command==='SEND').map(f=>`${f.command} ${f.headers.destination}`);
  assert.ok(!framesB.some(f=>f.endsWith('/move')),'no move resent');
  await toHub(B);
  const r=await playToEnd(A,g,{seats:5,checks:'drop'});await A.shot('drop-outcome');
  step('otherLateRejoin',{gameId:g,characters:characters(A,g),awayShownToA:away,resumeStatus:resume.status,resumeTurn:resume.view.turn,turnSeenByB:back.turn,turnOfA:stateA.turn,forfeits:resume.view.forfeits,panelB:panel,framesB,turnsAfter:r.turns.length,watched:r.watched,outcome:outcomeOf(A,g),textA:await A.text('.outcome')});
  await toHub(A);
 }
 step('k7',k7);
 await A.page.getByRole('button',{name:'Esci',exact:true}).click();await B.page.getByRole('button',{name:'Esci',exact:true}).click();
 assert.deepEqual(evidence.errors,[],'no page errors');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);
 for(const p of [A,B].filter(Boolean))await p.shot(`failure-${p.name}`).catch(()=>{});}
finally{
 await writeFile(`${out}/ffa${tag}.json`,JSON.stringify(evidence,null,1));
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

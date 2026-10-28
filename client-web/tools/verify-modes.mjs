// C2b-1 end-to-end check against the REAL local server: modes and queues with two accounts.
// devAlice and devBob in two isolated Edge contexts: presence, leaving the queue, a full 1v1 game,
// private views, "new game" repeating the mode, and a refused join while a game is resumable.
// Prerequisites: ./scripts/dev.ps1 -Task Server -SeedAccounts and ./client-web/run.ps1 -Task Serve.
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c2';
const accounts={A:{user:'devAlice',password:'local-alice'},B:{user:'devBob',password:'local-bob'}};
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=process.env.BM_VIEWPORT?`-${process.env.BM_VIEWPORT}`:'';
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright, two contexts) against the local server; not a physical device',checks:{},errors:[]};
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});

// STOMP frames inside SockJS frames: a["MESSAGE\ndestination:...\n\n{...}\u0000"]
const stompFrames=payload=>{const s=String(payload);if(!s.startsWith('a['))return[];try{return JSON.parse(s.slice(1)).map(raw=>{const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');return{command:lines[0],headers:Object.fromEntries(lines.slice(1).map(l=>[l.slice(0,l.indexOf(':')),l.slice(l.indexOf(':')+1)])),body:rest.join('\n\n').replace(/\u0000$/,'')};});}catch{return[];}};

async function join(name){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();
 const p={name,user,page,context,sent:[],received:[],moves:0,hand:new Set(),turns:0};
 page.on('pageerror',e=>evidence.errors.push(`${name}: ${e}`));
 page.on('websocket',ws=>{ws.on('framesent',f=>{const s=String(f.payload);p.sent.push(s);if(/destination:\/app\/game\/[^/\\\n]+\/move/.test(s))p.moves++;});ws.on('framereceived',f=>p.received.push(...stompFrames(f.payload)));});
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/modes-${n}${tag}.jpg`,type:'jpeg',quality:70});
 p.ack=dest=>p.received.some(f=>f.command==='MESSAGE'&&f.headers.destination===dest);
 p.count=async()=>Number(await page.getByTestId('presence-count').innerText());
 p.rows=async()=>page.locator('.presence tbody tr td:first-child').allInnerTexts();
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill(user);await page.getByLabel('Password').fill(password);
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 // A previous run may have left a resumable game for this synthetic account: close it like a player would.
 await page.waitForFunction(()=>document.querySelector('[data-testid=quick]')||window.__bm,null,{timeout:15000});
 if(await page.evaluate(()=>!!window.__bm)){
  evidence.checks[`resumedLeftover${name}`]=true;
  if(!(await p.state()).over){await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
  else await page.getByRole('button',{name:'Torna all’hub'}).click();}
 await page.getByTestId('quick').waitFor({timeout:15000}).catch(async()=>{throw new Error(`${name}: hub not reached (${await page.locator('.problem').allInnerTexts()}; a previous game may be resumable)`);});
 return p;
}
const pickMode=async(p,label)=>{await p.page.getByRole('radio',{name:label}).click();};
const center=h=>h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:{x:h.x,y:h.y};
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

// One player's loop: try cards and targets through the UI; the server decides legality.
async function playOut(p){
 const {page}=p,cancel=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(60);};
 const tap=async h=>{const c=center(h);await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);};
 for(let guard=0;guard<120;guard++){
  let s=await p.wait(x=>x&&(x.over||x.message.startsWith('Sei fuori')||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),70000,'choose phase');
  if(s.over||s.message.startsWith('Sei fuori'))return s;
  const turn=s.turn;let sent=false;s.order.forEach(c=>p.hand.add(c.name));
  for(const card of shuffle(s.order)){
   s=await p.state();if(s.turn!==turn||s.over)break;
   const own=s.hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);
   s=await p.state();if(s.selected!==card.key)continue;
   const persons=s.hits.filter(h=>h.kind==='person'),items=s.hits.filter(h=>h.kind==='item');
   let aimed=false;
   for(const t of [...persons.filter(x=>!x.id.endsWith(s.me)),...persons,...items,...items]){
    const h=(await p.state()).hits.find(x=>x.id===t.id);if(!h)continue;
    if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}
    await tap(h);if((await p.state()).target){aimed=true;break;}}
   if(!aimed){await cancel();continue;}
   s=await p.state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await cancel();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await cancel();continue;}
   const before=p.moves;await page.getByTestId('confirm').click();
   s=await p.wait(x=>x.over||x.turn!==turn||x.phase==='pending'||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(s.phase==='choose'&&s.message.startsWith('Rifiutata')&&s.turn===turn){await cancel();continue;}
   assert.equal(p.moves-before,1,`${p.name}: exactly one SEND per confirmation`);sent=true;p.turns++;break;
  }
  if(!sent&&!(await p.state()).over)throw new Error(`${p.name}: no playable card at turn ${turn}`);
  await p.wait(x=>x.over||x.turn!==turn||x.message.startsWith('Sei fuori'),70000,'turn resolved');
 }
 throw new Error(`${p.name}: game did not end`);
}

// Views seen by one account: own hand an array, the other's a number, and nothing else of the other hand.
function checkPrivacy(me,other,hands){
 const views=me.received.filter(f=>f.command==='MESSAGE'&&/\/user\/queue\/game\/[^/]+\/view$/.test(f.headers.destination)).map(f=>JSON.parse(f.body));
 assert.ok(views.length>=3,`${me.name}: views captured (${views.length})`);
 const onlyOther=[...other.hand].filter(n=>!me.hand.has(n));
 for(const v of views){
  assert.ok(Array.isArray(v.players[me.user].cardsInHand),`${me.name}: own hand is an array`);
  assert.equal(typeof v.players[other.user].cardsInHand,'number',`${me.name}: the other hand is only a count`);
  const rest=JSON.parse(JSON.stringify(v));delete rest.resolvedMoves;delete rest.pendingMove;delete rest.timeBasedEffects;
  for(const pl of Object.values(rest.players))delete pl.character;
  // The own hand array is the viewer's own (a card drawn on the last turn was never seen by the UI loop): not a leak.
  delete rest.players[me.user].cardsInHand;
  const text=JSON.stringify(rest);
  for(const n of onlyOther)assert.ok(!text.includes(JSON.stringify(n)),`${me.name}: ${n} (only in ${other.name}'s hand) leaked in a view`);
 }
 return {views:views.length,ownHandArray:true,otherHandNumber:true,otherOnlyNames:onlyOther.length,leaks:0};
}

const A=await join('A');
const n0=await A.count();
const B=await join('B');
// 1. Presence: B appears for A with the count up by one, and the page lists devBob.
await A.page.waitForFunction(n=>Number(document.querySelector('[data-testid=presence-count]').textContent)>n,n0,{timeout:10000});
await A.page.getByLabel('Righe').selectOption('20');
assert.ok((await A.rows()).some(t=>t.startsWith('devBob')),'A sees devBob');
const n1=await A.count();assert.equal(n1,n0+1);
evidence.checks.presenceAppears={before:n0,after:n1};
await A.page.getByRole('button',{name:/Giocatore/}).click();
const desc=(await A.rows()).map(t=>t.replace(' (tu)','').toLowerCase());assert.deepEqual(desc,[...desc].sort((x,y)=>y.localeCompare(x,'it')),'sorted descending by name');
evidence.checks.presenceSort='descending by name after a second click on the active column';
await A.shot('01-hub');

// 2. Leaving the queue: ACK, buttons usable again; then B alone waits and leaves as well.
await pickMode(A,'Uno contro uno');await A.page.getByTestId('quick').click();
await A.page.getByTestId('waiting').waitFor({timeout:10000});await A.page.getByTestId('leave-queue').waitFor();
await A.page.waitForFunction(()=>document.querySelector('[data-testid=waiting]').textContent.includes('altro giocatore'));
await A.page.waitForTimeout(800);await A.shot('02-waiting');
await A.page.getByTestId('leave-queue').click();
await A.page.getByTestId('quick').waitFor({timeout:10000});
assert.ok(A.ack('/user/queue/session/queue/leave'),'A received the leave ACK');
assert.ok(await A.page.getByTestId('quick').isEnabled()&&await A.page.getByRole('button',{name:'Esci',exact:true}).isEnabled(),'buttons active again');
assert.equal(await A.page.getByTestId('waiting').count(),0);
evidence.checks.queueExitA={ack:true,hubButtonsEnabled:true};
await pickMode(B,'Uno contro uno');await B.page.getByTestId('quick').click();
await B.page.getByTestId('waiting').waitFor({timeout:10000});await B.page.waitForTimeout(2500);
assert.equal(await B.state(),null,'B alone: no game started');
assert.ok(!B.received.some(f=>/quick\/1v1\/ready$/.test(f.headers.destination||'')),'no ready for B alone');
await B.page.getByTestId('leave-queue').click();await B.page.getByTestId('quick').waitFor({timeout:10000});
assert.ok(B.ack('/user/queue/session/queue/leave'));
evidence.checks.queueExitB={aloneWaitedWithoutGame:true,ack:true};

// 3. Both queue for 1v1: same game, played to the outcome; private views.
for(const p of [A,B])await pickMode(p,'Uno contro uno');
await A.page.getByTestId('quick').click();await A.page.waitForTimeout(500);await B.page.getByTestId('quick').click();
const [sa,sb]=await Promise.all([A,B].map(p=>p.wait(x=>x&&x.hits.some(h=>h.id.startsWith('person-')),30000,'1v1 table')));
const gameId=p=>p.received.filter(f=>f.command==='MESSAGE'&&/quick\/1v1\/ready$/.test(f.headers.destination)).at(-1)?.body;
assert.ok(gameId(A)&&gameId(A)===gameId(B),'same gameId');evidence.checks.sameGame=true;
assert.equal(sa.me,'devAlice');assert.equal(sb.me,'devBob');
await A.shot('03-table');
const [ea,eb]=await Promise.all([playOut(A),playOut(B)]);
evidence.checks.game1={a:ea.message,b:eb.message,turnsA:A.turns,turnsB:B.turns,gameId:gameId(A)};
evidence.checks.privacy={A:checkPrivacy(A,B),B:checkPrivacy(B,A)};
await A.shot('04-outcome');

// 4. "New game" repeats 1v1 for both; then A drops, a second socket of devAlice is refused, A rejoins and leaves.
await Promise.all([A,B].map(p=>p.page.getByTestId('again').click()));
await Promise.all([A,B].map(p=>p.wait(x=>x&&!x.over&&x.hits.some(h=>h.id.startsWith('person-')),30000,'second 1v1 table')));
const second=gameId(A);assert.ok(second&&second!==evidence.checks.game1.gameId&&second===gameId(B),'a new 1v1 game for both');
evidence.checks.newGameRepeatsMode={firstGame:evidence.checks.game1.gameId,secondGame:second,queue:'quick/1v1'};
await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Strumenti'}).click();await A.page.getByRole('button',{name:'Simula disconnessione'}).click();
await A.page.getByRole('button',{name:'Rientra'}).waitFor({timeout:10000});
const C=await (await browser.newContext()).newPage();await C.goto(`${url}#/accedi`);
const refused=await C.evaluate(({user,password})=>new Promise(resolve=>{
 const ws=new WebSocket(`ws://${location.host}/ws/websocket`),got=[];let timer=setTimeout(()=>{ws.close();resolve({got,timeout:true});},8000);
 const send=(command,headers,body='')=>ws.send(`${command}\n${Object.entries(headers).map(([k,v])=>`${k}:${v}`).join('\n')}\n\n${body}\0`);
 ws.onopen=()=>send('CONNECT',{'accept-version':'1.2',login:user,passcode:password,'heart-beat':'0,0'});
 ws.onmessage=e=>{for(const raw of String(e.data).split('\0')){if(raw.startsWith('CONNECTED'))send('SUBSCRIBE',{id:'e',destination:'/user/queue/game/error',receipt:'r1'});
  else if(raw.startsWith('RECEIPT'))send('SEND',{destination:'/app/game/quick/1v1/join','content-type':'text/plain'},user);
  else if(raw.startsWith('MESSAGE')){got.push(raw.split('\n\n').slice(1).join('\n\n'));clearTimeout(timer);ws.close();resolve({got});}}};
 ws.onerror=()=>resolve({got,error:true});
}),accounts.A);
await C.context().close();
assert.ok(refused.got?.length,`join refused on game/error: ${JSON.stringify(refused)}`);
evidence.checks.joinRefusedWhileResumable={channel:'/user/queue/game/error',message:refused.got[0],note:'raw STOMP client of the same account while its client is dropped; the hub handling of this message is covered by the session unit test'};
await A.page.getByRole('button',{name:'Rientra'}).click();
await A.page.locator('.overlay').waitFor({state:'detached',timeout:15000});
// A forfeits from the menu: B wins and returns to the hub.
await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Abbandona la partita'}).click();await A.page.getByRole('button',{name:'Sì, abbandona'}).click();
await A.page.getByTestId('quick').waitFor({timeout:15000});
const won=await B.wait(x=>x&&x.over,20000,'B sees the forfeit');assert.equal(won.winner,'devBob');
evidence.checks.forfeit={winner:won.winner};
await B.page.getByRole('button',{name:'Torna all’hub'}).click();await B.page.getByTestId('quick').waitFor({timeout:15000});

// 5. B logs out: A sees B disappear and the count drop.
await B.page.getByRole('button',{name:'Esci',exact:true}).click();await B.page.getByTestId('home').waitFor({timeout:10000});
await A.page.waitForFunction(()=>![...document.querySelectorAll('.presence tbody td:first-child')].some(td=>td.textContent.startsWith('devBob')),null,{timeout:10000});
await A.page.getByLabel('Righe').selectOption('20');
const n2=await A.count();assert.equal(n2,n0);
evidence.checks.presenceDisappears={count:n2};
await A.page.getByRole('button',{name:'Esci',exact:true}).click();
assert.deepEqual(evidence.errors,[],'no page errors');
await writeFile(`${out}/modes${tag}.json`,JSON.stringify(evidence,null,1));
console.log(JSON.stringify(evidence.checks,null,1));
await browser.close();

// C2b-2 end-to-end check against the REAL server: lifecycle of 1v1 games with two accounts.
// The script starts the server itself on a temporary database (D12: the local data is never touched),
// stops and restarts it for the restart receipt, and stops it at the end. Waits of 30 s are real.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';

const repo=resolve(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c2/c2b-2';
const accounts={A:{user:'devAlice',password:'local-alice'},B:{user:'devBob',password:'local-bob'}};
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=process.env.BM_VIEWPORT?`-${process.env.BM_VIEWPORT}`:'';
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright, two contexts) against the local server started by this script on a temporary database; real 30 s waits; not a physical device',checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data));};

// --- Server on a temporary database (same command as scripts/dev.ps1 -Task Server -SeedAccounts) ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-lifecycle-'));
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
// STOMP frames inside SockJS frames: received a["MESSAGE\n..."], sent ["SEND\n..."]
const stompFrames=payload=>{let s=String(payload);if(s.startsWith('a['))s=s.slice(1);else if(!s.startsWith('['))return[];try{return JSON.parse(s).map(raw=>{const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');return{at:Date.now(),command:lines[0],headers:Object.fromEntries(lines.slice(1).map(l=>[l.slice(0,l.indexOf(':')),l.slice(l.indexOf(':')+1)])),body:rest.join('\n\n').replace(/\u0000$/,'')};});}catch{return[];}};

async function open(name){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();
 const p={name,user,password,page,context,sent:[],received:[]};
 page.on('pageerror',e=>evidence.errors.push(`${name}: ${e}`));
 page.on('websocket',ws=>{ws.on('framesent',f=>p.sent.push(...stompFrames(f.payload)));ws.on('framereceived',f=>p.received.push(...stompFrames(f.payload)));});
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/lifecycle-${n}${tag}.jpg`,type:'jpeg',quality:70});
 p.views=()=>p.received.filter(f=>f.command==='MESSAGE'&&/\/user\/queue\/game\/[^/]+\/view$/.test(f.headers.destination)).map(f=>JSON.parse(f.body));
 p.lastResume=()=>JSON.parse(p.received.filter(f=>f.command==='MESSAGE'&&f.headers.destination==='/user/queue/session/resume').at(-1).body);
 p.sends=(from=0)=>p.sent.slice(from).filter(f=>f.command==='SEND').map(f=>f.headers.destination);
 p.text=async sel=>(await page.locator(sel).first().innerText()).replace(/\s+/g,' ').trim();
 return p;
}
async function login(p,{leftover=true}={}){
 const {page}=p;
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill(p.user);await page.getByLabel('Password').fill(p.password);
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await page.waitForFunction(()=>document.querySelector('[data-testid=quick]')||window.__bm,null,{timeout:15000});
 if(leftover&&await page.evaluate(()=>!!window.__bm)){
  const s=await p.state();evidence.checks[`leftover${p.name}${Object.keys(evidence.checks).length}`]={over:s.over};
  if(s.over)await page.getByRole('button',{name:'Torna all’hub'}).click();
  else{await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
  await page.getByTestId('quick').waitFor({timeout:15000});}
}
const pickMode=async(p,label)=>{await p.page.getByRole('radio',{name:label}).click();};
const table=p=>p.wait(x=>x&&!x.over&&x.hits.some(h=>h.id.startsWith('person-')),30000,'table');
const readyId=p=>p.received.filter(f=>f.command==='MESSAGE'&&/quick\/1v(1|Com)\/ready$/.test(f.headers.destination)).at(-1)?.body;
async function duel(A,B){
 for(const p of [A,B])await pickMode(p,'Uno contro uno');
 await A.page.getByTestId('quick').click();await A.page.waitForTimeout(400);await B.page.getByTestId('quick').click();
 await Promise.all([table(A),table(B)]);
 const id=readyId(A);assert.ok(id&&id===readyId(B),'same gameId');return id;
}
// One move through the UI (card, target, discard if bound, ✓); the server decides legality.
async function playOne(p){
 const {page}=p,tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:{x:h.x,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);},esc=()=>page.keyboard.press('Escape');
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
  const r=await p.wait(x=>x.phase==='pending'||x.turn!==s.turn||x.over||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  assert.equal(moves()-before,1,`${p.name}: one SEND per confirmation`);
  if(r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
  return card.name;
 }
 throw new Error(`${p.name}: no playable card`);
}
const drop=async p=>{await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Strumenti'}).click();await p.page.getByRole('button',{name:'Simula disconnessione'}).click();await p.page.getByRole('button',{name:'Rientra'}).waitFor({timeout:10000});return Date.now();};
const rejoin=async p=>{await p.page.getByRole('button',{name:'Rientra'}).click();await p.page.locator('.overlay').waitFor({state:'detached',timeout:15000});};
const toHub=async p=>{await p.page.getByRole('button',{name:'Torna all’hub'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});};
const clockText=async p=>(await p.page.locator('.clock:not(.away)').count())?p.text('.clock:not(.away)'):null;
const hubNotices=async p=>p.page.locator('.hub .notice').allInnerTexts();

try{
 await startServer();step('server',{database:'temporary',jar});
 const A=await open('A'),B=await open('B');
 await login(A);await login(B);

 // 1. A sends, B does not: at the 30 s deadline B loses for time and A wins; HEALTH stays the view's.
 const g1=await duel(A,B),t1=Date.now();
 const clockB0=await clockText(B);
 const card1=await playOne(A);
 const clockA=await clockText(A);
 await B.page.waitForTimeout(12000);const clockB1=await clockText(B);await B.shot('01-clock');
 const lastB=B.views().filter(v=>v.gameId===g1&&!v.over).at(-1);
 const endB=await B.wait(x=>x&&x.over,40000,'move timeout');const endA=await A.wait(x=>x&&x.over,10000,'A sees the outcome');
 const overB=B.views().find(v=>v.gameId===g1&&v.over);
 assert.equal(overB.winner,'devAlice');assert.equal(overB.forfeits.devBob,'move timeout');assert.equal(endA.winner,'devAlice');
 for(const id of ['devAlice','devBob'])assert.equal(overB.players[id].character.resources.HEALTH,lastB.players[id].character.resources.HEALTH,`${id} HEALTH unchanged by the timeout`);
 const textA1=await A.text('.outcome'),textB1=await B.text('.outcome');
 assert.match(textA1,/Hai vinto/);assert.match(textA1,/devBob non ha mosso entro 30 secondi/);
 assert.match(textB1,/Hai perso/);assert.match(textB1,/Non hai mosso entro 30 secondi/);
 await A.shot('02-timeout-win');await B.shot('03-timeout-loss');
 step('moveTimeout',{gameId:g1,cardA:card1,clockAAfterSend:clockA,clockB:[clockB0,clockB1],secondsToOutcome:Math.round((Date.now()-t1)/1000),outcomeReason:overB.outcomeReason,forfeits:overB.forfeits,winner:overB.winner,health:Object.fromEntries(Object.entries(overB.players).map(([k,v])=>[k,v.character.resources.HEALTH])),textA:textA1,textB:textB1});
 await toHub(A);await toHub(B);
 assert.deepEqual(await hubNotices(A),[],'no stale notice in the hub');

 // 2. Nobody sends: draw for simultaneous deadlines.
 const g2=await duel(A,B);
 await Promise.all([A.wait(x=>x&&x.over,45000,'draw A'),B.wait(x=>x&&x.over,45000,'draw B')]);
 const over2=A.views().find(v=>v.gameId===g2&&v.over),text2=await A.text('.outcome'),text2B=await B.text('.outcome');
 assert.equal(over2.winner,'NONE');assert.match(text2,/Pareggio/);assert.match(text2,/Tempo scaduto per tutti/);assert.match(text2B,/Pareggio/);
 await A.shot('04-draw');
 step('simultaneousDeadlines',{gameId:g2,winner:over2.winner,outcomeReason:over2.outcomeReason,forfeits:over2.forfeits,textA:text2,textB:text2B});
 await toHub(A);await toHub(B);

 // 3. A sends, drops, rejoins within 30 s: same game, same pending, zero move SEND after the rejoin.
 const g3=await duel(A,B);
 const card3=await playOne(A);await A.wait(x=>x.phase==='pending',10000,'pending before the drop');
 await drop(A);await A.page.waitForTimeout(3000);
 const awayB=await B.page.locator('.clock.away').allInnerTexts();await B.shot('05-away');
 const mark3=A.sent.length;await rejoin(A);
 const back=await A.wait(x=>x&&x.phase==='pending',10000,'pending after rejoin');
 const resume3=A.lastResume();
 assert.equal(resume3.gameId,g3);assert.equal(resume3.status,'resumed');assert.equal(resume3.view.pendingMove?.playedCardName,card3);
 const after3=A.sends(mark3);
 assert.equal(after3.filter(d=>d.endsWith('/move')).length,0,'zero move SEND after the rejoin');
 step('rejoinInTime',{gameId:g3,pending:resume3.view.pendingMove.playedCardName,phase:back.phase,sendsAfterRejoin:after3,awayShownToB:awayB});

 // 4. Next turn: A sends and drops, then B sends; A stays out past 30 s and forfeits; B wins.
 await playOne(B);
 await Promise.all([A,B].map(p=>p.wait(x=>x&&x.turn>0&&x.phase==='choose',20000,'turn 2')));
 await playOne(A);const dropped=await drop(A);
 await B.wait(x=>x&&x.phase==='choose',10000,'B can choose');const awayB4=await B.page.locator('.clock.away').allInnerTexts();
 await playOne(B);
 await B.wait(x=>x&&x.over,50000,'reconnect timeout');
 const v4=B.views().find(v=>v.gameId===g3&&v.over);
 assert.equal(v4.winner,'devBob');assert.equal(v4.forfeits.devAlice,'reconnect timeout');
 await A.page.waitForTimeout(Math.max(0,dropped+31000-Date.now()));
 const mark4=A.sent.length;await rejoin(A);
 const lost4=await A.wait(x=>x&&x.over,10000,'A sees its forfeit');
 const resume4=A.lastResume(),text4=await A.text('.outcome'),text4B=await B.text('.outcome');
 assert.equal(resume4.status,'finished');assert.match(text4,/Hai perso/);assert.match(text4,/Non sei rientrato entro 30 secondi/);assert.match(text4B,/devAlice non è rientrato entro 30 secondi/);
 const after4=A.sent.slice(mark4).filter(f=>f.command==='SUBSCRIBE'||f.command==='SEND').map(f=>`${f.command} ${f.headers.destination}`);
 assert.ok(!after4.some(x=>x.includes(g3)),'nothing towards the finished game before leaving it');
 await A.shot('06-late-rejoin');
 await toHub(A);const notices4=await hubNotices(A);assert.deepEqual(notices4,[],'no stale rejoin notice');
 step('rejoinLate',{gameId:g3,secondsOut:Math.round((Date.now()-dropped)/1000),awayShownToB:awayB4,winner:v4.winner,forfeits:v4.forfeits,outcomeReason:v4.outcomeReason,resumeStatus:resume4.status,textA:text4,textB:text4B,framesAfterRejoin:after4,hubNotices:notices4});
 await toHub(B);

 // 5. A abandons from the menu: ACK, forfeit, hub; a second leave produces no other outcome.
 const g5=await duel(A,B);
 await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Abbandona la partita'}).click();await A.page.getByRole('button',{name:'Sì, abbandona'}).click();
 await A.page.getByTestId('quick').waitFor({timeout:15000});
 const ack5=A.received.some(f=>f.command==='MESSAGE'&&f.headers.destination===`/user/queue/game/${g5}/leave`);assert.ok(ack5,'leave ACK');
 assert.equal(A.sends().filter(d=>d===`/app/game/${g5}/devAlice/leave`).length,1,'one leave');
 await B.wait(x=>x&&x.over,15000,'B sees the leave');
 const v5=B.views().filter(v=>v.gameId===g5&&v.over),text5=await B.text('.outcome');
 assert.equal(v5[0].winner,'devBob');assert.equal(v5[0].forfeits.devAlice,'leave');assert.match(text5,/devAlice ha abbandonato/);
 // A second leave of devAlice from a raw STOMP socket after logging out: the server answer and B's outcome.
 await A.page.getByRole('button',{name:'Esci',exact:true}).click();await A.page.getByTestId('home').waitFor({timeout:10000});
 const raw=await A.page.evaluate(({user,password,game})=>new Promise(resolve=>{
  const ws=new WebSocket(`ws://${location.host}/ws/websocket`),got=[];let receipts=0,closed=false;
  const finish=why=>{if(closed)return;closed=true;try{ws.close();}catch{}resolve({got,why});};
  const send=(command,headers,body='')=>ws.send(`${command}\n${Object.entries(headers).map(([k,v])=>`${k}:${v}`).join('\n')}\n\n${body}\0`);
  ws.onopen=()=>send('CONNECT',{'accept-version':'1.2',login:user,passcode:password,'heart-beat':'0,0'});
  ws.onmessage=e=>{for(const f of String(e.data).split('\0').filter(Boolean)){
   if(f.startsWith('CONNECTED')){send('SUBSCRIBE',{id:'l',destination:`/user/queue/game/${game}/leave`,receipt:'r1'});send('SUBSCRIBE',{id:'r',destination:'/user/queue/session/resume',receipt:'r2'});}
   else if(f.startsWith('RECEIPT')&&++receipts===2){send('SEND',{destination:`/app/game/${game}/${user}/leave`});setTimeout(()=>send('SEND',{destination:'/app/session/resume'}),1500);setTimeout(()=>finish('done'),4000);}
   else if(f.startsWith('MESSAGE')||f.startsWith('ERROR'))got.push(f.replace(/\n\n/,' | ').slice(0,300));}};
  ws.onclose=()=>finish('closed');ws.onerror=()=>finish('error');
 }),{...accounts.A,game:g5});
 await B.page.waitForTimeout(1500);
 const v5b=B.views().filter(v=>v.gameId===g5&&v.over);
 assert.ok(v5b.every(v=>v.winner==='devBob'&&JSON.stringify(v.forfeits)===JSON.stringify(v5[0].forfeits)),'one outcome only');
 await B.shot('07-leave');
 step('leave',{gameId:g5,ack:ack5,leaveSends:1,winner:v5[0].winner,forfeits:v5[0].forfeits,outcomeReason:v5[0].outcomeReason,textB:text5,secondLeaveRawSocket:raw,overViewsSeenByB:v5b.length,outcomesSeenByB:[...new Set(v5b.map(v=>`${v.winner} ${JSON.stringify(v.forfeits)}`))]});
 await toHub(B);
 await login(A);

 // 6-7. While A plays, a second login of devAlice from another context is refused; then A logs out in game.
 const g6=await duel(A,B);
 const C=await (await browser.newContext({viewport:{width:vw,height:vh}})).newPage();await C.goto(`${url}#/accedi`);
 await C.getByLabel('Nome').fill(accounts.A.user);await C.getByLabel('Password').fill(accounts.A.password);await C.getByRole('button',{name:'Siediti al tavolo'}).click();
 const refused=(await C.locator('.problem').innerText({timeout:15000})).trim();
 assert.match(refused,/già collegato altrove/);assert.ok(!(await A.state()).over,'the first session is still playing');
 await C.screenshot({path:`${out}/screens/lifecycle-08-second-session${tag}.jpg`,type:'jpeg',quality:70});await C.context().close();
 step('secondSession',{message:refused,firstStillPlaying:true});
 await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Esci dall’account'}).click();
 const confirm6=await A.text('dialog .menu');await A.shot('09-logout-confirm');
 const mark6=A.sent.length;await A.page.getByRole('button',{name:'Sì, esci'}).click();
 await A.page.getByTestId('home').waitFor({timeout:10000});
 const sends6=A.sends(mark6);
 assert.deepEqual(sends6,['/app/session/logout'],'only the logout after the confirmation');
 await B.wait(x=>x&&x.over,40000,'B sees the logout forfeit');
 const v6=B.views().find(v=>v.gameId===g6&&v.over),text6=await B.text('.outcome');
 assert.equal(v6.winner,'devBob');
 await B.shot('10-logout-forfeit');
 step('logoutInGame',{gameId:g6,confirmation:confirm6,sendsAfterConfirm:sends6,winner:v6.winner,forfeits:v6.forfeits,outcomeReason:v6.outcomeReason,textB:text6});
 await toHub(B);await login(A);
 step('afterLogoutLogin',{resume:A.lastResume().status});

 // 8. Restart (D12): a 1v1 in progress, server stopped and restarted; both see the draw receipt in the hub.
 const g8=await duel(A,B);await playOne(A);
 await stopServer();
 await Promise.all([A,B].map(p=>p.page.getByRole('button',{name:'Rientra'}).waitFor({timeout:20000})));
 await A.shot('11-server-down');
 await startServer();
 const markA=A.sent.length,markB=B.sent.length;
 await A.page.getByRole('button',{name:'Rientra'}).click();
 await B.page.getByRole('button',{name:'Esci',exact:true}).click();await login(B,{leftover:false});
 await Promise.all([A,B].map(p=>p.page.getByTestId('quick').waitFor({timeout:20000})));
 const receipts=await Promise.all([A,B].map(hubNotices));
 for(const r of receipts)assert.ok(r.some(t=>t.startsWith('Pareggio — riavvio server')),`receipt in the hub: ${r}`);
 const frames8=[A.sent.slice(markA),B.sent.slice(markB)].map(fs=>fs.filter(f=>f.command==='SUBSCRIBE'||f.command==='SEND').map(f=>`${f.command} ${f.headers.destination}`));
 for(const f of frames8)assert.ok(!f.some(x=>x.includes(g8)),'no SUBSCRIBE/SEND to the old gameId');
 const res8=[A,B].map(p=>p.lastResume());
 for(const r of res8){assert.equal(r.archived,true);assert.equal(r.view,undefined);}
 await A.shot('12-restart-receipt');await B.shot('12-restart-receipt-B');
 step('restart',{gameId:g8,resumeA:res8[0],resumeB:res8[1],hubA:receipts[0],hubB:receipts[1],framesA:frames8[0],framesB:frames8[1],rejoinA:'Rientra',reloginB:'Esci + login'});

 // 9. vsCom regression: a drop longer than 30 s is a forfeit against the computer too.
 await pickMode(A,'Contro il computer');await A.page.getByTestId('quick').click();await table(A);
 const g9=readyId(A);const dropped9=await drop(A);
 await A.page.waitForTimeout(Math.max(0,dropped9+33000-Date.now()));
 await rejoin(A);const s9=await A.wait(x=>x&&x.over,10000,'vsCom forfeit');
 const r9=A.lastResume(),text9=await A.text('.outcome');
 assert.equal(r9.view.forfeits.devAlice,'reconnect timeout');assert.match(text9,/Hai perso/);assert.match(text9,/Non sei rientrato entro 30 secondi/);
 await A.shot('13-vscom-late');
 step('vsComLateRejoin',{gameId:g9,status:r9.status,winner:s9.winner,forfeits:r9.view.forfeits,outcomeReason:r9.view.outcomeReason,text:text9});
 await toHub(A);

 await A.page.getByRole('button',{name:'Esci',exact:true}).click();await B.page.getByRole('button',{name:'Esci',exact:true}).click();
 assert.deepEqual(evidence.errors,[],'no page errors');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);throw e;}
finally{
 await writeFile(`${out}/lifecycle${tag}.json`,JSON.stringify(evidence,null,1));
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
}

// C3-1 end-to-end check against the REAL server: the pure resolution model (src/resolution.ts) on real games.
// C3-4: each sequence animates what the timeline of the facts says (cards, voids, cost tokens, objects, draws, end of
// turn, per-card bars only when the report lines verify) and ends on the view; scenario `humans` measures the 30 s clock.
// C3-4 revision (D13): every card has its beats in order (cost, author close-up, back, flight and impact, target close-up,
// changes) as the scene scheduled them; close-ups stay on the screen and clear of the other seats; plans within the 20 s cap.
// Like VerifyFfa it starts the server itself on a temporary database (the local data is never touched) and stops it
// at the end. Scenarios: quick 1vCom with a drop and rejoin, five-seat FFA with computers, FFA where both humans let
// the clock run out (turn jump), open 1vCom with two synthetic decks saved through the editor (D8).
// At every view the client processed it records the facts of the model (window.__bm.resolutions), the views received
// on the wire and the scene counters, and checks:
//  - model (blocking): the per-seat differences added to the previous view give the new view; jumps, other games and
//    repeated turns carry no difference; the facts do not depend on the server's sentences (D1); objects are linked to
//    a move only through its TARGET_ITEM on the seat they left.
//  - scene (blocking since C3-2): rules 1, 2, 3 and 6 of the C3 plan; every contiguous round with moves plays one
//    sequence that no view interrupts; the static summary of the round is on the table at the next choice; after a
//    jump no sequence, no summary and the line of the resolved turns. Scenario `interrupt`: «Salta effetti», a tap,
//    a card chosen during the sequence (rule 4) and a hidden tab (K5).
// C3-4s: every card of the previous round leaves the middle for its pile (R02), every bound's extra card and every draw flies, every object gone or
// appeared moves with a flight, counted against the facts of the wire views; every label stays readable for LABEL.read ms and no two visible labels overlap.
// Scenarios `info`, `infoFfa`, `infoTouch`: the (i) and the inspection at every round of long games, after every interruption.
// C3-6: scenario `report` reads the dialog «Ultimo turno» on real games (duel and five-seat FFA) and after the turn jump against the wire views: facts first, the server's text
// second and unchanged, the jump described, type size for the screen.
// BM_RECORD=1 also writes the real view pairs used by tests/resolution.test.ts (tests/resolution-views.json).
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
// BM_SERVER_PORT runs the temporary server on another port (with a preview on BM_PORT proxying to it via BM_SERVER).
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';
import assert from 'node:assert/strict';
import {resolve,mismatches,timeline,beats,directionProblems,seatMarks,BEATS,PACE,LABEL} from '../src/resolution.ts';
import {overlap,inside} from '../src/readability.ts';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c3/c3-1';
const accounts={A:{user:'devAlice',password:'local-alice'},B:{user:'devBob',password:'local-bob'}};
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
const only=process.env.BM_SCENARIOS?.split(',');
const recordPath=new URL('../tests/resolution-views.json',import.meta.url);
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright) against the local server started by this script on a temporary database; real 30 s waits; not a physical device',games:{},cases:{},scene:{},checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,700));};

// --- Server on a temporary database (same command as scripts/dev.ps1 -Task Server -SeedAccounts) ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-resolution-'));
const serverPort=process.env.BM_SERVER_PORT??'8080',api=`http://127.0.0.1:${serverPort}`;
let server=null;
async function startServer(){
 const log=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true',`--server.port=${serverPort}`],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 const end=Date.now()+90000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited (${server.exitCode}); log in ${data}`);
  try{const r=await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start in 90 s');
}
async function stopServer(){
 if(!server||server.exitCode!==null)return;
 const gone=new Promise(r=>server.once('exit',r));
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}
 await gone;server=null;
}
if(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error(`port ${serverPort} is in use: stop the other server first`);

// --- Browser helpers ---
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const stompFrames=payload=>{let s=String(payload);if(s.startsWith('a['))s=s.slice(1);else if(!s.startsWith('['))return[];try{return JSON.parse(s).map(raw=>{const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');return{at:Date.now(),command:lines[0],headers:Object.fromEntries(lines.slice(1).map(l=>[l.slice(0,l.indexOf(':')),l.slice(l.indexOf(':')+1)])),body:rest.join('\n\n').replace(/\u0000$/,'')};});}catch{return[];}};
async function open(name){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();
 const p={name,user,password,page,context,sent:[],received:[]};
 page.on('pageerror',e=>evidence.errors.push(`${name}: ${e}`));
 page.on('websocket',ws=>{ws.on('framesent',f=>p.sent.push(...stompFrames(f.payload)));ws.on('framereceived',f=>p.received.push(...stompFrames(f.payload)));});
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.log=()=>page.evaluate(()=>window.__bm?JSON.parse(JSON.stringify(window.__bm.resolutions)):null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/resolution-${n}${tag}.jpg`,type:'jpeg',quality:70});
 p.messages=dest=>p.received.filter(f=>f.command==='MESSAGE'&&(typeof dest==='string'?f.headers.destination===dest:dest.test(f.headers.destination)));
 // Views as they reached the client: game views and the view inside a resume answer, in arrival order.
 p.views=game=>p.received.filter(f=>f.command==='MESSAGE'&&(/\/user\/queue\/game\/[^/]+\/view$/.test(f.headers.destination)||f.headers.destination==='/user/queue/session/resume'))
  .map(f=>{const b=JSON.parse(f.body);return f.headers.destination.endsWith('/resume')?(b.view?{...b.view,__resume:true}:null):b;}).filter(v=>v&&(!game||v.gameId===game));
 p.sends=(from=0)=>p.sent.slice(from).filter(f=>f.command==='SEND').map(f=>f.headers.destination);
 p.text=async sel=>(await page.locator(sel).first().innerText()).replace(/\s+/g,' ').trim();
 return p;
}
async function login(p){
 await p.page.goto(`${url}#/accedi`);
 await p.page.getByLabel('Nome').fill(p.user);await p.page.getByLabel('Password').fill(p.password);
 await p.page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await p.page.getByTestId('quick').waitFor({timeout:15000});
}
const dialogOpen=p=>p.page.evaluate(()=>!!document.querySelector('dialog[open]'));
const readyId=(p,re)=>p.messages(re).at(-1)?.body;
const table=p=>p.wait(x=>x&&x.hits.some(h=>h.kind==='hand'||h.id.startsWith('person-')),30000,'table');
const toHub=async p=>{await p.page.getByRole('button',{name:'Torna all’hub'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});};
const list=async p=>(await p.page.locator('[data-testid=ffa-list] li:not(.free)').allInnerTexts()).map(t=>t.trim());
const waitList=(p,n)=>p.page.waitForFunction(n=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length===n,n,{timeout:10000});
async function joinFfa(p){await p.page.getByRole('radio',{name:'Tutti contro tutti'}).click();await p.page.getByTestId('quick').click();await p.page.getByTestId('ffa-list').waitFor({timeout:10000});}
async function addComputers(p,n){for(let i=0;i<n;i++){const before=(await list(p)).length;await p.page.getByTestId('add-computer').click();if(before+1<5)await waitList(p,before+1);}}

// One move through the UI, as in VerifyFfa; `prefer` orders the hand (synthetic decks aim at the rare cases).
async function playOne(p,prefer,confirm){
 const {page}=p,esc=()=>page.keyboard.press('Escape');
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen(p)){await esc();await page.waitForTimeout(60);}};
 const moves=()=>p.sends().filter(d=>/\/app\/game\/[^/]+\/move$/.test(d)).length;
 const start=await p.state();let order=start.order;
 if(prefer){const score=prefer(start);order=[...order].sort((a,b)=>score(b.name)-score(a.name));}
 for(const card of order){
  const own=(await p.state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await p.state()).selected!==card.key)continue;
  let aimed=false;
  // Object targets first: a card that takes an object aims it, the others ignore it.
  const targets=(await p.state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
  for(const t of targets){if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await p.state()).hits.find(h=>h.id===t.id);if(!now)continue;await tap(now);if((await p.state()).target){aimed=true;break;}}
  if(!aimed){await esc();continue;}
  const s=await p.state();
  if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
  const before=moves();if(confirm)await confirm(card);else await page.getByTestId('confirm').click();
  const r=await p.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  assert.equal(moves()-before,1,`${p.name}: one SEND per confirmation`);
  if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
  return card.name;
 }
 throw new Error(`${p.name}: no playable card`);
}

// Hidden tab: a real one (another page in front) when the browser reports it, otherwise emulated by overriding
// document.hidden/visibilityState and dispatching visibilitychange (declared in the evidence).
let hiddenMode=null;
async function setHidden(p,on){
 if(hiddenMode===null){const other=await p.context.newPage();await other.bringToFront();await p.page.waitForTimeout(300);
  hiddenMode=await p.page.evaluate(()=>document.visibilityState)==='hidden'?'real':'emulated';p.cover=other;if(hiddenMode==='emulated'){await other.close();p.cover=null;}}
 if(hiddenMode==='real'){if(on){if(!p.cover||p.cover.isClosed())p.cover=await p.context.newPage();await p.cover.bringToFront();}else{await p.page.bringToFront();await p.cover?.close();p.cover=null;}}
 else await p.page.evaluate(on=>{if(on){Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});}
  else{delete document.hidden;delete document.visibilityState;}document.dispatchEvent(new Event('visibilitychange'));},on);
 await p.page.waitForTimeout(200);return hiddenMode;
}

// --- Rule 2 read-back: the scene shows exactly the last view (own board, opponent hand backs, objects, own hand) ---
function finalState(s,v){
 const problems=[];if(!v)return problems;
 const mine=v.players[s.me];
 if(s.readout.board)for(const [k,val] of Object.entries(s.readout.board.values))if(mine.character.resources[k]!==val)problems.push(`board ${k} ${val}≠${mine.character.resources[k]}`);
 for(const [id,p] of Object.entries(v.players)){
  if(id!==s.me&&typeof p.cardsInHand==='number'&&s.backs[id]!==undefined&&s.backs[id]!==p.cardsInHand)problems.push(`${id} backs ${s.backs[id]}≠${p.cardsInHand}`);
  const items=s.hits.filter(h=>h.kind==='item'&&h.target.owner===id).length;if(!p.character.dead&&!v.forfeits[id]&&items!==p.character.items.length)problems.push(`${id} objects ${items}≠${p.character.items.length}`);
 }
 const hand=[...s.order.map(c=>c.name)].sort().join('|'),view=[...mine.cardsInHand.map(c=>c.name)].sort().join('|');if(!s.eliminated&&hand!==view)problems.push('own hand');
 // C3-4: every board shows the view again once the sequence is over (the steps of the round end there).
 for(const [id,p] of Object.entries(v.players)){const shown=s.readout.boards?.[id];if(!shown)continue;
  for(const k of new Set([...Object.keys(shown),...Object.keys(p.character.resources)]))if((shown[k]??0)!==(p.character.resources[k]??0))problems.push(`${id} board ${k} ${shown[k]}≠${p.character.resources[k]}`);}
 return problems;
}

// --- Fixture recording (BM_RECORD=1): real view pairs, card objects trimmed to the fields the model reads ---
const recorded=process.env.BM_RECORD==='1'?(existsSync(recordPath)?JSON.parse(await readFile(recordPath,'utf8')):{source:'',cases:{}}):null;
const slimCard=c=>({name:c.name,bindingName:c.bindingName,item:c.item,basicAction:c.basicAction,lastResort:c.lastResort,characterBound:c.characterBound,priority:c.priority,canTarget:c.canTarget,cost:c.cost});
function slimView(v){
 const x=structuredClone(v);delete x.__resume;
 for(const p of Object.values(x.players)){if(Array.isArray(p.cardsInHand))p.cardsInHand=p.cardsInHand.map(slimCard);p.character.items=p.character.items.map(slimCard);
  p.character.statuses=p.character.statuses.map(s=>({name:s.name,type:s.type,flow:s.flow,impactedProperty:s.impactedProperty,lastsForTurns:s.lastsForTurns,equip:s.equip,singleUse:s.singleUse}));
  p.character.timers=p.character.timers.map(t=>({name:t.name,timer:t.timer}));}
 return x;
}
function record(name,me,previous,next,note){
 if(!recorded||recorded.cases[name])return;
 recorded.cases[name]={note,me,recordedAt:new Date().toISOString(),viewport:`${vw}x${vh}`,previous:slimView(previous),next:slimView(next)};
 console.log('recorded',name);
}

// --- Per-game analysis of the views and of the facts the client exposed ---
// D1 measurement (owner request after C3-2, not used by the client): do the regular "RESOURCE: a->b (d)" lines of the
// server report, plus nominal costs and end-of-turn lines, give the real difference between the two views?
// sum: totals per seat and resource; chain: each line starts from the value the previous step left (costs first, R04).
// Kept as written for the measurement (unanchored match): C3-4 compares the client's anchored reading with it on every round.
const LINE=/(HEALTH|ALERTNESS|VIOLENCE|TOXICITY|ALCOHOL): (-?\d+)->(-?\d+) \((-?\d+)\)/;
function reportCheck(prev,next,catalog){
 const cost=new Map(catalog.map(c=>[c.name,c.cost]));const val={},sum={},issues=[];let lines=0,costs=0;
 for(const [id,p] of Object.entries(prev.players)){val[id]={...p.character.resources};sum[id]={};}
 const add=(id,k,d)=>{sum[id][k]=(sum[id][k]??0)+d;};
 const step=(id,line,where)=>{const m=line.match(LINE);if(!m)return;lines++;const [,k,a,b,d]=m;const A=+a,B=+b;if(B-A!==+d)issues.push(`${where}: delta text`);
  if(!(id in val)){issues.push(`${where}: unknown seat`);return;}
  if((val[id][k]??0)!==A)issues.push(`${where}: ${id} ${k} chain ${val[id][k]??0}≠${A}`);val[id][k]=B;add(id,k,B-A);};
 let unknownCost=0;
 for(const m of next.resolvedMoves){const c=cost.get(m.playedCardName);if(!c){unknownCost++;continue;}
  for(const [k,v] of Object.entries(c)){if(v)costs++;val[m.playerId][k]=(val[m.playerId][k]??0)-v;add(m.playerId,k,-v);}}
 next.resolvedMoves.forEach((m,i)=>{const target=m.targetId==='SELF'?m.playerId:m.targetId;
  for(const line of m.moveReport?.SELF??[])step(m.playerId,line,`move ${i} SELF`);
  for(const line of m.moveReport?.OPPONENT??[])step(target,line,`move ${i} OPPONENT`);});
 for(const [id,lines] of Object.entries(next.timeBasedEffects??{}))for(const line of lines)step(id,line,`end ${id}`);
 const sumIssues=[];
 for(const [id,p] of Object.entries(next.players))for(const k of new Set([...Object.keys(p.character.resources),...Object.keys(prev.players[id]?.character.resources??{})])){
  const real=(p.character.resources[k]??0)-(prev.players[id]?.character.resources[k]??0);if((sum[id]?.[k]??0)!==real)sumIssues.push(`${id} ${k}: report ${sum[id]?.[k]??0} vs view ${real}`);}
 return {sumOk:!sumIssues.length,chainOk:!issues.length&&!sumIssues.length,unknownCost,steps:costs+lines,sumIssues,chainIssues:issues,moves:next.resolvedMoves.map(m=>m.playedCardName)};
}
const reports=[];

const cases={};const seen=(name,where)=>{(cases[name]??=[]).push(where);};
const scramble=v=>{const x=structuredClone(v);for(const m of x.resolvedMoves)for(const k of Object.keys(m.moveReport??{}))m.moveReport[k]=m.moveReport[k].map(()=>'∅');for(const k of Object.keys(x.timeBasedEffects??{}))x.timeBasedEffects[k]=x.timeBasedEffects[k].map(()=>'∅');return x;};
const strip=f=>JSON.parse(JSON.stringify(f));
// Paths where two JSON values differ (first levels only), for the evidence.
const paths=(a,b,at='')=>{if(JSON.stringify(a)===JSON.stringify(b))return[];if(!a||!b||typeof a!=='object'||typeof b!=='object'||at.split('.').length>5)return[at||'.'];return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>paths(a[k],b[k],`${at}.${k}`));};
function analyse(label,p,game,log,catalog,{expectSequences=true,quiet=new Set()}={}){
 const views=p.views(game),me=p.user;
 // Distinct turns as received (two views per round are expected; only pendingMove may differ).
 const byTurn=new Map();for(const v of views){if(!byTurn.has(v.turn))byTurn.set(v.turn,[]);byTurn.get(v.turn).push(v);}
 const turns=[...byTurn.keys()].sort((a,b)=>a-b);
 const rows=[],problems=[],repeated=[],timerOrder=new Set(),k6={rounds:0,health:0,otherResources:0,objects:0,voided:0,endOfTurn:0,draws:0};
 for(let i=1;i<turns.length;i++){
  const prev=byTurn.get(turns[i-1]).at(-1),next=byTurn.get(turns[i])[0];
  const facts=resolve(prev,next,me,catalog),again=resolve(scramble(prev),scramble(next),me,catalog);
  // D1: the facts are the same when every server sentence is replaced.
  if(JSON.stringify(facts)!==JSON.stringify(again))problems.push(`turn ${next.turn}: facts depend on server text`);
  if(next.turn-prev.turn===1){if(facts.relation!=='next'||!facts.seats)problems.push(`turn ${next.turn}: contiguous not recognised`);}
  else if(facts.relation!=='jump'||facts.seats)problems.push(`turn ${next.turn}: jump of ${next.turn-prev.turn} not recognised`);
  const sum=mismatches(prev,next,facts);if(sum.length)problems.push(`turn ${next.turn}: ${sum.join('; ')}`);
  if(facts.moves.length!==next.resolvedMoves.length||facts.moves.some((m,j)=>m.author!==next.resolvedMoves[j].playerId||m.card!==next.resolvedMoves[j].playedCardName))problems.push(`turn ${next.turn}: moves not in server order`);
  for(const m of facts.moves)if(m.itemGone&&!facts.seats?.[m.item.owner]?.itemsGone.includes(m.item.name))problems.push(`turn ${next.turn}: link without disappearance`);
  // Repeated views of a turn: identical players and resolution, only pendingMove may differ.
  const differ=[...new Set(byTurn.get(turns[i]).flatMap(v=>{const a=structuredClone(v),b=structuredClone(next);for(const x of [a,b]){delete x.pendingMove;delete x.moveDeadlines;delete x.reconnectDeadlines;delete x.__resume;}
   // Observed: the server may list the same timers in another order between views of one turn (not read by the model).
   const before=paths(a,b).length;for(const x of [a,b])for(const pl of Object.values(x.players))pl.character.timers.sort((t,u)=>JSON.stringify(t).localeCompare(JSON.stringify(u)));const after=paths(a,b);if(before&&!after.length)timerOrder.add(next.turn);return after;}))];
  // Server behaviour, not a model fact (a same-turn view has relation 'same' and no difference): recorded, not blocking.
  if(differ.length){repeated.push({turn:next.turn,paths:differ.slice(0,12)});(evidence.repeatedViewDiffs??=[]).push({game:label,turn:next.turn,paths:differ.slice(0,12),views:byTurn.get(turns[i]).map(v=>slimView(v))});}
  // Cases met on the real server (and recorded for the unit tests).
  const where=`${label} T${next.turn}`;
  if(facts.relation==='jump'){seen('jump',where);record(label==='jump'?'jumpAfterForfeits':'jump',me,prev,next,`${label}: turn ${prev.turn} → ${next.turn}`);}
  if(facts.contiguous){
   if(facts.moves.some(m=>m.void)){seen('void',where);record('void',me,prev,next,`${label}: annullata ${facts.moves.filter(m=>m.void).map(m=>m.card)}`);}
   if(facts.moves.some(m=>m.itemGone&&m.author===m.item.owner&&!m.void)){seen('itemConsumed',where);record('itemConsumed',me,prev,next,`${label}: oggetto vicino consumato`);}
   if(facts.moves.some(m=>m.itemGone&&m.author!==m.item.owner)){seen('itemFromOther',where);record('itemFromOther',me,prev,next,`${label}: oggetto altrui sparito con TARGET_ITEM`);}
   if(facts.moves.some(m=>m.item&&!m.itemGone&&!m.void)){seen('itemNamedNotGone',where);record('itemNamedNotGone',me,prev,next,`${label}: TARGET_ITEM senza sparizione`);}
   const own=facts.seats[me];if(own&&own.itemsAppeared.length&&own.deck.before-own.deck.after>(own.handArrived?.length??0)){seen('drawnToTable',where);record('drawnToTable',me,prev,next,`${label}: oggetto pescato sul tavolo`);}
   if(Object.values(facts.seats).some(s=>s.died)){seen('death',where);record('death',me,prev,next,`${label}: morte nel round`);}
   if(facts.moves.some(m=>m.discard)){seen('boundDiscard',where);record('boundDiscard',me,prev,next,`${label}: bound con scarto`);}
   if(facts.endOfTurn.length)seen('endOfTurn',where);
   if(next.over){seen('over',where);record('over',me,prev,next,`${label}: fine partita ${next.winner}`);}
   if(Object.values(facts.seats).some(s=>s.forfeit))seen('forfeit',where);
   // C3-4 scenarios: a move presented by a player who dies in the round still resolves (rule 7); a death at the end of
   // turn whose verified HEALTH line crosses zero; an object chosen and no longer there to take (more claims than losses).
   if(facts.moves.some(m=>facts.seats[m.author]?.died)){seen('deathWithMove',where);record('deathWithMove',me,prev,next,`${label}: morte con mossa già presentata`);}
   const T=timeline(prev,next,facts,catalog);
   if(T.bars==='per-card'&&T.endOfTurn.steps.some(s=>s.resource==='HEALTH'&&s.from>0&&s.to<=0&&facts.seats[s.seat]?.died)){seen('lethalEndOfTurn',where);record('lethalEndOfTurn',me,prev,next,`${label}: fine turno letale`);}
   if(facts.moves.some(m=>m.item&&!m.void&&!m.itemGone&&(prev.players[m.item.owner]?.character.items??[]).some(c=>c.name===m.item.name)&&facts.seats[m.item.owner]?.itemsGone.includes(m.item.name))){seen('itemGoneBefore',where);record('itemGoneBefore',me,prev,next,`${label}: oggetto conteso, sparito per una sola mossa`);}
   seen(T.bars==='per-card'?'barsPerCard':'barsTotal',where);
  }
  if(facts.contiguous){reports.push({game:label,turn:next.turn,...reportCheck(prev,next,catalog)});}
  if(facts.contiguous){const st=Object.values(facts.seats);k6.rounds++;if(st.some(x=>Object.entries(x.resources).some(([k,c])=>k!=='HEALTH'&&c.delta)))k6.otherResources++;if(st.some(x=>x.resources.HEALTH?.delta))k6.health++;
   if(st.some(x=>x.itemsGone.length||x.itemsAppeared.length))k6.objects++;if(facts.moves.some(m=>m.void))k6.voided++;if(facts.endOfTurn.length)k6.endOfTurn++;if(st.some(x=>x.deck.before!==x.deck.after))k6.draws++;}
  rows.push({turn:next.turn,from:prev.turn,relation:facts.relation,views:byTurn.get(turns[i]).length,moves:facts.moves.map(m=>`${m.author}:${m.card}${m.void?' (void)':''}${m.item?` [${m.item.name}${m.itemGone?' gone':''}]`:''}`),
   deltas:facts.seats?Object.fromEntries(Object.entries(facts.seats).map(([id,s])=>[id,Object.fromEntries(Object.entries(s.resources).filter(([,c])=>c.delta).map(([k,c])=>[k,c.delta]))])):null,endOfTurn:facts.endOfTurn,sum:sum.length?sum:'ok'});
 }
 // The client's own facts (window.__bm.resolutions) must agree with the wire views: same relation and seats.
 const client=[];
 let prevScene={sequences:0,cancels:[],aggregateDeltas:0};const perKey={},rules={1:[],2:[],3:[],6:[]},k1=[],k2=[];
 for(const e of log??[]){
  const f=e.facts,s=e.scene??prevScene;
  const started=s.sequences-prevScene.sequences,newCancels=s.cancels.slice(prevScene.cancels.length),deltas=s.aggregateDeltas-prevScene.aggregateDeltas;prevScene=s;
  perKey[f.key]=(perKey[f.key]??0)+started;
  if(newCancels.includes('view'))k1.push(f.key);
  if(f.relation==='jump'||f.relation==='other-game'){if(f.seats)problems.push(`${f.key}: client facts with seats on ${f.relation}`);if(started||deltas){rules[3].push(`${f.key}: ${f.relation} animated (sequence ${started}, deltas ${deltas})`);k2.push(f.key);}}
  if(f.relation==='same'&&started)rules[6].push(`${f.key}: same-turn view started a sequence`);
  if(expectSequences&&f.relation==='next'&&f.moves.length&&e.why==='view'&&!started&&!quiet.has(f.key))rules[1].push(`${f.key}: contiguous round without its sequence`);
  if(f.relation==='next'){const prev=byTurn.get(f.turn-1)?.at(-1),next=byTurn.get(f.turn)?.[0];
   if(prev&&next){const wire=resolve(prev,next,me,catalog);if(JSON.stringify(strip(wire.seats))!==JSON.stringify(strip(f.seats)))problems.push(`${f.key}: client seats differ from wire views`);}}
  client.push({why:e.why,key:f.key,relation:f.relation,sequenceStarted:started,cancels:newCancels,deltas});
 }
 for(const [key,n] of Object.entries(perKey))if(n>1)rules[1].push(`${key}: ${n} sequences`);
 return {rows,problems,client,rules,k1,k2,repeated,timerOrderOnly:[...timerOrder],k6,turns:turns.length,views:views.length};
}

// Plays a game to the outcome (or the own exit), reading rule 2 at each own turn; returns the client log.
async function playToEnd(p,{prefer,shots='game',maxTurns=200,watch=true,onTurn}={}){
 const finals=[],notes=new Set();let watched=false,n=0,noValidMove=null,lastLog=[],lastStats=null;
 while(true){
  const s=await p.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),300000,'next turn');
  if(s.over)break;
  if(s.eliminated){
   if(watch&&await p.page.getByTestId('watch').count()){await p.page.getByTestId('watch').click();watched=true;await p.shot(`${shots}-watching`);
    // Watching: the line of the resolved turns (D4) in the short summary or, at the outcome, on the panel.
    const end=Date.now()+600000;while(Date.now()<end){const t=await p.page.locator('.toast').count()?await p.page.locator('.toast').first().innerText().catch(()=>''):'';if(t)notes.add(t.replace(/\s+/g,' '));if((await p.state()).over)break;await p.page.waitForTimeout(250);}
    const panel=await p.page.locator('[data-testid=round-note]').first().innerText().catch(()=>'');if(panel)notes.add(`panel: ${panel}`);}
   break;}
  finals.push({turn:s.turn,problems:finalState(s,lastView(p,s.turn)),summary:s.summary?{key:s.summary.key,seats:Object.keys(s.summary.seats).length,texts:Object.values(s.summary.seats).map(x=>x.texts.join(' '))}:null,running:s.sequence.running});
  lastLog=await p.log();lastStats=s.stats;
  if(n===2)await p.shot(`${shots}-turn${s.turn}`);
  if(onTurn&&await onTurn(p,s))continue;
  // R03: a human without any valid move cannot pass (known limit of the version): abandon, declared in the evidence.
  try{await playOne(p,prefer);}catch(e){if(!String(e).includes('no playable card'))throw e;
   noValidMove={turn:s.turn,hand:s.order.map(c=>c.name)};await p.shot(`${shots}-no-valid-move`);
   await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();
   await p.page.getByTestId('quick').waitFor({timeout:15000});seen('noValidMove',`T${s.turn}`);return {log:lastLog,stats:lastStats,finals,watched,end:{...s,over:true,winner:'(abbandono R03)'},noValidMove,left:true};}
  n++;
  if(n>maxTurns)throw new Error('too many turns');
  await p.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,300000,'turn resolved');
  // C3-4 revision: the beats of the first card of one sequence (D13: cost, author close-up, flight, target close-up, changes)
  // and the tail, captured while it runs.
  if(n===3){const t0=Date.now(),plan=(await p.state())?.stats.sequencePlans.at(-1);if((await p.state())?.sequence.running&&plan?.pace?.moves.length){const c=plan.pace.moves[0];
   const beats=[...(plan.pace.clear?[['clear',plan.pace.clear.at+plan.pace.clear.dur*.5]]:[]),...(c.cost.dur?[['cost',c.cost.at+c.cost.dur*.6]]:[]),['author',c.author.at+c.author.dur*.6],['flight',c.flight.at+c.flight.dur*.5],['target',c.target.at+c.target.dur*.5],...(c.changes.dur?[['changes',c.changes.at+c.changes.dur*.5]]:[]),...(plan.pace.draws?[['draws',plan.pace.draws.at+plan.pace.draws.dur*.5]]:[]),['tail',plan.total-500]];
   for(const [name,at] of beats){const wait=at-(Date.now()-t0);if(wait>0)await p.page.waitForTimeout(wait);if(!(await p.state())?.sequence.running)break;await p.shot(`${shots}-sequence-${name}`);}}}
  // Let the round's sequence run to its end (up to the 20 s cap, D10), so that its completion is measured.
  await p.wait(x=>!x||!x.sequence?.running,22000,'sequence end').catch(()=>{});
 }
 await p.wait(x=>!x||!x.sequence?.running,22000,'sequence end').catch(()=>{});
 const end=await p.state();
 // D4 on the outcome panel (a death with only computers left is followed by the whole chain at once).
 if(end.over||end.eliminated){const panel=await p.page.locator('[data-testid=round-note]').count()?await p.text('[data-testid=round-note]'):'';if(panel)notes.add(`panel: ${panel}`);}finals.push({turn:end.turn,problems:finalState(end,lastView(p,end.turn)),summary:end.summary?{key:end.summary.key,seats:Object.keys(end.summary.seats).length,texts:Object.values(end.summary.seats).map(x=>x.texts.join(' '))}:null,running:end.sequence.running});
 await p.page.waitForTimeout(300);
 return {log:await p.log(),stats:end.stats,finals,watched,end,noValidMove,notes:[...notes]};
}
const lastView=(p,turn)=>p.views().filter(v=>v.turn===turn).at(-1);
const catalogOf=p=>{const acc=p.messages('/user/queue/account/data').at(-1);return acc?JSON.parse(acc.body).collection?.cards??[]:[];};
// --- C3-6: the dialog «Ultimo turno», read back from the page and checked against the RAW views of the wire (not against the client's own function):
// the facts come first (moves in resolution order, nominal costs from the account catalog, overall changes per seat with before and after, objects gone and
// appeared, eliminations, end of turn), the server's text second and unchanged, a jump of turns said as such, and the type big enough to read without zoom.
const RES_IT={HEALTH:'Salute',ALERTNESS:'Allerta',VIOLENCE:'Violenza',TOXICITY:'Tossicità',ALCOHOL:'Alcol'};
const sgn=n=>`${n>0?'+':'−'}${Math.abs(n)}`;
const label=(p,id,ids)=>{if(id===p.user)return 'Tu';if(!id.startsWith('ComPlayer_'))return id;const bots=ids.filter(x=>x.startsWith('ComPlayer_'));return bots.length>1?`Computer ${bots.indexOf(id)+1}`:'Computer';};
const names=cards=>m=>{const c=cards.find(x=>x.name===m);return c?c.cost:null;};
async function reportDialog(p,game,{via='menu',scope}){
 const views=p.views(game),next=views.at(-1),before=[...views].reverse().find(v=>v.turn<next.turn)??null,ids=Object.keys(next.players),L=id=>label(p,id,ids),cards=catalogOf(p),problems=[];
 if(via==='menu'){await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Ultimo turno'}).click();}else await p.page.getByRole('button',{name:'Ultimo turno'}).first().click();
 await p.page.locator('dialog[open] .report').waitFor({timeout:5000});await p.page.waitForTimeout(150);
 const dom=await p.page.evaluate(()=>{const t=e=>e?e.textContent.replace(/\s+/g,' ').trim():null,q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)].map(t),dlg=q('dialog[open]'),r=dlg.getBoundingClientRect(),fs=e=>e?parseFloat(getComputedStyle(e).fontSize):null,rep=q('.report'),det=q('.server-text');
  return {h2:t(q('.report h2')),note:t(q('[data-testid=report-note]')),
   moves:[...document.querySelectorAll('[data-testid=report-facts] > li')].map(li=>({title:t(li.querySelector('strong')),lines:[...li.querySelectorAll('span')].map(t)})),noMoves:!q('[data-testid=report-facts]'),
   changes:q('[data-testid=report-changes]')?all('[data-testid=report-changes] li'):null,elim:all('[data-testid=report-eliminations] li'),end:t(q('[data-testid=report-end]')),outcome:t(q('[data-testid=report-outcome]')),
   server:{open:!!det?.open,summary:t(q('.server-text summary')),moves:[...document.querySelectorAll('.server-text .report-move')].map(m=>({title:t(m.querySelector('h4')),lines:[...m.querySelectorAll('p')].map(t)})),
    ends:[...document.querySelectorAll('.server-text > p')].map(t)},
   order:{facts:rep.querySelector('[data-testid=report-facts]')?.compareDocumentPosition(det)&Node.DOCUMENT_POSITION_FOLLOWING?'facts-before-server':'server-first-or-missing'},
   type:{move:fs(q('[data-testid=report-facts] li strong')),line:fs(q('[data-testid=report-facts] li span')),change:fs(q('[data-testid=report-changes] li')),note:fs(q('[data-testid=report-note]')),h3:fs(q('.report h3')),serverLine:fs(q('.server-text p'))},
   box:{x:r.x,y:r.y,w:r.width,h:r.height,scrollH:dlg.scrollHeight,clientH:dlg.clientHeight,scrollW:dlg.scrollWidth,clientW:dlg.clientWidth,vw:innerWidth,vh:innerHeight}};});
 // 1. The moves: the view's resolvedMoves in order, with who, what, on whom, void, nominal cost, chosen object and discard.
 const cost=names(cards);
 if(dom.moves.length!==next.resolvedMoves.length)problems.push(`moves ${dom.moves.length} vs view ${next.resolvedMoves.length}`);
 next.resolvedMoves.forEach((m,i)=>{const d=dom.moves[i];if(!d){return;}const self=m.targetId==='SELF'||m.targetId===m.playerId,target=self?m.playerId:m.targetId;
  const who=L(m.playerId),on=self?(m.playerId===p.user?'te stesso':'se stesso'):target===p.user?'di te':L(target),verb=m.playerId===p.user?'giochi':'gioca';
  if(d.title!==`${i+1}. ${who} ${verb} «${m.playedCardName}» su ${on}`)problems.push(`move ${i} title «${d.title}»`);
  if(d.lines.some(l=>/^Annullata/.test(l))!==!!m.void)problems.push(`move ${i} void`);
  const c=cost(m.playedCardName),costLine=d.lines.find(l=>/^(Costo nominale|Nessun costo|Costo nominale non noto)/.test(l));
  if(c===null){if(costLine!=='Costo nominale non noto al client.')problems.push(`move ${i} unknown cost: ${costLine}`);}
  else{const parts=Object.entries(c).filter(([,v])=>v).map(([k,v])=>`${v} ${RES_IT[k]}`);const exp=parts.length?`Costo nominale: ${['HEALTH','ALERTNESS','VIOLENCE','TOXICITY','ALCOHOL'].filter(k=>c[k]).map(k=>`${c[k]} ${RES_IT[k]}`).join(' + ')}.`:'Nessun costo nominale in risorse.';if(costLine!==exp)problems.push(`move ${i} cost «${costLine}» vs «${exp}»`);}
  const item=m.choices?.TARGET_ITEM,itemLine=d.lines.find(l=>l.startsWith('Oggetto scelto'));if(!!item!==!!itemLine||(item&&!itemLine.includes(`«${item}»`)))problems.push(`move ${i} object`);
  const disc=m.choices?.DISCARD_ONE,discLine=d.lines.find(l=>l.startsWith('Carta da scartare'));if(!!disc!==!!discLine||(disc&&!discLine.includes(`«${disc}»`)))problems.push(`move ${i} discard`);
  for(const l of d.lines)if(/rubat|consumat|distrutt|spezzat|annullata da|contrastat/i.test(l))problems.push(`move ${i} claims a cause: ${l}`);});
 // 2. The overall changes: only for a contiguous round (the previous view is the previous turn of this game).
 const adv=before?next.turn-before.turn:null,contiguous=adv===1&&before.gameId===next.gameId;
 if(contiguous){
  if(!dom.changes||dom.changes.length!==ids.length)problems.push(`changes ${dom.changes?.length} lines for ${ids.length} seats`);
  ids.forEach((id,i)=>{const line=dom.changes?.[i]??'',a=before.players[id],b=next.players[id];if(!line.startsWith(`${L(id)}: `))problems.push(`changes ${id}: «${line}»`);
   for(const k of Object.keys(RES_IT)){const x=a?.character.resources[k]??0,y=b.character.resources[k]??0,text=`${RES_IT[k]} ${sgn(y-x)} (da ${x} a ${y})`;if((y!==x)!==line.includes(text))problems.push(`changes ${id} ${k}: expected ${y!==x?'':'no '}«${text}» in «${line}»`);
    if(line.includes(`${RES_IT[k]} `)&&y===x&&new RegExp(`${RES_IT[k]} [+−]\\d`).test(line))problems.push(`changes ${id} ${k}: a change that did not happen`);}
   const gone=[...(a?.character.items??[]).map(c=>c.name)],now=b.character.items.map(c=>c.name),minus=(x,y)=>{const z=[...y];return x.filter(n=>{const k=z.indexOf(n);if(k>=0){z.splice(k,1);return false;}return true;});};
   const goneNames=minus(gone,now),appeared=minus(now,gone);if(/oggetti spariti/.test(line)!==(goneNames.length>0))problems.push(`changes ${id} gone`);if(/oggetti comparsi/.test(line)!==(appeared.length>0))problems.push(`changes ${id} appeared`);
   for(const n of [...goneNames,...appeared])if(!line.includes(`«${n}»`))problems.push(`changes ${id} ${n}`);
   const died=!a?.character.dead&&b.character.dead;if(dom.elim.some(e=>e.startsWith(id===p.user?'Sei stato eliminato':`${L(id)} è stato eliminato`))!==died)problems.push(`eliminations ${id}`);});
  const eot=Object.entries(next.timeBasedEffects??{}).filter(([,l])=>l.length).map(([id])=>id);if(!!dom.end!==(eot.length>0))problems.push('end of turn section');for(const id of eot)if(!dom.end?.includes(L(id)))problems.push(`end of turn ${id}`);
  if(dom.note)problems.push(`a note on a contiguous round: ${dom.note}`);
 }else{
  if(dom.changes!==null)problems.push('changes shown without a contiguous previous view');if(dom.elim.length)problems.push('eliminations shown without a contiguous previous view');
  if(adv>1&&(!dom.note||!new RegExp(`Sono stati risolti ${adv} turni, fino a il turno ${next.turn}\\.`).test(dom.note)||!/solo l’ultimo/.test(dom.note)))problems.push(`jump of ${adv} turns not described: ${dom.note}`);
  if(!dom.note)problems.push('no note without a difference');}
 if(next.over&&!dom.outcome)problems.push('outcome missing');if(!next.over&&dom.outcome)problems.push('outcome on a game that goes on');
 // 3. The server's text, unchanged and second.
 if(dom.order.facts!=='facts-before-server')problems.push(`order: ${dom.order.facts}`);
 if(dom.server.moves.length!==next.resolvedMoves.length)problems.push(`server text of ${dom.server.moves.length} moves`);
 next.resolvedMoves.forEach((m,i)=>{const lines=Object.values(m.moveReport).flat(),d=dom.server.moves[i];if(!d)return;if(JSON.stringify(d.lines)!==JSON.stringify(lines))problems.push(`server text of move ${i}: ${JSON.stringify(d.lines)} vs ${JSON.stringify(lines)}`);});
 const eotLines=Object.entries(next.timeBasedEffects??{}).filter(([,l])=>l.length);
 eotLines.forEach(([id,lines],i)=>{const t=dom.server.ends[i+1]??'';if(!t.endsWith(lines.join(' ').replace(/\s+/g,' ').trim()))problems.push(`server end-of-turn text of ${id}`);});
 // 4. Legibility at this size, without zoom: type, the dialog inside the screen, nothing cut sideways, the facts at the top.
 const compact=vh<550,min={move:compact?16:18,line:compact?15:17,change:compact?16:18,note:compact?16:18};
 if(dom.type.move!==null&&dom.type.move<min.move)problems.push(`move title ${dom.type.move}px`);if(dom.type.line!==null&&dom.type.line<min.line)problems.push(`move line ${dom.type.line}px`);
 if(dom.type.change!==null&&dom.type.change<min.change)problems.push(`change ${dom.type.change}px`);if(dom.type.note!==null&&dom.type.note<min.note)problems.push(`note ${dom.type.note}px`);
 if(dom.box.x<-.5||dom.box.y<-.5||dom.box.x+dom.box.w>dom.box.vw+.5||dom.box.y+dom.box.h>dom.box.vh+.5)problems.push(`dialog off screen ${JSON.stringify(dom.box)}`);
 if(dom.box.scrollW>dom.box.clientW+1)problems.push('dialog scrolls sideways');
 const firstFact=await p.page.evaluate(()=>{const dlg=document.querySelector('dialog[open]'),li=document.querySelector('[data-testid=report-facts] li'),d=dlg.getBoundingClientRect(),r=li?.getBoundingClientRect();return r?{top:r.top-d.top,bottom:r.bottom-d.top,dialogH:d.height}:null;});
 if(firstFact&&firstFact.bottom>firstFact.dialogH+1)problems.push('the first move is not visible when the dialog opens');
 return {scope,turn:next.turn,advanced:adv,moves:dom.moves.length,type:dom.type,box:dom.box,firstFact,note:dom.note,problems,close:async()=>{await p.page.keyboard.press('Escape');await p.page.waitForTimeout(120);}};
}
function summarise(label,p,game,r,{expectSequences=true,quiet=new Set()}={}){
 const a=analyse(label,p,game,r.log,catalogOf(p),{expectSequences,quiet});
 const rule2=r.finals.filter(f=>f.problems.length);
 // C3-2: how each sequence ended, the static summary at each choice, the line after a jump.
 const ends=r.stats.sequenceEnds??[],relation=Object.fromEntries((r.log??[]).filter(e=>e.facts.relation!=='same').map(e=>[e.facts.key,e.facts]));
 const c32=[];
 const plans=Object.fromEntries((r.stats.sequencePlans??[]).map(x=>[x.key,x]));
 for(const e of ends){if(e.reason==='view')c32.push(`${e.key}: ended by a view (K1)`);const plan=plans[e.key];
  // C3-2 revision: a completed sequence lasts what its plan says (one card at a time), never more than the cap of D10 (20 s since D13).
  if(e.reason==='complete'&&plan&&Math.abs(e.ms-plan.total)>250)c32.push(`${e.key}: completed in ${e.ms} ms, planned ${plan.total}`);}
 for(const x of Object.values(plans))if(x.total>PACE.budget)c32.push(`${x.key}: planned ${x.total} ms with ${x.moves} moves`);
 // C3-4: what each sequence animated, counted on the nodes the scene built, against the facts recomputed from the wire
 // views (drops, stamps, tokens and object fates directly from the facts; draws, discards and steps from the timeline);
 // bars per card exactly when the measurement of D1 (unanchored, independent) says the report lines rebuild the views.
 const c34=[],rounds34=[],cat=catalogOf(p),costOf=new Map(cat.map(c=>[c.name,c.cost])),endOf=Object.fromEntries(ends.map(e=>[e.key,e]));
 for(const b of r.stats.beats??[]){const turn=Number(b.key.split('/').pop()),prev=p.views(game).filter(v=>v.turn===turn-1).at(-1),next=p.views(game).filter(v=>v.turn===turn)[0];
  if(!prev||!next){c34.push(`${b.key}: wire views missing`);continue;}
  const f=resolve(prev,next,p.user,cat),T=timeline(prev,next,f,cat),exp=beats(T),rc=reportCheck(prev,next,cat),gone=f.moves.filter(m=>m.itemGone);
  const direct={drops:f.moves.length,stamps:f.moves.filter(m=>m.void).length,tokens:f.moves.reduce((n,m)=>n+Object.values(costOf.get(m.card)??{}).filter(v=>v).length,0),
   consumed:gone.filter(m=>m.author===m.item.owner).length,passed:gone.filter(m=>m.author!==m.item.owner&&m.itemAtAuthor).length,broken:gone.filter(m=>m.author!==m.item.owner&&!m.itemAtAuthor).length,
   endOfTurn:f.endOfTurn.length,emphasis:Object.values(f.seats).filter(s=>s.died||s.forfeit).length};
  for(const [k,v] of Object.entries(direct))if(b[k]!==v)c34.push(`${b.key}: ${k} ${b[k]}, facts ${v}`);
  for(const k of ['objects','discards','draws','steps'])if(b[k]!==exp[k])c34.push(`${b.key}: ${k} ${b[k]}, timeline ${exp[k]}`);
  const verified=rc.sumOk&&rc.chainOk;if((b.bars==='per-card')!==verified)c34.push(`${b.key}: bars ${b.bars} (${b.reason}), measurement ${verified}`);
  if(verified&&b.steps!==rc.steps)c34.push(`${b.key}: ${b.steps} steps, measurement ${rc.steps}`);
  if(b.pops!==b.steps)c34.push(`${b.key}: ${b.pops} enlarged changes for ${b.steps} steps`);
  // D13: one author close-up and one target close-up per card; the plan of the scene equals the plan of the wire views.
  if(b.closeUps!==f.moves.length||b.targetUps!==f.moves.length)c34.push(`${b.key}: ${b.closeUps} author and ${b.targetUps} target close-ups for ${f.moves.length} cards`);
  const plan=plans[b.key]?.pace;if(!plan)c34.push(`${b.key}: no plan`);else{for(const x of directionProblems(plan))c34.push(`${b.key}: ${x}`);if(JSON.stringify(plan)!==JSON.stringify(T.pace))c34.push(`${b.key}: scene plan differs from the wire timeline`);}
  if(b.drift!==T.drift)c34.push(`${b.key}: drift ${b.drift}, timeline ${T.drift}`);
  rounds34.push({key:b.key,moves:b.drops,bars:b.bars,reason:b.reason,drift:b.drift,planned:plans[b.key]?.total??null,ms:endOf[b.key]?.ms??null,end:endOf[b.key]?.reason??null,
   beats:Object.fromEntries(Object.entries(b).filter(([k,v])=>!['key','bars','reason'].includes(k)&&v))});}
 // D13 on what the scene actually scheduled, card by card: each beat at its planned time and in the order of D13; the
 // board steps of a card (its cost, its changes) never before that card starts; the hit inside the flight.
 const d13=[],closeUps=[];
 for(const x of r.stats.schedule??[]){const plan=plans[x.key]?.pace?.moves[x.move];if(!plan){d13.push(`${x.key} card ${x.move}: no plan`);continue;}
  for(const b of BEATS)if(x[b]!==plan[b].at)d13.push(`${x.key} card ${x.move}: ${b} scheduled at ${x[b]}, planned ${plan[b].at}`);
  const seq=[x.tokens??x.cost,x.closeUp,x.goesBack,x.flies,x.hit,x.targetUp,x.pops??x.targetUp];
  if(seq.some((t,i)=>i&&t<seq[i-1]))d13.push(`${x.key} card ${x.move}: beats out of order ${seq.join(',')}`);
  if(x.closeUp<=x.cost&&plan.cost.dur>0)d13.push(`${x.key} card ${x.move}: close-up before the cost`);
  if(x.costPops!==null&&(x.costPops<plan.at||x.costPops>=x.closeUp))d13.push(`${x.key} card ${x.move}: cost changes at ${x.costPops}, outside the cost beat`);
  if(x.pops!==null&&x.pops<x.targetUp)d13.push(`${x.key} card ${x.move}: changes before the target close-up`);
  if(!(x.hit>x.flies&&x.hit<x.targetUp))d13.push(`${x.key} card ${x.move}: hit at ${x.hit} outside the flight`);}
 // Close-ups: on the screen and clear of the other seats, as laid out when the sequence started (character, board, objects,
 // covered hand of each other seat); the target's, a little bigger in its seat, clear of the other characters.
 for(const c of r.stats.closeUps??[]){const target=c.target,covers=c.others.filter(o=>overlap(c.box,o)>0).length;
  const others=r.end?.layout?.seats?.filter(s=>s.id!==c.targetId).map(s=>s.person)??[],targetCovers=target?others.filter(o=>overlap(target,o)>0).length:0;
  closeUps.push({key:c.key,move:c.move,author:c.author,scale:c.scale,placed:c.placed,box:Object.fromEntries(Object.entries(c.box).map(([k,v])=>[k,Math.round(v)])),covers,targetCovers,inside:inside(c.box,vw,vh)&&(!target||inside(target,vw,vh))});
  if(!inside(c.box,vw,vh)||(target&&!inside(target,vw,vh)))d13.push(`${c.key} card ${c.move}: close-up off the screen`);
  if(covers)d13.push(`${c.key} card ${c.move}: author close-up covers ${covers} boxes of other seats`);
  if(targetCovers)d13.push(`${c.key} card ${c.move}: target close-up covers ${targetCovers} other characters`);}
 // C3-4s: flights against the facts recomputed on the wire views, for every sequence; what was seen and how long labels lasted, for those let run to the end.
 const c4s=[],flownRows=[],labelMs=[],shortLabels=[],expectKinds=c=>{const t=c?.damage&&c.damage!=='—'?c.damage.split(',').map(x=>x.trim()):[];if(t.length)return t;return c?.role&&['DAMAGE','DEFENSE','RESOURCES','COUNTER','DISRUPT','ITEMS','OTHER'].includes(c.role)?[c.role]:['PLAIN'];};
 for(const x of r.stats.flown??[]){const turn=Number(x.key.split('/').pop()),prev=p.views(game).filter(v=>v.turn===turn-1).at(-1),next=p.views(game).filter(v=>v.turn===turn)[0];if(!prev||!next){c4s.push(`${x.key}: wire views missing`);continue;}
  const f=resolve(prev,next,p.user,cat),T=timeline(prev,next,f,cat),seats=Object.values(f.seats),byName=new Map(cat.map(c=>[c.name,c])),end=endOf[x.key];
  const toHand=prev.resolvedMoves.filter(m=>{const c=byName.get(m.playedCardName);return c&&(c.basicAction||c.characterBound);}).length;
  const want={clear:prev.resolvedMoves.length,toPile:prev.resolvedMoves.length-toHand,toHand,discard:f.moves.filter(m=>m.discard&&!m.void).length,itemOut:seats.reduce((n,o)=>n+o.itemsGone.length,0),itemIn:seats.reduce((n,o)=>n+o.itemsAppeared.length,0),
   drawHand:f.seats[p.user]?.handArrived?.length??0,drawBack:Object.entries(f.seats).filter(([id])=>id!==p.user).reduce((n,[,o])=>n+Math.max(0,o.deck.before-o.deck.after),0)-T.draws.filter(d=>d.seat!==p.user&&d.to==='table').length};
  const got={clear:x.built.clear,toPile:x.toPile,toHand:x.toHand,discard:x.built.discard,itemOut:x.built.itemOut,itemIn:x.built.itemIn,drawHand:x.built.drawHand,drawBack:x.built.drawBack};
  for(const k of Object.keys(want))if(want[k]!==got[k])c4s.push(`${x.key}: ${k} ${got[k]} flights, facts ${want[k]}`);
  const names=v=>Object.fromEntries(Object.entries(v.players).map(([id,o])=>[id,o.character.items.map(c=>c.name)])),sorted=o=>JSON.stringify(Object.keys(o).sort().map(k=>[k,[...o[k]].sort()]));
  if(sorted(x.itemsStart)!==sorted(names(prev)))c4s.push(`${x.key}: objects at the start ${sorted(x.itemsStart)}, previous view ${sorted(names(prev))}`);
  const whole=end?.reason==='complete'&&!x.advanced,labels=(r.stats.labels??[]).filter(l=>l.key===x.key);
  if(whole){for(const k of Object.keys(x.built))if(x.seen[k]!==x.built[k])c4s.push(`${x.key}: ${k} built ${x.built[k]}, seen ${x.seen[k]}`);
   if(x.itemsEnd&&sorted(x.itemsEnd)!==sorted(names(next)))c4s.push(`${x.key}: objects at the end ${sorted(x.itemsEnd)}, view ${sorted(names(next))}`);
   const b=(r.stats.beats??[]).find(y=>y.key===x.key);if(b&&labels.length!==b.pops)c4s.push(`${x.key}: ${labels.length} labels for ${b.pops} changes`);
   const plan=(r.stats.sequencePlans??[]).find(y=>y.key===x.key);for(const l of labels){labelMs.push(l.readable);if(l.readable<LABEL.read-50){c4s.push(`${x.key}: label ${l.seat} ${l.resource} readable ${l.readable} ms`);shortLabels.push({key:x.key,seat:l.seat,resource:l.resource,readable:l.readable,gap:l.gap,from:l.from,toEnd:plan?plan.total-l.from:null,total:plan?.total??null,moves:plan?.moves??null});}if(!inside(l.box,vw,vh))c4s.push(`${x.key}: label ${l.seat} ${l.resource} off the screen`);}}
  labels.forEach((a,i)=>labels.slice(i+1).forEach(o=>{if(a.to>o.from&&o.to>a.from&&overlap(a.box,o.box)>0)c4s.push(`${x.key}: labels ${a.seat} ${a.resource} and ${o.seat} ${o.resource} overlap`);}));
  // C3-5: what each card made on its target, against the catalog strings read here independently of the client (the type of damage, else the role; a voided move a cross);
  // the knock only for a blow; the closing emphasis against the facts of the wire views.
  const imps=(r.stats.impacts??[]).filter(y=>y.key===x.key);
  if(imps.length!==T.moves.length)c4s.push(`${x.key}: ${imps.length} impacts for ${T.moves.length} moves`);
  else T.moves.forEach((m,i)=>{const c=byName.get(m.card),want=m.void?['VOID']:expectKinds(c),got=imps[i];
   if(JSON.stringify(got.kinds)!==JSON.stringify(want))c4s.push(`${x.key} card ${i} ${m.card}: impact ${JSON.stringify(got.kinds)}, catalog ${JSON.stringify(want)}`);
   if(!!got.shake!==(!m.void&&want.some(k=>['HIT','CUT','POISON'].includes(k))))c4s.push(`${x.key} card ${i} ${m.card}: knock ${got.shake} for ${JSON.stringify(want)}`);
   // The blow also sends out its expanding circle (the shock wave), a card of another type or a voided move none.
   if(got.wave!==(!m.void&&want.includes('HIT')?1:0))c4s.push(`${x.key} card ${i} ${m.card}: shock wave ${got.wave} for ${JSON.stringify(want)}`);else if(got.wave)seen('shockWave',`${x.key}#${i}`);
   // The knocked character card also darkens: read back from the frames of a sequence that ran to its end.
   if(got.shake&&endOf[x.key]?.reason==='complete'){const dk=(r.stats.darks??[]).find(d=>d.key===x.key&&d.move===i);if(!dk||dk.min>=255)c4s.push(`${x.key} card ${i} ${m.card}: the target was not darkened (${dk?.min})`);else seen('darkened',`${x.key}#${i} min ${dk.min}`);}
   for(const k of got.kinds)seen(k==='VOID'?'impactVoid':['HIT','CUT','POISON'].includes(k)?`impact${k}`:'impactRole',`${x.key}#${i}`);});
  const em=(r.stats.emphasis??[]).filter(y=>y.key===x.key),wantEm=T.emphasis.map(e=>e.kind==='died'?'died':'forfeit').sort(),gotEm=em.filter(y=>y.kind!=='outcome').map(y=>y.kind).sort();
  if(JSON.stringify(wantEm)!==JSON.stringify(gotEm))c4s.push(`${x.key}: emphasis ${JSON.stringify(gotEm)}, facts ${JSON.stringify(wantEm)}`);
  const ending=em.filter(y=>y.kind==='outcome'),wantText=!T.outcome?null:T.outcome.winner==='NONE'?'PAREGGIO':T.outcome.winner===p.user?'VITTORIA':'SCONFITTA';
  if((ending[0]?.text??null)!==wantText||ending.length>(wantText?1:0))c4s.push(`${x.key}: outcome banner ${JSON.stringify(ending)}, facts ${wantText}`);else if(wantText)seen('outcomeBanner',x.key);
  flownRows.push({key:x.key,end:end?.reason??null,impacts:imps.map(y=>y.kinds.join('+')),emphasis:em.map(y=>y.kind),advanced:x.advanced,...got,vanished:T.vanished.length,appeared:T.appeared.length,labels:labels.length,minReadable:labels.length?Math.min(...labels.map(l=>l.readable)):null});
  if(T.vanished.length)seen('objectVanished',x.key);if(T.appeared.length)seen('objectAppeared',x.key);if(want.toHand)seen('clearToHand',x.key);if(want.discard)seen('boundDiscardFlown',x.key);}
 for(const f of r.finals){if(!f.turn)continue;const key=`${game}/${f.turn}`,facts=relation[key];if(!facts)continue;
  if(facts.relation==='next'&&!f.summary)c32.push(`${key}: no static summary at the choice`);
  if(facts.relation==='next'&&f.summary&&(f.summary.key!==key||f.summary.seats!==Object.keys(facts.seats).length))c32.push(`${key}: summary of ${f.summary.key} with ${f.summary.seats} seats`);
  if(facts.relation!=='next'&&f.summary)c32.push(`${key}: summary after a ${facts.relation}`);}
 const jumps=(r.log??[]).filter(e=>e.facts.relation==='jump').map(e=>e.facts.key);
 const sceneRules={1:a.rules[1],2:rule2.map(f=>`T${f.turn}: ${f.problems.join(', ')}`),3:a.rules[3],6:a.rules[6],c32,c34,d13,c4s};
 evidence.games[label]={timerOrderOnly:a.timerOrderOnly,noValidMove:r.noValidMove??null,gameId:game,turnsSeen:a.turns,views:a.views,rows:a.rows,client:a.client,watched:r.watched,outcome:{over:r.end.over,winner:r.end.winner,eliminated:r.end.eliminated}};
 evidence.scene[label]={rules:Object.fromEntries(Object.entries(sceneRules).map(([k,v])=>[k,{ok:!v.length,violations:v}])),
  k1:{sequences:r.stats.sequences,cancelledByView:a.k1.length,sequenceMs:r.stats.sequenceMs,cancels:r.stats.cancels},sequenceEnds:ends,summariesAtChoice:r.finals.map(f=>({turn:f.turn,summary:f.summary})),jumps,notes:r.notes??[],k2:a.k2,k6:{modelRounds:a.k6,sceneHealthDeltas:r.stats.aggregateDeltas,sceneTransfers:r.stats.transfers,note:'the scene shows only HEALTH totals and one-to-one transfers; costs, other resources, draws, voids and end of turn are not in the scene'},flights:r.stats.flights,transfers:r.stats.transfers,aggregateDeltas:r.stats.aggregateDeltas,rounds:rounds34,closeUps,flown:flownRows,labelReadable:labelMs.length?{labels:labelMs.length,min:Math.min(...labelMs),max:Math.max(...labelMs)}:null,shortLabels};
 step(label,{gameId:game,turns:a.turns,views:a.views,modelProblems:a.problems,repeatedViewDiffs:a.repeated,timerOrderOnly:a.timerOrderOnly,scene:evidence.scene[label].rules,k1:`${a.k1.length} of ${r.stats.sequences} sequences cancelled by view`,ends:Object.entries(ends.reduce((m,e)=>(m[e.reason]=(m[e.reason]??0)+1,m),{})).map(([k,v])=>`${k} ${v}`).join(', '),msComplete:ends.filter(e=>e.reason==='complete').map(e=>e.ms),
  bars:`${rounds34.filter(x=>x.bars==='per-card').length} per card, ${rounds34.filter(x=>x.bars==='total').length} total`,cards:(r.stats.schedule??[]).length,closeUps:`${closeUps.filter(c=>c.placed==='middle').length} middle, ${closeUps.filter(c=>c.placed!=='middle').length} in the seat`,drift:rounds34.reduce((n,x)=>n+(x.drift??0),0),flown:flownRows.reduce((m,x)=>{for(const k of ['clear','toPile','toHand','discard','itemOut','itemIn','drawHand','drawBack','vanished','appeared'])m[k]=(m[k]??0)+x[k];return m;},{}),labelReadable:evidence.scene[label].labelReadable,notes:r.notes});
 assert.deepEqual(a.problems,[],`${label}: model problems`);
 for(const [k,v] of Object.entries(sceneRules))assert.deepEqual(v,[],`${label}: scene rule ${k}`);
 if(jumps.length)assert.ok((r.notes??[]).some(t=>t.includes('Risolti')),`${label}: line of the resolved turns after a jump`);
 return a;
}
const run=name=>!only||only.includes(name);
let A=null,B=null;

try{
 await startServer();step('server',{database:'temporary',jar});
 A=await open('A');await login(A);

 // 1. Quick 1vCom to the outcome; at the second own turn a drop and a rejoin: the same resolution, no re-animation.
 if(run('quick')){
  await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();await table(A);
  const game=readyId(A,/quick\/1vCom\/ready$/);let rejoin=null;
  const r=await playToEnd(A,{shots:'quick',onTurn:async(p,s)=>{
   if(rejoin||s.turn<2)return false;
   const before=await p.state(),logBefore=(await p.log()).length,held=lastView(p,s.turn);
   await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Strumenti'}).click();await p.page.getByRole('button',{name:'Simula disconnessione'}).click();
   await p.page.getByRole('button',{name:'Rientra'}).waitFor({timeout:10000});const mark=p.sent.length;
   await p.page.getByRole('button',{name:'Rientra'}).click();await p.page.locator('.overlay').waitFor({state:'detached',timeout:15000});
   const back=await p.wait(x=>x&&x.phase==='choose',15000,'back at the table');await p.page.waitForTimeout(500);
   const after=(await p.log()).slice(logBefore),resume=p.views(game).filter(v=>v.__resume).at(-1);
   rejoin={turn:s.turn,entries:after.map(e=>({why:e.why,key:e.facts.key,relation:e.facts.relation,seats:!!e.facts.seats})),sequencesBefore:before.stats.sequences,sequencesAfter:back.stats.sequences,moveSends:p.sends(mark).filter(d=>d.endsWith('/move')).length,resumeTurn:resume?.turn};
   assert.ok(after.length>=1&&after.every(e=>e.facts.relation==='same'&&!e.facts.seats),'rejoin: same resolution, no difference');
   assert.equal(rejoin.moveSends,0,'no move resent');
   if(resume)record('rejoinSame',p.user,held,resume,'quick 1vCom: rientro dopo «Simula disconnessione», stessa risoluzione');
   seen('rejoinSame',`quick T${s.turn}`);
   step('quickRejoin',rejoin);return true;}});
  await A.shot('quick-outcome');
  summarise('quick',A,game,r);
  evidence.scene.quick.rejoin={...rejoin,reanimated:rejoin.sequencesAfter>rejoin.sequencesBefore};
  await toHub(A);
 }

 // C3-6: the dialog «Ultimo turno» on real games, in the duel (quick 1vCom) and the five-seat FFA (four computers), opened from the menu at several turns: every sentence
 // of the facts checked on the wire views, the server's text unchanged and second, the type big enough for this size (BM_VIEWPORT), nothing off the screen.
 if(run('report')){
  const rows=[];
  for(const mode of ['duel','ffa']){
   if(mode==='duel'){await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();}
   else{await joinFfa(A);await waitList(A,1);await addComputers(A,4);}
   await table(A);const game=readyId(A,mode==='duel'?/quick\/1vCom\/ready$/:/quick\/ffa\/ready$/);let checked=0;
   for(let t=0;t<6&&checked<4;t++){
    const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),90000,'turn');
    if(s.over||s.eliminated)break;
    if(s.turn>=1){const res=await reportDialog(A,game,{scope:`${mode} T${s.turn}`});rows.push({mode,turn:res.turn,advanced:res.advanced,moves:res.moves,type:res.type,box:res.box,firstFact:res.firstFact,problems:res.problems});
     if(checked===1)await A.shot(`report-${mode}-dialog`);
     await A.page.evaluate(()=>document.querySelector('dialog[open]')?.scrollTo(0,1e6));await A.page.waitForTimeout(100);if(checked===1)await A.shot(`report-${mode}-dialog-end`);
     await res.close();checked++;}
    await playOne(A);await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,90000,'resolved');}
   const st=await A.state();if(!st.over&&!st.eliminated){await A.page.keyboard.press('Escape');await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Abbandona la partita'}).click();await A.page.getByRole('button',{name:'Sì, abbandona'}).click();await A.page.getByTestId('quick').waitFor({timeout:15000});}
   else await toHub(A);
   step(`report-${mode}`,{game,dialogs:rows.filter(r=>r.mode===mode).length});}
  evidence.report={rows};
  assert.ok(rows.filter(r=>r.mode==='duel').length>=2&&rows.filter(r=>r.mode==='ffa').length>=2,'dialogs checked in both modes');
  assert.deepEqual(rows.flatMap(r=>r.problems.map(x=>`${r.mode} T${r.turn}: ${x}`)),[],'report dialog');
  assert.ok(rows.filter(r=>r.mode==='ffa').some(r=>r.moves>=4),'an FFA round with several moves was read');
 }

 // K3: reduced motion emulated, three rounds of quick 1vCom, then abandon. No sequence; the static summary is there.
 if(run('reduced')){
  await A.page.emulateMedia({reducedMotion:'reduce'});
  await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();await table(A);
  const game=readyId(A,/quick\/1vCom\/ready$/),rounds=[];
  for(let i=0;i<3;i++){const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');if(s.over||s.eliminated)break;
   await playOne(A);const t=await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'resolved');await A.page.waitForTimeout(300);
   const st=await A.state(),toast=await A.page.locator('.toast').count(),f=(await A.log()).filter(e=>e.facts.relation==='next'&&e.facts.turn===st.turn).at(-1)?.facts;rounds.push({turn:st.turn,impacts:st.stats.impacts.length+st.stats.emphasis.length,faces:st.readout.hand.map(h=>h.face?.damage.length??-1),sequences:st.stats.sequences,aggregateDeltas:st.stats.aggregateDeltas,modelSeats:!!f?.seats,modelChanges:f?.seats?Object.values(f.seats).reduce((n,x)=>n+Object.values(x.resources).filter(c=>c.delta).length,0):0,summaryKey:st.summary?.key??null,summary:st.summary?Object.values(st.summary.seats).map(x=>x.texts.join(' ')):null,expectedKey:`${game}/${st.turn}`,toast,flown:st.stats.flown.length,flights:st.stats.flights,labels:st.stats.labels.length,marks:(()=>{const mk=f?seatMarks({facts:f,crossed:false}):null;return mk?Object.values(mk).map(l=>l.map(m=>m.text).join(' ')||'invariato'):null;})()});void t;}
  await A.shot('reduced-motion');
  const st=await A.state();
  if(!st.over&&!st.eliminated){await A.page.keyboard.press('Escape');await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Abbandona la partita'}).click();await A.page.getByRole('button',{name:'Sì, abbandona'}).click();await A.page.getByTestId('quick').waitFor({timeout:15000});}
  else await toHub(A);
  await A.page.emulateMedia({reducedMotion:'no-preference'});
  evidence.scene.reduced={gameId:game,rounds};
  // C3-2 (K3 fixed): no sequence, and the static summary of every round on the table.
  for(const x of rounds){assert.equal(x.sequences,0,'reduced motion: no sequence');assert.equal(x.summaryKey,x.expectedKey,`reduced motion: summary of turn ${x.turn}`);
   // C3-4s: no flight and no label; the same content (changes and objects gone and appeared per seat, as the model gives them) in the static summary.
   assert.equal(x.flown+x.flights+x.labels+x.impacts,0,'reduced motion: no flights, no impact marks, no knock (C3-5)');assert.ok(x.faces.every(n=>n>=0),'reduced motion: every hand card still has its drawn face');assert.deepEqual([...x.summary].sort(),[...x.marks].sort(),`reduced motion: summary of turn ${x.turn} as the model`);}
  step('reducedMotion',evidence.scene.reduced);
 }

 // C3-2: interruptions in quick 1vCom. «Salta effetti», a tap on the empty table and a card chosen during the
 // sequence bring it to the final state and leave the summary (rules 4, 5); a round resolved while the tab is
 // hidden starts no sequence on return, keeps the summary and a short summary that did not expire (K3, K5).
 if(run('interrupt')){
  await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();await table(A);
  const game=readyId(A,/quick\/1vCom\/ready$/),out={};
  const ready=()=>A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');
  const resolved=s=>A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'resolved');
  const lastEnd=st=>st.sequence.ends.at(-1);
  // A point of the canvas outside every hit and under no HTML element: a tap on the empty table.
  const empty=async()=>{const st=await A.state();for(let y=vh*.12;y<vh*.6;y+=vh*.04)for(let x=vw*.25;x<vw*.8;x+=vw*.04){
   if(st.hits.some(h=>Math.abs(x-h.x)<h.w/2+6&&Math.abs(y-h.y)<h.h/2+6))continue;if(await A.page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.tagName==='CANVAS',[x,y]))return {x,y};}throw new Error('no empty spot');};
  const round=async(name,during)=>{const s=await ready();if(s.over||s.eliminated)return false;await playOne(A);await resolved(s);
   const running=await A.state();const key=`${game}/${running.turn}`;if(!running.sequence.running){out[name]={key,skipped:'sequence already over before the action',ends:running.sequence.ends.slice(-2)};return true;}
   await during(running);await A.page.waitForTimeout(150);const st=await A.state();
   out[name]={key,runningBefore:true,running:st.sequence.running,end:lastEnd(st),summaryKey:st.summary?.key??null,selected:st.selected,final:finalState(st,lastView(A,st.turn))};
   assert.equal(st.sequence.running,false,`${name}: sequence brought to its end`);assert.equal(lastEnd(st).key,key);assert.deepEqual(out[name].final,[],`${name}: final state is the view`);return true;};
  const skip=async()=>{await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Salta effetti'}).click();};
  if(await round('skip',skip)&&out.skip.runningBefore){assert.equal(out.skip.end.reason,'skip','opening the menu does not end the sequence, «Salta effetti» does');assert.equal(out.skip.summaryKey,out.skip.key,'«Salta effetti» leaves the summary');}
  // D12: each tap on the empty table moves the sequence to the next card; the last one ends it (reason input).
  // D13: the stops are the beats that show something, then draws, end of turn, tail and the end.
  if(await round('tap',async st=>{const plan=st.stats.sequencePlans.at(-1),stops=plan.pace.moves.reduce((n,m)=>n+BEATS.filter(b=>m[b].dur>0).length,0)+[plan.pace.draws,plan.pace.endOfTurn].filter(Boolean).length+2;let taps=0;
   for(;taps<stops;taps++){const before=await A.state();if(!before.sequence.running)break;const p=await empty();await A.page.mouse.click(p.x,p.y);await A.page.waitForTimeout(60);}
   out.tapCount=taps;out.tapPlan=plan;})&&out.tap.runningBefore){assert.equal(out.tap.end.reason,'input','the last tap ends the sequence');assert.ok(out.tapCount>=2,'a first tap does not end a sequence with more cards');assert.equal(out.tap.summaryKey,out.tap.key,'taps leave the summary');}
  // Rule 4: during the sequence the first tap on a card chooses it (and ends the sequence); D6 then hides the summary.
  if(await round('cardDuringSequence',async st=>{const h=st.hits.find(x=>x.kind==='hand');await A.page.mouse.click(h.x-h.w*.22,h.y);out.cardKey=h.id;})){
   if(out.cardDuringSequence.runningBefore){assert.equal(out.cardDuringSequence.selected,out.cardKey,'card chosen at the first tap');assert.equal(out.cardDuringSequence.end.reason,'input');assert.equal(out.cardDuringSequence.summaryKey,null,'D6: the choice dismisses the summary');}
   await A.page.keyboard.press('Escape');}
  // Hidden tab while the round resolves.
  const s=await ready();
  if(!s.over&&!s.eliminated){
   const mode=await setHidden(A,true);const before=(await A.state()).stats.sequences;await playOne(A);await resolved(s);
   await A.page.waitForTimeout(7000);const toastHidden=await A.page.locator('.toast').count();
   await setHidden(A,false);await A.page.waitForTimeout(400);const st=await A.state(),toast=await A.page.locator('.toast').count()?await A.text('.toast'):null;
   out.hidden={mode,key:`${game}/${st.turn}`,sequencesBefore:before,sequencesAfter:st.stats.sequences,summaryKey:st.summary?.key??null,toastAfter7s:toast,toastWhileHidden:toastHidden};
   assert.equal(st.stats.sequences,before,'hidden: no sequence on return');assert.equal(st.summary?.key,out.hidden.key,'hidden: summary present');assert.ok(toast&&toast.startsWith(`Turno ${st.turn}`),'K5: the short summary did not expire while hidden');
   await A.shot('interrupt-after-hidden');
   const left=await A.state();if(!left.over&&!left.eliminated){await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Abbandona la partita'}).click();await A.page.getByRole('button',{name:'Sì, abbandona'}).click();await A.page.getByTestId('quick').waitFor({timeout:15000});}else await toHub(A);
  }else await toHub(A);
  evidence.scene.interrupt={gameId:game,...out};step('interruptions',out);
 }

 // C3-4s (owner's report, point 4): the (i) button and the inspection at EVERY round of long games, after everything that can leave a
 // state behind: a sequence let run, taps, «Salta effetti», a card chosen and an inspection during the sequence, a pointer resting on the (i)
 // during the close-ups, a pointer resting on the (i) of a card or object that leaves the table when the view arrives. Every card of the hand
 // (and one object and one character per seat) is hovered and must get its (i); one (i) per kind is pressed and must open the inspection.
 // Failures are collected, not fatal at once: the evidence says at which round and after which action the (i) was lost.
 const infoButton=p=>p.page.locator('[data-testid=info]');
 async function infoLabel(p,ms=450){const end=Date.now()+ms;while(Date.now()<end){if(await infoButton(p).count())return await infoButton(p).first().getAttribute('aria-label').catch(()=>null);await p.page.waitForTimeout(25);}return null;}
 const spotFree=async(p,s)=>{for(let y=vh*.1;y<vh*.62;y+=vh*.03)for(let x=vw*.2;x<vw*.9;x+=vw*.03){if(s.hits.some(h=>Math.abs(x-h.x)<h.w/2+24&&Math.abs(y-h.y)<h.h/2+24))continue;if(await p.page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.tagName==='CANVAS',[x,y]))return {x,y};}return {x:vw*.5,y:6};};
 // A point of a hit no other hit covers (the fan overlaps to the right; objects overlap in the FFA).
 const visiblePoint=(h,hits)=>{const hand=hits.filter(o=>o.kind==='hand');
  for(const [dx,dy] of [[-.3,.1],[-.2,.3],[-.35,.35],[-.1,.2],[0,0],[.25,.3],[0,-.3]]){const c=Math.cos(h.angle),s=Math.sin(h.angle),ax=h.w*dx,ay=h.h*dy,pt={x:h.x+ax*c-ay*s,y:h.y+ax*s+ay*c};
   const over=hits.filter(o=>o!==h&&(o.kind!=='hand'||h.kind!=='hand'||hand.indexOf(o)>hand.indexOf(h)));
   if(!over.some(o=>Math.abs(pt.x-o.x)<o.w/2+4&&Math.abs(pt.y-o.y)<o.h/2+4))return pt;}return null;};
 async function probeMouse(p,where){
  const out={where,hovered:0,missing:[],stuck:[],neighbours:0,pressed:0,problems:[]},s=await p.state(),given={};
  if(!s||await dialogOpen(p)){out.problems.push('no table');return out;}
  const rest=await spotFree(p,s);await p.page.mouse.move(rest.x,rest.y);await p.page.waitForTimeout(190);
  const seats=new Set(),pick=s.hits.filter(h=>{if(h.kind==='hand')return true;if(h.kind==='status')return false;const k=`${h.kind}-${h.target.owner}`;if(seats.has(k))return false;seats.add(k);return true;});
  // From the free spot each time: a raised card keeps the hover while the pointer slides within its width.
  for(const h of pick){const pt=visiblePoint(h,s.hits);if(!pt)continue;await p.page.mouse.move(rest.x,rest.y);await p.page.waitForTimeout(20);await p.page.mouse.move(pt.x,pt.y);out.hovered++;const label=await infoLabel(p);
   if(!label)out.missing.push(h.id);else if(!s.hits.some(x=>label===`Dettagli: ${x.label}`))out.problems.push(`${h.id}: (i) of an unknown hit: ${label}`);else{if(label!==`Dettagli: ${h.label}`)out.neighbours++;(given[label]??=new Set()).add(h.id);}}
  // A pointer on a card may meet the neighbour raised over it or its (i), which is fine; the same (i) for several different things is an (i) left stuck.
  for(const [label,on] of Object.entries(given))if(on.size>=3)out.stuck.push({info:label.slice(0,70),hovered:[...on]});
  // One (i) per kind opens the inspection of what it names, and the table comes back.
  for(const kind of ['hand','item','person']){const h=pick.find(x=>x.kind===kind);if(!h)continue;const pt=visiblePoint(h,s.hits);if(!pt)continue;await p.page.mouse.move(pt.x,pt.y);if(!await infoLabel(p))continue;
   await infoButton(p).first().click();await p.page.waitForTimeout(60);if(!await dialogOpen(p)||!await p.page.locator('dialog .inspection').count()){out.problems.push(`${kind}: the (i) opens no inspection`);continue;}
   out.pressed++;await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);if(await dialogOpen(p))out.problems.push(`${kind}: the inspection does not close`);}
  const back=await spotFree(p,await p.state());await p.page.mouse.move(back.x,back.y);await p.page.waitForTimeout(190);
  return out;
 }
 // Touch (iPhone emulated): a tap chooses a hand card and shows its (i), a tap on it opens the inspection. `gave`: the (i) of a chosen card
 // gave way to a character or object under it (C3-L) and the card has no way to be read while it stays chosen.
 async function probeTouch(p,where){
  const out={where,tapped:0,missing:[],gave:[],pressed:0,problems:[]},s=await p.state();
  if(!s||await dialogOpen(p)){out.problems.push('no table');return out;}
  for(const h of s.hits.filter(x=>x.kind==='hand')){const pt=visiblePoint(h,s.hits);if(!pt)continue;await p.page.touchscreen.tap(pt.x,pt.y);await p.page.waitForTimeout(90);out.tapped++;
   if(await dialogOpen(p)){await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);continue;}
   const label=await infoLabel(p,300),now=await p.state();
   if(!label)(now.selected===h.id?out.gave:out.missing).push(h.id);
   else if(out.pressed<1){const b=await infoButton(p).first().boundingBox();await p.page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);await p.page.waitForTimeout(120);if(await dialogOpen(p)&&await p.page.locator('dialog .inspection').count()){out.pressed++;await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);}else out.problems.push(`${h.id}: the (i) opens no inspection`);}
   await p.page.keyboard.press('Escape');await p.page.waitForTimeout(50);}
  return out;
 }
 // What happens during the round before the probes. The last two send with Enter on ✓, the pointer left on an (i).
 const ACTIONS=['let it run','tap','skip','card during the sequence','inspection during the sequence','rest on the (i) through the close-ups','rest on the (i) of the card sent','rest on the (i) of an object','to the (i) right after ✓, mouse only'];
 const restOn=async p=>{const label=await infoLabel(p,200);if(label){const b=await infoButton(p).first().boundingBox();await p.page.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.page.waitForTimeout(40);}return label;};
 const enterOnConfirm=async p=>{await p.page.getByTestId('confirm').focus();await p.page.keyboard.press('Enter');};
 async function infoGames(p,label,{start,games=2,maxRounds=16,touch=false}){
  const rows=[],probe=touch?probeTouch:probeMouse;let firstLoss=null,round=0,newGameAfterLoss=null;
  const failed=r=>r.missing.length||r.problems.length||r.stuck?.length;
  for(let g=0;g<games;g++){await start();await table(p);
   const fresh=await probe(p,`${label} game ${g} T0`);rows.push({...fresh,action:'new game'});if(firstLoss&&newGameAfterLoss===null)newGameAfterLoss={missing:fresh.missing.length,hovered:fresh.hovered??fresh.tapped};
   for(let n=0;n<maxRounds;n++){
    const s=await p.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');if(s.over||s.eliminated)break;
    const chosen=ACTIONS[round%ACTIONS.length],action=touch&&chosen.startsWith('rest')?'let it run':chosen;round++;
    let confirm=null,rested=null,race=null;
    if(action==='rest on the (i) of the card sent')confirm=async()=>{rested=await restOn(p);await enterOnConfirm(p);};
    if(action==='rest on the (i) of an object')confirm=async()=>{const st=await p.state(),it=st.hits.filter(x=>x.kind==='item').at(-1),pt=it&&visiblePoint(it,st.hits);if(pt){await p.page.mouse.move(pt.x,pt.y);rested=await restOn(p);}await enterOnConfirm(p);};
    // The only way with the mouse alone: ✓ pressed, then straight onto the (i) of what the round may remove, as fast as the tool can.
    if(action==='to the (i) right after ✓, mouse only')confirm=async card=>{const st=await p.state(),it=st.hits.filter(x=>x.kind==='item'&&x.target.owner===st.me).at(-1)??st.hits.find(x=>x.id===card.key),pt=it&&visiblePoint(it,st.hits);const from=p.received?.length??0;await p.page.getByTestId('confirm').click();const t0=Date.now();if(pt){await p.page.mouse.move(pt.x,pt.y);rested=await restOn(p);}
     const view=(p.received??[]).slice(from).find(f=>f.command==='MESSAGE'&&/\/view$/.test(f.headers.destination));race={afterClickMs:Date.now()-t0,viewAfterClickMs:view?view.at-t0:null};};
    try{await playOne(p,null,confirm);}catch(e){if(!String(e).includes('no playable card'))throw e;rows.push({where:`${label} T${s.turn}`,action,noValidMove:true,missing:[],problems:[]});break;}
    const t=await p.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'resolved');if(!t)break;
    const st=await p.state(),running=st.sequence.running,at=`${label} game ${g} T${st.turn}`;
    if(running){const h=st.hits.find(x=>x.kind==='hand'),pt=h&&visiblePoint(h,st.hits);
     if(action==='tap')for(let k=0;k<2;k++){const e=await spotFree(p,await p.state());if(touch)await p.page.touchscreen.tap(e.x,e.y);else await p.page.mouse.click(e.x,e.y);await p.page.waitForTimeout(80);}
     if(action==='skip'){await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Salta effetti'}).click();}
     if(action==='card during the sequence'&&pt){if(touch)await p.page.touchscreen.tap(pt.x,pt.y);else await p.page.mouse.click(pt.x,pt.y);await p.page.waitForTimeout(80);await p.page.keyboard.press('Escape');}
     if(action==='inspection during the sequence'&&pt&&!touch&&!st.over&&!st.eliminated){await p.page.mouse.move(pt.x,pt.y);if(await infoLabel(p)){await infoButton(p).first().click();await p.page.waitForTimeout(250);await p.page.keyboard.press('Escape');}}
     if(action==='rest on the (i) through the close-ups'&&pt){await p.page.mouse.move(pt.x,pt.y);await restOn(p);}
    }
    await p.wait(x=>!x||!x.sequence?.running,23000,'sequence end').catch(()=>{});await p.page.waitForTimeout(60);
    const now=await p.state();if(!now||now.over||now.eliminated)break;
    const r=await probe(p,at);rows.push({...r,action,running,rested,race});
    if(failed(r)){console.log('INFO LOST',JSON.stringify({at,action,rested,race,missing:r.missing,stuck:r.stuck,problems:r.problems}));if(!firstLoss){firstLoss={at,action,rested,missing:r.missing,stuck:r.stuck,problems:r.problems};await p.shot(`info-lost-${label}`);}}
   }
   const left=await p.state();
   if(left?.over||left?.eliminated){const hub=p.page.getByRole('button',{name:'Torna all’hub'});if(await hub.count())await hub.first().click();else await p.page.goto(`${url}#/`);await p.page.getByTestId('quick').waitFor({timeout:15000});}
   else{await p.page.keyboard.press('Escape');await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
  }
  const lost=rows.filter(failed);
  return {rounds:rows.length,lost:lost.length,firstLoss,newGameAfterLoss,byAction:Object.fromEntries([...ACTIONS,'new game'].map(a=>[a,{rounds:rows.filter(r=>r.action===a).length,lost:rows.filter(r=>r.action===a&&failed(r)).length}])),hovered:rows.reduce((n,r)=>n+(r.hovered??r.tapped??0),0),pressed:rows.reduce((n,r)=>n+(r.pressed??0),0),gaveWay:rows.reduce((n,r)=>n+(r.gave?.length??0),0),rows};
 }
 const startDuel=p=>async()=>{await p.page.getByRole('radio',{name:'Contro il computer'}).click();await p.page.getByTestId('quick').click();};
 if(run('info')){
  const r=await infoGames(A,'duel',{start:startDuel(A)});evidence.scene.info=r;step('infoDuel',{rounds:r.rounds,lost:r.lost,firstLoss:r.firstLoss,newGameAfterLoss:r.newGameAfterLoss,byAction:r.byAction,hovered:r.hovered,pressed:r.pressed});
 }
 if(run('infoFfa')){
  const r=await infoGames(A,'ffa',{start:async()=>{await joinFfa(A);await waitList(A,1);await addComputers(A,4);},games:1});evidence.scene.infoFfa=r;step('infoFfa',{rounds:r.rounds,lost:r.lost,firstLoss:r.firstLoss,byAction:r.byAction,hovered:r.hovered,pressed:r.pressed});
 }
 // iPhone emulated: touch, no hover, 844×390, on its own context with the other account.
 if(run('infoTouch')){
  const phone=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true,deviceScaleFactor:2}),page=await phone.newPage();page.on('pageerror',e=>evidence.errors.push(`touch: ${e}`));
  const T={name:'T',user:accounts.B.user,password:accounts.B.password,page,context:phone,sent:[],received:[]};
  page.on('websocket',ws=>{ws.on('framesent',f=>T.sent.push(...stompFrames(f.payload)));});
  T.state=()=>page.evaluate(()=>window.__bm?.state??null);T.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await T.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`T: timeout ${what}`);};
  T.shot=async n=>page.screenshot({path:`${out}/screens/resolution-${n}-touch.jpg`,type:'jpeg',quality:70});T.sends=(from=0)=>T.sent.slice(from).filter(f=>f.command==='SEND').map(f=>f.headers.destination);
  await login(T);
  const r=await infoGames(T,'touch',{start:startDuel(T),games:2,touch:true});evidence.scene.infoTouch=r;step('infoTouch',{rounds:r.rounds,lost:r.lost,firstLoss:r.firstLoss,byAction:r.byAction,tapped:r.hovered,pressed:r.pressed,gaveWay:r.gaveWay});
  await phone.close();
 }

 // 2. FFA: devAlice and four computers to the outcome, watching after the own death (a jump may follow).
 if(run('ffa')){
  await joinFfa(A);await waitList(A,1);await addComputers(A,4);await table(A);
  const game=readyId(A,/quick\/ffa\/ready$/);
  const r=await playToEnd(A,{shots:'ffa'});await A.shot('ffa-outcome');
  summarise('ffa',A,game,r);
  await toHub(A);
 }

 // 3. FFA: devAlice, devBob and three computers; both play turn 0, then both let the 30 s clock run out.
 // Only computers remain: the server resolves the rest in a chain and the next view jumps (observed in the plan).
 if(run('jump')){
  B=await open('B');await login(B);
  await joinFfa(A);await waitList(A,1);await joinFfa(B);await waitList(A,2);await addComputers(A,3);
  await Promise.all([table(A),table(B)]);const game=readyId(A,/quick\/ffa\/ready$/);assert.equal(game,readyId(B,/quick\/ffa\/ready$/));
  await Promise.all([A.wait(x=>x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000),B.wait(x=>x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000)]);
  await Promise.all([playOne(A),playOne(B)]);
  await Promise.all([A.wait(x=>x.turn>=1||x.over,60000,'turn 1'),B.wait(x=>x.turn>=1||x.over,60000,'turn 1')]);
  // Rule 4 between humans: during the sequence a card is chosen at the first tap and the 30 s clock goes on.
  const during=await A.state(),clock=async()=>Number((await A.page.locator('.clock:not(.away)').first().innerText().catch(()=>'')).match(/\d+/)?.[0]??NaN);
  // The HTML clock refreshes every 250 ms from the deadline of the view: read it once the new turn is shown.
  await A.page.waitForTimeout(300);const c0=await clock(),hand=during.hits.find(h=>h.kind==='hand');await A.page.mouse.click(hand.x-hand.w*.22,hand.y);await A.page.waitForTimeout(100);
  const chosen=await A.state();await A.page.waitForTimeout(2300);const c1=await clock();
  const rule4={runningAtTap:during.sequence.running,selected:chosen.selected===hand.id,end:chosen.sequence.ends.at(-1)??null,clockBefore:c0,clockAfter2s:c1};
  step('rule4WithClock',rule4);assert.ok(rule4.selected,'card chosen at the first tap');assert.ok(c1<c0,'clock goes on');if(rule4.runningAtTap)assert.equal(rule4.end.reason,'input');
  await A.page.keyboard.press('Escape');
  const t0=Date.now();
  await A.wait(x=>x.eliminated||x.over,60000,'A forfeit');
  // The chain resolves after the forfeits: wait for the outcome view.
  await A.page.waitForTimeout(3000);
  const end=await A.wait(x=>x.over,60000,'outcome after the chain').catch(()=>null);
  await A.shot('jump-after');
  const log=await A.log(),st=await A.state();
  const note=await A.page.locator('[data-testid=round-note]').count()?await A.text('[data-testid=round-note]'):null;
  const r={log,stats:st.stats,finals:[],watched:false,end:st,notes:note?[`panel: ${note}`]:[]};
  const a=summarise('jump',A,game,r);
  assert.match(note??'',/Risolti \d+ turni/,'outcome panel: line of the resolved turns');assert.equal(st.summary,null,'no summary after the jump');
  const jumps=a.rows.filter(x=>x.relation==='jump');
  step('jumpObserved',{secondsToForfeit:Math.round((Date.now()-t0)/1000),over:!!end,turnsFromTo:jumps.map(x=>`${x.from}→${x.turn}`),clientRelations:a.client.map(c=>`${c.key} ${c.relation}`),sceneK2:evidence.scene.jump.k2,note,rule4});
  // C3-6: «Ultimo turno» after the jump: how many turns were resolved, the moves of the last one, no change, object or death, the server's text.
  const jr=await reportDialog(A,game,{via:'panel',scope:'jump'});step('jumpDialog',{turn:jr.turn,advanced:jr.advanced,moves:jr.moves,note:jr.note,problems:jr.problems,type:jr.type,box:jr.box});await A.shot('jump-dialog');
  assert.deepEqual(jr.problems,[],'jump dialog');assert.ok(jr.advanced>1,'the dialog was read after a real jump');await jr.close();
  await toHub(A);await toHub(B).catch(()=>{});
 }

 // C3-4. FFA with devAlice, devBob and three computers, both humans playing every round and letting each sequence run:
 // five moves within the 20 s cap (D10 since D13) and the 30 s clock left to each human when the sequence ends (data for A2).
 if(run('humans')){
  if(!B){B=await open('B');await login(B);}
  await joinFfa(A);await waitList(A,1);await joinFfa(B);await waitList(A,2);await addComputers(A,3);
  await Promise.all([table(A),table(B)]);const game=readyId(A,/quick\/ffa\/ready$/);assert.equal(game,readyId(B,/quick\/ffa\/ready$/));
  const clockOf=async p=>Number((await p.page.locator('.clock:not(.away)').first().innerText().catch(()=>'')).match(/\d+/)?.[0]??NaN);
  const ready=x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')));
  const rounds=[],finals=[];
  for(let i=0;i<8;i++){
   const [sa,sb]=await Promise.all([A.wait(ready,60000,'A turn'),B.wait(ready,60000,'B turn')]);
   if(sa.over||sb.over||sa.eliminated||sb.eliminated)break;
   finals.push({turn:sa.turn,problems:finalState(sa,lastView(A,sa.turn)),summary:sa.summary?{key:sa.summary.key,seats:Object.keys(sa.summary.seats).length,texts:Object.values(sa.summary.seats).map(x=>x.texts.join(' '))}:null,running:sa.sequence.running});
   if(i===1){await A.shot('humans-choice');await B.shot('humans-choice');}
   // R03: a human without a valid move cannot pass (known limit): the round cannot be played, the measure stops there.
   try{await Promise.all([playOne(A),playOne(B)]);}catch(e){if(!String(e).includes('no playable card'))throw e;seen('noValidMove',`humans T${sa.turn}`);await A.page.keyboard.press('Escape');await B.page.keyboard.press('Escape');break;}
   const row=await Promise.all([A,B].map(async p=>{await p.wait(x=>!x||x.over||x.turn!==sa.turn,60000,'resolved');
    if(i===1)await p.page.waitForTimeout(1800).then(()=>p.shot('humans-sequence'));
    await p.wait(x=>!x||!x.sequence?.running,22000,'sequence end').catch(()=>{});const clock=await clockOf(p),st=await p.state();
    return {who:p.user,turn:st.turn,clockAtSequenceEnd:clock,end:st.sequence.ends.at(-1)??null,plan:st.stats.sequencePlans.at(-1)??null};}));
   rounds.push(...row);}
  const st=await A.state();
  for(const p of [A,B]){const s=await p.state();
   if(s&&!s.over&&!s.eliminated){await p.page.keyboard.press('Escape');await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
   else await toHub(p).catch(async()=>{await p.page.goto(`${url}#/`);await p.page.getByTestId('quick').waitFor({timeout:15000});});}
  const r={log:await A.log().catch(()=>[]),stats:st.stats,finals,watched:false,end:st,notes:[]};
  summarise('humans',A,game,r);
  // A round counts when the sequence measured is the one of that turn; a human out of the game (turn jump after an
  // elimination) has no clock left to read, so it is kept in the evidence but not measured.
  const played=rounds.filter(x=>x.end&&x.plan&&x.end.key===x.plan.key&&x.plan.key.endsWith(`/${x.turn}`)&&Number.isFinite(x.clockAtSequenceEnd));
  evidence.scene.humans.clock=rounds;
  const five=played.filter(x=>x.plan.moves===5);
  step('humansClock',{rounds:rounds.length,fiveMoves:five.map(x=>`${x.who} T${x.turn}: ${x.end.ms} ms (${x.end.reason})`),clockAtSequenceEnd:played.map(x=>`${x.who} T${x.turn} ${x.plan.moves} mosse ${x.end.ms} ms → ${x.clockAtSequenceEnd} s`)});
  // Under 10 s of clock left at the end of a sequence is reported (data for A2, rule 1.9 unchanged), not a failure.
  evidence.scene.humans.under10s=played.filter(x=>x.end.reason==='complete'&&x.clockAtSequenceEnd<10).map(x=>`${x.who} T${x.turn}: ${x.clockAtSequenceEnd} s`);
  for(const x of played){assert.ok(x.plan.total<=PACE.budget,`${x.who} T${x.turn}: within the cap`);if(x.end.reason==='complete')assert.ok(x.clockAtSequenceEnd>=30-Math.ceil(x.end.ms/1000)-2,`${x.who} T${x.turn}: the clock runs during the sequence (rule 4)`);}
 }

 // 4. Open 1vCom with synthetic decks (D8), saved through the editor on the temporary database.
 if(run('open')){
  const account=JSON.parse(A.messages('/user/queue/account/data').at(-1).body),names={},chars={};
  for(const c of account.collection.cards)names[c.bindingName]=c.name;for(const c of account.collection.characters)chars[c.bindingName]=c.name;
  const page=A.page,slot=async title=>{const s=page.locator('details.slot',{has:page.locator('summary',{hasText:title})});if(!(await s.evaluate(d=>d.open)))await s.locator('summary').click();return s;};
  const addRegular=async(binding,times)=>{await page.getByTestId('card-search').fill(binding);for(let i=0;i<times;i++)await page.getByRole('button',{name:`Aggiungi una copia di ${names[binding]}`,exact:true}).click();await page.getByTestId('card-search').fill('');};
  async function saveDeck(id,character,basic,bound,regular){
   await page.getByTestId('tab-collection').click();await page.getByTestId('new-deck').click();
   await page.getByTestId('deck-name').fill(id);
   await (await slot('Personaggio')).getByRole('button',{name:`Personaggio ${chars[character]}`,exact:true}).click();
   // R02 1.12: the basic comes with the character; checked, not chosen.
   assert.equal((await page.locator('details.slot summary',{hasText:'Azione base'}).locator('b').innerText()).trim(),names[basic],'basic of the character');
   await (await slot('Ultima risorsa')).getByRole('button',{name:`Ultima risorsa ${names['com.last.Struggle']}`,exact:true}).click();
   {const b=await slot('Azioni legate');for(const x of bound)await b.getByRole('button',{name:`Azione legata ${names[x]}`,exact:true}).click();}
   await slot('Mazzo regolare');for(const [x,k] of regular)await addRegular(x,k);
   const mark=A.sent.length;await page.getByTestId('save-deck').click();await page.getByTestId('deck-notice').waitFor({timeout:10000});
   assert.ok(A.sent.slice(mark).some(f=>f.command==='SEND'&&f.headers.destination.startsWith('/app/user/devAlice/deck')),'deck saved');
  }
  // R02 1.12 (SB-1): two copies at most and two bound cards. Up to C4 these decks had YouStop x7 or Steal x6 and one bound;
  // the same cases now come from wider families of cards: every cancel card of the set, every object, every theft.
  // Counters and objects (Bruiser): YouStop, WhatchaDoin and AmphetamineReflexes cancel later moves (Glare pays for them);
  // objects drawn to the table and grabbed; Cocktail and MarvelousCocktail bring the poison of the lethal end of turn.
  const counters=['bruiser.YouStop','bruiser.WhatchaDoin','junkie.AmphetamineReflexes','com.Grab','com.basic.BruiserGrab','bruiser.SuperImpact','bruiser.ExtremelyViolentBlow'];
  await saveDeck('C3 contrasti','bruiser.character.BigBadBruiser','com.basic.BruiserGrab',['bruiser.character.LittleRage','bruiser.character.LittleSmack'],
   [['bruiser.YouStop',2],['bruiser.WhatchaDoin',2],['junkie.AmphetamineReflexes',2],['bruiser.Glare',2],['com.items.CocktailOnTheGround',2],
    ['com.items.MarvelousCocktail',2],['com.items.AnotherRottenBeer',2],['com.Grab',2],['bruiser.SuperImpact',2],['bruiser.ExtremelyViolentBlow',2]]);
  // Theft and tokens (Junkie): Steal, BeggingMoney and ShuffleFeet on the computer's objects, AnotherRottenBeer creating a token, EverythingIsDrug.
  const theft=['com.Steal','junkie.BeggingMoney','com.ShuffleFeet','junkie.EverythingIsDrug','com.Grab','com.basic.ToxicGrab','junkie.MethDrivenRage','junkie.character.PatheticBlade'];
  await saveDeck('C3 furti','junkie.character.ToxicJunkie','com.basic.ToxicGrab',['junkie.character.PatheticBlade','junkie.character.RottenSmile'],
   [['com.Steal',2],['junkie.BeggingMoney',2],['com.ShuffleFeet',2],['com.items.AnotherRottenBeer',2],['junkie.EverythingIsDrug',2],
    ['com.items.MarvelousCocktail',2],['com.items.CocktailOnTheGround',2],['com.Grab',2],['junkie.MethDrivenRage',2],['junkie.GoingBerserk',2]]);
  const preferBy=list=>s=>{const own=s.hits.some(h=>h.kind==='item'&&h.target.owner===s.me),far=s.hits.some(h=>h.kind==='item'&&h.target.owner!==s.me);
   return name=>{const b=Object.entries(names).find(([,n])=>n===name)?.[0]??'';const i=list.indexOf(b);if(i<0)return 0;
    if(/Grab|EverythingIsDrug/.test(b)&&!own)return -1;if(/Steal|BeggingMoney/.test(b)&&!far)return -1;return list.length-i;};};
  for(const [id,list] of [['C3 contrasti',counters],['C3 furti',theft]]){
   await page.getByTestId('tab-play').click();await page.getByRole('radio',{name:'Con un tuo mazzo'}).click();
   await page.getByTestId('quick').click();await page.getByTestId('deck-dialog').waitFor();
   await page.getByRole('radio',{name:new RegExp(`^${id} `)}).click();await page.getByTestId('start-open').click();
   await table(A);const game=readyId(A,/open\/1vCom\/ready$/);
   const label=`open ${id}`;const r=await playToEnd(A,{prefer:preferBy(list),shots:id.replace(/\W+/g,'-').toLowerCase()});
   await A.shot(`${id.replace(/\W+/g,'-').toLowerCase()}-outcome`);
   summarise(label,A,game,r);
   if(!r.left)await toHub(A);
  }
 }

 evidence.reportConsistency={rounds:reports.length,sumOk:reports.filter(x=>x.sumOk).length,chainOk:reports.filter(x=>x.chainOk).length,unknownCost:reports.filter(x=>x.unknownCost).length,failures:reports.filter(x=>!x.chainOk)};
 step('reportConsistency',{rounds:reports.length,sumOk:evidence.reportConsistency.sumOk,chainOk:evidence.reportConsistency.chainOk});
 evidence.cases=cases;
 const wanted=['impactHIT','impactRole','impactVoid','impactCUT','outcomeBanner','void','itemConsumed','itemFromOther','drawnToTable','death','deathWithMove','lethalEndOfTurn','boundDiscard','over','jump','rejoinSame'];
 step('casesOnRealServer',{seen:Object.fromEntries(Object.entries(cases).map(([k,v])=>[k,v.length])),missing:wanted.filter(k=>!cases[k])});
 for(const k of ['info','infoFfa','infoTouch'])if(evidence.scene[k])assert.equal(evidence.scene[k].lost,0,`${k}: the (i) or the inspection lost at ${JSON.stringify(evidence.scene[k].firstLoss)}`);
 assert.deepEqual(evidence.errors,[],'no page errors');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);
 for(const p of [A,B].filter(Boolean))await p.shot(`failure-${p.name}`).catch(()=>{});}
finally{
 evidence.cases=cases;
 await writeFile(`${out}/resolution${tag}.json`,JSON.stringify(evidence,null,1));
 // C3-4: the account catalog (names and nominal costs, also of the computers' cards) for the unit tests of the timeline.
 if(recorded&&!recorded.catalog&&A)try{const c=catalogOf(A);if(c.length)recorded.catalog=c.map(slimCard);}catch{}
 if(recorded){recorded.source='client-web/tools/verify-resolution.mjs with BM_RECORD=1 on the real server (temporary database); card objects trimmed to the fields the model reads, everything else as received';await writeFile(recordPath,JSON.stringify(recorded,null,1));}
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

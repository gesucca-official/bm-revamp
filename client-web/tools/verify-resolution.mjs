// C3-1 end-to-end check against the REAL server: the pure resolution model (src/resolution.ts) on real games.
// C3-4: each sequence animates what the timeline of the facts says (cards, voids, cost tokens, objects, draws, end of
// turn, per-card bars only when the report lines verify) and ends on the view; scenario `humans` measures the 30 s clock.
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
import {resolve,mismatches,timeline,beats} from '../src/resolution.ts';

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
async function playOne(p,prefer){
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
  const before=moves();await page.getByTestId('confirm').click();
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
  // C3-4: the steps of one sequence (costs, first card hitting, the end) captured while it runs.
  if(n===3){const t0=Date.now(),plan=(await p.state())?.stats.sequencePlans.at(-1);if((await p.state())?.sequence.running&&plan){
   for(const [name,at] of [['costs',350],['card',1300],['tail',plan.total-500]]){const wait=at-(Date.now()-t0);if(wait>0)await p.page.waitForTimeout(wait);if(!(await p.state())?.sequence.running)break;await p.shot(`${shots}-sequence-${name}`);}}}
  // Let the round's sequence run to its end (up to 10 s, D10), so that its completion is measured.
  await p.wait(x=>!x||!x.sequence?.running,12000,'sequence end').catch(()=>{});
 }
 await p.wait(x=>!x||!x.sequence?.running,12000,'sequence end').catch(()=>{});
 const end=await p.state();
 // D4 on the outcome panel (a death with only computers left is followed by the whole chain at once).
 if(end.over||end.eliminated){const panel=await p.page.locator('[data-testid=round-note]').count()?await p.text('[data-testid=round-note]'):'';if(panel)notes.add(`panel: ${panel}`);}finals.push({turn:end.turn,problems:finalState(end,lastView(p,end.turn)),summary:end.summary?{key:end.summary.key,seats:Object.keys(end.summary.seats).length,texts:Object.values(end.summary.seats).map(x=>x.texts.join(' '))}:null,running:end.sequence.running});
 await p.page.waitForTimeout(300);
 return {log:await p.log(),stats:end.stats,finals,watched,end,noValidMove,notes:[...notes]};
}
const lastView=(p,turn)=>p.views().filter(v=>v.turn===turn).at(-1);
const catalogOf=p=>{const acc=p.messages('/user/queue/account/data').at(-1);return acc?JSON.parse(acc.body).collection?.cards??[]:[];};
function summarise(label,p,game,r,{expectSequences=true,quiet=new Set()}={}){
 const a=analyse(label,p,game,r.log,catalogOf(p),{expectSequences,quiet});
 const rule2=r.finals.filter(f=>f.problems.length);
 // C3-2: how each sequence ended, the static summary at each choice, the line after a jump.
 const ends=r.stats.sequenceEnds??[],relation=Object.fromEntries((r.log??[]).filter(e=>e.facts.relation!=='same').map(e=>[e.facts.key,e.facts]));
 const c32=[];
 const plans=Object.fromEntries((r.stats.sequencePlans??[]).map(x=>[x.key,x]));
 for(const e of ends){if(e.reason==='view')c32.push(`${e.key}: ended by a view (K1)`);const plan=plans[e.key];
  // C3-2 revision: a completed sequence lasts what its plan says (one card at a time), never more than 10 s (D10).
  if(e.reason==='complete'&&plan&&Math.abs(e.ms-plan.total)>250)c32.push(`${e.key}: completed in ${e.ms} ms, planned ${plan.total}`);}
 for(const x of Object.values(plans))if(x.total>10000)c32.push(`${x.key}: planned ${x.total} ms with ${x.moves} moves`);
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
  rounds34.push({key:b.key,moves:b.drops,bars:b.bars,reason:b.reason,planned:plans[b.key]?.total??null,ms:endOf[b.key]?.ms??null,end:endOf[b.key]?.reason??null,
   beats:Object.fromEntries(Object.entries(b).filter(([k,v])=>!['key','bars','reason'].includes(k)&&v))});}
 for(const f of r.finals){if(!f.turn)continue;const key=`${game}/${f.turn}`,facts=relation[key];if(!facts)continue;
  if(facts.relation==='next'&&!f.summary)c32.push(`${key}: no static summary at the choice`);
  if(facts.relation==='next'&&f.summary&&(f.summary.key!==key||f.summary.seats!==Object.keys(facts.seats).length))c32.push(`${key}: summary of ${f.summary.key} with ${f.summary.seats} seats`);
  if(facts.relation!=='next'&&f.summary)c32.push(`${key}: summary after a ${facts.relation}`);}
 const jumps=(r.log??[]).filter(e=>e.facts.relation==='jump').map(e=>e.facts.key);
 const sceneRules={1:a.rules[1],2:rule2.map(f=>`T${f.turn}: ${f.problems.join(', ')}`),3:a.rules[3],6:a.rules[6],c32,c34};
 evidence.games[label]={timerOrderOnly:a.timerOrderOnly,noValidMove:r.noValidMove??null,gameId:game,turnsSeen:a.turns,views:a.views,rows:a.rows,client:a.client,watched:r.watched,outcome:{over:r.end.over,winner:r.end.winner,eliminated:r.end.eliminated}};
 evidence.scene[label]={rules:Object.fromEntries(Object.entries(sceneRules).map(([k,v])=>[k,{ok:!v.length,violations:v}])),
  k1:{sequences:r.stats.sequences,cancelledByView:a.k1.length,sequenceMs:r.stats.sequenceMs,cancels:r.stats.cancels},sequenceEnds:ends,summariesAtChoice:r.finals.map(f=>({turn:f.turn,summary:f.summary})),jumps,notes:r.notes??[],k2:a.k2,k6:{modelRounds:a.k6,sceneHealthDeltas:r.stats.aggregateDeltas,sceneTransfers:r.stats.transfers,note:'the scene shows only HEALTH totals and one-to-one transfers; costs, other resources, draws, voids and end of turn are not in the scene'},flights:r.stats.flights,transfers:r.stats.transfers,aggregateDeltas:r.stats.aggregateDeltas,rounds:rounds34};
 step(label,{gameId:game,turns:a.turns,views:a.views,modelProblems:a.problems,repeatedViewDiffs:a.repeated,timerOrderOnly:a.timerOrderOnly,scene:evidence.scene[label].rules,k1:`${a.k1.length} of ${r.stats.sequences} sequences cancelled by view`,ends:Object.entries(ends.reduce((m,e)=>(m[e.reason]=(m[e.reason]??0)+1,m),{})).map(([k,v])=>`${k} ${v}`).join(', '),msComplete:ends.filter(e=>e.reason==='complete').map(e=>e.ms),
  bars:`${rounds34.filter(x=>x.bars==='per-card').length} per card, ${rounds34.filter(x=>x.bars==='total').length} total`,notes:r.notes});
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

 // K3: reduced motion emulated, three rounds of quick 1vCom, then abandon. No sequence; the static summary is there.
 if(run('reduced')){
  await A.page.emulateMedia({reducedMotion:'reduce'});
  await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();await table(A);
  const game=readyId(A,/quick\/1vCom\/ready$/),rounds=[];
  for(let i=0;i<3;i++){const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');if(s.over||s.eliminated)break;
   await playOne(A);const t=await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'resolved');await A.page.waitForTimeout(300);
   const st=await A.state(),toast=await A.page.locator('.toast').count(),f=(await A.log()).filter(e=>e.facts.relation==='next'&&e.facts.turn===st.turn).at(-1)?.facts;rounds.push({turn:st.turn,sequences:st.stats.sequences,aggregateDeltas:st.stats.aggregateDeltas,modelSeats:!!f?.seats,modelChanges:f?.seats?Object.values(f.seats).reduce((n,x)=>n+Object.values(x.resources).filter(c=>c.delta).length,0):0,summaryKey:st.summary?.key??null,summary:st.summary?Object.values(st.summary.seats).map(x=>x.texts.join(' ')):null,expectedKey:`${game}/${st.turn}`,toast});void t;}
  await A.shot('reduced-motion');
  const st=await A.state();
  if(!st.over&&!st.eliminated){await A.page.keyboard.press('Escape');await A.page.getByLabel('Apri menu').click();await A.page.getByRole('button',{name:'Abbandona la partita'}).click();await A.page.getByRole('button',{name:'Sì, abbandona'}).click();await A.page.getByTestId('quick').waitFor({timeout:15000});}
  else await toHub(A);
  await A.page.emulateMedia({reducedMotion:'no-preference'});
  evidence.scene.reduced={gameId:game,rounds};
  // C3-2 (K3 fixed): no sequence, and the static summary of every round on the table.
  for(const x of rounds){assert.equal(x.sequences,0,'reduced motion: no sequence');assert.equal(x.summaryKey,x.expectedKey,`reduced motion: summary of turn ${x.turn}`);}
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
  if(await round('tap',async st=>{const plan=st.stats.sequencePlans.at(-1),stops=plan.moves+3;let taps=0;
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
  await toHub(A);await toHub(B).catch(()=>{});
 }

 // C3-4. FFA with devAlice, devBob and three computers, both humans playing every round and letting each sequence run:
 // five moves within 10 s (D10) and the 30 s clock left to each human when the sequence ends (data for A2).
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
   await Promise.all([playOne(A),playOne(B)]);
   const row=await Promise.all([A,B].map(async p=>{await p.wait(x=>!x||x.over||x.turn!==sa.turn,60000,'resolved');
    if(i===1)await p.page.waitForTimeout(1800).then(()=>p.shot('humans-sequence'));
    await p.wait(x=>!x||!x.sequence?.running,12000,'sequence end').catch(()=>{});const clock=await clockOf(p),st=await p.state();
    return {who:p.user,turn:st.turn,clockAtSequenceEnd:clock,end:st.sequence.ends.at(-1)??null,plan:st.stats.sequencePlans.at(-1)??null};}));
   rounds.push(...row);}
  const st=await A.state();
  for(const p of [A,B]){const s=await p.state();
   if(s&&!s.over&&!s.eliminated){await p.page.keyboard.press('Escape');await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
   else await toHub(p).catch(async()=>{await p.page.goto(`${url}#/`);await p.page.getByTestId('quick').waitFor({timeout:15000});});}
  const r={log:await A.log().catch(()=>[]),stats:st.stats,finals,watched:false,end:st,notes:[]};
  summarise('humans',A,game,r);
  const played=rounds.filter(x=>x.end&&x.plan&&x.end.key===x.plan.key);
  evidence.scene.humans.clock=rounds;
  const five=played.filter(x=>x.plan.moves===5);
  step('humansClock',{rounds:rounds.length,fiveMoves:five.map(x=>`${x.who} T${x.turn}: ${x.end.ms} ms (${x.end.reason})`),clockAtSequenceEnd:played.map(x=>`${x.who} T${x.turn} ${x.plan.moves} mosse ${x.end.ms} ms → ${x.clockAtSequenceEnd} s`)});
  for(const x of played){assert.ok(x.plan.total<=10000,`${x.who} T${x.turn}: within 10 s`);if(x.end.reason==='complete')assert.ok(x.clockAtSequenceEnd>=30-Math.ceil(x.end.ms/1000)-2,`${x.who} T${x.turn}: the clock runs during the sequence (rule 4)`);}
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
   await (await slot('Azione base')).getByRole('button',{name:`Azione base ${names[basic]}`,exact:true}).click();
   await (await slot('Ultima risorsa')).getByRole('button',{name:`Ultima risorsa ${names['com.last.Struggle']}`,exact:true}).click();
   if(bound.length){const b=await slot('Azioni legate');for(const x of bound)await b.getByRole('button',{name:`Aggiungi l’azione legata ${names[x]}`,exact:true}).click();}
   await slot('Mazzo regolare');for(const [x,k] of regular)await addRegular(x,k);
   const mark=A.sent.length;await page.getByTestId('save-deck').click();await page.getByTestId('deck-notice').waitFor({timeout:10000});
   assert.ok(A.sent.slice(mark).some(f=>f.command==='SEND'&&f.headers.destination.startsWith('/app/user/devAlice/deck')),'deck saved');
  }
  // Counters and objects (Bruiser): YouStop cancels later moves, objects drawn to the table and grabbed.
  const counters=['bruiser.YouStop','bruiser.WhatchaDoin','com.Grab','com.basic.BruiserGrab','bruiser.SuperImpact'];
  await saveDeck('C3 contrasti','bruiser.character.BigBadBruiser','com.basic.BruiserGrab',['bruiser.character.LittleRage'],[['bruiser.YouStop',7],['com.items.CocktailOnTheGround',5],['com.Grab',3],['bruiser.WhatchaDoin',2],['bruiser.SuperImpact',3]]);
  // Theft and tokens (Junkie): Steal on the computer's objects, AnotherRottenBeer creating a token, EverythingIsDrug.
  const theft=['com.Steal','junkie.EverythingIsDrug','com.basic.ToxicGrab','junkie.MethDrivenRage','junkie.character.PatheticBlade'];
  await saveDeck('C3 furti','junkie.character.ToxicJunkie','com.basic.ToxicGrab',['junkie.character.PatheticBlade'],[['com.Steal',6],['com.items.AnotherRottenBeer',5],['junkie.EverythingIsDrug',3],['com.items.MarvelousCocktail',2],['junkie.MethDrivenRage',4]]);
  const preferBy=list=>s=>{const own=s.hits.some(h=>h.kind==='item'&&h.target.owner===s.me),far=s.hits.some(h=>h.kind==='item'&&h.target.owner!==s.me);
   return name=>{const b=Object.entries(names).find(([,n])=>n===name)?.[0]??'';const i=list.indexOf(b);if(i<0)return 0;
    if(/Grab|EverythingIsDrug/.test(b)&&!own)return -1;if(b==='com.Steal'&&!far)return -1;return list.length-i;};};
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
 const wanted=['void','itemConsumed','itemFromOther','drawnToTable','death','deathWithMove','lethalEndOfTurn','boundDiscard','over','jump','rejoinSame'];
 step('casesOnRealServer',{seen:Object.fromEntries(Object.entries(cases).map(([k,v])=>[k,v.length])),missing:wanted.filter(k=>!cases[k])});
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

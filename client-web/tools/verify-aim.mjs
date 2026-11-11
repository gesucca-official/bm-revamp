// C3-3 (O6) end-to-end check against the REAL server: arrows from the chosen or dragged card to the admitted targets.
// Like VerifyResolution it starts the server itself on a temporary database (the local data is never touched) and stops it
// at the end. Scenarios (BM_SCENARIOS): duel (quick 1vCom, mouse), touch (quick 1vCom, emulated touch), reduced (quick 1vCom, reduced
// motion), ffa (five seats with four computers, mouse). For every card of the hand, at several turns, the scene is asked what it
// draws and the answer is compared with the targets the VIEW admits (computed here from the categories of the card in the wire
// view, not from the client's own call):
//  - number and destination: one arrow per admitted character and, for a card that takes an object, one per seat that has some;
//    each tip at the border of its target, the whole arrow (curve and head) inside the screen;
//  - clear of the old place of the ✓ and × buttons (the rectangles of the base of C4-1b) outside the card itself; C4-2: ✓ and × on the chosen card, reachable, off the target (confirmPass);
//  - no arrow when the choice is locked (move pending, the choice cancelled) and after an interruption of the drag (window blur);
//  - pulse in normal motion, a constant layer with reduced motion;
//  - aiming with the mouse (drag, tap) and with emulated touch (tap, CDP touch drag) as before; reordering and cancelling send nothing;
//  - D12: choosing a card while the sequence of the round runs closes it and leaves the card chosen, with its arrows;
//  - performance of a mouse drag with arrows (frame intervals and input-to-frame from the scene, cost of each redraw).
//  - C4-8a, rule 12 (keyboard, keyboard-motion, keyboard-ffa): a whole game from the keyboard only, the focus never lost while a choice can be made, the hand first in the order of Tab;
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
// BM_SERVER_PORT runs the temporary server on another port (with a preview on BM_PORT proxying to it via BM_SERVER).
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';
import assert from 'node:assert/strict';
import {bezier,confirmBox,overlap,previewSpot} from '../src/readability.ts';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c3/c3-3';
const accounts={A:{user:'devAlice',password:'local-alice'},B:{user:'devBob',password:'local-bob'}};
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
const only=process.env.BM_SCENARIOS?.split(',');
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright) against the local server started by this script on a temporary database; real 30 s waits; not a physical device',scenarios:{},checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,700));};

// --- Server on a temporary database (same command as scripts/dev.ps1 -Task Server -SeedAccounts) ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-aim-'));
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
async function open(name,opts={}){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh},...opts}),page=await context.newPage();
 const p={name,user,password,page,context,sent:[],received:[]};
 page.on('pageerror',e=>evidence.errors.push(`${name}: ${e}`));
 page.on('websocket',ws=>{ws.on('framesent',f=>p.sent.push(...stompFrames(f.payload)));ws.on('framereceived',f=>p.received.push(...stompFrames(f.payload)));});
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.log=()=>page.evaluate(()=>window.__bm?JSON.parse(JSON.stringify(window.__bm.resolutions)):null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/aim-${n}${tag}.jpg`,type:'jpeg',quality:70});
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

// --- Aim checks ---
const problems=[];const bad=(scope,msg)=>{problems.push(`${scope}: ${msg}`);console.log('PROBLEM',scope,msg);};
const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s.length?s[Math.min(s.length-1,Math.floor(s.length*p))]:null;};
const view=(p,s)=>p.views().filter(v=>v.turn===s.turn).at(-1);
const inScreen=pt=>pt.x>=0&&pt.x<=vw&&pt.y>=0&&pt.y<=vh;
const inBox=(pt,b,pad=0)=>Math.abs(pt.x-b.x)<=b.w/2+pad&&Math.abs(pt.y-b.y)<=b.h/2+pad;
const samples=a=>Array.from({length:25},(_,i)=>bezier(a.from,a.control,a.to,i/24));
const movesSent=p=>p.sends().filter(d=>/\/app\/game\/[^/]+\/move$/.test(d)).length;
// What the VIEW admits for the card: the categories of the card in the wire view, the state of every seat. Independent of Model.allows.
function expected(s,v,name){
 const card=v.players[s.me].cardsInHand.find(c=>c.name===name),cats=new Set(card?.canTarget??[]),out=[];
 for(const [id,pl] of Object.entries(v.players)){if(pl.character.dead||v.forfeits[id])continue;const own=id===s.me,n=pl.character.items.length;
  if(cats.has(own?'SELF':'OPPONENT'))out.push(`person-${id}`);
  if(n&&cats.has(own?'NEAR_ITEM':'FAR_ITEM'))out.push(`item-${id}-${n-1}`);}
 return out;
}
const tapAt=async(p,h,touch,dx=-.22)=>{const c=h.kind==='hand'?{x:h.x+h.w*dx,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};
 if(touch)await p.page.touchscreen.tap(c.x,c.y);else await p.page.mouse.click(c.x,c.y);await p.page.waitForTimeout(70);
 if(await dialogOpen(p)){await p.page.keyboard.press('Escape');await p.page.waitForTimeout(70);}};
// A point on the visible part of a hand card that selects it: the fan covers part of each card, so a few offsets are tried.
const OFFSETS=[-.22,-.34,-.1,.02,.16,-.42];
async function grab(p,key,touch){
 for(const f of OFFSETS){const s=await p.state(),h=s.hits.find(x=>x.id===key);if(!h)return null;const pt={x:h.x+h.w*f,y:h.y};
  if(touch)await p.page.touchscreen.tap(pt.x,pt.y);else await p.page.mouse.click(pt.x,pt.y);await p.page.waitForTimeout(90);
  if(await dialogOpen(p)){await p.page.keyboard.press('Escape');await p.page.waitForTimeout(70);}
  const t=await p.state();await p.page.keyboard.press('Escape');await p.page.waitForTimeout(70);
  if(t.selected===key)return pt;}
 return null;
}
const settle=async(p,ms=110)=>{await p.page.waitForTimeout(ms);return p.state();};
// C4-2: ✓ and × now lie on the card, but the arrows keep clear of their old place as C3-3 asks: the rectangles this check read from the DOM at the base of C4-1b (both heights of the text, as one rectangle).
const reserved=s=>{const L=s.layout,c=confirmBox(L.preview,vw,L.compact),left=c.x-c.w/2,top=c.y-c.h/2,[a,b]=L.compact?[66.4,118.4]:[80.8,150.9];return {buttons:{x:left+52,y:top+(a+b)/2,w:104,h:b-a},panel:c};};
const rectBox=r=>({x:r.x,y:r.y,w:r.w,h:r.h});
// C4-2: for every target the card admits: ✓ and × at least 44 px, on the screen and the topmost thing at their centre, the card off the target, no arrow, no close-up running, the text of the move at the foot of the table, clear of the seats and the hand. With the mouse also a drop: the card lies where the pure function puts it for that drop point.
async function confirmPass(p,touch,scope){
 const s0=await p.state(),v=view(p,s0),out=[];if(!v)return out;
 const count=(x,how)=>expected(s0,v,x.name).filter(id=>id.startsWith(how)).length,best=how=>[...s0.cards].sort((a,b)=>count(b,how)-count(a,how))[0],picks=[...new Set([best('person-'),best('item-')])].filter(x=>x&&expected(s0,v,x.name).length);if(!picks.length){bad(scope,'no card with a target for the confirmation');return out;}
 let c=picks[0];
 const read=()=>p.page.evaluate(()=>{const box=e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height};},card=document.querySelector('.confirmation'),strip=document.querySelector('.hint.confirming');
  return {card:card&&box(card),strip:strip&&box(strip),text:strip?.textContent??'',buttons:[...document.querySelectorAll('.confirmation button')].map(b=>{const q=box(b),top=document.elementFromPoint(q.x,q.y);return {w:b.offsetWidth,h:b.offsetHeight,...{x:q.x,y:q.y},reach:!!top&&(top===b||b.contains(top))};})};});
 const check=async(id,hit,t,label)=>{const r=await read(),row={card:c.name,target:id,how:label,spot:t.preview,buttons:r.buttons.map(b=>({w:b.w,h:b.h,reach:b.reach}))};out.push(row);
  if(t.arrows.length)bad(scope,`${id}: ${t.arrows.length} arrows once a target is chosen`);
  // After C4-2: one arrow of the same style from the card to the target, its tip at the target's border, on the screen.
  const ca=t.confirmArrow;if(!ca)bad(scope,`${id}: no arrow from the card to its target`);else{const near=(q,b,pad)=>Math.abs(q.x-b.x)<=b.w/2+pad&&Math.abs(q.y-b.y)<=b.h/2+pad;row.arrow={from:ca.from,to:ca.to};if(!near(ca.to,rectBox(t.hits.find(h=>h.id===id)??hit),8))bad(scope,`${id}: the arrow ends off its target ${JSON.stringify(ca.to)}`);if(!near(ca.from,{x:t.preview.x,y:t.preview.y,w:t.layout.preview.w,h:t.layout.preview.h},8))bad(scope,`${id}: the arrow does not start at the card ${JSON.stringify(ca.from)}`);for(const q of [ca.from,ca.control,ca.to])if(!inScreen(q))bad(scope,`${id}: the arrow leaves the screen`);}
  if(t.sequence.running)bad(scope,`${id}: a close-up can run with the confirmation up`);
  if(!r.card||r.buttons.length!==2){bad(scope,`${id}: no ✓ and × on the card`);return row;}
  for(const b of r.buttons){if(Math.min(b.w,b.h)<44)bad(scope,`${id}: control ${b.w}×${b.h} under 44 px`);if(!b.reach)bad(scope,`${id}: control covered at its centre`);if(!inScreen(b))bad(scope,`${id}: control off the screen`);}
  if(overlap(r.card,rectBox(hit))>0)bad(scope,`${id}: the card covers its target ${JSON.stringify(r.card)} ${JSON.stringify(rectBox(hit))}`);
  if(!r.text.includes(c.name))bad(scope,`${id}: the text of the move lacks the card: ${r.text}`);
  if(!r.strip)bad(scope,`${id}: no text of the move`);else{for(const st of t.layout.seats)for(const x of [st.person,st.board,...st.items])if(overlap(r.strip,x)>0)bad(scope,`${id}: the text of the move over a seat`);if(r.strip.x+r.strip.w/2>t.layout.hand.center-(t.layout.hand.w*t.layout.hand.zoom+6*t.layout.hand.step)/2)bad(scope,`${id}: the text of the move over the hand`);}
  return row;};
 for(c of picks)for(const id of expected(s0,v,c.name)){
  let t=await p.state();if(t.selected!==c.key){const own=t.hits.find(h=>h.id===c.key);if(!own)break;await tapAt(p,own,touch);t=await settle(p);}
  if(t.selected!==c.key)continue;const hit=t.hits.find(h=>h.id===id);if(!hit)continue;await tapAt(p,hit,touch);t=await settle(p);if(!t.target){await p.page.keyboard.press('Escape');await settle(p);continue;}
  await check(id,hit,t,touch?'tap (touch)':'tap');await p.page.keyboard.press('Escape');await settle(p);}
 c=picks[0];if(!touch){const t0=await p.state(),own=t0.hits.find(h=>h.id===c.key),id=expected(t0,v,c.name).find(x=>x.startsWith('person-')),hit=id&&t0.hits.find(h=>h.id===id);
  if(own&&hit){const drop={x:hit.x-hit.w*.3,y:hit.y+hit.h*.3};await p.page.mouse.move(own.x-own.w*.22,own.y);await p.page.mouse.down();await p.page.mouse.move(drop.x,drop.y,{steps:8});await p.page.mouse.up();const t=await settle(p,160);
   if(t.target){const row=await check(id,hit,t,'drop');const far=(q,o)=>Math.hypot(q.x-o.x,q.y-o.y);row.fromDrop=Math.round(far(t.preview,drop));row.oldFromDrop=Math.round(far(t.layout.preview,drop));const want=previewSpot(t.layout,vw,vh,rectBox(hit),drop);if(want.x!==t.preview.x||want.y!==t.preview.y)bad(scope,`${id}: the card at ${JSON.stringify(t.preview)}, for the drop point at ${JSON.stringify(want)}`);}
   await p.page.keyboard.press('Escape');await settle(p);}}
 return out;
}
function checkArrows(scope,s,v,card,{buttons,panel,source}={}){
 const want=expected(s,v,card.name).sort(),got=s.arrows.map(a=>a.id).sort();
 if(JSON.stringify(want)!==JSON.stringify(got))bad(scope,`${card.name}: arrows ${JSON.stringify(got)} but the view admits ${JSON.stringify(want)}`);
 let reached=0,crossPanel=0;
 for(const a of s.arrows){
  const hit=s.hits.find(h=>h.id===a.id);if(!hit){bad(scope,`${card.name}: arrow ${a.id} without a target on the table`);continue;}
  if(a.reached){reached++;continue;}
  const dx=Math.max(Math.abs(a.to.x-hit.x)-hit.w/2,0),dy=Math.max(Math.abs(a.to.y-hit.y)-hit.h/2,0);
  if(Math.hypot(dx,dy)>8||inBox(a.to,hit))bad(scope,`${card.name}: arrow ${a.id} tip ${Math.hypot(dx,dy).toFixed(1)} px from its target`);
  const pts=[...samples(a),...a.head];
  for(const pt of pts)if(!inScreen(pt)){bad(scope,`${card.name}: arrow ${a.id} leaves the screen at ${Math.round(pt.x)},${Math.round(pt.y)}`);break;}
  if(a.crosses)bad(scope,`${card.name}: arrow ${a.id} flagged as crossing the buttons`);
  const away=pts.filter(pt=>!source||!inBox(pt,source,3));
  if(buttons&&away.some(pt=>inBox(pt,buttons,2)))bad(scope,`${card.name}: arrow ${a.id} over ✓ or × ${JSON.stringify({from:a.from,control:a.control,to:a.to,head:a.head,source,buttons,inside:away.filter(pt=>inBox(pt,buttons,2))})}`);
  if(panel&&away.some(pt=>inBox(pt,panel)))crossPanel++;}
 return {card:card.name,want:want.length,drawn:s.arrows.length-reached,reached,crossPanel,reachedDetail:s.arrows.filter(a=>a.reached).map(a=>({id:a.id,from:a.from,to:a.to,source:source??null,target:s.hits.find(h=>h.id===a.id)&&{x:s.hits.find(h=>h.id===a.id).x,y:s.hits.find(h=>h.id===a.id).y,w:s.hits.find(h=>h.id===a.id).w,h:s.hits.find(h=>h.id===a.id).h}}))};
}
async function cardsPass(p,scope,turn,learn,touch,out){
 const s0=await p.state(),v=view(p,s0);if(!v){bad(scope,'no wire view for the turn');return;}
 for(const c of s0.cards){
  let s=await p.state();const h=s.hits.find(x=>x.id===c.key);if(!h)continue;
  for(const f of OFFSETS){await tapAt(p,s.hits.find(x=>x.id===c.key),touch,f);s=await settle(p);if(s.selected===c.key)break;await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);}
  if(s.selected!==c.key){bad(scope,`${c.name}: not chosen by a tap (chosen: ${s.cards.find(x=>x.key===s.selected)?.name??null})`);continue;}
  const src=s.hits.find(x=>x.id===c.key);
  out.push({turn,...checkArrows(scope,s,v,c,{...learn,source:src&&{x:src.x,y:src.y,w:src.w,h:src.h}})});
  await p.page.keyboard.press('Escape');await p.page.waitForTimeout(70);s=await p.state();
  if(s.arrows.length)bad(scope,`${c.name}: ${s.arrows.length} arrows after the choice was dropped`);
 }
}
async function pulse(p,scope,reduced,touch,shot){
 await p.page.waitForTimeout(80);{const h0=await hintClear(p,scope,true);if(h0&&!reduced&&h0.animation==='none')bad(scope,'attention class without animation');if(h0&&reduced&&h0.animation!=='none')bad(scope,'reduced motion but the hint animates');}
 const s=await p.state(),v=view(p,s);let card=null;
 for(const c of s.cards)if(expected(s,v,c.name).some(id=>id.startsWith('person-')&&id!==`person-${s.me}`)){card=c;break;}
 if(!card)for(const c of s.cards)if(expected(s,v,c.name).length){card=c;break;}
 if(!card){bad(scope,'no card with targets for the pulse');return null;}
 await tapAt(p,s.hits.find(h=>h.id===card.key),touch);await p.page.waitForTimeout(100);
 const a=[];for(let i=0;i<14;i++){a.push((await p.state()).aimAlpha);await p.page.waitForTimeout(70);}
 const r={card:card.name,reduced:(await p.state()).reduced,min:Math.min(...a),max:Math.max(...a),samples:a.length};
 if(reduced&&!(r.min===1&&r.max===1))bad(scope,`reduced motion but the arrows pulse ${JSON.stringify(r)}`);
 if(!reduced&&!(r.max-r.min>.05))bad(scope,`normal motion but no pulse ${JSON.stringify(r)}`);
 if(reduced&&!r.reduced)bad(scope,'reduced motion not emulated');
 r.hint=await hintClear(p,scope,false);if(shot)await p.shot(shot);
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(70);return r;
}
// Owner feedback after C3-3: the hint of the table («Scegli…», «Mossa ricevuta…») sits in the free corner, whole inside the screen and
// clear of every character, object, hand card and board; while a choice is asked for it carries the attention class.
async function hintClear(p,scope,expectAsk){
 const s=await p.state(),r=await p.page.locator('.hint').first().evaluate(e=>{const b=e.getBoundingClientRect();return {l:b.left,t:b.top,r:b.right,b:b.bottom,cls:e.className,text:e.textContent,anim:getComputedStyle(e).animationName};}).catch(()=>null);
 if(!r){bad(scope,'no hint on the table');return null;}
 const box={x:(r.l+r.r)/2,y:(r.t+r.b)/2,w:r.r-r.l,h:r.b-r.t};
 if(r.l<0||r.t<0||r.r>vw||r.b>vh)bad(scope,`hint outside the screen ${JSON.stringify(r)}`);
 const blocks=[...s.hits.filter(h=>h.kind!=='status').map(h=>({id:h.id,x:h.x,y:h.y,w:h.w,h:h.h})),...(s.layout?.seats??[]).flatMap(q=>[{id:`board-${q.id}`,...q.board},{id:`backs-${q.id}`,...q.backs}])];
 for(const b of blocks){if(Math.abs(box.x-b.x)<(box.w+b.w)/2&&Math.abs(box.y-b.y)<(box.h+b.h)/2)bad(scope,`hint "${r.text}" over ${b.id}`);}
 if(expectAsk&&!r.cls.split(' ').includes('ask'))bad(scope,`hint without the attention class: ${r.cls}`);
 return {text:r.text,cls:r.cls,box,animation:r.anim};
}
// A point of the canvas outside every hit, in the middle band of the table.
async function emptyPoint(p){const s=await p.state();
 for(let y=Math.round(vh*.5);y<vh*.62;y+=12)for(let x=Math.round(vw*.3);x<vw*.7;x+=20)if(!s.hits.some(h=>Math.abs(x-h.x)<=h.w/2+6&&Math.abs(y-h.y)<=h.h/2+6))return {x,y};
 return {x:vw*.5,y:vh*.55};}
// A card dragged with the mouse: the arrows follow the ghost, a drop on a target aims it, none of it sends.
async function mouseDrag(p,scope){
 const {page}=p,out={};let s=await p.state();const v=view(p,s);
 const card=s.cards.find(c=>expected(s,v,c.name).some(id=>id.startsWith('person-')&&id!==`person-${s.me}`))??s.cards[0],want=expected(s,v,card.name);
 const person=want.find(id=>id.startsWith('person-')&&id!==`person-${s.me}`)??want[0];
 const start=await grab(p,card.key,false),before=movesSent(p),commands=s.commands;if(!start){bad(scope,'no point selects the card to drag');return out;}
 await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x,start.y-70,{steps:6});await page.waitForTimeout(110);
 s=await p.state();out.moved=!!s.drag?.moved;
 if(!out.moved)bad(scope,'drag did not start');
 out.arrowsAtStart=checkArrows(`${scope}/drag`,s,v,card,{});
 await p.shot(`${scope}-drag`);
 const first=s.arrows[0]?.from;
 const tg=(await p.state()).hits.find(x=>x.id===person),mid={x:start.x+(tg.x-start.x)*.45,y:start.y+(tg.y-start.y)*.45};await page.mouse.move(mid.x,mid.y,{steps:10});await page.waitForTimeout(110);
 s=await p.state();out.arrowsAfterMove=checkArrows(`${scope}/drag`,s,v,card,{});
 const moved=s.arrows[0]?.from;if(first&&moved&&Math.hypot(first.x-moved.x,first.y-moved.y)<20)bad(scope,'the tails do not follow the dragged card');
 const target=(await p.state()).hits.find(x=>x.id===person);
 await page.mouse.move(target.x,target.y,{steps:12});await page.waitForTimeout(110);s=await p.state();
 out.overTarget={ghostOver:s.ghostOver,arrows:s.arrows.length,reached:s.arrows.filter(a=>a.reached).map(a=>a.id)};
 await page.mouse.up();await page.waitForTimeout(150);s=await p.state();
 out.dropped={target:s.target,arrows:s.arrows.length};
 if(!s.target)bad(scope,`drop on ${person} did not aim`);else if(s.arrows.length)bad(scope,'arrows left after aiming');
 if(movesSent(p)!==before||s.commands!==commands)bad(scope,'aiming by drag sent a command');
 await page.keyboard.press('Escape');await page.waitForTimeout(80);
 // Cancel: dragged and released over the empty table.
 await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x,start.y-80,{steps:6});await page.waitForTimeout(80);
 const free=await emptyPoint(p);await page.mouse.move(free.x,free.y,{steps:8});await page.waitForTimeout(80);await page.mouse.up();await page.waitForTimeout(150);s=await p.state();
 out.cancel={selected:s.selected,target:s.target,arrows:s.arrows.length};
 if(s.arrows.length||s.target)bad(scope,'cancel by drop left a choice or arrows');
 if(movesSent(p)!==before)bad(scope,'cancelling by drop sent a command');
 // Reorder: dropped low in the fan.
 s=await p.state();const hands=s.hits.filter(x=>x.kind==='hand'),order0=s.order.map(c=>c.key).join();
 if(hands.length>2){const a=hands[0],z=hands.at(-1);await page.mouse.move(a.x-a.w*.22,a.y);await page.mouse.down();await page.mouse.move(a.x-a.w*.22,a.y-20,{steps:4});await page.mouse.move(z.x+z.w*.3,vh*.9,{steps:10});await page.waitForTimeout(80);
  await page.mouse.up();await page.waitForTimeout(150);s=await p.state();out.reorder={changed:s.order.map(c=>c.key).join()!==order0,arrows:s.arrows.length,selected:s.selected};
  if(s.arrows.length)bad(scope,'arrows after a reorder');if(movesSent(p)!==before)bad(scope,'reordering sent a command');}
 // C0-R4: the interruption of a drag (window blur) drops the gesture and the arrows.
 const h2=await grab(p,card.key,false);
 if(h2){await page.mouse.move(h2.x,h2.y);await page.mouse.down();await page.mouse.move(h2.x,h2.y-90,{steps:6});await page.waitForTimeout(100);
  const during=(await p.state()).arrows.length;await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.waitForTimeout(150);s=await p.state();
  out.blur={arrowsDuring:during,dragAfter:s.drag,selected:s.selected,arrows:s.arrows.length};if(!during)bad(scope,'no arrows during the drag before the blur');
  if(s.drag||s.arrows.length||s.selected)bad(scope,'blur did not drop the drag, the choice and the arrows');
  await page.mouse.up();await page.waitForTimeout(100);}
 if(movesSent(p)!==before)bad(scope,'some command was sent');
 return out;
}
// Emulated touch: the real touch events through the browser's protocol (pointerType touch), a drag with the card above the finger.
async function touchDrag(p,scope){
 const cdp=await p.context.newCDPSession(p.page),out={};let s=await p.state();const v=view(p,s);
 const card=s.cards.find(c=>expected(s,v,c.name).some(id=>id.startsWith('person-')&&id!==`person-${s.me}`))??s.cards[0],want=expected(s,v,card.name);
 const person=want.find(id=>id.startsWith('person-')&&id!==`person-${s.me}`)??want[0],start=await grab(p,card.key,true),before=movesSent(p),commands=s.commands;if(!start){bad(scope,'no point selects the card to drag');return out;}
 const tp=(type,pt)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pt?[{x:pt.x,y:pt.y,id:1}]:[]});
 const move=async(from,to,n)=>{for(let i=1;i<=n;i++){await tp('touchMove',{x:from.x+(to.x-from.x)*i/n,y:from.y+(to.y-from.y)*i/n});await p.page.waitForTimeout(16);}};
 await tp('touchStart',start);await move(start,{x:start.x,y:start.y-90},6);await p.page.waitForTimeout(110);
 s=await p.state();out.moved=!!s.drag?.moved&&s.drag.touch===true;if(!out.moved)bad(scope,'touch drag did not start');
 out.arrows=checkArrows(`${scope}/touch-drag`,s,v,card,{});
 const t=s.hits.find(x=>x.id===person),end={x:t.x,y:t.y+t.h*.5+10};await move({x:start.x,y:start.y-90},end,14);await p.page.waitForTimeout(110);
 await p.shot(`${scope}-touch-drag`);
 await tp('touchEnd',null);await p.page.waitForTimeout(160);s=await p.state();
 out.dropped={target:s.target,arrows:s.arrows.length};
 if(!s.target)bad(scope,`touch drop on ${person} (finger at ${Math.round(end.x)},${Math.round(end.y)}) did not aim`);
 if(movesSent(p)!==before||s.commands!==commands)bad(scope,'aiming by touch sent a command');
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(80);
 // Tap, tap: card then target.
 await p.page.touchscreen.tap(start.x,start.y);s=await settle(p);out.tapChosen=checkArrows(`${scope}/touch-tap`,s,view(p,s),card,{});
 const tt=s.hits.find(x=>x.id===person);await p.page.touchscreen.tap(tt.x,tt.y+tt.h*.15);s=await settle(p);out.tapAimed={target:s.target,arrows:s.arrows.length};
 if(!s.target)bad(scope,'touch tap on the target did not aim');
 if(movesSent(p)!==before)bad(scope,'touch aiming sent a command');
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(80);
 return out;
}
// Performance of a mouse drag with arrows: frame intervals and input-to-frame (scene stats), cost of each redraw of the arrows.
async function dragPerf(p,scope){
 const {page}=p;let s=await p.state();const v=view(p,s);
 const card=s.cards.find(c=>expected(s,v,c.name).length>=(s.hits.filter(h=>h.kind==='person').length>2?3:1))??s.cards[0];
 const start=await grab(p,card.key,false),hits=s.hits.filter(x=>x.kind==='person'||x.kind==='item');if(!start){bad(scope,'no point selects the card for the perf drag');return null;}
 await page.evaluate(()=>window.__bm.measureStart());const draws0=s.stats.aimDraws;
 const t0=Date.now();let drags=0;
 while(Date.now()-t0<3600){
  await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x,start.y-70,{steps:5});
  for(const t of hits.slice(0,5)){await page.mouse.move(t.x,t.y,{steps:20});}
  const free=await emptyPoint(p);await page.mouse.move(free.x,free.y,{steps:10});await page.mouse.up();await page.waitForTimeout(60);drags++;}
 const end=await page.evaluate(()=>{const st=window.__bm.measureEnd();return {frames:st.frames,inputMs:st.inputMs,aimDraws:st.aimDraws,aimMs:st.aimMs};});
 const fr=end.frames,limit=vw<900?33:20,within=fr.filter(x=>x<=limit).length/fr.length;
 const aim=end.aimMs.slice(-(end.aimDraws-draws0));
 const r={drags,intervals:fr.length,cadenceHz:+(1000/(fr.reduce((a,b)=>a+b,0)/fr.length)).toFixed(1),p50:+pct(fr,.5).toFixed(1),p95:+pct(fr,.95).toFixed(1),max:+Math.max(...fr).toFixed(1),limitMs:limit,withinLimit:+(within*100).toFixed(3),
  inputSamples:end.inputMs.length,inputP95:+(pct(end.inputMs,.95)??0).toFixed(1),inputMax:+Math.max(...end.inputMs,0).toFixed(1),aimRedraws:end.aimDraws-draws0,aimCostP95:+(pct(aim,.95)??0).toFixed(3),aimCostMax:+Math.max(...aim,0).toFixed(3)};
 if(within<.95)bad(scope,`only ${r.withinLimit}% of the intervals within ${limit} ms`);if(r.inputMax>100)bad(scope,`input ${r.inputMax} ms`);
 await page.keyboard.press('Escape');return r;
}
// Locked: the move was sent (pending) or the player is out: choosing a card draws no arrows.
async function lockedPass(p,scope,touch){
 const s=await p.state();if(!(s.phase==='pending'||s.over||s.eliminated))return null;
 const out=[];for(const c of s.cards.slice(0,3)){const h=s.hits.find(x=>x.id===c.key);if(!h)continue;await tapAt(p,h,touch);const t=await settle(p,130);out.push({phase:t.phase,selected:t.selected,arrows:t.arrows.length,hint:t.phase==='pending'?await hintClear(p,scope,false):null});
  if(t.arrows.length||t.selected)bad(scope,`locked (${t.phase}) but selected=${t.selected} arrows=${t.arrows.length}`);await p.page.keyboard.press('Escape');await p.page.waitForTimeout(50);}
 return out;
}
// D12: choosing a card while the sequence of the round runs closes it and leaves the card chosen with its arrows.
async function d12(p,scope,touch,before){
 const end=Date.now()+20000;let s=null;
 while(Date.now()<end){s=await p.state();if(!s||s.over||s.eliminated)return {exercised:false,why:'ended'};if(s.turn!==before)break;await p.page.waitForTimeout(40);}
 if(!s||s.turn===before)return {exercised:false,why:'turn did not change'};
 for(let i=0;i<30&&s.phase!=='choose';i++){await p.page.waitForTimeout(40);s=await p.state();}
 if(!s.sequence.running)return {exercised:false,why:'sequence not running (none planned or already over)'};
 const v=view(p,s),card=s.cards.find(c=>v&&expected(s,v,c.name).length)??s.cards[0],h=s.hits.find(x=>x.id===card.key),n0=s.sequence.ends.length;
 let t=null;for(const f of OFFSETS){await tapAt(p,(await p.state()).hits.find(x=>x.id===card.key)??h,touch,f);t=await settle(p,140);if(t.selected===card.key)break;await p.page.keyboard.press('Escape');await p.page.waitForTimeout(50);}
 const r={exercised:true,card:card.name,running:t.sequence.running,reason:t.sequence.ends[n0]?.reason??null,selected:t.selected===card.key,arrows:t.arrows.length};
 if(t.sequence.running||r.reason!=='input'||!r.selected)bad(scope,`D12: ${JSON.stringify(r)}`);
 if(v&&t.arrows.length!==expected(t,v,card.name).length)bad(scope,'D12: arrows differ from the admitted targets');
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);return r;
}
async function leave(p){
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(100);
 const s=await p.state();
 if(s?.over&&await p.page.getByRole('button',{name:'Torna all’hub'}).count())await toHub(p);
 else{await p.page.keyboard.press('Escape');await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
}

// --- Scenarios ---
const run=name=>!only||only.includes(name);
async function scenario(name,{ffa=false,touch=false,reduced=false,turns=3,drags=true,toEnd=false}){
 const scope=`${name}${tag}`,opts={...(touch?{hasTouch:true}:{}),...(reduced?{reducedMotion:'reduce'}:{})};
 const A=await open('A',opts);await login(A);
 const rec={ffa,touch,reduced,turns:[],cards:[],locked:[],d12:[]};evidence.scenarios[name]=rec;
 try{
  if(ffa){await joinFfa(A);await waitList(A,1);await addComputers(A,4);}
  else{await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();}
  await table(A);
  const game=readyId(A,ffa?/quick\/ffa\/ready$/:/quick\/1vCom\/ready$/);rec.game=game;
  let learn=null;
  for(let t=0;t<turns;t++){
   let s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');
   if(s.over||s.eliminated)break;
   rec.turns.push(s.turn);
   if(t===0){learn=reserved(s);rec.confirm=learn;rec.confirmOnCard=await confirmPass(A,touch,scope);}
   await cardsPass(A,scope,s.turn,learn,touch,rec.cards);
   if(t===0){
    rec.pulse=await pulse(A,scope,reduced,touch,`${name}-chosen`);
    if(drags&&!touch){rec.mouse=await mouseDrag(A,scope);rec.perf=await dragPerf(A,scope);}
    if(touch)rec.touch=await touchDrag(A,scope);
   }
   s=await A.state();if(s.over||s.eliminated)break;
   let played;try{played=await playOne(A);}catch(e){rec.noValidMove=String(e.message);break;}
   const lk=await lockedPass(A,scope,touch);if(lk)rec.locked.push({turn:s.turn,played,checks:lk});
   rec.d12.push({turn:s.turn,...await d12(A,scope,touch,s.turn)});
  }
  if(toEnd){
   // To the outcome (or the player's elimination): no arrows and no choice once it is over.
   for(let t=0;t<120;t++){
    const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');
    if(s.over||s.eliminated)break;
    try{await playOne(A);}catch(e){rec.noValidMove=String(e.message);break;}
    await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,30000,'resolved');}
   const e=await A.state();rec.end={over:e?.over,eliminated:e?.eliminated,winner:e?.winner};
   if(e&&(e.over||e.eliminated)){await A.shot(`${name}-ended`);const out=[];
    for(const c of e.cards.slice(0,2)){const h=e.hits.find(x=>x.id===c.key);if(!h)continue;await A.page.mouse.click(h.x-h.w*.22,h.y,{force:true}).catch(()=>{});const t=await settle(A,130);out.push({over:t.over,eliminated:t.eliminated,selected:t.selected,arrows:t.arrows.length});
     if(t.arrows.length||t.selected)bad(scope,`outcome but selected=${t.selected} arrows=${t.arrows.length}`);}
    rec.locked.push({outcome:true,checks:out});}
   else bad(scope,'the game did not end in 120 turns');
  }
  const ok=rec.cards;
  rec.summary={turns:rec.turns.length,cardsChecked:ok.length,arrowsDrawn:ok.reduce((n,c)=>n+c.drawn,0),arrowsReached:ok.reduce((n,c)=>n+c.reached,0),cardsWithoutTargets:ok.filter(c=>!c.want).length,crossPanel:ok.reduce((n,c)=>n+c.crossPanel,0),d12Exercised:rec.d12.filter(x=>x.exercised).length,lockedChecks:rec.locked.length};
  step(scope,{...rec.summary,pulse:rec.pulse,perf:rec.perf,confirm:rec.confirm?.buttons,noValidMove:rec.noValidMove});
  if(!ok.length)bad(scope,'no card was checked');
  await leave(A);
 }catch(e){bad(scope,`exception ${e?.stack??e}`);await A.shot(`failure-${name}`).catch(()=>{});}
 finally{await A.context.close().catch(()=>{});}
}

// Pending: two humans in a five-seat FFA; A sends the move, B does not, so A stays pending for the clock: nothing to aim at.
async function scenarioPending(){
 const scope=`pending${tag}`,A=await open('A'),B=await open('B');await login(A);await login(B);
 const rec={locked:[],cards:[]};evidence.scenarios.pending=rec;
 try{
  await joinFfa(A);await waitList(A,1);await joinFfa(B);await waitList(A,2);await addComputers(A,3);await Promise.all([table(A),table(B)]);
  let s=await A.wait(x=>x&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'A turn');
  const learn=reserved(s);rec.confirm=learn;rec.confirmOnCard=await confirmPass(A,false,scope);await cardsPass(A,scope,s.turn,learn,false,rec.cards);
  const played=await playOne(A);s=await A.state();
  if(s.phase!=='pending')bad(scope,`A is ${s.phase} after sending, expected pending`);
  const lk=await lockedPass(A,scope,false);rec.locked.push({played,checks:lk});
  // A drag started while pending draws nothing either.
  const h=s.hits.find(x=>x.kind==='hand');await A.page.mouse.move(h.x-h.w*.22,h.y);await A.page.mouse.down();await A.page.mouse.move(h.x-h.w*.22,h.y-90,{steps:6});await A.page.waitForTimeout(120);
  const d=await A.state();rec.dragWhilePending={drag:d.drag,arrows:d.arrows.length,selected:d.selected};if(d.arrows.length||d.selected)bad(scope,'drag while pending drew arrows or chose a card');
  await A.page.mouse.up();await A.page.waitForTimeout(100);
  rec.summary={cardsChecked:rec.cards.length,arrowsDrawn:rec.cards.reduce((n,c)=>n+c.drawn,0),arrowsReached:rec.cards.reduce((n,c)=>n+c.reached,0),lockedChecks:rec.locked.length};
  step(scope,rec.summary);
  await leave(A);await leave(B);
 }catch(e){bad(scope,`exception ${e?.stack??e}`);await A.shot('failure-pending').catch(()=>{});}
 finally{await A.context.close().catch(()=>{});await B.context.close().catch(()=>{});}
}

// --- C4-8a (rule 12): a whole game from the keyboard only: Tab, Shift+Tab, Enter, Space, Escape, arrows. Nothing is clicked or focused by the script. ---
// Per turn: the hand first in the order of Tab, the arrows along the hand, the choice, the target, the discard when the card asks for one, ✓ with the focus,
// one SEND for one Enter, Esc and × cancelling (the focus back on the hand), and the focus never lost while a choice can be made (a sampler in the page).
const HALO='rgb(20, 12, 8)';
const active=p=>p.page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const c=getComputedStyle(e);
 return {hit:e.getAttribute('data-hit'),test:e.getAttribute('data-testid'),role:e.getAttribute('role'),checked:e.getAttribute('aria-checked'),selected:e.getAttribute('aria-selected'),label:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,48),tag:e.tagName,shadow:c.boxShadow,outline:`${c.outlineStyle} ${c.outlineWidth}`};});
const press=async(p,k,n=1)=>{for(let i=0;i<n;i++){await p.page.keyboard.press(k);await p.page.waitForTimeout(45);}};
const isCard=a=>!!a?.hit&&!a.hit.startsWith('person-')&&!a.hit.startsWith('item-')&&!a.hit.startsWith('status-');
async function watchFocus(p){await p.page.evaluate(()=>{const w=window.__kw={lost:[],since:null,armed:false,samples:0};
 w.timer=setInterval(()=>{const s=window.__bm?.state,e=document.activeElement;w.samples++;
  const can=w.armed&&s&&s.phase==='choose'&&!s.over&&!s.eliminated&&s.hits.some(h=>h.kind==='hand'||h.kind==='preview')&&!document.querySelector('dialog[open]'),lost=!e||e===document.body;
  if(can&&lost){if(w.since===null)w.since=performance.now();}else if(w.since!==null){w.lost.push(Math.round(performance.now()-w.since));w.since=null;}},50);});}
const focusReport=p=>p.page.evaluate(()=>{const w=window.__kw;return {samples:w.samples,lost:[...w.lost,...(w.since!==null?[Math.round(performance.now()-w.since)]:[])]};});
// The cards of the hand that a card can be thrown away for (rule R03): regular ones, as the wire view says.
const regularNames=(s,v)=>new Set(v.players[s.me].cardsInHand.filter(c=>!c.item&&!c.basicAction&&!c.characterBound&&!c.lastResort).map(c=>c.name));
async function tabTo(p,pred,cap=30,key='Tab'){for(let i=0;i<cap;i++){const a=await active(p);if(a&&pred(a))return a;await press(p,key);}const a=await active(p);return a&&pred(a)?a:null;}
// One move chosen from the keyboard to the point where ✓ has the focus. Returns the card and the target, or null when no card of this hand can go (no target, no discard).
async function kbdChoose(p,scope,rec,skip=0){
 let s=await p.state();const v=view(p,s);if(!v){bad(scope,'no wire view');return null;}
 const regs=regularNames(s,v),order=s.order,first=await tabTo(p,isCard,40);if(!first){bad(scope,'Tab never reaches a card of the hand');return null;}
 let at=order.findIndex(c=>c.key===first.hit);
 const goTo=async i=>{while(at<i){await press(p,'ArrowRight');at++;}while(at>i){await press(p,'ArrowLeft');at--;}const a=await active(p);if(a?.hit!==order[i].key)bad(scope,`arrows did not reach card ${i}: ${JSON.stringify(a)}`);};
 let tried=0;
 for(let i=0;i<order.length;i++){
  const name=order[i].name,targets=expected(s,v,name);if(!targets.length)continue;if(tried++<skip)continue;
  const bound=v.players[s.me].cardsInHand.find(c=>c.name===name)?.characterBound,spare=order.map((c,j)=>({c,j})).filter(x=>x.j!==i&&regs.has(x.c.name));
  if(bound&&!spare.length)continue;
  await goTo(i);await press(p,'Enter');let t=await settle(p,120);
  if(t.selected!==order[i].key){await press(p,'Escape');continue;}
  // The arrows draw the admitted targets; pick the first one Tab reaches (the opponents come before the objects).
  const want=t.arrows.map(a=>a.id);let tg=null;
  let tabs=0;for(;tabs<40&&!tg;){await press(p,'Tab');tabs++;const a=await active(p);if(a?.hit&&(want.includes(a.hit)||(tabs===1&&/^(person|item)-/.test(a.hit))))tg=a.hit;}// the arrows draw one object per seat, the model admits them all: the first Tab may land on another admitted object
  // Owner's trial of 11 November 2026: one Tab after the card must be on an admitted target (Invio on it aims; on a target not admitted it would cancel).
  if(tg&&tabs!==1)bad(scope,`${name}: ${tabs} Tab from the chosen card to its first admitted target, not 1`);else rec.oneTabToTarget=(rec.oneTabToTarget??0)+1;
  if(!tg){bad(scope,`${name}: Tab never reaches a target of ${JSON.stringify(want)}`);await press(p,'Escape');continue;}
  await press(p,'Enter');t=await settle(p,140);
  if(!t.target){bad(scope,`${name}: Enter on ${tg} did not aim`);await press(p,'Escape');continue;}
  if(t.message.includes('scartare')&&!t.discard){
   // The cards that can be thrown away come first in the order (aimOrder), so Shift+Tab from the target walks back to one of them.
   let done=false;
   for(const {c} of spare){const a=await tabTo(p,x=>x.hit===c.key,40,'Shift+Tab');if(!a)continue;await press(p,'Enter');const d=await settle(p,140);if(d.discard){done=true;break;}}
   if(!done){bad(scope,`${name}: no discard accepted`);await press(p,'Escape');continue;}}
  const a=await active(p);
  if(a?.test!=='confirm'){bad(scope,`${name}: after the target the focus is ${JSON.stringify(a)}, not ✓`);}
  else{rec.confirmFocus=(rec.confirmFocus??0)+1;if(rec.confirmFocus===1)await p.shot(`${scope}-focus-confirm`);if(!a.shadow.includes(HALO)||!a.outline.startsWith('solid'))bad(scope,`✓ focus without the two-tone ring: ${a.shadow} / ${a.outline}`);}
  return {card:name,target:tg,key:order[i].key};}
 return null;}
async function kbdGame(p,scope,rec,{maxTurns,reduced}){
 await watchFocus(p);let n=0,canceled=0;
 const wait=()=>p.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');
 while(n<maxTurns){
  let s=await wait();if(s.over||s.eliminated)break;
  // A sequence in normal motion ends with any key: wait for it to be over, then check it did not end because of the focus (reason input).
  await p.wait(x=>x&&!x.sequence.running,30000,'sequence over');s=await p.state();if(s.over||s.eliminated)break;
  const row={turn:s.turn};rec.turns.push(row);
  const a0=await active(p);
  if(n===0){
   // First Tab: the hand comes first; then the whole round of Tab, in the order the page gives, up to the first card again.
   await press(p,'Tab');const f=await active(p);row.first=f?.label;if(!isCard(f))bad(scope,`the first Tab reaches ${JSON.stringify(f)}, not a card of the hand`);
   await page_arm(p);
   const seq=[f];for(let i=0;i<40;i++){await press(p,'Tab');const a=await active(p);if(!a||a.hit===f.hit)break;seq.push(a);}
   const kinds=seq.map(a=>isCard(a)?'hand':a.hit?.startsWith('person-')?'person':a.hit?.startsWith('item-')?'item':a.hit?.startsWith('status-')?'status':a.test??a.tag);
   row.tabOrder=kinds;const lastHand=kinds.lastIndexOf('hand'),firstOther=kinds.findIndex(k=>k!=='hand');
   if(firstOther>=0&&lastHand>firstOther)bad(scope,`the hand is not first in the order of Tab: ${kinds.join(',')}`);
   if(kinds.filter(k=>k==='hand').length!==s.hits.filter(h=>h.kind==='hand'||h.kind==='preview').length)bad(scope,`Tab does not reach every card of the hand: ${kinds.join(',')}`);
   // Arrows: along the hand, stopping at the ends.
   await tabTo(p,isCard,40);const hand=s.order.map(c=>c.key);
   await press(p,'ArrowRight');let a=await active(p);if(a?.hit!==hand[1])bad(scope,`ArrowRight from the first card reaches ${a?.hit}, not ${hand[1]}`);
   await press(p,'ArrowLeft');a=await active(p);if(a?.hit!==hand[0])bad(scope,`ArrowLeft back reaches ${a?.hit}, not ${hand[0]}`);
   await press(p,'ArrowLeft');a=await active(p);if(a?.hit!==hand[0])bad(scope,'ArrowLeft at the first card moves the focus');
   await press(p,'ArrowRight',hand.length+2);a=await active(p);if(a?.hit!==hand.at(-1))bad(scope,`the arrows stop at ${a?.hit}, not at the last card`);
   row.ring=a&&{shadow:a.shadow,outline:a.outline};if(!a?.shadow.includes(HALO))bad(scope,`a card with the focus has no dark band: ${a?.shadow}`);
   await p.shot(`${scope}-focus-card`);
  }else if(!isCard(a0)||!(a0.hit))bad(scope,`turn ${s.turn}: a choice is open and the focus is ${JSON.stringify(a0)}, not on a card`);
  else row.focusAtStart=a0.label;
  // Cancelling: Esc once, × once; each leaves the focus on the hand (2b), then the move is chosen again.
  if(n===1||n===2){const c=await kbdChoose(p,scope,rec);if(!c){rec.noValidMove=`turn ${s.turn}: no card to cancel`;break;}
   if(n===1){await press(p,'Escape');const t=await settle(p,150),f=await active(p);row.escape={selected:t.selected,target:t.target,focus:f?.label};
    if(t.selected||t.target)bad(scope,'Esc left a choice');if(!isCard(f))bad(scope,`after Esc the focus is ${JSON.stringify(f)}, not on the hand`);}
   else{await press(p,'Tab');const x=await active(p);if(!/Annulla/.test(x?.label??''))bad(scope,`Tab from ✓ reaches ${JSON.stringify(x)}, not Annulla`);
    await press(p,'Enter');const t=await settle(p,150),f=await active(p);row.cancelButton={selected:t.selected,target:t.target,focus:f?.label};
    if(t.selected||t.target)bad(scope,'Annulla left a choice');if(!isCard(f))bad(scope,`after Annulla the focus is ${JSON.stringify(f)}, not on the hand`);}
   canceled++;}
  // The playable cards in turn, so that the arrows, the discard and the objects are all met; the first one when the turn has fewer. The server may refuse a card
  // the resources do not pay (it decides, rule 1.9): Esc and the next card, up to four times.
  let c=null,sent=0;
  for(let attempt=0;attempt<4&&!c;attempt++){
   const pick=(await kbdChoose(p,scope,rec,(n+attempt)%3))??(await kbdChoose(p,scope,rec,0));if(!pick){rec.noValidMove=`turn ${s.turn}: no card can be chosen`;break;}
   const before=movesSent(p);
   // Space also activates (checked once); Enter the other turns.
   await press(p,n===3&&attempt===0?' ':'Enter');
   await p.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   sent=movesSent(p)-before;if(sent!==1)bad(scope,`turn ${s.turn}: ${sent} SEND for one ${n===3&&attempt===0?'Space':'Enter'}`);
   const r=await p.state();if(r&&r.phase==='choose'&&r.turn===s.turn&&r.message.startsWith('Rifiutata')){rec.refused=(rec.refused??0)+1;await press(p,'Escape');await settle(p,150);continue;}
   c=pick;}
  if(!c){if(!rec.noValidMove)rec.noValidMove=`turn ${s.turn}: every card tried was refused`;break;}
  row.played=c;
  await p.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,40000,'round resolved');
  n++;}
 const e=await p.state();rec.end={over:e?.over,eliminated:e?.eliminated,winner:e?.winner,turns:n,canceled};
 const fr=await focusReport(p);rec.focus=fr;if(fr.lost.some(ms=>ms>250))bad(scope,`the focus was lost while a choice could be made: ${JSON.stringify(fr.lost)} ms`);
 rec.sequenceEnds=(await p.state())?.sequence.ends.map(x=>x.reason)??[];
 if(!reduced&&rec.sequenceEnds.includes('input'))bad(scope,`a sequence ended for input without a key of the script: ${JSON.stringify(rec.sequenceEnds)}`);
}
const page_arm=p=>p.page.evaluate(()=>{window.__kw.armed=true;});
// Out of the game from the keyboard: the outcome panel (Tab reaches «Nuova partita» first) or the menu and the farewell dialog.
async function kbdLeave(p,scope,rec,over){
 if(over){const a=await tabTo(p,x=>x.test==='again',10);rec.outcomeFocus=a?.label??null;if(!a)bad(scope,'Tab never reaches «Nuova partita» on the outcome panel');
  else{await press(p,'Enter');await p.page.waitForTimeout(400);const s=await p.wait(x=>x&&x.hits.some(h=>h.kind==='hand'),30000,'new game').catch(()=>null);rec.newGame=!!s;if(!s)bad(scope,'«Nuova partita» from the keyboard did not start a game');}}
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(100);
 const m=await tabTo(p,a=>a.label==='Apri menu',60);if(!m){bad(scope,'Tab never reaches the menu');return;}
 await press(p,'Enter');const l=await tabTo(p,a=>/Abbandona/.test(a.label),40);if(!l){bad(scope,'the menu has no way out by Tab');return;}
 await press(p,'Enter');const y=await tabTo(p,a=>/Sì, abbandona/.test(a.label),10);if(!y){bad(scope,'no «Sì, abbandona» by Tab');return;}
 await press(p,'Enter');await p.page.getByTestId('quick').waitFor({timeout:15000});rec.left='keyboard';}
async function scenarioKeyboard(name,{ffa=false,reduced=true,turns=60}){
 const scope=`${name}${tag}`,A=await open('A',reduced?{reducedMotion:'reduce'}:{});await login(A);
 const rec={ffa,reduced,turns:[]};evidence.scenarios[name]=rec;
 try{
  if(ffa){await joinFfa(A);await waitList(A,1);await addComputers(A,4);}
  else{await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();}
  await table(A);
  await kbdGame(A,scope,rec,{maxTurns:turns,reduced});
  step(scope,{turns:rec.turns.length,end:rec.end,focus:rec.focus,confirmFocus:rec.confirmFocus,tabOrder:rec.turns[0]?.tabOrder,noValidMove:rec.noValidMove,sequenceEnds:rec.sequenceEnds});
  rec.summary={turns:rec.turns.length,confirmFocus:rec.confirmFocus??0,canceled:rec.end?.canceled,lostMax:Math.max(0,...(rec.focus?.lost??[]))};
  await A.shot(`${name}-end`);
  await kbdLeave(A,scope,rec,!!(rec.end?.over||rec.end?.eliminated));
 }catch(e){bad(scope,`exception ${e?.stack??e}`);await A.shot(`failure-${name}`).catch(()=>{});}
 finally{await A.context.close().catch(()=>{});}
}

try{
 await startServer();step('server',{database:'temporary',jar});
 if(run('duel'))await scenario('duel',{turns:3,toEnd:true});
 if(run('touch'))await scenario('touch',{touch:true,turns:3});
 if(run('reduced'))await scenario('reduced',{reduced:true,turns:2,drags:false});
 if(run('ffa'))await scenario('ffa',{ffa:true,turns:3});
 if(run('pending'))await scenarioPending();
 // C4-8a: the whole game from the keyboard only (rule 12): duel with reduced motion to the end, duel with motion for four turns, five-seat FFA for six turns.
 if(run('keyboard'))await scenarioKeyboard('keyboard',{reduced:true});
 if(run('keyboard-motion'))await scenarioKeyboard('keyboard-motion',{reduced:false,turns:4});
 if(run('keyboard-ffa'))await scenarioKeyboard('keyboard-ffa',{ffa:true,reduced:true,turns:6});
 evidence.scenarioSummary=Object.fromEntries(Object.entries(evidence.scenarios).map(([k,v])=>[k,v.summary]));
 assert.deepEqual(evidence.errors,[],'no page errors');
 assert.deepEqual(problems,[],'aim problems');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);}
finally{
 evidence.problems=problems;
 await writeFile(`${out}/aim${tag}.json`,JSON.stringify(evidence,null,1));
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

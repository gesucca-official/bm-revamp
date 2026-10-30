// C3-L end-to-end measure against the REAL server: scale and use of the table space, in the duel (quick 1vCom) and the five-seat FFA
// (four computers). Like VerifyAim it starts the server itself on a temporary database (the local data is never touched) and stops it
// at the end. At several turns the scene is read back (layout, hits) with the HTML shell (clock, turn, menu, hint, short summary), and
// the sizes in CSS px, the free space in the middle of the table and the overlaps are recorded. Checks (C3-L, owner's choice of
// 30 October 2026): own character larger than the others, the cards of the last round in the middle, in the order and with the names of
// the view's resolvedMoves (owner, during the block), own deck and discard pile small beside the own character with the count of the view, nothing
// off the screen, no overlap between seats, hand, round cards, piles, strips and shell, characters and objects at least 44 px, every close-up of the
// round's sequence (D13) on the screen and clear of the other seats and of the hand. BM_OUT=…/before measured the build before C3-L.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';
import assert from 'node:assert/strict';
import {fan,overlap,inside,seatBoxes,layoutProblems} from '../src/readability.ts';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c3/c3-l';
const accounts={A:{user:'devAlice',password:'local-alice'}};
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
const only=process.env.BM_SCENARIOS?.split(',');
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright) against the local server started by this script on a temporary database; not a physical device',scenarios:{},errors:[]};
const problems=[],bad=(scope,msg)=>{problems.push(`${scope}: ${msg}`);console.log('PROBLEM',scope,msg);};
const old=out.includes('before');
const step=(name,data)=>console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,900));

const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-layout-'));
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

const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
async function open(name){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();
 const p={name,user,password,page,context};
 page.on('pageerror',e=>evidence.errors.push(`${name}: ${e}`));
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/layout-${n}${tag}.jpg`,type:'jpeg',quality:70});
 return p;
}
async function login(p){
 await p.page.goto(`${url}#/accedi`);
 await p.page.getByLabel('Nome').fill(p.user);await p.page.getByLabel('Password').fill(p.password);
 await p.page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await p.page.getByTestId('quick').waitFor({timeout:15000});
}
const dialogOpen=p=>p.page.evaluate(()=>!!document.querySelector('dialog[open]'));
const table=p=>p.wait(x=>x&&x.hits.some(h=>h.kind==='hand'||h.id.startsWith('person-')),30000,'table');
const list=async p=>(await p.page.locator('[data-testid=ffa-list] li:not(.free)').allInnerTexts()).map(t=>t.trim());
const waitList=(p,n)=>p.page.waitForFunction(n=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length===n,n,{timeout:10000});
async function joinFfa(p){await p.page.getByRole('radio',{name:'Tutti contro tutti'}).click();await p.page.getByTestId('quick').click();await p.page.getByTestId('ffa-list').waitFor({timeout:10000});}
async function addComputers(p,n){for(let i=0;i<n;i++){const before=(await list(p)).length;await p.page.getByTestId('add-computer').click();if(before+1<5)await waitList(p,before+1);}}
// One move through the UI (first card that the server accepts), as in VerifyAim.
async function playOne(p){
 const {page}=p,esc=()=>page.keyboard.press('Escape');
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen(p)){await esc();await page.waitForTimeout(60);}};
 const start=await p.state();
 for(const card of start.order){
  const own=(await p.state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await p.state()).selected!==card.key)continue;
  let aimed=false;
  const targets=(await p.state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
  for(const t of targets){if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await p.state()).hits.find(h=>h.id===t.id);if(!now)continue;await tap(now);if((await p.state()).target){aimed=true;break;}}
  if(!aimed){await esc();continue;}
  const s=await p.state();
  if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
  await page.getByTestId('confirm').click();
  const r=await p.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
  return card.name;
 }
 throw new Error(`${p.name}: no playable card`);
}

async function leave(p){
 await p.page.keyboard.press('Escape');await p.page.waitForTimeout(100);const s=await p.state();
 if(s?.over&&await p.page.getByRole('button',{name:'Torna all’hub'}).count()){await p.page.getByRole('button',{name:'Torna all’hub'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
 else{await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();await p.page.getByTestId('quick').waitFor({timeout:15000});}
}

// --- Measures ---
const R=b=>({x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.w),h:Math.round(b.h)});
// DOM rectangles of the shell over the table, as centre boxes like the scene's.
const shell=p=>p.page.evaluate(()=>{const box=el=>{if(!el)return null;const r=el.getBoundingClientRect();return r.width&&r.height?{x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height}:null;};
 return {top:box(document.querySelector('.top-actions')),brand:box(document.querySelector('.brand')),hint:box(document.querySelector('.hint')),toast:box(document.querySelector('.toast'))};});
// Largest free rectangle (several aspect ratios, grown around a grid of centres) clear of everything drawn and of the shell.
function freeSpace(occupied,w,h){let best=null,area=0;
 for(let cy=12;cy<h-12;cy+=6)for(let cx=12;cx<w-12;cx+=6)for(const asp of [.6,.8,1,1.3,1.8,2.5]){let lo=0,hi=Math.max(w,h);
  for(let k=0;k<16;k++){const m=(lo+hi)/2,bw=m*Math.sqrt(asp),bh=m/Math.sqrt(asp),b={x:cx,y:cy,w:bw,h:bh};
   if(b.x-bw/2>=0&&b.x+bw/2<=w&&b.y-bh/2>=0&&b.y+bh/2<=h&&!occupied.some(o=>overlap(b,o)>0))lo=m;else hi=m;}
  const bw=lo*Math.sqrt(asp),bh=lo/Math.sqrt(asp);if(bw*bh>area){area=bw*bh;best={x:cx,y:cy,w:bw,h:bh};}}
 return best?{...R(best),share:+(area/(w*h)).toFixed(3)}:null;}
function measure(s,dom){
 const L=s.layout,hand=s.hits.filter(h=>h.kind==='hand'),boxes=[];
 for(const seat of L.seats){boxes.push(seat.person,seat.board,...seat.items.slice(0,Math.max(1,(s.hits.filter(h=>h.target?.owner===seat.id&&h.kind==='item').length)||0)));
  if(s.summary?.seats?.[seat.id])boxes.push(seat.summary);if(!seat.me)boxes.push(fan(seat.backs,seat.back,s.backs[seat.id]??0).box);}
 const shellBoxes=Object.values(dom).filter(Boolean),piles=[...(L.played?[L.played.box]:[]),...(L.piles?[L.piles.deck,L.piles.discard]:[])],occupied=[...boxes,...hand,...shellBoxes,...piles];
 const me=L.seats.find(x=>x.me),others=L.seats.filter(x=>!x.me);
 // Middle of the table: the region between the seats, above the hand. How much of it is free.
 const mid={x:vw*.5,y:vh*.42,w:vw*.36,h:vh*.3},midFree=(()=>{let free=0,n=0;for(let y=mid.y-mid.h/2;y<mid.y+mid.h/2;y+=4)for(let x=mid.x-mid.w/2;x<mid.x+mid.w/2;x+=4){n++;if(!occupied.some(o=>overlap({x,y,w:1,h:1},o)>0))free++;}return +(free/n).toFixed(3);})();
 const small=s.hits.filter(h=>h.kind!=='hand'&&(h.w<44||h.h<44)).map(h=>({id:h.id,kind:h.kind,w:Math.round(h.w),h:Math.round(h.h)}));
 // Overlaps between seats, with the hand and with the shell.
 const clash=[];L.seats.forEach((a,i)=>{const own=[a.person,a.board,...a.items];
  L.seats.slice(i+1).forEach(b=>{for(const x of own)for(const y of [b.person,b.board,...b.items])if(overlap(x,y)>0)clash.push(`${a.id}/${b.id}`);});
  for(const x of own){for(const hh of hand)if(overlap(x,hh)>0)clash.push(`${a.id}/hand`);for(const p of piles)if(overlap(x,p)>0)clash.push(`${a.id}/piles`);for(const [k,d] of Object.entries(dom))if(d&&k!=='toast'&&overlap(x,d)>0)clash.push(`${a.id}/${k}`);if(!inside(x,vw,vh))clash.push(`${a.id} off screen`);}});
 for(const p of piles){if(!inside(p,vw,vh))clash.push('piles off screen');for(const hh of hand)if(overlap(p,hh)>0)clash.push('piles/hand');for(const [k,d] of Object.entries(dom))if(d&&k!=='toast'&&overlap(p,d)>0)clash.push(`piles/${k}`);}
 return {scale:L.scale,played:L.played?{box:R(L.played.box),card:R(L.played.slots[0]),shows:s.readout.played}:null,piles:L.piles?{deck:R(L.piles.deck),discard:R(L.piles.discard),shows:s.readout.piles}:null,problems:L.piles!==undefined?layoutProblems(L,vw,vh,24):['old build'],hand:{w:Math.round(L.hand.w),h:Math.round(L.hand.h),step:Math.round(L.hand.step),cards:hand.length},
  me:{person:R(me.person),item:R(me.items[0]),board:R(me.board),boardRow:+(me.board.h/5).toFixed(1),status:R(me.status)},
  others:others.map(o=>({id:o.id,person:R(o.person),item:R(o.items[0]),board:R(o.board),back:{w:Math.round(o.back.w),h:Math.round(o.back.h)}})),
  free:freeSpace(occupied,vw,vh),middle:{box:R(mid),free:midFree},below44:small,clash:[...new Set(clash)],shell:Object.fromEntries(Object.entries(dom).map(([k,v])=>[k,v&&R(v)]))};}

const run=name=>!only||only.includes(name);
async function scenario(name,{ffa=false,turns=2}){
 const A=await open('A');await login(A);const rec={ffa,turns:[],closeUps:[]};evidence.scenarios[name]=rec;let closeUpsSeen=0;
 try{
  if(ffa){await joinFfa(A);await waitList(A,1);await addComputers(A,4);}
  else{await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();}
  await table(A);
  for(let t=0;t<=turns;t++){
   const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),60000,'turn');
   if(s.over||s.eliminated)break;
   await A.page.waitForTimeout(300);const now=await A.state(),m=measure(now,await shell(A));rec.turns.push({turn:now.turn,...m});step(`${name}${tag} T${now.turn}`,m);
   if(!old){const scope=`${name}${tag} T${now.turn}`,me=m.me.person;
    if(m.clash.filter(c=>!c.endsWith('/brand')).length)bad(scope,`overlaps ${m.clash}`);if(m.problems.length)bad(scope,`layout ${m.problems}`);
    for(const o of m.others)if(!(me.w>o.person.w*1.2))bad(scope,`own ${me.w} not larger than ${o.id} ${o.person.w}`);
    if(!m.played)bad(scope,'no round cards');else if(JSON.stringify((m.played.shows??[]).map(x=>x.name))!==JSON.stringify(now.lastMoves.slice(0,m.played.shows?.length??0))||(m.played.shows??[]).length!==Math.min(now.lastMoves.length,now.layout.played.slots.length))bad(scope,`round cards ${JSON.stringify(m.played.shows)} vs view ${JSON.stringify(now.lastMoves)}`);
    if(!m.piles)bad(scope,'no piles');else if(m.piles.shows?.deck!==now.deckCount)bad(scope,`deck shows ${m.piles.shows?.deck}, view ${now.deckCount}`);
    for(const b of m.below44)if(b.kind!=='status')bad(scope,`${b.id} under 44 px`);}
   await A.shot(`${name}-T${now.turn}`);
   if(t<turns){await A.page.evaluate(()=>window.__bm.measureStart());await playOne(A);await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,40000,'resolved');
    // During the sequence: a screenshot of the first close-up, then every close-up recorded by the scene is checked.
    await A.wait(x=>!x||x.stats.closeUps.length>closeUpsSeen,8000,'close-up').catch(()=>{});await A.page.waitForTimeout(500);await A.shot(`${name}-T${s.turn}-closeup`);
    const done=await A.wait(x=>!x||!x.sequence.running,30000,'sequence end');const ups=done.stats.closeUps.slice(closeUpsSeen);
    // C0 criterion on the new scene: frame intervals while choosing, sending and watching the whole sequence (piles, close-ups, flights).
    const st=await A.page.evaluate(()=>window.__bm.measureEnd()),fr=[...st.frames].sort((a,b)=>a-b),q=p=>fr.length?+fr[Math.min(fr.length-1,Math.floor(fr.length*p))].toFixed(1):null,limit=vw<1000?33:20;
    const perf={intervals:fr.length,p95:q(.95),max:q(1),within:fr.length?+(fr.filter(x=>x<=limit).length/fr.length).toFixed(3):null,limit,inputMax:st.inputMs.length?+Math.max(...st.inputMs).toFixed(1):null,inputs:st.inputMs.length};rec.perf=(rec.perf??[]).concat({turn:s.turn,...perf});
    if(!old&&perf.within!==null&&perf.within<.95)bad(`${name}${tag} T${s.turn}`,`frames within ${limit} ms: ${perf.within}`);if(!old&&perf.inputMax>100)bad(`${name}${tag} T${s.turn}`,`input ${perf.inputMax} ms`);closeUpsSeen=done.stats.closeUps.length;
    const hand=done.hits.filter(h=>h.kind==='hand'),L=done.layout,piles=L.piles?[L.piles.deck,L.piles.discard]:[];
    for(const c of ups){const scope=`${name}${tag} T${s.turn} close-up ${c.author}`;rec.closeUps.push({turn:s.turn,author:c.author,placed:c.placed,scale:c.scale,box:R(c.box),target:c.target&&R(c.target),overPiles:piles.some(p=>overlap(c.box,p)>0)});
     if(old)continue;if(c.placed!=='middle')bad(scope,`placed ${c.placed}`);if(!inside(c.box,vw,vh))bad(scope,'off screen');
     for(const o of c.others)if(overlap(c.box,o)>0)bad(scope,'over another seat');for(const h of hand)if(overlap(c.box,h)>0)bad(scope,`over the hand ${JSON.stringify(R(c.box))} ${JSON.stringify(R(h))}`);
     if(c.target&&!inside(c.target,vw,vh))bad(scope,'target close-up off screen');}}
  }
  await leave(A);
 }catch(e){evidence.errors.push(`${name}: ${e?.stack??e}`);await A.shot(`failure-${name}`).catch(()=>{});}
 finally{await A.context.close().catch(()=>{});}
}
try{
 await startServer();
 if(run('duel'))await scenario('duel',{});
 if(run('ffa'))await scenario('ffa',{ffa:true});
 assert.deepEqual(evidence.errors,[],'no page errors');
 assert.deepEqual(problems,[],'layout problems');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);}
finally{
 evidence.problems=problems;
 await writeFile(`${out}/layout${tag}.json`,JSON.stringify(evidence,null,1));
 await browser.close().catch(()=>{});await stopServer();await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

// C3-L end-to-end measure against the REAL server: scale and use of the table space, in the duel (quick 1vCom) and the five-seat FFA
// (four computers). Like VerifyAim it starts the server itself on a temporary database (the local data is never touched) and stops it
// at the end. At several turns the scene is read back (layout, hits) with the HTML shell (clock, turn, menu, hint, short summary), and
// the sizes in CSS px, the free space in the middle of the table and the overlaps are recorded. Checks (C3-L, owner's choice of
// 30 October 2026): own character larger than the others, the cards of the last round in the middle, in the order and with the names of
// the view's resolvedMoves (owner, during the block), own deck and discard pile small beside the own character with the count of the view, nothing
// off the screen, no overlap between seats, hand, round cards, piles, strips and shell, characters and objects at least 44 px, every close-up of the
// round's sequence (D13) on the screen and clear of the other seats and of the hand. C3-6: the strips of the round's summary (one per seat, symbols
// and signed numbers) and the short summary line stay clear of every seat, the hand, the piles, the round's cards and the shell, in the type size the plan
// requires (16/12 px at least for the strips, 16/13 px for the line), and the line's box is the one the scene gave it. BM_OUT=…/before measured the build before C3-L.
// C3-5: the face of every card of the catalog as the table draws it (hand size and the small cards of the round): the nominal damage of the catalog (type and amount, symbols and numbers, no letters), nothing
// for a card without damage, the priority nowhere on the face (the inspection still gives it), no overlap with the cost chips; the faces of the hand at every turn with the amount resolved on the own V.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';
import assert from 'node:assert/strict';
import {fan,overlap,inside,seatBoxes,layoutProblems,tableLayout} from '../src/readability.ts';
// The grid on which the scene looks for the place of a close-up (`closeUp`, 8 px): at 24 px the check missed places the scene finds (1366×768 FFA, 144 object distributions out of 1024).
const CLOSE_UP_STEP=8;

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
async function open(name,opts={}){
 const {user,password}=accounts[name];
 const context=await browser.newContext({viewport:{width:vw,height:vh},...opts}),page=await context.newPage();
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
const toastFont=p=>p.page.evaluate(()=>{const e=document.querySelector('.toast');return e?parseFloat(getComputedStyle(e).fontSize):null;});
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
  {const sb=s.summary?.seats?.[seat.id]?.box;if(sb)boxes.push(sb);}if(!seat.me)boxes.push(fan(seat.backs,seat.back,s.backs[seat.id]??0).box);}
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
 return {scale:L.scale,played:L.played?{box:R(L.played.box),card:R(L.played.slots[0]),shows:s.readout.played}:null,piles:L.piles?{deck:R(L.piles.deck),discard:R(L.piles.discard),shows:s.readout.piles}:null,problems:L.piles!==undefined?layoutProblems(L,vw,vh,CLOSE_UP_STEP):['old build'],hand:{w:Math.round(L.hand.w),h:Math.round(L.hand.h),step:Math.round(L.hand.step),cards:hand.length},
  me:{person:R(me.person),item:R(me.items[0]),board:R(me.board),boardRow:+(me.board.h/5).toFixed(1),status:R(me.status)},
  others:others.map(o=>({id:o.id,person:R(o.person),item:R(o.items[0]),board:R(o.board),back:{w:Math.round(o.back.w),h:Math.round(o.back.h)}})),
  free:freeSpace(occupied,vw,vh),middle:{box:R(mid),free:midFree},below44:small,clash:[...new Set(clash)],shell:Object.fromEntries(Object.entries(dom).map(([k,v])=>[k,v&&R(v)]))};}

// C3-6: boxes the strips and the short summary line must stay clear of: every seat (character, board, the objects the view shows, the covered hand as drawn),
// the hand, the piles, the cards of the round and the HTML shell (clock, turn, menu, hint).
function obstacles(s,dom){
 const L=s.layout,items=id=>s.hits.filter(h=>h.target?.owner===id&&h.kind==='item').length,out=[];
 for(const seat of L.seats){out.push({n:`${seat.id} character`,b:seat.person},{n:`${seat.id} board`,b:seat.board});
  seat.items.slice(0,Math.max(1,items(seat.id))).forEach((b,i)=>{if(i<items(seat.id))out.push({n:`${seat.id} object ${i}`,b});});
  if(!seat.me)out.push({n:`${seat.id} covered hand`,b:fan(seat.backs,seat.back,s.backs[seat.id]??0).box});}
 s.hits.filter(h=>h.kind==='hand').forEach((h,i)=>out.push({n:`hand ${i}`,b:h}));
 if(L.piles)out.push({n:'deck',b:L.piles.deck},{n:'discard',b:L.piles.discard});if(L.played)out.push({n:'round cards',b:L.played.box});
 for(const k of ['top','hint'])if(dom[k])out.push({n:k,b:dom[k]});
 return out;}
const FONT={strip:c=>c?12:16,brief:c=>c?13:16};
function stripProblems(s,dom){const out=[],L=s.layout,sum=s.summary,seats=Object.entries(sum?.seats??{}),obs=obstacles(s,dom);
 const drawn=seats.filter(([,x])=>x.drawn);
 for(const [id,x] of drawn){const at=`strip ${id}`;if(!inside(x.box,vw,vh))out.push(`${at} off screen`);if(x.fs<FONT.strip(L.compact))out.push(`${at} type ${x.fs}`);
  for(const o of obs)if(overlap(x.box,o.b)>0)out.push(`${at} over ${o.n}`);
  for(const [oid,y] of drawn)if(oid!==id&&overlap(x.box,y.box)>0)out.push(`${at} over strip ${oid}`);
  if(dom.toast&&overlap(x.box,dom.toast)>0)out.push(`${at} over the short summary`);}
 return {out,seats:seats.length,drawn:drawn.length,missing:seats.filter(([,x])=>!x.drawn).map(([id])=>id),fonts:drawn.map(([,x])=>x.fs),texts:Object.fromEntries(seats.map(([id,x])=>[id,x.texts.join(' ')]))};}
function briefProblems(s,dom){const out=[],L=s.layout,t=dom.toast,obs=obstacles(s,dom);
 if(!t)return {out:['short summary not on the page'],shown:false};
 if(!s.brief)out.push('short summary without a place in the scene');
 if(!inside(t,vw,vh))out.push('short summary off screen');for(const o of obs)if(overlap(t,o.b)>0)out.push(`short summary over ${o.n}`);
 if(s.brief&&(Math.abs(t.x-s.brief.box.x)>1.5||Math.abs(t.y-s.brief.box.y)>1.5||Math.abs(t.w-s.brief.box.w)>1.5||Math.abs(t.h-s.brief.box.h)>1.5))out.push(`short summary box ${JSON.stringify(R(t))} is not the scene's ${JSON.stringify(R(s.brief.box))}`);
 return {out,shown:true,box:R(t),lines:s.brief?.lines,font:s.brief?.font};}

// C3-5: expected pills from the catalog strings, read independently of the client's parser: `HIT 15` is the type and «15», `HIT 20+x` is «20+» without the V (the catalog) or 20 + half the V left.
const pills=(card,left)=>{const amount=card.catalogAmount??card.damageAmount;if(amount&&amount!=='—')return amount.split(',').map(x=>{const m=/^\s*(HIT|CUT|POISON)\s+(\d+)(\+x)?\s*$/.exec(x);return m?{type:m[1],text:m[3]?(left===null?`${m[2]}+`:String(Number(m[2])+Math.trunc(left/2))):m[2]}:{type:'?',text:x};});
 const types=card.catalogDamage??card.damage;return types&&types!=='—'?types.split(',').map(t=>({type:t.trim(),text:''})):[];};
// C4-3: costs and gains as symbols, never letters. The coins of the face name the resources of the catalog cost, in order; the gains are a prefix of the catalog gains (one that does not fit is left out, as before);
// no text of the face is a number with the letter of a resource, nor a letter alone.
const LETTER_RES={H:'HEALTH',A:'ALERTNESS',V:'VIOLENCE',T:'TOXICITY',L:'ALCOHOL'};
function symbolProblems(f,card){const out=[],gainsWant=[...(card.gains??'').matchAll(/\+(?:\d+|x) ([HAVTL])\b/g)].map(m=>LETTER_RES[m[1]]),costWant=card.item?[]:Object.keys(card.cost??{});
 if(!f.marks)return ['the face does not report its symbols'];
 if(JSON.stringify(f.marks.cost)!==JSON.stringify(costWant))out.push(`cost symbols ${JSON.stringify(f.marks.cost)}, catalog ${JSON.stringify(costWant)}`);
 if(JSON.stringify(f.marks.gains)!==JSON.stringify(gainsWant.slice(0,f.marks.gains.length)))out.push(`gain symbols ${JSON.stringify(f.marks.gains)}, catalog ${JSON.stringify(gainsWant)} (gains ${JSON.stringify(card.gains)})`);
 const letters=f.texts.filter(t=>/^[!+\s]*(\d+|x)\s*[HAVTL]$/.test(t)||/^[HAVTL]$/.test(t));if(letters.length)out.push(`a letter of a resource on the face: ${JSON.stringify(letters)}`);
 return out;}
// C4-2: this check never fired (a backspace stood in the source for the word boundary): it proves itself at every run on a built case.
const LETTER_CODE=/^(HIT|CUT|POISON)\b|^[HCP] \d/;assert.ok(LETTER_CODE.test('HIT 15')&&LETTER_CODE.test('CUT')&&LETTER_CODE.test('P 5')&&!LETTER_CODE.test('HITMAN')&&!LETTER_CODE.test('Colpo'),'the letter-code check fires');
function faceProblems(f,card,{small,left}){const out=symbolProblems(f,card);if(card.item){if(f.damage.length)out.push('an object with a damage pill');return out;}
 if(small&&f.role&&f.damage.length)out.push('a role circle beside the damage symbol (it repeats it)');
 const want=pills(card,left),got=f.damage.map(d=>({type:d.type,text:d.text}));
 if(JSON.stringify(got.map(x=>x.type))!==JSON.stringify(want.map(x=>x.type)))out.push(`damage types ${JSON.stringify(got.map(x=>x.type))}, catalog ${JSON.stringify(want.map(x=>x.type))}`);
 else if(!small&&JSON.stringify(got.map(x=>x.text))!==JSON.stringify(want.map(x=>x.text)))out.push(`damage amounts ${JSON.stringify(got.map(x=>x.text))}, catalog ${JSON.stringify(want.map(x=>x.text))}`);
 if(f.texts.some(t=>/^P \d/.test(t)||t.includes('↻')))out.push(`priority on the face: ${JSON.stringify(f.texts.filter(t=>/^P \d/.test(t)||t.includes('↻')))}`);
 if(!small&&f.texts.some(t=>LETTER_CODE.test(t)))out.push('a letter code for the damage');
 f.damage.forEach((d,i)=>{if(!inside({...d.box,x:d.box.x+f.w/2,y:d.box.y+f.h/2},f.w,f.h))out.push(`pill ${i} ${JSON.stringify(R(d.box))} outside the face`);
  for(const c of f.costs)if(overlap(d.box,c)>0)out.push(`pill ${i} over a cost chip`);f.damage.slice(i+1).forEach(o=>{if(overlap(d.box,o.box)>0)out.push(`pill ${i} over another pill`);});});
 return out;}
// C4-4: the frame of each card drawn at the table, from the cards of the real game, against the type in the annex of the regulation.
const annex=JSON.parse(await readFile(join(repo,'docs/rules-catalog.json'),'utf8'));
const ANNEX_FRAME=Object.fromEntries([...annex.cards.map(c=>[c.name.trim(),c.type==='Oggetto'?'item':{Regolare:'regular',Base:'basic','Legata al personaggio':'bound','Ultima risorsa':'lastResort'}[c.subtype]]),...annex.tokens.map(c=>[c.name.trim(),'token'])]);
const frameProblem=(scope,name,frame)=>{const want=ANNEX_FRAME[name.trim()];if(frame!==want)bad(scope,`${name}: frame ${frame}, the annex says ${want}`);};
const handFaces=(s,scope)=>{const res=s.resources,rows=[];for(const it of s.readout.items)frameProblem(scope,it.name,it.frame);s.readout.hand.forEach((h,i)=>{const card=s.cards.find(c=>c.key===h.key);if(!card||!h.face){bad(scope,`hand card ${h.name} without a drawn face`);return;}frameProblem(scope,h.name,h.face.frame);
 const left=res.VIOLENCE===undefined?null:res.VIOLENCE-(card.cost?.VIOLENCE??0),pr=faceProblems(h.face,{...card,item:false},{small:false,left});for(const m of pr)bad(scope,`face of ${h.name}: ${m}`);rows.push({name:h.name,damage:h.face.damage.map(d=>`${d.type} ${d.text}`),texts:h.face.texts.length});});return rows;};
const run=name=>!only||only.includes(name);
// C4-2 (D8): every control of the table and of the game's dialogs at least 44 px, its own touch area included (::before); the semantic buttons only read the canvas, so what counts for them is
// the hit, and only the chips may stay under it. The list is the evidence: empty but for the chips.
const smallControls=p=>p.page.evaluate(()=>{const out=[];for(const e of document.querySelectorAll('main button,main summary,main a,main input,main select')){const st=getComputedStyle(e);if(st.display==='none'||st.visibility==='hidden'||e.closest('dialog:not([open])'))continue;
 if(!e.offsetWidth||!e.offsetHeight)continue;const b=getComputedStyle(e,'::before'),w=Math.max(e.offsetWidth,b.content!=='none'?parseFloat(b.width)||0:0),h=Math.max(e.offsetHeight,b.content!=='none'?parseFloat(b.height)||0:0);
 if(Math.min(w,h)<44)out.push({cls:String(e.className).slice(0,30),tag:e.tagName,hit:e.dataset.hit??null,w:+w.toFixed(1),h:+h.toFixed(1)});}return out;});
// A card and a target through the UI: the first card that admits a character.
async function aimAny(p){const s=await p.state();for(const c of s.cards){const now=await p.state(),own=now.hits.find(h=>h.id===c.key);if(!own)continue;await p.page.mouse.click(own.x-own.w*.22,own.y);await p.page.waitForTimeout(80);if((await p.state()).selected!==c.key)continue;
  for(const t of (await p.state()).hits.filter(h=>h.kind==='person').sort((a,b)=>Number(a.target.owner===s.me)-Number(b.target.owner===s.me))){if((await p.state()).selected!==c.key)break;await p.page.mouse.click(t.x,t.y-t.h*.2);await p.page.waitForTimeout(120);if(await dialogOpen(p)){await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);}if((await p.state()).target)return c;}
  await p.page.keyboard.press('Escape');await p.page.waitForTimeout(60);}return null;}
async function controlPass(p,scope){const seen={},note=async what=>{const l=await smallControls(p);seen[what]=l;for(const c of l)if(!(c.hit&&c.hit.startsWith('status-')))bad(scope,`${what}: control under 44 px ${JSON.stringify(c)}`);};
 const s=await p.state(),esc=()=>p.page.keyboard.press('Escape');await note('idle');
 const own=s.hits.find(h=>h.kind==='hand');await p.page.mouse.click(own.x-own.w*.22,own.y);await p.page.waitForTimeout(100);await note('card chosen');await esc();await p.page.waitForTimeout(100);
 if(await aimAny(p)){await note('confirmation');await p.shot(`${scope}-confirmation`);}else bad(scope,'no card admits a character: the confirmation was not seen');await esc();await p.page.waitForTimeout(100);await esc();await p.page.waitForTimeout(100);
 const me=(await p.state()).hits.find(h=>h.kind==='person'&&h.target.owner===s.me);await p.page.mouse.click(me.x,me.y-me.h*.2);await p.page.waitForTimeout(150);if(await dialogOpen(p)){await note('inspection');await esc();await p.page.waitForTimeout(100);}
 await p.page.getByLabel('Apri menu').click();await p.page.waitForTimeout(100);await note('menu');await p.page.getByRole('button',{name:'Ultimo turno'}).click();await p.page.waitForTimeout(100);await note('last turn');await esc();await p.page.waitForTimeout(150);
 return seen;}
// O12: from the first turn with played cards on: the round's cards are a target of 44 px or more that opens «Ultimo turno», which says the cost and, when a card played has one, the gain of the catalog (read from the faces, not from the client's parser).
async function roundLinkPass(p,scope){const s=await p.state(),link=p.page.getByTestId('round-link');if(!s.lastMoves.length)return null;if(!await link.count()){bad(scope,'no link on the round cards');return {link:false};}
 const box=await link.boundingBox(),faces=await p.page.evaluate(()=>window.__bm.faces(false)),withGain=s.lastMoves.filter(n=>/\+(\d+|x) [HAVTL]\b/.test(faces.find(f=>f.name===n)?.gains??''));
 if(Math.min(box.width,box.height)<44)bad(scope,`round cards link ${box.width}×${box.height}`);await link.click();await p.page.waitForTimeout(120);const report=p.page.locator('dialog[open] .report'),open=await report.count()===1;if(!open){bad(scope,'the round cards do not open the last turn');return {link:true,opens:false};}
 const txt=await report.innerText(),cost=/Costo nominale|Nessun costo nominale/.test(txt),gain=/Guadagno nominale/.test(txt);if(!cost)bad(scope,'the last turn says no cost');if(withGain.length&&!gain)bad(scope,`the last turn says no gain for ${withGain}`);await p.shot(`${scope}-last-turn`);await p.page.keyboard.press('Escape');await p.page.waitForTimeout(120);
 return {link:true,size:`${Math.round(box.width)}×${Math.round(box.height)}`,opens:true,moves:s.lastMoves,withGain,cost,gain};}
// C4-2 (D8): with a real finger path (emulated touch) each chip's content is reached from a target of 44 px or more: a tap on its character opens the inspection, which says what the chip says.
async function scenarioChips(){const scope=`chips${tag}`,A=await open('A',{hasTouch:true});await login(A);const rec={chips:[]};evidence.scenarios.chips=rec;
 try{await joinFfa(A);await waitList(A,1);await addComputers(A,4);await table(A);
  for(let t=0;t<6&&!rec.chips.length;t++){const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&!x.sequence.running)),60000,'turn');if(s.over||s.eliminated)break;
   const chips=s.hits.filter(h=>h.kind==='status');
   for(const c of chips){const now=await A.state(),person=now.hits.find(h=>h.kind==='person'&&h.target.owner===c.target.owner),chipRow=now.hits.filter(h=>h.kind==='status'&&h.target.owner===c.target.owner);if(!person){bad(scope,`${c.id}: no character`);continue;}
    if(Math.min(person.w,person.h)<44)bad(scope,`${c.id}: character ${person.w}×${person.h}`);const y=person.y-person.h*.25;if(chipRow.some(k=>Math.abs(k.y-y)<=k.h/2))bad(scope,`${c.id}: the tap would land on a chip`);
    await A.page.touchscreen.tap(person.x,y);await A.page.waitForSelector('dialog[open] .receipt',{timeout:5000}).catch(()=>{});const txt=await A.page.locator('dialog[open] .receipt').innerText().catch(()=>'');const has=txt.replace(/\s+/g,' ').includes(c.label.replace(/\s+/g,' '));
    rec.chips.push({id:c.id,chip:`${Math.round(c.w)}×${Math.round(c.h)}`,character:`${Math.round(person.w)}×${Math.round(person.h)}`,label:c.label,inInspection:has});if(!has)bad(scope,`${c.id}: «${c.label}» not in the inspection: ${txt.slice(0,300)}`);
    await A.page.getByRole('button',{name:'Torna al tavolo'}).click().catch(()=>{});await A.page.waitForTimeout(650);}
   if(!rec.chips.length)await playOne(A);await A.page.waitForTimeout(200);}
  if(!rec.chips.length)bad(scope,'no chip seen in six turns: nothing proved');
  await leave(A);
 }catch(e){evidence.errors.push(`chips: ${e?.stack??e}`);await A.shot('failure-chips').catch(()=>{});}finally{await A.context.close().catch(()=>{});}}
// C4-2: orientation and size changes on a real game (the limit of rule 1 declared in C3-7): with a card and a target chosen, to the other official measure, to portrait and back; a burst of sizes as a sliding browser bar gives. Nothing is sent by it, the table fits the measure it is at, ✓ and × stay reachable and off the target, and the game goes on.
async function scenarioResize(name,ffa){const scope=`${name}${tag}`,A=await open('A');await login(A);const rec={steps:[]};evidence.scenarios[name]=rec;
 const other=vw===1366?{width:844,height:390}:{width:1366,height:768},home={width:vw,height:vh};
 const look=async(what,size)=>{await A.page.waitForTimeout(350);const s=await A.state(),L=s.layout,mine=L.seats.find(x=>x.me),dom=await A.page.evaluate(()=>{const b=[...document.querySelectorAll('.confirmation button')].map(e=>{const r=e.getBoundingClientRect(),t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {x:r.x+r.width/2,y:r.y+r.height/2,reach:t===e||e.contains(t)};}),c=document.querySelector('.confirmation')?.getBoundingClientRect();return {b,card:c?{x:c.x+c.width/2,y:c.y+c.height/2,w:c.width,h:c.height}:null};});
  const row={what,size,commands:s.commands,target:s.target,resizes:s.stats.resizes,scale:L.scale,person:mine?R(mine.person):null,problems:layoutProblems(tableLayout(size.width,size.height,Object.keys(s.backs).concat(s.me),s.me,{}),size.width,size.height).length};rec.steps.push(row);
  if(s.target&&dom.card){const hit=s.hits.find(h=>(h.kind==='person'||h.kind==='item')&&h.target.owner===s.target.owner&&h.target.itemIndex===s.target.itemIndex);if(hit&&overlap(dom.card,hit)>0)bad(scope,`${what}: the card covers its target`);for(const b of dom.b){if(!b.reach)bad(scope,`${what}: control not reachable`);if(b.x<0||b.y<0||b.x>size.width||b.y>size.height)bad(scope,`${what}: control off the screen`);}}
  return s;};
 try{if(ffa){await joinFfa(A);await waitList(A,1);await addComputers(A,4);}else{await A.page.getByRole('radio',{name:'Contro il computer'}).click();await A.page.getByTestId('quick').click();}await table(A);
  await playOne(A);let s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&!x.sequence.running&&x.hits.some(h=>h.kind==='hand'))),60000,'turn');
  if(!await aimAny(A))bad(scope,'no card admits a character');
  const before=await look('start',home);if(!before.target)bad(scope,'no target chosen at the start');
  await A.page.setViewportSize(other);await look('other measure',other);await A.shot(`${name}-other`);
  const portrait={width:other.height,height:other.width};await A.page.setViewportSize(portrait);await A.page.waitForTimeout(250);rec.portrait=await A.page.locator('.portrait').isVisible();if(!rec.portrait)bad(scope,'no portrait notice');await A.shot(`${name}-portrait`);
  await A.page.setViewportSize(home);const back=await look('back',home);await A.shot(`${name}-back`);if(JSON.stringify(back.layout.scale)!==JSON.stringify(before.layout.scale))bad(scope,'factors changed on the way back');
  // A browser bar sliding in: many sizes in a row give one redraw at the end.
  const r0=(await A.state()).stats.resizes;for(let i=1;i<=10;i++){await A.page.setViewportSize({width:vw,height:vh-i*4});await A.page.waitForTimeout(25);}await A.page.waitForTimeout(350);const r1=(await A.state()).stats.resizes;rec.burst={sizes:10,applied:r1-r0};if(r1-r0>3)bad(scope,`${r1-r0} sizes applied for one sliding bar`);
  await A.page.setViewportSize(home);await A.page.waitForTimeout(350);const end=await A.state();if(end.commands!==before.commands)bad(scope,`${end.commands-before.commands} commands sent by resizing`);
  await A.page.keyboard.press('Escape');await A.page.waitForTimeout(100);await A.page.keyboard.press('Escape');await A.page.waitForTimeout(100);const T=(await A.state()).turn;rec.playedAfter=await playOne(A);await A.wait(x=>!x||x.over||x.eliminated||x.turn!==T,40000,'resolved after resizing');
  await leave(A);
 }catch(e){evidence.errors.push(`${name}: ${e?.stack??e}`);await A.shot(`failure-${name}`).catch(()=>{});}finally{await A.context.close().catch(()=>{});}}
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
   // C3-5: faces of the hand with the amount resolved on the own V; once per game the whole catalog drawn as the hand and as the round's small cards, and the inspection.
   if(!old){const scope=`${name}${tag} T${now.turn}`;rec.turns.at(-1).faces=handFaces(now,scope);
    if(t===0){const big=await A.page.evaluate(()=>window.__bm.faces(false)),small=await A.page.evaluate(()=>window.__bm.faces(true));
     rec.catalog={cards:big.length,withDamage:big.filter(c=>c.damage.length).length,rows:big.map(f=>({name:f.name,damage:f.damage.map(d=>`${d.type} ${d.text}`),catalog:f.catalogAmount}))};
     if(big.length!==37)bad(scope,`the catalog has ${big.length} cards, not 37`);if(rec.catalog.withDamage!==12)bad(scope,`${rec.catalog.withDamage} faces with damage, the catalog has 12`);
     for(const f of big){frameProblem(scope,f.name,f.frame);for(const m of faceProblems(f,f,{small:false,left:null}))bad(scope,`catalog face of ${f.name}: ${m}`);}
     for(const f of small)for(const m of faceProblems(f,f,{small:true,left:null}))bad(scope,`small face of ${f.name}: ${m}`);
     step(`${name}${tag} catalog faces`,{cards:big.length,withDamage:rec.catalog.withDamage,small:small.filter(f=>f.damage.length).length});
     const pick=now.cards.find(c=>c.damage&&c.damage!=='—')??now.cards[0];await A.page.locator(`[data-hit="${pick.key}"]`).focus();await A.page.keyboard.press('i');
     // C4-4: where the large card is shown, it has the frame of its type, the one of the same card at the table.
     {const large=await A.page.waitForFunction(()=>{const e=document.querySelector('.large-card');if(!e)return null;if(!e.offsetWidth)return {shown:false};const f=e.querySelector('.card-frame');return f?{shown:true,frame:e.dataset.frame,parts:f.children.length}:null;},null,{timeout:3000}).then(h=>h.jsonValue(),()=>null);if(!large)bad(scope,'the inspection has no frame');else if(large.shown){frameProblem(scope,pick.name,large.frame);step(`${name}${tag} inspection frame`,large);}}
     await A.page.waitForSelector('dialog[open] .receipt',{timeout:5000});const txt=await A.page.locator('dialog[open] .receipt').innerText(),marks=await A.page.locator('[data-testid=inspect-damage] svg').count();
     const types=pick.damage&&pick.damage!=='—'?pick.damage.split(',').length:0;rec.inspection={card:pick.name,priority:pick.priority,marks,text:txt.slice(0,300)};
     if(!new RegExp(`Priorità\\s*${pick.priority}\\b`).test(txt))bad(scope,`the inspection of ${pick.name} does not show the priority ${pick.priority}`);if(marks!==types)bad(scope,`the inspection shows ${marks} damage symbols for ${types} types`);
     await A.page.keyboard.press('Escape');await A.page.waitForTimeout(150);if(await dialogOpen(A))await A.page.keyboard.press('Escape');}}
   // C3-6: the strips of the round's summary (they stay until the first card choice) clear of everything, in the type size of the plan.
   if(now.summary){const sp=stripProblems(now,await shell(A));rec.turns.at(-1).strips={seats:sp.seats,drawn:sp.drawn,missing:sp.missing,fonts:sp.fonts,texts:sp.texts};step(`${name}${tag} T${now.turn} strips`,rec.turns.at(-1).strips);
    if(!old){for(const m of sp.out)bad(`${name}${tag} T${now.turn}`,m);
     // The compact FFA may lack the room for a strip when a round changes many entries; everywhere else every seat has its strip.
     if(sp.missing.length&&!(now.layout.compact&&now.layout.seats.length>2))bad(`${name}${tag} T${now.turn}`,`no strip for ${sp.missing}`);
     if(sp.seats!==now.layout.seats.length)bad(`${name}${tag} T${now.turn}`,`summary of ${sp.seats} seats on a table of ${now.layout.seats.length}`);}}
   await A.shot(`${name}-T${now.turn}`);
   if(!old&&t===0){rec.controls=await controlPass(A,`${name}${tag}`);step(`${name}${tag} controls`,rec.controls);}
   if(!old&&!rec.roundLink?.gain){const r=await roundLinkPass(A,`${name}${tag}`);if(r){rec.roundLink=r;step(`${name}${tag} round link`,r);}}
   if(t<turns){await A.page.evaluate(()=>window.__bm.measureStart());await playOne(A);await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,40000,'resolved');
    // C3-6: the short summary line, as the round arrives: where the scene put it, clear of everything, 16 px (desktop) or 13 px (compact).
    {const arrival=await A.state();if(arrival&&!arrival.over&&!arrival.eliminated){const dom=await shell(A),bp=briefProblems(arrival,dom),font=await toastFont(A);rec.briefs=(rec.briefs??[]).concat({turn:arrival.turn,...bp,fontPx:font});step(`${name}${tag} T${arrival.turn} short summary`,rec.briefs.at(-1));
     if(!old){for(const m of bp.out)bad(`${name}${tag} T${arrival.turn}`,m);if(bp.shown&&font<FONT.brief(arrival.layout.compact))bad(`${name}${tag} T${arrival.turn}`,`short summary type ${font}`);
      for(const c of await smallControls(A))if(!(c.hit&&c.hit.startsWith('status-')))bad(`${name}${tag} T${arrival.turn}`,`with the short summary: control under 44 px ${JSON.stringify(c)}`);}
     await A.shot(`${name}-T${arrival.turn}-summary`);}}
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
 if(run('chips'))await scenarioChips();
 if(run('resize'))await scenarioResize('resize-duel',false);
 if(run('resize'))await scenarioResize('resize-ffa',true);
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

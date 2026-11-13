// SB-16g 2a, revised by D69: captures of the card found shown face up (D58) and of the vulnerability token (D64, D66, D69) on the
// profile `bozza`, not a check. `chip`: the timed token of a failed search; `held`: the token bound to the name of the card found.
// Adapted from ../sb-16f0/captures.mjs. Starts the jar with the profiles local,bozza on a temporary database (port 8080 free, client
// served on 4320 by ./client-web/run.ps1 -Task Serve, jar built), plays quick 1vCom games through the UI with reduced motion, keeps
// the hit found by a search in hand (it plays the charge first and the searched hit last), and saves the table, the inspections and
// the status tip when they show what 2a adds. Usage: node captures.mjs <repo> <out>.
// Env: BM_GAMES (default 6), BM_SOURCES (app.bozza.sources, default the profile's bozza), BM_POOL, BM_COM, BM_BOT, BM_WANT
// (comma list among opp,own,chip,held; default opp,own).
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [repo,out]=process.argv.slice(2);
const {chromium}=createRequire(join(repo,'client-web','package.json'))('@playwright/test');
const url='http://127.0.0.1:4320',api='http://127.0.0.1:8080';
const GAMES=Number(process.env.BM_GAMES??6);
const WANT=(process.env.BM_WANT??'opp,own').split(',').map(x=>x.trim()).filter(Boolean);
await mkdir(out,{recursive:true});
const say=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const data=await mkdtemp(join(tmpdir(),'bm-sb16g2a-'));
let server=null,browser=null;
const log={data,sources:process.env.BM_SOURCES??null,want:WANT,games:[],captures:[]};
const timer=setTimeout(()=>{say('time limit');finish(1);},25*60*1000);

async function startServer(){
 const l=createWriteStream(join(data,'server.log'),{flags:'a'});
 const args=['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local,bozza','--app.dev.seed-accounts=true',
  `--app.bozza.pool=${process.env.BM_POOL??'starter-spazienzio'}`,`--app.bozza.com=${process.env.BM_COM??'starter-spazienzio'}`,`--app.bozza.bot=${process.env.BM_BOT??'aggressivo'}`];
 if(process.env.BM_SOURCES)args.push(`--app.bozza.sources=${process.env.BM_SOURCES}`);
 server=spawn(java,args,{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm-bozza.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(l);server.stderr.pipe(l);
 const end=Date.now()+120000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited (${server.exitCode}); log in ${data}`);
  try{const r=await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start');
}
async function finish(code){
 clearTimeout(timer);
 try{await writeFile(join(out,'captures.json'),JSON.stringify(log));}catch{}
 try{await browser?.close();}catch{}
 if(server&&server.exitCode===null){try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{}}
 process.exit(code);
}

const PREFER=['PAZIENZA: FINITA'];
async function main(){
 await startServer();say('server up',data);
 browser=await chromium.launch({channel:'msedge'});
 const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`timeout ${what}`);};
 const dialogOpen=()=>page.evaluate(()=>!!document.querySelector('dialog[open]'));
 const esc=()=>page.keyboard.press('Escape');
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await page.getByTestId('quick').waitFor({timeout:15000});
 // The same move through the UI as VerifyLayout: taps on card, target and discard. The charge first, the searched hit last, so
 // that the copy found stays in hand; with little health, any hit first.
 async function playOne(){
  const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await esc();await page.waitForTimeout(60);}};
  const start=await state();
  const low=(start.resources.HEALTH??99)<=30,hits=c=>{const x=start.cards.find(k=>k.key===c.key);return !!x?.damage&&x.damage!=='—';};
  const rank=c=>low?(hits(c)?0:1):PREFER.includes(c.name)?0:/GARGANTUESCO/.test(c.name)?2:1;
  for(const card of [...start.order].sort((a,b)=>rank(a)-rank(b))){
   const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   let aimed=false;
   const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
   for(const t of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await state()).hits.find(h=>h.id===t.id);if(!now)continue;await tap(now);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}
   const s=await state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key&&!/GARGANTUESCO/.test(h.label))){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   await page.getByTestId('confirm').click();
   const r=await wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
   return card.name;
  }
  throw new Error('no playable card');
 }
 const got={};
 const shot=async(kind,turn,extra={})=>{const file=`${kind}-turn${turn}.png`;await page.screenshot({path:join(out,file)});log.captures.push({kind,turn,file,...extra});say('captured',kind,turn);return file;};
 async function inspection(kind,turn){await page.locator('section.inspection').waitFor({timeout:5000});const text=await page.locator('section.inspection .receipt').innerText();await shot(kind,turn,{text});
  await esc();await page.waitForTimeout(150);if(await dialogOpen()){await esc();await page.waitForTimeout(150);}}
 async function look(s){
  const opp=s.hits.find(h=>h.kind==='revealed');
  if(opp&&WANT.includes('opp')&&!got.opp){
   await page.mouse.move(opp.x,opp.y);await page.waitForTimeout(200);await shot('opp-revealed',s.turn,{label:opp.label});
   await page.mouse.click(opp.x,opp.y);await inspection('opp-revealed-inspect',s.turn);await page.mouse.move(5,5);got.opp=true;}
  const own=s.hits.find(h=>h.kind==='hand'&&/scoperta/.test(h.label));
  if(own&&WANT.includes('own')&&!got.own){
   await page.mouse.move(5,5);await page.waitForTimeout(150);await shot('own-revealed',s.turn,{label:own.label});
   await page.locator(`[data-hit="${own.id}"]`).focus();await page.keyboard.press('i');await inspection('own-revealed-inspect',s.turn);got.own=true;}
  for(const [want,re] of [['chip',/La ricerca non ha trovato/],['held',/Nessun timer/]]){
   const chip=s.hits.find(h=>h.kind==='status'&&h.id.includes('-vu-')&&re.test(h.label));
   if(chip&&WANT.includes(want)&&!got[want]){await page.mouse.move(chip.x,chip.y);await page.waitForTimeout(250);
    const tip=await page.getByTestId('status-tip').allInnerTexts();await shot(`chip-${want}`,s.turn,{label:chip.label,tip});await page.mouse.move(5,5);got[want]=true;}}
 }
 for(let g=0;g<GAMES&&!WANT.every(w=>got[w]);g++){
  if(g>0){
   if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
   const again=page.getByTestId('again');if(await again.count())await again.click();
   else{await page.getByRole('button',{name:'Torna all’hub'}).click();await page.getByTestId('quick').waitFor({timeout:15000});await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
  }else{await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
  await wait(x=>x&&x.turn===0&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'table');
  const game={turns:0,revealed:[],chips:[]};log.games.push(game);
  while(true){
   const s=await wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),60000,'turn');
   for(const h of s.hits){if(h.kind==='revealed'||(h.kind==='hand'&&/scoperta/.test(h.label)))game.revealed.push({turn:s.turn,kind:h.kind,label:h.label});
    if(h.kind==='status'&&h.id.includes('-vu-'))game.chips.push({turn:s.turn,id:h.id,label:h.label});}
   if(!s.over&&!s.eliminated)await look(s);
   if(s.over||s.eliminated)break;
   await playOne();game.turns++;
   await wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'turn resolved');
  }
  const end=await state();game.over=end.over;game.lastTurn=end.turn;say('game',g,game.turns,'turns',game.revealed.length,'revealed',game.chips.length,'chips');
 }
 log.got=got;log.pageErrors=errors;
}
main().then(()=>finish(0),e=>{log.error=String(e.stack??e);say(e);finish(1);});

// SB-16f0: captures of the round report («Ultimo turno») on the profile `bozza`, not a check. Starts the jar with the profiles
// local,bozza on a temporary database (port 8080 free, client served on 4320 by ./client-web/run.ps1 -Task Serve, jar built),
// plays quick 1vCom games through the UI with reduced motion and, when a round has a search found, a search that found nothing or
// a move voided «a terra», opens «Ultimo turno» and saves a capture (and the inspection of the found card).
// Usage: node sb16f0-captures.mjs <repo> <out>. Env: BM_GAMES (default 8), BM_POOL, BM_COM, BM_BOT.
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [repo,out]=process.argv.slice(2);
const {chromium}=createRequire(join(repo,'client-web','package.json'))('@playwright/test');
const url='http://127.0.0.1:4320',api='http://127.0.0.1:8080';
const GAMES=Number(process.env.BM_GAMES??8);
await mkdir(out,{recursive:true});
const say=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const data=await mkdtemp(join(tmpdir(),'bm-sb16f0-'));
let server=null,browser=null;
const log={data,games:[],captures:[]};
const timer=setTimeout(()=>{say('time limit');finish(1);},25*60*1000);

async function startServer(){
 const l=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local,bozza','--app.dev.seed-accounts=true',
  `--app.bozza.pool=${process.env.BM_POOL??'starter-spazienzio'}`,`--app.bozza.com=${process.env.BM_COM??'starter-spazienzio'}`,`--app.bozza.bot=${process.env.BM_BOT??'aggressivo'}`],
  {cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm-bozza.sqlite')},stdio:['ignore','pipe','pipe']});
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
 // The same move through the UI as VerifyLayout: taps on card, target and discard; the preferred cards first, the searched hit last.
 async function playOne(){
  const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await esc();await page.waitForTimeout(60);}};
  const start=await state();
  // With little health left, hits on the opponent first: the move of an author already down is voided only when it is not on itself.
  const low=(start.resources.HEALTH??99)<=40,hits=c=>{const x=start.cards.find(k=>k.key===c.key);return !!x?.damage&&x.damage!=='—';};
  const rank=c=>low?(hits(c)?0:1):PREFER.includes(c.name)?0:/GARGANTUESCO/.test(c.name)?2:1;
  for(const card of [...start.order].sort((a,b)=>rank(a)-rank(b))){
   const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   let aimed=false;
   const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>low?((a.id.startsWith('person-')&&a.id!==`person-${start.me}`?0:1)-(b.id.startsWith('person-')&&b.id!==`person-${start.me}`?0:1)):(a.kind==='item'?0:1)-(b.kind==='item'?0:1));
   for(const t of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await state()).hits.find(h=>h.id===t.id);if(!now)continue;await tap(now);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}
   const s=await state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   await page.getByTestId('confirm').click();
   const r=await wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
   return card.name;
  }
  throw new Error('no playable card');
 }
 const only=process.env.BM_ONLY;const want={found:only==='void',foundOpponent:only==='void',missed:only==='void',void:false};
 async function capture(kind,turn){
  if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
  const outcome=page.getByLabel('Esito').getByRole('button',{name:'Ultimo turno'});if(await outcome.count())await outcome.click();else{await page.getByLabel('Apri menu').click();await page.locator('section.menu').getByRole('button',{name:'Ultimo turno'}).click();}
  const report=page.locator('section.report');await report.waitFor({timeout:5000});
  const file=`${kind}-turn${turn}.png`;await page.screenshot({path:join(out,file)});
  const facts=await report.locator('[data-testid=report-facts]').innerText();
  const entry={kind,turn,file,facts};
  if(kind.startsWith('found')){
   const b=report.getByTestId('report-revealed');entry.revealButton=await b.allInnerTexts();
   if(await b.count()){await b.first().click();await page.locator('section.inspection').waitFor({timeout:5000});const f2=`${kind}-turn${turn}-inspect.png`;await page.screenshot({path:join(out,f2)});entry.inspect={file:f2,text:await page.locator('section.inspection .receipt').innerText()};}
  }
  log.captures.push(entry);say('captured',kind,turn);
  await esc();await page.waitForTimeout(150);if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
 }
 for(let g=0;g<GAMES&&!(want.foundOpponent&&want.missed&&want.void);g++){
  if(g>0){
   if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
   const again=page.getByTestId('again');if(await again.count())await again.click();
   else{await page.getByRole('button',{name:'Torna all’hub'}).click();await page.getByTestId('quick').waitFor({timeout:15000});await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
  }else{await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
  await wait(x=>x&&x.turn===0&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'table');
  const game={turns:0,searches:[],voids:[]};log.games.push(game);
  while(true){
   const s=await wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),60000,'turn');
   if(s.turn>0&&s.resolution){
    const me=s.me,moves=s.resolution.moves;
    for(const m of moves){if(m.search)game.searches.push({turn:s.turn,mine:m.author===me,...m.search,revealed:m.search.revealed?.name});if(m.voidReason)game.voids.push({turn:s.turn,mine:m.author===me,reason:m.voidReason});}
    const opp=moves.find(m=>m.search?.found&&m.author!==me),any=moves.find(m=>m.search?.found),miss=moves.find(m=>m.search&&!m.search.found),vd=moves.find(m=>m.voidReason);
    if(opp&&!want.foundOpponent){await capture('found-opponent',s.turn);want.foundOpponent=want.found=true;}
    else if(any&&!want.found){await capture('found-own',s.turn);want.found=true;}
    if(miss&&!want.missed){await capture('missed',s.turn);want.missed=true;}
    if(vd&&!want.void){await capture('void',s.turn);want.void=true;}
   }
   if(s.over||s.eliminated)break;
   await playOne();game.turns++;
   await wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'turn resolved');
  }
  const end=await state();game.over=end.over;game.lastTurn=end.turn;say('game',g,JSON.stringify(game));
 }
 log.want=want;log.pageErrors=errors;
}
main().then(()=>finish(0),e=>{log.error=String(e.stack??e);say(e);finish(1);});

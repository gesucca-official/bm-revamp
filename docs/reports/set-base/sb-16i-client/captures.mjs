// SB-16i, client step: captures on the profile `bozza` (1.6b, rules d50), not a check. Starts the jar with the profiles local,bozza on a
// temporary database (port 8080 free, client served on 4320 by ./client-web/run.ps1 -Task Serve, jar built), plays quick 1vCom games
// through the UI (Mara against Mara by default, computer `aggressivo`) and saves: the dialog of the choice between two names, a two-name
// search found and one that found nothing, «Gioca d'anticipo» yes and no, the counter on the own last resort and in the opponent's
// inspection. Same pattern as sb-16f0/captures.mjs.
// Usage: node captures.mjs <repo> <out>. Env: BM_GAMES (default 6), BM_WIDTH/BM_HEIGHT (default 1366×768), BM_POOL, BM_COM, BM_BOT.
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [repo,out]=process.argv.slice(2);
const {chromium}=createRequire(join(repo,'client-web','package.json'))('@playwright/test');
const url='http://127.0.0.1:4320',api='http://127.0.0.1:8080';
const GAMES=Number(process.env.BM_GAMES??6),W=Number(process.env.BM_WIDTH??1366),H=Number(process.env.BM_HEIGHT??768),size=`${W}x${H}`;
await mkdir(out,{recursive:true});
const say=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const data=await mkdtemp(join(tmpdir(),'bm-sb16i-client-'));
let server=null,browser=null,pageRef=null;
const log={size,data,games:[],captures:[]};
const timer=setTimeout(()=>{say('time limit');finish(1);},30*60*1000);

async function startServer(){
 const l=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local,bozza','--app.dev.seed-accounts=true',
  `--app.bozza.pool=${process.env.BM_POOL??'starter-mara'}`,`--app.bozza.com=${process.env.BM_COM??'starter-mara'}`,`--app.bozza.bot=${process.env.BM_BOT??'aggressivo'}`],
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
 try{await writeFile(join(out,`captures-${size}${process.env.BM_TAG?`-${process.env.BM_TAG}`:''}.json`),JSON.stringify(log));}catch{}
 try{await browser?.close();}catch{}
 if(server&&server.exitCode===null){try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{}}
 process.exit(code);
}

// The two-name charges first (they open the choice), then the cards with «Gioca d'anticipo», the last resort as soon as it is in hand
// (it comes only with the deck exhausted). BM_LONG=1: cards without damage before hits, to make the game last until the last resorts.
const CHARGES=['PAZIENZA: FINITA','TI FACCIO SPAZIO','Slalom d\'avvicinamento','Ti stringo la curva','Dose in preparazione','Un assaggino','Un altro e arrivo','Prima il brindisi','Preparo il lavoro','Una stretta di prova'].map(n=>n.toLowerCase());
const AHEAD=['Sorpasso in curva','Sgommata','Cinghiata di traverso'].map(n=>n.toLowerCase()),LONG=process.env.BM_LONG==='1';
async function main(){
 await startServer();say('server up',data);
 browser=await chromium.launch({channel:'msedge'});
 const context=await browser.newContext({viewport:{width:W,height:H},reducedMotion:'reduce'}),page=await context.newPage();pageRef=page;
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`timeout ${what}`);};
 const dialogOpen=()=>page.evaluate(()=>!!document.querySelector('dialog[open]'));
 const esc=()=>page.keyboard.press('Escape');
 const shot=async name=>{const file=`${size}-${name}.png`;await page.screenshot({path:join(out,file)});return file;};
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await page.getByTestId('quick').waitFor({timeout:15000});
 const want={choice:false,found:false,missed:false,aheadYes:false,aheadNo:false,own:false,opponent:false};
 // BM_WANT=missed,own,opponent: only those captures (the others count as done).
 const wanted=process.env.BM_WANT?.split(',');if(wanted)for(const k of Object.keys(want))if(!wanted.includes(k))want[k]=true;
 let turnCount=0;
 async function playOne(){
  const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await esc();await page.waitForTimeout(60);}};
  const start=await state();turnCount++;
  const lastResort=c=>/last resort|ultima dose|ultimo giro/i.test(c.name),info=c=>start.cards.find(k=>k.key===c.key);
  const rank=c=>lastResort(c)?0:CHARGES.includes(c.name.toLowerCase())?(want.choice&&!LONG?2:1):AHEAD.includes(c.name.toLowerCase())?2:LONG?(info(c)?.damage&&info(c).damage!=='—'?4:3):3;
  for(const card of [...start.order].sort((a,b)=>rank(a)-rank(b))){
   const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   let aimed=false;
   const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.kind==='person'&&a.id!==`person-${start.me}`?0:1)-(b.kind==='person'&&b.id!==`person-${start.me}`?0:1));
   for(const t of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await state()).hits.find(h=>h.id===t.id);if(!now)continue;await tap(now);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}
   const s=await state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   await page.getByTestId('confirm').click();await page.waitForTimeout(150);
   // SB-16g: the warning before discarding the last copy that holds a token is accepted; the choice may follow it.
   if(await page.getByTestId('discard-warning').count()){await page.getByRole('button',{name:'Sì, scarta e gioca'}).click();await page.waitForTimeout(150);}
   // SB-16i: with both names in the deck the dialog asks which one to search; the second option is chosen.
   const choice=page.getByTestId('search-choice');
   if(await choice.count()){
    const options=await page.getByTestId('search-option').allInnerTexts();
    if(!want.choice){log.captures.push({kind:'choice',turn:s.turn,card:card.name,options,file:await shot('1-scelta')});want.choice=true;say('captured choice');}
    await page.getByTestId('search-option').nth(1).click();log.choices=(log.choices??0)+1;
   }
   const r=await wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){log.rejected=[...(log.rejected??[]),r.message];await esc();continue;}
   return card.name;
  }
  throw new Error('no playable card');
 }
 async function report(kind,turn,name){
  if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
  const outcome=page.getByLabel('Esito').getByRole('button',{name:'Ultimo turno'});if(await outcome.count())await outcome.click();else{await page.getByLabel('Apri menu').click();await page.locator('section.menu').getByRole('button',{name:'Ultimo turno'}).click();}
  const r=page.locator('section.report');await r.waitFor({timeout:5000});
  const facts=await r.locator('[data-testid=report-facts]').innerText();
  log.captures.push({kind,turn,file:await shot(name),facts});say('captured',kind,turn);
  await esc();await page.waitForTimeout(150);if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
 }
 async function inspectOpponent(turn,opp){
  if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
  await page.locator(`[data-hit="person-${opp}"]`).focus();await page.keyboard.press('i');
  const i=page.locator('section.inspection');await i.waitFor({timeout:5000});
  const text=await i.locator('[data-testid=inspect-plays]').innerText().catch(()=>null);
  log.captures.push({kind:'opponent-counter',turn,text,file:await shot('7-contatore-avversario')});say('captured opponent counter',text);
  await esc();await page.waitForTimeout(150);
 }
 for(let g=0;g<GAMES&&!Object.values(want).every(Boolean);g++){
  if(g>0){
   if(await dialogOpen()){await esc();await page.waitForTimeout(150);}
   const again=page.getByTestId('again');if(await again.count())await again.click();
   else{await page.getByRole('button',{name:'Torna all’hub'}).click();await page.getByTestId('quick').waitFor({timeout:15000});await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
  }else{await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
  await wait(x=>x&&x.turn===0&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'table');
  const game={turns:0,searches:[],ahead:[],plays:[]};log.games.push(game);turnCount=0;
  while(true){
   const s=await wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand')&&!x.sequence.running)),60000,'turn');
   const me=s.me,opp=s.players.find(id=>id!==me);
   if(s.turn>0&&s.resolution){
    const moves=s.resolution.moves;
    for(const m of moves){
     if(m.search)game.searches.push({turn:s.turn,mine:m.author===me,card:m.search.card,found:m.search.found,announced:m.search.announced});
     if(m.ahead!==undefined)game.ahead.push({turn:s.turn,mine:m.author===me,card:m.card,ahead:m.ahead});
     if(m.plays!==undefined)game.plays.push({turn:s.turn,mine:m.author===me,card:m.card,plays:m.plays});}
    const two=m=>m.search&&m.search.announced?.length===2&&!m.void;
    if(!want.found&&moves.some(m=>two(m)&&m.search.found)){await report('found',s.turn,'2-ricerca-trovata');want.found=true;}
    if(!want.missed&&moves.some(m=>two(m)&&!m.search.found)){await report('missed',s.turn,'3-ricerca-fallita');want.missed=true;}
    if(!want.aheadYes&&moves.some(m=>m.ahead===true)){await report('ahead-yes',s.turn,'4-anticipo-si');want.aheadYes=true;}
    if(!want.aheadNo&&moves.some(m=>m.ahead===false)){await report('ahead-no',s.turn,'5-anticipo-no');want.aheadNo=true;}
    const lastOwn=moves.find(m=>m.plays!==undefined&&m.author===me),lastOpp=moves.find(m=>m.plays!==undefined&&m.author!==me);
    if(!want.own&&lastOwn){const lr=(await state()).hits.find(h=>h.kind==='hand'&&/ULTIMA RISORSA/.test(h.label));log.captures.push({kind:'own-counter',turn:s.turn,label:lr?.label??null,file:await shot('6-contatore-proprio')});want.own=true;say('captured own counter',lr?.label);}
    if(!want.opponent&&lastOpp){await report('opponent-plays',s.turn,'7b-rincara-avversario');await inspectOpponent(s.turn,opp);want.opponent=true;}
   }
   if(s.over||s.eliminated)break;
   await playOne();game.turns++;
   await wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'turn resolved');
  }
  const end=await state();game.over=end.over;game.lastTurn=end.turn;game.winner=end.winner;game.deckLeft=end.deckCount;say('game',g,JSON.stringify({turns:game.turns,deckLeft:end.deckCount,searches:game.searches.length,ahead:game.ahead.length,plays:game.plays.length}));
 }
 log.want=want;log.pageErrors=errors;
}
main().then(()=>finish(0),async e=>{log.error=String(e.stack??e);say(e);try{await pageRef?.screenshot({path:join(out,`${size}-error.png`)});log.errorText=await pageRef?.locator('dialog[open]').innerText().catch(()=>null);}catch{}finish(1);});

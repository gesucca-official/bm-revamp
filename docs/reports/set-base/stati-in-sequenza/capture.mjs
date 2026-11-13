// Real -Bozza capture. Run ONLY with server clearance and free 18086; starts/stops its own server and preview.
// Node 24 capture.mjs <repo> <out> [before|after]. Baseline: build HEAD client into tmp/stati-in-sequenza/before-dist first.
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,writeFile,readFile,stat} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,extname,resolve} from 'node:path';
import assert from 'node:assert/strict';
const [repo,out,version='after']=process.argv.slice(2),{chromium}=createRequire(join(repo,'client-web/package.json'))('@playwright/test');
const serverPort=18086,api=`http://127.0.0.1:${serverPort}`;
const port=14366,url=`http://127.0.0.1:${port}`;await mkdir(out,{recursive:true});
const data=await mkdtemp(join(tmpdir(),'bm-stati-sequenza-')),children=[],log={version,data,command:'./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Pool starter-gigi -Com starter-spazienzio -Bot prudente',captures:[],rounds:[],errors:[]};
let browser;const pause=ms=>new Promise(r=>setTimeout(r,ms));
function start(args,env,name){const p=spawn('powershell.exe',['-NoProfile','-File',...args],{cwd:repo,windowsHide:true,env:{...process.env,...env}}),stream=createWriteStream(join(data,name+'.log'));p.stdout.pipe(stream);p.stderr.pipe(stream);children.push(p);return p;}
async function finish(code){clearTimeout(limit);await writeFile(join(out,`${version}.json`),JSON.stringify(log));try{await browser?.close();}catch{}for(const p of children.reverse())try{execFileSync('taskkill',['/PID',String(p.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{}process.exit(code);}
const limit=setTimeout(()=>finish(1),600000);
async function main(){
 if(await fetch(api+'/api/rest/v1/sign-in/validate',{method:'POST'}).then(()=>true,()=>false))throw Error('18086 already used: do not stop other processes');
 start([join(repo,'scripts/dev.ps1'),'-Task','Server','-Bozza','-SeedAccounts','-Pool','starter-gigi','-Com','starter-spazienzio','-Bot','prudente'],{BM_DATABASE_PATH:join(data,'bozza.sqlite'),SERVER_PORT:String(serverPort)},'server');
 start([join(repo,'client-web/run.ps1'),'-Task','Serve'],{BM_PORT:String(port),BM_SERVER:api},'preview');
 for(let i=0;i<240;i++){try{const r=await fetch(api+'/api/rest/v1/sign-in/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok&&(await fetch(url)).ok)break;}catch{}if(i===239)throw Error('Startup timeout');await pause(500);}
 log.started=true;browser=await chromium.launch({channel:'msedge'});const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
 if(version==='before'){
  const base=resolve(repo,'tmp/stati-in-sequenza/before-dist');
  await page.route(url+'/**',async route=>{const path=new URL(route.request().url()).pathname;if(path.startsWith('/rest')||path.startsWith('/ws'))return route.continue();
   const file=resolve(base,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(base))return route.abort();
   try{if(!(await stat(file)).isFile())return route.continue();const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.mp3':'audio/mpeg'};await route.fulfill({body:await readFile(file),contentType:types[extname(file)]??'application/octet-stream'});}catch{return route.continue();}});
 }
 page.on('pageerror',e=>log.errors.push(String(e)));await page.clock.install();
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 async function wait(pred,ms=30000){const until=Date.now()+ms;while(Date.now()<until){const s=await state();if(pred(s))return s;await pause(40);}throw Error('UI wait timed out');}
 const activate=async id=>page.locator(`[data-hit="${id}"]`).evaluate(e=>e.click());
 async function capture(kind,moveIndex){
  await page.clock.pauseAt(new Date(await page.evaluate(()=>Date.now()+100)));let s=await state(),plan=s.stats.sequencePlans.at(-1);const schedule=s.stats.schedule.filter(x=>x.key===plan.key),move=schedule[moveIndex];
  async function at(label,time){const elapsed=await page.evaluate(start=>performance.now()-start,plan.started);await page.clock.runFor(Math.max(0,time-elapsed));
   const snapshot=await state(),tokens=snapshot.hits.filter(h=>h.kind==='status'&&h.id.startsWith(`status-${snapshot.me}-vu-`));
   const file=`${version}-${kind}-${label}.jpg`;await page.screenshot({path:join(out,file),type:'jpeg',quality:78});log.captures.push({file,kind,label,turn:snapshot.turn,time,tokens:tokens.map(h=>h.label),running:snapshot.sequence.running});return {snapshot,tokens};}
  const early=await at('inizio',60),resolved=await at('mossa',move.changes+60),tail=await at('fine-turno',plan.pace.tail.at+60),end=await at('finale',plan.total+60);
  if(version==='after'){
   if(kind==='caricamento'){assert.equal(early.tokens.length,0);assert.equal(resolved.tokens.length,1);assert.equal(end.tokens.length,1);}
   else{assert.equal(early.tokens.length,1);assert.equal(resolved.tokens.length,1);assert.equal(tail.tokens.length,1);assert.equal(end.tokens.length,0);}
  }
  await page.clock.resume();return end.snapshot;
 }
 await page.goto(url+'/#/accedi');await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor();await page.getByRole('radio',{name:'Contro il computer'}).click();
 let charged=false,hit=false,hitName=null;
 for(let game=0;game<8&&!hit;game++){
  if(game){if(await page.getByTestId('again').isVisible())await page.getByTestId('again').click();else{await page.getByRole('button',{name:'Apri menu'}).click();await page.getByRole('button',{name:'Abbandona la partita',exact:true}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();await page.getByTestId('quick').click();}}else await page.getByTestId('quick').click();
  let chargedThisGame=false;
  for(let turn=0;turn<26&&!hit;turn++){
   const s=await wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&!x.sequence.running)));if(s.over||s.eliminated)break;
   const rank=c=>chargedThisGame&&c.name===hitName?-2:c.name==='Preparo il lavoro'?-1:0;let sent=false;
   for(const c of [...s.order].sort((a,b)=>rank(a)-rank(b))){
    await activate(c.key);for(const target of (await state()).hits.filter(h=>h.kind==='person'||h.kind==='item')){if((await state()).selected!==c.key)await activate(c.key);await activate(target.id);if((await state()).target)break;}
    let now=await state();if(!now.target){await page.keyboard.press('Escape');continue;}
    if(now.message.includes('scartare'))for(const d of now.order.filter(d=>d.key!==c.key&&d.name!==hitName)){await activate(d.key);if((await state()).discard)break;}
    if(!(await page.getByTestId('confirm').isEnabled())){await page.keyboard.press('Escape');continue;}
    await page.getByTestId('confirm').click();if(await page.getByTestId('discard-warning').isVisible()){await page.keyboard.press('Escape');await page.keyboard.press('Escape');continue;}
    const next=await wait(x=>x&&(x.turn!==s.turn||x.message.startsWith('Rifiutata')));if(next.turn===s.turn){await page.keyboard.press('Escape');continue;}
    const moves=next.resolution?.moves??[],own=moves.findIndex(m=>m.author===next.me),m=moves[own];log.rounds.push({game,turn:next.turn,move:c.name,facts:m});
    if(!charged&&m?.search?.found&&m.search.copy!==undefined){assert.ok(next.sequence.running);hitName=m.search.revealed.name;await capture('caricamento',own);charged=true;chargedThisGame=true;}
    else if(chargedThisGame&&m?.card===hitName){assert.ok(next.sequence.running);await capture('colpo',own);hit=true;}
    else if(next.sequence.running){await page.getByRole('button',{name:'Apri menu'}).click();await page.getByRole('button',{name:'Salta effetti'}).click();}
    sent=true;break;
   }
   if(!sent)throw Error('No playable move');
  }
 }
 assert.ok(charged&&hit,'charge followed by sought hit captured');assert.deepEqual(log.errors,[]);log.ok=true;
}
main().then(()=>finish(0),e=>{log.error=String(e.stack??e);finish(1);});

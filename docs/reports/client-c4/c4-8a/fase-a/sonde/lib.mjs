// C4-8a phase A probe harness (outside client-web/tools, declared in the proposal).
// Own temporary server (temp DB), Edge via Playwright, login + quick game helpers. Read-only on the product.
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,readFile,mkdir,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

export const REPO='C:/_simone/claude/bm-revamp-on-laptop';
const require=createRequire(`${REPO}/client-web/package.json`);
export const {chromium}=require('@playwright/test');
export const URL_=process.env.BM_CLIENT??'http://127.0.0.1:4320';
export const OUT=process.env.OUT??`${REPO}/docs/reports/client-c4/c4-8a/fase-a`;
export const accounts={A:{user:'devAlice',password:'local-alice'},B:{user:'devBob',password:'local-bob'}};
let server=null,dataDir=null;

export async function startServer(){
 const toolchain=JSON.parse(await readFile(join(REPO,'scripts/toolchain.json'),'utf8'));
 const java=join(REPO,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
 dataDir=await mkdtemp(join(tmpdir(),'bm-c48a-'));
 const log=createWriteStream(join(dataDir,'server.log'),{flags:'a'});
 server=spawn(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local','--app.dev.seed-accounts=true'],{cwd:join(REPO,'server'),env:{...process.env,BM_DATABASE_PATH:join(dataDir,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 const end=Date.now()+90000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited ${server.exitCode}`);
  try{const r=await fetch('http://127.0.0.1:8080/api/rest/v1/sign-in/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start');
}
export async function stopServer(){
 if(!server||server.exitCode!==null)return;
 const gone=new Promise(r=>server.once('exit',r));
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}
 await gone;server=null;
}
export async function launch(opts={}){
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const {width=1366,height=768,reducedMotion,touch=false,deviceScaleFactor=1}=opts;
 const context=await browser.newContext({viewport:{width,height},hasTouch:touch,reducedMotion:reducedMotion?'reduce':'no-preference',deviceScaleFactor});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 return {browser,context,page,errors};
}
export const state=page=>page.evaluate(()=>window.__bm?.state??null);
export async function wait(page,pred,ms=20000,what='condition'){const end=Date.now()+ms;while(Date.now()<end){const s=await state(page);if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`Timeout: ${what}`);}
export async function login(page,who='A'){
 const {user,password}=accounts[who];
 await page.goto(`${URL_}#/accedi`);
 await page.getByLabel('Nome').fill(user);await page.getByLabel('Password').fill(password);
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await page.waitForFunction(()=>document.querySelector('[data-testid=quick]')||window.__bm,null,{timeout:15000});
}
export async function startDuel(page){
 await page.getByTestId('quick').click();
 await wait(page,s=>s&&s.hits.some(h=>h.id.startsWith('person-')),30000,'table');
}
export async function startFfa(page,computers=4){
 await page.getByRole('radio',{name:'Tutti contro tutti'}).click();
 await page.getByTestId('quick').click();await page.getByTestId('ffa-list').waitFor({timeout:10000});
 for(let i=0;i<computers;i++){const before=await page.locator('[data-testid=ffa-list] li:not(.free)').count();await page.getByTestId('add-computer').click({timeout:20000}).catch(()=>{});if(before+1<5)await page.waitForFunction(n=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length>=n,before+1,{timeout:25000}).catch(()=>{});}
 await wait(page,s=>s&&s.hits.some(h=>h.id.startsWith('person-')),40000,'ffa table');
}
export async function shot(page,name,{clip}={}){await mkdir(OUT,{recursive:true});await page.screenshot({path:`${OUT}/${name}.jpg`,type:'jpeg',quality:55,...(clip?{clip}:{})});}
export async function saveJson(name,data){await mkdir(OUT,{recursive:true});await writeFile(`${OUT}/${name}.json`,JSON.stringify(data));}

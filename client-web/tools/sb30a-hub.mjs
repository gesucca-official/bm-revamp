// SB-30a B3: level-only hub checks, owner captures and quick join headers on the real client.
// Both levels are explicitly selected through their radios; each turn-zero game is then abandoned.
// Prerequisites: rebuilt jar, port 8080 free, production preview on 4320. BM_VIEWPORT / BM_OUT select the evidence.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const repo=resolve(import.meta.dirname,'../..'),url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const size=process.env.BM_VIEWPORT??'1366x768',[width,height]=size.split('x').map(Number);
const out=process.env.BM_OUT??join(tmpdir(),'bm-sb30a-hub');
await mkdir(out,{recursive:true});
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin/java.exe');
const data=await mkdtemp(join(tmpdir(),'bm-sb30a-hub-')),api='http://127.0.0.1:8080/api/rest/v1';
if(await fetch(`${api}/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error('port 8080 is in use');
const log=createWriteStream(join(data,'server.log'));
const server=spawn(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local','--app.dev.seed-accounts=true'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe'],windowsHide:true});
server.stdout.pipe(log);server.stderr.pipe(log);
let browser;
const evidence={size,database:data,checks:[],screens:[],joins:[],errors:[],ok:false};
try{
 const end=Date.now()+90000;
 while(!await fetch(`${api}/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false)){
  if(server.exitCode!==null||Date.now()>end)throw new Error(`server unavailable: ${data}`);
  await new Promise(r=>setTimeout(r,300));
 }
 browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width,height}});
 page.on('pageerror',e=>evidence.errors.push(String(e)));
 const joins=evidence.joins;
 const capture=payload=>{
  const raw=String(payload);let frames;
  try{frames=JSON.parse(raw);}catch{frames=[raw];}
  if(!Array.isArray(frames))return;
  for(const frame of frames){
   if(typeof frame!=='string'||!frame.startsWith('SEND\n'))continue;
   const headers=Object.fromEntries(frame.split('\n\n')[0].split('\n').slice(1).map(line=>{const i=line.indexOf(':');return [line.slice(0,i),line.slice(i+1)];}));
   if(headers.destination==='/app/game/quick/1vCom/join')joins.push(headers);
  }
 };
 page.on('websocket',ws=>ws.on('framesent',f=>capture(f.payload)));
 page.on('request',r=>{if(r.url().includes('xhr_send'))capture(r.postData()??'');});
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});
 const group=page.getByRole('radiogroup',{name:'Livello del computer'}),normal=page.getByTestId('level-NORMALE'),easy=page.getByTestId('level-FACILE');
 const check=async level=>{
  assert.equal(await group.count(),1);
  assert.deepEqual(await group.getByRole('radio').allTextContents(),['Facile','Normale']);
  assert.deepEqual(await group.getByRole('radio').evaluateAll(rs=>rs.map(r=>[r.getAttribute('aria-checked'),r.tabIndex])),level==='NORMALE'?[['false',-1],['true',0]]:[['true',0],['false',-1]]);
  assert.equal(await page.locator('#level-hint').innerText(),'Facile: casuale. Normale: segue il personaggio.');
 };
 const shot=async mode=>{
  await page.getByTestId('quick').scrollIntoViewIfNeeded();
  const file=`b3-hub-${mode}-${size}.jpg`;
  await page.screenshot({path:join(out,file),type:'jpeg',quality:80});evidence.screens.push(file);
 };
 await check('NORMALE');await shot('quick');evidence.checks.push('quick default NORMALE, two radios, single Tab stop');
 await normal.focus();await page.keyboard.press('ArrowLeft');await check('FACILE');assert.equal(await easy.evaluate(b=>b===document.activeElement),true);
 await page.keyboard.press('ArrowLeft');await check('NORMALE');
 await page.keyboard.press('Home');await check('FACILE');
 await page.keyboard.press('End');await check('NORMALE');
 await page.keyboard.press('Tab');assert.equal(await page.getByTestId('quick').evaluate(b=>b===document.activeElement),true);
 evidence.checks.push('arrows wrap, Home/End select, Tab leaves group');
 await easy.click();
 for(const mode of ['Uno contro uno','Tutti contro tutti']){
  await page.getByRole('radio',{name:mode,exact:true}).click();assert.equal(await group.count(),0);
 }
 evidence.checks.push('no level picker in 1v1 or FFA');
 await page.getByRole('radio',{name:'Con un tuo mazzo',exact:true}).click();await check('FACILE');
 assert.equal(await page.getByRole('radiogroup',{name:'Starter',exact:true}).count(),0);
 await shot('open');await normal.focus();await page.keyboard.press('ArrowRight');await check('FACILE');
 await page.keyboard.press('ArrowLeft');await check('NORMALE');
 await page.getByRole('radio',{name:'Contro il computer',exact:true}).click();await check('NORMALE');
 evidence.checks.push('open shares the level with quick and supports the keyboard');
 for(const level of ['NORMALE','FACILE']){
  await page.getByTestId(`level-${level}`).click();
  const mark=joins.length;await page.getByTestId('quick').click();
  await page.getByLabel('Apri menu').waitFor({timeout:15000});
  assert.equal(joins.length,mark+1);assert.equal(joins.at(-1).level,level);
  assert.equal(await group.count(),0,'no level picker at the table');
  await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();
  await page.getByRole('button',{name:'Sì, abbandona'}).click();await page.getByTestId('quick').waitFor({timeout:15000});
  await check(level);
  evidence.checks.push(`explicit ${level} radio sends one quick header; remembered after leaving`);
 }
 assert.deepEqual(evidence.errors,[]);evidence.ok=true;
}catch(e){evidence.failure=String(e.stack??e);console.error(e);process.exitCode=1;}
finally{
 await browser?.close();
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{}
 await writeFile(join(out,`b3-hub-${size}.json`),JSON.stringify(evidence));
 console.log(JSON.stringify(evidence));
}

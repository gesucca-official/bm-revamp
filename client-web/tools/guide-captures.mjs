// C4-10 Phase A: captures of the moments of a turn on the REAL table (duel = quick 1vCom, FFA = four computers), for the visual guidance proposal.
// Not a verification: no check fails. It records, per moment, a screenshot and where the elements that should draw the eye are
// (chosen card, admitted targets, preview with ✓/×, discard card, hint, short summary, round cards), with the distances the eye travels.
// BM_GUIDE=A|B|C sets localStorage 'bm.guide' before the page loads: only a build with a prototype patch reads it (the product does not).
// Prerequisites: port 8080 free (the script starts its own server on a temporary database), preview of the build on 4320, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??join(tmpdir(),'bm-c4-10-guide');
const guide=process.env.BM_GUIDE??'';
const sizes=(process.env.BM_SIZES??'1366x768,844x390').split(',');
const modes=(process.env.BM_MODES??'duel,ffa').split(',');
const turns=Number(process.env.BM_TURNS??3),toEnd=process.env.BM_TO_END==='1';
const reduced=process.env.BM_REDUCED==='1';
const tagG=guide?`-${guide}`:'-oggi';
await mkdir(out,{recursive:true});
const evidence={date:new Date().toISOString(),url,guide:guide||null,reduced,kind:'Edge via Playwright on PC against a local server on a temporary database; not a physical device',runs:[],errors:[]};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);

const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar='target/bm-server-0.0.1-SNAPSHOT.jar',api='http://127.0.0.1:8080';
const data=await mkdtemp(join(tmpdir(),'bm-guide-'));
if(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error('port 8080 is in use: stop the other server first');
const slog=createWriteStream(join(data,'server.log'),{flags:'a'});
const server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true','--server.port=8080'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
server.stdout.pipe(slog);server.stderr.pipe(slog);
const stop=()=>{try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{}};
process.on('exit',stop);
{const end=Date.now()+90000;let ok=false;while(Date.now()<end&&!ok){if(server.exitCode!==null)throw new Error(`server exited; log in ${data}`);
 try{ok=(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})})).ok;}catch{}if(!ok)await new Promise(r=>setTimeout(r,500));}
 if(!ok)throw new Error('server did not start');}
log('server up');

const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const C=b=>b?{x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.w),h:Math.round(b.h)}:null;
const dist=(a,b)=>a&&b?Math.round(Math.hypot(a.x-b.x,a.y-b.y)):null;
const catalog=JSON.parse(await readFile(join(repo,'docs/rules-catalog.json'),'utf8'));
const subtypeOf=new Map(catalog.cards.map(c=>[c.name.trim(),c.subtype]));

async function run(mode,size){
 const [vw,vh]=size.split('x').map(Number),tag=`${mode}-${size}${tagG}`,rec={mode,size,guide:guide||null,moments:[]};evidence.runs.push(rec);
 const context=await browser.newContext({viewport:{width:vw,height:vh},reducedMotion:reduced?'reduce':'no-preference'}),page=await context.newPage();
 page.on('pageerror',e=>evidence.errors.push(`${tag}: ${e}`));
 await context.addInitScript(g=>{try{if(g)localStorage.setItem('bm.guide',g);else localStorage.removeItem('bm.guide');}catch{}},guide);
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(s&&await pred(s))return s;await page.waitForTimeout(40);}throw new Error(`${tag}: timeout ${what}`);};
 const dom=()=>page.evaluate(()=>{const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return r.width&&r.height?{x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height}:null;};
  return {hint:box('.hint'),toast:box('.toast'),confirm:box('[data-testid=confirm]'),cancel:box('[aria-label="Annulla calata"]'),invitation:box('[data-testid=discard-invitation]'),outcome:box('.outcome'),top:box('.top-actions'),toastText:document.querySelector('.toast')?.textContent??null,hintText:document.querySelector('.hint')?.textContent??null};});
 let n=0;
 const shot=async(name,extra={})=>{const s=await state(),d=await dom(),file=`${tag}-${String(++n).padStart(2,'0')}-${name}.jpg`;
  await page.screenshot({path:join(out,file),type:'jpeg',quality:72});
  const sel=s?.hits.find(h=>h.id===s.selected&&h.kind==='hand'),prev=s?.hits.find(h=>h.kind==='preview'),disc=s?.hits.find(h=>h.id===s.discard),
   targets=(s?.arrows??[]).map(a=>a.to),played=s?.layout?.played?.box;
  rec.moments.push({name,file,turn:s?.turn,phase:s?.phase,sequence:s?.sequence?.running??false,
   boxes:{selected:C(sel),preview:C(prev),discard:C(disc),hint:C(d.hint),toast:C(d.toast),confirm:C(d.confirm),invitation:C(d.invitation),played:C(played),outcome:C(d.outcome)},
   arrows:(s?.arrows??[]).length,toastText:d.toastText,hintText:d.hintText,
   travel:{selectedToTargets:targets.map(t=>dist(sel,t)),discardToConfirm:dist(disc,d.confirm),previewToHint:dist(prev,d.hint),playedToToast:dist(played,d.toast)},...extra});
  log(tag,name);return s;};
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(70);
  if(await page.evaluate(()=>!!document.querySelector('dialog[open]'))){await page.keyboard.press('Escape');await page.waitForTimeout(60);}};
 const esc=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(80);};
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});
 if(mode==='ffa'){await page.getByRole('radio',{name:'Tutti contro tutti'}).click();await page.getByTestId('quick').click();await page.getByTestId('ffa-list').waitFor({timeout:10000});
  for(let i=0;i<4;i++){await page.getByTestId('add-computer').click();await page.waitForTimeout(400);}}
 else{await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('quick').click();}
 await wait(s=>s.hits.some(h=>h.kind==='hand'),30000,'table');
 await page.mouse.move(2,2);
 const maxTurns=toEnd?40:turns;
 for(let t=0;t<maxTurns;t++){
  const s0=await wait(s=>s.over||s.eliminated||(s.phase==='choose'&&!s.sequence.running&&s.hits.some(h=>h.kind==='hand')),60000,'turn');
  if(s0.over||s0.eliminated){await page.waitForTimeout(400);await shot('esito');break;}
  const capture=t<turns;
  await page.mouse.move(2,2);await page.waitForTimeout(150);
  if(capture)await shot('scelta');
  // Turn 2: prefer a bound card, to reach the discard step (O30). Otherwise regular cards first.
  const order=[...s0.order].sort((a,b)=>{const ab=subtypeOf.get(a.name)==='Legata al personaggio',bb=subtypeOf.get(b.name)==='Legata al personaggio';return t===1?(bb-ab):(ab-bb);});
  let sent=false;
  for(const card of order){
   const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   if(capture&&!rec.moments.some(m=>m.name==='mira'&&m.turn===s0.turn)){await page.mouse.move(2,2);await page.waitForTimeout(250);await shot('mira',{card:card.name});}
   const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.target?.owner===s0.me?1:0)-(b.target?.owner===s0.me?1:0)||(a.kind==='person'?0:1)-(b.kind==='person'?0:1));
   let aimed=false;
   for(const tg of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await state()).hits.find(h=>h.id===tg.id);if(!now)continue;await tap(now);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}
   await page.mouse.move(2,2);await page.waitForTimeout(250);
   let s=await state();
   if(s.message.includes('scartare')){
    if(capture)await shot('scarto-invito',{card:card.name});
    let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state()).discard){ok=true;break;}}
    if(!ok){await esc();continue;}
    await page.mouse.move(2,2);await page.waitForTimeout(200);
    if(capture)await shot('scarto-scelto',{card:card.name});
   }else if(capture)await shot('conferma',{card:card.name});
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   s=await state();
   await page.getByTestId('confirm').click();
   if(capture){await page.waitForTimeout(30);await shot('attesa');}
   const r=await wait(x=>x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
   sent=true;break;
  }
  if(!sent)throw new Error(`${tag}: no playable card at turn ${s0.turn}`);
  // The sequence: frames at fixed offsets from its start (or nothing, with reduced motion).
  const started=Date.now();let seen=false;
  while(Date.now()-started<4000){const s=await state();if(s.sequence.running){seen=true;break;}if(s.turn!==s0.turn&&!s.sequence.running&&reduced)break;await page.waitForTimeout(30);}
  if(seen&&capture){const t0=Date.now();for(const at of [350,1300,2600,4200,6500]){const left=at-(Date.now()-t0);if(left>0)await page.waitForTimeout(left);const s=await state();if(!s.sequence.running)break;await shot(`sequenza-${at}`);}}
  if(seen&&!capture){await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Salta effetti'}).click();}
  const after=await wait(x=>!x.sequence.running,30000,'sequence end');
  if(capture&&!after.over&&!after.eliminated){await page.waitForTimeout(250);await shot('dopo');}
 }
 if(toEnd){const s=await state();if(!s.over&&!s.eliminated)log(tag,'no outcome within',maxTurns);}
 // Leave the game, so that the next run starts from the hub.
 try{await esc();const s=await state();
  if(s?.over||s?.eliminated){if(await page.getByRole('button',{name:'Torna all’hub'}).count())await page.getByRole('button',{name:'Torna all’hub'}).first().click();}
  else{await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
  await page.getByTestId('quick').waitFor({timeout:15000});}catch(e){evidence.errors.push(`${tag}: leave ${e}`);}
 await context.close();
}
try{for(const size of sizes)for(const mode of modes){try{await run(mode,size);}catch(e){evidence.errors.push(String(e));log('ERROR',String(e));}}}
finally{await browser.close();await writeFile(join(out,`captures${tagG}${reduced?'-reduced':''}-${modes.join('+')}-${sizes.join('+')}.json`),JSON.stringify(evidence,null,1));stop();}
log('done',out,evidence.errors.length,'errors');

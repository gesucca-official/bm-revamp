// SB-31 F4: captures of the catalog with its filters, of the deck editor with the fixed deck bar and its summary (O15), and of the HEALTH cost of Duccio (D198 (15)),
// on the REAL client against a local server on a temporary database, at 1366x768 and 844x390. Not a verification of the client (VerifyDecks is): it gives the owner something to
// judge (the minimal option, before any full one) and it writes what it measured: touch targets of the new controls, the position of the bar, the faces shown by each filter.
// The HEALTH cost: a valid Duccio deck is built with the editor (character filter, then generic common actions), saved, and played in an open game against the computer until a
// card with a cost in HEALTH is in hand; the hand face (canvas) and the inspection are captured, and, if HEALTH ever falls below a card's cost, the «mancano» line too.
// It writes `f4-captures.json` and `f4-giudizio.html`. Prerequisites: port 8080 free (it starts its own server), preview of the build on 4320 (Serve), server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??join(tmpdir(),'bm-sb31-f4');
const sizes=(process.env.BM_SIZES??'1366x768,844x390').split(',');
const maxTurns=Number(process.env.BM_TURNS??16),maxTries=Number(process.env.BM_TRIES??14);
await mkdir(out,{recursive:true});
const annex=JSON.parse(await readFile(join(repo,'docs/rules-catalog.json'),'utf8'));
const DUC='base.character.Rocco',nameOf=Object.fromEntries([...annex.cards,...annex.characters].map(c=>[c.class,c.name.trim()]));
const evidence={date:new Date().toISOString(),url,kind:'Edge via Playwright on PC against a local server on a temporary database; not a physical device',runs:[],problems:[],errors:[],health:{}};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const bad=(scope,msg)=>{evidence.problems.push(`${scope}: ${msg}`);log('PROBLEM',scope,msg);};

const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar='target/bm-server-0.0.1-SNAPSHOT.jar',api='http://127.0.0.1:8080';
const data=await mkdtemp(join(tmpdir(),'bm-sb31f4-'));
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

async function run(size){
 const [vw,vh]=size.split('x').map(Number),tag=size,rec={size,captures:[],measures:{},health:null};evidence.runs.push(rec);
 const context=await browser.newContext({viewport:{width:vw,height:vh},reducedMotion:'reduce'}),page=await context.newPage();
 const stomp=[];page.on('pageerror',e=>evidence.errors.push(`${tag}: ${e}`));
 page.on('websocket',ws=>ws.on('framereceived',f=>{let s=String(f.payload);if(s.startsWith('a['))s=s.slice(1);else if(!s.startsWith('['))return;try{for(const raw of JSON.parse(s)){const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');
  if(lines[0]==='MESSAGE'){const h=Object.fromEntries(lines.slice(1).map(l=>l.split(/:(.*)/s).slice(0,2)));stomp.push({destination:h.destination,body:rest.join('\n\n').replace(/\0$/,'')});}}}catch{}}));
 const views=()=>stomp.filter(f=>/\/user\/queue\/game\/[^/]+\/view$/.test(f.destination)).map(f=>JSON.parse(f.body));
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(s&&await pred(s))return s;await page.waitForTimeout(40);}throw new Error(`${tag}: timeout ${what}`);};
 let n=0;const shot=async(name,note,opts={})=>{const file=`f4-${tag}-${String(++n).padStart(2,'0')}-${name}.jpg`;await page.screenshot({path:join(out,file),type:'jpeg',quality:72,...opts});rec.captures.push({file,name,note});log(tag,name);return file;};
 const pick=(id,v)=>page.getByTestId(id).selectOption(v);
 const press=name=>page.getByRole('button',{name,exact:true}).click();
 const slot=async title=>{const s=page.locator('details.slot',{has:page.locator('summary',{hasText:title})});if(!(await s.evaluate(d=>d.open)))await s.locator('summary').click();return s;};
 const targets=async(scope,sel)=>{const r=await page.locator(sel).evaluateAll(n=>n.filter(e=>e.offsetParent!==null).map(e=>{const b=e.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height),id:e.dataset.testid??e.textContent.slice(0,20)};}));
  for(const t of r)if(t.h<44||t.w<44)bad(`${tag}/${scope}`,`touch target ${t.id} is ${t.w}x${t.h}`);return r;};

 await page.goto(`${url}#/accedi`);await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});

 // --- Catalog: unfiltered, one character and a rarity, the protagonists. ---
 await page.getByTestId('tab-collection').click();await page.getByTestId('show-catalog').click();await page.getByTestId('catalog').waitFor();await page.waitForTimeout(400);
 await shot('catalogo','Catalogo senza filtri: la barra dei filtri sopra le carte, i personaggi in ordine di nome, la rarità su ogni faccia.');
 rec.measures.filterTargets=await targets('filtri','[data-testid=filter-bar] select, [data-testid=filter-bar] input, [data-testid=filter-bar] button');
 rec.measures.filterBar=await page.getByTestId('filter-bar').evaluate(e=>{const b=e.getBoundingClientRect();return {h:Math.round(b.height),w:Math.round(b.width)};});
 const mara=annex.characters.find(c=>c.name.startsWith('Mara')).class;
 await pick('filter-character',mara);await pick('filter-rarity','RARE');await page.waitForTimeout(300);
 await shot('catalogo-filtri','Catalogo con due filtri insieme: le carte rare di Mara (e la sua faccia): ne restano meno di ciascun filtro da solo.');
 await pick('filter-character','');await pick('filter-rarity','PROTAGONIST');await page.waitForTimeout(300);
 await shot('catalogo-P','Rarità «P»: solo i sette personaggi, nessuna carta.');
 await page.getByTestId('filter-reset').click();

 // --- Editor: the Duccio deck through the filters. ---
 await page.getByTestId('show-catalog').click();
 await page.getByTestId('new-deck').click();await page.getByTestId('deck-name').fill('Duccio');
 await (await slot('Personaggio')).getByRole('button',{name:`Personaggio ${nameOf[DUC]}`,exact:true}).click();
 await (await slot('Ultima risorsa')).getByRole('button',{name:`Ultima risorsa ${nameOf['com.last.Struggle']}`,exact:true}).click();
 const bounds=annex.cards.filter(c=>c.subtype==='Legata al personaggio'&&c.character===DUC).map(c=>c.class);
 for(const b of [bounds[0],bounds[2]])await (await slot('Azioni legate')).getByRole('button',{name:`Azione legata ${nameOf[b]}`,exact:true}).click();
 await slot('Mazzo regolare');
 const bindings=()=>page.locator('[data-testid=regular-pool] [data-testid=card-face]').evaluateAll(n=>n.map(e=>e.dataset.binding));
 await pick('filter-character',DUC);await pick('filter-type','action');
 const own=await bindings();
 await page.getByTestId('filter-bar').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
 await shot('editor-filtri','Editor: filtri per personaggio e tipo sopra «Mazzo regolare»; la barra del mazzo resta in vista.');
 rec.measures.deckBar=await page.getByTestId('deck-bar').evaluate(e=>{const b=e.getBoundingClientRect(),s=document.querySelector('.sheet').getBoundingClientRect();return {top:Math.round(b.top),bottom:Math.round(b.bottom),h:Math.round(b.height),sheetTop:Math.round(s.top),sheetBottom:Math.round(s.bottom),viewport:innerHeight,text:e.dataset.text};});
 rec.measures.barTarget=await targets('barra','[data-testid=deck-bar-open]');
 for(const b of own)for(let i=0;i<2;i++)await press(`Aggiungi una copia di ${nameOf[b]}`);
 await pick('filter-character','generic');await pick('filter-rarity','COMMON');
 const generic=await bindings();let left=20-own.length*2;
 for(const b of generic){for(let i=0;i<2&&left>0;i++,left--)await press(`Aggiungi una copia di ${nameOf[b]}`);}
 await page.getByTestId('deck-bar-open').click();await page.getByTestId('deck-summary').waitFor();await page.waitForTimeout(200);
 await shot('editor-riepilogo','Riepilogo O15 aperto dalla barra: personaggio, base, ultima risorsa, legate e le carte regolari con copie, «Regolari n / 20».');
 rec.measures.summary=await page.getByTestId('deck-summary').evaluate(e=>{const b=e.getBoundingClientRect();return {top:Math.round(b.top),bottom:Math.round(b.bottom),h:Math.round(b.height),viewport:innerHeight,text:e.innerText.replace(/\s+/g,' ').slice(0,400)};});
 await page.keyboard.press('Escape');
 await pick('filter-character','');await pick('filter-rarity','');await pick('filter-type','');
 const text=await page.getByTestId('deck-bar').getAttribute('data-text');if(text!=='Regolari 20 / 20 · legate 2 / 2 · ultima risorsa ✓')bad(tag,`deck bar says «${text}»`);
 await page.getByTestId('save-deck').click();await page.getByTestId('deck-notice').waitFor({timeout:10000});

 // --- A live open game with Duccio: a card with a cost in HEALTH. ---
 const healthCards=new Set(annex.cards.filter(c=>c.character===DUC).map(c=>c.class));
 const costOf=new Map();
 let found=null,attempts=0;
 const startGame=async()=>{await page.getByTestId('tab-play').click();await page.getByRole('radio',{name:'Con un tuo mazzo'}).click();await page.getByTestId('quick').click();await page.getByTestId('deck-dialog').waitFor();
  await page.getByRole('radio',{name:/^Duccio /}).click();await page.getByTestId('start-open').click();await wait(s=>s.phase==='choose'&&s.hits.some(h=>h.kind==='hand'),40000,'Duccio table');};
 const abandon=async()=>{const e=await state();if(e&&(e.over||e.eliminated)){await page.getByRole('button',{name:'Torna all’hub'}).click();}else{await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
  await page.getByTestId('quick').waitFor({timeout:15000});};
 const hand=()=>{const v=views().at(-1)?.players?.devAlice;return v?{cards:v.cardsInHand,health:v.character.resources.HEALTH}:null;};
 while(!found&&attempts<maxTries){attempts++;await startGame();await page.waitForTimeout(500);const h=hand();
  const card=h?.cards.find(c=>c.cost?.HEALTH);if(card)found={card,health:h.health};else await abandon();}
 const hrec=rec.health={attempts,found:!!found};
 if(!found){bad(tag,`no card with a cost in HEALTH in ${attempts} first hands`);}
 else{
  const esc=()=>page.keyboard.press('Escape');
  const key=async name=>(await state()).order.find(c=>c.name.trim()===name.trim())?.key;
  const inspect=async name=>{await esc();const k=await key(name);if(!k)return null;await page.locator(`[data-hit="${k}"]`).focus();await page.keyboard.press('i');
   try{await page.locator('dialog[open] .inspection').waitFor({timeout:4000});}catch{return null;}
   const read=await page.evaluate(()=>{const q=s=>document.querySelector(`dialog[open] ${s}`);return {cost:[...document.querySelectorAll('dialog[open] dl dt')].find(d=>d.textContent==='Costo')?.nextElementSibling?.textContent??null,short:q('p.short')?.textContent??null};});return read;};
  const faceOf=async name=>{const k=await key(name);const h=(await state()).hits.find(x=>x.id===k);return h;};
  const record=async(c,when)=>{const hit=await faceOf(c.name);const clip=hit?{x:Math.max(0,hit.x-hit.w/2-8),y:Math.max(0,hit.y-hit.h/2-8),width:Math.min(vw,hit.w+16),height:Math.min(vh,hit.h+16)}:null;
   await esc();await page.waitForTimeout(200);const f1=await shot(`mano-${when}`,`La mano: «${c.name}» costa ${c.cost.HEALTH} SALUTE (HEALTH ${hand().health}); il costo è disegnato sulla faccia.`);
   const f1b=clip?await shot(`mano-${when}-faccia`,`Particolare della faccia di «${c.name}».`,{clip}):null;
   const r=await inspect(c.name);if(r){await shot(`ispezione-${when}`,`Ispezione di «${c.name}»: riga Costo «${r.cost}»${r.short?`; «${r.short}»`:''}.`);}
   await esc();return {card:c.name,cost:c.cost,health:hand().health,inspection:r,shots:[f1,f1b]};};
  hrec.first=await record(found.card,'costo');
  if(!hrec.first.inspection||!/SALUTE|Salute|salute/.test(hrec.first.inspection.cost??''))bad(tag,`inspection cost row: ${JSON.stringify(hrec.first.inspection)}`);
  // Play on until HEALTH falls below the cost of a card in hand, to see «mancano»; the game stops at its end or after maxTurns.
  let seen=null,turns=0;const playOne=async()=>{const s0=await state(),cost=new Map((hand()?.cards??[]).map(c=>[c.name.trim(),c.cost?.HEALTH??0]));
   // The cards with a cost in HEALTH first, the dearest first: they are what lowers HEALTH, and the line «mancano» needs HEALTH below a cost.
   for(const c of [...s0.order].sort((x,y)=>(cost.get(y.name.trim())??0)-(cost.get(x.name.trim())??0))){const own=(await state()).hits.find(h=>h.id===c.key);if(!own)continue;
    const tapAt=async h=>{const p=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(p.x,p.y);await page.waitForTimeout(60);if(await page.evaluate(()=>!!document.querySelector('dialog[open]'))){await esc();await page.waitForTimeout(60);}};
    await tapAt(own);if((await state()).selected!==c.key)continue;let aimed=false;
    for(const t of (await state()).hits.filter(h=>h.kind==='person'||h.kind==='item')){if((await state()).selected!==c.key){const o=(await state()).hits.find(x=>x.id===c.key);if(o)await tapAt(o);}await tapAt(t);if((await state()).target){aimed=true;break;}}
    if(!aimed){await esc();continue;}
    let s=await state();if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==c.key)){await tapAt(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
    if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
    const sent=()=>0;await page.getByTestId('confirm').click();
    for(let i=0;i<25;i++){const d=page.getByRole('button',{name:'Sì, scarta e gioca'}),o=page.getByTestId('search-option');if(await d.count())await d.first().click();else if(await o.count())await o.first().click();else await page.waitForTimeout(100);}
    return c.name;}
   return null;};
  while(turns<maxTurns){const s=await wait(x=>x.over||x.eliminated||(x.phase==='choose'&&!x.sequence?.running&&x.hits.some(h=>h.kind==='hand')),90000,'next turn');if(s.over||s.eliminated)break;
   const h=hand();const short=h?.cards.find(c=>c.cost?.HEALTH&&c.cost.HEALTH>h.health);
   if(short){seen=await record(short,'mancano');break;}
   const played=await playOne();turns++;if(!played)break;
   await wait(x=>x.over||x.eliminated||x.turn!==s.turn,90000,'turn resolved');}
  hrec.turns=turns;hrec.shortfall=seen;
  if(!seen)log(tag,`HEALTH never fell below the cost of a card in hand in ${turns} turns`);
  else if(!/mancano.*salute/.test(seen.inspection?.short??''))bad(tag,`shortfall line: ${JSON.stringify(seen.inspection)}`);
  await esc();await abandon();}
 await context.close();
}
try{for(const size of sizes)await run(size);}catch(e){evidence.failure=String(e?.stack??e);console.error(e);}
finally{await writeFile(join(out,'f4-captures.json'),JSON.stringify(evidence,null,1));await browser.close().catch(()=>{});stop();}
if(evidence.failure||evidence.errors.length)process.exitCode=1;
else log('done; problems:',evidence.problems.length);

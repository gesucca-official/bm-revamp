// SB-30a: explicitly choose FACILE through the hub radio: preserve the former random opponent, short games and existing checks. FFA stays server-selected NORMALE.
// SB-31 F3: captures of the inspection (flavour, full text, keyword reminders, rarity) and of the status list on the REAL table, a quick game against the computer
// on a temporary database, at 1366x768 and 844x390; and which of the fields the client calls «playground only» a live game really carries (item 7 of the prompt).
// Not a verification of the table: what it checks is what the phase promises for the inspection (button >= 44 px, one swap and back, a line per keyword the card uses,
// rarity ticks on the card and «P» on the character, no placeholder left as text). It writes the screenshots, `f3-captures.json` and `f3-giudizio.html` (the page for the owner).
// Prerequisites: port 8080 free (it starts its own server), preview of the build on 4320 (Serve), server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve as resolvePath} from 'node:path';
import {keywordsOf,rarityOf,setAnnex} from '../src/annex.ts';

const repo=resolvePath(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??join(tmpdir(),'bm-sb31-f3');
const sizes=(process.env.BM_SIZES??'1366x768,844x390').split(',');
const categories=(process.env.BM_CATEGORIES??'base,avanzato').split(',');
const maxTurns=Number(process.env.BM_TURNS??14);
await mkdir(out,{recursive:true});
const annex=JSON.parse(await readFile(join(repo,'docs/rules-catalog.json'),'utf8'));setAnnex(annex);
const byName=new Map(annex.cards.map(c=>[c.name.trim(),c]));
const evidence={date:new Date().toISOString(),url,kind:'Edge via Playwright on PC against a local server on a temporary database; not a physical device',runs:[],problems:[],errors:[],fields:{moves:{},players:{}}};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const bad=(scope,msg)=>{evidence.problems.push(`${scope}: ${msg}`);log('PROBLEM',scope,msg);};

const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar='target/bm-server-0.0.1-SNAPSHOT.jar',api='http://127.0.0.1:8080';
const data=await mkdtemp(join(tmpdir(),'bm-sb31-'));
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

async function run(size,category){
 const [vw,vh]=size.split('x').map(Number),tag=`${size}-${category}`,rec={size,category,inspected:[],captures:[],statusList:null,turns:0};evidence.runs.push(rec);
 const context=await browser.newContext({viewport:{width:vw,height:vh},reducedMotion:'reduce'}),page=await context.newPage();
 page.on('pageerror',e=>evidence.errors.push(`${tag}: ${e}`));
 const state=()=>page.evaluate(()=>window.__bm?.state??null);
 const wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(s&&await pred(s))return s;await page.waitForTimeout(40);}throw new Error(`${tag}: timeout ${what}`);};
 let n=0;const capture=async(name,note,locator)=>{const file=`f3-${tag}-${String(++n).padStart(2,'0')}-${name}.jpg`;
  await (locator??page).screenshot({path:join(out,file),type:'jpeg',quality:74});rec.captures.push({file,name,note});log(tag,name);
  // The inspection scrolls inside its dialog: when the content is taller than the dialog, a second shot scrolled to the bottom (flavour, button, reminders).
  const scrolled=await page.evaluate(()=>{const d=document.querySelector('dialog[open]');if(!d)return false;
   const sc=[d,...d.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+6&&['auto','scroll'].includes(getComputedStyle(e).overflowY));if(!sc)return false;sc.scrollTop=sc.scrollHeight;return true;});
  if(scrolled){await page.waitForTimeout(80);const f2=file.replace(/\.jpg$/,'-sotto.jpg');await (locator??page).screenshot({path:join(out,f2),type:'jpeg',quality:74});rec.captures.push({file:f2,name:`${name}-sotto`,note:`${note} (in fondo alla finestra)`});
   await page.evaluate(()=>{const d=document.querySelector('dialog[open]');for(const e of [d,...d.querySelectorAll('*')])if(e.scrollTop)e.scrollTop=0;});}
  return file;};
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(70);
  if(await page.evaluate(()=>!!document.querySelector('dialog[open]'))){await page.keyboard.press('Escape');await page.waitForTimeout(60);}};
 const esc=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(80);};
 const dialog=()=>page.locator('dialog[open]');
 // What a real view carries of the fields the client documents as «playground only»: read from the facts of every resolution and from the own view.
 const fields=async()=>{const r=await page.evaluate(()=>{const b=window.__bm;if(!b)return null;const moves=(b.resolutions??[]).flatMap(x=>x.facts?.moves??[]);
  const keys={};for(const m of moves)for(const k of ['voidReason','search','ahead','plays'])if(m[k]!==undefined)keys[k]=(keys[k]??0)+1;
  return {moves:keys,revealed:b.state.hits.filter(h=>h.kind==='revealed').length};});
  if(r){for(const [k,v] of Object.entries(r.moves))evidence.fields.moves[k]=Math.max(evidence.fields.moves[k]??0,v);evidence.fields.players.revealedMax=Math.max(evidence.fields.players.revealedMax??0,r.revealed);}};

 // The inspection of a card of the hand, from the keyboard (focus the card, press I).
 async function inspectCard(card,{shots=false}={}){
  await esc();await page.locator(`[data-hit="${card.key}"]`).focus();await page.keyboard.press('i');
  try{await page.locator('dialog[open] .inspection').waitFor({timeout:4000});}catch{await page.mouse.move(2,2);await esc();return null;}
  const entry=byName.get(card.name.trim()),want=keywordsOf(entry?.description??'').map(k=>k.id),scope=`${tag}/${card.name}`;
  const read=()=>page.evaluate(()=>{const q=s=>document.querySelector(`dialog[open] ${s}`),box=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)};};
   const toggle=q('[data-testid=full-text-toggle]');
   return {flavour:q('[data-testid=flavour]')?.textContent??null,shortText:q('p.full-text:not(.full)')?.textContent??null,full:[...document.querySelectorAll('dialog[open] [data-testid=full-text] p')].map(p=>p.textContent),
    toggle:toggle?{text:toggle.textContent,pressed:toggle.getAttribute('aria-pressed'),...box(toggle)}:null,
    keywords:[...document.querySelectorAll('dialog[open] [data-testid=keywords] li')].map(li=>({id:li.getAttribute('data-keyword'),text:li.textContent})),
    rarity:q('[data-testid=rarity]')?{ticks:Number(q('[data-testid=rarity]').getAttribute('data-ticks')),label:q('[data-testid=rarity]').getAttribute('aria-label'),mark:q('[data-testid=rarity] b')?.textContent??null}:null,
    placeholders:/\[\[/.test(document.querySelector('dialog[open] .receipt')?.textContent??'')};});
  const first=await read(),row={name:card.name,class:entry?.class??null,...first};rec.inspected.push(row);
  if(!entry)bad(scope,'the card has no entry in the annex');
  else{
   if(first.flavour!==(entry.flavour??null))bad(scope,`flavour ${JSON.stringify(first.flavour)} is not the annex's`);
   if(!first.toggle)bad(scope,'no «Testo completo» button');
   else{if(first.toggle.h<44||first.toggle.w<44)bad(scope,`button ${first.toggle.w}×${first.toggle.h} under 44 px`);if(first.toggle.text!=='Testo completo')bad(scope,`button says ${first.toggle.text}`);}
   if(JSON.stringify(first.keywords.map(k=>k.id))!==JSON.stringify(want))bad(scope,`keyword lines ${first.keywords.map(k=>k.id)} instead of ${want}`);
   const r=rarityOf(entry.rarity);if(r&&(first.rarity?.ticks!==r.ticks||first.rarity?.mark!==(r.mark||null)))bad(scope,`rarity ${JSON.stringify(first.rarity)} instead of ${entry.rarity}`);
   if(first.placeholders)bad(scope,'a [[…]] placeholder is left as text in the inspection');
   if(shots)await capture(`${card.name.replace(/[^a-z0-9]+/gi,'_').slice(0,24)}-breve`,`${card.name}: testo breve, flavour in corsivo, ${want.length} promemoria, rarità ${entry.rarity}`,dialog());
   if(first.toggle){await page.getByTestId('full-text-toggle').click();await page.waitForTimeout(120);const second=await read();
    if(second.shortText!==null||second.flavour!==null||!second.full.length)bad(scope,'the swap did not replace short text and flavour by the full text');
    if(JSON.stringify(second.full)!==JSON.stringify(entry.fullText.map(t=>t.replace(/\[\[(?:H|A|V|T|L|HIT|CUT|POISON)\]\]/g,m=>m)))&&second.full.length!==entry.fullText.length)bad(scope,'the paragraphs of the full text are not the annex\'s');
    if(second.toggle?.text!=='Testo breve'||second.toggle?.pressed!=='true')bad(scope,'the button does not say it is on');
    if(second.keywords.length!==first.keywords.length)bad(scope,'the keyword lines changed with the swap');
    if(second.placeholders)bad(scope,'a placeholder is left as text in the full text');
    row.fullChars=second.full.join(' ').length;
    if(shots)await capture(`${card.name.replace(/[^a-z0-9]+/gi,'_').slice(0,24)}-completo`,`${card.name}: testo completo (un secondo tocco torna indietro)`,dialog());
    await page.getByTestId('full-text-toggle').click();await page.waitForTimeout(120);const third=await read();
    if(third.shortText===null||third.flavour!==first.flavour)bad(scope,'a second tap did not bring back short text and flavour');}
  }
  await page.mouse.move(2,2);await esc();return row;
 }

 await context.addInitScript(()=>{try{localStorage.removeItem('bm.guide');}catch{}});
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor({timeout:15000});
 await page.getByRole('radio',{name:'Contro il computer'}).click();await page.getByTestId('level-FACILE').click();
 await page.getByTestId(`category-${category}`).click();await page.getByTestId('quick').click();
 await wait(s=>s.hits.some(h=>h.kind==='hand'),30000,'table');await page.mouse.move(2,2);
 const seen=new Set();let statusDone=false,shotsLeft=3;
 for(let t=0;t<maxTurns;t++){
  const s0=await wait(s=>s.over||s.eliminated||(s.phase==='choose'&&!s.sequence.running&&s.hits.some(h=>h.kind==='hand')),60000,'turn');
  if(s0.over||s0.eliminated)break;rec.turns=t+1;
  // Every card of the hand not yet seen; screenshots for the ones with the most keywords (up to three per run).
  const fresh=s0.cards.filter(c=>!seen.has(c.name)).map(c=>({...c,kw:keywordsOf(byName.get(c.name.trim())?.description??'').length})).sort((a,b)=>b.kw-a.kw);
  for(const c of fresh){seen.add(c.name);const withShots=shotsLeft>0&&(c.kw>0||rec.inspected.length===0);if(withShots)shotsLeft--;await inspectCard(c,{shots:withShots});}
  await fields();
  // The status list: the first moment a character of the table has a status chip.
  if(!statusDone){const st=s0.hits.filter(h=>h.kind==='status');
   if(st.length){const owner=st[0].target.owner,person=s0.hits.find(h=>h.kind==='person'&&h.target.owner===owner);
    if(person){await page.mouse.move(2,2);await page.mouse.click(person.x,person.y-person.h*.25);
     try{await page.locator('dialog[open] .receipt').waitFor({timeout:4000});
      const info=await page.evaluate(()=>{const groups=[...document.querySelectorAll('dialog[open] [data-testid=inspect-chip]')].map(g=>({title:g.querySelector('b')?.textContent,count:Number(g.getAttribute('data-count')),texts:[...g.querySelectorAll('.status-text')].map(x=>x.textContent)})),
        rarity=document.querySelector('dialog[open] [data-testid=rarity]'),text=document.querySelector('dialog[open] .receipt')?.textContent??'';
       return {groups,rarity:rarity?{ticks:rarity.getAttribute('data-ticks'),mark:rarity.querySelector('b')?.textContent??null,label:rarity.getAttribute('aria-label')}:null,placeholders:/\[\[/.test(text),symbols:document.querySelectorAll('dialog[open] .status-text svg').length};});
      rec.statusList={owner,...info};
      if(info.placeholders)bad(tag,'a placeholder is left as text in the status list');
      if(info.rarity?.mark!=='P')bad(tag,`the character inspection shows ${JSON.stringify(info.rarity)}, not «P»`);
      await page.locator('dialog[open] .receipt h3').scrollIntoViewIfNeeded().catch(()=>{});
      await capture('stati',`Ispezione del personaggio con la lista degli stati (${info.groups.map(g=>g.title).join('; ')})`,dialog());
      statusDone=true;
     }catch(e){evidence.errors.push(`${tag}: status list ${e}`);}
     await page.mouse.move(2,2);await esc();}}}
  // Play a card (the first that goes): the server judges.
  let sent=false;
  for(const card of [...s0.order].sort((a,b)=>Number(!!byName.get(a.name.trim())?.subtype?.startsWith('Legata'))-Number(!!byName.get(b.name.trim())?.subtype?.startsWith('Legata')))){
   const own=(await state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state()).selected!==card.key)continue;
   const targets=(await state()).hits.filter(h=>h.kind==='item'||h.kind==='person').sort((a,b)=>(a.target?.owner===s0.me?1:0)-(b.target?.owner===s0.me?1:0)||(a.kind==='person'?0:1)-(b.kind==='person'?0:1));
   let aimed=false;
   for(const tg of targets){if((await state()).selected!==card.key){const o=(await state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}const now=(await state()).hits.find(h=>h.id===tg.id);if(!now)continue;await tap(now);if((await state()).target){aimed=true;break;}}
   if(!aimed){await esc();continue;}
   await page.mouse.move(2,2);await page.waitForTimeout(200);
   let s=await state();
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
   s=await state();const before=await page.evaluate(()=>window.__bm.state.commands);
   await page.getByTestId('confirm').click();
   // The dialogs after ✓ («Scartare l'ultima copia?», «Quale carta cerchi?»): answered like VerifyModes does (R8).
   for(const end=Date.now()+5000;Date.now()<end&&(await state()).commands===before;){const d=page.getByRole('button',{name:'Sì, scarta e gioca'}),o=page.getByTestId('search-option');
    if(await d.count())await d.first().click({timeout:3000});else if(await o.count())await o.first().click({timeout:3000});else{await page.waitForTimeout(100);continue;}await page.waitForTimeout(100);}
   const r=await wait(x=>x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
   if(r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
   sent=true;break;
  }
  if(!sent)throw new Error(`${tag}: no playable card at turn ${s0.turn}`);
  await page.getByLabel('Apri menu').click({timeout:1500}).then(async()=>{await page.getByRole('button',{name:'Salta effetti'}).click();}).catch(()=>{});
  await wait(x=>!x.sequence.running,30000,'sequence end');
  await fields();
 }
 // The grouping, if the game never gave two statuses of the same name: say so; the unit test holds it, and the page simulates the look with copies of the DOM of a real group.
 if(rec.statusList&&!rec.statusList.groups.some(g=>g.count>1)){
  const st=(await state()).hits.filter(h=>h.kind==='status');
  if(st.length){const person=(await state()).hits.find(h=>h.kind==='person'&&h.target.owner===st[0].target.owner);
   if(person){await page.mouse.click(person.x,person.y-person.h*.25);
    try{await page.locator('dialog[open] .receipt').waitFor({timeout:4000});
     await page.evaluate(()=>{const g=document.querySelector('dialog[open] [data-testid=inspect-chip]');if(!g)return;const box=g.querySelector('.status-texts');
      const t=box.querySelector('.status-text');for(let i=0;i<2;i++){const c=t.cloneNode(true);box.appendChild(c);}
      const b=g.querySelector('b');if(!g.querySelector('.count'))b.insertAdjacentHTML('afterend','<span class="count"> ×3</span>');});
     await page.locator('dialog[open] .receipt h3').scrollIntoViewIfNeeded().catch(()=>{});
     await capture('stati-raggruppati-simulato','SIMULATA: le descrizioni del primo stato copiate due volte nel DOM, per mostrare come si dispone un gruppo di tre stati con lo stesso nome (nel gioco vivo non ne sono comparsi)',dialog());
    }catch(e){evidence.errors.push(`${tag}: simulated group ${e}`);}
    await page.mouse.move(2,2);await esc();}}}
 try{await esc();const s=await state();
  if(s?.over||s?.eliminated){if(await page.getByRole('button',{name:'Torna all’hub'}).count())await page.getByRole('button',{name:'Torna all’hub'}).first().click();}
  else{await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
  await page.getByTestId('quick').waitFor({timeout:15000});}catch(e){evidence.errors.push(`${tag}: leave ${e}`);}
 await context.close();
}
try{for(const size of sizes)for(const category of categories){try{await run(size,category);}catch(e){evidence.errors.push(String(e));log('ERROR',String(e));}}}
finally{
 await browser.close();stop();
 // The page for the owner: the sentences of the keyword reminders (the ones to approve), the rarity marks and every capture.
 const esc2=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const ids=['announce','vulnerable','ahead','rises','inplay','sell','immune'],sample={announce:'SGOMBERIAMOVI',vulnerable:'SGOMBERIAMOVI',ahead:'Sgommata',rises:'Ultimo Giro',inplay:'Sigaretta Accesa',sell:'Fiuto per gli Affari',immune:'Santino di San Briaco'};
 const lines=ids.map(id=>{const k=keywordsOf(byName.get(sample[id]).description).find(x=>x.id===id);return `<tr><td><b>${esc2(k.label)}</b></td><td>${esc2(k.sentence)} <i>(${esc2(k.reference)})</i></td></tr>`;}).join('');
 const rarity=['COMMON','UNCOMMON','RARE','PROTAGONIST'].map(r=>{const x=rarityOf(r);return `<tr><td>${r}</td><td>${x.mark?`«${x.mark}»`:'●'.repeat(x.ticks)}</td><td>${esc2(x.label)}</td></tr>`;}).join('');
 const shots=evidence.runs.flatMap(r=>r.captures.map(c=>`<figure><img src="${esc2(c.file)}" alt="${esc2(c.name)}"><figcaption><b>${esc2(r.size)} · ${esc2(r.category)}</b> — ${esc2(c.note)}</figcaption></figure>`)).join('\n');
 await writeFile(join(out,'f3-giudizio.html'),`<!doctype html><html lang="it"><meta charset="utf-8"><title>SB-31 F3 — giudizio</title><style>body{font:16px/1.5 system-ui;max-width:1100px;margin:24px auto;padding:0 16px}table{border-collapse:collapse}td{border:1px solid #bbb;padding:6px 10px;vertical-align:top}figure{margin:18px 0}img{max-width:100%;border:1px solid #888}figcaption{font-size:14px}</style>
<h1>SB-31 F3 — testi del set vivo nel client</h1><p>Da approvare: le frasi dei promemoria delle parole chiave (una per parola, con il rimando «regolamento, R07b») e le tacche di rarità. Le catture sono dell'ispezione (i) su partite vere, a 1366×768 e 844×390.</p>
<h2>Promemoria delle parole chiave</h2><p>Nel client i segnaposto sono i simboli: [[HIT]] colpo, [[CUT]] taglio, [[POISON]] veleno (si vedono nelle catture sotto).</p><table>${lines}</table>
<h2>Rarità (solo nell'ispezione)</h2><table>${rarity}</table>
<h2>Catture</h2>${shots}</html>`);
 await writeFile(join(out,'f3-captures.json'),JSON.stringify(evidence,null,1));
 log('done',out,`${evidence.problems.length} problems, ${evidence.errors.length} errors`);
}

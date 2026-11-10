// C2b-4 end-to-end check against the REAL server: catalog, deck editor, save/overwrite/delete and open 1vCom
// with devAlice. Like VerifyFfa it starts the server itself on a temporary database (the local data is never
// touched) and stops it at the end. The open game is played through the UI until the outcome.
// "Deck unavailable" cannot be reached from the UI with one account (the dialog lists only saved decks): it is
// provoked by rewriting the deckId of the outgoing join frame (Playwright routeWebSocket), and declared as such.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {checkTouchControls,requireTouchControls} from './controls-checks.mjs';
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';

const repo=resolve(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c2/c2b-4';
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright) against the local server started by this script on a temporary database; not a physical device',checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,600));};

// --- Server on a temporary database (same command as scripts/dev.ps1 -Task Server -SeedAccounts) ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
// C4-1c: BM_SERVER_PORT runs the temporary server on another port (with a preview on BM_PORT proxying to it via BM_SERVER); unset, 8080 as before.
const serverPort=process.env.BM_SERVER_PORT??'8080',portArg=process.env.BM_SERVER_PORT?[`--server.port=${serverPort}`]:[];
const data=await mkdtemp(join(tmpdir(),'bm-decks-'));
let server=null;
async function startServer(){
 const log=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true',...portArg],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 const end=Date.now()+90000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited (${server.exitCode}); log in ${data}`);
  try{const r=await fetch(`http://127.0.0.1:${serverPort}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start in 90 s');
}
async function stopServer(){
 if(!server||server.exitCode!==null)return;
 const gone=new Promise(r=>server.once('exit',r));
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}
 await gone;server=null;
}
if(await fetch(`http://127.0.0.1:${serverPort}/api/rest/v1/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error(`port ${serverPort} is in use: stop the other server first`);

// --- Browser ---
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const stompFrames=payload=>{let s=String(payload);if(s.startsWith('a['))s=s.slice(1);else if(!s.startsWith('['))return[];try{return JSON.parse(s).map(raw=>{const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');return{at:Date.now(),command:lines[0],headers:Object.fromEntries(lines.slice(1).map(l=>[l.slice(0,l.indexOf(':')),l.slice(l.indexOf(':')+1)])),body:rest.join('\n\n').replace(/\u0000$/,'')};});}catch{return[];}};
// Rewrites the deckId of the next open join only while `rewrite` is set (Deck unavailable scenario).
const route={rewrite:null,rewritten:[]};
const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();
await page.routeWebSocket(/\/ws\//,ws=>{
 const srv=ws.connectToServer();
 ws.onMessage(m=>{let s=String(m);if(route.rewrite&&s.includes('/app/game/open/1vCom/join/')){const [from,to]=route.rewrite;s=s.replace(`/app/game/open/1vCom/join/devAlice/${from}`,`/app/game/open/1vCom/join/devAlice/${to}`);route.rewritten.push(s);route.rewrite=null;}srv.send(s);});
 srv.onMessage(m=>ws.send(m));
});
const A={name:'A',user:'devAlice',password:'local-alice',page,sent:[],received:[]};
page.on('pageerror',e=>evidence.errors.push(`A: ${e}`));
evidence.console=[];page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')evidence.console.push(`${m.type()}: ${m.text()}`.slice(0,300));});
page.on('websocket',ws=>{ws.on('framesent',f=>A.sent.push(...stompFrames(f.payload)));ws.on('framereceived',f=>A.received.push(...stompFrames(f.payload)));});
A.state=()=>page.evaluate(()=>window.__bm?.state??null);
A.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await A.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`A: timeout ${what}`);};
A.shot=async n=>{const c=await checkTouchControls(page,n);if(c)(evidence.touchControls??=[]).push(c);requireTouchControls(c);return page.screenshot({path:`${out}/screens/decks-${n}${tag}.jpg`,type:'jpeg',quality:70});};
A.sends=(from=0)=>A.sent.slice(from).filter(f=>f.command==='SEND');
A.messages=dest=>A.received.filter(f=>f.command==='MESSAGE'&&(typeof dest==='string'?f.headers.destination===dest:dest.test(f.headers.destination)));
A.account=()=>JSON.parse(A.messages('/user/queue/account/data').at(-1).body);
A.views=game=>A.messages(/\/user\/queue\/game\/[^/]+\/view$/).map(f=>JSON.parse(f.body)).filter(v=>!game||v.gameId===game);
const text=async sel=>(await page.locator(sel).first().innerText()).replace(/\s+/g,' ').trim();
const dialogOpen=()=>page.evaluate(()=>!!document.querySelector('dialog[open]'));

// --- Editor helpers (through the UI only) ---
const slot=async title=>{const s=page.locator('details.slot',{has:page.locator('summary',{hasText:title})});if(!(await s.evaluate(d=>d.open)))await s.locator('summary').click();return s;};
const press=async name=>page.getByRole('button',{name,exact:true}).click();
// C4-8a (P8, owner's choice of 10 November 2026): the arrows of a radio group or a tab list, as the ARIA pattern has them: Tab enters the group once (one button with tabindex 0, the checked one),
// the arrows move the focus AND the selection and wrap around, Home and End reach the ends, Tab leaves the group and Shift+Tab comes back to the checked button. Restores the selection at the end.
async function radioArrows(group,role,scope){
 const attr=role==='tab'?'aria-selected':'aria-checked',items=group.locator(`[role=${role}]`),n=await items.count();assert.ok(n>=2,`${scope}: at least two`);
 const read=async()=>items.evaluateAll((els,a)=>({checked:els.findIndex(e=>e.getAttribute(a)==='true'),focused:els.indexOf(document.activeElement),stops:els.filter(e=>e.getAttribute('tabindex')==='0').length,stopAt:els.findIndex(e=>e.getAttribute('tabindex')==='0')}),attr);
 const start=(await read()).checked;assert.ok(start>=0,`${scope}: one is checked`);
 const out={n,start,steps:[]},key=async(k,want)=>{await page.keyboard.press(k);await page.waitForTimeout(120);const r=await read();out.steps.push({k,...r});
  assert.equal(r.checked,want,`${scope}: ${k} selects ${want}, got ${r.checked}`);assert.equal(r.focused,want,`${scope}: ${k} moves the focus to ${want}, got ${r.focused}`);assert.equal(r.stops,1,`${scope}: one tab stop after ${k}`);assert.equal(r.stopAt,want,`${scope}: the tab stop follows the selection after ${k}`);};
 await items.nth(start).focus();let r=await read();assert.equal(r.focused,start);assert.equal(r.stops,1,`${scope}: Tab enters the group once`);assert.equal(r.stopAt,start);
 await key('ArrowRight',(start+1)%n);await key('ArrowLeft',start);await key('ArrowLeft',(start-1+n)%n);await key('ArrowRight',start);
 if(role==='radio'){await key('ArrowDown',(start+1)%n);await key('ArrowUp',start);}
 await key('End',n-1);await key('Home',0);await key('End',n-1);
 // Tab leaves the group, Shift+Tab comes back to the checked button (the tab stop).
 await page.keyboard.press('Tab');await page.waitForTimeout(80);r=await read();assert.equal(r.focused,-1,`${scope}: Tab leaves the group`);
 await page.keyboard.press('Shift+Tab');await page.waitForTimeout(80);r=await read();assert.equal(r.focused,r.checked,`${scope}: Shift+Tab returns to the checked button`);
 await items.nth(start).click();await page.waitForTimeout(150);r=await read();assert.equal(r.checked,start,`${scope}: restored`);
 return out;
}
const deckSaved=async(from,id)=>{await page.getByTestId('deck-notice').waitFor({timeout:10000});return A.account().decks.find(d=>d.deckId===id);};
let names={},characters={};
const card=binding=>{const n=names[binding];assert.ok(n,`catalog has ${binding}`);return n;};
async function addRegular(binding,times){
 await page.getByTestId('card-search').fill(binding);
 for(let i=0;i<times;i++)await press(`Aggiungi una copia di ${card(binding)}`);
 await page.getByTestId('card-search').fill('');
}

// --- Open game helpers, as in VerifyFfa ---
async function playOne(){
 const esc=()=>page.keyboard.press('Escape');
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await esc();await page.waitForTimeout(60);}};
 const moves=()=>A.sends().filter(f=>/\/app\/game\/[^/]+\/move$/.test(f.headers.destination)).length;
 for(const c of (await A.state()).order){
  const own=(await A.state()).hits.find(h=>h.id===c.key);if(!own)continue;await tap(own);if((await A.state()).selected!==c.key)continue;
  let aimed=false;
  for(const t of (await A.state()).hits.filter(h=>h.kind==='person'||h.kind==='item')){if((await A.state()).selected!==c.key){const o=(await A.state()).hits.find(x=>x.id===c.key);if(o)await tap(o);}await tap(t);if((await A.state()).target){aimed=true;break;}}
  if(!aimed){await esc();continue;}
  const s=await A.state();
  if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==c.key)){await tap(r);if((await A.state()).discard){ok=true;break;}}if(!ok){await esc();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await esc();continue;}
  const before=moves();await page.getByTestId('confirm').click();
  const r=await A.wait(x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  assert.equal(moves()-before,1,'one SEND per confirmation');
  if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await esc();continue;}
  return c.name;
 }
 throw new Error('no playable card');
}
// Every card the server puts in the own hand must come from the saved deck. Objects near the character are not
// checked: ShuffleFeet swaps them with the opponent and tokens are created by effects.
function fromDeck(game,deck){
 const allowed=new Set([deck.basicActionCard,deck.lastResortCard,...deck.characterBoundCards,...deck.regularCards].map(c=>c.bindingName));
 const views=A.views(game),foreign=[];
 for(const v of views){const me=v.players.devAlice;if(me.character.bindingName!==deck.character.bindingName)foreign.push(`turn ${v.turn} character ${me.character.bindingName}`);
  for(const c of me.cardsInHand)if(!allowed.has(c.bindingName))foreign.push(`turn ${v.turn} ${c.bindingName}`);
  }
 return {views:views.length,foreign};
}
const startOpen=async(id,{cancelFirst=false}={})=>{
 await page.getByTestId('tab-play').click();
 await page.getByRole('radio',{name:'Con un tuo mazzo'}).click();
 const mark=A.sent.length;
 if(cancelFirst){await page.getByTestId('quick').click();await page.getByTestId('deck-dialog').waitFor();await page.getByTestId('cancel-open').click();
  assert.equal(await dialogOpen(),false);assert.ok(!A.sends(mark).some(f=>f.headers.destination.includes('/open/')),'cancel sends nothing');}
 await page.getByTestId('quick').click();await page.getByTestId('deck-dialog').waitFor();
 const listed=await page.locator('[data-testid=deck-dialog] [role=radio] strong').allInnerTexts();
 // C4-8a (P8): the saved decks of the dialog, once, when there are two or more.
 if(listed.length>=2&&!evidence.checks.deckDialogArrows)step('deckDialogArrows',await radioArrows(page.getByTestId('deck-dialog').getByRole('radiogroup'),'radio','decks'));
 await page.getByRole('radio',{name:new RegExp(`^${id} `)}).click();await page.getByTestId('start-open').click();
 return {mark,listed};
};

try{
 await startServer();
 await page.goto(`${url}#/accedi`);
 await page.getByLabel('Nome').fill(A.user);await page.getByLabel('Password').fill(A.password);
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await page.getByTestId('quick').waitFor({timeout:15000});
 const account=A.account();
 for(const c of account.collection.cards)names[c.bindingName]=c.name;
 for(const c of account.collection.characters)characters[c.bindingName]=c.name;

 // C4-8a (P8): the tabs and the modes of the hub with the arrows, before anything else changes them.
 step('hubArrows',{tabs:await radioArrows(page.getByRole('tablist'),'tab','tabs'),modes:await radioArrows(page.getByRole('radiogroup',{name:'Modalità'}),'radio','modes')});
 // P18: the catalog lists every card and character of the regulation annex.
 await page.getByTestId('tab-collection').click();
 await page.getByTestId('no-decks').waitFor();
 await page.getByTestId('show-catalog').click();await page.getByTestId('catalog').waitFor();
 const annex=JSON.parse(await readFile(join(repo,'docs/rules-catalog.json'),'utf8'));
 const shownCards=await page.locator('[data-testid=catalog] [data-testid=card-face]').evaluateAll(n=>n.map(e=>e.dataset.binding));
 const shownChars=await page.locator('[data-testid=catalog] [data-testid=character-face]').evaluateAll(n=>n.map(e=>e.dataset.binding));
 const names1=Object.fromEntries(annex.cards.map(c=>[c.class,c.name]));
 const shownNames=await page.locator('[data-testid=catalog] [data-testid=card-face] strong').allInnerTexts();
 assert.deepEqual([...shownCards].sort(),annex.cards.map(c=>c.class).sort(),'catalog cards = annex');
 assert.deepEqual([...shownChars].sort(),annex.characters.map(c=>c.class).sort(),'catalog characters = annex');
 assert.deepEqual(shownNames.map(n=>n.trim()),shownCards.map(b=>names1[b].trim()),'names from the catalog');
 // C4-4: the frame of every card as the real server publishes it, against the type in the annex.
 {const want=c=>c.type==='Oggetto'?'item':{Regolare:'regular',Base:'basic','Legata al personaggio':'bound','Ultima risorsa':'lastResort'}[c.subtype];
  const frames=await page.locator('[data-testid=catalog] [data-frame]').evaluateAll(n=>n.map(e=>({binding:e.dataset.binding,frame:e.dataset.frame})));
  for(const f of frames){const c=annex.cards.find(x=>x.class===f.binding);assert.equal(f.frame,c?want(c):'character',`frame of ${f.binding}`);}
  assert.equal(frames.length,39);step('catalogFrames',{cards:frames.length});}
 const art=await page.locator('[data-testid=catalog] .thumb').evaluateAll(n=>n.filter(e=>getComputedStyle(e).backgroundImage.includes('atlas')&&e.style.backgroundPosition).length);
 const scroll=await page.evaluate(()=>({page:document.documentElement.scrollWidth<=innerWidth,sheet:(s=>s.scrollHeight>s.clientHeight)(document.querySelector('.sheet'))}));
 await A.shot('01-catalog');
 // C3-5: the same face as the table in the catalog: the nominal damage of the annex as symbols and amounts (no letters), nothing for a card without damage, no priority.
 {const faces=await page.locator('[data-testid=catalog] [data-testid=card-face]').evaluateAll(n=>n.map(e=>({binding:e.dataset.binding,text:e.innerText,lines:[...e.querySelectorAll('small')].map(x=>x.innerText),pills:[...e.querySelectorAll('.dmg-pill')].map(x=>({type:x.dataset.damage,text:x.innerText.trim(),svg:x.querySelectorAll('svg').length}))})));
  let withDamage=0;
  for(const f of faces){const c=annex.cards.find(x=>x.class===f.binding),want=c.damageAmount&&c.damageAmount!=='—'?c.damageAmount.split(',').map(x=>{const m=/^\s*(HIT|CUT|POISON)\s+(\d+)(\+x)?\s*$/.exec(x);return {type:m[1],text:m[3]?`${m[2]}+`:m[2],svg:1};}):[];
   assert.deepEqual(f.pills,want,`catalog face of ${f.binding}: damage pills`);if(want.length)withDamage++;
   assert.ok(!/priorit/i.test(f.text),`catalog face of ${f.binding}: no priority on the face`);assert.ok(!f.lines.some(l=>/\b(HIT|CUT|POISON)\b/.test(l)),`catalog face of ${f.binding}: no type written in letters on the face lines (the effect text below is the catalog's own)`);}
  assert.equal(withDamage,12,'12 catalog faces with damage');step('catalogDamage',{faces:faces.length,withDamage,characters:shownChars.length,faceTotal:faces.length+shownChars.length});assert.equal(faces.length+shownChars.length,39);}
 step('catalog',{cards:shownCards.length,characters:shownChars.length,total:shownCards.length+shownChars.length,annexVersion:annex.version,withIllustration:art,noHorizontalScroll:scroll.page,sheetScrolls:scroll.sheet});
 assert.equal(shownCards.length+shownChars.length,39);assert.equal(art,39);assert.ok(scroll.page);
 await page.getByTestId('show-catalog').click();

 // R02 1.12 (SB-1): the regular cards of the decks of this run, ten actions twice and no item, so hand plus deck stays countable.
 const TEN_B=['bruiser.Glare','bruiser.StunningBlow','bruiser.SuperImpact','bruiser.YouStop','bruiser.MadeOfStone','bruiser.SeagullFly','bruiser.HealingBlow','com.ShuffleFeet','com.Grab','com.Steal'];
 const TEN_J=['junkie.Cough','junkie.BadTrip','junkie.GoingBerserk','junkie.MethDrivenRage','junkie.AmphetamineReflexes','junkie.PervertedMetabolism','junkie.ToxicBloodDrain','com.ShuffleFeet','com.Grab','com.Steal'];
 const twice=list=>list.flatMap(b=>[b,b]);
 const problemsNow=()=>page.locator('[data-testid=deck-problems] li').allInnerTexts();
 const offered=async title=>(await slot(title)).locator('button.pick').evaluateAll(n=>n.map(e=>e.getAttribute('aria-label')));
 const pickCharacter=async b=>(await slot('Personaggio')).getByRole('button',{name:`Personaggio ${characters[b]}`,exact:true}).click();
 const pickBound=async b=>(await slot('Azioni legate')).getByRole('button',{name:`Azione legata ${card(b)}`,exact:true}).click();
 const pickStruggle=async()=>(await slot('Ultima risorsa')).getByRole('button',{name:`Ultima risorsa ${card('com.last.Struggle')}`,exact:true}).click();
 const canAddCopy=async binding=>{await page.getByTestId('card-search').fill(binding);const on=await page.getByRole('button',{name:`Aggiungi una copia di ${card(binding)}`,exact:true}).isEnabled();await page.getByTestId('card-search').fill('');return on;};
 const removeCopy=async binding=>{await page.getByTestId('pool-deck').click();await press(`Togli una copia di ${card(binding)}`);await page.getByRole('radio',{name:'Collezione'}).click();};
 const summary=async title=>(await page.locator('details.slot summary',{hasText:title}).locator('b').innerText()).trim();

 // P19/P21 and R02 1.12: invalid drafts are not sendable; the editor offers only what the rules allow and ignores the rest.
 const markInvalid=A.sent.length;
 await page.getByTestId('new-deck').click();
 const empty=await problemsNow();
 assert.equal(await page.getByTestId('save-deck').isEnabled(),false);
 const beforeCharacter={basic:await offered('Azione base'),bound:await offered('Azioni legate')};
 await pickCharacter('bruiser.character.BigBadBruiser');
 const bruiserOffer={basicSummary:await summary('Azione base'),basic:await offered('Azione base'),bound:await offered('Azioni legate'),last:await offered('Ultima risorsa')};
 await pickStruggle();
 await pickBound('bruiser.character.LittleSmack');await pickBound('bruiser.character.LittleRage');
 await pickBound('bruiser.character.LittleSmack');const afterToggle=await text('[data-testid=bound-list]');
 await pickBound('bruiser.character.LittleSmack');
 await slot('Mazzo regolare');
 await addRegular('bruiser.Glare',2);const thirdCopy=await canAddCopy('bruiser.Glare');
 for(const b of TEN_B.slice(1))await addRegular(b,2);
 const full={counts:await text('[data-testid=deck-counts]'),problems:await problemsNow(),another:await canAddCopy('junkie.Cough')};
 await removeCopy('bruiser.Glare');
 const nineteen={problems:await problemsNow(),save:await page.getByTestId('save-deck').isEnabled()};
 await addRegular('bruiser.Glare',1);
 await page.getByTestId('deck-name').fill('a/b');
 const slash=await problemsNow(),slashSave=await page.getByTestId('save-deck').isEnabled();
 await A.shot('02-invalid');
 // Changing character: its fixed basic comes in, the other character's bound cards leave, regular cards stay.
 await pickCharacter('junkie.character.ToxicJunkie');
 const switched={basicSummary:await summary('Azione base'),bound:await text('[data-testid=bound-list]'),boundOffer:await offered('Azioni legate'),problems:await problemsNow()};
 await page.getByTestId('cancel-edit').click();
 step('rulesInEditor',{emptyDraft:empty,beforeCharacter,bruiserOffer,afterToggle,thirdCopyEnabled:thirdCopy,full,nineteen,slashName:slash,saveEnabledWithSlash:slashSave,switched,
  deckSends:A.sends(markInvalid).filter(f=>f.headers.destination.includes('/deck')).length});
 assert.deepEqual(empty,['Dai un nome al mazzo.','Scegli il personaggio.','Scegli l’azione base.','Scegli l’ultima risorsa.','Scegli 2 azioni legate diverse (ne hai 0).','Servono esattamente 20 carte regolari: ne hai 0.']);
 assert.deepEqual(beforeCharacter,{basic:[],bound:[]});
 assert.equal(bruiserOffer.basicSummary,card('com.basic.BruiserGrab'),'the basic comes with the character');
 assert.deepEqual(bruiserOffer.basic,[`Azione base ${card('com.basic.BruiserGrab')}`]);
 assert.deepEqual([...bruiserOffer.bound].sort(),[`Azione legata ${card('bruiser.character.LittleRage')}`,`Azione legata ${card('bruiser.character.LittleSmack')}`].sort());
 assert.deepEqual(bruiserOffer.last,[`Ultima risorsa ${card('com.last.Struggle')}`]);
 assert.equal(afterToggle,card('bruiser.character.LittleRage'),'a second click leaves the bound');
 assert.equal(thirdCopy,false,'no third copy');
 assert.match(full.counts,/Regolari 20 \/ 20/);assert.deepEqual(full.problems,['Dai un nome al mazzo.']);assert.equal(full.another,false,'no 21st card');
 assert.deepEqual(nineteen,{problems:['Dai un nome al mazzo.','Servono esattamente 20 carte regolari: ne hai 19.'],save:false});
 assert.deepEqual(slash,['Il nome non può contenere «/».']);assert.equal(slashSave,false);
 assert.equal(switched.basicSummary,card('com.basic.ToxicGrab'));assert.equal(switched.bound,'nessuna');
 assert.deepEqual([...switched.boundOffer].sort(),[`Azione legata ${card('junkie.character.PatheticBlade')}`,`Azione legata ${card('junkie.character.RottenSmile')}`].sort());
 assert.ok(switched.problems.includes('Scegli 2 azioni legate diverse (ne hai 0).'));
 assert.equal(A.sends(markInvalid).filter(f=>f.headers.destination.includes('/deck')).length,0);

 // P19/P21/P22/P23: create "Strano" (Bruiser, both bound cards, ten actions twice), search, remove and put back a copy, save.
 const markSave=A.sent.length;
 await page.getByTestId('new-deck').click();
 await page.getByTestId('deck-name').fill('Strano');
 await pickCharacter('bruiser.character.BigBadBruiser');await pickStruggle();
 await pickBound('bruiser.character.LittleSmack');await pickBound('bruiser.character.LittleRage');
 await slot('Mazzo regolare');
 // C4-8a (P8): «Collezione» and «Mazzo» of the editor.
 step('poolArrows',await radioArrows(page.getByRole('radiogroup',{name:'Mostra'}),'radio','pool'));
 for(const b of TEN_B)await addRegular(b,2);
 {const pool=await page.locator('[data-testid=regular-pool] [data-testid=card-face]').evaluateAll(n=>n.map(e=>({text:e.innerText,pills:e.querySelectorAll('.dmg-pill').length})));
  assert.ok(pool.length>0&&pool.every(f=>!/priorit/i.test(f.text)),'editor faces: no priority');assert.ok(pool.some(f=>f.pills>0),'editor faces: damage pills present');step('editorFaces',{faces:pool.length,withDamage:pool.filter(f=>f.pills).length});}
 // Search on the card text, then the deck view: remove one copy with the same name, then put it back.
 await page.getByTestId('card-search').fill('ShuffleFeet');const searched=await page.locator('[data-testid=regular-pool] [data-testid=card-face]').count();
 await page.getByTestId('pool-deck').click();await press(`Togli una copia di ${card('com.ShuffleFeet')}`);
 const deckView=await page.locator('[data-testid=regular-pool] strong').allInnerTexts();await page.getByTestId('card-search').fill('');
 const deckViewAll=await page.locator('[data-testid=regular-pool] strong').allInnerTexts();
 const removedSave=await page.getByTestId('save-deck').isEnabled();
 await page.getByRole('radio',{name:'Collezione'}).click();await addRegular('com.ShuffleFeet',1);
 const counts=await text('[data-testid=deck-counts]');await A.shot('03-editor');
 await page.getByTestId('save-deck').click();
 const saved=await deckSaved(markSave,'Strano');
 const deckSends=A.sends(markSave).filter(f=>f.headers.destination.startsWith('/app/user/devAlice/deck'));
 step('createAndSave',{searchShuffle:searched,deckViewAfterSearch:deckView,deckView:deckViewAll,saveEnabledAt19:removedSave,counts,sends:deckSends.map(f=>f.headers.destination),
  saved:{character:saved.character.bindingName,basic:saved.basicActionCard.bindingName,last:saved.lastResortCard.bindingName,bound:saved.characterBoundCards.map(c=>c.bindingName),regular:saved.regularCards.map(c=>c.bindingName)},listed:await page.locator('[data-testid=deck-list] li strong').allInnerTexts()});
 assert.equal(deckSends.length,1);assert.equal(removedSave,false);
 assert.deepEqual(saved.characterBoundCards.map(c=>c.bindingName),['bruiser.character.LittleSmack','bruiser.character.LittleRage']);
 assert.equal(saved.basicActionCard.bindingName,'com.basic.BruiserGrab');
 assert.deepEqual(saved.regularCards.map(c=>c.bindingName).sort(),twice(TEN_B).sort());
 assert.deepEqual(await page.locator('[data-testid=deck-list] li strong').allInnerTexts(),['Strano']);
 assert.equal(await page.locator('[data-deck="Strano"] [data-testid=deck-invalid]').count(),0);

 // P20: reopen, change, cancel: nothing is sent and the saved deck is unchanged.
 const markCancel=A.sent.length,before=JSON.stringify(A.account().decks);
 await page.locator('[data-deck="Strano"]').getByTestId('edit-deck').click();
 const readOnly=await page.getByTestId('deck-name').evaluate(e=>e.readOnly);
 await slot('Mazzo regolare');await removeCopy('bruiser.Glare');await removeCopy('bruiser.Glare');
 await pickBound('bruiser.character.LittleSmack');
 await page.getByTestId('cancel-edit').click();
 await page.locator('[data-deck="Strano"]').getByTestId('edit-deck').click();
 const reopened={counts:await text('[data-testid=deck-counts]'),bound:await page.getByTestId('bound-list').textContent()};
 step('cancelKeepsSaved',{nameReadOnly:readOnly,sends:A.sends(markCancel).map(f=>f.headers.destination),reopened,profileUnchanged:JSON.stringify(A.account().decks)===before});
 assert.ok(readOnly);assert.equal(A.sends(markCancel).length,0);assert.match(reopened.counts,/Regolari 20 \/ 20/);
 assert.equal(reopened.bound,`${card('bruiser.character.LittleSmack')}, ${card('bruiser.character.LittleRage')}`);

 // P23: modify (SuperImpact out, ExtremelyViolentBlow in) and overwrite the same deckId.
 const markOver=A.sent.length;
 await slot('Mazzo regolare');await removeCopy('bruiser.SuperImpact');await removeCopy('bruiser.SuperImpact');
 await addRegular('bruiser.ExtremelyViolentBlow',2);
 const label=await page.getByTestId('save-deck').innerText();
 await page.getByTestId('save-deck').click();
 const over=await deckSaved(markOver,'Strano');
 step('overwrite',{button:label,sends:A.sends(markOver).map(f=>f.headers.destination),decks:A.account().decks.map(d=>d.deckId),bound:over.characterBoundCards.map(c=>c.bindingName),regular:over.regularCards.map(c=>c.bindingName)});
 assert.equal(label,'Sovrascrivi');assert.equal(A.account().decks.length,1);assert.equal(over.regularCards.length,20);
 assert.equal(over.regularCards.filter(c=>c.bindingName==='bruiser.ExtremelyViolentBlow').length,2);assert.ok(!over.regularCards.some(c=>c.bindingName==='bruiser.SuperImpact'));

 // P16: open 1vCom with "Strano": cancel first, then start and play to the outcome through the UI.
 const opened=await startOpen('Strano',{cancelFirst:true});
 const asked=Date.now();await A.wait(s=>s&&s.phase==='choose',20000,'open table');
 // The table is usable once the scene has drawn its targets (Pixi and the atlas load after the first view).
 await A.wait(s=>s.hits.some(h=>h.kind==='hand'),30000,'scene ready');const sceneMs=Date.now()-asked;
 const game=A.messages('/user/queue/game/open/1vCom/ready').at(-1).body,first=A.views(game)[0],me=first.players.devAlice;
 await A.shot('04-open-table');
 const opening={sceneReadyMs:sceneMs,game,listed:opened.listed,join:A.sends(opened.mark).filter(f=>f.headers.destination.includes('/open/')).map(f=>f.headers.destination),character:me.character.bindingName,
  hand:me.cardsInHand.map(c=>c.bindingName),deck:me.deck,opponent:Object.keys(first.players).find(id=>id!=='devAlice')};
 assert.deepEqual(opening.join,['/app/game/open/1vCom/join/devAlice/Strano']);
 assert.equal(opening.character,'bruiser.character.BigBadBruiser');assert.ok(opening.opponent.startsWith('ComPlayer_'));
 assert.equal(opening.hand.length+opening.deck,1+2+20,'hand plus deck = basic + two bound + 20 regular');
 let turns=0;
 while(true){
  const s=await A.wait(x=>x&&(x.over||x.eliminated||(x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'))),150000,'next turn');
  if(s.over||s.eliminated)break;
  if(s.turn===3)await A.shot('05-open-turn3');
  await playOne();turns++;
  await A.wait(x=>!x||x.over||x.eliminated||x.turn!==s.turn,150000,'turn resolved');
 }
 const end=await A.state(),last=A.views(game).at(-1),hand=fromDeck(game,over);
 await A.shot('06-open-outcome');
 step('openGame',{...opening,turnsPlayed:turns,over:end.over,winner:last.winner,outcome:await text('.outcome'),handFromDeck:hand});
 assert.deepEqual(hand.foreign,[],'every card from the saved deck');

 // D11: "Nuova partita" repeats open with the same deck; then the second game is abandoned (forfeit).
 const markAgain=A.sent.length;
 await page.getByTestId('again').click();
 await A.wait(s=>s&&s.phase==='choose'&&s.turn===0,20000,'second open table');
 const again=A.sends(markAgain).filter(f=>f.headers.destination.includes('/open/')).map(f=>f.headers.destination);
 await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();
 await page.getByTestId('quick').waitFor({timeout:15000});
 step('newGameRepeatsOpen',{join:again});
 assert.deepEqual(again,['/app/game/open/1vCom/join/devAlice/Strano']);

 // R02 1.12: always three initial cards. A Junkie deck: at the start the hand holds ToxicGrab, the two bound cards and three
 // regular cards, the deck the other 17. (Before SB-1 this step played a six-initial-card deck into the R03 no-move state:
 // with the deck rules that state cannot be reached any more.)
 const markJ=A.sent.length;
 await page.getByTestId('tab-collection').click();await page.getByTestId('new-deck').click();
 await page.getByTestId('deck-name').fill('Tossico');
 await pickCharacter('junkie.character.ToxicJunkie');await pickStruggle();
 await pickBound('junkie.character.RottenSmile');await pickBound('junkie.character.PatheticBlade');
 await slot('Mazzo regolare');for(const b of TEN_J)await addRegular(b,2);
 const jCounts=await text('[data-testid=deck-counts]');await A.shot('07-junkie-deck');
 await page.getByTestId('save-deck').click();
 const jSaved=await deckSaved(markJ,'Tossico');
 assert.equal(jSaved.basicActionCard.bindingName,'com.basic.ToxicGrab');assert.equal(jSaved.regularCards.length,20);
 const jOpen=await startOpen('Tossico');
 await A.wait(s=>s&&s.phase==='choose'&&s.hits.some(h=>h.kind==='hand'),30000,'junkie table');
 const jGame=A.messages('/user/queue/game/open/1vCom/ready').at(-1).body,jView=A.views(jGame)[0].players.devAlice;
 await A.shot('08-junkie-table');
 const jFrom=fromDeck(jGame,jSaved),jHand=jView.cardsInHand;
 step('threeInitialCards',{counts:jCounts,listed:jOpen.listed,bound:jSaved.characterBoundCards.map(c=>c.bindingName),character:jView.character.bindingName,
  hand:jHand.map(c=>c.bindingName),deck:jView.deck,handFromDeck:jFrom});
 assert.equal(jHand.length,6);assert.equal(jView.deck,17);assert.deepEqual(jFrom.foreign,[]);assert.equal(jView.character.bindingName,'junkie.character.ToxicJunkie');
 assert.equal(jHand.filter(c=>c.basicAction).length,1);assert.equal(jHand.filter(c=>c.characterBound).length,2);assert.equal(jHand.filter(c=>!c.basicAction&&!c.characterBound&&!c.lastResort).length,3);
 await page.getByLabel('Apri menu').click();
 await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();
 await page.getByTestId('quick').waitFor({timeout:15000});

 // Deck unavailable (open/1vCom/error): provoked by rewriting the outgoing deckId, not reachable from the UI.
 route.rewrite=['Strano','Assente'];
 const markErr=A.sent.length;
 await startOpen('Strano');
 await page.locator('.problem[role=alert]').waitFor({timeout:10000});
 const unavailable={rewrittenFrames:route.rewritten.length,shown:await text('.problem[role=alert]'),serverError:A.messages('/user/queue/game/open/1vCom/error').map(f=>f.body),
  ready:A.messages('/user/queue/game/open/1vCom/ready').length,playEnabled:await page.getByTestId('quick').isEnabled(),
  sentDestination:A.sends(markErr).filter(f=>f.headers.destination.includes('/open/')).map(f=>f.headers.destination)};
 await A.shot('09-deck-unavailable');
 // The message belongs to the Gioca tab: switching tab clears it.
 await page.getByTestId('tab-collection').click();unavailable.alertsAfterTabSwitch=await page.locator('.problem[role=alert]').count();
 step('deckUnavailableProvoked',unavailable);
 assert.equal(unavailable.rewrittenFrames,1);assert.equal(unavailable.shown,'Mazzo non disponibile sul server: scegli un mazzo salvato e riprova.');assert.ok(unavailable.playEnabled);assert.equal(unavailable.alertsAfterTabSwitch,0);
 assert.deepEqual(unavailable.serverError,['Deck unavailable. Choose a saved deck from your account and retry.']);

 // P24: delete with confirmation (cancel first), the deck leaves the list and the open dialog.
 const markDel=A.sent.length;
 await page.locator('[data-deck="Strano"]').getByTestId('delete-deck').click();
 await A.shot('10-delete-confirm');
 await page.locator('[data-deck="Strano"]').getByRole('button',{name:'Annulla'}).click();
 const afterCancel=A.sends(markDel).length;
 for(const id of ['Strano','Tossico']){await page.locator(`[data-deck="${id}"]`).getByTestId('delete-deck').click();await page.getByTestId('confirm-delete').click();
  await page.locator(`[data-deck="${id}"]`).waitFor({state:'detached',timeout:10000});}
 await page.getByTestId('no-decks').waitFor();
 await page.getByTestId('tab-play').click();await page.getByTestId('quick').click();await page.getByTestId('no-saved-decks').waitFor();
 await A.shot('11-no-decks-dialog');
 const toCollection=page.getByRole('button',{name:'Vai alla collezione'});await toCollection.click();await page.getByTestId('no-decks').waitFor();
 step('delete',{sendsAfterCancel:afterCancel,deletes:A.sends(markDel).map(f=>f.headers.destination),decks:A.account().decks.length,dialog:'no saved decks, link to the collection'});
 assert.equal(afterCancel,0);assert.equal(A.account().decks.length,0);

 await page.getByTestId('tab-play').click();await page.getByRole('button',{name:'Esci',exact:true}).click();
 assert.deepEqual(evidence.errors,[],'no page errors');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);await A.shot('failure').catch(()=>{});}
finally{
 await writeFile(`${out}/decks${tag}.json`,JSON.stringify(evidence,null,1));
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

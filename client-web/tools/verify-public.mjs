// C2b-5 end-to-end check against the REAL server: home, rules, login and sign-up before the login (P01-P03, P07, P08).
// Like VerifyDecks it starts the server itself on a temporary database (the local data is never touched) and stops it
// at the end; the last scenario runs with the server stopped. The external links are compared with the debug source
// (href only, never opened). The local profile has no SMTP (app.mail.enabled false): the code cannot be sent, and the
// script checks the explicit "not available" message and that no account is created.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';

const repo=resolve(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c2/c2b-5';
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright) against the local server started by this script on a temporary database; not a physical device',checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,600));};

// --- Server on a temporary database (same command as scripts/dev.ps1 -Task Server -SeedAccounts) ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=process.env.BM_JAVA??join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-public-'));
const api='http://127.0.0.1:8080/api/rest/v1';
let server=null;
async function startServer(){
 const log=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm.sqlite')},stdio:['ignore','pipe','pipe']});
 server.stdout.pipe(log);server.stderr.pipe(log);
 const end=Date.now()+90000;
 while(Date.now()<end){
  if(server.exitCode!==null)throw new Error(`server exited (${server.exitCode}); log in ${data}`);
  try{const r=await fetch(`${api}/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));}
 throw new Error('server did not start in 90 s');
}
async function stopServer(){
 if(!server||server.exitCode!==null)return;
 const gone=new Promise(r=>server.once('exit',r));
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});}catch{server.kill('SIGKILL');}
 await gone;server=null;
}
if(await fetch(`${api}/sign-in/validate`,{method:'POST'}).then(()=>true,()=>false))throw new Error('port 8080 is in use: stop the other server first');

// --- Expected values from the sources: debug home links and docs/game-rules.md ---
const debugHome=(await readFile(join(repo,'client-debug/src/app/home/home.component.ts'),'utf8'))+(await readFile(join(repo,'client-debug/src/app/home/home.component.html'),'utf8'));
const debugLinks=[...new Set([...debugHome.matchAll(/'((?:https:\/\/|mailto:)[^']+)'/g)].map(m=>m[1]))].sort();
const rules=(await readFile(join(repo,'docs/game-rules.md'),'utf8')).replace(/^﻿/,'').replace(/\r\n?/g,'\n');
const strip=s=>s.replace(/\*\*|\*|`/g,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').trim();
const sourceHeadings=[...rules.matchAll(/^(#{1,6}) (.*)$/gm)].map(m=>`${m[1].length} ${m[2].trim()}`);
const sourceRevisions=[...rules.matchAll(/^- \*\*(\d+\.\d+) —/gm)].map(m=>m[1]);
const sourceTables=[];{let t=null;for(const l of rules.split('\n')){if(l.startsWith('|')){if(/^\|[-:| ]+\|$/.test(l))continue;const cells=l.trim().replace(/^\||\|$/g,'').split('|').map(c=>strip(c));if(!t){t=[];sourceTables.push(t);}t.push(cells);}else t=null;}}
const words=s=>s.replace(/\*\*|\*|`/g,'').replace(/[#|]|^- |^\d+\. /gm,' ').split(/\s+/).filter(w=>w&&!/^:?-+:?$/.test(w));

// --- Browser ---
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const context=await browser.newContext({viewport:{width:vw,height:vh}}),page=await context.newPage();
page.on('pageerror',e=>evidence.errors.push(String(e)));
evidence.console=[];page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')evidence.console.push(`${m.type()}: ${m.text()}`.slice(0,300));});
// One entry per request: its status, or null with the failure; a 502 whose empty body is then aborted stays one entry.
const rest=[],entries=new Map();
page.on('request',r=>{const u=new URL(r.url());if(!u.pathname.startsWith('/rest/'))return;const e={path:decodeURIComponent(u.pathname),method:r.method(),status:null};entries.set(r,e);rest.push(e);});
page.on('response',r=>{const e=entries.get(r.request());if(e)e.status=r.status();});
page.on('requestfailed',r=>{const e=entries.get(r);if(e)e.failure=r.failure()?.errorText;});
const shot=async(n,p=page,t=tag)=>p.screenshot({path:`${out}/screens/public-${n}${t}.jpg`,type:'jpeg',quality:70});
const hash=()=>page.evaluate(()=>location.hash);
// No horizontal scroll of the page; the sheet scrolls only vertically. Rule tables may scroll inside their own box.
const layout=(p=page)=>p.evaluate(()=>{const s=document.querySelector('.sheet');const r=s?.getBoundingClientRect();
 return {pageOverflowX:document.documentElement.scrollWidth-innerWidth,sheetOverflowX:s?s.scrollWidth-s.clientWidth:null,sheetInside:!!r&&r.left>=0&&r.right<=innerWidth+.5,
  sheetScrolls:s?s.scrollHeight>s.clientHeight:null,rotateOverlay:[...document.querySelectorAll('.portrait')].some(e=>getComputedStyle(e).display!=='none')};});
const okLayout=l=>{assert.ok(l.pageOverflowX<=0,'no horizontal page scroll');assert.ok(l.sheetOverflowX<=0,'no horizontal sheet scroll');assert.ok(l.sheetInside,'sheet inside the viewport');assert.equal(l.rotateOverlay,false,'no rotate request outside the table');};
const msg=async()=>(await page.getByTestId('signup-message').innerText()).trim();

async function homeChecks(p,label){
 await p.getByTestId('home').waitFor();
 const links=await p.locator('[data-testid=home] a').evaluateAll(as=>as.map(a=>({id:a.dataset.link,href:a.getAttribute('href'),target:a.target,rel:a.rel,text:a.textContent})));
 const home=await p.evaluate(()=>{const h=document.querySelector('[data-testid=home]');return {text:h.innerText,images:h.querySelectorAll('img').length,backgroundImages:[...h.querySelectorAll('*')].filter(e=>getComputedStyle(e).backgroundImage!=='none').length};});
 return {label,links,rights:(await p.getByTestId('rights').innerText()).trim(),images:home.images,backgroundImages:home.backgroundImages,
  sponsor:/sponsor/i.test(home.text),openSourceClaim:/\bopen source\b/i.test(home.text.replace(/Non è concessa alcuna licenza open source/,'')),buttons:await p.locator('[data-testid=home] button').allInnerTexts()};
}
const assertHome=h=>{
 assert.deepEqual(h.links.map(l=>l.href).sort(),debugLinks,'same destinations as the debug home');
 assert.equal(h.links.length,debugLinks.length,'each destination once');
 for(const l of h.links)if(l.href.startsWith('http'))assert.ok(l.target==='_blank'&&l.rel.includes('noopener'),l.href);
 assert.match(h.rights,/^Tutti i diritti riservati\. Non è concessa alcuna licenza open source/);
 assert.equal(h.images,0);assert.equal(h.backgroundImages,0);assert.equal(h.sponsor,false);assert.equal(h.openSourceClaim,false);
 assert.deepEqual(h.buttons,['Accedi','Registrati','Regole']);
};

try{
 await startServer();
 // --- P01, P02: home with presentation, links and rights ---
 await page.goto(url);
 const home=await homeChecks(page,'start');
 step('home',{...home,hash:await hash(),debugLinks,layout:await layout()});
 assertHome(home);okLayout(await layout());
 await shot('01-home');

 // --- P03: rules from docs/game-rules.md ---
 await page.getByTestId('go-rules').click();await page.getByTestId('rules-text').waitFor();
 assert.equal(await hash(),'#/regole');
 const dom=await page.evaluate(()=>{const r=document.querySelector('[data-testid=rules-text]');
  return {headings:[...r.querySelectorAll('h1,h2,h3,h4')].map(h=>`${h.tagName[1]} ${h.textContent.trim()}`),
   tables:[...r.querySelectorAll('table')].map(t=>[...t.rows].map(row=>[...row.cells].map(c=>c.textContent.trim()))),
   revisions:[...r.querySelectorAll(':scope > ul')].at(-1)?.children.length??0,
   revisionVersions:[...([...r.querySelectorAll(':scope > ul')].at(-1)?.children??[])].map(li=>/^(\d+\.\d+) —/.exec(li.textContent)?.[1]??null),
   anchors:r.querySelectorAll('a').length,ids:r.querySelectorAll('[id]').length,html:[...r.querySelectorAll('script,iframe,img')].length,
   text:r.innerText,head:document.querySelector('.rules .public-head').innerText,index:[...document.querySelectorAll('.rules-index button')].map(b=>b.textContent)};});
 const r07=dom.tables.findIndex(t=>t[0].join('|')==='Carta|Tipologia|Sottotipo|Costo|Priorità|Bersaglio|Effetto in ordine');
 const r07a=dom.tables.findIndex(t=>t[0].join('|')==='Carta|Ruolo|Guadagni a sé');
 const rulesCheck={version:/Regolamento (\S+)/.exec(dom.head)?.[1],headings:dom.headings.length,headingsEqual:JSON.stringify(dom.headings)===JSON.stringify(sourceHeadings),
  index:dom.index,revisions:dom.revisionVersions,tables:dom.tables.map(t=>t.length),tablesEqual:JSON.stringify(dom.tables)===JSON.stringify(sourceTables),
  r07Rows:dom.tables[r07]?.length-1,r07aRows:dom.tables[r07a]?.length-1,anchors:dom.anchors,ids:dom.ids,rawHtml:dom.html,
  textWords:words(dom.text).length,sourceWords:words(rules.replace(/^\|[-:| ]+\|$/gm,'')).length,layout:await layout()};
 step('rules',rulesCheck);
 assert.equal(rulesCheck.version,/Versione \*\*(\S+) —/.exec(rules)[1]);
 assert.ok(rulesCheck.headingsEqual,'headings equal to docs/game-rules.md');
 assert.deepEqual(dom.index,['R00','R01','R01a','R02','R03','R04','R05','R06','R07','R07a','R08','R09','Revisioni']);
 assert.deepEqual(rulesCheck.revisions,sourceRevisions);
 assert.ok(rulesCheck.tablesEqual,'every table cell equal to the source');
 assert.ok(r07>=0&&r07a>=0,'R07 and R07a tables present');
 assert.equal(rulesCheck.anchors,0);assert.equal(rulesCheck.ids,0);assert.equal(rulesCheck.rawHtml,0);
 assert.deepEqual(words(dom.text),words(rules.replace(/^\|[-:| ]+\|$/gm,'')),'full text equal to the source, markup aside');
 okLayout(rulesCheck.layout);
 await shot('02-rules');
 // The index scrolls to the section without changing the hash; the R07a table is readable there.
 await page.locator('.rules-index button',{hasText:/^R07a$/}).click();await page.waitForTimeout(200);
 const r07aView=await page.evaluate(()=>{const h=[...document.querySelectorAll('.rules-text h2')].find(x=>x.textContent.startsWith('R07a'));const s=document.querySelector('.sheet').getBoundingClientRect();const b=h.getBoundingClientRect();return {top:Math.round(b.top-s.top),visible:b.top>=s.top-1&&b.bottom<=s.bottom+1,hash:location.hash};});
 step('rulesIndex',r07aView);assert.ok(r07aView.visible);assert.equal(r07aView.hash,'#/regole');
 await shot('03-rules-r07a');
 // Browser back returns to the home; forward to the rules; the in-page button goes home too.
 await page.goBack();await page.getByTestId('home').waitFor();const back=await hash();
 await page.goForward();await page.getByTestId('rules-text').waitFor();
 await page.getByTestId('back-home').first().click();await page.getByTestId('home').waitFor();
 step('rulesBack',{historyBack:back,button:await hash()});assert.equal(await hash(),'#/');

 // --- P04 path from the home: login -> hub -> exit -> home ---
 await page.getByTestId('go-login').click();await page.getByLabel('Nome').waitFor();assert.equal(await hash(),'#/accedi');
 okLayout(await layout());await shot('04-login');
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await page.getByTestId('quick').waitFor({timeout:15000});
 const hub=await page.getByRole('heading',{level:1}).innerText();
 await page.getByRole('button',{name:'Esci',exact:true}).click();
 await page.getByTestId('home').waitFor({timeout:10000});
 // A refused login stays on the form with its message (no jump to the home).
 await page.getByTestId('go-login').click();await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('sbagliata');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByRole('alert').waitFor({timeout:10000});
 const refused={message:await page.getByRole('alert').innerText(),hash:await hash()};
 await page.getByTestId('back-home').click();await page.getByTestId('home').waitFor();
 step('loginPath',{hub,afterExit:'#/',refused});
 assert.equal(hub,'Ciao, devAlice');assert.equal(refused.hash,'#/accedi');assert.match(refused.message,/Credenziali errate/);

 // --- P07, P08: sign-up on the local profile (no SMTP) ---
 await page.getByTestId('go-signup').click();await page.getByTestId('signup').waitFor();assert.equal(await hash(),'#/registrati');
 const send=page.getByTestId('send-code'),reg=page.getByTestId('register');
 const initial={send:await send.isEnabled(),register:await reg.isEnabled()};
 await page.getByTestId('signup-username').fill('a b');await page.getByTestId('signup-email').fill('non-una-email');
 const invalid={errors:await page.locator('.field-error').allInnerTexts(),send:await send.isEnabled()};
 await shot('05-signup-invalid');
 step('signupInvalid',{initial,...invalid});
 assert.deepEqual(initial,{send:false,register:false});assert.equal(invalid.send,false);assert.equal(invalid.errors.length,2);
 // devAlice is taken: one availability request, no verify.
 let mark=rest.length;
 await page.getByTestId('signup-username').fill('devAlice');await page.getByTestId('signup-email').fill('c2b5@example.com');
 await send.click();await page.getByTestId('signup-message').waitFor();
 const taken={message:await msg(),requests:rest.slice(mark),sendEnabled:await send.isEnabled()};
 step('signupTaken',taken);
 assert.equal(taken.message,'Questo nome è già usato: scegline un altro.');
 assert.deepEqual(taken.requests.map(r=>`${r.method} ${r.path} ${r.status}`),['GET /rest/sign-up/users/devAlice/available 200']);
 assert.ok(taken.sendEnabled);
 // A new name: name and email available, then "send code" fails on the local profile with the explicit message.
 const fresh=`nuovo${Date.now()%100000}`;
 const availableBefore=await (await fetch(`${api}/sign-up/users/${fresh}/available`)).json();
 mark=rest.length;
 await page.getByTestId('signup-username').fill(fresh);
 await send.click();
 await page.waitForFunction(()=>{const m=document.querySelector('[data-testid=signup-message]');return m&&!/già usato/.test(m.textContent);},null,{timeout:15000});
 const unavailable={name:fresh,availableBefore,message:await msg(),role:await page.getByTestId('signup-message').getAttribute('role'),requests:rest.slice(mark),
  inView:await page.getByTestId('signup-message').evaluate(m=>{const r=m.getBoundingClientRect(),s=m.closest('.sheet').getBoundingClientRect();return r.top>=s.top&&r.bottom<=s.bottom+1;}),sendEnabled:await send.isEnabled(),fieldsEnabled:await page.getByTestId('signup-username').isEnabled(),buttonText:(await send.innerText()).trim()};
 await shot('06-signup-unavailable');
 step('signupUnavailable',unavailable);
 assert.equal(availableBefore,true);
 assert.deepEqual(unavailable.requests.map(r=>`${r.method} ${r.path} ${r.status}`),
  [`GET /rest/sign-up/users/${fresh}/available 200`,'GET /rest/sign-up/mail/c2b5@example.com/available 200','POST /rest/sign-up/verify 500']);
 assert.equal(unavailable.message,'Registrazione non disponibile in questo ambiente: il server non può inviare il codice per email. Nessun account è stato creato.');
 assert.equal(unavailable.role,'alert');assert.ok(unavailable.inView,'message visible in the sheet');assert.ok(unavailable.sendEnabled&&unavailable.fieldsEnabled,'form enabled again');assert.equal(unavailable.buttonText,'Invia codice');
 // Wrong code: register refused, no account.
 await page.getByTestId('signup-code').fill('000000');await page.getByTestId('signup-password').fill('c2b5-pw');await page.getByTestId('signup-confirm').fill('altra');
 const mismatch={errors:await page.locator('.field-error').allInnerTexts(),register:await reg.isEnabled()};
 await page.getByTestId('signup-confirm').fill('c2b5-pw');
 mark=rest.length;
 await reg.click();
 await page.waitForFunction(()=>/codice non è quello/.test(document.querySelector('[data-testid=signup-message]')?.textContent??''),null,{timeout:15000});
 const wrong={mismatch,message:await msg(),requests:rest.slice(mark),registerEnabled:await reg.isEnabled()};
 const availableAfter=await (await fetch(`${api}/sign-up/users/${fresh}/available`)).json();
 const loginAfter=await (await fetch(`${api}/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:fresh,password:'c2b5-pw'})})).json();
 await shot('07-signup-wrong-code');
 step('signupWrongCode',{...wrong,availableAfter,loginAfter});
 assert.deepEqual(mismatch.errors,['Le due password non coincidono.']);assert.equal(mismatch.register,false);
 assert.deepEqual(wrong.requests.map(r=>`${r.method} ${r.path} ${r.status}`),['POST /rest/sign-up/register 409']);
 assert.equal(wrong.message,'Registrazione rifiutata: il codice non è quello inviato per email, oppure nome o email sono già usati. Nessun account è stato creato.');
 assert.ok(wrong.registerEnabled);assert.equal(availableAfter,true,'no account created');assert.equal(loginAfter,false);
 okLayout(await layout());
 // Sign-up -> login link and back home.
 await page.getByRole('button',{name:'Accedi',exact:true}).click();await page.getByLabel('Nome').waitFor();
 await page.getByRole('button',{name:'Registrati',exact:true}).click();await page.getByTestId('signup').waitFor();

 // --- Server stopped: network errors, no endless spinner ---
 await stopServer();
 const t0=Date.now();mark=rest.length;
 await page.getByTestId('signup-username').fill(`${fresh}x`);await page.getByTestId('signup-email').fill('c2b5@example.com');await send.click();
 await page.waitForFunction(()=>/non raggiungibile/.test(document.querySelector('[data-testid=signup-message]')?.textContent??''),null,{timeout:15000});
 const downSignup={ms:Date.now()-t0,message:await msg(),requests:rest.slice(mark),sendEnabled:await send.isEnabled()};
 await shot('08-signup-server-down');
 await page.getByTestId('back-home').click();await page.getByTestId('go-login').click();
 const t1=Date.now();
 await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByRole('alert').waitFor({timeout:15000});
 const downLogin={ms:Date.now()-t1,message:await page.getByRole('alert').innerText(),submitEnabled:await page.getByRole('button',{name:'Siediti al tavolo'}).isEnabled()};
 await page.getByTestId('back-home').click();await page.getByTestId('go-rules').click();await page.getByTestId('rules-text').waitFor();
 const rulesOffline=(await page.locator('.rules-text h2').count())>0;
 step('serverDown',{signup:downSignup,login:downLogin,rulesOffline});
 assert.equal(downSignup.message,'Server non raggiungibile. Riprova tra poco.');assert.ok(downSignup.sendEnabled);
 assert.deepEqual(downSignup.requests.map(r=>`${r.method} ${r.path} ${r.status}`),[`GET /rest/sign-up/users/${fresh}x/available 502`]);
 assert.equal(downLogin.message,'Server non raggiungibile. Riprova tra poco.');assert.ok(downLogin.submitEnabled);
 assert.ok(rulesOffline,'the rules need no server');

 // --- Portrait outside the table (D7): home, rules and sign-up at 390x844 ---
 const portrait=await (await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
 portrait.on('pageerror',e=>evidence.errors.push(`portrait: ${e}`));
 const shots={};
 for(const [route,ready,name] of [['#/','home','home'],['#/regole','rules-text','rules'],['#/registrati','signup','signup'],['#/accedi',null,'login']]){
  await portrait.goto(`${url}${route}`);if(ready)await portrait.getByTestId(ready).waitFor();else await portrait.getByLabel('Nome').waitFor();
  shots[name]=await layout(portrait);okLayout(shots[name]);await shot(`09-portrait-${name}`,portrait,'-390x844');}
 await portrait.goto(`${url}#/`);const portraitHome=await homeChecks(portrait,'portrait');assertHome(portraitHome);
 step('portrait',shots);

 assert.deepEqual(evidence.errors,[],'no page errors');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);await shot('failure').catch(()=>{});}
finally{
 evidence.rest=rest;
 await writeFile(`${out}/public${tag}.json`,JSON.stringify(evidence,null,1));
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

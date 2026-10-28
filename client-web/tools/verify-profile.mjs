// C2b-6 end-to-end check against the REAL server: profile, admin panel, client error reports and diagnostics
// (P09, P38-P44). Like VerifyDecks it starts the server itself on a temporary database (the local data is never
// touched). D5: a synthetic ADMIN account is added to that database and HTTP Basic comes from environment variables
// (HTTP_AUTH_USERNAME / HTTP_AUTH_PASSWORD, BCrypt hash of a password made for this run); no server code changes.
// The server runs three times: seeded once, then with the ADMIN account but no Basic configured, then with Basic.
// DELETE touches only the synthetic logs of this temporary database. The client never handles the Basic credentials:
// the browser context answers the 401 challenge (Playwright httpCredentials), as the native prompt does for a person.
// BM_NATIVE_PROMPT=1 also opens a headed Edge without credentials to capture the native prompt and answer it.
// Prerequisites: port 8080 free (no other server), ./client-web/run.ps1 -Task Serve running, server jar built.
import {chromium} from '@playwright/test';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';

const repo=resolve(import.meta.dirname,'../..');
const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const out=process.env.BM_OUT??'../docs/reports/client-c2/c2b-6';
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=`-${vw}x${vh}`;
await mkdir(`${out}/screens`,{recursive:true});
const evidence={date:new Date().toISOString(),url,viewport:{width:vw,height:vh},kind:'automated browser run on PC (Edge via Playwright) against the local server started by this script on a temporary database with a synthetic ADMIN account and HTTP Basic from environment variables (D5); not a physical device',checks:{},errors:[]};
const step=(name,data)=>{evidence.checks[name]=data;console.log(new Date().toISOString().slice(11,19),name,JSON.stringify(data).slice(0,500));};
const MARK='c2b6-synthetic';

// --- Server on a temporary database ---
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const jdk=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin');
const java=process.env.BM_JAVA??join(jdk,'java.exe');
const jar=process.env.BM_JAR??'target/bm-server-0.0.1-SNAPSHOT.jar';
const data=await mkdtemp(join(tmpdir(),'bm-profile-'));
const dbPath=join(data,'bm.sqlite'),api='http://127.0.0.1:8080/api/rest/v1';
const admin={user:'c2b6Admin',email:'c2b6-admin@example.invalid'};
const basic={username:'c2b6basic',password:randomBytes(12).toString('hex')};
let server=null;
async function startServer(env={}){
 const log=createWriteStream(join(data,'server.log'),{flags:'a'});
 server=spawn(java,['-jar',jar,'--spring.profiles.active=local','--app.dev.seed-accounts=true'],{cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:dbPath,...env},stdio:['ignore','pipe','pipe']});
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
// BCrypt hash of the run's Basic password with the server's own encoder (spring-security-core inside the jar).
async function bcrypt(password){
 const lib=join(data,'crypto');
 const entries=execFileSync(join(jdk,'jar.exe'),['tf',join(repo,'server',jar)],{encoding:'utf8',maxBuffer:1<<26}).split(/\r?\n/).filter(e=>/BOOT-INF\/lib\/(spring-security-core|spring-jcl)-[^/]+\.jar$/.test(e));
 await mkdir(lib);execFileSync(join(jdk,'jar.exe'),['xf',join(repo,'server',jar),...entries],{cwd:lib});
 const source=join(lib,'Hash.java');
 return writeFile(source,'public class Hash{public static void main(String[] a){System.out.print(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(a[0]));}}')
  .then(()=>execFileSync(java,['-cp',entries.map(e=>join(lib,e)).join(';'),source,password],{encoding:'utf8'}).trim());
}
const db=f=>{const d=new DatabaseSync(dbPath);try{return f(d);}finally{d.close();}};
const rows=table=>db(d=>d.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n);
const auth={Authorization:`Basic ${Buffer.from(`${basic.username}:${basic.password}`).toString('base64')}`};
const direct=async path=>{const r=await fetch(`${api}/logs/${path}`,{headers:auth});assert.equal(r.status,200,path);return r.json();};

// --- Browser ---
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const pages=[];
async function open(name,options={}){
 const context=await browser.newContext({viewport:{width:vw,height:vh},acceptDownloads:true,...options}),page=await context.newPage();
 const p={name,page,context,rest:[],posts:[]};pages.push(p);
 page.on('pageerror',e=>{if(!/c2b6-synthetic|\[Sberla\]/.test(String(e)))evidence.errors.push(`${name}: ${e}`);});
 page.on('request',r=>{const u=new URL(r.url());if(!u.pathname.startsWith('/rest/logs'))return;const e={path:u.pathname,method:r.method(),status:null,auth:!!r.headers().authorization};p.rest.push(e);r._e=e;
  if(r.method()==='POST')p.posts.push({at:Date.now(),body:r.postData()});});
 page.on('response',r=>{if(r.request()._e)r.request()._e.status=r.status();});
 page.on('requestfailed',r=>{if(r._e)r._e.failure=r.failure()?.errorText;});
 p.state=()=>page.evaluate(()=>window.__bm?.state??null);
 p.wait=async(pred,ms=20000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await p.state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`${name}: timeout ${what}`);};
 p.shot=async n=>page.screenshot({path:`${out}/screens/profile-${n}${tag}.jpg`,type:'jpeg',quality:70});
 return p;
}
async function login(p,user,password){
 await p.page.goto(`${url}#/accedi`);
 await p.page.getByLabel('Nome').fill(user);await p.page.getByLabel('Password').fill(password);
 await p.page.getByRole('button',{name:'Siediti al tavolo'}).click();
 await p.page.getByTestId('quick').waitFor({timeout:15000});
}
const tab=async(p,id)=>{await p.page.getByTestId(`tab-${id}`).click();};
const logout=async p=>{await tab(p,'play');await p.page.getByRole('button',{name:'Esci',exact:true}).click();await p.page.getByTestId('home').waitFor({timeout:10000});};
const profile=async p=>({username:await p.page.getByTestId('profile-username').innerText(),email:await p.page.getByTestId('profile-email').innerText(),role:await p.page.getByTestId('profile-role').innerText(),
 panel:await p.page.getByTestId('admin-panel').count()});
const layout=p=>p.page.evaluate(()=>{const s=document.querySelector('.sheet'),r=s?.getBoundingClientRect();return {pageOverflowX:document.documentElement.scrollWidth-innerWidth,sheetOverflowX:s?s.scrollWidth-s.clientWidth:null,sheetInside:!!r&&r.left>=0&&r.right<=innerWidth+.5};});
const okLayout=l=>{assert.ok(l.pageOverflowX<=0,'no horizontal page scroll');assert.ok(l.sheetOverflowX<=0,'no horizontal sheet scroll');assert.ok(l.sheetInside,'sheet inside the viewport');};
const adminText=async p=>({counts:{games:await p.page.getByTestId('count-games').innerText(),client:await p.page.getByTestId('count-client').innerText()},
 error:await p.page.getByTestId('admin-error').count()?await p.page.getByTestId('admin-error').innerText():null,
 notice:await p.page.getByTestId('admin-notice').count()?await p.page.getByTestId('admin-notice').innerText():null});
const settled=p=>p.page.waitForFunction(()=>!document.querySelector('[data-testid=admin-loading]')&&![...document.querySelectorAll('.admin button')].some(b=>/…$/.test(b.textContent)),null,{timeout:30000});
// Errors thrown by the page itself, outside any handler of the client: an uncaught error and an unhandled rejection.
const throwInPage=(p,kind,text)=>p.page.evaluate(([kind,text])=>{if(kind==='rejection')Promise.reject(new Error(text));else if(kind==='json')setTimeout(()=>JSON.parse(text));else setTimeout(()=>{throw new Error(text);});},[kind,text]);
const reports=p=>p.page.evaluate(()=>({...window.__bmReports}));

// One move through the UI (same loop as VerifyModes): any card, any target; the server decides.
const center=h=>h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:{x:h.x,y:h.y};
async function playOne(p){
 const {page}=p,cancel=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(60);};
 const tap=async h=>{const c=center(h);await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);};
 let s=await p.wait(x=>x&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'choose phase');const turn=s.turn;
 for(const card of s.order){
  const own=(await p.state()).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await p.state()).selected!==card.key)continue;
  s=await p.state();let aimed=false;
  for(const t of [...s.hits.filter(h=>h.kind==='person'&&!h.id.endsWith(s.me)),...s.hits.filter(h=>h.kind==='person'),...s.hits.filter(h=>h.kind==='item')]){
   const h=(await p.state()).hits.find(x=>x.id===t.id);if(!h)continue;
   if((await p.state()).selected!==card.key){const o=(await p.state()).hits.find(x=>x.id===card.key);if(o)await tap(o);}
   await tap(h);if((await p.state()).target){aimed=true;break;}}
  if(!aimed){await cancel();continue;}
  if((await p.state()).message.includes('scartare')){let ok=false;for(const r of (await p.state()).hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await p.state()).discard){ok=true;break;}}if(!ok){await cancel();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await cancel();continue;}
  await page.getByTestId('confirm').click();
  s=await p.wait(x=>x.over||x.turn!==turn||x.phase==='pending'||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  if(s.phase==='choose'&&s.message.startsWith('Rifiutata')&&s.turn===turn){await cancel();continue;}
  return turn;
 }
 throw new Error(`${p.name}: no playable card`);
}
// Every diagnostic tool of the menu, as text: what a person sees in the dialog.
async function tools(p){
 const {page}=p,outputs={};
 await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Strumenti'}).click();
 for(const name of ['Log State','Log Item','Log JSON','Messaggi ricevuti','Giocatori']){
  await page.getByRole('button',{name,exact:true}).click();outputs[name]=await page.locator('.tools pre').innerText();}
 outputs.logCardDisabled=await page.getByRole('button',{name:'Log Card',exact:true}).isDisabled();
 await page.getByRole('button',{name:'Chiudi'}).click();
 return outputs;
}
// The other player's hand (from that player's own state) never appears in my tools. Played cards and the cards
// discarded for a bound action (choices.DISCARD_ONE of a resolved move) are public: a name the other player also
// holds may legitimately appear through them (seen once: a discarded "Grab" while the other hand had one).
function privateHand(me,other,outputs,played){
 const mine=new Set(me.order.map(c=>c.name)),theirs=other.order.map(c=>c.name).filter(n=>!mine.has(n)&&!played.has(n));
 const text=Object.values(outputs).filter(v=>typeof v==='string').join('\n');
 const leaks=theirs.filter(n=>text.includes(JSON.stringify(n))).map(n=>{const [k,v]=Object.entries(outputs).find(([,v])=>typeof v==='string'&&v.includes(JSON.stringify(n)));const i=v.indexOf(JSON.stringify(n));return `${n} in ${k}: ${v.slice(Math.max(0,i-300),i+80)}`;});
 // Raw views in "Messaggi ricevuti": the other hand is only a number.
 const views=JSON.parse(outputs['Messaggi ricevuti']).filter(t=>t.channel==='view').map(t=>JSON.parse(t.body));
 const counts=views.map(v=>v.players[other.me]?.cardsInHand);
 return {checkedNames:theirs.length,leaks,views:views.length,otherHandInViews:[...new Set(counts.map(c=>typeof c))],ownHandInViews:[...new Set(views.map(v=>Array.isArray(v.players[me.me].cardsInHand)))]};
}
const leaveGame=async p=>{
 if(!(await p.state())?.over){await p.page.getByLabel('Apri menu').click();await p.page.getByRole('button',{name:'Abbandona la partita'}).click();await p.page.getByRole('button',{name:'Sì, abbandona'}).click();}
 else await p.page.getByRole('button',{name:'Torna all’hub'}).click();
 await p.page.getByTestId('quick').waitFor({timeout:15000});
};

try{
 // --- Phase 1: seed the temporary database, then add the synthetic ADMIN (same password hash as devAlice) ---
 await startServer();await stopServer();
 db(d=>d.prepare("INSERT INTO USR001_CREDENTIALS SELECT ?, ?, T_SALTED_HASH, 'ADMIN' FROM USR001_CREDENTIALS WHERE C_USERNAME='devAlice'").run(admin.user,admin.email));
 // Quick and open games never reach LOG001_GAMES (GameLoggingServiceImpl writes only other game types, none of
 // them reachable): synthetic rows, one per status, so the admin list, download and delete have data.
 const synthetic=[['STARTED','c2b6Admin, ComPlayer_1'],['IN_PROGRESS','devAlice, devBob'],['ENDED','devBob, ComPlayer_2']].map(([status,players],i)=>({gameId:`${MARK}-${i+1}`,players,type:'c2b6Synthetic',date:'2026-10-28 12:00:0'+i,status}));
 db(d=>{const q=d.prepare('INSERT INTO LOG001_GAMES (C_GAME_ID,T_PLAYERS,T_TYPE,T_DATE,T_STATUS,J_FULL_LOG) VALUES (?,?,?,?,?,?)');for(const g of synthetic)q.run(g.gameId,g.players,g.type,g.date,g.status,'[]');});
 const accounts=db(d=>d.prepare('SELECT C_USERNAME AS username, T_EMAIL AS email, T_ROLE AS role FROM USR001_CREDENTIALS ORDER BY 1').all()).map(r=>({...r}));
 step('environment',{database:'temporary',accounts,syntheticGameLogs:synthetic,basicUser:basic.username,basicPassword:'generated for this run, BCrypt in HTTP_AUTH_PASSWORD, not recorded'});

 // --- Phase 2: ADMIN account, Basic NOT configured on the server: even credentials offered by the browser fail ---
 await startServer();
 const unconfigured=await open('noBasic',{httpCredentials:{username:basic.username,password:basic.password}});
 await login(unconfigured,admin.user,'local-alice');await tab(unconfigured,'profile');
 await unconfigured.page.getByTestId('admin-error').waitFor({timeout:30000});await settled(unconfigured);
 const noBasic={profile:await profile(unconfigured),...await adminText(unconfigured),retry:await unconfigured.page.getByTestId('admin-retry').isVisible(),
  clearEnabled:await unconfigured.page.getByTestId('clear-games').isEnabled(),requests:unconfigured.rest.map(r=>`${r.method} ${r.path} ${r.status}`)};
 await unconfigured.shot('01-admin-not-configured');
 step('adminBasicNotConfigured',noBasic);
 assert.match(noBasic.error,/^Non autorizzato in questo ambiente/);assert.deepEqual(noBasic.counts,{games:'—',client:'—'});
 assert.equal(noBasic.clearEnabled,false);assert.ok(noBasic.retry);
 assert.ok(noBasic.requests.every(r=>r.endsWith(' 401')),'only 401 answers');assert.ok(!noBasic.requests.some(r=>r.startsWith('DELETE')));
 await unconfigured.context.close();
 await stopServer();

 // --- Phase 3: Basic configured from environment variables ---
 await startServer({HTTP_AUTH_USERNAME:basic.username,HTTP_AUTH_PASSWORD:await bcrypt(basic.password)});
 const before={games:await direct('back/games/qty'),client:await direct('client/web/qty'),matchEvents:rows('LOG003_MATCH_EVENTS')};

 // P09 for an ordinary account: profile, no panel, no request to the logs.
 const alice=await open('A');await login(alice,'devAlice','local-alice');
 const hubLayout=await layout(alice);
 await tab(alice,'profile');await alice.page.getByTestId('profile').waitFor();
 const user={profile:await profile(alice),logRequests:alice.rest.length,layout:await layout(alice)};
 await alice.shot('02-user-profile');
 step('userProfile',{...user,hubLayout});
 assert.deepEqual(user.profile,{username:'devAlice',email:'—',role:'USER',panel:0});assert.equal(user.logRequests,0);okLayout(user.layout);

 // P44: errors provoked in the page, one POST each, accepted and stored (log.db Y); no credentials, name or JSON.
 const sent=[];
 for(const [kind,text] of [['error',`${MARK} uncaught for devAlice with local-alice`],['rejection',`${MARK} rejection`],['json',`{"gameId":"${MARK}","players":{"devBob":{"cardsInHand":[Sberla]}}}`]]){
  const n=alice.posts.length;
  const answer=alice.page.waitForResponse(r=>r.url().endsWith('/rest/logs/client/web/')&&r.request().method()==='POST',{timeout:10000});
  await throwInPage(alice,kind,text);
  const response=await answer.catch(async e=>{throw new Error(`${e.message}; posts ${JSON.stringify(alice.posts)}, stats ${JSON.stringify(await reports(alice))}`);});
  sent.push({kind,status:response.status(),body:JSON.parse(alice.posts[n].body)});
  await alice.page.waitForTimeout(300);
 }
 const stored=await direct('client/web/drain');
 const ours=stored.filter(r=>sent.some(s=>s.body.timestamp===r.timestamp));
 const reportCheck={sent,posts:alice.posts.length,stats:await reports(alice),qtyBefore:before.client,qtyAfter:await direct('client/web/qty'),stored:ours};
 step('clientErrorReports',reportCheck);
 assert.equal(reportCheck.posts,3,'one POST per provoked error');
 assert.ok(sent.every(s=>s.status===200));
 assert.equal(reportCheck.qtyAfter,before.client+3,'three rows stored');
 assert.equal(ours.length,3);
 for(const s of sent){
  const raw=JSON.stringify(s.body);
  assert.deepEqual(Object.keys(s.body),['timestamp','message','additional']);assert.deepEqual(s.body.additional,['client-web']);
  assert.ok(!raw.includes('local-alice')&&!raw.includes('devAlice'),'no credentials nor username');
  assert.ok(!/gameId|cardsInHand|Sberla|devBob/.test(raw),'no view data');}
 assert.match(sent[0].body.message,/^Error: c2b6-synthetic uncaught for \*\*\* with \*\*\*$/);
 assert.match(sent[1].body.message,/^Error: c2b6-synthetic rejection$/);
 assert.match(sent[2].body.message,/^SyntaxError: /);

 // Ingestion unreachable: refused at once, then hanging. One send at a time, no loop, 5 s timeout.
 await alice.page.route('**/rest/logs/client/web/',route=>route.abort('connectionrefused'));
 let mark=alice.posts.length;
 // Three errors in the same moment (one page task each): the first is being sent while the others arrive.
 await alice.page.evaluate(m=>{for(let i=0;i<3;i++)setTimeout(()=>{throw new Error(`${m} refused ${i}`);});},MARK);
 await alice.page.waitForTimeout(3000);
 const refused={attempts:alice.posts.length-mark,stats:await reports(alice)};
 await alice.page.unroute('**/rest/logs/client/web/');
 const held=[];await alice.page.route('**/rest/logs/client/web/',route=>{held.push(route);});
 mark=alice.posts.length;const t0=Date.now();
 await throwInPage(alice,'error',`${MARK} hanging`);
 await alice.page.waitForTimeout(1000);
 await throwInPage(alice,'error',`${MARK} while hanging`);
 const ended=await alice.page.waitForEvent('requestfailed',{predicate:r=>r.url().endsWith('/rest/logs/client/web/'),timeout:10000});
 const abortedAfter=Date.now()-t0;
 await alice.page.waitForTimeout(500);
 const afterHang={attempts:alice.posts.length-mark};
 await throwInPage(alice,'error',`${MARK} after the timeout`);await alice.page.waitForTimeout(800);
 const unreachable={refused,hanging:{abortedAfterMs:abortedAfter,failure:ended.failure()?.errorText,attemptsDuringHang:afterHang.attempts,attemptsAfterNextError:alice.posts.length-mark},stats:await reports(alice)};
 held.forEach(r=>r.abort().catch(()=>{}));await alice.page.unroute('**/rest/logs/client/web/');
 step('ingestionUnreachable',unreachable);
 assert.equal(refused.attempts,1,'three errors in a row while the first send is in flight: one attempt');
 assert.equal(unreachable.hanging.attemptsDuringHang,1,'an error during the hanging send is dropped');
 assert.ok(abortedAfter>=4500&&abortedAfter<7000,`aborted after about 5 s (${abortedAfter} ms)`);
 assert.equal(unreachable.hanging.attemptsAfterNextError,2,'after the timeout a new error is sent again, once');
 assert.ok(unreachable.stats.failed>=2&&unreachable.stats.sent<=10);
 // Wait at the end: no attempt arrives on its own.
 mark=alice.posts.length;await alice.page.waitForTimeout(2000);assert.equal(alice.posts.length,mark,'no loop');

 // P38, P39 in 1v1: tools on both sides, before and after a resolved turn; the other hand never shows.
 const bob=await open('B');await login(bob,'devBob','local-bob');
 await tab(alice,'play');
 for(const p of [alice,bob])await p.page.getByRole('radio',{name:'Uno contro uno'}).click();
 await alice.page.getByTestId('quick').click();await alice.page.waitForTimeout(500);await bob.page.getByTestId('quick').click();
 await Promise.all([alice,bob].map(p=>p.wait(x=>x&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'1v1 table')));
 const diag={};
 {const [sa,sb]=[await alice.state(),await bob.state()];
  diag.turn1={A:privateHand(sa,sb,await tools(alice),new Set()),B:privateHand(sb,sa,await tools(bob),new Set())};}
 await Promise.all([playOne(alice),playOne(bob)]);
 const resolved=await alice.wait(x=>x.turn>=1||x.over,40000,'turn resolved');await bob.wait(x=>x.turn>=1||x.over,40000,'turn resolved');
 await alice.page.waitForTimeout(500);
 {const [sa,sb]=[await alice.state(),await bob.state()];
  const out=await tools(alice),played=new Set(JSON.parse(out['Log JSON']).resolvedMoves.flatMap(m=>[m.playedCardName,...Object.values(m.choices??{})]));
  diag.turn2={turn:resolved.turn,played:[...played],A:privateHand(sa,sb,out,played),logCardDisabledWithoutChoice:out.logCardDisabled,
   logState:Object.keys(JSON.parse(out['Log State'])),logItemPlayers:Object.keys(JSON.parse(out['Log Item'])),logJson:Object.keys(JSON.parse(out['Log JSON'])),B:privateHand(sb,sa,await tools(bob),played)};}
 await alice.shot('03-tools-1v1');
 // Log Card with a chosen card shows that card only.
 {const s=await alice.state(),h=s.hits.find(x=>x.kind==='hand');const c=center(h);await alice.page.mouse.click(c.x,c.y);
  await alice.page.getByLabel('Apri menu').click();await alice.page.getByRole('button',{name:'Strumenti'}).click();await alice.page.getByRole('button',{name:'Log Card',exact:true}).click();
  const card=JSON.parse(await alice.page.locator('.tools pre').innerText());diag.logCard={name:card.name,inOwnHand:s.order.some(o=>o.name===card.name)};
  await alice.page.getByRole('button',{name:'Chiudi'}).click();await alice.page.keyboard.press('Escape');}
 step('diagnostics1v1',diag);
 for(const t of [diag.turn1.A,diag.turn1.B,diag.turn2.A,diag.turn2.B]){assert.deepEqual(t.leaks,[]);assert.deepEqual(t.otherHandInViews,['number']);assert.deepEqual(t.ownHandInViews,[true]);assert.ok(t.views>=1);}
 assert.ok(diag.turn1.A.checkedNames+diag.turn1.B.checkedNames>0,'some names only in the other hand');
 assert.deepEqual(diag.turn2.logItemPlayers.sort(),['devAlice','devBob']);
 assert.ok(diag.logCard.inOwnHand);
 // The leave from the menu, then B back to the hub.
 await leaveGame(alice);await bob.wait(x=>x&&x.over,20000,'B sees the forfeit');await leaveGame(bob);

 // P38, P39 in FFA: A, B and one computer started early; tools on A's side.
 for(const p of [alice,bob])await p.page.getByRole('radio',{name:'Tutti contro tutti'}).click();
 await alice.page.getByTestId('quick').click();await alice.page.getByTestId('ffa-list').waitFor({timeout:10000});
 await bob.page.getByTestId('quick').click();await bob.page.getByTestId('ffa-list').waitFor({timeout:10000});
 await alice.page.waitForFunction(()=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length===2,null,{timeout:10000});
 await alice.page.getByTestId('add-computer').click();
 await alice.page.waitForFunction(()=>document.querySelectorAll('[data-testid=ffa-list] li:not(.free)').length===3,null,{timeout:10000});
 await alice.page.getByTestId('start-now').click();
 await Promise.all([alice,bob].map(p=>p.wait(x=>x&&x.phase==='choose'&&x.hits.some(h=>h.kind==='hand'),30000,'FFA table')));
 {const [sa,sb]=[await alice.state(),await bob.state()],out=await tools(alice);
  const players=JSON.parse(out['Giocatori']);
  diag.ffa={players:Object.values(players),A:privateHand(sa,sb,out,new Set())};
  const views=JSON.parse(out['Messaggi ricevuti']).filter(t=>t.channel==='view').map(t=>JSON.parse(t.body));
  diag.ffa.othersInViews=[...new Set(views.flatMap(v=>Object.entries(v.players).filter(([id])=>id!==sa.me).map(([,p])=>typeof p.cardsInHand)))];}
 await alice.shot('04-tools-ffa');
 step('diagnosticsFfa',diag.ffa);
 assert.equal(diag.ffa.players.length,3);assert.deepEqual(diag.ffa.A.leaks,[]);assert.deepEqual(diag.ffa.othersInViews,['number']);
 await leaveGame(alice);await leaveGame(bob);

 // Games of this run are archived (LOG003), not in LOG001: the game log still holds only the synthetic rows.
 step('gameLogAfterGames',{log001:await direct('back/games/qty'),log003:rows('LOG003_MATCH_EVENTS'),log003Before:before.matchEvents});
 assert.equal(await direct('back/games/qty'),synthetic.length);
 await logout(alice);

 // --- ADMIN with wrong Basic credentials (a person who types them wrong, then gives up): the browser hands over
 // the 401. Headless Edge without any credentials keeps the challenge open instead; the real cancel of the native
 // prompt is the BM_NATIVE_PROMPT scenario. ---
 const cancelled=await open('adminWrongCredentials',{httpCredentials:{username:basic.username,password:'wrong-password'}});await login(cancelled,admin.user,'local-alice');await tab(cancelled,'profile');
 await cancelled.page.getByTestId('admin-error').waitFor({timeout:30000});await settled(cancelled);
 const drainRefused=cancelled.page.getByTestId('drain-client');await drainRefused.click();await settled(cancelled);
 const noCredentials={profile:await profile(cancelled),...await adminText(cancelled),clearEnabled:await cancelled.page.getByTestId('clear-client').isEnabled(),requests:cancelled.rest.map(r=>`${r.method} ${r.path} ${r.status}`)};
 await cancelled.shot('05-admin-no-credentials');
 step('adminWrongCredentials',noCredentials);
 assert.deepEqual(noCredentials.profile,{username:admin.user,email:admin.email,role:'ADMIN',panel:1});
 assert.match(noCredentials.error,/^Non autorizzato in questo ambiente/);assert.equal(noCredentials.notice,null);assert.equal(noCredentials.clearEnabled,false);
 assert.deepEqual(noCredentials.requests,['GET /rest/logs/back/games/qty 401','GET /rest/logs/client/web/drain 401']);
 await cancelled.context.close();

 // --- ADMIN with the Basic credentials answered by the browser ---
 const ad=await open('admin',{httpCredentials:{username:basic.username,password:basic.password}});
 await login(ad,admin.user,'local-alice');await tab(ad,'profile');
 await ad.page.getByTestId('count-client').filter({hasText:/^\d+$/}).waitFor({timeout:30000});await settled(ad);
 const expected={games:await direct('back/games/qty'),client:await direct('client/web/qty')};
 const panel={profile:await profile(ad),...await adminText(ad),expected,layout:await layout(ad)};
 await ad.shot('06-admin-counts');
 step('adminCounts',panel);
 assert.deepEqual(panel.profile,{username:admin.user,email:admin.email,role:'ADMIN',panel:1});
 assert.deepEqual(panel.counts,{games:String(expected.games),client:String(expected.client)});assert.equal(panel.error,null);
 assert.equal(expected.games,synthetic.length);okLayout(panel.layout);
 // P41: unfinished games, devBob's 1vCom among them.
 await ad.page.getByTestId('open-games').click();await settled(ad);
 const openRows=await ad.page.locator('[data-testid=open-list] tbody tr').evaluateAll(rs=>rs.map(r=>[...r.cells].map(c=>c.textContent)));
 const openDirect=(await direct('back/games/open')).map(g=>g.gameId);
 await ad.page.getByTestId('open-list').scrollIntoViewIfNeeded();await ad.shot('07-admin-open-games');
 step('adminOpenGames',{rows:openRows,direct:openDirect});
 assert.deepEqual(openRows.map(r=>r[0]).sort(),[...openDirect].sort());
 assert.deepEqual(openRows,synthetic.filter(g=>g.status!=='ENDED').map(g=>[g.gameId,g.type,g.players,g.date,g.status]),'STARTED and IN_PROGRESS, not ENDED');
 // P42: both downloads, readable JSON with the expected records.
 const downloads={};
 for(const kind of ['games','client']){
  const [download]=await Promise.all([ad.page.waitForEvent('download',{timeout:30000}),ad.page.getByTestId(`drain-${kind}`).click()]);
  const file=join(data,download.suggestedFilename());await download.saveAs(file);
  const records=JSON.parse(await readFile(file,'utf8'));await settled(ad);
  downloads[kind]={file:download.suggestedFilename(),records:records.length,notice:(await adminText(ad)).notice,
   sample:kind==='client'?records.map(r=>r.message):records.slice(0,3).map(r=>({gameId:r.gameId,type:r.type,status:r.status}))};}
 const afterDownload={games:await direct('back/games/qty'),client:await direct('client/web/qty')};
 step('adminDownloads',{...downloads,countsAfter:afterDownload});
 assert.equal(downloads.games.records,afterDownload.games);assert.deepEqual(downloads.games.sample.map(g=>g.gameId).sort(),synthetic.map(g=>g.gameId));assert.equal(downloads.client.records,afterDownload.client,'drain does not delete');
 assert.deepEqual(downloads.client.sample,ours.map(r=>r.message),'the stored reports, readable');assert.ok(!JSON.stringify(downloads).includes('local-alice'));
 assert.match(downloads.client.notice,/^Scaricato bm-log-client-\d{8}-\d{6}\.json: \d+ record\.$/);
 // P43: cancel sends no DELETE; confirm deletes the synthetic logs and refreshes the counts.
 const deletes=()=>ad.rest.filter(r=>r.method==='DELETE').map(r=>`${r.path} ${r.status}`);
 await ad.page.getByTestId('clear-client').click();
 const confirmText=await ad.page.locator('[data-testid=admin-client] .confirm span').innerText();
 await ad.shot('08-admin-confirm');
 await ad.page.getByTestId('cancel-clear-client').click();await ad.page.waitForTimeout(800);
 const cancelledDeletes=deletes().length;
 const countBefore=await direct('client/web/qty');
 await ad.page.getByTestId('clear-client').click();await ad.page.getByTestId('confirm-clear-client').click();
 await ad.page.getByTestId('admin-notice').filter({hasText:'log cancellati'}).waitFor({timeout:30000});await settled(ad);
 const clientCleared={...await adminText(ad),direct:await direct('client/web/qty')};
 await ad.shot('09-admin-deleted');
 const archiveBefore=rows('LOG003_MATCH_EVENTS');
 await ad.page.getByTestId('clear-games').click();await ad.page.getByTestId('confirm-clear-games').click();
 await ad.page.getByTestId('admin-notice').filter({hasText:'Partite registrate: log cancellati'}).waitFor({timeout:30000});await settled(ad);
 const gamesCleared={...await adminText(ad),direct:await direct('back/games/qty'),matchEvents:rows('LOG003_MATCH_EVENTS')};
 step('adminDelete',{confirmText,deletesAfterCancel:cancelledDeletes,countBefore,clientCleared,gamesCleared,deletes:deletes(),matchEventsBeforeDelete:archiveBefore});
 assert.match(confirmText,/^Cancellare dal database tutti i record \(\d+\)\? Non si può annullare\.$/);
 assert.equal(cancelledDeletes,0,'cancel sends no DELETE');assert.ok(countBefore>0);
 assert.equal(clientCleared.direct,0);assert.equal(clientCleared.counts.client,'0');assert.equal(clientCleared.notice,'Log del client web: log cancellati.');
 assert.equal(gamesCleared.direct,0);assert.equal(gamesCleared.counts.games,'0');
 assert.deepEqual(deletes(),['/rest/logs/client/web/delete 200','/rest/logs/back/games/delete 200']);
 assert.ok(archiveBefore>0);assert.equal(gamesCleared.matchEvents,archiveBefore,'match archive LOG003 untouched');
 assert.ok(ad.rest.every(r=>!r.path.includes('/client/web/')||r.method!=='POST'),'no error report from the admin page');

 // One session per account: the ADMIN leaves before the headed run logs in again.
 await logout(ad);await logout(bob);for(const p of [bob,ad])await p.context.close();

 // --- Native Basic prompt on a headed Edge (BM_NATIVE_PROMPT=1): captured, then answered from the keyboard ---
 if(process.env.BM_NATIVE_PROMPT==='1'){
  const W=1100,H=720,headed=await chromium.launch({channel:'msedge',headless:false,args:['--window-position=0,0',`--window-size=${W},${H}`,'--disable-features=Translate','--lang=it']});
  try{
  const page=await (await headed.newContext({viewport:null})).newPage();
  const statuses=[];page.on('response',r=>{if(new URL(r.url()).pathname.startsWith('/rest/logs'))statuses.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`);});
  await page.goto(`${url}#/accedi`);await page.bringToFront();
  await page.getByLabel('Nome').fill(admin.user);await page.getByLabel('Password').fill('local-alice');await page.getByRole('button',{name:'Siediti al tavolo'}).click();
  await page.getByTestId('quick').waitFor({timeout:15000});await page.getByTestId('tab-profile').click();
  await page.waitForTimeout(2500);
  const pending=await page.getByTestId('admin-loading').isVisible();
  // Only the Edge window region of the screen (it sits at 0,0): the dialog is drawn by the browser, not the page.
  const capture=name=>execFileSync('powershell',['-NoProfile','-Command',`Add-Type -AssemblyName System.Drawing;Add-Type 'using System.Runtime.InteropServices;public class D{[DllImport("user32.dll")]public static extern bool SetProcessDPIAware();}';[D]::SetProcessDPIAware()|Out-Null;$b=New-Object System.Drawing.Bitmap ${W-12},${H-16};$g=[System.Drawing.Graphics]::FromImage($b);$g.CopyFromScreen(0,0,0,0,$b.Size);$b.Save('${resolve(`${out}/screens/${name}`)}')`]);
  capture('profile-10-native-prompt-edge.png');
  // Windows gives the keyboard to the foreground window only: bring the test Edge (page title) forward first.
  const keys=k=>execFileSync('powershell',['-NoProfile','-Command',`Add-Type -AssemblyName System.Windows.Forms;$w=New-Object -ComObject WScript.Shell;$null=$w.AppActivate('Botte Micidiali');Start-Sleep -Milliseconds 400;[System.Windows.Forms.SendKeys]::SendWait('${k}')`]);
  // Cancel (Esc): the 401 reaches the page, which says "not authorized" and sends nothing else.
  keys('{ESC}');
  const cancelledShown=await page.getByTestId('admin-error').waitFor({timeout:15000}).then(()=>true,()=>false);
  const cancelMessage=cancelledShown?await page.getByTestId('admin-error').innerText():null;
  // "Riprova": the prompt again, with the keyboard focus on its user field; type the run's Basic credentials.
  step('nativePromptCancel',{pendingWhileShown:pending,cancelMessage,statuses:[...statuses]});
  await page.getByTestId('admin-retry').click();await page.waitForTimeout(2000);
  capture('profile-11-native-prompt-retry-edge.png');
  keys(`${basic.username}{TAB}${basic.password}`);
  // Enter on its own, once more if the window lost the foreground meanwhile (seen once: typed, Enter lost).
  const counted=ms=>page.getByTestId('count-client').filter({hasText:/^\d+$/}).waitFor({timeout:ms}).then(()=>true,()=>false);
  let enters=1;keys('{ENTER}');let answered=await counted(6000);
  if(!answered){enters++;keys('{ENTER}');answered=await counted(10000);}
  capture('profile-12-native-prompt-answered-edge.png');
  const native={pendingWhileShown:pending,cancelMessage,screenshot:'screens/profile-10-native-prompt-edge.png',answeredFromKeyboard:answered,enters,
   counts:answered?{games:await page.getByTestId('count-games').innerText(),client:await page.getByTestId('count-client').innerText()}:null,statuses};
  step('nativePromptEdge',native);
  assert.ok(pending,'the counts wait while the browser shows its prompt');
  assert.match(cancelMessage??'',/^Non autorizzato in questo ambiente/);assert.ok(answered,'counts after typing the credentials in the prompt');
  }finally{await headed.close().catch(()=>{});}
 }
 assert.deepEqual(evidence.errors,[],'no page errors besides the provoked ones');
 evidence.ok=true;
}catch(e){evidence.ok=false;evidence.failure=String(e?.stack??e);console.error(e);for(const p of pages)await p.page.screenshot({path:`${out}/screens/profile-failure-${p.name}${tag}.jpg`,type:'jpeg',quality:70}).catch(()=>{});}
finally{
 evidence.rest=Object.fromEntries(pages.map(p=>[p.name,p.rest]));
 await writeFile(`${out}/profile${tag}.json`,JSON.stringify(evidence,null,1).replaceAll(basic.password,'<basic password>'));
 await browser.close().catch(()=>{});
 await stopServer();
 await rm(data,{recursive:true,force:true}).catch(()=>{});
 if(!evidence.ok)process.exitCode=1;
}

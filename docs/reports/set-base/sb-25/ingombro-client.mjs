// SB-25 Fase B2, fit test in the client (D166 (2), D168 (2)): every card of the draft in the real inspection of the table, at the sizes
// asked (default 1366x768 and 844x390), first as the client shows it today, then with the flavour added under the text. The flavour is
// added only here, as a paragraph in the inspection, and removed after each measure: the client shows it for real in SB-31.
// Not a check of the client: a measure. Starts the jar with the profiles local,bozza on a temporary database (port 8080 free, jar built)
// and the built client with `vite preview` on BM_PORT (default 4327, so it does not clash with a Serve on 4320); plays nothing: it opens
// a quick 1vCom, opens the inspection of a card in hand, then shows each card of the catalog in that same dialog through the setter of
// the inspection state (React internals: measure only).
// Usage: node ingombro-client.mjs <repo> <out>. Env: BM_SIZES (default 1366x768,844x390), BM_SHOTS (bindings to capture, comma separated).
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,readFile,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [repo,out]=process.argv.slice(2);
if(!repo||!out)throw new Error('usage: node ingombro-client.mjs <repo> <out>');
const client=join(repo,'client-web');
const {chromium}=createRequire(join(client,'package.json'))('@playwright/test');
const PORT=Number(process.env.BM_PORT??4327),url=`http://127.0.0.1:${PORT}`,api='http://127.0.0.1:8080';
const SIZES=(process.env.BM_SIZES??'1366x768,844x390').split(',').map(s=>s.split('x').map(Number));
const SHOTS=(process.env.BM_SHOTS??'').split(',').filter(Boolean);
await mkdir(out,{recursive:true});
const say=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const toolchain=JSON.parse(await readFile(join(repo,'scripts/toolchain.json'),'utf8'));
const java=join(repo,'.tools',toolchain.tools.find(t=>t.name==='java').directory,'bin','java.exe');
const draft=JSON.parse((await readFile(join(repo,'server/src/test/resources/set-base/bozza.json'),'utf8')).replace(/^﻿/,''));
const flavour=Object.fromEntries(draft.cards.map(c=>[c.binding,(c.gui.flavour??'').trim()]));
const data=await mkdtemp(join(tmpdir(),'bm-sb25-ingombro-'));
const procs=[];let browser=null;
const timer=setTimeout(()=>{say('time limit');finish(1);},20*60*1000);

function start(cmd,args,opts,name){const l=createWriteStream(join(data,`${name}.log`),{flags:'a'}),p=spawn(cmd,args,{...opts,stdio:['ignore','pipe','pipe']});p.stdout.pipe(l);p.stderr.pipe(l);procs.push(p);return p;}
async function until(ok,ms,what){const end=Date.now()+ms;while(Date.now()<end){try{if(await ok())return;}catch{}await new Promise(r=>setTimeout(r,500));}throw new Error(`${what} did not start; logs in ${data}`);}
async function finish(code){
 clearTimeout(timer);
 try{await browser?.close();}catch{}
 for(const p of procs)if(p.exitCode===null){try{execFileSync('taskkill',['/PID',String(p.pid),'/T','/F'],{stdio:'ignore'});}catch{}}
 process.exit(code);
}

// In the page: the inspection state of the Table component, found from the open dialog through the React fiber.
const HOOK=`(()=>{const d=document.querySelector('dialog[open]');const k=Object.keys(d).find(k=>k.startsWith('__reactFiber$'));let f=d[k];
 while(f&&!(f.memoizedProps&&f.memoizedProps.session&&f.memoizedProps.model))f=f.return;if(!f)throw new Error('Table not found');
 let h=f.memoizedState;while(h&&h.memoizedState!=='inspect')h=h.next;if(!h||!h.next)throw new Error('modal hook not found');
 return {session:f.memoizedProps.session,setInspection:h.next.queue.dispatch};})()`;

async function measure(page,binding,text){
 return page.evaluate(async([HOOK,binding,text])=>{
  const {session,setInspection}=eval(HOOK),card=session.catalog.find(c=>c.bindingName===binding);
  setInspection({title:card.name,card});
  for(let i=0;i<3;i++)await new Promise(r=>requestAnimationFrame(r));
  const d=document.querySelector('dialog[open]'),full=d.querySelector('.full-text'),h2=d.querySelector('.receipt h2');
  if(!full||h2.textContent!==card.name)throw new Error(`inspection not updated for ${binding}`);
  const lines=e=>Math.round(e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight));
  const cs=getComputedStyle(d),view=parseFloat(cs.maxHeight)-parseFloat(cs.borderTopWidth)-parseFloat(cs.borderBottomWidth)-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const before={scroll:d.scrollHeight,client:d.clientHeight,view:Math.round(view),textHeight:Math.round(full.getBoundingClientRect().height),textLines:lines(full)};
  let after=null;
  if(text){const p=document.createElement('p');p.className='full-text-flavour-probe';p.textContent=text;p.style.fontStyle='italic';full.after(p);
   after={scroll:d.scrollHeight,client:d.clientHeight,flavourHeight:Math.round(p.getBoundingClientRect().height),flavourLines:lines(p),
    blockHeight:Math.round(p.getBoundingClientRect().bottom-full.getBoundingClientRect().top)};
   p.remove();}
  return {name:card.name,before,after,symbols:full.querySelectorAll('.effect-resource').length,damage:full.querySelectorAll('.effect-damage').length,raw:/\[\[/.test(full.textContent)};
 },[HOOK,binding,text]);
}

async function main(){
 start(java,['-jar','target/bm-server-0.0.1-SNAPSHOT.jar','--spring.profiles.active=local,bozza','--app.dev.seed-accounts=true'],
  {cwd:join(repo,'server'),env:{...process.env,BM_DATABASE_PATH:join(data,'bm-bozza.sqlite')}},'server');
 await until(async()=>(await fetch(`${api}/api/rest/v1/sign-in/validate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})})).ok,120000,'server');
 start(process.execPath,[join(client,'node_modules/vite/bin/vite.js'),'preview','--strictPort'],{cwd:client,env:{...process.env,BM_PORT:String(PORT)}},'preview');
 await until(async()=>(await fetch(url)).ok,60000,'preview');
 say('server and preview up',data);
 browser=await chromium.launch({channel:'msedge'});
 const result={draft:{version:draft.set.version},sizes:{}};
 for(const [W,H] of SIZES){
  const size=`${W}x${H}`,context=await browser.newContext({viewport:{width:W,height:H},reducedMotion:'reduce'}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`${url}#/accedi`);
  // One account per size: the quick game of the first size is still open for its account.
  const [user,pass]=[['devAlice','local-alice'],['devBob','local-bob'],['devCarol','local-carol']][SIZES.findIndex(s=>s[0]===W&&s[1]===H)%3];
  await page.getByLabel('Nome').fill(user);await page.getByLabel('Password').fill(pass);
  await page.getByRole('button',{name:'Siediti al tavolo'}).click();
  await page.getByTestId('quick').waitFor({timeout:15000});await page.getByTestId('quick').click();
  await page.waitForFunction(()=>window.__bm?.state?.order?.length>0,null,{timeout:60000});
  const key=await page.evaluate(()=>window.__bm.state.order[0].key);
  await page.locator(`[data-hit="${key}"]`).focus();await page.keyboard.press('i');
  await page.locator('section.inspection').waitFor({timeout:5000});
  const bindings=await page.evaluate(HOOK=>eval(HOOK).session.catalog.map(c=>c.bindingName),HOOK);
  const cards=[];
  for(const b of bindings){
   const m=await measure(page,b,flavour[b]);cards.push({binding:b,...m});
   if(SHOTS.includes(b)){
    // The capture shows the flavour as the test adds it, with the text scrolled into view; then the probe goes away.
    await page.evaluate(text=>{const full=document.querySelector('dialog[open] .full-text'),p=document.createElement('p');p.className='full-text-flavour-probe';
     p.textContent=text;p.style.fontStyle='italic';full.after(p);full.scrollIntoView({block:'start'});},flavour[b]);
    await page.screenshot({path:join(out,`${size}-${b.split('.').pop()}.png`)});
    await page.evaluate(()=>document.querySelector('.full-text-flavour-probe')?.remove());}
  }
  // The inspection is a dialog that scrolls (costs, priority, damage, role, target above the text): it scrolls for almost every card
  // already today, so «does not scroll» is not the criterion. Fits: the text, and the text with the flavour under it, are read in one
  // view of the dialog (their height within the inner height the dialog can reach: max-height less borders and padding), never split by the scroll.
  const fit=c=>c.before.textHeight<=c.before.view,fitWith=c=>!c.after||c.after.blockHeight<=c.before.view;
  const margin=c=>c.before.view-(c.after?c.after.blockHeight:c.before.textHeight);
  result.sizes[size]={cards:cards.length,errors,view:cards[0]?.before.view,
   scrollToday:cards.filter(c=>c.before.scroll>c.before.client).length,
   textOutOfView:cards.filter(c=>!fit(c)).map(c=>c.binding),withFlavourOutOfView:cards.filter(c=>!fitWith(c)).map(c=>c.binding),
   minMargin:Math.min(...cards.map(margin)),tightest:[...cards].sort((a,b)=>margin(a)-margin(b)).slice(0,5).map(c=>({binding:c.binding,name:c.name,margin:margin(c)})),
   raw:cards.filter(c=>c.raw).map(c=>c.binding),damageDrawn:cards.reduce((n,c)=>n+c.damage,0),
   items:cards.map(c=>({binding:c.binding,name:c.name,view:c.before.view,textHeight:c.before.textHeight,textLines:c.before.textLines,
    blockHeight:c.after?.blockHeight??null,flavourLines:c.after?.flavourLines??null,scroll:c.before.scroll,client:c.before.client,damage:c.damage}))};
  const r=result.sizes[size];
  say(size,`${cards.length} cards, inner view ${r.view}px, scroll today ${r.scrollToday}, text out of view ${r.textOutOfView.length}, with flavour ${r.withFlavourOutOfView.length}, min margin ${r.minMargin}px, errors ${errors.length}`);
  await context.close();
 }
 await writeFile(join(out,'ingombro-client.json'),JSON.stringify(result));
}
main().then(()=>finish(0),e=>{console.error(e);finish(1);});

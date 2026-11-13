// Real -Bozza smoke and M5 dialog capture, isolated SQLite. Usage: Node 24 capture.mjs E:/bm <out>.
// Requires a rebuilt jar and client Serve on 4320; no other verification on 8080.
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const [repo,out]=process.argv.slice(2),{chromium}=createRequire(join(repo,'client-web/package.json'))('@playwright/test');
await mkdir(out,{recursive:true});const data=await mkdtemp(join(tmpdir(),'bm-sb16g2b1-'));
const log={data,command:'./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Pool starter-gigi -Com starter-spazienzio -Bot prudente',games:[],errors:[]};
const server=spawn('powershell.exe',['-NoProfile','-File',join(repo,'scripts/dev.ps1'),'-Task','Server','-Bozza','-SeedAccounts',
 '-Pool','starter-gigi','-Com','starter-spazienzio','-Bot','prudente'],{cwd:repo,windowsHide:true,env:{...process.env,BM_DATABASE_PATH:join(data,'bozza.sqlite')}});
const stream=createWriteStream(join(data,'server.log'));server.stdout.pipe(stream);server.stderr.pipe(stream);
let browser;const limit=setTimeout(()=>finish(1),600000);
async function finish(code){clearTimeout(limit);await writeFile(join(out,'captures.json'),JSON.stringify(log));try{await browser?.close();}catch{}
 try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{}process.exit(code);}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){
 let started=false;for(let i=0;i<240;i++){if(server.exitCode!==null)throw Error('Server exited');
  try{const r=await fetch('http://127.0.0.1:8080/api/rest/v1/sign-in/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'devAlice',password:'local-alice'})});if(r.ok){started=true;break;}}catch{}await pause(500);}
 if(!started)throw Error('Startup timeout');log.started=true;
 browser=await chromium.launch({channel:'msedge'});const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 page.on('pageerror',e=>log.errors.push(String(e)));const state=()=>page.evaluate(()=>window.__bm?.state??null);
 async function wait(pred,ms=30000){const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(pred(s))return s;await pause(100);}throw Error('UI timeout');}
 const activate=async id=>{await page.locator(`[data-hit="${id}"]`).evaluate(e=>e.click());await pause(80);};
 const esc=async()=>{await page.keyboard.press('Escape');await pause(80);};
 await page.goto('http://127.0.0.1:4320/#/accedi');await page.getByLabel('Nome').fill('devAlice');await page.getByLabel('Password').fill('local-alice');
 await page.getByRole('button',{name:'Siediti al tavolo'}).click();await page.getByTestId('quick').waitFor();
 await page.getByRole('radio',{name:'Contro il computer'}).click();
 for(let game=0;game<8;game++){
  if(game){const again=page.getByTestId('again');if(await again.isVisible())await again.click();else{await page.getByRole('button',{name:'Apri menu'}).click();await page.getByRole('button',{name:'Abbandona la partita',exact:true}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();await page.getByTestId('quick').click();}}
  else await page.getByTestId('quick').click();
  await wait(s=>s&&s.phase==='choose'&&s.hits.some(h=>h.kind==='hand')&&!s.sequence.running);
  for(let turn=0;turn<26;turn++){
   const s=await wait(s=>s&&(s.over||s.eliminated||(s.phase==='choose'&&!s.sequence.running)));
   if(s.over||s.eliminated)break;
   log.games.push({game,turn:s.turn,commands:s.commands});
   const revealed=s.hits.find(h=>h.kind==='hand'&&/scoperta/.test(h.label)&&/Lavoro fatto bene/.test(h.label));
   const bound=s.order.find(c=>/Una stretta e passa|Colpo di cacciavite/.test(c.name));
   if(revealed&&bound){
    await activate(bound.key);const me=(await state()).hits.find(h=>h.kind==='person'&&h.target?.owner===s.me);await activate(me.id);await activate(revealed.id);
    await page.getByTestId('confirm').click();await page.getByTestId('discard-warning').waitFor({timeout:5000});
    if((await state()).commands!==s.commands)throw Error('Warning already sent a command');
    log.warning=await page.getByTestId('discard-warning').innerText();
    await page.screenshot({path:join(out,'warning-desktop.jpg'),type:'jpeg',quality:85});
    await page.setViewportSize({width:844,height:390});await pause(300);await page.screenshot({path:join(out,'warning-phone.jpg'),type:'jpeg',quality:85});
    await esc();if((await state()).commands!==s.commands)throw Error('Cancel sent a command');
    await page.getByTestId('confirm').click();await page.getByRole('button',{name:'Sì, scarta e gioca'}).click();
    const next=await wait(x=>x&&(x.turn!==s.turn||x.over));
    if(next.commands!==s.commands+1)throw Error('Confirmation did not send exactly once');
    log.after={turn:next.turn,commands:next.commands,token:next.hits.filter(h=>h.kind==='status'&&h.id.includes('-vu-')),revealed:next.hits.filter(h=>/scoperta/.test(h.label))};
    log.ok=true;return;
   }
   let done=false;
   const order=[...s.order].sort((a,b)=>(a.name==='Preparo il lavoro'?-1:/Lavoro fatto bene/.test(a.name)?1:0)-(b.name==='Preparo il lavoro'?-1:/Lavoro fatto bene/.test(b.name)?1:0));
   for(const card of order){
    await activate(card.key);let now=await state();
    for(const target of now.hits.filter(h=>h.kind==='item'||h.kind==='person')){
     if((await state()).selected!==card.key)await activate(card.key);
     await activate(target.id);if((await state()).target)break;
    }
    now=await state();if(!now.target){await esc();continue;}
    if(now.message.includes('scartare'))for(const c of now.order.filter(c=>c.key!==card.key&&!/Lavoro fatto bene/.test(c.name))){await activate(c.key);if((await state()).discard)break;}
    if(!await page.getByTestId('confirm').isEnabled()){await esc();continue;}
    await page.getByTestId('confirm').click();
    if(await page.getByTestId('discard-warning').isVisible()){await esc();await esc();continue;}
    const r=await wait(x=>x&&(x.turn!==s.turn||x.over||x.phase==='pending'||x.message.startsWith('Rifiutata')));
    if(r.message.startsWith('Rifiutata')){await esc();continue;}done=true;break;
   }
   if(!done)throw Error('No move sent');await wait(x=>x&&(x.turn!==s.turn||x.over));
  }
 }
 throw Error('No last-copy warning reached');
}
main().then(()=>finish(0),e=>{log.error=String(e.stack??e);finish(1);});

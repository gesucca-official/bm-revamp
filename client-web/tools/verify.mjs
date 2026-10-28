// C1 end-to-end check against the REAL local server (not fixtures):
// login → quick 1vCom → full games until the outcome → new game, for both characters.
// Prerequisites: ./scripts/dev.ps1 -Task Server -SeedAccounts and ./client-web/run.ps1 -Task Serve.
// Moves are chosen by trying cards and targets through the UI; the server decides legality.
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const url=process.env.BM_CLIENT??'http://127.0.0.1:4320';
const user=process.env.BM_USER??'devAlice',password=process.env.BM_PASSWORD??'local-alice';
const out=process.env.BM_OUT??'../docs/reports/client-c2';
await mkdir(`${out}/screens`,{recursive:true});
// C2a: the regulation annex is the reference for roles and gains (R07a), compared by display name.
const annex=JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8'));
const catalogByName=new Map(annex.cards.map(c=>[c.name,c]));
const c2a={outsideDeselect:null,status:null,turnsChecked:0,cardsChecked:0,rolesSeen:{},unpayableSeen:0,unpayableDimmed:0,boardChecks:0,hover:null,unpayableSend:null,layout:null};
const evidence={date:new Date().toISOString(),url,user,kind:'automated browser run on PC (Edge via Playwright) against the local server; not a physical device',games:[],checks:{},rejections:[],periodic:[],noValidMove:[],errors:[]};
const browser=await chromium.launch({channel:'msedge',headless:process.env.BM_HEADED!=='1'});
const [vw,vh]=(process.env.BM_VIEWPORT??'1366x768').split('x').map(Number),tag=process.env.BM_VIEWPORT?`-${process.env.BM_VIEWPORT}`:'';
const page=await browser.newPage({viewport:{width:vw,height:vh}});evidence.viewport={width:vw,height:vh};
page.on('pageerror',e=>evidence.errors.push(String(e)));
// Only a SEND to /app/game/{id}/move is a move; SUBSCRIBE to the /move topic is not.
// SockJS frames are JSON strings, so the STOMP newline may appear escaped (\\n) or raw.
const isMove=f=>/SEND(\\n|\n)destination:\/app\/game\/[^/\\\n]+\/move(\\n|\n)/.test(f);
const moves=[],frames=[];const frame=(dir,p)=>{const t=String(p).replace(/passcode:[^\\\n"]*/g,'passcode:***');frames.push(`${dir} ${t.slice(0,160)}`);if(frames.length>40)frames.shift();};
page.on('websocket',ws=>{ws.on('framesent',f=>{const s=String(f.payload);frame('>',s);if(isMove(s))moves.push(Date.now());});ws.on('framereceived',f=>frame('<',f.payload));});
process.on('exit',c=>{if(c)console.error(frames.join('\n'));});
// SockJS may fall back to xhr_send; count those frames too.
page.on('request',r=>{if(r.url().includes('xhr_send')&&isMove(r.postData()||''))moves.push(Date.now());});
const state=()=>page.evaluate(()=>window.__bm?.state??null);
const wait=async(pred,ms=15000,what='condition')=>{const end=Date.now()+ms;while(Date.now()<end){const s=await state();if(await pred(s))return s;await page.waitForTimeout(100);}throw new Error(`Timeout: ${what}`);};
const shot=async name=>page.screenshot({path:`${out}/screens/${name}${tag}.jpg`,type:'jpeg',quality:70});
// Box test with a margin (rotation ignored): enough to keep presses off other cards.
const inside=(pt,h,m)=>Math.abs(pt.x-h.x)<h.w/2+m&&Math.abs(pt.y-h.y)<h.h/2+m;
// Hand cards: the left part stays visible where the fan overlaps (C2a), so press there. With three
// items per side (Tossico against Tossico) an item can cover that point: then try another visible spot.
const grip=(h,hits)=>{for(const dy of [0,.25,.38,-.15])for(const dx of [-.22,-.32,-.12]){const pt={x:h.x+h.w*dx,y:h.y+h.h*dy};if(!hits.some(o=>o.kind!=='hand'&&inside(pt,o,4)))return pt;}return {x:h.x-h.w*.22,y:h.y};};
const center=(h,hits=[])=>h.kind==='hand'?grip(h,hits):{x:h.x,y:h.y};
// An empty spot on the felt: a grid away from the brand, the top controls and the resource board.
const emptySpot=hits=>{for(let b=.3;b<=.72;b+=.04)for(let a=.25;a<=.85;a+=.03){const pt={x:vw*a,y:vh*b};if(!hits.some(h=>inside(pt,h,12)))return pt;}return null;};
const tap=async h=>{const p=center(h,h.kind==='hand'?(await state())?.hits??[]:[]);await page.mouse.click(p.x,p.y);await page.waitForTimeout(60);};
async function drag(from,to,snapshot){await page.mouse.move(from.x,from.y);await page.mouse.down();const steps=14;for(let i=1;i<=steps;i++){await page.mouse.move(from.x+(to.x-from.x)*i/steps,from.y+(to.y-from.y)*i/steps);await page.waitForTimeout(16);}
 const mid=await state();if(snapshot)await shot(snapshot);await page.mouse.up();await page.waitForTimeout(80);return mid;}

// Login and hub.
await page.goto(url);
await page.getByLabel('Nome').fill(user);await page.getByLabel('Password').fill(password);
await page.getByRole('button',{name:'Siediti al tavolo'}).click();
// A previous interrupted run may be resumed by the server: then the table appears directly.
await page.waitForFunction(()=>document.querySelector('[data-testid=quick]')||window.__bm||document.querySelector('.problem'),null,{timeout:15000});
const problem=(await page.locator('.problem').count())?await page.locator('.problem').first().textContent():null;if(problem){await shot('00-login-problem');throw new Error(`Login: ${problem}`);}
const resumed=!(await page.getByTestId('quick').isVisible().catch(()=>false));evidence.checks.resumedAtStart=resumed;if(!resumed)await shot('01-hub');
evidence.checks.login='hub reached after REST validate, STOMP CONNECT, resume and profile';

// O11–O14 on every turn: computed independently here from the private view the page received.
async function checkC2a(s){
 const r=s.readout,res=s.resources;assert.ok(r&&r.board,'C2a readout present');
 const minHand=vh<550?120:210,minPerson=vh<550?80:150;
 assert.ok(r.layout.hand.w>=minHand-1&&r.layout.person.w>=minPerson-1,`O12 sizes ${JSON.stringify(r.layout)}`);c2a.layout=r.layout;
 for(const k of ['HEALTH','ALERTNESS','VIOLENCE','TOXICITY','ALCOHOL'])assert.ok(r.board.rows.includes(`${{HEALTH:'H',ALERTNESS:'A',VIOLENCE:'V',TOXICITY:'T',ALCOHOL:'L'}[k]} ${res[k]??0}`),`O13 board shows ${k}`);
 c2a.boardChecks++;
 for(const card of s.cards){const shown=r.hand.find(h=>h.key===card.key);assert.ok(shown,'card drawn');
  const payable=Object.entries(card.cost).every(([k,v])=>(res[k]??0)>=v);
  assert.equal(shown.payable,payable,`O11 ${card.name}`);if(!payable){c2a.unpayableSeen++;assert.ok(shown.alpha<1,'O11 dimmed');c2a.unpayableDimmed++;}else if(!s.selected)assert.equal(shown.alpha,1,'payable not dimmed');
  const ref=catalogByName.get(card.name);assert.ok(ref,`catalog has ${card.name}`);
  assert.equal(card.role,ref.role,`O14 role from server for ${card.name}`);assert.equal(shown.role,ref.role);assert.equal(card.gains,ref.gains);
  assert.equal(shown.gains.join(', '),ref.gains==='—'?'':ref.gains,`O13 gains for ${card.name}`);
  c2a.rolesSeen[ref.role]=(c2a.rolesSeen[ref.role]||0)+1;c2a.cardsChecked++;}
 c2a.turnsChecked++;
}
const want={characters:new Set(),bound:false,item:false,drag:false,tap:false,reorder:false,rejection:false,periodic:false};
const sel=async key=>{const s=await state();const h=s.hits.find(x=>x.id===key);await tap(h);};
async function cancel(){await page.keyboard.press('Escape');await page.waitForTimeout(60);}

async function playTurn(game){
 let s=await wait(x=>x&&x.hits.some(h=>h.kind==='hand')&&(x.over||x.phase==='choose'||x.message.startsWith('Sei fuori')),20000,'choose phase');
 if(s.over||s.message.startsWith('Sei fuori'))return false;
 const turn=s.turn,hand=s.order;await checkC2a(s);
 // O12: hovering a covered card lifts it whole (larger hit than the resting card).
 if(!c2a.hover&&hand.length>=3){const h=s.hits.find(x=>x.id===hand[1].key);await page.mouse.move(center(h).x,h.y+h.h*.3);await page.waitForTimeout(150);const after=await state();const lifted=after.hits.find(x=>x.id===hand[1].key);
  c2a.hover={restingH:Math.round(h.h),hoverH:Math.round(lifted.h),raised:lifted.h>h.h};assert.ok(lifted.h>h.h,'O12 hover lifts the card');await shot('08-c2a-hover');await page.mouse.move(5,5);await page.waitForTimeout(100);s=await state();}
 if(!evidence.c2aTable){evidence.c2aTable=true;await shot('08-c2a-table');}
 // Owner feedback: a tap or click anywhere else lowers the raised card and drops the choice.
 if(!c2a.outsideDeselect&&hand.length){await sel(hand[0].key);const chosen=await state();
  const free=emptySpot(chosen.hits);
  assert.ok(free,'an empty spot on the table');await page.mouse.click(free.x,free.y);await page.waitForTimeout(100);const after=await state();
  const card=after.hits.find(x=>x.id===hand[0].key),resting=chosen.hits.find(x=>x.id===hand[0].key);
  assert.equal(chosen.selected,hand[0].key);assert.equal(after.selected,null,'deselected');assert.ok(card.h<resting.h,'back to rest');
  c2a.outsideDeselect={selectedBefore:true,selectedAfter:false,raisedH:Math.round(resting.h),restH:Math.round(card.h)};s=after;}
 // Statuses: chips on the character card; hover and tap open a short summary.
 const chip=s.hits.find(x=>x.kind==='status');
 if(chip&&!c2a.status){await page.mouse.move(chip.x,chip.y);const tip=page.getByTestId('status-tip');await tip.waitFor({timeout:3000});const hoverText=await tip.innerText();await shot('08-c2a-status');
  await page.mouse.move(5,5);await tip.waitFor({state:'detached',timeout:3000});
  await page.mouse.click(chip.x,chip.y);await tip.waitFor({timeout:3000});const tapText=await tip.innerText();
  const free=emptySpot(s.hits);assert.ok(free,'an empty spot on the table');await page.mouse.click(free.x,free.y);await tip.waitFor({state:'detached',timeout:3000});
  c2a.status={chip:chip.label,hoverText,tapOpens:tapText===hoverText,closedElsewhere:true};s=await state();}
 const persons=s.hits.filter(h=>h.kind==='person'),items=s.hits.filter(h=>h.kind==='item');
 // Reorder once by dragging inside the fan: local only, no SEND.
 if(!want.reorder&&hand.length>=3){const before=s.order.map(c=>c.key),sent=moves.length,a=s.hits.find(h=>h.id===before[0]),b=s.hits.find(h=>h.id===before.at(-1));
  const mid=await drag(center(a,s.hits),{x:b.x+20,y:b.y+b.h*.25},'02-reorder-mid-drag');const after=await state();
  assert.equal(moves.length,sent,'reorder must not send');assert.equal(after.commands,s.commands);assert.notDeepEqual(after.order.map(c=>c.key),before);
  assert.ok(mid.drag?.moved,'card lifted while dragging');want.reorder=true;evidence.checks.reorder={before:before.length,firstMovedTo:after.order.findIndex(c=>c.key===before[0]),sendsDuring:0,dragMoved:mid.drag.moved};await shot('02-after-reorder');s=after;
  // Transport drop from the diagnostics, then explicit rejoin: same game and hand order, nothing resent.
  const sentBefore=moves.length,order=after.order.map(c=>c.key);
  await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Strumenti'}).click();await page.getByRole('button',{name:'Simula disconnessione'}).click();
  await page.getByRole('button',{name:'Rientra'}).waitFor({timeout:10000});await shot('02-lost');
  await page.getByRole('button',{name:'Rientra'}).click();
  s=await wait(x=>x&&x.phase==='choose',15000,'rejoined');
  await page.locator('.overlay').waitFor({state:'detached',timeout:15000});s=await state();
  assert.equal(s.turn,turn);assert.deepEqual(s.order.map(c=>c.key),order);assert.equal(moves.length,sentBefore,'no automatic resend after rejoin');
  evidence.checks.rejoin={sameTurn:true,handOrderKept:true,sendsDuringRejoin:0};
  // O1: no reorder or details buttons. O5: (i) on hover and on the selected card opens the details.
  assert.equal(await page.getByRole('button',{name:/^(Riordina|Dettagli carta)$/}).count(),0,'O1/O5: old buttons removed');
  const card=s.hits.find(h=>h.kind==='hand'&&h.id===s.order[1].key);
  await page.mouse.move(center(card).x,center(card).y);await page.getByTestId('info').waitFor({timeout:3000});await shot('02-info-hover');
  await page.getByTestId('info').click();await page.locator('dialog .inspection').waitFor({timeout:3000});await shot('02-inspect-art');
  const title=await page.locator('dialog .receipt h2').innerText();await page.keyboard.press('Escape');await page.locator('dialog[open]').waitFor({state:'detached',timeout:3000}).catch(()=>{});
  assert.equal(title,s.order[1].name,'hover (i) opens the hovered card');
  await page.mouse.move(5,5);await tap(card);s=await state();assert.equal(s.selected,card.id);
  await page.getByTestId('info').waitFor({timeout:3000});await page.getByTestId('info').click();await page.locator('dialog .inspection').waitFor({timeout:3000});
  const selectedTitle=await page.locator('dialog .receipt h2').innerText();await page.keyboard.press('Escape');await page.waitForTimeout(150);await cancel();
  assert.equal(selectedTitle,s.order[1].name,'(i) on the selected card');
  // Keyboard reorder: Shift+ArrowRight moves the focused hand card one slot, local only.
  s=await state();const keysBefore=s.order.map(c=>c.key),sentKeys=moves.length;
  await page.locator(`[data-hit="${keysBefore[0]}"]`).focus();await page.keyboard.press('Shift+ArrowRight');await page.waitForTimeout(100);
  s=await state();assert.deepEqual(s.order.map(c=>c.key).slice(0,2),[keysBefore[1],keysBefore[0]]);assert.equal(moves.length,sentKeys,'keyboard reorder must not send');
  await page.locator(`[data-hit="${keysBefore[0]}"]`).blur();
  evidence.checks.o1o5={oldButtons:0,infoOnHover:true,infoOnSelected:true,keyboardReorder:true,sendsDuring:0};}
 // Candidate plans: try bound, item targets and rejections first when still missing.
 const cards=s.order.map(c=>({key:c.key,name:c.name}));
 let order=[...cards].sort(()=>Math.random()-.5);
 // O11: once, send a dimmed card on purpose. It must stay sendable and the server must judge it.
 const dimmed=s.readout.hand.filter(h=>!h.payable).map(h=>h.key);
 if(!c2a.unpayableSend&&dimmed.length){order=[...order.filter(c=>dimmed.includes(c.key)),...order.filter(c=>!dimmed.includes(c.key))];if(!evidence.c2aDimShot){evidence.c2aDimShot=true;await shot('08-c2a-unpayable');}}
 for(const card of order){
  s=await state();if(s.turn!==turn||s.over)return true;
  await sel(card.key);s=await state();if(s.selected!==card.key){continue;}
  const targets=[...(want.item?[]:items),...persons.filter(p=>!p.id.endsWith(s.me)),...persons,...items];
  let aimed=null;
  for(const t of targets){const h=(await state()).hits.find(x=>x.id===t.id);if(!h)continue;
   const useDrag=!want.drag&&!aimed;
   if(useDrag){await cancel();const c=(await state()).hits.find(x=>x.id===card.key);const mid=await drag(center(c,(await state()).hits),center(h),'02-play-mid-drag');const after=await state();if(after.target){aimed={t,how:'drag'};evidence.checks.dragFollow={ghostOverTargetDuringDrag:mid.ghostOver,dragMoved:mid.drag?.moved};break;}await sel(card.key);continue;}
   // A tap on a table element that is not an admitted target drops the choice: choose the card again.
   if((await state()).selected!==card.key)await sel(card.key);
   await tap(h);const after=await state();if(after.target){aimed={t,how:'tap'};break;}}
  if(!aimed){await cancel();continue;}
  s=await state();
  const bound=s.message.includes('scartare');
  if(bound){const regular=s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key);let ok=false;for(const r of regular){await tap(r);if((await state()).discard){ok=true;break;}}if(!ok){await cancel();continue;}}
  if(!(await page.getByTestId('confirm').isEnabled())){await cancel();continue;}
  const sent=moves.length;
  if(bound&&!want.bound)await shot('03-bound-discard');
  await page.getByTestId('confirm').click();
  s=await wait(x=>x.over||x.turn!==turn||x.phase==='pending'||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'server answer');
  assert.equal(moves.length-sent,1,'exactly one SEND per confirmation');
  if(s.phase==='choose'&&s.message.startsWith('Rifiutata')&&s.turn===turn){
   evidence.rejections.push({turn,card:card.name,message:s.message,choiceKept:!!s.selected&&!!s.target});want.rejection=true;
   if(dimmed.includes(card.key)&&!c2a.unpayableSend)c2a.unpayableSend={card:card.name,sent:true,serverAnswer:s.message,choiceKept:!!s.selected&&!!s.target};
   if(evidence.rejections.length===1)await shot('04-rejection');
   await cancel();continue;}
  assert.ok(!(dimmed.includes(card.key)&&!s.over&&s.phase==='pending'),'a dimmed card was accepted: client and server disagree on costs');
  const cmd=s.lastCommand;game.moves.push({turn,card:cmd.playedCardName,target:cmd.targetId,choices:cmd.choices,how:aimed.how});
  if(aimed.how==='drag')want.drag=true;else want.tap=true;
  if(cmd.choices?.DISCARD_ONE){want.bound=true;evidence.checks.bound=cmd;}
  if(cmd.choices?.TARGET_ITEM){want.item=true;evidence.checks.item=cmd;}
  return true;
 }
 evidence.noValidMove.push({turn,hand:cards.map(c=>c.name)});return 'stuck';
}

if(!resumed)await page.getByTestId('quick').click();
else if((await state())?.over){await page.getByTestId('again').click();}
for(let g=0;g<8&&(want.characters.size<2||!want.bound||!want.item||!want.periodic||!want.drag||!want.tap);g++){
 await wait(x=>x&&!x.over&&x.hits.some(h=>h.id===`person-${x.me}`),20000,'new game view');
 const me=await page.evaluate(()=>window.__bm.state.me);
 const game={index:g+1,me,moves:[],started:new Date().toISOString()};
 const character=await page.evaluate(()=>{const s=window.__bm.state;return s.hits.find(h=>h.id===`person-${s.me}`)?.label;});
 game.character=character;
 // The opponent matters for the layout: Tossico against Tossico puts six items on the table.
 game.opponent=await page.evaluate(()=>{const s=window.__bm.state;return s.hits.find(h=>h.kind==='person'&&h.id!==`person-${s.me}`)?.label;});
 for(let t=0;t<80;t++){
  const r=await playTurn(game);
  // Periodic effects: read them from the non-blocking report when the server published any.
  const eot=await page.evaluate(()=>{const b=document.querySelector('.toast');return b?.textContent||'';});
  if(eot.includes('fine turno')&&!want.periodic){await page.locator('.toast').click();await page.getByRole('heading',{name:'Fine turno'}).waitFor({timeout:3000});
   const text=await page.locator('dialog').innerText();evidence.periodic.push({game:g+1,text:text.slice(text.indexOf('Fine turno'),text.indexOf('Fine turno')+300)});want.periodic=true;await shot('05-periodic-report');await page.keyboard.press('Escape');}
  if(r==='stuck'){game.stuck=true;await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();break;}
  const s=await state();if(!s||s.over)break;
 }
 const end=await state();
 if(end?.stats?.inputMs)evidence.inputSamples=(evidence.inputSamples||[]).concat(end.stats.inputMs);
 if(end&&end.over){game.outcome={winner:end.winner,me:end.me,message:end.message};await page.locator('.outcome').waitFor();if(g<2)await shot(`06-outcome-${g+1}`);
  const outcomeText=await page.locator('.outcome').innerText();game.outcomeText=outcomeText;
  want.characters.add(character.split(', ')[1]);}
 game.ended=new Date().toISOString();evidence.games.push(game);
 console.log(JSON.stringify({game:game.index,character:game.character,opponent:game.opponent,moves:game.moves.length,outcome:game.outcome,stuck:!!game.stuck}));
 if(end?.over)await page.getByTestId('again').click();
 else await page.getByTestId('quick').click();
 await page.waitForTimeout(300);
}
// Back to the hub without JSON: leave after the outcome.
evidence.want={...want,characters:[...want.characters]};evidence.checks.c2a=c2a;delete evidence.c2aTable;delete evidence.c2aDimShot;
assert.ok(c2a.turnsChecked>0&&c2a.hover?.raised,'C2a checks ran');
const s=await wait(x=>x&&!x.over,20000,'last game view');
if(s){await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Abbandona la partita'}).click();await page.getByRole('button',{name:'Sì, abbandona'}).click();}
await page.getByTestId('quick').waitFor({timeout:15000});evidence.checks.hubReturn='hub visible after leave acknowledgement';await shot('07-hub-return');
await page.getByRole('button',{name:'Esci'}).click();await page.getByLabel('Nome').waitFor();
const ms=[...(evidence.inputSamples||[])].sort((a,b)=>a-b),pct=p=>ms[Math.min(ms.length-1,Math.floor(ms.length*p))]??null;
evidence.inputMs={note:'PC headless/headed Edge, input to next frame; not the iPhone measure',samples:ms.length,p50:pct(.5),p95:pct(.95),max:ms.at(-1)??null};delete evidence.inputSamples;
await writeFile(`${out}/verify${tag}.json`,JSON.stringify(evidence,null,2));
await browser.close();
console.log(JSON.stringify(evidence.want));
assert.equal(evidence.errors.length,0,evidence.errors.join('\n'));

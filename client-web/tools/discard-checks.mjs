// O26: exercise the real hand, through keyboard and canvas taps. Expectations come
// from the regulation annex, not from the presentation helper under test.
import {readFile} from 'node:fs/promises';
const annex=JSON.parse(await readFile(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8'));
const catalog=new Map(annex.cards.map(c=>[c.name,c]));
const bound=c=>catalog.get(c.name)?.subtype==='Legata al personaggio';
const regular=c=>catalog.get(c.name)?.subtype==='Regolare';
export async function discardPass(p,shot){
 const {page}=p,errors=[],samples=[];
 const escape=async()=>{await page.keyboard.press('Escape');await page.evaluate(()=>document.activeElement?.blur());await page.mouse.move(2,2);await page.waitForTimeout(80);};
 const choose=async key=>{await page.locator(`[data-hit="${key}"]`).focus();await page.keyboard.press('Enter');await page.waitForTimeout(80);};
 const check=(s,active,label)=>{
  const H=s.layout.hand,selected=s.hits.find(h=>h.id===s.selected);
  for(const c of s.cards){const r=s.readout.hand.find(h=>h.key===c.key),h=s.hits.find(h=>h.id===c.key),payable=Object.entries(c.cost).every(([k,v])=>(s.resources[k]??0)>=v);
   if(c.key===s.selected&&s.target){
    if(!r.inPreview||h?.kind!=='preview'||r.face!==null||s.hits.some(h=>h.kind==='hand'&&h.id===c.key))errors.push(`${label}: selected card still drawn/hit in hand`);
    continue;
   }
   const no=active&&!regular(c),alpha=no?.55:payable?1:.66;
   if(Math.abs(r.alpha-alpha)>1e-6)errors.push(`${label}: ${c.name} alpha ${r.alpha}, expected ${alpha}`);
   if(h.label.includes('non scartabile')!==no)errors.push(`${label}: ${c.name} accessible discard label`);
  }
  if(active&&selected&&selected.kind==='hand'){if(Math.abs(selected.w-H.w)>1e-6||Math.abs(selected.h-H.h)>1e-6)errors.push(`${label}: bound hit enlarged ${selected.w}x${selected.h}`);
   if(selected.drawn&&(selected.drawn.scale!==1||Math.abs(selected.drawn.y-(H.y+Math.abs(s.order.findIndex(c=>c.key===s.selected)-(s.order.length-1)/2)*3))>1e-6))errors.push(`${label}: bound drawing raised`);}
  samples.push({label,selected:s.selected,target:s.target,discard:s.discard,hand:s.cards.length,hits:s.hits.filter(h=>h.kind==='hand'),handReadout:s.readout.hand.map(({face,...h})=>h)});
 };
 const prompt=async expected=>{
  const data=await page.evaluate(()=>{const all=[...document.querySelectorAll('[data-testid=discard-invitation]')],e=all[0],r=e?.getBoundingClientRect(),h=document.querySelector('.hint.confirming span[hidden]');return {count:all.length,text:e?.textContent??'',pointerEvents:e?getComputedStyle(e).pointerEvents:null,cy:r?r.top+r.height/2:null,duplicate:!!h&&getComputedStyle(h).display!=='none'};});
  if(data.count!==Number(expected))errors.push(`discard prompt count ${data.count}, expected ${Number(expected)}`);
  if(expected){const s=await p.state(),costY=s.layout.hand.y+s.layout.hand.h*.41-1;
   if(data.pointerEvents!=='none'||Math.abs(data.cy-costY)>1.5||data.duplicate||!data.text.includes('scartare'))errors.push('discard prompt blocks a card, misses the cost row or duplicates the left hint');}
 };
 await escape();let start=await p.state();check(start,false,'outside-before');await prompt(false);
 const bounds=start.cards.filter(bound),candidates=start.cards.filter(regular);
 if(!bounds.length||!candidates.length)throw new Error('O26: no bound or discard candidate in real hand');
 let probes=0,nonDiscardableTaps=0;
 for(const b of bounds){
  await escape();await choose(b.key);let s=await p.state();check(s,true,`${b.name}-before-target`);await shot(`${b.key}-before-target`);
  // Before aiming, a regular still selects a new move, as before O26. Afterwards
  // it chooses the discard. Both paths must remain reachable with a canvas tap.
  for(const aimed of [false,true])for(const c of candidates){
   await escape();await choose(b.key);
   if(aimed){const self=catalog.get(b.name).class.endsWith('.LittleRage');
    s=await p.state();const t=s.hits.find(h=>h.kind==='person'&&(self?h.target.owner===s.me:h.target.owner!==s.me));
    await page.locator(`[data-hit="${t.id}"]`).focus();await page.keyboard.press('Enter');await page.waitForTimeout(80);
    // Reproduce the persistent hand focus which caused the owner's failure.
    await page.locator(`[data-hit="${b.key}"]`).focus();await page.waitForTimeout(80);
    s=await p.state();check(s,true,`${b.name}-after-target`);await prompt(true);if(c===candidates[0])await shot(`${b.key}-after-target`);
   }
   s=await p.state();const h=s.hits.find(h=>h.id===c.key),pt={x:h.x-h.w*.32,y:h.y+h.h*.28};
   // A normal fan overlaps; test its exposed grip, not the hidden right half.
   const preview=s.hits.find(h=>h.kind==='preview');
   if(preview){const dx=pt.x-preview.x,dy=pt.y-preview.y,a=-preview.angle;
    if(Math.abs(dx*Math.cos(a)-dy*Math.sin(a))<preview.w/2&&Math.abs(dx*Math.sin(a)+dy*Math.cos(a))<preview.h/2)errors.push(`${b.name}: preview covers candidate grip ${c.key}`);}
   if(aimed)await page.touchscreen.tap(pt.x,pt.y);else await page.mouse.click(pt.x,pt.y);
   await page.mouse.move(2,2);await page.waitForTimeout(100);const after=await p.state();
   if(aimed?after.discard!==c.key||after.selected!==b.key:after.selected!==c.key)errors.push(`${b.name}: candidate ${c.key} covered/unreachable (${aimed?'with':'without'} target)`);
   else probes++;
   check(after,false,`${b.name}-${c.key}-choice-ended`);await prompt(false);
  }
  for(const no of start.cards.filter(c=>!regular(c)&&c.key!==b.key)){
   await escape();await choose(b.key);s=await p.state();const self=catalog.get(b.name).class.endsWith('.LittleRage');
   const t=s.hits.find(h=>h.kind==='person'&&(self?h.target.owner===s.me:h.target.owner!==s.me));
   await page.locator(`[data-hit="${t.id}"]`).focus();await page.keyboard.press('Enter');await page.waitForTimeout(80);
   s=await p.state();const target=JSON.stringify(s.target),h=s.hits.find(h=>h.id===no.key);
   await page.touchscreen.tap(h.x-h.w*.32,h.y+h.h*.28);await page.waitForTimeout(80);const after=await p.state();
   if(after.selected!==b.key||after.discard!==null||JSON.stringify(after.target)!==target)errors.push(`${b.name}: tap on non-discardable ${no.name} changed choice`);
   else nonDiscardableTaps++;
   check(after,true,`${b.name}-${no.key}-non-discardable-tap`);
  }
 }
 // Every preview type: cancel restores its local slot; inspection remains
 // reachable from the visible semantic card and the menu (touch/keyboard).
 const previews=[];
 for(const c of start.cards){
  await escape();await choose(c.key);let s=await p.state();const arrow=s.arrows[0];if(!arrow)continue;
  await page.locator(`[data-hit="${arrow.id}"]`).focus();await page.keyboard.press('Enter');await page.waitForTimeout(80);s=await p.state();if(!s.target)continue;
  const order=s.order.map(c=>c.key),h=s.hits.find(h=>h.id===c.key);
  if(h?.kind!=='preview'||s.hits.some(h=>h.kind==='hand'&&h.id===c.key))errors.push(`${c.name}: preview copy still in hand`);
  await page.locator(`[data-hit="${c.key}"]`).focus();await page.keyboard.press('i');
  // GUI names are wire values, including trailing spaces (BadEducation).
  // innerText trims that whitespace; read the title's actual text node and
  // compare the whole name exactly, for both inspection paths.
  const receipt=await page.locator('dialog[open] .receipt h2').textContent().catch(()=>null);if(receipt!==c.name)errors.push(`${c.name}: preview keyboard inspection missing`);
  await page.getByRole('button',{name:'Torna al tavolo',exact:true}).click();await page.waitForTimeout(80);
  await page.getByLabel('Apri menu').click();await page.getByRole('button',{name:'Dettagli carta giocata',exact:true}).click();
  const touchReceipt=await page.locator('dialog[open] .receipt h2').textContent().catch(()=>null);if(touchReceipt!==c.name)errors.push(`${c.name}: preview menu inspection missing`);
  await page.getByRole('button',{name:'Torna al tavolo',exact:true}).click();await page.getByLabel('Annulla calata',{exact:true}).click();await page.waitForTimeout(80);
  const after=await p.state(),rest=after.hits.find(h=>h.id===c.key),index=start.order.findIndex(x=>x.key===c.key),x=after.layout.hand.center+(index-(start.order.length-1)/2)*after.layout.hand.step;
  if(rest?.kind!=='hand'||Math.abs(rest.x-x)>1e-6||JSON.stringify(after.order.map(c=>c.key))!==JSON.stringify(order))errors.push(`${c.name}: cancellation did not restore slot/order`);
  check(after,false,`${c.name}-cancelled`);previews.push({name:c.name,keyboardInspection:receipt===c.name,menuInspection:touchReceipt===c.name,restored:rest?.kind==='hand'});
 }
 await escape();check(await p.state(),false,'outside-after-cancel');await prompt(false);
 return {bounds:bounds.map(c=>c.name),candidates:candidates.length,probes,nonDiscardableTaps,previews,samples,errors,commandsBefore:start.commands,commandsAfter:(await p.state()).commands};
}

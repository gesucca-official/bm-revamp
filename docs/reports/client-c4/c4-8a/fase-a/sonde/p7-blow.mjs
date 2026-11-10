// Probe 7 (O21): ExtremelyViolentBlow with the real V on the face, in a real open 1vCom game with a synthetic deck inside R02 1.12 (same deck as VerifyResolution «C3 contrasti»).
import {startServer,stopServer,launch,login,state,shot,saveJson,wait,URL_} from './lib.mjs';
import assert from 'node:assert/strict';
const REDUCED=process.env.REDUCED!=='0';
await startServer();
const {browser,page,errors}=await launch({width:1366,height:768,reducedMotion:REDUCED});
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},800000);
const received=[];
page.on('websocket',ws=>ws.on('framereceived',f=>{let s=String(f.payload);if(s.startsWith('a['))s=s.slice(1);else return;try{for(const raw of JSON.parse(s)){const [head,...rest]=raw.split('\n\n');const lines=head.split('\n');received.push({command:lines[0],dest:(lines.find(l=>l.startsWith('destination:'))||'').slice(12),body:rest.join('\n\n').replace(/\u0000$/,'')});}}catch{}}));
const log=[],note=(k,d)=>{log.push({k,...d});console.log(k,JSON.stringify(d).slice(0,400));};
try{
 await login(page);
 const account=JSON.parse(received.filter(f=>f.dest==='/user/queue/account/data').at(-1).body),names={},chars={};
 for(const c of account.collection.cards)names[c.bindingName]=c.name;for(const c of account.collection.characters)chars[c.bindingName]=c.name;
 note('blow-name',{it:names['bruiser.ExtremelyViolentBlow']});
 const slot=async title=>{const s=page.locator('details.slot',{has:page.locator('summary',{hasText:title})});if(!(await s.evaluate(d=>d.open)))await s.locator('summary').click();return s;};
 const addRegular=async(binding,times)=>{await page.getByTestId('card-search').fill(binding);for(let i=0;i<times;i++)await page.getByRole('button',{name:`Aggiungi una copia di ${names[binding]}`,exact:true}).click();await page.getByTestId('card-search').fill('');};
 await page.getByTestId('tab-collection').click();await page.getByTestId('new-deck').click();
 await page.getByTestId('deck-name').fill('C48a blow');
 await (await slot('Personaggio')).getByRole('button',{name:`Personaggio ${chars['bruiser.character.BigBadBruiser']}`,exact:true}).click();
 await (await slot('Ultima risorsa')).getByRole('button',{name:`Ultima risorsa ${names['com.last.Struggle']}`,exact:true}).click();
 {const b=await slot('Azioni legate');for(const x of ['bruiser.character.LittleRage','bruiser.character.LittleSmack'])await b.getByRole('button',{name:`Azione legata ${names[x]}`,exact:true}).click();}
 await slot('Mazzo regolare');
 for(const [x,k] of [['bruiser.ExtremelyViolentBlow',2],['bruiser.SuperImpact',2],['bruiser.YouStop',2],['bruiser.WhatchaDoin',2],['junkie.AmphetamineReflexes',2],['bruiser.Glare',2],['com.items.CocktailOnTheGround',2],['com.items.MarvelousCocktail',2],['com.items.AnotherRottenBeer',2],['com.Grab',2]])await addRegular(x,k);
 await page.getByTestId('save-deck').click();await page.getByTestId('deck-notice').waitFor({timeout:10000});
 await page.getByTestId('tab-play').click();await page.getByRole('radio',{name:'Con un tuo mazzo'}).click();
 await page.getByTestId('quick').click();await page.getByTestId('deck-dialog').waitFor();
 await page.getByRole('radio',{name:/^C48a blow /}).click();await page.getByTestId('start-open').click();
 await wait(page,s=>s&&s.hits.some(h=>h.id.startsWith('person-')),40000,'table');
 await page.waitForTimeout(1500);
 const blowName=names['bruiser.ExtremelyViolentBlow'];
 // play one card per turn (UI), looking at the face of the Blow in the hand every turn
 const dialogOpen=()=>page.evaluate(()=>!!document.querySelector('dialog[open]'));
 const tap=async h=>{const c=h.kind==='hand'?{x:h.x-h.w*.22,y:h.y}:h.kind==='person'?{x:h.x,y:h.y+h.h*.15}:{x:h.x-h.w*.2,y:h.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(60);if(await dialogOpen()){await page.keyboard.press('Escape');await page.waitForTimeout(60);}};
 async function playOne(avoid){
  for(const card of (await state(page)).order){
   if(avoid&&card.name===avoid)continue;
   const own=(await state(page)).hits.find(h=>h.id===card.key);if(!own)continue;await tap(own);if((await state(page)).selected!==card.key)continue;
   let aimed=false;
   for(const t of (await state(page)).hits.filter(h=>h.kind==='person'||h.kind==='item')){if((await state(page)).selected!==card.key){const o=(await state(page)).hits.find(x=>x.id===card.key);if(o)await tap(o);}await tap(t);if((await state(page)).target){aimed=true;break;}}
   if(!aimed){await page.keyboard.press('Escape');continue;}
   const s=await state(page);
   if(s.message.includes('scartare')){let ok=false;for(const r of s.hits.filter(h=>h.kind==='hand'&&h.id!==card.key)){await tap(r);if((await state(page)).discard){ok=true;break;}}if(!ok){await page.keyboard.press('Escape');continue;}}
   if(!(await page.getByTestId('confirm').isEnabled())){await page.keyboard.press('Escape');continue;}
   await page.getByTestId('confirm').click();
   await wait(page,x=>!x||x.phase==='pending'||x.turn!==s.turn||x.over||x.eliminated||(x.phase==='choose'&&x.message.startsWith('Rifiutata')),15000,'answer');
   const r=await state(page);if(r&&r.phase==='choose'&&r.message.startsWith('Rifiutata')&&r.turn===s.turn){await page.keyboard.press('Escape');continue;}
   return card.name;}
  return null;
 }
 let seen=false;const faceLog=[];
 for(let turn=0;turn<30&&!seen;turn++){
  const s=await wait(page,x=>!x||x.over||x.eliminated||x.phase==='choose',60000,'choose');if(!s||s.over||s.eliminated)break;
  const hand=s.readout.hand,idx=hand.findIndex(c=>c.name===blowName);
  faceLog.push({turn:s.turn,V:s.resources.VIOLENCE,blowInHand:idx>=0,damage:idx>=0?hand[idx].face?.damage:null});
  if(idx>=0){seen=true;note('blow-in-hand',{turn:s.turn,V:s.resources.VIOLENCE,face:hand[idx].face?.damage,payable:hand[idx].payable,card:s.cards.find(c=>c.name===blowName)});
   const h=s.hits.find(x=>x.kind==='hand'&&x.key===s.order[idx].key);
   await shot(page,`blow-face-turn${s.turn}`);
   // zoom capture of the face
   await shot(page,`blow-face-zoom-turn${s.turn}`,{clip:{x:Math.max(0,h.x-h.w/2-5),y:Math.max(0,h.y-h.h/2-5),width:Math.min(h.w+10,1366),height:Math.min(h.h+10,768-Math.max(0,h.y-h.h/2-5))}});
   // inspection with the real V: (i) with the keyboard
   await page.evaluate(k=>document.querySelector(`[data-hit="${k}"]`)?.focus(),s.order[idx].key);await page.keyboard.press('i');await page.waitForTimeout(500);
   const dmg=await page.evaluate(()=>document.querySelector('[data-testid=inspect-damage]')?.textContent??null);note('inspection-damage',{text:dmg});
   await shot(page,'blow-inspection');await page.keyboard.press('Escape');await page.waitForTimeout(300);
   // play it
   const done=await playOne(null);note('played',{card:done});
   break;}
  const played=await playOne(blowName);if(!played){note('no-playable',{turn:s.turn});break;}
  await wait(page,x=>!x||x.over||x.eliminated||x.turn!==s.turn,60000,'next turn');
 }
 note('faceLog',{n:faceLog.length,log:faceLog.slice(-8)});
 await saveJson('blow',{errors,log,faceLog,seen});
}catch(e){console.error('ERR',e);await saveJson('blow-err',{log,e:String(e)});}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

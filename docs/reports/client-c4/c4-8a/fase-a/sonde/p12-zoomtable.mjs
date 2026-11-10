// Probe 12: the table at the CSS sizes that 200% zoom gives on the two reference screens (1366x768 -> 683x384; 1920x1080 -> 960x540), duel and FFA.
import {startServer,stopServer,launch,login,startDuel,startFfa,state,shot,saveJson} from './lib.mjs';
const res={};
const timer=setTimeout(()=>process.exit(2),800000);
for(const [w,h,mode] of [[960,540,'duel'],[683,384,'duel'],[960,540,'ffa'],[683,384,'ffa']]){
 await startServer();const tag=`zoom-${mode}-${w}x${h}`;const {browser,page,errors}=await launch({width:w,height:h,reducedMotion:true});
 try{
  await login(page);if(mode==='duel')await startDuel(page);else await startFfa(page);await page.waitForTimeout(1800);
  const s=await state(page);
  const out=s.hits.filter(x=>x.x-x.w/2<-1||x.y-x.h/2<-1||x.x+x.w/2>w+1||x.y+x.h/2>h+1).map(x=>x.id);
  const handW=s.layout.hand?.w??null;
  const info=await page.evaluate(()=>({portrait:getComputedStyle(document.querySelector('.portrait')).display,vw:innerWidth,vh:innerHeight}));
  res[tag]={hits:s.hits.length,outside:out,layout:{hand:s.layout.hand,compact:s.layout.compact,problems:s.layout.problems??null},info};
  await shot(page,tag);
  await page.getByRole('button',{name:'Apri menu'}).click();await page.waitForTimeout(400);
  const dlg=await page.evaluate(()=>{const d=document.querySelector('dialog[open]');const r=d.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),scroll:d.scrollHeight>d.clientHeight,top:Math.round(r.top),bottom:Math.round(r.bottom)};});
  res[tag].menuDialog=dlg;await shot(page,tag+'-menu');
  console.log(tag,JSON.stringify(res[tag]).slice(0,500));
 }catch(e){console.error('ERR',tag,e);res[tag+'-err']=String(e);}
 await browser.close();await stopServer();
}
await saveJson('zoom-table',res);clearTimeout(timer);process.exit(0);

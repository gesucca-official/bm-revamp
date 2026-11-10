// Probe 1: focus ring and tab order on the real table (duel and FFA). Read-only.
import {startServer,stopServer,launch,login,startDuel,startFfa,state,shot,saveJson,wait} from './lib.mjs';
const [w,h]=(process.env.VP??'1366x768').split('x').map(Number),mode=process.env.MODE??'duel',tag=`${mode}-${w}x${h}`;
await startServer();
const {browser,page,errors}=await launch({width:w,height:h});
const timer=setTimeout(()=>{console.error('timeout');process.exit(2);},240000);
try{
 await login(page);
 if(mode==='duel')await startDuel(page);else await startFfa(page);
 await page.waitForTimeout(2500);
 await page.mouse.click(5,5);await page.keyboard.press('Escape');
 await shot(page,`focus-${tag}-00-start`);
 const info=()=>page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const r=e.getBoundingClientRect(),cs=getComputedStyle(e);
  return {tag:e.tagName,hit:e.getAttribute('data-hit'),label:(e.getAttribute('aria-label')||e.textContent||'').slice(0,60),cls:e.className&&String(e.className).slice(0,30),test:e.getAttribute('data-testid'),box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],outline:`${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,fv:e.matches(':focus-visible'),bg:cs.backgroundColor,inDialog:!!e.closest('dialog')};});
 const order=[];
 for(let i=0;i<45;i++){await page.keyboard.press('Tab');await page.waitForTimeout(120);const x=await info();order.push(x);if(!x)break;
  if(i<14||(x.tag==='BUTTON'&&/menu|Apri/.test(x.label)))await shot(page,`focus-${tag}-t${String(i).padStart(2,'0')}`);
  if(order.length>3&&x.label===order[0].label&&x.hit===order[0].hit)break;}
 // shift-tab from start: reverse entry
 await saveJson(`focus-${tag}`,{tag,errors,order});
 console.log(tag,'tabs',order.length);console.log(order.map((o,i)=>`${i} ${o?`${o.tag} ${o.hit??o.test??o.cls} [${o.box}] fv=${o.fv} ${o.outline} | ${o.label}`:'null'}`).join('\n'));
}finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

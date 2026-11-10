// Probe 9: rule 11 (grayscale and colour-deficiency captures of the same states) and item 7 (accessibility tree of the table, before and after a round, duel and FFA compact).
import {startServer,stopServer,launch,login,startDuel,startFfa,state,shot,saveJson,wait,OUT} from './lib.mjs';
const sizes=(process.env.SIZES??'1366x768,844x390').split(',').map(s=>s.split('x').map(Number));
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},700000);
const FILTERS={gray:'grayscale(1)',deut:'url(#deut)',prot:'url(#prot)'};
// Machado 2009 severity 1.0 matrices
const SVG='<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute"><filter id="deut" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0"/></filter><filter id="prot" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0"/></filter></svg>';
const dialogOpen=page=>page.evaluate(()=>!!document.querySelector('dialog[open]'));
const result={};
for(const [w,h] of sizes){
 await startServer();const tag=`${w}x${h}`;const {browser,page,errors}=await launch({width:w,height:h,reducedMotion:true});
 try{
  await login(page);
  await page.evaluate(svg=>{const d=document.createElement('div');d.innerHTML=svg;document.body.appendChild(d.firstChild);},SVG);
  const snap=async(name,filters)=>{for(const f of filters){await page.evaluate(v=>{document.documentElement.style.filter=v;},FILTERS[f]);await page.waitForTimeout(200);await shot(page,`color-${tag}-${name}-${f}`);}await page.evaluate(()=>{document.documentElement.style.filter='';});};
  await snap('hub',['gray']);
  await startDuel(page);await page.waitForTimeout(1500);
  const aria=async name=>{const t=await page.locator('body').ariaSnapshot();result[`aria-${tag}-${name}`]=t;};
  await aria('start');
  await snap('table-start',['gray','deut']);
  let s=await state(page);
  const tap=async x=>{const c=x.kind==='hand'?{x:x.x-x.w*.22,y:x.y}:x.kind==='person'?{x:x.x,y:x.y+x.h*.15}:{x:x.x-x.w*.2,y:x.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(150);};
  // choose the first damage card -> aim state
  for(const c of s.hits.filter(x=>x.kind==='hand')){await tap(c);s=await state(page);if(s.selected){const cd=s.cards.find(k=>k.key===s.selected);if(cd?.role==='DAMAGE')break;}}
  await page.waitForTimeout(400);await snap('aim',['gray','deut','prot']);await aria('aim');
  const opp=s.hits.find(x=>x.kind==='person'&&x.target.owner!==s.me);if(opp){await tap(opp);}
  await page.waitForTimeout(500);
  s=await state(page);if(/scartare/i.test(s.message)){const r=s.hits.find(x=>x.kind==='hand'&&x.id!==s.selected);if(r)await tap(r);await page.waitForTimeout(400);}
  await snap('confirm',['gray','deut']);await aria('confirm');
  const ok=page.getByTestId('confirm');if(await ok.count()&&await ok.isEnabled()){await ok.click();await wait(page,x=>x.turn>=1||x.over,40000,'turn1').catch(()=>{});await page.waitForTimeout(1500);await aria('after-round');await snap('after-round',['gray']);}
  result[`errors-${tag}`]=errors;
 }catch(e){console.error('ERR',tag,e);result[`err-${tag}`]=String(e);}
 await browser.close();await stopServer();
}
// FFA compact aria
{await startServer();const [w,h]=[844,390];const {browser,page}=await launch({width:w,height:h,reducedMotion:true});
 try{await login(page);await startFfa(page);await page.waitForTimeout(1500);result['aria-ffa-844x390-start']=await page.locator('body').ariaSnapshot();}catch(e){result['err-ffa']=String(e);}
 await browser.close();await stopServer();}
await saveJson('color-aria',result);
clearTimeout(timer);process.exit(0);

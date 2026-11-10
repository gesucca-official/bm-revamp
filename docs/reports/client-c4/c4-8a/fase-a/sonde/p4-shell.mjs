// Probe 4: HTML screens at 100% and at the CSS size that 200% zoom gives (ref. screen 1366x768 -> 683x384; 1920x1080 -> 960x540), with WCAG 1.4.12 text spacing.
// Also: tab order, small targets, overflow, clipped text, contrast on real pixels (measure.mjs).
import {startServer,stopServer,launch,login,state,shot,saveJson,wait,URL_} from './lib.mjs';
import {measurePage,summarize} from './measure.mjs';
const sizes=(process.env.SIZES??'1366x768,683x384,960x540,844x390').split(',').map(s=>s.split('x').map(Number));
await startServer();
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},900000);
const SPACING='*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}';
const result={sizes:{},errors:[]};
const analyse=(spacing)=>({fn:()=>{
 const out={docOverflowX:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,bodyScrollW:document.body.scrollWidth,vw:innerWidth,vh:innerHeight,offRight:[],clipped:[],smallTargets:[],tabStops:0};
 const sheet=document.querySelector('.sheet');if(sheet){out.sheetOverflowX=sheet.scrollWidth>sheet.clientWidth+1;out.sheetScrollable=sheet.scrollHeight>sheet.clientHeight+1;}
 for(const el of document.querySelectorAll('body *')){const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;
  const inSheet=el.closest('.sheet');
  if(r.right>innerWidth+1&&!el.closest('.table-scroll')&&el.tagName!=='CANVAS')out.offRight.push((el.className&&String(el.className).slice(0,20))||el.tagName);
  if((el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2)&&['hidden','clip'].includes(cs.overflow)&&el.textContent.trim().length>0&&!el.matches('body,html,.table-host'))out.clipped.push(`${el.tagName}.${String(el.className).slice(0,20)} "${el.textContent.trim().slice(0,24)}" ${el.scrollWidth}x${el.scrollHeight}>${el.clientWidth}x${el.clientHeight}`);
  if(el.matches('button,a[href],input,select,summary,[role=radio],[role=tab]')&&r.top<innerHeight*3){out.tabStops++;if(r.width<44||r.height<44)out.smallTargets.push(`${(el.getAttribute('aria-label')||el.textContent||el.tagName).trim().slice(0,22)} ${Math.round(r.width)}x${Math.round(r.height)}`);}}
 out.offRight=[...new Set(out.offRight)].slice(0,8);out.clipped=out.clipped.slice(0,8);return out;}});
for(const [w,h] of sizes){
 const {browser,context,page,errors}=await launch({width:w,height:h});
 const tag=`${w}x${h}`;const per={};result.sizes[tag]=per;
 const pass=async(name,{contrast=false,capture=false}={})=>{
  await page.waitForTimeout(500);
  const a=await page.evaluate(analyse(false).fn);
  await page.addStyleTag({content:SPACING}).then(async h=>{await page.waitForTimeout(300);a.withSpacing=await page.evaluate(analyse(true).fn);await h.evaluate(n=>n.remove());});
  if(contrast){const r=await measurePage(page,name);a.contrast=summarize(r).filter(p=>p.typ<(p.large?3:4.5)||p.low<(p.large?3:4.5)).slice(0,12);a.items=r.items.length;}
  per[name]=a;
  if(capture)await shot(page,`shell-${tag}-${name}`);
  console.log(tag,name,JSON.stringify({ox:a.docOverflowX,sheetOx:a.sheetOverflowX,off:a.offRight.length,clip:a.clipped.length,small:a.smallTargets.length,spOff:a.withSpacing.offRight.length,spClip:a.withSpacing.clipped.length}));
 };
 try{
  const cap=(w===683||w===960);
  for(const [name,hash] of [['home','#/'],['regole','#/regole'],['accedi','#/accedi'],['registrati','#/registrati']]){await page.goto(`${URL_}${hash}`);await page.waitForTimeout(400);await pass(name,{contrast:w===1366,capture:cap});}
  await login(page);
  await pass('hub',{contrast:w===1366,capture:cap});
  await page.getByTestId('tab-collection').click();await pass('collezione',{contrast:w===1366,capture:cap});
  const newDeck=page.getByRole('button',{name:/Nuovo mazzo/i});if(await newDeck.count()){await newDeck.first().click();await pass('editor',{contrast:w===1366,capture:cap});await page.getByTestId('cancel-edit').click().catch(()=>{});}
  await page.getByTestId('tab-profile').click();await pass('profilo',{contrast:w===1366,capture:cap});
 }catch(e){console.error('ERR',tag,e);result.errors.push(`${tag}: ${e}`);}
 result.errors.push(...errors);
 await browser.close();
}
await saveJson('shell',result);
clearTimeout(timer);await stopServer();process.exit(0);

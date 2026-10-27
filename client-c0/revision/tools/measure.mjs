import {setup} from './browser.mjs';
import {writeFile,mkdir,readFile,readdir} from 'node:fs/promises';
import os from 'node:os';
import {createHash} from 'node:crypto';
const app=await setup(),samples=[];
const buildFiles=[];
async function fingerprint(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())await fingerprint(path);else buildFiles.push({file:path.slice(5),sha256:createHash('sha256').update(await readFile(path)).digest('hex')});}}
await fingerprint('dist');buildFiles.sort((a,b)=>a.file.localeCompare(b.file));
const percentile=(values,p)=>{const s=[...values].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.floor(s.length*p))]||0;};
await mkdir('../../docs/reports/client-c0-r2',{recursive:true});
try{
 for(const sample of [{name:'desktop',width:1366,height:768,touch:false,budget:20},{name:'touch-emulated',width:844,height:390,touch:true,budget:33}]){
  const context=await app.browser.newContext({viewport:{width:sample.width,height:sample.height},hasTouch:sample.touch,isMobile:sample.touch});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(app.url);await page.waitForFunction(()=>window.__c0?.state.hits.length===20);await page.bringToFront();await page.waitForTimeout(600);
  const hardware=await page.evaluate(()=>{const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),ext=gl.getExtension('WEBGL_debug_renderer_info');return {userAgent:navigator.userAgent,cores:navigator.hardwareConcurrency,devicePixelRatio,visibility:document.visibilityState,touchPoints:navigator.maxTouchPoints,gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};});
  const state=()=>page.evaluate(()=>__c0.state);const client=sample.touch?await context.newCDPSession(page):null;
  const pointer=async(type,x,y)=>{if(client)await client.send('Input.dispatchTouchEvent',{type:{down:'touchStart',move:'touchMove',up:'touchEnd'}[type],touchPoints:type==='up'?[]:[{id:1,x,y,force:.7}]});else if(type==='down'){await page.mouse.move(x,y);await page.mouse.down();}else if(type==='move')await page.mouse.move(x,y);else await page.mouse.up();};
  const click=async hit=>{if(sample.touch)await page.touchscreen.tap(hit.x,hit.y);else await page.mouse.click(hit.x,hit.y);};
  await page.evaluate(()=>__c0.measureStart());const start=performance.now();let cycles=0;
  while(performance.now()-start<60000){
   await page.evaluate(()=>__c0.fixture('reset'));let s=await state();const card=s.hits.find(h=>h.id===s.order[2].key),target=s.hits.find(h=>h.id==='person-Bice');await click(card);await click(target);await page.waitForTimeout(200);await page.keyboard.press('Escape');
   s=await state();const drag=s.hits.find(h=>h.id===s.order[3].key);await pointer('down',drag.x,drag.y);for(let i=1;i<=20;i++){await pointer('move',drag.x+(sample.width*.52-drag.x)*i/20,drag.y+(sample.height*.45-drag.y)*i/20);await page.waitForTimeout(12);}await pointer('up');await page.keyboard.press('Escape');
   s=await state();const first=s.hits.find(h=>h.id===s.order[0].key),last=s.hits.find(h=>h.id===s.order[4].key);await pointer('down',first.x,first.y);for(let i=1;i<=12;i++){await pointer('move',first.x+(last.x-first.x)*i/12,first.y);await page.waitForTimeout(12);}await pointer('up');
   await page.evaluate(()=>{__c0.fixture('reset');__c0.fixture('round');});await page.waitForTimeout(1500);cycles++;
  }
  const elapsed=performance.now()-start,stats=await page.evaluate(()=>__c0.measureEnd()),frames=stats.frames,inputs=stats.inputMs;
  const summary={sample,durationMs:elapsed,cycles,frames:frames.length,frameP95:percentile(frames,.95),frameMax:Math.max(...frames),withinFrameBudget:frames.filter(n=>n<=sample.budget).length/frames.length,inputSamples:inputs.length,inputP95:percentile(inputs,.95),inputMax:Math.max(...inputs),framePass:frames.filter(n=>n<=sample.budget).length/frames.length>=.95,inputPass:Math.max(...inputs)<=100,hardware,errors};
  samples.push(summary);await writeFile(`../../docs/reports/client-c0-r2/frames-${sample.name}.json`,JSON.stringify({frames:stats.frames,inputMs:stats.inputMs,sequenceMs:stats.sequenceMs}));console.log(JSON.stringify(summary));await context.close();
 }
 const report={date:new Date().toISOString(),browser:app.browser.version(),headed:process.env.C0_HEADED==='1',physicalTouch:false,buildFiles,platform:{os:os.platform(),release:os.release(),cpu:os.cpus()[0].model,totalMemoryGiB:Math.round(os.totalmem()/1024**3)},method:'Production build, same FFA: 6 own cards, four six-card backs, 9 objects. 60+ seconds each. Repeated real pointer/touch injection, card selection, aiming, dragging, reordering, fixed view and published animations. 600ms warm-up after assets ready. Frame intervals measured in renderer ticker; input to subsequent animation-frame feedback, not hardware touch latency.',samples};
 await writeFile('../../docs/reports/client-c0-r2/performance.json',JSON.stringify(report,null,2));
}finally{await app.close();}

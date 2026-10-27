import {mkdir,writeFile} from 'node:fs/promises';
import {setup} from './browser.mjs';
const app=await setup(); const results=[];
try {
  for(const sample of [{name:'desktop',width:1366,height:768,touch:false,limitMs:20},{name:'touch-emulated',width:844,height:390,touch:true,limitMs:33}]) {
    const context=await app.browser.newContext({viewport:{width:sample.width,height:sample.height},hasTouch:sample.touch,isMobile:sample.touch});
    const page=await context.newPage();
    await page.goto(app.url); await page.locator('[data-card="5"]').waitFor();
    await page.evaluate(()=>{
      window.__capture={intervals:[],start:performance.now(),previous:null,longTasks:[],events:[]};
      try { new PerformanceObserver(list=>window.__capture.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:false}); } catch {}
      const frame=t=>{const m=window.__capture;if(m.previous!==null)m.intervals.push(t-m.previous);m.previous=t;if(t-m.start<60000)requestAnimationFrame(frame);else m.done=true;};
      requestAnimationFrame(frame);
      // Stessa sequenza sintetica a cadenza fissa: trasferimento, impatto, delta.
      window.__workload=setInterval(()=>{document.querySelector('[data-testid=reset]').click();setTimeout(()=>document.querySelector('[data-testid=after]').click(),100);},3000);
    });
    const started=Date.now(); let inputSamples=0;
    while(Date.now()-started<60500){
      const locator=page.locator(`[data-card="${inputSamples%6}"]`);
      if(sample.touch) await locator.tap(); else await locator.click();
      inputSamples++; await page.waitForTimeout(2500);
    }
    const raw=await page.evaluate(()=>{clearInterval(window.__workload);return {capture:window.__capture,feedback:window.__c0.stats.feedbackMs,stats:window.__c0.stats,userAgent:navigator.userAgent,dpr:devicePixelRatio,visibility:document.visibilityState,screen:{width:screen.width,height:screen.height}};});
    const values=raw.capture.intervals, sorted=[...values].sort((a,b)=>a-b);
    const percentile=(v,p)=>[...v].sort((a,b)=>a-b)[Math.max(0,Math.ceil(v.length*p)-1)];
    results.push({sample,mode:process.env.C0_HEADED==='1'?'headed':'headless',durationMs:Date.now()-started,frames:values.length,meanFps:1000/(values.reduce((a,b)=>a+b,0)/values.length),p95Ms:percentile(sorted,.95),withinLimit:values.filter(n=>n<=sample.limitMs).length/values.length,maxIntervalMs:Math.max(...values),inputSamples,feedbackP95Ms:percentile(raw.feedback,.95),feedbackMaxMs:Math.max(...raw.feedback),passFrames:values.filter(n=>n<=sample.limitMs).length/values.length>=.95,passFeedback:Math.max(...raw.feedback)<=100,raw,note:sample.touch?'Emulazione sullo stesso PC; NON prova su dispositivo touch fisico.':'Misura automatizzata browser locale; non partita/rete reale.'});
    console.log(sample.name,JSON.stringify({p95:results.at(-1).p95Ms,within:results.at(-1).withinLimit,inputMax:results.at(-1).feedbackMaxMs}));
    await context.close();
  }
  await mkdir('../docs/reports/client-c0',{recursive:true});
  await writeFile('../docs/reports/client-c0/measurements.json',JSON.stringify({date:new Date().toISOString(),browser:app.browser.version(),method:'rAF 60 s, produzione, stessa scena FFA, ciclo viste ogni 3000 ms, input click/tap ogni ~2500 ms. Event.timeStamp → callback rAF dopo aggiornamento; proxy del feedback, non misura fotonica.',results},null,2)+'\n');
  if (results.some(r=>!r.passFrames || !r.passFeedback)) process.exitCode=1;
}finally{await app.close();}

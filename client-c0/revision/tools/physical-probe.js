// Instrumentation injected only by tools/physical.mjs: never part of the build.
// Starts on the first real touch after the table is ready, records 65 s with the
// scene's own ticker/input telemetry and posts raw data to the local PC.
(()=>{
 const DURATION=65000,log={pointerDowns:{},pointerMovesTouch:0,visibility:[],resizes:[],errors:[]};
 let ready=false,t0=0,timer=0;
 const badge=document.createElement('div');badge.setAttribute('aria-hidden','true');
 badge.style.cssText='position:fixed;left:8px;top:8px;z-index:20;pointer-events:none;padding:3px 9px;border-radius:6px;background:#38271fd9;color:#ead8b4;font:12px/1.3 system-ui,sans-serif';
 const say=text=>{badge.textContent=text;};
 const at=()=>t0?Math.round(performance.now()-t0):null;
 const size=()=>({w:innerWidth,h:innerHeight,vw:visualViewport?.width,vh:visualViewport?.height,scale:visualViewport?.scale,orientation:screen.orientation?.type});
 addEventListener('error',e=>log.errors.push(String(e.message)));
 addEventListener('resize',()=>{if(t0)log.resizes.push({t:at(),...size()});});
 document.addEventListener('visibilitychange',()=>{if(t0)log.visibility.push({t:at(),state:document.visibilityState});});
 addEventListener('pointermove',e=>{if(t0&&e.pointerType==='touch')log.pointerMovesTouch++;},{capture:true,passive:true});
 addEventListener('pointerdown',e=>{
  if(t0)log.pointerDowns[e.pointerType]=(log.pointerDowns[e.pointerType]||0)+1;
  else if(ready&&e.pointerType==='touch')begin();
 },{capture:true,passive:true});
 function begin(){
  t0=performance.now();log.pointerDowns.touch=1;log.start=size();window.__c0.measureStart();
  timer=setInterval(()=>{const left=Math.ceil((DURATION-(performance.now()-t0))/1000);if(left<=0)finish();else say(`Cattura · ${left} s`);},1000);
  say('Cattura · 65 s');
 }
 async function device(){
  let gpu=null,hints=null;
  try{const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),ext=gl.getExtension('WEBGL_debug_renderer_info');gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);}catch(e){gpu=`unavailable: ${e}`;}
  try{hints=await navigator.userAgentData?.getHighEntropyValues(['model','platform','platformVersion','fullVersionList','mobile']);}catch{}
  return {userAgent:navigator.userAgent,hints,devicePixelRatio,cores:navigator.hardwareConcurrency,memoryGiB:navigator.deviceMemory,touchPoints:navigator.maxTouchPoints,coarsePointer:matchMedia('(pointer: coarse)').matches,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,screen:{w:screen.width,h:screen.height},gpu};
 }
 async function finish(){
  clearInterval(timer);const elapsed=performance.now()-t0,stats=window.__c0.measureEnd();say('Cattura · invio al PC…');
  const body={durationMs:elapsed,frames:[...stats.frames],inputMs:[...stats.inputMs],sequenceMs:[...stats.sequenceMs],sequences:stats.sequences,cancels:[...stats.cancels],log:{...log,end:size()},device:await device()};
  try{const res=await fetch('/__c0/physical',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!res.ok)throw new Error(String(res.status));say(`Cattura salvata · ${await res.text()}`);}
  catch(e){say(`Invio non riuscito: ${e.message}`);}
 }
 const wait=setInterval(()=>{if(window.__c0?.state.hits.length===20){clearInterval(wait);setTimeout(()=>{ready=true;say('Cattura · tocca il tavolo per iniziare');},600);}},100);
 document.body.append(badge);say('Cattura · preparo il tavolo');
})();

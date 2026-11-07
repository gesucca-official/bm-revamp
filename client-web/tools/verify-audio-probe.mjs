// Optional instrumentation for the unchanged browser verifiers, enabled only with BM_AUDIO_PROBE (on | blocked).
// C4-7-bis: the sounds use Web Audio. Each AudioBufferSourceNode.start is logged with the file its buffer was decoded from
// (followed through fetch and decodeAudioData) and with the sequence open at that moment, which the scene reports through
// window.__bmAudioTrace (begin with its cue, end with its reason). `blocked` keeps every AudioContext suspended and makes
// resume() reject, as a browser that denies audio. HTMLMediaElement.play is still logged: the client should no longer call it.
import {chromium} from '@playwright/test';
import {appendFileSync} from 'node:fs';
const file=process.env.BM_AUDIO_LOG,mode=process.env.BM_AUDIO_PROBE;
if(file&&mode){
 const log=value=>{try{appendFileSync(file,JSON.stringify(value)+'\n');}catch{}};
 const launch=chromium.launch.bind(chromium);
 let pages=0;
 chromium.launch=async(...args)=>{const browser=await launch(...args),seen=new WeakSet();
  const attach=async page=>{if(seen.has(page))return page;seen.add(page);const id=++pages;
   page.on('websocket',ws=>{try{const u=new URL(ws.url());if(!['127.0.0.1','localhost'].includes(u.hostname))log({type:'remote',url:u.origin});}catch{}});
   page.on('pageerror',e=>log({type:'pageerror',message:String(e)}));
   page.on('console',msg=>{if(msg.type()==='error')log({type:'console',message:msg.text(),location:msg.location()});});
   page.on('response',r=>{if(r.status()>=400)log({type:'response',status:r.status(),url:r.url()});});
   page.on('request',r=>{try{const u=new URL(r.url());if(!['http://127.0.0.1:4320','http://localhost:4320'].includes(u.origin))log({type:'remote',url:u.origin});}catch{}});
   await page.exposeBinding('__audioProbe',(_source,data)=>log({...data,page:id}));
   await page.addInitScript(({blocked})=>{
    const where=()=>({viewport:`${innerWidth}x${innerHeight}`,t:Math.round(performance.now())});
    const fromUrl=new WeakMap(),fromBuffer=new WeakMap();
    const fetch0=window.fetch;window.fetch=async(...a)=>{const r=await fetch0(...a);const url=String(a[0]?.url??a[0]);
     if(/\/audio\/[^/]+$/.test(url)){const read=r.arrayBuffer.bind(r);r.arrayBuffer=async()=>{const b=await read();fromUrl.set(b,url.split('/').pop());return b;};}return r;};
    const decode=BaseAudioContext.prototype.decodeAudioData;BaseAudioContext.prototype.decodeAudioData=function(b,...rest){const name=fromUrl.get(b);return decode.call(this,b,...rest).then(buf=>{if(name)fromBuffer.set(buf,name);return buf;});};
    const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...a){const b=this.buffer,name=b?fromBuffer.get(b):null;
     void window.__audioProbe({type:'play',api:'webaudio',file:name??(b&&b.length<=1?'(sblocco muto)':'(sconosciuto)'),muted:!name,round:window.__bmAudioOpen??null,running:!!window.__bmAudioOpen,state:this.context?.state??null,event:window.__bmAudioEvent??null,panelTask:window.__bmPanelTask??null,panelVisible:!!document.querySelector('.outcome'),...where()});return start.apply(this,a);};
    const stop0=AudioBufferSourceNode.prototype.stop;AudioBufferSourceNode.prototype.stop=function(...args){void window.__audioProbe({type:'source-stop',file:fromBuffer.get(this.buffer)??null,...where()});return stop0.apply(this,args);};
    window.__bmAudioTrace=e=>{if(e.type==='panel'){window.__bmPanelTask=e.id;queueMicrotask(()=>{if(window.__bmPanelTask===e.id)delete window.__bmPanelTask;});}if(e.type==='begin')window.__bmAudioOpen=e.key;if(e.type==='end'&&window.__bmAudioOpen===e.key)window.__bmAudioOpen=null;void window.__audioProbe({...e,...where()});};
    new MutationObserver(()=>{const p=document.querySelector('.outcome');if(p&&!p.__audioObserved){p.__audioObserved=true;void window.__audioProbe({type:'panel-dom',text:p.querySelector('h2')?.textContent,...where()});}}).observe(document,{subtree:true,childList:true});
    if(blocked){Object.defineProperty(BaseAudioContext.prototype,'state',{configurable:true,get(){return 'suspended';}});
     AudioContext.prototype.resume=function(){return Promise.reject(new DOMException('Autoplay denied','NotAllowedError'));};}
    const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){void window.__audioProbe({type:'play',api:'media',file:(this.currentSrc||this.src).split('/').pop(),muted:this.muted,round:window.__bmAudioOpen??null,running:!!window.__bmAudioOpen,...where()});return play.call(this);};
   },{blocked:mode==='blocked'});
   return page;
  };
  const context=browser.newContext.bind(browser);browser.newContext=async(...args)=>{const c=await context(...args),newPage=c.newPage.bind(c);c.newPage=async(...a)=>attach(await newPage(...a));return c;};
  const page=browser.newPage.bind(browser);browser.newPage=async(...args)=>attach(await page(...args));return browser;
 };
}

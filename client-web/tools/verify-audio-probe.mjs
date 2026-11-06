// Optional instrumentation for the unchanged browser verifiers, enabled only with BM_AUDIO_PROBE.
import {chromium} from '@playwright/test';
import {appendFileSync} from 'node:fs';
const file=process.env.BM_AUDIO_LOG,mode=process.env.BM_AUDIO_PROBE;
if(file&&mode){
 const log=value=>{try{appendFileSync(file,JSON.stringify(value)+'\n');}catch{}};
 const launch=chromium.launch.bind(chromium);
 chromium.launch=async(...args)=>{const browser=await launch(...args),seen=new WeakSet();
  const attach=async page=>{if(seen.has(page))return page;seen.add(page);
   page.on('websocket',ws=>{try{const u=new URL(ws.url());if(!['127.0.0.1','localhost'].includes(u.hostname))log({type:'remote',url:u.origin});}catch{}});
   page.on('pageerror',e=>log({type:'pageerror',message:String(e)}));
   page.on('console',msg=>{if(msg.type()==='error')log({type:'console',message:msg.text(),location:msg.location()});});
   page.on('response',r=>{if(r.status()>=400)log({type:'response',status:r.status(),url:r.url()});});
   page.on('request',r=>{try{const u=new URL(r.url());if(!['http://127.0.0.1:4320','http://localhost:4320'].includes(u.origin))log({type:'remote',url:u.origin});}catch{}});
   await page.exposeBinding('__audioProbe',(_source,data)=>log(data));
   await page.addInitScript(({blocked})=>{const original=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const state=window.__bm?.state;void window.__audioProbe({type:'play',muted:this.muted,file:this.currentSrc||this.src,round:state?.round?.key??null,running:state?.sequence?.running??false,viewport:`${innerWidth}x${innerHeight}`});return blocked?Promise.reject(new DOMException('Autoplay denied','NotAllowedError')):original.call(this);};},{blocked:mode==='blocked'});
   return page;
  };
  const context=browser.newContext.bind(browser);browser.newContext=async(...args)=>{const c=await context(...args),newPage=c.newPage.bind(c);c.newPage=async(...a)=>attach(await newPage(...a));return c;};
  const page=browser.newPage.bind(browser);browser.newPage=async(...args)=>attach(await page(...args));return browser;
 };
}

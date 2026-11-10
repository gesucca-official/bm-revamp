// Probe 5: contrast of the focus ring against what lies around it, measured on real pixels, for every tab stop of the table.
import {startServer,stopServer,launch,login,startDuel,startFfa,state,shot,saveJson,wait} from './lib.mjs';
const [w,h]=(process.env.VP??'1366x768').split('x').map(Number),mode=process.env.MODE??'duel',tag=`ring-${mode}-${w}x${h}`;
await startServer();
const {browser,page,errors}=await launch({width:w,height:h,reducedMotion:true});
const timer=setTimeout(()=>{console.error('TIMEOUT');process.exit(2);},300000);
const measureIn=(b64,box)=>page.evaluate(async({b64,hit})=>{
 const img=await createImageBitmap(await (await fetch('data:image/png;base64,'+b64)).blob());const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);const data=cx.getImageData(0,0,img.width,img.height).data;
 const lin=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);},Lum=(r,g,b)=>.2126*lin(r)+.7152*lin(g)+.0722*lin(b),ratio=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 const px=(x,y)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=img.width||y>=img.height)return null;const o=(y*img.width+x)*4;return [data[o],data[o+1],data[o+2]];};
 const {x,y,w:bw,h:bh,angle}=hit,c=Math.cos(angle),s=Math.sin(angle);
 const at=(u,v)=>({x:x+u*c-v*s,y:y+u*s+v*c});
 const sampleAt=(dist)=>{const out=[];for(let i=1;i<20;i++){const t=(i/20-.5);for(const [u,v] of [[t*bw,-bh/2-dist],[t*bw,bh/2+dist],[-bw/2-dist,t*bh],[bw/2+dist,t*bh]]){const p=at(u,v),q=px(p.x,p.y);out.push(q);}}return out;};
 const ring=sampleAt(4.5),outside=sampleAt(9),gap=sampleAt(1.2);
 const valid=ring.map((r,i)=>r&&outside[i]&&gap[i]?i:-1).filter(i=>i>=0);
 const rm=[0,1,2].map(k=>Math.round(valid.reduce((t,i)=>t+ring[i][k],0)/valid.length));
 let okOut=0,okGap=0,okAny=0,minOut=99,minGap=99;
 for(const i of valid){const L=Lum(...ring[i]);const ro=ratio(L,Lum(...outside[i])),rg=ratio(L,Lum(...gap[i]));okOut+=ro>=3;okGap+=rg>=3;okAny+=(ro>=3||rg>=3);minOut=Math.min(minOut,ro);minGap=Math.min(minGap,rg);}
 const n=valid.length;return {ringColour:rm,shareOutside3:+(okOut/n).toFixed(2),shareGap3:+(okGap/n).toFixed(2),shareEither3:+(okAny/n).toFixed(2),minOutside:+minOut.toFixed(2),minGap:+minGap.toFixed(2),n};
},{b64,hit:box});
const rows=[];
try{
 await login(page);
 if(mode==='duel')await startDuel(page);else await startFfa(page);
 await page.waitForTimeout(2000);
 await page.mouse.click(5,5);
 for(let i=0;i<40;i++){
  await page.keyboard.press('Tab');await page.waitForTimeout(150);
  const f=await page.evaluate(()=>{const e=document.activeElement;return e&&e!==document.body?{hit:e.getAttribute('data-hit'),test:e.getAttribute('data-testid'),label:(e.getAttribute('aria-label')||e.textContent||'').slice(0,40),r:(()=>{const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height];})()}:null;});
  if(!f)break;
  const s=await state(page);const hit=f.hit?s.hits.find(z=>z.id===f.hit):null;
  const png=(await page.screenshot({type:'png'})).toString('base64');
  let box=hit?{x:hit.x,y:hit.y,w:hit.w,h:hit.h,angle:hit.angle}:{x:f.r[0]+f.r[2]/2,y:f.r[1]+f.r[3]/2,w:f.r[2],h:f.r[3],angle:0};
  // HTML buttons: outline-offset is 3 (or -5 inside .confirmation), measured only for the semantic hits and plain buttons
  const m=await measureIn(png,box);const kind=hit?hit.kind+(hit.kind==='status'?'':''):(f.test||'button');
  rows.push({i,kind,id:f.hit??f.test,label:f.label,box:[Math.round(box.x),Math.round(box.y),Math.round(box.w),Math.round(box.h)],...m});
  console.log(i,kind,JSON.stringify(m));
 }
 // ✓ and ✕ ring with a card chosen: select a card and a target with the keyboard, tab to Conferma
 await saveJson(tag,{tag,errors,rows});
}catch(e){console.error('ERR',e);}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

// Probe 11: ring on ✓ and × (outline-offset -5px: the ring lies inside the half, over the card).
import {startServer,stopServer,launch,login,startDuel,state,shot,saveJson,wait} from './lib.mjs';
await startServer();
const {browser,page,errors}=await launch({width:Number((process.env.VP??'1366x768').split('x')[0]),height:Number((process.env.VP??'1366x768').split('x')[1]),reducedMotion:true});
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

const res=[];
try{
 await login(page);await startDuel(page);await page.waitForTimeout(1500);
 const tap=async x=>{const c=x.kind==='hand'?{x:x.x-x.w*.22,y:x.y}:x.kind==='person'?{x:x.x,y:x.y+x.h*.15}:{x:x.x-x.w*.2,y:x.y};await page.mouse.click(c.x,c.y);await page.waitForTimeout(200);};
 let s=await state(page);
 for(const c of s.hits.filter(x=>x.kind==='hand')){await tap(c);s=await state(page);if(!s.selected)continue;const opp=s.hits.find(x=>x.kind==='person'&&x.target.owner!==s.me);await tap(opp);s=await state(page);if(s.target&&!/scartare/i.test(s.message))break;await page.keyboard.press('Escape');}
 await page.waitForTimeout(500);
 for(const which of ['confirm','cancel']){
  await page.evaluate(w=>{const b=w==='confirm'?document.querySelector('[data-testid=confirm]'):document.querySelector('[aria-label="Annulla calata"]');b.focus();},which);
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await page.waitForTimeout(250);
  const r=await page.evaluate(()=>{const e=document.activeElement,b=e.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height,label:e.getAttribute('aria-label')};});
  const png=(await page.screenshot({type:'png'})).toString('base64');
  const inset=11;const box={x:r.x+r.w/2,y:r.y+r.h/2,w:r.w-2*inset,h:r.h-2*inset,angle:0};
  const m=await measureIn(png,box);await shot(page,`ring-${process.env.TAG??'orig'}-${which}`,{clip:{x:Math.max(0,r.x-30),y:Math.max(0,r.y-30),width:r.w+60,height:r.h+60}});res.push({which,label:r.label,rect:[Math.round(r.x),Math.round(r.y),Math.round(r.w),Math.round(r.h)],...m});console.log(which,JSON.stringify(m));
 }
 await saveJson('ring-confirm',{res,errors});
}catch(e){console.error('ERR',e);}
finally{clearTimeout(timer);await browser.close();await stopServer();process.exit(0);}

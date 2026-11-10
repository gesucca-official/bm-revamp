// C4-11 B2: captures of the evidence, recompressed, and the close-up of the card shadow before and after. Not a verification and
// not a tool of client-web: it only reads captures made by client-web/tools/guide-captures.mjs (Edge canvas, no network).
//   node primo-piano.mjs pack <dir in> <dir out>            JPEG 0.55, width at most 1440 px
//   node primo-piano.mjs zoom <before.jpg> <after.jpg> <x,y,w,h> <out.jpg>   region enlarged 2×, side by side
// Playwright is loaded from client-web/node_modules (same version as the verifications).
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
const {chromium}=await import(new URL('../../../../../../client-web/node_modules/@playwright/test/index.mjs',import.meta.url).href);
const [mode,...args]=process.argv.slice(2);
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
  const page=await browser.newPage();
  const b64=f=>readFile(f).then(b=>b.toString('base64'));
  if(mode==='pack'){
    const [inp,out]=args;await mkdir(out,{recursive:true});
    for(const f of (await readdir(inp)).filter(f=>f.endsWith('.jpg')).sort()){
      const jpeg=await page.evaluate(async src=>{const i=new Image();await new Promise((ok,ko)=>{i.onload=ok;i.onerror=ko;i.src=`data:image/jpeg;base64,${src}`;});
        const k=Math.min(1,1440/i.width),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);
        c.getContext('2d').drawImage(i,0,0,c.width,c.height);return c.toDataURL('image/jpeg',0.55).split(',')[1];},await b64(join(inp,f)));
      await writeFile(join(out,f),Buffer.from(jpeg,'base64'));
    }
  }else if(mode==='zoom'){
    const [before,after,box,out]=args;const [x,y,w,h]=box.split(',').map(Number);
    const jpeg=await page.evaluate(async([imgs,x,y,w,h])=>{
      const load=src=>new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=`data:image/jpeg;base64,${src}`;});
      const [a,b]=await Promise.all(imgs.map(load));const k=2,gap=12,label=28;
      const c=document.createElement('canvas');c.width=w*k*2+gap;c.height=h*k+label;const g=c.getContext('2d');
      g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
      g.drawImage(a,x,y,w,h,0,label,w*k,h*k);g.drawImage(b,x,y,w,h,w*k+gap,label,w*k,h*k);
      g.fillStyle='#000';g.font='bold 18px Arial';g.fillText('prima: 4×6 px, 60%, bordo netto',6,20);g.fillText('dopo: 5×7,5 px, 66%, bordo 3 px',w*k+gap+6,20);
      return c.toDataURL('image/jpeg',0.8).split(',')[1];
    },[await Promise.all([before,after].map(b64)),x,y,w,h]);
    await writeFile(out,Buffer.from(jpeg,'base64'));
  }else throw new Error('mode: pack | zoom');
}finally{await browser.close();}

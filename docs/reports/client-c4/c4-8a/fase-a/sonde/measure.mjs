// Contrast measured on the real drawing: every text drawn by Pixi (via a patched COPY of the bundle served by Playwright, the product is untouched)
// and every HTML text, against the pixels of a lossless screenshot under it. WCAG 2.x ratio.
export async function patchBundle(context){
 await context.route(/\/assets\/index-[^/]+\.js$/,async route=>{const r=await route.fetch();let body=await r.text();
  const n=body.replace(/faces:\((\w+)=!1\)=>(\w+)\.faceInfos\(/,(m,a,b)=>`get scene(){return ${b}},faces:(${a}=!1)=>${b}.faceInfos(`);
  if(n===body)console.warn('PATCH NOT APPLIED');await route.fulfill({response:r,body:n});});
}
export async function measurePage(page,label){
 const png=await page.screenshot({type:'png'});
 const b64=png.toString('base64');
 return await page.evaluate(async ({b64,label})=>{
  const img=await createImageBitmap(await (await fetch('data:image/png;base64,'+b64)).blob());
  const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);
  const W=img.width,H=img.height;const data=cx.getImageData(0,0,W,H).data;
  const lin=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};
  const L=(r,g,b)=>.2126*lin(r)+.7152*lin(g)+.0722*lin(b);
  const ratio=(a,b)=>{const x=Math.max(a,b),y=Math.min(a,b);return (x+.05)/(y+.05);};
  const hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  const parse=s=>{if(typeof s==='number')return [(s>>16)&255,(s>>8)&255,s&255,1];if(typeof s==='string'){if(s[0]==='#'){let h=s.slice(1);if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255,1];}const m=s.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return [p[0],p[1],p[2],p[3]??1];}}return null;};
  function sample(x,y,w,h,fg,alpha){
   const ix=Math.min(2,w/6),iy=Math.min(2,h/6);const x0=Math.max(1,Math.floor(x+ix)),y0=Math.max(1,Math.floor(y+iy)),x1=Math.min(W-1,Math.ceil(x+w-ix)),y1=Math.min(H-1,Math.ceil(y+h-iy));if(x1-x0<2||y1-y0<2)return null;
   const d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]);
   const at=(i,j)=>{const o=(j*W+i)*4;return [data[o],data[o+1],data[o+2]];};
   // flat pixels: all four neighbours within 18 of the pixel (antialiased edges of the glyphs and borders are not flat)
   const flat=[];let total=0;
   for(let j=y0;j<y1;j++)for(let i=x0;i<x1;i++){total++;const p=at(i,j);if(d(p,at(i-1,j))<18&&d(p,at(i+1,j))<18&&d(p,at(i,j-1))<18&&d(p,at(i,j+1))<18)flat.push(p);}
   // background candidates: flat pixels not close to the nominal text colour (the fill itself is flat in the core of a glyph)
   const far=flat.filter(p=>d(p,fg)>45);
   if(far.length<Math.max(6,total*.04))return {fgPixels:flat.length,bg:null};
   // dominant colour: histogram of 16-level bins
   const bins=new Map();for(const p of far){const k=p.map(v=>v>>4).join(',');bins.set(k,(bins.get(k)||0)+1);}
   let best=null,bn=0;for(const [k,n] of bins)if(n>bn){bn=n;best=k;}
   const centre=best.split(',').map(v=>v*16+8);const cluster=far.filter(p=>d(p,centre)<40);
   const mean=[0,1,2].map(c=>cluster.reduce((a,p)=>a+p[c],0)/cluster.length);
   const eff=[0,1,2].map(c=>fg[c]*alpha+mean[c]*(1-alpha));
   const Lf=L(...eff),cs=far.map(p=>ratio(Lf,L(...p))).sort((a,b)=>a-b);
   const typ=ratio(Lf,L(...mean)),low=cs[Math.floor(cs.length*.1)];
   return {eff:hex(...eff),bg:hex(...mean),typ:+typ.toFixed(2),low:+Math.min(low,typ).toFixed(2),n:far.length};
  }
  const out=[];
  // Pixi texts
  const sc=window.__bm?.scene,modalOpen=!!document.querySelector('dialog[open]');
  if(sc&&!modalOpen){
   const stage=sc.app.stage;let count=0;
   const walk=(n,alpha,vis)=>{if(!n||n.visible===false||n.renderable===false)return;const a=alpha*(n.alpha??1);
    if(n.text!==undefined&&n.style&&typeof n.getBounds==='function'&&n.children.length===0&&String(n.text).trim()){
     const bd=n.getBounds(),x=bd.x??bd.minX,y=bd.y??bd.minY,w=bd.width,h=bd.height;
     const fg=parse(n.style.fill);const scale=Math.abs(n.worldTransform?.a??1);
     const px=n.style.fontSize*scale;
     if(fg&&w>1&&h>1&&x<W&&y<H&&x+w>0&&y+h>0&&a>.05){const m=sample(x,y,w,h,fg,a*fg[3]);out.push({k:'pixi',t:String(n.text).slice(0,28),px:+px.toFixed(1),fill:hex(fg[0],fg[1],fg[2]),a:+a.toFixed(2),box:[Math.round(x),Math.round(y),Math.round(w),Math.round(h)],...(m||{})});}}
    for(const c of n.children||[])walk(c,a,vis);};
   walk(stage,1,true);
  }
  // HTML texts
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let tn;while((tn=walker.nextNode())){const s=tn.textContent.replace(/\s+/g,' ').trim();if(!s)continue;const el=tn.parentElement;if(!el||el.closest('.sr-only,[aria-hidden=true],script,style,canvas,.semantic-layer')||(modalOpen&&!el.closest('dialog')))continue;
   let op=1,e=el,hidden=false;while(e&&e!==document.documentElement){const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'){hidden=true;break;}op*=parseFloat(cs.opacity);e=e.parentElement;}
   if(hidden||op<.05)continue;const cs=getComputedStyle(el);const rg=document.createRange();rg.selectNodeContents(tn);const r=rg.getBoundingClientRect();if(r.width<2||r.height<2)continue;
   if(r.right<0||r.bottom<0||r.left>W||r.top>H)continue;const top=document.elementFromPoint(Math.min(W-1,Math.max(0,r.x+r.width/2)),Math.min(H-1,Math.max(0,r.y+r.height/2)));if(!top||!(el.contains(top)||top.contains(el)))continue;
   const fg=parse(cs.color);if(!fg)continue;const px=parseFloat(cs.fontSize),bold=parseInt(cs.fontWeight)>=700;
   const m=sample(r.x,r.y,r.width,r.height,fg,op*fg[3]);out.push({k:'html',t:s.slice(0,28),px:+px.toFixed(1),bold,fill:hex(fg[0],fg[1],fg[2]),a:+(op*fg[3]).toFixed(2),box:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],cls:(el.className&&String(el.className).slice(0,24))||el.tagName,...(m||{})});}
  return {label,W,H,items:out};
 },{b64,label});
}
// Unique pairs: same kind + fill + background: minimum measured contrast. A text is large from 24 px or 18.66 px bold (Impact counts as bold).
export function summarize(res){const map=new Map();for(const it of res.items){if(it.typ===undefined)continue;const big=it.px>=24||(it.px>=18.66&&(it.k==='pixi'||it.bold));const key=`${it.k}|${it.fill}|${it.bg}|${big}`;const cur=map.get(key);if(!cur||it.low<cur.low)map.set(key,{...it,large:big,count:(cur?.count??0)+1});else cur.count++;}
 return [...map.values()].sort((a,b)=>a.low-b.low);}

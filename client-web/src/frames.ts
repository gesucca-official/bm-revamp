import {cardType,type CardType} from './readability.ts';
import type {Card} from './contracts.ts';
import type {Pen,SvgPart} from './symbols.ts';

// C4-4 (O8, O14): a fillet in the free margin of the card, a different line for each type of card, on the model of symbols.ts: plain data and
// two small drivers, `drawFrame` (Graphics) and `frameSvg` (the catalog, the editor, the inspection). The owner chose V1, medium width. The regular
// action keeps the line of today. The title and the art start 6 px from the edge and the outline takes 1 px, so widths do not grow with the card.

export type FrameKind=CardType|'back';
export type FramePart=
 |{t:'rrect';inset:number;c:number;w:number}
 /** Open lines with one stroke: the dashes of a line. */
 |{t:'lines';segs:number[][];c:number;w:number}
 /** Equal dots with one fill. */
 |{t:'dots';pts:number[];r:number;c:number};

export const FRAME_PAPER=0xe8d7b4;
export const FRAME_INK=0x30231e;
export const FRAME_GREY=0x8a8378;
/** C4-11 (owner, 10 November 2026: «al massimo migliorerei quella rendendola LEGGERMENTE più profonda e sfumata, senza sovrapporcene un'altra
 * versione»): the one shadow every card already had (a dark rounded rectangle 4×6 px down and right, 60% opaque), a little further (5×7.5 px,
 * same direction) and with a soft edge: `steps` copies of the same rectangle, from `soft`/2 px larger to `soft`/2 px smaller, each with the
 * opacity that makes their sum `alpha` in the middle. Drawn in code in one Graphics: no texture, no filter, no shadow towards the top or left. */
export const CARD_SHADOW={color:0x160e09,dx:5,dy:7.5,alpha:.66,soft:3,steps:4,radius:5} as const;
export function cardShadow(w:number,h:number):{x:number;y:number;w:number;h:number;r:number;alpha:number}[]{const S=CARD_SHADOW,a=1-Math.pow(1-S.alpha,1/S.steps);
 return Array.from({length:S.steps},(_,i)=>{const g=S.soft*(.5-i/(S.steps-1));return {x:-w/2+S.dx-g,y:-h/2+S.dy-g,w:w+2*g,h:h+2*g,r:Math.max(1,S.radius+g),alpha:a};});}
const LINE=0x9b7652,PETROL=0x2c6262,WINE=0x742e33,BLACK=0x120c08,OCHRE=0x86561b,RUST=0xb4501f,GOLD=0xb88f3a;

const rectPath=(w:number,h:number,i:number)=>{const l=-w/2+i,r=w/2-i,t=-h/2+i,b=h/2-i;return [l,t,r,t,r,b,l,b,l,t];};
/** A closed path cut by a repeating pattern of lengths: on, off, on, off. */
function dashes(path:number[],pattern:number[]){const segs:number[][]=[];let step=0,left=pattern[0];
 for(let i=0;i+3<path.length;i+=2){let x=path[i],y=path[i+1],d=Math.hypot(path[i+2]-x,path[i+3]-y);const ux=(path[i+2]-x)/(d||1),uy=(path[i+3]-y)/(d||1);
  while(d>0){const s=Math.min(d,left);if(step%2===0)segs.push([x,y,x+ux*s,y+uy*s]);x+=ux*s;y+=uy*s;d-=s;left-=s;if(left<=0){step=(step+1)%pattern.length;left=pattern[step];}}}
 return segs;}
function dotsOn(path:number[],gap:number){const pts:number[]=[];let left=gap/2;
 for(let i=0;i+3<path.length;i+=2){let x=path[i],y=path[i+1],d=Math.hypot(path[i+2]-x,path[i+3]-y);const ux=(path[i+2]-x)/(d||1),uy=(path[i+3]-y)/(d||1);
  while(d>=left){x+=ux*left;y+=uy*left;d-=left;left=gap;pts.push(x,y);}left-=d;}
 return pts;}

function build(kind:FrameKind,w:number,h:number):FramePart[]{
 // Dashes scale with the card down to a minimum: below it the gaps of a 36 px card would close into a plain line.
 const s=Math.max(.6,Math.min(1.3,w/112)),band=rectPath(w,h,3.3),line=(inset:number,c:number,lw:number):FramePart=>({t:'rrect',inset,c,w:lw});
 switch(kind){
  case 'regular':return [line(4,LINE,1)];
  case 'character':return [line(2.5,GOLD,2.6),line(4.6,FRAME_INK,1.1)];
  case 'basic':return [line(1.8,PETROL,1.5),line(4.6,PETROL,1.1)];
  case 'bound':return [{t:'lines',segs:dashes(band,[Math.max(6,8*s),Math.max(3.4,3.5*s)]),c:WINE,w:3}];
  case 'lastResort':return [line(3.3,BLACK,3.6)];
  case 'item':return [{t:'dots',pts:dotsOn(band,Math.max(5,6.5*s)),r:1.7,c:OCHRE}];
  case 'token':{const gap=Math.max(2.8,2.8*s);return [{t:'lines',segs:dashes(band,[Math.max(5,7*s),gap,Math.max(2.4,2.5*s),gap]),c:RUST,w:2.6}];}
  case 'neutral':return [{t:'lines',segs:dashes(rectPath(w,h,3.5),[9*s,7*s]),c:FRAME_GREY,w:1.2}];
  case 'back':return [line(2.6,GOLD,1.4)];
 }}
// The table redraws every card often and a card has few sizes: cut the dashes once per size.
const built=new Map<string,FramePart[]>();
export function frameParts(kind:FrameKind,w:number,h:number){const key=`${kind}|${w}|${h}`;let parts=built.get(key);if(!parts){parts=build(kind,w,h);built.set(key,parts);}return parts;}
export const frameOf=(c:Card):FrameKind=>cardType(c);

/** Draws the fillet of a card centred on (0, 0), over its paper. */
export function drawFrame(g:Pen,kind:FrameKind,w:number,h:number){
 for(const p of frameParts(kind,w,h))switch(p.t){
  case 'rrect':g.roundRect(-w/2+p.inset,-h/2+p.inset,w-2*p.inset,h-2*p.inset,2).stroke({color:p.c,width:p.w});break;
  case 'lines':for(const q of p.segs){g.moveTo(q[0],q[1]);g.lineTo(q[2],q[3]);}g.stroke({color:p.c,width:p.w,cap:'round'});break;
  case 'dots':for(let i=0;i<p.pts.length;i+=2)g.circle(p.pts[i],p.pts[i+1],p.r);g.fill(p.c);break;
 }
 return g;}

const css=(n:number)=>`#${n.toString(16).padStart(6,'0')}`;
/** The paper with its outline and the same fillet as the elements of an SVG with its viewBox centred on the card. */
export function frameSvg(kind:FrameKind,w:number,h:number):SvgPart[]{
 const out:SvgPart[]=[{tag:'rect',attrs:{x:-w/2,y:-h/2,width:w,height:h,rx:5,ry:5,fill:css(FRAME_PAPER),stroke:css(FRAME_INK),'stroke-width':2}}];
 for(const p of frameParts(kind,w,h))switch(p.t){
  case 'rrect':out.push({tag:'rect',attrs:{x:-w/2+p.inset,y:-h/2+p.inset,width:w-2*p.inset,height:h-2*p.inset,rx:2,ry:2,fill:'none',stroke:css(p.c),'stroke-width':p.w}});break;
  case 'lines':for(const q of p.segs)out.push({tag:'polyline',attrs:{points:`${q[0]},${q[1]} ${q[2]},${q[3]}`,fill:'none',stroke:css(p.c),'stroke-width':p.w,'stroke-linecap':'round'}});break;
  case 'dots':for(let i=0;i<p.pts.length;i+=2)out.push({tag:'circle',attrs:{cx:p.pts[i],cy:p.pts[i+1],r:p.r,fill:css(p.c)}});break;
 }
 return out;}

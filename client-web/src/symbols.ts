import type {Resource} from './contracts.ts';
import {DAMAGE_ACCENT,DAMAGE_ACCENT_SHAPES,DAMAGE_COLOR,DAMAGE_SHAPES,RES_COLOR,ROLE_COLOR,type DamageType,type Role} from './readability.ts';

// C4-3: one family of symbols for the table (Pixi) and the HTML shell (SVG), on the model of DAMAGE_SHAPES: plain data in -1..1 and
// two small drivers, `drawSymbol` (Graphics) here and `SymbolMark` in ui.tsx. The 15 symbols approved in C2a, C3-5 and C3-7 (five resources,
// seven roles, three types of damage) keep their shapes to the decimal; the marks (✓, ✕) are new and are drawn the same way, so no glyph
// of a font is needed where the font may not have it (Impact and Arial lack ✓ and ✕).

export type SymbolKind=Resource|Role|DamageType;
export type MarkKind='check'|'cross';
/** `main` is the colour given, `accent` the second colour of a damage symbol, `light` the fixed paper of the eye. */
export type Tone='main'|'accent'|'light';
export type Prim=
 |{t:'poly';p:number[]}
 |{t:'circle';x:number;y:number;r:number}
 |{t:'ellipse';x:number;y:number;rx:number;ry:number}
 |{t:'rect';x:number;y:number;w:number;h:number}
 |{t:'rrect';x:number;y:number;w:number;h:number;r:number}
 /** An open line (a mark): stroked, never filled. */
 |{t:'path';p:number[]};
/** The primitives of a layer share one fill and one stroke (in this order, as one path of the table). `w` is the width of the stroke in
 * fractions of the size of the symbol, at least `min` px. */
export type Layer={prims:Prim[];fill?:Tone;stroke?:{tone:Tone;w:number;min:number}};
export const LIGHT=0xf3ead2;

const poly=(p:number[]):Prim=>({t:'poly',p});
const fill=(...prims:Prim[]):Layer=>({prims,fill:'main'});
/** A star of `n` points (2n vertices) whose inner vertices lie at `k` of the radius. */
const star=(n:number,k:number)=>Array.from({length:2*n},(_,i)=>{const a=Math.PI*i/n,r=i%2?k:1;return [Math.cos(a)*r,Math.sin(a)*r];}).flat();

export const SYMBOL_LAYERS:Record<SymbolKind,Layer[]>={
 // Resources.
 HEALTH:[fill({t:'circle',x:-.45,y:-.25,r:.5},{t:'circle',x:.45,y:-.25,r:.5}),fill(poly([-.93,-.05,.93,-.05,0,.95]))],
 ALERTNESS:[{prims:[{t:'ellipse',x:0,y:0,rx:1,ry:.62}],fill:'light',stroke:{tone:'main',w:.13,min:1.5}},fill({t:'circle',x:0,y:0,r:.36})],
 VIOLENCE:[fill(poly([.3,-1,-.65,.15,-.05,.15,-.3,1,.7,-.2,.08,-.2]))],
 TOXICITY:[fill(poly([0,-1,.6,.12,-.6,.12])),fill({t:'circle',x:0,y:.32,r:.6})],
 ALCOHOL:[fill({t:'rrect',x:-.48,y:-.2,w:.96,h:1.2,r:.22}),fill({t:'rect',x:-.17,y:-1,w:.34,h:.9})],
 // Roles.
 DAMAGE:[fill(poly(star(10,.45)))],
 DEFENSE:[fill(poly([-.8,-.85,.8,-.85,.8,.05,0,1,-.8,.05]))],
 RESOURCES:[fill(poly([0,-.95,.9,.6,-.9,.6]))],
 COUNTER:[{prims:[poly(Array.from({length:8},(_,i)=>{const a=Math.PI/8+Math.PI*i/4;return [Math.cos(a),Math.sin(a)];}).flat())],stroke:{tone:'main',w:.14,min:1.5}},fill({t:'rect',x:-.6,y:-.14,w:1.2,h:.28})],
 DISRUPT:[fill(poly([0,.95,.9,-.6,-.9,-.6]))],
 ITEMS:[{prims:[{t:'rrect',x:-.95,y:-.55,w:1.1,h:1.4,r:.15}],stroke:{tone:'main',w:.11,min:1.2}},fill({t:'rrect',x:-.15,y:-.85,w:1.1,h:1.4,r:.15})],
 OTHER:[fill({t:'circle',x:-.6,y:0,r:.24},{t:'circle',x:0,y:0,r:.24},{t:'circle',x:.6,y:0,r:.24})],
 // Types of damage: the polygons of readability.ts, each its own fill, then the accent on top.
 ...Object.fromEntries((['HIT','CUT','POISON'] as DamageType[]).map(k=>[k,[...DAMAGE_SHAPES[k].map(p=>fill(poly(p))),...DAMAGE_ACCENT_SHAPES[k].map(p=>({prims:[poly(p)],fill:'accent' as Tone}))]])) as Record<DamageType,Layer[]>,
};
/** The marks that stand for a glyph of a font: the confirmation ✓ and the cancellation or voided ✕. */
export const MARK_LAYERS:Record<MarkKind,Layer[]>={
 check:[{prims:[{t:'path',p:[-.78,.04,-.28,.58,.82,-.62]}],stroke:{tone:'main',w:.24,min:2}}],
 cross:[{prims:[{t:'path',p:[-.68,-.68,.68,.68]},{t:'path',p:[.68,-.68,-.68,.68]}],stroke:{tone:'main',w:.24,min:2}}],
};

const hex=(n:number)=>`#${n.toString(16).padStart(6,'0')}`;
/** The colours a symbol has on the table, as CSS: the colour of its resource, role or type of damage, and the accent of a damage. */
export const symbolColors=(kind:SymbolKind):{main:string;accent?:string}=>kind in DAMAGE_COLOR?{main:hex(DAMAGE_COLOR[kind as DamageType]),accent:hex(DAMAGE_ACCENT[kind as DamageType])}:kind in RES_COLOR?{main:hex(RES_COLOR[kind as Resource])}:{main:hex(ROLE_COLOR[kind as Role])};

/** The part of Graphics the symbols need, so the drawing code does not depend on the renderer (and runs under test with a recorder). */
export interface Pen{
 poly(points:number[]):Pen;circle(x:number,y:number,r:number):Pen;ellipse(x:number,y:number,rx:number,ry:number):Pen;
 rect(x:number,y:number,w:number,h:number):Pen;roundRect(x:number,y:number,w:number,h:number,r:number):Pen;
 moveTo(x:number,y:number):Pen;lineTo(x:number,y:number):Pen;
 fill(color:number):Pen;stroke(style:{color:number;width:number;cap?:'round';join?:'round'}):Pen;
}
export type Colors={main:number;accent?:number};
const toneColor=(t:Tone,c:Colors)=>t==='main'?c.main:t==='accent'?c.accent:LIGHT;
/** Draws `layers` centred on (x, y) in a box of side `s` (the radius is s/2); a layer whose accent colour is not given is skipped. */
export function drawLayers(g:Pen,layers:Layer[],x:number,y:number,s:number,c:Colors){const r=s/2,pt=(a:number[])=>a.map((v,i)=>i%2?y+v*r:x+v*r);
 for(const l of layers){
  if(l.fill==='accent'&&c.accent===undefined)continue;
  const open=l.prims.some(p=>p.t==='path');
  for(const p of l.prims)switch(p.t){
   case 'poly':g.poly(pt(p.p));break;
   case 'circle':g.circle(x+p.x*r,y+p.y*r,p.r*r);break;
   case 'ellipse':g.ellipse(x+p.x*r,y+p.y*r,p.rx*r,p.ry*r);break;
   case 'rect':g.rect(x+p.x*r,y+p.y*r,p.w*r,p.h*r);break;
   case 'rrect':g.roundRect(x+p.x*r,y+p.y*r,p.w*r,p.h*r,p.r*r);break;
   case 'path':{const q=pt(p.p);g.moveTo(q[0],q[1]);for(let i=2;i<q.length;i+=2)g.lineTo(q[i],q[i+1]);break;}
  }
  if(l.fill)g.fill(toneColor(l.fill,c)!);
  if(l.stroke)g.stroke({color:toneColor(l.stroke.tone,c)!,width:Math.max(l.stroke.min,s*l.stroke.w),...(open?{cap:'round' as const,join:'round' as const}:{})});
 }
 return g;}
export const drawSymbol=(g:Pen,kind:SymbolKind,x:number,y:number,s:number,c:Colors)=>drawLayers(g,SYMBOL_LAYERS[kind],x,y,s,c);
export const drawMark=(g:Pen,kind:MarkKind,x:number,y:number,s:number,color:number)=>drawLayers(g,MARK_LAYERS[kind],x,y,s,{main:color});

/** The same layers as the elements of an SVG with viewBox -1 -1 2 2 (the catalog, the editor, the inspection and the shell): the tag and the attributes of each. `px` is the size
 * the SVG is shown at, which gives the minimum width of a stroke. */
export type SvgPart={tag:'polygon'|'circle'|'ellipse'|'rect'|'polyline';attrs:Record<string,string|number>};
export function svgParts(layers:Layer[],c:{main:string;accent?:string;light?:string},px=14):SvgPart[]{
 const out:SvgPart[]=[],css=(t:Tone)=>t==='main'?c.main:t==='accent'?c.accent!:c.light??`#${LIGHT.toString(16)}`;
 for(const l of layers){
  if(l.fill==='accent'&&c.accent===undefined)continue;
  const style:Record<string,string|number>={fill:l.fill?css(l.fill):'none'};
  if(l.stroke){Object.assign(style,{stroke:css(l.stroke.tone),'stroke-width':+Math.max(2*l.stroke.w,l.stroke.min/(px/2)).toFixed(4)});}
  for(const p of l.prims){const open=p.t==='path',s=open?{...style,'stroke-linecap':'round','stroke-linejoin':'round'}:style;
   switch(p.t){
    case 'poly':out.push({tag:'polygon',attrs:{points:p.p.map((v,i)=>i%2?`,${v} `:String(v)).join('').trim(),...s}});break;
    case 'circle':out.push({tag:'circle',attrs:{cx:p.x,cy:p.y,r:p.r,...s}});break;
    case 'ellipse':out.push({tag:'ellipse',attrs:{cx:p.x,cy:p.y,rx:p.rx,ry:p.ry,...s}});break;
    case 'rect':out.push({tag:'rect',attrs:{x:p.x,y:p.y,width:p.w,height:p.h,...s}});break;
    case 'rrect':out.push({tag:'rect',attrs:{x:p.x,y:p.y,width:p.w,height:p.h,rx:p.r,ry:p.r,...s}});break;
    case 'path':out.push({tag:'polyline',attrs:{points:p.p.map((v,i)=>i%2?`,${v} `:String(v)).join('').trim(),...s}});break;
   }}}
 return out;}

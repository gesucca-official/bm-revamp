import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MARK_LAYERS,SYMBOL_LAYERS,drawMark,drawSymbol,svgParts,symbolColors,type Pen,type SymbolKind} from '../src/symbols.ts';
import {DAMAGE_ACCENT_SHAPES,DAMAGE_SHAPES,RESOURCES,ROLES} from '../src/readability.ts';

// C4-3: one family of symbols for the table (Pixi) and the HTML shell (SVG). The 15 approved symbols keep their shapes.
const KINDS=[...RESOURCES,...Object.keys(ROLES),'HIT','CUT','POISON'] as SymbolKind[];
const recorder=()=>{const calls:string[]=[],f=(n:string)=>(...a:unknown[])=>{calls.push(`${n}(${a.map(v=>typeof v==='number'?+v.toFixed(4):JSON.stringify(v)).join(',')})`);return g;};
 const g:Pen={poly:f('poly'),circle:f('circle'),ellipse:f('ellipse'),rect:f('rect'),roundRect:f('roundRect'),moveTo:f('moveTo'),lineTo:f('lineTo'),fill:f('fill'),stroke:f('stroke')};return {g,calls};};

test('the 15 approved symbols (5 resources, 7 roles, 3 damages) exist, inside the unit square, and the damage ones are the polygons of readability.ts',()=>{
 assert.equal(new Set(KINDS).size,15);
 for(const k of KINDS){const layers=SYMBOL_LAYERS[k];assert.ok(layers.length>0,k);
  for(const l of layers)for(const p of l.prims){
   const pts=p.t==='poly'||p.t==='path'?p.p:p.t==='circle'?[p.x-p.r,p.y-p.r,p.x+p.r,p.y+p.r]:p.t==='ellipse'?[p.x-p.rx,p.y-p.ry,p.x+p.rx,p.y+p.ry]:[p.x,p.y,p.x+p.w,p.y+p.h];
   assert.ok(pts.every(v=>Math.abs(v)<=1.0001),`${k} leaves the unit square`);}}
 for(const t of ['HIT','CUT','POISON'] as const){
  assert.deepEqual(SYMBOL_LAYERS[t].filter(l=>l.fill==='main').map(l=>(l.prims[0] as {p:number[]}).p),DAMAGE_SHAPES[t]);
  assert.deepEqual(SYMBOL_LAYERS[t].filter(l=>l.fill==='accent').map(l=>(l.prims[0] as {p:number[]}).p),DAMAGE_ACCENT_SHAPES[t]);}
});

test('drawing: every symbol fills or strokes something; the accent layers are drawn only when an accent colour is given',()=>{
 for(const k of KINDS){const {g,calls}=recorder();drawSymbol(g,k,10,10,20,{main:0x123456});assert.ok(calls.some(c=>c.startsWith('fill(')||c.startsWith('stroke(')),k);}
 const plain=recorder(),accent=recorder();drawSymbol(plain.g,'HIT',0,0,20,{main:1});drawSymbol(accent.g,'HIT',0,0,20,{main:1,accent:2});
 assert.equal(plain.calls.filter(c=>c.startsWith('fill')).length,1);assert.equal(accent.calls.filter(c=>c.startsWith('fill')).length,2);
});

test('the marks ✓ and ✕ are strokes with round ends, drawn from lines, in the colour given',()=>{
 for(const k of ['check','cross'] as const){const {g,calls}=recorder();drawMark(g,k,0,0,20,0xfff6e2);
  assert.ok(calls.some(c=>c.startsWith('moveTo'))&&calls.some(c=>c.startsWith('lineTo')),k);assert.match(calls.at(-1)!,/"cap":"round"/);assert.ok(calls.at(-1)!.includes(`"color":${0xfff6e2}`));}
 assert.equal(MARK_LAYERS.cross[0].prims.length,2);
});

test('the SVG of the HTML shell has one element per primitive of the table, with the colours given',()=>{
 for(const k of KINDS){const layers=SYMBOL_LAYERS[k],parts=svgParts(layers,{main:'#a3313d',accent:'#f2c84b'});
  assert.equal(parts.length,layers.flatMap(l=>l.prims).length,k);
  assert.ok(parts.every(p=>Object.values(p.attrs).every(v=>v!==undefined&&!String(v).includes('NaN'))),k);}
 const burst=svgParts(SYMBOL_LAYERS.HIT,{main:'#a3313d',accent:'#f2c84b'});assert.deepEqual(burst.map(p=>p.attrs.fill),['#a3313d','#f2c84b']);
 assert.equal(svgParts(SYMBOL_LAYERS.HIT,{main:'#a3313d'}).length,1,'no accent colour, no accent layer');
 const eye=svgParts(SYMBOL_LAYERS.ALERTNESS,{main:'#2f8189'});assert.equal(eye[0].attrs.fill,'#f3ead2');assert.equal(eye[0].attrs.stroke,'#2f8189');assert.ok(Number(eye[0].attrs['stroke-width'])>=.26);
 const check=svgParts(MARK_LAYERS.check,{main:'currentColor'})[0];assert.equal(check.tag,'polyline');assert.equal(check.attrs.fill,'none');assert.equal(check.attrs['stroke-linecap'],'round');
});

test('every symbol has its colours in CSS: the resource, the role or the damage, and the accent only for a damage',()=>{
 for(const k of KINDS){const c=symbolColors(k);assert.match(c.main,/^#[0-9a-f]{6}$/,k);assert.equal(c.accent!==undefined,['HIT','CUT','POISON'].includes(k),k);}
 assert.equal(symbolColors('HEALTH').main,'#a3313d');assert.equal(symbolColors('HIT').accent,'#f2c84b');
});

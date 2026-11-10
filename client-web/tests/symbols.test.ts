import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EDGE_INK,EDGE_WIDTH,LIGHT,MARK_LAYERS,SYMBOL_LAYERS,drawMark,drawSymbol,edgeFor,svgParts,symbolColors,type Pen,type SymbolKind} from '../src/symbols.ts';
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

// C4-8a 3b (owner, 10 November 2026): a 1 px outline for the heart on the dark board and for alcohol and toxicity on the light coin; the same in Pixi and in SVG.
test('3b: only the heart on dark and alcohol or toxicity on light have an outline; the colours are the ink and the light of the eye',()=>{
 const withEdge=KINDS.flatMap(k=>(['dark','light'] as const).map(g=>[k,g,edgeFor(k,g)] as const)).filter(([,,e])=>e!==undefined).map(([k,g,e])=>`${k}/${g}/${e}`);
 assert.deepEqual(withEdge.sort(),[`ALCOHOL/light/${EDGE_INK}`,`HEALTH/dark/${LIGHT}`,`TOXICITY/light/${EDGE_INK}`]);
 assert.equal(edgeFor('HEALTH'),undefined,'no ground, no outline');assert.equal(edgeFor('HEALTH','light'),undefined);
});
test('3b, Pixi: the outline is drawn first, under every fill, 2 px wide centred on the contour (1 px shows); the symbol itself is as before',()=>{
 const plain=recorder(),edged=recorder();drawSymbol(plain.g,'HEALTH',10,10,20,{main:0xa3313d});drawSymbol(edged.g,'HEALTH',10,10,20,{main:0xa3313d,edge:0xf3ead2});
 assert.deepEqual(edged.calls.slice(-plain.calls.length),plain.calls,'the symbol itself is unchanged and last');
 const outline=edged.calls.slice(0,edged.calls.length-plain.calls.length),strokes=outline.filter(c=>c.startsWith('stroke('));
 assert.equal(strokes.length,2,'one outline per layer of the heart (the lobes, the point)');
 assert.ok(outline.every(c=>!c.startsWith('fill(')),'the outline does not fill');
 assert.ok(strokes.every(c=>c.includes(`"width":${EDGE_WIDTH}`)&&c.includes(`"color":${0xf3ead2}`)&&c.includes('"join":"round"')));
 // Layers that are strokes (the eye) are not outlined: only the fills of the main colour.
 const eyePlain=recorder(),eye=recorder();drawSymbol(eyePlain.g,'ALERTNESS',0,0,20,{main:1});drawSymbol(eye.g,'ALERTNESS',0,0,20,{main:1,edge:2});
 assert.equal(eye.calls.length-eyePlain.calls.length,2,'one outline for the pupil, none for the stroked eye: a primitive and its stroke');
});
test('3b, SVG: the outline elements come first (fill and stroke of the edge colour, 2 px wide), the symbol after them unchanged',()=>{
 const plain=svgParts(SYMBOL_LAYERS.ALCOHOL,{main:'#c98d1f'},12),edged=svgParts(SYMBOL_LAYERS.ALCOHOL,{main:'#c98d1f',edge:'#30231e'},12);
 assert.deepEqual(edged.slice(-plain.length),plain);const outline=edged.slice(0,edged.length-plain.length);assert.equal(outline.length,2,'a body and a neck');
 for(const p of outline){assert.equal(p.attrs.fill,'#30231e');assert.equal(p.attrs.stroke,'#30231e');assert.equal(p.attrs['stroke-width'],+(EDGE_WIDTH/6).toFixed(4));}
 assert.equal(svgParts(SYMBOL_LAYERS.ALCOHOL,{main:'#c98d1f'},12).length,plain.length,'without the edge colour, nothing is added');
});

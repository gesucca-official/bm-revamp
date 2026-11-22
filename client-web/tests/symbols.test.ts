import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EDGE_INK,EDGE_WIDTH,LIGHT,MARK_LAYERS,SYMBOL_LAYERS,TEXT_SYMBOLS,drawMark,drawSymbol,edgeFor,isDamage,svgParts,symbolColors,textParts,type Pen,type SymbolKind} from '../src/symbols.ts';
import {DAMAGE_ACCENT_SHAPES,DAMAGE_NAMES,DAMAGE_SHAPES,RESOURCES,ROLES} from '../src/readability.ts';

// C4-3: one family of symbols for the table (Pixi) and the HTML shell (SVG). The 15 approved symbols keep their shapes.
const KINDS=[...RESOURCES,...Object.keys(ROLES),'HIT','CUT','POISON'] as SymbolKind[];
const recorder=()=>{const calls:string[]=[],f=(n:string)=>(...a:unknown[])=>{calls.push(`${n}(${a.map(v=>typeof v==='number'?+v.toFixed(4):JSON.stringify(v)).join(',')})`);return g;};
 const g:Pen={poly:f('poly'),circle:f('circle'),ellipse:f('ellipse'),rect:f('rect'),roundRect:f('roundRect'),moveTo:f('moveTo'),lineTo:f('lineTo'),fill:f('fill'),stroke:f('stroke')};return {g,calls};};

test('the 15 approved symbols (5 resources, 7 roles, 3 damages) exist, inside the unit square, and the burst and the knife are the polygons of readability.ts (the poison: D172, tested below)',()=>{
 assert.equal(new Set(KINDS).size,15);
 for(const k of KINDS){const layers=SYMBOL_LAYERS[k];assert.ok(layers.length>0,k);
  for(const l of layers)for(const p of l.prims){
   const pts=p.t==='poly'||p.t==='path'?p.p:p.t==='circle'?[p.x-p.r,p.y-p.r,p.x+p.r,p.y+p.r]:p.t==='ellipse'?[p.x-p.rx,p.y-p.ry,p.x+p.rx,p.y+p.ry]:[p.x,p.y,p.x+p.w,p.y+p.h];
   assert.ok(pts.every(v=>Math.abs(v)<=1.0001),`${k} leaves the unit square`);}}
 // D172: the poison is no longer a polygon of readability.ts (see the test below); the burst and the knife still are.
 for(const t of ['HIT','CUT'] as const){
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

test('D172: the poison is a skull in front of a flask: flask (accent, outlined in the main colour), then skull (main), then eyes, nose and teeth (the paper)',()=>{
 const L=SYMBOL_LAYERS.POISON;assert.deepEqual(L.map(l=>l.fill),['accent','main','light']);
 assert.equal(L[0].stroke?.tone,'main');assert.equal(L[0].prims.length,1,'the flask is one outline: no seam between lip, neck and body');
 assert.deepEqual(L[1].prims.map(p=>p.t),['circle','rrect'],'cranium and jaw');assert.deepEqual(L[2].prims.map(p=>p.t),['ellipse','ellipse','poly','rect','rect'],'two eyes, nose, two teeth');
 // With the colours of the table the three tones are: light green, dark green, paper.
 const parts=svgParts(L,{main:'#5f8a1f',accent:'#b4e06a'});assert.deepEqual(parts.map(p=>p.attrs.fill),['#b4e06a','#5f8a1f','#5f8a1f',`#${LIGHT.toString(16)}`,`#${LIGHT.toString(16)}`,`#${LIGHT.toString(16)}`,`#${LIGHT.toString(16)}`,`#${LIGHT.toString(16)}`]);
 assert.equal(parts[0].attrs.stroke,'#5f8a1f');
 // Not the drop of the toxicity: another set of primitives, and no outline on the light coin (the skull is dark enough there).
 assert.notDeepEqual(SYMBOL_LAYERS.POISON,SYMBOL_LAYERS.TOXICITY);assert.equal(edgeFor('POISON','light'),undefined);assert.equal(edgeFor('POISON','dark'),undefined);
 // `flat`: the silhouette in one colour, the backing of the impact on the table: no paper, no accent, all of it in the colour given.
 const flat=recorder();drawSymbol(flat.g,'POISON',0,0,20,{main:0x111111,accent:0x111111,flat:true});
 assert.ok(flat.calls.filter(c=>c.startsWith('fill(')).every(c=>c==='fill(1118481)'),'every fill in the one colour');assert.ok(flat.calls.filter(c=>c.startsWith('stroke(')).every(c=>c.includes('"color":1118481')));
 const paper=recorder();drawSymbol(paper.g,'POISON',0,0,20,{main:0x111111,accent:0x222222});assert.ok(paper.calls.includes(`fill(${LIGHT})`),'without flat the eyes are the paper');
 // The flask is drawn before the skull (behind it); a symbol without the accent colour loses the flask only.
 const order=recorder();drawSymbol(order.g,'POISON',0,0,20,{main:1,accent:2});assert.deepEqual(order.calls.filter(c=>c.startsWith('fill(')),['fill(2)','fill(1)',`fill(${LIGHT})`]);
 const noAccent=recorder();drawSymbol(noAccent.g,'POISON',0,0,20,{main:1});assert.deepEqual(noAccent.calls.filter(c=>c.startsWith('fill(')),['fill(1)',`fill(${LIGHT})`]);
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

test('SB-25 (D168 (1)): a card text draws the three damage placeholders as damage symbols, the resources as before, unknown tokens as text',()=>{
 // A live text: only resources, cut exactly where the old regular expression of EffectText cut it.
 assert.deepEqual(textParts('Guadagni 10 [[V]], perdi 5 [[H]].'),['Guadagni ',{index:9,amount:'10 ',kind:'VIOLENCE',punctuation:','},' perdi ',{index:25,amount:'5 ',kind:'HEALTH',punctuation:'.'},'']);
 assert.deepEqual(textParts('Nessun simbolo.'),['Nessun simbolo.']);
 assert.deepEqual(textParts('Un [[Q]] sconosciuto resta testo.'),['Un [[Q]] sconosciuto resta testo.']);
 // A draft text with the three types of damage (SB-25 B1): each one a symbol, with its quantity and punctuation.
 const parts=textParts('20 [[HIT]] all\'avversario; i tuoi [[HIT]] diventano [[CUT]] e 4 [[POISON]].');
 assert.deepEqual(parts.filter(p=>typeof p!=='string').map(p=>[(p as {kind:string}).kind,(p as {amount?:string}).amount,(p as {punctuation?:string}).punctuation]),
  [['HIT','20 ',undefined],['HIT',undefined,undefined],['CUT',undefined,undefined],['POISON','4 ','.']]);
 assert.equal(parts.filter(p=>typeof p==='string').join(''),' all\'avversario; i tuoi  diventano  e ');
 for(const t of ['HIT','CUT','POISON'] as const){assert.equal(TEXT_SYMBOLS.get(`[[${t}]]`),t);assert.ok(isDamage(t));}
 for(const r of RESOURCES)assert.ok(!isDamage(r));
 // The names a screen reader says, as in the glossary of SB-25 Fase A; EffectText draws the damage with DamageMark.
 assert.deepEqual(DAMAGE_NAMES,{HIT:'colpo',CUT:'taglio',POISON:'veleno'});
 const ui=readFileSync(new URL('../src/ui.tsx',import.meta.url),'utf8');
 assert.match(ui,/isDamage\(kind\)\)\{const name=DAMAGE_NAMES\[kind\];[\s\S]*?aria-label=\{name\}[^>]*><DamageMark type=\{kind\}\/>/);
});

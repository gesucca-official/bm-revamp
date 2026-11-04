import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cardType} from '../src/readability.ts';
import {drawFrame,frameParts,frameSvg,FRAME_PAPER,type FrameKind,type FramePart} from '../src/frames.ts';
import type {Pen} from '../src/symbols.ts';
import type {Card} from '../src/contracts.ts';

const fixtures=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));
const card=(over:Partial<Card>):Card=>({...fixtures.cards.stop,item:false,basicAction:false,lastResort:false,characterBound:false,...over});
const annex=JSON.parse(readFileSync(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8'));
const SUBTYPE:Record<string,[keyof Card,CardKind]>={Base:['basicAction','basic'],'Legata al personaggio':['characterBound','bound'],'Ultima risorsa':['lastResort','lastResort']};
type CardKind=ReturnType<typeof cardType>;
// A card as the wire flags say it, from the type written in the annex of the regulation.
const fromAnnex=(c:{class:string;type:string;subtype?:string})=>{const sub=c.subtype?SUBTYPE[c.subtype]:undefined;
 return {want:(c.type==='Oggetto'?'item':sub?sub[1]:'regular') as CardKind,card:card({bindingName:c.class,item:c.type==='Oggetto',...(sub?{[sub[0]]:true}:{})})};};
const KINDS:FrameKind[]=['character','regular','basic','bound','lastResort','item','token','neutral','back'];
// The sizes a card has at the table: small round, item, person, hand at 844x390 and at 1366x768.
const WIDTHS=[36,45.6,60,120,214];

test('C4-4: every class of the annex has the frame of its type',()=>{
 const counts:Record<string,number>={};
 for(const c of annex.cards){const {want,card:wire}=fromAnnex(c);assert.equal(cardType(wire),want,c.class);counts[want]=(counts[want]??0)+1;}
 assert.deepEqual(counts,{regular:26,bound:4,basic:2,lastResort:1,item:4});
 assert.equal(annex.cards.length,37);
});

test('C4-4: the token has its own frame, from bindingName',()=>{
 assert.ok(annex.tokens.length>0);
 for(const t of annex.tokens)assert.equal(cardType(card({bindingName:t.class,item:true})),'token',t.class);
 assert.equal(cardType(card({bindingName:'com.items.Beer',item:true})),'item','an item outside the tokens stays an item');
 assert.equal(cardType(card({bindingName:'com.tokens.Bottle',item:false})),'regular','the prefix alone does not make a token');
});

test('C4-4: neutral fallback for a card that cannot be typed',()=>{
 assert.equal(cardType(card({bindingName:''})),'neutral','known by name only');
 assert.equal(cardType(card({bindingName:'x.Y',item:true,basicAction:true})),'neutral','contradictory flags');
 assert.equal(cardType(card({bindingName:'x.Y',basicAction:true,lastResort:true})),'neutral','contradictory flags');
 assert.equal(cardType(card({bindingName:'setbase.New'})),'regular','a new class with no flag plays as a regular action');
});

// Rule 11: the geometry alone, with every colour taken away.
const shape=(parts:FramePart[])=>JSON.stringify(parts.map(({c:_,...rest})=>rest));
test('C4-4: the types differ without colour, at every size of the table',()=>{
 for(const w of WIDTHS){const seen=new Map<string,FrameKind>();
  for(const k of KINDS){const s=shape(frameParts(k,w,w*1.38));assert.equal(seen.get(s),undefined,`${k} draws like ${seen.get(s)} at ${w} px`);seen.set(s,k);}}
});

const luminance=(n:number)=>{const f=(v:number)=>{const c=v/255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4;};return .2126*f(n>>16&255)+.7152*f(n>>8&255)+.0722*f(n&255);};
test('C4-4: every mark stands out from the paper in greys',()=>{
 for(const k of KINDS)for(const p of frameParts(k,120,165.6)){const a=luminance(FRAME_PAPER),b=luminance(p.c);assert.ok((a+.05)/(b+.05)>=2,`${k} ${p.c.toString(16)}`);}
});

test('C4-4: the frame stays in the free margin: no area taken from the face, at the smallest card too',()=>{
 for(const w of WIDTHS)for(const k of KINDS){const h=w*1.38;
  for(const p of frameParts(k,w,h)){
   // Distance from the edge of the card of the outermost and innermost point drawn.
   const inner=(x:number,y:number)=>Math.min(w/2-Math.abs(x),h/2-Math.abs(y));
   const [lo,hi]=p.t==='rrect'?[p.inset-p.w/2,p.inset+p.w/2]:p.t==='lines'?[Math.min(...p.segs.flatMap(q=>[inner(q[0],q[1]),inner(q[2],q[3])]))-p.w/2,Math.max(...p.segs.flatMap(q=>[inner(q[0],q[1]),inner(q[2],q[3])]))+p.w/2]:[3.3-p.r,3.3+p.r];
   assert.ok(lo>=1,`${k} at ${w} px touches the outline (${lo})`);assert.ok(hi<=6,`${k} at ${w} px enters the face (${hi})`);}}
});

test('C4-4: the gaps of the dashes stay open on the 36 px card',()=>{
 const gaps=(k:FrameKind)=>{const p=frameParts(k,36,49.68)[0];assert.equal(p.t,'lines');const s=(p as Extract<FramePart,{t:'lines'}>).segs;
  // Along a straight side: around a corner the same length of path measures less as the crow flies.
  return s.slice(1).map((q,i)=>q[0]===s[i][2]||q[1]===s[i][3]?Math.hypot(q[0]-s[i][2],q[1]-s[i][3]):0).filter(d=>d>0.01);};
 for(const k of ['bound','token'] as FrameKind[]){const g=gaps(k);assert.ok(g.length>6,k);assert.ok(Math.min(...g)>=2.79,`${k}: ${Math.min(...g)}`);}
});

test('C4-4: the regular action, 26 cards of 37, keeps the line of today',()=>{
 assert.deepEqual(frameParts('regular',120,165.6),[{t:'rrect',inset:4,c:0x9b7652,w:1}]);
});

// A recorder, as in symbols.test.ts: what the table would draw.
const recorder=()=>{const calls:string[]=[];const g=new Proxy({},{get:(_,k:string)=>(...a:unknown[])=>{calls.push(k);void a;return g;}}) as unknown as Pen;return {g,calls};};
test('C4-4: table and shell draw the same parts',()=>{
 for(const k of KINDS){const {g,calls}=recorder();drawFrame(g,k,120,165.6);const svg=frameSvg(k,120,165.6);
  const lines=frameParts(k,120,165.6).reduce((n,p)=>n+(p.t==='rrect'?1:p.t==='lines'?p.segs.length:p.pts.length/2),0);
  assert.equal(svg.length,lines+1,`${k}: the paper and one element per part`);
  assert.equal(calls.filter(c=>c==='roundRect'||c==='moveTo'||c==='circle').length,lines,k);}
});

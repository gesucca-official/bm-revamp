// C4-11, phase B: space and depth (owner's choice of 10 November 2026, docs/design/client-c4/spazio/proposta.md#scelta-del-proprietario).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {GROW,growth,tableLayout,fitScale,layoutProblems,SCALE,LIGHT_FRAME,tableFrame,pileTag,shiftLayout,confirmTextBox,aimArrows,confirmButtons,raisedCard,handSlot,stripPlan,inside,type TableLayout,type Box} from '../src/readability.ts';
import {CARD_SHADOW,cardShadow} from '../src/frames.ts';
import {safeInsets,applySafeInsets} from '../src/safe.ts';
const require=createRequire(import.meta.url),postcss=require('postcss');
const src=(f:string)=>readFileSync(new URL(`../src/${f}`,import.meta.url),'utf8');
const ids=(n:number)=>['me','b','c','d','e'].slice(0,n),items=(n:number,k:number)=>Object.fromEntries(ids(n).map(i=>[i,k]));
const close=(a:number,b:number,eps=.01)=>Math.abs(a-b)<=eps;

// ---- b1, softened: «diciamo di farle crescere un 10% in meno» ----
test('b1: growth is 90% of the prototype, from a 16:9 screen 800 px high, the smaller of height and width, never under 1',()=>{
 assert.equal(GROW.damp,.9);
 for(const [w,h] of [[1366,768],[1422,800],[1580,888],[844,390],[750,292],[1366,1024],[1280,1024]])assert.equal(growth(w,h,h<550),1,`${w}×${h}`);
 assert.ok(close(growth(1920,1080,false),1.215),'1920×1080');assert.ok(close(growth(2560,1440,false),1.62),'2560×1440');
 assert.ok(close(growth(1920,1440,false),1.215),'4:3 grows with the width');assert.ok(close(growth(2560,1080,false),1.215),'21:9 grows with the height');
 assert.equal(growth(2000,540,true),1,'compact never grows');
});
test('b1: measures at 1920×1080 and 2560×1440 (hand 260 and 347 px), factors of C3-L kept, nothing in the way',()=>{
 for(const [w,h,hand] of [[1920,1080,260],[2560,1440,346.7]] as const)for(const n of [2,5]){
  assert.deepEqual(fitScale(w,h,n),SCALE,`${w}×${h} ${n}: no factor gives way`);
  for(const k of [1,3]){const l=tableLayout(w,h,ids(n),'me',items(n,k)),big=growth(w,h,false);
   assert.ok(close(l.hand.w,hand,.1),`hand ${l.hand.w}`);assert.ok(close(l.hand.lift,30*big),'lift');assert.ok(close(l.preview.w,120*big)&&close(l.preview.h,166*big),'placed card');assert.ok(close(l.piles!.deck.w,40*big),'piles');
   assert.deepEqual(layoutProblems(l,w,h),[],`${w}×${h} ${n} seats ${k} objects`);}}
});
test('b1: nothing smaller than today at large and 4:3 screens; identical at the official measures',()=>{
 // Today's sizes (C3-L caps, the base of rule 17): hand 214, own character 225 (duel) and 176 (FFA), base 150.
 for(const [w,h] of [[1600,900],[1680,1050],[1920,1080],[1920,1200],[1920,1440],[1366,1024],[2560,1080],[2560,1440]])for(const n of [2,5]){
  const l=tableLayout(w,h,ids(n),'me',items(n,1)),me=l.seats.find(s=>s.me)!;
  assert.ok(l.hand.w>=214-.01,`${w}×${h} hand ${l.hand.w}`);assert.ok(me.person.w>=(n===2?225:175.5)-.01,`${w}×${h} own ${me.person.w}`);
  for(const k of ['me','others','items','resources'] as const)assert.ok(fitScale(w,h,n)[k]>=fitScale(1366,768,n)[k]||w<1366,`${w}×${h} ${k}`);
  assert.deepEqual(layoutProblems(l,w,h),[],`${w}×${h} ${n}`);}
 const l=tableLayout(1366,768,ids(2),'me',items(2,1));assert.equal(l.hand.w,214);assert.equal(l.hand.lift,30);assert.equal(l.preview.w,120);assert.equal(l.piles!.deck.w,40);
});

// ---- a1 «Cornice leggera» ----
test('a1: on the compact table the props step back to 55%, the empty discard place is not drawn, the title leaves; elsewhere as today',()=>{
 assert.equal(LIGHT_FRAME.props,.55);assert.deepEqual(tableFrame(390),{props:.55,emptyDiscard:false});assert.deepEqual(tableFrame(549),{props:.55,emptyDiscard:false});
 assert.deepEqual(tableFrame(550),{props:1,emptyDiscard:true});assert.deepEqual(tableFrame(768),{props:1,emptyDiscard:true});
 const scene=src('scene.ts');assert.match(scene,/this\.decor\.alpha=tableFrame\(h\)\.props/);assert.match(scene,/else if\(tableFrame\(this\.height\)\.emptyDiscard\)empty\(s\);/);
 let hidden=false;postcss.parse(src('style.css')).walkAtRules('media',(m:any)=>{if(/max-height:\s*550px/.test(m.params))m.walkRules('.brand',(r:any)=>r.walkDecls('display',(d:any)=>{if(d.value==='none')hidden=true;}));});
 assert.ok(hidden,'.brand hidden on the compact table');
});

// ---- a2 «Round in pila» ----
test('a2: the tag of the pile names the top card, counts the pile and marks a voided card under the top',()=>{
 const m=(playerId:string,v=false)=>({playerId,void:v});
 assert.equal(pileTag([m('a')],0),null);
 assert.deepEqual(pileTag([m('a'),m('b'),m('c')],3),{top:2,author:'c',count:3,topVoid:false,voidBelow:false});
 assert.deepEqual(pileTag([m('a'),m('b',true),m('c')],3),{top:2,author:'c',count:3,topVoid:false,voidBelow:true});
 assert.deepEqual(pileTag([m('a'),m('b'),m('c',true)],3),{top:2,author:'c',count:3,topVoid:true,voidBelow:false},'the voided top is marked on its own tag, not on the count');
 assert.deepEqual(pileTag([m('a'),m('b',true),m('c')],2),{top:1,author:'b',count:2,topVoid:true,voidBelow:false},'during the sequence: the cards landed so far');
 assert.deepEqual(pileTag([m('a',true),m('b')],5),{top:1,author:'b',count:2,topVoid:false,voidBelow:true},'never past the moves');
});
test('a2: at 844×390 one pile, larger in the FFA (36 → 54–60 px), the same 40 px in the duel; desktop keeps the cascade',()=>{
 for(const k of [0,1,2,3]){const ffa=tableLayout(844,390,ids(5),'me',items(5,k)).played!,duel=tableLayout(844,390,ids(2),'me',items(2,k)).played!;
  for(const P of [ffa,duel]){assert.equal(P.pile,true);P.slots.forEach(s=>assert.deepEqual(s,P.slots[0]));P.tags.forEach(t=>assert.deepEqual(t,P.tags[0]));
   const t=P.tags[0],c=P.slots[0];assert.ok(t.w>=c.w&&t.y+t.h/2<=c.y-c.h/2,'one tag above the pile, as wide as the card');}
  assert.ok(ffa.slots[0].w>=54,`FFA card ${ffa.slots[0].w}`);assert.equal(duel.slots[0].w,40);}
 const d=tableLayout(1366,768,ids(5),'me',items(5,1)).played!;assert.equal(d.pile,undefined);assert.ok(d.slots[1].y>d.slots[0].y,'cascade');
});
test('a2: the pile leaves every seat its summary strip at 844×390, as the cascade did',()=>{
 const T=[['−7','−10','+1'],['invariato']];
 for(const n of [2,5])for(const k of [0,1,2,3])for(const t of T){const l=tableLayout(844,390,ids(n),'me',items(n,k)),plan=stripPlan(l,844,390,Object.fromEntries(ids(n).map(i=>[i,t])));
  assert.equal(ids(n).filter(i=>plan[i]).length,n,`${n} seats ${k} objects ${t.length} entries`);}
});
test('a2: the scene draws the pile from the layout, with the count marked in wine and the cross',()=>{
 const scene=src('scene.ts');assert.match(scene,/const pile=P\.pile\?pileTag\(moves,shown\):null;if\(pile\)this\.pileLabel\(P\.tags\[pile\.top\],pile\);/);
 assert.match(scene,/fill\(\{color:p\.voidBelow\?WINE:INK\}\)/);assert.match(scene,/if\(p\.voidBelow\)\{const g=new Graphics\(\);drawMark\(g as unknown as Pen,'cross'/);
});

// ---- Depth: the shadow the cards already had, a little deeper and softer ----
test('shadow: same direction and drawing as today (down and right), a little deeper, a soft edge, no shadow towards the top or the left',()=>{
 assert.ok(CARD_SHADOW.dx>4&&CARD_SHADOW.dy>6&&close(CARD_SHADOW.dy/CARD_SHADOW.dx,6/4),'further, same direction as 4×6');
 assert.ok(CARD_SHADOW.dx<=6&&CARD_SHADOW.dy<=9,'only a little');
 for(const [w,h] of [[214,295],[120,166],[60,83],[18,25],[26,36]]){const L=cardShadow(w,h);
  assert.ok(L.length>=3,'a soft edge needs several steps');
  for(const r of L){assert.ok(r.x>=-w/2&&r.y>=-h/2,`${w}×${h}: nothing out at the top or the left (${r.x},${r.y})`);}
  const outer=L[0],inner=L[L.length-1];assert.ok(outer.w>inner.w&&outer.h>inner.h,'from larger to smaller');
  assert.ok(outer.x+outer.w>w/2+4&&outer.y+outer.h>h/2+6,'reaches beyond today\'s 4×6');assert.ok(outer.x+outer.w-(w/2)<=8&&outer.y+outer.h-(h/2)<=11,'not enormous');
  const middle=1-L.reduce((a,r)=>a*(1-r.alpha),1);assert.ok(middle>.6&&middle<=.7,`middle ${middle}: a little deeper than 60%`);
  assert.ok(L.every(r=>r.alpha<.6),'each step lighter than today\'s one shadow: the edge fades');}
 const frame=/private frame\(w:number,h:number[^\n]*/.exec(src('scene.ts'))![0];assert.match(frame,/for\(const l of cardShadow\(w,h\)\)shadow\.roundRect\(l\.x,l\.y,l\.w,l\.h,l\.r\)\.fill\(\{color:CARD_SHADOW\.color,alpha:l\.alpha\}\)/);
 assert.doesNotMatch(frame,/BlurFilter|NineSlice|Sprite/,'drawn in code, no filter or texture per card');
});

// ---- d (O28): viewport-fit=cover and safe areas ----
const sum=(L:TableLayout)=>[L.hand.center,L.preview.x,...L.seats.flatMap(s=>[s.person,...s.items,s.backs,s.board,s.status].map(b=>b.x)),...(L.played?[L.played.box,...L.played.slots,...L.played.tags].map(b=>b.x):[]),...(L.piles?[L.piles.deck.x,L.piles.discard.x]:[])];
test('d: the table is laid out in the safe width and moved by the left inset; no inset, the same layout',()=>{
 for(const [w,h,n] of [[874,292,5],[874,292,2],[844,390,5]] as const){const l=tableLayout(w-124,h,ids(n),'me',items(n,1)),s=shiftLayout(l,62);
  assert.equal(shiftLayout(l,0),l);assert.equal(s.inset,62);
  const a=sum(l),b=sum(s);assert.equal(a.length,b.length);a.forEach((x,i)=>assert.ok(close(b[i]-x,62),`box ${i}`));
  assert.deepEqual(s.seats.map(x=>[x.person.w,x.person.h,x.person.y]),l.seats.map(x=>[x.person.w,x.person.h,x.person.y]),'sizes and heights unchanged');
  assert.ok(close(confirmTextBox(s,h).x-confirmTextBox(l,h).x,62)&&close(confirmTextBox(s,h).w,confirmTextBox(l,h).w),'the text of the move moves with the table');}
});
test('d: insets from env() or the verification stand-in, written for the shell; viewport-fit=cover in index.html; shell inside the safe area',()=>{
 const g=globalThis as unknown as {__bmSafe?:unknown};assert.deepEqual(safeInsets(),{l:0,r:0},'no document, no insets');
 g.__bmSafe={l:62,r:'48'};assert.deepEqual(safeInsets(),{l:62,r:48});g.__bmSafe={l:-5,r:'x'};assert.deepEqual(safeInsets(),{l:0,r:0});delete g.__bmSafe;
 const set:Record<string,string>={};applySafeInsets({style:{setProperty:(k,v)=>{set[k]=v;}}},{l:62,r:10});assert.deepEqual(set,{'--safe-l':'62px','--safe-r':'10px'});
 assert.match(readFileSync(new URL('../index.html',import.meta.url),'utf8'),/<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">/);
 const css=postcss.parse(src('style.css')),uses:Record<string,string[]>={};css.walkRules((r:any)=>{if(['.brand','.top-actions','.hint'].includes(r.selector))r.walkDecls((d:any)=>{if(/var\(--safe-[lr]\)/.test(d.value))(uses[r.selector]??=[]).push(`${d.prop}:${d.value}`);});});
 assert.deepEqual(uses['.brand'],['left:calc(20px + var(--safe-l))']);assert.deepEqual(uses['.top-actions'],['right:calc(16px + var(--safe-r))','right:calc(8px + var(--safe-r))']);
 assert.deepEqual(uses['.hint'],['left:calc(14px + var(--safe-l))','left:calc(10px + var(--safe-l))']);
 const scene=src('scene.ts');assert.match(scene,/this\.safe=safeInsets\(\);/);assert.match(scene,/const L=sl\|\|sr\?shiftLayout\(tableLayout\(w-sl-sr,h,ids,me,counts\),sl\):tableLayout\(w,h,ids,me,counts\);/);
 assert.match(src('main.tsx'),/applySafeInsets\(document\.documentElement\);addEventListener\('resize',\(\)=>applySafeInsets\(document\.documentElement\)\);/);
});

// ---- v1: VerifyAim at 844×390 ----
test('v1: from every slot, the card raised and at rest (a bound waiting for its discard), no arrow crosses the old place of ✓ and ×',()=>{
 const found:string[]=[];
 for(const [w,h] of [[1366,768],[844,390],[1920,1080],[750,292]])for(const n of [2,5])for(const k of [1,3]){const L=tableLayout(w,h,ids(n),'me',items(n,k)),H=L.hand,avoid=[confirmButtons(L.preview,w,L.compact)];
  const targets=L.seats.flatMap(s=>[{id:`person-${s.id}`,owner:s.id,kind:'person' as const,box:s.person},{id:`item-${s.id}`,owner:s.id,kind:'item' as const,box:s.items[s.items.length-1]}]);
  for(const cards of [5,6,7,8])for(let i=0;i<cards;i++)for(const card of ['raised','resting']){const r=raisedCard(H,i,cards),s=handSlot(H,i,cards),from:Box=card==='raised'?{x:r.x,y:r.y,w:r.w,h:r.h}:{x:s.x,y:s.y-H.lift/2,w:H.w,h:H.h-H.lift};
   for(const a of aimArrows(from,targets,{w,h},{avoid,head:L.compact?20:30})){if(a.crosses&&!a.reached)found.push(`${w}×${h} ${n} seats ${k} obj, slot ${i}/${cards} ${card} → ${a.id}`);
    // VerifyAim: the tip within 8 px of the border of its target, inside the screen.
    const t=targets.find(x=>x.id===a.id)!.box,dx=Math.max(0,Math.abs(a.to.x-t.x)-t.w/2),dy=Math.max(0,Math.abs(a.to.y-t.y)-t.h/2);
    assert.ok(Math.hypot(dx,dy)<=8,`tip ${a.id} ${Math.hypot(dx,dy)} px from its target`);assert.ok(inside({...a.to,w:0,h:0},w,h));}}}
 assert.deepEqual(found,[]);
});
test('v1: an arrow already clear keeps the tip facing the card',()=>{
 const L=tableLayout(1366,768,ids(2),'me',items(2,1)),H=L.hand,r=raisedCard(H,3,7),b=L.seats[1].person;
 const [a]=aimArrows({x:r.x,y:r.y,w:r.w,h:r.h},[{id:'p',owner:'b',kind:'person',box:b}],{w:1366,h:768},{avoid:[confirmButtons(L.preview,1366,false)]});
 const [plain]=aimArrows({x:r.x,y:r.y,w:r.w,h:r.h},[{id:'p',owner:'b',kind:'person',box:b}],{w:1366,h:768});
 assert.equal(a.crosses,false);assert.deepEqual(a.to,plain.to);
});

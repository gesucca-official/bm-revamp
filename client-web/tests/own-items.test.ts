import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ownItemRow,tableLayout,layoutProblems,overlap,inside,coveredItems,growth,type Box} from '../src/readability.ts';
const before=JSON.parse(readFileSync(new URL('./o27-before.json',import.meta.url),'utf8'));

test('O27: whole screen/count matrix preserves FFA exactly, scales, piles, round and 750 baseline',()=>{
 assert.equal(before.sourceCommit,'f6e69fd');
 for(const [key,base] of Object.entries(before.layouts) as [string,ReturnType<typeof tableLayout>][]){
  const [wh,count,own,others]=key.split(':'),[w,h]=wh.split('x').map(Number),seats=Number(count),ids=['me','b','c','d','e'].slice(0,seats);
  const l=tableLayout(w,h,ids,'me',Object.fromEntries(ids.map(id=>[id,Number(id==='me'?own:others)])));
  // C4-11 (owner, 10 November 2026): b1 lets every size grow on a large screen (1920×1080 here) and a2 turns the round's cards of a compact table
  // into one pile. Those two are compared as «never smaller» (and, for the pile, the place of each strip, see readability.test.ts); the rest stays identical.
  const grown=growth(w,h,h<550)>1,round=(x:typeof l)=>({...x,played:null});
  if(grown){assert.ok(l.hand.w>=base.hand.w&&l.hand.step>=base.hand.step,`${key}: hand`);assert.ok(l.piles!.deck.w>=base.piles!.deck.w,`${key}: piles`);
   for(const s of l.seats){const o=base.seats.find(b=>b.id===s.id)!;for(const [a,b] of [[s.person,o.person],[s.items[0],o.items[0]],[s.board,o.board]])assert.ok(a.w>=b.w-.01,`${key}: ${s.id} not smaller`);}}
  else{if(seats===5)assert.deepEqual(round(l),round(base),`${key}: every FFA box identical to before`);assert.deepEqual(l.hand,base.hand,`${key}: hand`);assert.deepEqual(l.piles,base.piles,`${key}: piles`);}
  for(const k of ['me','others','items','resources'] as const)assert.ok(l.scale[k]>=base.scale[k],`${key}: factor ${k}`);
  if(l.played?.pile||grown){if(base.played)assert.ok(l.played&&l.played.slots[0].w>=base.played.slots[0].w-.01,`${key}: round cards not smaller`);}
  else assert.deepEqual(l.played,base.played,`${key}: round`);
  assert.ok(layoutProblems(l,w,h).length<=layoutProblems(base,w,h).length,`${key}: problem count cannot rise`);
  // C4-11 a2: where the cascade had no place the pile may find one, one problem less ('no round cards'); nothing else changes at 750×292.
  if(w===750)assert.deepEqual(layoutProblems(l,w,h),layoutProblems(base,w,h).filter(p=>!(l.played?.pile&&!base.played&&p==='no round cards')),`${key}: 750 problems unchanged`);
  if(seats===2){const mine=l.seats[0],old=base.seats[0],beside=mine.items[0].x>mine.person.x,step=mine.items.length>1?mine.items[1].x-mine.items[0].x:mine.items[0].w+6;
   // C4-11 b1: on a grown table the row is built from the grown objects; its placement is read from the boxes.
   const choice=grown?{items:mine.items,placement:!beside?'above':step>=mine.items[0].w+5.99?'full':'overlap'}:ownItemRow(old.items,mine.person,l.hand,{w,h});assert.deepEqual(mine.items,choice.items);
   // C4-11 b1: at 1920×1080 the grown hand leaves no room beside the grown character, so O27 takes its last choice, the row above the seat.
   if(w===1920){assert.equal(choice.placement,grown?'above':Number(own)===1?'full':Number(own)===2?'overlap':'above',key);}
   else assert.equal(choice.placement,'above',key);
   if(choice.placement==='full')assert.ok(coveredItems(mine.items).every(x=>!x),`${key}: full step has no K7 overlap`);
   if(choice.placement==='overlap')assert.ok(coveredItems(mine.items).some(Boolean),`${key}: fallback retains K7`);
   if(!grown)for(const s of l.seats.slice(1))assert.deepEqual(s,base.seats.find(b=>b.id===s.id),`${key}: opponents`);
  }
 }
});

test('O27: full step first, overlap second, above last; exact geometric boundaries and no input mutation',()=>{
 const items:Box[]=[{x:10,y:20,w:20,h:20},{x:36,y:20,w:20,h:20}],person={x:50,y:100,w:40,h:40};
 const hand=(left:number)=>({w:20,h:40,step:10,center:left+40,y:100,lift:0,zoom:1}),screen={w:500,h:200};
 const snapshot=structuredClone(items);
 const full=ownItemRow(items,person,hand(132),screen);assert.equal(full.placement,'full');assert.equal(full.items[1].x-full.items[0].x,26);assert.equal(overlap(...full.items as [Box,Box]),0);
 const fallback=ownItemRow(items,person,hand(131),screen);assert.equal(fallback.placement,'overlap');assert.equal(fallback.items[1].x-fallback.items[0].x,15);
 assert.equal(ownItemRow(items,person,hand(100),screen).placement,'above');
 assert.equal(ownItemRow(items,person,hand(300),{w:100,h:200}).placement,'above','neither whole row fits viewport');
 assert.equal(ownItemRow(items.slice(0,1),person,hand(300),{w:100,h:200}).placement,'full','one full box fits viewport');
 for(const b of full.items)assert.ok(inside(b,screen.w,screen.h));
 assert.deepEqual(items,snapshot);assert.deepEqual(ownItemRow([],person,hand(132),screen),{items:[],placement:'above'});
});

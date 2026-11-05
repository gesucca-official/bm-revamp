import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ownItemRow,tableLayout,layoutProblems,overlap,inside,coveredItems,type Box} from '../src/readability.ts';
const before=JSON.parse(readFileSync(new URL('./o27-before.json',import.meta.url),'utf8'));

test('O27: whole screen/count matrix preserves FFA exactly, scales, piles, round and 750 baseline',()=>{
 assert.equal(before.sourceCommit,'f6e69fd');
 for(const [key,base] of Object.entries(before.layouts) as [string,ReturnType<typeof tableLayout>][]){
  const [wh,count,own,others]=key.split(':'),[w,h]=wh.split('x').map(Number),seats=Number(count),ids=['me','b','c','d','e'].slice(0,seats);
  const l=tableLayout(w,h,ids,'me',Object.fromEntries(ids.map(id=>[id,Number(id==='me'?own:others)])));
  if(seats===5)assert.deepEqual(l,base,`${key}: every FFA box identical to before`);
  for(const k of ['me','others','items','resources'] as const)assert.ok(l.scale[k]>=base.scale[k],`${key}: factor ${k}`);
  assert.deepEqual(l.hand,base.hand,`${key}: hand`);assert.deepEqual(l.piles,base.piles,`${key}: piles`);assert.deepEqual(l.played,base.played,`${key}: round`);
  assert.ok(layoutProblems(l,w,h).length<=layoutProblems(base,w,h).length,`${key}: problem count cannot rise`);
  if(w===750)assert.deepEqual(layoutProblems(l,w,h),layoutProblems(base,w,h),`${key}: 750 problems unchanged`);
  if(seats===2){const mine=l.seats[0],old=base.seats[0],choice=ownItemRow(old.items,mine.person,l.hand,{w,h});assert.deepEqual(mine.items,choice.items);
   if(w===1920){assert.equal(choice.placement,Number(own)===1?'full':Number(own)===2?'overlap':'above',key);}
   else assert.equal(choice.placement,'above',key);
   if(choice.placement==='full')assert.ok(coveredItems(mine.items).every(x=>!x),`${key}: full step has no K7 overlap`);
   if(choice.placement==='overlap')assert.ok(coveredItems(mine.items).some(Boolean),`${key}: fallback retains K7`);
   for(const s of l.seats.slice(1))assert.deepEqual(s,base.seats.find(b=>b.id===s.id),`${key}: opponents`);
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

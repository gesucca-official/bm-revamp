// C4-8b (owner, 11 November 2026: «Velocizza closeUp»): the faster search of the close-up's place gives EXACTLY the result of the search it
// replaces. `reference` below is the function as it was at 29db541, copied verbatim; every case compares the whole answer (boxes, scale,
// placed) with deepStrictEqual, on the layouts the scene really builds and on random obstacles that reach the fallback in the seat.
import test from 'node:test';
import assert from 'node:assert/strict';
import {closeUp,closeUpRange,overlap,seatBoxes,tableLayout,type Box,type CloseUp} from '../src/readability.ts';

function reference(person:Box,screen:{w:number;h:number},avoid:Box[],o:{max?:number;min?:number;margin?:number;step?:number;near?:number}={}):CloseUp{
 const max=o.max??1.6,min=o.min??1.15,m=o.margin??6,step=o.step??8,mid={x:screen.w*.5,y:screen.h*.42},near=(o.near??.4)*Math.min(screen.w,screen.h);
 let nearest:CloseUp|null=null,nearestD=Infinity;
 const shape=(s:number,x:number,y:number):CloseUp=>{const pw=person.w*s,ph=person.h*s,ch=ph*.82,cw=ch/1.38,gap=Math.max(6,pw*.08),w=pw+gap+cw;
  return {person:{x:x-w/2+pw/2,y,w:pw,h:ph},card:{x:x+w/2-cw/2,y,w:cw,h:ch},box:{x,y,w,h:ph},scale:s,placed:'middle'};};
 for(let k=Math.round(max*20);k>=Math.round(min*20);k--){const s=k/20,probe=shape(s,0,0).box;let best:CloseUp|null=null,dist=Infinity;
  for(let y=probe.h/2+m;y<=screen.h-probe.h/2-m;y+=step)for(let x=probe.w/2+m;x<=screen.w-probe.w/2-m;x+=step){
   const d=Math.hypot(x-mid.x,y-mid.y);if(d>=dist)continue;const c=shape(s,x,y),pad={...c.box,w:c.box.w+2*m,h:c.box.h+2*m};
   if(avoid.some(a=>overlap(pad,a)>0))continue;best=c;dist=d;}
  if(best&&dist<=near)return best;if(best&&dist<nearestD-1){nearest=best;nearestD=dist;}}
 if(nearest)return nearest;
 const c=shape(min,person.x,person.y),bx=Math.max(c.box.w/2+m,Math.min(screen.w-c.box.w/2-m,c.box.x+c.box.w/2-c.person.w/2)),by=Math.max(c.box.h/2+m,Math.min(screen.h-c.box.h/2-m,c.box.y));
 return {...shape(min,bx,by),placed:'seat'};}

// The official measures, 1920×1080, 750×292 (rule 18) and a portrait screen.
const SIZES:[number,number][]=[[1366,768],[844,390],[1920,1080],[750,292],[390,844]];
const SEATS=[['me','b'],['me','b','c'],['me','b','c','d'],['me','b','c','d','e']];

test('closeUp equals the reference search on the layouts of the scene (sizes, seats, objects, hand, piles, both ranges, steps 8 and 12)',()=>{
 let cases=0;const placed={middle:0,seat:0};
 for(const [w,h] of SIZES)for(const ids of SEATS)for(const items of [0,3])for(const n of [0,7]){
  const l=tableLayout(w,h,ids,'me',Object.fromEntries(ids.map(id=>[id,items]))),H=l.hand;
  // The fan as the scene and layoutProblems draw it, with the lift of a raised card.
  const hand:Box[]=Array.from({length:n},(_,i)=>({x:H.center+(i-(n-1)/2)*H.step,y:H.y-H.lift/2,w:H.w*H.zoom,h:H.h+H.lift}));
  const piles=[...(l.played?[l.played.box]:[]),...(l.piles?[l.piles.deck,l.piles.discard]:[])];
  for(const seat of l.seats){const avoid=[...l.seats.filter(x=>x!==seat).flatMap(seatBoxes),...hand];
   for(const list of [avoid,[...avoid,...piles]])for(const range of [closeUpRange(seat.me),{...closeUpRange(seat.me),step:12}]){
    const want=reference(seat.person,{w,h},list,range),got=closeUp(seat.person,{w,h},list,range);
    assert.deepStrictEqual(got,want,`${w}×${h}, ${ids.length} seats, ${items} objects, ${n} in hand, ${seat.id}`);cases++;placed[want.placed]++;}}}
 assert.ok(cases>1000,`${cases} cases`);assert.ok(placed.middle>0);
});

test('closeUp equals the reference search on random obstacles, including no free place (fallback in the seat) and boxes off the rows',()=>{
 let seed=20261111;const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
 const placed={middle:0,seat:0};
 for(let i=0;i<300;i++){const [w,h]=SIZES[i%SIZES.length],person={x:rnd()*w,y:rnd()*h,w:40+rnd()*120,h:60+rnd()*160};
  const avoid:Box[]=Array.from({length:Math.floor(rnd()*40)},()=>({x:rnd()*w,y:rnd()*h*1.2-h*.1,w:5+rnd()*w*.4,h:5+rnd()*h*.4}));
  if(i%7===0)avoid.push({x:w/2,y:h/2,w:w*(.6+rnd()*.5),h:h*(.6+rnd()*.5)});
  const o=[{},{min:1,max:1.3},{step:12},{margin:2+rnd()*10,near:rnd()},{step:5+Math.floor(rnd()*10)}][i%5];
  const want=reference(person,{w,h},avoid,o);assert.deepStrictEqual(closeUp(person,{w,h},avoid,o),want,`case ${i}`);placed[want.placed]++;}
 assert.ok(placed.middle>30&&placed.seat>3,JSON.stringify(placed));
});

test('closeUp equals the reference when a box only touches the padded close-up along an edge (no overlap, the place stays free)',()=>{
 // Scale 1: padded height 100+12; the nearest grid point to the middle is y=248 (tie with 256, the first in the scan wins), whose padded
 // box starts at y=192, where this box ends: zero vertical overlap, so the point is free and the answer stays at 248.
 const person={x:100,y:500,w:50,h:100},screen={w:1000,h:600},touch={x:500,y:182,w:200,h:20},o={min:1,max:1};
 const want=reference(person,screen,[touch],o);assert.equal(want.box.y,248);assert.deepStrictEqual(closeUp(person,screen,[touch],o),want);
});

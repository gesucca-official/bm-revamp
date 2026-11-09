// C4-11 Phase A: pure probe of the table geometry (no browser, no server). Not a verification: nothing fails.
// For each size and seat count it records the factors of fitScale (rule 17), the sizes of hand, characters, objects, boards, round
// cards and piles, how much of the screen each kind of element covers and where the screen stays empty, layoutProblems (rule 18)
// and, for every slot of the hand, the aim arrows that the scene flags as crossing the old place of ✓ and × (VerifyAim at 844×390).
// BM_SPACE sets localStorage 'bm.space' before the client code loads: only a build with the C4-11 prototype patch reads it.
// Usage (client-web): node tools/space-probe.mjs  ·  BM_SPACE=b1 BM_OUT=%TEMP%\spazio node tools/space-probe.mjs
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';

const space=process.env.BM_SPACE??'';
globalThis.localStorage={getItem:k=>k==='bm.space'?space:null,setItem(){},removeItem(){}};
const R=await import('../src/readability.ts');
const out=process.env.BM_OUT??join(tmpdir(),'bm-c4-11-space');
const sizes=(process.env.BM_SIZES??'1366x768,844x390,1920x1080,750x292').split(',');
await mkdir(out,{recursive:true});
const r1=x=>Math.round(x*10)/10,box=b=>b&&{x:r1(b.x),y:r1(b.y),w:r1(b.w),h:r1(b.h)};

// Coverage on a 2 px grid: each cell takes the first kind that covers it, in this order (the hand over the seats, and so on).
function coverage(L,w,h){const H=L.hand,shell=R.shellBoxes(w,h,L.compact),cell=2,cols=Math.ceil(w/cell),rows=Math.ceil(h/cell);
 const kinds={hand:[],seats:[],items:[],backs:[],round:[],piles:[],shell:[]};
 for(let i=0;i<7;i++){const s=R.handSlot(H,i,7);kinds.hand.push({x:s.x,y:s.y,w:H.w,h:H.h});}
 for(const s of L.seats){kinds.seats.push(s.person,s.board);kinds.items.push(...s.items);if(!s.me)kinds.backs.push(R.fan(s.backs,s.back,8).box);}
 if(L.played)kinds.round.push(L.played.box);if(L.piles)kinds.piles.push(L.piles.deck,L.piles.discard);
 kinds.shell.push(shell.hint,shell.top,R.brandBox(L.compact));
 const grid=new Uint8Array(cols*rows),order=Object.keys(kinds);
 order.forEach((k,ki)=>{for(const b of kinds[k]){const x0=Math.max(0,Math.floor((b.x-b.w/2)/cell)),x1=Math.min(cols,Math.ceil((b.x+b.w/2)/cell)),y0=Math.max(0,Math.floor((b.y-b.h/2)/cell)),y1=Math.min(rows,Math.ceil((b.y+b.h/2)/cell));
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(!grid[y*cols+x])grid[y*cols+x]=ki+1;}});
 const share={};order.forEach((k,ki)=>{let n=0;for(const v of grid)if(v===ki+1)n++;share[k]=r1(100*n/grid.length);});
 let empty=0;for(const v of grid)if(!v)empty++;
 // Empty share in a 3×3 grid of the screen (rows top/middle/bottom, columns left/centre/right).
 const nine=[];for(let ry=0;ry<3;ry++){const row=[];for(let rx=0;rx<3;rx++){let n=0,e=0;for(let y=Math.floor(ry*rows/3);y<Math.floor((ry+1)*rows/3);y++)for(let x=Math.floor(rx*cols/3);x<Math.floor((rx+1)*cols/3);x++){n++;if(!grid[y*cols+x])e++;}row.push(Math.round(100*e/n));}nine.push(row);}
 // Largest empty rectangle (histogram method on the grid), in px.
 let best={area:0},hist=new Array(cols).fill(0);
 for(let y=0;y<rows;y++){for(let x=0;x<cols;x++)hist[x]=grid[y*cols+x]?0:hist[x]+1;const st=[];
  for(let x=0;x<=cols;x++){const hh=x<cols?hist[x]:0;let start=x;while(st.length&&st[st.length-1][1]>=hh){const [sx,sh]=st.pop();const a=sh*(x-sx);if(a>best.area)best={area:a,x:sx*cell,y:(y-sh+1)*cell,w:(x-sx)*cell,h:sh*cell};start=sx;}st.push([start,hh]);}}
 return {share,empty:r1(100*empty/grid.length),nine,largestEmpty:best.area?{x:best.x,y:best.y,w:best.w,h:best.h,share:r1(100*best.area/grid.length)}:null};}

// Smallest gap between two elements of different seats, between a seat and the hand at rest, and between a seat and the round's cards.
function gaps(L,w,h){const H=L.hand,hand={x:H.center,y:H.y,w:H.w+6*H.step,h:H.h},gap=(a,b)=>Math.max(Math.abs(a.x-b.x)-(a.w+b.w)/2,Math.abs(a.y-b.y)-(a.h+b.h)/2);
 const own=s=>[s.person,s.board,...s.items,...(s.me?[]:[R.fan(s.backs,s.back,8).box])];let seats=Infinity,toHand=Infinity,toRound=Infinity;
 for(const s of L.seats){for(const o of L.seats)if(o!==s)for(const a of own(s))for(const b of own(o))seats=Math.min(seats,gap(a,b));
  for(const a of own(s)){toHand=Math.min(toHand,gap(a,hand));if(L.played)toRound=Math.min(toRound,gap(a,L.played.box));}}
 return {seats:r1(seats),toHand:r1(toHand),toRound:r1(toRound)};}

// Aim arrows from every slot of a hand of n cards to every character and the last object of every seat, as drawAim builds them.
function aim(L,w,h,n){const H=L.hand,avoid=[R.confirmButtons(L.preview,w,L.compact)],res=[];
 const targets=L.seats.flatMap(s=>[{id:`person-${s.id}`,owner:s.id,kind:'person',box:s.person},{id:`item-${s.id}`,owner:s.id,kind:'item',box:s.items[s.items.length-1]}]);
 // A chosen card is raised (drawAim: the hit less its lift); a chosen bound rests in its slot (O26: it waits for its discard), so its arrows start lower.
 for(let i=0;i<n;i++)for(const card of ['raised','resting']){const r=R.raisedCard(H,i,n),s=R.handSlot(H,i,n),src=card==='raised'?{x:r.x,y:r.y,w:r.w,h:r.h}:{x:s.x,y:s.y-H.lift/2,w:H.w,h:H.h-H.lift};
  for(const a of R.aimArrows(src,targets,{w,h},{avoid,head:L.compact?20:30}))if(a.crosses&&!a.reached)res.push({slot:i,n,card,to:a.id,from:{x:r1(a.from.x),y:r1(a.from.y)},tip:{x:r1(a.to.x),y:r1(a.to.y)}});}
 return {reserved:box(avoid[0]),crossing:res};}

// BM_CAPTURES=<captures-*.json of guide-captures.mjs with BM_LAYOUT=1>: the same coverage and gaps on the layouts recorded in real games
// (real objects per seat and real hand size), one line per run and moment, written next to the probe.
if(process.env.BM_CAPTURES){const {readFile}=await import('node:fs/promises');const cap=JSON.parse(await readFile(process.env.BM_CAPTURES,'utf8')),lines=[];
 for(const run of cap.runs){const [w,h]=run.size.split('x').map(Number);
  for(const m of run.moments){if(!m.layout)continue;const L=m.layout,hand=m.hits.filter(x=>x.kind==='hand').length,items=Object.fromEntries(L.seats.map(s=>[s.id,s.items.length]));
   lines.push({mode:run.mode,size:run.size,space:run.space,turn:m.turn,moment:m.name,hand,items,scale:L.scale,coverage:coverage(L,w,h),gaps:gaps(L,w,h),
    sizes:{hand:{w:r1(L.hand.w),h:r1(L.hand.h),step:r1(L.hand.step)},own:box(L.seats.find(s=>s.me).person),other:box(L.seats.find(s=>!s.me).person),round:L.played&&{w:r1(L.played.slots[0].w),h:r1(L.played.slots[0].h)}},shell:m.shell});}}
 const file=join(out,`space-real${cap.space?`-${cap.space.replace(/[^a-z0-9]+/gi,'_')}`:'-oggi'}.json`);await writeFile(file,JSON.stringify({date:new Date().toISOString(),source:process.env.BM_CAPTURES,lines},null,1));
 for(const l of lines.filter(l=>l.moment==='scelta'))console.log(`real ${l.mode} ${l.size} T${l.turn} hand ${l.hand}: empty ${l.coverage.empty}% hand ${l.coverage.share.hand}% seats+items+backs ${r1(l.coverage.share.seats+l.coverage.share.items+l.coverage.share.backs)}% round ${l.coverage.share.round}% shell ${l.coverage.share.shell}% largest empty ${JSON.stringify(l.coverage.largestEmpty)} gaps ${JSON.stringify(l.gaps)}`);
 console.log('written',file);process.exit(0);}
const rows=[],report={date:new Date().toISOString(),space:space||null,kind:'pure probe of readability.ts (tableLayout, fitScale, layoutProblems, aimArrows); no browser, no server',runs:rows};
for(const size of sizes){const [w,h]=size.split('x').map(Number);
 for(const n of [2,5]){const ids=['me','b','c','d','e'].slice(0,n);
  for(const items of [1,3]){const L=R.tableLayout(w,h,ids,'me',Object.fromEntries(ids.map(i=>[i,items]))),mine=L.seats.find(s=>s.me),other=L.seats.find(s=>!s.me);
   const problems=R.layoutProblems(L,w,h);
   const hands=[5,6,7,8].map(k=>({n:k,...aim(L,w,h,k)}));
   rows.push({size,seats:n,items,compact:L.compact,scale:L.scale,
    dims:{hand:{w:r1(L.hand.w),h:r1(L.hand.h),step:r1(L.hand.step),lift:L.hand.lift,zoom:L.hand.zoom},own:box(mine.person),other:box(other.person),item:box(other.items[0]),ownItem:box(mine.items[0]),ownBoard:box(mine.board),otherBoard:box(other.board),
     back:{w:r1(other.back.w),h:r1(other.back.h)},round:L.played&&{card:{w:r1(L.played.slots[0].w),h:r1(L.played.slots[0].h)},box:box(L.played.box)},piles:L.piles&&{w:r1(L.piles.deck.w),h:r1(L.piles.deck.h)},preview:{w:L.preview.w,h:L.preview.h}},
    coverage:coverage(L,w,h),gaps:gaps(L,w,h),layoutProblems:problems.length,problems,
    aim:{reserved:hands[0].reserved,crossing:hands.flatMap(x=>x.crossing)}});}}}
const file=join(out,`space-probe${space?`-${space.replace(/[^a-z0-9]+/gi,'_')}`:'-oggi'}.json`);
await writeFile(file,JSON.stringify(report,null,1));
for(const r of rows)console.log(`${r.size} ${r.seats===2?'duel':'ffa '} items ${r.items}: scale ${JSON.stringify(r.scale)} hand ${r.dims.hand.w}x${r.dims.hand.h} own ${r.dims.own.w}x${r.dims.own.h} other ${r.dims.other.w}x${r.dims.other.h} item ${r.dims.item.w} round ${r.dims.round?.card.w??'-'} | empty ${r.coverage.empty}% hand ${r.coverage.share.hand}% seats ${r.coverage.share.seats}% | gaps ${JSON.stringify(r.gaps)} | problems ${r.layoutProblems} | crossing ${r.aim.crossing.length}`);
console.log('written',file);

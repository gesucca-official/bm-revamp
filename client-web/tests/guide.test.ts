// C4-10, phase B: strategy B «Richiamo», O29 and O30 (owner's choice of 9 November 2026, docs/design/client-c4/guida/proposta.md).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GUIDE,guideFocus,guideMotion,GuideRest,hitAt,handSlot,raisedCard,confirmCard,shortSummary,handCardState,tableLayout,type GuideInput,type GuideBeat,type Posable} from '../src/readability.ts';
import {Model} from '../src/model.ts';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures.json',import.meta.url),'utf8'));

const hand=[{key:'c0',regular:true},{key:'c1',regular:false},{key:'c2',regular:true},{key:'c3',regular:true},{key:'basic',regular:false}];
const base:GuideInput={over:false,phase:'choose',selected:null,target:false,choosingDiscard:false,discard:null,hand,allowed:[],dest:null,preview:null,waiting:['b'],sequence:null};
const at=(o:Partial<GuideInput>)=>guideFocus({...base,...o});
const beats:GuideBeat[]=[{from:0,to:2400,hit:1500,author:'me',target:'b'},{from:2400,to:5200,hit:4100,author:'b',target:'b'},{from:5200,to:8000,hit:7000,author:'c',target:'me'}];

test('C4-10 focus: choice, the whole hand waves; nothing else moves',()=>{
 const f=at({});assert.equal(f.kind,'choose');assert.deepEqual(f.wave,hand.map(c=>c.key));assert.deepEqual(f.pulse,[]);assert.deepEqual(f.grow,[]);
});
test('C4-10 focus: aim with one and with four admitted targets, they pulse; the chosen card is in focus but does not move',()=>{
 const one=at({selected:'c0',allowed:['person-b']});assert.equal(one.kind,'aim');assert.deepEqual(one.pulse,['person-b']);assert.deepEqual(one.ids,['c0','person-b']);assert.deepEqual(one.wave,[]);
 const four=['person-b','person-c','person-d','item-c-0'],f=at({selected:'c0',allowed:four});assert.deepEqual(f.pulse,four);assert.equal(f.ids.length,5);
 assert.equal(at({selected:'c0',allowed:[]}).pulse.length,0,'a card without admitted targets moves nothing');
 assert.equal(at({selected:'c1',choosingDiscard:true,allowed:['person-b']}).kind,'aim','a bound before its target is still aimed');
});
test('C4-10 focus: confirmation without and with a discard; the discard card stays still under ✓ and ×',()=>{
 const f=at({selected:'c0',target:true,preview:'c0',dest:'person-b'});assert.equal(f.kind,'confirm');assert.deepEqual(f.pulse,['c0','person-b']);assert.deepEqual(f.ids,['c0','person-b']);
 const d=at({selected:'c1',target:true,preview:'c1',dest:'person-b',discard:'c2'});assert.equal(d.kind,'confirm');assert.deepEqual(d.pulse,['c1','person-b']);assert.deepEqual(d.ids,['c1','person-b','c2']);
 assert.ok(!d.pulse.includes('c2')&&!d.wave.includes('c2'),'✓ and × lie on the discard: it does not move');
});
test('C4-10 focus: discard, only the regular cards of the hand wave, the placed card stays in focus',()=>{
 const f=at({selected:'c1',target:true,choosingDiscard:true,preview:'c1',dest:'person-b'});assert.equal(f.kind,'discard');
 assert.deepEqual(f.wave,['c0','c2','c3']);assert.deepEqual(f.ids,['c0','c2','c3','c1']);assert.deepEqual(f.pulse,[]);
});
test('C4-10 focus: waiting (sending, pending, uncertain), the opponents still in the game pulse lightly',()=>{
 for(const phase of ['sending','pending','uncertain'] as const){const f=at({phase,selected:phase==='sending'?'c0':null,target:phase==='sending',waiting:['b','c']});
  assert.equal(f.kind,'wait',phase);assert.deepEqual(f.pulse,['person-b','person-c']);assert.deepEqual(f.wave,[]);}
 const m=guideMotion(at({phase:'pending',waiting:['b']}),{now:1000,since:0,compact:false,reduced:false}),k=m.pose['person-b'].scale;
 assert.ok(k>=1&&k<=1+GUIDE.pulse.wait+1e-9,'the light pulse');
});
test('C4-10 focus: sequence, halfway through each card its author and target grow; the strike shakes the table',()=>{
 const expect=[['person-me','person-b'],['person-b'],['person-c','person-me']];
 beats.forEach((b,i)=>{const t=(b.from+b.to)/2,f=at({sequence:{t,beats}});assert.equal(f.kind,'sequence');assert.deepEqual(f.grow,expect[i],`card ${i}`);assert.equal(!!f.hit,t>=b.hit,`card ${i} strike`);
  const m=guideMotion(f,{now:t,since:0,compact:false,reduced:false});for(const id of expect[i])assert.equal(m.pose[id].scale,1+GUIDE.grow);});
 const s=at({sequence:{t:1500+GUIDE.shake.ms*.3,beats}});assert.equal(s.hit?.seat,'b');const m=guideMotion(s,{now:0,since:0,compact:false,reduced:false});
 assert.ok(Math.abs(m.shake)>0&&Math.abs(m.shake)<=GUIDE.shake.amp,'shake while it strikes');
 assert.equal(guideMotion(at({sequence:{t:1500+GUIDE.shake.ms+1,beats}}),{now:0,since:0,compact:false,reduced:false}).shake,0,'and only for its time');
 assert.ok(Math.abs(guideMotion(at({sequence:{t:1500+GUIDE.shake.ms*.3,beats}}),{now:0,since:0,compact:true,reduced:false}).shake)<=GUIDE.shake.ampCompact,'smaller when compact');
 const gap=at({sequence:{t:9000,beats}});assert.equal(gap.kind,'sequence');assert.deepEqual(gap.ids,[],'past the cards, nothing grows');
});
test('C4-10 focus: a choice during the sequence wins over it (rule 4); the outcome and an eliminated seat have no focus',()=>{
 assert.equal(at({sequence:{t:1200,beats},selected:'c0',allowed:['person-b']}).kind,'aim');
 assert.equal(at({sequence:{t:1200,beats}}).kind,'sequence','no choice: the sequence');
 assert.equal(at({over:true}).kind,'none');assert.equal(at({over:true,sequence:{t:1200,beats},selected:'c0'}).kind,'none');
 assert.deepEqual(guideMotion(at({over:true}),{now:5,since:5,compact:false,reduced:false}),{pose:{},shake:0});
});
test('C4-10 focus from a real model: phases of the fixtures map to the moments',()=>{
 const run=(m:Model)=>guideFocus({...base,phase:m.phase,selected:m.selected,target:!!m.target,choosingDiscard:m.choosingDiscard,discard:m.discard,over:m.view.over||m.eliminated}).kind;
 const m=new Model(fixtures.before,'Tu');assert.equal(run(m),'choose');m.select(m.hand[2].key);assert.equal(run(m),'aim');
 m.aim({owner:'Bice'});assert.equal(run(m),'confirm');m.confirm();assert.equal(m.phase,'sending');assert.equal(run(m),'wait');
 const b=new Model(fixtures.before,'Tu');b.select(b.hand[1].key);assert.equal(run(b),'aim','a bound, before its target');b.aim({owner:'Bice'});assert.equal(run(b),'discard');
 b.select(b.hand[3].key);assert.equal(b.discard,b.hand[3].key);assert.equal(run(b),'confirm','with its discard chosen');
 const o=new Model(fixtures.before,'Tu');o.view.over=true;assert.equal(run(o),'none');
});
test('C4-10 wave: quicker and lower than the prototype (14/8 px, 600 ms, 110 ms), one card after the other, back to rest between waves',()=>{
 assert.ok(GUIDE.wave.lift<14&&GUIDE.wave.liftCompact<8&&GUIDE.wave.up<600&&GUIDE.wave.stagger<110,'owner: «più veloce e meno intensa»');
 const f=at({}),W=GUIDE.wave,pose=(since:number,compact=false)=>guideMotion(f,{now:since,since,compact,reduced:false}).pose;
 assert.ok(Math.abs(pose(W.up/2).c0.dy+W.lift)<1e-9,'the first card at the top of its wave');assert.ok(pose(W.stagger/2).c0&&pose(W.stagger/2).c1===undefined,'the next one not yet');
 assert.ok(Math.abs(pose(W.stagger+W.up/2).c1.dy+W.lift)<1e-9);assert.ok(Math.abs(pose(W.up/2,true).c0.dy+W.liftCompact)<1e-9,'compact');
 const end=(hand.length-1)*W.stagger+W.up;assert.deepEqual(pose(end+1),{},'all at rest after the wave');assert.ok(end<W.period.choose,'a pause before the next');
 assert.ok(Math.abs(pose(W.period.choose+W.up/2).c0.dy+W.lift)<1e-9,'again every period');
 for(let t=0;t<W.period.choose*2;t+=17)for(const p of Object.values(pose(t)))assert.ok(p.dy<=0&&p.dy>=-W.lift&&p.scale===1);
 const d=guideMotion(at({selected:'c1',target:true,choosingDiscard:true,preview:'c1'}),{now:W.period.discard+W.up/2,since:W.period.discard+W.up/2,compact:false,reduced:false}).pose;
 assert.ok(d.c0&&d.c0.dy<0,'the discard has its own, shorter period');
});
test('C4-10 reduced motion (and the still guide of the measures): no wave, pulse, growth or shake at any moment',()=>{
 const moments=[at({}),at({selected:'c0',allowed:['person-b']}),at({selected:'c0',target:true,preview:'c0',dest:'person-b'}),at({selected:'c1',target:true,choosingDiscard:true,preview:'c1'}),at({phase:'pending'}),...beats.map(b=>at({sequence:{t:b.hit+20,beats}}))];
 for(const f of moments)for(const now of [0,100,777,1500,3000])assert.deepEqual(guideMotion(f,{now,since:now,compact:false,reduced:true}),{pose:{},shake:0},f.kind);
});

// Fake Pixi nodes: only what the guide may touch.
const node=(y:number,s=1):Posable&{x:number;sets:number}=>{const n={x:7,y,sets:0,scale:{x:s,set(v:number){n.scale.x=v;n.sets++;}}};return n;};
test('C4-10 rest: every node moved is back at rest at the next frame, and a node left out of the focus is never left moved',()=>{
 const a=node(100),b=node(50,1.15),c=node(20),nodes=new Map<string,Posable>([['a',a],['b',b],['c',c]]),rest=new GuideRest();
 rest.apply(nodes,{a:{dy:-8,scale:1},b:{dy:0,scale:1.035}});assert.equal(a.y,92);assert.ok(Math.abs(b.scale.x-1.15*1.035)<1e-9);assert.equal(c.y,20);assert.equal(rest.moved,2);
 rest.apply(nodes,{a:{dy:-4,scale:1}});assert.equal(a.y,96,'from rest, not from the last frame');assert.equal(b.scale.x,1.15,'b left the focus: at rest');
 rest.apply(nodes,{});assert.equal(a.y,100);assert.equal(rest.moved,0);assert.equal(a.x,7,'x is never touched (the knock and the drag own it)');
 // A long run of frames never drifts.
 for(let t=0;t<5000;t+=16)rest.apply(nodes,guideMotion(at({}),{now:t,since:t,compact:false,reduced:false}).pose as Record<string,{dy:number;scale:number}>);
 rest.restore();assert.deepEqual([a.y,b.y,c.y,a.scale.x,b.scale.x],[100,50,20,1,1.15]);
 // draw() recreates the nodes: a destroyed one is left alone, the new one starts at rest.
 const old=node(100),fresh=node(100);rest.apply(new Map([['a',old]]),{a:{dy:-8,scale:1}});(old as {destroyed?:boolean}).destroyed=true;
 rest.apply(new Map([['a',fresh]]),{});assert.equal(fresh.y,100);assert.equal(old.y,92,'a destroyed node is not written');
});
test('C4-10 touch: the guide never reads or writes the hits; a press on the edge of a raised card or of a grown target lands where it lands today',()=>{
 const L=tableLayout(1366,768,['me','b'],'me',{me:1,b:1}),H=L.hand,n=5,b=L.seats.find(s=>s.id==='b')!.person;
 const hits=[...Array(n).keys()].map(i=>{const s=handSlot(H,i,n);return {id:`c${i}`,x:s.x,y:s.y,w:H.w,h:H.h,angle:s.angle};});
 const raised=raisedCard(H,2,n);hits[2]={...hits[2],y:hits[2].y-H.lift/2,h:H.h+H.lift,angle:raised.angle};
 const all=[hits[2],...hits.filter((_,i)=>i!==2),{id:'person-b',x:b.x,y:b.y,w:b.w,h:b.h,angle:.025}];
 const probes:[number,number][]=[];for(const h of all)for(const [fx,fy] of [[0,-.5],[0,.5],[-.5,0],[.5,0],[-.49,-.49],[.52,0],[0,-.53],[0,.53]]){const c=Math.cos(h.angle),s=Math.sin(h.angle),dx=fx*h.w,dy=fy*h.h;probes.push([h.x+dx*c-dy*s,h.y+dx*s+dy*c]);}
 // The visual edge of a grown target and of a lifted card, outside the hit.
 probes.push([b.x,b.y-b.h*(1+GUIDE.grow)/2+1],[hits[0].x,hits[0].y-H.h/2-GUIDE.wave.lift+1]);
 const before=JSON.stringify(all),answers=probes.map(([x,y])=>hitAt(all,x,y)?.id??null);
 const nodes=new Map<string,Posable>(all.map(h=>[h.id,node(h.y)])),rest=new GuideRest();let moved=0;
 for(const f of [at({}),at({selected:'c0',allowed:['person-b']}),at({sequence:{t:1500+50,beats:[{from:0,to:2400,hit:1500,author:'me',target:'b'}]}})])
  for(const now of [0,90,200,400,1200]){const m=guideMotion(f,{now,since:now,compact:false,reduced:false});rest.apply(nodes,m.pose);
   moved+=rest.moved;assert.equal(JSON.stringify(all),before,'hits unchanged');assert.deepEqual(probes.map(([x,y])=>hitAt(all,x,y)?.id??null),answers,`${f.kind} at ${now}`);}
 assert.ok(answers.includes('person-b')&&answers.includes('c2'),'the probes reach real hits');
 assert.ok(moved>0,'the guide did move the drawing meanwhile');
});

const official:[number,number][]=[[1366,768],[844,390]];
const layouts=(seats:string[])=>official.map(([w,h])=>({w,h,L:tableLayout(w,h,seats,'me',Object.fromEntries(seats.map(s=>[s,2])))}));
test('C4-10 O30: ✓ and × lie on the chosen discard as the scene draws it (raised, centred, turned), at every official measure, duel and FFA',()=>{
 for(const seats of [['me','b'],['me','b','c','d','e']])for(const {w,h,L} of layouts(seats)){const H=L.hand,n=6;
  for(let i=0;i<n;i++){const c=confirmCard(H,{...L.preview},{index:i,n}),s=handSlot(H,i,n);
   assert.ok(c.onDiscard);assert.equal(c.x,s.x,`${w}: centred on the card`);assert.equal(c.y,s.y-H.lift,`${w}: at its raised height`);
   assert.equal(c.w,H.w*H.zoom);assert.equal(c.h,H.h*H.zoom,'as large as the drawn card');assert.equal(c.angle,s.angle*.4,'turned like the drawn card and its semantic button');
   assert.ok(c.w>=44&&c.h/2>=44,`${w}x${h}: each half at least 44 px (${c.w}×${c.h/2})`);
   assert.ok(c.y-c.h/2>=0&&c.y+c.h/2<=h+H.h,`${w}x${h}: on the screen`);}}
});
test('C4-10 O30: the confirmation follows the discard and changes when the discard changes; without one it stays on the placed card',()=>{
 const {L}=layouts(['me','b'])[0],H=L.hand,P={x:500,y:300,w:L.preview.w,h:L.preview.h};
 const a=confirmCard(H,P,{index:1,n:6}),b=confirmCard(H,P,{index:4,n:6});assert.notEqual(a.x,b.x);assert.ok(Math.abs(b.x-a.x-3*H.step)<1e-9);
 assert.deepEqual(confirmCard(H,P,null),{x:500,y:300,w:P.w,h:P.h,angle:-.1,onDiscard:false},'C4-2 unchanged');
 assert.equal(confirmCard(H,P,{index:-1,n:6}).onDiscard,false,'a discard no longer in the hand');
});
test('C4-10 O30: the chosen discard stays raised whatever the pointer does; nothing else about the hand changes',()=>{
 const calm={focused:false,hovered:false,payable:true,dragged:false},card={key:'c2',card:fixtures.cards.stop};
 assert.equal(handCardState(card,{choosingDiscard:false,selected:'c1',target:{owner:'b'},discard:'c2'},calm).raised,true);
 assert.equal(handCardState(card,{choosingDiscard:false,selected:'c1',target:{owner:'b'},discard:'c3'},calm).raised,false,'another card is not');
 assert.equal(handCardState(card,{choosingDiscard:false,selected:'c1',target:null,discard:'c2'},calm).raised,false,'no move to confirm');
 assert.equal(handCardState(card,{choosingDiscard:false,selected:'c1',target:{owner:'b'},discard:'c2'},calm).wideHit,false,'its hit keeps its width');
 // The fan itself: the slots of today.
 const {L}=layouts(['me','b'])[0],H=L.hand;for(let i=0;i<7;i++){const k=i-3,s=handSlot(H,i,7);assert.deepEqual(s,{x:H.center+k*H.step,y:H.y+Math.abs(k)*3,angle:k*.05});}
});
test('C4-10 O29: without a note the short summary is only a hidden status with the same text; a note after a jump stays visible; nothing under the panel',()=>{
 const line='Turno 3: tu Stop su Bice; Bice Colpo su di te.',note='Risolti i turni 3–5 senza differenze: apri «Ultimo turno».';
 assert.deepEqual(shortSummary({text:line,note:false},false),{visible:null,hidden:line});
 assert.deepEqual(shortSummary({text:note,note:true},false),{visible:note,hidden:null});
 assert.deepEqual(shortSummary({text:line,note:false},true),{visible:null,hidden:null});assert.deepEqual(shortSummary({text:'',note:false},false),{visible:null,hidden:null});
});
test('C4-10: no glow and no new text on the table; the guide styles stop with reduced motion',()=>{
 const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8'),tsx=readFileSync(new URL('../src/table.tsx',import.meta.url),'utf8');
 assert.doesNotMatch(css+tsx,/guide-glow/,'O29: no glow on the round cards');
 assert.match(css,/@media \(prefers-reduced-motion: reduce\) \{ \.confirmation \[data-testid=confirm\] \.mark \{ animation: none; \} \}/);
 assert.match(css,/\.sr-only \{[^}]*clip/);
 assert.doesNotMatch(tsx,/non prevede di passare/,'SB-1 Q5: the R03 sentence is gone (rules 1.13: a live player always has a move)');
});
test('C4-10 O30: a canvas tap never sends the click the browser synthesizes after touchend (it would land on × drawn under the finger)',()=>{
 const scene=readFileSync(new URL('../src/scene.ts',import.meta.url),'utf8');
 assert.match(scene,/bind\(canvas,'touchend',\(\(e:TouchEvent\)=>\{if\(e\.cancelable\)e\.preventDefault\(\);\}\)/);
});

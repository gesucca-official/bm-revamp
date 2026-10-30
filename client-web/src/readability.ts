import type {Card,Character,Resource} from './contracts.ts';
// C2a readability helpers. Pure functions over the authoritative view: they only decide how
// things look. Costs are never subtracted here and the server stays the judge of legality.

export const RESOURCES:Resource[]=['HEALTH','ALERTNESS','VIOLENCE','TOXICITY','ALCOHOL'];
export const LETTER:Record<Resource,string>={HEALTH:'H',ALERTNESS:'A',VIOLENCE:'V',TOXICITY:'T',ALCOHOL:'L'};
const BY_LETTER=Object.fromEntries(Object.entries(LETTER).map(([k,v])=>[v,k])) as Record<string,Resource>;

/** O11: same comparison the server makes when a move is submitted (missing resource counts as 0). */
export const shortfall=(card:Card,resources:Partial<Record<Resource,number>>)=>
 Object.entries(card.cost).filter(([k,v])=>(resources[k as Resource]??0)<(v??0)).map(([k])=>k as Resource);
export const affordable=(card:Card,resources:Partial<Record<Resource,number>>)=>shortfall(card,resources).length===0;

/** O14: descriptive role from the catalog (regulation 1.7 R07a). Unknown or missing values show no mark. */
export const ROLES={
 DAMAGE:{label:'DANNO',hint:'infligge danno'},
 DEFENSE:{label:'DIFESA',hint:'riduce il danno ricevuto'},
 RESOURCES:{label:'RISORSE',hint:'ti fa guadagnare risorse'},
 COUNTER:{label:'CONTRASTO',hint:'annulla mosse avversarie'},
 DISRUPT:{label:'DISTURBO',hint:'indebolisce l’avversario'},
 ITEMS:{label:'OGGETTI',hint:'prende, ruba o distrugge oggetti'},
 OTHER:{label:'ALTRO',hint:'ruolo misto'},
} as const;
export type Role=keyof typeof ROLES;
export const roleOf=(card:Card):Role|null=>card.role&&Object.hasOwn(ROLES,card.role)?card.role as Role:null;

/** O13: self gains as published by the catalog, e.g. "+15 V, +15 A" or "+x T" (x = variable). */
export type Gain={resource:Resource;amount:number|null};
export const gainsOf=(card:Card):Gain[]=>{
 const out:Gain[]=[];for(const m of (card.gains??'').matchAll(/\+(\d+|x) ([HAVTL])\b/g))out.push({resource:BY_LETTER[m[2]],amount:m[1]==='x'?null:Number(m[1])});return out;};
export const gainText=(g:Gain)=>`+${g.amount??'x'} ${LETTER[g.resource]}`;

/** O4: indicator against the character's starting value. No caps or floors (R01): the number is
 * always shown. Health starts full; the other resources start at half the bar (owner, C2a): the
 * start is an average to build on with the right cards. Beyond the full bar a second stripe shows the
 * excess, below zero a stub; the full bar is at least 20 so resources starting at zero still move. */
export const MIN_REFERENCE=20;
export type Meter={reference:number;start:number;fill:number;excess:number;negative:number;beyond:boolean};
export function meter(value:number,start:number|undefined,health=false):Meter{
 const s=start??0,reference=Math.max(MIN_REFERENCE,health?s:2*s),clamp=(x:number)=>Math.max(0,Math.min(1,x));
 return {reference,start:clamp(s/reference),fill:clamp(value/reference),excess:clamp((value-reference)/reference),negative:clamp(-value/reference),beyond:value>2*reference||value<-reference};
}

/** Statuses, equipment, immunities and timers of a character, as short chips with a summary.
 * Italian text for the statuses of the current set (R07), else the server description. */
const STATUS_TEXT:Record<string,string>={
 'YOU CARESS ME':'Colpi (HIT) ricevuti ×0,35',
 'ONLY A LITTLE DISCOMFORT':'Colpi (HIT) ricevuti ×0,75',
 'NO PATIENCE - Damage Intake Boost':'Colpi (HIT) ricevuti ×1,5',
 'MADE OF STONE':'Tagli (CUT) ricevuti ×0,5',
 'BROKEN BEER':'I tuoi colpi (HIT) ×1,5 e diventano tagli (CUT); si consuma dopo l’uso',
};
const TIMER_TEXT:Record<string,string>={
 'Bad Trip':'ridà l’immunità alla tossicità',
 'Blood Drain':'dà l’immunità alla tossicità',
 'Marvelous Cocktail':'toglie immunità e stati, poi 20 danni da veleno',
};
const NAMES:Record<string,string>={TOXICITY:'tossicità',ALCOHOL:'alcol'};
export type Chip={id:string;kind:'good'|'bad'|'equip'|'immunity'|'timer';short:string;title:string;text:string};
export const statusText=(name:string,fallback:string)=>STATUS_TEXT[name]??fallback;
// R05: duration d decreases at turn end and the status disappears below zero (0 = this turn only).
const lasting=(d:number|null)=>d===null?'resta finché non viene tolto':d<=0?'finisce a fine turno':`dura ancora ${d} turn${d===1?'o':'i'} dopo questo`;
export function chipsOf(owner:string,c:Character):Chip[]{
 const chips:Chip[]=[];
 c.immunities.forEach(r=>chips.push({id:`status-${owner}-imm-${r}`,kind:'immunity',short:LETTER[r],title:`Immune a ${NAMES[r]??r}`,text:'Blocca il suo effetto di fine turno, non costi, variazioni o veleno.'}));
 c.statuses.forEach((s,i)=>chips.push({id:`status-${owner}-st-${i}`,kind:s.equip?'equip':s.type==='BAD'?'bad':'good',short:s.lastsForTurns===null?'∞':String(Math.max(0,s.lastsForTurns)),
  title:`${s.equip?'Equipaggiamento':s.type==='BAD'?'Stato negativo':'Stato positivo'}: ${s.name}`,text:`${statusText(s.name,s.description)}. ${s.singleUse&&!s.equip?'Si consuma dopo l’uso; ':''}${lasting(s.lastsForTurns)}.`}));
 // R06: timers count down at each turn end and fire at zero.
 c.timers.forEach((tm,i)=>chips.push({id:`status-${owner}-tm-${i}`,kind:'timer',short:String(tm.timer),title:`Timer: ${tm.name}`,text:`${tm.timer<=1?'Scatta a fine turno':`Scatta tra ${tm.timer} fine turno`}: ${TIMER_TEXT[tm.name]??'effetto ritardato'}.`}));
 return chips;
}

/** O12: card sizes and seat geometry. Sizes follow the height so the compact landscape
 * (844×390) and the desktop (1366×768) share one rule; the five-seat FFA uses the same table. */
export type Box={x:number;y:number;w:number;h:number};
/** `backs` is the slot of the covered hand: `back` cards fanned inside it (see fan). */
export type SeatLayout={id:string;me:boolean;person:Box;items:Box[];backs:Box;back:{w:number;h:number;turn:number};board:Box;status:Box;summary:Box};
export type TableLayout={compact:boolean;hand:{w:number;h:number;step:number;center:number;y:number;lift:number;zoom:number};preview:{x:number;y:number;w:number;h:number};seats:SeatLayout[]};
const ME={x:.19,y:.70},DUEL=[{x:.56,y:.25}],FFA=[{x:.24,y:.19},{x:.66,y:.19},{x:.15,y:.43},{x:.72,y:.43}];
export function tableLayout(w:number,h:number,ids:string[],me:string,itemCounts:Record<string,number>={}):TableLayout{
 const compact=h<550,ffa=ids.length>2;
 const hw=compact?120:Math.min(214,h*.28),hh=hw*1.38;
 const hand={w:hw,h:hh,step:hw*(compact?.6:.62),center:w*.63,y:h-hh*.5-6,lift:compact?18:30,zoom:compact?1.2:1.12};
 const pw=compact?(ffa?60:80):Math.min(150,h*.195)*(ffa?.78:1),ph=pw*1.38,iw=pw*.76,ih=iw*1.38;
 const others=ids.filter(id=>id!==me),handTop=hand.y-hh/2,sh=compact?18:24;
 const seats=ids.map(id=>{
  const own=id===me,spot=own?ME:(ffa?FFA:DUEL)[others.indexOf(id)]??{x:.5,y:.3};
  const x=w*spot.x,y=h*spot.y,person={x,y,w:pw,h:ph},n=Math.max(1,itemCounts[id]??1);
  // Duel: own objects sit up and to the right of the character, leaving the lower band to the hand.
  // FFA: the middle row needs that space, so own objects stay beside the character and the fan
  // starts after them. Opponents' objects follow their character; in FFA they overlap a little.
  const gap=ffa?iw*.75:iw+6,ownY=ffa?y+ph*.06:Math.min(y-ph*.34,handTop-ih/2-8);
  const items=Array.from({length:n},(_,i)=>({x:x+pw*.5+iw*.5+8+i*gap,y:own?ownY:y+ph*.06,w:iw,h:ih}));
  const bw=compact?(ffa?18:24):(ffa?30:40),side=ffa&&!own&&others.indexOf(id)>=2,left=side&&spot.x<.5;
  // FFA fans turn less: four of them share the table (a decoration reduced, never a card removed).
  const back={w:bw,h:bw*1.4,turn:ffa?.05:FAN.turn},full=bw*(1+7*FAN.step);
  const bwid=own?(compact?110:170):(compact?(ffa?84:100):(ffa?120:150)),bh=own?(compact?92:150):(compact?40:58);
  const board={x:x-pw*.5-8-bwid*.5,y:own?y:y-ph*.12,w:bwid,h:bh};
  // Statuses: a chip row on the lower art of the character card, so no seat needs more room.
  const status={x,y:y+ph/2-ph*.17-sh/2-2,w:pw-8,h:sh};
  // Covered hands, room for eight backs: above the seat; for the FFA side seats under the board on the left,
  // above the objects on the right (beside the character, never over it). The step shrinks to fit the slot.
  const span=[items[0].x-iw/2,items[n-1].x+iw/2],right=Math.max((span[0]+span[1])/2-full/2,x+pw/2+4);
  const backs=side?(left?{x:(x-pw/2)/2,y:board.y+bh/2+bw,w:x-pw/2-12,h:back.h}:{x:right+full/2,y:items[0].y-ih/2-back.h/2-3,w:full,h:back.h}):{x,y:y-ph*.5-bw*.75-(ffa?3:0),w:full,h:back.h};
  // C3-2: static round summary in a strip as wide as the board, above it for the own seat and where the covered
  // hand lies under the board (left FFA seat), below it otherwise.
  const mh=compact?14:20,above=own||backs.y>board.y,summary={x:board.x,y:above?board.y-bh/2-mh/2-3:board.y+bh/2+mh/2+3,w:bwid,h:mh};
  return {id,me:own,person,items,backs,back,board,status,summary};
 });
 if(ffa){const mine=seats.find(s=>s.me)!,from=Math.max(...mine.items.map(b=>b.x+b.w/2))+10,room=w-8-from;
  hand.step=Math.min(hand.step,(room-hw)/6);hand.center=from+room/2;}
 const pv=compact?{w:70,h:97}:{w:120,h:166};
 return {compact,hand,preview:{x:w*(compact?.5:.6),y:h*(compact?.45:.5),...pv},seats};
}
/** K7: in the FFA each object of a seat is partly covered by the next one; only the last is whole. */
export const coveredItems=(items:Box[])=>items.map((a,i)=>items.slice(i+1).some(b=>overlap(a,b)>0));
/** K7: a touch has no hover, so its first tap only raises a covered object; the next tap acts on it. */
export const touchRaises=(pointer:string,covered:boolean,raised:boolean)=>pointer!=='mouse'&&covered&&!raised;
/** Covered hand of `count` backs fanned in its slot, as the scene draws it: step 64% of a back (less when
 * the slot is short), each back turned a little more. `box` is the drawn extent, rotation included. */
export const FAN={step:.64,turn:.13};
export function fan(slot:Box,back:{w:number;h:number;turn:number},count:number){
 const step=count>1?Math.min(back.w*FAN.step,(slot.w-back.w)/(count-1)):0;let l=slot.x,r=slot.x,t=slot.y,d=slot.y;
 for(let n=0;n<count;n++){const k=n-(count-1)/2,a=Math.abs(k*back.turn),x=slot.x+k*step,hw=(back.w*Math.cos(a)+back.h*Math.sin(a))/2,hh=(back.w*Math.sin(a)+back.h*Math.cos(a))/2;
  l=Math.min(l,x-hw);r=Math.max(r,x+hw);t=Math.min(t,slot.y-hh);d=Math.max(d,slot.y+hh);}
 return {step,turn:back.turn,box:{x:(l+r)/2,y:(t+d)/2,w:r-l,h:d-t} as Box};}
export const overlap=(a:Box,b:Box)=>Math.max(0,Math.min(a.x+a.w/2,b.x+b.w/2)-Math.max(a.x-a.w/2,b.x-b.w/2))*Math.max(0,Math.min(a.y+a.h/2,b.y+b.h/2)-Math.max(a.y-a.h/2,b.y-b.h/2));
export const inside=(a:Box,w:number,h:number)=>a.x-a.w/2>=0&&a.x+a.w/2<=w&&a.y-a.h/2>=0&&a.y+a.h/2<=h;

/** C3-3 (O6, D3): arrows from the chosen or dragged card to the targets its categories admit. Pure geometry: the caller
 * decides which targets are admitted (Model.allows, the same call as the outlines); an arrow is visual help, never a
 * validation. Each arrow runs from the border of the card to the border of the target on a quadratic curve whose
 * control point stays in the viewport, so the whole arrow does too (a quadratic lies in the hull of its three points).
 * `avoid` (the confirmation controls) is kept clear outside the card itself, which the confirmation replaces. */
export type Pt={x:number;y:number};
export type AimTarget={id:string;owner:string;kind:'person'|'item';itemIndex?:number;box:Box};
export type Arrow={id:string;owner:string;kind:'person'|'item';itemIndex?:number;from:Pt;control:Pt;to:Pt;head:[Pt,Pt,Pt];
 /** The card already rests on the target (a drag over it): nothing to draw. */
 reached:boolean;
 /** The curve still crosses a region to keep clear after trying both bends. */
 crosses:boolean};
/** Point where the ray from the centre of `b` towards `toward` leaves `b` grown by `gap`. */
export function edgePoint(b:Box,toward:Pt,gap=0):Pt{const dx=toward.x-b.x,dy=toward.y-b.y;
 if(!dx&&!dy)return {x:b.x,y:b.y-b.h/2-gap};
 const t=Math.min(dx?(b.w/2+gap)/Math.abs(dx):Infinity,dy?(b.h/2+gap)/Math.abs(dy):Infinity);return {x:b.x+dx*t,y:b.y+dy*t};}
export const bezier=(a:Pt,c:Pt,b:Pt,t:number):Pt=>({x:(1-t)*(1-t)*a.x+2*(1-t)*t*c.x+t*t*b.x,y:(1-t)*(1-t)*a.y+2*(1-t)*t*c.y+t*t*b.y});
const within=(p:Pt,b:Box,pad=0)=>Math.abs(p.x-b.x)<=b.w/2+pad&&Math.abs(p.y-b.y)<=b.h/2+pad;
/** Rectangle of the confirmation controls (✓ and ×) of table.tsx, as the layout places them. */
export const confirmBox=(preview:{x:number;y:number},w:number,compact:boolean):Box=>{const bw=compact?150:164,bh=compact?96:124,left=Math.min(preview.x+70,w-175),top=Math.max(50,preview.y-30);return {x:left+bw/2,y:top+bh/2,w:bw,h:bh};};
/** The ✓ and × buttons alone, with a margin for the text above them to wrap to more lines: a column as wide as the two buttons,
 * from below the first lines of the confirmation down well past the buttons (measured on the real DOM by VerifyAim). */
export const confirmButtons=(preview:{x:number;y:number},w:number,compact:boolean):Box=>{const c=confirmBox(preview,w,compact),left=c.x-c.w/2,top=c.y-c.h/2,from=top+(compact?54:76),to=top+(compact?150:190),bw=compact?112:116;return {x:left+bw/2,y:(from+to)/2,w:bw,h:to-from};};
export function aimArrows(source:Box,targets:AimTarget[],view:{w:number;h:number},opts:{avoid?:Box[];head?:number;gap?:number}={}):Arrow[]{
 const avoid=opts.avoid??[],s=opts.head??10,gap=opts.gap??4,m=4,clampPt=(p:Pt):Pt=>({x:Math.max(m,Math.min(view.w-m,p.x)),y:Math.max(m,Math.min(view.h-m,p.y))});
 const grown={...source,w:source.w+6,h:source.h+6},crossings=(a:Pt,c:Pt,b:Pt)=>{let n=0;for(let i=1;i<24;i++){const p=bezier(a,c,b,i/24);if(!within(p,grown)&&avoid.some(x=>within(p,x,8)))n++;}return n;};
 return targets.map(t=>{
  const tail0=edgePoint(source,{x:t.box.x,y:t.box.y},2),to=edgePoint(t.box,{x:source.x,y:source.y},gap);
  // The card already rests on (or over) the target: its tail is inside it, or the arrow would be a stub.
  const len0=Math.hypot(to.x-tail0.x,to.y-tail0.y),lap=overlap(source,t.box),reached=within(tail0,{...t.box,w:t.box.w+4,h:t.box.h+4})||len0<12||lap>.35*Math.min(source.w*source.h,t.box.w*t.box.h);
  // Tails to try: the one towards the target, then points along the top edge and the sides of the card, nearest to the target first.
  const edge=(source.w+4)/2,top=source.y-source.h/2-2,near=(p:Pt)=>Math.hypot(p.x-t.box.x,p.y-t.box.y);
  const spots:Pt[]=[...[-.42,-.3,-.15,.15,.3,.42].map(f=>({x:source.x+f*source.w,y:top})),...[-.3,0,.3].flatMap(f=>[{x:source.x-edge,y:source.y+f*source.h},{x:source.x+edge,y:source.y+f*source.h}])];
  const tails=[tail0,...spots.sort((p,q)=>near(p)-near(q))];
  let from=tail0,control=tail0,worst=Infinity;
  search:for(const tail of tails){const dx=to.x-tail.x,dy=to.y-tail.y,len=Math.hypot(dx,dy)||1,mid={x:(tail.x+to.x)/2,y:(tail.y+to.y)/2},nx=-dy/len,ny=dx/len;
   // The bend goes towards the middle of the viewport first (arrows from one card fan out without leaving the table); when it
   // crosses a region to keep clear, larger bends on either side and the straight line follow, then the next tail.
   const side=((view.w/2-mid.x)*nx+(view.h/2-mid.y)*ny)>=0?1:-1;
   for(const k of [1,-1,1.8,-1.8,2.8,-2.8,0]){const c=clampPt({x:mid.x+nx*len*.2*side*k,y:mid.y+ny*len*.2*side*k}),n=avoid.length?crossings(tail,c,to):0;
    if(n<worst){worst=n;from=tail;control=c;}if(!worst)break search;}
   if(!avoid.length)break;}
  const crosses=worst>0;
  const tx=to.x-control.x,ty=to.y-control.y,tl=Math.hypot(tx,ty)||1,ux=tx/tl,uy=ty/tl,base={x:to.x-ux*s*1.4,y:to.y-uy*s*1.4};
  const head:[Pt,Pt,Pt]=[to,{x:base.x-uy*s*.6,y:base.y+ux*s*.6},{x:base.x+uy*s*.6,y:base.y-ux*s*.6}];
  return {id:t.id,owner:t.owner,kind:t.kind,itemIndex:t.itemIndex,from,control,to,head,reached,crosses};});
}

/** Pop-art arrow (owner, after C3-3): a ribbon along the curve that widens from the tail to a barbed head, as one polygon (x, y, x, y…).
 * The tip is `arrow.to`; the barbs sit a little behind the neck so the back of the head is notched. `width` is the body width at the
 * tail and at the neck; the head is as wide as `arrow.head` plus `grow`. */
export function arrowOutline(a:Arrow,opts:{tail:number;neck:number;grow?:number}):number[]{
 const N=18,[tip,hl,hr]=a.head,bx=(hl.x+hr.x)/2,by=(hl.y+hr.y)/2,headLen=Math.hypot(tip.x-bx,tip.y-by)||1,half=Math.hypot(hl.x-hr.x,hl.y-hr.y)/2*(opts.grow??1.25);
 const ux=(tip.x-bx)/headLen,uy=(tip.y-by)/headLen;
 let len=0,prev=a.from;for(let i=1;i<=24;i++){const p=bezier(a.from,a.control,a.to,i/24);len+=Math.hypot(p.x-prev.x,p.y-prev.y);prev=p;}
 const tn=Math.max(.15,1-.7*headLen/Math.max(len,1)),L:Pt[]=[],R:Pt[]=[];
 for(let i=0;i<=N;i++){const t=tn*i/N,p=bezier(a.from,a.control,a.to,t),q=bezier(a.from,a.control,a.to,Math.min(1,t+.01)),r=bezier(a.from,a.control,a.to,Math.max(0,t-.01));
  const dx=q.x-r.x,dy=q.y-r.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,w=(opts.tail+(opts.neck-opts.tail)*Math.pow(i/N,1.3))/2;
  L.push({x:p.x+nx*w,y:p.y+ny*w});R.push({x:p.x-nx*w,y:p.y-ny*w});}
 const back=1.12*headLen,bc={x:tip.x-ux*back,y:tip.y-uy*back},nx=-uy,ny=ux;
 const pts=[tip,{x:bc.x-nx*half,y:bc.y-ny*half},...R.reverse(),...L,{x:bc.x+nx*half,y:bc.y+ny*half}];
 return pts.flatMap(p=>[p.x,p.y]);
}

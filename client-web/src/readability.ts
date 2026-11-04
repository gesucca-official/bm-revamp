import type {Card,Character,Resource} from './contracts.ts';
// C2a readability helpers. Pure functions over the authoritative view: they only decide how
// things look. Costs are never subtracted here and the server stays the judge of legality.

export const RESOURCES:Resource[]=['HEALTH','ALERTNESS','VIOLENCE','TOXICITY','ALCOHOL'];
/** The letters of the catalog: kept for the text that can be consulted (labels, tools, the server's strings); the face, the boards and the chips show the symbols of symbols.ts. */
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
// C4-4: the type of a card, from the flags of the wire. The token has no flag of its own: it is recognised from `bindingName`, stable on the wire but not a dedicated field.
// A card without a binding (known by name only) or with contradictory flags is neutral; a new class with no flag set counts as a regular action, as the server plays it.
export type CardType='character'|'regular'|'basic'|'bound'|'lastResort'|'item'|'token'|'neutral';
export const TOKEN_PREFIX='com.tokens.';
export function cardType(c:Card):CardType{
 if(!c.bindingName||[c.item,c.basicAction,c.characterBound,c.lastResort].filter(Boolean).length>1)return 'neutral';
 return c.item?(c.bindingName.startsWith(TOKEN_PREFIX)?'token':'item'):c.basicAction?'basic':c.characterBound?'bound':c.lastResort?'lastResort':'regular';}

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
/** `short` is the consultable text of the chip; an immunity also names its `resource`, which the table draws as the symbol (C4-3). */
export type Chip={id:string;kind:'good'|'bad'|'equip'|'immunity'|'timer';short:string;title:string;text:string;resource?:Resource};
export const statusText=(name:string,fallback:string)=>STATUS_TEXT[name]??fallback;
// R05: duration d decreases at turn end and the status disappears below zero (0 = this turn only).
const lasting=(d:number|null)=>d===null?'resta finché non viene tolto':d<=0?'finisce a fine turno':`dura ancora ${d} turn${d===1?'o':'i'} dopo questo`;
export function chipsOf(owner:string,c:Character):Chip[]{
 const chips:Chip[]=[];
 c.immunities.forEach(r=>chips.push({id:`status-${owner}-imm-${r}`,kind:'immunity',short:LETTER[r],resource:r,title:`Immune a ${NAMES[r]??r}`,text:'Blocca il suo effetto di fine turno, non costi, variazioni o veleno.'}));
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
export type SeatLayout={id:string;me:boolean;person:Box;items:Box[];backs:Box;back:{w:number;h:number;turn:number};board:Box;status:Box};
/** C3-L: own deck and own discard pile, small, beside the own character (each player has their own, R02). */
export type Piles={deck:Box;discard:Box};
/** C3-L: the cards of the last resolved round in the middle of the table, a light cascade in resolution order: slot 0 (the first
 * resolved) at the bottom of the pile and highest, each next one a title strip lower and drawn over it. One slot per seat. */
export type Played={box:Box;slots:Box[];
 /** The author of each slot, in a column right of the cascade, level with that card's title strip. */
 tags:Box[]};
export type TableLayout={compact:boolean;scale:Scale;hand:{w:number;h:number;step:number;center:number;y:number;lift:number;zoom:number};preview:{x:number;y:number;w:number;h:number};seats:SeatLayout[];played:Played|null;piles:Piles|null};
/** C3-L (owner, 30 October 2026): the own character larger than the others, resources larger, the middle of the table used for
 * the cards of the last round. Factors on the C2 sizes; when the table has no room they give way in `YIELD` order (objects first,
 * then the others, then the resources, the own character last), 0.05 at a time down to 1. */
export type Scale={me:number;others:number;items:number;resources:number};
export const SCALE:Scale={me:1.5,others:1.2,items:1,resources:1.25};
export const YIELD:(keyof Scale)[]=['items','others','resources','me'];
/** HTML over the table (table.tsx, style.css): the «Scegli…» hint at the bottom left, one line, and the clock, turn and menu at the top
 * right, with room for a clock. Seats stay clear of both. */
export function shellBoxes(w:number,h:number,compact:boolean):{hint:Box;top:Box}{
 return compact?{hint:{x:10+70,y:h-8-15,w:140,h:30},top:{x:w-8-75,y:6+23,w:150,h:46}}:{hint:{x:14+115,y:h-12-19,w:230,h:38},top:{x:w-16-95,y:12+23,w:190,h:46}};}
/** The decorative title at the top left (style.css `.brand`, a little rotated): the short summary stays off it, though it is no seat. */
export const brandBox=(compact:boolean):Box=>compact?{x:10+48,y:8+24,w:96,h:48}:{x:20+75,y:15+36,w:150,h:72};
/** D13 close-up range: the own character is already the largest on the table, so its close-up may keep its size. */
export const closeUpRange=(own:boolean)=>own?{min:1,max:1.3}:{};
/** D13 target close-up: smaller for the own character, already large. */
export const targetScale=(own:boolean)=>own?1.1:1.25;
export function arrange(w:number,h:number,ids:string[],me:string,itemCounts:Record<string,number>,s:Scale):TableLayout{
 const compact=h<550,ffa=ids.length>2,shell=shellBoxes(w,h,compact);
 const hw=compact?120:Math.min(214,h*.28),hh=hw*1.38;
 const hand={w:hw,h:hh,step:hw*(compact?.6:.62),center:w*.63,y:h-hh*.5-6,lift:compact?18:30,zoom:compact?1.2:1.12};
 const base=compact?(ffa?60:80):Math.min(150,h*.195)*(ffa?.78:1),iw=base*.76*s.items,ih=iw*1.38;
 const others=ids.filter(id=>id!==me),mh=compact?14:20;
 // Own deck and discard pile: two small cards. FFA: one above the other right of the own character, at its foot, the own objects after
 // them (narrow, so the hand keeps its step).
 // Duel: in the row of own objects above the seat, before them (desktop) or after room for three (compact: the middle stays to the
 // round's cards and the own character keeps its size); the hand does not move.
 const kw=compact?26:40,kh=kw*1.38,kg=compact?6:8,kspan=2*kw+kg+8,kffa=kw+8;
 const seats=ids.map(id=>{
  const own=id===me,k=others.indexOf(id),f=own?s.me:s.others,pw=base*f,ph=pw*1.38,n=Math.max(1,itemCounts[id]??1);
  const bwid=(own?(compact?110:170):(compact?(ffa?84:100):(ffa?120:150)))*s.resources,bh=(own?(compact?92:150):(compact?40:58))*s.resources;
  // FFA fans turn less: four of them share the table (a decoration reduced, never a card removed).
  const bw=(compact?(ffa?18:24):(ffa?30:40))*Math.min(s.others,1.25),back={w:bw,h:bw*1.4,turn:ffa?.05:FAN.turn},full=bw*(1+7*FAN.step);
  // Own seat: the board on the left edge, the character beside it, its foot just above the hint. Opponents: the covered hand above
  // the character; in the FFA two rows, the left seats against the left edge, the right middle seat with its objects inside the screen.
  let x:number,y:number;
  if(own){x=6+bwid+8+pw/2;y=Math.min(h*.72,shell.hint.y-shell.hint.h/2-6-ph/2);}
  else if(!ffa){x=w*(compact?.56:.64);y=Math.max(h*.25,4+back.h+6+ph/2);}
  else{const top=Math.max(h*.19,4+back.h+4+ph/2),middle=Math.max(h*.43,top+ph+(compact?6:10)),flush=6+bwid+8+pw/2,reach=pw/2+8+iw+2*iw*.75;
   x=k===0?Math.max(w*.24,flush):k===1?w*.62:k===2?flush:Math.min(w*.72,w-6-reach);y=k<2?top:middle;}
  const person={x,y,w:pw,h:ph};
  // Duel (C3-L): own objects in a row above the own seat (with the own piles), leaving the middle of the table to the round's cards and the
  // lower band to the hand. FFA: the middle row needs that space, so own objects stay beside the character and the fan
  // starts after them. Opponents' objects follow their character; in FFA they overlap a little.
  const gap=ffa?iw*.75:iw+6,above=!ffa&&own;
  const items=Array.from({length:n},(_,i)=>above?{x:6+(compact?0:kspan)+iw/2+i*gap,y:Math.min(y-ph/2,y-bh/2-mh-3)-ih/2-8,w:iw,h:ih}:{x:x+pw*.5+iw*.5+8+(own&&ffa?kffa:0)+i*gap,y:y+ph*.06,w:iw,h:ih});
  const side=ffa&&!own&&k>=2,left=side&&x<w/2;
  const board={x:x-pw*.5-8-bwid*.5,y:own?y:y-ph*.12,w:bwid,h:bh};
  // Statuses: a chip row on the lower art of the character card, so no seat needs more room; it grows with the character.
  const sh=(compact?18:24)*Math.min(f,1.5),status={x,y:y+ph/2-ph*.17-sh/2-2,w:pw-8,h:sh};
  // Covered hands, room for eight backs: above the seat; for the FFA side seats under the board on the left,
  // above the objects on the right (beside the character, never over it). The step shrinks to fit the slot.
  const span=[items[0].x-iw/2,items[n-1].x+iw/2],right=Math.max((span[0]+span[1])/2-full/2,x+pw/2+4);
  const backs=side?(left?{x:(x-pw/2)/2,y:board.y+bh/2+bw,w:x-pw/2-12,h:back.h}:{x:right+full/2,y:items[0].y-ih/2-back.h/2-3,w:full,h:back.h}):{x,y:y-ph*.5-bw*.75-(ffa?3:0),w:full,h:back.h};
  return {id,me:own,person,items,backs,back,board,status};
 });
 const mine=seats.find(x=>x.me);
 if(mine&&ffa){const from=Math.max(...mine.items.map(b=>b.x+b.w/2))+10,room=w-8-from;hand.step=Math.min(hand.step,(room-hw)/6);hand.center=from+room/2;}
 else if(mine){const from=Math.max(mine.person.x+mine.person.w/2,mine.board.x+mine.board.w/2)+10;
  if(hand.center-(hw+5*hand.step)/2<from){const room=w-8-from;hand.step=Math.min(hand.step,(room-hw)/6);hand.center=from+room/2;}}
 const pv=compact?{w:70,h:97}:{w:120,h:166};
 const L:TableLayout={compact,scale:s,hand,preview:{x:w*(compact?.5:.6),y:h*(compact?.45:.5),...pv},seats,played:null,piles:null};
 if(mine){const row=mine.items[0],x=ffa?mine.person.x+mine.person.w/2+8+kw/2:compact?6+3*(iw+6)+kw/2:6+kw/2,y=ffa?mine.person.y+mine.person.h/2-kh/2:row.y+row.h/2-kh/2;L.piles=ffa?{deck:{x,y:y-kh-kg,w:kw,h:kh},discard:{x,y,w:kw,h:kh}}:{deck:{x,y,w:kw,h:kh},discard:{x:x+kw+kg,y,w:kw,h:kh}};}
 // A raised hand card (hover, focus) does not reach the round's cards.
 const raised={x:hand.center,y:hand.y-hand.lift/2,w:hw+6*hand.step,h:hh+hand.lift},avoid=[...tableBoxes(L,w,h),raised,...(L.piles?[L.piles.deck,L.piles.discard]:[])];
 // The round's cards: the largest card (from the size of a character down to half of it) whose cascade of one card per seat, with the
 // column of authors on its right, finds a
 // free place near the middle of the table; each next card a title strip (20% of the card) lower and a little to the right.
 for(const k of [1,.9,.8,.7,.6,.5]){const cw=base*k,ch=cw*1.38,dy=ch*.2,dx=cw*.06,n=ids.length,tw=compact?42:78,th=Math.min(dy-2,compact?14:20),size={w:cw+(n-1)*dx+4+tw,h:ch+(n-1)*dy};
  const spot=freeSpot(size,{w,h},avoid,{x:w*.5,y:h*.42},compact?8:12);
  if(spot&&Math.hypot(spot.x-w*.5,spot.y-h*.42)<=Math.min(w,h)*.4){const left=spot.x-size.w/2,top=spot.y-size.h/2;
   L.played={box:spot,slots:Array.from({length:n},(_,i)=>({x:left+cw/2+i*dx,y:top+ch/2+i*dy,w:cw,h:ch})),tags:Array.from({length:n},(_,i)=>({x:left+size.w-tw/2,y:top+i*dy+dy/2,w:tw,h:th}))};break;}}
 return L;
}
/** Boxes of the short summary to try: from two lines of 520 px (desktop) or 360 px (compact) to a narrow column of eight, with room for about
 * 40 characters, the widest of the fewest lines first; then one line, which the full compact FFA leaves at its right edge. */
export function briefShapes(compact:boolean):[number,number][]{const wide=compact?360:520,room=compact?480:900,out:[number,number][]=[];
 for(let lines=2;lines<=8;lines++)for(let bw=wide;bw>=96;bw-=20)if(bw*lines>=room)out.push([bw,lines]);
 for(let bw=wide;bw>=120;bw-=20)out.push([bw,1]);return out;}
/** C3-6: the place of the short summary line (the toast of table.tsx): clear of everything the layout holds and of the strips already placed
 * (`taken`), near the top middle of the table; null when the table has no room (compact FFA with many objects and strips), then it is not
 * shown and the dialog «Ultimo turno» stays in the menu. Text clamped to `lines`. */
export function briefSpot(l:TableLayout,w:number,h:number,taken:Box[]=[]):{box:Box;lines:number}|null{
 const avoid=[...stripAvoid(l,w,h),...taken,brandBox(l.compact)],middle={x:w*.5,y:h*.42,w:w*.3,h:h*.3};
 // First outside the middle of the table, where the close-ups of the sequence (D13) play; inside it only when nothing else is left.
 for(const keep of [[middle],[]])for(const [bw,lines] of briefShapes(l.compact)){const box=freeSpot({w:bw,h:briefHeight(l.compact,lines)},{w,h},[...avoid,...keep],{x:w*.5,y:0},2);if(box)return {box,lines};}
 return null;}
/** C3-6: the short summary in 16 px (desktop) or 13 px (compact) text of 1.3 line height, with room for the padding of the box. */
export const briefFont=(compact:boolean)=>compact?13:16;
export const briefHeight=(compact:boolean,lines:number)=>Math.ceil(lines*briefFont(compact)*1.3)+(compact?10:14);
/** Everything drawn on the table but the round's cards and the piles: the seven-card hand, the shell, every seat with its strip and a fan of eight backs. */
export function tableBoxes(l:TableLayout,w:number,h:number):Box[]{const H=l.hand,shell=shellBoxes(w,h,l.compact);
 const out:Box[]=[{x:H.center,y:H.y,w:H.w+6*H.step,h:H.h},shell.hint,shell.top];
 for(const s of l.seats){out.push(s.person,s.board,...s.items);if(!s.me)out.push(fan(s.backs,s.back,8).box);}return out;}
/** The place nearest `mid` for a box of `size` with `pad` around it, clear of `avoid` and inside the screen. */
export function freeSpot(size:{w:number;h:number},screen:{w:number;h:number},avoid:Box[],mid:Pt,pad:number,step=8):Box|null{
 let best:Box|null=null,dist=Infinity;
 for(let y=size.h/2+pad;y<=screen.h-size.h/2-pad;y+=step)for(let x=size.w/2+pad;x<=screen.w-size.w/2-pad;x+=step){
  const d=Math.hypot(x-mid.x,y-mid.y);if(d>=dist)continue;const b={x,y,w:size.w+2*pad,h:size.h+2*pad};if(avoid.some(a=>overlap(b,a)>0))continue;best={x,y,...size};dist=d;}
 return best;}
/** Why a layout does not fit: anything off the screen, a seat over another seat, a covered hand, the hand, the shell, the round's
 * cards or the piles, a hand step under 44 px, no place for the round's cards or the piles near their spot, a close-up (D13) without a free place in the middle. Empty when it fits. */
export function layoutProblems(l:TableLayout,w:number,h:number,closeUpStep=12,strict=false):string[]{
 const bad:string[]=[],H=l.hand,hand:Box={x:H.center,y:H.y,w:H.w+6*H.step,h:H.h},shell=shellBoxes(w,h,l.compact);
 if(!inside(hand,w,h))bad.push('hand off screen');if(H.step<44)bad.push('hand step');if(!l.played)bad.push('no round cards');if(!l.piles)bad.push('no piles');
 for(const s of l.seats){const own=[s.person,s.board,...s.items];
  for(const b of [...own,s.backs])if(!inside(b,w,h))bad.push(`${s.id} off screen`);
  for(const b of own)for(const o of [hand,shell.hint,shell.top,...(l.played?[l.played.box]:[]),...(l.piles?[l.piles.deck,l.piles.discard]:[])])if(overlap(b,o)>0)bad.push(`${s.id} over hand, shell, round cards or piles`);
  for(const o of l.seats)if(o!==s){for(const a of own){for(const b of [o.person,o.board,...o.items])if(overlap(a,b)>0)bad.push(`${s.id}/${o.id}`);if(!o.me&&overlap(a,fan(o.backs,o.back,8).box)>0)bad.push(`${s.id}/backs of ${o.id}`);}}}
 const hb=Array.from({length:7},(_,i)=>({x:H.center+(i-3)*H.step,y:H.y-H.lift/2,w:H.w*H.zoom,h:H.h+H.lift}));
 // C3-3 arrows from the raised card in the middle of the hand to every character and object keep clear of the ✓ and × buttons (what the
 // scene avoids); in the duel none starts on its target. `strict`: in the duel clear of the whole confirmation (the C3-3 unit criterion,
 // with three objects per seat, as fitScale arranges the table).
 const ffa=l.seats.length>2,src={x:H.center,y:H.y-H.lift,w:H.w*H.zoom,h:H.h*H.zoom},aims:AimTarget[]=l.seats.flatMap(s=>[{id:`person-${s.id}`,owner:s.id,kind:'person' as const,box:s.person},{id:`item-${s.id}`,owner:s.id,kind:'item' as const,box:s.items[s.items.length-1]}]);
 for(const a of aimArrows(src,aims,{w,h},{avoid:[strict&&!ffa?confirmBox(l.preview,w,l.compact):confirmButtons(l.preview,w,l.compact)],head:l.compact?20:30}))if((a.crosses&&!a.reached)||(!ffa&&a.reached))bad.push(`arrow to ${a.id}`);
 for(const s of l.seats){const t=targetOf(s,{w,h},l.seats.filter(o=>o!==s).map(o=>o.person));if(l.seats.some(o=>o!==s&&overlap(t,o.person)>0))bad.push(`${s.id} target close-up`);}
 for(const s of l.seats)if(closeUp(s.person,{w,h},[...l.seats.filter(x=>x!==s).flatMap(seatBoxes),...hb],{...closeUpRange(s.me),step:closeUpStep}).placed!=='middle')bad.push(`${s.id} close-up`);
 return [...new Set(bad)];}
// The factors depend only on the screen and the number of seats (three objects per seat, the worst case kept apart): fitted once.
const fitted=new Map<string,Scale>();
export function fitScale(w:number,h:number,seats:number):Scale{const key=`${w}x${h}:${seats}`,known=fitted.get(key);if(known)return known;
 const ids=['me','b','c','d','e'].slice(0,seats),items=Object.fromEntries(ids.map(i=>[i,3])),s={...SCALE};
 for(;;){if(!layoutProblems(arrange(w,h,ids,'me',items,s),w,h,12,true).length)break;const k=YIELD.find(k=>s[k]>1);if(!k)break;s[k]=Math.max(1,Math.round((s[k]-.05)*100)/100);}
 fitted.set(key,s);return s;}
export function tableLayout(w:number,h:number,ids:string[],me:string,itemCounts:Record<string,number>={}):TableLayout{
 return arrange(w,h,ids,me,itemCounts,fitScale(w,h,ids.length));}
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
/** C4-2: the place the confirmation had until C4-2, in the middle of the table. Nothing is drawn there any more (see `previewSpot`), but the aim arrows and the
 * layout still keep it clear, as C3-3 asks, so the factors of C3-L do not move (rule 17). */
export const confirmBox=(preview:{x:number;y:number},w:number,compact:boolean):Box=>{const bw=compact?150:164,bh=compact?96:124,left=Math.min(preview.x+70,w-175),top=Math.max(50,preview.y-30);return {x:left+bw/2,y:top+bh/2,w:bw,h:bh};};
/** The ✓ and × buttons of that place alone, with a margin for the text above them to wrap to more lines: a column as wide as the two buttons,
 * from below the first lines of the confirmation down well past the buttons. */
export const confirmButtons=(preview:{x:number;y:number},w:number,compact:boolean):Box=>{const c=confirmBox(preview,w,compact),left=c.x-c.w/2,top=c.y-c.h/2,from=top+(compact?54:76),to=top+(compact?150:190),bw=compact?112:116;return {x:left+bw/2,y:(from+to)/2,w:bw,h:to-from};};
/** C4-2: the strip of the text of a chosen move, at the foot of the table left of the hand (the place of the hint, under the own seat): two lines, as wide as the hand leaves. */
export function confirmTextBox(l:TableLayout,h:number):Box{const H=l.hand,left=l.compact?10:14,right=H.center-(H.w*H.zoom+6*H.step)/2-8,bh=l.compact?38:47,bottom=l.compact?5:10;
 return {x:(left+right)/2,y:h-bottom-bh/2,w:right-left,h:bh};}
/** What the chosen card should not cover: every seat, the piles, the round's cards, the shell, the text of the move and the hand with a card raised. */
export function previewAvoid(l:TableLayout,w:number,h:number):Box[]{const H=l.hand,shell=shellBoxes(w,h,l.compact),top=H.y-H.lift-H.h*H.zoom/2,bottom=H.y+H.h/2;
 const out:Box[]=[{x:H.center,y:(top+bottom)/2,w:H.w*H.zoom+6*H.step,h:bottom-top},shell.top,brandBox(l.compact),confirmTextBox(l,h)];
 for(const s of l.seats){out.push(s.person,s.board,...s.items);if(!s.me)out.push(fan(s.backs,s.back,8).box);}
 if(l.piles)out.push(l.piles.deck,l.piles.discard);if(l.played)out.push(l.played.box);return out;}
/** C4-2 (owner, 4 November 2026): the chosen card waits for ✓ and × where the gesture ended: nearest to `anchor` (the drop point; on a tap or from the keyboard, the
 * target). Covering costs far more than distance, leaving the middle of the table a little; the target is never covered, so a second press on it cannot land on ✓.
 * A gap is kept around the target for the arrow from the card, unless only a place next to the target is left.
 * The rest place of the layout when nothing else is left. */
export function previewSpot(l:TableLayout,w:number,h:number,target:Box,anchor:Pt=target):Pt{
 const pw=l.preview.w+18,ph=l.preview.h+18,k=l.compact?6:12,avoid=previewAvoid(l,w,h);
 for(const gap of [l.compact?30:48,12]){const clear={...target,w:target.w+gap,h:target.h+gap};let best:Pt|null=null,score=Infinity;
  for(let y=ph/2+2;y<=h-ph/2-2;y+=6)for(let x=pw/2+2;x<=w-pw/2-2;x+=6){const b={x,y,w:pw,h:ph};if(overlap(b,clear)>0)continue;
   const out=Math.max(0,w*.2-(x-pw/2),x+pw/2-w*.85)+Math.max(0,h*.05-(y-ph/2),y+ph/2-h*.95);let s=Math.hypot(x-anchor.x,y-anchor.y)*k+out*k*.5;if(s>=score)continue;
   for(const a of avoid)s+=overlap(b,a);if(s<score){score=s;best={x,y};}}
  if(best)return best;}
 return {x:l.preview.x,y:l.preview.y};}
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

/** Pop-art arrow (owner, after C3-3, heads refined): a ribbon along the curve that ends in a barbed head, as one polygon
 * (x, y, x, y…) in `outline`; `body` and `head` are the two parts alone. The head keeps a fixed sharp angle; on a short arrow it shrinks
 * with the arrow (at most `share` of its length). The tip always pushes `push` past `arrow.to` into the target, so it lands on the
 * card rather than on its outline, and more on a short arrow, up to `reach` and to half the way across `target` (when given),
 * until the arrow is `minLen` long: covering a little of the target card is accepted, a stub without a readable point is not.
 * `shine` is the cartoon highlight along one side of the head. */
export type ArrowShape={outline:number[];body:number[];head:number[];shine:[Pt,Pt];tip:Pt};
export function arrowShape(a:Arrow,o:{tail:number;neck:number;head:number;minLen:number;reach:number;push?:number;share?:number;target?:Box}):ArrowShape{
 const line:Pt[]=[];for(let i=0;i<=24;i++)line.push(bezier(a.from,a.control,a.to,i/24));
 const end=line[23],ex=a.to.x-end.x,ey=a.to.y-end.y,el=Math.hypot(ex,ey)||1,ux=ex/el,uy=ey/el;
 let len=0;for(let i=1;i<line.length;i++)len+=Math.hypot(line[i].x-line[i-1].x,line[i].y-line[i-1].y);
 // How far the tip can travel along its direction and stay on the target: to the middle of the ray's run through it, none if it misses.
 let across=Infinity;const T=o.target;if(T){let lo=0,hi=Infinity;
  for(const [p,d,c,h] of [[a.to.x,ux,T.x,T.w/2],[a.to.y,uy,T.y,T.h/2]]){if(Math.abs(d)<1e-9){if(Math.abs(p-c)>h)hi=-1;continue;}
   const t1=(c-h-p)/d,t2=(c+h-p)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));}
  across=hi>lo?(lo+hi)/2:0;}
 const ext=Math.max(0,Math.min(o.reach,across,Math.max(o.push??0,o.minLen-len))),tip={x:a.to.x+ux*ext,y:a.to.y+uy*ext};if(ext>.5)line.push(tip);
 const total=len+ext,headLen=Math.min(o.head,total*(o.share??.55)),k=headLen/o.head,half=headLen*.62;
 // Body widths shrink with a short head, but not below 60%, so the ribbon still reads behind it.
 const ws=Math.max(.6,k),tail=o.tail*ws,neck=Math.min(o.neck*ws,half*1.3);
 // Walk back from the tip to the neck (the notch of the barbs) and keep the centreline up to there.
 const notch=headLen*.74;let left=total-notch,cut=line[0],kept:Pt[]=[line[0]];
 for(let i=1;i<line.length;i++){const d=Math.hypot(line[i].x-line[i-1].x,line[i].y-line[i-1].y);
  if(d>=left){const f=d?left/d:0;cut={x:line[i-1].x+(line[i].x-line[i-1].x)*f,y:line[i-1].y+(line[i].y-line[i-1].y)*f};break;}left-=d;kept.push(line[i]);}
 if(Math.hypot(cut.x-kept[kept.length-1].x,cut.y-kept[kept.length-1].y)>.5)kept.push(cut);else cut=kept[kept.length-1];
 const L:Pt[]=[],R:Pt[]=[],n=kept.length;
 for(let i=0;i<n;i++){const q=kept[Math.min(n-1,i+1)],r=kept[Math.max(0,i-1)],dx=i===n-1?ux:q.x-r.x,dy=i===n-1?uy:q.y-r.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;
  const w=(tail+(neck-tail)*Math.pow(i/Math.max(1,n-1),1.3))/2;L.push({x:kept[i].x+nx*w,y:kept[i].y+ny*w});R.push({x:kept[i].x-nx*w,y:kept[i].y-ny*w});}
 const nx=-uy,ny=ux,back={x:tip.x-ux*headLen,y:tip.y-uy*headLen},bl={x:back.x+nx*half,y:back.y+ny*half},br={x:back.x-nx*half,y:back.y-ny*half};
 const head=[tip,bl,{x:cut.x+nx*neck/2,y:cut.y+ny*neck/2},{x:cut.x-nx*neck/2,y:cut.y-ny*neck/2},br];
 const lerp=(p:Pt,q:Pt,f:number):Pt=>({x:p.x+(q.x-p.x)*f,y:p.y+(q.y-p.y)*f}),inward=(p:Pt):Pt=>({x:p.x-nx*half*.22-ux*headLen*.04,y:p.y-ny*half*.22-uy*headLen*.04});
 const flat=(ps:Pt[])=>ps.flatMap(p=>[p.x,p.y]);
 return {outline:flat([tip,bl,...[...L].reverse(),...R,br]),body:flat([...L,...[...R].reverse()]),head:flat(head),shine:[inward(lerp(tip,bl,.2)),inward(lerp(tip,bl,.62))],tip};
}

/** D13: the boxes a seat occupies on the table (character, board, objects, covered hand); a close-up must leave other seats clear. */
export const seatBoxes=(s:SeatLayout):Box[]=>[s.person,s.board,...s.items,s.backs];
export type CloseUp={person:Box;card:Box;box:Box;scale:number;placed:'middle'|'seat'};
/** D13: the author's close-up, its character enlarged with the played card beside it, in a free part of the table: inside the
 * screen and clear of `avoid` (the other seats, the hand). The biggest scale whose free place is near the middle of the table
 * wins (within `near` of the smaller side); failing that, the place nearest to the middle at any scale. If nothing fits even
 * at `min`, the character grows in its own seat, kept on the screen (`placed: 'seat'`). */
export function closeUp(person:Box,screen:{w:number;h:number},avoid:Box[],o:{max?:number;min?:number;margin?:number;step?:number;near?:number}={}):CloseUp{
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
/** D13: the target comes forward a little in its own seat, kept on the screen. `down` keeps its top edge (C3-L: the own character,
 * at the foot of the table, grows towards the edge of the screen and not over the seats above it). */
export function targetUp(person:Box,screen:{w:number;h:number},scale=1.25,m=4,grow:'both'|'down'|'up'='both'):Box{const w=person.w*scale,h=person.h*scale,d=(h-person.h)/2,y=person.y+(grow==='down'?d:grow==='up'?-d:0);
 return {x:Math.max(w/2+m,Math.min(screen.w-w/2-m,person.x)),y:Math.max(h/2+m,Math.min(screen.h-h/2-m,y)),w,h};}
/** D13 target close-up of a seat, as the scene draws it (C3-L): smaller for the own character; it grows around its centre, or else
 * from its top or bottom edge, the first way that stays clear of the other characters (`others`). */
export function targetOf(s:{me:boolean;person:Box},screen:{w:number;h:number},others:Box[]=[]):Box{
 const ways=(['both','down','up'] as const).map(g=>targetUp(s.person,screen,targetScale(s.me),4,g));return ways.find(t=>!others.some(o=>overlap(t,o)>0))??ways[0];}

/** C3-L: the card on top of the own discard pile after the last resolved round of the view, or null when that round put nothing there.
 * R02: a regular or last-resort card goes to the discard after use, voided or not; basic and bound stay in hand; a bound discards its
 * extra card first, unless voided (R04). `cards` knows the subtype of the played card; an unknown name counts as regular. */
type PlayedMove={playerId:string;playedCardName:string;void?:boolean;choices?:Record<string,string>|null};
export function discardTop(moves:PlayedMove[],me:string,cards:Card[]):string|null{const o=ownDiscards(moves,me,cards);return o.extra??o.played;}
/** What the own move of a round sends to the discard pile (R02): the played card, a bound's extra card (unless voided, R04). */
export function ownDiscards(moves:PlayedMove[],me:string,cards:Card[]):{played:string|null;extra:string|null}{
 const m=moves.find(x=>x.playerId===me);if(!m)return {played:null,extra:null};const c=cards.find(x=>x.name===m.playedCardName);
 if(c&&(c.basicAction||c.characterBound))return {played:null,extra:!m.void&&m.choices?.DISCARD_ONE?m.choices.DISCARD_ONE:null};
 return {played:m.playedCardName,extra:null};}
/** C3-4s: the own discard pile when a new round arrives. The card played in the previous round lay in the middle (D14) and only now reaches
 * the pile; a bound's extra card goes there during its own round; the card played now stays in the middle (`middle`) until the next one. */
export type DiscardPile={top:string|null;middle:string|null};
export function nextPile(pile:DiscardPile,moves:PlayedMove[],me:string,cards:Card[]):DiscardPile{const o=ownDiscards(moves,me,cards);
 return {top:o.extra??pile.middle??pile.top,middle:o.played};}
/** C3-4s: a place for a label of a change: `base` or, moving away a row at a time (up first), then a column to the side, the nearest one on
 * the screen and clear of the labels in `taken` (the ones still visible when this one appears). */
export function labelSpot(base:Box,screen:{w:number;h:number},taken:Box[]):Box{
 const rows=[0,-1,1,-2,2,-3,3,-4,4,-5,5,-6,6,-7,7,-8,8];
 for(const c of [0,1,-1,2,-2])for(const k of rows){const b={...base,x:base.x+c*(base.w+4),y:base.y+k*(base.h+3)};if(inside(b,screen.w,screen.h)&&!taken.some(o=>overlap(b,o)>0))return b;}
 return base;}


/**
 * C3-6 (owner, 30 October 2026): the static summary of a seat was too small and used the letters of the resources. Now one cell per
 * entry, the same symbol as on the boards and the signed number, in the largest type that finds a place. The size depends on the
 * entries of the round, so the place is searched for each round, next to the board (or the character) of the seat, clear of
 * everything on the table; the unit tests keep the worst case (all five resources, objects gone and appeared) placed.
 */
export const STRIP_FONT=(compact:boolean)=>compact?{pref:14,min:12}:{pref:19,min:16};
export type StripCell={x:number;y:number;w:number};
export type StripSize={fs:number;cols:number;rows:number;w:number;h:number;glyph:number;cells:StripCell[]};
/** Width of one cell: the symbol, a gap and the digits of the signed number (a bold digit is under 0.62 of the type size). */
export const stripCellWidth=(text:string,fs:number)=>(/\d/.test(text)?fs*1.2:0)+text.length*fs*.62;
export function stripSize(texts:string[],fs:number,cols:number):StripSize{
 const gap=fs*.7,pad=fs*.35,rowH=fs*1.45,rows=Math.max(1,Math.ceil(texts.length/cols)),cells:StripCell[]=[];let width=0;
 for(let r=0;r<rows;r++){let x=pad;for(const t of texts.slice(r*cols,(r+1)*cols)){const cw=stripCellWidth(t,fs);cells.push({x,y:pad*.5+r*rowH,w:cw});x+=cw+gap;}width=Math.max(width,x-gap+pad);}
 return {fs,cols,rows,w:width,h:rows*rowH+pad,glyph:fs*.95,cells};}
/** A place for a strip of `size` touching one of the `anchors` (the board first, then the character) at a gap of 3 px: above, below, left
 * or right of it, sliding along the side; the one nearest to the board, clear of `avoid` and inside the screen. */
export function stripSpot(size:{w:number;h:number},anchors:Box[],screen:{w:number;h:number},avoid:Box[],gap=3,step=4,foreign:Box[]=[]):Box|null{
 let best:Box|null=null,dist=Infinity;
 // A place that also touches another seat is ambiguous (whose changes are these?): it costs 80 px per such seat, so it wins only when nothing else is left.
 const touches=(b:Box,a:Box)=>Math.max(Math.abs(b.x-a.x)-(b.w+a.w)/2,Math.abs(b.y-a.y)-(b.h+a.h)/2)<=gap+3;
 anchors.forEach((a,k)=>{const side=(x:number,y:number)=>{const b={x,y,w:size.w,h:size.h};if(!inside(b,screen.w,screen.h)||avoid.some(o=>overlap(b,o)>0))return;
   const d=Math.hypot(x-anchors[0].x,y-anchors[0].y)+(k?40:0)+80*foreign.filter(f=>touches(b,f)).length;if(d<dist){dist=d;best=b;}};
  const x0=a.x-a.w/2-size.w/2+Math.min(24,size.w/2),x1=a.x+a.w/2+size.w/2-Math.min(24,size.w/2),y0=a.y-a.h/2-size.h/2+Math.min(12,size.h/2),y1=a.y+a.h/2+size.h/2-Math.min(12,size.h/2);
  for(let x=x0;x<=x1;x+=step){side(x,a.y-a.h/2-gap-size.h/2);side(x,a.y+a.h/2+gap+size.h/2);}
  for(let y=y0;y<=y1;y+=step){side(a.x-a.w/2-gap-size.w/2,y);side(a.x+a.w/2+gap+size.w/2,y);}});
 return best;}
/** What the table has in the way of the strips of a layout: everything drawn, the round's cards, the piles and the raised hand card. */
export function stripAvoid(l:TableLayout,w:number,h:number):Box[]{const H=l.hand;
 return [...tableBoxes(l,w,h),{x:H.center,y:H.y-H.lift/2,w:H.w+6*H.step,h:H.h+H.lift},...(l.played?[l.played.box]:[]),...(l.piles?[l.piles.deck,l.piles.discard]:[])];}
export type StripPlan={box:Box;size:StripSize};
/** The strips of a round: for each seat with entries, the largest type (down to the minimum) and then the fewest rows that find a place;
 * null for a seat where none does (then nothing is drawn and the short summary and the dialog carry the facts). The own seat goes first. */
export function stripPlan(l:TableLayout,w:number,h:number,texts:Record<string,string[]>):Record<string,StripPlan|null>{
 const F=STRIP_FONT(l.compact),avoid=stripAvoid(l,w,h),out:Record<string,StripPlan|null>={};
 for(const s of [...l.seats].sort((a,b)=>Number(b.me)-Number(a.me))){const t=texts[s.id]??[];if(!t.length){out[s.id]=null;continue;}
  out[s.id]=null;
  search:for(let fs=F.pref;fs>=F.min;fs--)for(let cols=t.length;cols>=1;cols--){const size=stripSize(t,fs,cols),box=stripSpot(size,[s.board,s.person,...(s.me?[]:[fan(s.backs,s.back,8).box])],{w,h},avoid,3,4,l.seats.filter(o=>o!==s).flatMap(o=>[o.board,o.person]));
   if(box){out[s.id]={box,size};avoid.push(box);break search;}}}
 return out;}

// --- C3-5 (O7): nominal damage on the face of a card and the impact each card makes (rules 1.9, 1.10) ---

export type DamageType='HIT'|'CUT'|'POISON';
export const DAMAGE_TYPES:DamageType[]=['HIT','CUT','POISON'];
/** Name of each type, for the accessible text and the inspection; the face shows the symbol, never the letters. */
export const DAMAGE_NAMES:Record<DamageType,string>={HIT:'colpo',CUT:'taglio',POISON:'veleno'};
/** One entry of `damageAmount`: the type and the fixed part of the amount (null when the server gives the type only); `x` when it adds half the V left. */
export type DamageEntry={type:DamageType;base:number|null;x:boolean};
/**
 * The nominal damage of a card as the catalog publishes it (A1 `damage`, A3 `damageAmount`): never computed or corrected here (D1).
 * An older server without `damageAmount` still gives the types; one without either gives none.
 */
export function damageOf(card:Card):DamageEntry[]{
 const typed=(card.damage??'').split(',').map(s=>s.trim()).filter((s):s is DamageType=>(DAMAGE_TYPES as string[]).includes(s));
 const out:DamageEntry[]=[];
 for(const part of (card.damageAmount??'').split(',')){const m=/^\s*(HIT|CUT|POISON)\s+(\d+)(\+x)?\s*$/.exec(part);if(m)out.push({type:m[1] as DamageType,base:Number(m[2]),x:!!m[3]});}
 return out.length?out:typed.map(type=>({type,base:null,x:false}));
}
/** V left after paying the card: the `x` of a variable amount is half of it, truncated toward zero (1.10). Null when the viewer's V is unknown. */
export const leftV=(card:Card,resources?:Partial<Record<Resource,number>>|null)=>resources&&resources.VIOLENCE!==undefined?resources.VIOLENCE-(card.cost.VIOLENCE??0):null;
/** «15», «31» for 20+x with V known, «20+» when it is not (the catalog, a card of another round), «» for the type alone. */
export const damageText=(e:DamageEntry,left:number|null)=>e.base===null?'':e.x?(left===null?`${e.base}+`:String(e.base+Math.trunc(left/2))):String(e.base);
export const damageLabel=(card:Card,left:number|null)=>damageOf(card).map(e=>`${DAMAGE_NAMES[e.type]}${damageText(e,left)?` ${damageText(e,left)}`:''}`).join(' e ');
/** Polygons (in -1..1) of the symbols of the three types, drawn alike by the table (Pixi) and by the catalog (SVG): a burst, a knife, a drop. Every polygon of a type takes the same fill; the slits between them draw the guard of the knife. */
const turn=(poly:number[],deg:number)=>{const t=deg*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return poly.map((v,i,a)=>i%2?a[i-1]*s+v*c:v*c-a[i+1]*s);};
const star=(r:number)=>Array.from({length:16},(_,i)=>{const a=Math.PI*i/8,k=(i%2?.52:1)*r;return [Math.cos(a)*k,Math.sin(a)*k];}).flat();
export const DAMAGE_SHAPES:Record<DamageType,number[][]>={
 // Burst of sixteen points (the first impact of C3-5); its second colour is a smaller burst inside, for depth.
 HIT:[star(1)],
 // Knife, tip up and to the right: blade, guard and handle, drawn upright then turned.
 CUT:[
  [.02,-1,.30,-.55,.30,.12,-.26,.12,-.26,-.35,-.12,-.72],[-.42,.20,.46,.20,.46,.34,-.42,.34],[-.20,.42,.24,.42,.28,1,-.24,1],
 ].map(poly=>turn(poly,45)),
 POISON:[[0,-1,.62,.1,.62,.45,.38,.82,0,.95,-.38,.82,-.62,.45,-.62,.1]],
};
export const DAMAGE_COLOR:Record<DamageType,number>={HIT:0xa3313d,CUT:0x4d6070,POISON:0x5f8a1f};
/** Colours of the resources and of the roles (the table and the HTML shell share them, C4-3): the colour only reinforces the shape. */
export const RES_COLOR:Record<Resource,number>={HEALTH:0xa3313d,ALERTNESS:0x2f8189,VIOLENCE:0xc0582c,TOXICITY:0x78962c,ALCOHOL:0xc98d1f};
export const ROLE_COLOR:Record<Role,number>={DAMAGE:0x742e33,DEFENSE:0x2c6262,RESOURCES:0x4b6a2d,COUNTER:0x343f6b,DISRUPT:0x5c3a6a,ITEMS:0x86561b,OTHER:0x5d5247};
/** The second colour of each symbol (owner trial, C3-7): the yellow heart of the burst, the light glint on the blade, the light glint on the drop. */
export const DAMAGE_ACCENT:Record<DamageType,number>={HIT:0xf2c84b,CUT:0xbfe5f6,POISON:0xb4e06a};
export const DAMAGE_ACCENT_SHAPES:Record<DamageType,number[][]>={
 HIT:[star(.52)],
 CUT:[[.10,-.80,.19,-.60,.19,-.02,.10,-.02]].map(poly=>turn(poly,45)),
 POISON:[[-.46,.14,-.46,.44,-.30,.68,-.20,.62,-.34,.40,-.34,.18]],
};

/**
 * What a card makes on impact (C3-5, D2): the nominal types of damage when it has any (the nature of the card, not damage dealt: a conversion
 * such as BrokenBeerBottle is not visible and is never deduced), otherwise its role of R07a where the type does not apply. A card with neither
 * gets the plain ring. A voided move makes none (its stamp is the emphasis). `shake` is 1 for every card with a nominal damage, a blow or a cut (the target's character card knocks and darkens), 0 otherwise and with reduced motion: the same mark, no knock.
 */
export type ImpactKind=DamageType|Role|'PLAIN';
export type Impact={kinds:ImpactKind[];shake:number};
export function impactOf(card:Card,reduced=false):Impact{
 const types=damageOf(card).map(e=>e.type),role=roleOf(card);
 const kinds:ImpactKind[]=types.length?types:role?[role]:['PLAIN'];
 return {kinds,shake:reduced||!types.length?0:1};
}
/** Motion of one impact mark at fraction `p` of its time (scale, opacity, rise, turn). Reduced motion keeps the mark and its pop, without the rise, the turn or any knock. */
export type Motion={scale:number;alpha:number;dy:number;rot:number};
export function impactMotion(kind:ImpactKind|'VOID',p:number,reduced=false):Motion{
 const q=Math.max(0,Math.min(1,p)),e=1-(1-q)*(1-q);
 switch(kind){
  case 'HIT':return {scale:.3+1.3*e,alpha:1-q*q,dy:0,rot:reduced?0:(1-q)*.3};
  case 'CUT':return {scale:.5+.9*e,alpha:q<.6?1:1-(q-.6)/.4,dy:0,rot:0};
  case 'POISON':return {scale:.8+.4*e,alpha:1-q*q,dy:reduced?0:-26*e,rot:0};
  case 'VOID':return {scale:q<.25?1.8-.8*(q/.25):1,alpha:q>.8?1-(q-.8)/.2:1,dy:0,rot:0};
  default:return {scale:.6+.8*e,alpha:1-q,dy:0,rot:0};
 }
}

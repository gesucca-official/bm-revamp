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

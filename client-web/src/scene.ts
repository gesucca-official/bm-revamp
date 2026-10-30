import {AlphaFilter,Application,Assets,Container,Graphics,Rectangle,Sprite,Text,Texture} from 'pixi.js';
import {Model,clone,type Target} from './model.ts';
import {artIndex,artFrame,loadAtlas} from './art.ts';
import {playerName} from './presence.ts';
import type {Card,CharacterCard,Player,Resource,View} from './contracts.ts';
import {plays,seatMarks,nextStop,timeline,beats,BEAT_PHASE,type Pace,type Round,type SeatMark,type Step,type Timeline} from './resolution.ts';
import {RESOURCES,LETTER,ROLES,roleOf,gainsOf,gainText,shortfall,meter,chipsOf,tableLayout,fan,coveredItems,touchRaises,aimArrows,arrowShape,confirmButtons,closeUp,targetOf,seatBoxes,closeUpRange,discardTop,type AimTarget,type Arrow,type Box,type Chip,type CloseUp,type Role,type TableLayout} from './readability.ts';
export type Hit={id:string;kind:'hand'|'person'|'item'|'status';x:number;y:number;w:number;h:number;angle:number;key?:string;target?:Target;label:string;node:Container;covered?:boolean};
export type Inspection={title:string;card?:Card;owner?:string};
type Drag={id:number;key:string;x:number;y:number;lastX:number;lastY:number;moved:boolean;insertion:number|null;touch:boolean};
// Times in ms from the start of the sequence. A move card flies from its author, hits (`fly`, fraction of the flight) and then
// goes to the author's discard (`after`). Other flights: a cost token rises, an object shrinks into its consumer, breaks,
// or simply travels (passed objects, discards, draws).
type Point={x:number;y:number};
// `land` (C3-L): the move card does not fade on its way to `after` but lands there at this scale, in the cascade of the round's cards.
type Flight={node:Container;from:Point;to:Point;start:number;end:number;appear?:number;fly?:number;after?:Point;land?:number;mode?:'travel'|'rise'|'shrink'|'break'};
// D13 close-ups: a copy of a character (with the played card for the author) grows from its seat (`rest`) to `up`, stays
// until `hold`, then goes back by `end`; `fade` (the card beside the author) appears with it and leaves before it.
type Zoom={node:Container;rest:{x:number;y:number;s:number};up:{x:number;y:number;s:number};at:number;grow:number;hold:number;end:number;fade?:Container};
// Marks over the table: an impact ring, a stamp (voided, eliminated) and the enlarged resource of a change (pop).
type Accent={node:Container;at:number;dur:number;kind?:'ring'|'stamp'|'pop'};
const INK=0x30231e, PAPER=0xe8d7b4, PETROL=0x6eafaf, WINE=0x742e33;
const RES_COLOR:Record<Resource,number>={HEALTH:0xa3313d,ALERTNESS:0x2f8189,VIOLENCE:0xc0582c,TOXICITY:0x78962c,ALCOHOL:0xc98d1f};
const ROLE_COLOR:Record<Role,number>={DAMAGE:0x742e33,DEFENSE:0x2c6262,RESOURCES:0x4b6a2d,COUNTER:0x343f6b,DISRUPT:0x5c3a6a,ITEMS:0x86561b,OTHER:0x5d5247};
// Plain vector marks: the shape carries the meaning, the colour only reinforces it (O3, O14).
export function glyph(g:Graphics,kind:Resource|Role,x:number,y:number,s:number,color:number){const r=s/2,pts=(a:number[])=>a.map((v,i)=>i%2?y+v*r:x+v*r);
 switch(kind){
  case 'HEALTH':g.circle(x-r*.45,y-r*.25,r*.5).circle(x+r*.45,y-r*.25,r*.5).fill(color).poly(pts([-.93,-.05,.93,-.05,0,.95])).fill(color);break;
  case 'ALERTNESS':g.ellipse(x,y,r,r*.62).fill(0xf3ead2).stroke({color,width:Math.max(1.5,s*.13)}).circle(x,y,r*.36).fill(color);break;
  case 'VIOLENCE':g.poly(pts([.3,-1,-.65,.15,-.05,.15,-.3,1,.7,-.2,.08,-.2])).fill(color);break;
  case 'TOXICITY':g.poly(pts([0,-1,.6,.12,-.6,.12])).fill(color).circle(x,y+r*.32,r*.6).fill(color);break;
  case 'ALCOHOL':g.roundRect(x-r*.48,y-r*.2,r*.96,r*1.2,r*.22).fill(color).rect(x-r*.17,y-r,r*.34,r*.9).fill(color);break;
  case 'DAMAGE':g.poly(pts(Array.from({length:20},(_,i)=>{const a=Math.PI*i/10,k=i%2?.45:1;return [Math.cos(a)*k,Math.sin(a)*k];}).flat())).fill(color);break;
  case 'DEFENSE':g.poly(pts([-.8,-.85,.8,-.85,.8,.05,0,1,-.8,.05])).fill(color);break;
  case 'RESOURCES':g.poly(pts([0,-.95,.9,.6,-.9,.6])).fill(color);break;
  case 'COUNTER':g.poly(pts(Array.from({length:8},(_,i)=>{const a=Math.PI/8+Math.PI*i/4;return [Math.cos(a),Math.sin(a)];}).flat())).stroke({color,width:Math.max(1.5,s*.14)}).rect(x-r*.6,y-r*.14,r*1.2,r*.28).fill(color);break;
  case 'DISRUPT':g.poly(pts([0,.95,.9,-.6,-.9,-.6])).fill(color);break;
  case 'ITEMS':g.roundRect(x-r*.95,y-r*.55,r*1.1,r*1.4,r*.15).stroke({color,width:Math.max(1.2,s*.11)}).roundRect(x-r*.15,y-r*.85,r*1.1,r*1.4,r*.15).fill(color);break;
  case 'OTHER':g.circle(x-r*.6,y,r*.24).circle(x,y,r*.24).circle(x+r*.6,y,r*.24).fill(color);break;
 }return g;}
export type Readout={layout:{hand:{w:number;h:number};person:{w:number;h:number};item:{w:number;h:number}};
 /** C3-L: what the own piles show: cards left in the deck and the card on top of the discard pile. */
 piles:{deck:number;discard:string|null}|null;
 /** C3-L: the round's cards drawn in the middle, bottom first (during a sequence only those already landed). */
 played:{name:string;author:string;void:boolean}[]|null;hand:{key:string;name:string;role:Role|null;gains:string[];payable:boolean;alpha:number}[];board:{values:Partial<Record<Resource,number>>;reference:Partial<Record<Resource,number>>;rows:string[]}|null;
 summary:{key:string;seats:Record<string,{texts:string[];box:Box}>}|null;
 /** C3-4: resource values each board shows (the view, or the step reached during a sequence). */
 boards:Record<string,Partial<Record<Resource,number>>>};
// Stable seats: the viewer at the bottom, opponents in join order. Five-seat layout kept for C2 FFA.
const SEATS={me:[.18,.77],duel:[[.46,.24]],ffa:[[.26,.24],[.72,.24],[.16,.49],[.81,.49]]} as const;
/** A card known only by its published name (an opponent's card): a plain face. */
const plain=(name:string):Card=>({name,bindingName:'',effect:'',item:false,basicAction:false,lastResort:false,characterBound:false,boundToCharacter:null,priority:0,canTarget:[],cost:{},image:null,sprite:null});
export const subtype=(c:Card)=>c.item?'OGGETTO':c.basicAction?'AZIONE BASE':c.characterBound?'AZIONE LEGATA':c.lastResort?'ULTIMA RISORSA':'AZIONE REGOLARE';
export const roleLabel=(c:Card)=>{const r=roleOf(c);return r?ROLES[r].label:'';};
export const cost=(c:Card)=>Object.entries(c.cost).map(([k,v])=>`${v} ${{VIOLENCE:'V',ALERTNESS:'A',TOXICITY:'T',ALCOHOL:'L',HEALTH:'H'}[k]}`).join(' + ')||'—';
export class TableScene {
 app=new Application();world=new Container();fx=new Container();aimLayer=new Container();private aimG=new Graphics();private aimAlpha=new AlphaFilter({alpha:.82});
 // C3-3 (O6): arrows from the chosen or dragged card to the admitted targets; redrawn at most once per frame while dragging.
 arrows:Arrow[]=[];private aimDirty=false;
hits:Hit[]=[];backs:Record<string,number>={};
 drag:Drag|null=null;focused:string|null=null;hovered:string|null=null;
 // K7: a covered object raised by a first touch (touch has no hover); the next touch acts on it.
 peek:string|null=null;
 width=0;height=0;art:Texture[]=[];background!:Sprite;pendingGhost:Container|null=null;
 reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;blocked=false;contextLost=false;
 onLayout=()=>{};onInspect=(_v:Inspection)=>{};onState=()=>{};onError=(_v:string)=>{};onHover=(_id:string|null)=>{};
 preview={x:0,y:0};stats={cancels:[] as string[],inputMs:[] as number[],frames:[] as number[],sequences:0,sequenceMs:[] as number[],flights:0,transfers:0,aggregateDeltas:0,
  // C3-2: every sequence with its key, how it ended and how long it ran; static summaries drawn per round.
  sequenceEnds:[] as {key:string;reason:string;ms:number}[],summaries:0,
  // C3-2 revision (D12): planned length of each sequence and taps that moved it to the next card.
  sequencePlans:[] as {key:string;moves:number;total:number;expected?:ReturnType<typeof beats>;pace?:Pace}[],advances:0,
  // C3-4: what each sequence animated (counted on the nodes built), the bar mode and, for the totals, why.
  beats:[] as {key:string;bars:'per-card'|'total';reason:string|null;drift:number;played:number;drops:number;stamps:number;tokens:number;objects:number;consumed:number;passed:number;broken:number;discards:number;draws:number;endOfTurn:number;emphasis:number;steps:number;pops:number;closeUps:number;targetUps:number}[],
  // C3-4 revision (D13): when each beat of each card starts as the scene scheduled it, and where each close-up went.
  schedule:[] as {key:string;move:number;cost:number;author:number;back:number;flight:number;target:number;changes:number;hit:number;tokens:number|null;closeUp:number;goesBack:number;flies:number;targetUp:number;pops:number|null;costPops:number|null}[],
  closeUps:[] as {key:string;move:number;author:string;box:Box;person:Box;card:Box;scale:number;placed:string;targetId:string;target:Box|null;others:Box[]}[],
  // C3-3: redraws of the aim arrows and the time each took (ms), kept for the last 600.
  aimDraws:0,aimMs:[] as number[]};
 private disposeFns:(()=>void)[]=[];private seqStarted=0;private seqSeen='';private seqKey='';private lastRound:Round|null=null;
 // Static round summary (rule 5, D6): drawn on the table until the first card choice or the next round.
 marks:Record<string,SeatMark[]>|null=null;marksKey='';private tickPrev=0;private inputStart=0;
 private measure=false;private ghost:Container|null=null;private ghostH=0;ghostOver=false;private fittedTitles=new Map<string,string>();private retiring:Container[]=[];private retired:Container[]=[];private visualSnapshot:View;
 private flights:Flight[]=[];private zooms:Zoom[]=[];private accents:Accent[]=[];private pace:Pace|null=null;
 // C3-4: values the boards show while a sequence runs (previous view, then each step), and the steps still to apply.
 // Decisions always use the final view (rule 2): only the drawing of resources reads `display`.
 display:Record<string,Partial<Record<Resource,number>>>|null=null;private events:{at:number;run:()=>void}[]=[];private plan:Timeline|null=null;
 layout:TableLayout|null=null;readout:Readout={layout:{hand:{w:0,h:0},person:{w:0,h:0},item:{w:0,h:0}},piles:null,played:null,hand:[],board:null,summary:null,boards:{}};
 // C3-L: round's cards already landed in the middle during a sequence.
 private landed=0;
 // C3-L: top of the own discard pile, kept per game and refreshed by each resolved round of the view.
 private pile={game:'',turn:-1,top:null as string|null};private starts=new Map<string,Partial<Record<Resource,number>>>();
 // Status chips on the table, for the summary the shell shows on hover, tap or focus.
 chips:Record<string,Chip&{x:number;y:number}>={};openStatus:string|null=null;
 constructor(readonly model:Model,private readonly catalog:()=>Card[]=()=>[],private readonly characters:()=>CharacterCard[]=()=>[]){this.visualSnapshot=clone(model.view);}
 async init(host:HTMLElement){
  await this.app.init({width:host.clientWidth,height:host.clientHeight,backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio,2),autoDensity:true,preference:'webgl'});
  // Native Pointer Events below own all input; avoid a second global Pixi gesture system.
  // Pixi documents null for detaching; its 8.22 declaration omits the nullable type.
  this.app.renderer.events.setTargetElement(null!);
  host.appendChild(this.app.canvas);this.app.canvas.setAttribute('aria-hidden','true');
  const [table,atlas,layout]=await Promise.all([Assets.load('/art/table.webp'),Assets.load('/art/atlas.webp'),loadAtlas()]);
  for(let i=0;i<layout.cols*layout.rows;i++){const f=artFrame(i,layout);this.art.push(new Texture({source:atlas.source,frame:new Rectangle(f.x,f.y,f.size,f.size)}));}
  this.background=new Sprite(table);this.app.stage.addChild(this.background,this.world,this.aimLayer,this.fx);this.fx.eventMode='none';this.aimLayer.eventMode='none';this.aimLayer.addChild(this.aimG);
  const canvas=this.app.canvas;
  const bind=(target:EventTarget,event:string,fn:EventListener)=>{target.addEventListener(event,fn);this.disposeFns.push(()=>target.removeEventListener(event,fn));};
  bind(host.parentElement!,'pointerup',((e:PointerEvent)=>{if((e.target as HTMLElement)?.closest('button'))this.inputStart=performance.now();}) as EventListener);
  bind(host.parentElement!,'keydown',((e:KeyboardEvent)=>{if(['Enter',' ','i','I','ArrowLeft','ArrowRight'].includes(e.key))this.inputStart=performance.now();}) as EventListener);
  bind(canvas,'pointerdown',((e:PointerEvent)=>this.down(e)) as EventListener);
  bind(canvas,'pointermove',((e:PointerEvent)=>this.move(e)) as EventListener);
  bind(canvas,'pointerup',((e:PointerEvent)=>this.up(e)) as EventListener);
  bind(canvas,'pointercancel',(()=>this.interrupt('pointercancel')) as EventListener);
  // Moving onto the (i) button keeps the card raised so the button stays under the pointer.
  bind(canvas,'pointerleave',((e:PointerEvent)=>{if(!this.drag&&!(e.relatedTarget as HTMLElement|null)?.closest?.('.info'))this.setHover(null);}) as EventListener);
  bind(canvas,'lostpointercapture',(()=>{if(this.drag)this.interrupt('lost capture');}) as EventListener);
  bind(canvas,'webglcontextlost',((e:Event)=>{e.preventDefault();this.contextLost=true;this.interrupt('context lost');this.onError('Affaccio sul tavolo interrotto. Attendo il ripristino grafico.');}) as EventListener);
  bind(canvas,'webglcontextrestored',(()=>{this.contextLost=false;this.onError('');this.draw();}) as EventListener);
  bind(window,'resize',(()=>{this.interrupt('resize');this.resize(host.clientWidth,host.clientHeight);}) as EventListener);
  if(window.visualViewport)bind(window.visualViewport,'resize',(()=>{this.interrupt('visual viewport / zoom');this.resize(host.clientWidth,host.clientHeight);}) as EventListener);
  bind(window,'blur',(()=>this.interrupt('window blur',true,false)) as EventListener);
  bind(document,'visibilitychange',(()=>{if(document.hidden){this.interrupt('background');this.app.stop();}else{this.tickPrev=0;this.app.start();}}) as EventListener);
  const media=matchMedia('(prefers-reduced-motion: reduce)');bind(media,'change',((e:MediaQueryListEvent)=>{this.reduced=e.matches;this.interrupt('reduced motion');}) as EventListener);
  // C3-2 (K1): a view of the same turn only cancels a drag (C0-R4); the sequence goes on. A new round, a reset or a
  // drop end it. A round without a difference (jump, other connection) gets no sequence and no summary (K2, rule 3).
  this.disposeFns.push(this.model.subscribe(why=>{const previous=this.visualSnapshot,round=this.model.round,fresh=round!==this.lastRound;
   if(why==='view'||why==='reset'||why==='disconnect'){this.interrupt(why,false,why!=='view'||fresh);this.visualSnapshot=clone(this.model.view);}
   if(fresh){this.lastRound=round;this.marks=seatMarks(round);this.marksKey=round?.facts.key??'';if(this.marks)this.stats.summaries++;}
   // D6: the first card choice dismisses the summary of the round.
   if(why==='choice'&&this.model.selected&&this.marks)this.marks=null;
   this.draw();if(fresh&&why==='view')this.beginSequence(previous);}));
  this.app.ticker.add(()=>this.tick());this.resize(host.clientWidth,host.clientHeight);
 }
 private text(parent:Container,value:string,x:number,y:number,size:number,width?:number,color=INK){const t=new Text({text:value,style:{fontFamily:'Impact, Arial Narrow, sans-serif',fontSize:size,fill:color,wordWrap:!!width,wordWrapWidth:width,align:'center',lineHeight:size*1.05}});t.anchor.set(.5,0);t.position.set(x,y);parent.addChild(t);return t;}
 private frame(w:number,h:number){const c=new Container();c.addChild(new Graphics().roundRect(-w/2+4,-h/2+6,w,h,5).fill({color:0x160e09,alpha:.6}));
  c.addChild(new Graphics().roundRect(-w/2,-h/2,w,h,5).fill(PAPER).stroke({color:INK,width:2}).roundRect(-w/2+4,-h/2+4,w-8,h-8,2).stroke({color:0x9b7652,width:1}));
  const flecks=new Graphics();for(let i=0;i<12;i++)flecks.circle(-w/2+5+(i*23%(w-10)),-h/2+4+(i%2? h-8:0),1+i%2).fill({color:0x795034,alpha:.25});c.addChild(flecks);return c;}
 private face(name:string,art:number,w:number,h:number,footer:string,small=false,sub=''){const c=this.frame(w,h);const titleH=small?h*.27:h*.24, footH=small?h*.17:h*.18;
  const sprite=new Sprite(this.art[art]);sprite.position.set(-w/2+6,-h/2+titleH);sprite.width=w-12;sprite.height=h-titleH-footH-4;c.addChild(sprite);
  const title=this.text(c,name,0,-h/2+6,small?Math.max(9,w*.105):Math.max(12,w*.11),w-12);
  const maxTitle=titleH-(small?8:15);
  // Each shortening step re-measures the wrapped title: fit once per size, not on every redraw.
  const fitKey=`${name}|${title.style.fontSize}|${w}|${maxTitle}`,fitted=this.fittedTitles.get(fitKey);
  // A smaller type (down to 75%) comes before the ellipsis, so long names stay whole on readable cards.
  if(fitted!==undefined){const [size,text]=fitted.split('|');title.style.fontSize=Number(size);title.style.lineHeight=Number(size)*1.05;title.text=text;}
  else{const base=Number(title.style.fontSize);for(let s=base;title.height>maxTitle&&s>base*.75;s-=1){title.style.fontSize=s;title.style.lineHeight=s*1.05;}
   let len=name.length;while(title.height>maxTitle&&len>5){len--;title.text=name.slice(0,len)+'…';}this.fittedTitles.set(fitKey,`${title.style.fontSize}|${title.text}`);}
  if(sub&&!small)this.text(c,sub,0,-h/2+titleH-10,Math.max(7,w*.056),w-12);
  this.text(c,footer,0,h/2-footH+3,small?Math.max(7,w*.085):Math.max(12,w*.10),w-10);return c;}
 // C2a card face: role stamp under the title, self gains on the art, cost coins and priority in the footer.
 // Everything sits on the left, which stays visible where the fan overlaps. short = unpaid cost resources.
 private card(c:Card,w:number,h:number,small=false,short:Resource[]=[]){const f=this.face(c.name,artIndex(c.bindingName),w,h,c.item?'OGGETTO':'',small,subtype(c));
  const titleH=small?h*.27:h*.24,footH=small?h*.17:h*.18,role=roleOf(c),g=new Graphics();f.addChild(g);
  if(role){if(small){const d=Math.max(13,w*.22),cx=-w/2+6+d/2,cy=-h/2+titleH+d/2+2;g.circle(cx,cy,d/2).fill(ROLE_COLOR[role]).stroke({color:INK,width:1});glyph(g,role,cx,cy,d*.62,PAPER);}
   else{const th=Math.max(14,h*.082),fs=th*.66,label=this.text(f,ROLES[role].label,0,0,fs,undefined,0xfff6e2);label.anchor.set(0,.5);const tw=th+label.width+8,tx=-w/2+6,ty=-h/2+titleH+2+th/2;
    g.roundRect(tx,ty-th/2,tw,th,th*.3).fill(ROLE_COLOR[role]).stroke({color:INK,width:1});glyph(g,role,tx+th*.55,ty,th*.62,PAPER);label.position.set(tx+th,ty);f.addChild(label);}}
  const gains=gainsOf(c);if(gains.length){const fs=small?Math.max(8,w*.12):Math.max(10,w*.075),ch=fs*1.45;let gx=-w/2+7;const gy=h/2-footH-5-ch/2;
   for(const gain of gains){const label=this.text(f,gainText(gain),0,0,fs,undefined,INK);label.anchor.set(0,.5);const cw=ch*.9+label.width+5;if(gx+cw>w/2-4){label.destroy();break;}
    g.roundRect(gx,gy-ch/2,cw,ch,ch*.3).fill(0xf6efd9).stroke({color:RES_COLOR[gain.resource],width:1.5});glyph(g,'RESOURCES',gx+ch*.48,gy,ch*.55,RES_COLOR[gain.resource]);label.position.set(gx+ch*.9,gy);f.addChild(label);gx+=cw+3;}}
  if(!c.item){const fs=small?Math.max(7,w*.085):Math.max(11,w*.088),fy=h/2-footH/2-1,ch=fs*1.4;let cx=-w/2+8;
   const costs=Object.entries(c.cost) as [Resource,number][];
   if(!costs.length){const dash=this.text(f,'—',cx+4,fy,fs,undefined,INK);dash.anchor.set(0,.5);}
   for(const [k,v] of costs){const unpaid=short.includes(k),label=this.text(f,`${unpaid?'! ':''}${v} ${LETTER[k]}`,0,0,fs,undefined,0xfff6e2);label.anchor.set(0,.5);const cw=label.width+10;
    g.roundRect(cx,fy-ch/2,cw,ch,ch*.45).fill(unpaid?WINE:INK);label.position.set(cx+5,fy);f.addChild(label);
    if(unpaid)g.moveTo(cx+3,fy+ch*.3).lineTo(cx+cw-3,fy-ch*.3).stroke({color:0xffd9d9,width:1.5});cx+=cw+3;}
   const pr=this.text(f,`P ${c.priority}${c.basicAction||c.characterBound?' ↻':''}`,w/2-8,fy,fs,undefined,INK);pr.anchor.set(1,.5);}
  return f;}
 // Starting value of each resource: the character card of the catalog, else the first view seen.
 private start(id:string,p:Player){const key=`${this.model.view.gameId}:${id}`,known=this.characters().find(c=>c.bindingName===p.character.bindingName)?.resources;
  if(known)return known;if(!this.starts.has(key))this.starts.set(key,{...p.character.resources});return this.starts.get(key)!;}
 /** Values drawn on a board: the view, or during a sequence the step reached (C3-4). */
 private shown(id:string,p:Player){return this.display?.[id]??p.character.resources;}
 // O3/O4/O13: resources as glyph, letter, number and a bar against the start (no cap or floor).
 private board(b:Box,p:Player,id:string,own:boolean,compact:boolean){const c=new Container(),g=new Graphics();c.addChild(g);c.position.set(b.x-b.w/2,b.y-b.h/2);
  g.roundRect(0,0,b.w,b.h,8).fill({color:0x1d140f,alpha:.84}).stroke({color:0xb18c60,width:1.5});
  const r=this.shown(id,p),start=this.start(id,p),rows:string[]=[];
  const bar=(x:number,y:number,bw:number,th:number,kind:Resource)=>{const v=r[kind]??0,m=meter(v,start[kind],kind==='HEALTH'),neg=bw*.18,zero=x+neg,pos=bw-neg;
   g.rect(x,y-th/2,bw,th).fill({color:0x000000,alpha:.45});
   if(m.fill)g.rect(zero,y-th/2,pos*m.fill,th).fill(RES_COLOR[kind]);
   if(m.excess)g.rect(zero,y-th/2,pos*m.excess,th*.42).fill(0xf6efd9);
   if(m.negative)for(let s=0;s<neg*m.negative;s+=3)g.rect(zero-s-2,y-th/2,2,th).fill(0xe0707a);
   if(m.beyond)g.poly(v<0?[x-1,y,x+5,y-th*.7,x+5,y+th*.7]:[x+bw+6,y,x+bw,y-th*.7,x+bw,y+th*.7]).fill(0xf6efd9);
   // Zero line, and a notch at the starting value (half the bar except for health).
   g.rect(zero-.5,y-th*.85,1.5,th*1.7).fill(0xf6efd9);g.rect(x+bw-1,y-th*.85,1,th*1.7).fill({color:0xf6efd9,alpha:.6});
   if(m.start>0&&m.start<1)g.poly([zero+pos*m.start-3,y-th*.5-4,zero+pos*m.start+3,y-th*.5-4,zero+pos*m.start,y-th*.5]).fill(0xf6efd9);};
  // C3-L: type and columns follow the size of the board (C2 values at scale 1).
  if(own){const rh=b.h/RESOURCES.length,fs=rh*(compact?.71:.63),gs=rh*.62,bx=fs*3.75,bw=b.w-bx-12;
   RESOURCES.forEach((k,i)=>{const y=rh*(i+.5),v=r[k]??0;glyph(g,k,8+gs/2,y,gs,RES_COLOR[k]);
    const t=this.text(c,`${v}`,0,0,fs,undefined,v<0?0xffb7bd:0xfff6e2);t.anchor.set(0,.5);t.position.set(12+gs,y);
    bar(bx,y,bw,Math.max(5,rh*.3),k);rows.push(`${LETTER[k]} ${v}`);});}
  // C3-L: name alone on the first row, fitted to the board; health number beside its bar; the other four below.
  else{const fs=b.h*(compact?.25:.24),name=this.text(c,this.name(id).toUpperCase().slice(0,10),0,0,fs,undefined,0xe9dcc2);name.anchor.set(0,.5);name.position.set(6,b.h*.24);
   if(name.width>b.w-12)name.scale.set((b.w-12)/name.width);
   const hp=r.HEALTH??0,mid=b.h*.52,ht=this.text(c,`${hp}`,0,0,fs*1.2,undefined,hp<0?0xffb7bd:0xfff6e2);ht.anchor.set(1,.5);ht.position.set(b.w-6,mid);
   const hx=b.w-6-ht.width-fs*.65;glyph(g,'HEALTH',hx,mid,fs*.95,RES_COLOR.HEALTH);
   const slot=(b.w-8)/4;(['ALERTNESS','VIOLENCE','TOXICITY','ALCOHOL'] as Resource[]).forEach((k,i)=>{const x=6+i*slot,y=b.h*.8;glyph(g,k,x+fs*.5,y,fs*.9,RES_COLOR[k]);const t=this.text(c,`${r[k]??0}`,0,0,fs,undefined,0xfff6e2);t.anchor.set(0,.5);t.position.set(x+fs*1.1,y);});
   bar(6,mid,hx-fs*.6-14,Math.max(3,b.h*.08),'HEALTH');}
  this.world.addChild(c);return own?{values:{...r},reference:Object.fromEntries(RESOURCES.map(k=>[k,meter(0,start[k],k==='HEALTH').reference])),rows}:null;}
 // Statuses, equipment, immunities and timers as chips on the lower art of the character card.
 // Shape and short text carry the meaning; the summary opens on hover, tap or focus.
 private statusChips(b:Box,id:string,p:Player){const chips=chipsOf(id,p.character);if(!chips.length)return;
  const ch=b.h,cw=Math.min(ch*1.7,b.w/chips.length),step=chips.length>1?Math.min(cw+2,(b.w-cw)/(chips.length-1)):0,fs=ch*.6;
  const fill={good:0x2c6262,bad:WINE,equip:0x86561b,immunity:0x343f6b,timer:INK};
  chips.forEach((chip,i)=>{const x=b.x-b.w/2+cw/2+i*step,y=b.y,c=new Container(),g=new Graphics();c.addChild(g);c.position.set(x,y);
   g.roundRect(-cw/2,-ch/2,cw,ch,ch*.35).fill(fill[chip.kind]).stroke({color:PAPER,width:1.2});const gx=-cw/2+ch*.45,s=ch*.6;
   if(chip.kind==='good')glyph(g,'RESOURCES',gx,0,s,PAPER);else if(chip.kind==='bad')glyph(g,'DISRUPT',gx,0,s,PAPER);else if(chip.kind==='equip')glyph(g,'DAMAGE',gx,0,s,PAPER);
   else if(chip.kind==='immunity')g.circle(gx,0,s/2).stroke({color:PAPER,width:1.5}).moveTo(gx-s*.35,s*.35).lineTo(gx+s*.35,-s*.35).stroke({color:PAPER,width:1.5});
   else g.circle(gx,0,s/2).stroke({color:PAPER,width:1.5}).moveTo(gx,0).lineTo(gx,-s*.32).moveTo(gx,0).lineTo(gx+s*.25,0).stroke({color:PAPER,width:1.3});
   const tx=this.text(c,chip.short,0,0,fs,undefined,0xfff6e2);tx.anchor.set(0,.5);tx.position.set(gx+s*.6,0);
   if(this.openStatus===chip.id||this.hovered===chip.id||this.focused===chip.id)g.roundRect(-cw/2-2,-ch/2-2,cw+4,ch+4,ch*.4).stroke({color:0xf1e4c4,width:2});
   this.world.addChild(c);this.chips[chip.id]={...chip,x,y:y-ch/2};
   // Same owner as the character: with a card chosen, a tap here aims at that character.
   this.hits.push({id:chip.id,kind:'status',x,y,w:cw,h:ch,angle:0,target:{owner:id},label:`${chip.title}. ${chip.text}`,node:c});});}
 // C3-2: the round's overall change of a seat, as the model gives it; nothing computed here. Shrinks to its strip.
 private seatSummary(b:Box,marks:SeatMark[],compact:boolean){const c=new Container(),g=new Graphics(),row=new Container();c.addChild(g,row);c.position.set(b.x,b.y);
  g.roundRect(-b.w/2,-b.h/2,b.w,b.h,b.h*.4).fill({color:0x120c08,alpha:.86}).stroke({color:0xd9b98a,width:1});
  const fs=compact?10:14,texts=marks.length?marks.map(m=>m.text):['invariato'];let x=0;
  texts.forEach((t,i)=>{const m=marks[i],color=!m?0xcbbca2:m.key==='ITEMS'?0xe9dcc2:m.delta<0?0xffb7bd:0xc9f0b0;const tx=this.text(row,t,0,0,fs,undefined,color);tx.anchor.set(0,.5);tx.position.set(x,0);x+=tx.width+fs*.55;});
  const width=Math.max(1,x-fs*.55),scale=Math.min(1,(b.w-8)/width);row.scale.set(scale);row.position.set(-width*scale/2,0);
  this.world.addChild(c);return texts;}
 // C3-L: own deck (backs, with the count of the view) and discard pile (the last card that went there, R02), small, beside the own character.
 private piles(L:TableLayout,compact:boolean):Readout['piles']{const P=L.piles,v=this.model.view,me=this.model.me,p=v.players[me];if(!P||!p)return null;
  const cards=[...this.catalog(),...this.model.hand.map(c=>c.card)];
  if(this.pile.game!==v.gameId)this.pile={game:v.gameId,turn:-1,top:null};
  if(this.pile.turn!==v.turn){const t=discardTop(v.resolvedMoves,me,cards);if(t)this.pile.top=t;this.pile.turn=v.turn;}
  const empty=(b:Box)=>this.world.addChild(new Graphics().roundRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h,4).fill({color:0x1d140f,alpha:.35}).stroke({color:0xb18c60,width:1.5,alpha:.8}));
  const d=P.deck,count=p.deck;
  if(count>0){for(let i=Math.min(3,count)-1;i>=0;i--){const bk=this.back(d.w,d.h);bk.position.set(d.x-i*1.5,d.y-i*1.5);this.world.addChild(bk);}
   const r=compact?8:11,badge=new Container();badge.addChild(new Graphics().circle(0,0,r).fill(INK).stroke({color:PAPER,width:1.5}));badge.position.set(d.x+d.w/2-r*.4,d.y-d.h/2+r*.4);
   const t=this.text(badge,String(count),0,0,compact?9:12,undefined,0xfff6e2);t.anchor.set(.5);this.world.addChild(badge);}
  else empty(d);
  // The discard pile is too small for a readable face: frame and art of the top card, its name in «Ultimo turno» and the inspection.
  const s=P.discard,name=this.pile.top;
  if(name){const c=cards.find(x=>x.name===name)??plain(name),f=this.frame(s.w,s.h),art=new Sprite(this.art[artIndex(c.bindingName)]);art.position.set(-s.w/2+3,-s.w/2+3);art.width=art.height=s.w-6;f.addChild(art);f.position.set(s.x,s.y);f.rotation=.05;this.world.addChild(f);}
  else empty(s);
  return {deck:count,discard:name};}
 // C3-L: the cards of the last resolved round in the middle, in resolution order (the first at the bottom), each with its author;
 // voided ones with a wine tag and a line across their visible strip. During a sequence only the cards already landed (rule 2: then the view).
 private roundCards(L:TableLayout,compact:boolean):Readout['played']{const P=L.played,v=this.model.view;if(!P)return null;
  const known=[...this.catalog(),...this.model.hand.map(c=>c.card),...Object.values(v.players).flatMap(p=>p.character.items)];
  const moves=v.resolvedMoves.slice(0,P.slots.length),shown=this.seqStarted?Math.min(this.landed,moves.length):moves.length,strip=P.slots.length>1?P.slots[1].y-P.slots[0].y:P.slots[0].h*.2;
  return moves.slice(0,shown).map((m,i)=>{const b=P.slots[i],f=this.card(known.find(x=>x.name===m.playedCardName)??plain(m.playedCardName),b.w,b.h,true);f.position.set(b.x,b.y);f.rotation=i%2?.025:-.025;this.world.addChild(f);
   // Author in the column beside the cascade, level with the title strip; a voided move has a wine tag and a line across its strip.
   const t=P.tags[i],tag=new Container(),who=this.text(tag,`${m.playerId===this.model.me?'TU':this.name(m.playerId).toUpperCase()}${m.void?' ✕':''}`,0,0,t.h*.62,undefined,0xfff6e2);who.anchor.set(.5);
   if(who.width>t.w-6)who.scale.set((t.w-6)/who.width);tag.addChildAt(new Graphics().roundRect(-t.w/2,-t.h/2,t.w,t.h,t.h*.35).fill({color:m.void?WINE:INK,alpha:.92}).stroke({color:PAPER,width:1}),0);tag.position.set(t.x,t.y);this.world.addChild(tag);
   if(m.void){const y=b.y-b.h/2+strip*.5;this.world.addChild(new Graphics().moveTo(b.x-b.w/2+3,y+strip*.25).lineTo(b.x+b.w/2-3,y-strip*.25).stroke({color:WINE,width:compact?2:3}));}
   return {name:m.playedCardName,author:m.playerId,void:!!m.void};});}
 private back(w:number,h:number){const c=this.frame(w,h);c.addChild(new Graphics().roundRect(-w/2+4,-h/2+4,w-8,h-8,2).fill(WINE).stroke({color:0xa47763,width:1}));
  const g=new Graphics().circle(0,0,w*.2).fill(0xcab184).stroke({color:INK,width:1});g.moveTo(-w*.27,-h*.25).lineTo(w*.27,h*.25).moveTo(w*.27,-h*.25).lineTo(-w*.27,h*.25).stroke({color:0xcab184,width:2});c.addChild(g);return c;}
 private halo(c:Container,w:number,h:number,color=PETROL){c.addChild(new Graphics().roundRect(-w/2-3,-h/2-3,w+6,h+6,6).stroke({color,width:3}));}
 // K4/D9: "Computer 1–4" in join order when several computers sit at the table.
 private name(id:string){return playerName(id,Object.keys(this.model.view.players));}
 resize(w:number,h:number){this.width=w;this.height=h;this.app.renderer.resize(w,h);this.background.width=w;this.background.height=h;this.draw();}
 draw(){if(!this.art.length)return;
  // Old nodes survive one render, so Pixi's ref-counted text textures are reused instead of re-rasterized on every tap.
  this.retiring.push(...this.world.removeChildren());this.hits=[];this.backs={};this.chips={};this.pendingGhost=null;
  const w=this.width,h=this.height,view=this.model.view,me=this.model.me,ids=Object.keys(view.players);
  const L=tableLayout(w,h,ids,me,Object.fromEntries(ids.map(id=>[id,view.players[id].character.items.length])));this.layout=L;const compact=L.compact,H=L.hand;
  const hover=this.drag?null:this.hovered,raised:Container[]=[];let board:Readout['board']=null,roundSummary:Readout['summary']=null;
  for(const seat of L.seats){const id=seat.id,p=view.players[id],{x,y,w:cw,h:ch}=seat.person;
   if(id!==me){const count=p.cardsInHand as number,b=seat.backs,f=fan(b,seat.back,count);this.backs[id]=count;
    for(let n=0;n<count;n++){const k=n-(count-1)/2,bk=this.back(seat.back.w,seat.back.h);bk.position.set(b.x+k*f.step,b.y);bk.rotation=k*f.turn;this.world.addChild(bk);}}
   const person=this.face(p.character.name,artIndex(p.character.bindingName),cw,ch,'PERSONAGGIO',true);person.position.set(x,y);person.rotation=id===me?-.04:.025;this.world.addChild(person);
   const dead=p.character.dead,forfeit=view.forfeits[id];if(dead||forfeit){person.alpha=.55;this.text(person,dead?'ELIMINATO':'FORFAIT',0,0,compact?11:16,cw,0xffffff);}
   const r=p.character.resources,summary=RESOURCES.map(k=>`${LETTER[k]} ${r[k]??0}`).join(', ');
   const charHit:Hit={id:`person-${id}`,kind:'person',x,y,w:cw,h:ch,angle:person.rotation,target:{owner:id},label:`${id===me?'Tu':this.name(id)}, ${p.character.name}, salute ${r.HEALTH}${dead?', eliminato':forfeit?', forfait':''}; risorse ${summary}`,node:person};this.hits.push(charHit);
   if(this.model.allows({owner:id})&&!this.model.locked)this.halo(person,cw,ch,this.model.target?.owner===id&&this.model.target.itemIndex===undefined?0xf1e4c4:PETROL);
   const read=this.board(seat.board,p,id,id===me,compact);if(read)board=read;
   this.statusChips(seat.status,id,p);
   if(this.marks&&!this.seqStarted){const texts=this.seatSummary(seat.summary,this.marks[id]??[],compact);(roundSummary??={key:this.marksKey,seats:{}}).seats[id]={texts,box:seat.summary};}
   const covered=coveredItems(seat.items);
   p.character.items.forEach((item,index)=>{const b=seat.items[index]??seat.items[seat.items.length-1],c=this.card(item,b.w,b.h,true),hid=`item-${id}-${index}`;c.position.set(b.x,b.y);c.rotation=(index-1)*.025;this.world.addChild(c);
    const hit:Hit={id:hid,kind:'item',x:b.x,y:b.y,w:b.w,h:b.h,angle:c.rotation,covered:!!covered[index],target:{owner:id,itemIndex:index},label:`${item.name}, oggetto di ${id===me?'te':this.name(id)}${roleLabel(item)?`, ruolo ${roleLabel(item).toLowerCase()}`:''}${item.gains&&item.gains!=='—'?`, dà ${item.gains}`:''}, copia ${index+1}`,node:c};this.hits.push(hit);
    // Raised (over its neighbour) by the mouse at rest, a first touch (K7) or the keyboard focus.
    if(hover===hid||this.peek===hid||this.focused===hid){c.scale.set(1.15);hit.w*=1.15;hit.h*=1.15;raised.push(c);}
    if(this.model.allows({owner:id,itemIndex:index})&&!this.model.locked)this.halo(c,b.w,b.h);});
  }
  const played=this.roundCards(L,compact),piles=this.piles(L,compact);
  const n=this.model.hand.length,res=view.players[me]?.character.resources??{},hand:Readout['hand']=[];let lifted:Container|null=null;
  this.model.hand.forEach((local,i)=>{const k=i-(n-1)/2,a=k*.05,x=H.center+k*H.step,y=H.y+Math.abs(k)*3;
   // O11: a light visual hint only. The card stays selectable, inspectable and sendable; the server judges.
   const short=shortfall(local.card,res),payable=!short.length,role=roleOf(local.card),gains=gainsOf(local.card).map(gainText);
   const c=this.card(local.card,H.w,H.h,false,short);c.position.set(x,y);c.rotation=a;this.world.addChild(c);if(!payable)c.alpha=.66;
   if(this.drag?.moved&&this.drag.key===local.key)c.alpha=.22;
   const hit:Hit={id:local.key,kind:'hand',key:local.key,x,y,w:H.w,h:H.h,angle:a,label:`${local.card.name}, ${subtype(local.card)}${role?`, ruolo ${ROLES[role].label.toLowerCase()}`:''}, costo ${cost(local.card)}${payable?'':', risorse insufficienti'}${gains.length?`, dà ${gains.join(' ')}`:''}, priorità ${local.card.priority}, copia ${i+1}`,node:c};this.hits.push(hit);
   // O12: hover (mouse), tap (selection) or focus lifts the whole card; its hit keeps the old slot too, so it does not flicker.
   // Once a target is chosen the card is shown in the centre preview: in the hand it rests, so a bound
   // card does not cover the neighbour to discard.
   const chosen=local.key===this.model.selected&&!this.model.target;
   if(chosen||local.key===this.focused||(local.key===hover&&local.key!==this.model.selected)){c.y-=H.lift;c.scale.set(H.zoom);c.rotation=a*.4;hit.angle=c.rotation;hit.h=H.h+H.lift;hit.y=y-H.lift/2;
    // A card raised only by the mouse keeps its resting width, so sliding left still reaches the previous card.
    if(chosen||local.key===this.focused){hit.w=H.w*H.zoom;hit.h=H.h*H.zoom+H.lift;}
    if(chosen)lifted=c;else raised.push(c);}
   if(local.key===this.model.selected||local.key===this.focused)this.halo(c,H.w,H.h);
   if(local.key===this.model.discard){this.halo(c,H.w,H.h,0xdc9699);this.text(c,'SCARTO',0,0,compact?14:22,H.w,WINE);}
   if(this.model.selectedCard?.characterBound&&this.model.target&&local.key!==this.model.selected&&(local.card.basicAction||local.card.characterBound||local.card.lastResort))c.alpha=Math.min(c.alpha,.55);
   hand.push({key:local.key,name:local.card.name,role,gains,payable,alpha:c.alpha});
  });
  // Raised cards on top, the selected one last.
  if(lifted)raised.push(lifted);raised.forEach(c=>this.world.setChildIndex(c,this.world.children.length-1));
  this.preview={x:L.preview.x,y:L.preview.y};
  if(this.model.selectedCard&&this.model.target){const pc=this.card(this.model.selectedCard,L.preview.w,L.preview.h,false,shortfall(this.model.selectedCard,res));pc.position.set(this.preview.x,this.preview.y);pc.rotation=-.10;this.halo(pc,L.preview.w,L.preview.h);this.world.addChild(pc);this.pendingGhost=pc;
   const dest=this.hits.find(z=>z.target?.owner===this.model.target!.owner&&z.target?.itemIndex===this.model.target!.itemIndex);if(dest){this.world.addChild(new Graphics().moveTo(this.preview.x,this.preview.y-35).quadraticCurveTo(this.preview.x,dest.y,dest.x,dest.y).stroke({color:PETROL,width:2,alpha:.8}));}
  }
  const mine=L.seats.find(s=>s.me);this.readout={layout:{hand:{w:H.w,h:H.h},person:{w:mine?.person.w??0,h:mine?.person.h??0},item:{w:mine?.items[0].w??0,h:mine?.items[0].h??0}},piles,played,hand,board,summary:roundSummary,boards:Object.fromEntries(ids.map(id=>[id,{...this.shown(id,view.players[id])}]))};
  if(this.model.phase==='sending'||this.model.phase==='uncertain')this.world.alpha=.86;else this.world.alpha=1;
  this.drawAim();this.onLayout();
 }
 // C3-3 (O6, D3): one arrow per admitted character and, for a card that takes an object, one per seat that has some. Only
 // visual help: the categories are the ones of the outlines (Model.allows) and the server stays the judge. None when the
 // choice is locked (pending, eliminated, outcome) or once a target is chosen (the single line to the preview remains).
 drawAim(){const t0=performance.now(),g=this.aimG,m=this.model,L=this.layout,d=this.drag;this.aimDirty=false;g.clear();this.arrows=[];this.aimLayer.alpha=1;
  if(!L||!m.selected||m.target||m.locked||!m.selectedCard)return;
  let source:Box|null=null;
  if(d?.moved){if(this.ghost)source={x:this.ghost.x,y:this.ghost.y,w:this.ghostH/1.38,h:this.ghostH};}
  else{const h=this.hits.find(x=>x.kind==='hand'&&x.key===m.selected);if(h)source={x:h.x,y:h.y-L.hand.lift/2,w:h.w,h:h.h-L.hand.lift};}
  if(!source)return;
  const targets:AimTarget[]=[],lastItem=new Map<string,Hit>();
  for(const h of this.hits){if(!h.target||!m.allows(h.target))continue;
   if(h.kind==='person')targets.push({id:h.id,owner:h.target.owner,kind:'person',box:{x:h.x,y:h.y,w:h.w,h:h.h}});
   else if(h.kind==='item'&&(h.target.itemIndex??-1)>(lastItem.get(h.target.owner)?.target?.itemIndex??-1))lastItem.set(h.target.owner,h);}
  for(const h of lastItem.values())targets.push({id:h.id,owner:h.target!.owner,kind:'item',itemIndex:h.target!.itemIndex,box:{x:h.x,y:h.y,w:h.w,h:h.h}});
  this.arrows=aimArrows(source,targets,{w:this.width,h:this.height},{avoid:[confirmButtons(L.preview,this.width,L.compact)],head:L.compact?20:30});
  // Pop-art style (owner's reference, after C3-3): one ribbon that ends in a barbed head, all in the light blue of the target outlines,
  // with a bold black outline, a cartoon highlight on the head and a solid black extrusion down and to the left. The layer is translucent
  // as a whole (one filter, so overlaps do not darken) to leave what the arrows cross partly visible. A short arrow pushes its tip into
  // the target rather than shrinking to a blob.
  const C=L.compact,drawn=this.arrows.filter(a=>!a.reached),depth=C?5:8,line=C?3:4,boxes=new Map(targets.map(t=>[t.id,t.box]));
  const shapes=drawn.map(a=>arrowShape(a,{tail:C?9:13,neck:C?16:26,head:C?32:50,minLen:C?78:120,reach:C?30:46,push:C?6:10,target:boxes.get(a.id)}));
  for(const s of shapes)for(let k=1;k<=4;k++){const o=depth*k/4;g.poly(s.outline.map((v,i)=>i%2?v+o*.7:v-o)).fill(INK).stroke({color:INK,width:3,join:'round'});}
  for(const s of shapes){g.poly(s.outline).fill(PETROL).stroke({color:INK,width:line,join:'miter',miterLimit:8});
   g.moveTo(s.shine[0].x,s.shine[0].y).lineTo(s.shine[1].x,s.shine[1].y).stroke({color:0xe6fbfb,width:C?2.5:3.5,cap:'round',alpha:.9});}
  this.aimLayer.filters=drawn.length?[this.aimAlpha]:null;
  this.stats.aimDraws++;this.stats.aimMs.push(performance.now()-t0);if(this.stats.aimMs.length>600)this.stats.aimMs.shift();}
 hit(x:number,y:number,targetsOnly=false){return [...this.hits].sort((a,b)=>this.world.getChildIndex(b.node)-this.world.getChildIndex(a.node)).find(r=>{if(targetsOnly&&r.kind==='hand')return false;const dx=x-r.x,dy=y-r.y,c=Math.cos(-r.angle),s=Math.sin(-r.angle);return Math.abs(dx*c-dy*s)<=r.w/2&&Math.abs(dx*s+dy*c)<=r.h/2;});}
 point(e:PointerEvent){const r=this.app.canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
 down(e:PointerEvent){if(this.blocked||this.contextLost||e.button!==0)return;this.inputStart=performance.now();const p=this.point(e),hit=this.hit(p.x,p.y);
  // A tap or click anywhere else lowers raised cards and drops the choice (like Escape).
  if(hit?.kind==='item'&&touchRaises(e.pointerType,!!hit.covered,this.peek===hit.id)){this.advance();this.peek=hit.id;this.draw();this.onState();return;}
  this.peek=null;
  if(!hit){this.advance();this.openStatus=null;const had=this.focused;this.focused=null;if(had)(document.activeElement as HTMLElement|null)?.blur?.();if(!this.model.locked&&this.model.selected)this.model.cancel();else{this.draw();this.onState();}return;}
  if(hit.kind==='hand')this.finish('input');else this.advance();if(hit.kind==='hand'&&!this.model.locked){this.drag={id:e.pointerId,key:hit.key!,x:p.x,y:p.y,lastX:p.x,lastY:p.y,moved:false,insertion:null,touch:e.pointerType!=='mouse'};this.app.canvas.setPointerCapture(e.pointerId);this.focus(hit.key!);}else this.activate(hit.id,true);}
 // Hover is tracked only for a mouse at rest: it drives the (i) inspect button of the shell.
 private setHover(id:string|null){if(this.hovered!==id){const was=this.hovered;this.hovered=id;this.onHover(id);if(!this.drag&&[was,id].some(x=>x&&!x.startsWith('person-')))this.draw();else this.onState();}}
 move(e:PointerEvent){if(!this.drag){if(e.pointerType==='mouse'&&!this.blocked){const p=this.point(e);this.setHover(this.hit(p.x,p.y)?.id??null);}return;}if(this.drag.id!==e.pointerId)return;const p=this.point(e),d=this.drag;d.lastX=p.x;d.lastY=p.y;if(!d.moved&&Math.hypot(p.x-d.x,p.y-d.y)>8){d.moved=true;this.setHover(null);this.drawGhost(d.key);this.model.select(d.key);}
  if(!d.moved)return;this.placeGhost(p.x,p.y);this.aimDirty=true;d.insertion=p.y>this.height*.68?this.indexAt(p.x):null;
  // The dragged card is lifted out of the fan; the others open a real gap where it would land.
  const hand=this.hits.filter(x=>x.kind==='hand'),gap=(hand[0]?.w||80)*.42,from=this.model.hand.findIndex(c=>c.key===d.key);
  for(const hit of hand){hit.node.x=hit.x;if(d.insertion===null||hit.key===d.key)continue;const idx=this.model.hand.findIndex(c=>c.key===hit.key),slot=idx>from?idx-1:idx;hit.node.x+=slot>=d.insertion?gap:-gap;}
  const target=this.dropTarget(p.x,p.y);this.ghostOver=!!target;if(this.ghost)this.ghost.alpha=this.ghostOver||d.insertion!==null?1:.94;
 }
 // Touch: the card floats above the finger so it stays visible; mouse: it hangs just under the cursor.
 private placeGhost(x:number,y:number){if(!this.ghost||!this.drag)return;const lift=this.drag.touch?this.ghostH*.62:this.ghostH*.18;this.ghost.position.set(x,Math.max(this.ghostH*.5,y-lift));this.ghost.rotation=Math.max(-.22,Math.min(.22,(x-this.drag.x)/900))-.04;}
 // A compatible target under the pointer, or under the lifted card on touch.
 private dropTarget(x:number,y:number){const ok=(h?:Hit)=>h?.target&&this.model.allows(h.target)?h:undefined;return ok(this.hit(x,y,true))??(this.drag?.touch?ok(this.hit(x,y-this.ghostH*.62,true)):undefined);}
 private indexAt(x:number){const hs=this.hits.filter(h=>h.kind==='hand'&&h.key!==this.drag?.key);let i=hs.findIndex(h=>x<h.x);return i<0?hs.length:i;}
 private drawGhost(key:string){this.clearGhost();const c=this.model.hand.find(x=>x.key===key);if(!c)return;const gw=this.layout?.hand.w??(this.height<550?112:180);this.ghostH=gw*1.38;this.ghost=this.card(c.card,gw,this.ghostH);
  this.ghost.addChildAt(new Graphics().roundRect(-gw/2+10,-this.ghostH/2+16,gw,this.ghostH,8).fill({color:0x0c0705,alpha:.45}),0);this.fx.addChild(this.ghost);this.placeGhost(this.drag?.lastX??0,this.drag?.lastY??0);}
 private clearGhost(){if(this.ghost){this.ghost.destroy({children:true});this.ghost=null;}}
 up(e:PointerEvent){const d=this.drag;if(!d||d.id!==e.pointerId)return;this.drag=null;this.clearGhost();if(this.app.canvas.hasPointerCapture(e.pointerId))this.app.canvas.releasePointerCapture(e.pointerId);
  const p=this.point(e);if(!d.moved){this.activate(d.key,true);return;}
  this.drag=d;const target=this.dropTarget(p.x,p.y);this.drag=null;
  // Own objects can share the lower band with the fan: a compatible physical target wins.
  if(target)this.model.aim(target.target!);
  else if(d.insertion!==null&&p.x>this.width*.25&&p.x<this.width*.98){const keys=this.model.hand.map(x=>x.key).filter(k=>k!==d.key);keys.splice(d.insertion,0,d.key);this.model.cancel();this.model.reorder(keys);}
  else this.model.cancel();this.ghostOver=false;this.draw();}
 // `pointer`: the sequence was already handled on pointerdown. Keyboard and the semantic layer: a hand card ends it, the rest advances.
 activate(id:string,pointer=false){if(this.blocked||this.contextLost||this.height>this.width)return;this.inputStart=performance.now();const hit=this.hits.find(h=>h.id===id);if(!hit)return;
  if(!pointer){if(hit.kind==='hand')this.finish('input');else this.advance();}
  if(hit.kind==='hand'){if(this.model.locked){this.inspect(id);return;}this.model.select(hit.key!);}
  // A table element that is not an admitted target also counts as "elsewhere".
  else if(this.model.selected&&!this.model.locked){if(!this.model.aim(hit.target!))this.model.cancel();}
  else if(hit.kind==='status'){this.openStatus=this.openStatus===id?null:id;this.draw();this.onState();}else this.inspect(id);
 }
 inspect(id:string){const hit=this.hits.find(h=>h.id===id);if(!hit)return;if(hit.kind==='hand'){const card=this.model.hand.find(x=>x.key===hit.key)!.card;this.onInspect({title:card.name,card});}
  else if(hit.kind==='item'){const card=this.model.view.players[hit.target!.owner].character.items[hit.target!.itemIndex!];this.onInspect({title:card.name,card,owner:hit.target!.owner});}
  else this.onInspect({title:this.model.view.players[hit.target!.owner].character.name,owner:hit.target!.owner});}
 /** The status summary to show: hovered, focused or opened by a tap. */
 get statusShown(){const id=[this.hovered,this.focused,this.openStatus].find(x=>x?.startsWith('status-'));return id?this.chips[id]??null:null;}
 // Keyboard: I inspects; Shift+arrows move the focused hand card one slot (local order only, no SEND).
 key(id:string,e:KeyboardEvent){this.advance();if(e.key==='i'||e.key==='I'){e.preventDefault();this.inspect(id);return;}
  if(e.shiftKey&&['ArrowLeft','ArrowRight'].includes(e.key)&&!this.model.locked){const keys=this.model.hand.map(c=>c.key),i=keys.indexOf(id);if(i<0)return;e.preventDefault();
   const j=Math.max(0,Math.min(keys.length-1,i+(e.key==='ArrowRight'?1:-1)));if(i===j)return;[keys[i],keys[j]]=[keys[j],keys[i]];this.model.reorder(keys);}}
 focus(id:string|null){this.focused=id;this.draw();}
 // `sequence` false: only the gesture is cancelled (same-turn view, window blur), the sequence goes on.
 interrupt(reason:string,redraw=true,sequence=true){if(this.drag||(sequence&&this.seqStarted))this.stats.cancels.push(reason);this.peek=null;const d=this.drag;this.drag=null;if(d&&this.app.canvas.hasPointerCapture(d.id))this.app.canvas.releasePointerCapture(d.id);this.clearGhost();if(sequence)this.finish(reason,false);
  if(d)this.model.cancel();this.setHover(null);if(redraw)this.draw();this.onState();}
 escape(){this.openStatus=null;this.interrupt('escape');this.model.cancel();}
 beginSequence(previous:View){
  const v=this.model.view,round=this.model.round;
  // Rule 1: once per gameId/turn. Rule 3: only a contiguous round of the same connection. K3: no motion, no sequence
  // (the static summary is already on the table).
  if(!plays(round,this.seqSeen,{reduced:this.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches,hidden:document.hidden,contextLost:this.contextLost}))return;
  const k=round!.facts.key;this.seqSeen=k;this.seqKey=k;
  const seen=[...this.catalog(),...this.model.hand.map(c=>c.card),...Object.values(previous.players).flatMap(p=>p.character.items),...Object.values(v.players).flatMap(p=>p.character.items)];
  const registry=[...new Map(seen.map(c=>[c.name,c])).values()];
  // C3-4: the round from certain data only (timeline in resolution.ts), directed card by card by D13: cost, close-ups, flight,
  // voids, objects, changes per card when the report lines are verified (otherwise the totals, D5), then draws and end of turn.
  const T=timeline(previous,v,round!.facts,[...this.catalog(),...this.model.hand.map(c=>c.card)]);if(!T)return;
  // Opponent cards are known only by the published name; an unknown name still flies as a plain face.
  const named=(name:string):Card=>registry.find(c=>c.name===name)??plain(name);
  const C=this.height<550,L=this.layout,p=T.pace;this.pace=p;this.plan=T;
  const seat=(id:string)=>this.hits.find(h=>h.id===`person-${id}`),place=(id:string)=>L?.seats.find(s=>s.id===id);
  const inside=(x:number,y:number):Point=>({x:Math.max(30,Math.min(this.width-30,x)),y:Math.max(30,Math.min(this.height-30,y))});
  // C3-L: the own deck and discard pile are drawn small beside the own character; the opponents' sit beside theirs, not drawn:
  // the deck on the right, the discard on the left.
  const own=(id:string,b:Box|undefined)=>id===this.model.me&&b?{x:b.x,y:b.y}:null;
  const deck=(id:string)=>{const s=seat(id);return own(id,L?.piles?.deck)??(s?inside(s.x+s.w*.85,s.y-s.h*.15):null);},discard=(id:string)=>{const s=seat(id);return own(id,L?.piles?.discard)??(s?inside(s.x-s.w*.85,s.y+s.h*.1):null);};
  const itemAt=(id:string,name:string,before:boolean):Point|null=>{const view=before?previous:v,items=view.players[id]?.character.items??[],i=before?items.findIndex(c=>c.name===name):items.map(c=>c.name).lastIndexOf(name),slots=place(id)?.items??[];
   const b=i<0?null:slots[i]??slots.at(-1);return b?{x:b.x,y:b.y}:null;};
  const add=<N extends Container>(node:N)=>{node.visible=false;this.fx.addChild(node);return node;};
  const count={played:0,drops:0,stamps:0,tokens:0,objects:0,consumed:0,passed:0,broken:0,discards:0,draws:0,endOfTurn:0,emphasis:0,steps:0,pops:0,closeUps:0,targetUps:0};
  const mw=C?52:80,mh=C?72:112,iw=C?44:65,ih=C?62:91;
  // Board values start from the previous view; each step moves them (per card) or the tail sets the final ones (total).
  this.display=Object.fromEntries(Object.keys(v.players).map(id=>[id,{...(previous.players[id]?.character.resources??{})}]));
  this.events=[];this.landed=0;
  const change=(at:number,dur:number,steps:Step[])=>{if(!steps.length)return;count.steps+=steps.length;
   this.events.push({at,run:()=>{for(const s of steps)(this.display![s.seat]??={})[s.resource]=s.to;}});
   const stack=new Map<string,number>();for(const s of steps){const n=stack.get(s.seat)??0;stack.set(s.seat,n+1);if(this.pop(s,n,at,dur))count.pops++;}};
  // D13 (owner after the C3-4 trial), for every card in resolution order: its author pays it, comes forward with the card
  // beside it, goes back to its seat, the card flies to the target and hits it, the target comes forward a little, then
  // the card's changes. Close-ups avoid the other seats and the hand (readability.ts).
  const hand=this.hits.filter(x=>x.kind==='hand').map(x=>({x:x.x,y:x.y,w:x.w,h:x.h}));
  // C3-L: a close-up keeps clear of the round's cards and the own piles too, unless passing over them lets it grow more or come nearer
  // the middle (then it covers them for its second).
  const pileBoxes=[...(L?.played?[L.played.box]:[]),...(L?.piles?[L.piles.deck,L.piles.discard]:[])];
  const ups=new Map<string,CloseUp>();const upOf=(id:string)=>{if(!ups.has(id)){const s=place(id)!,avoid=[...(L?.seats??[]).filter(x=>x.id!==id).flatMap(seatBoxes),...hand],range=closeUpRange(id===this.model.me);
   const c=closeUp(s.person,{w:this.width,h:this.height},[...avoid,...pileBoxes],range),o=closeUp(s.person,{w:this.width,h:this.height},avoid,range);
   const far=(x:CloseUp)=>Math.hypot(x.box.x-this.width/2,x.box.y-this.height*.42);ups.set(id,c.placed==='middle'&&(c.scale>o.scale||(c.scale===o.scale&&far(c)<=far(o)))?c:o);}return ups.get(id)!;};
  const character=(id:string,w:number,h:number)=>{const p=v.players[id]?.character??previous.players[id]?.character;return this.face(p?.name??'',artIndex(p?.bindingName??''),w,h,'PERSONAGGIO',true);};
  T.moves.forEach((m,i)=>{const from=seat(m.author),to=seat(m.target),P=p.moves[i],home=place(m.author)?.person,aim=place(m.target)?.person;if(!from||!to||!home||!aim)return;
   const at={cost:P.cost.at,author:P.author.at,back:P.back.at,flight:P.flight.at,target:P.target.at,changes:P.changes.at};
   // 1. Cost: this card's tokens leave its author; the bound's extra card leaves the hand for the discard.
   m.tokens.forEach((tk,n)=>{const b=place(m.author)?.board;if(!b)return;
    const r=C?10:14,node=add(new Container()),g=new Graphics().circle(0,0,r).fill(RES_COLOR[tk.resource]).stroke({color:INK,width:2});node.addChild(g);glyph(g,tk.resource,-r*.35,0,r*.9,0xfff6e2);
    const label=this.text(node,`−${tk.amount}`,r*.45,0,C?10:13,undefined,0xfff6e2);label.anchor.set(0,.5);
    const p0=inside(b.x-b.w*.3+n*(r*2.6),b.y-b.h*.5);this.flights.push({node,from:p0,to:{x:p0.x,y:p0.y-(C?34:52)},start:P.cost.at+n*60,end:P.cost.at+P.cost.dur,mode:'rise'});count.tokens++;});
   if(m.discard){const d=add(this.card(named(m.discard),iw,ih)),a={x:from.x+from.w*.5,y:from.y-(C?10:18)};this.flights.push({node:d,from:a,to:discard(m.author)??a,start:P.cost.at,end:P.cost.at+P.cost.dur,mode:'travel'});count.discards++;}
   change(P.cost.at+P.cost.dur*.3,P.cost.dur*.7,m.costSteps);
   // 2–3. Close-up of the author: its character grows to the free place with the card beside it, stays, then goes back.
   const up=upOf(m.author),node=add(new Container()),person=character(m.author,up.person.w,up.person.h),card=this.card(named(m.card),up.card.w,up.card.h);
   person.position.set(up.person.x-up.box.x,0);card.position.set(up.card.x-up.box.x,0);card.rotation=.04;this.halo(card,up.card.w,up.card.h,0xf1e4c4);node.addChild(person,card);
   const s0=home.h/up.person.h,rest={x:home.x-(up.person.x-up.box.x)*s0,y:home.y,s:s0};
   this.zooms.push({node,rest,up:{x:up.box.x,y:up.box.y,s:1},at:P.author.at,grow:P.author.dur*BEAT_PHASE.grow,hold:P.back.at,end:P.back.at+P.back.dur,fade:card});count.closeUps++;
   this.stats.closeUps.push({key:k,move:i,author:m.author,box:up.box,person:up.person,card:up.card,scale:up.scale,placed:up.placed,targetId:m.target,target:null,others:(L?.seats??[]).filter(x=>x.id!==m.author).flatMap(seatBoxes)});
   // 4. Flight and impact, as before: from the author's seat to the target, then to the author's discard after the changes.
   const fly=add(this.card(named(m.card),mw,mh)),end=P.changes.at+Math.max(P.changes.dur,P.target.dur*.4),hit=P.flight.at+P.flight.dur*BEAT_PHASE.fly;
   // C3-L: after its changes the card lands in the cascade of the round's cards in the middle (slot i, as the view lists the moves).
   const slot=L?.played?.slots[i];
   this.flights.push({node:fly,from:{x:from.x,y:from.y-(C?20:34)},to,start:P.flight.at,end,appear:0,fly:(hit-P.flight.at)/(end-P.flight.at),after:slot??discard(m.author)??undefined,land:slot?slot.w/mw:undefined});this.stats.flights++;count.drops++;
   if(slot){count.played++;this.events.push({at:end,run:()=>{this.landed=Math.max(this.landed,i+1);}});}
   const after=end-hit;
   if(m.void){const stamp=add(this.stamp('ANNULLATA',C));stamp.position.set(to.x,to.y);this.accents.push({node:stamp,at:hit,dur:after,kind:'stamp'});count.stamps++;}
   else{const ring=add(new Graphics().circle(0,0,24).stroke({color:PETROL,width:4}));ring.position.set(to.x,to.y);this.accents.push({node:ring,at:hit,dur:P.flight.at+P.flight.dur-hit+P.target.dur});}
   // 5. Close-up of the target: it grows a little in its seat, under the card that hit it; the chosen object meets its fate.
   const tu=targetOf({me:m.target===this.model.me,person:aim},{w:this.width,h:this.height},(L?.seats??[]).filter(x=>x.id!==m.target).map(x=>x.person)),tn=add(character(m.target,tu.w,tu.h)),t0=aim.h/tu.h;this.fx.setChildIndex(tn,0);
   this.zooms.push({node:tn,rest:{x:aim.x,y:aim.y,s:t0},up:{x:tu.x,y:tu.y,s:1},at:P.target.at,grow:P.target.dur*.3,hold:P.target.at+P.target.dur*.75,end:P.target.at+P.target.dur});count.targetUps++;
   this.stats.closeUps.at(-1)!.target=tu;
   if(m.item){const it=m.item,src=itemAt(it.owner,it.name,true)??to,node=add(this.card(named(it.name),iw,ih)),s=P.target.at,e=P.target.at+P.target.dur;count.objects++;count[it.fate]++;
    if(it.fate==='consumed')this.flights.push({node,from:src,to:{x:from.x,y:from.y},start:s,end:e,mode:'shrink'});
    else if(it.fate==='passed'){this.flights.push({node,from:src,to:itemAt(m.author,it.name,false)??{x:from.x,y:from.y},start:s,end:e,mode:'travel'});this.stats.transfers++;}
    else{node.addChild(new Graphics().moveTo(-iw*.1,-ih*.5).lineTo(iw*.08,-ih*.1).lineTo(-iw*.12,ih*.15).lineTo(iw*.05,ih*.5).stroke({color:INK,width:3}));this.flights.push({node,from:src,to:{x:src.x,y:src.y+(C?12:20)},start:s,end:e,mode:'break'});}}
   // 6. The card's changes.
   change(P.changes.at,P.changes.dur,m.steps);
   this.stats.schedule.push({key:k,move:i,...at,hit:Math.round(hit),tokens:m.tokens.length?P.cost.at:null,closeUp:P.author.at,goesBack:P.back.at,flies:P.flight.at,targetUp:P.target.at,pops:m.steps.length?P.changes.at:null,costPops:m.costSteps.length?Math.round(P.cost.at+P.cost.dur*.3):null});});
  // 3. Draws: cards leave each deck as the counts say; own new cards face up, opponents' as backs, deck objects to the table.
  if(p.draws){const n=T.draws.length,used=new Set<string>();T.draws.forEach((d,i)=>{const src=deck(d.seat);if(!src)return;let dest:Point|null=null,node:Container;
    if(d.to==='table'){dest=itemAt(d.seat,d.name!,false);node=this.card(named(d.name!),iw,ih);count.objects++;}
    else if(d.seat===this.model.me&&d.name){const h=this.hits.find(x=>x.kind==='hand'&&!used.has(x.id)&&this.model.hand.find(c=>c.key===x.key)?.card.name===d.name);if(h){used.add(h.id);dest={x:h.x,y:h.y};}node=this.card(named(d.name),iw,ih);}
    else{const b=place(d.seat)?.backs;dest=b?{x:b.x,y:b.y}:null;node=this.back(C?18:28,C?25:39);}
    add(node);const start=p.draws!.at+i*p.draws!.dur*.4/Math.max(1,n);this.flights.push({node,from:src,to:dest??src,start,end:start+p.draws!.dur*.6,mode:'travel'});count.draws++;});}
  // 4. End of turn: a mark on every seat with end-of-turn lines (who, never what) and, when verified, their changes.
  if(p.endOfTurn){for(const id of T.endOfTurn.seats){const s=seat(id);if(!s)continue;const ring=add(new Graphics().roundRect(-s.w*.6,-s.h*.6,s.w*1.2,s.h*1.2,10).stroke({color:RES_COLOR.TOXICITY,width:4}));ring.position.set(s.x,s.y);this.accents.push({node:ring,at:p.endOfTurn.at,dur:p.endOfTurn.dur});count.endOfTurn++;}
   change(p.endOfTurn.at+p.endOfTurn.dur*.35,p.endOfTurn.dur*.65,T.endOfTurn.steps);}
  // 5. Tail: without verified lines the bars go from the previous to the final value (D5); deaths and forfeits are stamped.
  if(T.bars==='total')change(p.tail.at,p.tail.dur,T.totals);
  this.events.push({at:p.tail.at,run:()=>{this.display=null;}});
  for(const e of T.emphasis){const s=seat(e.seat);if(!s)continue;const stamp=add(this.stamp(e.kind==='died'?'ELIMINATO':'FORFAIT',C));stamp.position.set(s.x,s.y);this.accents.push({node:stamp,at:p.tail.at,dur:p.tail.dur,kind:'stamp'});count.emphasis++;}
  this.events.sort((a,b)=>a.at-b.at);
  this.stats.beats.push({key:k,bars:T.bars,reason:T.reason,drift:T.drift,...count});
  this.stats.sequencePlans.push({key:k,moves:T.moves.length,total:p.total,expected:beats(T),pace:p});
  this.seqStarted=performance.now();this.stats.sequences++;this.draw();
 }
 /** «ANNULLATA», «ELIMINATO»: a wine stamp pressed on a card or a character. */
 private stamp(word:string,compact:boolean){const c=new Container(),label=this.text(c,word,0,0,compact?13:20,undefined,0xffe9e9);label.anchor.set(.5);
  const w=label.width+18,h=label.height+8;c.addChildAt(new Graphics().roundRect(-w/2,-h/2,w,h,4).fill({color:WINE,alpha:.92}).stroke({color:0xffd9d9,width:2.5}),0);c.rotation=-.18;return c;}
 /** The resource a step changes, enlarged over its board for a moment: glyph, bar and «before → after» (C3-4). */
 private pop(s:Step,n:number,at:number,dur:number){const b=this.layout?.seats.find(x=>x.id===s.seat)?.board,p=this.model.view.players[s.seat];if(!b||!p)return false;
  const C=this.height<550,own=s.seat===this.model.me,fs=C?12:17,c=new Container(),g=new Graphics();c.addChild(g);
  const d=s.to-s.from,label=this.text(c,`${s.from} → ${s.to}`,0,0,fs,undefined,d<0?0xffb7bd:0xc9f0b0);label.anchor.set(0,.5);
  const gs=fs*1.3,bw=C?54:84,w=gs+8+label.width+10+bw+12,h=fs*2;label.position.set(-w/2+gs+12,0);
  g.roundRect(-w/2,-h/2,w,h,h*.35).fill({color:0x120c08,alpha:.92}).stroke({color:RES_COLOR[s.resource],width:2});glyph(g,s.resource,-w/2+6+gs/2,0,gs,RES_COLOR[s.resource]);
  const m=meter(s.to,this.start(s.seat,p)[s.resource],s.resource==='HEALTH'),x=w/2-bw-8,th=fs*.6;
  g.rect(x,-th/2,bw,th).fill({color:0x000000,alpha:.5});if(m.fill)g.rect(x,-th/2,bw*m.fill,th).fill(RES_COLOR[s.resource]);if(m.negative)g.rect(x,-th/2,2,th).fill(0xe0707a);
  const row=own?RESOURCES.indexOf(s.resource):-1,y=own?b.y-b.h/2+b.h/RESOURCES.length*(row+.5):b.y-b.h/2-h*(n+.6);
  c.position.set(Math.max(w/2+4,Math.min(this.width-w/2-4,b.x+(own?b.w*.15:0))),Math.max(h/2+2,y-(own?h*n*.2:0)));c.visible=false;this.fx.addChild(c);
  this.accents.push({node:c,at,dur:Math.max(300,dur),kind:'pop'});this.stats.aggregateDeltas++;return true;}
 get sequenceRunning(){return !!this.seqStarted;}
 /** D12: a tap on the table during the sequence moves it to the next card; past the last one it ends. */
 advance(){if(!this.seqStarted||!this.pace)return false;const elapsed=performance.now()-this.seqStarted,next=nextStop(this.pace,elapsed);
  this.stats.advances++;if(next>=this.pace.total){this.finish('input');return true;}this.seqStarted-=next-elapsed;return true;}
 /** Brings a running sequence to the final state (the view is already drawn); the static summary stays. */
 finish(reason:string,redraw=true){if(!this.seqStarted)return;this.stats.sequenceEnds.push({key:this.seqKey,reason,ms:Math.round(performance.now()-this.seqStarted)});this.stopEffects();if(redraw){this.draw();this.onState();}}
 /** «Salta effetti». */
 skip(){this.finish('skip');}
 stopEffects(){if(this.seqStarted)this.stats.sequenceMs.push(performance.now()-this.seqStarted);this.seqStarted=0;this.pace=null;this.plan=null;this.display=null;this.events=[];this.flights=[];this.zooms=[];this.accents=[];this.fx.removeChildren().forEach(c=>c.destroy({children:true}));this.ghost=null;}
 private tick(){const now=performance.now();
   if(this.retired.length)this.retired.splice(0).forEach(c=>c.destroy({children:true}));if(this.retiring.length)[this.retired,this.retiring]=[this.retiring,[]];if(this.measure&&this.tickPrev)this.stats.frames.push(now-this.tickPrev);this.tickPrev=now;
  if(this.aimDirty)this.drawAim();
  // Quiet pulse while arrows are shown; reduced motion keeps them static.
  if(this.arrows.length)this.aimLayer.alpha=this.reduced?1:.88+.12*Math.sin(now/280);
  if(this.inputStart){const start=this.inputStart;this.inputStart=0;requestAnimationFrame(()=>this.stats.inputMs.push(performance.now()-start));}
  if(this.seqStarted&&this.pace){const t=now-this.seqStarted,P=this.pace;if(t>=P.total)this.finish('complete');else{
   // Board steps reached (also several at once after a tap): applied, then one redraw.
   let due=0;while(due<this.events.length&&this.events[due].at<=t)due++;if(due){this.events.splice(0,due).forEach(e=>e.run());this.draw();}
   this.flights.forEach(f=>{const d=f.end-f.start,p=(t-f.start)/d;f.node.visible=p>=0&&p<=1;if(!f.node.visible)return;
    if(f.appear!==undefined){const a=f.appear,fly=f.fly??.72;
     // Move: (appear at the author,) fly, hit the target, stay through its close-up and changes, then slide to the discard and fade.
     if(p<a){const q=p/a;f.node.position.set(f.from.x,f.from.y);f.node.scale.set(.6+.4*(1-Math.pow(1-q,2)));f.node.rotation=-.12;f.node.alpha=Math.min(1,q*2);return;}
     if(p<=fly){const q=Math.min(1,(p-a)/(fly-a)),eased=1-Math.pow(1-q,2);f.node.scale.set(1);f.node.position.set(f.from.x+(f.to.x-f.from.x)*eased,f.from.y+(f.to.y-f.from.y)*eased-Math.sin(q*Math.PI)*35);f.node.rotation=(1-q)*-.12;f.node.alpha=1;return;}
     const q=(p-fly)/(1-fly),hold=Math.max(0,(q-.35)/.65),to=f.after??f.to;f.node.position.set(f.to.x+(to.x-f.to.x)*hold*hold,f.to.y+(to.y-f.to.y)*hold*hold);if(f.land){f.node.scale.set(1+(f.land-1)*hold);f.node.alpha=1;}else{f.node.scale.set(1-.35*hold);f.node.alpha=1-.85*hold;}return;}
    const eased=1-Math.pow(1-p,2);f.node.position.set(f.from.x+(f.to.x-f.from.x)*eased,f.from.y+(f.to.y-f.from.y)*eased);
    if(f.mode==='rise'){f.node.alpha=1-p*p;}
    else if(f.mode==='shrink'){f.node.scale.set(1-.75*p);f.node.alpha=1-.8*p;}
    else if(f.mode==='break'){f.node.rotation=Math.sin(p*Math.PI*6)*.12*(1-p)+p*.5;f.node.alpha=1-p;}
    else f.node.alpha=p>.85?1-(p-.85)/.15*.6:1;});
   this.zooms.forEach(z=>{z.node.visible=t>=z.at&&t<=z.end;if(!z.node.visible)return;
    const q=t<z.at+z.grow?(t-z.at)/z.grow:t<z.hold?1:1-(t-z.hold)/Math.max(1,z.end-z.hold),e=q*q*(3-2*q);
    z.node.position.set(z.rest.x+(z.up.x-z.rest.x)*e,z.rest.y+(z.up.y-z.rest.y)*e);z.node.scale.set(z.rest.s+(z.up.s-z.rest.s)*e);
    if(z.fade)z.fade.alpha=Math.min(1,Math.max(0,q*1.6-.4));});
   this.accents.forEach(x=>{const p=(t-x.at)/x.dur;x.node.visible=p>=0&&p<=1;if(!x.node.visible)return;
    if(x.kind==='stamp'){x.node.scale.set(p<.2?1.8-.8*(p/.2):1);x.node.alpha=p>.8?1-(p-.8)/.2:1;}
    else if(x.kind==='pop'){x.node.scale.set(p<.25?.7+.6*(p/.25):p<.45?1.3-.3*((p-.25)/.2):1);x.node.alpha=p>.85?1-(p-.85)/.15:1;}
    else{x.node.scale.set(1+p*1.2);x.node.alpha=1-p;}});
  }}
 }
 startMeasure(){this.stats.frames=[];this.stats.inputMs=[];this.tickPrev=0;this.measure=true;}
 endMeasure(){this.measure=false;return this.stats;}
 destroy(){this.disposeFns.forEach(fn=>fn());[...this.retired,...this.retiring].forEach(c=>c.destroy({children:true}));this.retired=[];this.retiring=[];this.app.destroy(true,{children:true});}
}

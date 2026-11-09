import {RoundCue,type Sounds} from './sound.ts';
import {AlphaFilter,Application,Assets,BlurFilter,Container,Graphics,Rectangle,Sprite,Text,Texture} from 'pixi.js';
import {PROPS,backgroundGeometry,placeBackground,type PropId} from './background.ts';
import {Model,clone,type Target} from './model.ts';
import {handCardState,guideFocus,guideMotion,GuideRest,hitAt,handSlot,raisedCard,confirmCard,regularCard,type GuideBeat,type GuideFocus,type Posable} from './readability.ts';
import {artIndex,artFrame,loadAtlas} from './art.ts';
import {playerName} from './presence.ts';
import type {Card,CharacterCard,Player,Resource,View} from './contracts.ts';
import {plays,seatMarks,NO_CHANGE,nextStop,timeline,beats,hitCues,BEAT_PHASE,LABEL,PACE,type Pace,type Round,type SeatMark,type Step,type Timeline} from './resolution.ts';
import {drawSymbol,drawMark,type Pen,type SymbolKind} from './symbols.ts';
import {drawFrame,frameOf,FRAME_GREY,type FrameKind} from './frames.ts';
import {RESOURCES,LETTER,RES_COLOR,ROLE_COLOR,ROLES,roleOf,gainsOf,gainText,damageOf,damageText,damageLabel,leftV,impactOf,impactMotion,DAMAGE_SHAPES,DAMAGE_ACCENT_SHAPES,DAMAGE_ACCENT,DAMAGE_COLOR,type DamageType,type ImpactKind,shortfall,meter,chipsOf,tableLayout,stripPlan,briefSpot,briefFont,fan,coveredItems,touchRaises,aimArrows,arrowShape,confirmButtons,previewSpot,closeUp,targetOf,seatBoxes,closeUpRange,nextPile,labelSpot,type AimTarget,type Arrow,type Box,type Chip,type CloseUp,type Role,type StripPlan,type TableLayout} from './readability.ts';
// `hidden` (C3-4s): during a sequence the card or object is in the view but has not arrived on the table yet.
export type Hit={id:string;kind:'hand'|'preview'|'person'|'item'|'status';x:number;y:number;w:number;h:number;angle:number;key?:string;target?:Target;label:string;node:Container;covered?:boolean;hidden?:boolean};
export type Inspection={title:string;card?:Card;owner?:string};
type Drag={id:number;key:string;x:number;y:number;lastX:number;lastY:number;moved:boolean;insertion:number|null;touch:boolean};
// Times in ms from the start of the sequence. A move card flies from its author, hits (`fly`, fraction of the flight) and then
// goes to the author's discard (`after`). Other flights: a cost token rises, an object shrinks into its consumer, breaks,
// or simply travels (passed objects, discards, draws).
type Point={x:number;y:number};
// `land` (C3-L): the move card does not fade on its way to `after` but lands there at this scale, in the cascade of the round's cards.
// C3-4s: `s0`/`s1` scale of a travelling card, `fade` its opacity on arrival (1 when it lands on something drawn, 0 at a pile not drawn); `tag` what it counts as.
type FlownTag='clear'|'discard'|'drawHand'|'drawBack'|'itemOut'|'itemIn';
type Flight={node:Container;from:Point;to:Point;start:number;end:number;appear?:number;fly?:number;after?:Point;land?:number;mode?:'travel'|'rise'|'shrink'|'break'|'vanish'|'pop';s0?:number;s1?:number;fade?:number;tag?:FlownTag;also?:FlownTag;seen?:boolean};
// D13 close-ups: a copy of a character (with the played card for the author) grows from its seat (`rest`) to `up`, stays
// until `hold`, then goes back by `end`; `fade` (the card beside the author) appears with it and leaves before it.
type Zoom={node:Container;rest:{x:number;y:number;s:number};up:{x:number;y:number;s:number};at:number;grow:number;hold:number;end:number;fade?:Container};
// Marks over the table: an impact ring, a stamp (voided, eliminated) and the enlarged resource of a change (pop).
// C3-5: `impact` is the mark of a card on its target (its type of damage or its role, or the cross of a voided move); the character card of the target knocks and darkens for any damage (blow or cut), never with reduced motion.
type Accent={node:Container;at:number;dur:number;kind?:'ring'|'stamp'|'pop'|'impact'|'shock';label?:Label;impact?:ImpactKind|'VOID';y?:number};
type Shake={id:string;at:number;dur:number;amp:number;dark?:{key:string;move:number;seat:string;min:number}};
// C3-4s: a label of a change and the wall-clock span it was readable (popped in, not fading), measured on the frames.
// `end`: the frame that starts the fade, which is when the label stops being shown whole; `last`: the last frame drawn whole before it; `gap`: the longest interval between two frames inside the reading window.
type Label={seat:string;resource:Resource;box:Box;from:number;to:number;first:number;last:number;end:number;gap:number};
/** C3-5: what a drawn face shows, in its own coordinates (centre at the middle of the card): damage pills, cost chips and every text, for the checks. */
type DrawnDamage={type:DamageType;text:string;box:Box};
/** `marks`: the resources whose symbol the face draws on its cost coins and on its gains, in drawing order (C4-3: never a letter on the face; the letters stay in `texts` only where the catalog gives them as text). */
export type FaceInfo={w:number;h:number;frame:FrameKind;damage:DrawnDamage[];costs:Box[];texts:string[];role:boolean;marks:{cost:Resource[];gains:Resource[]}};
const INK=0x30231e, PAPER=0xe8d7b4, PETROL=0x6eafaf, WINE=0x742e33;
// Plain vector marks (symbols.ts, shared with the HTML shell): the shape carries the meaning, the colour only reinforces it (O3, O14).
export function glyph(g:Graphics,kind:SymbolKind,x:number,y:number,s:number,color:number,accent?:number){drawSymbol(g as unknown as Pen,kind,x,y,s,{main:color,accent});return g;}
export type Readout={layout:{hand:{w:number;h:number};person:{w:number;h:number};item:{w:number;h:number}};
 /** C3-L: what the own piles show: cards left in the deck and the card on top of the discard pile. */
 piles:{deck:number;discard:string|null}|null;
 /** C3-L: the round's cards drawn in the middle, bottom first (during a sequence only those already landed). */
 played:{name:string;author:string;void:boolean}[]|null;items:{name:string;frame:FrameKind}[];hand:{key:string;name:string;role:Role|null;gains:string[];payable:boolean;alpha:number;inPreview:boolean;face:FaceInfo|null}[];board:{values:Partial<Record<Resource,number>>;reference:Partial<Record<Resource,number>>;rows:string[]}|null;
 summary:{key:string;seats:Record<string,{texts:string[];box:Box|null;fs:number|null;drawn:boolean}>}|null;
 /** C3-4: resource values each board shows (the view, or the step reached during a sequence). */
 boards:Record<string,Partial<Record<Resource,number>>>};
// Stable seats: the viewer at the bottom, opponents in join order. Five-seat layout kept for C2 FFA.
const SEATS={me:[.18,.77],duel:[[.46,.24]],ffa:[[.26,.24],[.72,.24],[.16,.49],[.81,.49]]} as const;
/** A card known only by its published name (an opponent's card): a plain face. */
const plain=(name:string):Card=>({name,bindingName:'',effect:'',item:false,basicAction:false,lastResort:false,characterBound:false,boundToCharacter:null,priority:0,canTarget:[],cost:{},image:null,sprite:null});
export const subtype=(c:Card)=>frameOf(c)==='neutral'?'CARTA':frameOf(c)==='token'?'OGGETTO TOKEN':c.item?'OGGETTO':c.basicAction?'AZIONE BASE':c.characterBound?'AZIONE LEGATA':c.lastResort?'ULTIMA RISORSA':'AZIONE REGOLARE';
export const roleLabel=(c:Card)=>{const r=roleOf(c);return r?ROLES[r].label:'';};
export const cost=(c:Card)=>Object.entries(c.cost).map(([k,v])=>`${v} ${{VIOLENCE:'V',ALERTNESS:'A',TOXICITY:'T',ALCOHOL:'L',HEALTH:'H'}[k]}`).join(' + ')||'—';
export class TableScene {
 app=new Application();world=new Container();fx=new Container();aimLayer=new Container();private aimG=new Graphics();private aimAlpha=new AlphaFilter({alpha:.82});
 // C3-3 (O6): arrows from the chosen or dragged card to the admitted targets; redrawn at most once per frame while dragging.
 arrows:Arrow[]=[];confirmArrow:Arrow|null=null;private confirmTo:Box|null=null;private aimDirty=false;
hits:Hit[]=[];backs:Record<string,number>={};faces=new WeakMap<Container,FaceInfo>();
 drag:Drag|null=null;focused:string|null=null;hovered:string|null=null;
 // K7: a covered object raised by a first touch (touch has no hover); the next touch acts on it.
 peek:string|null=null;
 width=0;height=0;art:Texture[]=[];background!:Sprite;private decor=new Container();private props={} as Record<PropId,Sprite>;private shadows={} as Record<PropId,{node:Graphics;blur:BlurFilter}>;pendingGhost:Container|null=null;
 reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;blocked=false;contextLost=false;
 onLayout=()=>{};onInspect=(_v:Inspection)=>{};onState=()=>{};onError=(_v:string)=>{};onHover=(_id:string|null)=>{};
 preview={x:0,y:0};private dropPoint:{x:number;y:number}|null=null;private placed:{key:string;spot:{x:number;y:number}}|null=null;private resizeTimer=0;stats={resizes:0,cancels:[] as string[],inputMs:[] as number[],frames:[] as number[],sequences:0,sequenceMs:[] as number[],flights:0,transfers:0,aggregateDeltas:0,
  // C3-2: every sequence with its key, how it ended and how long it ran; static summaries drawn per round.
  sequenceEnds:[] as {key:string;reason:string;ms:number}[],summaries:0,
  // C3-2 revision (D12): planned length of each sequence and taps that moved it to the next card.
  sequencePlans:[] as {key:string;moves:number;total:number;expected?:ReturnType<typeof beats>;pace?:Pace;cue?:{at:number;kind:string}|null;cues?:ReturnType<typeof hitCues>;started?:number}[],advances:0,
  // C3-4: what each sequence animated (counted on the nodes built), the bar mode and, for the totals, why.
  beats:[] as {key:string;bars:'per-card'|'total';reason:string|null;drift:number;played:number;drops:number;stamps:number;tokens:number;objects:number;consumed:number;passed:number;broken:number;discards:number;draws:number;endOfTurn:number;emphasis:number;steps:number;pops:number;closeUps:number;targetUps:number}[],
  // C3-4 revision (D13): when each beat of each card starts as the scene scheduled it, and where each close-up went.
  schedule:[] as {key:string;move:number;cost:number;author:number;back:number;flight:number;target:number;changes:number;hit:number;tokens:number|null;closeUp:number;goesBack:number;flies:number;targetUp:number;pops:number|null;costPops:number|null}[],
  closeUps:[] as {key:string;move:number;author:string;box:Box;person:Box;card:Box;scale:number;placed:string;targetId:string;target:Box|null;others:Box[]}[],
  // C3-4s: flights built and flights actually seen per sequence, objects on the table at its start and end, and how long each label stayed readable.
  flown:[] as {key:string;built:Record<FlownTag,number>;seen:Record<FlownTag,number>;toPile:number;toHand:number;itemsStart:Record<string,string[]>;itemsEnd:Record<string,string[]>|null;advanced:boolean}[],
  labels:[] as {key:string;seat:string;resource:Resource;box:Box;from:number;to:number;readable:number;gap:number}[],
  // C3-5: what each card made on its target, as the scene built it (the kinds of the mark, the knock, a voided move's cross) and the closing emphasis.
  impacts:[] as {key:string;move:number;card:string;void:boolean;kinds:string[];shake:number;wave:number}[],
  // The darkest grey (255 = none) the target's character card reached for each card that knocked it, read back from the frames drawn.
  darks:[] as {key:string;move:number;seat:string;min:number}[],emphasis:[] as {key:string;kind:string;seat?:string;text?:string}[],
  // C3-3: redraws of the aim arrows and the time each took (ms), kept for the last 600.
  aimDraws:0,aimMs:[] as number[]};
 private disposeFns:(()=>void)[]=[];private seqStarted=0;private seqSeen='';private seqKey='';private lastRound:Round|null=null;
 // Static round summary (rule 5, D6): drawn on the table until the first card choice or the next round.
 marks:Record<string,SeatMark[]>|null=null;marksKey='';private tickPrev=0;private inputStart=0;
 private measure=false;private ghost:Container|null=null;private ghostH=0;ghostOver=false;private fittedTitles=new Map<string,string>();private retiring:Container[]=[];private retired:Container[]=[];private visualSnapshot:View;
 private advancesAtStart=0;private flights:Flight[]=[];private zooms:Zoom[]=[];private accents:Accent[]=[];private shakes:Shake[]=[];private pace:Pace|null=null;
 // C3-4: values the boards show while a sequence runs (previous view, then each step), and the steps still to apply.
 // Decisions always use the final view (rule 2): only the drawing of resources reads `display`.
 display:Record<string,Partial<Record<Resource,number>>>|null=null;private events:{at:number;run:()=>void}[]=[];private plan:Timeline|null=null;
 layout:TableLayout|null=null;
 /** C3-6: where the shell puts the short summary line, clear of everything on the table; null when there is no room. */
 brief:{box:Box;lines:number;font:number}|null=null;private briefFor='';
readout:Readout={layout:{hand:{w:0,h:0},person:{w:0,h:0},item:{w:0,h:0}},piles:null,played:null,items:[],hand:[],board:null,summary:null,boards:{}};
 // C3-L: round's cards already landed in the middle during a sequence.
 private landed=0;
 // C3-4s: what the table shows during a sequence, until each flight lands; at its end, and for decisions at any time, the view (rule 2).
 private staged:{items:Record<string,Card[]>;slots:TableLayout;backs:Record<string,number>;deck:number;discard:string|null}|null=null;private arriving=new Set<string>();private labels:Label[]=[];
 // C3-L: top of the own discard pile, kept per game and refreshed by each resolved round of the view.
 private pile={game:'',turn:-1,top:null as string|null,middle:null as string|null,before:null as string|null};private starts=new Map<string,Partial<Record<Resource,number>>>();
 // Status chips on the table, for the summary the shell shows on hover, tap or focus.
 chips:Record<string,Chip&{x:number;y:number}>={};openStatus:string|null=null;
 constructor(readonly model:Model,private readonly catalog:()=>Card[]=()=>[],private readonly characters:()=>CharacterCard[]=()=>[],private readonly sounds?:Sounds){this.visualSnapshot=clone(model.view);}
 async init(host:HTMLElement){
  await this.app.init({width:host.clientWidth,height:host.clientHeight,backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio,2),autoDensity:true,preference:'webgl'});
  // Native Pointer Events below own all input; avoid a second global Pixi gesture system.
  // Pixi documents null for detaching; its 8.22 declaration omits the nullable type.
  this.app.renderer.events.setTargetElement(null!);
  host.appendChild(this.app.canvas);this.app.canvas.setAttribute('aria-hidden','true');
  const [table,atlas,layout,props]=await Promise.all([Assets.load('/art/table.webp'),Assets.load('/art/atlas.webp'),loadAtlas(),Promise.all(PROPS.map(p=>Assets.load<Texture>(`/art/${p.id}.webp`)))]);
  for(let i=0;i<layout.cols*layout.rows;i++){const f=artFrame(i,layout);this.art.push(new Texture({source:atlas.source,frame:new Rectangle(f.x,f.y,f.size,f.size)}));}
  this.background=new Sprite(table);this.background.eventMode='none';this.decor.eventMode='none';this.decor.interactiveChildren=false;
  // All soft ellipses before all props, behind every gameplay node. O24 has no interaction here.
  PROPS.forEach(p=>{const node=new Graphics(),blur=new BlurFilter({strength:3,quality:4,resolution:1});node.eventMode='none';node.filters=[blur];this.shadows[p.id]={node,blur};this.decor.addChild(node);});
  PROPS.forEach((p,i)=>{const sprite=new Sprite(props[i]);sprite.anchor.set(.5);sprite.eventMode='none';this.props[p.id]=sprite;this.decor.addChild(sprite);});
  this.app.stage.addChild(this.background,this.decor,this.world,this.aimLayer,this.fx);this.fx.eventMode='none';this.aimLayer.eventMode='none';this.aimLayer.addChild(this.aimG);
  const canvas=this.app.canvas;
  const bind=(target:EventTarget,event:string,fn:EventListener)=>{target.addEventListener(event,fn);this.disposeFns.push(()=>target.removeEventListener(event,fn));};
  bind(host.parentElement!,'pointerup',((e:PointerEvent)=>{if((e.target as HTMLElement)?.closest('button'))this.inputStart=performance.now();}) as EventListener);
  bind(host.parentElement!,'keydown',((e:KeyboardEvent)=>{if(['Enter',' ','i','I','ArrowLeft','ArrowRight'].includes(e.key))this.inputStart=performance.now();}) as EventListener);
  bind(canvas,'pointerdown',((e:PointerEvent)=>this.down(e)) as EventListener);
  bind(canvas,'pointermove',((e:PointerEvent)=>this.move(e)) as EventListener);
  bind(canvas,'pointerup',((e:PointerEvent)=>this.up(e)) as EventListener);
  bind(canvas,'pointercancel',(()=>this.interrupt('pointercancel')) as EventListener);
  // C4-10 O30: a tap is handled on pointerup; the click the browser synthesizes after touchend would land on what that tap
  // just drew under the finger (✓ and × over the chosen discard) and cancel it. The canvas never needs that click.
  bind(canvas,'touchend',((e:TouchEvent)=>{if(e.cancelable)e.preventDefault();}) as EventListener);
  // Moving onto the (i) button keeps the card raised so the button stays under the pointer.
  bind(canvas,'pointerleave',((e:PointerEvent)=>{if(!this.drag&&!(e.relatedTarget as HTMLElement|null)?.closest?.('.info'))this.setHover(null);}) as EventListener);
  bind(canvas,'lostpointercapture',(()=>{if(this.drag)this.interrupt('lost capture');}) as EventListener);
  bind(canvas,'webglcontextlost',((e:Event)=>{e.preventDefault();this.contextLost=true;this.interrupt('context lost');this.onError('Affaccio sul tavolo interrotto. Attendo il ripristino grafico.');}) as EventListener);
  bind(canvas,'webglcontextrestored',(()=>{this.contextLost=false;this.onError('');this.draw();}) as EventListener);
  // C4-2: a new size is applied once the size has settled and only if it changed: fitScale costs up to 150 ms per new measure, and a browser bar sliding in gives many.
  const settle=()=>{clearTimeout(this.resizeTimer);this.resizeTimer=window.setTimeout(()=>{if(host.clientWidth!==this.width||host.clientHeight!==this.height){this.stats.resizes++;this.resize(host.clientWidth,host.clientHeight);}},120);};
  bind(window,'resize',(()=>{this.interrupt('resize');settle();}) as EventListener);
  if(window.visualViewport)bind(window.visualViewport,'resize',(()=>{this.interrupt('visual viewport / zoom');settle();}) as EventListener);
  bind(window,'blur',(()=>this.interrupt('window blur',true,false)) as EventListener);
  bind(document,'visibilitychange',(()=>{if(document.hidden){this.interrupt('background');this.app.stop();}else{this.tickPrev=0;this.app.start();}}) as EventListener);
  const media=matchMedia('(prefers-reduced-motion: reduce)');bind(media,'change',((e:MediaQueryListEvent)=>{this.reduced=e.matches;this.interrupt('reduced motion');}) as EventListener);
  // C3-2 (K1): a view of the same turn only cancels a drag (C0-R4); the sequence goes on. A new round, a reset or a
  // drop end it. A round without a difference (jump, other connection) gets no sequence and no summary (K2, rule 3).
  this.disposeFns.push(this.model.subscribe(why=>{const previous=this.visualSnapshot,round=this.model.round,fresh=round!==this.lastRound;
   if(why==='view'||why==='reset'||why==='disconnect'){this.interrupt(why,false,why!=='view'||fresh);this.visualSnapshot=clone(this.model.view);}
   // C3-4s: a press on a hand card marks it as focused without the DOM focus; left there, a basic or bound just played would stay raised in the next rounds, over its neighbours and their (i). Keyboard focus stays.
   if(fresh&&this.focused&&document.activeElement?.getAttribute('data-hit')!==this.focused)this.focused=null;
   if(fresh){this.lastRound=round;this.marks=seatMarks(round);this.marksKey=round?.facts.key??'';if(this.marks)this.stats.summaries++;}
   // D6: the first card choice dismisses the summary of the round.
   if(why==='choice'&&this.model.selected&&this.marks)this.marks=null;
   this.draw();if(fresh&&why==='view')this.beginSequence(previous);}));
  this.app.ticker.add(()=>this.tick());this.resize(host.clientWidth,host.clientHeight);
 }
 private text(parent:Container,value:string,x:number,y:number,size:number,width?:number,color=INK){const t=new Text({text:value,style:{fontFamily:'Impact, Arial, sans-serif',fontSize:size,fill:color,wordWrap:!!width,wordWrapWidth:width,align:'center',lineHeight:size*1.05}});t.anchor.set(.5,0);t.position.set(x,y);parent.addChild(t);return t;}
 private frame(w:number,h:number,kind:FrameKind='regular'){const c=new Container();c.addChild(new Graphics().roundRect(-w/2+4,-h/2+6,w,h,5).fill({color:0x160e09,alpha:.6}));
  const paper=new Graphics().roundRect(-w/2,-h/2,w,h,5).fill(PAPER).stroke({color:INK,width:2});drawFrame(paper as unknown as Pen,kind,w,h);c.addChild(paper);
  const flecks=new Graphics();for(let i=0;i<12;i++)flecks.circle(-w/2+5+(i*23%(w-10)),-h/2+4+(i%2? h-8:0),1+i%2).fill({color:0x795034,alpha:.25});c.addChild(flecks);return c;}
 private face(name:string,art:number,w:number,h:number,footer:string,small=false,sub='',kind:FrameKind='regular'){const c=this.frame(w,h,kind);const titleH=small?h*.27:h*.24, footH=small?h*.17:h*.18;
  // The written type ends where the art begins, however large the card: at 1366x768 it used to fall half on the art.
  const subSize=Math.max(7,w*.056),subH=Math.max(10,subSize*1.25);
  const sprite=new Sprite(this.art[art]);sprite.position.set(-w/2+6,-h/2+titleH);sprite.width=w-12;sprite.height=h-titleH-footH-4;c.addChild(sprite);
  const title=this.text(c,name,0,-h/2+6,small?Math.max(9,w*.105):Math.max(12,w*.11),w-12);
  const maxTitle=titleH-(small?8:subH+5);
  // Each shortening step re-measures the wrapped title: fit once per size, not on every redraw.
  const fitKey=`${name}|${title.style.fontSize}|${w}|${maxTitle}`,fitted=this.fittedTitles.get(fitKey);
  // A smaller type (down to 75%) comes before the ellipsis, so long names stay whole on readable cards.
  if(fitted!==undefined){const [size,text]=fitted.split('|');title.style.fontSize=Number(size);title.style.lineHeight=Number(size)*1.05;title.text=text;}
  else{const base=Number(title.style.fontSize);for(let s=base;title.height>maxTitle&&s>base*.75;s-=1){title.style.fontSize=s;title.style.lineHeight=s*1.05;}
   let len=name.length;while(title.height>maxTitle&&len>5){len--;title.text=name.slice(0,len)+'…';}this.fittedTitles.set(fitKey,`${title.style.fontSize}|${title.text}`);}
  if(sub&&!small)this.text(c,sub,0,-h/2+titleH-subH,subSize,w-12);
  this.text(c,footer,0,h/2-footH+3,small?Math.max(7,w*.085):Math.max(12,w*.10),w-10);return c;}
 // C2a card face: role stamp under the title, self gains on the art, cost coins and priority in the footer.
 // Everything sits on the left, which stays visible where the fan overlaps. short = unpaid cost resources.
 private card(c:Card,w:number,h:number,small=false,short:Resource[]=[],left:number|null=null){const costBoxes:Box[]=[],drawnDamage:DrawnDamage[]=[],costMarks:Resource[]=[],gainMarks:Resource[]=[];const kind=frameOf(c),f=this.face(c.name,artIndex(c.bindingName),w,h,kind==='token'?'TOKEN':c.item?'OGGETTO':'',small,subtype(c),kind);
  const titleH=small?h*.27:h*.24,footH=small?h*.17:h*.18,role=roleOf(c),g=new Graphics();f.addChild(g);
  // The small card of the round shows the symbol of its damage at the bottom right: a role circle beside it would repeat it (owner trial, C3-7).
  const roleDrawn=!!role&&!(small&&damageOf(c).length);
  if(role&&roleDrawn){if(small){const d=Math.max(13,w*.22),cx=-w/2+6+d/2,cy=-h/2+titleH+d/2+2;g.circle(cx,cy,d/2).fill(ROLE_COLOR[role]).stroke({color:INK,width:1});glyph(g,role,cx,cy,d*.62,PAPER);}
   else{const th=Math.max(14,h*.082),fs=th*.66,label=this.text(f,ROLES[role].label,0,0,fs,undefined,0xfff6e2);label.anchor.set(0,.5);const tw=th+label.width+8,tx=-w/2+6,ty=-h/2+titleH+2+th/2;
    this.roleTab(g,ROLE_COLOR[role],tx,ty,tw,th,w);glyph(g,role,tx+th*.55,ty,th*.62,PAPER);label.position.set(tx+th,ty);f.addChild(label);}}
  // No role, or one this client does not know (Set Base): the same tab, hollow and without a word.
  if(!role&&!small){const th=Math.max(14,h*.082);this.roleTab(g,null,-w/2+6,-h/2+titleH+2+th/2,th*1.3,th,w);}
  const gains=gainsOf(c);if(gains.length){const fs=small?Math.max(8,w*.12):Math.max(10,w*.075),ch=fs*1.45;let gx=-w/2+7;const gy=h/2-footH-5-ch/2;
   for(const gain of gains){const label=this.text(f,`+${gain.amount??'x'}`,0,0,fs,undefined,INK);label.anchor.set(0,.5);const gd=ch*.78,cw=label.width+gd+9;if(gx+cw>w/2-4){label.destroy();break;}
    g.roundRect(gx,gy-ch/2,cw,ch,ch*.3).fill(0xf6efd9).stroke({color:RES_COLOR[gain.resource],width:1.5});label.position.set(gx+4,gy);f.addChild(label);glyph(g,gain.resource,gx+4+label.width+2+gd/2,gy,gd,RES_COLOR[gain.resource]);gainMarks.push(gain.resource);gx+=cw+3;}}
  if(!c.item){const fs=small?Math.max(7,w*.085,Math.min(10,w*.11)):Math.max(11,w*.088),fy=h/2-footH/2-1,ch=fs*1.4;let cx=-w/2+8;
   const costs=Object.entries(c.cost) as [Resource,number][];
   if(!costs.length){const dash=this.text(f,'—',cx+4,fy,fs,undefined,INK);dash.anchor.set(0,.5);}
   for(const [k,v] of costs){const unpaid=short.includes(k),label=this.text(f,`${unpaid?'! ':''}${v}`,0,0,fs,undefined,0xfff6e2);label.anchor.set(0,.5);const dd=ch*.8,cw=label.width+dd+10,dx=cx+5+label.width+2+dd/2;
    costBoxes.push({x:cx+cw/2,y:fy,w:cw,h:ch});g.roundRect(cx,fy-ch/2,cw,ch,ch*.45).fill(unpaid?WINE:INK);label.position.set(cx+5,fy);f.addChild(label);
    g.circle(dx,fy,dd/2).fill(0xf6efd9);glyph(g,k,dx,fy,dd*.78,RES_COLOR[k]);costMarks.push(k);
    if(unpaid)g.moveTo(cx+3,fy+ch*.3).lineTo(cx+cw-3,fy-ch*.3).stroke({color:0xffd9d9,width:1.5});cx+=cw+3;}
   if(small)this.damageMarks(f,c,w,h,footH,drawnDamage);else this.damageBadges(f,c,w,fy,fs,cx,left,drawnDamage);}
  this.faces.set(f,{w,h,frame:kind,role:roleDrawn,damage:drawnDamage,costs:costBoxes,texts:f.children.filter((x):x is Text=>x instanceof Text).map(x=>x.text),marks:{cost:costMarks,gains:gainMarks}});
  return f;}
 /** C4-4: the mark of the role comes out of the fillet, from the left edge of the card to the end of its word. */
 private roleTab(g:Graphics,color:number|null,tx:number,ty:number,tw:number,th:number,w:number){const t=ty-th/2,b=ty+th/2,l=-w/2+2.5,r=tx+tw;g.poly([l,t,r-th*.2,t,r,t+th*.2,r,b-th*.2,r-th*.2,b,l,b]);if(color!==null)g.fill(color);g.stroke({color:color===null?FRAME_GREY:INK,width:1});}
 // C3-5 (owner's decision of 30 October 2026): the face shows the type and the nominal amount of the damage, as symbols, where the priority used to be
 // (the priority stays in the inspection). One pill per type of `damage`, right-aligned in the footer; the type alone when the server gives no amount.
 // The amount is the catalog's nominal one: states and defenses can change the real damage (D1).
 private damageBadges(f:Container,c:Card,w:number,fy:number,fs:number,from:number,left:number|null,drawn:DrawnDamage[]){const entries=damageOf(c);if(!entries.length)return;
  const ch=fs*1.4,gap=3,room=w/2-4-from,g=new Graphics();let k=1;f.addChild(g);
  const build=(k:number)=>entries.map(e=>{const t=damageText(e,left),label=t?this.text(f,t,0,0,fs*k,undefined,INK):null;label?.anchor.set(0,.5);return {e,label,w:ch*k*.9+(label?label.width+4:0)+4};});
  let items=build(1);if(items.reduce((n,x)=>n+x.w+gap,-gap)>room){items.forEach(x=>x.label?.destroy());k=Math.max(.7,room/items.reduce((n,x)=>n+x.w+gap,-gap));items=build(k);}
  let x=w/2-6;
  for(const it of items.reverse()){const bw=it.w,bh=ch*k,x0=x-bw;g.roundRect(x0,fy-bh/2,bw,bh,bh*.3).fill(0xf6efd9).stroke({color:DAMAGE_COLOR[it.e.type],width:1.5});
   glyph(g,it.e.type,x0+bh*.48+2,fy,bh*.7,DAMAGE_COLOR[it.e.type],DAMAGE_ACCENT[it.e.type]);if(it.label)it.label.position.set(x0+bh*.9+4,fy);
   drawn.push({type:it.e.type,text:it.label?.text??'',box:{x:x0+bw/2,y:fy,w:bw,h:bh}});x=x0-gap;}}
 // A card too small for a pill (the round's cards in the middle, 36–40 px): the symbol of each type alone, at the bottom right of the art.
 private damageMarks(f:Container,c:Card,w:number,h:number,footH:number,drawn:DrawnDamage[]){const entries=damageOf(c);if(!entries.length||w<28)return;const d=Math.max(9,w*.26),g=new Graphics();f.addChild(g);
  entries.forEach((e,i)=>{const cx=w/2-6-d/2-i*(d+2),cy=h/2-footH-d/2-3;g.circle(cx,cy,d*.62).fill(0xf6efd9).stroke({color:DAMAGE_COLOR[e.type],width:1});glyph(g,e.type,cx,cy,d,DAMAGE_COLOR[e.type],DAMAGE_ACCENT[e.type]);drawn.push({type:e.type,text:'',box:{x:cx,y:cy,w:d*1.24,h:d*1.24}});});}
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
   else if(chip.kind==='immunity'&&chip.resource){const d=Math.min(ch*.92,cw*.62);g.circle(0,0,d/2).fill(0xf6efd9);glyph(g,chip.resource,0,0,d*.68,RES_COLOR[chip.resource]);g.moveTo(-d*.4,d*.4).lineTo(d*.4,-d*.4).stroke({color:WINE,width:Math.max(1.5,d*.13)});}
   else g.circle(gx,0,s/2).stroke({color:PAPER,width:1.5}).moveTo(gx,0).lineTo(gx,-s*.32).moveTo(gx,0).lineTo(gx+s*.25,0).stroke({color:PAPER,width:1.3});
   if(chip.kind!=='immunity'){const tx=this.text(c,chip.short,0,0,fs,undefined,0xfff6e2);tx.anchor.set(0,.5);tx.position.set(gx+s*.6,0);}
   if(this.openStatus===chip.id||this.hovered===chip.id||this.focused===chip.id)g.roundRect(-cw/2-2,-ch/2-2,cw+4,ch+4,ch*.4).stroke({color:0xf1e4c4,width:2});
   this.world.addChild(c);this.chips[chip.id]={...chip,x,y:y-ch/2};
   // Same owner as the character: with a card chosen, a tap here aims at that character.
   this.hits.push({id:chip.id,kind:'status',x,y,w:cw,h:ch,angle:0,target:{owner:id},label:`${chip.title}. ${chip.text}`,node:c});});}
 // C3-2, C3-6: the round's overall change of a seat, as the model gives it; nothing computed here. One cell per entry: the symbol of the
 // resource (the one of the boards) or of the objects, and the signed number, in the type size and cells of the plan (readability.ts).
 private seatSummary(plan:StripPlan,marks:SeatMark[]){const {box:b,size}=plan,c=new Container(),g=new Graphics(),row=new Container();c.addChild(g,row);c.position.set(b.x-b.w/2,b.y-b.h/2);
  g.roundRect(0,0,b.w,b.h,Math.min(b.h*.3,10)).fill({color:0x120c08,alpha:.9}).stroke({color:0xd9b98a,width:1.2});
  marks.forEach((m,i)=>{const cell=size.cells[i],y=cell.y+size.fs*.72,color=m.delta<0?0xffb7bd:0xc9f0b0;
   if(m.key!=='NONE')glyph(g,m.key==='ITEMS'?'ITEMS':m.key,cell.x+size.glyph/2,y,size.glyph,m.key==='ITEMS'?PAPER:RES_COLOR[m.key]);
   const tx=this.text(row,m.text,0,0,size.fs,undefined,m.key==='NONE'?0xcbbca2:color);tx.anchor.set(0,.5);tx.position.set(cell.x+(m.key==='NONE'?0:size.glyph+size.fs*.25),y);});
  this.world.addChild(c);return marks.map(m=>m.text);}
 // C3-L: own deck (backs, with the count of the view) and discard pile (the last card that went there, R02), small, beside the own character.
 private piles(L:TableLayout,compact:boolean):Readout['piles']{const P=L.piles,v=this.model.view,me=this.model.me,p=v.players[me];if(!P||!p)return null;
  const cards=[...this.catalog(),...this.model.hand.map(c=>c.card)];
  if(this.pile.game!==v.gameId)this.pile={game:v.gameId,turn:-1,top:null,middle:null,before:null};
  if(this.pile.turn!==v.turn){const n=nextPile(this.pile,v.resolvedMoves,me,cards);this.pile={...this.pile,...n,before:this.pile.top,turn:v.turn};}
  const empty=(b:Box)=>this.world.addChild(new Graphics().roundRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h,4).fill({color:0x1d140f,alpha:.35}).stroke({color:0xb18c60,width:1.5,alpha:.8}));
  const d=P.deck,count=this.staged?.deck??p.deck;
  if(count>0){for(let i=Math.min(3,count)-1;i>=0;i--){const bk=this.back(d.w,d.h);bk.position.set(d.x-i*1.5,d.y-i*1.5);this.world.addChild(bk);}
   const r=compact?8:11,badge=new Container();badge.addChild(new Graphics().circle(0,0,r).fill(INK).stroke({color:PAPER,width:1.5}));badge.position.set(d.x+d.w/2-r*.4,d.y-d.h/2+r*.4);
   const t=this.text(badge,String(count),0,0,compact?9:12,undefined,0xfff6e2);t.anchor.set(.5);this.world.addChild(badge);}
  else empty(d);
  // The discard pile is too small for a readable face: frame and art of the top card, its name in «Ultimo turno» and the inspection.
  const s=P.discard,name=this.staged?this.staged.discard:this.pile.top;
  if(name){const c=cards.find(x=>x.name===name)??plain(name),f=this.frame(s.w,s.h,frameOf(c)),art=new Sprite(this.art[artIndex(c.bindingName)]);art.position.set(-s.w/2+3,-s.w/2+3);art.width=art.height=s.w-6;f.addChild(art);f.position.set(s.x,s.y);f.rotation=.05;this.world.addChild(f);}
  else empty(s);
  return {deck:count,discard:name};}
 // C3-L: the cards of the last resolved round in the middle, in resolution order (the first at the bottom), each with its author;
 // voided ones with a wine tag and a line across their visible strip. During a sequence only the cards already landed (rule 2: then the view).
 private roundCards(L:TableLayout,compact:boolean):Readout['played']{const P=L.played,v=this.model.view;if(!P)return null;
  const known=[...this.catalog(),...this.model.hand.map(c=>c.card),...Object.values(v.players).flatMap(p=>p.character.items)];
  const moves=v.resolvedMoves.slice(0,P.slots.length),shown=this.seqStarted?Math.min(this.landed,moves.length):moves.length,strip=P.slots.length>1?P.slots[1].y-P.slots[0].y:P.slots[0].h*.2;
  return moves.slice(0,shown).map((m,i)=>{const b=P.slots[i],f=this.card(known.find(x=>x.name===m.playedCardName)??plain(m.playedCardName),b.w,b.h,true);f.position.set(b.x,b.y);f.rotation=i%2?.025:-.025;this.world.addChild(f);
   // Author in the column beside the cascade, level with the title strip; a voided move has a wine tag and a line across its strip.
   // A voided move has the cross of symbols.ts after the name (never the ✕ of a font: Impact and Arial lack it).
   const t=P.tags[i],tag=new Container(),x=m.void?t.h*.55:0,who=this.text(tag,m.playerId===this.model.me?'TU':this.name(m.playerId).toUpperCase(),0,0,t.h*.62,undefined,0xfff6e2);who.anchor.set(.5);
   if(who.width>t.w-6-x)who.scale.set((t.w-6-x)/who.width);who.position.x=-x/2;tag.addChildAt(new Graphics().roundRect(-t.w/2,-t.h/2,t.w,t.h,t.h*.35).fill({color:m.void?WINE:INK,alpha:.92}).stroke({color:PAPER,width:1}),0);if(m.void){const cg=new Graphics();drawMark(cg as unknown as Pen,'cross',who.x+who.width/2+t.h*.4,0,t.h*.5,0xfff6e2);tag.addChild(cg);}tag.position.set(t.x,t.y);this.world.addChild(tag);
   if(m.void){const y=b.y-b.h/2+strip*.5;this.world.addChild(new Graphics().moveTo(b.x-b.w/2+3,y+strip*.25).lineTo(b.x+b.w/2-3,y-strip*.25).stroke({color:WINE,width:compact?2:3}));}
   return {name:m.playedCardName,author:m.playerId,void:!!m.void};});}
 private back(w:number,h:number){const c=this.frame(w,h,'back');c.addChild(new Graphics().roundRect(-w/2+4,-h/2+4,w-8,h-8,2).fill(WINE).stroke({color:0xa47763,width:1}));
  const g=new Graphics().circle(0,0,w*.2).fill(0xcab184).stroke({color:INK,width:1});g.moveTo(-w*.27,-h*.25).lineTo(w*.27,h*.25).moveTo(w*.27,-h*.25).lineTo(-w*.27,h*.25).stroke({color:0xcab184,width:2});c.addChild(g);return c;}
 private halo(c:Container,w:number,h:number,color=PETROL){c.addChild(new Graphics().roundRect(-w/2-3,-h/2-3,w+6,h+6,6).stroke({color,width:3}));}
 // K4/D9: "Computer 1–4" in join order when several computers sit at the table.
 private name(id:string){return playerName(id,Object.keys(this.model.view.players));}
 resize(w:number,h:number){this.width=w;this.height=h;this.app.renderer.resize(w,h);// Use texture.orig, never Sprite.width/height (already scaled by the preceding resize).
  const size=(s:Sprite)=>({w:s.texture.orig.width,h:s.texture.orig.height});
  const g=backgroundGeometry(w,h,{table:size(this.background),sottobicchiere:size(this.props.sottobicchiere),negroni:size(this.props.negroni),posacenere:size(this.props.posacenere)});
  placeBackground(this.background,this.props,g);
  for(const p of g.props){const {node,blur}=this.shadows[p.id],s=p.shadow;node.clear().ellipse(0,0,s.w/2,s.h/2).fill({color:0x100905,alpha:s.alpha});node.position.set(s.x,s.y);blur.strength=s.sigma;}
  this.draw();}
 draw(){if(!this.art.length)return;
  // Old nodes survive one render, so Pixi's ref-counted text textures are reused instead of re-rasterized on every tap.
  this.retiring.push(...this.world.removeChildren());this.hits=[];this.backs={};this.chips={};this.pendingGhost=null;
  const w=this.width,h=this.height,view=this.model.view,me=this.model.me,ids=Object.keys(view.players);
  const L=tableLayout(w,h,ids,me,Object.fromEntries(ids.map(id=>[id,view.players[id].character.items.length])));this.layout=L;const compact=L.compact,H=L.hand;
  const hover=this.drag?null:this.hovered,raised:Container[]=[];let board:Readout['board']=null,roundSummary:Readout['summary']=null;
  // C3-6: the strips of the round's summary are placed first, for all seats, clear of everything the layout holds.
  // The short summary line (toast of table.tsx) takes the place the strips leave; kept for the round and the size, so it does not move when the strips go.
  const strips0=this.marks&&!this.seqStarted?stripPlan(L,w,h,Object.fromEntries(L.seats.map(x=>[x.id,(this.marks![x.id]?.length?this.marks![x.id]:NO_CHANGE).map(m=>m.text)]))):null,strips=strips0;
  const briefKey=`${this.model.round?.facts.key??''}|${w}x${h}`;
  if(this.briefFor!==briefKey){this.briefFor=briefKey;const spot=briefSpot(L,w,h,Object.values(strips0??{}).flatMap(p=>p?[p.box]:[]));this.brief=spot?{...spot,font:briefFont(compact)}:null;}
  const drawnItems:{name:string;frame:FrameKind}[]=[];
  for(const seat of L.seats){const id=seat.id,p=view.players[id],{x,y,w:cw,h:ch}=seat.person;
   if(id!==me){const final=p.cardsInHand as number,count=this.staged?.backs[id]??final,b=seat.backs,f=fan(b,seat.back,count);this.backs[id]=final;
    for(let n=0;n<count;n++){const k=n-(count-1)/2,bk=this.back(seat.back.w,seat.back.h);bk.position.set(b.x+k*f.step,b.y);bk.rotation=k*f.turn;this.world.addChild(bk);}}
   const person=this.face(p.character.name,artIndex(p.character.bindingName),cw,ch,'PERSONAGGIO',true,'','character');person.position.set(x,y);person.rotation=id===me?-.04:.025;this.world.addChild(person);
   const dead=p.character.dead,forfeit=view.forfeits[id];if(dead||forfeit){person.alpha=.55;this.text(person,dead?'ELIMINATO':'FORFAIT',0,0,compact?11:16,cw,0xffffff);}
   const r=p.character.resources,summary=RESOURCES.map(k=>`${LETTER[k]} ${r[k]??0}`).join(', ');
   const charHit:Hit={id:`person-${id}`,kind:'person',x,y,w:cw,h:ch,angle:person.rotation,target:{owner:id},label:`${id===me?'Tu':this.name(id)}, ${p.character.name}, salute ${r.HEALTH}${dead?', eliminato':forfeit?', forfait':''}; risorse ${summary}`,node:person};this.hits.push(charHit);
   if(this.model.allows({owner:id})&&!this.model.locked)this.halo(person,cw,ch,this.model.target?.owner===id&&this.model.target.itemIndex===undefined?0xf1e4c4:PETROL);
   const read=this.board(seat.board,p,id,id===me,compact);if(read)board=read;
   this.statusChips(seat.status,id,p);
   const strip=strips?.[id];if(this.marks&&!this.seqStarted)(roundSummary??={key:this.marksKey,seats:{}}).seats[id]={texts:(this.marks[id]?.length?this.marks[id]:NO_CHANGE).map(m=>m.text),box:strip?.box??null,fs:strip?.size.fs??null,drawn:!!strip};
   if(strip)this.seatSummary(strip,this.marks![id]?.length?this.marks![id]:NO_CHANGE);
   const covered=coveredItems(seat.items),table=this.staged?.items[id];
   p.character.items.forEach((item,index)=>{const b=seat.items[index]??seat.items[seat.items.length-1],c=this.card(item,b.w,b.h,true),hid=`item-${id}-${index}`;drawnItems.push({name:item.name,frame:this.faces.get(c)!.frame});c.position.set(b.x,b.y);c.rotation=(index-1)*.025;this.world.addChild(c);
    if(table)c.visible=false;
    const hit:Hit={id:hid,kind:'item',x:b.x,y:b.y,w:b.w,h:b.h,angle:c.rotation,covered:!!covered[index],hidden:!!table&&!table.some(x=>x.name===item.name),target:{owner:id,itemIndex:index},label:`${item.name}, oggetto di ${id===me?'te':this.name(id)}${roleLabel(item)?`, ruolo ${roleLabel(item).toLowerCase()}`:''}${item.gains&&item.gains!=='—'?`, dà ${item.gains}`:''}, copia ${index+1}`,node:c};this.hits.push(hit);
    // Raised (over its neighbour) by the mouse at rest, a first touch (K7) or the keyboard focus.
    if(hover===hid||this.peek===hid||this.focused===hid){c.scale.set(1.15);hit.w*=1.15;hit.h*=1.15;raised.push(c);}
    if(this.model.allows({owner:id,itemIndex:index})&&!this.model.locked)this.halo(c,b.w,b.h);});
   // During a sequence the objects as they stand so far: drawn apart from the view's, which keep hits and decisions (rule 2).
   if(table){const slots=this.staged!.slots.seats.find(x=>x.id===id)?.items??seat.items;table.forEach((item,index)=>{const b=slots[index]??slots[slots.length-1],c=this.card(item,b.w,b.h,true);c.position.set(b.x,b.y);c.rotation=(index-1)*.025;this.world.addChild(c);});}
  }
  const played=this.roundCards(L,compact),piles=this.piles(L,compact);
  const n=this.model.hand.length,res=view.players[me]?.character.resources??{},hand:Readout['hand']=[];let lifted:Container|null=null;
  this.model.hand.forEach((local,i)=>{const {x,y,angle:a}=handSlot(H,i,n);
   // O11: a light visual hint only. The card stays selectable, inspectable and sendable; the server judges.
   const short=shortfall(local.card,res),payable=!short.length,role=roleOf(local.card),gains=gainsOf(local.card).map(gainText);
   const state=handCardState(local,{choosingDiscard:this.model.choosingDiscard,selected:this.model.selected,target:this.model.target,discard:this.model.discard},{focused:local.key===this.focused,hovered:local.key===hover,payable,dragged:!!this.drag?.moved&&this.drag.key===local.key});
   // Owner, 5 November 2026: every card placed in the preview leaves its hand
   // slot empty until cancelled. Never remove/reorder it in the authoritative hand.
   if(state.inPreview){hand.push({key:local.key,name:local.card.name,role,gains,payable,alpha:state.alpha,inPreview:true,face:null});return;}
   const c=this.card(local.card,H.w,H.h,false,short,leftV(local.card,res));c.position.set(x,y);c.rotation=a;this.world.addChild(c);c.alpha=state.alpha;
   // A card drawn this round appears when its flight from the deck lands; it can be chosen at once all the same (rule 4).
   const coming=this.arriving.has(local.key);if(coming)c.visible=false;
   const hit:Hit={id:local.key,kind:'hand',key:local.key,x,y,w:H.w,h:H.h,angle:a,label:`${local.card.name}, ${subtype(local.card)}${role?`, ruolo ${ROLES[role].label.toLowerCase()}`:''}, costo ${cost(local.card)}${damageLabel(local.card,leftV(local.card,res))?`, danno ${damageLabel(local.card,leftV(local.card,res))}`:''}${payable?'':', risorse insufficienti'}${gains.length?`, dà ${gains.join(' ')}`:''}, priorità ${local.card.priority}, copia ${i+1}`,node:c,hidden:coming};this.hits.push(hit);
   // O12: hover (mouse), tap (selection) or focus lifts the whole card; its hit keeps the old slot too, so it does not flicker.
   // O26: the bound's hand copy rests while its discard is still to be chosen,
   // including keyboard/pointer focus. The target preview and its controls stay.
   if(state.nonDiscardable)hit.label+=', non scartabile';
   if(state.raised){const r=raisedCard(H,i,n);c.y=r.y;c.scale.set(H.zoom);c.rotation=r.angle;hit.angle=c.rotation;hit.h=H.h+H.lift;hit.y=y-H.lift/2;
    // A card raised only by the mouse keeps its resting width, so sliding left still reaches the previous card.
    if(state.wideHit){hit.w=H.w*H.zoom;hit.h=H.h*H.zoom+H.lift;}
    if(state.chosen)lifted=c;else raised.push(c);}
   if(local.key===this.model.selected||local.key===this.focused)this.halo(c,H.w,H.h);
   if(local.key===this.model.discard){this.halo(c,H.w,H.h,0xdc9699);this.text(c,'SCARTO',0,0,compact?14:22,H.w,WINE);}
   hand.push({key:local.key,name:local.card.name,role,gains,payable,alpha:c.alpha,inPreview:false,face:this.faces.get(c)??null});
  });
  // Raised cards on top, the selected one last.
  if(lifted)raised.push(lifted);raised.forEach(c=>this.world.setChildIndex(c,this.world.children.length-1));
  this.preview={x:L.preview.x,y:L.preview.y};
  const dest=this.model.target?this.hits.find(z=>(z.kind==='person'||z.kind==='item')&&z.target?.owner===this.model.target!.owner&&z.target?.itemIndex===this.model.target!.itemIndex):undefined;
  if(!this.model.target)this.dropPoint=null;
  this.confirmTo=dest&&this.model.selectedCard?{x:dest.x,y:dest.y,w:dest.w,h:dest.h}:null;
  // The card is placed from the target at rest: a hover lifts the target, and the card must not move under a pointer on its way to ✓ or ×.
  if(dest){const seat=L.seats.find(s=>s.id===dest.target!.owner),index=dest.target!.itemIndex,rest:Box=(index!=null?seat?.items[index]:seat?.person)??{x:dest.x,y:dest.y,w:dest.w,h:dest.h},key=`${dest.id}:${w}x${h}:${rest.x},${rest.y}:${this.dropPoint?.x},${this.dropPoint?.y}`;if(this.placed?.key!==key)this.placed={key,spot:previewSpot(L,w,h,rest,this.dropPoint??rest)};this.preview=this.placed.spot;}
  if(this.model.selectedCard&&this.model.target){const pc=this.card(this.model.selectedCard,L.preview.w,L.preview.h,false,shortfall(this.model.selectedCard,res),leftV(this.model.selectedCard,res));pc.position.set(this.preview.x,this.preview.y);pc.rotation=-.10;this.halo(pc,L.preview.w,L.preview.h);this.world.addChild(pc);this.pendingGhost=pc;
   // Keep the same semantic key for keyboard focus and I/Enter inspection, now
   // at the visible card. No invisible hit remains over discard candidates.
   this.hits.push({id:this.model.selected!,kind:'preview',key:this.model.selected!,x:pc.x,y:pc.y,w:L.preview.w,h:L.preview.h,angle:pc.rotation,label:`${this.model.selectedCard.name}, carta giocata in anteprima: dettagli`,node:pc});
  }
  // C4-10 O30: ✓ and × on the chosen discard as drawn, else on the placed card.
  const di=this.model.target&&this.model.discard?this.model.hand.findIndex(c=>c.key===this.model.discard&&c.key!==this.model.selected&&regularCard(c.card)):-1;
  this.confirmCard=this.model.selectedCard&&this.model.target?confirmCard(H,{x:this.preview.x,y:this.preview.y,w:L.preview.w,h:L.preview.h},di>=0?{index:di,n}:null):null;
  const mine=L.seats.find(s=>s.me);this.readout={layout:{hand:{w:H.w,h:H.h},person:{w:mine?.person.w??0,h:mine?.person.h??0},item:{w:mine?.items[0].w??0,h:mine?.items[0].h??0}},piles,played,items:drawnItems,hand,board,summary:roundSummary,boards:Object.fromEntries(ids.map(id=>[id,{...this.shown(id,view.players[id])}]))};
  if(this.model.phase==='sending'||this.model.phase==='uncertain')this.world.alpha=.86;else this.world.alpha=1;
  this.drawAim();this.onLayout();
 }
 // C3-3 (O6, D3): one arrow per admitted character and, for a card that takes an object, one per seat that has some. Only
 // visual help: the categories are the ones of the outlines (Model.allows) and the server stays the judge. None when the
 // choice is locked (pending, eliminated, outcome) or once a target is chosen (the single line to the preview remains).
 drawAim(){const t0=performance.now(),g=this.aimG,m=this.model,L=this.layout,d=this.drag;this.aimDirty=false;g.clear();this.arrows=[];this.confirmArrow=null;this.aimLayer.alpha=1;
  // Owner, after C4-2: while the move waits for ✓ or ×, the same arrow goes from the chosen card to its target.
  if(L&&this.confirmTo){const source={...this.preview,w:L.preview.w,h:L.preview.h},[a]=aimArrows(source,[{id:'confirm',owner:m.target?.owner??'',kind:'person',box:this.confirmTo}],{w:this.width,h:this.height},{head:L.compact?20:30});this.confirmArrow=a;this.paintArrows([a],new Map([[a.id,this.confirmTo]]));return;}
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
  this.paintArrows(this.arrows.filter(a=>!a.reached),new Map(targets.map(t=>[t.id,t.box])));
  this.stats.aimDraws++;this.stats.aimMs.push(performance.now()-t0);if(this.stats.aimMs.length>600)this.stats.aimMs.shift();}
 private paintArrows(drawn:Arrow[],boxes:Map<string,Box>){const g=this.aimG,L=this.layout!;
  // Pop-art style (owner's reference, after C3-3): one ribbon that ends in a barbed head, all in the light blue of the target outlines,
  // with a bold black outline, a cartoon highlight on the head and a solid black extrusion down and to the left. The layer is translucent
  // as a whole (one filter, so overlaps do not darken) to leave what the arrows cross partly visible. A short arrow pushes its tip into
  // the target rather than shrinking to a blob.
  const C=L.compact,depth=C?5:8,line=C?3:4;
  const shapes=drawn.map(a=>arrowShape(a,{tail:C?9:13,neck:C?16:26,head:C?32:50,minLen:C?78:120,reach:C?30:46,push:C?6:10,target:boxes.get(a.id)}));
  for(const s of shapes)for(let k=1;k<=4;k++){const o=depth*k/4;g.poly(s.outline.map((v,i)=>i%2?v+o*.7:v-o)).fill(INK).stroke({color:INK,width:3,join:'round'});}
  for(const s of shapes){g.poly(s.outline).fill(PETROL).stroke({color:INK,width:line,join:'miter',miterLimit:8});
   g.moveTo(s.shine[0].x,s.shine[0].y).lineTo(s.shine[1].x,s.shine[1].y).stroke({color:0xe6fbfb,width:C?2.5:3.5,cap:'round',alpha:.9});}
  this.aimLayer.filters=drawn.length?[this.aimAlpha]:null;}
 // C4-10: the guide never reads or writes the hits, so a press lands where it lands without it (hitAt, readability.ts).
 hit(x:number,y:number,targetsOnly=false){return hitAt([...this.hits].sort((a,b)=>this.world.getChildIndex(b.node)-this.world.getChildIndex(a.node)).filter(r=>!(targetsOnly&&(r.kind==='hand'||r.kind==='preview'))),x,y);}
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
 private drawGhost(key:string){this.clearGhost();const c=this.model.hand.find(x=>x.key===key);if(!c)return;const gw=this.layout?.hand.w??(this.height<550?112:180);this.ghostH=gw*1.38;this.ghost=this.card(c.card,gw,this.ghostH,false,[],leftV(c.card,this.model.view.players[this.model.me]?.character.resources));
  this.ghost.addChildAt(new Graphics().roundRect(-gw/2+10,-this.ghostH/2+16,gw,this.ghostH,8).fill({color:0x0c0705,alpha:.45}),0);this.fx.addChild(this.ghost);this.placeGhost(this.drag?.lastX??0,this.drag?.lastY??0);}
 private clearGhost(){if(this.ghost){this.ghost.destroy({children:true});this.ghost=null;}}
 up(e:PointerEvent){const d=this.drag;if(!d||d.id!==e.pointerId)return;this.drag=null;this.clearGhost();if(this.app.canvas.hasPointerCapture(e.pointerId))this.app.canvas.releasePointerCapture(e.pointerId);
  const p=this.point(e);if(!d.moved){this.activate(d.key,true);return;}
  this.drag=d;const target=this.dropTarget(p.x,p.y);this.drag=null;
  // Own objects can share the lower band with the fan: a compatible physical target wins.
  if(target){this.dropPoint=p;this.model.aim(target.target!);}
  else if(d.insertion!==null&&p.x>this.width*.25&&p.x<this.width*.98){const keys=this.model.hand.map(x=>x.key).filter(k=>k!==d.key);keys.splice(d.insertion,0,d.key);this.model.cancel();this.model.reorder(keys);}
  else this.model.cancel();this.ghostOver=false;this.draw();}
 // `pointer`: the sequence was already handled on pointerdown. Keyboard and the semantic layer: a hand card ends it, the rest advances.
 activate(id:string,pointer=false){if(this.blocked||this.contextLost||this.height>this.width)return;this.inputStart=performance.now();const hit=this.hits.find(h=>h.id===id);if(!hit)return;
  if(!pointer){if(hit.kind==='hand')this.finish('input');else this.advance();}
  if(hit.kind==='preview'){this.inspect(id);return;}
  if(hit.kind==='hand'){if(this.model.locked){this.inspect(id);return;}this.model.select(hit.key!);}
  // A table element that is not an admitted target also counts as "elsewhere".
  else if(this.model.selected&&!this.model.locked){this.dropPoint=null;if(!this.model.aim(hit.target!))this.model.cancel();}
  else if(hit.kind==='status'){this.openStatus=this.openStatus===id?null:id;this.draw();this.onState();}else this.inspect(id);
 }
 inspect(id:string){const hit=this.hits.find(h=>h.id===id);if(!hit)return;if(hit.kind==='hand'||hit.kind==='preview'){const card=this.model.hand.find(x=>x.key===hit.key)!.card;this.onInspect({title:card.name,card});}
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
 interrupt(reason:string,redraw=true,sequence=true){if(this.drag||(sequence&&this.seqStarted))this.stats.cancels.push(reason);this.peek=null;const d=this.drag;this.drag=null;if(d&&this.app.canvas.hasPointerCapture(d.id))this.app.canvas.releasePointerCapture(d.id);this.clearGhost();if(sequence){this.sounds?.stopAll();this.finish(reason,false);}
  if(d)this.model.cancel();this.setHover(null);if(redraw)this.draw();this.onState();}
 // Esc drops a focus left by a press too (the card would stay raised over its neighbours); the keyboard's stays.
 escape(){this.openStatus=null;if(this.focused&&document.activeElement?.getAttribute('data-hit')!==this.focused)this.focused=null;this.interrupt('escape');this.model.cancel();}
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
  // C3-4s: the table as it stood before the round; every change of it lands with its flight. The slots hold as many objects as the larger of the two views.
  const ids=Object.keys(v.players),before=(id:string)=>previous.players[id]?.character.items??[],slots=tableLayout(this.width,this.height,ids,this.model.me,Object.fromEntries(ids.map(id=>[id,Math.max(before(id).length,v.players[id].character.items.length)])));
  const objectsBefore=Object.fromEntries(ids.map(id=>[id,[...before(id)]]));
  const handDraws=(id:string)=>T.draws.filter(d=>d.seat===id&&d.to==='hand').length;
  const shown={items:objectsBefore,slots,backs:Object.fromEntries(ids.filter(id=>id!==this.model.me).map(id=>[id,Math.max(0,(v.players[id].cardsInHand as number)-handDraws(id))])),deck:previous.players[this.model.me]?.deck??v.players[this.model.me]?.deck??0,discard:this.pile.before};
  const slotBox=(id:string,i:number):Box|null=>{const list=slots.seats.find(s=>s.id===id)?.items??[];return i<0?null:list[i]??list.at(-1)??null;};
  const itemBox=(id:string,name:string,old:boolean):Box|null=>{const items=old?before(id):v.players[id]?.character.items??[];return slotBox(id,old?items.findIndex(c=>c.name===name):items.map(c=>c.name).lastIndexOf(name));};
  const itemAt=(id:string,name:string,old:boolean):Point|null=>{const b=itemBox(id,name,old);return b?{x:b.x,y:b.y}:null;};
  const objectGoes=(at:number,id:string,name:string)=>this.events.push({at,run:()=>{const l=shown.items[id],i=l?.findIndex(c=>c.name===name)??-1;if(i>=0)l.splice(i,1);}});
  const objectComes=(at:number,id:string,name:string)=>this.events.push({at,run:()=>{const l=shown.items[id],end=(v.players[id]?.character.items??[]).map(c=>c.name).lastIndexOf(name);if(l)l.splice(end<0?l.length:Math.min(end,l.length),0,named(name));}});
  const flown={key:k,built:{clear:0,discard:0,drawHand:0,drawBack:0,itemOut:0,itemIn:0} as Record<FlownTag,number>,seen:{clear:0,discard:0,drawHand:0,drawBack:0,itemOut:0,itemIn:0} as Record<FlownTag,number>,toPile:0,toHand:0,itemsStart:Object.fromEntries(ids.map(id=>[id,before(id).map(c=>c.name)])),itemsEnd:null as Record<string,string[]>|null,advanced:false};
  const flight=(f:Flight)=>{this.flights.push(f);if(f.tag)flown.built[f.tag]++;if(f.also)flown.built[f.also]++;};
  const add=<N extends Container>(node:N)=>{node.visible=false;this.fx.addChild(node);return node;};
  const count={played:0,cleared:0,vanished:0,appeared:0,drops:0,stamps:0,tokens:0,objects:0,consumed:0,passed:0,broken:0,discards:0,draws:0,endOfTurn:0,emphasis:0,steps:0,pops:0,closeUps:0,targetUps:0};
  const mw=C?52:80,mh=C?72:112,iw=C?44:65,ih=C?62:91;
  // Board values start from the previous view; each step moves them (per card) or the tail sets the final ones (total).
  this.display=Object.fromEntries(Object.keys(v.players).map(id=>[id,{...(previous.players[id]?.character.resources??{})}]));
  this.events=[];this.landed=0;this.labels=[];this.arriving.clear();
  // C3-4s: the cards of the previous round leave the middle first, the top of the pile first: regular and last resort to the discard pile (the
  // own one, or beside the seat for the others, whose piles are not drawn), basic and bound back to the hand (R02).
  if(p.clear&&L?.played){const list=T.clear.slice(0,L.played.slots.length),n=list.length,mine=this.model.me;list.forEach((c,i)=>{const b=L.played!.slots[i],node=add(this.card(named(c.card),b.w,b.h,true)),own=c.author===mine,start=p.clear!.at+(n-1-i)*p.clear!.dur*.25/Math.max(1,n),end=start+p.clear!.dur*.75;let to:Point|null=null,s1=.5,fade=.0;
    if(c.to==='discard'){const k=own?L.piles?.discard:null;to=k?{x:k.x,y:k.y}:discard(c.author);if(k){s1=k.w/b.w;fade=1;}if(own)this.events.push({at:end,run:()=>{shown.discard=c.card;}});flown.toPile++;}
    else{const h=own?this.hits.find(x=>x.kind==='hand'&&this.model.hand.find(y=>y.key===x.key)?.card.name===c.card):null,bk=place(c.author)?.backs;to=h?{x:h.x,y:h.y}:bk?{x:bk.x,y:bk.y}:seat(c.author)??null;if(h)s1=h.w/b.w;flown.toHand++;}
    flight({node,from:{x:b.x,y:b.y},to:to??{x:b.x,y:b.y},start,end,mode:'travel',s0:1,s1,fade,tag:'clear'});count.cleared++;});}
  const change=(at:number,steps:Step[])=>{if(!steps.length)return;count.steps+=steps.length;
   this.events.push({at,run:()=>{for(const s of steps)(this.display![s.seat]??={})[s.resource]=s.to;}});
   for(const s of steps)if(this.pop(s,at))count.pops++;};
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
  this.guideBeats=[];
  const character=(id:string,w:number,h:number)=>{const p=v.players[id]?.character??previous.players[id]?.character;return this.face(p?.name??'',artIndex(p?.bindingName??''),w,h,'PERSONAGGIO',true,'','character');};
  T.moves.forEach((m,i)=>{const from=seat(m.author),to=seat(m.target),P=p.moves[i],home=place(m.author)?.person,aim=place(m.target)?.person;if(!from||!to||!home||!aim)return;
   const at={cost:P.cost.at,author:P.author.at,back:P.back.at,flight:P.flight.at,target:P.target.at,changes:P.changes.at};
   // 1. Cost: this card's tokens leave its author; the bound's extra card leaves the hand for the discard.
   m.tokens.forEach((tk,n)=>{const b=place(m.author)?.board;if(!b)return;
    const r=C?10:14,node=add(new Container()),g=new Graphics().circle(0,0,r).fill(RES_COLOR[tk.resource]).stroke({color:INK,width:2});node.addChild(g);glyph(g,tk.resource,-r*.35,0,r*.9,0xfff6e2);
    const label=this.text(node,`−${tk.amount}`,r*.45,0,C?10:13,undefined,0xfff6e2);label.anchor.set(0,.5);
    const p0=inside(b.x-b.w*.3+n*(r*2.6),b.y-b.h*.5);this.flights.push({node,from:p0,to:{x:p0.x,y:p0.y-(C?34:52)},start:P.cost.at+n*60,end:P.cost.at+P.cost.dur,mode:'rise'});count.tokens++;});
   // C3-4s: the bound's extra card goes from the hand (the own, or the covered one) to the discard pile (the own, or beside the seat).
   if(m.discard){const own=m.author===this.model.me,k=own?L?.piles?.discard:null,bk=place(m.author)?.backs,d=add(this.card(named(m.discard),iw,ih)),a=own&&L?{x:L.hand.center,y:L.hand.y-L.hand.h*.3}:bk?{x:bk.x,y:bk.y}:{x:from.x,y:from.y},e=P.cost.at+P.cost.dur;
    flight({node:d,from:a,to:k?{x:k.x,y:k.y}:discard(m.author)??a,start:P.cost.at,end:e,mode:'travel',s0:own?1:.5,s1:k?k.w/iw:.5,fade:k?1:0,tag:'discard'});count.discards++;if(own){const name=m.discard;this.events.push({at:e,run:()=>{shown.discard=name;}});}}
   change(P.cost.at+P.cost.dur*BEAT_PHASE.costLabel,m.costSteps);
   // 2–3. Close-up of the author: its character grows to the free place with the card beside it, stays, then goes back.
   const up=upOf(m.author),node=add(new Container()),person=character(m.author,up.person.w,up.person.h),card=this.card(named(m.card),up.card.w,up.card.h,false,[],leftV(named(m.card),previous.players[m.author]?.character.resources));
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
   // C3-5: a card that resolves makes the impact of its type of damage (A1) or, where none applies, of its role (D2): the nature of the card, not the
   // damage dealt (a conversion is not visible). A voided one gets a cross and the stamp.
   if(m.void){const cross=add(this.impactMark('VOID',C));cross.position.set(to.x,to.y);this.accents.push({node:cross,at:hit,dur:after,kind:'impact',impact:'VOID',y:to.y});
    const stamp=add(this.stamp('ANNULLATA',C));stamp.position.set(to.x,to.y);this.accents.push({node:stamp,at:hit,dur:after,kind:'stamp'});count.stamps++;this.stats.impacts.push({key:k,move:i,card:m.card,void:true,kinds:['VOID'],shake:0,wave:0});}
   else{const imp=impactOf(named(m.card),this.reduced),dur=P.flight.at+P.flight.dur-hit+P.target.dur,gap=C?44:70;
    if(imp.kinds.includes('HIT')){const wave=add(this.shockWave(C));wave.position.set(to.x,to.y);this.accents.push({node:wave,at:hit,dur:Math.min(dur,650),kind:'shock'});}
    imp.kinds.forEach((kind,n)=>{const mark=add(this.impactMark(kind,C));mark.position.set(to.x+(n-(imp.kinds.length-1)/2)*gap,to.y);this.accents.push({node:mark,at:hit,dur,kind:'impact',impact:kind,y:to.y});});
    if(imp.shake){const dark={key:k,move:i,seat:m.target,min:255};this.stats.darks.push(dark);this.shakes.push({id:m.target,at:hit,dur:Math.min(dur,420),amp:C?3:5,dark});}
    this.stats.impacts.push({key:k,move:i,card:m.card,void:false,kinds:[...imp.kinds],shake:imp.shake,wave:imp.kinds.includes('HIT')?1:0});}
   // 5. Close-up of the target: it grows a little in its seat, under the card that hit it; the chosen object meets its fate.
   const tu=targetOf({me:m.target===this.model.me,person:aim},{w:this.width,h:this.height},(L?.seats??[]).filter(x=>x.id!==m.target).map(x=>x.person)),tn=add(character(m.target,tu.w,tu.h)),t0=aim.h/tu.h;this.fx.setChildIndex(tn,0);
   this.zooms.push({node:tn,rest:{x:aim.x,y:aim.y,s:t0},up:{x:tu.x,y:tu.y,s:1},at:P.target.at,grow:P.target.dur*.3,hold:P.target.at+P.target.dur*.75,end:P.target.at+P.target.dur});count.targetUps++;
   this.stats.closeUps.at(-1)!.target=tu;
   if(m.item){const it=m.item,box=itemBox(it.owner,it.name,true),src=box?{x:box.x,y:box.y}:to,bw=box?.w??iw,bh=box?.h??ih,node=add(this.card(named(it.name),bw,bh,true)),s=P.target.at,e=P.target.at+P.target.dur;count.objects++;count[it.fate]++;objectGoes(s,it.owner,it.name);
    if(it.fate==='consumed')flight({node,from:src,to:{x:from.x,y:from.y},start:s,end:e,mode:'shrink',tag:'itemOut'});
    else if(it.fate==='passed'){const dest=itemBox(m.author,it.name,false);flight({node,from:src,to:dest?{x:dest.x,y:dest.y}:{x:from.x,y:from.y},start:s,end:e,mode:'travel',s0:1,s1:dest?dest.w/bw:1,fade:1,tag:'itemOut',also:'itemIn'});objectComes(e,m.author,it.name);this.stats.transfers++;}
    else{node.addChild(new Graphics().moveTo(-bw*.1,-bh*.5).lineTo(bw*.08,-bh*.1).lineTo(-bw*.12,bh*.15).lineTo(bw*.05,bh*.5).stroke({color:INK,width:3}));flight({node,from:src,to:{x:src.x,y:src.y+(C?12:20)},start:s,end:e,mode:'break',tag:'itemOut'});}}
   // 6. The card's changes.
   change(P.changes.at,m.steps);
   // C4-10: the guide follows author and target of the card in course, on the times already planned (none new).
   this.guideBeats.push({from:P.cost.at,to:end,hit,author:m.author,target:m.target});
   this.stats.schedule.push({key:k,move:i,...at,hit:Math.round(hit),tokens:m.tokens.length?P.cost.at:null,closeUp:P.author.at,goesBack:P.back.at,flies:P.flight.at,targetUp:P.target.at,pops:m.steps.length?P.changes.at:null,costPops:m.costSteps.length?Math.round(P.cost.at+P.cost.dur*.3):null});});
  // 3. Draws: cards leave each deck as the counts say; own new cards face up, opponents' as backs, deck objects to the table.
  // C3-4s: what leaves a deck is on the table only when it lands. An object whose change no move explains vanishes from or appears at its seat (D1).
  if(p.draws){const n=T.draws.length,used=new Set<string>(),me=this.model.me,pileW=L?.piles?.deck.w,spread=(i:number)=>p.draws!.at+i*p.draws!.dur*.4/Math.max(1,n),left=Object.fromEntries(ids.map(id=>[id,shown.backs[id]??0]));
   T.draws.forEach((d,i)=>{const src=deck(d.seat);if(!src)return;const start=spread(i),end=start+p.draws!.dur*.6;if(d.seat===me)this.events.push({at:start,run:()=>{shown.deck=Math.max(0,shown.deck-1);}});
    if(d.to==='table'){const b=itemBox(d.seat,d.name!,false),bw=b?.w??iw,node=add(this.card(named(d.name!),bw,b?.h??ih,true));count.objects++;flight({node,from:src,to:b?{x:b.x,y:b.y}:src,start,end,mode:'travel',s0:d.seat===me&&pileW?pileW/bw:.5,s1:1,fade:1,tag:'itemIn'});objectComes(end,d.seat,d.name!);count.draws++;return;}
    if(d.seat===me&&d.name){const h=this.hits.find(x=>x.kind==='hand'&&!used.has(x.id)&&this.model.hand.find(c=>c.key===x.key)?.card.name===d.name);
     if(h){used.add(h.id);this.arriving.add(h.key!);const key=h.key!;this.events.push({at:end,run:()=>{this.arriving.delete(key);}});}
     const node=add(this.card(named(d.name),iw,ih));flight({node,from:src,to:h?{x:h.x,y:h.y}:src,start,end,mode:'travel',s0:pileW?pileW/iw:.5,s1:h?h.w/iw:1,fade:1,tag:'drawHand'});count.draws++;return;}
    const seatBox=place(d.seat),bk=seatBox?.back,b=seatBox?.backs,f=b&&bk?fan(b,{...bk},left[d.seat]+1):null,tail=f?f.step*(left[d.seat]/2):0,dest=b?{x:b.x+tail,y:b.y}:src;left[d.seat]++;
    const node=add(this.back(bk?.w??(C?18:28),bk?.h??(C?25:39)));flight({node,from:src,to:dest,start,end,mode:'travel',s0:.6,s1:1,fade:1,tag:'drawBack'});this.events.push({at:end,run:()=>{shown.backs[d.seat]=(shown.backs[d.seat]??0)+1;}});count.draws++;});
   const at=p.draws.at,dur=p.draws.dur;
   for(const o of T.vanished){const b=itemBox(o.seat,o.name,true);if(!b)continue;const node=add(this.card(named(o.name),b.w,b.h,true));objectGoes(at,o.seat,o.name);flight({node,from:{x:b.x,y:b.y},to:{x:b.x,y:b.y},start:at,end:at+dur*.7,mode:'vanish',tag:'itemOut'});count.vanished++;}
   for(const o of T.appeared){const b=itemBox(o.seat,o.name,false);if(!b)continue;const node=add(this.card(named(o.name),b.w,b.h,true));flight({node,from:{x:b.x,y:b.y},to:{x:b.x,y:b.y},start:at+dur*.3,end:at+dur,mode:'pop',tag:'itemIn'});objectComes(at+dur,o.seat,o.name);count.appeared++;}}
  // 4. End of turn: a mark on every seat with end-of-turn lines (who, never what) and, when verified, their changes.
  if(p.endOfTurn){for(const id of T.endOfTurn.seats){const s=seat(id);if(!s)continue;const ring=add(new Graphics().roundRect(-s.w*.6,-s.h*.6,s.w*1.2,s.h*1.2,10).stroke({color:RES_COLOR.TOXICITY,width:4}));ring.position.set(s.x,s.y);this.accents.push({node:ring,at:p.endOfTurn.at,dur:p.endOfTurn.dur});count.endOfTurn++;}
   change(p.endOfTurn.at+p.endOfTurn.dur*BEAT_PHASE.endLabel,T.endOfTurn.steps);}
  // 5. Tail: without verified lines the bars go from the previous to the final value (D5); deaths and forfeits are stamped.
  if(T.bars==='total')change(p.tail.at,T.totals);
  this.events.push({at:p.tail.at,run:()=>{this.display=null;}});
  // C3-5: an elimination also knocks the seat and sends out a wine ring; a forfeit is only stamped. The outcome closes the tail with its banner.
  const tailEnd=T.outcome?p.tail.at+p.tail.dur-PACE.outcome:p.tail.at+p.tail.dur;
  for(const e of T.emphasis){const s=seat(e.seat);if(!s)continue;const stamp=add(this.stamp(e.kind==='died'?'ELIMINATO':'FORFAIT',C));stamp.position.set(s.x,s.y);this.accents.push({node:stamp,at:p.tail.at,dur:tailEnd-p.tail.at,kind:'stamp'});count.emphasis++;
   if(e.kind==='died'){const ring=add(new Graphics().roundRect(-s.w*.6,-s.h*.6,s.w*1.2,s.h*1.2,10).stroke({color:WINE,width:5}));ring.position.set(s.x,s.y);this.accents.push({node:ring,at:p.tail.at,dur:Math.min(600,tailEnd-p.tail.at)});this.shakes.push({id:e.seat,at:p.tail.at,dur:420,amp:C?3:5});}
   this.stats.emphasis.push({key:k,kind:e.kind,seat:e.seat});}
  if(T.outcome){const me=this.model.me,w=T.outcome.winner,text=w==='NONE'?'PAREGGIO':w===me?'VITTORIA':'SCONFITTA',banner=add(this.stamp(text,C,2));banner.position.set(this.width/2,this.height*.42);
   this.accents.push({node:banner,at:tailEnd,dur:PACE.outcome,kind:'stamp'});this.stats.emphasis.push({key:k,kind:'outcome',text});}
  this.events.sort((a,b)=>a.at-b.at);
  // The labels stay over the close-ups they may outlive.
  for(const a of this.accents)if(a.kind==='pop')this.fx.addChild(a.node);
  this.stats.beats.push({key:k,bars:T.bars,reason:T.reason,drift:T.drift,...count});

  this.stats.flown.push(flown);this.advancesAtStart=this.stats.advances;
  // C4-7-ter: every nominal hit uses its own cue; outcome belongs to the HTML panel.
  const cues=hitCues(T,registry),cue=null;
  this.stats.sequencePlans.push({key:k,moves:T.moves.length,total:p.total,expected:beats(T),pace:p,cue,cues,started:Math.round(performance.now())});
  this.staged=shown;this.sounds?.beginRound(k);this.cue.arm(k,cues);this.trace({type:'begin',key:k,cues,impacts:this.stats.impacts.filter(x=>x.key===k)});this.seqStarted=performance.now();this.stats.sequences++;this.draw();
 }
/** C3-5: the mark of one impact, vector only (D9): a burst for a blow, a slash for a cut, a drop for poison, the symbol of its role in a ring where the type does not apply, a cross for a voided move. */
 // The blow's shock wave: a ring with a soft disc that grows and fades like an explosion, under the burst (owner trial, C3-7).
 private shockWave(compact:boolean){const c=new Container(),g=new Graphics(),R=compact?26:40;c.addChild(g);g.circle(0,0,R).fill({color:DAMAGE_ACCENT.HIT,alpha:.22}).stroke({color:INK,width:compact?7:10});g.circle(0,0,R).stroke({color:DAMAGE_ACCENT.HIT,width:compact?4:6});g.circle(0,0,R*.82).stroke({color:DAMAGE_COLOR.HIT,width:compact?2:3});return c;}
 private impactMark(kind:ImpactKind|'VOID',compact:boolean){const c=new Container(),g=new Graphics(),R=compact?26:40;c.addChild(g);
  if(kind==='HIT'){glyph(g,'HIT',0,0,R*2.3,INK);glyph(g,'HIT',0,0,R*2,DAMAGE_COLOR.HIT,DAMAGE_ACCENT.HIT);}
  else if(kind==='CUT'){glyph(g,'CUT',0,0,R*2.3,INK);glyph(g,'CUT',0,0,R*2,0x6b8296,DAMAGE_ACCENT.CUT);}
  else if(kind==='POISON'){glyph(g,'POISON',0,0,R*2.1,INK);glyph(g,'POISON',0,0,R*1.8,0x78b02c,DAMAGE_ACCENT.POISON);for(const [bx,by,br] of [[.9,-.2,.2],[-.9,.15,.16],[.6,.8,.13]])g.circle(bx*R,by*R,br*R).fill(0x78b02c).stroke({color:INK,width:1.5});}
  else if(kind==='VOID'){const a=R*.9;g.moveTo(-a,-a).lineTo(a,a).moveTo(a,-a).lineTo(-a,a).stroke({color:INK,width:compact?9:13,cap:'round'});g.moveTo(-a,-a).lineTo(a,a).moveTo(a,-a).lineTo(-a,a).stroke({color:WINE,width:compact?5:8,cap:'round'});}
  else if(kind==='PLAIN')g.circle(0,0,24).stroke({color:PETROL,width:4});
  else{g.circle(0,0,R).fill({color:0x120c08,alpha:.55}).stroke({color:ROLE_COLOR[kind],width:compact?3:4});glyph(g,kind,0,0,R*1.5,INK);glyph(g,kind,0,0,R*1.25,kind==='COUNTER'||kind==='DEFENSE'?0x8fd0d0:PAPER);}
  return c;}
 /** C3-5, for the checks: each card drawn as the hand (or the small card of the round's cascade) draws it, what it shows read back, then thrown away. */
 faceInfos(cards:Card[],small=false){const L=this.layout,w=small?L?.played?.slots[0]?.w??40:L?.hand.w??112,h=small?L?.played?.slots[0]?.h??56:L?.hand.h??w*1.38;
  return cards.map(c=>{const f=this.card(c,w,h,small,[],null),info=this.faces.get(f)!;f.destroy({children:true});return {name:c.name,catalogDamage:c.damage??null,catalogAmount:c.damageAmount??null,priority:c.priority,item:c.item,cost:c.cost,gains:c.gains??null,...info};});}
 /** «ANNULLATA», «ELIMINATO»: a wine stamp pressed on a card or a character. */
 private stamp(word:string,compact:boolean,size=1){const c=new Container(),label=this.text(c,word,0,0,(compact?13:20)*size,undefined,0xffe9e9);label.anchor.set(.5);
  const w=label.width+18,h=label.height+8;c.addChildAt(new Graphics().roundRect(-w/2,-h/2,w,h,4).fill({color:WINE,alpha:.92}).stroke({color:0xffd9d9,width:2.5}),0);c.rotation=-.18;return c;}
 /** The resource a step changes, enlarged over its board for a moment: glyph, bar and «before → after» (C3-4). */
 private pop(s:Step,at:number){const b=this.layout?.seats.find(x=>x.id===s.seat)?.board,p=this.model.view.players[s.seat];if(!b||!p)return false;
  const C=this.height<550,own=s.seat===this.model.me,fs=C?12:17,c=new Container(),g=new Graphics();c.addChild(g);
  const d=s.to-s.from,label=this.text(c,`${s.from} → ${s.to}`,0,0,fs,undefined,d<0?0xffb7bd:0xc9f0b0);label.anchor.set(0,.5);
  const gs=fs*1.3,bw=C?54:84,w=gs+8+label.width+10+bw+12,h=fs*2;label.position.set(-w/2+gs+12,0);
  g.roundRect(-w/2,-h/2,w,h,h*.35).fill({color:0x120c08,alpha:.92}).stroke({color:RES_COLOR[s.resource],width:2});glyph(g,s.resource,-w/2+6+gs/2,0,gs,RES_COLOR[s.resource]);
  const m=meter(s.to,this.start(s.seat,p)[s.resource],s.resource==='HEALTH'),x=w/2-bw-8,th=fs*.6;
  g.rect(x,-th/2,bw,th).fill({color:0x000000,alpha:.5});if(m.fill)g.rect(x,-th/2,bw*m.fill,th).fill(RES_COLOR[s.resource]);if(m.negative)g.rect(x,-th/2,2,th).fill(0xe0707a);
  const row=own?RESOURCES.indexOf(s.resource):-1,y=own?b.y-b.h/2+b.h/RESOURCES.length*(row+.5):b.y-b.h/2-h*.6,dur=LABEL.in+LABEL.read+LABEL.out;
  // C3-4s: a label outlives its beat: its place stays clear of the ones still visible when it appears.
  const base={x:Math.max(w/2+4,Math.min(this.width-w/2-4,b.x+(own?b.w*.15:0))),y:Math.max(h/2+2,y),w,h},box=labelSpot(base,{w:this.width,h:this.height},this.labels.filter(l=>l.to>at&&l.from<at+dur).map(l=>l.box));
  c.position.set(box.x,box.y);c.visible=false;this.fx.addChild(c);const entry:Label={seat:s.seat,resource:s.resource,box,from:Math.round(at),to:Math.round(at+dur),first:0,last:0,end:0,gap:0};this.labels.push(entry);
  this.accents.push({node:c,at,dur,kind:'pop',label:entry});this.stats.aggregateDeltas++;return true;}
 get sequenceRunning(){return !!this.seqStarted;}
 private readonly cue=new RoundCue({round:(key,kind,id,scale)=>this.sounds?.round(key,kind,id,scale)??false});
 /** Verification only (C4-7-bis): a probe may set `window.__bmAudioTrace` to follow the sequences; absent, nothing happens. */
 private trace(e:Record<string,unknown>){try{(window as unknown as {__bmAudioTrace?:(e:Record<string,unknown>)=>void}).__bmAudioTrace?.(e);}catch{}}
 /** D12: a tap on the table during the sequence moves it to the next card; past the last one it ends. */
 advance(){if(!this.seqStarted||!this.pace)return false;const elapsed=performance.now()-this.seqStarted,next=nextStop(this.pace,elapsed);
  this.stats.advances++;this.cue.advance(next,this.pace.total);if(next>=this.pace.total){this.finish('input');return true;}this.seqStarted-=next-elapsed;return true;}
 /** Brings a running sequence to the final state (the view is already drawn); the static summary stays. */
 finish(reason:string,redraw=true){if(!this.seqStarted)return;this.stats.sequenceEnds.push({key:this.seqKey,reason,ms:Math.round(performance.now()-this.seqStarted)});this.cue.end(reason);this.trace({type:'end',key:this.seqKey,reason});
  // A sound started by the end itself or just before it plays on; a jump or an interruption silences it.
  this.stopEffects(reason==='complete'||reason==='input');if(redraw){this.draw();this.onState();}}
 /** «Salta effetti». */
 skip(){this.sounds?.stopAll();this.finish('skip');}
 stopEffects(keepSound=false){this.cue.end('stop');this.sounds?.endRound(!keepSound);if(this.seqStarted){this.stats.sequenceMs.push(performance.now()-this.seqStarted);const f=this.stats.flown.at(-1);if(f&&this.staged){f.itemsEnd=Object.fromEntries(Object.entries(this.staged.items).map(([id,l])=>[id,l.map(c=>c.name)]));f.advanced=f.advanced||this.stats.advances!==this.advancesAtStart;}
   for(const l of this.labels)this.stats.labels.push({key:this.seqKey,seat:l.seat,resource:l.resource,box:l.box,from:l.from,to:l.to,readable:l.first?Math.round((l.end||l.last)-l.first):0,gap:Math.round(l.gap)});if(this.stats.labels.length>3000)this.stats.labels.splice(0,1000);}
  this.staged=null;this.arriving.clear();this.labels=[];this.guideBeats=[];this.seqStarted=0;this.pace=null;this.plan=null;this.display=null;this.events=[];this.flights=[];this.zooms=[];this.accents=[];for(const sh of this.shakes){const h=this.hits.find(z=>z.id===`person-${sh.id}`);if(h){h.node.tint=0xffffff;h.node.x=h.x;}}this.shakes=[];this.fx.removeChildren().forEach(c=>c.destroy({children:true}));this.ghost=null;}
 private lastTick=0;
 // ---- C4-10: visual guide, strategy B «Richiamo». Focus and motion are pure (readability.ts); here they are only applied, over nodes that
 // draw() recreates: every node moved goes back to rest at the next frame, and the hits are never touched. `still` stops it for the measures.
 private guideBeats:GuideBeat[]=[];private guideRest=new GuideRest();private guideSince=0;
 guide:{kind:GuideFocus['kind'];ids:string[];wave:string[];pulse:string[];grow:string[];hit:GuideFocus['hit']|null;shake:number;moved:number;still:boolean}={kind:'none',ids:[],wave:[],pulse:[],grow:[],hit:null,shake:0,moved:0,still:false};
 /** C4-2, C4-10 O30: where ✓ and × lie (the chosen discard as drawn, else the placed card); null with no move to confirm. */
 confirmCard:ReturnType<typeof confirmCard>|null=null;
 private guideTick(now:number){const m=this.model,L=this.layout;
  if(!L){this.guideRest.restore();return;}
  const hand=this.hits.filter(h=>h.kind==='hand'),allowed=m.locked?[]:this.hits.filter(h=>(h.kind==='person'||h.kind==='item')&&h.target&&m.allows(h.target)).map(h=>h.id);
  const dest=m.target?this.hits.find(z=>(z.kind==='person'||z.kind==='item')&&z.target?.owner===m.target!.owner&&z.target?.itemIndex===m.target!.itemIndex)?.id??null:null;
  const v=m.view,f=guideFocus({over:v.over||m.eliminated,phase:m.phase,selected:m.selected,target:!!m.target,choosingDiscard:m.choosingDiscard,discard:m.discard,
   hand:hand.map(h=>({key:h.id,regular:regularCard(m.hand.find(c=>c.key===h.key)?.card)})),allowed,dest,preview:this.hits.find(h=>h.kind==='preview')?.id??null,
   waiting:Object.keys(v.players).filter(id=>id!==m.me&&!v.players[id].character.dead&&!v.forfeits[id]),sequence:this.seqStarted?{t:now-this.seqStarted,beats:this.guideBeats}:null});
  if(f.kind!==this.guide.kind)this.guideSince=now;
  const motion=guideMotion(f,{now,since:now-this.guideSince,compact:L.compact,reduced:this.reduced||this.guide.still});
  // The preview shares its id with the hand card it came from: the hit's kind picks the node.
  const nodes=new Map<string,Posable>();for(const h of this.hits)if(!nodes.has(h.id)||h.kind==='preview')nodes.set(h.id,h.node as unknown as Posable);
  this.guideRest.apply(nodes,motion.pose);this.world.x=motion.shake;this.fx.x=motion.shake;
  this.guide={kind:f.kind,ids:f.ids,wave:f.wave,pulse:f.pulse,grow:f.grow,hit:f.hit??null,shake:motion.shake,moved:this.guideRest.moved,still:this.guide.still};}
 /** Verification only: stops (true) or lets go (false) every movement of the guide; the nodes are back at rest at once. */
 guideStill(on:boolean){this.guide.still=on;if(on){this.guideRest.restore();this.world.x=0;this.fx.x=0;this.guide.moved=0;this.guide.shake=0;}}
 private tick(){const now=performance.now(),lastTick=this.lastTick;this.lastTick=now;
   if(this.retired.length)this.retired.splice(0).forEach(c=>c.destroy({children:true}));if(this.retiring.length)[this.retired,this.retiring]=[this.retiring,[]];if(this.measure&&this.tickPrev)this.stats.frames.push(now-this.tickPrev);this.tickPrev=now;
  if(this.aimDirty)this.drawAim();
  // Quiet pulse while arrows are shown; reduced motion keeps them static.
  if(this.arrows.length||this.confirmArrow)this.aimLayer.alpha=this.reduced?1:.88+.12*Math.sin(now/280);
  if(this.inputStart){const start=this.inputStart;this.inputStart=0;requestAnimationFrame(()=>this.stats.inputMs.push(performance.now()-start));}
  if(this.seqStarted&&this.pace){const t=now-this.seqStarted,P=this.pace;if(t>=P.total){this.cue.tick(t);this.finish('complete');}else{
   // Board steps reached (also several at once after a tap): applied, then one redraw.
   let due=0;while(due<this.events.length&&this.events[due].at<=t)due++;if(due){this.events.splice(0,due).forEach(e=>e.run());this.draw();}
   this.cue.tick(t);
   this.flights.forEach(f=>{const d=f.end-f.start,p=(t-f.start)/d;f.node.visible=p>=0&&p<=1;if(!f.node.visible)return;
    if(f.tag&&!f.seen){f.seen=true;const n=this.stats.flown.at(-1);if(n){n.seen[f.tag]++;if(f.also)n.seen[f.also]++;}}
    if(f.appear!==undefined){const a=f.appear,fly=f.fly??.72;
     // Move: (appear at the author,) fly, hit the target, stay through its close-up and changes, then slide to the discard and fade.
     if(p<a){const q=p/a;f.node.position.set(f.from.x,f.from.y);f.node.scale.set(.6+.4*(1-Math.pow(1-q,2)));f.node.rotation=-.12;f.node.alpha=Math.min(1,q*2);return;}
     if(p<=fly){const q=Math.min(1,(p-a)/(fly-a)),eased=1-Math.pow(1-q,2);f.node.scale.set(1);f.node.position.set(f.from.x+(f.to.x-f.from.x)*eased,f.from.y+(f.to.y-f.from.y)*eased-Math.sin(q*Math.PI)*35);f.node.rotation=(1-q)*-.12;f.node.alpha=1;return;}
     const q=(p-fly)/(1-fly),hold=Math.max(0,(q-.35)/.65),to=f.after??f.to;f.node.position.set(f.to.x+(to.x-f.to.x)*hold*hold,f.to.y+(to.y-f.to.y)*hold*hold);if(f.land){f.node.scale.set(1+(f.land-1)*hold);f.node.alpha=1;}else{f.node.scale.set(1-.35*hold);f.node.alpha=1-.85*hold;}return;}
    const eased=1-Math.pow(1-p,2);f.node.position.set(f.from.x+(f.to.x-f.from.x)*eased,f.from.y+(f.to.y-f.from.y)*eased);
    if(f.mode==='rise'){f.node.alpha=1-p*p;}
    else if(f.mode==='shrink'){f.node.scale.set(1-.75*p);f.node.alpha=1-.8*p;}
    else if(f.mode==='break'){f.node.rotation=Math.sin(p*Math.PI*6)*.12*(1-p)+p*.5;f.node.alpha=1-p;}
    else if(f.mode==='vanish'){f.node.scale.set(1-.5*p);f.node.alpha=1-p;}
    else if(f.mode==='pop'){f.node.scale.set(p<.6?.3+1*(p/.6):1.3-.3*((p-.6)/.4));f.node.alpha=Math.min(1,p*3);}
    else{const s0=f.s0??1,s1=f.s1??s0,end=f.fade??.4;f.node.scale.set(s0+(s1-s0)*eased);f.node.alpha=Math.min(1,p*6)*(p>.85?1-(p-.85)/.15*(1-end):1);}});
   this.zooms.forEach(z=>{z.node.visible=t>=z.at&&t<=z.end;if(!z.node.visible)return;
    const q=t<z.at+z.grow?(t-z.at)/z.grow:t<z.hold?1:1-(t-z.hold)/Math.max(1,z.end-z.hold),e=q*q*(3-2*q);
    z.node.position.set(z.rest.x+(z.up.x-z.rest.x)*e,z.rest.y+(z.up.y-z.rest.y)*e);z.node.scale.set(z.rest.s+(z.up.s-z.rest.s)*e);
    if(z.fade)z.fade.alpha=Math.min(1,Math.max(0,q*1.6-.4));});
   this.accents.forEach(x=>{const held=x.label?.first?now-x.label.first<LABEL.read+LABEL.out:false,p=held?Math.min(1,(t-x.at)/x.dur):(t-x.at)/x.dur;x.node.visible=p>=0&&p<=1;if(!x.node.visible)return;
    if(x.kind==='stamp'){x.node.scale.set(p<.2?1.8-.8*(p/.2):1);x.node.alpha=p>.8?1-(p-.8)/.2:1;}
    else if(x.kind==='pop'){const e=t-x.at,settle=LABEL.in+200;x.node.scale.set(e<LABEL.in?.7+.5*(e/LABEL.in):e<settle?1.2-.2*((e-LABEL.in)/200):1);
     // The reading time counts from the frame that really shows it: a frame held back (the first upload of many labels) does not take it away.
     const l=x.label,read=l?.first?now-l.first:0,fading=e>LABEL.in&&read>=LABEL.read;x.node.alpha=fading?Math.max(0,1-(read-LABEL.read)/LABEL.out):1;
     if(l&&fading&&!l.end)l.end=now;if(l&&e>=LABEL.in&&!fading){l.first||=now;l.last=now;l.gap=Math.max(l.gap,lastTick?now-lastTick:0);}}
    else if(x.kind==='shock'){const e=1-(1-p)*(1-p);x.node.scale.set(.2+2.3*e);x.node.alpha=.9*(1-p)*(1-p);}
    else if(x.kind==='impact'){const m=impactMotion(x.impact!,p,this.reduced);x.node.scale.set(m.scale);x.node.alpha=m.alpha;x.node.rotation=m.rot;x.node.y=x.y!+m.dy;}
    else{x.node.scale.set(1+p*1.2);x.node.alpha=1-p;}});
   // C3-5: a seat hit by damage (blow or cut), or eliminated, knocks for a moment; the one hit by a card also darkens and clears; never with reduced motion.
   for(const sh of this.shakes){const h=this.hits.find(z=>z.id===`person-${sh.id}`);if(!h)continue;const q=(t-sh.at)/sh.dur,on=!this.reduced&&q>=0&&q<=1;h.node.x=h.x+(on?Math.sin(q*Math.PI*8)*sh.amp*(1-q):0);
    if(sh.dark){const k=on?(q<.2?q/.2:1-(q-.2)/.8)*.55:0,v=Math.round(255*(1-k));h.node.tint=(v<<16)|(v<<8)|v;if(on)sh.dark.min=Math.min(sh.dark.min,v);}}
  }}
  // C4-10: last, over the nodes as this frame left them (a redraw above recreates them at rest).
  this.guideTick(now);
 }
 startMeasure(){this.stats.frames=[];this.stats.inputMs=[];this.tickPrev=0;this.measure=true;}
 endMeasure(){this.measure=false;return this.stats;}
 destroy(){if(this.seqStarted)this.trace({type:'end',key:this.seqKey,reason:'destroy'});clearTimeout(this.resizeTimer);this.disposeFns.forEach(fn=>fn());[...this.retired,...this.retiring].forEach(c=>c.destroy({children:true}));this.retired=[];this.retiring=[];this.app.destroy(true,{children:true});}
}

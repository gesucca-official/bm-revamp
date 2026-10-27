import {Application,Assets,Container,Graphics,Rectangle,Sprite,Text,Texture} from 'pixi.js';
import {Model,SELF,clone,type Target} from './model.ts';
import type {Card,View} from './contracts.ts';
import fixtures from './fixtures.json';
export type Hit={id:string;kind:'hand'|'person'|'item';x:number;y:number;w:number;h:number;angle:number;key?:string;target?:Target;label:string;node:Container};
export type Inspection={title:string;card?:Card;owner?:string};
type Drag={id:number;key:string;x:number;y:number;lastX:number;lastY:number;moved:boolean;insertion:number|null};
type Flight={node:Container;from:{x:number;y:number};to:{x:number;y:number};start:number;end:number};
const INK=0x30231e, PAPER=0xe8d7b4, PETROL=0x6eafaf, WINE=0x742e33;
export const artIndex=(binding:string)=>{
 if(binding.includes('BigBadBruiser'))return 0;if(binding.includes('ToxicJunkie'))return 1;
 if(binding.includes('BruiserGrab'))return 3;if(binding.includes('LittleSmack'))return 4;if(binding.includes('LittleRage'))return 5;if(binding.endsWith('Glare'))return 6;if(binding.endsWith('Steal'))return 7;
 if(binding.includes('AnotherRottenBeer'))return 9;if(binding.includes('RottenBeer'))return 8;if(binding.includes('CocktailOnTheGround'))return 10;if(binding.includes('MarvelousCocktail'))return 11;return 2;
};
export const subtype=(c:Card)=>c.item?'OGGETTO':c.basicAction?'AZIONE BASE':c.characterBound?'AZIONE LEGATA':c.lastResort?'ULTIMA RISORSA':'AZIONE REGOLARE';
export const cost=(c:Card)=>Object.entries(c.cost).map(([k,v])=>`${v} ${{VIOLENCE:'V',ALERTNESS:'A',TOXICITY:'T',ALCOHOL:'L',HEALTH:'H'}[k]}`).join(' + ')||'—';
export class TableScene {
 app=new Application();world=new Container();fx=new Container();hits:Hit[]=[];backs:Record<string,number>={};
 drag:Drag|null=null;reordering=false;swapKey:string|null=null;reorderOriginal:string[]=[];focused:string|null=null;
 width=0;height=0;art:Texture[]=[];background!:Sprite;pendingGhost:Container|null=null;
 reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;blocked=false;contextLost=false;
 onLayout=()=>{};onInspect=(_v:Inspection)=>{};onState=()=>{};onError=(_v:string)=>{};
 preview={x:0,y:0};stats={cancels:[] as string[],inputMs:[] as number[],frames:[] as number[],sequences:0,sequenceMs:[] as number[],flights:0,transfers:0,aggregateDeltas:0};
 private disposeFns:(()=>void)[]=[];private seqStarted=0;private seqSeen='';private tickPrev=0;private inputStart=0;
 private measure=false;private ghost:Container|null=null;private fittedTitles=new Map<string,string>();private retiring:Container[]=[];private retired:Container[]=[];private seqDuration=1200;private visualSnapshot:View;
 private flights:Flight[]=[];private accents:Container[]=[];private deltas:Container[]=[];
 constructor(readonly model:Model){this.visualSnapshot=clone(model.view);}
 async init(host:HTMLElement){
  await this.app.init({width:host.clientWidth,height:host.clientHeight,backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio,2),autoDensity:true,preference:'webgl'});
  // Native Pointer Events below own all input; avoid a second global Pixi gesture system.
  // Pixi documents null for detaching; its 8.22 declaration omits the nullable type.
  this.app.renderer.events.setTargetElement(null!);
  host.appendChild(this.app.canvas);this.app.canvas.setAttribute('aria-hidden','true');
  const [table,atlas]=await Promise.all([Assets.load('/art/table.webp'),Assets.load('/art/atlas.webp')]);
  for(let i=0;i<12;i++){const cw=atlas.width/4,ch=atlas.height/3;this.art.push(new Texture({source:atlas.source,frame:new Rectangle((i%4)*cw+4,Math.floor(i/4)*ch+4,cw-8,ch-8)}));}
  this.background=new Sprite(table);this.app.stage.addChild(this.background,this.world,this.fx);this.fx.eventMode='none';
  const canvas=this.app.canvas;
  const bind=(target:EventTarget,event:string,fn:EventListener)=>{target.addEventListener(event,fn);this.disposeFns.push(()=>target.removeEventListener(event,fn));};
  bind(host.parentElement!,'pointerup',((e:PointerEvent)=>{if((e.target as HTMLElement)?.closest('button'))this.inputStart=performance.now();}) as EventListener);
  bind(host.parentElement!,'keydown',((e:KeyboardEvent)=>{if(['Enter',' ','i','I','ArrowLeft','ArrowRight'].includes(e.key))this.inputStart=performance.now();}) as EventListener);
  bind(canvas,'pointerdown',((e:PointerEvent)=>this.down(e)) as EventListener);
  bind(canvas,'pointermove',((e:PointerEvent)=>this.move(e)) as EventListener);
  bind(canvas,'pointerup',((e:PointerEvent)=>this.up(e)) as EventListener);
  bind(canvas,'pointercancel',(()=>this.interrupt('pointercancel')) as EventListener);
  bind(canvas,'lostpointercapture',(()=>{if(this.drag)this.interrupt('lost capture');}) as EventListener);
  bind(canvas,'webglcontextlost',((e:Event)=>{e.preventDefault();this.contextLost=true;this.interrupt('context lost');this.onError('Affaccio sul tavolo interrotto. Attendo il ripristino grafico.');}) as EventListener);
  bind(canvas,'webglcontextrestored',(()=>{this.contextLost=false;this.onError('');this.draw();}) as EventListener);
  bind(window,'resize',(()=>{this.interrupt('resize');this.resize(host.clientWidth,host.clientHeight);}) as EventListener);
  if(window.visualViewport)bind(window.visualViewport,'resize',(()=>{this.interrupt('visual viewport / zoom');this.resize(host.clientWidth,host.clientHeight);}) as EventListener);
  bind(window,'blur',(()=>this.interrupt('window blur')) as EventListener);
  bind(document,'visibilitychange',(()=>{if(document.hidden){this.interrupt('background');this.app.stop();}else{this.tickPrev=0;this.app.start();}}) as EventListener);
  const media=matchMedia('(prefers-reduced-motion: reduce)');bind(media,'change',((e:MediaQueryListEvent)=>{this.reduced=e.matches;this.interrupt('reduced motion');}) as EventListener);
  this.disposeFns.push(this.model.subscribe(why=>{const previous=this.visualSnapshot;if(why==='view'||why==='reset'||why==='disconnect'){this.interrupt(why,false);if(why==='reset')this.seqSeen='';this.visualSnapshot=clone(this.model.view);}this.draw();if(why==='view')this.beginSequence(previous);}));
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
  if(fitted!==undefined)title.text=fitted;else{let len=name.length;while(title.height>maxTitle&&len>5){len--;title.text=name.slice(0,len)+'…';}this.fittedTitles.set(fitKey,title.text);}
  if(sub&&!small)this.text(c,sub,0,-h/2+titleH-10,Math.max(7,w*.056),w-12);
  this.text(c,footer,0,h/2-footH+3,small?Math.max(7,w*.085):Math.max(12,w*.10),w-10);return c;}
 private card(c:Card,w:number,h:number,small=false){return this.face(c.name,artIndex(c.bindingName),w,h,c.item?'OGGETTO':`${cost(c)}     P ${c.priority}${c.basicAction||c.characterBound?'   ↻':''}`,small,subtype(c));}
 private back(w:number,h:number){const c=this.frame(w,h);c.addChild(new Graphics().roundRect(-w/2+4,-h/2+4,w-8,h-8,2).fill(WINE).stroke({color:0xa47763,width:1}));
  const g=new Graphics().circle(0,0,w*.2).fill(0xcab184).stroke({color:INK,width:1});g.moveTo(-w*.27,-h*.25).lineTo(w*.27,h*.25).moveTo(w*.27,-h*.25).lineTo(-w*.27,h*.25).stroke({color:0xcab184,width:2});c.addChild(g);return c;}
 private halo(c:Container,w:number,h:number,color=PETROL){c.addChild(new Graphics().roundRect(-w/2-3,-h/2-3,w+6,h+6,6).stroke({color,width:3}));}
 resize(w:number,h:number){this.width=w;this.height=h;this.app.renderer.resize(w,h);this.background.width=w;this.background.height=h;this.draw();}
 draw(){if(!this.art.length)return;
  // Old nodes survive one render, so Pixi's ref-counted text textures are reused instead of re-rasterized on every tap.
  this.retiring.push(...this.world.removeChildren());this.hits=[];this.backs={};this.pendingGhost=null;
  const w=this.width,h=this.height,compact=h<550;const cw=compact?56:Math.min(114,w*.082),ch=cw*1.38,iw=compact?44:cw*.72,ih=iw*1.4;
  const duel=Object.keys(this.model.view.players).length===2;
  const coords:Record<string,[number,number]>={Bice:[duel?.46:.26,.24],Ada:[.72,.24],Nino:[.16,.49],Tito:[.81,.49],Tu:[.18,.77]};
  for(const [id,p] of Object.entries(this.model.view.players)){
   const [px,py]=coords[id]||[.5,.3],x=w*px,y=h*py;
   if(id!==SELF){const count=p.cardsInHand as number;this.backs[id]=count;
    for(let n=0;n<count;n++){const side=id==='Nino'||id==='Tito',bw=compact?24:40,bh=bw*1.4;const b=this.back(bw,bh);b.position.set(side?x+(id==='Nino'?-cw*1.55:cw*1.75):x+(n-(count-1)/2)*bw*.64,side?y+(n-(count-1)/2)*bh*.36:y-ch*.78-bh*.25);b.rotation=side?(id==='Nino'?-1:1)*.25+(n-(count-1)/2)*.10:(n-(count-1)/2)*.13;this.world.addChild(b);}
   }
   const person=this.face(p.character.name,artIndex(p.character.bindingName),cw,ch,'PERSONAGGIO',true);person.position.set(x,y);person.rotation=id===SELF?-.04:.025;this.world.addChild(person);
   const dead=p.character.dead,forfeit=this.model.view.forfeits[id];if(dead||forfeit){person.alpha=.55;this.text(person,dead?'ELIMINATO':'FORFAIT',0,0,compact?11:16,cw,0xffffff);}
   const charHit:Hit={id:`person-${id}`,kind:'person',x,y,w:cw,h:ch,angle:person.rotation,target:{owner:id},label:`${id===SELF?'Tu':id}, ${p.character.name}, salute ${p.character.resources.HEALTH}${dead?', eliminato':forfeit?', forfait':''}`,node:person};this.hits.push(charHit);
   if(this.model.allows({owner:id})&&!this.model.locked)this.halo(person,cw,ch,this.model.target?.owner===id&&this.model.target.itemIndex===undefined?0xf1e4c4:PETROL);
   const rx=x-cw*.98,ry=y-ch*.07,rad=compact?25:43;const coaster=new Container();coaster.position.set(rx,ry);coaster.addChild(new Graphics().circle(0,0,rad).fill(PAPER).stroke({color:0xb18c60,width:2}));this.text(coaster,id===SELF?'TU':id.toUpperCase(),0,-rad*.73,compact?12:18);
   this.text(coaster,`♥ ${p.character.resources.HEALTH??0}`,0,-rad*.11,compact?18:28,undefined,WINE);this.world.addChild(coaster);
   const r=p.character.resources;this.text(this.world,`A ${r.ALERTNESS??0} · V ${r.VIOLENCE??0} · T ${r.TOXICITY??0} · L ${r.ALCOHOL??0}`,rx,y+ch*.48,compact?9:12,undefined,0xf3e8d5);
   const badges=[...p.character.immunities.map(i=>`⊘ ${i==='TOXICITY'?'T':'L'}`),...p.character.statuses.map(s=>`${s.equip?'E':'◆'} ${s.lastsForTurns??'∞'}`),...p.character.timers.map(t=>`◷ ${t.timer}`)];if(badges.length)this.text(this.world,badges.join('  '),x,y+ch*.53,compact?11:13,undefined,0xf3e8d5);
   p.character.items.forEach((item,index)=>{const ix=x+cw*.6+iw*.55+index*(iw+6),iy=y+ch*.10;const c=this.card(item,iw,ih,true);c.position.set(ix,iy);c.rotation=(index-1)*.025;this.world.addChild(c);this.hits.push({id:`item-${id}-${index}`,kind:'item',x:ix,y:iy,w:iw,h:ih,angle:c.rotation,target:{owner:id,itemIndex:index},label:`${item.name}, oggetto di ${id}, copia ${index+1}`,node:c});if(this.model.allows({owner:id,itemIndex:index})&&!this.model.locked)this.halo(c,iw,ih);});
  }
  const n=this.model.hand.length,hw=compact?94:Math.min(164,w*.12),hh=hw*1.38,step=hw*.72,center=w*.635;
  this.model.hand.forEach((local,i)=>{const a=(i-(n-1)/2)*.055,x=center+(i-(n-1)/2)*step,y=h-hh*.58-12+Math.abs(i-(n-1)/2)*3;
   const c=this.card(local.card,hw,hh);c.position.set(x,y);c.rotation=a;this.world.addChild(c);const hit:Hit={id:local.key,kind:'hand',key:local.key,x,y,w:hw,h:hh,angle:a,label:`${local.card.name}, ${subtype(local.card)}, costo ${cost(local.card)}, priorità ${local.card.priority}, copia ${i+1}`,node:c};this.hits.push(hit);
   if(local.key===this.model.selected||local.key===this.focused||local.key===this.swapKey){c.y-=compact?14:24;hit.y=c.y;this.halo(c,hw,hh);this.world.setChildIndex(c,this.world.children.length-1);}
   if(local.key===this.model.discard){this.halo(c,hw,hh,0xdc9699);this.text(c,'SCARTO',0,0,compact?14:22,hw,WINE);}
   if(this.model.selectedCard?.characterBound&&this.model.target&&local.key!==this.model.selected&&(local.card.basicAction||local.card.characterBound||local.card.lastResort))c.alpha=.55;
  });
  this.preview={x:w*.515,y:h*.48};
  if(this.model.selectedCard&&this.model.target){const pc=this.card(this.model.selectedCard,compact?70:100,compact?98:140);pc.position.set(this.preview.x,this.preview.y);pc.rotation=-.10;this.halo(pc,compact?70:100,compact?98:140);this.world.addChild(pc);this.pendingGhost=pc;
   const dest=this.hits.find(z=>z.target?.owner===this.model.target!.owner&&z.target?.itemIndex===this.model.target!.itemIndex);if(dest){this.world.addChild(new Graphics().moveTo(this.preview.x,this.preview.y-35).quadraticCurveTo(this.preview.x,dest.y,dest.x,dest.y).stroke({color:PETROL,width:2,alpha:.8}));}
  }
  if(this.model.phase==='sending'||this.model.phase==='uncertain')this.world.alpha=.86;else this.world.alpha=1;
  this.onLayout();
 }
 hit(x:number,y:number,targetsOnly=false){return [...this.hits].sort((a,b)=>this.world.getChildIndex(b.node)-this.world.getChildIndex(a.node)).find(r=>{if(targetsOnly&&r.kind==='hand')return false;const dx=x-r.x,dy=y-r.y,c=Math.cos(-r.angle),s=Math.sin(-r.angle);return Math.abs(dx*c-dy*s)<=r.w/2&&Math.abs(dx*s+dy*c)<=r.h/2;});}
 point(e:PointerEvent){const r=this.app.canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
 down(e:PointerEvent){if(this.blocked||this.contextLost||e.button!==0)return;this.inputStart=performance.now();const p=this.point(e),hit=this.hit(p.x,p.y);if(!hit)return;
  this.stopEffects();if(hit.kind==='hand'&&!this.model.locked){this.drag={id:e.pointerId,key:hit.key!,x:p.x,y:p.y,lastX:p.x,lastY:p.y,moved:false,insertion:null};this.app.canvas.setPointerCapture(e.pointerId);this.focus(hit.key!);}else this.activate(hit.id);}
 move(e:PointerEvent){if(!this.drag||this.drag.id!==e.pointerId)return;const p=this.point(e),d=this.drag;d.lastX=p.x;d.lastY=p.y;if(!d.moved&&Math.hypot(p.x-d.x,p.y-d.y)>8){d.moved=true;this.model.select(d.key);this.drawGhost(d.key);}
  if(!d.moved)return;if(this.ghost)this.ghost.position.set(p.x,p.y);d.insertion=p.y>this.height*.68?this.indexAt(p.x):null;
  for(const hit of this.hits.filter(x=>x.kind==='hand')){hit.node.x=hit.x;if(d.insertion!==null){const idx=this.model.hand.findIndex(c=>c.key===hit.key);hit.node.x+=idx>=d.insertion?7:-7;}}
 }
 private indexAt(x:number){const hs=this.hits.filter(h=>h.kind==='hand');let i=hs.findIndex(h=>x<h.x);return i<0?hs.length-1:i;}
 private drawGhost(key:string){this.clearGhost();const c=this.model.hand.find(x=>x.key===key);if(!c)return;this.ghost=this.card(c.card,this.height<550?94:150,this.height<550?130:207);this.ghost.alpha=.92;this.ghost.rotation=-.08;this.fx.addChild(this.ghost);}
 private clearGhost(){if(this.ghost){this.ghost.destroy({children:true});this.ghost=null;}}
 up(e:PointerEvent){const d=this.drag;if(!d||d.id!==e.pointerId)return;this.drag=null;this.clearGhost();if(this.app.canvas.hasPointerCapture(e.pointerId))this.app.canvas.releasePointerCapture(e.pointerId);
  const p=this.point(e);if(!d.moved){this.activate(d.key);return;}
  const target=this.hit(p.x,p.y,true);
  // Own objects can share the lower band with the fan: a compatible physical target wins.
  if(!this.reordering&&target?.target&&this.model.allows(target.target))this.model.aim(target.target);
  else if(d.insertion!==null&&p.x>this.width*.25&&p.x<this.width*.98){const keys=this.model.hand.map(x=>x.key).filter(k=>k!==d.key);keys.splice(d.insertion,0,d.key);this.model.cancel();this.model.reorder(keys);}
  else this.model.cancel();this.draw();}
 activate(id:string){if(this.blocked||this.contextLost||this.height>this.width)return;this.inputStart=performance.now();const hit=this.hits.find(h=>h.id===id);if(!hit)return;
  if(hit.kind==='hand'){if(this.model.locked){this.inspect(id);return;}if(this.reordering){if(!this.swapKey){this.swapKey=hit.key!;}else{const keys=this.model.hand.map(x=>x.key),a=keys.indexOf(this.swapKey),b=keys.indexOf(hit.key!);[keys[a],keys[b]]=[keys[b],keys[a]];this.model.reorder(keys);this.reordering=false;this.swapKey=null;}this.draw();this.onState();}else{this.model.select(hit.key!);}}
  else if(this.model.selected&&!this.model.locked){this.model.aim(hit.target!);}else this.inspect(id);
 }
 inspect(id:string){const hit=this.hits.find(h=>h.id===id);if(!hit)return;if(hit.kind==='hand'){const card=this.model.hand.find(x=>x.key===hit.key)!.card;this.onInspect({title:card.name,card});}
  else if(hit.kind==='item'){const card=this.model.view.players[hit.target!.owner].character.items[hit.target!.itemIndex!];this.onInspect({title:card.name,card,owner:hit.target!.owner});}
  else this.onInspect({title:this.model.view.players[hit.target!.owner].character.name,owner:hit.target!.owner});}
 reorder(){if(this.model.locked)return;if(this.reordering){this.interrupt('reorder cancelled');return;}this.model.cancel();this.reordering=true;this.swapKey=null;this.reorderOriginal=this.model.hand.map(x=>x.key);this.draw();this.onState();}
 key(id:string,e:KeyboardEvent){if(e.key==='i'||e.key==='I'){e.preventDefault();this.inspect(id);}else if(this.reordering&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const keys=this.model.hand.map(c=>c.key),i=keys.indexOf(this.swapKey||id);if(i<0)return;this.swapKey=keys[i];const j=Math.max(0,Math.min(keys.length-1,i+(e.key==='ArrowRight'?1:-1)));[keys[i],keys[j]]=[keys[j],keys[i]];this.model.reorder(keys);this.draw();}else if(this.reordering&&e.key==='Enter'&&this.swapKey){e.preventDefault();this.reordering=false;this.swapKey=null;this.onState();this.draw();}}
 focus(id:string|null){this.focused=id;this.draw();}
 interrupt(reason:string,redraw=true){if(this.drag||this.seqStarted||this.reordering)this.stats.cancels.push(reason);const d=this.drag;this.drag=null;if(d&&this.app.canvas.hasPointerCapture(d.id))this.app.canvas.releasePointerCapture(d.id);this.clearGhost();this.stopEffects();
  if(this.reordering){this.reordering=false;this.swapKey=null;this.model.reorder(this.reorderOriginal);}if(d)this.model.cancel();if(redraw)this.draw();this.onState();}
 escape(){this.interrupt('escape');this.model.cancel();}
 beginSequence(previous:View){
  const v=this.model.view,k=`${v.gameId}/${v.turn}`;
  if(this.seqSeen===k||!v.resolvedMoves.length)return;this.seqSeen=k;
  if(this.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches||document.hidden||this.contextLost)return;
  // Only published identities and ordered moves are animated. Resources already use the final view.
  const registry=Object.values(fixtures.cards) as Card[];
  const seat=(id:string)=>this.hits.find(h=>h.id===`person-${id}`);
  v.resolvedMoves.forEach((move,i)=>{
   const card=registry.find(c=>c.name===move.playedCardName),from=seat(move.playerId),to=seat(move.targetId==='SELF'?move.playerId:move.targetId);
   if(!card||!from||!to)return;
   const node=this.card(card,this.height<550?52:80,this.height<550?72:112);node.visible=false;this.fx.addChild(node);
   const start=i*.7/v.resolvedMoves.length,end=(i+1)*.7/v.resolvedMoves.length;
   this.flights.push({node,from,to,start,end});this.stats.flights++;
   const accent=new Graphics().circle(0,0,24).stroke({color:PETROL,width:4});accent.position.set(to.x,to.y);accent.visible=false;this.fx.addChild(accent);this.accents.push(accent);
  });
  // A visible count decrease and increase of the same object is enough for an aggregate transfer.
  // No instance identity or hidden draws are inferred; ambiguous sources are not animated.
  const counts=(view:View,name:string,id:string)=>view.players[id]?.character.items.filter(c=>c.name===name).length||0;
  const objects=registry.filter(c=>c.item);
  for(const object of objects){const lost=Object.keys(v.players).filter(id=>counts(previous,object.name,id)>counts(v,object.name,id));const gained=Object.keys(v.players).filter(id=>counts(previous,object.name,id)<counts(v,object.name,id));
   if(lost.length===1&&gained.length===1){const from=seat(lost[0]),to=seat(gained[0]);if(from&&to){const node=this.card(object,this.height<550?44:65,this.height<550?62:91);node.visible=false;this.fx.addChild(node);this.flights.push({node,from,to,start:.2,end:.65});this.stats.transfers++;}}
  }
  for(const [id,p] of Object.entries(v.players)){const health=p.character.resources.HEALTH,old=previous.players[id]?.character.resources.HEALTH,pos=seat(id);if(health!==undefined&&old!==undefined&&health!==old&&pos){const n=health-old;const label=this.text(this.fx,`${n>0?'+':''}${n} · totale turno`,pos.x,pos.y-30,this.height<550?12:17,undefined,0xffefdb);label.visible=false;this.deltas.push(label);this.stats.aggregateDeltas++;}}
  this.seqStarted=performance.now();this.stats.sequences++;
 }
 stopEffects(){if(this.seqStarted)this.stats.sequenceMs.push(performance.now()-this.seqStarted);this.seqStarted=0;this.flights=[];this.accents=[];this.deltas=[];this.fx.removeChildren().forEach(c=>c.destroy({children:true}));this.ghost=null;}
 private tick(){const now=performance.now();
   if(this.retired.length)this.retired.splice(0).forEach(c=>c.destroy({children:true}));if(this.retiring.length)[this.retired,this.retiring]=[this.retiring,[]];if(this.measure&&this.tickPrev)this.stats.frames.push(now-this.tickPrev);this.tickPrev=now;
  if(this.inputStart){const start=this.inputStart;this.inputStart=0;requestAnimationFrame(()=>this.stats.inputMs.push(performance.now()-start));}
  if(this.seqStarted){const t=(now-this.seqStarted)/this.seqDuration;if(t>=1)this.stopEffects();else{
   this.flights.forEach(f=>{const p=(t-f.start)/(f.end-f.start);f.node.visible=p>=0&&p<=1;if(f.node.visible){const eased=1-Math.pow(1-p,2);f.node.position.set(f.from.x+(f.to.x-f.from.x)*eased,f.from.y+(f.to.y-f.from.y)*eased-Math.sin(p*Math.PI)*35);f.node.rotation=(1-p)*-.12;}});
   this.accents.forEach((node,i)=>{const end=(i+1)*.7/Math.max(1,this.model.view.resolvedMoves.length),p=(t-end)/.13;node.visible=p>=0&&p<=1;node.scale.set(1+Math.max(0,p));node.alpha=1-Math.max(0,p);});
   this.deltas.forEach(node=>{node.visible=t>=.7;node.alpha=Math.min(1,(1-t)/.12);});
  }}
 }
 startMeasure(){this.stats.frames=[];this.stats.inputMs=[];this.tickPrev=0;this.measure=true;}
 endMeasure(){this.measure=false;return this.stats;}
 destroy(){this.disposeFns.forEach(fn=>fn());[...this.retired,...this.retiring].forEach(c=>c.destroy({children:true}));this.retired=[];this.retiring=[];this.app.destroy(true,{children:true});}
}

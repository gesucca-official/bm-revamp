import type {RoundSound,HitCue} from './resolution.ts';
export type {RoundSound};
export type SoundEvent='select'|'send'|'reject'|'win'|'loss'|RoundSound;
const FILES:Record<SoundEvent,string>={select:'click_001.ogg',send:'confirmation_001.ogg',reject:'error_001.ogg',hit:'impactPunch_heavy_001.ogg',cut:'knifeSlice.ogg',win:'jingles_SAX10.ogg',loss:'jingles_SAX07.ogg'};
export const SOUND_FILES:Readonly<Record<SoundEvent,string>>=FILES;
/** The parts of Web Audio the sounds use (C4-7-bis): one context, one master gain, a new buffer source per sound. */
export type SourceLike={buffer:unknown;connect:(node:unknown)=>unknown;start:(when?:number)=>void;stop:()=>void;onended:(()=>void)|null};
export type GainLike={gain:{value:number;setValueAtTime:(v:number,t:number)=>unknown;linearRampToValueAtTime:(v:number,t:number)=>unknown};connect:(node:unknown)=>unknown;disconnect?:()=>void};
export type ContextLike={currentTime:number;state:string;destination:unknown;resume:()=>Promise<void>;createGain:()=>GainLike;createBufferSource:()=>SourceLike;createBuffer:(channels:number,length:number,rate:number)=>unknown;decodeAudioData:(data:ArrayBuffer)=>Promise<unknown>};
export type AudioBackend={context:()=>ContextLike|null;load:(url:string)=>Promise<ArrayBuffer>};
type StorageLike={getItem:(key:string)=>string|null;setItem:(key:string,value:string)=>void};
const KEY='bm.sound.v1';
/**
 * Optional local feedback: failed storage, context, loading, decoding and playback never reach the game (rule 13).
 * Without a context, before a real gesture or while the context is not running nothing plays and nothing is queued.
 */
export class Sounds {
 volume=.2;muted=false;private unlocked=false;private ctx:ContextLike|null=null;private master:GainLike|null=null;private buffers:Partial<Record<SoundEvent,unknown>>={};
 private active=new Set<SourceLike>();private roundSources=new Set<SourceLike>();private seen=new Set<string>();private activeRound:string|null=null;private generation=0;
 readonly counts:Record<SoundEvent,number>={select:0,send:0,reject:0,hit:0,cut:0,win:0,loss:0};
 private storage:StorageLike|null;
 constructor(storage:StorageLike|null=null,backend?:AudioBackend){this.storage=storage;
  try{const p=JSON.parse(storage?.getItem(KEY)??'null');if(p&&typeof p.volume==='number'&&Number.isFinite(p.volume))this.volume=Math.max(0,Math.min(1,p.volume));if(p&&typeof p.muted==='boolean')this.muted=p.muted;}catch{}
  if(!backend)return;
  try{const ctx=backend.context();if(!ctx)return;const master=ctx.createGain();master.connect(ctx.destination);this.ctx=ctx;this.master=master;this.applyGain();
   // Local files only, decoded once in the background: a missing or undecodable file stays silent.
   for(const k of Object.keys(FILES) as SoundEvent[])try{void backend.load(`/audio/${FILES[k]}`).then(data=>ctx.decodeAudioData(data)).then(buffer=>{this.buffers[k]=buffer;},()=>{});}catch{}
  }catch{this.ctx=null;this.master=null;}
 }
 get ready(){return !!this.ctx&&this.ctx.state==='running'&&this.unlocked;}
 /** Each real gesture: resume the context (iOS suspends it) and, the first time, play one silent sample inside the gesture. Never awaited. */
 unlock(){const c=this.ctx;if(!c)return;
  try{if(c.state!=='running')void Promise.resolve(c.resume()).catch(()=>{});}catch{}
  if(this.unlocked)return;this.unlocked=true;
  try{const s=c.createBufferSource();s.buffer=c.createBuffer(1,1,22050);s.connect(c.destination);s.start(0);}catch{}}
 private applyGain(){try{if(this.master)this.master.gain.value=this.muted?0:this.volume;}catch{}}
 private save(){try{this.storage?.setItem(KEY,JSON.stringify({volume:this.volume,muted:this.muted}));}catch{}}
 setVolume(value:number){if(!Number.isFinite(value))return;this.volume=Math.max(0,Math.min(1,value));this.save();this.applyGain();}
 setMuted(value:boolean){this.muted=value;this.save();this.applyGain();if(value){if(this.activeRound)this.seen.add(this.activeRound);this.stopAll();}}
 play(kind:SoundEvent,scale=1):SourceLike|null{if(!this.unlocked||this.muted||this.volume===0)return null;const c=this.ctx,master=this.master,buffer=this.buffers[kind];
  if(!c||!master||!buffer||c.state!=='running')return null;
  let s:SourceLike|null=null,g:GainLike|null=null;
  try{s=c.createBufferSource();s.buffer=buffer;g=c.createGain();g.gain.value=scale*(kind==='cut'?0.61:1);s.connect(g);g.connect(master);const t=c.currentTime;
   if(kind==='send'){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(scale,t+.005);}
   const source=s,gain=g;s.onended=()=>{this.active.delete(source);this.roundSources.delete(source);try{gain.disconnect?.();}catch{}};
   this.active.add(s);s.start(t);this.counts[kind]++;return s;
  }catch{if(s){this.active.delete(s);try{s.stop();}catch{}}try{g?.disconnect?.();}catch{}return null;}}

 defer(kind:SoundEvent){const generation=this.generation;queueMicrotask(()=>{if(generation===this.generation)this.play(kind);});}
 beginRound(key:string){this.activeRound=key;}
 endRound(stop=true){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;if(stop)this.stopAll();}
 round(key:string,kind:RoundSound,id=kind as string,scale=1){const event=`${key}/${id}`;
  if(this.activeRound!==key||this.seen.has(key)||this.seen.has(event))return false;this.seen.add(event);
  const source=this.event({id:event,scope:'hit',key,kind,scale},kind,scale);if(source)this.roundSources.add(source);return true;}
 /** Probe metadata exists only during the synchronous source start; failures consume the event too. */
 event(meta:Record<string,unknown>,kind:SoundEvent,scale=1){audioTrace({type:'event',...meta,available:this.ready&&!this.muted&&this.volume>0&&!!this.buffers[kind]});
  const w=globalThis as unknown as {__bmAudioEvent?:Record<string,unknown>};w.__bmAudioEvent=meta;try{return this.play(kind,scale);}finally{delete w.__bmAudioEvent;}}
 stopRound(){for(const s of this.roundSources)try{s.stop();}catch{}this.roundSources.clear();}
 /** C4-11 J2 (owner, 10 November 2026: «va bene la correzione j2»): an interruption (resize, Safari's bar, pointercancel, Esc, a new view) stops
  * and consumes the round's hits only, sounding or still to come; the outcome jingle and the interface sounds play on, and the deferred ones
  * (select, send, reject) are not cancelled. «Salta effetti», leaving the table, background, disconnection, reset and mute still stop everything. */
 interruptRound(){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;this.stopRound();}
 stopAll(){this.generation++;audioTrace({type:'stop-all'});for(const s of this.active)try{s.stop();}catch{}this.active.clear();this.roundSources.clear();}

}
let shared:Sounds|null=null;
/** One context and one set of decoded buffers for the whole page: every table reuses them. */
export function browserSounds(){if(shared)return shared;let storage:StorageLike|null=null;try{storage=window.localStorage;}catch{}
 // Safari: an ambient session follows the silent switch and mixes with other apps' audio (owner, C4-7-bis).
 try{const session=(navigator as unknown as {audioSession?:{type:string}}).audioSession;if(session&&'type' in session)session.type='ambient';}catch{}
 const backend:AudioBackend={context:()=>{const w=window as unknown as {AudioContext?:new()=>ContextLike;webkitAudioContext?:new()=>ContextLike};const C=w.AudioContext??w.webkitAudioContext;return C?new C():null;},
  load:url=>fetch(url).then(r=>{if(!r.ok)throw Error(`${r.status}`);return r.arrayBuffer();})};
 return shared=new Sounds(storage,backend);}
export function audioTrace(e:Record<string,unknown>){try{(globalThis as unknown as {__bmAudioTrace?:(e:Record<string,unknown>)=>void}).__bmAudioTrace?.(e);}catch{}}
/** Per-hit clock. A tap consumes every crossed hit in one normalized group; a close never recovers pending hits. */
export class RoundCue {
 private cues:HitCue[]=[];private key='';private sounds:{round:(key:string,kind:RoundSound,id:string,scale:number)=>boolean};
 constructor(sounds:{round:(key:string,kind:RoundSound,id:string,scale:number)=>boolean}){this.sounds=sounds;}
 arm(key:string,cues:HitCue[]){this.key=key;this.cues=[...cues];}
 get pending(){return this.cues;}
 tick(elapsed:number){this.fire(elapsed,'time');}
 advance(next:number,_total:number){this.fire(next,'tap');}
 end(_reason:string){this.cues=[];}
 private fire(at:number,reason:string){const due=this.cues.filter(c=>c.at<=at);this.cues=this.cues.filter(c=>c.at>at);
  for(const c of due){audioTrace({type:'reach',key:this.key,move:c.move,kind:c.kind,reason,at,scale:1/due.length});this.sounds.round(this.key,c.kind,String(c.move),1/due.length);}}
}
/** C4-11 J2: what the end of a sequence does to the sound, by the reason it ended. A natural end or the player's own input lets a sound already
 * started play on; «Salta effetti» stops everything; any other reason is an interruption and stops the round's hits only. */
export type EndSound='keep'|'round'|'all';
export const endSound=(reason:string):EndSound=>reason==='complete'||reason==='input'?'keep':reason==='skip'?'all':'round';
export type OutcomeState={gameId:string;me:string;finished:boolean;winner:string|null;generation:number};
/** Personal outcome survives watch/repeated views. Initial/recovered/hidden outcomes are consumed silently. */
export class OutcomeSounds {
 private previous:OutcomeState;private consumed=new Set<string>();private recovering=false;private pending:{id:string;kind:'win'|'loss'}|null=null;
 private sounds:Pick<Sounds,'event'>;
 constructor(sounds:Pick<Sounds,'event'>,initial:OutcomeState){this.sounds=sounds;this.previous=initial;if(initial.finished)this.consumed.add(this.key(initial));}
 private key(s:OutcomeState){return `${s.gameId}/${s.me}`;}
 change(why:string,next:OutcomeState,live:boolean){const old=this.previous;this.previous=next;
  if(why==='disconnect'){this.recovering=true;this.pending=null;return;}
  if(why!=='view'&&why!=='reset')return;
  const historical=this.recovering||why==='reset'||old.generation!==next.generation||old.gameId!==next.gameId;this.recovering=false;
  if(!next.finished||this.consumed.has(this.key(next)))return;
  const id=this.key(next);this.consumed.add(id);const kind=next.winner===next.me?'win':'loss';
  audioTrace({type:'panel-plan',id,kind,live:live&&!historical&&!old.finished});
  if(live&&!historical&&!old.finished)this.pending={id,kind};}
 commit(panel:boolean){const cue=this.pending;this.pending=null;if(cue&&panel){audioTrace({type:'panel',...cue});this.sounds.event({scope:'outcome',...cue},cue.kind);}}
 cancel(){this.pending=null;}
}
/** Model notifications are not themselves events: only transitions count. */
export class ChoiceSounds {
 private selected:string|null;private commands:number;private sounds:Sounds;
 constructor(sounds:Sounds,initial:{selected:string|null;commandCount:number}){this.sounds=sounds;this.selected=initial.selected;this.commands=initial.commandCount;}
 change(why:string,state:{selected:string|null;commandCount:number}){
  if(why==='choice'&&state.selected&&state.selected!==this.selected)this.sounds.defer('select');
  if(why==='choice'&&state.commandCount>this.commands)this.sounds.defer('send');
  if(why==='feedback')this.sounds.defer('reject');
  this.selected=state.selected;this.commands=state.commandCount;
 }
}

import type {RoundSound} from './resolution.ts';
export type {RoundSound};
export type SoundEvent='select'|'send'|'reject'|RoundSound;
const FILES:Record<SoundEvent,string>={select:'click_001.ogg',send:'confirmation_001.ogg',reject:'error_001.ogg',impact:'drop_004.ogg',win:'jingles_SAX10.ogg',loss:'jingles_SAX07.ogg'};
export const SOUND_FILES:Readonly<Record<SoundEvent,string>>=FILES;
/** The parts of Web Audio the sounds use (C4-7-bis): one context, one master gain, a new buffer source per sound. */
export type SourceLike={buffer:unknown;connect:(node:unknown)=>unknown;start:(when?:number)=>void;stop:()=>void;onended:(()=>void)|null};
export type GainLike={gain:{value:number};connect:(node:unknown)=>unknown};
export type ContextLike={state:string;destination:unknown;resume:()=>Promise<void>;createGain:()=>GainLike;createBufferSource:()=>SourceLike;createBuffer:(channels:number,length:number,rate:number)=>unknown;decodeAudioData:(data:ArrayBuffer)=>Promise<unknown>};
export type AudioBackend={context:()=>ContextLike|null;load:(url:string)=>Promise<ArrayBuffer>};
type StorageLike={getItem:(key:string)=>string|null;setItem:(key:string,value:string)=>void};
const KEY='bm.sound.v1';
/**
 * Optional local feedback: failed storage, context, loading, decoding and playback never reach the game (rule 13).
 * Without a context, before a real gesture or while the context is not running nothing plays and nothing is queued.
 */
export class Sounds {
 volume=.2;muted=false;private unlocked=false;private ctx:ContextLike|null=null;private master:GainLike|null=null;private buffers:Partial<Record<SoundEvent,unknown>>={};
 private active=new Set<SourceLike>();private roundSource:SourceLike|null=null;private seen=new Set<string>();private activeRound:string|null=null;private generation=0;
 readonly counts:Record<SoundEvent,number>={select:0,send:0,reject:0,impact:0,win:0,loss:0};
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
 play(kind:SoundEvent):SourceLike|null{if(!this.unlocked||this.muted||this.volume===0)return null;const c=this.ctx,master=this.master,buffer=this.buffers[kind];
  if(!c||!master||!buffer||c.state!=='running')return null;
  try{const s=c.createBufferSource();s.buffer=buffer;s.connect(master);s.onended=()=>{this.active.delete(s);if(this.roundSource===s)this.roundSource=null;};this.active.add(s);this.counts[kind]++;s.start(0);return s;}catch{return null;}}
 defer(kind:SoundEvent){const generation=this.generation;queueMicrotask(()=>{if(generation===this.generation)this.play(kind);});}
 beginRound(key:string){this.activeRound=key;}
 /** The sequence is over: its sound can no longer start. `stop` also silences one already playing (jump, interruption). */
 endRound(stop=true){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;if(stop)this.stopRound();else this.roundSource=null;}
 round(key:string,kind:RoundSound){if(this.activeRound!==key||this.seen.has(key))return false;this.seen.add(key);this.roundSource=this.play(kind);return true;}
 stopRound(){const s=this.roundSource;this.roundSource=null;if(s)try{s.stop();}catch{}}
 stopAll(){this.generation++;for(const s of this.active)try{s.stop();}catch{}this.active.clear();this.roundSource=null;}
}
let shared:Sounds|null=null;
/** One context and one set of decoded buffers for the whole page: every table reuses them. */
export function browserSounds(){if(shared)return shared;let storage:StorageLike|null=null;try{storage=window.localStorage;}catch{}
 // Safari: an ambient session follows the silent switch and mixes with other apps' audio (owner, C4-7-bis).
 try{const session=(navigator as unknown as {audioSession?:{type:string}}).audioSession;if(session&&'type' in session)session.type='ambient';}catch{}
 const backend:AudioBackend={context:()=>{const w=window as unknown as {AudioContext?:new()=>ContextLike;webkitAudioContext?:new()=>ContextLike};const C=w.AudioContext??w.webkitAudioContext;return C?new C():null;},
  load:url=>fetch(url).then(r=>{if(!r.ok)throw Error(`${r.status}`);return r.arrayBuffer();})};
 return shared=new Sounds(storage,backend);}
/**
 * C4-7-bis: the one sequence sound of a round (impact, or the outcome that replaces it) against the sequence clock. Reached
 * by the time, or by a tap that reaches or jumps over it, it plays then, once. A sequence closed by a tap or by a chosen card
 * still sounds its outcome at that moment (owner's choice); a jump, an interruption, the background or a drop drop it.
 */
export class RoundCue {
 private cue:{at:number;kind:RoundSound}|null=null;private key='';private readonly sounds:{round:(key:string,kind:RoundSound)=>boolean};
 constructor(sounds:{round:(key:string,kind:RoundSound)=>boolean}){this.sounds=sounds;}
 arm(key:string,cue:{at:number;kind:RoundSound}|null){this.key=key;this.cue=cue;}
 get pending(){return this.cue;}
 tick(elapsed:number){if(this.cue&&elapsed>=this.cue.at)this.fire();}
 /** A tap moves the sequence to `next` (its end when `next >= total`). */
 advance(next:number,total:number){if(this.cue&&(this.cue.at<=next||next>=total))this.fire();}
 end(reason:string){if(this.cue&&reason==='input'&&this.cue.kind!=='impact')this.fire();this.cue=null;}
 private fire(){const c=this.cue!;this.cue=null;this.sounds.round(this.key,c.kind);}
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

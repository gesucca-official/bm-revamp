export type SoundEvent='select'|'send'|'reject'|'impact'|'outcome';
const FILES:Record<SoundEvent,string>={select:'click_001.ogg',send:'confirmation_001.ogg',reject:'error_001.ogg',impact:'drop_004.ogg',outcome:'confirmation_002.ogg'};
type Clip={volume:number;muted:boolean;currentTime:number;preload:string;load:()=>void;play:()=>Promise<void>;pause:()=>void};
type StorageLike={getItem:(key:string)=>string|null;setItem:(key:string,value:string)=>void};
const KEY='bm.sound.v1';
/** Optional local feedback: failed storage and media operations never reach the game. */
export class Sounds {
 volume=.2;muted=false;private unlocked=false;private clips:Partial<Record<SoundEvent,Clip>>={};private seen=new Set<string>();private roundPlaying:SoundEvent|null=null;private activeRound:string|null=null;private generation=0;
 readonly counts:Record<SoundEvent,number>={select:0,send:0,reject:0,impact:0,outcome:0};
 private storage:StorageLike|null;
 constructor(storage:StorageLike|null=null,make?:(url:string)=>Clip){this.storage=storage;
  try{const p=JSON.parse(storage?.getItem(KEY)??'null');if(p&&typeof p.volume==='number'&&Number.isFinite(p.volume))this.volume=Math.max(0,Math.min(1,p.volume));if(p&&typeof p.muted==='boolean')this.muted=p.muted;}catch{}
  if(make)for(const k of Object.keys(FILES) as SoundEvent[])try{const clip=make(`/audio/${FILES[k]}`);clip.preload='auto';clip.load();this.clips[k]=clip;}catch{}
 }
 unlock(){if(this.unlocked)return;this.unlocked=true;for(const clip of Object.values(this.clips)){if(!clip)continue;try{const was=clip.muted;clip.muted=true;try{void Promise.resolve(clip.play()).catch(()=>{});clip.pause();}finally{clip.muted=was;}}catch{}}}
 private save(){try{this.storage?.setItem(KEY,JSON.stringify({volume:this.volume,muted:this.muted}));}catch{}}
 setVolume(value:number){if(!Number.isFinite(value))return;this.volume=Math.max(0,Math.min(1,value));this.save();for(const c of Object.values(this.clips))try{if(c)c.volume=this.volume;}catch{}}
 setMuted(value:boolean){this.muted=value;this.save();if(value){if(this.activeRound)this.seen.add(this.activeRound);this.stopAll();}}
 play(kind:SoundEvent){if(!this.unlocked||this.muted||this.volume===0)return;try{const clip=this.clips[kind];if(!clip)return;clip.volume=this.volume;clip.currentTime=0;this.counts[kind]++;void Promise.resolve(clip.play()).catch(()=>{});}catch{}}
 defer(kind:SoundEvent){const generation=this.generation;queueMicrotask(()=>{if(generation===this.generation)this.play(kind);});}
 beginRound(key:string){this.activeRound=key;}
 endRound(){if(this.activeRound)this.seen.add(this.activeRound);this.activeRound=null;this.stopRound();}
 round(key:string,kind:'impact'|'outcome'){if(this.activeRound!==key||this.seen.has(key))return false;this.seen.add(key);this.roundPlaying=kind;this.play(kind);return true;}
 stopRound(){if(this.roundPlaying){try{this.clips[this.roundPlaying]?.pause();}catch{}this.roundPlaying=null;}}
 stopAll(){this.generation++;for(const c of Object.values(this.clips))try{c?.pause();}catch{}this.roundPlaying=null;}
}
export function browserSounds(){let storage:StorageLike|null=null;try{storage=window.localStorage;}catch{}return new Sounds(storage,url=>new Audio(url));}
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

import type {Card, View, Command, Move} from './contracts.ts';
export type LocalCard = {key:string; card:Card};
export type Target = {owner:string; itemIndex?:number};
export type Change = 'choice'|'view'|'reset'|'disconnect'|'feedback';
export const SELF = 'Tu';
export const clone = <T>(v:T):T => structuredClone(v);
export const regular = (c:Card) => !c.item && !c.basicAction && !c.characterBound && !c.lastResort;
export function reconcile(old:LocalCard[], cards:Card[], nextId:()=>string):LocalCard[] {
  const remaining=cards.map(card=>({card,used:false}));
  const kept=old.flatMap(local=>{const found=remaining.find(x=>!x.used && x.card.name===local.card.name && x.card.bindingName===local.card.bindingName); if(!found)return [];found.used=true;return [{key:local.key,card:found.card}];});
  return kept.concat(remaining.filter(x=>!x.used).map(x=>({key:nextId(),card:x.card})));
}
export class Model {
  view:View; hand:LocalCard[]=[]; selected:string|null=null; target:Target|null=null; discard:string|null=null;
  phase:'choose'|'sending'|'pending'|'uncertain'='choose'; message='Scegli una carta'; generation=1;
  commandCount=0; lastCommand:Command|null=null; sequence=0; readonly history:Command[]=[];
  private serial=0; private listeners=new Set<(why:Change)=>void>();
  constructor(view:View){this.view=clone(view);this.receive(view,this.generation,true);}
  subscribe(fn:(why:Change)=>void){this.listeners.add(fn);return ()=>{this.listeners.delete(fn);};}
  emit(why:Change='choice'){this.listeners.forEach(fn=>fn(why));}
  get selectedCard(){return this.hand.find(x=>x.key===this.selected)?.card;}
  get locked(){return this.phase!=='choose'||this.view.over||!!this.view.forfeits[SELF]||this.view.players[SELF].character.dead;}
  clear(){this.selected=null;this.target=null;this.discard=null;}
  cancel(){if(this.phase==='choose'){this.clear();this.message='Scegli una carta';this.emit();}}
  select(key:string){if(this.locked)return; const local=this.hand.find(x=>x.key===key); if(!local)return;
    if(this.selectedCard?.characterBound && this.target && key!==this.selected){if(!regular(local.card))return;this.discard=key;this.message='Scarto scelto. Conferma la calata';}
    else{this.selected=key;this.target=null;this.discard=null;this.message='Scegli il bersaglio sul tavolo';}this.emit();}
  allows(target:Target){const card=this.selectedCard; const p=this.view.players[target.owner];if(!card||!p||p.character.dead||this.view.forfeits[target.owner])return false;
    const own=target.owner===SELF;
    if(target.itemIndex!==undefined)return !!p.character.items[target.itemIndex]&&card.canTarget.includes(own?'NEAR_ITEM':'FAR_ITEM');
    return card.canTarget.includes(own?'SELF':'OPPONENT');}
  aim(target:Target){if(this.locked||!this.allows(target))return false;this.target=target;this.discard=null;this.message=this.selectedCard?.characterBound?'Scegli dalla mano una regolare da scartare':'Controlla la calata e conferma';this.emit();return true;}
  get ready(){return !this.locked&&!!this.target&&this.allows(this.target)&&!!this.selectedCard&&(!this.selectedCard.characterBound||!!this.hand.find(x=>x.key===this.discard&&regular(x.card)));}
  confirm(){if(!this.ready)return null;const c=this.selectedCard!;const t=this.target!;const choices:NonNullable<Command['choices']>={};
    if(c.characterBound)choices.DISCARD_ONE=this.hand.find(x=>x.key===this.discard)!.card.name;
    if(t.itemIndex!==undefined)choices.TARGET_ITEM=this.view.players[t.owner].character.items[t.itemIndex].name;
    const cmd:Command={playedCardName:c.name,playerId:SELF,targetId:t.owner===SELF?'SELF':t.owner,gameId:this.view.gameId,choices:Object.keys(choices).length?choices:null};
    this.phase='sending';this.message='Invio in corso';this.commandCount++;this.lastCommand=clone(cmd);this.history.push(clone(cmd));this.emit();return cmd;}
  reorder(keys:string[]){if(this.locked||keys.length!==this.hand.length||new Set(keys).size!==keys.length||keys.some(k=>!this.hand.some(c=>c.key===k)))return;
    this.hand=keys.map(k=>this.hand.find(c=>c.key===k)!);this.emit();}
  reject(reason='Scelta rifiutata: controlla il bersaglio'){if(this.phase!=='sending')return;this.phase='choose';this.message=reason;this.emit('feedback');}
  disconnect(){this.generation++;this.phase='uncertain';this.message='Connessione interrotta · attendo lo stato';this.emit('disconnect');}
  receive(view:View,generation=this.generation,reset=false,recovered=false){
    if(generation!==this.generation)return false;
    if(!reset&&(view.gameId!==this.view.gameId||view.turn<this.view.turn))return false;
    const copy=clone(view);if(!Array.isArray(copy.players[SELF]?.cardsInHand))throw new Error('Vista privata mancante');
    for(const [id,p] of Object.entries(copy.players))if(id!==SELF&&typeof p.cardsInHand!=='number')throw new Error('Una mano avversaria non può contenere fronti');
    const changedTurn=reset||copy.turn!==this.view.turn;this.view=copy;
    this.hand=reconcile(reset?[]:this.hand,copy.players[SELF].cardsInHand as Card[],()=>`card-${++this.serial}`);
    if(changedTurn||!this.hand.some(c=>c.key===this.selected))this.clear();
    // Same-turn clock/view notifications do not establish the outcome of an in-flight SEND.
    // Only pending, a new turn, rejection, or an explicit recovered snapshot settles it.
    this.phase=copy.pendingMove?'pending':changedTurn||recovered?'choose':this.phase;
    if(copy.pendingMove){this.clear();this.message='Mossa ricevuta · In attesa';}else{if(this.target&&!this.allows(this.target)){this.target=null;this.discard=null;}if(this.phase==='choose')this.message=changedTurn?'Scegli una carta':'Stato aggiornato';}
    if(copy.over)this.message=copy.winner==='DRAW'?'Pareggio':'Partita conclusa';
    if(changedTurn&&!reset&&copy.resolvedMoves.length)this.sequence++;
    this.emit(reset?'reset':'view');return true;
  }
  reset(view:View){this.generation++;this.receive(view,this.generation,true);}
  acceptedSnapshot(){if(!this.lastCommand)return null;const v=clone(this.view);v.pendingMove={...clone(this.lastCommand),void:false,moveReport:{}} as Move;delete v.moveDeadlines[SELF];return v;}
}

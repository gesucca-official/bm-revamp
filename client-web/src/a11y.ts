// C4-8a: the small decisions of keyboard access, apart from the DOM so that the tests can break them (owner's choice of 10 November 2026, points 2 and 8).

/** Keys that tell the last input was the keyboard (2a, 2b): Tab, Enter, Space, Escape, the arrows and I (inspect). A pointer press tells the opposite. */
const KEYBOARD_KEYS=new Set(['Tab','Enter',' ','Escape','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','i','I']);
export const isKeyboardKey=(key:string)=>KEYBOARD_KEYS.has(key);
/** «The last input was the keyboard»: the table moves the focus by itself only then, so a mouse or a finger never gets a focus ring it did not ask for. */
export class InputMode{
 keyboard=false;
 key(key:string,ctrlOrMeta=false){if(!ctrlOrMeta&&isKeyboardKey(key))this.keyboard=true;}
 pointer(){this.keyboard=false;}
}

/** 2a: after the target (and the discard, if one is due) is chosen from the keyboard, ✓ takes the focus; Enter confirms, Esc cancels. */
export const shouldFocusConfirm=(s:{keyboard:boolean;confirmShown:boolean;needsDiscard:boolean})=>s.keyboard&&s.confirmShown&&!s.needsDiscard;
/** 2b: when a choice opens (new turn, cancel) and the focus went with the control that had it, from the keyboard the first card of the hand takes it. Never over a dialog, after the end, or when the focus is somewhere. */
export const shouldFocusHand=(s:{keyboard:boolean;phase:string;finished:boolean;dialogOpen:boolean;focusLost:boolean})=>s.keyboard&&s.phase==='choose'&&!s.finished&&!s.dialogOpen&&s.focusLost;

type HitLike={id:string;kind:string};
const inHand=(h:HitLike)=>h.kind==='hand'||h.kind==='preview';
/** 2c: the order of Tab of the semantic layer: the hand (and the card in preview) first, the rest after, each in the order the view gives. Stable; the visual order is not touched. */
export function semanticOrder<T extends HitLike>(hits:readonly T[]):T[]{return [...hits.filter(inHand),...hits.filter(h=>!inHand(h))];}
/**
 * The order of Tab while a card is being played (owner's trial of 11 November 2026: after Invio on a card, Tab reached another card of the hand and Invio on a
 * target the card does not admit cancelled the choice, with no sign of what to do). Choosing: the targets it admits come right after the chosen card (where the focus is, so
 * the first Tab reaches one), the rest keeps its order; the targets it does not admit leave the order (a click still reaches them). The chosen card itself does not move. Discard due: the cards that can be thrown away first. Otherwise the resting order (`semanticOrder`).
 */
export function aimOrder<T extends HitLike>(hits:readonly T[],s:{selected:string|null;targeted:boolean;discarding:boolean;allowed:(h:T)=>boolean;discardable:(h:T)=>boolean}):{order:T[];skipped:Set<string>}{
 const base=semanticOrder(hits),skipped=new Set<string>();
 if(!s.selected)return {order:base,skipped};
 const target=(h:T)=>h.kind==='person'||h.kind==='item';
 if(s.discarding){const first=base.filter(h=>h.kind==='hand'&&s.discardable(h));return {order:[...first,...base.filter(h=>!first.includes(h))],skipped};}
 if(s.targeted)return {order:base,skipped};
 const admitted=base.filter(h=>target(h)&&s.allowed(h));
 for(const h of base)if(target(h)&&!s.allowed(h))skipped.add(h.id);
 const rest=base.filter(h=>!admitted.includes(h)&&!skipped.has(h.id)),at=rest.findIndex(h=>h.id===s.selected);
 return {order:[...rest.slice(0,at+1),...admitted,...rest.slice(at+1),...base.filter(h=>skipped.has(h.id))],skipped};}
/** 2c: the card the arrows reach from `id`, one step along the hand, stopping at the ends; null when `id` is not a card of the hand or the key is not an arrow. */
export function handNeighbour(hits:readonly HitLike[],id:string,key:string):string|null{
 const step=key==='ArrowRight'?1:key==='ArrowLeft'?-1:0;if(!step)return null;
 const hand=hits.filter(h=>h.kind==='hand'),i=hand.findIndex(h=>h.id===id);if(i<0)return null;
 return hand[Math.max(0,Math.min(hand.length-1,i+step))].id;}

/** P8: the arrows of a radio group or a tab list. `enabled` is the state of each button in order; the result is the index to go to (wrapping around, skipping the disabled), or null for a key that is not ours. */
export function stepInGroup(enabled:boolean[],from:number,key:string):number|null{
 const n=enabled.length,step=key==='ArrowRight'||key==='ArrowDown'?1:key==='ArrowLeft'||key==='ArrowUp'?-1:0;
 if(key==='Home'||key==='End'){const order=key==='Home'?enabled.map((_,i)=>i):enabled.map((_,i)=>n-1-i);return order.find(i=>enabled[i])??null;}
 if(!step||from<0||from>=n)return null;
 for(let k=1;k<=n;k++){const j=(from+step*k+n*k)%n;if(enabled[j])return j;}
 return null;}
/** P8: the one button of a group that Tab reaches (roving tabindex): the checked one if it can be used, else the first that can. -1 when none can. */
export function tabStop(checked:boolean[],enabled:boolean[]):number{const on=checked.findIndex((c,i)=>c&&enabled[i]);return on>=0?on:enabled.findIndex(e=>e);}
/** The handler of a group (`radiogroup` or `tablist`): the arrows move the focus along the buttons of the role and press them, as in the ARIA pattern. */
export function groupKeyDown(e:{key:string;currentTarget:HTMLElement;preventDefault():void;altKey?:boolean;ctrlKey?:boolean;metaKey?:boolean},role:'radio'|'tab'){
 if(e.altKey||e.ctrlKey||e.metaKey)return;
 const buttons=[...e.currentTarget.querySelectorAll<HTMLButtonElement>(`[role=${role}]`)],from=buttons.indexOf(document.activeElement as HTMLButtonElement);
 const to=stepInGroup(buttons.map(b=>!b.disabled),from,e.key);if(to===null)return;
 e.preventDefault();if(to!==from){buttons[to].focus();buttons[to].click();}
}

const cards=(n:number)=>`${n} ${n===1?'carta':'carte'}`;
/** 7a: what the screen reader says of the round's small cards (the box that opens «Ultimo turno»): how many are shown and, on the pile of a compact table, the top card and its author. */
export function roundLabel(played:readonly {name:string;author:string;void:boolean}[],pile:boolean,who:(id:string)=>string):string{
 const n=played.length;if(!n)return 'Carte del round: apri Ultimo turno';
 const top=played[n-1],voided=played.slice(0,pile?n-1:n).filter(c=>c.void).length;
 return `Carte del round: ${cards(n)}${pile?`, in cima «${top.name}» di ${who(top.author)}${top.void?' (annullata)':''}`:''}${voided?`, ${voided} annullat${voided===1?'a':'e'}`:''}; apri Ultimo turno`;}
/** 7a: the deck of a seat, said after its resources. */
export const deckLabel=(deck:number|null|undefined)=>typeof deck==='number'?`mazzo ${cards(deck)}`:'';

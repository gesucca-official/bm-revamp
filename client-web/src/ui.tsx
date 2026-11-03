import React,{useRef} from 'react';
import type {Card} from './contracts.ts';
import {RESOURCE_NAMES} from './resolution.ts';
import {DAMAGE_ACCENT,DAMAGE_ACCENT_SHAPES,DAMAGE_CREASE,DAMAGE_CREASE_SHAPES,DAMAGE_COLOR,DAMAGE_NAMES,DAMAGE_SHAPES,damageOf,damageText,leftV,type DamageType} from './readability.ts';

export const resourceNames:Record<string,string>=RESOURCE_NAMES;
export const targetNames:Record<string,string>={SELF:'Te stesso',OPPONENT:'Un avversario',NEAR_ITEM:'Un tuo oggetto',FAR_ITEM:'Un oggetto avversario'};
export const effect=(c:Card)=>{const doc=new DOMParser().parseFromString(c.effect,'text/html');return (doc.querySelector('p:last-child')?.textContent||doc.body.textContent||'').replace(/\s*Riferimento: Regolamento[\s\S]*$/,'').trim();};

const hex=(n:number)=>`#${n.toString(16).padStart(6,'0')}`;
/** C3-5: the symbol of a type of damage in HTML, from the same polygons the table draws (catalog, editor, inspection). */
export const DamageMark=({type}:{type:DamageType})=><svg className="dmg-mark" viewBox="-1 -1 2 2" aria-hidden="true" data-damage={type}>{DAMAGE_SHAPES[type].map((poly,i)=><polygon key={i} fill={hex(DAMAGE_COLOR[type])} points={poly.map((v,j)=>j%2?`,${v} `:String(v)).join('')}/>)}{DAMAGE_ACCENT_SHAPES[type].map((poly,i)=><polygon key={`a${i}`} fill={hex(DAMAGE_ACCENT[type])} points={poly.map((v,j)=>j%2?`,${v} `:String(v)).join('')}/>)}{DAMAGE_CREASE_SHAPES[type].map((poly,i)=><polygon key={`c${i}`} fill={hex(DAMAGE_CREASE)} points={poly.map((v,j)=>j%2?`,${v} `:String(v)).join('')}/>)}</svg>;
/** The nominal damage of a card as symbols with the amount of the catalog (1.10); `resources` of the player resolves the `x`, else «20+». Nothing for a card without damage. */
export function DamagePills({card,resources}:{card:Card;resources?:Partial<Record<string,number>>|null}){
 const entries=damageOf(card),left=leftV(card,resources as never);
 return entries.length?<span className="dmg-pills" data-testid="damage">{entries.map(e=><span key={e.type} className="dmg-pill" data-damage={e.type} role="img" aria-label={`danno: ${DAMAGE_NAMES[e.type]}${damageText(e,left)?` ${damageText(e,left)}`:''}`}><DamageMark type={e.type}/>{damageText(e,left)}</span>)}</span>:null;
}

// Commit touch buttons on a stationary pointer release. Some mobile browsers suppress
// the compatibility click immediately after a captured drag. Keyboard/AT keep native click.
export function PressButton(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
 const down=useRef<{x:number;y:number;id:number}|null>(null),touchClick=useRef(false),ignoreUntil=useRef(0);
 return React.createElement('button',{...props,
  onPointerDown:(e:React.PointerEvent<HTMLButtonElement>)=>{if(e.pointerType==='touch'&&e.isPrimary&&!props.disabled)down.current={x:e.clientX,y:e.clientY,id:e.pointerId};props.onPointerDown?.(e);},
  onPointerCancel:(e:React.PointerEvent<HTMLButtonElement>)=>{down.current=null;props.onPointerCancel?.(e);},
  onPointerUp:(e:React.PointerEvent<HTMLButtonElement>)=>{const start=down.current;down.current=null;const over=document.elementFromPoint(e.clientX,e.clientY);
   if(start&&start.id===e.pointerId&&Math.hypot(start.x-e.clientX,start.y-e.clientY)<8&&over&&e.currentTarget.contains(over)&&!props.disabled){ignoreUntil.current=performance.now()+500;touchClick.current=true;e.currentTarget.click();touchClick.current=false;e.preventDefault();}props.onPointerUp?.(e);},
  onClick:(e:React.MouseEvent<HTMLButtonElement>)=>{const native=e.nativeEvent as PointerEvent;if(!touchClick.current&&native.pointerType==='touch'&&performance.now()<ignoreUntil.current)return;props.onClick?.(e);}
 },props.children);
}

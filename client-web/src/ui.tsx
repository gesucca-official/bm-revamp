import React,{useRef} from 'react';
import type {Card} from './contracts.ts';

export const resourceNames:Record<string,string>={HEALTH:'Salute',ALERTNESS:'Allerta',VIOLENCE:'Violenza',TOXICITY:'Tossicità',ALCOHOL:'Alcol'};
export const targetNames:Record<string,string>={SELF:'Te stesso',OPPONENT:'Un avversario',NEAR_ITEM:'Un tuo oggetto',FAR_ITEM:'Un oggetto avversario'};
export const effect=(c:Card)=>{const doc=new DOMParser().parseFromString(c.effect,'text/html');return (doc.querySelector('p:last-child')?.textContent||doc.body.textContent||'').replace(/\s*Riferimento: Regolamento[\s\S]*$/,'').trim();};

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

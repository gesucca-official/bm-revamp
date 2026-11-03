import React,{useRef} from 'react';
import type {Card,Resource} from './contracts.ts';
import {RESOURCE_NAMES} from './resolution.ts';
import {DAMAGE_ACCENT,DAMAGE_COLOR,DAMAGE_NAMES,RES_COLOR,gainsOf,damageOf,damageText,leftV,type DamageType} from './readability.ts';
import {MARK_LAYERS,SYMBOL_LAYERS,svgParts,symbolColors,type Layer,type MarkKind,type SymbolKind} from './symbols.ts';

export const resourceNames:Record<string,string>=RESOURCE_NAMES;
export const targetNames:Record<string,string>={SELF:'Te stesso',OPPONENT:'Un avversario',NEAR_ITEM:'Un tuo oggetto',FAR_ITEM:'Un oggetto avversario'};
export const effect=(c:Card)=>{const doc=new DOMParser().parseFromString(c.effect,'text/html');return (doc.querySelector('p:last-child')?.textContent||doc.body.textContent||'').replace(/\s*Riferimento: Regolamento[\s\S]*$/,'').trim();};

const hex=(n:number)=>`#${n.toString(16).padStart(6,'0')}`;
/** C4-3: a symbol of symbols.ts in HTML: the same layers the table draws with Pixi, as SVG (catalog, editor, inspection, help). */
const SvgMark=({layers,colors,className,px=14,data}:{layers:Layer[];colors:{main:string;accent?:string};className?:string;px?:number;data?:Record<string,string>})=>
 <svg className={className} viewBox="-1 -1 2 2" aria-hidden="true" {...data}>{svgParts(layers,colors,px).map((p,i)=>React.createElement(p.tag,{key:i,...p.attrs}))}</svg>;
export const SymbolMark=({kind,className,colors,px}:{kind:SymbolKind;className?:string;colors?:{main:string;accent?:string};px?:number})=>
 <SvgMark layers={SYMBOL_LAYERS[kind]} colors={colors??symbolColors(kind)} className={className} px={px}/>;
/** ✓ and ✕ as shapes in the colour of the text, in place of the glyphs Impact and Arial lack. */
export const Mark=({kind,className}:{kind:MarkKind;className?:string})=><SvgMark layers={MARK_LAYERS[kind]} colors={{main:'currentColor'}} className={`mark${className?` ${className}`:''}`} px={20}/>;
/** C3-5: the symbol of a type of damage in HTML (catalog, editor, inspection). */
export const DamageMark=({type}:{type:DamageType})=><SvgMark layers={SYMBOL_LAYERS[type]} colors={{main:hex(DAMAGE_COLOR[type]),accent:hex(DAMAGE_ACCENT[type])}} className="dmg-mark" data={{'data-damage':type}}/>;
/** C4-3: the cost of a card as the coins of the table: the number and the symbol of the resource (never the letter); the text for a reader is the resource's name. */
export function Cost({card}:{card:Card}){
 const entries=Object.entries(card.cost) as [Resource,number][];
 if(!entries.length)return <>—</>;
 return <span className="coins" data-testid="cost">{entries.map(([k,v])=><span key={k} className="coin" data-resource={k} role="img" aria-label={`${v} ${resourceNames[k].toLowerCase()}`}>{v}<span className="disc"><SymbolMark kind={k} className="res-mark"/></span></span>)}</span>;
}
/** C4-3: what a card gives (`+15`, `+x`) with the symbol of each resource; a string the client cannot read is shown as the catalog gives it. */
export function Gains({card}:{card:Card}){
 const gains=gainsOf(card),raw=card.gains??'';
 if(!gains.length||gains.length!==raw.split(',').length)return <>{raw}</>;
 return <span className="gains" data-testid="gains">{gains.map(g=><span key={g.resource} className="gain" role="img" aria-label={`+${g.amount??'x'} ${resourceNames[g.resource].toLowerCase()}`} style={{borderColor:hex(RES_COLOR[g.resource])}}>+{g.amount??'x'}<SymbolMark kind={g.resource} className="res-mark"/></span>)}</span>;
}
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

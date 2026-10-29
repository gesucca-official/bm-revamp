import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import data from './fixtures.json';
import type {Card,View} from './contracts.ts';
import {Model,SELF,clone} from './model.ts';
import {TableScene,artIndex,cost,subtype,type Hit,type Inspection} from './scene.ts';
import './style.css';
const timed=(source:View)=>{const v=clone(source);v.moveDeadlines=Object.fromEntries(Object.keys(v.moveDeadlines).map(k=>[k,Date.now()+30000]));return v;};
const model=new Model(timed(data.before as View));
const resourceNames:Record<string,string>={HEALTH:'Salute',ALERTNESS:'Allerta',VIOLENCE:'Violenza',TOXICITY:'Tossicità',ALCOHOL:'Alcol'};
const targetNames:Record<string,string>={SELF:'Te stesso',OPPONENT:'Un avversario',NEAR_ITEM:'Un tuo oggetto',FAR_ITEM:'Un oggetto avversario'};
const effect=(c:Card)=>{const doc=new DOMParser().parseFromString(c.effect,'text/html');return (doc.querySelector('p:last-child')?.textContent||doc.body.textContent||'').replace(/\s*Riferimento: Regolamento[\s\S]*$/,'').trim();};
// Commit touch buttons on a stationary pointer release. Some mobile browsers suppress
// the compatibility click immediately after a captured drag. Keyboard/AT keep native click.
function PressButton(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
 const down=useRef<{x:number;y:number;id:number}|null>(null),touchClick=useRef(false),ignoreUntil=useRef(0);
 return React.createElement('button',{...props,
  onPointerDown:(e:React.PointerEvent<HTMLButtonElement>)=>{if(e.pointerType==='touch'&&e.isPrimary&&!props.disabled)down.current={x:e.clientX,y:e.clientY,id:e.pointerId};props.onPointerDown?.(e);},
  onPointerCancel:(e:React.PointerEvent<HTMLButtonElement>)=>{down.current=null;props.onPointerCancel?.(e);},
  onPointerUp:(e:React.PointerEvent<HTMLButtonElement>)=>{const start=down.current;down.current=null;const over=document.elementFromPoint(e.clientX,e.clientY);if(start&&start.id===e.pointerId&&Math.hypot(start.x-e.clientX,start.y-e.clientY)<8&&over&&e.currentTarget.contains(over)&&!props.disabled){ignoreUntil.current=performance.now()+500;touchClick.current=true;e.currentTarget.click();touchClick.current=false;e.preventDefault();}props.onPointerUp?.(e);},
  onClick:(e:React.MouseEvent<HTMLButtonElement>)=>{const native=e.nativeEvent as PointerEvent;if(!touchClick.current&&native.pointerType==='touch'&&performance.now()<ignoreUntil.current)return;props.onClick?.(e);}
 },props.children);
}
function App(){
 const host=useRef<HTMLDivElement>(null),scene=useRef<TableScene|null>(null),dialog=useRef<HTMLDialogElement>(null),returnFocus=useRef<HTMLElement|null>(null);
 const [,refresh]=useState(0),[hits,setHits]=useState<Hit[]>([]),[ready,setReady]=useState(false),[error,setError]=useState(''),[modal,setModal]=useState<'inspect'|'lab'|'menu'|'report'|null>(null),[inspection,setInspection]=useState<Inspection|null>(null),[clock,setClock]=useState(30);
 const update=()=>refresh(x=>x+1);
 const close=()=>{setModal(null);setTimeout(()=>{if(returnFocus.current?.isConnected)returnFocus.current.focus();else document.querySelector<HTMLButtonElement>('.menu-button')?.focus();},0);};
 const open=(kind:NonNullable<typeof modal>,inspect?:Inspection)=>{returnFocus.current=document.activeElement as HTMLElement;if(inspect)setInspection(inspect);setModal(kind);};
 useEffect(()=>{const table=new TableScene(model);scene.current=table;let active=true;table.onLayout=()=>{if(active){const focused=document.activeElement?.getAttribute('data-hit');setHits([...table.hits]);if(focused&&!table.hits.some(h=>h.id===focused))requestAnimationFrame(()=>{if(!dialog.current?.open)document.querySelector<HTMLButtonElement>('[data-hit]')?.focus();});}};table.onState=()=>{if(active)update();};table.onInspect=i=>open('inspect',i);table.onError=setError;
  table.init(host.current!).then(()=>{if(active){setReady(true);update();}}).catch(e=>setError(`Il tavolo non è disponibile: ${String(e)}`));const unsubscribe=model.subscribe(update);
  const esc=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!dialog.current?.open)table.escape();};window.addEventListener('keydown',esc);
  return()=>{active=false;unsubscribe();window.removeEventListener('keydown',esc);table.destroy();};},[]);
 useEffect(()=>{const timer=setInterval(()=>setClock(Math.max(0,Math.ceil(((model.view.moveDeadlines[SELF]??Date.now())-Date.now())/1000))),200);return()=>clearInterval(timer);},[]);
 useEffect(()=>{const s=scene.current;if(s){s.blocked=!!modal;if(modal)s.interrupt('dialog');}if(modal){dialog.current?.showModal();dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();}else dialog.current?.close();},[modal]);
 function fixture(name:string){const s=scene.current!;let v:View;
  if(name==='reset'){model.reset(timed(data.before as View));}
  if(name==='duel'){v=timed(data.before as View);v.players={Tu:v.players.Tu,Bice:v.players.Bice};v.moveDeadlines={Tu:v.moveDeadlines.Tu,Bice:v.moveDeadlines.Bice};model.reset(v);}
  if(name==='counts'){v=clone(model.view);['Bice','Ada','Nino','Tito'].forEach((p,i)=>{if(v.players[p])v.players[p].cardsInHand=[0,1,6,4][i];});model.receive(v);}
  if(name==='pending'){v=model.acceptedSnapshot()!;if(v)model.receive(v);}
  if(name==='reject')model.reject();
  if(name==='disconnect')model.disconnect();
  if(name==='resume')model.receive(clone(model.view),model.generation,false,true);
  if(name==='old')model.receive(timed(data.after as View),model.generation-1);
  if(name==='clock'){v=clone(model.view);v.moveDeadlines[SELF]=Date.now()+15000;v.reconnectDeadlines={Nino:Date.now()+25000};model.receive(v);}
  if(name==='round')model.receive(timed(data.after as View));
  if(name==='duplicate')model.receive(clone(model.view));
  if(name==='long'){v=clone(model.view);(v.players.Tu.cardsInHand as Card[])[2]=clone(data.cards.long) as Card;model.receive(v);}
  if(name==='edge'){v=clone(model.view);v.players.Tu.character.resources.HEALTH=120;if(v.players.Tito){v.players.Tito.character.resources.HEALTH=-5;v.players.Tito.character.dead=true;}v.forfeits={Nino:'leave'};model.receive(v);}
  if(name==='stopfx')s.stopEffects();
  update();
 }
 useEffect(()=>{(window as any).__c0={fixture,unmount:()=>root.unmount(),measureStart:()=>scene.current?.startMeasure(),measureEnd:()=>scene.current?.endMeasure(),get state(){return {view:clone(model.view),order:model.hand.map(c=>({key:c.key,name:c.card.name})),phase:model.phase,selected:model.selected,target:model.target,discard:model.discard,commands:model.commandCount,lastCommand:model.lastCommand,generation:model.generation,drag:scene.current?.drag,reordering:scene.current?.reordering,backs:scene.current?.backs,stats:scene.current?.stats,contextLost:scene.current?.contextLost,renderer:scene.current?.app.renderer?.name,hits:scene.current?.hits.map(({node,...hit})=>hit)};}};});
 const table=scene.current,choice=model.selectedCard;
 const targetLabel=model.target?`${model.target.owner}${model.target.itemIndex!==undefined?` · ${model.view.players[model.target.owner].character.items[model.target.itemIndex].name}`:''}`:'';
 return <main aria-label="Tavolo di Botte Micidiali">
  <div ref={host} className="table-host"/>
  <div className="semantic-layer" aria-label="Carte e bersagli">{hits.map(hit=><PressButton key={hit.id} data-hit={hit.id} className="semantic" aria-label={hit.label} aria-pressed={hit.kind==='hand'?model.selected===hit.key:undefined} style={{left:hit.x-hit.w/2,top:hit.y-hit.h/2,width:hit.w,height:hit.h,transform:`rotate(${hit.angle}rad)`}} onClick={()=>table?.activate(hit.id)} onFocus={()=>table?.focus(hit.id)} onBlur={()=>table?.focus(null)} onKeyDown={e=>table?.key(hit.id,e.nativeEvent)}><span>{hit.label}</span></PressButton>)}</div>
  <div className="brand" aria-hidden="true">BOTTE<br/>MICIDIALI</div>
  <div className="top-actions"><span className="clock" aria-label="Tempo indicativo">◷ {model.phase==='pending'?'—':`${clock} s`}</span><PressButton className="menu-button round" aria-label="Apri menu" onClick={()=>open('menu')}>•••</PressButton></div>
  <p className="hint" role="status" aria-live="polite">{table?.reordering?'Riordina: scegli due carte, oppure usa le frecce e Invio':model.message}</p>
  <div className="hand-tools">{choice&&<PressButton onClick={()=>open('inspect',{title:choice.name,card:choice})}>Dettagli carta</PressButton>}<PressButton aria-pressed={table?.reordering||false} disabled={model.locked} onClick={()=>table?.reorder()}>{table?.reordering?'Annulla ordine':'Riordina'}</PressButton></div>
  {choice&&model.target&&<div className="confirmation" style={{left:Math.min((table?.preview.x||0)+70,innerWidth-175),top:Math.max(50,(table?.preview.y||0)-30)}}>
   <span>{choice.name}<br/>→ {targetLabel}</span><div><PressButton data-testid="confirm" disabled={!model.ready||!!error} aria-label="Conferma calata" onClick={()=>model.confirm()}>✓</PressButton><PressButton aria-label="Annulla calata" disabled={model.phase!=='choose'} onClick={()=>model.cancel()}>×</PressButton></div></div>}
  {!ready&&!error&&<div className="loading">Preparo il tavolo…</div>}
  {error&&<div className="error" role="alert">{error}</div>}
  <div className="portrait"><strong>Un tavolo, cinque posti.</strong><p>Ruota lo schermo per distinguere le carte e raggiungere i bersagli.</p><p>La selezione è interrotta; il tempo continua.</p></div>
  <dialog ref={dialog} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===dialog.current)close();}}>
   <PressButton className="close round" onClick={close} aria-label="Chiudi">×</PressButton>
   {modal==='inspect'&&inspection&&<section className="inspection"><div className="large-card"><h2>{inspection.title}</h2><div className="art" style={{backgroundPosition:`${(artIndex(inspection.card?.bindingName||model.view.players[inspection.owner!]?.character.bindingName||'')%4)*100/3}% ${Math.floor(artIndex(inspection.card?.bindingName||model.view.players[inspection.owner!]?.character.bindingName||'')/4)*50}%`}}/>{inspection.card&&<p>{subtype(inspection.card)}<br/>{inspection.card.item?'Si usa tramite un’azione':<>{cost(inspection.card)} · Priorità {inspection.card.priority}</>}</p>}</div><div className="receipt"><h2>{inspection.title}</h2>
    {inspection.card?<><p>{subtype(inspection.card).toLocaleLowerCase('it')}{inspection.owner?` · di ${inspection.owner}`:''}</p>{inspection.card.item?<p>Si trova sul tavolo. Per consumarlo serve un’azione appropriata: conta la priorità di quell’azione.</p>:<dl><dt>Costo</dt><dd>{Object.entries(inspection.card.cost).map(([k,v])=>`${v} ${resourceNames[k]}`).join(' + ')||'Nessun costo in risorse'}</dd><dt>Priorità</dt><dd>{inspection.card.priority}</dd><dt>Bersaglio</dt><dd>{inspection.card.canTarget.map(t=>targetNames[t]).join(' / ')}</dd></dl>}<p className="full-text">{effect(inspection.card)}</p>{inspection.card.characterBound&&<p>Resta in mano. Richiede lo scarto di un’altra azione regolare.</p>}{inspection.card.basicAction&&<p>Resta in mano e richiede un oggetto vicino.</p>}</>:<><p>{inspection.owner}</p><dl>{Object.entries(model.view.players[inspection.owner!].character.resources).map(([k,v])=><React.Fragment key={k}><dt>{resourceNames[k]}</dt><dd>{v}</dd></React.Fragment>)}</dl><h3>Stati ed equipaggiamenti</h3>{model.view.players[inspection.owner!].character.statuses.map((s,i)=><p key={i}>{s.equip?'Equip · ':''}{s.name}: {s.description} · durata {s.lastsForTurns??'illimitata'}</p>)}<p>Immunità: {model.view.players[inspection.owner!].character.immunities.map(k=>resourceNames[k]).join(', ')||'nessuna'}</p>{model.view.players[inspection.owner!].character.timers.map((t,i)=><p key={i}>{t.name}: {t.timer}</p>)}</>}
    <PressButton onClick={close}>Torna al tavolo</PressButton></div></section>}
   {modal==='menu'&&<section className="menu"><h2>Al tavolo</h2><p>Seleziona una carta e un bersaglio, poi conferma. Puoi anche trascinare.</p><p>Per ispezionare: seleziona la carta e apri Dettagli; da tastiera premi I. Riordina scambia due carte; le frecce spostano la carta e Invio conferma.</p><PressButton onClick={()=>setModal('report')}>Ultimo turno</PressButton><PressButton onClick={()=>{table?.stopEffects();close();}}>Salta effetti</PressButton><PressButton onClick={()=>setModal('lab')}>Apri laboratorio C0</PressButton></section>}
   {modal==='report'&&<section><h2>Ultimo turno</h2>{model.view.resolvedMoves.length?model.view.resolvedMoves.map((m,i)=><p key={i}>{m.playerId} → {m.targetId}: {m.playedCardName}. {Object.values(m.moveReport).flat().join(' ')}</p>):<p>Nessuna risoluzione disponibile.</p>}{Object.entries(model.view.timeBasedEffects).map(([id,lines])=><p key={id}>{id}: {lines.join(' ')}</p>)}</section>}
   {modal==='lab'&&<section className="lab"><h2>Laboratorio C0 · dati sintetici</h2><p>Nessuna connessione al server. Check produce solo un’anteprima comando. Le viste successive sono snapshot precostituiti, non il risultato della scelta.</p><div className="lab-grid">{[['reset','FFA cinque · riparti'],['duel','Duello'],['counts','Dorsi 0 / 1 / 6 / 4'],['long','Carta con testo lungo'],['pending','Mossa accettata'],['reject','Rifiuto'],['disconnect','Disconnessione'],['resume','Rientro · stessa vista'],['clock','Clock nello stesso turno'],['round','Vista turno successivo'],['duplicate','Vista duplicata'],['old','Callback connessione vecchia'],['edge','Salute e forfait'],['stopfx','Interrompi effetti']].map(([name,label])=><PressButton key={name} data-fixture={name} onClick={()=>{fixture(name);close();}}>{label}</PressButton>)}</div><h3>Anteprima comando</h3><pre>{JSON.stringify(model.lastCommand,null,2)||'Nessun comando'}</pre><p>Anteprime: {model.commandCount}. Dispositivo touch fisico: non attestato da questo laboratorio.</p></section>}
  </dialog>
 </main>;
}
const root=createRoot(document.getElementById('root')!);
root.render(<App/>);



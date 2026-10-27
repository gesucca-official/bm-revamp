import React,{useEffect,useRef,useState} from 'react';
import type {Session} from './session.ts';
import type {Model} from './model.ts';
import {artCss,artIndex} from './art.ts';
import {TableScene,cost,subtype,playerName,type Hit,type Inspection} from './scene.ts';
import {ROLES,roleOf,shortfall} from './readability.ts';
import {PressButton,effect,resourceNames,targetNames} from './ui.tsx';

type Modal='inspect'|'menu'|'report'|'tools'|'leave';
const reasons:Record<string,string>={combat:'Rissa conclusa al tavolo',leave:'Abbandono',timeout:'Tempo scaduto','riavvio server':'Riavvio del server'};

/** The bar table for one game: Pixi scene plus HTML shell. All gestures end in Model intents; Session sends. */
export function Table({session,model}:{session:Session;model:Model}){
 const host=useRef<HTMLDivElement>(null),scene=useRef<TableScene|null>(null),dialog=useRef<HTMLDialogElement>(null),returnFocus=useRef<HTMLElement|null>(null);
 const [,refresh]=useState(0),[hits,setHits]=useState<Hit[]>([]),[ready,setReady]=useState(false),[error,setError]=useState(''),[modal,setModal]=useState<Modal|null>(null),[inspection,setInspection]=useState<Inspection|null>(null),[clock,setClock]=useState<number|null>(null),[toast,setToast]=useState('');
 const [tool,setTool]=useState<{title:string;data:unknown}|null>(null),[hover,setHover]=useState<string|null>(null),[overInfo,setOverInfo]=useState<string|null>(null);
 const update=()=>refresh(x=>x+1);
 const me=model.me,view=model.view;
 const close=()=>{setModal(null);setTimeout(()=>{if(returnFocus.current?.isConnected)returnFocus.current.focus();else document.querySelector<HTMLButtonElement>('.menu-button')?.focus();},0);};
 const open=(kind:Modal,inspect?:Inspection)=>{returnFocus.current=document.activeElement as HTMLElement;if(inspect)setInspection(inspect);setModal(kind);};
 useEffect(()=>{const table=new TableScene(model,()=>session.catalog,()=>session.characters);scene.current=table;let active=true;
  table.onLayout=()=>{if(active){const focused=document.activeElement?.getAttribute('data-hit');setHits([...table.hits]);if(focused&&!table.hits.some(h=>h.id===focused))requestAnimationFrame(()=>{if(!dialog.current?.open)document.querySelector<HTMLButtonElement>('[data-hit]')?.focus();});}};
  table.onState=()=>{if(active)update();};
  // Leaving the canvas for the (i) button must not hide it: clear the hover a moment later.
  let hoverTimer=0;table.onHover=id=>{clearTimeout(hoverTimer);if(id)setHover(id);else hoverTimer=window.setTimeout(()=>{if(active)setHover(null);},150);};table.onInspect=i=>open('inspect',i);table.onError=setError;
  table.init(host.current!).then(()=>{if(active){setReady(true);update();}}).catch(e=>setError(`Il tavolo non è disponibile: ${String(e)}`));
  // A short, non-blocking line per resolved round; the full report stays one tap away.
  let seen=model.sequence,toastTimer=0;
  const unsubscribe=model.subscribe(why=>{update();if(why==='view'&&model.sequence!==seen){seen=model.sequence;const v=model.view,eot=Object.values(v.timeBasedEffects).flat().length;
   setToast(`Turno ${v.turn}: ${v.resolvedMoves.map(m=>`${m.playerId===me?'tu':playerName(m.playerId)} → ${m.playedCardName}${m.void?' (annullata)':''}`).join(' · ')}${eot?` · fine turno: ${eot} effett${eot===1?'o':'i'}`:''}`);
   clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>setToast(''),6000);}});
  const esc=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!dialog.current?.open)table.escape();};window.addEventListener('keydown',esc);
  (window as any).__bm={get state(){return {phase:model.phase,turn:model.view.turn,over:model.view.over,winner:model.view.winner,me,order:model.hand.map(c=>({key:c.key,name:c.card.name})),selected:model.selected,target:model.target,discard:model.discard,commands:model.commandCount,lastCommand:model.lastCommand,message:model.message,drag:table.drag,ghostOver:table.ghostOver,backs:table.backs,stats:table.stats,hits:table.hits.map(({node,...hit})=>hit),readout:table.readout,statusShown:table.statusShown,resources:model.view.players[me]?.character.resources??{},cards:model.hand.map(c=>({key:c.key,name:c.card.name,cost:c.card.cost,role:c.card.role??null,gains:c.card.gains??null}))};},measureStart:()=>table.startMeasure(),measureEnd:()=>table.endMeasure()};
  return()=>{active=false;clearTimeout(toastTimer);clearTimeout(hoverTimer);unsubscribe();window.removeEventListener('keydown',esc);table.destroy();delete (window as any).__bm;};
 },[model]);
 // Indicative countdown from the server epoch: it never decides a forfeit. vsCom has no move clock.
 useEffect(()=>{const timer=setInterval(()=>{const d=model.view.moveDeadlines?.[me];setClock(d?Math.max(0,Math.ceil((d-Date.now())/1000)):null);},250);return()=>clearInterval(timer);},[model]);
 useEffect(()=>{const s=scene.current;if(s){s.blocked=!!modal;if(modal)s.interrupt('dialog');}if(modal){if(!dialog.current?.open)dialog.current?.showModal();dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();}else dialog.current?.close();},[modal]);
 const table=scene.current,choice=model.selectedCard;
 const targetLabel=model.target?`${model.target.owner===me?'te':playerName(model.target.owner)}${model.target.itemIndex!==undefined?` · ${view.players[model.target.owner].character.items[model.target.itemIndex].name}`:''}`:'';
 const finished=view.over||model.eliminated;
 // (i) on the hovered card (mouse), else on the selected or focused hand card (touch, keyboard).
 // Top-left corner: in the fan each card covers the right side of the previous one.
 const infoId=table?.drag||modal?null:overInfo??[hover,model.selected,table?.focused].find(x=>x&&!x.startsWith('status-'))??null,infoHit=hits.find(h=>h.id===infoId);
 // Status summary on hover, tap or focus: a short card above the chip, inside the viewport.
 const tip=modal||table?.drag?null:table?.statusShown??null;
 // The confirmation controls win over a nearby (i): it never covers ✓ or ×.
 const confirmAt=choice&&model.target&&!finished?{left:Math.min((table?.preview.x||0)+70,innerWidth-175),top:Math.max(50,(table?.preview.y||0)-30)}:null;
 const covers=(x:number,y:number)=>!!confirmAt&&x>confirmAt.left-26&&x<confirmAt.left+190&&y>confirmAt.top-26&&y<confirmAt.top+130;
 const info=infoHit&&(()=>{const r=Math.min(16,infoHit.w*.2),lx=-infoHit.w/2+r+2,ly=-infoHit.h/2+r+2,c=Math.cos(infoHit.angle),s=Math.sin(infoHit.angle);const cx=infoHit.x+lx*c-ly*s,cy=infoHit.y+lx*s+ly*c;return covers(cx,cy)?null:{id:infoHit.id,label:infoHit.label,cx,cy};})();
 const result=view.over?(view.winner==='NONE'?'Pareggio':view.winner===me?'Hai vinto':'Hai perso'):'Sei fuori dalla partita';
 const inspectedArt=inspection?artIndex(inspection.card?.bindingName||view.players[inspection.owner!]?.character.bindingName||''):0;
 const inspectRole=inspection?.card?roleOf(inspection.card):null,inspectShort=inspection?.card?shortfall(inspection.card,view.players[me]?.character.resources??{}):[];
 const discardable=model.hand.filter(c=>!c.card.item&&!c.card.basicAction&&!c.card.characterBound&&!c.card.lastResort);
 const showTool=(title:string,data:unknown)=>{setTool({title,data});console.info(`[${title}]`,data);};
 return <main aria-label="Tavolo di Botte Micidiali">
  <div ref={host} className="table-host"/>
  <div className="semantic-layer" aria-label="Carte e bersagli">{hits.map(hit=><PressButton key={hit.id} data-hit={hit.id} className="semantic" aria-label={hit.label} aria-pressed={hit.kind==='hand'?model.selected===hit.key:undefined} style={{left:hit.x-hit.w/2,top:hit.y-hit.h/2,width:hit.w,height:hit.h,transform:`rotate(${hit.angle}rad)`}} onClick={()=>table?.activate(hit.id)} onFocus={()=>table?.focus(hit.id)} onBlur={()=>table?.focus(null)} onKeyDown={e=>table?.key(hit.id,e.nativeEvent)}><span>{hit.label}</span></PressButton>)}</div>
  <div className="brand" aria-hidden="true">BOTTE<br/>MICIDIALI</div>
  <div className="top-actions">{clock!==null&&!finished&&<span className="clock" aria-label="Tempo indicativo per la mossa">◷ {model.phase==='pending'?'—':`${clock} s`}</span>}<span className="turn" aria-label={`Turno ${view.turn+1}`}>T{view.turn+1}</span><PressButton className="menu-button round" aria-label="Apri menu" onClick={()=>open('menu')}>•••</PressButton></div>
  {!finished&&!confirmAt&&<p className={`hint ${model.phase}`} role="status" aria-live="polite">{model.message}</p>}
  {toast&&!finished&&<PressButton className="toast" onClick={()=>open('report')}>{toast}</PressButton>}
  {tip&&<div className={`status-tip ${tip.kind}`} role="tooltip" data-testid="status-tip" style={{left:Math.max(8,Math.min(tip.x-120,innerWidth-248)),top:tip.y>150?undefined:tip.y+30,bottom:tip.y>150?innerHeight-tip.y+6:undefined}}><strong>{tip.title}</strong><span>{tip.text}</span></div>}
  {info&&<PressButton key={info.id} className="info" data-testid="info" aria-label={`Dettagli: ${info.label}`} style={{left:info.cx,top:info.cy}} onPointerEnter={()=>setOverInfo(info.id)} onPointerLeave={()=>setOverInfo(null)} onClick={()=>{setOverInfo(null);table?.inspect(info.id);}}>i</PressButton>}
  {choice&&model.target&&!finished&&<div className="confirmation" style={confirmAt!}>
   <span role="status" aria-live="polite">{choice.name}<br/>→ {targetLabel}<br/><em>{model.message}</em>{choice.characterBound&&!discardable.length&&<><br/>Nessuna regolare da scartare</>}</span><div><PressButton data-testid="confirm" disabled={!model.ready||!!error||!session.connected} aria-label="Conferma calata" onClick={()=>session.submit()}>✓</PressButton><PressButton aria-label="Annulla calata" disabled={model.phase!=='choose'} onClick={()=>model.cancel()}>×</PressButton></div></div>}
  {finished&&<section className="outcome" aria-label="Esito"><h2>{result}</h2><p>{reasons[view.outcomeReason||'']||(view.over?'Partita conclusa':'')}</p>
   <div><PressButton data-testid="again" onClick={()=>session.leave('quick')}>Nuova partita</PressButton><PressButton onClick={()=>session.leave('hub')}>Torna all’hub</PressButton><PressButton onClick={()=>open('report')}>Ultimo turno</PressButton></div></section>}
  {!ready&&!error&&<div className="loading">Preparo il tavolo…</div>}
  {error&&<div className="error" role="alert">{error}</div>}
  <div className="portrait"><strong>Il tavolo va in orizzontale.</strong><p>Ruota lo schermo per distinguere le carte e raggiungere i bersagli.</p><p>La selezione è interrotta; il tempo continua.</p></div>
  <dialog ref={dialog} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===dialog.current)close();}}>
   <PressButton className="close round" onClick={close} aria-label="Chiudi">×</PressButton>
   {modal==='inspect'&&inspection&&<section className="inspection"><div className="large-card"><h2>{inspection.title}</h2><div className="art" style={artCss(inspectedArt)}/>{inspection.card&&<p>{subtype(inspection.card)}<br/>{inspection.card.item?'Si usa tramite un’azione':<>{cost(inspection.card)} · Priorità {inspection.card.priority}</>}</p>}</div><div className="receipt"><h2>{inspection.title}</h2>
    {inspection.card?<><p>{subtype(inspection.card).toLocaleLowerCase('it')}{inspection.owner?` · di ${inspection.owner===me?'te':playerName(inspection.owner)}`:''}</p>{!inspection.card.item&&!inspection.owner&&inspectShort.length>0&&<p className="short">Con le risorse attuali non basta: mancano {inspectShort.map(k=>resourceNames[k].toLowerCase()).join(', ')}. Puoi comunque provarla: decide il server.</p>}{inspection.card.item&&inspectRole&&<p>Ruolo: {ROLES[inspectRole].label.toLowerCase()}{inspection.card.gains&&inspection.card.gains!=='—'?` · ti dà ${inspection.card.gains}`:''}</p>}{inspection.card.item?<p>Si trova sul tavolo. Per consumarlo serve un’azione appropriata: conta la priorità di quell’azione.</p>:<dl><dt>Costo</dt><dd>{Object.entries(inspection.card.cost).map(([k,v])=>`${v} ${resourceNames[k]}`).join(' + ')||'Nessun costo in risorse'}</dd><dt>Priorità</dt><dd>{inspection.card.priority}</dd>{inspectRole&&<><dt>Ruolo</dt><dd>{ROLES[inspectRole].label.toLowerCase()}: {ROLES[inspectRole].hint}</dd></>}{inspection.card.gains&&inspection.card.gains!=='—'&&<><dt>Ti dà</dt><dd>{inspection.card.gains}</dd></>}<dt>Bersaglio</dt><dd>{inspection.card.canTarget.map(t=>targetNames[t]).join(' / ')}</dd></dl>}<p className="full-text">{effect(inspection.card)}</p>{inspection.card.characterBound&&<p>Resta in mano. Richiede lo scarto di un’altra azione regolare.</p>}{inspection.card.basicAction&&<p>Resta in mano e richiede un oggetto vicino.</p>}</>
    :<><p>{inspection.owner===me?'Tu':playerName(inspection.owner!)}{view.forfeits[inspection.owner!]?' · forfait':view.players[inspection.owner!].character.dead?' · eliminato':''}</p><dl>{Object.entries(view.players[inspection.owner!].character.resources).map(([k,v])=><React.Fragment key={k}><dt>{resourceNames[k]}</dt><dd>{v}</dd></React.Fragment>)}<dt>Oggetti</dt><dd>{view.players[inspection.owner!].character.items.length} / {view.players[inspection.owner!].character.itemsSize}</dd><dt>Mazzo</dt><dd>{view.players[inspection.owner!].deck} carte</dd></dl><h3>Stati ed equipaggiamenti</h3>{view.players[inspection.owner!].character.statuses.map((s,i)=><p key={i}>{s.equip?'Equip · ':''}{s.name}: {s.description} · durata {s.lastsForTurns??'illimitata'}</p>)}{!view.players[inspection.owner!].character.statuses.length&&<p>Nessuno.</p>}<p>Immunità: {view.players[inspection.owner!].character.immunities.map(k=>resourceNames[k]).join(', ')||'nessuna'}</p>{view.players[inspection.owner!].character.timers.map((t,i)=><p key={i}>Timer {t.name}: {t.timer}</p>)}</>}
    <PressButton onClick={close}>Torna al tavolo</PressButton></div></section>}
   {modal==='menu'&&<section className="menu"><h2>Al tavolo</h2><p>Scegli una carta e un bersaglio, poi conferma con ✓. Puoi anche trascinare la carta sul bersaglio. Le mosse sono simultanee: il turno si risolve quando tutti hanno scelto.</p><p>Per leggere una carta tocca la (i) sul suo angolo: compare passando il mouse o sulla carta scelta. Da tastiera premi I. Il timbro sotto il titolo dice il ruolo della carta, i bollini ▲ quali risorse ti dà, le monete in basso quanto costa: una carta più spenta, con «!» sul costo, oggi non te la puoi permettere (puoi provarla comunque, decide il server). Le tue risorse sono nel riquadro accanto al tuo personaggio: la barra piena è il valore iniziale. Per riordinare la mano trascina le carte; da tastiera Maiusc e frecce spostano la carta con il focus.</p><p>Se nessuna carta è giocabile il gioco non prevede di passare: è un limite noto di questa versione. Puoi abbandonare la partita.</p>
    <PressButton onClick={()=>setModal('report')}>Ultimo turno</PressButton><PressButton onClick={()=>{table?.stopEffects();close();}}>Salta effetti</PressButton><PressButton onClick={()=>{setTool(null);setModal('tools');}}>Strumenti</PressButton>{!finished&&<PressButton onClick={()=>setModal('leave')}>Abbandona la partita</PressButton>}</section>}
   {modal==='leave'&&<section className="menu"><h2>Abbandonare?</h2><p>Abbandonare è un forfait: la partita è persa e torni all’hub.</p><PressButton onClick={()=>{close();session.leave('hub');}}>Sì, abbandona</PressButton><PressButton onClick={close}>No, resto al tavolo</PressButton></section>}
   {modal==='report'&&<section className="report"><h2>Ultimo turno</h2>{view.resolvedMoves.length?view.resolvedMoves.map((m,i)=><div key={i} className="report-move"><h3>{i+1}. {m.playerId===me?'Tu':playerName(m.playerId)} → {m.targetId==='SELF'?'se stesso':m.targetId===me?'te':playerName(m.targetId)}: {m.playedCardName}{m.void?' · annullata':''}</h3>{Object.values(m.moveReport).flat().map((line,j)=><p key={j}>{line}</p>)}</div>):<p>Nessuna risoluzione disponibile.</p>}
    {Object.entries(view.timeBasedEffects).some(([,l])=>l.length)&&<><h3>Fine turno</h3>{Object.entries(view.timeBasedEffects).filter(([,l])=>l.length).map(([id,lines])=><p key={id}><b>{id===me?'Tu':playerName(id)}:</b> {lines.join(' ')}</p>)}</>}</section>}
   {modal==='tools'&&<section className="tools"><h2>Strumenti</h2><p>Dati già visibili a te, per diagnosi: nessuna mano altrui né ordine dei mazzi.</p><div className="tool-grid">
    <PressButton disabled={!choice} onClick={()=>showTool('Log Card',choice)}>Log Card</PressButton><PressButton onClick={()=>showTool('Log State',view.players[me].character)}>Log State</PressButton><PressButton onClick={()=>showTool('Log Item',Object.fromEntries(Object.entries(view.players).map(([id,p])=>[id,p.character.items])))}>Log Item</PressButton>
    <PressButton onClick={()=>showTool('Log JSON',{gameId:view.gameId,turn:view.turn,resolvedMoves:view.resolvedMoves,timeBasedEffects:view.timeBasedEffects,pendingMove:view.pendingMove,lastCommand:model.lastCommand})}>Log JSON</PressButton><PressButton onClick={()=>showTool('Trasporto',session.trace.slice(-40))}>Messaggi ricevuti</PressButton><PressButton onClick={()=>{close();session.dropConnection();}}>Simula disconnessione</PressButton></div>
    {tool&&<><h3>{tool.title}</h3><pre>{JSON.stringify(tool.data,null,2)??'—'}</pre></>}</section>}
  </dialog>
 </main>;
}

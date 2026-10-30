import React,{useEffect,useRef,useState} from 'react';
import type {Session} from './session.ts';
import type {Model} from './model.ts';
import {artCss,artIndex} from './art.ts';
import {TableScene,cost,subtype,type Hit,type Inspection} from './scene.ts';
import {playerName} from './presence.ts';
import {ROLES,roleOf,shortfall} from './readability.ts';
import {PressButton,effect,resourceNames,targetNames} from './ui.tsx';
import {outcome,forfeitLabel,secondsLeft,reconnecting} from './lifecycle.ts';
import {resolve,roundNote,type ResolutionFacts} from './resolution.ts';

type Modal='inspect'|'menu'|'report'|'tools'|'leave'|'logout';

/** The bar table for one game: Pixi scene plus HTML shell. All gestures end in Model intents; Session sends. */
export function Table({session,model}:{session:Session;model:Model}){
 const host=useRef<HTMLDivElement>(null),scene=useRef<TableScene|null>(null),dialog=useRef<HTMLDialogElement>(null),returnFocus=useRef<HTMLElement|null>(null),openedAt=useRef(0);
 const [,refresh]=useState(0),[hits,setHits]=useState<Hit[]>([]),[ready,setReady]=useState(false),[error,setError]=useState(''),[modal,setModal]=useState<Modal|null>(null),[inspection,setInspection]=useState<Inspection|null>(null),[clock,setClock]=useState<number|null>(null),[away,setAway]=useState<{id:string;seconds:number}[]>([]),[toast,setToast]=useState(''),[watching,setWatching]=useState(false);
 const [tool,setTool]=useState<{title:string;data:unknown}|null>(null),[hover,setHover]=useState<string|null>(null),[overInfo,setOverInfo]=useState<string|null>(null);
 const update=()=>refresh(x=>x+1);
 const me=model.me,view=model.view,ids=Object.keys(view.players),name=(id:string)=>playerName(id,ids);
 const close=()=>{setModal(null);setTimeout(()=>{if(returnFocus.current?.isConnected)returnFocus.current.focus();else document.querySelector<HTMLButtonElement>('.menu-button')?.focus();},0);};
 const open=(kind:Modal,inspect?:Inspection)=>{returnFocus.current=document.activeElement as HTMLElement;if(inspect)setInspection(inspect);setModal(kind);};
 useEffect(()=>{const table=new TableScene(model,()=>session.catalog,()=>session.characters);scene.current=table;let active=true;
  table.onLayout=()=>{if(active){const focused=document.activeElement?.getAttribute('data-hit');setHits([...table.hits]);if(focused&&!table.hits.some(h=>h.id===focused))requestAnimationFrame(()=>{if(!dialog.current?.open)document.querySelector<HTMLButtonElement>('[data-hit]')?.focus();});}};
  table.onState=()=>{if(active)update();};
  // Leaving the canvas for the (i) button must not hide it: clear the hover a moment later.
  let hoverTimer=0;table.onHover=id=>{clearTimeout(hoverTimer);if(id)setHover(id);else hoverTimer=window.setTimeout(()=>{if(active)setHover(null);},150);};table.onInspect=i=>open('inspect',i);table.onError=setError;
  table.init(host.current!).then(()=>{if(active){setReady(true);update();}}).catch(e=>setError(`Il tavolo non è disponibile: ${String(e)}`));
  // A short, non-blocking line per resolved round; the full report stays one tap away.
  // K5: the 6 s of the short summary run only while the tab is visible. D4: after a jump (or a round from an
  // earlier connection) a note replaces it and stays, like the static summary, until the first card choice or the
  // next round.
  let seen=model.round,toastTimer=0,left=0,since=0,note=false;
  const hide=()=>{clearTimeout(toastTimer);toastTimer=0;left=0;since=0;note=false;setToast('');};
  const arm=()=>{clearTimeout(toastTimer);toastTimer=0;since=0;if(left>0&&!document.hidden){since=Date.now();toastTimer=window.setTimeout(hide,left);}};
  const visibility=()=>{if(document.hidden){if(since)left=Math.max(0,left-(Date.now()-since));clearTimeout(toastTimer);toastTimer=0;since=0;}else arm();};
  document.addEventListener('visibilitychange',visibility);
  const unsubscribe=model.subscribe(why=>{update();
   if((why==='view'||why==='reset')&&model.round!==seen){seen=model.round;const v=model.view,eot=Object.values(v.timeBasedEffects).flat().length,line=roundNote(model.round);
    if(line){clearTimeout(toastTimer);toastTimer=0;left=0;note=true;setToast(line);}
    else if(why==='view'&&v.resolvedMoves.length){note=false;setToast(`Turno ${v.turn}: ${v.resolvedMoves.map(m=>`${m.playerId===me?'tu':playerName(m.playerId,Object.keys(v.players))} → ${m.playedCardName}${m.void?' (annullata)':''}`).join(' · ')}${eot?` · fine turno: ${eot} effett${eot===1?'o':'i'}`:''}`);left=6000;arm();}}
   else if(why==='choice'&&note&&model.selected)hide();});
  // C3-1: certain facts of each received view, exposed for the verification only; the scene does not use them yet.
  // Scene counters are read after every listener has run, so they belong to the same view.
  let held=model.view;const resolutions:{why:string;facts:ResolutionFacts;scene?:{sequences:number;cancels:string[];aggregateDeltas:number;flights:number;transfers:number}}[]=[];
  const record=model.subscribe(why=>{if(why!=='view'&&why!=='reset')return;const entry={why,facts:resolve(held,model.view,me,[...session.catalog,...model.hand.map(c=>c.card)])};held=model.view;resolutions.push(entry);if(resolutions.length>400)resolutions.shift();
   queueMicrotask(()=>{const s=table.stats;(entry as typeof resolutions[number]).scene={sequences:s.sequences,cancels:[...s.cancels],aggregateDeltas:s.aggregateDeltas,flights:s.flights,transfers:s.transfers};});});
  const esc=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!dialog.current?.open)table.escape();};window.addEventListener('keydown',esc);
  (window as any).__bm={get state(){return {phase:model.phase,turn:model.view.turn,over:model.view.over,winner:model.view.winner,eliminated:model.eliminated,me,order:model.hand.map(c=>({key:c.key,name:c.card.name})),selected:model.selected,target:model.target,discard:model.discard,commands:model.commandCount,lastCommand:model.lastCommand,message:model.message,drag:table.drag,ghostOver:table.ghostOver,backs:table.backs,stats:table.stats,hits:table.hits.map(({node,...hit})=>hit),readout:table.readout,layout:table.layout,peek:table.peek,statusShown:table.statusShown,resources:model.view.players[me]?.character.resources??{},cards:model.hand.map(c=>({key:c.key,name:c.card.name,cost:c.card.cost,role:c.card.role??null,gains:c.card.gains??null})),resolution:resolutions.at(-1)?.facts??null,sequence:{running:table.sequenceRunning,ends:table.stats.sequenceEnds,summaries:table.stats.summaries},summary:table.readout.summary,arrows:table.arrows.map(({id,owner,kind,itemIndex,from,control,to,head,reached,crosses})=>({id,owner,kind,itemIndex,from,control,to,head,reached,crosses})),aimAlpha:table.aimLayer.alpha,reduced:table.reduced,round:model.round?{key:model.round.facts.key,relation:model.round.facts.relation,crossed:model.round.crossed}:null};},measureStart:()=>table.startMeasure(),measureEnd:()=>table.endMeasure(),get resolutions(){return resolutions;}};
  return()=>{active=false;clearTimeout(toastTimer);document.removeEventListener('visibilitychange',visibility);clearTimeout(hoverTimer);unsubscribe();record();window.removeEventListener('keydown',esc);table.destroy();delete (window as any).__bm;};
 },[model]);
 // Indicative countdowns from the server epoch: they never decide a forfeit. vsCom has no move clock.
 useEffect(()=>{const timer=setInterval(()=>{const now=Date.now();setClock(secondsLeft(model.view.moveDeadlines?.[me],now));setAway(reconnecting(model.view,me,now));},250);return()=>clearInterval(timer);},[model]);
 useEffect(()=>{const s=scene.current;if(s){s.blocked=!!modal;if(modal)s.interrupt('dialog',true,false);}if(modal){if(!dialog.current?.open){dialog.current?.showModal();openedAt.current=performance.now();}dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();}else dialog.current?.close();},[modal]);
 const table=scene.current,choice=model.selectedCard;
 const targetLabel=model.target?`${model.target.owner===me?'te':name(model.target.owner)}${model.target.itemIndex!==undefined?` · ${view.players[model.target.owner].character.items[model.target.itemIndex].name}`:''}`:'';
 const finished=view.over||model.eliminated;
 // D11: after the own death (not a forfeit) the FFA goes on and can be watched until the outcome.
 const dead=!view.over&&!!view.players[me]?.character.dead&&!view.forfeits[me],panel=finished&&!(dead&&watching);
 // (i) on the hovered card (mouse), else on the selected or focused hand card (touch, keyboard).
 // Top-left corner: in the fan each card covers the right side of the previous one.
 const infoId=table?.drag||modal?null:overInfo??[hover,model.selected,table?.focused].find(x=>x&&!x.startsWith('status-'))??null,infoHit=hits.find(h=>h.id===infoId);
 // Status summary on hover, tap or focus: a short card above the chip, inside the viewport.
 const tip=modal||table?.drag?null:table?.statusShown??null;
 // The confirmation controls win over a nearby (i): it never covers ✓ or ×.
 const confirmAt=choice&&model.target&&!finished?{left:Math.min((table?.preview.x||0)+70,innerWidth-175),top:Math.max(50,(table?.preview.y||0)-30)}:null;
 const covers=(x:number,y:number)=>!!confirmAt&&x>confirmAt.left-26&&x<confirmAt.left+190&&y>confirmAt.top-26&&y<confirmAt.top+130;
 const info=infoHit&&(()=>{const r=Math.min(16,infoHit.w*.2),lx=-infoHit.w/2+r+2,ly=-infoHit.h/2+r+2,c=Math.cos(infoHit.angle),s=Math.sin(infoHit.angle);const cx=infoHit.x+lx*c-ly*s,cy=infoHit.y+lx*s+ly*c;return covers(cx,cy)?null:{id:infoHit.id,label:infoHit.label,cx,cy};})();
 const end=outcome(view,me,name);
 // D4: on the outcome panel too, the turns resolved without a difference are said, with the way to the last one.
 const jumpNote=roundNote(model.round);
 const inspectedArt=inspection?artIndex(inspection.card?.bindingName||view.players[inspection.owner!]?.character.bindingName||''):0;
 const inspectRole=inspection?.card?roleOf(inspection.card):null,inspectShort=inspection?.card?shortfall(inspection.card,view.players[me]?.character.resources??{}):[];
 const discardable=model.hand.filter(c=>!c.card.item&&!c.card.basicAction&&!c.card.characterBound&&!c.card.lastResort);
 const showTool=(title:string,data:unknown)=>{setTool({title,data});console.info(`[${title}]`,data);};
 return <main aria-label="Tavolo di Botte Micidiali">
  <div ref={host} className="table-host"/>
  <div className="semantic-layer" aria-label="Carte e bersagli">{hits.map(hit=><PressButton key={hit.id} data-hit={hit.id} className="semantic" aria-label={hit.label} aria-pressed={hit.kind==='hand'?model.selected===hit.key:undefined} style={{left:hit.x-hit.w/2,top:hit.y-hit.h/2,width:hit.w,height:hit.h,transform:`rotate(${hit.angle}rad)`}} onClick={()=>table?.activate(hit.id)} onFocus={()=>table?.focus(hit.id)} onBlur={()=>table?.focus(null)} onKeyDown={e=>table?.key(hit.id,e.nativeEvent)}><span>{hit.label}</span></PressButton>)}</div>
  <div className="brand" aria-hidden="true">BOTTE<br/>MICIDIALI</div>
  <div className="top-actions">{!panel&&away.map(a=><span key={a.id} className="clock away" role="status" aria-label={`${name(a.id)} è fuori linea: rientro entro ${a.seconds} secondi`}>{name(a.id)} fuori linea · {a.seconds} s</span>)}{clock!==null&&!finished&&<span className="clock" aria-label="Tempo indicativo per la mossa">◷ {model.phase==='pending'?'—':`${clock} s`}</span>}<span className="turn" aria-label={`Turno ${view.turn+1}`}>T{view.turn+1}</span><PressButton className="menu-button round" aria-label="Apri menu" onClick={()=>open('menu')}>•••</PressButton></div>
  {!panel&&!confirmAt&&<p className={`hint ${model.phase}${model.phase==='choose'&&!dead&&/^Scegli /.test(model.message)?' ask':''}`} role="status" aria-live="polite">{dead?'Sei fuori: guardi fino all’esito':model.message}</p>}
  {/* FFA: one line, so the summary does not cover the seats at the top; the full report stays one tap away. */}
  {toast&&!panel&&<PressButton className={`toast${ids.length>2?' brief':''}`} onClick={()=>open('report')}>{toast}</PressButton>}
  {tip&&<div className={`status-tip ${tip.kind}`} role="tooltip" data-testid="status-tip" style={{left:Math.max(8,Math.min(tip.x-120,innerWidth-248)),top:tip.y>150?undefined:tip.y+30,bottom:tip.y>150?innerHeight-tip.y+6:undefined}}><strong>{tip.title}</strong><span>{tip.text}</span></div>}
  {info&&<PressButton key={info.id} className="info" data-testid="info" aria-label={`Dettagli: ${info.label}`} style={{left:info.cx,top:info.cy}} onPointerEnter={()=>setOverInfo(info.id)} onPointerLeave={()=>setOverInfo(null)} onClick={()=>{setOverInfo(null);table?.inspect(info.id);}}>i</PressButton>}
  {choice&&model.target&&!finished&&<div className="confirmation" style={confirmAt!}>
   <span role="status" aria-live="polite">{choice.name}<br/>→ {targetLabel}<br/><em>{model.message}</em>{choice.characterBound&&!discardable.length&&<><br/>Nessuna regolare da scartare</>}</span><div><PressButton data-testid="confirm" disabled={!model.ready||!!error||!session.connected} aria-label="Conferma calata" onClick={()=>session.submit()}>✓</PressButton><PressButton aria-label="Annulla calata" disabled={model.phase!=='choose'} onClick={()=>model.cancel()}>×</PressButton></div></div>}
  {panel&&<section className="outcome" aria-label="Esito"><h2>{end.title}</h2><p>{end.reason}</p>{end.lines.map(line=><p key={line} className="why">{line}</p>)}{jumpNote&&<p className="why" data-testid="round-note">{jumpNote}</p>}
   <div>{dead&&<PressButton data-testid="watch" onClick={()=>setWatching(true)}>Resta a guardare</PressButton>}<PressButton data-testid="again" onClick={()=>session.leave('again')}>Nuova partita</PressButton><PressButton onClick={()=>session.leave('hub')}>Torna all’hub</PressButton><PressButton onClick={()=>open('report')}>Ultimo turno</PressButton></div></section>}
  {!ready&&!error&&<div className="loading">Preparo il tavolo…</div>}
  {error&&<div className="error" role="alert">{error}</div>}
  <div className="portrait"><strong>Il tavolo va in orizzontale.</strong><p>Ruota lo schermo per distinguere le carte e raggiungere i bersagli.</p><p>La selezione è interrotta; il tempo continua.</p></div>
  {/* A touch that opens a dialog from the table is followed by its compatibility click, which lands on the backdrop: ignore it. */}
  <dialog ref={dialog} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===dialog.current&&performance.now()-openedAt.current>500)close();}}>
   <PressButton className="close round" onClick={close} aria-label="Chiudi">×</PressButton>
   {modal==='inspect'&&inspection&&<section className="inspection"><div className="large-card"><h2>{inspection.title}</h2><div className="art" style={artCss(inspectedArt)}/>{inspection.card&&<p>{subtype(inspection.card)}<br/>{inspection.card.item?'Si usa tramite un’azione':<>{cost(inspection.card)} · Priorità {inspection.card.priority}</>}</p>}</div><div className="receipt"><h2>{inspection.title}</h2>
    {inspection.card?<><p>{subtype(inspection.card).toLocaleLowerCase('it')}{inspection.owner?` · di ${inspection.owner===me?'te':name(inspection.owner)}`:''}</p>{!inspection.card.item&&!inspection.owner&&inspectShort.length>0&&<p className="short">Con le risorse attuali non basta: mancano {inspectShort.map(k=>resourceNames[k].toLowerCase()).join(', ')}. Puoi comunque provarla: decide il server.</p>}{inspection.card.item&&inspectRole&&<p>Ruolo: {ROLES[inspectRole].label.toLowerCase()}{inspection.card.gains&&inspection.card.gains!=='—'?` · ti dà ${inspection.card.gains}`:''}</p>}{inspection.card.item?<p>Si trova sul tavolo. Per consumarlo serve un’azione appropriata: conta la priorità di quell’azione.</p>:<dl><dt>Costo</dt><dd>{Object.entries(inspection.card.cost).map(([k,v])=>`${v} ${resourceNames[k]}`).join(' + ')||'Nessun costo in risorse'}</dd><dt>Priorità</dt><dd>{inspection.card.priority}</dd>{inspectRole&&<><dt>Ruolo</dt><dd>{ROLES[inspectRole].label.toLowerCase()}: {ROLES[inspectRole].hint}</dd></>}{inspection.card.gains&&inspection.card.gains!=='—'&&<><dt>Ti dà</dt><dd>{inspection.card.gains}</dd></>}<dt>Bersaglio</dt><dd>{inspection.card.canTarget.map(t=>targetNames[t]).join(' / ')}</dd></dl>}<p className="full-text">{effect(inspection.card)}</p>{inspection.card.characterBound&&<p>Resta in mano. Richiede lo scarto di un’altra azione regolare.</p>}{inspection.card.basicAction&&<p>Resta in mano e richiede un oggetto vicino.</p>}</>
    :<><p>{inspection.owner===me?'Tu':name(inspection.owner!)}{name(inspection.owner!)!==inspection.owner?<> · <span data-testid="player-id">ID {inspection.owner}</span></>:''}{view.forfeits[inspection.owner!]?` · ${inspection.owner===me?'forfait':forfeitLabel(view.forfeits[inspection.owner!])}`:view.players[inspection.owner!].character.dead?' · eliminato':''}</p><dl>{Object.entries(view.players[inspection.owner!].character.resources).map(([k,v])=><React.Fragment key={k}><dt>{resourceNames[k]}</dt><dd>{v}</dd></React.Fragment>)}<dt>Oggetti</dt><dd>{view.players[inspection.owner!].character.items.length} / {view.players[inspection.owner!].character.itemsSize}</dd><dt>Mazzo</dt><dd>{view.players[inspection.owner!].deck} carte</dd></dl><h3>Stati ed equipaggiamenti</h3>{view.players[inspection.owner!].character.statuses.map((s,i)=><p key={i}>{s.equip?'Equip · ':''}{s.name}: {s.description} · durata {s.lastsForTurns??'illimitata'}</p>)}{!view.players[inspection.owner!].character.statuses.length&&<p>Nessuno.</p>}<p>Immunità: {view.players[inspection.owner!].character.immunities.map(k=>resourceNames[k]).join(', ')||'nessuna'}</p>{view.players[inspection.owner!].character.timers.map((t,i)=><p key={i}>Timer {t.name}: {t.timer}</p>)}</>}
    <PressButton onClick={close}>Torna al tavolo</PressButton></div></section>}
   {modal==='menu'&&<section className="menu"><h2>Al tavolo</h2><p>Scegli una carta e un bersaglio, poi conferma con ✓. Puoi anche trascinare la carta sul bersaglio. Le mosse sono simultanee: il turno si risolve quando tutti hanno scelto.</p><p>Per leggere una carta tocca la (i) sul suo angolo: compare passando il mouse o sulla carta scelta. Da tastiera premi I. Il timbro sotto il titolo dice il ruolo della carta, i bollini ▲ quali risorse ti dà, le monete in basso quanto costa: una carta più spenta, con «!» sul costo, oggi non te la puoi permettere (puoi provarla comunque, decide il server). Le tue risorse sono nel riquadro accanto al tuo personaggio: la barra piena è il valore iniziale. Per riordinare la mano trascina le carte; da tastiera Maiusc e frecce spostano la carta con il focus.</p><p>Se nessuna carta è giocabile il gioco non prevede di passare: è un limite noto di questa versione. Puoi abbandonare la partita.</p>
    <PressButton onClick={()=>setModal('report')}>Ultimo turno</PressButton><PressButton onClick={()=>{table?.skip();close();}}>Salta effetti</PressButton><PressButton onClick={()=>{setTool(null);setModal('tools');}}>Strumenti</PressButton>{!finished&&<PressButton onClick={()=>setModal('leave')}>Abbandona la partita</PressButton>}{dead&&watching&&<PressButton onClick={()=>{close();session.leave('hub');}}>Torna all’hub</PressButton>}<PressButton onClick={()=>setModal('logout')}>Esci dall’account</PressButton></section>}
   {modal==='leave'&&<section className="menu"><h2>Abbandonare?</h2><p>Abbandonare è un forfait: la partita è persa e torni all’hub.</p><PressButton onClick={()=>{close();session.leave('hub');}}>Sì, abbandona</PressButton><PressButton onClick={close}>No, resto al tavolo</PressButton></section>}
   {modal==='logout'&&<section className="menu"><h2>Uscire dall’account?</h2><p>{finished?'La partita è conclusa: esci e torni all’accesso.':'Uscire durante la partita è un forfait: la partita è persa e torni all’accesso.'}</p><PressButton onClick={()=>{close();void session.logout();}}>Sì, esci</PressButton><PressButton onClick={close}>No, resto al tavolo</PressButton></section>}
   {modal==='report'&&<section className="report"><h2>Ultimo turno</h2>{view.resolvedMoves.length?view.resolvedMoves.map((m,i)=><div key={i} className="report-move"><h3>{i+1}. {m.playerId===me?'Tu':name(m.playerId)} → {m.targetId==='SELF'?'se stesso':m.targetId===me?'te':name(m.targetId)}: {m.playedCardName}{m.void?' · annullata':''}</h3>{Object.values(m.moveReport).flat().map((line,j)=><p key={j}>{line}</p>)}</div>):<p>Nessuna risoluzione disponibile.</p>}
    {Object.entries(view.timeBasedEffects).some(([,l])=>l.length)&&<><h3>Fine turno</h3>{Object.entries(view.timeBasedEffects).filter(([,l])=>l.length).map(([id,lines])=><p key={id}><b>{id===me?'Tu':name(id)}:</b> {lines.join(' ')}</p>)}</>}</section>}
   {modal==='tools'&&<section className="tools"><h2>Strumenti</h2><p>Dati già visibili a te, per diagnosi: nessuna mano altrui né ordine dei mazzi.</p><div className="tool-grid">
    <PressButton disabled={!choice} onClick={()=>showTool('Log Card',choice)}>Log Card</PressButton><PressButton onClick={()=>showTool('Log State',view.players[me].character)}>Log State</PressButton><PressButton onClick={()=>showTool('Log Item',Object.fromEntries(Object.entries(view.players).map(([id,p])=>[id,p.character.items])))}>Log Item</PressButton>
    <PressButton onClick={()=>showTool('Log JSON',{gameId:view.gameId,turn:view.turn,resolvedMoves:view.resolvedMoves,timeBasedEffects:view.timeBasedEffects,pendingMove:view.pendingMove,lastCommand:model.lastCommand})}>Log JSON</PressButton><PressButton onClick={()=>showTool('Trasporto',session.trace.slice(-40))}>Messaggi ricevuti</PressButton><PressButton onClick={()=>showTool('Giocatori',Object.fromEntries(ids.map(id=>[id,id===me?'Tu':name(id)])))}>Giocatori</PressButton><PressButton onClick={()=>{close();session.dropConnection();}}>Simula disconnessione</PressButton></div>
    {tool&&<><h3>{tool.title}</h3><pre>{JSON.stringify(tool.data,null,2)??'—'}</pre></>}</section>}
  </dialog>
 </main>;
}

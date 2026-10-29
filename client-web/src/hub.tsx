import React,{useEffect,useRef,useState} from 'react';
import type {Session,Mode} from './session.ts';
import {PressButton} from './ui.tsx';
import {Collection} from './collection.tsx';
import {Profile} from './profile.tsx';
import {PAGE_SIZES,activityLabel,presencePage,queueNames,type PresenceSort} from './presence.ts';

const modes:{id:Mode;label:string;hint:string}[]=[
 {id:'quick/1vCom',label:'Contro il computer',hint:'Partita rapida, subito.'},
 {id:'quick/1v1',label:'Uno contro uno',hint:'Contro un altro giocatore: aspetti finché ne arriva uno.'},
 {id:'quick/ffa',label:'Tutti contro tutti',hint:'Fino a cinque al tavolo: parte da sola a cinque, oppure aggiungi computer e inizia con almeno due.'},
 {id:'open/1vCom',label:'Con un tuo mazzo',hint:'Contro il computer, con un mazzo salvato nella collezione.'}
];

/** Online users: who is where, sortable by column, in pages of 5, 10 or 20. */
function Presence({session}:{session:Session}){
 const [sort,setSort]=useState<PresenceSort>({by:'userLogin',asc:true}),[size,setSize]=useState<number>(5),[page,setPage]=useState(0);
 const view=presencePage(session.presence,sort,size,page);
 const by=(column:PresenceSort['by'])=>setSort(s=>({by:column,asc:s.by===column?!s.asc:true}));
 const head=(column:PresenceSort['by'],label:string)=><th scope="col" aria-sort={sort.by===column?(sort.asc?'ascending':'descending'):'none'}><PressButton className="link" onClick={()=>by(column)}>{label}{sort.by===column?(sort.asc?' ▲':' ▼'):''}</PressButton></th>;
 return <section className="presence" aria-label="Presenza">
  <h2>Al bar <span data-testid="presence-count">{view.total}</span></h2>
  <table><thead><tr>{head('userLogin','Giocatore')}{head('activity','Attività')}</tr></thead>
   <tbody>{view.rows.map(u=><tr key={u.userLogin} className={u.userLogin===session.user?'me':undefined}><td>{u.userLogin}{u.userLogin===session.user?' (tu)':''}</td><td>{activityLabel(u.activity)}</td></tr>)}</tbody></table>
  <div className="pager">
   <PressButton aria-label="Pagina precedente" disabled={view.page===0} onClick={()=>setPage(view.page-1)}>‹</PressButton>
   <span>{view.page+1} / {view.pages}</span>
   <PressButton aria-label="Pagina successiva" disabled={view.page>=view.pages-1} onClick={()=>setPage(view.page+1)}>›</PressButton>
   <label>Righe <select value={size} onChange={e=>{setSize(Number(e.target.value));setPage(0);}}>{PAGE_SIZES.map(n=><option key={n} value={n}>{n}</option>)}</select></label>
  </div>
 </section>;
};

/** FFA queue (P13–P15): who sits at the table in join order and the empty seats; computers and the early start sit with the queue actions. */
function FfaQueue({session}:{session:Session}){
 const seats=queueNames(session.ffaQueue,session.user);
 return <ol className="ffa-queue" data-testid="ffa-list" aria-label="Al tavolo tutti contro tutti">{seats.map((s,i)=><li key={i} className={s.me?'me':s.human?undefined:'bot'}>{s.label}</li>)}{Array.from({length:Math.max(0,5-seats.length)},(_,i)=><li key={`free-${i}`} className="free">posto libero</li>)}</ol>;
}

/** Open 1vCom (P16): choose one of the saved decks; none saved sends to the collection. */
function DeckDialog({session,onClose,onCollection}:{session:Session;onClose:()=>void;onCollection:()=>void}){
 const ref=useRef<HTMLDialogElement>(null),decks=[...session.decks].sort((a,b)=>a.deckId.localeCompare(b.deckId));
 const [chosen,setChosen]=useState<string|null>(decks.some(d=>d.deckId===session.openDeck)?session.openDeck:null);
 useEffect(()=>{const d=ref.current;if(d&&!d.open)d.showModal();},[]);
 return <dialog ref={ref} aria-label="Scegli il mazzo" data-testid="deck-dialog" onCancel={e=>{e.preventDefault();onClose();}}>
  <h2>Scegli il mazzo</h2>
  {!decks.length?<p data-testid="no-saved-decks">Nessun mazzo salvato. Creane uno nella collezione, poi torna qui.</p>
  :<div role="radiogroup" aria-label="Mazzi salvati" className="deck-choice">{decks.map(d=><PressButton key={d.deckId} role="radio" aria-checked={chosen===d.deckId} className={chosen===d.deckId?'on':undefined} onClick={()=>setChosen(d.deckId)}>
    <strong>{d.deckId}</strong> <small>{d.character.name} · {d.regularCards.length} regolari</small></PressButton>)}</div>}
  <div className="actions">
   {decks.length?<PressButton data-testid="start-open" className="primary" disabled={!chosen} onClick={()=>{onClose();if(chosen)session.join('open/1vCom',chosen);}}>Inizia</PressButton>
   :<PressButton className="primary" onClick={()=>{onClose();onCollection();}}>Vai alla collezione</PressButton>}
   <PressButton data-testid="cancel-open" onClick={onClose}>Annulla</PressButton>
  </div>
 </dialog>;
}

type Tab='play'|'collection'|'profile';

/** Hub with the "Gioca", "Collezione" and "Profilo" tabs: mode picker, queue wait with exit, online users; decks and catalog; account and admin panel. */
export function Hub({session}:{session:Session}){
 const [choice,setChoice]=useState<Mode>(session.mode??'quick/1vCom'),[tab,setTab]=useState<Tab>('play'),[picking,setPicking]=useState(false);
 const receipt=session.receipt,waiting=session.phase==='queue',queued=session.queued!==null,entering=waiting&&!queued;
 const picked=modes.find(m=>m.id===choice)!;
 const tabButton=(id:Tab,label:string)=><button role="tab" aria-selected={tab===id} data-testid={`tab-${id}`} className={`tab${tab===id?' on':''}`} disabled={waiting&&id!==tab} onClick={()=>{if(id!==tab){session.clearMessages();setTab(id);}}}>{label}</button>;
 return <section className={`sheet hub${tab==='collection'?' wide':''}`} aria-label="Hub">
  <div className="hub-head"><h1>Ciao, {session.user}</h1>
   <div role="tablist" aria-label="Sezioni" className="tabs">{tabButton('play','Gioca')}{tabButton('collection','Collezione')}{tabButton('profile','Profilo')}</div></div>
  {receipt?.outcome&&<p className="notice" role="status">Pareggio — {receipt.outcome.reason}. La partita precedente è chiusa: puoi iniziarne un’altra.</p>}
  {session.notice&&<p className="notice" role="status">{session.notice}</p>}
  {session.error&&<p className="problem" role="alert">{session.error}</p>}
  {tab==='collection'?<Collection session={session}/>:tab==='profile'?<Profile session={session}/>:<div className="hub-grid">
   <div className={`play${waiting?' waiting':''}`}>
    <div role="radiogroup" aria-label="Modalità" className="modes">{modes.map(m=><PressButton key={m.label} role="radio" aria-checked={m.id===choice} disabled={waiting} className={`mode${m.id===choice?' on':''}`} onClick={()=>setChoice(m.id)}>{m.label}</PressButton>)}</div>
    {!waiting&&<p className="small">{picked.hint}{choice==='open/1vCom'?'':' Personaggio assegnato a caso.'}</p>}
    {waiting&&<p className="notice" role="status" data-testid="waiting">{entering?'Entro nella partita…':session.queued==='quick/1v1'?'In attesa di un altro giocatore…':session.queued==='quick/ffa'?(session.starting?'Si parte…':`Al tavolo ${session.ffaQueue.length} su 5: si parte da soli a cinque.`):session.queued==='open/1vCom'?`Preparo il tavolo con «${session.openDeck}»…`:'Cerco un posto al tavolo…'}</p>}
    {session.queued==='quick/ffa'&&<FfaQueue session={session}/>}
    <div className="actions">
     {!waiting&&<PressButton data-testid="quick" className="primary" onClick={()=>choice==='open/1vCom'?setPicking(true):session.join(choice)}>Gioca</PressButton>}
     {session.queued==='quick/ffa'&&<>
      <PressButton data-testid="add-computer" disabled={!session.canAddComputer} onClick={()=>session.addComputer()}>Aggiungi computer</PressButton>
      <PressButton data-testid="start-now" disabled={!session.canStart} title={session.ffaQueue.length<2?'Serve almeno un altro giocatore o un computer':undefined} onClick={()=>session.startNow()}>Inizia ora</PressButton></>}
     {queued&&<PressButton data-testid="leave-queue" className="primary" disabled={session.leavingQueue} onClick={()=>session.leaveQueue()}>{session.leavingQueue?'Esco dalla coda…':'Esci dalla coda'}</PressButton>}
     {!waiting&&<PressButton onClick={()=>void session.logout()}>Esci</PressButton>}
    </div>
   </div>
   <Presence session={session}/>
  </div>}
  {picking&&<DeckDialog session={session} onClose={()=>setPicking(false)} onCollection={()=>setTab('collection')}/>}
 </section>;
}

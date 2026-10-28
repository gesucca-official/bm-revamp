import React,{useState} from 'react';
import type {Session,Mode} from './session.ts';
import {PressButton} from './ui.tsx';
import {PAGE_SIZES,activityLabel,presencePage,queueNames,type PresenceSort} from './presence.ts';

const modes:{id:Mode|null;label:string;hint:string}[]=[
 {id:'quick/1vCom',label:'Contro il computer',hint:'Partita rapida, subito.'},
 {id:'quick/1v1',label:'Uno contro uno',hint:'Contro un altro giocatore: aspetti finché ne arriva uno.'},
 {id:'quick/ffa',label:'Tutti contro tutti',hint:'Fino a cinque al tavolo: parte da sola a cinque, oppure aggiungi computer e inizia con almeno due.'},
 {id:null,label:'Open con un tuo mazzo',hint:'Arriva in un prossimo blocco: per ora nel client debug.'}
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

/** Hub with the "Gioca" tab: mode picker, queue wait with exit, online users. */
export function Hub({session}:{session:Session}){
 const [choice,setChoice]=useState<Mode>(session.mode??'quick/1vCom');
 const receipt=session.receipt,waiting=session.phase==='queue',queued=session.queued!==null,entering=waiting&&!queued;
 const picked=modes.find(m=>m.id===choice)!;
 return <section className="sheet hub" aria-label="Hub">
  <div className="hub-head"><h1>Ciao, {session.user}</h1>
   <div role="tablist" aria-label="Sezioni" className="tabs"><button role="tab" aria-selected="true" className="tab">Gioca</button></div></div>
  {receipt?.outcome&&<p className="notice" role="status">Pareggio — {receipt.outcome.reason}. La partita precedente è chiusa: puoi iniziarne un’altra.</p>}
  {session.notice&&<p className="notice" role="status">{session.notice}</p>}
  {session.error&&<p className="problem" role="alert">{session.error}</p>}
  <div className="hub-grid">
   <div className={`play${waiting?' waiting':''}`}>
    <div role="radiogroup" aria-label="Modalità" className="modes">{modes.map(m=><PressButton key={m.label} role="radio" aria-checked={m.id===choice} aria-disabled={m.id===null||undefined} disabled={waiting||m.id===null} className={`mode${m.id===choice?' on':''}`} onClick={()=>m.id&&setChoice(m.id)}>{m.label}</PressButton>)}</div>
    {!waiting&&<p className="small">{picked.hint} Personaggio assegnato a caso.</p>}
    {waiting&&<p className="notice" role="status" data-testid="waiting">{entering?'Entro nella partita…':session.queued==='quick/1v1'?'In attesa di un altro giocatore…':session.queued==='quick/ffa'?(session.starting?'Si parte…':`Al tavolo ${session.ffaQueue.length} su 5: si parte da soli a cinque.`):'Cerco un posto al tavolo…'}</p>}
    {session.queued==='quick/ffa'&&<FfaQueue session={session}/>}
    <div className="actions">
     {!waiting&&<PressButton data-testid="quick" className="primary" onClick={()=>session.join(choice)}>Gioca</PressButton>}
     {session.queued==='quick/ffa'&&<>
      <PressButton data-testid="add-computer" disabled={!session.canAddComputer} onClick={()=>session.addComputer()}>Aggiungi computer</PressButton>
      <PressButton data-testid="start-now" disabled={!session.canStart} title={session.ffaQueue.length<2?'Serve almeno un altro giocatore o un computer':undefined} onClick={()=>session.startNow()}>Inizia ora</PressButton></>}
     {queued&&<PressButton data-testid="leave-queue" className="primary" disabled={session.leavingQueue} onClick={()=>session.leaveQueue()}>{session.leavingQueue?'Esco dalla coda…':'Esci dalla coda'}</PressButton>}
     {!waiting&&<PressButton onClick={()=>void session.logout()}>Esci</PressButton>}
    </div>
   </div>
   <Presence session={session}/>
  </div>
 </section>;
}

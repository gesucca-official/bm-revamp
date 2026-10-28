import React,{useEffect,useRef,useState} from 'react';
import type {Session} from './session.ts';
import {PressButton} from './ui.tsx';
import {adminApi,adminMessage,type AdminApi,type GameLogRecord,type LogKind} from './net/rest.ts';

const titles:Record<LogKind,string>={games:'Partite registrate',client:'Log del client web'};
const files:Record<LogKind,string>={games:'bm-log-partite',client:'bm-log-client'};
const stamp=()=>new Date().toISOString().slice(0,19).replace(/[-:]/g,'').replace('T','-');

/** Saves the drained JSON as a file: the browser download, without opening a new tab. */
function save(text:string,name:string){
 const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

/**
 * Admin panel of the debug (P40–P43), shown only for the ADMIN role of the STOMP profile. The log endpoints need a
 * separate HTTP Basic identity: the browser asks for it with its own prompt (D6), the client never sees it.
 * One operation at a time; counts first one then the other, so the browser asks once. 401/403 is never a success.
 */
function AdminPanel({api}:{api:AdminApi}){
 const [counts,setCounts]=useState<Partial<Record<LogKind,number>>>({}),[busy,setBusy]=useState<string|null>('counts'),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [confirm,setConfirm]=useState<LogKind|null>(null),[open,setOpen]=useState<GameLogRecord[]|null>(null),live=useRef(true);
 const run=async(what:string,fn:()=>Promise<string|void>)=>{
  setBusy(what);setError('');setNotice('');
  try{const done=await fn();if(live.current&&done)setNotice(done);}
  catch(e){if(live.current)setError(adminMessage(e as {status:number|null}));}
  finally{if(live.current)setBusy(null);}
 };
 const load=async()=>{setCounts({});const games=await api.count('games');if(!live.current)return;setCounts({games});const client=await api.count('client');if(live.current)setCounts({games,client});};
 useEffect(()=>{live.current=true;void run('counts',load);return()=>{live.current=false;};},[]);
 const drain=(kind:LogKind)=>run(`drain-${kind}`,async()=>{const {text,records}=await api.drain(kind),name=`${files[kind]}-${stamp()}.json`;save(text,name);return `Scaricato ${name}: ${records} record.`;});
 const clear=(kind:LogKind)=>run(`clear-${kind}`,async()=>{await api.clear(kind);setConfirm(null);if(kind==='games')setOpen(null);
  // The delete is confirmed by the server: a failed count refresh afterwards does not turn it into an error.
  try{await load();}catch(e){return `${titles[kind]}: log cancellati. Conteggi non aggiornati: ${adminMessage(e as {status:number|null})}`;}
  return `${titles[kind]}: log cancellati.`;});
 const showOpen=()=>run('open',async()=>{const games=await api.openGames();setOpen(games);return games.length?'':'Nessuna partita in corso nel log.';});
 const idle=busy===null,authorized=counts.games!==undefined;
 const card=(kind:LogKind,label:string,extra?:React.ReactNode)=><div className="admin-log" data-testid={`admin-${kind}`}>
  <h3>{titles[kind]}</h3><p>{label}: <b data-testid={`count-${kind}`}>{counts[kind]??'—'}</b></p>
  {confirm===kind?<div className="actions confirm" role="group" aria-label={`Conferma cancellazione: ${titles[kind]}`}>
    <span>Cancellare dal database tutti i record ({counts[kind]??'?'})? Non si può annullare.</span>
    <PressButton data-testid={`confirm-clear-${kind}`} className="danger" disabled={!idle} onClick={()=>void clear(kind)}>{busy===`clear-${kind}`?'Cancello…':'Sì, cancella'}</PressButton>
    <PressButton data-testid={`cancel-clear-${kind}`} disabled={!idle} onClick={()=>setConfirm(null)}>Annulla</PressButton></div>
  :<div className="actions">{extra}
    <PressButton data-testid={`drain-${kind}`} disabled={!idle} onClick={()=>void drain(kind)}>{busy===`drain-${kind}`?'Scarico…':'Scarica'}</PressButton>
    <PressButton data-testid={`clear-${kind}`} className="danger" disabled={!idle||!authorized} onClick={()=>{setNotice('');setConfirm(kind);}}>Cancella</PressButton></div>}
 </div>;
 return <section className="admin" aria-label="Amministrazione" data-testid="admin-panel">
  <h2>Amministrazione</h2>
  <p className="small">I log richiedono le credenziali HTTP del server, separate dall’account di gioco: le chiede il browser con la sua finestra, il client non le vede e non le conserva.</p>
  {busy==='counts'&&<p className="notice" role="status" data-testid="admin-loading">Leggo i conteggi…</p>}
  {notice&&<p className="notice" role="status" data-testid="admin-notice">{notice}</p>}
  {error&&<p className="problem" role="alert" data-testid="admin-error">{error}</p>}
  {!authorized&&idle&&<PressButton data-testid="admin-retry" onClick={()=>void run('counts',load)}>Riprova</PressButton>}
  <div className="admin-grid">
   {card('games','Partite nel log',<PressButton data-testid="open-games" disabled={!idle} onClick={()=>void showOpen()}>{busy==='open'?'Leggo…':'Non concluse'}</PressButton>)}
   {card('client','Righe salvate')}
  </div>
  {open&&open.length>0&&<div className="table-scroll" data-testid="open-list"><table className="open-games"><caption>Partite non concluse ({open.length})</caption>
   <thead><tr><th scope="col">Partita</th><th scope="col">Tipo</th><th scope="col">Giocatori</th><th scope="col">Data</th><th scope="col">Stato</th></tr></thead>
   <tbody>{open.map(g=><tr key={g.gameId}><td>{g.gameId}</td><td>{g.type??'—'}</td><td>{g.players??'—'}</td><td>{g.date??'—'}</td><td>{g.status??'—'}</td></tr>)}</tbody></table></div>}
 </section>;
}

/** "Profilo" tab (P09): what account/data says, nothing to edit. The admin panel only for the ADMIN role. */
export function Profile({session,api=adminApi()}:{session:Session;api?:AdminApi}){
 const account=session.account;
 if(!account)return <p className="small">Profilo non disponibile.</p>;
 return <section className="profile" aria-label="Profilo" data-testid="profile">
  <dl className="profile-data">
   <dt>Nome</dt><dd data-testid="profile-username">{account.username}</dd>
   <dt>Email</dt><dd data-testid="profile-email">{account.email||'—'}</dd>
   <dt>Ruolo</dt><dd data-testid="profile-role">{account.role}</dd>
  </dl>
  <p className="small">Il profilo non si modifica da qui; il recupero della password non è disponibile.</p>
  {account.role==='ADMIN'&&<AdminPanel api={api}/>}
 </section>;
}

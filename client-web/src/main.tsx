import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Session} from './session.ts';
import {stompConnector} from './net/stomp.ts';
import {Table} from './table.tsx';
import {PressButton} from './ui.tsx';
import './style.css';

const session=new Session(stompConnector);

function Login(){
 const [user,setUser]=useState(''),[password,setPassword]=useState('');
 const busy=session.phase==='connecting';
 return <form className="sheet" aria-label="Accesso" onSubmit={e=>{e.preventDefault();void session.login(user.trim(),password);}}>
  <h1>Botte Micidiali</h1><p className="tagline">Il tavolo in fondo al bar è libero.</p>
  <label>Nome<input autoComplete="username" value={user} onChange={e=>setUser(e.target.value)} required disabled={busy}/></label>
  <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={busy}/></label>
  {session.error&&<p className="problem" role="alert">{session.error}</p>}
  <PressButton type="submit" disabled={busy||!user.trim()||!password}>{busy?'Mi siedo…':'Siediti al tavolo'}</PressButton>
 </form>;
}

function Hub(){
 const receipt=session.receipt,queued=session.phase==='queue';
 return <section className="sheet" aria-label="Hub">
  <h1>Ciao, {session.user}</h1>
  {receipt?.outcome&&<p className="notice" role="status">Pareggio — {receipt.outcome.reason}. La partita precedente è chiusa: puoi iniziarne un’altra.</p>}
  {session.notice&&<p className="notice" role="status">{session.notice}</p>}
  {session.error&&<p className="problem" role="alert">{session.error}</p>}
  <PressButton data-testid="quick" className="primary" disabled={queued} onClick={()=>session.quick()}>{queued?'Cerco un posto al tavolo…':'Partita rapida contro il computer'}</PressButton>
  <p className="small">Personaggio assegnato a caso. Le altre modalità sono ancora nel client debug.</p>
  <PressButton disabled={queued} onClick={()=>void session.logout()}>Esci</PressButton>
 </section>;
}

function Lost(){
 const busy=session.phase==='connecting';
 return <section className="sheet lost" role="alertdialog" aria-label="Connessione interrotta">
  <h1>Linea caduta</h1>
  <p className="problem">{session.error||'Connessione interrotta.'}</p>
  <p className="small">Nessuna mossa viene reinviata da sola: dopo il rientro vedrai lo stato che il server conserva.</p>
  <PressButton className="primary" disabled={busy} onClick={()=>void session.rejoin()}>{busy?'Rientro…':'Rientra'}</PressButton>
  <PressButton disabled={busy} onClick={()=>void session.logout()}>Esci</PressButton>
 </section>;
}

function App(){
 const [,refresh]=useState(0);
 useEffect(()=>session.subscribe(()=>refresh(x=>x+1)),[]);
 const model=session.model;
 // The table stays mounted while rejoining, so the last authoritative state remains visible.
 if(model&&(session.phase==='game'||session.phase==='lost'||session.phase==='connecting'))return <>
  <Table key={model.view.gameId} session={session} model={model}/>
  {session.phase!=='game'&&<div className="overlay"><Lost/></div>}
 </>;
 return <div className="backdrop">{session.phase==='lost'?<Lost/>:session.phase==='hub'||session.phase==='queue'?<Hub/>:<Login/>}</div>;
}

createRoot(document.getElementById('root')!).render(<App/>);

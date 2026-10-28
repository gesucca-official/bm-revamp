import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Session} from './session.ts';
import {stompConnector} from './net/stomp.ts';
import {Table} from './table.tsx';
import {Hub} from './hub.tsx';
import {PressButton} from './ui.tsx';
import {Home,Rules,SignUp,go} from './public.tsx';
import {routeOf,type Route} from './signup.ts';
import {errorReporter,installReporter} from './report.ts';
import './style.css';

const session=new Session(stompConnector);
// Unhandled errors go to the server log (P44): one at a time, 5 s, never the credentials or game data.
const reporter=errorReporter({secrets:()=>session.secrets()});
installReporter(reporter);
(window as any).__bmReports=reporter.stats;

function Login(){
 const [user,setUser]=useState(''),[password,setPassword]=useState('');
 const busy=session.phase==='connecting';
 return <form className="sheet public" aria-label="Accesso" onSubmit={e=>{e.preventDefault();void session.login(user.trim(),password);}}>
  <div className="public-head"><PressButton type="button" className="back" data-testid="back-home" disabled={busy} onClick={()=>go('home')}>← Home</PressButton></div>
  <h1>Botte Micidiali</h1><p className="tagline">Il tavolo in fondo al bar è libero.</p>
  <label>Nome<input autoComplete="username" value={user} onChange={e=>setUser(e.target.value)} required disabled={busy}/></label>
  <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={busy}/></label>
  {session.error&&<p className="problem" role="alert">{session.error}</p>}
  <PressButton type="submit" disabled={busy||!user.trim()||!password}>{busy?'Mi siedo…':'Siediti al tavolo'}</PressButton>
  <p className="small">Non hai un account? <PressButton type="button" className="link" disabled={busy} onClick={()=>go('signup')}>Registrati</PressButton></p>
 </form>;
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

/** Before the login the hash picks the screen (#/, #/regole, #/accedi, #/registrati); no routing dependency. */
function useRoute(){
 const [route,setRoute]=useState<Route>(()=>routeOf(location.hash));
 useEffect(()=>{const on=()=>{const next=routeOf(location.hash);setRoute(next);document.querySelector('.sheet')?.scrollTo(0,0);
  // Leaving the login form drops its old message; a login error shown on arrival (failed session) stays.
  if(next!=='login'&&session.phase==='login')session.clearMessages();};addEventListener('hashchange',on);return ()=>removeEventListener('hashchange',on);},[]);
 return route;
}

function App(){
 const [,refresh]=useState(0),route=useRoute(),signedIn=useRef(false);
 useEffect(()=>session.subscribe(()=>{
  // An explicit exit (no error) goes back to the home; a refused or failed login stays on the form with its message.
  const inside=session.phase==='hub'||session.phase==='queue'||session.phase==='game'||session.phase==='lost';
  if(inside)signedIn.current=true;
  else if(session.phase==='login'&&signedIn.current){signedIn.current=false;go(session.error?'login':'home');}
  refresh(x=>x+1);
 }),[]);
 const model=session.model;
 // The table stays mounted while rejoining, so the last authoritative state remains visible.
 if(model&&(session.phase==='game'||session.phase==='lost'||session.phase==='connecting'))return <>
  <Table key={model.view.gameId} session={session} model={model}/>
  {session.phase!=='game'&&<div className="overlay"><Lost/></div>}
 </>;
 const outside=route==='home'?<Home/>:route==='rules'?<Rules/>:route==='signup'?<SignUp/>:<Login/>;
 return <div className="backdrop">{session.phase==='lost'?<Lost/>:session.phase==='hub'||session.phase==='queue'?<Hub session={session}/>:session.phase==='connecting'?<Login/>:outside}</div>;
}

createRoot(document.getElementById('root')!).render(<App/>);

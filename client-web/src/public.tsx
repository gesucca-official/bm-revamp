import React,{useEffect,useMemo,useRef,useState} from 'react';
import source from '../../docs/game-rules.md?raw';
import {PressButton} from './ui.tsx';
import {parseRules,plain,rulesVersion,type Block,type Inline} from './rules.ts';
import {canRegister,canSendCode,fieldErrors,hashOf,register,sendCode,type Field,type Route,type SignUpForm} from './signup.ts';
import {signUpApi} from './net/rest.ts';

export const go=(route:Route)=>{location.hash=hashOf(route);};
const Back=()=><PressButton className="back" data-testid="back-home" onClick={()=>go('home')}>← Home</PressButton>;

// Same destinations as client-debug/src/app/home/home.component.{ts,html} (D8); the sponsor image is not carried over.
export const links={
 instagram:'https://www.instagram.com/gesucca/',
 youtube:'https://www.youtube.com/channel/UCVn26_2xCJDngLicWKxQRmw',
 githubProfile:'https://github.com/gesucca-official',
 githubWebClient:'https://github.com/gesucca-official/bm-web-client',
 githubServer:'https://github.com/gesucca-official/bm-server',
 mail:'mailto:gesucca.official@gmail.com',
 paypal:'https://www.paypal.com/paypalme/gesucca/'
};
const External=({href,id,children}:{href:string;id:string;children:React.ReactNode})=>
 <a href={href} data-link={id} {...(href.startsWith('http')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{children}</a>;

export function Home(){
 return <section className="sheet public home" aria-label="Home" data-testid="home">
  <h1>Botte Micidiali</h1><p className="tagline">Il tavolo in fondo al bar è libero.</p>
  <p>Un gioco di carte che simula una rissa fra brutti ceffi. Ognuno sceglie la propria mossa nello stesso momento degli altri, poi le mosse si risolvono in ordine: capire chi colpire e quando, invece di difendersi o rifornirsi, fa la differenza. Al tavolo si siede fino a cinque persone, anche contro il computer.</p>
  <div className="actions stack">
   <PressButton className="primary" data-testid="go-login" onClick={()=>go('login')}>Accedi</PressButton>
   <PressButton data-testid="go-signup" onClick={()=>go('signup')}>Registrati</PressButton>
   <PressButton data-testid="go-rules" onClick={()=>go('rules')}>Regole</PressButton>
  </div>
  <section className="about" aria-label="Chi l’ha fatto">
   <h2>Chi l’ha fatto</h2>
   <p>Botte Micidiali è un gioco inventato da gesucca. Segnalazioni di comportamenti strani, idee e un caffè virtuale sono benvenuti.</p>
   <ul className="links">
    <li><External id="instagram" href={links.instagram}>Instagram</External></li>
    <li><External id="youtube" href={links.youtube}>YouTube</External></li>
    <li><External id="github-profile" href={links.githubProfile}>GitHub: profilo</External></li>
    <li><External id="github-web-client" href={links.githubWebClient}>GitHub: client web</External></li>
    <li><External id="github-server" href={links.githubServer}>GitHub: server</External></li>
    <li><External id="mail" href={links.mail}>Scrivi un’email</External></li>
    <li><External id="paypal" href={links.paypal}>Sostieni con PayPal</External></li>
   </ul>
   <p className="small rights" data-testid="rights">Tutti i diritti riservati. Non è concessa alcuna licenza open source: codice, illustrazioni e materiali di gioco non ricevono permessi di utilizzo. Prima di contribuire con codice o materiali, accordati con il proprietario.</p>
  </section>
 </section>;
}

function Text({inlines}:{inlines:Inline[]}){
 return <>{inlines.map((i,n)=>!('children' in i)?(i.kind==='code'?<code key={n}>{i.text}</code>:<React.Fragment key={n}>{i.text}</React.Fragment>)
  :i.kind==='strong'?<strong key={n}><Text inlines={i.children}/></strong>:<em key={n}><Text inlines={i.children}/></em>)}</>;
}

const blocks:Block[]=parseRules(source);
const version=rulesVersion(blocks);

/** The rules in force, read from docs/game-rules.md at build time (D10). Headings carry no anchors: the index scrolls. */
export function Rules(){
 const refs=useRef(new Map<number,HTMLHeadingElement>());
 const index=useMemo(()=>blocks.flatMap((b,n)=>b.kind==='heading'&&b.level===2?[{n,text:b.text}]:[]),[]);
 return <section className="sheet public rules" aria-label="Regolamento" data-testid="rules">
  <div className="public-head"><Back/><span className="small">Regolamento {version}</span></div>
  <nav aria-label="Indice del regolamento" className="rules-index">{index.map(h=><PressButton key={h.n} className="link" onClick={()=>refs.current.get(h.n)?.scrollIntoView({block:'start'})}>{h.text.split(' — ')[0]}</PressButton>)}</nav>
  <article className="rules-text" data-testid="rules-text">{blocks.map((b,n)=>{
   if(b.kind==='heading'){const H=`h${Math.min(b.level,4)}` as 'h1';return <H key={n} ref={(e:HTMLHeadingElement|null)=>{if(e)refs.current.set(n,e);else refs.current.delete(n);}}>{b.text}</H>;}
   if(b.kind==='paragraph')return <p key={n}><Text inlines={b.inlines}/></p>;
   if(b.kind==='list'){const L=b.ordered?'ol':'ul';return <L key={n}>{b.items.map((it,k)=><li key={k}><Text inlines={it}/></li>)}</L>;}
   return <div key={n} className="table-scroll" role="region" aria-label={`Tabella: ${b.head.map(plain).join(', ')}`} tabIndex={0}><table>
    <thead><tr>{b.head.map((c,k)=><th key={k} scope="col" style={{textAlign:b.align[k]}}><Text inlines={c}/></th>)}</tr></thead>
    <tbody>{b.rows.map((r,k)=><tr key={k}>{r.map((c,j)=><td key={j} style={{textAlign:b.align[j]}}><Text inlines={c}/></td>)}</tr>)}</tbody>
   </table></div>;
  })}</article>
  <Back/>
 </section>;
}

const empty:SignUpForm={username:'',email:'',password:'',confirm:'',code:''};
const COOLDOWN=15000;

/** Registration (P07, P08): availability, code by email, account. Without SMTP the server refuses the code: explicit error. */
export function SignUp(){
 const api=useMemo(()=>signUpApi(),[]);
 const [form,setForm]=useState(empty),[touched,setTouched]=useState<Partial<Record<Field,boolean>>>({});
 const [busy,setBusy]=useState<'code'|'register'|null>(null),[wait,setWait]=useState(false);
 const [message,setMessage]=useState<{ok:boolean;text:string}|null>(null),[created,setCreated]=useState(false);
 const errors=fieldErrors(form),said=useRef<HTMLParagraphElement>(null);
 // On a short landscape screen the answer lands below the fold: bring it into view.
 useEffect(()=>{said.current?.scrollIntoView({block:'nearest'});},[message]);
 const field=(name:Field,label:string,props:React.InputHTMLAttributes<HTMLInputElement>)=><label>{label}
  <input {...props} name={name} data-testid={`signup-${name}`} value={form[name]} disabled={!!busy||created} aria-invalid={!!(touched[name]&&errors[name])}
   onChange={e=>{setForm(f=>({...f,[name]:e.target.value}));setTouched(t=>({...t,[name]:true}));}} onBlur={()=>setTouched(t=>({...t,[name]:true}))}/>
  {touched[name]&&errors[name]&&<span className="field-error">{errors[name]}</span>}</label>;
 const code=async()=>{
  setBusy('code');setMessage(null);
  const r=await sendCode(api,form);setBusy(null);
  if(r.ok){setMessage({ok:true,text:'Il server ha inviato un’email con il codice di verifica: inseriscilo qui sotto per completare la registrazione.'});
   setWait(true);setTimeout(()=>setWait(false),COOLDOWN);}
  else setMessage({ok:false,text:r.error});
 };
 const submit=async()=>{
  setBusy('register');setMessage(null);
  const r=await register(api,form);setBusy(null);
  if(r.ok){setCreated(true);setMessage({ok:true,text:'Account creato: ora puoi accedere.'});}
  else setMessage({ok:false,text:r.error});
 };
 return <form className="sheet public signup" aria-label="Registrazione" data-testid="signup" onSubmit={e=>{e.preventDefault();if(canRegister(form)&&!busy)void submit();}}>
  <div className="public-head"><Back/></div>
  <h1>Registrati</h1>
  {field('username','Nome',{autoComplete:'username',autoCapitalize:'none',spellCheck:false})}
  {field('email','Email',{type:'email',autoComplete:'email',placeholder:'nome@esempio.it'})}
  <PressButton type="button" data-testid="send-code" disabled={!canSendCode(form)||!!busy||wait||created} onClick={()=>void code()}>{busy==='code'?'Controllo e invio…':'Invia codice'}</PressButton>
  {wait&&<p className="small">Attendi qualche secondo prima di chiedere un altro codice.</p>}
  {field('code','Codice di verifica (sei cifre)',{inputMode:'numeric',autoComplete:'one-time-code',maxLength:6})}
  {field('password','Password',{type:'password',autoComplete:'new-password'})}
  {field('confirm','Conferma la password',{type:'password',autoComplete:'new-password'})}
  {message&&<p ref={said} className={message.ok?'notice':'problem'} role={message.ok?'status':'alert'} data-testid="signup-message">{message.text}</p>}
  {created?<PressButton type="button" className="primary" onClick={()=>go('login')}>Accedi</PressButton>
  :<PressButton type="submit" className="primary" data-testid="register" disabled={!canRegister(form)||!!busy}>{busy==='register'?'Registrazione…':'Registrati'}</PressButton>}
  <p className="small">Hai già un account? <PressButton type="button" className="link" onClick={()=>go('login')}>Accedi</PressButton></p>
 </form>;
}

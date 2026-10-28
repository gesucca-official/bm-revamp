import React,{useEffect,useState} from 'react';
import type {Session} from './session.ts';
import type {Card,CharacterCard,UserGuiDeck} from './contracts.ts';
import {artCss,artIndex,loadAtlas} from './art.ts';
import {cost,subtype} from './scene.ts';
import {ROLES,roleOf} from './readability.ts';
import {PressButton,effect,resourceNames,targetNames} from './ui.tsx';
import {MAX_BOUND,MAX_INITIAL,addBound,addRegular,basics,bounds,catalogOrder,clearBound,copies,editCopy,emptyDraft,initialCards,lastResorts,
 payload,problems,removeRegular,setBasic,setCharacter,setLastResort,setName,shown,type Draft,type Pool} from './deck.ts';

const Art=({binding}:{binding:string})=><div className="thumb" aria-hidden="true" style={artCss(artIndex(binding))}/>;

/** One catalog card as published by the server: name, kind, cost, priority, role, gains, targets and text. */
function CardFace({card,full=false,count}:{card:Card;full?:boolean;count?:number}){
 const role=roleOf(card);
 return <div className="cc" data-testid="card-face" data-binding={card.bindingName}><Art binding={card.bindingName}/>
  <div className="cc-text"><strong>{card.name}{count!==undefined&&<span className="copies"> ×{count}</span>}</strong>
   <small>{subtype(card).toLocaleLowerCase('it')}{card.item?'':` · costo ${cost(card)} · priorità ${card.priority}`}</small>
   {(role||(card.gains&&card.gains!=='—'))&&<small>{role&&`${ROLES[role].label.toLowerCase()}`}{card.gains&&card.gains!=='—'?`${role?' · ':''}ti dà ${card.gains}`:''}</small>}
   {full&&!card.item&&<small>Bersaglio: {card.canTarget.map(t=>targetNames[t]).join(' / ')}</small>}
   <p>{effect(card)}</p></div></div>;
}
function CharacterFace({character}:{character:CharacterCard}){
 return <div className="cc" data-testid="character-face" data-binding={character.bindingName}><Art binding={character.bindingName}/>
  <div className="cc-text"><strong>{character.name}</strong><small>personaggio · {character.itemsSize} oggetti al massimo</small>
   <p>{Object.entries(character.resources).map(([k,v])=>`${resourceNames[k]} ${v}`).join(' · ')}</p></div></div>;
}

/** The whole set from account/data.collection: two characters and every card, in a stable order. */
function Catalog({session}:{session:Session}){
 const characters=session.characters,cards=catalogOrder(session.catalog);
 return <section aria-label="Catalogo" data-testid="catalog">
  <p className="small">{characters.length+cards.length} carte: {characters.length} personaggi e {cards.length} fra azioni e oggetti. Tutte disponibili per i tuoi mazzi.</p>
  <h3>Personaggi</h3><ul className="cards">{characters.map(c=><li key={c.bindingName}><CharacterFace character={c}/></li>)}</ul>
  <h3>Carte</h3><ul className="cards">{cards.map(c=><li key={c.bindingName}><CardFace card={c} full/></li>)}</ul>
 </section>;
}

function Slot({title,summary,children,open}:{title:string;summary:string;children:React.ReactNode;open?:boolean}){
 return <details className="slot" open={open}><summary><span>{title}</span><b>{summary}</b></summary>{children}</details>;
}

/** Deck editor on a copy: nothing is sent before "Salva"; "Annulla" drops the copy. */
function Editor({session,start,existing,onDone}:{session:Session;start:Draft;existing:boolean;onDone:(notice:string)=>void}){
 const [d,setD]=useState(start),[pool,setPool]=useState<Pool>('collection'),[term,setTerm]=useState(''),[error,setError]=useState('');
 const catalog=catalogOrder(session.catalog),missing=problems(d),busy=session.deckBusy;
 const overwrite=existing||session.decks.some(x=>x.deckId===d.deckId);
 const save=async()=>{setError('');const name=d.deckId,reason=await session.saveDeck(payload(d));if(reason)setError(reason);else onDone(`Mazzo «${name}» salvato.`);};
 const pick=(on:boolean,label:string,face:React.ReactNode,onClick:()=>void,key:string)=><li key={key}><PressButton className={`pick${on?' on':''}`} aria-pressed={on} aria-label={label} onClick={onClick}>{face}</PressButton></li>;
 const listed=shown(d,catalog,pool,term);
 return <section className="editor" aria-label="Editor del mazzo">
  <div className="editor-head">
   <label>Nome del mazzo<input data-testid="deck-name" value={d.deckId} readOnly={existing} onChange={e=>setD(setName(d,e.target.value))} placeholder="Per esempio: Botte da orbi"/></label>
   <div className="actions">
    <PressButton data-testid="save-deck" className="primary" disabled={missing.length>0||busy} onClick={()=>void save()}>{busy?'Salvo…':overwrite?'Sovrascrivi':'Salva'}</PressButton>
    <PressButton data-testid="cancel-edit" disabled={busy} onClick={()=>onDone('')}>Annulla</PressButton>
   </div>
  </div>
  <p className="small" data-testid="deck-counts">Carte iniziali {initialCards(d)} / {MAX_INITIAL} (base + legate) · regolari {d.regularCards.length} (almeno 1). Nessun limite di copie.{existing?' Il nome di un mazzo salvato non si cambia.':''}</p>
  {missing.length>0&&<ul className="missing" role="status" data-testid="deck-problems">{missing.map(m=><li key={m}>{m}</li>)}</ul>}
  {error&&<p className="problem" role="alert" data-testid="deck-error">{error}</p>}
  <Slot title="Personaggio" summary={d.character?.name??'da scegliere'}>
   <ul className="cards">{session.characters.map(c=>pick(d.character?.bindingName===c.bindingName,`Personaggio ${c.name}`,<CharacterFace character={c}/>,()=>setD(setCharacter(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Azione base" summary={d.basicActionCard?.name??'da scegliere'}>
   <ul className="cards">{basics(catalog).map(c=>pick(d.basicActionCard?.bindingName===c.bindingName,`Azione base ${c.name}`,<CardFace card={c}/>,()=>setD(setBasic(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Ultima risorsa" summary={d.lastResortCard?.name??'da scegliere'}>
   <ul className="cards">{lastResorts(catalog).map(c=>pick(d.lastResortCard?.bindingName===c.bindingName,`Ultima risorsa ${c.name}`,<CardFace card={c}/>,()=>setD(setLastResort(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Azioni legate" summary={`${d.characterBoundCards.length} / ${MAX_BOUND}`}>
   <p className="small">Scelte: <span data-testid="bound-list">{copies(d.characterBoundCards).map(e=>`${e.card.name}${e.n>1?` ×${e.n}`:''}`).join(', ')||'nessuna'}</span>. Si possono ripetere; ognuna conta fra le carte iniziali. <PressButton data-testid="clear-bound" disabled={!d.characterBoundCards.length} onClick={()=>setD(clearBound(d))}>Svuota</PressButton></p>
   <ul className="cards">{bounds(catalog).map(c=>pick(false,`Aggiungi l’azione legata ${c.name}`,<CardFace card={c}/>,()=>setD(addBound(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Mazzo regolare" summary={`${d.regularCards.length} carte`} open>
   <div className="regular-bar">
    <label>Cerca<input data-testid="card-search" type="search" value={term} onChange={e=>setTerm(e.target.value)} placeholder="nome o testo"/></label>
    <div role="radiogroup" aria-label="Mostra" className="pool">
     <PressButton role="radio" aria-checked={pool==='collection'} className={pool==='collection'?'on':undefined} onClick={()=>setPool('collection')}>Collezione</PressButton>
     <PressButton role="radio" data-testid="pool-deck" aria-checked={pool==='deck'} className={pool==='deck'?'on':undefined} onClick={()=>setPool('deck')}>Mazzo</PressButton>
    </div>
   </div>
   <p className="small">{pool==='collection'?'Tocca una carta per aggiungerne una copia.':'Tocca una carta per toglierne una copia.'}</p>
   <ul className="cards" data-testid="regular-pool">{(pool==='deck'?copies(listed).map(e=>({card:e.card,n:e.n})):listed.map(card=>({card,n:undefined}))).map(({card,n})=>
    <li key={card.bindingName}><PressButton className="pick" aria-label={`${pool==='collection'?'Aggiungi':'Togli'} una copia di ${card.name}`} onClick={()=>setD(pool==='collection'?addRegular(d,card):removeRegular(d,card.name))}>
     <CardFace card={card} count={pool==='collection'?d.regularCards.filter(x=>x.name===card.name).length||undefined:n}/></PressButton></li>)}</ul>
   {!listed.length&&<p className="small">{pool==='deck'&&!d.regularCards.length?'Il mazzo è ancora vuoto.':'Nessuna carta corrisponde alla ricerca.'}</p>}
  </Slot>
 </section>;
}

type Screen={kind:'list'}|{kind:'catalog'}|{kind:'edit';draft:Draft;existing:boolean};

/** "Collezione" tab: saved decks, the catalog and the editor (P18–P24). */
export function Collection({session}:{session:Session}){
 const [screen,setScreen]=useState<Screen>({kind:'list'}),[,refresh]=useState(0),[confirm,setConfirm]=useState<string|null>(null),[notice,setNotice]=useState(''),[error,setError]=useState('');
 // Illustrations come from the same atlas as the table (O9); until it loads the tiles stay plain.
 useEffect(()=>{let live=true;loadAtlas().then(()=>{if(live)refresh(x=>x+1);},()=>{});return()=>{live=false;};},[]);
 const remove=async(deck:UserGuiDeck)=>{setError('');const reason=await session.deleteDeck(deck);setConfirm(null);if(reason)setError(reason);else setNotice(`Mazzo «${deck.deckId}» cancellato.`);};
 if(screen.kind==='edit')return <Editor session={session} start={screen.draft} existing={screen.existing} onDone={n=>{setNotice(n);setError('');setScreen({kind:'list'});}}/>;
 const decks=[...session.decks].sort((a,b)=>a.deckId.localeCompare(b.deckId));
 return <section className="collection" aria-label="Collezione">
  <div className="actions">
   <PressButton data-testid="new-deck" className="primary" onClick={()=>{setNotice('');setScreen({kind:'edit',draft:emptyDraft(),existing:false});}}>Nuovo mazzo</PressButton>
   <PressButton data-testid="show-catalog" aria-pressed={screen.kind==='catalog'} onClick={()=>setScreen(screen.kind==='catalog'?{kind:'list'}:{kind:'catalog'})}>{screen.kind==='catalog'?'Torna ai mazzi':'Catalogo'}</PressButton>
  </div>
  {notice&&<p className="notice" role="status" data-testid="deck-notice">{notice}</p>}
  {error&&<p className="problem" role="alert">{error}</p>}
  {screen.kind==='catalog'?<Catalog session={session}/>:<>
   {!decks.length&&<p className="small" data-testid="no-decks">Nessun mazzo salvato. Crea il primo: servono nome, personaggio, azione base, ultima risorsa e almeno una carta regolare.</p>}
   <ul className="decks" data-testid="deck-list">{decks.map(deck=><li key={deck.deckId} data-deck={deck.deckId}>
    <div><strong>{deck.deckId}</strong><small>{deck.character.name} · {1+deck.characterBoundCards.length} iniziali · {deck.regularCards.length} regolari</small></div>
    {confirm===deck.deckId?<div className="actions confirm" role="group" aria-label={`Conferma cancellazione di ${deck.deckId}`}><span>Cancellare «{deck.deckId}»? Non si può annullare.</span>
      <PressButton data-testid="confirm-delete" className="danger" disabled={session.deckBusy} onClick={()=>void remove(deck)}>{session.deckBusy?'Cancello…':'Cancella'}</PressButton>
      <PressButton disabled={session.deckBusy} onClick={()=>setConfirm(null)}>Annulla</PressButton></div>
    :<div className="actions">
      <PressButton data-testid="edit-deck" onClick={()=>{setNotice('');setScreen({kind:'edit',draft:editCopy(deck),existing:true});}}>Modifica</PressButton>
      <PressButton data-testid="delete-deck" onClick={()=>{setNotice('');setConfirm(deck.deckId);}}>Cancella</PressButton></div>}
   </li>)}</ul></>}
 </section>;
}

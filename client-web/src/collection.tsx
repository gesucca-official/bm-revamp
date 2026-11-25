import React,{useEffect,useState} from 'react';
import type {Session} from './session.ts';
import type {Card,CharacterCard,UserGuiDeck} from './contracts.ts';
import {artCss,artIndex,loadAtlas} from './art.ts';
import {subtype} from './scene.ts';
import {groupKeyDown} from './a11y.ts';
import {ROLES,roleOf} from './readability.ts';
import {frameOf,type FrameKind} from './frames.ts';
import {entryOf,loadAnnex,rarityOf,setIds} from './annex.ts';
import {CardFrame,Cost,DamagePills,EffectText,Gains,Mark,PressButton,RarityMark,resourceNames,targetNames} from './ui.tsx';
import {BOUND_CARDS,GENERIC,INITIAL_CARDS,MAX_COPIES,NO_FILTERS,REGULAR_CARDS,addRegular,allowedLastResorts,canAdd,catalogOrder,characterOrder,copies,copiesOf,deckBar,deckBarText,deckSummary,editCopy,emptyDraft,filterCards,initialCards,
 isFiltering,matchesCharacter,ownBasics,ownBounds,payload,problems,removeRegular,setBasic,setCharacter,setLastResort,setName,shown,toggleBound,type Draft,type Filters,type Pool} from './deck.ts';

// C4-4: the miniature is a small card with the frame of the table around the art.
const Art=({binding,kind}:{binding:string;kind:FrameKind})=><div className="mini-card" aria-hidden="true"><CardFrame kind={kind} w={66} h={90}/><div className="thumb" style={artCss(artIndex(binding))}/></div>;

/** SB-31 F4 (D198 (9)): the rarity of the print on the face of the catalog and the editor (never on the faces of the table); nothing without the annex. */
function Rare({binding}:{binding:string}){const r=rarityOf(entryOf(binding)?.rarity);return r?<> · <RarityMark rarity={r}/></>:null;}

/** One catalog card as published by the server: name, kind, cost, nominal damage as symbols, role, gains, targets and text. The priority is in the inspection at the table (C3-5). */
function CardFace({card,full=false,count}:{card:Card;full?:boolean;count?:number}){
 const role=roleOf(card);
 return <div className="cc" data-testid="card-face" data-binding={card.bindingName} data-frame={frameOf(card)}><Art binding={card.bindingName} kind={frameOf(card)}/>
  <div className="cc-text"><strong>{card.name}{count!==undefined&&<span className="copies"> ×{count}</span>}</strong>
   <small>{subtype(card).toLocaleLowerCase('it')}<Rare binding={card.bindingName}/>{!card.item&&<> · costo <Cost card={card}/></>}{!card.item&&<DamagePills card={card}/>}</small>
   {(role||(card.gains&&card.gains!=='—'))&&<small>{role&&`${ROLES[role].label.toLowerCase()}`}{card.gains&&card.gains!=='—'&&<>{role&&' · '}ti dà <Gains card={card}/></>}</small>}
   {full&&!card.item&&<small>Bersaglio: {card.canTarget.map(t=>targetNames[t]).join(' / ')}</small>}
   <p><EffectText card={card}/></p></div></div>;
}
function CharacterFace({character}:{character:CharacterCard}){
 return <div className="cc" data-testid="character-face" data-binding={character.bindingName} data-frame="character"><Art binding={character.bindingName} kind="character"/>
  <div className="cc-text"><strong>{character.name}</strong><small>personaggio<Rare binding={character.bindingName}/> · {character.itemsSize} oggetti al massimo</small>
   <p>{Object.entries(character.resources).map(([k,v])=>`${resourceNames[k]} ${v}`).join(' · ')}</p></div></div>;
}

const RARITIES:[string,string][]=[['COMMON','Comune'],['UNCOMMON','Non comune'],['RARE','Rara']];
/**
 * SB-31 F4 (D196 (4), O16 within the perimeter): the filters of the catalog and of the regular pool. They intersect. The set is read from the data and
 * shown only when the annex knows two; «P» (the protagonists' rarity) only where the characters are listed.
 */
function FilterBar({filters,onChange,characters,withCharacters,shown,total}:{filters:Filters;onChange:(f:Filters)=>void;characters:CharacterCard[];withCharacters:boolean;shown:number;total:number}){
 const set=(key:keyof Filters)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>onChange({...filters,[key]:e.target.value}),sets=setIds();
 return <div className="filter-bar" data-testid="filter-bar" role="group" aria-label="Filtri">
  <label>Personaggio<select data-testid="filter-character" value={filters.character} onChange={set('character')}><option value="">Tutti</option><option value={GENERIC}>Generiche</option>
   {characters.map(c=><option key={c.bindingName} value={c.bindingName}>{c.name}</option>)}</select></label>
  <label>Rarità<select data-testid="filter-rarity" value={filters.rarity} onChange={set('rarity')}><option value="">Tutte</option>
   {RARITIES.map(([k,label])=><option key={k} value={k}>{label}</option>)}{withCharacters&&<option value="PROTAGONIST">P (personaggi)</option>}</select></label>
  <label>Tipo<select data-testid="filter-type" value={filters.type} onChange={set('type')}><option value="">Tutti</option><option value="action">Azioni</option><option value="item">Oggetti</option></select></label>
  {sets.length>1&&<label>Set<select data-testid="filter-set" value={filters.set} onChange={set('set')}><option value="">Tutti</option>{sets.map(s=><option key={s} value={s}>{s}</option>)}</select></label>}
  <label className="filter-search">Cerca<input data-testid="card-search" type="search" value={filters.term} onChange={set('term')} placeholder="nome o testo"/></label>
  <div className="filter-state"><span role="status" data-testid="filter-count">{shown} di {total} carte</span>
   {isFiltering(filters)&&<PressButton data-testid="filter-reset" onClick={()=>onChange(NO_FILTERS)}>Azzera i filtri</PressButton>}</div>
 </div>;
}

/** The whole set from account/data.collection: the characters and every card, in a stable order, through the filters. */
function Catalog({session}:{session:Session}){
 const [filters,setFilters]=useState(NO_FILTERS),all=characterOrder(session.characters),every=catalogOrder(session.catalog);
 const characters=all.filter(c=>matchesCharacter(c,filters)),cards=filterCards(every,filters);
 return <section aria-label="Catalogo" data-testid="catalog">
  <p className="small">{all.length+every.length} carte: {all.length} personaggi e {every.length} fra azioni e oggetti. Tutte disponibili per i tuoi mazzi.</p>
  <FilterBar filters={filters} onChange={setFilters} characters={all} withCharacters shown={characters.length+cards.length} total={all.length+every.length}/>
  {characters.length>0&&<><h3>Personaggi</h3><ul className="cards" data-testid="catalog-characters">{characters.map(c=><li key={c.bindingName}><CharacterFace character={c}/></li>)}</ul></>}
  {cards.length>0&&<><h3>Carte</h3><ul className="cards" data-testid="catalog-cards">{cards.map(c=><li key={c.bindingName}><CardFace card={c} full/></li>)}</ul></>}
  {!characters.length&&!cards.length&&<p className="small" data-testid="catalog-empty">Nessuna carta passa i filtri.</p>}
 </section>;
}

function Slot({title,summary,children,open}:{title:string;summary:string;children:React.ReactNode;open?:boolean}){
 return <details className="slot" open={open}><summary><span>{title}</span><b>{summary}</b></summary>{children}</details>;
}

/**
 * SB-31 F4 (O15): the deck bar stays on screen while the editor scrolls (at the top on a wide screen, at the bottom on a low one) and opens the summary of the
 * deck: character, basic, last resort, bound cards and the regular cards with their copies over 20. The choice of the bound cards stays where it was (`toggleBound`).
 */
function DeckBar({d}:{d:Draft}){
 const [open,setOpen]=useState(false),b=deckBar(d),s=deckSummary(d);
 return <div className="deck-bar" data-testid="deck-bar" data-regular={b.regular} data-bound={b.bound} data-last-resort={b.lastResort?'yes':'no'} data-text={deckBarText(d)}
   onKeyDown={e=>{if(e.key==='Escape'&&open){e.stopPropagation();setOpen(false);}}}>
  {open&&<div id="deck-summary" className="deck-summary" data-testid="deck-summary" role="region" aria-label="Riepilogo del mazzo">
   <dl><dt>Personaggio</dt><dd>{s.character??'da scegliere'}</dd><dt>Azione base</dt><dd>{s.basic??'da scegliere'}</dd><dt>Ultima risorsa</dt><dd>{s.lastResort??'da scegliere'}</dd>
    <dt>Legate {b.bound} / {BOUND_CARDS}</dt><dd data-testid="summary-bounds">{s.bounds.join(', ')||'nessuna'}</dd></dl>
   <h4 data-testid="summary-regular-title">Regolari {s.total} / {REGULAR_CARDS}</h4>
   {s.regular.length>0?<ul data-testid="summary-regular">{s.regular.map(r=><li key={r.binding}>{r.name} <b>×{r.n}</b></li>)}</ul>:<p className="small">Nessuna carta regolare ancora.</p>}
  </div>}
  <PressButton className="deck-bar-open" data-testid="deck-bar-open" aria-expanded={open} aria-controls="deck-summary" aria-label={`${deckBarText(d)}. ${open?'Chiudi':'Apri'} il riepilogo del mazzo`} onClick={()=>setOpen(!open)}>
   <span>Regolari <b>{b.regular}</b> / {REGULAR_CARDS}</span><span aria-hidden="true">·</span><span>legate <b>{b.bound}</b> / {BOUND_CARDS}</span><span aria-hidden="true">·</span>
   <span>ultima risorsa {b.lastResort?<Mark kind="check"/>:'—'}</span><span className="deck-bar-more">{open?'Chiudi':'Riepilogo'}</span></PressButton>
 </div>;
}

/** Deck editor on a copy: nothing is sent before "Salva"; "Annulla" drops the copy. */
function Editor({session,start,existing,onDone}:{session:Session;start:Draft;existing:boolean;onDone:(notice:string)=>void}){
 const [d,setD]=useState(start),[pool,setPool]=useState<Pool>('collection'),[filters,setFilters]=useState(NO_FILTERS),[error,setError]=useState('');
 const catalog=catalogOrder(session.catalog),missing=problems(d),busy=session.deckBusy;
 const overwrite=existing||session.decks.some(x=>x.deckId===d.deckId);
 const save=async()=>{setError('');const name=d.deckId,reason=await session.saveDeck(payload(d));if(reason)setError(reason);else onDone(`Mazzo «${name}» salvato.`);};
 const pick=(on:boolean,label:string,face:React.ReactNode,onClick:()=>void,key:string)=><li key={key}><PressButton className={`pick${on?' on':''}`} aria-pressed={on} aria-label={label} onClick={onClick}>{face}</PressButton></li>;
 const listed=shown(d,catalog,pool,filters),roster=characterOrder(session.characters),poolSize=shown(d,catalog,pool,NO_FILTERS).length;
 return <section className="editor" aria-label="Editor del mazzo">
  <div className="editor-head">
   <label>Nome del mazzo<input data-testid="deck-name" value={d.deckId} readOnly={existing} onChange={e=>setD(setName(d,e.target.value))} placeholder="Per esempio: Botte da orbi"/></label>
   <div className="actions">
    <PressButton data-testid="save-deck" className="primary" disabled={missing.length>0||busy} onClick={()=>void save()}>{busy?'Salvo…':overwrite?'Sovrascrivi':'Salva'}</PressButton>
    <PressButton data-testid="cancel-edit" disabled={busy} onClick={()=>onDone('')}>Annulla</PressButton>
   </div>
  </div>
  <p className="small" data-testid="deck-counts">Regolari {d.regularCards.length} / {REGULAR_CARDS}, al massimo {MAX_COPIES} copie per carta · carte iniziali {initialCards(d)} / {INITIAL_CARDS} (base + {BOUND_CARDS} legate).{existing?' Il nome di un mazzo salvato non si cambia.':''}</p>
  {missing.length>0&&<ul className="missing" role="status" data-testid="deck-problems">{missing.map(m=><li key={m}>{m}</li>)}</ul>}
  {error&&<p className="problem" role="alert" data-testid="deck-error">{error}</p>}
  <Slot title="Personaggio" summary={d.character?.name??'da scegliere'}>
   <ul className="cards">{roster.map(c=>pick(d.character?.bindingName===c.bindingName,`Personaggio ${c.name}`,<CharacterFace character={c}/>,()=>setD(setCharacter(d,c,catalog)),c.bindingName))}</ul></Slot>
  {/* R02 1.12: the basic is fixed, the character's own; it is set with the character. */}
  <Slot title="Azione base" summary={d.basicActionCard?.name??'da scegliere'}>
   <p className="small">È fissa: quella del personaggio.{d.character?'':' Scegli prima il personaggio.'}</p>
   <ul className="cards">{ownBasics(catalog,d.character).map(c=>pick(d.basicActionCard?.bindingName===c.bindingName,`Azione base ${c.name}`,<CardFace card={c}/>,()=>setD(setBasic(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Ultima risorsa" summary={d.lastResortCard?.name??'da scegliere'}>
   <ul className="cards">{allowedLastResorts(catalog,d.character).map(c=>pick(d.lastResortCard?.bindingName===c.bindingName,`Ultima risorsa ${c.name}`,<CardFace card={c}/>,()=>setD(setLastResort(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Azioni legate" summary={`${d.characterBoundCards.length} / ${BOUND_CARDS}`}>
   <p className="small">Scelte: <span data-testid="bound-list">{d.characterBoundCards.map(c=>c.name).join(', ')||'nessuna'}</span>. Due diverse, del personaggio: tocca una carta per prenderla o lasciarla.{d.character?'':' Scegli prima il personaggio.'}</p>
   <ul className="cards">{ownBounds(catalog,d.character).map(c=>pick(d.characterBoundCards.some(x=>x.bindingName===c.bindingName),`Azione legata ${c.name}`,<CardFace card={c}/>,()=>setD(toggleBound(d,c)),c.bindingName))}</ul></Slot>
  <Slot title="Mazzo regolare" summary={`${d.regularCards.length} / ${REGULAR_CARDS} carte`} open>
   <FilterBar filters={filters} onChange={setFilters} characters={roster} withCharacters={false} shown={listed.length} total={poolSize}/>
   <div className="regular-bar">
    <div role="radiogroup" aria-label="Mostra" className="pool" onKeyDown={e=>groupKeyDown(e,'radio')}>
     <PressButton role="radio" aria-checked={pool==='collection'} tabIndex={pool==='collection'?0:-1} className={pool==='collection'?'on':undefined} onClick={()=>setPool('collection')}>Collezione</PressButton>
     <PressButton role="radio" data-testid="pool-deck" aria-checked={pool==='deck'} tabIndex={pool==='deck'?0:-1} className={pool==='deck'?'on':undefined} onClick={()=>setPool('deck')}>Mazzo</PressButton>
    </div>
   </div>
   <p className="small">{pool==='collection'?`Tocca una carta per aggiungerne una copia: al massimo ${MAX_COPIES} per carta e ${REGULAR_CARDS} in tutto.`:'Tocca una carta per toglierne una copia.'}</p>
   <ul className="cards" data-testid="regular-pool">{(pool==='deck'?copies(listed).map(e=>({card:e.card,n:e.n})):listed.map(card=>({card,n:undefined}))).map(({card,n})=>
    <li key={card.bindingName}><PressButton className="pick" disabled={pool==='collection'&&!canAdd(d,card)} aria-label={`${pool==='collection'?'Aggiungi':'Togli'} una copia di ${card.name}`} onClick={()=>setD(pool==='collection'?addRegular(d,card):removeRegular(d,card.name))}>
     <CardFace card={card} count={pool==='collection'?copiesOf(d,card)||undefined:n}/></PressButton></li>)}</ul>
   {!listed.length&&<p className="small">{pool==='deck'&&!d.regularCards.length?'Il mazzo è ancora vuoto.':'Nessuna carta passa i filtri.'}</p>}
  </Slot>
  <DeckBar d={d}/>
 </section>;
}

type Screen={kind:'list'}|{kind:'catalog'}|{kind:'edit';draft:Draft;existing:boolean};

/** "Collezione" tab: saved decks, the catalog and the editor (P18–P24). */
export function Collection({session}:{session:Session}){
 const [screen,setScreen]=useState<Screen>({kind:'list'}),[,refresh]=useState(0),[confirm,setConfirm]=useState<string|null>(null),[notice,setNotice]=useState(''),[error,setError]=useState('');
 // Illustrations come from the same atlas as the table (O9); until it loads the tiles stay plain.
 useEffect(()=>{let live=true;loadAtlas().then(()=>{if(live)refresh(x=>x+1);},()=>{});return()=>{live=false;};},[]);
 // SB-31 F4: rarity, character and set of the cards come from the annex (chunk loaded on demand); the faces and the filters redraw when it arrives.
 useEffect(()=>{let live=true;loadAnnex().then(()=>{if(live)refresh(x=>x+1);});return()=>{live=false;};},[]);
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
   {!decks.length&&<p className="small" data-testid="no-decks">Nessun mazzo salvato. Crea il primo: servono nome, personaggio, ultima risorsa, due azioni legate e {REGULAR_CARDS} carte regolari.</p>}
   <ul className="decks" data-testid="deck-list">{decks.map(deck=><li key={deck.deckId} data-deck={deck.deckId}>
    <div><strong>{deck.deckId}</strong><small>{deck.character.name} · {deck.regularCards.length} regolari</small>
     {/* R02 1.12 (D20): a deck saved under older rules stays here but cannot be played until it is fixed. */}
     {problems(editCopy(deck)).length>0&&<small data-testid="deck-invalid">Non rispetta le regole attuali: modificalo o cancellalo.</small>}</div>
    {confirm===deck.deckId?<div className="actions confirm" role="group" aria-label={`Conferma cancellazione di ${deck.deckId}`}><span>Cancellare «{deck.deckId}»? Non si può annullare.</span>
      <PressButton data-testid="confirm-delete" className="danger" disabled={session.deckBusy} onClick={()=>void remove(deck)}>{session.deckBusy?'Cancello…':'Cancella'}</PressButton>
      <PressButton disabled={session.deckBusy} onClick={()=>setConfirm(null)}>Annulla</PressButton></div>
    :<div className="actions">
      <PressButton data-testid="edit-deck" onClick={()=>{setNotice('');setScreen({kind:'edit',draft:editCopy(deck),existing:true});}}>Modifica</PressButton>
      <PressButton data-testid="delete-deck" onClick={()=>{setNotice('');setConfirm(deck.deckId);}}>Cancella</PressButton></div>}
   </li>)}</ul></>}
 </section>;
}

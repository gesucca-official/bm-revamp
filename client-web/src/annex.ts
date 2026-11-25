// SB-31 F3 (D196 (3), D197): the texts of the live set that the wire does not carry: full text, flavour, rarity, the descriptive character and the
// texts of the tokens. They come from the annex of the catalog (docs/rules-catalog.json, written by the generator of the set), imported at build time
// in a chunk loaded on demand, like public.tsx reads docs/sets/base.md; no server or protocol change. A card is found by its class (= `bindingName`).
// A card without an entry (archived 0.1 games, a server older than the client) shows no full text and no flavour: nothing is invented.

export type AnnexCard={class:string;name:string;description:string;type:string;subtype?:string;rarity?:string;fullText:string[];flavour:string|null;set?:string;
 /** Descriptive character of the card (D196 (2), D198 (13)): the binding of its character, from the slot; absent for a generic action or an item. */character?:string|null};
/** `statusText` (D198 (10)): the text of the status the token creates, written by the generator from the sheet of the token. */
export type AnnexToken={class:string;name:string;description:string;fullText:string[];flavour:string|null;statusText?:string};
/** `set`: the id of the set of the annex (one annex per set); a card may name its own set, for an annex that carries more than one (SB-31 F4: the filter by set reads it). */
export type Annex={set?:string;cards:AnnexCard[];characters:AnnexCard[];tokens:AnnexToken[]};
export type Entry={class:string;name:string;kind:'card'|'character'|'token';rarity:string|null;fullText:string[];flavour:string|null;character:string|null;description:string;statusText:string|null;set:string|null};

let loaded:Annex|null=null,index:Map<string,Entry>|null=null,loading:Promise<Annex|null>|null=null;
/** The annex if the chunk has arrived, else null. */
export const annexNow=()=>loaded;
/** For the tests (a JSON read from disk) and for the loader. */
export const setAnnex=(a:Annex|null)=>{loaded=a;index=null;};
/** Loads the chunk once; a failure leaves the client without annex texts (no button, no flavour), never an error on the table. */
export function loadAnnex():Promise<Annex|null>{
 loading??=import('../../docs/rules-catalog.json').then(m=>{setAnnex((m.default??m) as unknown as Annex);return loaded;},()=>null);
 return loading;
}

const entries=():Map<string,Entry>=>{
 if(index)return index;index=new Map();if(!loaded)return index;
 for(const c of loaded.cards)index.set(c.class,{class:c.class,name:c.name,kind:'card',rarity:c.rarity??null,fullText:c.fullText??[],flavour:c.flavour??null,character:c.character??null,description:c.description,statusText:null,set:c.set??loaded.set??null});
 for(const c of loaded.characters)index.set(c.class,{class:c.class,name:c.name,kind:'character',rarity:c.rarity??null,fullText:c.fullText??[],flavour:c.flavour??null,character:c.class,description:'',statusText:null,set:c.set??loaded.set??null});
 for(const t of loaded.tokens)index.set(t.class,{class:t.class,name:t.name,kind:'token',rarity:null,fullText:t.fullText??[],flavour:t.flavour??null,character:null,description:t.description,statusText:t.statusText??null,set:loaded.set??null});
 return index;
};
/** The entry of a card, character or token by its binding name; null without annex or without entry. */
export const entryOf=(bindingName:string|undefined|null):Entry|null=>bindingName?entries().get(bindingName)??null:null;
/** The sets the annex knows, sorted (SB-31 F4: the set filter is shown only from two). */
export const setIds=():string[]=>[...new Set([...entries().values()].map(e=>e.set).filter((s):s is string=>!!s))].sort();
/** Full text and flavour of a card: both absent for a card without entry, so the inspection has no button for it. */
export const hasFullText=(e:Entry|null)=>!!e&&e.fullText.length>0;

/** Rarity as the print has it (tools/print-cards/bozza.py, RARITY): one to three ticks, «P» for the characters. */
export type Rarity={label:string;ticks:number;mark:string};
const RARITIES:Record<string,Rarity>={COMMON:{label:'comune',ticks:1,mark:''},UNCOMMON:{label:'non comune',ticks:2,mark:''},RARE:{label:'rara',ticks:3,mark:''},PROTAGONIST:{label:'protagonista',ticks:0,mark:'P'}};
export const rarityOf=(rarity:string|null|undefined):Rarity|null=>rarity?RARITIES[rarity]??null:null;

// R07b: a reminder line for each keyword a card uses. The sentence is written once here, short, from the rule; the line carries the reference.
// The keyword is recognised in the short text of the card (case sensitive where the word is also common prose: «in campo»). [[HIT]]… are drawn as symbols.
export const KEYWORD_REFERENCE='regolamento, R07b';
export type Keyword={id:string;label:string;sentence:string;reference:string};
const KEYWORDS:{id:string;label:string;test:RegExp;sentence:string}[]=[
 {id:'announce',label:'Annuncia',test:/\bAnnuncia\b/,sentence:'Al posto della pesca cerchi nel mazzo la carta annunciata: se la trovi la mostri, ottieni il premio e diventi Vulnerabile; se non la trovi peschi e ottieni il ripiego.'},
 {id:'vulnerable',label:'Vulnerabile',test:/\bVulnerabile\b/,sentence:'Subisci una volta e mezza i danni [[HIT]], [[CUT]] e [[POISON]] fino alla fine del turno in cui giochi una carta col nome trovato.'},
 {id:'ahead',label:'Gioca d’anticipo',test:/\bGioca d['’]anticipo\b/i,sentence:'Se questa mossa si risolve prima di quella del bersaglio, ottieni anche l’effetto scritto.'},
 {id:'rises',label:'Rincara',test:/\bRincara\b/,sentence:'Per ogni volta che hai già giocato questa carta nella partita, i danni al bersaglio (e a te, se scritto) aumentano della quantità indicata.'},
 {id:'inplay',label:'In campo',test:/\bIn campo\b/,sentence:'Finché l’oggetto è in campo, a fine turno chi lo ha vicino subisce l’effetto scritto: è una perdita o un guadagno di risorsa, non un danno.'},
 {id:'sell',label:'Vendi',test:/\bVendi\b/,sentence:'L’oggetto bersagliato esce dal campo senza il suo effetto e ottieni il ricavato scritto; se è sparito prima, non ottieni niente.'},
 {id:'immune',label:'Immune',test:/\bimmune\b/i,sentence:'Gli effetti di fine turno di quella risorsa non ti colpiscono; costi, guadagni e danni [[POISON]] restano.'},
];
/** The keywords the short text of a card uses, in the order of the rule. */
export const keywordsOf=(shortText:string):Keyword[]=>KEYWORDS.filter(k=>k.test.test(shortText)).map(({id,label,sentence})=>({id,label,sentence,reference:KEYWORD_REFERENCE}));

// The token's status and the timers of the Set Base carry the Java names; the Italian name and text are the annex's.
const TOKEN_OF_STATUS:Record<string,string>={'BROKEN BEER':'com.tokens.BrokenBeerBottle'};
const CARD_OF_TIMER:Record<string,string>={'Santino della portinaia':'base.items.SantinoDellaPortinaia','Marvelous Cocktail':'com.items.MarvelousCocktail','Blood Drain':'junkie.ToxicBloodDrain'};
/** Name and text of the status that a token creates, from the annex (the token's own name and its `statusText`, D198 (10)); null for any other status, without annex or for an annex without that text. */
export function tokenStatusOf(statusName:string):{name:string;text:string}|null{
 const t=TOKEN_OF_STATUS[statusName],e=t?entryOf(t):null;return e&&e.kind==='token'&&e.statusText?{name:e.name,text:e.statusText}:null;
}
/** The Italian name of the card whose timer this is, from the annex; null without annex or for an unknown timer. */
export const timerCardName=(timerName:string):string|null=>{const c=CARD_OF_TIMER[timerName];return c?entryOf(c)?.name??null:null;};

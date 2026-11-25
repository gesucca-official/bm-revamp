import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {keywordsOf,setAnnex,setIds,type Annex} from '../src/annex.ts';
import type {Card,CharacterCard} from '../src/contracts.ts';
import {GENERIC,NO_FILTERS,activeFilters,addRegular,characterOf,characterOrder,deckBar,deckBarText,deckSummary,emptyDraft,filterCards,isFiltering,matchesCharacter,setCharacter,setLastResort,shown,toggleBound,
  BOUND_CARDS,REGULAR_CARDS} from '../src/deck.ts';

// SB-31 F4 (D196 (4), D198): filters of the catalog and the editor, the stable order of the characters and the deck bar, on the 117 cards of the live annex.
const annex=JSON.parse(readFileSync(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8')) as Annex;
beforeEach(()=>setAnnex(annex));

// The catalog as the server publishes it, rebuilt from the annex: only what the filters read (binding, kind, item, the reservations of R02).
const catalog:Card[]=annex.cards.map(c=>({name:c.name,bindingName:c.class,effect:c.description,item:c.type==='Oggetto',basicAction:c.subtype==='Base',lastResort:c.subtype==='Ultima risorsa',
 characterBound:c.subtype==='Legata al personaggio',boundToCharacter:null,priority:0,canTarget:[],cost:{},image:null,sprite:null,exclusiveToCharacter:null}));
const characters:CharacterCard[]=annex.characters.map(c=>({name:c.name,bindingName:c.class,itemsSize:1,resources:{}}));
const f=(over:Partial<typeof NO_FILTERS>)=>({...NO_FILTERS,...over});
const names=(cards:Card[])=>cards.map(c=>c.bindingName).sort();

test('the generator writes `character` for every card of a character and for no generic one (D198 (13))',()=>{
 const withChar=annex.cards.filter(c=>c.character),without=annex.cards.filter(c=>!c.character);
 assert.equal(withChar.length+without.length,117);assert.equal(withChar.length,73);assert.equal(without.length,44);
 const known=new Set(annex.characters.map(c=>c.class));
 for(const c of withChar)assert.ok(known.has(c.character!),`${c.class}: ${c.character} is a character of the set`);
 const per=new Map<string,number>();for(const c of withChar)per.set(c.character!,(per.get(c.character!)??0)+1);
 assert.equal(per.size,7);assert.ok([...per.values()].every(n=>n>=10&&n<=11),JSON.stringify([...per]));
 for(const c of annex.cards.filter(x=>(x as {exclusiveTo?:string}).exclusiveTo))assert.equal(c.character,(c as {exclusiveTo?:string}).exclusiveTo,`${c.class}: the slot and the reservation agree`);
 assert.equal(annex.tokens[0].statusText!.includes('[[HIT]]'),true);assert.ok(!('character' in annex.tokens[0]),'the token is no one\'s');
});

test('the character filter reads `character` of the annex; «generic» is the cards without one (D198 (13))',()=>{
 const mara=characters.find(c=>c.name.startsWith('Mara'))!;
 const hers=filterCards(catalog,f({character:mara.bindingName}));assert.equal(hers.length,10);assert.ok(hers.every(c=>characterOf(c)===mara.bindingName));
 const generic=filterCards(catalog,f({character:GENERIC}));assert.equal(generic.length,44);assert.ok(generic.every(c=>characterOf(c)===null));
 assert.equal(filterCards(catalog,NO_FILTERS).length,117);
 setAnnex(null);assert.equal(filterCards(catalog,f({character:mara.bindingName})).length,0,'without the annex and without a reservation on the card nothing is attributed');
});

test('the filters intersect: character, rarity, type and search each narrow what the others left',()=>{
 const mara=characters.find(c=>c.name.startsWith('Mara'))!.bindingName,rare=annex.cards.filter(c=>c.rarity==='RARE'&&c.character===mara);
 const byChar=filterCards(catalog,f({character:mara})),byRarity=filterCards(catalog,f({rarity:'RARE'})),both=filterCards(catalog,f({character:mara,rarity:'RARE'}));
 assert.deepEqual(names(both),names(rare.map(c=>catalog.find(x=>x.bindingName===c.class)!)),'the cards that are hers and rare');
 assert.ok(both.length>0&&both.length<byChar.length&&both.length<byRarity.length,'strictly narrower than each filter alone');
 assert.deepEqual(names(both),names(byChar.filter(c=>byRarity.includes(c))));
 const items=filterCards(catalog,f({type:'item'})),actions=filterCards(catalog,f({type:'action'}));assert.equal(items.length,18-0);assert.equal(items.length+actions.length,117);
 const genericItems=filterCards(catalog,f({character:GENERIC,type:'item'}));assert.equal(genericItems.length,18);
 assert.equal(filterCards(catalog,f({character:mara,type:'item'})).length,0,'the items of the set are generic');
 const three=filterCards(catalog,f({character:GENERIC,rarity:'COMMON',type:'action',term:'colpo'}));
 assert.ok(three.every(c=>!c.item&&characterOf(c)===null&&annex.cards.find(a=>a.class===c.bindingName)!.rarity==='COMMON'&&JSON.stringify(c).toUpperCase().includes('COLPO')));
 assert.ok(three.length<filterCards(catalog,f({character:GENERIC,rarity:'COMMON',type:'action'})).length);
});

test('the rarity filter has «P» only for the characters: no card is a protagonist, every character is',()=>{
 assert.equal(filterCards(catalog,f({rarity:'PROTAGONIST'})).length,0);
 for(const r of ['COMMON','UNCOMMON','RARE'])assert.ok(filterCards(catalog,f({rarity:r})).length>0,r);
 assert.equal(filterCards(catalog,f({rarity:'COMMON'})).length+filterCards(catalog,f({rarity:'UNCOMMON'})).length+filterCards(catalog,f({rarity:'RARE'})).length,117,'every card has one of the three');
 assert.equal(characters.filter(c=>matchesCharacter(c,f({rarity:'PROTAGONIST'}))).length,7);
 assert.equal(characters.filter(c=>matchesCharacter(c,f({rarity:'RARE'}))).length,0);
 assert.equal(characters.filter(c=>matchesCharacter(c,f({type:'item'}))).length,0,'a character is neither action nor item');
 assert.equal(characters.filter(c=>matchesCharacter(c,f({character:GENERIC}))).length,0);
 assert.deepEqual(characters.filter(c=>matchesCharacter(c,f({character:characters[2].bindingName}))),[characters[2]]);
});

test('the set filter is read from the data and offered only from two sets',()=>{
 assert.deepEqual(setIds(),['base'],'one set today: the control is not shown');
 const two:Annex={...annex,cards:annex.cards.map((c,i)=>i===0?{...c,set:'mini'}:c)};setAnnex(two);
 assert.deepEqual(setIds(),['base','mini']);
 assert.deepEqual(filterCards(catalog,f({set:'mini'})).map(c=>c.bindingName),[annex.cards[0].class]);assert.equal(filterCards(catalog,f({set:'base'})).length,116);
});

test('the character order is by name then binding, whatever order the server sends them in',()=>{
 const order=characterOrder(characters).map(c=>c.name);
 assert.deepEqual(order,[...order].sort((a,b)=>a.localeCompare(b,'it')));
 assert.deepEqual(characterOrder([...characters].reverse()).map(c=>c.name),order);assert.deepEqual(characterOrder([...characters].sort(()=>0.5-Math.sin(characters.length))).map(c=>c.name),order);
 const twins=[{...characters[0],bindingName:'z.Twin'},{...characters[0],bindingName:'a.Twin'}];assert.deepEqual(characterOrder(twins).map(c=>c.bindingName),['a.Twin','z.Twin']);
 assert.equal(order.length,7);
});

test('the regular pool of the editor passes through the filters and never lists a basic, a last resort or a bound',()=>{
 const d=emptyDraft(),all=shown(d,catalog,'collection',NO_FILTERS);
 assert.equal(all.length,catalog.filter(c=>!c.basicAction&&!c.lastResort&&!c.characterBound).length);
 const mara=characters.find(c=>c.name.startsWith('Mara'))!.bindingName,hers=shown(d,catalog,'collection',f({character:mara,type:'action'}));
 assert.ok(hers.length>0&&hers.every(c=>characterOf(c)===mara&&!c.item));
 assert.deepEqual(shown(d,catalog,'collection','zzzz-no'),[]);assert.equal(isFiltering(NO_FILTERS),false);assert.equal(isFiltering(f({type:'item'})),true);
 const pool=all.filter(c=>c.item).slice(0,2),withDeck=pool.reduce((x,c)=>addRegular(x,c),d);
 assert.deepEqual(names(shown(withDeck,catalog,'deck',f({type:'item'}))),names(pool));assert.deepEqual(shown(withDeck,catalog,'deck',f({type:'action'})),[]);
});

test('the deck bar counts regular cards over 20, bound cards over 2 and the last resort (O15)',()=>{
 let d=emptyDraft();
 assert.equal(deckBarText(d),'Regolari 0 / 20 · legate 0 / 2 · ultima risorsa —');assert.deepEqual(deckBar(d),{regular:0,bound:0,lastResort:false});
 const [a,b,c]=catalog.filter(x=>x.characterBound).slice(0,3),last=catalog.find(x=>x.lastResort)!,reg=catalog.filter(x=>!x.basicAction&&!x.lastResort&&!x.characterBound);
 d=setLastResort(setCharacter(d,characters[0],catalog),last);d=toggleBound(d,a);
 assert.equal(deckBarText(d),'Regolari 0 / 20 · legate 1 / 2 · ultima risorsa ✓');
 d=toggleBound(toggleBound(d,b),c);assert.equal(deckBar(d).bound,BOUND_CARDS,'a third bound is ignored: the bar says 2 / 2');
 for(let i=0;i<7;i++)d=addRegular(d,reg[i]);d=addRegular(d,reg[0]);
 assert.equal(deckBarText(d),'Regolari 8 / 20 · legate 2 / 2 · ultima risorsa ✓');assert.equal(deckBar(d).regular,d.regularCards.length);
 for(const x of reg.slice(0,12))d=addRegular(addRegular(d,x),x);assert.equal(deckBar(d).regular,REGULAR_CARDS,'never more than 20');
});

test('the summary of the deck: parts, bound cards and regular cards with their copies',()=>{
 const reg=catalog.filter(x=>!x.basicAction&&!x.lastResort&&!x.characterBound),bound=catalog.filter(x=>x.characterBound).slice(0,2);
 let d=setCharacter(emptyDraft(),characters[0],catalog);d=toggleBound(toggleBound(d,bound[0]),bound[1]);d=addRegular(addRegular(addRegular(d,reg[0]),reg[0]),reg[1]);
 const s=deckSummary(d);
 assert.equal(s.character,characters[0].name);assert.equal(s.basic,null);assert.equal(s.lastResort,null);assert.deepEqual(s.bounds,bound.map(x=>x.name));
 assert.deepEqual(s.regular.map(r=>[r.name,r.n]),[[reg[0].name,2],[reg[1].name,1]]);assert.equal(s.total,3);
 assert.deepEqual(deckSummary(emptyDraft()),{character:null,basic:null,lastResort:null,bounds:[],regular:[],total:0});
});

test('D198 (8): the reminder of Vulnerabile is the sentence of the owner, with the symbols of the damages',()=>{
 const v=keywordsOf('Se lo trovi: diventi Vulnerabile.').find(k=>k.id==='vulnerable')!;
 assert.equal(v.sentence,'Subisci una volta e mezza i danni [[HIT]], [[CUT]] e [[POISON]] fino alla fine del turno in cui giochi una carta col nome trovato.');
});

// SB-31 F5 (D199 (26)): the «Filtri» button of a low screen counts the filters that are on, and the panel closes with Esc or a second tap.
test('the «Filtri» button counts the active filters, a search term included (D199 (26))',()=>{
 assert.equal(activeFilters(NO_FILTERS),0);
 assert.equal(activeFilters(f({character:GENERIC})),1);
 assert.equal(activeFilters(f({character:GENERIC,rarity:'RARE',type:'item',term:'colpo'})),4);
 assert.equal(activeFilters(f({term:'x'})),isFiltering(f({term:'x'}))?1:0);
});
test('the «Filtri» panel opens on a tap and closes on a second tap or Esc; the count and the reset stay outside it (source)',()=>{
 const tsx=readFileSync(new URL('../src/collection.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 assert.match(tsx,/setOpen\(o=>!o\)/,'a second tap closes');
 assert.match(tsx,/e\.key==='Escape'\)setOpen\(false\)/,'Esc closes');
 assert.match(tsx,/active>0\?`Filtri \(\$\{active\}\)`:'Filtri'/,'the label carries the number of active filters');
 const state=tsx.indexOf('className="filter-state"'),fields=tsx.indexOf('className="filter-fields"'),close=tsx.indexOf('</div>',fields);
 assert.ok(state>close,'«n di m carte» and «Azzera i filtri» are not inside the collapsible fields');
 assert.match(css,/@media\(max-height:550px\)\s*\{\s*\.filters-toggle\s*\{[^}]*min-height: 44px/,'the button is at least 44 px at the compact size');
 assert.match(css,/\.filter-bar \.filter-fields\s*\{[^}]*display: none/,'closed at the compact size');
 assert.match(css,/\.filters-toggle\s*\{\s*display: none/,'not drawn on a wide screen');
});

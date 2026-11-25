import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annexNow,entryOf,hasFullText,keywordsOf,rarityOf,setAnnex,timerCardName,tokenStatusOf,KEYWORD_REFERENCE,type Annex} from '../src/annex.ts';
import {chipsOf,groupChips,plainText,type Chip} from '../src/readability.ts';
import {TEXT_SYMBOLS} from '../src/symbols.ts';
import type {Character,Status} from '../src/contracts.ts';

// SB-31 F3 (D196 (3), D197): the texts the wire does not carry come from the annex of the live set (docs/rules-catalog.json, imported at build).
const annex=JSON.parse(readFileSync(new URL('../../docs/rules-catalog.json',import.meta.url),'utf8')) as Annex;
const card=(name:string)=>annex.cards.find(c=>c.name===name)!;
beforeEach(()=>setAnnex(annex));

test('the annex gives full text, flavour and rarity by class (= bindingName) for every card, character and token of the set',()=>{
 assert.equal(annex.cards.length,117);assert.equal(annex.characters.length,7);assert.equal(annex.tokens.length,1);
 for(const c of [...annex.cards,...annex.characters]){const e=entryOf(c.class)!;assert.ok(e,c.class);assert.ok(hasFullText(e),`${c.class} has a full text`);assert.equal(e.name,c.name);assert.equal(e.flavour,c.flavour);assert.deepEqual(e.fullText,c.fullText);}
 assert.equal(entryOf(annex.cards[0].class)!.kind,'card');assert.equal(entryOf(annex.characters[0].class)!.kind,'character');assert.equal(entryOf(annex.tokens[0].class)!.kind,'token');
 assert.equal(entryOf(annex.cards[0].class)!.rarity,annex.cards[0].rarity);assert.equal(entryOf(annex.characters[0].class)!.rarity,'PROTAGONIST');
});
test('a card without an annex entry (an archived 0.1 game, no chunk) has no full-text button and no flavour',()=>{
 for(const unknown of ['com.bruiser.LittleRage','',undefined,null]){const e=entryOf(unknown as string);assert.equal(e,null,String(unknown));assert.equal(hasFullText(e),false,`no button for ${unknown}`);}
 setAnnex(null);assert.equal(annexNow(),null);assert.equal(entryOf(annex.cards[0].class),null,'the chunk has not arrived');assert.equal(hasFullText(entryOf(annex.cards[0].class)),false);
 // An entry with no paragraph has no button either: the swap would show nothing.
 setAnnex({...annex,cards:[{...annex.cards[0],fullText:[]}]});assert.equal(hasFullText(entryOf(annex.cards[0].class)),false);
});

// The keywords a card uses are recognised in its short text (the description of the annex is the text the card prints).
const WORDS:[string,string,string][]=[['announce','SGOMBERIAMOVI','Annuncia'],['vulnerable','SGOMBERIAMOVI','Vulnerabile'],['ahead','Sgommata','Gioca d’anticipo'],['rises','Ultimo Giro','Rincara'],
 ['inplay','Sigaretta Accesa','In campo'],['sell','Fiuto per gli Affari','Vendi'],['immune','Santino di San Briaco','Immune']];
test('R07b: each of the seven keywords gets one reminder line on a card that prints it, with the reference',()=>{
 for(const [id,name,label] of WORDS){const lines=keywordsOf(card(name).description),line=lines.find(k=>k.id===id);assert.ok(line,`${name} → ${id}`);
  assert.equal(line.label,label);assert.equal(line.reference,KEYWORD_REFERENCE);assert.equal(KEYWORD_REFERENCE,'regolamento, R07b');assert.ok(line.sentence.length>20&&line.sentence.length<220,`${id} is one short sentence`);}
 assert.deepEqual(keywordsOf(card('Mescolone Micidiale').description).map(k=>k.id),['immune'],'one line per keyword, not per occurrence');
 assert.deepEqual(keywordsOf('Subisci 2 [[HIT]]. +5 [[V]].'),[],'a card without keywords has no line');
 assert.deepEqual(keywordsOf(card('Lavoro Fatto Bene').description),[],'«in campo» in the middle of prose is not the keyword (Lavoro Fatto Bene counts its objects in play)');
 assert.deepEqual(keywordsOf('Se lo trovi: Annuncia «X». Vulnerabile. Vulnerabile.').map(k=>k.id),['announce','vulnerable']);
 assert.deepEqual(keywordsOf('Un oggetto in campo, vendi pure; Gioca d\'anticipo: 5 [[HIT]]').map(k=>k.id),['ahead'],'«in campo» and «vendi» as prose are not the keywords; the apostrophe may be straight');
});
test('R07b: the reminder lines cover every card of the set that prints a keyword, and only those',()=>{
 const count=(id:string)=>annex.cards.filter(c=>keywordsOf(c.description).some(k=>k.id===id)).length;
 assert.deepEqual(Object.fromEntries(WORDS.map(([id])=>[id,count(id)])),{announce:13,vulnerable:14,ahead:4,rises:4,inplay:2,sell:1,immune:3});
 for(const [id] of WORDS)for(const k of keywordsOf(annex.cards.map(c=>c.description).join(' ')).filter(x=>x.id===id))for(const m of k.sentence.matchAll(/\[\[[^\]]*\]\]/g))assert.ok(TEXT_SYMBOLS.has(m[0]),`${id}: ${m[0]} is a symbol the client draws`);
});

test('rarity: one to three ticks as in the print, «P» for the characters; the same table as tools/print-cards/bozza.py',()=>{
 const print=readFileSync(new URL('../../tools/print-cards/bozza.py',import.meta.url),'utf8'),table=print.match(/^RARITY = \{(.*)\}$/m)![1];
 const rows=[...table.matchAll(/'(\w+)': \('([^']+)', (\d)\)/g)];assert.equal(rows.length,4);
 for(const [,key,label,pips] of rows){const r=rarityOf(key)!;assert.ok(r,key);assert.equal(r.ticks,Number(pips),`${key} ticks`);
  assert.equal(r.label,label.replace(/ \(P\)$/,'').toLowerCase(),`${key} label`);assert.equal(r.mark,key==='PROTAGONIST'?'P':'');}
 assert.equal(rarityOf('LEGENDARY'),null);assert.equal(rarityOf(null),null);assert.equal(rarityOf(undefined),null);
});

test('the status of the token takes its name and text from the annex, not from the class',()=>{
 const t=annex.tokens[0],got=tokenStatusOf('BROKEN BEER')!;assert.equal(got.name,t.name);assert.equal(got.name,'Bottiglia Spaccata');assert.equal(got.text,t.description);
 assert.equal(tokenStatusOf('LIEVE FASTIDIO'),null);setAnnex(null);assert.equal(tokenStatusOf('BROKEN BEER'),null,'without the annex the server text stays');
});

const status=(over:Partial<Status>):Status=>({name:'X',description:'Server text',type:'GOOD',flow:'INPUT',impactedProperty:'HIT',lastsForTurns:2,equip:false,singleUse:false,amountFunction:{},typeFunction:{},...over});
const base=(over:Partial<Character>):Pick<Character,'statuses'|'immunities'|'timers'|'plays'>=>({statuses:[],immunities:[],timers:[],...over});
test('SB-31 F3 (D197 (3)): in a live game the token status shows the annex name and text; the Java English of the class never shows',()=>{
 const english='Hit Damage dealt x1.5 and turned to Cut Damage',s=status({name:'BROKEN BEER',description:english,equip:true,singleUse:true,lastsForTurns:null});
 const [chip]=chipsOf('Tu',base({plays:{},statuses:[s]}));
 assert.equal(chip.title,'Equipaggiamento: Bottiglia Spaccata');assert.ok(chip.text.includes(annex.tokens[0].description.replace(/[.\s]+$/,'')),chip.text);assert.ok(!chip.text.includes(english));
 setAnnex(null);assert.ok(chipsOf('Tu',base({plays:{},statuses:[s]}))[0].text.startsWith(english),'chunk not arrived: the server text, never a blank');
});
test('SB-31 F3 (D197 (3)): STATUS_TEXT and TIMER_TEXT are for the archived 0.1 games only (no public counter `plays`)',()=>{
 const old=status({name:'YOU CARESS ME',description:'Hit Damage Taken: x0.35'}),timer={name:'Marvelous Cocktail',timer:3,callback:{}};
 const archived=chipsOf('Tu',base({statuses:[old],timers:[timer]})),live=chipsOf('Tu',base({plays:{},statuses:[old],timers:[timer]}));
 assert.match(archived[0].text,/×0,35/);assert.match(archived[1].text,/toglie immunità e stati/);assert.equal(archived[1].title,'Timer: Marvelous Cocktail');
 assert.match(live[0].text,/^Hit Damage Taken: x0.35\./,'live: the description of the server');assert.ok(!/×0,35/.test(live[0].text));
 assert.equal(live[1].title,'Timer: Mescolone Micidiale','live: the Italian name of the card, from the annex');assert.ok(!/toglie immunità e stati/.test(live[1].text));assert.match(live[1].text,/«Mescolone Micidiale»/);
 assert.equal(timerCardName('Blood Drain'),'Trascinare nel Tunnel');assert.equal(timerCardName('Santino della portinaia'),'Santino di San Briaco');assert.equal(timerCardName('Unknown'),null);
 setAnnex(null);assert.equal(chipsOf('Tu',base({plays:{},timers:[timer]}))[0].title,'Timer: Marvelous Cocktail');
});
test('SB-31 F3: the description of a live status keeps its placeholders for the shell to draw; the label of the canvas reads them as words',()=>{
 const [chip]=chipsOf('Tu',base({plays:{},statuses:[status({name:'LIEVE FASTIDIO',description:'Subisci metà dei [[HIT]] che subiresti.',type:'GOOD'})]}));
 assert.ok(chip.text.includes('[[HIT]]'));assert.equal(plainText(`${chip.title}. ${chip.text}`).includes('[['),false);assert.match(plainText(chip.text),/metà dei colpo che subiresti/);
 const all=[...TEXT_SYMBOLS.keys()].join(' ');assert.equal(plainText(all),'salute allerta violenza tossicità alcol colpo taglio veleno');
 assert.equal(plainText('Spendi 2 [[L]], infliggi 10 [[POISON]].'),'Spendi 2 alcol, infliggi 10 veleno.');assert.equal(plainText('[[X]] resta'),'[[X]] resta','an unknown placeholder stays text, as textParts has it');
 const scene=readFileSync(new URL('../src/scene.ts',import.meta.url),'utf8');assert.ok(scene.includes('label:plainText(`${chip.title}. ${chip.text}`)'),'the chip label of the canvas is plain text');
});
test('SB-31 F3 (D171 (3), D196 (5)): the list groups the statuses of the same name under one name; the table keeps one chip per status',()=>{
 const three=[1,2,3].map(n=>status({name:'LIEVE FASTIDIO',description:`Subisci tre quarti dei [[HIT]] (${n}).`,lastsForTurns:n})),other=status({name:'PELLE DURA',type:'GOOD'});
 const chips=chipsOf('Tu',base({plays:{},immunities:['TOXICITY'],statuses:[three[0],other,three[1],three[2]]}));
 assert.equal(chips.length,5,'one chip per status on the table');
 const groups=groupChips(chips);assert.deepEqual(groups.map(g=>[g.title,g.chips.length]),[['Immune a tossicità',1],['Stato positivo: LIEVE FASTIDIO',3],['Stato positivo: PELLE DURA',1]],'first appearance order, one group per name');
 assert.deepEqual(groups[1].chips.map(c=>c.short),['1','2','3'],'the descriptions keep their own duration, in a row');
 assert.deepEqual(groupChips([]),[]);
 // Same name but not the same kind (an equipment and a status) are two groups: the title carries the kind.
 const mixed=chipsOf('Tu',base({plays:{},statuses:[status({name:'A',equip:true}),status({name:'A'})]}));assert.equal(groupChips(mixed).length,2);
 const lone:Chip[]=[];assert.equal(groupChips(lone).length,0);
});

// The shell wires these functions in; the table needs the browser, so this reads its source, as the other scene and shell tests do.
test('SB-31 F3: the inspection of the table uses the annex entry for the button, the grouping and the symbols of the statuses',()=>{
 const table=readFileSync(new URL('../src/table.tsx',import.meta.url),'utf8').replaceAll(String.fromCharCode(13),'');
 assert.ok(table.includes('{hasFullText(entry)&&<PressButton className="full-text-toggle"'),'the button exists only for a card with a full text');
 assert.ok(table.includes('hasFullText(entry)&&fullText?'),'the swap needs the full text too');
 assert.ok(table.includes('groupChips(chipsOf(inspection.owner!,'),'the list of the inspection is grouped');
 assert.ok(table.includes('<RichText text={c.text}/>'),'the descriptions of the statuses are drawn with their symbols');
 assert.ok(table.includes('keywordsOf(shortText(inspection.card))'),'the keywords are recognised in the short text');
 assert.ok(!/<RarityMark[^>]*>/.test(readFileSync(new URL('../src/scene.ts',import.meta.url),'utf8')),'the rarity is for the inspection only, never on the faces of the table');
});

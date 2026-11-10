import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RES_COLOR,ROLE_COLOR,DAMAGE_COLOR,DAMAGE_ACCENT} from '../src/readability.ts';
import {FRAME_INK,FRAME_PAPER} from '../src/frames.ts';
import {EDGE_INK,LIGHT,edgeFor} from '../src/symbols.ts';

// C4-8a (D12 a): WCAG 2.2 AA as the target (4.5:1 for text, 3:1 for large text, symbols and components), calculated from the constants of the drawing and the tokens of
// the stylesheet. It does not see textures, illustrations, scenes in motion or filters (the measure on the real drawing is the sample of the report of the block). It is a
// goal with its exceptions listed, not a claim of conformance.
const lin=(v:number)=>{const s=v/255;return s<=.03928?s/12.92:((s+.055)/1.055)**2.4;};
const lum=(c:number)=>.2126*lin(c>>16&255)+.7152*lin(c>>8&255)+.0722*lin(c&255);
const ratio=(a:number,b:number)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05);};
const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8'),scene=readFileSync(new URL('../src/scene.ts',import.meta.url),'utf8');
const token=(name:string)=>{const m=new RegExp(`--${name}:\\s*#([0-9a-f]{6})\\s*;`,'i').exec(css);assert.ok(m,`opaque token --${name}`);return parseInt(m![1],16);};

// The grounds of the drawing. The literals are read from the drawing too, so that changing one of them asks for this test to be reviewed.
const CREAM=0xfff6e2,PILL=0xf6efd9,CARD=FRAME_PAPER,INK=FRAME_INK,WINE=0x742e33,BOARD=0x2d1f16,WOOD_MID=0x6b4a33,PETROL=0x6eafaf,RING=token('focus-table'),HALO=token('focus-halo');
// BOARD is the measured colour of the dark boards: the fill 0x120c08 at 90% over the wood (not a literal of the code).
test('the grounds of the drawing are still the ones measured',()=>{
 for(const lit of ['0xfff6e2','0xf6efd9','0x742e33','0x120c08','0xe9dcc2','0xffb7bd'])assert.ok(scene.includes(lit),`scene.ts no longer has ${lit}`);
 assert.equal(CARD,0xe8d7b4);assert.equal(INK,0x30231e);assert.equal(EDGE_INK,INK);assert.equal(LIGHT,0xf3ead2);
});

type Pair={group:'text'|'symbol'|'focus'|'component';name:string;fg:number;bg:number;need:number};
const PAIRS_COUNT=56;
const roles=Object.entries(ROLE_COLOR),res=Object.entries(RES_COLOR),dmg=Object.entries(DAMAGE_COLOR);
const chipFill:Record<string,number>={good:0x2c6262,bad:WINE,equip:0x86561b,immunity:0x343f6b,timer:INK};
const PAIRS:Pair[]=[
 {group:'text',name:'title and subtitle: ink on card',fg:INK,bg:CARD,need:4.5},
 ...roles.map(([k,c])=>({group:'text' as const,name:`role stamp ${k}: cream text on its colour`,fg:CREAM,bg:c,need:4.5})),
 {group:'text',name:'cost: cream on ink',fg:CREAM,bg:INK,need:4.5},{group:'text',name:'unpayable cost: cream on wine',fg:CREAM,bg:WINE,need:4.5},
 ...Object.entries(chipFill).map(([k,c])=>({group:'text' as const,name:`status chip ${k}: cream on its fill`,fg:CREAM,bg:c,need:4.5})),
 {group:'text',name:'gain and damage: ink on pill',fg:INK,bg:PILL,need:4.5},
 {group:'text',name:'board: cream on dark',fg:CREAM,bg:BOARD,need:4.5},{group:'text',name:'board: negative number',fg:0xffb7bd,bg:BOARD,need:4.5},{group:'text',name:'board: name of an opponent',fg:0xe9dcc2,bg:BOARD,need:4.5},
 {group:'text',name:'shell: text on sheet',fg:token('text'),bg:token('bg-sheet'),need:4.5},{group:'text',name:'shell: text on panel',fg:token('text'),bg:token('bg-panel'),need:4.5},
 {group:'text',name:'shell: muted text on panel',fg:token('text-muted'),bg:token('bg-panel'),need:4.5},
 {group:'text',name:'shell: empty-state text on sheet (3a)',fg:token('empty-text'),bg:token('bg-sheet'),need:4.5},
 {group:'text',name:'shell: placeholder on the field (3a)',fg:token('placeholder'),bg:token('bg-panel'),need:4.5},
 {group:'component',name:'shell: border of fields and buttons on the sheet (3a)',fg:token('border-panel'),bg:token('bg-sheet'),need:3},
 ...res.map(([k,c])=>({group:'symbol' as const,name:`resource ${k} on the light coin`,fg:c,bg:PILL,need:3})),
 ...res.map(([k,c])=>({group:'symbol' as const,name:`resource ${k} on the dark board`,fg:c,bg:BOARD,need:3})),
 ...dmg.map(([k,c])=>({group:'symbol' as const,name:`damage ${k} (main colour) on the pill`,fg:c,bg:PILL,need:3})),
 ...Object.entries(DAMAGE_ACCENT).map(([k,c])=>({group:'symbol' as const,name:`damage ${k} (accent) on the pill`,fg:c,bg:PILL,need:3})),
 ...roles.map(([k,c])=>({group:'symbol' as const,name:`role ${k}: glyph of the card on its colour`,fg:CARD,bg:c,need:3})),
 {group:'focus',name:'ring on the dark wood',fg:RING,bg:BOARD,need:3},{group:'focus',name:'ring on the mid wood',fg:RING,bg:WOOD_MID,need:3},
 {group:'focus',name:'ring on the card',fg:RING,bg:CARD,need:3},{group:'focus',name:'ring on the coin',fg:RING,bg:PILL,need:3},
 {group:'focus',name:'dark band of the ring against the ring',fg:HALO,bg:RING,need:3},{group:'focus',name:'dark band of the ring against the card',fg:HALO,bg:CARD,need:3},
 {group:'focus',name:'dark band of the ring against the coin',fg:HALO,bg:PILL,need:3},
 {group:'focus',name:'halo of the allowed targets (petrol) on the card',fg:PETROL,bg:CARD,need:3},
];
/** Declared exceptions: pair → why it is acceptable. Each must still be below its threshold (a stale exception fails). */
const EXCEPTIONS:Record<string,string>={
 'damage HIT (accent) on the pill':'decorative: the type is read from the main colour and the shape (burst), and the amount is in the number (rule 11)',
 'damage CUT (accent) on the pill':'decorative: the knife is read from its main colour and shape',
 'damage POISON (accent) on the pill':'decorative: the drop is read from its main colour and shape',
 'ring on the card':'the ring is flanked by the dark band (1a), which passes against ring and card: the pair that counts is the band',
 'ring on the coin':'same: the dark band flanks the ring',
 'halo of the allowed targets (petrol) on the card':'it lies on the wood (6.4:1 dark, 3.2:1 mid); on a card the ring and the arrow are there as well',
 'resource TOXICITY on the light coin':'1 px outline of ink (3b, edgeFor): the outline is the pair that counts, see the next test',
 'resource ALCOHOL on the light coin':'1 px outline of ink (3b)',
 'resource HEALTH on the dark board':'1 px light outline (3b)',
};
test('every colour pair of the drawing reaches its threshold, or is a declared exception that still needs to be one',()=>{
 const below=PAIRS.filter(p=>ratio(p.fg,p.bg)<p.need).map(p=>p.name);
 assert.deepEqual(below.filter(n=>!(n in EXCEPTIONS)),[],'pairs under the threshold without a declared exception');
 const stale=Object.keys(EXCEPTIONS).filter(n=>!below.includes(n));assert.deepEqual(stale,[],'declared exceptions that no longer fail (remove them) or that are not pairs');
 assert.equal(PAIRS.length,PAIRS_COUNT,'the table of pairs changed: say why in the test');
});

test('3b: the three symbols under 3:1 have their outline, and the outline passes against the ground',()=>{
 const covered:[string,'dark'|'light','HEALTH'|'ALCOHOL'|'TOXICITY',number][]=[['resource HEALTH on the dark board','dark','HEALTH',BOARD],['resource ALCOHOL on the light coin','light','ALCOHOL',PILL],['resource TOXICITY on the light coin','light','TOXICITY',PILL]];
 for(const [name,ground,kind,bg] of covered){const p=PAIRS.find(x=>x.name===name)!;assert.ok(ratio(p.fg,p.bg)<3,`${name} is under 3:1 without the outline`);
  const edge=edgeFor(kind,ground);assert.ok(edge!==undefined,`${kind} on ${ground} has an outline`);assert.ok(ratio(edge!,bg)>=3,`${kind}: the outline against the ground`);}
 // The other resources, and the others' other grounds, need none: they pass without it.
 for(const k of Object.keys(RES_COLOR) as (keyof typeof RES_COLOR)[])for(const [ground,bg] of [['dark',BOARD],['light',PILL]] as const){
  const needs=ratio(RES_COLOR[k],bg)<3,has=edgeFor(k,ground)!==undefined;assert.equal(has,needs,`${k} on ${ground}: outline exactly where the pair fails`);}
});

test('the dark band of the focus is in the stylesheet on the table, its controls and the confirmation, and not on the paper of the dialogs',()=>{
 assert.match(css,/\.semantic:focus-visible\s*\{[^}]*box-shadow:\s*0 0 0 9px var\(--focus-halo\)/);
 assert.match(css,/main button:not\(\.semantic\):not\(dialog button\):not\(\.confirmation button\):focus-visible\s*\{\s*box-shadow:\s*0 0 0 9px var\(--focus-halo\)/);
 assert.match(css,/\.confirmation button:focus-visible\s*\{[^}]*outline-offset:\s*-6px;[^}]*box-shadow:\s*inset 0 0 0 9px var\(--focus-halo\)/);
 assert.match(css,/::placeholder\s*\{\s*color:\s*var\(--placeholder\);\s*opacity:\s*1/);
});

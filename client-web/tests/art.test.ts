import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {artIndex,artFrame,artCss,type AtlasLayout} from '../src/art.ts';

const read=(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const catalog=read('../../docs/rules-catalog.json');
const entry=read('../public/art/manifest.json').files.find((f:{file:string})=>f.file==='art/atlas.webp');
const layout:AtlasLayout=entry;
const classes:string[]=[...catalog.cards,...catalog.characters,...catalog.tokens].map((c:{class:string})=>c.class);

// SB-28, D184 (2): the annex is the live Set Base 1.0 (117 cards, 7 characters, 1 token: 125 classes). The atlas still draws the 40 classes
// of the Set Base 0.1; the images are SB-32's. The 34 classes that stay in the set keep their own tile, the other 91 get the neutral
// placeholder (no-img.png) until SB-32 draws them, and the 6 classes that left the set (D182, D183) keep a tile no card asks for.
const LEFT_THE_SET=['bruiser.WhatchaDoin','com.ShuffleFeet','junkie.BadTrip','junkie.BeggingMoney','junkie.EverythingIsDrug','junkie.GoingBerserk'];
test('O9: every class of the annex has its own tile inside the atlas, or the placeholder while its art is missing (SB-28, D184 (2))',()=>{
 assert.equal(classes.length,125);
 const used=new Set<number>();let drawn=0,placeholders=0;
 for(const c of classes){
  const i=artIndex(c,layout);
  if(!Object.hasOwn(layout.tiles,c)){assert.equal(i,layout.placeholder,`${c} has no tile: the placeholder`);placeholders++;continue;}
  drawn++;
  assert.notEqual(i,layout.placeholder,`${c} has a tile in the manifest but uses the placeholder`);
  assert.ok(Number.isInteger(i)&&i>=0&&i<layout.cols*layout.rows,`${c} out of the grid`);
  assert.ok(!used.has(i),`${c} shares tile ${i}`);used.add(i);
  const f=artFrame(i,layout);
  assert.ok(f.x>=0&&f.y>=0&&f.x+f.size<=entry.width&&f.y+f.size<=entry.height,`${c} frame outside the image`);
 }
 assert.equal(drawn,34,'classes of the annex with their own tile');assert.equal(placeholders,91,'classes of the annex on the placeholder until SB-32');
 assert.deepEqual(Object.keys(layout.tiles).filter(c=>!classes.includes(c)).sort(),[...LEFT_THE_SET].sort(),'the manifest names no class the annex does not know, but the six that left the set');
});

test('O9: atlas stays within the owner limits',()=>{
 assert.ok(entry.width<=2048&&entry.height<=2048);
 assert.equal(entry.width,layout.cols*layout.cell);assert.equal(entry.height,layout.rows*layout.cell);
});

test('O9: an unknown bindingName gets the neutral placeholder, not another card',()=>{
 for(const b of ['','com.unknown.Nothing','bruiser.character.BigBadBruiserX'])assert.equal(artIndex(b,layout),layout.placeholder);
 assert.ok(!Object.values(layout.tiles).includes(layout.placeholder));
});

test('O9: inspection background selects the whole cell of the same tile',()=>{
 const css=artCss(layout.cols+1,layout) as {backgroundSize:string;backgroundPosition:string};
 assert.equal(css.backgroundSize,`${layout.cols*100}% ${layout.rows*100}%`);
 assert.equal(css.backgroundPosition,`${100/(layout.cols-1)}% ${100/(layout.rows-1)}%`);
});

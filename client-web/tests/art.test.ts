import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {artIndex,artFrame,artCss,type AtlasLayout} from '../src/art.ts';

const read=(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const catalog=read('../../docs/rules-catalog.json');
const entry=read('../public/art/manifest.json').files.find((f:{file:string})=>f.file==='art/atlas.webp');
const layout:AtlasLayout=entry;
const classes:string[]=[...catalog.cards,...catalog.characters,...catalog.tokens].map((c:{class:string})=>c.class);

test('O9: every class of the annex has its own tile inside the atlas',()=>{
 assert.equal(classes.length,40);
 const used=new Set<number>();
 for(const c of classes){
  const i=artIndex(c,layout);
  assert.notEqual(i,layout.placeholder,`${c} uses the placeholder`);
  assert.ok(Number.isInteger(i)&&i>=0&&i<layout.cols*layout.rows,`${c} out of the grid`);
  assert.ok(!used.has(i),`${c} shares tile ${i}`);used.add(i);
  const f=artFrame(i,layout);
  assert.ok(f.x>=0&&f.y>=0&&f.x+f.size<=entry.width&&f.y+f.size<=entry.height,`${c} frame outside the image`);
 }
 assert.deepEqual(Object.keys(layout.tiles).sort(),[...classes].sort(),'manifest lists exactly the annex classes');
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

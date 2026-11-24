import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {artIndex,artFrame,artCss,placeholderRef,type AtlasLayout,type AtlasFile} from '../src/art.ts';

const read=(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const catalog=read('../../docs/rules-catalog.json');
const manifest=read('../public/art/manifest.json') as {files:(Partial<AtlasFile>&{file:string})[]};
const layout:AtlasLayout={files:manifest.files.filter(f=>f.tiles) as AtlasFile[]};
const classes:string[]=[...catalog.cards,...catalog.characters,...catalog.tokens].map((c:{class:string})=>c.class);

// SB-31 F2 (D196 (6)): one or more atlas files per set, 8x8 cells of 256 px, named <set>-<n>.webp; the manifest says for each class which atlas and which cell.
// SB-28, D184 (2): the annex is the live Set Base 1.0 (117 cards, 7 characters, 1 token: 125 classes). The atlas still draws the 40 classes
// of the Set Base 0.1; the images are SB-32's. The 34 classes that stay in the set keep their own tile, the other 91 get the neutral
// placeholder (no-img.png) until SB-32 draws them, and the 6 classes that left the set (D182, D183) keep a tile no card asks for.
const LEFT_THE_SET=['bruiser.WhatchaDoin','com.ShuffleFeet','junkie.BadTrip','junkie.BeggingMoney','junkie.EverythingIsDrug','junkie.GoingBerserk'];
const file=(n:number)=>layout.files[n];
test('O9: every class of the annex has its own cell in an atlas of its set, or the placeholder while its art is missing (SB-28, D184 (2); SB-31 F2)',()=>{
 assert.equal(classes.length,125);
 const used=new Set<string>();let drawn=0,placeholders=0;
 const ph=placeholderRef(layout);
 for(const c of classes){
  const r=artIndex(c,layout),owner=layout.files.find(f=>Object.hasOwn(f.tiles,c));
  if(!owner){assert.deepEqual(r,ph,`${c} has no tile: the placeholder`);placeholders++;continue;}
  drawn++;
  assert.notDeepEqual(r,ph,`${c} has a tile in the manifest but uses the placeholder`);
  assert.equal(file(r.atlas),owner,`${c} is looked up in the atlas that holds it`);assert.equal(r.cell,owner.tiles[c]);
  assert.ok(Number.isInteger(r.cell)&&r.cell>=0&&r.cell<owner.cols*owner.rows,`${c} out of the grid`);
  const key=`${r.atlas}:${r.cell}`;assert.ok(!used.has(key),`${c} shares cell ${key}`);used.add(key);
  const f=artFrame(r.cell,owner);
  assert.ok(f.x>=0&&f.y>=0&&f.x+f.size<=owner.width&&f.y+f.size<=owner.height,`${c} frame outside the image`);
 }
 assert.equal(drawn,34,'classes of the annex with their own tile');assert.equal(placeholders,91,'classes of the annex on the placeholder until SB-32');
 assert.deepEqual(layout.files.flatMap(f=>Object.keys(f.tiles)).filter(c=>!classes.includes(c)).sort(),[...LEFT_THE_SET].sort(),'the manifest names no class the annex does not know, but the six that left the set');
});

test('O9, SB-31 F2: the atlases are 8x8 cells of 256 px named after their set, within the owner limits, and no class is in two of them',()=>{
 assert.ok(layout.files.length>=1);
 for(const f of layout.files){
  assert.ok(f.width<=2048&&f.height<=2048,`${f.file} is within 2048 px`);
  assert.equal(f.cols,8);assert.equal(f.rows,8);assert.equal(f.cell,256);
  assert.equal(f.width,f.cols*f.cell);assert.equal(f.height,f.rows*f.cell);
  assert.match(f.file,new RegExp(`^art/${f.set}-${f.atlas}\.webp$`),'file name from set and atlas number');
  assert.ok(Object.values(f.tiles).every(c=>Number.isInteger(c)&&c>=0&&c<f.cols*f.rows&&c!==f.placeholder),`${f.file}: cells inside the grid, none on the placeholder`);
  assert.equal(new Set(Object.values(f.tiles)).size,Object.keys(f.tiles).length,`${f.file}: one class per cell`);
 }
 const all=layout.files.flatMap(f=>Object.keys(f.tiles));assert.equal(new Set(all).size,all.length,'a class is in one atlas only');
 assert.equal(layout.files.filter(f=>f.placeholder!==undefined).length>=1,true);
 // A set fills its atlases in order: all full (64 cells) but the last, which holds the placeholder after its tiles.
 for(const set of new Set(layout.files.map(f=>f.set))){const own=layout.files.filter(f=>f.set===set);
  own.forEach((f,i)=>{assert.equal(f.atlas,i,`${set}: atlases numbered in order`);const cells=Object.keys(f.tiles).length+(f.placeholder!==undefined?1:0);
   if(i<own.length-1)assert.equal(cells,f.cols*f.rows,`${f.file}: full before the next atlas of its set`);else assert.ok(f.placeholder!==undefined,`${f.file}: the last atlas of ${set} holds the placeholder`);});}
});

test('O9: an unknown bindingName gets the neutral placeholder, not another card',()=>{
 const ph=placeholderRef(layout);
 for(const b of ['','com.unknown.Nothing','bruiser.character.BigBadBruiserX'])assert.deepEqual(artIndex(b,layout),ph);
 for(const f of layout.files)assert.ok(!Object.values(f.tiles).includes(ph.cell)||f!==file(ph.atlas));
});

test('O9, SB-31 F2: a class is looked up in the atlas that holds it, in any set, and the placeholder is the one of the set that has it',()=>{
 // Two sets, the second with its classes in two atlases: the atlas number is the position in `files`, the cell is the one of its manifest.
 const grid={cols:8,rows:8,cell:256,pad:2,width:2048,height:2048};
 const two:AtlasLayout={files:[
  {file:'art/base-0.webp',set:'base',atlas:0,...grid,placeholder:63,tiles:{'a.One':0,'a.Two':7}},
  {file:'art/exp-0.webp',set:'exp',atlas:0,...grid,tiles:{'b.One':5}},
  {file:'art/exp-1.webp',set:'exp',atlas:1,...grid,tiles:{'b.Two':9}}]};
 assert.deepEqual(artIndex('a.Two',two),{atlas:0,cell:7});
 assert.deepEqual(artIndex('b.One',two),{atlas:1,cell:5});
 assert.deepEqual(artIndex('b.Two',two),{atlas:2,cell:9});
 assert.deepEqual(artIndex('c.Missing',two),{atlas:0,cell:63},'a class without a source: the placeholder, not another tile');
 assert.deepEqual(artIndex('anything',null),{atlas:0,cell:0},'before the manifest loads');
});

test('O9: inspection background selects the whole cell of the same tile, in the atlas that holds it',()=>{
 const f=file(0),ref={atlas:0,cell:f.cols+1},css=artCss(ref,layout) as {backgroundImage:string;backgroundSize:string;backgroundPosition:string};
 assert.equal(css.backgroundImage,`url('/${f.file}')`);
 assert.equal(css.backgroundSize,`${f.cols*100}% ${f.rows*100}%`);
 assert.equal(css.backgroundPosition,`${100/(f.cols-1)}% ${100/(f.rows-1)}%`);
 assert.deepEqual(artCss({atlas:9,cell:0},layout),{},'an atlas that is not there draws nothing');assert.deepEqual(artCss(ref,null),{});
});

test('O9, SB-31 F2: the scene loads one texture per atlas file of the manifest and draws a cell from the atlas the class is in; the stylesheet names no atlas',()=>{
 const scene=readFileSync(new URL('../src/scene.ts',import.meta.url),'utf8'),css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 assert.ok(scene.includes('for(const file of layout.files){const sheet=await Assets.load<Texture>(`/${file.file}`)'),'one load per atlas file of the manifest');
 assert.ok(scene.includes('this.art[r.atlas]?.[r.cell]??Texture.EMPTY'),'a tile is the cell of its atlas');
 assert.ok(!/art\/atlas\.webp|\/art\/[a-z]+-\d+\.webp/.test(scene+css),'no atlas file named in the scene or the stylesheet: the manifest says which');
});

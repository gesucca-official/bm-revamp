// O9, SB-31 F2 (D196 (6)): builds the art atlases of public/art/ from the local, untracked sources of each set and writes manifest + inventory.
// One folder per set, with its assets.json (the tiles[] it lists are the sources: bindingName, source, sourceSha256 and the provenance fields of
// docs/design/set-base/sb-32/guida-stile.md «Provenienza»). The tiles of a set, in alphabetical order of bindingName, then one neutral placeholder, fill atlases
// of 8x8 cells of 256 px named <set>-0.webp, <set>-1.webp, ... as many as needed; a set never touches the atlases of another one.
// A class of the annex without a source gets the placeholder and is listed in the output; it does not stop the build.
// sharp is the C0 revision's pinned dependency (compression and resizing only).
import {createRequire} from 'node:module';
import {readFile,writeFile,unlink,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sharp=createRequire(import.meta.url)('../../client-c0/revision/node_modules/sharp');
// To add a set: one line here (its id, as in the annex `set` field, and its source folder with assets.json) and `npm run atlas`.
const SETS=[{id:'base',dir:'../docs/design/client-c2/o9-art/'}];
const COLS=8,ROWS=8,CELL=256,PAD=2,QUALITY=76,INK='#30231e',PER_ATLAS=COLS*ROWS;
const sha=b=>createHash('sha256').update(b).digest('hex');
const catalog=JSON.parse(await readFile('../docs/rules-catalog.json','utf8'));
const classes=[...catalog.cards,...catalog.characters,...catalog.tokens].map(c=>c.class);
const manifest=JSON.parse(await readFile('public/art/manifest.json','utf8'));
const atlases=[],report={};
for(const set of SETS){
 const inv=JSON.parse(await readFile(`${set.dir}assets.json`,'utf8'));
 const tiles=[...inv.tiles].sort((a,b)=>a.bindingName<b.bindingName?-1:a.bindingName>b.bindingName?1:0);
 const names=tiles.map(t=>t.bindingName);
 if(new Set(names).size!==names.length)throw new Error(`${set.id}: bindingName ripetuto in assets.json`);
 const placeholder=tiles.length,count=Math.ceil((tiles.length+1)/PER_ATLAS),comps=Array.from({length:count},()=>[]);
 const at=k=>({atlas:Math.floor(k/PER_ATLAS),cell:k%PER_ATLAS});
 const put=(k,input)=>{const {atlas,cell}=at(k);comps[atlas].push({input,left:(cell%COLS)*CELL,top:Math.floor(cell/COLS)*CELL});};
 for(const [k,t] of tiles.entries()){
  const raw=await readFile(`${set.dir}${t.source}`);
  if(sha(raw)!==t.sourceSha256)throw new Error(`${set.id}: ${t.source} non corrisponde all'impronta di assets.json`);
  // 252 px of picture plus 2 px of copied edge: linear sampling never reaches a neighbour.
  put(k,await sharp(raw).resize(CELL-2*PAD,CELL-2*PAD,{kernel:'lanczos3'}).extend({top:PAD,bottom:PAD,left:PAD,right:PAD,extendWith:'copy'}).png().toBuffer());
 }
 put(placeholder,await sharp({create:{width:CELL,height:CELL,channels:3,background:INK}}).png().toBuffer());
 const entries=[];
 for(let a=0;a<count;a++){
  const name=`${set.id}-${a}.webp`,sheet=await sharp({create:{width:COLS*CELL,height:ROWS*CELL,channels:3,background:INK}}).composite(comps[a]).png().toBuffer();
  await sharp(sheet).webp({quality:QUALITY,effort:6}).toFile(`public/art/${name}`);
  const bytes=await readFile(`public/art/${name}`),meta=await sharp(bytes).metadata();
  const own=Object.fromEntries(names.flatMap((n,k)=>at(k).atlas===a?[[n,at(k).cell]]:[]));
  entries.push({file:`art/${name}`,set:set.id,atlas:a,source:`${set.dir.replace(/^\.\.\//,'')} (PNG locali, fuori da git)`,quality:QUALITY,width:meta.width,height:meta.height,bytes:bytes.length,sha256:sha(bytes),
   cols:COLS,rows:ROWS,cell:CELL,pad:PAD,...(at(placeholder).atlas===a?{placeholder:at(placeholder).cell}:{}),tiles:own});
 }
 // Atlases of an earlier build that this one no longer needs.
 for(const f of await readdir('public/art'))if(f.startsWith(`${set.id}-`)&&f.endsWith('.webp')&&!entries.some(e=>e.file===`art/${f}`))await unlink(`public/art/${f}`);
 atlases.push(...entries);
 await writeFile(`${set.dir}assets.json`,JSON.stringify({date:new Date().toISOString().slice(0,10),scope:inv.scope,generation:inv.generation,
  atlases:entries.map(e=>({set:e.set,atlas:e.atlas,...Object.fromEntries(Object.entries(e).filter(([k])=>!['set','atlas','file','tiles','source'].includes(k))),file:`client-web/public/${e.file}`})),
  placeholder:{index:placeholder,...at(placeholder),fill:INK},
  tiles:tiles.map((t,k)=>{const {index,atlas,cell,...rest}=t;return {index:k,...at(k),...rest};})},null,2));
 // The annex belongs to one set: its classes without a source use the placeholder, the sources no class asks for stay (a card that left the set).
 const own=catalog.set===set.id,wanted=own?classes:null;
 report[set.id]={tiles:tiles.length,atlases:count,placeholder:at(placeholder),
  ...(own?{classesWithoutSource:classes.filter(c=>!names.includes(c)).length,withoutSource:classes.filter(c=>!names.includes(c)),sourcesNoClassAsks:names.filter(n=>!wanted.includes(n))}:{})};
}
manifest.tool='imagegen built-in; resize and WebP compression only by sharp';
manifest.files=[...manifest.files.filter(f=>f.file==='art/table.webp'),...atlases];
await writeFile('public/art/manifest.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({atlases:atlases.map(a=>({file:a.file,width:a.width,height:a.height,bytes:a.bytes})),sets:report},null,1));

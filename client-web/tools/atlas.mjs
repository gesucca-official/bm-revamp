// O9: builds public/art/atlas.webp (8x6 cells of 256 px) from the local, untracked
// sources in docs/design/client-c2/o9-art/ and writes manifest + inventory.
// sharp is the C0 revision's pinned dependency (compression and resizing only).
import {createRequire} from 'node:module';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sharp=createRequire(import.meta.url)('../../client-c0/revision/node_modules/sharp');
const SRC='../docs/design/client-c2/o9-art/',COLS=8,ROWS=6,CELL=256,PAD=2,QUALITY=76,INK='#30231e';
const sha=b=>createHash('sha256').update(b).digest('hex');
const prompts=JSON.parse(await readFile(`${SRC}prompts.json`,'utf8'));
const catalog=JSON.parse(await readFile('../docs/rules-catalog.json','utf8'));
const classes=[...catalog.cards,...catalog.characters,...catalog.tokens].map(c=>c.class).sort();
const sources=(await readdir(SRC)).filter(f=>f.endsWith('.png')).map(f=>f.slice(0,-4)).sort();
if(JSON.stringify(classes)!==JSON.stringify(sources))throw new Error(`Sorgenti diverse dall'allegato: ${classes.filter(c=>!sources.includes(c))} / ${sources.filter(c=>!classes.includes(c))}`);
if(sources.length+1>COLS*ROWS)throw new Error('Atlante troppo piccolo');
const comps=[],tiles={},inventory=[];
for(const [i,name] of sources.entries()){
 const raw=await readFile(`${SRC}${name}.png`),meta=prompts.images.find(x=>x.file===`${name}.png`);
 if(!meta||meta.sha256!==sha(raw))throw new Error(`prompts.json non corrisponde a ${name}.png`);
 // 252 px of picture plus 2 px of copied edge: linear sampling never reaches a neighbour.
 const input=await sharp(raw).resize(CELL-2*PAD,CELL-2*PAD,{kernel:'lanczos3'}).extend({top:PAD,bottom:PAD,left:PAD,right:PAD,extendWith:'copy'}).png().toBuffer();
 comps.push({input,left:(i%COLS)*CELL,top:Math.floor(i/COLS)*CELL});tiles[name]=i;
 inventory.push({index:i,bindingName:name,source:`${name}.png`,sourceSha256:meta.sha256,sourceWidth:meta.width,sourceHeight:meta.height,sourceBytes:meta.bytes,tool:meta.tool,model:meta.model,date:meta.date,promptSha256:sha(Buffer.from(meta.prompt,'utf8'))});
}
const placeholder=sources.length;
comps.push({input:await sharp({create:{width:CELL,height:CELL,channels:3,background:INK}}).png().toBuffer(),left:(placeholder%COLS)*CELL,top:Math.floor(placeholder/COLS)*CELL});
const sheet=await sharp({create:{width:COLS*CELL,height:ROWS*CELL,channels:3,background:INK}}).composite(comps).png().toBuffer();
await sharp(sheet).webp({quality:QUALITY,effort:6}).toFile('public/art/atlas.webp');
const bytes=await readFile('public/art/atlas.webp'),meta=await sharp(bytes).metadata();
const atlas={file:'art/atlas.webp',source:'docs/design/client-c2/o9-art/ (40 PNG locali, fuori da git)',quality:QUALITY,width:meta.width,height:meta.height,bytes:bytes.length,sha256:sha(bytes),
 cols:COLS,rows:ROWS,cell:CELL,pad:PAD,placeholder,tiles};
const manifest=JSON.parse(await readFile('public/art/manifest.json','utf8'));
manifest.tool='imagegen built-in; resize and WebP compression only by sharp';
manifest.files=[...manifest.files.filter(f=>f.file==='art/table.webp'),atlas];
await writeFile('public/art/manifest.json',JSON.stringify(manifest,null,2));
await writeFile(`${SRC}assets.json`,JSON.stringify({date:new Date().toISOString().slice(0,10),scope:prompts.scope,generation:prompts.generation_summary,
 atlas:{file:'client-web/public/art/atlas.webp',...Object.fromEntries(Object.entries(atlas).filter(([k])=>!['file','tiles','source'].includes(k)))},placeholder:{index:placeholder,fill:INK},tiles:inventory},null,2));
console.log({width:meta.width,height:meta.height,bytes:bytes.length,tiles:sources.length,placeholder});

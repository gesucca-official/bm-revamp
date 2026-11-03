import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {RASTER,imageSize} from './image-size.mjs';
const MB=1024*1024;
// Hard limits, owner decision (C2, O9): JS 500 KB gzip unchanged; total 4 MB gzip; atlas <= 2048x2048; decoded textures <= 64 MB. They do not move.
const LIMITS={js:500*1024,total:4*MB,atlasSide:2048,textureBytes:64*MB};
// Ceiling of C4 (D9, revised by the owner on 3 November 2026): decoded textures <= 32 MiB, a check separate from the hard limits, kept for the room the Set Base needs.
// The ceilings first confirmed for JS (400 KB) and total (2.2 MB) are gone: the client is served locally, the hard limits above already stop an accidental blow-up,
// and download size was never the real cost; what matters on a phone is texture memory.
const CEILINGS={textureBytes:32*MB};
// Decoded size of a raster image is read from its header (WebP, PNG, JPEG, GIF, AVIF), RGBA at 4 bytes per pixel.
const files=[],textures=[];
async function walk(dir){for(const d of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${d.name}`;if(d.isDirectory())await walk(p);else{const data=await readFile(p);if(RASTER.test(p)){const {w,h}=imageSize(data,p);textures.push({file:p.slice(5),width:w,height:h,decodedBytes:w*h*4});}files.push({file:p.slice(5),bytes:data.length,gzip:gzipSync(data,{level:9}).length,sha256:createHash('sha256').update(data).digest('hex')});}}}
await walk('dist');files.sort((a,b)=>a.file.localeCompare(b.file));const js=files.filter(f=>f.file.endsWith('.js')).reduce((s,f)=>s+f.gzip,0),total=files.reduce((s,f)=>s+f.gzip,0);
const textureBytes=textures.reduce((t,x)=>t+x.decodedBytes,0),atlases=textures.filter(t=>t.file!=='art/table.webp');
const limitsPass=js<=LIMITS.js&&total<=LIMITS.total&&atlases.every(t=>t.width<=LIMITS.atlasSide&&t.height<=LIMITS.atlasSide)&&textureBytes<=LIMITS.textureBytes;
const used={js,total,textureBytes},ceilingStatus=Object.fromEntries(Object.entries(CEILINGS).map(([k,c])=>[k,{ceiling:c,used:used[k],margin:c-used[k],usedPercent:+(100*used[k]/c).toFixed(1),pass:used[k]<=c}]));
const ceilingsPass=Object.values(ceilingStatus).every(x=>x.pass);
const byType=Object.fromEntries(Object.entries(files.reduce((m,f)=>{const e=/\.([a-z0-9]+)$/i.exec(f.file)?.[1].toLowerCase()??'(none)';(m[e]??={files:0,bytes:0,gzip:0});m[e].files++;m[e].bytes+=f.bytes;m[e].gzip+=f.gzip;return m;},{})).sort(([a],[b])=>a.localeCompare(b)));
const report={date:new Date().toISOString(),method:'gzip level 9 per actual file; conservative total includes every production file, even optional chunks and asset manifest; review PNGs excluded because not shipped; textures: raster header size (WebP, PNG, JPEG, GIF, AVIF) x 4 bytes (RGBA), no mipmaps counted; an unreadable raster file fails the run',jsGzip:js,totalGzip:total,textureDecodedBytes:textureBytes,textures,byType,budgets:{js:LIMITS.js,total:LIMITS.total,atlasSide:LIMITS.atlasSide,textureBytes:LIMITS.textureBytes},ceilingsC4:{source:'D9 of the C4 plan, revised by the owner on 3 November 2026: only the decoded-texture ceiling (MiB); JS and total have the hard limits only',...ceilingStatus,pass:ceilingsPass},limitsPass,pass:limitsPass&&ceilingsPass,files};
const sizeDir=process.env.BM_OUT??'../docs/reports/client-c2';await mkdir(sizeDir,{recursive:true});await writeFile(`${sizeDir}/size.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({jsGzip:js,totalGzip:total,textureDecodedBytes:textureBytes,limitsPass,ceilingsC4:Object.fromEntries(Object.entries(ceilingStatus).map(([k,v])=>[k,`${v.usedPercent}% of ${v.ceiling}, margin ${v.margin}`])),ceilingsPass}));
// Two distinct checks: the hard limits first, then the C4 ceilings, each with its own message.
assert.ok(limitsPass,'Budget C2 (JS 500 KB, total 4 MB, atlas 2048, textures 64 MB) exceeded');
assert.ok(ceilingsPass,`Tetto C4 (D9 rivista: textures 32 MiB) exceeded: ${Object.entries(ceilingStatus).filter(([,v])=>!v.pass).map(([k,v])=>`${k} ${v.used} > ${v.ceiling}`).join(', ')}`);

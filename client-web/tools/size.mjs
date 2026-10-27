import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const MB=1024*1024;
// Owner decision (C2, O9): JS 500 KB gzip unchanged; total 4 MB gzip; atlas <= 2048x2048; decoded textures <= 64 MB.
const LIMITS={js:500*1024,total:4*MB,atlasSide:2048,textureBytes:64*MB};
// Decoded size of a WebP is read from its header (RIFF VP8/VP8L/VP8X), RGBA at 4 bytes per pixel.
function webpSize(b){const t=b.toString('ascii',12,16);if(t==='VP8X')return {w:1+b.readUIntLE(24,3),h:1+b.readUIntLE(27,3)};if(t==='VP8L'){const v=b.readUInt32LE(21);return {w:1+(v&0x3fff),h:1+((v>>14)&0x3fff)};}if(t==='VP8 ')return {w:b.readUInt16LE(26)&0x3fff,h:b.readUInt16LE(28)&0x3fff};throw new Error('WebP non riconosciuto');}
const files=[],textures=[];
async function walk(dir){for(const d of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${d.name}`;if(d.isDirectory())await walk(p);else{const data=await readFile(p);if(p.endsWith('.webp')){const {w,h}=webpSize(data);textures.push({file:p.slice(5),width:w,height:h,decodedBytes:w*h*4});}files.push({file:p.slice(5),bytes:data.length,gzip:gzipSync(data,{level:9}).length,sha256:createHash('sha256').update(data).digest('hex')});}}}
await walk('dist');files.sort((a,b)=>a.file.localeCompare(b.file));const js=files.filter(f=>f.file.endsWith('.js')).reduce((s,f)=>s+f.gzip,0),total=files.reduce((s,f)=>s+f.gzip,0);
const textureBytes=textures.reduce((t,x)=>t+x.decodedBytes,0),atlases=textures.filter(t=>t.file!=='art/table.webp');
const pass=js<=LIMITS.js&&total<=LIMITS.total&&atlases.every(t=>t.width<=LIMITS.atlasSide&&t.height<=LIMITS.atlasSide)&&textureBytes<=LIMITS.textureBytes;
const report={date:new Date().toISOString(),method:'gzip level 9 per actual file; conservative total includes every production file, even optional chunks and asset manifest; review PNGs excluded because not shipped; textures: WebP header size x 4 bytes (RGBA), no mipmaps counted',jsGzip:js,totalGzip:total,textureDecodedBytes:textureBytes,textures,budgets:{js:LIMITS.js,total:LIMITS.total,atlasSide:LIMITS.atlasSide,textureBytes:LIMITS.textureBytes},pass,files};
await mkdir('../docs/reports/client-c2',{recursive:true});await writeFile('../docs/reports/client-c2/size.json',JSON.stringify(report,null,2));console.log(JSON.stringify({jsGzip:js,totalGzip:total,textureDecodedBytes:textureBytes,pass:report.pass}));assert.ok(report.pass,'Budget C2 (JS 500 KB, total 4 MB, atlas 2048, textures 64 MB) exceeded');

import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const files=[];
async function walk(dir){for(const d of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${d.name}`;if(d.isDirectory())await walk(p);else{const data=await readFile(p);files.push({file:p.slice(5),bytes:data.length,gzip:gzipSync(data,{level:9}).length,sha256:createHash('sha256').update(data).digest('hex')});}}}
await walk('dist');files.sort((a,b)=>a.file.localeCompare(b.file));const js=files.filter(f=>f.file.endsWith('.js')).reduce((s,f)=>s+f.gzip,0),total=files.reduce((s,f)=>s+f.gzip,0);
const report={date:new Date().toISOString(),method:'gzip level 9 per actual file; conservative total includes every production file, even optional chunks and asset manifest; review PNGs excluded because not shipped',jsGzip:js,totalGzip:total,budgets:{js:500*1024,total:1024*1024},pass:js<=500*1024&&total<=1024*1024,files};
await mkdir('../docs/reports/client-c1',{recursive:true});await writeFile('../docs/reports/client-c1/size.json',JSON.stringify(report,null,2));console.log(JSON.stringify({jsGzip:js,totalGzip:total,pass:report.pass}));assert.ok(report.pass,'Budget C0 (unchanged) exceeded in C1');

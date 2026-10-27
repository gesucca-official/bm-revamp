import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const files = [];
for (const name of await readdir('dist/c0/browser')) {
  if (!/\.(js|css|html|svg|woff2)$/.test(name)) continue;
  const data = await readFile('dist/c0/browser/' + name);
  files.push({name, bytes:data.length, gzipBytes:gzipSync(data,{level:9}).length});
}
const jsGzip = files.filter(f => f.name.endsWith('.js')).reduce((n,f) => n+f.gzipBytes,0);
const totalGzip = files.reduce((n,f) => n+f.gzipBytes,0);
const result = {date:new Date().toISOString(),mode:'production',gzipLevel:9,files,jsGzip,totalGzip,deferredBytes:0,jsBudgetBytes:512000,totalBudgetBytes:1048576,pass:jsGzip<=512000&&totalGzip<=1048576,note:'Solo scena sintetica C0, non previsione della parità C2. Nessun font o asset esterno.'};
await mkdir('../docs/reports/client-c0',{recursive:true});
await writeFile('../docs/reports/client-c0/build-size.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if (!result.pass) process.exitCode=1;

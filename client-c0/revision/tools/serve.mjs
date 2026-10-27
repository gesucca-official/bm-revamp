import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
export const server=http.createServer(async(req,res)=>{try{const request=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(request==='/'?'/index.html':request));if(!file.startsWith(root)){res.writeHead(403).end();return;}const bytes=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(bytes);}catch{res.writeHead(404).end();}});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(4310,'127.0.0.1',()=>console.log('C0 bar table: http://127.0.0.1:4310'));

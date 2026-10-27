// Physical-device capture: serves the unchanged production build on loopback,
// injects tools/physical-probe.js only into the served page and stores what the
// phone posts. Default: loopback, reached through browser USB port forwarding.
// C0_PHYSICAL_HOST=lan (or an IP) binds one private LAN address for devices
// without forwarding (iPhone); every request then needs a one-time access code.
// C0_PHYSICAL_PROBE=0 serves the same build without probe for the human review.
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash,randomBytes} from 'node:crypto';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {server} from './serve.mjs';
const outDir=process.env.C0_PHYSICAL_OUT||fileURLToPath(new URL('../../../docs/reports/client-c0-r2/physical/',import.meta.url));
const port=Number(process.env.C0_PHYSICAL_PORT||4310),budget=33;
const privateIp=a=>/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a);
const wanted=process.env.C0_PHYSICAL_HOST||'127.0.0.1';
const host=wanted==='lan'?Object.values(os.networkInterfaces()).flat().find(a=>a.family==='IPv4'&&!a.internal&&privateIp(a.address))?.address:wanted;
if(!host||!(host==='127.0.0.1'||privateIp(host)))throw new Error(`Indirizzo non ammesso per la cattura: ${wanted}`);
const lan=host!=='127.0.0.1',code=lan?randomBytes(4).toString('hex'):null,probe=process.env.C0_PHYSICAL_PROBE!=='0',clients=new Set();
const [serveStatic]=server.listeners('request');server.removeAllListeners('request');
const percentile=(values,p)=>{const s=[...values].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.floor(s.length*p))]||0;};
const buildFiles=[];
async function fingerprint(dir,prefix=''){for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())await fingerprint(path,`${prefix}${entry.name}/`);else buildFiles.push({file:prefix+entry.name,sha256:createHash('sha256').update(await readFile(path)).digest('hex')});}}
await fingerprint(fileURLToPath(new URL('../dist',import.meta.url)));buildFiles.sort((a,b)=>a.file.localeCompare(b.file));
const measured=JSON.parse(await readFile(new URL('../../../docs/reports/client-c0-r2/performance.json',import.meta.url),'utf8')).buildFiles;
const sameBuild=JSON.stringify(measured)===JSON.stringify(buildFiles);
function summarize(raw){
 const frames=raw.frames,inputs=raw.inputMs,within=frames.filter(n=>n<=budget).length/frames.length;
 const hidden=raw.log.visibility.filter(v=>v.state==='hidden').length;
 return {durationMs:raw.durationMs,frames:frames.length,frameMedian:percentile(frames,.5),frameP95:percentile(frames,.95),frameMax:Math.max(...frames),withinFrameBudget:within,framesOver100ms:frames.filter(n=>n>100).length,inputSamples:inputs.length,inputP95:percentile(inputs,.95),inputMax:inputs.length?Math.max(...inputs):null,
  framePass:within>=.95,inputPass:inputs.length>0&&Math.max(...inputs)<=100,durationPass:raw.durationMs>=60000,touchDowns:raw.log.pointerDowns.touch||0,otherPointerDowns:Object.entries(raw.log.pointerDowns).filter(([k])=>k!=='touch'),touchMoves:raw.log.pointerMovesTouch,sequences:raw.sequences,backgroundEpisodes:hidden,resizes:raw.log.resizes.length,errors:raw.log.errors};
}
server.on('request',async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(lan){
  const remote=req.socket.remoteAddress;
  if(url.searchParams.get('k')===code){res.writeHead(303,{'Set-Cookie':`c0k=${code}; HttpOnly; SameSite=Strict; Path=/`,Location:'/'}).end();return;}
  if(!(req.headers.cookie||'').split(/;\s*/).includes(`c0k=${code}`)){res.writeHead(403).end();return;}
  if(!clients.has(remote)){clients.add(remote);console.log(`Dispositivo ammesso: ${remote}`);}
 }
 try{
  if(req.method==='GET'&&(url.pathname==='/'||url.pathname==='/index.html')){const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');res.setHeader('Content-Type','text/html');res.setHeader('Cache-Control','no-store');res.end(!probe?html:html.replace('</body>','<script src="/__c0/physical-probe.js"></script></body>'));return;}
  if(req.method==='GET'&&url.pathname==='/__c0/physical-probe.js'){res.setHeader('Content-Type','text/javascript');res.setHeader('Cache-Control','no-store');res.end(await readFile(new URL('./physical-probe.js',import.meta.url)));return;}
  if(req.method==='POST'&&url.pathname==='/__c0/physical'){
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>5e6){res.writeHead(413).end();return;}chunks.push(chunk);}
   const raw=JSON.parse(Buffer.concat(chunks).toString('utf8')),summary=summarize(raw),date=new Date().toISOString();
   const file=`capture-${date.replace(/[:.]/g,'-')}.json`;await mkdir(outDir,{recursive:true});
   await writeFile(path.join(outDir,file),JSON.stringify({date,kind:'physical-touch-candidate',operatorAttestation:null,sameBuildAsDesktopMeasure:sameBuild,transport:lan?{mode:'lan-access-code',server:host,client:req.socket.remoteAddress}:{mode:'loopback-usb-forwarding'},buildFiles,thresholds:{frameBudgetMs:budget,frameShare:.95,inputMaxMs:100,minDurationMs:60000},method:'Production build served unchanged; probe injected by tools/physical.mjs only. Human touch on the device; scene ticker frame intervals and input-to-next-frame feedback, not hardware latency. Badge text updated once per second.',summary,raw},null,1));
   console.log(JSON.stringify({file,summary,device:raw.device},null,1));
   res.end(`${summary.framePass&&summary.inputPass&&summary.durationPass?'soglie OK':'soglie da rivedere'} · ${file}`);return;
  }
  serveStatic(req,res);
 }catch(e){console.error(e);res.writeHead(500).end();}
});
server.listen(port,host,()=>console.log(`C0 ${probe?'cattura fisica':'revisione senza sonda'}: http://${host}:${port}${lan?`/?k=${code}`:''} · stessa build misurata: ${sameBuild?'sì':'NO'} · output ${outDir}`));

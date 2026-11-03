import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readdirSync,readFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// C4-3, rule 10 of the C4 plan: no asset without provenance and licence. Every file distributed from public/ is in the inventory of
// docs/design/client-c4/assets/ with the same SHA-256; no font is distributed and the only families named are Impact and Arial.
const root=fileURLToPath(new URL('..',import.meta.url));
const read=(p:string)=>readFileSync(`${root}${p}`,'utf8');
const inventory=JSON.parse(readFileSync(`${root}../docs/design/client-c4/assets/inventory.json`,'utf8')) as {thirdParty:boolean;files:Record<string,unknown>[];fonts:{distributed:string[]}};
const sha=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
const walk=(dir:string,base=dir):string[]=>readdirSync(dir).flatMap(n=>{const p=`${dir}/${n}`;return statSync(p).isDirectory()?walk(p,base):[p.slice(base.length+1)];});

const FIELDS=['file','kind','author','url','version','license','modifications','destination','sha256'];
/** What is wrong between the inventory and the files found (path relative to public/ -> SHA-256). Pure, so the test can prove it fails. */
function inventoryProblems(entries:Record<string,unknown>[],found:Record<string,string>):string[]{
 const out:string[]=[],listed=new Set<string>();
 for(const e of entries){
  for(const f of FIELDS)if(typeof e[f]!=='string'||!(e[f] as string).trim())out.push(`${e.file??'?'}: missing field «${f}»`);
  const file=String(e.file);if(listed.has(file))out.push(`${file}: listed twice`);listed.add(file);
  if(!(file in found))out.push(`${file}: in the inventory but not in public/`);
  else if(found[file]!==e.sha256)out.push(`${file}: SHA-256 ${found[file]} differs from the inventory ${e.sha256}`);
 }
 for(const f of Object.keys(found))if(!listed.has(f))out.push(`${f}: distributed but not in the inventory`);
 return out;
}

test('C4 rule 10: every file of public/ is in the inventory with the same SHA-256, and no entry is without a file',()=>{
 const dir=`${root}public`,found=Object.fromEntries(walk(dir).map(f=>[f,sha(`${dir}/${f}`)]));
 assert.ok(Object.keys(found).length>0,'public/ is empty: the test would pass on nothing');
 assert.deepEqual(inventoryProblems(inventory.files,found),[]);
});

test('C4 rule 10: a file not in the inventory, a different SHA-256, a missing field and an orphan entry are each reported',()=>{
 const entry={file:'art/a.webp',kind:'image',author:'x',url:'none',version:'d',license:'l',modifications:'m',destination:'d',sha256:'aa'};
 assert.deepEqual(inventoryProblems([entry],{'art/a.webp':'aa'}),[]);
 assert.match(inventoryProblems([entry],{'art/a.webp':'aa','art/b.webp':'bb'}).join(),/art\/b\.webp: distributed but not in the inventory/);
 assert.match(inventoryProblems([entry],{'art/a.webp':'cc'}).join(),/differs from the inventory/);
 assert.match(inventoryProblems([{...entry,license:''}],{'art/a.webp':'aa'}).join(),/missing field «license»/);
 assert.match(inventoryProblems([entry],{}).join(),/not in public/);
});

test('C4 rule 10: the built files that are not code (dist/, when built) are the registered ones',()=>{
 const dir=`${root}dist`;if(!existsSync(dir))return;
 const files=walk(dir).filter(f=>f!=='index.html'&&!/^assets\/[^/]+\.(js|css)$/.test(f));
 assert.deepEqual(inventoryProblems(inventory.files,Object.fromEntries(files.map(f=>[f,sha(`${dir}/${f}`)]))),[]);
});

test('C4-3 (D4): no font is distributed, no @font-face, no remote origin in the styles or the page',()=>{
 assert.deepEqual(inventory.fonts.distributed,[]);
 const tree=[...walk(`${root}public`).map(f=>`public/${f}`),...walk(`${root}src`).map(f=>`src/${f}`)];
 assert.deepEqual(tree.filter(f=>/\.(ttf|otf|woff2?|eot)$/i.test(f)),[],'font files');
 for(const f of ['src/style.css','index.html']){const text=read(f);
  assert.doesNotMatch(text,/@font-face|@import/,`${f}: font-face or import`);
  assert.doesNotMatch(text,/(?:src|href|url\()\s*=?\s*["']?https?:\/\//i,`${f}: a remote origin`);}
});

test('C4-3 (D4): the families named are Impact and Arial (Arial Narrow as the fallback of Impact), with the generic sans-serif',()=>{
 const allowed=new Set(['impact','arial','arial narrow','sans-serif']),found=new Set<string>();
 const add=(list:string)=>{for(const n of list.split(','))found.add(n.trim().replace(/^['"]|['"]$/g,'').toLowerCase());};
 const css=read('src/style.css');
 for(const m of css.matchAll(/font-family:\s*([^;}]+)/g))add(m[1]);
 for(const m of css.matchAll(/(?<![\w-])font:\s*([^;}]+)/g)){const sized=/\d(?:px|em|rem)(?:\/[\d.]+)?\s+(.+)$/.exec(m[1].trim());if(sized)add(sized[1]);}
 for(const f of readdirSync(`${root}src`).filter(f=>/\.tsx?$/.test(f)))for(const m of read(`src/${f}`).matchAll(/fontFamily:\s*['"]([^'"]+)['"]/g))add(m[1]);
 assert.ok(found.has('impact')&&found.has('arial'),`found ${[...found]}`);
 assert.deepEqual([...found].filter(n=>!allowed.has(n)),[]);
});

test('C4-3: an entry under a licence other than the project\'s own needs thirdParty true (and the credits page of the home); today none does',()=>{
 const foreign=inventory.files.filter(e=>!/^Diritti riservati del progetto/.test(String(e.license)));
 assert.equal(inventory.thirdParty,foreign.length>0,`thirdParty ${inventory.thirdParty}, entries under another licence: ${foreign.map(e=>e.file)}`);
});

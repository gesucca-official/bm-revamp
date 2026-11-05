import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),postcss=require('postcss');
const src=fileURLToPath(new URL('../src/',import.meta.url));
// Existing shared vector/Pixi colour definitions. No blanket TSX exception.
const colourExceptions=new Map([
 ['scene.ts','Pixi drawing, outside CSS; no geometry changes'],
 ['readability.ts','shared resource, role and damage constants'],
 ['symbols.ts','shared symbol light and generated SVG tones'],
 ['frames.ts','shared HTML/Pixi frame constants']
]);
const rawColour=/#(?:[a-f0-9]{8}|[a-f0-9]{6}|[a-f0-9]{4}|[a-f0-9]{3})\b|\b(?:rgb|hsl)a?\(/i;
const allowedFonts=new Set(['impact','arial','sans-serif']);
function fontProblems(list:string){return list.split(',').map(s=>s.trim().replace(/^['"]|['"]$/g,'').toLowerCase()).filter(s=>!allowedFonts.has(s));}
function cssProblems(css:string){const out:string[]=[],root=postcss.parse(css),tokens=new Set<string>();
 root.walkDecls((d:any)=>{if(d.prop.startsWith('--')&&d.parent.type==='rule'&&d.parent.selector===':root')tokens.add(d.prop);});
 root.walkDecls((d:any)=>{const token=d.prop.startsWith('--')&&d.parent.type==='rule'&&d.parent.selector===':root';
  if(rawColour.test(d.value)&&!token)out.push(`colour outside :root: ${d.prop}`);
  for(const m of d.value.matchAll(/var\((--[\w-]+)/g))if(!tokens.has(m[1])&&!['--focus'].includes(m[1]))out.push(`undefined token ${m[1]}`);
  const family=d.prop==='font-family'?d.value:d.prop==='font'?/\d(?:px|em|rem)(?:\/[\d.]+)?\s+(.+)$/.exec(d.value)?.[1]:null;
  if(family)for(const f of fontProblems(family))out.push(`font ${f}`);
 });return out;}
function tsProblems(file:string,source:string){const out:string[]=[],tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 const visit=(node:ts.Node)=>{
  if((ts.isStringLiteralLike(node)&&rawColour.test(node.text)||ts.isNumericLiteral(node)&&/^0x[\da-f]{6,8}$/i.test(node.getText(tree)))&&!colourExceptions.has(file))out.push(`colour in ${file}`);
  if(ts.isPropertyAssignment(node)&&node.name.getText(tree)==='fontFamily'&&ts.isStringLiteralLike(node.initializer))for(const f of fontProblems(node.initializer.text))out.push(`font ${f}`);
  ts.forEachChild(node,visit);
 };visit(tree);return out;}
const walk=(dir:string,prefix=''):string[]=>readdirSync(dir).flatMap(n=>statSync(dir+n).isDirectory()?walk(dir+n+'/',prefix+n+'/'):[prefix+n]);
test('C4-5b: all CSS colours are root tokens, all tokens resolve, only Impact/Arial families',()=>assert.deepEqual(cssProblems(readFileSync(src+'style.css','utf8')),[]));
test('C4-5b: TS/TSX contain no private palette or extra font; shared drawing exceptions explicit',()=>{
 for(const file of walk(src).filter(f=>/\.tsx?$/.test(f)))assert.deepEqual(tsProblems(file,readFileSync(src+file,'utf8')),[],file);
 assert.deepEqual([...colourExceptions.keys()],['scene.ts','readability.ts','symbols.ts','frames.ts']);
});
test('C4-5b: source guard rejects raw colour inside media, unknown tokens, new TSX palette and extra fonts',()=>{
 assert.ok(cssProblems('@media(max-height:550px){button{color:#123456}}').length);
 assert.ok(cssProblems('button{color:var(--typo)}').length);
 assert.ok(cssProblems(':root{font-family:Verdana,Arial}').length);
 assert.ok(tsProblems('ui.tsx','const el=<div style={{color:"rgb(1,2,3)"}}/>;').length);
 assert.ok(tsProblems('new.ts','const c=0x123456;').length);
 assert.ok(tsProblems('scene.ts',"const s={fontFamily:'Georgia,Arial'};").length);
 assert.deepEqual(tsProblems('ui.tsx',"const c='currentColor';"),[]);
});

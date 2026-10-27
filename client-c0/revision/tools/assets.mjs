import sharp from 'sharp';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await mkdir('public/art',{recursive:true});
const files=[];
for(const [name,quality] of [['table',74],['atlas',80]]){
 const input=`../../docs/design/client-c0/r2-assets/${name}.png`, output=`public/art/${name}.webp`;
 await sharp(input).webp({quality,effort:6}).toFile(output);
 const bytes=await readFile(output), meta=await sharp(output).metadata();
 files.push({file:`art/${name}.webp`,source:input,quality,width:meta.width,height:meta.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await writeFile('public/art/manifest.json',JSON.stringify({tool:'imagegen built-in; loss compression only by sharp',approvedReference:'docs/design/client-c0/r1/duel.png',files},null,2));
console.log(files);

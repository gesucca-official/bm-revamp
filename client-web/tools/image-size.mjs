// Pixel size of a raster image from its header (no decoding), for the texture budget of size.mjs. C4-3: every raster format a block may bring
// (WebP, PNG, JPEG, GIF, AVIF), not only WebP; a raster file whose header is not understood is an error, never silently left out of the count.
// bmp, ico, tiff, jxl and heic are not read: they fail loudly instead of staying out of the count.
export const RASTER=/\.(webp|png|jpe?g|gif|avif|bmp|ico|tiff?|jxl|heic)$/i;

function webp(b){
 const t=b.toString('ascii',12,16);
 if(t==='VP8X')return {w:1+b.readUIntLE(24,3),h:1+b.readUIntLE(27,3)};
 if(t==='VP8L'){const v=b.readUInt32LE(21);return {w:1+(v&0x3fff),h:1+((v>>14)&0x3fff)};}
 if(t==='VP8 ')return {w:b.readUInt16LE(26)&0x3fff,h:b.readUInt16LE(28)&0x3fff};
 throw new Error('WebP non riconosciuto');
}
function png(b){
 if(b.toString('latin1',1,4)!=='PNG'||b.toString('ascii',12,16)!=='IHDR')throw new Error('PNG non riconosciuto');
 return {w:b.readUInt32BE(16),h:b.readUInt32BE(20)};
}
function jpeg(b){
 let i=2;
 while(i+9<b.length){
  if(b[i]!==0xff){i++;continue;}
  const m=b[i+1];
  if(m===0xd8||m===0x01||(m>=0xd0&&m<=0xd7)||m===0xff){i+=m===0xff?1:2;continue;}
  const len=b.readUInt16BE(i+2);
  // SOF0-SOF15 except DHT (c4), JPG (c8) and DAC (cc): the frame header holds height then width.
  if(m>=0xc0&&m<=0xcf&&m!==0xc4&&m!==0xc8&&m!==0xcc)return {h:b.readUInt16BE(i+5),w:b.readUInt16BE(i+7)};
  i+=2+len;
 }
 throw new Error('JPEG non riconosciuto');
}
function gif(b){
 if(!/^GIF8[79]a$/.test(b.toString('latin1',0,6)))throw new Error('GIF non riconosciuto');
 return {w:b.readUInt16LE(6),h:b.readUInt16LE(8)};
}
// AVIF (ISO BMFF): the `ispe` property of the primary item holds the width and height (the first one found).
function avif(b){
 const at=b.indexOf('ispe','latin1');
 if(at<4||b.toString('latin1',4,8)!=='ftyp')throw new Error('AVIF non riconosciuto');
 return {w:b.readUInt32BE(at+8),h:b.readUInt32BE(at+12)};
}
/** `{w, h}` of the image in `b` (a Buffer) named `file`, or throws for a raster format it does not read. */
export function imageSize(b,file){
 const ext=/\.([a-z0-9]+)$/i.exec(file)?.[1].toLowerCase();
 const size=ext==='webp'?webp(b):ext==='png'?png(b):ext==='jpg'||ext==='jpeg'?jpeg(b):ext==='gif'?gif(b):ext==='avif'?avif(b):null;
 if(!size)throw new Error(`Formato raster non letto: ${file}`);
 if(!(size.w>0&&size.h>0))throw new Error(`Dimensioni non valide: ${file}`);
 return size;
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RASTER,imageSize} from '../tools/image-size.mjs';

// C4-3: size.mjs reads the pixel size of every raster format a block may bring, not only WebP.
const art=(f:string)=>readFileSync(new URL(`../public/art/${f}`,import.meta.url));

test('WebP: the two distributed images give the sizes of the manifest',()=>{
 assert.deepEqual(imageSize(art('atlas.webp'),'atlas.webp'),{w:2048,h:1536});
 assert.deepEqual(imageSize(art('table.webp'),'table.webp'),{w:1672,h:941});
});

test('PNG, JPEG, GIF and AVIF headers give width and height',()=>{
 const png=Buffer.alloc(33);png.write('\x89PNG\r\n\x1a\n',0,'latin1');png.writeUInt32BE(13,8);png.write('IHDR',12,'ascii');png.writeUInt32BE(640,16);png.writeUInt32BE(480,20);
 assert.deepEqual(imageSize(png,'a.png'),{w:640,h:480});
 // SOI, an APP0 segment to skip, then SOF0 (height 300, width 200).
 const jpg=Buffer.concat([Buffer.from([0xff,0xd8,0xff,0xe0,0,6,1,2,3,4]),Buffer.from([0xff,0xc0,0,11,8,1,0x2c,0,0xc8,1,1,0x11,0])]);
 assert.deepEqual(imageSize(jpg,'a.jpg'),{w:200,h:300});assert.deepEqual(imageSize(jpg,'a.JPEG'),{w:200,h:300});
 const gif=Buffer.alloc(13);gif.write('GIF89a',0,'latin1');gif.writeUInt16LE(32,6);gif.writeUInt16LE(16,8);
 assert.deepEqual(imageSize(gif,'a.gif'),{w:32,h:16});
 const avif=Buffer.alloc(40);avif.writeUInt32BE(24,0);avif.write('ftypavif',4,'latin1');avif.write('ispe',24,'latin1');avif.writeUInt32BE(1024,32);avif.writeUInt32BE(512,36);
 assert.deepEqual(imageSize(avif,'a.avif'),{w:1024,h:512});
});

test('a raster file that cannot be read fails: it is never left out of the texture count',()=>{
 assert.throws(()=>imageSize(Buffer.alloc(40),'a.png'),/PNG non riconosciuto/);
 assert.throws(()=>imageSize(Buffer.alloc(40),'a.webp'),/WebP non riconosciuto/);
 assert.throws(()=>imageSize(Buffer.alloc(40),'a.bmp'),/Formato raster non letto/);
 assert.ok(RASTER.test('x/y.WEBP')&&RASTER.test('x/y.avif')&&!RASTER.test('x/y.js')&&!RASTER.test('x/y.json'));
});

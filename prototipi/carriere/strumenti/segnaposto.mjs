// Mockup della principale (14 novembre 2026): i ritratti segnaposto dei personaggi che non hanno ancora un ritratto di scena (Celestina,
// Beppe, Sergio, Duccio, Grappino). Non sono immagini generate: un cartoncino con il ritaglio del primo piano dagli identikit approvati
// (docs/design/set-base/identikit/riferimenti/; per Grappino lo sprite del tutorial) e il nome scritto sotto, come i cartoncini della
// bacheca. Si rifanno con: node strumenti/segnaposto.mjs (dalla cartella del prototipo). Uscita in segnaposto/, nel prototipo.
import {chromium} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const repo = path.resolve(radice, '../..');
const out = path.join(radice, 'segnaposto');
fs.mkdirSync(out, {recursive: true});

// Per ogni personaggio: il file d'origine, il centro del volto nel primo piano (pixel dell'originale) e quanti pixel dell'originale vanno
// in un pixel del cartoncino (più grande = volto più piccolo).
const VOLTI = [
  {id: 'celestina', nome: 'Celestina', file: 'docs/design/set-base/identikit/riferimenti/celestina.png', cx: 720, cy: 330, k: 1.15},
  {id: 'beppe', nome: 'Beppe', file: 'docs/design/set-base/identikit/riferimenti/beppe.png', cx: 720, cy: 400, k: 1.25},
  {id: 'sergio', nome: 'Sergio', file: 'docs/design/set-base/identikit/riferimenti/sergio.png', cx: 660, cy: 390, k: 1.15},
  {id: 'duccio', nome: 'Duccio', file: 'docs/design/set-base/identikit/riferimenti/duccio.png', cx: 760, cy: 470, k: 1.25},
  {id: 'grappino', nome: 'Grappino', file: 'docs/design/carriere/asset/tutorial/sprite/grappino-seduto.webp', cx: null, cy: null, k: null},
];

const browser = await chromium.launch({channel: 'msedge'});
const page = await browser.newPage();
for (const v of VOLTI) {
  const dati = fs.readFileSync(path.join(repo, v.file)).toString('base64');
  const tipo = v.file.endsWith('.png') ? 'image/png' : 'image/webp';
  const webp = await page.evaluate(async ([v, dati, tipo]) => {
    const img = new Image(); img.src = `data:${tipo};base64,${dati}`; await img.decode();
    // La tela dei ritratti, a metà misura (512×768, 2:3): il cartoncino occupa quasi tutto, con gli occhi a circa un quarto dell'altezza.
    const W = 512, H = 768, c = new OffscreenCanvas(W, H), g = c.getContext('2d');
    const x0 = 56, y0 = 30, w = 400, h = 650, banda = 74;
    g.save(); g.translate(x0 + w / 2, y0 + h / 2); g.rotate(-0.012); g.translate(-(x0 + w / 2), -(y0 + h / 2));
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x0 + 6, y0 + 9, w, h);
    g.fillStyle = '#efe4cc'; g.fillRect(x0, y0, w, h);
    g.save(); g.beginPath(); g.rect(x0 + 14, y0 + 14, w - 28, h - 28 - banda); g.clip();
    if (v.cx === null) {
      // Grappino: lo sprite intero, centrato in basso.
      const s = Math.min((w - 28) / img.width, (h - 28 - banda) / img.height) * 0.9;
      g.drawImage(img, x0 + w / 2 - (img.width * s) / 2, y0 + h - banda - 20 - img.height * s, img.width * s, img.height * s);
    } else {
      const k = v.k * 2;  // la tela è a metà misura
      g.drawImage(img, v.cx - (w / 2) * k, v.cy - 160 * k, w * k, h * k, x0, y0, w, h);
    }
    g.restore();
    g.strokeStyle = '#3a2a1c'; g.lineWidth = 3; g.strokeRect(x0 + 14, y0 + 14, w - 28, h - 28 - banda);
    g.fillStyle = '#2a1d14'; g.font = '700 40px "Russo One", system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText(v.nome.toUpperCase(), x0 + w / 2, y0 + h - banda / 2 + 2);
    g.fillStyle = '#7a6a55'; g.font = '16px system-ui, sans-serif';
    g.fillText('segnaposto · dall’identikit', x0 + w / 2, y0 + h - 16);
    g.restore();
    const b = await c.convertToBlob({type: 'image/webp', quality: 0.82});
    const a = new Uint8Array(await b.arrayBuffer());
    let s = ''; for (const x of a) s += String.fromCharCode(x);
    return btoa(s);
  }, [v, dati, tipo]);
  fs.writeFileSync(path.join(out, `${v.id}.webp`), Buffer.from(webp, 'base64'));
  console.log(`${v.id}.webp`);
}
await browser.close();

// Prova delle bocche (CA-0a, Fasi F e G), con il server di sviluppo acceso (run.ps1 -Task Dev; porta in BM_PORT, 4330 se manca).
// Per ogni ritratto con la sua versione «-bocca» fa girare la stessa catena del lettore (differenza dentro la sagoma, zona della bocca,
// versione usata con la trasparenza del ritratto approvato) e controlla che la versione usata cambi solo dentro la zona della bocca e abbia
// esattamente la trasparenza del ritratto approvato. Se un ritratto non ha la versione «-bocca», ne fa una finta (bocca scurita e una macchia
// sugli occhi, come la Fase F). Salva un foglio: originale, versione consegnata (su fondo magenta, per vedere il fondo sporco), usata, zona.
// Uso: node strumenti/prova-bocca.mjs <uscita.jpg> [ritratti, per esempio piera-offesa,mara-contenta; tutti se manca]
import {chromium} from '@playwright/test';
import fs from 'node:fs';

const [out, quali] = process.argv.slice(2);
const porta = Number(process.env.BM_PORT ?? 4330);
const R = 'C:/_simone/claude/bm-revamp-on-laptop/docs/design/carriere/asset/tutorial/ritratti/';
const tutti = fs.readdirSync(R).filter(f => f.endsWith('.webp') && !f.endsWith('-bocca.webp') && !f.includes('esasperat')).map(f => f.replace('.webp', ''));
const ritratti = quali ? quali.split(',') : tutti;
const browser = await chromium.launch({channel: 'msedge'});
const scadenza = setTimeout(() => { console.error('prova-bocca: tempo scaduto'); process.exit(1); }, 180_000);
let rosso = false;
try {
  const page = await browser.newPage({viewport: {width: 1300, height: 560}});
  await page.goto(`http://127.0.0.1:${porta}/`);
  const esiti = await page.evaluate(async ([ritratti, R]) => {
    const {boccaAllineata, cambiatiFuoriBocca, zonaBocca} = await import('/src/animazione.ts');
    const {componiBocca, differenza} = await import('/src/ui/maglia.ts');
    const cast = (await import('/dati/cast.json')).default;
    const carica = src => { const i = new Image(); i.src = src; return i.decode().then(() => i); };
    const url = n => `/@fs/${R}${n}.webp`;
    const pixel = s => { const c = Object.assign(document.createElement('canvas'), {width: 1024, height: 1536}); const g = c.getContext('2d', {willReadFrequently: true}); g.drawImage(s, 0, 0, 1024, 1536); return g.getImageData(0, 0, 1024, 1536).data; };
    const fogli = [], righe = [];
    for (const nome of ritratti) {
      const chi = nome.split('-')[0], b = cast.personaggi[chi].bocca;
      const base = await carica(url(nome));
      let bocca = await carica(url(nome + '-bocca')).catch(() => null), finta = false;
      if (!bocca) {
        finta = true;
        const c = Object.assign(document.createElement('canvas'), {width: 1024, height: 1536}), g = c.getContext('2d');
        g.drawImage(base, 0, 0);
        g.fillStyle = '#3a0c0c'; g.beginPath(); g.ellipse(b.u * 1024, (b.v + 0.01) * 1536, b.ru * 1024 * 0.45, b.rv * 1536 * 0.4, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(0,120,255,.6)'; g.fillRect(b.u * 1024 - 120, (b.v - 0.12) * 1536, 240, 40);
        bocca = await carica(c.toDataURL('image/png'));
      }
      const diff = differenza(base, bocca), scarto = cambiatiFuoriBocca(diff, 128, 192, b);
      if (!boccaAllineata(diff, 128, 192, b)) { righe.push({nome, finta, zona: null, storta: true, scarto}); continue; }
      const zona = zonaBocca(diff, 128, 192, b);
      if (!zona) { righe.push({nome, finta, zona: null}); continue; }
      const usata = componiBocca(base, bocca, zona);
      // Controlli sui pixel: fuori dall'ellisse niente cambia; la trasparenza è identica a quella del ritratto approvato.
      const pb = pixel(base), pu = pixel(usata);
      let fuori = 0, alfa = 0;
      for (let y = 0; y < 1536; y += 2) for (let x = 0; x < 1024; x += 2) {
        const k = (y * 1024 + x) * 4, u = x / 1024, v = y / 1536;
        alfa = Math.max(alfa, Math.abs(pb[k + 3] - pu[k + 3]));
        const d = Math.max(Math.abs(pb[k] - pu[k]), Math.abs(pb[k + 1] - pu[k + 1]), Math.abs(pb[k + 2] - pu[k + 2]));
        if (d > 3 && ((u - zona.u) / zona.ru) ** 2 + ((v - zona.v) / zona.rv) ** 2 > 1.01) fuori++;
      }
      righe.push({nome, finta, zona, fuori, alfa, scarto});
      // Foglio: ritagli attorno alla bocca.
      const f = Object.assign(document.createElement('canvas'), {width: 1290, height: 330}), g = f.getContext('2d');
      g.fillStyle = '#16100c'; g.fillRect(0, 0, 1290, 330);
      const t = [Math.max(0, (b.u - 0.22) * 1024), Math.max(0, (b.v - 0.14) * 1536), 0.44 * 1024, 0.28 * 1536];
      const pannello = (img, i, fondo) => {
        g.fillStyle = fondo; g.fillRect(8 + i * 320, 24, 310, 300);
        g.drawImage(img, t[0], t[1], t[2], t[3], 8 + i * 320, 24, 310, 300 * 0 + 310 * t[3] / t[2] > 300 ? 300 : 310 * t[3] / t[2]);
      };
      pannello(base, 0, '#16100c'); pannello(bocca, 1, '#f0f'); pannello(usata, 2, '#16100c');
      const z = Object.assign(document.createElement('canvas'), {width: 1024, height: 1536}), zg = z.getContext('2d');
      zg.drawImage(usata, 0, 0); zg.strokeStyle = '#0f0'; zg.lineWidth = 4; zg.beginPath(); zg.ellipse(zona.u * 1024, zona.v * 1536, zona.ru * 1024, zona.rv * 1536, 0, 0, Math.PI * 2); zg.stroke();
      pannello(z, 3, '#16100c');
      g.fillStyle = '#eadbc4'; g.font = '14px sans-serif';
      ['originale: ' + nome, finta ? 'versione finta (manca la -bocca)' : 'versione consegnata, su magenta', 'usata dal lettore', 'zona della bocca'].forEach((s, i) => g.fillText(s, 12 + i * 320, 17));
      fogli.push(f.toDataURL('image/jpeg', 0.82));
    }
    // I fogli uno sotto l'altro.
    const tutti = Object.assign(document.createElement('canvas'), {width: 1290, height: 330 * fogli.length}), tg = tutti.getContext('2d');
    for (let i = 0; i < fogli.length; i++) tg.drawImage(await carica(fogli[i]), 0, i * 330);
    return {righe, foglio: tutti.toDataURL('image/jpeg', 0.8)};
  }, [ritratti, R]);
  fs.writeFileSync(out, Buffer.from(esiti.foglio.split(',')[1], 'base64'));
  for (const r of esiti.righe) {
    if (r.storta) { console.log(`${r.nome}: la versione «-bocca» non è allineata al ritratto (${(r.scarto * 100).toFixed(1)}% dei punti cambia fuori dalla bocca): il lettore non la usa`); continue; }
    if (!r.zona) { console.log(`${r.nome}: nessuna zona della bocca trovata${r.finta ? ' (versione finta)' : ''}`); rosso = true; continue; }
    const z = r.zona, buono = r.fuori === 0 && r.alfa <= 1;
    rosso ||= !buono;
    console.log(`${r.nome}${r.finta ? ' (finta)' : ''}: zona u ${z.u.toFixed(3)} v ${z.v.toFixed(3)} (${z.ru.toFixed(3)} × ${z.rv.toFixed(3)}); pixel cambiati fuori ${r.fuori}; scarto di trasparenza ${r.alfa}; cambia fuori dalla bocca il ${(r.scarto * 100).toFixed(1)}%${buono ? '' : '  <-- NO'}`);
  }
} finally {
  clearTimeout(scadenza);
  await browser.close();
}
process.exitCode = rosso ? 1 : 0;

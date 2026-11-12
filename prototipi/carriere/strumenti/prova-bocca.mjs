// Prova della bocca (CA-0a, Fase F) finché le versioni «-bocca» dei ritratti non ci sono: con il server di sviluppo acceso (run.ps1 -Task
// Dev), prende un ritratto vero, ne fa una seconda versione finta (bocca scurita come se fosse aperta, e in più gli occhi cambiati, come
// farebbe uno strumento che non tiene ferma l'immagine), e fa girare la stessa catena del lettore: differenza, zona della bocca, maschera.
// Controlla che la versione usata cambi solo attorno alla bocca e salva un foglio: originale, finta, usata, differenza.
// Uso: node strumenti/prova-bocca.mjs <uscita.jpg> [ritratto, per esempio spazienzio-serio]
import {chromium} from '@playwright/test';

const [out, nome = 'spazienzio-serio'] = process.argv.slice(2);
const chi = nome.split('-')[0];
const browser = await chromium.launch({channel: 'msedge'});
const scadenza = setTimeout(() => { console.error('prova-bocca: tempo scaduto'); process.exit(1); }, 60_000);
try {
  const page = await browser.newPage({viewport: {width: 1300, height: 560}});
  await page.goto('http://127.0.0.1:4330/');
  const esito = await page.evaluate(async ([nome, chi]) => {
    const {zonaBocca} = await import('/src/animazione.ts');
    const {componiBocca, differenza} = await import('/src/ui/maglia.ts');
    const cast = (await import('/dati/cast.json')).default;
    const carica = src => { const i = new Image(); i.src = src; return i.decode().then(() => i); };
    const base = await carica(`/@fs/C:/_simone/claude/bm-revamp-on-laptop/docs/design/carriere/asset/tutorial/ritratti/${nome}.webp`);
    const w = base.naturalWidth, h = base.naturalHeight, b = cast.personaggi[chi].bocca;
    // La versione finta: un'ellisse scura sulla bocca del cast e una macchia sugli occhi.
    const finta = Object.assign(document.createElement('canvas'), {width: w, height: h});
    const g = finta.getContext('2d');
    g.drawImage(base, 0, 0);
    g.fillStyle = '#3a0c0c';
    g.beginPath(); g.ellipse(b.u * w, (b.v + 0.01) * h, b.ru * w * 0.45, b.rv * h * 0.4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(0,120,255,.6)';
    g.fillRect(b.u * w - 120, (b.v - 0.12) * h, 240, 40);
    const fintaImg = await carica(finta.toDataURL('image/png'));
    const zona = zonaBocca(differenza(base, fintaImg), 128, 192, b);
    const usata = componiBocca(base, fintaImg, zona);
    // Dove la versione usata differisce dall'originale: deve stare tutto attorno alla bocca.
    const usataImg = await carica(usata.toDataURL('image/png'));
    const d = differenza(base, usataImg, 128, 192);
    let fuori = 0, dentro = 0;
    for (let y = 0; y < 192; y++) for (let x = 0; x < 128; x++) {
      if (d[y * 128 + x] < 40) continue;
      const u = (x + 0.5) / 128, v = (y + 0.5) / 192;
      if (((u - zona.u) / zona.ru) ** 2 + ((v - zona.v) / zona.rv) ** 2 <= 1.05) dentro++; else fuori++;
    }
    // Il foglio: originale, finta, usata, differenza (in rosso), ritagliati sulla testa.
    const foglio = Object.assign(document.createElement('canvas'), {width: 1280, height: 520});
    const f = foglio.getContext('2d');
    f.fillStyle = '#16100c'; f.fillRect(0, 0, 1280, 520);
    const taglio = [Math.max(0, (b.u - 0.25) * w), Math.max(0, (b.v - 0.25) * h), 0.5 * w, 0.5 * h * 1.0];
    const mappa = Object.assign(document.createElement('canvas'), {width: 128, height: 192});
    const mg = mappa.getContext('2d'), dati = mg.createImageData(128, 192);
    for (let k = 0; k < d.length; k++) { dati.data[k * 4] = d[k] >= 40 ? 255 : 30; dati.data[k * 4 + 3] = 255; }
    mg.putImageData(dati, 0, 0);
    [base, finta, usata, mappa].forEach((img, i) => {
      const s = img === mappa ? 128 / w : 1;
      f.drawImage(img, taglio[0] * s, taglio[1] * s, taglio[2] * s, taglio[3] * s, 8 + i * 318, 30, 310, 310 * taglio[3] / taglio[2]);
      f.fillStyle = '#eadbc4'; f.font = '15px sans-serif';
      f.fillText(['originale', 'finta: bocca e occhi cambiati', 'usata: solo la bocca', 'dove cambia la usata'][i], 12 + i * 318, 20);
    });
    return {zona, dentro, fuori, foglio: foglio.toDataURL('image/jpeg', 0.85)};
  }, [nome, chi]);
  const fs = await import('node:fs');
  fs.writeFileSync(out, Buffer.from(esito.foglio.split(',')[1], 'base64'));
  const z = esito.zona;
  console.log(`${nome}: zona della bocca u ${z.u.toFixed(3)} v ${z.v.toFixed(3)} (${z.ru.toFixed(3)} × ${z.rv.toFixed(3)}); celle cambiate dentro ${esito.dentro}, fuori ${esito.fuori}`);
  if (!esito.dentro || esito.fuori) { console.error('prova-bocca: la versione usata cambia fuori dalla bocca, o non cambia'); process.exitCode = 1; }
} finally {
  clearTimeout(scadenza);
  await browser.close();
}

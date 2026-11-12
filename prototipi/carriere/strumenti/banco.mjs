// Banco della fluidità (CA-0a, Fase H; resta per CA-0): registra le scene e la bacheca a frequenza piena, nei due orientamenti e con la
// CPU normale e quattro volte più lenta, e controlla da solo i fotogrammi. Uso (dopo Build): node strumenti/banco.mjs, o run.ps1 -Task Banco.
// Uscita in BM_OUT (o %TEMP%\bm-carriere-banco): banco.md (il rapporto con i numeri), banco.json e i fotogrammi incriminati.
//
// Come guarda:
// - nella pagina, a ogni fotogramma del browser, quanto è durato il fotogramma e com'è ogni ritratto (immagine o tela visibili, rettangolo,
//   opacità, quale immagine);
// - dallo screencast di Edge (CDP), i fotogrammi veri dello schermo, analizzati dopo in una pagina a parte;
// - nella pagina, con ?banco, il fondo della scena è grigio uniforme e il lettore controlla le immagini che compone (bocca, sagoma).
// Difetti contati:
// - fotogrammi lunghi: più di 50 ms fra un fotogramma e il successivo;
// - ritratto vuoto: un ritratto in scena senza né l'immagine né la tela visibili;
// - lampeggio: nel riquadro del ritratto un fotogramma molto diverso dal precedente e dal successivo, che invece si somigliano (A-B-A);
// - salto: lo stesso ritratto che in un fotogramma si sposta o cambia misura di più del 3% della sua altezza;
// - velo: pixel non grigi attorno alla figura, fuori dalla sua sagoma allargata (un fondo sporco, un contorno scuro); dalla Fase J, con
//   due ritratti in scena, fuori dalle sagome di tutti e due;
// - bocca che non combacia: nelle immagini composte, pixel cambiati sul bordo della sagoma o fuori dalla zona della bocca, o pixel scuri nuovi.
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const out = process.env.BM_OUT || path.join(os.tmpdir(), 'bm-carriere-banco');
const porta = Number(process.env.BM_PREVIEW_PORT ?? 4331);
const url = `http://127.0.0.1:${porta}/`;
const solo = process.env.BM_BANCO;  // per esempio «scena-prova» o «o-1x»: solo i giri che lo contengono
fs.mkdirSync(path.join(out, 'fotogrammi'), {recursive: true});

const server = spawn(process.execPath, [path.join(radice, 'node_modules/vite/bin/vite.js'), 'preview', '--strictPort'], {cwd: radice, stdio: 'ignore'});
let browser;
const scadenza = setTimeout(() => { console.error('banco: tempo scaduto'); fine(1); }, 900_000);
async function fine(codice) {
  clearTimeout(scadenza);
  try { await browser?.close(); } catch { /* niente */ }
  server.kill();
  process.exit(codice);
}

// Il campionatore, nella pagina: un ciclo di fotogrammi che annota la durata e lo stato di ogni ritratto, e le immagini composte.
function campionatore() {
  const c = window.__banco = {campioni: [], attivo: false};
  window.__bancoControlli = [];
  let prima = null;
  const passo = ora => {
    if (c.attivo) {
      const ritratti = [...document.querySelectorAll('[data-testid=ritratto], [data-testid=ritratto-accanto], [data-testid=ritratto-uscente]')].map(e => {
        const r = e.getBoundingClientRect(), img = e.querySelector('img'), tela = e.querySelector('canvas');
        const vis = x => !!x && getComputedStyle(x).visibility !== 'hidden';
        const immagine = vis(img) && img.complete && img.naturalWidth > 0;
        return {x: r.x, y: r.y, w: r.width, h: r.height, opacita: Number(getComputedStyle(e).opacity), immagine, tela: vis(tela),
          src: (e.dataset.src || img?.getAttribute('src') || '').split('/').pop(), uscita: e.dataset.uscita === 'si', entrata: e.dataset.entrata === 'si'};
      });
      c.campioni.push({t: performance.timeOrigin + ora, dt: prima === null ? 0 : ora - prima, ritratti});
    }
    prima = ora;
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

/** I giri del banco: scena, orientamento, CPU. */
const MISURE = {o: {width: 1366, height: 768}, v: {width: 390, height: 844}};
const SCENARI = {
  // La prima scena della prova: Piera con gli stacchi su chi ascolta (le esasperate), poi Mara e Spazienzio: bocche, stacchi, cambi.
  'scena-prova': async (page, tocca) => {
    await page.getByTestId('apri-prova').click();
    await page.getByTestId('mappa-continua').click();
    for (let i = 0; i < 14 && (await page.locator('.dialogo .nome').textContent().catch(() => '')) !== 'Spazienzio'; i++) { await page.waitForTimeout(900); await tocca(); }
    await page.waitForTimeout(2500);
  },
  // La scena 0 del tutorial: la combriccola, poi Mara (agitata, sospettosa): cambi di personaggio e di espressione.
  'scena-tutorial': async (page, tocca) => {
    await page.getByTestId('apri-tutorial').click();
    await page.getByTestId('mappa-continua').click();
    for (let i = 0; i < 10; i++) { await page.waitForTimeout(1000); await tocca(); }
    await page.waitForTimeout(1500);
  },
  // La bacheca dopo la cucina: post-it che si stacca, puntina che viaggia, lettera che cade (con ?allenta), e il resto della bacheca viva.
  'bacheca': async page => {
    await page.getByTestId('apri-prova').click();
    await page.getByTestId('mappa-continua').click(); await page.getByTestId('salta').click(); await page.getByTestId('opzione-1').click();
    await page.getByTestId('mappa').waitFor();
    await page.waitForTimeout(800);
    await page.getByTestId('mappa-continua').click(); await page.getByTestId('salta').click(); await page.getByTestId('perdi').click();
    await page.getByTestId('mappa').waitFor();
    await page.waitForTimeout(11000);
  },
};

async function giro(nome, scenario, misura, cpu) {
  const ctx = await browser.newContext({viewport: MISURE[misura], deviceScaleFactor: 1});
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  await page.addInitScript(campionatore);
  const cdp = await ctx.newCDPSession(page);
  const errori = [];
  page.on('pageerror', e => errori.push(String(e)));
  await page.goto(url + '?banco' + (scenario === 'bacheca' ? '&allenta' : ''));
  await page.getByTestId('elenco').waitFor();
  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', {rate: cpu});
  const fotogrammi = [];
  cdp.on('Page.screencastFrame', f => { fotogrammi.push({dati: f.data, t: f.metadata.timestamp * 1000}); cdp.send('Page.screencastFrameAck', {sessionId: f.sessionId}).catch(() => {}); });
  await page.evaluate(() => { window.__banco.attivo = true; });
  await cdp.send('Page.startScreencast', {format: 'jpeg', quality: 80, everyNthFrame: 1});
  const m = MISURE[misura];
  const tocca = () => page.getByTestId('scena').click({position: {x: m.width / 2, y: m.height * 0.3}}).catch(() => {});
  await SCENARI[scenario](page, tocca);
  await cdp.send('Page.stopScreencast');
  const {campioni} = await page.evaluate(() => window.__banco);
  const controlli = await page.evaluate(() => window.__bancoControlli);
  await ctx.close();
  return {nome, scenario, misura, cpu, campioni, controlli, fotogrammi, errori};
}

/** L'analisi dei fotogrammi dello schermo, in una pagina: riquadro del ritratto, lampeggi, velo attorno alla figura. */
async function analizzaSchermo(pagina, g) {
  const ritrattoA = t => {
    // Il campione più vicino nel tempo: i ritratti visibili (Fase J: fino a due), nessuno in uscita.
    let migliore = null, d = Infinity;
    for (const c of g.campioni) { const x = Math.abs(c.t - t); if (x < d) { d = x; migliore = c; } }
    // Durante un'entrata, un'uscita o una dissolvenza la figura è sfocata o trasparente apposta: velo e lampeggio non si guardano.
    if (!migliore || migliore.ritratti.some(r => r.uscita || r.entrata || r.opacita < 0.99)) return null;
    const visti = migliore.ritratti.filter(r => r.immagine || r.tela).sort((a, b) => a.src.localeCompare(b.src));
    return visti.length ? visti : null;
  };
  const tutti = g.fotogrammi.map(f => ({t: f.t, r: ritrattoA(f.t)}));
  // A blocchi di 40 fotogrammi, e solo quelli con un ritratto da guardare: tutti insieme la pagina d'analisi non regge.
  const risultati = [];
  let stato = null;
  for (let i = 0; i < tutti.length; i += 40) {
    const blocco = tutti.slice(i, i + 40).map((f, j) => ({...f, dati: f.r ? g.fotogrammi[i + j].dati : null, vw: g.vw, vh: g.vh}));
    const r = await analizzaBlocco(pagina, blocco, stato);
    risultati.push(...r.risultati);
    stato = r.stato;
  }
  return risultati;
}
async function analizzaBlocco(pagina, dati, stato) {
  return pagina.evaluate(async ([dati, base, stato]) => {
    const sagome = (window.__sagome ??= new Map());
    const sagoma = async src => {
      if (!src) return null;
      if (!sagome.has(src)) {
        const img = new Image(); img.src = base + 'assets/' + src;
        sagome.set(src, img.decode().then(() => {
          const c = new OffscreenCanvas(64, 96), x = c.getContext('2d'); x.drawImage(img, 0, 0, 64, 96);
          const a = x.getImageData(0, 0, 64, 96).data, m = new Uint8Array(64 * 96);
          for (let k = 0; k < m.length; k++) m[k] = a[k * 4 + 3] > 245 ? 1 : 0;  // solo i pixel pieni: un fondo sporco non conta come figura
          // La sagoma allargata di tre celle (circa il 5% della larghezza): la maglia piega la testa di qualche pixel.
          const larga = new Uint8Array(m.length);
          for (let y = 0; y < 96; y++) for (let x2 = 0; x2 < 64; x2++) {
            let s = 0;
            for (let dy = -3; dy <= 3 && !s; dy++) for (let dx = -3; dx <= 3 && !s; dx++) { const yy = y + dy, xx = x2 + dx; if (yy >= 0 && yy < 96 && xx >= 0 && xx < 64 && m[yy * 64 + xx]) s = 1; }
            larga[y * 64 + x2] = s;
          }
          return larga;
        }).catch(() => null));
      }
      return sagome.get(src);
    };
    const risultati = [];
    let prec = stato?.prec ? {crop: stato.prec.crop && Float32Array.from(stato.prec.crop), src: stato.prec.src} : null;
    let prec2 = stato?.prec2 ? {crop: stato.prec2.crop && Float32Array.from(stato.prec2.crop), src: stato.prec2.src} : null;
    for (const f of dati) {
      if (!f.dati) { risultati.push({t: f.t, velo: 0, lampeggio: false}); prec2 = prec; prec = {crop: null, src: null}; continue; }
      const bmp = await createImageBitmap(await (await fetch('data:image/jpeg;base64,' + f.dati)).blob());
      const scala = bmp.width / innerWidthGiro(f);
      let crop = null, velo = 0;
      if (f.r) {
        // Fase J: fino a due ritratti. Il riquadro di ognuno, uno dopo l'altro; il velo di ognuno fuori dalle sagome di tutti e due (dove
        // i due si sovrappongono, quello che sta dietro non è un velo di quello davanti).
        const sagomeQui = await Promise.all(f.r.map(r => sagoma(r.src)));
        const dentroAltra = (sx, sy, i) => f.r.some((r, j) => {
          if (j === i || !sagomeQui[j]) return false;
          const cx = Math.floor(((sx - r.x) / r.w) * 64), cy = Math.floor(((sy - r.y) / r.h) * 96);
          return cx >= 0 && cy >= 0 && cx < 64 && cy < 96 && sagomeQui[j][cy * 64 + cx] === 1;
        });
        crop = new Float32Array(64 * 96 * f.r.length);
        for (let i = 0; i < f.r.length; i++) {
          const q = f.r[i];
          const c = new OffscreenCanvas(64, 96), x = c.getContext('2d');
          x.drawImage(bmp, q.x * scala, q.y * scala, q.w * scala, q.h * scala, 0, 0, 64, 96);
          const px = x.getImageData(0, 0, 64, 96).data;
          for (let k = 0; k < 64 * 96; k++) crop[i * 64 * 96 + k] = (px[k * 4] + px[k * 4 + 1] + px[k * 4 + 2]) / 3;
          // Velo: celle fuori dalla sagoma allargata, dentro lo schermo, che non sono il grigio del fondo.
          const s = sagomeQui[i];
          let suo = 0;
          if (s) for (let k = 0; k < s.length; k++) {
            if (s[k]) continue;
            const cy = Math.floor(k / 64), cx = k % 64;
            const sx = q.x + (cx + 0.5) * q.w / 64, sy = q.y + (cy + 0.5) * q.h / 96;
            if (sx < 0 || sy < 0 || sx > f.vw || sy > f.vh * 0.78) continue;  // sotto la finestra di dialogo non si guarda
            if (dentroAltra(sx, sy, i)) continue;
            const r = px[k * 4], gg = px[k * 4 + 1], b = px[k * 4 + 2];
            if (Math.abs(r - 128) > 14 || Math.abs(gg - 128) > 14 || Math.abs(b - 128) > 14) suo++;
          }
          velo = Math.max(velo, suo);  // il velo peggiore dei due
        }
      }
      const media = (a, b) => { let d = 0; for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k]); return d / a.length; };
      let lampeggio = false;
      if (prec2?.crop && prec?.crop && crop && prec.src === prec2.src && crop.length === prec.crop.length) {
        const d1 = media(prec2.crop, prec.crop), d2 = media(prec.crop, crop), d3 = media(prec2.crop, crop);
        lampeggio = d1 > 18 && d2 > 18 && d3 < Math.min(d1, d2) * 0.35;
      }
      risultati.push({t: f.t, velo, lampeggio});
      prec2 = prec; prec = {crop, src: f.r?.map(r => r.src).join(',')};
      bmp.close();
    }
    const serial = x => x ? {crop: x.crop ? Array.from(x.crop) : null, src: x.src} : null;
    return {risultati, stato: {prec: serial(prec), prec2: serial(prec2)}};
    function innerWidthGiro(f) { return f.vw; }
  }, [dati, url, stato]);
}

/** I difetti di un giro, dai campioni e dall'analisi dello schermo. */
function difetti(g, schermo) {
  const dt = g.campioni.map(c => c.dt).filter(x => x > 0);
  const ordinati = [...dt].sort((a, b) => a - b);
  const lunghi = g.campioni.filter(c => c.dt > 50);
  const vuoti = g.campioni.filter(c => c.ritratti.some(r => !r.uscita && !r.immagine && !r.tela && r.opacita > 0.05));
  const salti = [];
  for (let i = 1; i < g.campioni.length; i++) {
    const a = g.campioni[i - 1], b = g.campioni[i];
    if (b.dt > 40) continue;
    for (const rb of b.ritratti) {
      const ra = a.ritratti.find(r => r.src === rb.src && r.uscita === rb.uscita);
      if (!ra || rb.entrata || ra.entrata || rb.uscita || ra.opacita < 0.99 || rb.opacita < 0.99) continue;
      const soglia = 0.03 * Math.max(ra.h, rb.h);
      if (Math.abs(ra.x + ra.w / 2 - rb.x - rb.w / 2) > soglia || Math.abs(ra.y - rb.y) > soglia || Math.abs(ra.h - rb.h) > soglia) salti.push({t: b.t, src: rb.src});
    }
  }
  // Velo: più di 200 punti (su 64×96) non grigi fuori dalla sagoma allargata. Un velo vero ne dà centinaia (la prova con mara-esasperata
  // senza sagoma: 640); le ciocche mosse dalla maglia e i segni sottili del gesto di Mara, semitrasparenti, fra 80 e 115.
  const veli = schermo.filter(f => f.velo > 200), lampeggi = schermo.filter(f => f.lampeggio);
  // Per la bocca contano il bordo e il fuori zona (una bocca aperta è scura per natura); per la sagoma i pixel scuri nuovi.
  const bocche = g.controlli.filter(c => c.cosa === 'bocca' ? c.bordi > 0 || c.fuori > 0 : c.scuri > 50);
  return {
    fotogrammi: dt.length, p95: Math.round(ordinati[Math.floor(ordinati.length * 0.95)] ?? 0), lunghi: lunghi.length, vuoti: vuoti.length,
    salti: salti.length, lampeggi: lampeggi.length, veli: veli.length, bocche: bocche.length,
    dettagli: {lunghi: lunghi.slice(0, 5).map(c => Math.round(c.dt)), salti: salti.slice(0, 5), veli: veli.slice(0, 5).map(f => f.velo), bocche, schermo: g.fotogrammi.length},
    incriminati: [...lampeggi.map(f => ({t: f.t, tipo: 'lampeggio'})), ...veli.map(f => ({t: f.t, tipo: 'velo'}))],
  };
}

try {
  for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) break; } catch { /* non ancora */ } await new Promise(r => setTimeout(r, 150)); }
  browser = await chromium.launch({channel: 'msedge'});
  const analisi = await browser.newPage();
  await analisi.goto(url);
  const righe = [];
  for (const scenario of Object.keys(SCENARI)) for (const misura of ['o', 'v']) for (const cpu of [1, 4]) {
    const nome = `${scenario}-${misura}-${cpu}x`;
    if (solo && !nome.includes(solo)) continue;
    const g = await giro(nome, scenario, misura, cpu);
    g.vw = MISURE[misura].width; g.vh = MISURE[misura].height;
    const schermo = await analizzaSchermo(analisi, g);
    const d = difetti(g, schermo);
    // I fotogrammi incriminati, al più sei per giro.
    for (const [k, x] of d.incriminati.slice(0, 6).entries()) {
      const f = g.fotogrammi.reduce((m, y) => Math.abs(y.t - x.t) < Math.abs(m.t - x.t) ? y : m);
      fs.writeFileSync(path.join(out, 'fotogrammi', `${nome}-${k + 1}-${x.tipo}.jpg`), Buffer.from(f.dati, 'base64'));
    }
    righe.push({nome, ...d, errori: g.errori});
    console.log(`${nome}: ${d.fotogrammi} fotogrammi, p95 ${d.p95} ms; lunghi ${d.lunghi}, vuoti ${d.vuoti}, lampeggi ${d.lampeggi}, salti ${d.salti}, veli ${d.veli}, bocche ${d.bocche}${g.errori.length ? `; errori: ${g.errori.join(' | ')}` : ''}`);
  }
  const somma = k => righe.reduce((s, r) => s + r[k], 0);
  const md = [
    `# Banco della fluidità — ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`, '',
    `Difetti in tutto: vuoti ${somma('vuoti')}, lampeggi ${somma('lampeggi')}, salti ${somma('salti')}, veli ${somma('veli')}, bocche ${somma('bocche')}; fotogrammi lunghi (oltre 50 ms) ${somma('lunghi')}.`, '',
    '| Giro | Fotogrammi | p95 (ms) | Lunghi | Vuoti | Lampeggi | Salti | Veli | Bocche |', '|---|---|---|---|---|---|---|---|---|',
    ...righe.map(r => `| ${r.nome} | ${r.fotogrammi} | ${r.p95} | ${r.lunghi} | ${r.vuoti} | ${r.lampeggi} | ${r.salti} | ${r.veli} | ${r.bocche} |`), '',
    'Immagini composte con difetti (bocca: pixel cambiati sul bordo della sagoma o fuori dalla zona; sagoma: pixel scuri nuovi):', '',
    ...[...new Map(righe.flatMap(r => r.dettagli.bocche).map(b => [`${b.immagine} ${b.cosa}`, b])).values()].map(b => `- ${b.immagine} (${b.cosa}): bordo ${b.bordi}, fuori zona ${b.fuori}, scuri ${b.scuri}`),
  ].join('\n');
  fs.writeFileSync(path.join(out, 'banco.md'), md + '\n');
  fs.writeFileSync(path.join(out, 'banco.json'), JSON.stringify(righe.map(({incriminati, ...r}) => r), null, 1));
  console.log(`banco in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

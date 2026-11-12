// Registrazioni (CA-0a). Fase G: g-bacheca.webm, la bacheca che si muove. Fase F (quelle della Fase E, e-*.webm, restano come erano): un breve video della prima scena
// della prova, con i tre personaggi piegati dalla maglia come vuole il cast, la finestra a due righe e, se le versioni «-bocca» dei ritratti ci
// sono, le bocche; e un foglio di fotogrammi dei tre. Per chi non apre il prototipo. Uso (dopo Build): node strumenti/registra.mjs, con BM_REGISTRA=bacheca o scena per una sola parte.
// Uscita in BM_OUT, o in %TEMP%\bm-carriere-registra. Edge di sistema come le catture. Playwright registra i video con un suo ffmpeg, che qui
// non c'è e non si scarica: i fotogrammi arrivano dallo screencast di Edge (CDP) e li codifica in webm il browser stesso (MediaRecorder).
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const out = process.env.BM_OUT || path.join(os.tmpdir(), 'bm-carriere-registra');
const porta = Number(process.env.BM_PREVIEW_PORT ?? 4331);
const url = `http://127.0.0.1:${porta}/`;
const CHIAVE = 'bm-carriere-prototipo-v1:animazione-f';
const RITRATTI = path.resolve(radice, '../../docs/design/carriere/asset/tutorial/ritratti');
const bocche = fs.readdirSync(RITRATTI).filter(f => f.endsWith('-bocca.webp'));
const MISURA = {width: 960, height: 540};
fs.mkdirSync(out, {recursive: true});

const server = spawn(process.execPath, [path.join(radice, 'node_modules/vite/bin/vite.js'), 'preview', '--strictPort'], {cwd: radice, stdio: 'ignore'});
let browser;
const scadenza = setTimeout(() => { console.error('registra: tempo scaduto'); fine(1); }, 360_000);
async function fine(codice) {
  clearTimeout(scadenza);
  try { await browser?.close(); } catch { /* niente */ }
  server.kill();
  process.exit(codice);
}

async function attendiServer() {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(url)).ok) return; } catch { /* non ancora */ }
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('il server di anteprima non risponde');
}

/** Apre il prototipo con un livello di animazione già scelto. */
async function pagina(livello, cerca = '') {
  const ctx = await browser.newContext({viewport: MISURA, deviceScaleFactor: 1});
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  await page.addInitScript(([k, l]) => localStorage.setItem(k, l), [CHIAVE, livello]);
  await page.goto(url + cerca);
  return {ctx, page};
}
/** Comincia a raccogliere i fotogrammi della pagina (jpeg con l'istante in secondi); `ferma` li restituisce. */
async function registra(ctx, page) {
  const cdp = await ctx.newCDPSession(page);
  const fotogrammi = [];
  cdp.on('Page.screencastFrame', f => {
    fotogrammi.push({dati: f.data, t: f.metadata.timestamp});
    cdp.send('Page.screencastFrameAck', {sessionId: f.sessionId}).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {format: 'jpeg', quality: 82, maxWidth: MISURA.width, maxHeight: MISURA.height});
  return {ferma: async () => { await cdp.send('Page.stopScreencast'); return fotogrammi; }};
}
/** Ridà i fotogrammi in tempo reale su una tela e li registra in webm (VP9) con MediaRecorder. */
async function codifica(tutti, file) {
  // Al più 30 fotogrammi al secondo: bastano al video e la pagina che codifica non si riempie di immagini.
  const fotogrammi = tutti.filter((f, k) => k === 0 || f.t - tutti[k - 1].t > 0 && Math.floor(f.t * 30) !== Math.floor(tutti[k - 1].t * 30));
  const p = await browser.newPage({viewport: MISURA});
  await p.setContent('<body style="margin:0"></body>');
  const t0 = fotogrammi[0].t;
  const base64 = await p.evaluate(async ([fs, w, h]) => {
    const tela = Object.assign(document.createElement('canvas'), {width: w, height: h});
    document.body.append(tela);
    const g = tela.getContext('2d');
    const immagini = await Promise.all(fs.map(f => { const i = new Image(); i.src = `data:image/jpeg;base64,${f.dati}`; return i.decode().then(() => i); }));
    g.drawImage(immagini[0], 0, 0, w, h);
    const rec = new MediaRecorder(tela.captureStream(30), {mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 700_000});
    const pezzi = [];
    rec.ondataavailable = e => pezzi.push(e.data);
    const finito = new Promise(r => { rec.onstop = r; });
    rec.start();
    const inizio = performance.now();
    for (let k = 0; k < fs.length; k++) {
      const attesa = fs[k].t * 1000 - (performance.now() - inizio);
      if (attesa > 0) await new Promise(r => setTimeout(r, attesa));
      g.drawImage(immagini[k], 0, 0, w, h);
    }
    await new Promise(r => setTimeout(r, 300));
    rec.stop();
    await finito;
    const b = new Uint8Array(await new Blob(pezzi, {type: 'video/webm'}).arrayBuffer());
    let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
    return btoa(s);
  }, [fotogrammi.map(f => ({dati: f.dati, t: f.t - t0})), MISURA.width, MISURA.height]);
  await p.close();
  fs.writeFileSync(path.join(out, file), Buffer.from(base64, 'base64'));
  console.log(`${file}: ${fotogrammi.length} fotogrammi in ${(fotogrammi.at(-1).t - t0).toFixed(1)} s`);
}
const tid = (page, id) => page.getByTestId(id);
const tocca = page => tid(page, 'scena').click({position: {x: MISURA.width / 2, y: MISURA.height * 0.3}});
const nome = page => page.locator('.dialogo .nome').textContent();
/** Avanza finché parla `chi` (al più n tocchi): il primo tocco completa la battuta che scorre, il secondo passa alla prossima. */
async function finoA(page, chi, n = 16) {
  const visti = [];
  for (let i = 0; i < n && (await nome(page)) !== chi; i++) {
    visti.push(await nome(page));
    if (!(await page.locator('.dialogo .avanti').isVisible())) await tocca(page);
    await tocca(page);
    await page.waitForTimeout(120);
  }
  if ((await nome(page)) !== chi) throw new Error(`registra: non arriva la battuta di ${chi} (${visti.join(', ')})`);
}

try {
  await attendiServer();
  browser = await chromium.launch({channel: 'msedge'});

  // Quali registrazioni: BM_REGISTRA=scena (Fase F), bacheca (Fase G), o tutte.
  const quali = process.env.BM_REGISTRA ?? 'tutte';
  const unisci = pezzi => {
    const tutti = [];
    for (const p of pezzi) { const sposta = (tutti.at(-1)?.t ?? p[0].t) + (tutti.length ? 0.05 : 0) - p[0].t; tutti.push(...p.map(f => ({...f, t: f.t + sposta}))); }
    return tutti;
  };

  // Fase G: la bacheca che si muove. Il post-it del primo nodo che si stacca; dopo la cucina, la puntina «sei qui» che viaggia e il post-it
  // della cucina; un tocco sul feltro che scuote le cordicelle; una lettera che tremola e cade, e il giocatore che la rimette a posto.
  if (quali !== 'scena') {
    const {ctx, page} = await pagina('cast', '?allenta');
    const pezzi = [];
    // Un pezzo di registrazione; con `foto`, anche una cattura dopo `a` millisecondi (per il rapporto).
    const pezzo = async (ms, foto, a = 0) => {
      const r = await registra(ctx, page);
      if (foto) { await page.waitForTimeout(a); await page.screenshot({path: path.join(out, foto), type: 'jpeg', quality: 80}); }
      await page.waitForTimeout(ms - a);
      pezzi.push(await r.ferma());
    };
    await tid(page, 'apri-prova').click();
    await tid(page, 'mappa-continua').click(); await tid(page, 'salta').click(); await tid(page, 'opzione-1').click();
    await tid(page, 'mappa').waitFor();
    await pezzo(2300, 'g-postit.jpg', 850);                // il post-it del bancone si stacca
    await tid(page, 'mappa-continua').click(); await tid(page, 'salta').click(); await tid(page, 'perdi').click();
    await tid(page, 'mappa').waitFor();
    await pezzo(3400, 'g-viaggio.jpg', 2500);              // post-it della cucina, poi la puntina che viaggia
    await page.mouse.click(MISURA.width * 0.7, MISURA.height * 0.85);  // un tocco sul feltro
    await pezzo(1800);
    await page.waitForTimeout(1500);                       // la bacheca resta ferma un poco (non registrato)
    await pezzo(3600);                                     // la lettera tremola e cade
    await tid(page, 'presa-lettera').waitFor();
    await page.screenshot({path: path.join(out, 'g-lettera.jpg'), type: 'jpeg', quality: 80});
    const l = await tid(page, 'lettera-caduta').evaluate(e => ({x: +e.getAttribute('x'), y: +e.getAttribute('y'), fs: +e.getAttribute('font-size')}));
    const c = await tid(page, 'presa-lettera').evaluate(e => ({x: +e.getAttribute('cx'), y: +e.getAttribute('cy')}));
    const r = await registra(ctx, page);
    await page.waitForTimeout(300);
    await page.mouse.move(c.x, c.y); await page.mouse.down();
    await page.mouse.move(l.x + l.fs * 0.2 + 2, l.y - l.fs * 0.35 - 1, {steps: 30});
    await page.mouse.up();
    await page.waitForTimeout(1200);
    pezzi.push(await r.ferma());
    await ctx.close();
    await codifica(unisci(pezzi), 'g-bacheca.webm');
  }

  // 1. La prima scena della prova: Piera (con gli stacchi su chi ascolta), Mara, Spazienzio; ciascuno parla qualche secondo.
  const video = bocche.length ? 'f-bocche.webm' : 'f-scena.webm';
  if (quali !== 'bacheca') {
    const {ctx, page} = await pagina('cast');
    await tid(page, 'apri-prova').click();
    await tid(page, 'mappa-continua').click();
    await page.waitForTimeout(400);
    const pezzi = [];
    const pezzo = async ms => { const r = await registra(ctx, page); await page.waitForTimeout(ms); pezzi.push(await r.ferma()); };
    await pezzo(2500);                       // Piera comincia, lenta
    for (let i = 0; i < 2; i++) { await tocca(page); await pezzo(1600); }  // gli stacchi su chi ascolta
    await finoA(page, 'Mara', 40);
    await pezzo(3200);
    await finoA(page, 'Spazienzio', 40);
    await pezzo(3200);
    await ctx.close();
    // I pezzi uno dopo l'altro, senza i salti in mezzo.
    const tutti = [];
    for (const p of pezzi) { const sposta = (tutti.at(-1)?.t ?? p[0].t) + (tutti.length ? 0.05 : 0) - p[0].t; tutti.push(...p.map(f => ({...f, t: f.t + sposta}))); }
    await codifica(tutti, video);
  }

  // 2. Fotogrammi: otto istanti di ciascuno dei tre mentre parla, ritagliati sul ritratto, in un foglio solo.
  if (quali !== 'bacheca') {
  const righe = [];
  for (const chi of ['Piera', 'Mara', 'Spazienzio']) {
    const {ctx, page} = await pagina('cast');
    await tid(page, 'apri-prova').click();
    await tid(page, 'mappa-continua').click();
    if (chi !== 'Piera') await finoA(page, chi, 40);
    await page.waitForTimeout(300);
    const modo = await tid(page, 'ritratto').getAttribute('data-modo');
    const r = await tid(page, 'ritratto').boundingBox();
    const clip = {x: Math.max(0, r.x + r.width * 0.12), y: Math.max(0, r.y), width: r.width * 0.76, height: Math.min(r.height * 0.62, MISURA.height - r.y)};
    const fotogrammi = [];
    for (let i = 0; i < 8; i++) {
      fotogrammi.push((await page.screenshot({clip, type: 'jpeg', quality: 85})).toString('base64'));
      await page.waitForTimeout(160);
    }
    righe.push({titolo: chi === 'Piera' ? `Piera · ${modo}, poi lo stacco su Mara che ascolta` : `${chi} · ${modo}`, fotogrammi});
    await ctx.close();
  }
  const foglio = await browser.newPage({viewport: {width: 1600, height: 400}});
  await foglio.setContent(`<body style="margin:0;background:#16100c;font:14px sans-serif;color:#eadbc4">${righe.map(r =>
    `<div style="padding:6px 8px">${r.titolo} · un fotogramma ogni 0,16 s</div><div style="display:flex;gap:4px;padding:0 8px 8px">${
      r.fotogrammi.map(f => `<img style="height:200px" src="data:image/jpeg;base64,${f}">`).join('')}</div>`).join('')}</body>`);
  await foglio.waitForFunction(() => [...document.images].every(i => i.complete));
  await foglio.locator('body').screenshot({path: path.join(out, 'f-fotogrammi.jpg'), type: 'jpeg', quality: 78});
  console.log(bocche.length ? `bocche: ${bocche.length} ritratti` : 'bocche: nessuna versione «-bocca» ancora');
  }

  console.log(`registrazioni in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

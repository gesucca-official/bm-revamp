// Registrazioni dei ritratti animati (CA-0a, Fase E): due brevi video e una striscia di fotogrammi, per far vedere i due livelli
// (movimento procedurale per tutti, maglia su Spazienzio) a chi non apre il prototipo. Uso (dopo Build): node strumenti/registra.mjs
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
const CHIAVE = 'bm-carriere-prototipo-v1:animazione';
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
async function pagina(livello) {
  const ctx = await browser.newContext({viewport: MISURA, deviceScaleFactor: 1});
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  await page.addInitScript(([k, l]) => localStorage.setItem(k, l), [CHIAVE, livello]);
  await page.goto(url);
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

  // 1. Movimento: la scena 0 del tutorial, la combriccola che entra e Mara «agitata» (scatti), con il sobbalzo a ogni parola.
  {
    const {ctx, page} = await pagina('movimento');
    await tid(page, 'apri-tutorial').click();
    await tid(page, 'mappa-continua').click();
    await page.waitForTimeout(400);
    const r = await registra(ctx, page);
    await finoA(page, 'Mara');
    await page.waitForTimeout(1200);
    for (let i = 0; i < 3; i++) { await tocca(page); await page.waitForTimeout(1800); }
    await page.waitForTimeout(1500);
    const f = await r.ferma();
    await ctx.close();
    await codifica(f, 'e-movimento.webm');
  }

  // 2. Maglia: la prima scena della prova; Spazienzio ascolta Piera (respiro e inclinazione), poi parla (annuisce a ogni parola).
  {
    const {ctx, page} = await pagina('maglia');
    await tid(page, 'apri-prova').click();
    await tid(page, 'mappa-continua').click();
    await finoA(page, 'Piera');
    // Lo stacco su Spazienzio che ascolta arriva dopo il primo pezzo della battuta di Piera.
    for (let i = 0; i < 4 && !(await page.getByTestId('ritratto-maglia').count()); i++) { await tocca(page); await page.waitForTimeout(400); }
    await page.getByTestId('ritratto-maglia').waitFor();
    // Due pezzi: Spazienzio che ascolta, poi (saltati gli stacchi in mezzo) Spazienzio che parla.
    const r1 = await registra(ctx, page);
    await page.waitForTimeout(3500);
    const f1 = await r1.ferma();
    await finoA(page, 'Spazienzio', 40);
    const r2 = await registra(ctx, page);
    await page.waitForTimeout(5500);
    const f2 = await r2.ferma();
    await ctx.close();
    const sposta = f1.at(-1).t + 0.05 - f2[0].t;
    await codifica([...f1, ...f2.map(f => ({...f, t: f.t + sposta}))], 'e-maglia.webm');
  }

  // 3. Fotogrammi: otto istanti di Mara agitata (movimento) e di Spazienzio che parla (maglia), ritagliati sul ritratto, in un foglio solo.
  const righe = [];
  for (const [livello, apri, chi] of [['movimento', 'apri-tutorial', 'Mara'], ['maglia', 'apri-prova', 'Spazienzio']]) {
    const {ctx, page} = await pagina(livello);
    await tid(page, apri).click();
    await tid(page, 'mappa-continua').click();
    await finoA(page, chi, 40);
    await page.waitForTimeout(300);
    const r = await page.locator('[data-testid^=ritratto]').boundingBox();
    const clip = {x: Math.max(0, r.x + r.width * 0.12), y: Math.max(0, r.y), width: r.width * 0.76, height: Math.min(r.height * 0.62, MISURA.height - r.y)};
    const fotogrammi = [];
    for (let i = 0; i < 8; i++) {
      fotogrammi.push((await page.screenshot({clip, type: 'jpeg', quality: 85})).toString('base64'));
      await page.waitForTimeout(160);
    }
    righe.push({livello, fotogrammi});
    await ctx.close();
  }
  const foglio = await browser.newPage({viewport: {width: 1600, height: 400}});
  await foglio.setContent(`<body style="margin:0;background:#16100c;font:14px sans-serif;color:#eadbc4">${righe.map(r =>
    `<div style="padding:6px 8px">${r.livello} · un fotogramma ogni 0,16 s</div><div style="display:flex;gap:4px;padding:0 8px 8px">${
      r.fotogrammi.map(f => `<img style="height:220px" src="data:image/jpeg;base64,${f}">`).join('')}</div>`).join('')}</body>`);
  await foglio.waitForFunction(() => [...document.images].every(i => i.complete));
  await foglio.locator('body').screenshot({path: path.join(out, 'e-fotogrammi.jpg'), type: 'jpeg', quality: 78});

  console.log(`registrazioni in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

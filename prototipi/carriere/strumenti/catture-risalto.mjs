// Dove sei, a colpo d'occhio (14 novembre 2026): catture del risalto del nodo dove sei, sulla bacheca della principale a metà giro, a
// 1366×768 e 390×844. Il cerchio a evidenziatore e la variante del nastro adesivo (?nastro), affiancati in una sola immagine; e una breve
// registrazione della puntina «sei qui» che arriva e del cerchio che si traccia. Fa anche da prova di bordo: il risalto deve stare sul
// nodo della puntina, nei due modi e con il movimento ridotto. Uso (dopo Build): node strumenti/catture-risalto.mjs. Uscita in BM_OUT, o in
// %TEMP%\bm-carriere-risalto.
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const out = process.env.BM_OUT || path.join(os.tmpdir(), 'bm-carriere-risalto');
const porta = Number(process.env.BM_PREVIEW_PORT ?? 4331);
const url = `http://127.0.0.1:${porta}/`;
fs.mkdirSync(out, {recursive: true});

const server = spawn(process.execPath, [path.join(radice, 'node_modules/vite/bin/vite.js'), 'preview', '--strictPort'], {cwd: radice, stdio: 'ignore'});
let browser;
const scadenza = setTimeout(() => { console.error('catture-risalto: tempo scaduto'); fine(1); }, 600_000);
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

/** Registra la pagina con lo screencast di Edge: fotogrammi jpeg a 960×540 al più, con l'istante. */
async function registra(ctx, page) {
  const cdp = await ctx.newCDPSession(page);
  const fotogrammi = [];
  cdp.on('Page.screencastFrame', f => {
    fotogrammi.push({dati: f.data, t: f.metadata.timestamp});
    cdp.send('Page.screencastFrameAck', {sessionId: f.sessionId}).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {format: 'jpeg', quality: 80, maxWidth: 960, maxHeight: 540});
  return {ferma: async () => { await cdp.send('Page.stopScreencast'); return fotogrammi; }};
}
/** Ridà i fotogrammi in tempo reale su una tela, in un'altra pagina, e li registra in webm (VP9). */
async function codifica(tutti, file, misura) {
  const fotogrammi = tutti.filter((f, k) => k === 0 || f.t - tutti[k - 1].t > 0 && Math.floor(f.t * 30) !== Math.floor(tutti[k - 1].t * 30));
  const p = await browser.newPage({viewport: misura});
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
  }, [fotogrammi.map(f => ({dati: f.dati, t: f.t - t0})), misura.width, misura.height]);
  await p.close();
  fs.writeFileSync(path.join(out, file), Buffer.from(base64, 'base64'));
  console.log(`${file}: ${fotogrammi.length} fotogrammi in ${(fotogrammi.at(-1).t - t0).toFixed(1)} s`);
}
/** Due immagini affiancate in una, con un'etichetta sopra ciascuna. */
async function affianca(a, b, file, etichette) {
  const p = await browser.newPage();
  const dati = await p.evaluate(async ([a, b, et]) => {
    const im = async s => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); return i; };
    const [x, y] = await Promise.all([im(a), im(b)]);
    const spazio = 16, testa = 36, c = new OffscreenCanvas(x.width * 2 + spazio, x.height + testa), g = c.getContext('2d');
    g.fillStyle = '#1b1410'; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(x, 0, testa); g.drawImage(y, x.width + spazio, testa);
    g.fillStyle = '#f0e6d0'; g.font = '600 20px system-ui, sans-serif';
    g.fillText(et[0], 10, 25); g.fillText(et[1], x.width + spazio + 10, 25);
    const blob = await c.convertToBlob({type: 'image/jpeg', quality: 0.78});
    const u = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
    return btoa(s);
  }, [a.toString('base64'), b.toString('base64'), etichette]);
  await p.close();
  fs.writeFileSync(path.join(out, file), Buffer.from(dati, 'base64'));
}

async function giro(nome, viewport, registrare) {
  const ctx = await browser.newContext({viewport, deviceScaleFactor: 1});
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  const errori = [];
  page.on('pageerror', e => errori.push(String(e)));
  const tid = id => page.getByTestId(id);
  const atteso = (cond, cosa) => { if (!cond) throw new Error(`${nome}: atteso ${cosa}`); };
  /** Gioca fino a tornare `volte` volte alla bacheca: vince tutto, sceglie la prima opzione, il primo personaggio. */
  const avanti = async volte => {
    for (let passi = 0, bacheche = 0; passi < 300; passi++) {
      if (await tid('mappa').count()) { if (++bacheche > volte) return; await tid('mappa-continua').click(); continue; }
      if (await tid('scegli-giocatore').count()) { await page.locator('[data-testid^=giocatore-]').first().click(); continue; }
      const opzioni = page.locator('[data-testid^=opzione-]');
      if (await opzioni.count()) { await opzioni.first().click(); continue; }
      if (await tid('vinci').count()) { await tid('vinci').click(); continue; }
      if (await tid('salta').count()) { await tid('salta').click(); continue; }
      await tid('scena').click({position: {x: viewport.width / 2, y: viewport.height * 0.3}});
    }
  };
  /** Il risalto è sul nodo della puntina «sei qui», nel modo voluto. */
  const controlla = async (modo, cosa) => {
    const r = page.locator('[data-risalto]');
    atteso(await r.count() === 1, `${cosa}: un risalto`);
    atteso(await r.getAttribute('data-risalto') === modo, `${cosa}: il risalto ${modo}`);
    const nodo = await r.getAttribute('data-nodo');
    const conPuntina = await page.evaluate(() => document.querySelector('[data-testid=mappa]') && [...document.querySelectorAll('[data-testid^=nodo-]')].map(e => e.getAttribute('data-testid')));
    atteso(conPuntina.includes(`nodo-${nodo}`), `${cosa}: il risalto su un nodo della bacheca (${nodo})`);
    return nodo;
  };

  await page.goto(url);
  await tid('apri-principale').click();
  await tid('mappa').waitFor();
  // La prima bacheca: la puntina non c'è ancora, niente risalto.
  atteso(!(await page.locator('[data-risalto]').count()), 'nessun risalto prima di cominciare');
  await avanti(4);
  // A metà giro, dopo un ritorno: la registrazione della puntina che arriva e del cerchio che si traccia.
  await page.waitForTimeout(250);
  let r = null;
  if (registrare) r = await registra(ctx, page);
  await page.waitForTimeout(3800);
  if (registrare) await codifica(await r.ferma(), 'r-puntina-e-cerchio.webm', {width: 960, height: 540});
  const nodo = await controlla('cerchio', 'il cerchio');
  const cerchio = await page.screenshot({type: 'png'});
  // La variante: la stessa bacheca con ?nastro (lo stato del giro resta nel browser).
  await page.goto(url + '?nastro');
  await tid('apri-principale').click();
  await tid('mappa').waitFor();
  await page.waitForTimeout(1200);
  atteso(await controlla('nastro', 'il nastro') === nodo, 'il nastro sullo stesso nodo del cerchio');
  const nastro = await page.screenshot({type: 'png'});
  await affianca(cerchio, nastro, `r-${nome}-cerchio-e-nastro.jpg`, ['Cerchio a evidenziatore', 'Variante: nastro adesivo (?nastro)']);
  // Con il movimento ridotto il risalto c'è subito, fermo.
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto(url);
  await tid('apri-principale').click();
  await tid('mappa').waitFor();
  atteso(await tid('mappa').getAttribute('data-movimento') === 'ridotto', 'il movimento ridotto');
  atteso(await controlla('cerchio', 'il cerchio fermo') === nodo, 'il cerchio fermo sullo stesso nodo');
  const offset = await page.locator('[data-risalto] .tratto').first().evaluate(e => getComputedStyle(e).strokeDashoffset);
  atteso(parseFloat(offset) === 0, `il cerchio già tutto disegnato (${offset})`);
  atteso(!errori.length, `nessun errore nella pagina (${errori.join(' | ')})`);
  await ctx.close();
  return nodo;
}

try {
  await attendiServer();
  browser = await chromium.launch({channel: 'msedge'});
  const a = await giro('o', {width: 1366, height: 768}, true);
  const b = await giro('v', {width: 390, height: 844}, false);
  console.log(`risalto su ${a} (orizzontale) e ${b} (verticale); catture in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

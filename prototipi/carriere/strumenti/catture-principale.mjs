// Mockup della principale (14 novembre 2026, aggiornato alla scaletta 0.3.2, «le sconfitte sono un segreto»): catture della bacheca della
// carriera «Il Serraglio chiude», giocata davvero dall'interfaccia, a 1366×768 e 390×844. La mappa nuova, senza sconfitte visibili; il
// giro con le tre sconfitte che aprono un ramo (I1 → il pavimento, II2a → Piera non parla più, III1 → lo sgombero), con le tasche e i
// rami; la bacheca del giro dopo, con le sconfitte ormai viste. Le catture delle stesure di prima (p-*.jpg sulla 0.2, p3-*.jpg sulla 0.3)
// sono nel repository come erano. Fa anche da prova di bordo: se un passo atteso non c'è, esce con 1. Uso (dopo Build):
// node strumenti/catture-principale.mjs; con BM_REGISTRA=si registra anche la bacheca lungo il giro delle sconfitte
// (p32-giro-sconfitte.webm). Uscita in BM_OUT, o in %TEMP%\bm-carriere-principale.
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const out = process.env.BM_OUT || path.join(os.tmpdir(), 'bm-carriere-principale');
const porta = Number(process.env.BM_PREVIEW_PORT ?? 4331);
const url = `http://127.0.0.1:${porta}/`;
fs.mkdirSync(out, {recursive: true});

const server = spawn(process.execPath, [path.join(radice, 'node_modules/vite/bin/vite.js'), 'preview', '--strictPort'], {cwd: radice, stdio: 'ignore'});
let browser;
const scadenza = setTimeout(() => { console.error('catture-principale: tempo scaduto'); fine(1); }, 600_000);
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

/** Registra la pagina con lo screencast di Edge (come strumenti/registra.mjs): fotogrammi jpeg a 960×540 al più, con l'istante. */
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
/** Pezzi registrati uno dopo l'altro, con i tempi rifatti perché non restino buchi fra un pezzo e l'altro. */
const unisci = pezzi => {
  const tutti = [];
  for (const p of pezzi.filter(x => x.length)) { const sposta = (tutti.at(-1)?.t ?? p[0].t) + (tutti.length ? 0.05 : 0) - p[0].t; tutti.push(...p.map(f => ({...f, t: f.t + sposta}))); }
  return tutti;
};
/** Ridà i fotogrammi in tempo reale su una tela, in un'altra pagina, e li registra in webm (VP9) con MediaRecorder. */
async function codifica(tutti, file, misura) {
  // Al più 20 fotogrammi al secondo: un giro intero sono decine di ritorni alla bacheca, e la pagina che codifica decodifica tutto insieme.
  const fotogrammi = tutti.filter((f, k) => k === 0 || f.t - tutti[k - 1].t > 0 && Math.floor(f.t * 20) !== Math.floor(tutti[k - 1].t * 20));
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

async function giro(nome, viewport, registrare) {
  const ctx = await browser.newContext({viewport, deviceScaleFactor: 1});
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  const errori = [];
  page.on('pageerror', e => errori.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
  const tid = id => page.getByTestId(id);
  const atteso = (cond, cosa) => { if (!cond) throw new Error(`${nome}: atteso ${cosa}`); };
  const foto = async (n, attesa = 600) => {
    await page.waitForTimeout(attesa);
    if (await tid('mappa').count()) await page.waitForFunction(() => !document.querySelector('[data-testid=viaggio], [data-cade], [data-penzola]'), null, {timeout: 8000});
    await page.screenshot({path: path.join(out, `p32-${nome}-${n}.jpg`), type: 'jpeg', quality: 72});
  };
  const stato = id => tid(`nodo-${id}`).getAttribute('data-stato');
  const pezzi = [];
  const sullaBacheca = async () => {
    if (!registrare) return;
    const r = await registra(ctx, page); await page.waitForTimeout(1800); pezzi.push(await r.ferma());
  };

  /** Gioca dalla bacheca fino alla fine del giro: a ogni scelta l'opzione che comincia con le parole date; perde nei nodi detti. */
  const gioca = async (strada, perdiIn = []) => {
    const visti = [];
    for (let passi = 0; passi < 300; passi++) {
      if (await tid('fine').count()) return visti;
      if (await tid('mappa').count()) {
        await sullaBacheca();
        await tid('mappa-continua').click();
        continue;
      }
      const dove = (await page.locator('.dove').textContent().catch(() => '')) ?? '';
      if (!visti.includes(dove)) visti.push(dove);
      const opzioni = page.locator('[data-testid^=opzione-]');
      if (await opzioni.count()) {
        const testi = await opzioni.allTextContents();
        // L'opzione che combacia con la parola più lunga della strada («con Mara, a pedinare» prima di «con Mara»).
        const punti = testi.map(t => Math.max(0, ...strada.filter(w => t.trim().startsWith(w)).map(w => w.length)));
        const i = punti.indexOf(Math.max(...punti));
        await opzioni.nth(Math.max(0, i)).click();
        continue;
      }
      // La partita «a scelta» (0.3): si sceglie il primo personaggio offerto.
      if (await tid('scegli-giocatore').count()) { await page.locator('[data-testid^=giocatore-]').first().click(); continue; }
      if (await tid('vinci').count()) {
        const perdi = perdiIn.find(x => dove.endsWith(x));
        if (perdi) perdiIn = perdiIn.filter(x => x !== perdi);
        await tid(perdi ? 'perdi' : 'vinci').click();
        continue;
      }
      if (await tid('ritenta').count()) { await tid('ritenta').click(); continue; }
      if (await tid('salta').count()) { await tid('salta').click(); continue; }
      await tid('scena').click({position: {x: viewport.width / 2, y: viewport.height * 0.3}});
    }
    throw new Error(`${nome}: un giro senza fine`);
  };
  // In verticale il riquadro del finale copre la fila dei pulsanti: «Mappa» si preme con un evento diretto.
  const allaBacheca = async () => { await tid('apri-mappa').dispatchEvent('click'); await tid('mappa').waitFor(); };
  const nuovoGiro = async () => { await tid('mappa-nuovo-giro').click(); await tid('mappa').waitFor(); };

  await page.goto(url);
  await tid('elenco').waitFor();
  await tid('apri-principale').click();
  await tid('mappa').waitFor();
  atteso(await stato('i1') === 'disponibile', 'I1 affrontabile all\'inizio');
  for (const id of ['s1', 's2', 'i1s', 'ii2s', 'iii1s', 'iii3c']) atteso(!(await tid(`nodo-${id}`).count()), `${id} nascosto all'inizio`);
  await foto('01-mappa-intera', 1500);

  // Il giro delle tre sconfitte: si perde I1 (il pavimento, poi di nuovo la scelta), si perde la frase di Piera (II2s), si perde contro
  // Duccio (lo sgombero, poi la notte al Serraglio senza la chiave). Finisce con F1. Le tasche pendono dal nodo perso; il Fabbro è legato
  // a I1 dalla cordicella del giro.
  if (registrare) pezzi.length = 0;
  await gioca(['con Mara', 'con Piera', 'con Beppe, a comprarlo'], ['Il cartello', 'La frase di Piera', 'Sabato sera']);
  atteso((await tid('finale').textContent()).includes('Il Serraglio resta'), 'il giro delle sconfitte: il Serraglio resta');
  await allaBacheca();
  for (const id of ['i1s', 'ii2s', 'iii1s', 'iii3b']) atteso(await stato(id) === 'fatto', `il giro delle sconfitte: ${id}`);
  atteso(!(await tid('nodo-iii3c').count()), 'i debiti, mai visti, nascosti');
  await foto('02-giro-tre-sconfitte', 800);
  if (registrare) { await sullaBacheca(); await codifica(unisci(pezzi), 'p32-giro-sconfitte.webm', {width: 960, height: 540}); }

  // Il giro dopo: le sconfitte ormai viste restano sulla bacheca, con i nomi; i debiti no.
  await nuovoGiro();
  for (const id of ['i1s', 'ii2s', 'iii1s']) atteso(await tid(`nodo-${id}`).count() === 1, `${id} visto: resta sulla bacheca`);
  atteso(!(await tid('nodo-iii3c').count()), 'i debiti ancora nascosti');
  await foto('03-giro-dopo', 1200);

  atteso(!errori.length, `nessun errore nella pagina (${errori.join(' | ')})`);
  await ctx.close();
}

try {
  await attendiServer();
  browser = await chromium.launch({channel: 'msedge'});
  await giro('o', {width: 1366, height: 768}, process.env.BM_REGISTRA === 'si');
  await giro('v', {width: 390, height: 844}, false);
  console.log(`catture in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

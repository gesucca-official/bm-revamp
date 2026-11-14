// Mockup della principale (14 novembre 2026): catture della bacheca della carriera «Il Serraglio chiude», giocata davvero dall'interfaccia, a
// 1366×768 e 390×844. La mappa intera all'inizio; tre giri diversi (a: Mara, Piera, il torneo perso con i debiti; b: Spazienzio, Celestina,
// dietro a Grappino nel segreto S1; c: con la chiave, la notte al Serraglio); la rivincita S2 che compare dopo il finale F1.
// Fa anche da prova di bordo: se un passo atteso non c'è, esce con 1. Uso (dopo Build): node strumenti/catture-principale.mjs; con
// BM_REGISTRA=si registra anche la bacheca lungo il giro b (p-giro-bacheca.webm). Uscita in BM_OUT, o in %TEMP%\bm-carriere-principale.
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
    await page.screenshot({path: path.join(out, `p-${nome}-${n}.jpg`), type: 'jpeg', quality: 72});
  };
  const stato = id => tid(`nodo-${id}`).getAttribute('data-stato');
  const pezzi = [];
  const sullaBacheca = async () => {
    if (!registrare) return;
    const r = await registra(ctx, page); await page.waitForTimeout(2200); pezzi.push(await r.ferma());
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
  atteso(!(await tid('nodo-s1').count()) && !(await tid('nodo-s2').count()), 'i due segreti nascosti');
  await foto('01-mappa-intera', 1500);

  // (a) Mara → Piera → il torneo perso con i debiti: F2.
  await gioca(['con Mara', 'con Piera', 'con Beppe, a comprarlo'], ['Il torneo']);
  atteso((await tid('finale').textContent()).includes('Il Serraglio è di tutti'), 'il giro a: il Serraglio è di tutti');
  await allaBacheca();
  atteso(await stato('iii3c') === 'fatto' && await stato('iii2a') === 'fatto', 'il giro a: il torneo e i debiti');
  await foto('02-giro-a-torneo-perso', 800);

  // (b) Spazienzio → Celestina → dietro a Grappino (S1): F1. La bacheca prima di scegliere, con S1 che compare.
  await nuovoGiro();
  if (registrare) pezzi.length = 0;
  await gioca(['con Spazienzio', 'con Celestina', 'con Grappino'], []);
  atteso((await tid('finale').textContent()).includes('Il Serraglio resta'), 'il giro b: il Serraglio resta');
  await allaBacheca();
  atteso(await stato('s1') === 'fatto' && await stato('ii2c') === 'fatto', 'il giro b: il bidone e il cane');
  await foto('03-giro-b-dietro-a-grappino', 800);
  if (registrare) { await sullaBacheca(); await codifica(unisci(pezzi), 'p-giro-bacheca.webm', {width: 960, height: 540}); }

  // (c) Con la chiave (via di Mara, I2a) e la notte al Serraglio: dopo F1 la rivincita S2 compare già all'inizio del giro.
  await nuovoGiro();
  atteso(await tid('nodo-s2').count() === 1, 'S2 sulla bacheca dopo F1');
  await foto('04-s2-dopo-f1', 1200);
  await gioca(['con Mara', 'con Beppe', 'con Mara, a pedinare', 'con Mara, ad aprire', 'con Sergio, che straccia'], []);
  await allaBacheca();
  atteso(await stato('iii3b') === 'fatto' && await stato('i2a') === 'fatto', 'il giro c: la notte al Serraglio con la chiave');
  await foto('05-giro-c-notte', 800);

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

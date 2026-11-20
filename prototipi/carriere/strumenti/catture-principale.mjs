// Mockup della principale (14 novembre 2026; aggiornato alla scaletta 0.3.7, la partita a catena di III5): catture della bacheca della
// carriera «Il Serraglio chiude», giocata davvero dall'interfaccia, a 1366×768 e 390×844. La mappa di una carriera nuova; il tavolo
// della catena di III5 a metà (due duelli vinti, si sceglie chi gioca) e al primo duello; la bacheca a giro finito. Un secondo giro
// perde il primo duello della catena e deve finire in F3, «Disco pub» (prova di bordo, senza cattura). Le catture delle stesure di
// prima (p-*.jpg sulla 0.2, p3-*.jpg sulla 0.3, p32-*.jpg sulla 0.3.2) sono nel repository come erano. Se un passo atteso non c'è,
// esce con 1. Uso (dopo Build): node strumenti/catture-principale.mjs. Uscita in BM_OUT, o in %TEMP%m-carriere-principale.
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

async function giro(nome, viewport) {
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
    // I cartoncini degli sblocchi durano 3,2 s: si aspetta che spariscano, così non coprono il tavolo.
    await page.waitForFunction(() => !document.querySelector('[data-testid=avviso]'), null, {timeout: 8000});
    if (await tid('mappa').count()) await page.waitForFunction(() => !document.querySelector('[data-testid=viaggio], [data-cade], [data-penzola]'), null, {timeout: 8000});
    await page.screenshot({path: path.join(out, `p37-${nome}-${n}.jpg`), type: 'jpeg', quality: 72});
  };
  const stato = id => tid(`nodo-${id}`).getAttribute('data-stato');
  const vintiInCatena = async () => page.locator('[data-testid^=catena-][data-stato=vinto]').count();

  /**
   * Gioca dalla bacheca fino alla fine del giro: a ogni scelta l'opzione che comincia con le parole date. Alla catena di III5 sceglie
   * nell'ordine dato (poi il primo che manca), e dopo `vintiPrima` duelli vinti chiama `allaCatena`; perde il duello numero `perdiDuello`
   * (0 = il primo), se dato. Dà i nomi dei finali visti.
   */
  const gioca = async (strada, {ordine = [], allaCatena = null, vintiPrima = 2, perdiDuello = null} = {}) => {
    let duelli = 0, fotografata = false;
    for (let passi = 0; passi < 400; passi++) {
      if (await tid('fine').count()) return;
      if (await tid('mappa').count()) { await tid('mappa-continua').click(); continue; }
      const opzioni = page.locator('[data-testid^=opzione-]');
      if (await opzioni.count()) {
        const testi = await opzioni.allTextContents();
        // L'opzione che combacia con la parola più lunga della strada («con Mara, a pedinare» prima di «con Mara»).
        const punti = testi.map(t => Math.max(0, ...strada.filter(w => t.trim().startsWith(w)).map(w => w.length)));
        await opzioni.nth(Math.max(0, punti.indexOf(Math.max(...punti)))).click();
        continue;
      }
      if (await tid('scegli-giocatore').count()) { await page.locator('[data-testid^=giocatore-]').first().click(); continue; }
      if (await tid('catena-scegli').count()) {
        if (allaCatena && !fotografata && await vintiInCatena() === vintiPrima) { fotografata = true; await allaCatena(); }
        const liberi = page.locator('button[data-testid^=catena-]');
        const ids = await liberi.evaluateAll(bs => bs.map(b => b.getAttribute('data-testid').slice('catena-'.length)));
        const chi = ordine.find(x => ids.includes(x)) ?? ids[0];
        await tid(`catena-${chi}`).click();
        continue;
      }
      if (await tid('vinci').count()) {
        if (await tid('catena').count()) {
          const perde = perdiDuello === duelli;
          duelli++;
          await tid(perde ? 'perdi' : 'vinci').click();
        } else await tid('vinci').click();
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

  // Il primo giro: strada pulita fino a III5, dove la catena si fotografa a metà (Beppe e Mara hanno già battuto Sergio, si sceglie il
  // terzo) e di nuovo con il primo duello in corso; poi si vincono tutti e cinque, e dopo il torneo si passa da F2 e F1.
  await gioca(['con Beppe, a comprarlo', 'con Mara'], {
    ordine: ['beppe', 'mara', 'piera', 'celestina', 'spazienzio'],
    allaCatena: async () => {
      atteso(await tid('catena').count() === 1, 'il tavolo della catena');
      atteso((await page.locator('button[data-testid^=catena-]').count()) === 3 && await vintiInCatena() === 2, 'due vinti e tre da scegliere');
      atteso((await tid('catena').textContent()).includes('Sergio'), 'Sergio sul tavolo');
      await foto('02-catena-a-meta', 700);
    },
  });
  atteso((await tid('finale').textContent()).length > 0, 'il giro finisce con un finale');
  const finale1 = await tid('finale').textContent();
  atteso(!finale1.includes('Disco pub'), `vinta la catena non è F3 (${finale1})`);
  await allaBacheca();
  atteso(await stato('iii5') === 'fatto', 'III5 fatto dopo la catena vinta');
  atteso(await tid('nodo-f1').count() === 1, 'F1 sulla bacheca');
  await foto('03-fine-giro', 800);

  // Il secondo giro: si perde il primo duello della catena, e il giro finisce subito in F3, «Disco pub».
  await nuovoGiro();
  await gioca(['con Beppe, a comprarlo', 'con Mara'], {perdiDuello: 0});
  atteso((await tid('finale').textContent()).includes('Disco pub'), 'la prima sconfitta della catena porta a «Disco pub»');
  await allaBacheca();
  atteso(await stato('iii5') === 'fatto' && await stato('f1') !== 'fatto', 'III5 visto, ma F1 no: la catena persa non prosegue');

  atteso(!errori.length, `nessun errore nella pagina (${errori.join(' | ')})`);
  await ctx.close();
}

try {
  await attendiServer();
  browser = await chromium.launch({channel: 'msedge'});
  await giro('o', {width: 1366, height: 768});
  await giro('v', {width: 390, height: 844});
  console.log(`catture in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

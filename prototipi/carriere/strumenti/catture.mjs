// Catture del prototipo delle carriere (CA-0a, Shots), a 1366×768 e 390×844, giocando davvero il tutorial e la mini-carriera.
// Fa anche da prova di bordo: se un passo atteso non compare, esce con 1. Uso (dopo Build): node strumenti/catture.mjs
// Uscita in BM_OUT, o in %TEMP%\bm-carriere-catture. Edge di sistema come le verifiche di client-web (channel msedge).
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const out = process.env.BM_OUT || path.join(os.tmpdir(), 'bm-carriere-catture');
const porta = Number(process.env.BM_PREVIEW_PORT ?? 4331);
const url = `http://127.0.0.1:${porta}/`;
fs.mkdirSync(out, {recursive: true});

const server = spawn(process.execPath, [path.join(radice, 'node_modules/vite/bin/vite.js'), 'preview', '--strictPort'], {cwd: radice, stdio: 'ignore'});
let browser;
const scadenza = setTimeout(() => { console.error('catture: tempo scaduto'); fine(1); }, 420_000);
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
  const errori = [];
  page.on('pageerror', e => errori.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errori.push(`${r.status()} ${r.url()}`); });
  const tid = id => page.getByTestId(id);
  const foto = async (n, attesa = 600) => {
    await page.waitForTimeout(attesa);
    // Fase G: sulla bacheca si fotografa a movimenti d'apertura finiti (post-it che si stacca, puntina che viaggia).
    if (await tid('mappa').count()) await page.waitForFunction(() => !document.querySelector('[data-testid=viaggio], [data-cade]'), null, {timeout: 6000});
    await page.screenshot({path: path.join(out, `${nome}-${n}.jpg`), type: 'jpeg', quality: 72});
  };
  const immagini = () => page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  const scena = () => tid('scena').click({position: {x: viewport.width / 2, y: viewport.height * 0.3}});
  const avanzaUna = async () => {
    if (!(await page.locator('.dialogo .avanti').isVisible())) await scena();
    await scena();
  };
  const salta = async () => { await tid('salta').click(); await page.waitForTimeout(150); };
  const continua = async () => { await tid('mappa-continua').click(); await immagini(); };
  const statoNodo = id => tid(`nodo-${id}`).getAttribute('data-stato');
  const atteso = (cond, cosa) => { if (!cond) throw new Error(`${nome}: atteso ${cosa}`); };

  await page.goto(url);
  await tid('elenco').waitFor();
  await foto('01-elenco', 200);
  // Campionario dei caratteri: la stessa battuta in ogni font (dalla Fase F Russo One, alleggerito e no, e due alternative).
  // L'elenco scorre dentro sé stesso: per fotografare il campionario intero si allunga la finestra, poi si torna alla misura di prova.
  await page.setViewportSize({width: viewport.width, height: 2200});
  await page.waitForTimeout(400);
  await tid('campionario').screenshot({path: path.join(out, `${nome}-01b-campionario.jpg`), type: 'jpeg', quality: 72});
  await page.setViewportSize(viewport);

  // Tutorial, giro intero: perde la partita 2 e ritenta, sceglie Mara, risponde agli amici (epilogo e achievement), poi resta.
  await tid('apri-tutorial').click();
  await tid('mappa').waitFor();
  await foto('02-mappa-inizio', 200);
  await continua();
  await foto('03-scena0-combriccola', 1500);
  for (let i = 0; i < 4; i++) await avanzaUna();
  await immagini();
  await foto('04-scena0-mara', 2600);
  // I caratteri da confrontare (Fase F): «Aa» passa da Russo One alleggerito (il predefinito) a Russo One pieno, Changa e Oxanium, e torna.
  atteso((await tid('carattere').textContent()).includes('Russo One alleggerito'), 'Russo One alleggerito, il predefinito');
  for (const n of ['04b-font-russo-one', '04c-font-changa', '04d-font-oxanium']) { await tid('carattere').click(); await foto(n, 400); }
  await tid('carattere').click();
  atteso((await tid('carattere').textContent()).includes('Russo One alleggerito'), 'il ritorno a Russo One alleggerito');
  await salta();
  await continua();
  await salta();
  await tid('vinci').waitFor();
  await foto('05-partita', 300);
  await tid('vinci').click();
  await tid('mappa').waitFor();
  await foto('06-mappa-tutorial', 300);
  await continua();
  for (let i = 0; i < 12 && (await page.locator('.dialogo .nome').textContent()) !== 'Piera'; i++) await avanzaUna();
  atteso((await page.locator('.dialogo .nome').textContent()) === 'Piera', 'la battuta di Piera');
  await page.locator('.ritratto.ascolta').waitFor({timeout: 15_000});
  // Lo stacco resta fino al tocco (Fase C, impressione 4): dopo due secondi chi ascolta è ancora lì.
  await page.waitForTimeout(2000);
  atteso(await page.locator('.ritratto.ascolta').count() === 1, 'lo stacco su chi ascolta che resta fino al tocco');
  // Fase J: durante lo stacco Piera resta in scena, chi reagisce le sta a fianco.
  atteso(await tid('ritratto').getAttribute('data-posto') === 'parla' && await tid('ritratto-accanto').getAttribute('data-posto') === 'ascolta',
    'due in scena: Piera e, a fianco, chi reagisce');
  await foto('07-stacco-piera', 150);
  await salta();
  await tid('perdi').click();
  await tid('ritenta').waitFor();
  atteso(!(await tid('ramo').count()), 'nessun ramo dopo la partita 2');
  await tid('ritenta').click();
  await foto('08-ritento', 1200);
  await salta();
  await tid('vinci').click();
  await continua();
  await salta();
  await tid('opzione-0').waitFor();
  await foto('09-scelta-muta', 300);
  await tid('opzione-0').click();
  await page.waitForTimeout(200);
  atteso((await page.locator('.dialogo .nome').textContent()) === 'Spazienzio', 'la reazione di Spazienzio lasciato');
  await salta();
  await tid('vinci').waitFor();
  await foto('10-partita-ffa', 300);
  await tid('vinci').click();
  await continua();
  for (let i = 0; i < 10 && !(await tid('notifica').count()); i++) await avanzaUna();
  await foto('11-notifica', 500);
  await scena();
  await salta();
  await tid('opzione-0').waitFor();
  await foto('12-telefono', 300);
  await tid('opzione-0').click();
  await continua();
  await tid('mappa').waitFor();
  await foto('13-mappa-ritorno-alla-scelta', 400);
  atteso(await statoNodo('scena-4') === 'disponibile', 'scena 4 di nuovo disponibile dopo l\'epilogo');
  await continua();
  await tid('opzione-1').click();
  await tid('fine').waitFor();
  await foto('14-fine-tutorial', 400);

  // Prova: con Spazienzio, la sconfitta porta da sola al retrobottega (P3), vicolo segreto; poi un nuovo giro fino al secondo finale (P7).
  await page.getByText('Elenco').last().click();
  await tid('apri-prova').click();
  await continua();
  // Ritratti animati (Fase F): il cast vuole la maglia per tutti (Piera brilla a parte); la tela WebGL si mette sopra l'immagine.
  atteso((await tid('animazione').textContent()).includes('Come nel cast'), 'il livello predefinito: come nel cast');
  await page.locator('[data-testid=ritratto][data-modo=maglia]').waitFor();
  // La battuta di Piera ha gli stacchi: fra un tocco e l'altro si lascia comparire il pezzo dopo.
  for (let i = 0; i < 40 && (await page.locator('.dialogo .nome').textContent()) !== 'Spazienzio'; i++) { await avanzaUna(); await page.waitForTimeout(150); }
  atteso((await page.locator('.dialogo .nome').textContent()) === 'Spazienzio', 'la battuta di Spazienzio');
  await page.locator('[data-testid=ritratto][data-modo=maglia]').waitFor();
  await tid('ritratto-tela').waitFor();
  await foto('16a-maglia-spazienzio', 1200);
  // La finestra è alta due righe: in verticale la battuta di Spazienzio va su due pagine e la prima aspetta il tocco.
  if (viewport.height > viewport.width) {
    await page.locator('.dialogo .avanti.pagina').waitFor();
    await foto('16b-pagina', 200);
    const altezza = await tid('testo').evaluate(e => e.getBoundingClientRect().height);
    await scena();
    atteso(!(await page.locator('.dialogo .avanti.pagina').count()), 'la pagina dopo, con un tocco');
    atteso(Math.abs(await tid('testo').evaluate(e => e.getBoundingClientRect().height) - altezza) < 1, 'la finestra resta alta uguale');
  }
  // Con la preferenza di movimento ridotto tutto resta fermo.
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.locator('[data-testid=ritratto][data-modo=fermo]').waitFor();
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.locator('[data-testid=ritratto][data-modo=maglia]').waitFor();
  // «✦» fa il giro: fermi, tutti a movimento, tutti a maglia, e di nuovo come nel cast.
  for (const [l, m] of [['Fermi', 'fermo'], ['Tutti movimento', 'movimento'], ['Tutti maglia', 'maglia'], ['Come nel cast', 'maglia']]) {
    await tid('animazione').click();
    atteso((await tid('animazione').textContent()).includes(l), l);
    await page.locator(`[data-testid=ritratto][data-modo=${m}]`).waitFor();
  }
  await salta();
  await tid('opzione-1').click();
  await continua();
  await salta();
  await tid('perdi').click();
  await tid('mappa').waitFor();
  atteso(!(await tid('ritenta').count()), 'nessun «Ritenta» dopo la sconfitta che apre un ramo');
  atteso(await statoNodo('nodo-e') === 'disponibile', 'il retrobottega disponibile dopo la sconfitta');
  // Fase G: dalla bancone alla cucina la puntina «sei qui» viaggia, e il post-it della cucina, appena scoperta, si stacca.
  atteso(await tid('viaggio').count() === 1, 'la puntina «sei qui» che viaggia');
  atteso(await page.locator('[data-cade="nodo-c"]').count() === 1, 'il post-it della cucina che si stacca');
  atteso(await tid('mappa').getAttribute('data-movimento') === 'si', 'la bacheca che si muove');
  await foto('15-sconfitta-ramo', 300);
  await continua();
  await salta();
  await continua();
  await salta();
  await tid('vinci').click();
  await tid('opzione-1').waitFor();
  await foto('17-scelta-condizionale', 300);
  await tid('opzione-1').click();
  await continua();
  await foto('18-vicolo', 1800);
  await salta();
  await continua();
  await salta();
  await tid('fine').waitFor();
  await tid('fine').getByRole('button', {name: 'Mappa'}).click();
  await foto('19-mappa-fine-prova', 300);
  await tid('mappa-nuovo-giro').click();
  atteso(await statoNodo('nodo-f') === 'aperto', 'il vicolo visibile al nuovo giro');
  await foto('20-mappa-nuovo-giro', 300);
  // Un cartoncino: si tocca un punto che non è disponibile.
  await tid('nodo-nodo-g').click();
  await tid('dettaglio').waitFor();
  await foto('20b-cartoncino', 200);
  await tid('dettaglio').getByRole('button', {name: 'Chiudi'}).click();
  // Secondo giro: con Mara, poi in D con Mara verso la porta aperta, il secondo finale.
  await continua();
  await salta();
  await tid('opzione-0').click();
  await continua();
  await salta();
  await tid('vinci').click();
  await continua();
  await salta();
  await tid('vinci').click();
  await tid('opzione-2').click();
  await continua();
  await salta();
  await tid('fine').waitFor();
  atteso((await tid('finale').textContent()).includes('Grappino scappa di nuovo'), 'il nome del secondo finale');
  await foto('22-secondo-finale', 600);
  await tid('fine').getByRole('button', {name: 'Mappa'}).click();
  atteso(await statoNodo('fine:grappino-scappa-di-nuovo') === 'fatto', 'il secondo finale fatto sulla mappa');
  await foto('23-mappa-due-finali', 300);
  await tid('apri-achievement').click();
  await foto('21-achievement', 200);


  await ctx.close();
  if (errori.length) throw new Error(`${nome}: errori nella pagina:\n${errori.join('\n')}`);
}

try {
  await attendiServer();
  browser = await chromium.launch({channel: 'msedge', headless: process.env.BM_HEADED !== '1'});
  await giro('o', {width: 1366, height: 768});
  await giro('v', {width: 390, height: 844});
  console.log(`catture in ${out}`);
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

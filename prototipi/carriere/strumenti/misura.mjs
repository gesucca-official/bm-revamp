// Fase D, prestazioni sul telefono: tempo di apertura della mappa-bacheca a 390×844 con la CPU rallentata (Chrome DevTools Protocol).
// Uso (dopo Build): node strumenti/misura.mjs [rallentamento=4] [ripetizioni=5]. Stampa i tempi in millisecondi e la mediana.
// Il tempo va dal tocco che apre la mappa al secondo fotogramma dopo che la mappa è nel documento (disegno e filtri compresi).
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import path from 'node:path';

const qui = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const radice = path.resolve(qui, '..');
const [rallenta = '4', volte = '5'] = process.argv.slice(2);
const porta = Number(process.env.BM_PREVIEW_PORT ?? 4331);
const url = `http://127.0.0.1:${porta}/`;
const server = spawn(process.execPath, [path.join(radice, 'node_modules/vite/bin/vite.js'), 'preview', '--strictPort'], {cwd: radice, stdio: 'ignore'});
let browser;
const scadenza = setTimeout(() => { console.error('misura: tempo scaduto'); fine(1); }, 240_000);
async function fine(codice) { clearTimeout(scadenza); try { await browser?.close(); } catch { /* niente */ } server.kill(); process.exit(codice); }

try {
  for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) break; } catch { /* non ancora */ } await new Promise(r => setTimeout(r, 150)); }
  browser = await chromium.launch({channel: 'msedge'});
  const page = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 3, isMobile: true, hasTouch: true});
  const cdp = await page.context().newCDPSession(page);
  const tid = id => page.getByTestId(id);
  await page.goto(url);
  // Mezza partita della prova, poi si misura l'apertura della mappa dalla scena (il caso più frequente) con la CPU rallentata.
  await tid('apri-prova').click();
  await tid('mappa-continua').click();
  await cdp.send('Emulation.setCPUThrottlingRate', {rate: Number(rallenta)});
  const tempi = [];
  const metriche = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  await cdp.send('Performance.enable');
  const parti = [];
  for (let k = 0; k < Number(volte); k++) {
    await tid('scena').waitFor();
    const prima = await metriche();
    const t = await page.evaluate(() => new Promise(fatto => {
      const t0 = performance.now();
      document.querySelector('[data-testid="apri-mappa"]').click();
      const aspetta = () => document.querySelector('[data-testid="mappa"]')
        ? requestAnimationFrame(() => requestAnimationFrame(() => fatto(performance.now() - t0)))
        : requestAnimationFrame(aspetta);
      aspetta();
    }));
    tempi.push(Math.round(t));
    const dopo = await metriche();
    const ms = k2 => Math.round((dopo[k2] - prima[k2]) * 1000);
    parti.push(`script ${ms('ScriptDuration')}, stile ${ms('RecalcStyleDuration')}, impaginazione ${ms('LayoutDuration')}, lavoro totale ${ms('TaskDuration')}`);
    await page.getByRole('button', {name: /^Riprendi/}).first().click();
  }
  const ordinati = [...tempi].sort((a, b) => a - b);
  console.log(`apertura della mappa a 390×844, CPU ${rallenta}× più lenta: ${tempi.join(', ')} ms; mediana ${ordinati[Math.floor(ordinati.length / 2)]} ms`);
  parti.forEach((x, i) => console.log(`  apertura ${i + 1}: ${x} ms (thread principale)`));
  await fine(0);
} catch (e) {
  console.error(e);
  await fine(1);
}

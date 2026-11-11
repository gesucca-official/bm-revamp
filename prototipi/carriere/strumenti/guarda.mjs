// Cattura veloce di una schermata dal server di sviluppo, per lavorare (non fa parte delle verifiche).
// node strumenti/guarda.mjs <uscita.png> <larghezza> <altezza> [bacheca|elenco]
import {chromium} from '@playwright/test';

const [out, w, h, cosa = 'bacheca'] = process.argv.slice(2);
const browser = await chromium.launch({channel: 'msedge'});
try {
  const page = await browser.newPage({viewport: {width: Number(w), height: Number(h)}});
  await page.goto('http://127.0.0.1:4330/');
  if (cosa === 'bacheca') await page.getByTestId('apri-bacheca').click();
  await page.waitForTimeout(800);
  await page.screenshot({path: out});
} finally {
  await browser.close();
}

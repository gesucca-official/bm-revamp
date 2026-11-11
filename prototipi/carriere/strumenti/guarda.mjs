// Cattura veloce di una schermata dal server di sviluppo, per lavorare (non fa parte delle verifiche).
// node strumenti/guarda.mjs <uscita.png> <larghezza> <altezza> [elenco|inizio|meta] [x,y,larghezza,altezza]
//   inizio: la mappa della prova all'inizio; meta: dopo un giro con Mara e la sconfitta in cucina del secondo giro.
//   Con il ritaglio la cattura è ingrandita due volte.
import {chromium} from '@playwright/test';

const [out, w, h, cosa = 'meta', ritaglio] = process.argv.slice(2);
const browser = await chromium.launch({channel: 'msedge'});
try {
  const page = await browser.newPage({viewport: {width: Number(w), height: Number(h)}, deviceScaleFactor: ritaglio ? 2 : 1});
  const tid = id => page.getByTestId(id);
  await page.goto('http://127.0.0.1:4330/');
  if (cosa !== 'elenco') {
    await tid(cosa === 'tutorial' ? 'apri-tutorial' : 'apri-prova').click();
    if (cosa === 'meta') {
      const continua = () => tid('mappa-continua').click();
      await continua(); await tid('salta').click(); await tid('opzione-0').click();
      await continua(); await tid('salta').click(); await tid('vinci').click();
      await continua(); await tid('salta').click(); await tid('vinci').click(); await tid('opzione-0').click();
      await continua(); await tid('salta').click();
      await tid('fine').getByRole('button', {name: 'Nuovo giro'}).click();
      await continua(); await tid('salta').click(); await tid('opzione-1').click();
      await continua(); await tid('salta').click(); await tid('perdi').click();
    }
    await tid('mappa').waitFor();
  }
  await page.waitForTimeout(800);
  const [x, y, width, height] = (ritaglio ?? '').split(',').map(Number);
  await page.screenshot({path: out, ...(ritaglio ? {clip: {x, y, width, height}} : {})});
} finally {
  await browser.close();
}

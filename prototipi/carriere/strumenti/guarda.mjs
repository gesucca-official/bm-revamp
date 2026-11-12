// Cattura veloce di una schermata dal server di sviluppo, per lavorare (non fa parte delle verifiche).
// node strumenti/guarda.mjs <uscita.png> <larghezza> <altezza> [elenco|inizio|tutorial|meta|fine] [x,y,larghezza,altezza]
//   inizio e tutorial: la mappa all'inizio; meta: dopo un giro con Mara e la sconfitta in cucina del secondo giro; fine: il secondo giro
//   finito alla porta aperta. Con il ritaglio la cattura è ingrandita due volte.
import {chromium} from '@playwright/test';

const [out, w, h, cosa = 'meta', ritaglio] = process.argv.slice(2);
const browser = await chromium.launch({channel: 'msedge'});
const scadenza = setTimeout(() => { console.error('guarda: tempo scaduto'); process.exit(1); }, 60_000);
try {
  const page = await browser.newPage({viewport: {width: Number(w), height: Number(h)}, deviceScaleFactor: ritaglio ? 2 : 1});
  page.setDefaultTimeout(8000);
  const tid = id => page.getByTestId(id);
  const continua = () => tid('mappa-continua').click();
  await page.goto('http://127.0.0.1:4330/');
  if (cosa !== 'elenco') {
    await tid(cosa === 'tutorial' ? 'apri-tutorial' : 'apri-prova').click();
    if (cosa === 'meta' || cosa === 'fine') {
      await continua(); await tid('salta').click(); await tid('opzione-0').click();
      await continua(); await tid('salta').click(); await tid('vinci').click();
      await continua(); await tid('salta').click(); await tid('vinci').click(); await tid('opzione-0').click();
      await continua(); await tid('salta').click();
      await tid('fine').getByRole('button', {name: 'Nuovo giro'}).click();
      await continua(); await tid('salta').click(); await tid('opzione-1').click();
      await continua(); await tid('salta').click(); await tid('perdi').click();
    }
    if (cosa === 'fine') {
      await continua(); await tid('salta').click();
      await continua(); await tid('salta').click(); await tid('vinci').click(); await tid('opzione-2').click();
      await continua(); await tid('salta').click();
      await tid('fine').getByRole('button', {name: 'Mappa'}).click();
    }
    await tid('mappa').waitFor();
  }
  await page.waitForTimeout(3600);  // le notifiche se ne vanno
  const [x, y, width, height] = (ritaglio ?? '').split(',').map(Number);
  await page.screenshot({path: out, ...(ritaglio ? {clip: {x, y, width, height}} : {})});
} finally {
  clearTimeout(scadenza);
  await browser.close();
}

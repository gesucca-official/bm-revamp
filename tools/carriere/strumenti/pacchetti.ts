// CA-0d: scrive i pacchetti in tools/carriere/pacchetti/<id>.json (con ./run.ps1 -Task Package). Rifiuta di scrivere se una storia o il
// cast che usa sono cambiati senza alzare la versione in carriere.json. Esce con 1 se qualcosa non va, senza scrivere niente.
import fs from 'node:fs';
import {leggiCast, leggiManifest, radice} from '../src/serbatoio.ts';
import {esaminaPacchetti} from '../src/pacchetti.ts';
import {fontiDisco, CARTELLA_PACCHETTI} from './fonti.ts';

const {errori, scritture} = esaminaPacchetti(fontiDisco(leggiManifest(), leggiCast()), false);
if (errori.length) { console.error(errori.map(e => `ERRORE ${e}`).join('\n')); process.exit(1); }
const cartella = new URL(CARTELLA_PACCHETTI, radice);
fs.mkdirSync(cartella, {recursive: true});
for (const [id, testo] of Object.entries(scritture)) {
  const file = new URL(`${id}.json`, cartella);
  const uguale = fs.existsSync(file) && fs.readFileSync(file, 'utf8') === testo;
  if (!uguale) fs.writeFileSync(file, testo, {encoding: 'utf8'});
  console.log(`${id}: ${uguale ? 'invariato' : 'scritto'} (${CARTELLA_PACCHETTI}${id}.json)`);
}

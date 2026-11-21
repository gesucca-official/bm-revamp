// Convertitore da riga di comando (CA-0a). Dalla cartella del prototipo, con il Node di client-web:
//   node --experimental-strip-types strumenti/converti.ts --tutti
//       converte le carriere del prototipo (sotto, CARRIERE) in dati/generati/<id>.json, con il controllo di validità
//   node --experimental-strip-types strumenti/converti.ts <storia.md> [--json <uscita.json>]
//       converte un solo file
// Esce con 1 se ci sono errori di conversione o di validità.
import fs from 'node:fs';
import {CARRIERE, leggiCast, convertiCarriera, riepilogoConversione, qui} from './carriere.ts';
import {converti} from '../../../tools/carriere/src/converti.ts';
import {valida} from '../../../tools/carriere/src/valida.ts';
import type {Carriera, Problema} from '../../../tools/carriere/src/formato.ts';

const args = process.argv.slice(2);
const cast = leggiCast();
let rosso = false;

const riepilogo = (c: Carriera, problemi: Problema[], validita: string[]) => {
  const r = riepilogoConversione(c, problemi, validita);
  console.log(r.righe.join('\n'));
  if (r.errori) rosso = true;
};

if (args.includes('--tutti')) {
  const dir = new URL('dati/generati/', qui);
  fs.mkdirSync(dir, {recursive: true});
  for (const voce of CARRIERE) {
    const {carriera, problemi, validita} = convertiCarriera(voce, cast);
    riepilogo(carriera, problemi, validita);
    fs.writeFileSync(new URL(`${carriera.id}.json`, dir), JSON.stringify(carriera, null, 2) + '\n');
  }
} else {
  const uscita = args.indexOf('--json') >= 0 ? args[args.indexOf('--json') + 1] : undefined;  // senza --json non c'è nessun argomento da escludere
  const file = args.find(a => !a.startsWith('--') && a !== uscita);
  if (!file) { console.error('uso: converti.ts --tutti | <storia.md> [--json <uscita.json>]'); process.exit(2); }
  const md = fs.readFileSync(file, 'utf8');
  const {carriera, problemi} = converti(md, cast, file.replaceAll('\\', '/'));
  riepilogo(carriera, problemi, problemi.some(p => p.livello === 'errore') ? [] : valida(carriera, cast));
  if (args.includes('--json')) fs.writeFileSync(args[args.indexOf('--json') + 1], JSON.stringify(carriera, null, 2) + '\n');
}
process.exit(rosso ? 1 : 0);

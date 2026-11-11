// Convertitore da riga di comando (CA-0a). Dalla cartella del prototipo, con il Node di client-web:
//   node --experimental-strip-types strumenti/converti.ts --tutti
//       converte le carriere del prototipo (sotto, CARRIERE) in dati/generati/<id>.json, con il controllo di validità
//   node --experimental-strip-types strumenti/converti.ts <storia.md> [--json <uscita.json>]
//       converte un solo file
// Esce con 1 se ci sono errori di conversione o di validità.
import fs from 'node:fs';
import {CARRIERE, leggiCast, convertiCarriera, qui} from './carriere.ts';
import {converti} from '../src/converti.ts';
import {valida} from '../src/valida.ts';
import type {Carriera, Problema} from '../src/formato.ts';

const args = process.argv.slice(2);
const cast = leggiCast();
let rosso = false;

const riepilogo = (c: Carriera, problemi: Problema[], validita: string[]) => {
  for (const p of problemi) console.log(`  ${p.livello === 'errore' ? 'ERRORE' : 'avviso'} riga ${p.riga}: ${p.messaggio}`);
  for (const e of validita) console.log(`  ERRORE validità ${e}`);
  const passi = c.nodi.flatMap(n => n.passi);
  const conta = (t: string) => passi.filter(p => p.tipo === t).length;
  const ritento = passi.reduce((s, p) => s + (p.tipo === 'partita' ? p.ritento?.length ?? 0 : 0), 0);
  const errori = problemi.filter(p => p.livello === 'errore').length + validita.length;
  console.log(`${c.id}: ${c.nodi.length} nodi, ${conta('battuta')} battute, ${ritento} di ritento, ${conta('partita')} partite, ` +
    `${conta('scelta')} scelte, ${conta('regia')} note di regia, ${c.achievement.length} achievement; ` +
    `${errori} errori, ${problemi.filter(p => p.livello === 'avviso').length} avvisi`);
  if (errori) rosso = true;
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
  const file = args.find(a => !a.startsWith('--') && a !== args[args.indexOf('--json') + 1]);
  if (!file) { console.error('uso: converti.ts --tutti | <storia.md> [--json <uscita.json>]'); process.exit(2); }
  const md = fs.readFileSync(file, 'utf8');
  const {carriera, problemi} = converti(md, cast, file.replaceAll('\\', '/'));
  riepilogo(carriera, problemi, problemi.some(p => p.livello === 'errore') ? [] : valida(carriera, cast));
  if (args.includes('--json')) fs.writeFileSync(args[args.indexOf('--json') + 1], JSON.stringify(carriera, null, 2) + '\n');
}
process.exit(rosso ? 1 : 0);

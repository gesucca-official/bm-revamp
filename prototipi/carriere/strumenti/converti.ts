// Uso (dalla radice del repository, Node di client-web):
//   node --experimental-strip-types prototipi/carriere/strumenti/converti.ts <storia.md> [--integrazioni] [--json <uscita.json>]
// --integrazioni applica in memoria le righe proposte per tutorial-dialoghi.md (tests/integrazioni-tutorial.ts).
// Esce con 1 se ci sono errori.
import fs from 'node:fs';
import path from 'node:path';
import {converti} from '../src/converti.ts';
import {applicaIntegrazioni} from '../tests/integrazioni-tutorial.ts';
import type {Cast} from '../src/formato.ts';

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
if (!file) { console.error('manca il file markdown'); process.exit(2); }
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : undefined;
const cast = JSON.parse(fs.readFileSync(new URL('../dati/cast.json', import.meta.url), 'utf8')) as Cast;
let md = fs.readFileSync(file, 'utf8');
if (args.includes('--integrazioni')) md = applicaIntegrazioni(md);
const {carriera, problemi} = converti(md, cast, path.relative(process.cwd(), file).replaceAll('\\', '/'));

for (const p of problemi) console.log(`${p.livello === 'errore' ? 'ERRORE' : 'avviso'} riga ${p.riga}: ${p.messaggio}`);
const passi = carriera.nodi.flatMap(n => n.passi);
const conta = (t: string) => passi.filter(p => p.tipo === t).length;
const ritento = passi.reduce((s, p) => s + (p.tipo === 'partita' ? p.ritento?.length ?? 0 : 0), 0);
console.log(`\n${carriera.id}: ${carriera.nodi.length} nodi, ${conta('battuta')} battute, ${ritento} di ritento, ${conta('partita')} partite, ` +
  `${conta('scelta')} scelte, ${conta('regia')} note di regia, ${carriera.achievement.length} achievement; ` +
  `${problemi.filter(p => p.livello === 'errore').length} errori, ${problemi.filter(p => p.livello === 'avviso').length} avvisi`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(carriera, null, 2) + '\n');
process.exit(problemi.some(p => p.livello === 'errore') ? 1 : 0);

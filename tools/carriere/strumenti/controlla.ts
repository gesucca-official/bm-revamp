// Il controllo delle carriere (CA-0c): converte e controlla ogni storia del serbatoio (docs/design/carriere/*-dialoghi.md e la storia di
// prova del prototipo) contro il cast, come check-rules.py per le carte. Per storia stampa nodi, stati, finali, errori e avvisi.
//   node --experimental-strip-types strumenti/controlla.ts      (dalla cartella dello strumento; con ./run.ps1 -Task Check)
// Esce con 1 se c'è un errore di conversione, di validità o di grafo, o un pacchetto (CA-0d) fuori data.
import {CARRIERE, convertiCarriera, leggiCast, riepilogoConversione, riepilogoGrafo} from '../src/serbatoio.ts';
import {controllaGrafo} from '../src/grafo.ts';
import {esaminaPacchetti} from '../src/pacchetti.ts';
import {fontiDisco} from './fonti.ts';
import {leggiManifest} from '../src/serbatoio.ts';

const cast = leggiCast();
let rosso = false;
for (const v of CARRIERE) {
  const {carriera, problemi, validita} = convertiCarriera(v, cast);
  const conv = riepilogoConversione(carriera, problemi, validita);
  console.log(conv.righe.join('\n'));
  if (conv.errori) { rosso = true; continue; }
  const r = controllaGrafo(carriera);
  console.log(riepilogoGrafo(carriera, r).join('\n'));
  if (r.errori.length) rosso = true;
}
// I pacchetti committati contro le storie e il cast (sola lettura): fuori data, mancanti, in più, o versione non alzata.
const {errori: erroriPacchetti} = esaminaPacchetti(fontiDisco(leggiManifest(), cast));
for (const e of erroriPacchetti) console.log(`  ERRORE pacchetto ${e}`);
console.log(`pacchetti: ${CARRIERE.length} nel manifest, ${erroriPacchetti.length} errori`);
if (erroriPacchetti.length) rosso = true;
process.exit(rosso ? 1 : 0);

// Il controllo delle carriere (CA-0c): converte e controlla ogni storia del serbatoio (docs/design/carriere/*-dialoghi.md e la storia di
// prova del prototipo) contro il cast, come check-rules.py per le carte. Per storia stampa nodi, stati, finali, errori e avvisi.
//   node --experimental-strip-types strumenti/controlla.ts      (dalla cartella dello strumento; con ./run.ps1 -Task Check)
// Esce con 1 se c'è un errore di conversione, di validità o di grafo.
import {CARRIERE, convertiCarriera, leggiCast, riepilogoConversione, riepilogoGrafo} from '../src/serbatoio.ts';
import {controllaGrafo} from '../src/grafo.ts';

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
process.exit(rosso ? 1 : 0);

// Controllo del grafo delle carriere del prototipo (CA-0a, punto 7 del perimetro), come check-rules.py per le carte.
// node --experimental-strip-types strumenti/controlla.ts   (dalla cartella del prototipo; esce con 1 se ci sono errori)
import {CARRIERE, convertiCarriera, leggiCast} from './carriere.ts';
import {controllaGrafo} from '../src/grafo.ts';

const cast = leggiCast();
let rosso = false;
for (const voce of CARRIERE) {
  const {carriera, problemi, validita} = convertiCarriera(voce, cast);
  const conversione = problemi.filter(p => p.livello === 'errore').length + validita.length;
  if (conversione) { console.log(`${carriera.id}: ${conversione} errori di conversione o validità (vedi Convert)`); rosso = true; continue; }
  const r = controllaGrafo(carriera);
  for (const e of r.errori) console.log(`  ERRORE ${e}`);
  for (const a of r.avvisi) console.log(`  avviso ${a}`);
  const segreti = Object.entries(r.segreti).map(([s, da]) => `${s} (da ${da.join(', ') || 'nessuno'})`).join('; ') || 'nessuno';
  console.log(`${carriera.id}: ${r.raggiunti.length}/${carriera.nodi.length} nodi raggiunti, ${r.stati} stati, fini completate ${r.fini.completata} e fallite ` +
    `${r.fini.fallita}, segreti: ${segreti}, obbligatori: ${carriera.obbligatori.join(', ') || 'nessuno'}; ${r.errori.length} errori, ${r.avvisi.length} avvisi`);
  if (r.errori.length) rosso = true;
}
process.exit(rosso ? 1 : 0);

// Mockup della principale: i numeri per giro di ogni carriera del prototipo (percorsi, nodi con partita minimi e massimi, punto del PvP).
// node --experimental-strip-types strumenti/percorsi.ts [--elenco]   (dalla cartella del prototipo)
import {CARRIERE, convertiCarriera, leggiCast} from './carriere.ts';
import {numeri, percorsi, type Percorso} from '../src/percorsi.ts';
import {nuovoAccount} from '../src/motore.ts';

const cast = leggiCast();
const elenco = process.argv.includes('--elenco');
const riga = (p: Percorso) => `  ${p.partite.length} partite${p.catene ? ` (${p.duelli} duelli di catena)` : ''}: ${p.nodi.join(' → ')} ⇒ ${p.finale}${p.pvp ? ` (PvP con la partita ${p.pvp})` : ''}`;
for (const voce of CARRIERE) {
  const {carriera: c} = convertiCarriera(voce, cast);
  // Il primo giro, e un giro dopo aver visto tutti i finali (con i nodi che compaiono solo dopo, come la rivincita di Sergio).
  const dopo = {...nuovoAccount(), finali: [...new Set(c.nodi.flatMap(() => []))], giri: 1};
  const primo = percorsi(c);
  dopo.finali = [...new Set(primo.map(p => p.finale))];
  dopo.esplorati = [...new Set(primo.flatMap(p => p.nodi))];
  const poi = percorsi(c, dopo);
  for (const [nome, ps] of [['primo giro', primo], ['dopo tutti i finali', poi]] as const) {
    const n = numeri(ps);
    const pvp = ps.some(p => p.pvp !== null) ? `, PvP al più tardi al ${Math.round(n.pvpPiuTardi * 100)}% delle partite del giro (${n.pvpPrimaDiMeta ? 'sempre' : 'NON sempre'} prima di metà)` : '';
    // Una partita a catena conta come un nodo con partita; i suoi duelli si contano a parte (da uno, perdendo il primo, a tutti quelli della catena).
    const catene = ps.some(p => p.catene) ? `; duelli di catena da ${n.duelliMinimo} a ${n.duelliMassimo}, partite con i duelli da ${n.conDuelliMinimo} a ${n.conDuelliMassimo}` : '';
    console.log(`${c.id}, ${nome}: ${n.percorsi} percorsi, nodi con partita da ${n.minimo} a ${n.massimo}${catene}${pvp}`);
    if (elenco) for (const p of ps) console.log(riga(p));
  }
}

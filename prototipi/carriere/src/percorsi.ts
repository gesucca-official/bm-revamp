// Mockup della principale (14 novembre 2026): tutti i percorsi di un giro, giocati con il motore, e i loro numeri. Serve a rispondere a
// domande che il controllo del grafo non misura: quanti nodi con partita ha ogni percorso (minimo e massimo), e in che punto del giro arriva
// il PvP (lo sblocco «pvp»: deve stare prima di metà di ogni giro). Le partite si vincono, salvo dove una sconfitta apre un ramo: lì si
// provano tutte e due. Le scelte si provano tutte; le scelte «a scelta» che non cambiano strada si contano una volta sola.
import type {Carriera} from './formato.ts';
import {statiMappa} from './mappa.ts';
import {entra, nuovoAccount, nuovoGiro, perdi, salta, scegli, scegliGiocatore, vinci, vista, type Account, type Stato} from './motore.ts';

export type Percorso = {
  nodi: string[];           // i nodi del giro, in ordine
  partite: string[];        // i nodi con una partita giocata (ritenti esclusi), in ordine
  finale: string;           // il finale raggiunto
  sblocchi: string[];       // gli sblocchi dell'account alla fine del giro
  pvp: number | null;       // dopo quante partite arriva lo sblocco «pvp» (1 = con la prima), o null
};

/**
 * Gioca ogni percorso di un giro dall'account dato. `chiave` dei nodi già visti con gli stessi segni evita di ripercorrere le stesse strade
 * per le scelte che cambiano solo chi gioca; il risultato tiene un percorso per sequenza di nodi e finale.
 */
export function percorsi(c: Carriera, account: Account = nuovoAccount(), tetto = 5000): Percorso[] {
  const out = new Map<string, Percorso>();
  const giro = (s: Stato, nodi: string[], partite: string[], pvp: number | null): void => {
    if (out.size > tetto) throw new Error(`più di ${tetto} percorsi`);
    // Un nodo ripreso più di due volte (il ritorno alla scelta del tutorial) è un giro in tondo: lo si lascia.
    if (nodi.some(x => nodi.filter(y => y === x).length > 2)) return;
    const v = vista(c, s);
    if (v.tipo === 'fine') {
      const p: Percorso = {nodi, partite, finale: v.finale.id, sblocchi: [...s.account.sblocchi], pvp};
      out.set(`${nodi.join('>')}|${p.finale}`, p);
      return;
    }
    if (v.tipo === 'mappa') {
      const stati = statiMappa(c, s);
      const qui = c.nodi.filter(n => stati[n.id]?.stato === 'disponibile').map(n => n.id);
      for (const id of qui) giro(entra(c, s, id).stato, [...nodi, id], partite, pvp);
      return;
    }
    if (v.tipo === 'scelta') {
      // Le opzioni che portano nello stesso posto con gli stessi segni letti si provano una volta sola.
      const viste = new Set<string>();
      let mutaPresa = false;
      for (const o of v.opzioni) {
        const k = JSON.stringify([o.opzione.verso ?? null]);
        // Fra le opzioni senza destinazione (prima della 0.3: chi gioca) basta la prima; quelle con destinazione si provano tutte.
        const muta = !o.opzione.verso;
        if (muta && mutaPresa) continue;
        if (muta) mutaPresa = true;
        if (!muta && viste.has(k + JSON.stringify(o.opzione.segni ?? {}))) continue;
        viste.add(k + JSON.stringify(o.opzione.segni ?? {}));
        giro(scegli(c, s, o.indice).stato, nodi, partite, pvp);
      }
      return;
    }
    if (v.tipo === 'partita') {
      // Una partita «a scelta»: chi gioca non cambia la strada, basta il primo.
      if (v.giocatore === null) return giro(scegliGiocatore(c, s, v.aScelta![0]).stato, nodi, partite, pvp);
      const qui = [...partite, s.giro.nodo!];
      const dopo = vinci(c, s).stato;
      const conPvp = pvp ?? (dopo.account.sblocchi.includes('pvp') && !s.account.sblocchi.includes('pvp') ? qui.length : null);
      giro(dopo, nodi, qui, conPvp);
      if (v.partita.sconfitta) giro(perdi(c, s).stato, nodi, qui, pvp);
      return;
    }
    giro(salta(c, s).stato, nodi, partite, pvp);
  };
  const s0 = nuovoGiro(c, structuredClone(account));
  // Lo sblocco «pvp» preso in un giro precedente non conta: si misura in ogni giro, togliendolo dall'account di partenza.
  s0.account.sblocchi = s0.account.sblocchi.filter(x => x !== 'pvp');
  giro(s0, [], [], null);
  return [...out.values()];
}

/** I numeri di un insieme di percorsi: quanti, partite minime e massime, il PvP più tardi rispetto alla metà del giro. */
export function numeri(ps: Percorso[]) {
  const n = ps.map(p => p.partite.length);
  const pvp = ps.map(p => (p.pvp === null ? Infinity : p.pvp / p.partite.length));
  return {percorsi: ps.length, minimo: Math.min(...n), massimo: Math.max(...n), pvpPiuTardi: Math.max(...pvp),
    pvpPrimaDiMeta: ps.every(p => p.pvp !== null && p.pvp <= p.partite.length / 2)};
}

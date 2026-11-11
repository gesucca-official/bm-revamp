// CA-0a: la mappa dei rami. Archi, disposizione a colonne e stato di ogni nodo per il giro e l'account correnti.
import type {Carriera, Destinazione} from './formato.ts';
import {entrabile, type Stato} from './motore.ts';

export type Arco = {da: string; a: string; tipo: 'uscita' | 'scelta' | 'sconfitta'; indietro: boolean};

/** Archi fra nodi (le fini non sono nodi della mappa). */
export function archi(c: Carriera): Arco[] {
  const out: Omit<Arco, 'indietro'>[] = [];
  const verso = (da: string, d: Destinazione | undefined, tipo: Arco['tipo']) => { if (d && 'nodo' in d) out.push({da, a: d.nodo, tipo}); };
  for (const n of c.nodi) {
    for (const p of n.passi) {
      if (p.tipo === 'partita') verso(n.id, p.sconfitta, 'sconfitta');
      if (p.tipo === 'scelta') for (const o of p.opzioni) verso(n.id, o.verso, 'scelta');
    }
    if ('verso' in n.uscita) verso(n.id, n.uscita.verso, 'uscita');
  }
  // Archi all'indietro (il ritorno alla scelta dell'epilogo): quelli che in una visita in profondità tornano a un nodo aperto.
  const indietro = new Set<string>();
  const colore = new Map<string, 'aperto' | 'chiuso'>();
  const visita = (id: string) => {
    colore.set(id, 'aperto');
    for (const a of out.filter(x => x.da === id)) {
      if (colore.get(a.a) === 'aperto') indietro.add(`${a.da}>${a.a}`);
      else if (!colore.has(a.a)) visita(a.a);
    }
    colore.set(id, 'chiuso');
  };
  visita(c.inizio);
  return out.map(a => ({...a, indietro: indietro.has(`${a.da}>${a.a}`)}));
}

/** Colonna = il percorso più lungo dall'inizio senza archi all'indietro; riga = ordine nel file dentro la colonna. */
export function disposizione(c: Carriera): {posizione: Record<string, {colonna: number; riga: number}>; colonne: number; righe: number} {
  const avanti = archi(c).filter(a => !a.indietro);
  const colonna: Record<string, number> = {[c.inizio]: 0};
  for (let cambiato = true, giri = 0; cambiato && giri < c.nodi.length + 1; giri++) {
    cambiato = false;
    for (const a of avanti) if (colonna[a.da] !== undefined && (colonna[a.a] ?? -1) < colonna[a.da] + 1) { colonna[a.a] = colonna[a.da] + 1; cambiato = true; }
  }
  // Riga: quella del primo predecessore già posato, se libera nella colonna; altrimenti la libera più vicina. Così un ramo resta
  // sulla sua riga (C → E) invece di attraversare gli altri.
  const posizione: Record<string, {colonna: number; riga: number}> = {};
  const occupate = new Map<number, Set<number>>();
  const ordine = [...c.nodi].sort((a, b) => (colonna[a.id] ?? 0) - (colonna[b.id] ?? 0));
  for (const n of ordine) {
    const col = colonna[n.id] ?? 0;
    const usate = occupate.get(col) ?? occupate.set(col, new Set()).get(col)!;
    const pred = avanti.filter(a => a.a === n.id && posizione[a.da]).map(a => posizione[a.da].riga);
    const voluta = pred.length ? Math.min(...pred) : 0;
    const candidate = [voluta];
    for (let d = 1; d <= c.nodi.length; d++) { candidate.push(voluta + d); if (voluta - d >= 0) candidate.push(voluta - d); }
    const riga = candidate.find(r => !usate.has(r))!;
    usate.add(riga);
    posizione[n.id] = {colonna: col, riga};
  }
  const righe = Math.max(...Object.values(posizione).map(p => p.riga)) + 1;
  return {posizione, colonne: Math.max(...Object.values(colonna)) + 1, righe};
}

export type StatoNodo =
  | 'corrente'     // ci si trova adesso
  | 'disponibile'  // acceso: ci si entra toccandolo
  | 'bloccato'     // raggiunto, ma la sua condizione non vale
  | 'fatto'        // visto in questo giro
  | 'aperto'       // ancora raggiungibile in questo giro
  | 'escluso'      // una scelta l'ha chiuso in questo giro
  | 'nascosto';    // segreto mai visto: non si disegna

export type NodoMappa = {stato: StatoNodo; noto: boolean};  // noto: titolo visibile (visto in un giro qualsiasi), altrimenti «???»

export function statiMappa(c: Carriera, s: Stato): Record<string, NodoMappa> {
  const g = s.giro;
  const tutti = archi(c);
  const raggiungibili = new Set<string>();
  if (!g.fine) {
    const coda = [...(g.nodo ? [g.nodo] : []), ...g.prossimi.flatMap(d => 'nodo' in d ? [d.nodo] : [])];
    for (const x of coda) raggiungibili.add(x);
    while (coda.length) { const x = coda.shift()!; for (const a of tutti) if (a.da === x && !raggiungibili.has(a.a)) { raggiungibili.add(a.a); coda.push(a.a); } }
  }
  const out: Record<string, NodoMappa> = {};
  for (const n of c.nodi) {
    const noto = s.account.esplorati.includes(n.id);
    let stato: StatoNodo;
    const prossimo = g.prossimi.some(d => 'nodo' in d && d.nodo === n.id);
    // Un segreto mai visto non si disegna, finché il giro non ci porta proprio lì.
    if (n.segreto && !noto && !prossimo && g.nodo !== n.id) stato = 'nascosto';
    else if (g.nodo === n.id) stato = 'corrente';
    else if (prossimo) stato = entrabile(c, s, n.id) ? 'disponibile' : 'bloccato';
    else if (g.visti.includes(n.id)) stato = 'fatto';
    else stato = raggiungibili.has(n.id) ? 'aperto' : 'escluso';
    out[n.id] = {stato, noto};
  }
  return out;
}

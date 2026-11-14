// CA-0a: la mappa dei rami. Archi, disposizione a colonne e stato di ogni casella per il giro e l'account correnti.
// Le caselle sono i nodi e i finali (P7): un finale è una casella «fine:<id>», «???» finché non lo si è visto in un giro.
import {usciteDi, type Carriera, type Destinazione} from './formato.ts';
import {entrabile, finali, idFinale, valuta, type Stato} from './motore.ts';

export type Arco = {da: string; a: string; tipo: 'uscita' | 'scelta' | 'sconfitta'; indietro: boolean};
export type Casella = {id: string; etichetta: string; titolo: string; segreto?: true; fine?: true};

export const idCasellaFine = (id: string) => `fine:${id}`;

export function caselle(c: Carriera): Casella[] {
  return [
    ...c.nodi.map(n => ({id: n.id, etichetta: n.etichetta, titolo: n.titolo || n.etichetta, ...(n.segreto ? {segreto: true as const} : {})})),
    ...finali(c).map(f => ({id: idCasellaFine(f.id), etichetta: f.esito === 'completata' ? 'Fine' : 'Fine (fallita)', titolo: f.titolo, fine: true as const})),
  ];
}

/** Archi fra caselle: nodi e finali. */
export function archi(c: Carriera): Arco[] {
  const out: Omit<Arco, 'indietro'>[] = [];
  const verso = (da: string, d: Destinazione | undefined, tipo: Arco['tipo']) => {
    if (!d) return;
    out.push({da, a: 'nodo' in d ? d.nodo : idCasellaFine(idFinale(d)), tipo});
  };
  for (const n of c.nodi) {
    for (const p of n.passi) {
      if (p.tipo === 'partita') verso(n.id, p.sconfitta, 'sconfitta');
      if (p.tipo === 'scelta') for (const o of p.opzioni) verso(n.id, o.verso, 'scelta');
    }
    for (const u of usciteDi(n)) verso(n.id, u.verso, 'uscita');
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

/** Colonna = il percorso più lungo dall'inizio senza archi all'indietro; riga = quella del predecessore, se libera. */
export function disposizione(c: Carriera): {posizione: Record<string, {colonna: number; riga: number}>; colonne: number; righe: number} {
  const avanti = archi(c).filter(a => !a.indietro);
  const tutte = caselle(c);
  const colonna: Record<string, number> = {[c.inizio]: 0};
  for (let cambiato = true, giri = 0; cambiato && giri < tutte.length + 1; giri++) {
    cambiato = false;
    for (const a of avanti) if (colonna[a.da] !== undefined && (colonna[a.a] ?? -1) < colonna[a.da] + 1) { colonna[a.a] = colonna[a.da] + 1; cambiato = true; }
  }
  // Riga: quella del primo predecessore già posato, se libera nella colonna; altrimenti la libera più vicina. Così un ramo resta
  // sulla sua riga (C → E) invece di attraversare gli altri.
  const posizione: Record<string, {colonna: number; riga: number}> = {};
  const occupate = new Map<number, Set<number>>();
  const ordine = [...tutte].sort((a, b) => (colonna[a.id] ?? 0) - (colonna[b.id] ?? 0));
  for (const n of ordine) {
    const col = colonna[n.id] ?? 0;
    const usate = occupate.get(col) ?? occupate.set(col, new Set()).get(col)!;
    const pred = avanti.filter(a => a.a === n.id && posizione[a.da]).map(a => posizione[a.da].riga);
    const voluta = pred.length ? Math.min(...pred) : 0;
    const candidate = [voluta];
    for (let d = 1; d <= tutte.length; d++) { candidate.push(voluta + d); if (voluta - d >= 0) candidate.push(voluta - d); }
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
  | 'fatto'        // visto in questo giro (per un finale: quello raggiunto)
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
  for (const f of finali(c)) {
    const id = idCasellaFine(f.id);
    out[id] = {noto: s.account.finali.includes(f.id), stato: g.fine && g.finale === f.id ? 'fatto' : raggiungibili.has(id) ? 'aperto' : 'escluso'};
  }
  for (const n of c.nodi) {
    const noto = s.account.esplorati.includes(n.id);
    let stato: StatoNodo;
    const prossimo = g.prossimi.some(d => 'nodo' in d && d.nodo === n.id);
    // Un segreto mai visto non si disegna, finché il giro non ci porta proprio lì. Mockup della principale: un segreto con la sua
    // condizione ([Nodo: segreto; se …]) compare quando la condizione vale (S2, la rivincita di Sergio, dopo aver visto il finale F1).
    if (n.segreto && !noto && !prossimo && g.nodo !== n.id && !(n.condizione && valuta(n.condizione, s))) stato = 'nascosto';
    else if (g.nodo === n.id) stato = 'corrente';
    else if (prossimo) stato = entrabile(c, s, n.id) ? 'disponibile' : 'bloccato';
    else if (g.visti.includes(n.id)) stato = 'fatto';
    else stato = raggiungibili.has(n.id) ? 'aperto' : 'escluso';
    out[n.id] = {stato, noto};
  }
  return out;
}

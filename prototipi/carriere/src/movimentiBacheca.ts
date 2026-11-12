// CA-0a, Fase G: la bacheca si muove (prototipo.md, «Fase G»). Funzioni pure del tempo e dei dati: le usa la bacheca a ogni fotogramma e
// le provano le prove. Quattro movimenti, tutti piccoli: le cordicelle che penzolano oscillano, una lettera allentata tremola e cade (e il
// giocatore la rimette a posto trascinandola), la puntina «sei qui» viaggia al nodo nuovo, il post-it di un nodo appena scoperto si stacca.
import {caso, pendenza, type Pt, type Punto} from './bacheca.ts';

/** I tempi, in secondi dell'orologio della bacheca (che si ferma mentre si legge un cartoncino o la legenda). */
export const TEMPI = {
  postit: 0.5,        // quando comincia a staccarsi il post-it di un nodo appena scoperto
  staccoPostit: 1.5,  // quanto dura: si stacca, cade, sparisce
  viaggio: 1.0,       // quando parte la puntina «sei qui» (dopo il post-it, se c'è)
  durataViaggio: 1.1,
  allenta: 4,         // quanto la bacheca resta ferma prima che una lettera cominci a tremolare
  tremolio: 2.4,
  caduta: 0.9,
  rientro: 0.3,       // la lettera lasciata vicino al suo posto ci torna
};

// ---------------------------------------------------------------------------------------------------------------------------------
// Cordicelle

/** Quanto si sposta di lato il punto più basso di una cordicella che oscilla, in pixel: niente se è tesa, di più se pende di più. */
export function ampiezzaFilo(tipo: 'tesa' | 'lenta' | 'arrotolata', lunghezza: number): number {
  if (tipo === 'tesa') return 0;
  if (tipo === 'arrotolata') return 0;  // la coda dell'arrotolata dondola a parte (angoloCoda)
  return Math.min(9, 1.5 + pendenza(lunghezza, tipo) * 0.12);
}

/** L'oscillazione lenta di una cordicella (fra -1 e 1), ognuna con il suo periodo e la sua fase, come per la corrente della porta. */
export function oscillazione(t: number, seme: string): number {
  return oscillazioneDi(t, ritmo(seme));
}
/** Il periodo e la fase di una cordicella, dai dati: si calcolano una volta, non a ogni fotogramma. */
export function ritmo(seme: string): {periodo: number; fase: number} {
  const r = caso(seme);
  return {periodo: 3.2 + r() * 1.8, fase: r() * Math.PI * 2};
}
export const oscillazioneDi = (t: number, {periodo, fase}: {periodo: number; fase: number}) =>
  0.85 * Math.sin((2 * Math.PI * t) / periodo + fase) + 0.15 * Math.sin((2 * Math.PI * t) / (periodo * 0.43) + fase * 1.7);

/** Quanto si agitano di più dopo un colpo (un tocco sul feltro, la puntina che si sposta): il triplo, che si spegne in un paio di secondi. */
export function agitazione(daColpo: number | null): number {
  if (daColpo === null || daColpo < 0) return 1;
  return 1 + 2 * Math.exp(-daColpo * 1.6);
}

/** I punti di una cordicella spostati di lato di `dx` al centro (il distacco dal feltro: 0 agli spilli, 1 a metà); si alza un poco. */
export function filoMosso(punti: Pt[], distacco: number[], dx: number): Pt[] {
  return punti.map((q, i) => ({x: q.x + dx * distacco[i], y: q.y - Math.abs(dx) * 0.15 * distacco[i] * distacco[i]}));
}

/** La coda di una cordicella arrotolata dondola attorno allo spillo, in gradi. */
export const angoloCoda = (t: number, seme: string, agita = 1) => 4 * agita * oscillazione(t, seme + ':coda');
/** Ogni quanto si ridisegnano le cordicelle, in secondi: un dondolio lento non ha bisogno di sessanta fotogrammi al secondo (Fase G, costo). */
export const PASSO_CORDICELLE = 1 / 30;

// ---------------------------------------------------------------------------------------------------------------------------------
// La puntina «sei qui» che viaggia

const liscia = (t: number) => t * t * (3 - 2 * t);

/**
 * Dove sta la puntina al momento t (0–1) del viaggio da `da` ad `a`: si stacca, sale un poco (alza, 0–1: la sua ombra si allontana), passa
 * sopra il feltro su un arco e si ripianta con un piccolo colpo (scala sotto 1 per un attimo, poi 1).
 */
export function viaggio(t: number, da: Pt, a: Pt): {x: number; y: number; alza: number; scala: number} {
  const u = Math.min(1, Math.max(0, t));
  const s = liscia(u), l = Math.hypot(a.x - da.x, a.y - da.y);
  const arco = Math.sin(Math.PI * s) * Math.min(60, l * 0.18);
  const alza = Math.sin(Math.PI * Math.min(1, u * 1.15));
  // Il colpo: negli ultimi istanti la puntina si schiaccia un poco piantandosi.
  const colpo = u > 0.85 ? Math.sin(((u - 0.85) / 0.15) * Math.PI) * 0.12 : 0;
  return {x: da.x + (a.x - da.x) * s, y: da.y + (a.y - da.y) * s - arco, alza: u >= 1 ? 0 : alza, scala: 1 + 0.18 * alza - colpo};
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Il post-it che si stacca

/**
 * Il post-it di un nodo appena scoperto, t secondi dopo che comincia a staccarsi: prima si piega ruotando attorno alla puntina, poi cade
 * per gravità verso il fondo della cornice (`fondo`: quanto scendere, in pixel) e sparisce.
 */
export function staccoPostit(t: number, fondo: number): {dy: number; ruota: number; opacita: number} {
  if (t <= 0) return {dy: 0, ruota: 0, opacita: 1};
  const piega = Math.min(t / 0.35, 1);
  const ruota = 14 * liscia(piega) + (t > 0.35 ? (t - 0.35) * 40 : 0);
  const giu = t > 0.35 ? Math.min(fondo, 0.5 * 2600 * (t - 0.35) ** 2) : 0;
  const opacita = t < TEMPI.staccoPostit - 0.35 ? 1 : Math.max(0, (TEMPI.staccoPostit - t) / 0.35);
  return {dy: giu, ruota, opacita};
}

/** I nodi scoperti dall'ultima volta che si è vista la bacheca: avevano il post-it e ora no. */
export const scoperti = (primaConPostit: string[], punti: Punto[]) =>
  punti.filter(n => !n.postit && primaConPostit.includes(n.id)).map(n => n.id);

// ---------------------------------------------------------------------------------------------------------------------------------
// La lettera allentata

/** Quale lettera: il nodo e la posizione fra le sue lettere che non sono spazi (non dipende da come il titolo va a capo). */
export type Allentata = {id: string; k: number};

/**
 * Se questa volta una lettera si allenta: al più una per volta (non se ce n'è già una caduta), una volta su due, decisa dai dati (lo stesso
 * giro alla stessa tappa dà sempre la stessa risposta).
 */
export function siAllenta(seme: string, giaCaduta: boolean): boolean {
  return !giaCaduta && caso(seme)() < 0.5;
}

/** Quale lettera si allenta: fra i titoli dei nodi visibili e non chiusi, decisa dai dati. null se non ce n'è nessuna. */
export function letteraAllentata(punti: Punto[], seme: string): Allentata | null {
  const candidate = punti.filter(n => n.tipo === 'nodo' && !n.postit && n.stato !== 'escluso')
    .flatMap(n => n.titolo.flat().filter(l => l.c.trim() && !l.manca).map((_, k) => ({id: n.id, k})));
  if (!candidate.length) return null;
  return candidate[Math.floor(caso(seme)() * candidate.length)];
}

/** Dove sta la lettera k fra le righe del titolo: riga e indice nella riga (contando gli spazi, come i tspan del disegno). */
export function trovaLettera(titolo: {c: string}[][], k: number): {riga: number; indice: number} | null {
  let n = 0;
  for (let riga = 0; riga < titolo.length; riga++) {
    for (let indice = 0; indice < titolo[riga].length; indice++) {
      if (!titolo[riga][indice].c.trim()) continue;
      if (n++ === k) return {riga, indice};
    }
  }
  return null;
}

/** Il tremolio prima di cadere, in gradi: cresce mentre la lettera si allenta, sempre più veloce. */
export function tremolio(t: number): number {
  if (t <= 0 || t >= TEMPI.tremolio) return 0;
  const cresce = t / TEMPI.tremolio;
  return (2 + 7 * cresce) * Math.sin(t * (14 + 10 * cresce));
}

/** La caduta, t secondi dopo che la lettera si stacca: giù per gravità fino al fondo, con un piccolo rimbalzo, girando su sé stessa. */
export function cadutaLettera(t: number, da: Pt, a: Pt, gira: number): {x: number; y: number; ruota: number} {
  const u = Math.min(1, Math.max(0, t / TEMPI.caduta));
  // Tre quarti del tempo per cadere (accelerando), l'ultimo quarto per un rimbalzo piccolo.
  const giu = u < 0.75 ? (u / 0.75) ** 2 : 1 - Math.sin(((u - 0.75) / 0.25) * Math.PI) * 0.06;
  return {x: da.x + (a.x - da.x) * liscia(u), y: da.y + (a.y - da.y) * giu, ruota: gira * liscia(u)};
}

/** La lettera trascinata vale rimessa a posto se la si lascia vicino al suo posto: entro un corpo di lettera. */
export const alPosto = (q: Pt, posto: Pt, raggio: number) => Math.hypot(q.x - posto.x, q.y - posto.y) <= raggio;

/**
 * Variante della regia, da confermare (spenta): un achievement nascosto per chi rimette a posto tutte le lettere cadute. «Tutte»: le
 * lettere cadono una alla volta, quindi conta quante ne ha rimesse; con `attivo` falso non si dà mai.
 */
export const PREMIO_LETTERE = {attivo: false, quante: 5, titolo: 'Tutte al loro posto'};
export const premioLettere = (rimesse: number, p = PREMIO_LETTERE) => p.attivo && rimesse === p.quante;

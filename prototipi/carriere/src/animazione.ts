// CA-0a, Fase E e F: ritratti animati senza un asset per fotogramma (prototipo.md). Funzioni pure del tempo: le usa il lettore a ogni
// fotogramma e le provano le prove. Due modi: «movimento» (trasformazioni dell'immagine intera) e «maglia» (l'immagine piegata con pochi
// punti di controllo). Fase F: il cast dice quale per personaggio ed espressione; il movimento è più morbido; la bocca si apre e si chiude.
import type {AnimazioneCast, Controlli, ModoAnimazione, ZonaBocca} from './formato.ts';
export type {Controlli} from './formato.ts';

/** L'interruttore: come dice il cast (predefinito), tutti fermi, tutti a movimento, tutti a maglia (per confrontare). */
export type Livello = 'cast' | 'fermo' | 'movimento' | 'maglia';
export const LIVELLI: {id: Livello; nome: string}[] = [
  {id: 'cast', nome: 'Come nel cast'}, {id: 'fermo', nome: 'Fermi'}, {id: 'movimento', nome: 'Tutti movimento'}, {id: 'maglia', nome: 'Tutti maglia'},
];

/** Il modo di un ritratto: fermo con il movimento ridotto o se scelto; altrimenti quello del livello o del cast (maglia solo con i punti). */
export function modo(livello: Livello, a: AnimazioneCast | undefined, espressione: string | undefined, ridotto: boolean): 'fermo' | ModoAnimazione {
  if (ridotto || livello === 'fermo') return 'fermo';
  const voluto: ModoAnimazione = livello === 'cast' ? (espressione && a?.espressioni?.[espressione]) || a?.modo || 'movimento' : livello;
  return voluto === 'maglia' && !a?.maglia ? 'movimento' : voluto;
}

/** Trasformazione del ritratto: spostamenti in frazioni dell'altezza del ritratto, rotazione in gradi, scale; l'origine è in basso al centro. */
export type Posa = {tx: number; ty: number; rot: number; sx: number; sy: number};
export const FERMA: Posa = {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1};

/** Numero pseudo-casuale fisso per un intero (gli scatti di Mara sono sempre gli stessi). */
const hash = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const onda = (t: number, periodo: number, fase = 0) => Math.sin((2 * Math.PI * t) / periodo + fase);

/**
 * Il movimento procedurale di un ritratto al tempo t (secondi), con lo schiacciamento e l'allungamento del fumetto:
 * - respiro: un lieve allungamento verticale, per tutti;
 * - sobbalzo a ogni parola mentre il testo scorre (`daParola`: secondi dall'ultima parola apparsa, null se il testo è fermo);
 * - ingresso con rimbalzo quando cambia chi parla o l'espressione (`daIngresso`: secondi dal cambio);
 * - un movimento per espressione: tremito per «furioso», ribollire per «fumante», ondeggiare lento per Piera «brilla», scatti per Mara «agitata»…
 */
export function movimento(espressione: string | undefined, t: number, daParola: number | null, daIngresso: number): Posa {
  const p: Posa = {...FERMA};
  // Respiro, con il volume che resta: se si allunga si stringe un poco.
  const r = onda(t, 3.4);
  p.sy += 0.008 * r; p.sx -= 0.003 * r;
  // Sobbalzo a ogni parola: un colpetto che si spegne in un decimo di secondo. Fase F: un terzo di prima («troppo rimbalzanti»).
  if (daParola !== null && daParola >= 0) {
    const b = Math.exp(-daParola * 10);
    p.ty -= 0.002 * b; p.sy += 0.007 * b; p.sx -= 0.004 * b;
  }
  // Ingresso: arriva un poco schiacciato e si assesta con un solo rimbalzo morbido (Fase F: prima schiacciato del 13% e tre rimbalzi).
  if (daIngresso >= 0) {
    // Smorzamento critico: passa una volta oltre (si allunga appena) e torna senza oscillare.
    const a = -0.05 * (1 - daIngresso * 8) * Math.exp(-daIngresso * 8);
    p.sy += a; p.sx -= a * 0.6;
    p.ty += 0.02 * Math.exp(-daIngresso * 8);
  }
  switch (espressione) {
    case 'furioso':  // tremito di rabbia, veloce e irregolare (Fase F: più piccolo)
      p.tx += 0.0018 * onda(t, 1 / 13, 1.3) + 0.001 * onda(t, 1 / 21);
      p.rot += 0.3 * onda(t, 1 / 9);
      break;
    case 'fumante': {  // rabbia che bolle: un gonfiarsi a scatti brevi
      const g = 0.006 * Math.max(0, onda(t, 0.7));
      p.sx += g; p.sy += g;
      break;
    }
    case 'brilla':  // ondeggiare lento da bicchiere di troppo
      p.rot += 2.2 * onda(t, 3);
      p.tx += 0.012 * onda(t, 3, 0.5);
      break;
    case 'assonnata':  // testa che cala piano
      p.rot += 1.2 * onda(t, 5);
      p.ty += 0.004 * (1 + onda(t, 5));
      break;
    case 'agitata': {  // scatti nervosi a intervalli fissi, ciascuno nella sua direzione (Fase F: più piccoli e arrotondati)
      const k = Math.floor(t / 0.8), locale = t - k * 0.8, dir = hash(k) < 0.5 ? -1 : 1;
      const e = Math.min(1, locale * 25) * Math.exp(-locale * 7);  // sale in 40 ms invece di uno scatto secco
      p.tx += dir * 0.005 * e; p.rot += dir * 0.7 * e;
      break;
    }
    case 'sospettosa':  // si sporge piano, guardando di traverso
      p.rot += -1.4 * (0.5 + 0.5 * onda(t, 4.5));
      break;
    case 'illuminata': {  // un saltello quando le viene l'idea, ogni due secondi
      const locale = t % 2, e = Math.exp(-locale * 9);
      p.ty -= 0.005 * e * Math.abs(Math.cos(locale * 6)); p.sy += 0.006 * e;
      break;
    }
    default: break;
  }
  return p;
}

/** La trasformazione CSS di una posa per un ritratto alto h pixel; l'origine (in basso al centro) la mette il foglio di stile. */
export const trasformazione = (p: Posa, h: number, base = '') =>
  `${base} translate(${(p.tx * h).toFixed(2)}px, ${(p.ty * h).toFixed(2)}px) rotate(${p.rot.toFixed(3)}deg) scale(${p.sx.toFixed(4)}, ${p.sy.toFixed(4)})`.trim();

// ---------------------------------------------------------------------------------------------------------------------------------
// Maglia: l'immagine si piega su una griglia di vertici. Pochi punti di controllo, in coordinate dell'immagine (0–1), scritti nel cast
// per personaggio (dati/cast.json, «animazione.maglia»): il perno del collo, la zona della testa (che annuisce e si inclina) e quella del
// busto (che respira). Valgono per tutte le espressioni del personaggio, che hanno la stessa inquadratura (specifica degli asset).

const lisca = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * Dove va un vertice (u, v) dell'immagine al tempo t. La testa ruota intorno al perno (annuisce quando parla, a ogni parola dà un cenno,
 * e si inclina piano); il busto si allarga e si alza un poco col respiro; il bordo basso e i punti lontani dalla testa non si muovono.
 */
export function deforma(u: number, v: number, t: number, parlando: boolean, daParola: number | null, c: Controlli): {u: number; v: number} {
  // Peso della testa: pieno sopra la quota «sopra», nullo sotto «sotto», e solo vicino all'asse della testa (le spalle restano ferme).
  const wv = 1 - lisca(c.testa.sopra, c.testa.sotto, v);
  const wu = 1 - lisca(c.testa.raggio * 0.75, c.testa.raggio * 1.25, Math.abs(u - c.testa.u));
  const wTesta = wv * wu;
  const cenno = daParola !== null && daParola >= 0 ? 3 * Math.exp(-daParola * 10) : 0;
  const gradi = (parlando ? 2.6 * onda(t, 1.3) : 1.1 * onda(t, 3)) + 1.8 * onda(t, 4.1, 0.7) + cenno;
  let x = u, y = v * c.aspetto;  // si ruota in pixel veri, non nelle coordinate stirate dell'immagine
  if (wTesta > 0) {
    const a = (gradi * wTesta * Math.PI) / 180, px = c.perno.u, py = c.perno.v * c.aspetto;
    const dx = x - px, dy = y - py;
    x = px + dx * Math.cos(a) - dy * Math.sin(a);
    y = py + dx * Math.sin(a) + dy * Math.cos(a);
  }
  // Respiro del busto: più largo al petto, nullo in fondo.
  const wBusto = lisca(c.busto.da - 0.06, c.busto.da + 0.06, v) * (1 - lisca(c.busto.a, 1, v));
  const r = onda(t, 3.4);
  x = 0.5 + (x - 0.5) * (1 + 0.014 * r * wBusto);
  y -= 0.008 * r * wBusto * c.aspetto;
  return {u: x, v: y / c.aspetto};
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Bocca (Fase F): il ritratto si alterna con la sua versione «-bocca» mentre il testo scorre.

/**
 * Quante volte al secondo la bocca si apre (e si chiude) mentre il testo scrive. Fase G, prova del proprietario: «si muovono troppo
 * velocemente»; prima sei, ora meno di due: circa tre cambi e mezzo al secondo, il ritmo delle parole più che delle sillabe.
 */
export const SILLABE_AL_SECONDO = 1.75;
/**
 * La bocca è nell'altra posizione (la versione «-bocca») al tempo t? Solo mentre il testo scrive, a mezzi periodi alterni; ferma su una
 * pausa (dopo virgola, punto, puntini) e quando il testo si ferma, così fra le frasi resta il ritratto approvato.
 */
export function boccaAltra(t: number, scrive: boolean, ultimo: string | undefined): boolean {
  if (!scrive || (ultimo !== undefined && /[.,;:!?…»—]/.test(ultimo))) return false;
  return Math.floor(t * SILLABE_AL_SECONDO * 2) % 2 === 0;
}

/**
 * Dove cambia la bocca: il riquadro dei punti diversi fra le due versioni, cercato solo dentro la zona del cast allargata di metà, su una
 * griglia di `w`×`h` valori di differenza (0–255). Così, se la seconda versione cambia anche altrove, si prende solo la bocca.
 * null se lì non cambia niente. Il risultato è un'ellisse in frazioni del ritratto, con un margine.
 */
export function zonaBocca(diff: ArrayLike<number>, w: number, h: number, z: ZonaBocca, soglia = 40): ZonaBocca | null {
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  const ru = z.ru * 1.5, rv = z.rv * 1.5;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = (x + 0.5) / w, v = (y + 0.5) / h;
    if (((u - z.u) / ru) ** 2 + ((v - z.v) / rv) ** 2 > 1 || diff[y * w + x] < soglia) continue;
    u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v);
  }
  if (u0 > u1) return null;
  // L'ellisse che contiene il riquadro (semiassi per √2), più un margine di mezza cella.
  return {u: (u0 + u1) / 2, v: (v0 + v1) / 2, ru: ((u1 - u0) / 2) * Math.SQRT2 + 1 / w, rv: ((v1 - v0) / 2) * Math.SQRT2 + 1 / h};
}

/**
 * Fase G: la versione «-bocca» è allineata al ritratto? Fuori dalla zona dove si cerca la bocca, dentro la sagoma, le due immagini devono
 * essere quasi uguali; se più dell'1% dei punti cambia (sulla griglia piccola), la seconda versione è spostata o ridimensionata (spazienzio-furioso, 1,5%; le altre al più 0,3%) e la bocca che
 * se ne prenderebbe non combacia: meglio non muoverla. `diff` è quella di `differenza` (0 fuori dalla sagoma).
 */
export function boccaAllineata(diff: ArrayLike<number>, w: number, h: number, z: ZonaBocca, soglia = 40, massimo = 0.01): boolean {
  const f = cambiatiFuoriBocca(diff, w, h, z, soglia);
  return f !== null && f <= massimo;
}
/** La frazione dei punti della sagoma, fuori dalla zona della bocca, che cambiano fra le due versioni (null se non ce ne sono). */
export function cambiatiFuoriBocca(diff: ArrayLike<number>, w: number, h: number, z: ZonaBocca, soglia = 40): number | null {
  let fuori = 0, cambiati = 0;
  const ru = z.ru * 1.5, rv = z.rv * 1.5;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = (x + 0.5) / w, v = (y + 0.5) / h;
    if (((u - z.u) / ru) ** 2 + ((v - z.v) / rv) ** 2 <= 1) continue;
    fuori++;
    if (diff[y * w + x] >= soglia) cambiati++;
  }
  return fuori > 0 ? cambiati / fuori : null;
}

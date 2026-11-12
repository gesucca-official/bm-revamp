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
/**
 * Fase I («le animazioni sulla testa che oscilla distorcono un po' troppo»): ampiezze della piega più piccole e un tetto morbido. Prima la
 * somma poteva superare i 7 gradi (ampiezze 2,6, 1,1, 1,8 e 3); ora resta sotto MASSIMO_TESTA. Il confronto con ?testa=larga è tolto nella
 * Fase K.
 */
export const MASSIMO_TESTA = 3;
export const AMPIEZZE_TESTA = {parla: 1.4, quieta: 0.7, deriva: 1.0, cenno: 1.6};
/** Quanto gira la testa, in gradi: la somma dei moti, con il tetto morbido (si avvicina a MASSIMO_TESTA senza superarlo). */
export function gradiTesta(t: number, parlando: boolean, daParola: number | null): number {
  const a = AMPIEZZE_TESTA;
  const cenno = daParola !== null && daParola >= 0 ? a.cenno * Math.exp(-daParola * 10) : 0;
  const g = (parlando ? a.parla * onda(t, 1.3) : a.quieta * onda(t, 3)) + a.deriva * onda(t, 4.1, 0.7) + cenno;
  return MASSIMO_TESTA * Math.tanh(g / MASSIMO_TESTA);
}

export function deforma(u: number, v: number, t: number, parlando: boolean, daParola: number | null, c: Controlli): {u: number; v: number} {
  // Peso della testa: pieno sopra la quota «sopra», nullo sotto «sotto», e solo vicino all'asse della testa (le spalle restano ferme).
  const wv = 1 - lisca(c.testa.sopra, c.testa.sotto, v);
  const wu = 1 - lisca(c.testa.raggio * 0.75, c.testa.raggio * 1.25, Math.abs(u - c.testa.u));
  const wTesta = wv * wu;
  const gradi = gradiTesta(t, parlando, daParola);
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

// ---------------------------------------------------------------------------------------------------------------------------------
// Entrate e uscite (Fasi H e J): i personaggi non compaiono più di colpo. Dalla Fase J solo di lato («dovrebbero arrivare di lato invece
// di comparire ingrandendosi»): via l'entrata da lontano, via il comando [Entrate: …], via le dissolvenze degli stacchi (chi ascolta ora
// entra di lato e resta a fianco di chi parla).

/** Quanto dura un'entrata o un'uscita, in secondi (al tempo normale: Piera, più lenta, ci mette di più). */
export const DURATA_ENTRATA = 0.45;
/** Come sta un ritratto mentre entra o esce: spostamento (in frazioni della sua larghezza e altezza), scala, sfocatura (px), opacità. */
export type Comparsa = {dx: number; dy: number; scala: number; sfoca: number; opacita: number};
export const IN_SCENA: Comparsa = {dx: 0, dy: 0, scala: 1, sfoca: 0, opacita: 1};

const esceCubica = (u: number) => 1 - (1 - u) ** 3;  // parte veloce e rallenta
const entraCubica = (u: number) => u ** 3;           // parte piano e accelera

/**
 * Il ritratto t secondi dopo l'inizio di un'entrata o di un'uscita, di lato: entra dal lato `lato` (+1 destra, −1 sinistra) e rallenta,
 * esce verso il lato `lato` accelerando.
 */
export function comparsa(verso: 'entra' | 'esce', t: number, lato: 1 | -1 = 1): Comparsa {
  const u = Math.min(1, Math.max(0, t / DURATA_ENTRATA));
  if (verso === 'entra' && u >= 1) return IN_SCENA;
  return verso === 'entra'
    ? {...IN_SCENA, dx: lato * 0.55 * (1 - esceCubica(u)), opacita: Math.min(1, u * 2.5)}
    : {...IN_SCENA, dx: lato * 0.45 * entraCubica(u), opacita: 1 - u};
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Due in scena (Fase J): «quando si intramezzano le altre persone mentre Piera parla lentamente, perché dobbiamo far sparire Piera?». Al più
// due posti: chi parla scivola a sinistra, chi ascolta entra da destra e gli resta a fianco finché dura la battuta, poi esce dal suo lato.
// Fase K: «meglio con sempre a fuoco chi parla»: chi parla è in piena luce e davanti; chi reagisce, «un po' più piccolo e defilato», è più
// scuro, dietro, più verso il bordo e con la testa più piccola di quella di chi parla (misurata sulla testa del cast, non sull'immagine:
// Mara, inquadrata più da vicino, sembrava più grande di Piera). Niente specchiature: i ritratti sono asimmetrici.

export type Posto = 'solo' | 'parla' | 'ascolta';
/** Dove sta un posto, in larghezze del ritratto rispetto al posto da solo. In verticale i due si sovrappongono un poco. */
export function spostamento(p: Posto, verticale: boolean): number {
  if (p === 'solo') return 0;
  if (p === 'parla') return verticale ? -0.2 : -0.28;
  return verticale ? 0.26 : 0.95;
}
/** Da che lato entra ed esce un posto: chi ascolta dal suo, a destra; chi parla da solo entra da destra ed esce a sinistra. */
export const latoDi = (p: Posto, verso: 'entra' | 'esce'): 1 | -1 => (p === 'ascolta' || verso === 'entra' ? 1 : -1);
/** Chi reagisce: la sua luce, e quanto è grande la sua testa rispetto a quella di chi parla. */
export const CHI_REAGISCE = {luce: 0.7, testa: 0.8};
/**
 * La scala del ritratto di chi reagisce, perché la sua testa sia l'80% di quella di chi parla. Le teste si misurano dal cast (il raggio della
 * testa nella maglia, in frazioni della larghezza del ritratto: tutti i ritratti hanno la stessa tela); senza misure, l'80% dell'immagine.
 */
export function scalaDiChiReagisce(testaParla?: number, testaReagisce?: number): number {
  return testaParla && testaReagisce ? (CHI_REAGISCE.testa * testaParla) / testaReagisce : CHI_REAGISCE.testa;
}
/** Un valore che si avvicina a quello voluto, senza scatti: dopo `tau` secondi ha fatto i due terzi della strada. */
export const avvicina = (attuale: number, voluto: number, dt: number, tau: number) => voluto + (attuale - voluto) * Math.exp(-Math.max(0, dt) / tau);
/** Quanto ci mette a scivolare di posto o a passare dalla luce all'ombra (tau, in secondi, al tempo normale). */
export const SCIVOLA = 0.16;

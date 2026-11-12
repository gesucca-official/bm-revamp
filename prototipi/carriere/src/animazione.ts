// CA-0a, Fase E: ritratti animati senza un asset per fotogramma (prototipo.md, «Fase E»). Funzioni pure del tempo: le usa il lettore
// a ogni fotogramma e le provano le prove. Due livelli da confrontare: «movimento» (trasformazioni dell'immagine intera, per tutti) e
// «maglia» (deformazione di un'unica immagine con pochi punti di controllo, per Spazienzio).

export type Livello = 'fermo' | 'movimento' | 'maglia';
export const LIVELLI: {id: Livello; nome: string}[] = [
  {id: 'fermo', nome: 'Fermi'}, {id: 'movimento', nome: 'Movimento'}, {id: 'maglia', nome: 'Maglia (Spazienzio)'},
];

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
  // Sobbalzo a ogni parola: un colpetto che si spegne in un decimo di secondo.
  if (daParola !== null && daParola >= 0) {
    const b = Math.exp(-daParola * 14);
    p.ty -= 0.006 * b; p.sy += 0.02 * b; p.sx -= 0.012 * b;
  }
  // Ingresso: arriva schiacciato, rimbalza allungandosi e si assesta.
  if (daIngresso >= 0) {
    const a = -0.13 * Math.exp(-daIngresso * 7) * Math.cos(daIngresso * 22);
    p.sy += a; p.sx -= a * 0.6;
    p.ty += 0.035 * Math.exp(-daIngresso * 9);
  }
  switch (espressione) {
    case 'furioso':  // tremito di rabbia, veloce e irregolare
      p.tx += 0.0035 * onda(t, 1 / 13, 1.3) + 0.002 * onda(t, 1 / 21);
      p.rot += 0.6 * onda(t, 1 / 9);
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
    case 'agitata': {  // scatti nervosi a intervalli fissi, ciascuno nella sua direzione
      const k = Math.floor(t / 0.8), locale = t - k * 0.8, dir = hash(k) < 0.5 ? -1 : 1, e = Math.exp(-locale * 16);
      p.tx += dir * 0.009 * e; p.rot += dir * 1.3 * e;
      break;
    }
    case 'sospettosa':  // si sporge piano, guardando di traverso
      p.rot += -1.4 * (0.5 + 0.5 * onda(t, 4.5));
      break;
    case 'illuminata': {  // un saltello quando le viene l'idea, ogni due secondi
      const locale = t % 2, e = Math.exp(-locale * 9);
      p.ty -= 0.01 * e * Math.abs(Math.cos(locale * 12)); p.sy += 0.015 * e;
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
// Maglia: l'immagine si piega su una griglia di vertici. Pochi punti di controllo, in coordinate dell'immagine (0–1):
// il perno del collo, la zona della testa (che annuisce e si inclina) e quella del busto (che respira). Misurati sui ritratti di Spazienzio,
// che hanno tutti la stessa inquadratura (specifica degli asset).
export type Controlli = {perno: {u: number; v: number}; testa: {u: number; raggio: number; sopra: number; sotto: number}; busto: {da: number; a: number}; aspetto: number};
export const SPAZIENZIO: Controlli = {
  perno: {u: 0.47, v: 0.47},                       // sotto il mento, fra le spalle
  testa: {u: 0.47, raggio: 0.17, sopra: 0.40, sotto: 0.50},  // piena sopra 0.40, sfuma fino a 0.50; larga 0.17 per lato
  busto: {da: 0.48, a: 0.88},                      // il petto respira fra queste quote; il bordo basso resta fermo
  aspetto: 1536 / 1024,                            // altezza su larghezza della tela dei ritratti
};

const lisca = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * Dove va un vertice (u, v) dell'immagine al tempo t. La testa ruota intorno al perno (annuisce quando parla, a ogni parola dà un cenno,
 * e si inclina piano); il busto si allarga e si alza un poco col respiro; il bordo basso e i punti lontani dalla testa non si muovono.
 */
export function deforma(u: number, v: number, t: number, parlando: boolean, daParola: number | null, c: Controlli = SPAZIENZIO): {u: number; v: number} {
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

// CA-0a, Fase G: la bacheca si muove (prototipo.md, «Fase G»). Funzioni pure del tempo e dei dati: le usa la bacheca a ogni fotogramma e
// le provano le prove. Quattro movimenti, tutti piccoli: le cordicelle che penzolano oscillano, una lettera allentata tremola e cade (e il
// giocatore la rimette a posto trascinandola), la puntina «sei qui» viaggia al nodo nuovo, il post-it di un nodo appena scoperto si stacca.
import {caso, catenaria, pendenza, type Pt, type Punto} from './bacheca.ts';

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
 * L'achievement della bacheca (Fase H: il proprietario lo vuole, «per rimettere la lettera a posto»): alla prima lettera rimessa al suo
 * posto. È un achievement come gli altri, nell'elenco di ogni carriera, nascosto finché non arriva.
 */
export const PREMIO_LETTERE = {attivo: true, quante: 1, id: 'al-suo-posto', titolo: 'Al suo posto',
  descrizione: 'Hai rimesso al suo posto una lettera caduta dalla bacheca.', indizio: 'Ogni tanto sulla bacheca una lettera si allenta.'};
export const premioLettere = (rimesse: number, p = PREMIO_LETTERE) => p.attivo && rimesse === p.quante;

// ---------------------------------------------------------------------------------------------------------------------------------
// Fase H: la bacheca viva. Un angolo di post-it che ogni tanto si solleva, una mosca che passeggia, l'ombra delle lampade (in CSS).

/** Quando si solleva un angolo di post-it: la k-esima volta, in secondi di bacheca ferma, decisa dai dati (fra 9 e 16 s l'una dall'altra). */
export function prossimoAngolo(seme: string, k: number, presto = false): number {
  let t = presto ? -7 : 0;  // con ?angolo il primo arriva dopo due secondi
  for (let i = 0; i <= k; i++) t += 9 + caso(`${seme}:angolo:${i}`)() * 7;
  return t;
}
export const DURATA_ANGOLO = 1.8;
/** Quanto è sollevato l'angolo (0–1), t secondi dopo che comincia: sale piano come per uno spiffero, resta un attimo e ricade. */
export function angoloPostit(t: number): number {
  if (t <= 0 || t >= DURATA_ANGOLO) return 0;
  const u = t / DURATA_ANGOLO;
  if (u < 0.45) return liscia(u / 0.45);
  if (u < 0.6) return 1;
  // Ricade con un piccolo sobbalzo, come la carta.
  const v = (u - 0.6) / 0.4;
  return Math.min(1, Math.max(0, (1 - liscia(v)) + Math.sin(v * Math.PI * 2) * 0.08 * (1 - v)));
}

/** Il piano di una mosca: da dove arriva, dove si posa, dove cammina, quando se ne va. In frazioni del feltro (0–1), tempi in secondi. */
export type PianoMosca = {arrivo: Pt; tappe: Pt[]; via: Pt; inizio: number};
export const VOLO = 0.9, PASSO_MOSCA = 0.55, SOSTA = 0.9;
/** Una mosca ogni tanto (una volta su due che si apre la bacheca), decisa dai dati; arriva dopo qualche secondo di bacheca ferma. */
export function pianoMosca(seme: string, sempre = false): PianoMosca | null {
  const r = caso(`${seme}:mosca`);
  if (r() >= 0.5 && !sempre) return null;
  const bordo = (): Pt => { const lato = Math.floor(r() * 4), q = r(); return lato === 0 ? {x: q, y: -0.1} : lato === 1 ? {x: 1.1, y: q} : lato === 2 ? {x: q, y: 1.1} : {x: -0.1, y: q}; };
  const arrivo = bordo();
  let q = {x: 0.2 + r() * 0.6, y: 0.25 + r() * 0.5};
  const tappe = [q];
  for (let i = 0; i < 5; i++) { q = {x: Math.min(0.92, Math.max(0.08, q.x + (r() - 0.5) * 0.12)), y: Math.min(0.9, Math.max(0.15, q.y + (r() - 0.5) * 0.1))}; tappe.push(q); }
  const via = bordo(), inizio = 6 + r() * 6;
  return {arrivo, tappe, via, inizio: sempre ? 1.5 : inizio};
}
export const durataMosca = (p: PianoMosca) => VOLO + (p.tappe.length - 1) * (PASSO_MOSCA + SOSTA) + SOSTA + VOLO;

/**
 * Dove sta la mosca t secondi dopo il suo inizio: vola dentro dal bordo, cammina a piccoli tratti fra le tappe (con le soste in cui si
 * pulisce le zampe), poi vola via. `ali`: quanto battono (0 ferma, 1 in volo); `angolo`: la direzione in cui guarda, in gradi.
 */
export function mosca(p: PianoMosca, t: number): {x: number; y: number; angolo: number; ali: number; fase: 'prima' | 'vola' | 'cammina' | 'ferma' | 'via' | 'andata'} {
  const dir = (a: Pt, b: Pt) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
  const tra = (a: Pt, b: Pt, u: number) => ({x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u});
  if (t < 0) return {...p.arrivo, angolo: dir(p.arrivo, p.tappe[0]), ali: 1, fase: 'prima'};
  if (t < VOLO) {
    const u = liscia(t / VOLO), q = tra(p.arrivo, p.tappe[0], u);
    return {x: q.x + Math.sin(t * 19) * 0.006 * (1 - u), y: q.y + Math.cos(t * 23) * 0.006 * (1 - u), angolo: dir(p.arrivo, p.tappe[0]), ali: 1, fase: 'vola'};
  }
  let s = t - VOLO;
  for (let i = 0; i < p.tappe.length - 1; i++) {
    const a = p.tappe[i], b = p.tappe[i + 1];
    if (s < SOSTA) return {...a, angolo: dir(a, b) + Math.sin(s * 9) * 6, ali: 0, fase: 'ferma'};
    s -= SOSTA;
    if (s < PASSO_MOSCA) { const q = tra(a, b, s / PASSO_MOSCA); return {...q, angolo: dir(a, b), ali: 0, fase: 'cammina'}; }
    s -= PASSO_MOSCA;
  }
  const ultima = p.tappe[p.tappe.length - 1];
  if (s < SOSTA) return {...ultima, angolo: dir(ultima, p.via), ali: 0, fase: 'ferma'};
  s -= SOSTA;
  if (s < VOLO) { const u = (s / VOLO) ** 2, q = tra(ultima, p.via, u); return {...q, angolo: dir(ultima, p.via), ali: 1, fase: 'via'}; }
  return {...p.via, angolo: 0, ali: 0, fase: 'andata'};
}

/** Toccata, la mosca o vola via (più spesso) o si schiaccia: deciso dai dati, una volta per mosca. */
export const toccataMosca = (seme: string): 'vola' | 'schiaccia' => caso(`${seme}:toccata`)() < 0.65 ? 'vola' : 'schiaccia';

// ---------------------------------------------------------------------------------------------------------------------------------
// Fasi I e J: i nodi chiusi strappati. Un nodo non più raggiungibile in questo giro, ancora coperto dal post-it, ha il post-it strappato
// in due o tre punti (Fase J: «il post-it chiuso ha due o tre strappi»; l'accartocciato della Fase I non c'è più): un angolo in basso
// lacerato e uno o due morsi, sul fianco e sul bordo basso; i pezzi che mancano. Gli strappi si scelgono per nodo dai dati; si vedono
// quando il nodo si chiude e poi restano; un nuovo giro rimette la carta intera.

/** I nodi che si sono chiusi dall'ultima volta che si è vista la bacheca, nello stesso giro (un nuovo giro non strappa niente). */
export const chiusiOra = (prima: {giro: number; chiusi: string[]} | null, giro: number, chiusi: string[]) =>
  prima && prima.giro === giro ? chiusi.filter(id => !prima.chiusi.includes(id)) : [];

/** Un orlo frastagliato da `a` a `b` (esclusi), di `n` tratti: ogni punto si scosta un poco, a caso, dalla retta. */
function orlo(r: () => number, a: Pt, b: Pt, n: number): Pt[] {
  const l = Math.hypot(b.x - a.x, b.y - a.y), q: Pt[] = [];
  for (let i = 1; i < n; i++) {
    const u = i / n, j = (r() - 0.5) * l * 0.16;
    q.push({x: a.x + (b.x - a.x) * u + j * 0.7, y: a.y + (b.y - a.y) * u + j});
  }
  return q;
}

/** Un morso nel bordo: da `da` ad `a` (sul bordo) passando dentro la carta per `apice`, con l'orlo frastagliato. */
const morso = (r: () => number, da: Pt, apice: Pt, a: Pt): Pt[] => [da, ...orlo(r, da, apice, 3), apice, ...orlo(r, apice, a, 3), a];

/**
 * Gli strappi: il contorno del post-it (in coordinate locali: x da -w/2 a w/2, y da 0 a h) con due o tre strappi, e i pezzi che mancano.
 * Sempre un angolo in basso lacerato; poi un morso nel fianco dell'altro lato, sotto la metà; il terzo, quando c'è, un morso nel bordo
 * basso, fra i due. Mai in alto, dove c'è la puntina; mai sopra il «???», che resta leggibile.
 */
export function strappi(seme: string, w: number, h: number): {contorno: Pt[]; pezzi: Pt[][]} {
  const r = caso(`${seme}:strappi`);
  const quanti = r() < 0.5 ? 2 : 3;
  const destra = r() < 0.6;
  // Si disegna con l'angolo strappato a destra; a sinistra è lo specchio.
  const lato = (0.17 + r() * 0.1) * w, alto = (0.24 + r() * 0.14) * h;
  const a = {x: w / 2 - lato, y: h}, b = {x: w / 2, y: h - alto};
  const taglio = orlo(r, a, b, 7);
  const angolo: Pt[] = [a, ...taglio, b, {x: w / 2, y: h}];
  // Il morso nel fianco sinistro: va dal basso verso l'alto, come il contorno.
  const y0 = (0.5 + r() * 0.14) * h, lunga = (0.16 + r() * 0.08) * h, fondo = (0.08 + r() * 0.05) * w;
  const fianco = morso(r, {x: -w / 2, y: y0 + lunga}, {x: -w / 2 + fondo, y: y0 + lunga * (0.35 + r() * 0.3)}, {x: -w / 2, y: y0});
  // Il morso nel bordo basso: da destra verso sinistra, fra l'angolo strappato e l'angolo sinistro.
  const conFianco = quanti === 3 || r() < 0.5, conBasso = quanti === 3 || !conFianco;
  const cx = (-0.12 + r() * 0.14) * w, largo = (0.1 + r() * 0.05) * w, giu = (0.1 + r() * 0.05) * h;
  const basso = conBasso ? morso(r, {x: cx + largo / 2, y: h}, {x: cx + (r() - 0.5) * largo * 0.4, y: h - giu}, {x: cx - largo / 2, y: h}) : [];
  const pezzi = [angolo, conFianco ? fianco : [], basso].filter(p => p.length);
  const contorno: Pt[] = [{x: -w / 2, y: 0}, {x: w / 2, y: 0}, b, ...[...taglio].reverse(), a, ...basso, {x: -w / 2, y: h},
    ...(conFianco ? fianco : [])];
  const specchio = (q: Pt[]) => (destra ? q : q.map(p => ({x: -p.x, y: p.y})));
  return {contorno: specchio(contorno), pezzi: pezzi.map(specchio)};
}

/** Quando cominciano a cadere i pezzi di un nodo appena chiuso (secondi dopo l'apertura della bacheca), e lo scarto fra un pezzo e l'altro. */
export const TEMPO_STRAPPI = {inizio: 0.6, scarto: 0.18};

// ---------------------------------------------------------------------------------------------------------------------------------
// Fase K: il filo che resta sospeso. Il proprietario: «quando la puntina viene tolta, il filo resta lì sospeso nel nulla. O lo facciamo
// cadere e riprendere dalla puntina rossa, o troviamo un'altra soluzione». L'unico caso: all'apertura della bacheca dopo un nodo nuovo,
// la puntina di quel nodo si toglie per far posto alla «sei qui» che arriva in volo; le cordicelle legate lì restavano a mezz'aria finché
// non arrivava. Ora la vecchia puntina si sfila, il capo libero di ogni cordicella cade, penzola dall'altro capo e, quando la «sei qui»
// si pianta, torna su e la puntina rossa lo riprende. Le cordicelle arrotolate intorno a quella puntina cadono con lei e tornano con la rossa.

/** I tempi del filo, in secondi: la vecchia puntina si toglie prima che parta la «sei qui»; il capo torna su in `ripresa` dopo che è arrivata. */
export const TEMPI_FILO = {anticipo: 0.45, sfila: 0.25, ripresa: 0.4};
/** Quando si toglie la vecchia puntina e quando la «sei qui» riprende i capi, dato quando parte il suo viaggio. */
export const tempiFilo = (inizioViaggio: number) =>
  ({togli: Math.max(0, inizioViaggio - TEMPI_FILO.anticipo), riprendi: inizioViaggio + TEMPI.durataViaggio});

/**
 * Le cordicelle da far cadere quando si toglie la puntina del nodo `ultimo` (il nodo d'arrivo; `da` è quello di partenza): tutte quelle
 * legate lì, tranne quella nuova da `da` a `ultimo`, che la «sei qui» si tira dietro in volo. `fisso` è il capo che resta legato; le
 * arrotolate attorno alla puntina tolta (`da` === ultimo) cadono intere.
 */
export function filiDaRiprendere<F extends {da: string; a: string; tipo: 'tesa' | 'lenta' | 'arrotolata'}>(fili: F[], ultimo: string, da: string):
  {filo: F; fisso: 'da' | 'a' | null}[] {
  return fili.filter(f => (f.da === ultimo || f.a === ultimo) && !(f.da === da && f.a === ultimo))
    .filter(f => f.tipo !== 'arrotolata' || f.da === ultimo)
    .map(f => ({filo: f, fisso: f.tipo === 'arrotolata' ? null : f.da === ultimo ? 'a' : 'da'}));
}

const lunghezza = (q: Pt[]) => q.reduce((s, p, i) => (i ? s + Math.hypot(p.x - q[i - 1].x, p.y - q[i - 1].y) : 0), 0);

/**
 * Una cordicella con un capo libero, `t` secondi dopo che la sua puntina si è tolta (`ripresa`: quando la «sei qui» è arrivata). Prima di
 * togliere (t ≤ 0) e a ripresa finita è la catenaria fra `fisso` e `libero`; in mezzo il capo libero cade e penzola dal capo fisso come un
 * pendolo che si smorza, la corda si raddrizza (lunga quanto era: non si allunga), poi il capo torna a `libero` e la corda riprende la sua forma.
 * Restituisce i punti dal capo fisso al capo libero.
 */
export function filoPenzolante(fisso: Pt, libero: Pt, tipo: 'tesa' | 'lenta', t: number, ripresa: number, n = 18): {punti: Pt[]; distacco: number[]} {
  const cat = (a: Pt) => catenaria(fisso, a, tipo, n);
  if (t <= 0) return cat(libero);
  const l = lunghezza(cat(libero).punti);
  const d0 = Math.hypot(libero.x - fisso.x, libero.y - fisso.y) || 1;
  const pendolo = (s: number): {capo: Pt; forma: number} => {
    const th0 = Math.atan2(libero.x - fisso.x, libero.y - fisso.y);  // 0 = giù
    // Lo strappo della puntina tolta dà una spinta di lato: anche un capo che era già sotto il capo fisso dondola, e si vede che è libero.
    const w = (2 * Math.PI * s) / 1.3, spinta = (th0 >= 0 ? 1 : -1) * 0.45;
    const th = th0 * Math.exp(-s / 0.7) * Math.cos(w) + spinta * Math.exp(-s / 0.9) * Math.sin(w);
    const r = d0 + (l - d0) * (1 - Math.exp(-s / 0.12));
    return {capo: {x: fisso.x + r * Math.sin(th), y: fisso.y + r * Math.cos(th)}, forma: Math.exp(-s / 0.15)};
  };
  const u = t <= ripresa ? 0 : Math.min(1, (t - ripresa) / TEMPI_FILO.ripresa);
  const giu = pendolo(Math.min(t, ripresa));
  const e = liscia(u);
  const capo = {x: giu.capo.x + (libero.x - giu.capo.x) * e, y: giu.capo.y + (libero.y - giu.capo.y) * e};
  const forma = u >= 1 ? 1 : giu.forma + (1 - giu.forma) * e;  // 1: la catenaria; 0: dritta, appesa
  const c = cat(capo);
  const punti = c.punti.map((p, i) => {
    const k = i / n, dritto = {x: fisso.x + (capo.x - fisso.x) * k, y: fisso.y + (capo.y - fisso.y) * k};
    return {x: dritto.x + (p.x - dritto.x) * forma, y: dritto.y + (p.y - dritto.y) * forma};
  });
  return {punti, distacco: c.distacco.map(x => x * forma)};
}

/** Quante cordicelle oscillano al più sulla bacheca (le più corte). */
export const OSCILLANTI = 16;
/**
 * Mockup della principale 0.3: con trentatré cordicelle, molte lunghe quanto la bacheca, farle oscillare tutte (ognuna con l'ombra sfocata
 * da ridipingere) portava la bacheca ferma a 83 ms per fotogramma. Oscillano al più le OSCILLANTI più corte; le altre penzolano ferme
 * (ampiezza 0). Sulla bacheca grande stanno ferme anche quelle più lunghe di `lunghe` pixel (0.3.2: con le sconfitte nascoste le sedici
 * più corte arrivavano a 270 px, e la bacheca ferma tornava a 33 ms per fotogramma). Il tutorial e la prova ne hanno meno, e non cambiano.
 * Cambia le ampiezze sul posto e restituisce la stessa lista.
 */
export function soloLePiuCorte<F extends {l: number; amp: number}>(fili: F[], quante = OSCILLANTI, lunghe = Infinity): F[] {
  const mosse = fili.filter(f => f.amp > 0).sort((x, y) => x.l - y.l);
  if (mosse.length <= quante) return fili;
  mosse.forEach((f, i) => { if (i >= quante || f.l > lunghe) f.amp = 0; });
  return fili;
}

// CA-0a, Fase C: composizione della mappa come bacheca a lettere (docs/design/carriere/bacheca.md). Funzioni pure: dalle caselle della
// mappa e dal loro stato ai punti della bacheca (righe di lettere nelle scanalature, ciascuna con il suo spillo), alle cordicelle fra gli
// spilli e ai finali in fondo, con le imperfezioni di ogni lettera decise dai dati (stesso nodo, stessa «e» storta).
import type {Carriera} from './formato.ts';
import {caselle, archi, disposizione, statiMappa, idCasellaFine, type StatoNodo} from './mappa.ts';
import {entra, finali, nuovoAccount, nuovoGiro, perdi, salta, scegli, vinci, type Stato} from './motore.ts';

/** Una lettera di plastica: rotazione in gradi, spostamento verticale in frazioni dell'altezza, colore della plastica. */
export type Lettera = {c: string; ruota: number; dy: number; colore: string; manca?: true};
export type Punto = {
  id: string;
  tipo: 'nodo' | 'finale';
  stato: StatoNodo;
  colonna: number;              // profondità (per i finali: il loro ordine nei «piatti del giorno»)
  riga: number;
  codice: string;
  titolo: Lettera[][];          // una o due righe di lettere, già con le imperfezioni
  postit: boolean;              // mai visto: post-it con «???» al posto delle lettere
  freccia: boolean;             // disponibile: la freccia di plastica davanti alla riga
  corrente: boolean;            // l'ultimo nodo in cui si è stati: puntina colorata, «sei qui»
  caduta?: Lettera;             // la lettera che manca, caduta in fondo alla cornice
  inclinazione: number;         // del post-it, in gradi
  spillo: Spillo;               // quello che il barista ha trovato nel cassetto
};
/** Puntine e spilli tutti diversi (secondo giro della Fase C: «è un bar marcio, usano quello che trovano»), scelti dai dati. */
export type Spillo = {forma: 'tonda' | 'piatta' | 'sarta' | 'chiodino' | 'ombrello'; colore: string; inclinazione: number};
const FORME: Spillo['forma'][] = ['tonda', 'piatta', 'sarta', 'chiodino', 'ombrello', 'tonda', 'piatta'];
const COLORI = ['#2f6fb5', '#2e8b57', '#e0b320', '#f2efe6', '#7a3fa0', '#d9792b', '#3a3a3a'];
export const ROSSO_SEI_QUI = '#d7322a';

/** Lo spillo di un punto: forma, colore e inclinazione dal suo id; quello dove si è adesso è una puntina tonda rossa. */
export function spilloDi(id: string, corrente: boolean): Spillo {
  const r = caso(`spillo:${id}`);
  const forma = FORME[Math.floor(r() * FORME.length)];
  const colore = COLORI[Math.floor(r() * COLORI.length)];
  const inclinazione = (r() * 2 - 1) * (forma === 'chiodino' ? 25 : 12);
  return corrente ? {forma: 'tonda', colore: ROSSO_SEI_QUI, inclinazione: 0} : {forma, colore, inclinazione};
}
/** Cordicella fra due spilli: tesa per un percorso fatto, lenta per uno da fare, arrotolata intorno allo spillo se esclusa in questo giro. */
export type Filo = {da: string; a: string; tipo: 'tesa' | 'lenta' | 'arrotolata'; sconfitta: boolean};
export type Composizione = {testata: Lettera[]; sottotitolo: Lettera[]; titoloFinali: Lettera[]; punti: Punto[]; fili: Filo[]; colonne: number; righe: number};

/** Numeri pseudo-casuali ripetibili: lo stesso seme dà sempre la stessa sequenza (mulberry32 su un hash del testo). */
export function caso(seme: string): () => number {
  let h = 2166136261;
  for (const ch of seme) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Plastica: bianca per ciò che è disponibile, poi sempre più ingiallita (bacheca.md, «Gli stati dei nodi»).
const BIANCO = ['#f6f3ea', '#f2efe4'];
const INGIALLITO = ['#ece2c4', '#e6d9b2', '#efe6cc', '#e2d2a4'];
const VECCHIO = ['#d9c48e', '#d2b97c', '#ddca98', '#c9ad6c'];
const SOSTITUZIONI: Record<string, string> = {O: '0', B: '8', I: '1'};

export type Stile = {colori: string[]; ruota: number; dy: number; sostituisci: boolean; manca: boolean};
export const STILI: Record<'testata' | 'disponibile' | 'fatto' | 'esplorato' | 'escluso', Stile> = {
  testata: {colori: INGIALLITO, ruota: 0.6, dy: 0.02, sostituisci: false, manca: false},
  disponibile: {colori: BIANCO, ruota: 0.4, dy: 0.015, sostituisci: false, manca: false},
  fatto: {colori: INGIALLITO, ruota: 1.4, dy: 0.03, sostituisci: true, manca: false},
  esplorato: {colori: VECCHIO, ruota: 3, dy: 0.05, sostituisci: true, manca: false},
  escluso: {colori: VECCHIO, ruota: 8, dy: 0.1, sostituisci: true, manca: true},
};

/** Le lettere di un testo nello stile dato; al più una sostituzione («8» per «B») e al più una lettera mancante. */
export function lettere(testo: string, stile: Stile, seme: string): {lettere: Lettera[]; caduta?: Lettera} {
  const r = caso(seme);
  const out: Lettera[] = [...testo].map(c => ({
    c, ruota: c === ' ' ? 0 : (r() * 2 - 1) * stile.ruota, dy: c === ' ' ? 0 : (r() * 2 - 1) * stile.dy,
    colore: stile.colori[Math.floor(r() * stile.colori.length)],
  }));
  const posti = (f: (c: string) => boolean) => out.map((l, i) => f(l.c) ? i : -1).filter(i => i >= 0);
  if (stile.sostituisci && r() < 0.55) {
    const p = posti(c => c in SOSTITUZIONI);
    if (p.length) { const i = p[Math.floor(r() * p.length)]; out[i] = {...out[i], c: SOSTITUZIONI[out[i].c]}; }
  }
  let caduta: Lettera | undefined;
  if (stile.manca) {
    const p = posti(c => /[A-ZÀ-Ý]/.test(c));
    if (p.length) {
      const i = p[Math.floor(r() * p.length)];
      caduta = {...out[i], ruota: 70 + r() * 40};
      out[i] = {...out[i], manca: true};
    }
  }
  return {lettere: out, ...(caduta ? {caduta} : {})};
}

/** Un titolo in una o due righe, spezzato fra le parole vicino a metà se supera `massimo` caratteri. */
export function aCapo(titolo: string, massimo: number): string[] {
  if (titolo.length <= massimo) return [titolo];
  const parole = titolo.split(' ');
  let migliore = [titolo], scarto = Infinity;
  for (let i = 1; i < parole.length; i++) {
    const a = parole.slice(0, i).join(' '), b = parole.slice(i).join(' ');
    const s = Math.max(a.length, b.length);
    if (s < scarto) { scarto = s; migliore = [a, b]; }
  }
  return migliore;
}

const codice = (etichetta: string) => etichetta.split(/\s+/).at(-1)!.toUpperCase();
const stileDi = (stato: StatoNodo): keyof typeof STILI =>
  stato === 'disponibile' ? 'disponibile' : stato === 'escluso' ? 'escluso' : stato === 'fatto' || stato === 'corrente' ? 'fatto' : 'esplorato';

export function componi(c: Carriera, s: Stato, ultimo: string | null, intestazione: string, massimo = 13): Composizione {
  const stati = statiMappa(c, s);
  const {posizione, colonne, righe} = disposizione(c);
  const tutte = caselle(c);
  const visibili = new Set(tutte.filter(x => stati[x.id].stato !== 'nascosto').map(x => x.id));
  const punti: Punto[] = [];
  const numeroFinale = new Map(finali(c).map((f, i) => [idCasellaFine(f.id), i]));
  for (const x of tutte) {
    if (!visibili.has(x.id)) continue;
    const {stato, noto} = stati[x.id];
    // La stella dei finali e la freccia del disponibile sono pezzi di plastica a parte (League Gothic non li ha).
    const testo = x.titolo.toUpperCase();
    let caduta: Lettera | undefined;
    const titolo = aCapo(testo, massimo).map((t, i) => {
      const r = lettere(t, STILI[stileDi(stato)], `${c.id}:${x.id}:${i}`);
      if (r.caduta && !caduta) { caduta = r.caduta; return r.lettere; }
      return r.caduta ? r.lettere.map(l => l.manca ? {c: l.c, ruota: l.ruota, dy: l.dy, colore: l.colore} : l) : r.lettere;
    });
    const fine = numeroFinale.get(x.id);
    punti.push({
      id: x.id, tipo: x.fine ? 'finale' : 'nodo', stato,
      colonna: fine ?? posizione[x.id].colonna, riga: fine === undefined ? posizione[x.id].riga : 0,
      codice: x.fine ? '★' : codice(x.etichetta), titolo,
      postit: !noto && stato !== 'corrente', freccia: stato === 'disponibile', corrente: x.id === ultimo,
      ...(caduta && noto ? {caduta} : {}), inclinazione: (caso(`postit:${x.id}`)() * 2 - 1) * 5, spillo: spilloDi(x.id, x.id === ultimo),
    });
  }
  const g = s.giro;
  const fatto = (id: string) => g.visti.includes(id) || (id.startsWith('fine:') && g.fine !== null && idCasellaFine(g.finale ?? '') === id);
  const fili: Filo[] = archi(c).filter(a => !a.indietro && visibili.has(a.da) && visibili.has(a.a)).map(a => ({
    da: a.da, a: a.a, sconfitta: a.tipo === 'sconfitta',
    tipo: fatto(a.da) && fatto(a.a) ? 'tesa' : stati[a.da].stato === 'escluso' || stati[a.a].stato === 'escluso' ? 'arrotolata' : 'lenta',
  }));
  const conti = `GIRO ${g.numero} · SBLOCCHI ${s.account.sblocchi.length} · FINALI ${s.account.finali.length}/${finali(c).length}`;
  return {
    testata: lettere(intestazione.toUpperCase(), STILI.testata, `${c.id}:testata`).lettere,
    sottotitolo: lettere(conti, STILI.fatto, `${c.id}:conti`).lettere,
    titoloFinali: lettere('PIATTI DEL GIORNO', STILI.fatto, `${c.id}:finali`).lettere,
    punti, fili, colonne, righe,
  };
}

/**
 * Lo stato del bozzetto, «a metà giro» della mini-carriera, giocato con il motore vero: un primo giro con Mara fino a «Grappino è tornato»,
 * poi un secondo giro con Spazienzio, sconfitta in cucina e il retrobottega acceso sulla mappa.
 */
export function statoBozzetto(c: Carriera): {stato: Stato; ultimo: string} {
  let s = nuovoGiro(c, nuovoAccount());
  const fai = (f: (s: Stato) => {stato: Stato}) => { s = f(s).stato; };
  fai(x => entra(c, x, 'nodo-a')); fai(x => salta(c, x)); fai(x => scegli(c, x, 0));
  fai(x => entra(c, x, 'nodo-b')); fai(x => salta(c, x)); fai(x => vinci(c, x));
  fai(x => entra(c, x, 'nodo-d')); fai(x => salta(c, x)); fai(x => vinci(c, x)); fai(x => scegli(c, x, 0));
  fai(x => entra(c, x, 'nodo-g')); fai(x => salta(c, x));
  s = nuovoGiro(c, s.account, s.giro);
  fai(x => entra(c, x, 'nodo-a')); fai(x => salta(c, x)); fai(x => scegli(c, x, 1));
  fai(x => entra(c, x, 'nodo-c')); fai(x => salta(c, x)); fai(x => perdi(c, x));
  return {stato: s, ultimo: 'nodo-c'};
}

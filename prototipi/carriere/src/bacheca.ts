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
  postit: boolean;              // mai visto e non affrontabile subito: post-it con «???» al posto delle lettere
  freccia: boolean;             // disponibile: la freccia di plastica davanti alla riga
  corrente: boolean;            // l'ultimo nodo in cui si è stati: puntina colorata, «sei qui»
  caduta?: Lettera;             // la lettera che manca, caduta in fondo alla cornice
  inclinazione: number;         // del post-it, in gradi
  spillo: Spillo;               // quello che il barista ha trovato nel cassetto
};
/**
 * Puntine e spilli tutti diversi (secondo giro della Fase C: «è un bar marcio, usano quello che trovano»), scelti dai dati. Le forme hanno
 * i nomi delle immagini generate che le sostituiranno (prompt-bacheca.md): «tonda» usa tonda-rossa.webp ricolorata, come cilindro e ombrello.
 */
export type Spillo = {forma: 'tonda' | 'cilindro' | 'ottone' | 'spillo' | 'chiodino' | 'ombrello'; colore: string; inclinazione: number};
export const FORME: Spillo['forma'][] = ['tonda', 'cilindro', 'ottone', 'spillo', 'chiodino', 'ombrello', 'tonda', 'ottone'];
/** Le forme di plastica, che il client ricolora; le altre hanno il loro metallo. */
export const DI_PLASTICA = new Set<Spillo['forma']>(['tonda', 'cilindro', 'ombrello']);
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
    // Una lettera in mezzo a una parola (mai la prima o l'ultima), così la parola si legge ancora.
    const lettera = (c: string | undefined) => !!c && /[A-ZÀ-Ý0-9]/.test(c);
    const p = posti(c => /[A-ZÀ-Ý]/.test(c)).filter(i => lettera(out[i - 1]?.c) && lettera(out[i + 1]?.c));
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
  let caduteFinora = 0;  // una sola lettera caduta per bacheca, dalla prima riga esclusa e già vista (bacheca.md: «una caduta in fondo»)
  const numeroFinale = new Map(finali(c).map((f, i) => [idCasellaFine(f.id), i]));
  for (const x of tutte) {
    if (!visibili.has(x.id)) continue;
    const {stato, noto} = stati[x.id];
    // La stella dei finali e la freccia del disponibile sono pezzi di plastica a parte (League Gothic non li ha).
    const testo = x.titolo.toUpperCase();
    let caduta: Lettera | undefined;
    const puoCadere = noto && caduteFinora === 0;
    const titolo = aCapo(testo, massimo).map((t, i) => {
      const r = lettere(t, STILI[stileDi(stato)], `${c.id}:${x.id}:${i}`);
      if (r.caduta && !caduta && puoCadere) { caduta = r.caduta; return r.lettere; }
      return r.caduta ? r.lettere.map(l => l.manca ? {c: l.c, ruota: l.ruota, dy: l.dy, colore: l.colore} : l) : r.lettere;
    });
    if (caduta) caduteFinora++;
    const fine = numeroFinale.get(x.id);
    punti.push({
      id: x.id, tipo: x.fine ? 'finale' : 'nodo', stato,
      colonna: fine ?? posizione[x.id].colonna, riga: fine === undefined ? posizione[x.id].riga : 0,
      codice: x.fine ? '★' : codice(x.etichetta), titolo,
      // Fase K: un nodo affrontabile subito mostra il nome anche se non lo si è mai visto («vorrei che i nomi dei prossimi nodi affrontabili
      // siano rivelati»); il post-it resta sui nodi più lontani, e anche su quelli raggiunti ma bloccati dalla loro condizione.
      postit: !noto && stato !== 'corrente' && stato !== 'disponibile', freccia: stato === 'disponibile', corrente: x.id === ultimo,
      ...(caduta && noto ? {caduta} : {}), inclinazione: (caso(`postit:${x.id}`)() * 2 - 1) * 5, spillo: spilloDi(x.id, x.id === ultimo),
    });
  }
  const g = s.giro;
  // Tesa solo la cordicella percorsa davvero in questo giro (nodi visti uno dopo l'altro, e l'ultimo verso il finale raggiunto); lenta
  // quella che si può ancora prendere; arrotolata ogni altra, anche fra due nodi visti ma per un'altra strada (ritocchi della Fase D:
  // a fine giro restano tese solo quelle del percorso, e la bacheca non si affolla).
  const percorso = new Set(g.visti.slice(1).map((x, i) => `${g.visti[i]}>${x}`));
  if (g.fine && g.visti.length) percorso.add(`${g.visti.at(-1)}>${idCasellaFine(g.finale ?? g.fine)}`);
  const ancoraPossibile = (id: string) => ['aperto', 'disponibile', 'bloccato'].includes(stati[id].stato);
  const fili: Filo[] = archi(c).filter(a => visibili.has(a.da) && visibili.has(a.a)).map(a => ({
    da: a.da, a: a.a, sconfitta: a.tipo === 'sconfitta',
    tipo: percorso.has(`${a.da}>${a.a}`) ? 'tesa' : ancoraPossibile(a.a) && stati[a.da].stato !== 'escluso' ? 'lenta' : 'arrotolata',
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

// ---------------------------------------------------------------------------------------------------------------------------------
// Fase D: la mappa vera come bacheca. Cordicelle che penzolano, sporco in posizioni fisse, disposizione per tutte e due le carriere.

export type Pt = {x: number; y: number};

/**
 * Quanto pende una cordicella: niente se è tesa, poi una pendenza che cresce più che in proporzione alla lunghezza (una corda lunga pende
 * di più anche in proporzione); arrotolata non attraversa la bacheca.
 */
export function pendenza(l: number, tipo: Filo['tipo']): number {
  if (tipo === 'tesa') return Math.min(2, l * 0.004);
  return l * (0.05 + l / 12000);
}

/**
 * I punti di una cordicella fra due spilli: una catenaria fra a e b, abbassata della pendenza al centro. `distacco` è quanto la corda si
 * allontana dal feltro (0 agli spilli, 1 a metà): serve per allungare l'ombra dove la corda pende di più.
 */
export function catenaria(a: Pt, b: Pt, tipo: Filo['tipo'], n = 18): {punti: Pt[]; distacco: number[]} {
  const l = Math.hypot(b.x - a.x, b.y - a.y);
  const f = pendenza(l, tipo), k = 2.2, ck = Math.cosh(k) - 1;
  const punti: Pt[] = [], distacco: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const caduta = f * (1 - (Math.cosh(k * (2 * t - 1)) - 1) / ck);  // 0 agli estremi, f al centro
    punti.push({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t + caduta});
    distacco.push(f > 0 ? caduta / f : 0);
  }
  return {punti, distacco};
}

/** Sporco del feltro in frazioni del pannello, deciso dai dati: aloni di vino, schizzi, caffè, ditate, colature e zone consunte. */
export type Macchia = {tipo: 'alone' | 'schizzo' | 'caffe' | 'ditata' | 'colatura' | 'consunto'; x: number; y: number; r: number; ruota: number};
export function sporco(seme: string): Macchia[] {
  const r = caso(seme);
  const una = (tipo: Macchia['tipo'], min: number, max: number): Macchia =>
    ({tipo, x: 0.05 + r() * 0.9, y: 0.1 + r() * 0.82, r: min + r() * (max - min), ruota: r() * 360});
  return [
    ...Array.from({length: 3}, () => una('consunto', 0.08, 0.16)),
    ...Array.from({length: 3}, () => una('alone', 0.035, 0.06)),
    una('alone', 0.07, 0.09),                                  // un bicchiere grande, appoggiato per anni sempre lì
    ...Array.from({length: 2}, () => una('schizzo', 0.03, 0.05)),
    una('caffe', 0.03, 0.045),
    ...Array.from({length: 2}, () => una('ditata', 0.012, 0.018)),
    una('colatura', 0.05, 0.09),
  ];
}

/** Larghezza media di una lettera di League Gothic con la spaziatura, in em: per stimare quanto occupa un titolo. */
export const CARATTERE_LETTERA = 0.42;

export type Etichetta = {x: number; y: number; ancora: 'start' | 'middle'};
export type Disposizione = {
  verticale: boolean; w: number; h: number;
  T: number; p: number; fx: number; fy: number; fw: number; fh: number; fs: number;
  testate: Lettera[][]; testataFs: number; yTestata: number; ySotto: number;
  yFinali: number; xTitoloFinali: number;
  pos: Record<string, Pt>;              // spillo di ogni punto
  etichette: Record<string, Etichetta>; // dove cominciano le lettere
  postit: {w: number; h: number};
  lato: Record<string, number>;         // lato dell'immagine di ogni puntina, in pixel
  postitY: Record<string, number>;      // bordo alto di ogni post-it: la puntina lo trafigge senza coprire il «???»
  legenda: {x: number; y: number; w: number; h: number; righe: string[]} | null;  // in verticale si apre con un pulsante
  fondo: number;                        // dove stanno le lettere cadute
};

export const LEGENDA = ['puntina rossa: sei qui', '→ lettere bianche: si va di qui', 'post-it: mai visto', 'lettere storte: chiuso in questo giro',
  'cordicella tesa: fatto · lenta: da fare', 'arrotolata: chiusa · rossa: se perdi'];

/** La testata divisa in due righe al trattino lungo («SERRAGLIO» / «CARRIERA: …»). */
export function dividiTestata(l: Lettera[]): Lettera[][] {
  const i = l.findIndex(x => x.c === '—');
  return i < 0 ? [l] : [l.slice(0, i).filter((x, j, a) => !(j === a.length - 1 && x.c === ' ')), l.slice(i + 1).filter((x, j) => !(j === 0 && x.c === ' '))];
}

/**
 * Dove sta ogni cosa sulla bacheca, per una misura di schermo. Le righe di lettere poggiano sulle scanalature (passo p). `alto` e `basso`
 * sono lo spazio lasciato ai pulsanti: in orizzontale una fila in basso, in verticale una fila in alto e «Continua» in basso.
 */
export function disponi(comp: Composizione, w: number, h: number, alto: number, basso: number): Disposizione {
  const verticale = h > w;
  const T = verticale ? 14 : 24;
  const fx = T, fy = T, fw = w - 2 * T, fh = h - 2 * T;
  const nodi = comp.punti.filter(x => x.tipo === 'nodo');
  const fini = comp.punti.filter(x => x.tipo === 'finale');
  const colonne = Math.max(...nodi.map(x => x.colonna)) + 1;
  const righe = Math.max(...nodi.map(x => x.riga)) + 1;
  const p = verticale ? Math.max(11, Math.min(16, Math.floor((fh - alto - basso) / (18 + colonne * 5.2)))) : 18;
  const scan = (y: number) => fy + Math.round((y - fy) / p) * p;
  const fs = p * 1.95;
  const larghezza = (n: Punto) => Math.max(...n.titolo.map(t => t.length)) * CARATTERE_LETTERA * (n.tipo === 'finale' ? fs * 0.9 : fs);

  const testate = verticale ? dividiTestata(comp.testata) : [comp.testata];
  const lunga = Math.max(...testate.map(t => t.length));
  const testataFs = Math.min(fs * 1.35, (fw * 0.86) / (lunga * 0.5));
  const yTestata = scan(fy + alto + p * 3);
  const ySotto = yTestata + p * 2 * testate.length;
  const lh = p * (LEGENDA.length * 1.15 + 1.2);
  const altezzaFinali = verticale ? p * 7 : p * 6;
  const yFinali = scan(fy + fh - basso - altezzaFinali - p * (verticale ? 0 : 1));
  const yA = ySotto + p * 3, yB = yFinali - p * 2;

  const pos: Record<string, Pt> = {};
  if (!verticale) {
    const colW = (fw - p * 2) / colonne;
    for (const n of nodi) pos[n.id] = {x: fx + p + (n.colonna + 0.5) * colW, y: scan(yA + ((n.riga + 0.5) * (yB - yA)) / Math.max(righe, 1) - p * 2)};
  } else {
    // Ogni profondità è una fila: un nodo solo sta al centro, due si dividono la larghezza; spillo a sinistra del titolo.
    for (let d = 0; d < colonne; d++) {
      const fila = nodi.filter(n => n.colonna === d).sort((a, b) => a.riga - b.riga);
      fila.forEach((n, i) => {
        const centro = fx + (fw * (i + 0.5)) / fila.length;
        const blocco = larghezza(n) + p * 1.1 + (n.freccia ? fs * 0.8 : 0);
        const x = n.postit ? centro + (n.freccia ? fs * 0.4 : 0) : Math.max(fx + p, centro - blocco / 2);
        pos[n.id] = {x, y: scan(yA + ((d + 0.15) * (yB - yA)) / colonne)};
      });
    }
  }
  if (!verticale) {
    // Ogni finale sotto il nodo da cui ci si arriva, da destra verso sinistra, a distanza fissa l'uno dall'altro.
    const voluti = fini.map(f => {
      const da = comp.fili.filter(x => x.a === f.id).map(x => pos[x.da]).filter((x): x is Pt => !!x);
      return {f, x: (da.length ? da.reduce((t, q) => t + q.x, 0) / da.length : fx + fw / 2) - p * 4};
    }).sort((a, b) => a.x - b.x);
    let limite = fx + fw - p * 10;
    for (let i = voluti.length - 1; i >= 0; i--) {
      const x = Math.max(fx + p * 20, Math.min(voluti[i].x, limite));  // a sinistra resta la legenda
      pos[voluti[i].f.id] = {x, y: scan(yFinali + p * 2) + p};
      // Il finale a sinistra deve finire le sue lettere prima della puntina di questo.
      limite = x - Math.max(p * 14, i > 0 ? larghezza(voluti[i - 1].f) + fs * 0.55 + p * 5 : 0);
    }
  } else {
    fini.forEach((f, i) => {
      const centro = fx + (fw * (i + 0.5)) / fini.length;
      const blocco = larghezza(f) + p * 2.4;
      pos[f.id] = {x: f.postit ? centro : Math.max(fx + p, centro - blocco / 2), y: scan(yFinali + p * 2) + p};
    });
  }
  // Le lettere stanno lontane dalla puntina (ritocchi della Fase D: nessuna puntina sopra un titolo): in orizzontale sotto il punto più
  // basso della puntina, in verticale e per i finali a destra del punto più a destra; i post-it pendono abbastanza da lasciare libero il «???».
  const etichette: Record<string, Etichetta> = {};
  const postitY: Record<string, number> = {};
  const lato = Object.fromEntries(comp.punti.map(x => [x.id, latoPuntina(p, verticale, x.corrente) * SCALA[x.spillo.forma]]));
  const ph = p * 3.8;
  for (const n of comp.punti) {
    const s = pos[n.id];
    const b = ingombroPuntina(n.spillo, s, lato[n.id]);
    const destra = Math.max(s.x + p * 1.1, b.x1 + p * 0.4);
    etichette[n.id] = n.tipo === 'finale' ? {x: destra + fs * 0.55, y: s.y + p * 0.65, ancora: 'start'}
      : verticale ? {x: destra + (n.freccia ? fs * 0.8 : 0), y: s.y + p * 0.65, ancora: 'start'}
      : {x: s.x, y: Math.max(s.y + p * 2.6, b.y1 + fs * ALTEZZA_MAIUSCOLE + p * 0.3), ancora: 'middle'};
    postitY[n.id] = Math.max(s.y - p * 0.5, b.y1 + p * 0.3 - ph * 0.82 + p * 2 * 0.72);
  }
  const legenda = verticale ? null : {x: fx + p * 1.2, y: fy + fh - basso - lh - p * 0.6, w: p * 17, h: lh, righe: LEGENDA};
  const xTitoloFinali = verticale ? fx + fw / 2 : Math.min(...fini.map(f => pos[f.id].x)) - p;
  return {verticale, w, h, T, p, fx, fy, fw, fh, fs, testate, testataFs, yTestata, ySotto, yFinali, xTitoloFinali, pos, etichette,
    postit: {w: verticale ? p * 7 : p * 8, h: ph}, legenda, fondo: fy + fh - p * 1.1, lato, postitY};
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Ritocchi della Fase D: puntine generate senza punta. Dove ogni immagine entra nel feltro (ancora), dov'è il centro della testa (per
// l'ombra) e quanto occupa, in frazioni del lato dell'immagine (1254 px), misurati sull'alfa dei file in asset/bacheca/puntine.
export type Geometria = {ancora: Pt; testa: Pt; box: [number, number, number, number]};
export const GEOMETRIA: Record<Spillo['forma'], Geometria> = {
  tonda: {ancora: {x: 0.496, y: 0.42}, testa: {x: 0.496, y: 0.387}, box: [0.261, 0.143, 0.731, 0.632]},
  cilindro: {ancora: {x: 0.493, y: 0.59}, testa: {x: 0.493, y: 0.33}, box: [0.262, 0.096, 0.725, 0.72]},
  ottone: {ancora: {x: 0.49, y: 0.425}, testa: {x: 0.49, y: 0.425}, box: [0.207, 0.141, 0.773, 0.709]},
  spillo: {ancora: {x: 0.465, y: 0.523}, testa: {x: 0.598, y: 0.223}, box: [0.456, 0.143, 0.685, 0.526]},  // dove il gambo entra nel feltro
  chiodino: {ancora: {x: 0.635, y: 0.262}, testa: {x: 0.47, y: 0.686}, box: [0.308, 0.253, 0.672, 0.806]},  // dove finisce il gambo
  ombrello: {ancora: {x: 0.5, y: 0.555}, testa: {x: 0.5, y: 0.45}, box: [0.168, 0.26, 0.831, 0.611]},
};

/** Altezza delle maiuscole di League Gothic, in em: per sapere dove comincia una riga di lettere sopra la sua base. */
export const ALTEZZA_MAIUSCOLE = 0.74;
/** Lo spillo da sarta ha la testa piccola nell'immagine: si ingrandisce perché la perla si veda. */
export const SCALA: Record<Spillo['forma'], number> = {tonda: 1, cilindro: 1, ottone: 1, spillo: 1.3, chiodino: 1, ombrello: 1};

/** Lato dell'immagine di una puntina: la testa resta riconoscibile sul telefono (circa 22–30 px), «sei qui» un terzo più grande. */
export function latoPuntina(p: number, verticale: boolean, corrente: boolean): number {
  return p * (verticale ? 3.3 : 3.1) * (corrente ? 1.3 : 1);
}

/** Il rettangolo che una puntina occupa sul feltro, con la sua inclinazione (che ruota intorno all'ancora). */
export function ingombroPuntina(s: Spillo, ancora: Pt, lato: number): {x0: number; y0: number; x1: number; y1: number} {
  const g = GEOMETRIA[s.forma];
  const ang = (s.inclinazione * Math.PI) / 180, cos = Math.cos(ang), sin = Math.sin(ang);
  const angoli = [[g.box[0], g.box[1]], [g.box[2], g.box[1]], [g.box[0], g.box[3]], [g.box[2], g.box[3]]].map(([fx, fy]) => {
    const dx = (fx - g.ancora.x) * lato, dy = (fy - g.ancora.y) * lato;
    return {x: ancora.x + dx * cos - dy * sin, y: ancora.y + dx * sin + dy * cos};
  });
  return {x0: Math.min(...angoli.map(q => q.x)), y0: Math.min(...angoli.map(q => q.y)), x1: Math.max(...angoli.map(q => q.x)), y1: Math.max(...angoli.map(q => q.y))};
}

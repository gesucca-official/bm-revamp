// Il testo che scorre, a pezzi con gli stacchi su chi ascolta (la regia delle frasi di Piera), a pagine di due righe e con le interruzioni.
// Fase C (prova del proprietario, impressione 4): lo stacco resta fino al tocco, con una durata minima.
// Fase F (giudizio sulla Fase E): la finestra è sempre alta due righe; una battuta più lunga va a pagine, e a fine pagina il testo aspetta
// un tocco, come nelle visual novel. Il modello (fermate, scorri, tocca) è puro e provato; useTesto lo fa girare nel tempo.
import {useEffect, useRef, useState} from 'react';

export const CARATTERI_AL_SECONDO = 45;   // velocità 1; il cast la moltiplica per personaggio (Piera 0.3)
export const STACCO_MINIMO = 700;          // ms: prima di questo tempo un tocco sullo stacco aspetta, poi va avanti
export const RIGHE_PER_PAGINA = 2;
const PASSO = 33;

export type Ascolto = {chi: string; espressione: string};

/**
 * Dove il testo si ferma: dopo i puntini di sospensione di una battuta con gli stacchi (stacco su chi ascolta), all'inizio di ogni pagina
 * (attesa del tocco) e alla fine. Se una pagina comincia subito dopo uno stacco, la fermata è una sola: finito lo stacco si volta pagina.
 * `pagina`: dove comincia la pagina che si apre dopo questa fermata.
 */
export type Fermata = {pos: number; stacco: boolean; pagina: number | null; fine: boolean};

export function fermate(testo: string, conStacchi: boolean, inizioPagine: number[]): Fermata[] {
  const f: Fermata[] = [];
  if (conStacchi) for (const m of testo.matchAll(/\.\.\.(?=\s)/g)) f.push({pos: m.index + 3, stacco: true, pagina: null, fine: false});
  for (const p of inizioPagine) {
    if (p <= 0 || p >= testo.length) continue;
    const insieme = f.find(x => x.stacco && x.pos <= p && testo.slice(x.pos, p).trim() === '');
    if (insieme) insieme.pagina = p;
    else f.push({pos: p, stacco: false, pagina: p, fine: false});
  }
  f.sort((a, b) => a.pos - b.pos);
  f.push({pos: testo.length, stacco: false, pagina: null, fine: true});
  return f;
}

/**
 * Le pagine dalle righe: `righe[i]` è la riga (0, 1, 2…) in cui il disegno ha messo la parola che comincia al carattere `inizi[i]`.
 * Ogni due righe comincia una pagina; la prima comincia a 0.
 */
export function pagine(inizi: number[], righe: number[], perPagina = RIGHE_PER_PAGINA): number[] {
  const out = [0];
  let riga = 0, primaRiga = 0;
  inizi.forEach((pos, i) => {
    if (righe[i] === riga) return;
    riga = righe[i];
    if (riga - primaRiga >= perPagina) { out.push(pos); primaRiga = riga; }
  });
  return out;
}

export type Scorrimento = {
  car: number;               // caratteri scritti (dall'inizio della battuta)
  fermata: number;           // indice della prossima fermata
  inizio: number;            // dove comincia la pagina in vista
  stacco: number | null;     // istante d'inizio dello stacco in corso
  staccoN: number;           // quanti stacchi già fatti: dice chi ascolta, a turno
  attesa: boolean;           // fine pagina: aspetta il tocco
  completo: boolean;
  interrotta: boolean;
};
export const inizia = (testo: string): Scorrimento =>
  ({car: 0, fermata: 0, inizio: 0, stacco: null, staccoN: 0, attesa: false, completo: !testo, interrotta: false});

/** Arriva alla fermata corrente: fine, stacco o attesa di pagina. */
function arriva(s: Scorrimento, f: Fermata[], ora: number) {
  const x = f[s.fermata];
  s.car = x.pos;
  if (x.fine) s.completo = true;
  else if (x.stacco) s.stacco = ora;
  else s.attesa = true;
}
/** Lascia la fermata corrente (finito lo stacco o toccata la pagina) e, se c'è, volta pagina. */
function riparti(s: Scorrimento, f: Fermata[]) {
  const x = f[s.fermata];
  if (x.stacco) s.staccoN++;
  if (x.pagina !== null) s.inizio = x.pagina;
  s.stacco = null; s.attesa = false; s.fermata++;
}

/** Dove comincia l'ultimo pezzo (dopo l'ultimo stacco): l'interruzione arriva a metà di quello. */
const inizioUltimoPezzo = (f: Fermata[]) => f.filter(x => x.stacco).at(-1)?.pos ?? 0;

/** Scrive fino a `n` caratteri, senza superare la prossima fermata. Dice se la battuta va interrotta adesso. */
export function scorri(s: Scorrimento, f: Fermata[], n: number, ora: number, interrompibile = false): {interrompi: boolean} {
  if (s.completo || s.stacco !== null || s.attesa) return {interrompi: false};
  const x = f[s.fermata];
  s.car = Math.min(x.pos, s.car + n);
  const fine = f.at(-1)!.pos, da = inizioUltimoPezzo(f);
  if (interrompibile && !s.interrotta && s.fermata === f.length - 1 && s.car >= da + (fine - da) * 0.5) {
    s.interrotta = true;
    return {interrompi: true};
  }
  if (s.car >= x.pos) arriva(s, f, ora);
  return {interrompi: false};
}

/**
 * Il tocco. Mentre scrive: completa fino alla prossima fermata. Durante uno stacco: passa oltre, ma non prima della durata minima
 * («aspetta» con i millisecondi che mancano). A fine pagina: volta pagina. A battuta completa: non lo usa (si va alla battuta dopo).
 */
export function tocca(s: Scorrimento, f: Fermata[], ora: number): {usato: boolean; aspetta?: number} {
  if (s.completo) return {usato: false};
  if (s.stacco !== null) {
    const mancano = STACCO_MINIMO - (ora - s.stacco);
    if (mancano > 0) return {usato: true, aspetta: mancano};
    riparti(s, f);
    return {usato: true};
  }
  if (s.attesa) { riparti(s, f); return {usato: true}; }
  arriva(s, f, ora);
  return {usato: true};
}

/** Il pezzo di testo in vista: dall'inizio della pagina a dove è arrivato; `resto` è il seguito della pagina, invisibile, che tiene fermi gli a capo. */
export function inVista(testo: string, s: Scorrimento, f: Fermata[]) {
  const finePagina = f.find(x => x.pagina !== null && x.pagina > s.inizio)?.pagina ?? testo.length;
  const fine = s.completo ? finePagina : s.car;
  return {visibile: testo.slice(s.inizio, fine).trimStart(), resto: testo.slice(fine, finePagina)};
}

type Opzioni = {velocita: number; stacchi?: Ascolto[]; interrotta?: boolean; onInterrotta?: () => void};

/** Il modello nel tempo: un passo ogni 33 ms, un timer per la durata minima dello stacco. `inizioPagine` arriva dalla misura del disegno. */
export function useTesto(chiave: string, testo: string, inizioPagine: number[], o: Opzioni) {
  const [, ridisegna] = useState(0);
  const st = useRef<Scorrimento>(inizia(testo));
  const timer = useRef<number | undefined>(undefined);
  const opz = useRef(o);
  opz.current = o;
  const conStacchi = !!o.stacchi?.length;
  const chiavePagine = inizioPagine.join(',');
  const f = useRef<Fermata[]>(fermate(testo, conStacchi, inizioPagine));
  f.current = fermate(testo, conStacchi, inizioPagine);
  // Pagine nuove (il font è arrivato, la finestra ha cambiato misura): la fermata corrente è la prima dopo dove si è arrivati.
  useEffect(() => {
    const s = st.current;
    if (s.completo || s.stacco !== null || s.attesa) return;
    s.fermata = Math.max(0, f.current.findIndex(x => x.pos >= s.car));
    s.inizio = Math.max(0, ...inizioPagine.filter(p => p <= s.car));
    ridisegna(x => x + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chiavePagine]);

  useEffect(() => {
    st.current = inizia(testo);
    ridisegna(x => x + 1);
    const cps = CARATTERI_AL_SECONDO * (opz.current.velocita || 1);
    const id = window.setInterval(() => {
      const s = st.current;
      if (s.completo || s.stacco !== null || s.attesa) return;
      const {interrompi} = scorri(s, f.current, cps * PASSO / 1000, performance.now(), !!opz.current.interrotta);
      if (interrompi) { opz.current.onInterrotta?.(); return; }
      ridisegna(x => x + 1);
    }, PASSO);
    return () => { window.clearInterval(id); window.clearTimeout(timer.current); timer.current = undefined; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chiave]);

  const s = st.current;
  const lista = o.stacchi ?? [];
  const {visibile, resto} = inVista(testo, s, f.current);
  return {
    visibile, resto,
    /** Caratteri scritti finora: danno il ritmo della bocca. */
    scritti: s.car,
    completo: s.completo,
    /** Il testo sta scrivendo (non fermo a uno stacco, a fine pagina o alla fine). */
    scrive: !s.completo && s.stacco === null && !s.attesa,
    ascolta: s.stacco !== null && lista.length ? lista[s.staccoN % lista.length] : null,
    inStacco: s.stacco !== null,
    finePagina: s.attesa,
    tocca: (): boolean => {
      const x = st.current;
      if (x.stacco !== null && timer.current !== undefined) return true;  // il tocco aspetta già la durata minima
      const r = tocca(x, f.current, performance.now());
      if (r.aspetta !== undefined) {
        timer.current = window.setTimeout(() => { timer.current = undefined; tocca(st.current, f.current, performance.now()); ridisegna(n => n + 1); }, r.aspetta);
      }
      ridisegna(n => n + 1);
      return r.usato;
    },
  };
}

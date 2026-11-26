// CA-0d: il pacchetto di una carriera, il file JSON versionato che il gioco leggerà (docs/carriere/formato.md, F13). Funzioni pure: la
// lettura dei file e il confronto con i pacchetti committati sono in serbatoio.ts e strumenti/. La forma del pacchetto è dello strumento
// (DC4: normativo è solo il formato); la versione di una carriera sta nel manifest carriere.json, perché il markdown non la dichiara.
import {createHash} from 'node:crypto';
import {FORMATO, type Carriera, type Cast} from './formato.ts';
import {modificatoriUsati, type Catalogo, type Modificatore} from './modificatori.ts';

/** Versione della forma del pacchetto (i campi qui sotto), non del formato né della carriera. 2 da CA-0e: i modificatori risolti. */
export const FORMA_PACCHETTO = 2;

// modificatori (CA-0e): l'impronta della parte del catalogo che la carriera usa, come per il cast.
export type Impronte = {storia: string; cast: string; modificatori: string};
export type Pacchetto = {
  pacchetto: typeof FORMA_PACCHETTO;
  formato: typeof FORMATO;
  id: string;
  versione: number;
  impronte: Impronte;
  modificatori: Record<string, Modificatore>;  // i modificatori del catalogo che la carriera usa, risolti (F11)
  carriera: Carriera;
};

export const sha256 = (testo: string): string => createHash('sha256').update(testo, 'utf8').digest('hex');

/** La storia come si fotografa: senza BOM e con i fine riga a LF, così Windows e Linux danno la stessa impronta. */
export const normalizzaStoria = (md: string): string => md.replace(/^﻿/, '').replace(/\r\n?/g, '\n');

/** JSON canonico: chiavi in ordine alfabetico a ogni livello, senza spazi. */
export function canonico(v: unknown): string {
  const ordina = (x: unknown): unknown => Array.isArray(x) ? x.map(ordina)
    : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k => [k, ordina((x as Record<string, unknown>)[k])]))
    : x;
  return JSON.stringify(ordina(v));
}

// Campi di testo libero: non nominano mai un elemento del cast.
const TESTI = new Set(['testo', 'nota', 'domanda', 'etichetta', 'titolo', 'descrizione', 'nome', 'fonte', 'effetto', 'suono']);

/** Gli identificativi di cast nominati dalla carriera (personaggi, sfondi, sprite): ogni valore non di testo libero, a ogni livello. */
function nominati(v: unknown, dentro = new Set<string>()): Set<string> {
  if (typeof v === 'string') dentro.add(v);
  else if (Array.isArray(v)) v.forEach(x => nominati(x, dentro));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!TESTI.has(k)) nominati(x, dentro);
  return dentro;
}

/**
 * La parte del cast che la carriera usa e che il formato governa (F11): dei personaggi nome, alias, espressioni, espressioni future,
 * ripieghi e figura in ombra; degli sfondi l'immagine, le varianti e i ripieghi; degli sprite le pose. Velocità del testo, animazione,
 * bocca, misure e posizioni sono della scena di dialogo (CA-0g) e restano fuori.
 */
export function castUsato(carriera: Carriera, cast: Cast): unknown {
  const usati = nominati(carriera.nodi);
  for (const a of carriera.achievement) nominati(a.quando, usati);
  const scegli = <T, U>(tutti: Record<string, T>, f: (x: T) => U) =>
    Object.fromEntries(Object.keys(tutti).filter(k => usati.has(k)).map(k => [k, f(tutti[k])]));
  return {
    personaggi: scegli(cast.personaggi, p => ({nome: p.nome, alias: p.alias, ombra: p.ombra, espressioni: p.espressioni,
      espressioniFuture: p.espressioniFuture, ripieghi: p.ripieghi})),
    sfondi: scegli(cast.sfondi, s => ({file: s.file, varianti: s.varianti, ripieghi: s.ripieghi})),
    sprite: scegli(cast.sprite, s => ({pose: s.pose})),
  };
}

/** L'impronta dei modificatori usati: una carriera senza modificatori ha quella dell'oggetto vuoto. */
export const improntaModificatori = (usati: Record<string, Modificatore>): string => sha256(canonico(usati));

export const impronte = (md: string, carriera: Carriera, cast: Cast, catalogo: Catalogo): Impronte =>
  ({storia: sha256(normalizzaStoria(md)), cast: sha256(canonico(castUsato(carriera, cast))), modificatori: improntaModificatori(modificatoriUsati(carriera, catalogo))});

export function costruisciPacchetto(md: string, carriera: Carriera, cast: Cast, versione: number, catalogo: Catalogo): Pacchetto {
  // Un giro di serializzazione toglie i campi `undefined`: il pacchetto è quello che si rilegge dal file.
  const c = JSON.parse(JSON.stringify(carriera)) as Carriera;
  const modificatori = JSON.parse(JSON.stringify(modificatoriUsati(c, catalogo))) as Record<string, Modificatore>;
  return {pacchetto: FORMA_PACCHETTO, formato: FORMATO, id: c.id, versione, impronte: impronte(md, c, cast, catalogo), modificatori, carriera: c};
}

/** Il testo del file: JSON deterministico (ordine dei campi fisso, indentato di uno spazio), LF e a capo finale. */
export const serializza = (p: Pacchetto): string => JSON.stringify(p, null, 1) + '\n';

/** Un'impronta cambiata a parità di versione è un errore: la versione si alza (F13). `precedente` è il pacchetto committato, se c'è. */
export function controllaVersione(nuovo: Pacchetto, precedente: Pacchetto | undefined): string | undefined {
  if (!precedente) return undefined;
  if (nuovo.versione < precedente.versione) return `${nuovo.id}: la versione del manifest (${nuovo.versione}) è sotto quella del pacchetto (${precedente.versione})`;
  if (nuovo.versione > precedente.versione) return undefined;
  // Un pacchetto della forma 1 (formato 0.1) non ha l'impronta dei modificatori: non ne risolveva nessuno, quindi vale quella vuota.
  const prima = precedente.impronte.modificatori ?? improntaModificatori({});
  const cosa = [precedente.impronte.storia !== nuovo.impronte.storia && 'la storia', precedente.impronte.cast !== nuovo.impronte.cast && 'il cast che usa',
    prima !== nuovo.impronte.modificatori && 'i modificatori che usa'].filter(Boolean);
  return cosa.length ? `${nuovo.id}: cambiato ${cosa.join(', ')} senza alzare la versione (${nuovo.versione}): alzarla in carriere.json (F13)` : undefined;
}

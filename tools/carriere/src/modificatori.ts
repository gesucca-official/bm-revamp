// CA-0e: il catalogo dei modificatori di incontro (docs/carriere/modificatori.md, formato 0.2, F11 e F12) e i suoi controlli. Funzioni
// pure: il file lo legge serbatoio.ts. La tabella di M3 è la fonte unica; i limiti dei parametri sono quelli di M2.
import {slug} from './converti.ts';
import type {Carriera, Cast, Catena, Partita, Rif} from './formato.ts';

/** Le cinque primitive del regolamento 2.3 (R08a (4)); Mazzo non c'è (DC5 (5)). */
export const PRIMITIVE = ['Vista', 'Pesca', 'Recupero', 'Bersagli', 'Protezione'] as const;
export type Primitiva = typeof PRIMITIVE[number];
export const GIOCATORE = 'giocatore';
export const COMPUTER = 'computer';

export type Modificatore = {id: string; nome: string; testo: string; primitiva: Primitiva; parametri: Record<string, string[]>};
export type Catalogo = {versione: string; voci: Record<string, Modificatore>};

type Regola = {posti: 'uno' | 'molti'} | {valori: string[]} | {da: number; a: number};
/** I parametri di ogni primitiva e i loro limiti (modificatori.md, M2). */
export const SCHEMA: Record<Primitiva, Record<string, Regola>> = {
  Vista: {chi: {posti: 'uno'}, di: {posti: 'uno'}, cosa: {valori: ['mano', 'tavolo']}},
  Pesca: {chi: {posti: 'uno'}, volte: {da: 2, a: 3}},
  Recupero: {chi: {posti: 'uno'}, ogni: {da: 2, a: 5}},
  Bersagli: {chi: {posti: 'molti'}, verso: {posti: 'molti'}},
  Protezione: {chi: {posti: 'uno'}},
};

export const INTESTAZIONE = '| Id | Nome | Testo | Primitiva | Parametri |';
const senzaCodice = (s: string) => s.trim().replace(/^`(.*)`$/, '$1').trim();

/** Legge il catalogo dal markdown e lo controlla contro il cast. Gli errori dicono la riga del catalogo. */
export function leggiCatalogo(md: string, cast: Cast): {catalogo: Catalogo; errori: string[]} {
  const errori: string[] = [];
  const righe = md.replace(/^﻿/, '').split(/\r?\n/);
  const versione = /^Versione \*\*([0-9.]+) —/m.exec(righe.join('\n'))?.[1] ?? '';
  if (!versione) errori.push('catalogo: manca la riga «Versione **x.y — …**»');
  const voci: Record<string, Modificatore> = {};
  const inizio = righe.findIndex(r => r.trim() === INTESTAZIONE);
  if (inizio < 0) return {catalogo: {versione, voci}, errori: [...errori, `catalogo: manca la tabella «${INTESTAZIONE}»`]};
  for (let i = inizio + 2; i < righe.length && righe[i].trim().startsWith('|'); i++) {
    const celle = righe[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const dove = `catalogo, riga ${i + 1}`;
    if (celle.length !== 5) { errori.push(`${dove}: servono 5 colonne, ce ne sono ${celle.length}`); continue; }
    const [id, nome, testo, primitiva, parametriTesto] = [senzaCodice(celle[0]), celle[1], celle[2], celle[3], senzaCodice(celle[4])];
    if (!nome || !testo) errori.push(`${dove}: nome e testo non possono essere vuoti`);
    if (id !== slug(nome)) errori.push(`${dove}: l'id ${id} non è il nome ridotto (${slug(nome)})`);
    if (id in voci) errori.push(`${dove}: id doppio ${id}`);
    if (!(PRIMITIVE as readonly string[]).includes(primitiva)) { errori.push(`${dove}: primitiva sconosciuta «${primitiva}» (R08a: ${PRIMITIVE.join(', ')})`); continue; }
    const parametri: Record<string, string[]> = {};
    for (const pezzo of parametriTesto.split(';').map(s => s.trim()).filter(Boolean)) {
      const m = /^([a-z]+):\s*(.+)$/.exec(pezzo);
      if (!m) { errori.push(`${dove}: parametro illeggibile «${pezzo}»`); continue; }
      if (m[1] in parametri) errori.push(`${dove}: parametro doppio ${m[1]}`);
      parametri[m[1]] = m[2].split(',').map(s => s.trim()).filter(Boolean);
    }
    const p = primitiva as Primitiva;
    errori.push(...controllaParametri(p, parametri, cast).map(e => `${dove} (${id}): ${e}`));
    voci[id] = {id, nome, testo, primitiva: p, parametri};
  }
  if (!Object.keys(voci).length) errori.push('catalogo: nessun modificatore nella tabella');
  return {catalogo: {versione, voci}, errori};
}

/** I parametri di una riga contro M2: presenti tutti e solo quelli della primitiva, posti noti, numeri nei limiti. */
export function controllaParametri(p: Primitiva, parametri: Record<string, string[]>, cast: Cast): string[] {
  const errori: string[] = [];
  const schema = SCHEMA[p];
  for (const k of Object.keys(parametri)) if (!(k in schema)) errori.push(`parametro ${k} in più per ${p}`);
  for (const [k, regola] of Object.entries(schema)) {
    const v = parametri[k];
    if (!v?.length) { errori.push(`manca il parametro ${k}`); continue; }
    if ('posti' in regola) {
      if (regola.posti === 'uno' && v.length !== 1) errori.push(`${k} vuole un posto solo`);
      for (const s of v) if (s !== GIOCATORE && s !== COMPUTER && !(s in cast.personaggi && !cast.personaggi[s].ombra)) errori.push(`${k}: posto sconosciuto ${s}`);
    } else if ('valori' in regola) {
      if (v.length !== 1 || !regola.valori.includes(v[0])) errori.push(`${k} vale ${regola.valori.join(' o ')}, non ${v.join(', ')}`);
    } else {
      const n = Number(v[0]);
      if (v.length !== 1 || !Number.isInteger(n) || n < regola.da || n > regola.a) errori.push(`${k} fuori dai limiti (da ${regola.da} a ${regola.a}): ${v.join(', ')}`);
    }
  }
  if (p === 'Vista' && parametri.chi?.[0] !== undefined && parametri.chi[0] === parametri.di?.[0]) errori.push('Vista: chi e di sono lo stesso posto');
  if (p === 'Bersagli' && parametri.chi?.includes(GIOCATORE)) errori.push('Bersagli: chi sono computer, mai il giocatore');
  return errori;
}

/** Due posti si sovrappongono se sono lo stesso, o se uno è «computer» e l'altro un avversario (M2). */
export const sovrapposti = (a: string, b: string): boolean =>
  a === b || (a === COMPUTER && b !== GIOCATORE) || (b === COMPUTER && a !== GIOCATORE);

/** Il punto a cui un modificatore deroga (R08a (6), M2): la primitiva per ogni posto `chi` (per Vista la coppia chi e di). */
function stessoPunto(a: Modificatore, b: Modificatore): boolean {
  if (a.primitiva !== b.primitiva) return false;
  const chi = a.parametri.chi.some(x => b.parametri.chi.some(y => sovrapposti(x, y)));
  return a.primitiva === 'Vista' ? chi && sovrapposti(a.parametri.di[0], b.parametri.di[0]) : chi;
}

/** Gli avversari nominati per nome dai modificatori di una partita (non `giocatore` né `computer`). */
export function nominati(ids: string[], cat: Catalogo): {modificatore: string; posto: string}[] {
  const fuori = new Set([GIOCATORE, COMPUTER]);
  return ids.flatMap(id => {
    const m = cat.voci[id];
    if (!m) return [];
    const posti = Object.entries(SCHEMA[m.primitiva]).filter(([, r]) => 'posti' in r).flatMap(([k]) => m.parametri[k] ?? []);
    return [...new Set(posti)].filter(s => !fuori.has(s)).map(posto => ({modificatore: id, posto}));
  });
}

type ConModificatori = (Partita | Catena) & {modificatori: string[]};
const partite = (c: Carriera): {nodo: string; p: ConModificatori}[] =>
  c.nodi.flatMap(n => n.passi.filter((p): p is ConModificatori => (p.tipo === 'partita' || p.tipo === 'catena') && !!p.modificatori?.length)
    .map(p => ({nodo: n.id, p})));

/** I controlli che non dipendono dal percorso (F12): nome sconosciuto, Bersagli in un duello, due modificatori sullo stesso punto. */
export function controllaModificatori(c: Carriera, cat: Catalogo): string[] {
  const errori: string[] = [];
  for (const {nodo, p} of partite(c)) {
    const dove = `partita al nodo ${nodo}`;
    const noti: Modificatore[] = [];
    for (const id of p.modificatori) {
      const m = cat.voci[id];
      if (!m) { errori.push(`${dove}: modificatore sconosciuto ${id} (non è nel catalogo dei modificatori)`); continue; }
      if (m.primitiva === 'Bersagli' && (p.tipo === 'catena' || p.modo === 'duello')) errori.push(`${dove}: ${id} è Bersagli, che vale solo in tutti contro tutti, e la partita è un duello`);
      for (const prima of noti) if (stessoPunto(prima, m)) errori.push(`${dove}: ${prima.id} e ${id} derogano allo stesso punto (${m.primitiva}) per lo stesso posto`);
      noti.push(m);
    }
  }
  return errori;
}

const risolvi = (r: Rif, segni: Record<string, string>): string[] =>
  'personaggio' in r ? [r.personaggio]
    : 'sceltaFra' in r ? (r.segno && r.segno in segni ? [segni[r.segno]] : r.sceltaFra)
    : r.segno in segni ? [segni[r.segno]] : [];

/**
 * Il controllo che dipende dal percorso (F12), dal grafo: con i segni di questo stato, ogni avversario nominato da un modificatore
 * siede al tavolo come avversario, per ogni personaggio che può prendere le parti del giocatore.
 */
export function assentiDalTavolo(p: Partita | Catena, segni: Record<string, string>, cat: Catalogo): {modificatore: string; posto: string}[] {
  const chiesti = nominati(p.modificatori ?? [], cat);
  if (!chiesti.length) return [];
  const tavoli: {giocatore: string; avversari: string[]}[] = p.tipo === 'catena'
    ? p.giocatori.map(g => ({giocatore: g.personaggio, avversari: risolvi(p.avversario, segni)}))
    : risolvi(p.giocatore, segni).map(g => ({giocatore: g,
      avversari: Array.isArray(p.avversari) ? p.avversari.flatMap(r => risolvi(r, segni)) : p.avversari.altriFra.filter(x => x !== g)}));
  // Chi gioca non è mai fra gli avversari risolti («gli altri fra» lo toglie): nominarlo è un errore come nominare un assente.
  return chiesti.filter(({posto}) => tavoli.some(t => !t.avversari.includes(posto)));
}

/** I modificatori del catalogo che la carriera usa, per id in ordine: vanno nel pacchetto con la loro impronta (F13). */
export function modificatoriUsati(c: Carriera, cat: Catalogo): Record<string, Modificatore> {
  const ids = [...new Set(partite(c).flatMap(x => x.p.modificatori))].filter(id => id in cat.voci).sort();
  return Object.fromEntries(ids.map(id => [id, cat.voci[id]]));
}

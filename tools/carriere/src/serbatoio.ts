// Le storie del serbatoio e come si leggono: una sola fonte per il comando dello strumento, il prototipo e le prove.
// Solo Node (legge i file); convertitore, validazione e grafo restano puri.
import fs from 'node:fs';
import {converti} from './converti.ts';
import {valida} from './valida.ts';
import {controllaGrafo, type Esito3} from './grafo.ts';
import type {Carriera, Cast, Problema} from './formato.ts';

export const radice = new URL('../../../', import.meta.url);

export type Voce = {file: URL; fonte: string; id: string; versione: number};
// Il manifest: per ogni carriera la storia da cui viene e la sua versione (intera, da 1). Il markdown non la dichiara (F13).
export const FILE_MANIFEST = 'tools/carriere/carriere.json';
export type Manifest = Record<string, {storia: string; versione: number}>;
export const leggiManifest = (): Manifest => JSON.parse(fs.readFileSync(new URL(FILE_MANIFEST, radice), 'utf8')) as Manifest;
// Le carriere (tutorial, prova del prototipo, campagna principale con i dialoghi veri): l'elenco è il manifest.
export const CARRIERE: Voce[] = Object.entries(leggiManifest()).map(([id, m]) =>
  ({file: new URL(m.storia, radice), fonte: m.storia, id, versione: m.versione}));
export const FILE_CAST = 'prototipi/carriere/dati/cast.json';

export const leggiCast = (): Cast => JSON.parse(fs.readFileSync(new URL(FILE_CAST, radice), 'utf8')) as Cast;

export function convertiCarriera(v: Voce, cast: Cast): {carriera: Carriera; problemi: Problema[]; validita: string[]} {
  const md = fs.readFileSync(v.file, 'utf8');
  const {carriera, problemi} = converti(md, cast, v.fonte);
  // Il controllo di validità guarda il JSON come lo leggerà il lettore: dopo un giro di serializzazione.
  const validita = problemi.some(p => p.livello === 'errore') ? [] : valida(JSON.parse(JSON.stringify(carriera)), cast);
  return {carriera, problemi, validita};
}

/** Righe e numeri della conversione di una storia (errori e avvisi compresi). `errori` conta anche gli errori di validità. */
export function riepilogoConversione(c: Carriera, problemi: Problema[], validita: string[]): {righe: string[]; errori: number} {
  const righe = [
    ...problemi.map(p => `  ${p.livello === 'errore' ? 'ERRORE' : 'avviso'} riga ${p.riga}: ${p.messaggio}`),
    ...validita.map(e => `  ERRORE validità ${e}`),
  ];
  const passi = c.nodi.flatMap(n => n.passi);
  const conta = (t: string) => passi.filter(p => p.tipo === t).length;
  const ritento = passi.reduce((s, p) => s + (p.tipo === 'partita' ? p.ritento?.length ?? 0 : 0), 0);
  const errori = problemi.filter(p => p.livello === 'errore').length + validita.length;
  righe.push(`${c.id}: ${c.nodi.length} nodi, ${conta('battuta')} battute, ${ritento} di ritento, ${conta('partita')} partite${conta('catena') ? ` e ${conta('catena')} a catena` : ''}, ` +
    `${conta('scelta')} scelte, ${conta('regia')} note di regia, ${c.achievement.length} achievement; ` +
    `${errori} errori, ${problemi.filter(p => p.livello === 'avviso').length} avvisi`);
  return {righe, errori};
}

/** Righe e numeri del controllo del grafo di una storia convertita senza errori. */
export function riepilogoGrafo(c: Carriera, r: Esito3 = controllaGrafo(c)): string[] {
  const catene = Object.entries(r.catene).map(([n, x]) => `${n} (${x.minimo} su ${x.dichiarati} su ogni percorso)`).join('; ');
  const segreti = Object.entries(r.segreti).map(([s, da]) => `${s} (da ${da.join(', ') || 'nessuno'})`).join('; ') || 'nessuno';
  return [
    ...r.errori.map(e => `  ERRORE ${e}`),
    ...r.avvisi.map(a => `  avviso ${a}`),
    `${c.id}: ${r.raggiunti.length}/${c.nodi.length} nodi raggiunti, ${r.stati} stati, fini completate ${r.fini.completata} e fallite ` +
    `${r.fini.fallita}, finali: ${Object.entries(r.finali).map(([f, n]) => `${f} (${n})`).join(', ')}, segreti: ${segreti}, ${catene ? `catene: ${catene}, ` : ''}obbligatori: ${c.obbligatori.join(', ') || 'nessuno'}; ${r.errori.length} errori, ${r.avvisi.length} avvisi`,
  ];
}

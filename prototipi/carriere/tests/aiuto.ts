// Carriere convertite per le prove: il tutorial con le integrazioni (in memoria, P1) e la mini-carriera.
import fs from 'node:fs';
import {converti} from '../src/converti.ts';
import {applicaIntegrazioni} from './integrazioni-tutorial.ts';
import type {Carriera, Cast} from '../src/formato.ts';

const leggi = (p: string) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
export const cast = JSON.parse(leggi('../dati/cast.json')) as Cast;
export const mdTutorial = applicaIntegrazioni(leggi('../../../docs/design/carriere/tutorial-dialoghi.md'));
export const mdProva = leggi('../storie/prova.md');

/** tollera: i controlli strutturali del convertitore non fermano la prova (serve per verificare il controllo del grafo da solo). */
export function carriera(md: string, tollera = false): Carriera {
  const {carriera, problemi} = converti(md, cast, 'prova');
  const e = problemi.filter(p => p.livello === 'errore');
  if (e.length && !tollera) throw new Error(e.map(x => `riga ${x.riga}: ${x.messaggio}`).join('\n'));
  return JSON.parse(JSON.stringify(carriera)) as Carriera;
}
export const tutorial = () => carriera(mdTutorial);
export const prova = () => carriera(mdProva);

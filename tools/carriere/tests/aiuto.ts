// Carriere convertite per le prove dello strumento: il tutorial e la mini-carriera di prova (cast del prototipo).
import fs from 'node:fs';
import {converti} from '../src/converti.ts';
import type {Carriera, Cast} from '../src/formato.ts';
import {leggiCatalogo} from '../src/modificatori.ts';

const leggi = (p: string) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
export const cast = JSON.parse(leggi('../../../prototipi/carriere/dati/cast.json')) as Cast;
export const mdTutorial = leggi('../../../docs/design/carriere/tutorial-dialoghi.md');
export const mdProva = leggi('../../../prototipi/carriere/storie/prova.md');
export const mdPrincipale = leggi('../../../docs/design/carriere/principale-dialoghi.md');
// CA-0e: il catalogo dei modificatori vero (docs/carriere/modificatori.md).
export const mdCatalogo = leggi('../../../docs/carriere/modificatori.md');
export const catalogo = leggiCatalogo(mdCatalogo, cast).catalogo;

/** tollera: i controlli strutturali del convertitore non fermano la prova (serve per verificare il controllo del grafo da solo). */
export function carriera(md: string, tollera = false): Carriera {
  const {carriera, problemi} = converti(md, cast, 'prova');
  const e = problemi.filter(p => p.livello === 'errore');
  if (e.length && !tollera) throw new Error(e.map(x => `riga ${x.riga}: ${x.messaggio}`).join('\n'));
  return JSON.parse(JSON.stringify(carriera)) as Carriera;
}
export const tutorial = () => carriera(mdTutorial);
export const prova = () => carriera(mdProva);

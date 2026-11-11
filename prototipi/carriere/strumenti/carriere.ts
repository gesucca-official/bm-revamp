// Le carriere del prototipo e come si leggono: una sola fonte per il convertitore, il controllo e le prove.
import fs from 'node:fs';
import {converti} from '../src/converti.ts';
import {valida} from '../src/valida.ts';
import type {Carriera, Cast, Problema} from '../src/formato.ts';

export const qui = new URL('../', import.meta.url);
const radice = new URL('../../', qui);

export type Voce = {file: URL; fonte: string};
export const CARRIERE: Voce[] = [
  {file: new URL('docs/design/carriere/tutorial-dialoghi.md', radice), fonte: 'docs/design/carriere/tutorial-dialoghi.md'},
  {file: new URL('storie/prova.md', qui), fonte: 'prototipi/carriere/storie/prova.md'},
];

export const leggiCast = (): Cast => JSON.parse(fs.readFileSync(new URL('dati/cast.json', qui), 'utf8')) as Cast;

export function convertiCarriera(v: Voce, cast: Cast): {carriera: Carriera; problemi: Problema[]; validita: string[]} {
  const md = fs.readFileSync(v.file, 'utf8');
  const {carriera, problemi} = converti(md, cast, v.fonte);
  // Il controllo di validità guarda il JSON come lo leggerà il lettore: dopo un giro di serializzazione.
  const validita = problemi.some(p => p.livello === 'errore') ? [] : valida(JSON.parse(JSON.stringify(carriera)), cast);
  return {carriera, problemi, validita};
}

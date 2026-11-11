// Dati del prototipo nel browser: cast, carriere generate da `Convert` (dati/generati, ignorati da git), asset letti dal loro posto.
import castJson from '../../dati/cast.json';
import tutorialJson from '../../dati/generati/tutorial.json';
import provaJson from '../../dati/generati/prova.json';
import type {Carriera, Cast} from '../formato.ts';
import {comeCarriera} from '../valida.ts';

export const cast = castJson as unknown as Cast;
// Il controllo di validità gira anche qui: un JSON rotto si vede subito, con il percorso del campo.
export const carriere: Carriera[] = [comeCarriera(tutorialJson, cast), comeCarriera(provaJson, cast)];

// Gli asset non si copiano (prototipo.md, «Come»): Vite li prende da docs/design/carriere/asset/tutorial.
const RADICE = '../../../../docs/design/carriere/asset/tutorial/';
const file = import.meta.glob('../../../../docs/design/carriere/asset/tutorial/{ritratti,sfondi,sprite}/*.webp',
  {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
export const asset = (rel: string): string => {
  const u = file[RADICE + rel];
  if (!u) throw new Error(`asset mancante: ${rel}`);
  return u;
};

export const nomeDi = (id: string) => cast.personaggi[id]?.nome ?? id;
export function ritratto(chi: string, espressione?: string): string | null {
  const p = cast.personaggi[chi];
  if (!p?.ritratto || p.ombra) return null;
  return asset(p.ritratto.replace('{espressione}', espressione ?? p.espressioni?.[0] ?? ''));
}
export function sfondo(id?: string, variante?: string): string | null {
  if (!id) return null;
  const s = cast.sfondi[id];
  return asset(variante && s.varianti?.[variante] ? s.varianti[variante] : s.file);
}
export function sprite(id: string, posa: string): string {
  const s = cast.sprite[id];
  return asset(s.pose[posa] ?? Object.values(s.pose)[0]);
}

/** «starter-mara» → «Starter di Mara», «carriera-principale» → «Carriera principale». */
export function nomeSblocco(id: string): string {
  const m = /^starter-(.+)$/.exec(id);
  if (m) return `Starter di ${nomeDi(m[1])}`;
  if (id === 'pvp') return 'PvP';
  const t = id.replace(/-/g, ' ');
  return t[0].toUpperCase() + t.slice(1);
}

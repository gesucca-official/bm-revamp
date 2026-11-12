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
/** Il file del ritratto, relativo alla radice degli asset (null per le figure in ombra). */
function relRitratto(chi: string, espressione?: string): string | null {
  const p = cast.personaggi[chi];
  if (!p?.ritratto || p.ombra) return null;
  return p.ritratto.replace('{espressione}', espressione ?? p.espressioni?.[0] ?? '');
}
export function ritratto(chi: string, espressione?: string): string | null {
  const rel = relRitratto(chi, espressione);
  return rel ? asset(rel) : null;
}
/** Fase F: la versione del ritratto con la bocca nell'altra posizione («<ritratto>-bocca.webp»), se l'altro esecutore l'ha consegnata. */
export function ritrattoBocca(chi: string, espressione?: string): string | null {
  const rel = relRitratto(chi, espressione)?.replace(/\.webp$/, '-bocca.webp');
  return rel ? file[RADICE + rel] ?? null : null;
}
/** Fase G: la sagoma da cui prendere la trasparenza di un ritratto consegnato con il fondo sporco (cast, «alfa»), se c'è. */
export function ritrattoAlfa(chi: string, espressione?: string): string | null {
  const da = espressione ? cast.personaggi[chi]?.alfa?.[espressione] : undefined;
  const rel = da ? relRitratto(chi, da) : null;
  return rel ? file[RADICE + rel] ?? null : null;
}
/**
 * Fase F: l'espressione di chi ascolta Piera durante uno stacco. Il cast ne indica una apposta (le esasperate); finché il suo ritratto
 * non c'è si usa quella scritta nella storia (neutra, quasi calmo).
 */
export function espressioneStacco(chi: string, scritta: string): string {
  const voluta = cast.personaggi[chi]?.stacco;
  const rel = voluta ? relRitratto(chi, voluta) : null;
  return rel && file[RADICE + rel] ? voluta! : scritta;
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

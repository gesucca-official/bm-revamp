// SB-25 Fase A: i simboli di risorse e tipi di danno come li disegna il client, in SVG, per la pagina di revisione.
//
// Uso, dalla radice del repository (Node 22.6 o più recente, che legge il TypeScript; va bene quello di .tools/client-c0):
//   node docs/design/set-base/sb-25/simboli.mjs
//
// Legge, senza modificarli, i livelli di client-web/src/symbols.ts (gli stessi del tavolo, del catalogo e dell'ispezione) e
// scrive docs/design/set-base/sb-25/simboli.json: per ogni segnaposto il markup SVG su fondo chiaro, come SymbolMark in ui.tsx.
import {writeFileSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, resolve} from 'node:path';

const qui = dirname(fileURLToPath(import.meta.url));
const radice = resolve(qui, '../../../..');
const s = await import(pathToFileURL(resolve(radice, 'client-web/src/symbols.ts')).href);
const r = await import(pathToFileURL(resolve(radice, 'client-web/src/readability.ts')).href);

// Segnaposto di oggi (risorse) e proposti (tipi di danno, D168 (1)); il nome è quello che il client dà al lettore di schermo.
const VOCI = [
  ['[[H]]', 'HEALTH', 'salute'], ['[[A]]', 'ALERTNESS', 'allerta'], ['[[V]]', 'VIOLENCE', 'violenza'],
  ['[[T]]', 'TOXICITY', 'tossicità'], ['[[L]]', 'ALCOHOL', 'alcol'],
  ['[[HIT]]', 'HIT', r.DAMAGE_NAMES.HIT], ['[[CUT]]', 'CUT', r.DAMAGE_NAMES.CUT], ['[[POISON]]', 'POISON', r.DAMAGE_NAMES.POISON],
];
const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const hex = n => '#' + n.toString(16).padStart(6, '0');
const out = {};
for (const [chiave, tipo, nome] of VOCI) {
  const edge = s.edgeFor(tipo, 'light');
  const colori = {...s.symbolColors(tipo), ...(edge !== undefined ? {edge: hex(edge)} : {})};
  const parti = s.svgParts(s.SYMBOL_LAYERS[tipo], colori, 14)
    .map(p => `<${p.tag} ${Object.entries(p.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`).join('');
  out[chiave] = {tipo, nome, svg: `<svg viewBox="-1 -1 2 2" aria-hidden="true"${edge !== undefined ? ' style="overflow:visible"' : ''}>${parti}</svg>`};
}
// I nomi delle risorse sono quelli di RESOURCE_NAMES (client-web/src/resolution.ts), scritti qui per non importare il resto del client.
writeFileSync(resolve(qui, 'simboli.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`Scritto simboli.json: ${Object.keys(out).length} simboli.`);

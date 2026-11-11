// Lettore minimo della tabella «cmap» di un TrueType: quali caratteri il font sa disegnare (formati 4 e 12, quelli dei font di Google Fonts).
// Serve alle prove per controllare che ogni font copra tutti i caratteri delle storie, accentate italiane comprese.
import fs from 'node:fs';

export function caratteriDelFont(percorso: string | URL): Set<number> {
  const b = fs.readFileSync(percorso);
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const tabelle = v.getUint16(4);
  let cmap = -1;
  for (let i = 0; i < tabelle; i++) {
    const r = 12 + i * 16;
    if (b.toString('latin1', r, r + 4) === 'cmap') cmap = v.getUint32(r + 8);
  }
  if (cmap < 0) throw new Error(`nessuna tabella cmap in ${percorso}`);
  const sotto = v.getUint16(cmap + 2);
  let migliore = -1, formatoMigliore = 0;
  for (let i = 0; i < sotto; i++) {
    const r = cmap + 4 + i * 8;
    const piattaforma = v.getUint16(r), codifica = v.getUint16(r + 2), off = cmap + v.getUint32(r + 4);
    const formato = v.getUint16(off);
    const unicode = piattaforma === 0 || (piattaforma === 3 && (codifica === 1 || codifica === 10));
    if (unicode && (formato === 12 || (formato === 4 && formatoMigliore !== 12))) { migliore = off; formatoMigliore = formato; }
  }
  const out = new Set<number>();
  if (formatoMigliore === 12) {
    const gruppi = v.getUint32(migliore + 12);
    for (let g = 0; g < gruppi; g++) {
      const r = migliore + 16 + g * 12;
      for (let c = v.getUint32(r); c <= v.getUint32(r + 4); c++) out.add(c);
    }
  } else if (formatoMigliore === 4) {
    const n = v.getUint16(migliore + 6) / 2;
    const fine = migliore + 14, inizio = fine + n * 2 + 2, delta = inizio + n * 2, rango = delta + n * 2;
    for (let s = 0; s < n; s++) {
      const a = v.getUint16(inizio + s * 2), z = v.getUint16(fine + s * 2), d = v.getInt16(delta + s * 2), ro = v.getUint16(rango + s * 2);
      for (let c = a; c <= z && c !== 0xffff; c++) {
        const glifo = ro === 0 ? (c + d) & 0xffff : v.getUint16(rango + s * 2 + ro + (c - a) * 2);
        if (glifo !== 0) out.add(c);
      }
    }
  } else throw new Error(`cmap senza sottotabella Unicode leggibile in ${percorso}`);
  return out;
}

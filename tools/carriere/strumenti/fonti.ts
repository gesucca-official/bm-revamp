// Le fonti dei pacchetti lette dal disco (condivise da Package e Check).
import fs from 'node:fs';
import {radice, type Manifest} from '../src/serbatoio.ts';
import type {Cast} from '../src/formato.ts';
import type {Fonti} from '../src/pacchetti.ts';

export const CARTELLA_PACCHETTI = 'tools/carriere/pacchetti/';

export function fontiDisco(manifest: Manifest, cast: Cast): Fonti {
  const cartella = new URL(CARTELLA_PACCHETTI, radice);
  return {
    manifest, cast,
    storia: p => fs.readFileSync(new URL(p, radice), 'utf8'),
    pacchetto: id => {
      const f = new URL(`${id}.json`, cartella);
      return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : undefined;  // un checkout con autocrlf non è un cambio
    },
    pacchetti: () => fs.existsSync(cartella) ? fs.readdirSync(cartella).map(n => n.replace(/\.json$/, '')) : [],
  };
}

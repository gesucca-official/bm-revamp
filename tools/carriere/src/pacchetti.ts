// CA-0d: i pacchetti committati contro le loro fonti, come check-rules.py controlla i file generati delle carte: quello che si
// scriverebbe oggi si confronta con quello che c'è, in sola lettura. Le letture sono iniettate: le prove lavorano in memoria.
import {converti} from './converti.ts';
import {valida} from './valida.ts';
import {costruisciPacchetto, controllaVersione, serializza, type Pacchetto} from './pacchetto.ts';
import type {Cast} from './formato.ts';
import type {Manifest} from './serbatoio.ts';

export type Fonti = {
  manifest: Manifest;
  cast: Cast;
  storia: (percorso: string) => string;                  // il markdown di una storia
  pacchetto: (id: string) => string | undefined;         // il testo del pacchetto committato, se c'è
  pacchetti: () => string[];                             // gli id dei pacchetti committati
};
export type Esito = {errori: string[]; scritture: Record<string, string>};

/** Che pacchetti si scriverebbero, e perché non si può: errori di conversione, di manifest, versioni non alzate, pacchetti in più o fuori data. */
export function esaminaPacchetti(f: Fonti, controllaScritti = true): Esito {
  const errori: string[] = [];
  const scritture: Record<string, string> = {};
  for (const [id, m] of Object.entries(f.manifest)) {
    if (!Number.isInteger(m.versione) || m.versione < 1) { errori.push(`${id}: versione del manifest non valida (${m.versione}), serve un intero da 1`); continue; }
    const md = f.storia(m.storia);
    const {carriera, problemi} = converti(md, f.cast, m.storia);
    const rotti = problemi.filter(p => p.livello === 'errore').map(p => `riga ${p.riga}: ${p.messaggio}`)
      .concat(problemi.some(p => p.livello === 'errore') ? [] : valida(JSON.parse(JSON.stringify(carriera)), f.cast));
    if (rotti.length) { errori.push(`${id}: conversione con errori (${rotti.length}), nessun pacchetto: ${rotti[0]}`); continue; }
    if (carriera.id !== id) { errori.push(`${id}: la storia ${m.storia} dà la carriera «${carriera.id}», il manifest la chiama «${id}»`); continue; }
    const nuovo = costruisciPacchetto(md, carriera, f.cast, m.versione);
    const testo = f.pacchetto(id);
    let vecchio: Pacchetto | undefined;
    if (testo !== undefined) {
      try { vecchio = JSON.parse(testo) as Pacchetto; } catch { errori.push(`${id}: il pacchetto committato non è JSON`); }
    }
    const v = controllaVersione(nuovo, vecchio);
    if (v) { errori.push(v); continue; }
    scritture[id] = serializza(nuovo);
    if (controllaScritti) {
      if (testo === undefined) errori.push(`${id}: manca il pacchetto, eseguire -Task Package`);
      else if (testo !== scritture[id]) errori.push(`${id}: il pacchetto non è quello che si genera oggi, eseguire -Task Package`);
    }
  }
  for (const id of f.pacchetti()) if (!(id in f.manifest)) errori.push(`${id}: pacchetto senza voce nel manifest (carriere.json)`);
  return {errori, scritture};
}

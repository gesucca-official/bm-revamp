// Fase C: i caratteri dei dialoghi da confrontare (prova del proprietario, impressione 2). Font SIL OFL dal repository di Google Fonts,
// salvati in prototipi/carriere/font con la loro licenza; il proprietario sceglie sul telefono con il selettore «Aa».
import {useEffect, useState} from 'react';

export type Carattere = {id: string; nome: string; famiglia: string; larghezza: number; file: string};

/**
 * larghezza: larghezza media di un carattere in em, per stimare quante righe occupa una battuta. file: relativo a prototipi/carriere
 * (le prove controllano che ogni font abbia tutti i caratteri delle storie). Secondo giro della Fase C: cinque font in più.
 */
export const CARATTERI: Carattere[] = [
  {id: 'shantell', nome: 'Shantell Sans', famiglia: "'Shantell Sans', system-ui, sans-serif", larghezza: 0.54, file: 'font/shantellsans/ShantellSans-Variabile.ttf'},
  {id: 'patrick', nome: 'Patrick Hand', famiglia: "'Patrick Hand', system-ui, sans-serif", larghezza: 0.43, file: 'font/patrickhand/PatrickHand-Regular.ttf'},
  {id: 'comic', nome: 'Comic Neue', famiglia: "'Comic Neue', system-ui, sans-serif", larghezza: 0.5, file: 'font/comicneue/ComicNeue-Regular.ttf'},
  {id: 'grandstander', nome: 'Grandstander', famiglia: "'Grandstander', system-ui, sans-serif", larghezza: 0.56, file: 'font/grandstander/Grandstander-Variabile.ttf'},
  {id: 'shortstack', nome: 'Short Stack', famiglia: "'Short Stack', system-ui, sans-serif", larghezza: 0.6, file: 'font/shortstack/ShortStack-Regular.ttf'},
  {id: 'gochi', nome: 'Gochi Hand', famiglia: "'Gochi Hand', system-ui, sans-serif", larghezza: 0.44, file: 'font/gochihand/GochiHand-Regular.ttf'},
  {id: 'kalam', nome: 'Kalam', famiglia: "'Kalam', system-ui, sans-serif", larghezza: 0.47, file: 'font/kalam/Kalam-Regular.ttf'},
  {id: 'mali', nome: 'Mali', famiglia: "'Mali', system-ui, sans-serif", larghezza: 0.53, file: 'font/mali/Mali-Regular.ttf'},
];

const CHIAVE = 'bm-carriere-prototipo-v1:carattere';
const leggi = (): Carattere => {
  try { return CARATTERI.find(c => c.id === localStorage.getItem(CHIAVE)) ?? CARATTERI[0]; } catch { return CARATTERI[0]; }
};

export function useCarattere(): [Carattere, () => void, (id: string) => void] {
  const [c, setC] = useState(leggi);
  useEffect(() => {
    document.documentElement.style.setProperty('--font-dialogo', c.famiglia);
    try { localStorage.setItem(CHIAVE, c.id); } catch { /* niente */ }
  }, [c]);
  const prossimo = () => setC(x => CARATTERI[(CARATTERI.indexOf(x) + 1) % CARATTERI.length]);
  const scegli = (id: string) => setC(CARATTERI.find(x => x.id === id) ?? CARATTERI[0]);
  return [c, prossimo, scegli];
}

/**
 * Corpo del testo perché una battuta stia in al più tre righe nella finestra (specifica, «Come appare la scena»), fra un minimo e un
 * massimo. Le frasi di Piera, gag volute più lunghe, scendono al minimo e mostrano le ultime righe.
 */
export function corpo(testo: string, larghezza: number, altezza: number, c: Carattere, min = 15, max = 34): number {
  const perAltezza = altezza / (3 * 1.3);
  const perLarghezza = (3 * larghezza) / (Math.max(testo.length, 1) * c.larghezza) * 0.92;  // 8% di margine per gli a capo
  return Math.round(Math.max(min, Math.min(max, perAltezza, perLarghezza)));
}

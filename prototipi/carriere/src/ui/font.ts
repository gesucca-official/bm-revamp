// I caratteri dei dialoghi da confrontare: font SIL OFL dal repository di Google Fonts, salvati in prototipi/carriere/font con la loro
// licenza; si sceglie nell'elenco o con «Aa» nella scena. Dalla Fase F restano solo Russo One e due alternative (gli altri sono tolti).
import {useEffect, useState} from 'react';

export type Carattere = {id: string; nome: string; famiglia: string; file: string; peso?: number; contorno?: number};

/**
 * Fase F: il proprietario ha scelto Russo One, «un po' meno grassetto». Russo One ha un solo peso: la versione alleggerita ha un contorno
 * del colore della finestra (contorno, in em) che mangia il bordo del tratto. Accanto, due font squadrati con l'asse del peso, a un peso
 * un poco più leggero di Russo One, per la scelta finale. file: relativo a prototipi/carriere (le prove controllano accentate e licenza).
 */
export const CARATTERI: Carattere[] = [
  {id: 'russo-leggero', nome: 'Russo One alleggerito', famiglia: "'Russo One', system-ui, sans-serif", file: 'font/russoone/RussoOne-Regular.ttf', contorno: 0.03},
  {id: 'russo', nome: 'Russo One', famiglia: "'Russo One', system-ui, sans-serif", file: 'font/russoone/RussoOne-Regular.ttf'},
  {id: 'changa', nome: 'Changa 600', famiglia: "'Changa', system-ui, sans-serif", file: 'font/changa/Changa-Variabile.ttf', peso: 600},
  {id: 'oxanium', nome: 'Oxanium 650', famiglia: "'Oxanium', system-ui, sans-serif", file: 'font/oxanium/Oxanium-Variabile.ttf', peso: 650},
];

const CHIAVE = 'bm-carriere-prototipo-v1:carattere';
const leggi = (): Carattere => {
  try { return CARATTERI.find(c => c.id === localStorage.getItem(CHIAVE)) ?? CARATTERI[0]; } catch { return CARATTERI[0]; }
};

export function useCarattere(): [Carattere, () => void, (id: string) => void] {
  const [c, setC] = useState(leggi);
  useEffect(() => {
    document.documentElement.style.setProperty('--font-dialogo', c.famiglia);
    document.documentElement.style.setProperty('--peso-dialogo', String(c.peso ?? 400));
    document.documentElement.style.setProperty('--contorno-dialogo', `${c.contorno ?? 0}em`);
    try { localStorage.setItem(CHIAVE, c.id); } catch { /* niente */ }
  }, [c]);
  const prossimo = () => setC(x => CARATTERI[(CARATTERI.indexOf(x) + 1) % CARATTERI.length]);
  const scegli = (id: string) => setC(CARATTERI.find(x => x.id === id) ?? CARATTERI[0]);
  return [c, prossimo, scegli];
}

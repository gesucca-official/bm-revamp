// Il carattere dei dialoghi: Russo One alleggerito, scelto dal proprietario nella Fase F («un po' meno grassetto»), font SIL OFL dal
// repository di Google Fonts, salvato in prototipi/carriere/font con la sua licenza. Fino alla Fase J c'erano accanto Russo One pieno,
// Changa e Oxanium da confrontare (con «Aa» nella scena e il campionario nell'elenco): tolti nella Fase K, la chiusura del prototipo.

export type Carattere = {id: string; nome: string; famiglia: string; file: string; contorno: number};

/**
 * Russo One ha un solo peso: la versione alleggerita ha un contorno del colore della finestra (contorno, in em) che mangia il bordo del
 * tratto. file: relativo a prototipi/carriere (le prove controllano accentate e licenza).
 */
export const CARATTERE: Carattere = {id: 'russo-leggero', nome: 'Russo One alleggerito', famiglia: "'Russo One', system-ui, sans-serif",
  file: 'font/russoone/RussoOne-Regular.ttf', contorno: 0.03};

/** Mette il carattere nelle variabili CSS dei dialoghi. */
export function applicaCarattere(c: Carattere = CARATTERE) {
  document.documentElement.style.setProperty('--font-dialogo', c.famiglia);
  document.documentElement.style.setProperty('--peso-dialogo', '400');
  document.documentElement.style.setProperty('--contorno-dialogo', `${c.contorno}em`);
}

// Il progresso sta nel browser (prototipo.md, «Fuori»: niente server né account). Una chiave per carriera, con la versione del formato.
import type {Carriera} from '../formato.ts';
import {completa, nuovoAccount, nuovoGiro, type Stato} from '../motore.ts';

const PREFISSO = 'bm-carriere-prototipo-v1:';

export function carica(c: Carriera): Stato {
  try {
    const t = localStorage.getItem(PREFISSO + c.id);
    if (t) {
      const s = completa(JSON.parse(t) as Stato);
      // Un salvataggio che punta a nodi non più esistenti (storia cambiata) riparte da un giro nuovo, conservando l'account.
      if (!s.giro.nodo || c.nodi.some(n => n.id === s.giro.nodo)) return s;
      return nuovoGiro(c, s.account, s.giro);
    }
  } catch { /* storage assente o rotto: si riparte */ }
  return nuovoGiro(c, nuovoAccount());
}

export function salva(c: Carriera, s: Stato) {
  try { localStorage.setItem(PREFISSO + c.id, JSON.stringify(s)); } catch { /* storage pieno o vietato: si gioca senza salvare */ }
}

export function azzeraTutto() {
  try { for (const k of Object.keys(localStorage)) if (k.startsWith(PREFISSO)) localStorage.removeItem(k); } catch { /* niente */ }
}

export function caricaNome(): string {
  try { return localStorage.getItem(PREFISSO + 'nome') || 'Giocatore'; } catch { return 'Giocatore'; }
}
export function salvaNome(n: string) {
  try { localStorage.setItem(PREFISSO + 'nome', n); } catch { /* niente */ }
}

/**
 * Fase G: cosa ricorda la bacheca di una carriera dall'ultima volta che si è vista, per muoversi quando cambia: dov'era la puntina «sei qui»,
 * quali nodi avevano il post-it, la lettera caduta (al più una) e quante ne ha rimesse a posto il giocatore. Azzera tutto la cancella.
 */
export type MemoriaBacheca = {seiQui: string | null; postit: string[]; caduta: {id: string; k: number} | null; rimesse: number;
  /** Fasi I e J: i nodi chiusi con il post-it (strappato) e in che giro. */ chiusi?: string[]; giro?: number};
export function caricaBacheca(id: string): MemoriaBacheca | null {
  try { const t = localStorage.getItem(`${PREFISSO}bacheca:${id}`); return t ? JSON.parse(t) as MemoriaBacheca : null; } catch { return null; }
}
export function salvaBacheca(id: string, m: MemoriaBacheca) {
  try { localStorage.setItem(`${PREFISSO}bacheca:${id}`, JSON.stringify(m)); } catch { /* niente */ }
}

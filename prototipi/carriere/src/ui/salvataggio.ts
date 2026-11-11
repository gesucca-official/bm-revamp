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

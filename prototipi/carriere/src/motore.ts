// CA-0a: stato del giro e dell'account, condizioni e avanzamento dentro i nodi. Funzioni pure, senza React né browser:
// le stesse le usano l'interfaccia e le prove. Le regole sono quelle della proposta (prototipo-fase-a.md, «Il formato dei dati»),
// con le risposte del proprietario P2 (battute di ritento a turno), P3 (la sconfitta che apre un ramo porta lì da sola) e P7 (finali).
import {usciteDi, type Achievement, type Battuta, type Carriera, type Condizione, type Destinazione, type Esito, type Nodo, type Opzione, type Partita,
  type Passo, type Rif, type Scelta} from './formato.ts';
import {slug} from './converti.ts';

export type Scena = {sfondo?: string; variante?: string; sprite: Record<string, string>};  // sprite: id -> posa ('' = la prima)

/** La storia di un giro: si azzera con un nuovo giro (D16). */
export type Giro = {
  numero: number;
  nodo: string | null;          // null: sulla mappa, o a fine giro
  passo: number;
  ritento: number | null;       // battuta di ritento mostrata prima di rigiocare la partita
  sconfitta: boolean;           // schermata dopo la sconfitta
  tentativi: Record<string, number>;  // sconfitte per nodo in questo giro: scelgono la battuta di ritento (P2)
  segni: Record<string, string>;
  visti: string[];
  vinti: string[];
  persi: string[];
  prossimi: Destinazione[];     // cosa offre la mappa
  fine: Esito | null;
  finale: string | null;        // id del finale raggiunto (P7)
  scena: Scena;
  nuovi: {sblocchi: string[]; achievement: string[]};  // presi in questo giro, per il riepilogo
  scelto?: string | null;      // mockup della principale 0.3: chi gioca la partita «a scelta» del nodo, scelto prima della partita
};

/** Ciò che resta sull'account fra un giro e l'altro (D16), compresi i finali visti (P7). */
export type Account = {esplorati: string[]; sblocchi: string[]; achievement: string[]; finali: string[]; giri: number};
export type Stato = {giro: Giro; account: Account};

export type Evento = {tipo: 'scossa'} | {tipo: 'sfarfallio'; variante?: string} | {tipo: 'suono'; suono: string}
  | {tipo: 'esce'; sprite: string; posa?: string} | {tipo: 'sblocco'; sblocco: string} | {tipo: 'achievement'; achievement: string}
  | {tipo: 'ramo'};  // una sconfitta ha aperto un'altra strada

export type Finale = {id: string; titolo: string; esito: Esito};

export type Vista =
  | {tipo: 'mappa'}
  | {tipo: 'fine'; esito: Esito; finale: Finale}
  | {tipo: 'battuta'; battuta: Battuta}
  | {tipo: 'narrazione'; testo: string}
  | {tipo: 'messaggio'; da?: string; testo: string}
  | {tipo: 'scelta'; scelta: Scelta; opzioni: {indice: number; opzione: Opzione}[]}
  // giocatore null: la partita è «a scelta» e il giocatore deve ancora scegliere fra aScelta (mockup della principale 0.3).
  | {tipo: 'partita'; partita: Partita; giocatore: string | null; aScelta?: string[]; avversari: string[]; sblocchi: string[]}
  | {tipo: 'sconfitta'; partita: Partita}
  | {tipo: 'ritento'; battuta: Battuta};

export const nuovoAccount = (): Account => ({esplorati: [], sblocchi: [], achievement: [], finali: [], giri: 0});

export function nuovoGiro(c: Carriera, account: Account, precedente?: Giro): Stato {
  return {account, giro: {numero: (precedente?.numero ?? 0) + 1, nodo: null, passo: 0, ritento: null, sconfitta: false, tentativi: {}, segni: {},
    visti: [], vinti: [], persi: [], prossimi: [{nodo: c.inizio}], fine: null, finale: null, scena: {sprite: {}}, nuovi: {sblocchi: [], achievement: []}}};
}

/** Un salvataggio di prima delle risposte P2 e P7 non ha alcuni campi: si completano. */
export function completa(s: Stato): Stato {
  s.giro.tentativi ??= {};
  s.giro.finale ??= s.giro.fine ? s.giro.fine : null;
  s.account.finali ??= [];
  return s;
}

/** Id di un finale: il suo titolo, o l'esito per una fine senza nome. */
export const idFinale = (d: {fine: Esito; finale?: string}) => d.finale ? slug(d.finale) : d.fine;

/** I finali della carriera, dalle destinazioni (P7). */
export function finali(c: Carriera): Finale[] {
  const out = new Map<string, Finale>();
  const vedi = (d: Destinazione | undefined) => {
    if (d && 'fine' in d) out.set(idFinale(d), {id: idFinale(d), titolo: d.finale ?? (d.fine === 'completata' ? 'Completata' : 'Fallita'), esito: d.fine});
  };
  for (const n of c.nodi) {
    for (const p of n.passi) {
      if (p.tipo === 'partita') vedi(p.sconfitta);
      if (p.tipo === 'scelta') p.opzioni.forEach(o => vedi(o.verso));
    }
    for (const u of usciteDi(n)) vedi(u.verso);
  }
  return [...out.values()];
}

export const nodo = (c: Carriera, id: string): Nodo => {
  const n = c.nodi.find(x => x.id === id);
  if (!n) throw new Error(`nodo sconosciuto: ${id}`);
  return n;
};

export function valuta(cond: Condizione | undefined, s: Stato): boolean {
  if (!cond) return true;
  if ('non' in cond) return !valuta(cond.non, s);
  if ('tutti' in cond) return cond.tutti.every(x => valuta(x, s));
  if ('uno' in cond) return cond.uno.some(x => valuta(x, s));
  if ('segno' in cond) return cond.uguale === undefined ? cond.segno in s.giro.segni : s.giro.segni[cond.segno] === cond.uguale;
  if ('visto' in cond) return s.giro.visti.includes(cond.visto);
  if ('vinto' in cond) return s.giro.vinti.includes(cond.vinto);
  if ('perso' in cond) return s.giro.persi.includes(cond.perso);
  if ('esplorato' in cond) return s.account.esplorati.includes(cond.esplorato);
  if ('achievement' in cond) return s.account.achievement.includes(cond.achievement);
  if ('finale' in cond) return s.account.finali.includes(cond.finale);
  return s.account.giri >= cond.giri;
}

export const risolvi = (r: Rif, s: Stato): string => 'personaggio' in r ? r.personaggio
  : 'sceltaFra' in r ? (r.segno && s.giro.segni[r.segno]) || s.giro.scelto || '?' : s.giro.segni[r.segno] ?? '?';
/** Mockup della principale 0.3: i personaggi fra cui scegliere chi gioca, se la partita è «a scelta» e il segno davanti non è assegnato. */
const daScegliere = (r: Rif, s: Stato): string[] | null => 'sceltaFra' in r && !(r.segno && s.giro.segni[r.segno]) ? r.sceltaFra : null;

export function avversari(p: Partita, s: Stato): string[] {
  if (Array.isArray(p.avversari)) return p.avversari.map(r => risolvi(r, s));
  const g = risolvi(p.giocatore, s);
  return p.avversari.altriFra.filter(x => x !== g);
}

const MOSTRATI = new Set(['battuta', 'narrazione', 'messaggio']);
const visibile = (p: Passo, s: Stato) => !('se' in p) || valuta(p.se, s);

/** La schermata che lo stato chiede di mostrare. */
export function vista(c: Carriera, s: Stato): Vista {
  const g = s.giro;
  if (g.fine) {
    const id = g.finale ?? g.fine;
    return {tipo: 'fine', esito: g.fine, finale: finali(c).find(f => f.id === id) ?? {id, titolo: id, esito: g.fine}};
  }
  if (!g.nodo) return {tipo: 'mappa'};
  const p = nodo(c, g.nodo).passi[g.passo];
  if (!p) return {tipo: 'mappa'};
  if (p.tipo === 'partita') {
    if (g.sconfitta) return {tipo: 'sconfitta', partita: p};
    if (g.ritento !== null && p.ritento?.[g.ritento]) return {tipo: 'ritento', battuta: p.ritento[g.ritento]};
    const fra = daScegliere(p.giocatore, s);
    return {tipo: 'partita', partita: p, giocatore: fra && !(g.scelto && fra.includes(g.scelto)) ? null : risolvi(p.giocatore, s), ...(fra ? {aScelta: fra} : {}),
      avversari: avversari(p, s), sblocchi: sblocchiDopo(c, g.nodo, g.passo, s)};
  }
  if (p.tipo === 'battuta') return {tipo: 'battuta', battuta: p};
  if (p.tipo === 'narrazione') return {tipo: 'narrazione', testo: p.testo};
  if (p.tipo === 'messaggio') return {tipo: 'messaggio', ...(p.da ? {da: p.da} : {}), testo: p.testo};
  if (p.tipo === 'scelta') return {tipo: 'scelta', scelta: p, opzioni: p.opzioni.map((opzione, indice) => ({indice, opzione})).filter(o => valuta(o.opzione.se, s))};
  return {tipo: 'mappa'};
}

/** Gli sblocchi che seguono una partita, fino al passo mostrato successivo: arrivano con la vittoria. */
export function sblocchiDopo(c: Carriera, idNodo: string, passo: number, s?: Stato): string[] {
  const out: string[] = [];
  for (const p of nodo(c, idNodo).passi.slice(passo + 1)) {
    if (MOSTRATI.has(p.tipo) || p.tipo === 'partita' || p.tipo === 'scelta') break;
    if (p.tipo === 'sblocco' && (!p.se || (s && valuta(p.se, s)))) out.push(p.sblocco);
  }
  return out;
}

type Risultato = {stato: Stato; eventi: Evento[]};
const copia = (s: Stato): Stato => structuredClone(s);
const aggiungi = (l: string[], x: string) => { if (!l.includes(x)) l.push(x); };

/** Applica un passo che non si mostra. */
function applica(s: Stato, p: Passo, eventi: Evento[], silenzioso: boolean) {
  const g = s.giro;
  switch (p.tipo) {
    case 'sfondo':
      // Un altro luogo svuota la scena (la bici di Mara resta fuori dal bar); una variante dello stesso sfondo no.
      if (g.scena.sfondo !== p.sfondo) g.scena.sprite = {};
      g.scena.sfondo = p.sfondo;
      if (p.variante) g.scena.variante = p.variante; else delete g.scena.variante;
      break;
    case 'sprite':
      // Chi esce sparisce dalla scena; l'interfaccia lo fa uscire con la sua posa (la combriccola in fuga).
      if (p.azione === 'esce') { delete g.scena.sprite[p.sprite]; if (!silenzioso) eventi.push({tipo: 'esce', sprite: p.sprite, ...(p.posa ? {posa: p.posa} : {})}); }
      else g.scena.sprite[p.sprite] = p.posa ?? '';
      break;
    case 'effetto': if (!silenzioso) eventi.push(p.effetto === 'scossa' ? {tipo: 'scossa'} : {tipo: 'sfarfallio', ...(p.variante ? {variante: p.variante} : {})}); break;
    case 'suono': if (!silenzioso) eventi.push({tipo: 'suono', suono: p.suono}); break;
    case 'segno': if (!p.se || valuta(p.se, s)) g.segni[p.segno] = p.valore; break;
    case 'sblocco': if (!p.se || valuta(p.se, s)) sblocca(s, p.sblocco, eventi); break;
    case 'achievement': ottieni(s, p.achievement, eventi); break;
    default: break;
  }
}

function sblocca(s: Stato, id: string, eventi: Evento[]) {
  if (!s.account.sblocchi.includes(id)) { s.account.sblocchi.push(id); eventi.push({tipo: 'sblocco', sblocco: id}); }
  aggiungi(s.giro.nuovi.sblocchi, id);
}
function ottieni(s: Stato, id: string, eventi: Evento[]) {
  if (s.account.achievement.includes(id)) return;
  s.account.achievement.push(id);
  aggiungi(s.giro.nuovi.achievement, id);
  eventi.push({tipo: 'achievement', achievement: id});
}

/** Gli achievement con «quando» si controllano dopo ogni azione. */
function controllaAchievement(c: Carriera, s: Stato, eventi: Evento[]) {
  for (let cambiato = true; cambiato;) {
    cambiato = false;
    for (const a of c.achievement) if (a.quando && !s.account.achievement.includes(a.id) && valuta(a.quando, s)) { ottieni(s, a.id, eventi); cambiato = true; }
  }
}

/**
 * Porta avanti il nodo fino a una schermata da mostrare.
 * modo 'normale': si ferma a battute, scelte e partite; 'salta': salta anche battute, narrazioni e messaggi; 'scelta': salta anche le
 * partite (già giocate), per il ritorno alla scelta.
 */
function assesta(c: Carriera, s: Stato, eventi: Evento[], modo: 'normale' | 'salta' | 'scelta') {
  const g = s.giro;
  while (g.nodo) {
    const n = nodo(c, g.nodo);
    const p = n.passi[g.passo];
    if (!p) {
      // Mockup della principale 0.3: delle uscite condizionate vale la prima la cui condizione vale.
      const u = usciteDi(n).find(x => valuta(x.se, s));
      if (u) esci(s, u.verso);
      else throw new Error(`il nodo ${n.id} è finito senza uscita`);
      return;
    }
    if (MOSTRATI.has(p.tipo)) { if (modo === 'normale' && visibile(p, s)) return; g.passo++; continue; }
    if (p.tipo === 'scelta') {
      // Una scelta «se c'è» senza opzioni visibili si salta.
      if (p.facoltativa && !p.opzioni.some(o => valuta(o.se, s))) { g.passo++; continue; }
      return;
    }
    if (p.tipo === 'partita') { if (modo === 'scelta') { g.passo++; continue; } return; }
    applica(s, p, eventi, modo !== 'normale');
    g.passo++;
  }
}

function esci(s: Stato, d: Destinazione) {
  const g = s.giro;
  g.nodo = null; g.passo = 0; g.ritento = null; g.sconfitta = false;
  if ('fine' in d) { g.fine = d.fine; g.finale = idFinale(d); aggiungi(s.account.finali, g.finale); g.prossimi = []; s.account.giri++; }
  else g.prossimi = [d];
}

const fatto = (c: Carriera, s: Stato, eventi: Evento[]): Risultato => { controllaAchievement(c, s, eventi); return {stato: s, eventi}; };

/** Entrare in un nodo dalla mappa. */
/** Fase H: un achievement che non viene da un passo della storia (la bacheca: la lettera rimessa al suo posto). */
export function ottieniAchievement(_c: Carriera, s0: Stato, id: string): Risultato {
  const s = copia(s0); const eventi: Evento[] = [];
  ottieni(s, id, eventi);
  return {stato: s, eventi};
}

export function entra(c: Carriera, s0: Stato, id: string): Risultato {
  const d = s0.giro.prossimi.find(x => 'nodo' in x && x.nodo === id);
  if (!d || !('nodo' in d)) throw new Error(`il nodo ${id} non è disponibile`);
  if (!entrabile(c, s0, id)) throw new Error(`la condizione del nodo ${id} non vale`);
  const s = copia(s0); const eventi: Evento[] = [];
  const g = s.giro;
  g.nodo = id; g.passo = 0; g.prossimi = [];
  aggiungi(g.visti, id); aggiungi(s.account.esplorati, id);
  assesta(c, s, eventi, d.da === 'scelta' ? 'scelta' : 'normale');
  return fatto(c, s, eventi);
}

export const entrabile = (c: Carriera, s: Stato, id: string) => valuta(nodo(c, id).condizione, s);

/** Tocco su una battuta, una narrazione, un messaggio o la battuta di ritento. */
export function avanti(c: Carriera, s0: Stato): Risultato {
  const s = copia(s0); const eventi: Evento[] = [];
  const v = vista(c, s0);
  if (v.tipo === 'ritento') { s.giro.ritento = null; return fatto(c, s, eventi); }
  if (v.tipo !== 'battuta' && v.tipo !== 'narrazione' && v.tipo !== 'messaggio') throw new Error(`avanti non vale su ${v.tipo}`);
  s.giro.passo++;
  assesta(c, s, eventi, 'normale');
  return fatto(c, s, eventi);
}

/** «Salta»: fino alla prossima scelta o partita, o alla fine del nodo; durante il ritento, dritto alla partita (D15). */
export function salta(c: Carriera, s0: Stato): Risultato {
  const s = copia(s0); const eventi: Evento[] = [];
  const v = vista(c, s0);
  if (v.tipo === 'ritento') { s.giro.ritento = null; return fatto(c, s, eventi); }
  if (v.tipo !== 'battuta' && v.tipo !== 'narrazione' && v.tipo !== 'messaggio') return {stato: s0, eventi};
  s.giro.passo++;
  assesta(c, s, eventi, 'salta');
  return fatto(c, s, eventi);
}

export function scegli(c: Carriera, s0: Stato, indice: number): Risultato {
  const v = vista(c, s0);
  if (v.tipo !== 'scelta' || !v.opzioni.some(o => o.indice === indice)) throw new Error('opzione non disponibile');
  const s = copia(s0); const eventi: Evento[] = [];
  const o = v.scelta.opzioni[indice];
  Object.assign(s.giro.segni, o.segni ?? {});
  for (const id of o.sblocchi ?? []) sblocca(s, id, eventi);
  if (o.verso) esci(s, o.verso);
  else { s.giro.passo++; assesta(c, s, eventi, 'normale'); }
  return fatto(c, s, eventi);
}

/** Mockup della principale 0.3: prima di una partita «a scelta», chi gioca per te. */
export function scegliGiocatore(c: Carriera, s0: Stato, chi: string): Risultato {
  const v = vista(c, s0);
  if (v.tipo !== 'partita' || !v.aScelta?.includes(chi)) throw new Error(`${chi} non si può scegliere qui`);
  const s = copia(s0);
  s.giro.scelto = chi;
  return {stato: s, eventi: []};
}

export function vinci(c: Carriera, s0: Stato): Risultato {
  const v0 = vista(c, s0);
  if (v0.tipo !== 'partita') throw new Error('nessuna partita da vincere');
  if (v0.giocatore === null) throw new Error('prima si sceglie chi gioca');
  const s = copia(s0); const eventi: Evento[] = [];
  s.giro.scelto = null;
  aggiungi(s.giro.vinti, s.giro.nodo!);
  s.giro.passo++;
  assesta(c, s, eventi, 'normale');
  return fatto(c, s, eventi);
}

/** Una sconfitta che apre un ramo porta lì da sola (P3); le altre portano alla schermata del ritento. */
export function perdi(c: Carriera, s0: Stato): Risultato {
  const v = vista(c, s0);
  if (v.tipo !== 'partita') throw new Error('nessuna partita da perdere');
  if (v.giocatore === null) throw new Error('prima si sceglie chi gioca');
  const s = copia(s0); const eventi: Evento[] = [];
  const g = s.giro;
  g.scelto = null;
  aggiungi(g.persi, g.nodo!);
  g.tentativi[g.nodo!] = (g.tentativi[g.nodo!] ?? 0) + 1;
  if (v.partita.sconfitta) { esci(s, v.partita.sconfitta); eventi.push({tipo: 'ramo'}); }
  else g.sconfitta = true;
  return fatto(c, s, eventi);
}

/** Dopo la sconfitta: una battuta di ritento, a turno fra quelle scritte (P2, saltabile), poi di nuovo la partita. */
export function ritenta(c: Carriera, s0: Stato): Risultato {
  const v = vista(c, s0);
  if (v.tipo !== 'sconfitta') throw new Error('nessuna sconfitta');
  const s = copia(s0);
  const n = v.partita.ritento?.length ?? 0;
  s.giro.sconfitta = false;
  s.giro.ritento = n ? ((s.giro.tentativi[s.giro.nodo!] ?? 1) - 1) % n : null;
  return fatto(c, s, []);
}

/** L'indizio da mostrare: l'ultimo la cui condizione vale (D19). */
export function indizio(a: Achievement, s: Stato): string | null {
  let out: string | null = null;
  for (const i of a.indizi) if (valuta(i.se, s)) out = i.testo;
  return out;
}

/** Testo con il nome del giocatore. */
export const conNome = (t: string, giocatore: string) => t.replaceAll('{giocatore}', giocatore);

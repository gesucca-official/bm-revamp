// CA-0a: controllo del grafo di una carriera, come check-rules.py per le carte (punto 7 del perimetro).
// Esplora gli stati raggiungibili di un giro (nodo, segni, nodi visti, partite vinte e perse, sblocchi presi) con le condizioni valutate
// davvero. Gli atomi dell'account (esplorato, achievement, finale, giri) dipendono da altri giri: valgono «forse», cioè tutte e due le
// possibilità (decisione T6 della regia), con un tetto di 200 000 stati.
import {usciteDi, type Carriera, type Condizione, type Destinazione, type Esito, type Passo} from './formato.ts';
import {idFinale} from './motore.ts';

export const TETTO_STATI = 200_000;

type Tre = 'v' | 'f' | '?';
type Locale = {segni: Record<string, string>; visti: string[]; vinti: string[]; persi: string[]; sblocchi: string[]; achievement: string[]};
type Ingresso = {nodo: string; daScelta: boolean; l: Locale};

export type Esito3 = {
  errori: string[];
  avvisi: string[];
  stati: number;
  fini: Record<Esito, number>;     // stati di fine distinti per esito
  finali: Record<string, number>;  // stati di fine distinti per finale (P7)
  raggiunti: string[];             // nodi
  segreti: Record<string, string[]>;  // nodo segreto -> nodi da cui ci si arriva
};

export function controllaGrafo(c: Carriera, tetto = TETTO_STATI): Esito3 {
  const errori = new Set<string>();
  const avvisi = new Set<string>();
  const nodi = new Map(c.nodi.map(n => [n.id, n]));
  const raggiunti = new Set<string>();
  const battuteViste = new Set<string>();        // `${nodo}:${riga}` delle battute con condizione mostrate almeno una volta
  const achievementDati = new Set<string>();
  const istantanee: Locale[] = [];               // stato a fine nodo e a fine giro, per achievement e indizi
  const fini: {esito: Esito; finale: string; l: Locale}[] = [];
  const archiStato = new Map<string, Set<string>>();
  const verso = new Map<string, Set<string>>();  // nodo -> nodi da cui si entra (per i segreti)
  // Mockup della principale (21 partite, scelte «a scelta»): nella chiave dello stato entrano solo i segni e i nodi che qualche condizione o
  // qualche partita legge davvero. Due stati che differiscono in altro (un segno mai letto, una partita vinta al primo colpo o dopo un
  // ritento senza che nessuno chieda «perso») si comportano allo stesso modo: tenerli distinti faceva superare il tetto degli stati.
  const letti = {segni: new Set<string>(), visto: new Set<string>(), vinto: new Set<string>(), perso: new Set<string>()};
  const leggi = (x: Condizione | undefined): void => {
    if (!x) return;
    if ('non' in x) return leggi(x.non);
    if ('tutti' in x) return x.tutti.forEach(leggi);
    if ('uno' in x) return x.uno.forEach(leggi);
    if ('segno' in x) letti.segni.add(x.segno);
    if ('visto' in x) letti.visto.add(x.visto);
    if ('vinto' in x) letti.vinto.add(x.vinto);
    if ('perso' in x) letti.perso.add(x.perso);
  };
  for (const n of c.nodi) {
    leggi(n.condizione);
    for (const p of n.passi) {
      if ('se' in p) leggi(p.se);
      if (p.tipo === 'scelta') p.opzioni.forEach(o => leggi(o.se));
      if (p.tipo === 'partita') for (const r of [p.giocatore, ...(Array.isArray(p.avversari) ? p.avversari : [])]) if ('segno' in r && r.segno) letti.segni.add(r.segno);
    }
  }
  for (const a of c.achievement) { leggi(a.quando); a.indizi.forEach(x => leggi(x.se)); }
  const solo = (xs: string[], dentro: Set<string>) => xs.filter(x => dentro.has(x)).sort();
  const segniLetti = (l: Locale) => Object.entries(l.segni).filter(([k]) => letti.segni.has(k)).sort();
  const chiave = (i: Ingresso) => JSON.stringify([i.nodo, i.daScelta, segniLetti(i.l), solo(i.l.visti, letti.visto),
    solo(i.l.vinti, letti.vinto), solo(i.l.persi, letti.perso), [...i.l.sblocchi].sort(), [...i.l.achievement].sort()]);
  const chiaveFine = (e: Esito, finale: string, l: Locale) => `fine:${e}:${finale}` + JSON.stringify([[...l.sblocchi].sort(), segniLetti(l)]);
  const fineVista = new Set<string>();

  // Logica a tre valori: gli atomi dell'account sono «forse», salvo giri 0 che vale sempre.
  const val = (cond: Condizione | undefined, l: Locale): Tre => {
    if (!cond) return 'v';
    if ('non' in cond) { const x = val(cond.non, l); return x === '?' ? '?' : x === 'v' ? 'f' : 'v'; }
    if ('tutti' in cond) { const xs = cond.tutti.map(y => val(y, l)); return xs.includes('f') ? 'f' : xs.every(y => y === 'v') ? 'v' : '?'; }
    if ('uno' in cond) { const xs = cond.uno.map(y => val(y, l)); return xs.includes('v') ? 'v' : xs.every(y => y === 'f') ? 'f' : '?'; }
    const b = (x: boolean): Tre => x ? 'v' : 'f';
    if ('segno' in cond) return b(cond.uguale === undefined ? cond.segno in l.segni : l.segni[cond.segno] === cond.uguale);
    if ('visto' in cond) return b(l.visti.includes(cond.visto));
    if ('vinto' in cond) return b(l.vinti.includes(cond.vinto));
    if ('perso' in cond) return b(l.persi.includes(cond.perso));
    if ('giri' in cond) return cond.giri <= 0 ? 'v' : '?';
    return '?';  // esplorato, achievement, finale
  };

  const coda: Ingresso[] = [];
  const visti = new Set<string>();
  const accoda = (da: string | null, i: Ingresso) => {
    const k = chiave(i);
    if (da) (archiStato.get(da) ?? archiStato.set(da, new Set()).get(da)!).add(k);
    if (visti.has(k)) return;
    visti.add(k);
    coda.push(i);
  };
  accoda(null, {nodo: c.inizio, daScelta: false, l: {segni: {}, visti: [], vinti: [], persi: [], sblocchi: [], achievement: []}});

  const copia = (l: Locale): Locale => ({segni: {...l.segni}, visti: [...l.visti], vinti: [...l.vinti], persi: [...l.persi], sblocchi: [...l.sblocchi], achievement: [...l.achievement]});
  const metti = (xs: string[], x: string) => { if (!xs.includes(x)) xs.push(x); };

  while (coda.length) {
    if (visti.size > tetto) { errori.add(`troppi stati (più di ${tetto}): il grafo va semplificato o il tetto rivisto`); break; }
    const ing = coda.shift()!;
    const da = chiave(ing);
    const n = nodi.get(ing.nodo);
    if (!n) { errori.add(`destinazione verso un nodo che non esiste: ${ing.nodo}`); continue; }
    const entrata = val(n.condizione, ing.l);
    if (entrata === 'f') { errori.add(`vicolo cieco: si arriva al nodo ${n.id} quando la sua condizione non vale`); continue; }
    raggiunti.add(n.id);
    const l0 = copia(ing.l);
    metti(l0.visti, n.id);

    const successore = (d: Destinazione, l: Locale) => {
      istantanee.push(l);
      if ('fine' in d) {
        const finale = idFinale(d);
        const k = chiaveFine(d.fine, finale, l);
        (archiStato.get(da) ?? archiStato.set(da, new Set()).get(da)!).add(k);
        if (!fineVista.has(k)) { fineVista.add(k); fini.push({esito: d.fine, finale, l}); }
        return;
      }
      (verso.get(d.nodo) ?? verso.set(d.nodo, new Set()).get(d.nodo)!).add(n.id);
      accoda(da, {nodo: d.nodo, daScelta: d.da === 'scelta', l});
    };

    const segnoAssegnato = (p: Passo, l: Locale) => {
      if (p.tipo !== 'partita') return;
      const rifs = [p.giocatore, ...(Array.isArray(p.avversari) ? p.avversari : [])];
      for (const r of rifs) if ('segno' in r && r.segno && !('sceltaFra' in r) && !(r.segno in l.segni)) errori.add(`partita al nodo ${n.id}: il segno ${r.segno} non è assegnato su qualche percorso`);
    };

    // Cammina i passi del nodo; le partite e le scelte senza destinazione biforcano.
    const cammina = (i: number, l: Locale, daScelta: boolean): void => {
      for (; i < n.passi.length; i++) {
        const p = n.passi[i];
        switch (p.tipo) {
          case 'battuta': case 'narrazione': case 'messaggio':
            if (p.se && !daScelta && val(p.se, l) !== 'f') battuteViste.add(`${n.id}:${p.riga}`);
            break;
          case 'segno': case 'sblocco': {
            // Mockup della principale: un segno o uno sblocco con condizione. Se la condizione è «forse» (un atomo dell'account), le due strade.
            const v = p.se ? val(p.se, l) : 'v';
            if (v === 'f') break;
            if (v === '?') cammina(i + 1, copia(l), daScelta);
            if (p.tipo === 'segno') l.segni[p.segno] = p.valore; else metti(l.sblocchi, p.sblocco);
            break;
          }
          case 'achievement': metti(l.achievement, p.achievement); achievementDati.add(p.achievement); break;
          case 'partita': {
            if (daScelta) break;  // ritorno alla scelta: la partita è già stata giocata
            segnoAssegnato(p, l);
            if (p.sconfitta) {
              // Una sconfitta che apre un ramo porta lì da sola, senza ritento (P3).
              const lp = copia(l); metti(lp.persi, n.id); successore(p.sconfitta, lp);
            } else {
              // Vittoria dopo una sconfitta e un ritento: «perso» cambia, quindi è un altro stato.
              const dopoRitento = copia(l); metti(dopoRitento.persi, n.id); metti(dopoRitento.vinti, n.id);
              cammina(i + 1, dopoRitento, false);
            }
            metti(l.vinti, n.id);  // vittoria al primo colpo
            break;
          }
          case 'scelta': {
            const vis = p.opzioni.map(o => val(o.se, l));
            // Mockup della principale 0.3: una scelta «se c'è» senza opzioni visibili si salta.
            if (p.facoltativa && !vis.includes('v')) cammina(i + 1, copia(l), daScelta);
            if (p.facoltativa && vis.every(x => x === 'f')) return;
            if (vis.every(x => x === 'f')) { errori.add(`scelta senza opzioni visibili al nodo ${n.id} (riga ${p.riga}) su qualche percorso`); return; }
            p.opzioni.forEach((o, j) => {
              if (vis[j] === 'f') return;
              const lo = copia(l);
              Object.assign(lo.segni, o.segni ?? {});
              for (const s of o.sblocchi ?? []) metti(lo.sblocchi, s);
              if (o.verso) successore(o.verso, lo); else cammina(i + 1, lo, false);
            });
            return;  // ogni opzione ha proseguito per conto suo
          }
          default: break;
        }
      }
      // Uscite condizionate (mockup della principale 0.3): la prima che vale; con una condizione «forse», anche le successive.
      const uscite = usciteDi(n);
      let presa = false;
      for (const u of uscite) {
        const v = u.se ? val(u.se, l) : 'v';
        if (v === 'f') continue;
        successore(u.verso, v === 'v' ? l : copia(l));
        if (v === 'v') { presa = true; break; }
      }
      if (uscite.length && !presa) errori.add(`nessuna uscita del nodo ${n.id} vale su qualche percorso`);
    };
    cammina(0, l0, ing.daScelta);
  }

  // Vicoli ciechi: stati da cui non si arriva a nessuna fine.
  const arrivano = new Set<string>([...fineVista]);
  for (let cambiato = true; cambiato;) {
    cambiato = false;
    for (const [k, succ] of archiStato) if (!arrivano.has(k) && [...succ].some(x => arrivano.has(x))) { arrivano.add(k); cambiato = true; }
  }
  for (const k of visti) if (!arrivano.has(k)) errori.add(`vicolo cieco: dal nodo ${JSON.parse(k)[0]} non si arriva a nessuna fine su qualche percorso`);
  if (!fini.length) errori.add('nessuna fine raggiungibile');

  for (const n of c.nodi) if (!raggiunti.has(n.id)) errori.add(`nodo non raggiungibile: ${n.id}`);
  for (const s of c.obbligatori) for (const f of fini) if (f.esito === 'completata' && !f.l.sblocchi.includes(s)) errori.add(`sblocco obbligatorio non presente su ogni percorso: ${s}`);

  // Achievement e indizi: con gli atomi dell'account ristretti a ciò che si può raggiungere in qualche giro.
  const valA = (cond: Condizione | undefined, l: Locale): Tre => {
    if (!cond) return 'v';
    if ('esplorato' in cond) return raggiunti.has(cond.esplorato) ? '?' : 'f';
    if ('giri' in cond) return cond.giri <= 0 ? 'v' : fini.length ? '?' : 'f';
    if ('finale' in cond) return fini.some(f => f.finale === cond.finale) ? '?' : 'f';
    if ('non' in cond) { const x = valA(cond.non, l); return x === '?' ? '?' : x === 'v' ? 'f' : 'v'; }
    if ('tutti' in cond) { const xs = cond.tutti.map(y => valA(y, l)); return xs.includes('f') ? 'f' : xs.every(y => y === 'v') ? 'v' : '?'; }
    if ('uno' in cond) { const xs = cond.uno.map(y => valA(y, l)); return xs.includes('v') ? 'v' : xs.every(y => y === 'f') ? 'f' : '?'; }
    return val(cond, l);
  };
  const qualche = (cond: Condizione | undefined) => istantanee.some(l => valA(cond, l) !== 'f');
  for (const a of c.achievement) {
    if (!achievementDati.has(a.id) && !(a.quando && qualche(a.quando))) errori.add(`achievement senza percorso: ${a.id}`);
    a.indizi.forEach((x, i) => { if (x.se && !qualche(x.se)) avvisi.add(`l'indizio ${i + 1} di ${a.id} non può mai comparire`); });
  }
  for (const n of c.nodi) for (const p of n.passi) {
    if ((p.tipo === 'battuta' || p.tipo === 'narrazione' || p.tipo === 'messaggio') && p.se && raggiunti.has(n.id) && !battuteViste.has(`${n.id}:${p.riga}`))
      avvisi.add(`la battuta della riga ${p.riga} (nodo ${n.id}) non si vede mai`);
  }

  // Mockup della principale 0.3.2 (proprietario: «perdere non dovrebbe essere una meccanica normale per proseguire sulla mappa, ma una
  // segreta»): un nodo a cui si arriva solo perdendo dev'essere segreto; una tasca si raggiunge solo perdendo.
  const entrate = new Map<string, Set<'sconfitta' | 'altro'>>();
  const entra = (d: Destinazione | undefined, tipo: 'sconfitta' | 'altro') => {
    if (d && 'nodo' in d) (entrate.get(d.nodo) ?? entrate.set(d.nodo, new Set()).get(d.nodo)!).add(tipo);
  };
  for (const n of c.nodi) {
    for (const p of n.passi) {
      if (p.tipo === 'partita') entra(p.sconfitta, 'sconfitta');
      if (p.tipo === 'scelta') p.opzioni.forEach(o => entra(o.verso, 'altro'));
    }
    for (const u of usciteDi(n)) if (!('nodo' in u.verso && u.verso.da === 'scelta')) entra(u.verso, 'altro');
  }
  for (const n of c.nodi) {
    const e = entrate.get(n.id);
    if (n.id === c.inizio || !e) continue;
    if (!e.has('altro') && !n.segreto) avvisi.add(`il nodo ${n.id} si raggiunge solo perdendo ma non è segreto`);
    if (n.tasca && e.has('altro')) avvisi.add(`la tasca ${n.id} si raggiunge anche senza perdere`);
  }
  for (const n of c.nodi) if (n.tasca && !entrate.get(n.id)?.has('sconfitta')) avvisi.add(`la tasca ${n.id} non si raggiunge perdendo`);

  const segreti: Record<string, string[]> = {};
  for (const n of c.nodi) if (n.segreto) segreti[n.id] = [...(verso.get(n.id) ?? [])];
  const conta = (e: Esito) => fini.filter(f => f.esito === e).length;
  const perFinale: Record<string, number> = {};
  for (const f of fini) perFinale[f.finale] = (perFinale[f.finale] ?? 0) + 1;
  return {errori: [...errori], avvisi: [...avvisi], stati: visti.size, fini: {completata: conta('completata'), fallita: conta('fallita')}, finali: perFinale,
    raggiunti: [...raggiunti], segreti};
}

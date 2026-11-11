// CA-0a: controllo di validità dei dati di una carriera, scritto a mano (decisione T1 della regia; il JSON Schema arriva in CA-0).
// Controlla forma e riferimenti del JSON, anche se non viene dal convertitore: ogni errore dice il percorso del campo.
import type {Carriera, Cast} from './formato.ts';
import {slug} from './converti.ts';

type Oggetto = Record<string, unknown>;
const ID = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

export function valida(dati: unknown, cast: Cast): string[] {
  const errori: string[] = [];
  const err = (dove: string, cosa: string): void => { errori.push(`${dove}: ${cosa}`); };
  const ogg = (v: unknown, dove: string): v is Oggetto => {
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) return true;
    err(dove, 'atteso un oggetto'); return false;
  };
  const campi = (o: Oggetto, dove: string, obbligatori: string[], facoltativi: string[]) => {
    for (const k of obbligatori) if (!(k in o)) err(`${dove}.${k}`, 'manca');
    for (const k of Object.keys(o)) if (!obbligatori.includes(k) && !facoltativi.includes(k)) err(`${dove}.${k}`, 'campo sconosciuto');
  };
  const testo = (v: unknown, dove: string, forma?: RegExp) => {
    if (typeof v !== 'string' || !v) err(dove, 'atteso un testo non vuoto');
    else if (forma && !forma.test(v)) err(dove, `forma non ammessa: «${v}»`);
  };
  const intero = (v: unknown, dove: string) => { if (!Number.isInteger(v) || (v as number) < 0) err(dove, 'atteso un intero non negativo'); };
  const vero = (v: unknown, dove: string) => { if (v !== true) err(dove, 'atteso true (o il campo assente)'); };
  const lista = (v: unknown, dove: string): v is unknown[] => { if (Array.isArray(v)) return true; err(dove, 'attesa una lista'); return false; };
  const uno = (v: unknown, dove: string, ammessi: readonly string[]) => { if (!ammessi.includes(v as string)) err(dove, `atteso uno fra ${ammessi.join(', ')}`); };

  if (!ogg(dati, 'carriera')) return errori;
  const c = dati;
  campi(c, 'carriera', ['formato', 'id', 'titolo', 'fonte', 'inizio', 'obbligatori', 'nodi', 'achievement'], []);
  if (c.formato !== 1) err('carriera.formato', 'atteso 1');
  testo(c.id, 'carriera.id', ID); testo(c.titolo, 'carriera.titolo'); testo(c.fonte, 'carriera.fonte');
  const nodi = lista(c.nodi, 'carriera.nodi') ? c.nodi : [];
  const ids = new Set<string>();
  for (const n of nodi) if (typeof n === 'object' && n && typeof (n as Oggetto).id === 'string') {
    const id = (n as Oggetto).id as string;
    if (ids.has(id)) err('carriera.nodi', `id doppio: ${id}`);
    ids.add(id);
  }
  const achievementIds = new Set(Array.isArray(c.achievement) ? c.achievement.map(a => (a as Oggetto)?.id as string) : []);
  // Finali (P7): ogni destinazione «fine», con il titolo in minuscolo con trattini o l'esito come id.
  const finali = new Set<string>();
  JSON.stringify(c, (k, v: unknown) => {
    if (v && typeof v === 'object' && 'fine' in v) { const d = v as Oggetto; finali.add(typeof d.finale === 'string' ? slug(d.finale) : String(d.fine)); }
    return v;
  });
  const rifNodo = (v: unknown, dove: string) => { testo(v, dove); if (typeof v === 'string' && !ids.has(v)) err(dove, `nodo sconosciuto: ${v}`); };
  if (typeof c.inizio === 'string') rifNodo(c.inizio, 'carriera.inizio'); else testo(c.inizio, 'carriera.inizio');
  if (lista(c.obbligatori, 'carriera.obbligatori')) c.obbligatori.forEach((x, i) => testo(x, `carriera.obbligatori[${i}]`, ID));

  const personaggio = (v: unknown, dove: string) => { testo(v, dove); if (typeof v === 'string' && !cast.personaggi[v]) err(dove, `personaggio sconosciuto: ${v}`); };
  const espressione = (chi: unknown, v: unknown, dove: string) => {
    testo(v, dove);
    const p = cast.personaggi[chi as string];
    if (p && typeof v === 'string' && !p.espressioni?.includes(v)) err(dove, `espressione sconosciuta per ${chi}: ${v}`);
  };

  const condizione = (v: unknown, dove: string): void => {
    if (!ogg(v, dove)) return;
    const k = Object.keys(v);
    if (k.length === 0) { err(dove, 'condizione vuota'); return; }
    if ('segno' in v) { campi(v, dove, ['segno'], ['uguale']); testo(v.segno, `${dove}.segno`, ID); if ('uguale' in v) testo(v.uguale, `${dove}.uguale`, ID); return; }
    if (k.length !== 1) { err(dove, `una sola chiave attesa, trovate ${k.join(', ')}`); return; }
    const [chiave] = k;
    const x = v[chiave];
    switch (chiave) {
      case 'visto': case 'vinto': case 'perso': case 'esplorato': return rifNodo(x, `${dove}.${chiave}`);
      case 'achievement': testo(x, `${dove}.achievement`); if (typeof x === 'string' && !achievementIds.has(x)) err(`${dove}.achievement`, `achievement sconosciuto: ${x}`); return;
      case 'giri': return intero(x, `${dove}.giri`);
      case 'finale': testo(x, `${dove}.finale`, ID); if (typeof x === 'string' && !finali.has(x)) err(`${dove}.finale`, `finale sconosciuto: ${x}`); return;
      case 'non': return condizione(x, `${dove}.non`);
      case 'tutti': case 'uno': if (lista(x, `${dove}.${chiave}`)) { if (x.length < 2) err(`${dove}.${chiave}`, 'attese almeno due condizioni'); x.forEach((y, i) => condizione(y, `${dove}.${chiave}[${i}]`)); } return;
      default: err(dove, `condizione sconosciuta: ${chiave}`);
    }
  };
  const destinazione = (v: unknown, dove: string) => {
    if (!ogg(v, dove)) return;
    if ('fine' in v) { campi(v, dove, ['fine'], ['finale']); uno(v.fine, `${dove}.fine`, ['completata', 'fallita']); if ('finale' in v) testo(v.finale, `${dove}.finale`); return; }
    campi(v, dove, ['nodo'], ['da']); rifNodo(v.nodo, `${dove}.nodo`);
    if ('da' in v) uno(v.da, `${dove}.da`, ['scelta']);
  };
  const rif = (v: unknown, dove: string) => {
    if (!ogg(v, dove)) return;
    if ('personaggio' in v) { campi(v, dove, ['personaggio'], []); personaggio(v.personaggio, `${dove}.personaggio`); }
    else { campi(v, dove, ['segno'], []); testo(v.segno, `${dove}.segno`, ID); }
  };
  const battuta = (v: unknown, dove: string) => {
    if (!ogg(v, dove)) return;
    campi(v, dove, ['tipo', 'chi', 'testo', 'riga'], ['nome', 'espressione', 'fuoriCampo', 'se', 'stacchi', 'interrotta']);
    if (v.tipo !== 'battuta') err(`${dove}.tipo`, 'atteso «battuta»');
    personaggio(v.chi, `${dove}.chi`);
    const p = cast.personaggi[v.chi as string];
    if ('espressione' in v) espressione(v.chi, v.espressione, `${dove}.espressione`);
    else if (p && !p.ombra && !v.fuoriCampo) err(`${dove}.espressione`, 'manca (il personaggio non è una figura in ombra)');
    if ('nome' in v) testo(v.nome, `${dove}.nome`);
    if ('fuoriCampo' in v) vero(v.fuoriCampo, `${dove}.fuoriCampo`);
    if ('interrotta' in v) vero(v.interrotta, `${dove}.interrotta`);
    testo(v.testo, `${dove}.testo`); intero(v.riga, `${dove}.riga`);
    if ('se' in v) condizione(v.se, `${dove}.se`);
    if ('stacchi' in v && lista(v.stacchi, `${dove}.stacchi`)) v.stacchi.forEach((x, i) => {
      const d = `${dove}.stacchi[${i}]`;
      if (ogg(x, d)) { campi(x, d, ['chi', 'espressione'], []); personaggio(x.chi, `${d}.chi`); espressione(x.chi, x.espressione, `${d}.espressione`); }
    });
  };

  const passo = (v: unknown, dove: string) => {
    if (!ogg(v, dove)) return;
    const comuni = ['tipo', 'riga'];
    intero(v.riga, `${dove}.riga`);
    switch (v.tipo) {
      case 'battuta': return battuta(v, dove);
      case 'narrazione': campi(v, dove, [...comuni, 'testo'], ['se']); testo(v.testo, `${dove}.testo`); if ('se' in v) condizione(v.se, `${dove}.se`); return;
      case 'messaggio': campi(v, dove, [...comuni, 'testo'], ['se', 'da']); testo(v.testo, `${dove}.testo`); if ('da' in v) personaggio(v.da, `${dove}.da`); if ('se' in v) condizione(v.se, `${dove}.se`); return;
      case 'regia': campi(v, dove, [...comuni, 'nota'], []); testo(v.nota, `${dove}.nota`); return;
      case 'sfondo': {
        campi(v, dove, [...comuni, 'sfondo'], ['variante']);
        const sf = cast.sfondi[v.sfondo as string];
        if (!sf) err(`${dove}.sfondo`, `sfondo sconosciuto: ${v.sfondo}`);
        else if ('variante' in v && !sf.varianti?.[v.variante as string]) err(`${dove}.variante`, `variante sconosciuta: ${v.variante}`);
        return;
      }
      case 'sprite': {
        campi(v, dove, [...comuni, 'sprite', 'azione'], ['posa']);
        uno(v.azione, `${dove}.azione`, ['entra', 'esce', 'posa']);
        const sp = cast.sprite[v.sprite as string];
        if (!sp) err(`${dove}.sprite`, `sprite sconosciuto: ${v.sprite}`);
        else if ('posa' in v && !sp.pose[v.posa as string]) err(`${dove}.posa`, `posa sconosciuta: ${v.posa}`);
        return;
      }
      case 'effetto': campi(v, dove, [...comuni, 'effetto'], ['variante']); uno(v.effetto, `${dove}.effetto`, ['scossa', 'sfarfallio']); if ('variante' in v) testo(v.variante, `${dove}.variante`, ID); return;
      case 'suono': campi(v, dove, [...comuni, 'suono'], []); testo(v.suono, `${dove}.suono`, ID); return;
      case 'segno': campi(v, dove, [...comuni, 'segno', 'valore'], []); testo(v.segno, `${dove}.segno`, ID); testo(v.valore, `${dove}.valore`, ID); return;
      case 'sblocco': campi(v, dove, [...comuni, 'sblocco'], []); testo(v.sblocco, `${dove}.sblocco`, ID); return;
      case 'achievement': campi(v, dove, [...comuni, 'achievement'], []); testo(v.achievement, `${dove}.achievement`); if (!achievementIds.has(v.achievement as string)) err(`${dove}.achievement`, `achievement sconosciuto: ${v.achievement}`); return;
      case 'partita': {
        campi(v, dove, [...comuni, 'id', 'modo', 'giocatore', 'avversari'], ['modificatori', 'ritento', 'sconfitta']);
        testo(v.id, `${dove}.id`, ID); uno(v.modo, `${dove}.modo`, ['duello', 'ffa']);
        rif(v.giocatore, `${dove}.giocatore`);
        if (Array.isArray(v.avversari)) {
          if (!v.avversari.length) err(`${dove}.avversari`, 'almeno un avversario');
          v.avversari.forEach((x, i) => rif(x, `${dove}.avversari[${i}]`));
          if ((v.modo === 'duello') !== (v.avversari.length === 1)) err(`${dove}.modo`, `un duello ha un avversario, una FFA due o più`);
        } else if (ogg(v.avversari, `${dove}.avversari`)) {
          campi(v.avversari, `${dove}.avversari`, ['altriFra'], []);
          const fra = v.avversari.altriFra;
          if (lista(fra, `${dove}.avversari.altriFra`)) { if (fra.length < 3) err(`${dove}.avversari.altriFra`, 'almeno tre al tavolo'); fra.forEach((x, i) => personaggio(x, `${dove}.avversari.altriFra[${i}]`)); }
          if (v.modo !== 'ffa') err(`${dove}.modo`, 'con «gli altri fra» è una FFA');
        }
        if ('modificatori' in v && lista(v.modificatori, `${dove}.modificatori`)) v.modificatori.forEach((x, i) => testo(x, `${dove}.modificatori[${i}]`, ID));
        if ('ritento' in v && lista(v.ritento, `${dove}.ritento`)) v.ritento.forEach((x, i) => battuta(x, `${dove}.ritento[${i}]`));
        if ('sconfitta' in v) destinazione(v.sconfitta, `${dove}.sconfitta`);
        return;
      }
      case 'scelta': {
        campi(v, dove, [...comuni, 'modo', 'opzioni'], ['domanda']);
        uno(v.modo, `${dove}.modo`, ['muta', 'messaggio']);
        if ('domanda' in v) testo(v.domanda, `${dove}.domanda`);
        if (!lista(v.opzioni, `${dove}.opzioni`)) return;
        if (v.opzioni.length < 2) err(`${dove}.opzioni`, 'almeno due opzioni');
        const conVerso = v.opzioni.filter(o => (o as Oggetto)?.verso).length;
        if (conVerso && conVerso !== v.opzioni.length) err(`${dove}.opzioni`, 'o tutte con destinazione o nessuna');
        v.opzioni.forEach((o, i) => {
          const d = `${dove}.opzioni[${i}]`;
          if (!ogg(o, d)) return;
          campi(o, d, ['etichetta'], ['chi', 'se', 'segni', 'sblocchi', 'verso']);
          testo(o.etichetta, `${d}.etichetta`);
          if ('chi' in o) personaggio(o.chi, `${d}.chi`);
          if ('se' in o) condizione(o.se, `${d}.se`);
          if ('segni' in o && ogg(o.segni, `${d}.segni`)) for (const [k, x] of Object.entries(o.segni)) { testo(k, `${d}.segni`, ID); testo(x, `${d}.segni.${k}`, ID); }
          if ('sblocchi' in o && lista(o.sblocchi, `${d}.sblocchi`)) o.sblocchi.forEach((x, j) => testo(x, `${d}.sblocchi[${j}]`, ID));
          if ('verso' in o) destinazione(o.verso, `${d}.verso`);
        });
        return;
      }
      default: err(`${dove}.tipo`, `tipo di passo sconosciuto: ${String(v.tipo)}`);
    }
  };

  nodi.forEach((n, i) => {
    const dove = `nodi[${i}]`;
    if (!ogg(n, dove)) return;
    campi(n, dove, ['id', 'etichetta', 'titolo', 'passi', 'uscita', 'riga'], ['segreto', 'condizione']);
    testo(n.id, `${dove}.id`, ID); testo(n.etichetta, `${dove}.etichetta`); intero(n.riga, `${dove}.riga`);
    if (typeof n.titolo !== 'string') err(`${dove}.titolo`, 'atteso un testo');
    if ('segreto' in n) vero(n.segreto, `${dove}.segreto`);
    if ('condizione' in n) condizione(n.condizione, `${dove}.condizione`);
    const passi = lista(n.passi, `${dove}.passi`) ? n.passi : [];
    passi.forEach((p, j) => passo(p, `${dove}.passi[${j}]`));
    if (ogg(n.uscita, `${dove}.uscita`)) {
      const u = n.uscita;
      if ('scelta' in u) {
        campi(u, `${dove}.uscita`, ['scelta'], []); vero(u.scelta, `${dove}.uscita.scelta`);
        const ultima = [...passi].reverse().find(p => (p as Oggetto)?.tipo !== 'regia') as Oggetto | undefined;
        if (ultima?.tipo !== 'scelta' || !(ultima.opzioni as Oggetto[])?.every(o => o.verso)) err(`${dove}.uscita`, 'l\'ultimo passo non è una scelta con destinazioni');
      } else { campi(u, `${dove}.uscita`, ['verso'], []); destinazione(u.verso, `${dove}.uscita.verso`); }
    }
  });

  if (lista(c.achievement, 'carriera.achievement')) c.achievement.forEach((a, i) => {
    const dove = `achievement[${i}]`;
    if (!ogg(a, dove)) return;
    campi(a, dove, ['id', 'titolo', 'descrizione', 'indizi'], ['nascosto', 'quando']);
    testo(a.id, `${dove}.id`, ID); testo(a.titolo, `${dove}.titolo`); testo(a.descrizione, `${dove}.descrizione`);
    if ('nascosto' in a) vero(a.nascosto, `${dove}.nascosto`);
    if ('quando' in a) condizione(a.quando, `${dove}.quando`);
    if (lista(a.indizi, `${dove}.indizi`)) {
      if (!a.indizi.length) err(`${dove}.indizi`, 'almeno un indizio (D19)');
      a.indizi.forEach((x, j) => {
        const d = `${dove}.indizi[${j}]`;
        if (ogg(x, d)) { campi(x, d, ['testo'], ['se']); testo(x.testo, `${d}.testo`); if ('se' in x) condizione(x.se, `${d}.se`); }
      });
    }
  });
  return errori;
}

export const comeCarriera = (dati: unknown, cast: Cast): Carriera => {
  const e = valida(dati, cast);
  if (e.length) throw new Error(`dati della carriera non validi:\n${e.join('\n')}`);
  return dati as Carriera;
};

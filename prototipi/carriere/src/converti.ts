// CA-0a, Fase A: abbozzo del convertitore dalle storie in markdown ai dati della carriera.
// Serve a mostrare che il formato proposto regge su docs/design/carriere/tutorial-dialoghi.md; in Fase B si completa,
// con il controllo di validità dello schema e il controllo del grafo per esplorazione degli stati.
// Sintassi del markdown: docs/design/carriere/prototipo-fase-a.md, «Come si scrive nel markdown».
import type {Achievement, Battuta, Carriera, Cast, Condizione, Destinazione, Nodo, Opzione, Partita, Passo, Problema, Rif, Scelta} from './formato.ts';

export type Risultato = {carriera: Carriera; problemi: Problema[]};

type Blocco = {testo: string; riga: number; elenco: boolean};
type Rinvio = {grezzo: string; riga: number; applica: (d: Destinazione) => void};

export const slug = (s: string): string => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/['’]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const SOLO_COMANDI = /^(\[[^\[\]]*\]\s*)+$/;
const COMANDO = /\[([^\[\]]*)\]/g;
const BATTUTA = /^\*\*([^*]+?)\*\*(?:\s*\(([^)]+)\))?:\s*([\s\S]+)$/;
const ESITI = ['completata', 'fallita'];
const SEGUENTE = '<<seguente>>';   // uscita implicita, risolta quando si conoscono tutti i nodi
const IGNOTO = '<<ignoto>>';       // destinazione scritta ma non risolta (già segnalata come errore)

/** Divide il testo in sezioni «## …» e poi in blocchi: paragrafi, o voci di elenco con le loro righe di seguito. */
function blocchi(righe: {testo: string; riga: number}[]): Blocco[] {
  const out: Blocco[] = [];
  let cur: Blocco | null = null;
  for (const {testo, riga} of righe) {
    const t = testo.trim();
    if (!t) { cur = null; continue; }
    if (/^- /.test(t)) { cur = {testo: t.slice(2).trim(), riga, elenco: true}; out.push(cur); continue; }
    if (cur && (!cur.elenco || /^\s{2,}/.test(testo))) { cur.testo += ' ' + t; continue; }
    cur = {testo: t, riga, elenco: false};
    out.push(cur);
  }
  return out;
}

export function converti(md: string, cast: Cast, fonte: string): Risultato {
  const problemi: Problema[] = [];
  const errore = (riga: number, messaggio: string) => problemi.push({riga, livello: 'errore', messaggio});
  const avviso = (riga: number, messaggio: string) => problemi.push({riga, livello: 'avviso', messaggio});

  // Nomi dei personaggi, alias compresi, verso l'id del cast.
  const nomi = new Map<string, string>();
  for (const [id, p] of Object.entries(cast.personaggi)) for (const n of [p.nome, ...(p.alias ?? []), id]) nomi.set(n.toLowerCase(), id);
  const personaggio = (nome: string, riga: number): string | undefined => {
    const id = nomi.get(nome.trim().toLowerCase());
    if (!id) errore(riga, `personaggio sconosciuto: «${nome.trim()}»`);
    return id;
  };

  const righe = md.split(/\r?\n/).map((testo, i) => ({testo, riga: i + 1}));
  type Sezione = {tipo: 'preambolo' | 'nodo' | 'achievement' | 'altro'; titolo: string; riga: number; righe: typeof righe};
  const sezioni: Sezione[] = [{tipo: 'preambolo', titolo: '', riga: 1, righe: []}];
  for (const r of righe) {
    const h = /^## (.+)$/.exec(r.testo);
    if (h) {
      const tipo = /^achievement$/i.test(h[1].trim()) ? 'achievement' : h[1].includes(' — ') ? 'nodo' : 'altro';
      sezioni.push({tipo, titolo: h[1].trim(), riga: r.riga, righe: []});
    } else sezioni[sezioni.length - 1].righe.push(r);
  }

  // Preambolo: titolo e [Carriera: id; obbligatori: …].
  const titoloFile = /^# (.+)$/m.exec(md)?.[1] ?? fonte;
  let id = slug(titoloFile.split(' — ')[0]);
  let obbligatori: string[] = [];
  let dichiarata = false;
  for (const b of blocchi(sezioni[0].righe)) {
    for (const m of b.testo.matchAll(COMANDO)) {
      const [nome, arg] = dividi(m[1]);
      if (nome !== 'carriera') continue;
      dichiarata = true;
      const parti = arg.split(';').map(s => s.trim());
      id = slug(parti[0]);
      for (const p of parti.slice(1)) {
        const o = /^obbligatori:\s*(.+)$/i.exec(p);
        if (o) obbligatori = o[1].split(',').map(s => slug(s));
        else errore(b.riga, `opzione di carriera sconosciuta: «${p}»`);
      }
    }
  }
  if (!dichiarata) avviso(1, 'manca [Carriera: id; obbligatori: …]: id ricavato dal titolo, nessuno sblocco obbligatorio');

  const rinvii: Rinvio[] = [];
  const condizioniDaRisolvere: {c: Condizione; riga: number}[] = [];
  const destinazione = (grezzo: string, riga: number, applica: (d: Destinazione) => void) => {
    // «Fine: completata» o, per una fine con nome (P7), «Fine: completata, Grappino scappa di nuovo».
    const f = /^fine:\s*([^,\s]+)\s*(?:,\s*(.+))?$/i.exec(grezzo.trim());
    if (f) {
      if (!ESITI.includes(f[1].toLowerCase())) errore(riga, `esito sconosciuto: «${f[1]}» (completata, fallita)`);
      applica({fine: f[1].toLowerCase() as 'completata', ...(f[2] ? {finale: f[2].trim()} : {})});
    } else rinvii.push({grezzo: grezzo.trim(), riga, applica});
  };
  const condizione = (testo: string, riga: number): Condizione | undefined => {
    const c = leggiCondizione(testo, riga, errore);
    if (c) condizioniDaRisolvere.push({c, riga});
    return c;
  };

  const nodi: Nodo[] = [];
  const achievement: Achievement[] = [];
  const achievementCitati: {nome: string; riga: number}[] = [];

  for (const sez of sezioni.slice(1)) {
    if (sez.tipo === 'altro') continue;
    if (sez.tipo === 'achievement') { leggiAchievement(sez, achievement, condizione, errore); continue; }
    const [etichetta, ...resto] = sez.titolo.split(' — ');
    const nodo: Nodo = {id: slug(etichetta), etichetta: etichetta.trim(), titolo: resto.join(' — ').trim(), passi: [], uscita: {scelta: true}, riga: sez.riga};
    let uscita = false;   // un'uscita esplicita (→ Vai a, → Torna a, → Fine) chiude il nodo
    const esci = (grezzo: string, riga: number, da?: 'scelta') => {
      uscita = true;
      nodo.uscita = {verso: {nodo: IGNOTO}};
      destinazione(grezzo, riga, d => { nodo.uscita = {verso: da && 'nodo' in d ? {...d, da} : d}; });
    };
    let ultimaBattuta: Battuta | null = null;
    let ultimaPartita: Partita | null = null;
    let sceltaAperta: Scelta | null = null;
    let telefono: string | undefined;
    const aggiungi = (p: Passo) => {
      if (uscita) errore(p.riga, 'passo dopo l\'uscita del nodo');
      if (p.tipo !== 'regia') sceltaAperta = p.tipo === 'scelta' ? sceltaAperta : null;
      nodo.passi.push(p);
      if (p.tipo === 'battuta') ultimaBattuta = p;
      if (p.tipo === 'partita') ultimaPartita = p;
    };
    const battuta = (testo: string, riga: number, se?: Condizione): Battuta | null => {
      const m = BATTUTA.exec(testo);
      if (!m) return null;
      const chi = personaggio(m[1], riga);
      const p = chi ? cast.personaggi[chi] : undefined;
      // Un alias («Un amico») è il nome che compare nella finestra; l'aspetto resta quello del cast.
      const nome = p && m[1].trim() !== p.nome ? m[1].trim() : undefined;
      let espressione: string | undefined;
      let fuoriCampo = false;
      if (m[2]) {
        const e = slug(m[2]);
        if (e === 'fuori-campo') fuoriCampo = true;
        else if (p?.ombra) avviso(riga, `${p.nome} è una figura in ombra: l'espressione «${m[2]}» non si vede`);
        else if (p?.espressioniFuture?.includes(e)) errore(riga, `espressione prevista ma ancora senza ritratto per ${p.nome}: «${m[2]}» (P8)`);
        else if (p && !p.espressioni?.includes(e)) errore(riga, `espressione sconosciuta per ${p.nome}: «${m[2]}»`);
        else espressione = e;
      } else if (p && !p.ombra) errore(riga, `battuta di ${p.nome} senza espressione`);
      const b: Battuta = {tipo: 'battuta', chi: chi ?? m[1], ...(nome ? {nome} : {}), ...(espressione ? {espressione} : {}),
        ...(fuoriCampo ? {fuoriCampo: true as const} : {}), testo: m[3].trim(), ...(se ? {se} : {}), riga};
      for (const g of b.testo.matchAll(/\{([^}]+)\}/g)) if (g[1] !== 'giocatore') avviso(riga, `segnaposto sconosciuto nel testo: {${g[1]}}`);
      return b;
    };
    const contenuto = (testo: string, riga: number, se?: Condizione): Passo | null => {
      const b = battuta(testo, riga, se);
      if (b) return b;
      const msg = /^\*«([\s\S]+)»\*$/.exec(testo);
      if (msg) { const p: Passo = {tipo: 'messaggio', testo: msg[1].trim(), riga}; if (telefono) p.da = telefono; telefono = undefined; if (se) p.se = se; return p; }
      const nar = /^\*(?!\*)([\s\S]+)\*$/.exec(testo);
      if (nar) { const p: Passo = {tipo: 'narrazione', testo: nar[1].trim(), riga}; if (se) p.se = se; return p; }
      return null;
    };

    const bl = blocchi(sez.righe);
    for (let i = 0; i < bl.length; i++) {
      const {testo, riga, elenco} = bl[i];
      if (elenco) {
        if (sceltaAperta) { (sceltaAperta as Scelta).opzioni.push(opzione(testo, riga, sceltaAperta as Scelta)); continue; }
        avviso(riga, 'voce di elenco fuori da una scelta: tenuta come nota');
        aggiungi({tipo: 'regia', nota: testo, riga});
        continue;
      }
      if (testo.startsWith('→')) { freccia(testo.slice(1).trim(), riga); continue; }
      if (SOLO_COMANDI.test(testo)) { for (const m of testo.matchAll(COMANDO)) comando(m[1], riga, i === 0); continue; }
      const se = /^\[Se ([^\]]+)\]\s*([\s\S]+)$/.exec(testo);
      if (se) {
        const p = contenuto(se[2], riga, condizione(se[1], riga));
        if (p) aggiungi(p); else errore(riga, 'dopo [Se …] serve una battuta, una narrazione o un messaggio');
        continue;
      }
      const rit = /^\*\*Ritento\.\*\*\s*([\s\S]+)$/.exec(testo);
      if (rit) {
        if (!ultimaPartita) { errore(riga, 'Ritento senza una partita prima'); continue; }
        (ultimaPartita as Partita).ritento = rit[1].split(' · ').map(t => battuta(t.trim(), riga)).filter((b): b is Battuta => {
          if (!b) errore(riga, 'battuta di ritento non riconosciuta'); return !!b; });
        continue;
      }
      const p = contenuto(testo, riga);
      if (p) { aggiungi(p); continue; }
      avviso(riga, 'testo libero non riconosciuto: tenuto come nota dell\'autore, non si legge');
      aggiungi({tipo: 'regia', nota: testo, riga});
    }

    // Uscita esplicita; altrimenti il nodo che segue nel file (una scelta con destinazioni la sostituisce più sotto).
    if (!uscita) nodo.uscita = {verso: {nodo: SEGUENTE}};
    nodi.push(nodo);

    function comando(corpo: string, riga: number, primo: boolean) {
      const [nome, arg] = dividi(corpo);
      switch (nome) {
        case 'nodo':
          if (!primo) avviso(riga, '[Nodo: …] va subito sotto il titolo');
          for (const o of arg.split(';').map(s => s.trim()).filter(Boolean)) {
            if (o === 'segreto') nodo.segreto = true;
            else if (o.startsWith('se ')) nodo.condizione = condizione(o.slice(3), riga);
            else errore(riga, `opzione di nodo sconosciuta: «${o}»`);
          }
          return;
        case 'sfondo': return sfondo(arg, riga, true);
        case 'regia': {
          aggiungi({tipo: 'regia', nota: arg, riga});
          const s = /Sfondo:\s*(S\d+[^.]*)/.exec(arg);
          if (s) sfondo(s[1], riga, false);
          return;
        }
        case 'scossa': return aggiungi({tipo: 'effetto', effetto: 'scossa', riga});
        case 'sfarfallio': return aggiungi({tipo: 'effetto', effetto: 'sfarfallio', variante: slug(arg), riga});
        case 'entra': case 'esce': case 'sprite': {
          const sp = Object.keys(cast.sprite).find(k => slug(arg) === k || slug(arg).startsWith(k + '-'));
          if (!sp) return errore(riga, `sprite sconosciuto: «${arg}»`);
          const posa = slug(arg).slice(sp.length + 1) || undefined;
          if (posa && !cast.sprite[sp].pose[posa]) errore(riga, `posa sconosciuta per ${sp}: «${posa}»`);
          return aggiungi({tipo: 'sprite', sprite: sp, ...(posa ? {posa} : {}), azione: nome === 'sprite' ? 'posa' : nome, riga});
        }
        case 'stacchi': {
          if (!ultimaBattuta) return errore(riga, '[Stacchi: …] senza una battuta prima');
          (ultimaBattuta as Battuta).stacchi = arg.split(',').map(s => s.trim()).flatMap(s => {
            const [n, ...e] = s.split(/\s+/);
            const chi = personaggio(n, riga);
            const espr = slug(e.join(' '));
            if (chi && cast.personaggi[chi].espressioniFuture?.includes(espr)) { errore(riga, `espressione prevista ma ancora senza ritratto per ${n}: «${e.join(' ')}» (P8)`); return []; }
            if (chi && !cast.personaggi[chi].espressioni?.includes(espr)) { errore(riga, `espressione sconosciuta per ${n}: «${e.join(' ')}»`); return []; }
            return chi ? [{chi, espressione: espr}] : [];
          });
          return;
        }
        case 'interrotta':
          if (!ultimaBattuta) return errore(riga, '[Interrotta] senza una battuta prima');
          (ultimaBattuta as Battuta).interrotta = true; return;
        case 'telefono': telefono = personaggio(arg, riga); return;
        case 'segno': {
          const [s, v] = arg.split('=').map(x => x.trim());
          return aggiungi({tipo: 'segno', segno: s, valore: v ? slug(v) : 'si', riga});
        }
        case 'sblocca': for (const s of arg.split(',')) aggiungi({tipo: 'sblocco', sblocco: slug(s), riga}); return;
        case 'achievement': achievementCitati.push({nome: arg, riga}); return aggiungi({tipo: 'achievement', achievement: slug(arg), riga});
        case 'suono': return aggiungi({tipo: 'suono', suono: slug(arg), riga});
        case 'modificatori':
          if (!ultimaPartita) return errore(riga, '[Modificatori: …] senza una partita prima');
          (ultimaPartita as Partita).modificatori = arg.split(',').map(s => slug(s)); return;
        case 'sconfitta': {
          if (!ultimaPartita) return errore(riga, '[Sconfitta: …] senza una partita prima');
          const p = ultimaPartita as Partita;
          return destinazione(arg.replace(/^→\s*/, ''), riga, d => { p.sconfitta = d; });
        }
        default: errore(riga, `comando sconosciuto: [${corpo}]`);
      }
    }

    function sfondo(arg: string, riga: number, conNota: boolean) {
      const m = /^(S\d+)\b\s*([\s\S]*)$/.exec(arg.trim());
      if (!m || !cast.sfondi[m[1]]) return errore(riga, `sfondo sconosciuto: «${arg}»`);
      // La variante è riconosciuta se il suo nome compare nella descrizione («S2 con lo strato del disordine»).
      const desc = slug(m[2].split(/\.\s*Regia:/)[0]);
      const variante = Object.keys(cast.sfondi[m[1]].varianti ?? {}).find(v => desc.split('-').join(' ').includes(v.split('-').join(' ')));
      aggiungi({tipo: 'sfondo', sfondo: m[1], ...(variante ? {variante} : {}), riga});
      let nota = m[2].replace(/^[,.\s]+/, '').replace(/\.\s*Regia:\s*/, '. ').trim();
      if (variante) nota = nota.replace(new RegExp(`^${variante.replace(/-/g, '[- ]')}[,.\\s]*`, 'i'), '').trim();
      if (conNota && nota) aggiungi({tipo: 'regia', nota, riga});
    }

    function freccia(t: string, riga: number) {
      let m: RegExpExecArray | null;
      if ((m = /^Partita\s+(\w+):\s*([\s\S]+?)\s*\(giocatore\)\s*contro\s+([\s\S]+)$/i.exec(t))) {
        const rif = (s: string): Rif | undefined => {
          const g = /^\{(\w+)\}$/.exec(s.trim());
          if (g) return {segno: g[1]};
          const p = personaggio(s, riga);
          return p ? {personaggio: p} : undefined;
        };
        const giocatore = rif(m[2]);
        const lista = (s: string) => s.split(/,\s*|\s+e\s+/).map(x => x.trim()).filter(Boolean);
        const altri = /^gli altri fra\s+([\s\S]+)$/i.exec(m[3].trim());
        let avversari: Partita['avversari'];
        let n: number;
        if (altri) { const fra = lista(altri[1]).map(x => personaggio(x, riga)).filter((x): x is string => !!x); avversari = {altriFra: fra}; n = fra.length - 1; }
        else { const l = lista(m[3]).map(rif).filter((x): x is Rif => !!x); avversari = l; n = l.length; }
        if (!giocatore) return;
        aggiungi({tipo: 'partita', id: `partita-${slug(m[1])}`, modo: n >= 2 ? 'ffa' : 'duello', giocatore, avversari, riga});
        return;
      }
      if ((m = /^Partita\b/i.exec(t))) return errore(riga, `partita non riconosciuta: «${t}» (forma: Partita N: X (giocatore) contro Y)`);
      if ((m = /^Scelta( muta)?:\s*([\s\S]*)$/i.exec(t))) {
        const s: Scelta = {tipo: 'scelta', modo: m[1] ? 'muta' : 'messaggio', opzioni: [], riga};
        if (m[2].includes(' · ')) s.opzioni = m[2].split(' · ').map(o => opzione(o, riga, s));
        else if (m[2]) s.domanda = m[2].trim();
        aggiungi(s);
        sceltaAperta = s;
        return;
      }
      if ((m = /^Vai a:\s*([\s\S]+)$/i.exec(t))) return esci(m[1], riga);
      if ((m = /^Torna a:\s*(.+?)(,\s*scelta)?$/i.exec(t))) return esci(m[1], riga, m[2] ? 'scelta' : undefined);
      if ((m = /^Fine:\s*(.+)$/i.exec(t))) return esci(`Fine: ${m[1]}`, riga);
      errore(riga, `freccia non riconosciuta: «→ ${t}»`);
    }

    function opzione(testo: string, riga: number, s: Scelta): Opzione {
      const o: Opzione = {etichetta: ''};
      let t = testo;
      for (const m of testo.matchAll(COMANDO)) {
        t = t.replace(m[0], ' ');
        const se = /^Se (.+)$/.exec(m[1]);
        if (se) { o.se = condizione(se[1], riga); continue; }
        const [nome, arg] = dividi(m[1]);
        if (nome === 'segno') { const [k, v] = arg.split('=').map(x => x.trim()); (o.segni ??= {})[k] = v ? slug(v) : 'si'; }
        else if (nome === 'sblocca') (o.sblocchi ??= []).push(...arg.split(',').map(x => slug(x)));
        else errore(riga, `comando non ammesso in un'opzione: [${m[1]}]`);
      }
      const [etichetta, dest] = t.split('→').map(x => x.replace(/\s+/g, ' ').trim());
      const q = /^\*«([\s\S]+)»\*$/.exec(etichetta);
      o.etichetta = q ? q[1] : etichetta;
      if (s.modo === 'messaggio' && !q) avviso(riga, 'opzione di una scelta non muta senza «messaggio»: il giocatore non parla (D14)');
      if (s.modo === 'muta') {
        const c = /^con\s+([^,]+)/i.exec(o.etichetta);
        const chi = c ? nomi.get(c[1].trim().toLowerCase()) : undefined;
        if (chi) o.chi = chi; else avviso(riga, `scelta muta senza «con <personaggio>»: «${o.etichetta}»`);
      }
      // Dopo la destinazione, « — commento» resta libero: spiega l'opzione a chi legge il markdown.
      if (dest) { o.verso = {nodo: IGNOTO}; destinazione(dest.split(' — ')[0], riga, d => { o.verso = d; }); }
      return o;
    }
  }

  // Uscite implicite verso il nodo che segue nel file.
  nodi.forEach((n, i) => {
    if ('verso' in n.uscita && 'nodo' in n.uscita.verso && n.uscita.verso.nodo === SEGUENTE) {
      if (nodi[i + 1]) n.uscita = {verso: {nodo: nodi[i + 1].id}};
      else errore(n.riga, `il nodo «${n.etichetta}» non ha uscita (→ Vai a, → Fine, o una scelta con destinazioni)`);
    }
  });

  // Riferimenti ai nodi per etichetta o per titolo.
  const perNome = new Map<string, string>();
  for (const n of nodi) { perNome.set(n.id, n.id); if (n.titolo) perNome.set(slug(n.titolo), n.id); }
  for (const r of rinvii) {
    const idn = perNome.get(slug(r.grezzo));
    if (idn) r.applica({nodo: idn}); else errore(r.riga, `destinazione sconosciuta: «${r.grezzo}»`);
  }
  // Una scelta chiude il nodo solo se tutte le opzioni hanno destinazione.
  for (const n of nodi) n.passi.forEach((p, i) => {
    if (p.tipo !== 'scelta') return;
    const con = p.opzioni.filter(o => o.verso).length;
    if (con && con < p.opzioni.length) errore(p.riga, 'una scelta ha opzioni con e senza destinazione');
    if (con && n.passi.slice(i + 1).some(q => q.tipo !== 'regia')) errore(p.riga, 'passi dopo una scelta che chiude il nodo');
    if (con) n.uscita = {scelta: true};
  });
  for (const {c, riga} of condizioniDaRisolvere) risolviNodi(c, perNome, riga, errore);
  for (const a of achievementCitati) if (!achievement.some(x => x.id === slug(a.nome))) errore(a.riga, `achievement non definito: «${a.nome}»`);

  const carriera: Carriera = {formato: 1, id, titolo: titoloFile.split(' — ')[0].trim(), fonte, inizio: nodi[0]?.id ?? '', obbligatori, nodi, achievement};
  controllaStruttura(carriera, cast, errore);
  return {carriera, problemi: problemi.sort((a, b) => a.riga - b.riga)};
}

function dividi(corpo: string): [string, string] {
  const i = corpo.indexOf(':');
  return i < 0 ? [corpo.trim().toLowerCase(), ''] : [corpo.slice(0, i).trim().toLowerCase(), corpo.slice(i + 1).trim()];
}

/** «segno x = y e visto Scena 3 o non achievement z»: «o» lega meno di «e», niente parentesi. */
export function leggiCondizione(testo: string, riga: number, errore: (r: number, m: string) => void): Condizione | undefined {
  const atomo = (s: string): Condizione | undefined => {
    s = s.trim();
    let m: RegExpExecArray | null;
    if ((m = /^non\s+(.+)$/.exec(s))) { const c = atomo(m[1]); return c && {non: c}; }
    if ((m = /^segno\s+(\w+)\s*(?:=\s*(.+))?$/.exec(s))) return m[2] ? {segno: m[1], uguale: slug(m[2])} : {segno: m[1]};
    if ((m = /^(visto|vinto|perso|esplorato)\s+(.+)$/.exec(s))) return {[m[1]]: m[2].trim()} as Condizione;
    if ((m = /^achievement\s+(.+)$/.exec(s))) return {achievement: slug(m[1])};
    if ((m = /^giri\s+(\d+)$/.exec(s))) return {giri: Number(m[1])};
    if ((m = /^finale\s+(.+)$/.exec(s))) return {finale: slug(m[1])};
    errore(riga, `condizione non riconosciuta: «${s}»`);
    return undefined;
  };
  const uno = testo.split(/\s+o\s+/).map(g => {
    const tutti = g.split(/\s+e\s+/).map(atomo);
    if (tutti.some(x => !x)) return undefined;
    return tutti.length === 1 ? tutti[0] : {tutti: tutti as Condizione[]};
  });
  if (uno.some(x => !x)) return undefined;
  return uno.length === 1 ? uno[0] : {uno: uno as Condizione[]};
}

function risolviNodi(c: Condizione, perNome: Map<string, string>, riga: number, errore: (r: number, m: string) => void) {
  if ('non' in c) return risolviNodi(c.non, perNome, riga, errore);
  if ('tutti' in c) return c.tutti.forEach(x => risolviNodi(x, perNome, riga, errore));
  if ('uno' in c) return c.uno.forEach(x => risolviNodi(x, perNome, riga, errore));
  for (const k of ['visto', 'vinto', 'perso', 'esplorato'] as const) if (k in c) {
    const o = c as Record<string, string>;
    const idn = perNome.get(slug(o[k]));
    if (idn) o[k] = idn; else errore(riga, `nodo sconosciuto nella condizione: «${o[k]}»`);
  }
}

function leggiAchievement(sez: {righe: {testo: string; riga: number}[]}, out: Achievement[],
  condizione: (t: string, r: number) => Condizione | undefined, errore: (r: number, m: string) => void) {
  let a: Achievement | null = null;
  const gruppi: {titolo: string; riga: number; righe: {testo: string; riga: number}[]}[] = [];
  for (const r of sez.righe) {
    const h = /^### (.+)$/.exec(r.testo);
    if (h) gruppi.push({titolo: h[1].trim(), riga: r.riga, righe: []});
    else gruppi[gruppi.length - 1]?.righe.push(r);
  }
  for (const g of gruppi) {
    a = {id: slug(g.titolo), titolo: g.titolo, descrizione: '', indizi: []};
    for (const b of blocchi(g.righe)) {
      if (b.elenco) {
        const m = /^Indizio(?:,\s*se\s+([^:]+))?:\s*([\s\S]+)$/.exec(b.testo);
        if (!m) { errore(b.riga, 'voce non riconosciuta: «- Indizio: …» o «- Indizio, se …: …»'); continue; }
        const ind: Achievement['indizi'][number] = {testo: m[2].replace(/^\*|\*$/g, '').trim()};
        if (m[1]) { const c = condizione(m[1], b.riga); if (c) ind.se = c; }
        a.indizi.push(ind);
      } else if (SOLO_COMANDI.test(b.testo)) {
        for (const m of b.testo.matchAll(COMANDO)) {
          const [nome, arg] = dividi(m[1]);
          if (nome === 'nascosto') a.nascosto = true;
          else if (nome === 'quando') { const c = condizione(arg, b.riga); if (c) a.quando = c; }
          else errore(b.riga, `comando non ammesso in un achievement: [${m[1]}]`);
        }
      } else a.descrizione = (a.descrizione + ' ' + b.testo.replace(/^\*|\*$/g, '')).trim();
    }
    if (!a.indizi.length) errore(g.riga, `achievement «${g.titolo}» senza indizi (D19)`);
    out.push(a);
  }
}

/** Controlli strutturali dell'abbozzo. Il controllo vero del grafo (stati, segni, condizioni) è della Fase B. */
function controllaStruttura(c: Carriera, cast: Cast, errore: (r: number, m: string) => void) {
  const ids = new Set(c.nodi.map(n => n.id));
  const doppi = c.nodi.filter((n, i) => c.nodi.findIndex(m => m.id === n.id) !== i);
  for (const n of doppi) errore(n.riga, `nodo doppio: ${n.id}`);
  // Segni: valori assegnati e valori letti.
  const valori = new Map<string, Set<string>>();
  const assegna = (s: string, v: string) => (valori.get(s) ?? valori.set(s, new Set()).get(s)!).add(v);
  for (const n of c.nodi) for (const p of n.passi) {
    if (p.tipo === 'segno') assegna(p.segno, p.valore);
    if (p.tipo === 'scelta') for (const o of p.opzioni) for (const [k, v] of Object.entries(o.segni ?? {})) assegna(k, v);
  }
  const leggi = (x: Condizione | undefined, riga: number) => {
    if (!x) return;
    if ('non' in x) return leggi(x.non, riga);
    if ('tutti' in x) return x.tutti.forEach(y => leggi(y, riga));
    if ('uno' in x) return x.uno.forEach(y => leggi(y, riga));
    if ('segno' in x) {
      if (!valori.has(x.segno)) errore(riga, `segno mai assegnato: ${x.segno}`);
      else if (x.uguale && !valori.get(x.segno)!.has(x.uguale)) errore(riga, `il segno ${x.segno} non vale mai «${x.uguale}»`);
    }
  };
  const rifSegno = (r: Rif, riga: number) => {
    if (!('segno' in r)) return;
    const v = valori.get(r.segno);
    if (!v) return errore(riga, `segno mai assegnato: ${r.segno}`);
    for (const x of v) if (!cast.personaggi[x]) errore(riga, `il segno ${r.segno} vale «${x}», che non è un personaggio`);
  };
  for (const n of c.nodi) {
    leggi(n.condizione, n.riga);
    for (const p of n.passi) {
      if ('se' in p) leggi(p.se, p.riga);
      if (p.tipo === 'scelta') for (const o of p.opzioni) leggi(o.se, p.riga);
      if (p.tipo === 'partita') { rifSegno(p.giocatore, p.riga); if (Array.isArray(p.avversari)) p.avversari.forEach(r => rifSegno(r, p.riga)); }
    }
  }
  for (const a of c.achievement) { leggi(a.quando, 0); a.indizi.forEach(i => leggi(i.se, 0)); }

  // Archi, con gli sblocchi raccolti nel nodo fino al punto in cui si esce. Una fine è «fine:<esito>:<finale>».
  type Arco = {da: string; a: string; sblocchi: Set<string>};
  const archi: Arco[] = [];
  const meta = (d: Destinazione) => 'fine' in d ? `fine:${d.fine}:${d.finale ? slug(d.finale) : d.fine}` : d.nodo;
  for (const n of c.nodi) {
    const presi = new Set<string>();
    for (const p of n.passi) {
      if (p.tipo === 'sblocco') presi.add(p.sblocco);
      if (p.tipo === 'partita' && p.sconfitta) archi.push({da: n.id, a: meta(p.sconfitta), sblocchi: new Set(presi)});
      if (p.tipo === 'scelta') for (const o of p.opzioni) if (o.verso) archi.push({da: n.id, a: meta(o.verso), sblocchi: new Set([...presi, ...(o.sblocchi ?? [])])});
    }
    if ('verso' in n.uscita) archi.push({da: n.id, a: meta(n.uscita.verso), sblocchi: presi});
  }
  for (const a of archi) if (!a.a.startsWith('fine:') && a.a !== IGNOTO && a.a !== SEGUENTE && !ids.has(a.a)) errore(0, `arco verso un nodo che non esiste: ${a.a}`);
  const raggiungibili = (da: string, ok: (a: Arco) => boolean = () => true) => {
    const visti = new Set([da]);
    for (const coda = [da]; coda.length;) { const x = coda.shift()!; for (const a of archi) if (a.da === x && ok(a) && !visti.has(a.a)) { visti.add(a.a); coda.push(a.a); } }
    return visti;
  };
  const daInizio = raggiungibili(c.inizio);
  for (const n of c.nodi) if (!daInizio.has(n.id)) errore(n.riga, `nodo non raggiungibile: ${n.id}`);
  for (const n of c.nodi) if (![...raggiungibili(n.id)].some(x => x.startsWith('fine:'))) errore(n.riga, `vicolo cieco: da ${n.id} non si arriva a nessuna fine`);
  for (const s of c.obbligatori) {
    if (!archi.some(a => a.sblocchi.has(s))) { errore(0, `sblocco obbligatorio mai dato: ${s}`); continue; }
    if ([...raggiungibili(c.inizio, a => !a.sblocchi.has(s))].some(x => x.startsWith('fine:completata:'))) errore(0, `sblocco obbligatorio non presente su ogni percorso: ${s}`);
  }
  // Le condizioni sui finali (P7) devono nominare un finale che esiste.
  const finali = new Set(archi.filter(a => a.a.startsWith('fine:')).map(a => a.a.split(':')[2]));
  const finaliLetti = (x: Condizione | undefined, riga: number): void => {
    if (!x) return;
    if ('non' in x) return finaliLetti(x.non, riga);
    if ('tutti' in x) return x.tutti.forEach(y => finaliLetti(y, riga));
    if ('uno' in x) return x.uno.forEach(y => finaliLetti(y, riga));
    if ('finale' in x && !finali.has(x.finale)) errore(riga, `finale sconosciuto nella condizione: ${x.finale}`);
  };
  for (const n of c.nodi) { finaliLetti(n.condizione, n.riga); for (const p of n.passi) { if ('se' in p) finaliLetti(p.se, p.riga); if (p.tipo === 'scelta') p.opzioni.forEach(o => finaliLetti(o.se, p.riga)); } }
  for (const a of c.achievement) { finaliLetti(a.quando, 0); a.indizi.forEach(i => finaliLetti(i.se, 0)); }
  for (const a of c.achievement) {
    const dato = c.nodi.some(n => n.passi.some(p => p.tipo === 'achievement' && p.achievement === a.id));
    if (!dato && !a.quando) errore(0, `achievement «${a.titolo}» senza [Quando: …] e mai dato da un passo`);
  }
}

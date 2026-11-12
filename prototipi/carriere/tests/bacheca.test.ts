// Fase C: composizione della bacheca a lettere (bacheca.md). Le misure del testo dei dialoghi sono in testo.test.ts dalla Fase F.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aCapo, caso, componi, lettere, ROSSO_SEI_QUI, spilloDi, STILI, statoBozzetto} from '../src/bacheca.ts';
import {prova} from './aiuto.ts';

const bozzetto = () => {
  const c = prova();
  const {stato, ultimo} = statoBozzetto(c);
  return componi(c, stato, ultimo, "Serraglio — carriera: Dov'è Grappino?");
};

test('il bozzetto è a metà giro, con tutti gli stati dei nodi', () => {
  const comp = bozzetto();
  const per = Object.fromEntries(comp.punti.map(x => [x.id, `${x.stato}${x.postit ? '+postit' : ''}${x.corrente ? '+puntina' : ''}${x.freccia ? '+freccia' : ''}`]));
  assert.deepEqual(per, {
    'nodo-a': 'fatto', 'nodo-b': 'escluso', 'nodo-c': 'fatto+puntina', 'nodo-d': 'aperto', 'nodo-e': 'disponibile+freccia',
    'nodo-g': 'aperto', 'nodo-h': 'aperto+postit', 'fine:grappino-e-tornato': 'aperto', 'fine:grappino-scappa-di-nuovo': 'aperto+postit',
  }, 'il vicolo segreto mai trovato non c\'è, nemmeno il post-it');
  assert.ok(comp.punti.find(x => x.id === 'nodo-b')!.caduta, 'una lettera del ramo escluso è caduta in fondo alla cornice');
});

test('le cordicelle: tese per il percorso fatto, lente da fare, arrotolate se chiuse, rosse per la sconfitta', () => {
  const fili = Object.fromEntries(bozzetto().fili.map(f => [`${f.da}>${f.a}`, f.tipo + (f.sconfitta ? '+rossa' : '')]));
  assert.equal(fili['nodo-a>nodo-c'], 'tesa');
  assert.equal(fili['nodo-a>nodo-b'], 'arrotolata');
  assert.equal(fili['nodo-c>nodo-e'], 'lenta+rossa');
  assert.equal(fili['nodo-d>nodo-g'], 'lenta');
  assert.ok(!Object.keys(fili).some(k => k.includes('nodo-f')), 'nessuna cordicella verso il segreto non trovato');
});

test('le imperfezioni sono decise dai dati: stesse lettere a ogni apertura', () => {
  assert.deepEqual(bozzetto(), bozzetto());
  const a = lettere('IL BANCONE VUOTO', STILI.escluso, 'x').lettere, b = lettere('IL BANCONE VUOTO', STILI.escluso, 'y').lettere;
  assert.notDeepEqual(a, b, 'semi diversi, imperfezioni diverse');
  assert.ok(lettere('DISPONIBILE', STILI.disponibile, 'z').lettere.every(l => Math.abs(l.ruota) <= 0.4 && !l.manca), 'il disponibile è dritto');
  assert.equal(lettere('SULLE TRACCE', STILI.escluso, 's').lettere.filter(l => l.manca).length, 1, 'al più una lettera caduta');
  const r1 = caso('seme'), r2 = caso('seme');
  assert.deepEqual([r1(), r1(), r1()], [r2(), r2(), r2()]);
});

test('i titoli si spezzano in due righe vicino a metà', () => {
  assert.deepEqual(aCapo('IN CUCINA', 13), ['IN CUCINA']);
  assert.deepEqual(aCapo('SULLE TRACCE IN BICI', 13), ['SULLE TRACCE', 'IN BICI']);
  assert.deepEqual(aCapo('DI NUOVO AL BANCONE', 13), ['DI NUOVO', 'AL BANCONE']);
});

test('puntine e spilli tutti diversi, scelti dai dati; «sei qui» è una puntina tonda rossa', () => {
  const comp = bozzetto();
  const spilli = comp.punti.map(x => x.spillo);
  assert.ok(new Set(spilli.map(s => s.forma)).size >= 3, `forme diverse: ${spilli.map(s => s.forma).join(', ')}`);
  assert.ok(new Set(spilli.map(s => s.colore)).size >= 3, 'colori diversi');
  assert.deepEqual(comp.punti.find(x => x.corrente)!.spillo, {forma: 'tonda', colore: ROSSO_SEI_QUI, inclinazione: 0});
  assert.deepEqual(spilloDi('nodo-a', false), spilloDi('nodo-a', false), 'lo stesso punto ha sempre lo stesso spillo');
  assert.ok(!comp.punti.some(x => x.titolo.some(r => r.some(l => l.c === '★' || l.c === '→'))), 'stella e freccia sono pezzi a parte, non lettere');
});

// Fase D: la mappa vera come bacheca.
import {catenaria, disponi, pendenza, sporco, FORME, DI_PLASTICA} from '../src/bacheca.ts';
import {entra, nuovoAccount, nuovoGiro, salta, scegli, vinci, type Stato} from '../src/motore.ts';
import {tutorial} from './aiuto.ts';
import type {Carriera} from '../src/formato.ts';

test('cordicelle: la tesa è dritta, la lenta pende di più se è lunga, più che in proporzione', () => {
  assert.ok(pendenza(300, 'tesa') <= 2);
  const corta = pendenza(150, 'lenta'), lunga = pendenza(600, 'lenta');
  assert.ok(lunga > corta * 4, `pendenza ${corta.toFixed(1)} e ${lunga.toFixed(1)}`);
  const {punti, distacco} = catenaria({x: 0, y: 0}, {x: 400, y: 100}, 'lenta');
  assert.deepEqual([punti[0], punti.at(-1)], [{x: 0, y: 0}, {x: 400, y: 100}], 'agli spilli la corda è ferma');
  const meta = punti[Math.floor(punti.length / 2)];
  assert.ok(meta.y > 50 + pendenza(Math.hypot(400, 100), 'lenta') * 0.95, 'a metà pende di tutta la pendenza');
  assert.equal(Math.max(...distacco), 1);
  assert.deepEqual([distacco[0], distacco.at(-1)], [0, 0]);
});

test('sporco in posizioni fisse decise dai dati, con macchie grandi e parti consunte', () => {
  assert.deepEqual(sporco('prova:o'), sporco('prova:o'));
  assert.notDeepEqual(sporco('prova:o'), sporco('prova:v'));
  const m = sporco('prova:o');
  assert.equal(m.filter(x => x.tipo === 'consunto').length, 3);
  assert.ok(m.some(x => x.tipo === 'alone' && x.r >= 0.07), 'un alone di bicchiere grande');
  assert.ok(m.every(x => x.x >= 0 && x.x <= 1 && x.y >= 0 && x.y <= 1));
});

test('le puntine hanno i nomi delle immagini generate; di plastica quelle da ricolorare', () => {
  assert.deepEqual([...new Set(FORME)].sort(), ['chiodino', 'cilindro', 'ombrello', 'ottone', 'spillo', 'tonda']);
  assert.deepEqual([...DI_PLASTICA].sort(), ['cilindro', 'ombrello', 'tonda']);
});

/** Stati da provare: inizio, metà e fine giro, per tutte e due le carriere. */
function stati(c: Carriera): {nome: string; s: Stato}[] {
  const inizio = nuovoGiro(c, nuovoAccount());
  if (c.id === 'prova') {
    const {stato} = statoBozzetto(c);
    let fine = nuovoGiro(c, nuovoAccount());
    for (const f of [(x: Stato) => entra(c, x, 'nodo-a'), (x: Stato) => salta(c, x), (x: Stato) => scegli(c, x, 0), (x: Stato) => entra(c, x, 'nodo-b'),
      (x: Stato) => salta(c, x), (x: Stato) => vinci(c, x), (x: Stato) => entra(c, x, 'nodo-d'), (x: Stato) => salta(c, x), (x: Stato) => vinci(c, x),
      (x: Stato) => scegli(c, x, 2), (x: Stato) => entra(c, x, 'nodo-h'), (x: Stato) => salta(c, x)]) fine = f(fine).stato;
    return [{nome: 'inizio', s: inizio}, {nome: 'metà', s: stato}, {nome: 'fine', s: fine}];
  }
  let meta = inizio;
  for (const f of [(x: Stato) => entra(c, x, 'scena-0'), (x: Stato) => salta(c, x), (x: Stato) => entra(c, x, 'scena-1'), (x: Stato) => salta(c, x),
    (x: Stato) => vinci(c, x)]) meta = f(meta).stato;
  return [{nome: 'inizio', s: inizio}, {nome: 'metà', s: meta}];
}

test('la disposizione tiene tutto dentro il feltro, per le due carriere e i due orientamenti', () => {
  for (const c of [tutorial(), prova()]) for (const {nome, s} of stati(c)) for (const [w, h] of [[1366, 768], [390, 844]]) {
    const comp = componi(c, s, s.giro.visti.at(-1) ?? null, `Serraglio — carriera: ${c.titolo}`, h > w ? 12 : 13);
    const d = disponi(comp, w, h, h > w ? 56 : 0, h > w ? 64 : 58);
    const dove = `${c.id}, ${nome}, ${w}×${h}`;
    for (const x of comp.punti) {
      const q = d.pos[x.id];
      assert.ok(q.x >= d.fx && q.x <= d.fx + d.fw && q.y >= d.fy && q.y <= d.fy + d.fh, `${dove}: spillo di ${x.id} fuori dal feltro`);
    }
    // Gli spilli non si sovrappongono.
    const tutti = comp.punti.map(x => d.pos[x.id]);
    for (let i = 0; i < tutti.length; i++) for (let j = i + 1; j < tutti.length; j++)
      assert.ok(Math.hypot(tutti[i].x - tutti[j].x, tutti[i].y - tutti[j].y) > d.p * 2, `${dove}: spilli troppo vicini`);
    assert.ok(d.yTestata > d.fy && d.yFinali < d.fy + d.fh);
  }
});

test('a fine giro cade una sola lettera in tutta la bacheca, mai la prima o l\'ultima di una parola', () => {
  const c = prova();
  // Secondo giro finito: B e G visti nel primo giro e chiusi in questo, quindi due righe escluse con le lettere.
  let fine = statoBozzetto(c).stato;
  for (const f of [(x: Stato) => entra(c, x, 'nodo-e'), (x: Stato) => salta(c, x), (x: Stato) => entra(c, x, 'nodo-d'), (x: Stato) => salta(c, x),
    (x: Stato) => vinci(c, x), (x: Stato) => scegli(c, x, 2), (x: Stato) => entra(c, x, 'nodo-h'), (x: Stato) => salta(c, x)]) fine = f(fine).stato;
  const comp = componi(c, fine, 'nodo-h', 'x');
  assert.ok(comp.punti.filter(x => x.stato === 'escluso' && !x.postit).length >= 2);
  const mancanti = comp.punti.flatMap(x => x.titolo.flatMap(r => r.map((l, i) => ({l, i, r})).filter(q => q.l.manca)));
  assert.equal(mancanti.length, 1);
  const {i, r} = mancanti[0];
  assert.ok(i > 0 && r[i - 1].c !== ' ' && r[i + 1] && r[i + 1].c !== ' ');
  assert.ok(comp.punti.filter(x => x.stato === 'escluso').length > 2, 'le altre righe escluse restano solo storte');
});

// Ritocchi della Fase D, dopo il giudizio del proprietario.
import {ALTEZZA_MAIUSCOLE, GEOMETRIA, ingombroPuntina, latoPuntina} from '../src/bacheca.ts';

test('nessuna puntina sopra le lettere di un titolo, né sopra il «???» di un post-it', () => {
  // Gli stati veri, e poi le stesse bacheche con tutte le puntine di una sola forma: ogni forma deve stare lontana dalle lettere.
  const forme = [null, ...FORME.filter((f, i) => FORME.indexOf(f) === i)];
  for (const c of [tutorial(), prova()]) for (const {nome, s} of stati(c)) for (const [w, h] of [[1366, 768], [390, 844]]) for (const forma of forme) {
    const comp = componi(c, s, s.giro.visti.at(-1) ?? null, `Serraglio — carriera: ${c.titolo}`, h > w ? 12 : 13);
    if (forma) for (const x of comp.punti) x.spillo = {...x.spillo, forma, inclinazione: 0};
    const d = disponi(comp, w, h, h > w ? 56 : 0, h > w ? 64 : 58);
    const dove = `${c.id}, ${nome}, ${w}×${h}${forma ? `, tutte ${forma}` : ''}`;
    const testi = comp.punti.map(x => {
      const e = d.etichette[x.id], fsR = x.tipo === 'finale' ? d.fs * 0.9 : d.fs;
      if (x.postit) {
        // Il «???» scritto a penna: corpo 2p, base all'82% del post-it.
        const base = d.postitY[x.id] + d.postit.h * 0.82;
        return {id: x.id, x0: d.pos[x.id].x - d.p * 1.6, x1: d.pos[x.id].x + d.p * 1.6, y0: base - d.p * 2 * 0.72, y1: base};
      }
      const lw = Math.max(...x.titolo.map(t => t.length)) * 0.42 * fsR;
      const x0 = e.ancora === 'middle' ? e.x - lw / 2 : e.x;
      return {id: x.id, x0, x1: x0 + lw, y0: e.y - fsR * ALTEZZA_MAIUSCOLE, y1: e.y + (x.titolo.length - 1) * d.p * 2};
    });
    for (const x of comp.punti) {
      const b = ingombroPuntina(x.spillo, d.pos[x.id], d.lato[x.id]);
      for (const t of testi) {
        const sopra = b.x0 < t.x1 && b.x1 > t.x0 && b.y0 < t.y1 && b.y1 > t.y0;
        assert.ok(!sopra, `${dove}: la puntina di ${x.id} copre le lettere di ${t.id}`);
      }
    }
  }
});

test('le puntine sono abbastanza grandi da riconoscersi sul telefono, «sei qui» di più', () => {
  for (const verticale of [false, true]) {
    const p = verticale ? 14 : 18;
    const testa = (forma: keyof typeof GEOMETRIA, corrente = false) => (GEOMETRIA[forma].box[2] - GEOMETRIA[forma].box[0]) * latoPuntina(p, verticale, corrente);
    assert.ok(testa('tonda') >= 20, `testa tonda ${testa('tonda').toFixed(0)} px`);
    assert.ok(testa('tonda', true) >= 26, `«sei qui» ${testa('tonda', true).toFixed(0)} px`);
  }
});

test('l\'ancora è il punto in cui la puntina entra nel feltro: lì si legano le cordicelle, e l\'inclinazione ruota intorno a lì', () => {
  const s = {forma: 'chiodino' as const, colore: '#000', inclinazione: 0};
  const b = ingombroPuntina(s, {x: 100, y: 100}, 100);
  const g = GEOMETRIA.chiodino;
  assert.ok(Math.abs(b.x0 - (100 + (g.box[0] - g.ancora.x) * 100)) < 1e-9 && Math.abs(b.y1 - (100 + (g.box[3] - g.ancora.y) * 100)) < 1e-9);
  const ruotato = ingombroPuntina({...s, inclinazione: 90}, {x: 100, y: 100}, 100);
  assert.ok(ruotato.x1 <= 100 + 1e-9 + (g.ancora.y - g.box[1]) * 100 && ruotato.x0 < 100);
});

test('a fine giro sono tese solo le cordicelle del percorso fatto; le altre si arrotolano', () => {
  const c = prova();
  let fine = statoBozzetto(c).stato;
  for (const f of [(x: Stato) => entra(c, x, 'nodo-e'), (x: Stato) => salta(c, x), (x: Stato) => entra(c, x, 'nodo-d'), (x: Stato) => salta(c, x),
    (x: Stato) => vinci(c, x), (x: Stato) => scegli(c, x, 2), (x: Stato) => entra(c, x, 'nodo-h'), (x: Stato) => salta(c, x)]) fine = f(fine).stato;
  const fili = componi(c, fine, 'nodo-h', 'x').fili;
  assert.deepEqual(fili.filter(f => f.tipo === 'tesa').map(f => `${f.da}>${f.a}`).sort(),
    ['nodo-a>nodo-c', 'nodo-c>nodo-e', 'nodo-d>nodo-h', 'nodo-e>nodo-d', 'nodo-h>fine:grappino-scappa-di-nuovo']);
  assert.equal(fili.find(f => f.da === 'nodo-c' && f.a === 'nodo-d')!.tipo, 'arrotolata', 'fra due nodi visti, ma non percorsa');
  assert.ok(!fili.some(f => f.tipo === 'lenta'), 'a giro finito non c\'è più niente da fare');
});

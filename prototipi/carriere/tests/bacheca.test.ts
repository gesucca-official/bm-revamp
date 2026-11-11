// Fase C: composizione della bacheca a lettere (bacheca.md) e misure del testo dei dialoghi.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aCapo, caso, componi, lettere, ROSSO_SEI_QUI, spilloDi, STILI, statoBozzetto} from '../src/bacheca.ts';
import {corpo, CARATTERI} from '../src/ui/font.ts';
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
    'nodo-a': 'fatto', 'nodo-b': 'escluso', 'nodo-c': 'fatto+puntina', 'nodo-d': 'aperto', 'nodo-e': 'disponibile+postit+freccia',
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

test('il corpo dei dialoghi: al più tre righe, fra il minimo e il massimo', () => {
  const [shantell] = CARATTERI;
  assert.equal(corpo('Breve.', 1147, 120, shantell, 15, 36), 31, 'una battuta breve prende il massimo che l\'altezza consente');
  const lunga = 'I Sioux non scappano dal Kazakistan con i contanti nascosti nelle suole delle scarpe, come i Navaho. I Sioux la mancia la lasciano sempre.';
  const px = corpo(lunga, 358, 155, shantell, 15, 26);
  assert.ok(px >= 15 && px <= 26);
  // Shantell Sans è largo: sul telefono una battuta di 137 caratteri va su quattro righe al corpo minimo, ma resta dentro la finestra.
  const righe = Math.ceil(lunga.length * px * shantell.larghezza / 358);
  assert.ok(righe * px * 1.3 <= 155, `sta nella finestra (${righe} righe a ${px} px)`);
  const patrick = CARATTERI[1];
  const pp = corpo(lunga, 358, 155, patrick, 15, 26);
  assert.ok(Math.ceil(lunga.length * pp * patrick.larghezza / 358) <= 3, 'con Patrick Hand sta in tre righe');
  assert.equal(corpo('x'.repeat(600), 358, 155, shantell), 15, 'le frasi di Piera scendono al minimo');
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

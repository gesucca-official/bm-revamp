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

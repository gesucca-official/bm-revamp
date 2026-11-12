// CA-0a, Fase F: il testo che scorre nella finestra a due righe. Pagine dagli a capo del disegno, fermate (stacchi, pagine, fine), tocchi.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fermate, inizia, inVista, pagine, scorri, STACCO_MINIMO, tocca, type Scorrimento} from '../src/ui/testo.ts';

test('le pagine: ogni due righe del disegno ne comincia una, sempre a inizio parola', () => {
  // Cinque parole: le prime due nella riga 0, la terza nella 1, le ultime due nella 2.
  assert.deepEqual(pagine([0, 5, 10, 15, 20], [0, 0, 1, 2, 2]), [0, 15]);
  assert.deepEqual(pagine([0, 4, 8, 12, 16, 20], [0, 1, 2, 3, 4, 5]), [0, 8, 16]);
  assert.deepEqual(pagine([0, 4, 8], [0, 0, 1]), [0], 'due righe: una pagina sola');
  assert.deepEqual(pagine([], []), [0]);
  assert.deepEqual(pagine([0, 4, 8, 12], [0, 1, 2, 3], 3), [0, 12], 'con pagine da tre righe');
});

test('le fermate: stacchi dopo i puntini, inizi di pagina e fine; uno stacco seguito da una pagina è una fermata sola', () => {
  const testo = 'Grappino... non c\'è più... era qui.';
  assert.deepEqual(fermate(testo, false, [0]), [{pos: testo.length, stacco: false, pagina: null, fine: true}], 'senza stacchi né pagine: solo la fine');
  const f = fermate(testo, true, [0, 12]);
  assert.deepEqual(f.map(x => [x.pos, x.stacco, x.pagina, x.fine]), [[11, true, 12, false], [26, true, null, false], [testo.length, false, null, true]]);
  const g = fermate('Una frase lunga che va a capo due volte.', false, [0, 16, 99]);
  assert.deepEqual(g.map(x => [x.pos, x.pagina]), [[16, 16], [40, null]], 'pagine oltre la fine ignorate');
  assert.deepEqual(fermate('Fine... ', true, [0]).map(x => x.stacco), [true, false], 'i puntini seguiti da uno spazio fanno uno stacco');
  assert.deepEqual(fermate('Fine...', true, [0]).map(x => x.stacco), [false], 'in fondo alla battuta no');
});

const scrivi = (s: Scorrimento, f: ReturnType<typeof fermate>, n: number, ora = 0) => { for (let i = 0; i < n; i++) scorri(s, f, 1, ora); };

test('una battuta lunga: si ferma a fine pagina, aspetta il tocco, la pagina dopo comincia vuota', () => {
  const testo = 'Primo pezzo di testo e poi il secondo pezzo.';
  const f = fermate(testo, false, [0, 23]);
  const s = inizia(testo);
  scrivi(s, f, 10);
  assert.deepEqual(inVista(testo, s, f), {visibile: 'Primo pezz', resto: 'o di testo e '}, 'il resto della pagina tiene fermi gli a capo');
  scrivi(s, f, 30);
  assert.equal(s.car, 23, 'si ferma all\'inizio della pagina dopo');
  assert.ok(s.attesa && !s.completo);
  assert.equal(inVista(testo, s, f).visibile, 'Primo pezzo di testo e ');
  assert.deepEqual(tocca(s, f, 0), {usato: true});
  assert.equal(s.inizio, 23);
  assert.deepEqual(inVista(testo, s, f), {visibile: '', resto: 'poi il secondo pezzo.'});
  scrivi(s, f, 100);
  assert.ok(s.completo);
  assert.equal(inVista(testo, s, f).visibile, 'poi il secondo pezzo.');
  assert.deepEqual(tocca(s, f, 0), {usato: false}, 'a battuta completa il tocco va alla battuta dopo');
});

test('il tocco mentre scrive completa fino alla prossima fermata, non tutta la battuta', () => {
  const testo = 'Primo pezzo di testo e poi il secondo pezzo.';
  const f = fermate(testo, false, [0, 23]);
  const s = inizia(testo);
  scrivi(s, f, 3);
  tocca(s, f, 0);
  assert.equal(s.car, 23); assert.ok(s.attesa);
  tocca(s, f, 0);
  tocca(s, f, 0);
  assert.ok(s.completo, 'sulla seconda pagina il tocco la completa');
  assert.equal(inVista(testo, s, f).visibile, 'poi il secondo pezzo.');
});

test('gli stacchi di Piera: lo stacco aspetta la durata minima, poi passa a chi ascolta dopo; se lì comincia una pagina, la volta', () => {
  const testo = 'Grappino... non c\'è più... era qui.';
  const f = fermate(testo, true, [0, 12]);
  const s = inizia(testo);
  scrivi(s, f, 100, 1000);
  assert.equal(s.car, 11); assert.equal(s.stacco, 1000); assert.equal(s.staccoN, 0);
  const presto = tocca(s, f, 1000 + 100);
  assert.equal(presto.aspetta, STACCO_MINIMO - 100, 'troppo presto: aspetta quel che manca');
  assert.equal(s.stacco, 1000, 'lo stacco resta');
  tocca(s, f, 1000 + STACCO_MINIMO);
  assert.equal(s.stacco, null); assert.equal(s.staccoN, 1, 'il prossimo stacco è sul secondo che ascolta');
  assert.equal(s.inizio, 12, 'finito lo stacco si volta pagina, senza un tocco in più');
  scrivi(s, f, 100, 5000);
  assert.equal(s.car, 26); assert.equal(s.stacco, 5000);
  assert.equal(inVista(testo, s, f).visibile, 'non c\'è più...');
});

test('la battuta interrotta si interrompe a metà dell\'ultimo pezzo, una volta sola', () => {
  const testo = 'Uno... due tre quattro cinque sei';
  const f = fermate(testo, true, [0]);
  const s = inizia(testo);
  scrivi(s, f, 100);
  tocca(s, f, STACCO_MINIMO);
  // L'ultimo pezzo va da 6 a 33: metà a 19,5.
  let interrotta = -1;
  for (let i = 0; i < 40 && interrotta < 0; i++) if (scorri(s, f, 1, 0, true).interrompi) interrotta = s.car;
  assert.equal(interrotta, 20);
  assert.ok(!scorri(s, f, 1, 0, true).interrompi, 'una volta sola');
  const senza = inizia('Una frase intera');
  const g = fermate('Una frase intera', false, [0]);
  for (let i = 0; i < 40; i++) assert.ok(!scorri(senza, g, 1, 0, false).interrompi);
  assert.ok(senza.completo);
});

test('una battuta vuota è subito completa', () => {
  const s = inizia('');
  assert.ok(s.completo);
  assert.deepEqual(tocca(s, fermate('', false, [0]), 0), {usato: false});
});

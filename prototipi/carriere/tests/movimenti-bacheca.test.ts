// CA-0a, Fase G: la bacheca si muove. Cordicelle che oscillano, puntina che viaggia, post-it che si stacca, lettera che cade e torna.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {agitazione, alPosto, ampiezzaFilo, angoloCoda, cadutaLettera, filoMosso, letteraAllentata, oscillazione, premioLettere, PREMIO_LETTERE,
  scoperti, siAllenta, staccoPostit, TEMPI, tremolio, trovaLettera, viaggio} from '../src/movimentiBacheca.ts';
import {catenaria, componi, statoBozzetto, type Punto} from '../src/bacheca.ts';
import {prova} from './aiuto.ts';

const campioni = (f: (t: number) => number, da = 0, a = 10, passo = 0.01) => { const v: number[] = []; for (let t = da; t <= a; t += passo) v.push(f(t)); return v; };

test('le cordicelle: oscillano solo quelle che penzolano, poco, lente, ognuna a modo suo', () => {
  assert.equal(ampiezzaFilo('tesa', 400), 0, 'le tese non oscillano');
  assert.equal(ampiezzaFilo('arrotolata', 400), 0, 'l\'arrotolata dondola solo con la coda');
  const corta = ampiezzaFilo('lenta', 80), lunga = ampiezzaFilo('lenta', 500);
  assert.ok(corta > 1 && lunga > corta && lunga <= 9, `poco, e di più se pende di più (${corta.toFixed(1)}, ${lunga.toFixed(1)})`);
  assert.equal(ampiezzaFilo('lenta', 1500), 9, 'mai più di nove pixel, anche per una cordicella lunghissima');
  const o = campioni(t => oscillazione(t, 'a>b'));
  assert.ok(Math.max(...o) <= 1 && Math.min(...o) >= -1 && Math.max(...o) > 0.7 && Math.min(...o) < -0.7);
  const passaggi = o.slice(1).filter((x, i) => Math.sign(x) !== Math.sign(o[i])).length;
  assert.ok(passaggi >= 4 && passaggi <= 14, `lente: un'andata e ritorno ogni tre-cinque secondi (${passaggi} passaggi in dieci)`);
  assert.notDeepEqual(campioni(t => oscillazione(t, 'a>b'), 0, 2, 0.1), campioni(t => oscillazione(t, 'c>d'), 0, 2, 0.1), 'ognuna a modo suo');
  assert.deepEqual(campioni(t => oscillazione(t, 'a>b'), 0, 2, 0.1), campioni(t => oscillazione(t, 'a>b'), 0, 2, 0.1), 'e sempre allo stesso modo');
  assert.ok(Math.abs(angoloCoda(1.3, 'x')) <= 4 && campioni(t => Math.abs(angoloCoda(t, 'x'))).some(x => x > 2.5), 'la coda dell\'arrotolata dondola di qualche grado');
});

test('dopo un colpo le cordicelle si agitano di più, e si calmano in un paio di secondi', () => {
  assert.equal(agitazione(null), 1);
  assert.equal(agitazione(-1), 1, 'un colpo nel futuro non conta');
  assert.ok(Math.abs(agitazione(0) - 3) < 1e-9, 'subito il triplo');
  assert.ok(agitazione(1) < 1.5 && agitazione(3) < 1.02);
});

test('la cordicella mossa: si sposta di lato al centro, gli spilli restano dove sono', () => {
  const {punti, distacco} = catenaria({x: 0, y: 0}, {x: 300, y: 0}, 'lenta');
  const mossa = filoMosso(punti, distacco, 6);
  assert.deepEqual(mossa[0], punti[0]); assert.deepEqual(mossa.at(-1), punti.at(-1));
  const meta = Math.floor(punti.length / 2);
  assert.ok(Math.abs(mossa[meta].x - punti[meta].x - 6) < 0.1, 'al centro di tutto lo spostamento');
  assert.ok(mossa[meta].y < punti[meta].y, 'e si alza un poco, come una corda che dondola');
  assert.deepEqual(filoMosso(punti, distacco, 0), punti);
});

test('la puntina «sei qui» viaggia: parte e arriva al punto giusto, passa su un arco sollevata e si pianta con un colpo', () => {
  const da = {x: 100, y: 300}, a = {x: 500, y: 300};
  const inizio = viaggio(0, da, a), fine = viaggio(1, da, a), meta = viaggio(0.5, da, a);
  assert.deepEqual([inizio.x, inizio.y], [100, 300]);
  assert.deepEqual([fine.x, fine.y, fine.alza, fine.scala], [500, 300, 0, 1], 'arrivata: piantata, ferma, grande come prima');
  assert.ok(meta.y < 300 - 40, 'passa su un arco, sopra la linea dritta');
  assert.ok(meta.alza > 0.9 && meta.scala > 1.1, 'a metà strada è sollevata (più grande, ombra più lontana)');
  assert.ok(campioni(t => viaggio(t, da, a).scala, 0.86, 0.99, 0.01).some(s => s < 1), 'piantandosi si schiaccia per un attimo');
  assert.deepEqual(viaggio(2, da, a), fine, 'oltre la fine resta ferma');
});

test('il post-it di un nodo appena scoperto: si piega attorno alla puntina, cade e sparisce', () => {
  assert.deepEqual(staccoPostit(0, 400), {dy: 0, ruota: 0, opacita: 1});
  const piegato = staccoPostit(0.3, 400);
  assert.ok(piegato.ruota > 8 && piegato.dy === 0, 'prima si piega senza cadere');
  const cade = staccoPostit(0.8, 400);
  assert.ok(cade.dy > 100 && cade.dy <= 400 && cade.opacita === 1, 'poi cade per gravità');
  assert.equal(staccoPostit(5, 400).dy, 400, 'non oltre il fondo della cornice');
  assert.equal(staccoPostit(TEMPI.staccoPostit, 400).opacita, 0, 'e alla fine non c\'è più');
  const giu = campioni(t => staccoPostit(t, 400).dy, 0, TEMPI.staccoPostit, 0.02);
  assert.ok(giu.every((x, i) => i === 0 || x >= giu[i - 1]), 'scende sempre');
  // Quali post-it: quelli dei nodi che avevano il post-it e ora mostrano le lettere.
  const punti = [{id: 'a', postit: false}, {id: 'b', postit: true}, {id: 'c', postit: false}] as Punto[];
  assert.deepEqual(scoperti(['a', 'b'], punti), ['a']);
  assert.deepEqual(scoperti([], punti), []);
});

test('la lettera allentata: al più una per volta, una volta su due, scelta dai dati fra i titoli visibili e non chiusi', () => {
  const sì = Array.from({length: 200}, (_, i) => siAllenta(`prova:allenta:1:${i}`, false)).filter(Boolean).length;
  assert.ok(sì > 70 && sì < 130, `una volta su due (${sì} su 200)`);
  assert.ok(Array.from({length: 50}, (_, i) => siAllenta(`x${i}`, true)).every(x => !x), 'mai se ce n\'è già una caduta');
  assert.equal(siAllenta('prova:allenta:1:3', false), siAllenta('prova:allenta:1:3', false), 'sempre la stessa risposta per gli stessi dati');
  const c = prova(), {stato, ultimo} = statoBozzetto(c);
  const comp = componi(c, stato, ultimo, 'Serraglio');
  for (let i = 0; i < 40; i++) {
    const l = letteraAllentata(comp.punti, `semi:${i}`)!;
    const n = comp.punti.find(x => x.id === l.id)!;
    assert.ok(n.tipo === 'nodo' && !n.postit && n.stato !== 'escluso', `${l.id}: un nodo visibile e non chiuso`);
    const dove = trovaLettera(n.titolo, l.k)!;
    assert.ok(n.titolo[dove.riga][dove.indice].c.trim(), 'mai uno spazio');
  }
  assert.deepEqual(letteraAllentata(comp.punti, 'uno'), letteraAllentata(comp.punti, 'uno'));
  assert.equal(letteraAllentata(comp.punti.map(n => ({...n, postit: true})), 'uno'), null, 'tutti con il post-it: nessuna');
});

test('trovare la lettera nelle righe del titolo, saltando gli spazi', () => {
  const t = [[{c: 'I'}, {c: 'N'}, {c: ' '}, {c: 'C'}], [{c: 'U'}, {c: 'C'}]];
  assert.deepEqual(trovaLettera(t, 0), {riga: 0, indice: 0});
  assert.deepEqual(trovaLettera(t, 2), {riga: 0, indice: 3}, 'lo spazio non conta');
  assert.deepEqual(trovaLettera(t, 4), {riga: 1, indice: 1});
  assert.equal(trovaLettera(t, 5), null);
});

test('la lettera tremola sempre di più, poi cade in fondo girando, con un piccolo rimbalzo', () => {
  assert.equal(tremolio(0), 0); assert.equal(tremolio(TEMPI.tremolio), 0);
  const primo = Math.max(...campioni(t => Math.abs(tremolio(t)), 0, 0.6)), ultimo = Math.max(...campioni(t => Math.abs(tremolio(t)), 1.8, TEMPI.tremolio - 0.01));
  assert.ok(primo < 5 && ultimo > 6 && ultimo <= 9, `cresce (${primo.toFixed(1)}°, poi ${ultimo.toFixed(1)}°)`);
  const da = {x: 100, y: 200}, a = {x: 300, y: 700};
  assert.deepEqual(cadutaLettera(0, da, a, 90), {x: 100, y: 200, ruota: 0});
  const fine = cadutaLettera(TEMPI.caduta, da, a, 90);
  assert.ok(Math.abs(fine.x - 300) < 1e-9 && Math.abs(fine.y - 700) < 1e-9 && fine.ruota === 90);
  const y = campioni(t => cadutaLettera(t, da, a, 90).y, 0, TEMPI.caduta, 0.01);
  const tocca = y.findIndex(q => q >= 700 - 4);
  assert.ok(tocca > 0 && y.slice(tocca).some(q => q < 700 - 20 && q > 650), 'tocca il fondo e fa un rimbalzo piccolo');
  assert.ok(Math.max(...y) <= 700 + 1e-9, 'mai sotto il fondo');
  assert.ok(y[10] - y[0] < y[50] - y[40], 'accelera cadendo');
});

test('rimessa a posto se lasciata vicino al suo posto; la variante dell\'achievement è spenta', () => {
  assert.ok(alPosto({x: 105, y: 198}, {x: 100, y: 200}, 30));
  assert.ok(!alPosto({x: 140, y: 200}, {x: 100, y: 200}, 30));
  assert.equal(PREMIO_LETTERE.attivo, false, 'da confermare: spento');
  assert.ok(!premioLettere(PREMIO_LETTERE.quante));
  const acceso = {...PREMIO_LETTERE, attivo: true};
  assert.ok(premioLettere(acceso.quante, acceso) && !premioLettere(acceso.quante - 1, acceso) && !premioLettere(acceso.quante + 1, acceso), 'acceso: una volta sola');
});

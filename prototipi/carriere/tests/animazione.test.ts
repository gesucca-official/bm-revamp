// CA-0a, Fase E: le prove del movimento procedurale dei ritratti, della maglia di Spazienzio e della larghezza delle maiuscole.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FERMA, LIVELLI, deforma, movimento, trasformazione, SPAZIENZIO} from '../src/animazione.ts';
import {CARATTERI, corpo, larghezzaMedia} from '../src/ui/font.ts';

const LONTANO = 1000;  // un ingresso finito da un pezzo
const scarto = (a: {tx: number; ty: number; rot: number; sx: number; sy: number}, b = FERMA) =>
  Math.max(Math.abs(a.tx - b.tx), Math.abs(a.ty - b.ty), Math.abs(a.rot - b.rot) / 100, Math.abs(a.sx - b.sx), Math.abs(a.sy - b.sy));
const campioni = (f: (t: number) => number, da = 0, a = 12, passo = 0.01) => { const v: number[] = []; for (let t = da; t <= a; t += passo) v.push(f(t)); return v; };

test('i livelli dell\'interruttore: fermi, movimento, maglia', () => {
  assert.deepEqual(LIVELLI.map(l => l.id), ['fermo', 'movimento', 'maglia']);
});

test('il respiro: un lieve allungamento verticale che conserva il volume, senza spostare né ruotare', () => {
  const sy = campioni(t => movimento(undefined, t, null, LONTANO).sy);
  assert.ok(Math.max(...sy) > 1.006 && Math.max(...sy) <= 1.0081, 'si allunga di poco meno dell\'1%');
  assert.ok(Math.min(...sy) < 0.994 && Math.min(...sy) >= 0.9919);
  for (const t of [0.3, 1.1, 2.5]) {
    const p = movimento(undefined, t, null, LONTANO);
    assert.ok((p.sy - 1) * (p.sx - 1) <= 0, 'se si allunga si stringe');
    assert.equal(p.tx, 0); assert.equal(p.rot, 0);
  }
});

test('il sobbalzo a ogni parola: un colpetto in su che si spegne in un decimo di secondo', () => {
  const t = 0.0;  // il respiro a t = 0 è nullo
  const subito = movimento(undefined, t, 0, LONTANO), dopo = movimento(undefined, t, 0.1, LONTANO), tardi = movimento(undefined, t, 0.5, LONTANO);
  assert.ok(subito.ty < -0.005 && subito.sy > 1.019 && subito.sx < 0.989, 'appena appare la parola: su, allungato, stretto');
  assert.ok(Math.abs(dopo.sy - 1) < Math.abs(subito.sy - 1) / 3, 'dopo un decimo di secondo è quasi spento');
  assert.ok(scarto(tardi) < 0.0001, 'dopo mezzo secondo non c\'è più');
  assert.ok(scarto(movimento(undefined, t, null, LONTANO)) < 1e-9, 'con il testo fermo nessun sobbalzo');
  assert.ok(scarto(movimento(undefined, t, -0.1, LONTANO)) < 1e-9, 'una parola nel futuro non conta');
});

test('l\'ingresso: arriva schiacciato, rimbalza allungandosi e si assesta', () => {
  const subito = movimento(undefined, 0, null, 0);
  assert.ok(subito.sy < 0.88 && subito.sx > 1.07, 'schiacciato e allargato');
  assert.ok(subito.ty > 0.03, 'un poco più in basso');
  const sy = campioni(e => movimento(undefined, 0, null, e).sy, 0, 0.4, 0.005);
  assert.ok(Math.max(...sy) > 1.02, 'nel rimbalzo si allunga');
  assert.ok(scarto(movimento(undefined, 0, null, 1)) < 0.002, 'dopo un secondo è fermo');
  assert.ok(scarto(movimento(undefined, 0, null, -1)) < 1e-9, 'un cambio nel futuro non conta');
});

test('un movimento per espressione: tremito per furioso, ondeggiare lento per brilla, scatti per agitata', () => {
  const base = (t: number) => movimento(undefined, t, null, LONTANO);
  // Tremito: veloce (più di dieci inversioni al secondo) e piccolo.
  const tx = campioni(t => movimento('furioso', t, null, LONTANO).tx - base(t).tx, 0, 1, 0.002);
  const inversioni = tx.slice(1).filter((x, i) => Math.sign(x) !== Math.sign(tx[i]) && x !== 0).length;
  assert.ok(inversioni >= 20, `furioso trema (${inversioni} inversioni in un secondo)`);
  assert.ok(Math.max(...tx.map(Math.abs)) < 0.006, 'ma di poco');
  // Brilla: ondeggia lento, oltre due gradi, in tre secondi.
  const rot = campioni(t => movimento('brilla', t, null, LONTANO).rot, 0, 3, 0.01);
  assert.ok(Math.max(...rot) > 2 && Math.min(...rot) < -2, 'brilla ondeggia di due gradi per parte');
  const inv = rot.slice(1).filter((x, i) => Math.sign(x) !== Math.sign(rot[i])).length;
  assert.ok(inv <= 3, 'lentamente');
  // Agitata: scatti netti a 0,8 s, sempre gli stessi, in direzioni diverse.
  const scatto = (k: number) => movimento('agitata', k * 0.8, null, LONTANO).tx;
  const dirs = [0, 1, 2, 3, 4, 5, 6, 7].map(k => Math.sign(scatto(k)));
  assert.ok(dirs.includes(1) && dirs.includes(-1), 'gli scatti cambiano direzione');
  assert.deepEqual(dirs, [0, 1, 2, 3, 4, 5, 6, 7].map(k => Math.sign(scatto(k))), 'e sono sempre gli stessi');
  assert.ok(Math.abs(scatto(3)) > 0.008, 'appena dato lo scatto è netto');
  assert.ok(Math.abs(movimento('agitata', 3 * 0.8 + 0.4, null, LONTANO).tx) < 0.001, 'poi si ferma fino al prossimo');
  // Le altre espressioni muovono qualcosa; un'espressione sconosciuta solo respira.
  for (const e of ['fumante', 'assonnata', 'sospettosa', 'illuminata']) {
    assert.ok(campioni(t => scarto(movimento(e, t, null, LONTANO), base(t)), 0, 5, 0.05).some(x => x > 0.002), `${e} si muove`);
  }
  assert.deepEqual(movimento('neutra', 1.7, null, LONTANO), base(1.7));
});

test('la trasformazione CSS di una posa', () => {
  assert.equal(trasformazione(FERMA, 600, 'translateX(-50%)'), 'translateX(-50%) translate(0.00px, 0.00px) rotate(0.000deg) scale(1.0000, 1.0000)');
  assert.equal(trasformazione({tx: 0.01, ty: -0.02, rot: 1.5, sx: 1.1, sy: 0.9}, 500), 'translate(5.00px, -10.00px) rotate(1.500deg) scale(1.1000, 0.9000)');
});

test('la maglia di Spazienzio: si piega la testa intorno al collo, il busto respira, il bordo basso e i lati restano fermi', () => {
  const c = SPAZIENZIO;
  const dist = (a: {u: number; v: number}, b: {u: number; v: number}) => Math.hypot(a.u - b.u, (a.v - b.v) * c.aspetto);
  for (const t of [0, 0.4, 1.3, 2.9]) for (const parlando of [false, true]) {
    // Il bordo basso non si muove mai, gli angoli in alto nemmeno (lontani dalla testa).
    for (let u = 0; u <= 1; u += 0.1) assert.ok(dist(deforma(u, 1, t, parlando, 0, c), {u, v: 1}) < 1e-9, 'bordo basso fermo');
    for (const [u, v] of [[0, 0], [1, 0], [0.02, 0.3], [0.98, 0.3]]) assert.ok(dist(deforma(u, v, t, parlando, null, c), {u, v}) < 1e-9, 'angoli fermi');
    // Il perno del collo non gira con la testa: si muove solo col respiro del busto (meno di un centesimo dell'altezza).
    assert.ok(dist(deforma(c.perno.u, c.perno.v, t, parlando, null, c), c.perno) < 0.013, 'il perno segue solo il respiro');
  }
  // La cima della testa ruota: si sposta di lato, poco in verticale, ed è un moto rigido (le distanze nella testa restano).
  const cima = {u: c.testa.u, v: 0.15}, fronte = {u: c.testa.u + 0.05, v: 0.2};
  const sposti = campioni(t => deforma(cima.u, cima.v, t, true, null, c).u - cima.u, 0, 4, 0.02);
  assert.ok(Math.max(...sposti) > 0.01 && Math.min(...sposti) < -0.005, 'la testa si inclina da una parte e dall\'altra');
  for (const t of [0.3, 1.9]) {
    const a = deforma(cima.u, cima.v, t, true, null, c), b = deforma(fronte.u, fronte.v, t, true, null, c);
    assert.ok(Math.abs(dist(a, b) - dist(cima, fronte)) < 1e-6, 'nella testa nessuno stiramento');
  }
  // Parlando annuisce più ampio che in silenzio; una parola appena detta dà un cenno.
  const ampiezza = (parlando: boolean) => Math.max(...campioni(t => Math.abs(deforma(cima.u, cima.v, t, parlando, null, c).u - cima.u), 0, 6, 0.02));
  assert.ok(ampiezza(true) > ampiezza(false) * 1.2, 'parlando si muove di più');
  const t = 2.2;
  assert.ok(Math.abs(deforma(cima.u, cima.v, t, true, 0, c).u - deforma(cima.u, cima.v, t, true, null, c).u) > 0.005, 'il cenno a ogni parola');
  assert.ok(Math.abs(deforma(cima.u, cima.v, t, true, 1, c).u - deforma(cima.u, cima.v, t, true, null, c).u) < 1e-4, 'che si spegne');
  // Le spalle (lontane dall'asse della testa, alla quota del collo) non ruotano con la testa.
  for (const tt of [0.3, 1.9]) assert.ok(dist(deforma(0.12, 0.45, tt, true, null, c), {u: 0.12, v: 0.45}) < 0.004, 'le spalle restano');
  // Il busto respira: il petto si allarga ai lati e si alza un poco, il bordo basso no.
  const petto = campioni(t => deforma(0.8, 0.7, t, false, null, c).u - 0.8, 0, 4, 0.02);
  assert.ok(Math.max(...petto) > 0.003 && Math.min(...petto) < -0.003, 'il petto respira');
  const alto = campioni(t => deforma(0.5, 0.7, t, false, null, c).v - 0.7, 0, 4, 0.02);
  assert.ok(Math.min(...alto) < -0.005, 'e si alza');
});

test('la larghezza delle maiuscole: le battute urlate prendono un corpo più piccolo e restano in tre righe', () => {
  const shantell = CARATTERI.find(c => c.id === 'shantell')!, bangers = CARATTERI.find(c => c.id === 'bangers')!;
  assert.equal(larghezzaMedia('ciao a tutti', shantell), shantell.larghezza);
  assert.ok(Math.abs(larghezzaMedia('CIAO A TUTTI', shantell) - shantell.larghezza * 1.32) < 1e-9);
  assert.ok(Math.abs(larghezzaMedia('Ciao', shantell) - shantell.larghezza * 1.08) < 1e-9, 'una maiuscola su quattro lettere');
  assert.equal(larghezzaMedia('...!!', shantell), shantell.larghezza, 'senza lettere nessuna correzione');
  assert.ok(Math.abs(larghezzaMedia('AAARGH!!!...', shantell) - shantell.larghezza * 1.32) < 1e-9, 'la punteggiatura non diluisce le maiuscole');
  assert.equal(larghezzaMedia('CIAO', bangers), bangers.larghezza, 'un font solo maiuscolo è già misurato sulle maiuscole');
  const urlo = 'FACCIA NUOVA, IL CANE LO TROVIAMO NOI. A MODO MIO. CERCHIAMOLO A SBERLE.';
  assert.ok(corpo(urlo, 358, 24 * 1.3 * 3, shantell, 15, 24) < corpo(urlo.toLowerCase(), 358, 24 * 1.3 * 3, shantell, 15, 24));
});

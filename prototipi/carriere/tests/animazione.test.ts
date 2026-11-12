// CA-0a, Fase E e F: le prove del movimento procedurale dei ritratti, della maglia, della scelta del modo dal cast e della bocca.
import test from 'node:test';
import assert from 'node:assert/strict';
import {AMPIEZZE_TESTA, avvicina, CHI_REAGISCE, comparsa, DURATA_ENTRATA, gradiTesta, IN_SCENA, latoDi, MASSIMO_TESTA, scalaDiChiReagisce, SCIVOLA, spostamento,
  type Posto} from '../src/animazione.ts';
import {componiPixel, erodi, pesoEllisse} from '../src/ui/maglia.ts';
import {FERMA, LIVELLI, boccaAllineata, boccaAltra, cambiatiFuoriBocca, deforma, modo, movimento, trasformazione, zonaBocca} from '../src/animazione.ts';
import type {Cast} from '../src/formato.ts';
import castJson from '../dati/cast.json' with {type: 'json'};

const cast = castJson as unknown as Cast;
const conRitratto = Object.entries(cast.personaggi).filter(([, p]) => p.ritratto && !p.ombra);

const LONTANO = 1000;  // un ingresso finito da un pezzo
const scarto = (a: {tx: number; ty: number; rot: number; sx: number; sy: number}, b = FERMA) =>
  Math.max(Math.abs(a.tx - b.tx), Math.abs(a.ty - b.ty), Math.abs(a.rot - b.rot) / 100, Math.abs(a.sx - b.sx), Math.abs(a.sy - b.sy));
const campioni = (f: (t: number) => number, da = 0, a = 12, passo = 0.01) => { const v: number[] = []; for (let t = da; t <= a; t += passo) v.push(f(t)); return v; };

test('i livelli dell\'interruttore: come nel cast (il primo, predefinito), fermi, tutti a movimento, tutti a maglia', () => {
  assert.deepEqual(LIVELLI.map(l => l.id), ['cast', 'fermo', 'movimento', 'maglia']);
});

test('il modo di ogni ritratto: lo dice il cast per personaggio ed espressione; Piera brilla ondeggia, gli altri si piegano', () => {
  const a = (chi: string) => cast.personaggi[chi].animazione;
  for (const [chi, p] of conRitratto) {
    assert.ok(p.animazione?.maglia, `${chi}: i punti di controllo della maglia`);
    for (const e of p.espressioni ?? []) {
      assert.equal(modo('cast', p.animazione, e, false), chi === 'piera' && e === 'brilla' ? 'movimento' : 'maglia', `${chi} ${e}`);
    }
  }
  assert.equal(modo('cast', a('piera'), 'brilla', false), 'movimento');
  assert.equal(modo('maglia', a('piera'), 'brilla', false), 'maglia', 'l\'interruttore può forzare la maglia');
  assert.equal(modo('movimento', a('spazienzio'), 'serio', false), 'movimento');
  assert.equal(modo('fermo', a('mara'), 'neutra', false), 'fermo');
  for (const l of LIVELLI) assert.equal(modo(l.id, a('mara'), 'neutra', true), 'fermo', 'con il movimento ridotto tutto fermo');
  assert.equal(modo('cast', undefined, 'neutra', false), 'movimento', 'senza voce nel cast: movimento');
  assert.equal(modo('maglia', {modo: 'maglia'}, 'neutra', false), 'movimento', 'maglia senza punti di controllo: movimento');
  assert.equal(modo('cast', a('mara'), undefined, false), 'maglia');
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
  assert.ok(subito.ty < -0.0015 && subito.sy > 1.0065 && subito.sx < 0.9965, 'appena appare la parola: su, allungato, stretto');
  assert.ok(subito.sy < 1.008 && subito.ty > -0.003, 'ma poco (Fase F: «troppo rimbalzanti»)');
  assert.ok(Math.abs(dopo.sy - 1) < Math.abs(subito.sy - 1) / 2, 'dopo un decimo di secondo è quasi spento');
  assert.ok(scarto(tardi) < 0.0001, 'dopo mezzo secondo non c\'è più');
  assert.ok(scarto(movimento(undefined, t, null, LONTANO)) < 1e-9, 'con il testo fermo nessun sobbalzo');
  assert.ok(scarto(movimento(undefined, t, -0.1, LONTANO)) < 1e-9, 'una parola nel futuro non conta');
});

test('l\'ingresso: arriva un poco schiacciato, un solo rimbalzo morbido, e si assesta', () => {
  const subito = movimento(undefined, 0, null, 0);
  assert.ok(subito.sy < 0.96 && subito.sx > 1.025, 'schiacciato e allargato');
  assert.ok(subito.sy > 0.94, 'ma di poco (prima del 13%)');
  assert.ok(subito.ty > 0.015, 'un poco più in basso');
  const sy = campioni(e => movimento(undefined, 0, null, e).sy, 0, 1.5, 0.005);
  assert.ok(Math.max(...sy) > 1.004 && Math.max(...sy) < 1.01, 'nel rimbalzo si allunga appena');
  const passaggi = sy.slice(1).filter((x, i) => Math.sign(x - 1) !== Math.sign(sy[i] - 1)).length;
  assert.ok(passaggi <= 2, `un solo rimbalzo (${passaggi} passaggi)`);
  assert.ok(scarto(movimento(undefined, 0, null, 1)) < 0.002, 'dopo un secondo è fermo');
  assert.ok(scarto(movimento(undefined, 0, null, -1)) < 1e-9, 'un cambio nel futuro non conta');
});

test('un movimento per espressione: tremito per furioso, ondeggiare lento per brilla, scatti per agitata', () => {
  const base = (t: number) => movimento(undefined, t, null, LONTANO);
  // Tremito: veloce (più di dieci inversioni al secondo) e piccolo.
  const tx = campioni(t => movimento('furioso', t, null, LONTANO).tx - base(t).tx, 0, 1, 0.002);
  const inversioni = tx.slice(1).filter((x, i) => Math.sign(x) !== Math.sign(tx[i]) && x !== 0).length;
  assert.ok(inversioni >= 20, `furioso trema (${inversioni} inversioni in un secondo)`);
  assert.ok(Math.max(...tx.map(Math.abs)) < 0.003, 'ma di poco');
  // Brilla: ondeggia lento, oltre due gradi, in tre secondi.
  const rot = campioni(t => movimento('brilla', t, null, LONTANO).rot, 0, 3, 0.01);
  assert.ok(Math.max(...rot) > 2 && Math.min(...rot) < -2, 'brilla ondeggia di due gradi per parte');
  const inv = rot.slice(1).filter((x, i) => Math.sign(x) !== Math.sign(rot[i])).length;
  assert.ok(inv <= 3, 'lentamente');
  // Agitata: scatti a 0,8 s, sempre gli stessi, in direzioni diverse; dalla Fase F salgono in 40 ms invece che di colpo.
  const scatto = (k: number) => movimento('agitata', k * 0.8 + 0.04, null, LONTANO).tx;
  const dirs = [0, 1, 2, 3, 4, 5, 6, 7].map(k => Math.sign(scatto(k)));
  assert.ok(dirs.includes(1) && dirs.includes(-1), 'gli scatti cambiano direzione');
  assert.deepEqual(dirs, [0, 1, 2, 3, 4, 5, 6, 7].map(k => Math.sign(scatto(k))), 'e sono sempre gli stessi');
  assert.ok(Math.abs(scatto(3)) > 0.003 && Math.abs(scatto(3)) < 0.006, 'appena dato lo scatto si vede, ma è piccolo');
  const salto = Math.abs(movimento('agitata', 3 * 0.8 + 0.001, null, LONTANO).tx - movimento('agitata', 3 * 0.8 - 0.001, null, LONTANO).tx);
  assert.ok(salto < 0.0005, `nessun salto secco (${salto})`);
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

for (const [, p] of conRitratto) test(`la maglia di ${p.nome}: la testa si piega intorno al collo, il busto respira, il bordo basso e i lati restano fermi`, () => {
  const c = p.animazione!.maglia!;
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

test('la bocca si alterna solo mentre il testo scrive, al ritmo delle sillabe, e si ferma sulle pause', () => {
  const alterne = campioni(t => Number(boccaAltra(t, true, 'a')), 0, 2, 0.01);
  const cambi = alterne.slice(1).filter((x, i) => x !== alterne[i]).length;
  assert.ok(cambi >= 6 && cambi <= 8, `tre o quattro cambi al secondo (${cambi} in due secondi)`);
  assert.ok(campioni(t => Number(boccaAltra(t, false, 'a')), 0, 2, 0.01).every(x => x === 0), 'testo fermo: bocca del ritratto');
  for (const pausa of ['.', ',', '!', '?', '…', ':']) assert.ok(campioni(t => Number(boccaAltra(t, true, pausa)), 0, 1, 0.01).every(x => x === 0), `pausa dopo «${pausa}»`);
  assert.ok(campioni(t => Number(boccaAltra(t, true, undefined)), 0, 1, 0.01).some(x => x === 1), 'all\'inizio della battuta si muove');
});

test('la zona della bocca: dove le due versioni differiscono, ma solo vicino alla bocca del cast', () => {
  const w = 40, h = 60, z = {u: 0.5, v: 0.3, ru: 0.1, rv: 0.05};
  const griglia = (punti: [number, number][]) => { const d = new Uint8Array(w * h); for (const [x, y] of punti) d[y * w + x] = 200; return d; };
  // La bocca cambia in un rettangolo di 4×2 celle attorno a (0.5, 0.3); un altro cambiamento lontano (un occhio) non conta.
  const bocca: [number, number][] = [];
  for (let x = 18; x < 22; x++) for (let y = 17; y < 19; y++) bocca.push([x, y]);
  const r = zonaBocca(griglia([...bocca, [5, 5], [35, 50]]), w, h, z)!;
  assert.ok(Math.abs(r.u - 0.5) < 1e-9 && Math.abs(r.v - 0.3) < 1e-9, 'centrata sulla bocca');
  assert.ok(r.ru > 0.05 && r.ru < 0.09 && r.rv > 0.02 && r.rv < 0.05, `stretta attorno alla bocca (${r.ru.toFixed(3)} × ${r.rv.toFixed(3)})`);
  assert.equal(zonaBocca(griglia([[5, 5], [35, 50]]), w, h, z), null, 'se cambia solo lontano dalla bocca, niente bocca');
  assert.equal(zonaBocca(griglia([]), w, h, z), null, 'se non cambia niente, niente bocca');
  // Sotto soglia (rumore della compressione) non conta.
  const rumore = new Uint8Array(w * h).fill(20);
  assert.equal(zonaBocca(rumore, w, h, z), null);
  // Le zone del cast stanno sul volto, dentro la testa che si piega.
  for (const [chi, p] of conRitratto) {
    const b = p.bocca!, m = p.animazione!.maglia!;
    assert.ok(Math.abs(b.u - m.testa.u) < m.testa.raggio && b.v < m.testa.sopra, `${chi}: la bocca sta nella testa`);
  }
});

test('la versione «-bocca» si usa solo se è allineata al ritratto: fuori dalla bocca quasi niente deve cambiare', () => {
  const w = 40, h = 60, z = {u: 0.5, v: 0.3, ru: 0.1, rv: 0.05};
  const d = new Uint8Array(w * h);
  for (let x = 18; x < 22; x++) for (let y = 17; y < 19; y++) d[y * w + x] = 200;  // la bocca
  assert.equal(cambiatiFuoriBocca(d, w, h, z), 0);
  assert.ok(boccaAllineata(d, w, h, z), 'cambia solo la bocca: allineata');
  // Una riga intera spostata altrove (testa più in alto): il 2,5% dei punti fuori dalla bocca.
  const storta = d.slice();
  for (let x = 0; x < w; x++) storta[45 * w + x] = 200;
  const f = cambiatiFuoriBocca(storta, w, h, z)!;
  assert.ok(f > 0.015 && f < 0.02, `una riga su sessanta, fuori dalla bocca (${f})`);
  assert.ok(!boccaAllineata(storta, w, h, z), 'più dell\'1%: non allineata, la bocca non si muove');
  // Pochi punti sparsi (la compressione, un capello) restano sotto la soglia.
  const poco = d.slice(); poco[3 * w + 3] = 200; poco[50 * w + 30] = 200;
  assert.ok(boccaAllineata(poco, w, h, z));
  assert.ok(boccaAllineata(new Uint8Array(w * h).fill(39), w, h, z), 'sotto la soglia di differenza non conta');
});

test('nel cast: la sagoma presa da un\'altra espressione esiste, è dello stesso personaggio e ha un ritratto vero', () => {
  for (const [chi, p] of conRitratto) for (const [espressione, da] of Object.entries(p.alfa ?? {})) {
    assert.ok([...p.espressioni ?? [], ...p.espressioniFuture ?? []].includes(espressione), `${chi}: ${espressione}`);
    assert.ok(p.espressioni?.includes(da), `${chi}: la sagoma di ${espressione} viene da ${da}, un'espressione con il ritratto`);
  }
  assert.equal(cast.personaggi.mara.alfa?.esasperata, 'neutra', 'mara-esasperata ha il fondo sporco: la sagoma di neutra');
});

test('nel cast: chi ascolta Piera ha un\'espressione esasperata prevista, Spazienzio sta più in alto in verticale', () => {
  for (const chi of ['mara', 'spazienzio']) {
    const p = cast.personaggi[chi];
    assert.ok(p.stacco && [...p.espressioni ?? [], ...p.espressioniFuture ?? []].includes(p.stacco), `${chi}: ${p.stacco}`);
  }
  const alza = cast.personaggi.spazienzio.verticale?.alza ?? 0;
  assert.ok(alza > 0.04 && alza < 0.15, 'più in alto, ma con il bordo basso ancora dietro la finestra');
});

test('le entrate (Fase J): solo di lato, dal lato voluto, senza crescere né sfocare; e le uscite', () => {
  for (const lato of [1, -1] as const) {
    assert.deepEqual(comparsa('entra', DURATA_ENTRATA, lato), IN_SCENA, `${lato}: alla fine dell'entrata è in scena`);
    assert.deepEqual(comparsa('entra', 10, lato), IN_SCENA);
    assert.equal(comparsa('esce', DURATA_ENTRATA, lato).opacita, 0, `${lato}: alla fine dell'uscita non si vede`);
    assert.equal(comparsa('entra', 0, lato).opacita, 0, `${lato}: all'inizio non si vede`);
    const op = campioni(t => comparsa('entra', t, lato).opacita, 0, DURATA_ENTRATA, 0.005);
    assert.ok(op.every((x, i) => i === 0 || x >= op[i - 1]), `${lato}: compare senza lampeggiare (l'opacità non torna indietro)`);
    const dx = campioni(t => Math.abs(comparsa('entra', t, lato).dx), 0, DURATA_ENTRATA, 0.005);
    assert.ok(dx.every((x, i) => i === 0 || x <= dx[i - 1] + 1e-12), `${lato}: arriva senza tornare indietro`);
    for (const t of [0, 0.05, 0.2, 0.4]) for (const v of ['entra', 'esce'] as const) {
      const c = comparsa(v, t, lato);
      assert.ok(c.scala === 1 && c.sfoca === 0 && c.dy === 0, `${v} ${t}: solo di lato, niente «lontano»`);
    }
  }
  assert.ok(comparsa('entra', 0.05, 1).dx > 0.3 && comparsa('entra', 0.05, -1).dx < -0.3, 'arriva dal lato voluto');
  assert.ok(comparsa('esce', 0.3, -1).dx < -0.1 && comparsa('esce', 0.3, 1).dx > 0.1, 'ed esce verso il lato voluto');
  assert.ok(comparsa('entra', 0.05).dx > 0, 'senza lato, da destra');
  assert.ok(DURATA_ENTRATA > 0.3 && DURATA_ENTRATA < 0.6, 'breve, ma si vede');
  // Il cast non ha più un modo di entrare: c'è solo il lato.
  assert.ok(!('entrate' in cast) && conRitratto.every(([, p]) => !('entrata' in p)));
});

test('due in scena (Fase J): chi parla a sinistra, chi ascolta a destra e lì entra ed esce; in verticale si sovrappongono un poco', () => {
  assert.equal(spostamento('solo', false), 0); assert.equal(spostamento('solo', true), 0);
  for (const v of [false, true]) {
    const p = spostamento('parla', v), a = spostamento('ascolta', v);
    assert.ok(p < 0 && a > 0, `${v}: chi parla a sinistra, chi ascolta a destra`);
    // La distanza fra i due centri, in larghezze del ritratto: in orizzontale quasi a fianco, in verticale si coprono un poco.
    const d = a - p;
    if (v) assert.ok(d > 0.35 && d < 0.75, `in verticale si sovrappongono (${d})`);
    else assert.ok(d > 1.1 && d < 1.4, `in orizzontale stanno a fianco, chi reagisce defilato verso il bordo (${d})`);
    assert.ok(Math.abs(p) < a, `${v}: chi parla si sposta meno di chi entra`);
  }
  assert.ok(spostamento('ascolta', true) < spostamento('ascolta', false) && spostamento('parla', true) > spostamento('parla', false),
    'in verticale più stretti: lo schermo è stretto');
  const lati: [Posto, 'entra' | 'esce', 1 | -1][] = [['solo', 'entra', 1], ['solo', 'esce', -1], ['parla', 'entra', 1], ['parla', 'esce', -1],
    ['ascolta', 'entra', 1], ['ascolta', 'esce', 1]];
  for (const [p, v, l] of lati) assert.equal(latoDi(p, v), l, `${p} ${v}`);
  assert.ok(CHI_REAGISCE.luce > 0.55 && CHI_REAGISCE.luce < 0.85, 'chi reagisce più scuro, ma si vede');
  // Fase K: più verso il bordo di prima (Fase J: 0,72 in orizzontale, 0,22 in verticale), ma con il volto ancora dentro lo schermo verticale.
  assert.ok(spostamento('ascolta', false) > 0.85 && spostamento('ascolta', true) > 0.24 && spostamento('ascolta', true) < 0.3, 'defilato');
});

test('chi reagisce è più piccolo di chi parla (Fase K), misurato sulla testa del cast e non sull\'immagine', () => {
  const testa = (chi: string) => cast.personaggi[chi].animazione!.maglia!.testa.raggio;
  assert.ok(CHI_REAGISCE.testa >= 0.7 && CHI_REAGISCE.testa <= 0.9, 'più piccolo, ma riconoscibile');
  for (const [parla] of conRitratto) for (const [reagisce] of conRitratto) {
    if (parla === reagisce) continue;
    const s = scalaDiChiReagisce(testa(parla), testa(reagisce));
    // La testa di chi reagisce, in scena, rispetto a quella di chi parla (stessa tela per tutti: la larghezza del ritratto è la stessa).
    assert.ok(Math.abs((s * testa(reagisce)) / testa(parla) - CHI_REAGISCE.testa) < 1e-9, `${reagisce} accanto a ${parla}`);
    assert.ok(s < 1, `${reagisce} accanto a ${parla}: più piccolo`);
  }
  // Mara ha la testa più grande nell'immagine (inquadrata più da vicino): accanto a Piera si rimpicciolisce più di Spazienzio.
  assert.ok(testa('mara') > testa('piera'));
  assert.ok(scalaDiChiReagisce(testa('piera'), testa('mara')) < scalaDiChiReagisce(testa('piera'), testa('spazienzio')));
  assert.ok(scalaDiChiReagisce(testa('piera'), testa('mara')) < 0.75, 'Mara accanto a Piera: «troppo grande» non più');
  assert.equal(scalaDiChiReagisce(undefined, 0.2), CHI_REAGISCE.testa, 'senza misure, l\'80% dell\'immagine');
  assert.equal(scalaDiChiReagisce(0.2, undefined), CHI_REAGISCE.testa);
});

test('lo scivolare di posto e di luce: verso il voluto senza scatti né rimbalzi, in un tempo breve', () => {
  assert.equal(avvicina(0, 1, 0, SCIVOLA), 0, 'senza tempo non si muove');
  assert.equal(avvicina(0, 1, -1, SCIVOLA), 0, 'il tempo all\'indietro non conta');
  assert.ok(Math.abs(avvicina(0, 1, SCIVOLA, SCIVOLA) - (1 - Math.exp(-1))) < 1e-12, 'in tau i due terzi');
  assert.ok(Math.abs(avvicina(5, 5, 0.1, SCIVOLA) - 5) < 1e-12, 'arrivato, sta fermo');
  // A passi di 16 ms: sempre più vicino, mai oltre; in mezzo secondo quasi arrivato; e lo stesso a passi diversi (non dipende dai fotogrammi).
  let x = 0, y = 0;
  for (let i = 0; i < 30; i++) { const n = avvicina(x, 1, 1 / 60, SCIVOLA); assert.ok(n > x && n < 1); x = n; }
  for (let i = 0; i < 15; i++) y = avvicina(y, 1, 1 / 30, SCIVOLA);
  assert.ok(x > 0.93 && Math.abs(x - y) < 1e-9, `${x} ${y}`);
  assert.ok(SCIVOLA > 0.08 && SCIVOLA < 0.3);
});

test('la maschera della bocca: il peso dell\'ellisse e l\'erosione del bordo della sagoma', () => {
  const z = {u: 0.5, v: 0.5, ru: 0.1, rv: 0.1};
  assert.equal(pesoEllisse(0.5, 0.5, z), 1); assert.equal(pesoEllisse(0.56, 0.5, z), 1, 'pieno fino al 70%');
  assert.equal(pesoEllisse(0.61, 0.5, z), 0); assert.ok(Math.abs(pesoEllisse(0.585, 0.5, z) - 0.5) < 1e-9, 'sfuma fra il 70% e il bordo');
  // Un quadrato pieno 10×10 eroso di 2 resta un quadrato 6×6; un pixel solo sparisce.
  const w = 14, h = 14, m = new Uint8Array(w * h);
  for (let y = 2; y < 12; y++) for (let x = 2; x < 12; x++) m[y * w + x] = 1;
  const e = erodi(m, w, h, 2);
  assert.equal(e.reduce((a, b) => a + b, 0), 36);
  assert.equal(e[4 * w + 4], 1); assert.equal(e[3 * w + 3], 0);
  const uno = new Uint8Array(w * h); uno[7 * w + 7] = 1;
  assert.equal(erodi(uno, w, h, 1).reduce((a, b) => a + b, 0), 0);
});

test('la bocca composta: il colore della versione «-bocca» solo dentro la zona e dove tutte e due sono piene, a due pixel dal bordo', () => {
  // Un ritratto 20×20: pieno al centro (4..15), bordo sfumato attorno; la versione «-bocca» tutta rossa, con il fondo velato (alfa 200).
  const w = 20, h = 20, a = new Uint8ClampedArray(w * h * 4), b = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = (y * w + x) * 4, dentro = x >= 4 && x <= 15 && y >= 4 && y <= 15, bordo = x >= 3 && x <= 16 && y >= 3 && y <= 16;
    a.set([100, 100, 100, dentro ? 255 : bordo ? 120 : 0], k);
    b.set([255, 0, 0, dentro ? 255 : 200], k);
  }
  const out = componiPixel(a, b, w, h, {u: 0.5, v: 0.5, ru: 0.6, rv: 0.6});
  const px = (x: number, y: number) => [...out.slice((y * w + x) * 4, (y * w + x) * 4 + 4)];
  assert.deepEqual(px(10, 10), [255, 0, 0, 255], 'al centro: la bocca');
  assert.deepEqual(px(4, 10), [100, 100, 100, 255], 'a meno di due pixel dal bordo della sagoma: il ritratto');
  assert.deepEqual(px(5, 10), [100, 100, 100, 255]);
  assert.deepEqual(px(6, 10), [255, 0, 0, 255], 'a due pixel: già la bocca');
  assert.deepEqual(px(3, 10), [100, 100, 100, 120], 'sul bordo sfumato: il ritratto, con la sua trasparenza');
  assert.deepEqual(px(0, 0), [100, 100, 100, 0], 'fuori: il fondo trasparente, mai il velo');
  for (let k = 3; k < out.length; k += 4) assert.equal(out[k], a[k], 'la trasparenza è sempre quella del ritratto');
});

test('la testa più ferma (Fase I): mai oltre il tetto, meno di prima, e si muove ancora', () => {
  const stretta = campioni(t => Math.abs(gradiTesta(t, true, (t * 7) % 1)), 0, 20, 0.01);
  assert.ok(MASSIMO_TESTA <= 3 && Math.max(...stretta) < 3, `sotto i 3° (${Math.max(...stretta).toFixed(2)})`);
  assert.ok(Math.max(...stretta) > 1.5, 'ma ondeggia ancora');
  // Le ampiezze di prima della Fase I (il confronto ?testa=larga è tolto nella Fase K): ora poco più della metà.
  const prima = {parla: 2.6, quieta: 1.1, deriva: 1.8, cenno: 3};
  for (const k of ['parla', 'quieta', 'deriva', 'cenno'] as const) assert.ok(AMPIEZZE_TESTA[k] <= prima[k] * 0.65, `${k}: meno di prima`);
  assert.ok(Math.max(...campioni(t => Math.abs(gradiTesta(t, false, null)), 0, 20, 0.01)) < 2, 'in silenzio, meno ancora');
});

test('Piera si muove lentissima (Fase I): un fattore nel cast, gli altri a tempo normale', () => {
  assert.equal(cast.personaggi.piera.tempoAnimazioni, 0.3, 'come la velocità del suo testo');
  assert.equal(cast.personaggi.piera.tempoAnimazioni, cast.personaggi.piera.velocita);
  for (const chi of ['mara', 'spazienzio']) assert.equal(cast.personaggi[chi].tempoAnimazioni ?? 1, 1);
});

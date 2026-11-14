// Mockup del grafo della campagna principale (14 novembre 2026): la storia storie/principale.md, le estensioni minime del formato che le
// servono, e i numeri per giro che il controllo del grafo non misura.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {converti} from '../src/converti.ts';
import {controllaGrafo} from '../src/grafo.ts';
import {statiMappa} from '../src/mappa.ts';
import {entra, nuovoAccount, nuovoGiro, salta, scegli, vinci, vista, type Stato} from '../src/motore.ts';
import {numeri, percorsi} from '../src/percorsi.ts';
import {carriera, cast} from './aiuto.ts';
import type {Carriera} from '../src/formato.ts';

const md = fs.readFileSync(new URL('../storie/principale.md', import.meta.url), 'utf8');
const principale = () => carriera(md);
const errori = (testo: string) => converti(testo, cast, 'x').problemi.filter(p => p.livello === 'errore').map(p => p.messaggio);

test('la principale si converte senza errori né avvisi, con tutti i nodi della scaletta 0.2', () => {
  const r = converti(md, cast, 'principale');
  assert.deepEqual(r.problemi, []);
  const c = r.carriera;
  assert.equal(c.id, 'principale');
  assert.deepEqual(c.nodi.map(n => n.etichetta), ['I1', 'I2a', 'I3a', 'I2b', 'I3b', 'I4', 'II1', 'II2a', 'II2b', 'II2c', 'II3', 'III1', 'III2a',
    'III3c', 'III3a', 'III2b', 'III3b', 'S1', 'III4', 'III5', 'S2']);
  assert.ok(c.nodi.every(n => n.passi.some(p => p.tipo === 'partita')), 'ogni nodo ha la sua partita');
  assert.deepEqual(c.nodi.filter(n => n.segreto).map(n => n.etichetta), ['S1', 'S2']);
  assert.deepEqual(c.obbligatori, ['starter-celestina', 'starter-piera', 'starter-beppe', 'pvp']);
  assert.equal(c.achievement.length, 8);
  // Le FFA della scaletta: I3a e II2c a tre, I3b e I4 a quattro, III2a e III4 a cinque.
  const ffa = Object.fromEntries(c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && p.modo === 'ffa' && Array.isArray(p.avversari) ? [[n.etichetta, p.avversari.length + 1]] : [])));
  assert.deepEqual(ffa, {I3a: 3, I3b: 4, I4: 4, II2c: 3, II3: 3, III2a: 5, III3c: 3, III3a: 3, III3b: 3, III4: 5});
});

test('il controllo del grafo: tutto raggiungibile, starter e PvP su ogni percorso, tre finali, due segreti, achievement possibili', () => {
  const r = controllaGrafo(principale());
  assert.deepEqual(r.errori, []);
  assert.deepEqual(r.avvisi, []);
  assert.equal(r.raggiunti.length, 21);
  assert.deepEqual(Object.keys(r.finali).sort(), ['dimmi-di-si-2', 'il-serraglio-e-di-tutti', 'il-serraglio-resta']);
  assert.deepEqual(r.segreti, {s1: ['iii1'], s2: ['iii5']});
  assert.ok(r.stati < 5000, `stati: ${r.stati}`);
});

test('i numeri per giro: da 11 a 13 nodi con partita (14 con la rivincita), il PvP sempre prima di metà, gli starter su ogni percorso', () => {
  const c = principale();
  const primo = percorsi(c);
  const n = numeri(primo);
  assert.deepEqual([n.minimo, n.massimo], [11, 13]);
  assert.ok(n.pvpPrimaDiMeta && n.pvpPiuTardi < 0.4);
  for (const p of primo) for (const s of c.obbligatori) assert.ok(p.sblocchi.includes(s), `${p.nodi.join('>')}: ${s}`);
  assert.ok(!primo.some(p => p.nodi.includes('s2')), 'niente rivincita al primo giro');
  // In un giro dopo F1 compare la rivincita.
  const dopo = percorsi(c, {...nuovoAccount(), finali: ['il-serraglio-resta'], giri: 1});
  assert.ok(dopo.some(p => p.nodi.at(-1) === 's2'));
  assert.equal(numeri(dopo).massimo, 14);
});

test('i fili: la chiave apre la notte, il bilancio apre Grappino, la sconfitta al torneo apre i debiti', () => {
  const c = principale();
  const ps = percorsi(c);
  const conNodo = (id: string) => ps.filter(p => p.nodi.includes(id));
  // III3b solo con la chiave: da I2a (via di Mara) o da II2b (pista di Beppe).
  for (const p of conNodo('iii3b')) assert.ok(p.nodi.includes('i2a') || p.nodi.includes('ii2b'), p.nodi.join('>'));
  assert.ok(ps.some(p => p.nodi.includes('iii2b') && !p.nodi.includes('iii3b')), 'senza chiave dal pedinamento si va alla firma');
  // S1 solo con il bilancio (pista di Celestina).
  for (const p of conNodo('s1')) assert.ok(p.nodi.includes('ii2c'));
  // III3c solo dopo III2a, e porta a III3a.
  for (const p of conNodo('iii3c')) { const i = p.nodi.indexOf('iii3c'); assert.deepEqual([p.nodi[i - 1], p.nodi[i + 1]], ['iii2a', 'iii3a']); }
  // I finali: F1 dopo il pedinamento o il segreto, F2 dopo il torneo, F3 perdendo III5.
  for (const p of ps) {
    if (p.finale === 'il-serraglio-resta') assert.ok(p.nodi.includes('iii2b') || p.nodi.includes('s1'));
    if (p.finale === 'il-serraglio-e-di-tutti') assert.ok(p.nodi.includes('iii2a'));
  }
});

/** Gioca la principale seguendo le etichette delle opzioni che cominciano con le parole date, vincendo ogni partita. */
function gioca(c: Carriera, s: Stato, strada: string[]): Stato {
  for (let passi = 0; passi < 400; passi++) {
    const v = vista(c, s);
    if (v.tipo === 'fine') return s;
    if (v.tipo === 'mappa') {
      const st = statiMappa(c, s);
      const d = c.nodi.filter(n => st[n.id].stato === 'disponibile');
      if (!d.length) return s;
      s = entra(c, s, d[0].id).stato;
    } else if (v.tipo === 'scelta') {
      const o = v.opzioni.find(x => strada.some(w => x.opzione.etichetta.startsWith(w))) ?? v.opzioni[0];
      s = scegli(c, s, o.indice).stato;
    } else if (v.tipo === 'partita') s = vinci(c, s).stato;
    else s = salta(c, s).stato;
  }
  throw new Error('giro senza fine');
}

test('gli starter garantiti: chi non ha preso le tue parti lo fa in II3, l\'altro in III1; chi gioca II3 e III1', () => {
  const c = principale();
  for (const [pista, ii3] of [['con Piera', 'beppe'], ['con Beppe', 'piera'], ['con Celestina', 'piera']] as const) {
    const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', pista, 'con Celestina']);
    assert.equal(s.giro.segni.ii3, ii3, pista);
    for (const x of ['starter-celestina', 'starter-piera', 'starter-beppe', 'pvp']) assert.ok(s.account.sblocchi.includes(x), `${pista}: ${x}`);
    if (pista === 'con Celestina') assert.equal(s.giro.segni.iii1, 'beppe', 'Beppe, che manca ancora, in III1');
  }
});

test('S2 si vede sulla bacheca solo in un giro dopo F1; S1 solo quando è affrontabile', () => {
  const c = principale();
  const s0 = nuovoGiro(c, nuovoAccount());
  assert.equal(statiMappa(c, s0).s2.stato, 'nascosto');
  assert.equal(statiMappa(c, s0).s1.stato, 'nascosto');
  const dopoF1 = nuovoGiro(c, {...nuovoAccount(), finali: ['il-serraglio-resta'], giri: 1});
  assert.notEqual(statiMappa(c, dopoF1).s2.stato, 'nascosto', 'la rivincita compare');
  assert.equal(statiMappa(c, dopoF1).s1.stato, 'nascosto', 'il cane sa resta un segreto');
});

test('estensione: [Se …] [Sblocca: …] e [Se …] [Segno: …], e i segni con il trattino nelle condizioni', () => {
  const testo = `# T

[Carriera: t]

## A — Uno

[Sfondo: S1]

→ Scelta muta: chi?

- con Mara [Segno: via-uno = mara] → B
- con Spazienzio [Segno: via-uno = spazienzio] → B

## B — Due

[Se segno via-uno = mara] [Segno: chi = mara]

[Se non segno via-uno = mara] [Segno: chi = spazienzio]

→ Partita 1: {chi} (giocatore) contro Piera

[Se segno via-uno = mara] [Sblocca: premio]

→ Fine: completata
`;
  const r = converti(testo, cast, 't');
  assert.deepEqual(r.problemi.filter(p => p.livello === 'errore'), []);
  const b = r.carriera.nodi[1];
  const condizionati = b.passi.filter(p => (p.tipo === 'segno' || p.tipo === 'sblocco') && p.se);
  assert.equal(condizionati.length, 3);
  assert.ok(condizionati.every(p => JSON.stringify(p.se).includes('"segno":"via-uno"')), 'il segno con il trattino');
  const c = carriera(testo);
  for (const [via, chi, premio] of [[0, 'mara', true], [1, 'spazienzio', false]] as const) {
    let s = entra(c, nuovoGiro(c, nuovoAccount()), 'a').stato;
    s = scegli(c, s, via).stato;
    s = entra(c, s, 'b').stato;
    const v = vista(c, s);
    assert.ok(v.tipo === 'partita' && v.giocatore === chi, chi);
    assert.deepEqual(v.tipo === 'partita' && v.sblocchi, premio ? ['premio'] : [], 'lo sblocco annunciato solo se la condizione vale');
    s = vinci(c, s).stato;
    assert.equal(s.account.sblocchi.includes('premio'), premio);
  }
  // Il controllo del grafo segue la condizione: un obbligatorio dato solo su una strada manca sull'altra.
  const obbl = carriera(testo.replace('[Carriera: t]', '[Carriera: t; obbligatori: premio]'), true);
  assert.ok(controllaGrafo(obbl).errori.includes('sblocco obbligatorio non presente su ogni percorso: premio'));
  // [Se …] vale solo per segni e sblocchi.
  assert.ok(errori(testo.replace('[Sblocca: premio]', '[Sblocca: premio] [Scossa]')).some(m => m.startsWith('[Se …] vale solo per [Segno: …] e [Sblocca: …]')));
  assert.ok(errori(testo.replace(' [Sblocca: premio]', '')).some(m => m.startsWith('dopo [Se …] serve')));
});

test('estensione: l\'ultimo nodo del file può finire con una scelta con destinazioni', () => {
  const testo = `# T

## A — Uno

[Sfondo: S1]

→ Scelta muta: dove?

- con Mara → Fine: completata, Uno
- con Spazienzio → Fine: completata, Due
`;
  assert.deepEqual(errori(testo), []);
  assert.ok(errori(testo.replace(/→ Scelta muta[\s\S]*$/, '**Mara** (neutra): Ciao.\n')).some(m => m.includes('non ha uscita')), 'senza scelta resta un errore');
});

test('il controllo del grafo conta solo i segni e i nodi che qualche condizione legge: stessi esiti, molti meno stati', () => {
  // La principale aveva più di 200 000 stati con la chiave intera; ora poche migliaia, e il tutorial e la prova sono sempre verdi.
  const r = controllaGrafo(principale());
  assert.ok(r.stati < 5000);
  // Un segno letto da una condizione distingue ancora gli stati: con «perso» letto, vincere al primo colpo o dopo un ritento conta.
  const testo = `# T

## A — Uno

[Sfondo: S1]

→ Partita 1: Mara (giocatore) contro Piera

→ Vai a: B

## B — Due

[Se perso A] **Mara** (agitata): Dopo un ritento.

[Se non perso A] **Mara** (contenta): Al primo colpo.

→ Fine: completata
`;
  const c = carriera(testo);
  assert.deepEqual(controllaGrafo(c).avvisi, [], 'nel nodo dopo si vedono tutte e due: vincere al primo colpo e dopo un ritento restano distinti');
});

test('i ritratti segnaposto: un cartoncino per i personaggi nuovi, nel prototipo; il padrone è una figura in ombra', () => {
  for (const id of ['celestina', 'beppe', 'sergio', 'duccio', 'grappino']) {
    const p = cast.personaggi[id];
    assert.ok(p.segnaposto && p.ritratto === `segnaposto/${id}.webp`, id);
    assert.ok(!p.animazione && !p.bocca, `${id}: niente maglia né bocca su un cartoncino`);
    assert.ok(fs.statSync(new URL(`../segnaposto/${id}.webp`, import.meta.url)).size > 10_000, `${id}: il file c'è`);
  }
  assert.ok(cast.personaggi.padrone.ombra && !cast.personaggi.padrone.ritratto);
  assert.ok(fs.readdirSync(new URL('../segnaposto/', import.meta.url)).every(f => f.endsWith('.webp')));
});

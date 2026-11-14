// Mockup del grafo della campagna principale (14 novembre 2026, aggiornato alla scaletta 0.3): la storia storie/principale.md, le
// estensioni minime del formato che le servono, e i numeri per giro che il controllo del grafo non misura.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {converti} from '../src/converti.ts';
import {controllaGrafo} from '../src/grafo.ts';
import {disposizione, statiMappa} from '../src/mappa.ts';
import {componi, seiQui} from '../src/bacheca.ts';
import {entra, nuovoAccount, nuovoGiro, perdi, salta, scegli, scegliGiocatore, vinci, vista, type Stato} from '../src/motore.ts';
import {numeri, percorsi} from '../src/percorsi.ts';
import {ritenta as ritentaS} from '../src/motore.ts';
import {carriera, cast} from './aiuto.ts';
import type {Carriera} from '../src/formato.ts';

const md = fs.readFileSync(new URL('../storie/principale.md', import.meta.url), 'utf8');
const principale = () => carriera(md);
const errori = (testo: string) => converti(testo, cast, 'x').problemi.filter(p => p.livello === 'errore').map(p => p.messaggio);

test('la principale si converte senza errori né avvisi, con tutti i nodi della scaletta 0.3', () => {
  const r = converti(md, cast, 'principale');
  assert.deepEqual(r.problemi, []);
  const c = r.carriera;
  assert.equal(c.id, 'principale');
  assert.deepEqual(c.nodi.map(n => n.etichetta), ['I1', 'I1s', 'I2a', 'I3a', 'I2b', 'I3b', 'I4', 'II1', 'II2a', 'II2s', 'II2b', 'II2c', 'II3', 'III1',
    'III1s', 'III2a', 'III3c', 'III3a', 'III2b', 'III3b', 'S1', 'III4', 'III5', 'S2']);
  // Le tre scene della 0.3 che si aprono perdendo non hanno partita; tutti gli altri nodi sì.
  assert.deepEqual(c.nodi.filter(n => !n.passi.some(p => p.tipo === 'partita')).map(n => n.etichetta), ['I1s', 'II2s', 'III1s']);
  const sconfitte = Object.fromEntries(c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && p.sconfitta ? [[n.etichetta, 'nodo' in p.sconfitta ? p.sconfitta.nodo : 'fine']] : [])));
  assert.deepEqual(sconfitte, {I1: 'i1s', II2a: 'ii2s', III1: 'iii1s', III2a: 'iii3c', III5: 'fine'}, 'le sconfitte che aprono un ramo');
  // 0.3.2: le sconfitte sono un segreto; I1s e II2s sono tasche.
  assert.deepEqual(c.nodi.filter(n => n.segreto).map(n => n.etichetta), ['I1s', 'II2s', 'III1s', 'III3c', 'S1', 'S2']);
  assert.deepEqual(c.nodi.filter(n => n.tasca).map(n => n.etichetta), ['I1s', 'II2s']);
  assert.deepEqual(c.obbligatori, ['starter-celestina', 'starter-piera', 'starter-beppe', 'pvp']);
  assert.equal(c.achievement.length, 9);
  // «A scelta»: il selettore del personaggio in II1, in III1 (quando non manca nessuno) e in III3a.
  const aScelta = c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && 'sceltaFra' in p.giocatore ? [n.etichetta] : []));
  assert.deepEqual(aScelta, ['II1', 'III1', 'III3a']);
  // Le FFA della scaletta: I3a e II2c a tre, I3b e I4 a quattro, III2a e III4 a cinque.
  const ffa = Object.fromEntries(c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && p.modo === 'ffa' && Array.isArray(p.avversari) ? [[n.etichetta, p.avversari.length + 1]] : [])));
  assert.deepEqual(ffa, {I3a: 3, I3b: 4, I4: 4, II2c: 3, II3: 3, III2a: 5, III3c: 3, III3a: 3, III3b: 3, III4: 5});
});

test('il controllo del grafo: tutto raggiungibile, starter e PvP su ogni percorso, tre finali, due segreti, achievement possibili', () => {
  const r = controllaGrafo(principale());
  assert.deepEqual(r.errori, []);
  assert.deepEqual(r.avvisi, []);
  assert.equal(r.raggiunti.length, 24);
  assert.deepEqual(Object.keys(r.finali).sort(), ['dimmi-di-si-2', 'il-serraglio-e-di-tutti', 'il-serraglio-resta']);
  assert.deepEqual(r.segreti, {i1s: ['i1'], ii2s: ['ii2a'], iii1s: ['iii1'], iii3c: ['iii2a'], s1: ['iii1'], s2: ['iii5']});
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
  // III3b con la chiave dopo il pedinamento (da I2a o da II2b), o dalla porta sul retro dopo lo sgombero (III1s), anche senza chiave.
  for (const p of conNodo('iii3b')) assert.ok(p.nodi.includes('iii1s') || (p.nodi.includes('iii2b') && (p.nodi.includes('i2a') || p.nodi.includes('ii2b'))), p.nodi.join('>'));
  assert.ok(ps.some(p => p.nodi.includes('iii1s') && p.nodi.includes('i2b') && !p.nodi.includes('ii2b')), 'lo sgombero porta alla notte anche senza chiave');
  assert.ok(ps.some(p => p.nodi.includes('iii2b') && !p.nodi.includes('iii3b')), 'senza chiave dal pedinamento si va alla firma');
  // S1 solo con il bilancio (pista di Celestina).
  for (const p of conNodo('s1')) assert.ok(p.nodi.includes('ii2c'));
  // III3c solo dopo III2a, e porta a III3a.
  for (const p of conNodo('iii3c')) { const i = p.nodi.indexOf('iii3c'); assert.deepEqual([p.nodi[i - 1], p.nodi[i + 1]], ['iii2a', 'iii3a']); }
  // I finali: F1 dopo il pedinamento, lo sgombero o il segreto, F2 dopo il torneo, F3 perdendo III5.
  for (const p of ps) {
    if (p.finale === 'il-serraglio-resta') assert.ok(p.nodi.includes('iii2b') || p.nodi.includes('iii1s') || p.nodi.includes('s1'));
    if (p.finale === 'il-serraglio-e-di-tutti') assert.ok(p.nodi.includes('iii2a'));
  }
  // Le scene delle sconfitte: I1s torna alla scelta di I1, II2s va a II3, III1s a III3b.
  for (const p of conNodo('i1s')) assert.equal(p.nodi[p.nodi.indexOf('i1s') + 1], 'i1');
  for (const p of conNodo('ii2s')) assert.equal(p.nodi[p.nodi.indexOf('ii2s') + 1], 'ii3');
  for (const p of conNodo('iii1s')) assert.equal(p.nodi[p.nodi.indexOf('iii1s') + 1], 'iii3b');
  assert.ok(ps.some(p => ['i1s', 'ii2s', 'iii1s'].every(x => p.nodi.includes(x))), 'un giro con tutte e tre le sconfitte');
});

/** Gioca la principale seguendo le etichette delle opzioni che cominciano con le parole date, vincendo ogni partita salvo quelle in `perdiIn`. */
function gioca(c: Carriera, s: Stato, strada: string[], perdiIn: string[] = []): Stato {
  const daPerdere = [...perdiIn];
  for (let passi = 0; passi < 400; passi++) {
    const v = vista(c, s);
    if (v.tipo === 'fine') return s;
    if (v.tipo === 'mappa') {
      const st = statiMappa(c, s);
      const d = c.nodi.filter(n => st[n.id].stato === 'disponibile');
      if (!d.length) return s;
      s = entra(c, s, d[0].id).stato;
    } else if (v.tipo === 'scelta') {
      // L'opzione che combacia con la parola più lunga della strada.
      const punti = v.opzioni.map(x => Math.max(0, ...strada.filter(w => x.opzione.etichetta.startsWith(w)).map(w => w.length)));
      const o = v.opzioni[punti.indexOf(Math.max(...punti))];
      s = scegli(c, s, o.indice).stato;
    } else if (v.tipo === 'partita') {
      if (v.giocatore === null) { s = scegliGiocatore(c, s, v.aScelta![0]).stato; continue; }
      const k = daPerdere.indexOf(s.giro.nodo!);
      if (k >= 0) { daPerdere.splice(k, 1); s = perdi(c, s).stato; } else s = vinci(c, s).stato;
    } else s = salta(c, s).stato;
  }
  throw new Error('giro senza fine');
}

test('gli starter garantiti: chi non ha preso le tue parti lo fa in II3, l\'altro in III1, anche perdendo II2a o III1', () => {
  const c = principale();
  const casi: [string, string[], string, string | undefined][] = [
    ['con Piera', [], 'beppe', undefined], ['con Beppe', [], 'piera', undefined], ['con Celestina', [], 'piera', 'beppe'],
    // Persa la frase di Piera (II2s), Piera non ti ha dato le sue carte: lo fa in II3, e Beppe in III1.
    ['con Piera', ['ii2a'], 'piera', 'beppe'],
    // Perso III1 (lo sgombero), Beppe ti ha già dato le sue carte prima della partita.
    ['con Celestina', ['iii1'], 'piera', 'beppe'],
  ];
  for (const [pista, perdiIn, ii3, iii1] of casi) {
    const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', pista, 'con Beppe, a comprarlo'], perdiIn);
    assert.equal(s.giro.segni.ii3, ii3, `${pista} ${perdiIn}`);
    assert.equal(s.giro.segni.iii1, iii1, `${pista} ${perdiIn}: chi gioca III1`);
    for (const x of ['starter-celestina', 'starter-piera', 'starter-beppe', 'pvp']) assert.ok(s.account.sblocchi.includes(x), `${pista} ${perdiIn}: ${x}`);
  }
});

test('le tre sconfitte della 0.3: il pavimento, Piera che non parla, lo sgombero; e chi gioca dopo', () => {
  const c = principale();
  const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe'], ['i1', 'ii2a', 'iii1']);
  for (const x of ['i1s', 'ii2s', 'iii1s', 'iii3b']) assert.ok(s.giro.visti.includes(x), x);
  assert.equal(s.giro.segni.celestina, 'si', 'darle retta sul pavimento');
  assert.ok(!('frase' in s.giro.segni), 'la frase di Piera non va avanti');
  assert.equal(s.giro.segni.alleato, 'celestina', 'dopo lo sgombero ti accompagna Celestina');
  assert.equal(s.giro.finale, 'il-serraglio-resta');
  for (const a of ['lo-diceva-celestina', 'porta-sul-retro']) assert.ok(s.account.achievement.includes(a), a);
  assert.ok(!s.account.achievement.includes('lasciatela-finire'));
  // La notte al Serraglio senza aver dato retta a Celestina sul pavimento: «Lo diceva Celestina» no, «Porta sul retro» sì.
  const senza = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe'], ['iii1']);
  assert.ok(senza.giro.visti.includes('iii3b') && !senza.giro.visti.includes('i1s'));
  assert.ok(!senza.account.achievement.includes('lo-diceva-celestina') && senza.account.achievement.includes('porta-sul-retro'));
});

test('uscite condizionate: III5 vinto finisce nel finale della strada senza pulsanti; dopo F1 c\'è l\'offerta della rivincita', () => {
  const c = principale();
  const fino = (s: Stato) => { for (let i = 0; i < 300; i++) { const v = vista(c, s); if (v.tipo === 'partita' && s.giro.nodo === 'iii5') return s; s = gioca1(c, s); } throw new Error('III5 mai'); };
  const gioca1 = (c2: Carriera, s: Stato): Stato => {
    const v = vista(c2, s);
    if (v.tipo === 'mappa') return entra(c2, s, c2.nodi.find(n => statiMappa(c2, s)[n.id].stato === 'disponibile')!.id).stato;
    if (v.tipo === 'scelta') return scegli(c2, s, (v.opzioni.find(o => /^con (Beppe, a comprarlo|Mara)/.test(o.opzione.etichetta)) ?? v.opzioni[0]).indice).stato;
    if (v.tipo === 'partita') return v.giocatore === null ? scegliGiocatore(c2, s, v.aScelta![0]).stato : vinci(c2, s).stato;
    return salta(c2, s).stato;
  };
  const a = fino(nuovoGiro(c, nuovoAccount()));
  const dopo = vinci(c, a).stato;
  assert.equal(vista(c, dopo).tipo, 'fine', 'subito il finale, senza scelte');
  assert.equal(dopo.giro.finale, 'il-serraglio-e-di-tutti', 'dopo il torneo: F2');
  // Dopo F1, in un giro nuovo: prima delle uscite l'offerta della rivincita, che si può rifiutare.
  const b = fino(nuovoGiro(c, {...nuovoAccount(), finali: ['il-serraglio-resta'], giri: 1}));
  const offerta = vista(c, vinci(c, b).stato);
  assert.ok(offerta.tipo === 'scelta' && offerta.opzioni.length === 2);
  const rifiuta = scegli(c, vinci(c, b).stato, 1).stato;
  assert.equal(rifiuta.giro.finale, 'il-serraglio-e-di-tutti', 'rifiutata: il finale della strada');
});

test('estensione: uscite condizionate, la prima che vale; una scelta «se c\'è» si salta senza opzioni; una partita «a scelta»', () => {
  const testo = `# T

## A — Uno

[Sfondo: S1]

→ Partita 1: a scelta fra Mara, Spazienzio e Piera (giocatore) contro Celestina

→ Scelta muta, se c'è: ancora?

- con Mara, ancora [Se finale Due] → A
- con Spazienzio, basta [Se finale Due]

→ Fine: completata, Uno [Se perso A]

→ Fine: completata, Due
`;
  const r = converti(testo, cast, 't');
  assert.deepEqual(r.problemi.filter(p => p.livello === 'errore'), []);
  const a = r.carriera.nodi[0];
  assert.ok('condizionate' in a.uscita && a.uscita.condizionate.length === 2);
  const c = carriera(testo);
  let s = entra(c, nuovoGiro(c, nuovoAccount()), 'a').stato;
  let v = vista(c, s);
  assert.ok(v.tipo === 'partita' && v.giocatore === null && v.aScelta?.join() === 'mara,spazienzio,piera', 'si sceglie chi gioca');
  assert.throws(() => vinci(c, s), /prima si sceglie/);
  assert.throws(() => scegliGiocatore(c, s, 'sergio'));
  s = scegliGiocatore(c, s, 'piera').stato;
  v = vista(c, s);
  assert.ok(v.tipo === 'partita' && v.giocatore === 'piera');
  const vinta = vinci(c, s).stato;
  assert.equal(vinta.giro.finale, 'due', 'la scelta «se c\'è» senza opzioni si salta; vinta: la seconda uscita');
  const ritentata = perdiRitenta(c, s);
  const vr = vista(c, ritentata);
  assert.ok(vr.tipo === 'partita' && vr.giocatore === null, 'dopo una sconfitta si sceglie di nuovo chi gioca');
  const persa = vinci(c, scegliGiocatore(c, ritentata, 'mara').stato).stato;
  assert.equal(persa.giro.finale, 'uno', 'persa una volta: la prima uscita');
  // Con il finale «Due» già visto, la scelta c'è: una opzione torna in A, l'altra prosegue fino alle uscite.
  let s2 = entra(c, nuovoGiro(c, {...nuovoAccount(), finali: ['due']}), 'a').stato;
  s2 = vinci(c, scegliGiocatore(c, s2, 'mara').stato).stato;
  const of = vista(c, s2);
  assert.ok(of.tipo === 'scelta' && of.opzioni.length === 2);
  assert.equal(scegli(c, s2, 1).stato.giro.finale, 'due');
  // Il controllo del grafo segue le uscite condizionate e la scelta facoltativa, anche quando nessuna opzione è visibile su un percorso.
  assert.deepEqual(controllaGrafo(c).errori, []);
  const senzaOpzioni = carriera(testo.replaceAll('[Se finale Due]', '[Se perso A]'));
  const rs = controllaGrafo(senzaOpzioni);
  assert.deepEqual(rs.errori, [], 'vinta al primo colpo nessuna opzione è visibile: la scelta si salta');
  assert.deepEqual(Object.keys(rs.finali).sort(), ['due', 'uno'], 'e dopo la scelta saltata si arriva alle uscite');
  // Con il segno davanti già assegnato non si sceglie: gioca chi dice il segno.
  const conSegno = carriera(testo.replace('[Sfondo: S1]', '[Sfondo: S1]\n\n[Segno: chi = spazienzio]').replace('a scelta fra Mara, Spazienzio e Piera', '{chi} o a scelta fra Mara e Piera'));
  const vs = vista(conSegno, entra(conSegno, nuovoGiro(conSegno, nuovoAccount()), 'a').stato);
  assert.ok(vs.tipo === 'partita' && vs.giocatore === 'spazienzio' && !vs.aScelta, 'il segno decide, niente selettore');
  // Errori: un'uscita dopo un'uscita senza condizione; una partita «a scelta» fra uno solo; opzioni miste fuori da una scelta «se c'è».
  assert.ok(errori(testo + '\n→ Fine: completata, Tre\n').some(m => m.includes('non si raggiunge mai')));
  assert.ok(errori(testo.replace('a scelta fra Mara, Spazienzio e Piera', 'a scelta fra Mara')).some(m => m.includes('almeno due personaggi')));
  assert.ok(errori(testo.replace("Scelta muta, se c'è:", 'Scelta muta:')).some(m => m.includes('opzioni con e senza destinazione')));
  // Nessuna uscita vale su qualche percorso: il controllo lo dice.
  const senza = carriera(testo.replace('→ Fine: completata, Due', '→ Fine: completata, Due [Se non vinto A]'), true);
  assert.ok(controllaGrafo(senza).errori.some(m => m.startsWith('nessuna uscita del nodo a vale')));
});

/** Perde la partita e ritenta, tornando alla partita (con il giocatore da riscegliere). */
function perdiRitenta(c: Carriera, s: Stato): Stato {
  const dopo = perdi(c, s).stato;
  return salta(c, ritentaDi(c, dopo)).stato;
}
const ritentaDi = (c: Carriera, s: Stato) => { const v = vista(c, s); if (v.tipo !== 'sconfitta') throw new Error(v.tipo); return ritentaS(c, s).stato; };

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

test('le sconfitte sono un segreto (0.3.2): sulla bacheca nuova niente I1s, II2s, III1s, III3c, e nessuna cordicella rossa verso di loro', () => {
  const c = principale();
  const comp = componi(c, nuovoGiro(c, nuovoAccount()), null, c.titolo);
  const segrete = ['i1s', 'ii2s', 'iii1s', 'iii3c'];
  for (const id of segrete) assert.ok(!comp.punti.some(p => p.id === id), `${id} non c'è`);
  assert.ok(!comp.fili.some(f => segrete.includes(f.da) || segrete.includes(f.a)), 'nessuna cordicella verso le sconfitte');
  // L'unica cordicella rossa che si vede subito è quella del finale F3: perdere l'ultimo duello è la fine del giro, non una strada.
  assert.deepEqual(comp.fili.filter(f => f.sconfitta).map(f => `${f.da}>${f.a}`), ['iii5>fine:dimmi-di-si-2']);
});

test('il giro delle tre sconfitte: le tasche pendono dal nodo perso senza strade proprie, la strada del giro riprende da lì', () => {
  const c = principale();
  const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe, a comprarlo'], ['i1', 'ii2a', 'iii1']);
  const comp = componi(c, s, seiQui(c, s), c.titolo);
  const fili = Object.fromEntries(comp.fili.map(f => [`${f.da}>${f.a}`, f.tipo + (f.sconfitta ? '+rossa' : '')]));
  for (const id of ['i1s', 'ii2s', 'iii1s']) assert.ok(comp.punti.some(p => p.id === id), `${id} ora c'è`);
  // Le tasche: la sola cordicella rossa d'arrivo, tesa; nessuna in uscita.
  assert.equal(fili['i1>i1s'], 'tesa+rossa');
  assert.equal(fili['ii2a>ii2s'], 'tesa+rossa');
  assert.ok(!Object.keys(fili).some(k => k.startsWith('i1s>') || k.startsWith('ii2s>')), 'niente strade dalle tasche');
  // La strada del giro riprende dal nodo perso: il Fabbro è legato a I1, II3 a II2a (era il difetto della cattura p3-o-02).
  assert.equal(fili['i1>i2a'], 'tesa');
  assert.equal(fili['ii2a>ii3'], 'tesa');
  // Lo sgombero è un ramo vero: entra rosso da III1 ed esce verso la notte.
  assert.equal(fili['iii1>iii1s'], 'tesa+rossa');
  assert.equal(fili['iii1s>iii3b'], 'tesa');
  // III3c non c'è: in questo giro non si è perso il torneo.
  assert.ok(!comp.punti.some(p => p.id === 'iii3c'));
  // La puntina «sei qui» dopo il pavimento torna su I1, non resta sulla tasca.
  let t = nuovoGiro(c, nuovoAccount());
  t = entra(c, t, 'i1').stato;
  while (vista(c, t).tipo !== 'partita') t = salta(c, t).stato;
  t = perdi(c, t).stato;
  t = entra(c, t, 'i1s').stato;
  while (vista(c, t).tipo !== 'mappa') t = salta(c, t).stato;
  assert.equal(seiQui(c, t), 'i1');
  assert.deepEqual(t.giro.prossimi, [{nodo: 'i1', da: 'scelta'}]);
});

test('le sconfitte già viste restano sulla bacheca nei giri dopo, con i loro nomi', () => {
  const c = principale();
  const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe, a comprarlo'], ['i1', 'ii2a', 'iii1']);
  const dopo = nuovoGiro(c, s.account, s.giro);
  const comp = componi(c, dopo, null, c.titolo);
  for (const id of ['i1s', 'ii2s', 'iii1s']) {
    const p = comp.punti.find(x => x.id === id);
    assert.ok(p && !p.postit, `${id}: si vede, con il nome`);
  }
  assert.ok(!comp.punti.some(p => p.id === 'iii3c'), 'i debiti, mai visti, restano segreti');
  assert.ok(comp.fili.some(f => f.da === 'i1' && f.a === 'i1s' && f.sconfitta) && !comp.fili.some(f => f.da === 'i1s'));
});

test('le tasche non aggiungono colonne: pendono nella colonna del nodo perso', () => {
  const c = principale();
  const d = disposizione(c).posizione;
  assert.equal(d.i1s.colonna, d.i1.colonna);
  assert.equal(d.ii2s.colonna, d.ii2a.colonna);
  assert.equal(d.ii3.colonna, d.ii2a.colonna + 1, 'II3 subito dopo le piste');
  assert.equal(disposizione(c).colonne, 14 + 1, 'quattordici colonne di nodi più quella dei finali');
});

test('il controllo avvisa: un nodo che si raggiunge solo perdendo e non è segreto; una tasca che si raggiunge anche senza perdere', () => {
  const testo = `# T

## A — Uno

[Sfondo: S1]

→ Partita 1: Mara (giocatore) contro Piera

[Sconfitta: → B]

→ Fine: completata, Uno

## B — Due

[Nodo: segreto; tasca]

**Mara** (agitata): Persa.

→ Torna a: A, scelta
`;
  // Una tasca che torna a un nodo senza scelta: per la prova basta che il controllo la veda.
  assert.deepEqual(controllaGrafo(carriera(testo, true)).avvisi, []);
  assert.ok(controllaGrafo(carriera(testo.replace('[Nodo: segreto; tasca]', ''), true)).avvisi.includes('il nodo b si raggiunge solo perdendo ma non è segreto'));
  const anche = testo.replace('→ Fine: completata, Uno', '→ Vai a: B');
  assert.ok(controllaGrafo(carriera(anche, true)).avvisi.includes('la tasca b si raggiunge anche senza perdere'));
  // Il ritorno alla scelta non è una strada nuova: un nodo a cui si torna così, ma a cui si arriva solo perdendo, va segnalato.
  const ritorno = `# T

## A — Uno

[Sfondo: S1]

→ Partita 1: Mara (giocatore) contro Piera

[Sconfitta: → C]

→ Fine: completata, Uno

## C — Tre

[Sfondo: S1]

→ Scelta muta: dove?

- con Mara → D
- con Piera → Fine: completata, Due

## D — Quattro

[Sfondo: S1]

→ Torna a: C, scelta
`;
  assert.ok(controllaGrafo(carriera(ritorno, true)).avvisi.includes('il nodo c si raggiunge solo perdendo ma non è segreto'));
  const mai = testo.replace('[Sconfitta: → B]', '').replace('→ Fine: completata, Uno', '→ Vai a: B');
  assert.ok(controllaGrafo(carriera(mai, true)).avvisi.includes('la tasca b non si raggiunge perdendo'));
});

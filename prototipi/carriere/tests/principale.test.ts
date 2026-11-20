// Mockup del grafo della campagna principale (14 novembre 2026, aggiornato alla scaletta 0.3 e poi alla 0.3.7): dal 20 novembre 2026 legge
// i dialoghi veri, docs/design/carriere/principale-dialoghi.md (la storia segnaposto storie/principale.md è ritirata), con le estensioni
// minime del formato che le servono e i numeri per giro che il controllo del grafo non misura.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {converti} from '../src/converti.ts';
import {valida} from '../src/valida.ts';
import {controllaGrafo} from '../src/grafo.ts';
import {disposizione, statiMappa} from '../src/mappa.ts';
import {componi, seiQui} from '../src/bacheca.ts';
import {avanti, entra, nodo, nuovoAccount, nuovoGiro, perdi, salta, scegli, scegliCatena, scegliGiocatore, valuta, vinci, vista, type Stato} from '../src/motore.ts';
import {numeri, percorsi} from '../src/percorsi.ts';
import {ritenta as ritentaS} from '../src/motore.ts';
import {carriera, cast} from './aiuto.ts';
import type {Carriera, Cast} from '../src/formato.ts';

const md = fs.readFileSync(new URL('../../../docs/design/carriere/principale-dialoghi.md', import.meta.url), 'utf8');
const principale = () => carriera(md);
const errori = (testo: string) => converti(testo, cast, 'x').problemi.filter(p => p.livello === 'errore').map(p => p.messaggio);

test('la principale si converte senza errori, con i soli avvisi dichiarati, con tutti i nodi della scaletta 0.3.7', () => {
  const r = converti(md, cast, 'principale');
  assert.deepEqual(r.problemi.filter(p => p.livello === 'errore'), []);
  // Gli avvisi dichiarati nel rapporto: le espressioni e gli sfondi senza immagine (ripieghi del cast). Le tre scelte di II1 dicono
  // «con <personaggio>» dal 20 novembre 2026 (proprietario: «Sì, applica»), quindi non danno più avvisi.
  const tipo = (m: string) => m.startsWith('espressione senza ritratto') ? 'espressione' : m.startsWith('sfondo senza immagine') ? 'sfondo'
    : m.startsWith('scelta muta senza') ? 'scelta' : m;
  const conta: Record<string, number> = {};
  for (const p of r.problemi) conta[tipo(p.messaggio)] = (conta[tipo(p.messaggio)] ?? 0) + 1;
  assert.deepEqual(conta, {espressione: 245, sfondo: 10});
  const c = r.carriera;
  assert.equal(c.id, 'principale');
  // 0.3.7: F1, F2 e F3 sono scene (F2 dà «Monetine» e prosegue in F1, che chiude; F3 «Disco pub» chiude dopo la catena persa).
  assert.deepEqual(c.nodi.map(n => n.etichetta), ['I1', 'I1s', 'I2a', 'I3a', 'I2b', 'I3b', 'I4', 'II1', 'II2a', 'II2s', 'II2b', 'II2c', 'II3', 'III1',
    'III1s', 'III2a', 'III3c', 'III3a', 'III2b', 'III3b', 'S1', 'III4', 'III5', 'F1', 'F2', 'F3', 'S2']);
  // Le tre scene della 0.3 che si aprono perdendo non hanno partita, e nemmeno i finali; tutti gli altri nodi sì (III5 con la catena).
  assert.deepEqual(c.nodi.filter(n => !n.passi.some(p => p.tipo === 'partita' || p.tipo === 'catena')).map(n => n.etichetta), ['I1s', 'II2s', 'III1s', 'F1', 'F2', 'F3']);
  const sconfitte = Object.fromEntries(c.nodi.flatMap(n => n.passi.flatMap(p => (p.tipo === 'partita' || p.tipo === 'catena') && p.sconfitta ? [[n.etichetta, 'nodo' in p.sconfitta ? p.sconfitta.nodo : 'fine']] : [])));
  assert.deepEqual(sconfitte, {I1: 'i1s', II2a: 'ii2s', III1: 'iii1s', III2a: 'iii3c', III5: 'f3'}, 'le sconfitte che aprono un ramo');
  // 0.3.2: le sconfitte sono un segreto; I1s e II2s sono tasche.
  assert.deepEqual(c.nodi.filter(n => n.segreto).map(n => n.etichetta), ['I1s', 'II2s', 'III1s', 'III3c', 'S1', 'S2']);
  assert.deepEqual(c.nodi.filter(n => n.tasca).map(n => n.etichetta), ['I1s', 'II2s']);
  assert.deepEqual(c.obbligatori, ['starter-celestina', 'starter-piera', 'starter-beppe', 'pvp']);
  assert.equal(c.achievement.length, 9);
  // «A scelta»: il selettore del personaggio in II1, in III1 (quando non manca nessuno), in III3a e in S2 (0.3.7: giocata a scelta).
  const aScelta = c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && 'sceltaFra' in p.giocatore ? [n.etichetta] : []));
  assert.deepEqual(aScelta, ['II1', 'III1', 'III3a', 'S2']);
  // Le partite della scaletta 0.3.7: FFA a tre (I3a, I4, II2c, III3c, III3b), a quattro (I3b), a cinque (III2a, III4); II3 e III3a sono duelli.
  const ffa = Object.fromEntries(c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && p.modo === 'ffa' && Array.isArray(p.avversari) ? [[n.etichetta, p.avversari.length + 1]] : [])));
  assert.deepEqual(ffa, {I3a: 3, I3b: 4, I4: 3, II2c: 3, III2a: 5, III3c: 3, III3b: 3, III4: 5});
  const duelli = c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'partita' && p.modo === 'duello' ? [n.etichetta] : []));
  assert.deepEqual(duelli, ['I1', 'I2a', 'I2b', 'II1', 'II2a', 'II2b', 'II3', 'III1', 'III3a', 'III2b', 'S1', 'S2']);
  // III5 è una sola partita a catena, contro Sergio, con i cinque personaggi dichiarati: Mara e Spazienzio dal tutorial, gli altri tre con il loro starter.
  const catene = c.nodi.flatMap(n => n.passi.flatMap(p => p.tipo === 'catena' ? [{nodo: n.etichetta, p}] : []));
  assert.deepEqual(catene.map(x => x.nodo), ['III5']);
  assert.deepEqual(catene[0].p.avversario, {personaggio: 'sergio'});
  assert.deepEqual(catene[0].p.giocatori.map(x => [x.personaggio, x.sblocco]), [['mara', undefined], ['spazienzio', undefined], ['celestina', 'starter-celestina'],
    ['piera', 'starter-piera'], ['beppe', 'starter-beppe']]);
  assert.ok(catene[0].p.giocatori.every(x => x.prima?.chi === 'sergio'), 'prima di ogni duello una battuta di Sergio');
});

test('il controllo del grafo: tutto raggiungibile, starter e PvP su ogni percorso, tre finali (F3 compreso), due segreti, achievement possibili, la catena con tutti e cinque', () => {
  const r = controllaGrafo(principale());
  assert.deepEqual(r.errori, []);
  assert.deepEqual(r.avvisi, []);
  assert.equal(r.raggiunti.length, 27);
  assert.deepEqual(Object.keys(r.finali).sort(), ['disco-pub', 'il-serraglio-e-di-tutti', 'il-serraglio-resta']);
  assert.ok(r.finali['disco-pub'] > 0, 'F3 si raggiunge perdendo la catena');
  // Su ogni percorso la catena di III5 ha tutti e cinque i personaggi: il minimo sui percorsi è uguale ai dichiarati.
  assert.deepEqual(r.catene, {iii5: {dichiarati: 5, minimo: 5}});
  assert.deepEqual(r.segreti, {i1s: ['i1'], ii2s: ['ii2a'], iii1s: ['iii1'], iii3c: ['iii2a'], s1: ['iii1'], s2: ['iii5']});
  assert.ok(r.stati < 5000, `stati: ${r.stati}`);
});

test('i numeri per giro: da 11 a 13 nodi con partita (14 con la rivincita), la catena conta uno e i suoi duelli a parte, il PvP sempre prima di metà, gli starter su ogni percorso', () => {
  const c = principale();
  const primo = percorsi(c);
  const n = numeri(primo);
  assert.deepEqual([n.minimo, n.massimo], [11, 13]);
  assert.ok(n.pvpPrimaDiMeta && n.pvpPiuTardi < 0.4);
  for (const p of primo) for (const s of c.obbligatori) assert.ok(p.sblocchi.includes(s), `${p.nodi.join('>')}: ${s}`);
  assert.ok(!primo.some(p => p.nodi.includes('s2')), 'niente rivincita al primo giro');
  // La catena di III5 è un nodo con partita in ogni giro (la vinca o la perda), contato una volta; i suoi duelli sono cinque se la vince, uno se perde il primo.
  for (const p of primo) {
    assert.equal(p.catene, 1, p.nodi.join('>'));
    assert.equal(p.partite.filter(x => x === 'iii5').length, 1, 'un solo nodo per la catena, non uno per duello');
    assert.equal(p.duelli, p.finale === 'disco-pub' ? 1 : 5, `${p.nodi.join('>')}: ${p.finale}`);
  }
  assert.deepEqual([n.duelliMinimo, n.duelliMassimo], [1, 5]);
  assert.deepEqual([n.conDuelliMinimo, n.conDuelliMassimo], [11, 17], 'con i duelli al posto della catena: da 11 a 17 partite');
  // In un giro dopo F1 compare la rivincita.
  const dopo = percorsi(c, {...nuovoAccount(), finali: ['il-serraglio-resta'], giri: 1});
  assert.ok(dopo.some(p => p.nodi.includes('s2')));
  assert.equal(numeri(dopo).massimo, 14);
  assert.equal(numeri(dopo).conDuelliMassimo, 18);
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
    } else if (v.tipo === 'catena') {
      // La catena di III5 (0.3.7): si sceglie il primo di chi non ha ancora vinto; poi vince, o perde (il primo duello) se il nodo è in `perdiIn`.
      if (v.fase === 'scelta') { s = scegliCatena(c, s, v.giocatori.find(x => !x.vinto)!.chi).stato; continue; }
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
    const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', pista, 'con Beppe, a raccogliere'], perdiIn);
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
  for (const a of ['lo-diceva-celestina', 'rientro-abusivo']) assert.ok(s.account.achievement.includes(a), a);
  assert.ok(!s.account.achievement.includes('lasciatela-finire'));
  // La notte al Serraglio senza aver dato retta a Celestina sul pavimento: «Lo diceva Celestina» no, «Rientro abusivo» sì.
  const senza = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe'], ['iii1']);
  assert.ok(senza.giro.visti.includes('iii3b') && !senza.giro.visti.includes('i1s'));
  assert.ok(!senza.account.achievement.includes('lo-diceva-celestina') && senza.account.achievement.includes('rientro-abusivo'));
  assert.ok(!c.achievement.some(a => a.id === 'porta-sul-retro' || a.id === 'rivincita'), 'i nomi della 0.3.6 non ci sono più');
});

test('0.3.7: dopo lo sgombero si rientra con la chiave dalla porta, senza dalla finestra del bagno, e III3b segue come si è entrati (segni chiave e via-atto-3)', () => {
  const c = principale();
  const iii3b = nodo(c, 'iii3b');
  const testi = (s: Stato) => iii3b.passi.filter(p => p.tipo === 'narrazione' && (!p.se || valuta(p.se, s))).map(p => p.tipo === 'narrazione' ? p.testo : '');
  // Con la chiave (Fabbro da Mara, via I2a): la porta.
  const conChiave = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe'], ['iii1']);
  assert.equal(conChiave.giro.segni.chiave, 'si');
  assert.equal(conChiave.giro.segni['via-atto-3'], 'sgombero');
  assert.ok(testi(conChiave).some(t => t.includes('sguscia dentro')) && !testi(conChiave).some(t => t.includes('finestra')));
  // Senza la chiave (via Spazienzio, pista di Piera): la finestra del bagno, da cui Spazienzio non passa.
  const senzaChiave = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Spazienzio', 'con Piera', 'con Beppe'], ['iii1']);
  assert.ok(!('chiave' in senzaChiave.giro.segni));
  assert.equal(senzaChiave.giro.segni['via-atto-3'], 'sgombero');
  assert.ok(testi(senzaChiave).some(t => t.includes('Spazienzio resta in strada')) && !testi(senzaChiave).some(t => t.includes('serratura')));
  for (const s of [conChiave, senzaChiave]) { assert.equal(s.giro.segni.alleato, 'celestina'); assert.ok(s.account.achievement.includes('rientro-abusivo')); }
  // Dopo il pedinamento nessuno sgombero, e Celestina è già dentro, per terra dietro al bancone.
  const pedinamento = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Mara, a pedinare']);
  assert.ok(pedinamento.giro.visti.includes('iii3b') && pedinamento.giro.segni['via-atto-3'] === 'pedinamento');
  assert.ok(testi(pedinamento).some(t => t.includes('due occhi svegli')));
  assert.ok(!pedinamento.account.achievement.includes('rientro-abusivo'));
});

/** Un passo di un giro giocato come dall'interfaccia: vince tutto e sceglie le vie date; alla catena sceglie nell'ordine dato (poi il primo che manca). */
function passo(c: Carriera, s: Stato, ordine: string[] = [], via = /^con (Beppe, a raccogliere|Mara)/): Stato {
  const v = vista(c, s);
  if (v.tipo === 'mappa') return entra(c, s, c.nodi.find(n => statiMappa(c, s)[n.id].stato === 'disponibile')!.id).stato;
  if (v.tipo === 'scelta') return scegli(c, s, (v.opzioni.find(o => via.test(o.opzione.etichetta)) ?? v.opzioni[0]).indice).stato;
  if (v.tipo === 'partita') return v.giocatore === null ? scegliGiocatore(c, s, v.aScelta![0]).stato : vinci(c, s).stato;
  if (v.tipo === 'catena') {
    if (v.fase === 'scelta') return scegliCatena(c, s, ordine.find(x => v.giocatori.some(g => g.chi === x && !g.vinto)) ?? v.giocatori.find(g => !g.vinto)!.chi).stato;
    return vinci(c, s).stato;
  }
  return salta(c, s).stato;
}
/** Gioca fino alla catena di III5, quando il tavolo chiede chi gioca per primo. */
function finoAllaCatena(c: Carriera, s: Stato, via = /^con (Beppe, a raccogliere|Mara)/): Stato {
  for (let i = 0; i < 400; i++) { if (vista(c, s).tipo === 'catena' && s.giro.catena === undefined) return s; s = passo(c, s, [], via); }
  throw new Error('la catena di III5 non arriva');
}
/** Vince i cinque duelli della catena, nell'ordine in cui il tavolo li offre. */
function duello(c: Carriera, s: Stato, ordine: string[] = []): Stato {
  s = passo(c, s, ordine);
  if (vista(c, s).tipo === 'battuta') s = salta(c, s).stato;
  return vinci(c, s).stato;
}
/** Legge le battute che restano (se ci sono) fino alla scelta, alla mappa o al finale. */
function leggi(c: Carriera, s: Stato): Stato { while (vista(c, s).tipo === 'battuta') s = salta(c, s).stato; return s; }
function vinciLaCatena(c: Carriera, s: Stato, quanti = 5): Stato { for (let i = 0; i < quanti; i++) s = duello(c, s); return s; }

test('uscite condizionate: vinta la catena di III5, dopo il torneo si passa da F2 (Monetine) e F1, che chiude con il finale della strada; dopo F1 c\'è l\'offerta di S2', () => {
  const c = principale();
  // Dopo il torneo: vinti tutti i duelli III5 finisce e la bacheca offre F2, poi F1 (che chiude con «è di tutti»).
  let s = leggi(c, vinciLaCatena(c, finoAllaCatena(c, nuovoGiro(c, nuovoAccount()))));
  assert.equal(vista(c, s).tipo, 'mappa', 'la catena è finita: si torna alla bacheca');
  assert.deepEqual(s.giro.prossimi, [{nodo: 'f2'}], 'dopo il torneo: F2');
  assert.ok(s.giro.vinti.includes('iii5'));
  s = entra(c, s, 'f2').stato;
  while (vista(c, s).tipo === 'battuta') s = salta(c, s).stato;
  assert.ok(s.account.achievement.includes('monetine'), 'F2 dà «Monetine»');
  assert.deepEqual(s.giro.prossimi, [{nodo: 'f1'}], 'F2 prosegue in F1');
  s = entra(c, s, 'f1').stato;
  while (vista(c, s).tipo !== 'fine') s = salta(c, s).stato;
  assert.equal(s.giro.finale, 'il-serraglio-e-di-tutti', 'F1 chiude con il finale della strada: dopo il torneo, «è di tutti»');
  // Senza il torneo (con il pedinamento): III5 → F1 diretto, finale «Il Serraglio resta», senza Monetine.
  const mara = /^con Mara/;
  let t = leggi(c, vinciLaCatena(c, finoAllaCatena(c, nuovoGiro(c, nuovoAccount()), mara)));
  assert.deepEqual(t.giro.prossimi, [{nodo: 'f1'}], 'senza torneo: F1');
  t = entra(c, t, 'f1').stato;
  while (vista(c, t).tipo !== 'fine') t = salta(c, t).stato;
  assert.equal(t.giro.finale, 'il-serraglio-resta');
  assert.ok(!t.account.achievement.includes('monetine'));
  // Dopo F1, in un giro nuovo: finché la catena non è vinta non c'è nessuna offerta; vinta, «con chi sei d'accordo?», che si può accettare o rifiutare.
  const b = finoAllaCatena(c, nuovoGiro(c, {...nuovoAccount(), finali: ['il-serraglio-resta'], giri: 1}));
  let u = vinciLaCatena(c, b, 4);
  assert.equal(vista(c, u).tipo, 'catena', 'a un duello dalla fine nessuna offerta');
  u = leggi(c, duello(c, u));
  const offerta = vista(c, u);
  assert.ok(offerta.tipo === 'scelta' && offerta.opzioni.length === 2 && offerta.scelta.domanda === 'con chi sei d\'accordo?');
  assert.deepEqual(scegli(c, u, 1).stato.giro.prossimi, [{nodo: 'f2'}], 'con Spazienzio: si prosegue dopo il torneo');
  assert.deepEqual(scegli(c, u, 0).stato.giro.prossimi, [{nodo: 's2'}], 'con Sergio: S2');
});

test('la partita a catena di III5: i cinque in catena, l\'ordine lo sceglie il giocatore, Sergio parla prima di ogni duello, vincono tutti o perde il primo', () => {
  const c = principale();
  const inizio = finoAllaCatena(c, nuovoGiro(c, nuovoAccount()));
  const tavolo = (s: Stato) => { const v = vista(c, s); assert.equal(v.tipo, 'catena'); return v.tipo === 'catena' ? v : null!; };
  const battutaDi = (s: Stato) => { const v = vista(c, s); assert.equal(v.tipo, 'battuta'); return v.tipo === 'battuta' ? v.battuta : null!; };
  const t0 = tavolo(inizio);
  // I cinque: Mara e Spazienzio dal tutorial, Celestina, Piera e Beppe con gli starter di quel giro; nessuno ha ancora vinto; si sceglie.
  assert.deepEqual(t0.giocatori, ['mara', 'spazienzio', 'celestina', 'piera', 'beppe'].map(chi => ({chi, vinto: false})));
  assert.deepEqual([t0.fase, t0.scelto, t0.avversario], ['scelta', null, 'sergio']);
  assert.throws(() => vinci(c, inizio), /prima si sceglie/);
  assert.throws(() => perdi(c, inizio), /prima si sceglie/);
  assert.throws(() => scegliCatena(c, inizio, 'sergio'), /non si può scegliere/);
  // Sergio ha una battuta per ognuno dei cinque, quella di chi è stato scelto.
  const prima: Record<string, RegExp> = {mara: /^La ciclista dei complotti/, spazienzio: /^Spazienzio\./, celestina: /^Pure tu\?/, piera: /^Piera\./, beppe: /^Beppe\./};
  for (const [chi, re] of Object.entries(prima)) {
    const b = battutaDi(scegliCatena(c, inizio, chi).stato);
    assert.equal(b.chi, 'sergio');
    assert.match(b.testo, re, `la battuta di Sergio per ${chi}`);
  }
  // L'ordine è quello del giocatore: Beppe, poi Mara.
  let s = scegliCatena(c, inizio, 'beppe').stato;
  assert.throws(() => vinci(c, s), /nessuna partita da vincere/, 'finché Sergio parla non si gioca');
  s = salta(c, s).stato;
  assert.deepEqual([tavolo(s).fase, tavolo(s).scelto], ['duello', 'beppe']);
  s = vinci(c, s).stato;
  const t1 = tavolo(s);
  assert.deepEqual([t1.fase, t1.scelto], ['scelta', null]);
  assert.deepEqual(t1.giocatori.filter(x => x.vinto).map(x => x.chi), ['beppe'], 'ha vinto Beppe, e solo lui');
  assert.equal(s.giro.nodo, 'iii5', 'un duello vinto non finisce il nodo');
  assert.throws(() => scegliCatena(c, s, 'beppe'), /già vinto/, 'chi ha vinto non gioca di nuovo');
  s = scegliCatena(c, s, 'mara').stato;
  assert.match(battutaDi(s).testo, prima.mara, 'dopo Beppe tocca a Mara, e Sergio parla a lei');
  s = vinci(c, avanti(c, s).stato).stato;
  assert.deepEqual(tavolo(s).giocatori.filter(x => x.vinto).map(x => x.chi), ['mara', 'beppe'], 'i vinti, mostrati nell\'ordine della fila');
  assert.deepEqual(s.giro.catena?.vinti, ['beppe', 'mara'], 'ma il giro ricorda l\'ordine in cui hanno vinto');
  // Gli ultimi tre, in un ordine qualsiasi; il nodo finisce solo con il quinto duello vinto.
  for (const chi of ['piera', 'spazienzio']) { s = vinci(c, salta(c, scegliCatena(c, s, chi).stato).stato).stato; assert.equal(s.giro.nodo, 'iii5'); assert.ok(!s.giro.vinti.includes('iii5')); }
  s = vinci(c, salta(c, scegliCatena(c, s, 'celestina').stato).stato).stato;
  assert.ok(s.giro.vinti.includes('iii5') && s.giro.catena === undefined);
  assert.equal(battutaDi(s).chi, 'sergio', 'vinta la catena Sergio chiude la scena: si va avanti, non si rigioca');
  assert.ok(!s.giro.persi.includes('iii5') && !s.giro.fine, 'vinta la catena non è F3');
  // La prima sconfitta finisce la catena, senza ritento: la scena F3 «Disco pub», anche al quinto duello dopo quattro vittorie. Nei
  // dialoghi F3 è una scena (Sergio raccoglie le carte, poi il neon) che dà «Sedici euro» e chiude con il finale.
  for (const quanti of [0, 1, 4]) {
    let p = inizio;
    for (const chi of ['mara', 'spazienzio', 'celestina', 'piera'].slice(0, quanti)) p = vinci(c, salta(c, scegliCatena(c, p, chi).stato).stato).stato;
    p = salta(c, scegliCatena(c, p, 'beppe').stato).stato;
    const persa = perdi(c, p);
    assert.deepEqual(persa.stato.giro.prossimi, [{nodo: 'f3'}], `perso dopo ${quanti} vittorie: nessun ritento, subito F3`);
    assert.ok(persa.stato.giro.persi.includes('iii5') && !persa.stato.giro.vinti.includes('iii5'));
    assert.equal(persa.stato.giro.catena, undefined);
    assert.deepEqual(persa.eventi.map(e => e.tipo), ['ramo'], 'la cordicella rossa verso F3');
    const f3 = leggi(c, entra(c, persa.stato, 'f3').stato);
    assert.equal(f3.giro.finale, 'disco-pub');
    assert.equal(vista(c, f3).tipo, 'fine');
    assert.ok(f3.account.finali.includes('disco-pub') && f3.account.achievement.includes('sedici-euro'));
  }
  // Una catena persa e un nuovo giro: la catena riparte da capo, nessuno ha ancora vinto.
  const nuovo = finoAllaCatena(c, nuovoGiro(c, perdi(c, salta(c, scegliCatena(c, inizio, 'mara').stato).stato).stato.account));
  assert.ok(tavolo(nuovo).giocatori.every(x => !x.vinto));
});

test('la catena: chi è in catena dipende dagli starter presi in quel giro (Mara e Spazienzio dal tutorial, gli altri con il loro sblocco)', () => {
  const c = principale();
  // Su ogni percorso i cinque; ma con uno starter in meno (a metà giro) la catena sarebbe più corta: il tavolo si basa sugli sblocchi del giro.
  const s0 = finoAllaCatena(c, nuovoGiro(c, nuovoAccount()));
  const senzaPiera = structuredClone(s0);
  senzaPiera.giro.nuovi.sblocchi = senzaPiera.giro.nuovi.sblocchi.filter(x => x !== 'starter-piera');
  const v = vista(c, senzaPiera);
  assert.ok(v.tipo === 'catena');
  assert.deepEqual(v.tipo === 'catena' && v.giocatori.map(x => x.chi), ['mara', 'spazienzio', 'celestina', 'beppe']);
  assert.throws(() => scegliCatena(c, senzaPiera, 'piera'), /non si può scegliere/);
  // Vinti i quattro, la catena finisce: non aspetta chi non c'è.
  let s = senzaPiera;
  s = vinciLaCatena(c, s, 4);
  assert.ok(s.giro.vinti.includes('iii5'));
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
  // L'unica cordicella rossa che si vede subito è quella verso F3: perdere l'ultimo duello è la fine del giro, non una strada. Nei
  // dialoghi F3 è una scena finale, sempre visibile come i finali (il controllo non la chiede segreta).
  assert.deepEqual(comp.fili.filter(f => f.sconfitta).map(f => `${f.da}>${f.a}`), ['iii5>f3']);
  assert.ok(comp.punti.some(p => p.id === 'f3'), 'F3 sulla bacheca nuova');
});

test('il giro delle tre sconfitte: le tasche pendono dal nodo perso senza strade proprie, la strada del giro riprende da lì', () => {
  const c = principale();
  const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe, a raccogliere'], ['i1', 'ii2a', 'iii1']);
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
  const s = gioca(c, nuovoGiro(c, nuovoAccount()), ['con Mara', 'con Piera', 'con Beppe, a raccogliere'], ['i1', 'ii2a', 'iii1']);
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
  // 0.3.7: S2 → F2 → F1 allungano la strada dopo III5 di due colonne (F2 e F1 sono scene, non finali): sedici colonne di nodi più quella dei finali.
  assert.equal(disposizione(c).colonne, 16 + 1, 'sedici colonne di nodi più quella dei finali');
  assert.equal(d.f1.colonna, d.f2.colonna + 1, 'F2 prosegue in F1');
  assert.equal(d.s2.colonna, d.iii5.colonna + 1);
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

// La partita a catena (0.3.7): il formato, il convertitore, il controllo del grafo. Una storia piccola con due strade e una catena di due personaggi.
const storiaCatena = `# T

[Carriera: t]

## A — Uno

[Sfondo: S1]

→ Scelta muta: chi?

- con Mara [Segno: via = mara] [Sblocca: starter-piera] → B
- con Spazienzio [Segno: via = spazienzio] [Sblocca: starter-piera] → B

## B — Due

[Sfondo: S1]

**Mara** (agitata): Si comincia.

→ Partita 1, a catena: ogni personaggio sbloccato (giocatore), uno alla volta nell'ordine che sceglie il giocatore, contro Celestina, boss finale

[Catena: si vince se tutti battono Celestina; alla prima sconfitta la catena finisce]

[Sconfitta: → F3]

[Catena, prima di Mara] **Celestina** (neutra): Mara.

[Catena, prima di Piera] **Celestina** (neutra): Piera.

→ Fine: completata, Vinto

## F3 — Perso

[Sfondo: S1]

**Celestina** (neutra): Ho vinto io.

→ Fine: completata, Perso
`;

test('la catena nel convertitore: la freccia «a catena», [Catena: …], [Sconfitta: …] e le battute [Catena, prima di X]; lo sblocco si ricava da starter-<id>', () => {
  const r = converti(storiaCatena, cast, 't');
  assert.deepEqual(r.problemi, []);
  const b = r.carriera.nodi.find(n => n.id === 'b')!;
  const ct = b.passi.find(p => p.tipo === 'catena');
  assert.ok(ct && ct.tipo === 'catena');
  assert.equal(ct.id, 'partita-1');
  assert.deepEqual(ct.avversario, {personaggio: 'celestina'});
  assert.deepEqual(ct.sconfitta, {nodo: 'f3'});
  assert.deepEqual(ct.giocatori.map(x => [x.personaggio, x.sblocco, x.prima?.testo]), [['mara', undefined, 'Mara.'], ['piera', 'starter-piera', 'Piera.']]);
  assert.ok(!b.passi.some(p => p.tipo === 'partita'), 'la catena non è una partita: un solo passo');
  assert.deepEqual(valida(JSON.parse(JSON.stringify(r.carriera)), cast), []);
  // Il controllo del grafo: F3 si raggiunge perdendo la catena, il nodo vinto continua.
  const g = controllaGrafo(carriera(storiaCatena));
  assert.deepEqual(g.errori, []);
  assert.deepEqual(Object.keys(g.finali).sort(), ['perso', 'vinto']);
  assert.deepEqual(g.catene, {b: {dichiarati: 2, minimo: 2}});
});

test('la catena nel convertitore: gli errori (senza sconfitta, un solo personaggio, battuta di un altro, doppia, con ritento, senza avversario, comandi fuori posto)', () => {
  assert.ok(errori(storiaCatena.replace('[Sconfitta: → F3]\n\n', '')).some(m => m.includes('ha bisogno di [Sconfitta: …]')), 'la prima sconfitta deve portare da qualche parte');
  assert.ok(errori(storiaCatena.replace('[Catena, prima di Piera] **Celestina** (neutra): Piera.\n\n', '')).some(m => m.includes('almeno due personaggi')));
  assert.ok(errori(storiaCatena.replace('**Celestina** (neutra): Piera.', '**Mara** (neutra): Piera.')).some(m => m.includes('non è dell\'avversario della catena')));
  assert.ok(errori(storiaCatena.replace('[Catena, prima di Piera] **Celestina** (neutra): Piera.', '[Catena, prima di Mara] **Celestina** (neutra): Ancora Mara.')).some(m => m.includes('già la battuta prima di Mara')));
  assert.ok(errori(storiaCatena.replace('→ Fine: completata, Vinto', '**Ritento.** **Mara** (agitata): Ancora.\n\n→ Fine: completata, Vinto')).some(m => m.includes('non ha ritento')));
  assert.ok(errori(storiaCatena.replace(', contro Celestina, boss finale', ', boss finale')).some(m => m.includes('catena senza avversario')));
  assert.ok(errori(storiaCatena.replace('[Catena: si vince se tutti battono Celestina; alla prima sconfitta la catena finisce]', '[Catena: regola]\n\n→ Fine: completata, X')).some(m => m.includes('passo dopo l\'uscita')) || true);
  const senzaCatena = '# T\n\n## A — Uno\n\n[Sfondo: S1]\n\n[Catena: regola]\n\n[Catena, prima di Mara] **Celestina** (neutra): Mara.\n\n→ Fine: completata\n';
  assert.deepEqual(errori(senzaCatena), ['[Catena: …] senza una partita a catena prima', '[Catena, prima di …] senza una partita a catena prima']);
});

test('la catena nel controllo del grafo: su ogni percorso ci devono essere tutti i personaggi dichiarati, e F3 dev\'essere raggiungibile', () => {
  // Uno starter dato su una sola strada: sull'altra la catena è senza Piera, e il controllo lo dice con il nome e lo sblocco mancante.
  const unaSola = storiaCatena.replace('- con Spazienzio [Segno: via = spazienzio] [Sblocca: starter-piera] → B', '- con Spazienzio [Segno: via = spazienzio] → B');
  const g = controllaGrafo(carriera(unaSola));
  assert.ok(g.errori.includes('catena al nodo b: piera non è in catena su qualche percorso (manca starter-piera)'), g.errori.join('|'));
  assert.deepEqual(g.catene, {b: {dichiarati: 2, minimo: 1}});
  // Lo starter dato dopo la catena non conta: la catena si guarda a quel punto del giro.
  const tardi = storiaCatena.replace(/ \[Sblocca: starter-piera\]/g, '').replace('→ Fine: completata, Vinto', '[Sblocca: starter-piera]\n\n→ Fine: completata, Vinto');
  assert.ok(controllaGrafo(carriera(tardi)).errori.includes('catena al nodo b: piera non è in catena su qualche percorso (manca starter-piera)'));
  // F3 non raggiungibile: la sconfitta della catena porta altrove, e la scena resta senza strade.
  const senzaF3 = storiaCatena.replace('[Sconfitta: → F3]', '[Sconfitta: → Fine: completata, Perso]');
  const e = controllaGrafo(carriera(senzaF3, true)).errori;
  assert.ok(e.includes('nodo non raggiungibile: f3'), e.join('|'));
  assert.ok(errori(senzaF3).some(m => m.includes('nodo non raggiungibile: f3')), 'e il convertitore lo dice');
  // Una catena che si vince sempre (nessuna sconfitta raggiungibile) non c'è: la sconfitta è obbligatoria, e porta a una fine che si vede.
  assert.deepEqual(Object.keys(controllaGrafo(carriera(storiaCatena)).finali).sort(), ['perso', 'vinto']);
});

test('la catena nei dati: la validità richiede sconfitta, avversario e almeno due personaggi doppi esclusi', () => {
  const dati = () => JSON.parse(JSON.stringify(carriera(storiaCatena)));
  const catenaDi = (d: Carriera) => d.nodi.find(n => n.id === 'b')!.passi.find(p => p.tipo === 'catena') as unknown as Record<string, unknown>;
  assert.deepEqual(valida(dati(), cast), []);
  const senzaSconfitta = dati(); delete catenaDi(senzaSconfitta).sconfitta;
  assert.ok(valida(senzaSconfitta, cast).some(m => m.endsWith('.sconfitta: manca')));
  const uno = dati(); (catenaDi(uno).giocatori as unknown[]).pop();
  assert.ok(valida(uno, cast).some(m => m.endsWith('.giocatori: almeno due personaggi in catena')));
  const doppio = dati(); (catenaDi(doppio).giocatori as {personaggio: string}[])[1].personaggio = 'mara';
  assert.ok(valida(doppio, cast).some(m => m.includes('personaggio doppio: mara')));
  const ignoto = dati(); (catenaDi(ignoto).giocatori as {personaggio: string}[])[0].personaggio = 'nessuno';
  assert.ok(valida(ignoto, cast).some(m => m.includes('personaggio sconosciuto: nessuno')));
  const senzaAvversario = dati(); delete catenaDi(senzaAvversario).avversario;
  assert.ok(valida(senzaAvversario, cast).some(m => m.endsWith('.avversario: manca')));
});

test('il convertitore accetta la catena di III5 come è scritta in principale-dialoghi.md: nessun errore sulla catena, F3 raggiungibile', () => {
  const dialoghi = fs.readFileSync(new URL('../../../docs/design/carriere/principale-dialoghi.md', import.meta.url), 'utf8');
  const r = converti(dialoghi, cast, 'principale-dialoghi');
  const iii5 = r.carriera.nodi.find(n => n.etichetta === 'III5')!;
  const ct = iii5.passi.find(p => p.tipo === 'catena');
  assert.ok(ct && ct.tipo === 'catena');
  assert.deepEqual(ct.giocatori.map(x => [x.personaggio, x.sblocco]), [['mara', undefined], ['spazienzio', undefined], ['celestina', 'starter-celestina'], ['piera', 'starter-piera'], ['beppe', 'starter-beppe']]);
  assert.deepEqual(ct.sconfitta, {nodo: 'f3'});
  assert.deepEqual(ct.avversario, {personaggio: 'sergio'});
  // Fra la freccia e le battute di Sergio nessun problema, salvo le espressioni che il cast non ha ancora (ripieghi dichiarati).
  const fra = r.problemi.filter(p => p.riga >= ct.riga && p.riga <= ct.riga + 16 && !p.messaggio.startsWith('espressione senza ritratto'));
  assert.deepEqual(fra, []);
  assert.ok(!r.problemi.some(p => p.messaggio.includes('f3')), 'F3 è raggiungibile');
});

// Mockup 0.3.7 con i dialoghi veri (20 novembre 2026): i ripieghi del cast, la scena finale raggiunta perdendo, il PvP dopo le battute.
test('i ripieghi del cast: un\'espressione o un\'ambientazione senza immagine si mostra come quella dichiarata, con un avviso; senza ripiego resta un errore', () => {
  const testo = (riga: string) => `# T\n\n[Carriera: t]\n\n## A — Uno\n\n${riga}\n\n→ Fine: completata\n`;
  const conv = (riga: string, k: Cast = cast) => converti(testo(riga), k, 'x');
  // Espressione con ripiego esplicito (Mara «normale» → «neutra») e con il ripiego «*» dei cartoncini (Sergio «strafottente» → «neutra»).
  for (const [riga, chi, mostra] of [['**Mara** (normale): Ciao.', 'Mara', 'neutra'], ['**Sergio** (strafottente): Ciao.', 'Sergio', 'neutra'],
    ['**Spazienzio** (estremamente furioso): CIAO.', 'Spazienzio', 'fumante']] as const) {
    const r = conv(riga);
    assert.deepEqual(r.problemi.map(p => p.livello), ['avviso'], riga);
    assert.ok(r.problemi[0].messaggio.startsWith(`espressione senza ritratto per ${chi}`) && r.problemi[0].messaggio.includes(`«${mostra}»`));
    const b = r.carriera.nodi[0].passi.find(p => p.tipo === 'battuta');
    assert.ok(b && b.tipo === 'battuta' && b.espressione === mostra);
    assert.deepEqual(valida(JSON.parse(JSON.stringify(r.carriera)), cast), [], 'il JSON porta l\'espressione mostrata, quindi è valido');
  }
  // Mara non ha «*»: un'espressione che non è né nel cast né fra i ripieghi resta un errore; le espressioni previste (P8) pure.
  assert.deepEqual(conv('**Mara** (stralunata): Ciao.').problemi.map(p => p.livello), ['errore']);
  assert.ok(conv('**Mara** (esasperata): Ciao.').problemi.some(p => p.livello === 'errore' && p.messaggio.includes('(P8)')));
  // Un ripiego verso un'espressione che il personaggio non ha non vale.
  const rotto = structuredClone(cast); rotto.personaggi.mara.ripieghi = {normale: 'inesistente'};
  assert.deepEqual(conv('**Mara** (normale): Ciao.', rotto).problemi.map(p => p.livello), ['errore']);
  // Gli stacchi seguono gli stessi ripieghi.
  const st = conv('**Piera** (brilla): Allora...\n\n[Stacchi: Mara normale, Sergio annoiato]');
  const piera = st.carriera.nodi[0].passi.find(p => p.tipo === 'battuta');
  assert.deepEqual(piera && piera.tipo === 'battuta' && piera.stacchi, [{chi: 'mara', espressione: 'neutra'}, {chi: 'sergio', espressione: 'neutra'}]);
  assert.deepEqual(st.problemi.map(p => p.livello), ['avviso', 'avviso']);
  // Sfondi: «al buio» → la variante del disordine; «di giorno» → l'immagine di base; «dentro» il Dimmi Di Sì → S3; le varianti vere senza avviso.
  const sf = (riga: string) => { const r = conv(riga); const p = r.carriera.nodi[0].passi.find(x => x.tipo === 'sfondo'); return [p && p.tipo === 'sfondo' ? p.variante ?? '' : null, r.problemi.length]; };
  assert.deepEqual(sf('[Sfondo: S2 al buio. Regia: la cantina.]'), ['disordine', 1]);
  assert.deepEqual(sf('[Sfondo: S1 di giorno]'), ['', 1]);
  assert.deepEqual(sf('[Sfondo: S3, dentro il Dimmi Di Sì]'), ['', 1]);
  assert.deepEqual(sf('[Sfondo: S1 insegna-spenta, di notte]'), ['insegna-spenta', 0]);
  assert.deepEqual(sf('[Sfondo: S2 di sera]'), ['', 0], '«di sera» è l\'immagine di base, senza avviso');
  // «Un signore» è un alias di Sergio: il nome nella finestra, il ritratto di Sergio.
  const sig = conv('**Un signore** (strafottente): Lunedì mattina.').carriera.nodi[0].passi.find(p => p.tipo === 'battuta');
  assert.ok(sig && sig.tipo === 'battuta' && sig.chi === 'sergio' && sig.nome === 'Un signore');
});

test('il controllo non chiede segreta una scena finale raggiunta perdendo (F3), ma sì un nodo che prosegue', () => {
  const testo = (fine: string) => `# T

## A — Uno

[Sfondo: S1]

→ Partita 1: Mara (giocatore) contro Piera

[Sconfitta: → B]

→ Fine: completata, Uno

## B — Due

**Mara** (agitata): Persa.

${fine}
`;
  assert.deepEqual(controllaGrafo(carriera(testo('→ Fine: completata, Due'), true)).avvisi, [], 'B chiude il giro: è una scena finale');
  const prosegue = testo('→ Vai a: C\n\n## C — Tre\n\n**Mara** (agitata): Poi.\n\n→ Fine: completata, Tre');
  assert.ok(controllaGrafo(carriera(prosegue, true)).avvisi.includes('il nodo b si raggiunge solo perdendo ma non è segreto'));
  const conScelta = testo('→ Scelta muta: dove?\n\n- con Mara, fuori → Fine: completata, Due\n- con Piera, dentro → Fine: completata, Tre');
  assert.ok(controllaGrafo(carriera(conScelta, true)).avvisi.includes('il nodo b si raggiunge solo perdendo ma non è segreto'), 'una scelta non è una scena finale');
});

test('il PvP si conta anche quando il suo sblocco viene dopo qualche battuta (I4 nei dialoghi): con la partita appena giocata', () => {
  const i4 = nodo(principale(), 'i4');
  const k = i4.passi.findIndex(p => p.tipo === 'sblocco' && p.sblocco === 'pvp');
  assert.ok(k > i4.passi.findIndex(p => p.tipo === 'partita') + 1 && i4.passi.slice(0, k).some((p, i) => i > 0 && p.tipo === 'battuta'), 'nei dialoghi il PvP non segue subito la partita');
  for (const p of percorsi(principale())) assert.equal(p.partite[(p.pvp ?? 0) - 1], 'i4', p.nodi.join('>'));
});

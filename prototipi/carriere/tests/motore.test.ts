// Stato del giro e dell'account, condizioni, avanzamento: il tutorial e la mini-carriera giocati dalle funzioni del motore.
// Con le risposte del proprietario: P2 (una battuta di ritento a turno), P3 (la sconfitta che apre un ramo porta lì da sola), P7 (finali).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {avanti, completa, entra, finali, indizio, nuovoAccount, nuovoGiro, ottieniAchievement, perdi, ritenta, salta, scegli, vinci, vista, type Evento, type Stato} from '../src/motore.ts';
import {fermate} from '../src/ui/testo.ts';
import type {Carriera} from '../src/formato.ts';
import {prova, tutorial} from './aiuto.ts';

/** Una piccola partita scritta: ogni mossa è una funzione del motore; gli eventi si accumulano. */
function partita(c: Carriera, s: Stato = nuovoGiro(c, nuovoAccount())) {
  const eventi: Evento[] = [];
  const fai = (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => { const r = f(c, s); s = r.stato; eventi.push(...r.eventi); return api; };
  const api = {
    get s() { return s; }, get v() { return vista(c, s); }, eventi,
    entra: (id: string) => fai((cc, ss) => entra(cc, ss, id)), avanti: () => fai(avanti), salta: () => fai(salta),
    scegli: (i: number) => fai((cc, ss) => scegli(cc, ss, i)), vinci: () => fai(vinci), perdi: () => fai(perdi), ritenta: () => fai(ritenta),
  };
  return api;
}

test('tutorial: un giro intero, con sconfitta, ritento, scelta muta, epilogo e ritorno alla scelta', () => {
  const c = tutorial();
  const p = partita(c);
  assert.deepEqual(p.v, {tipo: 'mappa'});
  p.entra('scena-0');
  assert.ok(p.v.tipo === 'battuta' && p.v.battuta.nome === 'Un amico');
  assert.deepEqual(p.s.giro.scena, {sfondo: 'S1', sprite: {combriccola: 'davanti-alla-porta'}});
  assert.ok(p.eventi.some(e => e.tipo === 'sfarfallio' && e.variante === 'insegna-spenta'));
  p.salta();
  assert.deepEqual(p.s.giro.prossimi, [{nodo: 'scena-1'}]);
  assert.deepEqual(p.s.giro.scena.sprite, {'bici-mara': ''}, 'la combriccola è uscita, la bici è entrata');
  p.entra('scena-1').salta();
  assert.ok(p.v.tipo === 'partita' && p.v.giocatore === 'mara');
  assert.deepEqual(p.v.tipo === 'partita' && [p.v.avversari, p.v.sblocchi], [['spazienzio'], ['starter-mara']]);
  assert.deepEqual(p.s.giro.scena.sprite, {}, 'cambiando luogo la bici resta fuori');
  p.vinci();
  assert.ok(p.eventi.some(e => e.tipo === 'sblocco' && e.sblocco === 'starter-mara'));
  p.entra('scena-2').salta().perdi();
  assert.equal(p.v.tipo, 'sconfitta');
  p.ritenta();
  assert.ok(p.v.tipo === 'ritento' && p.v.battuta.chi === 'spazienzio', 'prima sconfitta: la prima battuta di ritento');
  p.avanti();
  assert.equal(p.v.tipo, 'partita', 'una sola battuta per ritento (P2)');
  p.vinci().entra('scena-3').salta();
  assert.ok(p.v.tipo === 'scelta' && p.v.scelta.modo === 'muta' && p.v.opzioni.length === 2);
  p.scegli(0);
  assert.equal(p.s.giro.segni.tutorial_con, 'mara');
  assert.ok(p.v.tipo === 'battuta' && p.v.battuta.chi === 'spazienzio', 'reagisce chi è stato lasciato');
  p.avanti();
  assert.ok(p.v.tipo === 'partita' && p.v.partita.modo === 'ffa' && p.v.giocatore === 'mara');
  assert.deepEqual(p.v.tipo === 'partita' && p.v.avversari, ['spazienzio', 'piera']);
  p.vinci().entra('scena-4').salta();
  assert.ok(p.v.tipo === 'scelta' && p.v.scelta.modo === 'messaggio');
  p.scegli(0).entra('epilogo-del-fallimento');
  assert.ok(p.s.account.achievement.includes('amici-del-dimmi-di-si'));
  assert.deepEqual(p.s.giro.prossimi, [{nodo: 'scena-4', da: 'scelta'}]);
  p.entra('scena-4');
  assert.equal(p.v.tipo, 'scelta', 'il ritorno alla scelta salta le battute');
  p.scegli(1);
  assert.deepEqual(p.v, {tipo: 'fine', esito: 'completata', finale: {id: 'completata', titolo: 'Completata', esito: 'completata'}});
  assert.deepEqual(p.s.account.sblocchi, ['starter-mara', 'starter-spazienzio', 'carriera-principale']);
  assert.deepEqual([p.s.account.giri, p.s.account.finali], [1, ['completata']]);
});

test('ritento: a ogni sconfitta una sola battuta, a turno fra quelle scritte (P2)', () => {
  const c = tutorial();
  const p = partita(c).entra('scena-0').salta().entra('scena-1').salta();
  const chi = () => { p.perdi().ritenta(); const v = p.v; p.avanti(); return v.tipo === 'ritento' ? v.battuta.chi : '-'; };
  assert.deepEqual([chi(), chi(), chi()], ['mara', 'spazienzio', 'mara']);
  p.perdi().ritenta().salta();
  assert.equal(p.v.tipo, 'partita', 'il ritento si salta');
});

test('nuovo giro: la storia si azzera, account, rami esplorati e finali restano (D16)', () => {
  const c = prova();
  const p = partita(c).entra('nodo-a').salta().scegli(0);
  const s2 = nuovoGiro(c, p.s.account, p.s.giro);
  assert.equal(s2.giro.numero, 2);
  assert.deepEqual([s2.giro.segni, s2.giro.visti, s2.giro.prossimi, s2.giro.tentativi, s2.giro.finale], [{}, [], [{nodo: 'nodo-a'}], {}, null]);
  assert.deepEqual(s2.account.esplorati, ['nodo-a']);
});

test('prova: la sconfitta in C porta da sola al retrobottega (P3), che apre il vicolo', () => {
  const c = prova();
  const p = partita(c).entra('nodo-a').salta().scegli(1).entra('nodo-c').salta().perdi();
  assert.deepEqual(p.v, {tipo: 'mappa'}, 'niente «Ritenta»: si torna alla mappa');
  assert.ok(p.eventi.some(e => e.tipo === 'ramo'));
  assert.deepEqual(p.s.giro.prossimi, [{nodo: 'nodo-e'}]);
  assert.deepEqual(p.s.giro.persi, ['nodo-c']);
  p.entra('nodo-e').salta().entra('nodo-d');
  assert.ok(p.v.tipo === 'battuta' && p.v.battuta.espressione === 'offesa', 'Piera ce l\'ha con Spazienzio');
  p.salta();
  assert.ok(p.v.tipo === 'partita' && p.v.giocatore === 'piera');
  assert.deepEqual(p.v.tipo === 'partita' && p.v.avversari, ['spazienzio'], 'contro chi ti ha accompagnato');
  p.vinci();
  assert.ok(p.v.tipo === 'scelta' && p.v.opzioni.length === 3, 'con il retrobottega visto, compare il vicolo');
  p.scegli(1).entra('nodo-f').salta();
  assert.ok(p.eventi.some(e => e.tipo === 'achievement' && e.achievement === 'fiuto-da-segugio'));
});

test('prova: senza il retrobottega la scelta di D non mostra il vicolo; vincere in C va dritto in D', () => {
  const c = prova();
  const p = partita(c).entra('nodo-a').salta().scegli(1).entra('nodo-c').salta().vinci();
  assert.deepEqual(p.s.giro.prossimi, [{nodo: 'nodo-d'}]);
  p.entra('nodo-d').salta().vinci();
  assert.ok(p.v.tipo === 'scelta');
  assert.deepEqual(p.v.tipo === 'scelta' && p.v.opzioni.map(o => o.indice), [0, 2]);
  assert.throws(() => p.scegli(1), /opzione non disponibile/);
});

test('due finali (P7): restano sull\'account, e vederli tutti e due dà un achievement', () => {
  const c = prova();
  assert.deepEqual(finali(c).map(f => [f.id, f.titolo, f.esito]),
    [['grappino-e-tornato', 'Grappino è tornato', 'completata'], ['grappino-scappa-di-nuovo', 'Grappino scappa di nuovo', 'completata']]);
  const verso = (s: Stato | undefined, opzione: number) => partita(c, s ?? nuovoGiro(c, nuovoAccount()))
    .entra('nodo-a').salta().scegli(0).entra('nodo-b').salta().vinci().entra('nodo-d').salta().vinci().scegli(opzione);
  const g1 = verso(undefined, 2).entra('nodo-h').salta();
  assert.ok(g1.v.tipo === 'fine' && g1.v.finale.titolo === 'Grappino scappa di nuovo');
  assert.deepEqual(g1.s.account.finali, ['grappino-scappa-di-nuovo']);
  assert.deepEqual(g1.s.account.sblocchi, ['starter-piera'], 'lo sblocco obbligatorio c\'è anche su questo finale');
  const g2 = verso(nuovoGiro(c, g1.s.account, g1.s.giro), 0).entra('nodo-g').salta();
  assert.ok(g2.v.tipo === 'fine' && g2.v.finale.id === 'grappino-e-tornato');
  assert.ok(g2.eventi.some(e => e.tipo === 'achievement' && e.achievement === 'cane-che-va-cane-che-torna'));
});

test('achievement con condizione sull\'account e indizi progressivi', () => {
  const c = prova();
  const giro1 = partita(c).entra('nodo-a').salta().scegli(0).entra('nodo-b').salta().vinci().entra('nodo-d').salta().vinci().scegli(0).entra('nodo-g').salta();
  assert.equal(giro1.v.tipo, 'fine');
  const fiuto = c.achievement.find(a => a.id === 'fiuto-da-segugio')!;
  assert.equal(indizio(fiuto, nuovoGiro(c, nuovoAccount())), 'Certe sconfitte portano lontano.');
  assert.match(indizio(fiuto, giro1.s)!, /retrobottega/, 'dopo un giro completato arriva l\'indizio chiaro');
  const finali2 = c.achievement.find(a => a.id === 'cane-che-va-cane-che-torna')!;
  assert.match(indizio(finali2, giro1.s)!, /porta aperta/, 'dopo il primo finale, l\'indizio sul secondo');
  assert.ok(!giro1.s.account.achievement.includes('due-padroni'));
  const giro2 = partita(c, nuovoGiro(c, giro1.s.account, giro1.s.giro)).entra('nodo-a').salta().scegli(1).entra('nodo-c');
  assert.ok(giro2.eventi.some(e => e.tipo === 'achievement' && e.achievement === 'due-padroni'));
});

test('le azioni fuori posto sono rifiutate; un salvataggio vecchio si completa', () => {
  const c = prova();
  const s = nuovoGiro(c, nuovoAccount());
  assert.throws(() => entra(c, s, 'nodo-b'), /non è disponibile/);
  assert.throws(() => vinci(c, s), /nessuna partita/);
  const vecchio = JSON.parse(JSON.stringify(s));
  delete vecchio.giro.tentativi; delete vecchio.giro.finale; delete vecchio.account.finali;
  assert.deepEqual(completa(vecchio), s);
});

test('l\'achievement della bacheca: una volta sola, senza toccare lo stato di prima; la scena non ha più un modo di entrare', () => {
  const c = prova();
  const s = entra(c, nuovoGiro(c, nuovoAccount()), 'nodo-a').stato;
  assert.ok(!('entrate' in s.giro.scena));
  const r = ottieniAchievement(c, s, 'al-suo-posto');
  assert.ok(r.stato.account.achievement.includes('al-suo-posto') && !s.account.achievement.includes('al-suo-posto'), 'senza toccare lo stato di prima');
  assert.deepEqual(r.eventi, [{tipo: 'achievement', achievement: 'al-suo-posto'}]);
  assert.deepEqual(ottieniAchievement(c, r.stato, 'al-suo-posto').eventi, [], 'una volta sola');
});

test('le frasi di Piera si dividono dopo i puntini solo se hanno stacchi', () => {
  // Dalla Fase F i pezzi sono le fermate con lo stacco (testo.ts): dopo ogni «...» seguito da altro testo.
  const testo = 'Ma chi è... che ce l\'ha... col mio Grappino...';
  const stacchi = (con: boolean) => fermate(testo, con, [0]).filter(f => f.stacco).map(f => testo.slice(0, f.pos));
  assert.deepEqual(stacchi(true), ['Ma chi è...', 'Ma chi è... che ce l\'ha...']);
  assert.deepEqual(stacchi(false), []);
});

// Stato del giro e dell'account, condizioni, avanzamento: il tutorial e la mini-carriera giocati dalle funzioni del motore.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {avanti, entra, indizio, nuovoAccount, nuovoGiro, perdi, prendiRamo, ritenta, salta, scegli, vinci, vista, type Evento, type Stato} from '../src/motore.ts';
import {pezzi} from '../src/ui/testo.ts';
import type {Carriera} from '../src/formato.ts';
import {prova, tutorial} from './aiuto.ts';

/** Una piccola partita scritta: ogni mossa è una funzione del motore; gli eventi si accumulano. */
function partita(c: Carriera, s: Stato = nuovoGiro(c, nuovoAccount())) {
  const eventi: Evento[] = [];
  const fai = (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => { const r = f(c, s); s = r.stato; eventi.push(...r.eventi); return api; };
  const api = {
    get s() { return s; }, get v() { return vista(c, s); }, eventi,
    entra: (id: string) => fai((cc, ss) => entra(cc, ss, id)), avanti: () => fai(avanti), salta: () => fai(salta),
    scegli: (i: number) => fai((cc, ss) => scegli(cc, ss, i)), vinci: () => fai(vinci), perdi: () => fai(perdi),
    ritenta: () => fai(ritenta), ramo: () => fai(prendiRamo),
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
  assert.deepEqual(p.v, {tipo: 'sconfitta', partita: (p.v as {partita: never}).partita});
  p.ritenta();
  assert.ok(p.v.tipo === 'ritento' && p.v.battuta.chi === 'spazienzio');
  p.avanti();
  assert.ok(p.v.tipo === 'ritento' && p.v.battuta.chi === 'piera');
  p.avanti();
  assert.equal(p.v.tipo, 'partita');
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
  assert.deepEqual(p.v, {tipo: 'fine', esito: 'completata'});
  assert.deepEqual(p.s.account.sblocchi, ['starter-mara', 'starter-spazienzio', 'carriera-principale']);
  assert.equal(p.s.account.giri, 1);
});

test('nuovo giro: la storia si azzera, account e rami esplorati restano (D16)', () => {
  const c = prova();
  const p = partita(c).entra('nodo-a').salta().scegli(0);
  const s2 = nuovoGiro(c, p.s.account, p.s.giro);
  assert.equal(s2.giro.numero, 2);
  assert.deepEqual([s2.giro.segni, s2.giro.visti, s2.giro.prossimi], [{}, [], [{nodo: 'nodo-a'}]]);
  assert.deepEqual(s2.account.esplorati, ['nodo-a']);
});

test('prova: la sconfitta in C apre il retrobottega, che a sua volta apre il vicolo', () => {
  const c = prova();
  const p = partita(c).entra('nodo-a').salta().scegli(1).entra('nodo-c').salta().perdi();
  assert.ok(p.v.tipo === 'sconfitta' && p.v.ramo && 'nodo' in p.v.ramo && p.v.ramo.nodo === 'nodo-e');
  p.ramo();
  assert.deepEqual(p.s.giro.prossimi, [{nodo: 'nodo-e'}]);
  assert.deepEqual(p.s.giro.persi, ['nodo-c']);
  p.entra('nodo-e').salta().entra('nodo-d');
  assert.ok(p.v.tipo === 'battuta' && p.v.battuta.espressione === 'offesa', 'Piera ce l\'ha con Spazienzio');
  p.salta();
  assert.ok(p.v.tipo === 'partita' && p.v.giocatore === 'piera');
  assert.deepEqual(p.v.tipo === 'partita' && p.v.avversari, ['spazienzio'], 'contro chi ti ha accompagnato');
  p.vinci();
  assert.ok(p.v.tipo === 'scelta' && p.v.opzioni.length === 2, 'con il retrobottega visto, compare il vicolo');
  p.scegli(1).entra('nodo-f').salta();
  assert.ok(p.eventi.some(e => e.tipo === 'achievement' && e.achievement === 'fiuto-da-segugio'));
});

test('prova: senza il retrobottega la scelta di D ha una sola opzione; vincere in C va dritto in D', () => {
  const c = prova();
  const p = partita(c).entra('nodo-a').salta().scegli(1).entra('nodo-c').salta().perdi().ritenta().salta();
  assert.equal(p.v.tipo, 'partita', 'saltare il ritento porta alla partita');
  p.vinci();
  assert.deepEqual(p.s.giro.prossimi, [{nodo: 'nodo-d'}]);
  p.entra('nodo-d').salta().vinci();
  assert.ok(p.v.tipo === 'scelta' && p.v.opzioni.length === 1 && p.v.opzioni[0].indice === 0);
  assert.throws(() => p.scegli(1), /opzione non disponibile/);
});

test('achievement con condizione sull\'account e indizi progressivi', () => {
  const c = prova();
  const giro1 = partita(c).entra('nodo-a').salta().scegli(0).entra('nodo-b').salta().vinci().entra('nodo-d').salta().vinci().scegli(0).entra('nodo-g').salta();
  assert.deepEqual(giro1.v, {tipo: 'fine', esito: 'completata'});
  const fiuto = c.achievement.find(a => a.id === 'fiuto-da-segugio')!;
  assert.equal(indizio(fiuto, nuovoGiro(c, nuovoAccount())), 'Certe sconfitte portano lontano.');
  assert.match(indizio(fiuto, giro1.s)!, /retrobottega/, 'dopo un giro completato arriva l\'indizio chiaro');
  assert.ok(!giro1.s.account.achievement.includes('due-padroni'));
  const giro2 = partita(c, nuovoGiro(c, giro1.s.account, giro1.s.giro)).entra('nodo-a').salta().scegli(1).entra('nodo-c');
  assert.ok(giro2.eventi.some(e => e.tipo === 'achievement' && e.achievement === 'due-padroni'));
});

test('le azioni fuori posto sono rifiutate', () => {
  const c = prova();
  const s = nuovoGiro(c, nuovoAccount());
  assert.throws(() => entra(c, s, 'nodo-b'), /non è disponibile/);
  assert.throws(() => vinci(c, s), /nessuna partita/);
  assert.throws(() => prendiRamo(c, partita(c).entra('nodo-a').salta().scegli(0).entra('nodo-b').salta().perdi().s), /non apre un ramo/);
});

test('le frasi di Piera si dividono dopo i puntini solo se hanno stacchi', () => {
  assert.deepEqual(pezzi('Ma chi è... che ce l\'ha... col mio Grappino...', true), ['Ma chi è...', 'che ce l\'ha...', 'col mio Grappino...']);
  assert.deepEqual(pezzi('Ma chi è... che ce l\'ha...', false), ['Ma chi è... che ce l\'ha...']);
});

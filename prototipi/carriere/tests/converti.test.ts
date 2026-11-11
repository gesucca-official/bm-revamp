// CA-0a: prove del convertitore (abbozzo della Fase A, completato in Fase B).
// node --experimental-strip-types --test prototipi/carriere/tests/*.test.ts (dalla radice del repository)
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {converti, leggiCondizione} from '../src/converti.ts';
import type {Cast, Nodo, Passo} from '../src/formato.ts';

const leggi = (p: string) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const cast = JSON.parse(leggi('../dati/cast.json')) as Cast;
const tutorial = leggi('../../../docs/design/carriere/tutorial-dialoghi.md');
const prova = leggi('../storie/prova.md');
const errori = (md: string) => converti(md, cast, 'prova').problemi.filter(p => p.livello === 'errore').map(p => p.messaggio);
const passi = (n: Nodo, tipo: Passo['tipo']) => n.passi.filter(p => p.tipo === tipo);

test('le forme a parole di prima delle integrazioni (P1) restano errori chiari', () => {
  const vecchio = tutorial
    .replace('→ Partita 3: {tutorial_con} (giocatore) contro gli altri fra Mara, Spazienzio e Piera', '→ Partita 3: tutti contro tutti a tre, col personaggio scelto')
    .replace('→ Scelta muta: con Mara [Segno: tutorial_con = mara] · con Spazienzio [Segno: tutorial_con = spazienzio]', '→ Scelta muta: con Mara · con Spazienzio')
    .replace('→ Epilogo del fallimento — il giocatore', '→ il giocatore')
    .replace('→ Fine: completata [Sblocca: carriera-principale] — il giocatore', '→ il giocatore')
    .replace('→ Torna a: Scena 4, scelta\n', '');
  const e = errori(vecchio);
  for (const atteso of [/partita non riconosciuta: «Partita 3/, /segno mai assegnato: tutorial_con/, /destinazione sconosciuta: «il giocatore raggiunge/,
    /destinazione sconosciuta: «il giocatore resta/, /Epilogo del fallimento» non ha uscita/]) assert.ok(e.some(m => atteso.test(m)), `manca ${atteso}`);
});

test('il tutorial, con le integrazioni ora nel testo (P1), è un grafo valido', () => {
  const {carriera, problemi} = converti(tutorial, cast, 'tutorial');
  assert.deepEqual(problemi.filter(p => p.livello === 'errore'), []);
  assert.deepEqual(carriera.nodi.map(n => n.id), ['scena-0', 'scena-1', 'scena-2', 'scena-3', 'scena-4', 'epilogo-del-fallimento']);
  assert.equal(carriera.nodi.flatMap(n => passi(n, 'battuta')).length, 44);
  const [s0, s1, , s3, s4, epi] = carriera.nodi;
  assert.deepEqual(passi(s0, 'battuta')[0], {tipo: 'battuta', chi: 'combriccola', nome: 'Un amico', testo: '...ma siamo sicuri che il posto sia questo?', riga: 27});
  const p1 = passi(s1, 'partita')[0];
  assert.ok(p1.tipo === 'partita');
  assert.deepEqual([p1.id, p1.modo, p1.giocatore, p1.avversari, p1.ritento?.map(b => b.chi)],
    ['partita-1', 'duello', {personaggio: 'mara'}, [{personaggio: 'spazienzio'}], ['mara', 'spazienzio']]);
  assert.deepEqual(s1.passi.at(-1), {tipo: 'sblocco', sblocco: 'starter-mara', riga: 79});
  const p3 = passi(s3, 'partita')[0];
  assert.ok(p3.tipo === 'partita' && p3.modo === 'ffa' && 'segno' in p3.giocatore && p3.giocatore.segno === 'tutorial_con');
  assert.ok(passi(s3, 'sfondo').some(p => p.tipo === 'sfondo' && p.variante === 'disordine'));
  assert.deepEqual(s4.uscita, {scelta: true});
  assert.deepEqual(epi.uscita, {verso: {nodo: 'scena-4', da: 'scelta'}});
  const piera = passi(carriera.nodi[2], 'battuta').find(b => b.tipo === 'battuta' && b.chi === 'piera');
  assert.ok(piera?.tipo === 'battuta' && piera.interrotta && piera.stacchi?.length === 2);
});

test('la mini-carriera di prova è valida e ha i pezzi che deve dimostrare', () => {
  const {carriera, problemi} = converti(prova, cast, 'prova');
  assert.deepEqual(problemi, []);
  const n = Object.fromEntries(carriera.nodi.map(x => [x.id, x]));
  assert.equal(carriera.nodi.length, 8);
  assert.equal(n['nodo-f'].segreto, true);
  const c2 = passi(n['nodo-c'], 'partita')[0];
  assert.ok(c2.tipo === 'partita' && c2.sconfitta && 'nodo' in c2.sconfitta && c2.sconfitta.nodo === 'nodo-e');
  const scelta = passi(n['nodo-d'], 'scelta')[0];
  assert.ok(scelta.tipo === 'scelta' && scelta.opzioni[1].se && 'visto' in scelta.opzioni[1].se && scelta.opzioni[1].se.visto === 'nodo-e');
  assert.deepEqual(carriera.obbligatori, ['starter-piera']);
  assert.equal(carriera.achievement.find(a => a.id === 'fiuto-da-segugio')?.nascosto, true);
});

test('uno sblocco obbligatorio tolto da un percorso è un errore', () => {
  const rotto = prova.replace('[Sblocca: starter-piera]\n', '').replace('→ Vai a: Nodo D\n\n## Nodo C', '[Sblocca: starter-piera]\n\n→ Vai a: Nodo D\n\n## Nodo C');
  assert.ok(errori(rotto).includes('sblocco obbligatorio non presente su ogni percorso: starter-piera'));
});

test('uno sblocco dato solo dopo la vittoria non conta sull\'arco della sconfitta', () => {
  // Se lo sblocco obbligatorio stesse in C dopo la partita, il ramo della sconfitta (C → E) lo salterebbe.
  const rotto = prova.replace('[Sblocca: starter-piera]\n', '').replace('[Sconfitta: → Nodo E]', '[Sconfitta: → Nodo E]\n\n[Sblocca: starter-piera]')
    .replace('→ Vai a: Nodo D\n\n## Nodo C', '[Sblocca: starter-piera]\n\n→ Vai a: Nodo D\n\n## Nodo C');
  assert.ok(errori(rotto).includes('sblocco obbligatorio non presente su ogni percorso: starter-piera'));
});

test('nodi irraggiungibili, vicoli ciechi, espressioni e comandi sconosciuti', () => {
  assert.ok(errori(prova.replace('- con Spazienzio [Segno: alleato = spazienzio] → Nodo C', '')).some(m => m.startsWith('nodo non raggiungibile: nodo-c')));
  assert.ok(errori(prova.replace('→ Vai a: Nodo G', '→ Vai a: Nodo F')).includes('vicolo cieco: da nodo-f non si arriva a nessuna fine'));
  assert.ok(errori(prova.replace('**Mara** (agitata): Ma che dici?', '**Mara** (annoiata): Ma che dici?')).some(m => m.includes('espressione sconosciuta per Mara')));
  assert.ok(errori(prova.replace('[Entra: bici-mara]', '[Entra: bici-mara] [Zoom]')).some(m => m.startsWith('comando sconosciuto: [Zoom]')));
  assert.ok(errori(prova.replace('[Se segno alleato = mara] **Mara**', '[Se segno alleato = piera] **Mara**')).includes('il segno alleato non vale mai «piera»'));
});

test('condizioni: «o» lega meno di «e», «non» vale per un atomo', () => {
  const no = () => assert.fail('errore inatteso');
  assert.deepEqual(leggiCondizione('segno a = x e visto Nodo B o non achievement Fiuto', 1, no),
    {uno: [{tutti: [{segno: 'a', uguale: 'x'}, {visto: 'Nodo B'}]}, {non: {achievement: 'fiuto'}}]});
  assert.deepEqual(leggiCondizione('giri 2', 1, no), {giri: 2});
  let msg = '';
  leggiCondizione('quando piove', 1, (_r, m) => { msg = m; });
  assert.match(msg, /condizione non riconosciuta/);
});

test('espressioni future (P8): previste nel cast, rifiutate finché non hanno un ritratto', () => {
  assert.ok(errori(prova.replace('**Mara** (agitata): Ma che dici?', '**Mara** (esasperata): Ma che dici?'))
    .includes('espressione prevista ma ancora senza ritratto per Mara: «esasperata» (P8)'));
  assert.ok(errori(prova.replace('[Stacchi: Mara neutra, Spazienzio quasi calmo]', '[Stacchi: Mara neutra, Spazienzio esasperato]'))
    .includes('espressione prevista ma ancora senza ritratto per Spazienzio: «esasperato» (P8)'));
});

test('fine con nome (P7): «→ Fine: completata, titolo»', () => {
  const {carriera} = converti(prova, cast, 'prova');
  const h = carriera.nodi.find(n => n.id === 'nodo-h')!;
  assert.deepEqual(h.uscita, {verso: {fine: 'completata', finale: 'Grappino scappa di nuovo'}});
  assert.ok(errori(prova.replace('[Quando: finale Grappino è tornato e', '[Quando: finale Grappino in vacanza e'))
    .includes('finale sconosciuto nella condizione: grappino-in-vacanza'));
});

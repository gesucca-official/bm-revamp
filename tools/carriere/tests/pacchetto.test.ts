// CA-0d: pacchetti, impronte e controllo delle versioni (src/pacchetto.ts, src/pacchetti.ts), tutto in memoria.
import test from 'node:test';
import assert from 'node:assert/strict';
import {cast, mdProva} from './aiuto.ts';
import {converti} from '../src/converti.ts';
import {costruisciPacchetto, impronte, serializza} from '../src/pacchetto.ts';
import {esaminaPacchetti, type Fonti} from '../src/pacchetti.ts';
import type {Cast} from '../src/formato.ts';

const clona = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const pacchettoDi = (md: string, c: Cast = cast, versione = 1) => costruisciPacchetto(md, converti(md, c, 'prova.md').carriera, c, versione);

/** Fonti in memoria: una carriera «prova» e i pacchetti committati (all'inizio quelli che si generano oggi). */
function fonti(md = mdProva, c: Cast = cast, versione = 1, committati: Record<string, string> = {}): Fonti {
  return {manifest: {prova: {storia: 'prova.md', versione}}, cast: c, storia: () => md,
    pacchetto: id => committati[id], pacchetti: () => Object.keys(committati)};
}
const committato = (md = mdProva, c: Cast = cast, versione = 1) => ({prova: serializza(pacchettoDi(md, c, versione))});

test('il pacchetto ha la sua intestazione e il testo è deterministico (LF, a capo finale)', () => {
  const p = pacchettoDi(mdProva);
  assert.deepEqual(Object.keys(p), ['pacchetto', 'formato', 'id', 'versione', 'impronte', 'carriera']);
  assert.equal(p.formato, '0.1'); assert.equal(p.carriera.formato, '0.1'); assert.equal(p.id, 'prova'); assert.equal(p.versione, 1);
  assert.match(p.impronte.storia, /^[0-9a-f]{64}$/);
  const t = serializza(p);
  assert.equal(t, serializza(pacchettoDi(mdProva)));
  assert.ok(t.endsWith('}\n') && !t.includes('\r'));
});

test('CRLF e LF (e il BOM) danno la stessa impronta della storia e lo stesso pacchetto', () => {
  const crlf = '﻿' + mdProva.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  assert.equal(pacchettoDi(crlf).impronte.storia, pacchettoDi(mdProva).impronte.storia);
  assert.equal(serializza(pacchettoDi(crlf)), serializza(pacchettoDi(mdProva)));
});

test('una modifica alla storia senza alzare la versione è un errore, con la versione alzata no', () => {
  assert.deepEqual(esaminaPacchetti(fonti(mdProva, cast, 1, committato())).errori, []);
  const modificata = mdProva.replace(/\*\*(\w+)\*\* \((\w+)\): /, (m) => m + 'Una parola in più. ');
  assert.notEqual(modificata, mdProva);
  const senza = esaminaPacchetti(fonti(modificata, cast, 1, committato()));
  assert.match(senza.errori.join('\n'), /cambiato la storia senza alzare la versione/);
  assert.deepEqual(senza.scritture, {}, 'e non scrive niente');
  const con = esaminaPacchetti(fonti(modificata, cast, 2, committato()), false);
  assert.deepEqual(con.errori, []);
  assert.equal(JSON.parse(con.scritture.prova).versione, 2);
  // alzata la versione ma pacchetto non rigenerato: fuori data
  assert.match(esaminaPacchetti(fonti(modificata, cast, 2, committato())).errori.join('\n'), /non è quello che si genera oggi/);
});

test('un cambio di bocca, animazione o velocità non cambia l\'impronta del cast; un\'espressione usata sì', () => {
  const base = impronte(mdProva, converti(mdProva, cast, 'prova.md').carriera, cast);
  const c = clona(cast);
  for (const p of Object.values(c.personaggi)) { p.velocita = 9; p.bocca = {u: 0.1, v: 0.1, ru: 0.1, rv: 0.1}; p.animazione = {modo: 'movimento'}; p.tempoAnimazioni = 3; }
  for (const s of Object.values(c.sprite)) { s.x = 0.99; s.altezza = 0.1; }
  assert.deepEqual(impronte(mdProva, converti(mdProva, c, 'prova.md').carriera, c), base);
  assert.deepEqual(esaminaPacchetti(fonti(mdProva, c, 1, committato())).errori, [], 'il pacchetto committato resta valido');

  // un'espressione in più per un personaggio che la storia usa: l'impronta cambia
  const carr = converti(mdProva, cast, 'prova.md').carriera;
  const usato = carr.nodi.flatMap(n => n.passi).find(p => p.tipo === 'battuta' && p.espressione)!;
  if (usato.tipo !== 'battuta') throw new Error('attesa una battuta');
  const e = clona(cast); e.personaggi[usato.chi].espressioni = [...e.personaggi[usato.chi].espressioni!, 'nuovissima'];
  assert.notEqual(impronte(mdProva, carr, e).cast, base.cast);
  assert.match(esaminaPacchetti(fonti(mdProva, e, 1, committato())).errori.join(' '), /cambiato il cast che usa senza alzare la versione/);
  // un personaggio che la carriera non usa non cambia niente
  const inutile = Object.keys(cast.personaggi).find(n => !JSON.stringify(carr).includes(`"${n}"`));
  if (inutile) { const u = clona(cast); u.personaggi[inutile].espressioni = ['x']; assert.equal(impronte(mdProva, carr, u).cast, base.cast); }
});

test('pacchetti mancanti, in più o con id diverso dal manifest sono errori', () => {
  assert.match(esaminaPacchetti(fonti()).errori.join('\n'), /manca il pacchetto/);
  assert.match(esaminaPacchetti(fonti(mdProva, cast, 1, {...committato(), vecchia: '{}'})).errori.join('\n'), /vecchia: pacchetto senza voce nel manifest/);
  const f = fonti(); f.manifest = {altra: {storia: 'prova.md', versione: 1}};
  assert.match(esaminaPacchetti(f).errori.join('\n'), /il manifest la chiama «altra»/);
  assert.match(esaminaPacchetti(fonti(mdProva, cast, 0)).errori.join('\n'), /versione del manifest non valida/);
});

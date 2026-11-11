// Secondo giro della Fase C: ogni font dei dialoghi deve avere tutti i caratteri delle storie, accentate italiane comprese, e League Gothic
// tutti quelli della bacheca; ogni font ha la sua licenza OFL accanto.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {caratteriDelFont} from './cmap.ts';
import {CARATTERI} from '../src/ui/font.ts';
import {componi, statoBozzetto} from '../src/bacheca.ts';
import {prova, tutorial} from './aiuto.ts';
import type {Carriera} from '../src/formato.ts';

const qui = new URL('../', import.meta.url);
/** Tutto il testo che il lettore mostra nei dialoghi: battute, nomi, narrazioni, messaggi, opzioni. */
function testiDialogo(c: Carriera): string {
  const out: string[] = [];
  for (const n of c.nodi) for (const p of n.passi) {
    if (p.tipo === 'battuta') out.push(p.testo, p.nome ?? '');
    if (p.tipo === 'narrazione' || p.tipo === 'messaggio') out.push(p.testo);
    if (p.tipo === 'partita') for (const b of p.ritento ?? []) out.push(b.testo);
    if (p.tipo === 'scelta') for (const o of p.opzioni) out.push(o.etichetta);
  }
  return out.join(' ') + ' Mara Spazienzio Piera La combriccola àèéìòùÀÈÉÌÒÙ «»’…';
}

test('ogni font dei dialoghi ha tutti i caratteri delle storie, accentate comprese, e la sua licenza', () => {
  const usati = [...new Set([...testiDialogo(tutorial()) + testiDialogo(prova())])].filter(c => c.trim());
  assert.equal(CARATTERI.length, 8);
  for (const f of CARATTERI) {
    const set = caratteriDelFont(new URL(f.file, qui));
    const mancano = usati.filter(c => !set.has(c.codePointAt(0)!));
    assert.deepEqual(mancano, [], `${f.nome}: mancano ${mancano.join(' ')}`);
    assert.match(fs.readFileSync(new URL(f.file.replace(/[^/]+$/, 'OFL.txt'), qui), 'utf8'), /SIL Open Font License, Version 1\.1/);
  }
});

test('League Gothic ha tutte le lettere della bacheca', () => {
  const c = prova();
  const {stato, ultimo} = statoBozzetto(c);
  const comp = componi(c, stato, ultimo, "Serraglio — carriera: Dov'è Grappino?");
  const lettere = [...comp.testata, ...comp.sottotitolo, ...comp.titoloFinali, ...comp.punti.flatMap(x => x.titolo.flat())].map(l => l.c).filter(ch => ch.trim());
  const set = caratteriDelFont(new URL('font/leaguegothic/LeagueGothic-Variabile.ttf', qui));
  assert.deepEqual([...new Set(lettere.filter(ch => !set.has(ch.codePointAt(0)!)))], []);
});

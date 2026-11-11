// Controllo del grafo (esplorazione degli stati), controllo di validità e stati della mappa.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {controllaGrafo} from '../src/grafo.ts';
import {valida} from '../src/valida.ts';
import {disposizione, statiMappa} from '../src/mappa.ts';
import {entra, nuovoAccount, nuovoGiro, salta, scegli} from '../src/motore.ts';
import {carriera, cast, mdProva, prova, tutorial} from './aiuto.ts';

const errori = (md: string, tetto?: number) => controllaGrafo(carriera(md, true), tetto).errori;

test('tutorial e prova passano il controllo del grafo', () => {
  for (const c of [tutorial(), prova()]) {
    const r = controllaGrafo(c);
    assert.deepEqual([r.errori, r.avvisi], [[], []], c.id);
    assert.equal(r.raggiunti.length, c.nodi.length);
  }
  assert.deepEqual(controllaGrafo(prova()).segreti, {'nodo-f': ['nodo-d']});
});

test('vicolo cieco: un ciclo senza uscita verso una fine', () => {
  assert.ok(errori(mdProva.replace('→ Fine: completata', '→ Vai a: Nodo F')).some(e => e.startsWith('vicolo cieco')));
});

test('una scelta con tutte le opzioni nascoste su qualche percorso', () => {
  const md = mdProva.replace('- con Piera → Nodo G', '- con Piera [Se segno alleato = mara] → Nodo G');
  assert.ok(errori(md).some(e => e.startsWith('scelta senza opzioni visibili al nodo nodo-d')));
});

test('uno sblocco obbligatorio che manca su un percorso', () => {
  const md = mdProva.replace('[Sblocca: starter-piera]\n', '').replace('→ Vai a: Nodo D\n\n## Nodo C', '[Sblocca: starter-piera]\n\n→ Vai a: Nodo D\n\n## Nodo C');
  assert.ok(errori(md).includes('sblocco obbligatorio non presente su ogni percorso: starter-piera'));
});

test('un nodo segreto che le condizioni rendono irraggiungibile', () => {
  // Il vicolo chiede di aver visto sia B sia E: in un giro solo non succede mai. L'abbozzo, che ignorava le condizioni, non lo vedeva.
  const md = mdProva.replace('[Se visto Nodo E] → Nodo F', '[Se visto Nodo E e visto Nodo B] → Nodo F');
  const e = errori(md);
  assert.ok(e.includes('nodo non raggiungibile: nodo-f'));
  assert.ok(e.includes('achievement senza percorso: fiuto-da-segugio'));
});

test('un achievement impossibile e un indizio che non compare mai', () => {
  const md = mdProva.replace('[Achievement: Fiuto da segugio]\n', '').replace('[Nascosto]\n', '[Nascosto]\n\n[Quando: visto Nodo B e visto Nodo C]\n')
    .replace('- Indizio, se giri 1:', '- Indizio, se visto Nodo B e visto Nodo C:');
  const r = controllaGrafo(carriera(md));
  assert.ok(r.errori.includes('achievement senza percorso: fiuto-da-segugio'));
  assert.ok(r.avvisi.includes('l\'indizio 2 di fiuto-da-segugio non può mai comparire'));
  // Due padroni chiede B e C esplorati in giri diversi: è possibile, quindi non è un errore.
  assert.ok(!r.errori.includes('achievement senza percorso: due-padroni'));
});

test('una partita contro un segno non assegnato su qualche percorso, e una battuta che non si vede mai', () => {
  const md = mdProva.replace('- con Spazienzio [Segno: alleato = spazienzio] → Nodo C', '- con Spazienzio → Nodo C')
    .replace('[Se segno alleato = mara] **Mara** (sospettosa)', '[Se segno alleato = mara e visto Nodo C] **Mara** (sospettosa)');
  const r = controllaGrafo(carriera(md, true));
  assert.ok(r.errori.includes('partita al nodo nodo-d: il segno alleato non è assegnato su qualche percorso'));
  assert.ok(r.avvisi.some(a => a.startsWith('la battuta della riga') && a.includes('nodo-g')));
});

test('il tetto agli stati', () => {
  assert.ok(errori(mdProva, 3).some(e => e.startsWith('troppi stati')));
});

test('controllo di validità: i dati convertiti passano, i dati rotti dicono dove', () => {
  for (const c of [tutorial(), prova()]) assert.deepEqual(valida(c, cast), [], c.id);
  const rompi = (f: (c: ReturnType<typeof prova>) => void) => { const c = prova(); f(c); return valida(c, cast); };
  assert.deepEqual(rompi(c => { (c as unknown as Record<string, unknown>).extra = 1; }), ['carriera.extra: campo sconosciuto']);
  assert.ok(rompi(c => { const b = c.nodi[0].passi.find(p => p.tipo === 'battuta')!; if (b.tipo === 'battuta') b.espressione = 'annoiata'; })
    .some(e => /^nodi\[0\]\.passi\[\d+\]\.espressione: espressione sconosciuta per piera: annoiata$/.test(e)));
  assert.ok(rompi(c => { c.nodi[1].uscita = {verso: {nodo: 'nodo-z'}}; }).includes('nodi[1].uscita.verso.nodo: nodo sconosciuto: nodo-z'));
  assert.ok(rompi(c => { const p = c.nodi[1].passi.find(x => x.tipo === 'partita')!; if (p.tipo === 'partita') p.modo = 'ffa'; })
    .some(e => e.endsWith('un duello ha un avversario, una FFA due o più')));
  assert.ok(rompi(c => { const s = c.nodi[0].passi.find(x => x.tipo === 'scelta')!; if (s.tipo === 'scelta') delete s.opzioni[1].verso; })
    .some(e => e.endsWith('o tutte con destinazione o nessuna')));
  assert.ok(rompi(c => { c.achievement[0].quando = {piove: true} as never; }).includes('achievement[0].quando: condizione sconosciuta: piove'));
  assert.ok(rompi(c => { c.achievement[1].indizi = []; }).includes('achievement[1].indizi: almeno un indizio (D19)'));
});

test('mappa: disposizione a colonne e stati dei nodi lungo due giri', () => {
  const c = prova();
  const {posizione} = disposizione(c);
  assert.deepEqual(Object.fromEntries(Object.entries(posizione).map(([k, p]) => [k, [p.colonna, p.riga]])),
    {'nodo-a': [0, 0], 'nodo-b': [1, 0], 'nodo-c': [1, 1], 'nodo-e': [2, 1], 'nodo-d': [3, 0], 'nodo-f': [4, 0], 'nodo-g': [5, 0]});
  let s = nuovoGiro(c, nuovoAccount());
  const stato = () => Object.fromEntries(Object.entries(statiMappa(c, s)).map(([k, v]) => [k, v.stato + (v.noto ? '' : '?')]));
  assert.deepEqual(stato(), {'nodo-a': 'disponibile?', 'nodo-b': 'aperto?', 'nodo-c': 'aperto?', 'nodo-d': 'aperto?', 'nodo-e': 'aperto?', 'nodo-f': 'nascosto?', 'nodo-g': 'aperto?'});
  s = scegli(c, salta(c, entra(c, s, 'nodo-a').stato).stato, 0).stato;
  assert.deepEqual(stato(), {'nodo-a': 'fatto', 'nodo-b': 'disponibile?', 'nodo-c': 'escluso?', 'nodo-d': 'aperto?', 'nodo-e': 'escluso?', 'nodo-f': 'nascosto?', 'nodo-g': 'aperto?'});
  // Al giro dopo, i nodi visti hanno il titolo; un segreto visto resta sulla mappa.
  s = nuovoGiro(c, {...s.account, esplorati: [...s.account.esplorati, 'nodo-f']}, s.giro);
  assert.deepEqual(stato()['nodo-a'], 'disponibile');
  assert.deepEqual(stato()['nodo-b'], 'aperto?', 'B scelto ma mai entrato: ancora «???»');
  assert.deepEqual(stato()['nodo-f'], 'aperto');
  assert.deepEqual(stato()['nodo-c'], 'aperto?');
});

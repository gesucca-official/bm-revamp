// Disposizione e stati della mappa lungo due giri.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {disposizione, statiMappa} from '../src/mappa.ts';
import {entra, nuovoAccount, nuovoGiro, salta, scegli} from '../src/motore.ts';
import {prova} from './aiuto.ts';

test('mappa: disposizione a colonne e stati dei nodi lungo due giri', () => {
  const c = prova();
  const {posizione} = disposizione(c);
  assert.deepEqual(Object.fromEntries(Object.entries(posizione).map(([k, p]) => [k, [p.colonna, p.riga]])),
    {'nodo-a': [0, 0], 'nodo-b': [1, 0], 'nodo-c': [1, 1], 'nodo-e': [2, 1], 'nodo-d': [3, 0], 'nodo-f': [4, 0], 'nodo-h': [4, 1], 'nodo-g': [5, 0],
      'fine:grappino-scappa-di-nuovo': [5, 1], 'fine:grappino-e-tornato': [6, 0]});
  let s = nuovoGiro(c, nuovoAccount());
  const stato = () => Object.fromEntries(Object.entries(statiMappa(c, s)).map(([k, v]) => [k, v.stato + (v.noto ? '' : '?')]));
  const fini = {'fine:grappino-e-tornato': 'aperto?', 'fine:grappino-scappa-di-nuovo': 'aperto?'};
  assert.deepEqual(stato(), {...fini, 'nodo-a': 'disponibile?', 'nodo-b': 'aperto?', 'nodo-c': 'aperto?', 'nodo-d': 'aperto?', 'nodo-e': 'nascosto?', 'nodo-f': 'nascosto?', 'nodo-g': 'aperto?', 'nodo-h': 'aperto?'});
  s = scegli(c, salta(c, entra(c, s, 'nodo-a').stato).stato, 0).stato;
  assert.deepEqual(stato(), {...fini, 'nodo-a': 'fatto', 'nodo-b': 'disponibile?', 'nodo-c': 'escluso?', 'nodo-d': 'aperto?', 'nodo-e': 'nascosto?', 'nodo-f': 'nascosto?', 'nodo-g': 'aperto?', 'nodo-h': 'aperto?'});
  // Al giro dopo, i nodi visti hanno il titolo; un segreto visto resta sulla mappa.
  s = nuovoGiro(c, {...s.account, esplorati: [...s.account.esplorati, 'nodo-f']}, s.giro);
  assert.deepEqual(stato()['nodo-a'], 'disponibile');
  assert.deepEqual(stato()['nodo-b'], 'aperto?', 'B scelto ma mai entrato: ancora «???»');
  assert.deepEqual(stato()['nodo-f'], 'aperto');
  assert.deepEqual(stato()['nodo-c'], 'aperto?');
  // A fine giro, il finale raggiunto è «fatto» e resta noto; l'altro è escluso e ancora «???».
  s = {...s, giro: {...s.giro, fine: 'completata', finale: 'grappino-scappa-di-nuovo', prossimi: []}, account: {...s.account, finali: ['grappino-scappa-di-nuovo']}};
  assert.deepEqual([stato()['fine:grappino-scappa-di-nuovo'], stato()['fine:grappino-e-tornato']], ['fatto', 'escluso?']);
});

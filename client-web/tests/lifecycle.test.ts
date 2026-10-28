import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {View} from '../src/contracts.ts';
import {clone} from '../src/model.ts';
import {outcome, forfeitLabel, secondsLeft, reconnecting} from '../src/lifecycle.ts';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures.json', import.meta.url), 'utf8'));
const name = (id: string) => id;
function duel(): View {
  const v = clone(fixtures.before) as View;
  v.gameId = 'g1'; v.players = {Tu: v.players.Tu, devBob: {...v.players.Bice, playerId: 'devBob'}};
  v.moveDeadlines = {}; v.reconnectDeadlines = {}; v.forfeits = {}; v.over = false; v.winner = 'NONE'; v.outcomeReason = null;
  return v;
}
const over = (winner: string, reason: string, forfeits: Record<string, string>) => Object.assign(duel(), {over: true, winner, outcomeReason: reason, forfeits});

test('K5: forfeit reasons from the wire are translated; an unknown one stays readable', () => {
  assert.equal(forfeitLabel('leave'), 'ha abbandonato');
  assert.equal(forfeitLabel('move timeout'), 'non ha mosso entro 30 secondi');
  assert.equal(forfeitLabel('reconnect timeout'), 'non è rientrato entro 30 secondi');
  assert.equal(forfeitLabel('something new'), 'forfait (something new)');
});

test('K5: move timeout of the other player is a win with the reason and who forfeited', () => {
  const o = outcome(over('Tu', 'timeout', {devBob: 'move timeout'}), 'Tu', name);
  assert.deepEqual(o, {title: 'Hai vinto', reason: 'Tempo scaduto', lines: ['devBob non ha mosso entro 30 secondi']});
});

test('K5: own move timeout and own late rejoin are losses that say why', () => {
  assert.deepEqual(outcome(over('devBob', 'timeout', {Tu: 'move timeout'}), 'Tu', name).lines, ['Non hai mosso entro 30 secondi']);
  const late = outcome(over('devBob', 'timeout', {Tu: 'reconnect timeout'}), 'Tu', name);
  assert.equal(late.title, 'Hai perso'); assert.deepEqual(late.lines, ['Non sei rientrato entro 30 secondi']);
});

test('K5: simultaneous move deadlines are a draw for both, from the server outcome', () => {
  const o = outcome(over('NONE', 'timeout', {Tu: 'move timeout', devBob: 'move timeout'}), 'Tu', name);
  assert.deepEqual(o, {title: 'Pareggio', reason: 'Tempo scaduto per tutti', lines: ['Non hai mosso entro 30 secondi', 'devBob non ha mosso entro 30 secondi']});
});

test('K5: a leave is a forfeit; combat keeps its reason without forfeit lines', () => {
  assert.deepEqual(outcome(over('Tu', 'leave', {devBob: 'leave'}), 'Tu', name), {title: 'Hai vinto', reason: 'Abbandono', lines: ['devBob ha abbandonato']});
  assert.deepEqual(outcome(over('Tu', 'combat', {}), 'Tu', name), {title: 'Hai vinto', reason: 'Rissa conclusa al tavolo', lines: []});
  assert.equal(outcome(over('Tu', 'mystery', {}), 'Tu', name).reason, 'Partita conclusa');
});

test('the clock is indicative: seconds from the view epoch, never below zero, none without a deadline', () => {
  assert.equal(secondsLeft(undefined, 1000), null);
  assert.equal(secondsLeft(31000, 1000), 30);
  assert.equal(secondsLeft(30500, 1000), 30);
  assert.equal(secondsLeft(500, 1000), 0);
});

test('a dropped opponent shows its reconnect deadline; my own entry is not listed', () => {
  const v = duel(); v.reconnectDeadlines = {devBob: 21000, Tu: 9000};
  assert.deepEqual(reconnecting(v, 'Tu', 1000), [{id: 'devBob', seconds: 20}]);
  v.over = true;
  assert.deepEqual(reconnecting(v, 'Tu', 1000), []);
});

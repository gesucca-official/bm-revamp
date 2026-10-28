import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {View} from '../src/contracts.ts';
import {clone} from '../src/model.ts';
import {playerName, queueNames} from '../src/presence.ts';
import {tableLayout, coveredItems, fan, touchRaises, overlap, inside} from '../src/readability.ts';
import {outcome} from '../src/lifecycle.ts';

// C2b-3: five-seat FFA. Pure rules only; the real five-seat table is checked by tools/verify-ffa.mjs.
const fixtures = JSON.parse(readFileSync(new URL('./fixtures.json', import.meta.url), 'utf8'));

test('K4/D9: one computer is "Computer"; several are numbered 1–4 in join order, humans keep their name', () => {
  assert.equal(playerName('ComPlayer_7', ['Tu', 'ComPlayer_7']), 'Computer', 'the 1vCom name does not change');
  const ids = ['devAlice', 'ComPlayer_912', 'devBob', 'ComPlayer_15', 'ComPlayer_3'];
  assert.deepEqual(ids.map(id => playerName(id, ids)), ['devAlice', 'Computer 1', 'devBob', 'Computer 2', 'Computer 3']);
  assert.equal(playerName('ComPlayer_7'), 'Computer', 'without the list the name is still readable');
});

test('K4/D9: the FFA queue lists humans and numbered computers in join order, me marked', () => {
  const entries = [{playerId: 'devAlice', human: true}, {playerId: 'QueuedComPlayer', human: false}, {playerId: 'QueuedComPlayer', human: false}, {playerId: 'devBob', human: true}];
  assert.deepEqual(queueNames(entries, 'devBob').map(e => e.label), ['devAlice', 'Computer 1', 'Computer 2', 'devBob (tu)']);
  assert.deepEqual(queueNames(entries.slice(0, 2), 'devAlice').map(e => e.label), ['devAlice (tu)', 'Computer']);
  assert.deepEqual(queueNames([], 'devAlice'), []);
});

const VIEWPORTS: [number, number][] = [[1366, 768], [844, 390]];
const five = ['me', 'b', 'c', 'd', 'e'];

test('K7: in the FFA every object but the last of a seat is partly covered; in the duel none is', () => {
  for (const [w, h] of VIEWPORTS) {
    const ffa = tableLayout(w, h, five, 'me', Object.fromEntries(five.map(id => [id, 3])));
    for (const s of ffa.seats) assert.deepEqual(coveredItems(s.items), [true, true, false], `${s.id} at ${w}×${h}`);
    const duel = tableLayout(w, h, ['me', 'b'], 'me', {me: 3, b: 3});
    for (const s of duel.seats) assert.deepEqual(coveredItems(s.items), [false, false, false]);
  }
});

test('K7: the first touch on a covered object raises it; a mouse (already raised by hover) or a raised object acts at once', () => {
  assert.equal(touchRaises('touch', true, false), true);
  assert.equal(touchRaises('pen', true, false), true);
  assert.equal(touchRaises('touch', true, true), false, 'second touch: the raised object is the target');
  assert.equal(touchRaises('touch', false, false), false, 'an uncovered object needs no reveal');
  assert.equal(touchRaises('mouse', true, false), false);
});

for (const [w, h] of VIEWPORTS) test(`five-seat FFA at ${w}×${h}: four covered fans of up to eight cards stay inside and clear of every seat and the hand`, () => {
  const l = tableLayout(w, h, five, 'me', Object.fromEntries(five.map(id => [id, 3])));
  const hand = {x: l.hand.center, y: l.hand.y, w: l.hand.w + 6 * l.hand.step, h: l.hand.h};
  for (const count of [1, 6, 8]) for (const s of l.seats.filter(x => !x.me)) {
    const f = fan(s.backs, s.back, count), box = f.box;
    if (count > 1) assert.ok(f.step >= s.back.w * .4, `${s.id}: ${count} backs stay countable (step ${f.step})`);
    assert.ok(inside(box, w, h), `${s.id} ${count} backs inside ${JSON.stringify(box)}`);
    assert.equal(overlap(box, hand), 0, `${s.id} fan clear of the hand`);
    for (const o of l.seats) for (const b of [o.person, ...o.items, o.board]) assert.equal(overlap(box, b), 0, `${s.id} fan (${count}) clear of ${o.id} ${JSON.stringify(b)}`);
  }
});

// A five-player view from the fixture: Tu against four opponents, two of them computers.
function ffa(): View {
  const v = clone(fixtures.before) as View;
  v.gameId = 'f1'; v.moveDeadlines = {}; v.reconnectDeadlines = {}; v.forfeits = {}; v.over = false; v.winner = 'NONE'; v.outcomeReason = null;
  return v;
}

test('P36: in the FFA a loss says who won; a draw or a win do not need it', () => {
  const v = Object.assign(ffa(), {over: true, winner: 'Nino', outcomeReason: 'combat'});
  assert.deepEqual(outcome(v, 'Tu', id => id), {title: 'Hai perso', reason: 'Rissa conclusa al tavolo', lines: ['Vince Nino']});
  assert.deepEqual(outcome(Object.assign(ffa(), {over: true, winner: 'Tu', outcomeReason: 'combat'}), 'Tu', id => id).lines, []);
  assert.deepEqual(outcome(Object.assign(ffa(), {over: true, winner: 'NONE', outcomeReason: 'combat'}), 'Tu', id => id).lines, []);
});

test('D11: own elimination in a running FFA says so, others\' forfeits are listed and the game goes on', () => {
  const v = ffa(); v.players.Tu.character.dead = true; v.forfeits = {Ada: 'leave'};
  assert.deepEqual(outcome(v, 'Tu', id => id), {title: 'Sei fuori dalla partita', reason: 'Eliminato: puoi guardare fino all’esito', lines: ['Ada ha abbandonato']});
  const f = ffa(); f.forfeits = {Tu: 'move timeout'};
  assert.deepEqual(outcome(f, 'Tu', id => id), {title: 'Sei fuori dalla partita', reason: '', lines: ['Non hai mosso entro 30 secondi']});
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {presencePage, activityLabel} from '../src/presence.ts';

const users = ['carla', 'Bob', 'alice', 'dino', 'Eva', 'fabio', 'gina'].map((userLogin, i) => ({userLogin, activity: i % 3 === 0 ? 'Playing' : i % 3 === 1 ? 'Free' : 'Queued for Q_1V1'}));

test('presence sorts by column, ignores case and orders ties by name', () => {
  assert.deepEqual(presencePage(users, {by: 'userLogin', asc: true}, 20, 0).rows.map(u => u.userLogin), ['alice', 'Bob', 'carla', 'dino', 'Eva', 'fabio', 'gina']);
  assert.deepEqual(presencePage(users, {by: 'userLogin', asc: false}, 20, 0).rows[0].userLogin, 'gina');
  const byActivity = presencePage(users, {by: 'activity', asc: true}, 20, 0).rows.map(u => activityLabel(u.activity));
  assert.deepEqual(byActivity, [...byActivity].sort((a, b) => a.localeCompare(b, 'it')));
});

test('presence pages of 5, 10, 20 with the total unchanged and the page clamped', () => {
  const sort = {by: 'userLogin' as const, asc: true};
  const first = presencePage(users, sort, 5, 0), second = presencePage(users, sort, 5, 1);
  assert.equal(first.rows.length, 5); assert.equal(second.rows.length, 2); assert.equal(first.pages, 2); assert.equal(first.total, 7);
  assert.equal(presencePage(users, sort, 5, 9).page, 1, 'a shrinking list never leaves an empty page');
  assert.equal(presencePage([], sort, 10, 3).pages, 1);
  assert.equal(presencePage(users, sort, 10, 0).rows.length, 7);
});

test('activity labels', () => {
  assert.equal(activityLabel('Free'), 'Libero'); assert.equal(activityLabel('Playing'), 'In partita'); assert.equal(activityLabel('Queued for Q_FFA'), 'In coda'); assert.equal(activityLabel('x'), 'x');
});

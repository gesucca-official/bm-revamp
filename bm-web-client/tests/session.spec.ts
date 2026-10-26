import {strict as assert} from 'assert';
import {SessionService} from '../src/app/service/session.service';
export const tests = [{name: 'session reset is repeatable and removes private data and loading state', run: () => {
  const state = new SessionService();
  state.userAccountData = {username: 'alice', email: 'private@example.invalid', role: 'USER', decks: [], collection: {characters: [], cards: []}};
  state.queued = true; state.queuedFor = 'ffa'; state.isLoadingGame = true; state.isWaitingForUserAccountData = true;
  state.reset(); state.reset();
  assert.equal(state.userAccountData.username, null); assert.equal(state.userAccountData.email, null);
  assert.equal(state.queued, false); assert.equal(state.queuedFor, null);
  assert.equal(state.isLoadingGame, false); assert.equal(state.isWaitingForUserAccountData, false);
  assert.deepEqual(state.usersConnected, []);
}}];

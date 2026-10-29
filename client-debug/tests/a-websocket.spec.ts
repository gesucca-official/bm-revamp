import {strict as assert} from 'assert';
import {SessionService} from '../src/app/service/session.service';

// Transport doubles exercise lifecycle callbacks without a browser or network.
const sockPath = require.resolve('sockjs-client');
require(sockPath);
const originalSocket = require.cache[sockPath].exports;
let socket: any;
require.cache[sockPath].exports = function(): any { socket = {closed: false, close: () => socket.closed = true}; return socket; };
const stomp = require('stompjs');
const originalOver = stomp.over;
let client: any;
stomp.over = () => client;
const WebsocketService = require('../src/app/service/websocket.service').WebsocketService;
require.cache[sockPath].exports = originalSocket;
// The imported Stomp namespace forwards this property; retain the double only during a test.

export const tests = ['logout', 'profile failure', 'old callback', 'deck rejection'].map(scenario => ({
  name: 'websocket lifecycle: ' + scenario,
  run: async () => {
    const callbacks: any = {};
    let failure: () => void;
    client = {connected: true, connect: (_h, connected, failed) => { failure = failed; connected(); },
      subscribe: (path, callback) => { callbacks[path] = callback; }, send: () => {},
      disconnect: done => { client.connected = false; done(); }};
    stomp.over = () => client;
    const state = new SessionService(); const service = new WebsocketService(state);
    let failures = 0, ready = 0;
    try {
      service.connect('alice', 'synthetic', () => ready++, () => failures++);
      if (scenario === 'profile failure') {
        callbacks['/user/queue/account/error']();
        assert.equal(service.isConnected(), false); assert.equal(state.isWaitingForUserAccountData, false);
        assert.equal(failures, 1); assert.equal(ready, 0); assert.equal(socket.closed, true);
      } else {
        callbacks['/user/queue/account/data']({body: JSON.stringify({username: 'alice'})});
        assert.equal(ready, 1);
        if (scenario === 'deck rejection') {
          callbacks['/user/queue/account/error']({body:'Invalid deck: regular card required'});
          assert.equal(service.isConnected(), true);
          assert.equal(state.isWaitingForUserAccountData, false);
          assert.equal(state.accountError, 'Invalid deck: regular card required');
          assert.equal(state.userAccountData.username, 'alice');
        }
        await service.disconnect(); await service.disconnect();
        if (scenario === 'old callback') {
          callbacks['/user/queue/account/data']({body: JSON.stringify({username: 'alice'})});
          failure();
        }
        assert.equal(service.isConnected(), false); assert.equal(state.userAccountData.username, null);
        assert.equal(failures, 0); assert.equal(socket.closed, true);
      }
    } finally { stomp.over = originalOver; }
  }
}));

for (const mode of ['quick/1vCom', 'quick/1v1', 'quick/ffa']) {
tests.push({name: mode + ' join sends once while pending and consumes one private ready', run: async () => {
  const state = new SessionService();
  const service = new WebsocketService(state);
  let sends = 0, unsubscribed = 0, readyCount = 0;
  let onReady: (event: any) => void;
  (service as any).stompClient = {
    subscribe: (destination, callback) => {
      if (mode === 'quick/ffa' && destination.endsWith('/joined')) { return {unsubscribe: () => unsubscribed++}; }
      assert.equal(destination, '/user/queue/game/' + mode + '/ready');
      onReady = callback;
      return {unsubscribe: () => unsubscribed++};
    },
    send: (destination, _headers, user) => {
      assert.equal(destination, '/app/game/' + mode + '/join');
      assert.equal(user, 'alice'); sends++;
    }
  };
  service.joinGame('alice', mode, () => readyCount++);
  service.joinGame('alice', mode, () => readyCount++);
  assert.equal(sends, 1); assert.equal(state.queued, true);
  onReady({body: 'fixture'});
  assert.equal(readyCount, 1); assert.equal(unsubscribed, mode === 'quick/ffa' ? 2 : 1); assert.equal(state.queued, false);
}});
}

tests.push({name: 'open rejection releases loading and subscriptions, retry sends selected deck', run: async () => {
  const state = new SessionService();
  const service = new WebsocketService(state);
  const callbacks: any = {}; const sends: string[] = []; let unsubscribed = 0, ready = 0;
  (service as any).stompClient = {
    subscribe: (path, callback) => { callbacks[path] = callback; return {unsubscribe: () => unsubscribed++}; },
    send: path => sends.push(path)
  };
  state.isLoadingGame = true;
  service.joinGame('alice','open/1vCom',() => ready++, {deckId:'absent'} as any);
  callbacks['/user/queue/game/open/1vCom/error']({body:'Deck unavailable. Choose a saved deck from your account and retry.'});
  assert.equal(state.queued,false); assert.equal(state.queuedFor,null); assert.equal(state.isLoadingGame,false);
  assert(state.gameJoinError.includes('Deck unavailable')); assert.equal(unsubscribed,2); assert.equal(ready,0);
  service.joinGame('alice','open/1vCom',() => ready++, {deckId:'selected'} as any);
  assert.equal(state.gameJoinError,'');
  assert.deepEqual(sends,['/app/game/open/1vCom/join/alice/absent','/app/game/open/1vCom/join/alice/selected']);
  callbacks['/user/queue/game/open/1vCom/ready']({body:'game'});
  assert.equal(ready,1); assert.equal(state.queued,false); assert.equal(unsubscribed,4);
}});

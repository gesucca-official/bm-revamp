import {strict as assert} from 'assert';
const {Client} = require('../../scripts/bm-cli.cjs');

// A broker double can lose a reply before SUBSCRIBE registration completes.
// Exercise the real command, event buffer and bounded wait without a server.
function fixture(replyOn: number, disconnect = false): any {
  const client = new Client('http://localhost', 'alice', 'synthetic', 1200);
  const requests: string[] = [];
  const destination = '/user/queue/game/match/view';
  client.stomp = {
    subscribe: () => ({}),
    send: (path: string) => {
      requests.push(path);
      if (disconnect) { client.drop(); }
      else if (requests.length === replyOn) {
        setImmediate(() => client.event(destination, JSON.stringify({gameId: 'match'})));
      }
    }
  };
  return {client, requests, destination};
}

export const tests = [
  {name: 'CLI view returns the first reply without repeating the request', run: async () => {
    const {client, requests, destination} = fixture(1);
    const result = await client.command({command: 'view', gameId: 'match'});
    assert.equal(result.destination, destination);
    assert.equal(result.data.gameId, 'match');
    assert.deepEqual(requests, ['/app/game/match/alice/view']);
  }},
  {name: 'CLI view recovers a reply lost during subscription registration', run: async () => {
    const {client, requests} = fixture(2);
    const result = await client.command({command: 'view', gameId: 'match'});
    assert.equal(result.data.gameId, 'match');
    assert.deepEqual(requests, ['/app/game/match/alice/view', '/app/game/match/alice/view']);
  }},
  {name: 'CLI view still fails when both replies are missing', run: async () => {
    const {client, requests} = fixture(0);
    await assert.rejects(client.command({command: 'view', gameId: 'match'}), /Event timeout/);
    assert.equal(requests.length, 2);
    assert.equal(client.waiters.length, 0);
  }},
  {name: 'CLI view does not repeat a request after disconnection', run: async () => {
    const {client, requests} = fixture(0, true);
    await assert.rejects(client.command({command: 'view', gameId: 'match'}), /Connection closed/);
    assert.equal(requests.length, 1);
  }}
];

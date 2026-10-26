import {strict as assert} from 'assert';
const {Client} = require('../../scripts/bm-cli.cjs');

export const tests = [
  {name: 'CLI join waits for subscription confirmation and sends exactly once', run: async () => {
    const client = new Client('http://localhost', 'alice', 'synthetic', 2000);
    const sent: string[] = [];
    let receipt: string;
    client.stomp = {
      subscribe: (_d: string, _f: any, headers: any) => {receipt = headers.receipt; return {};},
      send: (destination: string) => sent.push(destination)
    };
    const joining = client.command({command: 'join', mode: 'quick/1vCom'});
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(sent, []);
    client.receipts.get(receipt)();
    await joining;
    assert.deepEqual(sent, ['/app/game/quick/1vCom/join']);
    assert.equal(client.receipts.size, 0);
  }},
  {name: 'CLI cancels a pending subscription when disconnected', run: async () => {
    const client = new Client('http://localhost', 'alice', 'synthetic', 2000);
    const sent: string[] = [];
    client.stomp = {subscribe: () => ({}), send: (d: string) => sent.push(d)};
    const joining = client.command({command: 'join', mode: 'quick/1vCom'});
    await new Promise(resolve => setImmediate(resolve));
    client.drop();
    await assert.rejects(joining, /Connection closed/);
    assert.deepEqual(sent, []);
    assert.equal(client.receipts.size, 0);
  }},
  {name: 'CLI sends no join when subscription confirmation is missing', run: async () => {
    const client = new Client('http://localhost', 'alice', 'synthetic', 30);
    const sent: string[] = [];
    client.stomp = {subscribe: () => ({}), send: (d: string) => sent.push(d)};
    await assert.rejects(client.command({command: 'join', mode: 'quick/1vCom'}), /Subscription timeout/);
    assert.deepEqual(sent, []);
    assert.equal(client.receipts.size, 0);
  }}
];

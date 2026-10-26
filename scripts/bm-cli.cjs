'use strict';
// Uses only the transport dependencies already locked by the web client.
const {createRequire} = require('module');
const req = createRequire(require('path').resolve(__dirname, '../bm-web-client/package.json'));
const SockJS = req('sockjs-client');
const Stomp = req('stompjs/lib/stomp').Stomp;
const readline = require('readline');
const fs = require('fs');
const http = require('http');
const https = require('https');
class Client {
  constructor(url, user, password, timeout = 10000) {
    if (!Number.isFinite(timeout) || timeout <= 0) throw new Error('Invalid timeout');
    this.closed = false; this.failure = null;
    this.url = url; this.user = user; this.password = password; this.timeout = timeout;
    this.events = []; this.waiters = []; this.subs = new Map();
    this.receipts = new Map(); this.subscriptionSequence = 0;
  }
  event(destination, body) {
    let data; try { data = JSON.parse(body); } catch (_) { data = body; }
    const event = {type: 'event', destination, data};
    this.events.push(event);
    if (this.onEvent) this.onEvent(event);
    for (const wake of this.waiters.splice(0)) wake();
  }
  async connect() {
    const valid = await new Promise((resolve, reject) => {
      const u = new URL(this.url + '/rest/v1/sign-in/validate');
      const r = (u.protocol === 'https:' ? https : http).request(u, {method: 'POST', headers: {'Content-Type': 'application/json'}}, res => {
        let body = ''; res.on('data', b => body += b); res.on('end', () => resolve(res.statusCode === 200 && body === 'true'));
      });
      r.setTimeout(this.timeout, () => r.destroy(new Error('REST timeout')));
      r.on('error', () => reject(new Error('REST connection failed')));
      r.end(JSON.stringify({username: this.user, password: this.password}));
    });
    if (!valid) throw new Error('Login rejected');
    this.socket = new SockJS(this.url + '/ws/v1');
    this.stomp = Stomp.over(this.socket); this.stomp.debug = () => {};
    this.stomp.onreceipt = frame => {
      const ready = this.receipts.get(frame.headers['receipt-id']);
      if (ready) ready();
    };
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CONNECT timeout')), this.timeout);
      this.stomp.connect({login: this.user, passcode: this.password}, () => {clearTimeout(timer); resolve();}, () => {clearTimeout(timer); this.failure = new Error('STOMP connection failed'); for (const ready of this.receipts.values()) ready(this.failure); for (const wake of this.waiters.splice(0)) wake(); reject(this.failure);});
    });
    for (const d of ['/user/queue/account/data', '/user/queue/account/error', '/user/queue/illegalMove', '/user/queue/game/open/1vCom/error']) await this.subscribe(d);
  }
  subscribe(destination) {
    if (!this.subs.has(destination)) {
      const receipt = 'subscription-' + (++this.subscriptionSequence);
      const ready = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.receipts.delete(receipt); reject(new Error('Subscription timeout'));
        }, this.timeout);
        this.receipts.set(receipt, error => {
          clearTimeout(timer); this.receipts.delete(receipt);
          if (error) reject(error); else resolve();
        });
      });
      // Also support callers that subscribe now and await readiness in command().
      ready.catch(() => {});
      this.subs.set(destination, ready);
      this.stomp.subscribe(destination, frame => this.event(destination, frame.body), {receipt});
    }
    return this.subs.get(destination);
  }
  send(destination, data) {
    if (this.closed || this.failure) throw new Error("Connection closed");
    this.stomp.send(destination, {}, data === undefined ? '' : typeof data === 'string' ? data : JSON.stringify(data));
  }
  async wait(destination, after, timeout = this.timeout) {
    if (!Number.isFinite(timeout) || timeout <= 0 || !Number.isInteger(after) || after < 0) throw new Error('Invalid wait');
    const until = Date.now() + timeout;
    while (true) {
      if (this.closed || this.failure) throw new Error('Connection closed');
      const found = this.events.slice(after).find(e => e.destination === destination);
      if (found) return found;
      const remaining = until - Date.now(); if (remaining <= 0) throw new Error('Event timeout');
      await new Promise(resolve => {
        const wake = () => {clearTimeout(timer); resolve();};
        const timer = setTimeout(() => {this.waiters = this.waiters.filter(w => w !== wake); resolve();}, remaining);
        this.waiters.push(wake);
      });
    }
  }
  async read(destination, request, mark) {
    // Read requests are idempotent: recover one lost reply within the deadline.
    const until = Date.now() + this.timeout;
    this.send(request);
    try { return await this.wait(destination, mark, Math.min(1000, this.timeout)); }
    catch (error) {
      if (error.message !== 'Event timeout' || this.closed || this.failure || Date.now() >= until) throw error;
      this.send(request);
      return this.wait(destination, mark, Math.max(1, until - Date.now()));
    }
  }
  async command(c) {
    if (!c || typeof c !== 'object') throw new Error('Invalid command');
    await Promise.all(this.subs.values());
    const mark = this.events.length, u = this.user;
    switch (c.command) {
      case 'resume': {
        const d = '/user/queue/session/resume'; await this.subscribe(d);
        return this.read(d, '/app/session/resume', mark);
      }
      case 'leave-queue': case 'logout': {
        const action = c.command === 'logout' ? 'logout' : 'queue/leave';
        const d = '/user/queue/session/' + action; await this.subscribe(d);
        this.send('/app/session/' + action); return this.wait(d, mark);
      }
      case 'profile': return this.read('/user/queue/account/data', '/app/user/' + u + '/account', mark);
      case 'save': case 'delete':
        this.send('/app/user/' + u + '/deck' + (c.command === 'delete' ? '/delete' : ''), c.deck);
        return this.wait('/user/queue/account/data', mark);
      case 'join': {
        if (!['quick/1vCom', 'quick/1v1', 'quick/ffa', 'open/1vCom'].includes(c.mode)) throw new Error('Unknown mode');
        const d = (c.mode.includes('Com') || c.mode === 'quick/1v1' || c.mode === 'quick/ffa' ? '/user/queue' : '/topic') + '/game/' + c.mode + '/ready';
        await this.subscribe(d);
        if (c.mode === 'quick/ffa') await this.subscribe('/topic/game/quick/ffa/joined');
        this.send('/app/game/' + c.mode + '/join' + (c.mode === 'open/1vCom' ? '/' + u + '/' + c.deckId : ''), u);
        return {joined: c.mode};
      }
      case 'watch':
        for (const d of ['/user/queue/game/' + c.gameId + '/view', '/topic/game/' + c.gameId + '/update', '/topic/game/' + c.gameId + '/move', '/user/queue/game/' + c.gameId + '/leave']) await this.subscribe(d);
        return {watching: c.gameId};
      case 'view': {
        const d = '/user/queue/game/' + c.gameId + '/view'; await this.subscribe(d);
        return this.read(d, '/app/game/' + c.gameId + '/' + u + '/view', mark);
      }
      case 'export': {
        const d = '/user/queue/archive/' + c.gameId + '/export'; await this.subscribe(d);
        this.send('/app/archive/' + c.gameId + '/export'); return this.wait(d, mark);
      }
      case 'move': this.send('/app/game/' + c.move.gameId + '/move', c.move); return {sent: true};
      case 'leave': {
        const d = '/user/queue/game/' + c.gameId + '/leave'; await this.subscribe(d);
        this.send('/app/game/' + c.gameId + '/' + u + '/leave'); return this.wait(d, mark);
      }
      case 'start': this.send('/app/game/quick/ffa/start'); return {sent: true};
      case 'add-bot': this.send('/app/game/quick/ffa/join/com'); return {sent: true};
      case 'subscribe': await this.subscribe(c.destination); return {subscribed: c.destination};
      case 'send': this.send(c.destination, c.data); return {sent: true};
      case 'wait': return this.wait(c.destination, c.after === undefined ? 0 : c.after, c.timeout);
      default: throw new Error('Unknown command');
    }
  }
  drop() {
    this.closed = true; for (const ready of this.receipts.values()) ready(new Error('Connection closed'));
    for (const wake of this.waiters.splice(0)) wake();
    if (this.socket) this.socket.close();
  }
  async close() {
    this.closed = true; for (const ready of this.receipts.values()) ready(new Error('Connection closed')); for (const wake of this.waiters.splice(0)) wake();
    if (!this.socket) return;
    await new Promise(resolve => {
      const timer = setTimeout(resolve, 500);
      if (this.stomp && this.stomp.connected) this.stomp.disconnect(() => {clearTimeout(timer); resolve();});
      else {clearTimeout(timer); resolve();}
    });
    this.socket.close();
  }
}
async function main() {
  const output = value => process.stdout.write(JSON.stringify(value) + '\n');
  if (process.argv.includes('--help')) {
    output({usage: 'BM_USER and BM_PASSWORD required; BM_URL defaults to http://localhost:8080/api. JSONL stdin or filename argument. Commands: profile, save, delete, join, watch, view, move, export, leave, leave-queue, resume, start, add-bot, subscribe, send, wait, logout.'}); return;
  }
  if (!process.env.BM_USER || !process.env.BM_PASSWORD) throw new Error('BM_USER and BM_PASSWORD required');
  const client = new Client(process.env.BM_URL || 'http://localhost:8080/api', process.env.BM_USER, process.env.BM_PASSWORD);
  client.onEvent = output;
  let input, lines;
  try {
    await client.connect(); output({type: 'connected'});
    input = process.argv[2] ? fs.createReadStream(process.argv[2]) : process.stdin;
    input.on('error', () => { process.stderr.write('CLI input failed.\n'); process.exitCode = 1; lines.close(); });
    lines = readline.createInterface({input, crlfDelay: Infinity});
    for await (const line of lines) {
      if (!line.trim()) continue;
      let c; try { c = JSON.parse(line); } catch (_) {throw new Error('Invalid JSON command');}
      if (c && c.command === 'logout') {await client.command(c); lines.close(); if (input !== process.stdin) input.destroy(); else process.stdin.destroy(); break;}
      const result = await client.command(c); output({type: 'result', command: c.command, result});
    }
  } finally {if (lines) lines.close(); if (input) input.destroy(); await client.close();}
}
module.exports = {Client};
if (require.main === module) main().catch(() => {process.stderr.write('CLI failed: input, authentication, transport or event timeout; no credentials logged.\n'); process.exitCode = 1;});

import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type {Connector, Link} from './link.ts';

const TIMEOUT = 10000;

// Same transport as client-debug: REST validation through /rest, then SockJS /ws with CONNECT login/passcode.
// No automatic reconnection: a drop is reported once and the user decides to rejoin.
export const stompConnector: Connector = {
  async validate(username, password) {
    const response = await fetch('/rest/sign-in/validate', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username, password})});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) === true;
  },
  connect(username, password, onDrop) {
    return new Promise<Link>((resolve, reject) => {
      let open = false, closing = false, receipts = 0;
      const client = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        connectHeaders: {login: username, passcode: password},
        reconnectDelay: 0, heartbeatIncoming: 0, heartbeatOutgoing: 0,
        // stompjs debug output would include the CONNECT frame and its credentials.
        debug: () => {}
      });
      const timer = setTimeout(() => { if (!open) { closing = true; void client.deactivate(); reject(new Error('CONNECT timeout')); } }, TIMEOUT);
      const lost = () => {
        clearTimeout(timer);
        if (closing) return;
        closing = true;
        if (open) onDrop(); else { void client.deactivate(); reject(new Error('CONNECT rejected')); }
      };
      client.onStompError = lost;
      client.onWebSocketClose = lost;
      client.onConnect = () => {
        open = true; clearTimeout(timer);
        resolve({
          subscribe: (destination, handler) => new Promise((ok, fail) => {
            const receipt = `sub-${++receipts}`;
            const wait = setTimeout(() => fail(new Error(`Subscription timeout ${destination}`)), TIMEOUT);
            client.watchForReceipt(receipt, () => { clearTimeout(wait); ok(() => { try { subscription.unsubscribe(); } catch { /* transport already gone */ } }); });
            const subscription = client.subscribe(destination, message => handler(message.body), {receipt});
          }),
          send: (destination, body = '') => client.publish({destination, body}),
          close: () => { closing = true; void client.deactivate(); },
          drop: () => { (client.webSocket as {close(): void} | undefined)?.close(); }
        });
      };
      client.activate();
    });
  }
};

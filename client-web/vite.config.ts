import {defineConfig, type Plugin} from 'vite';
import type {IncomingMessage, ClientRequest} from 'node:http';
import {randomBytes} from 'node:crypto';
import os from 'node:os';

// Same rewrite as client-debug/proxy.config.json: the browser only sees /rest and /ws on loopback.
const target = process.env.BM_SERVER ?? 'http://127.0.0.1:8080';
const port = 4320;

// Physical device mode (run.ps1 -Task Physical): BM_LAN=lan, or a private IPv4, serves the preview on
// one private LAN address for a phone. The game server stays on loopback behind the proxy; every
// request, WebSocket upgrades included, needs the one-time access code printed at startup.
const privateIp = (a: string) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a);
const wanted = process.env.BM_LAN;
const lanHost = !wanted ? null : wanted === 'lan'
  ? Object.values(os.networkInterfaces()).flat().filter(a => a && a.family === 'IPv4' && !a.internal && privateIp(a.address))
    .map(a => a!.address).sort((a, b) => Number(!a.startsWith('192.168.')) - Number(!b.startsWith('192.168.')))[0] ?? null
  : wanted;
if (wanted && !(lanHost && privateIp(lanHost))) throw new Error(`Indirizzo LAN non ammesso: ${wanted}`);
const code = lanHost ? randomBytes(4).toString('hex') : null;

// The local server profile allows one STOMP origin (stomp.allowedOrigin, http://localhost:4200 for
// the debug client). Only requests coming from this client's own page are presented with that
// origin; any other origin passes through unchanged and the server keeps refusing it.
const allowedOrigin = process.env.BM_STOMP_ORIGIN ?? 'http://localhost:4200';
const ownOrigins = new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`, ...(lanHost ? [`http://${lanHost}:${port}`] : [])]);
const sameOrigin = (proxyReq: ClientRequest, req: IncomingMessage) => {
  if (ownOrigins.has(String(req.headers.origin))) proxyReq.setHeader('origin', allowedOrigin);
};
const proxy = {
  '/rest': {target, changeOrigin: true, rewrite: (path: string) => path.replace(/^\/rest/, '/api/rest/v1')},
  '/ws': {target, ws: true, changeOrigin: true, rewrite: (path: string) => path.replace(/^\/ws/, '/api/ws/v1'),
    configure: (server: {on(event: string, fn: (proxyReq: ClientRequest, req: IncomingMessage) => void): void}) => {
      server.on('proxyReq', sameOrigin); server.on('proxyReqWs', sameOrigin);
    }}
};

// /?k=<code> sets an HttpOnly cookie and redirects; without it every request gets 403.
const accessGate = (): Plugin => ({
  name: 'bm-lan-access',
  configurePreviewServer(server) {
    if (!code) return;
    const admitted = (req: IncomingMessage) => (req.headers.cookie ?? '').split(/;\s*/).includes(`bmk=${code}`);
    const seen = new Set<string>();
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://local');
      if (url.searchParams.get('k') === code) {
        res.writeHead(303, {'Set-Cookie': `bmk=${code}; HttpOnly; SameSite=Strict; Path=/`, Location: '/'}).end(); return;
      }
      if (!admitted(req)) { res.writeHead(403).end(); return; }
      const remote = req.socket.remoteAddress ?? '?';
      if (!seen.has(remote)) { seen.add(remote); console.log(`Dispositivo ammesso: ${remote}`); }
      next();
    });
    server.httpServer.once('listening', () =>
      console.log(`\n  Prova fisica: apri sul telefono http://${lanHost}:${port}/?k=${code}\n  Server di gioco su loopback: ${target}\n`));
    // The proxy registers its WebSocket upgrade handler after this hook: gate it once it exists.
    return () => {
      const handlers = server.httpServer.listeners('upgrade') as ((...a: unknown[]) => void)[];
      server.httpServer.removeAllListeners('upgrade');
      server.httpServer.on('upgrade', (req: IncomingMessage, socket: {destroy(): void}, head: unknown) => {
        if (!admitted(req)) { socket.destroy(); return; }
        for (const h of handlers) h(req, socket, head);
      });
    };
  }
});

export default defineConfig({
  // sockjs-client still reads the Node global in a few browser modules.
  define: {global: 'globalThis'},
  plugins: [accessGate()],
  // The rules are imported from docs/game-rules.md (D10, src/public.tsx): the dev server may read that one file.
  server: {host: '127.0.0.1', port, strictPort: true, proxy, fs: {allow: ['.', '../docs/game-rules.md']}},
  preview: {host: lanHost ?? '127.0.0.1', port, strictPort: true, proxy}
});

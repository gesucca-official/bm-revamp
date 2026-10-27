import {defineConfig} from 'vite';
import type {IncomingMessage, ClientRequest} from 'node:http';

// Same rewrite as client-debug/proxy.config.json: the browser only sees /rest and /ws on loopback.
const target = process.env.BM_SERVER ?? 'http://127.0.0.1:8080';
const port = 4320;
// The local server profile allows one STOMP origin (stomp.allowedOrigin, http://localhost:4200 for
// the debug client). Only requests coming from this client's own loopback page are presented with
// that origin; any other origin passes through unchanged and the server keeps refusing it.
const allowedOrigin = process.env.BM_STOMP_ORIGIN ?? 'http://localhost:4200';
const ownOrigins = new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`]);
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

export default defineConfig({
  // sockjs-client still reads the Node global in a few browser modules.
  define: {global: 'globalThis'},
  server: {host: '127.0.0.1', port, strictPort: true, proxy},
  preview: {host: '127.0.0.1', port, strictPort: true, proxy}
});

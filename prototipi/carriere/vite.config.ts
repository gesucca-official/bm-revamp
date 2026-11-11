import {defineConfig} from 'vite';
import os from 'node:os';

// CA-0a, prototipo delle carriere. Port 4330 stays clear of client-web (4320) and client-debug (4200).
const port = Number(process.env.BM_PORT ?? 4330);
// Phone task (run.ps1 -Task Phone, T5): BM_LAN=lan, or a private IPv4, serves on one private LAN address. No access code: the
// prototype has no server behind it, only its own static files and the tutorial assets already in the repository.
const privateIp = (a: string) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a);
const wanted = process.env.BM_LAN;
const lanHost = !wanted ? null : wanted === 'lan'
  ? Object.values(os.networkInterfaces()).flat().filter(a => a && a.family === 'IPv4' && !a.internal && privateIp(a.address))
    .map(a => a!.address).sort((a, b) => Number(!a.startsWith('192.168.')) - Number(!b.startsWith('192.168.')))[0] ?? null
  : wanted;
if (wanted && !(lanHost && privateIp(lanHost))) throw new Error(`Indirizzo LAN non ammesso: ${wanted}`);
if (lanHost) console.log(`\n  Dal telefono, sulla stessa rete: http://${lanHost}:${port}/\n`);

export default defineConfig({
  base: './',
  // The assets are read in place (docs/design/carriere/asset/tutorial), never copied (prototipo.md, «Come»).
  server: {host: lanHost ?? '127.0.0.1', port, strictPort: true, fs: {allow: ['.', '../../docs/design/carriere/asset/tutorial']}},
  preview: {host: '127.0.0.1', port: Number(process.env.BM_PREVIEW_PORT ?? 4331), strictPort: true}
});

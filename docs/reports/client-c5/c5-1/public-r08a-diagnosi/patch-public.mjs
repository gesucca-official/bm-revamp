// C5-1 diagnosis only: copy of client-web/tools/verify-public.mjs outside the repository with the rules index
// extended by R08a (rulebook 2.3). Nothing else changes.
import {readFileSync, writeFileSync} from 'node:fs';
const src = 'E:/bm/client-web/tools/verify-public.mjs';
const dst = process.argv[2];
let t = readFileSync(src, 'utf8');
const swaps = [
  ["from './controls-checks.mjs'", "from 'file:///E:/bm/client-web/tools/controls-checks.mjs'"],
  ["from '@playwright/test'", "from 'file:///E:/bm/client-web/node_modules/@playwright/test/index.mjs'"],
  ["resolve(import.meta.dirname,'../..')", "resolve('E:/bm/client-web/tools','../..')"],
  ["'R08','R09','Revisioni',setName]", "'R08','R08a','R09','Revisioni',setName]"],
];
for (const [a, b] of swaps) {
  const n = t.split(a).length - 1;
  if (n !== 1) throw new Error(`expected one occurrence of ${a}, found ${n}`);
  t = t.replace(a, b);
}
if (t.includes('import.meta.dirname')) throw new Error('import.meta.dirname still used');
writeFileSync(dst, t);
console.log('written', dst);

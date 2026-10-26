// Artifact smoke only: no Spring process, database, SMTP or legacy remote proxy.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');
const root = path.resolve(__dirname, '..');
const express = require(path.join(root, 'bm-web-client/node_modules/express'));
const dist = path.join(root, 'bm-web-client/dist/bm-web-client');
const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const assets = Array.from(index.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g), m => m[1]);
assert(assets.length >= 4, 'Missing initial bundles');
const app = express();
app.use(express.static(dist));
const server = app.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  try {
    for (const file of ['index.html', ...assets, 'assets/docs/rules.md']) {
      const expected = fs.readFileSync(path.join(dist, file));
      const actual = await new Promise((resolve, reject) => {
        const req = http.get({hostname: '127.0.0.1', port, path: '/' + file}, res => {
          if (res.statusCode !== 200) { res.resume(); reject(new Error(file + ': ' + res.statusCode)); return; }
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy(new Error('HTTP timeout')));
      });
      assert(actual.equals(expected), 'HTTP content mismatch: ' + file);
      console.log('PASS HTTP artifact', file, actual.length, 'bytes');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
server.on('error', error => { console.error(error); process.exitCode = 1; });

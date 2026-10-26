'use strict';
const assert = require('assert');
const {performance} = require('perf_hooks');
const start = performance.now();
const {Client} = require('./bm-cli.cjs');
const loaded = performance.now();
const idle = new Client('http://127.0.0.1:8080/api','fixture','fixture');
const idleMemory = process.memoryUsage();
const fs = require('fs');
const path = require('path');
const lockPath = path.resolve(__dirname, '../bm-web-client/package-lock.json');
const lock = require(lockPath);
const req = require('module').createRequire(path.resolve(__dirname, '../bm-web-client/package.json'));
const roots = new Map();
function packageBytes(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).filter(e => e.name !== 'node_modules').reduce((n,e) => {
    const file = path.join(dir,e.name);
    return n + (e.isDirectory() ? packageBytes(file) : e.isFile() ? fs.statSync(file).size : 0);
  },0);
}
function dependencies(name, from = req) {
  const file = from.resolve(name + '/package.json');
  if (roots.has(file)) return;
  const manifest = from(file);
  const location = path.relative(path.resolve(__dirname,'../bm-web-client/node_modules'), path.dirname(file)).replace(/\\/g,'/');
  let locked = lock;
  for (const part of location.split('/node_modules/')) locked = locked.dependencies[part];
  assert.strictEqual(manifest.version, locked.version);
  roots.set(file, {name, location, version:manifest.version, locked:locked.version,
    installedBytes:packageBytes(path.dirname(file))});
  const local = require('module').createRequire(file);
  for (const dep of Object.keys(manifest.dependencies || {})) dependencies(dep, local);
}
dependencies('sockjs-client'); dependencies('stompjs');
console.log(JSON.stringify({node:process.version, platform:process.platform, arch:process.arch,
  moduleLoadMs:loaded-start, idleMemory, dependencies:Array.from(roots.values()),
  lockSha256:require('crypto').createHash('sha256').update(fs.readFileSync(lockPath)).digest('hex')}));
assert.strictEqual(idle.socket, undefined);

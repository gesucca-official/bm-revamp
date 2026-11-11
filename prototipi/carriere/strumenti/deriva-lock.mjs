// Rigenera package-lock.json del prototipo dal lock di client-web (decisione T3 della regia, CA-0a).
// La cache npm del repository (.tools/client-c0/npm-cache) ha i pacchetti ma non i metadati del registro: `npm install --offline`
// non sa creare un lock (ENOTCACHED), mentre `npm ci --offline` con un lock già scritto funziona. Questo script prende da
// client-web/package-lock.json la chiusura delle dipendenze di package.json, con le stesse versioni e gli stessi integrity.
// Uso: node strumenti/deriva-lock.mjs (dalla cartella del prototipo). Fallisce se una dipendenza manca o ha un'altra versione.
import fs from 'node:fs';

const qui = new URL('../', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(new URL('package.json', qui), 'utf8'));
const sorgente = JSON.parse(fs.readFileSync(new URL('../../client-web/package-lock.json', qui), 'utf8')).packages;

const prese = new Map(); // percorso -> prod?
const visita = (nome, da, prod) => {
  for (let base = da; ; ) {
    const chiave = (base ? base + '/' : '') + 'node_modules/' + nome;
    if (sorgente[chiave]) {
      const gia = prese.get(chiave);
      if (gia === undefined || (prod && !gia)) {
        prese.set(chiave, prod || !!gia);
        const e = sorgente[chiave];
        for (const d of Object.keys({...e.dependencies, ...e.optionalDependencies})) visita(d, chiave, prod);
        for (const d of Object.keys(e.peerDependencies ?? {})) if (!e.peerDependenciesMeta?.[d]?.optional) visita(d, chiave, prod);
      }
      return true;
    }
    if (!base) return false;
    const i = base.lastIndexOf('/node_modules/');
    base = i < 0 ? '' : base.slice(0, i);
  }
};
for (const [deps, prod] of [[pkg.dependencies ?? {}, true], [pkg.devDependencies ?? {}, false]]) {
  for (const [nome, versione] of Object.entries(deps)) {
    if (!visita(nome, '', prod)) throw new Error(`${nome} non è nel lock di client-web`);
    const trovata = sorgente['node_modules/' + nome].version;
    if (trovata !== versione) throw new Error(`${nome}: ${versione} nel prototipo, ${trovata} in client-web`);
  }
}
const packages = {'': {name: pkg.name, version: pkg.version, dependencies: pkg.dependencies, devDependencies: pkg.devDependencies, engines: pkg.engines}};
for (const chiave of [...prese.keys()].sort()) {
  const {dev, devOptional, peer, ...e} = sorgente[chiave];
  void dev; void devOptional; void peer;
  packages[chiave] = prese.get(chiave) ? e : {...e, dev: true};
}
fs.writeFileSync(new URL('package-lock.json', qui), JSON.stringify({name: pkg.name, version: pkg.version, lockfileVersion: 3, requires: true, packages}, null, 2) + '\n');
console.log(`package-lock.json: ${prese.size} voci da client-web`);

"""SB-16i Fase B2: copy the evidence of a B2 run into this folder. Final JSON minified and gzipped (mtime 0), summaries as they are,
plus manifest.json with size and SHA-256 of every original file. Read-only on the run; launches no games.

pack.py OUT_ROOT
"""
import gzip, hashlib, json, shutil, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
GZ = {'step0': ['matrix.json', 'draft.json'],
      'round': ['matrix.json', 'observations.json', 'sb16i-observations.json', 'deck-observations.json', 'draft.json', 'matrix.md']}
PLAIN = ['round-summary.json', 'round-summary.md', 'b2-round-table.json', 'b2-round-table.md']


def main():
    root = Path(sys.argv[1])
    manifest = {}
    for run, names in GZ.items():
        for name in names:
            src = root / run / name
            raw = src.read_bytes()
            data = raw
            if name.endswith('.json'):
                data = json.dumps(json.loads(raw.decode('utf-8-sig')), ensure_ascii=False, separators=(',', ':')).encode('utf-8')
            dest = HERE / f'{run}-{name}.gz'
            dest.write_bytes(gzip.compress(data, compresslevel=9, mtime=0))
            manifest[f'{run}-{name}'] = {'originalBytes': len(raw), 'originalSha256': hashlib.sha256(raw).hexdigest()}
    for name in PLAIN:
        shutil.copyfile(root / name, HERE / name)
        manifest[name] = {'originalBytes': (root / name).stat().st_size,
                          'originalSha256': hashlib.sha256((root / name).read_bytes()).hexdigest()}
    (HERE / 'manifest.json').write_text(json.dumps(manifest, indent=1, sort_keys=True) + '\n', encoding='utf-8')
    print(json.dumps(manifest, indent=1, sort_keys=True))


if __name__ == '__main__':
    main()

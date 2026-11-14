"""SB-16g step 3 (D87): the step-0 sample before and after D86 must coincide, except the blood drain's binding.
Usage: python equivalence.py BEFORE_DIRECTORY AFTER_DIRECTORY OUTPUT_JSON
Compares matrix.json, observations.json and the draft snapshot after renaming the old binding; the draft fingerprint and the
draft source name are the only fields allowed to differ besides the binding (they hash the file that changed)."""
from pathlib import Path
import json, sys

OLD, NEW = 'junkie.ToxicBloodDrain', 'base.tossico.CeDelSangueNellaMiaDroga'
before, after, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
IGNORED = {'bozzaSha256', 'sha256', 'bozza'}


def rename(node):
    if isinstance(node, dict): return {rename(k): rename(v) for k, v in node.items()}
    if isinstance(node, list): return [rename(v) for v in node]
    if isinstance(node, str): return node.replace(OLD, NEW)
    return node


def diff(a, b, path, found):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b)):
            if k in IGNORED and path.count('/') <= 2:
                if a.get(k) != b.get(k): found['ignored'].append(path + '/' + k)
                continue
            diff(a.get(k), b.get(k), path + '/' + k, found)
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        for i, (x, y) in enumerate(zip(a, b)): diff(x, y, f'{path}[{i}]', found)
    elif a != b:
        found['differences'].append({'path': path, 'before': a, 'after': b})


report = {'old': OLD, 'new': NEW, 'files': {}}
for name in ['matrix.json', 'observations.json', 'draft.json']:
    a = rename(json.loads((before / name).read_text(encoding='utf-8')))
    b = json.loads((after / name).read_text(encoding='utf-8'))
    found = {'differences': [], 'ignored': []}
    if name == 'draft.json':
        # The travaso entry itself changes form (java class with its own parameters); everything else must be equal.
        ca = {c['binding']: c for c in a['cards']}; cb = {c['binding']: c for c in b['cards']}
        travaso_a, travaso_b = ca.pop(NEW), cb.pop(NEW)
        a = dict(a, cards=sorted(ca.values(), key=lambda c: c['binding'])); b = dict(b, cards=sorted(cb.values(), key=lambda c: c['binding']))
        report['travaso'] = {'before': travaso_a, 'after': travaso_b}
    diff(a, b, name, found)
    report['files'][name] = {'identical': not found['differences'], 'differences': found['differences'][:20],
                             'ignoredFields': found['ignored']}
report['equivalent'] = all(f['identical'] for f in report['files'].values())
out.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
print('equivalent:', report['equivalent'], {k: len(v['differences']) for k, v in report['files'].items()})

"""SB-16g correction 1.5 (D90): identity gate on the six matchups without Spazienzio or Beppe.
Usage: python identity.py REFERENCE_DIRECTORY NEW_DIRECTORY OUTPUT_JSON
Compares, field by field, every cell (matchup x style x style, seats alternated) and the matchup totals of matrix.json for the six
matchups among Mara, Celestina and Piera. A cell holds wins per seat, draws, limit hits and the turn distribution of its games
(total, median, p10, p90, min, max): with the same seeds any different game shows up there. Exit code 1 on any difference."""
from pathlib import Path
import json, sys

KEPT = {'starter-mara', 'starter-tossico', 'starter-pino'}
ref_dir, new_dir, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
ref = json.loads((ref_dir / 'matrix.json').read_text(encoding='utf-8'))
new = json.loads((new_dir / 'matrix.json').read_text(encoding='utf-8'))


def key(c): return (c['A'], c.get('stileA'), c['B'], c.get('stileB'))


def kept(c): return c['A'] in KEPT and c['B'] in KEPT


report = {'reference': str(ref_dir), 'new': str(new_dir), 'differences': [], 'header': {}}
for k in sorted(set(ref['intestazione']) | set(new['intestazione'])):
    a, b = ref['intestazione'].get(k), new['intestazione'].get(k)
    if a != b and k not in ('turniDiGiocatore',): report['header'][k] = {'reference': a, 'new': b}
for part in ('celle', 'coppie'):
    r = {key(c): c for c in ref[part] if kept(c)}
    n = {key(c): c for c in new[part] if kept(c)}
    report[part] = {'reference': len(r), 'new': len(n), 'identical': sum(1 for k in r if n.get(k) == r[k])}
    for k in sorted(set(r) | set(n)):
        if r.get(k) != n.get(k): report['differences'].append({'part': part, 'key': list(k), 'reference': r.get(k), 'new': n.get(k)})
    games = sum(c['partite'] for c in n.values())
    report[part]['games'] = games
report['identical'] = not report['differences']
out.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
print(json.dumps({k: v for k, v in report.items() if k != 'differences'}, ensure_ascii=False), len(report['differences']), 'differences')
sys.exit(0 if report['identical'] else 1)

"""SB-16i Fase B2 (D99): read-only comparison of a B2 run with the Phase B round. It launches no games.

check OUT_ROOT RUN            the 10 pairs without Mara: every cell of OUT_ROOT/RUN/matrix.json identical to the Phase B round
                              (sb-16i/round-matrix.json.gz); prints the result, exit 1 if not identical (STOP 3)
table OUT_ROOT RUN DEST       the 15 pairs on heuristic bots only (D93): share / draws / turns for RUN (1.6b or its fix),
                              the 1.6 (Phase B round) and the 1.5 (recalculation), the D95 gaps and the rule of section 4
                              of the A2 proposal; writes DEST.json and DEST.md
"""
import gzip, importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('sb16i', HERE.parent / 'sb-16i-analyze.py')
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)
PHASE_B = HERE.parent / 'sb-16i' / 'round-matrix.json.gz'
MARA = 'starter-mara'


def signed(x):
    return f'{x:+.2f}'.replace('.', ',')


def cells(matrix, keep):
    return {(c['A'], c['stileA'], c['B'], c['stileB']): c for c in matrix['celle'] if keep(c)}


def check(root, run):
    now = A.read(root / run / 'matrix.json')
    ref = A.read(PHASE_B)
    no_mara = lambda c: MARA not in (c['A'], c['B'])
    a, b = cells(now, no_mara), cells(ref, no_mara)
    diff = [k for k in sorted(set(a) | set(b)) if a.get(k) != b.get(k)]
    pairs = sorted({(k[0], k[2]) for k in b})
    result = {'run': run, 'pairsWithoutMara': len(pairs), 'cellsCompared': len(b), 'cellsNow': len(a),
              'cellsDifferent': len(diff), 'identical': not diff and len(a) == len(b), 'firstDifferences': [list(k) for k in diff[:5]]}
    print(json.dumps(result, indent=1))
    return result


def mara_side(a, b, share):
    """Share from Mara's side for a non-mirror Mara pair, else None."""
    if a == b or MARA not in (a, b): return None
    return share if a == MARA else 100 - share


def rule(rows):
    """Section 4 of the A2 proposal, lever A, decided on the round."""
    low = [r for r in rows if r['maraShare'] is not None and r['maraShare'] < 35]
    high = [r for r in rows if r['maraShare'] is not None and r['maraShare'] > 65]
    sm = next(r for r in rows if (r['A'], r['B']) == ('starter-spazienzio', MARA))['heur']['share']
    mp = next(r for r in rows if (r['A'], r['B']) == (MARA, 'starter-pino'))['heur']['share']
    names = lambda rs: [f"{A.NAMES[r['A']]}–{A.NAMES[r['B']]}" for r in rs]
    out = {'maraLow': names(low), 'maraHigh': names(high), 'spazienzioMara': sm, 'maraPiera': mp}
    if low and high: out.update(row='fuori nei due sensi', fix=None)
    elif (sm < 35 or mp > 65) and not low: out.update(row='Mara ancora forte', fix='Sgommata x0,8 -> x0,9')
    elif low and not high: out.update(row='Mara troppo debole', fix='Sorpasso +4 -> +8 A')
    elif not low and not high: out.update(row='tutti dentro', fix=None)
    else: out.update(row='non previsto dalla regola', fix=None)
    return out


def table(root, run, dest):
    now = A.pairs(A.read(root / run / 'matrix.json'))
    b16 = A.pairs(A.read(PHASE_B))
    rows = []
    for (a, b), (q15, d15, t15, _) in A.FORECAST.items():
        h = now[(a, b)]['heur']
        rows.append({'A': a, 'B': b, 'heur': h, 'v16': b16[(a, b)]['heur'], 'v15': {'share': q15, 'draws': d15, 'turns': t15},
                     'gaps': A.minimum(a, b, h), 'gaps16': A.minimum(a, b, b16[(a, b)]['heur']),
                     'maraShare': mara_side(a, b, h['share'])})
    decision = rule(rows)
    out = {'run': run, 'benchSeconds': float((root / run / 'seconds.txt').read_text()), 'pairs': rows,
           'outside': [{'A': r['A'], 'B': r['B'], 'gaps': r['gaps']} for r in rows if r['gaps']], 'rule': decision}
    Path(str(dest) + '.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    gap = lambda g: ', '.join(f'{k} {A.num(x)}' for k, x in g.items()) or '—'
    md = [f'# SB-16i B2: {run}', '', 'Soli euristici (D93): quota del primo nominato sulle decisive, patte e turni su tutte le partite. '
          'Soglia minima D95.', '',
          '| Incontro | 1.6b: quota / patte / turni | 1.6 (Fase B) | 1.5 | Quota 1.6b − 1.6 | Fuori D95 (1.6b) | Fuori D95 (1.6) |',
          '|---|---|---|---|---:|---|---|']
    for r in rows:
        h, v, w = r['heur'], r['v16'], r['v15']
        md.append(f"| {A.NAMES[r['A']]}–{A.NAMES[r['B']]} | {A.pct(h['share'])} / {A.pct(h['draws'])} / {A.num(h['turns'])} | "
                  f"{A.pct(v['share'])} / {A.pct(v['draws'])} / {A.num(v['turns'])} | {A.num(w['share'])} / {A.num(w['draws'])} / "
                  f"{A.num(w['turns'])} | {signed(h['share'] - v['share'])} | {gap(r['gaps'])} | {gap(r['gaps16'])} |")
    md += ['', f"Fuori dalla soglia minima: {len(out['outside'])} su 15.", '',
           f"Regola della sezione 4: Spazienzio–Mara {A.num(decision['spazienzioMara'])}, Mara–Piera {A.num(decision['maraPiera'])}; "
           f"Mara fuori in basso: {', '.join(decision['maraLow']) or 'nessuno'}; fuori in alto: {', '.join(decision['maraHigh']) or 'nessuno'}. "
           f"Riga: {decision['row']}; correzione: {decision['fix'] or 'nessuna'}."]
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8')
    print('\n'.join(md))
    return 0


def main():
    cmd, root, run = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
    if cmd == 'check':
        r = check(root, run)
        sys.exit(0 if r['identical'] else 1)
    if cmd == 'table': sys.exit(table(root, run, Path(sys.argv[4])))
    raise SystemExit('unknown command ' + cmd)


if __name__ == '__main__':
    main()

import json, sys
from collections import defaultdict
m = json.load(open(sys.argv[1], encoding='utf-8'))
name = {'starter-spazienzio': 'Spazienzio', 'starter-mara': 'Mara', 'starter-tossico': 'Celestina',
        'starter-pino': 'Piera', 'starter-gigi': 'Beppe'}
base = {'starter-spazienzio', 'starter-mara'}
agg = defaultdict(lambda: defaultdict(lambda: [0, 0, 0, 0, 0]))  # key -> group -> [winA, winB, draw, games, turns]
for c in m['celle']:
    a, b = c['A'], c['B']
    ca, cb = c['stileA'].endswith('/com'), c['stileB'].endswith('/com')
    g = 'heur' if not ca and not cb else ('com' if ca and cb else 'mixed')
    for grp in (g, 'all'):
        r = agg[(a, b)][grp]
        r[0] += c['vittorieA']; r[1] += c['vittorieB']; r[2] += c['patte']; r[3] += c['partite']; r[4] += c['turniTotali']
order = [p['A'] + '|' + p['B'] for p in m['coppie']]
print('| Incontro | Tutti gli stili: quota / patte / turni | Solo euristici: quota / patte / turni | com contro com: quota | Fuori (euristici) |')
print('|---|---|---|---|---|')
out = 0
for k in order:
    a, b = k.split('|')
    row = []
    for grp in ('all', 'heur', 'com'):
        w, l, d, n, t = agg[(a, b)][grp]
        q = w / (w + l) if w + l else 0
        row.append((q, d / n, t / n))
    q, pd, tt = row[1]
    fuori = []
    if a != b:
        lo, hi = (0.45, 0.55) if a in base and b in base else (0.40, 0.60)
        if not lo <= q <= hi: fuori.append('quota')
    if pd > 0.10: fuori.append('patte')
    if not 6 <= tt <= 12: fuori.append('durata')
    cq = row[2][0]
    if a != b and not 0.35 <= cq <= 0.65: fuori.append('com fuori 35-65')
    if any(f in ('quota', 'patte', 'durata') for f in fuori): out += 1
    fmt = lambda r: f'{r[0]*100:.2f}% / {r[1]*100:.2f}% / {r[2]:.2f}'
    print(f'| {name[a]}–{name[b]} | {fmt(row[0])} | {fmt(row[1])} | {cq*100:.2f}% | {", ".join(fuori) or "—"} |')
print(f'\nIncontri fuori sui soli euristici: {out} su {len(order)}')

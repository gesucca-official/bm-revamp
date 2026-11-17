"""SB-19 Fase B1: read-only summary of the «prima» search (sb7-ricerca-*.json of search.ps1). Launches no games.

Uso: python docs/reports/set-base/sb-19/search-summary.py FILE.json [FILE.json ...]
Per ogni ricerca (personaggio, partenza): quota di convalida del mazzo «ultimo» (vittorie / (vittorie + sconfitte)), il suo massimo contro uno dei sette
avversari, e quante copie di Estasi e di Grappa ha. In coda: il massimo contro gli starter fra tutte le ricerche e le ricorrenze di Estasi."""
import json, sys

ESTASI, GRAPPA = 'base.pino.GoingBerserk', 'base.items.GrappaDellaCasa'
FOES = ['starter-spazienzio', 'starter-mara', 'starter-tossico', 'starter-pino', 'starter-gigi']
rows = []
for path in sys.argv[1:]:
    for r in json.load(open(path, encoding='utf-8'))['ricerche']:
        m = next(x for x in r['mazzi'] if x['etichetta'] == 'ultimo')
        c = m['convalida']
        share = {f: c[f]['vittorie'] / (c[f]['vittorie'] + c[f]['sconfitte']) for f in c}
        w = sum(v['vittorie'] for v in c.values()); l = sum(v['sconfitte'] for v in c.values())
        worst = max(share, key=share.get)
        rows.append((r['personaggio'].split('.')[-1], r['partenza'], w / (w + l), worst, share[worst],
                     max(share[f] for f in FOES), m['carte'].get(ESTASI, 0), m['carte'].get(GRAPPA, 0)))
print('| Personaggio | Partenza | Quota di convalida | Massimo contro | Massimo | Massimo contro gli starter | Estasi | Grappa |')
print('|---|---|---:|---|---:|---:|---:|---:|')
for p, s, q, wf, ws, st, e, g in rows:
    print(f'| {p} | {s} | {q*100:.1f}% | {wf} | {ws*100:.1f}% | {st*100:.1f}% | {e} | {g} |'.replace('.', ','))
print()
print('Massimo contro gli starter:', f'{max(r[5] for r in rows)*100:.1f}%'.replace('.', ','),
      '; ricerche con Estasi:', sum(1 for r in rows if r[6]), 'su', len(rows))

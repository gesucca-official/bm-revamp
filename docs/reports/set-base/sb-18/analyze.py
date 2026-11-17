"""SB-18 Fase B: read-only summary of a round of Duccio (run.ps1). It launches no games.

Uso, dalla radice del repository:
  python docs/reports/set-base/sb-18/analyze.py summarize RUN_DIR DEST     one variant: DEST.json and DEST.md
  python docs/reports/set-base/sb-18/analyze.py compare DEST A.json B.json ...   the tables of the report, DEST.md
RUN_DIR is the output of a round of run.ps1 (matrix.json, deck-observations.json, health-observations.json, health-styles.json,
draft.json). Matchups from Duccio's side (prova-duccio is always the first named). «Euristici»: both bots heuristic (aggressivo,
prudente, risorse), the base of the criteria (D93); D95 minimum threshold as in sb-16i-analyze.py.
"""
import importlib.util, json, sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('sb16i', HERE.parent / 'sb-16i-analyze.py')
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)
DUCCIO = 'prova-duccio'
NAMES = dict(A.NAMES, **{DUCCIO: 'Duccio'})
ORDER = [DUCCIO] + A.DECKS
P = 'base.rocco.'
COST_CARDS = [P + 'NoccheSbucciate', P + 'EAllora', P + 'Capocciata', P + 'TestaDura']
LAST_RESORT = P + 'NeHoPreseDiPeggio'
CHEAP = {'seatTurns', 'lowHealthTurns', 'moves', 'boundMoves', 'lowHealthMoves', 'lowHealthBoundMoves', 'games', 'healthSpent',
         'healthRecovered', 'healthLost', 'payToZeroWithoutLastBlow'}


def pct(x): return f'{x:.2f}%'.replace('.', ',')
def num(x): return f'{x:.2f}'.replace('.', ',')


def heur_totals(obs):
    """Sum of the counters of prova-duccio seats where both bots are heuristic."""
    total = Counter()
    for key, c in obs.items():
        deck, foe, g = key.split('|')
        if deck != DUCCIO or g != 'heur': continue
        for k, v in c.items(): total[k] += v
    return total


def card_use(deck_obs, draft):
    names = {c['binding']: c['gui']['name'] for c in draft['cards']}
    total = heur_totals(deck_obs)
    games = total['games']
    cards = sorted({k.split('/')[1] for k in total if k.startswith('card/')})
    rows = []
    for b in cards:
        rows.append({'binding': b, 'name': names.get(b, b), 'playedGamesShare': 100 * total[f'card/{b}/playedGames'] / max(1, games),
                     'playsPerGame': total[f'card/{b}/plays'] / max(1, games)})
    return {'games': games, 'cards': rows}


def readings(deck_obs, health):
    d, h = heur_totals(deck_obs), heur_totals(health)
    games = max(1, h['games'])
    pays = {k: v for k, v in h.items() if k.startswith('payToZero/') or k.startswith('diedInPayingTurn/')}
    return {
        'games': h['games'],
        'exhausted': 100 * d['exhausted'] / max(1, d['games']),
        'endWithLastResort': 100 * d['endWithAnyLastResort'] / max(1, d['games']),
        'searches': d['searchFound'] + d['searchMissed'],
        'searchMissRate': 100 * d['searchMissed'] / max(1, d['searchFound'] + d['searchMissed']),
        'turnsPerGame': d['turns'] / max(1, d['games']),
        'healthSpentPerGame': h['healthSpent'] / games,
        'healthRecoveredPerGame': h['healthRecovered'] / games,
        'healthLostToDamagePerGame': h['healthLost'] / games,
        'boundShare': 100 * h['boundMoves'] / max(1, h['moves']),
        'lowHealthTurnsShare': 100 * h['lowHealthTurns'] / max(1, h['seatTurns']),
        'lowHealthMoves': h['lowHealthMoves'],
        'lowHealthBoundShare': 100 * h['lowHealthBoundMoves'] / max(1, h['lowHealthMoves']),
        'healthSpentByCardPerGame': {k.split('/', 1)[1]: v / games for k, v in sorted(h.items()) if k.startswith('healthSpent/')},
        'payToZeroWithoutLastBlow': h['payToZeroWithoutLastBlow'],
        'payToZero': dict(sorted(pays.items())),
        'lastResortPlaysPerGame': d[f'card/{LAST_RESORT}/plays'] / max(1, d['games']),
        'lastResortGamesShare': 100 * d[f'card/{LAST_RESORT}/playedGames'] / max(1, d['games']),
    }


def by_style(styles):
    """Plays per game of the HEALTH-cost cards, by heuristic style (the timings are added together)."""
    agg = defaultdict(Counter)
    for key, c in styles.items():
        deck, style = key.split('|')
        name = style.split('/')[1]
        if name == 'com': continue
        for k, v in c.items(): agg[name][k] += v
    out = {}
    for name, c in sorted(agg.items()):
        g = max(1, c['games'])
        out[name] = {'games': c['games'], 'healthSpentPerGame': c['healthSpent'] / g,
                     'playsPerGame': {b.split('.')[-1]: c['plays/' + b] / g for b in COST_CARDS}}
    return out


def summarize(run, dest):
    run = Path(run)
    matrix = A.read(run / 'matrix.json')
    deck_obs = A.read(run / 'deck-observations.json')
    health = A.read(run / 'health-observations.json')
    styles = A.read(run / 'health-styles.json')
    draft = A.read(run / 'draft.json')
    pairs = A.pairs(matrix)
    rows = []
    for foe in ORDER:
        p = pairs[(DUCCIO, foe)]
        h = p['heur']
        rows.append({'foe': foe, 'heur': h, 'all': p['all'], 'com': p.get('com'), 'gaps': A.minimum(DUCCIO, foe, h)})
    inv = matrix['invarianti']
    result = {'run': str(run.name), 'games': inv['partite'], 'violations': inv['violazioni'],
              'boundViolations': sum(1 for b in matrix['tettoBound'] if b['viola']), 'rows': rows,
              'outside': [NAMES[r['foe']] for r in rows if r['gaps']], 'cardUse': card_use(deck_obs, draft),
              'readings': readings(deck_obs, health), 'byStyle': by_style(styles)}
    Path(str(dest) + '.json').write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    r = result['readings']
    md = [f'# SB-18: {run.name}', '',
          'Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.', '',
          '| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |', '|---|---|---|---|---|']
    for row in rows:
        h, a, c = row['heur'], row['all'], row['com']
        gaps = ', '.join(f'{k} {num(v)}' for k, v in row['gaps'].items()) or '—'
        md.append(f"| Duccio–{NAMES[row['foe']]} | {pct(h['share'])} / {pct(h['draws'])} / {num(h['turns'])} | "
                  f"{pct(a['share'])} / {pct(a['draws'])} / {num(a['turns'])} | {pct(c['share']) if c else '—'} | {gaps} |")
    md += ['', f"Partite {inv['partite']}; violazioni {sum(inv['violazioni'].values())}; bound oltre il tetto {result['boundViolations']}.", '',
           '## Carte di Duccio (soli euristici)', '', '| Carta | Partite in cui è giocata | Giocate per partita |', '|---|---:|---:|']
    for c in sorted(result['cardUse']['cards'], key=lambda c: -c['playedGamesShare']):
        md.append(f"| {c['name']} | {pct(c['playedGamesShare'])} | {num(c['playsPerGame'])} |")
    md += ['', '## Letture (soli euristici, per partita e per posto di Duccio)', '', '```', json.dumps(r, ensure_ascii=False, indent=1), '```', '',
           '## Per stile', '', '```', json.dumps(result['byStyle'], ensure_ascii=False, indent=1), '```']
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md[:14]))
    return result


def compare(dest, files):
    results = [json.loads(Path(f).read_text(encoding='utf-8')) for f in files]
    labels = [Path(f).stem.split('-')[-1].upper() for f in files]
    md = ['| Incontro | ' + ' | '.join(labels) + ' |', '|---|' + '---|' * len(labels)]
    for foe in ORDER:
        cells = []
        for r in results:
            row = next(x for x in r['rows'] if x['foe'] == foe)
            h = row['heur']
            txt = f"{pct(h['share'])} / {pct(h['draws'])} / {num(h['turns'])}"
            cells.append(f'**{txt}**' if row['gaps'] else txt)
        md.append(f'| Duccio–{NAMES[foe]} | ' + ' | '.join(cells) + ' |')
    md.append('| **Incontri fuori D95** | ' + ' | '.join(str(len(r['outside'])) for r in results) + ' |')
    md.append('| Punti oltre la soglia (somma) | ' + ' | '.join(
        num(sum(sum(row['gaps'].values()) for row in r['rows'])) for r in results) + ' |')
    md += ['', '| Lettura | ' + ' | '.join(labels) + ' |', '|---|' + '---|' * len(labels)]
    def line(name, fn): md.append(f'| {name} | ' + ' | '.join(fn(r['readings']) for r in results) + ' |')
    line('Mazzo esaurito', lambda r: pct(r['exhausted']))
    line('Turni per partita', lambda r: num(r['turnsPerGame']))
    line('Bound sul totale delle giocate', lambda r: pct(r['boundShare']))
    line('Turni con salute sotto 30', lambda r: pct(r['lowHealthTurnsShare']))
    line('Bound giocate a salute sotto 30 (sulle giocate)', lambda r: pct(r['lowHealthBoundShare']))
    line('Salute spesa a partita', lambda r: num(r['healthSpentPerGame']))
    line('Salute recuperata a partita', lambda r: num(r['healthRecoveredPerGame']))
    line('Salute persa per danni a partita', lambda r: num(r['healthLostToDamagePerGame']))
    line('Last resort: partite / giocate per partita', lambda r: f"{pct(r['lastResortGamesShare'])} / {num(r['lastResortPlaysPerGame'])}")
    line('Pagamenti a zero senza «Ultimo colpo»', lambda r: str(r['payToZeroWithoutLastBlow']))
    line('Ricerche di Te lo spiego io fallite', lambda r: pct(r['searchMissRate']) if r['searches'] else '—')
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md))


if __name__ == '__main__':
    if sys.argv[1] == 'summarize': summarize(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == 'compare': compare(sys.argv[2], sys.argv[3:])
    else: raise SystemExit(__doc__)

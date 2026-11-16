"""SB-17 Fase B: read-only summary of a round of Sergio (run.ps1). It launches no games.

Uso, dalla radice del repository: python docs/reports/set-base/sb-17/analyze.py RUN_DIR DEST
  RUN_DIR  the output of a phase of run.ps1 (matrix.json, deck-observations.json, sergio-observations.json)
  DEST     DEST.json and DEST.md are written

Matchups from Sergio's side (prova-sergio is always the first named). «Euristici»: both bots heuristic (aggressivo, prudente,
risorse), the base of the criteria (D93); D95 minimum threshold as in sb-16i-analyze.py. Card use: share of the heuristic games of
prova-sergio in which the card was played at least once, and plays per game.
"""
import importlib.util, json, sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('sb16i', HERE.parent / 'sb-16i-analyze.py')
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)
SERGIO = 'prova-sergio'
NAMES = dict(A.NAMES, **{SERGIO: 'Sergio'})
ORDER = [SERGIO] + A.DECKS


def pct(x): return f'{x:.2f}%'.replace('.', ',')
def num(x): return f'{x:.2f}'.replace('.', ',')


def card_use(deck_obs, draft):
    names = {c['binding']: c['gui']['name'] for c in draft['cards']}
    games, played, plays = Counter(), Counter(), Counter()
    for key, c in deck_obs.items():
        deck, foe, g = key.split('|')
        if deck != SERGIO or g != 'heur': continue
        games[foe] += c.get('games', 0)
        for k, v in c.items():
            parts = k.split('/')
            if parts[0] != 'card': continue
            if parts[2] == 'playedGames': played[(foe, parts[1])] += v
            elif parts[2] == 'plays': plays[(foe, parts[1])] += v
    cards = sorted({b for _, b in played} | {b for _, b in plays})
    total = sum(games.values())
    rows = []
    for b in cards:
        p = sum(v for (f, x), v in played.items() if x == b)
        n = sum(v for (f, x), v in plays.items() if x == b)
        rows.append({'binding': b, 'name': names.get(b, b), 'playedGamesShare': 100 * p / max(1, total), 'playsPerGame': n / max(1, total),
                     'byFoe': {f: round(100 * played[(f, b)] / max(1, games[f]), 2) for f in ORDER if games[f]}})
    return {'games': total, 'cards': rows}


def sergio_counters(obs):
    out = defaultdict(Counter)
    for key, c in obs.items():
        deck, foe, g = key.split('|')
        if g != 'heur': continue
        for k, v in c.items(): out[deck + '|' + foe][k] += v
    return {k: dict(sorted(v.items())) for k, v in sorted(out.items())}


def searches(deck_obs):
    agg = Counter()
    for key, c in deck_obs.items():
        deck, foe, g = key.split('|')
        if deck == SERGIO and g == 'heur':
            for k in ('searchFound', 'searchMissed', 'games', 'exhausted'): agg[k] += c.get(k, 0)
    s = agg['searchFound'] + agg['searchMissed']
    return {'searches': s, 'missRate': 100 * agg['searchMissed'] / max(1, s), 'exhausted': 100 * agg['exhausted'] / max(1, agg['games'])}


def summarize(run, dest):
    run = Path(run)
    matrix = A.read(run / 'matrix.json')
    deck_obs = A.read(run / 'deck-observations.json')
    sergio_obs = A.read(run / 'sergio-observations.json')
    draft = A.read(run / 'draft.json')
    pairs = A.pairs(matrix)
    rows = []
    for foe in ORDER:
        p = pairs[(SERGIO, foe)]
        h = p['heur']
        rows.append({'foe': foe, 'heur': h, 'all': p['all'], 'com': p.get('com'), 'gaps': A.minimum(SERGIO, foe, h)})
    inv = matrix['invarianti']
    result = {'run': str(run.name), 'games': inv['partite'], 'violations': inv['violazioni'],
              'boundViolations': sum(1 for b in matrix['tettoBound'] if b['viola']), 'rows': rows,
              'outside': [NAMES[r['foe']] for r in rows if r['gaps']], 'cardUse': card_use(deck_obs, draft),
              'sergioCounters': sergio_counters(sergio_obs), 'searches': searches(deck_obs)}
    Path(dest + '.json').write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    md = [f'# SB-17: {run.name}', '',
          'Quote di Sergio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.', '',
          '| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |', '|---|---|---|---|---|']
    for r in rows:
        h, a, c = r['heur'], r['all'], r['com']
        gaps = ', '.join(f'{k} {num(v)}' for k, v in r['gaps'].items()) or '—'
        md.append(f"| Sergio–{NAMES[r['foe']]} | {pct(h['share'])} / {pct(h['draws'])} / {num(h['turns'])} | "
                  f"{pct(a['share'])} / {pct(a['draws'])} / {num(a['turns'])} | {pct(c['share']) if c else '—'} | {gaps} |")
    md += ['', f"Partite {inv['partite']}; violazioni {sum(inv['violazioni'].values())}; bound oltre il tetto {result['boundViolations']}.", '',
           '## Carte di Sergio (soli euristici)', '', '| Carta | Partite in cui è giocata | Giocate per partita |', '|---|---:|---:|']
    for c in sorted(result['cardUse']['cards'], key=lambda c: -c['playedGamesShare']):
        md.append(f"| {c['name']} | {pct(c['playedGamesShare'])} | {num(c['playsPerGame'])} |")
    s = result['searches']
    md += ['', f"Ricerche di Oh, guarda là: {s['searches']}, fallite {pct(s['missRate'])}; mazzo esaurito {pct(s['exhausted'])}.", '',
           '## Effetti nuovi (soli euristici, dal lato di chi gioca)', '', '```', json.dumps(result['sergioCounters'], ensure_ascii=False, indent=1), '```']
    Path(dest + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md[:14]))
    return result


if __name__ == '__main__':
    summarize(sys.argv[1], sys.argv[2])

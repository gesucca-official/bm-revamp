"""SB-16i Fase B (D97): read-only analysis of the runs of sb-16i-run.ps1. It launches no games.

identity OUT_ROOT            compare OUT_ROOT/identity with step0-20-2 of SB-16h (matrix.md with the historical 1.5 step 0)
feasibility OUT_ROOT         s0 of OUT_ROOT/step0 against the rule of the proposal (s0 x 40 + 120 <= 1500, so s0 <= 34.5 s)
summarize OUT_ROOT RUN DEST  tables of RUN (round, fix-round, step0) against the 1.5 and the forecasts of the proposal,
                             the SB-16h and SB-16i counters; writes DEST.json and DEST.md
"""
import gzip, hashlib, json, sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
SB16H = HERE / 'sb-16h'
DECKS = ['starter-spazienzio', 'starter-mara', 'starter-tossico', 'starter-pino', 'starter-gigi']
NAMES = {'starter-spazienzio': 'Spazienzio', 'starter-mara': 'Mara', 'starter-tossico': 'Celestina',
         'starter-pino': 'Piera', 'starter-gigi': 'Beppe'}
CARD = {'bruiser.Glare': 'PAZIENZA: FINITA', 'base.bruiser.TiFaccioSpazio': 'TI FACCIO SPAZIO', 'base.mara.Slalom': 'Slalom',
        'base.mara.TiStringoLaCurva': 'Ti stringo la curva', 'junkie.MethDrivenRage': 'Dose in preparazione',
        'base.tossico.UnAssaggino': 'Un assaggino', 'base.pino.OffroIo': 'Un altro e arrivo', 'base.pino.PrimaIlBrindisi': 'Prima il brindisi',
        'base.gigi.ColpoDiChiaveInglese': 'Preparo il lavoro', 'base.gigi.UnaStrettaDiProva': 'Una stretta di prova',
        'bruiser.SuperImpact': 'Impatto', 'bruiser.ExtremelyViolentBlow': 'O-Ahio', 'base.mara.Sgommata': 'Sgommata',
        'base.mara.CinghiataDiTraverso': 'Cinghiata', 'junkie.Cough': 'Tossicone', 'junkie.ToxicBloodDrain': "C'è del sangue",
        'base.pino.GoingBerserk': 'Estasi', 'base.pino.RuttoADistanzaSociale': 'Rutto', 'base.gigi.ChiaveDaTredici': 'Chiave',
        'base.gigi.LavoroFattoBene': 'Lavoro', 'base.mara.SorpassoInCurva': 'Sorpasso in curva'}
# Proposal 1.6, section 8: 1.5 values (share / draws / turns, heuristic bots only) and the forecast, from the first named.
FORECAST = {
    ('starter-spazienzio', 'starter-spazienzio'): (50.3, 3.6, 9.1, 'invariato'),
    ('starter-spazienzio', 'starter-mara'): (58.2, 3.5, 9.1, '50–56'),
    ('starter-spazienzio', 'starter-tossico'): (36.4, 5.0, 10.1, '35–40'),
    ('starter-spazienzio', 'starter-pino'): (30.1, 1.3, 9.6, '35–41'),
    ('starter-spazienzio', 'starter-gigi'): (48.3, 1.6, 8.0, '46–52'),
    ('starter-mara', 'starter-mara'): (50.3, 4.5, 8.8, 'invariato; patte 4–6'),
    ('starter-mara', 'starter-tossico'): (31.5, 5.2, 9.6, '36–42'),
    ('starter-mara', 'starter-pino'): (34.8, 5.4, 9.3, '40–46'),
    ('starter-mara', 'starter-gigi'): (36.4, 1.0, 7.5, '40–46'),
    ('starter-tossico', 'starter-tossico'): (49.6, 7.7, 14.5, 'invariato; turni 14,0–14,4; patte 7–9'),
    ('starter-tossico', 'starter-pino'): (61.8, 8.1, 11.0, '57–62'),
    ('starter-tossico', 'starter-gigi'): (46.0, 9.55, 9.2, '42–47; patte 8–10'),
    ('starter-pino', 'starter-pino'): (50.0, 9.88, 11.1, 'patte 8–10'),
    ('starter-pino', 'starter-gigi'): (50.3, 1.7, 8.3, '46–51'),
    ('starter-gigi', 'starter-gigi'): (55.8, 9.0, 6.8, 'invariato'),
}


def sha(b):
    return hashlib.sha256(b).hexdigest()


def read(p):
    p = Path(p)
    data = gzip.decompress(p.read_bytes()) if p.suffix == '.gz' else p.read_bytes()
    return json.loads(data.decode('utf-8-sig'))


def identity(root):
    out = root / 'identity'
    result, ok = {}, True
    pairs = [(n, SB16H / f'step0-20-2-{n}.gz') for n in ('matrix.json', 'observations.json', 'draft.json', 'deck-observations.json')]
    pairs.append(('matrix.md', SB16H / 'historical-step0-matrix.md.gz'))
    for name, ref in pairs:
        before, after = gzip.decompress(ref.read_bytes()), (out / name).read_bytes()
        same = before == after
        ok &= same
        result[name] = {'bytes': len(after), 'historicalSha256': sha(before), 'sha256': sha(after), 'identical': same,
                        'reference': ref.name}
    result['allIdentical'] = ok
    (root / 'identity.json').write_text(json.dumps(result, sort_keys=True), encoding='utf-8')
    print(json.dumps(result, indent=1, sort_keys=True))
    return 0 if ok else 1


def feasibility(root):
    s0 = float((root / 'step0' / 'seconds.txt').read_text())
    estimate = s0 * 40 + 120
    result = {'s0BenchSeconds': s0, 'estimateWallSeconds': estimate, 'capWallSeconds': 1500, 's0Cap': 34.5,
              'feasible': s0 <= 34.5 and estimate <= 1500}
    (root / 'feasibility.json').write_text(json.dumps(result, sort_keys=True), encoding='utf-8')
    print(json.dumps(result, indent=1))
    return 0 if result['feasible'] else 1


def group(sa, sb):
    ca, cb = sa.endswith('/com'), sb.endswith('/com')
    return 'com' if ca and cb else 'mixed' if ca or cb else 'heur'


def pairs(matrix):
    agg = defaultdict(lambda: defaultdict(Counter))
    for c in matrix['celle']:
        for g in (group(c['stileA'], c['stileB']), 'all'):
            for k in ('partite', 'vittorieA', 'vittorieB', 'patte', 'turniTotali'):
                agg[(c['A'], c['B'])][g][k] += c[k]
    out = {}
    for key, groups in agg.items():
        out[key] = {g: {'games': r['partite'], 'share': 100 * r['vittorieA'] / max(1, r['vittorieA'] + r['vittorieB']),
                        'draws': 100 * r['patte'] / r['partite'], 'turns': r['turniTotali'] / r['partite']}
                    for g, r in groups.items()}
    return out


def minimum(a, b, h):
    """D95: share 35-65 % (not in mirrors), draws at most 10 %, turns at most 12 (mirrors excluded from the duration)."""
    mirror = a == b
    gaps = {}
    if not mirror and h['share'] < 35: gaps['quota'] = round(35 - h['share'], 2)
    if not mirror and h['share'] > 65: gaps['quota'] = round(h['share'] - 65, 2)
    if h['draws'] > 10: gaps['patte'] = round(h['draws'] - 10, 2)
    if not mirror and h['turns'] > 12: gaps['durata'] = round(h['turns'] - 12, 2)
    return gaps


def deck_counters(obs):
    """SB-16h counters per deck, heuristic bots only: searches, failed searches, last resort at the end, exhaustion."""
    agg = defaultdict(Counter)
    for key, c in obs.items():
        deck, foe, g = key.split('|')
        if g != 'heur': continue
        for k in ('games', 'searchFound', 'searchMissed', 'endWithAnyLastResort', 'endAfterAnyLastResort', 'exhausted', 'turns'):
            agg[deck][k] += c.get(k, 0)
    return {d: {'games': c['games'], 'searches': c['searchFound'] + c['searchMissed'],
                'missRate': 100 * c['searchMissed'] / max(1, c['searchFound'] + c['searchMissed']),
                'endWithLastResort': 100 * c['endWithAnyLastResort'] / max(1, c['games']),
                'exhausted': 100 * c['exhausted'] / max(1, c['games'])} for d, c in agg.items()}


def sb16i_counters(obs):
    """SB-16i counters, heuristic bots only, and over all styles for the choice."""
    per = defaultdict(Counter)
    total = Counter()
    for key, c in obs.items():
        deck, foe, g = key.split('|')
        for k, v in c.items():
            if g == 'heur': per[deck][k] += v
            total[('heur' if g == 'heur' else 'all-other') + '|' + k] += v
    charges = defaultdict(lambda: {'avail': Counter(), 'chose': Counter(), 'found': Counter(), 'missed': 0})
    ahead = defaultdict(Counter)
    lr = defaultdict(Counter)
    phase = defaultdict(Counter)
    perplay = defaultdict(Counter)
    games = Counter()
    for deck, c in per.items():
        games[deck] = c['games']
        for k, v in c.items():
            parts = k.split('/')
            if parts[0] == 'choice':
                ch = charges[parts[1]]
                if parts[2].startswith('avail-'): ch['avail'][parts[2][6:]] += v
                else: ch['chose'][parts[3]] += v
            elif parts[0] == 'search':
                ch = charges[parts[1]]
                if parts[2] == 'found': ch['found'][parts[3]] += v
                else: ch['missed'] += v
            elif parts[0] == 'ahead': ahead[parts[1]][parts[2]] += v
            elif parts[0] == 'lrPlays': lr[deck][parts[1]] += v
            elif parts[0] == 'lrPhaseTurns': phase[deck][parts[1]] += v
            elif parts[0] == 'perPlay': perplay[parts[1]][parts[2]] += v
    return {'charges': {k: {'avail': dict(v['avail']), 'chose': dict(v['chose']), 'found': dict(v['found']), 'missed': v['missed']}
                        for k, v in sorted(charges.items())},
            'ahead': {k: dict(v) for k, v in sorted(ahead.items())},
            'lastResortPlaysPerSeat': {k: dict(sorted(v.items())) for k, v in lr.items()},
            'lastResortPhaseTurns': {k: dict(sorted(v.items(), key=lambda x: int(x[0]))) for k, v in phase.items()},
            'perPlay': {k: dict(sorted(v.items())) for k, v in perplay.items()}, 'games': dict(games)}


def pct(x): return f'{x:.2f}%'.replace('.', ',')
def num(x): return f'{x:.2f}'.replace('.', ',')


def summarize(root, run, dest):
    folder = root / run
    matrix = read(folder / 'matrix.json')
    now = pairs(matrix)
    before_deck = deck_counters(read(SB16H / 'round-20-2-deck-observations.json.gz'))
    after_deck = deck_counters(read(folder / 'deck-observations.json'))
    counters = sb16i_counters(read(folder / 'sb16i-observations.json'))
    rows, outside = [], []
    for (a, b), (q15, d15, t15, forecast) in FORECAST.items():
        h, allg, com = now[(a, b)]['heur'], now[(a, b)]['all'], now[(a, b)]['com']
        gaps = minimum(a, b, h)
        if gaps: outside.append({'A': a, 'B': b, 'gaps': gaps})
        rows.append({'A': a, 'B': b, 'heur': h, 'all': allg, 'com': com, 'v15': {'share': q15, 'draws': d15, 'turns': t15},
                     'forecast': forecast, 'gaps': gaps})
    summary = {'run': run, 'games': sum(r['all']['games'] for r in rows), 'benchSeconds': float((folder / 'seconds.txt').read_text()),
               'pairs': rows, 'outside': outside, 'deckBefore': before_deck, 'deckAfter': after_deck, 'sb16i': counters}
    Path(str(dest) + '.json').write_text(json.dumps(summary, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    md = ['# SB-16i: ' + run, '', 'Quote del primo nominato sulle decisive; patte e turni su tutte le partite del gruppo. '
          '«Euristici»: due bot euristici (aggressivo, prudente, risorse), la base dei criteri (D93). Soglia minima D95.', '',
          '| Incontro | 1.6 euristici: quota / patte / turni | 1.5 euristici | Previsione (sez. 8) | Tutti gli stili | com contro com: quota | Fuori D95 |',
          '|---|---|---|---|---|---|---|']
    for r in rows:
        h, v, a, c = r['heur'], r['v15'], r['all'], r['com']
        gaps = ', '.join(f'{k} {num(x)}' for k, x in r['gaps'].items()) or '—'
        md.append(f"| {NAMES[r['A']]}–{NAMES[r['B']]} | {pct(h['share'])} / {pct(h['draws'])} / {num(h['turns'])} | "
                  f"{num(v['share'])} / {num(v['draws'])} / {num(v['turns'])} | {r['forecast']} | "
                  f"{pct(a['share'])} / {pct(a['draws'])} / {num(a['turns'])} | {pct(c['share'])} | {gaps} |")
    md += ['', f'Incontri fuori dalla soglia minima sui soli euristici: {len(outside)} su 15.', '',
           '## Ricerche (soli euristici)', '', '| Mazzo | Ricerche fallite 1.5 (SB-16h, 20/2) | Ricerche fallite 1.6 | '
           'Partite finite con una last resort 1.5 / 1.6 | Mazzi esauriti 1.5 / 1.6 |', '|---|---|---|---|---|']
    for d in DECKS:
        b, a = before_deck[d], after_deck[d]
        md.append(f"| {NAMES[d]} | {pct(b['missRate'])} | {pct(a['missRate'])} | {pct(b['endWithLastResort'])} / {pct(a['endWithLastResort'])} | "
                  f"{pct(b['exhausted'])} / {pct(a['exhausted'])} |")
    md += ['', '## Scelta fra due nomi (soli euristici)', '', '| Caricamento | Giocate | Due nomi disponibili | Uno | Nessuno | '
           'Scelte con due nomi | Trovati | Fallite |', '|---|---:|---:|---:|---:|---|---|---:|']
    for k, v in counters['charges'].items():
        n = sum(v['avail'].values())
        chose = ', '.join(f"{CARD.get(b, b)} {x}" for b, x in sorted(v['chose'].items()))
        found = ', '.join(f"{CARD.get(b, b)} {x}" for b, x in sorted(v['found'].items()))
        md.append(f"| {CARD.get(k, k)} | {n} | {pct(100 * v['avail'].get('2', 0) / max(1, n))} | {pct(100 * v['avail'].get('1', 0) / max(1, n))} | "
                  f"{pct(100 * v['avail'].get('0', 0) / max(1, n))} | {chose or '—'} | {found or '—'} | {v['missed']} |")
    md += ['', '## Gioca d\'anticipo (soli euristici)', '', '| Carta | Sì | No | Sì % |', '|---|---:|---:|---:|']
    for k, v in counters['ahead'].items():
        n = v.get('yes', 0) + v.get('no', 0)
        md.append(f"| {CARD.get(k, k)} | {v.get('yes', 0)} | {v.get('no', 0)} | {pct(100 * v.get('yes', 0) / max(1, n))} |")
    md += ['', '## Last resort (soli euristici)', '', 'Giocate della propria last resort per posto e partita (5 = cinque o più); '
           'turni dalla prima last resort giocata (da chiunque) alla fine, sulle partite in cui c\'è.', '',
           '| Mazzo | 0 | 1 | 2 | 3 | 4 | 5+ | Fase last resort: partite / turni medi |', '|---|---:|---:|---:|---:|---:|---:|---|']
    for d in DECKS:
        lr = counters['lastResortPlaysPerSeat'].get(d, {})
        ph = counters['lastResortPhaseTurns'].get(d, {})
        n = sum(ph.values())
        mean = sum(int(k) * v for k, v in ph.items()) / max(1, n)
        md.append(f"| {NAMES[d]} | " + ' | '.join(str(lr.get(str(i), 0)) for i in range(6)) + f" | {n} / {num(mean)} |")
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8')
    print('\n'.join(md[:24]))
    return 0


def main():
    cmd, root = sys.argv[1], Path(sys.argv[2])
    if cmd == 'identity': sys.exit(identity(root))
    if cmd == 'feasibility': sys.exit(feasibility(root))
    if cmd == 'summarize': sys.exit(summarize(root, sys.argv[3], Path(sys.argv[4])))
    raise SystemExit('unknown command ' + cmd)


if __name__ == '__main__':
    main()

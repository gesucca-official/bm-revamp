"""Read-only aggregation of SB-16g correction 1.5 (D90) against arm B of step 3 (same seeds, bots and policies).
Usage: python summarize.py ROUND_DIRECTORY OUTPUT_DIRECTORY
ROUND_DIRECTORY holds matrix.json and observations.json of the 1.5 round; the reference is matrix-B.json and observations-B.json in
docs/reports/set-base/sb-16g-2b3. Differences are paired and descriptive. Criteria D16/D51 as in step 3: quota on decisive games in
40-60% (45-55% for Spazienzio-Mara), draws at most 10%, mean turns 6-12; mirrors have no quota criterion."""
from pathlib import Path
from collections import Counter, defaultdict
import json, sys

src, out = Path(sys.argv[1]), Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
root = Path(__file__).resolve().parents[4]
ref_dir = root / 'docs/reports/set-base/sb-16g-2b3'


def read(p): return json.loads(p.read_text(encoding='utf-8'))


arms = {'B': (read(ref_dir / 'matrix-B.json'), read(ref_dir / 'observations-B.json')),
        '15': (read(src / 'matrix.json'), read(src / 'observations.json'))}
assert (src / 'arm.txt').read_text().strip() == 'B', src
DECKS = arms['15'][0]['intestazione']['mazzi']
names = dict(zip(DECKS, ['Spazienzio', 'Mara', 'Celestina', 'Piera', 'Beppe']))
SPA, GIG = 'starter-spazienzio', 'starter-gigi'
STYLES = ['aggressivo', 'prudente', 'risorse', 'com']
CARDS = {'bruiser.SuperImpact': 'Impatto', 'base.gigi.ChiaveDaTredici': 'Chiave da tredici', 'base.gigi.LavoroFattoBene': 'Lavoro fatto bene'}


def ratio(n, d): return n / d if d else None
def percent(n, d): return f'{100 * n / d:.2f}%' if d else '—'
def avg(n, d): return f'{n / d:.3f}' if d else '—'
def pp(x, y): return f'{100 * (x - y):+.2f}' if x is not None and y is not None else '—'


def window(a, b): return (.45, .55) if (a, b) == (SPA, 'starter-mara') else (.4, .6)


def judge(a, b, wins_a, wins_b, draws, games, turns):
    q = ratio(wins_a, wins_a + wins_b); draw = draws / games; turn = turns / games; low, hi = window(a, b); why = []
    if a != b and not low <= q <= hi: why.append('quota')
    if draw > .1: why.append('patte')
    if not 6 <= turn <= 12: why.append('durata')
    return q, draw, turn, why


def encounters(matrix):
    rows = []
    for r in matrix['coppie']:
        q, draw, turn, why = judge(r['A'], r['B'], r['vittorieA'], r['vittorieB'], r['patte'], r['partite'], r['turniTotali'])
        rows.append(dict(r, quota=q, patteQuota=draw, turniMedi=turn, fuoriSoglia=why))
    return rows


def grouped(matrix, part):
    """Encounter x policy pair (part 0) or encounter x style pair (part 1), aggregated over the other part."""
    cells = defaultdict(Counter)
    for c in matrix['celle']:
        key = (c['A'], c['B'], c['stileA'].split('/')[part], c['stileB'].split('/')[part])
        for m in ['partite', 'vittorieA', 'vittorieB', 'patte', 'turniTotali']: cells[key][m] += c[m]
    bad = []
    for k, c in cells.items():
        q, draw, turn, why = judge(k[0], k[1], c['vittorieA'], c['vittorieB'], c['patte'], c['partite'], c['turniTotali'])
        if why: bad.append({'key': '|'.join(k), 'quotaA': q, 'patte': draw, 'turni': turn, 'fuoriSoglia': why})
    return cells, bad


def style_quota(matrix, deck):
    """Quota on decisive games of `deck` by its style against each other starter (all policies and opposing styles, mirrors excluded)."""
    res = defaultdict(Counter)
    for c in matrix['celle']:
        if c['A'] == c['B']: continue
        for me, them, st, w, l in ((c['A'], c['B'], c['stileA'], 'vittorieA', 'vittorieB'), (c['B'], c['A'], c['stileB'], 'vittorieB', 'vittorieA')):
            if me == deck: res[(st.split('/')[1], them)]['w'] += c[w]; res[(st.split('/')[1], them)]['l'] += c[l]
    return {k: ratio(v['w'], v['w'] + v['l']) for k, v in res.items()}


def bydeck(obs):
    deck, style = defaultdict(Counter), defaultdict(Counter)
    for key, value in obs.items():
        d, st = key.split('|'); deck[d].update(value); style[(d, st.split('/')[1])].update(value)
    return deck, style


enc = {k: encounters(v[0]) for k, v in arms.items()}
obs = {k: bydeck(v[1]) for k, v in arms.items()}
summary = {}
L = ['# SB-16g correzione 1.5 — aggregazione', '',
     'Generato da `summarize.py` sui soli file del banco. Riferimento: braccio B del passo 3, stessi semi, bot e politiche; differenze appaiate e descrittive.',
     'Quote sulle decisive, patte su tutte le partite, turni medi.', '',
     '## Incontri', '', '| Incontro | Braccio B quota / patte / turni | B fuori | 1.5 quota / patte / turni | 1.5 fuori | 1.5–B quota / patte / turni |',
     '|---|---|---|---|---|---|']
for b, n in zip(enc['B'], enc['15']):
    assert (b['A'], b['B']) == (n['A'], n['B'])
    def trio(r): return f"{100 * r['quota']:.2f}% / {100 * r['patteQuota']:.2f}% / {r['turniMedi']:.2f}"
    L.append(f"| {names[n['A']]}–{names[n['B']]} | {trio(b)} | {', '.join(b['fuoriSoglia']) or '—'} | {trio(n)} | {', '.join(n['fuoriSoglia']) or '—'} | "
             f"{pp(n['quota'], b['quota'])} / {pp(n['patteQuota'], b['patteQuota'])} / {n['turniMedi'] - b['turniMedi']:+.2f} |")

for arm in ('B', '15'):
    matrix = arms[arm][0]
    pol, polbad = grouped(matrix, 0); sty, stybad = grouped(matrix, 1)
    nine = [r for r in enc[arm] if SPA in (r['A'], r['B']) or GIG in (r['A'], r['B'])]
    g = Counter()
    for r in matrix['coppie']: g.update({k: r[k] for k in ['partite', 'patte', 'turniTotali', 'limite']})
    summary[arm] = {'fuori': sum(bool(r['fuoriSoglia']) for r in enc[arm]), 'noveFuori': sum(bool(r['fuoriSoglia']) for r in nine),
                    'cellePoliticheFuori': len(polbad), 'cellePolitiche': len(pol),
                    'cellePoliticheFuoriNove': sum(1 for x in polbad if SPA in x['key'] or GIG in x['key']),
                    'cellePoliticheNove': sum(1 for k in pol if SPA in k or GIG in k),
                    'celleStiliFuori': len(stybad), 'celleStili': len(sty),
                    'patteGlobali': g['patte'] / g['partite'], 'turniGlobali': g['turniTotali'] / g['partite'], 'limite': g['limite'],
                    'partite': g['partite'], 'incontri': enc[arm], 'politicheFuori': polbad}
    s = summary[arm]
    L += ['', f"**{'Braccio B' if arm == 'B' else 'Correzione 1.5'}:** incontri fuori **{s['fuori']} su 15**, di cui **{s['noveFuori']} su 9** con Spazienzio o Beppe; "
          f"celle incontro × politiche fuori **{s['cellePoliticheFuori']} su {s['cellePolitiche']}** ({s['cellePoliticheFuoriNove']} su {s['cellePoliticheNove']} nei 9); "
          f"celle incontro × stili fuori {s['celleStiliFuori']} su {s['celleStili']}; patte globali {100 * s['patteGlobali']:.3f}%, turni medi {s['turniGlobali']:.3f}, "
          f"partite al limite {s['limite']}."]

L += ['', '## Quote per stile di Spazienzio e Beppe', '', 'Quota sulle decisive dello stile contro ogni starter, politiche e stili avversari aggregati, specchi esclusi. Braccio B → 1.5.', '']
summary['stili'] = {}
for deck in (SPA, GIG):
    qb, qn = style_quota(arms['B'][0], deck), style_quota(arms['15'][0], deck)
    others = [d for d in DECKS if d != deck]
    L += [f'| Stile di {names[deck]} | ' + ' | '.join(f'contro {names[o]}' for o in others) + ' |', '|---|' + '---|' * len(others)]
    for st in STYLES:
        L.append(f'| {st} | ' + ' | '.join(f"{100 * qb[(st, o)]:.1f} → **{100 * qn[(st, o)]:.1f}**" for o in others) + ' |')
        summary['stili'][f'{deck}|{st}'] = {o: [qb[(st, o)], qn[(st, o)]] for o in others}
    L.append('')

L += ['## Annunci per partita, per stile', '', '| Starter | Braccio B | 1.5 | aggressivo B → 1.5 | prudente | risorse | com |', '|---|---:|---:|---|---|---|---|']
for d in DECKS:
    cb, cn = obs['B'][0][d], obs['15'][0][d]
    row = [f"{avg(obs[a][1][(d, st)]['announcements'], obs[a][1][(d, st)]['seatGames'])}" for st in STYLES for a in ('B', '15')]
    L.append(f"| {names[d]} | {avg(cb['announcements'], cb['seatGames'])} | {avg(cn['announcements'], cn['seatGames'])} | "
             + ' | '.join(f'{row[2 * i]} → {row[2 * i + 1]}' for i in range(4)) + ' |')

L += ['', '## Turni da metà salute e finali in un turno per carta', '',
      'Turni subiti da ogni starter in cui l\'avversario ha giocato la carta (definizione del passo 2). Braccio B → 1.5.', '',
      '| Carta | Starter che subisce | Turni da metà salute | Finali in un turno |', '|---|---|---|---|']
summary['carte'] = {}
for card, title in CARDS.items():
    tot = [Counter(), Counter()]
    for d in DECKS:
        vals = [(obs[a][0][d]['halfTurn-by/' + card], obs[a][0][d]['oneTurnKO-by/' + card]) for a in ('B', '15')]
        for i in range(2): tot[i]['h'] += vals[i][0]; tot[i]['k'] += vals[i][1]
        if any(v for pair in vals for v in pair):
            L.append(f'| {title} | {names[d]} | {vals[0][0]} → {vals[1][0]} | {vals[0][1]} → {vals[1][1]} |')
    L.append(f"| **{title}** | **tutti** | **{tot[0]['h']} → {tot[1]['h']}** | **{tot[0]['k']} → {tot[1]['k']}** |")
    summary['carte'][card] = {'B': dict(tot[0]), '15': dict(tot[1])}
L += ['', 'Totali di tutte le carte e di tutti i turni di giocatore:', '', '| | Braccio B | 1.5 |', '|---|---:|---:|']
for metric, label in (('halfTurn', 'Turni da metà salute'), ('oneTurnKO', 'Finali in un turno'), ('playerTurns', 'Turni di giocatore')):
    L.append(f"| {label} | {sum(obs['B'][0][d][metric] for d in DECKS)} | {sum(obs['15'][0][d][metric] for d in DECKS)} |")

L += ['', '## Carte cambiate: partite in cui giocate, quando in mano', '', '| Carta | Starter | Braccio B | 1.5 |', '|---|---|---|---|']
for card, title in CARDS.items():
    for d in DECKS:
        cb, cn = arms['B'][0]['mazzi'][d]['carte'].get(card), arms['15'][0]['mazzi'][d]['carte'].get(card)
        if cb: L.append(f"| {title} | {names[d]} | {percent(cb['partiteGiocata'], cb['partiteInMano'])} | {percent(cn['partiteGiocata'], cn['partiteInMano'])} |")

L += ['', '## Beppe: 4 CUT dei due annunci offensivi', '', '| Caricamento | Esito | Mosse B → 1.5 | Salute tolta B → 1.5 |', '|---|---|---|---|']
summary['cut4'] = {}
for b in ['base.gigi.ColpoDiChiaveInglese', 'base.gigi.UnaStrettaDiProva']:
    for res in ('found', 'missed'):
        pre = 'charge/' + b + '/cut4-' + res + '-'
        v = [(obs[a][0][GIG][pre + 'moves'], obs[a][0][GIG][pre + 'lost']) for a in ('B', '15')]
        L.append(f"| {b} | {'riuscita' if res == 'found' else 'fallita'} | {v[0][0]} → {v[1][0]} | {v[0][1]} → {v[1][1]} |")
        summary['cut4'][b + '/' + res] = v

L += ['', '## Annunci riusciti, copie trovate giocate', '', '| Caricamento | Riuscite B → 1.5 | Fallite B → 1.5 | Copia trovata giocata B → 1.5 |', '|---|---|---|---|']
for b in ['bruiser.Glare', 'base.bruiser.TiFaccioSpazio', 'base.gigi.ColpoDiChiaveInglese', 'base.gigi.UnaStrettaDiProva']:
    d = SPA if 'bruiser' in b else GIG
    v = [[obs[a][0][d][f'charge/{b}/{m}'] for m in ('found', 'missed', 'foundCopyPlayed')] for a in ('B', '15')]
    L.append(f'| {b} | {v[0][0]} → {v[1][0]} | {v[0][1]} → {v[1][1]} | {v[0][2]} → {v[1][2]} |')

L += ['', '## Celle incontro × politiche fuori soglia (1.5)', '', '| Incontro | Politica A / B | Quota A | Patte | Turni | Fuori |', '|---|---|---:|---:|---:|---|']
for x in summary['15']['politicheFuori']:
    a, b, pa, pb = x['key'].split('|')
    L.append(f"| {names[a]}–{names[b]} | {pa} / {pb} | {100 * x['quotaA']:.2f}% | {100 * x['patte']:.2f}% | {x['turni']:.2f} | {', '.join(x['fuoriSoglia'])} |")

(out / 'summary.md').write_text('\n'.join(L) + '\n', encoding='utf-8')
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('B:', summary['B']['fuori'], '/ 15,', summary['B']['noveFuori'], '/ 9;  1.5:', summary['15']['fuori'], '/ 15,', summary['15']['noveFuori'], '/ 9')

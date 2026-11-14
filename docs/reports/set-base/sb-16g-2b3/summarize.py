"""Read-only aggregation of the two arms of SB-16g step 3 (ChargeMeasureTest outputs).
Usage: python summarize.py ARM_A_DIRECTORY ARM_B_DIRECTORY OUTPUT_DIRECTORY
The reference is the measured step 2 (docs/reports/set-base/sb-16g-2b2): same seeds and bots, so differences are paired, descriptive."""
from pathlib import Path
from collections import Counter, defaultdict
import json, sys

srcA, srcB, out = map(Path, sys.argv[1:4]); out.mkdir(parents=True, exist_ok=True)
root = Path(__file__).resolve().parents[4]
ref_dir = root / 'docs/reports/set-base/sb-16g-2b2'


def load(d):
    m = json.loads((d / 'matrix.json').read_text(encoding='utf-8'))
    o = json.loads((d / 'observations.json').read_text(encoding='utf-8'))
    return m, o


arms = {'A': load(srcA), 'B': load(srcB), 'P2': load(ref_dir)}
for arm, d in (('A', srcA), ('B', srcB)):
    assert (d / 'arm.txt').read_text().strip() == arm, d
names = dict(zip(arms['A'][0]['intestazione']['mazzi'], ['Spazienzio', 'Mara', 'Celestina', 'Piera', 'Beppe']))
DECKS = list(names)


def ratio(n, d): return n / d if d else None
def percent(n, d): return f'{100 * n / d:.2f}%' if d else '—'
def avg(n, d): return f'{n / d:.3f}' if d else '—'
def pp(x, y): return f'{100 * (x - y):+.2f}' if x is not None and y is not None else '—'


def bydeck(obs):
    out_, style, policy = defaultdict(Counter), defaultdict(Counter), defaultdict(Counter)
    for key, value in obs.items():
        deck, st = key.split('|')
        out_[deck].update(value); style[(deck, st.split('/')[1])].update(value); policy[st.split('/')[0]].update(value)
    return out_, style, policy


def encounters(matrix):
    rows = []
    for row in matrix['coppie']:
        n = row['partite']; q = ratio(row['vittorieA'], row['vittorieA'] + row['vittorieB'])
        draw = row['patte'] / n; turn = row['turniTotali'] / n
        low, hi = (.45, .55) if (row['A'], row['B']) == ('starter-spazienzio', 'starter-mara') else (.4, .6)
        bad = []
        if row['A'] != row['B'] and not low <= q <= hi: bad.append('quota')
        if draw > .1: bad.append('patte')
        if not 6 <= turn <= 12: bad.append('durata')
        rows.append(dict(row, quota=q, patteQuota=draw, turniMedi=turn, fuoriSoglia=bad))
    return rows


def policy_cells(matrix):
    cells = defaultdict(Counter)
    for cell in matrix['celle']:
        key = '|'.join([cell['A'], cell['B'], cell['stileA'].split('/')[0], cell['stileB'].split('/')[0]])
        for metric in ['partite', 'vittorieA', 'vittorieB', 'patte', 'turniTotali', 'limite']: cells[key][metric] += cell[metric]
    bad = []
    for key, c in cells.items():
        a, b, pa, pb = key.split('|'); q = c['vittorieA'] / (c['vittorieA'] + c['vittorieB']); draw = c['patte'] / c['partite']
        turn = c['turniTotali'] / c['partite']; low, hi = (.45, .55) if (a, b) == ('starter-spazienzio', 'starter-mara') else (.4, .6)
        why = []
        if a != b and not low <= q <= hi: why.append('quota')
        if draw > .1: why.append('patte')
        if not 6 <= turn <= 12: why.append('durata')
        if why: bad.append({'key': key, 'quotaA': q, 'patte': draw, 'turni': turn, 'fuoriSoglia': why})
    return cells, bad


def style_cells(matrix):
    """Encounter × style pair (policies aggregated), for the qualitative style check."""
    cells = defaultdict(Counter)
    for cell in matrix['celle']:
        key = '|'.join([cell['A'], cell['B'], cell['stileA'].split('/')[1], cell['stileB'].split('/')[1]])
        for metric in ['partite', 'vittorieA', 'vittorieB', 'patte', 'turniTotali']: cells[key][metric] += cell[metric]
    return cells


enc = {k: encounters(v[0]) for k, v in arms.items()}
dk = {k: bydeck(v[1]) for k, v in arms.items()}
summary = {'bracci': {}}
lines = ['# SB-16g passo 3 — aggregazione dei due bracci', '',
         'Generato da `summarize.py` sui soli file del banco. Riferimento: passo 2 misurato, stessi semi e bot; differenze appaiate e descrittive.', '']

lines += ['## Incontri', '', 'Quote sulle decisive, patte su tutte le partite, turni medi. Δ in punti percentuali (turni in turni).', '',
          '| Incontro | P2 quota / patte / turni | A quota / patte / turni | A fuori | B quota / patte / turni | B fuori | B–A quota / patte / turni |',
          '|---|---|---|---|---|---|---|']
for p2, a, b in zip(enc['P2'], enc['A'], enc['B']):
    assert (p2['A'], p2['B']) == (a['A'], a['B']) == (b['A'], b['B'])
    def trio(r): return f"{100 * r['quota']:.2f}% / {100 * r['patteQuota']:.2f}% / {r['turniMedi']:.2f}"
    lines.append(f"| {names[a['A']]}–{names[a['B']]} | {trio(p2)} | {trio(a)} | {', '.join(a['fuoriSoglia']) or '—'} | {trio(b)} | "
                 f"{', '.join(b['fuoriSoglia']) or '—'} | {pp(b['quota'], a['quota'])} / {pp(b['patteQuota'], a['patteQuota'])} / "
                 f"{b['turniMedi'] - a['turniMedi']:+.2f} |")
lines += ['', 'Δ rispetto al passo 2:', '', '| Incontro | A–P2 quota / patte / turni | B–P2 quota / patte / turni |', '|---|---|---|']
for p2, a, b in zip(enc['P2'], enc['A'], enc['B']):
    def d(r): return f"{pp(r['quota'], p2['quota'])} / {pp(r['patteQuota'], p2['patteQuota'])} / {r['turniMedi'] - p2['turniMedi']:+.2f}"
    lines.append(f"| {names[a['A']]}–{names[a['B']]} | {d(a)} | {d(b)} |")

for arm in ('A', 'B'):
    matrix, obs = arms[arm]
    deck, style, policy = dk[arm]
    cells, bad = policy_cells(matrix)
    styles = style_cells(matrix)
    globalc = Counter()
    for row in matrix['coppie']: globalc.update({k: row[k] for k in ['partite', 'patte', 'turniTotali', 'limite']})
    s = {'incontri': enc[arm], 'fuori': sum(bool(r['fuoriSoglia']) for r in enc[arm]), 'cellePoliticheFuori': bad,
         'patteGlobali': globalc['patte'] / globalc['partite'], 'turniGlobali': globalc['turniTotali'] / globalc['partite'],
         'limite': globalc['limite'], 'starter': {}, 'politiche': {}}
    lines += ['', f'## Braccio {arm}', '',
              f"Incontri fuori criterio: **{s['fuori']} su 15**; celle incontro × coppia di politiche fuori: **{len(bad)} su {len(cells)}**. "
              f"Patte globali {100 * s['patteGlobali']:.3f}%, turni medi {s['turniGlobali']:.3f}, partite al limite {globalc['limite']}.", '',
              '### Frequenza degli annunci', '',
              '| Starter | Annunci/partita | 0 | 1 | 2 | 3+ | Riuscite | Fallite | aggressivo | prudente | risorse | com |',
              '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|']
    for dd in DECKS:
        c = deck[dd]; n = c['seatGames']
        title = defaultdict(Counter)
        for k, v in c.items():
            if k.startswith('charge/') and k.count('/') == 2:
                _, binding, metric = k.split('/'); title[binding][metric] += v
        tot = Counter()
        for v in title.values(): tot.update(v)
        per_style = [avg(style[(dd, st)]['announcements'], style[(dd, st)]['seatGames']) for st in ['aggressivo', 'prudente', 'risorse', 'com']]
        lines.append(f"| {names[dd]} | {avg(c['announcements'], n)} | " + ' | '.join(percent(c['announcements-' + x], n) for x in ['0', '1', '2', '3+'])
                     + f" | {tot['found']} | {tot['missed']} | " + ' | '.join(per_style) + ' |')
        s['starter'][dd] = {'counts': dict(c), 'titoli': {k: dict(v) for k, v in title.items()},
                            'annunciPerPartita': ratio(c['announcements'], n)}
    lines += ['', '### Turni da metà salute e finali in un turno', '',
              'Turno da metà salute: perdita netta inizio–fine ≥ metà della HEALTH iniziale (definizione del passo 2). Finale in un turno: '
              'HEALTH di inizio turno ≥ metà iniziale e zero a fine turno. Denominatori: turni di giocatore (prima colonna). Fonti in salute persa.', '',
              '| Starter | Turni di giocatore | Turni da metà salute | con gettone | che chiudono | Finali in un turno | patta / sconfitta | stesso gruppo | Fonti metà salute avv./sé/periodico/timer |',
              '|---|---:|---:|---:|---:|---:|---|---:|---|']
    for dd in DECKS:
        c = deck[dd]
        lines.append(f"| {names[dd]} | {c['playerTurns']} | {c['halfTurn']} ({percent(c['halfTurn'], c['playerTurns'])}) | {c['halfTurn-withToken']} | "
                     f"{c['halfTurn-endedGame']} | {c['oneTurnKO']} | {c['oneTurnKO-draw']} / {c['oneTurnKO-lost']} | {c['oneTurnKO-sameGroup']} | "
                     + '/'.join(str(c['halfTurn-lost-' + k]) for k in ['opponent', 'self', 'periodic', 'timer']) + ' |')
    lines += ['', 'Carte avversarie giocate nei turni da metà salute subiti e nei finali in un turno (le prime cinque per starter):', '',
              '| Starter che subisce | Metà salute: carta avversaria (turni) | Finale in un turno: carta avversaria (turni) |', '|---|---|---|']
    for dd in DECKS:
        c = deck[dd]
        def top(prefix):
            items = sorted(((k[len(prefix):], v) for k, v in c.items() if k.startswith(prefix)), key=lambda x: -x[1])[:5]
            return ', '.join(f'{k} ({v})' for k, v in items) or '—'
        lines.append(f"| {names[dd]} | {top('halfTurn-by/')} | {top('oneTurnKO-by/')} |")
    lines += ['', 'Per incontro (posto che subisce; specchi con entrambi i posti):', '', '| Starter / contro | Turni da metà salute | che chiudono | Finali in un turno |', '|---|---:|---:|---:|']
    for dd in DECKS:
        c = deck[dd]
        for vs in DECKS:
            pre = 'vs/' + vs + '/'
            if c[pre + 'halfTurn'] or c[pre + 'oneTurnKO']:
                lines.append(f"| {names[dd]} / {names[vs]} | {c[pre + 'halfTurn']} | {c[pre + 'halfTurn-endedGame']} | {c[pre + 'oneTurnKO']} |")
    lines += ['', '### Patte: ragione terminale, last resort, A finale', '',
              'Per posto in partite patte: fonte del danno che porta a zero (avversario, sé, periodico, timer, vivo). Stesso gruppo: le due mosse '
              'del turno finale nello stesso gruppo di velocità (priorità e A dopo il costo).', '',
              '| Starter | Posti in patta | avversario | sé | periodico | timer | vivo | stesso gruppo | Last resort giocate / partite con LR | Mazzo esaurito | Sotto il cofano |',
              '|---|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|']
    for dd in DECKS:
        c = deck[dd]; m = matrix['mazzi'][dd]
        drawn = sum(c['draw-lethal-' + k] for k in ['opponent', 'self', 'periodic', 'timer', 'alive'])
        lines.append(f"| {names[dd]} | {drawn} | " + ' | '.join(str(c['draw-lethal-' + k]) for k in ['opponent', 'self', 'periodic', 'timer', 'alive'])
                     + f" | {c['draw-sameGroup']} | {c['lastResortPlayed']} / {c['gamesWithLastResort']} | {percent(m['mazzoEsaurito'], m['partite'])} | {c['cofanoPlayed']} |")
    lines += ['', 'A all\'inizio del turno finale (posti):', '', '| Starter | 0 | 1-9 | 10-19 | 20-39 | 40+ | turno finale nello stesso gruppo |', '|---|---:|---:|---:|---:|---:|---:|']
    for dd in DECKS:
        c = deck[dd]
        lines.append(f"| {names[dd]} | " + ' | '.join(str(c['finalA-' + b]) for b in ['0', '1-9', '10-19', '20-39', '40+']) + f" | {c['finalSameGroup']} |")
    lines += ['', '### Beppe: 4 CUT dei due annunci offensivi', '', '| Caricamento | Riuscite: mosse / salute tolta | Fallite: mosse / salute tolta |', '|---|---|---|']
    c = deck['starter-gigi']
    for b in ['base.gigi.ColpoDiChiaveInglese', 'base.gigi.UnaStrettaDiProva']:
        pre = 'charge/' + b + '/cut4-'
        lines.append(f"| {b} | {c[pre + 'found-moves']} / {c[pre + 'found-lost']} | {c[pre + 'missed-moves']} / {c[pre + 'missed-lost']} |")
    lines += ['', '### POISON ricevuto e Bancone', '', 'Nominale, dopo stati e corazza, salute persa. Bancone: soli turni in cui il posto lo gioca.', '',
              '| Starter | POISON diretto | POISON periodico | Turni di Bancone | Bancone: diretto | Bancone: periodico |', '|---|---|---|---:|---|---|']
    for dd in DECKS:
        c = deck[dd]
        def tri(pre): return '/'.join(str(c[pre + x]) for x in ['nominal', 'modified', 'lost'])
        lines.append(f"| {names[dd]} | {tri('poison-direct-')} | {tri('poison-periodic-')} | {c['bancone-turns']} | {tri('bancone-poison-direct-')} | {tri('bancone-poison-periodic-')} |")
    lines += ['', '### Politiche e stili', '', '| Politica | Quota decisive | Patte | Turni medi | Annunci/partita |', '|---|---:|---:|---:|---:|']
    for pol, c in policy.items():
        lines.append(f"| {pol} | {percent(c['wins'], c['seatGames'] - c['draws'])} | {percent(c['draws'], c['seatGames'])} | {avg(c['turns'], c['seatGames'])} | {avg(c['announcements'], c['seatGames'])} |")
        s['politiche'][pol] = dict(c)
    duels = {}
    lines += ['', '| Politica A / B | Partite | Quota A sulle decisive | Patte |', '|---|---:|---:|---:|']
    for pa, pb in [('ALWAYS', 'HOLD_IF_DEFENDED'), ('ALWAYS', 'RANDOM'), ('HOLD_IF_DEFENDED', 'RANDOM')]:
        cnt = Counter()
        for cell in matrix['celle']:
            a, b = cell['stileA'].split('/')[0], cell['stileB'].split('/')[0]
            if (a, b) not in [(pa, pb), (pb, pa)]: continue
            cnt['partite'] += cell['partite']; cnt['patte'] += cell['patte']
            cnt['vittorieA'] += cell['vittorieA' if a == pa else 'vittorieB']; cnt['vittorieB'] += cell['vittorieB' if a == pa else 'vittorieA']
        duels[pa + '|' + pb] = cnt
        lines.append(f"| {pa} / {pb} | {cnt['partite']} | {percent(cnt['vittorieA'], cnt['vittorieA'] + cnt['vittorieB'])} | {percent(cnt['patte'], cnt['partite'])} |")
    s['confrontoPolitiche'] = duels
    stylebad = []
    for key, c in styles.items():
        a, b, sa, sb = key.split('|'); q = c['vittorieA'] / (c['vittorieA'] + c['vittorieB']); draw = c['patte'] / c['partite']
        turn = c['turniTotali'] / c['partite']; low, hi = (.45, .55) if (a, b) == ('starter-spazienzio', 'starter-mara') else (.4, .6)
        why = []
        if a != b and not low <= q <= hi: why.append('quota')
        if draw > .1: why.append('patte')
        if not 6 <= turn <= 12: why.append('durata')
        if why: stylebad.append({'key': key, 'quotaA': q, 'patte': draw, 'turni': turn, 'fuoriSoglia': why})
    s['celleStiliFuori'] = stylebad
    lines += ['', f"Celle incontro × coppia di stili (politiche aggregate) fuori soglia: **{len(stylebad)} su {len(styles)}**.", '',
              '### Celle incontro × politiche fuori soglia', '', '| Incontro | Politica A / B | Quota A | Patte | Turni | Fuori |', '|---|---|---:|---:|---:|---|']
    for x in bad:
        a, b, pa, pb = x['key'].split('|')
        lines.append(f"| {names[a]}–{names[b]} | {pa} / {pb} | {100 * x['quotaA']:.2f}% | {100 * x['patte']:.2f}% | {x['turni']:.2f} | {', '.join(x['fuoriSoglia'])} |")
    lines += ['', '### Carte meno giocate quando presenti', '', '| Starter | Carta | Partite giocata / in mano | Quota |', '|---|---|---:|---:|']
    for dd in DECKS:
        regular = matrix['mazzi'][dd]['carte']
        for binding, c in sorted(regular.items(), key=lambda it: it[1]['partiteGiocata'] / it[1]['partiteInMano'] if it[1]['partiteInMano'] else 2)[:5]:
            lines.append(f"| {names[dd]} | {binding} | {c['partiteGiocata']} / {c['partiteInMano']} | {percent(c['partiteGiocata'], c['partiteInMano'])} |")
    summary['bracci'][arm] = s

summary['riferimentoPasso2'] = {'incontri': enc['P2']}
(out / 'summary.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('A:', summary['bracci']['A']['fuori'], 'encounters outside; B:', summary['bracci']['B']['fuori'])

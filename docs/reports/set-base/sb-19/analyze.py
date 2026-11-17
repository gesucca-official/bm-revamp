"""SB-19 Fase B1: read-only summary of the rounds of run.ps1. It launches no games.

Uso, dalla radice del repository:
  python docs/reports/set-base/sb-19/analyze.py identity RIF_TODAY_DIR RIF_NEW_DIR DEST   criterion 1: the two «Rif» rounds, cell by cell
  python docs/reports/set-base/sb-19/analyze.py rif RIF_DIR DEST                          the 28 pairs of the seven reference decks (numbers for the B2)
  python docs/reports/set-base/sb-19/analyze.py arm RIF_DIR ARM_DIR DEST                  criteria 2 and 3 for the decks of an arm
  python docs/reports/set-base/sb-19/analyze.py cards ARM_DIR DEST                        plays of the nine new cards per deck (heuristic bots)

Matchups are read from the side of the first named deck; «euristici» are the pairs where both bots are heuristic (aggressivo, prudente,
risorse), the base of the criteria (D93); the D95 minimum threshold is the one of sb-16i-analyze.py (share 35–65 %, not in mirrors; draws at
most 10 %; turns at most 12, mirrors excluded). A deck of the arms against its own reference counts as a mirror for the band and the duration
(the reference against itself is 50 % by definition), and is reported apart.
"""
import importlib.util, json, sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('sb16i', HERE.parent / 'sb-16i-analyze.py')
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)

REFERENCES = ['starter-spazienzio', 'starter-mara', 'starter-tossico', 'starter-pino', 'starter-gigi', 'prova-sergio', 'prova-duccio']
NAMES = dict(A.NAMES, **{'prova-sergio': 'Sergio', 'prova-duccio': 'Duccio'})
REFERENCE_OF = {'prova-b1-spazienzio': 'starter-spazienzio', 'prova-b1-mara': 'starter-mara', 'prova-b1-celestina': 'starter-tossico',
                'prova-b1-piera': 'starter-pino', 'prova-b1-beppe': 'starter-gigi', 'prova-b1-sergio': 'prova-sergio',
                'prova-b1-duccio': 'prova-duccio', 'prova-b1-equip': 'starter-gigi', 'prova-b1-estasi': 'starter-gigi'}
ISO = {'iso-estasi-estasi': ('starter-gigi', 'Beppe + Estasi ×2'), 'iso-estasi-grappa': ('starter-gigi', 'Beppe + Grappa ×2'),
       'iso-celestina-elemosina': ('starter-tossico', 'Celestina + Elemosina ×2'), 'iso-celestina-fiato': ('starter-tossico', 'Celestina + Secondo fiato ×2'),
       'iso-mara-mano': ('starter-mara', 'Mara + Mano lesta ×2'), 'iso-mara-elemosina': ('starter-mara', 'Mara + Elemosina ×2'),
       'iso-mara-fiato': ('starter-mara', 'Mara + Secondo fiato ×2'), 'iso-beppe-colpo': ('prova-b1-beppe-base', 'Beppe + Colpo allo stomaco ×2'),
       'iso-beppe-maleducazione': ('prova-b1-beppe-base', 'Beppe + Maleducazione ×2'), 'iso-beppe-coccio': ('prova-b1-beppe-base', 'Beppe + Coccio ×2')}
REFERENCE_OF.update({k: ('starter-gigi' if v[0].endswith('-base') else v[0]) for k, v in ISO.items()})
LABEL = {'prova-b1-equip': 'Equip (Beppe)', 'prova-b1-estasi': 'Estasi+Grappa (Beppe)', **{k: v[1] for k, v in ISO.items()}}
NEW = {'base.com.BeggingMoney': 'Elemosina molesta', 'bruiser.SickeningBlow': 'Colpo allo stomaco', 'bruiser.BadEducation': 'Maleducazione',
       'bruiser.CantFeelAnything': 'Non sento niente', 'base.com.ManoLesta': 'Mano lesta', 'base.com.SecondoFiato': 'Secondo fiato',
       'base.com.CoccioDiBottiglia': 'Coccio di bottiglia', 'base.items.MezzaMineraleSgasata': 'Mezza minerale sgasata',
       'base.items.GrappaDellaCasa': 'Grappa della casa'}
MEAN_LIMIT, ONE_LIMIT = 5.0, 10.0


def pct(x): return f'{x:.2f}%'.replace('.', ',')
def num(x): return f'{x:.2f}'.replace('.', ',')
def sgn(x): return f'{x:+.2f}'.replace('.', ',')
def name(d): return NAMES.get(d) or LABEL.get(d) or 'Add. ' + NAMES.get(REFERENCE_OF.get(d, ''), d)


def view(pairs, x, f, group='heur'):
    """Share / draws / turns of deck x against deck f, from x's side, whichever way the pair was played."""
    if x == f:
        key = (x, x)
        return dict(pairs[key][group]) if key in pairs else None
    if (x, f) in pairs:
        return dict(pairs[(x, f)][group])
    if (f, x) in pairs:
        p = pairs[(f, x)][group]
        return {'games': p['games'], 'share': 100 - p['share'], 'draws': p['draws'], 'turns': p['turns']}
    return None


def identity(today, new, dest):
    a, b = A.read(Path(today) / 'matrix.json'), A.read(Path(new) / 'matrix.json')
    same_cells = a['celle'] == b['celle']
    same_checks = a['invarianti'] == b['invarianti']
    diff = []
    if not same_cells:
        for ca, cb in zip(a['celle'], b['celle']):
            if ca != cb: diff.append({'today': ca, 'new': cb})
            if len(diff) >= 5: break
    result = {'sameCells': same_cells, 'cells': len(a['celle']), 'games': a['invarianti']['partite'], 'sameInvariants': same_checks,
              'violations': sum(b['invarianti']['violazioni'].values()), 'firstDifferences': diff,
              'sameMarkdownBody': None}
    Path(str(dest) + '.json').write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps(result, indent=1, ensure_ascii=False))
    return same_cells and same_checks


def rif(run, dest):
    m = A.read(Path(run) / 'matrix.json')
    pairs = A.pairs(m)
    md = ['# SB-19 B1: «Rif», i sette mazzi di riferimento fra loro (soli euristici)', '',
          'Quota del primo nominato sulle decisive; patte e turni su tutte le partite. Soglia minima D95 sotto la tabella.', '',
          '| Incontro | Quota | Patte | Turni | Fuori D95 |', '|---|---:|---:|---:|---|']
    rows, outside = [], []
    for i, x in enumerate(REFERENCES):
        for f in REFERENCES[i:]:
            h = view(pairs, x, f)
            gaps = A.minimum(x, f, h)
            rows.append({'a': x, 'b': f, **{k: h[k] for k in ('games', 'share', 'draws', 'turns')}, 'gaps': gaps})
            if gaps: outside.append((x, f, gaps))
            md.append(f"| {NAMES[x]}–{NAMES[f]} | {pct(h['share'])} | {pct(h['draws'])} | {num(h['turns'])} | "
                      f"{', '.join(f'{k} {num(v)}' for k, v in gaps.items()) or '—'} |")
    md += ['', f"Incontri fuori D95: {len(outside)} su {len(rows)}. Partite {m['invarianti']['partite']}; violazioni "
               f"{sum(m['invarianti']['violazioni'].values())}; bound oltre il tetto {sum(1 for b in m['tettoBound'] if b['viola'])}."]
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    Path(str(dest) + '.json').write_text(json.dumps({'rows': rows, 'outside': len(outside)}, indent=1, ensure_ascii=False) + '\n',
                                         encoding='utf-8', newline='\n')
    print('\n'.join(md))


def arm(rif_dir, arm_dir, dest):
    ref = A.pairs(A.read(Path(rif_dir) / 'matrix.json'))
    m = A.read(Path(arm_dir) / 'matrix.json')
    cur = A.pairs(m)
    decks = [d for d in REFERENCE_OF if any((d, f) in cur for f in REFERENCES)]
    result = {'decks': {}, 'violations': sum(m['invarianti']['violazioni'].values()),
              'boundViolations': sum(1 for b in m['tettoBound'] if b['viola']), 'games': m['invarianti']['partite']}
    md = ['# SB-19 B1: ' + Path(arm_dir).name, '',
          'Quota del mazzo con le aggiunte sulle decisive, soli euristici, contro i sette di riferimento; «guadagno» = quota meno quella del suo riferimento '
          '(il riferimento contro se stesso vale 50). Criterio 2: media dei sette al più 5 punti, un singolo confronto al più 10, nessuna uscita dal 35–65 se '
          'il riferimento ci stava. Criterio 3: patte al più 10 %, turni al più 12 fuori dagli specchi.', '']
    for d in decks:
        r = REFERENCE_OF[d]
        rows, gains, ownmirror = [], [], None
        for f in REFERENCES:
            x, base = view(cur, d, f), view(ref, r, f)
            gain = x['share'] - (50.0 if f == r else base['share'])
            mirror = f == r
            band_out = not mirror and not (35 <= x['share'] <= 65) and (35 <= base['share'] <= 65)
            gaps = {}
            if x['draws'] > 10: gaps['patte'] = round(x['draws'] - 10, 2)
            if not mirror and x['turns'] > 12: gaps['durata'] = round(x['turns'] - 12, 2)
            rows.append({'foe': f, 'share': x['share'], 'ref': 50.0 if f == r else base['share'], 'gain': gain, 'draws': x['draws'],
                         'turns': x['turns'], 'mirror': mirror, 'bandOut': band_out, 'gaps': gaps})
            gains.append(gain)
        mean = sum(gains) / len(gains)
        mean6 = sum(g['gain'] for g in rows if not g['mirror']) / 6
        biggest = max(rows, key=lambda g: g['gain'])
        fails = []
        if mean > MEAN_LIMIT: fails.append(f'media {num(mean)} > 5')
        for g in rows:
            if g['gain'] > ONE_LIMIT: fails.append(f"{NAMES[g['foe']]}: +{num(g['gain'])} > 10")
            if g['bandOut']: fails.append(f"{NAMES[g['foe']]}: {pct(g['share'])} fuori 35–65")
            for k, v in g['gaps'].items(): fails.append(f"{NAMES[g['foe']]}: {k} +{num(v)}")
        result['decks'][d] = {'reference': r, 'meanGain': mean, 'meanGainWithoutMirror': mean6, 'maxGain': biggest['gain'],
                              'maxGainFoe': biggest['foe'], 'rows': rows, 'fails': fails, 'passes': not fails}
        md += [f'## {name(d)} (`{d}`, riferimento {NAMES[r]})', '', '| Contro | Quota | Riferimento | Guadagno | Patte | Turni | Note |',
               '|---|---:|---:|---:|---:|---:|---|']
        for g in rows:
            note = ', '.join(filter(None, ['specchio del riferimento' if g['mirror'] else '', 'fuori 35–65' if g['bandOut'] else '',
                                           *[f'{k} +{num(v)}' for k, v in g['gaps'].items()]]))
            md.append(f"| {NAMES[g['foe']]} | {pct(g['share'])} | {pct(g['ref'])} | {sgn(g['gain'])} | {pct(g['draws'])} | {num(g['turns'])} | {note or '—'} |")
        md += ['', f"Guadagno medio {sgn(mean)} (senza lo specchio {sgn(mean6)}); massimo {sgn(biggest['gain'])} contro {NAMES[biggest['foe']]}. "
                   f"**{'Passa 2 e 3' if not fails else 'Non passa: ' + '; '.join(fails)}.**", '']
    md += [f"Partite {result['games']}; violazioni degli invarianti {result['violations']}; bound oltre il tetto {result['boundViolations']}.", '',
           '| Mazzo | Guadagno medio | Senza specchio | Massimo | Esito |', '|---|---:|---:|---:|---|']
    for d, r in result['decks'].items():
        md.append(f"| {name(d)} | {sgn(r['meanGain'])} | {sgn(r['meanGainWithoutMirror'])} | {sgn(r['maxGain'])} ({NAMES[r['maxGainFoe']]}) | "
                  f"{'passa' if r['passes'] else 'no'} |")
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    Path(str(dest) + '.json').write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md[-(len(result['decks']) + 6):]))


def cards(arm_dir, dest):
    obs = A.read(Path(arm_dir) / 'deck-observations.json')
    agg = defaultdict(Counter)
    for key, c in obs.items():
        deck, foe, g = key.split('|')
        if g != 'heur' or not deck.startswith('prova-b1-'): continue
        for k, v in c.items(): agg[deck][k] += v
    md = ['# SB-19 B1: giocate delle nove carte nuove (soli euristici)', '', '| Mazzo | Carta | Partite in cui è giocata | Giocate per partita |', '|---|---|---:|---:|']
    out = {}
    for deck in REFERENCE_OF:
        c = agg.get(deck)
        if not c: continue
        games = max(1, c['games'])
        for b, label in NEW.items():
            if f'card/{b}/plays' not in c and f'card/{b}/inHand' not in c: continue
            share, per = 100 * c[f'card/{b}/playedGames'] / games, c[f'card/{b}/plays'] / games
            out.setdefault(deck, {})[b] = {'playedGamesShare': share, 'playsPerGame': per}
            md.append(f'| {name(deck)} | {label} | {pct(share)} | {num(per)} |')
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    Path(str(dest) + '.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'identity': raise SystemExit(0 if identity(*sys.argv[2:5]) else 1)
    elif cmd == 'rif': rif(*sys.argv[2:4])
    elif cmd == 'arm': arm(*sys.argv[2:5])
    elif cmd == 'cards': cards(*sys.argv[2:4])
    else: raise SystemExit(__doc__)

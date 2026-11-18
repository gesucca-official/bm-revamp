"""SB-19 Fase B1b: read-only reading of the isolation rounds and of the decks with the additions against the band of D131. It launches no games.

Uso, dalla radice del repository:
  python docs/reports/set-base/sb-19/b1b/analyze-b1b.py iso ROOT_B1 ROOT_B1B DEST     isolation rounds -> table per card and the choice
  python docs/reports/set-base/sb-19/b1b/analyze-b1b.py decks RIF_DIR ARM_DIR DEST     the nine decks with the additions against the band

ROOT_B1 holds round-rif-new and round-iso of the B1 (variant V0); ROOT_B1B holds round-v1, round-v2, round-v3.
Band (D131 (1), the rule of the report § 2): mean gain over the seven references between 0 and +10; no comparison above +15; draws at most 10 %;
turns at most 12 outside the mirrors. Distance from the band: sum of the excesses in points. The choice per card: the variant in the band
closest to +5, else the one closest to the band (the card is flagged).
"""
import importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('sb19analyze', HERE.parent / 'analyze.py')
S = importlib.util.module_from_spec(spec)
spec.loader.exec_module(S)
S.REFERENCE_OF.update({'iso-mara-mano2': 'starter-mara', 'iso-spazienzio-nsn': 'starter-spazienzio', 'iso-duccio-minerale': 'prova-duccio'})

# card -> (iso id, label, variants [(name, round, deck id in that round)]); V0 from the round of the B1
CARDS = {
    'Mano lesta': 'iso-mara-mano', 'Coccio di bottiglia': 'iso-beppe-coccio', 'Elemosina molesta': 'iso-mara-elemosina',
    'Non sento niente': 'iso-spazienzio-nsn', 'Mezza minerale sgasata': 'iso-duccio-minerale', 'Maleducazione': 'iso-beppe-maleducazione',
    'Secondo fiato': 'iso-mara-fiato', 'Colpo allo stomaco': 'iso-beppe-colpo',
}
LEVELS = {'v1': 'round-v1', 'v2': 'round-v2b', 'v3': 'round-v3b'}


def judge(result):
    """result: one deck of analyze.arm. Returns the band reading."""
    rows = result['rows']
    mean = result['meanGain']
    top = max(r['gain'] for r in rows)
    draws = max(r['draws'] for r in rows)
    turns = max([r['turns'] for r in rows if not r['mirror']] or [0])
    gaps = {'media': max(0.0, -mean) + max(0.0, mean - 10), 'massimo': max(0.0, top - 15), 'patte': max(0.0, draws - 10), 'durata': max(0.0, turns - 12)}
    distance = sum(gaps.values())
    return {'mean': mean, 'max': top, 'maxFoe': result['maxGainFoe'], 'draws': draws, 'turns': turns, 'gaps': gaps, 'distance': distance,
            'inBand': distance < 1e-9, 'toFive': abs(mean - 5)}


def arm_of(rif, run, tmp):
    S.arm(rif, run, tmp)
    return json.loads(Path(str(tmp) + '.json').read_text(encoding='utf-8'))


def iso(root_b1, root_b1b, dest, revised=False):
    cards_map, levels = CARDS, LEVELS
    if revised:
        cards_map = {'Mano lesta': 'iso-mara-mano2', 'Elemosina molesta': 'iso-celestina-elemosina'}
        levels = {'v0': 'round-rv0', 'v1': 'round-rv1', 'v2': 'round-rv2', 'v3': 'round-rv3'}
    rif = Path(root_b1) / 'round-rif-new'
    out = {}
    base = arm_of(rif, Path(root_b1) / 'round-iso', Path(dest).parent / '_tmp-v0')
    for card, iso_id in cards_map.items():
        entries = {}
        if iso_id in base['decks'] and not (revised and card == 'Mano lesta'):
            entries['V0'] = judge(base['decks'][iso_id])
        out[card] = entries
    for level, folder in levels.items():
        res = arm_of(rif, Path(root_b1b) / folder, Path(dest).parent / ('_tmp-' + folder))
        for card, iso_id in cards_map.items():
            if iso_id in res['decks']:
                out[card][level.upper()] = judge(res['decks'][iso_id])
    md = ['# SB-19 B1b: isolamenti per variante e scelta', '',
          'Guadagno medio sui sette riferimenti (specchio incluso), massimo confronto, patte massime, durata massima fuori dagli specchi, distanza dalla banda (0 = dentro) e distanza da +5.', '']
    choice = {}
    for card, entries in out.items():
        md += [f'## {card} (`{cards_map[card]}`)', '', '| Variante | Media | Massimo | Patte max | Turni max | Dalla banda | Da +5 | Nella banda |', '|---|---:|---:|---:|---:|---:|---:|---|']
        for v, j in entries.items():
            md.append(f"| {v} | {S.sgn(j['mean'])} | {S.sgn(j['max'])} ({S.NAMES[j['maxFoe']]}) | {S.pct(j['draws'])} | {S.num(j['turns'])} | {S.num(j['distance'])} | {S.num(j['toFive'])} | {'sì' if j['inBand'] else 'no'} |")
        inside = [(j['toFive'], v) for v, j in entries.items() if j['inBand']]
        if inside:
            pick = min(inside)[1]; flag = False
        else:
            pick = min((j['distance'], v) for v, j in entries.items())[1]; flag = True
        choice[card] = {'variant': pick, 'flagged': flag}
        md += ['', f"**Scelta: {pick}**{' (nessuna nella banda: la più vicina, carta segnalata)' if flag else ''}.", '']
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    Path(str(dest) + '.json').write_text(json.dumps({'cards': out, 'choice': choice}, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md))


def decks(rif, run, dest):
    res = arm_of(rif, run, Path(dest).parent / '_tmp-decks')
    md = ['# SB-19 B1b: i mazzi con le aggiunte contro la banda di D131', '', '| Mazzo | Media | Massimo | Patte max | Turni max | Dalla banda | Nella banda |', '|---|---:|---:|---:|---:|---:|---|']
    out = {}
    for d, r in res['decks'].items():
        j = judge(r); out[d] = j
        md.append(f"| {S.name(d)} | {S.sgn(j['mean'])} | {S.sgn(j['max'])} ({S.NAMES[j['maxFoe']]}) | {S.pct(j['draws'])} | {S.num(j['turns'])} | {S.num(j['distance'])} | {'sì' if j['inBand'] else 'no'} |")
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    Path(str(dest) + '.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'iso': iso(*sys.argv[2:5])
    elif cmd == 'iso2': iso(*sys.argv[2:5], revised=True)
    elif cmd == 'decks': decks(*sys.argv[2:5])
    else: raise SystemExit(__doc__)

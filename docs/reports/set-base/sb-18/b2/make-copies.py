"""SB-18 Fase B2 (D126 (2)): the calibration copies of the V3, costs only, by exact text substitution.
Run from the repository root: python docs/reports/set-base/sb-18/b2/make-copies.py
Factor applied to the V3 costs (Nocche 8, E allora? 5, Capocciata 14, Testa dura 16), nearest integer, ties down.
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent
V3 = HERE.parent / 'b' / 'bozza-v3.json'
BASE = {'NoccheSbucciate': ('ROC-AR1', 8), 'EAllora': ('ROC-AR3', 5), 'Capocciata': ('ROC-AR4', 14), 'TestaDura': ('ROC-AR6', 16)}
COPIES = {'k170': {'NoccheSbucciate': 14, 'EAllora': 8, 'Capocciata': 24, 'TestaDura': 27},
          'k185': {'NoccheSbucciate': 15, 'EAllora': 9, 'Capocciata': 26, 'TestaDura': 30}}


def make(costs, text):
    for card, (slot, old) in BASE.items():
        new = costs[card]
        line = next(l for l in text.splitlines() if f'"binding": "base.rocco.{card}"' in l)
        fixed = line.replace(f'"cost": {{"HEALTH": {old}}}', f'"cost": {{"HEALTH": {new}}}', 1)
        fixed = fixed.replace(f'{slot} · {old} HEALTH:', f'{slot} · {new} HEALTH:', 1)
        assert fixed.count(f'"HEALTH": {new}') == 1 and f'{slot} · {new} HEALTH:' in fixed, card
        assert text.count(line) == 1, card
        text = text.replace(line, fixed)
    return text


if __name__ == '__main__':
    v3 = V3.read_text(encoding='utf-8')
    for name, costs in COPIES.items():
        out = make(costs, v3)
        (HERE / f'bozza-{name}.json').write_text(out, encoding='utf-8', newline='')
        print(name, sum(a != b for a, b in zip(v3.splitlines(), out.splitlines())), 'lines changed')

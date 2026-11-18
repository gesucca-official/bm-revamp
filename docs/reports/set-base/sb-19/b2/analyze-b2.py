"""SB-19 Fase B2 (D130–D133): read-only reading of the rounds of the two items. It launches no games.

Uso, dalla radice del repository:
  python docs/reports/set-base/sb-19/b2/analyze-b2.py decks RIF_DIR ARM_DIR DEST     the decks of an arm against the band of D131
  python docs/reports/set-base/sb-19/b2/analyze-b2.py inplay ARM_DIR DEST            what the items do in play (in-play.json of the arm)

Band (D131 (1)): mean gain over the seven references between 0 and +10, no comparison above +15, draws at most 10 %, turns at most 12 outside
the mirrors. The decks are read against the reference they derive from. The band of 35–65 % is only for the starters among themselves (D131 (1)).
«inplay» is without a threshold (proposal A2, section 7, criterion 5).
"""
import importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('analyze_b1b', HERE.parent / 'b1b' / 'analyze-b1b.py')
B = importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)
S = B.S

DECK_REFERENCE = {'prova-b2-spazienzio': 'starter-spazienzio', 'prova-b2-beppe': 'starter-gigi', 'prova-b2-sergio-conto': 'prova-sergio',
                  'prova-b2-sergio-sigaretta': 'prova-sergio', 'prova-b2-celestina': 'starter-tossico', 'prova-b2-rischio9': 'starter-tossico',
                  'prova-b2-rischio10': 'prova-sergio', 'iso-b2-conto': 'starter-spazienzio', 'iso-b2-sigaretta': 'starter-tossico',
                  'iso-b2-sigaretta-sergio': 'prova-sergio'}
LABEL = {'prova-b2-spazienzio': 'Spazienzio + Conto', 'prova-b2-beppe': 'Beppe + Conto', 'prova-b2-sergio-conto': 'Sergio + Conto',
         'prova-b2-sergio-sigaretta': 'Sergio + Sigaretta', 'prova-b2-celestina': 'Celestina + Sigaretta',
         'prova-b2-rischio9': 'Rischio 9 (Celestina, Sigaretta + Scatto)', 'prova-b2-rischio10': 'Rischio 10 (Sergio, Conto + Scatto)',
         'iso-b2-conto': 'Iso: Spazienzio starter + Conto ×2', 'iso-b2-sigaretta': 'Iso: Celestina starter + Sigaretta ×2',
         'iso-b2-sigaretta-sergio': 'Iso: Sergio + Sigaretta ×2'}
S.REFERENCE_OF.update(DECK_REFERENCE)
S.LABEL.update(LABEL)


def decks(rif, run, dest):
    B.decks(rif, run, dest)


def inplay(run, dest):
    data = json.loads((Path(run) / 'in-play.json').read_text(encoding='utf-8'))
    md = ['# SB-19 B2: gli oggetti in campo (senza soglia)', '',
          'Per oggetto e personaggio che lo tiene: fine turno in cui l\'oggetto agisce, come esce (consumato, venduto, passato all\'altro, distrutto, scalzato '
          'dalla capacità) e T presa da chi non è immune. «Rubato» = passato con Steal; «Scatto» = passato con Scatto Repentino.', '',
          '| Oggetto | Chi lo tiene | In campo (fine turni) | Consumato | Venduto | Rubato | Scatto | Distrutto | Scalzato | A fine partita | T presa (non immune) |',
          '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|']
    total = {}
    for item, holders in sorted(data.items()):
        t = total.setdefault(item, {})
        for holder, c in sorted(holders.items()):
            row = [c.get(k, 0) for k in ('applied', 'consumed', 'sold', 'stolen', 'passed', 'destroyed', 'displaced', 'atEnd', 'toxicityNotImmune')]
            for k, v in zip(('applied', 'consumed', 'sold', 'stolen', 'passed', 'destroyed', 'displaced', 'atEnd', 'toxicityNotImmune'), row):
                t[k] = t.get(k, 0) + v
            md.append(f'| {item} | {holder} | ' + ' | '.join(str(x) for x in row) + ' |')
        r = t
        md.append(f'| **{item}** | tutti | ' + ' | '.join(str(r.get(k, 0)) for k in ('applied', 'consumed', 'sold', 'stolen', 'passed', 'destroyed', 'displaced', 'atEnd', 'toxicityNotImmune')) + ' |')
    Path(str(dest) + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8', newline='\n')
    Path(str(dest) + '.json').write_text(json.dumps({'byHolder': data, 'total': total}, indent=1, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print('\n'.join(md))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'decks': decks(*sys.argv[2:5])
    elif cmd == 'inplay': inplay(*sys.argv[2:4])
    else: raise SystemExit(__doc__)

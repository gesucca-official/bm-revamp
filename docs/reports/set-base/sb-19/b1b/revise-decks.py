"""SB-19 Fase B1b: rewrites in bozza.json the decks with the additions whose Mano lesta swap was revised (report § 6).

Uso, dalla radice del repository: python docs/reports/set-base/sb-19/b1b/revise-decks.py
Only the blocks of prova-b1-mara and prova-b1-duccio change (the swaps of make-variants.REVISED); the rest stays byte for byte.
"""
import importlib.util, json, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('make_variants', HERE / 'make-variants.py')
V = importlib.util.module_from_spec(spec)
spec.loader.exec_module(V)
M = V.M

text = M.DRAFT.read_text(encoding='utf-8')
draft = json.loads(text)
specs = {s[0]: s for s in V.revised_decks()}
for deck_id in V.REVISED:
    block, changed = M.deck_block(draft, specs[deck_id])
    new = '\n'.join('    ' + line for line in json.dumps(block, ensure_ascii=False, indent=2).split('\n'))
    pattern = re.compile(r'    \{\n      "id": "' + deck_id + r'",.*?\n    \}(?=,\n|\n  \])', re.S)
    assert len(pattern.findall(text)) == 1, deck_id
    text = pattern.sub(lambda m: new, text)
    print(deck_id, sum(block['cards'].values()), 'carte,', changed, 'copie nuove')
M.DRAFT.write_text(text, encoding='utf-8', newline='\n')

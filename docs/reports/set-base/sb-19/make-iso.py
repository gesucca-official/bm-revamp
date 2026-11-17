"""SB-19 Fase B1: isolation decks for the cards that may be responsible for a breach of the criteria of the round (D129, D130).

Uso, dalla radice del repository: python docs/reports/set-base/sb-19/make-iso.py DEST.json

Writes a copy of bozza.json that adds, to the nine decks with the additions, the isolation decks: each is the reference deck with the
swap of ONE new card only (the same swap as in the deck of make-bozza.py, nothing else changed). The copy is a measuring file, not a draft:
bozza.json is not touched. Ids: iso-<deck>-<card>, listed in ISO below, written before the isolation round.
"""
import importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('make_bozza', HERE / 'make-bozza.py')
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)

# iso id -> (deck of make-bozza.py, the new card kept)
ISO = {
    'iso-estasi-estasi': ('prova-b1-estasi', M.ESTASI), 'iso-estasi-grappa': ('prova-b1-estasi', M.GRAPPA),
    'iso-celestina-elemosina': ('prova-b1-celestina', M.ELEMOSINA), 'iso-celestina-fiato': ('prova-b1-celestina', M.FIATO),
    'iso-mara-mano': ('prova-b1-mara', M.MANO), 'iso-mara-elemosina': ('prova-b1-mara', M.ELEMOSINA), 'iso-mara-fiato': ('prova-b1-mara', M.FIATO),
    'iso-beppe-colpo': ('prova-b1-beppe', M.COLPO), 'iso-beppe-maleducazione': ('prova-b1-beppe', M.MALEDUCAZIONE),
    'iso-beppe-coccio': ('prova-b1-beppe', M.COCCIO),
}


def main(dest):
    text = M.DRAFT.read_text(encoding='utf-8')
    draft = json.loads(text)
    specs = {s[0]: s for s in M.DECKS}
    for iso, (deck, card) in ISO.items():
        _, base, swaps = specs[deck]
        kept = [s for s in swaps if card in s[1]]
        assert len(kept) == 1, (iso, card)
        block, changed = M.deck_block(draft, (iso, base, kept))
        assert changed == 2 or card == M.GRAPPA and changed == 2, (iso, changed)
        draft['decks'].append(block)
    Path(dest).write_text(json.dumps(draft, ensure_ascii=False, indent=1) + '\n', encoding='utf-8', newline='\n')
    print('scritti', len(ISO), 'mazzi di isolamento in', dest)


if __name__ == '__main__':
    main(sys.argv[1])

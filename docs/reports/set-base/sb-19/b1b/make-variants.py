"""SB-19 Fase B1b (D131): measuring copies of bozza.json, one per variant level, with the isolation decks of the variants.

Uso, dalla radice del repository: python docs/reports/set-base/sb-19/b1b/make-variants.py LEVEL DEST.json     (LEVEL = v1, v2, v3)
        python docs/reports/set-base/sb-19/b1b/make-variants.py --list

Each copy sets the values of the cards of the level (VARIANTS below, the table of the report § 1) and adds the isolation decks (ISO: the
reference deck with the swap of ONE new card only, as make-iso.py). bozza.json is not touched. The same ids in the three copies: the
rounds are told apart by the output folder.
"""
import copy, importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('make_bozza', HERE.parent / 'make-bozza.py')
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)


def card(draft, binding):
    return next(c for c in draft['cards'] if c['binding'] == binding)


def set_cost(c, resource, amount):
    # a Java card (Elemosina, Maleducazione) must keep its «cost» field, even at 0; a data card without cost has none
    if amount or c.get('java'): c['cost'] = {resource: amount}
    else: c.pop('cost', None)


def mano(n):
    def f(d):
        c = card(d, M.MANO)
        c['self'][0]['amount'] = n
        c['target'][0]['amount'] = n
    return f


def coccio(factor, cost=5):
    def f(d):
        c = card(d, M.COCCIO)
        c['self'][0]['factor'] = factor
        set_cost(c, 'VIOLENCE', cost)
    return f


def elemosina(cost, priority):
    def f(d):
        c = card(d, M.ELEMOSINA)
        set_cost(c, 'ALERTNESS', cost)
        c['priority'] = priority
    return f


def nsn(cost, factor):
    def f(d):
        c = card(d, M.NSN)
        set_cost(c, 'VIOLENCE', cost)
        c['self'][0]['factor'] = factor
    return f


def minerale(a):
    def f(d):
        card(d, M.MINERALE)['self'][1]['amount'] = a
    return f


def maleducazione(hit, cost):
    def f(d):
        c = card(d, M.MALEDUCAZIONE)
        c['params']['hitDamage'] = hit
        set_cost(c, 'VIOLENCE', cost)
    return f


def fiato(h):
    def f(d):
        card(d, M.FIATO)['self'][3]['amount'] = h
    return f


# level -> card key -> mutator (the table of the report, § 1)
VARIANTS = {
    'v0': {'mano': mano(5)},
    'v1': {'mano': mano(8), 'coccio': coccio(2.0), 'elemosina': elemosina(5, 0), 'nsn': nsn(5, 0.35), 'minerale': minerale(10),
           'maleducazione': maleducazione(10, 5), 'fiato': fiato(15)},
    'v2': {'mano': mano(10), 'coccio': coccio(2.5), 'elemosina': elemosina(0, 0), 'nsn': nsn(10, 0.25), 'minerale': minerale(15),
           'maleducazione': maleducazione(12, 5), 'fiato': fiato(12)},
    'v3': {'mano': mano(15), 'coccio': coccio(2.0, 0), 'elemosina': elemosina(0, 1), 'nsn': nsn(5, 0.25), 'minerale': minerale(20),
           'maleducazione': maleducazione(12, 0)},
}

# Revision of the swaps (declared in the report, § 6): Mano lesta (DISRUPT) took the place of DAMAGE cards (Spintone, Sputo) in the decks of Mara
# and Duccio (Piera has no card of a near role to give up without touching her L engine: unchanged), a clear change of role; now it takes cards of its own family (A generators, disrupts, a defence). Nothing else changes.
REVISED = {
    'prova-b1-mara': {M.MANO: ({'base.mara.Slalom': 2}, {M.MANO: 2})},
    'prova-b1-duccio': {M.MANO: ({'base.rocco.TeLoSpiegoIo': 1, M.TART: 1}, {M.MANO: 2})},
}


def revised_decks():
    out = []
    for deck_id, base, swaps in M.DECKS:
        new = []
        for out_, into in swaps:
            rev = REVISED.get(deck_id, {})
            hit = [k for k in into if k in rev]
            new.append(rev[hit[0]] if hit else (out_, into))
        out.append((deck_id, base, new))
    return out


# iso id -> (card key, deck of make-bozza.py or the starter + swap, card)
ISO = {
    'iso-mara-mano2': ('mano', 'prova-b1-mara', M.MANO), 'iso-beppe-coccio': ('coccio', 'prova-b1-beppe', M.COCCIO),
    'iso-celestina-elemosina': ('elemosina', 'prova-b1-celestina', M.ELEMOSINA), 'iso-beppe-maleducazione': ('maleducazione', 'prova-b1-beppe', M.MALEDUCAZIONE),
    'iso-mara-fiato': ('fiato', 'prova-b1-mara', M.FIATO),
    'iso-spazienzio-nsn': ('nsn', 'prova-b1-spazienzio', M.NSN), 'iso-duccio-minerale': ('minerale', 'prova-b1-duccio', M.MINERALE),
}


def build(level):
    draft = json.loads(M.DRAFT.read_text(encoding='utf-8'))
    values = VARIANTS[level]
    for fn in values.values(): fn(draft)
    specs = {s[0]: s for s in revised_decks()}
    for iso, (key, deck, binding) in ISO.items():
        if key not in values: continue
        _, base, swaps = specs[deck]
        kept = [s for s in swaps if binding in s[1]]
        assert len(kept) == 1, (iso, binding)
        block, changed = M.deck_block(draft, (iso, base, kept))
        assert changed == 2, (iso, changed)
        draft['decks'].append(block)
    return draft


def main():
    if sys.argv[1] == '--list':
        for level, values in VARIANTS.items(): print(level, sorted(values))
        return
    level, dest = sys.argv[1], sys.argv[2]
    draft = build(level)
    Path(dest).write_text(json.dumps(draft, ensure_ascii=False, indent=1) + '\n', encoding='utf-8', newline='\n')
    print('scritti', level, 'in', dest, 'mazzi d\'isolamento:', sum(1 for d in draft['decks'] if d['id'].startswith('iso-')))


if __name__ == '__main__':
    main()

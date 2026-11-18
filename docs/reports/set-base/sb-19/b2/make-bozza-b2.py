"""SB-19 Fase B2 (D130, proposal A2 sections 3 and 7): OGG-17 «Conto del tavolo sei» and OGG-18 «Sigaretta accesa» into bozza.json, and the decks
of the B2, written before measuring.

Uso, dalla radice del repository:
  python docs/reports/set-base/sb-19/b2/make-bozza-b2.py            writes the two items and the decks into bozza.json (once)
  python docs/reports/set-base/sb-19/b2/make-bozza-b2.py --check    prints the decks, writes nothing
  python docs/reports/set-base/sb-19/b2/make-bozza-b2.py --m2 DEST  writes to DEST a copy of bozza.json with the M2 values
                                                                    (Conto +12 V, Sigaretta +1 T), the arm M2 of the proposal

Decks (report § 2): each one a deck of the B1 (prova-b1-*, as left by the B1b) with at most 4 copies changed, swapped with cards of the same role
(the two items are RESOURCES, Scatto Repentino is ITEMS); the isolation decks change one pair in a reference deck.
"""
import importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('make_bozza', HERE.parent / 'make-bozza.py')
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)

CONTO, SIGARETTA = 'base.items.ContoDelTavoloSei', 'base.items.SigarettaAccesa'
NEGRONI, PASTICCA, ESPRESSO = 'com.items.CocktailOnTheGround', 'base.items.PasticcaTrovataSulBancone', 'base.items.EspressoDelDistributore'
STRETTA, ELEMOSINA, SCATTO = 'base.gigi.UnaStrettaDiProva', 'base.com.BeggingMoney', 'base.com.ShuffleFeet'
DASH = '—'


def items(conto_v=15, sigaretta_t=2):
    return [
        {'binding': CONTO, 'rarity': 'UNCOMMON', 'kind': 'ITEM',
         'inPlay': [{'op': 'lose', 'resource': 'ALERTNESS', 'amount': 3}],
         'self': [{'op': 'gain', 'resource': 'VIOLENCE', 'amount': conto_v}],
         'gui': {'name': 'Conto del tavolo sei', 'description': f'OGG-17 · In campo: a fine turno −3 A. Consumato: +{conto_v} V.',
                 'inPlay': '−3 A', 'role': 'RESOURCES', 'gains': f'+{conto_v} V', 'damage': DASH, 'damageAmount': DASH}},
        {'binding': SIGARETTA, 'rarity': 'RARE', 'kind': 'ITEM',
         'inPlay': [{'op': 'gain', 'resource': 'TOXICITY', 'amount': sigaretta_t}],
         'self': [{'op': 'gain', 'resource': 'ALERTNESS', 'amount': 10}],
         'gui': {'name': 'Sigaretta accesa', 'description': f'OGG-18 · In campo: a fine turno +{sigaretta_t} T. Consumato: +10 A.',
                 'inPlay': f'+{sigaretta_t} T', 'role': 'RESOURCES', 'gains': '+10 A', 'damage': DASH, 'damageAmount': DASH}},
    ]


# (id, base deck, [(out, into)]): swaps of the same role, declared in the report § 2.
DECKS = [
    ('prova-b2-spazienzio', 'prova-b1-spazienzio', [({NEGRONI: 2}, {CONTO: 2})]),
    ('prova-b2-beppe', 'prova-b1-beppe', [({ESPRESSO: 1, STRETTA: 1}, {CONTO: 2})]),
    ('prova-b2-sergio-conto', 'prova-b1-sergio', [({ESPRESSO: 2}, {CONTO: 2})]),
    ('prova-b2-sergio-sigaretta', 'prova-b1-sergio', [({ESPRESSO: 2}, {SIGARETTA: 2})]),
    ('prova-b2-celestina', 'prova-b1-celestina', [({PASTICCA: 2}, {SIGARETTA: 2})]),
    # Rischio 9: Sigaretta ×2 e Scatto Repentino ×2 nel mazzo di Celestina.
    ('prova-b2-rischio9', 'prova-b1-celestina', [({PASTICCA: 2}, {SIGARETTA: 2}), ({ELEMOSINA: 2}, {SCATTO: 2})]),
    # Rischio 10: Conto ×2, Mano lesta ×2 (già nel mazzo) e Scatto Repentino ×2, contro Mara (fra i sette).
    ('prova-b2-rischio10', 'prova-b1-sergio', [({ESPRESSO: 2}, {CONTO: 2}), ({ELEMOSINA: 2}, {SCATTO: 2})]),
    # Isolamenti: una sola coppia cambiata in un mazzo di riferimento.
    ('iso-b2-conto', 'starter-spazienzio', [({NEGRONI: 2}, {CONTO: 2})]),
    ('iso-b2-sigaretta', 'starter-tossico', [({PASTICCA: 2}, {SIGARETTA: 2})]),
    ('iso-b2-sigaretta-sergio', 'prova-sergio', [({ESPRESSO: 2}, {SIGARETTA: 2})]),
]


def blocks(draft):
    out = []
    for spec_ in DECKS:
        block, changed = M.deck_block(draft, spec_)
        assert changed <= 4, spec_[0]
        out.append((block, changed))
    return out


def main():
    text = M.DRAFT.read_text(encoding='utf-8')
    draft = json.loads(text)
    if '--m2' in sys.argv:
        dest = Path(sys.argv[sys.argv.index('--m2') + 1])
        for a, b in zip(items(), items(12, 1)):
            line, new = json.dumps(a, ensure_ascii=False, separators=(', ', ': ')), json.dumps(b, ensure_ascii=False, separators=(', ', ': '))
            assert text.count(line) == 1, a['binding']
            text = text.replace(line, new)
        dest.write_text(text, encoding='utf-8', newline='\n')
        print('M2 scritta in', dest)
        return
    if CONTO in {c['binding'] for c in draft['cards']}:
        if '--check' not in sys.argv: raise SystemExit('già scritto')
    else:
        draft['cards'].extend(items())
    made = blocks(draft)
    if '--check' in sys.argv:
        for block, changed in made:
            print(block['id'], sum(block['cards'].values()), 'carte,', changed, 'copie nuove')
        return
    lines = ',\n'.join('    ' + json.dumps(c, ensure_ascii=False, separators=(', ', ': ')) for c in items())
    marker = '\n  ],\n  "decks": ['
    assert text.count(marker) == 1
    text = text.replace(marker, ',\n' + lines + marker)
    tail = '\n  ]\n}'
    ending = text[len(text.rstrip()):]
    body = text.rstrip()[:-len(tail)]
    assert text.rstrip().endswith(tail)
    decks = ',\n'.join('\n'.join('    ' + line for line in json.dumps(block, ensure_ascii=False, indent=2).split('\n')) for block, _ in made)
    M.DRAFT.write_text(body + ',\n' + decks + tail + ending, encoding='utf-8', newline='\n')
    print('scritti 2 oggetti e', len(made), 'mazzi')


if __name__ == '__main__':
    main()

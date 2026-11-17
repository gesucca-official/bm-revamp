"""SB-19 Fase B1 (D129, D130): scrive in bozza.json le nove carte che mancavano e i nove mazzi con le aggiunte.

Uso, dalla radice del repository: python docs/reports/set-base/sb-19/make-bozza.py [--check]

Il file si modifica come testo (una riga per carta, i mazzi in coda), così il resto della bozza resta byte per byte com'è.
Rifiuta di girare due volte. Con --check stampa solo i conti dei mazzi (somma 20, copie cambiate) senza scrivere.
I mazzi sono scritti prima di misurare: la tabella delle sostituzioni è quella del rapporto sb-19-b1-report.md, § 2.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
DRAFT = ROOT / 'server/src/test/resources/set-base/bozza.json'

MINUS = '−'
TIMES = '×'
DASH = '—'


def gui(name, description, role, gains=DASH, damage=DASH, amount=DASH):
    return {'name': name, 'description': description, 'role': role, 'gains': gains, 'damage': damage, 'damageAmount': amount}


def status(name, description, kind, flow, prop, factor, **more):
    step = {'op': 'status', 'name': name, 'description': description, 'statusType': kind, 'flow': flow, 'property': prop,
            'factor': factor}
    step.update(more)
    return step


CARDS = [
    # GEN-04 «Elemosina molesta»: Java (sottoclasse di BeggingMoney in model/cards/base/com, senza il -10 A della carta viva)
    {'binding': 'base.com.BeggingMoney', 'rarity': 'RARE', 'java': True, 'cost': {'ALERTNESS': 10}, 'priority': 0, 'params': {
        'alertnessFromTarget': 0},
     'gui': gui('Elemosina molesta', 'GEN-04 · 10 A: copia vicino a te un oggetto casuale del bersaglio.', 'ITEMS')},
    # GEN-08 «Colpo allo stomaco»
    {'binding': 'bruiser.SickeningBlow', 'rarity': 'COMMON', 'kind': 'ACTION', 'priority': 1, 'targets': ['OPPONENT'],
     'cost': {'VIOLENCE': 15},
     'target': [{'op': 'damage', 'type': 'HIT', 'amount': 10}, {'op': 'gain', 'resource': 'TOXICITY', 'amount': 10}],
     'gui': gui('Colpo allo stomaco', 'GEN-08 · 15 V: 10 HIT e +10 T al bersaglio.', 'DAMAGE', DASH, 'HIT', 'HIT 10')},
    # GEN-10 «Maleducazione»: la classe viva, costo, priorità e danno dalla bozza
    {'binding': 'bruiser.BadEducation', 'rarity': 'UNCOMMON', 'java': True, 'cost': {'VIOLENCE': 5}, 'priority': 1,
     'params': {'hitDamage': 8},
     'gui': gui('Maleducazione', 'GEN-10 · 5 V: toglie gli equip al bersaglio; 8 HIT al bersaglio.', 'OTHER', DASH, 'HIT', 'HIT 8')},
    # GEN-11 «Non sento niente»
    {'binding': 'bruiser.CantFeelAnything', 'rarity': 'UNCOMMON', 'kind': 'ACTION', 'priority': 2, 'targets': ['SELF'],
     'cost': {'VIOLENCE': 10},
     'self': [status('NON SENTO NIENTE', 'Hit Damage taken: x0.35', 'GOOD', 'INPUT', 'HIT', 0.35, turns=0),
              {'op': 'say', 'text': 'Gained status: NON SENTO NIENTE'}, {'op': 'gain', 'resource': 'ALERTNESS', 'amount': 5}],
     'gui': gui('Non sento niente', 'GEN-11 · 10 V: HIT ricevuto ' + TIMES + '0,35 in questo turno. +5 A a sé.', 'DEFENSE', '+5 A')},
    # GEN-19 «Mano lesta»
    {'binding': 'base.com.ManoLesta', 'rarity': 'COMMON', 'kind': 'ACTION', 'priority': 1, 'targets': ['OPPONENT'],
     'self': [{'op': 'gain', 'resource': 'ALERTNESS', 'amount': 5}],
     'target': [{'op': 'lose', 'resource': 'ALERTNESS', 'amount': 5}],
     'gui': gui('Mano lesta', 'GEN-19 · ' + MINUS + '5 A al bersaglio; +5 A a sé.', 'DISRUPT', '+5 A')},
    # GEN-20 «Secondo fiato»
    {'binding': 'base.com.SecondoFiato', 'rarity': 'RARE', 'kind': 'ACTION', 'priority': 0, 'targets': ['SELF'],
     'self': [status('SECONDO FIATO - HIT', 'Hit Damage taken: x1.25', 'BAD', 'INPUT', 'HIT', 1.25, turns=1),
              status('SECONDO FIATO - CUT', 'Cut Damage taken: x1.25', 'BAD', 'INPUT', 'CUT', 1.25, turns=1),
              {'op': 'say', 'text': 'Gained status: SECONDO FIATO'}, {'op': 'gain', 'resource': 'HEALTH', 'amount': 12}],
     'gui': gui('Secondo fiato', 'GEN-20 · +12 HEALTH a sé; HIT e CUT ricevuti ' + TIMES + '1,25 per 2 turni.', 'RESOURCES', '+12 H')},
    # GEN-21 «Coccio di bottiglia»
    {'binding': 'base.com.CoccioDiBottiglia', 'rarity': 'RARE', 'kind': 'ACTION', 'priority': 1, 'targets': ['SELF'],
     'cost': {'VIOLENCE': 5},
     'self': [status('COCCIO DI BOTTIGLIA', 'Hit Damage dealt x1.5 and turned to Cut Damage', 'GOOD', 'OUTPUT', 'HIT', 1.5, equip=True,
                     singleUse=True, convertTo='CUT'),
              {'op': 'say', 'text': 'Equipped status: COCCIO DI BOTTIGLIA'}],
     'gui': gui('Coccio di bottiglia', 'GEN-21 · 5 V: equip, il prossimo HIT inflitto ' + TIMES + '1,5 e convertito in CUT, uso singolo.',
                'OTHER')},
    # OGG-08 «Mezza minerale sgasata»
    {'binding': 'base.items.MezzaMineraleSgasata', 'rarity': 'UNCOMMON', 'kind': 'ITEM',
     'self': [{'op': 'empty', 'resource': 'ALCOHOL'}, {'op': 'gain', 'resource': 'ALERTNESS', 'amount': 5}],
     'gui': gui('Mezza minerale sgasata', 'OGG-08 · Consumato: azzera la tua L; +5 A.', 'OTHER', '+5 A')},
    # OGG-16 «Grappa della casa»
    {'binding': 'base.items.GrappaDellaCasa', 'rarity': 'RARE', 'kind': 'ITEM',
     'self': [{'op': 'gain', 'resource': 'ALCOHOL', 'amount': 25}, {'op': 'lose', 'resource': 'ALERTNESS', 'amount': 5}],
     'gui': gui('Grappa della casa', 'OGG-16 · Consumato: +25 L, ' + MINUS + '5 A.', 'RESOURCES', '+25 L')},
]

TART, SEAGULL, MATTONE, HEALING = 'base.com.TartarugaSulMarciapiede', 'bruiser.SeagullFly', 'base.com.MattoneDelCantiere', 'bruiser.HealingBlow'
SPINTONE, SPUTO, GIUBBOTTO, PANINO = 'base.com.Spintone', 'base.com.SputoDaPosacenere', 'base.items.GiubbottoDiFintaPelle', 'base.items.PaninoDelKebab'
STEAL, GRAB, FASCIATURA, ROTTEN = 'com.Steal', 'com.Grab', 'base.com.FasciaturaColFazzolettaccio', 'com.items.RottenBeer'
DUE_DITA, CASCO, ESPRESSO, STRETTA = 'base.com.DueDitaInGola', 'base.items.CascoDaLavoro', 'base.items.EspressoDelDistributore', 'base.gigi.UnaStrettaDiProva'
CHIAVE, STUNNING, ACQUA, SANTINO = 'base.gigi.ChiaveDaTredici', 'bruiser.StunningBlow', 'base.com.AcquaInFaccia', 'base.items.SantinoDellaPortinaia'
GHIACCIO, POSACENERE, ESTASI = 'base.items.GhiaccioNelTovagliolo', 'base.items.PosacenereDiVetro', 'base.pino.GoingBerserk'
ELEMOSINA, COLPO, MALEDUCAZIONE, NSN = 'base.com.BeggingMoney', 'bruiser.SickeningBlow', 'bruiser.BadEducation', 'bruiser.CantFeelAnything'
MANO, FIATO, COCCIO = 'base.com.ManoLesta', 'base.com.SecondoFiato', 'base.com.CoccioDiBottiglia'
MINERALE, GRAPPA = 'base.items.MezzaMineraleSgasata', 'base.items.GrappaDellaCasa'

# id, mazzo di partenza, sostituzioni: (carte tolte, carte messe). Al più 6 copie cambiate, due copie per carta nuova.
DECKS = [
    ('prova-b1-spazienzio', 'starter-spazienzio', [({TART: 2}, {NSN: 2}), ({SEAGULL: 2}, {COLPO: 2}), ({MATTONE: 1, HEALING: 1}, {COCCIO: 2})]),
    ('prova-b1-mara', 'starter-mara', [({SPINTONE: 1, SPUTO: 1}, {MANO: 2}), ({TART: 1, GIUBBOTTO: 1}, {ELEMOSINA: 2}), ({PANINO: 2}, {FIATO: 2})]),
    ('prova-b1-celestina', 'starter-tossico', [({STEAL: 1, GRAB: 1}, {ELEMOSINA: 2}), ({FASCIATURA: 1, PANINO: 1}, {FIATO: 2})]),
    ('prova-b1-piera', 'starter-pino', [({ROTTEN: 2}, {GRAPPA: 2}), ({SPINTONE: 2}, {MANO: 2}), ({FASCIATURA: 1, GRAB: 1}, {MINERALE: 2})]),
    ('prova-b1-beppe', 'starter-gigi', [({SEAGULL: 1, SPINTONE: 1}, {COLPO: 2}), ({DUE_DITA: 1, CASCO: 1}, {MALEDUCAZIONE: 2}), ({GIUBBOTTO: 2}, {COCCIO: 2})]),
    ('prova-b1-sergio', 'prova-sergio', [({TART: 2}, {NSN: 2}), ({STUNNING: 1, ACQUA: 1}, {MANO: 2}), ({SPINTONE: 1, SANTINO: 1}, {ELEMOSINA: 2})]),
    ('prova-b1-duccio', 'prova-duccio', [({PANINO: 2}, {FIATO: 2}), ({SPINTONE: 2}, {MANO: 2}), ({GHIACCIO: 1, FASCIATURA: 1}, {MINERALE: 2})]),
    # Rischio 3: equip impilati (Coccio, Posacenere, Guanti) sullo starter di Beppe, che ha già i Guanti ×2.
    ('prova-b1-equip', 'starter-gigi', [({GIUBBOTTO: 2}, {COCCIO: 2}), ({CASCO: 2}, {POSACENERE: 2}), ({STEAL: 1, DUE_DITA: 1}, {MALEDUCAZIONE: 2})]),
    # Rischio 1: Estasi ×2 e Grappa ×2 in uno starter senza L (Beppe).
    ('prova-b1-estasi', 'starter-gigi', [({CHIAVE: 2}, {ESTASI: 2}), ({ESPRESSO: 1, STRETTA: 1}, {GRAPPA: 2})]),
]


def deck_block(draft, spec):
    deck_id, base_id, swaps = spec
    base = next(d for d in draft['decks'] if d['id'] == base_id)
    cards = dict(base['cards'])
    changed = 0
    for out, into in swaps:
        for binding, n in out.items():
            assert cards.get(binding, 0) >= n, (deck_id, binding)
            cards[binding] -= n
            if not cards[binding]:
                del cards[binding]
        for binding, n in into.items():
            assert n == 2 and binding not in cards, (deck_id, binding)
            cards[binding] = n
            changed += n
    assert sum(cards.values()) == 20, (deck_id, sum(cards.values()))
    assert changed <= 6, (deck_id, changed)
    block = {'id': deck_id, 'character': base['character'], 'bound': base['bound'], 'lastResort': base['lastResort'], 'cards': cards}
    return block, changed


def main():
    text = DRAFT.read_text(encoding='utf-8')
    draft = json.loads(text)
    blocks = [deck_block(draft, spec) for spec in DECKS]
    if '--check' in sys.argv:
        for block, changed in blocks:
            print(block['id'], sum(block['cards'].values()), 'carte,', changed, 'copie nuove')
        return
    assert CARDS[0]['binding'] not in {c['binding'] for c in draft['cards']}, 'già scritto'
    lines = ',\n'.join('    ' + json.dumps(c, ensure_ascii=False, separators=(', ', ': ')) for c in CARDS)
    marker = '\n  ],\n  "decks": ['
    assert text.count(marker) == 1
    text = text.replace(marker, ',\n' + lines + marker)
    tail = '\n  ]\n}'
    assert text.endswith(tail + '\n') or text.endswith(tail)
    ending = text[len(text.rstrip()):]
    body = text.rstrip()[:-len(tail)]
    decks = ',\n'.join('\n'.join('    ' + line for line in json.dumps(block, ensure_ascii=False, indent=2).split('\n'))
                       for block, _ in blocks)
    DRAFT.write_text(body + ',\n' + decks + tail + ending, encoding='utf-8', newline='\n')
    print('scritte', len(CARDS), 'carte e', len(blocks), 'mazzi')


if __name__ == '__main__':
    main()

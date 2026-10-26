"""Independent PDF checks (optional QA dependency: pypdf)."""
from pathlib import Path
import argparse
import json
import math
import re
from collections import Counter
from html import unescape

from pypdf import PdfReader
from generate import ROOT, load_catalog


def compact(text):
    return re.sub(r'\s+', '', text)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('pdf', nargs='?', type=Path, default=ROOT/'output/pdf/botte-micidiali-carte.pdf')
    a = p.parse_args()
    data = json.loads(a.pdf.with_suffix('.manifest.json').read_text(encoding='utf-8'))
    cards, _, _, regular, initial = load_catalog(ROOT/'server/src/main/resources/cards.sqlite', ROOT/'docs/game-rules.md', ROOT/'docs/rules-catalog.json')
    reader = PdfReader(a.pdf)
    assert len(reader.pages) == data['total_pages']
    assert len(cards) == data['catalog_count']
    assert {c['id'] for c in cards} == {c['id'] for c in data['inventory']}
    assert len(data['placements']) == data['printed_count']
    assert Counter(c['id'] for c in data['placements']) == Counter({c['id']: c['copies'] for c in data['inventory'] if c['copies']})
    selection = data.get('selection')
    if selection:
        expected = Counter()
        if selection['mode'] == 'starters':
            for owner in selection['starters']:
                slots = [row for row in initial if row[0] == owner]
                assert len(slots) == 1, 'Starter non presente nel catalogo corrente'
                expected.update(slots[0])  # Includes character and all initial slots.
                for player, card, n in regular:
                    if player == owner: expected[card] += n
            expected = Counter({card: n*selection['multiplier'] for card,n in expected.items()})
        else:
            expected.update({card['id']:selection['multiplier'] for card in cards})
        for card,n in selection['overrides'].items(): expected[card] = n
        assert Counter(c['id'] for c in data['placements']) == +expected, 'Quantità diverse dagli starter/override richiesti'
    texts = [compact(page.extract_text()) for page in reader.pages]
    lookup = {c['id']: c for c in cards}
    for page in reader.pages:
        assert math.isclose(float(page.mediabox.width)*25.4/72, 210, abs_tol=.01)
        assert math.isclose(float(page.mediabox.height)*25.4/72, 297, abs_tol=.01)
    for place in data['placements']:
        card = lookup[place['id']]
        text = texts[place['page']-1]
        assert compact(card['name']) in text, card['id'] + ': nome assente'
        effect = unescape(re.sub('<[^>]*>', '', card['effect']))
        assert compact(effect) in text, card['id'] + ': effetto incompleto'
        for key in ('cost','priority','target'):
            if key in card: assert compact(card[key]) in text
        x,y,w,h = place['rect_mm']
        assert all(math.isclose(a,b,abs_tol=.0001) for a,b in zip([w,h],data['trim_mm']))
        assert x>=5 and y>=5 and x+w<=205 and y+h<=292
        # Check the actual PDF path has the expected trim rectangle, not only the manifest.
        rectangles = []
        def operand(op, args, cm, tm):
            if op == b're': rectangles.append([float(v)*25.4/72 for v in args])
        reader.pages[place['page']-1].extract_text(visitor_operand_before=operand)
        assert any(all(abs(a-b)<.002 for a,b in zip(rect,[x,y,w,h])) for rect in rectangles)
    for i,a in enumerate(data['placements']):
        for b in data['placements'][i+1:]:
            if a['page'] != b['page']: continue
            x,y,w,h=a['rect_mm']; X,Y,W,H=b['rect_mm']
            assert x+w<=X+.001 or X+W<=x+.001 or y+h<=Y+.001 or Y+H<=y+.001
    print(f"OK: {len(cards)} voci, {data['printed_count']} fronti; pagine A4, rettangoli fisici, testi, copie e assenza sovrapposizioni verificati. Necessaria anche revisione visiva.")


if __name__ == '__main__': main()

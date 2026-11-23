"""Independent PDF checks of a print of a set file (optional QA dependency: pypdf).

SB-28: the print reads the set file (the live one, or a draft with --bozza) named in its manifest; the checks of the Set Base 0.1
print, which read the SQLite catalog, left with that set.
"""
from pathlib import Path
import argparse
import hashlib
import json
import math
import re
from collections import Counter

from pypdf import PdfReader
from generate import ROOT
from bozza import full_text_entries, load_bozza


def compact(text):
    return re.sub(r'\s+', '', text)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('pdf', nargs='?', type=Path, default=ROOT/'output/pdf/botte-micidiali-carte.pdf')
    a = p.parse_args()
    data = json.loads(a.pdf.with_suffix('.manifest.json').read_text(encoding='utf-8'))
    source = ROOT/data['set_file']['path']
    assert hashlib.sha256(source.read_bytes()).hexdigest() == data['set_file']['sha256'], f'{source}: cambiato dopo la stampa, rigenerare'
    bz = load_bozza(source, live=data['mode'] == 'set')
    assert (bz['set_label'], bz['rules']) == (data['set'], data['rules_version']), 'set o regolamento diversi dal manifest'
    faces = bz['faces']
    reader = PdfReader(a.pdf)
    assert len(reader.pages) == data['total_pages']
    assert data['card_pages'] + data['guide_pages'] + data['full_text_pages'] == data['total_pages']
    assert len(faces) == data['catalog_count']
    assert [f['id'] for f in faces] == [c['id'] for c in data['inventory']]
    assert len(data['placements']) == data['printed_count']
    assert Counter(c['id'] for c in data['placements']) == Counter({c['id']: c['copies'] for c in data['inventory'] if c['copies']})
    selection = data['selection']
    expected = Counter()
    if selection['mode'] == 'decks':
        by_id = {d['id']: d for d in bz['decks']}
        for deck in selection['decks']:
            for card, n in by_id[deck]['quantities'].items():
                expected[card] += n * selection['multiplier']
    else:
        expected.update({f['id']: selection['multiplier'] for f in faces})
    for card, n in selection['overrides'].items():
        expected[card] = n
    assert Counter(c['id'] for c in data['placements']) == +expected, 'Quantità diverse dai mazzi o dagli override richiesti'
    texts = [compact(page.extract_text()) for page in reader.pages]
    lookup = {f['id']: f for f in faces}
    for page in reader.pages:
        assert math.isclose(float(page.mediabox.width)*25.4/72, 210, abs_tol=.01)
        assert math.isclose(float(page.mediabox.height)*25.4/72, 297, abs_tol=.01)
    short = data['set_file']['sha256_short']
    for place in data['placements']:
        face = lookup[place['id']]
        text = texts[place['page']-1]
        assert compact(face['name']) in text, face['id'] + ': nome assente'
        assert compact(face['id']) in text, face['id'] + ': identificatore assente'
        assert short in text, face['id'] + ': impronta del file assente'
        assert ('BOZZA' in text) == (data['mode'] == 'bozza'), face['id'] + ': marchio di bozza sbagliato'
        x, y, w, h = place['rect_mm']
        assert all(math.isclose(a, b, abs_tol=.0001) for a, b in zip([w, h], data['trim_mm']))
        assert x >= 5 and y >= 5 and x+w <= 205 and y+h <= 292
        # Check the actual PDF path has the expected trim rectangle, not only the manifest.
        rectangles = []

        def operand(op, args, cm, tm):
            if op == b're':
                rectangles.append([float(v)*25.4/72 for v in args])
        reader.pages[place['page']-1].extract_text(visitor_operand_before=operand)
        assert any(all(abs(a-b) < .002 for a, b in zip(rect, [x, y, w, h])) for rect in rectangles)
    for i, a in enumerate(data['placements']):
        for b in data['placements'][i+1:]:
            if a['page'] != b['page']:
                continue
            x, y, w, h = a['rect_mm']; X, Y, W, H = b['rect_mm']
            assert x+w <= X+.001 or X+W <= x+.001 or y+h <= Y+.001 or Y+H <= y+.001
    # The booklet: the full text of every entry printed (with the token).
    booklet = ''.join(texts[data['card_pages'] + data['guide_pages']:])
    entries = full_text_entries({c['id'] for c in data['placements']} if selection['mode'] == 'decks' else None)
    assert len(entries) == data['full_text_entries']
    for binding, v in entries:
        assert compact(f'{v["nome"]} · {v["slot"]}') in booklet, binding + ': testo completo assente'
    guide = ''.join(texts[data['card_pages']:data['card_pages'] + data['guide_pages']])
    assert 'playground' not in guide and not re.search(r'RP-[0-9]', guide), 'la guida rimanda ancora alle regole del playground'
    print(f"OK: {data['set']} (regolamento {data['rules_version']}), {len(faces)} voci, {data['printed_count']} fronti; pagine A4, rettangoli fisici, "
          "nomi, identificatori e impronta, copie, testi completi e assenza sovrapposizioni verificati. Necessaria anche revisione visiva.")


if __name__ == '__main__':
    main()

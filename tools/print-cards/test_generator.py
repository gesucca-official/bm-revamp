"""Integration checks for future catalog growth and safe layout failures."""
import hashlib
import os
import json
import re
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from collections import Counter

from generate import LIVE_SET, ROOT
import bozza as bozza_mode
import symbols_pdf

try:
    from pypdf import PdfReader
except ImportError:  # the bozza text checks need pypdf (see README)
    PdfReader = None

GENERATE = Path(__file__).with_name('generate.py')
BOZZA = ROOT/'server/src/test/resources/set-base/bozza.json'


def run_generate(*arguments):
    env = dict(os.environ, PYTHONIOENCODING='utf-8')  # the console code page of Windows would garble stderr
    return subprocess.run([sys.executable, str(GENERATE), *arguments], capture_output=True, text=True, encoding='utf-8', env=env)


def pdf_text(path):
    return '\n'.join(page.extract_text() for page in PdfReader(str(path)).pages)


def numbers(text):
    return [float(n) for n in re.findall(r'-?\d*\.?\d+', text)]


@unittest.skipIf(PdfReader is None, 'pypdf not installed')
class BozzaModeTest(unittest.TestCase):
    """Bozza mode (the Set Base draft): fronts, decks, placeholders, safe failures, and live mode left alone."""

    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(BOZZA.read_text(encoding='utf-8-sig'))
        cls.directory = tempfile.TemporaryDirectory()
        cls.d = Path(cls.directory.name)

    @classmethod
    def tearDownClass(cls):
        cls.directory.cleanup()

    def manifest(self, output):
        return json.loads(output.with_suffix('.manifest.json').read_text(encoding='utf-8'))

    def test_catalog_has_every_front_and_no_raw_placeholder(self):
        output = self.d/'catalog.pdf'
        result = run_generate('--bozza', '--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        m = self.manifest(output)
        faces = len(self.data['characters']) + len(self.data['cards'])
        self.assertEqual(faces, 124)  # bozza 1.7: 7 characters (rarity P, SB-24) and 117 cards
        self.assertEqual((m['mode'], m['catalog_count'], m['printed_count']), ('bozza', faces, faces))
        self.assertEqual(len(m['placements']), faces)
        # SB-28: the playground rules became regulation 2.0 (D183); the print says the regulation, read from docs/game-rules.md
        # (2.2 since SB-30a, D203; 2.3 since CA-0e, DC7).
        self.assertEqual((m['rules_version'], m['set'], m['file_version']), ('2.3', 'Set Base 1.7', '1.7'))
        self.assertEqual(m['set_file']['sha256'], hashlib.sha256(BOZZA.read_bytes()).hexdigest())
        text = pdf_text(output)
        self.assertNotIn('[[', text)
        self.assertNotIn(']]', text)
        # The provisional mark with the short hash is on every front; the guide cites the regulation, no longer the playground rules.
        self.assertGreaterEqual(text.count(m['set_file']['sha256_short']), faces)
        self.assertIn('docs/game-rules.md', text)
        self.assertNotIn('playground', text)
        self.assertIsNone(re.search(r'RP-[0-9]', text))
        self.assertGreaterEqual(text.count('BOZZA PROVVISORIA'), faces)
        # SB-25 B2: the characters print their rarity P; the guide has the keyword rules; the booklet the full text of all 125 entries.
        self.assertGreaterEqual(text.count('PROTAGONISTA (P)'), len(self.data['characters']))
        flat = re.sub(r'\s+', '', text)  # pypdf splits the words of a line
        for title, _ in bozza_mode.KEYWORD_RULES:
            self.assertIn(re.sub(r'\s+', '', title), flat)
        self.assertIn('siarrotondanosempreperdifetto', flat)
        self.assertIn('TESTICOMPLETI', flat)
        full = json.loads(bozza_mode.FULL_TEXTS.read_text(encoding='utf-8'))['voci']
        self.assertEqual((m['full_text_entries'], len(full)), (125, 125))
        self.assertGreater(m['full_text_pages'], 0)
        self.assertEqual(m['card_pages'] + m['guide_pages'] + m['full_text_pages'], m['total_pages'])
        for v in full.values():
            self.assertIn(re.sub(r'\s+', '', f'{v["nome"]} · {v["slot"]}'), flat, v['slot'])

    def test_starter_deck_is_character_basic_two_bound_last_resort_and_twenty_cards(self):
        deck = next(d for d in self.data['decks'] if d['id'].startswith('starter-'))
        character = next(c for c in self.data['characters'] if c['id'] == deck['character'])
        expected = Counter([deck['character'], character['basic'], *deck['bound'], deck['lastResort']])
        expected.update(deck['cards'])
        self.assertEqual(sum(expected.values()), 1 + 1 + 2 + 1 + 20)
        for request in (deck['id'], deck['id'].removeprefix('starter-'), character['name'].upper()):
            output = self.d/'starter.pdf'
            result = run_generate('--bozza', '--starter', request, '--output', str(output))
            self.assertEqual(result.returncode, 0, result.stderr)
            m = self.manifest(output)
            self.assertEqual(Counter(p['id'] for p in m['placements']), expected)
            self.assertEqual(m['printed_count'], 25)
            self.assertEqual(m['selection']['decks'], [deck['id']])
            self.assertNotIn('[[', pdf_text(output))
            # The booklet of a deck has the entries printed and the token, not the whole set.
            self.assertEqual(m['full_text_entries'], len(expected) + 1)
        output = self.d/'double.pdf'
        result = run_generate('--bozza', '--starter', deck['id'], '--starter', deck['id'], '--copies', '2', '--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(Counter(p['id'] for p in self.manifest(output)['placements']), Counter({k: 4*v for k, v in expected.items()}))

    def test_all_starters_default_and_all_decks_and_copies_file(self):
        starters = [d for d in self.data['decks'] if d['id'].startswith('starter-')]
        output = self.d/'all.pdf'
        result = run_generate('--bozza', '--all-starters', '--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        m = self.manifest(output)
        self.assertEqual(m['selection']['decks'], [d['id'] for d in starters])
        self.assertEqual(m['printed_count'], 25*len(starters))
        result = run_generate('--bozza', '--all-starters', '--all-decks', '--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.manifest(output)['printed_count'], 25*len(self.data['decks']))
        self.assertNotEqual(run_generate('--bozza', '--all-decks', '--output', str(output)).returncode, 0)
        self.assertNotEqual(run_generate('--all-decks', '--output', str(output)).returncode, 0)
        self.assertFalse(output.with_name('botte-micidiali-carte.pdf').exists())
        deck = starters[0]
        copies = self.d/'copies.json'
        copies.write_text(json.dumps({deck['lastResort']: 0, deck['bound'][0]: 3}), encoding='utf-8')
        result = run_generate('--bozza', '--starter', deck['id'], '--copies-file', str(copies), '--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        printed = Counter(p['id'] for p in self.manifest(output)['placements'])
        self.assertEqual((printed[deck['lastResort']], printed[deck['bound'][0]]), (0, 3))
        copies.write_text('{"inesistente": 1}', encoding='utf-8')
        self.assertNotEqual(run_generate('--bozza', '--copies-file', str(copies), '--output', str(output)).returncode, 0)

    def test_list_starters_and_ambiguous_names(self):
        result = run_generate('--bozza', '--list-starters')
        self.assertEqual(result.returncode, 0, result.stderr)
        for deck in self.data['decks']:
            self.assertIn(deck['id'], result.stdout)
        output = self.d/'none.pdf'
        # A character with several measurement decks and no starter must be named by deck id.
        counts = Counter(d['character'] for d in self.data['decks'] if not d['id'].startswith('starter-'))
        starters = {d['character'] for d in self.data['decks'] if d['id'].startswith('starter-')}
        ambiguous = next((c for c, n in counts.items() if n > 1 and c not in starters), None)
        if ambiguous:
            name = next(c['name'] for c in self.data['characters'] if c['id'] == ambiguous)
            result = run_generate('--bozza', '--starter', name, '--output', str(output))
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('ambiguo', result.stderr)
        self.assertNotEqual(run_generate('--bozza', '--starter', 'inesistente', '--output', str(output)).returncode, 0)
        self.assertFalse(output.exists())

    def test_unknown_placeholder_fails_loudly(self):
        with self.assertRaisesRegex(ValueError, 'segnaposto sconosciuto'):
            bozza_mode.parse_inline('Costo [[Z]]', 'prova')
        with self.assertRaisesRegex(ValueError, 'non chiuse'):
            bozza_mode.parse_inline('Costo [[H', 'prova')
        self.assertEqual(bozza_mode.parse_inline('a [[H]]b', 'prova'), ['a ', ('sym', 'HEALTH'), 'b'])
        # SB-25 (D168 (1)): the three types of damage are symbols too, never their letters.
        self.assertEqual(bozza_mode.parse_inline('20 [[HIT]], [[CUT]] e [[POISON]].', 'prova'),
                         ['20 ', ('sym', 'HIT'), ', ', ('sym', 'CUT'), ' e ', ('sym', 'POISON'), '.'])
        for wrong in ('[[hit]]', '[[DAMAGE]]', '[[HITS]]'):
            with self.assertRaisesRegex(ValueError, 'segnaposto sconosciuto'):
                bozza_mode.parse_inline(wrong, 'prova')
        mutated = json.loads(BOZZA.read_text(encoding='utf-8-sig'))
        mutated['cards'][0]['gui']['description'] += ' [[Q]]'
        source = self.d/'bozza-rotta.json'
        source.write_text(json.dumps(mutated), encoding='utf-8')
        output = self.d/'rotta.pdf'
        result = run_generate('--bozza', str(source), '--output', str(output))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('segnaposto sconosciuto [[Q]]', result.stderr)
        self.assertFalse(output.exists())

    def test_text_that_does_not_fit_is_refused_and_listed(self):
        output = self.d/'piccola.pdf'
        result = run_generate('--bozza', '--width-mm', '40', '--height-mm', '55', '--output', str(output))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('nessun testo viene troncato', result.stderr)
        self.assertFalse(output.exists())

    def test_rarity_p_is_accepted_and_an_unknown_rarity_refused(self):
        self.assertIn('PROTAGONIST', bozza_mode.RARITY)
        self.assertEqual({c['rarity'] for c in self.data['characters']}, {'PROTAGONIST'})
        mutated = json.loads(BOZZA.read_text(encoding='utf-8-sig'))
        mutated['characters'][0]['rarity'] = 'MYTHIC'
        source = self.d/'bozza-rarita.json'
        source.write_text(json.dumps(mutated), encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'rarità sconosciuta MYTHIC'):
            bozza_mode.load_bozza(source)

    def test_flavour_is_printed_and_a_flavour_that_does_not_fit_is_refused(self):
        bz = bozza_mode.load_bozza(BOZZA)
        self.assertTrue(all(f['flavour'] for f in bz['faces']), 'every front of the 1.7 has a flavour (D166)')
        mutated = json.loads(BOZZA.read_text(encoding='utf-8-sig'))
        mutated['cards'][0]['gui']['flavour'] = '«' + 'PAROLA ' * 90 + '»'
        source = self.d/'bozza-flavour.json'
        source.write_text(json.dumps(mutated), encoding='utf-8')
        output = self.d/'flavour.pdf'
        result = run_generate('--bozza', str(source), '--output', str(output))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('[flavour; senza flavour restano', result.stderr)
        self.assertIn(mutated['cards'][0]['binding'], result.stderr)
        self.assertFalse(output.exists())

    def test_every_draft_front_fits_at_the_standard_size(self):
        from io import BytesIO
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.pdfgen import canvas
        from generate import fonts
        bz = bozza_mode.load_bozza(BOZZA)
        fonts(None)
        bozza_mode.italic_font()
        scratch = canvas.Canvas(BytesIO(), pagesize=A4)
        for n, face in enumerate(bz['faces']):
            room = bozza_mode.draw_face(scratch, face, 0, 0, 62*mm, 87*mm, n + 1, len(bz['faces']), 'stamp')
            self.assertGreaterEqual(room['room'], 0, face['id'])
            self.assertLessEqual(room['room'], room['room_without_flavour'], face['id'])
            if face['text']:
                for line in bozza_mode.wrap(face['text'], 'Body', 9, 54*mm, face['id']):
                    self.assertLessEqual(bozza_mode._width(line, 'Body', 9), 54*mm + .01, face['id'])

    def test_the_footer_fits_with_the_widest_fingerprint(self):
        """SB-30a B1: the width of the footer depends on the digits of the hash. With the twelve widest ones and the longest card
        number it fits on every front, in a draft and in the live print, with the stamp the print writes."""
        from io import BytesIO
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfgen import canvas
        from generate import fonts
        fonts(None)
        bozza_mode.italic_font()
        widest = max('0123456789abcdef', key=lambda digit: pdfmetrics.stringWidth(digit, 'Body', 6))
        scratch = canvas.Canvas(BytesIO(), pagesize=A4)
        for path, live in ((BOZZA, False), (LIVE_SET, True)):
            bz = bozza_mode.load_bozza(path, live=live)
            stamp, total = bozza_mode.footer_stamp(bz, widest * 12), len(bz['faces'])
            for face in bz['faces']:
                bozza_mode.draw_face(scratch, face, 0, 0, 62*mm, 87*mm, total, total, stamp)

    def test_live_mode_prints_the_live_set_file(self):
        """SB-28: without --bozza the print is the live Set Base, from the set file the server reads (CA-0e: 1.0.4, regulation 2.3)."""
        live = json.loads(LIVE_SET.read_text(encoding='utf-8'))
        output = self.d/'live.pdf'
        result = run_generate('--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        m = self.manifest(output)
        self.assertEqual((m['mode'], m['set'], m['file_version'], m['rules_version']), ('set', 'Set Base 1.0.4', '1.7', '2.3'))
        self.assertEqual(m['set_file'], dict(path='server/src/main/resources/sets/base.json', sha256=hashlib.sha256(LIVE_SET.read_bytes()).hexdigest(),
                                             sha256_short=hashlib.sha256(LIVE_SET.read_bytes()).hexdigest()[:12]))
        self.assertEqual((m['catalog_count'], m['printed_count']), (124, 124))
        self.assertEqual([(d['name'], d['category']) for d in m['decks']],
                         [('Spazienzio', 'base'), ('Mara', 'base'), ('Celestina', 'avanzato'), ('Piera', 'avanzato'), ('Beppe', 'avanzato')])
        text = pdf_text(output)
        flat = re.sub(r'\s+', '', text)  # pypdf splits the words of a line
        self.assertNotIn('BOZZA', text)
        self.assertNotIn('playground', text)
        self.assertIsNone(re.search(r'RP-[0-9]', text))
        self.assertGreaterEqual(text.count('SET BASE 1.0.4'), 124)
        self.assertIn('SETBASE/GUIDAALTAVOLO', flat)
        self.assertIn('regolamento2.3(docs/game-rules.md)', flat)
        for card in live['cards']:
            self.assertIn(re.sub(r'\s+', '', card['gui']['name']), flat, card['binding'])
        verify = subprocess.run([sys.executable, str(GENERATE.with_name('verify.py')), str(output)], capture_output=True, text=True, encoding='utf-8',
                                env=dict(os.environ, PYTHONIOENCODING='utf-8'))
        self.assertEqual(verify.returncode, 0, verify.stderr)
        # The starters by the name of D182; the decks of a print are the five of the live file.
        listed = run_generate('--list-starters')
        self.assertEqual(listed.returncode, 0, listed.stderr)
        self.assertEqual(len(listed.stdout.splitlines()), 5)
        self.assertIn('starter avanzato «Celestina»', listed.stdout)
        output = self.d/'live-mara.pdf'
        result = run_generate('--starter', 'Mara', '--output', str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.manifest(output)['selection']['decks'], ['starter-mara'])
        self.assertEqual(self.manifest(output)['printed_count'], 25)


class SymbolPortTest(unittest.TestCase):
    """The vector symbols are a port of the client: colours and literal shapes must stay equal to the TypeScript sources."""

    @classmethod
    def setUpClass(cls):
        cls.symbols = (ROOT/'client-web/src/symbols.ts').read_text(encoding='utf-8')
        cls.readability = (ROOT/'client-web/src/readability.ts').read_text(encoding='utf-8')

    def colors(self, name):
        body = re.search(r'export const ' + name + r'[^=]*=\{(.*?)\};', self.readability).group(1)
        return {k: int(v, 16) for k, v in re.findall(r'(\w+):0x([0-9a-fA-F]+)', body)}

    def test_colours_equal_the_client(self):
        self.assertEqual(self.colors('RES_COLOR'), symbols_pdf.RES_COLOR)
        self.assertEqual(self.colors('ROLE_COLOR'), symbols_pdf.ROLE_COLOR)
        self.assertEqual(self.colors('DAMAGE_COLOR'), symbols_pdf.DAMAGE_COLOR)
        self.assertEqual(self.colors('DAMAGE_ACCENT'), symbols_pdf.DAMAGE_ACCENT)
        self.assertEqual(int(re.search(r'export const LIGHT=0x([0-9a-f]+)', self.symbols).group(1), 16), symbols_pdf.LIGHT)
        self.assertEqual(int(re.search(r'export const EDGE_INK=0x([0-9a-f]+)', self.symbols).group(1), 16), symbols_pdf.EDGE_INK)

    def flat(self, kind):
        out = []
        for layer in symbols_pdf.LAYERS[kind]:
            for prim in layer['prims']:
                out += prim[1] if prim[0] == 'poly' else list(prim[1:])
            if 'stroke' in layer:
                out.append(layer['stroke'][1])
        return out

    def test_literal_shapes_equal_the_client(self):
        # D172: POISON (skull in front of a flask) is a literal line of symbols.ts like the others.
        for kind in ('HEALTH', 'ALERTNESS', 'VIOLENCE', 'TOXICITY', 'ALCOHOL', 'DEFENSE', 'RESOURCES', 'DISRUPT', 'ITEMS', 'OTHER', 'POISON'):
            line = re.search(r'^ ' + kind + r':(\[.*\]),?$', self.symbols, re.M).group(1)
            line = re.sub(r',min:[\d.]+', '', line)
            self.assertEqual(numbers(line), self.flat(kind), kind)
        # Computed shapes: the parameters of the formulas, and the literal polygons of the damage symbols.
        self.assertIn('star(10,.45)', self.symbols)
        self.assertEqual(self.flat('DAMAGE'), symbols_pdf._star(10, .45))
        cut = re.search(r'CUT:\[\s*(.*?)\s*\]\.map\(poly=>turn\(poly,45\)\)', self.readability, re.S).group(1)
        self.assertEqual([symbols_pdf._turn(numbers(p), 45) for p in re.findall(r'\[([-\d.,]+)\]', cut)], symbols_pdf._DAMAGE_SHAPES['CUT'])

    def test_every_symbol_draws_and_unknown_is_refused(self):
        from io import BytesIO
        from reportlab.pdfgen import canvas
        pdf = canvas.Canvas(BytesIO())
        for kind in symbols_pdf.LAYERS:
            symbols_pdf.draw_symbol(pdf, kind, 50, 50, 20)
        self.assertEqual(set(symbols_pdf.LAYERS), set(symbols_pdf.RESOURCES) | set(symbols_pdf.ROLES) | set(symbols_pdf.DAMAGES))
        with self.assertRaises(ValueError):
            symbols_pdf.draw_symbol(pdf, 'NOPE', 0, 0, 10)


if __name__=='__main__': unittest.main()

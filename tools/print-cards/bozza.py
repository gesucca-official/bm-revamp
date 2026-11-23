"""The printer of a set file: the live Set Base (SB-28) or, with --bozza, a draft in the same format, for in-person play.

Everything is read at run time from the set file (the live one, server/src/main/resources/sets/base.json, or a draft such as
server/src/test/resources/set-base/bozza.json): a rerun picks up any change. Fronts carry the set and its version, the version of
the regulation and the short SHA-256 of the file; a draft also carries a provisional mark. Resource, role and damage symbols are the
vector shapes of the client (symbols_pdf.py), never font glyphs; a placeholder the generator does not know fails loudly. Text that
does not fit is refused, never truncated or shrunk. The rules are in the regulation (docs/game-rules.md) and in the set document,
which the guide points to and does not reprint. SB-28: the playground rules became regulation 2.0 (D183); the guide cites the
regulation, no longer the playground document (RP-n).
"""
from collections import Counter
from contextlib import closing
from io import BytesIO
from pathlib import Path
import hashlib
import json
import math
import re

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

from generate import COLORS, INK, ROOT, fonts, symbol
from symbols_pdf import (DAMAGES, RESOURCE_LETTERS, RESOURCES, ROLES, ROLE_LABEL, RESOURCE_NAME_IT, LAYERS, colors as symbol_colors, draw_symbol)

DEFAULT_BOZZA = ROOT / 'server/src/test/resources/set-base/bozza.json'
REGULATION = ROOT / 'docs/game-rules.md'
SET_DOCS = ROOT / 'docs/sets'  # SB-28: the published version of a live set is the one of its document (the file keeps the draft's)
STARTER_PREFIX = 'starter-'
SLOTS = ROOT / 'docs/design/set-base/testi/slot.json'  # SB-25 B1 (D169 (5)): the slot code is no longer in the text
FULL_TEXTS = ROOT / 'docs/design/set-base/testi/testi-completi.json'  # SB-25 B1 (D170): the full text of every entry, generated
PLACEHOLDER = re.compile(r'\[\[([^\]]*)\]\]')
SYM_ADVANCE = 1.08    # advance of an inline symbol, in em
SYM_SIZE = .95        # diameter of an inline symbol, in em
SYM_RISE = .34        # centre of an inline symbol above the baseline, in em
LEADING = 1.28
# PROTAGONIST (P): the rarity of the characters, descriptive like the others (regulation, R07); no pips, its own label.
RARITY = {'COMMON': ('COMUNE', 1), 'UNCOMMON': ('NON COMUNE', 2), 'RARE': ('RARA', 3), 'PROTAGONIST': ('PROTAGONISTA (P)', 0)}
INLINE = {**RESOURCE_LETTERS, **{d: d for d in DAMAGES}}  # [[H]]…[[L]] and, from SB-25 (D168 (1)), [[HIT]] [[CUT]] [[POISON]]
FLAVOUR_PT = 7.5      # the flavour under the text, in italic (D166 (2), (4): printed on the face)
FLAVOUR_GAP = 1.6     # mm between the text and the flavour
TARGETS = {'OPPONENT': 'Avversario', 'SELF': 'Sé', 'NEAR_ITEM': 'Oggetto vicino'}
TAG_LABEL = {'Personaggio': 'PERSONAGGIO', 'Regolare': 'AZIONE / REGOLARE', 'Base': 'AZIONE / BASE',
             'Legata al personaggio': 'AZIONE / LEGATA AL PERSONAGGIO', 'Ultima risorsa': 'AZIONE / ULTIMA RISORSA', 'Oggetto': 'OGGETTO'}


LETTER_OF = {v: k for k, v in RESOURCE_LETTERS.items()}


class Overflow(ValueError):
    """A text that does not fit its frame."""


# ---------------------------------------------------------------------------------------------------------------- text
def parse_inline(text, where):
    """Split a printed text into strings and ('sym', kind); an unknown or broken placeholder is an error."""
    if not isinstance(text, str):
        raise ValueError(f'{where}: testo non valido {text!r}')
    parts, pos = [], 0
    for m in PLACEHOLDER.finditer(text):
        if m.group(1) not in INLINE:
            raise ValueError(f'{where}: segnaposto sconosciuto [[{m.group(1)}]]; nessun testo grezzo viene stampato')
        parts += [text[pos:m.start()], ('sym', INLINE[m.group(1)])]
        pos = m.end()
    parts.append(text[pos:])
    if any('[[' in p or ']]' in p for p in parts if isinstance(p, str)):
        raise ValueError(f'{where}: parentesi di segnaposto non chiuse in {text!r}')
    return [p for p in parts if p != '']


def _chunks(parts):
    out, cur = [], []
    for p in parts:
        if isinstance(p, str):
            for piece in re.split(r'([ \t\r\n]+)', p):
                if not piece:
                    continue
                if piece.strip(' \t\r\n') == '':
                    if cur:
                        out.append(cur); cur = []
                else:
                    cur.append(piece)
        else:
            cur.append(p)
    if cur:
        out.append(cur)
    return out


def _width(items, font, size):
    return sum(pdfmetrics.stringWidth(i, font, size) if isinstance(i, str) else size * SYM_ADVANCE for i in items)


def check_glyphs(text, font):
    glyphs = pdfmetrics.getFont(font).face.charToGlyph
    missing = sorted({c for c in text if not c.isspace() and ord(c) not in glyphs})
    if missing:
        raise ValueError(f'Caratteri senza glifo nel font {font}: {"".join(missing)}')


def wrap(text, font, size, width, where):
    """Greedy line breaking; returns lines as lists of strings and ('sym', kind). A word wider than the line is an error."""
    parts = parse_inline(text, where)
    check_glyphs(''.join(p for p in parts if isinstance(p, str)), font)
    space = pdfmetrics.stringWidth(' ', font, size)
    lines, cur, cur_w = [], [], 0
    for chunk in _chunks(parts):
        w = _width(chunk, font, size)
        if w > width + .01:
            raise Overflow(f'{where}: parola troppo larga a {size} pt: {"".join(c for c in chunk if isinstance(c, str))}')
        if cur and cur_w + space + w > width:
            lines.append(cur); cur, cur_w = [], 0
        if cur:
            cur, cur_w = cur + [' '], cur_w + space
        cur, cur_w = cur + chunk, cur_w + w
    if cur:
        lines.append(cur)
    return lines


def italic_font(directory=None):
    """Register the italic of the body font as 'Flavour' (Arial or DejaVu Sans); without one the flavour uses 'Body'. Bozza mode only."""
    if 'Flavour' in pdfmetrics.getRegisteredFontNames():
        return
    for d in ([directory] if directory else [Path('C:/Windows/Fonts'), Path('/usr/share/fonts/truetype/dejavu')]):
        for name in ('ariali.ttf', 'DejaVuSans-Oblique.ttf'):
            if (Path(d) / name).is_file():
                pdfmetrics.registerFont(TTFont('Flavour', str(Path(d) / name)))
                return
    pdfmetrics.registerFont(TTFont('Flavour', pdfmetrics.getFont('Body').face.filename))


def text_block(pdf, text, x, top, width, bottom, size, where, bold=False, color=INK, align='left', font=None):
    """Draw a wrapped text from `top` down; returns the new top. Raises Overflow when it does not reach `bottom`."""
    font = font or ('Strong' if bold else 'Body')
    lines = wrap(text, font, size, width, where)
    leading = size * LEADING
    if top - len(lines) * leading < bottom - .01:
        raise Overflow(f'{where}: testo non contenuto a {size} pt ({len(lines)} righe, mancano {(bottom - (top - len(lines) * leading)) / mm:.1f} mm)')
    for i, line in enumerate(lines):
        base = top - size - i * leading
        w = _width(line, font, size)
        cx = x if align == 'left' else x + (width - w) / 2 if align == 'center' else x + width - w
        for item in line:
            if isinstance(item, str):
                pdf.setFillColor(color); pdf.setFont(font, size)
                pdf.drawString(cx, base, item)
                cx += pdfmetrics.stringWidth(item, font, size)
            else:
                draw_symbol(pdf, item[1], cx + size * SYM_ADVANCE / 2, base + size * SYM_RISE, size * SYM_SIZE)
                cx += size * SYM_ADVANCE
    return top - len(lines) * leading


def line_width(text, size, where, bold=False):
    font = 'Strong' if bold else 'Body'
    return sum(_width(l, font, size) for l in wrap(text, font, size, 10 ** 6, where))


# ---------------------------------------------------------------------------------------------------------------- data
def _fail(msg):
    raise ValueError(f'bozza: {msg}')


def document_version(path, what):
    m = re.search(r'^Versione \*\*([0-9.]+) —', path.read_text(encoding='utf-8-sig'), re.M)
    if not m:
        _fail(f'{path.name}: versione {what} non trovata')
    return m.group(1)


def load_bozza(path, live=False, regulation=REGULATION, set_docs=SET_DOCS):
    """A set file. `live`: the live set, labelled with the version of its set document (Set Base 1.0) instead of the file's."""
    raw = path.read_bytes()
    data = json.loads(raw.decode('utf-8-sig'))
    if data.get('format') != 'sb-6b/1':
        _fail('formato sconosciuto, atteso sb-6b/1')
    for key in ('set', 'rules', 'characters', 'cards', 'decks'):
        if key not in data:
            _fail(f'manca la sezione {key}')
    rules = data['rules']
    slots = json.loads(SLOTS.read_text(encoding='utf-8'))['slot']
    deck_size, max_copies, bound_choices = rules.get('deckSize'), rules.get('maxCopies'), rules.get('boundChoices')
    cards_by_id, chars_by_id = {}, {}
    for c in data['characters']:
        if c['id'] in chars_by_id:
            _fail(f'personaggio duplicato {c["id"]}')
        chars_by_id[c['id']] = c
    for c in data['cards']:
        if c['binding'] in cards_by_id or c['binding'] in chars_by_id:
            _fail(f'identificatore duplicato {c["binding"]}')
        cards_by_id[c['binding']] = c
    decks, seen = [], set()
    for d in data['decks']:
        if d['id'] in seen:
            _fail(f'mazzo duplicato {d["id"]}')
        seen.add(d['id'])
        ch = chars_by_id.get(d['character'])
        if ch is None:
            _fail(f'{d["id"]}: personaggio sconosciuto {d["character"]}')
        for ref in (ch['basic'], *d['bound'], d['lastResort'], *d['cards']):
            if ref not in cards_by_id:
                _fail(f'{d["id"]}: carta sconosciuta {ref}')
        if len(d['bound']) != bound_choices or any(cards_by_id[b].get('boundTo') != d['character'] for b in d['bound']):
            _fail(f'{d["id"]}: legate non valide per {d["character"]}')
        if sum(d['cards'].values()) != deck_size or any(type(n) is not int or n <= 0 or n > max_copies for n in d['cards'].values()):
            _fail(f'{d["id"]}: mazzo di {sum(d["cards"].values())} carte, attese {deck_size} con al più {max_copies} copie')
        decks.append(d)
    basics = {c['basic'] for c in chars_by_id.values()}
    bounds = {b for d in decks for b in d['bound']} | {i for i, c in cards_by_id.items() if c.get('boundTo') or c.get('kind') == 'BOUND'}
    last = {d['lastResort'] for d in decks} | {i for i, c in cards_by_id.items() if c.get('lastResort')}
    faces = []
    for c in chars_by_id.values():
        if c['rarity'] not in RARITY:
            _fail(f'{c["id"]}: rarità sconosciuta {c["rarity"]}')
        res = c['resources']
        if set(res) != set(RESOURCES) or any(type(v) is not int for v in res.values()):
            _fail(f'{c["id"]}: risorse iniziali non valide')
        bound_names = [cards_by_id[i]['gui']['name'].strip() for i, x in cards_by_id.items() if x.get('boundTo') == c['id']]
        faces.append(dict(id=c['id'], name=c['name'].strip(), tag='Personaggio', rarity=c['rarity'], slot=slots.get(c['id'], ''), character=True,
                          resources=res, items=c['items'], immunities=c['immunities'], basic=cards_by_id[c['basic']]['gui']['name'].strip(),
                          bound_names=bound_names, text='', flavour=(c.get('flavour') or '').strip()))
    for i, c in cards_by_id.items():
        if c['rarity'] not in RARITY:
            _fail(f'{i}: rarità sconosciuta {c["rarity"]}')
        signals = [t for t, on in (('Base', i in basics), ('Ultima risorsa', i in last), ('Legata al personaggio', i in bounds)) if on]
        if len(signals) > 1:
            _fail(f'{i}: ruoli contraddittori {signals}')
        kind = c.get('kind')
        if kind not in (None, 'ACTION', 'BOUND', 'ITEM'):
            _fail(f'{i}: tipo sconosciuto {kind}')
        item = kind == 'ITEM' or (kind is None and 'priority' not in c)
        if signals and item:
            _fail(f'{i}: oggetto con ruolo di carta del personaggio')
        tag = signals[0] if signals else 'Oggetto' if item else 'Regolare'
        gui = c['gui']
        desc = gui['description']
        role = gui.get('role')
        if role not in ROLES:
            _fail(f'{i}: ruolo sconosciuto {role}')
        damage = gui.get('damage')
        if damage != '—' and damage not in DAMAGES:
            _fail(f'{i}: tipo di danno sconosciuto {damage}')
        targets = c.get('targets')
        if targets is not None:
            for t in targets:
                if t not in TARGETS:
                    _fail(f'{i}: bersaglio sconosciuto {t}')
        cost = c.get('cost')
        if cost is not None and (any(k not in RESOURCES for k in cost) or any(type(v) is not int for v in cost.values())):
            _fail(f'{i}: costo non valido {cost}')
        owner_id = c.get('boundTo') or c.get('exclusiveTo')
        owner = None
        if owner_id:
            if owner_id not in chars_by_id:
                _fail(f'{i}: personaggio sconosciuto {owner_id}')
            owner = ('Legata a: ' if c.get('boundTo') else 'Esclusiva di: ') + chars_by_id[owner_id]['name'].strip()
        faces.append(dict(id=i, name=gui['name'].strip(), tag=tag, rarity=c['rarity'], slot=slots.get(i, ''), character=False,
                          text=desc, flavour=(gui.get('flavour') or '').strip(), role=role, damage=damage, damage_amount=gui.get('damageAmount'),
                          cost=cost, priority=c.get('priority'), targets=targets, owner=owner, item=item))
    # The 20 cards of a deck, the character, its basic, the two bound and the last resort: 25 fronts.
    deck_cards = []
    for d in decks:
        ch = chars_by_id[d['character']]
        entries = Counter([d['character'], ch['basic'], *d['bound'], d['lastResort']])
        entries.update(d['cards'])
        deck_cards.append(dict(id=d['id'], character=d['character'], basic=ch['basic'], bound=d['bound'], last=d['lastResort'],
                               cards=d['cards'], quantities=entries, starter=d['id'].startswith(STARTER_PREFIX),
                               name=d.get('name'), category=d.get('category')))
    version = document_version(set_docs / f"{data['set']['id']}.md", 'del documento del set') if live else data['set']['version']
    return dict(raw_sha256=hashlib.sha256(raw).hexdigest(), set_label=f"{data['set']['name']} {version}", set_name=data['set']['name'], set_id=data['set']['id'], set_version=version,
                file_version=data['set']['version'], live=live, rules=document_version(regulation, 'del regolamento'), faces=faces, decks=deck_cards,
                limits=dict(deck_size=deck_size, max_copies=max_copies))


def select_decks(requests, decks, faces):
    """Deck id (with or without the `starter-` prefix), character id, short class name or display name."""
    by_id = {f['id']: f for f in faces}
    selected = []
    for request in requests:
        key = request.casefold()
        exact = [d for d in decks if key in (d['id'].casefold(), d['id'].removeprefix(STARTER_PREFIX).casefold() if d['starter'] else d['id'].casefold())]
        if exact:
            matches = exact
        else:
            matches = [d for d in decks if key in (d['character'].casefold(), d['character'].split('.')[-1].casefold(), by_id[d['character']]['name'].casefold(),
                                                   (d['name'] or '').casefold())]
            if len(matches) > 1 and sum(d['starter'] for d in matches) == 1:
                matches = [d for d in matches if d['starter']]
        if len(matches) != 1:
            ids = ', '.join(d['id'] for d in matches)
            raise ValueError(f'Mazzo sconosciuto o ambiguo: {request}' + (f' ({ids})' if matches else '') + '. Usa --list-starters e l’identificatore del mazzo.')
        selected.append(matches[0])
    return selected


def deck_label(deck, by_id):
    kind = (f'starter {deck["category"]} «{deck["name"]}»' if deck['category'] else 'starter') if deck['starter'] else 'misura'
    return f'{deck["id"]} | {by_id[deck["character"]]["name"]} | {kind} | {sum(deck["quantities"].values())} fronti (personaggio incluso)'


# --------------------------------------------------------------------------------------------------------------- faces
def crop_marks(pdf, x, y, width, height):
    pdf.setStrokeColor(HexColor('#636c71')); pdf.setLineWidth(.3)
    for cx in (x, x + width):
        for cy in (y, y + height):
            dx, dy = (-1 if cx == x else 1), (-1 if cy == y else 1)
            pdf.line(cx + dx * .5 * mm, cy, cx + dx * 1.5 * mm, cy)
            pdf.line(cx, cy + dy * .5 * mm, cx, cy + dy * 1.5 * mm)


def draw_face(pdf, face, x, y, width, height, number, total, stamp, mark='BOZZA PROVVISORIA'):
    """One front; `mark` is the word in the band (the provisional mark of a draft, the set of the live print). Raises Overflow naming the card when a text does not fit (flavour included, D166 (2)).

    Returns the vertical room in mm: `room` is left under the text and the flavour, `room_without_flavour` under the text alone
    (the fit test of SB-25 reads both)."""
    where = f'{face["id"]} «{face["name"]}»'
    tag = face['tag']
    color = HexColor(COLORS[tag])
    inner = width - 8 * mm
    label, pips = RARITY[face['rarity']]
    pdf.setStrokeColor(HexColor('#a8afb3')); pdf.setLineWidth(.35)
    pdf.rect(x, y, width, height)
    pdf.setFillColor(color); pdf.rect(x, y + height - 5 * mm, width, 5 * mm, stroke=0, fill=1)
    pdf.setFillColor(white); pdf.setFont('Strong', 6)
    pdf.drawString(x + 4 * mm, y + height - 3.4 * mm, mark)
    right = x + width - 4 * mm
    pdf.setFont('Strong', 6); pdf.drawRightString(right - pips * 2.6 - 1.2, y + height - 3.4 * mm, label)
    pdf.setFillColor(white)
    for k in range(pips):
        pdf.circle(right - 1 - k * 2.6, y + height - 2.6 * mm, 1, stroke=0, fill=1)
    pdf.setFillColor(INK); pdf.setStrokeColor(color)
    top = y + height - 6.5 * mm
    symbol(pdf, x + 6 * mm, top - 3 * mm, 5 * mm, tag)
    after = text_block(pdf, TAG_LABEL[tag], x + 10.5 * mm, top - .3 * mm, width - 14.5 * mm, y, 7, where, True, color)
    top = min(after, top - 6 * mm) - 1 * mm
    top = text_block(pdf, face['name'], x + 4 * mm, top, inner, y + height - 40 * mm, 10.5, where, True) - 1 * mm
    bottom = y + 11 * mm
    if face['character']:
        top = text_block(pdf, 'VALORI INIZIALI', x + 4 * mm, top - .5 * mm, inner, bottom, 7.5, where, True, color)
        cell = inner / 5
        for k, res in enumerate(RESOURCES):
            cx = x + 4 * mm + cell * (k + .5)
            draw_symbol(pdf, res, cx, top - 3 * mm, 4.4 * mm)
            text_block(pdf, str(face['resources'][res]), cx - cell / 2, top - 5.8 * mm, cell, bottom, 9, where, True, align='center')
        top -= 11.5 * mm
        pdf.setStrokeColor(color); pdf.line(x + 4 * mm, top, x + width - 4 * mm, top)
        top -= 1.5 * mm
        # SB-25: the words of the glossary («immune a [[T]]»), not the resource's English name; shorter, so the flavour fits.
        imm = 'Immune a ' + ' e '.join(f'[[{LETTER_OF[i]}]]' for i in face['immunities']) if face['immunities'] else 'Nessuna immunità'
        for line in (f'Capacità oggetti: {face["items"]} · {imm}', f'Base: {face["basic"]}', f'Legate (2 a scelta): {"; ".join(face["bound_names"])}'):
            top = text_block(pdf, line, x + 4 * mm, top, inner, bottom, 9, where) - .8 * mm
    else:
        if face['owner']:
            top = text_block(pdf, face['owner'], x + 4 * mm, top, inner, bottom, 7, where) - .6 * mm
        if not face['item']:
            cost = ', '.join(f'{n} [[{LETTER_OF[r]}]]' for r, n in face['cost'].items()) if face['cost'] else '—'
            prio = '—' if face['priority'] is None else str(face['priority'])
            top = text_block(pdf, f'Costo: {cost}   |   Priorità: {prio}', x + 4 * mm, top, inner, bottom, 8.5, where, True)
            tgt = ' / '.join(TARGETS[t] for t in face['targets']) if face['targets'] else 'come da testo'
            top = text_block(pdf, 'Bersaglio: ' + tgt, x + 4 * mm, top - 1 * mm, inner, bottom, 8.5, where) - 1 * mm
        # Role (and nominal damage, when the card has one) in the client's symbols.
        row = top - 2.6 * mm
        draw_symbol(pdf, face['role'], x + 6.2 * mm, row, 3.6 * mm)
        pdf.setFillColor(INK)
        used = text_block(pdf, ROLE_LABEL[face['role']], x + 9.4 * mm, top - .2 * mm, 22 * mm, bottom, 7, where, True, HexColor(symbol_colors(face['role'])[0]))
        if face['damage'] != '—':
            dx = x + 33.5 * mm
            draw_symbol(pdf, face['damage'], dx, row, 3.8 * mm)
            # SB-25: the symbol says the type, so only the amount is printed («HIT 20» in the data, D168 (4), prints as the symbol and «20»).
            amount = face['damage_amount'].removeprefix(face['damage'] + ' ')
            used = min(used, text_block(pdf, amount, dx + 2.6 * mm, top - .2 * mm, x + width - 4 * mm - dx - 2.6 * mm, bottom, 7.5, where, True))
        top = min(used, top - 5.2 * mm)
        pdf.setStrokeColor(color); pdf.setLineWidth(.35); pdf.line(x + 4 * mm, top - 1 * mm, x + width - 4 * mm, top - 1 * mm)
        top = text_block(pdf, face['text'], x + 4 * mm, top - 2.5 * mm, inner, bottom, 9, where)
    without = top
    if face.get('flavour'):
        try:
            top = text_block(pdf, face['flavour'], x + 4 * mm, top - FLAVOUR_GAP * mm, inner, bottom, FLAVOUR_PT, where, font='Flavour')
        except Overflow as error:
            raise Overflow(f'{error} [flavour; senza flavour restano {(without - bottom) / mm:.1f} mm]') from None
    # Footer: slot and binding id (small), then the stamp: set and version, regulation, short hash of the file.
    pdf.setFillColor(INK); pdf.setFont('Body', 6)
    ident = (face['slot'] + ' · ' if face['slot'] else '') + face['id']
    check_glyphs(ident + stamp, 'Body')
    if pdfmetrics.stringWidth(ident, 'Body', 6) > inner or pdfmetrics.stringWidth(stamp, 'Body', 6) + pdfmetrics.stringWidth(f'{number}/{total}', 'Body', 6) + 3 > inner:
        raise Overflow(f'{where}: piè di carta non contenuto a 6 pt')
    pdf.drawString(x + 4 * mm, y + 6.4 * mm, ident)
    pdf.drawString(x + 4 * mm, y + 3 * mm, stamp)
    pdf.drawRightString(x + width - 4 * mm, y + 3 * mm, f'{number}/{total}')
    crop_marks(pdf, x, y, width, height)
    return dict(room=round((top - bottom) / mm, 2), room_without_flavour=round((without - bottom) / mm, 2))


# --------------------------------------------------------------------------------------------------------------- guide
class Guide:
    """Reference pages after the fronts: paragraphs move to a new page, never shrink."""

    def __init__(self, pdf, first_page, stamp, title='SET BASE / GUIDA AL TAVOLO', label='Guida'):
        self.pdf, self.count, self.top, self.stamp, self.first = pdf, first_page, 0, stamp, first_page
        self.title, self.label = title, label
        self.pw, self.ph = A4

    def page(self):
        if self.top:
            self.pdf.showPage()
        self.count += 1
        self.pdf.setFillColor(INK); self.pdf.setFont('Body', 7)
        self.pdf.drawString(16 * mm, 10 * mm, f'{self.stamp} | A4, dimensioni effettive 100% | {self.label} {self.count - self.first}')
        self.top = self.ph - 18 * mm
        self.block(self.title, 15, True)

    def height(self, text, size, bold, width, where):
        return len(wrap(text, 'Strong' if bold else 'Body', size, width, where)) * size * LEADING

    def block(self, text, size=9, bold=False, indent=0, gap=3, where='guida'):
        width = self.pw - 32 * mm - indent
        if self.top == 0:
            self.page()
        h = self.height(text, size, bold, width, where)
        if self.top - h < (35 if bold else 20) * mm:
            self.page()
        self.top = text_block(self.pdf, text, 16 * mm + indent, self.top, width, 20 * mm, size, where, bold) - gap * mm

    def row(self, kind, text, size=9):
        if self.top - 9 * mm < 20 * mm:
            self.page()
        draw_symbol(self.pdf, kind, 21 * mm, self.top - 3 * mm, 6 * mm)
        text_block(self.pdf, text, 27 * mm, self.top, self.pw - 43 * mm, 20 * mm, size, 'legenda')
        self.top -= 8.5 * mm

    def badge(self, tag, text):
        if self.top - 9 * mm < 20 * mm:
            self.page()
        self.pdf.setStrokeColor(HexColor(COLORS[tag])); self.pdf.setFillColor(INK)
        symbol(self.pdf, 21 * mm, self.top - 3 * mm, 6 * mm, tag)
        text_block(self.pdf, text, 27 * mm, self.top, self.pw - 43 * mm, 20 * mm, 9, 'legenda')
        self.top -= 8.5 * mm


# SB-25 (D169 (2)–(3)): the whole rule of each keyword and what every card takes for granted, once, here. Worded from the
# regulation (docs/game-rules.md), which stays the full source; each paragraph names where it comes from. The approved glossary of
# SB-25 Fase A gave the words of the definitions. SB-28: the playground rules became regulation 2.0 (D183); the references to them
# (RP-n) now cite the rules of the regulation that took them in (docs/design/set-base/sb-28/corrispondenza.md).
KEYWORD_RULES = (
    ('Metà e quarti', 'Metà e quarti si arrotondano sempre per difetto: metà di 15 è 7, un quarto di 10 è 2, una volta e mezza 15 è 22. '
     'Vale per ogni quantità e ogni fattore delle carte e per gli effetti di fine turno; per questo le carte non lo ripetono '
     '(regolamento, R05 e R06; D169).'),
    ('Mai sotto zero', 'Nessuna risorsa scende sotto zero, [[H]] compresa: chi perde più di quanto ha arriva a 0 (regolamento, R01 «Pavimento a zero»). '
     'Un costo si paga solo con quello che hai; un costo in [[H]] che ti porterebbe a 0 o sotto non si paga (regolamento, R03).'),
    ('Chi si muove prima', 'Le mosse si risolvono per gruppi di velocità: prima la priorità più alta, a pari priorità chi ha più [[A]] dopo aver pagato i costi; '
     'dentro un gruppo le mosse sono simultanee. La mossa di chi è a terra all’inizio del suo gruppo si annulla, salvo che sia rivolta a sé '
     'o a un proprio oggetto (regolamento, R04).'),
    ('Gioca d’anticipo', '«Gioca d’anticipo: E» vuol dire: se la tua mossa si risolve prima di quella dell’avversario che bersagli, applichi anche E. '
     '«Prima» vuol dire in un gruppo di velocità precedente; nello stesso gruppo non c’è anticipo. Non c’è anticipo se l’avversario non gioca '
     '(nessuna mossa, eliminato, forfait) o se la tua mossa viene annullata; c’è se la sua verrà annullata più tardi, o se è già a terra ma la sua mossa '
     'è ancora da risolvere. Con più avversari conta solo quello bersagliato (regolamento, R07b «Gioca d’anticipo»).'),
    ('Rincara', '«Rincara X (Y a te)»: per ogni volta che hai già giocato questa carta nella partita, +X ai danni all’avversario e +Y a quelli che subisci tu. '
     'Contano le tue giocate di questa carta, anche quelle annullate, non quelle dell’avversario; il conto è pubblico (regolamento, R07b «Rincara» e R08).'),
    ('Annuncia', '«Annuncia X»: al posto della pesca che segue la tua mossa cerchi nel mazzo una carta di nome X. Con «Annuncia X o Y» scegli tu, quando giochi la carta, '
     'quale cercare fra i nomi che hai ancora nel mazzo; con uno solo la scelta è quella. Se la trovi va in mano, la mostri a tutti, ricevi solo i guadagni '
     '«Se lo trovi» e diventi Vulnerabile, legato a quel nome. Se non la trovi peschi normalmente e ricevi solo i guadagni «Se non lo trovi». '
     'Dopo ogni ricerca, trovata o no, il mazzo si mischia. La copia trovata resta scoperta finché è in mano (regolamento, R02a e R07b «Annuncia»).'),
    ('Vulnerabile', 'Chi è Vulnerabile subisce una volta e mezza i [[HIT]], i [[CUT]] e i [[POISON]] che subirebbe, anche il veleno di fine turno. '
     'Il gettone è sul giocatore ed è legato al nome della carta trovata: cade dopo tutti gli effetti di fine turno del turno in cui giochi una carta con quel nome, '
     'anche se viene parata o annullata (scartarla non basta). Se a fine turno quel nome non è più né in mano né nel mazzo, il gettone resta per tutto il turno dopo, poi cade. '
     'Più gettoni sono indipendenti e si moltiplicano (due: due volte e un quarto); una carta giocata ne toglie uno solo, il più vecchio. '
     'Il timer di «Mescolone Micidiale», che toglie tutti gli stati, toglie anche i gettoni Vulnerabile (regolamento, R07b «Vulnerabile e gettone»; D171).'),
    ('Stati e durate', 'Uno stato positivo o negativo cambia i danni o le risorse finché dura; più stati si applicano nell’ordine in cui sono arrivati, e ogni carta ne dà uno suo. '
     '«In questo turno» dura fino alla fine del turno, «in questo turno e nel prossimo» anche il turno dopo; senza durata resta. '
     'Un timer conta anche il turno in cui nasce: «alla fine del quinto turno, contando questo» (regolamento, R05 e R06).'),
    ('Equipaggiamento', 'Un equipaggiamento è uno stato positivo del personaggio, non un oggetto in campo: consumare un oggetto o un token che equipaggia lo toglie dal campo e ti dà lo stato. '
     'Dura come dice la carta; una carta che toglie gli equipaggiamenti lo toglie. Con «dopo il primo uso dura solo fino a fine turno»: dal primo danno che cambia vale ancora, '
     'su ogni danno, fino alla fine di quel turno, poi scompare (regolamento, R01a e R05).'),
    ('Immune', 'Chi è immune a [[T]] non subisce il veleno di fine turno della sua [[T]]; chi è immune a [[L]] non ne subisce l’effetto di fine turno. '
     'Costi, guadagni, perdite e danni [[POISON]] restano (regolamento, R01 e R06).'),
    ('Fine turno', 'A fine turno, per ogni personaggio vivo: con [[T]] sopra 0 subisce [[POISON]] pari a metà della sua [[T]]; con [[L]] sopra 0 perde [[A]] pari a metà della sua [[L]], '
     'poi la sua [[L]] diventa metà più 1; poi scadono i timer e calano le durate degli stati (regolamento, R06).'),
    ('Corazza dell’alcol', 'Chi ha [[L]] sopra 0 subisce i [[HIT]] ridotti di un quarto della sua [[L]], dopo gli stati e mai sotto zero; [[CUT]] e [[POISON]] no. '
     'Vale anche sui danni che infligge a sé (regolamento, R05 «Corazza dell’alcol»).'),
)
DAMAGE_NAME_IT = dict(HIT='Colpo', CUT='Taglio', POISON='Veleno')  # the names of the glossary of SB-25 Fase A, as in the client


def keyword_rules(g):
    g.block('Parole chiave e regole che le carte presuppongono', 12, True)
    g.block('Il testo breve delle carte non ripete queste regole: valgono per ogni carta. Sono riassunte dal regolamento, che resta la fonte completa.')
    for title, text in KEYWORD_RULES:
        g.block(title, 10, True, gap=1)
        g.block(text, 9, indent=3 * mm)


def full_text_entries(selected_ids=None):
    """The entries of testi-completi.json in their order (characters, cards, token); with `selected_ids` only those, plus the token."""
    data = json.loads(FULL_TEXTS.read_text(encoding='utf-8'))
    return [(binding, v) for binding, v in data['voci'].items() if selected_ids is None or binding in selected_ids or v['tipo'] == 'token']


def build_full_texts(pdf, entries, first_page, stamp):
    """SB-25 (D170 (4)): a booklet after the guide, in the same PDF, with the full text («oracle text») of every printed entry."""
    pdf.showPage()
    g = Guide(pdf, first_page, stamp, 'SET BASE / TESTI COMPLETI', 'Testi completi')
    g.page()
    g.block(f'Il testo completo di {len(entries)} voci: preciso, dice anche ciò che il testo breve della carta tace (arrotondamenti, quando si legge una risorsa, '
            'cosa conta e cosa no, da quando a quando vale). In caso di dubbio prevale sul testo breve. Per le parole chiave rimanda al regolamento. '
            'Generato da docs/design/set-base/testi/testi-completi.json.')
    tipo = {'personaggio': 'personaggio', 'carta': 'carta', 'token': 'token'}
    for binding, v in entries:
        where = f'testi completi {binding}'
        g.block(f'{v["nome"]} · {v["slot"]} · {tipo.get(v["tipo"], v["tipo"])}', 9.5, True, gap=.8, where=where)
        for k, paragraph in enumerate(v['completo']):
            g.block(paragraph, 8.5, indent=3 * mm, gap=2.4 if k == len(v['completo']) - 1 else .8, where=where)
    return g.count


def build_guide(pdf, bz, face_by_id, shown_decks, first_page, selected, args_copies, stamp, source):
    g = Guide(pdf, first_page, stamp, ('BOZZA DEL SET BASE' if not bz['live'] else bz['set_name'].upper()) + ' / GUIDA AL TAVOLO')
    g.page()
    imprint = f'(SHA-256 {bz["raw_sha256"][:12]}…; l’impronta intera è nel manifest)'
    if bz['live']:
        g.block(f'{bz["set_label"]}, regolamento {bz["rules"]}', 12, True)
        g.block(f'Questa stampa è il {bz["set_label"]} della partita viva, dal file del set {source} {imprint}. Confronta l’impronta sul piè di ogni carta prima di mescolare stampe diverse.')
        g.block(f'Le regole per giocare sono nel regolamento {bz["rules"]} (docs/game-rules.md) e le schede normative delle carte nel documento del set (docs/sets/{bz["set_id"]}.md): restano le fonti complete. '
                'Questa guida riporta le parole chiave e le regole che il testo delle carte presuppone e non ripete; in fondo alla stampa i «Testi completi» dicono per ogni carta tutto ciò che il testo breve tace. In caso di dubbio prevale il testo completo sul testo breve.')
    else:
        g.block('Bozza provvisoria, non normativa', 12, True)
        g.block(f'Questa stampa è la bozza del {bz["set_name"]} (versione «{bz["set_version"]}») con il regolamento {bz["rules"]}, dal file {source} {imprint}. '
                'Cambia a ogni revisione della bozza: confronta l’impronta sul piè di ogni carta prima di mescolare stampe diverse.')
        g.block('Le regole per giocare sono nel regolamento (docs/game-rules.md), che resta la fonte completa. Questa guida riporta le parole chiave e le regole che il testo delle carte presuppone e non ripete; in fondo alla stampa i «Testi completi» dicono per ogni carta tutto ciò che il testo breve tace. In caso di dubbio prevale il testo completo sul testo breve.')
    g.block('Stampa e taglio', 12, True)
    g.block('Solo fronti. Taglia sui segni esterni e inserisci ogni stampa davanti a una carta di supporto nella sleeve. A4 a colori, dimensioni effettive / 100%, senza adattamento. Misura un rettangolo prima di tagliare: deve corrispondere alle dimensioni indicate a fondo foglio.')
    g.pdf.setStrokeColor(INK); g.pdf.line(16 * mm, g.top, 66 * mm, g.top)
    for xx in (16 * mm, 66 * mm):
        g.pdf.line(xx, g.top - 2 * mm, xx, g.top + 2 * mm)
    g.top -= 3 * mm
    g.block('Controllo scala: il segmento sopra deve misurare 50 mm.')
    g.block('Simboli', 12, True)
    g.block('Risorse (come sul tavolo digitale; nel testo delle carte compaiono come simbolo):', 9, True)
    for letter, res in RESOURCE_LETTERS.items():
        g.row(res, f'{res} ({letter}) = {RESOURCE_NAME_IT[res]}')
    g.block('Ruoli (nell’intestazione delle azioni):', 9, True)
    for role in ROLES:
        g.row(role, ROLE_LABEL[role])
    g.block('Tipi di danno (accanto all’ammontare nominale e nel testo delle carte; «x» è spiegata dal testo della carta):', 9, True)
    for dmg in DAMAGES:
        g.row(dmg, f'{DAMAGE_NAME_IT[dmg]} ({dmg})')
    g.block('Lettura della carta', 12, True)
    g.block('In alto: tipo di carta e rarità (1, 2 o 3 pallini = comune, non comune, rara; i personaggi sono PROTAGONISTA, P: una rarità descrittiva, senza effetti sul gioco, regolamento, R07). Sotto il nome: costo, priorità e bersaglio, poi il ruolo e l’eventuale danno nominale. «Bersaglio: come da testo» indica una carta il cui bersaglio è nel testo. Sotto il testo, in corsivo, il flavour: non ha effetti. Il codice in basso è lo slot della carta nel set e il suo identificatore.')
    for tag, text in (('Personaggio', 'Personaggio: blu, esagono.'), ('Regolare', 'Azione regolare: terracotta, triangolo.'), ('Base', 'Base: petrolio, cerchio.'),
                      ('Legata al personaggio', 'Legata al personaggio: viola, rombo.'), ('Ultima risorsa', 'Ultima risorsa: ocra, triangolo.'), ('Oggetto', 'Oggetto: verde, quadrato.')):
        g.badge(tag, text)
    keyword_rules(g)
    g.block('Composizione dei mazzi' + (' stampati' if selected else ' di partenza'), 12, True)
    g.block(f'Mazzo = personaggio, la sua base, due legate, una ultima risorsa e {bz["limits"]["deck_size"]} carte (al più {bz["limits"]["max_copies"]} copie ciascuna): {5 + bz["limits"]["deck_size"]} fronti. '
            + (f'Selezione di stampa: {"; ".join(f"{n * args_copies} × {d}" for d, n in Counter(x["id"] for x in selected).items())}. Le copie condivise fra mazzi sono sommate: per dividerli segui le composizioni qui sotto.' if selected
               else 'Una copia per carta non è un mazzo: per stampare mazzi completi usa --starter o --all-starters.'))
    for deck in shown_decks:
        name = lambda i: face_by_id[i]['name']
        g.block(f'{deck["id"]} — {name(deck["character"])}' + (f' (starter {deck["category"]} «{deck["name"]}»)' if deck['category'] else ''), 10, True, gap=1)
        g.block(f'Personaggio e carte fisse: {name(deck["character"])}; base: {name(deck["basic"])}; legate: {"; ".join(name(b) for b in deck["bound"])}; ultima risorsa: {name(deck["last"])}', 9, indent=3 * mm, gap=1)
        nb = ' '  # "2 x name" stays on one line
        g.block('Mazzo: ' + '; '.join(f'{n}{nb}×{nb}' + name(c).replace(' ', nb) for c, n in deck['cards'].items()) + '.', 9, indent=3 * mm)
    return g.count


# ------------------------------------------------------------------------------------------------------------------ run
def run(args, parser):
    path = args.set_file
    bz = load_bozza(path, live=args.bozza is None)
    source = str(path.relative_to(ROOT).as_posix() if path.is_relative_to(ROOT) else path)
    faces = bz['faces']
    by_id = {f['id']: f for f in faces}
    decks = bz['decks']
    if args.list_starters:
        for d in decks:
            print(deck_label(d, by_id))
        return
    if args.all_decks and not args.all_starters:
        parser.error('--all-decks si usa con --all-starters')
    pool = decks if args.all_decks else [d for d in decks if d['starter']]
    selected = pool if args.all_starters else select_decks(args.starter, decks, faces)
    quantities = Counter()
    if args.all_starters or args.starter:
        for d in selected:
            for card, n in d['quantities'].items():
                quantities[card] += n * args.copies
    else:
        quantities.update({f['id']: args.copies for f in faces})
    fonts(args.font_dir)
    italic_font(args.font_dir)
    overrides = json.loads(args.copies_file.read_text(encoding='utf-8')) if args.copies_file else {}
    if not isinstance(overrides, dict) or set(overrides) - set(by_id):
        raise ValueError('copies-file deve essere un oggetto con identificatori del file del set')
    if any(type(n) is not int or n < 0 for n in overrides.values()):
        raise ValueError('Le copie devono essere interi non negativi')
    for card, n in overrides.items():
        quantities[card] = n
    width, height, margin, gap = [v * mm for v in (args.width_mm, args.height_mm, args.margin_mm, args.gap_mm)]
    pw, ph = A4
    cols = math.floor((pw - 2 * margin + gap) / (width + gap))
    rows = math.floor((ph - 2 * margin + gap) / (height + gap))
    if cols < 1 or rows < 1:
        parser.error('Nessuna carta entra nel foglio A4 con queste dimensioni')
    instances = [f for f in faces for _ in range(quantities[f['id']])]
    if not instances:
        parser.error('Nessuna copia da stampare')
    sha12 = bz['raw_sha256'][:12]
    stamp = ('' if bz['live'] else 'BOZZA · ') + f'{bz["set_label"]} · reg. {bz["rules"]} · {sha12}'
    mark = bz['set_label'].upper() if bz['live'] else 'BOZZA PROVVISORIA'
    total = len(faces)
    # Every card is laid out once on a scratch page before anything is published: all the overflows are reported together.
    problems = []
    scratch = canvas.Canvas(BytesIO(), pagesize=A4)
    for f in faces:
        if quantities[f['id']]:
            try:
                draw_face(scratch, f, 0, 0, width, height, faces.index(f) + 1, total, stamp, mark)
            except ValueError as error:
                problems.append((f, str(error)))
    if problems:
        lines = [f'{len(problems)} carte non entrano nel formato {args.width_mm:g} x {args.height_mm:g} mm (nessun testo viene troncato o ridotto):']
        lines += [f'  {f["id"]} | testo {len(f["text"])} caratteri, flavour {len(f.get("flavour", ""))} | {msg}' for f, msg in problems]
        raise ValueError('\n'.join(lines))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.partial.pdf')
    pdf = canvas.Canvas(str(temporary), pagesize=A4, invariant=1)
    pdf.setTitle(f'Botte Micidiali | {"" if bz["live"] else "bozza "}{bz["set_label"]} | regolamento {bz["rules"]} | {sha12}')
    pdf.setAuthor('Botte Micidiali - generatore delle carte stampabili')
    per_sheet = cols * rows
    sheet_count = math.ceil(len(instances) / per_sheet)
    left = (pw - cols * width - (cols - 1) * gap) / 2
    upper = (ph + rows * height + (rows - 1) * gap) / 2
    positions = []
    for i, f in enumerate(instances):
        slot = i % per_sheet
        x = left + (slot % cols) * (width + gap)
        y = upper - (slot // cols) * (height + gap) - height
        draw_face(pdf, f, x, y, width, height, faces.index(f) + 1, total, stamp, mark)
        positions.append(dict(id=f['id'], page=i // per_sheet + 1, rect_mm=[v / mm for v in (x, y, width, height)]))
        if slot == per_sheet - 1 or i == len(instances) - 1:
            pdf.setFillColor(INK); pdf.setFont('Body', 6)
            pdf.drawCentredString(pw / 2, 4 * mm, f'BOTTE MICIDIALI / {"" if bz["live"] else "BOZZA / "}{args.width_mm:g} x {args.height_mm:g} mm / A4 - 100% / foglio {i // per_sheet + 1}/{sheet_count}')
            pdf.showPage()
    by_deck = bool(args.all_starters or args.starter)
    shown = {d['id'] for d in (selected if by_deck else pool)}
    guide_end = build_guide(pdf, bz, by_id, [d for d in decks if d['id'] in shown], sheet_count, selected if by_deck else [], args.copies, stamp, source)
    entries = full_text_entries({f['id'] for f in instances} if by_deck else None)
    page_count = build_full_texts(pdf, entries, guide_end, stamp)
    pdf.save()
    temporary.replace(args.output)
    manifest = dict(mode='set' if bz['live'] else 'bozza', set=bz['set_label'], file_version=bz['file_version'], rules_version=bz['rules'],
                    set_file=dict(path=source, sha256=bz['raw_sha256'], sha256_short=sha12),
                    catalog_count=len(faces), printed_count=len(instances),
                    selection=dict(mode='decks' if by_deck else 'catalog', decks=[d['id'] for d in selected] if by_deck else [],
                                   all_decks=bool(args.all_decks), multiplier=args.copies, overrides=overrides),
                    card_pages=sheet_count, guide_pages=guide_end - sheet_count, full_text_pages=page_count - guide_end, full_text_entries=len(entries), total_pages=page_count, grid=[cols, rows], trim_mm=[args.width_mm, args.height_mm], minimum_body_pt=9,
                    decks=[dict(id=d['id'], name=d['name'], category=d['category']) for d in decks],
                    inventory=[dict(id=f['id'], name=f['name'], tag=f['tag'], rarity=f['rarity'], copies=quantities[f['id']]) for f in faces],
                    placements=positions)
    args.output.with_suffix('.manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8', newline='\n')
    print(f'{args.output}: {"" if bz["live"] else "bozza "}{bz["set_label"]} (regolamento {bz["rules"]}, {sha12}), {len(faces)} voci, {len(instances)} fronti, {sheet_count} fogli carte, {guide_end - sheet_count} pagine di guida, {page_count - guide_end} di testi completi ({len(entries)} voci), {page_count} pagine totali; griglia {cols}x{rows}.')

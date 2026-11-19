"""Bozza mode of the generator: print the Set Base draft (bozza.json) for in-person play.

Everything is read at run time from server/src/test/resources/set-base/bozza.json: a rerun picks up any change of the draft.
Fronts carry a provisional mark (set version, playground rules, short SHA-256 of the draft). Resource, role and damage
symbols are the vector shapes of the client (symbols_pdf.py), never font glyphs; a placeholder the generator does not
know fails loudly. Text that does not fit is refused, never truncated or shrunk. Not normative: the playground rules
are in docs/design/set-base/regole-playground.md and are only pointed to, not reprinted.
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
from reportlab.pdfgen import canvas

from generate import COLORS, INK, ROOT, fonts, symbol
from symbols_pdf import (DAMAGES, RESOURCE_LETTERS, RESOURCES, ROLES, ROLE_LABEL, RESOURCE_NAME_IT, LAYERS, colors as symbol_colors, draw_symbol)

DEFAULT_BOZZA = ROOT / 'server/src/test/resources/set-base/bozza.json'
PLAYGROUND = ROOT / 'docs/design/set-base/regole-playground.md'
STARTER_PREFIX = 'starter-'
SLOT = re.compile(r'^([A-Z]{2,3}-[A-Z0-9]+) · ')
PLACEHOLDER = re.compile(r'\[\[([^\]]*)\]\]')
SYM_ADVANCE = 1.08    # advance of an inline symbol, in em
SYM_SIZE = .95        # diameter of an inline symbol, in em
SYM_RISE = .34        # centre of an inline symbol above the baseline, in em
LEADING = 1.28
RARITY = {'COMMON': ('COMUNE', 1), 'UNCOMMON': ('NON COMUNE', 2), 'RARE': ('RARA', 3)}
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
        if m.group(1) not in RESOURCE_LETTERS:
            raise ValueError(f'{where}: segnaposto sconosciuto [[{m.group(1)}]]; nessun testo grezzo viene stampato')
        parts += [text[pos:m.start()], ('sym', RESOURCE_LETTERS[m.group(1)])]
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


def text_block(pdf, text, x, top, width, bottom, size, where, bold=False, color=INK, align='left'):
    """Draw a wrapped text from `top` down; returns the new top. Raises Overflow when it does not reach `bottom`."""
    font = 'Strong' if bold else 'Body'
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


def playground_profile(path=PLAYGROUND):
    m = re.match(r'# Regole del playground in vigore \((d\d+)\)', path.read_text(encoding='utf-8-sig'))
    if not m:
        _fail(f'{path.name}: profilo delle regole non riconosciuto nel titolo')
    return m.group(1)


def load_bozza(path, playground=PLAYGROUND):
    raw = path.read_bytes()
    data = json.loads(raw.decode('utf-8-sig'))
    if data.get('format') != 'sb-6b/1':
        _fail('formato sconosciuto, atteso sb-6b/1')
    for key in ('set', 'rules', 'characters', 'cards', 'decks'):
        if key not in data:
            _fail(f'manca la sezione {key}')
    rules = data['rules']
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
        faces.append(dict(id=c['id'], name=c['name'].strip(), tag='Personaggio', rarity=c['rarity'], slot='', character=True,
                          resources=res, items=c['items'], immunities=c['immunities'], basic=cards_by_id[c['basic']]['gui']['name'].strip(),
                          bound_names=bound_names, text=''))
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
        m = SLOT.match(desc)
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
        faces.append(dict(id=i, name=gui['name'].strip(), tag=tag, rarity=c['rarity'], slot=m.group(1) if m else '', character=False,
                          text=desc[m.end():] if m else desc, role=role, damage=damage, damage_amount=gui.get('damageAmount'),
                          cost=cost, priority=c.get('priority'), targets=targets, owner=owner, item=item))
    # The 20 cards of a deck, the character, its basic, the two bound and the last resort: 25 fronts.
    deck_cards = []
    for d in decks:
        ch = chars_by_id[d['character']]
        entries = Counter([d['character'], ch['basic'], *d['bound'], d['lastResort']])
        entries.update(d['cards'])
        deck_cards.append(dict(id=d['id'], character=d['character'], basic=ch['basic'], bound=d['bound'], last=d['lastResort'],
                               cards=d['cards'], quantities=entries, starter=d['id'].startswith(STARTER_PREFIX)))
    return dict(raw_sha256=hashlib.sha256(raw).hexdigest(), set_label=f"{data['set']['name']} {data['set']['version']}", set_name=data['set']['name'], set_version=data['set']['version'],
                rules=playground_profile(playground), faces=faces, decks=deck_cards, limits=dict(deck_size=deck_size, max_copies=max_copies))


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
            matches = [d for d in decks if key in (d['character'].casefold(), d['character'].split('.')[-1].casefold(), by_id[d['character']]['name'].casefold())]
            if len(matches) > 1 and sum(d['starter'] for d in matches) == 1:
                matches = [d for d in matches if d['starter']]
        if len(matches) != 1:
            ids = ', '.join(d['id'] for d in matches)
            raise ValueError(f'Mazzo sconosciuto o ambiguo: {request}' + (f' ({ids})' if matches else '') + '. Usa --list-starters e l’identificatore del mazzo.')
        selected.append(matches[0])
    return selected


def deck_label(deck, by_id):
    return f'{deck["id"]} | {by_id[deck["character"]]["name"]} | {"starter" if deck["starter"] else "misura"} | {sum(deck["quantities"].values())} fronti (personaggio incluso)'


# --------------------------------------------------------------------------------------------------------------- faces
def crop_marks(pdf, x, y, width, height):
    pdf.setStrokeColor(HexColor('#636c71')); pdf.setLineWidth(.3)
    for cx in (x, x + width):
        for cy in (y, y + height):
            dx, dy = (-1 if cx == x else 1), (-1 if cy == y else 1)
            pdf.line(cx + dx * .5 * mm, cy, cx + dx * 1.5 * mm, cy)
            pdf.line(cx, cy + dy * .5 * mm, cx, cy + dy * 1.5 * mm)


def draw_face(pdf, face, x, y, width, height, number, total, stamp):
    """One bozza front. Raises Overflow naming the card when a text does not fit."""
    where = f'{face["id"]} «{face["name"]}»'
    tag = face['tag']
    color = HexColor(COLORS[tag])
    inner = width - 8 * mm
    label, pips = RARITY[face['rarity']]
    pdf.setStrokeColor(HexColor('#a8afb3')); pdf.setLineWidth(.35)
    pdf.rect(x, y, width, height)
    pdf.setFillColor(color); pdf.rect(x, y + height - 5 * mm, width, 5 * mm, stroke=0, fill=1)
    pdf.setFillColor(white); pdf.setFont('Strong', 6)
    pdf.drawString(x + 4 * mm, y + height - 3.4 * mm, 'BOZZA PROVVISORIA')
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
        imm = ', '.join(f'[[{LETTER_OF[i]}]] {i}' for i in face['immunities']) if face['immunities'] else 'nessuna'
        for line in (f'Capacità oggetti: {face["items"]}', f'Immunità iniziale: {imm}', f'Base: {face["basic"]}', f'Legate (se ne scelgono 2): {"; ".join(face["bound_names"])}'):
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
            used = min(used, text_block(pdf, face['damage_amount'], dx + 2.6 * mm, top - .2 * mm, x + width - 4 * mm - dx - 2.6 * mm, bottom, 7.5, where, True))
        top = min(used, top - 5.2 * mm)
        pdf.setStrokeColor(color); pdf.setLineWidth(.35); pdf.line(x + 4 * mm, top - 1 * mm, x + width - 4 * mm, top - 1 * mm)
        top = text_block(pdf, face['text'], x + 4 * mm, top - 2.5 * mm, inner, bottom, 9, where)
    # Footer: slot and binding id (small, as the live mode), then the provisional mark with the version of the draft.
    pdf.setFillColor(INK); pdf.setFont('Body', 6)
    ident = (face['slot'] + ' · ' if face['slot'] else '') + face['id']
    check_glyphs(ident + stamp, 'Body')
    if pdfmetrics.stringWidth(ident, 'Body', 6) > inner or pdfmetrics.stringWidth(stamp, 'Body', 6) + pdfmetrics.stringWidth(f'{number}/{total}', 'Body', 6) + 3 > inner:
        raise Overflow(f'{where}: piè di carta non contenuto a 6 pt')
    pdf.drawString(x + 4 * mm, y + 6.4 * mm, ident)
    pdf.drawString(x + 4 * mm, y + 3 * mm, stamp)
    pdf.drawRightString(x + width - 4 * mm, y + 3 * mm, f'{number}/{total}')
    crop_marks(pdf, x, y, width, height)


# --------------------------------------------------------------------------------------------------------------- guide
class Guide:
    """Reference pages after the fronts: paragraphs move to a new page, never shrink."""

    def __init__(self, pdf, first_page, stamp):
        self.pdf, self.count, self.top, self.stamp, self.first = pdf, first_page, 0, stamp, first_page
        self.pw, self.ph = A4

    def page(self):
        if self.top:
            self.pdf.showPage()
        self.count += 1
        self.pdf.setFillColor(INK); self.pdf.setFont('Body', 7)
        self.pdf.drawString(16 * mm, 10 * mm, f'{self.stamp} | A4, dimensioni effettive 100% | Guida {self.count - self.first}')
        self.top = self.ph - 18 * mm
        self.block('BOZZA DEL SET BASE / GUIDA AL TAVOLO', 15, True)

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


def build_guide(pdf, bz, face_by_id, shown_decks, first_page, selected, args_copies, stamp):
    g = Guide(pdf, first_page, stamp)
    g.page()
    g.block('Bozza provvisoria, non normativa', 12, True)
    g.block(f'Questa stampa è la bozza del {bz["set_name"]} (versione «{bz["set_version"]}») con le regole del playground {bz["rules"]}, dal file bozza.json (SHA-256 {bz["raw_sha256"][:12]}…; l’impronta intera è nel manifest). '
            'Cambia a ogni revisione della bozza: confronta l’impronta sul piè di ogni carta prima di mescolare stampe diverse.')
    g.block('Le regole per giocare sono in docs/design/set-base/regole-playground.md (profilo d50). Questa guida non le riproduce: leggile da lì. Le fonti normative restano il regolamento (docs/game-rules.md) e la scheda del set (docs/sets/base.md).')
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
    g.block('Tipi di danno (accanto all’ammontare nominale; HIT = impatto, CUT = taglio, POISON = veleno; «x» è spiegata dal testo della carta):', 9, True)
    for dmg in DAMAGES:
        g.row(dmg, dmg)
    g.block('Lettura della carta', 12, True)
    g.block('In alto: tipo di carta e rarità (1, 2 o 3 pallini = comune, non comune, rara). Sotto il nome: costo, priorità e bersaglio, poi il ruolo e l’eventuale danno nominale. «Bersaglio: come da testo» indica una carta il cui bersaglio è nel testo. Il codice sotto il testo è lo slot della bozza e l’identificatore della carta.')
    for tag, text in (('Personaggio', 'Personaggio: blu, esagono.'), ('Regolare', 'Azione regolare: terracotta, triangolo.'), ('Base', 'Base: petrolio, cerchio.'),
                      ('Legata al personaggio', 'Legata al personaggio: viola, rombo.'), ('Ultima risorsa', 'Ultima risorsa: ocra, triangolo.'), ('Oggetto', 'Oggetto: verde, quadrato.')):
        g.badge(tag, text)
    g.block('Composizione dei mazzi' + (' stampati' if selected else ' di partenza'), 12, True)
    g.block(f'Mazzo = personaggio, la sua base, due legate, una ultima risorsa e {bz["limits"]["deck_size"]} carte (al più {bz["limits"]["max_copies"]} copie ciascuna): {5 + bz["limits"]["deck_size"]} fronti. '
            + (f'Selezione di stampa: {"; ".join(f"{n * args_copies} × {d}" for d, n in Counter(x["id"] for x in selected).items())}. Le copie condivise fra mazzi sono sommate: per dividerli segui le composizioni qui sotto.' if selected
               else 'Una copia per carta non è un mazzo: per stampare mazzi completi usa --starter o --all-starters.'))
    for deck in shown_decks:
        name = lambda i: face_by_id[i]['name']
        g.block(f'{deck["id"]} — {name(deck["character"])}', 10, True, gap=1)
        g.block(f'Personaggio e carte fisse: {name(deck["character"])}; base: {name(deck["basic"])}; legate: {"; ".join(name(b) for b in deck["bound"])}; ultima risorsa: {name(deck["last"])}', 9, indent=3 * mm, gap=1)
        nb = ' '  # "2 x name" stays on one line
        g.block('Mazzo: ' + '; '.join(f'{n}{nb}×{nb}' + name(c).replace(' ', nb) for c, n in deck['cards'].items()) + '.', 9, indent=3 * mm)
    return g.count


# ------------------------------------------------------------------------------------------------------------------ run
def run(args, parser):
    path = args.bozza
    bz = load_bozza(path)
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
    overrides = json.loads(args.copies_file.read_text(encoding='utf-8')) if args.copies_file else {}
    if not isinstance(overrides, dict) or set(overrides) - set(by_id):
        raise ValueError('copies-file deve essere un oggetto con identificatori della bozza')
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
    stamp = f'BOZZA · {bz["set_label"]} · {bz["rules"]} · {sha12}'
    total = len(faces)
    # Every card is laid out once on a scratch page before anything is published: all the overflows are reported together.
    problems = []
    scratch = canvas.Canvas(BytesIO(), pagesize=A4)
    for f in faces:
        if quantities[f['id']]:
            try:
                draw_face(scratch, f, 0, 0, width, height, faces.index(f) + 1, total, stamp)
            except ValueError as error:
                problems.append((f, str(error)))
    if problems:
        lines = [f'{len(problems)} carte non entrano nel formato {args.width_mm:g} x {args.height_mm:g} mm (nessun testo viene troncato o ridotto):']
        lines += [f'  {f["id"]} | testo {len(f["text"])} caratteri | {msg}' for f, msg in problems]
        raise ValueError('\n'.join(lines))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix('.partial.pdf')
    pdf = canvas.Canvas(str(temporary), pagesize=A4, invariant=1)
    pdf.setTitle(f'Botte Micidiali | bozza {bz["set_label"]} | regole {bz["rules"]} | {sha12}')
    pdf.setAuthor('Botte Micidiali - generatore catalogo (bozza)')
    per_sheet = cols * rows
    sheet_count = math.ceil(len(instances) / per_sheet)
    left = (pw - cols * width - (cols - 1) * gap) / 2
    upper = (ph + rows * height + (rows - 1) * gap) / 2
    positions = []
    for i, f in enumerate(instances):
        slot = i % per_sheet
        x = left + (slot % cols) * (width + gap)
        y = upper - (slot // cols) * (height + gap) - height
        draw_face(pdf, f, x, y, width, height, faces.index(f) + 1, total, stamp)
        positions.append(dict(id=f['id'], page=i // per_sheet + 1, rect_mm=[v / mm for v in (x, y, width, height)]))
        if slot == per_sheet - 1 or i == len(instances) - 1:
            pdf.setFillColor(INK); pdf.setFont('Body', 6)
            pdf.drawCentredString(pw / 2, 4 * mm, f'BOTTE MICIDIALI / BOZZA / {args.width_mm:g} x {args.height_mm:g} mm / A4 - 100% / foglio {i // per_sheet + 1}/{sheet_count}')
            pdf.showPage()
    by_deck = bool(args.all_starters or args.starter)
    shown = {d['id'] for d in (selected if by_deck else pool)}
    page_count = build_guide(pdf, bz, by_id, [d for d in decks if d['id'] in shown], sheet_count, selected if by_deck else [], args.copies, stamp)
    pdf.save()
    temporary.replace(args.output)
    manifest = dict(mode='bozza', set=bz['set_label'], rules_profile=bz['rules'], bozza=dict(path=str(path.relative_to(ROOT) if path.is_relative_to(ROOT) else path), sha256=bz['raw_sha256'], sha256_short=sha12),
                    catalog_count=len(faces), printed_count=len(instances),
                    selection=dict(mode='decks' if by_deck else 'catalog', decks=[d['id'] for d in selected] if by_deck else [],
                                   all_decks=bool(args.all_decks), multiplier=args.copies, overrides=overrides),
                    card_pages=sheet_count, total_pages=page_count, grid=[cols, rows], trim_mm=[args.width_mm, args.height_mm], minimum_body_pt=9,
                    inventory=[dict(id=f['id'], name=f['name'], tag=f['tag'], rarity=f['rarity'], copies=quantities[f['id']]) for f in faces],
                    placements=positions)
    args.output.with_suffix('.manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{args.output}: bozza {bz["set_label"]} ({bz["rules"]}, {sha12}), {len(faces)} voci, {len(instances)} fronti, {sheet_count} fogli carte, {page_count} pagine totali; griglia {cols}x{rows}.')

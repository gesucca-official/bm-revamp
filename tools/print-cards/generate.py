"""Print the current SQLite catalog, with authoritative R07 data. Python + ReportLab."""
from pathlib import Path
import argparse
import hashlib
import json
import math
import re
import sqlite3
from contextlib import closing
from collections import Counter
from xml.sax.saxutils import escape

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[2]
INK = HexColor('#202e38')
COLORS = {'Personaggio': '#344d70', 'Regolare': '#b65332', 'Base': '#257a84',
          'Legata al personaggio': '#77528f', 'Ultima risorsa': '#9b6b19',
          'Oggetto': '#47744c', 'Token': '#59725b'}
RESOURCE = [('H', 'HEALTH'), ('A', 'ALERTNESS'), ('V', 'VIOLENCE'), ('T', 'TOXICITY'), ('L', 'ALCOHOL')]


def load_catalog(database, rules_path, annex_path):
    rules = rules_path.read_text(encoding='utf-8-sig')
    version = re.search(r'Versione \*\*(.*?) —', rules).group(1)
    annex = json.loads(annex_path.read_text(encoding='utf-8'))
    if annex['version'] != version:
        raise ValueError('Versione allegato diversa dal regolamento')
    section = rules.split('## R07', 1)[1].split('## R08', 1)[0]
    rows = {}
    for line in section.splitlines():
        if line.startswith('| '):
            fields = [x.strip() for x in line.strip('|').split('|')]
            rows[fields[0]] = fields
    with closing(sqlite3.connect(database.resolve().as_uri() + '?mode=ro', uri=True)) as db:
        if db.execute('pragma integrity_check').fetchone()[0] != 'ok':
            raise ValueError('Catalogo SQLite non integro')
        if db.execute('pragma foreign_key_check').fetchall():
            raise ValueError('Catalogo SQLite con riferimenti non validi')
        cards = [dict(id=r[0], name=r[1].strip(), description=r[2], character=False)
                 for r in db.execute('select C_REF_CLASS,T_GUI_NAME,T_GUI_DESCRIPTION from CRD001_GUI order by C_REF_CLASS')]
        cards += [dict(id=r[0], name=r[1].strip(), character=True)
                  for r in db.execute('select C_REF_CLASS,T_GUI_NAME from CRD003_CHARACTERS order by C_REF_CLASS')]
        starters = list(db.execute('select * from DCK001_STARTERS order by 1,2'))
        initial = list(db.execute('select * from DCK002_STARTERS_CH order by 1'))
    # Tokens are not stored in SQLite. Discover them from the maintained annex.
    cards += [dict(id=t['class'], name=t['name'], character=False, token=True) for t in annex['tokens']]
    if len({c['id'] for c in cards}) != len(cards):
        raise ValueError('Identificatori duplicati fra catalogo e token')
    expected = {c['class']: c for key in ('cards', 'characters', 'tokens') for c in annex[key]}
    if set(expected) != {c['id'] for c in cards}:
        raise ValueError('Inventario database/allegato diverso: aggiornare le fonti normative')
    if {k for k, r in rows.items() if r[1] in ('Azione', 'Oggetto', 'Personaggio')} != {c['id'].split('.')[-1] for c in cards}:
        raise ValueError('Inventario R07 diverso da database e token')
    for card in cards:
        key = card['id'].split('.')[-1]
        if key not in rows:
            raise ValueError(f'{key}: scheda R07 mancante; nessun effetto verrà inventato')
        row = rows[key]
        card.update(key=key, type=row[1], subtype='')
        if card['name'] != expected[card['id']]['name'].strip():
            raise ValueError(f'{key}: nome database/allegato non allineato')
        if card['character']:
            if len(row) != 8 or row[2] != card['name']:
                raise ValueError(f'{key}: scheda personaggio R07 non valida')
            card['effect'] = '<br/>'.join(escape(f'{label}: {value}') for label, value in zip(
                ['H / HEALTH', 'A / ALERTNESS', 'Risorsa speciale', 'Capacità oggetti', 'Immunità iniziale'], row[3:]))
        else:
            card['subtype'] = row[2] if row[2] != '—' else ''
            if [row[1], row[2]] != [expected[card['id']]['type'], expected[card['id']]['subtype']]:
                raise ValueError(f'{key}: tipologia non allineata')
            card['effect'] = escape(row[-1])
            if 'description' in card and card['description'] != row[-1] + f'. Riferimento: Regolamento {version}, R02-R07.':
                raise ValueError(f'{key}: descrizione SQLite diversa da R07')
            if card['type'] == 'Azione':
                if len(row) != 7:
                    raise ValueError(f'{key}: formato azione R07 inatteso')
                card.update(cost=row[3], priority=row[4], target=row[5])
        # R07 explicitly delegates these details to R05; copy from the source.
        if key == 'MadeOfStone':
            card['effect'] += '<br/>' + escape(re.search(r'MadeOfStone parte sempre da durata \d+\.', rules).group())
        if key == 'BrokenBeerBottle':
            card['effect'] += '<br/>' + escape(re.search(r'SingleUse imposta durata zero.*?stesso turno\.', rules).group())
    # No fixed inventory count: additions are discovered at each run.
    return cards, rules, version, starters, initial


def fonts(directory):
    candidates = [directory] if directory else [Path('C:/Windows/Fonts'), Path('/usr/share/fonts/truetype/dejavu')]
    for d in candidates:
        for regular, bold in [('arial.ttf', 'arialbd.ttf'), ('DejaVuSans.ttf', 'DejaVuSans-Bold.ttf')]:
            if (d / regular).is_file() and (d / bold).is_file():
                pdfmetrics.registerFont(TTFont('Body', str(d / regular)))
                pdfmetrics.registerFont(TTFont('Strong', str(d / bold)))
                return
    raise ValueError('Font mancanti: usare --font-dir con Arial o DejaVu Sans (normale e grassetto)')


def starter_decks(cards, regular_rows, initial_rows):
    """Discover every starter owner; never encode character names or deck sizes."""
    by_id = {c['id']: c for c in cards}
    decks = {}
    for owner, *slots in initial_rows:
        if owner not in by_id or not by_id[owner]['character']:
            raise ValueError(f'Starter: personaggio non valido {owner}')
        if owner in decks or any(slot not in by_id for slot in slots):
            raise ValueError(f'Starter: carte iniziali mancanti o duplicate per {owner}')
        if len(slots) < 2 or by_id[slots[0]]['subtype'] != 'Base' or by_id[slots[-1]]['subtype'] != 'Ultima risorsa' or any(by_id[s]['subtype'] != 'Legata al personaggio' for s in slots[1:-1]):
            raise ValueError(f'Starter: sottotipi delle carte iniziali non validi per {owner}')
        decks[owner] = Counter([owner, *slots])
    regular_owners = set()
    for owner, card, quantity in regular_rows:
        if owner not in decks or card not in by_id:
            raise ValueError(f'Starter: riferimento non valido {owner} / {card}')
        entry = by_id[card]
        if entry['type'] not in ('Azione', 'Oggetto') or entry.get('token') or (entry['type']=='Azione' and entry['subtype']!='Regolare'):
            raise ValueError(f'Starter: carta non regolare nel mazzo {card}')
        if type(quantity) is not int or quantity <= 0:
            raise ValueError(f'Starter: quantità non valida per {owner} / {card}')
        decks[owner][card] += quantity
        regular_owners.add(owner)
    if set(decks) != regular_owners:
        raise ValueError('Starter: mazzo regolare o carte iniziali mancanti')
    return decks


def select_starters(requests, decks, cards):
    by_id = {c['id']: c for c in cards}
    selected = []
    for request in requests:
        matches = [owner for owner in decks if request.casefold() in
                   (owner.casefold(), owner.split('.')[-1].casefold(), by_id[owner]['name'].casefold())]
        if len(matches) != 1:
            raise ValueError(f'Starter sconosciuto o ambiguo: {request}. Usa --list-starters e l’identificatore completo.')
        selected.append(matches[0])
    return selected


def para(pdf, text, x, top, width, bottom, size=9, bold=False, color=INK):
    style = ParagraphStyle('text', fontName='Strong' if bold else 'Body', fontSize=size,
                           leading=size * 1.28, textColor=color, splitLongWords=False)
    p = Paragraph(text, style)
    w, h = p.wrap(width, 10000)
    if top - h < bottom or w > width + .01:
        raise ValueError(f'Testo non contenuto a {size} pt: {text[:100]}. Aumentare la carta; nessuna riduzione automatica.')
    # Paragraph may silently allow an unbreakable identifier wider than its frame.
    for word in re.sub('<[^>]*>', ' ', text).split():
        if pdfmetrics.stringWidth(word, style.fontName, size) > width:
            raise ValueError(f'Parola troppo larga: {word}')
    p.drawOn(pdf, x, top - h)
    return top - h


def symbol(pdf, x, y, size, kind, label=None):
    """Vector badges: diamond, square, circle, triangle and hexagon."""
    pdf.setLineWidth(.8)
    sides = {'H': 4, 'A': 3, 'V': 4, 'T': 6, 'L': 0,
             'Personaggio': 6, 'Base': 0, 'Legata al personaggio': 4,
             'Ultima risorsa': 3, 'Oggetto': 4, 'Token': 6}.get(kind, 3)
    if not sides:
        pdf.circle(x, y, size / 2, fill=0)
    else:
        path = pdf.beginPath()
        offset = math.pi/4 if kind in ('V', 'Oggetto') else math.pi/2
        for i in range(sides):
            a = offset + i * 2 * math.pi / sides
            px, py = x + size/2 * math.cos(a), y + size/2 * math.sin(a)
            (path.moveTo if i == 0 else path.lineTo)(px, py)
        path.close()
        pdf.drawPath(path)
    if label:
        pdf.setFont('Strong', size * .48)
        pdf.drawCentredString(x, y - size * .17, label)


def draw_card(pdf, card, x, y, width, height, number, version):
    tag = card['subtype'] or card['type']
    color = HexColor(COLORS.get(tag, COLORS.get(card['type'], '#475965')))
    pdf.setStrokeColor(HexColor('#a8afb3')); pdf.setLineWidth(.35)
    pdf.rect(x, y, width, height)
    pdf.setFillColor(color); pdf.rect(x, y + height - 5*mm, width, 5*mm, stroke=0, fill=1)
    pdf.setFillColor(INK); pdf.setStrokeColor(color)
    symbol(pdf, x+6*mm, y+height-11*mm, 6*mm, tag)
    label = card['type'] + (' / ' + card['subtype'] if card['subtype'] else '')
    top = para(pdf, escape(label.upper()), x+11*mm, y+height-8*mm, width-15*mm, y, 7, True, color)
    top = para(pdf, escape(card['name']), x+4*mm, min(top-4*mm, y+height-20*mm), width-8*mm, y+height-39*mm, 10.5, True)
    top -= 3*mm
    if card['type'] == 'Azione':
        top = para(pdf, escape(f"Costo: {card['cost']}   |   Priorità: {card['priority']}"), x+4*mm, top, width-8*mm, y+15*mm, 8.5, True)
        top = para(pdf, escape('Bersaglio: ' + card['target']), x+4*mm, top-1.5*mm, width-8*mm, y+15*mm, 8.5)
    else:
        top = para(pdf, 'VALORI INIZIALI' if card['character'] else 'EFFETTO DEL CONSUMO', x+4*mm, top, width-8*mm, y+15*mm, 8, True, color)
    pdf.setStrokeColor(color); pdf.line(x+4*mm, top-2*mm, x+width-4*mm, top-2*mm)
    top = para(pdf, card['effect'], x+4*mm, top-4*mm, width-8*mm, y+17*mm, 9)
    reminder = {'Regolare': 'Dopo l’uso: scarta.', 'Base': 'Resta in mano. Nessuno scarto aggiuntivo.',
                'Legata al personaggio': 'Resta in mano. Scarta un’altra azione regolare (R02).',
                'Ultima risorsa': 'Dopo l’uso: scarta. Entra a mazzo vuoto.'}.get(card['subtype'],
                'Alla pesca: sul campo e pesca ancora. Consuma con Grab o derivate.' if card['type']=='Oggetto' and not card.get('token') else
                'Creato da un effetto; sul campo conta nella capacità oggetti.' if card.get('token') else 'Fuori dal mazzo e dalla mano.')
    para(pdf, escape(reminder), x+4*mm, y+15*mm, width-8*mm, y+5*mm, 7)
    pdf.setFont('Body', 6); pdf.setFillColor(INK)
    pdf.drawString(x+4*mm, y+3*mm, f'{number:02d}  {card["key"]}')
    pdf.drawRightString(x+width-4*mm, y+3*mm, 'R ' + version)
    # Marks are outside the trim and do not enter the card faces.
    pdf.setStrokeColor(HexColor('#636c71')); pdf.setLineWidth(.3)
    for cx in (x, x+width):
        for cy in (y, y+height):
            dx = -1 if cx == x else 1
            dy = -1 if cy == y else 1
            pdf.line(cx+dx*.5*mm, cy, cx+dx*1.5*mm, cy)
            pdf.line(cx, cy+dy*.5*mm, cx, cy+dy*1.5*mm)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--database', type=Path, default=ROOT/'server/src/main/resources/cards.sqlite')
    parser.add_argument('--rules', type=Path, default=ROOT/'docs/game-rules.md')
    parser.add_argument('--annex', type=Path, default=ROOT/'docs/rules-catalog.json')
    parser.add_argument('--output', type=Path, default=ROOT/'output/pdf/botte-micidiali-carte.pdf')
    parser.add_argument('--width-mm', type=float, default=62)
    parser.add_argument('--height-mm', type=float, default=87)
    parser.add_argument('--margin-mm', type=float, default=9)
    parser.add_argument('--gap-mm', type=float, default=3)
    parser.add_argument('--copies', type=int, default=1, help='Copie per carta, oppure moltiplicatore dei mazzi in modalità starter')
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument('--starter', action='append', default=[], help='ID completo, classe breve o nome personaggio; ripetibile')
    selection.add_argument('--all-starters', action='store_true', help='Stampa tutti gli starter presenti nel database')
    parser.add_argument('--list-starters', action='store_true', help='Elenca gli starter disponibili senza generare PDF')
    parser.add_argument('--copies-file', type=Path, help='JSON: identificatore completo -> numero di copie (anche 0)')
    parser.add_argument('--font-dir', type=Path)
    args = parser.parse_args()
    if not all(math.isfinite(v) for v in (args.width_mm, args.height_mm, args.margin_mm, args.gap_mm)):
        parser.error('Dimensioni non finite')
    if min(args.width_mm, args.height_mm) <= 0 or args.margin_mm < 5 or args.gap_mm < 3 or args.copies < 0:
        parser.error('Dimensioni positive; margini >=5 mm; spazio >=3 mm; copie >=0')
    cards, rules, version, starters, initial = load_catalog(args.database, args.rules, args.annex)
    decks = starter_decks(cards, starters, initial)
    by_id = {c['id']: c for c in cards}
    if args.list_starters:
        for owner, quantities in decks.items():
            print(f'{owner} | {by_id[owner]["name"]} | {sum(quantities.values())} fronti (personaggio incluso)')
        return
    selected = list(decks) if args.all_starters else select_starters(args.starter, decks, cards)
    quantities = Counter()
    if args.all_starters or args.starter:
        for owner in selected:
            for card, n in decks[owner].items():
                quantities[card] += n * args.copies
    else:
        quantities.update({c['id']: args.copies for c in cards})
    fonts(args.font_dir)
    overrides = json.loads(args.copies_file.read_text(encoding='utf-8')) if args.copies_file else {}
    if not isinstance(overrides, dict) or set(overrides) - set(by_id):
        raise ValueError('copies-file deve essere un oggetto con identificatori del catalogo')
    if any(type(n) is not int or n < 0 for n in overrides.values()):
        raise ValueError('Le copie devono essere interi non negativi')
    # Overrides are absolute, also for tokens added to starter prints.
    for card, n in overrides.items():
        quantities[card] = n
    width, height, margin, gap = [v*mm for v in (args.width_mm, args.height_mm, args.margin_mm, args.gap_mm)]
    pw, ph = A4
    cols = math.floor((pw-2*margin+gap)/(width+gap))
    rows = math.floor((ph-2*margin+gap)/(height+gap))
    if cols < 1 or rows < 1:
        parser.error('Nessuna carta entra nel foglio A4 con queste dimensioni')
    instances = [c for c in cards for _ in range(quantities[c['id']])]
    if not instances:
        parser.error('Nessuna copia da stampare')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    # Publish only after every layout check has passed.
    temporary = args.output.with_suffix('.partial.pdf')
    pdf = canvas.Canvas(str(temporary), pagesize=A4, invariant=1)
    pdf.setTitle('Botte Micidiali | carte per il tavolo | regolamento ' + version)
    pdf.setAuthor('Botte Micidiali - generatore catalogo')
    positions = []
    sheet_count = math.ceil(len(instances)/(cols*rows))
    left = (pw-cols*width-(cols-1)*gap)/2
    upper = (ph+rows*height+(rows-1)*gap)/2
    for i, card in enumerate(instances):
        slot = i % (cols*rows)
        x = left + (slot % cols)*(width+gap)
        y = upper - (slot//cols)*(height+gap) - height
        draw_card(pdf, card, x, y, width, height, cards.index(card)+1, version)
        positions.append(dict(id=card['id'], page=i//(cols*rows)+1, rect_mm=[v/mm for v in (x,y,width,height)]))
        if slot == cols*rows-1 or i == len(instances)-1:
            pdf.setFillColor(INK); pdf.setFont('Body', 6)
            pdf.drawCentredString(pw/2, 4*mm, f'BOTTE MICIDIALI  /  {args.width_mm:g} x {args.height_mm:g} mm  /  A4 - 100%  /  foglio {i//(cols*rows)+1}/{sheet_count}')
            pdf.showPage()
    page_count = sheet_count
    top = 0

    def new_reference():
        nonlocal page_count, top
        if top:
            pdf.showPage()
        page_count += 1
        top = ph-18*mm
        para(pdf, 'BOTTE MICIDIALI / GUIDA AL TAVOLO', 16*mm, top, pw-32*mm, 0, 15, True)
        top -= 10*mm
        pdf.setFont('Body', 7)
        pdf.drawString(16*mm, 10*mm, f'Regolamento {version} | A4, dimensioni effettive 100% | Guida {page_count-sheet_count}')

    def block(text, size=9, bold=False):
        nonlocal top
        # Reference paragraphs can move to a new page, never shrink.
        style = ParagraphStyle('measure', fontName='Strong' if bold else 'Body', fontSize=size, leading=size*1.28)
        _, h = Paragraph(text, style).wrap(pw-32*mm, 10000)
        if top-h < (35 if bold else 20)*mm:
            new_reference()
        top = para(pdf, text, 16*mm, top, pw-32*mm, 20*mm, size, bold)-3*mm

    new_reference()
    block('Legenda e stampa', 12, True)
    block('Solo fronti. Taglia sui segni esterni, poi inserisci ogni stampa davanti alla carta di supporto nella sleeve. A4 a colori, dimensioni effettive / 100%, senza adattamento. Misura un rettangolo prima di tagliare: deve corrispondere alle dimensioni indicate a fondo foglio.')
    for letter, name in RESOURCE:
        pdf.setStrokeColor(INK); pdf.setFillColor(INK)
        symbol(pdf, 20*mm, top-2*mm, 6*mm, letter, letter)
        para(pdf, name + ' (' + letter + ')', 27*mm, top, pw-45*mm, 20*mm, 9)
        top -= 9*mm
    block('HIT = impatto; CUT = taglio; POISON = veleno. I nomi inglesi identificano i tipi di danno. GOOD/BAD = stato favorevole/sfavorevole; OUTPUT/INPUT = danni inflitti/ricevuti. t = risorsa al momento dell’effetto, dopo i costi; abs = valore assoluto.')
    block(escape(rules.split('## R01 —', 1)[1].split('\n\n', 2)[1]))
    resource_prose = next(p for p in rules.split('\n\n') if p.startswith('HEALTH è'))
    block(escape(resource_prose))
    block('Colori e forme', 12, True)
    block('Personaggio: blu, esagono. Azione regolare: terracotta, triangolo. Base: petrolio, cerchio. Legata: viola, rombo. Ultima risorsa: ocra, triangolo. Oggetto: verde, quadrato. Token: verde, esagono. Le etichette restano sempre esplicite.')
    block('Controllo scala: il segmento sottostante deve misurare 50 mm.')
    pdf.setStrokeColor(INK); pdf.line(16*mm, top, 66*mm, top)
    for x in (16*mm,66*mm): pdf.line(x, top-2*mm, x, top+2*mm)
    top -= 9*mm
    block('Starter dal database', 12, True)
    if selected:
        block('Selezione di stampa: ' + '; '.join(escape(f'{n * args.copies} × {by_id[ch]["name"]}') for ch,n in Counter(selected).items()) + '. Le quantità condivise sono sommate; eventuali modifiche JSON sono applicate dopo il conteggio.')
    for ch, *slots in initial:
        if selected and ch not in selected:
            continue
        block(escape(by_id[ch]['name']) + ': predisponi ' + ', '.join(escape(by_id[s]['name']) for s in slots) + '.')
        block('Mazzo regolare: ' + '; '.join(escape(f'{n} × {by_id[c]["name"]}') for owner,c,n in starters if owner==ch) + '.')
    block('I fronti degli starter includono personaggi, carte iniziali e last resort. I token generati durante il gioco non sono nel mazzo: aggiungi le copie necessarie con --copies-file. Stati e risorse richiedono segnalini aggiuntivi.' if selected else 'Una copia per carta è un inventario dimostrativo, non starter completi. Usa --starter oppure --all-starters per comporre i mazzi. Token, stati e risorse possono richiedere copie o segnalini aggiuntivi.')
    # Copy normative prose, not a second manually maintained rules summary.
    excerpt = rules.split('## R02',1)[1].split('## R07',1)[0]
    excerpt = '## R02' + excerpt
    new_reference()
    for raw in excerpt.split('\n\n'):
        raw = raw.strip()
        if not raw: continue
        heading = raw.startswith('#')
        text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', escape(raw.lstrip('# ').replace('\n','<br/>')))
        # Escape before inserting HTML line breaks.
        text = text.replace('&lt;br/&gt;', '<br/>')
        block(text, 11 if heading else 9, heading)
    pdf.save()
    temporary.replace(args.output)
    manifest = dict(rules_version=version, catalog_count=len(cards), printed_count=len(instances),
                    selection=dict(mode='starters' if selected else 'catalog', starters=selected,
                                   multiplier=args.copies, overrides=overrides),
                    card_pages=sheet_count, total_pages=page_count, grid=[cols,rows],
                    trim_mm=[args.width_mm,args.height_mm], minimum_body_pt=9,
                    sources={str(p.relative_to(ROOT) if p.is_relative_to(ROOT) else p): hashlib.sha256(p.read_bytes()).hexdigest()
                             for p in (args.database,args.rules,args.annex)},
                    inventory=[dict(id=c['id'],name=c['name'],type=c['type'],subtype=c['subtype'],copies=quantities[c['id']]) for c in cards],
                    placements=positions)
    args.output.with_suffix('.manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'{args.output}: {len(cards)} voci, {len(instances)} fronti, {sheet_count} fogli carte, {page_count} pagine totali; griglia {cols}x{rows}.')


if __name__ == '__main__':
    main()

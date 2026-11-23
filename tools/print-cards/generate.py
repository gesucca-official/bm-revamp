"""Print the live set (regulation 2.0, Set Base 1.0) from its set file, or a draft with --bozza. Python + ReportLab.

SB-28: the live set is the set file packaged with the server (server/src/main/resources/sets/base.json), the same the game reads;
the printer of the drafts (bozza.py) prints it, without the provisional mark. The printer of the Set Base 0.1, which read the SQLite
catalog and the set document, left with that set. This module keeps the arguments and the drawing helpers shared with bozza.py.
"""
from pathlib import Path
import argparse
import math

from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[2]
INK = HexColor('#202e38')
COLORS = {'Personaggio': '#344d70', 'Regolare': '#b65332', 'Base': '#257a84',
          'Legata al personaggio': '#77528f', 'Ultima risorsa': '#9b6b19',
          'Oggetto': '#47744c', 'Token': '#59725b'}
DEFAULT_BOZZA = ROOT/'server/src/test/resources/set-base/bozza.json'
LIVE_SET = ROOT/'server/src/main/resources/sets/base.json'  # SB-28: the set file of the live game


def fonts(directory):
    candidates = [directory] if directory else [Path('C:/Windows/Fonts'), Path('/usr/share/fonts/truetype/dejavu')]
    for d in candidates:
        for regular, bold in [('arial.ttf', 'arialbd.ttf'), ('DejaVuSans.ttf', 'DejaVuSans-Bold.ttf')]:
            if (d / regular).is_file() and (d / bold).is_file():
                pdfmetrics.registerFont(TTFont('Body', str(d / regular)))
                pdfmetrics.registerFont(TTFont('Strong', str(d / bold)))
                return
    raise ValueError('Font mancanti: usare --font-dir con Arial o DejaVu Sans (normale e grassetto)')


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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='Destinazione; predefinita output/pdf/botte-micidiali-carte.pdf, o botte-micidiali-starter.pdf per i mazzi '
                                                     '(con --bozza: bozza-set-base.pdf, o bozza-starter.pdf)')
    parser.add_argument('--width-mm', type=float, default=62)
    parser.add_argument('--height-mm', type=float, default=87)
    parser.add_argument('--margin-mm', type=float, default=9)
    parser.add_argument('--gap-mm', type=float, default=3)
    parser.add_argument('--copies', type=int, default=1, help='Copie per carta, oppure moltiplicatore dei mazzi con --starter e --all-starters')
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument('--starter', action='append', default=[], help='Identificatore del mazzo (anche senza "starter-"), nome dello starter, '
                                                                          'identificatore o nome del personaggio; ripetibile')
    selection.add_argument('--all-starters', action='store_true', help='Stampa tutti gli starter del file')
    parser.add_argument('--list-starters', action='store_true', help='Elenca i mazzi del file senza generare PDF')
    parser.add_argument('--copies-file', type=Path, help='JSON: identificatore completo -> numero di copie (anche 0)')
    parser.add_argument('--font-dir', type=Path)
    parser.add_argument('--bozza', nargs='?', type=Path, const=DEFAULT_BOZZA, default=None, metavar='PERCORSO',
                        help='Stampa una bozza (formato del file del set) invece del set vivo, marcata BOZZA PROVVISORIA; senza percorso '
                             'la bozza del repository')
    parser.add_argument('--all-decks', action='store_true', help='Con --all-starters: anche i mazzi di misura di una bozza (prova-*, iso-*), non solo gli starter-*')
    args = parser.parse_args()
    bozza_mode = args.bozza is not None
    if args.output is None:
        decks = bool(args.starter or args.all_starters)
        args.output = ROOT/'output/pdf'/(('bozza-starter.pdf' if decks else 'bozza-set-base.pdf') if bozza_mode
                                         else ('botte-micidiali-starter.pdf' if decks else 'botte-micidiali-carte.pdf'))
    if not all(math.isfinite(v) for v in (args.width_mm, args.height_mm, args.margin_mm, args.gap_mm)):
        parser.error('Dimensioni non finite')
    if min(args.width_mm, args.height_mm) <= 0 or args.margin_mm < 5 or args.gap_mm < 3 or args.copies < 0:
        parser.error('Dimensioni positive; margini >=5 mm; spazio >=3 mm; copie >=0')
    from bozza import run
    args.set_file = args.bozza if bozza_mode else LIVE_SET
    return run(args, parser)


if __name__ == '__main__':
    try:
        main()
    except ValueError as error:
        raise SystemExit(str(error))

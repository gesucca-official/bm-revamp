"""SB-25 Fase B2, prova d'ingombro sulla carta stampata (D166 (2), D168 (2)): ogni fronte della bozza disposto come lo stampa
`tools/print-cards --bozza` (62 x 87 mm, testo a 9 pt, flavour in corsivo a 7,5 pt sotto il testo), con lo spazio che resta sotto il
testo e sotto il testo col flavour. Il generatore rifiuta già un fronte che non entra; qui si registrano i margini di tutti.

Uso, dalla radice del repository (serve ReportLab):
  python -X utf8 docs/reports/set-base/sb-25/ingombro-stampa.py [USCITA]   (predefinita: accanto a questo file, ingombro-stampa.json)

Il token (Bottiglia Spaccata) non è un fronte della bozza stampata: non è misurato.
"""
from io import BytesIO
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / 'tools/print-cards'))
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.units import mm  # noqa: E402
from reportlab.pdfgen import canvas  # noqa: E402
import bozza  # noqa: E402
from generate import fonts  # noqa: E402

WIDTH, HEIGHT = 62, 87


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name('ingombro-stampa.json')
    fonts(None)
    bozza.italic_font()
    bz = bozza.load_bozza(bozza.DEFAULT_BOZZA)
    stamp = f'BOZZA · {bz["set_label"]} · {bz["rules"]} · {bz["raw_sha256"][:12]}'
    scratch = canvas.Canvas(BytesIO(), pagesize=A4)
    faces, problems = [], []
    for n, f in enumerate(bz['faces']):
        row = dict(id=f['id'], slot=f['slot'], name=f['name'], text_chars=len(f['text']), flavour_chars=len(f['flavour']))
        try:
            row.update(bozza.draw_face(scratch, f, 0, 0, WIDTH * mm, HEIGHT * mm, n + 1, len(bz['faces']), stamp))
        except ValueError as error:
            row['problem'] = str(error)
            problems.append(f['id'])
        faces.append(row)
    fitted = [r for r in faces if 'room' in r]
    result = dict(format='sb-25-ingombro-stampa/1', bozza_sha256=bz['raw_sha256'], trim_mm=[WIDTH, HEIGHT], body_pt=9, flavour_pt=bozza.FLAVOUR_PT,
                  faces=len(faces), fit=len(fitted), not_fit=problems,
                  min_room_mm=min(r['room'] for r in fitted), tightest=sorted(fitted, key=lambda r: r['room'])[:5], items=faces)
    out.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{out}: {len(faces)} fronti, {len(fitted)} entrano col flavour, {len(problems)} no; margine minimo {result["min_room_mm"]} mm '
          f'({result["tightest"][0]["name"]})')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())

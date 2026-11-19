"""Vector symbols of the client, ported for the PDF (resources, roles, types of damage).

Source of truth: client-web/src/symbols.ts (shapes in -1..1) and client-web/src/readability.ts (colours, damage shapes).
The data below is a port, not a second design: test_generator.py compares the colours and the literal shapes with the
TypeScript sources, so a change in the client that is not ported here fails the test. No glyph of a font is used.
"""
import math

from reportlab.lib.colors import HexColor

RESOURCES = ('HEALTH', 'ALERTNESS', 'VIOLENCE', 'TOXICITY', 'ALCOHOL')
RESOURCE_LETTERS = dict(zip('HAVTL', RESOURCES))
ROLES = ('DAMAGE', 'DEFENSE', 'RESOURCES', 'COUNTER', 'DISRUPT', 'ITEMS', 'OTHER')
DAMAGES = ('HIT', 'CUT', 'POISON')

# readability.ts: RES_COLOR, ROLE_COLOR, DAMAGE_COLOR, DAMAGE_ACCENT; symbols.ts: LIGHT, EDGE_INK.
RES_COLOR = dict(HEALTH=0xa3313d, ALERTNESS=0x2f8189, VIOLENCE=0xc0582c, TOXICITY=0x78962c, ALCOHOL=0xc98d1f)
ROLE_COLOR = dict(DAMAGE=0x742e33, DEFENSE=0x2c6262, RESOURCES=0x4b6a2d, COUNTER=0x343f6b, DISRUPT=0x5c3a6a, ITEMS=0x86561b, OTHER=0x5d5247)
DAMAGE_COLOR = dict(HIT=0xa3313d, CUT=0x4d6070, POISON=0x5f8a1f)
DAMAGE_ACCENT = dict(HIT=0xf2c84b, CUT=0xbfe5f6, POISON=0xb4e06a)
LIGHT = 0xf3ead2
EDGE_INK = 0x30231e
# symbols.ts edgeFor(kind, 'light'): a printed card is a light ground; the heart is never outlined there.
EDGE_ON_LIGHT = ('ALCOHOL', 'TOXICITY')
# Same ratio as the client (2 px outline on a symbol of about 26 px, 1 px of it outside the fill).
EDGE_RATIO = .08

ROLE_LABEL = dict(DAMAGE='DANNO', DEFENSE='DIFESA', RESOURCES='RISORSE', COUNTER='CONTRASTO', DISRUPT='DISTURBO', ITEMS='OGGETTI', OTHER='ALTRO')
RESOURCE_NAME_IT = dict(HEALTH='Salute', ALERTNESS='Allerta', VIOLENCE='Violenza', TOXICITY='Tossicità', ALCOHOL='Alcol')


def _star(n, k):
    return [v for i in range(2 * n) for v in (math.cos(math.pi * i / n) * (k if i % 2 else 1), math.sin(math.pi * i / n) * (k if i % 2 else 1))]


def _star16(r):
    return [v for i in range(16) for v in (math.cos(math.pi * i / 8) * (.52 if i % 2 else 1) * r, math.sin(math.pi * i / 8) * (.52 if i % 2 else 1) * r)]


def _turn(poly, deg):
    t, c, s = math.radians(deg), math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return [(poly[i - 1] * s + v * c) if i % 2 else (v * c - poly[i + 1] * s) for i, v in enumerate(poly)]


def _fill(*prims):
    return dict(prims=list(prims), fill='main')


def _poly(p):
    return ('poly', list(p))


def _circle(x, y, r):
    return ('circle', x, y, r)


def _rect(x, y, w, h):
    return ('rect', x, y, w, h)


def _rrect(x, y, w, h, r):
    return ('rrect', x, y, w, h, r)


# Layer: prims share one fill and one stroke; stroke = (tone, width as a fraction of the size, minimum in points).
LAYERS = {
    'HEALTH': [_fill(_circle(-.45, -.25, .5), _circle(.45, -.25, .5)), _fill(_poly([-.93, -.05, .93, -.05, 0, .95]))],
    'ALERTNESS': [dict(prims=[('ellipse', 0, 0, 1, .62)], fill='light', stroke=('main', .13, .6)), _fill(_circle(0, 0, .36))],
    'VIOLENCE': [_fill(_poly([.3, -1, -.65, .15, -.05, .15, -.3, 1, .7, -.2, .08, -.2]))],
    'TOXICITY': [_fill(_poly([0, -1, .6, .12, -.6, .12])), _fill(_circle(0, .32, .6))],
    'ALCOHOL': [_fill(_rrect(-.48, -.2, .96, 1.2, .22)), _fill(_rect(-.17, -1, .34, .9))],
    'DAMAGE': [_fill(_poly(_star(10, .45)))],
    'DEFENSE': [_fill(_poly([-.8, -.85, .8, -.85, .8, .05, 0, 1, -.8, .05]))],
    'RESOURCES': [_fill(_poly([0, -.95, .9, .6, -.9, .6]))],
    'COUNTER': [dict(prims=[_poly([v for i in range(8) for v in (math.cos(math.pi / 8 + math.pi * i / 4), math.sin(math.pi / 8 + math.pi * i / 4))])], stroke=('main', .14, .6)),
                _fill(_rect(-.6, -.14, 1.2, .28))],
    'DISRUPT': [_fill(_poly([0, .95, .9, -.6, -.9, -.6]))],
    'ITEMS': [dict(prims=[_rrect(-.95, -.55, 1.1, 1.4, .15)], stroke=('main', .11, .5)), _fill(_rrect(-.15, -.85, 1.1, 1.4, .15))],
    'OTHER': [_fill(_circle(-.6, 0, .24), _circle(0, 0, .24), _circle(.6, 0, .24))],
}
_DAMAGE_SHAPES = {
    'HIT': [_star16(1)],
    'CUT': [_turn(p, 45) for p in ([.02, -1, .30, -.55, .30, .12, -.26, .12, -.26, -.35, -.12, -.72], [-.42, .20, .46, .20, .46, .34, -.42, .34], [-.20, .42, .24, .42, .28, 1, -.24, 1])],
    'POISON': [[0, -1, .62, .1, .62, .45, .38, .82, 0, .95, -.38, .82, -.62, .45, -.62, .1]],
}
_DAMAGE_ACCENT_SHAPES = {
    'HIT': [_star16(.52)],
    'CUT': [_turn([.10, -.80, .19, -.60, .19, -.02, .10, -.02], 45)],
    'POISON': [[-.46, .14, -.46, .44, -.30, .68, -.20, .62, -.34, .40, -.34, .18]],
}
for _k in DAMAGES:
    LAYERS[_k] = [_fill(_poly(p)) for p in _DAMAGE_SHAPES[_k]] + [dict(prims=[_poly(p)], fill='accent') for p in _DAMAGE_ACCENT_SHAPES[_k]]

KINDS = tuple(LAYERS)


def colors(kind):
    """(main, accent or None) of a symbol, as in symbolColors()."""
    if kind in DAMAGE_COLOR:
        return DAMAGE_COLOR[kind], DAMAGE_ACCENT[kind]
    if kind in RES_COLOR:
        return RES_COLOR[kind], None
    if kind in ROLE_COLOR:
        return ROLE_COLOR[kind], None
    raise ValueError(f'Simbolo sconosciuto: {kind}')


def _path(pdf, prim, cx, cy, r):
    """Build the PDF path of a primitive; y grows downward in the client, upward in PDF."""
    path = pdf.beginPath()
    kind = prim[0]
    if kind == 'poly':
        p = prim[1]
        path.moveTo(cx + p[0] * r, cy - p[1] * r)
        for i in range(2, len(p), 2):
            path.lineTo(cx + p[i] * r, cy - p[i + 1] * r)
        path.close()
    elif kind == 'circle':
        path.circle(cx + prim[1] * r, cy - prim[2] * r, prim[3] * r)
    elif kind == 'ellipse':
        _, x, y, rx, ry = prim
        path.ellipse(cx + (x - rx) * r, cy - (y + ry) * r, 2 * rx * r, 2 * ry * r)
    elif kind == 'rect':
        _, x, y, w, h = prim
        path.rect(cx + x * r, cy - (y + h) * r, w * r, h * r)
    elif kind == 'rrect':
        _, x, y, w, h, rad = prim
        path.roundRect(cx + x * r, cy - (y + h) * r, w * r, h * r, rad * r)
    else:
        raise ValueError(f'Primitiva sconosciuta: {kind}')
    return path


def draw_symbol(pdf, kind, cx, cy, size):
    """Draw `kind` centred on (cx, cy) in a box of side `size` points, on a light ground (the paper)."""
    if kind not in LAYERS:
        raise ValueError(f'Simbolo sconosciuto: {kind}')
    main, accent = colors(kind)
    tone = dict(main=HexColor(main), light=HexColor(LIGHT))
    if accent is not None:
        tone['accent'] = HexColor(accent)
    r = size / 2
    pdf.saveState()
    pdf.setLineJoin(1)
    if kind in EDGE_ON_LIGHT:
        pdf.setStrokeColor(HexColor(EDGE_INK)); pdf.setLineWidth(size * EDGE_RATIO)
        for layer in LAYERS[kind]:
            if layer.get('fill') == 'main' and 'stroke' not in layer:
                for prim in layer['prims']:
                    pdf.drawPath(_path(pdf, prim, cx, cy, r), stroke=1, fill=0)
    for layer in LAYERS[kind]:
        fill = layer.get('fill')
        stroke = layer.get('stroke')
        for prim in layer['prims']:
            if fill:
                pdf.setFillColor(tone[fill])
            if stroke:
                pdf.setStrokeColor(tone[stroke[0]]); pdf.setLineWidth(max(stroke[2], size * stroke[1]))
            pdf.drawPath(_path(pdf, prim, cx, cy, r), stroke=1 if stroke else 0, fill=1 if fill else 0)
    pdf.restoreState()

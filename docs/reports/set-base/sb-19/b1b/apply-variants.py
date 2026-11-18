"""SB-19 Fase B1b (D131): writes in bozza.json the variants chosen by the rule of the report (§ 2).

Uso, dalla radice del repository: python docs/reports/set-base/sb-19/b1b/apply-variants.py mano=v2,coccio=v1,... [--check]

Keys: mano, coccio, elemosina, nsn, minerale, maleducazione, fiato; values: v1, v2, v3 (the levels of make-variants.py); a key not named keeps
the value of today. The file is edited as text (one line per card), the rest stays byte for byte. The «gui» description and gains of each
changed card are rewritten from its new values, in the wording of make-bozza.py.
"""
import importlib.util, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('make_variants', HERE / 'make-variants.py')
V = importlib.util.module_from_spec(spec)
spec.loader.exec_module(V)
M = V.M

MINUS, TIMES = M.MINUS, M.TIMES
BINDING = {'mano': M.MANO, 'coccio': M.COCCIO, 'elemosina': M.ELEMOSINA, 'nsn': M.NSN, 'minerale': M.MINERALE, 'maleducazione': M.MALEDUCAZIONE,
           'fiato': M.FIATO}


def n(x):
    return (str(int(x)) if float(x).is_integer() else str(x)).replace('.', ',')


def cost(c, resource, unit):
    amount = c.get('cost', {}).get(resource)
    return f'{amount} {unit}: ' if amount else ''


def redescribe(key, c):
    g = c['gui']
    if key == 'mano':
        a = c['self'][0]['amount']
        g['description'] = f'GEN-19 · {MINUS}{a} A al bersaglio; +{a} A a sé.'
        g['gains'] = f'+{a} A'
    elif key == 'coccio':
        f = c['self'][0]['factor']
        c['self'][0]['description'] = f'Hit Damage dealt x{f} and turned to Cut Damage'
        g['description'] = f'GEN-21 · {cost(c, "VIOLENCE", "V") or ""}equip, il prossimo HIT inflitto {TIMES}{n(f)} e convertito in CUT, uso singolo.'
    elif key == 'elemosina':
        g['description'] = f'GEN-04 · {cost(c, "ALERTNESS", "A")}copia vicino a te un oggetto casuale del bersaglio.'
    elif key == 'nsn':
        f = c['self'][0]['factor']
        c['self'][0]['description'] = f'Hit Damage taken: x{f}'
        g['description'] = f'GEN-11 · {cost(c, "VIOLENCE", "V")}HIT ricevuto {TIMES}{n(f)} in questo turno. +5 A a sé.'
    elif key == 'minerale':
        a = c['self'][1]['amount']
        g['description'] = f'OGG-08 · Consumato: azzera la tua L; +{a} A.'
        g['gains'] = f'+{a} A'
    elif key == 'maleducazione':
        h = c['params']['hitDamage']
        g['description'] = f'GEN-10 · {cost(c, "VIOLENCE", "V")}toglie gli equip al bersaglio; {h} HIT al bersaglio.'
        g['damageAmount'] = f'HIT {h}'
    elif key == 'fiato':
        h = c['self'][3]['amount']
        g['description'] = f'GEN-20 · +{h} HEALTH a sé; HIT e CUT ricevuti {TIMES}1,25 per 2 turni.'
        g['gains'] = f'+{h} H'


def main():
    chosen = dict(p.split('=') for p in sys.argv[1].split(',') if p)
    text = M.DRAFT.read_text(encoding='utf-8')
    draft = json.loads(text)
    for key, level in chosen.items():
        V.VARIANTS[level][key](draft)
        redescribe(key, V.card(draft, BINDING[key]))
    lines = text.split('\n')
    changed = 0
    for i, line in enumerate(lines):
        for key in chosen:
            if f'"binding": "{BINDING[key]}"' in line and line.startswith('    {'):
                old = json.loads(line.rstrip(',') )
                new = V.card(draft, BINDING[key])
                dumped = json.dumps(new, ensure_ascii=False, separators=(', ', ': '))
                # the old line must be reproducible by the same dump (the file was written by make-bozza.py)
                assert json.dumps(old, ensure_ascii=False, separators=(', ', ': ')) == line.strip().rstrip(','), key
                lines[i] = '    ' + dumped + (',' if line.rstrip().endswith(',') else '')
                changed += 1
    assert changed == len(chosen), (changed, chosen)
    if '--check' not in sys.argv:
        M.DRAFT.write_text('\n'.join(lines), encoding='utf-8', newline='\n')
    print('carte riscritte', changed)


if __name__ == '__main__':
    main()

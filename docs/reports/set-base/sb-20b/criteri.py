"""SB-20b Fase B: i cinque criteri della sez. 7 della proposta su due giri «Rif» di run.ps1 (base e nuovo). Sola lettura, nessuna partita.

Uso, dalla radice del repository:
  python docs/reports/set-base/sb-20b/criteri.py BASE_ROUND_DIR NEW_ROUND_DIR BASE_RIF_JSON NEW_RIF_JSON BOZZA_NUOVA DEST

I due JSON «Rif» sono le uscite di `analyze.py rif` (SB-19); la bozza nuova serve a sapere quali mazzi contengono le carte toccate.
Scrive DEST.json e DEST.md ed esce con 1 se un criterio con soglia (1–4) fallisce.
"""
import json
import sys
from pathlib import Path

TOCCATE = {'base.mara.TraDueParaurti', 'base.com.TartarugaSulMarciapiede', 'base.items.CascoDaLavoro', 'bruiser.SuperImpact',
           'base.cesira.LoRivendo'}
NOMI = {'starter-spazienzio': 'Spazienzio', 'starter-mara': 'Mara', 'starter-tossico': 'Celestina', 'starter-pino': 'Piera',
        'starter-gigi': 'Beppe', 'prova-sergio': 'Sergio', 'prova-duccio': 'Duccio'}
FUORI_GIA = {('starter-tossico', 'starter-tossico'), ('starter-tossico', 'prova-sergio')}
BANDA, SALTO, TOLLERANZA = (35.0, 65.0), 3.0, 1.0


def it(x): return f'{x:.2f}'.replace('.', ',')


def main(base_dir, new_dir, base_rif, new_rif, bozza, dest):
    mb = json.loads(Path(base_dir, 'matrix.json').read_text(encoding='utf-8'))
    mn = json.loads(Path(new_dir, 'matrix.json').read_text(encoding='utf-8'))
    rb = {(r['a'], r['b']): r for r in json.loads(Path(base_rif).read_text(encoding='utf-8'))['rows']}
    rn = {(r['a'], r['b']): r for r in json.loads(Path(new_rif).read_text(encoding='utf-8'))['rows']}
    d = json.loads(Path(bozza).read_text(encoding='utf-8'))
    con = {k['id']: sorted(TOCCATE & set(k['cards'])) for k in d['decks'] if k['id'] in NOMI}
    out, esito = {'mazziConCarteToccate': con}, True

    # 1. Identità sulle coppie senza carte toccate, cella per cella e riga di coppia.
    libere = [p for p in rb if not con[p[0]] and not con[p[1]]]
    diff = []
    for a, b in libere:
        cb = [c for c in mb['celle'] if (c['A'], c['B']) == (a, b)]
        cn = [c for c in mn['celle'] if (c['A'], c['B']) == (a, b)]
        pb = [c for c in mb['coppie'] if (c['A'], c['B']) == (a, b)]
        pn = [c for c in mn['coppie'] if (c['A'], c['B']) == (a, b)]
        if cb != cn or pb != pn or not cb:
            diff.append(f'{a}-{b}')
    out['c1'] = {'coppie': [f'{NOMI[a]}–{NOMI[b]}' for a, b in libere], 'celle': sum(1 for c in mn['celle'] if (c['A'], c['B']) in libere),
                 'differenze': diff, 'ok': not diff}
    esito &= not diff

    # 2–3. Banda D95 e spostamento per coppia.
    righe, c2, c3 = [], [], []
    for p in rb:
        a, b = p
        sb, sn = rb[p]['share'], rn[p]['share']
        mirror = a == b
        dentro_b = BANDA[0] <= sb <= BANDA[1]
        dentro_n = BANDA[0] <= sn <= BANDA[1]
        tocca = bool(con[a] or con[b])
        if not mirror:
            if dentro_b and not dentro_n:
                c2.append(f'{NOMI[a]}–{NOMI[b]} esce: {it(sb)} → {it(sn)}')
            if p in FUORI_GIA:
                dist = lambda s: max(BANDA[0] - s, s - BANDA[1], 0)
                if dist(sn) - dist(sb) > TOLLERANZA:
                    c2.append(f'{NOMI[a]}–{NOMI[b]} peggiora di più di 1 punto: {it(sb)} → {it(sn)}')
        if tocca and abs(sn - sb) > SALTO:
            c3.append(f'{NOMI[a]}–{NOMI[b]}: {it(sb)} → {it(sn)} ({sn - sb:+.2f})')
        righe.append({'coppia': f'{NOMI[a]}–{NOMI[b]}', 'prima': round(sb, 2), 'dopo': round(sn, 2), 'delta': round(sn - sb, 2),
                      'patteDopo': round(rn[p]['draws'], 2), 'turniDopo': round(rn[p]['turns'], 2), 'toccata': tocca})
    # Patte dello specchio di Celestina: già fuori, non deve peggiorare di più di 1 punto.
    cc = ('starter-tossico', 'starter-tossico')
    if rn[cc]['draws'] - rb[cc]['draws'] > TOLLERANZA:
        c2.append(f'patte Celestina–Celestina: {it(rb[cc]["draws"])} → {it(rn[cc]["draws"])}')
    out['c2'] = {'violazioni': c2, 'ok': not c2}
    out['c3'] = {'violazioni': c3, 'ok': not c3, 'massimo': max(abs(r['delta']) for r in righe if r['toccata'])}
    esito &= not c2 and not c3

    # 4. Patte, durata, invarianti, tetto delle bound.
    c4 = []
    for (a, b), r in rn.items():
        if r['draws'] > 10 and (a, b) != cc:
            c4.append(f'patte {NOMI[a]}–{NOMI[b]} {it(r["draws"])}%')
        if a != b and r['turns'] > 12:
            c4.append(f'turni {NOMI[a]}–{NOMI[b]} {it(r["turns"])}')
    viol = sum(mn['invarianti']['violazioni'].values())
    tetto = sum(1 for t in mn['tettoBound'] if t['viola'])
    if viol:
        c4.append(f'invarianti violati: {viol}')
    if tetto:
        c4.append(f'bound oltre il tetto: {tetto}')
    out['c4'] = {'violazioni': c4, 'invarianti': viol, 'boundOltreTetto': tetto, 'partite': mn['invarianti']['partite'], 'ok': not c4}
    esito &= not c4

    # 5. Media non-specchio per mazzo, prima e dopo.
    def media(rif, x):
        v = [r['share'] if a == x else 100 - r['share'] for (a, b), r in rif.items() if x in (a, b) and a != b]
        return sum(v) / len(v)
    out['c5'] = {NOMI[x]: {'prima': round(media(rb, x), 2), 'dopo': round(media(rn, x), 2), 'delta': round(media(rn, x) - media(rb, x), 2)}
                 for x in NOMI}
    out['coppie'] = righe
    out['ok'] = esito

    Path(dest + '.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    md = ['# SB-20b Fase B: criteri della sez. 7 su «Rif», base e bozza nuova', '',
          'Quota del primo nominato sulle decisive (soli euristici, come `analyze.py rif`); patte e turni della bozza nuova. '
          '«Toccata»: almeno uno dei due mazzi ha una delle cinque carte di D139.', '',
          '| Coppia | Prima | Dopo | Δ | Patte | Turni | Toccata |', '|---|---:|---:|---:|---:|---:|---|']
    sg = lambda x: it(x) if x < 0 else '+' + it(x)
    md += [f"| {r['coppia']} | {it(r['prima'])}% | {it(r['dopo'])}% | {sg(r['delta'])} | {it(r['patteDopo'])}% | {it(r['turniDopo'])} | "
           f"{'sì' if r['toccata'] else '—'} |" for r in righe]
    md += ['', '**Media non-specchio per mazzo (criterio 5)**', '', '| Mazzo | Prima | Dopo | Δ |', '|---|---:|---:|---:|']
    md += [f"| {k} | {it(v['prima'])}% | {it(v['dopo'])}% | {sg(v['delta'])} |"
           for k, v in out['c5'].items()]
    md += ['', '**Criteri**', '',
           f"1. Identità sulle coppie senza carte toccate ({', '.join(out['c1']['coppie'])}; {out['c1']['celle']} celle): "
           f"{'identiche' if out['c1']['ok'] else 'DIFFERENZE ' + ', '.join(diff)}.",
           f"2. Banda D95: {'nessuna coppia esce, le due già fuori non peggiorano di più di 1 punto' if not c2 else '; '.join(c2)}.",
           f"3. Spostamento ≤ 3 punti sulle coppie toccate: {'rispettato' if not c3 else '; '.join(c3)} (massimo {it(out['c3']['massimo'])}).",
           f"4. Patte, durata, invarianti: {'rispettato' if not c4 else '; '.join(c4)}; invarianti violati {viol} su {out['c4']['partite']} partite, bound oltre il tetto {tetto}.",
           '5. Riportato sopra, senza soglia.', '', f"Esito: {'tutti i criteri con soglia rispettati' if esito else 'CRITERIO FALLITO'}."]
    Path(dest + '.md').write_text('\n'.join(md) + '\n', encoding='utf-8')
    print('\n'.join(md))
    return 0 if esito else 1


if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:7]))

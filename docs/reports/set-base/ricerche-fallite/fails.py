"""Ricerche Annuncia riuscite e fallite per caricamento, sui soli euristici (D93).

Uso: python -X utf8 docs/reports/set-base/ricerche-fallite/fails.py docs/reports/set-base/sb-16h/round-20-2-observations.json.gz
Sola lettura: aggrega i contatori del banco, non lancia partite.
"""
import gzip, json, re, sys
from collections import defaultdict

NAMES = {
    'bruiser.Glare': ('PAZIENZA: FINITA', 'Impatto', 2),
    'base.bruiser.TiFaccioSpazio': ('Ti faccio spazio', 'O-Ahio', 1),
    'base.mara.Slalom': ("Slalom d'avvicinamento", 'Sgommata', 2),
    'base.mara.TiStringoLaCurva': ('Ti stringo la curva', 'Cinghiata di traverso', 1),
    'junkie.MethDrivenRage': ('Dose in preparazione', 'Tossicone Scatarrante', 2),
    'base.tossico.UnAssaggino': ('Un assaggino', "C'è del sangue nella mia droga", 1),
    'base.pino.OffroIo': ('Un altro e arrivo', 'Estasi da Coca Etilene', 2),
    'base.pino.PrimaIlBrindisi': ('Prima il brindisi', 'Rutto a distanza sociale', 1),
    'base.gigi.ColpoDiChiaveInglese': ('Preparo il lavoro', 'Chiave da tredici', 2),
    'base.gigi.UnaStrettaDiProva': ('Una stretta di prova', 'Lavoro fatto bene', 1),
}
data = json.load(gzip.open(sys.argv[1], 'rt', encoding='utf-8'))
agg = defaultdict(lambda: defaultdict(int))
for cell, e in data.items():
    if cell.endswith('/com'):
        continue  # celle con lo stile casuale: fuori dai criteri D93
    for k, v in e.items():
        m = re.match(r'charge/([^/]+)/(found|missed|missAlreadyInHand)$', k)
        if m:
            agg[m.group(1)][m.group(2)] += v
pct = lambda a, b: f'{100 * a / b:.1f}%' if b else '—'
print('| Caricamento | Colpo cercato | Copie | Ricerche | Fallite | Di cui col colpo già in mano |')
print('|---|---|---:|---:|---:|---:|')
tot = defaultdict(lambda: [0, 0, 0])
for b, (card, hit, copies) in NAMES.items():
    a = agg[b]; n = a['found'] + a['missed']
    for key in (copies, 'tutte'):
        t = tot[key]; t[0] += n; t[1] += a['missed']; t[2] += a['missAlreadyInHand']
    print(f"| {card} | {hit} | {copies} | {n} | {pct(a['missed'], n)} | {pct(a['missAlreadyInHand'], a['missed'])} |")
for key, label in ((1, 'Colpi a copia singola'), (2, 'Colpi a due copie'), ('tutte', 'Totale')):
    n, f, h = tot[key]
    print(f'| **{label}** | | | {n} | {pct(f, n)} | {pct(h, f)} |')

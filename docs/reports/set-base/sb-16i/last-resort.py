"""SB-16i, Fase A: quanto pesa oggi la last resort e quanto potrebbe accorciare le partite una last resort che cresce.

Sola lettura, nessuna partita. Legge i contatori del giro 20/2 di SB-16h, identico alla bozza di riferimento 1.5 (D92):

    python -X utf8 docs/reports/set-base/sb-16i/last-resort.py docs/reports/set-base/sb-16h

Per ogni incontro, sui soli euristici (D93): partite che finiscono dopo aver usato una last resort, e per ogni lato quante volte
la last resort viene giocata nelle partite in cui la si gioca. Poi un modello dichiaratamente grezzo dell'accorciamento:

- la k-esima giocata infligge base + (k-1) * X ("Rincara X");
- una partita che oggi si chiude dopo k giocate si chiude dopo m giocate, il primo m per cui la somma delle m giocate con
  Rincara raggiunge k * base (lo stesso danno totale di oggi);
- k segue una geometrica con la media osservata (plays / playedGames): i dati non danno la distribuzione;
- il modello ignora le altre carte, le difese, il contraccolpo e il fatto che entrambi possono essere in last resort.

Non è una previsione del giro: dice solo dove la crescita può incidere e con che ordine di grandezza.
"""
import gzip
import json
import sys
from pathlib import Path

NAMES = {
    'starter-spazienzio': 'Spazienzio', 'starter-mara': 'Mara', 'starter-tossico': 'Celestina',
    'starter-pino': 'Piera', 'starter-gigi': 'Beppe',
}
ORDER = list(NAMES)
LAST = {
    'starter-spazienzio': 'com.last.Struggle', 'starter-mara': 'com.last.Struggle', 'starter-gigi': 'com.last.Struggle',
    'starter-tossico': 'junkie.LethalHeroinDose', 'starter-pino': 'base.pino.UltimoGiro',
}
# Danno base al bersaglio stampato oggi (1.5); per L'ultimo giro la sola parte fissa, la L residua è di solito bassa.
BASE = {'com.last.Struggle': 10, 'junkie.LethalHeroinDose': 7, 'base.pino.UltimoGiro': 12}
# Varianti di crescita confrontate: X per ogni giocata precedente.
VARIANTS = {
    'proposta': {'com.last.Struggle': 5, 'junkie.LethalHeroinDose': 5, 'base.pino.UltimoGiro': 4},
    'pari alla base': {'com.last.Struggle': 10, 'junkie.LethalHeroinDose': 7, 'base.pino.UltimoGiro': 12},
}


def plays_needed(k, base, x):
    """Giocate con Rincara x che bastano per il danno di k giocate di oggi."""
    target, total, m = k * base, 0, 0
    while total < target:
        m += 1
        total += base + (m - 1) * x
    return m


def saved(mean, base, x, kmax=40):
    """Giocate risparmiate in media, con k geometrica di media `mean` (k >= 1)."""
    if mean <= 1:
        return 0.0
    p = 1 / mean
    return sum((1 - p) ** (k - 1) * p * (k - plays_needed(k, base, x)) for k in range(1, kmax + 1))


def side(obs, a, b):
    e = obs[f'{a}|{b}|heur']
    card = LAST[a]
    played = e.get(f'card/{card}/playedGames', 0)
    plays = e.get(f'card/{card}/plays', 0)
    hand = e.get(f'card/{card}/handTurns', 0)
    return {
        'games': e['games'], 'playedRate': played / e['games'], 'playsPerPlayed': plays / played if played else 0.0,
        'handTurnsPerPlayed': hand / played if played else 0.0,
    }


def main(folder):
    folder = Path(folder)
    obs = json.load(gzip.open(folder / 'round-20-2-deck-observations.json.gz'))
    by = json.load(gzip.open(folder / 'summary.json.gz'))['20-2']['byMatchup']
    rows, total_games, total_after = [], 0, 0
    for i, a in enumerate(ORDER):
        for b in ORDER[i:]:
            m = by[f'{a}|{b}|heur']
            sa, sb = side(obs, a, b), side(obs, b, a)
            after = m['endAfterAnyLastResort']
            games = m['games']
            row = {
                'incontro': f'{NAMES[a]}–{NAMES[b]}', 'turni': m['turns'], 'finaliDopoLR': after,
                'lrA': sa, 'lrB': sb, 'risparmio': {},
            }
            for name, xs in VARIANTS.items():
                ra = saved(sa['playsPerPlayed'], BASE[LAST[a]], xs[LAST[a]])
                rb = saved(sb['playsPerPlayed'], BASE[LAST[b]], xs[LAST[b]])
                # Chi chiude prima decide: si prende il risparmio maggiore dei due lati, solo nelle partite toccate.
                per_game = max(ra, rb)
                row['risparmio'][name] = {'giocateNellePartiteToccate': per_game, 'turniMediIncontro': after * per_game}
            rows.append(row)
            total_games += games
            total_after += after * games
    print('| Incontro | Turni | Partite finite dopo una LR | LR giocata A / B | Giocate per partita A / B '
          '| Turni medi risparmiati, proposta | Turni medi risparmiati, pari alla base |')
    print('|---|---:|---:|---:|---:|---:|---:|')
    for r in rows:
        a, b = r['lrA'], r['lrB']
        print(f"| {r['incontro']} | {r['turni']:.2f} | {r['finaliDopoLR']:.2%} | {a['playedRate']:.1%} / {b['playedRate']:.1%} "
              f"| {a['playsPerPlayed']:.2f} / {b['playsPerPlayed']:.2f} "
              f"| {r['risparmio']['proposta']['turniMediIncontro']:.3f} "
              f"| {r['risparmio']['pari alla base']['turniMediIncontro']:.3f} |")
    print()
    print(f"Partite finite dopo una last resort, tutti gli incontri: {total_after / total_games:.2%}")
    for name in VARIANTS:
        t = sum(r['risparmio'][name]['turniMediIncontro'] for r in rows) / len(rows)
        print(f"Risparmio medio per incontro ({name}): {t:.3f} turni")
    print()
    print('Giocate necessarie per il danno di k giocate di oggi (k: m):')
    for card in BASE:
        for name, xs in VARIANTS.items():
            print(f"  {card} Rincara {xs[card]} ({name}):",
                  ', '.join(f"{k}:{plays_needed(k, BASE[card], xs[card])}" for k in range(1, 8)))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'docs/reports/set-base/sb-16h')

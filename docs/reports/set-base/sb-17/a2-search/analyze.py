"""SB-17 Fase A2: reads the diagnostic search (search.json here) and the Fase B search of Sergio (../search.json),
classifies every card by the grid ID at the start of its GUI description and prints the tables of the proposal."""
import collections, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[4]
DRAFT = json.loads((ROOT / 'server/src/test/resources/set-base/bozza.json').read_text(encoding='utf8'))
GRID = {c['binding']: re.match(r'\s*([A-Z]+-[A-Z]*)', c.get('gui', {}).get('description', '') or '').group(1)
        if re.match(r'\s*([A-Z]+-[A-Z]*)', c.get('gui', {}).get('description', '') or '') else '?' for c in DRAFT['cards']}
NAME = {c['binding']: c.get('gui', {}).get('name', c['binding']) for c in DRAFT['cards']}
OWN = {'bruiser.character.BigBadBruiser': 'SPA-AR', 'base.character.Mara': 'MAR-AR', 'junkie.character.ToxicJunkie': 'TOS-AR',
       'base.character.Pino': 'PIN-AR', 'base.character.Gigi': 'GIG-AR', 'base.character.Cesira': 'CES-AR'}
STARTER = {d['character']: d for d in DRAFT['decks']}
OPP = ['starter-spazienzio', 'starter-mara', 'starter-tossico', 'starter-pino', 'starter-gigi', 'prova-sergio']


def quota(v):
    w = sum(x['vittorie'] for x in v.values()); l = sum(x['sconfitte'] for x in v.values())
    return w / (w + l)


def q1(x):
    return x['vittorie'] / (x['vittorie'] + x['sconfitte'])


def kind(binding, own):
    g = GRID.get(binding, '?')
    if g == own: return 'own'
    if g.endswith('-AR'): return 'other'
    return {'GEN-': 'generic', 'OGG-': 'item'}.get(g, 'other' if g != '?' else 'generic')


def main():
    runs = json.loads((HERE / 'search.json').read_text(encoding='utf8'))['ricerche']
    runs += json.loads((HERE.parent / 'search.json').read_text(encoding='utf8'))['ricerche']
    foreign = collections.Counter(); foreign_in = collections.defaultdict(set)
    print('| Personaggio | Partenza | Convalida ultimo | Miglior finalista | Min/max contro gli starter | Starter | Archetipo proprio (starter → ultimo) | Archetipo altrui | Generiche + oggetti |')
    print('|---|---|---:|---:|---|---:|---|---:|---:|')
    for r in runs:
        ch = r['personaggio']; own = OWN[ch]
        decks = {d['etichetta']: d for d in r['mazzi']}
        last = r['mazzi'][0]; start = [d for d in r['mazzi'] if d['etichetta'] == 'starter'][0]
        finals = [d for d in r['mazzi'] if d['etichetta'] != 'starter']
        best = max(quota(d['convalida']) for d in finals)
        vs = [q1(last['convalida'][o]) for o in OPP if o in last['convalida'] and o != 'prova-sergio']
        cnt = collections.Counter()
        for b, n in last['carte'].items():
            k = kind(b, own); cnt[k] += n
            if k == 'other': foreign[b] += n; foreign_in[b].add(f"{ch.split('.')[-1]}/{r['partenza']}")
        own_start = sum(n for b, n in STARTER[ch]['cards'].items() if GRID.get(b) == own)
        print(f"| {ch.split('.')[-1]} | {r['partenza']} | {quota(last['convalida']):.1%} | {best:.1%} | {min(vs):.1%}–{max(vs):.1%} | "
              f"{quota(start['convalida']):.1%} | {own_start} → {cnt['own']} | {cnt['other']} | {cnt['generic'] + cnt['item']} |")
    print()
    print('Carte d\'archetipo altrui nei mazzi «ultimo» (copie totali, ricerche in cui compaiono):')
    for b, n in foreign.most_common():
        print(f"- {NAME.get(b, b)} ({GRID.get(b)}): {n} copie in {len(foreign_in[b])} ricerche: {', '.join(sorted(foreign_in[b]))}")
    print()
    print('Quota del mazzo «ultimo» contro ciascun avversario:')
    for r in runs:
        last = r['mazzi'][0]
        print(r['personaggio'].split('.')[-1], r['partenza'], ' '.join(f"{o.split('-')[-1]}={q1(last['convalida'][o]):.1%}" for o in OPP if o in last['convalida']))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf8')
    main()

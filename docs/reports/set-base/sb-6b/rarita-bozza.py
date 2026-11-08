"""SB-6b, Q5: porta la bozza del Set Base al formato sb-6b/1 e le scrive le rarità della griglia.

Uso, dalla radice del repository: python docs/reports/set-base/sb-6b/rarita-bozza.py [--check]

- Testata: set «base», nome «Set Base», versione «bozza»; il set di partenza tiene le sue regole del formato.
- Carte: la rarità è quella della riga della griglia (docs/design/set-base/griglia.md) il cui ID apre la descrizione della carta
  (per esempio «SPA-BA — …»). C → COMMON, NC → UNCOMMON, R → RARE.
- Personaggi: la riga PG-… della griglia, scelta dall'id del personaggio (CHARACTERS sotto).
- Il file si modifica come testo, una riga per voce, così il resto della bozza resta com'è.
Con --check non scrive: controlla che ogni carta e personaggio della bozza abbia la rarità della griglia.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
DRAFT = ROOT / 'server/src/test/resources/set-base/bozza.json'
GRID = ROOT / 'docs/design/set-base/griglia.md'
VALUES = {'C': 'COMMON', 'NC': 'UNCOMMON', 'R': 'RARE'}
CHARACTERS = {'bruiser.character.BigBadBruiser': 'PG-SPA', 'base.character.Mara': 'PG-MAR', 'junkie.character.ToxicJunkie': 'PG-TOS',
              'base.character.Pino': 'PG-PIN', 'base.character.Gigi': 'PG-GIG', 'base.character.Cesira': 'PG-CES',
              'base.character.Rocco': 'PG-ROC'}


def grid_rarities():
    out, header = {}, None
    for line in GRID.read_text(encoding='utf-8').splitlines():
        if line.startswith('| ID |'):
            header = [c.strip() for c in line.strip('|').split('|')]
            continue
        if header and line.startswith('|') and not line.startswith('|---'):
            cells = [c.strip() for c in line.strip('|').split('|')]
            if len(cells) == len(header) and 'Rarità' in header:
                out[cells[0]] = cells[header.index('Rarità')]
        elif not line.startswith('|'):
            header = None
    return out


def expected(draft, grid):
    want = {}
    for card in draft['cards']:
        m = re.match(r'([A-Z]{2,4}-[A-Z0-9]+)', card['gui'].get('description', ''))
        assert m and m.group(1) in grid, 'carta senza ID di griglia: ' + card['binding']
        want[card['binding']] = VALUES[grid[m.group(1)]]
    for character in draft['characters']:
        assert character['id'] in CHARACTERS, 'personaggio senza riga della griglia: ' + character['id']
        want[character['id']] = VALUES[grid[CHARACTERS[character['id']]]]
    return want


def main():
    grid = grid_rarities()
    text = DRAFT.read_text(encoding='utf-8')
    draft = json.loads(text)
    want = expected(draft, grid)
    if '--check' in sys.argv:
        got = {c['binding']: c.get('rarity') for c in draft['cards']}
        got.update({c['id']: c.get('rarity') for c in draft['characters']})
        wrong = {k: (got.get(k), v) for k, v in want.items() if got.get(k) != v}
        print('rarità come la griglia' if not wrong else 'diverse dalla griglia: ' + str(wrong))
        sys.exit(1 if wrong else 0)
    assert draft['format'] == 'sb-6a/1', 'la bozza è già ' + draft['format']
    text = text.replace('"format": "sb-6a/1",',
                        '"format": "sb-6b/1",\n  "set": {"id": "base", "name": "Set Base", "version": "bozza"},', 1)
    for key, rarity in want.items():
        field = '"binding": "' if key in {c['binding'] for c in draft['cards']} else '"id": "'
        old = '{' + field + key + '", '
        assert text.count(old) == 1, old
        text = text.replace(old, '{' + field + key + '", "rarity": "' + rarity + '", ')
    DRAFT.write_text(text, encoding='utf-8', newline='\n')
    print('scritte ' + str(len(want)) + ' rarità')


if __name__ == '__main__':
    main()

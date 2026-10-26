"""Read-only checks: published rules and catalog must match the reviewed baseline."""
from pathlib import Path
import json
import sqlite3

root = Path(__file__).resolve().parent.parent
canonical = root / 'docs/game-rules.md'
assert canonical.read_text(encoding='utf-8-sig') == (root / 'client-debug/src/assets/docs/rules.md').read_text(encoding='utf-8-sig'), 'Client rules differ'
expected = json.loads((root / 'docs/rules-catalog.json').read_text(encoding='utf-8'))
assert 'Versione **' + expected['version'] + ' —' in canonical.read_text(encoding='utf-8-sig'), 'Annex version differs'
rows = {}
section = canonical.read_text(encoding='utf-8-sig').split('## R07 — Carte del set\n', 1)[1].split('## R08', 1)[0]
table_width = None
for line in section.splitlines():
    if line.startswith('|'):
        fields = [part.strip() for part in line.strip('|').split('|')]
        if table_width is None:
            table_width = len(fields)
        assert len(fields) == table_width, 'Inconsistent R07 table columns: ' + line
        if line.startswith('| '):
            rows[fields[0]] = fields
    else:
        table_width = None
cost_names = {'V': 'VIOLENCE', 'A': 'ALERTNESS', 'T': 'TOXICITY', 'L': 'ALCOHOL'}
target_names = {'Sé': 'SELF', 'Avversario': 'OPPONENT', 'Oggetto vicino': 'NEAR_ITEM', 'Oggetto lontano': 'FAR_ITEM'}
contracts = []
for card in expected['cards']:
    row = rows[card['class'].split('.')[-1]]
    assert row[1:3] == [card['type'], card['subtype']], card['class'] + ': classification differs from R07'
    assert card['description'] == row[-1] + '. Riferimento: Regolamento ' + expected['version'] + ', R02-R07.', card['class'] + ': text differs from R07'
    if card['type'] == 'Azione':
        assert len(row) == 7
        costs = '' if row[3] == '—' else ','.join(cost_names[v.split()[1]] + '=' + v.split()[0] for v in row[3].split(' + '))
        contracts.append('\t'.join([card['class'], row[4].replace('−', '-'), target_names[row[5]], costs]))
assert '\n'.join(contracts) + '\n' == (root / 'server/src/test/resources/rules-v1-cards.tsv').read_text(encoding='utf-8'), 'Test contract differs from R07'
for character in expected['characters']:
    row = rows[character['class'].split('.')[-1]]
    assert row[1:3] == [character['type'], character['name']], 'Character missing or misclassified in R07'
for token in expected['tokens']:
    assert rows[token['class'].split('.')[-1]][1:3] == [token['type'], token['subtype']], 'Token classification differs'
entries = expected['cards'] + expected['characters'] + expected['tokens']
types = ['\t'.join([entry['class'], entry['type'], entry.get('subtype', '—')]) for entry in entries]
assert '\n'.join(types) + '\n' == (root / 'server/src/test/resources/rules-card-types.tsv').read_text(encoding='utf-8'), 'Type test contract differs'
assert len(expected['cards']) == 37 and len(expected['characters']) == 2 and len(expected['tokens']) == 1, 'Set inventory differs'
with sqlite3.connect((root / 'server/src/main/resources/cards.sqlite').as_uri() + '?mode=ro', uri=True) as db:
    actual = [{'class': r[0], 'name': r[1], 'description': r[2]} for r in db.execute(
        'select C_REF_CLASS,T_GUI_NAME,T_GUI_DESCRIPTION from CRD001_GUI order by C_REF_CLASS')]
    assert actual == [{key: card[key] for key in ('class', 'name', 'description')} for card in expected['cards']], 'Card catalog differs from regulation annex'
    characters = [{'class': r[0], 'name': r[1], 'type': 'Personaggio'} for r in db.execute(
        'select C_REF_CLASS,T_GUI_NAME from CRD003_CHARACTERS order by C_REF_CLASS')]
    assert characters == expected['characters'], 'Character catalog differs from regulation annex'
    for table, key in [('DCK001_STARTERS', 'starters'), ('DCK002_STARTERS_CH', 'initialCards')]:
        actual = [list(row) for row in db.execute('select * from ' + table + ' order by 1,2')]
        assert actual == expected[key], table + ' differs from regulation annex'
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
    assert not db.execute('pragma foreign_key_check').fetchall()
print('Regolamento e copia client allineati: 39 carte (2 personaggio, 33 azione, 4 oggetto) e 1 token; tipologie, testi e starter coerenti; SQLite integro.')

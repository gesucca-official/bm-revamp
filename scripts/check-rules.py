"""Read-only checks: published rules, set documents and catalog must match the reviewed baseline.

Regulation 1.13 (SB-2): the regulation (docs/game-rules.md) holds the general rules and the cards live in the set
documents (docs/sets/<id>.md), with their own version. The set annex (docs/rules-catalog.json) and the SQLite catalog
must agree with the set document. `--root DIR` checks another copy of the repository, so a mismatch can be tried on a
temporary copy without touching the tracked files.
"""
from pathlib import Path
import json
import re
import sqlite3
import sys

root = Path(sys.argv[sys.argv.index('--root') + 1]).resolve() if '--root' in sys.argv else Path(__file__).resolve().parent.parent
canonical = root / 'docs/game-rules.md'
rules_text = canonical.read_text(encoding='utf-8-sig')
assert rules_text == (root / 'client-debug/src/assets/docs/rules.md').read_text(encoding='utf-8-sig'), 'Client rules differ'
assert re.search(r'^Versione \*\*[0-9.]+ —', rules_text, re.M), 'Missing regulation version'
# Set documents (R00, R07): one per set, identical client copies. Until SB-6b there is exactly one set.
set_docs = sorted((root / 'docs/sets').glob('*.md'))
assert [p.name for p in set_docs] == ['base.md'], 'Expected exactly one set document, docs/sets/base.md'
client_sets = root / 'client-debug/src/assets/docs/sets'
assert sorted(p.name for p in client_sets.glob('*.md')) == [p.name for p in set_docs], 'Client set documents differ'
set_doc = set_docs[0]
set_id = set_doc.stem
set_text = set_doc.read_text(encoding='utf-8-sig')
assert set_text == (client_sets / set_doc.name).read_text(encoding='utf-8-sig'), 'Client set document differs'
set_title = re.match(r'# Botte Micidiali — (.+)\n', set_text)
set_version = re.search(r'^Versione \*\*([0-9.]+) —', set_text, re.M)
assert set_title and set_version, 'Set document without title or version'
set_title, set_version = set_title.group(1), set_version.group(1)
expected = json.loads((root / 'docs/rules-catalog.json').read_text(encoding='utf-8'))
assert expected.get('set') == set_id, 'Annex set ' + str(expected.get('set')) + ' differs from the set document ' + set_id
assert expected['version'] == set_version, 'Annex version ' + expected['version'] + ' differs from the set document ' + set_version
# The regulation cites no card before its revision history (SB-2): card-specific text belongs to the set document.
general = rules_text.split('\n## Revisioni\n', 1)[0]
for entry in expected['cards'] + expected['characters'] + expected['tokens'] + [{'class': 'bitch.SoberUp'}]:
    name = entry['class'].split('.')[-1]
    assert not re.search(r'\b' + name + r'\b', general), 'The regulation cites the card ' + name + ': it belongs to the set document'
rows = {}
section = set_text.split('\n## S2 — ', 1)[1].split('\n## S5 — ', 1)[0]
role_section = set_text.split('\n## S5 — ', 1)[1].split('\n## Revisioni', 1)[0]
reference = '. Riferimento: ' + set_title + ' ' + set_version + '.'
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
missing = [e['class'] for e in expected['cards'] + expected['characters'] + expected['tokens'] if e['class'].split('.')[-1] not in rows]
assert not missing, 'Cards of the annex without a sheet in the set document: ' + ', '.join(missing)
for card in expected['cards']:
    row = rows[card['class'].split('.')[-1]]
    assert row[1:3] == [card['type'], card['subtype']], card['class'] + ': classification differs from R07'
    assert card['description'] == row[-1] + reference, card['class'] + ': text differs from the set document'
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
# R07a: descriptive role and self gains, one row per set entry; no effect depends on them.
role_names = {'DAMAGE', 'DEFENSE', 'RESOURCES', 'COUNTER', 'DISRUPT', 'ITEMS', 'OTHER'}
regulation_roles = rules_text.split('## R07a — ', 1)[1].split('### Danno nominale', 1)[0]
assert {m.group(1) for m in re.finditer(r'^\| ([A-Z]+) \| ', regulation_roles, re.M)} == role_names, 'R07a role definitions differ'
roles = {}
for line in role_section.split('### Danno nominale', 1)[0].splitlines():
    fields = [part.strip() for part in line.strip('|').split('|')]
    if line.startswith('| ') and len(fields) == 3 and fields[0] != 'Carta':
        roles[fields[0]] = fields[1:]
assert list(roles) == [row for row in rows if row in {e['class'].split('.')[-1] for e in entries}], 'R07a must list the R07 set in order'
for entry in entries:
    role, gains = roles[entry['class'].split('.')[-1]]
    if entry['type'] == 'Personaggio':
        assert [role, gains] == ['—', '—'] and 'role' not in entry, entry['class'] + ': characters have no role'
    else:
        assert role in role_names, entry['class'] + ': unknown role ' + role
        assert [entry['role'], entry['gains']] == [role, gains], entry['class'] + ': role or gains differ from R07a'
# R07a 1.9 / 1.10: nominal damage type and amount, also descriptive. Both are checked against the Damage each card's
# code builds: the target damages are read from the source text (a fixed amount literally, a variable one through its
# declared formula) and compared with the R07a table, the annex, SQLite and the test contract.
NONE = '\u2014'
damage_names = ['HIT', 'CUT', 'POISON']
damages = {}
for line in role_section.split('### Danno nominale', 1)[1].splitlines():
    fields = [part.strip() for part in line.strip('|').split('|')]
    if line.startswith('| ') and len(fields) == 3 and fields[0] != 'Carta':
        damages[fields[0]] = fields[1:]
assert list(damages) == list(roles), 'R07a damage table must list the R07 set in order'
# Delayed timer damage is excluded by R07a by name; variable amounts are written with x and declared with their formula.
excluded_by_rules = {'com.items.MarvelousCocktail': {'POISON'}}
variable_formulas = {'20+x': '20+(self.getResources().get(Resource.VIOLENCE)/2)'}


def scan_call(code, open_index):
    """Text between the parenthesis at open_index and its match."""
    depth = 0
    for i in range(open_index, len(code)):
        depth += {'(': 1, ')': -1}.get(code[i], 0)
        if depth == 0:
            return code[open_index + 1:i]
    raise AssertionError('unbalanced parenthesis')


def code_damages(entry):
    """[(type, amount expression, recipient, file:line)] of each Damage the card's class builds."""
    path = root / 'server/src/main/java/com/gsc/bm/model/cards' / (entry['class'].replace('.', '/') + '.java')
    code = path.read_text(encoding='utf-8')
    found = []
    for m in re.finditer(r'new Damage\(', code):
        inner = scan_call(code, m.end() - 1)
        kind, amount = [part.strip() for part in inner.split(',', 1)]
        assert kind.startswith('Damage.DamageType.'), entry['class'] + ': unreadable damage type ' + kind
        before = code[:m.start()]
        recipient = re.search(r'\.inflictDamage\(\s*(\w+)\s*,\s*$', before)
        if recipient:
            who = recipient.group(1)
        else:
            assert re.search(r'\.takeDamage\(\s*$', before), entry['class'] + ': Damage built outside inflictDamage/takeDamage'
            who = 'timer'
        amount = re.sub(r'\s+', '', amount)
        if re.fullmatch(r'[A-Za-z_]\w*', amount):
            # SB-6a: a @Tunable field holds the number; its initializer is the value of the live game.
            tunable = re.findall(r'@Tunable\s+private\s+int\s+' + amount + r'\s*=\s*(\d+)\s*;', code)
            assert len(tunable) == 1, entry['class'] + ': damage amount ' + amount + ' is neither a number nor a @Tunable int field'
            amount = tunable[0]
        found.append((kind.rsplit('.', 1)[1], amount, who,
                      path.relative_to(root).as_posix() + ':' + str(code.count('\n', 0, m.start()) + 1)))
    return found


def amount_from_code(entry):
    """Nominal amount written from the code (target damages only, HIT, CUT, POISON order) and its source lines."""
    per_type, lines = {}, []
    for kind, amount, who, where in code_damages(entry):
        if who == 'timer':
            assert kind in excluded_by_rules.get(entry['class'], set()), entry['class'] + ': undeclared timer damage ' + kind
            continue
        if who != 'target':
            assert who == 'self', entry['class'] + ': damage to an unknown recipient ' + who
            continue
        per_type.setdefault(kind, []).append(amount)
        lines.append(where)
    parts = []
    for kind in damage_names:
        if kind not in per_type:
            continue
        amounts = per_type[kind]
        if all(a.isdigit() for a in amounts):
            parts.append(kind + ' ' + str(sum(int(a) for a in amounts)))
        else:
            assert len(amounts) == 1, entry['class'] + ': several amounts with a variable one'
            wanted = [x for x, formula in variable_formulas.items() if formula == amounts[0]]
            assert wanted, entry['class'] + ': variable damage formula not declared: ' + amounts[0]
            parts.append(kind + ' ' + wanted[0])
    return (', '.join(parts) or NONE), lines


for entry in entries:
    name = entry['class'].split('.')[-1]
    damage, amount = damages[name]
    if entry['type'] == 'Personaggio':
        assert [damage, amount] == [NONE, NONE] and 'damage' not in entry and 'damageAmount' not in entry, entry['class'] + ': characters have no damage'
        continue
    kinds = [] if damage == NONE else damage.split(', ')
    assert kinds == [k for k in damage_names if k in kinds], entry['class'] + ': unknown, repeated or unordered damage ' + damage
    assert entry['damage'] == damage, entry['class'] + ': damage differs from R07a'
    assert entry['damageAmount'] == amount, entry['class'] + ': damage amount differs from R07a'
    parts = [] if amount == NONE else amount.split(', ')
    assert len(parts) == len(kinds) and all(re.fullmatch(k + r' (\d+|\d+\+x)', a) for k, a in zip(kinds, parts)), entry['class'] + ': malformed damage amount ' + amount
    built, _ = amount_from_code(entry)
    assert built == amount, entry['class'] + ': R07a damage amount ' + amount + ' differs from code ' + built
    if entry['type'] == 'Azione':
        for part in parts:
            kind, number = part.split(' ')
            shown = kind + ' pari a 20 + V residua/2' if number.endswith('+x') else number + ' ' + kind
            assert shown in rows[name][-1], entry['class'] + ': R07 effect text does not show ' + part
if '--sources' in sys.argv:
    print('| Carta | Tipo | Importo | Codice |\n|---|---|---|---|')
    for entry in entries:
        if entry['type'] != 'Personaggio':
            _, lines = amount_from_code(entry)
            print('| ' + entry['class'].split('.')[-1] + ' | ' + entry['damage'] + ' | ' + entry['damageAmount'] + ' | ' + (', '.join(lines) or NONE) + ' |')
roles_contract = ['\t'.join([e['class'], e['role'], e['gains'], e['damage'], e['damageAmount']]) for e in expected['cards'] + expected['tokens']]
assert '\n'.join(roles_contract) + '\n' == (root / 'server/src/test/resources/rules-card-roles.tsv').read_text(encoding='utf-8'), 'Role test contract differs from R07a'
types = ['\t'.join([entry['class'], entry['type'], entry.get('subtype', '—')]) for entry in entries]
assert '\n'.join(types) + '\n' == (root / 'server/src/test/resources/rules-card-types.tsv').read_text(encoding='utf-8'), 'Type test contract differs'
assert len(expected['cards']) == 37 and len(expected['characters']) == 2 and len(expected['tokens']) == 1, 'Set inventory differs'
# R02 1.12: deck rules. A basic or a last resort may be reserved to one character (`exclusiveTo`, absent = generic); every
# character has exactly one basic, reserved to it; a bound belongs to the character named in its class constructor. Both
# starters must satisfy the deck rules: 20 regular cards, at most 2 copies, own basic, two different own bound cards.
by_class = {card['class']: card for card in expected['cards']}
character_classes = {c['class'] for c in expected['characters']}
def bound_owner(binding):
    code = (root / 'server/src/main/java/com/gsc/bm/model/cards' / (binding.replace('.', '/') + '.java')).read_text(encoding='utf-8')
    found = re.search(r'super\((\w+)\.class\)', code)
    owners = [c for c in character_classes if found and c.split('.')[-1] == found.group(1)]
    assert len(owners) == 1, binding + ': bound without a catalog character in its constructor'
    return owners[0]
for card in expected['cards']:
    if 'exclusiveTo' in card:
        assert card['subtype'] in ('Base', 'Ultima risorsa'), card['class'] + ': only a basic or a last resort is reserved to a character'
        assert card['exclusiveTo'] in character_classes, card['class'] + ': reserved to an unknown character'
    if card.get('subtype') == 'Base':
        assert 'exclusiveTo' in card, card['class'] + ': a basic is the fixed basic of one character'
for character in sorted(character_classes):
    assert len([c for c in expected['cards'] if c.get('subtype') == 'Base' and c.get('exclusiveTo') == character]) == 1, character + ': exactly one basic'
assert sorted(row[0] for row in expected['initialCards']) == sorted(character_classes), 'One starter per character'
for character, basic, bound1, bound2, last in expected['initialCards']:
    regular = [(binding, qty) for owner, binding, qty in expected['starters'] if owner == character]
    assert sum(qty for _, qty in regular) == 20, character + ': the starter must have exactly 20 regular cards'
    assert all(1 <= qty <= 2 for _, qty in regular), character + ': at most 2 copies per card'
    assert all(by_class[b]['subtype'] in ('Regolare', '—') for b, _ in regular), character + ': only regular cards and items in the deck'
    assert by_class[basic]['subtype'] == 'Base' and by_class[basic].get('exclusiveTo') == character, character + ': basic of another character'
    assert bound1 != bound2, character + ': the two bound cards must differ'
    for bound in (bound1, bound2):
        assert by_class[bound]['subtype'] == 'Legata al personaggio' and bound_owner(bound) == character, character + ': bound of another character ' + bound
    assert by_class[last]['subtype'] == 'Ultima risorsa' and by_class[last].get('exclusiveTo', character) == character, character + ': last resort reserved to another character'
with sqlite3.connect((root / 'server/src/main/resources/cards.sqlite').as_uri() + '?mode=ro', uri=True) as db:
    actual = [{'class': r[0], 'name': r[1], 'description': r[2], 'role': r[3], 'gains': r[4], 'damage': r[5], 'damageAmount': r[6]} for r in db.execute(
        'select C_REF_CLASS,T_GUI_NAME,T_GUI_DESCRIPTION,T_GUI_ROLE,T_GUI_GAINS,T_GUI_DAMAGE,T_GUI_DAMAGE_AMOUNT from CRD001_GUI order by C_REF_CLASS')]
    assert actual == [{key: card[key] for key in ('class', 'name', 'description', 'role', 'gains', 'damage', 'damageAmount')} for card in expected['cards']], 'Card catalog differs from regulation annex'
    reserved = [list(r) for r in db.execute('select C_REF_CLASS,C_EXCLUSIVE_TO from CRD001_GUI order by C_REF_CLASS')]
    assert reserved == [[card['class'], card.get('exclusiveTo')] for card in expected['cards']], 'Reserved cards (R02 1.12) differ from regulation annex'
    characters = [{'class': r[0], 'name': r[1], 'type': 'Personaggio'} for r in db.execute(
        'select C_REF_CLASS,T_GUI_NAME from CRD003_CHARACTERS order by C_REF_CLASS')]
    assert characters == expected['characters'], 'Character catalog differs from regulation annex'
    # R07 1.13 (SB-2): every catalog card and character declares the set of its document; the rarity is descriptive,
    # one of the regulation values or none, and equal to the annex (`rarity`, absent = none).
    for table in ('CRD001_GUI', 'CRD003_CHARACTERS'):
        wrong = [r[0] for r in db.execute('select C_REF_CLASS,C_SET from ' + table + ' order by C_REF_CLASS') if r[1] != set_id]
        assert not wrong, table + ': cards outside the set ' + set_id + ' of the set document: ' + ', '.join(wrong)
    rarities = [list(r) for r in db.execute('select C_REF_CLASS,C_RARITY from CRD001_GUI order by C_REF_CLASS')]
    assert all(r[1] in (None, 'COMMON', 'UNCOMMON', 'RARE') for r in rarities), 'Unknown rarity (R07 1.13)'
    assert rarities == [[card['class'], card.get('rarity')] for card in expected['cards']], 'Rarities differ from the set annex'
    for table, key in [('DCK001_STARTERS', 'starters'), ('DCK002_STARTERS_CH', 'initialCards')]:
        actual = [list(row) for row in db.execute('select * from ' + table + ' order by 1,2')]
        assert actual == expected[key], table + ' differs from regulation annex'
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
    assert not db.execute('pragma foreign_key_check').fetchall()
print('Regolamento ' + re.search(r'^Versione \*\*([0-9.]+) —', rules_text, re.M).group(1) + ' e ' + set_title + ' ' + set_version
      + ' allineati alle copie client; regolamento senza carte citate; 39 carte (2 personaggio, 33 azione, 4 oggetto) e 1 token del set;'
      + ' tipologie, ruoli, danno nominale e importo R07a, testi e starter coerenti; allegato e SQLite nel set ' + set_id
      + ', rarità ammesse; starter conformi alle regole dei mazzi R02 1.12; SQLite integro.')

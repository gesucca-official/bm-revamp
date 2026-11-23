"""Read-only checks: published rules, set documents and catalog must match the reviewed baseline.

Regulation 1.13 (SB-2): the regulation (docs/game-rules.md) holds the general rules and the cards live in the set
documents (docs/sets/<id>.md), with their own version. The set annex (docs/rules-catalog.json) and the SQLite catalog
must agree with the set document. `--root DIR` checks another copy of the repository, so a mismatch can be tried on a
temporary copy without touching the tracked files.

SB-26 (D175): `--candidate [DIR]` also checks a catalog generated from a set file by tools/set-catalog/set_catalog.py
(default server/src/test/resources/set-base/catalogo; the folder's manifest names the set files): one or more set documents,
their annexes, the SQLite catalog and the debug-client copies. The sheet (full text) and the short text are two fields,
checked separately: the sheet against the set document, the short text against its generator.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import re
import sqlite3
import sys

root = Path(sys.argv[sys.argv.index('--root') + 1]).resolve() if '--root' in sys.argv else Path(__file__).resolve().parent.parent
canonical = root / 'docs/game-rules.md'
rules_text = canonical.read_text(encoding='utf-8-sig')
assert rules_text == (root / 'client-debug/src/assets/docs/rules.md').read_text(encoding='utf-8-sig'), 'Client rules differ'
assert re.search(r'^Versione \*\*[0-9.]+ —', rules_text, re.M), 'Missing regulation version'
# Set documents (R00, R07): one per set, identical client copies. There is exactly one set until a second set document is
# published (SB-26, SB-28): the SB-6b mini-expansion is a test resource without a document.
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
# R07 1.14 (SB-24, P added): the rarity vocabulary is read from the regulation; the playground loader (SB-6b) must use the same values.
rarity_rule = re.search(r'\*\*Rarità \(1\.14\)\.\*\*([^\n]+)', rules_text)
assert rarity_rule, 'R07: missing the rarity paragraph'
rarity_values = re.search(r'una rarità, ((?:[A-Z]+, )*[A-Z]+) o ([A-Z]+), oppure nessuna', rarity_rule.group(1))
assert rarity_values, 'R07: rarity vocabulary not found'
rarity_vocabulary = rarity_values.group(1).split(', ') + [rarity_values.group(2)]
# SB-8: the draft loader moved to the production sources (profile bozza); same file, same constant.
loader = (root / 'server/src/main/java/com/gsc/bm/sim/Draft.java').read_text(encoding='utf-8')
loader_rarities = re.search(r'static final List<String> RARITIES = List\.of\(([^)]*)\);', loader)
assert loader_rarities, 'Draft.java: RARITIES not found'
assert re.findall(r'"([A-Z]+)"', loader_rarities.group(1)) == rarity_vocabulary, \
    'Draft.java RARITIES differ from R07: ' + loader_rarities.group(1) + ' vs ' + ', '.join(rarity_vocabulary)
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
cost_names = {'V': 'VIOLENCE', 'A': 'ALERTNESS', 'T': 'TOXICITY', 'L': 'ALCOHOL', 'H': 'HEALTH'}  # H: costs in HEALTH (D27)
target_names = {'Sé': 'SELF', 'Avversario': 'OPPONENT', 'Oggetto vicino': 'NEAR_ITEM', 'Oggetto lontano': 'FAR_ITEM'}
contracts = []
missing = [e['class'] for e in expected['cards'] + expected['characters'] + expected['tokens'] if e['class'].split('.')[-1] not in rows]
assert not missing, 'Cards of the annex without a sheet in the set document: ' + ', '.join(missing)
for card in expected['cards']:
    row = rows[card['class'].split('.')[-1]]
    assert row[1:3] == [card['type'], card['subtype']], card['class'] + ': classification differs from R07'
    # SB-26 (D175 (4)): sheet and short text are two fields. In the set 0.1 the short text is the sheet followed by the
    # reference to the set document, so the sheet of the annex is the description without it.
    assert card['description'].endswith(reference), card['class'] + ': short text without the reference ' + reference.strip()
    assert card['description'][:-len(reference)] == row[-1], card['class'] + ': sheet differs from the set document'
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
            tunable = re.findall(r'@Tunable(?:\(optional\s*=\s*true\))?\s+private\s+int\s+' + amount + r'\s*=\s*(\d+)\s*;', code)
            assert len(tunable) == 1, entry['class'] + ': damage amount ' + amount + ' is neither a number nor a @Tunable int field'
            amount = tunable[0]
            if amount == '0':
                # SB-16g passo 3 (D84): a tunable worth 0 in the live game deals no damage there (playground-only number).
                continue
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
    assert all(r[1] is None or r[1] in rarity_vocabulary for r in rarities), 'Unknown rarity (R07 1.13)'
    assert rarities == [[card['class'], card.get('rarity')] for card in expected['cards']], 'Rarities differ from the set annex'
    for table, key in [('DCK001_STARTERS', 'starters'), ('DCK002_STARTERS_CH', 'initialCards')]:
        actual = [list(row) for row in db.execute('select * from ' + table + ' order by 1,2')]
        assert actual == expected[key], table + ' differs from regulation annex'
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
    assert not db.execute('pragma foreign_key_check').fetchall()
print('Regolamento ' + re.search(r'^Versione \*\*([0-9.]+) —', rules_text, re.M).group(1) + ' e ' + set_title + ' ' + set_version
      + ' allineati alle copie client; regolamento senza carte citate; 39 carte (2 personaggio, 33 azione, 4 oggetto) e 1 token del set;'
      + ' tipologie, ruoli, danno nominale e importo R07a, testi e starter coerenti; allegato e SQLite nel set ' + set_id
      + ', rarità ammesse (' + ', '.join(rarity_vocabulary) + ', anche nel caricatore delle bozze); starter conformi alle regole dei mazzi R02 1.12; SQLite integro.')


# ------------------------------------------------------------------------------------------------ SB-26: candidate catalog
def candidate_folder():
    if '--candidate' not in sys.argv:
        return None
    i = sys.argv.index('--candidate') + 1
    given = sys.argv[i] if i < len(sys.argv) and not sys.argv[i].startswith('--') else 'server/src/test/resources/set-base/catalogo'
    return (root / given).resolve()


HEADING = re.compile(r'^#### (.+?) — (.+)$')
BINDING_LINE = re.compile(r'^`([^`]+)`(?: · slot (\S+))?$')


def parse_sheets(text, where):
    """{binding: (name, heading fields, [paragraphs])} of every sheet (#### heading, identifier line, paragraphs)."""
    sheets, lines, i = {}, text.split('\n'), 0
    while i < len(lines):
        m = HEADING.match(lines[i])
        if not m:
            i += 1
            continue
        assert lines[i + 1] == '' and BINDING_LINE.match(lines[i + 2]), where + ': sheet without identifier line: ' + lines[i]
        binding = BINDING_LINE.match(lines[i + 2]).group(1)
        assert binding not in sheets, where + ': two sheets for ' + binding
        paragraphs, i = [], i + 4
        while i < len(lines) and not lines[i].startswith('#'):
            if lines[i]:
                paragraphs.append(lines[i])
            i += 1
        sheets[binding] = (m.group(1), m.group(2).split(' · '), paragraphs)
    return sheets


def table_rows(text, header):
    """Rows (lists of cells) of the markdown tables whose header line is `header`."""
    rows, inside = [], False
    for line in text.split('\n'):
        if line == header:
            inside = True
            continue
        if inside and line.startswith('|---'):
            continue
        if inside and line.startswith('| '):
            rows.append([c.strip() for c in line.strip('|').split('|')])
        else:
            inside = False
    return rows


def check_candidate(folder):
    rel = folder.relative_to(root).as_posix()
    manifest = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
    for source in manifest['ingressi']:
        digest = hashlib.sha256((root / source['file']).read_bytes()).hexdigest()
        assert digest == source['sha256'], rel + ': ' + source['file'] + ' changed after the generation: regenerate the catalog'
    spec = importlib.util.spec_from_file_location('set_catalog_check', root / 'tools/set-catalog/set_catalog.py')
    gen = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gen)
    (files, cat, sets), _, _ = gen.run(manifest['argomenti'] + ['--root', str(root)])
    assert manifest['set'] == [s.id for s in sets], rel + ': sets of the manifest differ'
    all_annex = []
    for s in sets:
        sid, data = s.id, s.data
        where = rel + '/sets/' + sid + '.md'
        doc = (folder / 'sets' / (sid + '.md')).read_text(encoding='utf-8')
        assert doc == (folder / 'client-debug/sets' / (sid + '.md')).read_text(encoding='utf-8'), where + ': client copy differs'
        title = re.match(r'# Botte Micidiali — (.+)\n', doc)
        version = re.search(r'^Versione \*\*([0-9.]+) —', doc, re.M)
        assert title and version and title.group(1) == data['set']['name'], where + ': title or version missing'
        annex_doc = json.loads((folder / 'sets' / (sid + '.json')).read_text(encoding='utf-8'))
        assert annex_doc['set'] == sid and annex_doc['version'] == version.group(1), where + ': annex set or version differs'
        sheets = parse_sheets(doc, where)
        entries = annex_doc['cards'] + annex_doc['characters'] + annex_doc['tokens']
        assert sorted(sheets) == sorted(e['class'] for e in entries), where + ': sheets and annex entries differ'
        r07a = {row[1].strip('`'): row for row in table_rows(
            doc, '| Carta | Identificatore | Ruolo | Guadagni a sé | Danno nominale | Importo nominale |')}
        assert sorted(r07a) == sorted(sheets), where + ': the R07a table must list every entry'
        for e in entries:
            b, made = e['class'], cat.entries[e['class']]
            name, fields, paragraphs = sheets[b]
            assert name == e['name'] == made['name'], b + ': name differs between sheet, annex and set file'
            # The sheet: the full text of the annex as the set document shows it (placeholders as letters).
            assert paragraphs == [gen.render(p) for p in e['fullText']], b + ': sheet differs from the full text of the annex'
            assert e['fullText'] == made['fullText'], b + ': full text differs from the SB-25 texts (testi-completi.json)'
            assert e.get('flavour') == made['flavour'], b + ': flavour differs from the set file'
            assert fields[0] == gen.type_label(made) and fields[1] == (made.get('rarity') or NONE), \
                b + ': type or rarity of the sheet differs from the set file'
            assert e.get('rarity') == made.get('rarity') and (e.get('rarity') is None or e['rarity'] in rarity_vocabulary), \
                b + ': rarity unknown or different from the set file (R07 1.14)'
            if e['type'] == 'Personaggio':
                assert len(fields) == 2, b + ': a character sheet has type and rarity only'
                continue
            # The numbers of the heading against the set file; costs may be in HEALTH (D27).
            assert len(fields) == 4 and fields[2].startswith('Costo ') and fields[3].startswith('Priorità '), b + ': heading fields'
            cost = fields[2][len('Costo '):]
            parsed = {} if cost == NONE else {cost_names[v.split()[1]]: int(v.split()[0]) for v in cost.split(' + ')}
            assert parsed == {r: v for r, v in made['cost'].items() if v}, b + ': cost of the sheet differs from the set file'
            priority = fields[3][len('Priorità '):]
            assert (None if priority == NONE else int(priority.replace('−', '-'))) == made['priority'], \
                b + ': priority of the sheet differs from the set file'
            assert [e['type'], e['subtype']] == [made['type'], made['subtype']], b + ': classification differs from the set file'
            # The short text against its generator (SB-25), not against the sheet.
            assert e['description'] == made['description'], b + ': short text differs from the SB-25 generator'
            assert [e['role'], e['damage']] == [made['role'], made['damage']], b + ': role or damage differs from the set file'
            assert [e['gains'], e['damageAmount']] == [made['gains'], made['damageAmount']], \
                b + ': gains or damage amount differ from the SB-25 generator'
            assert r07a[b][2:] == [e['role'], e['gains'], e['damage'], e['damageAmount']], b + ': R07a table differs from the annex'
            assert e['role'] in role_names, b + ': unknown role ' + e['role']
        for c in annex_doc['characters']:
            assert r07a[c['class']][2:] == [NONE] * 4, c['class'] + ': characters have no role or damage'
        chars = {p['id']: p for p in data.get('characters', [])}
        s2 = table_rows(doc, '| Personaggio | H | A | V | T | L | Capacità oggetti | Immunità iniziale | Base |')
        assert len(s2) == len(chars), where + ': S2 must list every character'
        for row, p in zip(s2, chars.values()):
            numbers = [str(p['resources'].get(r, 0)) for r in gen.RESOURCES] + [str(p['items'])]
            assert row[0] == p['name'] and row[1:7] == numbers, p['id'] + ': S2 numbers differ from the set file'
        # Decks in the document against the set file; every card resolves in the catalog of all sets (mixed decks).
        for d in data.get('decks', []):
            listed = re.search(r'^\*\*`' + re.escape(d['id']) + r'`\*\*.*\n\n\| Carta \| Set \| Identificatore \| Copie \|\n'
                               r'\|---\|---\|---\|---:\|\n((?:\|.*\n)+)', doc, re.M)
            for ref in list(d['cards']) + d['bound'] + [d['lastResort'], d['character']]:
                assert ref in cat.entries, d['id'] + ': card outside the catalog of the sets ' + ref
            if listed:
                rows = [[c.strip() for c in line.strip('|').split('|')] for line in listed.group(1).strip().split('\n')]
                assert {r[2].strip('`'): int(r[3]) for r in rows} == d['cards'], d['id'] + ': deck of the document differs from the set file'
        # R02 on the starters of the annex: 20 regular cards, at most 2 copies, own basic, two different own bound cards.
        deck_rules = data.get('rules', {})
        for character, basic, bound1, bound2, last in annex_doc['initialCards']:
            regular = [(b, n) for owner, b, n in annex_doc['starters'] if owner == character]
            assert sum(n for _, n in regular) == deck_rules.get('deckSize', 20), character + ': the starter must have 20 regular cards'
            assert all(1 <= n <= deck_rules.get('maxCopies', 2) for _, n in regular), character + ': too many copies'
            assert all(cat.entries[b]['subtype'] in ('Regolare', NONE) for b, _ in regular), character + ': only regular cards and items'
            assert cat.entries[basic]['subtype'] == 'Base' and cat.entries[basic].get('owner') == character, character + ': basic of another character'
            assert bound1 != bound2 and all(cat.entries[x]['subtype'] == 'Legata al personaggio' and cat.entries[x].get('owner') == character
                                            for x in (bound1, bound2)), character + ': bound cards'
            assert cat.entries[last]['subtype'] == 'Ultima risorsa' and cat.entries[last].get('exclusiveTo', character) == character, \
                character + ': last resort reserved to another character'
        all_annex.append((sid, annex_doc))
    # SQLite: the live schema plus full text and flavour, and the rows of every annex.
    added = {'CRD001_GUI': ['T_GUI_FULL_TEXT', 'T_GUI_FLAVOUR'], 'CRD003_CHARACTERS': ['T_GUI_FULL_TEXT', 'T_GUI_FLAVOUR']}
    with sqlite3.connect((root / 'server/src/main/resources/cards.sqlite').as_uri() + '?mode=ro', uri=True) as live, \
            sqlite3.connect((folder / 'cards.sqlite').as_uri() + '?mode=ro', uri=True) as db:
        tables = [r[0] for r in live.execute("select name from sqlite_master where type='table' order by name")]
        assert tables == [r[0] for r in db.execute("select name from sqlite_master where type='table' order by name")], rel + ': SQLite tables differ from the live catalog'
        for table in tables:
            columns = [c[1:3] for c in live.execute('pragma table_info(' + table + ')')] + [(c, 'varchar2') for c in added.get(table, [])]
            assert [c[1:3] for c in db.execute('pragma table_info(' + table + ')')] == columns, table + ': schema differs from the live one plus full text and flavour'
        assert db.execute('select * from CRD002_KEYWORDS order by 1').fetchall() == live.execute('select * from CRD002_KEYWORDS order by 1').fetchall(), \
            'CRD002_KEYWORDS differs from the live catalog'
        cards = sorted(((c['class'], c['name'], c['description'], c['role'], c['gains'], c['damage'], c['damageAmount'], c.get('exclusiveTo'),
                         sid, c.get('rarity'), '\n'.join(c['fullText']), c['flavour']) for sid, a in all_annex for c in a['cards']))
        assert db.execute('select C_REF_CLASS,T_GUI_NAME,T_GUI_DESCRIPTION,T_GUI_ROLE,T_GUI_GAINS,T_GUI_DAMAGE,T_GUI_DAMAGE_AMOUNT,'
                          'C_EXCLUSIVE_TO,C_SET,C_RARITY,T_GUI_FULL_TEXT,T_GUI_FLAVOUR from CRD001_GUI order by C_REF_CLASS').fetchall() == cards, \
            rel + ': SQLite cards differ from the annexes'
        characters = sorted((p['class'], p['name'], sid, '\n'.join(p['fullText']), p['flavour']) for sid, a in all_annex for p in a['characters'])
        assert db.execute('select C_REF_CLASS,T_GUI_NAME,C_SET,T_GUI_FULL_TEXT,T_GUI_FLAVOUR from CRD003_CHARACTERS order by 1').fetchall() == characters, \
            rel + ': SQLite characters differ from the annexes'
        for table, key in [('DCK001_STARTERS', 'starters'), ('DCK002_STARTERS_CH', 'initialCards')]:
            assert [list(r) for r in db.execute('select * from ' + table + ' order by 1,2')] == sorted(x for _, a in all_annex for x in a[key]), \
                table + ' differs from the annexes'
        assert db.execute('pragma integrity_check').fetchone()[0] == 'ok' and not db.execute('pragma foreign_key_check').fetchall()
    # Last, the whole folder is what the generator writes now (SQLite by content, independent of the library).
    present = sorted(p.relative_to(folder).as_posix() for p in folder.rglob('*') if p.is_file())
    assert present == sorted(files), rel + ': files differ from the generation: ' + ', '.join(sorted(set(present) ^ set(files)))
    for name, data in files.items():
        mine = (folder / name).read_bytes()
        same = gen.sqlite_dump(mine) == gen.sqlite_dump(data) if name == gen.SQLITE else mine == data
        assert same, rel + '/' + name + ': not what the generator writes from the set files: regenerate (tools/set-catalog/set_catalog.py)'
    counts = ', '.join(s.id + ' ' + str(len([e for e in cat.entries.values() if e['set'] == s.id])) for s in sets)
    print('Catalogo candidato ' + rel + ': ' + str(len(sets)) + ' set (' + counts + ' voci); schede uguali al testo completo, '
          'testo breve, guadagni e danno uguali al generatore di SB-25, numeri, rarità, mazzi e R07a uguali al file del set, '
          'starter conformi a R02, SQLite con lo schema vivo più testo completo e flavour, copie client e file identici alla generazione.')


folder = candidate_folder()
if folder is not None:
    check_candidate(folder)

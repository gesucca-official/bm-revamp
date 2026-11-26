"""Read-only checks: published rules, set documents and catalog must match the reviewed baseline.

Regulation 1.13 (SB-2): the regulation (docs/game-rules.md) holds the general rules and the cards live in the set
documents (docs/sets/<id>.md), with their own version. `--root DIR` checks another copy of the repository, so a mismatch can be
tried on a temporary copy without touching the tracked files.

SB-28 (regulation 2.0, Set Base 1.0): the live catalog is generated from the set file by
`tools/set-catalog/set_catalog.py --vivo` (manifest docs/sets/manifest.json): the set document and its debug-client copy, the
annex (docs/rules-catalog.json), the SQLite catalog, the live set file and the test decks apart. It is checked as SB-26 checked the
candidate: the sheet (full text) and the short text are two fields, the sheet against the set document, the short text against
its generator, and every file must be what the generator writes now. The checks of the Set Base 0.1 (R07 tables, test contracts
against the document, nominal damage read from the Java sources) left with that set, archived in docs/history/set-base-0.1.md.

SB-26 (D175): `--candidate DIR` also checks a catalog of trial generated with `set_catalog.py --out DIR` (the folder's manifest
names the set files), for example with an expansion: one or more set documents, their annexes, the SQLite catalog and the
debug-client copies.
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
rules_version = re.search(r'^Versione \*\*([0-9.]+) —', rules_text, re.M)
assert rules_version, 'Missing regulation version'
rules_version = rules_version.group(1)
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
# SB-28: the set document says which regulation it requires (R00), the published one.
required = re.search(r'^Versione \*\*[0-9.]+ —[^\n]* Richiede il regolamento ([0-9.]+)\.$', set_text, re.M)
assert required and required.group(1) == rules_version, 'The set document must require the published regulation ' + rules_version
for entry in expected['cards'] + expected['characters'] + expected['tokens']:
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
NONE = '\u2014'
cost_names = {'V': 'VIOLENCE', 'A': 'ALERTNESS', 'T': 'TOXICITY', 'L': 'ALCOHOL', 'H': 'HEALTH'}  # H: costs in HEALTH (D27)
# R07a: descriptive roles, defined by the regulation; the set document lists one per card.
role_names = {'DAMAGE', 'DEFENSE', 'RESOURCES', 'COUNTER', 'DISRUPT', 'ITEMS', 'OTHER'}
regulation_roles = rules_text.split('## R07a — ', 1)[1].split('### Danno nominale', 1)[0]
assert {m.group(1) for m in re.finditer(r'^\| ([A-Z]+) \| ', regulation_roles, re.M)} == role_names, 'R07a role definitions differ'
spec = importlib.util.spec_from_file_location('set_catalog_check', root / 'tools/set-catalog/set_catalog.py')
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)


HEADING = re.compile(r'^#### (.+?) — (.+)$')
BINDING_LINE = re.compile(r'^`([^`]+)`(?: · classe `[^`]+`)?(?: · slot (\S+))?$')  # SB-34: «id · classe · slot»


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


def check_catalog(rel, place, live):
    """The catalog generated by set_catalog.py: `place(name)` is where the generator's file `name` is (live places or a folder)."""
    manifest = json.loads(place('manifest.json').read_text(encoding='utf-8'))
    for source in manifest['ingressi']:
        digest = hashlib.sha256((root / source['file']).read_bytes()).hexdigest()
        assert digest == source['sha256'], rel + ': ' + source['file'] + ' changed after the generation: regenerate the catalog'
    (files, cat, sets), _, _ = gen.run(manifest['argomenti'] + ['--root', str(root)])
    assert manifest['set'] == [s.id for s in sets], rel + ': sets of the manifest differ'
    assert ('--vivo' in manifest['argomenti']) == live, rel + ': a live catalog is generated with --vivo, a trial one without'
    all_annex = []
    for s in sets:
        sid, data = s.id, s.data
        where = place('sets/' + sid + '.md').relative_to(root).as_posix()
        doc = place('sets/' + sid + '.md').read_text(encoding='utf-8')
        assert doc == place('client-debug/sets/' + sid + '.md').read_text(encoding='utf-8'), where + ': client copy differs'
        title = re.match(r'# Botte Micidiali — (.+)\n', doc)
        version = re.search(r'^Versione \*\*([0-9.]+) —', doc, re.M)
        assert title and version and title.group(1) == data['set']['name'], where + ': title or version missing'
        annex_doc = json.loads(place('sets/' + sid + '.json').read_text(encoding='utf-8'))
        assert annex_doc['set'] == sid and annex_doc['version'] == version.group(1), where + ': annex set or version differs'
        sheets = parse_sheets(doc, where)
        entries = annex_doc['cards'] + annex_doc['characters'] + annex_doc['tokens']
        assert sorted(sheets) == sorted(e['class'] for e in entries), where + ': sheets and annex entries differ'
        r07a = {row[1].strip('`'): row for row in table_rows(
            doc, '| Carta | Identificatore | Ruolo | Guadagni a sé | Danno nominale | Importo nominale |')}
        assert sorted(r07a) == sorted(sheets), where + ': the R07a table must list every entry'
        chars = {p['id']: p for p in data.get('characters', [])}
        for e in entries:
            b, made = e['class'], cat.entries[e['class']]
            name, fields, paragraphs = sheets[b]
            assert name == e['name'] == made['name'], b + ': name differs between sheet, annex and set file'
            # The sheet: the full text of the annex as the set document shows it (placeholders as letters).
            # SB-30a (D203 (4)): the sheet of a character with botStyle ends with one more line, outside the full text.
            style = chars.get(b, {}).get('botStyle')
            if style:
                assert paragraphs and paragraphs[-1] == 'Stile del computer: ' + style + '.', b + ': computer style of the sheet differs from the set file'
                paragraphs = paragraphs[:-1]
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
    # SQLite: the schema of the live catalog (SB-28: with full text and flavour, D175 (1)), and the rows of every annex.
    with sqlite3.connect((root / 'server/src/main/resources/cards.sqlite').as_uri() + '?mode=ro', uri=True) as vivo, \
            sqlite3.connect(place('cards.sqlite').as_uri() + '?mode=ro', uri=True) as db:
        tables = [r[0] for r in vivo.execute("select name from sqlite_master where type='table' order by name")]
        assert tables == [r[0] for r in db.execute("select name from sqlite_master where type='table' order by name")], rel + ': SQLite tables differ from the live catalog'
        for table in tables:
            assert [c[1:3] for c in db.execute('pragma table_info(' + table + ')')] == [c[1:3] for c in vivo.execute('pragma table_info(' + table + ')')], \
                table + ': schema differs from the live one'
        assert [c[1] for c in db.execute('pragma table_info(CRD001_GUI)')][-2:] == ['T_GUI_FULL_TEXT', 'T_GUI_FLAVOUR'], 'CRD001_GUI without full text and flavour'
        assert db.execute('select * from CRD002_KEYWORDS order by 1').fetchall() == vivo.execute('select * from CRD002_KEYWORDS order by 1').fetchall(), \
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
    # Last, every file is what the generator writes now (SQLite by content, independent of the library); a trial folder holds
    # nothing else.
    if not live:
        folder = place('manifest.json').parent
        present = sorted(p.relative_to(folder).as_posix() for p in folder.rglob('*') if p.is_file())
        assert present == sorted(files), rel + ': files differ from the generation: ' + ', '.join(sorted(set(present) ^ set(files)))
    for name, data in files.items():
        mine = place(name).read_bytes()
        same = gen.sqlite_dump(mine) == gen.sqlite_dump(data) if name == gen.SQLITE else mine == data
        assert same, (place(name).relative_to(root).as_posix() + ': not what the generator writes from the set files: regenerate '
                      '(tools/set-catalog/set_catalog.py' + (' --vivo)' if live else ' --out)'))
    return sets, cat


# SB-28: the live catalog.
LIVE = {name: root / path for name, path in gen.LIVE_PATHS.items()}
assert LIVE['sets/base.md'] == set_doc and LIVE['sets/base.json'] == root / 'docs/rules-catalog.json', 'Live places differ from the generator'
sets, cat = check_catalog('catalogo vivo', LIVE.__getitem__, True)
assert [s.id for s in sets] == [set_id], 'The live catalog has the set of the set document only'
# The starters of the live set file: name and category (D182), in the vocabulary of the loader; no test deck in production.
live_file = json.loads(LIVE['set-file'].read_text(encoding='utf-8'))
categories = re.search(r'static final List<String> STARTER_CATEGORIES = List\.of\(([^)]*)\);', loader)
assert categories, 'Draft.java: STARTER_CATEGORIES not found'
categories = re.findall(r'"([a-z]+)"', categories.group(1))
assert live_file['decks'] and all(d.get('name') and d.get('category') in categories for d in live_file['decks']), \
    'Every deck of the live set file is a starter with name and category (D182)'
# Regulation 2.0 (D183 (3)): «Ultimo colpo» is not a rule; no live card may carry it.
assert not [c['binding'] for c in live_file['cards'] if c.get('lastBlow')], 'A live card carries «Ultimo colpo», not in regulation 2.0'
print('Regolamento ' + rules_version + ' e ' + set_title + ' ' + set_version + ' allineati alle copie client; il set richiede il regolamento '
      + rules_version + '; regolamento senza carte citate; ' + str(len(expected['characters'])) + ' personaggi, '
      + str(len(expected['cards'])) + ' carte e ' + str(len(expected['tokens'])) + ' token; schede uguali al testo completo, testo breve, '
      'guadagni e danno uguali al generatore di SB-25, numeri, rarità, mazzi e R07a uguali al file del set; ' + str(len(live_file['decks']))
      + ' starter con nome e categoria (' + ', '.join(categories) + '), conformi a R02; nessun «Ultimo colpo»; rarità ammesse ('
      + ', '.join(rarity_vocabulary) + ', anche nel caricatore delle bozze); SQLite integro; file identici alla generazione (--vivo).')


def candidate_folder():
    if '--candidate' not in sys.argv:
        return None
    i = sys.argv.index('--candidate') + 1
    assert i < len(sys.argv) and not sys.argv[i].startswith('--'), '--candidate needs a folder (SB-28: the SB-26 candidate became the live catalog)'
    return (root / sys.argv[i]).resolve()


folder = candidate_folder()
if folder is not None:
    rel = folder.relative_to(root).as_posix()
    sets, cat = check_catalog(rel, lambda name: folder / name, False)
    counts = ', '.join(s.id + ' ' + str(len([e for e in cat.entries.values() if e['set'] == s.id])) for s in sets)
    print('Catalogo di prova ' + rel + ': ' + str(len(sets)) + ' set (' + counts + ' voci); schede uguali al testo completo, '
          'testo breve, guadagni e danno uguali al generatore di SB-25, numeri, rarità, mazzi e R07a uguali al file del set, '
          'starter conformi a R02, SQLite con lo schema vivo, copie client e file identici alla generazione.')

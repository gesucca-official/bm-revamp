"""SB-2: check-rules.py must refuse a mismatch between set document, annex and catalog. Runs on temporary copies.

Usage: python docs/reports/set-base/sb-2/check-rules-mismatch.py .   (from the repository root)
"""
import shutil, sqlite3, subprocess, sys, tempfile, json
from pathlib import Path

repo = Path(sys.argv[1]).resolve()
PARTS = ['docs/game-rules.md', 'docs/sets', 'docs/rules-catalog.json', 'client-debug/src/assets/docs/rules.md',
         'client-debug/src/assets/docs/sets', 'server/src/test/resources/rules-v1-cards.tsv',
         'server/src/test/resources/rules-card-roles.tsv', 'server/src/test/resources/rules-card-types.tsv',
         'server/src/main/resources/cards.sqlite', 'server/src/main/java/com/gsc/bm/model/cards',
         'server/src/test/java/com/gsc/bm/sim/Draft.java']  # SB-6b: check-rules.py reads the loader's rarities


def copy():
    d = Path(tempfile.mkdtemp(prefix='sb2-drill-'))
    for part in PARTS:
        src, dst = repo / part, d / part
        dst.parent.mkdir(parents=True, exist_ok=True)
        (shutil.copytree if src.is_dir() else shutil.copyfile)(src, dst)
    return d


def run(d):
    r = subprocess.run([sys.executable, str(repo / 'scripts/check-rules.py'), '--root', str(d)], capture_output=True, text=True, encoding='utf-8', errors='replace')
    last = (r.stderr.strip().splitlines() or r.stdout.strip().splitlines() or [''])[-1]
    return r.returncode, last


def both(d, rel, old, new):
    for p in (d / rel, d / 'client-debug/src/assets/docs/sets' / Path(rel).name):
        t = p.read_text(encoding='utf-8'); assert old in t, old; p.write_text(t.replace(old, new, 1), encoding='utf-8', newline='\n')


def annex_version(d):
    p = d / 'docs/rules-catalog.json'; a = json.loads(p.read_text(encoding='utf-8')); a['version'] = '0.2'
    p.write_text(json.dumps(a, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sqlite_set(d):
    with sqlite3.connect(d / 'server/src/main/resources/cards.sqlite') as db:
        db.execute("update CRD001_GUI set C_SET='altro' where C_REF_CLASS='bruiser.Glare'")


def row_removed(d):
    for p in (d / 'docs/sets/base.md', d / 'client-debug/src/assets/docs/sets/base.md'):
        lines = p.read_text(encoding='utf-8').split('\n')
        lines = [l for l in lines if not l.startswith('| Glare | Azione |')]
        p.write_text('\n'.join(lines), encoding='utf-8', newline='\n')


def doc_version(d):
    both(d, 'docs/sets/base.md', 'Versione **0.1 —', 'Versione **0.2 —')


def client_copy(d):
    p = d / 'client-debug/src/assets/docs/sets/base.md'; p.write_text(p.read_text(encoding='utf-8') + 'x\n', encoding='utf-8')


def rarity(d):
    with sqlite3.connect(d / 'server/src/main/resources/cards.sqlite') as db:
        db.execute("update CRD001_GUI set C_RARITY='RARE' where C_REF_CLASS='bruiser.Glare'")


def card_in_rules(d):
    for p in (d / 'docs/game-rules.md', d / 'client-debug/src/assets/docs/rules.md'):
        t = p.read_text(encoding='utf-8'); p.write_text(t.replace('## R08 — ', 'Per esempio SuperImpact.\n\n## R08 — ', 1), encoding='utf-8', newline='\n')


cases = [('pulita', None), ('allegato 0.2 contro documento 0.1', annex_version), ('documento 0.2 contro allegato 0.1', doc_version),
         ('SQLite: Glare nel set «altro»', sqlite_set), ('riga di Glare tolta dalla tabella S3', row_removed),
         ('copia client del set diversa', client_copy), ('rarità in SQLite assente nell\'allegato', rarity),
         ('regolamento che cita SuperImpact', card_in_rules)]
ok = True
for name, change in cases:
    d = copy()
    if change: change(d)
    code, last = run(d)
    expect_ok = change is None
    good = (code == 0) == expect_ok
    ok &= good
    print(f'{"OK " if good else "KO "} {name}: exit {code} — {last}')
    shutil.rmtree(d, ignore_errors=True)
print('tutto come atteso' if ok else 'ATTESA VIOLATA')
sys.exit(0 if ok else 1)

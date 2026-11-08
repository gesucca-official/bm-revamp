"""SB-6b: check-rules.py must refuse a rarity vocabulary of the draft loader that differs from R07. Runs on temporary copies.

Usage: python docs/reports/set-base/sb-6b/check-rules-rarity.py .   (from the repository root)
"""
import shutil, subprocess, sys, tempfile
from pathlib import Path

repo = Path(sys.argv[1]).resolve()
PARTS = ['docs/game-rules.md', 'docs/sets', 'docs/rules-catalog.json', 'client-debug/src/assets/docs/rules.md',
         'client-debug/src/assets/docs/sets', 'server/src/test/resources/rules-v1-cards.tsv',
         'server/src/test/resources/rules-card-roles.tsv', 'server/src/test/resources/rules-card-types.tsv',
         'server/src/main/resources/cards.sqlite', 'server/src/main/java/com/gsc/bm/model/cards',
         'server/src/test/java/com/gsc/bm/sim/Draft.java']
DRAFT = 'server/src/test/java/com/gsc/bm/sim/Draft.java'
RULES = ['docs/game-rules.md', 'client-debug/src/assets/docs/rules.md']


def copy():
    d = Path(tempfile.mkdtemp(prefix='sb6b-drill-'))
    for part in PARTS:
        src, dst = repo / part, d / part
        dst.parent.mkdir(parents=True, exist_ok=True)
        (shutil.copytree if src.is_dir() else shutil.copyfile)(src, dst)
    return d


def run(d):
    r = subprocess.run([sys.executable, str(repo / 'scripts/check-rules.py'), '--root', str(d)], capture_output=True, text=True,
                       encoding='utf-8', errors='replace')
    last = (r.stdout + r.stderr).strip().splitlines()[-1]
    return r.returncode, last


def replace(d, part, old, new):
    p = d / part
    text = p.read_text(encoding='utf-8')
    assert text.count(old) == 1, (part, old)
    p.write_text(text.replace(old, new), encoding='utf-8', newline='\n')


def loader_mythic(d):
    replace(d, DRAFT, 'List.of("COMMON", "UNCOMMON", "RARE")', 'List.of("COMMON", "UNCOMMON", "RARE", "MYTHIC")')


def loader_order(d):
    replace(d, DRAFT, 'List.of("COMMON", "UNCOMMON", "RARE")', 'List.of("RARE", "UNCOMMON", "COMMON")')


def loader_missing(d):
    replace(d, DRAFT, 'static final List<String> RARITIES = ', 'static final List<String> RARITA = ')


def rules_epic(d):
    for part in RULES:
        replace(d, part, 'COMMON, UNCOMMON o RARE', 'COMMON, UNCOMMON, RARE o EPIC')


CASES = [('copia pulita', None), ('caricatore con MYTHIC in più', loader_mythic), ('caricatore in altro ordine', loader_order),
         ('caricatore senza RARITIES', loader_missing), ('regolamento con EPIC in più', rules_epic)]

if __name__ == '__main__':
    for name, change in CASES:
        d = copy()
        try:
            if change:
                change(d)
            code, last = run(d)
            print(('VERDE ' if code == 0 else 'RIFIUTO ') + name + ': ' + last)
        finally:
            shutil.rmtree(d, ignore_errors=True)

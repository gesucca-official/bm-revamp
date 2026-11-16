"""SB-17 Fase B3 (D114, D115): mutations of «Lo rivendo». Each mutation is applied, its tests run, the file is restored.
Run from the repository root with no other Java process: python docs/reports/set-base/sb-17/b3/mutations.py OUT.json
"""
import json, os, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
MAIN = ROOT / 'server/src/main/java/com/gsc/bm'
CARDS = MAIN / 'sim/DataCards.java'
BOT = MAIN / 'model/game/bot'
FIDELITY = 'TurnForecastFidelityTest,ViewTableFidelityTest'
MUTATIONS = [
    ('engine: the branches swapped (with and without the item)', CARDS,
     'for (Step step : sold != null ? seHai : seNo)', 'for (Step step : sold == null ? seHai : seNo)', 'Sb17CardsTest'),
    ('engine: no choice sells nothing instead of the oldest', CARDS,
     'if (choice == null) sold = items.peek();', 'if (choice == null) sold = null;', 'Sb17CardsTest'),
    ('engine: a chosen item gone at resolution falls back to the oldest', CARDS,
     'if (sold != null) items.remove(sold);', 'if (sold == null) sold = items.peek();\n        if (sold != null) items.remove(sold);',
     'Sb17CardsTest'),
    ('bots: the most valuable item instead of the least', BOT / 'BotView.java',
     'if (w < worth - 1e-9) { worth = w; cheapest = item; }', 'if (-w < worth - 1e-9) { worth = -w; cheapest = item; }', 'Sb17CardsTest'),
    ('forecast: both branches applied', BOT / 'TurnForecast.java',
     'if (!step.appliesAfterSale(sold)) continue;', '', 'Sb17CardsTest,' + FIDELITY),
    ('view table: both branches applied', BOT / 'ViewTable.java',
     'if (!step.appliesAfterSale(sold)) continue;', '', FIDELITY),
    ('loader: a sale with targets other than SELF accepted', CARDS,
     'if (!Set.of(Card.CardTarget.SELF).equals(targets))', 'if (!targets.contains(Card.CardTarget.SELF))', 'Sb17CardsTest'),
    ('loader: a sale inside anticipo accepted', CARDS,
     'step instanceof AnticipoStep || step instanceof VendiStep)', 'step instanceof AnticipoStep)', 'Sb17CardsTest'),
]


def mvn(test):
    manifest = json.loads((ROOT / 'scripts/toolchain.json').read_text(encoding='utf-8'))
    tool = {t['name']: t['directory'] for t in manifest['tools']}
    java = ROOT / '.tools' / tool['java']
    env = dict(os.environ, JAVA_HOME=str(java))
    env['PATH'] = str(java / 'bin') + ';' + env['PATH']
    cmd = [str(ROOT / '.tools' / tool['maven'] / 'bin/mvn.cmd'), '-s', str(ROOT / 'scripts/maven-settings.xml'),
           f'-Dmaven.repo.local={ROOT / ".tools/m2"}', '-B', '-o', 'test', f'-Dtest={test}']
    r = subprocess.run(cmd, cwd=ROOT / 'server', env=env, capture_output=True, text=True, encoding='utf-8', errors='replace')
    fails = [l for l in r.stdout.splitlines() if l.startswith('[ERROR]   ') or 'Tests run:' in l and 'Fail' in l]
    return r.returncode, fails[-4:]


def main(out):
    results = []
    for name, path, old, new, tests in MUTATIONS:
        text = path.read_text(encoding='utf-8')
        assert text.count(old) == 1, name
        path.write_text(text.replace(old, new), encoding='utf-8', newline='')
        try:
            t = time.time()
            code, fails = mvn(tests)
        finally:
            path.write_text(text, encoding='utf-8', newline='')
        results.append({'mutation': name, 'file': path.name, 'tests': tests, 'killed': code != 0,
                        'seconds': round(time.time() - t, 1), 'failures': [f[:300] for f in fails]})
        print(name, 'killed' if code != 0 else 'SURVIVED', flush=True)
    Path(out).write_text(json.dumps({'note': 'SB-17 B3 (D114, D115), tests per mutation of Lo rivendo', 'results': results},
                                    ensure_ascii=False, indent=1), encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1])

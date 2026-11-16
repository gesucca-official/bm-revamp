"""SB-17 Fase B4 (D118): mutations of «Lo rivendo» basic and «Fare il vago». Each mutation is applied, its tests run, the file is
restored. Run from the repository root with no other Java process: python docs/reports/set-base/sb-17/b4/mutations.py OUT.json
"""
import json, os, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
MAIN = ROOT / 'server/src/main/java/com/gsc/bm'
CARDS = MAIN / 'sim/DataCards.java'
BOT = MAIN / 'model/game/bot'
FIDELITY = 'TurnForecastFidelityTest,ViewTableFidelityTest'
MUTATIONS = [
    ('engine: the proceeds with the item gone at resolution', CARDS,
     '''            if (sold == null) {
                report.add("Nothing to sell");
                return report;
            }
            report.add("Sold Item " + sold.getName());''',
     '''            report.add(sold == null ? "Nothing to sell" : "Sold Item " + sold.getName());''', 'Sb17CardsTest'),
    ('engine: the targeted item gone at resolution falls back to the oldest', CARDS,
     'if (sold != null) items.remove(sold);', 'if (sold == null) sold = items.peek();\n        if (sold != null) items.remove(sold);',
     'Sb17CardsTest'),
    ('bots: the most valuable item instead of the least', BOT / 'BotView.java',
     'if (w < worth - 1e-9) { worth = w; cheapest = item; }', 'if (-w < worth - 1e-9) { worth = -w; cheapest = item; }', 'Sb17CardsTest'),
    ('bots: one move per item instead of a single sale', BOT / 'BotView.java',
     'if (sale != null) {', 'if (sale != null && false) {', 'Sb17CardsTest'),
    ('loader: a sale in a bound accepted', CARDS,
     '''if (kind == Kind.BOUND) throw invalid(where + "non è ammesso in una bound: una bound non può bersagliare oggetti");
                if (!basic) throw''', 'if (!basic && kind != Kind.BOUND) throw', 'Sb17CardsTest'),
    ('forecast and view table: the targeted item not removed', BOT / 'TurnForecast.java',
     '''                items.remove(i);
                return true;''', '''                return true;''', 'Sb17CardsTest,' + FIDELITY),
    ('bots: the parry of a bound ignored by the forecast', BOT / 'TurnForecast.java',
     'if (step.getDamageType() != null && step.getFactor() != null)',
     'if (step.getDamageType() != null && step.getFactor() != null && !act.card.isCharacterBound())', 'Sb17CardsTest,' + FIDELITY),
    ('styles: the item\'s own text counted in a sale', BOT / 'StyleSupport.java',
     'if (usesItem && !sells)', 'if (usesItem)', 'Sb17CardsTest,' + FIDELITY),
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
    Path(out).write_text(json.dumps({'note': 'SB-17 B4 (D118), tests per mutation of Lo rivendo basic and Fare il vago',
                                     'results': results}, ensure_ascii=False, indent=1), encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1])

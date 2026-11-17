"""SB-18 Fase B2 (D126 (2)): mutations of the unlockedDamage fix and of the HEALTH cost. Each mutation is applied, the tests of the fix and
of Duccio's cards run, the file is restored. From the repository root with no other Java process:
python docs/reports/set-base/sb-18/b2/mutations.py OUT.json
"""
import json, os, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
GAME = ROOT / 'server/src/main/java/com/gsc/bm/model/game'
STYLE = GAME / 'bot/StyleSupport.java'
TESTS = 'UnlockedDamageHealthTest,Sb18CardsTest'
MUTATIONS = [
    ('fix reverted: HEALTH paid at equality under d50', STYLE,
     'return card.isLastBlow() || have > cost;', 'return card.isLastBlow() || have >= cost;'),
    ('«Ultimo colpo» not always payable', STYLE,
     'return card.isLastBlow() || have > cost;', 'return have > cost;'),
    ('the d50 reading also under the live rules', STYLE,
     'if (resource == Resource.HEALTH && view.getRuleset().playground())', 'if (resource == Resource.HEALTH)'),
    ('other resources need more than the cost', STYLE,
     '            return have >= cost;\n        }', '            return have > cost;\n        }'),
    ('engine: HEALTH cost paid down to zero', GAME / 'Move.java',
     '|| card.isLastBlow() || health > cost;', '|| card.isLastBlow() || health >= cost;'),
    ('BotView: HEALTH cost offered at equality', GAME / 'bot/BotView.java',
     '|| card.lastBlow || self.seat.resource(Resource.HEALTH) > health;', '|| card.lastBlow || self.seat.resource(Resource.HEALTH) >= health;'),
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
    fails = [l for l in r.stdout.splitlines() if l.startswith('[ERROR]   ')]
    return r.returncode, fails[:4]


def main(out):
    results = []
    for name, path, old, new in MUTATIONS:
        text = path.read_text(encoding='utf-8')
        assert text.count(old) == 1, name
        path.write_text(text.replace(old, new), encoding='utf-8', newline='')
        try:
            t = time.time()
            code, fails = mvn(TESTS)
        finally:
            path.write_text(text, encoding='utf-8', newline='')
        results.append({'mutation': name, 'file': path.name, 'killed': code != 0, 'seconds': round(time.time() - t, 1),
                        'failures': [f[:300] for f in fails]})
        print(name, 'killed' if code != 0 else 'SURVIVED')
    Path(out).write_text(json.dumps({'note': 'SB-18 B2 (D126), ' + TESTS + ' per mutation', 'results': results}, ensure_ascii=False,
                                    indent=1), encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1])

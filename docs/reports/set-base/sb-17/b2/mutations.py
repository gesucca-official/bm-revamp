"""SB-17 Fase B2 (D111): mutations of the BotView/TurnForecast fix. Each mutation is applied, the two fidelity tests run, the file
is restored. Run from the repository root with no other Java process: python docs/reports/set-base/sb-17/b2/mutations.py OUT.json
"""
import json, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
BOT = ROOT / 'server/src/main/java/com/gsc/bm/model/game/bot'
MUTATIONS = [
    ('forecast ignores the consumed text', BOT / 'TurnForecast.java',
     'PrintedEffects text = item.consumedEffects();', 'PrintedEffects text = item.getEffects();'),
    ('consumed text given to non-items only', BOT / 'BotView.java',
     'effects == null && card.isItem() ? PrintedEffects.consumedText(card)', 'effects == null && !card.isItem() ? PrintedEffects.consumedText(card)'),
    ('consumed text preferred to the printed effects', BOT / 'BotView.java',
     'return effects != null ? effects : consumed;', 'return consumed;'),
]


def mvn(test):
    manifest = json.loads((ROOT / 'scripts/toolchain.json').read_text(encoding='utf-8'))
    tool = {t['name']: t['directory'] for t in manifest['tools']}
    java = ROOT / '.tools' / tool['java']
    env = dict(__import__('os').environ, JAVA_HOME=str(java))
    env['PATH'] = str(java / 'bin') + ';' + env['PATH']
    cmd = [str(ROOT / '.tools' / tool['maven'] / 'bin/mvn.cmd'), '-s', str(ROOT / 'scripts/maven-settings.xml'),
           f'-Dmaven.repo.local={ROOT / ".tools/m2"}', '-B', '-o', 'test', f'-Dtest={test}']
    r = subprocess.run(cmd, cwd=ROOT / 'server', env=env, capture_output=True, text=True, encoding='utf-8', errors='replace')
    fails = [l for l in r.stdout.splitlines() if l.startswith('[ERROR]   ') or 'Tests run:' in l and 'Fail' in l]
    return r.returncode, fails[-4:]


def main(out):
    results = []
    for name, path, old, new in MUTATIONS:
        text = path.read_text(encoding='utf-8')
        assert text.count(old) == 1, name
        path.write_text(text.replace(old, new), encoding='utf-8', newline='')
        try:
            t = time.time()
            code, fails = mvn('TurnForecastFidelityTest,ViewTableFidelityTest')
        finally:
            path.write_text(text, encoding='utf-8', newline='')
        results.append({'mutation': name, 'file': path.name, 'killed': code != 0, 'seconds': round(time.time() - t, 1),
                        'failures': [f[:300] for f in fails]})
        print(name, 'killed' if code != 0 else 'SURVIVED')
    Path(out).write_text(json.dumps({'note': 'SB-17 B2 (D111), fidelity tests per mutation', 'results': results}, ensure_ascii=False,
                                    indent=1), encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1])

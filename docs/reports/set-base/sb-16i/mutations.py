"""SB-16i Fase B (D97): mutations on the new branches. Each one patches a source file, runs the SB-16i unit tests and must
make at least one of them fail; the source is restored after every run. Usage, from the repository root:
    python docs/reports/set-base/sb-16i/mutations.py OUT.json
Uses the checkout's JDK and Maven (offline). Never run it together with a measure.
"""
import json, os, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SERVER = ROOT / 'server'
MAIN = SERVER / 'src/main/java/com/gsc/bm'
TESTS = 'Sb16iRulesTest,Sb16iBotsTest'
M = [
    ('names-order', 'model/game/Game.java', 'return now.isEmpty() ? null : now.get(0);', 'return now.isEmpty() ? null : now.get(now.size() - 1);'),
    ('names-availability', 'model/game/Game.java',
     'for (String name : names) if (self.getDeck().stream().anyMatch(c -> c.getBindingName().equals(name))) now.add(name);',
     'now.addAll(names);'),
    ('choice-ignored', 'model/game/Game.java', 'if (m.getSearchChoice() != null && now.contains(m.getSearchChoice())) return m.getSearchChoice();', ''),
    ('shuffle-never', 'model/game/Game.java', 'if (self.getCharacter().searchShuffle()) Collections.shuffle', 'if (false) Collections.shuffle'),
    ('shuffle-always', 'model/game/Game.java', 'if (self.getCharacter().searchShuffle()) Collections.shuffle', 'if (true) Collections.shuffle'),
    ('ahead-same-group', 'model/game/Game.java', 'if (target.equals(other.getPlayerId()) && !speed.get(other).equals(speed.get(m))) return true;',
     'if (target.equals(other.getPlayerId())) return true;'),
    ('ahead-priority-only', 'model/game/Game.java', 'if (target.equals(other.getPlayerId()) && !speed.get(other).equals(speed.get(m))) return true;',
     'if (target.equals(other.getPlayerId()) && (speed.get(other) >> 32) != (speed.get(m) >> 32)) return true;'),
    ('ahead-without-move', 'model/game/Game.java', '''            if (target.equals(other.getPlayerId()) && !speed.get(other).equals(speed.get(m))) return true;
        }
        return false;''', '''            if (target.equals(other.getPlayerId()) && !speed.get(other).equals(speed.get(m))) return true;
        }
        return mine == pendingMoves.size() - 1;'''),
    ('ahead-own-move-voided', 'model/game/Game.java', 'boolean ahead = keywordAhead && !m.isVoid() && aheadOfTarget(m, speed);',
     'boolean ahead = keywordAhead && aheadOfTarget(m, speed);'),
    ('counter-skips-voided', 'model/game/Game.java', '                self.getCharacter().countPlay(m.getPlayedCardName());',
     '                if (!m.isVoid()) self.getCharacter().countPlay(m.getPlayedCardName());'),
    ('perplay-zero-grows', 'sim/DataCards.java', ') + perPlay * plays;', ') + (perPlay == 0 ? plays : perPlay * plays);'),
    ('bot-choice-ignores-payment', 'model/game/bot/BotView.java', '        if (aPays != bPays) return aPays;\n', ''),
    ('bot-toxicity-ignored', 'model/game/bot/StyleSupport.java',
     'if (st.getResource() == Resource.TOXICITY && st.getKind() == PrintedEffects.Kind.EMPTY) removed = toxicity;',
     'if (false) removed = toxicity;'),
    ('forecast-ahead-same-group', 'model/game/bot/TurnForecast.java', '\n                            && order.get(j).speed != order.get(i).speed) order.get(i).ahead = true;',
     ') order.get(i).ahead = true;'),
    ('table-counter-frozen', 'model/game/bot/ViewTable.java',
     '            act.author.plays.merge(act.play.card.getName().toLowerCase(java.util.Locale.ROOT), 1, Integer::sum);\n', ''),
]


def run_tests():
    java = ROOT / '.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
    env = dict(os.environ, JAVA_HOME=str(java), PATH=str(java / 'bin') + os.pathsep + os.environ['PATH'])
    mvn = str(ROOT / '.tools/apache-maven-3.6.3/bin/mvn.cmd')
    cmd = [mvn, '-s', str(ROOT / 'scripts/maven-settings.xml'), f'-Dmaven.repo.local={ROOT / ".tools/m2"}', '-B', '-o', '-q', 'test',
           f'-Dtest={TESTS}', '-DfailIfNoTests=false']
    p = subprocess.run(cmd, cwd=SERVER, env=env, capture_output=True, text=True, encoding='utf-8', errors='replace')
    failed = [l.strip() for l in p.stdout.splitlines() if l.startswith('[ERROR]   ') or 'FAILURE!' in l]
    return p.returncode, failed


def main(out):
    results = []
    code, _ = run_tests()
    assert code == 0, 'the SB-16i tests must be green before mutating'
    for name, rel, old, new in M:
        path = MAIN / rel
        source = path.read_bytes()
        text = source.decode('utf-8')
        assert text.count(old) == 1, (name, text.count(old))
        path.write_bytes(text.replace(old, new).encode('utf-8'))
        started = time.time()
        try:
            code, failed = run_tests()
        finally:
            path.write_bytes(source)
        results.append({'mutation': name, 'file': rel, 'detected': code != 0, 'failures': failed[:4], 'seconds': round(time.time() - started, 1)})
        print(name, 'detected' if code != 0 else 'NOT DETECTED', flush=True)
    code, _ = run_tests()
    summary = {'tests': TESTS, 'mutations': results, 'detected': sum(r['detected'] for r in results), 'total': len(results),
               'greenAfterRestore': code == 0}
    Path(out).write_text(json.dumps(summary, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    return 0 if summary['detected'] == summary['total'] and summary['greenAfterRestore'] else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))

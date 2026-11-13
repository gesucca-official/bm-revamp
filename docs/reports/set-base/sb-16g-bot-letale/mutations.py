# D76: six mutations of the forecast; each must make at least one test fail. Run from the repository root, with
# JAVA_HOME set to the JDK of .tools (see the report); the source is always restored.
import io, os, re, subprocess
F = 'server/src/main/java/com/gsc/bm/model/game/bot/TurnForecast.java'
MVN = [os.path.abspath('.tools/apache-maven-3.6.3/bin/mvn.cmd'), '-f', 'server/pom.xml', '-s', 'scripts/maven-settings.xml',
       '-Dmaven.repo.local=.tools/m2', '-B', '-o', 'test', '-Dtest=LethalAwarePolicyTest,TurnForecastFidelityTest']
MUTATIONS = {
    'armour off': ('if (type == Damage.DamageType.HIT && subject.get(Resource.ALCOHOL) > 0)', 'if (false)'),
    'no void when down': ('if (downAtGroupStart.contains(act.author) && act.target != act.author && !act.card.isLastBlow()) act.voided = true;', ''),
    'search never finds': ('boolean hit = act.mine ? found : theyFind;', 'boolean hit = false;'),
    'no restriction': ('return kills.isEmpty() ? pool : kills;', 'return legal;'),
    'statuses ignored': ('{ type = m.turn(type); damage = m.apply(damage); }', '{ }'),
    'no periodic poison': ('if (b.upAtStart && !b.toxicImmune && b.get(Resource.TOXICITY) > 0)', 'if (false)'),
}
orig = io.open(F, encoding='utf-8', newline='').read()
results = {}
try:
    for name, (a, b) in MUTATIONS.items():
        assert a in orig, name
        io.open(F, 'w', encoding='utf-8', newline='').write(orig.replace(a, b))
        out = subprocess.run(MVN, capture_output=True, text=True, encoding='utf-8', errors='replace').stdout
        results[name] = sorted(set(re.findall(r'^\[ERROR\]\s+(\w+Test\.\w+)', out, re.M)))
        print(name, '->', len(results[name]), results[name], flush=True)
finally:
    io.open(F, 'w', encoding='utf-8', newline='').write(orig)
print('restored')

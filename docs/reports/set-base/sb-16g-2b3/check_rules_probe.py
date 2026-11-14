"""SB-16g step 3 (D88): what scripts/check-rules.py reads from the code, card by card, without its final assertions.
Usage: python check_rules_probe.py SCRIPT ROOT OUTPUT_JSON
Runs SCRIPT up to its R07a damage loop with --root ROOT, then writes {class: [amount read from the code, source lines]} for
every card of the catalog. Used to show that the D88 exception changes nothing but the blood drain's zero live parameter."""
import json, sys

script, root, out = sys.argv[1:4]
source = open(script, encoding='utf-8').read()
marker = '\nfor entry in entries:\n    name = entry[\'class\'].split(\'.\')[-1]\n    damage, amount = damages[name]'
assert source.count(marker) == 1, 'damage loop not found'
source = source[:source.index(marker)]
source += '''
_probe = {}
for entry in entries:
    if entry['type'] == 'Personaggio':
        continue
    try:
        _probe[entry['class']] = list(amount_from_code(entry))
    except AssertionError as error:
        _probe[entry['class']] = ['AssertionError: ' + str(error), []]
json.dump(_probe, open(_OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
'''
sys.argv = [script, '--root', root]
scope = {'__name__': '__main__', '__file__': script, '_OUT': out}
exec(compile('import json\n' + source, script, 'exec'), scope)
print('cards probed:', len(json.load(open(out, encoding='utf-8'))))

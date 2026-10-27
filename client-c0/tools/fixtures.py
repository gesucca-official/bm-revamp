"""Snapshot scritti a mano: NON invoca o replica la risoluzione delle regole.
I testi sono estratti in sola lettura con lo stesso involucro della CardFactory.
Metadati trascritti dai costruttori Java delle sole carte usate in C0.
"""
from pathlib import Path
import copy
import hashlib
import json
import sqlite3

ROOT = Path(__file__).resolve().parents[2]
DB = ROOT / 'server/src/main/resources/cards.sqlite'
con = sqlite3.connect(DB.as_uri() + '?mode=ro', uri=True)
keywords = dict(con.execute('select C_KEYWORD,T_HTML from CRD002_KEYWORDS'))
characters = dict(con.execute('select C_REF_CLASS,T_GUI_NAME from CRD003_CHARACTERS'))

def source_exists(binding):
    source = ROOT / 'server/src/main/java/com/gsc/bm/model/cards' / (binding.replace('.', '/') + '.java')
    assert source.exists(), binding

def card(binding, targets=(), cost=None, priority=1, basic=False, bound=None):
    source_exists(binding)
    if bound:
        assert bound in characters
        source_exists(bound)
    name, description = con.execute('select T_GUI_NAME,T_GUI_DESCRIPTION from CRD001_GUI where C_REF_CLASS=?', (binding,)).fetchone()
    effect = ''.join('<p>' + keywords[k] + '</p>' for k, yes in [
        ('basicAction', basic), ('fallbackMove', bool(bound)),
        ('firstStrike', priority > 1), ('lastStrike', priority < 1)] if yes)
    return dict(name=name, bindingName=binding, effect=effect + '<p>' + description + '</p>',
                item='.items.' in binding, basicAction=basic, lastResort=False,
                characterBound=bool(bound), boundToCharacter=bound, priority=priority,
                canTarget=list(targets), cost=cost or {}, image=None, sprite=None)

grab = card('com.basic.BruiserGrab', ['NEAR_ITEM'], priority=-1, basic=True)
bound = card('bruiser.character.LittleSmack', ['OPPONENT'], bound='bruiser.character.BigBadBruiser')
long = card('bruiser.WhatchaDoin', ['OPPONENT'], {'VIOLENCE': 10, 'ALERTNESS': 10}, 2)
steal = card('com.Steal', ['FAR_ITEM'], {'ALERTNESS': 10}, 0)
impact = card('bruiser.SuperImpact', ['OPPONENT'], {'VIOLENCE': 25}, 0)
beer = card('com.items.RottenBeer', ['SELF'])
cocktail = card('com.items.MarvelousCocktail', ['SELF'])
other_beer = card('com.items.AnotherRottenBeer', ['SELF'])
stone = dict(name='MADE OF STONE', description='Cut Damage Taken: x0.5', type='GOOD',
             flow='INPUT', impactedProperty='CUT', lastsForTurns=3, equip=False,
             singleUse=False, amountFunction={}, typeFunction={})

def player(pid, junkie=False):
    binding = 'junkie.character.ToxicJunkie' if junkie else 'bruiser.character.BigBadBruiser'
    source_exists(binding)
    return dict(playerId=pid, cardsInHand=6, deck=12, character=dict(
        name=characters[binding], bindingName=binding,
        dead=False, itemsSize=3 if junkie else 1, items=[],
        resources=dict(HEALTH=100, ALERTNESS=35 if junkie else 20,
                       **({'TOXICITY': 10} if junkie else {'VIOLENCE': 25})),
        statuses=[], immunities=['TOXICITY'] if junkie else [], timers=[], sprite=None))

players = {pid: player(pid, pid in ['Bice', 'Dado']) for pid in ['Ada', 'Bice', 'Ciro', 'Dado', 'Enea']}
players['Ada']['cardsInHand'] = [grab, bound, long, steal, impact, copy.deepcopy(impact)]
players['Ada']['character']['resources']['HEALTH'] = 120
players['Ada']['character']['statuses'] = [stone]
players['Bice']['character']['items'] = [beer, copy.deepcopy(beer), cocktail]
players['Ciro']['character']['items'] = [other_beer]
players['Dado']['character']['timers'] = [dict(name='Bad Trip', timer=2, callback={})]
players['Dado']['character']['immunities'] = []
before = dict(gameId='c0-synthetic-ffa', players=players, resolvedMoves=[],
              timeBasedEffects={}, over=False, winner='NONE', turn=7, pendingMove=None,
              forfeits={}, moveDeadlines={p:1893456030000 for p in players},
              reconnectDeadlines={}, outcomeReason=None)

def move(binding, author, target, choices=None, report=None):
    return dict(playedCardName=binding['name'], playerId=author, targetId=target,
                gameId=before['gameId'], choices=choices, void=False, moveReport=report or {})

pending = copy.deepcopy(before)
pending['pendingMove'] = move(steal, 'Ada', 'Bice', {'TARGET_ITEM':beer['name']})
del pending['moveDeadlines']['Ada']
# Valori finali precostituiti: nessun calcolo degli effetti nel client/generatore.
after = copy.deepcopy(before)
after['turn'] = 8
after['players']['Ada']['character']['items'] = [beer]
after['players']['Bice']['character']['items'] = [beer, cocktail]
after['players']['Ada']['character']['resources'] = dict(HEALTH=80, ALERTNESS=10, VIOLENCE=25)
after['players']['Ada']['character']['statuses'][0]['lastsForTurns'] = 2
after['resolvedMoves'] = [move(steal, 'Ada', 'Bice', {'TARGET_ITEM':beer['name']}, {'SELF':['Stolen Peroni da 66, calda from Bice']}),
                          move(impact, 'Ciro', 'Ada', report={'OPPONENT':['Lost 40 HEALTH']})]
after['moveDeadlines'] = {p:1893456060000 for p in players}
clock = copy.deepcopy(before)
clock['reconnectDeadlines'] = {'Dado':1893456020000}
edge = copy.deepcopy(after)
edge['players']['Enea']['character']['dead'] = True
edge['players']['Enea']['character']['resources']['HEALTH'] = -5
edge['forfeits'] = {'Dado':'leave'}
edge['moveDeadlines'] = {p:1893456060000 for p in ['Ada','Bice','Ciro']}
fixtures = dict(before=before, after=after, pending=pending, clock=clock, edge=edge)
out = ROOT / 'client-c0/src/fixtures.ts'
out.write_text('// Generato da tools/fixtures.py; testi dal catalogo, art esclusa.\nimport {View} from "./contracts";\nexport const fixtures = ' + json.dumps(fixtures, ensure_ascii=False, indent=2) + ' satisfies Record<string, View>;\n', encoding='utf-8')
print('Fixture scritte. SHA256 catalogo (sola lettura):', hashlib.sha256(DB.read_bytes()).hexdigest())

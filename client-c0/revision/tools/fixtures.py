"""Read-only catalog extraction; fixed DTO snapshots, never a local resolver."""
from pathlib import Path
import sqlite3, json, copy
ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parents[1] / 'src'
OUT.mkdir(exist_ok=True)
db = sqlite3.connect((ROOT/'server/src/main/resources/cards.sqlite').as_uri()+'?mode=ro',uri=True)
chars = dict(db.execute('select C_REF_CLASS,T_GUI_NAME from CRD003_CHARACTERS'))
keywords = dict(db.execute('select C_KEYWORD,T_HTML from CRD002_KEYWORDS'))
def card(binding, targets, cost=None, priority=1, basic=False, bound=False):
    name, effect = db.execute('select T_GUI_NAME,T_GUI_DESCRIPTION from CRD001_GUI where C_REF_CLASS=?',(binding,)).fetchone()
    prefix = ''.join('<p>'+keywords[k]+'</p>' for k,yes in [('basicAction',basic),('fallbackMove',bound),('firstStrike',priority>1),('lastStrike',priority<1)] if yes)
    return dict(name=name,bindingName=binding,effect=prefix+'<p>'+effect+'</p>',item='.items.' in binding,basicAction=basic,lastResort=False,characterBound=bound,boundToCharacter='bruiser.character.BigBadBruiser' if bound else None,priority=priority,canTarget=targets,cost=cost or {},image=None,sprite=None)
cards = {
 'grab':card('com.basic.BruiserGrab',['NEAR_ITEM'],priority=-1,basic=True),
 'bound':card('bruiser.character.LittleSmack',['OPPONENT'],bound=True),
 'stop':card('bruiser.YouStop',['OPPONENT'],{'VIOLENCE':5},2),
 'steal':card('com.Steal',['FAR_ITEM'],{'ALERTNESS':10},0),
 'glare':card('bruiser.Glare',['SELF'],priority=0),
 'long':card('bruiser.WhatchaDoin',['OPPONENT'],{'VIOLENCE':10,'ALERTNESS':10},2),
 'impact':card('bruiser.SuperImpact',['OPPONENT'],{'VIOLENCE':25},0),
 'beer':card('com.items.RottenBeer',['SELF']),
 'green':card('com.items.AnotherRottenBeer',['SELF']),
 'negroni':card('com.items.CocktailOnTheGround',['SELF']),
 'cocktail':card('com.items.MarvelousCocktail',['SELF'])
}
players={}
for pid,junkie,hp,items in [('Tu',False,120,['negroni']),('Bice',True,68,['beer','beer','cocktail']),('Ada',False,91,['green']),('Nino',True,54,['green','negroni','cocktail']),('Tito',False,76,['negroni'])]:
    binding=('junkie.character.ToxicJunkie' if junkie else 'bruiser.character.BigBadBruiser')
    players[pid]=dict(playerId=pid,cardsInHand=6,deck=12,character=dict(name=chars[binding],bindingName=binding,dead=False,itemsSize=3 if junkie else 1,items=[copy.deepcopy(cards[i]) for i in items],resources=dict(HEALTH=hp,ALERTNESS=35 if junkie else 20,VIOLENCE=0 if junkie else 25,TOXICITY=10 if junkie else 0,ALCOHOL=0),statuses=[],immunities=['TOXICITY'] if junkie else [],timers=[],sprite=None))
players['Tu']['cardsInHand']=[copy.deepcopy(cards[i]) for i in ['grab','bound','stop','steal','steal','glare']]
players['Tu']['character']['statuses']=[dict(name='MADE OF STONE',description='Cut Damage Taken: x0.5',type='GOOD',flow='INPUT',impactedProperty='CUT',lastsForTurns=3,equip=False,singleUse=False,amountFunction={},typeFunction={})]
players['Nino']['character']['timers']=[dict(name='Bad Trip',timer=2,callback={})]
players['Nino']['character']['immunities']=[]
before=dict(gameId='c0-r2-synthetic-ffa',players=players,resolvedMoves=[],timeBasedEffects={},over=False,winner='NONE',turn=7,pendingMove=None,forfeits={},moveDeadlines={p:1893456030000 for p in players},reconnectDeadlines={},outcomeReason=None)
after=copy.deepcopy(before)
after['turn']=8
after['players']['Ada']['character']['resources']['VIOLENCE']=0
after['players']['Ada']['deck']=11
after['players']['Tu']['deck']=11
after['players']['Tu']['character']['resources'].update(HEALTH=80,ALERTNESS=10)
after['players']['Tu']['character']['statuses'][0]['lastsForTurns']=2
after['players']['Bice']['character']['items']=[cards['beer'],cards['cocktail']]
after['players']['Tu']['character']['items']=[cards['beer']]
after['players']['Tu']['cardsInHand'][3]=cards['long']
after['players']['Nino']['character']['resources']['HEALTH']=49
after['players']['Nino']['character']['timers'][0]['timer']=1
after['timeBasedEffects']={'Nino':['Lost 5 HEALTH from TOXICITY']}
after['resolvedMoves']=[dict(playedCardName=cards['steal']['name'],playerId='Tu',targetId='Bice',gameId=before['gameId'],choices={'TARGET_ITEM':cards['beer']['name']},void=False,moveReport={'SELF':['Stolen Peroni da 66, calda from Bice']}),dict(playedCardName=cards['impact']['name'],playerId='Ada',targetId='Tu',gameId=before['gameId'],choices=None,void=False,moveReport={'OPPONENT':['Lost 40 HEALTH']})]
(OUT/'fixtures.json').write_text(json.dumps(dict(cards=cards,before=before,after=after),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'contracts.ts').write_text((ROOT/'client-c0/src/contracts.ts').read_text(encoding='utf-8'),encoding='utf-8')
print('Read-only catalog extraction; synthetic snapshots written.')

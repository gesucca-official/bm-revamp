"""Verify loaded lists against the approved proposal 1.3 and the 120 grid slots, without rewriting either."""
from pathlib import Path
from collections import Counter
import json,re,hashlib
root=Path(__file__).resolve().parents[4]
d=json.loads((root/'server/src/test/resources/set-base/bozza.json').read_text(encoding='utf-8'))
proposal=(root/'docs/design/set-base/sb-16g-proposta.md').read_text(encoding='utf-8').split('## Liste complete e conto delle 120 carte')[1].split('I titoli distinti finali')[0]
cards={c['binding']:c for c in d['cards']}
names=['Spazienzio','Mara','Celestina','Piera','Beppe'];result=[]
for name,deck in zip(names,d['decks']):
    row=next(l for l in proposal.splitlines() if l.startswith('| '+name+' |')).split('|')[2:5]
    expected={}
    for cell in row:
        cell=re.sub(r'\s*\(\*\*\d+\*\*\)\s*','',cell)
        for entry in cell.strip().split(';'):
            match=re.fullmatch(r'\s*(.*?) (\d+)\s*',entry);assert match,entry
            expected[match[1]]=int(match[2])
    actual={cards[b]['gui']['name']:v for b,v in deck['cards'].items()}
    assert expected==actual,(name,expected,actual)
    assert sum(actual.values())==20 and max(actual.values())==2
    result.append({'starter':name,'regular':20,'distinct':len(actual),'copiesByRarity':dict(Counter({r:sum(v for b,v in deck['cards'].items() if cards[b]['rarity']==r) for r in ['COMMON','UNCOMMON','RARE']}))})
grid=(root/'docs/design/set-base/griglia.md').read_text(encoding='utf-8')
slots={}
for line in grid.splitlines():
    fields=[f.strip() for f in line.split('|')]
    if len(fields)<3 or not re.fullmatch(r'(PG-[A-Z]{3}|[A-Z]{3}-(BA|BO\d|AR\d)|LR-[A-Z]{3}|GEN-\d+|OGG-\d+)',fields[1]):continue
    rarity=[f for f in fields if f in ['C','NC','R']]
    if rarity:
        assert fields[1] not in slots,fields[1]
        slots[fields[1]]=rarity[0]
assert len(slots)==120,len(slots)
assert Counter(slots.values())==Counter(C=45,NC=55,R=20)
for c in d['cards']:
    slot=c['gui']['description'].split()[0]
    assert slots[slot]=={'COMMON':'C','UNCOMMON':'NC','RARE':'R'}[c['rarity']],slot
output={'proposal':'1.3','decision':'D79','gridSlots':120,'gridRarities':dict(Counter(slots.values())),'loadedCards':len(cards),'characters':len(d['characters']),'decks':result,'draftByteSha256':hashlib.sha256((root/'server/src/test/resources/set-base/bozza.json').read_bytes()).hexdigest()}
target=Path(__file__).with_name('validation.json');target.write_text(json.dumps(output,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps(output,ensure_ascii=False))

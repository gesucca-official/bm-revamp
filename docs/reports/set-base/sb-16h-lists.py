"""Read-only audit: every resource count against every row of proposal 0.1 (D83)."""
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
RESOURCE=ROOT/'server/src/test/resources/set-base'
draft=json.loads((RESOURCE/'bozza.json').read_text(encoding='utf-8'))
proposal=(ROOT/'docs/design/set-base/sb-16h-proposta.md').read_text(encoding='utf-8')
titles={c.get('gui',{}).get('name','').casefold():c['binding'] for c in draft['cards']}
variants=['20-2','25-2','25-3','30-2','30-3']
sections=re.split(r'\*\*(Spazienzio|Mara|Celestina|Piera|Beppe)\*\*',proposal)
rows=0
for name,deck in zip(['Spazienzio','Mara','Celestina','Piera','Beppe'],draft['decks']):
    lists=[{} for _ in variants]
    for line in sections[sections.index(name)+1].splitlines():
        if not line.startswith('|'):continue
        cols=[x.strip().replace('**','') for x in line.strip('|').split('|')]
        if len(cols)!=7 or not re.fullmatch(r'\d+|—',cols[2]):continue
        rows+=1
        title=cols[0].casefold()
        binding=titles.get(title)
        if not binding:
            matches=[b for t,b in titles.items() if t.startswith(title)]
            assert len(matches)==1,(name,cols[0],matches)
            binding=matches[0]
        for li,n in zip(lists,cols[2:]):
            if n!='—':li[binding]=int(n)
    for v,expected in zip(variants,lists):
        actual=json.loads((RESOURCE/'sb-16h'/f'{v}.json').read_text(encoding='utf-8'))
        assert expected==actual['decks'][deck['id']],(name,v)
        assert sum(expected.values())==actual['deckSize']
print(f'OK: {rows} rows × 5 variants; all 25 lists match proposal 0.1 exactly.')

"""Read-only aggregation of ChargeMeasureTest outputs. Usage: python summarize.py ROUND_DIRECTORY OUTPUT_DIRECTORY"""
from pathlib import Path
from collections import Counter, defaultdict
import json, sys

src,out=map(Path,sys.argv[1:3]);out.mkdir(parents=True,exist_ok=True)
matrix=json.loads((src/'matrix.json').read_text(encoding='utf-8'))
obs=json.loads((src/'observations.json').read_text(encoding='utf-8'))
root=Path(__file__).resolve().parents[4]
old=json.loads((root/'docs/reports/set-base/sb-16g-2b1/matrix.json').read_text(encoding='utf-8'))
oldobs=json.loads((root/'docs/reports/set-base/sb-16g-2b1/observations.json').read_text(encoding='utf-8'))
names=dict(zip(matrix['intestazione']['mazzi'],['Spazienzio','Mara','Celestina','Piera','Beppe']))
bydeck=defaultdict(Counter);bypolicy=defaultdict(Counter);olddeck=defaultdict(Counter)
for key,value in obs.items():
    deck,style=key.split('|');bydeck[deck].update(value);bypolicy[style.split('/')[0]].update(value)
for key,value in oldobs.items():olddeck[key.split('|')[0]].update(value)
def ratio(n,d):return n/d if d else None
def percent(n,d):return f'{100*n/d:.2f}%' if d else '—'
def avg(n,d):return f'{n/d:.3f}' if d else '—'
lines=['## Incontri (tre politiche e quattro stili aggregati)','','Quote sulle decisive; patte su tutte le partite. Δ rispetto al passo 1 in punti percentuali. Gli specchi non hanno una quota obiettivo fra etichette A/B.','','| Incontro | Quota A | Δ quota | Patte | Δ patte | Turni | Δ turni | P10–P90 | Fuori soglia |','|---|---:|---:|---:|---:|---:|---:|---|---|']
pairs=[]
for row,before in zip(matrix['coppie'],old['coppie']):
    assert (row['A'],row['B'])==(before['A'],before['B'])
    n=row['partite'];q=ratio(row['vittorieA'],row['vittorieA']+row['vittorieB']);draw=row['patte']/n;turn=row['turniTotali']/n
    oq=before['vittorieA']/(before['vittorieA']+before['vittorieB']);od=before['patte']/before['partite'];ot=before['turniTotali']/before['partite']
    threshold=(.45,.55) if (row['A'],row['B'])==('starter-spazienzio','starter-mara') else (.4,.6)
    bad=[]
    if row['A']!=row['B'] and not threshold[0]<=q<=threshold[1]:bad.append('quota')
    if draw>.1:bad.append('patte')
    if not 6<=turn<=12:bad.append('durata')
    lines.append(f"| {names[row['A']]}–{names[row['B']]} | {100*q:.2f}% | {100*(q-oq):+.2f} | {100*draw:.2f}% | {100*(draw-od):+.2f} | {turn:.2f} | {turn-ot:+.2f} | {row['turniP10']}–{row['turniP90']} | {', '.join(bad) or '—'} |")
    pairs.append(dict(row,quota=q,patteQuota=draw,turniMedi=turn,fuoriSoglia=bad))
lines+=['','## Frequenza per starter','','Un annuncio è una ricerca effettivamente eseguita, riuscita o fallita. Denominatore: presenze dello starter in partita, inclusi entrambi i posti negli specchi.','','| Starter | Presenze | Annunci/partita | 0 | 1 | 2 | 3+ | Riuscite | Fallite | Trovati giocati / tenuti a fine / scartati |','|---|---:|---:|---:|---:|---:|---:|---:|---:|---|']
starter={};titles={}
for deck in names:
    c=bydeck[deck]
    n=c['seatGames'];title={}
    for k,v in c.items():
        if k.startswith('charge/'):
            _,binding,metric=k.split('/');title.setdefault(binding,Counter())[metric]+=v
    total=Counter()
    for v in title.values():total.update(v)
    assert sum(c['announcements-'+x] for x in ['0','1','2','3+'])==n
    assert total['resolved']==c['announcements']==c['searches']
    lines.append(f"| {names[deck]} | {n} | {avg(c['announcements'],n)} | "+' | '.join(percent(c['announcements-'+x],n) for x in ['0','1','2','3+'])+f" | {total['found']} | {total['missed']} ({percent(total['missed'],total['resolved'])}) | {total['foundCopyPlayed']} / {total['foundCopyHeldAtEnd']} / {total['foundCopyDiscarded']} |")
    starter[deck]={'counts':dict(c),'titles':title,'annunciPerPartita':ratio(c['announcements'],n),'distribuzione':{x:ratio(c['announcements-'+x],n) for x in ['0','1','2','3+']}}
    titles[deck]=title
lines+=['','## Dettagli per titolo','','Visti = copie distinte comparse nella mano, anche finale; giocati = scelte inviate; risolti = mosse non annullate; non eseguiti = annullati. Prima legale riguarda la precisa copia trovata; gettoni soddisfatti riguardano il nome.','','| Starter / caricamento | Visti | In mano alla fine | Giocati / risolti / non eseguiti | Riuscite / fallite | Fallita: già in mano / consumato | Primo legale giocato / tenuto | Turni impagabile | Giocato parato / annullato |','|---|---:|---:|---|---|---|---|---:|---|']
for deck,title in titles.items():
    for binding,c in title.items():
        lines.append(f"| {names[deck]} / {binding} | {c['seenCopies']} | {c['heldAtEnd']} | {c['played']} / {c['resolved']} / {c['notExecuted']} | {c['found']} / {c['missed']} | {c['missAlreadyInHand']} / {c['missConsumedOrAbsent']} | {c['playedFirstLegal']} / {c['heldFirstLegal']} | {c['unplayableTurns']} | {c['foundCopyParried']} / {c['foundCopyVoided']} |")
lines+=['','## Gettoni e danni','','Tutti i gettoni creati sono ricondotti a soddisfazione, uscita D71 o chiusura della partita. Durata inclusiva del turno di creazione; danni prima del limite della HEALTH, come nel passo 1.','','| Starter | Creati | Soddisfatti | Uscita D71 | Chiusi a fine | Durata media | Danno avversario / riuscita | Extra / riuscita | Δ extra passo 1 |','|---|---:|---:|---:|---:|---:|---:|---:|---:|']
for deck in names:
    c=bydeck[deck]
    totals=Counter()
    for v in titles[deck].values():totals.update(v)
    n=totals['tokensCreated'];o=olddeck[deck]
    lines.append(f"| {names[deck]} | {n} | {totals['tokenSatisfied']} | {totals['tokenExitD71']} | {totals['tokenClosedAtEnd']} | {avg(totals['tokenDurationTurns'],n)} | {avg(c['tokenDamage-opponent'],n)} | {avg(c['tokenExtra-opponent'],n)} | {c['tokenExtra-opponent']/n-o['tokenExtra-opponent']/o['found']:+.3f} |")
lines+=['','## Risorse a N+1 e ripiego','','Vettori in ordine V/A/T/L, media dopo il fine turno della ricerca (anche terminale). Premi e spese integrali, salute inclusa, nei contatori JSON. Le spese altrove sono totali per finestra della copia trovata, non per partita.','','| Caricamento | N+1 riuscita V/A/T/L | N+1 fallita V/A/T/L | Spese altrove V/A/T/L | Ripiego colpo già in mano: turni osservati / legale / scelto |','|---|---|---|---|---|']
for deck,title in titles.items():
    for binding,c in title.items():
        full='/'.join(avg(c['foundNext-'+r],c['found']) for r in ['VIOLENCE','ALERTNESS','TOXICITY','ALCOHOL'])
        miss='/'.join(avg(c['missNext-'+r],c['missed']) for r in ['VIOLENCE','ALERTNESS','TOXICITY','ALCOHOL'])
        spent='/'.join(str(c['spentElsewhere-'+r]) for r in ['VIOLENCE','ALERTNESS','TOXICITY','ALCOHOL'])
        lines.append(f"| {binding} | {full} | {miss} | {spent} | {c['fallbackHeldHitNextTurn']} / {c['fallbackHeldHitPlayable']} / {c['fallbackHeldHitChosen']} |")
lines+=['','## Danno nelle finestre di vulnerabilità per tipo','','Totali e danno aggiuntivo da gettone separati da una barra; prima del limite della salute, come nel passo 1.','','| Starter | Avversario HIT | Avversario CUT | Avversario POISON diretto | POISON periodico | Autodanno HIT/CUT/POISON |','|---|---:|---:|---:|---:|---|']
for deck in names:
    c=bydeck[deck]
    def amount(kind):return str(c['tokenDamage-'+kind])+' / '+str(c['tokenExtra-'+kind])
    lines.append('| '+names[deck]+' | '+' | '.join(amount('opponent-'+typ) for typ in ['HIT','CUT','POISON'])+' | '+amount('periodic-POISON')+' | '+', '.join(typ+': '+amount('self-'+typ) for typ in ['HIT','CUT','POISON'])+' |')
lines+=['','## Durata, mazzi e finali','','| Starter | Mazzo esaurito | Partita con turno da metà salute | Finita in quel turno | Annunci/partita passo 1 → passo 2 |','|---|---:|---:|---:|---|']
for deck in names:
    c=bydeck[deck];o=olddeck[deck];n=c['seatGames'];m=matrix['mazzi'][deck]
    lines.append(f"| {names[deck]} | {percent(m['mazzoEsaurito'],m['partite'])} | {percent(c['gamesWithHalfHealthTurn'],n)} | {percent(c['gamesEndedInHalfHealthTurn'],n)} | {avg(o['searches'],o['seatGames'])} → {avg(c['announcements'],n)} |")
lines+=['','## Carte meno giocate quando presenti','','Cinque quote più basse per starter: partite con almeno una giocata / partite con il titolo in mano. È diagnostica, non una nuova soglia di D16.','','| Starter | Carta | Partite giocata / in mano | Quota |','|---|---|---:|']
for deck in names:
    regular=matrix['mazzi'][deck]['carte']
    for binding,c in sorted(regular.items(),key=lambda item:item[1]['partiteGiocata']/item[1]['partiteInMano'] if item[1]['partiteInMano'] else 2)[:5]:
        lines.append(f"| {names[deck]} | {binding} | {c['partiteGiocata']} / {c['partiteInMano']} | {percent(c['partiteGiocata'],c['partiteInMano'])} |")
lines+=['','## Politiche','','| Politica | Quota vittorie decisive | Patte | Turni medi | Annunci/partita | Fallite |','|---|---:|---:|---:|---:|---:|']
for policy,c in bypolicy.items():
    lines.append(f"| {policy} | {percent(c['wins'],c['seatGames']-c['draws'])} | {percent(c['draws'],c['seatGames'])} | {avg(c['turns'],c['seatGames'])} | {avg(c['announcements'],c['seatGames'])} | {percent(c['missed'],c['searches'])} |")
policyduels={}
lines+=['','Confronto diretto fra politiche, entrambe le assegnazioni ai mazzi e posti alternati:','','| Politica A / B | Partite | Quota A sulle decisive | Patte |','|---|---:|---:|---:|']
for pa,pb in [('ALWAYS','HOLD_IF_DEFENDED'),('ALWAYS','RANDOM'),('HOLD_IF_DEFENDED','RANDOM')]:
    counts=Counter()
    for cell in matrix['celle']:
        a,b=cell['stileA'].split('/')[0],cell['stileB'].split('/')[0]
        if (a,b) not in [(pa,pb),(pb,pa)]:continue
        counts['partite']+=cell['partite'];counts['patte']+=cell['patte']
        counts['vittorieA']+=cell['vittorieA' if a==pa else 'vittorieB']
        counts['vittorieB']+=cell['vittorieB' if a==pa else 'vittorieA']
    policyduels[pa+'|'+pb]=counts
    lines.append(f"| {pa} / {pb} | {counts['partite']} | {percent(counts['vittorieA'],counts['vittorieA']+counts['vittorieB'])} | {percent(counts['patte'],counts['partite'])} |")
# Per encounter and ordered policy pair, aggregated over the 16 style pairs.
policypairs=defaultdict(Counter)
for cell in matrix['celle']:
    key='|'.join([cell['A'],cell['B'],cell['stileA'].split('/')[0],cell['stileB'].split('/')[0]])
    for metric in ['partite','vittorieA','vittorieB','patte','turniTotali','limite']:policypairs[key][metric]+=cell[metric]
badpolicy=[]
for key,c in policypairs.items():
    a,b,pa,pb=key.split('|');q=c['vittorieA']/(c['vittorieA']+c['vittorieB']);draw=c['patte']/c['partite'];turn=c['turniTotali']/c['partite']
    low,hi=(.45,.55) if (a,b)==('starter-spazienzio','starter-mara') else (.4,.6)
    bad=[]
    if a!=b and not low<=q<=hi:bad.append('quota')
    if draw>.1:bad.append('patte')
    if not 6<=turn<=12:bad.append('durata')
    if bad:badpolicy.append({'key':key,'quotaA':q,'patte':draw,'turni':turn,'fuoriSoglia':bad})
lines+=['','## Celle incontro × politiche fuori soglia','','Aggregazione dei soli quattro stili; restano disponibili tutte le 2.160 celle e IC95 in matrix.json.','','| Incontro | Politica A / B | Quota A | Patte | Turni | Fuori soglia |','|---|---|---:|---:|---:|---|']
for x in badpolicy:
    a,b,pa,pb=x['key'].split('|');lines.append(f"| {names[a]}–{names[b]} | {pa} / {pb} | {100*x['quotaA']:.2f}% | {100*x['patte']:.2f}% | {x['turni']:.2f} | {', '.join(x['fuoriSoglia'])} |")
(out/'summary.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
(out/'summary.json').write_text(json.dumps({'incontri':pairs,'starter':starter,'politiche':bypolicy,'confrontoPolitiche':policyduels,'cellePolitiche':policypairs,'cellePoliticheFuoriSoglia':badpolicy},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('summary:',len(pairs),'encounters;',sum(bool(p['fuoriSoglia']) for p in pairs),'outside; policy cells outside:',len(badpolicy))

"""D83/D93: summarize existing files only; never starts a game or changes a list.

Usage: python sb-16h-analyze.py feasibility|summarize|package OUTPUT_ROOT
"""
import gzip
import hashlib
import json
import math
import sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
VARIANTS = ['20-2', '25-2', '25-3', '30-2', '30-3', 'mixed']
NAMES = dict(zip(['starter-spazienzio', 'starter-mara', 'starter-tossico', 'starter-pino', 'starter-gigi'],
                 ['Spazienzio', 'Mara', 'Celestina', 'Piera', 'Beppe']))
BASE = {'starter-spazienzio', 'starter-mara'}
HITS = [('bruiser.SuperImpact', 'bruiser.ExtremelyViolentBlow'),
        ('base.mara.Sgommata', 'base.mara.CinghiataDiTraverso'), ('junkie.Cough', 'junkie.ToxicBloodDrain'),
        ('base.pino.GoingBerserk', 'base.pino.RuttoADistanzaSociale'), ('base.gigi.ChiaveDaTredici', 'base.gigi.LavoroFattoBene')]


def read(p):
    return json.loads(p.read_text(encoding='utf-8-sig'))


def write(p, value):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')


def display(alias):
    deck, _, variant = alias.partition('@')
    return NAMES[deck] + ((' ' + variant.replace('-', '/')) if variant else '')


def group(a, b):
    ca, cb = a.endswith('/com'), b.endswith('/com')
    return 'com' if ca and cb else 'mixed' if ca or cb else 'heur'


def hist_stats(hist):
    hist = {int(k): v for k, v in hist.items() if v}
    n = sum(hist.values())
    def percentile(q):
        rank, seen = math.ceil(q*n), 0
        for t, v in sorted(hist.items()):
            seen += v
            if seen >= rank:
                return t
    return {'n': n, 'mean': sum(t*v for t,v in hist.items())/n if n else None,
            'p10': percentile(.1) if n else None, 'p90': percentile(.9) if n else None,
            'histogram': dict(sorted(hist.items()))}


def measures(c, deck):
    n = c['games']
    hist = lambda prefix: {k[len(prefix):]: v for k,v in c.items() if k.startswith(prefix)}
    result = {'games': n, 'turns': c['turns']/n, 'exhausted': c['exhausted'], 'exhaustedRate': c['exhausted']/n,
              'exhaustionTurn': hist_stats(hist('exhaustionTurn/')), 'announcements': c['announcements']/n,
              'announcementDistribution': {str(i):c[f'announcements-{i}'] for i in range(4)},
              'searchFound': c['searchFound'], 'searchMissed': c['searchMissed'],
              'searchMissRate': c['searchMissed']/max(1,c['searchMissed']+c['searchFound']),
              'endWithAnyLastResort': c['endWithAnyLastResort']/n,
              'endWithAnyChosenLastResort': c['endWithAnyChosenLastResort']/n,
              'endAfterAnyLastResort': c['endAfterAnyLastResort']/n}
    for label,binding in zip(('nc','rare'),HITS[list(NAMES).index(deck.split('@')[0])]):
        first = hist_stats(hist(f'first/{binding}/'))
        result[label] = dict(binding=binding, **first, neverRate=1-first['n']/n)
    cards = defaultdict(dict)
    for k, v in c.items():
        if k.startswith('card/'):
            _, binding, measure = k.split('/')
            cards[binding][measure] = v
    for binding, stats in cards.items():
        stats['playedRate'] = stats.get('playedGames',0)/n
        stats['unchosenPerGame'] = stats.get('unchosenTurns',0)/n
        stats['unchosenRate'] = stats.get('unchosenTurns',0)/max(1,stats.get('handTurns',0))
    result['cards'] = dict(sorted(cards.items()))
    return result


def pair_measures(cells, a, b):
    agg = defaultdict(Counter)
    for c in cells:
        if (c['A'],c['B']) != (a,b):
            continue
        for g in (group(c['stileA'],c['stileB']), 'all'):
            for k in ('partite','vittorieA','vittorieB','patte','turniTotali'):
                agg[g][k] += c[k]
    out = {}
    for g,r in agg.items():
        n = r['partite']
        out[g] = {'games':n,'quota':r['vittorieA']/max(1,r['vittorieA']+r['vittorieB']),
                  'drawRate':r['patte']/n,'turns':r['turniTotali']/n, 'counts':r}
    h = out['heur']
    # Exact D93 calculation of heur.py. Aliased mixed matchups are exploratory, without a quota gate.
    lo,hi = (.45,.55) if a in BASE and b in BASE else (.4,.6)
    mirror = a == b
    excess = {'quota':0 if mirror or '@' in a else max(0,lo-h['quota'],h['quota']-hi),
              'patte':max(0,h['drawRate']-.1),'durata':max(0,6-h['turns'],h['turns']-12)}
    return {'A':a,'B':b,'groups':out,'excess':excess,'failures':[k for k,v in excess.items() if v>0],
            'comOutside':a!=b and not .35<=out['com']['quota']<=.65}


def summarize_arm(folder):
    matrix, observations = read(folder/'matrix.json'), read(folder/'deck-observations.json')
    expected=defaultdict(int)
    for c in matrix['celle']:
        g=group(c['stileA'],c['stileB'])
        expected[c['A']+'|'+c['B']+'|'+g]+=c['partite']
        expected[c['B']+'|'+c['A']+'|'+g]+=c['partite']
    assert set(expected)==set(observations), 'Observation matchup/group coverage'
    for key,c in observations.items():
        assert c['games']==expected[key], (key,'seat games')
        assert sum(c.get(f'announcements-{i}',0) for i in range(4))==c['games'], (key,'announcement distribution')
        assert c.get('searchFound',0)+c.get('searchMissed',0)==c['announcements'], (key,'search outcomes')
        assert sum(v for k,v in c.items() if k.startswith('exhaustionTurn/'))==c.get('exhausted',0), (key,'exhaustion histogram')
        assert c.get('endWithAnyLastResort',0)<=c.get('endWithAnyChosenLastResort',0)<=c['games'], (key,'terminal last resort')
        for binding in HITS[list(NAMES).index(key.split('|')[0].split('@')[0])]:
            assert sum(v for k,v in c.items() if k.startswith(f'first/{binding}/'))==c.get(f'card/{binding}/playedGames',0), (key,binding,'first play histogram')
    assert sum(expected.values())==2*matrix['intestazione']['partite']
    pairs = [pair_measures(matrix['celle'],p['A'],p['B']) for p in matrix['coppie']]
    by_deck, by_pair, total = defaultdict(Counter), {}, defaultdict(Counter)
    for key,c in observations.items():
        deck, opponent, g = key.split('|')
        by_pair[key] = measures(Counter(c),deck)
        for k in (deck+'|'+g,deck+'|all'):
            by_deck[k].update(c)
        total[g].update(c)
        total['all'].update(c)
    regular = {binding for deck in read(folder/'draft.json')['decks'] for binding in deck['cards']}
    global_measures = {}
    for g,c in total.items():
        n=c['games']
        hand=sum(v for k,v in c.items() if k.startswith('card/') and k.endswith('/handTurns') and k.split('/')[1] in regular)
        idle=sum(v for k,v in c.items() if k.startswith('card/') and k.endswith('/unchosenTurns') and k.split('/')[1] in regular)
        all_hand=sum(v for k,v in c.items() if k.startswith('card/') and k.endswith('/handTurns'))
        all_idle=sum(v for k,v in c.items() if k.startswith('card/') and k.endswith('/unchosenTurns'))
        global_measures[g]={'seatGames':n,'exhaustedRate':c['exhausted']/n,'turns':c['turns']/n,
            'announcements':c['announcements']/n,'searchMissed':c['searchMissed'],
            'searchMissRate':c['searchMissed']/max(1,c['searchFound']+c['searchMissed']),
            'deadTurnsPerGame':idle/n,'deadHandRate':idle/max(1,hand),
            'allUnchosenTurnsPerGame':all_idle/n,'allUnchosenHandRate':all_idle/max(1,all_hand),
            'endWithAnyLastResort':c['endWithAnyLastResort']/n,
            'endAfterAnyLastResort':c['endAfterAnyLastResort']/n}
    styles = defaultdict(Counter)
    for c in matrix['celle']:
        sa,sb=c['stileA'].split('/')[1],c['stileB'].split('/')[1]
        for k in ('partite','vittorieA','vittorieB','patte','turniTotali'):
            styles[sa+'|'+sb][k]+=c[k]
    return {'games':matrix['intestazione']['partite'],'seconds':float((folder/'seconds.txt').read_text()),
            'invariants':matrix['invarianti'],'bounds':matrix['tettoBound'],'pairs':pairs,
            'outside':sum(bool(p['failures']) for p in pairs),'global':global_measures,
            'decks':{k:measures(c,k.split('|')[0]) for k,c in by_deck.items()},'byMatchup':by_pair,'styles':styles}


def selection(summaries):
    base=summaries['20-2']; bglobal=base['global']['heur']
    mirror_mean=lambda s:sum(p['groups']['heur']['drawRate'] for p in s['pairs'] if p['A']==p['B'])/5
    spread=lambda s:max(abs(p['groups']['heur']['quota']-.5) for p in s['pairs'] if p['A']!=p['B'])
    out={}
    for v,s in summaries.items():
        if v in ('20-2','mixed'):continue
        regressions=[];new_failures=[];new_long=[]
        for b,p in zip(base['pairs'],s['pairs']):
            assert (b['A'],b['B'])==(p['A'],p['B'])
            for k,e in p['excess'].items():
                if e>b['excess'][k]+1e-12:regressions.append([p['A'],p['B'],k,b['excess'][k],e])
                if e>0 and b['excess'][k]==0:new_failures.append([p['A'],p['B'],k])
            if b['groups']['heur']['turns']<=12<p['groups']['heur']['turns']:new_long.append([p['A'],p['B']])
        criteria={'halvesExhaustion':s['global']['heur']['exhaustedRate']<=bglobal['exhaustedRate']/2,
                  'reducesMirrorDraws':mirror_mean(s)<mirror_mean(base), 'noNewLongMatchups':not new_long,
                  'noWiderQuotaSpread':spread(s)<=spread(base),'noMoreDeadTurns':s['global']['heur']['deadTurnsPerGame']<=bglobal['deadTurnsPerGame'],
                  'noD93Worsens':not regressions}
        out[v]={'criteria':criteria,'satisfiesNumericalD83':all(criteria.values()),'humanTrialRequired':True,
                'mirrorDrawMean':mirror_mean(s),'quotaSpread':spread(s),'regressions':regressions,'newFailures':new_failures,'newLong':new_long}
    return out


def hypothesis_data(summaries):
    resources=REPO/'server/src/test/resources/set-base/sb-16h'
    baseline=read(resources/'20-2.json')['decks']
    out={}
    for v,s in summaries.items():
        if v=='mixed':continue
        spec=read(resources/f'{v}.json')['decks']
        kinds={k:Counter() for k in ('old','new')}
        for deck in NAMES:
            for binding in spec[deck]:
                c=s['decks'][deck+'|heur']['cards'].get(binding,{})
                kind='old' if binding in baseline[deck] else 'new'
                kinds[kind]['titles']+=1
                kinds[kind]['handTurns']+=c.get('handTurns',0)
                kinds[kind]['unchosenTurns']+=c.get('unchosenTurns',0)
        for c in kinds.values():c['unchosenRate']=c['unchosenTurns']/c['handTurns'] if c['handTurns'] else None
        bands={deck:s['decks'][deck+'|heur']['nc']['p90']-s['decks'][deck+'|heur']['nc']['p10'] for deck in NAMES}
        q=[p['groups']['heur']['quota'] for p in s['pairs'] if p['A']!=p['B']]
        out[v]={'waiting':kinds,'ncBands':bands,'meanNcBand':sum(bands.values())/5,
                'quotaMin':min(q),'quotaMax':max(q),'quotaRange':max(q)-min(q),'maxQuotaDistance':max(abs(x-.5) for x in q)}
    return out


def pct(x):return f'{100*x:.2f}%'
def num(x):return '—' if x is None else f'{x:.2f}'


def markdown(summaries,choice,out):
    lines=['# SB-16h — risultati dettagliati D93','',
           'Quote sulle decisive; patte e turni su tutte le partite del gruppo. `heur`: due euristici; `com`: due casuali; `mixed`: uno per tipo.', '']
    for v,s in summaries.items():
        lines += [f'## {v.replace("-","/")}', '', '| Incontro | euristici: quota / patte / turni | com: quota / patte / turni | celle miste: quota / patte / turni | Fuori D93 |', '|---|---|---|---|---|']
        for p in s['pairs']:
            row=[f'{display(p["A"])}–{display(p["B"])}']
            for g in ('heur','com','mixed'):
                r=p['groups'][g];row.append(f'{pct(r["quota"])} / {pct(r["drawRate"])} / {r["turns"]:.2f}')
            row.append(', '.join(p['failures']) or '—')
            lines.append('| '+' | '.join(row)+' |')
        lines += ['', '### Starter (solo euristici)', '', '| Starter | Mazzo esaurito | Turno esaurimento: media [P10–P90] | Annunci/partita; distribuzione 0/1/2/3+ | Ricerche fallite | Finale LR |', '|---|---|---|---|---|---|']
        if v=='mixed':
            rows=[(display(deck)+' contro '+display(foe),deck,m) for key,m in s['byMatchup'].items()
                  for deck,foe,g in [key.split('|')] if g=='heur']
        else:
            rows=[(display(deck),deck,m) for key,m in s['decks'].items() for deck,g in [key.split('|')] if g=='heur']
        for label,deck,m in rows:
            e=m['exhaustionTurn']; dist='/'.join(pct(m['announcementDistribution'][str(i)]/m['games']) for i in range(4))
            lines.append(f'| {label} | {pct(m["exhaustedRate"])} | {num(e["mean"])} [{e["p10"]}–{e["p90"]}] | {m["announcements"]:.3f}; {dist} | {m["searchMissed"]} ({pct(m["searchMissRate"])}) | {pct(m["endWithAnyLastResort"])} |')
        lines += ['', '| Starter | Primo colpo NC: media [P10–P90]; mai | Primo raro: media [P10–P90]; mai |','|---|---|---|']
        for label,deck,m in rows:
            row=[label]
            for hit in ('nc','rare'):
                h=m[hit];row.append(f'{num(h["mean"])} [{h["p10"]}–{h["p90"]}]; {pct(h["neverRate"])}')
            lines.append('| '+' | '.join(row)+' |')
        lines += ['', '### Stili, aggregati sui personaggi e sulle tre politiche', '', '| Stile A | Stile B | Partite | Quota A | Patte | Turni |', '|---|---|---:|---:|---:|---:|']
        for key,r in s['styles'].items():
            sa,sb=key.split('|');lines.append(f'| {sa} | {sb} | {r["partite"]} | {pct(r["vittorieA"]/max(1,r["vittorieA"]+r["vittorieB"]))} | {pct(r["patte"]/r["partite"])} | {r["turniTotali"]/r["partite"]:.2f} |')
        card_lines=[f'# SB-16h {v.replace("-","/")} — tutti i titoli, due euristici', '',
                    'Un titolo conta una volta per turno in mano. «Non scelta» comprende sia carte non pagabili sia carte pagabili lasciate in mano. Giocata = scelta, anche se poi annullata. Le probabilità sono su tutte le partite dello starter. Gli oggetti, automatici, hanno zero turni in mano e zero scelte manuali.', '']
        draft=read(out.parent/'round'/v/'draft.json')
        title={c['binding']:c.get('gui',{}).get('name',c['binding']) for c in draft['cards']}
        for label,deck,m in rows:
            card_lines += [f'## {label}', '', '| Titolo | Giocata in partite | Turni in mano | Turni non scelta | Non scelta/partita | Non scelta/in mano |', '|---|---:|---:|---:|---:|---:|']
            # Include every deck title, even if never seen or played.
            base_deck,_,variant=deck.partition('@')
            spec=next(d for d in draft['decks'] if d['id']==base_deck)
            regular=read(REPO/'server/src/test/resources/set-base/sb-16h'/f'{variant}.json')['decks'][base_deck] if variant else spec['cards']
            bindings=set(regular)|set(spec['bound'])|{spec['lastResort']}|set(m['cards'])
            for b in sorted(bindings):
                c=m['cards'].get(b,{})
                card_lines.append(f'| {title.get(b,b)} | {pct(c.get("playedRate",0))} | {c.get("handTurns",0)} | {c.get("unchosenTurns",0)} | {c.get("unchosenPerGame",0):.3f} | {pct(c.get("unchosenRate",0))} |')
        (out/f'cards-{v}.md').write_text('\n'.join(card_lines)+'\n',encoding='utf-8')
        lines.append('')
    (out/'details.md').write_text('\n'.join(lines),encoding='utf-8')


def main():
    mode,root=sys.argv[1],Path(sys.argv[2]).resolve()
    if mode=='feasibility':
        seconds={v:float((root/'step0'/v/'seconds.txt').read_text()) for v in VARIANTS}
        total=sum(seconds.values())
        phase_seconds=float((root/'step0-seconds.txt').read_text())
        # Same timing scope as SB-16g: the bench timers. The fixed 120 s covers orchestration/startup/output.
        measured=total
        estimates={str(n):measured*(n/4)*1.5+120 for n in (300,150)}
        n=300 if estimates['300']<=7200 else 150
        result={'seconds':seconds,'totalBenchSeconds':total,'phaseSeconds':phase_seconds,'measuredSeconds':measured,
                'estimates':estimates,'gamesPerCell':n,'feasible':estimates[str(n)]<=7200,'step0OutsideBudget':True,
                'formula':'sum(bench seconds) × (N/4) × 1.5 + 120'}
        write(root/'feasibility.json',result);print(json.dumps(result,indent=2));return
    if mode=='summarize':
        summaries={v:summarize_arm(root/'round'/v) for v in VARIANTS}
        choice=selection(summaries)
        out=root/'summary';out.mkdir(exist_ok=True)
        write(out/'summary.json',summaries);write(out/'selection.json',choice)
        write(out/'hypotheses.json',hypothesis_data(summaries))
        markdown(summaries,choice,out)
        for v,s in summaries.items():
            h=s['global']['heur'];print(v,s['games'],s['outside'],'outside',pct(h['exhaustedRate']),'exhausted',num(h['turns']),'turns',num(s['seconds']),'s')
        print(json.dumps(choice,indent=2));return
    if mode=='package':
        out=HERE/'sb-16h';out.mkdir(exist_ok=True)
        manifest={}
        for phase in ('step0','round'):
            for v in VARIANTS:
                for name in ('matrix.json','observations.json','deck-observations.json','draft.json'):
                    p=root/phase/v/name;data=p.read_bytes()
                    if name.endswith('.json'):
                        json.loads(data)
                        assert b'\n' not in data.rstrip(), 'Final JSON must be minified'
                    filename=f'{phase}-{v}-{name}.gz'
                    (out/filename).write_bytes(gzip.compress(data,mtime=0))
                    manifest[filename]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
        for name in ('matrix.json','matrix.md','observations.json','draft.json'):
            data=(root/'historical-step0'/name).read_bytes()
            filename='historical-step0-'+name+'.gz';(out/filename).write_bytes(gzip.compress(data,mtime=0))
            manifest[filename]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
        for name in ('identity.json','freeze.json','feasibility.json','step0-attempt.json','round-attempt.json',
                     'identity-round-20-2.json','budget.json','mutations.json','live-identity.json','verification.json'):
            if (root/name).is_file():write(out/name,read(root/name))
        summary=json.dumps(read(root/'summary'/'summary.json'),ensure_ascii=False,separators=(',',':')).encode('utf-8')
        (out/'summary.json.gz').write_bytes(gzip.compress(summary,mtime=0))
        manifest['summary.json.gz']={'bytes':len(summary),'sha256':hashlib.sha256(summary).hexdigest()}
        write(out/'selection.json',read(root/'summary'/'selection.json'))
        write(out/'hypotheses.json',read(root/'summary'/'hypotheses.json'))
        for p in (root/'summary').glob('*.md'):(out/p.name).write_bytes(p.read_bytes())
        write(out/'manifest.json',manifest)
        print('Packaged bytes:',sum(p.stat().st_size for p in out.iterdir() if p.is_file()));return
    raise SystemExit('Unknown mode')


if __name__=='__main__':main()

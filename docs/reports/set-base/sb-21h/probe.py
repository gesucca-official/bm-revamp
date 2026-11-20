"""SB-21h A: copie e sonde; nessuna scrittura alla bozza. Budget totale 1500 s."""
import argparse, copy, hashlib, json, sys
from pathlib import Path
sys.dont_write_bytecode = True
EVID = Path(__file__).resolve().parent
ROOT = EVID.parents[3]
AREA = ROOT / 'server/target/sb-21h'
sys.path.insert(0, str(EVID.parent / 'sb-21g'))
import sb21g as g
b = g.banco
b.AREA = AREA
b.EVIDENZE = EVID
b.BUDGET = 1500
sys.path.insert(0, str(ROOT / 'docs/design/set-base/testi'))
from testi_stampati import genera, slot_di
from matrice import aggrega, quota
NAMES = ['spazienzio','mara','celestina','piera','beppe','sergio','duccio']
SLOTS = [('SPA-BO2','SPA-BO1'),('MAR-BO1','MAR-BO2'),('TOS-BO1','TOS-BO2'),('PIN-BO2','PIN-BO1'),('GIG-BO2','GIG-BO1'),('CES-BO2','CES-BO3'),('ROC-BO1','ROC-BO3')]
RES = [('VIOLENCE',1),('ALERTNESS',2),('TOXICITY',4),('ALCOHOL',1),('VIOLENCE',1),('ALERTNESS',2),('ALERTNESS',2)]
def save(p,x):
    p.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8')
def gain(r,n): return dict(op='gain',resource=r,amount=n)
def clean(r): return dict(op='lose',resource=r,amount=dict(base=0,of=r,divide=4))
def shield(t): return dict(op='status',name='Riparo '+t,description=t+' ricevuto x0.75',statusType='GOOD',flow='INPUT',property=t,factor=0.75,turns=0)
def prepare():
    AREA.mkdir(exist_ok=True)
    original=b.BOZZA.read_bytes()
    assert hashlib.sha256(original).hexdigest()=='bb182da96a63c958fe8cddd55fb966329258e749b57742d17a229321950f91be'
    (AREA/'rif.json').write_bytes(original)
    d=json.loads(original)
    slots={c['gui']['description'].split(' ')[0]:c for c in d['cards']}
    cards={c['binding']:c['gui']['name'] for c in d['cards']}
    for i,(sa,sb) in enumerate(SLOTS):
        a,z=slots[sa],slots[sb]
        a['priority']=1
        a['targets']=['OPPONENT']
        a['target']=[dict(op='damage',type='CUT' if i in (1,2) else 'HIT',amount=2)]
        a['self']=([gain('TOXICITY',2)] if i==2 else [clean('TOXICITY')] if i==3 else [gain('VIOLENCE',1)] if i==4 else [gain('ALERTNESS',2)] if i==5 else [clean('TOXICITY'),clean('ALCOHOL')])
        z['priority']=2
        z['targets']=['SELF']
        z['target']=[]
        z['self']=[gain(*RES[i])]+[shield(t) for t in ('HIT','CUT','POISON')]
        for c,slot,role in ((a,sa,'DAMAGE'),(z,sb,'DEFENSE')):
            c['gui'].update(genera(c,slot_di(c["gui"]),cards))
            c['gui']['role']=role
        deck=next(x for x in d['decks'] if x['id']==g.RIFERIMENTI[i])
        deck['bound']=[a['binding'],z['binding']]
    assert len(d['cards'])+len(d['characters'])==124
    assert not list(g.brutti(d))
    save(AREA/'proposta.json',d)
    # Cloni solo strumentali: stessa disponibilita, ruolo, priorita e bersagli, zero effetti e guadagni.
    for i,(sa,sb) in enumerate(SLOTS):
        deck=next(x for x in d['decks'] if x['id']==g.RIFERIMENTI[i])
        bs=[slots[sa],slots[sb]]
        null=[]
        for j,c in enumerate(bs):
            nc=copy.deepcopy(c)
            nc['binding']='probe.null.'+NAMES[i]+str(j)
            nc['self']=[]; nc['target']=[]
            nc['gui'].update(name='Nulla '+NAMES[i]+str(j),description='Bound nulla strumentale',gains='—',damage='—',damageAmount='—')
            d['cards'].append(nc); null.append(nc['binding'])
        for tag,bounds in [('ab',deck['bound']),('a',[bs[0]['binding'],null[1]]),('b',[null[0],bs[1]['binding']]),('null',null)]:
            nd=copy.deepcopy(deck); nd['id']='h-'+NAMES[i]+'-'+tag; nd['bound']=bounds
            d['decks'].append(nd)
    save(AREA/'sonde.json',d)
    save(EVID/'input.json',dict(baseSha256=hashlib.sha256(original).hexdigest(),proposalSha256=g.digest(AREA/'proposta.json'),probeSha256=g.digest(AREA/'sonde.json'),resourceDefense=RES,slots=SLOTS,budgetSeconds=1500,seed=7000000))
def check_matrix(m):
    assert not any(m['invarianti']['violazioni'].values())
    old=[x for x in m['tettoBound'] if x['viola']]
    # D159 supera il tetto: nessuna modifica al test, nessuna promozione del suo exit 1.
    # La firma diagnosticata nella fattibilita deve restare esattamente questa.
    assert all(x['bound']=='base.pino.bound.CinqueMinutiEVado' and x['massimo']==4.35
               and x['motivi']=='valore per uso 4,35 oltre il tetto 4,00'
               and not x['restaSullAvversario'] for x in old), old
    return old

def measure(shell, phase, name, draft, *opts):
    try:
        b.misura(shell,phase,name,draft,*opts)
    except SystemExit:
        path=AREA/(phase+'-sb21g3b-'+name)
        m=b.leggi(path/'matrix.json')
        old=check_matrix(m)
        attempt=b.leggi(AREA/(path.name+'-attempt.json'))
        log=(AREA/(path.name+'.log')).read_text(encoding='utf-8-sig',errors='replace')
        assert attempt['exit']==1 and len(old)==1
        assert 'Tests run: 1, Failures: 1, Errors: 0' in log and 'Sb19MeasureTest.java:106' in log
        save(EVID/('diagnosi-'+name+'.json'),dict(exit=1,decision='D159',supersededBoundCap=old,
             invariantViolations=m['invarianti']['violazioni'],matrixSha256=g.digest(path/'matrix.json')))
        print('Sonda completa; exit 1 conservato: solo tetto D33/D36 superato da D159.',flush=True)

def sergio_reserve(shell, name):
    d=b.leggi(AREA/'nulle-d33.json')
    c=next(c for c in d['cards'] if c['binding']=='base.cesira.bound.Battutina')
    c['self'][0]['amount']=1
    if name=='sergio-r2': c['target'][0]['amount']=1
    c['gui'].update(genera(c,slot_di(c['gui']),{x['binding']:x['gui']['name'] for x in d['cards']}))
    dest=AREA/(name+'.json'); save(dest,d)
    save(EVID/(name+'-input.json'),dict(binding=c['binding'],self=c['self'],target=c['target'],sha256=g.digest(dest)))
    measure(shell,'round',name,dest,'-Rows','h-sergio-ab,h-sergio-a,h-sergio-b,h-sergio-null','-Foes','h-sergio-null')
    before=b.leggi(AREA/'round-sb21g3b-n-sergio/matrix.json')['celle']
    after=b.leggi(AREA/('round-sb21g3b-'+name)/'matrix.json')['celle']
    keep=lambda rows:[x for x in rows if x['A']=='h-sergio-null']
    assert keep(before)==keep(after), 'Il riferimento nullo deve essere identico'

def no_defense_copy():
    d=b.leggi(AREA/'proposta.json')
    names={c['binding']:c['gui']['name'] for c in d['cards']}
    for c in d['cards']:
        if c.get('kind')=='BOUND' and c.get('gui',{}).get('role')=='DEFENSE':
            c['self']=[x for x in c['self'] if x['op']!='status']
            c['gui']['role']='RESOURCES'
            c['gui'].update(genera(c,slot_di(c['gui']),names))
    save(AREA/'senza-parata.json',d)

def neutral():
    d=b.leggi(AREA/'sonde.json')
    for c in d['cards']:
        if c['binding'].startswith('probe.null.'):
            c['priority']=0; c['targets']=['SELF']; c['gui']['role']='NONE'
    save(AREA/'nulle-d33.json',d)
    inp=b.leggi(EVID/'input.json')
    inp['d33ProbeSha256']=g.digest(AREA/'nulle-d33.json')
    inp['firstProbeUse']='controllo bias del ruolo: non valido per D33'
    save(EVID/'input.json',inp)

def summarize():
    out=[]; styles=[]; proofs=[]
    for p in AREA.glob('round-*/matrix.json'):
        m=b.leggi(p)
        check_matrix(m)
        proofs.append(dict(path=str(p.relative_to(ROOT)),sha256=g.digest(p),invariants=m['invarianti']))
        groups=aggrega(m)
        obs=b.leggi(p.parent/'deck-observations.json')
        for (a,z,group),v in groups.items():
            ob=obs.get(a+'|'+z+'|'+group,{})
            played={k[5:-6]:n/ob['games'] for k,n in ob.items() if k.startswith('card/') and k.endswith('/plays') and ('bound' in k or 'character.Little' in k or 'character.Pathetic' in k)}
            out.append(dict(run=p.parent.name,a=a,b=z,group=group,share=quota(v),draws=100*v['patte']/v['partite'],turns=v['turniTotali']/v['partite'],boundPlaysPerSeat=played,**v))
        if p.parent.name.startswith('round-sb21g3b-n-') or p.parent.name.endswith('-proposta') or '-sergio-r' in p.parent.name:
            styles.extend(m['celle'])
    save(EVID/'risultati.json',dict(pairs=out,proofs=proofs))
    save(EVID/'stili.json',styles)
    concise=[]
    for who in NAMES:
        rows={r['a'].rsplit('-',1)[-1]:r for r in out if r['group']=='heur' and r['run']=='round-sb21g3b-n-'+who}
        if len(rows)!=4: continue
        n=rows['null']
        concise.append(dict(character=who,shareNull=n['share'],a=rows['a']['share'],b=rows['b']['share'],ab=rows['ab']['share'],
            deltaA=rows['a']['share']-n['share'],deltaB=rows['b']['share']-n['share'],
            deltaA50=rows['a']['share']-50,deltaB50=rows['b']['share']-50,
            drawsNull=n['draws'],drawsAB=rows['ab']['draws'],turnsNull=n['turns'],turnsAB=rows['ab']['turns']))
    old=b.leggi(EVID.parent/'sb-21g/matrice-h.json')['coppie']
    compare=[]
    for name in ('proposta','senza-parata'):
        for r in out:
            if r['run']!='round-sb21g3b-'+name: continue
            ref=next(x for x in old if x['a']==r['a'] and x['b']==r['b'] and x['gruppo']==r['group'])
            compare.append(dict(r,oldShare=ref['quota'],oldDraws=ref['percentualePatte'],oldTurns=ref['turni']))
    save(EVID/'confronto-starter.json',compare)
    save(EVID/'sonde-d33.json',concise)
    print(json.dumps(concise,ensure_ascii=False,indent=2))
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--shell',required=True); ap.add_argument('phase'); args=ap.parse_args()
    if args.phase=='prepare': prepare()
    elif args.phase=='baseline': b.misura(args.shell,'feasibility','rif',AREA/'rif.json')
    elif args.phase=='no-defense':
        no_defense_copy()
        measure(args.shell,'round','senza-parata',AREA/'senza-parata.json')
    elif args.phase=='matrix': measure(args.shell,'round','proposta',AREA/'proposta.json')
    elif args.phase in ('sergio-r1','sergio-r2'): sergio_reserve(args.shell,args.phase)
    elif args.phase=='summary': summarize()
    elif args.phase=='neutral': neutral()
    elif args.phase.startswith('n-'):
        who=args.phase[2:]; assert who in NAMES
        pref='h-'+who+'-'
        measure(args.shell,'round',args.phase,AREA/'nulle-d33.json','-Rows',','.join(pref+x for x in ('ab','a','b','null')),'-Foes',pref+'null')
    elif args.phase=='feasibility': measure(args.shell,'feasibility','sonde',AREA/'sonde.json','-Rows','h-spazienzio-ab,h-spazienzio-a,h-spazienzio-b,h-spazienzio-null','-Foes','h-spazienzio-null')
    else:
        assert args.phase in NAMES
        pref='h-'+args.phase+'-'
        measure(args.shell,'round',args.phase,AREA/'sonde.json','-Rows',','.join(pref+x for x in ('ab','a','b','null')),'-Foes',pref+'null')
if __name__=='__main__': main()


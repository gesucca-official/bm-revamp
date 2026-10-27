"""Tre schizzi originali SVG, senza asset o font esterni."""
from pathlib import Path
from html import escape
import textwrap
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/design/client-c0'
OUT.mkdir(parents=True, exist_ok=True)
PAPER, INK, AMBER = '#f5edda', '#191d22', '#ffbf47'

def text(x,y,s,size=18,fill=PAPER,weight='normal'):
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-weight="{weight}">{escape(s)}</text>'
def rect(x,y,w,h,fill='#2a313a',stroke='#53606c',r=8):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def begin(w,h,title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(title)}"><title>{escape(title)}</title><rect width="100%" height="100%" fill="{INK}"/><g font-family="Arial, Helvetica, sans-serif">'
def seat(x,y,w,name,character,hp,clock,items,notes='',own=False):
    s=rect(x,y,w,198,stroke=AMBER if own or name=='Bice' else '#617380')
    s+=f'<path d="M{x+14} {y+12}l31 -3 8 37 -39 4z" fill="{PAPER}" stroke="#111" stroke-width="3"/>'
    s+=text(x+23,y+39,name[0],27,INK,'bold')
    s+=text(x+65,y+28,name + (' · TU' if own else ' · bersaglio' if name=='Bice' else ''),20,weight='bold')
    s+=text(x+65,y+49,character,12,fill='#c4c8ce')
    s+=text(x+15,y+80,f'H {hp}   A 20   V 25   T 0   L 0',17,weight='bold')
    s+=rect(x+15,y+91,w-30,5,AMBER,AMBER,0)
    s+=text(x+15,y+123,items,13)
    s+=text(x+15,y+148,notes or 'Stati — · Immunità — · Equip —',12,fill='#a8dbdf')
    s+=text(x+15,y+179,'Mano 6 · Mazzo 12',12,fill='#c4c8ce')
    s+=text(x+w-111,y+179,'Clock ' + clock,15,AMBER,'bold')
    return s

names=['ADOPERIAMOTI','SVEGLIAMOCI MA TU NO','COSA FAI NON È UNA DOMANDA','Steal','GARGANTUESCO IMPATTO SUL TU','GARGANTUESCO IMPATTO SUL TU']
def hand(y):
    s=text(40,y-20,'LA TUA MANO · 6 CARTE',18,weight='bold')
    s+=text(700,y-20,'Tap o Invio: testo completo sotto · copie identiche = stesso nome wire',13,'#c4c8ce')
    for i,n in enumerate(names):
        x=40+i*215; yy=y-5 if i==2 else y
        s+=rect(x+4,yy+5,201,166,'#080a0d','#080a0d')+rect(x,yy,201,166,PAPER,AMBER if i==2 else '#080a0d')
        kind=['BASE · PERSISTE','BOUND · PERSISTE','REGOLARE · SCARTO','REGOLARE · SCARTO','REGOLARE · SCARTO','REGOLARE · SCARTO'][i]
        s+=text(x+12,yy+22,kind,10,INK,'bold')
        for j,line in enumerate(textwrap.wrap(n,22)): s+=text(x+12,yy+46+18*j,line,13,INK,'bold')
        s+=f'<path d="M{x+74} {yy+95}l12 -10 14 7 12 -7 18 22 -12 18 -29 -4 -15 -14z" fill="none" stroke="{INK}" stroke-width="4"/>'
        s+=text(x+12,yy+150,['Costo — · PR −1','Scarto 1 · PR 1','V 10 + A 10 · PR 2','A 10 · PR 0','V 25 · PR 0','V 25 · PR 0'][i],12,INK,'bold')
    return s

def table(ffa):
    s=begin(1366,1000,'Schizzo tavolo FFA a cinque' if ffa else 'Schizzo tavolo duello')
    s+=text(40,35,'BOTTE MICIDIALI / C0',14,AMBER,'bold')
    s+=text(40,76,'RISSA A CINQUE' if ffa else 'DUELLO AL TAVOLO',32,weight='bold')
    s+=text(1030,42,'TURNO 7 · CLOCK ≈ 24 s',18,AMBER,'bold')
    s+=text(1030,70,'Proposta · dati sintetici',14,'#c4c8ce')
    s+=rect(28,102,1310,475,'#22282e','#46505b',30)
    if ffa:
        for x,n,c,items,notes in [
            (46,'Bice','Tossico del Serraglio','Oggetti 3/3 · Peroni ×2 · Mescolone','Immunità T · Equip —'),
            (371,'Ciro','Spazienzio de la Ucciso','Oggetti 1/1 · Tennents Super','Stati — · Equip —'),
            (696,'Dado','Tossico del Serraglio','Oggetti 0/3','Timer Bad Trip 2 · Immunità —'),
            (1021,'Enea','Spazienzio de la Ucciso','Oggetti 0/1','Stati — · Equip —')]:
            s+=seat(x,122,300,n,c,100,'24 s',items,notes)
    else:
        s+=seat(420,122,526,'Bice','Tossico del Serraglio',100,'24 s','Oggetti 3/3 · Peroni ×2 · Mescolone','Immunità T · Equip —')
        s+=text(64,190,'1. SCEGLI CARTA',17,AMBER,'bold')+text(64,220,'2. INDICA BERSAGLIO',17,AMBER,'bold')
        s+=text(64,250,'3. CONTROLLA E CONFERMA',17,AMBER,'bold')
    s+=f'<path d="M680 359L672 342 691 350 710 336 704 357 724 372 702 373 693 394 681 376 660 381z" fill="none" stroke="#7d858f" stroke-width="3"/>'
    s+=text(60,372,'MOSSE ALTRUI NASCOSTE',15,'#c4c8ce','bold')
    s+=text(60,400,'Risoluzione nel centro, stato finale sul tavolo.',13,'#c4c8ce')
    s+=seat(420,360,526,'Ada','Spazienzio de la Ucciso',120,'24 s','Oggetti 0/1 · gli equip restano tra gli stati','Stato MADE OF STONE · durata 3 · CUT ×0,5',True)
    s+=f'<path d="M575 625 Q{210 if ffa else 1000} 520 {195 if ffa else 840} 325" fill="none" stroke="{AMBER}" stroke-width="3" stroke-dasharray="9 7"/>'
    s+=hand(630)
    s+=rect(40,819,775,127)
    s+=text(55,846,'COSA FAI NON È UNA DOMANDA',19,weight='bold')
    for j,line in enumerate(['Annulla mossa successiva e ne esegue solo l’effetto target usando sé',
                             'come autore; non replica self, costi, logica speciale.',
                             'Riferimento: Regolamento 1.6, R02-R07.']): s+=text(55,872+j*23,line,16)
    s+=rect(833,819,492,127)
    s+=text(850,846,'SCELTA: carta → Bice',18,AMBER,'bold')
    s+=text(850,872,'Nessuna risorsa pagata all’invio.',14,'#c4c8ce')
    s+=rect(850,886,240,44,AMBER,AMBER)+text(868,915,'CONFERMA MOSSA',16,INK,'bold')
    s+=text(1110,914,'Annulla',16)
    s+=text(40,980,'Schizzo statico · fumetto/rissa · vettori originali · clock indicativo · testo completo accessibile senza hover',13,'#c4c8ce')
    return s+'</g></svg>'

for ffa,name in [(False,'duel'),(True,'ffa-five')]: (OUT/(name+'.svg')).write_text(table(ffa),encoding='utf-8')
s=begin(760,970,'Schema carta azione con costo, priorità, tipo e testo reale')
s+=text(40,42,'BOTTE MICIDIALI / C0 · SCHEMA CARTA',18,AMBER,'bold')
s+=rect(72,82,618,822,'#050608','#050608',12)+rect(60,70,618,822,PAPER,'#080a0d',12)
s+=text(88,110,'AZIONE REGOLARE · SI SCARTA DOPO L’USO',17,INK,'bold')
s+=text(88,158,'COSA FAI NON È',32,INK,'bold')+text(88,196,'UNA DOMANDA',32,INK,'bold')
s+=rect(88,220,445,52,INK,INK)+text(104,253,'COSTO: V 10 + A 10',22,AMBER,'bold')
s+=rect(548,220,102,52,AMBER,INK)+text(562,253,'PR 2',22,INK,'bold')
s+=f'<path d="M195 365L259 328 294 360 335 333 403 345 473 443 429 501 286 485 227 436z" fill="#e1d7c1" stroke="{INK}" stroke-width="9"/>'
s+=f'<path d="M258 365L278 403M302 360L323 399M347 364L371 399M398 376L421 413M210 344L183 320M450 342L475 318M480 476L516 485" fill="none" stroke="{INK}" stroke-width="7"/>'
s+=text(88,550,'BERSAGLIO: AVVERSARIO',20,INK,'bold')
for j,line in enumerate(textwrap.wrap('Annulla mossa successiva e ne esegue solo l’effetto target usando sé come autore; non replica self, costi, logica speciale. Riferimento: Regolamento 1.6, R02-R07.',48)):
    s+=text(88,594+31*j,line,21,INK)
s+=text(88,790,'Base e bound: doppio bordo + dicitura «persiste».',16,INK)
s+=text(88,819,'Oggetto, token ed equip: etichetta esplicita distinta.',16,INK)
s+=text(88,854,'Testo completo nel pannello su click, tap o tastiera.',16,INK,'bold')
s+=text(40,939,'Cornice e segno originali · illustrazione non definitiva · niente art precedente',14,'#c4c8ce')
(OUT/'card.svg').write_text(s+'</g></svg>',encoding='utf-8')
print('Scritti duel.svg, ffa-five.svg, card.svg')

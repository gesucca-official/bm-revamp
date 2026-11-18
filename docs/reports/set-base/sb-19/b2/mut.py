import subprocess, re, glob, os, sys, json
R='E:/bm/server/src/main/java/com/gsc/bm/'
PS='C:/Users/gesucca/AppData/Local/Temp/claude/5bb3311201506e13/bf7a2af5-5395-453e-ade7-97f5028c5066/scratchpad/mvnt.ps1'
T="Sb19InPlayTest,InPlayBotsTest"
M=[
("M1 engine: block removed","model/Character.java","        if (ruleset.playground() && !isDead())\n            for (Card item","        if (false)\n            for (Card item"),
("M2 engine: applied also to the dead (R06)","model/Character.java","ruleset.playground() && !isDead()","ruleset.playground()"),
("M3 engine: newest item first","model/Character.java","for (Card item : new ArrayList<>(items))\n                for (PrintedEffects.Step step : PrintedEffects.inPlay","List<Card> rev = new ArrayList<>(items); java.util.Collections.reverse(rev);\n            for (Card item : rev)\n                for (PrintedEffects.Step step : PrintedEffects.inPlay"),
("M4 engine: applied in the live rules","model/Character.java","ruleset.playground() && !isDead()","!isDead()"),
("M5 engine: loss read as gain","model/cards/PrintedEffects.java","Kind.LOSE ? -Math.abs(step.getBase())","Kind.LOSE ? Math.abs(step.getBase())"),
("M6 loader: zero amount accepted","sim/DataCards.java","amount.base <= 0","amount.base < 0"),
("M7 loader: field accepted outside items","sim/DataCards.java",'if (kind != Kind.ITEM) throw invalid("inPlay vale solo per un oggetto (RP-28)");',''),
("M8 loader: gui.inPlay without the field accepted","sim/Draft.java",'if (!inPlay && gui.inPlay != null) throw invalid(where, "gui.inPlay senza il campo inPlay (RP-28)");',''),
("M9 bot: the worth ignores the effect","model/game/bot/StyleSupport.java","double worth = IN_PLAY_HORIZON * inPlayPerTurn(item, holderImmunities);","double worth = 0;"),
("M10 bot: T of a non-immune holder is free","model/game/bot/StyleSupport.java","(r == Resource.TOXICITY ? IN_PLAY_POISON : weight)","(r == Resource.TOXICITY ? 0 : weight)"),
("M11 bot: consumption does not avoid the effect","model/game/bot/StyleSupport.java","{ value -= inPlayPerTurn(item, mine); break; }","{ break; }"),
("M12 bot: the sale counts as a consumption","model/game/bot/StyleSupport.java","if (p.usesItem && !PrintedEffects.sells(p.card.getEffects()))","if (p.usesItem)"),
("M13 bot: stealing ignores the effect","model/game/bot/StyleSupport.java","{ value += IN_PLAY_HORIZON * inPlayPerTurn(item, mine); break; }","{ break; }"),
("M14 bot: a swap does not count what is given away","model/game/bot/StyleSupport.java","for (BotView.CardSeen item : s.me.getItems()) value -= IN_PLAY_HORIZON * inPlayPerTurn(item, mine);",""),
]
only=sys.argv[1:]
out=[]
for name,f,old,new in M:
    if only and name.split()[0] not in only: continue
    p=R+f
    s=open(p,encoding='utf-8').read()
    assert s.count(old)>=1,(name,'not found')
    open(p,'w',encoding='utf-8',newline='').write(s.replace(old,new,1))
    try:
        for x in glob.glob('E:/bm/server/target/surefire-reports/TEST-*InPlay*.xml'): os.remove(x)
        r=subprocess.run(['powershell','-NoProfile','-File',PS,'-Tests',T],capture_output=True,text=True)
        txt=r.stdout+r.stderr
        res=[]
        for x in glob.glob('E:/bm/server/target/surefire-reports/TEST-*InPlay*.xml'):
            m=re.search(r'tests="(\d+)" errors="(\d+)" skipped="\d+" failures="(\d+)"',open(x,encoding='utf-8').read())
            res.append((os.path.basename(x),m.groups()))
        failed=[l for l in txt.splitlines() if l.startswith('[ERROR]   ') and ':' in l][:3]
        verdict='KILLED' if any(int(g[1])+int(g[2])>0 for _,g in res) or 'COMPILATION' in txt else 'SURVIVED'
        out.append((name,verdict,res,failed))
        print(name,verdict,res,failed,flush=True)
    finally:
        open(p,'w',encoding='utf-8',newline='').write(s)
json.dump(out,open('C:/Users/gesucca/AppData/Local/Temp/claude/5bb3311201506e13/bf7a2af5-5395-453e-ade7-97f5028c5066/scratchpad/mut.json','w'),indent=1)

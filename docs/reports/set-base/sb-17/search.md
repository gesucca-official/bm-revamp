# Ricerca dei mazzi SB-7 — bozza.json

> SB-17 Fase B

| Voce | Valore |
|---|---|
| Bozza | `classpath:/set-base/bozza.json` |
| SHA-256 | `4ee884cf156a61572f5812d16b450f9da3247360091acfe2ab87f9b9bb2edb72` |
| Banco | sb-7/1 |
| Avversari | starter-spazienzio, starter-mara, starter-tossico, starter-pino, starter-gigi, prova-sergio |
| Stili | aggressivo, prudente, risorse: 9 coppie |
| Ricerca | (1+12), 16 partite per avversario e coppia di stili, al massimo 25 generazioni, pazienza 10, semi da 7100000 (un blocco nuovo a generazione) |
| Sostituzione | solo oltre 1,0 errori standard del mazzo in carica (SB-10a) |
| Convalida | 3 finalisti e lo starter, 300 partite per avversario e coppia di stili, semi 7900000–7900299 |
| Mutazioni | seme 7000007 combinato col personaggio |
| Tempi | nel file `.tempi.txt` accanto |

Punteggio di ricerca: (vittorie + ½ patte e limite) / partite. Quota di convalida: vittorie / (vittorie + sconfitte), Wilson al 95%. La ricerca trova ciò che **i bot** sanno giocare.

## base.character.Cesira, partenza starter

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,222 · 0,458 · 0,399 · 0,448 · 0,543 · 0,604 · 0,792 · 0,850 · 0,903 · 0,896 · 0,928 · 0,966 · 0,940 · 0,959 · 0,972 · 0,944 · 0,932 · 0,966 · 0,944 · 0,973 · 0,966 · 0,966 · 0,944 · 0,991 · 0,980 · 0,976

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,976 | 0,972 [0,970–0,975] | 0,970 | 0,954 [0,946–0,962] | 0,965 [0,957–0,971] | 0,994 [0,990–0,996] | 0,961 [0,953–0,968] | 0,961 [0,953–0,968] | 0,998 [0,995–0,999] |
| precedente | 0,983 | 0,942 [0,939–0,946] | 0,939 | 0,921 [0,910–0,930] | 0,943 [0,934–0,951] | 0,960 [0,952–0,967] | 0,928 [0,917–0,937] | 0,909 [0,897–0,919] | 0,993 [0,989–0,996] |
| precedente | 0,956 | 0,950 [0,946–0,953] | 0,946 | 0,933 [0,923–0,942] | 0,944 [0,935–0,952] | 0,966 [0,958–0,972] | 0,939 [0,930–0,948] | 0,922 [0,911–0,931] | 0,994 [0,990–0,996] |
| starter | — | 0,218 [0,212–0,225] | 0,237 | 0,387 [0,368–0,406] | 0,268 [0,251–0,286] | 0,022 [0,017–0,028] | 0,043 [0,036–0,051] | 0,174 [0,160–0,189] | 0,462 [0,442–0,483] |

Mazzo «ultimo»: bound [base.cesira.bound.Battutina, base.cesira.bound.FrecciatinaAlVolo], last resort com.last.Struggle, carte {base.com.DentiStretti=1, base.com.Sgambetto=1, base.com.Spintone=1, base.com.SputoDaPosacenere=2, base.items.AmaroNelBicchiereDiPlastica=1, base.items.GhiaccioNelTovagliolo=1, base.items.GiubbottoDiFintaPelle=2, base.mara.Sgommata=2, base.pino.GoingBerserk=2, base.pino.PrimaIlBrindisi=1, bruiser.SeagullFly=1, bruiser.StunningBlow=1, com.items.AnotherRottenBeer=1, com.items.CocktailOnTheGround=2, junkie.ToxicBloodDrain=1}.
Rispetto allo starter: −2 base.cesira.ContoSalato, −2 base.cesira.FareIlVago, −2 base.cesira.LoSapevo, −1 base.cesira.Malelingue, −2 base.cesira.OhGuardaLa, −2 base.cesira.Ricatto, −1 base.com.AcquaInFaccia, +1 base.com.DentiStretti, −1 base.com.ShuffleFeet, +1 base.com.Spintone, +2 base.com.SputoDaPosacenere, −1 base.com.TartarugaSulMarciapiede, +1 base.items.AmaroNelBicchiereDiPlastica, −2 base.items.EspressoDelDistributore, +1 base.items.GhiaccioNelTovagliolo, +2 base.items.GiubbottoDiFintaPelle, −1 base.items.SantinoDellaPortinaia, +2 base.mara.Sgommata, +2 base.pino.GoingBerserk, +1 base.pino.PrimaIlBrindisi, +1 bruiser.SeagullFly, −1 bruiser.StunningBlow, +1 com.items.AnotherRottenBeer, +2 com.items.CocktailOnTheGround, +1 junkie.ToxicBloodDrain, bound [base.cesira.bound.Battutina, base.cesira.bound.FrecciatinaAlVolo].
Scarto ricerca − convalida (punteggio): 0,006.

## base.character.Cesira, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,211 · 0,533 · 0,712 · 0,788 · 0,880 · 0,947 · 0,928 · 0,935 · 0,959 · 0,929 · 0,966 · 0,965 · 0,934 · 0,950 · 0,950 · 0,960 · 0,968 · 0,961 · 0,932 · 0,968 · 0,950 · 0,946 · 0,929 · 0,946 · 0,940 · 0,941

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,941 | 0,929 [0,925–0,933] | 0,922 | 0,911 [0,900–0,921] | 0,927 [0,916–0,936] | 0,897 [0,885–0,908] | 0,940 [0,930–0,948] | 0,901 [0,889–0,912] | 0,998 [0,996–0,999] |
| precedente | 0,948 | 0,941 [0,937–0,945] | 0,937 | 0,930 [0,920–0,939] | 0,944 [0,934–0,952] | 0,933 [0,922–0,942] | 0,939 [0,930–0,948] | 0,901 [0,889–0,911] | 0,999 [0,997–1,000] |
| precedente | 0,944 | 0,945 [0,941–0,949] | 0,941 | 0,915 [0,903–0,925] | 0,959 [0,951–0,966] | 0,938 [0,928–0,946] | 0,959 [0,950–0,966] | 0,901 [0,889–0,911] | 1,000 [0,998–1,000] |
| starter | — | 0,218 [0,212–0,225] | 0,237 | 0,387 [0,368–0,406] | 0,268 [0,251–0,286] | 0,022 [0,017–0,028] | 0,043 [0,036–0,051] | 0,174 [0,160–0,189] | 0,462 [0,442–0,483] |

Mazzo «ultimo»: bound [base.cesira.bound.Battutina, base.cesira.bound.FrecciatinaAlVolo], last resort com.last.Struggle, carte {base.cesira.LoSapevo=1, base.com.MattoneDelCantiere=1, base.gigi.ChiaveDaTredici=1, base.items.AmaroNelBicchiereDiPlastica=1, base.items.EspressoDelDistributore=1, base.items.GhiaccioNelTovagliolo=1, base.items.GiubbottoDiFintaPelle=1, base.items.GuantiDaOfficina=1, base.items.PaninoDelKebab=2, base.mara.CinghiataDiTraverso=1, base.mara.Sgommata=1, base.mara.SorpassoInCurva=1, base.pino.GoingBerserk=2, base.pino.OffroIo=1, bruiser.BreakYourToy=2, bruiser.Glare=1, bruiser.StunningBlow=1}.
Rispetto allo starter: −2 base.cesira.ContoSalato, −2 base.cesira.FareIlVago, −1 base.cesira.LoSapevo, −1 base.cesira.Malelingue, −2 base.cesira.OhGuardaLa, −2 base.cesira.Ricatto, −1 base.com.AcquaInFaccia, +1 base.com.MattoneDelCantiere, −1 base.com.Sgambetto, −1 base.com.ShuffleFeet, −1 base.com.TartarugaSulMarciapiede, +1 base.gigi.ChiaveDaTredici, +1 base.items.AmaroNelBicchiereDiPlastica, −1 base.items.EspressoDelDistributore, +1 base.items.GhiaccioNelTovagliolo, +1 base.items.GiubbottoDiFintaPelle, +1 base.items.GuantiDaOfficina, +2 base.items.PaninoDelKebab, −1 base.items.SantinoDellaPortinaia, +1 base.mara.CinghiataDiTraverso, +1 base.mara.Sgommata, +1 base.mara.SorpassoInCurva, +2 base.pino.GoingBerserk, +1 base.pino.OffroIo, +2 bruiser.BreakYourToy, +1 bruiser.Glare, −1 bruiser.StunningBlow, bound [base.cesira.bound.Battutina, base.cesira.bound.FrecciatinaAlVolo].
Scarto ricerca − convalida (punteggio): 0,019.

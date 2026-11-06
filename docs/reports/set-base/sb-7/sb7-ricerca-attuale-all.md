# Ricerca dei mazzi SB-7 — attuale.json

> Prima ricerca SB-7: dati di prova, non di bilanciamento.

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/sb-6a/attuale.json` |
| SHA-256 | `123c880d37792fd28ec6b6b5f615b48928b499e174107673304954ef491ab293` |
| Banco | sb-7/1 |
| Avversari | starter-bruiser, starter-junkie |
| Stili | aggressivo, prudente, risorse: 9 coppie |
| Ricerca | (1+12), 16 partite per avversario e coppia di stili, al massimo 40 generazioni, pazienza 10, semi da 7100000 (un blocco nuovo a generazione) |
| Convalida | 3 finalisti e lo starter, 300 partite per avversario e coppia di stili, semi 7900000–7900299 |
| Mutazioni | seme 7000007 combinato col personaggio |
| Tempi | nel file `.tempi.txt` accanto |

Punteggio di ricerca: (vittorie + ½ patte e limite) / partite. Quota di convalida: vittorie / (vittorie + sconfitte), Wilson al 95%. La ricerca trova ciò che **i bot** sanno giocare.

## bruiser.character.BigBadBruiser, partenza starter

Generazioni: 40; arresto: numero massimo di generazioni (40).

Punteggio del migliore a ogni generazione: 0,274 · 0,339 · 0,391 · 0,410 · 0,420 · 0,438 · 0,464 · 0,550 · 0,523 · 0,616 · 0,590 · 0,637 · 0,594 · 0,543 · 0,696 · 0,557 · 0,594 · 0,552 · 0,542 · 0,599 · 0,637 · 0,648 · 0,649 · 0,580 · 0,545 · 0,557 · 0,542 · 0,477 · 0,547 · 0,399 · 0,420 · 0,521 · 0,507 · 0,516 · 0,514 · 0,569 · 0,585 · 0,587 · 0,585 · 0,559 · 0,566

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-bruiser | contro starter-junkie |
|---|---:|---|---:|---|---|
| ultimo | 0,566 | 0,541 [0,527–0,555] | 0,535 | 0,820 [0,804–0,835] | 0,273 [0,255–0,291] |
| precedente | 0,616 | 0,639 [0,625–0,653] | 0,614 | 0,848 [0,833–0,863] | 0,414 [0,393–0,435] |
| precedente | 0,589 | 0,566 [0,551–0,580] | 0,555 | 0,842 [0,827–0,857] | 0,279 [0,260–0,298] |
| starter | — | 0,223 [0,212–0,235] | 0,255 | 0,472 [0,451–0,494] | 0,019 [0,015–0,025] |

Mazzo «ultimo»: bound [bruiser.character.LittleRage, bruiser.character.LittleSmack], last resort com.last.Struggle, carte {bruiser.BadEducation=1, bruiser.BreakYourToy=1, bruiser.Glare=1, bruiser.HealingBlow=1, bruiser.MadeOfStone=1, bruiser.SeagullFly=1, bruiser.SickeningBlow=1, bruiser.SuperImpact=2, com.ShuffleFeet=1, com.items.CocktailOnTheGround=1, com.items.MarvelousCocktail=2, junkie.AmphetamineReflexes=1, junkie.Cough=1, junkie.GoingBerserk=2, junkie.MethDrivenRage=2, junkie.ToxicBloodDrain=1}.
Rispetto allo starter: −1 bruiser.CantFeelAnything, −2 bruiser.ExtremelyViolentBlow, −1 bruiser.Glare, −2 bruiser.StunningBlow, +1 bruiser.SuperImpact, −1 bruiser.WhatchaDoin, −2 bruiser.YouStop, +1 com.ShuffleFeet, −1 com.items.CocktailOnTheGround, +2 com.items.MarvelousCocktail, −1 com.items.RottenBeer, +1 junkie.AmphetamineReflexes, +1 junkie.Cough, +2 junkie.GoingBerserk, +2 junkie.MethDrivenRage, +1 junkie.ToxicBloodDrain.
Scarto ricerca − convalida (punteggio): 0,031.

## bruiser.character.BigBadBruiser, partenza casuale

Generazioni: 40; arresto: numero massimo di generazioni (40).

Punteggio del migliore a ogni generazione: 0,340 · 0,410 · 0,385 · 0,413 · 0,392 · 0,441 · 0,453 · 0,465 · 0,533 · 0,523 · 0,516 · 0,595 · 0,519 · 0,488 · 0,547 · 0,486 · 0,543 · 0,481 · 0,503 · 0,509 · 0,535 · 0,595 · 0,580 · 0,602 · 0,616 · 0,601 · 0,535 · 0,545 · 0,602 · 0,594 · 0,556 · 0,569 · 0,509 · 0,597 · 0,608 · 0,594 · 0,592 · 0,441 · 0,556 · 0,575 · 0,554

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-bruiser | contro starter-junkie |
|---|---:|---|---:|---|---|
| ultimo | 0,554 | 0,499 [0,484–0,513] | 0,499 | 0,721 [0,702–0,739] | 0,273 [0,255–0,292] |
| precedente | 0,590 | 0,486 [0,472–0,500] | 0,488 | 0,816 [0,800–0,831] | 0,159 [0,145–0,175] |
| precedente | 0,582 | 0,568 [0,554–0,583] | 0,557 | 0,845 [0,830–0,859] | 0,268 [0,250–0,287] |
| starter | — | 0,223 [0,212–0,235] | 0,255 | 0,472 [0,451–0,494] | 0,019 [0,015–0,025] |

Mazzo «ultimo»: bound [bruiser.character.LittleRage, bruiser.character.LittleSmack], last resort com.last.Struggle, carte {bruiser.Glare=1, bruiser.HealingBlow=2, bruiser.MadeOfStone=2, bruiser.SuperImpact=2, bruiser.YouStop=1, com.ShuffleFeet=1, com.items.CocktailOnTheGround=1, com.items.MarvelousCocktail=2, com.items.RottenBeer=1, junkie.AmphetamineReflexes=1, junkie.BadTrip=1, junkie.BeggingMoney=1, junkie.GoingBerserk=1, junkie.MethDrivenRage=2, junkie.ToxicBloodDrain=1}.
Rispetto allo starter: −1 bruiser.BadEducation, −1 bruiser.BreakYourToy, −1 bruiser.CantFeelAnything, −2 bruiser.ExtremelyViolentBlow, −1 bruiser.Glare, +1 bruiser.HealingBlow, +1 bruiser.MadeOfStone, −1 bruiser.SeagullFly, −1 bruiser.SickeningBlow, −2 bruiser.StunningBlow, +1 bruiser.SuperImpact, −1 bruiser.WhatchaDoin, −1 bruiser.YouStop, +1 com.ShuffleFeet, −1 com.items.CocktailOnTheGround, +2 com.items.MarvelousCocktail, +1 junkie.AmphetamineReflexes, +1 junkie.BadTrip, +1 junkie.BeggingMoney, +1 junkie.GoingBerserk, +2 junkie.MethDrivenRage, +1 junkie.ToxicBloodDrain.
Scarto ricerca − convalida (punteggio): 0,055.

## junkie.character.ToxicJunkie, partenza starter

Generazioni: 40; arresto: numero massimo di generazioni (40).

Punteggio del migliore a ogni generazione: 0,736 · 0,785 · 0,823 · 0,828 · 0,839 · 0,842 · 0,878 · 0,908 · 0,939 · 0,934 · 0,951 · 0,953 · 0,955 · 0,924 · 0,953 · 0,970 · 0,960 · 0,958 · 0,965 · 0,976 · 0,962 · 0,941 · 0,970 · 0,981 · 0,988 · 0,948 · 0,969 · 0,970 · 0,981 · 0,974 · 0,976 · 0,983 · 0,981 · 0,983 · 0,970 · 0,990 · 0,997 · 0,983 · 0,997 · 0,972 · 0,984

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-bruiser | contro starter-junkie |
|---|---:|---|---:|---|---|
| ultimo | 0,984 | 0,987 [0,984–0,990] | 0,971 | 0,992 [0,988–0,995] | 0,982 [0,976–0,986] |
| precedente | 0,988 | 0,987 [0,984–0,990] | 0,974 | 0,989 [0,985–0,993] | 0,985 [0,980–0,989] |
| precedente | 0,983 | 0,979 [0,975–0,983] | 0,962 | 0,992 [0,988–0,995] | 0,966 [0,958–0,972] |
| starter | — | 0,782 [0,770–0,794] | 0,733 | 0,984 [0,978–0,988] | 0,495 [0,472–0,518] |

Mazzo «ultimo»: bound [junkie.character.PatheticBlade, junkie.character.RottenSmile], last resort com.last.Struggle, carte {bruiser.BadEducation=1, bruiser.ExtremelyViolentBlow=1, bruiser.HealingBlow=2, bruiser.MadeOfStone=1, bruiser.SeagullFly=2, com.Grab=1, com.ShuffleFeet=1, com.Steal=1, com.items.CocktailOnTheGround=2, junkie.AmphetamineReflexes=1, junkie.BadTrip=1, junkie.BeggingMoney=2, junkie.Cough=1, junkie.GoingBerserk=1, junkie.PervertedMetabolism=1, junkie.ToxicBloodDrain=1}.
Rispetto allo starter: +1 bruiser.BadEducation, +1 bruiser.ExtremelyViolentBlow, +2 bruiser.HealingBlow, +1 bruiser.MadeOfStone, +2 bruiser.SeagullFly, −1 com.Grab, −1 com.Steal, −2 com.items.AnotherRottenBeer, +2 com.items.CocktailOnTheGround, −1 com.items.MarvelousCocktail, −2 com.items.RottenBeer, −1 junkie.AmphetamineReflexes, +2 junkie.BeggingMoney, −1 junkie.EverythingIsDrug, −1 junkie.LethalHeroinDose, −1 junkie.MethDrivenRage.
Scarto ricerca − convalida (punteggio): 0,013.

## junkie.character.ToxicJunkie, partenza casuale

Generazioni: 40; arresto: numero massimo di generazioni (40).

Punteggio del migliore a ogni generazione: 0,500 · 0,701 · 0,939 · 0,929 · 0,953 · 0,970 · 0,939 · 0,960 · 0,965 · 0,976 · 0,953 · 0,967 · 0,983 · 0,950 · 0,981 · 0,976 · 0,969 · 0,974 · 0,984 · 0,983 · 0,967 · 0,943 · 0,958 · 0,974 · 0,986 · 0,964 · 0,976 · 0,972 · 0,983 · 0,986 · 0,970 · 0,976 · 0,974 · 0,970 · 0,964 · 0,974 · 0,967 · 0,964 · 0,984 · 0,969 · 0,979

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-bruiser | contro starter-junkie |
|---|---:|---|---:|---|---|
| ultimo | 0,979 | 0,984 [0,980–0,987] | 0,964 | 0,991 [0,986–0,994] | 0,977 [0,971–0,982] |
| precedente | 0,984 | 0,975 [0,971–0,979] | 0,954 | 0,992 [0,988–0,995] | 0,957 [0,949–0,965] |
| precedente | 0,974 | 0,963 [0,958–0,968] | 0,939 | 0,967 [0,959–0,973] | 0,959 [0,951–0,967] |
| starter | — | 0,782 [0,770–0,794] | 0,733 | 0,984 [0,978–0,988] | 0,495 [0,472–0,518] |

Mazzo «ultimo»: bound [junkie.character.PatheticBlade, junkie.character.RottenSmile], last resort com.last.Struggle, carte {bruiser.ExtremelyViolentBlow=2, bruiser.HealingBlow=2, bruiser.MadeOfStone=2, bruiser.SeagullFly=1, bruiser.SickeningBlow=1, bruiser.WhatchaDoin=1, bruiser.YouStop=1, com.Grab=1, com.Steal=1, com.items.CocktailOnTheGround=2, junkie.AmphetamineReflexes=1, junkie.BadTrip=1, junkie.Cough=1, junkie.GoingBerserk=1, junkie.LethalHeroinDose=1, junkie.ToxicBloodDrain=1}.
Rispetto allo starter: +2 bruiser.ExtremelyViolentBlow, +2 bruiser.HealingBlow, +2 bruiser.MadeOfStone, +1 bruiser.SeagullFly, +1 bruiser.SickeningBlow, +1 bruiser.WhatchaDoin, +1 bruiser.YouStop, −1 com.Grab, −1 com.ShuffleFeet, −1 com.Steal, −2 com.items.AnotherRottenBeer, +2 com.items.CocktailOnTheGround, −1 com.items.MarvelousCocktail, −2 com.items.RottenBeer, −1 junkie.AmphetamineReflexes, −1 junkie.EverythingIsDrug, −1 junkie.MethDrivenRage, −1 junkie.PervertedMetabolism.
Scarto ricerca − convalida (punteggio): 0,015.

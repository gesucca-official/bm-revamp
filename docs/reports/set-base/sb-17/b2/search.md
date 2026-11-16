# Ricerca dei mazzi SB-7 — bozza.json

> SB-17 Fase B

| Voce | Valore |
|---|---|
| Bozza | `classpath:/set-base/bozza.json` |
| SHA-256 | `ccf5d96cea29b4f06c934da3cf07aec39ca4792d46c64968d9160cead5306589` |
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

Punteggio del migliore a ogni generazione: 0,433 · 0,524 · 0,703 · 0,851 · 0,733 · 0,791 · 0,878 · 0,885 · 0,904 · 0,890 · 0,896 · 0,907 · 0,946 · 0,946 · 0,936 · 0,922 · 0,938 · 0,949 · 0,944 · 0,958 · 0,969 · 0,968 · 0,994 · 0,992 · 0,976 · 0,990

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,990 | 0,989 [0,987–0,990] | 0,987 | 0,990 [0,985–0,993] | 0,989 [0,985–0,993] | 0,995 [0,991–0,997] | 0,988 [0,983–0,992] | 0,975 [0,969–0,980] | 0,996 [0,993–0,998] |
| precedente | 0,985 | 0,985 [0,983–0,987] | 0,984 | 0,974 [0,968–0,980] | 0,984 [0,978–0,988] | 0,996 [0,993–0,998] | 0,988 [0,983–0,991] | 0,980 [0,974–0,985] | 0,988 [0,983–0,992] |
| precedente | 0,972 | 0,988 [0,987–0,990] | 0,987 | 0,986 [0,981–0,990] | 0,983 [0,977–0,987] | 0,995 [0,991–0,997] | 0,994 [0,990–0,996] | 0,978 [0,972–0,983] | 0,995 [0,991–0,997] |
| starter | — | 0,439 [0,431–0,447] | 0,442 | 0,609 [0,590–0,627] | 0,488 [0,469–0,508] | 0,264 [0,247–0,282] | 0,323 [0,305–0,341] | 0,422 [0,403–0,441] | 0,522 [0,502–0,541] |

Mazzo «ultimo»: bound [base.cesira.bound.FrecciatinaAlVolo, base.cesira.bound.MiInformo], last resort com.last.Struggle, carte {base.cesira.LoSannoTutti=1, base.cesira.Ricatto=1, base.com.SputoDaPosacenere=2, base.gigi.UnaStrettaDiProva=2, base.items.AmaroNelBicchiereDiPlastica=1, base.items.CascoDaLavoro=2, base.items.EspressoDelDistributore=2, base.items.GhiaccioNelTovagliolo=2, base.mara.Sgommata=1, base.pino.GoingBerserk=2, base.tossico.UnAssaggino=1, bruiser.SeagullFly=2, com.items.RottenBeer=1}.
Rispetto allo starter: −2 base.cesira.ContoSalato, −1 base.cesira.LoSannoTutti, −2 base.cesira.LoSapevo, −1 base.cesira.Malelingue, −2 base.cesira.OhGuardaLa, −1 base.cesira.Ricatto, −1 base.com.AcquaInFaccia, −1 base.com.Sgambetto, −1 base.com.Spintone, +2 base.com.SputoDaPosacenere, −2 base.com.TartarugaSulMarciapiede, +2 base.gigi.UnaStrettaDiProva, +1 base.items.AmaroNelBicchiereDiPlastica, +2 base.items.CascoDaLavoro, +2 base.items.GhiaccioNelTovagliolo, −1 base.items.SantinoDellaPortinaia, +1 base.mara.Sgommata, +2 base.pino.GoingBerserk, +1 base.tossico.UnAssaggino, +2 bruiser.SeagullFly, −1 bruiser.StunningBlow, +1 com.items.RottenBeer, bound [base.cesira.bound.FrecciatinaAlVolo, base.cesira.bound.MiInformo].
Scarto ricerca − convalida (punteggio): 0,002.

## base.character.Cesira, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,171 · 0,495 · 0,690 · 0,775 · 0,861 · 0,940 · 0,931 · 0,906 · 0,961 · 0,954 · 0,967 · 0,974 · 0,985 · 0,983 · 0,989 · 0,991 · 0,987 · 0,981 · 0,972 · 0,989 · 0,991 · 0,984 · 0,983 · 0,992 · 0,997 · 0,998

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,998 | 0,996 [0,995–0,997] | 0,994 | 0,991 [0,987–0,994] | 0,994 [0,991–0,997] | 0,999 [0,996–0,999] | 0,999 [0,997–1,000] | 0,996 [0,993–0,998] | 0,994 [0,991–0,997] |
| precedente | 0,992 | 0,993 [0,992–0,994] | 0,991 | 0,990 [0,985–0,993] | 0,997 [0,994–0,998] | 0,993 [0,989–0,996] | 0,993 [0,989–0,995] | 0,991 [0,987–0,994] | 0,995 [0,992–0,997] |
| precedente | 0,990 | 0,990 [0,988–0,991] | 0,988 | 0,978 [0,972–0,983] | 0,986 [0,981–0,990] | 1,000 [0,998–1,000] | 0,993 [0,989–0,995] | 0,988 [0,983–0,991] | 0,996 [0,993–0,998] |
| starter | — | 0,439 [0,431–0,447] | 0,442 | 0,609 [0,590–0,627] | 0,488 [0,469–0,508] | 0,264 [0,247–0,282] | 0,323 [0,305–0,341] | 0,422 [0,403–0,441] | 0,522 [0,502–0,541] |

Mazzo «ultimo»: bound [base.cesira.bound.FrecciatinaAlVolo, base.cesira.bound.MiInformo], last resort com.last.Struggle, carte {base.com.MattoneDelCantiere=1, base.com.SputoDaPosacenere=1, base.gigi.ColpoDiChiaveInglese=1, base.items.AmaroNelBicchiereDiPlastica=1, base.items.CascoDaLavoro=2, base.items.EspressoDelDistributore=1, base.items.GhiaccioNelTovagliolo=2, base.items.PaninoDelKebab=2, base.items.PasticcaTrovataSulBancone=1, base.mara.CinghiataDiTraverso=1, base.mara.Sgommata=1, base.pino.GoingBerserk=2, base.tossico.UnAssaggino=1, bruiser.SeagullFly=1, com.items.CocktailOnTheGround=1, com.items.MarvelousCocktail=1}.
Rispetto allo starter: −2 base.cesira.ContoSalato, −2 base.cesira.LoSannoTutti, −2 base.cesira.LoSapevo, −1 base.cesira.Malelingue, −2 base.cesira.OhGuardaLa, −2 base.cesira.Ricatto, −1 base.com.AcquaInFaccia, +1 base.com.MattoneDelCantiere, −1 base.com.Sgambetto, −1 base.com.Spintone, +1 base.com.SputoDaPosacenere, −2 base.com.TartarugaSulMarciapiede, +1 base.gigi.ColpoDiChiaveInglese, +1 base.items.AmaroNelBicchiereDiPlastica, +2 base.items.CascoDaLavoro, −1 base.items.EspressoDelDistributore, +2 base.items.GhiaccioNelTovagliolo, +2 base.items.PaninoDelKebab, +1 base.items.PasticcaTrovataSulBancone, −1 base.items.SantinoDellaPortinaia, +1 base.mara.CinghiataDiTraverso, +1 base.mara.Sgommata, +2 base.pino.GoingBerserk, +1 base.tossico.UnAssaggino, +1 bruiser.SeagullFly, −1 bruiser.StunningBlow, +1 com.items.CocktailOnTheGround, +1 com.items.MarvelousCocktail, bound [base.cesira.bound.FrecciatinaAlVolo, base.cesira.bound.MiInformo].
Scarto ricerca − convalida (punteggio): 0,003.

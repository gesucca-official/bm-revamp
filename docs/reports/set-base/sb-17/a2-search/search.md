# Ricerca dei mazzi SB-7 — bozza.json

> SB-17 Fase A2, ricerca di diagnosi

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

## bruiser.character.BigBadBruiser, partenza starter

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,474 · 0,667 · 0,708 · 0,777 · 0,810 · 0,839 · 0,830 · 0,842 · 0,926 · 0,834 · 0,844 · 0,862 · 0,883 · 0,914 · 0,904 · 0,854 · 0,902 · 0,887 · 0,888 · 0,923 · 0,873 · 0,917 · 0,875 · 0,931 · 0,933 · 0,920

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,920 | 0,885 [0,880–0,889] | 0,878 | 0,899 [0,887–0,910] | 0,792 [0,776–0,807] | 0,915 [0,903–0,925] | 0,843 [0,828–0,856] | 0,885 [0,872–0,896] | 0,975 [0,969–0,980] |
| precedente | 0,900 | 0,883 [0,878–0,888] | 0,876 | 0,905 [0,893–0,915] | 0,765 [0,749–0,781] | 0,896 [0,884–0,907] | 0,863 [0,849–0,875] | 0,892 [0,879–0,903] | 0,975 [0,969–0,981] |
| precedente | 0,885 | 0,868 [0,862–0,873] | 0,863 | 0,830 [0,816–0,844] | 0,832 [0,817–0,846] | 0,913 [0,902–0,923] | 0,815 [0,800–0,830] | 0,828 [0,814–0,842] | 0,986 [0,981–0,990] |
| starter | — | 0,470 [0,462–0,478] | 0,471 | 0,527 [0,507–0,546] | 0,420 [0,402–0,439] | 0,381 [0,362–0,400] | 0,382 [0,364–0,401] | 0,477 [0,458–0,496] | 0,639 [0,620–0,657] |

Mazzo «ultimo»: bound [base.spazienzio.bound.TestaAlMuro, bruiser.character.LittleSmack], last resort com.last.Struggle, carte {base.cesira.ContoSalato=1, base.cesira.Malelingue=1, base.com.MattoneDelCantiere=1, base.com.SputoDaPosacenere=1, base.gigi.LavoroFattoBene=1, base.items.GhiaccioNelTovagliolo=2, base.items.GuantiDaOfficina=1, base.mara.Sgommata=2, base.pino.GoingBerserk=2, base.tossico.UnAssaggino=1, bruiser.BreakYourToy=1, bruiser.SeagullFly=2, bruiser.SuperImpact=1, com.Grab=1, com.items.AnotherRottenBeer=1, com.items.CocktailOnTheGround=1}.
Rispetto allo starter: −1 base.bruiser.TiFaccioSpazio, +1 base.cesira.ContoSalato, +1 base.cesira.Malelingue, −1 base.com.DentiStretti, +1 base.com.SputoDaPosacenere, −2 base.com.TartarugaSulMarciapiede, +1 base.gigi.LavoroFattoBene, +2 base.items.GhiaccioNelTovagliolo, +1 base.items.GuantiDaOfficina, −1 base.items.PosacenereDiVetro, +2 base.mara.Sgommata, +2 base.pino.GoingBerserk, +1 base.tossico.UnAssaggino, +1 bruiser.BreakYourToy, −1 bruiser.ExtremelyViolentBlow, −2 bruiser.Glare, −1 bruiser.HealingBlow, −2 bruiser.MadeOfStone, −1 bruiser.SuperImpact, −2 bruiser.YouStop, +1 com.Grab, +1 com.items.AnotherRottenBeer, −1 com.items.CocktailOnTheGround, bound [base.spazienzio.bound.TestaAlMuro, bruiser.character.LittleSmack].
Scarto ricerca − convalida (punteggio): 0,041.

## bruiser.character.BigBadBruiser, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,002 · 0,067 · 0,197 · 0,499 · 0,580 · 0,785 · 0,769 · 0,802 · 0,859 · 0,859 · 0,865 · 0,865 · 0,899 · 0,904 · 0,921 · 0,887 · 0,943 · 0,933 · 0,909 · 0,925 · 0,957 · 0,995 · 0,975 · 0,994 · 0,964 · 0,966

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,966 | 0,954 [0,951–0,957] | 0,950 | 0,944 [0,935–0,952] | 0,903 [0,891–0,914] | 0,986 [0,981–0,990] | 0,938 [0,928–0,947] | 0,960 [0,952–0,967] | 0,992 [0,988–0,995] |
| precedente | 0,987 | 0,975 [0,972–0,977] | 0,970 | 0,983 [0,977–0,987] | 0,937 [0,927–0,946] | 0,988 [0,983–0,991] | 0,955 [0,947–0,963] | 0,985 [0,979–0,989] | 1,000 [0,999–1,000] |
| precedente | 0,960 | 0,950 [0,947–0,953] | 0,946 | 0,954 [0,946–0,962] | 0,902 [0,890–0,913] | 0,972 [0,965–0,977] | 0,920 [0,910–0,930] | 0,952 [0,943–0,960] | 1,000 [0,998–1,000] |
| starter | — | 0,470 [0,462–0,478] | 0,471 | 0,527 [0,507–0,546] | 0,420 [0,402–0,439] | 0,381 [0,362–0,400] | 0,382 [0,364–0,401] | 0,477 [0,458–0,496] | 0,639 [0,620–0,657] |

Mazzo «ultimo»: bound [bruiser.character.LittleRage, bruiser.character.LittleSmack], last resort com.last.Struggle, carte {base.cesira.ContoSalato=1, base.com.Spintone=1, base.gigi.ChiaveDaTredici=1, base.items.AmaroNelBicchiereDiPlastica=1, base.items.CascoDaLavoro=1, base.items.EspressoDelDistributore=1, base.items.PaninoDelKebab=1, base.items.PasticcaTrovataSulBancone=1, base.mara.Sgommata=2, base.pino.GoingBerserk=2, base.pino.OffroIo=1, bruiser.SeagullFly=2, com.Steal=1, com.items.AnotherRottenBeer=2, com.items.CocktailOnTheGround=1, junkie.AmphetamineReflexes=1}.
Rispetto allo starter: −1 base.bruiser.TiFaccioSpazio, +1 base.cesira.ContoSalato, −1 base.com.DentiStretti, −1 base.com.MattoneDelCantiere, +1 base.com.Spintone, −2 base.com.TartarugaSulMarciapiede, +1 base.gigi.ChiaveDaTredici, +1 base.items.AmaroNelBicchiereDiPlastica, +1 base.items.CascoDaLavoro, +1 base.items.EspressoDelDistributore, +1 base.items.PaninoDelKebab, +1 base.items.PasticcaTrovataSulBancone, −1 base.items.PosacenereDiVetro, +2 base.mara.Sgommata, +2 base.pino.GoingBerserk, +1 base.pino.OffroIo, −1 bruiser.ExtremelyViolentBlow, −2 bruiser.Glare, −1 bruiser.HealingBlow, −2 bruiser.MadeOfStone, −2 bruiser.SuperImpact, −2 bruiser.YouStop, +1 com.Steal, +2 com.items.AnotherRottenBeer, −1 com.items.CocktailOnTheGround, +1 junkie.AmphetamineReflexes.
Scarto ricerca − convalida (punteggio): 0,016.

## base.character.Mara, partenza starter

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,545 · 0,577 · 0,598 · 0,741 · 0,679 · 0,737 · 0,710 · 0,698 · 0,700 · 0,770 · 0,773 · 0,895 · 0,887 · 0,859 · 0,863 · 0,848 · 0,902 · 0,919 · 0,896 · 0,929 · 0,913 · 0,931 · 0,937 · 0,951 · 0,965 · 0,944

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,944 | 0,956 [0,953–0,960] | 0,945 | 0,960 [0,951–0,966] | 0,907 [0,895–0,917] | 0,965 [0,958–0,972] | 0,958 [0,949–0,965] | 0,957 [0,949–0,964] | 0,991 [0,987–0,994] |
| precedente | 0,915 | 0,916 [0,911–0,920] | 0,908 | 0,906 [0,894–0,916] | 0,879 [0,866–0,891] | 0,937 [0,927–0,945] | 0,908 [0,896–0,918] | 0,877 [0,864–0,889] | 0,989 [0,984–0,992] |
| precedente | 0,914 | 0,929 [0,924–0,932] | 0,917 | 0,910 [0,898–0,920] | 0,889 [0,877–0,901] | 0,937 [0,927–0,946] | 0,935 [0,925–0,944] | 0,914 [0,902–0,924] | 0,987 [0,982–0,991] |
| starter | — | 0,534 [0,526–0,542] | 0,532 | 0,584 [0,565–0,603] | 0,474 [0,455–0,494] | 0,433 [0,414–0,453] | 0,611 [0,592–0,630] | 0,380 [0,362–0,399] | 0,727 [0,709–0,744] |

Mazzo «ultimo»: bound [base.mara.bound.CambioMarcia, base.mara.bound.PassoStretto], last resort com.last.Struggle, carte {base.com.Spintone=1, base.com.SputoDaPosacenere=1, base.items.CascoDaLavoro=1, base.items.EspressoDelDistributore=1, base.items.GiubbottoDiFintaPelle=1, base.items.GuantiDaOfficina=2, base.items.PaninoDelKebab=1, base.items.PosacenereDiVetro=2, base.items.SantinoDellaPortinaia=1, base.mara.CinghiataDiTraverso=1, base.mara.Sgommata=2, base.mara.SorpassoInCurva=1, base.pino.GoingBerserk=1, base.pino.OffroIo=1, com.items.AnotherRottenBeer=1, com.items.RottenBeer=2}.
Rispetto allo starter: −1 base.com.SputoDaPosacenere, −1 base.com.TartarugaSulMarciapiede, +1 base.items.CascoDaLavoro, −1 base.items.EspressoDelDistributore, −1 base.items.GhiaccioNelTovagliolo, +2 base.items.GuantiDaOfficina, −1 base.items.PaninoDelKebab, +2 base.items.PosacenereDiVetro, +1 base.items.SantinoDellaPortinaia, −2 base.mara.Slalom, −1 base.mara.SorpassoInCurva, −1 base.mara.TiStringoLaCurva, −2 base.mara.TraDueParaurti, +1 base.pino.GoingBerserk, +1 base.pino.OffroIo, +1 com.items.AnotherRottenBeer, +2 com.items.RottenBeer.
Scarto ricerca − convalida (punteggio): -0,000.

## base.character.Mara, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,142 · 0,208 · 0,307 · 0,345 · 0,511 · 0,663 · 0,644 · 0,774 · 0,824 · 0,867 · 0,865 · 0,880 · 0,856 · 0,818 · 0,810 · 0,779 · 0,839 · 0,826 · 0,844 · 0,871 · 0,847 · 0,821 · 0,864 · 0,878 · 0,844 · 0,809

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,809 | 0,882 [0,877–0,887] | 0,875 | 0,882 [0,869–0,893] | 0,798 [0,783–0,813] | 0,914 [0,902–0,924] | 0,853 [0,839–0,866] | 0,851 [0,837–0,864] | 0,994 [0,990–0,996] |
| precedente | 0,843 | 0,844 [0,838–0,849] | 0,838 | 0,839 [0,824–0,852] | 0,730 [0,713–0,747] | 0,898 [0,885–0,909] | 0,842 [0,828–0,856] | 0,765 [0,749–0,781] | 0,990 [0,985–0,993] |
| precedente | 0,841 | 0,828 [0,822–0,834] | 0,822 | 0,818 [0,803–0,832] | 0,706 [0,688–0,723] | 0,877 [0,864–0,889] | 0,833 [0,819–0,847] | 0,749 [0,732–0,765] | 0,985 [0,980–0,989] |
| starter | — | 0,534 [0,526–0,542] | 0,532 | 0,584 [0,565–0,603] | 0,474 [0,455–0,494] | 0,433 [0,414–0,453] | 0,611 [0,592–0,630] | 0,380 [0,362–0,399] | 0,727 [0,709–0,744] |

Mazzo «ultimo»: bound [base.mara.bound.CambioMarcia, base.mara.bound.ColpoDiStriscio], last resort com.last.Struggle, carte {base.cesira.ContoSalato=1, base.com.FasciaturaColFazzolettaccio=1, base.com.RincorsaDalMarciapiede=1, base.com.Spintone=1, base.com.SputoDaPosacenere=2, base.com.TartarugaSulMarciapiede=1, base.gigi.SottoIlCofano=1, base.gigi.UnaStrettaDiProva=1, base.items.AmaroNelBicchiereDiPlastica=1, base.items.EspressoDelDistributore=2, base.items.GhiaccioNelTovagliolo=1, base.items.PosacenereDiVetro=1, base.items.SantinoDellaPortinaia=1, base.mara.CinghiataDiTraverso=1, base.mara.Sgommata=2, base.pino.GoingBerserk=2}.
Rispetto allo starter: +1 base.cesira.ContoSalato, +1 base.com.FasciaturaColFazzolettaccio, +1 base.com.RincorsaDalMarciapiede, +1 base.gigi.SottoIlCofano, +1 base.gigi.UnaStrettaDiProva, +1 base.items.AmaroNelBicchiereDiPlastica, −1 base.items.GiubbottoDiFintaPelle, −2 base.items.PaninoDelKebab, +1 base.items.PosacenereDiVetro, +1 base.items.SantinoDellaPortinaia, −2 base.mara.Slalom, −2 base.mara.SorpassoInCurva, −1 base.mara.TiStringoLaCurva, −2 base.mara.TraDueParaurti, +2 base.pino.GoingBerserk, bound [base.mara.bound.CambioMarcia, base.mara.bound.ColpoDiStriscio].
Scarto ricerca − convalida (punteggio): -0,066.

## junkie.character.ToxicJunkie, partenza starter

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,611 · 0,715 · 0,798 · 0,796 · 0,766 · 0,878 · 0,830 · 0,931 · 0,930 · 0,920 · 0,874 · 0,901 · 0,929 · 0,934 · 0,938 · 0,970 · 0,943 · 0,914 · 0,964 · 0,973 · 0,971 · 0,954 · 0,940 · 0,964 · 0,972 · 0,958

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,958 | 0,963 [0,960–0,966] | 0,957 | 0,923 [0,913–0,933] | 0,962 [0,954–0,969] | 0,980 [0,973–0,984] | 0,951 [0,943–0,959] | 0,963 [0,956–0,970] | 1,000 [0,999–1,000] |
| precedente | 0,962 | 0,938 [0,935–0,942] | 0,931 | 0,906 [0,895–0,917] | 0,910 [0,899–0,921] | 0,927 [0,917–0,937] | 0,947 [0,938–0,955] | 0,939 [0,930–0,948] | 0,999 [0,996–0,999] |
| precedente | 0,944 | 0,950 [0,946–0,953] | 0,943 | 0,914 [0,903–0,925] | 0,943 [0,933–0,951] | 0,968 [0,961–0,974] | 0,942 [0,933–0,951] | 0,933 [0,923–0,942] | 0,997 [0,995–0,999] |
| starter | — | 0,615 [0,607–0,623] | 0,606 | 0,624 [0,605–0,643] | 0,535 [0,516–0,555] | 0,484 [0,464–0,504] | 0,630 [0,611–0,649] | 0,411 [0,392–0,431] | 0,971 [0,964–0,977] |

Mazzo «ultimo»: bound [base.tossico.bound.RaschiareIlFondo, junkie.character.RottenSmile], last resort junkie.LethalHeroinDose, carte {base.cesira.OhGuardaLa=1, base.com.RincorsaDalMarciapiede=1, base.gigi.ColpoDiChiaveInglese=1, base.items.AmaroNelBicchiereDiPlastica=2, base.items.GhiaccioNelTovagliolo=1, base.items.PaninoDelKebab=2, base.items.PasticcaTrovataSulBancone=2, base.mara.CinghiataDiTraverso=1, base.mara.Sgommata=1, base.pino.GoingBerserk=2, bruiser.YouStop=1, com.items.AnotherRottenBeer=1, junkie.Cough=2, junkie.PervertedMetabolism=1, junkie.ToxicBloodDrain=1}.
Rispetto allo starter: +1 base.cesira.OhGuardaLa, −1 base.com.FasciaturaColFazzolettaccio, +1 base.gigi.ColpoDiChiaveInglese, +2 base.items.AmaroNelBicchiereDiPlastica, +1 base.items.GhiaccioNelTovagliolo, +1 base.mara.CinghiataDiTraverso, +1 base.mara.Sgommata, +2 base.pino.GoingBerserk, −1 base.tossico.UnAssaggino, +1 bruiser.YouStop, −2 com.Grab, −1 com.Steal, +1 com.items.AnotherRottenBeer, −1 com.items.MarvelousCocktail, −2 junkie.AmphetamineReflexes, −2 junkie.MethDrivenRage, −1 junkie.PervertedMetabolism, bound [base.tossico.bound.RaschiareIlFondo, junkie.character.RottenSmile].
Scarto ricerca − convalida (punteggio): 0,001.

## junkie.character.ToxicJunkie, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,113 · 0,234 · 0,350 · 0,430 · 0,501 · 0,534 · 0,553 · 0,666 · 0,706 · 0,727 · 0,707 · 0,796 · 0,826 · 0,832 · 0,876 · 0,849 · 0,899 · 0,863 · 0,888 · 0,904 · 0,945 · 0,934 · 0,894 · 0,913 · 0,954 · 0,920

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,920 | 0,921 [0,917–0,925] | 0,915 | 0,891 [0,879–0,902] | 0,882 [0,870–0,894] | 0,975 [0,968–0,980] | 0,894 [0,882–0,906] | 0,905 [0,893–0,916] | 0,977 [0,971–0,982] |
| precedente | 0,924 | 0,866 [0,860–0,871] | 0,858 | 0,830 [0,816–0,844] | 0,835 [0,820–0,848] | 0,901 [0,889–0,912] | 0,847 [0,833–0,861] | 0,817 [0,801–0,831] | 0,961 [0,953–0,968] |
| precedente | 0,922 | 0,915 [0,911–0,919] | 0,909 | 0,902 [0,890–0,913] | 0,848 [0,834–0,862] | 0,978 [0,972–0,983] | 0,905 [0,893–0,915] | 0,898 [0,886–0,909] | 0,957 [0,949–0,964] |
| starter | — | 0,615 [0,607–0,623] | 0,606 | 0,624 [0,605–0,643] | 0,535 [0,516–0,555] | 0,484 [0,464–0,504] | 0,630 [0,611–0,649] | 0,411 [0,392–0,431] | 0,971 [0,964–0,977] |

Mazzo «ultimo»: bound [base.tossico.bound.RaschiareIlFondo, junkie.character.RottenSmile], last resort junkie.LethalHeroinDose, carte {base.cesira.Ricatto=1, base.com.Spintone=1, base.com.TartarugaSulMarciapiede=1, base.items.AmaroNelBicchiereDiPlastica=1, base.items.CascoDaLavoro=1, base.items.EspressoDelDistributore=1, base.items.GiubbottoDiFintaPelle=2, base.items.PaninoDelKebab=1, base.items.PasticcaTrovataSulBancone=1, base.mara.CinghiataDiTraverso=1, base.mara.TiStringoLaCurva=1, base.pino.GoingBerserk=2, base.pino.PrimaIlBrindisi=1, com.items.RottenBeer=1, junkie.Cough=2, junkie.ToxicBloodDrain=2}.
Rispetto allo starter: +1 base.cesira.Ricatto, −1 base.com.FasciaturaColFazzolettaccio, −1 base.com.RincorsaDalMarciapiede, +1 base.com.Spintone, +1 base.com.TartarugaSulMarciapiede, +1 base.items.AmaroNelBicchiereDiPlastica, +1 base.items.CascoDaLavoro, +1 base.items.EspressoDelDistributore, +2 base.items.GiubbottoDiFintaPelle, −1 base.items.PaninoDelKebab, −1 base.items.PasticcaTrovataSulBancone, +1 base.mara.CinghiataDiTraverso, +1 base.mara.TiStringoLaCurva, +2 base.pino.GoingBerserk, +1 base.pino.PrimaIlBrindisi, −1 base.tossico.UnAssaggino, −2 com.Grab, −1 com.Steal, −1 com.items.MarvelousCocktail, +1 com.items.RottenBeer, −2 junkie.AmphetamineReflexes, −2 junkie.MethDrivenRage, −2 junkie.PervertedMetabolism, +1 junkie.ToxicBloodDrain, bound [base.tossico.bound.RaschiareIlFondo, junkie.character.RottenSmile].
Scarto ricerca − convalida (punteggio): 0,005.

## base.character.Pino, partenza starter

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,501 · 0,673 · 0,646 · 0,660 · 0,708 · 0,714 · 0,737 · 0,716 · 0,780 · 0,798 · 0,789 · 0,747 · 0,862 · 0,885 · 0,895 · 0,890 · 0,874 · 0,936 · 0,890 · 0,928 · 0,922 · 0,952 · 0,939 · 0,984 · 0,964 · 0,981

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,981 | 0,994 [0,993–0,995] | 0,979 | 1,000 [0,999–1,000] | 0,975 [0,968–0,980] | 0,999 [0,997–1,000] | 0,989 [0,984–0,992] | 0,999 [0,997–1,000] | 1,000 [0,999–1,000] |
| precedente | 0,976 | 0,983 [0,981–0,985] | 0,976 | 0,983 [0,977–0,987] | 0,964 [0,956–0,970] | 0,992 [0,988–0,995] | 0,988 [0,983–0,992] | 0,971 [0,964–0,977] | 1,000 [0,999–1,000] |
| precedente | 0,947 | 0,984 [0,982–0,986] | 0,978 | 0,978 [0,971–0,983] | 0,969 [0,962–0,975] | 0,994 [0,990–0,996] | 0,984 [0,979–0,989] | 0,977 [0,971–0,982] | 1,000 [0,999–1,000] |
| starter | — | 0,527 [0,519–0,535] | 0,525 | 0,602 [0,584–0,621] | 0,353 [0,335–0,372] | 0,377 [0,359–0,397] | 0,482 [0,462–0,502] | 0,380 [0,362–0,399] | 0,946 [0,937–0,954] |

Mazzo «ultimo»: bound [base.pino.bound.Coccio, base.pino.bound.SpallataAlBancone], last resort com.last.Struggle, carte {base.com.DueDitaInGola=1, base.items.AmaroNelBicchiereDiPlastica=2, base.items.CascoDaLavoro=2, base.items.EspressoDelDistributore=1, base.items.GhiaccioNelTovagliolo=1, base.items.GiubbottoDiFintaPelle=1, base.items.PaninoDelKebab=2, base.items.PasticcaTrovataSulBancone=1, base.mara.Sgommata=1, base.pino.GoingBerserk=2, bruiser.YouStop=1, com.items.AnotherRottenBeer=1, com.items.CocktailOnTheGround=1, com.items.MarvelousCocktail=1, com.items.RottenBeer=2}.
Rispetto allo starter: −1 base.com.FasciaturaColFazzolettaccio, −2 base.com.Spintone, +2 base.items.CascoDaLavoro, +1 base.items.EspressoDelDistributore, +1 base.items.GhiaccioNelTovagliolo, +1 base.items.GiubbottoDiFintaPelle, +2 base.items.PaninoDelKebab, +1 base.items.PasticcaTrovataSulBancone, +1 base.mara.Sgommata, −2 base.pino.IlBanconeRegge, −2 base.pino.OffroIo, −1 base.pino.PrimaIlBrindisi, −1 base.pino.RuttoADistanzaSociale, −2 base.pino.TestataDaUltimoGiro, +1 bruiser.YouStop, −1 com.Grab, +1 com.items.CocktailOnTheGround, +1 com.items.MarvelousCocktail, bound [base.pino.bound.Coccio, base.pino.bound.SpallataAlBancone], last resort com.last.Struggle.
Scarto ricerca − convalida (punteggio): 0,002.

## base.character.Pino, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,066 · 0,157 · 0,283 · 0,385 · 0,386 · 0,593 · 0,573 · 0,667 · 0,782 · 0,796 · 0,714 · 0,766 · 0,805 · 0,796 · 0,822 · 0,765 · 0,815 · 0,795 · 0,813 · 0,818 · 0,830 · 0,810 · 0,802 · 0,864 · 0,789 · 0,802

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,802 | 0,773 [0,766–0,779] | 0,767 | 0,732 [0,715–0,748] | 0,705 [0,687–0,722] | 0,739 [0,721–0,756] | 0,793 [0,777–0,808] | 0,707 [0,690–0,724] | 0,958 [0,950–0,965] |
| precedente | 0,847 | 0,818 [0,812–0,824] | 0,812 | 0,745 [0,729–0,761] | 0,770 [0,754–0,786] | 0,826 [0,810–0,840] | 0,844 [0,830–0,858] | 0,744 [0,727–0,760] | 0,977 [0,970–0,982] |
| precedente | 0,797 | 0,772 [0,765–0,778] | 0,766 | 0,693 [0,675–0,710] | 0,694 [0,676–0,711] | 0,848 [0,834–0,862] | 0,753 [0,737–0,770] | 0,670 [0,652–0,687] | 0,974 [0,968–0,980] |
| starter | — | 0,527 [0,519–0,535] | 0,525 | 0,602 [0,584–0,621] | 0,353 [0,335–0,372] | 0,377 [0,359–0,397] | 0,482 [0,462–0,502] | 0,380 [0,362–0,399] | 0,946 [0,937–0,954] |

Mazzo «ultimo»: bound [base.pino.bound.CinqueMinutiEVado, base.pino.bound.Coccio], last resort base.pino.UltimoGiro, carte {base.cesira.OhGuardaLa=1, base.cesira.Ricatto=1, base.com.AcquaInFaccia=1, base.com.SputoDaPosacenere=1, base.gigi.ColpoDiChiaveInglese=1, base.gigi.LavoroFattoBene=1, base.gigi.UnaStrettaDiProva=1, base.items.GiubbottoDiFintaPelle=2, base.items.PaninoDelKebab=1, base.items.PasticcaTrovataSulBancone=1, base.items.SantinoDellaPortinaia=2, base.mara.CinghiataDiTraverso=1, base.pino.GoingBerserk=2, base.pino.PrimaIlBrindisi=2, com.items.AnotherRottenBeer=2}.
Rispetto allo starter: +1 base.cesira.OhGuardaLa, +1 base.cesira.Ricatto, +1 base.com.AcquaInFaccia, −1 base.com.DueDitaInGola, −1 base.com.FasciaturaColFazzolettaccio, −2 base.com.Spintone, +1 base.com.SputoDaPosacenere, +1 base.gigi.ColpoDiChiaveInglese, +1 base.gigi.LavoroFattoBene, +1 base.gigi.UnaStrettaDiProva, −2 base.items.AmaroNelBicchiereDiPlastica, +2 base.items.GiubbottoDiFintaPelle, +1 base.items.PaninoDelKebab, +1 base.items.PasticcaTrovataSulBancone, +2 base.items.SantinoDellaPortinaia, +1 base.mara.CinghiataDiTraverso, −2 base.pino.IlBanconeRegge, −2 base.pino.OffroIo, +1 base.pino.PrimaIlBrindisi, −1 base.pino.RuttoADistanzaSociale, −2 base.pino.TestataDaUltimoGiro, −1 com.Grab, +1 com.items.AnotherRottenBeer, −2 com.items.RottenBeer, bound [base.pino.bound.CinqueMinutiEVado, base.pino.bound.Coccio].
Scarto ricerca − convalida (punteggio): 0,035.

## base.character.Gigi, partenza starter

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,584 · 0,683 · 0,814 · 0,929 · 0,919 · 0,925 · 0,929 · 0,911 · 0,967 · 0,943 · 0,941 · 0,961 · 0,957 · 0,977 · 0,984 · 0,984 · 0,975 · 0,967 · 0,972 · 0,974 · 0,988 · 0,944 · 0,947 · 0,973 · 0,943 · 0,940

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 0,940 | 0,921 [0,917–0,925] | 0,915 | 0,891 [0,878–0,902] | 0,907 [0,895–0,917] | 0,972 [0,966–0,978] | 0,910 [0,898–0,920] | 0,852 [0,838–0,865] | 0,995 [0,992–0,997] |
| precedente | 0,980 | 0,956 [0,952–0,959] | 0,951 | 0,920 [0,909–0,930] | 0,955 [0,947–0,962] | 0,989 [0,985–0,993] | 0,957 [0,948–0,964] | 0,926 [0,915–0,935] | 0,987 [0,982–0,991] |
| precedente | 0,976 | 0,966 [0,963–0,969] | 0,963 | 0,963 [0,955–0,969] | 0,946 [0,937–0,954] | 0,980 [0,974–0,985] | 0,959 [0,950–0,965] | 0,951 [0,942–0,958] | 1,000 [0,998–1,000] |
| starter | — | 0,613 [0,605–0,621] | 0,607 | 0,567 [0,549–0,586] | 0,621 [0,602–0,639] | 0,607 [0,587–0,626] | 0,599 [0,580–0,617] | 0,475 [0,455–0,494] | 0,804 [0,788–0,819] |

Mazzo «ultimo»: bound [base.gigi.bound.Lima, base.gigi.bound.UnaStrettaEPassa], last resort com.last.Struggle, carte {base.cesira.ContoSalato=1, base.com.Spintone=1, base.gigi.ColpoDiChiaveInglese=1, base.gigi.LavoroFattoBene=1, base.items.AmaroNelBicchiereDiPlastica=1, base.items.CascoDaLavoro=2, base.items.GhiaccioNelTovagliolo=1, base.items.SantinoDellaPortinaia=1, base.mara.TiStringoLaCurva=1, base.pino.GoingBerserk=2, base.pino.IlBanconeRegge=1, bruiser.BreakYourToy=1, bruiser.HealingBlow=1, bruiser.SeagullFly=1, com.items.AnotherRottenBeer=1, com.items.MarvelousCocktail=1, com.items.RottenBeer=1, junkie.AmphetamineReflexes=1}.
Rispetto allo starter: +1 base.cesira.ContoSalato, −1 base.com.DueDitaInGola, −2 base.gigi.ChiaveDaTredici, −1 base.gigi.ColpoDiChiaveInglese, −1 base.gigi.SottoIlCofano, −1 base.gigi.UnaStrettaDiProva, +1 base.items.AmaroNelBicchiereDiPlastica, −1 base.items.EspressoDelDistributore, +1 base.items.GhiaccioNelTovagliolo, −2 base.items.GiubbottoDiFintaPelle, −2 base.items.GuantiDaOfficina, +1 base.items.SantinoDellaPortinaia, +1 base.mara.TiStringoLaCurva, +2 base.pino.GoingBerserk, +1 base.pino.IlBanconeRegge, −1 bruiser.BreakYourToy, +1 bruiser.HealingBlow, −1 com.Steal, +1 com.items.AnotherRottenBeer, +1 com.items.MarvelousCocktail, +1 com.items.RottenBeer, +1 junkie.AmphetamineReflexes, bound [base.gigi.bound.Lima, base.gigi.bound.UnaStrettaEPassa].
Scarto ricerca − convalida (punteggio): 0,026.

## base.character.Gigi, partenza casuale

Generazioni: 25; arresto: numero massimo di generazioni (25).

Punteggio del migliore a ogni generazione: 0,543 · 0,670 · 0,847 · 0,926 · 0,895 · 0,894 · 0,949 · 0,947 · 0,964 · 0,978 · 0,973 · 0,991 · 0,975 · 0,985 · 0,996 · 0,992 · 0,996 · 0,989 · 0,993 · 0,994 · 0,992 · 0,995 · 0,992 · 0,992 · 0,999 · 1,000

| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida | contro starter-spazienzio | contro starter-mara | contro starter-tossico | contro starter-pino | contro starter-gigi | contro prova-sergio |
|---|---:|---|---:|---|---|---|---|---|---|
| ultimo | 1,000 | 0,995 [0,993–0,996] | 0,994 | 0,996 [0,993–0,998] | 0,991 [0,987–0,994] | 0,998 [0,995–0,999] | 0,996 [0,992–0,997] | 0,987 [0,982–0,991] | 1,000 [0,999–1,000] |
| precedente | 0,995 | 0,992 [0,990–0,993] | 0,991 | 0,985 [0,980–0,989] | 0,990 [0,986–0,993] | 0,995 [0,992–0,997] | 0,990 [0,985–0,993] | 0,989 [0,984–0,992] | 1,000 [0,999–1,000] |
| precedente | 0,990 | 0,988 [0,986–0,989] | 0,986 | 0,980 [0,974–0,985] | 0,981 [0,975–0,985] | 0,997 [0,994–0,998] | 0,984 [0,979–0,988] | 0,984 [0,978–0,988] | 1,000 [0,999–1,000] |
| starter | — | 0,613 [0,605–0,621] | 0,607 | 0,567 [0,549–0,586] | 0,621 [0,602–0,639] | 0,607 [0,587–0,626] | 0,599 [0,580–0,617] | 0,475 [0,455–0,494] | 0,804 [0,788–0,819] |

Mazzo «ultimo»: bound [base.gigi.bound.ColpoDiCacciavite, base.gigi.bound.Lima], last resort com.last.Struggle, carte {base.com.RincorsaDalMarciapiede=1, base.com.Sgambetto=1, base.com.SputoDaPosacenere=1, base.gigi.ChiaveDaTredici=1, base.gigi.LavoroFattoBene=2, base.items.AmaroNelBicchiereDiPlastica=1, base.items.GhiaccioNelTovagliolo=2, base.items.GiubbottoDiFintaPelle=1, base.items.PaninoDelKebab=1, base.items.PosacenereDiVetro=1, base.mara.Sgommata=1, base.pino.GoingBerserk=2, bruiser.HealingBlow=1, com.Steal=1, com.items.CocktailOnTheGround=1, com.items.RottenBeer=2}.
Rispetto allo starter: −1 base.com.DueDitaInGola, +1 base.com.RincorsaDalMarciapiede, +1 base.com.Sgambetto, −1 base.com.Spintone, +1 base.com.SputoDaPosacenere, −1 base.gigi.ChiaveDaTredici, −2 base.gigi.ColpoDiChiaveInglese, +1 base.gigi.LavoroFattoBene, −1 base.gigi.SottoIlCofano, −1 base.gigi.UnaStrettaDiProva, +1 base.items.AmaroNelBicchiereDiPlastica, −2 base.items.CascoDaLavoro, −1 base.items.EspressoDelDistributore, +2 base.items.GhiaccioNelTovagliolo, −1 base.items.GiubbottoDiFintaPelle, −2 base.items.GuantiDaOfficina, +1 base.items.PaninoDelKebab, +1 base.items.PosacenereDiVetro, +1 base.mara.Sgommata, +2 base.pino.GoingBerserk, −2 bruiser.BreakYourToy, +1 bruiser.HealingBlow, −1 bruiser.SeagullFly, +1 com.items.CocktailOnTheGround, +2 com.items.RottenBeer, bound [base.gigi.bound.ColpoDiCacciavite, base.gigi.bound.Lima].
Scarto ricerca − convalida (punteggio): 0,006.

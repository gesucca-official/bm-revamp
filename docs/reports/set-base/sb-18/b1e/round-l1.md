# SB-18: round-l1

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 47,04% / 8,50% / 5,21 | 48,49% / 6,34% / 5,80 | 48,20% | — |
| Duccio–Spazienzio | 69,02% / 1,52% / 6,06 | 64,51% / 1,31% / 6,78 | 55,85% | quota 4,02 |
| Duccio–Mara | 40,09% / 1,93% / 6,20 | 42,95% / 1,71% / 6,70 | 55,41% | — |
| Duccio–Celestina | 71,62% / 5,72% / 6,66 | 68,33% / 4,93% / 7,22 | 70,39% | quota 6,62 |
| Duccio–Piera | 58,46% / 1,77% / 6,54 | 59,42% / 1,41% / 7,28 | 73,01% | — |
| Duccio–Beppe | 60,77% / 0,71% / 5,64 | 61,53% / 0,61% / 6,31 | 75,51% | — |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 73,57% | 0,92 |
| Nocche sbucciate | 67,42% | 0,84 |
| Testa dura | 63,45% | 0,63 |
| Sputo da posacenere | 62,66% | 0,78 |
| E allora? | 53,70% | 0,66 |
| Te lo spiego io | 47,89% | 0,56 |
| Spintone | 43,89% | 0,54 |
| Incassare | 26,81% | 0,34 |
| Prima io | 23,34% | 0,29 |
| Colpetto | 13,70% | 0,17 |
| Tartaruga sul marciapiede | 12,73% | 0,13 |
| Fasciatura col fazzolettaccio | 7,03% | 0,07 |
| Alzo la voce | 0,46% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.014109347442680775,
 "endWithLastResort": 0.18930041152263374,
 "searches": 91040,
 "searchMissRate": 2.514279437609842,
 "turnsPerGame": 5.933015873015873,
 "healthSpentPerGame": 33.02813051146384,
 "healthRecoveredPerGame": 9.178818342151676,
 "healthLostToDamagePerGame": 53.3945620223398,
 "boundShare": 2.8890038307342603,
 "lowHealthTurnsShare": 31.781816596413417,
 "lowHealthMoves": 320744,
 "lowHealthBoundShare": 5.444217195021575,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 12.893086419753086,
  "base.rocco.EAllora": 3.3003821281599057,
  "base.rocco.NoccheSbucciate": 6.6823280423280425,
  "base.rocco.TestaDura": 10.15233392122281
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 15516,
  "diedInPayingTurn/base.rocco.EAllora": 3755,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 9896,
  "diedInPayingTurn/base.rocco.TestaDura": 12928
 },
 "lastResortPlaysPerGame": 0.0,
 "lastResortGamesShare": 0.0
}
```

## Per stile

```
{
 "aggressivo": {
  "games": 75600,
  "healthSpentPerGame": 33.597169312169314,
  "playsPerGame": {
   "NoccheSbucciate": 0.8172619047619047,
   "EAllora": 0.6214814814814815,
   "Capocciata": 0.9240608465608465,
   "TestaDura": 0.6884259259259259
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 34.022050264550266,
  "playsPerGame": {
   "NoccheSbucciate": 0.9134126984126985,
   "EAllora": 0.783505291005291,
   "Capocciata": 0.9826587301587302,
   "TestaDura": 0.565
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 33.76547619047619,
  "playsPerGame": {
   "NoccheSbucciate": 0.8184391534391534,
   "EAllora": 0.616904761904762,
   "Capocciata": 0.9262962962962963,
   "TestaDura": 0.6978306878306878
  }
 }
}
```

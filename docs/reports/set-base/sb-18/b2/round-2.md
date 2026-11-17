# SB-18: round-v3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,76% / 8,79% / 5,92 | 50,75% / 6,72% / 6,68 | 47,85% | — |
| Duccio–Spazienzio | 54,41% / 1,88% / 6,65 | 52,18% / 2,13% / 7,33 | 50,60% | — |
| Duccio–Mara | 26,45% / 2,96% / 6,84 | 31,73% / 2,51% / 7,38 | 50,50% | quota 8,55 |
| Duccio–Celestina | 48,29% / 4,67% / 7,08 | 49,86% / 4,38% / 7,61 | 62,91% | — |
| Duccio–Piera | 40,62% / 3,29% / 7,29 | 43,80% / 2,60% / 7,92 | 64,08% | — |
| Duccio–Beppe | 49,11% / 1,17% / 6,22 | 50,54% / 1,14% / 6,83 | 67,12% | — |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 68,71% | 0,82 |
| Sputo da posacenere | 67,38% | 0,86 |
| Nocche sbucciate | 64,99% | 0,80 |
| Testa dura | 56,10% | 0,56 |
| Te lo spiego io | 55,99% | 0,70 |
| Spintone | 54,62% | 0,69 |
| E allora? | 52,53% | 0,64 |
| Prima io | 35,35% | 0,48 |
| Incassare | 31,03% | 0,39 |
| Colpetto | 23,92% | 0,35 |
| Tartaruga sul marciapiede | 14,17% | 0,14 |
| Fasciatura col fazzolettaccio | 12,65% | 0,13 |
| Alzo la voce | 0,88% | 0,01 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.06878306878306878,
 "endWithLastResort": 0.8824221046443269,
 "searches": 110951,
 "searchMissRate": 4.735423745617434,
 "turnsPerGame": 6.560652557319224,
 "healthSpentPerGame": 60.68358612580835,
 "healthRecoveredPerGame": 13.143256907701351,
 "healthLostToDamagePerGame": 56.69241034685479,
 "boundShare": 5.4003388989100936,
 "lowHealthTurnsShare": 33.60215848676529,
 "lowHealthMoves": 374989,
 "lowHealthBoundShare": 12.173157079274326,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 22.964279835390947,
  "base.rocco.EAllora": 6.436213991769547,
  "base.rocco.NoccheSbucciate": 12.76933568489124,
  "base.rocco.TestaDura": 18.513756613756613
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 14769,
  "diedInPayingTurn/base.rocco.EAllora": 7657,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 12105,
  "diedInPayingTurn/base.rocco.TestaDura": 10775
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
  "healthSpentPerGame": 63.07563492063492,
  "playsPerGame": {
   "NoccheSbucciate": 0.8045502645502646,
   "EAllora": 0.6382142857142857,
   "Capocciata": 0.8467195767195768,
   "TestaDura": 0.6094708994708995
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 63.00616402116402,
  "playsPerGame": {
   "NoccheSbucciate": 0.8593121693121694,
   "EAllora": 0.7896296296296297,
   "Capocciata": 0.9040079365079365,
   "TestaDura": 0.4863227513227513
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 62.05670634920635,
  "playsPerGame": {
   "NoccheSbucciate": 0.773505291005291,
   "EAllora": 0.5147089947089947,
   "Capocciata": 0.8073412698412699,
   "TestaDura": 0.664484126984127
  }
 }
}
```

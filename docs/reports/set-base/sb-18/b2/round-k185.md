# SB-18: round-v3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,28% / 7,45% / 6,00 | 50,08% / 5,63% / 6,75 | 51,76% | — |
| Duccio–Spazienzio | 61,87% / 1,55% / 6,48 | 59,29% / 1,57% / 7,20 | 56,86% | — |
| Duccio–Mara | 33,94% / 3,42% / 6,85 | 38,71% / 2,88% / 7,36 | 57,19% | quota 1,06 |
| Duccio–Celestina | 58,70% / 5,63% / 7,00 | 58,52% / 5,13% / 7,57 | 69,68% | — |
| Duccio–Piera | 50,05% / 2,88% / 7,11 | 51,99% / 2,23% / 7,80 | 70,60% | — |
| Duccio–Beppe | 57,06% / 0,96% / 6,00 | 58,22% / 1,00% / 6,67 | 76,11% | — |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 71,56% | 0,86 |
| Sputo da posacenere | 67,65% | 0,86 |
| Nocche sbucciate | 66,50% | 0,82 |
| Testa dura | 58,98% | 0,59 |
| Te lo spiego io | 54,59% | 0,67 |
| Spintone | 53,44% | 0,67 |
| E allora? | 53,12% | 0,65 |
| Prima io | 30,96% | 0,41 |
| Incassare | 29,10% | 0,37 |
| Colpetto | 22,92% | 0,32 |
| Tartaruga sul marciapiede | 13,49% | 0,13 |
| Fasciatura col fazzolettaccio | 10,61% | 0,11 |
| Alzo la voce | 0,72% | 0,01 |
| Ne ho prese di peggio | 0,00% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.04997060552616108,
 "endWithLastResort": 0.6455026455026455,
 "searches": 108498,
 "searchMissRate": 4.687644011871186,
 "turnsPerGame": 6.491604938271605,
 "healthSpentPerGame": 58.3449088771311,
 "healthRecoveredPerGame": 11.883762492651382,
 "healthLostToDamagePerGame": 56.713398001175776,
 "boundShare": 5.095714448724984,
 "lowHealthTurnsShare": 31.55108302497143,
 "lowHealthMoves": 348394,
 "lowHealthBoundShare": 11.593196208889935,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 22.44697236919459,
  "base.rocco.EAllora": 5.884708994708995,
  "base.rocco.NoccheSbucciate": 12.32010582010582,
  "base.rocco.TestaDura": 17.693121693121693
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 14574,
  "diedInPayingTurn/base.rocco.EAllora": 5620,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 10951,
  "diedInPayingTurn/base.rocco.TestaDura": 10525
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
  "healthSpentPerGame": 60.172751322751324,
  "playsPerGame": {
   "NoccheSbucciate": 0.8213492063492064,
   "EAllora": 0.650079365079365,
   "Capocciata": 0.8793121693121693,
   "TestaDura": 0.637989417989418
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 60.58017195767196,
  "playsPerGame": {
   "NoccheSbucciate": 0.8897354497354497,
   "EAllora": 0.8022354497354497,
   "Capocciata": 0.9476851851851852,
   "TestaDura": 0.512473544973545
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 59.619285714285716,
  "playsPerGame": {
   "NoccheSbucciate": 0.7958465608465608,
   "EAllora": 0.5276719576719576,
   "Capocciata": 0.8571428571428571,
   "TestaDura": 0.6882275132275132
  }
 }
}
```

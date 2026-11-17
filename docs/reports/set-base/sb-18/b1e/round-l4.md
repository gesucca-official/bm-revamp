# SB-18: round-l4

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,76% / 7,72% / 6,72 | 50,50% / 5,18% / 7,31 | 48,16% | — |
| Duccio–Spazienzio | 89,90% / 0,23% / 5,84 | 85,51% / 0,47% / 6,69 | 80,51% | quota 24,90 |
| Duccio–Mara | 79,38% / 1,27% / 6,48 | 76,53% / 1,23% / 7,08 | 82,80% | quota 14,38 |
| Duccio–Celestina | 90,45% / 3,40% / 6,81 | 83,66% / 2,88% / 7,51 | 82,57% | quota 25,45 |
| Duccio–Piera | 89,90% / 0,59% / 6,21 | 85,55% / 0,60% / 7,15 | 88,01% | quota 24,90 |
| Duccio–Beppe | 90,11% / 0,22% / 5,37 | 86,33% / 0,57% / 6,19 | 93,25% | quota 25,11 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 79,72% | 1,04 |
| Nocche sbucciate | 72,08% | 0,92 |
| Sputo da posacenere | 68,07% | 0,87 |
| Testa dura | 66,79% | 0,67 |
| E allora? | 59,97% | 0,76 |
| Spintone | 56,66% | 0,72 |
| Te lo spiego io | 43,16% | 0,51 |
| Incassare | 18,19% | 0,24 |
| Colpetto | 16,97% | 0,21 |
| Tartaruga sul marciapiede | 14,79% | 0,15 |
| Prima io | 13,89% | 0,17 |
| Fasciatura col fazzolettaccio | 5,12% | 0,05 |
| Alzo la voce | 0,41% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.003527336860670194,
 "endWithLastResort": 0.03350970017636684,
 "searches": 84276,
 "searchMissRate": 2.7101428639233,
 "turnsPerGame": 6.306255144032922,
 "healthSpentPerGame": 36.37027630805409,
 "healthRecoveredPerGame": 2.7812286890064666,
 "healthLostToDamagePerGame": 58.020358612580836,
 "boundShare": 3.326391310103347,
 "lowHealthTurnsShare": 15.62859492082551,
 "lowHealthMoves": 167647,
 "lowHealthBoundShare": 8.028178255501143,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 14.563621399176954,
  "base.rocco.EAllora": 3.7782480893592005,
  "base.rocco.NoccheSbucciate": 7.3427395649617875,
  "base.rocco.TestaDura": 10.685667254556144
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 8610,
  "diedInPayingTurn/base.rocco.EAllora": 1404,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 4134,
  "diedInPayingTurn/base.rocco.TestaDura": 7710
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
  "healthSpentPerGame": 36.95861111111111,
  "playsPerGame": {
   "NoccheSbucciate": 0.8843121693121693,
   "EAllora": 0.7253835978835979,
   "Capocciata": 1.040925925925926,
   "TestaDura": 0.7302645502645503
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 36.8764417989418,
  "playsPerGame": {
   "NoccheSbucciate": 1.0073544973544974,
   "EAllora": 0.8426851851851852,
   "Capocciata": 1.0856349206349207,
   "TestaDura": 0.5878306878306878
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 36.88112433862434,
  "playsPerGame": {
   "NoccheSbucciate": 0.8876984126984127,
   "EAllora": 0.7187169312169313,
   "Capocciata": 1.0399338624338625,
   "TestaDura": 0.7266798941798942
  }
 }
}
```

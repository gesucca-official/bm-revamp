# SB-18: round-v3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 48,58% / 6,46% / 6,76 | 49,29% / 4,59% / 7,53 | 49,32% | — |
| Duccio–Spazienzio | 93,49% / 0,07% / 5,82 | 90,62% / 0,28% / 6,67 | 87,46% | quota 28,49 |
| Duccio–Mara | 85,30% / 0,26% / 6,38 | 83,71% / 0,60% / 7,06 | 89,07% | quota 20,30 |
| Duccio–Celestina | 93,56% / 2,84% / 6,72 | 87,19% / 2,47% / 7,52 | 84,80% | quota 28,56 |
| Duccio–Piera | 93,58% / 0,36% / 6,15 | 90,91% / 0,47% / 7,13 | 92,74% | quota 28,58 |
| Duccio–Beppe | 94,68% / 0,06% / 5,29 | 91,48% / 0,50% / 6,16 | 96,68% | quota 29,68 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 80,46% | 1,06 |
| Nocche sbucciate | 71,85% | 0,91 |
| Testa dura | 71,39% | 0,71 |
| Sputo da posacenere | 67,47% | 0,86 |
| E allora? | 58,43% | 0,74 |
| Spintone | 50,69% | 0,63 |
| Te lo spiego io | 49,40% | 0,59 |
| Incassare | 23,19% | 0,30 |
| Colpetto | 15,50% | 0,19 |
| Prima io | 12,46% | 0,16 |
| Tartaruga sul marciapiede | 8,91% | 0,09 |
| Fasciatura col fazzolettaccio | 3,12% | 0,03 |
| Alzo la voce | 0,35% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.03233392122281011,
 "endWithLastResort": 0.024691358024691357,
 "searches": 97427,
 "searchMissRate": 2.051792624221212,
 "turnsPerGame": 6.269153439153439,
 "healthSpentPerGame": 37.198894767783656,
 "healthRecoveredPerGame": 6.990270429159318,
 "healthLostToDamagePerGame": 59.26653145208701,
 "boundShare": 3.0749740008983637,
 "lowHealthTurnsShare": 14.122880803613711,
 "lowHealthMoves": 150604,
 "lowHealthBoundShare": 6.527715067328889,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 14.796131687242799,
  "base.rocco.EAllora": 3.67636684303351,
  "base.rocco.NoccheSbucciate": 7.30384479717813,
  "base.rocco.TestaDura": 11.422551440329219
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 7725,
  "diedInPayingTurn/base.rocco.EAllora": 1435,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 4080,
  "diedInPayingTurn/base.rocco.TestaDura": 7353
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
  "healthSpentPerGame": 37.63253968253968,
  "playsPerGame": {
   "NoccheSbucciate": 0.8896825396825396,
   "EAllora": 0.7123809523809523,
   "Capocciata": 1.062142857142857,
   "TestaDura": 0.7551984126984127
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 37.641679894179894,
  "playsPerGame": {
   "NoccheSbucciate": 0.9918121693121693,
   "EAllora": 0.8275529100529101,
   "Capocciata": 1.0960317460317461,
   "TestaDura": 0.6390608465608466
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 37.93686507936508,
  "playsPerGame": {
   "NoccheSbucciate": 0.8891137566137566,
   "EAllora": 0.6960978835978836,
   "Capocciata": 1.0669973544973546,
   "TestaDura": 0.7753439153439153
  }
 }
}
```

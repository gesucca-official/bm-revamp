# SB-18: round-v1

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,40% / 17,02% / 5,06 | 50,01% / 14,18% / 5,67 | 47,65% | patte 7,02 |
| Duccio–Spazienzio | 95,20% / 3,81% / 4,74 | 93,20% / 3,06% / 5,42 | 90,71% | quota 30,20 |
| Duccio–Mara | 88,14% / 4,99% / 5,07 | 87,57% / 4,45% / 5,64 | 92,95% | quota 23,14 |
| Duccio–Celestina | 95,93% / 2,84% / 5,18 | 92,99% / 3,22% / 5,82 | 93,04% | quota 30,93 |
| Duccio–Piera | 95,27% / 2,88% / 4,83 | 94,08% / 2,48% / 5,60 | 97,05% | quota 30,27 |
| Duccio–Beppe | 96,78% / 3,16% / 4,30 | 95,18% / 2,73% / 4,97 | 98,17% | quota 31,78 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 69,40% | 0,83 |
| Testa dura | 65,02% | 0,65 |
| Nocche sbucciate | 62,22% | 0,75 |
| Sputo da posacenere | 54,85% | 0,66 |
| E allora? | 47,57% | 0,55 |
| Te lo spiego io | 42,96% | 0,48 |
| Spintone | 36,96% | 0,44 |
| Incassare | 16,45% | 0,20 |
| Colpetto | 10,68% | 0,13 |
| Prima io | 9,03% | 0,11 |
| Tartaruga sul marciapiede | 6,16% | 0,06 |
| Fasciatura col fazzolettaccio | 2,49% | 0,02 |
| Alzo la voce | 0,17% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.024691358024691357,
 "endWithLastResort": 0.005291005291005291,
 "searches": 80039,
 "searchMissRate": 1.2481415310036357,
 "turnsPerGame": 4.89222810111699,
 "healthSpentPerGame": 45.8972251616696,
 "healthRecoveredPerGame": 7.174679600235156,
 "healthLostToDamagePerGame": 51.45330393885949,
 "boundShare": 2.6724171080839447,
 "lowHealthTurnsShare": 13.630901452591303,
 "lowHealthMoves": 113432,
 "lowHealthBoundShare": 6.501692644051062,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 16.58636096413874,
  "base.rocco.EAllora": 4.429253380364491,
  "base.rocco.NoccheSbucciate": 8.983280423280423,
  "base.rocco.TestaDura": 15.89833039388595
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 7585,
  "diedInPayingTurn/base.rocco.EAllora": 1381,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 5209,
  "diedInPayingTurn/base.rocco.TestaDura": 12286,
  "payToZero/base.rocco.TestaDura": 5874,
  "payToZero/base.rocco.TestaDura/draw": 2995,
  "payToZero/base.rocco.TestaDura/lost": 2879
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
  "healthSpentPerGame": 46.25994708994709,
  "playsPerGame": {
   "NoccheSbucciate": 0.7416931216931217,
   "EAllora": 0.5362433862433862,
   "Capocciata": 0.8261243386243386,
   "TestaDura": 0.6744708994708994
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 46.65968253968254,
  "playsPerGame": {
   "NoccheSbucciate": 0.7937433862433863,
   "EAllora": 0.6316534391534392,
   "Capocciata": 0.869457671957672,
   "TestaDura": 0.5965608465608465
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 46.89276455026455,
  "playsPerGame": {
   "NoccheSbucciate": 0.7373544973544973,
   "EAllora": 0.5217063492063492,
   "Capocciata": 0.8362037037037037,
   "TestaDura": 0.6993121693121693
  }
 }
}
```

# SB-18: round-v3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 49,82% / 7,30% / 6,09 | 50,64% / 5,72% / 6,85 | 49,65% | — |
| Duccio–Spazienzio | 68,64% / 1,81% / 6,25 | 65,56% / 1,57% / 7,03 | 62,16% | quota 3,64 |
| Duccio–Mara | 42,22% / 2,33% / 6,77 | 46,43% / 2,12% / 7,30 | 66,39% | — |
| Duccio–Celestina | 67,62% / 4,43% / 6,89 | 65,73% / 4,20% / 7,52 | 73,65% | quota 2,62 |
| Duccio–Piera | 58,63% / 3,06% / 6,82 | 60,00% / 2,37% / 7,60 | 77,08% | — |
| Duccio–Beppe | 67,32% / 0,86% / 5,81 | 67,12% / 1,02% / 6,51 | 81,94% | quota 2,32 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 73,67% | 0,90 |
| Sputo da posacenere | 67,34% | 0,86 |
| Nocche sbucciate | 67,34% | 0,84 |
| Testa dura | 62,31% | 0,62 |
| E allora? | 53,64% | 0,67 |
| Te lo spiego io | 52,96% | 0,65 |
| Spintone | 52,86% | 0,66 |
| Incassare | 27,88% | 0,36 |
| Prima io | 25,56% | 0,34 |
| Colpetto | 21,39% | 0,29 |
| Tartaruga sul marciapiede | 12,47% | 0,12 |
| Fasciatura col fazzolettaccio | 8,23% | 0,08 |
| Alzo la voce | 0,60% | 0,01 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.06290417401528513,
 "endWithLastResort": 0.43445032333921224,
 "searches": 105558,
 "searchMissRate": 4.428844805699236,
 "turnsPerGame": 6.388871252204585,
 "healthSpentPerGame": 55.518736037624926,
 "healthRecoveredPerGame": 10.43626102292769,
 "healthLostToDamagePerGame": 56.66342151675485,
 "boundShare": 4.609168463312988,
 "lowHealthTurnsShare": 28.32591210281694,
 "lowHealthMoves": 307831,
 "lowHealthBoundShare": 10.870575088278958,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 21.679294532627868,
  "base.rocco.EAllora": 5.322516166960612,
  "base.rocco.NoccheSbucciate": 11.693909465020576,
  "base.rocco.TestaDura": 16.823015873015873
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 13532,
  "diedInPayingTurn/base.rocco.EAllora": 4552,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 9598,
  "diedInPayingTurn/base.rocco.TestaDura": 10849
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
  "healthSpentPerGame": 57.133478835978835,
  "playsPerGame": {
   "NoccheSbucciate": 0.8315079365079365,
   "EAllora": 0.6694576719576719,
   "Capocciata": 0.917526455026455,
   "TestaDura": 0.6709656084656085
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 57.32063492063492,
  "playsPerGame": {
   "NoccheSbucciate": 0.9110714285714285,
   "EAllora": 0.8092063492063492,
   "Capocciata": 0.9805291005291006,
   "TestaDura": 0.5392328042328043
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 56.671349206349205,
  "playsPerGame": {
   "NoccheSbucciate": 0.8104365079365079,
   "EAllora": 0.5372619047619047,
   "Capocciata": 0.9008333333333334,
   "TestaDura": 0.7187830687830687
  }
 }
}
```

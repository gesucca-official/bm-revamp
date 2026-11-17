# SB-18: round-v3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,45% / 7,54% / 5,99 | 50,23% / 5,74% / 6,74 | 51,76% | — |
| Duccio–Spazienzio | 61,78% / 1,69% / 6,47 | 59,20% / 1,65% / 7,19 | 56,86% | — |
| Duccio–Mara | 33,91% / 3,45% / 6,84 | 38,66% / 2,90% / 7,36 | 57,19% | quota 1,09 |
| Duccio–Celestina | 58,66% / 5,60% / 6,99 | 58,51% / 5,11% / 7,57 | 69,68% | — |
| Duccio–Piera | 49,83% / 3,00% / 7,09 | 51,86% / 2,30% / 7,79 | 70,60% | — |
| Duccio–Beppe | 57,09% / 0,96% / 6,00 | 58,21% / 1,03% / 6,66 | 76,11% | — |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 71,66% | 0,87 |
| Sputo da posacenere | 67,59% | 0,86 |
| Nocche sbucciate | 66,46% | 0,82 |
| Testa dura | 59,06% | 0,59 |
| Te lo spiego io | 54,48% | 0,67 |
| Spintone | 53,34% | 0,67 |
| E allora? | 53,00% | 0,65 |
| Prima io | 30,92% | 0,41 |
| Incassare | 29,00% | 0,37 |
| Colpetto | 22,77% | 0,32 |
| Tartaruga sul marciapiede | 13,39% | 0,13 |
| Fasciatura col fazzolettaccio | 10,62% | 0,11 |
| Alzo la voce | 0,72% | 0,01 |
| Ne ho prese di peggio | 0,00% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.06172839506172839,
 "endWithLastResort": 0.631981187536743,
 "searches": 108215,
 "searchMissRate": 4.68234533105392,
 "turnsPerGame": 6.480176366843033,
 "healthSpentPerGame": 58.39508524397413,
 "healthRecoveredPerGame": 11.845802469135803,
 "healthLostToDamagePerGame": 56.64130511463845,
 "boundShare": 5.060338680441776,
 "lowHealthTurnsShare": 31.420113619250316,
 "lowHealthMoves": 346337,
 "lowHealthBoundShare": 11.556085546736272,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 22.502457378012934,
  "base.rocco.EAllora": 5.870582010582011,
  "base.rocco.NoccheSbucciate": 12.305291005291005,
  "base.rocco.TestaDura": 17.716754850088183
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 14759,
  "diedInPayingTurn/base.rocco.EAllora": 5663,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 10841,
  "diedInPayingTurn/base.rocco.TestaDura": 10579
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
  "healthSpentPerGame": 60.347685185185185,
  "playsPerGame": {
   "NoccheSbucciate": 0.818968253968254,
   "EAllora": 0.6466269841269842,
   "Capocciata": 0.8860449735449736,
   "TestaDura": 0.6402116402116402
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 60.5680291005291,
  "playsPerGame": {
   "NoccheSbucciate": 0.8896164021164021,
   "EAllora": 0.8019312169312169,
   "Capocciata": 0.9476058201058201,
   "TestaDura": 0.5122883597883597
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 59.61238095238095,
  "playsPerGame": {
   "NoccheSbucciate": 0.7956878306878307,
   "EAllora": 0.5273015873015873,
   "Capocciata": 0.8571428571428571,
   "TestaDura": 0.6881878306878307
  }
 }
}
```

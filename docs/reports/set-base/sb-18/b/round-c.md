# SB-18: round-c

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 48,12% / 13,48% / 10,28 | 49,18% / 9,08% / 11,20 | 48,91% | patte 3,48 |
| Duccio–Spazienzio | 98,86% / 0,00% / 6,15 | 96,72% / 0,31% / 7,25 | 94,51% | quota 33,86 |
| Duccio–Mara | 96,03% / 0,38% / 7,07 | 93,64% / 0,88% / 7,99 | 96,39% | quota 31,03 |
| Duccio–Celestina | 97,37% / 1,28% / 7,58 | 89,12% / 2,01% / 8,58 | 83,07% | quota 32,37 |
| Duccio–Piera | 98,98% / 0,42% / 6,64 | 95,55% / 0,79% / 7,89 | 97,53% | quota 33,98 |
| Duccio–Beppe | 99,04% / 0,00% / 5,82 | 96,14% / 0,77% / 6,91 | 99,22% | quota 34,04 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 89,01% | 1,18 |
| Nocche sbucciate | 84,53% | 1,16 |
| Sputo da posacenere | 77,22% | 1,08 |
| Spintone | 70,92% | 0,98 |
| E allora? | 68,96% | 0,96 |
| Te lo spiego io | 62,74% | 0,85 |
| Colpetto | 29,71% | 0,43 |
| Secondo fiato | 24,08% | 0,24 |
| Prima io | 23,74% | 0,34 |
| Incassare | 18,33% | 0,26 |
| Tartaruga sul marciapiede | 15,34% | 0,15 |
| Fasciatura col fazzolettaccio | 5,24% | 0,05 |
| Alzo la voce | 0,88% | 0,01 |
| Ne ho prese di peggio | 0,10% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 1.0970017636684304,
 "endWithLastResort": 0.13227513227513227,
 "searches": 0,
 "searchMissRate": 0.0,
 "turnsPerGame": 7.689382716049383,
 "healthSpentPerGame": 45.270405643738975,
 "healthRecoveredPerGame": 9.281005291005291,
 "healthLostToDamagePerGame": 66.40982363315696,
 "boundShare": 5.7189647421488665,
 "lowHealthTurnsShare": 12.060653045496665,
 "lowHealthMoves": 157749,
 "lowHealthBoundShare": 11.659661867904076,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 23.675132275132274,
  "base.rocco.EAllora": 7.654320987654321,
  "base.rocco.NoccheSbucciate": 13.94095238095238
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 6438,
  "diedInPayingTurn/base.rocco.EAllora": 1653,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 6132
 },
 "lastResortPlaysPerGame": 0.001164021164021164,
 "lastResortGamesShare": 0.10052910052910052
}
```

## Per stile

```
{
 "aggressivo": {
  "games": 75600,
  "healthSpentPerGame": 45.250952380952384,
  "playsPerGame": {
   "NoccheSbucciate": 1.1582142857142856,
   "EAllora": 0.9638888888888889,
   "Capocciata": 1.182063492063492,
   "TestaDura": 0.0
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 46.9,
  "playsPerGame": {
   "NoccheSbucciate": 1.1961111111111111,
   "EAllora": 1.0016666666666667,
   "Capocciata": 1.2266666666666666,
   "TestaDura": 0.0
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 45.59,
  "playsPerGame": {
   "NoccheSbucciate": 1.171031746031746,
   "EAllora": 0.9421031746031746,
   "Capocciata": 1.2000396825396826,
   "TestaDura": 0.0
  }
 }
}
```

# SB-18: round-l2

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,79% / 5,93% / 7,67 | 50,65% / 4,39% / 8,70 | 50,10% | — |
| Duccio–Spazienzio | 86,55% / 0,39% / 6,80 | 82,37% / 0,60% / 7,75 | 74,69% | quota 21,55 |
| Duccio–Mara | 68,89% / 1,91% / 7,68 | 67,75% / 2,06% / 8,36 | 76,64% | quota 3,89 |
| Duccio–Celestina | 83,01% / 4,79% / 8,12 | 74,87% / 4,17% / 8,87 | 68,99% | quota 18,01 |
| Duccio–Piera | 83,33% / 1,32% / 7,41 | 79,33% / 1,15% / 8,53 | 85,12% | quota 18,33 |
| Duccio–Beppe | 82,94% / 0,30% / 6,22 | 79,75% / 0,89% / 7,22 | 92,19% | quota 17,94 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 85,60% | 1,19 |
| Nocche sbucciate | 77,14% | 1,01 |
| Testa dura | 76,87% | 0,77 |
| Sputo da posacenere | 74,84% | 0,99 |
| E allora? | 66,61% | 0,87 |
| Spintone | 59,76% | 0,77 |
| Te lo spiego io | 58,02% | 0,72 |
| Incassare | 28,10% | 0,37 |
| Colpetto | 20,63% | 0,26 |
| Prima io | 19,32% | 0,24 |
| Tartaruga sul marciapiede | 12,01% | 0,12 |
| Fasciatura col fazzolettaccio | 4,25% | 0,04 |
| Alzo la voce | 0,66% | 0,01 |
| Ne ho prese di peggio | 0,01% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.11405055849500294,
 "endWithLastResort": 0.12169312169312169,
 "searches": 119591,
 "searchMissRate": 4.367385505598247,
 "turnsPerGame": 7.367889476778366,
 "healthSpentPerGame": 41.391893004115225,
 "healthRecoveredPerGame": 9.321769547325102,
 "healthLostToDamagePerGame": 64.44828924162258,
 "boundShare": 3.630878384524423,
 "lowHealthTurnsShare": 19.515702023014846,
 "lowHealthMoves": 244586,
 "lowHealthBoundShare": 7.508606379760084,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 16.68,
  "base.rocco.EAllora": 4.3313639035861256,
  "base.rocco.NoccheSbucciate": 8.081504997060552,
  "base.rocco.TestaDura": 12.299024103468549
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 12154,
  "diedInPayingTurn/base.rocco.EAllora": 2124,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 6537,
  "diedInPayingTurn/base.rocco.TestaDura": 8203
 },
 "lastResortPlaysPerGame": 7.054673721340387e-05,
 "lastResortGamesShare": 0.007054673721340388
}
```

## Per stile

```
{
 "aggressivo": {
  "games": 75600,
  "healthSpentPerGame": 41.87832010582011,
  "playsPerGame": {
   "NoccheSbucciate": 0.9811640211640211,
   "EAllora": 0.8366534391534391,
   "Capocciata": 1.2080291005291006,
   "TestaDura": 0.8083333333333333
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 42.06411375661376,
  "playsPerGame": {
   "NoccheSbucciate": 1.1001190476190477,
   "EAllora": 0.9782142857142857,
   "Capocciata": 1.2340608465608465,
   "TestaDura": 0.6934523809523809
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 42.29383597883598,
  "playsPerGame": {
   "NoccheSbucciate": 0.995026455026455,
   "EAllora": 0.8210846560846561,
   "Capocciata": 1.2123544973544973,
   "TestaDura": 0.8284523809523809
  }
 }
}
```

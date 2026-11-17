# SB-18: round-l5

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,47% / 8,96% / 4,82 | 50,81% / 6,57% / 5,40 | 54,98% | — |
| Duccio–Spazienzio | 17,09% / 1,48% / 6,96 | 16,46% / 1,36% / 7,39 | 15,38% | quota 17,91 |
| Duccio–Mara | 4,10% / 0,79% / 6,18 | 7,90% / 0,62% / 6,59 | 15,50% | quota 30,90 |
| Duccio–Celestina | 12,56% / 2,78% / 6,99 | 18,27% / 3,20% / 7,32 | 33,42% | quota 22,44 |
| Duccio–Piera | 9,28% / 1,95% / 7,25 | 13,27% / 1,61% / 7,73 | 25,05% | quota 25,72 |
| Duccio–Beppe | 14,38% / 0,55% / 6,19 | 17,78% / 0,55% / 6,69 | 30,51% | quota 20,62 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Sputo da posacenere | 61,76% | 0,77 |
| Te lo spiego io | 56,98% | 0,70 |
| Capocciata | 55,38% | 0,61 |
| Nocche sbucciate | 53,88% | 0,62 |
| Spintone | 50,02% | 0,62 |
| Prima io | 49,98% | 0,72 |
| E allora? | 45,40% | 0,54 |
| Testa dura | 45,34% | 0,45 |
| Incassare | 35,24% | 0,44 |
| Colpetto | 24,21% | 0,34 |
| Fasciatura col fazzolettaccio | 19,74% | 0,20 |
| Tartaruga sul marciapiede | 15,29% | 0,15 |
| Alzo la voce | 0,67% | 0,01 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.07172251616696061,
 "endWithLastResort": 0.9394473838918284,
 "searches": 106208,
 "searchMissRate": 4.240735161193131,
 "turnsPerGame": 6.174344503233392,
 "healthSpentPerGame": 47.07639035861258,
 "healthRecoveredPerGame": 17.214485596707817,
 "healthLostToDamagePerGame": 52.67556731334509,
 "boundShare": 5.545600310781372,
 "lowHealthTurnsShare": 46.31004250392285,
 "lowHealthMoves": 486374,
 "lowHealthBoundShare": 10.67038945338361,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 17.218930041152262,
  "base.rocco.EAllora": 5.419694297472075,
  "base.rocco.NoccheSbucciate": 9.929782480893593,
  "base.rocco.TestaDura": 14.507983539094651
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 13142,
  "diedInPayingTurn/base.rocco.EAllora": 11740,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 17924,
  "diedInPayingTurn/base.rocco.TestaDura": 12121
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
  "healthSpentPerGame": 49.869338624338624,
  "playsPerGame": {
   "NoccheSbucciate": 0.6723544973544974,
   "EAllora": 0.5141137566137566,
   "Capocciata": 0.657526455026455,
   "TestaDura": 0.48624338624338626
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 49.52984126984127,
  "playsPerGame": {
   "NoccheSbucciate": 0.6371957671957672,
   "EAllora": 0.7224074074074074,
   "Capocciata": 0.6826058201058202,
   "TestaDura": 0.4061772486772487
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 48.65960317460318,
  "playsPerGame": {
   "NoccheSbucciate": 0.6343650793650794,
   "EAllora": 0.43554232804232806,
   "Capocciata": 0.6090343915343915,
   "TestaDura": 0.5344179894179895
  }
 }
}
```

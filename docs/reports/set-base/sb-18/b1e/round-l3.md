# SB-18: round-l3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,62% / 8,99% / 5,95 | 50,56% / 6,72% / 6,70 | 49,01% | — |
| Duccio–Spazienzio | 55,43% / 1,44% / 6,63 | 53,13% / 1,77% / 7,32 | 51,43% | — |
| Duccio–Mara | 26,29% / 2,90% / 6,89 | 31,93% / 2,43% / 7,41 | 50,61% | quota 8,71 |
| Duccio–Celestina | 49,52% / 4,79% / 7,10 | 51,02% / 4,35% / 7,62 | 64,24% | — |
| Duccio–Piera | 41,84% / 3,60% / 7,32 | 44,86% / 2,77% / 7,93 | 65,83% | — |
| Duccio–Beppe | 50,39% / 1,28% / 6,21 | 51,49% / 1,27% / 6,82 | 68,92% | — |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 68,73% | 0,82 |
| Sputo da posacenere | 67,58% | 0,86 |
| Nocche sbucciate | 65,10% | 0,80 |
| Testa dura | 56,71% | 0,57 |
| Te lo spiego io | 56,07% | 0,70 |
| Spintone | 54,75% | 0,69 |
| E allora? | 52,64% | 0,65 |
| Prima io | 35,17% | 0,48 |
| Incassare | 31,06% | 0,39 |
| Colpetto | 24,17% | 0,35 |
| Tartaruga sul marciapiede | 14,15% | 0,14 |
| Fasciatura col fazzolettaccio | 12,71% | 0,13 |
| Alzo la voce | 0,88% | 0,01 |
| Ne ho prese di peggio | 0,00% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.07054673721340388,
 "endWithLastResort": 0.890652557319224,
 "searches": 111077,
 "searchMissRate": 4.83718501579985,
 "turnsPerGame": 6.57591416813639,
 "healthSpentPerGame": 60.330088183421516,
 "healthRecoveredPerGame": 13.127313345091123,
 "healthLostToDamagePerGame": 56.938136390358615,
 "boundShare": 5.435813628736155,
 "lowHealthTurnsShare": 33.68911719769025,
 "lowHealthMoves": 376834,
 "lowHealthBoundShare": 12.214662158934704,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 22.930205761316873,
  "base.rocco.EAllora": 6.459494415049971,
  "base.rocco.NoccheSbucciate": 12.793321575543798,
  "base.rocco.TestaDura": 18.147066431510876
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 14397,
  "diedInPayingTurn/base.rocco.EAllora": 7299,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 11595,
  "diedInPayingTurn/base.rocco.TestaDura": 10812
 },
 "lastResortPlaysPerGame": 1.763668430335097e-05,
 "lastResortGamesShare": 0.001763668430335097
}
```

## Per stile

```
{
 "aggressivo": {
  "games": 75600,
  "healthSpentPerGame": 62.51693121693122,
  "playsPerGame": {
   "NoccheSbucciate": 0.8044576719576719,
   "EAllora": 0.6415343915343915,
   "Capocciata": 0.8438624338624339,
   "TestaDura": 0.6125661375661375
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 62.72854497354497,
  "playsPerGame": {
   "NoccheSbucciate": 0.8600661375661376,
   "EAllora": 0.7918121693121694,
   "Capocciata": 0.9022089947089947,
   "TestaDura": 0.4933597883597884
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 61.74452380952381,
  "playsPerGame": {
   "NoccheSbucciate": 0.7766005291005291,
   "EAllora": 0.5175793650793651,
   "Capocciata": 0.8108862433862434,
   "TestaDura": 0.66994708994709
  }
 }
}
```

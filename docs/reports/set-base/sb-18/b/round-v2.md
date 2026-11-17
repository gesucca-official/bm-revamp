# SB-18: round-v2

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,42% / 14,98% / 6,12 | 50,23% / 12,41% / 6,72 | 47,48% | patte 4,98 |
| Duccio–Spazienzio | 96,97% / 2,05% / 4,69 | 96,12% / 1,53% / 5,37 | 95,80% | quota 31,97 |
| Duccio–Mara | 96,31% / 2,28% / 5,03 | 95,38% / 1,93% / 5,60 | 97,92% | quota 31,31 |
| Duccio–Celestina | 98,61% / 1,25% / 5,22 | 95,90% / 1,70% / 5,87 | 93,36% | quota 33,61 |
| Duccio–Piera | 98,91% / 0,39% / 4,74 | 97,84% / 0,54% / 5,51 | 98,96% | quota 33,91 |
| Duccio–Beppe | 99,15% / 0,86% / 4,31 | 97,92% / 1,11% / 4,99 | 99,03% | quota 34,15 |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 72,13% | 0,88 |
| Nocche sbucciate | 64,94% | 0,79 |
| Testa dura | 64,73% | 0,65 |
| Sputo da posacenere | 57,60% | 0,72 |
| E allora? | 48,45% | 0,58 |
| Spintone | 42,38% | 0,52 |
| Te lo spiego io | 39,93% | 0,45 |
| Incassare | 16,68% | 0,21 |
| Prima io | 12,11% | 0,16 |
| Colpetto | 10,23% | 0,12 |
| Tartaruga sul marciapiede | 7,36% | 0,07 |
| Fasciatura col fazzolettaccio | 4,45% | 0,04 |
| Ne ho prese di peggio | 0,00% | 0,00 |
| Alzo la voce | 0,00% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.007054673721340388,
 "endWithLastResort": 0.0023515579071134627,
 "searches": 74438,
 "searchMissRate": 1.3608640748005052,
 "turnsPerGame": 5.172904174015285,
 "healthSpentPerGame": 47.55238095238095,
 "healthRecoveredPerGame": 2.773856554967666,
 "healthLostToDamagePerGame": 54.83661963550853,
 "boundShare": 2.285003824250407,
 "lowHealthTurnsShare": 9.914525446323548,
 "lowHealthMoves": 87239,
 "lowHealthBoundShare": 6.758445190797694,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 17.535214579659023,
  "base.rocco.EAllora": 4.619024103468548,
  "base.rocco.NoccheSbucciate": 9.503985890652558,
  "base.rocco.TestaDura": 15.894156378600822
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 5455,
  "diedInPayingTurn/base.rocco.EAllora": 1227,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 3546,
  "diedInPayingTurn/base.rocco.TestaDura": 8779,
  "payToZero/base.rocco.TestaDura": 4468,
  "payToZero/base.rocco.TestaDura/draw": 1646,
  "payToZero/base.rocco.TestaDura/lost": 2822
 },
 "lastResortPlaysPerGame": 1.1757789535567314e-05,
 "lastResortGamesShare": 0.0011757789535567313
}
```

## Per stile

```
{
 "aggressivo": {
  "games": 75600,
  "healthSpentPerGame": 48.141851851851854,
  "playsPerGame": {
   "NoccheSbucciate": 0.7841798941798942,
   "EAllora": 0.5915079365079365,
   "Capocciata": 0.8752910052910053,
   "TestaDura": 0.6722883597883598
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 48.016825396825396,
  "playsPerGame": {
   "NoccheSbucciate": 0.8594444444444445,
   "EAllora": 0.6962698412698413,
   "Capocciata": 0.9272486772486772,
   "TestaDura": 0.5503703703703704
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 48.44886243386243,
  "playsPerGame": {
   "NoccheSbucciate": 0.757473544973545,
   "EAllora": 0.4744708994708995,
   "Capocciata": 0.8700529100529101,
   "TestaDura": 0.7359523809523809
  }
 }
}
```

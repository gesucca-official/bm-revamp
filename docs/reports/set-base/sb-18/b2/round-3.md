# SB-18: round-v3

Quote di Duccio sulle decisive; patte e turni su tutte le partite del gruppo. «Euristici»: due bot euristici (D93). Soglia minima D95.

| Incontro | Euristici: quota / patte / turni | Tutti gli stili | com contro com: quota | Fuori D95 |
|---|---|---|---|---|
| Duccio–Duccio | 50,62% / 7,53% / 6,19 | 50,03% / 5,61% / 6,95 | 51,03% | — |
| Duccio–Spazienzio | 61,82% / 1,65% / 6,54 | 59,38% / 1,53% / 7,26 | 56,75% | — |
| Duccio–Mara | 33,00% / 2,94% / 6,94 | 38,54% / 2,62% / 7,47 | 60,27% | quota 2,00 |
| Duccio–Celestina | 57,14% / 5,81% / 7,06 | 57,27% / 5,04% / 7,64 | 69,53% | — |
| Duccio–Piera | 49,43% / 2,58% / 7,16 | 51,56% / 2,15% / 7,85 | 70,13% | — |
| Duccio–Beppe | 57,35% / 0,72% / 6,02 | 58,08% / 0,96% / 6,70 | 75,46% | — |

Partite 259200; violazioni 0; bound oltre il tetto 0.

## Carte di Duccio (soli euristici)

| Carta | Partite in cui è giocata | Giocate per partita |
|---|---:|---:|
| Capocciata | 71,10% | 0,86 |
| Sputo da posacenere | 68,39% | 0,87 |
| Nocche sbucciate | 66,36% | 0,82 |
| Testa dura | 58,50% | 0,59 |
| Te lo spiego io | 55,93% | 0,69 |
| Spintone | 54,73% | 0,69 |
| E allora? | 53,25% | 0,65 |
| Prima io | 32,02% | 0,43 |
| Incassare | 29,39% | 0,38 |
| Colpetto | 24,12% | 0,35 |
| Tartaruga sul marciapiede | 13,28% | 0,13 |
| Fasciatura col fazzolettaccio | 11,54% | 0,12 |
| Alzo la voce | 0,80% | 0,01 |
| Ne ho prese di peggio | 0,00% | 0,00 |

## Letture (soli euristici, per partita e per posto di Duccio)

```
{
 "games": 170100,
 "exhausted": 0.08641975308641975,
 "endWithLastResort": 0.678424456202234,
 "searches": 111825,
 "searchMissRate": 5.158953722334004,
 "turnsPerGame": 6.585055849500294,
 "healthSpentPerGame": 62.98047619047619,
 "healthRecoveredPerGame": 12.322087007642564,
 "healthLostToDamagePerGame": 57.38766607877719,
 "boundShare": 5.400323894446835,
 "lowHealthTurnsShare": 30.972094011523787,
 "lowHealthMoves": 346924,
 "lowHealthBoundShare": 12.754666728159481,
 "healthSpentByCardPerGame": {
  "base.rocco.Capocciata": 24.00641975308642,
  "base.rocco.EAllora": 6.547736625514403,
  "base.rocco.NoccheSbucciate": 13.1212228101117,
  "base.rocco.TestaDura": 19.30509700176367
 },
 "payToZeroWithoutLastBlow": 0,
 "payToZero": {
  "diedInPayingTurn/base.rocco.Capocciata": 14491,
  "diedInPayingTurn/base.rocco.EAllora": 5994,
  "diedInPayingTurn/base.rocco.NoccheSbucciate": 10695,
  "diedInPayingTurn/base.rocco.TestaDura": 10265
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
  "healthSpentPerGame": 65.11550264550264,
  "playsPerGame": {
   "NoccheSbucciate": 0.8206084656084656,
   "EAllora": 0.6513227513227513,
   "Capocciata": 0.8769047619047619,
   "TestaDura": 0.6339153439153439
  }
 },
 "prudente": {
  "games": 75600,
  "healthSpentPerGame": 65.31492063492064,
  "playsPerGame": {
   "NoccheSbucciate": 0.8864153439153439,
   "EAllora": 0.8026587301587301,
   "Capocciata": 0.9414417989417989,
   "TestaDura": 0.5074338624338625
  }
 },
 "risorse": {
  "games": 75600,
  "healthSpentPerGame": 64.27683862433862,
  "playsPerGame": {
   "NoccheSbucciate": 0.7953042328042328,
   "EAllora": 0.5258333333333334,
   "Capocciata": 0.8458201058201058,
   "TestaDura": 0.6851719576719577
  }
 }
}
```

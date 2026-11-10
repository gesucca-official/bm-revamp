# C4-11 — evidenze della Fase A

9 novembre 2026, base `f706a4e`, jar locale `5684bffda536ac67` (ricostruito qui con `./scripts/build.ps1 -Task Server -Offline`).
Rapporto: [C4-11 — Fase A](../c4-11.md#c4-11--fase-a). Proposta: [spazio/proposta.md](../../../design/client-c4/spazio/proposta.md).

| Cartella o file | Cosa contiene |
|---|---|
| `catture/` | Catture ricompresse (JPEG 0,55, larghezza al più 1440 px) di `client-web/tools/guide-captures.mjs` con `BM_LAYOUT=1`, partite reali, due turni. Nome: `<opzione>-<modo>-<larghezza>-<momento>.jpg`. `oggi` è il prodotto; `a` = a1 + a2; `v1`, `b1`, `b2`, `b12` = b1 + b2, `c1`, `c2`, `d` (874×292 con area sicura emulata 62 px per lato) e `d0` (oggi a 750×292, per confronto). Momenti: `scelta` (turno 1), `sequenza` (2,6 s dall'inizio della sequenza del turno 1), `dopo` (dopo la sequenza del turno 1), `mira` (turno 1), `mira2` (turno 2, con una legata scelta: il caso di `VerifyAim`) |
| `catture/*.json` | I JSON completi (minificati) dei giri di cattura con geometria propria: oggi (1366, 844, 1920 e 750), `a`, `v1`, `b1`, `d` (layout della scena, `hits`, riquadri del guscio HTML, momenti). Quelli di `b2`, `b12`, `c1` e `c2` restano fuori da git per il peso (D13): c1 e c2 non cambiano la geometria, b2 e b12 sono nella sonda |
| `sonda/space-probe-*.json` | `client-web/tools/space-probe.mjs` sulle funzioni pure: fattori, misure, occupazione, distanze, `layoutProblems`, frecce che attraversano, a 1366×768, 844×390, 1920×1080, 750×292 e 874×292 con 1 e 3 oggetti per posto; oggi e con ciascuna opzione |
| `sonda/space-real-*.json` | La stessa occupazione sui layout registrati nelle partite reali (`BM_CAPTURES`) |
| `verifiche/` | `Size` del prodotto ripristinato (`BM_OUT`) |

Catture su Edge via Playwright, PC, server locale su database temporaneo: non un dispositivo fisico. Le catture intere (circa 170 MB) restano
fuori da git (D13). Nessuna verifica della matrice (`Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout`, `VerifyResolution`) è stata eseguita
in questa fase: spettano alla Fase B.

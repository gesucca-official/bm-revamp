# C4-10 — evidenze della Fase B

9 novembre 2026, base `d70be28`, jar locale `7e6045b4e53b0395`. Rapporto: [C4-10 — Fase B](../../client-c4-report.md#c4-10--fase-b).

| Cartella | Cosa contiene |
|---|---|
| `base/` | VerifyAll `test,build,size,verify,layout` sulla base, misure ufficiali, prima del codice: 7/7 |
| `fase-b/primo-giro/` | primo giro della matrice di Fase B: layout rosso a entrambe le misure (tocco sullo scarto annullato dal click sintetico, corretto), aim 844 rosso |
| `fase-b/layout-aim-verify/` | dopo la correzione: verify, aim, layout alle misure ufficiali; 5/6, aim 844 rosso come sulla base |
| `fase-b/ffa-resolution/` | sul codice finale: test, build, size, ffa, resolution completa (quick, interruzioni, movimento ridotto), misure ufficiali: 7/7 |
| `fase-b/m750/` | verify e layout a 750×292 e `comparison.json` con C4-7-ter |
| `base-aim844/` | aim 844 rilanciato sulla base `d70be28`: stesso rosso |
| `mutazioni.json` | mutazioni su copie fuori dal repository |
| `catture/normale/`, `catture/ridotto/` | `client-web/tools/guide-captures.mjs` sul prodotto, duello e FFA, 1366×768 e 844×390; scelta, mira, scarto scelto, sequenza a 1,3 s, dopo; con movimento ridotto solo lo scarto scelto. JSON completi, catture selezionate |

Catture su Edge via Playwright, PC, server locale su database temporaneo: non un dispositivo fisico. Registri completi e catture intere fuori da git (D13).

# C4-11 — evidenze della Fase B, primo tempo (B1)

10 novembre 2026, base `066aa07` («C4-11: record the owner's choice»). Codice e test unitari della [scelta del proprietario](../../../../design/client-c4/spazio/proposta.md#scelta-del-proprietario);
**nessuna verifica Playwright** (`Verify*`, catture): arrivano in B2, con gli strumenti di C4-1c. Rapporto e piano si aggiornano in B2.

| File | Cosa contiene |
|---|---|
| `sonda/space-probe-prima.json` | `client-web/tools/space-probe.mjs` sul codice di `066aa07` (copia fuori dal repository), 1366×768, 844×390, 750×292, 1920×1080 e 2560×1440, 1 e 3 oggetti per posto |
| `sonda/space-probe-dopo.json` | La stessa sonda sul codice di B1 |
| `sonda/confronto.json` | Prima e dopo per riga: fattori, misure, `layoutProblems`, frecce che attraversano, vuoto; `rule17_18_violations` vuoto (a 1366×768 e 844×390 nessun fattore o misura scende, a 750×292 nessun conteggio sale) |
| `mutazioni.json`, `mutazioni.py` | Mutazioni su copie di `client-web/src`, `tests` e `index.html` fuori dal repository (`%TEMP%`, con i tre documenti letti dai test), `space`, `sound`, `readability` e `own-items`: base 94/94, ogni mutazione 1–4 test falliti |
| `size.json` | `./client-web/run.ps1 -Task Size` con `BM_OUT`: texture invariate (27 729 048 B, 82,6% del tetto di 32 MiB), JS gzip 348 034 B |

Sonda e mutazioni sono funzioni pure su Node 24 del client: nessun browser, nessun server.

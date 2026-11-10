# C4-11 — evidenze della Fase B

10 novembre 2026. Rapporto: [C4-11 — Fase B](../../../client-c4-report.md#c4-11--fase-b). Scelta: [proposta](../../../../design/client-c4/spazio/proposta.md#scelta-del-proprietario).

**B1** (codice e test unitari, `681bc20`, base `066aa07`): nessun browser. **B2** (verifiche mirate secondo D16 del [piano](../../../../client-c4-plan.md#decisioni-del-proprietario)): sul codice di `681bc20`, jar `d28ccf21415efc7e` ricostruito con `./scripts/build.ps1 -Task Server -Offline` e riusato dichiaratamente; Edge via Playwright su PC, server locale su database temporaneo, non un dispositivo fisico.

| File o cartella | Cosa contiene |
|---|---|
| `sonda/space-probe-prima.json`, `sonda/space-probe-dopo.json`, `sonda/confronto.json` | (B1) `client-web/tools/space-probe.mjs` su `066aa07` (copia fuori dal repository) e sul codice di B1, 1366×768, 844×390, 750×292, 1920×1080 e 2560×1440, 1 e 3 oggetti per posto; confronto per riga con `rule17_18_violations` vuoto |
| `mutazioni.json`, `mutazioni.py` | (B1) 26 mutazioni su copie fuori dal repository: base 94/94, ogni mutazione 1–4 test falliti |
| `size.json` | (B1) `Size` con `BM_OUT`: texture 27 729 048 B invariate, JS gzip 348 034 B |
| `giro-1/` | (B2) `VerifyAll -ReuseJar -Measures 1366x768,844x390 -Only test,build,size,verify,aim,layout`: **7/9**, rossi aim e layout 1366 solo per la cadenza dei frame |
| `giro-2/` | (B2) `VerifyAll -ReuseJar -Measures 1920x1080,750x292 -Only verify,layout`, **misure non standard dichiarate** (1920×1080 non è ancora fra quelle dello strumento): verify verdi; layout 1920 rosso solo per la cadenza; layout 750 rosso preesistente con i conteggi della base |
| `base-1366/`, `base-1920/` | (B2) Lo stesso controllo sulla build di `066aa07` (copia fuori dal repository, stesso jar, stessi strumenti), servita sulla 4320: `VerifyAim` e `VerifyLayout` a 1366×768, `VerifyLayout` a 1920×1080. Anche la base è rossa per la cadenza, con valori uguali o peggiori |
| `esito-audio/` | (B2) `VerifyOutcomeAudio` a 1366×768 senza sonda e con la sonda audio (`NODE_OPTIONS=--import=./tools/verify-audio-probe.mjs`, `BM_AUDIO_PROBE=on`); `audio.jsonl` e l'esito di `check-audio-probe.mjs --require=win,loss` |
| `catture/` | (B2) `guide-captures.mjs` sulla build di `066aa07` (`prima-…`) e di `681bc20` (`dopo-…`), un turno, duello e FFA, 1366×768, 844×390 e 1920×1080; normali (`scelta`, `sequenza-2600`, `dopo`) e con movimento ridotto (`-ridotto-`, `scelta`, `dopo`); 0 errori di pagina in tutti e quattro i giri. Ricompresse (JPEG 0,55, larghezza al più 1440 px). `ombra-primo-piano-1366*.jpg`: la stessa zona prima e dopo ingrandita 2× (personaggio avversario, personaggio proprio, carte della mano). `primo-piano.mjs`: lo script che ricomprime e ingrandisce (non è uno strumento di `client-web`) |

Le partite di prima e dopo sono partite diverse (mani e carte del round cambiano); la geometria a 1366×768 e 844×390 (desktop) è la stessa per le parti non toccate. Catture intere (circa 41 MB) e log fuori da git (D13).

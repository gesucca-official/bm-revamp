# C4-9 — Evidenze della Fase A

11 novembre 2026, commit `091b1f1`, `dist` `433dccadf326d201` in tutti i giri. Rapporto: [c4-9.md](../c4-9.md).

- `matrice/`: riepilogo del giro completo `VerifyAll -Parallel 4 -Split 'resolution,ffa'` (25/25) e `size.json`.
- `confronto.json`: `compare-runs.mjs` fra il giro completo di C4-1c Fase B e questo.
- `m750/`: regola 18 a 750×292 (`Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout`), JSON minificati; rossi R1 e R4.
- `audio-negato/`: `Verify` alle tre misure con la sonda `BM_AUDIO_PROBE=blocked`; `check.json` riassume il registro (avvii, origini esterne, errori).
- `catture/`: `T1` di duello e FFA a 1366×768, 844×390, 1920×1080 e 750×292 dal giro, più due copie in scala di grigi (fatte da questa sessione con una matrice di luminanza 0,299/0,587/0,114).
- `prova-scheda.md`: scheda per il giudizio del proprietario.

JSON completi, log e le altre 440 catture restano in `%TEMP%\bm-c4-9` e nelle cartelle `%TEMP%\bm-verify-all-2026-11-11T*` citate nel rapporto.

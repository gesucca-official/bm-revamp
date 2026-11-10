# C4-8a — Fase A: evidenze

10 novembre 2026, su `main` a `ac1e885`. Analisi e proposta in [`docs/design/client-c4/accessibilita/proposta.md`](../../../../design/client-c4/accessibilita/proposta.md). **Dimensione: circa 8 MB** (D13: JPEG ricompressi a qualità 55, JSON minificati; selezione di catture, le altre sono nella cartella temporanea della sessione e non sono tracciate).

Tutte le evidenze vengono da sonde in Playwright con Edge su un server temporaneo, sul tavolo vero (build di `main`); il prodotto non è stato modificato. Il prototipo è la [patch](../../../../design/client-c4/accessibilita/prototipo.patch), provata in una copia fuori dal repository (rimossa).

| File | Cosa contiene |
|---|---|
| `focus-<modo>-<misura>.json`, `focus-*-tNN.jpg` | Punto 1: ordine di Tab, anello su ogni fermata; catture di alcune fermate (t00 prima, t03 una carta, ultima il menu) |
| `ring-duel-1366x768.json`, `ring-confirm.json`, `ring-orig-*.jpg` | Punto 1: contrasto dell'anello sui pixel; ✓ e × (cattura «prima») |
| `htmlfocus-1366x768.json` e `htmlfocus-*.jpg` | Focus sui controlli HTML sopra il tavolo e nelle finestre |
| `kbd-*.json`, `kbd-*.jpg` | Punto 2: partite da tastiera (il file `kbd-duel-1366x768-reduced.json` è della seconda partita, 10 turni; la prima, 13 turni, è riassunta nella proposta), esito |
| `leave.json`, `hub-keys.json` | Uscita dalla tastiera; tastiera nell'hub |
| `contrast-<modo>-<misura>.json`, `contrast-*.jpg` | Punto 3: coppie uniche di testo e fondo per stato (tipico e basso); catture degli stati |
| `contrast-static.json` | Punto 3: 62 coppie di colori del disegno calcolate dalle costanti, con soglia |
| `controls.json` | Punto 3: campi, pulsanti, segnaposto e collegamenti della shell, con rapporti |
| `shell.json`, `shell-683x384-*.jpg` | Punto 4: schermate HTML a 100% e alle dimensioni del 200%, con spaziatura WCAG 1.4.12 |
| `zoom-table.json`, `zoom-*.jpg` | Punto 4: il tavolo a 683×384 e 960×540 |
| `reduced-on-1366x768.json`, `reduced-on-*.jpg` | Punto 5: round con movimento ridotto, riepilogo e testo di «Ultimo turno» |
| `color-<misura>-<stato>-<filtro>.jpg` | Punto 6: grigi (`gray`), deuteranopia (`deut`), protanopia (`prot`) |
| `color-aria.json` | Punto 7: albero di accessibilità del tavolo (duello 1366 e 844, FFA 844) |
| `blow.json`, `blow-*.jpg` | Punto 8: ExtremelyViolentBlow con la V reale; ispezione |
| `prototipo/` | Misure del prototipo: anello, tastiera, controlli, catture di ✓ ×; patch non è qui |
| `sonde/` | Gli script di sonda (non sono strumenti del progetto: `client-web/tools` non è toccato) |

**Come rilanciare una sonda:** servono il jar costruito, `./client-web/run.ps1 -Task Serve` e le porte 8080 e 4320 libere; gli script importano `@playwright/test` da `client-web/node_modules` con `createRequire`. Ognuno parte e ferma il proprio server (`lib.mjs`). Variabili: `VP` (misura), `MODE` (`duel` o `ffa`), `REDUCED`, `TURNS`, `OUT`, `BM_CLIENT`.

## Verifiche finali

Alla chiusura della Fase A, sul checkout con i soli file di questa fase non tracciati:

| Verifica | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` | **307 su 307** |
| `./scripts/build.ps1 -Task Test -Offline` | **BUILD SUCCESS**, 655 test, 0 falliti, 7 saltati |
| `python scripts/check-rules.py` | verde (regolamento 1.13, Set Base 0.1) |
| `git diff --check` | nessun avviso |
| `git apply --check docs/design/client-c4/accessibilita/prototipo.patch` | verde su `main` a `ac1e885` |
| `git status` | solo `docs/design/client-c4/accessibilita/` e `docs/reports/client-c4/c4-8a/` |
| Porte 8080, 4320, 4321 | libere (anteprime fermate, copia temporanea rimossa) |

Non eseguiti, perché fuori dalla Fase A: `VerifyAll` e le Playwright del piano (Fase B, D16), `TestServerContext`.

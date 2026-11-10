# Metodo — rapporto C4 diviso per blocco, controllo dei link, script di revisione

10 novembre 2026. Solo metodo e documenti: nessun codice di prodotto, nessuna regola, nessun test o atteso toccato, nessuna verifica
Playwright. Nessun push.

## Cosa cambia

- **`scripts/check-links.py`** (solo libreria standard): link relativi e ancore dei `.md` in `docs/`, `CONTRIBUTING.md`, `AGENTS.md`,
  `client-web/README.md`. Le ancore sono calcolate come GitHub (minuscole, punteggiatura tolta, `-1`, `-2` per i titoli doppi);
  ignora http/https/mailto e i blocchi di codice; esce con 1 e li elenca se ci sono link rotti.
- **`docs/reports/client-c4-report.md` è un indice**: introduzione generale invariata e una riga per blocco; nessuno stato.
  Il testo sta in **`docs/reports/client-c4/<blocco>.md`**, uno per blocco (14), accanto alle cartelle di evidenze omonime.
- **`scripts/review-block.py <base>..<testa> [--scope glob,...] [--max-lines N]`** (libreria standard e git): file per categoria
  (prodotto, test, strumenti, documenti, evidenze, altro) con righe e byte, e quelli fuori `--scope`; righe di test con `assert`,
  `expect`, `BASE_750` o attesi numerici; righe di strumenti con numeri; peso delle evidenze con avviso oltre 3 MB;
  esiti dei `run-summary.json` aggiunti; messaggi dei commit. Le categorie: evidenze = file non `.md` sotto `docs/reports`;
  prodotto = `client-web/src`, `client-web/index.html`, `server/src/main`, `docs/game-rules.md`, `docs/sets`, `docs/rules-catalog.json`;
  test = `client-web/tests`, `server/src/test`; strumenti = `client-web/tools`, `client-web/run.ps1`, `scripts`; documenti = gli altri
  `.md`; altro = il resto (per esempio un `.patch`).
- `docs/orchestrazione-lavoro.md`, «Come si rivede una relazione»: tolto «quando c'è», aggiunto `check-links.py` ai controlli dei
  documenti, indicato che il rapporto di un blocco sta nel suo file; il rimando agli «ultimi valori» punta ora a C4-11 Fase B.
  `CONTRIBUTING.md`: i due comandi. `docs/client-c4-plan.md` (riga sui documenti del blocco): il rapporto va in `client-c4/c4-n.md`.

## Link: elenco iniziale e finale

Lanciato prima di ogni modifica (206 file):

```
docs/design/client-c4/background/layers/registro-piano-1.md:143: file mancante -> checklist-integrazione.md
docs/reports/set-base/sb-13-report.md:380: file mancante -> ../README.md
docs/reports/set-base/sb-14-report.md:421: file mancante -> ../README.md
docs/reports/set-base/sb-15-report.md:160: file mancante -> ../../../server/src/test/java/com/gsc/bm/model/cards/base/gigi/LavoroFattoBene.java
docs/reports/set-base/sb-15-report.md:518: file mancante -> ../README.md
206 file controllati, 5 link rotti
```

Alla fine: 220 file controllati (i 14 nuovi), **4 link rotti, nessuno nuovo**. Corretto il banale
(`docs/design/client-c4/background/layers/registro-piano-1.md:143`, `checklist-integrazione.md` → `../checklist-integrazione.md`).
Restano, da elencare e non toccati perché sono rapporti del filone Set Base: `sb-13-report.md:380`, `sb-14-report.md:421`,
`sb-15-report.md:518` (puntano a `../README.md`, che non esiste in `docs/reports/`: voleva essere `../../README.md`) e
`sb-15-report.md:160` (`LavoroFattoBene.java` non esiste sotto `server/src/test/.../base/gigi/`).

## Divisione del rapporto

Prima: 1650 righe (1102 non vuote). Dopo: 14 file di blocco per 1630 righe e l'indice di 23 (introduzione di 4 righe più l'elenco).
Le 1102 righe non vuote sono le stesse.

| File | Righe | Sezioni |
|---|---:|---|
| `c4-1.md` | 57 | C4-1 |
| `c4-1b.md` | 110 | C4-1b |
| `c4-3.md` | 107 | C4-3 |
| `c4-2.md` | 157 | C4-2 |
| `c4-4.md` | 100 | C4-4 |
| `c4-5a.md` | 87 | C4-5a |
| `c4-5a-bis.md` | 89 | C4-5a-bis |
| `c4-5b.md` | 135 | C4-5b (Fase 0, A, B) |
| `c4-7.md` | 65 | C4-7 Fase 0, A, B **e** «prova del proprietario del 7 novembre» |
| `c4-7-bis.md` | 133 | C4-7-bis Fase A, B |
| `c4-7-ter.md` | 93 | C4-7-ter Fase A, B, prova del proprietario |
| `c4-10.md` | 158 | C4-10 Fase 0, A, B, prova del 9 novembre, destinazioni |
| `c4-11.md` | 124 | C4-11 Fase A, B |
| `c4-1c.md` | 215 | C4-1c Fase A, B |

Scelte di forma, da guardare:

- Il primo livello di ogni file è `#`. In `c4-10.md` le tre fasi stavano a livello 3 (`### C4-10 — Fase 0/A/B`, dentro la sezione
  della prova di C4-7-ter): sono diventate `#` e i loro sottotitoli `##`, come negli altri blocchi.
- La «prova del proprietario del 7 novembre» (titolo `C4-7`, ma nel vecchio rapporto dopo C4-7-bis) sta in `c4-7.md`, dopo la Fase B:
  l'ordine cronologico del vecchio file non è più conservato, quello per blocco sì.
- Le ancore dei titoli doppi sono ricalcolate per file (per esempio i `Verifiche` ripetuti): i link nel testo spostato e fuori sono
  stati rimappati uno per uno dalla vecchia ancora al titolo che indicava; nessuna ancora senza corrispondenza.
- `docs/reports/client-c4/c4-8a/` ha evidenze ma il vecchio rapporto non aveva una sezione C4-8a: nessun `c4-8a.md` è stato inventato.

## Link aggiornati

112 link alle ancore del vecchio rapporto, in 23 file fuori dal rapporto: `docs/client-c0-parity.md` (15), `docs/client-c4-plan.md` (33),
`docs/client-roadmap.md` (24), `docs/reports/rossi-noti.md` (6), `client-web/README.md` (7), 13 fra proposte, registri e README di
evidenze sotto `docs/design/client-c4/` e `docs/reports/client-c4/`. Cercati in cartelle precise: né `client-web/tests`,
`client-web/tools`, `client-web/src`, `scripts`, né i file di primo livello leggono il vecchio rapporto (nessuna corrispondenza).
Restano come testo, senza link, due citazioni del percorso `docs/reports/client-c4-report.md` (il piano, aggiornato; la checklist di
integrazione di C4-5a, storica, lasciata): il file esiste ancora come indice.

## Prova che non si è perso nulla

Script usa e getta (fuori dal repository, in `%TEMP%`): legge il vecchio rapporto da `git show 7ed04a5:docs/reports/client-c4-report.md` (il commit di base), normalizza ogni riga non
vuota (livello dei titoli e percorso dei link tolti) e confronta il multinsieme con le righe dei 14 file e dell'introduzione
dell'indice. «Uno e un solo file» vale per le righe che compaiono una volta sola; le 21 righe che si ripetono (`|---|---|`,
recinti di codice, …) tornano con lo stesso numero di occorrenze.

```
righe non vuote vecchio rapporto: 1102
righe non vuote nei nuovi file (14 blocchi + introduzione dell'indice): 1102
  c4-1.md: 47
  c4-10.md: 99
  c4-11.md: 79
  c4-1b.md: 82
  c4-1c.md: 172
  c4-2.md: 105
  c4-3.md: 84
  c4-4.md: 73
  c4-5a-bis.md: 47
  c4-5a.md: 52
  c4-5b.md: 79
  c4-7-bis.md: 87
  c4-7-ter.md: 53
  c4-7.md: 40
  (indice: introduzione): 3
mancanti: 0, in più: 0
righe uniche nel vecchio: 1022, presenti in un solo file nuovo: 1022
righe ripetute nel vecchio (|---|, apici, ...): 21, conteggio totale conservato: True
```

## `review-block.py` su tre intervalli reali

Con `--scope` scelto a mano per ogni intervallo. Le uscite sono accorciate dove lunghe (elenchi di file omessi; nel terzo anche le
righe di test e strumenti, ridotte alle intestazioni per file).

### 681bc20..25353ce (C4-11, B2) — `--scope 'client-web/src/*,client-web/tests/*,docs/reports/client-c4/c4-11*'`

```
== 681bc20..25353ce: 95 file toccati ==

[documenti] 8 file, +193 -27 righe, 500.4 KB
  M CONTRIBUTING.md  (+9 -0, 2.1 KB)
  M client-web/README.md  (+28 -1, 66.8 KB)
  M docs/README.md  (+2 -2, 16.5 KB)
  M docs/client-c0-parity.md  (+3 -3, 43.9 KB)
  M docs/client-c4-plan.md  (+29 -9, 82.4 KB)
  M docs/client-roadmap.md  (+3 -2, 90.3 KB)
  M docs/reports/client-c4-report.md  (+105 -0, 195.4 KB)
  M docs/reports/client-c4/c4-11/fase-b/README.md  (+14 -10, 3.0 KB)

[evidenze] 87 file, +906 -0 righe, 10.24 MB
  A docs/reports/client-c4/c4-11/fase-b/base-1366/aim-1366.txt  (+25 -0, 3.1 KB)
  A docs/reports/client-c4/c4-11/fase-b/base-1366/aim-1366x768.json  (+1 -0, 25.3 KB)
  A docs/reports/client-c4/c4-11/fase-b/base-1366/layout-1366.txt  (+51 -0, 11.0 KB)
  A docs/reports/client-c4/c4-11/fase-b/base-1366/layout-1366x768.json  (+1 -0, 204.3 KB)
  A docs/reports/client-c4/c4-11/fase-b/base-1920/layout-1920.txt  (+51 -0, 11.5 KB)
  A docs/reports/client-c4/c4-11/fase-b/base-1920/layout-1920x1080.json  (+1 -0, 186.9 KB)
  A docs/reports/client-c4/c4-11/fase-b/catture/dopo-duel-1366x768-dopo.jpg  (binario, 187.1 KB)
  A docs/reports/client-c4/c4-11/fase-b/catture/dopo-duel-1366x768-scelta.jpg  (binario, 187.6 KB)
  A docs/reports/client-c4/c4-11/fase-b/catture/dopo-duel-1366x768-sequenza-2600.jpg  (binario, 182.7 KB)
  A docs/reports/client-c4/c4-11/fase-b/catture/dopo-duel-1920x1080-dopo.jpg  (binario, 167.8 KB)
  A docs/reports/client-c4/c4-11/fase-b/catture/dopo-duel-1920x1080-scelta.jpg  (binario, 163.9 KB)
  A docs/reports/client-c4/c4-11/fase-b/catture/dopo-duel-1920x1080-sequenza-2600.jpg  (binario, 165.9 KB)
  ... altri 75 file di evidenze (peso sotto)

== Fuori da --scope (client-web/src/*, client-web/tests/*, docs/reports/client-c4/c4-11*): 7 ==
  M [documenti] CONTRIBUTING.md
  M [documenti] client-web/README.md
  M [documenti] docs/README.md
  M [documenti] docs/client-c0-parity.md
  M [documenti] docs/client-c4-plan.md
  M [documenti] docs/client-roadmap.md
  M [documenti] docs/reports/client-c4-report.md

== Test: righe con assert, expect, BASE_750 o attesi numerici ==
  nessuna

== Strumenti: righe cambiate con numeri (possibili soglie) ==
  nessuna

== Evidenze aggiunte in git ==
    10.24 MB  docs/reports/client-c4/c4-11/fase-b
  totale: 10.24 MB in 87 file
  AVVISO: oltre 3 MB (10.24 MB): il contratto indica al più 3 MB per fase

== run-summary.json aggiunti ==
  docs/reports/client-c4/c4-11/fase-b/giro-1/run-summary.json: 7/9 verdi, rossi: aim@1366x768, layout@1366x768  [non equivalente al consolidamento, 2 avvisi]
  docs/reports/client-c4/c4-11/fase-b/giro-2/run-summary.json: 2/4 verdi, rossi: layout@1920x1080, layout@750x292  [non equivalente al consolidamento, 2 avvisi]

== Commit ==
  25353ce simone 2026-11-10
    C4-11: phase B verifications and docs

    Targeted verifications of the phase B code (681bc20) under the owner's
    method decision D16 of 10 November 2026: Verify at 1366x768, 844x390,
    1920x1080 and 750x292; VerifyLayout at the same sizes; VerifyAim at
    1366x768 and 844x390 (844 green again with v1); VerifyOutcomeAudio with
    and without the audio probe. Frame-cadence reds at 1366 and 1920
    reproduced on the base build 066aa07 with the same jar and tools.
    Captures before and after, normal and reduced motion, and shadow
    close-ups. Plan (D16, 1920x1080 official for Verify and VerifyLayout,
    end-of-C4 full matrix, a3 kept in reserve), report, roadmap, index,
    CONTRIBUTING, client README and parity rows updated. No code changed.

    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

### 6482e27~1..6482e27 (C4-8a, A) — `--scope 'client-web/tools/*,docs/*'`

```
== 6482e27~1..6482e27: 128 file toccati ==

[documenti] 2 file, +380 -0 righe, 50.2 KB
  A docs/design/client-c4/accessibilita/proposta.md  (+338 -0, 46.6 KB)
  A docs/reports/client-c4/c4-8a/fase-a/README.md  (+42 -0, 3.7 KB)

[evidenze] 125 file, +753 -0 righe, 7.75 MB
  A docs/reports/client-c4/c4-8a/fase-a/blow-face-turn8.jpg  (binario, 172.2 KB)
  A docs/reports/client-c4/c4-8a/fase-a/blow-face-zoom-turn8.jpg  (binario, 13.3 KB)
  A docs/reports/client-c4/c4-8a/fase-a/blow-inspection.jpg  (binario, 96.7 KB)
  A docs/reports/client-c4/c4-8a/fase-a/blow.json  (+1 -0, 1.7 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-aim-deut.jpg  (binario, 154.6 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-aim-gray.jpg  (binario, 144.7 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-aim-prot.jpg  (binario, 149.6 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-confirm-deut.jpg  (binario, 157.8 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-confirm-gray.jpg  (binario, 148.2 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-hub-gray.jpg  (binario, 104.0 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-table-start-deut.jpg  (binario, 160.2 KB)
  A docs/reports/client-c4/c4-8a/fase-a/color-1366x768-table-start-gray.jpg  (binario, 149.9 KB)
  ... altri 113 file di evidenze (peso sotto)

[altro] 1 file, +93 -0 righe, 7.6 KB
  A docs/design/client-c4/accessibilita/prototipo.patch  (+93 -0, 7.6 KB)

== Fuori da --scope (client-web/tools/*, docs/*): 0 ==
  nessuno

== Test: righe con assert, expect, BASE_750 o attesi numerici ==
  nessuna

== Strumenti: righe cambiate con numeri (possibili soglie) ==
  nessuna

== Evidenze aggiunte in git ==
     7.75 MB  docs/reports/client-c4/c4-8a/fase-a
  totale: 7.75 MB in 125 file
  AVVISO: oltre 3 MB (7.75 MB): il contratto indica al più 3 MB per fase

== run-summary.json aggiunti ==
  nessuno

== Commit ==
  6482e27 simone 2026-11-10
    C4-8a: phase A proposal for accessibility and O21

    Analysis on the real table (focus, keyboard-only games, contrast on the
    drawn pixels, zoom, reduced motion, colour-only information, accessible
    labels, ExtremelyViolentBlow with the real V, D5 b), a prototype patch
    (not applied, git apply --check green on main) and eleven numbered
    questions for the owner. No product code, tool or common document changed.

    Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
```

### ac1e885..82c4ef4 (C4-1c, B, con SB-8) — `--scope 'client-web/tools/*,client-web/run.ps1,docs/*'`

```
== ac1e885..82c4ef4: 261 file toccati ==

[prodotto] 20 file, +2201 -38 righe, 134.5 KB
[test] 9 file, +312 -1539 righe, 16.7 KB
[strumenti] 9 file, +369 -39 righe, 112.2 KB
[documenti] 15 file, +971 -64 righe, 619.2 KB
[evidenze] 207 file, +4526 -0 righe, 12.94 MB
[altro] 1 file, +93 -0 righe, 7.6 KB
== Fuori da --scope (client-web/tools/*, client-web/run.ps1, docs/*): 34 ==
== Test: righe con assert, expect, BASE_750 o attesi numerici ==
  server/src/test/java/com/gsc/bm/BozzaCliTest.java: 9 righe
  server/src/test/java/com/gsc/bm/BozzaProfileOffContextTest.java: 31 righe
  server/src/test/java/com/gsc/bm/bozza/BozzaDraftTest.java: 14 righe
  server/src/test/java/com/gsc/bm/model/cards/base/pino/GoingBerserk.java: 2 righe
  server/src/test/java/com/gsc/bm/sim/DataCards.java: 4 righe
  server/src/test/java/com/gsc/bm/sim/Draft.java: 19 righe

== Strumenti: righe cambiate con numeri (possibili soglie) ==
  client-web/run.ps1: 5 righe
  client-web/tools/verify-all-faults.mjs: 27 righe
  client-web/tools/verify-all-parallel.mjs: 11 righe
  client-web/tools/verify-all.mjs: 34 righe
  client-web/tools/verify-ffa.mjs: 3 righe
  client-web/tools/verify-processes.mjs: 6 righe
  scripts/check-rules.py: 3 righe
  scripts/cli-draft-complete-test.cjs: 27 righe
  scripts/dev.ps1: 1 righe

== Evidenze aggiunte in git ==
     7.75 MB  docs/reports/client-c4/c4-8a/fase-a
     4.49 MB  docs/reports/client-c4/c4-1c/fase-b
    179.5 KB  docs/reports/set-base/sb-8/verify-08-c2a-table-1366x768.jpg
    131.9 KB  docs/reports/set-base/sb-8/collection-1366x768.jpg
    104.5 KB  docs/reports/set-base/sb-8/verify-05-periodic-report-1366x768.jpg
     91.7 KB  docs/reports/set-base/sb-8/hub-starters-1366x768.jpg
     71.4 KB  docs/reports/set-base/sb-8/verify-03-bound-discard-844x390.jpg
     42.3 KB  docs/reports/set-base/sb-8/collection-844x390.jpg
     35.3 KB  docs/reports/set-base/sb-8/hub-starters-844x390.jpg
     33.8 KB  docs/reports/set-base/sb-8/verify-02-inspect-art-844x390.jpg
     10.8 KB  docs/reports/set-base/sb-8/verify-1366x768.json
      9.2 KB  docs/reports/set-base/sb-8/verify-844x390.json
      3.8 KB  docs/reports/set-base/sb-8/cli-summary.json
      2.3 KB  docs/reports/set-base/sb-8/verify-bozza.diff
  totale: 12.94 MB in 207 file
  AVVISO: oltre 3 MB (12.94 MB): il contratto indica al più 3 MB per fase

== run-summary.json aggiunti ==
  docs/reports/client-c4/c4-1c/fase-b/ffa-prima/run-summary.json: 5/5 verdi, rossi: nessuno  [non equivalente al consolidamento]
  docs/reports/client-c4/c4-1c/fase-b/parallelo-4/run-summary.json: 25/25 verdi, rossi: nessuno  [non equivalente al consolidamento]
  docs/reports/client-c4/c4-1c/fase-b/serie-dopo/run-summary.json: 11/11 verdi, rossi: nessuno  [non equivalente al consolidamento]

== Commit ==
  6482e27 simone 2026-11-10
  6b4ba52 simone 2026-11-10
  ee62a52 simone 2026-11-10
  009e32b simone 2026-11-10
  82c4ef4 simone 2026-11-10
```

Cose che l'uscita mostra bene: nel secondo intervallo le evidenze di C4-8a sono 7,75 MB (oltre l'indicazione di 3 MB) e non ci sono
test o strumenti toccati; nel primo ci sono 10,24 MB di evidenze e due `run-summary.json` non equivalenti al consolidamento con 4
rossi dichiarati; nel terzo l'intervallo contiene anche i commit del Set Base (test e sorgenti `server/`), che lo `--scope` mette
subito in evidenza. Limite: «attesi numerici» è un'euristica sulle righe (confronti con numeri, argomenti numerici), più rumorosa
sui test Java che su quelli del client.

## Rebase su origin/main

`origin/main` era avanti di `1f53b22` («SB: hand over to the joint direction», che tocca `docs/set-base-plan.md` e
`docs/orchestrazione-lavoro.md`). Rebase del solo commit del blocco su `1f53b22`, fatto in un worktree temporaneo senza collegamenti
a `.tools` o `node_modules` (il checkout aveva modifiche non committate di un'altra sessione che un rebase nel checkout avrebbe
dovuto mettere da parte); poi `main` portato avanti con `merge --ff-only`. **Nessun conflitto**: le modifiche di `1f53b22` a
`orchestrazione-lavoro.md` (consegne e passaggio alla regia unica del Set Base) stanno in altre sezioni del file, quindi git le ha
unite da solo; ho controllato che il diff del file rispetto a `1f53b22` contenga solo le mie righe («Come si rivede una relazione»)
e che le sue 7 righe nuove siano intere. Dopo il rebase `check-links.py` dà gli stessi 4 rotti e le verifiche economiche sono
state rilanciate (vedi sotto).

## Verifiche

- `python scripts/check-links.py`: 4 rotti, tutti già presenti (sopra).
- `python scripts/check-rules.py`: verde (regolamento 1.13, Set Base 0.1).
- `./client-web/run.ps1 -Task Test`: 313/313 verdi prima del rebase; **dopo il rebase 324/324** (il numero include i test non tracciati dell'altra sessione). Il primo lancio è uscito con 1 in `tests/contrast.test.ts:64` mentre
  un'altra sessione modificava `client-web/src` nello stesso checkout; `contrast.test.ts` è un file non tracciato dell'altra sessione, non mio; non l'ho analizzato: il lancio successivo
  senza modifiche mie (nessun file di `src` o `tests` è mio) è verde. Dichiarato, non un rilancio per «far tornare il verde».
- `./scripts/build.ps1 -Task Test -Offline`: BUILD SUCCESS, 658 test, 0 falliti, 7 saltati. Rilanciato dopo il rebase: stesso esito.
- `Build` e `Size` **non eseguiti**: nel checkout c'erano node in esecuzione e modifiche non committate di un'altra sessione a
  `client-web/src`; `Build` avrebbe riscritto `dist`. Nessun file di prodotto è cambiato in questo blocco.
- `git diff --check` sui percorsi del blocco: pulito.
- Avvio Spring completo e Playwright: non richiesti, non eseguiti.

## Checkout condiviso

Durante il lavoro il working tree conteneva modifiche non committate di un'altra sessione (`client-web/src/*`, nuovo
`client-web/src/a11y.ts`, `client-web/tests/resolution.test.ts`), assenti all'inizio. Non le ho toccate né committate. Il mio diff su
`client-web/README.md` è di sole 7 ancore. Il commit contiene solo i percorsi di questo blocco.

## Non verificato e al proprietario

- Le ancore generate da `check-links.py` sono quelle di GitHub per i casi in uso (lettere accentate, `—`, backtick, doppioni); non
  sono confrontate con il rendering reale di GitHub.
- Nessuna prova su un blocco nuovo: il prossimo che scrive il proprio file in `client-c4/<blocco>.md` dirà se il metodo regge.
- Da decidere: correggere i 4 rotti dei rapporti Set Base (filone dell'altra macchina) quando quel filone è libero.

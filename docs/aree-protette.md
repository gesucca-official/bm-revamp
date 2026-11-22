# Aree protette e verifiche

**Fonte unica per scegliere le verifiche di una modifica.** I comandi sono in [CONTRIBUTING.md](../CONTRIBUTING.md); il modo di
usare questa pagina è nel [metodo](orchestrazione-lavoro.md#le-quattro-righe-di-ogni-prompt). Scritta il 15 novembre 2026 raccogliendo
regole già in vigore in metodo, AGENTS, CONTRIBUTING e piani; verificata sul commit `336e0ff`.

## Come si legge

1. Si cercano **tutte** le aree toccate: quelle dei file scritti e quelle che dipendono dalla modifica (chi legge ciò che cambia).
   Le aree si sommano: `client-web/tools` è [client](#client-web) e [strumento condiviso](#strumenti-condivisi).
2. Per ogni area si guarda la colonna «Se cambia»: ogni riga che corrisponde fa scattare la sua verifica. Si prosegue solo con
   l'esito della terza colonna; altrimenti è lo STOP 2 del metodo.
3. Una **deroga** esenta solo dagli obblighi che nomina e solo alle sue condizioni. Se una condizione non è provata, vale la riga
   intera.
4. **Area non classificata** (per esempio `prototipi/`, `tools/`, `client-c0/`): la regia scrive nel prompt impatto e verifica prima
   della modifica.
5. Una protezione cambia solo con una riga di decisione del proprietario. Chi crea o allarga un'area aggiunge qui la riga nel
   commit che la chiude; al pull le righe aggiunte da due macchine si tengono entrambe, due prescrizioni diverse sulla stessa
   protezione si risolvono con il proprietario.

## Sempre

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| qualsiasi file | `git diff --check` | nessuna segnalazione |
| un `.md` | `python scripts/check-links.py` | nessun link rotto **nuovo** rispetto al commit di base |
| qualsiasi file, salvo i blocchi di soli documenti fuori da `docs/game-rules.md`, `docs/sets/` e `docs/rules-catalog.json` | `python scripts/check-rules.py` | verde |
| qualsiasi file sotto `server/` o `client-debug/`, il regolamento, i documenti di set, l'allegato | `./scripts/build.ps1 -Task Test -Offline` | 0 test falliti o in errore; un rosso si tratta come dice il [contratto](orchestrazione-lavoro.md#contratto-dellesecutore) |

Un atteso o una soglia non cambiano per tornare al verde (AGENTS): cambiano solo con la decisione che lo autorizza, citata nel rapporto.

## Regolamento e set

**Percorsi:** `docs/game-rules.md`, `docs/sets/*.md`, `docs/rules-catalog.json` (allegato), `server/src/main/resources/cards.sqlite`
(catalogo), `client-debug/src/assets/docs/` (copie). **Protetto:** la norma del gioco.

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| uno qualsiasi di questi file | `python scripts/check-rules.py` | verde: regolamento, set, allegato, catalogo e copie coincidono |
| uno qualsiasi di questi file | le verifiche della [partita viva](#partita-viva), riga «servizi» (le partite sono marcate con le impronte di questi file) | come in quella riga |

**Obblighi:** passo sempre «con proposta»; versione e motivazione nel documento **prima** di test, codice, catalogo e copie, nella
stessa modifica (AGENTS); dopo il pull le altre macchine rifanno il jar.

## Partita viva

**Percorsi:** `server/src/main` e `server/pom.xml`, salvo la [deroga del playground](#playground-e-misure). **Protetto:** la partita del
regolamento vigente e l'avvio dell'applicazione. **Isolamento:** le regole del playground entrano nel motore e nei bot dietro
l'interruttore `Ruleset.playground()`, non in cartelle separate: qui il diff dei percorsi **non** prova nulla.

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| `com/gsc/bm/model/**` fuori da `model/cards/base` (motore, personaggi, carte vive, `PrintedEffects`, bot), senza l'intenzione di cambiare la partita viva | **identità viva**: il banco vivo di 480.000 partite confrontato con la base; procedura e impronte nell'ultimo rapporto che l'ha eseguita (oggi [SB-16i](reports/set-base/sb-16i-report.md#cancelli-b-prima-di-cambiare-la-bozza), `sb-16i/live-identity.json`) | JSON e Markdown identici byte per byte alla base |
| gli stessi file, **per** cambiare la partita viva | prima l'area [regolamento e set](#regolamento-e-set); poi l'identità viva come nuova base | la differenza è quella decisa e il rapporto la dichiara con la decisione |
| qualsiasi file di `server/src/main` fuori dalla deroga, `server/pom.xml`, i test di contesto o della CLI (servizi, `api`, `conf`, `repo`, `com/gsc/bm/bozza`, risorse, e anche motore e modello: gli scenari applicativi giocano partite vere) | `./scripts/build.ps1 -Task TestServerContext -Offline`, poi `python scripts/verify-match-manifests.py` | 0 test falliti o in errore; tutti i controlli dei manifest PASS |
| ciò che il server espone al client (`api`, estrazione delle viste, `docs/api.md`) | anche l'area [client web](#client-web), con il jar rifatto | come in quell'area |

Il contesto Spring completo è una verifica separata: i test unitari verdi non provano l'avvio. `com/gsc/bm/bozza` contiene le
fabbriche del profilo `bozza`: il loro isolamento dipende dal profilo e lo prova `BozzaProfileOffContextTest`, che gira solo con
`TestServerContext`.

## Playground e misure

**Percorsi:** `server/src/main/java/com/gsc/bm/sim`, `server/src/main/java/com/gsc/bm/model/cards/base`, `server/src/test/java/com/gsc/bm/sim`
(banco, bracci, test della bozza), `server/src/test/resources/set-base/` (dati della bozza). **Protetto:** (a) nulla della bozza
raggiunge la partita viva; (b) una misura di bilanciamento non è confusa da cambiamenti del codice: stesso codice, stessi numeri.

**Deroga alla partita viva.** I due package di `server/src/main` sono esentati dall'**identità viva** e da **`TestServerContext` con
i manifest**, non dalle verifiche «Sempre», a tre condizioni, tutte da mostrare nel rapporto:

1. il diff non contiene file di `server/src/main` fuori dai due package, né `cards.sqlite`, regolamento, documenti di set,
   allegato o client;
2. nessun codice vivo dipende dai due package: questo comando non stampa nulla;

   ```text
   git grep -nE "com\.gsc\.bm\.(sim|model\.cards\.base)\b" -- server/src/main/java ":!server/src/main/java/com/gsc/bm/sim" ":!server/src/main/java/com/gsc/bm/model/cards/base" ":!server/src/main/java/com/gsc/bm/bozza"
   ```

3. il catalogo vivo non nomina classi di `model/cards/base` (vero al 15 novembre 2026; resta vero finché `cards.sqlite` non
   cambia, cioè per la condizione 1).

Se una condizione manca, valgono le righe della partita viva. I dati di `server/src/test/resources` non entrano nel jar.

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| solo dati della bozza (`server/src/test/resources/set-base/`), rispetto al commit dell'ultima misura di riferimento | nessuna corsa d'identità: `git diff --stat <commit della misura>..` | il diff contiene solo quei dati e documenti |
| `server/src/test/resources/set-base/bozza.json` ([D143](set-base-decisioni.md#decisioni-del-proprietario)) | `python -X utf8 docs/design/set-base/controlla-numeri.py` e `python -X utf8 docs/design/set-base/testi/controlla-testi.py` (dopo `genera-testi.py --scrivi` se cambiano gli effetti) | entrambi escono con 0; un'eccezione nuova a R1–R4 solo con la decisione che la autorizza |
| `server/src/test/resources/set-base/bozza.json` dalla bozza congelata 1.7 ([D166](set-base-decisioni.md#decisioni-del-proprietario), SB-24) | `python -X utf8 docs/design/set-base/controlla-nomi.py` | esce con 0: nessun nome provvisorio (inglese di catalogo, segnaposto, nome ripetuto, flavour mancante) |
| `tools/print-cards/` (stampa viva e della bozza; SB-25 B2) | `python -X utf8 tools/print-cards/test_generator.py` e `python tools/print-cards/verify.py`; poi `python tools/print-cards/generate.py --bozza --output <file temporaneo>` e alcune pagine guardate (senza Poppler con PyMuPDF, [README](../tools/print-cards/README.md#verifiche-riproducibili)) | test verdi e `verify.py` OK; nessun fronte rifiutato; il PDF vivo committato in `output/pdf/` non cambia |
| codice che la misura esegue: i due package, il banco e i bracci nei sorgenti di test, oppure motore e bot | **passo 0 d'identità**, prima di cambiare la bozza: codice nuovo con la bozza di riferimento precedente, contro il passo 0 di riferimento ([procedura](reports/set-base/sb-16i-report.md#evidenze-e-riproduzione): `-Phase identity`) | `matrix.json`, `observations.json`, `draft.json`, `deck-observations.json` identici byte per byte |
| motore o bot | anche le righe della [partita viva](#partita-viva) | come in quelle righe |
| logica nuova dei bot o dei loro modelli (`TurnForecast`, `ViewTable`) | i test di fedeltà (`TurnForecastFidelityTest`, `ViewTableFidelityTest`), sulle bozze e sui bracci che il prompt indica | tutti i turni confrontati coincidono; le esclusioni sono quelle previste dalla verifica e dichiarate |

**Obblighi di una misura** ([piano del Set Base](set-base-plan.md#bilanciamento-metodo-e-criteri)): passo 0 di fattibilità, tetto dei
giri e budget di calcolo fissati prima; ogni misura dichiara seme, numero di partite, bot e versione della bozza; i numeri si
decidono con la delega di D38, i ridisegni vanno al proprietario; una sola misura o un solo Maven per macchina.

## Client web

**Percorsi:** `client-web/` (per `client-web/tools` e `run.ps1` vale anche [strumenti condivisi](#strumenti-condivisi)). **Protetto:**
le regole di non regressione ([1–9](client-c3-plan.md#regole-di-non-regressione), [10–18](client-c4-plan.md#regole-di-non-regressione)),
`BASE_750`, i limiti di `Size`, durate e calendario della sequenza. Comandi, insidie e punti di revisione:
[verifiche del client](verifiche-client.md).

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| qualsiasi file di `client-web/` | `./client-web/run.ps1 -Task Test`, `-Task Build`, `-Task Size` (con `BM_OUT`) | verdi; `Size` entro i [limiti](verifiche-client.md#punti-di-revisione); `BASE_750` invariato |
| ciò che si vede o si gioca (`src`, `public`) | le Playwright che il prompt elenca, scelte dalla regia fra i compiti `Verify…` secondo ciò che il blocco tocca ([cosa copre ciascuna](../client-web/README.md#verifiche)), a 1366×768 e 844×390, più 1920×1080 per `Verify` e `VerifyLayout` | verdi, oppure rossi che corrispondono a una voce del [registro dei rossi noti](reports/rossi-noti.md) |
| disposizione, dimensioni o geometria | in più `Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout` a 750×292, confrontate con il commit di base | conteggi non peggiori della base (regola 18) |
| fine di una tappa del client, o quando il piano lo chiede | la matrice completa: `./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa'` | come stabilisce il piano della tappa |
| server, regolamento o set, prima di una verifica del client | `./scripts/build.ps1 -Task Server -Offline` | jar rifatto |

## Carriere

**Percorsi:** `tools/carriere/`, `prototipi/carriere/`, `docs/carriere/` e le storie del serbatoio (`docs/design/carriere/*-dialoghi.md`). **Protetto:**
il [formato delle carriere](carriere/formato.md) e i numeri del controllo sulle storie (nodi, stati, finali, avvisi). Il prototipo non è parte del prodotto.

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| una storia, il cast (`prototipi/carriere/dati/cast.json`), il formato o lo strumento | il controllo delle carriere: `./tools/carriere/run.ps1 -Task Check` (confronta anche i pacchetti committati; dopo una storia o il cast usato alzare la versione in `carriere.json` e `-Task Package`); per lo strumento anche `-Task Test`, e per il prototipo `./prototipi/carriere/run.ps1 -Task Test` e `-Task Check` | 0 errori; numeri uguali a prima, o ogni differenza spiegata nel rapporto |

## Client di debug

**Percorsi:** `client-debug/`. **Protetto:** la parità delle funzioni e le copie delle regole.

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| qualsiasi file | le verifiche «Sempre» (`Test` comprende i test del client di debug; `check-rules.py` le copie) | verdi |

## Strumenti condivisi

**Percorsi:** `scripts/`, `client-web/tools/`, `client-web/run.ps1`, `.tools` (non tracciato). **Protetto:** uno strumento controlla
la stessa cosa di prima.

| Se cambia | Esegui | Prosegui se |
|---|---|---|
| un verificatore o uno script di build o di controllo | lo strumento sul commit di base e sul commit nuovo, senza altre modifiche | stessi casi visti e stessi esiti; ogni differenza è spiegata nel rapporto |
| `.tools` danneggiato | `python scripts/bootstrap.py`, da una sola sessione che avvisa le altre prima e dopo | strumenti presenti con le impronte di `scripts/toolchain.json` |

**Obblighi:** passo «con proposta»; il rapporto ha una sezione per le altre macchine; lo strumento si pusha prima del blocco che lo
usa altrove.

## Fuori dal repository

Istanze online, account, credenziali, DNS, spese, pubblicazioni: nessuna prova è possibile dal repository. Le azioni le fa il
proprietario; l'agente prepara script e istruzioni. Segreti e dati applicativi non entrano in git ([CONTRIBUTING.md](../CONTRIBUTING.md)).

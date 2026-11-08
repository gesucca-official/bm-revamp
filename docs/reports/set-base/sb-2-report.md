# SB-2 — Separazione fra regolamento e set: rapporto

**Fatto l'8 novembre 2026, in attesa del giudizio del proprietario.** Il regolamento passa alla **1.13** e contiene solo le regole
generali; le carte passano al primo documento di set, [`docs/sets/base.md`](../../sets/base.md), **Set Base 0.1**, con versione e
revisioni proprie. Il regolamento governa il sistema, la scheda governa la carta e deroga solo se lo dice esplicitamente (R00).

**La partita non cambia.** Nessun effetto, costo, priorità, bersaglio, starter o bilanciamento: `CatalogEffectsTest`,
`RulesConformanceTest`, `CardRulesContractTest` e la prova d'identità di SB-6a (`PlaygroundTest`) sono verdi senza toccarne gli attesi.

**Origine.** [D42](../../set-base-plan.md#decisioni-del-proprietario): SB-2 anticipato in parallelo a C4, con una fase A che si ferma. Il
proprietario ha approvato la proposta della fase A con «vanno bene tutte le raccomandazioni» (Q1–Q9, sotto).

**Per chi lavora a C4 sull'altra macchina:**

- dopo il pull **rifare il jar** (`./scripts/build.ps1 -Task Server -Offline`): cambiano regolamento, catalogo SQLite, `pom.xml`
  (impacchetta `docs/sets/*.md`) e `MatchVersions`;
- **strumenti di verifica cambiati**, da avere prima di C4-8a: `client-web/tools/verify-public.mjs` (`VerifyPublic`, usato da C4-8a),
  `scripts/check-rules.py`, `scripts/verify-match-manifests.py` e le CLI `cli-match-export-test.cjs`, `cli-open-complete-test.cjs`,
  `cli-quick-complete-test.cjs`. `verify.mjs` non cambia;
- **un file di test di C4 toccato, una riga:** `client-web/tests/readability.test.ts`, nel test «status summaries agree with the
  multipliers of R07», che ora legge le schede da `docs/sets/base.md` (Q8). `BASE_750` e il resto del file non sono toccati;
- `public.tsx` cambia (secondo articolo con il set, solo classi esistenti); `style.css`, `readability.ts`, `scene.ts`, `table.tsx`,
  `sound.ts`, `resolution.ts` e `index.html` non sono stati toccati. I commenti che citano R07 in quei file restano.

## Decisioni del proprietario sulla fase A

Tutte approvate con «vanno bene tutte le raccomandazioni».

| | Domanda | Decisione |
|---|---|---|
| Q1 | Id, nome e versione del set | `base`, «Set Base», **0.1**, `docs/sets/base.md`; SB-28 lo porterà a 1.0 |
| Q2 | Cosa resta di R07 e R07a | Nel regolamento convenzioni e definizioni generali, con gli stessi titoli; al set tabelle e note per carta |
| Q3 | Generalizzazioni come vincoli per ogni set | Sì, salvo deroga esplicita della scheda (R03, R04, R05) |
| Q4 | Suffisso delle descrizioni | «Riferimento: Set Base 0.1.», senza la versione del regolamento |
| Q5 | Durata 3 di MadeOfStone | Nella scheda |
| Q6 | Allegato | Resta in `docs/rules-catalog.json`, come allegato del set; lo spostamento si decide in SB-26 |
| Q7 | Rarità | Colonna ora, vuota; COMMON, UNCOMMON, RARE dichiarati in R07; valori in SB-6b e SB-28 |
| Q8 | `readability.test.ts` | Una riga cambiata |
| Q9 | PDF di print-cards | Non rigenerati |

## Struttura

| Documento | Contenuto | Versione |
|---|---|---|
| [Regolamento](../../game-rules.md) | R00–R09 con gli stessi titoli. R00: fonte normativa e precedenza. R07 «Carte e documenti di set»: cosa contiene un documento di set, convenzioni delle schede, rarità. R07a: definizioni di ruolo, guadagni, danno nominale e importo | 1.13 |
| [Set Base](../../sets/base.md) | S1 contenuto e starter, S2 personaggi, S3 azioni, S4 oggetti e token, S5 ruoli, guadagni e danno nominale (le due tabelle), Revisioni | 0.1 |
| Allegato `docs/rules-catalog.json` | `"set": "base"`, `"version": "0.1"` (prima era la versione del regolamento); carte, starter, personaggi, token come prima | 0.1 |

Copie del debug: `client-debug/src/assets/docs/rules.md` e, nuova, `client-debug/src/assets/docs/sets/base.md`; la pagina Regole del
debug mostra i due documenti uno dopo l'altro. `AGENTS.md`, `README.md` e `CONTRIBUTING.md` dicono che la fonte normativa è regolamento
più documenti di set, con la precedenza di R00.

## R04 e R05: frasi prima e dopo

Ogni frase confrontata col codice delle carte di oggi.

| Dove | Prima (1.12) | Dopo (1.13) | Perché il senso non cambia |
|---|---|---|---|
| R04 | Grab, Steal e BreakYourToy ricontrollano l'oggetto alla risoluzione: se scomparso non lo consumano, rubano o distruggono; restano costi/scarto/pesca. EverythingIsDrug mantiene +20 TOXICITY anche se l'oggetto è scomparso nel frattempo. | Una carta che bersaglia un oggetto lo ricontrolla alla risoluzione: se l'oggetto è scomparso non lo consuma, non lo ruba e non lo distrugge, ma applica gli altri suoi effetti; restano costi, scarto e pesca. | Le carte che bersagliano oggetti sono sei: Grab, BruiserGrab, ToxicGrab, EverythingIsDrug, Steal, BreakYourToy; tutte gestiscono l'oggetto assente. Solo due hanno altri effetti e li applicano comunque: ToxicGrab (già nella sua scheda) ed EverythingIsDrug (`applyEffectOnSelf` non guarda l'oggetto). Nessuna scheda cambia |
| R05 | … anche vuoto: SeagullFly usa solo GOOD sull'autore ma tutti gli stati sul bersaglio. | … anche vuoto: una carta che limita gli stati dell'autore, per esempio ai soli GOOD, non limita quelli del bersaglio. | `Status.invertViewPoint` restituisce sempre tutti gli stati; la scheda di SeagullFly dice già «solo GOOD dell'autore, tutti gli stati del bersaglio» |
| R05 | Gli equip sono stati rimovibili da BadEducation. | Gli equip sono stati che un effetto può rimuovere, se la sua scheda lo prevede. | La scheda di BadEducation dice «Rimuove equip del bersaglio»; il codice toglie ogni stato `isEquip` |
| R05 | Isolamento degli stati (1.1): ogni applicazione di MadeOfStone e BrokenBeerBottle crea uno stato distinto. Durata e consumo non sono condivisi fra applicazioni, personaggi o partite. MadeOfStone parte sempre da durata 3. BrokenBeerBottle mantiene singleUse e puo applicarsi ancora nello stesso turno secondo la regola precedente. | Isolamento degli stati (1.1): ogni applicazione di uno stato crea uno stato distinto. Durata e consumo non sono condivisi fra applicazioni, personaggi o partite: ogni stato parte dalla durata della sua scheda, e uno stato singleUse segue la regola precedente. | Tutte e sei le carte che creano stati ne costruiscono uno nuovo a ogni applicazione (CantFeelAnything, LittleRage, Glare, MadeOfStone, BrokenBeerBottle; RottenBeer usa `BrokenBeerBottle.newStatus()`). La durata 3 di MadeOfStone (`lastsForTurns(3)`) passa alla sua scheda: «CUT ricevuto ×0,5, durata 3, stato indipendente R05; +10 V». La regola singleUse è già in R05 e nella scheda del token. Cambia solo che la regola vale ora per ogni carta, anche futura (Q3) |

Nessuna frase è rimasta non generalizzabile. Le altre citazioni di carte nel regolamento sono passate al set o generalizzate:

| Dove | Prima | Dopo |
|---|---|---|
| R01 | Quick assegna casualmente Bruiser o Junkie | Un personaggio con il suo starter, fra quelli indicati dal documento del set (S1 li nomina) |
| R01 | Esempio 1.11 con Spazienzio, BadTrip, LethalHeroinDose, PervertedMetabolism | Esempio senza nomi; quello con le carte è in S2 |
| R01a | Come Grab o Steal | Un'azione che bersaglia oggetti, come una presa o un furto |
| R01a | BrokenBeerBottle è il token del set attuale; esempio del suo consumo | I token di un set sono nel suo documento (S1); «consumare un token che equipaggia…» |
| R02 | Basic e bound di Bruiser e Junkie; Struggle si scarta e può essere ripescata; Struggle è generica | Rimando al documento del set (S1); «La last resort si scarta …» |
| R03 | Nessuna bound e nessuna last resort del set bersaglia oggetti | Vincolo per ogni set: nessuna bound o last resort bersaglia oggetti, ogni last resort è gratuita |
| R07a | Esempi (MarvelousCocktail, LethalHeroinDose, difese, BrokenBeerBottle, WhatchaDoin, ExtremelyViolentBlow, Struggle, MethDrivenRage) | Regole senza nomi; gli esempi sono in S5 |

`check-rules.py` impone ora che nessun nome di classe del catalogo (né SoberUp) compaia nel regolamento prima di «Revisioni».

## Catalogo

| Campo | Dove | Valori oggi | Serve |
|---|---|---|---|
| Set | `C_SET` in `CRD001_GUI` e `CRD003_CHARACTERS`; `set` in testa all'allegato | `base` per le 37 carte e i 2 personaggi; il token è del set del suo allegato | Ora: lega catalogo e documento del set |
| Rarità | `C_RARITY` in `CRD001_GUI`; `rarity` della carta nell'allegato (assente = nessuna) | Vuota per tutte | SB-6b e SB-28; vocabolario in R07 |
| Descrizioni | `T_GUI_DESCRIPTION`, allegato, `sb-6a/attuale.json` | Scheda + «Riferimento: Set Base 0.1.» | Le prossime versioni del regolamento non riscrivono più le 37 descrizioni |

Le carte inviate ai client non hanno campi nuovi: il protocollo non cambia (JPA ignora le colonne non mappate, `ddl-auto: none`).
L'unica descrizione che cambia nel testo, oltre al suffisso, è MadeOfStone (durata 3).

## Versioni e archivio

`MatchVersions` legge i documenti di set impacchettati (`classpath:analysis/sets/*.md`, aggiunti da `pom.xml`) e `INITIAL.versions`
dell'archivio aggiunge `sets`: `{"base": {"version": "0.1", "sha256": "…"}}`, SHA-256 in UTF-8 con LF come per le regole. Senza documenti
di set, o senza versione, il server non si avvia. `schemaVersion` resta 1. `verify-match-manifests.py` calcola `sets` da `docs/sets/` e lo
confronta con ogni export, come le altre versioni.

| Prova | Cosa controlla |
|---|---|
| `MatchArchiveTest` | `rulesVersion` 1.13, `sets` con il solo `base`, versione 0.1 e hash |
| `cli-match-export-test.cjs` (`MatchArchiveCliTest`) | Stesso, dall'export reale via CLI |
| `cli-open-complete-test.cjs`, `cli-quick-complete-test.cjs` | `versions.sets` uguale a quello del server (`BM_SETS`, passato da `OpenCompleteCliTest` e `QuickCompleteCliTest`), `base` 0.1 |

`cli-archive-lifecycle-test.cjs` non legge versioni e non cambia.

## check-rules.py

Legge le schede da `docs/sets/base.md` e controlla, oltre a tutto quello di prima: copie client di regolamento e set; un solo documento
di set fino a SB-6b; id e versione del set uguali a `set` e `version` dell'allegato; `C_SET` di carte e personaggi uguale all'id del set;
`C_RARITY` fra i valori di R07 e uguale all'allegato; descrizioni uguali alla scheda più il riferimento al set; le definizioni dei ruoli di
R07a; nessuna carta citata nel regolamento. L'opzione nuova `--root DIR` controlla un'altra copia del repository.

**Disallineamenti rifiutati.** [`sb-2/check-rules-mismatch.py`](sb-2/check-rules-mismatch.py) copia in una cartella temporanea i file che
`check-rules.py` legge, introduce un disallineamento per volta e lo lancia con `--root`; i file tracciati non vengono toccati.

| Caso | Esito |
|---|---|
| Copia pulita | Verde |
| Allegato 0.2 contro documento 0.1 | `Annex version 0.2 differs from the set document 0.1` |
| Documento 0.2 contro allegato 0.1 | `Annex version 0.1 differs from the set document 0.2` |
| Glare nel set «altro» in SQLite | `CRD001_GUI: cards outside the set base of the set document: bruiser.Glare` |
| Riga di Glare tolta da S3 | `Cards of the annex without a sheet in the set document: bruiser.Glare` |
| Copia client del set diversa | `Client set document differs` |
| Rarità in SQLite assente nell'allegato | `Rarities differ from the set annex` |
| Regolamento che cita SuperImpact | `The regulation cites the card SuperImpact: it belongs to the set document` |

## Client

**client-web.** `public.tsx` importa anche `docs/sets/base.md` e lo mostra dopo il regolamento in un secondo articolo (`set-text`) con le
stesse classi; l'intestazione dice «Regolamento 1.13 · Set Base 0.1»; l'indice ha R00…Revisioni più «Set Base», che porta al documento
del set. `rules.ts` non cambia. `public.test.ts` controlla titoli, versione, revisioni, tabelle e testo anche del set, e che nel
regolamento non resti nessuna tabella di carte.

**`verify-public.mjs`.** Il regolamento si confronta con `game-rules.md` come prima; il set, con gli stessi controlli, con
`docs/sets/base.md` (titoli, revisioni, ogni cella, tutte le parole, nessun link, id o HTML). Le tabelle di R07 e R07a si cercano nel set;
l'indice ha in più «Set Base»; una cattura nuova, `03b-rules-set`, dopo il clic sull'indice.

**client-debug.** Copia del set e un secondo riquadro nella pagina Regole.

## print-cards

`generate.py` legge le schede dal documento del set (opzione nuova `--set`), confronta set e versione con l'allegato e stampa sulle carte
«R 1.13 · Set Base 0.1»; il manifesto registra `rules_version` e `set`. La durata di MadeOfStone non si copia più da R05: è nella scheda.
`test_generator.py` costruisce la carta nuova nel documento del set. I PDF in `output/pdf` (ancora del regolamento 1.5) non sono stati
rigenerati (Q9).

## Verifiche

Una alla volta, ciascuna partita solo quando sul repository non giravano Maven, Java o verifiche (uno script aspettava due controlli
liberi di fila). SB-13 ha lanciato i suoi Maven sullo stesso checkout durante il lavoro: ho aspettato ogni volta.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.** Maven 591 test, 0 falliti, 7 saltati (le misure a richiesta); client-debug 37 su
  37; `check-rules.py` dentro la build. Un primo giro (588 test) era caduto solo su 4 casi di `SetBaseDraftTest`, che SB-13 stava
  adeguando alla sua bozza col Tossico (`set-base/bozza.json` modificato e test non ancora aggiornato): nessun file di SB-2 coinvolto. Al
  secondo giro, con il test di SB-13 aggiornato, `SetBaseDraftTest` è verde (12 test). `PlaygroundTest` (138), `CatalogEffectsTest` (87),
  `CardRulesContractTest` (87), `RulesConformanceTest` (22) e `MatchArchiveTest` (9) verdi in entrambi i giri.
- `python scripts/check-rules.py`: verde, «Regolamento 1.13 e Set Base 0.1 allineati alle copie client; regolamento senza carte citate; …».
  Più i sette disallineamenti costruiti, tutti rifiutati (tabella sopra).
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **verde** al terzo giro, sopra il commit di SB-13 (33b1826): 701 test, 0
  falliti, 7 saltati, 7:08 min. Il primo giro (698) era caduto solo sui 4 casi di `SetBaseDraftTest` detti sopra. Il secondo (701) è caduto
  solo su `RestartCliTest`, scenario `crash`: la CLI di preparazione è uscita prima di scrivere la fixture, mentre `clean` e `interrupted`,
  identici in quel passo, erano verdi e la CLI di riavvio non legge versioni né descrizioni. Rilanciato da solo è verde (3 su 3), e verde
  di nuovo nel terzo giro completo: instabilità a tempo, da osservare, non legata a SB-2.
- `python scripts/verify-match-manifests.py`: **PASS** sulle evidenze rigenerate dal contesto; gli export reali portano
  `"sets": {"base": {"version": "0.1", …}}`.
- Jar rifatto da `VerifyAll` (`build.ps1 -Task Server -Offline`), poi `./client-web/run.ps1 -Task VerifyAll -Offline -Only
  'test,build,size,verify,modes,decks,profile,public,lifecycle'` alle misure ufficiali: **14 su 15 verdi**, 29 min 16 s. Unità client-web
  271 su 271 (erano 269: due test nuovi sul documento del set). Size con `BM_OUT` sulla cartella temporanea della verifica: JS 344 784
  byte gzip, totale 1 754 655, texture 27 729 048 (82,6% del tetto C4), tutti nei limiti. `VerifyPublic` verde alle due misure: documento
  del set con 9 titoli, 5 tabelle e 1 557 parole uguali alla fonte, revisione 0.1, nessun link, id o HTML, l'indice porta al set senza
  cambiare l'hash. L'unico rosso, `lifecycle` a 844×390, è l'eccezione dello strumento «B: no playable card» al secondo turno, quando il
  tocco non trova una carta giocabile, la stessa già registrata nel [rapporto C4](../client-c4-report.md) in altri scenari: rilanciato da solo
  (`-ReuseJar -Measures 844x390 -Only 'test,build,size,lifecycle'`) è **verde** (5 min 24 s). Il rilancio avvisa «jar vecchio»: i file più
  recenti del jar sono solo sorgenti di test di SB-13, che nel jar non entrano.
- Catture in [`sb-2/`](sb-2/): pagina delle regole a 1366×768 e documento del set, raggiunto dall'indice, alle due misure.
- CLI toccate, una per una, ciascuna nel suo test del contesto: `cli-match-export-test.cjs` (`MatchArchiveCliTest`, 2),
  `cli-open-complete-test.cjs` (`OpenCompleteCliTest`, 1), `cli-quick-complete-test.cjs` (`QuickCompleteCliTest`, 2); verdi anche
  `ArchiveLifecycleCliTest` (12), `WebSocketIdentityTest` (9), `CatalogRuntimeTest` (40) e `DeckRulesContextTest` (3).

## Gli attesi cambiati

Tutti legati alla versione o al posto delle schede, nessuno per accettare una regressione:

- `MatchArchiveTest` e `cli-match-export-test.cjs`: `rulesVersion` 1.12 → 1.13, più i controlli nuovi su `sets`;
- `sb-6a/attuale.json`: le 37 descrizioni col nuovo riferimento e la durata di MadeOfStone, perché `PlaygroundTest` le confronta col
  catalogo (come fecero 1.11 e 1.12);
- `public.test.ts`: tabelle di personaggi e ruoli cercate nel documento del set;
- `readability.test.ts`: i moltiplicatori di R07 letti dal documento del set;
- `verify-public.mjs`: indice con «Set Base», tabelle R07 e R07a nel set;
- `test_generator.py`: messaggio «Inventario del set diverso» al posto di «Inventario R07 diverso».

## Cosa non è provato

- **print-cards:** reportlab non è installato su questa macchina, quindi `test_generator.py` e la generazione dei PDF non sono stati
  eseguiti. `load_catalog` è stato provato da solo, con i moduli di reportlab simulati: legge le 40 voci, la scheda di MadeOfStone con la
  durata e la versione «1.13 · Set Base 0.1».
- **Prova umana** della pagina pubblica col set: nessuna, solo `VerifyPublic` e le catture.
- **Più set:** `MatchVersions` e `verify-match-manifests.py` accettano più documenti, `check-rules.py` ne ammette uno solo; il caricamento
  da più set è di SB-6b.
- **La rarità** non è letta da nessun codice: è solo una colonna controllata.

## Cosa resta

- **C4 sull'altra macchina:** pull, jar rifatto, poi C4-8a con `VerifyPublic` di questo commit.
- **SB-6b:** più set, valori di rarità, mini-espansione; **SB-26:** generazione di catalogo, descrizioni e allegato dal set (ed eventuale
  spostamento dell'allegato); **SB-28:** le carte del Set Base nel documento, versione 1.0.

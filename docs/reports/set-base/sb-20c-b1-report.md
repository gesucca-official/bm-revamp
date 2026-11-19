# SB-20c — Fase B1: testi stampati generati

**Esito verde.** I 348 campi delle 116 carte coincidono col generatore. Undici mutazioni respinte. «Rif» identico alla base su 403.200 partite. Suite `Test` verde. La B1 è in attesa di revisione.

## Stato per tappe

- Base `3797a92`, checkout pulito. Dopo `git fetch`, `main` è avanti di due commit e contiene `origin/main`.
- Fattibilità 31,8 s e «Rif» iniziale 127,8 s. Cancello contro il finale di SB-20b superato su 4.032 celle, 403.200 partite e zero violazioni. Budget complessivo delle misure fissato a 1.200 s.
- Generati i tre campi per 116 carte e rigenerato il riferimento. Il controllo passa sulla bozza e rifiuta tutte le undici [copie mutate](sb-20c/mutazioni-testi.json). Adeguati undici attesi di sola descrizione in `SetBaseDraftTest`. In `Bozza16Test` l'uguaglianza con la 1.5 delle carte altrimenti invariate ora esclude i soli tre campi stampati, verificati dal nuovo controllo per D142.
- Primo giro sulla bozza con i testi, fattibilità 24,0 s e «Rif» 138,9 s, identico alla base. La rilettura ha poi separato la frase condizionale di MAR-AR3 dagli effetti sul bersaglio e ripristinato «stati» in GEN-05. Il giro di consegna usa la bozza con queste due correzioni.
- Consegna, fattibilità 20,8 s e «Rif» 131,1 s. Identità byte per byte con il «Rif» iniziale sui risultati. Totale 474,4 s su 1.200. [Impronte dei confronti](sb-20c/identita-rif.json).

## Generatore e controllo

- 99 descrizioni dagli `ops` e 17 modelli per binding Java, con i numeri dai `params`. Aggiornate 99 descrizioni e una pillola di guadagno (ROC-AR5, `+6 HEALTH` → `+6 H`, già interpretata come salute da `StyleSupport.parseGains`). I 116 riepiloghi del danno restano identici. Confronto strutturale della bozza con la base dopo aver escluso i tre campi, identico.
- Il generatore riusa il prefisso dello slot e scrive i segnaposto solo nella descrizione. Due esecuzioni in lettura producono gli stessi byte e la seconda scrittura conserva tutti i byte della bozza. Per rigenerare da radice usare `python -X utf8 docs/design/set-base/testi/genera-testi.py --scrivi`. Stampare su stdout senza `--scrivi` mostra i tre campi per slot. [Generatore](../../design/set-base/testi/genera-testi.py) e [bozza di riferimento](../../design/set-base/bozza-di-riferimento.md).
- Il controllo usa la stessa generazione, confronta i valori senza normalizzarli e indica lo slot e il campo. Respinge anche operazioni, forme o token sconosciuti. Eseguire `python -X utf8 docs/design/set-base/testi/controlla-testi.py` a ogni diff di SB-21 con R1–R4. Il percorso facoltativo permette di controllare una copia. [Controllo dei testi](../../design/set-base/testi/controlla-testi.py) e [D142](../../set-base-decisioni.md#decisioni-del-proprietario).

### Riscontro delle carte Java

Lettura delle classi, delle sequenze `PrintedEffects` disponibili e dei parametri effettivi della bozza. Il controllo Python verifica il testo contro i modelli dichiarati e i dati. Il riscontro con la logica Java è stato fatto sui sorgenti.

| Slot | Riscontro |
|---|---|
| SPA-AR5, TOS-AR4 | `YouStop` annulla la mossa successiva del bersaglio, con A da `alertnessToTarget` solo all'annullamento. `AmphetamineReflexes` annulla le mosse successive dirette all'autore. `COUNTER_TARGET` e `COUNTER_ALL`. |
| CES-AR2, CES-AR3 | `Ricatto` riflette il 50% del danno base per tipo, `LoSapevo` conserva il gettone. `COUNTER_TARGET` con `factor` o `keepsToken`. |
| TOS-AR5, OGG-04, OGG-15 | `ToxicBloodDrain` trasferisce T, toglie l'immunità del bersaglio, infligge 12 POISON e concede l'immunità a fine turno. `MarvelousCocktail` concede le due immunità e i guadagni, poi il timer pulisce stati e immunità e infligge POISON. `SantinoDellaPortinaia` revoca l'immunità a L al terzo scatto. Passi e timer in `PrintedEffects`. |
| LR-PIN, PIN-AR2, PIN-AR5 | `UltimoGiro` eredita i passi di `GoingBerserk`: autodanno quando previsto, azzeramento di L, poi HIT sul bersaglio con la L letta dopo i costi. I due rincari sono nei passi HIT. `RuttoADistanzaSociale` svuota L, sottrae A al bersaglio e infligge HIT con `perAlcohol`. |
| GIG-AR5, GEN-03 | `LavoroFattoBene`: HIT sul bersaglio con `perItem` sugli oggetti propri. `ShuffleFeet`: `SWAP_ITEMS` e rispetto delle capacità nella classe. |
| GEN-02, GIG-AR1, GEN-04, GEN-10 | Riscontro nei metodi delle classi `Steal`, `BreakYourToy`, `BeggingMoney` e `BadEducation`: furto, distruzione, copia casuale con la sottrazione di A soppressa, rimozione degli equip e HIT. |
| OGG-03 | `AnotherRottenBeer` dà L e crea `BrokenBeerBottle`. Il ripiego `PrintedEffects.consumedText` legge la pillola `+10 L` e restituisce lo stesso binding del token. |

## Informazione stampata

| Tipo di variazione | Carte |
|---|---|
| Gettone di vulnerabilità nel ramo di ricerca riuscita, con tipi di danno e ×1,5 | SPA-AR3, SPA-AR6, MAR-AR5, MAR-AR6, TOS-AR1, TOS-AR6, PIN-AR4, PIN-AR6, GIG-AR3, GIG-AR6, CES-AR1, ROC-AR5. |
| Arrotondamento per difetto prima implicito | SPA-AR2, TOS-AR3. SPA-AR2 esplicita anche il destinatario del colpo. |
| Dettaglio degli effetti | MAR-AR1 esplicita il bersaglio dei due CUT. MAR-AR2 elenca i tre tipi di danno. CES-AR6 e TOS-AR5 nominano il bersaglio anche nella frase del danno. LR-PIN esplicita l'ordine effettivo, con spesa di L prima del colpo. |
| Equip di uso singolo | GEN-21 e OGG-13 precisano che l'equip resta fino a fine turno dopo l'uso, al posto di «il prossimo HIT». |
| Parentetiche di durata tolte | SPA-AR4 e OGG-10 conservano rispettivamente quattro e tre turni. Perdono l'inciso «questo e i tre/due successivi». |
| Richiami e diciture tolti | SPA-BA («come Grab»), TOS-BA («Tutto è droga»), TOS-BO3 («alito marcio»), PIN-BO3 («il vetro taglia»), LR-TOS («di Celestina»), LR-PIN («di Piera»), ROC-AR5 («Caricamento»). |

**Sola riscrittura della stessa informazione:** MAR-BA, SPA-BO3, SPA-AR1, SPA-AR5, MAR-AR3, MAR-AR4, GEN-02, GEN-07, GEN-13, OGG-01, OGG-14, GEN-15, OGG-07, TOS-AR2, TOS-AR4, GEN-01, PIN-BA, PIN-AR3, OGG-05, GIG-BA, GIG-AR1, GIG-AR2, GIG-AR4, CES-BA, CES-AR2, CES-AR3, CES-AR4, GEN-09, GEN-23, GEN-22, ROC-BA, ROC-AR2, GEN-04, GEN-08, GEN-10, GEN-11, GEN-19, GEN-20, OGG-08, OGG-16. Per altre 31 carte cambiano solo le sigle di risorsa in `description`.

## Evidenze e riproduzione del «Rif»

Strumenti SB-19, `d50`, primo seme 7.000.000, 8 thread, i sette mazzi di riferimento e i dodici stili per lato. Da radice, `run.ps1 -Phase feasibility` usa 4 semi per cella e `-Phase round` ne usa 100. Entrambi ricevono lo stesso `-Label sb20c-base` o `sb20c-consegna`, la copia con `-Draft` e `-OutputRoot` in `%TEMP%\bm-sb20c`. I giri e Maven sono stati eseguiti in sequenza. [Procedura SB-19](sb-19/run.ps1).

Il cancello d'ingresso usa `%TEMP%\bm-sb20b\round-sb20b-new`. Il cancello di consegna usa `round-sb20c-base` e `round-sb20c-consegna`. `analyze.py identity` confronta celle e invarianti. `analyze.py rif` produce JSON e Markdown uguali byte per byte. Il confronto aggiuntivo conserva anche tutti i byte di `deck-observations.json`, `in-play.json` e delle matrici, neutralizzando nelle sole intestazioni il nome o percorso e lo SHA-256 della bozza. `draft.json` fotografa l'input e `seconds.txt` registra il tempo. [Analisi SB-19](sb-19/analyze.py), [confronto dei byte](sb-20c/confronta-rif.py) e [impronte](sb-20c/identita-rif.json).

Le undici mutazioni sono state fatte una alla volta su `%TEMP%\bm-sb20c\mut-*.json`, partendo dalla bozza di consegna e lasciando i tre campi stampati precedenti per le mutazioni dei dati. Tutte escono con 1 e con lo slot e il campo attesi. [Diagnostica](sb-20c/mutazioni-testi.json).

## Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check` | Pulito. |
| `python scripts/check-links.py` | 432 file, zero link rotti. |
| `python scripts/check-rules.py` | Verde, regolamento 1.13, Set Base 0.1 e SQLite integro. |
| `./scripts/build.ps1 -Task Test -Offline` | Verde, server 947 test con 23 saltati, zero errori e fallimenti. Client debug 37 su 37. Log in `%TEMP%\bm-sb20c\full-test.log`. |
| `controlla-numeri.py` | R1–R4 verdi con le cinque eccezioni deliberate già previste. |
| `controlla-testi.py` | Tre uguaglianze esatte per ciascuna delle 116 carte. [Mutazioni](sb-20c/mutazioni-testi.json). |
| `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` | Riferimento e rarità allineati. |
| Cancelli «Rif» | Finale di SB-20b → base e base → consegna, entrambi verdi. [Impronte](sb-20c/identita-rif.json). |
| Perimetro protetto | Diff limitato a dati stampati, attesi di testo, strumenti di generazione e documenti. Ricerca delle dipendenze vive da `sim` e `model.cards.base` secondo la tabella delle aree vuota. |

**Rossi aperti:** nessuno. La verifica del contesto Spring e la resa dei simboli sul client appartengono alla Fase B2. In revisione il proprietario può valutare gli incisi rimossi e le precisazioni nella [tabella dei testi](#informazione-stampata); la passata di stile è SB-25.

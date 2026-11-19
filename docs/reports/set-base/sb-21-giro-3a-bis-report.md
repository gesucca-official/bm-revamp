# SB-21 — Giro 3a rifatto

**Controllo finale [D149](../../set-base-decisioni.md#decisioni-del-proprietario) superato.** Tutte le 21 coppie fra starter sono nel 35–65% e quelle fuori obiettivo scendono da 5 a 3. Patte e durate non aprono né aggravano scostamenti. Tutti e tre gli isolamenti di Estasi rientrano nei limiti. La bozza misurata è la base del giro 3b.

## Avanzamento

- **Diagnosi.** Checkout pulito su `6dacc2a`. Dopo il fetch, 14 commit locali e zero remoti da integrare. Nessun processo Java all'avvio del gate.
- **Gate.** Fattibilità identica a SB-20 nei sei file del comparatore e nei cinque grezzi. «Rif» identico negli stessi file. [Fattibilità](sb-21/giro-3a-bis/identita-feasibility.json) · [«Rif»](sb-21/giro-3a-bis/identita-round.json).
- **Modifica.** Copie con Estasi 10 + 2 × L. Adottato il compenso Piera con salute 90, L iniziale 15 e basic +15 L: migliore minimo al 44,83%. Tre coppie di Piera sopra il 65%, da ribilanciare dopo Celestina.
- **Passata 1.** Salute di Celestina 70 → 65. Entrambi i bersagli raggiunti senza altre coppie di Celestina fuori dal 35–65%. Specchio da 12,58% a 11,63% di patte e da 14,31 a 13,59 turni. Le prove del giro misurano un lancio per volta.
- **Passate 2 e 3.** Piera a 82 salute chiude le tre uscite dal 35–65%. Mara a 69 salute recupera altre due coppie in obiettivo senza nuove uscite. La passata 4 parte da 5 coppie fuori obiettivo.
- **Verifica.** Matrice integrale identica alla matrice composta della passata 4. Controllo finale e isolamenti verdi. 49 lanci, 3.745.728 partite e 1.557,02 s su 7.000, con zero violazioni e zero bound oltre il tetto in tutti i lanci. [Tempi](sb-21/giro-3a-bis/tempi.json) · [Invarianti e tetto](sb-21/giro-3a-bis/invarianti-misure.json).

## Compenso di Piera

Quote di Piera sulle partite decisive fra euristici (D93), lato A nello specchio. In grassetto le quote fuori dal 35–65%. Il minimo si calcola sui sei avversari.

| Compenso con Estasi 10 + 2 × L | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio | Minimo |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| L 15, basic +15 L (combinazione 2 del primo 3a) | 54,17 | 43,24 | **33,39** | 48,41 | 43,61 | 59,74 | 49,84 | 33,39 |
| H 90, L 15 | **65,70** | 61,81 | 43,42 | 49,12 | 57,14 | **74,33** | **68,91** | 43,42 |
| H 90, L 15, basic +15 L (scelto) | **67,41** | 63,72 | 44,83 | 47,74 | 58,84 | **76,70** | **69,88** | **44,83** |

La scelta segue il minimo più alto, come chiede D149. La combinazione pone tre coppie oltre il 65% e porta a 8 su 21 le coppie fuori obiettivo. [Compensi e impronte](sb-21/giro-3a-bis/compensi.json) · [Matrice dopo il compenso](sb-21/giro-3a-bis/matrice-piera.json).

## Passata 1 — Celestina

Piera–Celestina è quotata dal lato di Piera. Celestina–Sergio dal lato di Celestina. Obiettivo 40–60% per entrambe.

| Leva | Piera–Celestina | Celestina–Sergio | Altre nuove uscite dal 35–65% | Patte specchio | Turni specchio |
|---|---:|---:|---|---:|---:|
| Rif SB-20 | 36,82% | 68,82% | — | 12,58% | 14,31 |
| Compenso Piera | 44,83% | 68,82% | — | 12,58% | 14,31 |
| Salute 65 (tenuta) | 55,62% | 58,52% | 0 | 11,63% | 13,59 |
| Salute 60 | 66,26% | 49,80% | Mara, Beppe, Duccio | 10,06% | 12,82 |
| A iniziale 30 | 45,00% | 68,83% | 0 | 12,62% | 14,31 |
| T iniziale 10 | 53,66% | 57,33% | Beppe | 11,17% | 14,47 |
| Raschiare il fondo +6 T | 44,88% | 68,24% | 0 | 12,43% | 14,27 |

Salute 65 centra entrambi gli obiettivi rispettando il 35–65% sulle altre coppie di Celestina, perciò ho fermato le prove alle leve singole. Tre sue altre coppie escono dal 40–60%: contro Mara, Beppe e Duccio. Il totale sale da 8 a 10 fuori obiettivo, con tre coppie ancora fuori dal minimo. [H 65](sb-21/giro-3a-bis/matrice-cel-h65.json) · [H 60](sb-21/giro-3a-bis/matrice-cel-h60.json) · [A 30](sb-21/giro-3a-bis/matrice-cel-a30.json) · [T 10](sb-21/giro-3a-bis/matrice-cel-t10.json) · [Bound +6](sb-21/giro-3a-bis/matrice-cel-bound6.json).

## Passata 2 — Piera

Le quote sono dal lato di Piera. La passata parte dal compenso selezionato e dalla salute 65 di Celestina.

| Leva | Spazienzio | Mara | Celestina | Beppe | Sergio | Duccio | Coppie fuori obiettivo | Coppie fuori 35–65% |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Base della passata | 67,41 | 63,72 | 55,62 | 58,84 | 76,70 | 69,88 | 10 | 3 |
| A iniziale 10 | 66,87 | 63,37 | 55,62 | 59,96 | 77,91 | 70,61 | 10 | 3 |
| Cinque minuti e vado +3 L | 67,89 | 64,37 | 56,95 | 60,18 | 77,15 | 72,02 | 11 | 3 |
| Cinque minuti e vado +2 L | 68,39 | 64,82 | 57,41 | 61,23 | 76,94 | 71,93 | 11 | 3 |
| Salute 85 | 61,84 | 53,60 | 50,13 | 49,59 | 67,69 | 61,49 | 9 | 1 |
| Salute 82 (tenuta) | 57,52 | 47,49 | 46,20 | 45,36 | 62,92 | 54,77 | 7 | 0 |

La rifinitura della salute da 90 a 82 conserva un aumento rispetto agli 80 d'ingresso, L iniziale 15 e basic +15 L. Tre coppie tornano nell'obiettivo (Spazienzio, Mara e Duccio). Tutti gli incontri rientrano nel minimo. Piera–Sergio rientra nel minimo al 62,92% e nella durata a 11,80 turni. Le patte dello specchio di Piera rientrano nel limite. A iniziale e bound sono scartate perché non riducono le coppie fuori obiettivo. Salute 85 ne recupera una sola e lascia Piera–Sergio oltre il 65%. [Leve provate](sb-21/giro-3a-bis/prove.json) · [Matrice tenuta](sb-21/giro-3a-bis/matrice-p2-piera-h82.json).

## Passata 3 — Mara

La leva deve aiutare Spazienzio e Duccio nei loro incontri con Mara senza spingerla sotto il 35% contro Beppe.

| Leva | Spazienzio–Mara | Mara–Celestina | Mara–Beppe | Mara–Duccio | Coppie fuori obiettivo | Coppie fuori 35–65% |
|---|---:|---:|---:|---:|---:|---:|
| Base della passata | 43,98 | 62,60 | 39,58 | 61,98 | 7 | 0 |
| Salute 68 | 47,69 | 60,16 | 34,60 | 56,02 | 5 | 1 |
| Salute 67 | 48,68 | 58,04 | 32,90 | 52,01 | 5 | 1 |
| A iniziale 35 | 52,13 | 50,43 | 29,42 | 51,41 | 5 | 1 |
| Salute 69 (tenuta) | 46,42 | 62,20 | 36,78 | 59,76 | 5 | 0 |

Con salute 69, Spazienzio–Mara rientra nel 45–55% e Mara–Duccio nel 40–60%. Mara–Beppe rimane oltre l'obiettivo al 36,78%. Le tre prove più ampie sono scartate per quella coppia, che scende sotto il 35%. [Matrice tenuta](sb-21/giro-3a-bis/matrice-p3-mara-h69.json).

## Passata 4 — Ultimi scostamenti

| Leva dalla base della passata 3 | Coppie fuori obiettivo | Nuove uscite dal 35–65% | Esito |
|---|---:|---:|---|
| Celestina, salute 66 | 3 | 0 | Tenuta |
| Celestina, salute 67 | 3 | 0 | Celestina–Sergio al 62,35% e specchio con più patte e turni che a salute 66 |
| Beppe, V 23 | 4 | 0 | Beppe–Duccio si allontana dal minimo di durata (5,87 turni) |
| Beppe, salute 79 | 5 | 0 | Il conteggio non scende e Beppe–Duccio dura 5,85 turni |
| Sergio, A 35 | 7 | 2 | Spazienzio–Sergio e Mara–Sergio scendono sotto il 35% |
| Celestina, salute 66 e Raschiare il fondo +6 T | 4 | 0 | Mara–Celestina resta fuori obiettivo al 60,05% |

Salute 66 recupera Mara–Celestina, Celestina–Beppe e Celestina–Duccio. Celestina–Sergio supera il 60% di 0,36 punti. A parità di coppie fuori obiettivo, salute 66 lascia Celestina più vicina al criterio contro Sergio e migliora patte e durata dello specchio rispetto a salute 67. Le leve dei personaggi bastano al controllo sulle quote di D149. [Matrice della passata 4](sb-21/giro-3a-bis/matrice-p4-cel-h66.json).

## Valori in consegna

| Dato | Ingresso → consegna | Passo |
|---|---|---|
| Estasi, danno base | 18 → 10 HIT | Impostazione Estasi, D149 |
| Estasi, HIT per L spesa | 1 implicito → 2 | Impostazione Estasi, D149 |
| Piera, salute iniziale | 80 → 90 → 82 | Compenso, poi passata 2 |
| Piera, L iniziale | 10 → 15 | Compenso |
| Questo lo finisco io, guadagno | +5 → +15 L | Compenso |
| Celestina, salute iniziale | 70 → 65 → 66 | Passate 1 e 4 |
| Mara, salute iniziale | 70 → 69 | Passata 3 |

I testi di Estasi e della basic di Piera sono rigenerati. Gli attesi D149 di Bozza16Test, SetBaseDraftTest e StarterRedesignTest seguono questi valori e i testi derivati. Il confronto strutturale dei campi format, set, rules e di tutte le liste dei mazzi è verde. SHA-256 della bozza misurata e consegnata 1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc.

## Matrice prima e dopo

Quota percentuale del personaggio di riga sulle decisive fra euristici, lato A negli specchi. Ogni cella riporta **Rif → finale**. Il grassetto indica uno scostamento dall'obiettivo. La banda è 45–55% per Spazienzio–Mara e 40–60% per le altre coppie, specchi esclusi. D149 richiede anche tutte le coppie nel 35–65%. [Criteri](../../set-base-plan.md#bilanciamento-metodo-e-criteri) · [Rif](sb-21/giro-3a-bis/matrice-rif.json) · [Finale, con stili misti e com–com](sb-21/giro-3a-bis/matrice-finale.json).

| | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
|---|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 55,12 → 55,12 | **43,98** → 46,42 | 42,05 → 47,56 | 44,12 → 42,48 | 50,69 → 50,69 | 43,90 → 43,90 | 44,73 → 44,73 |
| Mara | — | 48,58 → 47,67 | 50,23 → 59,93 | 57,82 → 49,44 | **39,58** → **36,78** | 43,54 → 41,92 | **61,98** → 59,76 |
| Celestina | — | — | 45,50 → 46,65 | **63,18** → 55,49 | 49,22 → 41,65 | **68,82** → **60,36** | 47,55 → 40,89 |
| Piera | — | — | — | 47,20 → 47,74 | 43,76 → 45,36 | 56,44 → **62,92** | 45,98 → 54,77 |
| Beppe | — | — | — | — | 50,16 → 50,16 | 50,06 → 50,06 | 41,30 → 41,30 |
| Sergio | — | — | — | — | — | 46,39 → 46,39 | 55,72 → 55,72 |
| Duccio | — | — | — | — | — | — | 54,62 → 54,62 |

Le coppie fuori obiettivo sono **5 → 3** e quelle fuori dal 35–65% **1 → 0**. Le patte aggregate fra euristici passano dal **4,34% al 4,22%** e la durata media da **8,956 a 8,954 turni**. Il controllo confronta ogni incontro con il 10% di patte e con i 6–12 turni e richiede che una coppia già oltre soglia non se ne allontani. La tabella elenca tutti gli scostamenti residui di durata e patte.

| Incontro | Patte prima → dopo | Turni prima → dopo | Criterio ancora fuori |
|---|---:|---:|---|
| Celestina–Celestina | 12,58% → 10,84% | 14,31 → 13,76 | patte, durata |
| Beppe–Duccio | 0,93% → 0,93% | 5,90 → 5,90 | durata |
| Sergio–Sergio | 1,07% → 1,07% | 13,71 → 13,71 | durata |

Le coppie com–com fuori dal 35–65% scendono da 8 a 6. Posti con mazzo esaurito, prima → dopo: euristici 13,90% → 14,55%, misti 15,80% → 16,39%, com–com 28,93% → 27,41%. Zero turni senza mosse legali.

## Isolamenti di Estasi

D148 (4) richiede al più +10 punti di media e +15 in ciascun incontro. In tre copie temporanee dei mazzi, due Estasi sostituiscono le stesse due carte del giro 1. Si confrontano le decisive fra euristici con la matrice integrale finale sugli stessi sette avversari, usando il 50% come riferimento per lo specchio del mazzo di controllo.

| Mazzo | Due copie tolte | Media (pp) | Massimo (pp) | Avversario del massimo |
|---|---|---:|---:|---|
| Beppe | Chiave da tredici | −14,75 | −2,57 | Spazienzio |
| Spazienzio | GABBIANO DUNQUE VOLIAMOTI | +2,71 | +7,64 | Sergio |
| Mara | Sputo da posacenere | +6,83 | +10,26 | Spazienzio |

Tutti e tre passano. D148 (4) ammette la perdita di Beppe. [Incontri e controllo finale](sb-21/giro-3a-bis/controllo-finale.json).

## Consegna al giro 3b

Il giro 3b parte dalla bozza D149. Le quote residue, dal lato del primo nome, sono Mara–Beppe **36,78%**, Celestina–Sergio **60,36%** e Piera–Sergio **62,92%**. Restano la ricerca sui sette un personaggio per volta, gli scontri fra costruiti e gli isolamenti delle carte ricorrenti nei mazzi dominanti, nel budget di 9.000 s di D148. Nei quattro migliori mazzi disponibili di SB-20 Estasi, Secondo fiato e Sgommata ricorrevano in 4 su 4. Gli isolamenti di questo giro riguardano due sostituzioni in tre starter. La frequenza nelle nuove liste e il dominio fra costruiti si giudicano nel 3b. [Ricerca SB-20](sb-20/ricerca-dopo-parziale.json).

## Riproduzione e verifiche

Da radice e con la bozza d'ingresso di `6dacc2a`, eseguire `run.ps1 -Phase feasibility` e poi `-Phase round`, con `-Label sb21g3abis-rif`, `-Draft` assoluto e `-OutputRoot "$env:TEMP/bm-sb21-g3abis"`. Per entrambe le fasi, usare `analyze.py rif` e `confronta-rif.py` contro la fase omonima e il prefisso `<fase>-confronto-sb20` in `%TEMP%/bm-sb20`. [Lanciatore](sb-19/run.ps1) · [Analisi](sb-19/analyze.py) · [Comparatore](sb-20c/confronta-rif.py).

Eseguire `python -B -X utf8 docs/reports/set-base/sb-21/giro-3a-bis/misura.py --shell (Get-Process -Id $PID).Path` con `piera`, poi `celestina cel-<leva> <leva>` per `h65 h60 a30 t10 bound6`. Ogni prova delle passate 2–4 usa `prova <nome> <origine> docs/reports/set-base/sb-21/giro-3a-bis/prove.json`. Chiudere con `completa finale p4-cel-h66` e `fine finale`. Le etichette, l'ordine e i lati del lancio sono nei [tempi](sb-21/giro-3a-bis/tempi.json). Le [leve di prova](sb-21/giro-3a-bis/prove.json) riportano i frammenti prima/dopo. Ogni matrice composta indica la sua matrice di origine e i lanci usati. Le basi tenute in sequenza sono `piera`, `cel-h65`, `p2-piera-h82`, `p3-mara-h69`, `p4-cel-h66`. Regole d50, seme iniziale 7.000.000, otto thread, 12 stili per lato, 100 semi per cella (4 per la fattibilità). Copie temporanee, grezzi e log in `%TEMP%/bm-sb21-g3abis`. [Script](sb-21/giro-3a-bis/misura.py).

**Verifiche di consegna.** Fattibilità e «Rif» identici a SB-20. `git diff --check`, `check-links.py` (437 documenti, zero link rotti), `check-rules.py`, entrambi i controlli D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` verdi. `./scripts/build.ps1 -Task Test -Offline` verde dopo le misure: server 950 test rilevati, 23 saltati, zero errori e fallimenti. Client di debug 37 su 37. Il contesto Spring completo ha una verifica separata.

**Diagnosi dei test.** Il primo avvio ha rilevato una sintassi incompatibile negli attesi di Bozza16Test, corretta nel test. La suite successiva ha individuato l'atteso storico di Estasi in StarterRedesignTest: il test mirato è verde sulla bozza d'ingresso (25 HIT), mentre D149 con 7 L produce 24 HIT. Adeguato quell'atteso e verificata l'intera suite sulla bozza misurata. Log `test-offline.log`, `test-offline-sintassi.log`, `test-offline-atteso-estasi.log` e `test-estasi-ingresso.log` in `%TEMP%/bm-sb21-g3abis`.

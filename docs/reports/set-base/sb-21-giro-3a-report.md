# SB-21 — Giro 3a, Estasi e incontri fra starter

**STOP alla selezione del compenso ([D148](../../set-base-decisioni.md#decisioni-del-proprietario)).** Nessuna delle sei prove su leve singole e delle tre combinazioni misurate porta tutte le coppie di Piera nel 35–65%. La combinazione più vicina lascia Piera al **33,39% contro Celestina**, 1,61 punti sotto il minimo. La bozza consegnata coincide con quella in ingresso. Le passate sugli starter e gli isolamenti sulla bozza compensata richiedevano un compenso idoneo.

## Avanzamento

- **Diagnosi.** Checkout pulito su `b6f045c`, 12 commit locali e zero remoti da integrare dopo il fetch. Porte di gioco libere e nessun processo Java al passo 0.
- **Gate.** Fattibilità (16.128 partite, 12,20 s) e «Rif» (403.200, 139,53 s) identici a SB-20 nei sei file del comparatore. Nei cinque grezzi `matrix.json`, `matrix.md`, `deck-observations.json`, `in-play.json` e `draft.json` l'identità è verificata anche senza normalizzazione. [Fattibilità](sb-21/giro-3a/identita-feasibility.json) · [«Rif»](sb-21/giro-3a/identita-round.json).
- **Modifica.** Estasi B1 e i compensi sono stati applicati a copie temporanee. Il limite di tre combinazioni è raggiunto. La bozza in consegna ha SHA-256 `26767a506e0a197c319fe7571b6e0f8652c9fdeec11075cfaac8c9708a8c17a3`.
- **Misure.** 20 lanci esclusivi, **1.326.528 partite in 611,00 s** sui 7.000 s disponibili, passo 0 incluso. Residuo 6.389,00 s. Invarianti e bound oltre il tetto a zero in ogni lancio. [Tempi](sb-21/giro-3a/tempi.json) · [Invarianti e tetto](sb-21/giro-3a/invarianti-misure.json).

## Estasi B1 e compensi

D147 B1 e D148 autorizzano Estasi gratuita a **10 + 2 × L spesa**, da base 18 e moltiplicatore implicito 1. Tutte le prove 3a usano B1. La tabella indica tutti gli altri valori provati, in ordine. Le quote sono quelle di Piera sulle partite decisive fra euristici (D93), in grassetto fuori dal 35–65%. Nello specchio la quota è del lato A.

| Passo e valore nella copia | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
|---|---:|---:|---:|---:|---:|---:|---:|
| «Rif» in ingresso | 55,88 | 42,18 | 36,82 | 47,20 | 43,76 | 56,44 | 45,98 |
| B1 da sola, giro 2 | 42,09 | **25,22** | **20,16** | 50,25 | **28,30** | 44,49 | 36,83 |
| Salute iniziale 80 → 90 | 57,23 | 46,89 | **30,56** | 50,26 | 40,69 | 62,48 | 60,24 |
| Salute iniziale 80 → 100 | **69,66** | **66,22** | 42,79 | 49,19 | 59,82 | **82,65** | **78,10** |
| L iniziale 10 → 15 | 51,07 | 39,81 | **31,57** | 48,52 | 42,18 | 57,06 | 48,03 |
| L iniziale 10 → 20 | 63,49 | 55,35 | 46,95 | 50,70 | 58,01 | **70,52** | 63,38 |
| «Questo lo finisco io» da +5 a +10 L | 44,46 | **27,02** | **22,48** | 49,03 | **30,43** | 46,51 | 37,93 |
| «Cinque minuti e vado» da +5 a +4 L | 43,78 | **24,91** | **21,94** | 50,54 | **29,67** | 46,81 | 38,13 |
| Combinazione 1, L iniziale 15 e basic +10 L | 52,82 | 41,81 | **33,06** | 48,03 | 43,04 | 58,72 | 48,50 |
| Combinazione 2, L iniziale 15 e basic +15 L | 54,17 | 43,24 | **33,39** | 48,41 | 43,61 | 59,74 | 49,84 |
| Combinazione 3, L iniziale 15 e basic +20 L | 54,59 | 42,24 | **33,21** | 48,83 | 43,55 | 59,93 | 50,69 |

**Scelte prese.** Per la bound ho provato il valore adiacente inferiore. Il massimo su otto usi scende da 3,75 a 3,40 unità. In SB-16d già +6 L valeva 5,10 unità con la corazza, oltre il tetto di D33/D36. Ho combinato L iniziale 15 con la basic perché fra le leve singole che lasciano una sola coppia sotto il 35%, L 15 portava Piera più vicina al minimo contro Celestina e lasciava più margine contro Sergio e Duccio rispetto a salute 90. Ho tenuto fissa L 15 e alzato la basic in tre incrementi per cercare il valore minimo utile su quella coppia di leve. Il passaggio da +15 a +20 L alla basic ha ridotto lievemente la quota contro Celestina. Le altre combinazioni fra leve individuali restano da misurare. [Tetto di SB-16d](sb-16d-report.md#correzione-numerica-di-cinqueminutievado-d38d54).

**Decisione per ogni prova.** Tutti i valori della tabella sono scartati in 3a per la condizione di D148 illustrata sopra. Zero passate sugli starter avviate, zero valori tenuti, zero attesi cambiati. [Riproduzione](sb-21/giro-3a/misura.py) · [Combinazione 2](sb-21/giro-3a/compenso-l15-basic15.json).

## Isolamenti di Estasi

D148 (4) impone una media al più +10 punti e un massimo di +15 per incontro. Sono disponibili gli isolamenti B1 del giro 2, con due sostituzioni identiche al giro 1 e sette avversari per mazzo. Tutti e tre soddisfano il solo limite superiore di D148. Dopo lo STOP di selezione manca una bozza compensata su cui ripeterli.

| Mazzo | Due copie tolte | Media (pp) | Massimo (pp) e avversario |
|---|---|---:|---|
| Beppe | Chiave da tredici | −14,11 | −2,57, Spazienzio |
| Spazienzio | GABBIANO DUNQUE VOLIAMOTI | +3,15 | +7,64, Sergio |
| Mara | Sputo da posacenere | +6,83 | +9,50, Spazienzio |

[Confronti per avversario di B1](sb-21/giro-2/varianti.json) · [Metodo del giro 1](sb-21-giro-1-report.md#isolamenti-e-scelta).

## Matrice prima e dopo

La matrice della bozza in consegna coincide con quella in ingresso. Quota percentuale del personaggio di riga sulle decisive fra euristici, lato A sullo specchio. In grassetto le **5 coppie fuori obiettivo su 21** sia prima sia dopo: 45–55% per Spazienzio–Mara, 40–60% per le altre. Celestina–Sergio (68,82%) è l'unica coppia già fuori dal 35–65%. [Criteri](../../set-base-plan.md#bilanciamento-metodo-e-criteri) · [Matrice per gruppo di bot](sb-21/giro-3a/matrice-rif.json) · [Celle per stile, SB-20](sb-20/matrice-celle.json.gz).

| | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
|---|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 55,12 | **43,98** | 42,05 | 44,12 | 50,69 | 43,90 | 44,73 |
| Mara | — | 48,58 | 50,23 | 57,82 | **39,58** | 43,54 | **61,98** |
| Celestina | — | — | 45,50 | **63,18** | 49,22 | **68,82** | 47,55 |
| Piera | — | — | — | 47,20 | 43,76 | 56,44 | 45,98 |
| Beppe | — | — | — | — | 50,16 | 50,06 | 41,30 |
| Sergio | — | — | — | — | — | 46,39 | 55,72 |
| Duccio | — | — | — | — | — | — | 54,62 |

Il 10% di patte è superato nel solo specchio di Celestina (12,58%, scostamento noto in D131). Fuori dai 6–12 turni medi in tre incontri su 28: Celestina–Celestina 14,31, Sergio–Sergio 13,71, Beppe–Duccio 5,90. Esaurimento del mazzo nel 13,90% dei posti fra euristici, 15,80% fra stili misti e 28,93% in com–com. In com–com, 8 coppie su 21 fuori dal 35–65%. Zero turni senza mosse legali.

## Consegna al giro 3b

Il giro 3b riceve la stessa bozza di SB-20, con Estasi **18 + L spesa**. Fra le carte provate in 3a, Estasi ricorre in **4 su 4** dei migliori mazzi disponibili di SB-20, **7 copie** in tutto. La basic e la bound provate appartengono a Piera. La ricerca sui sette e i confronti fra costruiti di D148 (3) sono da misurare nel giro 3b. Il calo di Piera contro Celestina resta il vincolo aperto se si torna a B1. [Mazzi di SB-20](sb-20/ricerca-dopo-parziale.json).

## Riproduzione e verifiche

Da radice, `run.ps1 -Phase feasibility` e poi `-Phase round` con `-Label sb21g3a-rif`, `-Draft` sul percorso assoluto di `bozza.json` e `-OutputRoot "$env:TEMP/bm-sb21-g3a"`. Per ciascuna fase, `analyze.py rif` genera i riepiloghi e `confronta-rif.py` li confronta con il giro omonimo e il prefisso `<fase>-confronto-sb20` in `%TEMP%/bm-sb20`. [Lanciatore](sb-19/run.ps1) · [Analisi](sb-19/analyze.py) · [Comparatore](sb-20c/confronta-rif.py).

Dopo il gate, `python -B -X utf8 docs/reports/set-base/sb-21/giro-3a/misura.py --shell (Get-Process -Id $PID).Path singoli`, poi lo stesso comando con `combinazioni`. Regole d50, seme iniziale 7.000.000, otto thread, 12 stili per lato. Quattro semi per cella in fattibilità, 100 nelle altre misure; nelle prove di Piera due lanci (3 + 4 incontri) per riprodurre l'orientamento di «Rif», 8.100 partite euristiche per incontro. Copie, grezzi e log in `%TEMP%/bm-sb21-g3a`. Entrambi i controlli D143 sono verdi su tutte le copie, dopo la rigenerazione dei testi.

**Verifiche di consegna.** `git diff --check` verde. `check-links.py`: 436 documenti, zero link rotti. `check-rules.py`, entrambi i controlli D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` tutti verdi sulla bozza consegnata. `./scripts/build.ps1 -Task Test -Offline` eseguita dopo l'ultima misura: server 950 test rilevati, 23 saltati, zero errori e fallimenti. Client di debug 37 su 37. Log in `%TEMP%/bm-sb21-g3a/test-offline.log`. Il diff rispetto a `b6f045c` è vuoto su server, client, regolamento, documenti di set, allegato e strumenti SB-19.

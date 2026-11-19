# SB-21 — Giro 2 su Estasi da Coca Etilene

**STOP di selezione (D147). Nessuna delle quattro varianti passa.** La bozza resta con **Estasi generica, gratuita, 18 + L spesa** e **Grappa +25 L** (D146, punto 2). B1 è la più vicina allo starter di Piera, con tre coppie sotto il 35% e Beppe a −14,11 punti medi nell'isolamento. La ricerca «dopo» e gli scontri fra costruiti sono sospesi al passo di selezione. [D147 e D146](../../set-base-decisioni.md#decisioni-del-proprietario).

## Avanzamento

- **Diagnosi.** Checkout pulito su `def768f`, 10 commit locali e 0 remoti da integrare dopo il fetch autorizzato. Porte di gioco libere, nessun processo Java. Bozza di partenza SHA-256 `26767a506e0a197c319fe7571b6e0f8652c9fdeec11075cfaac8c9708a8c17a3`.
- **Modifica.** `GoingBerserk` usa il parametro facoltativo `perAlcohol`, con valore iniziale 1, per il danno e per `printedEffects`. Il modello di stampa di Estasi descrive la L residua quando c'è un costo in L e stampa il moltiplicatore. Il nuovo test copre il valore omesso, 1 esplicito, 2 e L'ultimo giro, incluso Rincara. Il primo stato di prova della last resort teneva 12 L, con cui la corazza di d50 assorbe tutti i 3 HIT a sé. Il test usa 3 L per osservare insieme il contributo della L al colpo e il contraccolpo.
- **Passo 0.** Tre test mirati verdi. Fattibilità (16.128 partite) e «Rif» (403.200 partite) identici a SB-20 sui sei file del comparatore e sul `draft.json` esportato (SHA-256 `c6e847c49a13dc82b8f82e2d9679a357f12c83454eab0d4f9a92a228702cf888`). Tempo cumulato 152,19 s. [Fattibilità](sb-21/giro-2/identita-feasibility.json) · [«Rif»](sb-21/giro-2/identita-round.json).
- **Selezione.** Le quattro copie hanno superato i due controlli D143. Zero violazioni degli invarianti e zero bound oltre il tetto in tutte le misure. In tutto 14 lanci esclusivi, **2.032.128 partite in 767,70 s** dei 5.500 s disponibili, passo 0 incluso. Il budget residuo al momento dello STOP era 4.732,30 s. [Tempi](sb-21/giro-2/tempi.json).

## Varianti e scelta

Le quote sono sulle decisive fra bot euristici, come in D93. Ogni isolamento sostituisce due carte nello stesso mazzo del giro 1. Beppe cede due Chiavi da tredici, Spazienzio due «GABBIANO DUNQUE VOLIAMOTI», Mara due Sputo da posacenere. Si confronta ciascun isolamento con il proprio riferimento contro gli stessi sette avversari. Contro Piera il controllo usa la stessa variante di Estasi e per il riferimento contro se stesso si usa il 50%. D131 richiede **0–10 punti di guadagno medio** e **al massimo +15 in ogni incontro**. D147 esclude inoltre ogni variante che fa uscire dal 35–65% una coppia di Piera già in fascia. Per confrontare la vicinanza si usa lo scarto assoluto medio sulle sei coppie senza specchio, a pari merito prevale la leva A. [Scambi e metodo del giro 1](sb-21-giro-1-report.md#isolamenti-e-scelta) · [D147, D131 e D93](../../set-base-decisioni.md#decisioni-del-proprietario).

| Variante | Costo (L) | HIT | Beppe, media / massimo | Spazienzio, media / massimo | Mara, media / massimo | Coppie di Piera uscite | Scarto medio Piera (pp) |
|---|---:|---|---:|---:|---:|---:|---:|
| A1 | 5 | 18 + L residua | −39,83 / −20,10 | −13,81 / −11,11 | −12,83 / −7,77 | 5 | 23,32 |
| A2 | 10 | 18 + L residua | −37,07 / −20,10 | −14,31 / −12,07 | −11,91 / −6,67 | 6 | 31,35 |
| B1 | 0 | 10 + 2 × L | −14,11 / −2,57 | **+3,15 / +7,64** | **+6,83 / +9,50** | 3 | 13,99 |
| B2 | 0 | 6 + 2 × L | −27,45 / −13,78 | −4,82 / −1,46 | −4,67 / −1,13 | 5 | 22,26 |

In grassetto gli isolamenti che rientrano in D131. Beppe è sotto il minimo di D131 in tutte le prove e perde quota in tutti e sette gli incontri anche con B1. A1, A2 e B2 hanno medie negative in tutti e tre gli isolamenti. [Confronti per avversario e SHA-256 delle copie](sb-21/giro-2/varianti.json).

| Piera contro | «Rif» | A1 | A2 | B1 | B2 |
|---|---:|---:|---:|---:|---:|
| Spazienzio | 55,88% | 36,50% | **25,64%** | 42,09% | **33,53%** |
| Mara | 42,18% | **15,48%** | **8,47%** | **25,22%** | **17,33%** |
| Celestina | 36,82% | **15,38%** | **7,77%** | **20,16%** | **13,30%** |
| Piera (lato A) | 47,20% | 49,71% | 47,70% | 50,25% | 49,90% |
| Beppe | 43,76% | **15,55%** | **8,07%** | **28,30%** | **16,18%** |
| Sergio | 56,44% | **32,66%** | **23,05%** | 44,49% | 35,14% |
| Duccio | 45,98% | **25,56%** | **19,93%** | 36,83% | **32,04%** |

In grassetto le uscite dalla fascia protetta. Piera–Mara, Piera–Celestina e Piera–Beppe escono in tutte e quattro le varianti. Con la più vicina, B1, perdono rispettivamente 16,95, 16,65 e 15,46 punti.

## Matrice dei sette riferimenti

Quota percentuale del personaggio di riga sulle decisive fra euristici. La diagonale mostra la quota del lato A. La matrice riprodotta è byte per byte quella di SB-20, sulla bozza che resta in vigore. [Aggregati dei tre gruppi di bot](sb-21/giro-2/matrice-starter-prima.json) · [Celle per stile, SB-20](sb-20/matrice-celle.json.gz).

| | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
|---|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 55,12 | **43,98** | 42,05 | 44,12 | 50,69 | 43,90 | 44,73 |
| Mara | — | 48,58 | 50,23 | 57,82 | **39,58** | 43,54 | **61,98** |
| Celestina | — | — | 45,50 | **63,18** | 49,22 | **68,82** | 47,55 |
| Piera | — | — | — | 47,20 | 43,76 | 56,44 | 45,98 |
| Beppe | — | — | — | — | 50,16 | 50,06 | 41,30 |
| Sergio | — | — | — | — | — | 46,39 | 55,72 |
| Duccio | — | — | — | — | — | — | 54,62 |

I criteri completi di D95 danno **5 quote fuori obiettivo su 21**, in grassetto (45–55% per Spazienzio–Mara, 40–60% per le altre coppie). Tre incontri su 28 escono dai 6–12 turni medi, Celestina–Celestina (14,31), Sergio–Sergio (13,71) e Beppe–Duccio (5,90). Solo Celestina–Celestina supera il 10% di patte (12,58%, scostamento noto in D131). Esaurimento del mazzo per il 13,90% dei posti fra euristici, 15,80% fra stili misti e 28,93% nel controllo com–com. Nel com–com escono 8 coppie su 21 dal 35–65%. Zero turni senza mosse legali. [Tabella dei criteri](../../set-base-plan.md#bilanciamento-metodo-e-criteri) · [D95 e D93](../../set-base-decisioni.md#decisioni-del-proprietario).

## Costruiti contro starter

Lo STOP di D147 precede il lancio dei sette `search.ps1` e il confronto fra i migliori costruiti. La fotografia disponibile è SB-20, sullo stesso SHA-256, con quattro personaggi conclusi. Per ogni personaggio il miglior finalista è quello con la quota più alta sulle decisive contro il banco dei 26. La tabella ricalcola quel finalista sui cinque starter. Tutti i **20 incontri misurati su 20** superano il 70%, estremo superiore dell'obiettivo 65–70%. [Liste e convalide per avversario](sb-20/ricerca-dopo-parziale.json).

| Personaggio | Quota sui cinque starter | Punti oltre 70% | Min–max per incontro | Estasi | Grappa |
|---|---:|---:|---:|---:|---:|
| Spazienzio | 93,07% | +23,07 | 90,24–95,81% | 2 | 0 |
| Mara | 99,27% | +29,27 | 98,09–100,00% | 1 | 0 |
| Celestina | 96,28% | +26,28 | 92,93–99,29% | 2 | 0 |
| Piera | 98,91% | +28,91 | 97,84–99,85% | 2 | 1 |
| Beppe | in attesa | — | — | — | — |
| Sergio | in attesa | — | — | — | — |
| Duccio | in attesa | — | — | — | — |

**Ricorrenze nei migliori quattro costruiti disponibili.** Estasi compare in 4/4, con sette copie complessive. Secondo fiato e Sgommata compaiono anch'essi in 4/4. In 3/4 compaiono Espresso del distributore, Ghiaccio nel tovagliolo, Panino del kebab dimenticato, Negroni Trovato per Terra, Mescolone Micidiale e Mezza minerale sgasata. Grappa compare in 1/4, una copia nel migliore di Piera. Le frequenze riguardano le liste finaliste, composte da più carte cambiate insieme. [Liste, SB-20](sb-20/ricerca-dopo-parziale.json).

## Giro 3, ultimo prima del proprietario

1. **Costruiti contro starter, 20/20 oltre il 70%.** Completare le ricerche sui sette e gli scontri diretti. Fra le carte che ricorrono, isolare per prime Estasi, Secondo fiato e Sgommata nei mazzi che dominano più incontri. Misurare il contributo di ciascuna sostituzione appaiata.
2. **Piera, tre coppie fragili in tutte e quattro le prove.** Per entità del calo in B1, guardare prima Mara, poi Celestina, poi Beppe. Per un nuovo esperimento, valutare insieme una curva generica più mite di B1 per Estasi e un sostegno da una carta già nello starter di Piera. Tenere Beppe come controllo dell'isolamento, dato che anche B1 perde in tutti i suoi sette incontri.
3. **Grappa, un incontro oltre il tetto in Beppe.** Misurare la sostituzione contro Celestina, che valeva +18,24 punti a +25, +20 e +15 L nel giro 1. Il confronto va impostato attorno allo scambio di carte, visti gli spostamenti minimi già osservati cambiando la quantità di L. Grappa resta a +25 L per D146 (2). [Misure di Grappa del giro 1](sb-21-giro-1-report.md#grappa-con-estasi-a-18).

**Domanda 1.** Nel giro 3 vuoi dare la precedenza a ricerca e scontri fra costruiti, usando il budget residuo del giro per isolare le carte più ricorrenti?

## Riproduzione e verifiche

Per il passo 0, `run.ps1 -Phase feasibility`, poi `-Phase round`, con `-Label sb21g2-rif`, `-Draft` sul percorso assoluto della bozza e `-OutputRoot "$env:TEMP/bm-sb21-g2"`. Per ogni fase, `analyze.py rif` produce i riepiloghi, poi `confronta-rif.py` verifica contro il giro omonimo in `%TEMP%/bm-sb20` e il prefisso `<fase>-confronto-sb20`. [Lanciatore](sb-19/run.ps1) · [Analisi](sb-19/analyze.py) · [Comparatore](sb-20c/confronta-rif.py).

Dalla radice, `python -X utf8 docs/reports/set-base/sb-21/giro-2/misura.py --shell (Get-Process -Id $PID).Path` lancia e valuta le quattro copie dopo il passo 0. Regole `d50`, otto thread, 12 stili per lato, seme iniziale 7.000.000. Quattro semi per cella in fattibilità, 100 nei giri completi. Per ogni coppia completa ci sono 8.100 partite euristiche, 5.400 miste e 900 com–com. Per variante si misurano 21 isolamenti e 7 coppie dello starter di Piera, con il lato A allineato a «Rif». Grezzi e log in `%TEMP%/bm-sb21-g2`. [Misura e selezione](sb-21/giro-2/misura.py).

**Partita viva, tre condizioni della deroga.**

1. Il diff in `server/src/main` contiene la sola classe `model/cards/base/pino/GoingBerserk.java`. Il confronto con `def768f` su catalogo SQLite, regolamento, documenti di set, allegato e client è vuoto. La bozza sta in `server/src/test/resources`.
2. Il `git grep` prescritto per le dipendenze del codice vivo restituisce zero occorrenze.
3. Il catalogo vivo ha lo stesso SHA-256 della base e la lettura SQLite delle colonne di riferimento alle classi restituisce zero riferimenti a `model/cards/base`.

L'identità viva e `TestServerContext` con i manifest rientrano nella deroga. [Playground e misure](../../aree-protette.md#playground-e-misure).

`git diff --check`, controllo link, coerenza regolamento, i due D143, documento generato e rarità sono verdi. La bozza conserva lo SHA-256 del passo 0. Il modello di testo conserva l'allineamento esatto dei tre campi stampati per 116 carte. Gli attesi dei test preesistenti e le schede della bozza corrispondono a `def768f`. La suite offline è stata eseguita dopo l'ultima misura: server 950 test rilevati, 23 saltati, 0 fallimenti o errori; client di debug 37 su 37. [Esiti e impronte](sb-21/giro-2/verifiche.json).

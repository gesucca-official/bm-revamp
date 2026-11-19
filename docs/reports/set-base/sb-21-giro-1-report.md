# SB-21 — Giro 1 su Estasi e Grappa

**STOP di selezione. Nessuna variante numerica di Estasi soddisfa entrambi i criteri.** La bozza resta a **Estasi 18 HIT di base** e **Grappa +25 L**. Con il ritocco minimo a 15, Piera scende sotto il 35% contro Mara, Celestina e Beppe. Lo STOP precede l’adozione di Grappa e la nuova ricerca. [D145 e D136](../../set-base-decisioni.md#decisioni-del-proprietario).

## Porta e avanzamento

- **Diagnosi.** Checkout pulito su `c454a1d`. Dopo `git fetch`, `main` aveva sette commit locali e zero commit remoti da integrare. Porte di gioco libere e nessun processo Java prima della porta. Bozza SHA-256 `26767a506e0a197c319fe7571b6e0f8652c9fdeec11075cfaac8c9708a8c17a3`.
- **Porta.** Fattibilità in 15,23 s (16.128 partite) e «Rif» in 141,90 s (403.200 partite). I sei file verificati coincidono byte per byte con SB-20 dopo la normalizzazione dei metadati di provenienza. Il primo tentativo di confronto di fattibilità aveva ricevuto il percorso di riepilogo errato. Ho corretto l’argomento e confrontato le partite già prodotte. [Fattibilità](sb-21/giro-1/identita-feasibility.json) · [«Rif»](sb-21/giro-1/identita-round.json).
- **Modifica.** Le varianti e gli scambi di mazzo sono stati applicati alle copie di misura. La consegna è composta da rapporto, piano, strumenti ed evidenze del giro.
- **Verifica.** Zero violazioni degli invarianti e zero bound oltre il tetto nelle misure. I controlli D143 hanno dato esito verde su ogni copia di misura, con testi rigenerati sui valori provati. Verifiche di consegna verdi, con la suite eseguita dopo la misura finale. [Tempi](sb-21/giro-1/tempi.json).

## Isolamenti e scelta

Sono stati usati 1.390,68 s di misura su 5.500 s disponibili, per 3.443.328 partite, una misura alla volta. La variante più vicina al valore corrente doveva avere in ogni isolamento un guadagno medio da 0 a +10 punti, con massimo +15 in un singolo incontro, e conservare in fascia tutte le coppie di riferimenti già al 35–65% in «Rif». Le quote sono sulle decisive fra due bot euristici, come in D93. Il guadagno è la differenza rispetto al riferimento con gli stessi valori di carta. Il riferimento contro se stesso vale 50% come in SB-19. [D131, D95, D93, D82 e D51](../../set-base-decisioni.md#decisioni-del-proprietario) · [Metodo SB-19](sb-19/evidence/iso-summary.md).

Ogni isolamento inserisce due copie di un solo titolo. Per Estasi ho ripreso la sostituzione di SB-19 in Beppe (Chiave da tredici ×2) e scelto due azioni offensive comuni nei nuovi contesti («GABBIANO DUNQUE VOLIAMOTI» ×2 in Spazienzio e Sputo da posacenere ×2 in Mara). Il guadagno vale per la sostituzione misurata. A ogni valore di Estasi, il controllo contro Piera usa lo stesso valore. Per i confronti tra riferimenti il lato di partenza per ogni seme è quello di «Rif». [Scambi](sb-21/giro-1/prepara.py).

| Estasi (HIT base) | Beppe, media / massimo | Spazienzio, media / massimo | Mara, media / massimo | Coppie di riferimenti uscite dal 35–65% |
|---:|---:|---:|---:|---|
| 18 | +10,56 / +16,39 | +18,92 / +21,55 | +24,28 / +29,46 | riferimento |
| 15 | +2,75 / +9,86 | +12,51 / +15,78 | +17,79 / +22,59 | Piera contro Mara, Celestina, Beppe |
| 12 | −6,13 / +3,45 | +6,84 / +10,33 | +11,42 / +14,25 | Piera contro Mara, Celestina, Beppe |
| 10 | −13,45 / −2,57 | +3,42 / +7,58 | +6,40 / +9,50 | Piera contro Mara, Celestina, Beppe, Duccio |

A 15 passerebbe il solo Beppe. A 12 passerebbe il solo Spazienzio. A 10 passerebbero Spazienzio e Mara, con Beppe in perdita in tutti e sette gli incontri. Tutte le varianti numeriche fanno uscire almeno tre coppie già in fascia. [Isolamenti di Estasi e confronti con Piera](sb-21/giro-1/isolamenti-estasi.json).

### Grappa con Estasi a 18

Beppe parte dallo starter senza Estasi. In Beppe e Piera ho ripreso gli scambi di SB-19. In Mara ho sostituito due Espresso del distributore. Per Piera con Mezza minerale il controllo contiene già due Mezza al posto di Fasciatura col fazzolettaccio e Grab. Su entrambi i controlli di Piera Grappa sostituisce due Peroni da 66, calda. [Scambi](sb-21/giro-1/prepara.py).

| Grappa (L) | Beppe, media / massimo | Mara, media / massimo | Piera, media / massimo | Piera con Mezza, media / massimo |
|---:|---:|---:|---:|---:|
| +25 | +11,34 / +18,24 | −0,89 / +4,58 | +0,72 / +5,39 | +1,54 / +3,30 |
| +20 | +11,36 / +18,24 | −0,93 / +4,58 | +0,19 / +4,69 | +1,21 / +2,92 |
| +15 | +11,36 / +18,24 | −0,93 / +4,58 | −0,47 / +3,45 | +0,46 / +2,60 |

Nessuna variante soddisfa D131. Contro Celestina, Beppe è a +18,24 con tutti e tre i valori. Fra +25 e +15, sei incontri su sette di Beppe hanno la stessa quota e il settimo si muove di +0,11 punti. In Mara la media resta negativa. La riduzione più marcata al passaggio da +25 a +15 è per Piera con Mezza contro Celestina (−2,52 punti). Grappa è assente dai sette riferimenti. [Isolamenti di Grappa](sb-21/giro-1/isolamenti-grappa.json).

## Matrice dei riferimenti e coppie di Piera

| Avversario | Prima, 18 adottato | Prova a 15 | Prova a 12 | Prova a 10 | Esito del giro, 18 |
|---|---:|---:|---:|---:|---:|
| Spazienzio | 55,88% | 48,18% | 42,03% | 37,36% | 55,88% |
| Mara | 42,18% | **29,84%** | **23,14%** | **17,53%** | 42,18% |
| Celestina | 36,82% | **24,54%** | **18,01%** | **13,46%** | 36,82% |
| Piera (lato A) | 47,20% | 48,91% | 48,70% | 49,63% | 47,20% |
| Beppe | 43,76% | **32,44%** | **24,95%** | **18,17%** | 43,76% |
| Sergio | 56,44% | 49,52% | 42,49% | 37,81% | 56,44% |
| Duccio | 45,98% | 40,90% | 35,82% | **32,22%** | 45,98% |

Quote dal lato di Piera, con le uscite dalla fascia protetta in grassetto. La matrice aggregata di consegna coincide byte per byte con quella di SB-20. Sui criteri completi risultano **5 quote fuori obiettivo su 21**, **3 durate fuori 6–12 turni su 28** e **1 incontro oltre il 10% di patte** (specchio di Celestina, 12,58%). Tra gli euristici si esaurisce il mazzo nel 13,90% dei posti giocatore. Zero turni senza mosse legali. Nel controllo separato com–com ci sono **8 quote fuori 35–65% su 21**. [Aggregati dei tre gruppi](sb-21/giro-1/matrice-starter.json) · [Tabella SB-20](sb-20-report.md#matrice-dei-sette-riferimenti) · [Celle per stile](sb-20/matrice-celle.json.gz).

## Ricerca e divario contro gli starter

Lo STOP è scattato alla selezione, quindi la ricerca del giro e gli scontri fra costruiti restano in attesa. La fotografia disponibile sullo stesso SHA-256 è quella di SB-20. Sono i migliori finalisti per quota sulle decisive contro il banco dei 26, quindi qui ricalcolati sui cinque starter. Tutti i 20 confronti osservati superano il 70%, estremo superiore del riferimento 65–70%. [Finalisti e convalide di SB-20](sb-20/ricerca-dopo-parziale.json).

| Personaggio | Quota sui cinque starter | Punti oltre 70 | Min–max nei singoli incontri | Estasi | Grappa |
|---|---:|---:|---:|---:|---:|
| Spazienzio | 93,07% | +23,07 | 90,24–95,81% | 2 | 0 |
| Mara | 99,27% | +29,27 | 98,09–100,00% | 1 | 0 |
| Celestina | 96,28% | +26,28 | 92,93–99,29% | 2 | 0 |
| Piera | 98,91% | +28,91 | 97,84–99,85% | 2 | 1 |
| Beppe | in attesa | — | — | — | — |
| Sergio | in attesa | — | — | — | — |
| Duccio | in attesa | — | — | — | — |

## Giro 2 e domanda per il proprietario

1. **Costruiti contro starter, 20 incontri sopra il 70%.** Prima leva da provare con una nuova decisione: rendere Estasi a 18 esclusiva di Piera nel playground. Estasi è presente in tutti e quattro i migliori finalisti osservati, tre dei quali sono di altri personaggi. Ripetere la ricerca su tutti e sette dopo l’applicazione e isolare le carte ricorrenti nei mazzi ancora sopra fascia.
2. **Starter di Piera, tre uscite già a 15.** Per calo osservato, proteggere prima Piera–Mara (−12,33 punti), poi Piera–Celestina (−12,28) e Piera–Beppe (−11,32). La leva di esclusività merita prima la verifica sullo starter e sulle liste costruite.
3. **Grappa.** Riprendere il caso Beppe–Celestina (+18,24 per tutti i valori) e i sette confronti di Mara a media negativa dopo la scelta su Estasi. Abbassare ancora il solo guadagno di L non è la prima leva, visti gli spostamenti di Beppe da +25 a +15.

**Domanda 1.** Vuoi provare nel giro 2 Estasi a 18 esclusiva di Piera nel playground, con matrice e ricerca sui sette personaggi?

## Riproduzione e verifiche

Per la porta, `run.ps1 -Phase feasibility` e `-Phase round` con `-Label sb21g1-rif`, `-Draft` sulla bozza di base e `-OutputRoot` su `%TEMP%/bm-sb21-g1`. Per ciascun giro, `analyze.py rif`, poi `confronta-rif.py` confrontando con il giro omonimo di SB-20. [Lanciatore](sb-19/run.ps1) · [Analisi «Rif»](sb-19/analyze.py) · [Comparatore](sb-20c/confronta-rif.py).

Sulle copie, `misura.py --shell <PowerShell>` con i sottocomandi `estasi`, `piera 15 12 10`, `grappa 18`, in serie. Il banco usa `d50`, otto thread, 12 stili per lato, seme iniziale 7.000.000. Nelle misure complete ci sono 100 semi per cella (8.100 partite euristiche, 5.400 miste e 900 com–com per coppia). Per estrarre i risultati, `analizza.py isolamenti --estasi 18` e `analizza.py starter`. Le copie, i risultati grezzi e i log stanno in `%TEMP%/bm-sb21-g1`. [Lanci del giro](sb-21/giro-1/misura.py) · [Estrazione](sb-21/giro-1/analizza.py) · [Tempi](sb-21/giro-1/tempi.json).

- `git diff --check`, `python scripts/check-links.py` e `python scripts/check-rules.py` verdi. Il diff di consegna contiene solo piano, rapporto, strumenti ed evidenze del giro.
- I due controlli D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` sono verdi. Testi stampati allineati su 116 carte e SHA-256 della bozza di base confermato.
- `./scripts/build.ps1 -Task Test -Offline` verde. Server: 947 test rilevati, 23 saltati, zero fallimenti o errori. Client di debug: 37 su 37. I log delle verifiche sono in `%TEMP%/bm-sb21-g1/verifiche`. [Esiti e impronte](sb-21/giro-1/verifiche.json).

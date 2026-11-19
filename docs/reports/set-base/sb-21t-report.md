# SB-21t — Tetto al danno di Estasi

**Nessun tetto adottato.** Entrambi i candidati falliscono la matrice di D149 (4). La bozza D149 conserva SHA-256 `1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc`, i valori e i testi stampati. Il parametro `maxDamage` è disponibile e vale 0 per difetto. D150 chiude qui la selezione e la ricerca «dopo» su Piera resta senza avvio. [D150 e D149](../../set-base-decisioni.md#decisioni-del-proprietario).

## Piera costruita e matrice degli starter

Quote percentuali sulle decisive fra euristici (D93), dal lato di Piera. Gli aggregati sommano le decisive contro sei costruiti e cinque starter. Lo specchio fra costruiti è incluso nelle evidenze del banco.

| Tetto | Spazienzio | Mara | Celestina | Beppe | Sergio | Duccio | Vs costruiti | Vs starter |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Nessuno (giro 3b) | 84,70 | 98,99 | 84,20 | 72,10 | 91,46 | 93,12 | 87,42 | 99,80 |
| 35 HIT | 84,53 | 99,10 | 82,19 | 71,74 | 91,33 | 93,09 | 87,01 | 99,89 |
| 30 HIT | 84,53 | 99,32 | 81,15 | 71,74 | 86,39 | 93,43 | 86,33 | 99,86 |

Piera vince tutti e sei gli scontri fra costruiti con entrambi i tetti. [Ingresso 3b](sb-21/giro-3b/scontri-prima.json) · [Scontri a 35 HIT](sb-21t/scontri-tetto-35.json) · [Scontri a 30 HIT](sb-21t/scontri-tetto-30.json).

| Tetto | Coppie nel 35–65% | Fuori obiettivo | Patte aggregate | Turni medi | Regressioni di fascia per coppia | Matrice D149 (4) |
|---|---:|---:|---:|---:|---:|---|
| Nessuno (giro 3b) | 21/21 | 3 | 4,224% | 8,954 | 0 | Sì, riferimento |
| 35 HIT | 21/21 | 3 | 4,222% | 8,971 | 0 | No, aumento di durata |
| 30 HIT | 21/21 | 3 | 4,293% | 8,990 | 0 | No, aumento di durata e patte |

Le tre coppie fuori obiettivo restano Mara–Beppe, Celestina–Sergio e Piera–Sergio. Il controllo riprende la soglia del giro 3b e richiede anche patte e durata aggregate senza peggioramenti. Gli isolamenti di Estasi di D148 restano quelli della bozza D149, documentati nel giro 3b. [Matrice 35](sb-21t/matrice-tetto-35.json) · [Controllo 35](sb-21t/verifica-starter-tetto-35.json) · [Matrice 30](sb-21t/matrice-tetto-30.json) · [Controllo 30](sb-21t/verifica-starter-tetto-30.json) · [Rapporto 3b](sb-21-giro-3b-report.md).

## Modifica e verifiche

- Estasi legge la L residua alla risoluzione, la spende tutta e applica il tetto al danno grezzo verso il bersaglio, prima di stati e corazza. I bot limitano l’importo dopo le componenti variabili del passo. Il testo generato indica il massimo solo se configurato. L’ultimo giro conserva danno, contraccolpo e Rincara (test dedicato).
- Sei casi mirati verificano parametro omesso, zero, formula sotto o pari al tetto e picchi limitati a 35 e 30 HIT nel motore, in `TurnForecast` e in `ViewTable`. Il test legge anche il passo stampato e controlla la spesa della L. Gli attesi esistenti sono invariati.
- Identità viva 1.13. JSON e Markdown delle 480.000 partite identici byte per byte alla base storica locale. Fixture e percorso sono quelli di `ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, in `%TEMP%/bm-sb16g2b2-live`. Tempo 88,04 s, fuori dal budget di misura. [Impronte](sb-21t/identita-viva.json).
- Passo 0 con il codice nuovo e la bozza D149. Fattibilità (16.128 partite) e «Rif» (403.200) identici byte per byte a `sb21g3b-rif`, inclusi matrice, osservazioni dei mazzi, bozza serializzata, `in-play.json` e i due riepiloghi del «Rif». Zero violazioni e zero bound oltre il tetto. [Impronte](sb-21t/passo-0.json).

- Tre mutazioni rilevate su tre. Togliere il tetto dal motore, da `TurnForecast` o da `ViewTable` fa fallire i due casi sopra il limite nel test mirato. [Esiti](sb-21t/mutazioni.json).
- `Test -Offline` verde con 956 test server scoperti, 23 saltati, zero fallimenti ed errori, e 37/37 test del client di debug.
- Fedeltà verde nei sei bracci (A, B, 1.6, Sergio, Duccio e malus). `TurnForecastFidelityTest` coincide in 37.768/37.768 confronti, con 459 turni con timer saltati come da test. `ViewTableFidelityTest` coincide in 38.686/38.686 confronti a un turno e in 22.394/22.394 a due turni per salute e risorse. Le esclusioni previste per gli oggetti arrivati o spostati con le pescate e per gli oggetti lontani non modellati sono dichiarate per braccio in `test-offline.log`.
- `git diff --check`, `check-links.py` (440 file, zero link rotti), `check-rules.py`, numeri e testi D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` verdi. I due controlli D143 sono verdi anche su entrambe le copie di misura.
- `TestServerContext -Offline` verde con 1.074 test rilevati, 23 saltati, zero fallimenti ed errori, incluso `BozzaProfileOffContextTest` (6/6). Il controllo dei manifest riporta `allChecks: PASS`. I log sono in `%TEMP%/bm-sb21t`.

## Metodo e riproduzione

- Per ciascun tetto sono state giocate 403.200 partite fra i sette riferimenti e 907.200 nei 63 incroci dei sette finalisti fra loro e contro i cinque starter. Stesso banco del giro 3b, otto thread, 12 stili per lato e 100 semi per cella da 7.000.000, con alternanza del primo posto. Tutti e quattro i lanci hanno zero violazioni e zero bound oltre il tetto. [Impronte delle copie](sb-21t/copie.json) · [Tempi](sb-21t/tempi.json).
- Usati 867,29 s su 3.000, compresi fattibilità e passo 0. Grezzi e log in `%TEMP%/bm-sb21t`. Per il passo 0 lanciare `sb-19/run.ps1` con il percorso assoluto della bozza D149, `-Label sb21g3b-rif`, in sequenza con `-Phase feasibility` e `-Phase round`, poi `sb-19/analyze.py rif`. Per le varianti lanciare `python -B -X utf8 docs/reports/set-base/sb-21t/misura.py --shell <PowerShell> 35`, poi lo stesso comando con `30`. Le analisi richiamano i controlli del giro 3b. [Lanciatore](sb-19/run.ps1) · [Procedura SB-21t](sb-21t/misura.py).

## Consegna a SB-22

Dopo SB-20c B2, usare tutti e sette i finalisti del giro 3b con la bozza D149. Nella prima prova umana, Piera contro Beppe e Duccio e almeno uno starter. SB-22 include il controllo FFA. [Liste finaliste](sb-21/giro-3b/ricerca-prima.json).

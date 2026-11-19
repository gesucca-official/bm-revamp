# SB-21 — Giro 3b, mazzi costruiti

**STOP per il proprietario.** Ricerca completa sui sette personaggi, scontri diretti e 18 isolamenti conclusi. Tutti i 35 incroci costruito–starter superano il 70% e Piera vince contro tutti gli altri finalisti. Le tre passate numeriche sono scartate per D149. La bozza consegnata è quella dell’ingresso `5a57b58`, SHA-256 `1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc`.

## Porta e misure

- Fattibilità superata con 16.128 partite in 11,54 s. Il «Rif» completo ha ripetuto 403.200 partite in 137,34 s. Zero violazioni e nessuna bound oltre il tetto. [Fattibilità](sb-21/giro-3b/fattibilita.json).
- I sei file confrontati dal comparatore e la copia serializzata della bozza sono identici al finale di 3a-bis, al netto dei campi di provenienza del comparatore. La matrice iniziale è quindi quella di D149, con 21 coppie su 21 nel 35–65% e tre fuori obiettivo. [Identità](sb-21/giro-3b/identita-round.json) · [Matrice](sb-21/giro-3b/matrice-rif.json).
- Ricerca «dopo» completa per i sette personaggi in 4.051 s, un personaggio per chiamata. Completati i 63 incroci diretti in 239,92 s, con 907.200 partite, zero violazioni e nessuna bound oltre il tetto. [Ricerca e liste](sb-21/giro-3b/ricerca-prima.json). Il budget D148 di 9.000 s include porta, ricerca, scontri e isolamenti. [Tempi](sb-21/giro-3b/tempi.json).

## Metodo

La ricerca riprende il banco dei 26 mazzi e i parametri di SB-20. Due partenze per personaggio, dal riferimento e da un mazzo casuale, con tre stili euristici, 12 mutanti, 16 partite per combinazione, 25 generazioni al massimo, pazienza 10 e convalida a 300 partite per combinazione. Semi 7.100.000, 7.900.000 e 7.000.007 rispettivamente per ricerca, convalida e mutazione. Il miglior costruito per personaggio è il finalista con la maggiore quota sulle decisive sui 26 mazzi, fra gli «ultimi» e i «precedenti» di entrambe le partenze. [SB-20](sb-20-report.md#ricerca-dopo-e-scontri-fra-costruiti).

Le partite dirette usano il banco del «Rif», con seme iniziale 7.000.000, otto thread, 12 stili per lato, 100 semi per cella e alternanza del primo posto per seme. I criteri valgono fra euristici (D93). La misura di divario è la media dei punti sopra il 70% nei 35 confronti costruito–starter, contando zero quando un confronto è in fascia. Il rapporto conserva anche il massimo e il numero di incontri oltre il 70%. [Criteri](../../set-base-plan.md#bilanciamento-metodo-e-criteri).

## Ricerca e scontri prima e dopo

Le quote dirette di ingresso e consegna coincidono per tutti e sette, perché la bozza e le liste finaliste di ingresso sono quelle consegnate. Gli «ultimi» delle due partenze e il finalista scelto sono valutati sui 26 mazzi di ricerca. Le due colonne dirette aggregano le decisive contro cinque starter e sei costruiti. Gli specchi sono misurati e consultabili nell’evidenza.

| Personaggio | Ultimo, riferimento | Ultimo, casuale | Scelto, quota | Vs starter | Vs costruiti | Scontri costruiti sfavorevoli |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Spazienzio | 84,29% | 88,85% | casuale / 88,85% | 87,14% | 23,43% | Celestina, Piera, Beppe, Sergio, Duccio |
| Mara | 92,11% | 84,36% | starter / 92,11% | 93,04% | 19,30% | Spazienzio, Celestina, Piera, Beppe, Sergio, Duccio |
| Celestina | 95,80% | 92,07% | starter / 95,80% | 96,02% | 49,76% | Piera, Duccio |
| Piera | 99,84% | 94,48% | starter / 99,84% | 99,80% | 87,42% | Nessuno |
| Beppe | 96,14% | 96,68% | casuale / 96,68% | 96,83% | 52,97% | Celestina, Piera, Sergio, Duccio |
| Sergio | 98,35% | 97,43% | starter / 98,35% | 98,41% | 58,51% | Celestina, Piera, Duccio |
| Duccio | 98,72% | 99,27% | casuale / 99,27% | 98,93% | 60,14% | Piera |

I 35 incontri costruito–starter superano il 70% con gli euristici (83,20–100%). L’eccesso medio oltre il 70% è +25,73 punti. Piera vince tutti e sei gli scontri fra costruiti, dal 72,10% contro Beppe al 98,99% contro Mara. Duccio perde solo contro Piera. Il criterio di assenza di dominio è fuori già per Piera. [Coppie e invarianti](sb-21/giro-3b/scontri-prima.json) · [Stili](sb-21/giro-3b/stili-prima.json).

Il controllo casuale sotto filtro letale conserva 25 incroci costruito–starter sopra il 70%, con quota media del 75,53% contro il 95,73% euristico. Piera supera il 65% contro tutti i costruiti anche in com–com (65,63–91,49%). Il divario ha quindi una componente che resiste al cambio di stile e una che cresce usando le euristiche. La misura riguarda i bot del banco. [Coppie](sb-21/giro-3b/scontri-prima.json).

## Carte ricorrenti

Presenze fra le 20 regolari dei sette finalisti, con le copie totali. Le liste con tutte le carte, bound e last resort sono nell’evidenza della ricerca. Le azioni registrate dal banco sono scelte di mossa. Per gli oggetti il dato di scelta non conta i consumi, che possono passare da un’altra carta.

| Carta | Finalisti su 7 | Copie totali | Scelta almeno una volta, se in lista, vs starter |
| --- | ---: | ---: | ---: |
| Estasi da Coca Etilene | 7 | 11 | 86,55% |
| Espresso del distributore | 6 | 9 | — |
| Lo sanno tutti | 5 | 8 | 79,45% |
| Spintone | 5 | 5 | 46,36% |
| Santino della portinaia | 5 | 6 | — |
| Sgommata | 5 | 7 | 78,96% |
| Secondo fiato | 4 | 4 | 34,54% |
| Ghiaccio nel tovagliolo | 4 | 5 | — |
| Grappa della casa | 4 | 5 | — |
| Mezza minerale sgasata | 4 | 7 | — |

Estasi è una scelta in tutte le partite osservate del costruito di Piera fra euristici, a fronte di una sola copia nella lista. La ricorrenza da sola misura la composizione dei mazzi. Gli scambi con due copie stimano il contributo sul singolo riferimento, a parità di avversari, stili, lato e semi. [Frequenze complete](sb-21/giro-3b/ricerca-prima.json) · [Scelte](sb-21/giro-3b/uso-prima.json) · [Scambi](sb-21/giro-3b/scambi.json).

Isolati tutti e dieci i titoli che ricorrono nella maggioranza dei finalisti, più Mescolone nel riferimento di Piera e Conto nello scambio storico di Spazienzio. Sono 18 scambi, sempre con due copie di un solo titolo. La media considera i sette riferimenti con peso uguale. Il riferimento per il proprio specchio è il 50%. Il grassetto indica uno sforamento alto (+10 in media, +15 per singolo incontro).

| Carta e riferimento | Due copie tolte | Media pp | Massimo pp e avversario | Media com–com pp |
|---|---|---:|---|---:|
| Estasi da Coca Etilene in Spazienzio | GABBIANO DUNQUE VOLIAMOTI ×2 | +2,71 | +7,64 vs Sergio | +2,64 |
| Estasi da Coca Etilene in Mara | Sputo da posacenere ×2 | +5,39 | +9,47 vs Piera | −2,23 |
| Estasi da Coca Etilene in Beppe | Chiave da tredici ×2 | −17,13 | −5,33 vs Duccio | −16,45 |
| Grappa della casa in Mara | Espresso del distributore ×2 | −1,28 | +3,44 vs Duccio | −8,79 |
| Grappa della casa in Piera | Peroni da 66, calda ×2 | +0,49 | +5,42 vs Celestina | +1,77 |
| Grappa della casa in Beppe | Espresso del distributore ×1, Una stretta di prova ×1 | +8,22 | +12,75 vs Duccio | −1,94 |
| Espresso del distributore in Celestina | Pasticca trovata sul bancone ×2 | −5,84 | −0,86 vs Spazienzio | −2,51 |
| Lo sanno tutti in Mara | Sorpasso in curva ×2 | **+13,45** | **+24,96** vs Beppe | +7,57 |
| Spintone in Celestina | Grab ×2 | +4,55 | +11,68 vs Mara | +4,91 |
| Santino della portinaia in Mara | Panino del kebab dimenticato ×2 | +2,69 | +6,47 vs Piera | −1,90 |
| Santino della portinaia in Piera | Spintone ×2 | +2,71 | +8,02 vs Piera | +12,52 |
| Sgommata in Spazienzio | GABBIANO DUNQUE VOLIAMOTI ×2 | **+14,85** | **+20,49** vs Celestina | +7,96 |
| Sgommata in Celestina | Tossicone Scatarrante ×2 | −0,04 | **+16,68** vs Duccio | +7,96 |
| Secondo fiato in Mara | Panino del kebab dimenticato ×2 | +9,07 | **+16,63** vs Piera | −0,39 |
| Ghiaccio nel tovagliolo in Spazienzio | Tartaruga sul marciapiede ×2 | +9,65 | **+18,52** vs Celestina | +7,50 |
| Mezza minerale sgasata in Piera | Fasciatura col fazzolettaccio ×1, Grab ×1 | +2,57 | +9,84 vs Celestina | −5,06 |
| Mescolone Micidiale in Piera | Peroni da 66, calda ×2 | −1,92 | −0,62 vs Duccio | +13,63 |
| Conto del tavolo sei in Spazienzio | Negroni Trovato per Terra ×2 | +3,53 | +6,62 vs Celestina | +10,93 |

Estasi rispetta il limite superiore di D148 in tutti e tre gli scambi. In Beppe rende meno di Chiave da tredici, come ammette D148. Grappa rientra nella banda alta in tutte e tre le prove della bozza D149. In Piera l’isolamento di Santino guadagna solo +2,71 fra euristici, ma +12,52 in com–com. Mescolone ha il segno opposto fra euristici e com–com. Questi scambi misurano il contributo marginale nel riferimento, dove pescate, risorse e compagni di carta restano quelli della lista di controllo. [Dettaglio per avversario](sb-21/giro-3b/isolamenti-prima.json).

## Passate numeriche

Tre prove distinte, tutte a partire dalla bozza d’ingresso. D143 verde su tutte le copie temporanee. La verifica D149 esige 21 coppie nel 35–65%, al più tre fuori obiettivo e nessuna nuova uscita o allontanamento dalle fasce di durata e patte, come nel 3a-bis. Ho verificato anche che le due medie aggregate non peggiorassero.

| Passata | Valore provato | Esito sui riferimenti |
|---|---|---|
| 1 | Lo sanno tutti, 24 → 20 HIT | Scartata. Celestina–Sergio sale dal 60,36% al 74,85% e Piera–Sergio dal 62,92% al 75,46%. Quattro coppie fuori obiettivo. Piera–Sergio sale a 12,33 turni e lo specchio di Sergio a 14,91. [Verifica](sb-21/giro-3b/verifica-starter-passata-1.json) · [Matrice](sb-21/giro-3b/matrice-passata-1.json). |
| 2 | Sgommata, 25 → 21 CUT | Scartata. Mara–Beppe scende dal 36,78% al 27,90% e Mara–Sergio dal 41,92% al 33,92%. Cinque coppie fuori obiettivo. Peggiorano entrambe le medie aggregate. [Verifica](sb-21/giro-3b/verifica-starter-passata-2.json) · [Matrice](sb-21/giro-3b/matrice-passata-2.json). |
| 3 | Ghiaccio nel tovagliolo, +10 → +7 H | Scartata. Tutte le coppie nel 35–65%, tre fuori obiettivo, patte e durata aggregate in lieve calo. Beppe–Duccio, già sotto il minimo di 6 turni, scende da 5,8969 a 5,8763. È la sola regressione alla verifica per coppia. [Verifica](sb-21/giro-3b/verifica-starter-passata-3.json) · [Matrice](sb-21/giro-3b/matrice-passata-3.json). |

La matrice dei riferimenti è stata la prima condizione di ritenzione. Gli scontri diretti sulle passate scartate e le ricerche successive a una passata tenuta restano senza misure. La consegna conserva la bozza D149 con lo stesso SHA-256, perciò il divario finale resta +25,73 punti sopra il 70% e restano le stesse frequenze. Budget usato 5.424,09 s su 9.000. Il limite raggiunto è quello delle tre passate. [Tempi](sb-21/giro-3b/tempi.json).

## Matrice di consegna e criteri

Quote fra euristici sulle decisive dal lato del personaggio di riga. Il grassetto indica le tre coppie fuori obiettivo. I dati per abbinamenti con stili misti e com–com sono nella matrice. [Matrice D149 riprodotta](sb-21/giro-3b/matrice-rif.json).

| | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
|---|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 55,12 | 46,42 | 47,56 | 42,48 | 50,69 | 43,90 | 44,73 |
| Mara | — | 47,67 | 59,93 | 49,44 | **36,78** | 41,92 | 59,76 |
| Celestina | — | — | 46,65 | 55,49 | 41,65 | **60,36** | 40,89 |
| Piera | — | — | — | 47,74 | 45,36 | **62,92** | 54,77 |
| Beppe | — | — | — | — | 50,16 | 50,06 | 41,30 |
| Sergio | — | — | — | — | — | 46,39 | 55,72 |
| Duccio | — | — | — | — | — | — | 54,62 |

- **Riferimenti.** D149 è rispettata in consegna. 21/21 coppie nel 35–65%, Spazienzio–Mara in 45–55% e 17/20 altre coppie in 40–60%. Patte aggregate 4,22%, con lo specchio Celestina al 10,84%. Durata aggregata 8,954 turni, fuori dai 6–12 per Celestina–Celestina (13,76), Beppe–Duccio (5,90) e Sergio–Sergio (13,71). Sei coppie com–com fuori dal 35–65%. I tre isolamenti di Estasi rispettano il limite superiore di D148.
- **Costruiti contro starter.** Tutti e 35 fuori dal riferimento 65–70%. Durata media 6,803 turni, con 9/35 fuori dai 6–12. Patte medie 1,20%, senza incontri sopra il 10%. Il 18,05% dei posti esaurisce il mazzo.
- **Costruiti fra loro.** Piera senza incroci sfavorevoli, con un vantaggio di 27,28 punti nella quota aggregata sul secondo, Duccio. Il vertice richiesto di 3–4 personaggi non emerge. Durata media 7,149 turni, con 13/28 incroci fuori dai 6–12, specchi compresi. Patte medie 14,30%, 14/28 sopra il 10% come dato descrittivo. Mazzo esaurito nel 37,41% dei posti contro il 14,55% fra riferimenti. Gli incroci diretti hanno zero turni senza mosse legali.
- **Uso delle carte.** Estasi compare in tutti e sette i finalisti ed è quasi sistematica in alcune liste. Sgommata e Lo sanno tutti sono scelte frequenti e superano i limiti alti in alcuni scambi. La banda 0 / +10, massimo +15, dipende dalla sostituzione. La tabella mostra anche gli scambi che indeboliscono il riferimento. Gli oggetti consumati e il gioco umano restano punti da verificare.

## Quadro per la decisione

Le liste ottimizzate si separano nettamente dagli starter anche con i casuali. Gli euristici amplificano lo scarto di circa 20 punti di media contro gli starter, confermando che la prestazione dipende anche da come il banco usa le carte. Piera resta davanti con ogni raggruppamento di stili. Estasi suggerisce una dipendenza dalla combinazione del mazzo. A due copie negli starter ha un rendimento molto diverso secondo la lista, mentre nella Piera ottimizzata viene scelta in tutte le partite euristiche osservate. La lista combina Estasi con doppie copie di Amaro, Grappa, Mescolone e Santino. Il giro distingue gli effetti dei singoli scambi dalla forza della lista completa, ma non attribuisce quote causali alle interazioni o alla debolezza delle risposte del bot.

**Proposte al proprietario.** La leva prioritaria è una prova sulla coda alta di Estasi, per esempio un tetto sperimentale a 35 HIT con la formula D149 per i valori inferiori. L’obiettivo sarebbe ridurre i picchi dei costruiti e misurare di nuovo tanto Piera quanto i riferimenti. Il valore D149 resta quello di consegna. Per Secondo fiato (+12, D132) l’unico superamento alto in questa prova è +16,63 contro Piera nello scambio in Mara, con media +9,07. Lo porterei alla prova umana prima di riaprire il valore. Mezza minerale, Conto e i tre isolamenti di Estasi restano entro i rispettivi limiti alti applicabili. Il risultato di Conto riguarda il solo scambio storico in Spazienzio.

1. Vuoi usare in SB-22 le sette liste consegnate e partire dalla Piera costruita contro Duccio, Beppe e almeno uno starter?
2. Vuoi aprire una prova separata sul tetto di Estasi, subordinata a D149, dopo il confronto umano?

## Riproduzione e verifiche

- Grezzi, copie di prova e log in `%TEMP%/bm-sb21-g3b`. Lanciare da radice `run.ps1` con `-Draft` assoluto della bozza, `-Label sb21g3b-rif`, `-OutputRoot` nell’area temporanea e fasi `feasibility` e `round` in sequenza. Generare i due riepiloghi `rif` con `analyze.py rif`, quello di questo giro e quello di `%TEMP%/bm-sb21-g3abis/round-sb21g3abis-finale`. Confrontare con `confronta-rif.py` e verificare anche `draft.json` come nell’impronta. [Lanciatore](sb-19/run.ps1) · [Analisi](sb-19/analyze.py) · [Comparatore](sb-20c/confronta-rif.py).
- Avviare `misura.py --shell (Get-Process -Id $PID).Path ricerca prima spazienzio mara celestina piera beppe sergio duccio`. Seguire con `riepiloga.py finalisti prima` e il `round diretti-prima` di `misura.py` su `costruiti-prima.json`, con righe dei sette costruiti e avversari i sette costruiti seguiti dai cinque starter. Le stringhe esatte sono nei marcatori. Il valore 1.200 s dei marcatori di ricerca è un metadato storico di SB-19. Il supervisore del giro applica il limite cumulativo di 9.000 s. Generare i riepiloghi con `riepiloga.py scontri prima diretti-prima`. [Lancio](sb-21/giro-3b/misura.py) · [Analisi](sb-21/giro-3b/riepiloga.py) · [Marcatori e tempi](sb-21/giro-3b/tempi.json).
- Generare gli scambi con il sottocomando `misura-iso prima <scambi.json> rif --shell <PowerShell>` di `riepiloga.py`. Lo script mantiene lo slot del riferimento su ogni seme. Per i tre candidati su copie temporanee applicare solo i numeri in tabella, rigenerare i testi, eseguire D143, poi `misura.py --bozza <copia> --shell <PowerShell> round riferimenti-passata-N` e `riepiloga.py starter passata-N riferimenti-passata-N`. Per il confronto serve la matrice di entrata prodotta con `riepiloga.py starter rif rif`. [Scambi](sb-21/giro-3b/scambi.json).
- Tutte le verifiche richieste sono verdi. `git diff --check`, `check-links.py` (438 documenti, zero link rotti), `check-rules.py`, entrambi i controlli D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check`. D143 è verde anche su tutte le copie di prova. La suite `./scripts/build.ps1 -Task Test -Offline` è stata eseguita a misure concluse. Server 950 test rilevati, 23 saltati, zero fallimenti ed errori. Client di debug 37/37. Log `%TEMP%/bm-sb21-g3b/test-offline.log`. Verifica separata del contesto Spring e prova umana restano fuori dal giro. Attesi e dati consegnati coincidono con l’ingresso.

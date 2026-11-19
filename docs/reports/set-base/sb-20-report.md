# SB-20 — Prima misura dell’intero set

**STOP 4, budget esaurito.** Porta superata e matrice degli starter completa. Ricerca «dopo» conclusa per quattro personaggi su sette. Il limite di 4.000 s ha fermato il secondo lancio. Misura sulla bozza a HEAD `1ebfff2`, D143, con 116 carte e sette personaggi. D144 rimanda nomi, flavour, illustrazioni e rarità P a SB-24.

## Porta e avanzamento

- **Diagnosi.** Checkout pulito prima della misura, `git fetch` eseguito, `main` cinque commit avanti e zero indietro rispetto a `origin/main`. Nessun processo Java attivo all’avvio. La bozza a HEAD ha lo SHA-256 `26767a506e0a197c319fe7571b6e0f8652c9fdeec11075cfaac8c9708a8c17a3` della consegna SB-20c B1. Il `draft.json` archiviato dal banco è una riserializzazione compatta con lo stesso contenuto JSON.
- **Porta.** `run.ps1` con etichetta `sb20-rif`, d50, seme iniziale 7.000.000 e 8 thread. Fattibilità, 4 semi per cella, 16.128 partite in 11,36 s. «Rif», 100 semi per cella, 403.200 partite in 124,21 s. Le sei uscite coincidono byte per byte con la consegna SB-20c B1 in entrambi i giri, col confronto previsto che neutralizza i due campi di provenienza. Zero violazioni e zero bound oltre il tetto. [Fattibilità](sb-20/identita-feasibility.json), [«Rif»](sb-20/identita-round.json), [procedura di confronto](sb-20c-b1-report.md#evidenze-e-riproduzione-del-rif).

## Matrice dei sette riferimenti

Cinque starter e i due mazzi di riferimento di Sergio e Duccio, 28 coppie con specchi. Per ogni coppia 8.100 partite fra euristici, 900 fra `com`, 5.400 miste. Le quote contano le sole decisive, dal lato del primo nominato. Patte e durata media contano tutte le partite del gruppo. «Esauriti» conta i posti giocatore il cui mazzo si svuota almeno una volta, anche sul turno finale. La quota negli specchi è del lato A della matrice. [Aggregati e invarianti](sb-20/matrice-starter.json).

| Incontro | Euristici | Patte | Turni | Esauriti | com–com | Fuori obiettivo |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 55,12% | 3,67% | 8,76 | 6,29% | 56,97% | — |
| Spazienzio–Mara | 43,98% | 3,67% | 9,00 | 10,42% | 57,45% | quota |
| Spazienzio–Celestina | 42,05% | 4,59% | 9,67 | 9,55% | 63,23% | — |
| Spazienzio–Piera | 44,12% | 2,04% | 8,89 | 8,81% | 71,12% | com |
| Spazienzio–Beppe | 50,69% | 1,36% | 7,51 | 8,57% | 78,85% | com |
| Spazienzio–Sergio | 43,90% | 3,06% | 10,35 | 17,26% | 55,29% | — |
| Spazienzio–Duccio | 44,73% | 1,94% | 6,59 | 0,72% | 39,75% | — |
| Mara–Mara | 48,58% | 5,16% | 9,46 | 16,76% | 52,71% | — |
| Mara–Celestina | 50,23% | 6,98% | 9,95 | 18,94% | 54,45% | — |
| Mara–Piera | 57,82% | 5,54% | 8,99 | 12,25% | 68,67% | com |
| Mara–Beppe | 39,58% | 2,21% | 7,64 | 7,64% | 69,74% | quota, com |
| Mara–Sergio | 43,54% | 1,65% | 11,01 | 26,04% | 43,87% | — |
| Mara–Duccio | 61,98% | 2,37% | 6,84 | 2,33% | 39,18% | quota |
| Celestina–Celestina | 45,50% | 12,58% | 14,31 | 63,43% | 53,67% | patte, durata |
| Celestina–Piera | 63,18% | 6,95% | 10,19 | 18,02% | 57,33% | quota |
| Celestina–Beppe | 49,22% | 8,43% | 8,77 | 15,44% | 60,70% | — |
| Celestina–Sergio | 68,82% | 5,01% | 10,66 | 17,17% | 65,77% | quota, com |
| Celestina–Duccio | 47,55% | 6,60% | 7,09 | 1,35% | 42,77% | — |
| Piera–Piera | 47,20% | 6,47% | 9,88 | 19,49% | 47,69% | — |
| Piera–Beppe | 43,76% | 0,58% | 7,54 | 5,32% | 58,75% | — |
| Piera–Sergio | 56,44% | 2,98% | 11,27 | 31,22% | 36,18% | — |
| Piera–Duccio | 45,98% | 3,44% | 7,03 | 1,38% | 31,83% | com |
| Beppe–Beppe | 50,16% | 9,26% | 6,34 | 0,30% | 38,69% | — |
| Beppe–Sergio | 50,06% | 2,22% | 8,86 | 19,86% | 21,62% | com |
| Beppe–Duccio | 41,30% | 0,93% | 5,90 | 2,72% | 24,43% | durata, com |
| Sergio–Sergio | 46,39% | 1,07% | 13,71 | 44,48% | 46,53% | durata |
| Sergio–Duccio | 55,72% | 3,38% | 8,28 | 3,44% | 59,41% | — |
| Duccio–Duccio | 54,62% | 7,33% | 6,25 | 0,04% | 49,60% | — |

Cinque quote fuori fascia su 21 incontri senza specchio. Celestina–Sergio (68,82%) è anche oltre il precedente limite D95 del 65%. Il solo incontro sopra il 10% di patte è lo specchio di Celestina (12,58%, già registrato in D131). La durata esce dalla fascia indicativa in tre incontri su 28, due specchi lunghi e Beppe–Duccio a 5,90 turni. Nel controllo com–com, otto incontri su 21 fuori 35–65%. I più sbilanciati sono Spazienzio–Beppe (78,85%), Beppe–Sergio (21,62%) e Beppe–Duccio (24,43%). [Criteri e controllo D93](../../set-base-plan.md#bilanciamento-metodo-e-criteri).

Zero turni senza mosse legali nei 7.509.656 turni giocatore di tutti gli stili. I mazzi esauriti fra euristici sono 63.064 posti su 453.600 (13,90%), concentrati soprattutto negli specchi di Celestina (63,43%) e Sergio (44,48%) e in Sergio–Piera (31,22%). D93 mantiene le celle per ogni coppia di stili, incluse le miste, nell’[archivio della matrice](sb-20/matrice-celle.json.gz).

## Ricerca «dopo» e scontri fra costruiti

Due lanci sequenziali come in SB-19, prima Spazienzio, Mara, Celestina e Piera, poi Beppe, Sergio e Duccio. La bozza contiene i 26 mazzi del banco completo. Per ogni personaggio si parte dallo starter o riferimento e da un mazzo casuale. La ricerca usa i tre stili euristici del lanciatore, 12 mutanti, 16 partite per combinazione, massimo 25 generazioni con pazienza 10, e convalida con 300 partite per combinazione. Semi di ricerca, convalida e mutazione rispettivamente 7.100.000, 7.900.000 e 7.000.007. La tabella riporta gli «ultimi» con lo stesso criterio di SB-19 R4. Per gli scontri diretti si sceglie, per ciascun personaggio, il finalista con quota sulle decisive più alta contro tutto il banco, fra le due partenze. Primo lancio concluso in 2.202,05 s. Estasi in otto «ultimi» su otto, massimi sugli starter fra 94,6% e 100%. [Lanciatore SB-19](sb-19/search.ps1) e [R4](sb-19-b2-report.md#r4-ricerca-dopo-passo-3-parziale-budget-superato).

| Personaggio | Partenza | Quota sui 26 | Quota sui 7 riferimenti | Massimo sui 5 starter | Copie Estasi | Copie Grappa |
|---|---|---:|---:|---:|---:|---:|
| Spazienzio | starter | 93,44% | 92,96% | 95,31% | 2 | 0 |
| Spazienzio | casuale | 93,67% | 93,41% | 96,07% | 2 | 0 |
| Mara | starter | 98,85% | 98,57% | 100,00% | 1 | 0 |
| Mara | casuale | 90,58% | 89,17% | 94,57% | 2 | 1 |
| Celestina | starter | 96,01% | 94,82% | 97,87% | 2 | 0 |
| Celestina | casuale | 95,95% | 95,17% | 96,62% | 2 | 0 |
| Piera | starter | 99,08% | 99,07% | 99,85% | 2 | 1 |
| Piera | casuale | 96,44% | 96,63% | 98,03% | 1 | 2 |

Per i quattro personaggi completati, il finalista con quota più alta sui 26 supera il 70% in **20 confronti su 20** con i cinque starter. Le quote aggregate sui cinque sono 93,07% per Spazienzio, 99,27% per Mara, 96,28% per Celestina e 98,91% per Piera. Il finalista migliore è un «precedente» per i primi tre e l’«ultimo» per Piera. Estasi entra in tutti e quattro, Grappa in quello di Piera. La convalida usa semi disgiunti, ma gli stessi tipi di bot e lo stesso banco della selezione. [Liste, generazioni e convalide per avversario](sb-20/ricerca-dopo-parziale.json).

La seconda tranche è stata interrotta al limite, dopo circa 1.661,92 s. Il lanciatore scrive i risultati solo dopo aver terminato l’intera tranche. Restano senza esito Beppe, Sergio e Duccio. La matrice diretta fra i costruiti, l’assenza di dominio e il numero di personaggi al vertice restano da verificare. [Tempi](sb-20/budget.json).

## Uso delle carte, lettura parziale sul «Rif»

Il contatore misura la scelta della carta dalla mano. La percentuale usa le partite del posto giocatore con la carta in lista o fra le mosse iniziali. Per distinguere le occasioni d’uso è riportata anche la quota di turni in mano in cui il bot la sceglie. L’estrazione riguarda 96 carte su 116 presenti nei sette riferimenti, tra cui 14 senza turni in mano osservati. Gli oggetti messi in campo alla pesca possono uscire da questo contatore, quindi lo zero di un oggetto come Espresso nel «Rif» misura l’assenza di scelte dalla mano. [Conteggi per carta e mazzo](sb-20/uso-starter.json) e [estrattore](sb-20/analisi.py).

- **Quasi sempre, soglia descrittiva ≥80% delle partite.** Chiave da tredici 97,66%, Estasi 95,61%, Ago Marcio e Spezzato 94,69%, Lo sanno tutti 91,25%, Tossicone Scatarrante 89,33%, Preparo il lavoro 89,03%, Sgommata 86,91%, Desiderio Incontrollabile 85,87%, SVEGLIAMOCI MA TU NO 82,61%, Sorpasso in curva 80,60% e Spallata al bancone 80,56%. Estasi è scelta 1,64 volte per partita di Piera e nell’85,93% dei suoi turni in mano.
- **Quasi mai, soglia descrittiva ≤5% e almeno un turno in mano.** Steal e Smontiamo tutto 0,00% a due decimali, Due dita in gola 0,78%, Alzo la voce 1,43%, Una stretta e passa 3,77%. Ne ho prese di peggio è rara per disponibilità. Il bot la sceglie in tutti i 12 turni in mano osservati (0,02% delle partite).
- **Grappa della casa.** Assente dalle liste del «Rif» e presente in tre «ultimi» su otto, uno di Mara e due di Piera. Dato di composizione. Restano da misurare le giocate nei costruiti e da ripetere l’isolamento di Grappa su D143. [Isolamento SB-19](sb-19/evidence/iso-summary.md).

## Ingresso e verifiche rimaste aperte

- **D131, banda 0/+10 punti di media, massimo +15.** Diagnosi parziale sui quattro migliori della ricerca, confrontati con la convalida del relativo starter sugli stessi avversari e semi. Media e massimo dei sette confronti rispettivamente Spazienzio +47,97 / +56,30, Mara +47,53 / +63,46, Celestina +42,12 / +55,51, Piera +51,79 / +62,81. Tutti i **28 confronti su 28** sopra +15. Qui lo starter contro se stesso usa la quota osservata della convalida, mentre il metodo dei giri dedicati usa 50%. Questo riscontro riguarda quattro liste ottimizzate. Il giro D131 sul resto del set, inclusi i mazzi con singole aggiunte, resta aperto.
- **D132, Mano lesta e Coccio di bottiglia.** Rimane la lettura di limite dei bot. In SB-19 Mano lesta era giocata 0,12 volte per partita nel caso segnalato, con esito identico per Coccio a ×1,5, ×2 e ×2,5. Le carte sono fuori dai sette riferimenti di questo giro. Restano da osservare negli altri mazzi con le aggiunte e da separare dai problemi di potenza. Resta aperta anche la lettura di Mezza minerale nel mazzo di Piera con Grappa. [Decisioni D131, D132 e D136](../../set-base-decisioni.md#decisioni-del-proprietario).
- **D134, Sergio.** Conto e Sigaretta sono nel pool ai valori M1. Il banco di ricerca include i due vecchi mazzi della B2 senza i due Espresso. Manca la misura richiesta dei due mazzi conservando gli Espresso, e la ricerca «dopo» è parziale. [D134](../../set-base-decisioni.md#decisioni-del-proprietario).
- **FFA, non verificato.** L’ingresso del banco usa il runner a due contendenti. I test FFA del server coprono coda e ciclo di vita, quindi serve un banco di bilanciamento dedicato oppure la prova umana. [Runner](../../../server/src/test/java/com/gsc/bm/sim/SimulationRunner.java) e [test FFA](../../../server/src/test/java/com/gsc/bm/QuickFfaCliTest.java).

## Problemi e leve per SB-21

Estasi e Grappa aprono l’elenco per D136. Per le altre voci l’ordine segue il numero di confronti coinvolti. Le ricorrenze nei mazzi guidano gli isolamenti e i conteggi degli incontri indicano la portata osservata.

| Ordine | Problema e misura | Prima leva |
|---|---|---|
| 1 | **Estasi.** Otto «ultimi» su otto, quattro migliori su quattro e 95,61% di partite con una scelta nello starter di Piera. In SB-19 l’isolamento in Beppe valeva +10,54 punti di media. | Nel primo giro intervenire sul danno base di 18 HIT a zero L. Misurare Piera e gli altri separatamente. |
| 2 | **Grappa.** Tre «ultimi» su otto. L’isolamento storico in Beppe senza Estasi valeva +11,53 di media su sette incontri e +18,24 contro Celestina. Con +25 L, la sola corazza può assorbire 6 HIT per colpo partendo da zero L (RP-6). La quota di vantaggio attribuibile alla corazza resta aperta. | Nel primo giro misurare Grappa ed Estasi isolate e insieme, poi agire sul +25 L. Ripetere il confronto in Piera con e senza Mezza minerale. |
| 3 | **Divario costruiti–starter.** 20/20 quote oltre 70% sui cinque starter e 28/28 guadagni oltre +15 nella diagnosi sui sette riferimenti. | Dopo il giro Estasi/Grappa, isolare i pacchetti ricorrenti nelle liste che restano sopra e partire dai numeri delle loro carte. |
| 4 | **Quote degli starter.** Cinque incontri fuori fascia. Celestina–Sergio (68,82%) e Celestina–Piera (63,18%) sono gli scarti maggiori. | Mirare prima ai valori delle carte che ricorrono negli incontri fuori fascia. Usare com–com come riscontro separato (D93). |
| 5 | **Finali ed esaurimenti.** Tre durate fuori 6–12. Uno specchio oltre il 10% di patte, Celestina a 12,58% con 14,31 turni medi e 63,43% di posti esauriti. Sergio contro Sergio è a 13,71 turni e 44,48% di posti esauriti. | Valori dei finali e delle last resort come leva da isolare, con verifica di patte e durata anche fuori dagli specchi. |
| 6 | **Scelte rare per i bot.** Steal e Smontiamo tutto a circa zero pur con oltre 246.000 e 282.000 turni in mano. Portata sui matchup da isolare, come per Mano lesta e Coccio. | Verificare occasioni legali e scelte dei bot prima di attribuire una debolezza al valore stampato. |

Le prove seguono l’ordine del piano. Prima i numeri, poi costo e priorità, infine il ridisegno. [Metodo](../../set-base-plan.md#bilanciamento-metodo-e-criteri) e [corazza RP-6](../../design/set-base/regole-playground.md).

**Proposta SB-21.** Al massimo **tre giri da 5.500 s ciascuno**, da confermare dopo aver completato la fotografia. Il primo è per Estasi e Grappa, il secondo per gli scostamenti residui che coinvolgono più incontri, il terzo per conferma e verifica delle regressioni. Il tetto per giro tiene conto di una ricerca che in SB-20 ha già usato circa 3.864 s senza produrre tutti e sette i risultati. Ogni giro comprende matrice, ricerca e confronti mirati sulle carte cambiate. A ogni modifica della bozza si applicano i controlli di numeri e testi di D143 prima della misura.

## Riproduzione e verifiche

- Da radice, creare una nuova cartella d’uscita e usare lo stesso SHA-256 indicato sopra. Per la porta eseguire in sequenza `run.ps1 -Phase feasibility` e `run.ps1 -Phase round` con `-Label sb20-rif`, `-Draft` e `-OutputRoot`. Usare `analyze.py rif` per ciascun giro e poi `confronta-rif.py` contro le uscite di consegna SB-20c B1. [Lanciatore](sb-19/run.ps1), [analisi](sb-19/analyze.py) e [confronto](sb-20c/confronta-rif.py).
- Eseguire `search.ps1` con gli stessi `-Draft` e `-OutputRoot`, `-Label sb20-dopo-1` e `-Characters bruiser.character.BigBadBruiser,base.character.Mara,junkie.character.ToxicJunkie,base.character.Pino`. Per la tranche 2 usare `-Label sb20-dopo-2` e `-Characters base.character.Gigi,base.character.Cesira,base.character.Rocco`. Imporre il limite cumulativo dall’esterno: i 1.200 s scritti dal lanciatore nel marcatore sono un metadato storico. Il grezzo del primo lancio è in `%TEMP%\bm-sb20\ricerca`, gli altri grezzi in `%TEMP%\bm-sb20`. La copia precedente di SB-19 sotto `tmp/sim` è stata ripristinata dopo l’archiviazione di quella nuova. [Riepilogo SB-19](sb-19/search-summary.py).
- Con `round-sb20-rif` come primo argomento, `matrice.py` estrae gli aggregati e `analisi.py` le scelte. Entrambi prendono come secondo argomento il percorso del JSON in uscita. [Matrice](sb-20/matrice.py) e [scelte](sb-20/analisi.py).

`git diff --check` pulito e `python scripts/check-links.py` verde. Porta interamente verde. STOP 4 raggiunto senza avviare altre misure. Scelte prese per la lettura: percentuali 80/5 solo descrittive, miglior finalista scelto sulla quota di convalida contro tutti i 26 mazzi.

## Domande per il proprietario

1. Autorizzi una ripresa di SB-20 con un nuovo tetto per Beppe, Sergio e Duccio, gli scontri diretti, l’uso sui costruiti e i controlli d’ingresso?
2. Per SB-21 confermi il massimo di tre giri da 5.500 s ciascuno, con Estasi e Grappa al primo?
3. Per il FFA autorizzi un banco dedicato in un altro blocco o lo rimandiamo alla prova umana di SB-22?

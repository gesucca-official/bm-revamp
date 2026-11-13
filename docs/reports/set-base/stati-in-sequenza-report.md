# Stati coerenti con la sequenza del turno

13 novembre 2026. Correzione del solo client, su base `14d67d6`; decisioni di riferimento [D69 e D71](../../set-base-plan.md#decisioni-del-proprietario), sezione [SB-16g](../../set-base-plan.md#sb-16g--coppie-caricamento-colpo-seconda-passata). Nessuna modifica di regole, protocollo o server; piano e indice lasciati alla regia.

## Modifica

[scene.ts](../../../client-web/src/scene.ts) conserva in `staged` anche stati, immunità e timer di ogni posto. I segnalini e le loro descrizioni partono dalla vista precedente. [resolution.ts](../../../client-web/src/resolution.ts), `statusSequence`, prepara le sole aggiunte attribuibili a una mossa; la scena le applica nel passo `changes` già esistente, senza cambiare durate o calendario della sequenza.

- Gettone del caricamento: la ricerca riuscita pubblica `search.copy`; gli stati del gettone pubblicano lo stesso `exposure`. Si aggiungono insieme al passo del caricamento e [chipsOf](../../../client-web/src/readability.ts) continua a riunirli in un unico segnalino ×1,5.
- Turno del colpo: il gettone della vista precedente resta consultabile durante tutte le mosse e il fine turno, anche quando manca dalla vista finale. Scompare alla conclusione della sequenza, come richiesto da D71.
- Stato ordinario: un rapporto `Gained Status: <nome>` (anche `Gained status`) su SELF o OPPONENT può anticipare un'aggiunta presente nel finale, soltanto se nome e mossa non sono ambigui. Nessun riconoscimento approssimativo di nomi o interpretazione del catalogo.
- Aggiunte senza un rapporto sufficiente, rimozioni e aggiornamenti dei contatori si vedono a fine sequenza. Immunità e timer conservano i valori precedenti fino ad allora. Un nome ripetuto in più aggiunte o attribuito a più mosse resta prudenzialmente al finale.
- Salto, interruzione e movimento ridotto usano il percorso già presente: `staged` viene liberato o non viene creato; si leggono subito i dati finali.

Il confronto degli stati usa una differenza con molteplicità e ignora soltanto il conto alla rovescia, per non scambiare uno stato già esistente per un'aggiunta. Le viste ricevute non sono mutate. Non si ricostruiscono effetti o durate non pubblicati: per un nuovo stato attribuibile si usa il valore disponibile nella vista finale; gli stati già presenti conservano il contatore precedente fino alla conclusione.

## Test ed evidenze

Nuovo [status-sequence.test.ts](../../../client-web/tests/status-sequence.test.ts): caricamento, permanenza durante il colpo, stato ordinario su autore e bersaglio, rimozione al finale, rapporto assente/approssimativo/ambiguo, mossa annullata, esposizione e proprietario errati, contatori e molteplicità, cumulo di gettoni, movimento ridotto. Nessun atteso preesistente, soglia o `BASE_750` modificato.

Sei mutazioni sui nuovi rami, tutte rilevate da asserzioni dei test, con ripristino dei sorgenti: [esiti](stati-in-sequenza/mutations-client.json). Log completi locali in `E:/bm/tmp/stati-in-sequenza/mutation-*.log`.

| Verifica | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` | 356/356 verdi |
| `./client-web/run.ps1 -Task Build` | Verde; avviso Vite sulla dimensione di un chunk, controllo Size verde |
| `./client-web/run.ps1 -Task Size`, con `BM_OUT` locale | Verde: JS gzip 352.574 B, totale gzip 1.762.731 B, texture 27.729.048 B, sotto i tetti C4 |
| `./scripts/build.ps1 -Task Test -Offline` | Verde: 774 test Java, 0 fallimenti/errori, 13 saltati; 37/37 test debug |
| `python scripts/check-rules.py` | Verde |
| `python scripts/check-links.py` | Verde |
| `git diff --check` | Verde |
| Avvio `-Bozza` e catture prima/dopo di caricamento e colpo | Riuscito; entrambi i casi confermati, 0 errori di pagina |

Durante il lavoro il proprietario ha segnalato un altro esecutore su bot e server nello stesso checkout, autorizzando fino a nuovo avviso solo Test/Build/Size del client. Nessun Maven, build Java o avvio server eseguito prima del via libera. Nessun processo altrui fermato.

## Catture e limiti

[Script di cattura](stati-in-sequenza/capture.mjs) eseguito per avviare `dev.ps1 -Task Server -Bozza -SeedAccounts -Pool starter-gigi -Com starter-spazienzio -Bot prudente` con SQLite temporaneo, server sulla 18086 e una propria anteprima sulla 14366, senza occupare o fermare la 4320 già in uso. Confronto col client del commit di base, costruito con `run.ps1 -Task Build` e conservato in `E:/bm/tmp/stati-in-sequenza/before-dist`. Ogni sorgente temporaneamente sostituito per la build di base è stato ripristinato; nessun file server toccato.

Il proprietario ha dato «via libera server» prima di tutti i controlli Java e degli avvii. La 8080 è rimasta occupata da un processo preesistente e non è stata toccata. Due avvii reali `-Bozza` con database separati, client prima/corretto a 1366×768, nessun errore di pagina; server e anteprime creati dallo script sono stati fermati. Server comune aggiornato dal commit `773325a` dell'altro esecutore; il client di base è quello di `14d67d6`. Sono partite diverse, con ordini delle mosse e valori diversi; il confronto riguarda il momento del segnalino rispetto alla propria mossa. Il clock Playwright porta la scena ai passi programmati senza cambiare il calendario di prodotto.

Esiti minificati: [prima](stati-in-sequenza/before.json), [dopo](stati-in-sequenza/after.json). Tutte le 16 catture e i log completi restano in `E:/bm/tmp/stati-in-sequenza/`; in git una selezione:

| Momento | Prima | Dopo |
|---|---|---|
| Caricamento, inizio sequenza | [gettone anticipato](stati-in-sequenza/before-caricamento-inizio.jpg) | [gettone assente](stati-in-sequenza/after-caricamento-inizio.jpg) |
| Caricamento, risoluzione della mossa | [gettone presente](stati-in-sequenza/before-caricamento-mossa.jpg) | [gettone appena comparso](stati-in-sequenza/after-caricamento-mossa.jpg) |
| Colpo, inizio sequenza | [gettone già assente](stati-in-sequenza/before-colpo-inizio.jpg) | [gettone conservato](stati-in-sequenza/after-colpo-inizio.jpg) |
| Colpo, fine turno nella sequenza | [assente](stati-in-sequenza/before-colpo-fine-turno.jpg) | [ancora presente](stati-in-sequenza/after-colpo-fine-turno.jpg) |
| Colpo, sequenza conclusa | [assente](stati-in-sequenza/before-colpo-finale.jpg) | [ora rimosso](stati-in-sequenza/after-colpo-finale.jpg) |

Catture ispezionate visivamente. La tessera conserva il simbolo negativo e «∞»; il testo consultabile ×1,5 è verificato nei JSON. Nessun rosso di prodotto. Primo tentativo di cattura fermato da un selettore errato dello script («Salta effetti» è nel menu), corretto prima delle due esecuzioni riuscite. Movimento ridotto coperto dagli unitari; il comando Salta effetti è stato usato dal menu nei turni intermedi, ma senza una cattura dedicata al salto del gettone. Contesto Spring completo separato non eseguito: l'avvio reale del profilo bozza è riuscito. Non richiesta la matrice Playwright completa né una prova su dispositivo fisico. Il proprietario giudica dalle catture la comprensibilità del momento di comparsa del gettone e della sua permanenza nel turno del colpo.

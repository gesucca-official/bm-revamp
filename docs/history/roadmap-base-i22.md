> **Archivio — completata e approvata il 26 ottobre 2026.**
> Roadmap della versione base chiusa con I22, candidato `I22-3e71300e057687ba`.
> [Approvazione e limiti](../reports/i22-report.md#approvazione).
> Archiviata il 26 ottobre 2026: testo e sequenza delle revisioni conservati;
> adattati soltanto i collegamenti relativi. Espressioni come «prossimo»,
> «resta aperto», versioni e raccomandazioni modello sono riferite alla data
> della rispettiva sezione, non costituiscono pianificazione attiva.
> Il backlog finale è differito, non approvato per l'esecuzione.
> [Indice corrente](../roadmap.md) · [Preparazione client](client-roadmap-preparation.md).

# Roadmap verso la versione base approvata

Revisione del **26 ottobre 2026**. Pianificazione della base; I14/I23 completati dopo verifica reale di I13/I19a/I26; I16 resta acquisito. **I17a/b, I19b, I24 e I19c completati e verificati**; **I22 completato: base approvata esplicitamente dal proprietario**. I24 recepisce R06 prima del codice e chiude gli attivi dopo arresto pulito/crash con draw consultabile «riavvio server». I19c verifica manifest ed export trasversalmente alle quattro modalità e ai cicli ordinari, leave/forfait, timeout, reconnect, arresto e crash. Fonte normativa: [regolamento corrente 1.6](../game-rules.md); evidenze: [stato implementazione](../implementation-status.md), [conformità](../rules-conformance.md) e report degli incrementi. Nessun restore giocabile o Elo.

## Obiettivo e perimetro

Arrivare a una **versione base locale, verificata e approvata dal proprietario**, da cui partire per sviluppi successivi ancora da definire. La base comprende client web debug giocabile, un client CLI testuale leggero per l'automazione, identità persistenti e sessione unica, tutte le quattro modalità attuali, mazzi senza limiti di legalità ma strutturalmente validi, bot casuale, dati completi di partita per analisi, reconnect sul processo vivo entro 30 secondi, timeout mossa di 30 secondi con altri umani e forfait, restart→draw senza restore.

**Elo è rimosso dal percorso della base e rinviato.** I25/F38 rimangono identificativi storici riservati; non si aggiungono formule, campi rating, UI o dipendenze da rating. Il residuo decisionale R08 di open-questions è differito e non blocca la base (è distinto dalla sezione R08 del regolamento).

I01–I11 rimangono conclusi nei rispettivi ambiti, con prove e limiti originali. La persistenza SQLite scelta in I03 e il regolamento corrente 1.6 sono acquisiti: non si riaprono scelte concluse. I12–I24 conservano gli ID, ma il lavoro residuo è ridefinito sotto; I26 è il nuovo CLI e viene eseguito per primo. I18/I20/I21 escono dal percorso corrente e restano soltanto riferimenti di backlog.

## Ordine esecutivo

| Passo | Incremento | Risultato atteso |
|---|---|---|
| Acquisito | I01–I11 | Build, harness, SQLite, browser, identità, autorizzazioni, catalogo, contratto, primo round e isolamento |
| 1 | I26 | CLI minimo e automazione senza browser |
| 2 | I12 | Copertura residua delle carte contro il regolamento vigente |
| 3 | I19a | Raccolta iniziale/round/esito per la prima partita completa |
| 4 | I13 | Quick 1vCom completo via CLI, accettazione UX nel debug |
| 5 | I15 → I16 | Mazzi e open 1vCom completi |
| 6 — concluso | I14 → I23 | Finalizzazione/timeout e reconnect verificati; nessuna dipendenza inversa |
| 7 — concluso | I17a → I17b | Quick 1v1 e FFA verificati |
| 8a — concluso | I19b | Quattro modalità/cicli di vita, registro attivi, finalizzazioni e recupero scritture verificati |
| 8b — concluso | I24 → I19c | Restart-draw verificato; manifest/export confrontati con eventi SQLite per tutti gli scenari |
| 9 — concluso | I22 | Candidato I22-3e71300e057687ba verificato e approvato esplicitamente il 26 ottobre 2026 |

I19 è un solo incremento articolato in tre consegne: a abilita I13; b include registro persistente degli attivi e finalizzazioni per I24; c verifica anche gli eventi di restart. I22 raccoglie prove durante tutto il percorso e si chiude per ultimo. Nessun nuovo ramo futuro è un requisito della base.

### I19c — Manifest e export trasversali

**Completato e verificato il 26 ottobre 2026.** `python scripts/verify-match-manifests.py` controlla export ordinari in tutte le modalità, i dodici cicli I19b e i dodici match attivi chiusi da arresto pulito/crash/interruzione I24. Ricontrolla sequenze, catene SHA-256, assenza di duplicati e buchi, versione/stato iniziale, transizioni, report, esiti, corrispondenza byte-per-byte export↔SQLite, registro V003, ripetizioni e integrità/vincoli SQLite. Scansiona inoltre gli export per chiavi di credenziali/sessione e conferma la conservazione dell'esito concluso e dei log legacy nei database I24. Report: [I19c](../reports/i19c-report.md); manifest prodotto: `.build-logs/i19c-manifest.json`.

Il riepilogo storico `.build-logs/i19b-manifest.json` aveva ID/hash non corrispondenti ai transcript correnti. La verifica l'ha rilevato e non lo ha usato per approvare i dati: il manifest I19c è rigenerato dai transcript CLI, confrontati con le fixture di eventi attesi e le righe SQLite. Nessun difetto strutturale di durabilità/finalizzazione riprodotto; nessuna modifica al comportamento del gioco. I22 resta aperto.

## Regole di avanzamento e scelta dei modelli

Ogni incremento futuro produce comandi ripetibili, fixture sintetiche isolate, atteso derivato dal regolamento, risultato ottenuto e report collegato alle feature. Non si cambiano attesi per accettare regressioni. Una modifica al comportamento richiede prima versione e motivazione nel regolamento, poi test, codice, descrizioni SQLite e copia client nella stessa modifica. I dettagli ancora aperti di timeout, mazzi, log e restart si risolvono prima del relativo lavoro, senza inventare regole nella roadmap.

La CLI diventa l'ingresso standard di **tutti gli scenari automatici applicativi che non verificano la user experience**: funzionali, contratto, sicurezza, multiplayer, ciclo di vita, log e futuri carichi. Unit test e integrazioni mirate del motore/storage restano diretti quando più economici e precisi; non vanno incapsulati in una connessione CLI. I test client esistenti si conservano; si evita di duplicare sul browser le prove applicative. Browser e debug servono alle verifiche di interazione, presentazione e usabilità.

Le note modello sono raccomandazioni tecniche per costo totale/qualità, da rivalutare sui risultati, non garanzie di costo o disponibilità. Secondo il [catalogo ufficiale OpenAI](https://developers.openai.com/api/docs/models), GPT-6.1 Sol bilancia capacità e costo; GPT-6 Luna è adatto a compiti circoscritti economici. Prezzi API standard indicativi per milione di token input/output, consultati il 24 ottobre 2026: Sol **$2/$10**, Luna **$0,10/$0,50**, Astra **$10/$50** ([prezzi ufficiali](https://developers.openai.com/api/docs/pricing)); non sono preventivi del piano Codex. Per questo Sol è preferito per lavoro trasversale, Luna per lotti ben specificati; Astra solo se problemi documentati giustificano il costo superiore. Il modello non approva il prodotto al posto del proprietario.

## Incrementi già completati — criteri e prove storici preservati

Le sezioni I01–I11 seguenti sono conservate integralmente. Date, conteggi, richiami a Elo e vecchia baseline Q03 descrivono il momento della consegna; non riattivano requisiti superati. Le indicazioni storiche «prossimo I12» sono sostituite dall'ordine sopra. Il regolamento attivo è 1.5.

### I01 — Scelta tecnica e build riproducibile (P0; F01)

**Stato 23 ottobre 2026: baseline di build e smoke completata.** Scelta conservativa di recupero con strumenti fissati, prima installazione da rete e seconda build pulita da cache offline riuscite; JAR e dist prodotti. JUnit avviato, 1 errore contesto DB non configurato: resta a I02/I03; nessuna suite client o partita dichiarata verificata. Evidenza e limiti in [i01-report.md](../reports/i01-report.md). I punti seguenti conservano obiettivo e criteri dell'incremento.

- **Obiettivo:** confrontare riuso/aggiornamento/sostituzione delle parti e scegliere una toolchain riproducibile. Q01 non impone stack o versioni; non impone riscrittura.
- **Prerequisiti:** accesso alle dipendenze o cache completa; comportamento attuale identificato per regressioni. Restrizione di rete distinta dalle scelte di stack.
- **File/componenti:** pom/wrapper, package/lock/tsconfig; documentare motivazione e costi della soluzione in setup/architettura prima di cambi estesi.
- **Accettazione:** ambiente pulito produce artefatti di server e client debug con versioni fissate; confronto alternative e scelta registrati; sorgenti e dati legacy restano recuperabili.
- **Test:** compile/build e runner avviati, controlli manifest/lock e smoke minimo.
- **Rischi:** aggiornamento massivo confonde recupero con riscrittura; libertà tecnica non è evidenza di convenienza.

### I02 — Harness di test isolato (P0; F30)

**Stato 23 ottobre 2026: completato l'harness isolato.** Comando unico `build.ps1 -Task Test -Offline`: 8 test JUnit del motore e 4 test client passano. Due mutazioni su copie isolate producono fallimenti di asserzione attesi (2 server, 4 client). Il test originale del contesto resta esplicito con `TestServerContext`: 9 test complessivi, 8 passano e 1 errore datasource; bootstrap isolato a I03. Nessun sorgente applicativo o nuova dipendenza modificati. Evidenza in [i02-report.md](../reports/i02-report.md).

- **Obiettivo:** poter eseguire unit test motore e test client, senza SMTP/DB reali; abilitare risultati leggibili.
- **Prerequisiti:** I01.
- **File/componenti:** `src/test`, `BmServerApplicationTests`, configurazione runner client/Angular; eventuali fixture in aree test.
- **Accettazione:** comandi di test esistono e avviano realmente i runner; casi unitari non richiedono servizi condivisi. Il contesto Spring viene eseguito nel profilo isolato di I03.
- **Test:** un caso significativo di pesca/costo e un caso di costruzione comando client; una regressione introdotta temporaneamente in copia isolata deve essere rilevata.
- **Rischi:** test che rispecchiano soltanto l'implementazione o approvano involontariamente regole incerte; distinguere comportamento osservato e desiderato.

### I03 — Persistenza ricostruita e bootstrap (P0; F02/F12 infrastruttura)

**Stato 23 ottobre 2026: completato.** Scelta e implementata persistenza applicativa SQLite/JDBC separata dal catalogo SQLite/JPA read-only, schema iniziale versionato ricostruito, PostgreSQL rimosso. Contesto completo e integrazioni verdi (73 test server); suite ordinaria 65 server + 4 client; smoke JAR su due avvii con dati sintetici persistiti. Nessuna partita/browser verificata. [Report I03](../reports/i03-report.md). I punti successivi conservano i criteri dell'incremento.

- **Obiettivo:** ricostruire dati/schema necessari da mapping e SQLite disponibili; scegliere storage account, mazzi, log ed Elo senza vincolo PostgreSQL.
- **Prerequisiti:** I01/I02; Q02 già autorizza ricostruzione e alternativa a PostgreSQL. Non attendere DDL originale perso.
- **File/componenti:** conf/db, repo/internal/external, schema/versionamento nuovi della soluzione scelta; catalogo e fixture isolate.
- **Accettazione:** bootstrap e round-trip account/mazzi/log nella soluzione scelta; catalogo letto correttamente; identità mazzo distinta per utente e ID; schema locale riproducibile.
- **Test:** creazione DB isolato, vincoli strutturali, JSON o equivalente, concorrenza e durabilità richieste; regressioni dati del catalogo incluso.
- **Rischi:** scegliere storage solo per evitare un problema di installazione trascurando log/Elo; nessuna cancellazione di dati o ambienti reali autorizzata.

### I04 — Avvio browser, proxy locale e route (P0; F02/F04)

**Stato 23 ottobre 2026: completato.** Home, regolamento, hub/sign-up e redirect verificati nel browser; REST e upgrade WebSocket locali riusciti. Build e 65 test server + 6 client verdi. Nessun login STOMP o match certificato. [Report I04](../reports/i04-report.md). Prossimo incremento I05.


- **Obiettivo:** raggiungere home/hub e server senza errori di bootstrap.
- **Prerequisiti:** I01; I03 per il controllo integrato backend.
- **File/componenti:** `AppComponent`, `AppModule`, main, proxy locale, route Angular; verificare DatePipe/providers prima di correggere.
- **Accettazione:** browser carica schermate e Markdown, errori visibili e non ricorsivi, URL API inoltrati correttamente; nessun accesso a host remoti.
- **Test:** smoke browser home/hub/sign-up, route inesistente, apertura diretta partita senza sessione; richiesta REST campione locale.
- **Rischi:** bootstrap bloccato da dipendenze/provider; routing locale non prova l'hosting finale di I21.

### I05 — Identità minima di sviluppo senza email obbligatoria (P0; F06 infrastruttura)

**Stato 23 ottobre 2026: completato.** Provisioning opt-in locale, due account persistenti senza email, duplicati preservati. Accesso REST/STOMP e hub verificati per entrambi; riavvio senza seed riuscito. 69 test server ordinari, 77 con contesto e 9 client verdi. [Report I05](../reports/i05-report.md). Prossimo I06; sicurezza completa e partita non certificate.


- **Obiettivo:** rendere disponibili account di sviluppo stabili per sessione unica, mazzi e Elo, senza dipendere da verifica email/SMTP.
- **Prerequisiti:** I03/I04; Q05 rinvia obblighi email; definire provisioning R01 (proposta tecnica, non guest mode presunto).
- **File/componenti:** AuthService, repository credenziali, schermata login ed eventuale provisioning locale o registrazione minima.
- **Accettazione:** due identità sintetiche persistenti consentono login e test; nessuna richiesta SMTP obbligatoria; errore chiaro per account invalido. Flusso scelto documentato.
- **Test:** creazione/provisioning, login valido/invalido, duplicati identità, riavvio e rilettura.
- **Rischi:** confondere rinvio dell'email con rinvio dell'isolamento degli account. Registrazione email completa F05 e recupero F36 restano successivi.

### I06 — Login e autorizzazione delle destinazioni (P0; F06/F07)

**Stato 23 ottobre 2026: completato per il confine autenticato.** CONNECT diretto, sessione unica con seconda connessione rifiutata, identita/membership e allowlist SEND/SUBSCRIBE implementati; destinazioni private allineate sui due lati. 85 test server completi e 9 client verdi; profilo privato verificato nel browser. [Report I06](../reports/i06-report.md). Recupero partita e timer restano I23/I14; prossimo incremento I07.


- **Obiettivo:** legare connessione, operazioni e sottoscrizioni all'account verificato.
- **Prerequisiti:** I03/I05 (o fixture I03 per prove isolate); una sessione/account Q06; admin rinviata Q07.
- **File/componenti:** security HTTP/WS, AuthChannelInterceptor, User/Game/Queue controller, WebsocketService.
- **Accettazione:** A opera sul proprio account; B e anonimo non leggono né mutano dati/partite di A; path/body incoerenti rifiutati. Test ripetuto anche con CONNECT diretto senza preflight REST.
- **Test:** SEND/SUBSCRIBE negativi e positivi, rifiuto/sostituzione controllata di sessioni duplicate e rientro secondo R02, password errata e gestione errore client.
- **Rischi:** convenzioni user destination esistenti non funzionanti; riallinearle sui due lati senza cambiare protocollo per principio. Nessuna esposizione pubblica prima di questo gate.

### I07 — Profilo, presenza e logout dall'hub (P1; F08/F09/F10 base)

**Verifica visuale chiusa il 23 ottobre 2026:** logout/login ripetuti riusciti, campi svuotati, profilo ricevuto e presenza 2 -> 1 -> 2 verificata con due account. I07 completato; il precedente stato pendente sotto e storico. [Report aggiornato](../reports/i07-i08-report.md).


**Stato 23 ottobre 2026:** Implementato e verificato automaticamente; verifica visuale finale logout/login pendente per blocco degli strumenti sul dialogo nativo precedente, sostituito da SweetAlert. [Report I07/I08](../reports/i07-i08-report.md).


- **Obiettivo:** account e presenza coerenti lungo connect/logout e riconnessione volontaria dall'hub.
- **Prerequisiti:** I06; Q06. La parte partita/disconnessione si chiude in I14.
- **File/componenti:** UserAccountService, ConnectionsService, PresenceEventListener, SessionService, toolbar/hub.
- **Accettazione:** login aggiorna dati e attività; logout elimina la sessione corretta e un nuovo login riesce; nessun dato sensibile superfluo nel broadcast.
- **Test:** due sessioni distinte, eventi disconnect duplicati, DB non disponibile, logout ripetuto.
- **Rischi:** stato globale mutabile e disconnect identificato male; non sostituire la presenza con un sistema distribuito senza necessità misurata.

### I08 — Catalogo runtime e starter validati (P1; F03/F11 base/F13/F18)

**Stato 23 ottobre 2026:** Completato: 37 binding e due starter reali verificati, mano iniziale e binding errati coperti; regole invariate. [Report I07/I08](../reports/i07-i08-report.md).


- **Obiettivo:** trasformare i dati già integri in oggetti di gioco utilizzabili e una mano iniziale verificata.
- **Prerequisiti:** I02–I03; catalogo attuale come materiale di sviluppo Q13, comportamento corrente Q03.
- **File/componenti:** factory, repository interni, Card/Character/Player, catalogo e asset solo se necessari e approvati.
- **Accettazione:** tutte le carte del pool istanziate, starter da 20 con speciali, pesca item/last resort conforme; binding non valido produce errore esplicito.
- **Test:** parametrico per ogni riga catalogo, due personaggi, sequenze di pesca note, verifica riferimenti non nulli e placeholder ammessi.
- **Rischi:** classe presente ma hook incompleto; SoberUp non entra nel pool solo perché esiste.

### I09 — Contratto vista e singolo comando valido (P1; F17/F19/F25 base)

**Stato 23 ottobre 2026: completato per il contratto vista/comando.** Vista privata e mossa fixture verificate su STOMP reale, duplicati e input errati rifiutati, modelli e scelte debug allineati. 131 test server completi e 17 client verdi. [Report I09](../reports/i09-report.md). Nessun round browser certificato; prossimo incremento I10.


- **Obiettivo:** ottenere una vista privata e inviare una mossa di un account sintetico in una partita fixture.
- **Prerequisiti:** I06/I08; Q03 baseline attuale su target/costi. Non richiede ancora la partita completa F14.
- **File/componenti:** ClientGame/Character/PlayerView, modelli TS, GameController, Move, WebsocketService, card-in-hand debug.
- **Accettazione:** campi dead/deck e scelte coerenti; vista al titolare; mossa valida ammessa e seconda/invalidi rifiutati senza mutare stato; errori mostrati nel debug.
- **Test:** JSON e routing STOMP reale, target/scarto/item/null, player estraneo e gameId incoerente.
- **Rischi:** serializzazione/nomi carte e duplicati; scegliere compatibilità del contratto prima di introdurre nuovi ID/versioni.

### I10 — Primo round quick 1vCom (P1; F14/F20/F23 base)

**Stato 23 ottobre 2026: completato.** Join quick/1vCom, ready privato e primo round provati nel browser Debug; fixture su STOMP reale verifica costi, effetti, pesca, una mossa bot nel round ed errore recuperabile. 132 server completi e 18 client verdi. [Report I10](../reports/i10-report.md). Nessuna partita completa certificata; prossimo I11.


- **Obiettivo:** join reale, ready privato e un round con umano e bot, visibile nel debug.
- **Prerequisiti:** I07–I09; ordinamento del codice per Q03.
- **File/componenti:** QuickGameQueuesController, GameFactory/PlayerFactory, GameSessionService, Game, ComPlayer, debug.
- **Accettazione:** un solo gameId, due player attesi, bot presenta una sola mossa; aggiornamento vista con costi, effetto e pesca; nessuna notifica ad estranei.
- **Test:** E2E primo round con fixture di carte note e stato atteso, errore controllato e nuovo tentativo valido.
- **Rischi:** casualità nasconde problemi; fixture controlla la sequenza senza modificare la policy del bot in produzione.

### I11 — Risoluzione e stati isolati (P1; F20/F21)

**Stato 23 ottobre 2026: completato.** Revisione normativa 1.1 prima del codice: stati indipendenti, parita conforme a R04, rollback locale e viste coerenti, pubblicazione dopo commit. 137 server completi e 18 client verdi; regressione primo round I10 inclusa. [Report I11](../reports/i11-report.md). Prossimo I12; partita completa resta I13.


- **Obiettivo:** stabilizzare il nucleo delle regole prima di collaudare intere partite.
- **Prerequisiti:** I02/I10; Q03: comportamento del codice assunto come baseline provvisoria per ordine, danni, stati, morte e timer.
- **File/componenti:** Game, Move, Character, Status/Timer e stati statici delle carte.
- **Accettazione:** risultati deterministici per fixture; nessun effetto di una partita su un'altra; errori non lasciano un round parzialmente esposto; policy costi/counter applicata.
- **Test:** priorità/ALERTNESS/parità, death durante round, single-use due danni, stacking, timer, due partite con stessi tipi di stato.
- **Rischi:** correggere “bug” senza scegliere la regola. Eventuale soluzione per atomicità deve restare locale e misurata.

## Incrementi del percorso corrente

### I26 — Client CLI testuale minimo (P0; F39/F30)

**Stato 24 ottobre 2026: completato.** CLI verificato con processi Node reali su REST/SockJS/STOMP e SQLite isolato: autenticazione, sessione unica, catalogo/mazzi, quattro modalità, target/scelte, duplicato e accesso estraneo, file/stdin, errori e rilascio risorse. Contesto completo alla consegna I26: 179 test verdi; suite ordinaria: 123 server e 18 client verdi. Baseline ripetibile di dipendenze, avvio e memoria registrata senza soglie. [Guida](../cli.md), [report](../reports/i26-report.md). Conferma successiva e chiusura I12 nella sezione seguente.

- **Obiettivo:** fornire subito uno strumento leggero, utilizzabile da terminale e in esecuzione non interattiva; nessuna dipendenza da Angular, Phaser, browser o ambiente grafico.
- **Prerequisiti:** I01–I11 acquisiti. Riutilizzare il runtime già fissato e le librerie di trasporto compatibili dove conviene; motivare eventuali dipendenze nuove. Nessun nuovo framework TUI o servizio permanente.
- **Perimetro:** login REST/CONNECT autenticato, sottoscrizioni private STOMP/SockJS reali, profilo/catalogo/mazzi, join delle quattro modalità, FFA start/add bot, vista, submit con target/scelte, leave/logout. Reconnect, timer e nuovi esiti si aggiungono solo nei rispettivi incrementi.
- **Accettazione:** comandi testuali e input da file/stdin, output JSON/eventi stabile separato dalla diagnostica, exit code significativo e attese limitate; più account/processi isolabili, chiusura delle risorse e nessun segreto nei report. Una guida minima spiega avvio e scenari senza browser.
- **Test:** ripetere via trasporto reale la vista/mossa I09 e il primo round I10, inclusi errore recuperabile, duplicato e accesso estraneo rifiutato. Fixtures deterministiche senza endpoint che aggirino identità o regole; misurare dipendenze, avvio e memoria a vuoto come baseline di overhead, senza soglie arbitrarie.
- **Rischi:** duplicare il motore nel client o simulare il server non prova il percorso reale. Non costruire un secondo sistema di test: gli scenari usano il CLI, le asserzioni restano nei runner esistenti ove possibile.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento medio**: trasporto asincrono, autenticazione e riuso del runtime richiedono coordinamento; evita il costo di un modello superiore per una CLI volutamente piccola.

### I12 — Copertura residua del catalogo (P1; F22)

**Stato 24 ottobre 2026: completato.** I26 confermato con riesecuzione delle prove CLI reali. Matrice delle 39 carte e del token contro R07 1.3, catalogo runtime e test effettivi; aggiunti 87 casi diretti e uno scenario CLI a due account su tre round per oggetto/scarto/token, conservate le prove I11 di isolamento e rollback. Suite ordinaria: 210 server + 18 client; contesto completo separato: 267 test verdi; `check-rules.py` superato. Nessuna regola, bilanciamento o contenuto modificato; nessuna nuova UX o partita completa certificata. [Matrice](../reports/i12-card-matrix.md), [report e limiti](../reports/i12-report.md). Il prossimo passo è I19a; non avviato in questa consegna.

- **Obiettivo:** completare per lotti le prove di effetti e interazioni contro R07 del regolamento 1.3, riusando la copertura già presente. Il catalogo normativo comprende 39 carte (2 personaggi, 33 azioni, 4 oggetti) e il token.
- **Prerequisiti:** I08/I11/I26; inventario dei casi già coperti in rules-conformance.
- **Accettazione:** matrice carta/regola/caso con lacune chiuse per basic/bound/last resort, oggetti/token, costi, counter, stati e timer; nessun ribilanciamento o aggiunta di contenuti. Discrepanze trattate secondo R00, non cristallizzate come nuovi attesi.
- **Test:** unit diretti per effetti/interazioni; CLI per gli scenari che richiedono un match reale, incluse scelte oggetto e scarto. Conservare le prove I11 di indipendenza e rollback.
- **Modello consigliato:** **GPT-6 Luna, ragionamento medio**, per piccoli lotti con regola e atteso espliciti; passare a Sol solo per interazioni ambigue o difetti trasversali documentati.

### I19 — Dati completi per analisi, in tre consegne (P1; F27)

**Stato 26 ottobre 2026: I19b completato dopo I17a/b e prerequisiti riverificati.** Quattro modalità/cicli di vita sul contratto I19a, registro persistente V003 e finalizzazioni atomiche idempotenti, batch locali immutabili e retry senza rieseguire round. 8 nuove prove dirette di migrazione/durabilità/concorrenza/guasti e 12 scenari CLI con manifest esatti (169 eventi, nessun duplicato o evento atteso mancante), confronto indipendente SQLite/export. PASS: 245 server + 27 client, contesto Spring separato 349, check-rules, JAR e due avvii sintetici; [report I19b](../reports/i19b-report.md). Restart→draw e manifest di arresto/crash restano I24/I19c. La nota I19a datata sotto è storica.

**Stato 24 ottobre 2026: I19a implementato e verificato; I19b/c non avviati.** Archivio quick separato append-only, snapshot iniziale con ordine pre-pesca/configurazione/versioni, mosse accettate e automatiche, report, transizioni ed esito; export JSON CLI privato dopo l'esito. Migrazione V1→V2 su copia sintetica isolata, rilettura e integrità/concorrenza storage, guasti post-commit osservabili con eventi non persistiti distinti; nessun round annullato. I26/I12 riverificati. Evidenze, comandi, volumi e limiti nel [report I19a](../reports/i19a-report.md), contratto in [match-archive.md](../match-archive.md). Nessuna nuova UX o accettazione I13; il prossimo incremento è I13. Recupero scritture, altre modalità/ciclo di vita e restart restano I19b/I24/I19c.

- **Obiettivo:** stato iniziale, configurazione/versione codice-regole-catalogo, ordine iniziale necessario alla riproducibilità, mosse, report, transizioni ed esiti rileggibili ed esportabili; nessun checkpoint giocabile o rating.
- **Prerequisiti:** I03/I06/I10/I26; chiarire R05 su granularità e crescita storage. Schema compatibile con i dati esistenti, provato su copia isolata; nessuna migrazione distruttiva implicita.
- **I19a, prima di I13:** snapshot/eventi immutabili, ordine e identificazione del match, persistenza ed export del percorso quick; rendere osservabili i fallimenti post-commit oggi non recuperati.
- **I19b, dopo I17 — concluso il 26 ottobre 2026:** consolidare la copertura di tutte le modalità e dei cicli di vita (gli eventi locali leave/timeout/reconnect sono già aggiunti da I14/I23); registro persistente degli attivi ed esiti idempotenti pronto per I24. Definire e provare recupero degli errori di scrittura senza annullare un round già concluso.
- **I19c, dopo I24:** manifest completo anche per arresto/crash e draw tecnico; verifica finale senza buchi o duplicati rispetto agli eventi attesi.
- **Accettazione e test:** CLI per partita→esito→export e fault injection controllata; integrazioni dirette per durabilità, rollback e concorrenza storage. Nessuna password/token, retention distruttiva o campionamento. Analisi set possibile senza pannello admin.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento alto** per a/b; **GPT-6 Luna, ragionamento medio** per c se verifica un contratto già definito. Durabilità e finalizzazione giustificano Sol, controlli ripetitivi circoscritti Luna.

### I13 — Prima partita quick 1vCom completa (P1; F14/F23/F24/F25)

**Stato 24 ottobre 2026: completato.** Prerequisiti I12/I19a/I26 riverificati nelle suite. Quattro partite CLI deterministiche a salute piena (Bruiser/Junkie × vittoria/pareggio), esaurimento mazzo, bot senza mosse valide, rifiuto post-esito e seconda partita sulla medesima connessione; export completo riletto da storage indipendente. UX debug separata con starter e bot realmente casuali: partita fino al vincitore, aggiornamenti, effetti finali, ritorno hub e secondo avvio. Regole e bot invariati; limite del solo runner per rilevare stalli. [Report I13 e limiti](../reports/i13-report.md).

- **Prerequisiti:** I12/I19a/I26 e I10–I11 acquisiti.
- **Accettazione:** partite complete con umano Bruiser e Junkie, esiti corretti, submit dopo over rifiutato e seconda partita nella stessa sessione; dati completi esportati. Bot casuale invariato.
- **Test:** scenari automatici deterministici via CLI per vittoria, pareggio, mazzo esaurito e bot senza azioni; sessione manuale debug con casualità reale per UX e presentazione dell'esito. Un limite di turni nel runner rileva uno stallo ma non dimostra terminazione generale e non introduce una regola di gioco.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento alto**: terminazione, bot e finalizzazione attraversano motore, servizio e log.

### I15 — Editor e persistenza mazzi senza limiti di gioco (P1; F11/F12)

**Stato 24 ottobre 2026:** implementati vincoli R03 nel regolamento 1.4 e validazione canonica prima della scrittura; rimossi 20+2 e filtro bound. CRUD/negativi/ownership via CLI e persistenza diretta verificati; browser isolato: creazione minima, selezione e annullamento verificati. Test ordinari 219 server + 20 client, contesto separato 280 server verdi. Verificati anche modifica salvata, rilettura dopo riavvio e messaggio di errore server con recupero nel browser. I15 completato nei criteri previsti. [Report I15](../reports/i15-report.md). I16 non avviato alla consegna I15; completamento successivo nella sezione seguente.


- **Prerequisiti:** I03/I06/I08/I26; chiarire R03 sulle strutture eseguibili senza inventare limiti di legalità.
- **Accettazione:** catalogo interamente disponibile, niente vincoli UI 20+2 o tetti copie/bound; crea/modifica/annulla/delete/rilettura coerenti. Ownership, binding e struttura sicura verificati; input non eseguibile dà errore, non crash.
- **Test:** CLI per CRUD, dimensioni/copie/bound variabili, utenti distinti e riferimenti invalidi; browser per selezione, editor, annullamento e messaggi. Nessuna economia.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento medio**: allineamento editor, contratto e storage con tutela dei dati esistenti.

### I16 — Open 1vCom completo (P1; F16)

**Stato 25 ottobre 2026: completato.** I13/I15/I26 riverificati; due mazzi distinti salvati e selezionati via CLI fino a partita completa, esito ed export persistito riletto indipendentemente. Configurazioni runtime confrontate con i mazzi scelti; ID assente/altrui rifiutati e runtime invariato dopo modifica/delete del record. Lettura singola del record e archivio/finalizzazione quick riusati per open1vCom; errore join recuperabile. Debug separato: scelta, annullamento, assenza mazzi, selezione obsoleta rifiutata e successivo avvio corretto. 219 server + 21 client ordinari; contesto separato 281 server e check-rules verdi. Regolamento 1.4 invariato, nessun timeout vsCom né open PvP. [Report, comandi e limiti](../reports/i16-report.md).

- **Prerequisiti:** I13/I15/I26; I14 non è necessario per il percorso ordinario senza timeout mossa vsCom.
- **Accettazione:** almeno due mazzi diversi producono le configurazioni previste e partite complete; mazzo assente/altrui rifiutato; modifica del record non cambia il mazzo runtime già in uso.
- **Test:** CLI salva→seleziona→partita→esito/export e casi negativi; debug per UX della scelta mazzo.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento medio**: riuso dei flussi quick con attenzione all'isolamento del mazzo.

### I14 — Clock, forfait, finalizzazione e cleanup (P1; F09/F10/F24/F32)

**Stato 25 ottobre 2026: completato.** Prima recepite R02/R04 nel regolamento 1.5 e chiariti con il proprietario primo turno, termine escluso e forfait simultanei individuali FFA. I13/I19a/I26 riverificati nelle suite. Clock iniettato, finalizzazione locale unica, leave/logout/coda con conferme e cleanup che preserva il journal; nessun timeout mossa vsCom. Scadenze prima/al/oltre, batch FFA, superstite, duplicati/concorrenza e morte naturale verificati. Corretto il conflitto SQLite fra log web e append con prova concorrente riprodotta prima della modifica; nessun retry o nuovo schema. Debug separato: avvisi, pending, timeout, un solo dialogo finale e hub. 237 server + 25 client ordinari; 306 server nel contesto separato e check-rules verdi. [Report I14/I23, prove e limiti](../reports/i14-i23-report.md).

- **Prerequisiti:** I13/I19a/I26; decisioni R02/R04 su confini, decorrenza, scadenze simultanee e FFA prima di cambiare il comportamento. La finestra reconnect è già fissata a 30 s; qui si prepara il coordinamento, I23 implementa il rientro.
- **Accettazione:** 30 s per mossa con altri umani, forfait una volta; nessun timeout mossa vsCom. Leave/logout/coda e fine con superstite non duplicano esiti né perdono log. Le nuove policy entrano prima nel regolamento secondo R00.
- **Test:** clock controllato per prima/al/oltre il confine, scadenze simultanee, leave doppio e ultimo umano; scenari CLI multiaccount reali per il ciclo di vita, senza attese reali superflue; browser per avvisi e ritorno all'hub.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento alto**: concorrenza e ordine degli eventi rendono costoso correggere errori a valle.

### I23 — Reconnect nella stessa partita (P1; F06/F17/F31)

**Stato 25 ottobre 2026: completato dopo I14 e I26.** Nuova connessione dello stesso account riprende il match del processo vivo entro 30 s, anche vsCom, senza nuova factory o reinvio della mossa pendente. Sessione unica e comandi/callback vecchi verificati; clock multiplayer continuo, tentativi senza reset, termine esatto e rientro tardivo con risultato. Sette scenari CLI distinti con clock controllato, export/esito unico riletti indipendentemente; debug a due account per pending, messaggi, rientro ed esito tardivo. Restart effettivo di JAR con attivo e stesso DB: nessun restore, vecchio runtime negato. Nessuna dipendenza inversa I14→I23. Verifiche 237/25 ordinarie, 306 nel contesto completo e check-rules verdi. [Report con evidenze](../reports/i14-i23-report.md). Restano I17, recupero/registro attivi I19b e restart-draw I24.

- **Prerequisiti:** I14/I26 e I06/I09 acquisiti; R02 sul clock mossa durante disconnect. Nessuna dipendenza inversa I14→I23.
- **Accettazione:** stesso account rientra entro 30 s nella partita del processo vivo, anche vsCom; vista e mossa pendente coerenti, nessuna doppia sessione o nuovo match. Rientro tardivo riceve l'esito, nessun reset del termine tramite ripetuti tentativi. Nessun restore dopo restart.
- **Test:** CLI con connessioni distinte e drop prima/dopo submit, messaggi vecchi, doppio login e confini; debug per riconnessione e messaggi percepiti dall'utente.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento alto**: identità, trasporto e due clock richiedono una revisione coordinata.

### I17 — Multiplayer, due sottoincrementi (P1; F15)

**Stato I17a, 25 ottobre 2026: completato.** Dieci scenari con cinque account sintetici e trasporti distinti, code reali e SQLite isolato: join duplicati/concorrenza, ready privato, viste/pending private, partite complete con vittoria e draw, mosse concorrenti, estranei, timeout/reconnect prima/al/oltre termine, due partite isolate e secondo avvio. Riprodotto e corretto il ready condiviso che raggiungeva sessioni estranee; canale privato allineato con CLI/debug/policy/API, regole 1.5 invariate. Accettazione visiva conclusa con due contesti Edge separati, normale per Alice e InPrivate per Bob: join/ready reciproci, mani private, round e risorse aggiornati sui due lati, pending e Play disabilitati, rientro nello stesso match senza reinvio, timeout/draw/leave ed esiti coerenti, hub e logout. Tre partite UX su database nuovo si aggiungono alle 21 CLI; export già supportato identico per i due partecipanti, completo e riletto indipendentemente da SQLite. 237 server + 26 client ordinari, 316 server nel contesto completo separato e check-rules verdi; sorgenti invariati durante la chiusura UX. Screenshot, log e limiti nel [report I17a](../reports/i17a-report.md). I precedenti arresti degli strumenti restano storici e superati dalla verifica riuscita.

**Stato I17b, 25 ottobre 2026: completato dopo riverifica I17a e prerequisiti.** Tredici scenari CLI con sei account distinti: start anticipato a due e automatico a cinque, bot, duplicati, uscita/reinserimento, join/start concorrenti, viste/pending private, partite complete e forfait del solo uscente con prosecuzione. Clock controllato per prima/al/oltre scadenza, batch simultanei, pending/reconnect nello stesso turno e dopo risoluzione in assenza, esito unico ed export riletti da SQLite. Corretti ready FFA pubblico e classificazione 1v1 della FFA a due; nessun proprietario lobby o nuova persistenza. Breve UX con Alice/Bob contemporanei nel browser integrato: coda/comandi condivisi, bot, mani, round dopo leave, reconnect, timeout finale e hub. 237 server + 27 client ordinari, 329 server nel contesto completo separato, 13 FFA mirati finali e check-rules PASS. Regolamento 1.5 invariato; I19b/I24/I19c/I22 aperti. [Report I17b, prove e limiti](../reports/i17b-report.md).

- **Prerequisiti:** I13/I14/I23/I26; Q09 conserva le code e i comandi FFA senza ruoli privilegiati.
- **I17a:** quick 1v1 con due umani, viste private ed esito completo; join duplicato non occupa posti e sessioni concorrenti non si contaminano.
- **I17b:** FFA con avvio anticipato a due e piena a cinque, aggiunta bot, uscita/reinserimento, timeout/reconnect e fine corretti; nessun proprietario lobby introdotto.
- **Test:** CLI multiaccount per join/start concorrenti, estranei, partite complete ed export; clock controllato per i confini. Browser separati solo per interazione e aggiornamenti visibili. Un solo client non certifica il multiplayer.
- **Modello consigliato I17a e I17b:** **GPT-6.1 Sol, ragionamento alto**: isolamento, code e concorrenza richiedono contesto trasversale; completare a prima di b limita rilavorazioni.

### I24 — Restart chiude gli attivi in draw (P1; F24/F27)

**Stato 26 ottobre 2026: completato dopo verifica I14/I19b/I26.** Decisione R06 recepita prima del codice nel regolamento 1.6: draw dopo arresto pulito o crash, motivo consultabile «riavvio server», nessun restore giocabile o Elo. Recupero durevole prima della chiusura; registro V003 riusato con OUTCOME e marker atomici, senza migrazioni o modifiche ai dati precedenti/conclusi. Quattro prove dirette e tre scenari con JVM server/CLI reali: quattro attivi (una per modalità), un concluso, pending, tre riavvii successivi, kill durante la seconda transazione e recupero dei restanti. Prefissi/export/legacy preservati, esiti privati, vecchie viste/mosse negate; debug finale verificato con dialogo, Continue e hub. PASS: 249 server + 28 client, contesto Spring separato 356, check-rules, JAR e build client. [Report, evidenze e limiti](../reports/i24-report.md). I19c e I22 restano aperti; nessuna loro chiusura implicita.

- **Prerequisiti:** I14/I19b/I26; R06 deve chiarire arresto pulito/crash e comunicazione dell'esito prima dell'implementazione.
- **Accettazione:** registro persistente minimo consente di finalizzare una sola volta ogni attivo in draw; conclusi invariati, dati precedenti conservati, esito consultabile e nessun match riprendibile. Nessun effetto Elo.
- **Test:** orchestrazione server/CLI con più attivi e un concluso, restart ripetuti e interruzione durante finalizzazione; crash secondo R06. Storage isolato, nessun checkpoint del motore; I19c controlla il manifest risultante.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento alto**: durabilità ed esattamente una finalizzazione richiedono controllo dei guasti e degli stati intermedi.

### I22 — Verifica e approvazione della versione base (P2; F30)

**Stato 26 ottobre 2026: completato; base approvata esplicitamente dal proprietario.**
Conclusa la parte tecnica: monorepo unico, cronologie archiviate integralmente
su autorizzazione e modifiche preesistenti conservate; corretta la ripetibilità
delle sole fixture I19b senza cambiare attesi o comportamento di gioco.
PASS: 249 server + 28 client; contesto Spring separato 356, zero errori/fallimenti/skipped;
regolamento/catalogo, build principali e da sorgenti puliti, due avvii del JAR,
manifest/export↔SQLite nelle quattro modalità e nei cicli I19b/I24.
348 input di build e 187 entry applicative dei JAR identici; contenitori JAR e
bundle Angular identificati separatamente, senza promessa di identità binaria
fra percorsi. UX separata acquisita nei report precedenti, sorgenti applicativi
invariati. [Report, limiti e approvazione](../reports/i22-report.md),
[manifest del candidato](../reports/i22-candidate.json). Il proprietario ha approvato esplicitamente `I22-3e71300e057687ba` e i limiti del
report il 26 ottobre 2026: [registrazione](../reports/i22-approval.json). **I22 e la
roadmap della base sono conclusi**; nessun backlog o deploy.

- **Prerequisiti per chiusura:** tutti gli incrementi correnti sopra, compreso I19c; le regressioni si aggiungono a ogni consegna, non solo alla fine.
- **Accettazione tecnica:** ambiente pulito/cache documentata, build e prove unit/integration/contratto/CLI ripetibili, nessun caso critico silenziosamente saltato. Quattro modalità, carte, mazzi, autorizzazioni, log, sessione unica, reconnect, timeout/forfait e restart-draw coperti. UX del debug verificata separatamente; documenti di API/setup/dati/stato allineati a ciò che esiste.
- **Comandi obbligatori:** `./scripts/build.ps1 -Task Test -Offline`, `python scripts/check-rules.py` e separatamente `./scripts/build.ps1 -Task TestServerContext -Offline`. I runner CLI I26 e degli incrementi successivi sono integrati nel contesto separato; [comandi e contratto CLI](../cli.md). Unit verdi non dimostrano avvio Spring riuscito.
- **Consegna:** identificativo riproducibile del candidato (revisioni delle repository e hash artefatti), manifest configurazione/regole/catalogo, report degli scenari automatici e UX, limiti noti e guida locale; nessun difetto bloccante aperto. Eventuale CI usa gli stessi comandi, senza introdurre hosting come prerequisito.
- **Approvazione:** il proprietario esamina il candidato concreto e ne registra esplicitamente approvazione, data e limiti accettati. Fino ad allora lo stato è «candidato verificato», non «base approvata». Approvazione effettiva del 26 ottobre 2026 registrata sopra, distinta dalle precedenti revisioni di pianificazione.
- **Modello consigliato:** **GPT-6.1 Sol, ragionamento alto**, per correlare prove e requisiti e rilevare lacune; Luna per soli aggiornamenti meccanici dei report già validati. L'approvazione resta umana.

## Backlog successivo, fuori dalla roadmap della base

Non viene definita una seconda fase di prodotto: dopo l'approvazione si decideranno obiettivi e ordine. Si conservano i riferimenti esistenti per tracciabilità, senza farne gate o assegnare date.

| Riferimento | Tema differito | Modello indicativo solo se il lavoro verrà riattivato |
|---|---|---|
| I25 / F38 / residuo R08 | Elo: rimosso dal percorso corrente, parametri e modalità tutti da decidere | GPT-6.1 Sol, alto, per formule e idempotenza; rivalutare al momento |
| I18 / F26 | Parità Phaser e client finali desktop/web/mobile, da ridefinire | GPT-6.1 Sol, medio, per UI e contratto; rivalutare sullo scope |
| I20 / F28 | Amministrazione e ruoli, da studiare | GPT-6.1 Sol, alto, per autorizzazioni e dati |
| I21 / F29 | Hosting/distribuzione, nessun deploy richiesto | GPT-6.1 Sol, medio, una volta definiti ambiente e vincoli |
| F05/F36, F33–F37 | Email/recupero, economia, open PvP, premi/cronologia/replay, contenuti e bilanciamento | Da scegliere quando esisteranno incrementi approvati |

La raccolta per analisi rimane nella base; non richiede ranking, replay utente o un set definitivo. Il restore giocabile dopo restart resta escluso. Questa roadmap termina con la base approvata: non autorizza implicitamente gli sviluppi futuri.

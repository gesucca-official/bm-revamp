## Stato corrente I22 — 26 ottobre 2026

Candidato I22 verificato: 249 server + 28 client, contesto Spring separato 356
PASS (zero failure/error/skipped), controllo regole, build pulite, avvii JAR e
manifest/export↔SQLite PASS. Approvazione esplicita del proprietario pendente. Tutti gli incrementi
tecnici prerequisiti, incluso I19c, sono implementati e verificati nei rispettivi
report; nessun backlog futuro avviato. Monorepo locale in `E:/bm`, cronologie
precedenti conservate su autorizzazione del proprietario. Regolamento 1.6,
quattro modalità, CLI, mazzi strutturali, sessione unica, clock/forfait/reconnect,
archivio completo e restart-draw. [Report corrente I22](reports/i22-report.md).
La base non è ancora approvata; le sezioni datate sotto sono storiche.

> **I19c completato, 26 ottobre 2026.** Verificatore ripetibile indipendente per 7 conclusioni ordinarie delle quattro modalità, 12 cicli I19b (169 eventi) e 12 chiusure I24 (12 OUTCOME draw, 36 eventi totali). Controllati tutti i byte evento esportati contro SQLite, ordine/hash/duplicati/gap, stati/versioni/report/transizioni/esiti, ricevute del registro, tre export dopo riavvio, segreti e preservazione dei dati preesistenti. Individuato e superato un riepilogo storico I19b con ID/hash obsoleti: non usato come fonte di verità. [Report e manifest](reports/i19c-report.md); comando `python scripts/verify-match-manifests.py`. Regolamento 1.6 invariato; nessun difetto strutturale riprodotto. **I19c chiude; I22 resta aperto.**

> **I24 completato, 26 ottobre 2026, dopo verifica I14/I19b/I26.** Regolamento 1.6/R06 aggiornato prima del codice. Draw degli attivi al restart pulito/crash con finalizzazione atomica unica sul registro V003; recupero delle scritture prima della chiusura, conclusi/prefissi/legacy invariati. Ricevuta privata «riavvio server», nessun runtime ripristinato o Elo. Quattro prove dirette e tre scenari server/CLI con quattro attivi, un concluso, restart ripetuti e kill durante transazione; debug finale per esito/Continue/hub e ricevuta tardiva innocua. **249 server + 28 client**, contesto Spring separato **356 PASS**, check-rules, JAR e client build PASS. [Report, prove e limiti](reports/i24-report.md). I19c e I22 restano aperti; le sezioni datate sotto sono storiche.

> **I19b completato, 26 ottobre 2026.** Dopo I17a/b, raccolta/export JSON 1 comuni alle quattro modalità, leave/forfait, timeout e reconnect; V003 compatibile con registro persistente degli attivi e finalizzazioni atomiche idempotenti. Batch locali immutabili e retry dopo commit del motore, al riavvio del solo archivio e nel processo vivo, senza rieseguire round. Otto nuove prove dirette e dodici scenari CLI: 169 eventi, manifest esatti senza duplicati o mancanti, byte/hash identici al confronto SQLite indipendente; guasti e durabilità/riapertura/concorrenza verificati. **245 server + 27 client**, contesto Spring separato **349 PASS**, check-rules, JAR e due avvii sintetici PASS. Regolamento 1.5 invariato; nessuna nuova UX. [Report I19b e limiti](reports/i19b-report.md). I24/I19c/I22 restano aperti: nessun restart→draw o restore giocabile implementato. Le sezioni datate sotto rimangono storiche.

> **I17b completato, 25 ottobre 2026.** FFA a due/cinque, bot, code/concorrenza, viste private, partita completa, forfait individuale e prosecuzione, batch timeout e reconnect con clock controllato. Ready privato e modalità FFA a due corretti; nessun proprietario lobby o nuova persistenza. 13 scenari CLI con sei account, UX debug a due sessioni, export e rilettura SQLite. 237 server + 27 client ordinari, 329 server nel contesto separato, 13 FFA mirati finali e check-rules PASS. Regolamento 1.5 invariato. [Report ed evidenze](reports/i17b-report.md). I19b/I24/I19c/I22 restano aperti; le sezioni precedenti riportate sotto sono storiche.

> **I17a completato, 25 ottobre 2026.** Quick 1v1 con due umani distinti, dieci scenari CLI/21 partite per concorrenza, isolamento, clock/reconnect ed export; ready privato ai soli partecipanti. Accettazione visiva in due contesti Edge isolati (normale Alice, InPrivate Bob), tre partite aggiuntive: round e aggiornamenti reciproci, mano privata, pending conservata dopo rientro, esiti timeout/draw/leave, hub e logout. Export UX completi e identici per entrambi, riletti da SQLite. Regolamento 1.5 e sorgenti applicativi invariati nella chiusura UX. 237 server + 26 client, 316 server nel contesto separato e check-rules PASS; [report e prove](reports/i17a-report.md). Nessun blocco I17a residuo; I17b ora completato separatamente (report I17b), nessuna chiusura I19b/I24/I22. Le sezioni datate sotto restano storiche.

> I14/I23, 25 ottobre 2026: completati nei criteri della roadmap dopo verifica reale I13/I19a/I26. Regolamento 1.5: clock mossa multiplayer continuo, forfait/finalizzazione/cleanup coerenti, rientro nello stesso processo entro 30 s anche vsCom, pending e sessione unica preservate, rientro tardivo e nessun restore verificati. Test ordinari **237 server + 25 client PASS**; contesto Spring separato **306 PASS** e check-rules PASS. Debug separato per avvisi, pending, timeout, coda e hub. [Report, comandi, evidenze e limiti](reports/i14-i23-report.md). Restano I17, retry/registro attivi I19b e restart-draw I24/I19c; nessuna chiusura I22. Le sezioni datate sotto rimangono storiche.

> I16, 25 ottobre 2026: open 1vCom completato con due mazzi salvati distinti via CLI fino a esito/export, configurazioni runtime e isolamento dopo modifica/delete verificati; rifiuto assente/altrui e UX scelta/errori nel debug. I13/I15/I26 riverificati. 219 server + 21 client ordinari, 281 server nel contesto separato, check-rules verde. Regolamento 1.4 invariato. [Report e limiti](reports/i16-report.md). Le sezioni datate precedenti restano storiche.

> I13, 24 ottobre 2026: quick 1vCom completo verificato via CLI con umano Bruiser e Junkie; UX debug separata con casualità reale fino al vincitore e secondo avvio. Nessuna meccanica modificata. [Report, comandi e limiti](reports/i13-report.md). Le evidenze precedenti restano storiche.

> Aggiornamento 24 ottobre 2026: **I19a completato nel perimetro quick/F27**, I26 e I12 riverificati. Archivio eventi immutabili con versioni/stato/ordine iniziale pre-pesca, mosse/report/transizioni/esito ed export JSON CLI; migrazione V1→V2 su copia isolata e guasti post-commit osservabili senza rollback del round. PASS: 218 test server + 18 client; contesto completo separato 277 test; check-rules; JAR e due avvii sintetici. [Report I19a, prove e limiti](reports/i19a-report.md), [contratto](match-archive.md). Nessuna nuova UX manuale, I19b/restart/restore non avviati; prossimo I13. Le evidenze datate sotto rimangono storiche.

> Aggiornamento 24 ottobre 2026: I26 confermato e **I12 completato** contro R07 1.3. [Matrice delle 39 carte e token](reports/i12-card-matrix.md), [report I12](reports/i12-report.md): 87 nuovi casi diretti, tre round CLI per oggetto/scarto/token, prove I11 conservate. Suite ordinaria 210 server + 18 client e contesto completo separato 267 test PASS; controllo regole/catalogo PASS. Regole invariate; nessuna nuova prova UX. Prossimo I19a, non avviato. [Roadmap della base](roadmap.md); Elo/I25/F38 rinviato e approvazione finale I22 ancora futura. I censimenti e i risultati datati sotto restano storici.

## Aggiornamento I11 - 23 ottobre 2026

I11 completato: regolamento **1.1**, stati MadeOfStone/BrokenBeerBottle indipendenti, parita secondo ordine dei partecipanti, rollback locale dell'ultimo comando in caso di errore di risoluzione e viste da snapshot coerenti. Report/notifiche dopo commit; fallimenti di pubblicazione non annullano il round. 137 test server completi, 83 ordinari e 18 client verdi; build riuscite. Nessuna nuova partita completa/browser certificata. [Report I11](reports/i11-report.md). Prossimo I26 secondo la revisione della roadmap; partita completa a I13. Segue lo storico, subordinato al regolamento 1.1.

## Aggiornamento I10 - 23 ottobre 2026

I10 completato: quick/1vCom reale dal browser Debug, ready privato, vista iniziale, primo round e ritorno alla mano verificati senza errori console. Test deterministico su STOMP reale verifica unico ready/gameId, due partecipanti, errore controllato e nuovo invio, costi/danni/pesca e una mossa bot per round; estraneo non riceve ready altrui. Client Debug iniziale, join duplicati bloccati mentre pending, pulsante Continue nei riepiloghi. 132 test server completi, 78 ordinari e 18 client verdi; build riuscite. Nessuna regola o politica del bot modificata. Partita completa non certificata. [Report I10](reports/i10-report.md). Prossimo I11. Segue lo storico.

## Aggiornamento I09 - 23 ottobre 2026

I09 completato per contratto vista/comando: dead/bindingName nella vista, modello client deck allineato, validatore JSON prima del motore e blocco UI delle scelte incomplete. Partita fixture su STOMP reale: vista privata, mossa valida senza pagamento anticipato, duplicato/null rifiutati senza sostituire la mossa, estraneo e gameId incoerente negati. 131 test server completi, 78 ordinari e 17 client verdi; build riuscite. Nessun round o match completo dal browser certificato: I10 resta il prossimo incremento. [Report I09](reports/i09-report.md). Segue lo storico.

## Chiusura verifica visuale I07 - 23 ottobre 2026

Verifica completata in una nuova sessione browser: login devAlice, dialogo applicativo Log Out confermato, ritorno al login con campi vuoti e pulsante disabilitato, nuovo accesso e profilo devAlice/USER ricevuto. Con devBob nella seconda scheda, secondo logout di Alice: presenza 2 -> 1; nuovo accesso: 1 -> 2. Nessun errore console nei due client. **I07 completato anche sul percorso visuale dell'hub.** Le precedenti indicazioni di verifica pendente sono storiche e superate da questa prova. Il blocco precedente era osservato negli strumenti: la presenza di un dialogo nativo aperto non e stata confermata dall'utente.

Prova con JAR e sorgenti gia compilati, nessuna modifica applicativa aggiuntiva; database sintetico in `.build-logs/i07-final-browser/application.sqlite`. Log server/client nella stessa cartella. Nessuna partita, reconnect nel match o forfait certificato.

## Aggiornamento I07/I08 - 23 ottobre 2026

I08 verificato: 37 binding runtime, due starter e mano iniziale, errori espliciti delle factory; nessuna modifica alle regole. I07 implementato con logout esplicito, reset, presenza senza sessionId e gestione errore profilo. Test: 127 server completi, 75 ordinari, 13 client; build verdi. **Verifica visuale finale logout/login ancora da completare**: dialogo nativo precedente ha bloccato gli strumenti browser; ora sostituito da dialogo applicativo. [Report, evidenze e procedura manuale](reports/i07-i08-report.md). Segue lo storico.

## Aggiornamento I06 - 23 ottobre 2026

I06 completato per autenticazione e autorizzazione inbound: CONNECT diretto obbligatorio, una sola sessione attiva per account con rifiuto della seconda, SEND/SUBSCRIBE in allowlist, identita e membership controllate, routing privato Spring allineato al client, log amministrativi protetti. 74 test server ordinari, 85 con contesto/trasporto reale e 9 client verdi; build server/client verdi. Browser: login e profilo privato devAlice ricevuti senza errori. Non certificata partita completa; membership testata con fixture. Reconnect con recupero partita entro 30 secondi deciso ma ancora I23; coordinamento clock mossa aperto. [Report I06](reports/i06-report.md). Segue lo storico.

## Aggiornamento I05 - 23 ottobre 2026

I05 completato: provisioning locale opt-in di due identita persistenti senza SMTP, password BCrypt, duplicati preservati. Login REST e STOMP dal browser riuscito per Alice e Bob con profilo e due utenti connessi; password errata rifiutata. Smoke con riavvio senza seed passato. 69 test server ordinari, 77 includendo contesto, 9 client verdi; build verdi. Non certificati autorizzazioni/sessione unica (I06), logout/reconnect, mazzi via UI e partita completa. [Report I05](reports/i05-report.md). Segue lo storico.

## Aggiornamento I04 - 23 ottobre 2026

I04 completato: bootstrap browser, Markdown, home/hub/sign-up, wildcard e accesso Phaser senza sessione verificati. Corrette dipendenza DatePipe, ricorsione logging, matcher null, URL disponibilita e proxy WebSocket. Build produzione verde (warning budget 2,21 MB); 65 test server + 6 client verdi. REST attraverso proxy e upgrade WebSocket 101 verificati. Login STOMP, account utilizzabili e partita restano non verificati; prossimo I05. [Evidenze e limiti](reports/i04-report.md). Segue lo storico.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

**Verifica più recente I03:** contesto Spring ora verde; **73 test server** nel clean verify completo, **65 server + 4 client** nella suite ordinaria. JAR avviato due volte su loopback con nuovo SQLite sintetico, dati persistiti verificati. PostgreSQL sostituito, catalogo read-only. Nessuna partita/browser ancora certificata. [Report I03](E:/bm/docs/reports/i03-report.md). Le precedenti indicazioni di contesto rosso sono storiche.

# Stato dell'implementazione

**Verifica più recente I02:** suite isolata con **8 test server e 4 client superati**, regressioni rilevate su copie separate. Il profilo completo continua a fallire su `contextLoads` (9 test, 1 errore DB). Nessuna partita, browser o persistenza certificati da questi test. [Report I02](E:/bm/docs/reports/i02-report.md). Le sezioni precedenti a questa verifica restano evidenze storiche.

**Verifica più recente I01:** server e client compilano con toolchain locale fissata; il runner JUnit esegue 1 test e restituisce 1 errore di caricamento contesto per datasource esterno non configurato. I vecchi blocchi di download non rappresentano più l'esito della build. Dettagli in [i01-report.md](E:/bm/docs/reports/i01-report.md). Nessuna partita o funzione di gioco è promossa a verificata.

**Aggiornamento requisiti del proprietario:** i dettagli osservati sotto restano fatti del legacy, non il perimetro finale richiesto. Vedere la sezione conclusiva e [decisioni Q01–Q18](E:/bm/docs/open-questions.md). Nessuna implementazione o nuova verifica eseguita in questa integrazione.

**Presente** significa che esiste un percorso concreto nel codice, non che sia stato collaudato. **Parziale** indica percorso presente con lacune verificabili. **Non rilevato** indica assenza nelle copie esaminate, non cancellazione di un requisito noto. **Non verificabile** indica una prova runtime bloccata o informazioni mancanti.

## Funzioni applicative

| Funzione | Stato | Evidenza e limite |
|---|---|---|
| Registrazione con email | Parziale | [AuthServiceImpl.sendVerificationEmail/completeRegistration](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/AuthServiceImpl.java:47) genera codice e salva BCrypt; [SignUpComponent](E:/bm/bm-web-client/src/app/connection/sign-up/sign-up.component.ts:8) ha URL disponibilità senza `/rest`. Codice non legato all'email, nessuna scadenza/tetto tentativi nel servizio. SMTP non provato. |
| Login | Presente, robustezza parziale | [UserLogInController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/rest/users/UserLogInController.java:14) verifica e restituisce booleano; CONNECT riverifica credenziali. Controllo doppio login solo in preflight REST, non nel CONNECT. |
| Autorizzazione account/partita | Parziale critica | [UserController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/UserController.java:14) e [GameController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/GameController.java:15) accettano identità richieste senza confronto principal; STOMP permitAll. |
| Presenza e attività | Presente, gestione disconnessione parziale | [ConnectionsServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/ConnectionsServiceImpl.java:18) conserva e trasmette utenti; disconnect restituisce login dall'header anziché dall'utente trovato tramite sessionId. |
| Quick 1vCom | Presente staticamente | [GameFactoryServiceImpl.craftQuick1vComGame](E:/bm/bm-server/src/main/java/com/gsc/bm/service/factories/GameFactoryServiceImpl.java:28), join nel client; partita reale non verificata. |
| Quick 1v1 / FFA | Presente, code parziali | [QueueServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/QueueServiceImpl.java:14): 2/5 posti, FFA forzabile da 2; nessuna deduplicazione join. Controller permette aggiunta bot/avvio senza verificare appartenenza. |
| Open 1vCom | Presente, persistenza non verificata | [PlayerFactoryServiceImpl.craftOpenPlayer](E:/bm/bm-server/src/main/java/com/gsc/bm/service/factories/PlayerFactoryServiceImpl.java:51) ricostruisce mazzo utente; mapping PK mazzi incoerente. |
| Open multiplayer | Non rilevato | [OpenGameQueuesController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/OpenGameQueuesController.java:11) e menu [choose-game.component.html](E:/bm/bm-web-client/src/app/connection/choose-game/choose-game.component.html) espongono solo 1vCom. |
| Motore turni simultanei | Presente, validazione parziale | [Game.resolveMoves](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Game.java:104); [Move.isValidFor](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Move.java:75) non verifica tutti i target/invarianti. |
| Bot | Presente, casuale | [ComPlayer.chooseMove](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/ComPlayer.java:17) prova carte casuali, seleziona un target, verifica mossa; nessuna strategia/ricerca delle migliori mosse. |
| Danni, risorse, stati, timer | Presente con anomalie | [Character](E:/bm/bm-server/src/main/java/com/gsc/bm/model/Character.java:17), [Status](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/status/Status.java:13); vedi [regole](E:/bm/docs/game-rules.md). |
| Catalogo carte/personaggi | Presente | SQLite verificato: 37 carte, 2 personaggi; factory caricano effetti dal codice e GUI dal DB. |
| Collezione personale | Semplificazione esplicita | [UserAccountServiceImpl.getUserCardCollection](E:/bm/bm-server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java:53): “for now everyone has all the cards”; nessun possesso individuale persistito. |
| Editor e salvataggio mazzi | Parziale | [EditDeckComponent](E:/bm/bm-web-client/src/app/user-hub/collection/edit-deck/edit-deck.component.ts:12), servizio account; validazione solo UI, nessun limite copie, mapping JPA da verificare. |
| Gioco debug | Presente staticamente | [DebugClientComponent](E:/bm/bm-web-client/src/app/client-debug/debug-client.component.ts:16) mostra report e chiama leave a fine partita; [CardInHandComponent](E:/bm/bm-web-client/src/app/client-debug/card-in-hand/card-in-hand.component.ts:12) costruisce scarto/target item. Nessun test browser. |
| Gioco Phaser | Parziale | [BattleScene](E:/bm/bm-web-client/src/app/client-phaser/scnenes/battle/battle-scene.ts:10): rendering/drag-drop/report, ma oggetti senza TARGET_ITEM e `playTimeBasedAnimation` privo di implementazione effettiva. |
| Fine partita Phaser | Parziale | [PhaserClientComponent.viewUpdateCallback](E:/bm/bm-web-client/src/app/client-phaser/phaser-client.component.ts:58) distrugge il gioco e pulisce lo stato, ma non invia leave/unsubscribe e continua nel ramo restart della scena. |
| Recovery/resa/timeout | Non rilevato come flusso completo | [WebsocketService](E:/bm/bm-web-client/src/app/service/websocket.service.ts:11), [PresenceEventListener](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/PresenceEventListener.java:14), servizio sessioni: nessuna procedura completa di riconnessione, resa o scadenza turno. |
| Logging/amministrazione | Presente, incompleto | [GameLoggingServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/GameLoggingServiceImpl.java:22), controller log, pannello Angular; nessun test DB, ingestione client non autenticata e nessuna retention. |
| Economia, trading, pacchetti, ranking | Non rilevato | Nessuna entità/repository/controller nel censimento oltre a utenti, mazzi, catalogo e log; non si assume che fossero richiesti. |

**V:** esiste un logout UI: [ToolbarComponent.logOut](E:/bm/bm-web-client/src/app/home/toolbar/toolbar.component.ts:17) chiede conferma e ricarica la pagina con `window.location.reload()`. Non invia un comando applicativo di logout o leave; il cleanup dipende dalla disconnessione del trasporto e dai limiti del server descritti sopra.

## Test e strumenti

**V:** [BmServerApplicationTests.contextLoads](E:/bm/bm-server/src/test/java/com/gsc/bm/BmServerApplicationTests.java:7) è l'unico test automatico trovato: metodo vuoto con `@SpringBootTest`, quindi controlla il caricamento del contesto se eseguito. Non copre regole, autorizzazione, contratti o persistenza con asserzioni dedicate.

**V:** [angular.json](E:/bm/bm-web-client/angular.json) configura `skipTests` per gli schematics, non ha un target `test` e contiene un lint che cita `tsconfig.spec.json` ed `e2e/tsconfig.json`, assenti. [package.json](E:/bm/bm-web-client/package.json) ha build/start/lint ma non test. La dipendenza Protractor non prova l'esistenza di una suite e2e.

**V:** [TestBattleSceneComponent](E:/bm/bm-web-client/src/app/client-phaser/scnenes/battle/test-battle-scene/test-battle-scene.component.ts:12) contiene una vista JSON fissa e avvia la scena; è un componente dimostrativo, non un test con runner e asserzioni. È dichiarato nel modulo ma non ha route e il suo selector non risulta usato da altri template censiti: **D**, apparentemente scollegato dal percorso normale.

**M:** test server e build client non completati per prerequisiti mancanti; esiti esatti in [setup.md](E:/bm/docs/setup.md). Nessuna copertura percentuale disponibile.

## TODO, commenti e falsi segnali di incompletezza

**V:** la ricerca di TODO/FIXME/HACK nelle due copie ha trovato TODO e commenti informali, ma non una lista strutturata di lavoro. Gruppi principali:

| Tema | Punti rilevati |
|---|---|
| Sicurezza | TODO “authenticate this” in [WebClientLogsController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/rest/panel/WebClientLogsController.java:20) |
| Ciclo di vita | TODO sulla chiusura di un giocatore in coda in [GameSessionServiceImpl.newGame](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/GameSessionServiceImpl.java:35); sottoscrizione FFA mai annullata in [WebsocketService.joinGame](E:/bm/bm-web-client/src/app/service/websocket.service.ts:68) |
| Regole/validazione | TODO in [Move.isValidFor](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Move.java:75), target multipli in [ComPlayer.choseTarget](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/ComPlayer.java:35), cattura output timer in [Character](E:/bm/bm-server/src/main/java/com/gsc/bm/model/Character.java:17) |
| UI Phaser | Target item, dettagli durante drag, timeout dell'animazione scarto e globali window nei file Phaser citati |
| Manutenibilità | Duplicazioni in ViewExtractor/DeckFactory, account monolitico da caricare, cache auth ipotizzata, riflessione con ritorno null |
| Documentazione | Entrambi i README riportano TODO per una descrizione sensata del progetto |

**V:** molti `applyEffectOnSelf` o `applyEffectOnTarget` ritornano null intenzionalmente; `AbstractCard.resolve` li trasforma in liste vuote. Non sono da classificare automaticamente come carte incompiute. Analogamente gli hook vuoti possono significare assenza di effetti aggiuntivi. [AbstractCard](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/AbstractCard.java:20).

**D:** casi realmente sospetti sono invece `SoberUp`, fuori catalogo e senza bersagli inizializzati, `Card.DeserializedCard.resolve` (DTO di input, non carta eseguibile) e `BattleScene.playTimeBasedAnimation` senza corpo operativo. Si distinguono ruoli dei DTO, codice non raggiunto e funzionalità UI incompleta; non si deduce una feature dal solo nome.

## Verifiche da completare

Prima bootstrap JPA e Angular, poi registrazione/login e routing STOMP; quindi round-trip mazzi e partite nelle quattro modalità esposte. Servono prove su rifiuto identità/target invalidi, costi/annullamenti, morte durante il turno, singolo uso e durata stati, disconnessione, avvio FFA, fine partita e cleanup. Questo è un elenco di verifiche mancanti, non attività eseguite né correzioni applicate.

## Aggiornamento: seconda verifica effettiva del 23 ottobre 2026

Le evidenze statiche precedenti restano valide con i limiti indicati. La nuova verifica ha tentato esplicitamente compilazione, test e avvio; comandi riproducibili, messaggi d'errore e percorso minimo sono in [verification-report.md](E:/bm/docs/reports/verification-report.md).

| Area | Nuovo risultato osservato | Interpretazione |
|---|---|---|
| Server: `test`, `compile`, `spring-boot:run` | Tutti bloccati sulla risoluzione del parent Spring Boot 2.4.3 con Maven locale offline | Problema di provisioning; compilazione, test runner e contesto Spring non raggiunti |
| Angular: build, serve, lint | `ng` assente, node_modules assente | Dipendenze locali mancanti; nessuna diagnosi di compilazione TypeScript/AOT ottenuta |
| Express: `node server.js` | `Cannot find module 'express'` | Avvio fallito prima del listener o del proxy |
| Client: comando test | `Missing script: test` | Lacuna della configurazione dei test, distinta dai problemi locali |
| Repository pubblici dipendenze | Due richieste anonime a Maven Central e npm bloccate da WinError 10013 | Restrizione di rete dell'ambiente; installazione dipendenze non completata |
| SQLite | Query read-only, integrità ok, FK check senza righe; conteggi riconfermati, hash invariato | Catalogo leggibile; non dimostra il funzionamento JDBC/Hibernate |
| PostgreSQL | Nessun eseguibile nel PATH, servizio corrispondente o installazione nelle posizioni controllate | Non avviato; non esclude installazioni altrove. Nessun DB reale contattato |

**Risultato test:** zero test applicativi eseguiti, quindi nessun test applicativo dichiarato superato o fallito per asserzioni. Il solo `contextLoads` resta non eseguito. Non sono stati trovati test specifici per sessione, autorizzazioni, partita, regole, bot, mazzi o persistenza; il componente Phaser con JSON fisso resta una demo.

**Percorso minimo statico:** account sintetico su PostgreSQL/SMTP isolati → validazione REST → CONNECT SockJS/STOMP → join quick 1vCom → ricezione gameId → richiesta vista → carta realmente in mano con target/choices validi → mossa automatica bot e risoluzione → nuova vista dopo update → ripetizione fino a over e leave. Il client debug è il candidato minimo perché costruisce TARGET_ITEM; ciò non costituisce una prova che sia utilizzabile. Nessun passaggio applicativo del percorso è stato eseguito end-to-end.

**Stato e persistenza:** richiesta view/getGame recupera soltanto una partita ancora in memoria del processo. Salvataggio e rilettura mazzi hanno percorsi repository ma non sono stati provati. I log su PostgreSQL sono condizionati da `log.db=Y` e non implementano il ripristino di una partita. Non è stata trovata una procedura di salvataggio/ripresa del motore dopo restart; non va confusa con l'esportazione dei log.

**Blocchi attuali:** dipendenze/rete e provisioning DB impediscono ora ogni partita completa. Mapping ID dei mazzi, provider DatePipe, registrazione UI, target item Phaser, DTO e cleanup restano anomalie statiche da confermare una volta raggiunto il runtime; non sono presentate come errori di compilazione osservati. Nessun sorgente corretto e nessuna credenziale reale utilizzata.

**Verifiche manuali pendenti:** bootstrap JPA/Angular, registrazione con SMTP di test, destinazioni private STOMP, partita intera debug e Phaser, 1v1/FFA con utenti distinti, salvataggio/rilettura mazzo e open 1vCom, log asincroni, fine partita e disconnessione. La checklist dettagliata e i prerequisiti sono nel report collegato sopra.

## Integrazione delle risposte del proprietario — requisiti e stato distinti

| Requisito deciso | Stato effettivo conservato | Impatto sul piano |
|---|---|---|
| Stack/versioni liberi, nessun DDL originale; PostgreSQL facoltativo | Soluzione alternativa non scelta, prerequisiti legacy ancora bloccati secondo report | I01/I03 confronto motivato e ricostruzione, non attesa del DDL perso |
| Debug corrente, Phaser e client finali successivi | Debug/Phaser restano non verificati/parziali; nessun nuovo client | I18 differito, debug gate attuale |
| Regolamento normativo 1.3, vecchia Q03 superata | Conformità e revisioni documentate separatamente | I12 completa le lacune; niente bilanciamenti impliciti |
| Mazzi senza limiti di legalità | UI legacy impone ancora 20+2; binding/ownership e struttura minima da verificare | I15 deve distinguere integrità e limiti di gioco; R03 |
| Tutte le quattro modalità; FFA tutti possono fare tutto per ora | Percorsi legacy presenti/parziali ma non collaudati | I16/I17 attuali; nessun ruolo lobby privilegiato aggiunto |
| Sessione unica e reconnect stessa partita entro timeout | Doppio login e reconnect incompleti | F31/I23 richiesti ora; finestra/rapporto timer R02 |
| 30 s per mossa con altri umani, poi forfait; vsCom nessun timeout mossa | Nessun timeout/forfait completo implementato | F32/I14 attuali; dettagli FFA/confini R04 |
| Restart: tutte le partite attive draw, nessun restore | Stato RAM perso senza finalizzazione draw verificata | I24 nuovo, persistere quanto necessario a identificare/finalizzare esiti, non ripristinare motore |
| Salvare tutti i dati partita per analisi e sviluppo set | Logging parziale, persistito mai verificato | I19 anticipato e corrente; nessuna perdita/retention arbitraria; mai password/token |
| Elo rinviato (decisione 24 ottobre 2026) | Nessun rating censito | Requisito superato il 24 ottobre 2026: F38/I25 e residuo R08 rinviati fuori dalla base |
| Email obbligatoria, admin, economia, set finale e hosting rinviati | Implementazioni legacy e lacune rimangono tali; nessun host corrente | Non bloccano debug locale; la titolarità degli account resta obbligatoria |

Fonti di requisito: risposte in chat, riportate in [open-questions.md](E:/bm/docs/open-questions.md). Gli esiti di [verification-report.md](E:/bm/docs/reports/verification-report.md) non cambiano: nessuna partita completa o test applicativo superato per effetto di queste decisioni. [Inventario aggiornato](E:/bm/docs/feature-inventory.md) e [roadmap](E:/bm/docs/roadmap.md) distinguono lavoro corrente, differito e residui R01–R08.

## Chiusura baseline I01 — 23 ottobre 2026

Completata la build locale riproducibile e lo smoke degli artefatti: prima compilazione da dipendenze scaricate e seconda reinstallazione/clean build offline entrambe riuscite, lockfile invariato. JAR 51.996.417 byte; client AOT prodotto con hash bundle ripetuto. Smoke HTTP su loopback: 6 risorse identiche al dist; entry point/classe Game e SQLite verificati nel JAR.

F01 è verificata soltanto per questo ambito. Il test esistente ora viene eseguito: 1 test, 1 errore nel caricamento del datasource esterno non configurato; non è un errore di compilazione o una regressione di regole dimostrata. Nessuna suite client disponibile, contesto Spring completo e partita non verificati. Nessun sorgente applicativo modificato: client package.json dichiara soltanto versioni Node/npm e due file di versione, script comuni nuovi in scripts/. Dettagli e comandi in [i01-report.md](E:/bm/docs/reports/i01-report.md). Prossimo incremento I02, con I03 necessario per il contesto persistente.

## Chiusura I02 — 23 ottobre 2026

Aggiunti test JUnit puri per pesca, capacità FIFO, last resort, scarto, costi, rifiuto seconda mossa e un round con due umani; fixture con nomi sintetici, nessun catalogo/DB o Spring. Sul client aggiunti runner e quattro casi che osservano il vero EventEmitter di CardInHandComponent per azioni ordinarie, bound e item vicini/lontani. Nessuna dipendenza nuova e lockfile invariato.

Risultato finale del comando unico `./scripts/build.ps1 -Task Test -Offline`: 8 test server, 4 client passano. Mutazioni solo in copie `.tools`: costo SuperImpact 25→24 rilevato da 2 asserzioni, proprietario target errato rilevato da 4 casi client. I sorgenti applicativi originali restano invariati.

Il test originale del contesto non è cancellato né sostituito: tag context e profilo Maven context-tests lo separano dagli unit. `TestServerContext` lo include e propaga l'errore attuale: 9 test, 8 unit passati, 1 errore di bootstrap del datasource. F30 rimane parziale per copertura globale, CI e integrazioni; I02 è concluso come harness. Le vecchie affermazioni di assenza di test nei censimenti iniziali non descrivono più lo stato corrente. Prossimo incremento I03. [Dettagli I02](E:/bm/docs/reports/i02-report.md).

## Chiusura I03 — persistenza e bootstrap

SQLite applicativo su file e schema V001 versionato sostituiscono PostgreSQL/JPA esterno. Corretto il problema di identità dei mazzi usando una PK composta reale; adattatori JDBC mantengono i metodi dei servizi. Test reali su account, mazzi, log JSON, rollback, accessi concorrenti brevi e riapertura; catalogo invariato e non scrivibile. Contesto completo e due avvii HTTP del JAR ora verificati. Il test originale contextLoads non è stato sostituito con un mock.

Email disabilitata senza accesso SMTP e nessuna credenziale amministrativa creata per default. Questo non completa login/provisioning/autorizzazioni o partita. L'invio email, il salvataggio asincrono integrale durante match, Elo/reconnect e restart-draw restano nei loro incrementi. Risorse e modifiche al regolamento presenti prima di I03 preservate e controllate da hash/check-rules. Prossimo incremento I04. [Dettagli](E:/bm/docs/reports/i03-report.md).

## Avanzamento CLI — 24 ottobre 2026

CLI testuale implementato parzialmente, con prova quick tramite trasporto reale; dettagli e limiti nel [report I26](reports/i26-report.md), uso nella [guida CLI](cli.md). Non costituisce completamento I26 né partita completa. Regolamento attivo invariato 1.3. Decisioni del proprietario per gli incrementi successivi registrate in open-questions.md.

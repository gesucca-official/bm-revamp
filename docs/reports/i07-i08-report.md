## Chiusura verifica visuale I07 - 23 ottobre 2026

Verifica completata in una nuova sessione browser: login devAlice, dialogo applicativo Log Out confermato, ritorno al login con campi vuoti e pulsante disabilitato, nuovo accesso e profilo devAlice/USER ricevuto. Con devBob nella seconda scheda, secondo logout di Alice: presenza 2 -> 1; nuovo accesso: 1 -> 2. Nessun errore console nei due client. **I07 completato anche sul percorso visuale dell'hub.** Le precedenti indicazioni di verifica pendente sono storiche e superate da questa prova. Il blocco precedente era osservato negli strumenti: la presenza di un dialogo nativo aperto non e stata confermata dall'utente.

Prova con JAR e sorgenti gia compilati, nessuna modifica applicativa aggiuntiva; database sintetico in `.build-logs/i07-final-browser/application.sqlite`. Log server/client nella stessa cartella. Nessuna partita, reconnect nel match o forfait certificato.

# I07 e I08 — Hub e catalogo runtime

23 ottobre 2026. I08 verificato; I07 implementato e coperto da test automatici, con verifica visuale finale logout/login ancora da completare. Nessuna regola, starter o testo del catalogo cambiato.

## I07: profilo, presenza, uscita

- `ConnectionsServiceImpl.broadcastUsersStatus` invia uno snapshot con soli userLogin e activity: niente sessionId e nessun riferimento alla collezione mutabile interna. Gli eventi connect duplicati per sessionId non aggiungono duplicati; disconnect ricava l'identita dall'ID effettivo e un secondo evento non rimuove altri utenti.
- `UserController.accountUnavailable` intercetta errori di accesso ai dati e binding del profilo e risponde sul canale privato `/user/queue/account/error` con un messaggio generico. DestinationPolicy ammette questa destinazione privata.
- `WebsocketService.connect` attende il profilo prima del callback di login. Timeout tecnico di 10 secondi fino al profilo, chiusura e reset in caso di errore/trasporto perso. Le risposte di vecchie connessioni vengono ignorate tramite una generazione locale.
- `WebsocketService.disconnect` invia DISCONNECT quando possibile, chiude il socket con fallback dopo 1,5 secondi, svuota sottoscrizioni e SessionService. Cattura il proprio trasporto per non chiudere una connessione successiva. Timeout tecnico, non regola di gioco.
- `SessionService.reset` elimina profilo, mazzi/collezione, presenza, code e flag di caricamento; e ripetibile. Toolbar ora usa un dialogo SweetAlert e attende disconnect, poi pulisce GameService/playerId; non ricarica la pagina.

Fonti: [ConnectionsServiceImpl](../../server/src/main/java/com/gsc/bm/service/session/ConnectionsServiceImpl.java), [UserController](../../server/src/main/java/com/gsc/bm/api/ws/UserController.java), [WebsocketService](../../client-debug/src/app/service/websocket.service.ts), [SessionService](../../client-debug/src/app/service/session.service.ts), [ToolbarComponent](../../client-debug/src/app/home/toolbar/toolbar.component.ts).

Test: [PresenceTest](../../server/src/test/java/com/gsc/bm/PresenceTest.java) verifica due utenti, eventi duplicati e assenza di sessionId dal JSON. [WebSocketIdentityTest.databaseFailureReturnsPrivateGenericError](../../server/src/test/java/com/gsc/bm/WebSocketIdentityTest.java) simula errore del repository dopo autenticazione, sul server reale, e verifica risposta privata senza dettagli DB. Il test di trasporto I06 conferma ancora rilascio e nuovo CONNECT dopo disconnect. [session.spec.ts](../../client-debug/tests/session.spec.ts) e [a-websocket.spec.ts](../../client-debug/tests/a-websocket.spec.ts) verificano reset ripetuto, logout ripetuto, errore profilo, callback vecchie e pulizia dati mediante trasporti finti, senza browser.

## I08: riuso delle factory e prove del catalogo reale

Le factory Card e Character continuano a usare le classi esistenti. Un binding non caricabile o incompatibile produce IllegalArgumentException con causa, anziche stampare lo stack e restituire null. La carta fuori catalogo resta rifiutata dal caricamento dei metadati. Nessun nuovo contenuto o limite mazzi introdotto.

[CatalogRuntimeTest](../../server/src/test/java/com/gsc/bm/CatalogRuntimeTest.java): 37 test dinamici, uno per binding SQLite, verificano istanziazione ripetuta in oggetti distinti, nome/effetto e riferimento immagine. Due casi parametrizzati verificano personaggi, 20 regolari, basic, due bound, last resort, mano iniziale di sei con speciali e senza oggetti in mano, capacita oggetti. Un test verifica binding errati. Gli starter reali sono mescolati dal costruttore: questi casi provano invarianti, non un ordine casuale specifico.

Le sequenze deterministiche di pesca item, scarto e last resort restano coperte da [PlayerTest](../../server/src/test/java/com/gsc/bm/model/game/PlayerTest.java) e dai test di conformita esistenti. Controllo filesystem read-only: tutte le immagini e sprite referenziati dalle 37 righe CRD001_GUI esistono in `bm-web-client/src/assets/img/cards`; non ne viene certificata qualita grafica o animazione Phaser. SoberUp resta fuori catalogo.

Fonti: [CardFactoryServiceImpl](../../server/src/main/java/com/gsc/bm/service/factories/CardFactoryServiceImpl.java), [CharacterFactoryServiceImpl](../../server/src/main/java/com/gsc/bm/service/factories/CharacterFactoryServiceImpl.java), DeckFactoryServiceImpl e Player.

## Comandi e risultati

| Comando | Risultato |
|---|---|
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 127 test server, zero failure/error/skipped |
| `./scripts/build.ps1 -Task Test -Offline` | 75 server e 10 client verdi prima degli ulteriori tre test lifecycle |
| `./scripts/build.ps1 -Task TestClient -Offline` finale | 13 test client verdi |
| `./scripts/build.ps1 -Task Server -Offline` | JAR prodotto |
| `./scripts/build.ps1 -Task Client -Offline` finale | Build produzione; warning bundle oltre budget 2 MB gia noto |
| `python scripts/check-rules.py` | Regolamento, copia client e catalogo allineati |

Evidenze: `.build-logs/i07-i08-context-final.log`, `i07-i08-tests.log`, `i07-i08-client-tests-final.log`, `i07-i08-server.log`, `i07-i08-client-final.log`. Errori iniziali di compilazione dei nuovi test (getter non esposti dalle interfacce) corretti, senza alterare regole o attesi di gioco.

## Verifica visuale e limiti

Login al JAR aggiornato con DB sintetico: devAlice ha ricevuto profilo e hub. La prima conferma nativa del logout ha bloccato gli strumenti del browser; sostituita nel codice da SweetAlert. La verifica visuale finale logout, conferma, ritorno al login e nuovo accesso resta da completare; non va dedotta dai test con trasporti finti. Il secondo avvio del solo server di prova ha usato origine 127.0.0.1 esplicita per tentare di isolare il blocco, senza cambiare configurazione locale predefinita. Nessun account reale, SMTP o database condiviso usato.

Procedura manuale residua: avviare server/client con `scripts/dev.ps1`, accedere con devAlice, confermare Log Out nel dialogo applicativo, verificare login e profilo svuotati, rientrare con lo stesso account; con devBob in seconda scheda verificare presenza da due a uno e ritorno a due. Ripetere logout. Nessuna partita completa, recupero match o forfait certificato; finestra di rientro 30 secondi resta I23 e richiede coordinamento col clock mossa. Prossimo incremento funzionale I09, dopo chiusura della verifica visuale I07.

# I06 — Autenticazione e autorizzazione delle destinazioni

23 ottobre 2026. Autorizzazione inbound, sessione unica per account e routing privato aggiornati. Nessuna regola del motore, schema SQLite o credenziale reale modificata. Finestra di rientro decisa dal proprietario: **30 secondi**, da implementare in I23; resta aperto il coordinamento col clock mossa multiplayer. Non e un recupero della partita gia implementato.

## Controlli applicati

- [AuthChannelInterceptorAdapter](../../bm-server/src/main/java/com/gsc/bm/conf/ws/AuthChannelInterceptorAdapter.java): CONNECT autentica sempre con AuthService, anche senza preflight REST. Errori generici, passcode rimosso dagli header nativi; SEND/SUBSCRIBE richiedono un principal e la sessione attiva di quell'account.
- [ActiveSessions](../../bm-server/src/main/java/com/gsc/bm/conf/ws/ActiveSessions.java): assegnazione sincronizzata account/sessione, un vincitore tra CONNECT concorrenti; seconda sessione rifiutata senza sostituire la prima. Disconnect libera solo l'ID effettivo, eventi duplicati/vecchi non liberano una nuova sessione. Rientro autenticato possibile dopo rilascio, senza promessa di ripristino match.
- [DestinationPolicy](../../bm-server/src/main/java/com/gsc/bm/conf/ws/DestinationPolicy.java): allowlist per SEND/SUBSCRIBE. Username nei path account/mazzi/open e payload join quick deve coincidere col principal. View/leave e sottoscrizioni ai topic di un match richiedono partecipante umano; move richiede anche gameId nel payload uguale al path e playerId uguale al principal. Destinazioni sconosciute, wildcard, scritture dirette al broker e sottoscrizioni a queue fisiche negate. Controllo centralizzato prima dei controller e della relativa mutazione; non sostituisce la validazione delle mosse di I09.
- [WebSocketAuthorizationSecurityConfig](../../bm-server/src/main/java/com/gsc/bm/conf/ws/WebSocketAuthorizationSecurityConfig.java): autenticazione e deny di default come secondo livello. DISCONNECT ammesso anche per trasporti che non hanno completato CONNECT, per permettere cleanup senza concedere accesso ai dati.
- [ConnectionsServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/session/ConnectionsServiceImpl.java): presenza di istanza sincronizzata; identita dal principal, disconnessione ricostruita tramite sessionId registrato. [PresenceEventListener](../../bm-server/src/main/java/com/gsc/bm/api/ws/PresenceEventListener.java) evita cleanup code con utente null. Ciclo di vita completo resta I07.
- [HttpSecurityConfig](../../bm-server/src/main/java/com/gsc/bm/conf/http/HttpSecurityConfig.java): endpoint login/signup e handshake pubblici, lettura/cancellazione log riservata ad ADMIN, fallback deny. Le annotazioni dei controller log richiedono ADMIN. POST telemetria browser resta pubblico per errori pre-login: non e accesso ai log, ma ingestione da irrobustire in I19/I20. Nessun amministratore creato.

I messaggi di code 1v1/FFA e presenza restano condivisi tra autenticati; i messaggi globali possono contenere identificativi dei match. Conoscere un gameId non consente view o mosse senza membership. Aggiunta bot e start FFA restano disponibili a tutti gli autenticati, come richiesto. Non e introdotto un proprietario di lobby.

## Contratto privato aggiornato insieme sui due lati

Broker `/topic` e `/queue`; prefisso utente Spring `/user`. Client [WebsocketService](../../bm-web-client/src/app/service/websocket.service.ts) sottoscrive:

| Sottoscrizione client | Uso |
|---|---|
| /user/queue/account/data | Profilo e mazzi del principal |
| /user/queue/illegalMove | Errore mossa del principal |
| /user/queue/game/quick/1vCom/ready | Match quick contro bot |
| /user/queue/game/open/1vCom/ready | Match open contro bot |
| /user/queue/game/{gameId}/view | Vista del proprio match |

I controller User/Game/Quick/Open usano `@SendToUser("/queue/...")`; Spring risolve la destinazione sulla sessione autenticata. I vecchi path `/user/{username}/...` vengono rifiutati. Non cambiano i SEND `/app/...`: l'identita dichiarata viene controllata. Client e server devono quindi essere aggiornati insieme. La dipendenza del controllo membership dal servizio match e lazy per evitare un ciclo di bootstrap tra configurazione WebSocket, broker e servizio presenza.

## Prove e limiti

Comandi: `./scripts/build.ps1 -Task Test -Offline`, `./scripts/build.ps1 -Task TestServerContext -Offline`, `./scripts/build.ps1 -Task Server -Offline`, `./scripts/build.ps1 -Task Client -Offline`, `python scripts/check-rules.py`.

La suite completa esegue **85 test server**. Nuovi test: [DestinationPolicyTest](../../bm-server/src/test/java/com/gsc/bm/DestinationPolicyTest.java), 5 casi, e [WebSocketIdentityTest](../../bm-server/src/test/java/com/gsc/bm/WebSocketIdentityTest.java), 3 casi con server reale su porta casuale e SQLite sintetico. Le prove di policy coprono identita account/deck/open/quick, membro/estraneo, body/path incoerenti, sottoscrizioni e scritture broker; claim concorrenti e disconnect vecchio; SEND anonimo. Le prove di trasporto verificano CONNECT diretto valido/errato/duplicato, risposta profilo privata, rifiuto SUBSCRIBE altrui, SEND falsificati, riaccesso dopo disconnect e HTTP anonimo senza accesso ai log. La membership delle partite e verificata con fixture mock, non con una partita completa sul trasporto.

Durante lo sviluppo: corretti errori di compilazione dei test e ciclo di bean rilevato dal bootstrap. La prima prova privata chiudeva il client Java perche il catalogo serializzato superava il suo buffer WebSocket predefinito: buffer del solo client di test portato a 1 MB. Non sono state cambiate regole o attesi di gioco per rendere verdi i test. La pulizia del JAR e stata temporaneamente bloccata dal server gia aperto dall'utente; dopo arresto richiesto all'utente, build standard riuscita. Il tentativo di build alternativa non ha prodotto un artefatto, il POM temporaneo e stato rimosso.

Evidenze in `.build-logs/i06-context-final.log`, `i06-tests-final.log`, `i06-server-build.log`, `i06-client-build.log`. Log di debug precedenti conservano tentativi falliti e non rappresentano lo stato finale.

Non certificati: partita completa, isolamento completo del motore mutabile, race tra membership check e chiusura partita, carico prolungato, test di tutte le regole di gioco sul trasporto, reconnect con recupero match/forfait, logout completo e telemetria autenticata. Non e un audit generale di sicurezza dello stack legacy. Il timeout di rientro di 30 secondi resta un requisito futuro e non e introdotto dal rilascio della sessione in I06.

## Esito finale

85 test server completi, 74 ordinari e 9 client superati; build standard JAR e build Angular riuscite (warning budget bundle gia noto). Browser su server locale con database sintetico `.build-logs/i06/application.sqlite`: login devAlice e ricezione profilo devAlice/USER sulla nuova destinazione privata, nessun errore console. Processi e scheda creati per la verifica arrestati al termine. Prossimo incremento I07.

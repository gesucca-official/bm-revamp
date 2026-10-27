> **Aggiornamento client — 26 ottobre 2026:** il client corrente è `client-debug/`,
> con il solo percorso di gioco debug. Prototipo Phaser, route `/phaser`, selettore
> grafico/debug e dipendenze dedicate sono stati rimossi. Le descrizioni Phaser
> nelle ricognizioni precedenti restano storiche. Regole e protocollo invariati.

> **Stato documentale — 26 ottobre 2026:** roadmap della base completata e
> [archiviata](history/roadmap-base-i22.md), con approvazione I22 già registrata.
> Le indicazioni datate di incrementi prossimi/aperti e priorità della base
> restano storico, non attività correnti. La nuova roadmap client è descritta
> nel [piano del client web animato](client-roadmap.md); implementazione non avviata.

> Riferimento corrente I22: regolamento 1.6; contratto delle quattro modalità,
> identità/sessione unica, mazzi, export, clock/forfait/reconnect e ricevuta restart
> consolidato nelle sezioni I24/I14/I23/I19b qui sotto e in [cli.md](cli.md).
> Nessuna nuova API in I22. Le ricognizioni legacy datate non sostituiscono questi
> contratti. [Accettazione e limiti della base](reports/i22-report.md).

> Aggiornamento I24, 26 ottobre 2026: regolamento 1.6/R06, draw persistente dopo restart pulito o crash. Contratto esteso qui sotto; i censimenti datati successivi restano storici. Nessun restore giocabile o Elo.

## Ricevuta di riavvio I24

L'avvio recupera prima i batch durevoli, poi chiude gli attivi del registro in draw una sola volta; errori di persistenza impediscono l'avvio operativo. Conclusi, dati precedenti e hash restano invariati. `resume` mantiene le risposte I14/I23 per le partite del processo vivo. Quando queste mancano, consulta l'ultima ammissione dell'account nel registro: se è conclusa per restart, sul medesimo canale privato restituisce:

```json
{"status":"finished","gameId":"ID","archived":true,"outcome":{"over":true,"result":"draw","winner":null,"reason":"riavvio server"}}
```

Questa risposta non ha `view`: non richiedere watch/view/leave e non inviare mosse al vecchio gameId. Il debug presenta «Pareggio — riavvio server» e Continue lascia l'hub disponibile. Estranei ricevono `none`, una nuova partita supera la vecchia ricevuta; senza una nuova ammissione il risultato rimane consultabile nei login successivi. L'export autenticato per ID resta disponibile indipendentemente dalla ricevuta automatica, con OUTCOME tecnico e riferimento all'ultimo prefisso osservato. Nessuna cronologia, presa visione persistente o checkpoint introdotti. [Formato e limiti](match-archive.md#chiusura-al-riavvio-i24).

## Ciclo di vita I14/I23

Le richieste sono STOMP autenticate; sottoscrizioni private con prefisso `/user/queue`. Una sola connessione per account. Il server ricontrolla la proprietà della sessione quando esegue il comando, mantenendola valida per tutta l'esecuzione; frame accodati della connessione sostituita non possono agire.

| SEND | Risposta privata | Semantica |
|---|---|---|
| `/app/session/resume` | `/user/queue/session/resume` | `{status: none}` oppure `{status: resumed/finished, gameId, view}` della stessa partita del processo vivo. Non crea match e non reinvia mosse. `finished` comprende il forfait personale in FFA ancora attiva |
| `/app/session/logout` | `/user/queue/session/logout` | `true` dopo rimozione dalle code e leave/forfait del match, poi il client chiude il trasporto |
| `/app/session/queue/leave` | `/user/queue/session/queue/leave` | `true` dopo uscita da tutte le code; elimina i bot rimasti senza umani |
| `/app/game/{gameId}/{playerId}/leave` | `/user/queue/game/{gameId}/leave` | `true` dopo leave; duplicati del partecipante innocui anche dopo cleanup, nessun nuovo esito |

La vista aggiunge `turn`, `pendingMove` del solo titolare (null se assente), `forfeits` (player→motivo), `moveDeadlines` e `reconnectDeadlines` (player→millisecondi epoch server), `outcomeReason` (`combat`, `leave`, `timeout`, null prima della conclusione). HEALTH/dead continuano a descrivere la morte fisica: chi è in `forfeits` è eliminato anche con HEALTH positivo. Gli avversari eliminati non sono nuovi bersagli nel debug. Nessun ordine di mazzo o mossa pendente altrui è esposto.

Il server applica i termini assoluti anche sui comandi, oltre al controllo periodico: la frequenza del controllo non estende i 30 s. Termini identici sono applicati insieme, termini diversi in ordine; poi superstiti ed eventuale risoluzione. Un submit già accettato ferma il solo clock mossa del mittente; il drop apre un clock distinto che i tentativi di connessione senza resume non azzerano. `resume` ripetuto dopo scadenza ripropone il risultato, senza spostare il termine. Leave/logout confermano la presa visione: al successivo accesso si torna all'hub; l'ultima ricevuta resta soltanto per idempotenza dei leave. L'export persistito resta disponibile.

Un join mentre esiste una partita da riprendere/lasciare è rifiutato, senza crearne un'altra; gli errori quick arrivano su `/user/queue/game/error`, gli errori open mantengono il canale precedente. La coda non duplica lo stesso umano e aggiorna i presenti dopo un'uscita. Violazioni di identità/destinazione restano errori di trasporto. Dettagli normativi dei due clock in [R06](game-rules.md), prove in [report I14/I23](reports/i14-i23-report.md).

> Stato corrente 24 ottobre 2026: CLI I26 implementato ([guida](cli.md)); I19a aggiunge l'export autenticato del match quick concluso. Le sezioni di pianificazione e i censimenti datati sotto rimangono storici.

## Export I19a

SEND `/app/archive/{gameId}/export`; SUBSCRIBE `/user/queue/archive/{gameId}/export`. Entrambi richiedono identità umana partecipante ed esito raggiunto. Risposta JSON descritta in [match-archive.md](match-archive.md), disponibile anche dopo la rimozione della sessione di gioco, da dati persistiti. Le viste di gioco restano private e non mostrano l'ordine dei mazzi. Non esiste endpoint anonimo o bypass fixture; l'export non dipende dal pannello admin. Gli errori del controller sono generici su `/user/queue/account/error`; le violazioni della policy possono chiudere il trasporto. Le API amministrative legacy LOG001 restano separate: non esportano né eliminano LOG003.

> La base I22 è completata e approvata. **I26/F39 è completato**: la CLI è disponibile per gli scenari applicativi automatici non UX; unit e integrazioni mirate restano diretti, browser/debug per UX. [Guida CLI](cli.md), [report I26](reports/i26-report.md), [roadmap archiviata](history/roadmap-base-i22.md).

## Contratto pianificato del CLI I26 (non implementato)

Il CLI consumerà REST di autenticazione e STOMP/SockJS con le stesse autorizzazioni e viste private del debug; niente endpoint che aggirino il server. Terminale e modalità non interattiva avranno output strutturato, diagnostica separata, exit code e timeout di attesa espliciti. Sintassi e comandi effettivi saranno documentati in I26; oggi non esistono. Reconnect/timeout/restart saranno estesi in I14/I23/I24; nessun contratto Elo nel perimetro base.

## Contratto I09

Vista runtime: players[me].cardsInHand e un array, players[other].cardsInHand un numero; deck e numerico; character include dead, bindingName e itemsSize. Comando SEND /app/game/{gameId}/move: soli playedCardName/playerId/targetId/gameId/choices; choices null o oggetto DISCARD_ONE/TARGET_ITEM secondo carta. SELF resta il bersaglio convenzionale per se stessi e proprietario di oggetti vicini; targetId avversario per FAR_ITEM. Stato interno void/moveReport non ammesso. Validazione R03 prima del motore; rifiuti mossa sul privato /user/queue/illegalMove, violazioni di sicurezza possono chiudere il trasporto. [Prove e limiti](reports/i09-report.md).

## Aggiornamento I07

Broadcast presenza `/topic/connections/users`: snapshot di userLogin e activity, senza sessionId. Nuova risposta privata `/user/queue/account/error` per indisponibilita del profilo, testo generico senza dettagli DB. Il client termina il caricamento del login solo dopo il profilo; timeout tecnico 10 secondi. [Report](reports/i07-i08-report.md).

## Contratto I06 - destinazioni private e autorizzazioni

Client e server devono essere aggiornati insieme: SUBSCRIBE privati ora su `/user/queue/account/data`, `/user/queue/illegalMove`, `/user/queue/game/{gameId}/view` e `/user/queue/game/{quick|open}/1vCom/ready`. I vecchi `/user/{username}/...` sono rifiutati. SEND `/app/...` invariati ma identita path/body deve coincidere col principal. View/leave/move e topic di match richiedono partecipazione umana; gameId path/body della mossa devono coincidere. CONNECT autentica senza dipendere dal preflight REST; seconda sessione account rifiutata. Deny per destinazioni non previste e scritture al broker. Log REST leggibili/cancellabili solo da ADMIN; ingestione browser POST resta pubblica. [Contratto, test e limiti I06](reports/i06-report.md). Segue lo storico.

## Aggiornamento I05 - accesso locale verificato

Nessun nuovo endpoint di provisioning: account sintetici creati all'avvio locale con flag esplicito. REST POST `/api/rest/v1/sign-in/validate` ritorna true per credenziali valide, false per errate/sconosciute nelle prove; CONNECT STOMP login/passcode riuscito dal client per due account e dati profilo ricevuti. Questo non certifica autorizzazioni delle destinazioni o sessione unica, previste in I06. [Report I05](reports/i05-report.md).

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

# API e comunicazione client-server

**Requisiti aggiornati, non contratti implementati:** reconnect/sessione unica, timeout/forfait, comunicazione restart-draw richiederanno contratti nuovi o estesi. Le route/DTO sotto restano il contratto legacy osservato; non attestano queste nuove capacità. Debug corrente, Phaser e client finali successivi. Fonte: [decisioni del proprietario](open-questions.md); [roadmap aggiornata](roadmap.md).

Contratti **verificati staticamente**, non con richieste reali. Non sono presenti specifiche OpenAPI/AsyncAPI né test di contratto nelle copie censite. Le forme JSON descritte derivano da DTO, getter Lombok e chiamate client; serializzazione e routing effettivi restano da verificare.

## Trasporto e prefissi

**V:** il server ha context path `/api`, REST sotto `/rest/v1`, handshake SockJS sotto `/ws/v1`. Il browser usa `/rest` e `/ws`; il proxy li riscrive rispettivamente in `/api/rest/v1` e `/api/ws/v1`. Fonti: [application.yml](../server/src/main/resources/application.yml), [WebSocketConfig](../server/src/main/java/com/gsc/bm/conf/ws/WebSocketConfig.java), [proxy.config.json](../client-debug/proxy.config.json), [server.js](../client-debug/server.js).

**V:** STOMP sopra SockJS. CONNECT invia header `login` e `passcode`, con credenziali account; il server associa il token al principal. Prefisso dei comandi `/app`; broker semplice `/user`, `/topic`, `/queue`. Non si usa un bearer token ottenuto dal login REST. [AuthChannelInterceptorAdapter.preSend](../server/src/main/java/com/gsc/bm/conf/ws/AuthChannelInterceptorAdapter.java), [WebsocketService.connect](../client-debug/src/app/service/websocket.service.ts).

## REST account

Le route in tabella sono relative a `/api/rest/v1` sul server, o `/rest` dal browser tramite proxy.

| Metodo e route | Input | Risposta/errore applicativo | Fonte |
|---|---|---|---|
| POST `/sign-in/validate` | `{username,password}` | boolean; false anche se username già connesso; non crea sessione | [UserLogInController.validateCredentials](../server/src/main/java/com/gsc/bm/api/rest/users/UserLogInController.java) |
| GET `/sign-up/users/{username}/available` | username nel path | boolean | [UserSignUpController.isUsernameValid](../server/src/main/java/com/gsc/bm/api/rest/users/UserSignUpController.java) |
| GET `/sign-up/mail/{mail}/available` | email nel path | boolean | stesso controller, `isEmailValid` |
| POST `/sign-up/verify` | `{username,email}` | corpo vuoto; AuthenticationException → 409 | stesso controller, `sendVerificationMail` |
| POST `/sign-up/register` | `{username,password,email,code}` | corpo vuoto; AuthenticationException → 409 | stesso controller, `completeRegistration` |

**V:** il client [SignUpComponent.checkUsernameAvailability/checkEmailAvailability](../client-debug/src/app/connection/sign-up/sign-up.component.ts) chiama `/sign-up/...`, omettendo `/rest`. Questi URL non corrispondono alle regole del proxy incluso. Invio verifica e registrazione usano invece `/rest/sign-up/...`.

## REST log

| Metodo e route | Payload/risposta | Protezione esplicita nel controller |
|---|---|---|
| GET `/logs/back/games/qty` | numero record | Nessuna annotazione metodo |
| GET `/logs/back/games/open` | lista GameLogRecord STARTED/IN_PROGRESS | `isAuthenticated()` |
| GET `/logs/back/games/drain` | byte di JSON, `application/octet-stream` | `isAuthenticated()` |
| DELETE `/logs/back/games/delete` | cancella tutti i record, restituisce true | `isAuthenticated()` |
| POST `/logs/client/web/` | `{timestamp,additional:[...],message}`; nessun corpo risposta | Nessuna; TODO esplicito |
| GET `/logs/client/web/qty` | numero record | Nessuna annotazione metodo |
| GET `/logs/client/web/drain` | byte di JSON, `application/octet-stream` | `isAuthenticated()` |
| DELETE `/logs/client/web/delete` | cancella tutti i record, true | `isAuthenticated()` |

Fonti: [GameLogsController](../server/src/main/java/com/gsc/bm/api/rest/panel/GameLogsController.java), [WebClientLogsController](../server/src/main/java/com/gsc/bm/api/rest/panel/WebClientLogsController.java). `drain` esporta e **non elimina**. L'ingestione client non salva se `log.db=N`. HTTP Basic usa un account in memoria configurato separatamente; non c'è `hasRole('ADMIN')` sui metodi. [HttpSecurityConfig](../server/src/main/java/com/gsc/bm/conf/http/HttpSecurityConfig.java). Il comportamento effettivo dei filtri e gli status HTTP del framework non sono stati misurati.

## STOMP: comandi e risposte

Tutti i comandi sotto riportati richiedono il prefisso `/app`. Le destinazioni `@SendToUser` sono riportate come dichiarate nel server; il client si sottoscrive usando `/user/{username}` seguito dalla destinazione. Questa particolare convenzione e la risoluzione delle variabili nei `@SendToUser` devono essere provate con il runtime, senza assumere che la semplice corrispondenza testuale basti.

| Comando | Corpo | Risposta/notifica | Fonte |
|---|---|---|---|
| `/connections/users/tell/me` | vuoto | broadcast `/topic/connections/users`: insieme UserSessionInfo | [PresenceEventListener](../server/src/main/java/com/gsc/bm/api/ws/PresenceEventListener.java) |
| `/user/{username}/account` | vuoto | user `/account/data`: UserAccountInfo o null | [UserController](../server/src/main/java/com/gsc/bm/api/ws/UserController.java) |
| `/user/{username}/deck` | UserGuiDeck JSON | salva/sovrascrive, restituisce account a user `/account/data` | stesso controller |
| `/user/{username}/deck/delete` | UserGuiDeck (usa deckId) | elimina, restituisce account | stesso controller |
| `/game/quick/1vCom/join` | playerId, stringa semplice | user `/game/quick/1vCom/ready`: gameId | [QuickGameQueuesController](../server/src/main/java/com/gsc/bm/api/ws/QuickGameQueuesController.java) |
| `/game/quick/1v1/join` | playerId stringa | `/user/queue/game/quick/1v1/ready`: gameId privato ai due partecipanti quando coda completa (I17a) | stesso controller |
| `/game/quick/ffa/join` | playerId stringa | `/topic/game/quick/ffa/joined`: lista QueuedPlayer; `/user/queue/game/quick/ffa/ready` privato ai partecipanti se completa | stesso controller |
| `/game/quick/ffa/join/com` | vuoto | stessa lista joined e ready privato FFA; aggiunge bot | stesso controller |
| `/game/quick/ffa/start` | vuoto | `/user/queue/game/quick/ffa/ready`: gameId se almeno 2; aggiornamento joined | stesso controller |
| `/game/open/1vCom/join/{username}/{deckId}` | ignorato dal metodo | user `/game/open/1vCom/ready`: gameId | [OpenGameQueuesController](../server/src/main/java/com/gsc/bm/api/ws/OpenGameQueuesController.java) |
| `/game/{gameId}/move` | Move JSON | `/topic/game/{gameId}/move`: testo; dopo risoluzione `/topic/game/{gameId}/update`: gameId | [GameController.makeYourMove](../server/src/main/java/com/gsc/bm/api/ws/GameController.java) |
| `/game/{gameId}/{playerId}/view` | vuoto | user `/game/{gameId}/view`: ClientGameView | stesso controller, `getGameView` |
| `/game/{gameId}/{playerId}/leave` | vuoto | nessuna risposta esplicita | stesso controller, `leaveGame` |

**V:** `IllegalMoveException` nei metodi di `GameController` viene inviata a user `/illegalMove` come testo. Le eccezioni generiche non hanno un contratto applicativo uniforme. I metodi delle code possono restituire null quando non c'è una partita pronta; non sono risposte JSON con stato formalizzato.

## Flusso ordinario ricostruito

**V:** `SignInComponent` verifica via REST → `WebsocketService.connect` apre STOMP → sottoscrive presenza/account e richiede dati → `joinGame` sottoscrive ready e invia join → riceve gameId → `subToGame` sottoscrive move/update/view/illegalMove → richiede vista → invia mossa → dopo update richiede nuovamente la vista completa. Non riceve patch incrementali né un numero di versione. Fonti: [SignInComponent](../client-debug/src/app/connection/sign-in/sign-in.component.ts), [WebsocketService](../client-debug/src/app/service/websocket.service.ts).

**Aggiornamento I17a/I17b:** ready quick 1v1 e FFA è inviato su destinazioni private ai soli partecipanti umani. Il client consuma quel ready e annulla le sottoscrizioni della coda; i vecchi topic ready sono negati. Presenza include i campi del [UserSessionInfo](../server/src/main/java/com/gsc/bm/service/session/model/UserSessionInfo.java), incluso sessionId; `QueuedPlayer` espone playerId e human.

## Modelli di messaggio

Mossa esemplificativa, con valori segnaposto: non è stata inviata al server.

```json
{
  "playedCardName": "nome GUI della carta in mano",
  "playerId": "giocatore",
  "targetId": "SELF",
  "gameId": "id-partita",
  "choices": {"TARGET_ITEM": "nome GUI oggetto"}
}
```

**V:** `choices` usa chiavi `DISCARD_ONE` e `TARGET_ITEM`; può essere null per carte senza scelta. La risposta di una mossa include `moveReport`, mappa SELF/OPPONENT di liste di stringhe, e il getter booleano void. L'ID della partita nel body viene usato per scegliere il motore; quello nel path per i topic. Non c'è un confronto fra i due. [Move](../server/src/main/java/com/gsc/bm/model/game/Move.java), [GameController](../server/src/main/java/com/gsc/bm/api/ws/GameController.java).

| DTO | Campi significativi |
|---|---|
| ClientGameView | gameId; players: mappa ID→vista; resolvedMoves; timeBasedEffects: ID→string[]; over; winner (ID o `NONE`) |
| ClientSelfPlayerView | playerId, character, cardsInHand: Card[], deck: numero |
| ClientOpponentView | playerId, character, cardsInHand: numero, deck: numero |
| ClientCharacterView | name, itemsSize, items, resources, statuses, immunities, timers, sprite; **non ha dead** |
| Card | name, bindingName, effect HTML, flag item/basicAction/lastResort/characterBound, boundToCharacter, priority, cost, canTarget; AbstractCard aggiunge image/sprite |
| UserAccountInfo | username, email, role, decks, collection |
| UserGuiDeck | deckId, character: CharacterCardView, basicActionCard, lastResortCard, characterBoundCards[], regularCards[] |

Fonti: [ClientGameView](../server/src/main/java/com/gsc/bm/service/view/model/client/ClientGameView.java), [ClientCharacterView](../server/src/main/java/com/gsc/bm/service/view/model/client/ClientCharacterView.java), [Card](../server/src/main/java/com/gsc/bm/model/cards/Card.java), [UserGuiDeck](../server/src/main/java/com/gsc/bm/service/account/model/UserGuiDeck.java).

## Divergenze e limiti verificati

- Il tipo client [Player](../client-debug/src/app/model/player.ts) dichiara `deckSize`, il server manda `deck`. Il tipo [Character](../client-debug/src/app/model/character.ts) richiede `dead` e `bindingName`, ma la vista di partita server non li contiene; `GameService.opponents` filtra proprio su `dead`.
- Il tipo client [Card](../client-debug/src/app/model/card.ts) omette `bindingName` e `item` pur ricevendo dati usati nei mazzi. Le risposte sono assegnate via JSON.parse senza validazione runtime.
- [BattleScene.handleDropEvent](../client-debug/src/app/client-phaser/scnenes/battle/battle-scene.ts) manda `choices:null` per carte ordinarie anche quando serve TARGET_ITEM; [UI_Item](../client-debug/src/app/client-phaser/scnenes/battle/model/ui-item.ts) usa il nome item come target anziché il suo proprietario. Il client debug costruisce invece TARGET_ITEM in [CardInHandComponent.playThis](../client-debug/src/app/client-debug/card-in-hand/card-in-hand.component.ts).
- I comandi usano username/playerId scelti dal client, senza legame al principal. L'autenticazione CONNECT non garantisce autorizzazione su account, partita, bersagli e sottoscrizioni. [WebSocketAuthorizationSecurityConfig](../server/src/main/java/com/gsc/bm/conf/ws/WebSocketAuthorizationSecurityConfig.java).
- Non risultano idempotency key, sequence number, versione turno, timeout di richiesta, retry applicativo o recupero sessione in [WebsocketService](../client-debug/src/app/service/websocket.service.ts). Il numero `turn` del motore non compare in ClientGameView.

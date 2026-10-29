> **Aggiornamento client — 26 ottobre 2026:** il client corrente è `client-debug/`,
> con il solo percorso di gioco debug. Prototipo Phaser, route `/phaser`, selettore
> grafico/debug e dipendenze dedicate sono stati rimossi. Le descrizioni Phaser
> nelle ricognizioni precedenti restano storiche. Regole e protocollo invariati.

> **Stato documentale:** lo stato corrente del progetto è nell'[indice della
> documentazione](README.md#stato-corrente). Le indicazioni datate di incrementi
> prossimi/aperti e priorità della base restano storico, non attività correnti.

> Stato corrente I22: le criticità storiche di bootstrap, autorizzazione, code,
> isolamento stati, rollback e persistenza elencate sotto sono state trattate e
> verificate negli incrementi della base; non costituiscono automaticamente difetti
> ancora aperti. Limiti attuali e ambito di accettazione nel [report I22](reports/i22-report.md).
> Nessun requisito futuro viene riattivato da questo censimento storico.

> La base I22 è completata e approvata. **I26/F39 è completato**: la CLI è disponibile per gli scenari applicativi automatici non UX; unit e integrazioni mirate restano diretti, browser/debug per UX. [Guida CLI](cli.md), [report I26](reports/i26-report.md), [roadmap archiviata](history/roadmap-base-i22.md).

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale](game-rules.md) (1.0 a quella data; versione vigente nell'[indice](README.md#stato-corrente)) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

**Aggiornamento I03:** contesto Spring, repository SQLite e JAR locale ora verificati; PostgreSQL sostituito da file applicativo separato, catalogo read-only. 73 test server nel profilo completo, nessun errore; controlli delle regole preesistenti superati e nessuna modifica alle regole in I03. La diagnosi storica di datasource non avviabile e IdClass mazzi incoerente è superata dalla nuova implementazione. [Report corrente](reports/i03-report.md). Partita/browser, autorizzazioni e log asincroni completi restano da verificare.

# Debito tecnico e rischi

**Lettura corrente:** il censimento sotto è storico; debug, sessioni/reconnect, timer multiplayer, log completi e CLI I26 sono acquisiti nella base I22. Non costituiscono debito ancora aperto. Elo e sviluppi successivi restano differiti; per lo stato effettivo vedere [I22](reports/i22-report.md) e lo [stato corrente](README.md#stato-corrente).

Analisi statica del 23 ottobre 2026. **V** = evidenza verificata; **D** = impatto dedotto da confermare; **M** = verifica mancante. Nessuna correzione applicata. Priorità relative: **P0** da risolvere prima di esporre il servizio a utenti non fidati; **P1** blocca affidabilità o percorsi fondamentali; **P2** incide su manutenzione, capacità e osservabilità. Non sono dichiarate vulnerabilità CVE né sfruttamenti dimostrati.

## P0 — identità e autorizzazione

### Comandi e viste non legati al principal

**V:** [WebSocketAuthorizationSecurityConfig.configureInbound](../server/src/main/java/com/gsc/bm/conf/ws/WebSocketAuthorizationSecurityConfig.java) consente ogni messaggio. [UserController](../server/src/main/java/com/gsc/bm/api/ws/UserController.java) accetta username nel path per leggere account e salvare/cancellare mazzi. [GameController](../server/src/main/java/com/gsc/bm/api/ws/GameController.java) accetta playerId per view/leave e nel body della mossa. Nessuno di questi metodi usa il principal autenticato per verificare titolarità o partecipazione.

**D:** un utente può richiedere operazioni a nome altrui e una vista contenente la mano di un altro giocatore; CONNECT autenticato non risolve il difetto. Il body gameId della mossa può divergere dal path gameId: il servizio aggiorna il primo e il controller notifica il secondo. Impatto su riservatezza e integrità di account/partite, perciò P0. **M:** test di autorizzazione negativi e comportamento effettivo delle destinazioni private. Intervento futuro: derivare identità dal principal, verificare partecipazione, vincolare destinazioni e sottoscrizioni, unificare ID partita.

## P1 — bootstrap, contratti e percorsi essenziali

| Problema | Evidenza verificata | Impatto dedotto e verifica necessaria |
|---|---|---|
| Mapping chiave mazzi | [UserDecksRecord](../server/src/main/java/com/gsc/bm/repo/external/UserDecksRecord.java): IdClass username+deckId, ma `@Id` solo su username | Possibile errore bootstrap JPA/identità record; verificare entity manager e DDL reale prima di migrare dati. |
| Configurazione avvio incompleta | [application.yml](../server/src/main/resources/application.yml) non fornisce datasource esterno, HTTP auth o host SMTP; profilo local ignorato e assente; ddl-auto none | Avvio standard non riproducibile; mancano schema DB, configurazione locale e ambiente dipendenze collaudato. |
| Provider DatePipe | [AppComponent.constructor](../client-debug/src/app/app.component.ts) inietta DatePipe; nessun provider DatePipe nei sorgenti censiti, [AppModule.providers](../client-debug/src/app/app.module.ts) contiene MatSnackBarModule | Possibile NullInjectorError già al bootstrap. Non eseguito in browser: il rischio non è presentato come errore runtime osservato. |
| Registrazione: URL errati | [SignUpComponent.checkUsernameAvailability/checkEmailAvailability](../client-debug/src/app/connection/sign-up/sign-up.component.ts) omette `/rest`; proxy copre solo `/rest` e `/ws` | I precontrolli non raggiungono i controller previsti; invio codice UI può arrestarsi prima della registrazione. |
| Target oggetti Phaser | BattleScene.handleDropEvent (`client-debug/src/app/client-phaser/scnenes/battle/battle-scene.ts`, non più presente) manda choices null; UI_Item (`client-debug/src/app/client-phaser/scnenes/battle/model/ui-item.ts`, non più presente) mette nome item nel target | Il server richiede TARGET_ITEM e ID proprietario; Grab/Steal non hanno un contratto valido nel percorso grafico corrente. |
| DTO divergenti | [ClientCharacterView](../server/src/main/java/com/gsc/bm/service/view/model/client/ClientCharacterView.java) senza dead; [GameService.opponents](../client-debug/src/app/service/game.service.ts) lo usa. Player client deckSize contro server deck | Morti non filtrati come previsto, campi mancanti; servono test dei JSON effettivi e viste UI. |
| Validazione mosse incompleta | [Move.isValidFor](../server/src/main/java/com/gsc/bm/model/game/Move.java) non convalida integralmente target, stato partita, vitalità, appartenenza; void accettato subito | Input incoerenti possono produrre eccezioni o violare le regole. Verificare anche deserializzazione del flag void prima di affermare un bypass remoto specifico. |
| Mazzi non validati dal server | [UserAccountServiceImpl.addUserDeck/fromGuiToStoredDeck](../server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java) salva binding forniti dal client; i limiti 20+2 sono solo UI | Mazzi incompatibili, riferimenti inesistenti e quantità arbitrarie arrivano alla factory; nessuna policy di copie approvata. |
| Fine partita/disconnessione | [PresenceEventListener](../server/src/main/java/com/gsc/bm/api/ws/PresenceEventListener.java) non libera partite; `leaveGame` non toglie player dal motore; Phaser non chiama unsubscribe/leave | Partite bloccate e memoria trattenuta. Il callback Phaser distrugge il gioco ma continua al restart; provare ciclo completo di fine partita. |

### Verifica email e protezioni d'accesso incomplete

**V:** [AuthServiceImpl](../server/src/main/java/com/gsc/bm/service/session/AuthServiceImpl.java) memorizza `username→codice`, non l'indirizzo verificato. `completeRegistration` accetta separatamente una email e controlla soltanto codice e disponibilità. Codici generati con `Random`, senza TTL, limite tentativi o rate limit server; il blocco 15 secondi è solo UI. **D:** il codice ricevuto per un indirizzo può essere usato per registrare un altro indirizzo disponibile; brute-force e invio email ripetuto non hanno protezioni applicative osservate. Nessuna prova abusiva eseguita.

**V:** il doppio login è controllato nel solo endpoint REST; CONNECT autentica senza quel controllo. Il ruolo del DB è restituito al client ma il token STOMP riceve sempre USER. HTTP Basic admin è un'identità separata e i metodi log richiedono solo isAuthenticated. **M:** modello ruoli desiderato e autenticazione effettiva del pannello da verificare.

### Coerenza del motore

- **V:** [MadeOfStone.MADE_OF_STONE](../server/src/main/java/com/gsc/bm/model/cards/bruiser/MadeOfStone.java) e [BrokenBeerBottle.BROKEN_BEER_STATUS](../server/src/main/java/com/gsc/bm/model/cards/com/tokens/BrokenBeerBottle.java) sono oggetti Status statici e mutabili, inseriti direttamente nei personaggi. **D:** la durata/consumazione di un'istanza può influenzare altri giocatori o partite. Priorità alta perché rompe l'isolamento del gioco.
- **V:** [Status.invertViewPoint](../server/src/main/java/com/gsc/bm/model/game/status/Status.java) restituisce ALL per qualunque sottoinsieme valido di ALL; gli stati single-use sono consumati solo tramite durata 0 e rimossi a fine turno. **D:** filtri e consumo possono divergere dai testi delle carte. Chiedere la regola voluta e introdurre prove mirate in una fase successiva.
- **V:** [GoingBerserk](../server/src/main/java/com/gsc/bm/model/cards/junkie/GoingBerserk.java) sovrascrive il primo costo; [ToxicBloodDrain](../server/src/main/java/com/gsc/bm/model/cards/junkie/ToxicBloodDrain.java) ripristina immunità sul lanciatore dopo averla rimossa al target; [Grab](../server/src/main/java/com/gsc/bm/model/cards/com/Grab.java) non chiama l'hook che applica l'equip di RottenBeer. Sono discrepanze concrete, ma la correzione richiede conferma delle regole, non supposizioni.
- **V:** [Game.resolveMoves](../server/src/main/java/com/gsc/bm/model/game/Game.java) muta risorse e mani senza transazione o rollback, prima di completare la catena; nessun recupero su eccezioni inattese. **D:** una risoluzione fallita può lasciare una partita parzialmente modificata.
- **V:** la coda non deduplica utenti e `Game` usa una mappa playerId→player. **D:** ID ripetuti possono sovrascrivere giocatori e produrre una partita diversa dagli iscritti attesi. [QueueServiceImpl.joinQueue](../server/src/main/java/com/gsc/bm/service/session/QueueServiceImpl.java), [Game.constructor](../server/src/main/java/com/gsc/bm/model/game/Game.java).

### Mancanza di verifiche automatiche pertinenti

**V:** unico test `contextLoads`, nessuna suite client, nessun test di regole o contratto. **D:** regressioni nei punti precedenti non hanno una rete di protezione osservabile. La prima fase di stabilizzazione dovrebbe provare bootstrap e percorsi critici prima di un refactoring generale. [BmServerApplicationTests](../server/src/test/java/com/gsc/bm/BmServerApplicationTests.java), [angular.json](../client-debug/angular.json).

## P2 — manutenzione, capacità e osservabilità

| Tema | Evidenza e rischio |
|---|---|
| Scalabilità/stato | [GameSessionServiceImpl](../server/src/main/java/com/gsc/bm/service/session/GameSessionServiceImpl.java) sincronizza globalmente e cerca gli ID linearmente; stato in memoria e broker semplice non coordinano repliche. Nessuna misura prestazionale eseguita. |
| Costo delle viste | [ViewExtractorServiceImpl](../server/src/main/java/com/gsc/bm/service/view/ViewExtractorServiceImpl.java) serializza/clona partita, player e character e consulta il catalogo; costo proporzionale agli oggetti e snapshot. |
| Log asincroni mutabili | [GameLoggingServiceImpl](../server/src/main/java/com/gsc/bm/service/session/GameLoggingServiceImpl.java) passa la lista aggregata mutabile al job e ignora il Future: possibili corse tra accodamento e salvataggio, da verificare. [ActionLog.constructor](../server/src/main/java/com/gsc/bm/service/session/model/ActionLog.java) clona invece il singolo payload: il successivo svuotamento di loggedEventsList non implica perdita del payload già copiato. |
| Log senza limiti | [WebClientLogsController.saveLogs](../server/src/main/java/com/gsc/bm/api/rest/panel/WebClientLogsController.java) non autentica né limita il payload a livello applicativo; timestamp client è PK, quindi possibili collisioni. Nessuna retention/paginazione negli export. |
| Esposizione dei log | Snapshot globali contengono mani e mazzi; presenza contiene sessionId. Definire necessità e accesso ai dati, senza assumere policy di conservazione inesistenti. |
| Logging browser | [AppComponent](../client-debug/src/app/app.component.ts) sostituisce console.error e invia HTTP senza gestione errore; possibile amplificazione se il logger remoto fallisce. Da riprodurre. |
| Factory riflessive | [CardFactoryServiceImpl](../server/src/main/java/com/gsc/bm/service/factories/CardFactoryServiceImpl.java) e CharacterFactory ritornano null dopo stack trace; la catena successiva può fallire con errori poco informativi. Binding persistiti dipendono da nomi Java. |
| Uguaglianza carte | [AbstractCard.equals](../server/src/main/java/com/gsc/bm/model/cards/AbstractCard.java) basato su nome senza hashCode coerente; uso di Set in collezione. Le copie non hanno identità autonoma. |
| UI e subscription | [WebsocketService.joinGame](../client-debug/src/app/service/websocket.service.ts) lascia attiva subscription FFA joined; servizi globali window nel client Phaser; animazioni temporali incomplete. |
| Asset | Catalogo usa molti placeholder; MarvelousCocktail ha sprite nullo e token non assegna sprite, mentre BattleScene.preload (`client-debug/src/app/client-phaser/scnenes/battle/battle-scene.ts`, non più presente) costruisce URL dagli sprite degli oggetti avversari. Possibili richieste asset non valide. |
| Build/lint | Versioni dipendenze storiche, Node/npm non fissati, lint cita file assenti; AppModule dichiara due volte AdminControlPanelComponent e mette MatSnackBarModule nei providers. Esito compilatore non verificato, audit vulnerabilità non eseguito. |
| Deployment | [server.js](../client-debug/server.js) ha host fissi, upstream ws non cifrato e nessun fallback SPA/upgrade esplicito; origine server fissa nel profilo Heroku. Routing remoto non verificato. |
| Documentazione/regole | Catalogo, regolamento e codice divergono; non esiste una fonte normativa riconosciuta. Dettagli in [game-rules.md](game-rules.md). |

## Ordine storico suggerito prima degli incrementi (superato dalla base I22 conclusa)

1. Recuperare DDL/configurazione e riprodurre build/bootstrap con versioni concordate; verificare mapping JPA e provider Angular.
2. Chiudere autorizzazione su comandi/sottoscrizioni e validare input/identità lato server, con test negativi.
3. Concordare le regole controverse e fissare test su risoluzione, stati condivisi, oggetti e fine partita.
4. Riallineare DTO, registrazione e client Phaser; completare una partita per ogni modalità.
5. Definire recovery, cleanup, logging, versionamento catalogo e obiettivi di capacità prima di riprogettare l'architettura.

Queste sono proposte motivate dalle evidenze, non modifiche realizzate né approvazione implicita di nuove regole.

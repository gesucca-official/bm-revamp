> Stato corrente I22: le criticità storiche di bootstrap, autorizzazione, code,
> isolamento stati, rollback e persistenza elencate sotto sono state trattate e
> verificate negli incrementi della base; non costituiscono automaticamente difetti
> ancora aperti. Limiti attuali e ambito di accettazione nel [report I22](reports/i22-report.md).
> Nessun requisito futuro viene riattivato da questo censimento storico.

> Pianificazione aggiornata il 24 ottobre 2026: [roadmap della versione base approvata](roadmap.md). I01–I11 acquisiti; prossimo I26, CLI testuale leggero per gli scenari automatici applicativi senza UX (unit e integrazioni mirate restano diretti). Elo/I25/F38 rinviato, fuori dalla base. Chiusura I22 con prove tecniche e UX e approvazione esplicita del proprietario. Nessuna nuova implementazione con questa revisione; regolamento vigente 1.3. I censimenti e i risultati datati sotto restano storici nei rispettivi ambiti.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

**Aggiornamento I03:** contesto Spring, repository SQLite e JAR locale ora verificati; PostgreSQL sostituito da file applicativo separato, catalogo read-only. 73 test server nel profilo completo, nessun errore; controlli delle regole preesistenti superati e nessuna modifica alle regole in I03. La diagnosi storica di datasource non avviabile e IdClass mazzi incoerente è superata dalla nuova implementazione. [Report corrente](E:/bm/docs/reports/i03-report.md). Partita/browser, autorizzazioni e log asincroni completi restano da verificare.

# Debito tecnico e rischi

**Interpretazione aggiornata dalle risposte:** priorità corrente su debug, sessioni/reconnect, timer multiplayer, log completi e CLI I26; Elo rinviato. Le discrepanze si valutano contro il regolamento vigente 1.3/R00, che supera la vecchia baseline Q03. PostgreSQL può essere sostituito Q02; 20+2 e tetti copie non sono requisiti correnti Q08. Email obbligatoria, admin, Phaser e hosting sono successivi. Le evidenze tecniche sotto rimangono valide, ma le proposte originarie vanno lette attraverso questa priorità. Fonte: [decisioni del proprietario](E:/bm/docs/open-questions.md); [roadmap aggiornata](E:/bm/docs/roadmap.md).

Analisi statica del 23 ottobre 2026. **V** = evidenza verificata; **D** = impatto dedotto da confermare; **M** = verifica mancante. Nessuna correzione applicata. Priorità relative: **P0** da risolvere prima di esporre il servizio a utenti non fidati; **P1** blocca affidabilità o percorsi fondamentali; **P2** incide su manutenzione, capacità e osservabilità. Non sono dichiarate vulnerabilità CVE né sfruttamenti dimostrati.

## P0 — identità e autorizzazione

### Comandi e viste non legati al principal

**V:** [WebSocketAuthorizationSecurityConfig.configureInbound](E:/bm/bm-server/src/main/java/com/gsc/bm/conf/ws/WebSocketAuthorizationSecurityConfig.java:11) consente ogni messaggio. [UserController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/UserController.java:14) accetta username nel path per leggere account e salvare/cancellare mazzi. [GameController](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/GameController.java:15) accetta playerId per view/leave e nel body della mossa. Nessuno di questi metodi usa il principal autenticato per verificare titolarità o partecipazione.

**D:** un utente può richiedere operazioni a nome altrui e una vista contenente la mano di un altro giocatore; CONNECT autenticato non risolve il difetto. Il body gameId della mossa può divergere dal path gameId: il servizio aggiorna il primo e il controller notifica il secondo. Impatto su riservatezza e integrità di account/partite, perciò P0. **M:** test di autorizzazione negativi e comportamento effettivo delle destinazioni private. Intervento futuro: derivare identità dal principal, verificare partecipazione, vincolare destinazioni e sottoscrizioni, unificare ID partita.

## P1 — bootstrap, contratti e percorsi essenziali

| Problema | Evidenza verificata | Impatto dedotto e verifica necessaria |
|---|---|---|
| Mapping chiave mazzi | [UserDecksRecord](E:/bm/bm-server/src/main/java/com/gsc/bm/repo/external/UserDecksRecord.java:24): IdClass username+deckId, ma `@Id` solo su username | Possibile errore bootstrap JPA/identità record; verificare entity manager e DDL reale prima di migrare dati. |
| Configurazione avvio incompleta | [application.yml](E:/bm/bm-server/src/main/resources/application.yml) non fornisce datasource esterno, HTTP auth o host SMTP; profilo local ignorato e assente; ddl-auto none | Avvio standard non riproducibile; mancano schema DB, configurazione locale e ambiente dipendenze collaudato. |
| Provider DatePipe | [AppComponent.constructor](E:/bm/bm-web-client/src/app/app.component.ts:14) inietta DatePipe; nessun provider DatePipe nei sorgenti censiti, [AppModule.providers](E:/bm/bm-web-client/src/app/app.module.ts:124) contiene MatSnackBarModule | Possibile NullInjectorError già al bootstrap. Non eseguito in browser: il rischio non è presentato come errore runtime osservato. |
| Registrazione: URL errati | [SignUpComponent.checkUsernameAvailability/checkEmailAvailability](E:/bm/bm-web-client/src/app/connection/sign-up/sign-up.component.ts:125) omette `/rest`; proxy copre solo `/rest` e `/ws` | I precontrolli non raggiungono i controller previsti; invio codice UI può arrestarsi prima della registrazione. |
| Target oggetti Phaser | [BattleScene.handleDropEvent](E:/bm/bm-web-client/src/app/client-phaser/scnenes/battle/battle-scene.ts:114) manda choices null; [UI_Item](E:/bm/bm-web-client/src/app/client-phaser/scnenes/battle/model/ui-item.ts:7) mette nome item nel target | Il server richiede TARGET_ITEM e ID proprietario; Grab/Steal non hanno un contratto valido nel percorso grafico corrente. |
| DTO divergenti | [ClientCharacterView](E:/bm/bm-server/src/main/java/com/gsc/bm/service/view/model/client/ClientCharacterView.java:17) senza dead; [GameService.opponents](E:/bm/bm-web-client/src/app/service/game.service.ts:13) lo usa. Player client deckSize contro server deck | Morti non filtrati come previsto, campi mancanti; servono test dei JSON effettivi e viste UI. |
| Validazione mosse incompleta | [Move.isValidFor](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Move.java:75) non convalida integralmente target, stato partita, vitalità, appartenenza; void accettato subito | Input incoerenti possono produrre eccezioni o violare le regole. Verificare anche deserializzazione del flag void prima di affermare un bypass remoto specifico. |
| Mazzi non validati dal server | [UserAccountServiceImpl.addUserDeck/fromGuiToStoredDeck](E:/bm/bm-server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java:58) salva binding forniti dal client; i limiti 20+2 sono solo UI | Mazzi incompatibili, riferimenti inesistenti e quantità arbitrarie arrivano alla factory; nessuna policy di copie approvata. |
| Fine partita/disconnessione | [PresenceEventListener](E:/bm/bm-server/src/main/java/com/gsc/bm/api/ws/PresenceEventListener.java:14) non libera partite; `leaveGame` non toglie player dal motore; Phaser non chiama unsubscribe/leave | Partite bloccate e memoria trattenuta. Il callback Phaser distrugge il gioco ma continua al restart; provare ciclo completo di fine partita. |

### Verifica email e protezioni d'accesso incomplete

**V:** [AuthServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/AuthServiceImpl.java:18) memorizza `username→codice`, non l'indirizzo verificato. `completeRegistration` accetta separatamente una email e controlla soltanto codice e disponibilità. Codici generati con `Random`, senza TTL, limite tentativi o rate limit server; il blocco 15 secondi è solo UI. **D:** il codice ricevuto per un indirizzo può essere usato per registrare un altro indirizzo disponibile; brute-force e invio email ripetuto non hanno protezioni applicative osservate. Nessuna prova abusiva eseguita.

**V:** il doppio login è controllato nel solo endpoint REST; CONNECT autentica senza quel controllo. Il ruolo del DB è restituito al client ma il token STOMP riceve sempre USER. HTTP Basic admin è un'identità separata e i metodi log richiedono solo isAuthenticated. **M:** modello ruoli desiderato e autenticazione effettiva del pannello da verificare.

### Coerenza del motore

- **V:** [MadeOfStone.MADE_OF_STONE](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/MadeOfStone.java:16) e [BrokenBeerBottle.BROKEN_BEER_STATUS](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/com/tokens/BrokenBeerBottle.java:14) sono oggetti Status statici e mutabili, inseriti direttamente nei personaggi. **D:** la durata/consumazione di un'istanza può influenzare altri giocatori o partite. Priorità alta perché rompe l'isolamento del gioco.
- **V:** [Status.invertViewPoint](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/status/Status.java:43) restituisce ALL per qualunque sottoinsieme valido di ALL; gli stati single-use sono consumati solo tramite durata 0 e rimossi a fine turno. **D:** filtri e consumo possono divergere dai testi delle carte. Chiedere la regola voluta e introdurre prove mirate in una fase successiva.
- **V:** [GoingBerserk](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/junkie/GoingBerserk.java:14) sovrascrive il primo costo; [ToxicBloodDrain](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/junkie/ToxicBloodDrain.java:14) ripristina immunità sul lanciatore dopo averla rimossa al target; [Grab](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/com/Grab.java:14) non chiama l'hook che applica l'equip di RottenBeer. Sono discrepanze concrete, ma la correzione richiede conferma delle regole, non supposizioni.
- **V:** [Game.resolveMoves](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Game.java:104) muta risorse e mani senza transazione o rollback, prima di completare la catena; nessun recupero su eccezioni inattese. **D:** una risoluzione fallita può lasciare una partita parzialmente modificata.
- **V:** la coda non deduplica utenti e `Game` usa una mappa playerId→player. **D:** ID ripetuti possono sovrascrivere giocatori e produrre una partita diversa dagli iscritti attesi. [QueueServiceImpl.joinQueue](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/QueueServiceImpl.java:33), [Game.constructor](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Game.java:25).

### Mancanza di verifiche automatiche pertinenti

**V:** unico test `contextLoads`, nessuna suite client, nessun test di regole o contratto. **D:** regressioni nei punti precedenti non hanno una rete di protezione osservabile. La prima fase di stabilizzazione dovrebbe provare bootstrap e percorsi critici prima di un refactoring generale. [BmServerApplicationTests](E:/bm/bm-server/src/test/java/com/gsc/bm/BmServerApplicationTests.java:7), [angular.json](E:/bm/bm-web-client/angular.json).

## P2 — manutenzione, capacità e osservabilità

| Tema | Evidenza e rischio |
|---|---|
| Scalabilità/stato | [GameSessionServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/GameSessionServiceImpl.java:17) sincronizza globalmente e cerca gli ID linearmente; stato in memoria e broker semplice non coordinano repliche. Nessuna misura prestazionale eseguita. |
| Costo delle viste | [ViewExtractorServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/view/ViewExtractorServiceImpl.java:27) serializza/clona partita, player e character e consulta il catalogo; costo proporzionale agli oggetti e snapshot. |
| Log asincroni mutabili | [GameLoggingServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/GameLoggingServiceImpl.java:22) passa la lista aggregata mutabile al job e ignora il Future: possibili corse tra accodamento e salvataggio, da verificare. [ActionLog.constructor](E:/bm/bm-server/src/main/java/com/gsc/bm/service/session/model/ActionLog.java:12) clona invece il singolo payload: il successivo svuotamento di loggedEventsList non implica perdita del payload già copiato. |
| Log senza limiti | [WebClientLogsController.saveLogs](E:/bm/bm-server/src/main/java/com/gsc/bm/api/rest/panel/WebClientLogsController.java:33) non autentica né limita il payload a livello applicativo; timestamp client è PK, quindi possibili collisioni. Nessuna retention/paginazione negli export. |
| Esposizione dei log | Snapshot globali contengono mani e mazzi; presenza contiene sessionId. Definire necessità e accesso ai dati, senza assumere policy di conservazione inesistenti. |
| Logging browser | [AppComponent](E:/bm/bm-web-client/src/app/app.component.ts:10) sostituisce console.error e invia HTTP senza gestione errore; possibile amplificazione se il logger remoto fallisce. Da riprodurre. |
| Factory riflessive | [CardFactoryServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/factories/CardFactoryServiceImpl.java:14) e CharacterFactory ritornano null dopo stack trace; la catena successiva può fallire con errori poco informativi. Binding persistiti dipendono da nomi Java. |
| Uguaglianza carte | [AbstractCard.equals](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/AbstractCard.java:94) basato su nome senza hashCode coerente; uso di Set in collezione. Le copie non hanno identità autonoma. |
| UI e subscription | [WebsocketService.joinGame](E:/bm/bm-web-client/src/app/service/websocket.service.ts:68) lascia attiva subscription FFA joined; servizi globali window nel client Phaser; animazioni temporali incomplete. |
| Asset | Catalogo usa molti placeholder; MarvelousCocktail ha sprite nullo e token non assegna sprite, mentre [BattleScene.preload](E:/bm/bm-web-client/src/app/client-phaser/scnenes/battle/battle-scene.ts:31) costruisce URL dagli sprite degli oggetti avversari. Possibili richieste asset non valide. |
| Build/lint | Versioni dipendenze storiche, Node/npm non fissati, lint cita file assenti; AppModule dichiara due volte AdminControlPanelComponent e mette MatSnackBarModule nei providers. Esito compilatore non verificato, audit vulnerabilità non eseguito. |
| Deployment | [server.js](E:/bm/bm-web-client/server.js) ha host fissi, upstream ws non cifrato e nessun fallback SPA/upgrade esplicito; origine server fissa nel profilo Heroku. Routing remoto non verificato. |
| Documentazione/regole | Catalogo, regolamento e codice divergono; non esiste una fonte normativa riconosciuta. Dettagli in [game-rules.md](E:/bm/docs/game-rules.md). |

## Ordine storico suggerito prima degli incrementi (superato dalla roadmap corrente)

1. Recuperare DDL/configurazione e riprodurre build/bootstrap con versioni concordate; verificare mapping JPA e provider Angular.
2. Chiudere autorizzazione su comandi/sottoscrizioni e validare input/identità lato server, con test negativi.
3. Concordare le regole controverse e fissare test su risoluzione, stati condivisi, oggetti e fine partita.
4. Riallineare DTO, registrazione e client Phaser; completare una partita per ogni modalità.
5. Definire recovery, cleanup, logging, versionamento catalogo e obiettivi di capacità prima di riprogettare l'architettura.

Queste sono proposte motivate dalle evidenze, non modifiche realizzate né approvazione implicita di nuove regole.

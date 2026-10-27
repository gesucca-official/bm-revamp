> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale](../game-rules.md) (1.0 a quella data, ora 1.6) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](../rules-conformance.md).

# I02 — Harness di test isolato

23 ottobre 2026. **Completato il perimetro dell'harness:** test server e client eseguibili con la toolchain I01, fixture sintetiche, nessuna dipendenza da DB, SMTP o servizi condivisi. Regole e sorgenti applicativi non modificati. Nessun nuovo pacchetto npm/Maven aggiunto; lockfile invariato. I test caratterizzano soltanto i comportamenti elencati, secondo la baseline provvisoria Q03.

## Comandi riproducibili

Da `E:/bm`, dopo bootstrap/install di I01:

```powershell
./scripts/build.ps1 -Task Test -Offline
./scripts/build.ps1 -Task TestServer -Offline
./scripts/build.ps1 -Task TestClient -Offline
# Comando distinto: unit test più vero contesto applicativo legacy
./scripts/build.ps1 -Task TestServerContext -Offline
```

`Test` esegue unit server e poi client, propagando il primo errore. `Offline` significa dipendenze già presenti nella cache I01, non installazione magica di strumenti assenti. `All` conserva il significato di I01 (build artefatti, test server esplicitamente saltati); non sostituisce `Test`.

Comandi delle singole repository con toolchain fissata:

```text
bm-server:     mvn test
bm-server:     mvn -Pcontext-tests test
bm-web-client: npm test
```

Usare lo script comune per non ereditare Java 8 o Node 24 dal PATH locale. La prova `TestServerContext` qui è stata eseguita in un processo con override SPRING_/JDBC_/MAIL_/HTTP_AUTH_/STOMP_/LOG_ e JVM rimossi, senza credenziali reali. Non eseguire test del contesto puntando a servizi condivisi.

## Server: JUnit 5 senza Spring

Fonti: [GameFixtures](../../server/src/test/java/com/gsc/bm/model/game/GameFixtures.java), [PlayerTest](../../server/src/test/java/com/gsc/bm/model/game/PlayerTest.java), [MoveTest](../../server/src/test/java/com/gsc/bm/model/game/MoveTest.java).

Le fixture istanziano classi reali del motore con nomi GUI sintetici assegnati direttamente, senza factory, catalogo, repository o avvio Spring. Ogni test crea nuovi player/game; l'ordine della pila nelle prove di pesca viene fissato esplicitamente dopo la costruzione. Nessun test si affida alla mescolata casuale o a un ordine di priorità controverso.

| Test | Comportamento verificato |
|---|---|
| drawingItemsPlacesThemOnFieldAndContinuesUntilAction | L'item pescato va sul campo, la pesca prosegue fino all'azione e consuma la pila attesa |
| excessItemsAreForgottenInFifoOrder | Superata la capacità uno del Bruiser, resta l'item più recente |
| emptyDeckSuppliesOnlyOneLastResortUntilUsed | A mazzo vuoto la last resort non si duplica e torna disponibile dopo l'uso/scarto |
| basicAndBoundCardsStayInHandButRegularActionsAreDiscarded | Basic e bound persistono, una regular viene rimossa |
| unaffordableMoveIsRejectedWithoutPendingMoveOrResourceChange | SuperImpact con 24 VIOLENCE è rifiutata; nessuna mossa pendente né consumo risorsa |
| costIsPaidOnlyWhenAppliedAndChangesOnlyTheActingPlayer | Submit non paga subito; applyCostTo consuma 25 del lanciatore e non del bersaglio |
| secondMoveFromSamePlayerDoesNotReplaceTheFirst | Seconda mossa rifiutata senza sostituire o duplicare la prima |
| oneRoundResolvesBothActionsAndAdvancesTurn | Due umani con Struggle risolvono un round: HEALTH 85 entrambi, 2 report, turn 1, pendenti vuote, callback una volta |

Non si approvano così limiti mazzi, intero regolamento o bilanciamento. Usare la capacità attuale del Bruiser e il costo attuale di SuperImpact è caratterizzazione del codice, non nuova decisione di design.

## Separazione del contesto applicativo

Il test originale [BmServerApplicationTests.contextLoads](../../server/src/test/java/com/gsc/bm/BmServerApplicationTests.java) resta presente e invariato nel contenuto; aggiunto soltanto `@Tag("context")`.

Nel [pom.xml](../../server/pom.xml), Surefire esclude il tag context dalla suite unitaria ordinaria e fallisce se non trova test da eseguire. Il profilo `context-tests` include anche il test completo. Nessun `@Disabled`, mock del contesto o finto test di bootstrap sostituisce l'originale. L'esclusione è un confine esplicito della suite, non una dichiarazione che il contesto sia verde.

**Esito reale del profilo completo:** 9 test, 0 failures, **1 error**, 0 skipped. Gli 8 unitari passano; `contextLoads` fallisce su `externalDbEntityManagerFactory → dataSourceExternalDB → NullPointerException`, per proprietà datasource esterno assente. Il codice richiama `Objects.requireNonNull` sul driver in ExternalDbConfig. Bootstrap isolato dei datasource e profilo applicativo di test rimangono I03.

## Client: test di classi senza browser

Fonti: [tsconfig.spec.json](../../client-debug/tsconfig.spec.json), [run.ts](../../client-debug/tests/run.ts), [card-in-hand.spec.ts](../../client-debug/tests/card-in-hand.spec.ts).

Il nuovo `npm test` usa **ts-node e TypeScript già nel lockfile**, con Node assert; non aggiunge Jest/Karma o dipendenze nuove alla baseline legacy. Il runner scopre i file `tests/*.spec.ts`, esegue i casi esportati, mostra nomi/esiti e restituisce codice non zero su asserzione, errore di caricamento/compilazione o zero test scoperti. Il runner è piccolo e sincrono/asincrono, non una nuova infrastruttura di browser testing.

I test istanziano il vero CardInHandComponent e un GameService locale senza trasporto, si sottoscrivono al vero EventEmitter, chiamano `playThis` e controllano il comando emesso una sola volta. Coprono:

1. Azione ordinaria: nome carta, identità, gameId, target avversario e choices null.
2. Character-bound: target SELF e carta selezionata in DISCARD_ONE.
3. Oggetto vicino: SELF separato dal nome item in TARGET_ITEM.
4. Oggetto lontano: ID avversario separato dal nome item in TARGET_ITEM.

Non sono test TestBed, DOM o E2E: non verificano Angular dependency injection, template, browser, STOMP o comportamento server del payload. Queste verifiche restano agli incrementi successivi; il client Phaser non viene collaudato qui.

## Prove effettive

| Esecuzione | Risultato |
|---|---|
| Test combinato offline dopo le mutazioni | 8 unit server + 4 client superati sugli originali, comando terminato con successo |
| TestServer offline | 8 test, 0 failures, 0 errors, 0 skipped, BUILD SUCCESS |
| TestClient offline | 4 casi, 4 pass, 0 failed |
| TestServerContext offline | 9 test, 0 failures, 1 error nel contesto legacy, 0 skipped; comando fallisce correttamente |
| Mutazione server, copia isolata | SuperImpact costo 25→24: MoveTest esegue 4 test, 2 failures di asserzione, 0 errors; runner non zero |
| Mutazione client, copia isolata | Target owner sostituito con `wrong-owner`: 4 casi falliti per asserzioni, runner non zero |

Le mutazioni sono state effettuate esclusivamente sotto `.tools/regression-i02/<id>/bm-server` e `bm-web-client`, copie di sorgenti/configurazione senza `.git`, target, dist o node_modules. La copia client usa una junction verso le dipendenze già installate, senza modificarle. Nessuna mutazione ai test: sono stati cambiati i comportamenti applicativi nelle copie, non i valori attesi.

Comando server sulla copia: Maven fissato con `-o -f <copia>/bm-server/pom.xml -Dtest=MoveTest test` e cache workspace. Per il client: Node fissato con ts-node, `--project <copia>/bm-web-client/tsconfig.spec.json <copia>/bm-web-client/tests/run.ts`. Nessun server avviato. I fallimenti attesi provano la sensibilità di questi casi, non una copertura esaustiva delle regressioni.

Log locali in `.build-logs/i02-server-unit.log`, `i02-client-unit.log`, `i02-server-context.log`, `i02-server-mutant.log`, `i02-client-mutant.log`, `i02-isolated-suite.log`. Il percorso delle copie è registrato in `i02-regression-copy.txt`. I report Surefire sono in `bm-server/target/surefire-reports`, e possono essere sostituiti dalle esecuzioni successive; i log distinguono i risultati.

## Limiti e prossimo passo

Nessun avvio completo, partita end-to-end, accesso JDBC, SMTP o servizio condiviso. Non sono coperti autorizzazioni, autenticazione, timeout/reconnect/Elo, tutte le carte, stati o persistenza. F30 resta **parziale** come copertura complessiva, pur essendo concluso l'harness I02. Il prossimo incremento è I03: scelta e bootstrap della persistenza ricostruita, con un vero profilo isolato per il contesto; non risolverlo aggiungendo credenziali o collegamenti a DB reali nei test.

> I13, 24 ottobre 2026: quick 1vCom completo verificato via CLI con umano Bruiser e Junkie; UX debug separata con casualità reale fino al vincitore e secondo avvio. Nessuna meccanica modificata. [Report, comandi e limiti](i13-report.md). Le evidenze precedenti restano storiche.

> Aggiornamento 24 ottobre 2026: **I19a completato nel perimetro quick/F27**, I26 e I12 riverificati. Archivio eventi immutabili con versioni/stato/ordine iniziale pre-pesca, mosse/report/transizioni/esito ed export JSON CLI; migrazione V1→V2 su copia isolata e guasti post-commit osservabili senza rollback del round. PASS: 218 test server + 18 client; contesto completo separato 277 test; check-rules; JAR e due avvii sintetici. [Report I19a, prove e limiti](i19a-report.md), [contratto](../match-archive.md). Nessuna nuova UX manuale, I19b/restart/restore non avviati; prossimo I13. Le evidenze datate sotto rimangono storiche.

> Pianificazione aggiornata il 24 ottobre 2026: [roadmap della versione base approvata](../roadmap.md). I01–I11 acquisiti; prossimo I26, CLI testuale leggero per gli scenari automatici applicativi senza UX (unit e integrazioni mirate restano diretti). Elo/I25/F38 rinviato, fuori dalla base. Chiusura I22 con prove tecniche e UX e approvazione esplicita del proprietario. Nessuna nuova implementazione con questa revisione; regolamento vigente 1.3. I censimenti e i risultati datati sotto restano storici nei rispettivi ambiti.

## Verifica della revisione documentale — 24 ottobre 2026

Solo pianificazione e documenti: nessun nuovo comportamento implementato. Sezioni I01–I11 della roadmap conservate integralmente; report degli incrementi e regolamento 1.3 invariati. Verificati i collegamenti locali modificati e la presenza della nota modello per ogni incremento residuo.

| Verifica eseguita | Risultato |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | 123 test server ordinari e 18 client passati, nessun errore |
| `python scripts/check-rules.py` | Regolamento/copia client, 39 carte e token, tipologie, testi e starter coerenti; SQLite integro |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 177 test server nel profilo completo, zero failure/error/skipped |

Log locali: `.build-logs/roadmap-2026-10-24-tests.log` e `.build-logs/roadmap-2026-10-24-context.log`. Il contesto completo è stato verificato separatamente dalla suite ordinaria. Queste prove non certificano una partita completa, non implementano il CLI e non approvano la versione base. Non è stata ripetuta una verifica browser per questa modifica documentale. Segue lo storico delle verifiche precedenti.

## Verifica I11 - 23 ottobre 2026

[Report I11](i11-report.md): 137 server completi, 83 ordinari e 18 client verdi. Test nuovi per rollback dopo costo/effetto e timer, nuovo tentativo, snapshot concorrente, isolamento fra partite e errori di pubblicazione dopo commit. Regressioni I09/I10 su STOMP reale verdi; build riuscite. Regolamento/catalogo/copia client aggiornati insieme a 1.1. Nessuna partita completa certificata. Segue lo storico.

## Aggiornamento I10 - 23 ottobre 2026

I10 completato: quick/1vCom reale dal browser Debug, ready privato, vista iniziale, primo round e ritorno alla mano verificati senza errori console. Test deterministico su STOMP reale verifica unico ready/gameId, due partecipanti, errore controllato e nuovo invio, costi/danni/pesca e una mossa bot per round; estraneo non riceve ready altrui. Client Debug iniziale, join duplicati bloccati mentre pending, pulsante Continue nei riepiloghi. 132 test server completi, 78 ordinari e 18 client verdi; build riuscite. Nessuna regola o politica del bot modificata. Partita completa non certificata. [Report I10](i10-report.md). Prossimo I11. Segue lo storico.

## Aggiornamento I09 - 23 ottobre 2026

I09 completato per contratto vista/comando: dead/bindingName nella vista, modello client deck allineato, validatore JSON prima del motore e blocco UI delle scelte incomplete. Partita fixture su STOMP reale: vista privata, mossa valida senza pagamento anticipato, duplicato/null rifiutati senza sostituire la mossa, estraneo e gameId incoerente negati. 131 test server completi, 78 ordinari e 17 client verdi; build riuscite. Nessun round o match completo dal browser certificato: I10 resta il prossimo incremento. [Report I09](i09-report.md). Segue lo storico.

## Chiusura verifica visuale I07 - 23 ottobre 2026

Verifica completata in una nuova sessione browser: login devAlice, dialogo applicativo Log Out confermato, ritorno al login con campi vuoti e pulsante disabilitato, nuovo accesso e profilo devAlice/USER ricevuto. Con devBob nella seconda scheda, secondo logout di Alice: presenza 2 -> 1; nuovo accesso: 1 -> 2. Nessun errore console nei due client. **I07 completato anche sul percorso visuale dell'hub.** Le precedenti indicazioni di verifica pendente sono storiche e superate da questa prova. Il blocco precedente era osservato negli strumenti: la presenza di un dialogo nativo aperto non e stata confermata dall'utente.

Prova con JAR e sorgenti gia compilati, nessuna modifica applicativa aggiuntiva; database sintetico in `.build-logs/i07-final-browser/application.sqlite`. Log server/client nella stessa cartella. Nessuna partita, reconnect nel match o forfait certificato.

## Aggiornamento I07/I08 - 23 ottobre 2026

I08 verificato: 37 binding runtime, due starter e mano iniziale, errori espliciti delle factory; nessuna modifica alle regole. I07 implementato con logout esplicito, reset, presenza senza sessionId e gestione errore profilo. Test: 127 server completi, 75 ordinari, 13 client; build verdi. **Verifica visuale finale logout/login ancora da completare**: dialogo nativo precedente ha bloccato gli strumenti browser; ora sostituito da dialogo applicativo. [Report, evidenze e procedura manuale](i07-i08-report.md). Segue lo storico.

## Verifica I06 - 23 ottobre 2026

[Report I06](i06-report.md): 74 test server ordinari, 85 completi e 9 client verdi. Build JAR e Angular riuscite. Test WebSocket reale: CONNECT valido/errato/duplicato, risposta privata, SUBSCRIBE altrui e SEND falsificati rifiutati, rientro dopo disconnect; HTTP anonimo senza accesso ai log. Browser login/profilo su routing nuovo riuscito, console senza errori. Nessuna partita completa certificata. Segue lo storico.

## Verifica I05 - 23 ottobre 2026

[Report I05](i05-report.md): build server/client verdi; 69 test server ordinari, 77 con contesto e 9 client verdi. Account sintetici creati senza SMTP; password errata rifiutata; due login STOMP/browser simultanei con identita diverse e profilo ricevuto; persistenza e login validati dopo restart senza seed. Nessuna partita certificata. Segue lo storico.

## Verifica I04 - 23 ottobre 2026

[Report I04](i04-report.md): build client riuscita; 65 test server ordinari e 6 client verdi. REST JSON e handshake WebSocket 101 verificati; home, rules, hub, sign-up e redirect senza sessione verificati senza errori runtime finali. Nessun login o match certificato. Segue lo storico.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](../game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](../rules-conformance.md).

**Aggiornamento I03:** contesto Spring, repository SQLite e JAR locale ora verificati; PostgreSQL sostituito da file applicativo separato, catalogo read-only. 73 test server nel profilo completo, nessun errore; controlli delle regole preesistenti superati e nessuna modifica alle regole in I03. La diagnosi storica di datasource non avviabile e IdClass mazzi incoerente è superata dalla nuova implementazione. [Report corrente](i03-report.md). Partita/browser, autorizzazioni e log asincroni completi restano da verificare.

# Verifica effettiva dell'applicazione

**Aggiornamento successivo I02:** il report sotto è storico. Sono ora disponibili 8 unit test server e 4 client superati; contesto applicativo separato e ancora fallito per DB non configurato. [Report più recente I02](i02-report.md).

**Aggiornamento successivo I01:** questo report conserva le prove iniziali. Build successiva server/client riuscita e JUnit realmente avviato (1 errore contesto DB) in [i01-report.md](i01-report.md). Consultare quello per lo stato aggiornato, senza confondere la build con il funzionamento del gioco.

Seconda verifica, 23 ottobre 2026, sulle copie in `E:\bm`. Fonti: documentazione precedente e nuova lettura del codice. Nessun sorgente applicativo modificato, nessuna migrazione eseguita, nessuna credenziale reale utilizzata. Non sono stati contattati gli ambienti applicativi Heroku o servizi SMTP. Sono state effettuate soltanto due richieste anonime ai repository pubblici di dipendenze, entrambe bloccate.

**Eseguito** indica una prova reale; **statico** un comportamento ricostruito dal codice; **non verificato** una prova non raggiunta. Una build bloccata nei prerequisiti non è un errore di compilazione del sorgente né un test fallito sulle regole.

## Esito complessivo

| Componente | Esito effettivo | Limite |
|---|---|---|
| Server Spring Boot | Compilazione, test e avvio bloccati durante la lettura del POM | Nessuna classe compilata, nessun contesto Spring caricato |
| Client Angular | Build, serve e lint bloccati: comando `ng` assente | Nessuna verifica TypeScript/AOT o browser |
| Server statico Express | Avvio fallito: modulo `express` assente | Nessun listener applicativo avviato |
| SQLite incluso | Apertura read-only, query e controlli superati | Non verifica il driver JDBC o il mapping Hibernate |
| PostgreSQL esterno | Non avviato e non collegato | Strumenti/servizi non trovati nei controlli locali; DDL e ambiente isolato pronti all'uso assenti |
| Partita completa | Non verificata | Nessun flusso end-to-end eseguito |

## Ambiente osservato

Comandi eseguiti da PowerShell:

```powershell
Get-Command java,node,npm,mvn,docker,psql,pg_ctl -ErrorAction SilentlyContinue
java -version
& "$env:JAVA_HOME\bin\java.exe" -version
node --version
npm.cmd --version
Get-Service | Where-Object { $_.Name -match 'postgres|docker' }
Get-ChildItem 'C:\Program Files\PostgreSQL','D:\PostgreSQL' -ErrorAction SilentlyContinue
```

- PATH: Java 1.8.0_503; JAVA_HOME: Temurin JDK 17.0.20. Il progetto dichiara target Java 11. Non è stato dimostrato un errore Java/Lombok: Maven si ferma prima di quella fase.
- Node 24.13.0 e npm 11.6.2. Compatibilità con Angular 11 non verificata; le versioni Node/npm non sono fissate dal progetto.
- Maven non nel PATH; distribuzione 3.9.9 disponibile nel percorso utente indicato sotto. Il wrapper del progetto richiede invece 3.6.3.
- `node_modules`, `dist`, `target` e `application-local.yml` assenti.
- `postgres`, `pg_ctl`, `psql`, `docker` non trovati nel PATH anche tramite `shutil.which`; nessun servizio postgres/docker restituito dal filtro e nessuna directory PostgreSQL nelle due posizioni controllate. Questo non esclude installazioni in altri percorsi: non è stata effettuata una ricerca dell'intero disco.

Non sono state lette configurazioni di credenziali utente. Non è stato tentato un collegamento a un DB preesistente o a porte locali di cui non fosse nota la titolarità.

## Comandi server eseguiti

Directory di lavoro: `E:\bm\bm-server`. Per evitare il download preventivo della distribuzione richiesto dal wrapper, già fallito nell'analisi precedente, è stato usato il Maven già disponibile:

```powershell
& 'C:\Users\gesucca\.m2\wrapper\dists\apache-maven-3.9.9\977a63e90f436cd6ade95b4c0e10c20c\bin\mvn.cmd' -o test
& 'C:\Users\gesucca\.m2\wrapper\dists\apache-maven-3.9.9\977a63e90f436cd6ade95b4c0e10c20c\bin\mvn.cmd' -o compile
& 'C:\Users\gesucca\.m2\wrapper\dists\apache-maven-3.9.9\977a63e90f436cd6ade95b4c0e10c20c\bin\mvn.cmd' -o spring-boot:run
```

Tutti e tre i tentativi restituiscono lo stesso errore di risoluzione:

```text
Non-resolvable parent POM for com.gsc:bm-server:0.0.1-SNAPSHOT
org.springframework.boot:spring-boot-starter-parent:pom:2.4.3 (absent)
Cannot access central (...) in offline mode
parent.relativePath points at no local POM
```

**Classificazione: ambiente/dipendenze.** Il parent dichiarato nel [pom.xml](../../bm-server/pom.xml) non è nella cache locale. Compilatore, Surefire e applicazione non vengono avviati; non esiste quindi un esito di compilazione Java o di `contextLoads`. Il comando di avvio si ferma prima dell'uso di configurazioni o credenziali.

## Comandi client eseguiti

Directory di lavoro: `E:\bm\bm-web-client`.

| Comando | Risultato osservato | Classificazione |
|---|---|---|
| `npm.cmd run build` | Lancia `ng build --aot --configuration=production`; `'ng' is not recognized` | Dipendenze locali assenti; compilazione non raggiunta |
| `npm.cmd test -- --watch=false` | `Missing script: "test"` | Configurazione progetto: suite non esposta |
| `npm.cmd start -- --host=127.0.0.1` | Lancia serve con proxy; `'ng' is not recognized` | Dipendenze locali assenti; listener non avviato |
| `node server.js` | `MODULE_NOT_FOUND: Cannot find module 'express'`, alla prima require | Dipendenze locali assenti; nessun inoltro ai remoti avvenuto |
| `npm.cmd run lint` | Lancia `ng lint`; `'ng' is not recognized` | Dipendenze locali assenti; nessuna analisi lint eseguita |

Npm segnala anche di non poter scrivere i propri log nella cache utente. È un problema dei permessi locali, distinto dall'assenza dello script `test`. I comandi sono stati eseguiti separatamente nella sequenza sopra; il risultato aggregato della shell non è usato come conteggio dei test.

## Disponibilità della rete per le dipendenze

Prima di procedere con installazioni è stata verificata la raggiungibilità dei due repository pubblici con Python e senza autenticazione:

```python
import urllib.request
for url in [
    'https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-starter-parent/2.4.3/spring-boot-starter-parent-2.4.3.pom',
    'https://registry.npmjs.org/@angular%2fcore/11.2.1',
]:
    try:
        with urllib.request.urlopen(url, timeout=8) as response:
            print(url, response.status, len(response.read()))
    except Exception as error:
        print(url, type(error).__name__, str(error))
```

Entrambe: `URLError`, `WinError 10013`, socket vietato dai permessi di accesso. **Classificazione: restrizione di rete dell'ambiente di esecuzione**, non prova che i repository pubblici siano indisponibili. Nessuna installazione `npm ci` o download Maven online completato/tentato successivamente; nessun lockfile aggiornato. La compatibilità effettiva delle dipendenze resta da provare quando il provisioning sarà possibile.

## Database: prove effettive

SQLite 3.45.3, tramite Python. Comando riproducibile eseguito come script su stdin (`@' ... '@ | python -` in PowerShell):

```python
import pathlib, sqlite3, hashlib
path = pathlib.Path('E:/bm/bm-server/src/main/resources/cards.sqlite')
before = hashlib.sha256(path.read_bytes()).hexdigest()
db = sqlite3.connect(path.as_uri() + '?mode=ro', uri=True)
print(db.execute('pragma integrity_check').fetchall())
print(db.execute('pragma foreign_key_check').fetchall())
for table in ['CRD001_GUI', 'CRD002_KEYWORDS', 'CRD003_CHARACTERS',
              'DCK001_STARTERS', 'DCK002_STARTERS_CH']:
    print(table, db.execute('select count(*) from ' + table).fetchone()[0])
print(db.execute('select C_PG_REF_CLASS,sum(N_QTY) '
                 'from DCK001_STARTERS group by C_PG_REF_CLASS').fetchall())
db.close()
print(before == hashlib.sha256(path.read_bytes()).hexdigest())
```

Risultati: integrità `ok`; foreign key check senza righe; conteggi 37, 4, 2, 30, 2; entrambi gli starter sommano 20; hash prima/dopo uguale. **Controlli superati**, senza modifiche al file. SQLite è incorporato: non richiede avviare un demone separato.

**Non verificato:** apertura dello stesso catalogo tramite JDBC, bootstrap dei due entity manager, transazioni PostgreSQL, JSON dei mazzi/log. [application.yml](../../bm-server/src/main/resources/application.yml) imposta `ddl-auto:none`; nelle copie non ci sono migrazioni/DDL esterni. Non è stato creato uno schema sostitutivo né un database temporaneo che potesse nascondere le anomalie del mapping.

## Test automatici: presenza e risultati

È stata ripetuta la ricerca di file test/spec e annotazioni `@Test`/`@SpringBootTest`, confrontando [angular.json](../../bm-web-client/angular.json), [package.json](../../bm-web-client/package.json) e [BmServerApplicationTests](../../bm-server/src/test/java/com/gsc/bm/BmServerApplicationTests.java).

| Funzionalità | Copertura trovata | Risultato in questa verifica |
|---|---|---|
| Contesto Spring | Un metodo `contextLoads`, senza asserzioni dedicate | Non eseguito: risoluzione POM bloccata |
| Login, email, autorizzazioni | Nessun test specifico trovato | Non verificati |
| Code, creazione partita, bot | Nessun test specifico trovato | Non verificati |
| Costi, effetti, turni, fine partita | Nessun test specifico trovato | Non verificati |
| Mazzi, DB, log, recupero | Nessun test specifico trovato | Non verificati |
| Angular/Phaser/end-to-end | Nessuna suite con runner trovata; nessuno script/target test | Non eseguiti |

Il componente `TestBattleSceneComponent` con JSON fisso è una demo, non una suite automatica. **Test applicativi superati: nessuno eseguito. Test applicativi falliti con asserzioni: nessuno.** I fallimenti dei comandi di test sono blocchi preliminari. I soli controlli positivi runtime riguardano SQLite; nessuna percentuale di copertura misurata.

## Percorso minimo ricostruito, ancora da eseguire

La modalità quick 1vCom con client **debug** minimizza i prerequisiti di gioco: un solo account umano, starter dal catalogo, nessun mazzo personalizzato obbligatorio. Il client debug costruisce TARGET_ITEM, mentre il percorso Phaser ha la lacuna descritta sotto. Non si tratta di un percorso dimostrato funzionante.

1. **Preparare i servizi isolati.** Ottenere le dipendenze e il DDL originale PostgreSQL, configurare database e SMTP di test con sole credenziali sintetiche; impostare origine STOMP locale. Verificare bootstrap Spring e Angular. Fonti: [setup.md](../setup.md), configurazioni `InternalDbConfig`/`ExternalDbConfig`.
2. **Creare un account di prova.** POST `/rest/sign-up/verify` con username/email di test, leggere il codice nella casella SMTP isolata, POST `/rest/sign-up/register` con password sintetica e codice. Le due richieste di disponibilità della UI hanno prefisso errato: usare il contratto documentato permette di isolare il server dalla UI, ma non rende la registrazione UI verificata. [UserSignUpController](../../bm-server/src/main/java/com/gsc/bm/api/rest/users/UserSignUpController.java), [AuthServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/session/AuthServiceImpl.java).
3. **Creare la sessione client.** POST `/rest/sign-in/validate`; poi CONNECT STOMP via SockJS `/ws`, header login/passcode sintetici. Sottoscrivere presenza e `/user/{username}/account/data`, richiedere `/app/user/{username}/account`. Il booleano REST non è un token o una sessione persistente. [WebsocketService.connect](../../bm-web-client/src/app/service/websocket.service.ts).
4. **Avviare la partita.** Sottoscrivere `/user/{username}/game/quick/1vCom/ready`; inviare username come stringa a `/app/game/quick/1vCom/join`; ricevere gameId. Il server crea umano e bot dai due starter. [QuickGameQueuesController](../../bm-server/src/main/java/com/gsc/bm/api/ws/QuickGameQueuesController.java), [GameFactoryServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/factories/GameFactoryServiceImpl.java).
5. **Recuperare la vista iniziale.** Sottoscrivere topic update/move, destinazioni private view/illegalMove e inviare `/app/game/{gameId}/{playerId}/view`. Verificare il routing reale delle destinazioni private prima di proseguire: non è stato collaudato. [GameController.getGameView](../../bm-server/src/main/java/com/gsc/bm/api/ws/GameController.java).
6. **Eseguire un'azione.** Selezionare una carta realmente ricevuta in mano, bersaglio valido e risorse sufficienti. Inviare Move con gameId/playerId coerenti, `playedCardName` GUI esatto, targetId e choices necessarie; per bound scegliere uno scarto ordinario, per item TARGET_ITEM. Il bot presenta automaticamente una mossa; quando tutti hanno presentato, `Game.resolveMoves` risolve il turno. Nessuna carta o nome GUI va inventato dal test. [Move.isValidFor](../../bm-server/src/main/java/com/gsc/bm/model/game/Move.java), [Game](../../bm-server/src/main/java/com/gsc/bm/model/game/Game.java).
7. **Leggere il risultato.** Alla notifica `/topic/game/{gameId}/update`, richiedere nuovamente la vista e verificare risorse, mano, mosse risolte ed effetti temporali. Ripetere fino a over, controllare winner e inviare leave. Verificare cleanup e assenza di sessioni residue.
8. **Provare separatamente i mazzi.** `/app/user/{username}/deck` salva il DTO, `/app/user/{username}/account` lo rilegge; un open 1vCom usa quel mazzo. Serve PostgreSQL e mapping valido; non è un salvataggio della partita. [UserAccountServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java).

### Quale stato si può salvare o recuperare

**Statico:** `GameSessionServiceImpl.getGame` recupera soltanto oggetti nella mappa del processo. La richiesta view recupera la vista della partita attiva, non un checkpoint persistito. [GameSessionServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/session/GameSessionServiceImpl.java).

**Statico:** credenziali e mazzi usano repository PostgreSQL. `GameLoggingServiceImpl`, con `log.db=Y`, accoda snapshot/report per salvataggio; l'esportazione REST dei log non li ricarica nel motore. Non è stato trovato un endpoint o servizio che ripristini una partita dopo restart. Salvataggio mazzo, lettura vista attiva, esportazione log e ripresa partita sono capacità diverse; soltanto i primi tre percorsi hanno implementazioni trovate, tutte non verificate end-to-end. [GameLoggingServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/session/GameLoggingServiceImpl.java), [GameLogsController](../../bm-server/src/main/java/com/gsc/bm/api/rest/panel/GameLogsController.java).

## Blocchi per una partita completa

| Categoria | Evidenza | Conseguenza e certezza |
|---|---|---|
| Ambiente, osservato | Dipendenze Maven/npm assenti e rete vietata | Impedisce ora build/avvio e quindi qualsiasi partita reale |
| Ambiente/provisioning | PostgreSQL e schema di test non disponibili; configurazione locale assente | Nessun account o mazzo di prova utilizzabile verificato |
| Codice, statico | IdClass mazzi username+deckId, `@Id` solo su username in [UserDecksRecord](../../bm-server/src/main/java/com/gsc/bm/repo/external/UserDecksRecord.java) | Possibile blocco JPA all'avvio; non osservato perché bootstrap non raggiunto |
| Codice, statico | AppComponent inietta DatePipe, provider non trovato nei sorgenti | Possibile blocco bootstrap Angular; non è un errore di compilazione dimostrato |
| Codice, statico | URL disponibilità registrazione senza `/rest` | Percorso UI non corrisponde al proxy incluso; fallimento HTTP da riprodurre |
| Codice, statico | Phaser omette TARGET_ITEM e usa nome item come target | Contratto incoerente con Move.isValidFor per azioni su oggetti; non tutte le azioni risultano utilizzabili dal percorso grafico |
| Codice, statico | `dead` manca nella vista server ma è usato dal client; fine Phaser senza leave e prosecuzione dopo destroy | Rendering/bersagli e conclusione partita da verificare; non si afferma che ogni partita fallisca |
| Codice, statico | Disconnessione non completa cleanup partita; nessun timeout/recovery | Una partita abbandonata può restare in attesa; assenza di ripristino dopo restart |

Fonti dei blocchi UI: [AppComponent](../../bm-web-client/src/app/app.component.ts), [AppModule](../../bm-web-client/src/app/app.module.ts), [SignUpComponent](../../bm-web-client/src/app/connection/sign-up/sign-up.component.ts), [BattleScene](../../bm-web-client/src/app/client-phaser/scnenes/battle/battle-scene.ts), [PhaserClientComponent](../../bm-web-client/src/app/client-phaser/phaser-client.component.ts), [ClientCharacterView](../../bm-server/src/main/java/com/gsc/bm/service/view/model/client/ClientCharacterView.java). Per anomalie degli effetti e autorizzazioni restano valide le evidenze in [technical-debt.md](../technical-debt.md): non sono state elevate a errori runtime dimostrati.

## Verifiche manuali ancora necessarie

1. Installazione delle dipendenze, compilazione completa Java/TypeScript/AOT e lint; fissare una coppia Node/npm adatta e verificare JDK/Lombok.
2. Avvio isolato PostgreSQL con DDL originale, bootstrap dei datasource, JDBC SQLite e mapping ID/JSON; nessuna migrazione distruttiva.
3. Bootstrap browser, caricamento asset e route profonde; controllare console e richieste di rete.
4. Registrazione con SMTP di test, errori/codici scaduti e login con identità sintetiche; verificare callback d'errore STOMP.
5. Routing privato di account/ready/view, riservatezza delle mani e rifiuto di identità o sottoscrizioni non autorizzate.
6. Almeno una partita completa quick 1vCom con debug, poi Phaser; validare costi, scarto, item, annullamenti, morte, fine turno e vincitore rispetto alle regole concordate.
7. Due browser/account per 1v1; FFA con iscritti distinti, avvio forzato e bot. Provare join ripetuti e disconnessioni.
8. Salva/rileggi mazzo, chiudi e riapri sessione, avvia open 1vCom; verificare che modifiche e identità restino coerenti.
9. Con `log.db=Y` su DB di test, attendere il salvataggio asincrono, leggere i record senza cancellarli; distinguere esito partita da ultimo leave.
10. Riavvio controllato del solo ambiente di test e perdita dello stato in memoria; non aspettarsi una ripresa che il codice non implementa.

## Controllo modifiche

Stato Git delle due repository controllato prima e dopo con `git -c safe.directory=E:/bm/<repo> -C <repo> status --porcelain`. L'eccezione safe.directory vale soltanto per il comando, senza modificare la configurazione globale. I documenti prodotti sono nella directory comune `E:\bm\docs`, esterna alle due repository. L'hash del catalogo SQLite è invariato. Nessuna funzionalità applicativa è dichiarata funzionante sulla base di questa verifica.

## Esecuzione roadmap — CLI parziale, 24 ottobre 2026

Aggiunti CLI e scenario reale isolato descritti nel [report I26](i26-report.md). Suite ordinaria: 123 test server e 18 client passati; contesto Spring completo separato: 178 test passati, nessun errore/fallimento/skipped. Controllo regolamento/copia client/catalogo passato. Log: .build-logs/current-tests.log e .build-logs/cli-context.log. Nessun nuovo comportamento di gioco attivato. I26 ancora aperto; nessun incremento successivo dichiarato concluso.


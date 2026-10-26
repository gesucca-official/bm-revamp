## Guida corrente I22 — 26 ottobre 2026

Regolamento **1.6**, schema applicativo **V001–V003**, CLI I26 completo e quattro
modalità locali implementate. Reconnect nel processo vivo entro 30 s anche
vsCom; clock mossa 30 s soltanto con altri umani. Restart pulito/crash chiude gli
attivi in draw «riavvio server», senza restore giocabile o Elo. Conservare
SQLite e la directory sorella `.match-recovery` insieme; nessun reset DB.

La [guida della radice](../README.md) contiene preparazione, build e avvio correnti
per il monorepo. Toolchain Windows x64 fissata in `scripts/toolchain.json`;
Python 3.12 usato per le verifiche. Prima installazione da rete, poi build offline
con `.tools/m2`, `.tools/npm-cache` e dipendenze client già installate. Non usare
Procfile, `start:heroku` o `server.js` legacy per questo avvio locale.

Eseguire dalla radice `build.ps1 -Task Test -Offline`, `check-rules.py` e,
separatamente, `build.ps1 -Task TestServerContext -Offline`; quindi
`verify-match-manifests.py`. Il profilo completo rigenera le evidenze CLI/I24
richieste dal controllo manifest. Per verificare l'esatto candidato consegnato
prima di rigenerare artefatti/evidenze: `python scripts/i22-candidate.py --verify`.
Un nuovo build può cambiare il contenitore JAR e le prove hanno ID casuali:
per una nuova accettazione rigenerare consapevolmente il manifest solo dopo le
verifiche complete. [Report I22 e limiti](reports/i22-report.md).

Le sezioni datate sotto sono conservate come storico: frasi su I26 parziale,
regolamenti precedenti o contesto Spring rosso non descrivono lo stato corrente.
La base richiede ancora approvazione esplicita del proprietario.

---

> Aggiornamento I19b, 26 ottobre 2026: bootstrap compatibile V001/V002/V003; nessun reset. Tutte le quattro modalità registrano sempre, indipendentemente da log.db. Conservare SQLite e la directory sorella `<app.database.path>.match-recovery` insieme: contiene batch immutabili per recuperare scritture fallite, senza retention automatica. Retry dopo record/export, ogni `app.archive.retry-ms` (default 1000 ms) e all’avvio del servizio; nessun restore giocabile o restart→draw prima di I24. [Contratto, limiti di durabilità](match-archive.md), [prove I19b](reports/i19b-report.md). Gli aggiornamenti datati sotto restano storici. Regolamento 1.5 invariato.

> Aggiornamento I14/I23, 25 ottobre 2026: regolamento corrente 1.5, copie server/client/catalogo allineate. CLI e debug supportano timeout mossa multiplayer e rientro entro 30 s nello stesso processo, anche vsCom (senza timeout mossa). Ricompilare entrambi prima della prova. Nel debug, «Simula disconnessione» chiude soltanto il trasporto; accedere di nuovo con lo stesso account. «Abbandona» e «Log Out» eseguono invece forfait immediato e attendono conferma. «Esci dalla coda» rilascia la coda. Nessun reset DB richiesto, nessun restore dopo restart. [Contratto](api.md), [CLI](cli.md), [prove](reports/i14-i23-report.md). Le sezioni datate sotto sono storiche.

> Aggiornamento I19a, 24 ottobre 2026: il bootstrap applica V002 dopo V001 validata, preservando dati e checksum precedenti. Il quick registra sempre in LOG003, anche con log.db=N; il flag continua a governare i logger legacy. Export CLI dei match conclusi e comportamento dei guasti sono descritti in [match-archive.md](match-archive.md). Nessun reset dei dati necessario o autorizzato. Le istruzioni e versioni datate sotto rimangono storiche. Regolamento corrente 1.3.

> Pianificazione aggiornata il 24 ottobre 2026: [roadmap della versione base approvata](roadmap.md). I01–I11 acquisiti; prossimo I26, CLI testuale leggero per gli scenari automatici applicativi senza UX (unit e integrazioni mirate restano diretti). Elo/I25/F38 rinviato, fuori dalla base. Chiusura I22 con prove tecniche e UX e approvazione esplicita del proprietario. Nessuna nuova implementazione con questa revisione; regolamento vigente 1.3. I censimenti e i risultati datati sotto restano storici nei rispettivi ambiti.

## Verifica secondo la nuova roadmap

Regolamento vigente **1.3**: le istruzioni datate sotto per 1.1 sono storiche. I comandi disponibili restano `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`; eseguire separatamente `./scripts/build.ps1 -Task TestServerContext -Offline` per il contesto completo. Il CLI I26 è disponibile in forma parziale: [guida](cli.md), [prove e limiti](reports/i26-report.md). I26 non è ancora chiuso. Non è necessario avviare il browser per i futuri test applicativi non UX. La versione base non è ancora approvata.

## Aggiornamento regolamento 1.1 - I11

Ricompilare server e client prima della prova manuale: il catalogo incluso nel JAR e la pagina Regole devono riportare 1.1. Fermare i processi prima di `./scripts/build.ps1 -Task Server -Offline`; compilare il client con `-Task Client -Offline`. Account/schema applicativo invariati, nessun reset dei dati necessario. [Cambiamenti e verifiche I11](reports/i11-report.md).

## Primo round nel debug - I10

Dopo avvio locale con gli script dev.ps1 e account I05, aprire http://localhost:4200/hub, accedere con devAlice/local-alice, lasciare Debug e scegliere Quick Modes -> Join 1vCom Game. Continue chiude Begin; scegliere una carta Play abilitata e gli eventuali target/scarto. Dopo il round usare Continue per Turn Resolution e End of Turn Effects. Percorso verificato nel browser, non una partita completa o garanzia su ogni mano casuale. [Report I10](reports/i10-report.md).

## Aggiornamento I06

La procedura I05 resta valida. Ricompilare e riavviare sia client sia server: i vecchi path privati non sono compatibili con I06. La seconda connessione dello stesso account viene rifiutata; chiudere la precedente e attendere il rilascio prima di ritentare. Usare devAlice e devBob per due sessioni diverse. Il rientro nella partita entro 30 secondi e un requisito futuro, non una funzione gia pronta. [Report I06](reports/i06-report.md).

## Account locali I05 verificati

Primo avvio: `./scripts/dev.ps1 -Task Server -SeedAccounts`; secondo terminale: `./scripts/dev.ps1 -Task Client`. Aprire **http://localhost:4200/hub**. Account sintetici: **devAlice / local-alice** e **devBob / local-bob**. Nessuna email necessaria. Gli account persistono; il flag non sovrascrive identita esistenti e non serve ai riavvii successivi. Chiudere il server prima di ricompilare il JAR. Non usare Register per il provisioning locale. Login al relativo hub verificato per entrambi; partita non ancora certificata. [Report I05](reports/i05-report.md).

## Avvio browser I04 verificato

Da `E:/bm`, in due terminali: `./scripts/dev.ps1 -Task Server` e `./scripts/dev.ps1 -Task Client`. Aprire **http://localhost:4200** dopo la compilazione; fermare con Ctrl+C. Gli script usano gli strumenti locali I01. Per ricompilare: `./scripts/build.ps1 -Task Server -Offline` e `./scripts/build.ps1 -Task Client -Offline`.

Home, regolamento, login/registrazione e redirect senza sessione verificati nel browser. `python scripts/check-local-proxy.py` controlla REST e upgrade WebSocket con entrambi i processi attivi. Nessun account pronto: login e partita non certificati. Email disabilitata; Send Code mostra un errore controllato. Non usare start:heroku per il backend locale. [Report I04](reports/i04-report.md).

## Avvio browser I04 verificato

Da `E:/bm`, in due terminali: `./scripts/dev.ps1 -Task Server` e `./scripts/dev.ps1 -Task Client`. Aprire **http://localhost:4200** dopo la compilazione; fermare con Ctrl+C. Gli script usano gli strumenti locali I01. Per ricompilare prima dell'avvio: `./scripts/build.ps1 -Task Server -Offline` e `./scripts/build.ps1 -Task Client -Offline`.

Home, regolamento, schermate login/registrazione e redirect senza sessione verificati nel browser. `python scripts/check-local-proxy.py` controlla REST e upgrade WebSocket con entrambi i processi attivi. Nessun account pronto: login e partita non certificati. Email locale disabilitata; Send Code mostra un errore controllato. Non usare start:heroku per il backend locale. [Report I04](reports/i04-report.md).

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

## Avvio locale I03: SQLite, nessun PostgreSQL

**Procedura corrente verificata sul server.** Da `E:/bm`:

```powershell
./scripts/build.ps1 -Task Test -Offline
./scripts/build.ps1 -Task TestServerContext -Offline
./scripts/build.ps1 -Task Server -Offline
python scripts/smoke-server.py
```

Per avviare il backend in primo piano (non il browser), da `E:/bm/bm-server`:

```powershell
& ../.tools/zulu11.84.17-ca-jdk11.0.29-win_x64/bin/java.exe -jar target/bm-server-0.0.1-SNAPSHOT.jar
```

Il profilo predefinito local ascolta `127.0.0.1:8080`, context path `/api`; apre il catalogo in sola lettura e crea lo schema applicativo versionato in `./data/bm.sqlite` relativo alla directory corrente. Override con `BM_DATABASE_PATH` o `--app.database.path=<file>`. Usare un filesystem locale, un solo processo server e un file separato dal catalogo. File esistente non gestito o metadata di versione/checksum incompatibili causano arresto, senza ricreazione automatica. I dati applicativi sono esclusi da Git.

Nessuna credenziale reale, account predefinito o SMTP richiesti. Email disabilitata: una richiesta di invio fallisce esplicitamente; provisioning di account di sviluppo resta I05. Admin HTTP Basic opzionale, senza valori predefiniti: per abilitarlo configurare esplicitamente entrambe le proprietà http-auth e password codificata; modello ruoli resta successivo. Non esporre il backend legacy in rete pubblica: autorizzazioni I06 ancora da completare.

Risultati: 65 test ordinari server + 4 client verdi; 73 server verdi includendo il contesto. Lo smoke avvia due processi su loopback con file sintetico e prova dati persistiti, non partite ripristinate. [Report I03](E:/bm/docs/reports/i03-report.md). La documentazione di PostgreSQL e del contesto rosso più sotto è storica, precedente a I03.


# Prerequisiti, avvio e verifiche

## Test isolati I02 verificati

Dopo installazione I01, da `E:/bm`:

```powershell
./scripts/build.ps1 -Task Test -Offline
# Oppure separati:
./scripts/build.ps1 -Task TestServer -Offline
./scripts/build.ps1 -Task TestClient -Offline
# Opt-in: include il contesto legacy, ancora rosso senza I03
./scripts/build.ps1 -Task TestServerContext -Offline
```

Esiti: **8 unit test server + 4 client passano**; nessun DB/SMTP/browser avviato. Il profilo completo esegue 9 test, di cui `contextLoads` fallisce sul datasource esterno non configurato. La suite ordinaria esclude esplicitamente il tag context; non sostituisce il bootstrap applicativo. Il client usa ts-node/Node assert già nel lockfile per test di classi, non Angular TestBed/DOM. [Report I02](E:/bm/docs/reports/i02-report.md).


## Procedura I01 verificata: build locale Windows x64

Aggiornamento del 23 ottobre 2026: toolchain locale fissata JDK Zulu 11.0.29+7, Maven 3.6.3, Node 12.22.12/npm 6.14.16. Le build di server e client sono ora raggiunte e riuscite. È una baseline di recupero legacy per sviluppo, non la scelta definitiva per un rilascio pubblico. Dettagli, confronto alternative, checksum ed esiti in [i01-report.md](E:/bm/docs/reports/i01-report.md).

Da `E:/bm`, con Python >=3.9 e PowerShell:

```powershell
python scripts/bootstrap.py
./scripts/build.ps1 -Task All
# Dopo il popolamento della cache:
./scripts/build.ps1 -Task All -Offline
./.tools/node-v12.22.12-win-x64/node.exe scripts/smoke.cjs
```

Output: `bm-server/target/bm-server-0.0.1-SNAPSHOT.jar` e `bm-web-client/dist/bm-web-client`. Cache e runtime in `.tools`; nessuna modifica globale a PATH/JAVA_HOME. Gli script comuni vanno conservati accanto alle due checkout. `All` salta i test server in modo esplicito e non verifica una partita; per eseguire il contesto originale usare `./scripts/build.ps1 -Task TestServerContext` in un processo senza credenziali/configurazioni reali. Il test completo del contesto fallisce sul datasource esterno non configurato: il profilo applicativo isolato resta I03; i test unitari isolati I02 passano. Nessun SMTP o PostgreSQL reale è necessario per **compilare**.

I paragrafi seguenti conservano la ricostruzione legacy e le prove precedenti a I01. L'assenza di dipendenze e rete lì descritta è storica e non l'esito aggiornato delle build.

**Nota di aggiornamento requisiti:** la procedura sotto ricostruisce lo stack legacy e non è ancora collaudata. Q01/Q02 consentono versioni/stack alternativi e ricostruzione della persistenza senza PostgreSQL; non si deve più attendere un DDL originale recuperabile. SMTP/email obbligatoria e hosting non sono prerequisiti del debug locale corrente. La nuova procedura operativa sarà definita dagli incrementi I01/I03/I05, senza dichiarare già funzionante una sostituzione. Fonte: [decisioni del proprietario](E:/bm/docs/open-questions.md); [roadmap aggiornata](E:/bm/docs/roadmap.md).

Le istruzioni ricostruiscono i comandi presenti e le configurazioni richieste. **Non costituiscono una procedura già collaudata**: build e test si sono arrestati prima della compilazione. Nessun server, database o servizio email è stato avviato durante questa analisi.

## Versioni dichiarate e bloccate

| Area | Evidenza |
|---|---|
| Java | Target 11 in [pom.xml](E:/bm/bm-server/pom.xml), runtime 11 in [system.properties](E:/bm/bm-server/system.properties) |
| Spring | Boot parent 2.4.3; web, websocket, security, mail, JDBC, Spring Data JPA; versione effettiva delle transitive non risolta in questa sessione |
| Altre Java | sqlite-dialect 1.0; hibernate-types-52 2.10.0; spring-security-oauth2 2.3.4.RELEASE; commons-collections4 4.1; PostgreSQL/SQLite JDBC, Lombok e JUnit da gestione dipendenze del POM |
| Maven | Wrapper richiede 3.6.3; wrapper Takari 0.5.6, [maven-wrapper.properties](E:/bm/bm-server/.mvn/wrapper/maven-wrapper.properties) |
| Client | Angular core/CLI 11.2.1 nel lock; TypeScript 4.1.5; Phaser 3.52.0; Express 4.17.1; http-proxy-middleware 1.0.6; SockJS 1.5.0; stompjs 2.3.3 |
| Altre client | Material/CDK, Flex Layout, IonPhaser, RxJS, ngx-markdown, ngx-logger, ngx-loading, SweetAlert2; [package.json](E:/bm/bm-web-client/package.json) |
| Lock client | [package-lock.json](E:/bm/bm-web-client/package-lock.json), formato 1; range del manifest e versione risolta non sempre coincidono (Phaser dichiarato ^3.24.1) |
| Target JS | ES2015 e moduli ES2020; non abilitata modalità strict nel [tsconfig.json](E:/bm/bm-web-client/tsconfig.json) |

**M:** Node e npm non sono fissati da `engines`, `.nvmrc` o equivalente nelle copie censite. Non si prescrive una versione esatta senza ricostruire l'ambiente storico e verificarne la compatibilità. PostgreSQL e SMTP non hanno una versione/provisioning documentati.

## Condizioni necessarie prima dell'avvio server

1. Un JDK adatto al progetto e `JAVA_HOME` coerente. La versione dichiarata dal progetto è 11; JDK diversi richiedono una verifica delle dipendenze, inclusa Lombok.
2. Maven 3.6.3 scaricabile dal wrapper oppure una distribuzione Maven disponibile, e accesso alle dipendenze mancanti.
3. PostgreSQL raggiungibile e schema già preparato dal DDL originale. **Il DDL non è incluso**; non esiste un comando comprovato per creare il database completo. Non attivare automaticamente `ddl-auto=create` come sostituto del DDL.
4. SMTP e proprietà amministrative configurate: i bean le richiedono anche se si intende provare inizialmente solo il combattimento.
5. Verifica del bootstrap JPA, in particolare IdClass dei mazzi e risoluzione del dialetto SQLite: [data-model.md](E:/bm/docs/data-model.md).

## Configurazione richiesta

Il profilo incluso `heroku` legge queste variabili; per una prova locale è possibile usarlo con servizi locali e sovrascrivere l'origine STOMP. È una procedura ricostruita, non eseguita.

| Variabile/proprietà | Significato |
|---|---|
| JDBC_DATABASE_URL | URL JDBC PostgreSQL, es. `jdbc:postgresql://localhost:5432/<database>` |
| JDBC_DATABASE_USERNAME / JDBC_DATABASE_PASSWORD | Credenziali database |
| MAIL_HOST / MAIL_PORT | Host e porta SMTP |
| MAIL_USERNAME / MAIL_PASSWORD | Credenziali SMTP |
| HTTP_AUTH_USERNAME / HTTP_AUTH_PASSWORD | Account HTTP Basic; il valore password deve essere compatibile con l'encoder previsto, non assunto come password in chiaro |
| `stomp.allowedOrigin` | Origine browser esatta; profilo incluso usa `https://botte-micidiali.herokuapp.com`, per locale serve `http://localhost:4200` |
| `log.db` | Y abilita log partita su DB; N li evita e disabilita ingestione log client; un valore assente non ha comportamento equivalente per i due logger |
| `spring.datasource.external.*` | Proprietà utilizzabili direttamente in una configurazione locale, alternativa al profilo Heroku |

Fonti: [application-heroku.yml](E:/bm/bm-server/src/main/resources/application-heroku.yml), [HttpSecurityConfig.configureGlobal](E:/bm/bm-server/src/main/java/com/gsc/bm/conf/http/HttpSecurityConfig.java:33), [ExternalDbConfig.dataSource](E:/bm/bm-server/src/main/java/com/gsc/bm/conf/db/ExternalDbConfig.java:36). Il formato esatto dell'hash amministrativo va verificato con la configurazione Security effettiva; `configureGlobal` passa il valore direttamente a `.password(...)`. La configurazione SMTP base abilita auth/startTLS e specifica trust `smtp.gmail.com`: va confrontata con il servizio scelto.

**V:** `application-local.yml` è ignorato da [resources/.gitignore](E:/bm/bm-server/src/main/resources/.gitignore) e non presente. Non sono state create credenziali né configurazioni sostitutive.

## Comandi ricostruiti

Dopo avere soddisfatto i prerequisiti e impostato le variabili sopra, in PowerShell:

```powershell
Set-Location E:\bm\bm-server
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=heroku" "-Dspring-boot.run.arguments=--stomp.allowedOrigin=http://localhost:4200 --log.db=N"
```

Il proxy locale presume server su 8080, context path `/api`; il POM non fissa un'altra porta. Per impacchettare:

```powershell
.\mvnw.cmd package
& "$env:JAVA_HOME\bin\java.exe" -jar target/bm-server-0.0.1-SNAPSHOT.jar --spring.profiles.active=heroku --stomp.allowedOrigin=http://localhost:4200
```

**M:** esito di test/build/package non verificato. `contextLoads` richiede il contesto applicativo completo e quindi una configurazione utilizzabile; non ha un profilo isolato di test.

Per il client, con una coppia Node/npm compatibile da verificare:

```powershell
Set-Location E:\bm\bm-web-client
npm ci
npm start
```

`npm start` esegue `ng serve --proxy-config proxy.config.json`. Aprire `http://localhost:4200`; il backend deve essere già pronto. La registrazione UI ha un errore di prefisso nelle due richieste di disponibilità, quindi il percorso non è dichiarato funzionante senza interventi futuri. Il client ha inoltre un rischio di bootstrap per DatePipe non fornito: [technical-debt.md](E:/bm/docs/technical-debt.md).

```powershell
npm run build
npm run start:heroku
```

Questi ultimi comandi generano `dist/bm-web-client` e lanciano Express sulla porta `PORT` o 4200. **V:** `server.js` inoltra le API agli host Heroku fissi; non è configurato per usare automaticamente il backend locale. Il [Procfile server](E:/bm/bm-server/Procfile) usa `PORT`, `JAVA_OPTS` e profilo heroku; il [Procfile client](E:/bm/bm-web-client/Procfile) lancia `start:heroku`. **M:** esistenza e funzionamento degli ambienti remoti non controllati.

## Prove effettuate il 23 ottobre 2026

| Prova | Esito effettivo |
|---|---|
| `java -version` dal PATH | Java 1.8.0_503 |
| Java da JAVA_HOME | Temurin JDK 17.0.20; JAVA_HOME punta a `C:\Users\gesucca\scoop\apps\temurin17-jdk\current` |
| Node / npm | 24.13.0 / 11.6.2 disponibili; compatibilità del progetto con queste versioni non dimostrata |
| `.\mvnw.cmd -o test` | Fallimento wrapper: tentativo download Maven 3.6.3, `Permission denied: connect`; l'opzione offline non evita il download della distribuzione del wrapper |
| Maven 3.9.9 già presente, `-o test` | Parent Spring Boot 2.4.3 assente in cache; arresto prima di compilare |
| `npm.cmd run build` | `'ng' is not recognized`; `node_modules` assente |
| Test client | Nessuno script `test` né target Angular test; nessuna suite eseguita |
| SQLite read-only | Integrità ok, foreign key check senza violazioni; due starter da 20, riferimenti classe/immagini del catalogo presenti |

Non sono state installate dipendenze, modificate impostazioni globali, inviati messaggi SMTP, alterati database o contattati gli ambienti applicativi remoti. Le verifiche runtime mancanti comprendono anche routing STOMP privato, JSON effettivo, logging, caricamento asset e una partita completa per ciascuna modalità.

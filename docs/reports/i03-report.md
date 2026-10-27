# I03 — Persistenza SQLite e bootstrap verificati

23 ottobre 2026. **Incremento completato:** PostgreSQL sostituito per i dati applicativi da un file SQLite separato; catalogo esistente aperto read-only; contesto Spring, repository e JAR verificati senza database o SMTP esterni. Nessuna partita completa o interfaccia browser viene certificata da queste prove.

## Stato iniziale e confini

La working copy conteneva già modifiche a regolamento, testi del catalogo, due classi carta e test di conformità, oltre a I01/I02. Sono state preservate. Il nuovo [AGENTS.md](../../AGENTS.md) indica [game-rules.md](../game-rules.md) come fonte normativa: I03 non cambia regole, valori, carte, starter o copia client.

Registrati gli hash iniziali di questi file in `.build-logs/i03-preserved.json`; ricontrollati invariati al termine. Non attribuire a I03 le modifiche pregresse mostrate da Git su RottenBeer, BrokenBeerBottle e cards.sqlite.

## Decisione attuata

- **Catalogo:** resta `jdbc:sqlite::resource:cards.sqlite` e usa i cinque repository JPA interni. Dialetto SQLite reso esplicito, apertura in sola lettura e `ddl-auto=none`.
- **Applicazione:** `app.database.path`, default `./data/bm.sqlite`, letto anche da `BM_DATABASE_PATH`. Percorso relativo alla directory di avvio. Configurazione locale predefinita, listener su `127.0.0.1`.
- **Adattatori:** i repository nel package storico `repo.external` sono ora classi Spring JDBC. I nomi e i metodi usati da servizi/controller restano disponibili; nessun nuovo protocollo client.
- **Schema:** prima versione ricostruita dai modelli; nessuna migrazione di un PostgreSQL storico, non disponibile. Nessun file applicativo preesistente è stato convertito o cancellato.
- **Dipendenze:** rimossi driver PostgreSQL e hibernate-types-52, non più utilizzati. JPA/Hibernate restano per il catalogo; driver SQLite e toolchain I01 invariati.

Il termine “external” nei bean e package mantiene compatibilità con l'iniezione esistente e non indica più PostgreSQL o un servizio remoto. La scelta riguarda questa versione locale di sviluppo; non è una valutazione di capacità per un hosting pubblico.

## Schema e protezioni sui file

Fonte eseguibile: [V001__initial.sql](../../server/src/main/resources/db/application/V001__initial.sql). Inizializzazione: [ApplicationDatabase](../../server/src/main/java/com/gsc/bm/conf/db/ApplicationDatabase.java).

| Tabella | Identità e contenuto |
|---|---|
| BM_SCHEMA_VERSION | Versione intera, checksum SHA-256 della migrazione normalizzata LF, data applicazione |
| USR001_CREDENTIALS | Username PK; email nullable, hash e ruolo obbligatori; indice email non univoco |
| USR002_DECKS | PK composta username+deckId; FK username all'account; mazzo JSON testuale |
| LOG001_GAMES | gameId PK; giocatori/tipo/data/stato e lista ActionLog JSON testuale; indice stato |
| LOG002_WEB_CLIENT | Timestamp PK e campi additional/message, come nel contratto legacy |

Non sono introdotti limiti numerici ai mazzi o nuove regole di legalità. I vincoli riguardano identità strutturale e integrità dei riferimenti. Il timestamp dei log web conserva il comportamento legacy di save/upsert: due record con la stessa chiave possono ancora sostituirsi; la raccolta completa degli eventi e la gestione delle collisioni restano I19.

Un database nuovo e vuoto riceve lo schema in **un'unica transazione**. Su riapertura, versione/checksum e presenza delle tabelle sono controllati; schema più recente o metadata alterati causano errore, senza ricreazione automatica delle tabelle. Un file non vuoto senza BM_SCHEMA_VERSION viene rifiutato **prima** di abilitare WAL o applicare DDL: non si deve usare un catalogo o un database arbitrario come file applicativo. Il checksum verifica la versione della migrazione, non costituisce un audit completo contro ogni alterazione manuale dello schema.

SQLite applicativo: WAL, foreign keys attive su ogni connessione, busy timeout 5.000 ms e synchronous FULL. WAL riduce la contesa lettori/scrittore, ma non consente più scrittori simultanei; vedere [documentazione SQLite WAL](https://www.sqlite.org/wal.html). Foreign keys e timeout vengono configurati esplicitamente per connessione, senza affidarsi ai default; [PRAGMA SQLite](https://www.sqlite.org/pragma.html). I 5 secondi sono un'attesa tecnica del database, **non** il timeout di gioco di 30 secondi.

Avviare una sola istanza locale e usare un file su filesystem locale. Non è verificata inizializzazione simultanea da più processi né uso su filesystem di rete. Per un futuro cambiamento di schema occorre aggiungere una migrazione gestita e testata; non modificare il file V001 già applicato per forzare l'avvio.

## JSON, transazioni e configurazione locale

I mazzi conservano le cinque proprietà UserStoredDeck e i binding originali; non vengono serializzati come entità Hibernate. Aggiunto il costruttore vuoto per la lettura Jackson. ActionLog ha un costruttore JSON esplicito per preservare `when`, `what` e `data`; il costruttore usato dal motore mantiene la copia del payload. I dati generici vengono riletti come rappresentazione JSON/Map, non come ripristino di classi eseguibili o del motore.

Le scritture singole usano statement parametrizzati e upsert; operazioni composte possono usare `externalDbTransactionManager` (DataSourceTransactionManager). Le cancellazioni multiple dei log sono transazionali; il controllo accessi ai controller resta I06/I20. Un vincolo FK violato in una transazione è provato annullare anche la precedente scrittura dell'account.

Email disabilitata di default: [MailConfiguration](../../server/src/main/java/com/gsc/bm/conf/MailConfiguration.java) fornisce un sender che fallisce esplicitamente prima di qualsiasi connessione SMTP. Non simula una mail inviata. Per abilitarla servono `app.mail.enabled=true` e configurazione SMTP esplicita, fuori dal perimetro corrente.

Nessun account amministrativo o giocatore viene creato automaticamente. HttpSecurityConfig accetta username/password HTTP Basic solo se entrambi configurati; senza valori non crea credenziali di default. Questo non completa l'autorizzazione applicativa: i difetti legacy su identità e destinazioni STOMP restano I06. I03 non implementa registrazione locale semplificata, Elo, reconnect o draw automatico dei match dopo restart.

## Test effettivi

| Comando/prova | Risultato osservato |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | Controllo regolamento/catalogo superato; 65 test server ordinari e 4 client superati |
| Maven fissato `-o -Pcontext-tests -f bm-server/pom.xml clean verify` | **73 test server, 0 failures, 0 errors, 0 skipped; BUILD SUCCESS**, JAR prodotto |
| `python scripts/smoke-server.py` | Due avvii del JAR su loopback/porta effimera, HTTP 200; account sintetico prima assente e poi presente dopo riavvio; integrità SQLite ok |
| `python scripts/check-rules.py` | Regolamento, copia client, 37 testi carte e starter allineati; integrità catalogo superata |
| Archivio JAR | Migrazione inclusa, nessun driver PostgreSQL/hibernate-types-52, catalogo incluso byte-identico al sorgente corrente |
| Hash file preesistenti | Regole, catalogo e modifiche alle carte presenti prima di I03 invariati |

I 73 test includono i test di conformità già presenti nel workspace: non sono tutti nuovi di I03. Nuove prove: [ApplicationSchemaTest](../../server/src/test/java/com/gsc/bm/ApplicationSchemaTest.java) (2), [ApplicationPersistenceTest](../../server/src/test/java/com/gsc/bm/ApplicationPersistenceTest.java) (7) e il test originale contextLoads ora verde con [SqliteContextSupport](../../server/src/test/java/com/gsc/bm/SqliteContextSupport.java).

Il profilo `test` usa un nuovo file sotto `target/test-databases` con override DynamicPropertySource; non usa il database locale dell'utente. Copertura:

- Account con hash BCrypt rileggibile dopo riapertura; query email; lettura account/collezione tramite servizio reale.
- Due mazzi per un utente, stesso deckId per utenti diversi, aggiornamento e cancellazione selettiva; round-trip JSON e dati preservati alla riapertura.
- Log partita con payload annidato e timestamp originale; update senza duplicare gameId, query stato e lettura log web.
- Rollback completo su violazione FK; controllo PRAGMA; 12 scritture brevi concorrenti da 4 thread senza perdita. È una prova di correttezza circoscritta, non un benchmark.
- Catalogo: 37 carte istanziate, 2 starter da 20, caratteri/collezione caricabili e tentativo di scrittura rifiutato.
- Email disabilitata; JSON persistito non valido segnalato come errore, non sostituito con un mazzo vuoto.
- Riapertura schema idempotente; metadata versione/checksum incompatibili rifiutati; file estraneo preservato byte per byte.

Lo smoke [smoke-server.py](../../scripts/smoke-server.py) crea un file nuovo sotto `.build-logs/i03-smoke-<id>`, rimuove dal processo override di configurazione/credenziali, avvia il JAR su 127.0.0.1 e chiama solo l'endpoint locale di disponibilità username. Inserisce esclusivamente nel suo nuovo file un account sintetico **non utilizzabile per login** e verifica che il secondo processo lo legga. I processi vengono terminati nel finally; nessun proxy o SMTP remoto è contattato.

## Evidenze e limiti

Log: `.build-logs/i03-unit.log`, `i03-context.log` (prima prova contesto), `i03-final-suite.log`, `i03-server-verify.log` (verifica finale), `i03-packaged-smoke.log`; log dei due processi nella directory smoke indicata dall'output. Gli artefatti non vanno confusi con le precedenti build I01, che contenevano ancora PostgreSQL.

Non verificati: browser/debug end-to-end, una partita completa, autenticazione/autorizzazione completa, registrazione e invio email, consegna asincrona completa dei log durante un match, carico prolungato e recovery di partite. Il riavvio dello smoke prova la persistenza di un account, non la regola restart→draw: quella resta I24. La prossima attività di roadmap è I04, avvio browser/proxy e route con questo backend locale.

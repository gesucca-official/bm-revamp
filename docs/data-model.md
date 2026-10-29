> **Stato documentale:** lo stato corrente del progetto (base I22 approvata,
> client animato con C0 chiusa e C1 non iniziata) è nell'[indice della
> documentazione](README.md#stato-corrente). Le indicazioni datate di incrementi
> prossimi/aperti e priorità della base restano storico, non attività correnti.

> Riferimento corrente I22: schema V001–V003 e registro attivi I19b; la chiusura
> I24 al restart aggiorna atomicamente evento OUTCOME e marker del registro senza
> nuove migrazioni. Conclusi e prefissi durevoli sono conservati. Catalogo read-only
> e dati applicativi restano distinti; nessun reset, restore o campo Elo.
> [Contratto corrente](match-archive.md), [accettazione I22](reports/i22-report.md).
> Le descrizioni datate di lavoro futuro sono storiche.

> Stato corrente I19b, 26 ottobre 2026: schema V1/V2/**V3** compatibile, senza riscrittura dei dati esistenti. `LOG004_MATCH_REGISTRY` conserva gameId PK, modalità, array JSON degli umani, hash INITIAL, sequenza/hash OUTCOME nullable con FK a LOG003. I null identificano gli attivi; finalizzazione unica permanente. Eventi, registrazione e finalizzazione sono una transazione IMMEDIATE. Nessuna inferenza di attività da log storici non registrati, nessuna cancellazione o restore. Batch di analisi immutabili nella directory sorella `<app.database.path>.match-recovery`, ritentati al riavvio del servizio e nel processo vivo. [Contratto e limiti](match-archive.md), [prove di migrazione V1/V2→V3 su copie isolate](reports/i19b-report.md). Gli stati datati sotto sono storici.

> Stato corrente 24 ottobre 2026: **I19a** aggiunge la migrazione non distruttiva V002 e l'archivio quick `LOG003_MATCH_EVENTS`, separato da LOG001. [Contratto completo, compatibilità e guasti](match-archive.md), [prove](reports/i19a-report.md). Le descrizioni I03 e le pianificazioni datate sotto restano storiche: lo schema corrente comprende versioni 1 e 2. Nessun DB reale migrato durante le prove.

## Schema I19a verificato

`LOG003_MATCH_EVENTS`: chiave `(C_GAME_ID,N_SEQUENCE)`, `T_PREVIOUS_HASH`, `T_HASH`, `J_EVENT` TEXT obbligatori. INSERT soltanto, trigger vietano UPDATE/DELETE. Batch transazionali, sequenze contigue per match e catena SHA-256 verificata a scrittura/rilettura; nessuna FK verso sessioni, account o log legacy. `V001__initial.sql` e il suo checksum restano invariati; il bootstrap accetta il prefisso V1 verificato e applica V2 in transazione. File non gestiti, checksum alterati e versioni future vengono rifiutati. WAL/FULL e busy timeout I03 conservati.

L'archivio registra l'esito del motore, non ENDED al leave. Le partite abbandonate prima dell'esito conservano il prefisso, senza inventare un esito. Nessun registro persistente degli attivi, finalizzazione da restart o checkpoint giocabile. `log.db` continua a governare solo il salvataggio legacy: il quick I19a registra sempre, senza sampling. In caso di fallimento la partita prosegue, il recorder segnala WRITE_FAILED e conserva nel processo vivo gli eventi immutabili non persistiti; recupero durevole/retry è I19b.

> La base I22 è completata e approvata. **I26/F39 è completato**: la CLI è disponibile per gli scenari applicativi automatici non UX; unit e integrazioni mirate restano diretti, browser/debug per UX. [Guida CLI](cli.md), [report I26](reports/i26-report.md), [roadmap archiviata](history/roadmap-base-i22.md).

## Dati pianificati per la base (non implementati)

I19a/b/c completerà eventi immutabili, contesto iniziale, versioni e manifest di export; I19b preparerà il registro persistente degli attivi e gli esiti idempotenti necessari a I24. Compatibilità e prove su copia isolata precedono ogni variazione schema. Nessun campo/tabella Elo richiesto; nessun checkpoint giocabile, restore o cancellazione implicita. CLI I26 userà contratti applicativi, senza scritture dirette al DB nei percorsi funzionali.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale](game-rules.md) (1.0 a quella data, ora 1.6) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

## Schema corrente I03 — stato verificato

**Catalogo:** file esistente invariato in I03, aperto read-only tramite JPA. **Applicazione:** nuovo file `app.database.path` (`./data/bm.sqlite`, override BM_DATABASE_PATH), accesso JDBC, nessun PostgreSQL. Il package repo.external e il nome externalDbTransactionManager sono mantenuti per compatibilità, non rappresentano più un database remoto.

Schema eseguibile: [V001__initial.sql](../server/src/main/resources/db/application/V001__initial.sql).

| Tabella | Chiave e dati |
|---|---|
| BM_SCHEMA_VERSION | version PK, checksum SHA-256 normalizzato LF, applied_at |
| USR001_CREDENTIALS | C_USERNAME PK, T_EMAIL nullable con indice non univoco, T_SALTED_HASH/T_ROLE obbligatori |
| USR002_DECKS | PK (C_USERNAME,C_DECK_ID), FK username, J_DECK JSON TEXT obbligatorio |
| LOG001_GAMES | C_GAME_ID PK, giocatori/tipo/data/stato, J_FULL_LOG JSON TEXT obbligatorio; indice stato |
| LOG002_WEB_CLIENT | C_TIMESTAMP PK, additional/message: upsert legacy conservato |

Prima creazione transazionale e riapertura idempotente. Il programma rifiuta file non gestiti e metadata incompatibili; nessun drop/recreate automatico. WAL, synchronous FULL, foreign_keys e busy_timeout=5000 per le connessioni applicative. Nessuna migrazione da un DB storico, nessuna tabella Elo o checkpoint del motore anticipata.

Verificati account/hash, identità composta dei mazzi, round-trip JSON timestamp/payload log, rollback e scritture concorrenti brevi, riapertura del file e due avvii del JAR. I log sono snapshot/report diagnostici; non costituiscono restore della partita. Collisioni timestamp web e completezza del salvataggio asincrono restano I19. [Evidenze I03](reports/i03-report.md). Lo schema PostgreSQL ricostruito sotto è un riferimento storico e non la persistenza corrente.


# Database e persistenza

**Decisioni successive del proprietario:** DDL e materiali PostgreSQL originali non sono più disponibili. Si ricostruisce dai mapping e dal catalogo incluso; PostgreSQL può essere mantenuto o sostituito dopo valutazione. Lo schema descritto sotto è evidenza legacy, non vincolo futuro. Servono log completi ed esiti persistiti per analisi; Elo rinviato, nessun restore della partita. Fonte: [decisioni del proprietario](open-questions.md); [roadmap aggiornata](roadmap.md).

**V:** SQLite verificato direttamente in sola lettura; mapping esterni verificati nel codice. **M:** schema fisico PostgreSQL, dati reali e comportamento JPA non verificati. I nomi delle colonne sotto sono quelli dichiarati, non una migrazione proposta.

## Due datasource

[InternalDbConfig](../server/src/main/java/com/gsc/bm/conf/db/InternalDbConfig.java) definisce datasource primario, entity manager e transaction manager per `repo.internal`. [ExternalDbConfig](../server/src/main/java/com/gsc/bm/conf/db/ExternalDbConfig.java) ne definisce altri per `repo.external`. Entrambi istanziano `DriverManagerDataSource`; non configurano un pool in questi bean.

**V:** URL interno `jdbc:sqlite::resource:cards.sqlite`; driver `org.sqlite.JDBC`. Il profilo Heroku configura PostgreSQL da variabili d'ambiente. `spring.jpa.hibernate.ddl-auto=none`; non si deve assumere che l'app crei le tabelle. [application.yml](../server/src/main/resources/application.yml), [application-heroku.yml](../server/src/main/resources/application-heroku.yml). La dipendenza sqlite-dialect è nel POM, ma non compare una proprietà di dialetto esplicita nei file YAML inclusi: bootstrap Hibernate da verificare.

## SQLite incluso: schema osservato

Fonte primaria: [cards.sqlite](../server/src/main/resources/cards.sqlite), interrogazione `sqlite_master`, conteggi e PRAGMA effettuati il 23 ottobre 2026 con connessione `mode=ro`.

| Tabella | Colonne e vincoli osservati | Righe |
|---|---|---:|
| CRD001_GUI | C_REF_CLASS varchar2 PK; T_GUI_NAME varchar2; T_GUI_DESCRIPTION **int**; T_GUI_IMAGE varchar2; T_GUI_SPRITE varchar2; T_GUI_ROLE varchar2; T_GUI_GAINS varchar2; T_GUI_DAMAGE varchar2 (descrittivi, regolamento R07a: 1.7 ruolo e guadagni, 1.9 danno nominale; esposti come `role`, `gains` e `damage` della carta) | 37 |
| CRD002_KEYWORDS | C_KEYWORD varchar2 PK; T_HTML **int** | 4 |
| CRD003_CHARACTERS | C_REF_CLASS varchar2 PK; T_GUI_NAME varchar2; T_GUI_SPRITE varchar2 | 2 |
| DCK001_STARTERS | C_PG_REF_CLASS varchar2; C_CRD_REF_CLASS varchar2 FK→CRD001_GUI; N_QTY int; PK composta (C_PG_REF_CLASS,C_CRD_REF_CLASS) | 30 |
| DCK002_STARTERS_CH | C_PG_REF_CLASS varchar2 PK; T_BASIC_REF_CLASS, T_CH_BOUND_1_REF_CLASS, T_CH_BOUND_2_REF_CLASS, T_LAST_RESORT_REF_CLASS varchar2 | 2 |

**V:** T_GUI_DESCRIPTION e T_HTML sono dichiarate `int` ma contengono testo nelle righe lette. Il mapping Java usa String. È una peculiarità dello schema SQLite attuale, da preservare nella ricostruzione e non da tradurre automaticamente in un nuovo DDL.

**V:** `integrity_check` restituisce `ok`; `foreign_key_check` nessuna riga. Questo non prova che ogni relazione logica sia protetta: DCK002 non dichiara foreign key, e il personaggio di DCK001 non ha una FK nel DDL osservato. Non è stato verificato `foreign_keys` sulla connessione applicativa.

Mapping: [CardsGuiRecord](../server/src/main/java/com/gsc/bm/repo/internal/CardsGuiRecord.java), [CardKeywordsRecord](../server/src/main/java/com/gsc/bm/repo/internal/CardKeywordsRecord.java), [CharactersGuiRecord](../server/src/main/java/com/gsc/bm/repo/internal/CharactersGuiRecord.java), [StarterDeckRecord](../server/src/main/java/com/gsc/bm/repo/internal/StarterDeckRecord.java), [StarterDeckBasicCardsRecord](../server/src/main/java/com/gsc/bm/repo/internal/StarterDeckBasicCardsRecord.java).

### Contenuti e coerenza

**V:** i due starter sommano ciascuno 20 carte regolari. Le assegnazioni speciali sono:

| Personaggio | Basic | Bound 1 / 2 | Last resort |
|---|---|---|---|
| bruiser.character.BigBadBruiser | com.basic.BruiserGrab | bruiser.character.LittleSmack / LittleRage | com.last.Struggle |
| junkie.character.ToxicJunkie | com.basic.ToxicGrab | junkie.character.RottenSmile / PatheticBlade | com.last.Struggle |

**V:** le 37 classi carta e le due classi personaggio del catalogo hanno un file Java corrispondente. Ogni `T_GUI_IMAGE`/`T_GUI_SPRITE` non nullo delle carte punta a un file presente negli asset client. I valori null e le molte immagini `no-img.png` restano tali: la presenza del catalogo non dimostra una copertura grafica completa. Il token BrokenBeerBottle è creato dal codice; SoberUp è fuori catalogo.

## PostgreSQL: mapping atteso, non schema verificato

| Tabella da annotazione | Campi Java → colonne | Identità dichiarata |
|---|---|---|
| USR001_CREDENTIALS | username→C_USERNAME; email→T_EMAIL; saltedHash→T_SALTED_HASH; role→T_ROLE | username `@Id` |
| USR002_DECKS | username→C_USERNAME; deckId→C_DECK_ID; deck→J_DECK | **solo username è annotato `@Id`**, pur essendoci `@IdClass(UserDeckRecordKey.class)` con username e deckId |
| LOG001_GAMES | gameId→C_GAME_ID; players→T_PLAYERS; type→T_TYPE; date→T_DATE; status→T_STATUS; fullLog→J_FULL_LOG | gameId `@Id` |
| LOG002_WEB_CLIENT | timestamp→C_TIMESTAMP; additional→T_ADDITIONAL; message→T_MESSAGE | timestamp `@Id` |

Fonti: [UserCredentialsRecord](../server/src/main/java/com/gsc/bm/repo/external/UserCredentialsRecord.java), [UserDecksRecord](../server/src/main/java/com/gsc/bm/repo/external/UserDecksRecord.java), [UserDeckRecordKey](../server/src/main/java/com/gsc/bm/repo/external/UserDeckRecordKey.java), [GameLogRecord](../server/src/main/java/com/gsc/bm/repo/external/GameLogRecord.java), [WebClientLogRecord](../server/src/main/java/com/gsc/bm/repo/external/WebClientLogRecord.java).

**V:** J_DECK e J_FULL_LOG usano `@Type(type="jsonb")`, ma `columnDefinition="json"`. **M:** tipo fisico, compatibilità e serializzazione effettivi non verificati. Non risultano vincoli SQL di unicità email, foreign key account→mazzo o indici nel materiale disponibile; l'assenza nel codice non dimostra l'assenza nel database esterno.

**D:** la discordanza dell'IdClass dei mazzi può bloccare l'entity manager o compromettere l'identità dei record. Non si può documentare una PK composta correttamente funzionante senza DDL e prova di bootstrap. È uno dei primi controlli di avvio da completare.

### Contenuto JSON del mazzo

`UserStoredDeck` contiene `characterClazz`, `basicActionCardClazz`, `lastResortCardClazz`, `characterBoundCardsClazz[]`, `regularCardsClazz[]`. Non contiene le statistiche del personaggio o gli effetti delle carte: vengono ricostruiti dalle classi e dal catalogo. [UserAccountServiceImpl.fromGuiToStoredDeck/fromStoredToGuiDeck](../server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java).

**D:** rinominare una classe o cambiare il catalogo può rendere illeggibile un mazzo esistente o cambiarne il significato, perché i binding sono riferimenti al codice e non identificatori di contenuto versionati.

## Scritture e stato non persistito

**V:** registrazione salva hash BCrypt, email e ruolo USER. I mazzi sono salvati e cancellati tramite repository su richiesta STOMP. La collezione non ha tabella: viene calcolata per tutti dal catalogo. [AuthServiceImpl.completeRegistration](../server/src/main/java/com/gsc/bm/service/session/AuthServiceImpl.java), [UserAccountServiceImpl](../server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java).

**V:** `GameLoggingServiceImpl` mantiene una lista di ActionLog in memoria, la accoda per salvataggio su un executor singolo quando `log.db=Y`, e salva ENDED quando la sessione viene svuotata. I log comprendono snapshot con mani e mazzi completi, non solo dati pubblici. Il tempo è una stringa locale del server. [GameLoggingServiceImpl](../server/src/main/java/com/gsc/bm/service/session/GameLoggingServiceImpl.java), [ViewExtractorServiceImpl.extractGlobalSlimView](../server/src/main/java/com/gsc/bm/service/view/ViewExtractorServiceImpl.java).

**V:** sessioni attive, mosse pendenti, code, presenza e codici di verifica email non vengono ripristinati dal DB nel codice esaminato. Il log è osservabilità, non un salvataggio riprendibile. Non risultano backup, retention o procedure di migrazione.

**M:** servono DDL reale, versione PostgreSQL, vincoli/indici, dati di bootstrap, strategia backup e significato operativo dei log prima di poter fornire un avvio database riproducibile.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale](../game-rules.md) (1.0 a quella data, ora 1.6) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](../rules-conformance.md).

# I01 — Toolchain e build riproducibile

**Aggiornamento successivo I02:** il report sotto è storico. Sono ora disponibili 8 unit test server e 4 client superati; contesto applicativo separato e ancora fallito per DB non configurato. [Report più recente I02](i02-report.md).

23 ottobre 2026. Incremento limitato a toolchain, installazione, artefatti e smoke: nessuna modifica alle regole, al motore, alla persistenza o alle schermate applicative. Esiti applicativi e partita completa restano fuori dalla prova di compilazione.

**Esito I01:** completata la baseline di build e smoke degli artefatti, ripetuta dopo reinstallazione pulita da cache offline. Il test applicativo esistente è stato avviato e il suo errore resta aperto, non mascherato. La suite client assente e l'isolamento del contesto sono lavoro I02/I03, non dichiarati completati.

## Decisione tecnica

| Opzione | Vantaggio | Costo/rischio | Decisione I01 |
|---|---|---|---|
| Riprodurre Java 11/Spring Boot 2.4.3 e Angular 11 | Isola i difetti del progetto senza introdurre migrazioni; conserva motore e UI debug | Dipendenze/runtime storici, adatti solo a questa baseline locale di recupero | Scelta per I01 |
| Aggiornare subito Spring/Angular alle major attuali | Possibile base mantenuta per lo sviluppo futuro | Migrazioni Security/JPA e librerie UI, maggiore superficie di regressione prima di avere test | Incremento successivo separato, dopo harness e caratterizzazione |
| Sostituire backend e/o client | Libertà concessa da Q01 | Riscrivere contratti, UI e parte degli adattatori prima di conoscere il comportamento | Nessuna convenienza dimostrata per I01; non scelto |

Non è una decisione definitiva di prodotto o hosting. Il debug resta il client corrente; la build legacy include anche Phaser senza completarne le funzionalità. Nessuna scelta di PostgreSQL per il futuro: rimane a I03.

Compatibilità verificata sulla [tabella ufficiale Angular](https://angular.dev/reference/versions): Angular 11.2 ammette Node ^12.11 e TypeScript >=4.0 <4.2. L'aggiornamento attraversa più major e viene separato dalla ricostruzione della baseline; [politica ufficiale Angular](https://angular.dev/reference/releases). Nessuna attestazione di supporto attuale o sicurezza delle dipendenze storiche e nessuna pubblicazione di questo stack.

## Versioni fissate

| Strumento | Versione |
|---|---|
| JDK | Azul Zulu 11.0.29+7, distribuzione 11.84.17, Windows x64 |
| Maven | 3.6.3, stessa versione del wrapper originale |
| Node | 12.22.12 Windows x64 |
| npm | 6.14.16, incluso nella distribuzione Node |
| Server | Parent Boot 2.4.3 e dipendenze del POM invariati |
| Client | package-lock v1 invariato, Angular core/CLI 11.2.1, TS 4.1.5 e versioni risolte originali |

[toolchain.json](../../scripts/toolchain.json) fissa URL e checksum degli archivi. JDK: SHA-256 pubblicato nei [metadati Azul](https://api.azul.com/metadata/v1/zulu/packages/e9a2f109-c990-421e-8bd8-b9fdcb443fab). Node: SHA-256 dalla [lista ufficiale Node 12.22.12](https://nodejs.org/dist/v12.22.12/SHASUMS256.txt). Maven: SHA-1 pubblicato su Maven Central per l'archivio; non è stato presentato come SHA-256. Tutti gli archivi vengono scaricati su HTTPS e confrontati prima dell'estrazione. Il bootstrap non cerca versioni latest.

## File e strumenti introdotti

- [bootstrap.py](../../scripts/bootstrap.py): scarica/verifica/estrae gli strumenti sotto `.tools`; richiede Python >=3.9 e Windows x64 per questi pacchetti. Non cambia configurazioni globali.
- [build.ps1](../../scripts/build.ps1): task Install/Server/Client/TestServer/All, flag Offline; seleziona strumenti dal manifest e ripristina PATH/JAVA_HOME/analytics al termine. Usa cache Maven/npm nel workspace e configurazioni senza credenziali. Fallisce se cambia il lockfile npm.
- [maven-settings.xml](../../scripts/maven-settings.xml) e [npmrc](../../scripts/npmrc): repository pubblici, nessuna credenziale utente o servizio condiviso.
- [smoke.cjs](../../scripts/smoke.cjs): serve soltanto il dist con Express su loopback e porta effimera, confronta byte HTTP di index/bundle/CSS/regolamento, poi chiude. Non carica il proxy Heroku, non avvia Spring e non certifica il bootstrap Angular nel browser.
- Client: engines Node/npm esatti in package.json, `.nvmrc` e `.node-version`. Manifest delle dipendenze non cambiato; package-lock intatto. Nessun sorgente applicativo modificato.

Script e documenti comuni sono in `E:/bm`, fuori dalle due repository Git annidate, come i deliverable precedenti. Vanno conservati insieme alle due checkout per riprodurre questa procedura; non risultano inclusi automaticamente in un commit delle singole repository. `.tools` e `.build-logs` sono output/cache esclusi dal `.gitignore` della directory comune.

## Comandi

Da `E:/bm`, PowerShell e Python disponibili:

```powershell
python scripts/bootstrap.py
./scripts/build.ps1 -Task All
./scripts/build.ps1 -Task All -Offline
./.tools/node-v12.22.12-win-x64/node.exe scripts/smoke.cjs
./scripts/build.ps1 -Task TestServer
```

Il primo bootstrap e i primi download richiedono accesso di rete. In questa sessione sono stati eseguiti con il permesso di rete aggiuntivo: l'errore WinError 10013 precedente non era un difetto del progetto. `Offline` richiede cache già popolata; non garantisce la disponibilità di plugin mai scaricati.

`All` installa il lockfile con npm ci, fa clean package server con **test saltati esplicitamente** e build AOT di produzione client. Non è un comando di validazione end-to-end. TestServer esegue il vero test esistente e ne propaga il fallimento. Non usare credenziali reali per il test di contesto: la prova qui è stata avviata rimuovendo dal solo processo le variabili SPRING_/JDBC_/MAIL_/HTTP_AUTH_/STOMP_/LOG_ e gli override JVM.

## Risultati osservati

| Prova | Risultato |
|---|---|
| Accesso pubblico Maven/npm/Node | HTTP 200 con permesso di rete aggiuntivo |
| Metadati Adoptium | HTTP 403; ripiego sui metadati pubblici Azul, nessun vincolo nuovo al progetto |
| Maven checksum .sha512 su Central | HTTP 404; usato il checksum .sha1 pubblicato per quell'archivio |
| Bootstrap | Tre archivi verificati ed estratti localmente |
| npm ci iniziale | Successo, 1576 pacchetti; nessuna modifica lockfile |
| Maven package iniziale | BUILD SUCCESS; 138 sorgenti e 1 sorgente test compilati; test saltati |
| Prima rebuild offline | Plugin maven-clean-plugin non ancora in cache; bloccata prima di clean |
| Clean package dopo download plugin | BUILD SUCCESS, JAR eseguibile prodotto |
| Angular build AOT produzione | Successo; bundle iniziale 2,21 MB, warning soglia 2 MB, nessun superamento soglia errore 5 MB |
| Contenuto JAR | Entry point, classe Game e SQLite inclusi; SQLite nel JAR byte-identico al file sorgente |
| `build.ps1 -Task All -Offline` | Successo: npm ci reinstalla node_modules dalla cache, Maven clean package ricompila, Angular AOT ricostruisce il dist; lockfile invariato e stesso hash bundle Angular `4cb132645a4b5784fe9d` |
| Smoke HTTP locale | 6 risorse verificate byte per byte con HTTP 200: index, CSS, runtime, polyfills, main e regolamento; listener chiuso al termine |
| JUnit contextLoads | Runner realmente avviato: 1 test, 0 failure di asserzione, **1 errore**, 0 skipped; contesto non caricato |

Errore di `contextLoads`: `externalDbEntityManagerFactory → dataSourceExternalDB → NullPointerException`, perché manca `spring.datasource.external.driver-class-name` richiesto da `Objects.requireNonNull` in [ExternalDbConfig.dataSource](../../server/src/main/java/com/gsc/bm/conf/db/ExternalDbConfig.java). Non è errore di compilazione, né una regola di gioco fallita: il test dipende dalla configurazione DB applicativa e non ha un profilo isolato. Non è stato corretto o disabilitato per ottenere un verde artificiale; isolamento del test e bootstrap persistente spettano a I02/I03.

Log locali: `.build-logs/server-package.log`, `server-rebuild.log`, `client-install.log`, `client-build.log`, `server-test.log`, `clean-offline-build.log`. I log grezzi sono diagnostica generata; questo documento conserva gli esiti necessari anche fuori dalla macchina. La build clean può sostituire target/surefire-reports: la prova JUnit resta registrata in server-test.log.

Lockfile SHA-256 rilevato: `f76f9a2af5706b61be42ef7e8ec06d119af82c6681035b7225f7788322866944`. La ripetibilità richiesta riguarda risoluzione dal lockfile, toolchain e produzione degli artefatti: non è attestata identità bit per bit dei JAR, che possono includere timestamp.

Dopo la rebuild pulita: JAR 51.996.417 byte, SHA-256 `a5eb342a103b6502971df54f9088267e4fde51d9f048d219d41f12e0ac3fb5a5`; index 607 byte, SHA-256 `88f5fb0c7df225f83bfd46692f19b6a088d2309f1ebe2bcd10b4bb4d8b10c1bc`. Manifest generato in `.build-logs/artifacts.json`, smoke in `artifact-smoke.log`. Ricontrollati JAR/catalogo e assenza di modifiche ai sorgenti server e al lockfile dopo la rebuild.

## Limiti e seguito

Nessuna partita provata, nessuna migrazione, nessun invio SMTP, nessun servizio condiviso modificato, nessun deploy. Nessuna suite client automatica aggiunta: resta I02. Smoke HTTP statico non verifica injection DatePipe, login o rendering Angular: resta I04. Il JAR prodotto non certifica avvio dei datasource: resta I03.

L'aggiornamento dello stack a versioni mantenute va pianificato separatamente dalla baseline locale di recupero, con regressioni del motore e dei contratti; non considerare questo incremento un candidato per esposizione pubblica.

# I19b — Archivio delle quattro modalità e preparazione I24

26 ottobre 2026. **Completato nel perimetro richiesto I19b.** Perimetro I19b/F27 dopo I17a/b. Regolamento **1.5 invariato**; nessuna modifica a carte, catalogo, copia client o regole di esito. [Contratto aggiornato](../match-archive.md), [roadmap](../roadmap.md).

## Stato reale e prerequisiti

Letti AGENTS.md, regolamento, decisioni aggiornate e roadmap; unico AGENTS nel workspace. I19a aveva già LOG003 append-only ed export JSON 1; I14/I23 avevano aggiunto gli eventi locali e I16/I17 le quattro modalità. Mancavano registro persistente e recupero scritture: il primo guasto fermava definitivamente gli append del recorder. I17a/b, I13/I16, I14/I23 e CLI I26 sono presenti; le rispettive suite applicative sono state rieseguite nel contesto Spring separato.

E:/bm e i contenitori annidati non restituiscono uno stato Git valido in questa sessione. Nessun reset/checkout o pulizia eseguiti. Copie dei file preesistenti interessati in `.build-logs/i19b-before`; modifiche circoscritte sopra lo stato ricevuto. Prove esclusivamente su SQLite/file temporanei sintetici, nessun database applicativo reale aperto o migrato.

## Implementazione

- Contratto ed endpoint I19a riusati: schema export 1, stringhe JSON originali, hash e autorizzazione privata invariati. Tutte le quattro modalità registrano indipendentemente da log.db. Leave è FORFEIT con reason=leave; timeout è FORFEIT con termine e mappa dei soli scaduti; drop/rientro sono DISCONNECTED/RECONNECTED. Dopo OUTCOME non si aggiungono eventi di cleanup o duplicati.
- V003 aggiunge LOG004_MATCH_REGISTRY, preservando V001/V002. Registrazione INITIAL, append del suffisso e finalizzazione OUTCOME sono atomici nella stessa transazione IMMEDIATE. Attivi elencabili senza runtime; esito terminale unico, metadata/finalizzazione protetti da trigger. Retry identici accettati, conflitti rifiutati.
- Batch originali copiati prima di SQLite nella directory sorella `<app.database.path>.match-recovery`: file forzati e rename atomico, nomi SHA-256, immutabilità e verifica alla lettura. Nessuna cancellazione di batch consumati o staging interrotto. Il registro descrive i nuovi match; non si inferisce attività dei vecchi prefissi storici.
- Retry dopo record/export, poller configurabile (app.archive.retry-ms, default 1000) e ricostruzione del solo archivio all'avvio. Gestiti rollback del batch, esito salvato ma risposta persa, copia locale mancante con SQLite più avanti e indisponibilità iniziale. I round non vengono mai rieseguiti o annullati dal recupero. Errori SQL/payload non copiati nei messaggi diagnostici.

## Prove dirette

`MatchArchiveRecoveryTest`: **8 casi**.

| Caso | Atteso e verifica |
|---|---|
| V2→V3 su copia isolata | Originale identico byte per byte, checksum V1/V2 e righe di tutte le cinque tabelle pregresse identici; riapertura e integrity_check; nessun attivo storico inventato. Conservata anche la prova V1→V3 di MatchArchiveTest |
| Errore SQL sulla finalizzazione | OUTCOME inserito nella transazione poi UPDATE registro fallisce: entrambi rollback, INITIAL e attivo rimangono. Nuovi datasource/repository/servizio recuperano dalla copia locale i medesimi byte, un solo OUTCOME e una sola finalizzazione |
| Prima scrittura indisponibile | INITIAL e DISCONNECTED recuperati dopo riavvio dello storage/recorder senza memoria precedente; attivo persistente, export attivo negato, nessun OUTCOME/draw o Game ripristinato |
| Risposta persa e retry concorrenti | Round reale committato: turno 1, HEALTH 85/−5, una notifica. Commit OUTCOME salvato poi errore simulato. Tre servizi/writer ritentano contemporaneamente: nove eventi esatti e immutati, un solo OUTCOME e marker; round/notifica sempre uno |
| Copia locale indisponibile | SQLite conserva il batch; successiva disponibilità della copia locale ricostruisce il prefisso completo. Staging parziale ignorato, file pubblicato alterato rifiutato |
| Entrambi i supporti indisponibili | Esito osservato resta concluso, export esplicitamente incompleto; quando torna prima la copia locale e poi SQLite, riavvio del recorder recupera senza buchi/duplicati |
| SQLite più avanti della copia locale | Riavvio riconcilia il suffisso da SQLite e completa la copia locale; export identico |
| Due esiti diversi concorrenti | Due repository con lo stesso gameId/sequenza e OUTCOME incompatibili: esattamente un successo e un conflitto, due sole righe INITIAL/OUTCOME, marker coerente e nessun attivo residuo |

Conservati i nove casi MatchArchiveTest: immutabilità, gap, batch atomico con guasto SQL a metà, concorrenza di writer e log legacy, corruzione/hash, snapshot/versioni, win/draw, export estraneo negato, prima scrittura fallita ed eventi pending, rollback motore I11 senza eventi parziali. Il vecchio test che richiedeva un solo tentativo è aggiornato alla politica deliberata di retry: non cambia alcun atteso di gioco. I conteggi schema passano da due a tre per V003; nessun atteso del motore aggiornato per accettare regressioni.

## Prove applicative CLI

`ArchiveLifecycleCliTest` / `scripts/cli-archive-lifecycle-test.cjs`: **12 scenari**, tre per modalità. Connessioni REST/SockJS/STOMP autentiche e account distinti; controller, code, sessioni, archivio e SQLite reali. Factory spy fornisce soltanto un match sintetico con ordine/mani noti; clock e guasto append sono controllati dal runner, senza endpoint di bypass. Open con vera costruzione da mazzi salvati e partite naturali delle quattro modalità restano nelle suite pregresse rieseguite.

| Modalità | Leave dopo drop/resume | Timeout | Guasto e recupero |
|---|---:|---:|---:|
| quick1vCom | 11 eventi | 10 eventi | 11 eventi |
| open1vCom | 11 eventi | 10 eventi | 11 eventi |
| quick1v1 | 15 eventi | 14 eventi | 15 eventi |
| quickFFA (3 umani) | 19 eventi | 23 eventi | 19 eventi |

Ogni caso verifica l'intera lista ordinata attesa, non solo quantità e hash: INITIAL, ogni MOVE_ACCEPTED/COMMAND_COMMITTED, ROUND_READY/ENGINE_REPORT/ROUND_COMMITTED, drop/rientro o termini/forfait, LIFECYCLE_COMMITTED e OUTCOME unico. Il primo round Struggle ha −5 a sé e −10 al bersaglio secondo R07: HEALTH 85 per tutti con bersagli espliciti A→B→C→A in FFA. La mossa pending del rientrante resta una sola, senza reinvio. Nei quattro scenari di recupero viene scartata deliberatamente anche la prima risposta resume: la CLI ritenta una sola volta questa lettura idempotente entro il timeout originale; il server registra comunque un solo RECONNECTED. FFA prosegue dopo il primo leave e dopo il timeout del solo A, quindi conclude rispettivamente con superstite o draw dei restanti scaduti; vsCom nessun timeout mossa, soltanto reconnect timeout.

Nei quattro guasti INITIAL è durevole e tutti gli eventi successivi appaiono pending: export WRITE_FAILED/incompleto, stesso round concluso. Rimosso il guasto, il CLI ottiene esattamente le stesse entry (byte JSON e hash), nessun pending e complete=true. Registro già attivo verificato durante la partita; a fine partita marker OUTCOME e hash combaciano. Tutti gli umani esportano lo stesso documento prima/dopo leave duplicato; nuovi datasource/repository/servizio lo rileggono senza runtime, ormai rimosso. Transcript ed export: `.build-logs/i19b-<modalità>-<scenario>.json`; riepilogo indipendente in `.build-logs/i19b-manifest.json`.

Durante l'aggiunta del controllo risorse, tre nuovi casi FFA hanno rilevato che la fixture sceglieva un bersaglio dall'ordine non garantito delle chiavi nella vista: fissato il ciclo esplicito, mantenuto l'atteso R07. Nessuna regola o codice del motore cambiati. La prima esecuzione del contesto è conservata in `.build-logs/i19b-context-initial.log`: tre nuovi casi fallivano per questa fixture e un vecchio caso FFA non riceveva una risposta resume. SUBSCRIBE e SEND possono essere elaborati da worker distinti: la CLI ora recupera una risposta persa ritentando una sola volta il resume idempotente, entro il timeout originale, senza ritentare mosse. Il caso di risposta scartata è verificato esplicitamente nella nuova matrice; valgono gli esiti finali sotto.

La verifica indipendente Python del manifest ricomputa tutti gli hash e confronta le liste attese: **12 match, 169 eventi, zero duplicati e zero eventi attesi mancanti**. Payload JSON degli eventi: 237.202 byte UTF-8; export compatti: 296.448 byte complessivi. Sono misure delle sole fixture, non della capacità di lungo periodo o delle pagine SQLite/WAL; i batch locali aggiungono una seconda copia dei dati e gli staging interrotti non vengono eliminati.

## Comandi finali

| Comando da E:/bm | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | PASS: **245 server + 27 client**, zero failure/error/skipped server; `.build-logs/i19b-test.log` |
| `python scripts/check-rules.py` | PASS: regolamento/copia client e 39 carte più token allineati, SQLite catalogo integro; `.build-logs/i19b-rules.log` |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | PASS separato: **349 server**, zero failure/error/skipped, inclusi 8 nuovi diretti e 12 nuovi CLI; `.build-logs/i19b-context.log` |
| `./scripts/build.ps1 -Task Server -Offline` | PASS: clean/package del JAR con V003 e nuovi componenti; `.build-logs/i19b-package.log` |
| `python scripts/smoke-server.py` | PASS: due avvii del JAR su DB sintetico, HTTP 200, account preservato, schema 1/2/3 e integrity_check ok; `.build-logs/i19b-smoke.log` |

Il contesto completo riesegue anche I13, I16, I17a/b, I14/I23 e I26: partite complete di entrambe le famiglie di personaggio, code/multiplayer/concorrenza, timeout/reconnect e autorizzazione. Non si usano i soli test unitari come evidenza di avvio applicativo. Gli ERROR delle failure injection deliberate nei log non sono fallimenti del runner finale.

Una lettura Python indipendente e in sola lettura del DB sintetico del contesto confronta le dodici registrazioni (modalità, umani, hash iniziale, sequenza/hash terminali) e tutti i 169 record SQLite con le entry esportate dal CLI: **tutti identici**. integrity_check=ok, foreign_key_check senza violazioni. Il solo manifest di analisi, senza credenziali, è in `.build-logs/i19b-registry.json`. Nessun blocco residuo di I19b dopo queste verifiche.

## Limiti espliciti e I24

Nessuna verifica UX nuova: nessuna interfaccia modificata, suite client preservata. Nessuna certificazione esaustiva di combinazioni/capacità o di perdita hardware. Le prove dimostrano assenza di duplicati e dati mancanti rispetto ai manifest attesi nei casi coperti, con rilettura indipendente; gli hash da soli non provano completezza di eventi mai scritti.

Se copia locale e SQLite falliscono insieme, il prefisso non scritto rimane soltanto in memoria finché uno dei due torna disponibile. Un crash prima di qualunque scrittura durevole può perdere quel prefisso; non si rivendica una garanzia impossibile sui dati mai scritti o nella finestra fra commit del motore e pubblicazione del batch. Nessuna retention distruttiva, sampling, segreto, telemetria UI o restore giocabile. File di recupero e SQLite devono essere preservati insieme; la crescita resta proporzionale ai dati registrati, senza limiti/cancellazioni automatiche.

Gli attivi senza esito rimangono nel registro anche dopo riavvio del componente archivio. **Restart→draw, motivo comunicato ai client e manifest definitivo di arresto/crash non sono implementati: restano I24/I19c.** Nessuna approvazione base I22 anticipata.

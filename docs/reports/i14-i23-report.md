# I14 / I23 — Clock, finalizzazione e reconnect

25 ottobre 2026. I14 e I23 implementati e verificati nei rispettivi criteri, con regolamento 1.5 aggiornato prima del codice. Nessuna modifica a effetti, valori, starter, strategia del bot o rating. I17, I19b/c e I24 non sono dichiarati completati.

## Prerequisiti e decisioni

Letti AGENTS.md, regolamento, decisioni aggiornate, roadmap, report e sorgenti effettivi di I13/I19a/I26. Baseline iniziale: 219 test server e 21 client verdi. Le verifiche complete finali rieseguono anche partite I13, storage/export I19a e trasporto/CLI I26: i prerequisiti non sono assunti dai soli report.

Il workspace principale non è una repository Git; le due repository annidate contenevano numerose modifiche preesistenti, preservate senza reset, checkout o commit. Copia dei file iniziali in `.build-logs/i14-i23-before`; differenze della sola attività e hash in `i14-i23-changes.patch` e `i14-i23-manifest.json`. Nessuna configurazione Git globale modificata.

R02/R04 disponibili stabilivano clock mossa continuo durante disconnect, 30 s dalla possibilità di invio dopo il turno precedente, nessun timeout mossa vsCom e forfait individuale per abbandono FFA. Sono stati chiesti soltanto i dettagli ancora mancanti. Il proprietario ha confermato: primo turno dall'avvio quando presentabile; mossa e rientro al termine esatto già tardivi; in FFA forfait simultanei dei soli scaduti, poi conteggio dei superstiti. La formulazione generica precedente «scadenze simultanee producono draw» è quindi precisata: zero superstiti draw, uno vince, almeno due proseguono. Regolamento, copia client, allegato e riferimenti nelle descrizioni SQLite sono allineati a 1.5; attesi numerici delle carte invariati.

## Implementazione

Il servizio partite usa un `Clock` iniettato, termini assoluti e controllo dei termini anche sui comandi. Il controllo periodico serve alle notifiche; la sua cadenza non aggiunge tempo. Le scadenze vengono ordinate per termine e applicate insieme a parità di termine prima di contare i superstiti. Il submit accettato ferma il solo clock mossa del suo autore; il termine successivo nasce al completamento del round. Il clock reconnect resta separato e funziona anche vsCom. Morte e fine partita chiudono i clock ormai inutili.

Il forfait è distinto dalla morte fisica: non azzera HEALTH, esclude dalle azioni e dai superstiti e annulla la sola mossa pendente dell'uscente. Gli altri continuano in FFA. Finalizzazione e OUTCOME sono unici; leave ripetuto, logout e timeout concorrenti non duplicano esiti. La risoluzione eventualmente sbloccata da un forfait mantiene rollback locale del round e pubblicazione dopo commit. I log precedenti non vengono eliminati dal cleanup.

I14 fornisce il coordinamento di clock, finalizzazione, ricevute e cleanup nel servizio, utilizzabile senza reconnect di trasporto. I23 integra il trasporto verso quel servizio: nessuna dipendenza inversa dal nucleo I14 all'autenticazione o al client. Il primo drop apre il termine; login e drop prima del resume effettivo non lo spostano. Il nuovo CONNECT deve sempre rispettare la sessione unica. Un comando mantiene valida l'identità fino alla fine della sua esecuzione; i frame accodati della vecchia connessione sono ricontrollati.

`resume` restituisce la stessa partita e la vista privata, compresa la mossa pendente del solo titolare. Non chiama la factory e non reinvia la mossa. Dopo scadenza restituisce esito o forfait personale FFA, anche se gli altri continuano. Leave/logout confermano la presa visione: non ripropongono il risultato al login seguente, pur conservando l'ultima ricevuta per i leave duplicati. Le ricevute sono soltanto in memoria; il journal persistito resta esportabile.

Leave, logout e uscita dalla coda hanno conferme applicative. La coda evita duplicati umani, rimuove i bot rimasti senza umani e aggiorna gli iscritti dopo le uscite. Il debug mostra termine e avviso, pending e Play disabilitati, perdita della connessione, rientro e risultato tardivo. I callback di una connessione precedente, inclusi ready ed ACK di uscita, non modificano la sessione nuova. Il debug chiude i vecchi dialoghi all'esito e torna all'hub con Continue; non apre un dialogo vuoto di effetti per un timeout senza effetti.

## Prove automatiche

| Prova | Evidenza |
|---|---|
| 16 casi `LifecycleClockTest` | Prima/al/oltre 30 s per mossa e reconnect; primo turno e termine dopo commit; pending ferma solo il proprio clock; FFA prosegue o termina con un superstite; scadenze identiche applicate insieme, termini diversi ordinati anche con controllo tardivo; leave duplicato; leave/logout/timeout concorrenti; morte naturale senza forfait fittizio; forfait FFA disconnesso confermabile mentre gli altri proseguono |
| 7 casi `LifecycleCliTest` | Processi Node e connessioni REST/SockJS/STOMP distinti: drop prima/dopo submit, replay della mossa accettata rifiutato, vecchio Client chiuso, doppio login, clock multiplayer continuo, draw al confine, FFA e superstite, rientro vsCom a 29.999/30.000/30.001 ms, tentativi intermedi senza reset |
| Archivio nei sette casi CLI | Un solo OUTCOME, export complete/OK e uguaglianza con rilettura da repository/servizio indipendenti; nessuna nuova partita durante resume |
| Identità e callback | Frame prima autorizzato rifiutato dopo sostituzione della connessione; callback/ACK vecchi innocui, pending privata ripristinata e nessun nuovo join/submit nel debug |
| Contesa SQLite | Scrittura del log browser fra lettura della testa e append dell'archivio: nessuno dei due log viene perso |

Il clock dei casi CLI è sostituito nel solo runner Spring e coordinato con file del test: nessun endpoint di bypass e nessuna attesa reale di 30 s. I tempi brevi di sincronizzazione del trasporto non determinano i confini di gioco.

Durante la UX è emerso `SQLITE_BUSY_SNAPSHOT` sul rientro: una scrittura concorrente del logger web invalidava la transazione differita dell'archivio. Riprodotto prima della correzione in `MatchArchiveTest.legacyLogWritingBetweenArchiveReadAndAppendLosesNeitherLog` (`.build-logs/i14-i23-contention-before.log`). Le transazioni applicative esplicite di scrittura ora prenotano il writer con IMMEDIATE prima di leggere la testa; la scrittura concorrente attende e poi entrambi i log restano presenti. Non sono introdotti retry, nuove tabelle o migrazioni. Rimangono verdi atomicità, immutabilità, concorrenza, migrazione su copia isolata e guasti post-commit I19a.

## Debug separato e restart

JAR locale, database dedicato `.build-logs/i14-i23-ux.sqlite`, account sintetici devAlice/devBob, due schede con sessioni distinte. Starter e bot realmente casuali, nessuna fixture del motore nella UX.

- VsCom: avviso di assenza timeout mossa, drop e rientro con stesso bot, mano e risorse; abbandono confermato e ritorno hub.
- 1v1: termine originale visibile a entrambi; Alice invia, Play si disabilita e compare pending. Drop e nuovo login conservano la mossa senza risolverla o reinviarla. Bob non invia: alla scadenza originale vince Alice. Anche con Begin ancora aperto, Bob vede soltanto il dialogo finale; Continue riporta direttamente all'hub.
- FFA: Bob entra in coda, vede il proprio iscritto ed esce con conferma; coda e hub si ripristinano.
- VsCom tardivo: drop senza mossa, accesso dopo 30 s, messaggio di rientro tardivo e vittoria dello stesso bot per timeout reconnect; Continue e logout coerenti.
- I due export finali della UX sono complete/OK, rispettivamente 8 e 5 eventi, un solo OUTCOME; salvati in `i14-i23-ux-final-exports.json`. La precedente prova fallita è conservata con tutti gli 8 eventi osservati (4 persistiti e 4 non persistiti) in `i14-i23-ux-failure-export.json`, esplicitamente complete=false. Il prefisso originale non è stato riscritto o presentato come completo.
- CLI contro JAR: creata una quick vsCom attiva, drop, arresto del processo prima della scadenza e restart sullo stesso database. Stesso account: `resume: none`, vecchio runtime negato. `i23-restart-fixture.json` e `i23-no-restore-result.json`. Nessun restore; questa prova non certifica restart-draw, che resta I24. Il journal incompleto dell'attivo rimane conservato.

Screenshot in `.build-logs`: `i23-ux-pending-restored-final.png`, `i14-ux-timeout-final.png`, `i14-ux-hub-final.png`, `i23-ux-late-final.png`; log `i14-i23-ux-accepted-server.log` e `i23-restart-server.log`. I processi temporanei e le schede di prova sono stati chiusi senza eliminare dati o evidenze.

## Verifiche e confini

Comandi obbligatori eseguiti separatamente:

- `./scripts/build.ps1 -Task Test -Offline`: **237 server + 25 client PASS**, zero failure/error/skipped server; `.build-logs/i14-i23-test-final.log`.
- `python scripts/check-rules.py`: **PASS**, copie/versione/catalogo/starter e integrità SQLite; `i14-i23-rules-final.log`.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **306 server PASS**, zero failure/error/skipped, inclusi I13/I19a/I26 e i sette nuovi casi CLI; `i14-i23-context-final.log`.

Build JAR offline senza clean e compilazione dev Angular riuscite; hash e differenze nel manifest locale. Le modifiche finali di controllo dei callback e chiusura dei clock degli eliminati hanno ulteriori casi diretti; non modificano il percorso UX sopra verificato.

Nessun blocco funzionale residuo nei criteri I14/I23. Il recupero delle scritture dopo guasti, il registro persistente degli attivi e il consolidamento I19b restano separati; I24/I19c devono ancora registrare draw e manifest al restart. Il processo non ricostruisce una partita dai log. I17 resta la certificazione multiplayer completa, non sostituita dai presenti scenari mirati di ciclo di vita. Nessuna approvazione della base I22 implicata.

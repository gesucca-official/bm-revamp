# I19a — Raccolta ed export del percorso quick

24 ottobre 2026. **Completato nel perimetro I19a/F27**; I19b, I13, restart e restore giocabile non avviati. Regolamento vigente **1.3**, meccaniche/carte/bot invariati. [Contratto dei dati](../match-archive.md), [roadmap](../roadmap.md), [CLI](../cli.md).

## Stato effettivo e prerequisiti

Letti AGENTS.md, roadmap, regolamento, decisioni aggiornate in open-questions e persistenza attuale; nessun altro AGENTS nelle directory interessate. I26 e I12 presenti nei sorgenti e nei runner, poi riverificati: restano i test CLI reali REST/SockJS/STOMP, matrice delle 39 carte/token, 87 casi effetti I12 e cinque prove I11 di isolamento/rollback. Nessun atteso di gioco precedente modificato.

Il contenitore E:/bm non è una repository Git; server e web hanno repository annidate con numerose modifiche preesistenti. Stato letto tramite eccezioni safe.directory limitate alle singole invocazioni, senza cambiare configurazione globale. Interventi mirati sopra lo stato presente; nessun reset, checkout o pulizia dei dati. I log di build e le fixture sono isolati; nessun database reale aperto o migrato nelle prove.

Prima di I19a il logger manteneva liste mutabili statiche, accodava save su un executor ignorandone gli errori e sovrascriveva LOG001; ENDED indicava lo svuotamento della sessione, non necessariamente un esito del motore. Lo snapshot iniziale arrivava dopo la pesca e non conservava l'intero ordine mescolato. Nessun nuovo journal/export completo era già disponibile. R05 aggiornata autorizza stato completo, ordine iniziale e versioni, export JSON, nessuna telemetria UI/cancellazione: nessuna decisione di gioco indispensabile mancante.

## Implementazione e accettazione

| Criterio I19a | Risultato ed evidenza |
|---|---|
| Identificazione, modalità, partecipanti e configurazione | INITIAL conserva gameId, mode, ordine partecipanti umani/bot, personaggi, speciali, mazzi, capacità, mano e policy bot; fixture quick1vCom con bot reale |
| Versioni codice/regole/catalogo | Hash dei byte effettivi di classi/JAR, rulesVersion 1.3, hash regole/allegato/catalogo SQLite; nessun commit Git presunto |
| Stato e ordine iniziale | Ordine mescolato pre-pesca immutabile, prossima carta per prima; stato post-preparazione completo. Test verifica il mazzo iniziale anche quando quello runtime è già vuoto |
| Mosse, report, transizioni, esito | MOVE_ACCEPTED, ROUND_READY, ENGINE_REPORT, ROUND_COMMITTED, COMMAND_COMMITTED e OUTCOME; scelte/void e report delle mosse automatiche inclusi |
| Snapshot/eventi immutabili e ordine verificabile | Copie ai confini del motore, JSON immutabile, sequenza e catena SHA-256 per match; repository append-only e trigger SQL anti UPDATE/DELETE |
| Compatibilità | V001 non riscritta; V002 aggiunta dopo verifica dei checksum. Copia sintetica V1 migrata, originale invariato byte per byte e quattro tabelle legacy identiche |
| Persistenza/rilettura/export | Batch atomici, riapertura SQLite, nuovi oggetti repository/servizio leggono senza partita viva; CLI esporta anche dopo leave, prima e dopo cleanup con dati uguali |
| Guasti dopo commit osservabili | Errore strutturato MATCH_ARCHIVE_WRITE_FAILED e export WRITE_FAILED/complete=false; round e notifica restano validi; eventi non persistiti espliciti |
| Niente segreti/UI/cancellazioni/campionamento | Dati espliciti del solo motore, nessuna serializzazione di account/sessioni/callback. Output CLI controllato; nessuna nuova API di cancellazione, sampling o retention |
| Analisi senza admin | Export CLI privato del proprio match concluso; estraneo rifiutato su trasporto reale. Export attivo negato per preservare informazioni nascoste |

Il quick registra sempre in LOG003 anche con log.db=N. I logger legacy delle altre modalità e della telemetria web non vengono estesi né dichiarati corretti da I19a; dati/API LOG001 restano compatibili e separati. Leave di un match incompleto conserva il prefisso e non genera OUTCOME. La raccolta comune copre i tipi quick, ma le accettazioni multiplayer complete non sono anticipate.

Non è cambiato il comportamento di gioco: non serve una revisione normativa e non sono stati modificati regolamento, descrizioni carte SQLite o copia client. Le sole variazioni agli attesi precedenti riguardano la presenza intenzionale della seconda migrazione in ApplicationSchemaTest e nello smoke schema: non un adattamento a regressioni del motore.

## Prove automatiche specifiche

`MatchArchiveTest`: **8 test diretti** per migrazione V1→V2 su copia isolata, checksum e righe legacy, riapertura/integrità SQLite, batch atomico con errore SQL a metà inserimento, gap/duplicato rifiutati, trigger immutabili, alterazione dati rilevata, due writer concorrenti sulla stessa sequenza, ordine pre-pesca, snapshot indipendenti da mutazioni successive, stati/timer/immunità/oggetti, win/draw, rilettura senza sessione, autorizzazione, errore anche sulla prima scrittura e rollback I11 senza eventi parziali. Dopo un round fallito, la mossa già accettata e il prefisso durevole rimangono, poi il tentativo valido produce la transizione attesa.

`MatchArchiveCliTest.cliQuickOutcomeExportAndPostCommitWriteFailure`: **2 casi**, ciascuno con processo Node e trasporto autentico, server Spring su porta casuale e SQLite temporaneo. Il runner installa la fixture tramite factory spy; nessun endpoint di bypass. Umano con 20 regolari sintetiche, bot con sola Struggle e HEALTH iniziale 10. Comando con bersaglio nullo rifiutato senza eventi di transizione, poi Struggle di entrambi. R07/R04: umano HEALTH 85, bot −5, turno 1 e vittoria umana; il bot già programmato agisce anche se muore prima. Questa fixture breve prova l'archivio fino all'esito, non certifica la terminazione di partite naturali o l'accettazione I13.

Percorso sano: esattamente **7 eventi**, catena hash ricomputata nel CLI, report e risorse verificati, export identico dopo leave e da nuovi oggetti storage. Percorso guasto: iniziale persistito, errore controllato sull'append successivo, **1 evento durevole + 6 non persistiti**, stesso esito/risorse/notifica, stato WRITE_FAILED e complete=false. Un secondo account autenticato non riceve l'export. Entrambi i processi terminano con exit 0 entro il limite del runner; i report non contengono password/hash credenziali. Le failure injection sono previste: i relativi ERROR nei log non sono fallimenti del runner.

## Comandi ed esiti finali

| Comando da E:/bm | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | PASS: **218 server + 18 client**, zero failure/error/skipped server; `.build-logs/i19a-test.log` |
| `python scripts/check-rules.py` | PASS: regole/copia client, 39 carte/token, testi/classificazioni/starter e SQLite allineati |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | PASS separato: **277 test**, zero failure/error/skipped; `.build-logs/i19a-context.log` |
| `./scripts/build.ps1 -Task Server -Offline` | PASS: JAR ricostruito da clean; `.build-logs/i19a-package.log` |
| `python scripts/smoke-server.py` | PASS: due avvii del JAR su SQLite sintetico, HTTP 200, account preservato, versioni schema 1/2 e integrity_check ok; `.build-logs/i19a-smoke.log` |

Il controllo del JAR ha individuato e consentito di correggere una gestione incompleta dell'URL annidato BOOT-INF/classes nel calcolo del digest: i test con classi sfuse non l'avrebbero rilevata. Esito finale verificato sul JAR, senza considerare i soli test unitari prova di bootstrap. Durante lo sviluppo corretti inoltre l'atteso schema a due versioni e un'importazione ambigua Timer nella nuova fixture; nessun atteso di gioco alterato.

## Volume e limiti

Esempi interi della fixture, con dati soltanto sintetici: `.build-logs/i19a-export-success.json` e `i19a-export-fault.json`; misure in `.build-logs/i19a-volume.json`. Misurati 2.655 byte INITIAL e 11.950 byte nei sei eventi del round/esito: 14.605 byte di payload, 17.275 byte delle entry e 17.703 byte di export compatto per 7 eventi. I byte sono payload UTF-8 della fixture, non una previsione universale né la dimensione del file SQLite (pagine, indici e WAL aggiungono overhead). Nessun dato è stato campionato. Turni più lunghi, più giocatori e report più grandi aumentano il costo. Memoria e storage crescono con gli eventi; nessuna soglia o cancellazione automatica è stata introdotta.

Nessun criterio I19a ancora aperto dopo le verifiche sopra. **Limiti espliciti:** nessuna nuova prova UX manuale, conservati i 18 test client; nessuna partita naturale completa con entrambi i personaggi o seconda partita nella stessa sessione certificata (I13); nessun retry/outbox durevole, finalizzazione idempotente leave/timeout/reconnect o registro persistente degli attivi (I19b). Se la scrittura fallisce, gli eventi soltanto in memoria possono andare perduti al crash: il prefisso durevole non è dichiarato completo. Restart-draw/motivo visibile/manifest crash restano I24/I19c; nessun nuovo esito al riavvio, restore giocabile o rating. Nessuna approvazione della versione base anticipata.

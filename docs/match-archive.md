# Archivio partite I19a/b e restart I24

Contratto aggiornato il **26 ottobre 2026**, decisioni R05/R06 del proprietario. Regolamento corrente **1.6**, con chiusura restart I24; mosse, casualità, clock e contenuti delle carte invariati. `quick1vCom`, `quick1v1`, `quickFFA` e `open1vCom` condividono recorder, registro persistente e export JSON 1 di I19a. I19b consolida le prove delle quattro modalità, leave/forfait, timeout e reconnect e aggiunge recupero scritture e finalizzazione durevole idempotente. [Report I19b](reports/i19b-report.md).

I24 applica il regolamento **1.6/R06**: l'avvio Spring recupera prima le scritture durevoli I19b e poi finalizza gli attivi del registro in draw con motivo «riavvio server», prima di accettare comandi. Il recupero dell'archivio da solo resta distinto dalla finalizzazione di avvio; non crea `Game` e non riprende mosse. I19c completa la verifica trasversale, documentata sotto.

## Chiusura al riavvio I24

`MatchArchiveService.finalizeInterruptedMatches`, inizializzatore Spring, ritenta i batch recuperati e rifiuta l'avvio se rimangono eventi non persistiti o errori SQLite. Un OUTCOME reale già pubblicato nel journal locale viene quindi recuperato prima di selezionare gli attivi: non viene sostituito dal draw tecnico. Gli attivi provengono esclusivamente da LOG004, senza dedurre attività da log legacy o prefissi storici non registrati.

Per ciascun ID, `MatchEventRepository.finalizeInterrupted` apre una transazione IMMEDIATE, ricontrolla il marker e aggiunge un solo OUTCOME insieme alla finalizzazione del registro. Se già concluso non scrive nulla; commit e marker sono atomici anche fra writer concorrenti. Un crash a metà transazione lascia entrambi assenti; al successivo avvio si completano i restanti attivi. Una chiusura già committata rimane identica byte per byte. Nessuna migrazione aggiuntiva o modifica a V001–V003, dati/hash preesistenti, account, mazzi o log legacy. La copia locale viene riconciliata dopo il commit SQLite; un crash fra commit e copia non richiede un secondo esito.

Il nuovo OUTCOME tecnico ha `data.gameId`, `mode`, `outcomeReason="riavvio server"`, `outcome={over:true,result:"draw",winner:null}` e `interruptedPrefix={sequence,hash}` riferito all'ultima entry conservata. `recordedAt` è il momento della finalizzazione al nuovo avvio, non il momento stimato del crash. Non contiene uno snapshot finale inventato: risorse, mani, pending, clock e report precedenti restano osservazioni immutate nel prefisso. Non vengono eseguiti turni, forfait, factory o callback del motore. I normali OUTCOME conservano la forma già esistente.

Il partecipante autenticato può esportare l'esito per ID anche dopo riavvii ripetuti. `resume`, quando non esiste una ricevuta del processo vivo, consulta l'ultima ammissione dell'account nel registro. Se conclusa per restart restituisce `{status:"finished",gameId,archived:true,outcome:{over:true,result:"draw",winner:null,reason:"riavvio server"}}`, senza `view`. Estranei ricevono `none`; una nuova ammissione supera la vecchia ricevuta. Il debug mostra «Pareggio — riavvio server» e Continue riporta all'hub senza sottoscrizioni o leave sul vecchio runtime. La presa visione è locale: senza una nuova partita la ricevuta può essere consultata di nuovo ai login successivi; nessun flag persistente di lettura o cronologia utente introdotto.

Il draw chiude ciò che è durevole. Rimane il limite I19b: un crash prima che un evento raggiunga SQLite o un batch pubblicato può perdere quell'evento; non si inventano eventi mancanti né si dichiarano conservati dati mai scritti. Corruzione/perdita di entrambi i supporti e più server operativi sullo stesso database non sono un modello di hosting introdotto da I24. Nessun checkpoint giocabile, retention o Elo.

## Contenuto e ordine

Ogni match usa il gameId del motore. La sequenza parte da zero e cresce soltanto per eventi di comandi effettivamente committati; un comando rifiutato o un round ripristinato dal rollback I11 non introduce transizioni nel journal. Le mosse scelte automaticamente, comprese quelle vuote, sono negli snapshot pendingMoves; le prove interne del bot sono nel report del motore. Nessuna policy del bot è modificata, nessun seed inventato: ordine iniziale e scelte effettive sono registrati.

| Evento | Dati e significato |
|---|---|
| INITIAL | Versioni, configurazione e stato dopo la preparazione, prima di qualsiasi comando; conserva anche l'intero ordine regolare **prima della pesca iniziale** |
| MOVE_ACCEPTED | Scelta umana accettata: autore, gameId, carta, bersaglio e choices, prima che counter/report la mutino |
| ROUND_READY | Stato con tutte le mosse, umane/automatiche/vuote, prima di rimuovere le vuote, pagare costi e ordinare |
| ENGINE_REPORT | Tutte le stringhe del report interno drenato al completamento del round |
| ROUND_COMMITTED | Stato dopo effetti, scarto/pesca, fasi periodiche e incremento del turno; resolvedMoves in ordine di risoluzione, con void e report |
| COMMAND_COMMITTED | Stato dopo l'intera catena di risoluzione, incluse eventuali scelte automatiche già pendenti per il turno seguente |
| DISCONNECTED / RECONNECTED | Account e termine assoluto del primo drop / rientro effettivo; il resume non duplica la mossa pending |
| FORFEIT | Leave esplicito: playerId/reason=leave. Scadenza: deadline e mappa players→move timeout/reconnect timeout, in batch per lo stesso termine |
| LIFECYCLE_COMMITTED | Stato dopo forfait, eventuale round dei superstiti e chiusura dei clock; FFA prosegue con almeno due superstiti |
| OUTCOME | Stato finale con over, result=win/draw e winner nullable, deciso dal motore secondo R06 anche dopo forfait; oppure ricevuta tecnica restart I24 descritta sopra, senza snapshot inventato. Unico e terminale |

Per ogni giocatore: ordine d'inserimento, identificativo umano/bot, personaggio/binding, risorse, morte, capacità e oggetti FIFO, mano ordinata, mazzo residuo e ordine iniziale con **prossima pesca per prima**, speciali iniziali e last resort. Sono inclusi immunità, stati nell'ordine di applicazione con nome/descrizione/tipo/flow/proprietà/equip/singleUse/durata, timer con nome e countdown, report periodici e mosse pendenti/risolte. I timer mantengono l'ordine osservato del set: non viene introdotta una precedenza garantita assente in R06. Le funzioni di stati/timer restano identificate dal codice e dalle regole versionati, senza serializzare callback o oggetti eseguibili.

Il recorder serializza dati espliciti in stringhe JSON immutabili. Le strutture mutabili del motore vengono copiate ai confini del round; la successiva risoluzione non modifica gli eventi precedenti. Nessuna credenziale, hash di password, email, sessione autenticata, token o telemetria UI entra nel contratto. L'archivio comprende mani e mazzi completi: non è una vista pubblica di gioco.

## Versioni reali

INITIAL.versions contiene rulesVersion, rulesSha256, rulesCatalogSha256, catalogSha256 e codeSha256/codeFormat. Maven include i documenti canonici dal workspace nelle risorse `analysis/`; il catalogo è l'effettiva risorsa cards.sqlite caricata dall'applicazione. SHA-256 regole usa UTF-8 con CRLF normalizzati LF; catalogo/allegato usano i byte della risorsa. Per le classi sfuse il digest concatena, in ordine di percorso, nome relativo normalizzato `/`, byte NUL e byte di ciascun `.class` sotto `com/gsc/bm`. Per il pacchetto identifica il JAR intero. Non viene usata una revisione Git presunta: il workspace contiene modifiche preesistenti e il solo commit non le identificherebbe.

## Persistenza compatibile

V002 aggiunge LOG003_MATCH_EVENTS e trigger contro UPDATE/DELETE; V001 e dati legacy non vengono riscritti. Le versioni e i checksum installati devono essere un prefisso esatto delle migrazioni note. L’append grezzo di ogni batch usa una transazione SQLite con WAL/FULL e rifiuta sequenze duplicate/non contigue; un guasto a metà batch lascia il prefisso precedente intatto. I19b aggiunge sopra questo append il commit idempotente descritto sotto, che confronta le sovrapposizioni identiche prima di inserire il solo suffisso. La rilettura verifica sequenze e hash prima di restituire i dati. Prova V1→V2 su copia sintetica isolata, con originali byte per byte e righe di tutte e quattro le tabelle legacy preservati.

Il recorder di tutte le quattro modalità è sempre attivo, anche con `log.db=N`; quel flag governa soltanto gli eventuali percorsi legacy. LOG001, le sue API amministrative e i log web rimangono separati. Nessuna cancellazione, retention, campionamento, migrazione di dati storici non gestiti o ricostruzione fittizia di eventi assenti. I vecchi log rimangono leggibili nel formato originale, senza essere presentati come nuovi archivi completi.

## Export JSON 1

CLI: `{"command":"export","gameId":"ID"}`. SEND `/app/archive/{gameId}/export`, risposta privata `/user/queue/archive/{gameId}/export`. Richiede il partecipante umano autenticato e un match concluso; durante il gioco l'export è negato per non esporre informazioni nascoste. Funziona dopo leave e, per i match completi persistiti, senza sessione di gioco in memoria. Nessun pannello admin necessario. [Guida CLI](cli.md).

Documento: schemaVersion=1, gameId, events persistiti, unpersistedEvents, integrity e recording. Ciascuna entry ha sequence, previousHash, hash e **json stringa originale**. L'integrità si verifica senza ricanonizzare il JSON:

```text
hash = SHA-256(UTF-8(gameId + LF + sequence decimale + LF + previousHash + LF + json))
```

previousHash è vuoto per la sequenza zero, poi è l'hash dell'entry precedente. `json` contiene kind, recordedAt UTC e data. L'orologio serve alla diagnostica; l'ordine normativo del journal è sequence. La catena rileva alterazioni e buchi del prefisso letto, non è una firma digitale. `integrity.headHash` è la testa persistita; `recording.complete=true` richiede l'OUTCOME persistito in SQLite e nessun evento ancora da persistere o errore SQLite irrisolto. La copia locale può ritentare un batch mancante anche quando SQLite è già completo. Le stringhe json si analizzano separatamente, senza perdere l'originale necessario al controllo degli hash.

## Registro persistente e finalizzazione I19b

V003 aggiunge `LOG004_MATCH_REGISTRY`: gameId, modalità, array degli account umani, hash INITIAL, sequenza/hash OUTCOME nullable. Non modifica V001/V002, righe o hash esistenti. Non deduce attivi da prefissi storici: il registro descrive i match registrati dal nuovo writer, non inventa lo stato di vecchi processi. Un vecchio export completo rimane leggibile senza registrazione retroattiva.

`MatchEventRepository.commit` verifica il prefisso e accetta ripetizioni soltanto con gli stessi byte/hash/sequenze. Differenze o gap falliscono. Nella stessa transazione IMMEDIATE inserisce il suffisso, registra INITIAL e, quando presente, fissa l'unico OUTCOME. Il passaggio attivo→finalizzato è permanente: trigger vietano cancellazione, modifica di identità o finalizzazione e append successivi. Due writer dello stesso esito possono riuscire entrambi senza duplicarlo; due finalizzazioni incompatibili producono una sola vincente. Il metodo `activeMatchIds()` espone il manifest durevole necessario a I24, senza caricare partite.

## Guasti e recupero I19b

Il round termina prima della persistenza: un errore successivo non annulla stato, esito o notifica e il recupero non riesegue il motore. Ogni batch JSON immutabile viene prima copiato nella directory locale `<app.database.path>.match-recovery`, accanto a SQLite. Il file è forzato su disco e pubblicato con rename atomico; il nome è SHA-256 dei byte dell'involucro. Include soltanto gameId ed entry del contratto I19a, senza account autenticati, segreti o dati UI. File finali immutabili e staging interrotti sono conservati, senza retention o cancellazioni automatiche. Lo staging `.tmp` non equivale a un batch pubblicato.

La scrittura SQLite resta transazionale WAL/FULL. Se fallisce, il recorder conserva il batch e i successivi, espone `WRITE_FAILED/complete=false` e ritenta il suffisso originale al prossimo record/export e dal poller (`app.archive.retry-ms`, default 1000 ms). Il fallimento non sposta i clock. La diagnostica strutturata `MATCH_ARCHIVE_WRITE_FAILED` riporta solo gameId, sequenza, conteggi e classe di errore, senza messaggi SQL/payload. Un commit riuscito ma con risposta persa viene riconosciuto al retry senza duplicati. A recupero concluso: `MATCH_ARCHIVE_RECOVERED`, nessun pending, `OK`, failureAt nullo ed export identico alla rilettura indipendente.

All'avvio il servizio legge i file pubblicati, verifica nomi/hash, contiguità e sovrapposizioni identiche e ritenta gli append. Se SQLite è più avanti della copia locale, integra il prefisso da SQLite e ritenta anche la copia locale mancante. Un file pubblicato alterato/conflittuale impedisce l'avvio dell'archivio: non viene saltato per presentare dati apparentemente completi. Questo recupero registra soltanto eventi già osservati; l'inizializzatore I24 descritto sopra genera poi l'OUTCOME tecnico degli attivi rimasti. La directory e SQLite appartengono allo stesso archivio e vanno preservati insieme nelle copie di sicurezza.

Un guasto della copia locale non impedisce di salvare in SQLite; un guasto SQLite può essere recuperato dalla copia locale anche con nuovi oggetti storage/servizio e senza memoria del match. Se **entrambi** i supporti falliscono, rimane soltanto la coda in memoria, `complete=false`, e i retry proseguono: un crash prima della prima scrittura durevole può perdere quegli eventi. Non si dichiara durabilità di dati mai scritti né copertura di perdita hardware/corruzione di entrambi i supporti o dell'intervallo fra commit del motore e pubblicazione del batch. Gli hash rilevano alterazioni/buchi del prefisso; non provano da soli che il processo abbia osservato ogni evento prima del crash. La chiusura tecnica e la ricevuta di riavvio sono aggiunte da I24 sopra.

## Verifica trasversale I19c

`python scripts/verify-match-manifests.py` deriva `.build-logs/i19c-manifest.json` dai transcript/export conservati e confronta le entry esportate con le righe SQLite per ogni caso I19b e I24. Verifica catene, ordine, buchi/duplicati, schema/versioni, stato iniziale, report/transizioni/esiti, registro V003, integrità SQLite, ripetizioni dopo restart e assenza di campi segreti. Include conclusioni ordinarie in tutte le modalità e tutti i casi I19b/I24; dettaglio, anomalia del manifest storico, risultato e limiti in [report I19c](reports/i19c-report.md). I19c è completato; nessuna funzionalità di replay/restore/analisi aggiunta.

Dimensioni e misure della fixture sono nel [report I19a](reports/i19a-report.md). Lo spazio cresce linearmente con eventi e dimensione degli snapshot, senza limiti arbitrari. Il processo conserva anche gli eventi già persistiti per il journal corrente: memoria e storage crescono con le partite e i turni. Export manuale non elimina nulla. I19a non certifica capacità di lungo periodo né introduce manutenzione distruttiva; verificare lo spazio disponibile e conservare i file esportati secondo le esigenze locali. Nessuna nuova soglia di gioco.

I16 verifica due mazzi salvati diversi fino a esito ed export, con catena hash e rilettura indipendente dopo leave. Le configurazioni runtime sono copie di un singolo record letto per proprietario/ID: modificare o cancellare quel record non modifica la partita avviata. [Prove I16](reports/i16-report.md). Nessuna finalizzazione o motore alternativo.

## Evidenza storica I14/I23 — 25 ottobre 2026 (recupero ora esteso da I19b)

Il journal esistente conserva anche `DISCONNECTED`, `RECONNECTED`, `FORFEIT`, `LIFECYCLE_COMMITTED` ed esito unico per i percorsi quick e open1vCom già registrati. FORFEIT conserva motivo, partecipanti e termine per il batch simultaneo; gli snapshot aggiungono forfait e termini dei due clock. Le mosse accettate prima del drop restano nel journal e nel motore: resume non genera un secondo MOVE_ACCEPTED. Nessuna nuova tabella, modifica dei vecchi eventi, cancellazione o telemetria UI.

La finalizzazione locale è idempotente; dopo l'OUTCOME non si aggiungono eventi di leave che cambino un export già concluso. La rimozione del match dalla memoria non cancella il journal; l'esito dei sette scenari CLI è riletto da un nuovo servizio/repository. La gestione dei guasti post-commit resta quella descritta sopra: I14/I23 non implementano retry/outbox, registro persistente degli attivi, restart-draw o manifest di crash. Questi restano I19b/I24/I19c. Le ricevute di rientro appartengono soltanto al processo vivo e non sono checkpoint ripristinabili.

Contesa verificata I14/I23: le transazioni applicative esplicite di scrittura prenotano il writer con IMMEDIATE prima della lettura della testa del journal. Una scrittura concorrente del log web attende anziché causare l'upgrade fallito SQLITE_BUSY_SNAPSHOT. La prova riprodotta prima della correzione e poi verde conserva entrambi i log. Questa prevenzione non è recupero/retry di registrazioni già fallite: le limitazioni I19b sopra restano valide.

## Verifica applicativa quick 1v1 — I17a, 25 ottobre 2026

Con regolamento 1.5 invariato, dieci scenari CLI reali verificano 21 partite `quick1v1` con due controller umani distinti ciascuna: esiti naturali e forfait, timeout/reconnect e due match concorrenti. Export esistente identico per i due partecipanti, catena hash, un solo OUTCOME e nessuna contaminazione di playerId/gameId; nuovo servizio/repository rilegge lo stesso JSON dopo cleanup del runtime. Negati export attivo ed estraneo. L'accettazione browser aggiunge tre match reali Alice/Bob in due contesti Edge isolati: 11/7/8 eventi, rispettivamente round seguito da timeout simultaneo/draw, timeout del solo Bob durante il drop di Alice, drop/resume di Bob con pending e successivo leave. Un solo MOVE_ACCEPTED nel match di resume, nessun nuovo INITIAL e un solo OUTCOME; export CLI completi/OK uguali per entrambi dopo logout, tutti i byte JSON e gli hash identici alla rilettura SQLite indipendente. Nessun nuovo schema, formato, endpoint o recupero guasti. Transcript, screenshot ed export conservati senza cancellazioni. [Casi, attesi ed evidenze UX](reports/i17a-report.md); **I17a completato**; I17b completato successivamente: [report I17b](reports/i17b-report.md).

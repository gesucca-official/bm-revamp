> I13: `QuickCompleteCliTest` esegue `scripts/cli-quick-complete-test.cjs` su Spring con SQLite temporaneo. Due processi CLI, uno per personaggio umano, completano ciascuno vittoria e pareggio nella stessa connessione; verificano tutti i turni, rifiuto dopo over ed export integrale anche dopo leave. Inclusi in `./scripts/build.ps1 -Task TestServerContext -Offline`. Il limite 40 turni fallisce per stallo senza assegnare un esito. [Report I13](reports/i13-report.md).

# CLI locale

Avviare il server come descritto in setup.md. Non occorre il browser.

```powershell
$env:BM_USER = 'devAlice'
$env:BM_PASSWORD = 'local-alice'
$env:BM_URL = 'http://localhost:8080/api'
& ./.tools/node-v12.22.12-win-x64/node.exe scripts/bm-cli.cjs scenario.jsonl
```

Senza filename legge righe JSON da stdin, anche da terminale. Non inserire password nei file di scenario. Output stdout JSONL: `connected`, `event` (destination/data), `result` (command/result). Diagnostica stderr senza credenziali; exit 0 successo, 1 input/login/trasporto/timeout fallito. EOF o `logout` chiudono la connessione; ogni richiesta/attesa ha limite predefinito 10 s. I comandi `send` e `move` confermano il solo invio: aspettare l'evento del server per verificarne l'esito.

Esempio account/catalogo (la collection è inclusa nel profilo):

```json
{"command":"profile"}
{"command":"join","mode":"quick/1vCom"}
{"command":"wait","destination":"/user/queue/game/quick/1vCom/ready"}
```

Il ready contiene il gameId. In sessione interattiva proseguire con `watch` e `view` indicando quel gameId. Uno scenario automatico può importare `Client` da scripts/bm-cli.cjs, usare connect/command/close e leggere il ready per costruire i comandi successivi. Asserzioni nel runner, nessun motore duplicato.

Quick 1v1 (I17a): ciascuno dei due account distinti invia `join` con `mode=quick/1v1` e attende **`/user/queue/game/quick/1v1/ready`**. Il ready è privato ai due partecipanti; il precedente topic condiviso non è più autorizzato. Il Client CLI e il debug usano il nuovo canale. Un join duplicato non occupa un altro posto. Non usare un solo account per certificare questa modalità.

Comandi JSON:

- `profile`; `save`/`delete` con `deck` nel formato UserGuiDeck esistente.
- `join` con `mode`: quick/1vCom, quick/1v1, quick/ffa, open/1vCom (anche deckId).
- `start`, `add-bot` per FFA; `watch`, `view`, `leave` con gameId.
- `export` con gameId: JSON completo del proprio match quick concluso, anche dopo leave. Eventi persistiti e non persistiti sono distinti; controllare `recording.complete`.
- `move` con move nel contratto server: gameId, playerId, playedCardName, targetId, choices se richieste (DISCARD_ONE e TARGET_ITEM).
- `subscribe` con destination; `send` con destination/data per scenari negativi sul contratto reale.
- `wait` con destination e opzionalmente timeout in ms e after (indice eventi, default 0). Le attese possono leggere eventi già ricevuti: usare after per richiedere un evento nuovo.
- `logout` chiude; non equivale a un nuovo esito di gioco.

Processi distinti usano variabili d'ambiente distinte per account. Il server mantiene la sessione unica. Nessun reconnect o timer di gioco è implementato dal CLI.

Verifica isolata senza servizi permanenti: `./scripts/build.ps1 -Task TestServerContext -Offline`, test `WebSocketIdentityTest.cliAuthenticatesReadsCatalogAndResolvesFixtureRound`. SQLite temporaneo, fixture del motore installata tramite test Spring, connessione CLI reale REST e SockJS/STOMP; nessun endpoint applicativo di bypass.

Per le scelte usare il campo wire `choices`, per esempio:

```json
{"command":"move","move":{"gameId":"ID","playerId":"devAlice","playedCardName":"NOME_CARTA","targetId":"AVVERSARIO","choices":{"DISCARD_ONE":"NOME_SCARTO"}}}
```

Per una carta che richiede un oggetto, `choices.TARGET_ITEM` contiene il nome dell'oggetto secondo il contratto server. Il CLI inoltra le scelte; il server ne valida legalità e bersaglio. `after` è l'indice degli eventi già ricevuti, conservati fino alla chiusura. Un timeout di `wait` è espresso in millisecondi positivi finiti; nel Client importato l'errore può essere recuperato. Nel programma principale termina con exit 1.

Scenari verificati: `WebSocketIdentityTest.cliRejectsDuplicateMoveAndForeignAccess` invoca `scripts/cli-security-test.cjs` per sicurezza, mazzi, quattro modalità, file/stdin, codici e risorse. Le credenziali e i mazzi sono sintetici e risiedono nel database temporaneo del test. Non eseguire questo scenario contro dati reali.

Baseline senza server: `./scripts/measure-cli.ps1 -Samples 5`. Produce JSONL con versioni e byte delle dipendenze risolte dal lock, hash del lock, caricamento del modulo, avvio fino a uscita help e memoria Client non connesso. Nessuna soglia; condizioni e campioni in `i26-report.md` e `i26-baseline.json`.

I12 aggiunge `WebSocketIdentityTest.cliCardChoicesResolveItemsDiscardAndTokenAcrossThreeRounds`, che invoca `scripts/cli-card-choices-test.cjs`: due CLI autentiche, tre round sintetici con scelta oggetto, scarto bound, consumo token, errori recuperabili e viste numeriche secondo R07. Si esegue con `./scripts/build.ps1 -Task TestServerContext -Offline`; fixture e credenziali sono create solo dal runner isolato, senza dati reali. Attesi e limiti nel [report I12](reports/i12-report.md).

I19a aggiunge `{"command":"export","gameId":"ID"}`. Il risultato è in `result.data` e nell'evento privato `data`: stdout resta JSONL, nessuna password nel file. Non è un ripristino della partita. Solo i partecipanti umani possono esportare e soltanto a esito raggiunto; l'export attivo o estraneo è negato e può chiudere il trasporto, come le altre violazioni della policy. Il bot non ha un'identità autenticabile.

Per salvare stdout usare una destinazione nuova, per esempio `... scripts/bm-cli.cjs scenario.jsonl > export-session.jsonl`. Se occorre il solo documento JSON, leggere la riga `type=result, command=export` e salvare il suo `result.data`; l'evento equivalente è già completo. Non concatenare event e result come due partite. Non usare l'export per decidere se una scrittura è riuscita senza controllare `recording.status`, `recording.complete` e `unpersistedEvents`.

Prove I19a: `MatchArchiveCliTest.cliQuickOutcomeExportAndPostCommitWriteFailure` invoca `scripts/cli-match-export-test.cjs` su server reale e SQLite temporaneo, una volta con storage sano e una con errore di scrittura controllato dopo commit. Verifica hash/ordine, esito, report, export dopo leave e accesso estraneo negato. Il comando è `./scripts/build.ps1 -Task TestServerContext -Offline`. Contratto, schema e limiti: [match-archive.md](match-archive.md).

## Open 1vCom (I16)

Dopo `save` e la conferma in `profile`, `{"command":"join","mode":"open/1vCom","deckId":"ID"}` seleziona il mazzo del solo account connesso. Attendere `/user/queue/game/open/1vCom/ready` per il gameId; poi `watch`, `view`, `move`, `export` dopo l'esito e `leave` usano gli stessi comandi della quick. Il runtime usa una copia indipendente del record salvato all'avvio.

Se il mazzo manca (anche quando esiste soltanto per un altro account), arriva `/user/queue/game/open/1vCom/error` con “Deck unavailable. Choose a saved deck from your account and retry.” Nessun ready; la connessione rimane utilizzabile. Il CLI sottoscrive già questo canale: `join` conferma solo l'invio, il runner deve attendere ready oppure controllare l'errore. Il limite di attesa CLI non è un timeout mossa.

Scenario ripetibile `scripts/cli-open-complete-test.cjs`, eseguito da `OpenCompleteCliTest` nel contesto Spring isolato: due salvataggi/selezioni e partite complete, rifiuti, modifica/delete del record durante il match ed export con verifica integrità. [Report I16](reports/i16-report.md).

## Clock, abbandono e rientro (I14/I23, regolamento 1.5)

Estensione **I24, regolamento 1.6**: dopo restart pulito o crash, `resume` può restituire `{status:"finished",gameId,archived:true,outcome:{over:true,result:"draw",winner:null,reason:"riavvio server"}}`. Non contiene `view`: è una ricevuta persistente, non una partita ripresa. Non inviare watch/view/move/leave a quel gameId; usare `export` per l'archivio completo. La ricevuta automatica riguarda l'ultima ammissione dell'account e resta consultabile ai login successivi finché non inizia una nuova partita; gli export per ID restano disponibili. Nessun comando nuovo, restore o Elo.

`RestartCliTest` orchestra JVM server e processi `scripts/cli-restart-test.cjs` con quattro match attivi (una per modalità), una mossa pending 1v1 e un concluso. Arresto pulito, crash, tre avvii successivi e kill nel mezzo della transazione del secondo draw; export per ogni umano, estranei e runtime vecchio negati, confronto byte per byte dei prefissi/conclusi e integrità SQLite. Solo database temporanei isolati, clock congelato e hook nel processo di test; nessun endpoint o flag di guasto nel server distribuito. Comando: `./scripts/build.ps1 -Task TestServerContext -Offline`.

`{"command":"resume"}` richiede la partita esistente dell'account dopo un nuovo login/CONNECT. Leggere `result.data.status` (`none`, `resumed`, `finished`) e `result.data.view`: la mossa pendente del solo titolare è `pendingMove`. Per un match ripreso, usare `watch` sul gameId restituito, poi `view`; non eseguire `join` e non reinviare `pendingMove`. Il server mantiene la sessione unica. Dopo una perdita di rete chiudere la vecchia connessione e creare un nuovo processo/Client con lo stesso account.

`leave` attende ora la conferma privata del server; `{"command":"leave-queue"}` attende l'uscita dalle code. `logout` invia prima il logout applicativo e attende conferma, poi chiude la connessione. EOF, `Client.close()` e `Client.drop()` chiudono il solo trasporto: se il match è attivo aprono la finestra reconnect, anche contro computer. Per abbandonare immediatamente usare `leave` o `logout`.

Il clock mossa multiplayer continua durante disconnect: il rientro entro la finestra reconnect non garantisce che il precedente termine mossa non sia già scaduto. A tempo uguale al termine la mossa e il rientro sono tardivi. Contro computer nessun timeout mossa; resta il forfait dopo 30 s senza rientro. Un rientro tardivo riceve `finished` con l'esito o il proprio forfait FFA; confermarlo con `leave`/`logout`. Un esito già confermato non viene riproposto al login successivo. Non esiste restore giocabile dopo restart.

`LifecycleCliTest` avvia sette scenari di `scripts/cli-lifecycle-test.cjs` tramite connessioni REST/SockJS/STOMP distinte. Il runner Spring controlla il clock con file di coordinamento del solo test: nessun endpoint aggiuntivo o attesa reale di 30 s. Include drop prima/dopo submit, pending privata, duplicato, doppio login, rientri prima/al/oltre il termine anche vsCom, tentativi senza reset, draw/FFA e verifica dell'archivio con un solo OUTCOME e rilettura indipendente. Esecuzione inclusa in `./scripts/build.ps1 -Task TestServerContext -Offline`.

## FFA I17b

`join` con `mode: "quick/ffa"` ascolta il ready privato `/user/queue/game/quick/ffa/ready`; `joined` resta la lista pubblica della coda. `start` avvia da due iscritti, il quinto avvia automaticamente; `add-bot` aggiunge un computer. Ogni partecipante può usare questi comandi: nessun proprietario di lobby. `leave-queue` permette uscita e reinserimento; i bot rimasti senza umani vengono rimossi. Una FFA a due conserva la modalità `quickFFA`.

Prove ripetibili nel contesto separato: `QuickFfaCliTest` usa `scripts/cli-quick-ffa-test.cjs`, sei login/connessioni indipendenti, SQLite temporaneo e clock controllato via file. Nessun endpoint test esposto.

## Verifica I19b delle quattro modalità

`ArchiveLifecycleCliTest` usa `scripts/cli-archive-lifecycle-test.cjs`: dodici scenari reali REST/SockJS/STOMP (quattro modalità × leave/reconnect, timeout, recupero guasto). Il runner controlla clock e guasti storage, senza endpoint di bypass. Confronta la sequenza completa attesa, risorse dopo il round, batch forfait, pending dopo resume, hash/byte prima e dopo recupero e export uguali per ogni umano dopo leave ripetuto. Il comando export e lo schema JSON 1 rimangono quelli di I19a; non serve un nuovo comando amministrativo per il retry. Le prove complete e i limiti sono nel [report I19b](reports/i19b-report.md).

La lettura `resume` può essere ritentata una sola volta dalla CLI se non riceve la prima risposta, entro il timeout originale. È idempotente; non vengono reinviate mosse. I19b scarta deliberatamente una prima risposta in ciascuna delle quattro modalità e verifica che rimangano un solo RECONNECTED e la stessa pending.

La lettura `view`, come `resume`, ripete al massimo una richiesta se la prima
risposta precede la registrazione della sottoscrizione STOMP. Il retry resta
nel timeout originale; le azioni di gioco non vengono reinviate.

# I17a — Quick 1v1, prove applicative

25 ottobre 2026. **I17a completato: implementazione, dieci scenari CLI e accettazione visiva con due sessioni browser isolate verificati.** I17b non avviato. Regolamento 1.5 invariato: nessuna modifica a carte, starter, casualità, clock, forfait o condizioni di vittoria.

## Prerequisiti e preservazione

Letti AGENTS.md, game-rules.md, decisioni aggiornate di open-questions.md, roadmap e sorgenti/report di I13/I14/I23/I26. Le suite obbligatorie e il contesto Spring separato rieseguono le prove effettive dei prerequisiti: partite I13, trasporto multiaccount I26, clock I14 e reconnect I23. I risultati finali sono riportati sotto; le dichiarazioni storiche da sole non sono considerate verifica.

Workspace principale senza repository Git; numerose modifiche preesistenti nelle due repository annidate. Nessun reset, checkout, commit, modifica alla configurazione Git globale o cancellazione di dati. Stato iniziale e hash dei sorgenti/documenti in `.build-logs/i17a-before-*-status.txt` e `i17a-before-manifest.json`; copie dei file modificati in `i17a-before`. Differenze e manifest della sola attività conservati insieme alle prove.

## Difetto riprodotto e correzione

Prima: `/topic/game/quick/1v1/ready` pubblicava il gameId a tutte le sessioni sottoscritte. Il debug consumava il primo ready, anche quando appartenente a una coppia diversa. Cinque account autentici, con la sola coppia A/B in join, riproducono `AssertionError: ready contaminated an unrelated session` nel log `.build-logs/i17a-ready-reproduction.log`.

Ora il controller, dopo la creazione reale dalla coda, invia `/user/queue/game/quick/1v1/ready` soltanto ai due partecipanti. Policy, CLI e debug usano il canale privato; il topic precedente è negato. FFA conserva il contratto esistente. È una correzione tecnica dell'isolamento richiesto da R08 e I17a, non una nuova regola di gioco. I test precedenti sono aggiornati soltanto per il cambiamento intenzionale del canale, senza cambiare gli attesi del motore. API e guida CLI allineate.

## Fixture e trasporto

`QuickDuelCliTest` avvia Spring su porta casuale e SQLite temporaneo, e un processo Node con il `Client` della CLI esistente. Ogni account ha un proprio login REST e una connessione SockJS/STOMP distinta; nessuna impersonificazione di due giocatori sulla stessa sessione. Cinque account sintetici per scenario: A/B e C/D partecipanti, E estraneo. Sessione duplicata dello stesso account rifiutata.

La coda, il controller, la game factory, il servizio partite, la validazione, le viste e l'archivio sono reali. Il solo `PlayerFactoryService` fornisce copie isolate di personaggi/mani/mazzi noti; il clock iniettato è controllato dal runner tramite file, senza endpoint di bypass e senza attese reali di 30 s. Gli starter casuali restano il percorso previsto per la UX, non certificato dalle fixture. Le fixture di motore con mazzo vuoto servono a esercitare Struggle, senza essere salvate come mazzi validi dell'editor.

## Casi e attesi normativi

| Scenario | Prove e risultato |
|---|---|
| `complete` | A ripete join otto volte senza occupare un secondo posto; ready solo A/B, poi ready solo C/D. Mani proprie complete, avversarie numeriche e ordine mazzo nascosto; pending del solo titolare. Due submit concorrenti di A prima di B: una sola accettazione e un rifiuto, nessun round prematuro. MadeOfStone di A non altera C/D. A/B completano 11 round da HEALTH 100: MadeOfStone contro ShuffleFeet, poi dieci Struggle contro ShuffleFeet, vittoria A a HEALTH 50 contro B a 0. Il match C/D resta identico fino al proprio comando; poi sette Struggle reciproci, HEALTH −5 per entrambi e draw. Esito precedente immutato durante la seconda partita concorrente. Nuovo match nelle stesse sessioni senza ereditare turno/esito; leave produce il proprio esito |
| `concurrent-join` | Quattro join simultanei producono esattamente due gameId diversi e due coppie disgiunte, un solo ready per account e nessun ready per E. Mosse simultanee nelle due partite per tutti e sette i round, viste e journal limitati ai rispettivi partecipanti; due draw completi |
| `move-before` | A invia a 29.999 ms, il proprio clock si ferma; a 30.000 scade soltanto B e vince A senza risolvere il round o applicare costi/pesca |
| `move-exact`, `move-after` | Nessun submit prima del termine; a 30.000/30.001 ms entrambi scaduti insieme, draw, nuova mossa rifiutata |
| `pending-resume`, `unsubmitted-resume` | Drop dopo/prima della mossa; rientro a 29.999 ms dall'avvio, stessa partita e vista privata. Pending accettata conservata, replay rifiutato e un solo MOVE_ACCEPTED nell'archivio; oppure invio valido dopo il rientro. Vecchio Client chiuso non invia. Il termine originale di B non cambia: scade a 30.000 ms |
| `reconnect-before` | A aveva presentato la mossa; drop a 1.000 ms, B invia a 29.999 e il round si risolve durante l'assenza di A. Resume a 29.999 ms dal drop ripristina il turno 1 con HEALTH 85 e nessun reinvio; leave finale |
| `reconnect-exact`, `reconnect-after` | Stessa sequenza, rientro a 30.000/30.001 ms dal drop: forfait reconnect del solo A e vittoria B. Il nuovo clock del turno non estende la finestra reconnect |

Nei casi temporali C ha una propria pending mentre D non invia: il match separato segue soltanto il proprio termine, vince C e conserva HEALTH 100 e stati iniziali. Questo distingue la condivisione legittima del tempo server da una contaminazione di partita. Durante `complete` il tempo controllato resta fermo per verificare tutti i round, senza rimuovere il clock multiplayer dalla produzione.

Accessi estranei su trasporto reale: SUBSCRIBE a vista/update/move, SEND vista/mossa/leave, identità contraffatta e sottoscrizione nominativa altrui rifiutati. Export attivo e concluso negato a E; nessuna vista ricevuta e nessuna mutazione nei due match. Il rifiuto viene verificato come errore STOMP della connessione dedicata, non come semplice assenza di risposta. La policy diretta verifica anche il rifiuto del vecchio topic ready.

## Log ed export già supportato

Ogni conclusione viene esportata via CLI da entrambi i partecipanti, con documenti identici; nessun nuovo formato o endpoint. Verificati `recording.complete=true`, `status=OK`, assenza di eventi non persistiti, sequenze contigue, catena SHA-256 e testa, due controller umani, modalità `quick1v1`, appartenenza di ogni mossa/stato e un solo OUTCOME. Per la partita naturale A/B: esattamente 22 MOVE_ACCEPTED e 11 ROUND_COMMITTED. Submit dopo esito rifiutato senza alterare l'export; export invariato dopo leave.

Dopo cleanup del runtime, un nuovo `MatchArchiveService` con nuovo repository rilegge SQLite per entrambi i partecipanti e restituisce lo stesso JSON. Le prove includono 21 partite concluse nei dieci scenari (tre in `complete`, due negli altri nove).

Evidenze conservate: `.build-logs/i17a-<scenario>-exports.json` contiene export integrali e transcript degli eventi privati/game/session, senza credenziali e senza duplicare i profili/cataloghi. Log server dei runner in `i17a-duel-final.log` e `i17a-context-final.log`; SQLite isolati sotto `bm-server/target/test-databases`, file di coordinamento sotto `target/i17a-clock-*`. Non viene introdotta retention o cancellazione.

## Verifiche automatiche

- Scenario mirato `QuickDuelCliTest`: **10 PASS**, zero failure/error/skipped, `.build-logs/i17a-duel-final.log`.
- `./scripts/build.ps1 -Task Test -Offline`: **237 server + 26 client PASS**, `.build-logs/i17a-test-final.log`.
- `python scripts/check-rules.py`: **PASS**, `.build-logs/i17a-rules-final.log`.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **316 server PASS**, zero failure/error/skipped, `.build-logs/i17a-context-final.log`. Include i due casi I13, i sette lifecycle I14/I23, i nove casi WebSocket/CLI I26 e i dieci nuovi casi I17a.
- Compilazione Angular dev riuscita, `.build-logs/i17a-ux-client.log`.
- Pacchetto JAR offline aggiornato senza clean: **PASS**, `.build-logs/i17a-package-final.log`; controlli whitespace delle due repository superati. Riepilogo dei 21 esiti in `i17a-results-summary.json`, report JUnit copiati in `i17a-surefire-final`. Server di sviluppo Angular arrestato dopo l'interruzione della UX; dati ed evidenze conservati.

Le suite sopra sono state eseguite nella fase applicativa dello stesso incremento. La chiusura UX non ha modificato sorgenti applicativi, test o script del progetto: verificati gli hash di 317 file già censiti e dei nuovi file di test rispetto alle evidenze delle suite verdi. Non si confonde il contesto Spring completo con i soli test unitari. Alla chiusura rieseguito `python scripts/check-rules.py`: **PASS**, `i17a-rules-closure.log`. Gli export delle nuove partite browser sono verificati separatamente sotto.

## Tentativi browser precedenti — storico superato

Il primo tentativo arrivò soltanto al login Edge: il controllo computer fu interrotto con Esc e rifiutò la ripresa nello stesso turno. Il tentativo successivo, con database dedicato `.build-logs/i17a-ux-accepted.sqlite`, JAR e Angular dev, si fermò prima del login alla finestra Firefox con «browser URL policy enforcement is not yet supported for the current Windows browser». Log `i17a-ux-accepted-server.log` e `i17a-ux-accepted-client.log` conservati; servizi arrestati e database preservato. Quei tentativi non certificavano una partita e avevano correttamente lasciato I17a aperto. Le prove successive chiudono il criterio mancante, senza usare le vecchie prove I14/I23 come sostituto.

## Accettazione browser conclusa — 25 ottobre 2026

Due finestre/contesti Edge separati, **normale per devAlice e InPrivate per devBob**, con login e connessioni STOMP indipendenti. Database sintetico nuovo `.build-logs/i17a-ux-edge.sqlite`, JAR già compilato e verificato, starter/assegnazioni/casualità reali, tempo server reale e nessuna fixture del motore. Interazione effettuata attraverso i controlli visibili del debug. I due account risultano connessi contemporaneamente; ciascuno vede soltanto la propria mano, mentre personaggi, risorse e oggetti dell'avversario si aggiornano. Il routing privato del ready porta entrambi alla stessa coppia, senza sessioni sovrapposte.

| Partita UX | Risultato visibile e riscontro nei log |
|---|---|
| `afbda4b5…75f6e8` | Join reale Bob/Alice e Begin reciproci. Alice Bruiser consuma Negroni con ADOPERIAMOTI; Bob Junkie usa Ghigno co' i' Denti Marci scartando una regolare. Entrambi vedono lo stesso Turn Resolution e gli effetti: Alice HEALTH 98, ALERTNESS 8, VIOLENCE 45, TOXICITY 5, ALCOHOL 7; Bob HEALTH 100, ALERTNESS 40. Nessuna seconda mossa accettata: alla scadenza del turno successivo entrambi vedono **WINNER: NONE — timeout**. Continue, effetti finali e hub verificati sui due lati |
| `6e3d6f7e…61ea5` | Secondo avvio nelle stesse sessioni, nuovi personaggi/mani. Alice invia: messaggio pending e tutti i Play disabilitati, risorse ancora iniziali. Drop di Alice; Bob non invia e scade al termine originale. Il nuovo login di Alice arriva dopo il timeout mossa di Bob, entro la finestra reconnect: esito disponibile **WINNER: devAlice — timeout**, coerente sui due browser. Questa prova verifica l'esito al rientro, non viene presentata come rientro in partita ancora attiva |
| `8c2da8fa…df2d6e` | Terzo avvio reale; Bob invia una bound valida, poi drop e nuovo accesso nella finestra InPrivate. DISCONNECTED alle `22:04:35.146Z`, RECONNECTED alle `22:04:35.982Z`: circa **0,84 s**, stesso gameId, nessun nuovo INITIAL/join e un solo MOVE_ACCEPTED. Mano/risorse invariate, pending ripristinata e Play disabilitati. Il rientro non richiede un nuovo Begin: un'attesa iniziale del runner su quel dialogo non più necessario è scaduta; la successiva ispezione visiva ha confermato lo stato corretto. Bob abbandona esplicitamente: hub con conferma forfait; Alice vede **WINNER: devAlice — leave**, poi Continue e hub. Mossa pending di Bob annullata senza costo/scarto/pesca e risorse di entrambi ancora iniziali |

Gli orari UTC del journal sono riportati senza conversioni; le schermate del clock usano l'orario locale del browser. Le tre partite hanno ID distinti, due partecipanti umani ciascuna e non ereditano il risultato precedente. Logout esplicito di entrambi verificato con campi vuoti e nessun dato di partita; le sessioni sono state liberate.

### Evidenze visive ed export delle partite UX

Screenshot nativi e alberi accessibilità in `.build-logs/i17a-ux-evidence/`, con `manifest.json`: `alice-begin.jpg`, `bob-begin.jpg`, `alice-round1.jpg`, `bob-round1.jpg`, `alice-timeout-draw.jpg`, `bob-timeout-draw.jpg`, `pending-before-drop.jpg`, `bob-pending-before-drop.jpg`, **`bob-pending-restored.jpg`**, `alice-opponent-leave-outcome.jpg`, hub e logout finali. I file originari di cattura e i tentativi intermedi sono conservati; l'indice seleziona le prove corrette e usa l'estensione del formato JPEG restituito dal controllo computer, senza ritocchi alle immagini.

Log server/client: `i17a-ux-edge-server.log`, `i17a-ux-edge-client.log`. Nessun errore applicativo o MATCH_ARCHIVE_WRITE_FAILED osservato. Dopo il logout, due CLI autentiche distinte esportano tutte e tre le partite: documenti identici fra Alice/Bob, complete/OK, catene hash e un solo OUTCOME. Export e riepilogo in **`i17a-ux-edge-exports.json`**, `i17a-ux-edge-summary.json`; verifica ripetibile con `.tools/node-v12.22.12-win-x64/node.exe .build-logs/i17a-ux-export-verify.cjs` a server locale e database dedicato avviati. Esito PASS in `i17a-ux-edge-export-check.log`. Entrambi ricevono `resume: none` dopo la presa visione/leave.

Una rilettura SQLite indipendente confronta tutte le entry originali (sequenza, hash precedente, hash e JSON) con i tre export CLI: uguali, `PRAGMA integrity_check=ok`. Rispettivamente **11, 7 e 8 eventi** nelle tre partite della tabella; nessun esito o evento ricostruito. Nel match di reconnect attivo: un solo MOVE_ACCEPTED, un solo RECONNECTED e una sola finalizzazione leave. I dati e i log restano conservati; i servizi temporanei vengono arrestati senza cancellazioni.

**Tutti i criteri I17a sono implementati e verificati; nessun blocco residuo.** Le prove totali sono 21 partite CLI isolate più 3 partite UX. I17b, consolidamento I19b/c, restart-draw I24 e approvazione I22 restano fuori da questa consegna. Nessuna nuova implementazione applicativa o regola è stata introdotta durante la chiusura UX.

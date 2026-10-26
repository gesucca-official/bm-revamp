# I16 — Open 1vCom completo

25 ottobre 2026. **Completato per F16**. Regolamento 1.4 e decisioni aggiornate di open-questions rispettati. Nessuna modifica alle meccaniche, carte, catalogo, starter o bot casuale; nessun timeout mossa vsCom né open PvP.

## Stato reale e prerequisiti

Letti AGENTS.md (nessuna istruzione annidata), regolamento, decisioni finali R03/R05, roadmap, report I13/I15/I26 e sorgenti effettivi. La radice non è un repository Git; entrambe le repository annidate presentano numerose modifiche preesistenti, conservate senza reset/checkout o configurazioni globali. Stato consultato con safe.directory limitata al comando.

I13/I15/I26 riverificati nella suite completa: QuickCompleteCliTest (quattro quick, seconda partita ed export), WebSocketIdentityTest e runner CLI security (CRUD, strutture/ownership I15, modalità/processi I26), test diretti storage e client esistenti. Nessun prerequisito assunto sulla sola documentazione.

Open già riusava factory, GameSessionService e Game per gioco/esito. Mancavano invece archivio completo esportabile e risposta gestita al join con mazzo assente. La costruzione del giocatore leggeva cinque volte il record salvato.

## Modifiche circoscritte

Open1vCom usa ora lo stesso recorder, snapshot, transazione locale e finalizzazione OUTCOME delle quick. Nessun secondo motore/finalizzatore, schema nuovo o ricostruzione dei vecchi log. La raccolta osserva il gioco: nessuna revisione normativa o modifica SQLite/copia client del regolamento necessaria.

Una sola lettura per proprietario/ID costruisce personaggio e carte nuove dai binding di quello snapshot. Nessun riferimento al record resta nel Player. I metodi legacy DeckFactory sono conservati.

Il controller risponde sul canale privato `/user/queue/game/open/1vCom/error` con messaggio uniforme per assente/altrui, senza esporre l'esistenza del mazzo presso altri account. Canale autorizzato e sottoscritto dal CLI. Debug: errore visibile, reset queued/loading, rimozione delle due sottoscrizioni ready/error, retry senza login. Open disabilitato durante join pendente; dialogo con Cancel, avviso se non esistono mazzi e OK disabilitato senza scelta.

## Due percorsi CLI completi

`OpenCompleteCliTest.savedDecksCompleteThroughRealOpenFactory` avvia Node con Client I26, server Spring su porta casuale e SQLite temporaneo. REST/SockJS/STOMP, salvataggio, selezione, factory umana, shuffle, pesca, motore, esito e recorder reali. Solo l'avversario è fissato dalla spy PlayerFactoryService: bot Bruiser a HEALTH 100 senza regolari/oggetti/last resort in mano; bot casuale reale senza mosse valide, quindi void. Nessun endpoint di bypass in produzione.

| Mazzo salvato | Configurazione runtime verificata | Atteso normativo R02/R06/R07 e risultato |
|---|---|---|
| i16-bruiser | BigBadBruiser, BruiserGrab, zero bound, Struggle, 1 ShuffleFeet; residuo dopo preparazione 0 | 1 ShuffleFeet + 10 Struggle: vittoria umana turno 11, HEALTH 50/0; 57 eventi |
| i16-junkie | ToxicJunkie, ToxicGrab, 2 RottenSmile duplicate, Struggle, 8 ShuffleFeet; residuo iniziale 5 | 8 ShuffleFeet + 10 Struggle: vittoria umana turno 18, HEALTH 50/0; 92 eventi |

Entrambi nella stessa connessione: salva → conferma profilo → seleziona ID → vista runtime → partita completa → esito → export → leave → export immutato. Controllati personaggio, bound, regolari, deck residuo e HEALTH dopo ogni round. INITIAL esportato confrontato con configurazione scelta: modalità, personaggio, basic/bound, last resort e intero ordine iniziale regolare. Spy repository: esattamente una lettura di ciascun record al join.

Durante ciascuna partita il record viene sostituito con personaggio/basic/bound/regolari dell'altra configurazione, verificando il salvataggio, e poi cancellato. Le viste restano identiche e la partita continua fino all'esito originale. INITIAL/export confermano l'isolamento runtime.

ID assente e ID presente soltanto per l'altro account: stesso errore, nessun ready, profilo ancora leggibile sulla connessione. Le prove precedenti d'impersonificazione restano verdi; bot costruiti solo per i due join validi. Dopo esito submit rifiutato senza nuovi eventi. Export complete/OK, nessun evento non persistito; sequenze e catena SHA-256 ricalcolate, INITIAL + cinque eventi per round + OUTCOME. Export integrali confrontati con nuovo servizio/repository indipendente dopo rimozione della partita viva.

Evidenze sintetiche: `.build-logs/i16-exports.json`, output temporanei `bm-server/target/i16-cli-*.json`. Limite 30 turni e deadline del processo soltanto nel runner: rilevano stalli senza assegnare esiti né introdurre clock mossa.

## Debug separato

Server 18086, Angular 4216, database dedicato `.build-logs/i16-ux.sqlite`, account sintetici devAlice/devBob. Nessuna factory spy nella UX; bot di produzione casuale. Client compilato con successo, live reload disattivato.

Bob senza mazzi: “No saved decks. Create one in Collection before joining.”, OK disabilitato e Cancel funzionante. Alice: elenco distinto I16 UX Bruiser / I16 UX Junkie, OK disabilitato senza scelta; annullamento senza avvio partita. Selezionato Bruiser, poi rimosso il solo record sintetico mentre il dialogo era aperto: OK mostra “Deck unavailable. Choose a saved deck from your account and retry.”, libera attesa e modalità e conserva la sessione. Nuova scelta Junkie nella stessa sessione: Begin e vista corretta con Tossico del Serraglio, HEALTH 100, ALERTNESS 35, TOXICITY 10, ToxicGrab più cinque ShuffleFeet (mazzo UX con zero bound e otto regolari). Errore precedente scomparso.

Screenshot in `.build-logs`: `i16-ux-empty.png`, `i16-ux-selected.png`, `i16-ux-rejected.png`, `i16-ux-started.png`. Record sintetico conservato in backup e ripristinato al termine; processi UX propri fermati. Nessun processo preesistente terminato o dato reale modificato. La UX I16 verifica scelta/messaggi/recupero e avvio; non duplica la partita naturale completa già accettata in I13. Le due open complete sono provate via CLI.

## Verifiche

- `./scripts/build.ps1 -Task Test -Offline`: **PASS 219 server + 21 client**, `.build-logs/i16-test.log`.
- `python scripts/check-rules.py`: **PASS**, 39 carte e token, copia client e SQLite coerenti.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **PASS 281 server**, zero failure/error/skipped, `.build-logs/i16-context.log`. Verifica separata del contesto completo, inclusi I13/I15/I26/I16.
- Mirato da `bm-server`, JAVA_HOME alla JDK locale: `../.tools/apache-maven-3.6.3/bin/mvn.cmd -s ../scripts/maven-settings.xml "-Dmaven.repo.local=E:/bm/.tools/m2" -B -o -Pcontext-tests -Dtest=OpenCompleteCliTest test`: **PASS 1 caso / 2 partite**, `.build-logs/i16-specific.log`.
- Angular debug compilato e browser verificato; log `i16-ux-server.log` / `i16-ux-client.log`. Nessun requisito di packaging/deploy aggiunto.

Tentativi preparatori Maven corretti per quoting PowerShell e selezione JDK fissata, senza download. Prime prove del nuovo runner corrette per un'asserzione su `view.type` (campo assente dalla vista privata, modalità verificata nell'archivio) e un personaggio erroneamente condiviso dalla fixture bot: ora nuovo per match. Nessun atteso di gioco cambiato o test precedente indebolito.

Nessun blocco I16 residuo. La prova deterministica non dimostra terminazione universale di ogni mazzo/bot; resta il limite normativo dell'umano senza mosse. Timeout, forfait, reconnect, recovery storage, restart-draw e accettazione multiplayer restano nei rispettivi incrementi, non dichiarati conclusi.

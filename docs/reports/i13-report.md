# I13 — Quick 1vCom completo



24 ottobre 2026. **Completato per F14/F23/F24/F25**. Nessuna modifica alle meccaniche, alla policy casuale del bot, al catalogo o al client. I13 aggiunge due scenari parametrizzati nel runner Spring esistente e il relativo scenario CLI; nessun incremento successivo implementato da questo lavoro.



## Verifica preliminare e prerequisiti



Letti AGENTS.md (nessuna istruzione annidata trovata), roadmap, regolamento, decisioni in open-questions, report e sorgenti effettivi di I12/I19a/I26, motore, factory, servizio, archivio e debug. Le due repository annidate avevano numerose modifiche preesistenti: conservate senza reset o ripristini. I12 (87 casi effetti e matrice), I19a (storage/export e guasti) e I26 (CLI reale e sicurezza) sono stati rieseguiti nella suite completa, non considerati acquisiti in base ai soli report.



Durante questa attività altri interventi nel workspace hanno modificato editor/client e introdotto la revisione 1.4 per I15. Tali modifiche sono esterne a I13 e sono state conservate. Le prove iniziali I13 sono passate su 1.3; il controllo della versione esportata nel nuovo scenario riceve ora la versione del server dal runner; sono verificati anche i quattro digest SHA-256. Non si alterano gli attesi degli effetti di gioco. Le fixture sono installate soltanto dalla factory spy del test: nessun endpoint di bypass o modifica alla produzione.



## Prove automatiche e criteri



`QuickCompleteCliTest.completeQuickGamesAndSecondMatchInSameCliSession` avvia un processo Node per ciascun umano Bruiser/Junkie, REST/SockJS/STOMP autentici, server su porta casuale e SQLite temporaneo di SqliteContextSupport. Lo stesso Client resta connesso per due match con ID distinti, senza nuovo login. Tutti i personaggi iniziano con HEALTH 100; carte reali create dal catalogo.



| Criterio | Fixture, atteso normativo e verifica |

|---|---|

| Vittoria, umano Bruiser e Junkie | 20 ShuffleFeet regolari omogenee, speciali del personaggio; nessun oggetto. Dopo 20 azioni e 10 Struggle: turno 30, umano HEALTH 50, bot 0, vittoria umana (R02/R06/R07). Risorse verificate dopo ogni turno su vista CLI e archivio |

| Mazzo esaurito | Mazzo runtime 17 dopo preparazione, decrementa di uno fino a zero al turno 17; nessun rimescolamento. Esaurite le 20 regolari si continua con Struggle ripescata. Il mazzo iniziale pre-pesca nell’export conserva tutte le 20 carte |

| Bot senza azioni disponibili | Basic senza oggetti, bound senza scarto regolare e last resort rimossa dalla sola fixture. Il bot casuale reale sceglie void a ogni turno; ROUND_READY lo conserva, risoluzione con una sola azione, bot non pesca dopo void (R03/R04). Nessun override di chooseMove |

| Pareggio, entrambi gli umani | Fixture di confine con mazzi runtime vuoti e speciali: soltanto Struggle valida per entrambi; HEALTH perde 15 a round anche se l’autore muore prima di agire. Turno 7, HEALTH −5/−5, draw senza vincitore (R04/R06/R07) |

| Submit dopo over | Ultima mossa nuovamente inviata: errore Game is over; vista ed export identici prima/dopo, nessun nuovo round/evento |

| Seconda partita | Leave della vittoria, export ancora leggibile, join del pareggio sulla stessa connessione. Dopo il secondo leave anche il primo export rimane identico; entrambi i match rimossi dalla sessione viva |

| Dati interi ed export | INITIAL + 5 eventi per round + OUTCOME: 152 eventi per vittoria e 37 per draw. Tutte le sequenze/tipologie e la catena hash sono ricomputate; versioni, configurazione bot random, personaggio, ordine iniziale, pending/void, mosse risolte/report, stato completo a ogni round, risorse ed esito controllati. Export complete=true/OK, zero eventi non persistiti; uguaglianza integrale dopo leave e con nuovo repository/servizio senza partita viva |



I due processi terminano normalmente entro 60 secondi ciascuno. La soglia 40 turni del solo scenario fallisce se rileva stallo; non assegna vittorie/pareggi, non termina il motore e non dimostra terminazione generale. Le fixture vuote sono stati sintetici di confine per il motore, non mazzi salvabili né nuovi starter. Nessun dato reale utilizzato.



Export integrali sintetici conservati in `.build-logs/i13-i13Bruiser-exports.json` e `i13-i13Junkie-exports.json`; output temporanei del runner in `bm-server/target/i13-cli-*.json`. Le prove dirette motore/storage e le prove client precedenti restano nella suite.



## UX debug separata, casualità reale



Server JAR esistente I19a su loopback, database dedicato `.build-logs/i13-ux.sqlite`, provisioning opt-in dei soli account sintetici devAlice/devBob. Nessuna fixture di carte/personaggi o seed casuale nella UX. Client avviato con Angular debug; origine del server allineata a `http://127.0.0.1:4200`. Dopo un tentativo iniziale con origine discordante e due interruzioni da live reload, riavviato il client con `--live-reload=false` per preservare la sessione durante le modifiche concorrenti.



Verifica tramite interazione browser: login, Quick Modes → Join 1vCom, Begin, Play abilitati/disabilitati, scelte predefinite valide, aggiornamenti di mano/risorse/oggetti, stati/timer, Turn Resolution e End of Turn Effects. Partita naturale completata in **14 turni**, umano Junkie devAlice contro Junkie ComPlayer_4950: umano HEALTH −17, bot 26; vincitore bot visualizzato correttamente. Veleno finale umano 3→−17 e bot 43→26 mostrati nel dialogo effetti. Esito confermato anche dal journal del solo DB sintetico.



Continue ripristina l’hub; seconda quick avviata nella stessa sessione, Begin con ComPlayer_9521 e nuova mano a salute piena. Seconda partita UX verificata soltanto per l’avvio, poi logout. Nessun restore/reconnect certificato. Screenshot `.build-logs/i13-ux-outcome.png`, `i13-ux-second-match.png`; traccia DOM `i13-ux-trace.json` e log server/client omonimi. La UX è verificata separatamente dai test automatici; non è una prova esaustiva di tutte le carte o del pareggio visuale.



## Verifiche



Prima riesecuzione completa: `./scripts/build.ps1 -Task Test -Offline` PASS, **218 server + 18 client** (`.build-logs/i13-test.log`); contesto separato PASS **279 test**, zero failure/error/skipped (`.build-logs/i13-context.log`). Inclusi I12, I19a, I26 e i due nuovi casi CLI (quattro partite). Prima prova del nuovo scenario corretta nel solo controllo del report interno: ENGINE_REPORT contiene il report drenato, lo snapshot seguente lo trova vuoto; nessun atteso di gioco cambiato.



Riesecuzione ordinaria finale su workspace condiviso aggiornato: PASS **219 server + 19 client** (`.build-logs/i13-test-final.log`); `python scripts/check-rules.py` PASS (`.build-logs/i13-rules-final.log`). Un passaggio intermedio del contesto ha segnalato `NoClassDefFoundError: WebSocketIdentityTest$9` nel test preesistente durante attività concorrenti sulla build; rieseguito integralmente senza cambiare gli attesi di quel test. Riesecuzione completa finale: **PASS 280 test, zero failure/error/skipped** (`.build-logs/i13-context-final.log`), inclusi i due casi I13. Il conteggio maggiore rispetto a 279/218/18 proviene dai test aggiunti esternamente a I13 nel workspace condiviso. Nessun criterio funzionale I13 rimasto aperto. Limiti: le fixture deterministiche non dimostrano terminazione universale del bot casuale; UX naturale completa con Junkie, Bruiser completo coperto automaticamente. I19b, timeout, reconnect, restart-draw e gli incrementi successivi restano fuori da I13.



Controllo mirato finale dopo l’adeguamento del solo controllo versione: **PASS 2 casi / 4 partite**, `.build-logs/i13-specific-final.log`. Da `bm-server`, con JAVA_HOME alla toolchain locale: `../.tools/apache-maven-3.6.3/bin/mvn.cmd -s ../scripts/maven-settings.xml -Dmaven.repo.local=E:/bm/.tools/m2 -B -o -Pcontext-tests -Dtest=QuickCompleteCliTest test`. Esportazioni complete rigenerate e rilette da storage; nessun errore/skipped. Server e client avviati per la UX sono stati fermati al termine, senza eliminare fixture o evidenze.

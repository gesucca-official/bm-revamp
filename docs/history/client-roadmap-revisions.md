# Revisioni 1–20 della roadmap del client web animato

> **Documento storico**, spostato dalla [roadmap del client](../client-roadmap.md)
> il 29 ottobre 2026 senza modifiche al testo. Gli stati «non iniziata» o
> «aperta» valgono alla data della revisione; stato corrente
> nell'[indice della documentazione](../README.md#stato-corrente). I
> collegamenti sono adattati alla nuova posizione.

- **Versione 20 — 29 ottobre 2026, prova umana B (C2b-7):** prova condotta dal
  proprietario: duello, FFA con computer e telefono senza rilievi; nessun blocco. Dal
  mazzo salvato O15 (manca un riepilogo del mazzo corrente, tappa da decidere), O16
  (deckbuilder più funzionale), O17 (mazzo dalla collezione posseduta) e O18 (scelta del
  mazzo in ogni modalità, starter selezionabile); O17 e O18 richiedono regole e server,
  quindi attività separate. Giudizio su C2 non ancora dato. Nessuna regola cambiata.

- **Versione 19 — 29 ottobre 2026, C2b-7 (parte automatica):** tutte le verifiche di
  `client-web` (Verify, VerifyModes, VerifyLifecycle, VerifyFfa, VerifyDecks, VerifyPublic,
  VerifyProfile) ripetute sulla stessa build a 1366×768 e 844×390, più `Size` e le verifiche
  del repository. Una correzione emersa: il tavolo poteva scorrere di 14 px quando il fuoco
  finiva su una carta della mano (strato semantico oltre il bordo); ora è ritagliato.
  Checklist P01–P44 con evidenza o limite esplicito. Scheda della prova umana B pronta,
  con i cinque account D3. Prova B e giudizio del proprietario **non fatti**: C2 resta aperta
  ([rapporto C2](../reports/client-c2-report.md#c2b-7--checklist-di-parità-e-prova-umana-b)).
  Nessuna regola, API o servizio cambiato.

- **Versione 18 — 28 ottobre 2026, C2b-6:** scheda «Profilo» in `client-web` (nome, email,
  ruolo) con il pannello di amministrazione per il ruolo ADMIN: conteggi, partite non
  concluse, download dei due log, cancellazione con conferma. Le credenziali HTTP Basic
  restano al browser (D6): prompt nativo verificato su Edge, 401/403 mai un successo.
  Segnalazione degli errori non gestiti al log del server: un invio alla volta, 5 s, al
  massimo dieci per caricamento, senza credenziali, nome utente né dati di gioco. Strumenti
  riprovati in 1v1 e FFA. Admin provato nell'ambiente temporaneo D5 (account sintetico
  ADMIN, Basic da variabili d'ambiente, DELETE su soli log sintetici); con quick e open il
  server non scrive il log delle partite
  ([rapporto C2](../reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica)).
  Nessuna regola, API o servizio cambiato. C2b-7 non iniziato.

- **Versione 17 — 28 ottobre 2026, C2b-5:** schermate prima del login in `client-web`
  con navigazione a hash: home con gli stessi collegamenti del debug e il testo dei
  diritti corretto (tutti i diritti riservati), regolamento importato da
  `docs/game-rules.md` al build (D10), registrazione con i controlli del debug. Nel
  profilo locale l'invio del codice risponde 500 (email disabilitata): il client lo dice
  senza promettere l'onboarding e nessun account viene creato (D4). Verifica sul server
  reale a 1366×768, 844×390 e in portrait 390×844
  ([rapporto C2](../reports/client-c2-report.md#c2b-5--home-regole-e-registrazione)).
  Nessuna regola, API o servizio cambiato. C2b-6 e C2b-7 non iniziati.

- **Versione 16 — 28 ottobre 2026, C2b-4:** scheda «Collezione» in `client-web`
  (catalogo completo con illustrazioni, elenco mazzi, editor su copia, salva,
  sovrascrivi e cancella con conferma) e open 1vCom con la scelta del mazzo; «Nuova
  partita» ripete open con lo stesso mazzo. Partite reali in locale a 1366×768 e
  844×390 ([rapporto C2](../reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom)).
  Decisione del proprietario: **regolamento 1.8**, nessun «/» nell'identificativo di un
  mazzo (R02), con validazione server e test in un commit separato; nessun'altra regola,
  carta o API cambiata. C2b-5…C2b-7 non iniziati.

- **Versione 15 — 28 ottobre 2026, C2b-1…C2b-3:** in `client-web` sono fatti tre
  blocchi del [piano C2b](../history/client-c2b-plan.md), ognuno con partite reali in locale a
  1366×768 e 844×390 ([rapporto C2](../reports/client-c2-report.md)):
  - C2b-1: hub «Gioca», quick 1v1, uscita dalla coda con ACK, presenza, «Nuova
    partita» nella stessa modalità;
  - C2b-2: clock indicativo, ragioni di forfait tradotte, logout in partita,
    rientri prima e dopo il termine, sessione unica, ricevuta di riavvio;
  - C2b-3: coda FFA con lista pubblica, computer e avvio anticipato, tavolo a
    cinque con ventagli coperti e oggetti come carte, oggetto coperto che si alza
    al primo tocco (K7), computer numerati (K4, D9), forfait altrui con la partita
    che continua, «Resta a guardare» dopo la propria morte (D11).

  Regole, server, catalogo e debug invariati. Prova su iPhone a 750×292 del
  proprietario aperta; C2b-4…C2b-7 non iniziati.

- **Versione 14 — 27 ottobre 2026, chiusura C2a:** il proprietario ha provato
  tutta C2a su iPhone e su desktop e la giudica adeguata per ora; la prova umana B
  non ha evidenziato nulla di rilevante. C2a è chiusa. Regole, server, catalogo e
  debug invariati. C2b non iniziata.

- **Versione 13 — 27 ottobre 2026, C2 / O9:** implementate le illustrazioni
  provvisorie: 40 immagini generate ex novo in un atlante WebP 2048×1536 (riquadri
  da 256 px), scelte per `bindingName` nel tavolo e nell'ispezione. Decisione del
  proprietario sul peso, che sostituisce il totale di 1 MB di C0: JS ≤ 500 KB gzip,
  totale ≤ 4 MB gzip, atlante ≤ 2048×2048, texture decodificate ≤ 64 MB (misurati
  1,06 MB gzip e 18,9 MB). Sorgenti PNG e prompt restano fuori da git, per
  decisione del proprietario. Provate con test e partite reali in locale
  (1366×768 e 844×390); il proprietario le ha provate su iPhone e ha chiuso O9
  (27 ottobre 2026). Regole, server, catalogo e debug invariati.

- **Versione 12 — 27 ottobre 2026, C2a:** implementata la leggibilità di base nel
  percorso quick 1vCom di `client-web`:
  - O11: carte non pagabili attenuate, con «!» sul costo; restano inviabili;
  - O12: carte più grandi che si alzano intere al passaggio del mouse, al tocco o
    con il focus; un tocco altrove le riabbassa e annulla la scelta; geometria FFA
    preparata e verificata solo in unità;
  - O13/O3/O4: plancia delle risorse con simbolo, numero e barra (salute piena
    all'inizio, altre risorse a metà), guadagni ▲ sulle carte;
  - stati, equipaggiamenti, immunità e timer come gettoni sul personaggio, con
    riepilogo breve al passaggio del mouse o al tocco;
  - O14: timbro di ruolo dal catalogo.

  Le ultime quattro voci e le carte più grandi seguono la prova del proprietario
  prima del commit.

  Verify reale estesa e verde a 1366×768 e 844×390. iPhone e prova umana aperti;
  C2b non iniziata. [Rapporto C2](../reports/client-c2-report.md).

- **Versione 11 — 27 ottobre 2026, decisione O14:** la classificazione per
  ruolo è un campo del catalogo SQLite. Regolamento 1.7 con R07a (ruolo e
  guadagni a sé, puramente descrittivi; OTHER per le carte ambigue), colonne
  SQLite, allegato, classe del token, esposizione `role`/`gains` nel server,
  verifiche e copia delle regole nel debug. Nessun effetto o bilanciamento
  cambiato. Tolta dalle decisioni aperte.

- **Versione 10 — 27 ottobre 2026, chiusura C1:** il proprietario chiude C1.
  Su iPhone 16 Pro, servito in rete locale con codice d'accesso
  (`run.ps1 -Task Physical`), giudica adeguati drag col dito e risposta al
  tocco, senza misure. La prova umana A non riferisce blocchi e porta O11–O14:
  carte non pagabili attenuate, carte più grandi, risorse leggibili con le
  carte che le danno, ruoli riconoscibili. Assegnate a C2 prima della prova B;
  O3/O4 anticipate da C3; finitura in C4. La fonte dei ruoli (O14) è una
  decisione aperta. Regole, server, catalogo e debug invariati.

- **Versione 9 — 27 ottobre 2026:** registrate e assegnate le osservazioni
  O1–O10 del proprietario sul client C1. O1/O5 sono residui C1, O9 è in C2,
  O3/O4/O6/O7 in C3, O2/O8/O10 in C4. Il gesto di riordino perde il pulsante
  click/tap. Le illustrazioni provvisorie hanno fonti tracciate, non immagini
  prese da Internet. Gli eventi strutturati per O7 restano una decisione
  aperta. Nello stesso giorno O1 e O5 sono implementati in `client-web` e
  verificati sul server reale; regole, server, catalogo e debug invariati.

- **Versione 8 — 27 ottobre 2026, C1:** nuovo `client-web/` dalla scena C0
  congelata; adattatore STOMP/SockJS e REST con sottoscrizioni confermate,
  topic update/move solo come segnale, nessun reinvio automatico; sessione,
  selezione e animazione separate; drag con carta che segue il puntatore.
  Partite reali su server locale per entrambi i personaggi con bound, oggetti,
  rifiuti, effetto periodico, esito, hub e rientro. Prova umana A e touch fisico
  aperti. Regole/server/catalogo/debug invariati. [Rapporto](../reports/client-c1-report.md).

- **Versione 7, riordino documentale — 27 ottobre 2026:** allineate al gate
  chiuso le frasi rimaste da versioni precedenti (prova fisica, lettura al
  minimo, portrait in C4); verifiche del repository rimandate a CONTRIBUTING;
  ricognizione preparatoria e punto di ripresa C0 spostati in `history/`.
  Nessun cambiamento di perimetro, tappe, criteri o decisioni.

- **Versione 7 — 27 ottobre 2026, chiusura C0:** strumento di cattura fisica
  sulla stessa build (USB o rete locale con codice). Due catture su iPhone
  16 Pro/Safari: frame PASS, input 125 poi 116 ms dopo l'unica semplificazione
  mirata del testo; accettato con deroga dal proprietario, soglie invariate.
  Revisione umana sì con riserve; landscape forzato; stack confermato. C1 non
  iniziata. Regole/server/catalogo/debug invariati.

- **Versione 6 — 27 ottobre 2026, C0-R2–R5:** registrata l'approvazione di
  duello, FFA cinque e carta R1. Realizzata una sola scena Pixi/React con DTO
  sintetici, nuovi asset, mano/oggetti/dorsi, riordino, calata e interruzioni.
  Build, test, misure PC/emulazione e peso passano. C0 aperta per touch fisico
  e accettazione umana interattiva; C1 non iniziata. Regole/server/catalogo/debug
  invariati. [Rapporto](../reports/client-c0-r2-report.md).

- **Versione 5 — 26 ottobre 2026, C0-R1:** consegnati nuovi mockup statici
  duello, FFA cinque e ispezione carta con tavolo sudicio illustrato, ventagli
  coperti, carte oggetto e testo su richiesta. Asset precedenti esclusi.
  Riaperto il confronto su richiesta: proposta PixiJS/TypeScript per la scena,
  React/HTML e Vite per la shell/build; nessuna dipendenza o codice migrato.
  Elaborati pronti, giudizio visivo in attesa; stop prima di R2 e C1.
  Regole, server e catalogo invariati. [Evidenze R1](../design/client-c0/r1/README.md).

- **Versione 4 — 26 ottobre 2026:** registrato il rifiuto della prima grafica
  e i feedback del proprietario: partita a carte in un bar marcio, tavolo
  sudicio a colori da fumetto, mano riordinabile e calata diretta con check,
  oggetti come carte sul tavolo e mani avversarie visibili coperte. Nuovi
  passaggi C0-R1–R5 e criteri di accettazione; Angular resta raccomandato,
  misure precedenti limitate alla vecchia scena. Solo piano/documentazione
  aggiornati, nessuna nuova UI o modifica a regole/API; C1 non iniziata.
- **Versione 3 — 26 ottobre 2026, C0:** autorizzazione esplicita al prototipo;
  checklist di parità, schizzi vettoriali, flussi di conferma/ripresa e scena
  Angular isolata con misure ripetibili. DOM/SVG confermato sul PC, nessun
  trigger Pixi. Accettazione C0 aperta per touch fisico e breve revisione
  umana; C1 non iniziata, nessuna modifica a regole/server/catalogo/debug.
- **Versione 2 — 26 ottobre 2026:** confronto tra web standard, ibrido PixiJS e
  motore Phaser; valutazione Angular/React senza obbligo di conservare lo stack,
  raccomandazione motivata, prova tecnica limitata in C0 e raccordo con C1/C3/C4,
  decisioni aperte e riuso futuro. Nessun prototipo avviato o regola modificata.
- **Versione 1 — 26 ottobre 2026:** prima roadmap, parità del client debug,
  direzione visiva e fonti asset, tappe C0–C5 e tre sessioni umane.

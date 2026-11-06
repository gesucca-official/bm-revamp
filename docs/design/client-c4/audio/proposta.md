# C4-7 — Proposta suoni, Fase A

6 novembre 2026. **Proposta da ascoltare e scegliere: nessun file audio è stato scaricato o aggiunto.** Il proprietario autorizzerà esplicitamente ogni download con nome, fonte e peso. Nessuna musica o ambiente. Le motivazioni sotto sono basate su nome, categoria e durata dichiarati dalla fonte: non ho ascoltato i campioni e non ne attribuisco qualità timbriche non verificate.

## Cinque candidati

Tutti di **Kenney, Interface Sounds 1.0 (2020), CC0 1.0**, [pagina del pacchetto](https://kenney.nl/assets/interface-sounds). Le pagine individuali sotto identificano l'autore e la licenza e offrono il pulsante **Play** per l'ascolto: aprirle e premere Play; non occorre scaricare. I nomi sono quelli della cartella `Audio` del pacchetto; i pesi sono quelli arrotondati dichiarati dalle pagine dei campioni, non misure locali. Il pacchetto su [OpenGameArt](https://opengameart.org/content/interface-sounds) è indicato come 100 OGG, CC0, circa 834,5 KB: se si autorizza il pacchetto intero va autorizzato quel download, anche se si copieranno solo i file scelti. Licenza inclusa da leggere dopo consenso. I nomi e i pesi esatti del pacchetto saranno verificati dopo il consenso; eventuale conversione per Safari/iOS sarà dichiarata e inventariata, non presunta necessaria senza prova.

| Evento | File proposto e ascolto | Formato; peso indicativo; durata | Motivo da verificare all'ascolto |
|---|---|---|---|
| Selezione della carta | [`click_001.ogg` — Click 001](https://instrictlogic.com/AssetLibrary/sounds/samples/click-001-9b145073/) | OGG; circa 5 KB; 0,097 s | Un click molto breve per una scelta frequente. |
| Invio della mossa | [`confirmation_001.ogg` — Confirmation 001](https://instrictlogic.com/AssetLibrary/sounds/samples/confirmation-001-77da72aa/) | OGG; circa 9 KB; 0,290 s | Candidato di conferma, distinto dal click; segnala il tentativo di invio, non l'accettazione. |
| Mossa rifiutata | [`error_001.ogg` — Error 001](https://instrictlogic.com/AssetLibrary/sounds/samples/error-001-8d6db65d/) | OGG; circa 7 KB; 0,162 s | Candidato di errore breve, senza affidargli il motivo del rifiuto. |
| Impatto | [`drop_004.ogg` — Drop 004](https://instrictlogic.com/AssetLibrary/sounds/samples/drop-004-7f8de79a/) | OGG; circa 7 KB; 0,284 s | Candidato breve per l'arrivo della prima carta; da giudicare se adatto al tavolo. |
| Esito | [`confirmation_002.ogg` — Confirmation 002](https://instrictlogic.com/AssetLibrary/sounds/samples/confirmation-002-54dec2b5/) | OGG; circa 14 KB; 0,539 s | Candidato distinto e un poco più lungo per la conclusione; unico anche per vittoria, sconfitta e pareggio, senza suggerire un risultato diverso dal testo. |

Totale indicativo **42 KB** sommando i pesi arrotondati, prima di eventuali conversioni; non è una misura di Size. La pagina del produttore dichiara CC0; le pagine individuali identificano gli stessi campioni e permettono il confronto senza scaricare. Il proprietario giudica anche se il suono di conferma sia appropriato per una sconfitta.

## Volume e menu

Proposta: **20%** iniziale, audio attivo; cursore 0–100% e pulsante/interruttore **Muto**, indipendente dal valore, con stato testuale e accessibile. Il ripristino dal muto conserva il volume scelto; 0% è silenzioso anche senza muto. Valori persistiti nel browser, lettura/scrittura protette: se lo storage non è disponibile restano validi per la sessione. Nessun suono di prova automatico modificando i controlli.

Nel menu esistente **«Al tavolo»**, subito sotto il titolo e prima delle istruzioni: etichetta «Volume suoni», cursore con valore percentuale, e «Muto» con stato esplicito. Così sono raggiungibili anche in alto nel pannello scorrevole, anziché dopo il testo lungo. Nessuna schermata nuova. Catture del menu attuale, senza controlli audio: [1366×768](menu-1366x768.jpg), [844×390](menu-844x390.jpg). Partita reale contro computer, Edge su PC, jar 1.11 della Fase 0, database temporaneo; seconda misura sulla stessa sessione con ridimensionamento. Le immagini mostrano il punto di inserimento, non un mockup del risultato.

## Agganci proposti e segni visivi

I punti sono proposte per la Fase B, non codice già implementato. `sound.ts` pre-caricherà solo file locali, assorbirà errori e promesse rifiutate, senza attendere l'audio sul percorso di input. I cinque segnali sono aggiuntivi ai segni già presenti:

| Evento | Punto di partenza previsto | Segno visivo già presente |
|---|---|---|
| Selezione | `scene.ts`, `TableScene.activate` e `move` chiamano `Model.select`; un unico ascoltatore `model.subscribe` in `table.tsx` confronta la chiave selezionata prima/dopo una notifica `choice` e suona solo quando diventa una carta diversa e non nulla. Copre tocco, click, tastiera e trascinamento senza suonare per focus, hover, riordino, bersaglio o ridisegno. | Carta sollevata con alone; messaggio «Scegli il bersaglio sul tavolo». |
| Invio | `session.ts`, `Session.submit` chiama `Model.confirm` che incrementa `commandCount` e pone `phase='sending'`; nell'ascoltatore di `table.tsx` rilevare un incremento del contatore per la partita, una volta sola, e accodare la riproduzione senza attendere o modificare `submit`/invio. Non equivale a conferma del server. | «Invio in corso», poi «Mossa ricevuta · In attesa» se accettata. |
| Rifiuto | `session.ts`, `Session.attach` riceve `illegalMove` e chiama `Model.reject`; `table.tsx` ascolta `feedback` emesso solo dal rifiuto quando la fase era `sending`, una volta per tentativo. Il successivo `requestView` non deve produrre altro audio. | Messaggio testuale «Rifiutata: …»; scelta ancora correggibile. |
| Impatto | `scene.ts`, `TableScene.beginSequence`, evento sulla coda `this.events` al primo `hit` effettivamente raggiunto in `T.moves`; non alla costruzione del piano né al ridisegno. Se è già previsto un esito in `T.outcome`, riservare a quest'ultimo l'unico suono della risoluzione. | Simbolo d'impatto sul bersaglio, onda o timbro «ANNULLATA» secondo la carta. |
| Esito | Nello stesso `beginSequence`, se `T.outcome` esiste, evento a `tailEnd` insieme al banner; mai un secondo suono d'impatto per quella risoluzione. | Banner «VITTORIA», «SCONFITTA» o «PAREGGIO» e pannello di esito con testo e motivo. |

**Regola 1:** la chiave `round.facts.key` (partita/turno) usata da `plays` e `seqSeen` delimita la risoluzione. Una guardia audio separata, consumata prima della riproduzione anche se muto o fallisce, permette **al massimo un suono totale tra impatto ed esito per chiave**; le viste ripetute, una seconda notifica, ridisegno o rientro non la riaprono. Se manca un impatto valido e non c'è esito, nessun suono. I suoni di selezione, invio e rifiuto sono eventi distinti dell'utente, non suoni della sequenza; il contatore comando identifica ciascun tentativo, e il rifiuto vale solo per quello ancora in invio.

**Salta effetti e interruzioni:** `skip()` chiama `finish('skip')`; `interrupt()` può chiamare `finish`, e `stopEffects()` svuota la coda. Ogni callback audio controllerà anche chiave e generazione della sequenza ancora attiva prima di suonare; salto, input che termina, interruzione, reset, disconnessione e distruzione annullano gli eventi pendenti e fermano eventuali riproduzioni della sequenza. Una normale fine (`finish('complete')`) non fa partire suoni residui; nessun recupero tardivo. Il passaggio a una carta successiva con `advance()` non deve riprodurre a raffica eventi attraversati: quelli saltati vengono scartati, non accumulati.

**Movimento ridotto:** `plays` oggi non avvia la sequenza con questa preferenza. Nessun suono di impatto/esito della sequenza in questo caso; riepilogo e pannello statici rimangono leggibili. Se la preferenza cambia durante una sequenza, l'interruzione elimina gli eventi pendenti. **Scheda in background:** `visibilitychange` interrompe la sequenza; niente audio e niente rigioco al ritorno. **Riconnessione:** `disconnect`, reset e viste recuperate/crossed non riproducono eventi storici; le nuove scelte esplicite dopo il rientro restano udibili. Per l'esito ricevuto senza sequenza, anche dopo riconnessione o salto, resta il pannello visivo senza suono tardivo.

**iOS:** sblocco richiesto da un gesto reale, senza attendere o ritardare l'azione; prima di tale gesto niente suono e nessuna coda da riprodurre dopo. Su iOS l'interruttore silenzioso prevale; comportamento e formato effettivi sono da provare su dispositivo, non dedotti da Edge. File mancanti, autoplay negato e errori di riproduzione restano silenziosi e non alterano partita, input o clock. Muto ferma anche i suoni in corso e scarta quelli pendenti; riattivare non recupera eventi passati.

## Dopo la scelta

Registrare le parole del proprietario e i singoli file, fonti e pesi autorizzati prima di scaricare. Solo allora eseguire la Fase B, inventario con impronte e verifiche previste dal piano. Restano da giudicare in partita vera volume, suoni scelti e possibile fastidio nelle FFA lunghe; iPhone, Safari, interruttore silenzioso e latenza percepita non sono verificati in questa fase.

# C4-5b — Proposta storica della Fase A

**Aggiornamento dopo la scelta:** A comune/editor/admin e B di calata, con invito unico senza targhette. [Scelte](scelte.md), [implementazione e verifiche](../../../reports/client-c4-report.md#fase-b--esiti-finali-e-cosa-giudicare). Questo documento conserva la base/proposta di Fase A.
5 novembre 2026. **Solo Fase A. Nessun token definitivo, nessuna modifica funzionale o visiva di produzione.** [Inventario](inventario.md), [censimento integrale](censimento.md), [prima odierno](../../../reports/client-c4/c4-5b/prima/README.md). [Riserve umane C0 B3 e B6](../../../reports/client-c0-r5-procedure.md#esiti): lettura/dettaglio e aspetto di bound, check e annulla da rifinire. [Parità da conservare](../../../client-c0-parity.md). Font soltanto Impact/Arial; forme dei segni da `symbols.ts`, cornici da `frames.ts`; nessun asset nuovo, dipendenza remota o download.

## Scelte visive

Le immagini delle [varianti](proposte/README.md) sono schermate vere del client: stesso server locale, database temporaneo, stesso mazzo e stessa fase di scelta. Una sovrapposizione temporanea nel browser mostra i trattamenti; rimossa dopo ogni cattura. Non è una build implementata, non prova la raggiungibilità futura. La geometria Pixi e i box C4-2 di conferma non cambiano. Le misure prima sono quelle del client distribuito invariato.

| Tema | A — Carta e filetto (raccomandata) | B — Comandi più marcati |
|---|---|---|
| Pulsante normale | Carta calda `#e8d7b4`, bordo scuro 2 px e ombra già esistente; hover carta più chiara `#f4e7cd`. | Carta chiara `#f6ecd8`, bordo scuro, senza ombra sui comandi. |
| Primario e selezionato | Primario salvia esistente `#9ec5bd`. Selezionato con filetto/outline e indicatore di selezione visibile, oltre ad aria-pressed/checked/selected già esistenti. | Primario petrolio `#38616a` con testo `#fff6e2`; selezionato con segno o filetto interno, oltre al fondo pieno. |
| Premuto (`:active`) | Ombra accorciata e filetto interno, senza spostare il controllo né il contenuto: feedback anche senza colore. | Filetto interno più spesso, nessuna traslazione e stessi box. |
| Disabilitato | Fondo readonly esistente `#e3d3b2`, testo `#5a4232`, bordo tratteggiato, niente ombra, opacità piena. Motivo vicino al controllo quando già presente (es. mancanze del mazzo), attributo disabled conservato. | Stessa logica di forma/testo, usando il fondo chiaro degli altri comandi. Non si attenua l’intera scheda. |
| Errore e azione distruttiva | Errore sempre testo esplicito e bordo bordeaux `#742e33`; pulsante distruttivo rosa esistente `#d9a3a0`, verbo completo e conferma già presente. | Errore identico; distruttivo bordeaux pieno e testo chiaro, stesso verbo e conferma. |
| Focus | Tratto 3 px, offset 3, con tinta contestuale esistente: petrolio `#38616a` sul foglio, turchese chiaro `#8cdbdd` sul tavolo. Dentro le metà della conferma resta offset interno per evitare ritagli. | Stesso sistema; nessun affidamento alla sola variazione del fondo. |
| ✓ e × | Stesse forme di `symbols.ts`, stessa divisione alta/bassa C4-2. Dischi con contorno chiaro; etichette **Conferma** e **Annulla**, già accessibili e rese anche visibili. Disabilitato: disco neutro con contorno tratteggiato. | ✓ in riquadro arrotondato, × in disco; etichette visibili. Differenza di forma anche in grigio. Metà carta più opache/chiare: maggior copertura dell’illustrazione. |
| Scarto della bound | Testo di richiesta già esistente conservato. Piccola targhetta **Scartabile** sulla parte esposta di ciascuna candidata soltanto finché manca lo scarto; contorno semplice. Non scartabili restano attenuate e nominate come tali. Dopo scelta sparisce la targhetta, il testo riepiloga lo scarto scelto. | Targhetta **Scarta**, contorno tratteggiato. È più imperativa e affollata; non deve diventare un pulsante aggiuntivo. Stesse candidate, stessi tocchi e modello. |
| Catalogo/editor | Fogli chiari esistenti `#f6ecd8`, bordi `#9b7652`, slot `#efe0c2`. Gerarchia sobria: Impact solo nei titoli già previsti, nomi carte e campi in Arial; simboli e cornici C4-3/C4-4 integri. Nessuna riduzione di testo. | Slot più simili al foglio principale `#e8d7b4`, separatori `#b99772`; primari pieni. Più contrasto fra comandi e contenuto, maggiore peso dei comandi rispetto alle carte. |
| Amministrazione | Stessi pannelli chiari dell’editor e distruttivi rosa; conteggi e domande esplicite; elenco e azioni restano nelle posizioni attuali. | Stesso foglio, comandi petrolio/bordeaux pieni, pannelli con bordi più quieti. Il bordeaux ha più peso anche quando non c’è un errore. |

**Raccomandazione: A per pulsanti e schermate sobrie; A per ✓/× e scarto.** Conserva l’identità già approvata e lascia leggere meglio la carta in anteprima. I segni sono diversi, i verbi chiariscono l’azione e il tratteggio distingue la disabilitazione senza richiedere il colore (regola 11). B è utile se il proprietario preferisce azioni più nette: offre una vera differenza di sagoma fra conferma e annullamento, con più peso visivo. Si possono scegliere separatamente il sistema generale e i controlli di calata.

Le targhette sullo scarto sono una proposta, non un cambiamento a O26: non si spostano mano/anteprima/candidate né si riaprono O26/O27. In Fase B la resa deve restare nella parte visibile già esistente, senza modificare `readability.ts`, la geometria di `scene.ts` o `background.ts`. Se non resta leggibile senza intervenire su quei box, si conserva il messaggio testuale esistente e si sottopone il limite; nessuna nuova geometria è autorizzata. Il nome della carta scartata è già nel riepilogo della mossa, non viene rinominato.

## Token proposti, ancora da approvare

La tabella è una mappa per il futuro `:root`, **non una definizione applicata**. Parte esclusivamente dai colori già presenti e dal fondo caldo C4-5a. Nomi da rendere definitivi dopo la scelta. Varianti alfa restano distinte quando il loro ruolo visivo è diverso, usando token di superficie/ombra; niente sostituzione cieca di tutti i marroni o di tutti i verdi.

| Token proposto | Valore esistente / derivazione conservata | Destinazione |
|---|---|---|
| `--bg-page`, `--bg-portrait` | `#38271f`, `#38271ff5` | Fondo caldo e richiesta di rotazione; fotografia e sprite invariati. |
| `--bg-sheet` | `#e8d7b4` | Fogli, dialoghi, pulsanti base A, esito. |
| `--bg-panel` | `#f6ecd8` | Input, carte catalogo/editor, pannelli admin e note. |
| `--bg-slot` | `#efe0c2` | Sezioni editor e testate tabella. |
| `--bg-hover` | `#f4e7cd` | Hover comandi base. |
| `--bg-readonly`, `--bg-disabled` | `#e3d3b2` | Campo readonly e controllo disabilitato. |
| `--text`, `--text-muted` | `#30231e`, `#5a4232` | Testo principale e secondario. |
| `--text-detail` | `#3e2e24` | Righe del riepilogo: conservato, non fuso col testo principale. |
| `--text-on-dark` | `#fff6e2` | Conferma/annulla e comandi pieni B. |
| `--text-table` | `#f1e3c7` | Clock e turno: conservato sul fondo fotografico. |
| `--accent`, `--accent-strong`, `--accent-hover` | `#9ec5bd`, `#38616a`, `#4d7d86` | Primario A, filetti/focus sul foglio, hover della (i). |
| `--selected-card` | `#cfe3dd` | Carta scelta negli slot, distinto dal primario. |
| `--positive`, `--error`, `--danger-bg` | `#2c6262`, `#742e33`, `#d9a3a0` | Esito buono/link, errore/titolo, azione distruttiva A. |
| `--focus-paper`, `--focus-table` | `#38616a`, `#8cdbdd` | Focus coerente per superficie, stessa forma. Non si promette contrasto formale prima di C4-8a. |
| `--focus-hit-veil` | `#7dbaba22` | Velo semantico esistente; il contorno `#c0ffff` viene proposto come `--focus-table #8cdbdd`, cambiamento esplicito di stato, non fusione silenziosa. |
| `--border`, `--border-sheet`, `--border-control` | `#b99772`, `#6e4b34`, `#4d3628` | Separatore, foglio, pulsante. |
| `--border-panel`, `--border-soft`, `--border-faint` | `#9b7652`, `#9b765288`, `#9b765255` | Campi/slot, pannelli, righe presenza. |
| `--hint-bg`, `--hint-border`, `--hint-text` | `#1d140fd9`, `#b18c60`, `#f4e8d1` | Hint sopra fotografia: testo conservato per prudenza. |
| `--warning-text`, `--pending-text`, `--empty-text` | `#ffe7b0`, `#bfe6df`, `#8a6f58` | Stati con testo esplicito e posti liberi. |
| `--tip-bg` | `#f1e4c4` | Tooltip stato: conservato, non assimilato ai pannelli. |
| `--overlay`, `--dialog-backdrop` | `#140c08a8`, `#140c08a0` | Linea caduta e dialogo: due opacità deliberate. |
| `--shadow-control`, `--shadow-sheet`, `--shadow-modal`, `--shadow-card` | `#20160c66`, `#20160c88`, `#0009`, `#30231e55` | Ombre esistenti per profondità diverse. |
| `--shadow-brand`, `--shadow-table-text` | `#2e1e14`, `#20130e` | Testo sul tavolo: conservati. |
| `--sheet-inset`, `--toast-bg`, `--confirm-bg` | `#e8d7b440`, `#e8d7b4f2`, `#1d140f26` | Superfici con alfa esistente. |
| `--ask-accent` e opacità | `#6eafaf`, `#6eafaf00`, `#6eafafaa`, `#6eafaf99` | Richiesta di scarto e animazione esistente; ridotto movimento conserva il segno statico. |
| `--confirm-yes/no`, `--confirm-yes/no-hover`, `--confirm-disc-yes/no` | `#2c62621f`/`#742e331f`, `#2c626240`/`#742e3340`, `#2c6262e6`/`#742e33e6` | Tinte delle due metà e dischi, senza cambiare box. |
| `--confirm-divider`, `--confirm-disabled`, `--round-hover` | `#f6ecd8b3`, `#5d5247b3`, `#f6ecd814` | Separatore e testo disabilitato, disco disabilitato, carte round. |
| `--art-placeholder` | `#c9b48c` | Ripiego dell’atlante: nessun nuovo asset. |
| `--symbol-paper`, `--damage-hit`, `--damage-cut`, `--damage-poison` | `#f6efd9`, `#a3313d`, `#4d6070`, `#5f8a1f` | Bollini HTML: mantenuti rispetto a C4-3, non fusi con superfici generiche. |
| `--font-title`, `--font-body` | `Impact, Arial, sans-serif`; `Arial, sans-serif` | Soltanto i due caratteri di D4, senza caricamenti o font nuovi. |

`transparent`, `currentColor`, `none` e colori SVG calcolati dalle costanti condivise non sono una palette parallela. Il futuro test del sorgente distinguerà `style.css` (colori solo in `:root`) dalle eccezioni esplicite: disegno Pixi in `scene.ts`, costanti di risorse/danni/ruoli in `readability.ts`, `symbols.ts` e cornici in `frames.ts`, conversione numerica condivisa in `ui.tsx`. Nessun codice di geometria verrà modificato per superare il test.

## Quasi duplicati: fusioni proposte e differenza visiva

Calcolo indicativo in sRGB/D65, distanza CIE76 fra tinte piene, non una verifica di contrasto e non una prova sul display del proprietario. Una distanza piccola suggerisce somiglianza, non garantisce indistinguibilità. Calcolo temporaneo fuori dal repository.

| Origine → proposta | Delta canale RGB massimo | ΔE76 | Valutazione e decisione proposta |
|---|---:|---:|---|
| `#ead8b4` → `#e8d7b4` | 2/255 | 0,77 | Testo della rotazione quasi uguale alla carta: **fondere**, differenza attesa minima. |
| `#f3e8d5` → `#f6ecd8` | 4/255 | 1,44 | Fondo del pre negli strumenti appena più chiaro: **fondere**, lieve differenza affiancando. |
| `#f6efd9` → `#f6ecd8` | 3/255 | 1,67 | Simile, ma appartiene ai bollini C4-3: **conservare** la tinta del sistema simboli. |
| `#f4e8d1` → `#f6ecd8` | 7/255 | 2,20 | Simile, ma è testo sopra fotografia: **conservare** finché il contrasto non è misurato. |
| `#f1e3c7` → `#f6ecd8` | 17/255 | 5,42 | Clock/turno visibilmente più chiari: **non fondere**. |
| `#f1e4c4` → `#f6ecd8` | 20/255 | 6,97 | Tooltip sensibilmente meno giallo: **non fondere**. |
| `#3e2e24` → `#30231e` | 14/255 | 6,44 | Dettaglio del report più scuro: **non fondere** senza motivo. |
| `#c0ffff` → `#8cdbdd` | 52/255 | 14,17 | Focus semantico meno luminoso: cambio visibile, **non è un quasi duplicato**. La coerenza del focus è una scelta di stato, da verificare sul tavolo. |
| `#6eafaf` → `#38616a` | 78/255 | 30,24 | Molto più scuro: **non fondere** come duplicati. Petrolio sul foglio è la proposta esplicita di focus; ask conserva il turchese esistente. |

Le opacità `a0`/`a8`, `66`/`88`, `1f`/`40`/`e6` non sono errori: si conservano per profondità, hover e stato. Due soli quasi duplicati vengono proposti per fusione; tutto il resto diventa un nome di ruolo o resta una costante grafica condivisa. Nessuna nuova palette.

## Passo successivo, solo dopo scelta

Confermare sistema A/B generale e A/B di calata/scarto; le due fusioni sono parte della proposta A raccomandata. Poi Fase B nei gruppi di commit richiesti, controllo sorgente e controlli touch 44 px con eccezioni D8 elencate, stessi testi/selettori dei verificatori. Matrice C4-5b: Test/Build/Size, Verify/Modes/Lifecycle/Ffa/Decks/Public/Profile/Layout alle due misure; Verify/Layout a 750×292 con base invariata. Nessuna funzione viene tolta, l’editor mantiene la struttura. Contrasto formale a C4-8a; iPhone/Safari non provati. Il blocco C4-5b non si dichiara fatto alla fine della Fase A.

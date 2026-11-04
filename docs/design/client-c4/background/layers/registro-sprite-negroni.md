# C4-5a-layers — Registro sprite-negroni

4 novembre 2026. Risultato non approvato né integrato. Operatore Codex, modello agente gpt-6.1-sol. Struttura tratta dal modello registro-generazione.md, rimasto invariato. Richiesta effettiva in richieste-generazione.json; dati e SHA-256 in metadati-file.json. Termini e condizioni **da verificare dal proprietario**.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | sprite-negroni; cinque schede di questa consegna in layers/. |
| Operatore della generazione | Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | Nel PNG osservata stringa softwareAgent ChatGPT / gpt-image. Il risultato della chiamata non dichiara un modello numerico. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 2026-11-04 18:02:31 UTC — 2026-11-04 18:03:02 UTC; UTC; Europe/Rome = UTC+01:00. |
| Identificativo del job / sessione, se esposto | exec-b93df220-9341-4794-84f4-4c4d70193a2e (nome del file restituito). |
| Commit contenente il prompt prima della generazione | 61b5bf2ef675cf79c4d6793f69c3b3be4a857b85 |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-sprite-negroni.md, commit sopra. |
| Prompt scelto: A oppure B (o revisione già committata) | Prompt sprite-negroni, una chiamata. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Rigenerazione isolata dal ritaglio deterministico H1. Nessun modello di terzi per ritaglio o chiave. |
| Dimensioni e formato richiesti | PNG opaco quadrato 1024×1024 su fondo saturo; restituito 1254×1254. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato per chiamata; qualità/stile nel prompt. Forza numerica e qualità numerica non esposte dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; un solo referenced_image_paths, allegato indicato sotto; num_last_images_to_include omesso. |

Il commit preventivo indicato nella tabella contiene il testo letterale e precede questa chiamata. Le richieste effettive e i loro orari sono conservati in richieste-generazione.json. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Testo integrale effettivamente inviato, identico al blocco del documento committato. Vincoli e negativi sono nello stesso campo.

Testo principale:

~~~text
Use the attached crop from the project's H1 image as the ONLY reference. Recreate EXACTLY the same illustrated object: the red-orange Negroni in its low unbranded faceted glass, together with the ONE stained ivory coaster directly underneath the glass as a single connected prop group. Preserve the ice, restrained orange garnish, glass facets, drink level, warm highlights, camera angle and small stains on its coaster. Make the glass slightly opaque so its facets and pale highlights remain readable on light, dark and wooden backgrounds. Do NOT make the green key background visible through the glass; no green reflections. Remove all surrounding wood, table edge and unrelated stains. No second empty coaster.

Isolate this object at the center of one square opaque PNG, requested 1024 x 1024 pixels. Use a perfectly flat, uniform, single-color pure saturated green #00FF00 (RGB 0,255,0) background, from edge to edge. That saturated key color is not part of the object. No gradient, texture, vignette, floor, tabletop, border or color variation in the background. Leave a wide clear margin of at least 15 percent on all four sides around the entire object. Do not clip any part of the regenerated object.

Keep the reference's hand-inked comic character, identical above-and-side viewpoint, camera angle, orientation, warm light, rich but not excessively orange colors, material and exact worn/chipped/stained/empty state. Preserve natural proportions. Do not rotate it into a new view, stylize it differently, clean it up, add new details or redesign it. The object itself may have its own material shading, but there must be NO CAST SHADOW, contact shadow, glow or reflection on the flat key background.

One isolated object group only, no additional props. No text, numbers, brands, logos, signature, watermark, people, hands, cards, tokens or interface. No external imagery.
~~~

Campo negativo separato, se usato:

Non usato: vincoli nel testo principale.


| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Unico campo prompt, vincoli e negativi inclusi. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna aggiunta al testo salvato. Tutti i parametri espliciti in richieste-generazione.json. Contesto interno del servizio non esposto dallo strumento. |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | non esposto dallo strumento |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | Nessuna; confronto letterale fra documento e stringa inviata coincidente. |

## Riferimenti effettivamente allegati

Riferimento effettivo di questa chiamata, secondo il compito C4-5a-layers. Nessun altro file allegato.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| 1 | docs/design/client-c4/background/layers/riferimenti/negroni-H1.png | ed56aab268ed2d973ecacd8e8ef8c5eb2e16f7555a975780596f589722efdaa6 | Unico riferimento dell’oggetto | Ritaglio sharp 0.35.5 da H1; rettangolo in geometria-riferimenti.json |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | Per questa consegna il proprietario autorizza H1 e i suoi ritagli. H1 coincidente con c8729f36a25cadfff882d090cf9d2c2058bd57c8c7d085af83d26fdeb7d778f8; ritagli identificati in geometria-riferimenti.json e nella tabella sotto. |
| Conferma dell'operatore: nessuna immagine da Internet, dai quattro giochi o da asset respinti | Confermato: solo H1 o il suo ritaglio, nessuna immagine esterna. |
| Altri input effettivi / dichiarazione esplicita di assenza | Nessun altro allegato. |

Se il servizio ha modificato gli allegati internamente e lo espone, annotarlo. Non inventare l'hash di una trasformazione interna non accessibile. Nessun riferimento esterno diventa ammesso perché il suo uso è stato annotato.

## Termini d'uso e provenienza esposta

| Campo | Valore da compilare |
|---|---|
| Titolo e URL dei termini applicabili allo strumento usato | non verificato — da verificare dal proprietario |
| Versione / data dei termini | non verificato — da verificare dal proprietario |
| Data di consultazione | non verificato — da verificare dal proprietario |
| Piano/account o condizioni specifiche rilevanti, senza dati riservati | non verificato — da verificare dal proprietario |
| Riferimento alla copia/evidenza dei termini consultati | non verificato — da verificare dal proprietario |
| Condizioni dichiarate per uso dell'output e distribuzione nel progetto | non verificato — da verificare dal proprietario |
| Restrizioni o attribuzioni richieste dallo strumento | non verificato — da verificare dal proprietario |
| C2PA presente/esposto, assente o non verificato | Presente nel PNG originale; firma, certificati e validità crittografica non verificati. |
| Strumento e versione usati per leggere C2PA | Node 24.13.0, ricerca delle stringhe nel PNG; non un validatore C2PA. |
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Originale sprite-negroni-fondo.png: c2pa.actions.v2 e stringa ChatGPT / gpt-image osservati; altri dettagli non verificati. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Tool restituisce image_url/output_hint; nome generico letto nel PNG. Derivati prodotti da sharp non conservano C2PA; originale invariato conserva i metadati. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | non verificato — da verificare dal proprietario |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-b93df220-9341-4794-84f4-4c4d70193a2e.png |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/layers/sprite-negroni-fondo.png; copia invariata e rinominata. Percorso automatico in richieste-generazione.json. |
| SHA-256 dell'originale scaricato | 6055563532a37582ad5175f1699443520378545b0faebd37407f52bb6c105818 |
| Formato, larghezza×altezza effettive, byte | PNG, 1254×1254, 1834871 byte. |
| Trasparenza / profilo colore, se verificati | Originale senza alfa (letto da sharp). Profilo colore del processo di generazione non verificato. |
| Data di ricezione del file | 2026-11-04 18:03:02 UTC (fine chiamata). |
| Eventuali altri output dello stesso tentativo e loro identificazione | Nessun altro originale. Anteprime solo per revisione, elencate in metadati-file.json. |

D11 richiede la sorgente tracciata per lo sfondo. Conservare nel blocco successivo l'originale generato, non solo una cattura o la derivata compressa; registrare una rinomina senza presentarla come nuova generazione.

## Modifiche e derivati (da compilare nell'integrazione)

Chiave colore con stima alfa e soglia 0,12; rimozione spill; componente connessa maggiore; estensione RGB 2 px; feather binomiale 3×3 raggio 1 px; ritaglio all’alfa con margine 3 px. sharp 0.35.5/libvips 8.18.7, nessun modello. Sprite negroni.png, 834×962, SHA-256 8c31f7a5385dcff7e9fc3a7246c7bf8e58bca667ebc484b97a99645fd4ab45c5. Dettagli e trim in misure.json. Ombre non incorporate nello sprite, aggiunte solo dal codice nelle anteprime.



| Passo | File di ingresso e SHA-256 | Operazione e parametri esatti | Strumento e versione | File di uscita e SHA-256 | Dimensioni / byte |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

Registrare separatamente: eventuale ritaglio permanente con rettangolo x/y/larghezza/altezza in pixel del sorgente; eventuali ritocchi; ridimensionamento con filtro; compressione WebP con qualità, modalità e gestione dei metadati; ogni file intermedio conservato. Se non si effettua ritaglio permanente, dichiararlo.

| Campo | Valore da compilare |
|---|---|
| File finale distribuito e SHA-256 | |
| Parametri del ritaglio dinamico del renderer / collegamento alla specifica adottata | |
| Risultati del calcolo alle tre misure con le dimensioni finali | |
| Voce dell'inventario aggiornata / commit d'integrazione | |
| Collegamento alle evidenze e ai risultati delle verifiche successive | |

Il cover dinamico non modifica i byte della WebP e non va confuso con un ritaglio eseguito sul file.

## Giudizio del proprietario

| Campo | Valore da compilare |
|---|---|
| Data e autore del giudizio | |
| File / hash della variante giudicata | |
| Contesto: originale isolato, proposta sul tavolo, integrazione finale | |
| Sedute consumate e spaiate, senza eleganza (O2) | |
| Continuità con palette, legno, luce, composizione e identità R1 | |
| Assenza di testo, marchi, persone, carte e interfaccia nel bitmap | |
| Esito sui ritagli 1366×768 / 844×390 / 750×292 | |
| Leggibilità con posti, mano, pile e scritta sovrapposti | |
| Giudizio su desktop; eventuale iPhone e limiti dichiarati | |
| Esito: approvata / da correggere / respinta | |
| Motivazione e correzioni richieste | |
| Riferimento al messaggio o evidenza del giudizio | |

L'approvazione della sola immagine non chiude l'integrazione né sostituisce il giudizio sul tavolo vero. Il registro completo accompagna inventario ed evidenze, secondo la [checklist](checklist-integrazione.md).

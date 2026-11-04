# C4-5a-layers — Registro sprite-negroni

4 novembre 2026. Scelto per l’integrazione C4-5a secondo la modalità S; giudizio sul tavolo vero ancora da dare. Operatore Codex, modello agente gpt-6.1-sol. Struttura tratta dal modello registro-generazione.md, rimasto invariato. Richiesta effettiva in richieste-generazione.json; dati e SHA-256 in metadati-file.json. Termini forniti dal proprietario: «quelli delle immagini generate da te»; dettagli non verificati restano dichiarati sotto.

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
| Titolo e URL dei termini applicabili allo strumento usato | non verificato; il proprietario indica «quelli delle immagini generate da te» |
| Versione / data dei termini | non verificato |
| Data di consultazione | non verificato; dichiarazione di consultazione ricevuta il 4 novembre 2026 |
| Piano/account o condizioni specifiche rilevanti, senza dati riservati | non verificato |
| Riferimento alla copia/evidenza dei termini consultati | [Dichiarazione testuale del proprietario](decisione-proprietario.md), 4 novembre 2026; nessuna copia dei termini fornita |
| Condizioni dichiarate per uso dell'output e distribuzione nel progetto | «quelli delle immagini generate da te» (fonte: proprietario, messaggio C4-5a del 4 novembre 2026); condizioni specifiche non verificate |
| Restrizioni o attribuzioni richieste dallo strumento | non verificato |
| C2PA presente/esposto, assente o non verificato | Presente nel PNG originale; firma, certificati e validità crittografica non verificati. |
| Strumento e versione usati per leggere C2PA | Node 24.13.0, ricerca delle stringhe nel PNG; non un validatore C2PA. |
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Originale sprite-negroni-fondo.png: c2pa.actions.v2 e stringa ChatGPT / gpt-image osservati; altri dettagli non verificati. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Tool restituisce image_url/output_hint; nome generico letto nel PNG. Derivati prodotti da sharp non conservano C2PA; originale invariato conserva i metadati. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | Diritti riservati del progetto (CONTRIBUTING.md); termini d’uso «quelli delle immagini generate da te», forniti dal proprietario il 4 novembre 2026 (background/layers/decisione-proprietario.md e registro). Titolo, URL, versione, restrizioni e attribuzioni specifiche non verificati; nessuna esclusività dell’output dichiarata. |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. Il proprietario dichiara di aver consultato i termini e fornisce la frase sopra; la presente integrazione non ne deduce dettagli ulteriori.

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
| WebP C4-5a | negroni.png, `8c31f7a5385dcff7e9fc3a7246c7bf8e58bca667ebc484b97a99645fd4ab45c5` | Nessun resize/crop; filtro nessuno; WebP lossy q=80, alphaQuality=100, effort=6, smartSubsample=true, preset=default; metadati/C2PA rimossi dal derivato | Node 24.13.0; sharp 0.35.5; libvips 8.18.7; libwebp 1.6.0 | `client-web/public/art/negroni.webp`, `f718a05da027b7b059ff8e51ad2946ae50d07aca759da18b235bc48b91031fc0` | 834×962; 126188 B |

Registrare separatamente: eventuale ritaglio permanente con rettangolo x/y/larghezza/altezza in pixel del sorgente; eventuali ritocchi; ridimensionamento con filtro; compressione WebP con qualità, modalità e gestione dei metadati; ogni file intermedio conservato. Se non si effettua ritaglio permanente, dichiararlo.

| Campo | Valore da compilare |
|---|---|
| File finale distribuito e SHA-256 | `client-web/public/art/negroni.webp` — `f718a05da027b7b059ff8e51ad2946ae50d07aca759da18b235bc48b91031fc0` |
| Parametri del ritaglio dinamico del renderer / collegamento alla specifica adottata | [Modalità S](NOTA.md#formule-proposte-e-simulazioni), scelta il 4 novembre 2026: piano W×H; centri proporzionali; sprite uniformi; taglio solo ai bordi della scena |
| Risultati del calcolo alle tre misure con le dimensioni finali | [Piano e limiti](../../../../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2); test background.test.ts; geometria finale nel rapporto |
| Voce dell'inventario aggiornata / commit d'integrazione | [inventory.json](../../assets/inventory.json), C4-5a (stesso commit di questa scheda) |
| Collegamento alle evidenze e ai risultati delle verifiche successive | [Rapporto C4-5a](../../../../reports/client-c4-report.md#c4-5a--integrazione-dello-sfondo-del-tavolo-o2); [conversione e hash](../../../../reports/client-c4/c4-5a/conversione.json) |

Il cover dinamico non modifica i byte della WebP e non va confuso con un ritaglio eseguito sul file.

## Giudizio del proprietario

| Campo | Valore da compilare |
|---|---|
| Data e autore del giudizio | 4 novembre 2026, proprietario (messaggio C4-5a) |
| File / hash della variante giudicata | Simulazione S-piano2 di layers/NOTA.md; sorgente scelta `negroni.png`, `8c31f7a5385dcff7e9fc3a7246c7bf8e58bca667ebc484b97a99645fd4ab45c5`; integrazione finale non ancora giudicata |
| Contesto: originale isolato, proposta sul tavolo, integrazione finale | Simulazione S-piano2, prima dell’integrazione sul tavolo vero |
| Sedute consumate e spaiate, senza eleganza (O2) | non fornito per il tavolo vero |
| Continuità con palette, legno, luce, composizione e identità R1 | non fornito per il tavolo vero |
| Assenza di testo, marchi, persone, carte e interfaccia nel bitmap | non fornito per il tavolo vero |
| Esito sui ritagli 1366×768 / 844×390 / 750×292 | non fornito per il tavolo vero |
| Leggibilità con posti, mano, pile e scritta sovrapposti | non fornito per il tavolo vero |
| Giudizio su desktop; eventuale iPhone e limiti dichiarati | non fornito per il tavolo vero |
| Esito: approvata / da correggere / respinta | Scelta per l’integrazione in modalità S; giudizio sul tavolo vero ancora da dare |
| Motivazione e correzioni richieste | Il proprietario ha giudicato la simulazione S-piano2 la migliore; piano stirato e tre sprite uniformi, centri proporzionali |
| Riferimento al messaggio o evidenza del giudizio | [Istruzione del proprietario](decisione-proprietario.md) |

L'approvazione della sola immagine non chiude l'integrazione né sostituisce il giudizio sul tavolo vero. Il registro completo accompagna inventario ed evidenze, secondo la [checklist](../checklist-integrazione.md).

# C4-5a-layers — Registro piano-2

4 novembre 2026. Scelto per l’integrazione C4-5a secondo la modalità S; giudizio sul tavolo vero ancora da dare. Operatore Codex, modello agente gpt-6.1-sol. Struttura tratta dal modello registro-generazione.md, rimasto invariato. Richiesta effettiva in richieste-generazione.json; dati e SHA-256 in metadati-file.json. Termini forniti dal proprietario: «quelli delle immagini generate da te»; dettagli non verificati restano dichiarati sotto.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | piano-2; cinque schede di questa consegna in layers/. |
| Operatore della generazione | Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | Nel PNG osservata stringa softwareAgent ChatGPT / gpt-image. Il risultato della chiamata non dichiara un modello numerico. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 2026-11-04 17:59:13 UTC — 2026-11-04 17:59:43 UTC; UTC; Europe/Rome = UTC+01:00. |
| Identificativo del job / sessione, se esposto | exec-60721f30-b121-4812-b244-3712399d5e02 (nome del file restituito). |
| Commit contenente il prompt prima della generazione | 715c1825b2622e0f4edb93947373792a7d06b2a4 |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-piano.md, commit sopra. |
| Prompt scelto: A oppure B (o revisione già committata) | Prompt piano, invariato tra due chiamate. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Modifica di H1 con rimozione dei tre gruppi. |
| Dimensioni e formato richiesti | PNG opaco 2006×784, stesse proporzioni H1. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato per chiamata; qualità/stile nel prompt. Forza numerica e qualità numerica non esposte dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; un solo referenced_image_paths, allegato indicato sotto; num_last_images_to_include omesso. |

Il commit preventivo indicato nella tabella contiene il testo letterale e precede questa chiamata. Le richieste effettive e i loro orari sono conservati in richieste-generazione.json. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Testo integrale effettivamente inviato, identico al blocco del documento committato. Vincoli e negativi sono nello stesso campo.

Testo principale:

~~~text
Edit the FIRST and only attached image, H1.png, as the exact base. Remove ONLY these three decorative object groups: (1) the separate EMPTY stained ivory coaster overhanging the near left table edge, (2) the red Negroni glass together with its own coaster on the right, and (3) the chipped green ashtray with its cigarette ends on the left. Remove the associated local object contact shadows and reconstruct the material immediately behind each group. Keep the unrelated glass rings, stains and peripheral grime that already belong to the tabletop.

Where the glass and ashtray were, reconstruct continuous walnut grain, scratches, warm reflections and the tabletop surface matching their surrounding pixels. Where the empty overhanging coaster was, reconstruct BOTH the continuous curved wooden table rim with consistent thickness AND the dark space beneath it. The edge must remain a plausible single continuous curve, not a patch of wood extending into the dark area. Do not leave object fragments, outlines, ghost shadows or circular cutout scars.

Do not change anything else: identical framing, composition, table silhouette and proportions, viewpoint, fixed burgundy booths, extremely shallow strip of room above the table, wood grain outside the removal areas, colors, light, contrast, saturation and hand-inked comic style. No new props, no stools, no people, no cards, no interface, no lettering, logos or watermarks. Do not repaint or recolor the entire image. Preserve the original aspect ratio of H1, 2006 x 784, with no stretching or crop. Request one opaque PNG of the same composition and proportions, 2006 x 784 pixels if supported. No transparency.
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
| 1 | docs/design/client-c4/background/candidati/H1.png | c8729f36a25cadfff882d090cf9d2c2058bd57c8c7d085af83d26fdeb7d778f8 | Base da modificare | Nessuna |

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
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Originale piano-2.png: c2pa.actions.v2 e stringa ChatGPT / gpt-image osservati; altri dettagli non verificati. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Tool restituisce image_url/output_hint; nome generico letto nel PNG. Derivati prodotti da sharp non conservano C2PA; originale invariato conserva i metadati. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | Diritti riservati del progetto (CONTRIBUTING.md); termini d’uso «quelli delle immagini generate da te», forniti dal proprietario il 4 novembre 2026 (background/layers/decisione-proprietario.md e registro). Titolo, URL, versione, restrizioni e attribuzioni specifiche non verificati; nessuna esclusività dell’output dichiarata. |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. Il proprietario dichiara di aver consultato i termini e fornisce la frase sopra; la presente integrazione non ne deduce dettagli ulteriori.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-60721f30-b121-4812-b244-3712399d5e02.png |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/layers/piano-2.png; copia invariata e rinominata. Percorso automatico in richieste-generazione.json. |
| SHA-256 dell'originale scaricato | 5597b4cfc7c0cfe9660286f5f54002db3b0979c4dae7aa7ed5d4b0f36d225320 |
| Formato, larghezza×altezza effettive, byte | PNG, 2006×784, 2414884 byte. |
| Trasparenza / profilo colore, se verificati | Originale senza alfa (letto da sharp). Profilo colore del processo di generazione non verificato. |
| Data di ricezione del file | 2026-11-04 17:59:43 UTC (fine chiamata). |
| Eventuali altri output dello stesso tentativo e loro identificazione | Nessun altro originale. Anteprime solo per revisione, elencate in metadati-file.json. |

D11 richiede la sorgente tracciata per lo sfondo. Conservare nel blocco successivo l'originale generato, non solo una cattura o la derivata compressa; registrare una rinomina senza presentarla come nuova generazione.

## Modifiche e derivati (da compilare nell'integrazione)

Originale lasciato invariato. Per confronto e metriche, sola riduzione a 1000×391 con Lanczos3. Nessuna modifica del file originale. Misure e soglie in misure.json; anteprime solo per revisione.



| Passo | File di ingresso e SHA-256 | Operazione e parametri esatti | Strumento e versione | File di uscita e SHA-256 | Dimensioni / byte |
|---|---|---|---|---|---|
| WebP C4-5a | piano-2.png, `5597b4cfc7c0cfe9660286f5f54002db3b0979c4dae7aa7ed5d4b0f36d225320` | Nessun resize/crop; filtro nessuno; WebP lossy q=90, alphaQuality=100, effort=6, smartSubsample=true, preset=default; metadati/C2PA rimossi dal derivato | Node 24.13.0; sharp 0.35.5; libvips 8.18.7; libwebp 1.6.0 | `client-web/public/art/table.webp`, `87ee30faf1190af1759533f8c9640b98d3da9377f2d5ce98609129a4fac92d3e` | 2006×784; 417820 B |

Registrare separatamente: eventuale ritaglio permanente con rettangolo x/y/larghezza/altezza in pixel del sorgente; eventuali ritocchi; ridimensionamento con filtro; compressione WebP con qualità, modalità e gestione dei metadati; ogni file intermedio conservato. Se non si effettua ritaglio permanente, dichiararlo.

| Campo | Valore da compilare |
|---|---|
| File finale distribuito e SHA-256 | `client-web/public/art/table.webp` — `87ee30faf1190af1759533f8c9640b98d3da9377f2d5ce98609129a4fac92d3e` |
| Parametri del ritaglio dinamico del renderer / collegamento alla specifica adottata | [Modalità S](NOTA.md#formule-proposte-e-simulazioni), scelta il 4 novembre 2026: piano W×H; centri proporzionali; sprite uniformi; taglio solo ai bordi della scena |
| Risultati del calcolo alle tre misure con le dimensioni finali | [Piano e limiti](../../../../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2); test background.test.ts; geometria finale nel rapporto |
| Voce dell'inventario aggiornata / commit d'integrazione | [inventory.json](../../assets/inventory.json), C4-5a (stesso commit di questa scheda) |
| Collegamento alle evidenze e ai risultati delle verifiche successive | [Rapporto C4-5a](../../../../reports/client-c4-report.md#c4-5a--integrazione-dello-sfondo-del-tavolo-o2); [conversione e hash](../../../../reports/client-c4/c4-5a/conversione.json) |

Il cover dinamico non modifica i byte della WebP e non va confuso con un ritaglio eseguito sul file.

## Giudizio del proprietario

| Campo | Valore da compilare |
|---|---|
| Data e autore del giudizio | 4 novembre 2026, proprietario (messaggio C4-5a) |
| File / hash della variante giudicata | Simulazione S-piano2 di layers/NOTA.md; sorgente scelta `piano-2.png`, `5597b4cfc7c0cfe9660286f5f54002db3b0979c4dae7aa7ed5d4b0f36d225320`; integrazione finale non ancora giudicata |
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

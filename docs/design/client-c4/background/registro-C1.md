# C4-5a-gen — Registro C1

4 novembre 2026. Nuova generazione su correzioni esplicite del proprietario. Operatore Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. Candidato non approvato né integrato. Termini d’uso: **da verificare dal proprietario**.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | C1; precedenti A1 e B1 conservati. |
| Operatore della generazione | Codex, modello agente gpt-6.1-sol; generatore ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | C2PA: softwareAgent.name ChatGPT, softwareAgent.version gpt-image; versione numerica non esposta dallo strumento. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 4 novembre 2026, chiamata 18:08:00–18:08:37 Europe/Rome (UTC+01); clock UTC in richiesta-C1.json. |
| Identificativo del job / sessione, se esposto | exec-a1c6570c-cfe3-4dfe-b38e-aeb5c402f4c4, dal nome del file restituito. |
| Commit contenente il prompt prima della generazione | 1b64c703c8974c371f1fe7732b74dae9aabef399 |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-C.md, commit 1b64c70. |
| Prompt scelto: A oppure B (o revisione già committata) | Nuovo prompt C, committato prima della generazione. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Nuova generazione con i due riferimenti originali. |
| Dimensioni e formato richiesti | 2560×1000 PNG opaco nel prompt; restituito 2006×784 PNG. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato; qualità/stile nel testo; forza numerica non esposta dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; soltanto i due referenced_image_paths; nessun num_last_images_to_include. |

Il commit preventivo di prompt-C.md è riportato sopra. La data della generazione deve essere successiva al salvataggio e commit del testo usato. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Copiare integralmente, senza riassumere né limitarsi a “prompt A/B”. Conservare spaziature, lingua e istruzioni aggiuntive. Se il negativo era nello stesso campo, lasciarlo nel testo principale e annotarlo nel campo relativo.

Testo principale:

~~~text
Create one new empty illustrated background for the original project Botte Micidiali, using ONLY the two attached original project references: table.png for the empty table and materials; duel.png for the approved hand-inked comic style and palette only. Do not copy cards, people, text or interface from duel.png. Request an opaque PNG, 2560 x 1000 pixels, landscape 2.56:1.

Preserve the identity of this filthy Italian dive bar: dark walnut and tobacco-brown wood, warm reflections, localized sticky rings, scratches and cigarette burns, chipped bottle-green ceramic, worn oxblood burgundy vinyl and muted petrol accents. Keep the familiar broad tabletop dominant, with quiet central wood and subdued background. Do not redesign the venue.

CRITICAL TABLE GEOMETRY: draw one physically coherent broad oval pub table, a credible oval seen from above with slight perspective. Its near and far edges must describe the same continuous ellipse in perspective, with consistent thickness and natural wood grain. Do not squash a round table into an extremely flattened oval or stretch any object horizontally to fill the canvas. Frame a naturally broad table with sides extending outside the wide image if necessary; do not force the entire outline to fit. Keep the broad near rim gently curved and the far rim plausible, not a straight bar with bent corners. Match perspective and scale of glass, ashtray, coasters and furniture.

Keep a clearly readable chipped dark-green ashtray with cigarette ends at the left edge of the tabletop, and a clearly readable unbranded low tumbler of red Negroni with ice on a stained ivory coaster at the right edge. Show their bodies well, not just tiny slivers. They are peripheral decorative objects, never gameplay elements. Also retain one separate empty stained ivory coaster in the lower-left part of the tabletop, but shift it slightly inward toward the center and a little to the right of the ashtray's vertical alignment. Leave visible wood between ashtray and empty coaster; avoid a stiff vertical column of props. This small asymmetric offset should give the composition movement. The Negroni still rests naturally on its own coaster.

SEATING: use ONLY TWO TYPES of seating, and keep the furniture in a shallow strip at the top, preferably within the upper 12â€“14 percent of the image, subordinate to the tabletop. At the lateral left and right ends show short sections of fixed padded pub-booth seating, worn oxblood burgundy vinyl with scuffs and modest repairs. They are built-in booth sections, not freestanding dining chairs. In the middle show EXACTLY TWO upholstered stools, simple round burgundy vinyl seats, worn and a little repaired, on cheap dark dull-metal bases. No wooden slatted chairs, folding chairs, metal-backed chairs, additional stools or extra seating types.

Space the two stools approximately evenly between the lateral booth sections, around the one-third and two-thirds positions across the far side. Suggest casual disorder with a small difference in depth, a slight sideways offset and unequal wear, while retaining roughly balanced spacing. Do not line them up mechanically, but do not clump them together. Show compact cushions and only the necessary hints of legs behind the table. Do not enlarge the stools, raise the camera horizon or allocate a tall band to the room. Their top edges may approach the image edge; both seats must remain identifiable. No chair backs sticking high above the scene.

Compose for aspect-preserving centered cover crops at 1366 x 768, 844 x 390 and 750 x 292. Keep both stools and essential booth cues inside source x=17â€“83%. Outer booth fragments and decorative edge props may be partly sacrificed by the narrower crop, but the full wide composition must show the ashtray and Negroni clearly. Preserve object proportions at every point; expand the framing rather than stretching the illustration. Do not draw guides, coordinates or crop marks.

Avoid all lettering, numbers, pseudo-text, logos, brands, signatures, visible watermarks, people, faces, hands, playing cards, card backs, tokens, game boards, HUD, interface controls, frames, borders, marked play zones, grids, fantasy ornament, gold trim, neon, dominant yellow-and-black palettes, elegant furniture and fashionable designer distressing. No photographic or 3D-rendered restyling, no recognizable imagery from another game, no external imagery and no discarded project artwork.
~~~

Campo negativo separato, se usato:

~~~text

~~~

| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Unico campo prompt, incluso Avoid. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna aggiunta al testo; B1 non allegato. Richiesta effettiva in richiesta-C1.json. |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | non esposto dallo strumento |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | Nessuna. |

## Riferimenti effettivamente allegati

I soli riferimenti previsti per A e B sono table.png C0-R2 e duel.png R1. Percorsi e SHA-256 letti prima della generazione sono nella [tabella di prompt-sfondo.md](prompt-sfondo.md#istruzioni-al-proprietario). Questi sono valori di confronto; la tabella sotto deve descrivere **i byte realmente allegati**, non soltanto quelli che si intendeva usare.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| 1 | docs/design/client-c0/r2-assets/table.png | 42236445205a765c1f09e3e23af96f8078f65951f7c3efd7949d0b0ffb6cee01 | Tavolo, materiali e composizione | Nessuna |
| 2 | docs/design/client-c0/r1/duel.png | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e | Stile e palette R1 | Nessuna |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | Entrambi gli SHA-256 coincidenti prima della chiamata. |
| Conferma dell'operatore: nessuna immagine da Internet, dai quattro giochi o da asset respinti | Confermato; soltanto i due file originali elencati. |
| Altri input effettivi / dichiarazione esplicita di assenza | Nessun altro allegato. |

Se il servizio ha modificato gli allegati internamente e lo espone, annotarlo. Non inventare l'hash di una trasformazione interna non accessibile. Nessun riferimento esterno diventa ammesso perché il suo uso è stato annotato.

## Termini d'uso e provenienza esposta

| Campo | Valore da compilare |
|---|---|
| Titolo e URL dei termini applicabili allo strumento usato | |
| Versione / data dei termini | |
| Data di consultazione | |
| Piano/account o condizioni specifiche rilevanti, senza dati riservati | |
| Riferimento alla copia/evidenza dei termini consultati | |
| Condizioni dichiarate per uso dell'output e distribuzione nel progetto | |
| Restrizioni o attribuzioni richieste dallo strumento | |
| C2PA presente/esposto, assente o non verificato | Presente nel PNG; validità crittografica non verificata. |
| Strumento e versione usati per leggere C2PA | Node 24.13.0, lettura delle stringhe del PNG; non un validatore C2PA. |
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Stringa softwareAgent ChatGPT / gpt-image osservata nel PNG originale; dati-C1.json. Altri dati non verificati. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Risposta tool: image_url e output_hint; nome del generatore ricavato dal PNG. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-a1c6570c-cfe3-4dfe-b38e-aeb5c402f4c4.png |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/candidati/C1.png; copia invariata e rinominata. Originale automatico nel percorso output_hint di richiesta-C1.json. |
| SHA-256 dell'originale scaricato | 00b0be1a0d784a5c02a8bdcc191a7d872d33e30dfe62894394b5ec8ad231b26c |
| Formato, larghezza×altezza effettive, byte | PNG, 2006×784, 2714029 byte. |
| Trasparenza / profilo colore, se verificati | non verificato |
| Data di ricezione del file | 4 novembre 2026, 18:08:37 Europe/Rome (fine chiamata). |
| Eventuali altri output dello stesso tentativo e loro identificazione | Nessun altro originale. Anteprime e scheda-C1.webp solo per visione, documentate in dati-C1.json. |

D11 richiede la sorgente tracciata per lo sfondo. Conservare nel blocco successivo l'originale generato, non solo una cattura o la derivata compressa; registrare una rinomina senza presentarla come nuova generazione.

## Modifiche e derivati (da compilare nell'integrazione)

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

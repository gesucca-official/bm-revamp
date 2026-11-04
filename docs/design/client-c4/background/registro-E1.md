# C4-5a-gen — Registro E1

4 novembre 2026. Nuova generazione su correzioni esplicite del proprietario. Operatore Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. Candidato non approvato né integrato. Termini d’uso: **da verificare dal proprietario**.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | E1; modifica di C1 con D1 come riferimento limitato agli sgabelli, secondo la nuova richiesta del proprietario. |
| Operatore della generazione | Codex, modello agente gpt-6.1-sol; generatore ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | C2PA: softwareAgent.name ChatGPT, softwareAgent.version gpt-image; versione numerica non esposta dallo strumento. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 2026-11-04 17:26:59 UTC — 2026-11-04 17:27:32 UTC; UTC, Europe/Rome = UTC+01:00. |
| Identificativo del job / sessione, se esposto | exec-1fd1d682-b985-463f-a518-d2ff6564b780 (dal nome del file restituito). |
| Commit contenente il prompt prima della generazione | 3d2606f60ba8d80869d9b46369f64de5a62bf728 |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-E.md, commit 3d2606f. |
| Prompt scelto: A oppure B (o revisione già committata) | E, testo committato prima della chiamata. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Modifica di C1, D1 come riferimento degli sgabelli. La nuova istruzione del proprietario aggiorna la selezione degli input del processo precedente. |
| Dimensioni e formato richiesti | 2560×1000 PNG opaco richiesto; restituito 2006×784 PNG. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato; qualità/stile nel testo; forza numerica non esposta dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; soltanto i due referenced_image_paths; nessun num_last_images_to_include. |

Il commit preventivo di prompt-E.md è riportato sopra. La data della generazione deve essere successiva al salvataggio e commit del testo usato. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Copiare integralmente, senza riassumere né limitarsi a “prompt A/B”. Conservare spaziature, lingua e istruzioni aggiuntive. Se il negativo era nello stesso campo, lasciarlo nel testo principale e annotarlo nel campo relativo.

Testo principale:

~~~text
Edit the FIRST attached image, C1.png, as the exact base artwork. The SECOND attached image, D1.png, is a reference ONLY for the two upholstered stools. Preserve the first image's composition, table shape, wood grain, vivid warm walnut and tobacco colors, bright warm reflected light, saturation, contrast, chipped green ashtray at the left edge, red Negroni and its own coaster at the right edge, and the fixed burgundy pub booths at the sides. Do not adopt the second image's darker, duller or more muted wood and lighting, and do not move the ashtray or drink inward as in the second image. Keep the C1 camera angle, broad curved tabletop and shallow upper room strip. Request one opaque PNG, landscape 2560 x 1000 pixels, aspect ratio 2.56:1, preserving the base proportions without stretching.

Make ONLY these two targeted changes:

1. Replace the two central stools in C1 with the character of the stools in D1: worn round burgundy vinyl cushions on cheap dark dull-metal bases, one cushion more visibly cracked with a small worn opening, the other with subtler wear. Keep EXACTLY TWO stools. Place them near the same upper-middle locations as in C1, at roughly balanced distances from the booth sections. Give them a small but visible difference in depth and cushion tilt, as if casually moved rather than neatly aligned; do not clump them together. Keep both compact and in the shallow upper band, without expanding the room or adding furniture. Preserve C1's warm burgundy color and illumination. No freestanding chairs or extra seating.

2. Move ONLY the separate EMPTY stained ivory coaster currently sitting on the lower-left tabletop in C1 onto the near curved table edge, still on the left half and a little to the right of the ashtray's vertical line. Make it visibly precarious: about three quarters supported by the tabletop, about one quarter projecting beyond the rim toward the viewer. It is a stiff thin cardboard coaster, NOT a plate. Show its slight thickness, a short contact shadow over the wood and the unsupported portion silhouetted above the dark area below the rim. The table edge should pass behind/under that coaster so the overhang is unmistakable. Do not bend or melt the coaster, do not make it float, and do not add a hand holding it. Keep it empty and stained. The Negroni remains on its OWN original coaster at the right edge.

Preserve everything else from C1 as closely as possible. Do not recolor, desaturate, darken or flatten the base artwork. Do not simplify the wood or replace its reflections with a matte surface. Keep natural object proportions and coherent perspective, with no horizontal squash or lens distortion. This is background illustration only.

Avoid any added lettering, numbers, logos, brands, signatures, visible watermarks, people, faces, hands, cards, card backs, tokens, HUD, buttons, frames, grids, game zones or interface. No new props, elegant furniture, neon, fantasy ornaments or recognizable imagery from another game. No external imagery.
~~~

Campo negativo separato, se usato:

~~~text

~~~

| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Unico campo prompt, incluso Avoid. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna aggiunta al testo committato. Soltanto i due input espliciti in richiesta-E1.json. |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | non esposto dallo strumento |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | Nessuna. |

## Riferimenti effettivamente allegati

I soli riferimenti previsti per A e B sono table.png C0-R2 e duel.png R1. Percorsi e SHA-256 letti prima della generazione sono nella [tabella di prompt-sfondo.md](prompt-sfondo.md#istruzioni-al-proprietario). Questi sono valori di confronto; la tabella sotto deve descrivere **i byte realmente allegati**, non soltanto quelli che si intendeva usare.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| 1 | docs/design/client-c4/background/candidati/C1.png | 00b0be1a0d784a5c02a8bdcc191a7d872d33e30dfe62894394b5ec8ad231b26c | Base da modificare, composizione e colori | Nessuna |
| 2 | docs/design/client-c4/background/candidati/D1.png | ae193f005a9e50dad90a33fc4e5deabc77889973828282c6e01abfc2c2edb18d | Soltanto gli sgabelli | Nessuna |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | Input aggiornati dalla richiesta del proprietario: C1 e D1, hash confrontati con dati-C1.json e dati-D.json, coincidenti prima della chiamata. |
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
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Stringa softwareAgent ChatGPT / gpt-image osservata nel PNG; C2PA presente. Altri dati e firma non verificati. dati-E1.json. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Risposta tool: image_url e output_hint; nome del generatore ricavato dal PNG. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-1fd1d682-b985-463f-a518-d2ff6564b780.png |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/candidati/E1.png; copia byte per byte con sola rinomina. Percorso automatico originale in richiesta-E1.json. |
| SHA-256 dell'originale scaricato | a63ad2c367ec75b2a0845448a83a27b80a3ecfcc29eadd2196086d1184679760 |
| Formato, larghezza×altezza effettive, byte | PNG, 2006×784, 2504776 byte. |
| Trasparenza / profilo colore, se verificati | non verificato |
| Data di ricezione del file | 2026-11-04 17:27:32 UTC (fine chiamata); Europe/Rome = UTC+01:00. |
| Eventuali altri output dello stesso tentativo e loro identificazione | Un solo originale per chiamata. Anteprime e scheda-E1.webp solo per visione, con hash in dati-E1.json. |

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

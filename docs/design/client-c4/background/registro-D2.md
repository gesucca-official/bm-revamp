# C4-5a-gen — Registro D2

4 novembre 2026. Nuova generazione su correzioni esplicite del proprietario. Operatore Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. Candidato non approvato né integrato. Termini d’uso: **da verificare dal proprietario**.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | D2; nuova sintesi D, precedenti A1/B1/C1 conservati. |
| Operatore della generazione | Codex, modello agente gpt-6.1-sol; generatore ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | C2PA: softwareAgent.name ChatGPT, softwareAgent.version gpt-image; versione numerica non esposta dallo strumento. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 2026-11-04 17:18:36 UTC — 2026-11-04 17:19:09 UTC; UTC, Europe/Rome = UTC+01:00. |
| Identificativo del job / sessione, se esposto | exec-b5e3b9af-ecbe-4222-953c-181bd727cd9c (dal nome del file restituito). |
| Commit contenente il prompt prima della generazione | f5fd5ece301a412e2388af7f4f4f6de3312ed4d0 |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-D.md, commit f5fd5ec. |
| Prompt scelto: A oppure B (o revisione già committata) | D, stesso testo committato per D1 e D2; due chiamate indipendenti. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Nuova generazione con i due riferimenti originali. |
| Dimensioni e formato richiesti | 2560×1000 PNG opaco richiesto; restituito 2007×783 PNG. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato; qualità/stile nel testo; forza numerica non esposta dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; soltanto i due referenced_image_paths; nessun num_last_images_to_include. |

Il commit preventivo di prompt-D.md è riportato sopra. La data della generazione deve essere successiva al salvataggio e commit del testo usato. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Copiare integralmente, senza riassumere né limitarsi a “prompt A/B”. Conservare spaziature, lingua e istruzioni aggiuntive. Se il negativo era nello stesso campo, lasciarlo nel testo principale e annotarlo nel campo relativo.

Testo principale:

~~~text
Create one new empty illustrated table background for the original project Botte Micidiali. Request one opaque PNG at 2560 x 1000 pixels, aspect ratio 2.56:1. Use ONLY the two attached original project images: table.png as the primary reference for the table, materials, lighting and bar identity; duel.png as the approved reference for the hand-inked European comic style and palette only. Do not reproduce its people, cards, text or interface.

Preserve the same intimate filthy Italian dive bar: dark walnut and tobacco-brown wood, worn oxblood burgundy vinyl booth seating, chipped dark bottle-green ceramic, restrained petrol accents and small stained ivory coasters. Localized glass rings, scratches, cigarette burns and sticky stains should remain. Keep the tabletop overwhelmingly dominant, not a panoramic view of a new room. Use irregular dark ink contours and controlled painted shading, never a photographic or 3D-rendered restyling. Keep the original warm light direction, but soften the broad bright streaks and busy high-contrast wood grain across the playing area. The center must be quiet, matte-to-satin wood; grime and modest reflections belong mainly near the periphery.

TABLE GEOMETRY: use a credible broad oval communal pub table viewed nearly from above with a modest consistent perspective. Draw a single coherent continuous oval rim with consistent thickness, the far and near curves belonging to the same solid table. Do not squeeze a circular table into a flat pancake, use a straight far edge with arbitrarily bent corners, stretch grain or props horizontally, or force the whole tabletop outline into the panoramic canvas. Let the left and right table sides extend beyond the frame if needed. The near edge should have a gentle believable curve, not an exaggerated lens bend. All objects share the same perspective and natural proportions. Do not use a wide-angle lens effect.

CRITICAL CROP SURVIVAL: the same source will be shown with centered, uniform-scale cover crops at 1366 x 768, 844 x 390 and 750 x 292. At the narrowest crop, approximately the outer 15.3 percent on each side disappears. Therefore ALL recognizable essential objects, booth cues and both stool cushions must fit well inside source x=17â€“83%, with a little breathing room. Do not place the ashtray or drink on the extreme image edges. Their survival in the 1366 x 768 center crop is a high priority. Do not draw crop guides or coordinates.

Place a chipped dark-green ceramic ashtray, with cigarette ends, on the upper-left peripheral area of the tabletop. Its complete recognizable bowl should occupy approximately source x=19â€“30%, y=27â€“43%. Place an unbranded low tumbler of red Negroni with ice and a restrained orange garnish on its own stained ivory coaster on the upper-right peripheral tabletop, the complete drink-and-coaster group roughly x=70â€“81%, y=23â€“43%. Keep both props well visible and comfortably inside the central crop. Their sizes must feel natural for the table, neither miniature slivers nor giant foreground props. These are static bar dressing, never gameplay objects.

Place ONE separate empty stained ivory coaster lower on the left half of the table, a little inward toward the center, roughly x=33â€“39%, y=68â€“78%. It must not form a vertical column with the ashtray. Leave wood and asymmetric spacing between the three decorative groups to give the composition movement. The glass keeps its own coaster. Avoid conspicuous rectangular patches, labels, cross-shaped tape or other marks that could be mistaken for buttons or symbols.

SEATING: ONLY TWO TYPES, no freestanding dining chairs. Show worn fixed padded pub-booth sections on the left and right lateral shoulders. Keep recognizable inner burgundy booth portions inside the safe crop, roughly x=18â€“29% and x=72â€“82%, while optional outer extensions may be sacrificed. Their upholstery should preserve the original bar's enclosing, intimate feel. Use scuffs, small low-contrast repairs and cracked vinyl, not luxurious furniture or bright attention-grabbing patches.

Behind the far tabletop rim, show EXACTLY TWO simple round burgundy upholstered stools on cheap dark dull-metal bases, roughly around x=38% and x=63%. Keep approximately balanced spacing between the booth sections and the two stools, but show genuine casual disorder: the left stool is pulled slightly closer to the table and sideways, the right stool sits a little farther back, their cushion ellipses and visible bases differing subtly in perspective. Give them unequal low-key wear. Do not create two perfectly level identical discs or a neat symmetrical furniture lineup; do not clump them together either. Keep both stools identifiable and within the upper 12â€“14 percent of the image, with only tiny necessary leg fragments behind the table. The difference in depth must remain visible without making one stool huge. Keep the room band shallow and avoid tall chair backs. Concentrate one broad simple wear cue on the left stool near x=40â€“45%, y=3â€“9%, but do not sacrifice physically credible furniture placement for this guide. Repairs should still read at 750 x 292, without relying on tiny stitches.

The result should improve crop survival, plausible table geometry, a quiet playing surface, compact imperfectly placed stools, burgundy booth continuity and the inward empty coaster together. Keep the same bar rather than combining incompatible furniture from alternative drafts.

Avoid any lettering, numbers, pseudo-text, logos, brands, signatures, visible watermarks, people, faces, hands, playing cards, card backs, tokens, counters, game boards, HUD, controls, frames, borders, marked zones, grids, fantasy ornament, gold trim, neon or dominant yellow-and-black colors. No elegant chairs, wooden slatted chairs, folding chairs, metal-backed chairs, extra stools or other seating types. No bright repair patches that look like labels, no giant glossy reflections, no resemblance to the visual identity of an existing game, no external images and no discarded project artwork.
~~~

Campo negativo separato, se usato:

~~~text

~~~

| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Unico campo prompt, incluso Avoid. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna aggiunta al testo; B1 non allegato. Richiesta effettiva in richieste-D.json. |
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
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Nel PNG originale osservata stringa softwareAgent ChatGPT / gpt-image; C2PA presente. Altri campi e firma non verificati. dati-D.json. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Risposta tool: image_url e output_hint; nome del generatore ricavato dal PNG. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-b5e3b9af-ecbe-4222-953c-181bd727cd9c.png |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/candidati/D2.png; copia byte per byte con sola rinomina. Percorso automatico originale in richieste-D.json. |
| SHA-256 dell'originale scaricato | b46371453929a265bb70e35f153e62115f55e9dd70cd4f15653e7a3dc503f18b |
| Formato, larghezza×altezza effettive, byte | PNG, 2007×783, 2494610 byte. |
| Trasparenza / profilo colore, se verificati | non verificato |
| Data di ricezione del file | 2026-11-04 17:19:09 UTC (fine chiamata); Europe/Rome = UTC+01:00. |
| Eventuali altri output dello stesso tentativo e loro identificazione | Un solo originale per chiamata. Anteprime e scheda-tutti.webp solo per visione, con hash in dati-D.json. |

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

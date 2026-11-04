# C4-5a-gen — Registro G1

4 novembre 2026. Nuova generazione su correzioni esplicite del proprietario. Operatore Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. Candidato non approvato né integrato. Termini d’uso: **da verificare dal proprietario**.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | G1; rimozione sgabelli e riduzione fascia di stanza di F1. |
| Operatore della generazione | Codex, modello agente gpt-6.1-sol; generatore ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | C2PA: softwareAgent.name ChatGPT, softwareAgent.version gpt-image; versione numerica non esposta dallo strumento. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 2026-11-04 17:37:23 UTC — 2026-11-04 17:37:55 UTC; UTC, Europe/Rome = UTC+01:00. |
| Identificativo del job / sessione, se esposto | exec-fdd07774-b5a4-4928-8e59-f01f0b97948a (dal nome del file restituito). |
| Commit contenente il prompt prima della generazione | 8f3b345eb8ac2865a74426cd37c724ac0555b0ea |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-G.md, commit 8f3b345. |
| Prompt scelto: A oppure B (o revisione già committata) | G, testo committato prima della chiamata. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Modifica di F1; table.png originale come riferimento limitato alla quantità di stanza visibile. Nuova richiesta del proprietario: nessuno sgabello, altri vincoli mantenuti. |
| Dimensioni e formato richiesti | 2560×1000 PNG opaco richiesto; restituito 2006×784 PNG. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato; qualità/stile nel testo; forza numerica non esposta dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; referenced_image_paths nell’ordine F1, table.png; num_last_images_to_include omesso. |

Il commit preventivo di prompt-G.md è riportato sopra. La data della generazione deve essere successiva al salvataggio e commit del testo usato. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Copiare integralmente, senza riassumere né limitarsi a “prompt A/B”. Conservare spaziature, lingua e istruzioni aggiuntive. Se il negativo era nello stesso campo, lasciarlo nel testo principale e annotarlo nel campo relativo.

Testo principale:

~~~text
Edit the FIRST attached image, F1.png, as the base artwork. The SECOND attached image, the original project table.png, is a reference ONLY for how little of the room is visible beyond the far tabletop. Keep F1's vivid warm walnut/tobacco palette, lively amber reflections, burgundy fixed pub-booth upholstery, chipped green ashtray, red Negroni, and the empty stained ivory coaster precariously overhanging the near table edge. Do not adopt a duller or desaturated palette. Request one opaque PNG, landscape 2560 x 1000 pixels, aspect ratio 2.56:1, no stretching.

Make these precise changes:
REMOVE BOTH STOOLS COMPLETELY, including cushions, seat rings, legs, shadows and any leftover fragments. Do not replace them with chairs or other furniture. No stools or freestanding seats anywhere.

Greatly REDUCE THE VISIBLE ROOM STRIP beyond the far edge of the table, approximately as in the second reference. Bring the far tabletop curve much closer to the top of the frame: around the middle of the image, the far rim should sit within roughly the top 1â€“3 percent, leaving only a very thin dark sliver of room above it. These percentages are composition guides, never markings. Keep the table dominant and the familiar burgundy booth visible only as shallow peripheral portions near the upper corners and lateral margins, not as a tall wall of upholstery. No large exposed wall, vertical room panels, floor, new furniture, tall horizon or panoramic interior. Reconstruct only the small necessary background where the stools were removed. Preserve the same dive bar identity.

Do not simply stretch or squash the table to fill the space. Reframe the broad tabletop with a coherent nearly overhead perspective and one continuous believable oval rim, consistent thickness, natural wood grain and proportional objects. It is acceptable for the table's left and right sides to extend outside the wide frame; do not force a round table into a flattened pancake or draw a straight far edge with bent corners. Keep the near curved edge recognizable and visible. Do not zoom so far that the decorative objects become unrecognizable.

Preserve the chipped green ashtray with cigarette ends on the left peripheral tabletop and the unbranded tumbler of red Negroni with ice and its own stained ivory coaster on the right. Keep them clearly readable in the full wide image, similar to F1. Keep the separate EMPTY coaster on the near left curved edge, slightly to the right of the ashtray's vertical alignment, with visible wood between them. Keep it physically precarious: most of its thin stiff cardboard body supported by the tabletop, a smaller portion projecting beyond the rim, with a credible contact shadow and no floating, bending or melting. Do not turn it into a plate, and do not move the drink onto it.

Maintain hand-inked European comic illustration, localized grime, scratches, burns and glass rings; broad central wood must still leave room for live cards and boards. Preserve warm light and saturation. No elegant or pristine furniture, no unnecessary new props. Keep all objects and the table in consistent perspective without lens distortion.

The background will be displayed using centered aspect-preserving cover crops at 1366 x 768, 844 x 390 and 750 x 292. Keep original object proportions and don't compensate for crop losses by stretching. Peripheral details may be clipped by a narrower crop, as in F1; do not replace the user's selected composition with the inward-prop arrangement of previous alternatives. Do not draw any crop guides, safe-zone boxes or technical annotations.

Avoid any added text, letters, numbers, logos, brands, signatures, visible watermarks, people, faces, hands, cards, card backs, tokens, HUD, interface controls, frames, borders, grids, marked play areas, fantasy ornaments, gold trim, neon, dominant yellow-and-black styling, photographic or 3D-rendered restyling, or recognizable imagery from another game. No external imagery. Preserve every constraint above while removing the stools and narrowing the room strip.
~~~

Campo negativo separato, se usato:

~~~text

~~~

| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Unico campo prompt, incluso Avoid. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna aggiunta al testo; solo F1 e table.png come input espliciti, richiesta-G1.json. |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | non esposto dallo strumento |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | Nessuna. |

## Riferimenti effettivamente allegati

I soli riferimenti previsti per A e B sono table.png C0-R2 e duel.png R1. Percorsi e SHA-256 letti prima della generazione sono nella [tabella di prompt-sfondo.md](prompt-sfondo.md#istruzioni-al-proprietario). Questi sono valori di confronto; la tabella sotto deve descrivere **i byte realmente allegati**, non soltanto quelli che si intendeva usare.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| 1 | docs/design/client-c4/background/candidati/F1.png | 32f5cfbeffe2bdcaea125a74dc4edcf48595ac500c772774d37f6af9565efa7e | Base da modificare | Nessuna |
| 2 | docs/design/client-c0/r2-assets/table.png | 42236445205a765c1f09e3e23af96f8078f65951f7c3efd7949d0b0ffb6cee01 | Riferimento fascia di stanza | Nessuna |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | F1 coincidente con dati-F1.json e table.png coincidente con la tabella originale; lettura prima della chiamata. |
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
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Stringa ChatGPT / gpt-image nel PNG originale esterno; C2PA presente, firma e altri campi non verificati; dati-G1.json. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Risposta tool: image_url e output_hint; nome del generatore ricavato dal PNG. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-fdd07774-b5a4-4928-8e59-f01f0b97948a.png |
| Nome e percorso di archiviazione nel progetto | Originale ora tracciato nel repository: docs/design/client-c4/background/candidati/G1.png; copia invariata del file temporaneo, SHA-256 confermato. Il limite cumulativo di 20 MB non si applica a questa archiviazione richiesta dal proprietario (D11). |
| SHA-256 dell'originale scaricato | a764db29c0b21632cca2d6a74d5aef035f4045902b25a483060979cfa51f7437 |
| Formato, larghezza×altezza effettive, byte | PNG, 2006×784, 2449293 byte. |
| Trasparenza / profilo colore, se verificati | non verificato |
| Data di ricezione del file | 2026-11-04 17:37:55 UTC (fine chiamata); Europe/Rome = UTC+01:00. |
| Eventuali altri output dello stesso tentativo e loro identificazione | Un solo originale esterno. Anteprime WebP e scheda-G1.webp solo per visione, con hash in dati-G1.json. |

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

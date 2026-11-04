# C4-5a-prep — Prompt letterali per lo sfondo

4 novembre 2026. Preparazione documentale secondo [C4-5a e D11](../../../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2) e [O2](../../../client-roadmap.md#osservazioni-del-proprietario-dopo-c1). Nessuna generazione effettuata; O2 resta aperta. La direzione [R1 è approvata](../../client-c0/r1/approval.md): si correggono le sedute, mantenendo il bar.

## Istruzioni al proprietario

Provare **A per prima**, la variante più vicina al tavolo attuale. B accentua le riparazioni e la diversità delle sedute senza cambiare palette, luce o ambiente. Sono alternative: non concatenarle. Il testo letterale da incollare è l'intero blocco inglese della variante scelta, compreso il paragrafo “Avoid”. Le istruzioni al proprietario restano in italiano. L'inglese è una scelta pratica per gli strumenti che lo preferiscono; lingua preferita e capacità dello strumento del proprietario **non verificate**.

Generare soltanto dopo il commit di questo documento. Se si vuole cambiare il testo, aggiungere istruzioni, tradurlo o fare una successiva correzione, salvare e committare prima il nuovo prompt letterale; conservare anche questa versione. Non improvvisare modifiche non registrate nella sessione di generazione. Registrare separatamente un'eventuale riscrittura automatica del prompt esposta dallo strumento.

Per **entrambe** le varianti allegare questi due file originali del progetto, in questo ordine:

1. [table.png C0-R2](../../client-c0/r2-assets/table.png): riferimento principale per tavolo vuoto, materiali, luce, prospettiva e composizione.
2. [duel.png R1 approvato](../../client-c0/r1/duel.png): solo riferimento artistico per palette e tratto; non riprodurne carte, personaggi, testo o interfaccia.

Non allegare screenshot dei giochi di riferimento, immagini da Internet o vecchi asset respinti. Gli altri mockup R1 non sono necessari a questa proposta. Nessun riferimento esterno è stato cercato o scaricato.

Impronte SHA-256 lette dai file il 4 novembre 2026 (servono al confronto con gli allegati effettivi, non attestano una generazione):

| File relativo alla radice del progetto | SHA-256 |
|---|---|
| docs/design/client-c0/r2-assets/table.png | 42236445205a765c1f09e3e23af96f8078f65951f7c3efd7949d0b0ffb6cee01 |
| docs/design/client-c0/r1/duel.png | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e |

Richiedere **2560×1000 px, 2,56:1**, immagine opaca, preferibilmente PNG originale. È una dimensione richiesta, non una capacità accertata dello strumento. Se non è disponibile, riportare formati possibili e dimensioni effettive prima di adattare il prompt; non stirare un risultato 16:9. La WebP 2048×800 è una derivata per l'integrazione successiva, non il file da chiedere al generatore. Motivazione, coordinate e limiti sono nella [specifica di ritaglio](specifica-ritaglio.md).

## A — Correzione fedele delle sedute (prima prova consigliata)

Mantenere noce/tabacco, legno sudicio, riflessi caldi, verde bottiglia, bordeaux e accenti petrolio; stessa inquadratura dall'alto con lieve prospettiva e tavolo ampio. Cambiare il carattere delle sedute e adattare l'inquadratura al ritaglio: legno scrostato, vinile screpolato, riparazioni povere, nessuna eleganza.

~~~text
Create a new empty illustrated table background for the original project Botte Micidiali. Output one opaque landscape image, 2560 x 1000 pixels, aspect ratio 2.56:1, preferably an original PNG. This is background artwork only, with absolutely no lettering or game interface.

Use only the two attached project images. Reference 1, table.png, is the primary reference for the empty table, materials, lighting and composition. Reference 2, duel.png, is the approved art-direction reference only: borrow its hand-inked European comic look, irregular dark contours, restrained painted shading and material texture. Do not reproduce its cards, people, lettering or interface. Preserve the approved bar's identity; do not redesign the venue.

Keep the broad scratched dark walnut and tobacco-brown tabletop filling almost the entire scene, the slightly overhead perspective, rounded table edge, warm worn reflections, sticky glass rings, localized stains and cigarette burns. Keep dusty bottle green, oxblood burgundy and muted petrol accents, with only small worn-ivory details. Match the reference's light direction and subdued atmosphere. Keep the central wood quiet enough for separately rendered cards and player boards to remain readable. Preserve small peripheral bar dressing, such as a chipped green ashtray and stained glass or coaster, as disposable edge details, never as interactive objects.

Correct the seating: replace the elegant, coordinated chairs with cheap mismatched dive-bar furniture. Use chipped plain wooden chair backs, scratched dull metal, cracked burgundy vinyl with a small rough patch, uneven faded paint and a battered stool with a visibly repaired seat. The furniture must look used for decades and repaired cheaply, not curated antique furniture. No polished matching set, decorative carving, luxurious upholstery or refined restaurant seating. Keep the furniture around the table, never on its surface.

Compose for centered aspect-preserving cover crops at 1366 x 768, 844 x 390 and 750 x 292. Extend the horizontal framing, not the proportions of the existing scene. Keep all essential seating identity inside source x=17–83% and y=2–98%. Place a clearly recognizable battered chair-back section and a small repaired stool-seat section near the far rim at the upper middle, roughly x=38–48% and y=1–14% of the source. Concentrate the clearest chipped joint and crude vinyl patch in x=40–45%, y=3–9%. These are composition guides, not visible markings. Show enough of each silhouette to read as cheap seating; do not enlarge them into the playing surface. Keep other seating fragments near the upper left and right shoulders, within x=18–30% and x=70–82%, y=3–22%, accepting partial coverage by the live interface. Left and right outer strips may be cropped away; no essential detail may depend on them. Do not move the table into a new room or make the background a panoramic interior illustration.

Avoid: any text, letters, numbers, pseudo-lettering, signatures, watermarks, logos, commercial brands, people, faces, hands, playing cards, card backs, tokens, counters, boards, HUD, buttons, frames, borders, slots, grids, interface panels, target outlines, fantasy ornaments, gold trim, neon, dominant yellow-and-black colors, photorealistic or 3D-rendered styling, recognizable imagery or visual identity from an existing game. Do not copy any game screenshot or use any external image. No elegant, pristine, matching or designer chairs. No crop guides or technical annotations in the output.
~~~

## B — Sedute più spaiate e rattoppate

Stessa palette, legno, luce e composizione di A. La differenza è nelle riparazioni: una sedia semplice a stecche con traversa sostituita e uno sgabello con vinile rattoppato; usura disomogenea, senza trasformare il locale in rovina o cambiare stile.

~~~text
Create one new empty illustrated background for the original project Botte Micidiali: the same filthy Italian dive-bar table shown in the attached project references, with more visibly mismatched and crudely repaired seating. Output an opaque original PNG if possible, 2560 x 1000 pixels, landscape aspect ratio 2.56:1. Draw background artwork only, no text and no interface.

Use only the attached table.png as the primary empty-scene reference and the attached approved duel.png as the secondary reference for illustration style and palette. Preserve the same bar, camera angle, broad rounded dark walnut tabletop, warm directional reflections, tobacco-brown stains, bottle-green glass, oxblood burgundy vinyl and muted petrol accents. Use the same hand-inked European comic character, irregular contours and controlled painted texture. The second reference contains gameplay elements: do not copy any of those elements into this background.

Keep the table dominant, almost filling the frame. Preserve the existing distribution of quiet central wood and localized peripheral grime: scratches, sticky rings, cigarette burns, a chipped ashtray and small stained glass or coaster details near disposable edges. Match the reference lighting; do not introduce a new lighting scheme, new architecture, a different bar or a different art style.

Make the seating unmistakably cheap, worn, mismatched and repaired. Include one plain slatted wooden chair with chipped dark paint and an obviously replaced crosspiece, another worn chair with dull scratched metal tubing, and a battered stool with cracked burgundy vinyl repaired with an irregular patch and crude stitching. Vary the furniture shapes and wear naturally. Keep the same restrained palette; repairs must not become bright visual distractions. This is an ordinary neglected dive bar, not a stylish vintage cafe, fancy saloon, designer lounge or abandoned ruin. All furniture remains behind or beside the table, never on top of it.

Frame the scene for centered cover crops without stretching at 1366 x 768, 844 x 390 and 750 x 292. Use the wider canvas to add disposable side context while preserving the table's proportions and familiar composition. Keep essential seating identity in source x=17–83%, y=2–98%. Arrange the upper-middle far-rim seating fragments around x=38–48%, y=1–14%. Put the recognizable replaced wooden joint and a clearly rough vinyl repair within x=40–45%, y=3–9%; keep these details legible as parts of furniture, not isolated props. Additional worn chair sections may sit at the upper shoulders, x=18–30% and x=70–82%, y=3–22%, with important wear away from the outermost edges. The center and lower area must remain quiet wood for the live game overlay. Do not draw the coordinate guides. The crop may sacrifice outer furniture fragments and decorative objects, but the upper-middle cheap-seating cues should survive.

Avoid: lettering of any kind, numbers, labels, signatures, watermarks, logos, branded objects, characters, patrons, faces, hands, cards, card backs, counters, tokens, gameplay objects, interface, buttons, decorative screen frames, borders, marked play zones, grids, fantasy symbols, gold ornament, neon and dominant yellow-and-black styling. No polished or matching chairs, elegant carved wood, luxurious upholstery or intentionally fashionable distressing. No photographic or 3D-rendered restyling. No visual imitation of any existing game, no Internet imagery, no discarded earlier project artwork, and no technical annotations.
~~~

## Negativi/da evitare

I negativi sono già inclusi letteralmente in ciascun prompt: valgono anche se lo strumento non ha un campo separato. Se dispone di un campo negativo, si può trasferirvi **senza riscriverlo** il paragrafo “Avoid” scelto; registrare poi separatamente testo principale e negativo. Non aggiungere nomi dei quattro giochi come richiami stilistici.

Non incorporare la scritta «Botte Micidiali» nell'immagine: resta un elemento sovrapposto dal client. La riconoscibilità delle sedute nella fascia proposta e la fedeltà artistica non sono garantite da un prompt: richiedono il giudizio del proprietario e poi la prova sul tavolo vero. Consegnare l'originale e i dati richiesti dal [registro](registro-generazione.md); nessuna approvazione dello sfondo o integrazione è implicita in questa preparazione.

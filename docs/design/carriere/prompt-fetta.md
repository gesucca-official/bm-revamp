# Tutorial — prompt della fetta verticale

> **Chiusa l'11 novembre 2026** dal proprietario («chiudiamo la fetta») dopo il secondo giro: sfondo S2 e quattro ritratti approvati,
> [specifica](specifica-asset.md) confermata. I link della tabella del primo giro aprono i file attuali, che il secondo giro ha sostituito; le
> versioni precedenti restano nella storia di git e nel [registro](asset/tutorial/registro.md).

11 novembre 2026. Prima produzione di materiale vero per il [tutorial](tutorial.md), limitata alla **scena 1** ([dialoghi](tutorial-dialoghi.md#scena-1--il-trambusto)):
lo sfondo S2 e due espressioni per Mara e due per Spazienzio, più quattro composizioni di prova con la finestra di dialogo. Serve a
verificare la [specifica degli asset](specifica-asset.md) prima di generare il resto. Processo come per gli identikit: prompt letterali
committati prima di generare (D11 del [piano C4](../../client-c4-plan.md#decisioni-del-proprietario)), registro completo, nessun
riferimento esterno al progetto.

## Istruzioni

- **Generare solo dopo il commit di questo documento.** Ogni blocco inglese va incollato integralmente, paragrafo «Avoid» compreso.
- **Allegati:** solo quelli della tabella, dopo averne controllato l'impronta.
- **Tentativi:** uno per prompt; un solo nuovo tentativo con lo stesso testo se il risultato viola il prompt in modo oggettivo (scritte,
  marchi, personaggio diverso, inquadratura o fondo sbagliati, qualcosa che esce dal naso di Spazienzio). Se lo strumento blocca un
  prompt, non si insiste: si annota.
- **File, nomi e registro:** come dice la [specifica](specifica-asset.md#file-e-registro), nella cartella
  `docs/design/carriere/asset/tutorial/`.
- **Composizioni di prova:** dopo la generazione, quattro immagini statiche fatte con uno script (non con lo strumento di generazione):
  lo sfondo S2 riempie lo schermo ritagliato al centro, il ritratto è posato come dice la [specifica](specifica-asset.md#come-appare-la-scena),
  e sopra c'è una finestra di dialogo semplice e scura con il nome di chi parla e la battuta. Sono una prova di misure, non il client.

| File | Composizione | Battuta |
|---|---|---|
| `composizioni/fetta-orizzontale-mara.webp` | 1366×768, ritratto `mara-contenta` | «Ah, allora non sei tu, Sioux della malora che non sei altro. Ho capito chi ha ordinato questo kebab. Vieni, andiamo a portarglielo.» |
| `composizioni/fetta-orizzontale-spazienzio.webp` | 1366×768, ritratto `spazienzio-fumante` | «E VOI CHI SIETE? FACCE NUOVE. ODIO LE FACCE NUOVE.» |
| `composizioni/fetta-verticale-mara.webp` | 390×844, ritratto `mara-neutra` | «Lui è Spazienzio. Ha finito la pazienza nel 2019, e da allora non gli è più tornata.» |
| `composizioni/fetta-verticale-spazienzio.webp` | 390×844, ritratto `spazienzio-furioso` | «UCCIDIAMOTI...! UCCIDIAMOTI, HO DETTO! FERMI, LASCIATEVI CAROTARE... AAARGH!» |

| Prompt | Allegato | SHA-256 |
|---|---|---|
| S2, immagine 1 | `docs/design/client-c0/r1/duel.png` | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e |
| S2, immagine 2 | `client-web/public/art/table.webp` | 87ee30faf1190af1759533f8c9640b98d3da9377f2d5ce98609129a4fac92d3e |
| Mara | `docs/design/set-base/identikit/riferimenti/mara.png` | 0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d |
| Spazienzio | `docs/design/set-base/identikit/riferimenti/spazienzio.png` | c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3 |

Lo sfondo del tavolo (`table.webp`) è in uno stile pittorico più lucido dei ritratti: serve **solo per materiali e colori** del locale
(noce scuro, vinile bordeaux), lo stile viene da R1.

## S2 — interno del bar

~~~text
Background illustration for a visual-novel dialogue scene in the original card game Botte Micidiali. One opaque landscape image, 1536 x 1024 pixels, aspect ratio 3:2. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette of walnut, tobacco brown, dusty bottle green, oxblood burgundy, muted petrol and worn ivory. Use image 2 only as the reference for the bar's materials and colours: dark scratched walnut wood and cracked oxblood vinyl. Do not copy anything else from either image.

The scene: the interior of a cramped, grimy Italian neighbourhood dive bar at night, seen at eye level from just inside the entrance, with nobody in it. In the central third of the width: the old bar counter with a worn wooden top, a few battered stools in front of it, shelves of dusty bottles with blank labels behind it and a cheap old espresso machine. Towards the sides: small tables with mismatched, cheaply repaired chairs and stained walls, as disposable side context. Warm, dim, dirty light. The lower quarter of the image is plain worn floor tiles with no important details, because a dialogue box will cover it, and the centre stays uncluttered, because a character portrait will stand in front of it. Everything important must stay inside the central third, because on phones only a narrow central strip is visible.

Avoid: any text, letters, numbers, signs, labels, logos, brands, signatures or watermarks; neon signs; people, faces, hands, silhouettes; playing cards, game interface, frames or borders; elegant, trendy, clean or renovated decor; photographic or 3D-rendered style; dominant yellow-and-black colours.
~~~

## Mara — contenta

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same woman for a visual-novel dialogue scene. Keep her face, body, long black hair with the badly self-cut fringe, over-ear headphones, teal reflective vest over the dark hoodie, backpack straps, colours and hand-inked European comic style exactly as in the reference; do not redesign her. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: from the top of her head, with a small empty margin above it, down to her waist at the bottom edge; her eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: pleased and excited, a crooked knowing grin, eyes still staring with deep dark circles, as if she has just figured something out.

Avoid: any other change to the character; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

## Mara — neutra

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same woman for a visual-novel dialogue scene. Keep her face, body, long black hair with the badly self-cut fringe, over-ear headphones, teal reflective vest over the dark hoodie, backpack straps, colours and hand-inked European comic style exactly as in the reference; do not redesign her. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: from the top of her head, with a small empty margin above it, down to her waist at the bottom edge; her eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: flat and matter-of-fact, mouth closed, staring wide eyes with deep dark circles, as if stating something completely obvious.

Avoid: any other change to the character; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

## Spazienzio — furioso

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same man for a visual-novel dialogue scene. Keep his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: from the top of his head, with a small empty margin above it, down to his waist at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: furious and shouting, mouth wide open with clenched teeth showing, face red with anger, the vein throbbing on his temple, fists raised. Nothing comes out of his nose.

Avoid: any other change to the character; mirroring; steam, drips or lines coming out of his nose; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

## Spazienzio — fumante

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same man for a visual-novel dialogue scene. Keep his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: from the top of his head, with a small empty margin above it, down to his waist at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: beyond furious, face deep red, jaw clenched, glaring, with small cartoon puffs of steam rising from the top of his bald head, as if he were a boiling kettle. Nothing comes out of his nose.

Avoid: any other change to the character; mirroring; steam, drips or lines coming out of his nose; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

## Esiti

Da compilare dopo la generazione: l'esecutore elenca file e schede, il proprietario scrive il giudizio. La colonna del giudizio la
compila solo il proprietario, tramite la regia.

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| s2-interno | [WebP](asset/tutorial/sfondi/s2-interno.webp) | [Scheda](asset/tutorial/registro.md#s2-interno-1) | (11 novembre 2026) Composizione generale approvata, «solo che magari quella lampada sopra la testa della gente non è il massimo». Secondo giro |
| mara-contenta | [WebP](asset/tutorial/ritratti/mara-contenta.webp) | [Scheda](asset/tutorial/registro.md#mara-contenta-1) | **Approvato** (11 novembre 2026): «Mara va bene» |
| mara-neutra | [WebP](asset/tutorial/ritratti/mara-neutra.webp) | [Scheda](asset/tutorial/registro.md#mara-neutra-1) | **Approvato** (11 novembre 2026): «Mara va bene» |
| spazienzio-furioso | [WebP](asset/tutorial/ritratti/spazienzio-furioso.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-furioso-1) | (11 novembre 2026) «Furioso me lo aspettavo più furioso». In più, per la regia, braccia tagliate dalla tela e occhi troppo in alto. Secondo giro |
| spazienzio-fumante | [WebP](asset/tutorial/ritratti/spazienzio-fumante.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-fumante-1) | (11 novembre 2026) «Non me lo aspettavo in senso letterale»: niente vapore. Stessa inquadratura da correggere. Secondo giro |

## Secondo giro

11 novembre 2026. Dopo il giudizio del proprietario sulla fetta ([esiti](#esiti)): la composizione generale va bene e Mara è approvata;
si rifanno lo sfondo S2 senza la lampada sopra la testa dei personaggi e i due ritratti di Spazienzio, più furioso il furioso e
«fumante» in senso figurato, con l'inquadratura corretta per i personaggi larghi ([specifica](specifica-asset.md#ritratti)).

Stesse [istruzioni](#istruzioni) del primo giro. Gli originali nuovi prendono il suffisso `-2`; i file consegnati mantengono il nome e
sostituiscono i candidati precedenti, che restano nella storia di git e nel registro. **Composizioni:** si rifanno le due di Spazienzio,
più `composizioni/fetta-verticale-mara.webp` per vedere lo sfondo nuovo in verticale, con le stesse battute.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| S2 | `docs/design/carriere/asset/tutorial/originali/s2-interno-1.png` | 73a6fa8aa34d7c87e19c643fec1270b4e4dacf842d1fe9d4e8d7125e96ea66b5 |
| Spazienzio, entrambi | `docs/design/set-base/identikit/riferimenti/spazienzio.png` | c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3 |

### S2 — senza la lampada al centro

~~~text
Edit the attached background illustration. Keep everything exactly the same: the room, the counter, the stools, the bottles, the espresso machine, the tables and chairs, the walls, the wall lamps, the colours, the hand-inked European comic style and the composition. Change only this: remove the large hanging lamp above the centre of the counter, together with its cord and its bright pool of light, and fill that area naturally with the same ceiling beams, shelves and wall behind it. The room stays lit by the wall lamps at the sides, with the same warm, dim, dirty mood.

Avoid: any other change to the image; any text, letters, numbers, signs, labels, logos, brands, signatures or watermarks; neon signs; people, faces, hands, silhouettes; photographic or 3D-rendered style.
~~~

### Spazienzio — furioso, al massimo

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same man for a visual-novel dialogue scene. Keep his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: he is very broad, so frame him from a little further away than a normal half-body portrait: his whole shoulders and both arms, fists included, fit inside the canvas with a small empty margin on both sides; from the top of his head, with a small empty margin above it, down to his waist or a little below at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: explosive rage at its absolute peak, completely out of control: bellowing at the top of his lungs with his mouth wide open, eyes bulging, every vein on his head and neck swollen, face purple-red, leaning forward aggressively, both fists raised and shaking. Nothing comes out of his nose.

Avoid: any other change to the character; mirroring; arms or fists cut off by the edges of the canvas; steam, smoke, drips or lines coming out of his nose or head; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Spazienzio — fumante, in senso figurato

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same man for a visual-novel dialogue scene. Keep his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: he is very broad, so frame him from a little further away than a normal half-body portrait: his whole shoulders and both arms, fists included, fit inside the canvas with a small empty margin on both sides; from the top of his head, with a small empty margin above it, down to his waist or a little below at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: seething, barely contained rage, about to explode but still holding it in: teeth grinding, jaw clenched so hard his cheeks bulge, eyes narrowed to slits, face flushed deep red, the vein on his temple throbbing, shoulders tense and fists clenched at his sides, trembling with the effort. This is figurative fuming: no steam, smoke or vapour anywhere.

Avoid: any other change to the character; mirroring; arms or fists cut off by the edges of the canvas; steam, smoke, vapour, drips or lines coming out of his nose or head; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Esiti del secondo giro

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| s2-interno | [WebP](asset/tutorial/sfondi/s2-interno.webp) | [Scheda](asset/tutorial/registro.md#s2-interno-2) | **Approvato** (11 novembre 2026): «per ora diciamo che vanno bene tutti e tre» |
| spazienzio-furioso | [WebP](asset/tutorial/ritratti/spazienzio-furioso.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-furioso-2) | **Approvato** (11 novembre 2026): «per ora diciamo che vanno bene tutti e tre» |
| spazienzio-fumante | [WebP](asset/tutorial/ritratti/spazienzio-fumante.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-fumante-2) | **Approvato** (11 novembre 2026): «per ora diciamo che vanno bene tutti e tre» |

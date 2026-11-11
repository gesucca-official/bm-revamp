# Tutorial — prompt del resto del materiale

11 novembre 2026. Tutto il materiale del [tutorial](tutorial.md) che manca dopo la [fetta verticale](prompt-fetta.md), diviso in tre giri
perché il giudizio non diventi un muro di immagini: **A** le espressioni rimaste di Mara e Spazienzio, **B** Piera e Grappino, **C** sfondi,
varianti, la bici e la combriccola. Si segue la [specifica degli asset](specifica-asset.md), confermata dalla fetta. Processo come per la
fetta: prompt letterali committati prima di generare (D11 del [piano C4](../../client-c4-plan.md#decisioni-del-proprietario)), registro
completo in `docs/design/carriere/asset/tutorial/registro.md`, nessun riferimento esterno al progetto.

## Istruzioni comuni

- **Un giro per volta,** nell'ordine A, B, C; il giro successivo parte dopo il giudizio del proprietario sul precedente, perché un giudizio
  può cambiare i prompt che seguono.
- **Ogni blocco inglese va incollato integralmente,** paragrafo «Avoid» compreso, con i soli allegati della tabella del giro, dopo averne
  controllato l'impronta.
- **Tentativi:** uno per prompt; un solo nuovo tentativo con lo stesso testo se il risultato viola il prompt in modo oggettivo (scritte,
  marchi, personaggio diverso, inquadratura o fondo sbagliati, braccia tagliate, qualcosa che esce dal naso di Spazienzio, cambi non
  richiesti). Se lo strumento blocca un prompt, non si insiste: si annota, e quel prompt lo genera il proprietario col suo strumento.
- **Catene:** dove un prompt allega l'originale di un altro asset dello stesso giro (Piera, l'insegna spenta), si genera prima quello e se
  ne usa l'originale conservato, registrandone l'impronta; se anche il suo nuovo tentativo fallisce, la catena si ferma e si annota.
- **File e nomi:** come dice la [specifica](specifica-asset.md#file-e-registro). Ritratti in `ritratti/`, sfondi e varianti in `sfondi/`,
  sprite e sagome in `sprite/`, tutti WebP, con trasparenza dove serve.
- **Composizioni di prova:** alla fine di ogni giro, una composizione orizzontale (1366×768) per ogni asset nuovo, con lo stesso script e la
  stessa finestra di dialogo della fetta e la battuta indicata nella tabella del giro, in `composizioni/` con il nome `<giro>-<asset>.webp`
  (per esempio `a-mara-agitata.webp`). Gli sprite e le sagome si posano sullo sfondo indicato.
- **Esiti:** l'esecutore riempie la tabella del giro (asset, file, scheda) e lascia vuota la colonna del giudizio.

## Giro A — Mara e Spazienzio

Le espressioni rimaste dei due personaggi della fetta, ottenute **modificando i ritratti approvati**, così inquadratura e scala restano
quelle della fetta. Spazienzio può essere bloccato dal filtro dello strumento: in quel caso vale la regola dei tentativi.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| Mara, tutti | `docs/design/carriere/asset/tutorial/originali/mara-neutra-1.png` | a2a629d0e1d229ae794990b6863a5f165b4f84e766aaf9a4e790bad880ea7f40 |
| Spazienzio, tutti | `docs/design/carriere/asset/tutorial/originali/spazienzio-fumante-2.png` | f6b0c73649f027c1d2c07af0eb26034f366ff7c5fd5ce3e9c6d21bf8fff7ae23 |

| Asset | Battuta per la composizione, su S2 |
|---|---|
| mara-agitata | «Visto? Adesso ce l'hanno con me. Ce l'hanno sempre con me. Mi ascoltano, mi seguono...» |
| mara-sospettosa | «E scommetto che la mancia non me la vuoi dare. Ce l'hai scritto in faccia.» |
| mara-illuminata | «Aspetta. Quegli zigomi. Tu non sei Navaho, sei Sioux.» |
| mara-pensierosa | «Il cane. Era tutto calcolato. Ha provato a farsi bere da Spazienzio per somministrargli qualcosa.» |
| spazienzio-quasi-calmo | «VA BENE. VA BENE. SONO CALMO.» |
| spazienzio-soddisfatto | «FINALMENTE. NON VEDEVO L'ORA.» |
| spazienzio-serio | «EHI, FACCIA NUOVA, DICO A TE. TU LO SOPPORTI COME PARLA QUESTA?» |

### Mara — agitata

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, long black hair with the badly self-cut fringe, headphones, teal reflective vest over the dark hoodie, backpack straps, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her free hand: alarmed and jittery, eyes wide open, eyebrows raised, mouth open mid-sentence, her free hand raised with the palm out as if warning everyone about something terrible.

Avoid: any other change to the character, her framing or her position on the canvas; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Mara — sospettosa

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, long black hair with the badly self-cut fringe, headphones, teal reflective vest over the dark hoodie, backpack straps, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her free hand: deeply suspicious, a sideways glance with narrowed eyes, one eyebrow raised, lips pursed, her free hand lowered and half-closed, as if she has just caught someone lying.

Avoid: any other change to the character, her framing or her position on the canvas; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Mara — illuminata

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, long black hair with the badly self-cut fringe, headphones, teal reflective vest over the dark hoodie, backpack straps, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her free hand: a sudden revelation, eyes wide and shining, a crooked triumphant grin, her free hand raised with the index finger up, as in eureka.

Avoid: any other change to the character, her framing or her position on the canvas; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Mara — pensierosa

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, long black hair with the badly self-cut fringe, headphones, teal reflective vest over the dark hoodie, backpack straps, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her free hand: brooding over a theory, eyes turned up and to the side, lips pressed, her free hand bringing one finger to her chin, tapping it.

Avoid: any other change to the character, her framing or her position on the canvas; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Spazienzio — quasi calmo

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours, hand-inked European comic style, framing, size and position on the canvas, with his whole shoulders and arms inside it, and the transparent background. Change only his facial expression and the pose of his arms and fists: a forced, effortful calm: eyes closed, nostrils wide as he takes a long deep breath through clenched teeth, face still a little red, fists slowly unclenching at his sides. It must look comically strained. Nothing comes out of his nose or head.

Avoid: any other change to the character, his framing or his position on the canvas; mirroring; arms or fists cut off by the edges of the canvas; steam, smoke, vapour, drips or lines coming out of his nose or head; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Spazienzio — soddisfatto

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours, hand-inked European comic style, framing, size and position on the canvas, with his whole shoulders and arms inside it, and the transparent background. Change only his facial expression and the pose of his arms and fists: smug and eager satisfaction, a wide grin, eyebrows up, punching one fist into the open palm of his other hand, as if he has finally been given permission to fight. Nothing comes out of his nose or head.

Avoid: any other change to the character, his framing or his position on the canvas; mirroring; arms or fists cut off by the edges of the canvas; steam, smoke, vapour, drips or lines coming out of his nose or head; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Spazienzio — serio

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, short bristly beard, bald head, enormous shirtless body, tattoos, colours, hand-inked European comic style, framing, size and position on the canvas, with his whole shoulders and arms inside it, and the transparent background. Change only his facial expression and the pose of his arms and fists: stern and serious, leaning slightly toward the viewer, eyebrows low, mouth a straight hard line, pointing one thick finger straight at the viewer, as if asking a very important question. Nothing comes out of his nose or head.

Avoid: any other change to the character, his framing or his position on the canvas; mirroring; arms or fists cut off by the edges of the canvas; steam, smoke, vapour, drips or lines coming out of his nose or head; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Esiti del giro A

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| mara-agitata | [WebP](asset/tutorial/ritratti/mara-agitata.webp) | [Scheda](asset/tutorial/registro.md#mara-agitata-1) | **Approvato** (11 novembre 2026): «a me piacciono» |
| mara-sospettosa | [WebP](asset/tutorial/ritratti/mara-sospettosa.webp) | [Scheda](asset/tutorial/registro.md#mara-sospettosa-1) | **Approvato** (11 novembre 2026): «a me piacciono» |
| mara-illuminata | [WebP](asset/tutorial/ritratti/mara-illuminata.webp) | [Scheda](asset/tutorial/registro.md#mara-illuminata-1) | **Approvato** (11 novembre 2026): «a me piacciono» |
| mara-pensierosa | [WebP](asset/tutorial/ritratti/mara-pensierosa.webp) | [Scheda](asset/tutorial/registro.md#mara-pensierosa-1) | **Approvato** (11 novembre 2026): «a me piacciono» |
| spazienzio-quasi-calmo | [WebP](asset/tutorial/ritratti/spazienzio-quasi-calmo.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-quasi-calmo-1) | **Approvato** (11 novembre 2026): «a me piacciono» |
| spazienzio-soddisfatto | [WebP](asset/tutorial/ritratti/spazienzio-soddisfatto.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-soddisfatto-1) | **Approvato** (11 novembre 2026): «a me piacciono» |
| spazienzio-serio | [WebP](asset/tutorial/ritratti/spazienzio-serio.webp) | [Scheda](asset/tutorial/registro.md#spazienzio-serio-1) | (11 novembre 2026) «A me piacciono», ma d'accordo con la regia: il cuore con la freccia è finito sul braccio alto invece che sull'avambraccio. [Ritocco](#ritocco-del-giro-a-spazienzio-serio) col giro B |

## Giro B — Piera e Grappino

Piera non ha ancora un ritratto di dialogo: il primo, **piera-contenta**, nasce dal riferimento approvato dell'identikit con l'inquadratura
completa; gli altri tre modificano il suo originale (catena). Grappino è uno sprite a parte, ricavato dallo stesso riferimento.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| piera-contenta e Grappino | `docs/design/set-base/identikit/riferimenti/piera.png` | 8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c |
| piera-brilla, piera-offesa, piera-assonnata | `docs/design/carriere/asset/tutorial/originali/piera-contenta-<n>.png`, il tentativo conservato | da registrare prima di allegarlo |

| Asset | Composizione, su S2 |
|---|---|
| piera-contenta | «Tutta questa vivacità... mi ha messo sonno, quindi... mi sa che... prendo un altro... Grappino!» |
| piera-brilla | «Ancora te... che mi fai... venire sete...» |
| piera-offesa | «Ma che vuoi... sei te che hai... detto di aver...» |
| piera-assonnata | «Va bene... facciamo che... il prossimo giro... lo offro io...» |
| grappino-seduto, grappino-ringhia, grappino-russa | Senza battuta, lo sprite a terra davanti al bancone, a circa un quarto della larghezza da sinistra, alto circa un sesto dello schermo |

### Piera — contenta

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same woman for a visual-novel dialogue scene, without the dog. Keep her face, body, curly black hair in a messy bun with the pencil stuck in it, enormous black sweatshirt, the small glass of grappa in her hand, colours and hand-inked European comic style exactly as in the reference; do not redesign her. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: she is very broad, so frame her from a little further away than a normal half-body portrait: her whole shoulders and both arms, the glass included, fit inside the canvas with a small empty margin on both sides; from the top of her bun, with a small empty margin above it, down to her waist or a little below at the bottom edge; her eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: serene and contented, the approved face of the reference: heavy half-closed eyelids, a slow content smile, cheeks and nose flushed red from wine, raising the small glass a little.

Avoid: any other change to the character; the dog (it is a separate image); mirroring; mocking body-shaming distortions, the humour is in her attitude; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Piera — brilla

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, curly black hair in a messy bun with the pencil, enormous black sweatshirt, the small glass of grappa, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, the pose of her arms and head: tipsy and swaying, head tilted, eyes slightly crossed, a lopsided grin, raising the small glass as if for a toast.

Avoid: any other change to the character; the dog (it is a separate image); mirroring; mocking body-shaming distortions, the humour is in her attitude; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Piera — offesa

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, curly black hair in a messy bun with the pencil, enormous black sweatshirt, the small glass of grappa, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, the pose of her arms and head: offended and indignant, chin up, lips pushed out in a pout, eyebrows drawn together, her free hand on her chest, the glass held close.

Avoid: any other change to the character; the dog (it is a separate image); mirroring; mocking body-shaming distortions, the humour is in her attitude; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Piera — assonnata

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, curly black hair in a messy bun with the pencil, enormous black sweatshirt, the small glass of grappa, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, the pose of her arms and head: drowsy, eyelids drooping almost shut, a big slow yawn, head tilting to one side, the glass sagging in her hand.

Avoid: any other change to the character; the dog (it is a separate image); mirroring; mocking body-shaming distortions, the humour is in her attitude; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Grappino — seduto

~~~text
Using the dog in the attached approved character sheet as the reference, draw only the dog, as a standalone sprite for a visual-novel scene: the same small scruffy mixed-breed dog, short-haired, white with brown patches, unkempt and neglected, in the same hand-inked European comic style and colours. Canvas 1024 x 1024 pixels, square. The whole dog inside the canvas with a small empty margin around it, three-quarter view. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Pose: sitting, looking up with a scruffy, slightly dim, innocent expression, one ear up and one down.

Avoid: the woman or any other character; any change to the dog's look; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery, ground shadows that are not flat; photographic or 3D-rendered style.
~~~

### Grappino — ringhia

~~~text
Using the dog in the attached approved character sheet as the reference, draw only the dog, as a standalone sprite for a visual-novel scene: the same small scruffy mixed-breed dog, short-haired, white with brown patches, unkempt and neglected, in the same hand-inked European comic style and colours. Canvas 1024 x 1024 pixels, square. The whole dog inside the canvas with a small empty margin around it, three-quarter view. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Pose: growling, crouched forward, teeth bared, hackles raised, ears back, comically fierce for such a small dog.

Avoid: the woman or any other character; any change to the dog's look; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery, ground shadows that are not flat; photographic or 3D-rendered style.
~~~

### Grappino — russa

~~~text
Using the dog in the attached approved character sheet as the reference, draw only the dog, as a standalone sprite for a visual-novel scene: the same small scruffy mixed-breed dog, short-haired, white with brown patches, unkempt and neglected, in the same hand-inked European comic style and colours. Canvas 1024 x 1024 pixels, square. The whole dog inside the canvas with a small empty margin around it, three-quarter view. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Pose: curled up asleep on the floor, eyes shut, mouth slightly open as if snoring, with no sound effects or symbols.

Avoid: the woman or any other character; any change to the dog's look; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery, ground shadows that are not flat; photographic or 3D-rendered style.
~~~

### Ritocco del giro A: Spazienzio serio

Il proprietario ha approvato il giro A tranne questo ritratto, d'accordo con la regia: il cuore trafitto è finito sul braccio alto. Si
corregge insieme al giro B, modificando il suo originale, con la [mappa dei tatuaggi](../set-base/identikit.md#spazienzio-de-la-ucciso)
dell'identikit; l'esito va nella tabella del giro B. Il file consegnato mantiene il nome `spazienzio-serio.webp`.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| Immagine 1 | `docs/design/carriere/asset/tutorial/originali/spazienzio-serio-1.png` | 84331dedc266b43da1525f456b5e98ce402abac8ada42b7e8e60563d671c91d3 |
| Immagine 2 | `docs/design/carriere/asset/tutorial/originali/spazienzio-fumante-2.png` | f6b0c73649f027c1d2c07af0eb26034f366ff7c5fd5ce3e9c6d21bf8fff7ae23 |

~~~text
Edit the first attached dialogue portrait (image 1). Use the second attached image (image 2) only as the reference for the placement of his tattoos. Keep everything else in image 1 exactly the same: the same man, his face and stern expression, the finger pointing at the viewer, his body, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only the tattoos on his arms so that they sit as in image 2: on his right arm, on the left side of the picture, the skull on the shoulder and the anchor on the forearm; on his left arm, the pointing one, the snake on the shoulder and the heart pierced by an arrow on the forearm, not on the upper arm. The chicken-like eagle stays on his chest.

Avoid: any other change to the image; mirroring; extra or missing tattoos; any text, letters, numbers, logos, brands, signatures or watermarks; steam, smoke, drips or lines coming out of his nose or head; photographic or 3D-rendered style.
~~~

### Esiti del giro B

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| piera-contenta | [WebP](asset/tutorial/ritratti/piera-contenta.webp) | [Scheda](asset/tutorial/registro.md#piera-contenta-1) |  |
| piera-brilla | [WebP](asset/tutorial/ritratti/piera-brilla.webp) | [Scheda](asset/tutorial/registro.md#piera-brilla-2) |  |
| piera-offesa | [WebP](asset/tutorial/ritratti/piera-offesa.webp) | [Scheda](asset/tutorial/registro.md#piera-offesa-1) |  |
| piera-assonnata | [WebP](asset/tutorial/ritratti/piera-assonnata.webp) | [Scheda](asset/tutorial/registro.md#piera-assonnata-1) |  |
| grappino-seduto | [WebP](asset/tutorial/sprite/grappino-seduto.webp) (non conforme: tela e orecchie) | [Scheda](asset/tutorial/registro.md#grappino-seduto-2) |  |
| grappino-ringhia | [WebP](asset/tutorial/sprite/grappino-ringhia.webp) (non conforme: tela) | [Scheda](asset/tutorial/registro.md#grappino-ringhia-2) |  |
| grappino-russa | [WebP](asset/tutorial/sprite/grappino-russa.webp) (non conforme: tela) | [Scheda](asset/tutorial/registro.md#grappino-russa-2) |  |
| spazienzio-serio | [WebP](asset/tutorial/ritratti/spazienzio-serio.webp) (ritocco non riuscito) | [Scheda](asset/tutorial/registro.md#spazienzio-serio-3) |  |

## Giro C — sfondi, varianti, bici e combriccola

S1 e S3 sono sfondi nuovi nello stile di S2; le varianti modificano uno sfondo approvato o, per l'insegna spenta, l'originale di S1 appena
generato (catena). La bici e la combriccola sono sprite. Niente scritte: l'insegna di [BAR] la sovrappone il client.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| S1 e S3, immagine 1 | `docs/design/client-c0/r1/duel.png` | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e |
| S1 e S3, immagine 2 | `docs/design/carriere/asset/tutorial/originali/s2-interno-2.png` | d91fe39d1891e0f32edce7b667e46d0df6a6d2b11ba0108f83d1b54ccc9bc74a |
| S2 col disordine | `docs/design/carriere/asset/tutorial/originali/s2-interno-2.png` | d91fe39d1891e0f32edce7b667e46d0df6a6d2b11ba0108f83d1b54ccc9bc74a |
| S1 con l'insegna spenta | `docs/design/carriere/asset/tutorial/originali/s1-esterno-<n>.png`, il tentativo conservato | da registrare prima di allegarlo |
| Bici di Mara | `docs/design/set-base/identikit/riferimenti/mara.png` | 0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d |
| Combriccola | nessuno | — |

| Asset | Composizione: sfondo, sprite e battuta |
|---|---|
| s1-esterno | S1 con `mara-agitata` se approvato nel giro A, altrimenti `mara-neutra`. «Tutti Navaho qua. Eccone altri, sempre pronti a tutto pur di non stare nella loro terra promessa.» |
| s1-esterno-insegna-spenta | S1 con l'insegna spenta, senza ritratto né battuta |
| s2-interno-disordine | S2 col disordine e `spazienzio-quasi-calmo` se approvato, altrimenti `spazienzio-fumante`. «NON È MALE, LA FACCIA NUOVA.» |
| s3-dimmi-di-si | S3 senza ritratto, con una notifica in alto: «Sei ancora tra i vivi? Noi siamo tutti al Dimmi Di Sì.» |
| bici-mara | S1 con lo sprite a terra contro il muro a sinistra della porta, senza battuta |
| combriccola-davanti-alla-porta | S1 con le sagome davanti alla porta. Un amico: «...ma siamo sicuri che il posto sia questo?» |
| combriccola-in-fuga | S1 con le sagome, senza battuta |

### S1 — esterno del bar

~~~text
Background illustration for a visual-novel dialogue scene in the original card game Botte Micidiali. One opaque landscape image, 1536 x 1024 pixels, aspect ratio 3:2. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette of walnut, tobacco brown, dusty bottle green, oxblood burgundy, muted petrol and worn ivory. Use image 2, the approved interior of the same bar, only as the reference for drawing style, level of detail and mood, so that the two backgrounds belong together; do not copy its content.

The scene: the outside of a run-down Italian neighbourhood dive bar at night, seen at eye level from the street, nobody around. In the central third of the width: the entrance door with a worn frame and a small shop window beside it, warm dirty light inside, and above the door a plain rectangular lit sign panel with no lettering at all. To the left of the door, a stretch of stained wall where a bicycle could lean, left empty. Towards the sides: peeling plaster, a drainpipe, a rusty shutter, a dim street lamp, as disposable side context. The air of a place where you might catch tetanus. The lower quarter is plain worn pavement with no important details, because a dialogue box will cover it, and the centre stays uncluttered, because a character portrait will stand in front of it. Everything important must stay inside the central third.

Avoid: any text, letters, numbers, signs with writing, labels, logos, brands, signatures or watermarks; neon writing; people, faces, hands, silhouettes; playing cards, game interface, frames or borders; photographic or 3D-rendered style; dominant yellow-and-black colours.
~~~

### S1 — insegna spenta

~~~text
Edit the attached background illustration. Keep everything exactly the same: the street, the bar front, the door, the shop window, the wall, the street lamp, the colours, the hand-inked European comic style and the composition. Change only this: the rectangular sign panel above the door is switched off, dark and dull, with no glow around it. The rest of the lighting stays as it is.

Avoid: any other change to the image; any text, letters, numbers, logos, brands, signatures or watermarks; people; photographic or 3D-rendered style.
~~~

### S2 — col disordine

~~~text
Edit the attached background illustration. Keep everything exactly the same: the room, the counter, the shelves and bottles, the espresso machine, the walls, the wall lamps, the light, the colours, the hand-inked European comic style and the composition. Change only this: show the aftermath of a bar brawl, with one small table knocked over, two chairs lying on the floor, a stool on its side, broken glass and spilled drinks on the floor, a crooked picture frame. Keep the mess mostly on the floor and at the sides; the centre behind where a character will stand stays readable, and the lower quarter stays without important details.

Avoid: any other change to the image; people, faces, hands, silhouettes, blood; any text, letters, numbers, signs, labels, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### S3 — il Dimmi Di Sì

~~~text
Background illustration for a visual-novel dialogue scene in the original card game Botte Micidiali. One opaque landscape image, 1536 x 1024 pixels, aspect ratio 3:2. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette of walnut, tobacco brown, dusty bottle green, oxblood burgundy, muted petrol and worn ivory. Use image 2, the approved interior of a grimy dive bar from the same game, only as the reference for drawing style and level of detail; the place to draw is its exact opposite.

The scene: the interior of an expensive, trendy cocktail bar at night, seen at eye level, nobody in it. In the central third of the width: a sleek, spotless counter with designer stools, perfectly arranged premium bottles with blank labels, a few elaborate cocktails with tiny umbrellas and fruit on the counter. Towards the sides: velvet armchairs, hanging plants, soft indirect lighting, polished floor, as disposable side context. It must feel pretentious and overpriced, still drawn in the same hand-inked comic style, with cleaner, cooler colours than the dive bar. The lower quarter is plain polished floor with no important details, and the centre stays uncluttered. Everything important must stay inside the central third.

Avoid: any text, letters, numbers, signs with writing, labels, logos, brands, signatures or watermarks; neon writing; people, faces, hands, silhouettes; playing cards, game interface, frames or borders; photographic or 3D-rendered style; dominant yellow-and-black colours.
~~~

### Bici di Mara

~~~text
Draw only Mara's bicycle, as a standalone sprite for a visual-novel scene, in the same hand-inked European comic style and colours as the attached approved character sheet of its owner, a food-delivery rider: an old, battered city bike with a rusty frame, mismatched pedals, a wire basket, the handlebar grips wrapped in crumpled aluminium foil, seen from the side, standing on its kickstand. Canvas 1024 x 1024 pixels, square. The whole bike inside the canvas with a small empty margin around it. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture.

Avoid: the woman or any other character; any text, letters, numbers, logos, brand names or recognizable branding of any real bicycle or delivery company, signatures or watermarks; scenery; photographic or 3D-rendered style.
~~~

### Combriccola — davanti alla porta

~~~text
Draw a group of four generic young friends as solid, uniform, very dark charcoal silhouettes, with no faces, no internal details, no clothing details and no colours, for a visual-novel scene where minor characters stay anonymous. Canvas 1536 x 1024 pixels, landscape. The group stands at about the scale of people seen from a few metres away in a street, occupying roughly the central third of the width and the middle of the height, feet at about three quarters of the image height. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF). Recognizable only by their outlines and poses: standing close together and hesitating: one points up at something above them, one has arms crossed, one leans back doubtfully, one holds a phone.

Avoid: faces, eyes, features, inner lines, colours, gradients or highlights inside the silhouettes; any text, letters, numbers, logos, brands, signatures or watermarks; scenery; photographic or 3D-rendered style.
~~~

### Combriccola — in fuga

~~~text
Draw a group of four generic young friends as solid, uniform, very dark charcoal silhouettes, with no faces, no internal details, no clothing details and no colours, for a visual-novel scene where minor characters stay anonymous. Canvas 1536 x 1024 pixels, landscape. The group stands at about the scale of people seen from a few metres away in a street, occupying roughly the central third of the width and the middle of the height, feet at about three quarters of the image height. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF). Recognizable only by their outlines and poses: running away in a panic toward the right side, arms flailing, one looking back over the shoulder, one losing a shoe.

Avoid: faces, eyes, features, inner lines, colours, gradients or highlights inside the silhouettes; any text, letters, numbers, logos, brands, signatures or watermarks; scenery; photographic or 3D-rendered style.
~~~

### Esiti del giro C

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|

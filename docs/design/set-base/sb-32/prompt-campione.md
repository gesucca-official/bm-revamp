# SB-32 — Prompt del campione

> **Fase A ([D189](../../../set-base-decisioni.md#decisioni-del-proprietario)), 24 novembre 2026.** Prompt letterali del campione,
> committati prima di qualsiasi generazione, secondo la [guida di stile](guida-stile.md). Nessuna immagine è stata generata. Il campione
> serve a giudicare lo stile prima dei lotti; i lotti dell'intero set aspettano le carte finali e SB-31.

## Il campione

I 7 personaggi e tre carte di tipo diverso: un'azione legata col personaggio in scena, un oggetto senza personaggi, il token (che ha
anche un'illustrazione O9 candidata a restare: il confronto dice se la nuova vale la sostituzione).

| # | Illustrazione | `bindingName` | Tipo | Allegati |
|---|---|---|---|---|
| 1 | SPAZIENZIO DE LA UCCISO | `bruiser.character.BigBadBruiser` | Personaggio | spazienzio.png, s2-interno.webp |
| 2 | Mara Contromano | `base.character.Mara` | Personaggio | mara.png, s1-esterno.webp |
| 3 | Celestina Bucatina | `junkie.character.ToxicJunkie` | Personaggio | celestina.png, s2-interno.webp |
| 4 | Piera Pinot | `base.character.Pino` | Personaggio | piera.png, s2-interno.webp |
| 5 | Beppe Bulletta | `base.character.Gigi` | Personaggio | beppe.png, s2-interno.webp |
| 6 | Sergio Sommerso | `base.character.Cesira` | Personaggio | sergio.png, s2-interno.webp |
| 7 | Duccio Braccio Teso | `base.character.Rocco` | Personaggio | duccio.png, s2-interno.webp |
| 8 | Violenta Spruzzata di Seltz | `base.pino.bound.SpallataAlBancone` | Azione legata a Piera | piera.png, s2-interno.webp |
| 9 | Posacenere di Vetro | `base.items.PosacenereDiVetro` | Oggetto | s2-interno.webp, card.png |
| 10 | Bottiglia Spaccata | `com.tokens.BrokenBeerBottle` | Token | s2-interno.webp, card.png |

## Allegati

Allegare **solo** i file indicati per ciascun prompt, nell'ordine della tabella sopra, dopo averne controllato l'impronta (SHA-256 letti
dai file il 24 novembre 2026). Nessun altro allegato, nessuna immagine da Internet.

| File relativo alla radice del progetto | SHA-256 |
|---|---|
| `docs/design/set-base/identikit/riferimenti/spazienzio.png` | c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3 |
| `docs/design/set-base/identikit/riferimenti/mara.png` | 0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d |
| `docs/design/set-base/identikit/riferimenti/celestina.png` | 5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811 |
| `docs/design/set-base/identikit/riferimenti/piera.png` | 8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c |
| `docs/design/set-base/identikit/riferimenti/beppe.png` | 238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67 |
| `docs/design/set-base/identikit/riferimenti/sergio.png` | 27ceebba2f27067cdcd10f2e6c2d96f50f73c7d0db7afdd962cf0c2f0c7e6cbe |
| `docs/design/set-base/identikit/riferimenti/duccio.png` | 07a0170824c935625c3af8fd491a196cf6ce5efe61b12c3ffc5a9fe94ab80779 |
| `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp` | 00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0 |
| `docs/design/carriere/asset/tutorial/sfondi/s1-esterno.webp` | 19f020fe6689b2de7261dfe7c1bcff9608a6509539c7fb5ab18363a85687a1d6 |
| `docs/design/client-c0/r1/card.png` | 4e575d0d7dc9ca43e410ccf7e94b9e16adffd32bafbd6fa7039b6aa5302f259a |

## Istruzioni al proprietario

- **Ordine:** prima i sette personaggi, poi le tre carte. Se lo strumento non accetta due allegati, si allega solo il primo e si annota.
- **Testo:** incollare l'intero blocco inglese, paragrafo «Avoid» compreso, senza tradurlo né ritoccarlo. Un testo cambiato è un prompt
  nuovo da committare prima ([processo](guida-stile.md#processo)).
- **Formato:** quadrato, almeno 1024×1024, PNG originale se possibile. Se lo strumento dà altro, annotare formato e dimensioni effettive.
- **Tentativi:** uno per prompt, più un solo nuovo tentativo con lo stesso testo se il risultato viola il prompt in modo oggettivo.
  Spazienzio a torso nudo è già stato bloccato da uno strumento integrato: se succede, annotarlo e passare oltre.
- **Salvare** ogni originale come `docs/design/set-base/sb-32/originali/<bindingName>.png` (un nuovo tentativo: `-2`), senza ritoccarlo e
  senza aggiungerlo a git; annotare strumento, modello se esposto, data e l'eventuale riscrittura del prompt. Impronte e registro li
  prepara poi l'esecutore della Fase B ([provenienza](guida-stile.md#provenienza)).

## 1. SPAZIENZIO DE LA UCCISO

Nota della griglia: in piedi davanti al bancone, spalle in avanti e pugni stretti, rosso di rabbia; strisce ai pantaloni, mappa dei
tatuaggi rispettata.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same man, with the same face, body, proportions, beard, tattoos and colours. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the character.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject with a large, clear silhouette that still reads at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame him from the head to the knees, both arms and fists fully inside the canvas.

Subject: Spazienzio de la Ucciso stands in front of the bar counter, shoulders thrust forward and fists clenched, face flushed red with barely contained rage, jaw pushed forward, a vein throbbing at his temple. He is enormous and blocky: bald, a small head on huge shoulders, short bristly beard, massive belly and arms, always bare-chested. He wears baggy burgundy tracksuit trousers with plain pale stripes down the outer sides, socks and slides. Keep his tattoo map exactly: on the chest a badly drawn eagle that looks like a chicken; on his right arm (on the viewer's left) a skull on the shoulder and an anchor on the forearm; on his left arm (on the viewer's right) a snake on the shoulder and a heart pierced by an arrow on the forearm. No lettering in any tattoo. The side stripes on the trousers are the only intended difference from the reference.

Avoid: anything coming out of his nose; steam, smoke or vapour around his head; mirroring the character or moving any tattoo; a shirt, vest or undershirt; any change to his face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, also on bottles; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 2. Mara Contromano

Nota della griglia: davanti al muro del bar con la bici appoggiata, casco di stagnola in mano, indica qualcosa fuori campo.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same woman, with the same face, long black hair, headphones, clothes, backpack and colours. Do not copy its pose, framing or plain background. Attachment 2 is the approved evening exterior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the character. Leave its shop sign blank or out of frame.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with her own aqua-teal as the one strong colour. Warm, dirty light from the bar window and a street lamp, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject with a large, clear silhouette that still reads at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame her from the head to the knees, the big cubic delivery backpack clearly part of her silhouette.

Subject: Mara Contromano stands in front of the shabby outside wall of the bar, her battered bicycle leaning against the wall beside her. In one hand she holds her bicycle helmet covered in crumpled tin foil, never on her head; with the other hand she points sharply at something out of frame that only she can see, wide staring eyes with dark circles, a crooked knowing smile, as if she has just uncovered a conspiracy. Thin and angular, about thirty, long black hair past the shoulders, big headphones on her ears, an aqua-teal reflective vest over a dark hoodie, a large aqua-teal cubic thermal delivery backpack.

Avoid: the helmet on her head; the logo, name, colour scheme or any recognizable branding of a real delivery company; mirroring the character; any change to her face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, also on the bar sign; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 3. Celestina Bucatina

Nota della griglia: accovacciata sotto il bancone, tiene in alto una cosa appena raccolta e la esamina come un gioielliere; tuta sul
viola, lontana dal bordeaux.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same young woman, with the same face, red hair, body, clothes and belt bag. Do not copy its framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the character.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with her red hair and faded violet tracksuit as her own colours. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject with a large, clear, angular silhouette that still reads at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame her whole crouching figure.

Subject: Celestina Bucatina crouches on the dirty floor at the foot of the bar counter, one hand on the floor. With the other hand she holds up a small wrapped sweet she has just found under the counter and examines it closely, like a jeweller examining a precious stone. Sharp, calculating, lively eyes, the only healthy thing about her; dark circles, cracked lips, a crooked little smirk. About twenty-three and clearly adult, with a young face and tired, sagging skin. Thin, crooked, all angles; red hair shaved at the sides with a longer faded tuft. A baggy faded tracksuit clearly violet, not burgundy and not green; a belt bag stuffed with things picked up from the floor; mismatched shoes.

Avoid: syringes, powders, pills, drug paraphernalia or any recognizable drug; a burgundy or green tracksuit; making her look middle-aged; mirroring the character; any change to her face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, also on the sweet wrapper; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 4. Piera Pinot

Nota della griglia: seduta al bancone, il bicchierino alzato, Grappino ai piedi che abbaia.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same woman and the same small dog, with the same faces, bodies, clothes and colours. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the characters.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with her all-black clothes as her own colour. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black; her black clothes keep readable folds and highlights.

Composition for a tiny card tile: one centred subject with a large, clear, round silhouette topped by the bun, still readable at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame her whole seated figure with the dog at her feet.

Subject: Piera Pinot sits on a battered burgundy bar stool at the counter and raises her small glass of grappa in a slow, serene toast, eyes half closed, cheeks and nose red with wine, a slow contented smile. She is short, very fat and round, between fifty-five and sixty-five, all in black: a huge black sweatshirt, black leggings and black furry slippers; raven-black curly hair gathered badly in a bun held up by a pencil stuck in crooked, locks escaping everywhere. At her feet her dog Grappino barks: a small short-haired mongrel, white with brown patches, scruffy and badly kept.

Avoid: a different dog breed or colour; mirroring the characters; any change to her face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, also on bottles; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 5. Beppe Bulletta

Nota della griglia: appoggiato a una colonna del bar, braccia incrociate, lo sguardo tranquillo di chi ne ha viste tante.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same man, with the same face, beard, hair bun, overalls, T-shirt, tattoo and colours. Do not copy its framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the character.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his tobacco canvas overalls as his own colour. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject with a large, clear, solid silhouette that still reads at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame him from the head to the knees, crossed arms fully inside the canvas.

Subject: Beppe Bulletta leans with one shoulder against a wooden column of the bar, arms crossed, with the calm, unimpressed look of a man who has seen it all. Sturdy and planted, about forty-five, long thick beard, long hair gathered in a bun on top of his head. Tobacco-brown canvas work overalls with both straps up, shiny with grease at the knees; under them a black T-shirt of an invented extreme metal band with an illegible logo made of thorns and roots; another illegible thorny logo tattooed on his forearm. His pockets are empty: no tools in sight.

Avoid: tools sticking out of his pockets or in his hands; a readable band name or the logo of any real band; mirroring the character; any change to his face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 6. Sergio Sommerso

Nota della griglia: dritto in mezzo al bar, una mano in tasca, la sigaretta tenuta con sufficienza; il laccio slacciato che lui non ha
notato.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same man, with the same face, hair, suit, shirt, socks, shoes and colours. Do not copy its framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the character.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit and white shirt as his own colours. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject with a tall, thin, straight silhouette that still reads at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame his whole figure from head to shoes, so the untied shoelace stays visible.

Subject: Sergio Sommerso stands perfectly straight in the middle of the shabby bar, the tallest and thinnest man there and the only well-dressed one, out of place among the worn furniture. One hand in his trouser pocket; with the other he holds a thin lit cigarette with disdain. Sharp face, pointed cheekbones and chin, thin nose, short brown hair combed back, freshly shaved, about forty-five; a sarcastic half smile and one raised eyebrow, looking down on the viewer. Well-cut petrol-blue suit with no tie and no waistcoat, white shirt with an open collar, polished pointed shoes; mismatched socks, one argyle and one dark red; one shoelace untied, which he has not noticed.

Avoid: a cigarette pack; a bunch of keys at his belt; a tie or waistcoat; a grey suit; mirroring the character; any change to his face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 7. Duccio Braccio Teso

Nota della griglia: posa eroica, mano sul cuore, nell'altra mano il cocktail rosa con l'ombrellino; niente simboli espliciti.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the character artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same young man, with the same face, shaved head, T-shirt print, neck tattoo, trousers, boots and cocktail. Do not copy its framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the character.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, extremely ridiculous and satirical, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, his black T-shirt, and one small accent of pink in the cocktail, the only colour outside the palette. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject with a large, clear, puffed-up silhouette that still reads at 60 pixels wide; strong value contrast between the figure and the background; nothing essential in the outer 5% of the image. Frame him from the head to the knees, the cocktail clearly visible.

Subject: Duccio Braccio Teso strikes a solemn heroic pose in the bar, chin high, gazing proudly at a distant horizon, his right hand on his heart. In the other hand he holds a sweet pink cocktail with a paper umbrella, a cherry and a spiral straw, little finger raised. About twenty-two, stocky and soft, small belly and short arms, chest puffed out with nothing under it; shaved head with a little regrowth and an already receding hairline. A tight black short-sleeved T-shirt printed with a generic white eagle with spread wings, badly printed and cracked; camouflage trousers with pockets and oversized combat boots. On his neck a single tattoo: a circle with a cross inside where the tattooist left out the left half of the circle and the left arm, and the tip of the lower arm is detached like a dot, so it reads as a question mark that still vaguely resembles what he wanted.

Avoid: raised-arm salutes; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; extra tattoos of rayed circles; mirroring the character; any change to his face; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands; card frames, borders or interface; other people in focus; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 8. Violenta Spruzzata di Seltz

Nota della griglia: «Piera spinge con la spalla un avversario contro il bancone e intanto si versa un seltz». L'appunto viene dal nome di
classe (`SpallataAlBancone`); il nome finale della carta parla di una spruzzata violenta, e una sola azione si legge meglio a 60 px.
**Scelta della regia di Fase A, da confermare:** Piera spruzza il seltz in faccia all'avversario, senza alzarsi dallo sgabello.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw exactly the same woman and the same small dog, with the same faces, bodies, clothes and colours. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: use it for the setting, palette and light, simplified and kept darker than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features, as in both attachments. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with her all-black clothes as her own colour. Warm, dirty light from the wall lamps, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one single, immediately readable action; Piera and the spray jet form one large clear shape that still reads at 60 pixels wide; strong value contrast; nothing essential in the outer 5% of the image. The opponent is only a dark shadowy figure at the edge, without a recognizable face.

Subject: Without getting off her battered burgundy bar stool at the counter, Piera Pinot calmly aims an old glass soda siphon and fires a violent jet of fizzing soda water straight into the face of a shadowy opponent, who recoils dripping. In her other hand she still holds her small glass of grappa, unspilled; her face stays serene and drowsy, eyes half closed. She is short, very fat and round, all in black: a huge black sweatshirt, black leggings, black furry slippers; raven-black curly hair in a messy bun held by a crooked pencil. At her feet her dog Grappino, a small short-haired mongrel, white with brown patches, scruffy, barks at the opponent.

Avoid: a recognizable face or identity for the opponent; any other member of the cast; a label on the siphon; mirroring the character; any change to her face; blood; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, also on bottles; card frames, borders or interface; crowds; likeness of any real person; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 9. Posacenere di Vetro

Nota della griglia: un posacenere di vetro spesso, pieno di mozziconi, sul tavolo.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the object artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved interior of the dive bar where the game takes place: use it for the surface, palette and light. Attachment 2 is the approved art-direction mockup: look only at the illustration inside the central card, for its close framing, bold readable shapes, inked contours and painted shading. Do not copy the man in it, the card frame, the paper sheet, the lettering or the table scene.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory. Warm, dirty light from one side, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred object, large, filling most of the frame, seen from a slightly high three-quarter angle, with a clear silhouette that still reads at 60 pixels wide; strong value contrast against a dark, simplified background; nothing essential in the outer 5% of the image. No people and no hands.

Subject: A heavy, thick, old glass ashtray, slightly greenish, chipped on one edge, overflowing with cigarette butts and grey ash, sits on a scarred, sticky walnut bar table with a glass ring stain beside it. It looks solid, heavy and conveniently within reach, quietly menacing, as if someone might pick it up and use it. A thin curl of smoke rises from one butt that is still lit.

Avoid: people, hands or faces; brand marks on the butts or on the ashtray; a green ceramic ashtray; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands; card frames, borders or interface; clutter of other objects; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## 10. Bottiglia Spaccata (token)

Nota della griglia: il collo di una bottiglia verde spaccata, coi bordi taglienti che luccicano.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the token artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved interior of the dive bar where the game takes place: use it for the surface, palette and light. Attachment 2 is the approved art-direction mockup: look only at the illustration inside the central card, for its close framing, bold readable shapes, inked contours and painted shading. Do not copy the man in it, the card frame, the paper sheet, the lettering or the table scene.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture. Palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory. Warm, dirty light from one side, one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one single object, very simple, large and centred, diagonal across the frame, with a clear silhouette that still reads at 60 pixels wide; a dark, almost empty background; nothing essential in the outer 5% of the image. No people and no hands.

Subject: The broken neck of a green beer bottle lies on a scarred walnut bar table, its jagged crown of glass pointing upward at an angle, the sharp edges glinting with small hard highlights. A few shards and a drop of beer around it. It reads at a glance as an improvised weapon.

Avoid: people, hands or faces; a whole bottle; a label; blood; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands; card frames, borders or interface; clutter of other objects; photographic or 3D-rendered style; dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## Cosa giudica il proprietario

Per ciascuna immagine: somiglianza col riferimento, leggibilità in piccolo (si giudica ridotta a 60 px e a 252 px), coerenza con lo
sfondo del tavolo e fra le dieci. In più le scelte aperte, che sono anche le domande della chiusura della Fase A:

1. **Inquadratura dei personaggi:** figura in scena da carta (questi prompt) oppure lo stesso taglio dei ritratti delle carriere,
   mezzo busto su fondo del bar?
2. **Seltz:** spruzzata (questo prompt) o la spallata contro il bancone dell'appunto della griglia?
3. **O9 da conservare:** quali delle candidate della [guida](guida-stile.md#illustrazioni-o9-conservabili), dopo averle guardate.
4. **Originali:** in git, come i riferimenti dell'identikit, o fuori, come O9?

## Esiti

Da compilare dopo la generazione: file, scheda del registro, giudizio del proprietario.

| # | `bindingName` | File | Scheda | Giudizio del proprietario |
|---|---|---|---|---|
| 1 | `bruiser.character.BigBadBruiser` | [anteprima](anteprime/bruiser.character.BigBadBruiser.webp) · [variante](anteprime/bruiser.character.BigBadBruiser-2.webp) · [secondo giro](anteprime/bruiser.character.BigBadBruiser-3.webp) | [Tentativo 1](registro.md#tentativo-1--bruisercharacterbigbadbruiser) | |
| 2 | `base.character.Mara` | [anteprima](anteprime/base.character.Mara.webp) | [Tentativo 2](registro.md#tentativo-2--basecharactermara) | |
| 3 | `junkie.character.ToxicJunkie` | [anteprima](anteprime/junkie.character.ToxicJunkie.webp) | [Tentativo 3](registro.md#tentativo-3--junkiecharactertoxicjunkie) | |
| 4 | `base.character.Pino` | [anteprima](anteprime/base.character.Pino.webp) · [variante](anteprime/base.character.Pino-2.webp) · [secondo giro](anteprime/base.character.Pino-3.webp) · [ultimo ritocco](anteprime/base.character.Pino-4.webp) | [Tentativo 4](registro.md#tentativo-4--basecharacterpino) | |
| 5 | `base.character.Gigi` | [anteprima](anteprime/base.character.Gigi.webp) | [Tentativo 5](registro.md#tentativo-5--basecharactergigi) | |
| 6 | `base.character.Cesira` | [anteprima](anteprime/base.character.Cesira.webp) · [variante](anteprime/base.character.Cesira-2.webp) · [secondo giro](anteprime/base.character.Cesira-3.webp) · [ultimo ritocco](anteprime/base.character.Cesira-5.webp) | [Tentativo 6](registro.md#tentativo-6--basecharactercesira) | |
| 7 | `base.character.Rocco` | [anteprima](anteprime/base.character.Rocco.webp) · [variante](anteprime/base.character.Rocco-2.webp) | [Tentativo 7](registro.md#tentativo-7--basecharacterrocco) | |
| 8 | `base.pino.bound.SpallataAlBancone` | [anteprima](anteprime/base.pino.bound.SpallataAlBancone.webp) · [variante](anteprime/base.pino.bound.SpallataAlBancone-2.webp) · [secondo giro](anteprime/base.pino.bound.SpallataAlBancone-3.webp) · [ultimo ritocco](anteprime/base.pino.bound.SpallataAlBancone-4.webp) | [Tentativo 8](registro.md#tentativo-8--basepinoboundspallataalbancone) | |
| 9 | `base.items.PosacenereDiVetro` | [anteprima](anteprime/base.items.PosacenereDiVetro.webp) | [Tentativo 9](registro.md#tentativo-9--baseitemsposaceneredivetro) | |
| 10 | `com.tokens.BrokenBeerBottle` | Rifiuto; nessun file · [variante](anteprime/com.tokens.BrokenBeerBottle-2.webp) · [secondo giro](anteprime/com.tokens.BrokenBeerBottle-3.webp) | [Tentativo 10](registro.md#tentativo-10--comtokensbrokenbeerbottle) | |

# SB-32 — Lotto 6: prompt letterali delle carte di Sergio e Duccio

Allegare soltanto, in quest’ordine, il riferimento del personaggio e lo sfondo indicati sotto il titolo di ogni carta. Impronte SHA-256 da verificare:

- `docs/design/set-base/identikit/riferimenti/sergio.png`: `27ceebba2f27067cdcd10f2e6c2d96f50f73c7d0db7afdd962cf0c2f0c7e6cbe`
- `docs/design/set-base/identikit/riferimenti/duccio.png`: `07a0170824c935625c3af8fd491a196cf6ce5efe61b12c3ffc5a9fe94ab80779`
- `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0`
- `docs/design/carriere/asset/tutorial/sfondi/s1-esterno.webp`: `19f020fe6689b2de7261dfe7c1bcff9608a6509539c7fb5ab18363a85687a1d6`

I blocchi seguenti sono i testi letterali da inviare, senza modifiche. Ventidue carte in due parti, undici di Sergio e undici di Duccio; identificatori dal file del set, congelati da [D213](../../../set-base-decisioni.md#decisioni-del-proprietario). Sergio non ha un’ultima risorsa sua (usa la generica); i ritratti dei due sono già scelti nel campione (Sergio 6 e Duccio 3, [D193](../../../set-base-decisioni.md#decisioni-del-proprietario)) e non si rigenerano; le generiche che li nominano (Sgambetto, Mano Lesta, Fasciatura d’Emergenza) vanno col lotto delle generiche. Soggetti dalle note d’illustrazione della [griglia](../griglia.md). La parte comune è quella del lotto 5 ([D218](../../../set-base-decisioni.md#decisioni-del-proprietario)); le eccezioni di D218 (3) non valgono qui. Dalla [guida di stile](guida-stile.md): per Sergio abito blu petrolio e non grigio, laccio slacciato, calzini spaiati, nessun pacchetto; per Duccio il solo tatuaggio a punto interrogativo, l’aquila senza simboli intorno, il cocktail rosa come unico colore fuori palette e nessun simbolo vero.

Scelte della regia:

- La sigaretta di Sergio e il cocktail di Duccio compaiono solo dove il soggetto li nomina, come Grappino nel lotto 4, per tenere le mani coerenti.
- Messo in Conto e Fiuto per gli Affari: l’oggetto preso e rivenduto è una bottiglietta senza etichetta; le banconote sono carta liscia, senza cifre né ritratti.
- Segreto di Pulcinella: «tutto il bar si gira» diventa tre avventori in ombra che si voltano, non una folla.
- (Dis)onore alla Bandiera: unica eccezione al divieto di bandiere della guida, perché la nota la chiede; è accartocciata e se ne intravedono soltanto i colori nelle pieghe, senza stemmi né ornamenti.
- E Allora...? e Nocche Sbucciate: niente sangue, come in tutti i lotti; naso rosso e gonfio, nocche sbucciate e arrossate.
- Stoico come un Busto di Bronzo: il mezzobusto immaginato è una visione in un alone tenue, su un piedistallo liscio senza iscrizioni.
- Rinfrescata Arrogante e Rialziamoci e Partite! sono all’aperto, davanti al bar: allegano `s1-esterno.webp` al posto di `s2-interno.webp`, come chiede la guida per le scene fuori dal bar.

## Parte 1: Sergio

### 1. Messo in Conto

`base.cesira.LoMettoInConto`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Leaning on the bar counter, Sergio slips a small unlabelled bottle from the counter into the inside pocket of his jacket in one smooth, practised motion, while with his other hand he gives a knowing two-finger wave to the shadowy barman behind the counter, who nods back.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 2. Discutiamone in Privato

`base.cesira.bound.NeRiparliamoFuori`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Sergio, one eyebrow raised, points at the bar's door with two fingers held together, without even looking at it, his thin cigarette in his other hand; in front of him a shadowy opponent freezes mid-swing, his fist stopped in the air, his head turning toward the door.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 3. Tecnica Manipolatoria

`base.cesira.bound.Battutina`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Holding a tall glass of tonic water with ice and a slice of lemon just lowered from his lips, Sergio leans in and murmurs into the ear of a shadowy opponent; the opponent recoils with his shoulders hunched and his face turned away, his ear and neck flushing deep red with embarrassment.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 4. Fare il Vago

`base.cesira.bound.FareIlVago`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: In the middle of a bar brawl Sergio stands perfectly still, gazing up at the ceiling and blowing a thin plume of smoke upward from his cigarette, utterly indifferent, while two wooden chairs fly through the air around him, one passing just behind his head, thrown from outside the scene.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 5. Opportuna Distrazione

`base.cesira.OhGuardaLa`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Sergio points with one long index finger past a shadowy opponent's shoulder at something behind him; the opponent turns his head to look, and in that same instant Sergio's other hand, empty, drives a quick, sharp knuckle jab into the opponent's exposed ribs, making him buckle sideways.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 6. Buon Vecchio Ricatto

`base.cesira.Ricatto`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Sergio calmly holds up a plain smartphone without any logo toward a shadowy opponent, its glowing screen showing only a blurry, indistinct photo, while his other hand holds his thin cigarette; the opponent, who had his fist raised to strike, lowers it slowly, shoulders sagging, his visible ear and neck gone pale.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; a readable phone screen, apps or interface; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 7. Copione Già Visto

`base.cesira.LoSapevo`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: With a bored expression Sergio casually swats aside a shadowy opponent's incoming punch with the back of his hand, deflecting the fist past his shoulder, while his other hand keeps the thin cigarette at his lips without missing a puff; the opponent stumbles past him, off balance.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 8. Conto Salato

`base.cesira.ContoSalato`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: With a sarcastic half-smile Sergio slaps a very long paper receipt across the face of a shadowy opponent: the receipt unrolls in a long curling strip that wraps around the opponent's head as he staggers back. The receipt is plain paper with only faint grey smudges, no readable print.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; readable print on the receipt; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 9. Segreto di Pulcinella

`base.cesira.LoSannoTutti`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Sergio bends down to the ear of a seated shadowy patron and whispers behind one raised hand; the patron's jaw drops and the glass slips from his fingers, while in the dim background three shadowy patrons turn their heads toward them at once.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 10. Scherzo Oltre il Limite

`base.cesira.Malelingue`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Sergio stands still with a sarcastic half-smile, one hand in his trouser pocket and his thin cigarette in the other, speaking; in front of him a shadowy opponent's head snaps sideways as if struck by an invisible slap, with small jagged comic impact bursts, empty of any text, bursting against his cheek from Sergio's direction.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; speech balloons; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 11. Fiuto per gli Affari

`base.cesira.LoRivendo`

Allegati, in ordine: `sergio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his petrol-blue suit as his own colour; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Sergio hands a small unlabelled bottle to an eager shadowy patron with one hand and, with the other, tucks a folded wad of plain banknotes into his breast pocket without even glancing at it, already looking away, bored. The banknotes are plain muted green-grey paper with no numbers, portraits or print.

Sergio is tall and very thin, about forty-five, with a long neck and a sharp, angular face: pointed cheekbones and chin, a thin nose, a sarcastic half-smile and one raised eyebrow; he carries his chin high and looks down on everyone. He has short, wavy brown hair. He wears a well-cut suit, clearly petrol blue and not grey, with no tie and no waistcoat, over a white shirt with an open collar, a plain brown leather belt, polished pointed shoes with one shoelace untied, and mismatched socks, one argyle and one dark red. He is the only well-dressed man in the bar. His thin lit cigarette, held with disdain between two fingers, appears only where the subject mentions it; never a cigarette pack. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: mirroring the character; changing his face; making him stocky, young or bearded; a grey or slate suit; a tie or waistcoat; a bunch of keys at his belt; a cigarette pack; banknotes with numbers, portraits or print; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on bottles, glasses, paper and screens; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

## Parte 2: Duccio

### 12. Prima gli Italiani

`base.rocco.PrimaIo`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his small pink cocktail as the only colour outside the palette; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: At the bar counter Duccio shoves his way in front of two shadowy patrons waiting their turn, pushing between them with his chest puffed out and his chin raised, his pink cocktail held at shoulder height with the little finger raised; the patrons stumble aside.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 13. Rinfrescata Arrogante

`base.rocco.bound.Colpetto`

Allegati, in ordine: `duccio.png`, `s1-esterno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved exterior of the same dive bar at night: set the scene on the pavement in front of its facade, with the door, the lit window and the wall lamps simplified, darker and less sharp than the subject; the sign above the door stays blank.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: On the pavement in front of the bar Duccio bends over a plain cast-iron public drinking fountain and gulps from its jet, one hand on the fountain, while driving the elbow of his other arm backward into the stomach of a shadowy opponent behind him, who doubles over. The fountain has no emblem or inscription.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 14. Rialziamoci e Partite!

`base.rocco.bound.MiRialzo`

Allegati, in ordine: `duccio.png`, `s1-esterno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved exterior of the same dive bar at night: set the scene on the pavement in front of its facade, with the door, the lit window and the wall lamps simplified, darker and less sharp than the subject; the sign above the door stays blank.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his small pink cocktail as the only colour outside the palette; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Dusty and dishevelled, Duccio gets up from the pavement in front of the bar, rising from one knee with his right hand on his heart and, in his other hand, his pink cocktail, miraculously intact and full, little finger raised; far down the dark street two of his shadowy cronies in plain clothes walk away with their backs turned, abandoning him.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 15. (Dis)onore alla Bandiera

`base.rocco.bound.AlzoLaVoce`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Duccio cowers behind a large crumpled flag that he holds up in front of himself with both hands like a shield, peeking over its top edge with frightened eyes, while a shadowy opponent's punch thuds into the cloth. The flag is seen mostly folded and at an angle, so that only glimpses of muted green, white and red show in its folds; it has no emblem, no coat of arms and no ornament.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; any flag other than the crumpled one he hides behind; a clearly displayed flag; emblems, coats of arms, text or ornaments on the cloth; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 16. Non Mi Hai Fatto Niente

`base.rocco.NeHoPreseDiPeggio`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Covered in bruises, his T-shirt torn at the collar, Duccio charges head down across the bar at a shadowy opponent with a last furious yell, mouth wide open, fists clenched at his sides, a chair toppling in his wake. Bruises only, no wounds.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 17. Nocche Sbucciate

`base.rocco.NoccheSbucciate`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Duccio has just landed a punch on a shadowy opponent, who reels away; Duccio now stares at his own raised fist, his knuckles scraped and reddened, with tears welling in his eyes and his lower lip trembling as he tries to look tough. No blood.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 18. Stoico come un Busto di Bronzo

`base.rocco.Incassare`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: A shadowy opponent's fist sinks into Duccio's soft belly; Duccio takes the blow with his chest puffed out, his chin up and his eyes glistening with held-back tears, while above his head, in a faint dream-like glow, floats his own imagined heroic bronze bust, chin raised, on a plain blank plinth without any inscription or emblem.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 19. E Allora...?

`base.rocco.EAllora`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: His nose red and swollen from a blow, Duccio shrugs one shoulder with a blank, so-what expression and throws a clumsy return punch into the jaw of a shadowy opponent, whose head snaps back. No blood.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 20. Craniata Patriottica

`base.rocco.Capocciata`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Duccio headbutts a shadowy opponent forehead first; at the impact both of them reel back dazed, the opponent's head thrown back and his face lost in shadow, with small cartoon stars and swirls circling over both heads.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 21. La Storia la Scrivono i Vincitori

`base.rocco.TeLoSpiegoIo`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory, with his small pink cocktail as the only colour outside the palette; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Duccio jabs his index finger hard into a shadowy opponent's chest, mouth wide open mid-lecture, puffed up with self-importance, pushing the opponent back a step with each jab; in his other hand he holds his pink cocktail with the little finger raised.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

### 22. Testa Dura

`base.rocco.TestaDura`

Allegati, in ordine: `duccio.png`, `s2-interno.webp`.

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same man with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent action in motion with physical force and impact, not a posed figure. Make the anatomy of arms and hands coherent and their ownership unambiguous: every person has exactly two arms and two hands, and no extra or detached limb appears anywhere. Draw every tool and object as one coherent, physically plausible object with a single recognizable shape, no doubled, fused or impossible parts, held by a hand that grips it naturally.

Subject: Duccio has just split a wooden bar table in two with his forehead: the halves collapse to either side with splinters flying, and Duccio stands swaying, cross-eyed and dazed but proud, chest out, a red bump rising on his shaved forehead.

Duccio is about twenty-two and clearly adult: short, stocky and soft, with short arms and a small potbelly showing under his T-shirt; he puffs out his chest, but there is nothing underneath. His head is shaved, with a little stubbly regrowth and an already receding hairline; his face is blotchy and red, with a red nose. He wears a tight, worn black short-sleeved T-shirt printed with a cracked white spread-wing eagle and nothing around it, camouflage cargo trousers and oversized black combat boots. On the side of his neck is his only tattoo: a circle with a cross inside, with the left half of the circle and the left arm of the cross left out and the tip of the lower arm detached like a dot, so that it reads as a question mark. His pink cocktail, in a tall curved glass with a paper umbrella, a cherry and a curly straw, held with the little finger raised, appears only where the subject mentions it. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: raised-arm salutes or any arm stretched straight up or forward with a flat hand; flags; runes; swastikas; fasces; complete Celtic crosses or any real political or hate symbol; any symbol around the eagle; tattoos other than the one on his neck; mirroring the character; changing his face; making him muscular, tall or older; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, labels, logos or brands, including on clothing and glasses; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

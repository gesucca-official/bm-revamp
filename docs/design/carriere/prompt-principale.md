# Campagna principale — prompt delle illustrazioni

21 novembre 2026. Il materiale visivo che manca alla [campagna principale](principale-dialoghi.md) dopo il tutorial, con le liste
approvate dal proprietario lo stesso giorno («si», alla domanda «Approvi le liste della principale e scrivo i prompt?»). L'elenco e i
ripieghi sono in [illustrazioni.md](illustrazioni.md#campagna-principale). Tre giri, perché il giudizio non diventi un muro di immagini:

- **E:** i ritratti base di Celestina, Beppe, Duccio e Sergio, dai riferimenti approvati dell'identikit;
- **F:** le altre espressioni dei quattro e Mara seria, modificando i ritratti base approvati nel giro E;
- **G:** sfondi, varianti e la sagoma del padrone del Dimmi Di Sì.

Si segue la [specifica degli asset](specifica-asset.md). Il processo è quello del [tutorial](prompt-tutorial-resto.md): prompt letterali
committati prima di generare (D11 del [piano C4](../../client-c4-plan.md#decisioni-del-proprietario)), registro completo in
`docs/design/carriere/asset/tutorial/registro.md`, nessun riferimento esterno al progetto. La cartella resta quella della
[specifica](specifica-asset.md#file-e-registro), anche se il nome dice «tutorial»: è la cartella degli asset delle carriere, e il
prototipo la legge già. Le versioni con la bocca dei personaggi nuovi sono rimandate.

## Istruzioni comuni

- **Deroga del proprietario (21 novembre 2026):** «affinché le faccia tutte in una volta». I tre giri si generano di seguito, nell'ordine
  E, F, G, senza fermarsi per il giudizio; il giro F allega i ritratti base appena generati nel giro E. Il proprietario giudica tutto alla
  fine: se boccia un ritratto base, le espressioni nate da quello si rifanno. La regola che segue resta per i giri futuri.
- **Un giro per volta,** nell'ordine E, F, G. Il giro successivo parte dopo il giudizio del proprietario sul precedente, perché un giudizio
  può cambiare i prompt che seguono. Il giro G non dipende da E ed F: il proprietario può anticiparlo.
- **Ogni blocco inglese va incollato integralmente,** paragrafo «Avoid» compreso, con i soli allegati della tabella del giro, dopo averne
  controllato l'impronta.
- **Tentativi:** uno per prompt. Si fa un solo nuovo tentativo con lo stesso testo se il risultato viola il prompt in modo oggettivo
  (scritte, marchi, personaggio diverso, inquadratura o fondo sbagliati, braccia tagliate, simboli vietati, cambi non richiesti). Se lo
  strumento blocca un prompt non si insiste: si annota e si passa al successivo.
- **Catene:** nel giro F ogni prompt allega l'originale del ritratto base approvato nel giro E. Se ne registra l'impronta prima di
  allegarlo, nella tabella del giro.
- **File e nomi:** come dice la [specifica](specifica-asset.md#file-e-registro). Ritratti in `ritratti/`, sfondi e varianti in `sfondi/`,
  la sagoma in `sprite/`, tutti WebP, con trasparenza dove serve.
- **Composizioni di prova:** alla fine di ogni giro, una composizione orizzontale (1366×768) per ogni asset nuovo, con lo stesso script e la
  stessa finestra di dialogo del tutorial e la battuta della tabella del giro, in `composizioni/` col nome `<giro>-<asset>.webp` (per
  esempio `e-celestina-furba.webp`).
- **Esiti:** chi registra riempie la tabella del giro (asset, file, scheda) e lascia vuota la colonna del giudizio.

## Giro E — i ritratti base dei quattro

Ognuno nasce dal suo riferimento approvato dell'identikit, con l'inquadratura completa dei ritratti di dialogo. L'espressione del ritratto
base è la prima della lista di ciascuno, quella che le scene usano di più. Per Duccio valgono le regole sui simboli
dell'[identikit](../set-base/identikit.md#duccio-braccio-teso): se lo strumento blocca il prompt, vale la regola dei tentativi.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| celestina-furba | `docs/design/set-base/identikit/riferimenti/celestina.png` | 5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811 |
| beppe-tranquillo | `docs/design/set-base/identikit/riferimenti/beppe.png` | 238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67 |
| duccio-fiero | `docs/design/set-base/identikit/riferimenti/duccio.png` | 07a0170824c935625c3af8fd491a196cf6ce5efe61b12c3ffc5a9fe94ab80779 |
| sergio-annoiato | `docs/design/set-base/identikit/riferimenti/sergio.png` | 27ceebba2f27067cdcd10f2e6c2d96f50f73c7d0db7afdd962cf0c2f0c7e6cbe |

| Asset | Battuta per la composizione, su S2 |
|---|---|
| celestina-furba | «Che ci fate qui? Il Serraglio è chiuso.» |
| beppe-tranquillo | «Cambiare una serratura è un lavoraccio, uno spuntino è proprio quello che ci vuole.» |
| duccio-fiero | «Fermo lì. Dove ti credi di andare, zecca che non sei altro, eh?» |
| sergio-annoiato | «Bene, sfogare vi siete sfogati. Direi che possiamo andare avanti con le nostre vite. Buona serata, perdenti!» |

### Celestina — furba

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same young woman for a visual-novel dialogue scene. Keep her face, thin body, red hair shaved at the sides with a longer bleached tuft, the slouchy tracksuit, the bum bag full of stuff, colours and hand-inked European comic style exactly as in the reference; do not redesign her. Keep the tracksuit a washed-out plum purple, clearly purple and not burgundy. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: no longer crouching, she stands hunched and crooked, all angles; her whole shoulders and both arms fit inside the canvas with a small empty margin on both sides; from the top of her hair, with a small empty margin above it, down to her waist or a little below at the bottom edge; her eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: sly and calculating, a crooked little smirk, sharp alert eyes, the only healthy thing about her, one eyebrow up, holding up between two fingers the wrapped sweet she found under the counter and examining it like a jeweller examines a stone.

Avoid: any other change to the character; syringes, powders, pills or any recognizable drug paraphernalia; making her look older than about twenty-three; a burgundy or green tracksuit; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Beppe — tranquillo

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same man for a visual-novel dialogue scene. Keep his face, long full beard, long hair tied in a bun, the tobacco-brown canvas overalls with both straps up and grease stains, the black band T-shirt with its illegible spiky invented logo, the forearm tattoo, empty pockets, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: his whole shoulders and both arms, crossed on his chest, fit inside the canvas with a small empty margin on both sides; from the top of his bun, with a small empty margin above it, down to his waist or a little below at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: calm and unbothered, the quiet look of someone who has seen it all, a faint easy half smile under the beard, arms crossed.

Avoid: any other change to the character; tools in his pockets or hands; readable writing or real band names or logos on the T-shirt or tattoo; a caricatured look; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Duccio — fiero

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same young man for a visual-novel dialogue scene. Keep his face, shaved head with a little regrowth and a receding hairline, stocky soft body with a small belly, the tight black short-sleeved T-shirt with the cracked, badly printed white eagle with spread wings, the question-mark tattoo on his neck, the pink sweet cocktail with a paper umbrella, a cherry and a spiral straw, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: his whole shoulders and both arms, the cocktail included, fit inside the canvas with a small empty margin on both sides; from the top of his head, with a small empty margin above it, down to his waist or a little below at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: solemn heroic pride, chin up, chest puffed out, a proud gaze into the distance, one hand on his heart and the other holding the pink cocktail with the little finger raised. It must look ridiculous and satirical.

Avoid: any other change to the character; raised-arm salutes, flags, runes, swastikas, fasces, complete or real Celtic crosses, or any real political symbol; extra tattoos; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Sergio — annoiato

~~~text
Edit the attached approved character sheet into a single half-body portrait of the same man for a visual-novel dialogue scene. Keep his sharp face with pointed cheekbones and chin, thin nose, short brown hair, the elegant petrol-blue suit with no tie and no waistcoat over a white shirt with an open collar, the thin lit cigarette, colours and hand-inked European comic style exactly as in the reference; do not redesign him. Keep the suit clearly petrol blue, not slate grey. Canvas 1024 x 1536 pixels, portrait 2:3. Framing: he is tall and lean; his whole shoulders and both arms fit inside the canvas with a small empty margin on both sides; from the top of his head, with a small empty margin above it, down to his waist or a little below at the bottom edge; his eyes at about one quarter of the image height. Three-quarter view, turned toward the viewer. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF) with no shadows, gradients or texture. Expression: bored and superior, heavy-lidded eyes looking down at the viewer, a faint sarcastic half smile, one eyebrow slightly raised, one hand in his trouser pocket and the other holding the thin cigarette with disdain.

Avoid: any other change to the character; a bunch of keys on his belt; a cigarette pack or anything with writing; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Esiti del giro E

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| celestina-furba | | | |
| beppe-tranquillo | | | |
| duccio-fiero | | | |
| sergio-annoiato | | | |

## Giro F — le altre espressioni

Ogni espressione modifica il ritratto base approvato nel giro E, così inquadratura e scala restano quelle. Mara seria modifica il suo
ritratto neutro, come le espressioni del tutorial.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| Celestina, tutti | `docs/design/carriere/asset/tutorial/originali/celestina-furba-<n>.png`, il tentativo approvato | da registrare prima di allegarlo |
| Beppe, tutti | `docs/design/carriere/asset/tutorial/originali/beppe-tranquillo-<n>.png`, il tentativo approvato | da registrare prima di allegarlo |
| Duccio, tutti | `docs/design/carriere/asset/tutorial/originali/duccio-fiero-<n>.png`, il tentativo approvato | da registrare prima di allegarlo |
| Sergio, tutti | `docs/design/carriere/asset/tutorial/originali/sergio-annoiato-<n>.png`, il tentativo approvato | da registrare prima di allegarlo |
| mara-seria | `docs/design/carriere/asset/tutorial/originali/mara-neutra-1.png` | a2a629d0e1d229ae794990b6863a5f165b4f84e766aaf9a4e790bad880ea7f40 |

| Asset | Battuta per la composizione, su S2 |
|---|---|
| celestina-assonnata | «Mmmmmh… Ancora cinque minuti… Cos'è questa luce?» |
| celestina-contenta | «Questo posto è la mia casa, e non metaforicamente. Io sto con voi!» |
| celestina-arrabbiata | «Va bene, va bene. Scusami se ti ho provocato.» |
| celestina-triste | «E io una nuova casa.» |
| beppe-contento | «È una bici, che ci vorrà mai! Dieci euro in contanti e te la metto a posto.» |
| beppe-pensieroso | «Toh, c'è il gigante incazzoso del Serraglio. Che ci fai qua?» |
| beppe-scocciato | «Eh? Io sono un tornitore. L'unico codice che ho è il PIN del bancomat.» |
| beppe-serio | «Un signore mi ha chiamato per farsi riattaccare un braccetto dello sterzo del Mercedes.» |
| duccio-dolorante | «Davanti a tutta la fila! Questa non la dimentico: il rancore è una cosa di destra.» |
| duccio-offeso | «Appunto. Smamma, zecca comunista!» |
| duccio-serio | «Qui entrano solo clienti paganti, e tu l'aria del cliente pagante proprio non ce l'hai.» |
| duccio-beato | «A voi zecche piacerà anche sbronzarvi con le birre marce, ma il vero uomo di destra beve con stile.» |
| sergio-strafottente | «Ma vi sentite quando parlate? Siete patetici.» |
| sergio-malvagio | «Ho i miei metodi per sapere le cose. Siete voi che non sapete niente, anzi, non valete niente.» |
| sergio-pensieroso | «Ho informatori dappertutto, che mi riferiscono ogni vostra mossa.» |
| mara-seria | «Ora mi darai le chiavi della nuova serratura. Con le buone, o con le maniere di Spazienzio.» |

### Celestina — assonnata

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young woman, her face, red hair shaved at the sides with the bleached tuft, the plum-purple tracksuit, the bum bag, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her hands and head: just woken up, eyes barely open and squinting at a light, hair squashed flat on one side, rubbing one eye with the back of her hand, mouth half open in a groggy mumble. The sweet is gone from her hand.

Avoid: any other change to the character; syringes, powders, pills or any recognizable drug paraphernalia; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Celestina — contenta

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young woman, her face, red hair shaved at the sides with the bleached tuft, the plum-purple tracksuit, the bum bag, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her hands: genuinely happy for once, a wide crooked grin with slightly uneven teeth, bright eyes, one fist raised to her chest as if joining a gang. The sweet is gone from her hand.

Avoid: any other change to the character; syringes, powders, pills or any recognizable drug paraphernalia; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Celestina — arrabbiata

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young woman, her face, red hair shaved at the sides with the bleached tuft, the plum-purple tracksuit, the bum bag, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her hands: sulky and annoyed, eyebrows pulled down, eyes narrowed, lips twisted in a grudging scowl, arms crossed tight. The sweet is gone from her hand.

Avoid: any other change to the character; syringes, powders, pills or any recognizable drug paraphernalia; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Celestina — triste

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young woman, her face, red hair shaved at the sides with the bleached tuft, the plum-purple tracksuit, the bum bag, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her hands: quietly sad, eyes lowered, eyebrows tilted up in the middle, mouth a small downturned line, hugging her own arms. Melancholic, not tragic. The sweet is gone from her hand.

Avoid: any other change to the character; tears streaming down; syringes, powders, pills or any recognizable drug paraphernalia; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Beppe — contento

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, long beard, hair in a bun, tobacco-brown overalls, black band T-shirt with the illegible logo, the forearm tattoo, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms and hands: cheerful and pleased with an easy job, a broad grin that lifts the beard, eyes crinkled, arms uncrossed, giving a thumbs up with one hand.

Avoid: any other change to the character; tools in his pockets or hands; readable writing or real band names or logos; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Beppe — pensieroso

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, long beard, hair in a bun, tobacco-brown overalls, black band T-shirt with the illegible logo, the forearm tattoo, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms and hands: puzzled and thinking, one eyebrow up, eyes narrowed and turned aside, scratching his beard with one hand, the other arm across his chest.

Avoid: any other change to the character; tools in his pockets or hands; readable writing or real band names or logos; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Beppe — scocciato

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, long beard, hair in a bun, tobacco-brown overalls, black band T-shirt with the illegible logo, the forearm tattoo, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms and hands: fed up and irritated, rolling his eyes, a deep sigh puffing out his moustache, arms crossed more tightly, shoulders slumped.

Avoid: any other change to the character; tools in his pockets or hands; readable writing or real band names or logos; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Beppe — serio

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his face, long beard, hair in a bun, tobacco-brown overalls, black band T-shirt with the illegible logo, the forearm tattoo, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms and hands: serious and matter-of-fact, eyebrows low, mouth a straight line under the beard, a slight grave nod, one hand raised with the palm down as if saying «listen to me».

Avoid: any other change to the character; tools in his pockets or hands; readable writing or real band names or logos; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Duccio — dolorante

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young man, his face, shaved head with regrowth, stocky soft body, the black T-shirt with the cracked white eagle, the question-mark tattoo on his neck, the pink cocktail, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms: in comical pain and humiliated, wincing with one eye shut, a red bump on his forehead, the hand that was on his heart now pressed to his bruised cheek, still clutching the pink cocktail upright with the little finger raised, not a drop spilled.

Avoid: any other change to the character; blood or wounds; raised-arm salutes, flags, runes, swastikas, fasces, complete or real Celtic crosses, or any real political symbol; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Duccio — offeso

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young man, his face, shaved head with regrowth, stocky soft body, the black T-shirt with the cracked white eagle, the question-mark tattoo on his neck, the pink cocktail, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms: indignant and pouting, face red, lips pushed out, nostrils flared, chin jutting, jabbing a thumb over his shoulder as if telling someone to get lost, the pink cocktail held close to his chest.

Avoid: any other change to the character; raised-arm salutes, flags, runes, swastikas, fasces, complete or real Celtic crosses, or any real political symbol; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Duccio — serio

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young man, his face, shaved head with regrowth, stocky soft body, the black T-shirt with the cracked white eagle, the question-mark tattoo on his neck, the pink cocktail, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms: a bouncer trying to look tough, eyes narrowed, jaw set, frowning, looking the viewer up and down, his free arm crossed over his belly, the pink cocktail still in the other hand.

Avoid: any other change to the character; raised-arm salutes, flags, runes, swastikas, fasces, complete or real Celtic crosses, or any real political symbol; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Duccio — beato

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same young man, his face, shaved head with regrowth, stocky soft body, the black T-shirt with the cracked white eagle, the question-mark tattoo on his neck, the pink cocktail, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and the pose of his arms: blissful, eyes closed, sipping the pink cocktail through the spiral straw with the little finger raised, while with his other arm he flexes a bicep that is not there.

Avoid: any other change to the character; raised-arm salutes, flags, runes, swastikas, fasces, complete or real Celtic crosses, or any real political symbol; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Sergio — strafottente

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his sharp face, short brown hair, petrol-blue suit, white shirt with an open collar, the thin cigarette, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and, where needed, the pose of his arms: openly contemptuous, head tilted back, looking down his nose, a wide mocking smirk, one eyebrow high, flicking the ash off the thin cigarette toward the viewer.

Avoid: any other change to the character; a bunch of keys on his belt; a cigarette pack or anything with writing; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Sergio — malvagio

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his sharp face, short brown hair, petrol-blue suit, white shirt with an open collar, the thin cigarette, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and, where needed, the pose of his arms: coldly menacing, eyes narrowed to slits, a thin cruel smile, his face slightly lowered so that he looks up at the viewer from under his brows, a curl of cigarette smoke drifting across his face. Sinister but restrained, a villain who never raises his voice.

Avoid: any other change to the character; a bunch of keys on his belt; a cigarette pack or anything with writing; weapons; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Sergio — pensieroso

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same man, his sharp face, short brown hair, petrol-blue suit, white shirt with an open collar, the thin cigarette, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression and, where needed, the pose of his arms: calculating, eyes turned aside as if weighing a move several steps ahead, lips pressed around the thin cigarette, the other hand still in his pocket.

Avoid: any other change to the character; a bunch of keys on his belt; a cigarette pack or anything with writing; mirroring; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Mara — seria

~~~text
Edit the attached approved dialogue portrait. Keep everything exactly the same: the same woman, her face, long black hair with the badly self-cut fringe, headphones, teal reflective vest over the dark hoodie, backpack straps, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression and, where needed, her free hand: dead serious and determined, eyes fixed on the viewer, eyebrows low and straight, mouth a firm line, her free hand held out with the palm up, demanding something be handed over.

Avoid: any other change to the character, her framing or her position on the canvas; mirroring; any text, letters, numbers, logos, brand names or recognizable branding of any real delivery company, signatures or watermarks; scenery or other characters; likeness of any real person or celebrity; photographic or 3D-rendered style.
~~~

### Esiti del giro F

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| celestina-assonnata | | | |
| celestina-contenta | | | |
| celestina-arrabbiata | | | |
| celestina-triste | | | |
| beppe-contento | | | |
| beppe-pensieroso | | | |
| beppe-scocciato | | | |
| beppe-serio | | | |
| duccio-dolorante | | | |
| duccio-offeso | | | |
| duccio-serio | | | |
| duccio-beato | | | |
| sergio-strafottente | | | |
| sergio-malvagio | | | |
| sergio-pensieroso | | | |
| mara-seria | | | |

## Giro G — sfondi, varianti e il padrone

Due varianti modificano sfondi approvati del tutorial: S1 di giorno, a serranda abbassata, e S2 al buio, a bar chiuso. Due sfondi sono
nuovi nello stile degli altri: l'esterno del Dimmi Di Sì, di sera, e la cantina del Serraglio. **Correzione della regia rispetto alla
lista approvata:** l'interno del Dimmi Di Sì esiste già (S3 del tutorial, che le scene usano come «S3, dentro»); quello che manca è
l'esterno, che la scena III1 chiama «S3 di sera». Il padrone del Dimmi Di Sì è una figura in ombra, la regola della
[specifica](specifica-asset.md#figure-in-ombra). Niente scritte: le insegne, se servono, le sovrappone il client.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| S1 di giorno | `docs/design/carriere/asset/tutorial/originali/s1-esterno-1.png` | e6d852489fec118e8983be58132b75130c0c2ce1f27cc0b673ee5a6272bdf139 |
| S2 al buio | `docs/design/carriere/asset/tutorial/originali/s2-interno-2.png` | d91fe39d1891e0f32edce7b667e46d0df6a6d2b11ba0108f83d1b54ccc9bc74a |
| Esterno del Dimmi Di Sì, immagine 1 | `docs/design/client-c0/r1/duel.png` | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e |
| Esterno del Dimmi Di Sì, immagine 2 | `docs/design/carriere/asset/tutorial/originali/s3-dimmi-di-si-1.png` | 82445de8c48d34295bed429253e10940edd22a69196aad6caf9f56c6237432f7 |
| Cantina, immagine 1 | `docs/design/client-c0/r1/duel.png` | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e |
| Cantina, immagine 2 | `docs/design/carriere/asset/tutorial/originali/s2-interno-2.png` | d91fe39d1891e0f32edce7b667e46d0df6a6d2b11ba0108f83d1b54ccc9bc74a |
| Padrone del Dimmi Di Sì | nessuno | — |

| Asset | Composizione: sfondo, ritratto o sprite e battuta |
|---|---|
| s1-esterno-di-giorno | S1 di giorno con `bici-mara` contro il muro, senza ritratto né battuta |
| s2-interno-al-buio | S2 al buio, senza ritratto né battuta |
| s3-esterno | Esterno del Dimmi Di Sì con `duccio-fiero` se approvato nel giro E, altrimenti senza ritratto. «Fermo lì. Dove ti credi di andare, zecca che non sei altro, eh?» |
| s4-cantina | Cantina con lo sprite `grappino-seduto` a terra, senza battuta |
| padrone-in-ombra | S1 di giorno se approvato, altrimenti S1, con la sagoma davanti alla porta. Il padrone del Dimmi Di Sì: «Buongiorno. Chi viene a firmare per la Apri e Chiudi GmbH?» |

### S1 — di giorno

~~~text
Edit the attached background illustration. Keep everything exactly the same: the street, the bar front, the door frame, the shop window, the wall, the drainpipe, the street lamp, the hand-inked European comic style and the composition. Change only this: it is now an overcast weekday morning, with flat grey daylight instead of the night lighting; the street lamp is off; the rectangular sign panel above the door is switched off, dark and dull; a dented, graffiti-free metal roller shutter is pulled all the way down over the door and the shop window, closed with a padlock at the bottom. The place looks even shabbier in daylight.

Avoid: any other change to the image; any text, letters, numbers, graffiti, logos, brands, signatures or watermarks; people; photographic or 3D-rendered style.
~~~

### S2 — al buio

~~~text
Edit the attached background illustration. Keep everything exactly the same: the room, the counter, the shelves and bottles, the espresso machine, the walls, the hand-inked European comic style and the composition. Change only this: the bar is closed for the night. All the wall lamps are off; the only light is a single small lamp hanging above the counter, casting a weak warm pool of light, with the rest of the room in deep blue-brown shadow. The chairs are upside down on the tables. The centre behind where a character will stand stays readable in the dim light, and the lower quarter stays without important details.

Avoid: any other change to the image; people, faces, hands, silhouettes; any text, letters, numbers, signs, labels, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### S3 — esterno del Dimmi Di Sì

~~~text
Background illustration for a visual-novel dialogue scene in the original card game Botte Micidiali. One opaque landscape image, 1536 x 1024 pixels, aspect ratio 3:2. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette of walnut, tobacco brown, dusty bottle green, oxblood burgundy, muted petrol and worn ivory. Use image 2, the approved interior of the same trendy cocktail bar, only as the reference for drawing style, level of detail and its cleaner, cooler colours, so that the two backgrounds belong together; do not copy its content.

The scene: the outside of an expensive, pretentious disco pub at night, seen at eye level from the street, nobody around. In the central third of the width: a sleek entrance with a glossy black door, brass handles, a short red carpet, two chrome posts with a velvet rope between them, and above the door a plain rectangular lit sign panel with no lettering at all. Towards the sides: a dark glass front with cold indirect light, potted topiary plants, a polished pavement, as disposable side context. It must feel snobbish and overpriced, the exact opposite of a grimy neighbourhood dive bar, still drawn in the same hand-inked comic style. The lower quarter is plain pavement with no important details, because a dialogue box will cover it, and the centre stays uncluttered, because a character portrait will stand in front of it. Everything important must stay inside the central third.

Avoid: any text, letters, numbers, signs with writing, labels, logos, brands, signatures or watermarks; neon writing; people, faces, hands, silhouettes; playing cards, game interface, frames or borders; photographic or 3D-rendered style; dominant yellow-and-black colours.
~~~

### S4 — la cantina del Serraglio

~~~text
Background illustration for a visual-novel dialogue scene in the original card game Botte Micidiali. One opaque landscape image, 1536 x 1024 pixels, aspect ratio 3:2. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette of walnut, tobacco brown, dusty bottle green, oxblood burgundy, muted petrol and worn ivory. Use image 2, the approved interior of the same dive bar, only as the reference for drawing style, level of detail and mood, so that the two backgrounds belong together; do not copy its content.

The scene: the cellar under a run-down neighbourhood dive bar, seen at eye level, nobody in it. A low vaulted ceiling with damp patches, a single bare light bulb hanging from a wire, rough brick walls. Towards the sides: stacks of empty bottle crates, metal beer kegs, a steep wooden staircase going up in a corner, cobwebs, as disposable side context. In the central third, on the floor a little left of the centre and just above the lower quarter, a small dog's secret hoard: a bottle cap, a worn black furry slipper, a few thin cigarette butts and some greasy scraps of paper, piled on an old rag. The lower quarter is plain dusty floor with no important details, because a dialogue box will cover it, and the centre stays uncluttered. Everything important must stay inside the central third.

Avoid: any text, letters, numbers, labels on crates or kegs, logos, brands, signatures or watermarks; people, animals, faces, hands, silhouettes; playing cards, game interface, frames or borders; photographic or 3D-rendered style; dominant yellow-and-black colours.
~~~

### Padrone del Dimmi Di Sì — in ombra

~~~text
Draw one man as a solid, uniform, very dark charcoal silhouette, with no face, no internal details, no clothing details and no colours, for a visual-novel scene where a mysterious character stays anonymous. Canvas 1024 x 1536 pixels, portrait 2:3. The whole figure, standing, fits inside the canvas with a small empty margin around it, feet near the bottom edge. Background: fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF). Recognizable only by his outline and pose: a slim businessman in a sharply tailored suit and a long coat, slicked-back hair, standing very straight and composed, holding a thin document folder under one arm and, in the other hand, a small rectangular paper slip, a cheque, held up between two fingers.

Avoid: faces, eyes, features, inner lines, colours, gradients or highlights inside the silhouette; any text, letters, numbers, logos, brands, signatures or watermarks; scenery or other characters; photographic or 3D-rendered style.
~~~

### Esiti del giro G

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| s1-esterno-di-giorno | | | |
| s2-interno-al-buio | | | |
| s3-esterno | | | |
| s4-cantina | | | |
| padrone-in-ombra | | | |

## Dopo i giri

Quando un giro è approvato, la regia fa entrare gli asset nel prototipo (cast, ripieghi, sfondi) con un esecutore. Due ritocchi alle
storie andranno proposti al proprietario in quel momento: la scena della cantina dovrà chiamare lo sfondo nuovo (oggi scrive «S2 al
buio. Regia: la cantina…») e la scena III1 l'esterno del Dimmi Di Sì (oggi «S3 di sera», che il prototipo risolve con l'interno).

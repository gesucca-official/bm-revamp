# Carriere — prompt per cornice e puntine della bacheca

11 novembre 2026. Immagini per la [bacheca a lettere](bacheca.md) della mappa vera ([Fase D](prototipo.md#fase-d-la-mappa-vera-come-bacheca)),
dopo il giudizio del proprietario sul secondo bozzetto: «puntine ok ma più 3D (generiamo pure asset se servono)», e il rapporto della Fase C,
che indica la cornice come il pezzo che più si riconosce disegnato al computer. **Feltro, scanalature, lettere, cordicelle e macchie restano
disegnati dal codice:** il passo delle scanalature dev'essere esatto, le macchie semitrasparenti non si scontornano bene, e cordicelle e ombre
devono seguire la mappa. Processo come per gli altri asset (D11 del [piano C4](../../client-c4-plan.md#decisioni-del-proprietario)): prompt
letterali committati prima di generare, registro completo, nessun riferimento esterno al progetto.

## Istruzioni

- **Generare solo dopo il commit di questo documento;** ogni blocco inglese va incollato integralmente, paragrafo «Avoid» compreso.
- **Allegati:** solo quelli della tabella, dopo averne controllato l'impronta. Il bozzetto serve per proporzioni e colori della bacheca, R1 per
  lo stile.
- **Tentativi:** uno per prompt; un solo nuovo tentativo con lo stesso testo se il risultato viola il prompt in modo oggettivo (scritte,
  marchi, ombre portate o fondo sbagliati, oggetto tagliato, lati della cornice non uniformi). Se lo strumento blocca un prompt, si annota.
- **File:** cartella `docs/design/carriere/asset/bacheca/`, originali in `originali/` (da aggiungere a `.gitignore`), consegnati come WebP con
  trasparenza a piena risoluzione: `cornice.webp`, `puntine/<nome>.webp`. Registro in `docs/design/carriere/asset/bacheca/registro.md`, con
  gli stessi campi del registro del tutorial.
- **Composizione di prova:** la cornice in nove fette sopra una cattura del bozzetto, e le sei puntine posate su un pezzo di feltro scuro, in
  `composizioni/`.
- **Esiti:** l'esecutore riempie la tabella in fondo, giudizio vuoto.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| Tutti, immagine 1 | `docs/design/client-c0/r1/duel.png` | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e |
| Cornice, immagine 2 | `prototipi/carriere/catture/o-24-bozzetto-bacheca.jpg` | 7ebdef86dc73c50f74e80852909423597ecd0febbc37f9251e552f927cb9f3a1 |

## Cornice

Una cornice quadrata con il centro trasparente, pensata per essere **tagliata in nove fette** (quattro angoli, quattro lati, centro vuoto):
i lati devono essere uniformi lungo tutta la loro lunghezza, così il client li ripete per qualsiasi misura di schermo.

~~~text
Frame illustration for a visual-novel game screen in the original card game Botte Micidiali. One square image, 1024 x 1024 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette of walnut, tobacco brown, dusty bottle green, oxblood burgundy, muted petrol and worn ivory. Use image 2 only to understand what the frame will surround: an old dark felt letter board in a grimy Italian dive bar; do not copy anything from it.

The object: only the wooden frame of an old, neglected letter board that has hung behind a dive bar counter for forty years, seen straight on. A flat, fairly narrow moulding, about 9% of the image width on each side, in dark stained wood with chipped varnish, scratches, dents, a few spots where the paint has worn to bare wood, old sticky marks and a faint ring of a wine glass on one side. All four sides have the same profile and the same kind of wear distributed evenly along their whole length, so that each side can be cut out and repeated; the four corners are simple mitred joints, one slightly open. The whole inside of the frame is completely empty and fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF). No background outside the frame either.

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; anything inside the frame; hooks, nails, strings or people; ornate carving, gold, gilding or a polished antique look; perspective or a frame seen at an angle; drop shadows outside the frame; photographic or 3D-rendered style.
~~~

## Puntine

Sei oggetti, tutti **visti di fronte e un po' dall'alto, la punta verso chi guarda e leggermente in basso,** come appaiono piantati in una
bacheca appesa al muro; **senza ombra portata,** che la aggiunge il client in base a dove sta la puntina. Le puntine di plastica si possono
ricolorare dal client: per questo una sola tinta per forma.

| Nome | Oggetto |
|---|---|
| `tonda-rossa` | puntina a testa tonda di plastica rossa, per «sei qui» |
| `cilindro` | puntina da ufficio con l'impugnatura a cilindro di plastica gialla |
| `ottone` | puntina piatta d'ottone, un po' ossidata |
| `spillo` | spillo da sarta con la capocchia di perla bianca, piantato storto |
| `chiodino` | chiodino da carpentiere arrugginito e piegato |
| `ombrello` | puntina da mappa a testa schiacciata, di plastica verde |

Ogni prompt sotto è uguale tranne la riga «The object».

~~~text
Small object illustration for a visual-novel game in the original card game Botte Micidiali. One square image, 512 x 512 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette. Draw the object with a clear sense of volume, so that it reads as a real three-dimensional thing even when shown very small.

The object: a round-headed red plastic pushpin, the glossy red head facing the viewer with a small highlight, the short steel point going into the surface at a slight angle.

Show it alone, seen from the front and slightly from above, as it looks when pushed into a board that hangs on a wall, centered, filling about two thirds of the image. No cast shadow. Background fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF).

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; a board, felt, paper or any surface; other objects; cast shadows; photographic or 3D-rendered style.
~~~

~~~text
Small object illustration for a visual-novel game in the original card game Botte Micidiali. One square image, 512 x 512 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette. Draw the object with a clear sense of volume, so that it reads as a real three-dimensional thing even when shown very small.

The object: an office push pin with a cylindrical yellow plastic grip, slightly scuffed, seen at an angle that shows both the round top and the side of the cylinder, the short steel point going into the surface.

Show it alone, seen from the front and slightly from above, as it looks when pushed into a board that hangs on a wall, centered, filling about two thirds of the image. No cast shadow. Background fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF).

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; a board, felt, paper or any surface; other objects; cast shadows; photographic or 3D-rendered style.
~~~

~~~text
Small object illustration for a visual-novel game in the original card game Botte Micidiali. One square image, 512 x 512 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette. Draw the object with a clear sense of volume, so that it reads as a real three-dimensional thing even when shown very small.

The object: a flat brass thumbtack, the round domed brass head a little tarnished and dull, with a dark spot of oxidation, seen almost face-on.

Show it alone, seen from the front and slightly from above, as it looks when pushed into a board that hangs on a wall, centered, filling about two thirds of the image. No cast shadow. Background fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF).

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; a board, felt, paper or any surface; other objects; cast shadows; photographic or 3D-rendered style.
~~~

~~~text
Small object illustration for a visual-novel game in the original card game Botte Micidiali. One square image, 512 x 512 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette. Draw the object with a clear sense of volume, so that it reads as a real three-dimensional thing even when shown very small.

The object: a dressmaker's pin with a small white pearl head, pushed in crooked so that the thin steel shaft shows at a diagonal.

Show it alone, seen from the front and slightly from above, as it looks when pushed into a board that hangs on a wall, centered, filling about two thirds of the image. No cast shadow. Background fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF).

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; a board, felt, paper or any surface; other objects; cast shadows; photographic or 3D-rendered style.
~~~

~~~text
Small object illustration for a visual-novel game in the original card game Botte Micidiali. One square image, 512 x 512 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette. Draw the object with a clear sense of volume, so that it reads as a real three-dimensional thing even when shown very small.

The object: a small rusty carpenter's nail, bent halfway, its flat round head facing the viewer, patches of orange rust on the dark iron.

Show it alone, seen from the front and slightly from above, as it looks when pushed into a board that hangs on a wall, centered, filling about two thirds of the image. No cast shadow. Background fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF).

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; a board, felt, paper or any surface; other objects; cast shadows; photographic or 3D-rendered style.
~~~

~~~text
Small object illustration for a visual-novel game in the original card game Botte Micidiali. One square image, 512 x 512 pixels. Use image 1 only as the approved art-direction reference: hand-inked European comic look, irregular dark contours, restrained painted shading, muted palette. Draw the object with a clear sense of volume, so that it reads as a real three-dimensional thing even when shown very small.

The object: a map pin with a flattened, umbrella-shaped green plastic head, a little chipped on one edge, the short steel point going into the surface.

Show it alone, seen from the front and slightly from above, as it looks when pushed into a board that hangs on a wall, centered, filling about two thirds of the image. No cast shadow. Background fully transparent if supported; otherwise a perfectly flat, uniform magenta (#FF00FF).

Avoid: any text, letters, numbers, logos, brands, signatures or watermarks; a board, felt, paper or any surface; other objects; cast shadows; photographic or 3D-rendered style.
~~~

## Esiti

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| cornice | [cornice.webp](asset/bacheca/cornice.webp) | [cornice-1](asset/bacheca/registro.md#cornice-1) | |
| tonda-rossa | [puntine/tonda-rossa.webp](asset/bacheca/puntine/tonda-rossa.webp) | [tonda-rossa-1](asset/bacheca/registro.md#tonda-rossa-1) | |
| cilindro | [puntine/cilindro.webp](asset/bacheca/puntine/cilindro.webp) | [cilindro-1](asset/bacheca/registro.md#cilindro-1) | |
| ottone | [puntine/ottone.webp](asset/bacheca/puntine/ottone.webp) | [ottone-1](asset/bacheca/registro.md#ottone-1) | |
| spillo | [puntine/spillo.webp](asset/bacheca/puntine/spillo.webp) | [spillo-1](asset/bacheca/registro.md#spillo-1) | |
| chiodino | [puntine/chiodino.webp](asset/bacheca/puntine/chiodino.webp) | [chiodino-1](asset/bacheca/registro.md#chiodino-1) | |
| ombrello | [puntine/ombrello.webp](asset/bacheca/puntine/ombrello.webp) | [ombrello-1](asset/bacheca/registro.md#ombrello-1) | |

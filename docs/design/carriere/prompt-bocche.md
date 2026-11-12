# Tutorial — prompt per le bocche e le espressioni esasperate

12 novembre 2026. Dopo il [giudizio del proprietario sulla Fase E](prototipo-fase-e.md#giudizio-del-proprietario) del prototipo: «la bocca
che si apre e chiude quando parlano mi piacerebbe». Il modo che non chiede un'immagine per fotogramma: **per ogni ritratto approvato, una
seconda versione identica tranne la bocca** (aperta se nel ritratto è chiusa, quasi chiusa se è aperta); il lettore le alterna mentre il
testo scorre, sotto il movimento e la maglia. In più le due **espressioni esasperate** per chi ascolta Piera, chieste dal proprietario
l'11 novembre (P8 del prototipo). Processo come per gli altri asset: prompt letterali committati prima di generare, registro completo,
nessun riferimento esterno al progetto.

## Istruzioni

- **Generare solo dopo il commit di questo documento;** ogni blocco inglese integralmente, con il solo allegato della sua riga, dopo averne
  controllato l'impronta. Gli originali sono in `docs/design/carriere/asset/tutorial/originali/`, ignorati da git.
- **La cosa più importante per le bocche:** fuori dalla bocca l'immagine deve restare identica, perché le due versioni si alternano
  velocemente. Un solo nuovo tentativo con lo stesso testo se cambia altro (testa spostata, occhi diversi, inquadratura) o se la bocca non
  cambia; se lo strumento non riesce a tenere ferma l'immagine, si annota: il lettore può prendere dalla seconda versione solo la zona della
  bocca, con una maschera.
- **File:** originali `<ritratto>-bocca-1.png` e `<ritratto>-1.png` in `originali/`; consegnati in `ritratti/` come
  `<ritratto>-bocca.webp` (per esempio `mara-neutra-bocca.webp`) e `mara-esasperata.webp`, `spazienzio-esasperato.webp`. Registro in coda a
  `docs/design/carriere/asset/tutorial/registro.md`, con modalità «modifica guidata dal riferimento».
- **Prova:** per ogni ritratto, una differenza fra le due versioni (un'immagine che mostri dove cambiano) in `composizioni/` con il prefisso
  `d-`, così si vede subito se è cambiata solo la bocca.
- **Esiti:** l'esecutore riempie la tabella in fondo, giudizio vuoto.

## Bocche

| Ritratto | Allegato | SHA-256 |
|---|---|---|
| mara-agitata | `originali/mara-agitata-1.png` | e6b305bfadf86afc360eaa4bde4f21195e8377577253b096f432039c68fcf0a6 |
| mara-contenta | `originali/mara-contenta-1.png` | e90356d82796137c36bd9581d4c2e7817f37285fb1ec12b26c658debc0ef723b |
| mara-illuminata | `originali/mara-illuminata-1.png` | 9562c38e9ae4e6b57489315c2a8fb36c0f631565feabb024f97b322412d5ba71 |
| mara-neutra | `originali/mara-neutra-1.png` | a2a629d0e1d229ae794990b6863a5f165b4f84e766aaf9a4e790bad880ea7f40 |
| mara-sospettosa | `originali/mara-sospettosa-1.png` | fc9f8e4eafe2cc4f1919b4f6b3f13063c492ad2b0922e9f50c2bac33854b0d97 |
| mara-pensierosa | `originali/mara-pensierosa-1.png` | 4ff3c9ab0586eb899cdbd5d79c3d7b626ad6ac0c18c94f896502b37cc26c581b |
| spazienzio-furioso | `originali/spazienzio-furioso-2.png` | 07d791e1d6470ccaf97e43786a55a76404652f495afc333e33b6a4c7648cd9c3 |
| spazienzio-fumante | `originali/spazienzio-fumante-2.png` | f6b0c73649f027c1d2c07af0eb26034f366ff7c5fd5ce3e9c6d21bf8fff7ae23 |
| spazienzio-quasi-calmo | `originali/spazienzio-quasi-calmo-1.png` | 3eaa0e304f9c6734d7d0ac8222b76d216e37b16cc6b4f599738f41b0567f9fe6 |
| spazienzio-soddisfatto | `originali/spazienzio-soddisfatto-1.png` | bd333d304209e59196caa8606dc91daffaca54b1e8a1689b195c1ea46ab4957b |
| spazienzio-serio | `originali/spazienzio-serio-3.png` | 11305a8ef94bdfc509dfa2f0ad93e200d982bb9fc672ef5be56d88d5474418c8 |
| piera-contenta | `originali/piera-contenta-1.png` | 1accca6f64408737380616fa3ccaa458058b1f8884521231ee8fe2ab4b102fc1 |
| piera-brilla | `originali/piera-brilla-2.png` | c9f7ac82d389707693746662f766aabdf363eb75232d21dcb6b4de53b0d95e7a |
| piera-offesa | `originali/piera-offesa-1.png` | 2fcf96b02457712d45836b9029bb8989577502edc88afa265d0f37549edaba91 |
| piera-assonnata | `originali/piera-assonnata-1.png` | cea64debfa3bee1a3a5f032350624d92e093bb2bf926baf185fc5749f9f18376 |

Un prompt per ritratto, nell'ordine della tabella.

### mara-agitata

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth almost closed, lips just parted between two words.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### mara-contenta

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth open in the middle of a word, inside the same crooked grin.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### mara-illuminata

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth opened a little wider in the middle of a word, inside the same triumphant grin.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### mara-neutra

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth slightly open in the middle of a word.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### mara-sospettosa

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth slightly open in the middle of a word, still suspicious.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### mara-pensierosa

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her lips slightly parted in the middle of a word.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### spazienzio-furioso

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: his mouth half closed between two shouts, teeth still bared.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### spazienzio-fumante

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: his mouth open in the middle of a word, teeth showing, still seething.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### spazienzio-quasi-calmo

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: his mouth slightly open, breathing out through his teeth.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### spazienzio-soddisfatto

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: his mouth open in the middle of a word, inside the same wide grin.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### spazienzio-serio

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: his mouth open in the middle of a word, still stern.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### piera-contenta

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth slightly open in the middle of a word, inside the same slow serene smile.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### piera-brilla

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth open in the middle of a word, still lopsided.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### piera-offesa

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth open in the middle of a word, still pouting and offended.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### piera-assonnata

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Every pixel outside the mouth area must stay identical, because the two images will alternate quickly while the character speaks. Change only the mouth: her mouth closed at the end of the yawn, still drowsy.

Avoid: any change outside the mouth; a different head position, angle or size; a different expression of the eyes or eyebrows; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

## Espressioni esasperate

Per gli stacchi su chi ascolta Piera: oggi il lettore usa «neutra» e «quasi calmo».

| Ritratto | Allegato | SHA-256 |
|---|---|---|
| mara-esasperata | `originali/mara-neutra-1.png` | a2a629d0e1d229ae794990b6863a5f165b4f84e766aaf9a4e790bad880ea7f40 |
| spazienzio-esasperato | `originali/spazienzio-quasi-calmo-1.png` | 3eaa0e304f9c6734d7d0ac8222b76d216e37b16cc6b4f599738f41b0567f9fe6 |

### mara-esasperata

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, hair, body, clothes, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only her facial expression: exasperated while listening to someone who will not stop talking: eyes rolled up towards the ceiling, a long silent sigh, mouth closed in a flat line. Keep her hands and pose as they are.

Avoid: any other change; mirroring; a different head position or size; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### spazienzio-esasperato

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, hair, body, clothes, colours, hand-inked European comic style, framing, size and position on the canvas, and the transparent background. Change only his facial expression: exasperated and impatient while listening to someone who will not stop talking: eyes rolled up, cheeks puffed out, face turning red, mouth closed. Keep his arms and pose as they are.

Avoid: any other change; mirroring; a different head position or size; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

## Esiti

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|
| mara-agitata | [mara-agitata-bocca.webp](asset/tutorial/ritratti/mara-agitata-bocca.webp) | [mara-agitata-bocca-2](asset/tutorial/registro.md#mara-agitata-bocca-2) |  |
| mara-contenta | [mara-contenta-bocca.webp](asset/tutorial/ritratti/mara-contenta-bocca.webp) | [mara-contenta-bocca-2](asset/tutorial/registro.md#mara-contenta-bocca-2) |  |
| mara-illuminata | [mara-illuminata-bocca.webp](asset/tutorial/ritratti/mara-illuminata-bocca.webp) | [mara-illuminata-bocca-2](asset/tutorial/registro.md#mara-illuminata-bocca-2) |  |
| mara-neutra | [mara-neutra-bocca.webp](asset/tutorial/ritratti/mara-neutra-bocca.webp) | [mara-neutra-bocca-2](asset/tutorial/registro.md#mara-neutra-bocca-2) |  |
| mara-sospettosa | [mara-sospettosa-bocca.webp](asset/tutorial/ritratti/mara-sospettosa-bocca.webp) | [mara-sospettosa-bocca-2](asset/tutorial/registro.md#mara-sospettosa-bocca-2) |  |
| mara-pensierosa | [mara-pensierosa-bocca.webp](asset/tutorial/ritratti/mara-pensierosa-bocca.webp) | [mara-pensierosa-bocca-2](asset/tutorial/registro.md#mara-pensierosa-bocca-2) |  |
| spazienzio-furioso | [spazienzio-furioso-bocca.webp](asset/tutorial/ritratti/spazienzio-furioso-bocca.webp) | [spazienzio-furioso-bocca-2](asset/tutorial/registro.md#spazienzio-furioso-bocca-2) |  |
| spazienzio-fumante | [spazienzio-fumante-bocca.webp](asset/tutorial/ritratti/spazienzio-fumante-bocca.webp) | [spazienzio-fumante-bocca-2](asset/tutorial/registro.md#spazienzio-fumante-bocca-2) |  |
| spazienzio-quasi-calmo | [spazienzio-quasi-calmo-bocca.webp](asset/tutorial/ritratti/spazienzio-quasi-calmo-bocca.webp) | [spazienzio-quasi-calmo-bocca-2](asset/tutorial/registro.md#spazienzio-quasi-calmo-bocca-2) |  |
| spazienzio-soddisfatto | [spazienzio-soddisfatto-bocca.webp](asset/tutorial/ritratti/spazienzio-soddisfatto-bocca.webp) | [spazienzio-soddisfatto-bocca-1](asset/tutorial/registro.md#spazienzio-soddisfatto-bocca-1) |  |
| spazienzio-serio | [spazienzio-serio-bocca.webp](asset/tutorial/ritratti/spazienzio-serio-bocca.webp) | [spazienzio-serio-bocca-2](asset/tutorial/registro.md#spazienzio-serio-bocca-2) |  |
| piera-contenta | [piera-contenta-bocca.webp](asset/tutorial/ritratti/piera-contenta-bocca.webp) | [piera-contenta-bocca-2](asset/tutorial/registro.md#piera-contenta-bocca-2) |  |
| piera-brilla | [piera-brilla-bocca.webp](asset/tutorial/ritratti/piera-brilla-bocca.webp) | [piera-brilla-bocca-2](asset/tutorial/registro.md#piera-brilla-bocca-2) |  |
| piera-offesa | [piera-offesa-bocca.webp](asset/tutorial/ritratti/piera-offesa-bocca.webp) | [piera-offesa-bocca-2](asset/tutorial/registro.md#piera-offesa-bocca-2) |  |
| piera-assonnata | [piera-assonnata-bocca.webp](asset/tutorial/ritratti/piera-assonnata-bocca.webp) | [piera-assonnata-bocca-2](asset/tutorial/registro.md#piera-assonnata-bocca-2) |  |
| mara-esasperata | [mara-esasperata.webp](asset/tutorial/ritratti/mara-esasperata.webp) | [mara-esasperata-1](asset/tutorial/registro.md#mara-esasperata-1) |  |
| spazienzio-esasperato | [spazienzio-esasperato.webp](asset/tutorial/ritratti/spazienzio-esasperato.webp) | [spazienzio-esasperato-1](asset/tutorial/registro.md#spazienzio-esasperato-1) |  |

## Secondo giro

12 novembre 2026. Dopo la prova del proprietario e la diagnosi della [Fase G](prototipo-fase-g.md#bocche) del prototipo: due immagini da
rifare. **spazienzio-furioso-bocca** non combacia con il ritratto approvato (testa più in alto e più piccola), quindi oggi Spazienzio
furioso parla a bocca ferma; **mara-esasperata** ha un velo scuro semitrasparente al posto del fondo, che il lettore copre con la sagoma di
«neutra» ma che non deve arrivare al client vero. Le altre undici versioni «-bocca» con il velo vanno bene per il prototipo, che ne prende
solo il colore della bocca. Stesse [istruzioni](#istruzioni); originali nuovi con il suffisso `-3` per la bocca di Spazienzio e `-2` per
Mara esasperata, file consegnati con lo stesso nome; **dopo lo scontorno il fondo dev'essere trasparente per davvero**: l'esecutore
controlla l'alfa degli angoli e del fondo e lo scrive nel registro.

| Prompt | Allegato | SHA-256 |
|---|---|---|
| spazienzio-furioso-bocca | `originali/spazienzio-furioso-2.png` | 07d791e1d6470ccaf97e43786a55a76404652f495afc333e33b6a4c7648cd9c3 |
| mara-esasperata | `originali/mara-neutra-1.png` | a2a629d0e1d229ae794990b6863a5f165b4f84e766aaf9a4e790bad880ea7f40 |

### spazienzio-furioso-bocca

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, expression, eyes, hair, body, clothes, pose, colours, hand-inked European comic style and the transparent background. Do not move, rescale, re-centre or crop anything: the head and the body must keep exactly the same size and exactly the same position on the canvas, pixel for pixel, because the two images will alternate quickly while the character speaks. Change only the mouth: his mouth half closed between two shouts, teeth still bared.

Avoid: any change outside the mouth; a different head position, angle or size; zooming in or out; a different expression of the eyes or eyebrows; a dark veil, halo or shadow around the figure; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### mara-esasperata

~~~text
Edit the attached dialogue portrait. Keep everything exactly the same: the same character, face, hair, body, clothes, colours, hand-inked European comic style, framing, size and position on the canvas. Change only her facial expression: exasperated while listening to someone who will not stop talking: eyes rolled up towards the ceiling, a long silent sigh, mouth closed in a flat line. Keep her hands and pose as they are. The background must stay fully transparent: no dark veil, halo, shadow or tint around the figure.

Avoid: any other change; mirroring; a different head position or size; a dark or semi-transparent background; any text, letters, numbers, logos, brands, signatures or watermarks; photographic or 3D-rendered style.
~~~

### Esiti del secondo giro

| Asset | File | Scheda del registro | Giudizio del proprietario |
|---|---|---|---|

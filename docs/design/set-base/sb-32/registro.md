# SB-32 — Registro del campione

Generazioni del 24 novembre 2026; giudizio visivo riservato al proprietario. Prompt letterali nel [campione](prompt-campione.md); commit preventivo `1d150a584179bcb6126b7de74e1fca4b042b5b72`. Strumento `image_gen.imagegen` integrato in Codex; modello non esposto, C2PA non verificato; riscrittura non esposta; nessun campo negativo separato. Gli originali sono copie senza modifica del file restituito. Nessun tentativo scartato né ripetuto. Il posacenere appare ceramico, ma il successivo token era già stato richiesto prima del controllo: non si è tornati indietro nell’ordine dei prompt.

**Esito:** nove originali conservati e un rifiuto; [scheda di giudizio](giudizio.html) con le anteprime e le tre candidate O9. Gli originali sono fuori da git: il proprietario deve conservarne una copia su entrambe le macchine. Nessun comportamento di gioco o atteso modificato.

**Verifiche:** impronte degli allegati confrontate prima di ogni richiesta; `git diff --check` senza segnalazioni; `python scripts/check-rules.py` verde. `python scripts/check-links.py` segnala 22 collegamenti mancanti in documenti già presenti e non modificati dal blocco; nessuno nei nuovi file SB-32. Anteprime WebP qualità 80, 512 px; celle O9 ritagliate senza il bordo dell'atlante. Il controllo della somiglianza e della leggibilità rimane al proprietario.

**Domande:** 1. Quali immagini approvi, anche a 60 px? 2. Quali candidate O9 conservi? 3. Come procedere per il token rifiutato e per il posacenere che appare ceramico? Un eventuale testo diverso richiede un nuovo prompt della regia.

## Tentativo 1 — bruiser.character.BigBadBruiser

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.BigBadBruiser` |
| promptSha256 | `f2713c6c8686fe3e4608c999c51792109f1a670d8962b4825b612656cc5a68a8` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/bruiser.character.BigBadBruiser.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3160953 / `9549a11ffe08a93d494e3b2067f0faeec613f81136effe503363342366f01729` |
| Anteprima | [WebP](anteprime/bruiser.character.BigBadBruiser.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Figura a torso nudo con strisce e tatuaggi nelle posizioni richieste; figura intera anziché taglio alle ginocchia. |
| Giudizio del proprietario |  |

## Tentativo 2 — base.character.Mara

| Campo | Valore |
|---|---|
| bindingName | `base.character.Mara` |
| promptSha256 | `47611efdaf9394722c80f7c317503f3878d6bc25ab259c7675c20321e45f8fb9` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`<br>`docs/design/carriere/asset/tutorial/sfondi/s1-esterno.webp`: `19f020fe6689b2de7261dfe7c1bcff9608a6509539c7fb5ab18363a85687a1d6` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.character.Mara.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3481997 / `15826089b404bf0b63ad72f1145dcda96eed8d4e9cf94597c2097907b42c0224` |
| Anteprima | [WebP](anteprime/base.character.Mara.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Casco in mano, cuffie, zaino e bici visibili; ginocchia al margine inferiore. |
| Giudizio del proprietario |  |

## Tentativo 3 — junkie.character.ToxicJunkie

| Campo | Valore |
|---|---|
| bindingName | `junkie.character.ToxicJunkie` |
| promptSha256 | `99aa3f4c58f302c6762e2fe8dca819d59011fc195d229d418263434371f27426` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/junkie.character.ToxicJunkie.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3136973 / `fcee0c0563b670abd5dcaa97967491b5421f905d13fe014fce42afdd02bb6261` |
| Anteprima | [WebP](anteprime/junkie.character.ToxicJunkie.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Capelli rossi, tuta e oggetto incartato visibili; accovacciata. |
| Giudizio del proprietario |  |

## Tentativo 4 — base.character.Pino

| Campo | Valore |
|---|---|
| bindingName | `base.character.Pino` |
| promptSha256 | `ec1359687a8d81a8ca39f4a0467e34cfc42440d3231682a88b850748c7c874e7` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.character.Pino.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3005728 / `793192c98a36fcf38073d17540806a640aa9af6d61f9bc8758ca638c5373f385` |
| Anteprima | [WebP](anteprime/base.character.Pino.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Abito nero, bicchierino, matita e cane visibili. |
| Giudizio del proprietario |  |

## Tentativo 5 — base.character.Gigi

| Campo | Valore |
|---|---|
| bindingName | `base.character.Gigi` |
| promptSha256 | `cc0c01a82c0ba99307d3c0e4bea2df51dd6db60f1ea44d7a9c8cbcf31d5852af` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.character.Gigi.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2968333 / `1ac45c54c44117eed25ce6fb6fbebb63405525e15b9045f0ba7daa47e7c38016` |
| Anteprima | [WebP](anteprime/base.character.Gigi.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Salopette con due bretelle, braccia incrociate e tasche senza attrezzi; segni spinosi illeggibili su maglia e avambraccio. |
| Giudizio del proprietario |  |

## Tentativo 6 — base.character.Cesira

| Campo | Valore |
|---|---|
| bindingName | `base.character.Cesira` |
| promptSha256 | `b04bbba497a1ee513131636224b46046ab4dad01abd2c58a336a62a13d1828fc` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/sergio.png`: `27ceebba2f27067cdcd10f2e6c2d96f50f73c7d0db7afdd962cf0c2f0c7e6cbe`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.character.Cesira.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3006592 / `0eb9e8f4dd9606ab93fbd9b512c45e226e96e66a4ee0f8c98ce7bc1db4ffbfd0` |
| Anteprima | [WebP](anteprime/base.character.Cesira.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Abito petrolio, sigaretta, calzini spaiati e laccio slacciato visibili; figura intera. |
| Giudizio del proprietario |  |

## Tentativo 7 — base.character.Rocco

| Campo | Valore |
|---|---|
| bindingName | `base.character.Rocco` |
| promptSha256 | `fa57738710da060b659c5be13e8eb7b2e6a20593e822c034175ed2996cfe28c0` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/duccio.png`: `07a0170824c935625c3af8fd491a196cf6ce5efe61b12c3ffc5a9fe94ab80779`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.character.Rocco.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2984831 / `12590f37c676f11b3ef8252589435f0e964665df47b44922e6ceb8c1b402ae93` |
| Anteprima | [WebP](anteprime/base.character.Rocco.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Cocktail rosa e mignolo alzato; il tatuaggio sul collo è attraversato da un tratto, non un semplice punto interrogativo. |
| Giudizio del proprietario |  |

## Tentativo 8 — base.pino.bound.SpallataAlBancone

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| promptSha256 | `38762ebeca2a15c146ec5b037a9c79c13b0c524bb4928ed8d6e6344e5c0cf224` |
| Allegati effettivi, in ordine | `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`<br>`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.bound.SpallataAlBancone.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3087795 / `e01d32fd742d9b02236e906ec8fb7e34370309890675b10b6a79f0b754de1d75` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Piera spruzza dal sifone verso una figura in ombra; bicchierino e cane visibili. |
| Giudizio del proprietario |  |

## Tentativo 9 — base.items.PosacenereDiVetro

| Campo | Valore |
|---|---|
| bindingName | `base.items.PosacenereDiVetro` |
| promptSha256 | `9e2be9f76be12204c967897b0d78fdb56bb5b03969390e4a82b555a49b030f9c` |
| Allegati effettivi, in ordine | `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0`<br>`docs/design/client-c0/r1/card.png`: `4e575d0d7dc9ca43e410ccf7e94b9e16adffd32bafbd6fa7039b6aa5302f259a` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source | `originali/base.items.PosacenereDiVetro.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3346915 / `dd86d81de79d1f622caabd3face76db5d1f9806f1ee551286d2267daf8851a55` |
| Anteprima | [WebP](anteprime/base.items.PosacenereDiVetro.webp), lato lungo 512 px, qualità 80 |
| Esito / scarto | Conservato per giudizio; non scartato. |
| Controllo oggettivo | Posacenere verde con mozziconi, cenere e fumo; il materiale appare opaco e simile alla ceramica vietata, non chiaramente vetro. |
| Giudizio del proprietario |  |

## Tentativo 10 — com.tokens.BrokenBeerBottle

| Campo | Valore |
|---|---|
| bindingName | `com.tokens.BrokenBeerBottle` |
| promptSha256 | `d10ade728bae7e2d14564ee4d7a05b29e90f5c8accb636f58de98fa76b8f0b60` |
| Allegati effettivi, in ordine | `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0`<br>`docs/design/client-c0/r1/card.png`: `4e575d0d7dc9ca43e410ccf7e94b9e16adffd32bafbd6fa7039b6aa5302f259a` |
| Strumento / modello / data | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| source / dimensioni / byte / SHA-256 | nessun file restituito |
| Esito / scarto | Rifiuto `moderation_blocked`, fase output, categorie `violence`, `illicit`; richiesta `62b6771d-3647-4359-a307-7503b656a838`. Nessuna ripetizione. |
| Controllo oggettivo | Rifiutato dal sistema di sicurezza in fase di output: nessuna immagine restituita. |
| Giudizio del proprietario |  |

## Correzioni richieste dal proprietario

Prompt di modifica committati prima delle generazioni in `3eff495`: [testi e motivazione](prompt-correzioni.md). Il token ripete il testo originale su richiesta esplicita. Le immagini precedenti sono conservate per il confronto; giudizio riservato al proprietario. Strumento `image_gen.imagegen`, modello non esposto, riscrittura non esposta, data 2026-11-24. Prima di Duccio un controllo si è fermato per un carattere omesso nel valore di confronto trascritto; il file coincideva con l’impronta nel registro e la generazione è partita dopo il confronto corretto.

### Correzione 1 — bruiser.character.BigBadBruiser

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.BigBadBruiser` |
| source | `originali/bruiser.character.BigBadBruiser-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2984671 / `dd15bf452e0609457625110e89e57c9cc1d75078f85cec53bd8017fc373a1d52` |
| promptSha256 | `ff9ba46833af391a75937ff583ae3e23823100f547f9e00863247ef8b231f148` |
| Allegati effettivi | `docs/design/set-base/sb-32/originali/bruiser.character.BigBadBruiser.png`: `9549a11ffe08a93d494e3b2067f0faeec613f81136effe503363342366f01729` |
| Anteprima | [WebP](anteprime/bruiser.character.BigBadBruiser-2.webp), 512 px, qualità 80 |
| Controllo oggettivo | Ombra ampia collegata ai piedi; tatuaggi sui lati originari. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Correzione 2 — base.character.Pino

| Campo | Valore |
|---|---|
| bindingName | `base.character.Pino` |
| source | `originali/base.character.Pino-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2810068 / `a70787867bdbb4c69e1fc64b0108f3cd21c9312b9ef4e6182af9fe7f3a18a7f5` |
| promptSha256 | `c71f2616bccd1511989dcfc89adc0d6f29b82ed201128322b7ab39d8da319c44` |
| Allegati effettivi | `docs/design/set-base/sb-32/originali/base.character.Pino.png`: `793192c98a36fcf38073d17540806a640aa9af6d61f9bc8758ca638c5373f385` |
| Anteprima | [WebP](anteprime/base.character.Pino-2.webp), 512 px, qualità 80 |
| Controllo oggettivo | Matita sopra i capelli; seduta e gambe dello sgabello più larghe. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Correzione 3 — base.pino.bound.SpallataAlBancone

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| source | `originali/base.pino.bound.SpallataAlBancone-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2926850 / `46187d20693bf638d466af5aa520556ea473e4e06eb9ff5f85cee8cf68f93207` |
| promptSha256 | `a0a1fe0b690de1b19c6e72144bbf093fd773ea425ea39846a792c85e63ca8b87` |
| Allegati effettivi | `docs/design/set-base/sb-32/originali/base.pino.bound.SpallataAlBancone.png`: `e01d32fd742d9b02236e906ec8fb7e34370309890675b10b6a79f0b754de1d75` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone-2.webp), 512 px, qualità 80 |
| Controllo oggettivo | Matita tra i capelli; sgabello più largo; spruzzata mantenuta. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Correzione 4 — base.character.Cesira

| Campo | Valore |
|---|---|
| bindingName | `base.character.Cesira` |
| source | `originali/base.character.Cesira-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2941099 / `0be0b5754d30cb62ad1d0669f7039f94524ccc1c3f3b0ec6b4bddeb587447e20` |
| promptSha256 | `bb57ce180722cd2ec249eec701db864e08cf058ac8bc3b7dbab353e9ef9f6d06` |
| Allegati effettivi | `docs/design/set-base/sb-32/originali/base.character.Cesira.png`: `0eb9e8f4dd9606ab93fbd9b512c45e226e96e66a4ee0f8c98ce7bc1db4ffbfd0` |
| Anteprima | [WebP](anteprime/base.character.Cesira-2.webp), 512 px, qualità 80 |
| Controllo oggettivo | Seduto a gambe accavallate; calzini spaiati, sigaretta e laccio slacciato visibili. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Correzione 5 — base.character.Rocco

| Campo | Valore |
|---|---|
| bindingName | `base.character.Rocco` |
| source | `originali/base.character.Rocco-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3110405 / `a1279fceb340342a2d74d1445ce5379357bbbec7c51562d4d55f5ebe4427327d` |
| promptSha256 | `df88461aada9502ec014b57d64e8071acb3d9ca920291fdd2d4b518ecbd7a4d8` |
| Allegati effettivi | `docs/design/set-base/sb-32/originali/base.character.Rocco.png`: `12590f37c676f11b3ef8252589435f0e964665df47b44922e6ceb8c1b402ae93` |
| Anteprima | [WebP](anteprime/base.character.Rocco-2.webp), 512 px, qualità 80 |
| Controllo oggettivo | Figura più piccola rispetto al bar; cocktail e mignolo visibili. Il tatuaggio appare ancora attraversato da un breve tratto. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Correzione 6 — com.tokens.BrokenBeerBottle

| Campo | Valore |
|---|---|
| bindingName | `com.tokens.BrokenBeerBottle` |
| source | `originali/com.tokens.BrokenBeerBottle-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3229449 / `4373305b4f2413e2a43193677afe6d4d8747859b7e93e80eff53f92c55dc19e9` |
| promptSha256 | `d10ade728bae7e2d14564ee4d7a05b29e90f5c8accb636f58de98fa76b8f0b60` |
| Allegati effettivi | `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0`<br>`docs/design/client-c0/r1/card.png`: `4e575d0d7dc9ca43e410ccf7e94b9e16adffd32bafbd6fa7039b6aa5302f259a` |
| Anteprima | [WebP](anteprime/com.tokens.BrokenBeerBottle-2.webp), 512 px, qualità 80 |
| Controllo oggettivo | Frammento verde di bottiglia, schegge e goccia su legno; nessuna mano. Il pezzo appare spezzato a entrambe le estremità. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

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
| Giudizio del proprietario | Scelta: versione 1 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

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
| Giudizio del proprietario | Scelta: versione 1 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

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
| Giudizio del proprietario | Scelta: versione 1 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

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
| Giudizio del proprietario | Scelta: versione 1 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

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

## Secondo giro di correzioni

Su richiesta del proprietario: [prompt letterali](prompt-correzioni-2.md), committati prima della generazione in `e55e36b`. Strumento `image_gen.imagegen`, modello non esposto, riscrittura non esposta, data 2026-11-24. Le versioni precedenti restano disponibili; giudizio visivo riservato al proprietario.

### Secondo giro 1 — bruiser.character.BigBadBruiser

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.BigBadBruiser` |
| source | `originali/bruiser.character.BigBadBruiser-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2921768 / `87485c0c21cea7ffab5ce12fcc0dce50e094ab281f9a12a4a4416e502a039970` |
| promptSha256 | `0363126fc6288c4eff9e44d2010f371c47de32484bdbc4eed8ba09449fcee387` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/bruiser.character.BigBadBruiser-2.png`: `dd15bf452e0609457625110e89e57c9cc1d75078f85cec53bd8017fc373a1d52` |
| Anteprima | [WebP](anteprime/bruiser.character.BigBadBruiser-3.webp), 512 px, qualità 80 |
| Controllo oggettivo | Ombra unita ai piedi, estesa verso destra senza il lobo a sinistra. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario | Scelta: versione 3 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

### Secondo giro 2 — base.character.Pino

| Campo | Valore |
|---|---|
| bindingName | `base.character.Pino` |
| source | `originali/base.character.Pino-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2847060 / `c80ab9b915894043b4671079e1e501b1e0f4b28fa7bdbcfbac66c3924afd4e49` |
| promptSha256 | `01584be69b6a6d8c56ab962e37f3dc6193c6751c0c54c9baecda8d4dbbec3709` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Pino-2.png`: `a70787867bdbb4c69e1fc64b0108f3cd21c9312b9ef4e6182af9fe7f3a18a7f5` |
| Anteprima | [WebP](anteprime/base.character.Pino-3.webp), 512 px, qualità 80 |
| Controllo oggettivo | Sedia con schienale e gambe dritte; matita tra i capelli. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Secondo giro 3 — base.pino.bound.SpallataAlBancone

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| source | `originali/base.pino.bound.SpallataAlBancone-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2909589 / `5f9a459c8cd6100000b64805779b23c835c9f499d30bf835448cdd9c40c32ecd` |
| promptSha256 | `b5f313a568884a211595eb371c16027857a799c983a689d5632986820d294c2e` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.pino.bound.SpallataAlBancone-2.png`: `46187d20693bf638d466af5aa520556ea473e4e06eb9ff5f85cee8cf68f93207` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone-3.webp), 512 px, qualità 80 |
| Controllo oggettivo | Sedia con schienale e gambe dritte; matita e spruzzata conservate. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Secondo giro 4 — base.character.Cesira

| Campo | Valore |
|---|---|
| bindingName | `base.character.Cesira` |
| source | `originali/base.character.Cesira-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2999935 / `5b43cbc2fe9ab7cb42ec5cec3255295621eedea73d19ed806d434c16372a41ca` |
| promptSha256 | `e1a5e0a085bbeef448e290d3535fc91569c923cca7f6539f524f4b8ebac267ae` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Cesira-2.png`: `0be0b5754d30cb62ad1d0669f7039f94524ccc1c3f3b0ec6b4bddeb587447e20` |
| Anteprima | [WebP](anteprime/base.character.Cesira-3.webp), 512 px, qualità 80 |
| Controllo oggettivo | Sergio seduto a gambe accavallate vicino a un tavolino laterale; calzini e laccio visibili. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Secondo giro 5 — com.tokens.BrokenBeerBottle

| Campo | Valore |
|---|---|
| bindingName | `com.tokens.BrokenBeerBottle` |
| source | `originali/com.tokens.BrokenBeerBottle-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3077741 / `0f71762408d53375578bee3a08a9bf98e0f58378bb2605affe5bb2ee86510114` |
| promptSha256 | `4d91d2855faa51408c1c6a3c4f7103ceccd08f2cd6f82ffee0cfa108b5ab4587` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/com.tokens.BrokenBeerBottle-2.png`: `4373305b4f2413e2a43193677afe6d4d8747859b7e93e80eff53f92c55dc19e9` |
| Anteprima | [WebP](anteprime/com.tokens.BrokenBeerBottle-3.webp), 512 px, qualità 80 |
| Controllo oggettivo | Collo di bottiglia con imboccatura integra e un solo bordo fratturato; senza mani. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario | Scelta: versione 3 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

## Ultimi ritocchi

Su richiesta del proprietario: [prompt letterali](prompt-correzioni-3.md), committati prima della generazione in `14fc93c`. Strumento `image_gen.imagegen`, modello non esposto, riscrittura non esposta, data 2026-11-24. Originali precedenti e scartati conservati fuori da git.

### Piera — personaggio

| Campo | Valore |
|---|---|
| bindingName | `base.character.Pino` |
| source | `originali/base.character.Pino-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2725800 / `3e3889ca2545fc0fa36cd1acc66d80a7173c5b03f81bd0090f85d4d4a4253425` |
| promptSha256 | `69f657291921da02736f8f2062cdd6ab9b3b9d2945f8a31766401fb0e6081a14` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Pino-3.png`: `c80ab9b915894043b4671079e1e501b1e0f4b28fa7bdbcfbac66c3924afd4e49` |
| Anteprima | [WebP](anteprime/base.character.Pino-4.webp), 512 px, qualità 80 |
| Controllo oggettivo | Seduta senza schienale; matita conservata. |
| Esito | Conservata per il giudizio. |
| Giudizio del proprietario |  |

### Piera — Seltz

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| source | `originali/base.pino.bound.SpallataAlBancone-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2842144 / `196b87f348243d53c206434b7a70d2fff71b749096ea05e863d4abacb0bc483f` |
| promptSha256 | `db1e801ac6f01be727893bc775167f0ca2e856c60f83bc28969555859ef014ee` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.pino.bound.SpallataAlBancone-3.png`: `5f9a459c8cd6100000b64805779b23c835c9f499d30bf835448cdd9c40c32ecd` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone-4.webp), 512 px, qualità 80 |
| Controllo oggettivo | Seduta senza schienale; il getto parte dal cannello e ne segue la direzione. |
| Esito | Conservata per il giudizio. |
| Giudizio del proprietario |  |

### Sergio — primo tentativo

| Campo | Valore |
|---|---|
| bindingName | `base.character.Cesira` |
| source | `originali/base.character.Cesira-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2972035 / `f645f8b64d37a7607cf501f3c82c5b7a699282cb6c1062c1d39d9c23f1f07ee4` |
| promptSha256 | `d8d4257c1bf15f6549a8bd3684efb997b02f579365c8a58a00648a7a4b302a89` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Cesira-3.png`: `5b43cbc2fe9ab7cb42ec5cec3255295621eedea73d19ed806d434c16372a41ca` |
| Anteprima | [WebP](anteprime/base.character.Cesira-4.webp), 512 px, qualità 80 |
| Controllo oggettivo | Centrato e senza fiori, ma la sedia è tornata verso il centro della stanza. |
| Esito | Scartato per la posizione; ripetuto una volta con lo stesso prompt. |
| Giudizio del proprietario |  |

### Sergio — secondo tentativo

| Campo | Valore |
|---|---|
| bindingName | `base.character.Cesira` |
| source | `originali/base.character.Cesira-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2954903 / `a3e3bf7345db417b1ebd369db026c32a029ed388da38dd20b84897fe4ce1af52` |
| promptSha256 | `d8d4257c1bf15f6549a8bd3684efb997b02f579365c8a58a00648a7a4b302a89` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Cesira-3.png`: `5b43cbc2fe9ab7cb42ec5cec3255295621eedea73d19ed806d434c16372a41ca` |
| Anteprima | [WebP](anteprime/base.character.Cesira-5.webp), 512 px, qualità 80 |
| Controllo oggettivo | Centrato e senza fiori, ma anche qui la sedia è tornata verso il centro della stanza. |
| Esito | Conservato per il confronto; posizione laterale non rispettata. |
| Giudizio del proprietario |  |

## Seduta discreta e scelta di Sergio

Su richiesta del proprietario si riprende Sergio al tavolino laterale, [anteprima della versione 3](anteprime/base.character.Cesira-3.webp), con fiori e inquadratura intera; nessuna generazione o ritaglio per Sergio. Le nuove sedute seguono i [prompt](prompt-correzioni-4.md), committati prima in `f8f2b80`. Strumento `image_gen.imagegen`, modello e riscrittura non esposti, data 2026-11-24.

### Seduta discreta 1 — base.character.Pino

| Campo | Valore |
|---|---|
| bindingName | `base.character.Pino` |
| source | `originali/base.character.Pino-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2667334 / `da4538e544fc0520e9dcd6fccb502f604ed5be88290fb3897bb20113470a854d` |
| promptSha256 | `3ca00ae8cdc4e858730e720e9430dbb50e90c6481a69290fe2d937ea20112e0c` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Pino-4.png`: `3e3889ca2545fc0fa36cd1acc66d80a7173c5b03f81bd0090f85d4d4a4253425` |
| Anteprima | [WebP](anteprime/base.character.Pino-5.webp), 512 px, qualità 80 |
| Controllo oggettivo | Seduta senza schienale, più scura e con meno contrasto. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

### Seduta discreta 2 — base.pino.bound.SpallataAlBancone

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| source | `originali/base.pino.bound.SpallataAlBancone-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2813202 / `2cfc605ffa673554947c53ca9b164931de7fd599b5593d534ec24a8e1b88a8d7` |
| promptSha256 | `2e1dbb41555ed6af8f8421bdd7227f586e8a9c05da062b7556e2cec8a3511212` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.pino.bound.SpallataAlBancone-4.png`: `196b87f348243d53c206434b7a70d2fff71b749096ea05e863d4abacb0bc483f` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone-5.webp), 512 px, qualità 80 |
| Controllo oggettivo | Seduta senza schienale, più scura e con meno contrasto. Il getto parte dal cannello in asse. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

## Ultime correzioni a Piera e Grappino

Su richiesta del proprietario: [prompt letterali](prompt-correzioni-5.md), committati prima in `0608bd2`. Strumento `image_gen.imagegen`, modello e riscrittura non esposti, data 2026-11-24. Le versioni precedenti restano disponibili; giudizio visivo riservato al proprietario.

### Ultima correzione 1 — base.character.Pino

| Campo | Valore |
|---|---|
| bindingName | `base.character.Pino` |
| source | `originali/base.character.Pino-6.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2782399 / `fb69129579c48cc38c1501bffe6b8822182b5317e5b30e83a78538012c955acd` |
| promptSha256 | `01e6e4eee417a3482acf3702b2248b2238902135d93a8d8a0c8283082589bd42` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Pino-5.png`: `da4538e544fc0520e9dcd6fccb502f604ed5be88290fb3897bb20113470a854d` |
| Anteprima | [WebP](anteprime/base.character.Pino-6.webp), 512 px, qualità 80 |
| Controllo oggettivo | Seduta rotonda più piccola, senza schienale, con gambe visibili. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario | Scelta: versione 6 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

### Ultima correzione 2 — base.pino.bound.SpallataAlBancone

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| source | `originali/base.pino.bound.SpallataAlBancone-6.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2801443 / `ad9484fe9044c21ef0718899b38b1d6413de5456d1435123751053c7e243f37a` |
| promptSha256 | `cea2ef2ebd4ff920414ef8b5d673238656ab1179c28e943ba4312c4a8cbd1eb9` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.pino.bound.SpallataAlBancone-5.png`: `2cfc605ffa673554947c53ca9b164931de7fd599b5593d534ec24a8e1b88a8d7` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone-6.webp), 512 px, qualità 80 |
| Controllo oggettivo | Getto stretto dalla punta del beccuccio, allineato al suo asse; quattro zampe distinguibili e appoggiate. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario |  |

## Punta della matita e posizione di Grappino

Su richiesta del proprietario; [prompt letterale](prompt-correzioni-6.md) committato prima in `cd69e8a`.

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.SpallataAlBancone` |
| source | `originali/base.pino.bound.SpallataAlBancone-7.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2726699 / `0623245c5b24e51ce40f15666f1768b09bc6b28c2b8d2986dbc6fc53c619c55a` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| promptSha256 | `419a078a81bc9f7e544c19affbfb8768d51cf85aa127353d6bdda751e8f0a1bd` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.pino.bound.SpallataAlBancone-6.png`: `ad9484fe9044c21ef0718899b38b1d6413de5456d1435123751053c7e243f37a` |
| Anteprima | [WebP](anteprime/base.pino.bound.SpallataAlBancone-7.webp), 512 px, qualità 80 |
| Controllo oggettivo | Punta della matita visibile; Grappino spostato a destra e separato dalla gamba, quattro zampe appoggiate; getto in asse. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario | Scelta: versione 7 ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 1). |

## Scelte del campione D192

Il proprietario ha scelto Spazienzio 3, Mara 1, Celestina 1, Piera 6, Beppe 1, Seltz 7, Posacenere 1 e Bottiglia Spaccata 3. Sergio dalla 3 e Duccio dalla 2 attendono il giudizio sulle nuove versioni. Nessuna illustrazione O9 si conserva: stile diverso e volti riconoscibili nel furto; tutto il set si genera nuovo ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punti 1–3).

## Reinquadratura D192

[Prompt letterali](prompt-correzioni-7.md) committati prima in `b8c6d30`; un tentativo per personaggio, nessuno scartato o ripetuto. Modello e riscrittura non esposti; nessun campo negativo separato. Originali fuori da git, copie inalterate dei risultati. [Scheda di confronto](giudizio-correzioni-7.html). La somiglianza e la leggibilità rimangono al giudizio del proprietario.

### Sergio — versione 6

| Campo | Valore |
|---|---|
| bindingName | `base.character.Cesira` |
| source | `originali/base.character.Cesira-6.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2495665 / `20a8762a59ad23339fea1d280b623e15ee12330d62ede8d1413132188477e5f5` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| promptSha256 | `fe3827829eba7e28df44cd9516642f809e3bb1e6504df5d131462461979405c0` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Cesira-3.png`: `5b43cbc2fe9ab7cb42ec5cec3255295621eedea73d19ed806d434c16372a41ca` |
| Anteprima | [WebP](anteprime/base.character.Cesira-6.webp), 512 px, qualità 80 |
| Controllo oggettivo | Figura intera e grande, seduta al tavolino con fiori; sigaretta, calzini spaiati e laccio visibili; sfondo più scuro e morbido. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario | In attesa del giudizio sulla versione D192. |

**Verifiche del giro D192:** `python scripts/check-rules.py` verde; `python scripts/check-links.py` segnala i 22 collegamenti storici già annotati sopra, nessuno nei file SB-32; `git diff --check` senza segnalazioni. Le anteprime e i riferimenti della scheda sono verificati localmente. Nessun atteso o comportamento di gioco modificato. Scelta presa: originali fuori da git come nei giri precedenti. In attesa del giudizio del proprietario sulle sole due reinquadrature.

### Duccio — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.character.Rocco` |
| source | `originali/base.character.Rocco-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2242193 / `f31be33c2643998c559db77059279b1b96ef1af43f7751f788f583afeca0f475` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-24 |
| Prompt riscritto | non esposto |
| promptSha256 | `0b614fb139f68480899c6a8e1976f1b3cef3c1e96f401e135c108c02ffb0d549` |
| Allegato effettivo | `docs/design/set-base/sb-32/originali/base.character.Rocco-2.png`: `a1279fceb340342a2d74d1445ce5379357bbbec7c51562d4d55f5ebe4427327d` |
| Anteprima | [WebP](anteprime/base.character.Rocco-3.webp), 512 px, qualità 80 |
| Controllo oggettivo | Figura intera e grande, cocktail e mano sul cuore visibili, mignolo alzato; aquila e tatuaggio conservati; sfondo più scuro e morbido. |
| Esito | Conservata per il giudizio; nessun tentativo scartato. |
| Giudizio del proprietario | In attesa del giudizio sulla versione D192. |


## Lotto 1 — Spazienzio

[Prompt letterali](lotto-01-spazienzio.md), commit `d548e84`. Le sette associazioni indicate come inferite derivano dal soggetto visibile e dall’ordine dei file prodotti, coerente con l’ordine dei prompt; la chiamata parallela è stata interrotta senza restituire la mappatura tecnica. Le impronte dei prompt per queste immagini sono quindi **attribuite per inferenza**, non prova tecnica. Le copie originali con nomi `non-attribuito-exec-*` sono conservate fuori da git. Gli esiti della prima chiamata interrotta per VIOLENZAZIONE e SVEGLIAMOCI sono ignoti, non classificabili come rifiuti. Una nuova chiamata per ciascuna ha dato rispettivamente un rifiuto e un’immagine. Nessun’altra ripetizione. Modello e riscrittura del prompt non esposti.

### SGOMBERIAMOVI

| Campo | Valore |
|---|---|
| bindingName | `base.bruiser.TiFaccioSpazio` |
| promptSha256 | `873249a86ca3ae2812bbaa26bda1895150222ade1e533cd1e496d5d65640a206` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/base.bruiser.TiFaccioSpazio.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2945418 / `b887ffe1d1d2896789fe663f7f52bc1d3af64f0df52ff77c73f41a067116a531` |
| Anteprima | [WebP](anteprime/base.bruiser.TiFaccioSpazio.webp), 512 px, qualità 80 |
| Associazione | certa |
| Controllo a 60 px | Soggetto grande e contrastato; sgabello riconoscibile, gesto leggibile. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### VIOLENZAZIONE

| Campo | Valore |
|---|---|
| bindingName | `base.spazienzio.bound.TestaAlMuro` |
| promptSha256 | `108fc8a422288aa38b94b8f500921042385496b981578d4ea1dc041f32d8fdc6` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Esito | Rifiuto `moderation_blocked` in uscita (self-harm, violence), ID `e29b02ea-14b2-4b13-b55f-0d3105476051`; nessun file. Non ripetuto. |
| Controllo a 60 px | Non possibile. |

### SPEDIAMOTI DUNQUE IN O-AHIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.ExtremelyViolentBlow` |
| promptSha256 | `1b18f104197c068ff24e24a2bcf6137beba851c4b9a56b2d12585f90aff8a57f` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.ExtremelyViolentBlow.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2822764 / `e477d1735a916f199feebabce60c2a2fc0bb832a5784e6bff90da6461279590f` |
| Anteprima | [WebP](anteprime/bruiser.ExtremelyViolentBlow.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-1a9977ef |
| Controllo a 60 px | Figura grande; avversario piccolo e vicino al bordo, il lancio è meno evidente a 60 px. Da giudicare. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### PAZIENZA: FINITA

| Campo | Valore |
|---|---|
| bindingName | `bruiser.Glare` |
| promptSha256 | `9b43e183759b9c12c1100d0b644d18dc642dfdd4c6f9bee6c9813d23df5117bd` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.Glare.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2935670 / `159edd6b685ebfc61bb9bfdb367c44a76241d068765cfe6aca4de9578ec52dea` |
| Anteprima | [WebP](anteprime/bruiser.Glare.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-144f8b68 |
| Controllo a 60 px | Figura grande e distinta; pugni visibili, espressione meno leggibile in piccolo. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### NON GIOCARE COL COLTELLO NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.MadeOfStone` |
| promptSha256 | `2425a76d54d8fad1155bf86004b61b2eea1158edefafefbb5c14b0b0413c6d7c` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.MadeOfStone.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3042807 / `ea252054a321bd159ef4bdfa7af9055f66662411a8578bc8da67ea7b90b862b1` |
| Anteprima | [WebP](anteprime/bruiser.MadeOfStone.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-0bbc7dc8 |
| Controllo a 60 px | Il coltello è molto piccolo a 60 px; il personaggio sembra seduto e non afferra la lama come richiesto. Dubbia. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### GARGANTUESCO IMPATTO SUL TU

| Campo | Valore |
|---|---|
| bindingName | `bruiser.SuperImpact` |
| promptSha256 | `171c13ad56988ec14d67c2a5ff1a22c32c15bd45ce5a394c85b3a211fb7852fe` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.SuperImpact.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3035976 / `0460a5ac00ccea4a9043416dd97852460789b34d72660e550634f81293ede1c1` |
| Anteprima | [WebP](anteprime/bruiser.SuperImpact.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-9876cd8c |
| Controllo a 60 px | Soggetto grande; il pugno e la figura scura sono vicini e il contatto si perde un poco a 60 px. Da giudicare. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### FAI BASTA

| Campo | Valore |
|---|---|
| bindingName | `bruiser.YouStop` |
| promptSha256 | `b53007639defa5f58b4b8bdfd19fbcf20de2f66620d0242468a69fa4f1a62f38` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.YouStop.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3008731 / `ccc846db66e7f6b58cc2e5bfdb5f1fee2595857d271e6d914c220f2f5612dc2b` |
| Anteprima | [WebP](anteprime/bruiser.YouStop.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-8664917b |
| Controllo a 60 px | Figura grande e contrastata; la presa sul polso è minuta a 60 px. Da giudicare. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### LIEVE FASTIDIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleRage` |
| promptSha256 | `5f5db4a4465233aeab1736cf576609d8d7078f92a51289b043f07744b9d0a229` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.character.LittleRage.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2827083 / `36cfb9493565b2218c6fbf71ff04016d438c744b91b2d134f2920eb7214b42e3` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleRage.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-95b9c6ab |
| Controllo a 60 px | Figura grande con pugni chiusi; somiglia molto a PAZIENZA: FINITA e la sfumatura di irritazione si perde. Dubbia. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### SVEGLIAMOCI - MA TU NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| promptSha256 | `86a0939574cc6c0146183318fd5aa07f4bb896d6a914f17efacde24d87b74408` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/bruiser.character.LittleSmack-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3016996 / `575bb2c0ee6acf4403d2126261450bc9f18b0a1261fc6341bd26cf994f92a604` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-2.webp), 512 px, qualità 80 |
| Associazione | certa; ripetizione dopo chiamata interrotta senza esito |
| Controllo a 60 px | Figura grande; schiaffo leggibile, ma avversario e mano sono vicini al bordo. Da giudicare. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |

### ADOPERIAMOTI

| Campo | Valore |
|---|---|
| bindingName | `com.basic.BruiserGrab` |
| promptSha256 | `a1e11c51f1b697ed773451fbb7569c9c14e3a47687a242b385fe05aa422ff1c5` (attribuzione inferita) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| source | `originali/com.basic.BruiserGrab.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2870430 / `409e9fb5ce399a9983f440ee186785a6be808702e9956f8fa214b163cdde0696` |
| Anteprima | [WebP](anteprime/com.basic.BruiserGrab.webp), 512 px, qualità 80 |
| Associazione | inferita: exec-932921fa |
| Controllo a 60 px | Figura grande; bottiglia alzata visibile, ma non appare presa dal bancone. Da giudicare. |
| Esito | Conservata provvisoriamente; giudizio del proprietario in attesa. |


## Giudizio del proprietario e correzioni del lotto 1

Il proprietario approva «SGOMBERIAMOVI», «PAZIENZA: FINITA» e «FAI BASTA» con «ok»; chiede le sette correzioni riportate nei [prompt letterali](lotto-01-spazienzio.md#correzioni-del-giudizio-del-proprietario), commit `370f649`. Una generazione per prompt, nessun nuovo rifiuto o tentativo aggiuntivo. Le versioni precedenti e gli originali restano conservati; modello e riscrittura non esposti.

### Correzione — VIOLENZAZIONE

| Campo | Valore |
|---|---|
| bindingName | `base.spazienzio.bound.TestaAlMuro` |
| source | `originali/base.spazienzio.bound.TestaAlMuro-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3139454 / `4685f8fd07cc9f3ddb761190bc734c8f0a83b9258a9c982c56f63e24e44d5fa6` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `352b2ec806de1b8f35ce517539c5288fe28c481c28466d4d9003e374b628d237` |
| Allegati effettivi | `spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Anteprima | [WebP](anteprime/base.spazienzio.bound.TestaAlMuro-2.webp), 512 px, qualità 80 |
| Controllo a 60 px | Pugni e testa contro la parete imbottita; soggetto grande. A 60 px il gesto è meno immediato; il corpo è tagliato. Da giudicare. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |

### Correzione — SPEDIAMOTI DUNQUE IN O-AHIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.ExtremelyViolentBlow` |
| source | `originali/bruiser.ExtremelyViolentBlow-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2640323 / `232bbb99ec379ea1a6b6c27ac58ee7f95eea2413a1a2aff9a3cd24786da9f1dc` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `af4beb2a0e2814e549f3a8b401d816eb279114e0cf3b84b46f1bd6c1d045a548` |
| Allegati effettivi | `originali/bruiser.ExtremelyViolentBlow.png`: `e477d1735a916f199feebabce60c2a2fc0bb832a5784e6bff90da6461279590f` |
| Anteprima | [WebP](anteprime/bruiser.ExtremelyViolentBlow-2.webp), 512 px, qualità 80 |
| Controllo a 60 px | Pugno e avversario lungo la stessa diagonale; l’avversario è piccolo e vicino al bordo a 60 px. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |

### Correzione — NON GIOCARE COL COLTELLO NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.MadeOfStone` |
| source | `originali/bruiser.MadeOfStone-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2912944 / `642de452b1856e7bdc30b1f1095552feedfb4e0f96ec242db2430b670bbae8ba` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `3d451900e5c2e58904f5184b72bad0f104537bfc72bbf43bd0c2f6b30c456cca` |
| Allegati effettivi | `originali/bruiser.MadeOfStone.png`: `ea252054a321bd159ef4bdfa7af9055f66662411a8578bc8da67ea7b90b862b1` |
| Anteprima | [WebP](anteprime/bruiser.MadeOfStone-2.webp), 512 px, qualità 80 |
| Controllo a 60 px | La mano stringe l’impugnatura e la lama resta fuori; il coltello è piccolo a 60 px. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |

### Correzione — GARGANTUESCO IMPATTO SUL TU

| Campo | Valore |
|---|---|
| bindingName | `bruiser.SuperImpact` |
| source | `originali/bruiser.SuperImpact-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2966689 / `bfe161c03698b1dd68df3a5095a01b2c836d88f916673883584b4bbcdf044d4d` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `e1179e1d4e74ca58be1032228887c9272d206b0e3fc0c00b8c22b29c0554207b` |
| Allegati effettivi | `originali/bruiser.SuperImpact.png`: `0460a5ac00ccea4a9043416dd97852460789b34d72660e550634f81293ede1c1` |
| Anteprima | [WebP](anteprime/bruiser.SuperImpact-2.webp), 512 px, qualità 80 |
| Controllo a 60 px | Colpo e linee di movimento evidenti; le ciabatte del riferimento sono diventate scarpe, e l’avversario esce dal bordo. Dubbia. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |

### Correzione — LIEVE FASTIDIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleRage` |
| source | `originali/bruiser.character.LittleRage-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2645482 / `99ac18386436758edb84d281581f13e8d12a19c58f0c2081e2773c99bca139f1` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `43aca281121bf60fb65dbcd86f50c9a584d54264439bb453e23465dfd3a24889` |
| Allegati effettivi | `originali/bruiser.character.LittleRage.png`: `36cfb9493565b2218c6fbf71ff04016d438c744b91b2d134f2920eb7214b42e3` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleRage-2.webp), 512 px, qualità 80 |
| Controllo a 60 px | Colpo alla spalla e immobilità visibili; a 60 px il punto d’impatto è piccolo. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |

### Correzione — SVEGLIAMOCI - MA TU NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| source | `originali/bruiser.character.LittleSmack-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2907445 / `0da8cd215cf4c50c0e16a3f3b8416e65d8df86be1251161bd62009004e6bdb70` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `0582b586de6bf4d88be0b20cfd52baf20ec030dffd715df95604e0da2da58b54` |
| Allegati effettivi | `originali/bruiser.character.LittleSmack-2.png`: `575bb2c0ee6acf4403d2126261450bc9f18b0a1261fc6341bd26cf994f92a604` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-3.webp), 512 px, qualità 80 |
| Controllo a 60 px | Palmo aperto e polso più coerenti; il contatto è vicino al bordo. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |

### Correzione — ADOPERIAMOTI

| Campo | Valore |
|---|---|
| bindingName | `com.basic.BruiserGrab` |
| source | `originali/com.basic.BruiserGrab-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2879811 / `7f641a631986c57392b9a6390e7455a3f0c5438339966072850de99d3719075e` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `a4e9d407f6ff588101a4ab5ba992547ef819e81b1f023893e62bcfd6bd48d068` |
| Allegati effettivi | `originali/com.basic.BruiserGrab.png`: `409e9fb5ce399a9983f440ee186785a6be808702e9956f8fa214b163cdde0696` |
| Anteprima | [WebP](anteprime/com.basic.BruiserGrab-2.webp), 512 px, qualità 80 |
| Controllo a 60 px | La mano afferra la bottiglia sul banco senza avversario; l’oggetto è piccolo a 60 px. |
| Esito | Conservata per il giudizio; nessun tentativo ripetuto. |


## Secondo giudizio e correzioni del lotto 1

Il proprietario approva VIOLENZAZIONE e la nuova versione di NON GIOCARE COL COLTELLO NO con «ok». ADOPERIAMOTI resta in attesa. Quattro [prompt](lotto-01-spazienzio.md#secondo-giudizio-correzioni-del-lotto-1) committati in `4f0fdec`; una generazione per prompt, nessun rifiuto o tentativo ripetuto. Modello e riscrittura non esposti.

### SPEDIAMOTI DUNQUE IN O-AHIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.ExtremelyViolentBlow` |
| source | `originali/bruiser.ExtremelyViolentBlow-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2583161 / `213e237b325d54631fd66bb4a7450f31451a8828099d5eeffe8341ecf1e36e73` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `1bd4439c42d516861d5ece2f86f14ecf249b1a8ab3dfaf070d207d2f783ad45f` |
| Allegato effettivo | `originali/bruiser.ExtremelyViolentBlow.png`: `e477d1735a916f199feebabce60c2a2fc0bb832a5784e6bff90da6461279590f` |
| Anteprima | [WebP](anteprime/bruiser.ExtremelyViolentBlow-3.webp), 512 px, qualità 80 |
| Controllo | Pugno a contatto e traiettoria coerente; avventore ancora vicino al bordo. |
| Esito | Conservata per il giudizio. |

### GARGANTUESCO IMPATTO SUL TU

| Campo | Valore |
|---|---|
| bindingName | `bruiser.SuperImpact` |
| source | `originali/bruiser.SuperImpact-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2802381 / `8e520d5a2d19bbfeb3bd73bb587d6fce0976570073b8dea731cc10eff029b5c5` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `0141a8da85424ba2970fab6bebafd9d53222c8e5bcd85c18817f0944eefeb56b` |
| Allegato effettivo | `originali/bruiser.SuperImpact-2.png`: `bfe161c03698b1dd68df3a5095a01b2c836d88f916673883584b4bbcdf044d4d` |
| Anteprima | [WebP](anteprime/bruiser.SuperImpact-3.webp), 512 px, qualità 80 |
| Controllo | Ciabatte visibili; dita visibili insieme ai calzini, dettaglio da giudicare. |
| Esito | Conservata per il giudizio. |

### LIEVE FASTIDIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleRage` |
| source | `originali/bruiser.character.LittleRage-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2683217 / `8f3bae1aad9644cc5e611ba34e9698620c01e8ce542d8933dae3d698bf63bd73` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `faa1c147715d403477c5e4015399ce64b4b3aa89db9acbf4b3c279c632cd2cc6` |
| Allegato effettivo | `originali/bruiser.character.LittleRage-2.png`: `99ac18386436758edb84d281581f13e8d12a19c58f0c2081e2773c99bca139f1` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleRage-3.webp), 512 px, qualità 80 |
| Controllo | Pugno sulla guancia e sorriso visibili; espressione piccola a 60 px. |
| Esito | Conservata per il giudizio. |

### SVEGLIAMOCI - MA TU NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| source | `originali/bruiser.character.LittleSmack-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2832624 / `2495c55cb523b1a8c8d09fe06b91351635ae00814184270685d6a920731dbc15` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `8d9e08d8760fa5b36dd9217ba43279677b26521b3fb8bd480569ad249e1c2a01` |
| Allegato effettivo | `originali/bruiser.character.LittleSmack-3.png`: `0da8cd215cf4c50c0e16a3f3b8416e65d8df86be1251161bd62009004e6bdb70` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-4.webp), 512 px, qualità 80 |
| Controllo | Due mani ai lati della testa; la posizione delle dita e il gesto meritano giudizio. |
| Esito | Conservata per il giudizio. |


## Terzo giudizio e correzioni del lotto 1

Il proprietario approva ADOPERIAMOTI con «ok» e chiede immagini che comunichino «un senso di movimento, di azione, di violenza». Quattro [prompt](lotto-01-spazienzio.md#terzo-giudizio-correzioni-del-lotto-1) committati in `521a02e`; una generazione per prompt, nessun rifiuto o tentativo ripetuto. Modello e riscrittura non esposti.

### SPEDIAMOTI DUNQUE IN O-AHIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.ExtremelyViolentBlow` |
| source | `originali/bruiser.ExtremelyViolentBlow-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2488482 / `290f537daaf61af081cc75c0b7608081f550ca876ffead2a34ed73ba139e61a8` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `ed98121f1b46e79d2557428b59e75240736c2decdec19a5a9b2b1b8b7d3a5595` |
| Allegato effettivo | `originali/bruiser.ExtremelyViolentBlow-3.png`: `213e237b325d54631fd66bb4a7450f31451a8828099d5eeffe8341ecf1e36e73` |
| Anteprima | [WebP](anteprime/bruiser.ExtremelyViolentBlow-4.webp), 512 px, qualità 80 |
| Nota | Lancio per i piedi e movimento visibili; Spazienzio indossa scarpe invece delle ciabatte. |
| Esito | Conservata per il giudizio. |

### GARGANTUESCO IMPATTO SUL TU

| Campo | Valore |
|---|---|
| bindingName | `bruiser.SuperImpact` |
| source | `originali/bruiser.SuperImpact-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3059863 / `525d313f805ea598af1d78a2c10c8265695db65f8308eb13d3b2b72c68f17aaa` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `81b9250c73480edc0216fcc419efcbb6aa63cd66dc3aed18505fc9a71465692b` |
| Allegato effettivo | `originali/bruiser.SuperImpact-3.png`: `8e520d5a2d19bbfeb3bd73bb587d6fce0976570073b8dea731cc10eff029b5c5` |
| Anteprima | [WebP](anteprime/bruiser.SuperImpact-4.webp), 512 px, qualità 80 |
| Nota | Volto arrabbiato, impatto e movimento marcati; piedi fuori campo. |
| Esito | Conservata per il giudizio. |

### LIEVE FASTIDIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleRage` |
| source | `originali/bruiser.character.LittleRage-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3131825 / `6040aa38b656669552614c8720c98b7c8599a31e77a4295d9a1541857a71abe4` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `ed317d0a5fe41f1035d9de080f97b1e3e30a9e0e36ec7efdfd682154816496f2` |
| Allegato effettivo | `originali/bruiser.character.LittleRage-3.png`: `8f3bae1aad9644cc5e611ba34e9698620c01e8ce542d8933dae3d698bf63bd73` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleRage-4.webp), 512 px, qualità 80 |
| Nota | Primo piano con pugno sulla guancia e sorriso; il volto è molto deformato dal colpo. |
| Esito | Conservata per il giudizio. |

### SVEGLIAMOCI - MA TU NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| source | `originali/bruiser.character.LittleSmack-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2928787 / `f96e2d0af68916c80e0f507ee44c07cee51126af496e869ba77af1b3de4dd9b3` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-25 |
| promptSha256 | `dcc91dfacb0309807c2bea54c0c2c7fab30525df980c8fa0ac5083fb293c8722` |
| Allegato effettivo | `originali/bruiser.character.LittleSmack-4.png`: `2495c55cb523b1a8c8d09fe06b91351635ae00814184270685d6a920731dbc15` |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-5.webp), 512 px, qualità 80 |
| Nota | Due mani ai lati della testa; orecchie coperte e anatomia delle dita da giudicare. |
| Esito | Conservata per il giudizio. |


## Quarto giudizio: correzioni del lotto 1

Tre [prompt letterali](lotto-01-spazienzio.md#quarto-giudizio-correzioni-del-lotto-1) committati in `b8c42c7`; una generazione per carta, nessun tentativo ripetuto, scarto o rifiuto. Modello e riscrittura dello strumento non esposti. Originali fuori da git; giudizio del proprietario in attesa.

### GARGANTUESCO IMPATTO SUL TU

| Campo | Valore |
|---|---|
| bindingName | `bruiser.SuperImpact` |
| source | `originali/bruiser.SuperImpact-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2958669 / `546245494baf2031ef4e3db998cf31e21610c72884c052bf6b90af1ef19d3f69` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| promptSha256 | `90e568af925fce3a19ff7b443f6ecf855c6d4c1da2df47ecbdb347853e6fd735` |
| Allegati effettivi | `originali/bruiser.SuperImpact-4.png`: `525d313f805ea598af1d78a2c10c8265695db65f8308eb13d3b2b72c68f17aaa`; `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Riscrittura | Non esposta. |
| Tentativi scartati / rifiuti | Nessuno. |
| Anteprima | [WebP](anteprime/bruiser.SuperImpact-5.webp), 512 px, qualità 80 |
| Nota | A 60 px il pugno e il bersaglio si distinguono; la mano in alto è vicina al bordo e la pelle resta molto arancione. |
| Giudizio del proprietario | Approvata: «il resto va bene» (sesto giudizio, [D204](../../../set-base-decisioni.md#decisioni-del-proprietario)). |

### LIEVE FASTIDIO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleRage` |
| source | `originali/bruiser.character.LittleRage-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3369726 / `bc162dcb63c843c8e3ace4e2f38467c8afdebe4ae516f5defb16a094b1c987a9` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| promptSha256 | `60d71c07d4786901c3691144472a90da25d7f61f5b410f9d9a7f5d7d8ca59421` |
| Allegati effettivi | `originali/bruiser.character.LittleRage-4.png`: `6040aa38b656669552614c8720c98b7c8599a31e77a4295d9a1541857a71abe4`; `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Riscrittura | Non esposta. |
| Tentativi scartati / rifiuti | Nessuno. |
| Anteprima | [WebP](anteprime/bruiser.character.LittleRage-5.webp), 512 px, qualità 80 |
| Nota | A 60 px sorriso e contatto sono leggibili; la deformazione della guancia resta marcata. |
| Giudizio del proprietario | Approvata: «il resto va bene» (sesto giudizio, [D204](../../../set-base-decisioni.md#decisioni-del-proprietario)). |

### SVEGLIAMOCI - MA TU NO

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| source | `originali/bruiser.character.LittleSmack-6.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3060506 / `050ee2fb2f8cdb712604d237cba9c3a4c173686fa5007a995e9360f414e0dc81` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| promptSha256 | `341cb3d14291e9fe430fcce94f08541f9c589386117faf2cf5632dd60d3c0673` |
| Allegati effettivi | `docs/design/set-base/identikit/riferimenti/spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Riscrittura | Non esposta. |
| Tentativi scartati / rifiuti | Nessuno. |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-6.webp), 512 px, qualità 80 |
| Nota | A 60 px lo schiaffo e le stelle si leggono; il palmo copre il viso e le dita sono difficili da distinguere. |
| Giudizio del proprietario | Rifiutata: «la mano è orientata male»; richiesto un pugno a martello. |


## Quinto giudizio: SVEGLIAMOCI - MA TU NO

Il proprietario rifiuta la versione 6: «la mano è orientata male» e chiede «spazienzio che tira un cazzotto a martello col pugno chiuso sopra la testa dell'avventore». [Prompt](lotto-01-spazienzio.md#quinto-giudizio-correzione-di-svegliamoci---ma-tu-no) committato in `0ef26e2`; una generazione, nessun tentativo ripetuto o rifiuto dello strumento.

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| source | `originali/bruiser.character.LittleSmack-7.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3214958 / `fd12338c8c22746b2a8657b7f48e73a85a33cc6b4e9c5dd3a8cc1e32eea52f0e` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| promptSha256 | `d57fb12b0e06c2727e75f4cbb8a0ca037eea0ec4b47d6f5bb2d11905e2a71a96` |
| Allegati effettivi | `docs/design/set-base/identikit/riferimenti/spazienzio.png`: `c4fae42acbb44d618731ae2d8b6c43dd810af9e52e64afd1c8bf199fde54f7d3`; `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Riscrittura | Non esposta. |
| Tentativi scartati / rifiuti | Nessuno. |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-7.webp), 512 px, qualità 80 |
| Nota | Il pugno chiuso tocca la testa; a 60 px contatto e avventore si distinguono, ma l’avventore è vicino ai bordi. |
| Giudizio del proprietario | Da correggere: «non si vede l'avventore, è tutto capelli» (sesto giudizio); superata dalla versione 8. |


## Sesto giudizio: SVEGLIAMOCI - MA TU NO

Il proprietario chiede una faccia stordita per l’avventore e dice «il resto va bene»: approvate le altre immagini presentate, comprese SuperImpact-5, LittleRage-5 e ExtremelyViolentBlow-4. La versione LittleSmack-7 resta da correggere perché l’avventore non si vede. Prompt committato in `4e00cb9`; una generazione, nessuna ripetizione o rifiuto.

| Campo | Valore |
|---|---|
| bindingName | `bruiser.character.LittleSmack` |
| source | `originali/bruiser.character.LittleSmack-8.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2982301 / `0769e6d697a71dbcf0aa0068dda42231147c2cd238366076e3614fa818c75dce` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| promptSha256 | `d9d0f0eb07e305b1b524e52e39149c343abd54b29973bc4644e6212852ad465c` |
| Allegato effettivo | `originali/bruiser.character.LittleSmack-7.png`: `fd12338c8c22746b2a8657b7f48e73a85a33cc6b4e9c5dd3a8cc1e32eea52f0e` |
| Riscrittura | Non esposta. |
| Tentativi scartati / rifiuti | Nessuno. |
| Anteprima | [WebP](anteprime/bruiser.character.LittleSmack-8.webp), 512 px, qualità 80 |
| Nota | Il volto stordito e il contatto sono visibili; a 60 px il viso è piccolo. Lo sfondo è più scuro e meno dettagliato della versione 7. |
| Giudizio del proprietario | Approvata: «sì, approvo SVEGLIAMOCI-8» ([D204](../../../set-base-decisioni.md#decisioni-del-proprietario)). |


## Chiusura del lotto 1

Chiuso il 26 novembre 2026 ([D204](../../../set-base-decisioni.md#decisioni-del-proprietario)). Versioni scelte, tutte con l'originale presente in `originali/`:

| Carta | bindingName | Versione | Anteprima |
|---|---|---|---|
| SGOMBERIAMOVI | `base.bruiser.TiFaccioSpazio` | 1 | [WebP](anteprime/base.bruiser.TiFaccioSpazio.webp) |
| VIOLENZAZIONE | `base.spazienzio.bound.TestaAlMuro` | 2 | [WebP](anteprime/base.spazienzio.bound.TestaAlMuro-2.webp) |
| SPEDIAMOTI DUNQUE IN O-AHIO | `bruiser.ExtremelyViolentBlow` | 4 | [WebP](anteprime/bruiser.ExtremelyViolentBlow-4.webp) |
| PAZIENZA: FINITA | `bruiser.Glare` | 1 | [WebP](anteprime/bruiser.Glare.webp) |
| NON GIOCARE COL COLTELLO NO | `bruiser.MadeOfStone` | 2 | [WebP](anteprime/bruiser.MadeOfStone-2.webp) |
| GARGANTUESCO IMPATTO SUL TU | `bruiser.SuperImpact` | 5 | [WebP](anteprime/bruiser.SuperImpact-5.webp) |
| FAI BASTA | `bruiser.YouStop` | 1 | [WebP](anteprime/bruiser.YouStop.webp) |
| LIEVE FASTIDIO | `bruiser.character.LittleRage` | 5 | [WebP](anteprime/bruiser.character.LittleRage-5.webp) |
| SVEGLIAMOCI - MA TU NO | `bruiser.character.LittleSmack` | 8 | [WebP](anteprime/bruiser.character.LittleSmack-8.webp) |
| ADOPERIAMOTI | `com.basic.BruiserGrab` | 2 | [WebP](anteprime/com.basic.BruiserGrab-2.webp) |

Eccezione alla guida di stile: in SVEGLIAMOCI-8 l'avventore ha un volto generico e stordito, su richiesta del proprietario; non vale per le altre carte.

## Lotto 2 — Mara

[Prompt letterali](lotto-02-mara.md), commit `2799716`. Una generazione per prompt, in ordine; nessun rifiuto, tentativo ripetuto o scartato. Modello e riscrittura non esposti; nessun campo negativo separato. Gli originali sono copie non modificate, fuori da git. [Pagina di giudizio](giudizio-lotto-02.html).

### Lazo del Rider

| Campo | Valore |
|---|---|
| bindingName | `base.mara.CinghiataDiTraverso` |
| promptSha256 | `fe5732ad7703de420cf590f99c8ddeaaeaadef858cc78e6c5e4f9a2715da2b9c` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.CinghiataDiTraverso.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2910124 / `5c1ad6e2c0def41eb5756549cbd8f4125e2e032739e62d84c71c3b260ac20d07` |
| Anteprima | [WebP](anteprime/base.mara.CinghiataDiTraverso.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mara e la cinghia si distinguono; il contatto con l’avversario è poco evidente. |
| Giudizio del proprietario | In attesa. |

### Requisire al Volo

| Campo | Valore |
|---|---|
| bindingName | `base.mara.PresoAlVolo` |
| promptSha256 | `490ab2b9dafdf97f87018b5f9d3b628e9b79559d8e756094a5663996632abdf9` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.PresoAlVolo.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2938631 / `355214c1b7dde700e3dbcfbab27b35fba49a9af9b6436c8e706529d55d0d965f` |
| Anteprima | [WebP](anteprime/base.mara.PresoAlVolo.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mara e il pacco si distinguono; il gesto di prenderlo dallo zaino è meno chiaro. |
| Giudizio del proprietario | In attesa. |

### Sgommata

| Campo | Valore |
|---|---|
| bindingName | `base.mara.Sgommata` |
| promptSha256 | `e97c47e635e6ec3cb839c84c7d210f6f5f38dcce82cda5eb1825c06b66542092` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.Sgommata.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3029351 / `84727d5ec84b6b2414ba3cb39b217af97f5f629203409727fee5a6b5f46a8d04` |
| Anteprima | [WebP](anteprime/base.mara.Sgommata.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bicicletta e sbandata leggibili; il contatto con l’avversario non è evidente. |
| Giudizio del proprietario | In attesa. |

### Slalom d'Avvicinamento

| Campo | Valore |
|---|---|
| bindingName | `base.mara.Slalom` |
| promptSha256 | `0c3f528f9e003dc728bfaffbe5bb08f1fa83a786588aab5f9975ccc71a360661` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.Slalom.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2881171 / `27f60b7faceed0dded2a7fc60f27a54cec37ba91e4035e04542140225614188c` |
| Anteprima | [WebP](anteprime/base.mara.Slalom.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | La corsa fra gli sgabelli si legge; il percorso a slalom è meno evidente. |
| Giudizio del proprietario | In attesa. |

### Agilità Innaturale

| Campo | Valore |
|---|---|
| bindingName | `base.mara.SorpassoInCurva` |
| promptSha256 | `3a95b8b7ef7d2a41c4447a36d6ffd784cd0fee576857ff29c2cf6b4e60d14fc9` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.SorpassoInCurva.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2836092 / `2810f3b76a68d146313b8e7bb3ee4dc6d6d9695fb3b5b1ab2361a3cbaf6328b7` |
| Anteprima | [WebP](anteprime/base.mara.SorpassoInCurva.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Il braccio teso e l’avversario si distinguono; il movimento di sorpasso è meno chiaro. |
| Giudizio del proprietario | In attesa. |

### Traiettoria Imprevedibile

| Campo | Valore |
|---|---|
| bindingName | `base.mara.TiStringoLaCurva` |
| promptSha256 | `3e23a11444c1f52b9a598c26c00d2759d64e8305adcb41606f0f4e5a563cbfc4` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.TiStringoLaCurva.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2876941 / `36732464ab1cd8f4b41bf92384cc55d7f2af06a21935fcebd2a6da7a8990c2ad` |
| Anteprima | [WebP](anteprime/base.mara.TiStringoLaCurva.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | La corsa e il cambio di direzione si suggeriscono; l’avversario è piccolo. |
| Giudizio del proprietario | In attesa. |

### Unta e Bisunta

| Campo | Valore |
|---|---|
| bindingName | `base.mara.TraDueParaurti` |
| promptSha256 | `21882994652d0be51293adc6297f35b96096acd77e7e6f0489de28f41c748bee` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.TraDueParaurti.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2795106 / `64fb6c231be0c3a72fd832f579e7b329a2a9c686cf40dcc6b7d0826057087d09` |
| Anteprima | [WebP](anteprime/base.mara.TraDueParaurti.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | La presa sul braccio e la torsione si distinguono; l’effetto unto è poco visibile. |
| Giudizio del proprietario | In attesa. |

### Semaforo Rosso

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.CambioMarcia` |
| promptSha256 | `d6360f6cf246ffe6237d08b0457efd251c822ceb4a39979a0d9a66535cb3058a` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.CambioMarcia.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2767119 / `f83be5de0e50470de63e68f0fee98b74cca61f706abb0acd699a1a8d5cb3a988` |
| Anteprima | [WebP](anteprime/base.mara.bound.CambioMarcia.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | La mano contro l’avversario e l’arresto si distinguono. |
| Giudizio del proprietario | In attesa. |

### Tagliare la Strada

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.ColpoDiStriscio` |
| promptSha256 | `5afd8d8ae74b7f7677456c8f055a2d61c01fa69fe1cbbe63a35531e1d2a12f82` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.ColpoDiStriscio.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2824070 / `b133eceac313c30c0a4f2261cc9f6e788cdc0b1061850a5f68a041266181e099` |
| Anteprima | [WebP](anteprime/base.mara.bound.ColpoDiStriscio.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | La corsa davanti all’avversario si distingue; le figure si sovrappongono. |
| Giudizio del proprietario | In attesa. |

### Sventare l'Assassinio

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.PassoStretto` |
| promptSha256 | `f77c10e9182bfd0a6c6e5cf2d6bc2a40794d2be475d117d93d5e6b4662b3df05` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.PassoStretto.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2770033 / `3058eac329e6c20150e218dc083179a32a6a6be49ad416ae5e6964d7b3e035fa` |
| Anteprima | [WebP](anteprime/base.mara.bound.PassoStretto.webp), 512 px, qualità 80 |
| Associazione | certa |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Il bicchiere che vola e il gesto della mano si distinguono. |
| Giudizio del proprietario | In attesa. |

### Primo giudizio del proprietario — lotto 2

26 novembre 2026. Slalom d’Avvicinamento: «bella», approvata. Correzioni richieste: mano in più in Lazo e Sventare; Requisire deve mettere il pacco nello zaino; Sgommata e Tagliare in bici fuori dal bar; rendere leggibili Agilità e Traiettoria; unto dei kebab e lieve sorriso in Unta; pollice e sguardo soddisfatto verso l’avventore in Semaforo. «Smettiamo di fare tutti gli avventori incappucciati»: avventori anonimi, senza cappucci. Prompt del giro aggiunti prima delle generazioni.

### Generazioni dopo il primo giudizio — lotto 2

Prompt preventivi: `4606e64`; rimozione localizzata di Lazo: `ea7dad2`. Dieci chiamate, una per prompt, nessun rifiuto o rilancio. Lazo versione 2 ha rimosso il casco ma lasciato l’arto: conservata e superata dalla versione 3 su indicazione con maschera del proprietario. Modello e riscrittura non esposti. Originali copiati senza modifica, fuori da git.

#### Lazo del Rider — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.CinghiataDiTraverso` |
| promptSha256 | `d06fff61d0c19afee1ed3963654d9b6c81349a5e7d8cebcc1a8b950d20c4ca21` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `originali/base.mara.CinghiataDiTraverso.png`: `5c1ad6e2c0def41eb5756549cbd8f4125e2e032739e62d84c71c3b260ac20d07` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.CinghiataDiTraverso-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2940334 / `e74e5bc6ed3df5386bdc7b100d9feef7aa2f5fe38d2ebf4201a693ff526fdbf0` |
| Anteprima | [WebP](anteprime/base.mara.CinghiataDiTraverso-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Cinghia e avventore leggibili; nella versione 2 resta il braccio pendente, corretto nella 3. |
| Giudizio del proprietario | In attesa. |

#### Requisire al Volo — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.PresoAlVolo` |
| promptSha256 | `c2c394c5cf1af952a391b2667e40aaba34e07318104553228c9a6ba1a056b9fa` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `originali/base.mara.PresoAlVolo.png`: `355214c1b7dde700e3dbcfbab27b35fba49a9af9b6436c8e706529d55d0d965f` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.PresoAlVolo-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2943439 / `d64d56cdfdb0c7a1daf9b34b287b57d91de29f5b89aa0dff85e09d622eb69ef8` |
| Anteprima | [WebP](anteprime/base.mara.PresoAlVolo-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Il pacco entra nello zaino; la direzione è segnalata anche da una freccia grafica. |
| Giudizio del proprietario | In attesa. |

#### Sgommata — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.Sgommata` |
| promptSha256 | `c70cdcd16d0baf2d849d7f1e8674732cd0222d578ec6f146cb31da2a89f584a3` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `originali/base.mara.Sgommata.png`: `84727d5ec84b6b2414ba3cb39b217af97f5f629203409727fee5a6b5f46a8d04`; `../../carriere/asset/tutorial/sfondi/s1-esterno.webp`: `19f020fe6689b2de7261dfe7c1bcff9608a6509539c7fb5ab18363a85687a1d6` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.Sgommata-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3504046 / `f591c9c5226b0070db44f678c5cdb5bfb7bb11850d47ae005a037858ba0c7d75` |
| Anteprima | [WebP](anteprime/base.mara.Sgommata-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Sbandata in bici davanti alla facciata del bar. |
| Giudizio del proprietario | In attesa. |

#### Agilità Innaturale — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.SorpassoInCurva` |
| promptSha256 | `e0796e6b2cd2b30d492f9c2e92558f01dbdcc13081ecc4a3e3cc4e0d183e9228` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `../identikit/riferimenti/mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `../../carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.SorpassoInCurva-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2761222 / `5584a6a159680461c5dceb874ed05d2eedeef2be3ec88c8b26c6822b29b0a5df` |
| Anteprima | [WebP](anteprime/base.mara.SorpassoInCurva-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Il salto sullo sgabello e la schivata si distinguono. |
| Giudizio del proprietario | In attesa. |

#### Traiettoria Imprevedibile — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.TiStringoLaCurva` |
| promptSha256 | `5ac2261fb156f12ae3a3556b53bb4b8abb5baf01bd7a3e9a4f02ef15b17f773d` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `../identikit/riferimenti/mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `../../carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.TiStringoLaCurva-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2975642 / `bbb98562d6a28b92220c4e8ebdd1599e53d17a2669ef961b42f2235683970fb7` |
| Anteprima | [WebP](anteprime/base.mara.TiStringoLaCurva-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Piede piantato e torsione suggeriscono il cambio di direzione. |
| Giudizio del proprietario | In attesa. |

#### Unta e Bisunta — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.TraDueParaurti` |
| promptSha256 | `611dd6ddf3f0e49e5ea494fa6d7414f309806f586071a20710b30f22f50fe040` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `originali/base.mara.TraDueParaurti.png`: `64fb6c231be0c3a72fd832f579e7b329a2a9c686cf40dcc6b7d0826057087d09` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.TraDueParaurti-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2788215 / `b7183fd293604bb4af5aa1b9092bf42f89bb8ca8d6a737b6847ee11a16f43817` |
| Anteprima | [WebP](anteprime/base.mara.TraDueParaurti-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Sorriso e grandi macchie unte visibili; kebab spunta dallo zaino. |
| Giudizio del proprietario | In attesa. |

#### Semaforo Rosso — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.CambioMarcia` |
| promptSha256 | `58c472b60f6afd246649a98f2a3d682b8890b6b0bfbb5ee119a4b546356e34c1` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `originali/base.mara.bound.CambioMarcia.png`: `f83be5de0e50470de63e68f0fee98b74cca61f706abb0acd699a1a8d5cb3a988` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.CambioMarcia-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2739946 / `061430435258c60ff2602c4da62479d2e30ea5ed179e9515125d7b564dbbe2d6` |
| Anteprima | [WebP](anteprime/base.mara.bound.CambioMarcia-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Mara guarda soddisfatta l’avventore; il pollice resta piccolo a 60 px. |
| Giudizio del proprietario | In attesa. |

#### Tagliare la Strada — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.ColpoDiStriscio` |
| promptSha256 | `b4e74a7e30a9b7fcce0c5aaadeecc0ba16eb04159189654fcfc7c86dc4b98343` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `../identikit/riferimenti/mara.png`: `0b4482a42b502249e7484506c79adfdc684dd582ab1e1e4971690cc84648923d`; `../../carriere/asset/tutorial/sfondi/s1-esterno.webp`: `19f020fe6689b2de7261dfe7c1bcff9608a6509539c7fb5ab18363a85687a1d6` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.ColpoDiStriscio-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3066389 / `b67918357a262fe7bb3e12172bb062e84ab48308b41b3622c9afe9aa3d47d2ab` |
| Anteprima | [WebP](anteprime/base.mara.bound.ColpoDiStriscio-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | La bici attraversa la strada davanti all’avventore. |
| Giudizio del proprietario | In attesa. |

#### Sventare l'Assassinio — 2

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.PassoStretto` |
| promptSha256 | `acfa1fb7f0d11a9893d8205e47ef9eedea5d766d290284886f010bb134839aad` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | ; `originali/base.mara.bound.PassoStretto.png`: `3058eac329e6c20150e218dc083179a32a6a6be49ad416ae5e6964d7b3e035fa` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.PassoStretto-2.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2564188 / `2425e489e490597074138f416bb189eb7965fbb51966a7e51a02f8cffc04963d` |
| Anteprima | [WebP](anteprime/base.mara.bound.PassoStretto-2.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | La mano del casco a sinistra è rimossa; resta il gesto contro il bicchiere. |
| Giudizio del proprietario | In attesa. |

#### Lazo del Rider — 3

| Campo | Valore |
|---|---|
| bindingName | `base.mara.CinghiataDiTraverso` |
| promptSha256 | `754323b41a3b06d4b98158048bcd6dfe19bb9820057e4a050f0f990cffbb59d3` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.CinghiataDiTraverso-2.png`: `e74e5bc6ed3df5386bdc7b100d9feef7aa2f5fe38d2ebf4201a693ff526fdbf0` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.CinghiataDiTraverso-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2916655 / `05e8271ed5f893dcbadcdaecb4f6a1da25539c29e3318e6c1ed1d3ec8ad21707` |
| Anteprima | [WebP](anteprime/base.mara.CinghiataDiTraverso-3.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessun rilancio; Lazo 2 superata dalla 3. |
| Controllo a 60 px | Braccio pendente rimosso; rimangono la cinghia e il gesto principale. |
| Giudizio del proprietario | In attesa. |

### Secondo giudizio del proprietario — lotto 2

26 novembre 2026. Approvate: Agilità Innaturale 2 («perfetta»), Traiettoria Imprevedibile 2 («ok»), Unta e Bisunta 2 («perfetta»), Semaforo Rosso 2, Sventare l’Assassinio 2, Lazo del Rider 3 («ok»). Slalom 1 resta approvata dal primo giudizio. Requisire torna alla prima versione con il braccio del casco corretto; Sgommata corregge il telaio; Tagliare corregge l’incrocio delle traiettorie.

### Generazioni dopo il secondo giudizio — lotto 2

Prompt preventivi: `0219059`. Tre chiamate, una per prompt; nessun rifiuto, rilancio o tentativo scartato. Modello e riscrittura non esposti. Originali copiati senza modifica, fuori da git.

#### Requisire al Volo — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.mara.PresoAlVolo` |
| promptSha256 | `28e1b862121a478e1801e2e7d2cf942d8d4afe549008d12eb8ba662233531ab3` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.PresoAlVolo.png`: `355214c1b7dde700e3dbcfbab27b35fba49a9af9b6436c8e706529d55d0d965f` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.PresoAlVolo-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2809860 / `43b29c5aec0231d5d20bd131573cfbc5414b9b7dfd9b4b29ad5a497e4ce764b3` |
| Anteprima | [WebP](anteprime/base.mara.PresoAlVolo-3.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Braccio del casco più disteso; il pacco e lo zaino restano quelli della prima versione. |
| Giudizio del proprietario | In attesa. |

#### Sgommata — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.mara.Sgommata` |
| promptSha256 | `20dfbe696b25677f7792cf4a01cf3d8cfb362ead34fe95858daadf8eaceb2a3f` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.Sgommata-2.png`: `f591c9c5226b0070db44f678c5cdb5bfb7bb11850d47ae005a037858ba0c7d75` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.Sgommata-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2965937 / `9986e66c6f4422d840b83f477fbb9b3b4881c72fe9d50c6bb31a347d2db3e3ea` |
| Anteprima | [WebP](anteprime/base.mara.Sgommata-3.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Telaio con tubi continui e triangoli più regolari; sbandata conservata. |
| Giudizio del proprietario | In attesa. |

#### Tagliare la Strada — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.ColpoDiStriscio` |
| promptSha256 | `d840e963a3974dddb39c6ba45f3f1a0f640f95c244e18618ce9cb763afcd6588` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.bound.ColpoDiStriscio-2.png`: `b67918357a262fe7bb3e12172bb062e84ab48308b41b3622c9afe9aa3d47d2ab` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.ColpoDiStriscio-3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3035713 / `594d73132c74b3f67b507b97d4e5e7822cb9f2a8f5bdcebd8c7e09eb5cc17a23` |
| Anteprima | [WebP](anteprime/base.mara.bound.ColpoDiStriscio-3.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bici di profilo davanti alle gambe dell’avventore; arresto e traiettorie perpendicolari più chiari. |
| Giudizio del proprietario | In attesa. |

### Terzo giudizio del proprietario — lotto 2

26 novembre 2026: Requisire al Volo 3 e Sgommata 3 approvate («ok»). Tagliare la Strada 3: tutto perfetto salvo la presa; la mano deve reggere la manopola più lontana dall’osservatore. Nuovo prompt preventivo per la sola correzione locale, versione 4. Nove carte approvate, una in attesa.

### Tagliare la Strada — versione 4

Prompt preventivo `b7c1bfc`. Una chiamata; nessun rifiuto, rilancio o tentativo scartato.

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.ColpoDiStriscio` |
| promptSha256 | `84dc30880d2067b898fae2b8ae79246b2c00b4db67653758a083b9fe31d0893c` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.bound.ColpoDiStriscio-3.png`: `594d73132c74b3f67b507b97d4e5e7822cb9f2a8f5bdcebd8c7e09eb5cc17a23` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.ColpoDiStriscio-4.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2677163 / `ea55dcc4876bdead5ad3acad353601c06aaa579cacc05eee792fc134997d37fb` |
| Anteprima | [WebP](anteprime/base.mara.bound.ColpoDiStriscio-4.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Presa spostata sulla manopola lontana; quella vicina è libera. Il dettaglio richiede la vista grande. |
| Giudizio del proprietario | In attesa. |

### Quarto giudizio del proprietario — lotto 2

26 novembre 2026. Tagliare 4 respinta: manubrio strano e bici troppo lunga. Richiesta: pedalare senza mani sul manubrio, una mano tiene il casco e l’altra allontana l’avventore; bici più proporzionata. Prompt preventivo della versione 5 nel documento del lotto. Nove carte restano approvate.

### Tagliare la Strada — versione 5

Prompt preventivo `e94120a`. Una chiamata; nessun rifiuto, rilancio o tentativo scartato.

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.ColpoDiStriscio` |
| promptSha256 | `076af5c6f716ae95a27baed31aa4a66e5c7768bc6cd783cfe3f8e758aceb0f11` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.bound.ColpoDiStriscio-4.png`: `ea55dcc4876bdead5ad3acad353601c06aaa579cacc05eee792fc134997d37fb` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.ColpoDiStriscio-5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2805203 / `c245ad7b698f247d7e5ed27f9cea59fc0bcb3c1b1b900960fd994c9499622e92` |
| Anteprima | [WebP](anteprime/base.mara.bound.ColpoDiStriscio-5.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bici più compatta e manubrio libero; braccio teso e avventore respinto si distinguono. |
| Giudizio del proprietario | In attesa. |

### Quinto giudizio del proprietario — lotto 2

26 novembre 2026: Tagliare 5 non accettata. Si torna alla versione 3 spostando solo la mano verso l’avventore, senza toccarlo e senza modificarlo. Bici e resto della scena da preservare. Prompt preventivo della versione 6.

### Tagliare la Strada — versione 6

Prompt preventivo `86b0062`. Una chiamata; nessun rifiuto, rilancio o tentativo scartato.

| Campo | Valore |
|---|---|
| bindingName | `base.mara.bound.ColpoDiStriscio` |
| promptSha256 | `98ac0fe2c761664a7c0317210de4e66384a9a0e970b951edf4e1f4039da69c5c` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | `originali/base.mara.bound.ColpoDiStriscio-3.png`: `594d73132c74b3f67b507b97d4e5e7822cb9f2a8f5bdcebd8c7e09eb5cc17a23` |
| Prompt riscritto | non esposto |
| source | `originali/base.mara.bound.ColpoDiStriscio-6.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2638841 / `fc23766951638484890183c40415c5604fc5d4ce1b6ce561afc854760494fbfe` |
| Anteprima | [WebP](anteprime/base.mara.bound.ColpoDiStriscio-6.webp), 512 px, qualità 80 |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mano aperta rivolta verso l’avventore; gesto piccolo. Bici e avventore conservano la composizione della 3. La distanza dalle dita va giudicata in grande. |
| Giudizio del proprietario | Approvata: «va bene», 26 novembre 2026. |

## Chiusura del lotto 2

26 novembre 2026. Il proprietario approva Tagliare la Strada 6: «va bene». Con le approvazioni dei giri precedenti, tutte le dieci carte di Mara sono approvate. Versioni scelte:

| Carta | bindingName | Versione | Anteprima |
|---|---|---:|---|
| Lazo del Rider | `base.mara.CinghiataDiTraverso` | 3 | [WebP](anteprime/base.mara.CinghiataDiTraverso-3.webp) |
| Requisire al Volo | `base.mara.PresoAlVolo` | 3 | [WebP](anteprime/base.mara.PresoAlVolo-3.webp) |
| Sgommata | `base.mara.Sgommata` | 3 | [WebP](anteprime/base.mara.Sgommata-3.webp) |
| Slalom d’Avvicinamento | `base.mara.Slalom` | 1 | [WebP](anteprime/base.mara.Slalom.webp) |
| Agilità Innaturale | `base.mara.SorpassoInCurva` | 2 | [WebP](anteprime/base.mara.SorpassoInCurva-2.webp) |
| Traiettoria Imprevedibile | `base.mara.TiStringoLaCurva` | 2 | [WebP](anteprime/base.mara.TiStringoLaCurva-2.webp) |
| Unta e Bisunta | `base.mara.TraDueParaurti` | 2 | [WebP](anteprime/base.mara.TraDueParaurti-2.webp) |
| Semaforo Rosso | `base.mara.bound.CambioMarcia` | 2 | [WebP](anteprime/base.mara.bound.CambioMarcia-2.webp) |
| Tagliare la Strada | `base.mara.bound.ColpoDiStriscio` | 6 | [WebP](anteprime/base.mara.bound.ColpoDiStriscio-6.webp) |
| Sventare l’Assassinio | `base.mara.bound.PassoStretto` | 2 | [WebP](anteprime/base.mara.bound.PassoStretto-2.webp) |

Originali scelti verificati presenti in `originali/`, fuori da git; anteprime 512×512 WebP qualità 80. Nessuna integrazione nell’atlante in questo lotto. Nessun comportamento di gioco o atteso modificato.


## Lotto 3 — Celestina

[Prompt letterali](lotto-03-celestina.md), commit `2e220ec`, verificati invariati. Undici generazioni, una per prompt nell’ordine 1–11, con esclusivamente i due allegati nell’ordine dichiarato e impronte verificate: nessun rifiuto, rilancio, modifica o tentativo scartato. Modello e riscrittura non esposti; nessun campo negativo separato. I testi inviati sono i contenuti letterali dei blocchi, senza delimitatori né ritorno a capo finale; promptSha256 calcolato in UTF-8 con ritorni LF. Gli originali sono copie byte per byte dei PNG restituiti, fuori da git; anteprime a 512 × 512 px, WebP qualità 80. [Pagina di giudizio](giudizio-lotto-03.html).

**Diagnosi:** SHA-256 di entrambi gli allegati coincidenti; file dei prompt identico al commit indicato. Modifiche altrui già presenti nel checkout lasciate intatte. **Modifica:** solo originali esclusi da git, undici anteprime, questa sezione e pagina di giudizio; nessun comportamento o atteso cambiato. La generazione ha prodotto anomalie visive, conservate senza ritocchi e descritte nelle tabelle; il giudizio resta al proprietario.

### Desiderio Incontrollabile

| Campo | Valore |
|---|---|
| bindingName | `com.basic.ToxicGrab` |
| promptSha256 | `399da792fce55d31c170a17de87a9ebb0241f6fdb6be6c1e020d37e990e8c697` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/com.basic.ToxicGrab.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-256c17f0-cba3-4bcd-9c92-e564dd3b2035.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2977379 / `131213ec5e2bc0ce37c27dbfd569e5f0a5a76b7e555992c531ee39b31c53ab94` |
| Anteprima | [WebP](anteprime/com.basic.ToxicGrab.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 1, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mano alla bocca e volto leggibili; il piccolo avanzo di cibo non si distingue. |
| Anomalie visive | La tuta appare prugna brunito, con il violetto poco netto sotto la luce calda. |
| Giudizio del proprietario | In attesa. |

### Fondo del Posacenere

| Campo | Valore |
|---|---|
| bindingName | `junkie.character.PatheticBlade` |
| promptSha256 | `092644058f68f821a46a723f3e395b4f5e6ce8b2db4b0c2af789d734a19455ff` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.character.PatheticBlade.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-d806909b-9b23-4876-ab24-1c37d8f1ab2f.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3013310 / `0b2a968b72661b3d99524af16d7431f23b5b1e9541090a36369819ef1bd158d7` |
| Anteprima | [WebP](anteprime/junkie.character.PatheticBlade.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 2, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Posacenere rovesciato e mano alzata visibili; la scheggia è troppo piccola per identificarla. |
| Anomalie visive | La tuta appare prugna brunito; la scheggia viene mostrata sopra il mucchio. |
| Giudizio del proprietario | In attesa. |

### Rintanarsi nel Cappotto

| Campo | Valore |
|---|---|
| bindingName | `base.tossico.bound.RaschiareIlFondo` |
| promptSha256 | `e3cfa5d1532d06e0293dbf843bd8fe0377122abef1c757e2bf49499ddeb1f8d4` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.tossico.bound.RaschiareIlFondo.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-55d976a9-36c7-4981-a454-b23b5d683660.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3065035 / `5f8528e63653ae9caad98141b8cbf6a1b0ea3dc9dd308744bd60541d6a61593a` |
| Anteprima | [WebP](anteprime/base.tossico.bound.RaschiareIlFondo.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 3, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Cappotto e postura raccolta leggibili; le pieghe si fondono nelle ombre. |
| Anomalie visive | La tuta appare prugna brunito; la posa raccolta riprende in parte quella del riferimento. |
| Giudizio del proprietario | In attesa. |

### Tagliare la Dose

| Campo | Valore |
|---|---|
| bindingName | `junkie.character.RottenSmile` |
| promptSha256 | `d4c9f7f8dd5889b02873ef6171e834d3125dbf6cd22d9db0df20d46b1f3581d6` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.character.RottenSmile.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-860ad055-ba61-40fe-b00b-5d8d6144ab43.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3083496 / `8760af44427bf7dacbcc4d7c03d3be2c7c061a7a3ef1ef076234bd3fa6abe5d2` |
| Anteprima | [WebP](anteprime/junkie.character.RottenSmile.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 4, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Gesto di taglio e caramella rossa visibili; lama e singole porzioni poco distinte. |
| Anomalie visive | La tuta appare prugna brunito; tre spicchi separati e una porzione maggiore non formano quattro spicchi uguali. |
| Giudizio del proprietario | In attesa. |

### L'Ultimo Tiro

| Campo | Valore |
|---|---|
| bindingName | `junkie.LethalHeroinDose` |
| promptSha256 | `16a9bab3a5f14745a722806fde6a011a8c16595aa960bb5f57ce55ee3f340ee4` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.LethalHeroinDose.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-45cc9c57-231a-4ab9-af0c-c6c57aca7f34.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2939886 / `bb2dcb36f21801abf523e8580fe31ad392d755dd68ff79186f05cf170ca13fef` |
| Anteprima | [WebP](anteprime/junkie.LethalHeroinDose.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 5, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Nube e avversario arretrato leggibili; il filtro della sigaretta non si distingue. |
| Anomalie visive | Tre braccia visibili di Celestina: mano con sigaretta, appoggio sul gomito e ulteriore mano a terra. Tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

### Fare l'Inventario

| Campo | Valore |
|---|---|
| bindingName | `junkie.MethDrivenRage` |
| promptSha256 | `72cac89e8d0338a5af916f0c6abab90f71f27da10f3b55265776bbb89fba25e3` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.MethDrivenRage.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-34c64093-cb5c-43b8-9bfc-dea30e55696c.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2981814 / `51288ff50ee955f3f648cef7728639f0b35ca9345daa19d30fb9cb4ea1e7b216` |
| Anteprima | [WebP](anteprime/junkie.MethDrivenRage.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 6, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mano lanciata e arco di oggetti visibili; i singoli oggetti non sono identificabili. |
| Anomalie visive | Il gesto è molto posato; tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

### Tossicone Scatarrante

| Campo | Valore |
|---|---|
| bindingName | `junkie.Cough` |
| promptSha256 | `fa34f735018af3ab41b35312f3a868b619058c1343d301766c3e17e4cff56d20` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.Cough.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-463a76b5-ee78-4031-adf4-3af9bf891004.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2870626 / `805f10b2ea11879bf952b38517913cf29e5938bf2091f5dae48bd1e6cead0582` |
| Anteprima | [WebP](anteprime/junkie.Cough.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 7, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Getto dalla bocca e avversario che si ritrae leggibili; mani minute e poco distinte. |
| Anomalie visive | Mano aggiuntiva alla gola, oltre alla mano sul tavolo e a quella sul ventre. Tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

### Metabolismo Corrotto

| Campo | Valore |
|---|---|
| bindingName | `junkie.PervertedMetabolism` |
| promptSha256 | `c5af64a11dd13ee026883ef4586b43e2610180177bebd4d141163eb2e65736ad` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.PervertedMetabolism.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-6d352617-e928-402f-a041-44a054baf259.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2710894 / `c5aba5753adfcb6edb4e8af20eeecb3713ca329f6095045efa4ca96415fec8e1` |
| Anteprima | [WebP](anteprime/junkie.PervertedMetabolism.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 8, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Braccia alzate e sagoma leggibili; le bottiglie ai piedi si confondono. |
| Anomalie visive | Alcune bottiglie hanno etichette; pugni entro il margine esterno del 5%. Tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

### Riflessi Aumentati dalla Speed

| Campo | Valore |
|---|---|
| bindingName | `junkie.AmphetamineReflexes` |
| promptSha256 | `9ef373451ed995ae2682c0bbf1e68e3bd86228b80fcf82726ed5a2161689fe52` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.AmphetamineReflexes.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-6fd12dd2-cdcb-47fc-9c98-836345ade014.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3074610 / `18c274f8b9b3da5ab8762af6f9edfbf2648d02a1b70a8a2d8406e39e2f6b5ab2` |
| Anteprima | [WebP](anteprime/junkie.AmphetamineReflexes.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 9, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Pugno alto e abbassamento di Celestina leggibili; dettagli del volto poco distinti. |
| Anomalie visive | La schivata è un abbassamento accovacciato; tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

### Trascinare nel Tunnel

| Campo | Valore |
|---|---|
| bindingName | `junkie.ToxicBloodDrain` |
| promptSha256 | `386e79acf8511555d8d16d5d2dd3d12efca25bcb63419a9667f687fe938d0664` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/junkie.ToxicBloodDrain.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-86bef904-0c37-4712-9331-62bcb3ede7ab.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2743989 / `b1df9cb07cf940239c703c66394f61de24f6acf2cd3c6662b524f15ff2c61c52` |
| Anteprima | [WebP](anteprime/junkie.ToxicBloodDrain.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 10, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Trazione tra le figure leggibile; stretta di mano minuta e ombra poco distinta. |
| Anomalie visive | L’ombra resta sul pavimento e non sale sull’avversario. Tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

### Un Assaggino

| Campo | Valore |
|---|---|
| bindingName | `base.tossico.UnAssaggino` |
| promptSha256 | `3019d624e522f1a710168b4b936a2e5cb819e9b3461ccb32feac2e668db4f7fc` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.tossico.UnAssaggino.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-8446db75-c897-4397-973c-d9d539107404.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2755646 / `e02a013fb8e47cb8853386755e63710b4b590ba85883d13340c69c7bf3d3e1a4` |
| Anteprima | [WebP](anteprime/base.tossico.UnAssaggino.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 11, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bicchiere alla bocca e mano del cliente protesa leggibili; annusare non è distinguibile. |
| Anomalie visive | Celestina è già seduta e beve; l’atto di annusare non è esplicito. Tuta prugna brunito. |
| Giudizio del proprietario | In attesa. |

**Verifica e consegna:** copie degli undici originali confrontate byte per byte con i file restituiti; dimensioni 1254 × 1254 px per tutti, undici anteprime 512 × 512 px WebP qualità 80 e controllo visivo sul foglio a 60 px. `git diff --check` senza errori; `python scripts/check-rules.py` verde; `python scripts/check-links.py` restituisce gli stessi 22 link mancanti rilevati prima della modifica, nessuno nuovo. Solo aggiunte al registro; nessun atteso cambiato. Modello e prompt riscritto non esposti dal tool, quindi non verificabili. Nessun atlas, client, catalogo, piano, README, decisione o guida modificati dal lotto; nessun push. Scelte prese: riduzione Lanczos per le anteprime; campi del giudizio compilabili senza salvataggio automatico. Tutte le undici carte attendono il giudizio del proprietario.


### Giudizio del proprietario e correzioni — 26 novembre 2026

Il proprietario, dopo il primo giro:

> **Rintanarsi nel Cappotto**: il cappotto è strano, non avvolge celestina. inoltre, lei dovrebbe essere triste
> **Tagliare la Dose** : la caramella è intera nonostante venga tagliata
> **L’Ultimo Tiro**  : il braccio di celestina si sdoppia, non va bene
> **Fare l’Inventario**  : perché gli oggetti stanno volando? disponiamoli sul tavolino con gelestina che li guarda
> **Metabolismo Corrotto**  : non ha senso. facciamo celestina con le vene tutte in risalto e verdi, come geralt in the witcher 3 quando prende le pozioni
> Trascinare nel Tunne: l'ombra è strana, e celestina dovrebbe apparire verdastra, per esaltare la sua tossicità
>
> le altre vanno bene

Recepita la richiesta: approvate le versioni 1 di Desiderio Incontrollabile, Fondo del Posacenere, Tossicone Scatarrante, Riflessi Aumentati dalla Speed e Un Assaggino. Le altre sei versioni 1 sono respinte e restano conservate. Si genera una versione 2 per ciascuna delle sei carte, con i medesimi due riferimenti verificati e senza modificare il file dei prompt iniziali. Per Metabolismo Corrotto si traduce il riferimento in vene verdi sottocutanee molto in risalto; per Trascinare nel Tunnel, pelle verdastra e normali ombre coerenti con la lampada. Nessuna modifica alle regole del gioco. Nuove versioni in attesa del giudizio.

#### Testi inviati per le versioni 2

##### Rintanarsi nel Cappotto — versione 2

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina sits hunched on a low bar chair, completely wrapped inside one enormous shabby overcoat like a closed cocoon. The coat is worn normally over both shoulders, both sleeves hang naturally, and its two front panels overlap firmly across her chest, belly and knees, enclosing her body rather than spreading outward. Both of her hands, close together at chest height, clutch the overlapping lapels shut. Her violet tracksuit trousers and mismatched shoes emerge only beneath the hem. The collar is raised without a hood. She looks down at the floor with sad, weary eyes, lowered brows and a drooping mouth: vulnerable, withdrawn and unhappy, with no smile or smirk.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a sad, withdrawn expression; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

##### Tagliare la Dose — versione 2

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina leans over a bare bar table with total concentration and finishes cutting one large round translucent red boiled sweet into four equal quarter-circle wedges using a small folding pocket knife. Show exactly four completely separate wedges of the same size on the table, with visible empty gaps between all four pieces. There is no whole sweet, no intact disc and no remaining central piece. The knife blade is lowered into the empty gap between two of the already separated wedges, completing the cut; one hand holds the knife and the other rests flat beside the pieces, safely away from the blade. The four pieces clearly belong to a single candy. No powder, lines or other objects on the table.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a crooked little smirk; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

##### L'Ultimo Tiro — versione 2

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina sprawls on the bar floor, propped on exactly one elbow, and blows a thick grey-green cloud from her mouth straight into the face of one standing shadowy opponent, who recoils. Her anatomy must show exactly two continuous arms and two hands in total: one supporting upper arm runs from her shoulder down to the elbow planted on the floor, with its forearm continuing along the floor to its single relaxed hand; her other arm is bent upward, its single hand holding one burnt-down cigarette filter beside her face. Keep the two arms clearly separated in silhouette. There is no extra arm, no additional supporting hand and no branching elbow. The opponent has exactly two arms, both lifted defensively, and his face is turned away into shadow.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a crooked little smirk; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

##### Fare l'Inventario — versione 2

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina sits at a small bar table, leaning forward and looking down intently at her small inventory arranged on the tabletop: exactly one bottle cap, one button, one key, one coin, one crumpled napkin and one lighter. All six objects rest flat and stationary on the table in a compact, clearly spaced group directly in front of her, with small contact shadows. Her eyes are directed at these objects, studying and counting them. Both of her hands rest on the tabletop beside the group; her belt bag is open at her waist. Nothing is being thrown, nothing floats, and there is no airborne object, trajectory or motion arc.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a crooked little smirk; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

##### Metabolismo Corrotto — versione 2

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina sits at the bar table, leaning forward with an exhausted but alert expression, her body visibly showing a fictional toxic metabolic reaction. Prominent raised veins form clear branching dark moss-green networks along both bare forearms and hands, up her neck and across her temples; the veins are visibly beneath her skin and follow plausible anatomy, with a muted green tint around them. Her skin is pallid with a sickly green cast, while her red hair and violet tracksuit remain distinct. Both sleeves are rolled to the elbows; both forearms lie openly on the table with exactly two arms and two hands, so the green veins are a main readable feature. Keep her original thin adult female body and face. No bottles scattered on the floor, no stretching or triumphant pose, no glowing veins, no neon, no drugs or paraphernalia.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a crooked little smirk; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~

##### Trascinare nel Tunnel — versione 2

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina, with distinctly sickly pale green skin on her face, neck and hands, grips a shadowy opponent's right hand in one single clear right-handed handshake and pulls him toward her. Her expression is a crooked, excessively broad smile and he leans forward, dragged off balance. Keep her red hair and violet tracksuit, making the green skin clearly visible as a sign of fictional toxicity. Both figures have exactly two arms and two hands, with an anatomically coherent handshake. A single lamp high behind them casts ordinary grounded shadows in one consistent direction across the floor, away from the lamp; shadows remain simple, physically plausible and flat on the floor, with no supernatural silhouette, climbing shadow, extra figure or shadow limbs.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a crooked little smirk; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~


#### Ritocco localizzato richiesto dal proprietario

Durante il giro il proprietario ha chiesto: «Remove the area marked in the second image from the first image», indicando con una maschera l’avambraccio e la mano aggiuntivi nella versione 2 di L’Ultimo Tiro. Questa richiesta autorizza un ritocco tramite imagegen su quella versione, distinto dalle sei nuove generazioni con i due riferimenti. Il risultato è conservato come versione 3; versione 2 non riuscita conservata. Il percorso locale dell’immagine è stato letto correggendo il prefisso non valido `/C:/` in `C:/`.

Testo inviato per il ritocco:

~~~text
Edit the supplied colour illustration of Celestina on the bar floor. The other supplied image is a black mask with a white marked region: use the white region ONLY to identify the unwanted extra forearm and hand lying horizontally on the floor in the lower-left portion of the illustration. Remove that entire horizontal extra forearm and its hand, replacing them with a seamless continuation of the existing wooden floor, its perspective, ink lines, texture, warm lighting and shadows. Preserve the bent arm with its elbow resting on the floor and its hand raised holding the cigarette: this arm must remain a single continuous anatomically coherent arm, without a branch from its elbow. Preserve Celestina's face, body, pose, clothing, feet, belt bag, smoke cloud, opponent and bar interior. Change only what is necessary inside the marked region to remove the extra limb. Keep the square opaque full-bleed comic illustration and its original style, palette and composition. Do not include the mask, white paint or black overlay in the output. No text, watermark or border.
~~~


#### Risultati delle correzioni

Sei nuove generazioni in ordine, una per ciascun prompt di versione 2, più un ritocco con maschera richiesto esplicitamente dal proprietario durante il giro. Nessun rifiuto. Le immagini iniziali e la versione 2 non riuscita di L’Ultimo Tiro sono conservate. Le sei proposte correnti attendono il giudizio del proprietario; le altre cinque carte restano approvate nella versione 1.

##### Rintanarsi nel Cappotto — versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.tossico.bound.RaschiareIlFondo` |
| Versione | 2 |
| promptSha256 | `14270bb6bc51223914952ac1eb1f2b29b59ca88313040f9146bd48d57147afc8` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/base.tossico.bound.RaschiareIlFondo-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-6249d4c8-ff26-412e-afe3-37b771151753.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2831776 / `868793dab1ebed48226ea5856f9a796c594e56a4133c71e23c91230f860a230b` |
| Anteprima | [WebP](anteprime/base.tossico.bound.RaschiareIlFondo-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 1 respinta dal proprietario e conservata; nessun rilancio di questa richiesta. |
| Controllo a 60 px | Cappotto chiuso, testa bassa e postura raccolta leggibili; espressione triste poco dettagliata. |
| Anomalie / riscontro della richiesta | Nessun nuovo arto aggiuntivo osservato; il cappotto avvolge il corpo e lo sguardo è abbassato. |
| Giudizio del proprietario | In attesa. |

##### Tagliare la Dose — versione 2

| Campo | Valore |
|---|---|
| bindingName | `junkie.character.RottenSmile` |
| Versione | 2 |
| promptSha256 | `ae92b5eabd332fa4a5a6b5d024938563a77387e96984f4e60e27b4878187cc71` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.character.RottenSmile-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-1586b3a0-954f-40df-96fc-6d39a7fba032.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3084712 / `008a85056a741a78b6467af1642e2e3b26f0d9a32f832cad28bffeef35e40ac0` |
| Anteprima | [WebP](anteprime/junkie.character.RottenSmile-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 1 respinta dal proprietario e conservata; nessun rilancio di questa richiesta. |
| Controllo a 60 px | Quattro pezzi rossi separati visibili; lama minuta. |
| Anomalie / riscontro della richiesta | Caramella in quattro spicchi separati; non compare più un disco intero. |
| Giudizio del proprietario | In attesa. |

##### L'Ultimo Tiro — versione 2

| Campo | Valore |
|---|---|
| bindingName | `junkie.LethalHeroinDose` |
| Versione | 2 |
| promptSha256 | `a5b45d9f5101d34bf5ce1bd8c76ed4119eb4d41c4902eae77ff4b13cd0d7b47d` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.LethalHeroinDose-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-97f9692c-c3e4-4d52-a8ba-70e40fe4b3cf.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3003999 / `14ec53f35b7655e93861640d0ee0775bcd53e9fdcddb2d3504dca8166d05a161` |
| Anteprima | [WebP](anteprime/junkie.LethalHeroinDose-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 2 non riuscita, conservata; ritocco versione 3 autorizzato dal proprietario. |
| Controllo a 60 px | Nube e avversario leggibili; la biforcazione del braccio non è evidente a questa scala. |
| Anomalie / riscontro della richiesta | Correzione non riuscita: due avambracci partono ancora dal medesimo gomito. Superata dal ritocco versione 3 richiesto dal proprietario. |
| Giudizio del proprietario | Non accettata: richiesta di rimozione localizzata; vedere versione 3. |

##### Fare l'Inventario — versione 2

| Campo | Valore |
|---|---|
| bindingName | `junkie.MethDrivenRage` |
| Versione | 2 |
| promptSha256 | `525e65fdeefdce8e42833c72786619260ba0ef9d831bcec57987c4c4ac3de5b1` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.MethDrivenRage-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-e08b227b-1ac0-4c9a-a6aa-fb7de6f69f62.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3101602 / `9ea2d734d22f95db08a774358331c4f65ec5d79d48ce3ebb0c864a990746f994` |
| Anteprima | [WebP](anteprime/junkie.MethDrivenRage-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 1 respinta dal proprietario e conservata; nessun rilancio di questa richiesta. |
| Controllo a 60 px | Oggetti fermi sul tavolo e sguardo rivolto in basso leggibili; singoli oggetti minuti. |
| Anomalie / riscontro della richiesta | Sei oggetti appoggiati sul tavolino; nessun oggetto in volo. |
| Giudizio del proprietario | In attesa. |

##### Metabolismo Corrotto — versione 2

| Campo | Valore |
|---|---|
| bindingName | `junkie.PervertedMetabolism` |
| Versione | 2 |
| promptSha256 | `8cff1f1cc73e661b1efb15ba7ab332014d994cb21602b2ba9c292efaf5c029a5` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.PervertedMetabolism-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-3018249d-b11b-489e-8332-e5fb685bd5ef.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3115067 / `9a9363063481fced77ba74ba51e07a3b93f4958085a19f7d5da53146030d2742` |
| Anteprima | [WebP](anteprime/junkie.PervertedMetabolism-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 1 respinta dal proprietario e conservata; nessun rilancio di questa richiesta. |
| Controllo a 60 px | Avambracci scoperti leggibili; il reticolo delle vene verdi si perde a 60 px. |
| Anomalie / riscontro della richiesta | Vene verdi presenti a piena risoluzione su mani, avambracci, collo e tempia; leggibilità limitata a 60 px. |
| Giudizio del proprietario | In attesa. |

##### Trascinare nel Tunnel — versione 2

| Campo | Valore |
|---|---|
| bindingName | `junkie.ToxicBloodDrain` |
| Versione | 2 |
| promptSha256 | `2aaf80ccd620b33400f80f525f17ce221b3e5e8792b238df06ee04578cd1e50b` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.ToxicBloodDrain-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-f81df467-b9ab-428b-8943-d109867635dc.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2746113 / `f916e089a7258c75bdda7bf6cb6155d7fc899423298859e9263ce7bd145373b0` |
| Anteprima | [WebP](anteprime/junkie.ToxicBloodDrain-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 1 respinta dal proprietario e conservata; nessun rilancio di questa richiesta. |
| Controllo a 60 px | Stretta di mano e volto verdastro distinguibili; ombra sul pavimento poco dettagliata. |
| Anomalie / riscontro della richiesta | Pelle verdastra presente; ombre ordinarie a terra, senza figura soprannaturale. |
| Giudizio del proprietario | In attesa. |

##### L'Ultimo Tiro — versione 3

| Campo | Valore |
|---|---|
| bindingName | `junkie.LethalHeroinDose` |
| Versione | 3 |
| promptSha256 | `1e76d8dbeea263754c41a34d15562ea48d4e64229f62f719580686a6cd75d1e9` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Contesto recente (2 immagini): maschera bianca/nera allegata dal proprietario in chat, SHA-256 non esposto perché senza percorso locale; PNG di versione 2 `originali/junkie.LethalHeroinDose-2.png`: `14ec53f35b7655e93861640d0ee0775bcd53e9fdcddb2d3504dca8166d05a161`. Nessun riferimento aggiuntivo. |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.LethalHeroinDose-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-15b058f8-d3f3-4a07-9a6f-416486a7a92e.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2940118 / `cd834191ae6b1c59f1d80ebfe653d68b303b09880aaff023b3541bc4af842e26` |
| Anteprima | [WebP](anteprime/junkie.LethalHeroinDose-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Versione 2 non riuscita, conservata; ritocco versione 3 autorizzato dal proprietario. |
| Controllo a 60 px | Nube e avversario leggibili; l’avambraccio a terra non compare più. |
| Anomalie / riscontro della richiesta | Rimosso l’avambraccio orizzontale con la mano; il pavimento occupa l’area indicata. L’altro braccio non è esposto nella posa. |
| Giudizio del proprietario | In attesa. |

**Verifiche del giro di correzione:** `git diff --check` e `python scripts/check-rules.py` verdi; `python scripts/check-links.py` conserva gli stessi 22 collegamenti mancanti della base, nessuno nuovo. Controllate le copie byte per byte dei sette file restituiti, le sette anteprime WebP qualità 80 a 512 × 512 px e le viste a 60 px; pagina verificata con 11 campi di giudizio, 11 viste a 60 px e tutti i riferimenti locali presenti. Modello, prompt riscritto e hash della maschera allegata in chat non esposti dal tool. Nessuna modifica ai prompt iniziali, al gioco o ai file altrui; nessun push. Cinque versioni 1 approvate; sei proposte correnti in attesa del proprietario, inclusa L’Ultimo Tiro versione 3. La versione 2 non riuscita resta documentata e conservata.


### Secondo giudizio del proprietario e nuove correzioni — 26 novembre 2026

> rintanarsi del cappotto: ok
> tagliare la dose: ok
> ultimo tiro: ok
> inventario: celestina sembra strabica, facciamole uno sguardo più pensieroso
> metabolismo corrotto: quasi ok, facciamole il volto un po' deformato dalla malvagità
> trascinare nel tunnel: non mi piace, cambiamo concetto: facciamo celestina che ficca un qualcosa di marcio in bocca alll'avventore

Approvate Rintanarsi nel Cappotto versione 2, Tagliare la Dose versione 2 e L’Ultimo Tiro versione 3. Il totale approvato sale a otto carte. Per Fare l’Inventario e Metabolismo Corrotto si ritocca soltanto il volto nelle rispettive versioni 2, conservando il resto; per Trascinare nel Tunnel si genera un nuovo soggetto con un boccone di pane ammuffito, secondo la richiesta. Una richiesta per ciascuna carta, senza rilanci automatici. Nessuna modifica ai prompt iniziali o alle regole del gioco. Le nuove proposte saranno versioni 3, in attesa di giudizio.

#### Prompt del secondo giro di correzioni

##### Fare l'Inventario — versione 3

~~~text
Edit this illustration only in Celestina's face and expression. Make her look thoughtful and absorbed in considering the six small objects on the table: a calm contemplative expression, slightly lowered eyelids, gently furrowed brow, and relaxed closed lips rather than a smirk. Correct the direction of her eyes: both eyes must be naturally aligned and look together at the same point on the tabletop; anatomically coherent pupils, no crossed eyes, no wandering or divergent eye. Keep her head angle, recognizable face, red shaved-side hair, violet tracksuit, body, two arms and two hands, belt bag, all six stationary objects, table, bar interior, lighting, palette, framing and ink-and-painted comic style unchanged. Do not add objects, movement, text or borders. Opaque square artwork.
~~~

##### Metabolismo Corrotto — versione 3

~~~text
Edit this illustration only in Celestina's face. Make her face subtly distorted by malice: more angular pinched cheekbones, a slightly twisted cruel grin lifting one corner of the mouth, an arched brow and a menacing narrowed gaze, an unsettling exaggerated comic expression. The deformation is slight but visible: she remains the same recognizable young adult woman with her original female face and red shaved-side hair. Preserve the prominent green veins on her temple, neck, forearms and hands and the sickly skin colour. Keep her pose, body, exactly two arms and two hands, violet tracksuit, belt bag, table, dive bar background, composition, lighting, colours and hand-inked comic style unchanged. No wounds, blood, extra facial parts, monstrous mouth, text or borders. Opaque square artwork.
~~~

##### Trascinare nel Tunnel — versione 3

~~~text
Create one new square illustration, 1024 x 1024 pixels or larger, aspect ratio 1:1, opaque, preferably an original PNG: the action artwork for a playing card of the original project Botte Micidiali. Full-bleed artwork only, not a card mockup: no frame, no border, no lettering.

Attachment 1 is the approved character reference: draw the same woman with the same face and body. Do not copy its pose, framing or plain background. Attachment 2 is the approved interior of the same dive bar: show its shelves, bottles and lamp visibly behind the figures, simplified, darker and less sharp than the subject.

Style: hand-inked European comic, irregular dark contours, restrained painted shading, light worn print texture, slightly exaggerated features. Restrained palette: walnut and tobacco browns, dusty bottle green, oxblood burgundy, muted petrol, worn ivory; no oversaturated colours. Warm, dirty light from one clear direction, deep shadows that never become flat black.

Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light. Show a single clear, coherent scene with the posture and action specified below. Make the main gesture or physical condition readable at tiny size. Make the anatomy of arms and hands coherent and their ownership unambiguous: every figure has exactly two arms and two hands, and no extra or detached limb appears anywhere.

Subject: Celestina forcibly pushes a small rotten piece of food into the open mouth of a seated shadowy adult bar patron. The spoiled food is clearly an ordinary lump of bread with fuzzy muted green mould and a dark soggy patch, held between the fingers of her right hand; half of this single morsel is entering his mouth, showing one unmistakable feeding action. Her left hand braces on the table, separate and clearly owned by her. She leans toward him with a malicious crooked grin; her face, neck and hands retain a sickly pale green cast, while her red hair and violet tracksuit remain distinct. The patron recoils in disgust and raises one hand defensively; his head is turned away in deep shadow, showing only an anonymous mouth and jaw, no recognizable face. Keep the two figures and hand-to-mouth contact large and readable; exactly two arms and two hands for each figure, no extra or detached limbs. One lamp casts ordinary consistent shadows. No handshake, no supernatural shadow, no gore, no vomiting, no drugs or paraphernalia.

Celestina is about twenty-three and clearly adult, with a young face and tired skin, dark circles and a crooked little smirk; thin, crooked, all angles. She has red hair shaved at the sides with a longer faded tuft; she wears a baggy faded tracksuit clearly violet, not burgundy and not green, a belt bag stuffed with things picked up from the floor and mismatched shoes. Any opponent or patron is a generic shadowy figure without a recognizable face, anonymous through shadow and the turn of the head; no hood on any visible figure.

Avoid: syringes, powders, pills, lines, drug paraphernalia or any recognizable drug; mirroring the character; changing her face; a burgundy or green tracksuit; making her look middle-aged; hoods on any figure; text, letters, numbers, pseudo-lettering, signatures, watermarks, logos or brands, including on clothing, wrappers and bottles; recognizable faces on opponents; other cast members; crowds; blood; card frames, borders or interface; likeness of any real person; photographic or 3D-rendered style; oversaturated colours, dominant yellow-and-black, neon, gold ornament; Internet imagery or the look of any existing game.
~~~


#### Risultati del secondo giro di correzioni

Due ritocchi del volto sulle versioni 2 e una nuova generazione del tunnel. Una richiesta per carta, nessun rifiuto o rilancio. Tre versioni 3 in attesa del proprietario; tutte le versioni precedenti restano conservate.

##### Fare l'Inventario — versione 3

| Campo | Valore |
|---|---|
| bindingName | `junkie.MethDrivenRage` |
| Versione | 3 |
| promptSha256 | `52b166639ea88637975a34a339eb588c779cc2852f64b1aeb7b2fe606515153e` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/junkie.MethDrivenRage-2.png`: `9ea2d734d22f95db08a774358331c4f65ec5d79d48ce3ebb0c864a990746f994`. |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.MethDrivenRage-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-a8eb57d3-376c-418b-abeb-de4d9cdfbd7a.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2772986 / `e265ed5e0f33c877af641121bba0cfc63a33c8739796f815ecda14538e34bbdf` |
| Anteprima | [WebP](anteprime/junkie.MethDrivenRage-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Nessuno nel giro; versione 2 da correggere secondo il proprietario e conservata. |
| Controllo a 60 px | Sguardo abbassato e postura raccolta leggibili; allineamento degli occhi non valutabile nel dettaglio. |
| Anomalie / riscontro della richiesta | Espressione pensierosa e labbra chiuse; non si osserva lo strabismo della versione precedente. Il tool ha rielaborato anche i tratti del volto, rendendoli più regolari. |
| Giudizio del proprietario | In attesa. |

##### Metabolismo Corrotto — versione 3

| Campo | Valore |
|---|---|
| bindingName | `junkie.PervertedMetabolism` |
| Versione | 3 |
| promptSha256 | `398394582be798619d03a08a18a3a31de9515001891b7410c8191691b29fe149` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/junkie.PervertedMetabolism-2.png`: `9a9363063481fced77ba74ba51e07a3b93f4958085a19f7d5da53146030d2742`. |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.PervertedMetabolism-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-8f7efd44-0a64-4ee8-a00b-927fa2501cb5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2639960 / `5592a5ef0c1ee1d4e8a4f33c6b7b19dddf2a2e00cd5a9415c7857e2c9279a3b4` |
| Anteprima | [WebP](anteprime/junkie.PervertedMetabolism-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Nessuno nel giro; versione 2 da correggere secondo il proprietario e conservata. |
| Controllo a 60 px | Ghigno e sopracciglia marcate distinguibili; vene verdi poco leggibili. |
| Anomalie / riscontro della richiesta | Volto più angoloso, ghigno storto e sopracciglia accentuate; vene verdi conservate. |
| Giudizio del proprietario | In attesa. |

##### Trascinare nel Tunnel — versione 3

| Campo | Valore |
|---|---|
| bindingName | `junkie.ToxicBloodDrain` |
| Versione | 3 |
| promptSha256 | `9b82ab2d656a25f9e7905c0bd7a2c040d1815d68f1b49b571a661ba349be2cbc` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/celestina.png`: `5e0ff04816d65929762a3eb740ddeaa7a3d74d267423a47af13e37fff751d811`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto; testo inviato riportato sopra |
| source | `originali/junkie.ToxicBloodDrain-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a217df-b635-7070-9a74-02f502e68a8e/exec-20bc3eeb-2515-401d-879a-9a0674a4ca81.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3030203 / `0b429f2175ff1b20c9a2ab804b5694386b16999b9dac4f284d4d2b06de381692` |
| Anteprima | [WebP](anteprime/junkie.ToxicBloodDrain-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla rispettiva richiesta |
| Tentativi scartati | Nessuno nel giro; versione 2 da correggere secondo il proprietario e conservata. |
| Controllo a 60 px | Mano verso la bocca e reazione dell’avventore leggibili; muffa non identificabile nel dettaglio. |
| Anomalie / riscontro della richiesta | Boccone ammuffito introdotto nella bocca dell’avventore; compare altro pane sul piatto. Il colorito verdastro di Celestina resta poco evidente sotto la luce calda. |
| Giudizio del proprietario | In attesa. |

**Verifiche del secondo giro:** `git diff --check` e `python scripts/check-rules.py` verdi; `python scripts/check-links.py` conserva i 22 collegamenti mancanti preesistenti, nessuno nuovo. Tre originali confrontati byte per byte con le risposte del tool, tre anteprime 512 × 512 px WebP qualità 80 e controllo visivo a 60 px. Pagina verificata con otto giudizi approvati, tre in attesa, undici viste a 60 px e riferimenti locali presenti. Nessun rifiuto, nessun rilancio, nessun comportamento o atteso modificato; file altrui intatti, nessun push. Il proprietario giudica le tre versioni 3 di Inventario, Metabolismo e Tunnel.

## Chiusura del lotto 3

26 novembre 2026. Il proprietario approva le versioni 3 di Fare l’Inventario, Metabolismo Corrotto e Trascinare nel Tunnel: «Approvo, chiudi». Con le approvazioni dei giri precedenti, tutte le undici carte di Celestina sono approvate ([D212](../../../set-base-decisioni.md#decisioni-del-proprietario)). Versioni scelte:

| Carta | bindingName | Versione | Anteprima |
|---|---|---:|---|
| Desiderio Incontrollabile | `com.basic.ToxicGrab` | 1 | [WebP](anteprime/com.basic.ToxicGrab.webp) |
| Fondo del Posacenere | `junkie.character.PatheticBlade` | 1 | [WebP](anteprime/junkie.character.PatheticBlade.webp) |
| Rintanarsi nel Cappotto | `base.tossico.bound.RaschiareIlFondo` | 2 | [WebP](anteprime/base.tossico.bound.RaschiareIlFondo-2.webp) |
| Tagliare la Dose | `junkie.character.RottenSmile` | 2 | [WebP](anteprime/junkie.character.RottenSmile-2.webp) |
| L’Ultimo Tiro | `junkie.LethalHeroinDose` | 3 | [WebP](anteprime/junkie.LethalHeroinDose-3.webp) |
| Fare l’Inventario | `junkie.MethDrivenRage` | 3 | [WebP](anteprime/junkie.MethDrivenRage-3.webp) |
| Tossicone Scatarrante | `junkie.Cough` | 1 | [WebP](anteprime/junkie.Cough.webp) |
| Metabolismo Corrotto | `junkie.PervertedMetabolism` | 3 | [WebP](anteprime/junkie.PervertedMetabolism-3.webp) |
| Riflessi Aumentati dalla Speed | `junkie.AmphetamineReflexes` | 1 | [WebP](anteprime/junkie.AmphetamineReflexes.webp) |
| Trascinare nel Tunnel | `junkie.ToxicBloodDrain` | 3 | [WebP](anteprime/junkie.ToxicBloodDrain-3.webp) |
| Un Assaggino | `base.tossico.UnAssaggino` | 1 | [WebP](anteprime/base.tossico.UnAssaggino.webp) |

Originali scelti verificati presenti in `originali/`, fuori da git; anteprime 512×512 WebP qualità 80. Nota della regia per la passata di omogeneità (D206): in più immagini la tuta tende al prugna o al bordeaux invece che al viola della guida. Nessuna integrazione nell’atlante in questo lotto. Nessun comportamento di gioco o atteso modificato.

## Lotto 4 — Piera

[Prompt letterali](lotto-04-piera.md), commit `9a6c4da`, verificati invariati. Dieci generazioni, una per prompt nell’ordine 1–10, con esclusivamente i due allegati nell’ordine dichiarato e impronte verificate: nessun rifiuto, rilancio, modifica o tentativo scartato. Modello e riscrittura non esposti; nessun campo negativo separato. I testi inviati sono i contenuti letterali dei blocchi, senza delimitatori né ritorno a capo finale; promptSha256 calcolato in UTF-8 con ritorni LF. Gli originali sono copie byte per byte dei PNG restituiti, fuori da git; anteprime a 512 × 512 px, WebP qualità 80. [Pagina di giudizio](giudizio-lotto-04.html).

**Deroga al preliminare, proprietario:** «Sì, prosegui con il lotto 4 lasciando intatti i quattro file non tracciati in output/pdf/. Non includerli nel commit.» I quattro file preesistenti sono le bozze set base e starter, PDF e manifest; lasciati intatti ed esclusi dal commit.

**Diagnosi:** SHA-256 di entrambi gli allegati coincidenti; sorgente dei prompt identica al commit indicato. Fetch eseguito: HEAD avanti di un commit rispetto a origin/main, nessun commit remoto da integrare. La sandbox non avviava i processi; letture, copie e verifiche eseguite fuori sandbox tramite escalation autorizzata. **Modifica:** dieci originali esclusi da git, dieci anteprime, questa sezione e pagina di giudizio; nessun comportamento o atteso cambiato. Le anomalie visive sono conservate senza ritocchi e descritte nelle tabelle; il giudizio resta al proprietario.

### Fino all'Ultima Goccia

| Campo | Valore |
|---|---|
| bindingName | `base.pino.QuestoLoFiniscoIo` |
| promptSha256 | `a7557e12ea888427cc5c89e7c63e3dfdbdefa7b2e9b48831a747e319fde42935` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.QuestoLoFiniscoIo.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-abfcf520-211f-41eb-bbe4-fb680618d130.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2813167 / `6e8d50caee0f5130e92e0342d8fd0792832a89401da2574e9fb5c410a7ada0fb` |
| Anteprima | [WebP](anteprime/base.pino.QuestoLoFiniscoIo.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 1, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bicchiere alla bocca e sagoma leggibili; punta della matita non distinguibile; seduta tonda senza schienale visibile. |
| Anomalie visive | La matita espone il terminale rosso con ghiera; la punta temperata richiesta non è visibile. |
| Giudizio del proprietario | In attesa. |

### Posto Fisso

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.CinqueMinutiEVado` |
| promptSha256 | `357c8559a861aefd773ae58c433d17d4551e01734211541e36067e7ddb5a1307` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.bound.CinqueMinutiEVado.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-3c931e91-0463-4939-aeb5-d4f5ba804d09.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2707204 / `97a880312db0dbcb253c741bc95e55767e8745ae58d4bc867364d05fd0678c2a` |
| Anteprima | [WebP](anteprime/base.pino.bound.CinqueMinutiEVado.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 2, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Cane sullo sgabello e cliente che si ritrae leggibili; punta della matita minuta; seduta tonda visibile, quattro zampe non separabili a 60 px. |
| Anomalie visive | Piera tiene un braccio davanti al busto e l’altro al bancone: non entrambi gli avambracci poggiano sul banco. Quattro zampe del cane presenti a piena risoluzione, una parzialmente nascosta. |
| Giudizio del proprietario | In attesa. |

### Schiarirsi le Idee

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.Coccio` |
| promptSha256 | `6876a5023f26cc056989cc042803553c1bc883c78a8d8079fbc58dc70dbd807c` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.bound.Coccio.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-69fe7a0b-3d67-4c02-9331-254ae28404b0.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3300520 / `ce1d04f3a897c265582a571ee374e459f85d3ac3f2b0a2ab3ddc2bb4e52fdaf1` |
| Anteprima | [WebP](anteprime/base.pino.bound.Coccio.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 3, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mani al viso e lavandino leggibili; punta della matita minuta; nessuna seduta presente. |
| Anomalie visive | Riflesso sfocato presente; lo sdoppiamento è lieve e non leggibile a 60 px. |
| Giudizio del proprietario | In attesa. |

### Ultimo Giro

| Campo | Valore |
|---|---|
| bindingName | `base.pino.UltimoGiro` |
| promptSha256 | `e5c210de9309a253fa8c33279a8a19911d8866e0a62cfc002d8d2caee4be0aab` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.UltimoGiro.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-87dce7a1-e96c-44be-9255-c56a5b97d11c.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2920015 / `e22e126de7420a1f520e72b858fab492d89384ba515fe8c59cd974269e77e0f0` |
| Anteprima | [WebP](anteprime/base.pino.UltimoGiro.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 4, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Vassoio inclinato e cliente chino leggibili; singoli bicchieri minuti; punta della matita minuta, seduta sul fondo poco distinta. |
| Anomalie visive | La seduta sul fondo è tagliata dal soggetto; nessuna seduta principale necessaria all’azione. |
| Giudizio del proprietario | In attesa. |

### Scompenso da Ultimo Giro

| Campo | Valore |
|---|---|
| bindingName | `base.pino.TestataDaUltimoGiro` |
| promptSha256 | `989f0f800ff66a0db66459bceb7d9b347ab065d4ea58771d16379d9d809ff47b` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.TestataDaUltimoGiro.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-f3101419-a3a6-4cdf-9651-188616f463f9.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2917703 / `def7a830a6341e52ffe77f6379c84c5629b2e50cbe05814eaf58c35dd87d7e7d` |
| Anteprima | [WebP](anteprime/base.pino.TestataDaUltimoGiro.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 5, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Caduta e urto leggibili; bicchiere in volo minuto; punta della matita non distinguibile, seduta rovesciata senza schienale visibile. |
| Anomalie visive | Contatto sul viso/naso contro il torso anziché nettamente sulla fronte; avversario inclinato all’indietro anziché piegato in avanti. Matita con terminale rosso e punta nascosta. |
| Giudizio del proprietario | In attesa. |

### Alla Goccia

| Campo | Valore |
|---|---|
| bindingName | `base.pino.GoingBerserk` |
| promptSha256 | `cb3f1c054d4d6de6b6f2b40ffb15f707fc05837a245e24a8cf8e73e0ee2c5fd5` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.GoingBerserk.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-8d8d66e8-54f8-435c-8ff7-f4672360697e.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2787653 / `8731e49eea3dc2f2bc94d82f05f49b9eaf7156a827d16ad65d2497de0add0ab0` |
| Anteprima | [WebP](anteprime/base.pino.GoingBerserk.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 6, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Colpo dall’alto e avversario piegato leggibili; bicchiere minuto; punta della matita minuta, seduta senza schienale sul fondo. |
| Anomalie visive | Nessuna ulteriore anomalia macroscopica osservata a piena risoluzione; dettagli minuti non verificabili a 60 px. |
| Giudizio del proprietario | In attesa. |

### Avamposto Fortificato al Bancone

| Campo | Valore |
|---|---|
| bindingName | `base.pino.IlBanconeRegge` |
| promptSha256 | `0a3e41ecf2dff3cce737d939ab4381c47e9b745478d308adca9cc89d4485cdaa` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.IlBanconeRegge.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-ff917e02-7608-4aec-ba1c-a28b02b4dc71.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2856956 / `6517c2af879fe073c698f120fa5a403cf46c5116d3fc564858ba149a6191386a` |
| Anteprima | [WebP](anteprime/base.pino.IlBanconeRegge.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 7, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Piera e bancone inclinato leggibili; presa e bicchierino minuti; punta della matita minuta, seduta tonda inclinata visibile. |
| Anomalie visive | Mano appoggiata al bordo anziché braccio chiaramente avvolto intorno al bancone; bicchierino sostanzialmente verticale. |
| Giudizio del proprietario | In attesa. |

### Un Altro e Arrivo

| Campo | Valore |
|---|---|
| bindingName | `base.pino.OffroIo` |
| promptSha256 | `fc54a838841f248ef4a4c42cd3f8c4ed11c9ba66af4f2d5b22676c69756d61d5` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.OffroIo.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-f459e3e1-5f5a-42cd-81c4-164f38cc8e12.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2761729 / `7a13e72051a4a6d894969d92114b7daba0564276b49dde9a917648da47a1190c` |
| Anteprima | [WebP](anteprime/base.pino.OffroIo.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 8, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Indice alzato e due clienti in attesa leggibili; punta della matita minuta; seduta tonda senza schienale visibile. |
| Anomalie visive | Barman assente; Piera mostra il volto alla sala, la direzione del gesto verso il barman non è verificabile. |
| Giudizio del proprietario | In attesa. |

### Rutto a Bruciapelo

| Campo | Valore |
|---|---|
| bindingName | `base.pino.RuttoADistanzaSociale` |
| promptSha256 | `617aaf50faa026bfa83fdd5faf15f9c4930e2d52bc12eb7d99fe0a871d15e8d1` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.RuttoADistanzaSociale.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-afd5c100-9586-4315-a23a-5f30d7c3d138.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3091514 / `0b38609386de982c852b15caefe4048c12b58183673a507d23f85ddd462a7cd4` |
| Anteprima | [WebP](anteprime/base.pino.RuttoADistanzaSociale.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 9, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Onda e avversario in volo leggibili; punta della matita minuta; seduta senza schienale visibile, cane sotto di essa, quattro zampe non verificabili. |
| Anomalie visive | Grappino si copre le orecchie; le zampe posteriori sono nascoste dalla posa, quindi non è verificabile l’appoggio di tutte e quattro. Cane separato dalle gambe di Piera. |
| Giudizio del proprietario | In attesa. |

### Un Altro... Grappino...

| Campo | Valore |
|---|---|
| bindingName | `base.pino.PrimaIlBrindisi` |
| promptSha256 | `34097bd7aea6ceb9d8183c05ecdc477adc8ba7216d2a404d356ee58ec08c1ba9` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/piera.png`: `8106e214afb0fb1cb05fa6eeeb060af9548b354a99eaa1d14af35f86d170d24c`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.pino.PrimaIlBrindisi.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-7a09d8d9-e7eb-4acb-9d41-3c316d062d65.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2784671 / `d6f568f76db3311f0a9968f012a524c91264062830b31f6c4d7c30f8e9b62333` |
| Anteprima | [WebP](anteprime/base.pino.PrimaIlBrindisi.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 10, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Brindisi e cane rivolto ai clienti leggibili; punta della matita minuta; seduta laterale senza schienale visibile, quattro zampe non separabili a 60 px. |
| Anomalie visive | Quattro zampe del cane presenti a piena risoluzione, una posteriore parzialmente coperta; il cane rimane separato dalle gambe di Piera. Schizzo del brindisi vicino al margine superiore. |
| Giudizio del proprietario | In attesa. |

**Verifiche:** git diff --check verde; python scripts/check-rules.py verde; python scripts/check-links.py: 504 documenti, 22 link rotti preesistenti, elenco identico al commit di base 9a6c4da (confronto in memoria del registro originale), zero nuovi; controllo mirato del registro: zero link rotti. Dieci originali verificati identici ai file restituiti tramite SHA-256, dieci anteprime WebP verificate a 512 x 512 px, controllo visivo su riduzioni effettive a 60 px. Prompt sorgente invariata. Nessuna verifica server richiesta per questo perimetro. **Non verificato:** approvazione visiva del proprietario; nessuna chiusura del lotto o decisione registrata. **Scelte prese:** nessuna modifica dei prompt, nessuna selezione fra varianti; conservati tutti i risultati della singola richiesta per carta.

### Giudizio del proprietario e primo giro di correzioni — 26 novembre 2026

> ultima goccia: la matita ha la punta dalla parte della gomma
> posto fisso: la punta della matita è strana
> schiarirsi le idee: la punta della matita è strana
> ultimo giro: i bicchieri che cadono sono tutti diversi e il vassoio è al contrario, e la punta della matita è strana
> scompenso: va bene ma la matita sembra conficcata nella testa, mettiamola più inclinata
> alla goccia: il bicchiere è strano e sembra che piera abbia della bava sul mento
> avamposto fortificato: lei dovrebbe essere dietro il bancone, e con una faccia agguerrita
> un altro e arrivo: la mano alzata ha il pollice al contrario. non mi piace la posa
> rutto: va quasi bene a parte la matita e la sedia rovesciata che è strana
> un altro grappino: ok a parte la matita

Recepito il giudizio sulle dieci versioni 1. Si prepara una versione 2 per ciascuna carta, una sola richiesta per carta, senza rilanci. Per ogni richiesta l’unico allegato è l’originale della carta da correggere, senza identikit, riferimento del bar o maschere. Tutte le versioni precedenti restano conservate. Scompenso e Un Altro... Grappino... sono da conservare nella scena, con la sola correzione della matita richiesta; nessuna approvazione definitiva o chiusura del lotto viene registrata.

**Diagnosi:** checkout con i soli quattro file non tracciati già autorizzati in `output/pdf/`, lasciati intatti. Base del giro: `1fa9008`; modifiche di SB-34 già committate, estranee al perimetro. **Modifica prevista:** ritocchi localizzati su sette matite; in Ultimo Giro anche vassoio e bicchieri, in Alla Goccia bicchiere e mento, in Rutto a Bruciapelo anche sedia. Per Avamposto Fortificato si ricompone Piera dietro al bancone con espressione agguerrita; per Un Altro e Arrivo si cambia posa mantenendo la richiesta di un altro drink e correggendo l’anatomia della mano. Scelte esecutive: un bicchiere cilindrico robusto per Alla Goccia; mano vicina alla spalla e busto eretto per Un Altro e Arrivo. Nessuna modifica di regole o attesi.

#### Prompt preventivi delle versioni 2

Testi da inviare letteralmente, UTF-8 e LF, senza delimitatori o ritorno finale; da committare prima delle richieste.

##### Fino all'Ultima Goccia — versione 2

Unico allegato: `originali/base.pino.QuestoLoFiniscoIo.png`, SHA-256 `6e8d50caee0f5130e92e0342d8fd0792832a89401da2574e9fb5c410a7ada0fb`.

~~~text
Edit only the pencil in this attached illustration. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Keep the drinking action, glass, patron, counter, backless stool, Piera's pose and all other details unchanged. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Posto Fisso — versione 2

Unico allegato: `originali/base.pino.bound.CinqueMinutiEVado.png`, SHA-256 `97a880312db0dbcb253c741bc95e55767e8745ae58d4bc867364d05fd0678c2a`.

~~~text
Edit only the pencil in this attached illustration. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Keep Piera's pose and glass, the dog snarling on the round backless stool, all four natural dog legs and grounded paws, and the recoiling patron unchanged. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Schiarirsi le Idee — versione 2

Unico allegato: `originali/base.pino.bound.Coccio.png`, SHA-256 `ce1d04f3a897c265582a571ee374e459f85d3ac3f2b0a2ab3ddc2bb4e52fdaf1`.

~~~text
Edit only the pencil in this attached illustration. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Keep Piera washing her face, both hands, all water splashes, sink, faucet and blurred mirror reflection unchanged. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Ultimo Giro — versione 2

Unico allegato: `originali/base.pino.UltimoGiro.png`, SHA-256 `e22e126de7420a1f520e72b858fab492d89384ba515fe8c59cd974269e77e0f0`.

~~~text
Edit this attached illustration only in the pencil, tray and falling shot glasses. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Correct the tray's orientation: show the shallow concave serving surface with its raised rim facing the viewer and tipped downward toward the opponent, so glasses visibly slide and tumble off its lowered edge. Do not show the convex underside as the surface that held the drinks. Make every falling glass an identical small cylindrical shot glass, with the same simple straight sides, thick flat base, diameter and height; only its perspective and rotation vary. Keep the glasses intact, their liquor spilling onto the opponent, and preserve her two hands holding the tray and the opponent's defensive reaction. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Scompenso da Ultimo Giro — versione 2

Unico allegato: `originali/base.pino.TestataDaUltimoGiro.png`, SHA-256 `def7a830a6341e52ffe77f6379c84c5629b2e50cbe05814eaf58c35dd87d7e7d`.

~~~text
Edit only the pencil and the tiny surrounding area of hair in this attached illustration. Keep Piera's fall, closed eyes, impact, opponent, flying glass and tipped backless stool unchanged. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Rotate the pencil farther toward horizontal, only about 15 degrees above the horizontal toward the exposed left point. Make its shaft visibly rest along the outer curls with hair supporting it; no shaft directed into the head, skin, face or scalp. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Alla Goccia — versione 2

Unico allegato: `originali/base.pino.GoingBerserk.png`, SHA-256 `8731e49eea3dc2f2bc94d82f05f49b9eaf7156a827d16ad65d2497de0add0ab0`.

~~~text
Edit this attached illustration only in the drinking glass used for the blow and the drop on Piera's chin. Replace the strange stemmed vessel with one ordinary sturdy empty cylindrical tumbler, straight glass walls, open circular rim and thick flat base, no stem and no pedestal foot. Her existing striking hand grips its side naturally and brings its base down onto the opponent's head; keep the glass intact and preserve the direction and force of the blow. Remove the drool-like drop and its streak completely: her chin is dry, with normal skin shading. Keep her face, smile, pose, pencil, other hand, opponent, impact marks and background unchanged. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Avamposto Fortificato al Bancone — versione 2

Unico allegato: `originali/base.pino.IlBanconeRegge.png`, SHA-256 `6517c2af879fe073c698f120fa5a403cf46c5116d3fc564858ba149a6191386a`.

~~~text
Edit this attached illustration to place Piera behind the bar counter, on the bartender's working side, with a fierce combative expression. Put the large solid wooden counter front in the foreground between the viewer and her lower body; her upper body rises prominently behind its top. She braces one arm firmly around the counter's edge and keeps the little grappa glass level in her other hand while the whole counter lurches diagonally and bottles and glasses slide. Give her a determined aggressive face with lowered knitted brows, narrowed aligned eyes and a tight defiant mouth; retain her recognizable age, round face and red nose. Recompose only as needed for this clear behind-the-counter position; do not show her sitting on a stool on the customer's side. Keep her recognizable clothes, bun and pencil, the bar shelves and lamp, and coherent anatomy. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Un Altro e Arrivo — versione 2

Unico allegato: `originali/base.pino.OffroIo.png`, SHA-256 `7a13e72051a4a6d894969d92114b7daba0564276b49dde9a917648da47a1190c`.

~~~text
Edit this attached illustration to replace Piera's disliked raised-arm pose with a natural readable order for one more drink. Keep her seated upright on the same modest round backless bar stool, in a relaxed side-on posture toward the counter, shoulders level, weight balanced. Rest one forearm naturally on the counter. Bend the other elbow close to her torso and raise that hand beside her shoulder with only the index finger pointing up to order another drink; no arm reaching backward over her head. Draw a coherent hand with five digits: the thumb emerges from the correct inner side of the palm and folds naturally across the curled middle, ring and little fingers. The hand and forearm must join naturally, no reversed thumb or twisted wrist. Let her head turn slightly toward the counter with her familiar serene drowsy expression. Keep the two anonymous impatient patrons by the door, glass, bun and pencil, furniture scale, and bar background. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Rutto a Bruciapelo — versione 2

Unico allegato: `originali/base.pino.RuttoADistanzaSociale.png`, SHA-256 `0b38609386de982c852b15caefe4048c12b58183673a507d23f85ddd462a7cd4`.

~~~text
Edit this attached illustration only in the pencil and the overturned chair at the lower right. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Redraw that overturned chair as a simple physically coherent wooden bar chair resting on its side: one rectangular seat, one backrest connected to the rear seat corners by two continuous uprights, and exactly four legs attached at the four seat corners, with consistent perspective, no fused, disconnected or extra wooden parts. Keep the flying patron, belch shockwave, table, glasses, Piera's pose and her round backless stool unchanged. Preserve Grappino cowering underneath, separate from her legs, with no added or altered limbs. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

##### Un Altro... Grappino... — versione 2

Unico allegato: `originali/base.pino.PrimaIlBrindisi.png`, SHA-256 `d6f568f76db3311f0a9968f012a524c91264062830b31f6c4d7c30f8e9b62333`.

~~~text
Edit only the pencil in this attached illustration. Replace the pencil in her bun with one ordinary straight wooden pencil. Its exposed end on the left is a clean sharpened cone of pale wood ending in one small dark graphite point. There is no eraser or metal ferrule on that pointed end. The opposite blunt end is hidden among the curls. Lay the pencil shallowly and tangentially through the outer hair above the scalp, clearly held by the bun, never entering skin. Keep it short and physically plausible. Keep Piera's toast, raised glass and hand, other hand on the backless stool, open mouth, dog barking in the foreground, its four natural legs and paws on the floor, and the two startled patrons unchanged. Preserve the same recognizable Piera, face except where expressly changed, body proportions, all-black clothes, hair, exactly two arms and two anatomically coherent hands, the other figures, bar/restroom setting, warm lighting, palette, irregular ink contours and painted print texture. Preserve the original square composition except for the specified changes. Opaque square artwork, no text, border or watermark.
~~~

#### Risultati del primo giro di correzioni

Prompt preventivi nel commit `78d3fa6`. Dieci richieste nell’ordine delle carte, ciascuna con il solo originale della versione 1 da ritoccare. Nessun rifiuto, rilancio, maschera o tentativo scartato. Dieci versioni 2 proposte, tutte in attesa del proprietario; versioni 1 conservate. Modello e prompt riscritto non esposti. Originali copiati senza trasformazioni; anteprime WebP 512 px, qualità 80. [Pagina aggiornata](giudizio-lotto-04.html).

##### Fino all'Ultima Goccia — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.QuestoLoFiniscoIo` |
| Versione | 2 |
| promptSha256 | `db368adade7f614386038ec3a0c96bc7f983ff10429ea4d71aa73fe8fd9f7831` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.QuestoLoFiniscoIo.png`: `6e8d50caee0f5130e92e0342d8fd0792832a89401da2574e9fb5c410a7ada0fb`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.QuestoLoFiniscoIo-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-b5917492-ee3b-4e99-af01-27685b136e6e.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2506081 / `4b734bd2bbe786c8e54ba4436175ed8e0570d845bb5dcfb51119390a1809db1e` |
| Anteprima | [WebP](anteprime/base.pino.QuestoLoFiniscoIo-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 1, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bevuta e seduta tonda senza schienale leggibili; matita corta orizzontale, punta troppo minuta per verificarne la grafite. |
| Controllo oggettivo e anomalie | Matita corta con legno temperato e punta scura a sinistra; eliminati gomma e ghiera da quel lato. La scena resta quella della versione 1. |
| Giudizio del proprietario | In attesa. |

##### Posto Fisso — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.CinqueMinutiEVado` |
| Versione | 2 |
| promptSha256 | `5dd9fd9df23c85fa63e0af8018c9598fbc34549e88e8a4ac163ee55279d51807` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.bound.CinqueMinutiEVado.png`: `97a880312db0dbcb253c741bc95e55767e8745ae58d4bc867364d05fd0678c2a`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.bound.CinqueMinutiEVado-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-9887ded8-7a91-4f63-af76-2856be4c1a22.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2402163 / `00b20b89fa839eeed86908c6299c2e4beda4b076eab9baec3f330eb9606ce19b` |
| Anteprima | [WebP](anteprime/base.pino.bound.CinqueMinutiEVado-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 2, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Cane sullo sgabello e cliente che arretra leggibili; punta della matita minuta; seduta tonda visibile, quattro zampe non separabili. |
| Controllo oggettivo e anomalie | Matita corta appoggiata ai ricci, legno temperato e punta scura visibili a piena risoluzione. Quattro zampe del cane presenti, una posteriore parzialmente coperta; cane separato dalle gambe di Piera. |
| Giudizio del proprietario | In attesa. |

##### Schiarirsi le Idee — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.bound.Coccio` |
| Versione | 2 |
| promptSha256 | `f1e1071119cb74ddd42e81c07e079ebf6d1ba818ae568579ce9b3e54bd701065` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.bound.Coccio.png`: `ce1d04f3a897c265582a571ee374e459f85d3ac3f2b0a2ab3ddc2bb4e52fdaf1`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.bound.Coccio-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-1d56eefa-2f34-4305-a520-ecece2b1bcf5.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2900505 / `67f11860c756e5243c47bca5f261ac020790613eee47c96b0273aa25d5e20e1f` |
| Anteprima | [WebP](anteprime/base.pino.bound.Coccio-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 3, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Mani al viso e lavandino leggibili; matita orizzontale visibile ma grafite non verificabile; nessuna seduta. |
| Controllo oggettivo e anomalie | Matita appoggiata quasi orizzontalmente ai ricci, con legno chiaro temperato e punta scura; il fusto è stato ridisegnato tra le ciocche. Scena del lavaggio mantenuta. |
| Giudizio del proprietario | In attesa. |

##### Ultimo Giro — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.UltimoGiro` |
| Versione | 2 |
| promptSha256 | `1185ca7e2018aab1831766a95c2804683700407ab7da772e0a4204f70c89a484` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.UltimoGiro.png`: `e22e126de7420a1f520e72b858fab492d89384ba515fe8c59cd974269e77e0f0`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.UltimoGiro-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-f8d3f047-979e-4416-b436-1bab0d348b05.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2696377 / `b22a7721d716fb81c49a3fd586f0b9a5fa79bdfc64a8efbd9af5286d97a6d3df` |
| Anteprima | [WebP](anteprime/base.pino.UltimoGiro-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 4, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Interno del vassoio e caduta dei bicchieri leggibili; uniformità dei singoli bicchieri e punta della matita troppo minute; seduta sul fondo poco distinta. |
| Controllo oggettivo e anomalie | Superficie concava del vassoio e bordo rialzato rivolti allo spettatore; sei bicchieri cilindrici simili, con differenze prospettiche. Alcuni bicchieri in volo trattengono ancora liquido. Matita ridisegnata senza gomma sul lato appuntito. |
| Giudizio del proprietario | In attesa. |

##### Scompenso da Ultimo Giro — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.TestataDaUltimoGiro` |
| Versione | 2 |
| promptSha256 | `24f5c6b2a9a50f5af0382c7278ffb0fecad20c4a90ec49cf1acd94e1c38aba3d` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.TestataDaUltimoGiro.png`: `def7a830a6341e52ffe77f6379c84c5629b2e50cbe05814eaf58c35dd87d7e7d`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.TestataDaUltimoGiro-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-0ac66dc0-7f06-41f2-af93-27b0ff16db19.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2569347 / `453d6bb70aabd52c4dec325347aa73ca8f93acbc6329071ccb2ce71ca73adee3` |
| Anteprima | [WebP](anteprime/base.pino.TestataDaUltimoGiro-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 5, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Caduta e urto leggibili; matita quasi orizzontale, punta minuta; seduta rovesciata senza schienale visibile. |
| Controllo oggettivo e anomalie | Matita quasi orizzontale lungo i ricci, con punto scuro esposto a sinistra; il tratto visibile non entra nella pelle. Caduta, contatto e sgabello mantenuti. |
| Giudizio del proprietario | In attesa. |

##### Alla Goccia — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.GoingBerserk` |
| Versione | 2 |
| promptSha256 | `9ff5b77050741659a31d3a3d64451e859e7c2c5ad03d90b6c46bc22dc11c82ae` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.GoingBerserk.png`: `8731e49eea3dc2f2bc94d82f05f49b9eaf7156a827d16ad65d2497de0add0ab0`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.GoingBerserk-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-2233ba19-ded0-4158-aa23-5d1c606cfa51.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2438514 / `1194d6d8fa573c8c3b3cb4a42c02a4f4d30f9434616c15eee8cdb0afcddad480` |
| Anteprima | [WebP](anteprime/base.pino.GoingBerserk-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 6, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Colpo e bicchiere senza stelo leggibili; mento senza goccia; punta della matita minuta, seduta senza schienale sul fondo. |
| Controllo oggettivo e anomalie | Bicchiere cilindrico robusto, senza stelo né piede; goccia e striscia sul mento rimosse. Bicchiere integro contro la testa dell’avversario. |
| Giudizio del proprietario | In attesa. |

##### Avamposto Fortificato al Bancone — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.IlBanconeRegge` |
| Versione | 2 |
| promptSha256 | `d382aca3d323dee47f762ec1a7bc1d5fce666bdebd710b3e0a9fbd8ae0f608ed` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.IlBanconeRegge.png`: `6517c2af879fe073c698f120fa5a403cf46c5116d3fc564858ba149a6191386a`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.IlBanconeRegge-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-6b878ff7-1260-41d1-beac-70fdf46fdbcd.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2802951 / `d7bd4a3f7891794fcf8dc0786b350357838163b874bcff9280b75c8ad1afdf79` |
| Anteprima | [WebP](anteprime/base.pino.IlBanconeRegge-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 7, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Piera dietro il bancone e sopracciglia aggrottate leggibili; punta della matita minuta; nessuna seduta visibile. |
| Controllo oggettivo e anomalie | Bancone in primo piano davanti al corpo di Piera, espressione agguerrita e bicchierino verticale. Una mano afferra il bordo: il braccio non avvolge completamente il bancone. Ricomposizione più stretta, gambe e sgabello non visibili. |
| Giudizio del proprietario | In attesa. |

##### Un Altro e Arrivo — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.OffroIo` |
| Versione | 2 |
| promptSha256 | `04c41d31bc50d95ea2efff0f9b2044e465cb08a5007f17523c5117ea624a268e` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.OffroIo.png`: `7a13e72051a4a6d894969d92114b7daba0564276b49dde9a917648da47a1190c`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.OffroIo-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-b9fc98e6-abc7-442a-a6a9-53a6ca45d793.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2576866 / `77ce27760393a5f83c75adb0e83c72358d915cc1b414d640baae886726ac4c68` |
| Anteprima | [WebP](anteprime/base.pino.OffroIo-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 8, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Busto eretto e indice vicino alla spalla leggibili; pollice non verificabile a questa scala; punta della matita minuta, seduta tonda visibile. |
| Controllo oggettivo e anomalie | Posa più eretta e mano ridisegnata accanto alla spalla; pollice ripiegato presso le dita, dettaglio non verificabile a 60 px. Clienti alla porta e bicchiere sul banco mantenuti. |
| Giudizio del proprietario | In attesa. |

##### Rutto a Bruciapelo — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.RuttoADistanzaSociale` |
| Versione | 2 |
| promptSha256 | `42dfbcb3959765f02b8837d44f28e2f608f064fcbe01c898e4fe2820ddc0351a` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.RuttoADistanzaSociale.png`: `0b38609386de982c852b15caefe4048c12b58183673a507d23f85ddd462a7cd4`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.RuttoADistanzaSociale-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-0f63f07a-8366-440a-bf9d-06ab9c5ed5b7.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2811774 / `0512c5993f903adcbc1c8b6f4d65ba16f5b12e1143333776bdbba7fb166f78cd` |
| Anteprima | [WebP](anteprime/base.pino.RuttoADistanzaSociale-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 9, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Onda, avversario in volo e sedia laterale leggibili; punta della matita minuta; sgabello senza schienale visibile, quattro zampe di Grappino non verificabili. |
| Controllo oggettivo e anomalie | Sedia ridisegnata con seduta rettangolare, schienale e quattro gambe orientate verso destra; prospettiva rigida e attacchi da giudicare a piena risoluzione. Matita senza terminale rosso sul lato appuntito. Grappino mantiene le zampe anteriori sulle orecchie e le posteriori nascoste; appoggio di quattro zampe non verificabile. |
| Giudizio del proprietario | In attesa. |

##### Un Altro... Grappino... — risultato versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.pino.PrimaIlBrindisi` |
| Versione | 2 |
| promptSha256 | `8a02bec618d00dbd02e35708c18145d49e9d9bbcb7dbfb471952440143947b45` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.PrimaIlBrindisi.png`: `d6f568f76db3311f0a9968f012a524c91264062830b31f6c4d7c30f8e9b62333`. Nessuna maschera. |
| Prompt riscritto | non esposto; testo inviato riportato nei prompt preventivi sopra |
| source | `originali/base.pino.PrimaIlBrindisi-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-5f90b55f-618e-41cc-b2d1-165fd1f8ef6d.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2465212 / `ec9d65629e1903e90bf75d2f232b8b1031d1d6ba91f961095092dad77484e9d8` |
| Anteprima | [WebP](anteprime/base.pino.PrimaIlBrindisi-2.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt di correzione 10, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Brindisi e cane che abbaia leggibili; matita quasi orizzontale, punta minuta; seduta laterale senza schienale visibile, quattro zampe non separabili. |
| Controllo oggettivo e anomalie | Matita corta e quasi orizzontale sopra i ricci, con punta scura a sinistra. Brindisi, seduta e cane mantenuti; quattro zampe del cane presenti a piena risoluzione, una posteriore parzialmente coperta. |
| Giudizio del proprietario | In attesa. |

**Verifiche del giro:** git diff --check verde (anche sul solo perimetro); python scripts/check-rules.py verde sul checkout corrente; controllo mirato del registro: zero link rotti. Controllo globale: 505 documenti e 35 link rotti, identico elenco sostituendo in memoria il registro con quello della base 1fa9008: nessuno introdotto dal lotto. Ventidue destinazioni erano assenti nella base; tredici erano presenti e sono state rinominate dal lavoro concorrente sulle classi, fuori perimetro. Durante il giro sono comparse modifiche altrui anche in staging: lasciate intatte, commit limitato esplicitamente ai dodici percorsi del lotto. Verificati dieci allegati iniziali invariati, dieci copie byte per byte, dieci WebP a 512 x 512 px; pagina con dieci versioni 2, dieci viste a 60 px e tutte le versioni 1 e i giudizi precedenti. Prompt iniziali invariati; prompt di correzione preventivi nel commit 78d3fa6. Nessuna verifica server del lavoro concorrente attribuita a questo lotto. **Non verificato:** giudizio del proprietario sulle versioni 2; nessuna decisione o chiusura del lotto. **Scelte prese:** quelle dichiarate nei prompt preventivi; nessun ulteriore ritocco autonomo. Giro terminato, in attesa del giudizio.

### Secondo giro di correzioni — Alla Goccia, rimozione con maschera — 26 novembre 2026

Richiesta letterale del proprietario:

> Remove the area marked in the second image from the first image

Il primo allegato segnalato dalla chat non era leggibile per il prefisso Windows `/C:/`; la stessa immagine è disponibile nell’originale locale verificato `originali/base.pino.GoingBerserk-2.png`, SHA-256 `1194d6d8fa573c8c3b3cb4a42c02a4f4d30f9434616c15eee8cdb0afcddad480`. La seconda immagine è la maschera nera con area bianca sul lato sinistro: indica la mano e l’avambraccio protesi dietro Piera. Si rimuove quella parte visibile ricostruendo sfondo e bordo della manica; il braccio rimane fuori vista dietro il corpo. Un’unica richiesta di ritocco, versione 3, nessun rilancio. Tutte le versioni precedenti restano conservate; le altre nove carte non ricevono nuove richieste.

**Diagnosi:** originale versione 2 presente, impronta coincidente; perimetro SB-32 pulito. La maschera è disponibile come allegato della chat, senza percorso locale o SHA-256 esposti. **Modifica prevista:** solo la zona bianca, mantenendo colpo, bicchiere cilindrico e mento asciutto. Si inviano solo maschera e immagine da correggere tramite le due immagini recenti: immagine 1 maschera, immagine 2 originale caricato localmente. Nessun identikit o altro riferimento. Nessuna decisione o chiusura del lotto.

#### Prompt preventivo — Alla Goccia, versione 3

~~~text
Image 1 is the black-and-white removal mask supplied by the owner: white marks the only area to edit and black marks protected artwork. Image 2 is the illustration to edit. Remove the exposed hand and forearm at the far left of Piera, entirely within the white mask area. Remove every finger and the skin-coloured forearm of that rear-reaching limb. Fill the cleared area naturally with the existing dark bar background and, where it meets her body, a continuous edge of her black sleeve and sweatshirt. The arm should be out of sight behind her body, with no visible hand, detached stump or replacement limb there. Preserve everything outside the white region as closely as possible: the striking arm and its hand, ordinary cylindrical glass, impact on the opponent's head, both figures' faces and bodies, dry chin, pencil, furniture, floor, lighting, colours, ink contours, print texture and square framing. Do not alter the blow, invent another arm, add objects, lettering, borders or transparency. Return one opaque square illustration.
~~~

### Secondo giro di correzioni — Un Altro... Grappino..., rimozione con maschera — 26 novembre 2026

Ulteriore richiesta letterale del proprietario, ricevuta mentre era in corso il ritocco di Alla Goccia:

> Remove the area marked in the second image from the first image

L’immagine indicata è `exec-5f90b55f-618e-41cc-b2d1-165fd1f8ef6d.png`, disponibile nella copia locale verificata `originali/base.pino.PrimaIlBrindisi-2.png`, SHA-256 `ec9d65629e1903e90bf75d2f232b8b1031d1d6ba91f961095092dad77484e9d8`. La maschera allegata in chat indica la mano alzata e l’avambraccio del cliente in primo piano a destra, accanto alla testa di Grappino; non indica la mano più alta dell’altro cliente o quella inferiore presso il bordo destro. Maschera senza percorso locale o SHA-256 esposti.

**Diagnosi:** versione 2 già verificata; errore del collegamento `/C:/` aggirato caricando l’originale locale corretto. **Modifica prevista:** un solo ritocco locale, versione 3, con esclusivamente maschera e immagine da correggere (immagine 1 maschera, immagine 2 originale caricato localmente). Nessun rilancio; tutte le versioni conservate. Questa richiesta si aggiunge ad Alla Goccia nello stesso giro; le altre otto carte rimangono in versione 2, in attesa. Nessuna decisione o chiusura del lotto.

#### Prompt preventivo — Un Altro... Grappino..., versione 3

~~~text
Image 1 is the owner's black-and-white removal mask: white identifies the edit region and black protects the rest. Image 2 is the illustration to edit. In the white region only, remove the raised hand and exposed forearm of the foreground patron at the right side, just above and to the right of the barking dog's head. Remove all the fingers, palm and skin-coloured forearm in that marked region, reconstructing the ordinary bar background and the natural continuous edge of that patron's dark coat where needed. Leave this arm out of sight, not replaced by a stump, new hand or extra limb. Do not remove or change the other patron's higher raised hand, the foreground patron's lower hand near the bottom-right edge, Grappino's muzzle, ears, body, four natural legs and grounded paws, Piera's toast and both hands, her pencil, stool, glass, liquid splash or any unmarked detail. Preserve the existing warm lighting, colours, hand-inked comic style, print texture and square composition. No text, border or transparency. Return one opaque square illustration.
~~~

#### Risultati dei due ritocchi con maschera — versioni 3

Prompt preventivi nei commit `9b9aa3a` (Alla Goccia) e `6373038` (Un Altro... Grappino...). Una richiesta per carta, nessun rifiuto o rilancio. Originali e anteprime delle versioni 1 e 2 conservati; due proposte in versione 3 in attesa. Le maschere sono state passate come immagini guida bianche/nere, non come parametro di maschera separato (non esposto dallo strumento).

##### Alla Goccia — risultato versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.pino.GoingBerserk` |
| Versione | 3 |
| promptSha256 | `98504f0f40704a5ec8060779e0d8c5d4c8596f6718be345115bc10e0923d9f97` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. Maschera del proprietario allegata in chat per questa carta (SHA-256 non esposto); 2. `originali/base.pino.GoingBerserk-2.png`: `1194d6d8fa573c8c3b3cb4a42c02a4f4d30f9434616c15eee8cdb0afcddad480`. Solo queste due immagini recenti, nessun altro riferimento. |
| Prompt riscritto | non esposto; testo inviato riportato nel prompt preventivo |
| source | `originali/base.pino.GoingBerserk-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-2a0626c8-1a33-4285-95fa-6a35b5dcc294.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2346630 / `e2b06061f3aebb95c3d5a07855d7b24bc4611a9d63197baba2c6b27d638fd894` |
| Anteprima | [WebP](anteprime/base.pino.GoingBerserk-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla richiesta di ritocco di questa carta |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Colpo e bicchiere cilindrico leggibili; mano posteriore a sinistra assente, mento asciutto; punta della matita minuta, sgabello senza schienale sul fondo. |
| Controllo oggettivo | Rimossi dita, mano e avambraccio sinistri segnati; fondo del bar e profilo della felpa ricostruiti. Braccio che colpisce, bicchiere e impatto mantenuti. Il braccio posteriore non è esposto. |
| Limiti | Nessuna misura pixel per pixel fuori maschera: la maschera non è disponibile come file locale; possibili variazioni fini di tratto e texture della generazione. |
| Giudizio del proprietario | In attesa. |

##### Un Altro... Grappino... — risultato versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.pino.PrimaIlBrindisi` |
| Versione | 3 |
| promptSha256 | `92ef014b6537f417579d438aa8898a0774a59e39f45ef49d8c147b272912f534` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. Maschera del proprietario allegata in chat per questa carta (SHA-256 non esposto); 2. `originali/base.pino.PrimaIlBrindisi-2.png`: `ec9d65629e1903e90bf75d2f232b8b1031d1d6ba91f961095092dad77484e9d8`. Solo queste due immagini recenti, nessun altro riferimento. |
| Prompt riscritto | non esposto; testo inviato riportato nel prompt preventivo |
| source | `originali/base.pino.PrimaIlBrindisi-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-475755e6-5015-406d-84e8-c3c2f9ab037f.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2606297 / `11f018267cb98b96e0a0b5b1909b20a4b3b83c19041b608dfabb5ebbe3c1a11d` |
| Anteprima | [WebP](anteprime/base.pino.PrimaIlBrindisi-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla richiesta di ritocco di questa carta |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Brindisi e cane leggibili; mano accanto al muso assente; punta della matita minuta, seduta laterale senza schienale visibile, quattro zampe non separabili a 60 px. |
| Controllo oggettivo | Rimossi mano alzata e avambraccio del cliente in primo piano nella zona segnata. Restano la sua mano inferiore e quella alta dell’altro cliente. Grappino è separato dalle gambe di Piera; quattro zampe presenti a piena risoluzione, una posteriore parzialmente coperta. |
| Limiti | Nessuna misura pixel per pixel fuori maschera: la maschera non è disponibile come file locale; possibili variazioni fini di tratto e texture della generazione. |
| Giudizio del proprietario | In attesa. |

**Verifiche dei ritocchi:** git diff --check verde; python scripts/check-rules.py verde sul checkout corrente; controllo dei link del registro verde. Due originali identici byte per byte ai risultati restituiti, due anteprime WebP verificate a 512 x 512 px; controllo visivo delle riduzioni a 60 px. Pagina verificata: dieci carte, due versioni 3 correnti, dodici sezioni delle versioni precedenti, dieci campi di giudizio e 32 riferimenti immagine validi. Le anomalie globali dei link del lavoro concorrente restano quelle attribuite nel giro precedente; nessun file di quel lavoro viene modificato o incluso. Prompt iniziali invariati. **Non verificato:** giudizio del proprietario sulle versioni 3; nessuna decisione o chiusura del lotto. **Scelte prese:** rimozione limitata alle due parti indicate, senza sostituirle con nuovi arti. Giro terminato in attesa del proprietario.

### Terzo giudizio del proprietario e correzione del bicchiere — 26 novembre 2026

> ultima goccia: il bicchiere ha una forma strana
> posto fisso: ok
> schiarirsi le idee: ok
> ultimo giro: ok
> scompenso: ok
> alla goccia: ok
> avamposto: ok
> un altro e arrivo: ok
> rutto: ok
> grappino: ok

Recepiti i nove «ok»: Posto Fisso, Schiarirsi le Idee, Ultimo Giro, Scompenso da Ultimo Giro, Avamposto Fortificato al Bancone, Un Altro e Arrivo e Rutto a Bruciapelo approvate nella versione 2; Alla Goccia e Un Altro... Grappino... approvate nella versione 3. Fino all’Ultima Goccia versione 2 richiede il solo ritocco del bicchiere; si propone una versione 3 con un unico bicchiere cilindrico regolare, senza modificare il resto della scena. Nessuna chiusura del lotto o decisione della regia.

**Diagnosi:** perimetro SB-32 pulito; originale verificato `originali/base.pino.QuestoLoFiniscoIo-2.png`, SHA-256 `4b734bd2bbe786c8e54ba4436175ed8e0570d845bb5dcfb51119390a1809db1e`. **Modifica prevista:** una richiesta di ritocco con esclusivamente questo originale, senza maschera o riferimenti aggiuntivi; nessun rilancio e tutte le versioni conservate. Le altre nove carte non ricevono generazioni. Nessuna modifica di regole o attesi.

#### Prompt preventivo — Fino all’Ultima Goccia, versione 3

~~~text
Edit this attached illustration only in the glass Piera is drinking from and the tiny contact area between her fingers and that glass. Replace its distorted shape with one ordinary sturdy clear cylindrical tumbler, straight parallel side walls, one circular open rim shown as a clean ellipse in perspective, and one flat circular thick base shown in consistent perspective. The rim and base belong to the same regular cylinder, no bulges, warped lip, doubled rim, stem, handle, pedestal or extra glass. Keep the current tilt and position: her raised hand grips the side naturally and she pours the amber drink into her open mouth in one gulp. Preserve the existing liquid stream and drinking gesture, changing them only at the glass rim if required for a physically coherent pour. Keep her face, expression, head angle, pose, all-black clothes, bun, corrected short horizontal pencil, other hand, patron, counter, round backless stool, slippers, bar background, light, palette, ink contours, worn print texture and square framing unchanged. No extra fingers or limbs, no text, border or transparency. Return one opaque square illustration.
~~~

#### Risultato — Fino all’Ultima Goccia, versione 3

Prompt preventivo nel commit `92867d7`. Una richiesta, nessun rifiuto, rilancio o tentativo scartato. Versioni 1 e 2 conservate; versione 3 proposta in attesa. Nove altre carte approvate come riportato nel giudizio precedente, senza nuove generazioni.

| Campo | Valore |
|---|---|
| bindingName | `base.pino.QuestoLoFiniscoIo` |
| Versione | 3 |
| promptSha256 | `202e4bef4239dcfbcadcc717b1c4ad5e436e48672e01710226585d3e09e19f37` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato, immagine da ritoccare: `originali/base.pino.QuestoLoFiniscoIo-2.png`: `4b734bd2bbe786c8e54ba4436175ed8e0570d845bb5dcfb51119390a1809db1e`. Nessuna maschera o altro riferimento. |
| Prompt riscritto | non esposto; testo inviato riportato nel prompt preventivo |
| source | `originali/base.pino.QuestoLoFiniscoIo-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-9a493bb1-7ed4-4e0f-b555-f7d6f97f4f99.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2453395 / `90539e06526916e98b6ac4866266e45c17d511bb613de5c3c8be3ac3ac1cdbcc` |
| Anteprima | [WebP](anteprime/base.pino.QuestoLoFiniscoIo-3.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla richiesta di correzione del bicchiere |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bevuta e bicchiere inclinato leggibili; dettagli di bordo e fondo poco distinti; punta della matita minuta, seduta tonda senza schienale visibile. |
| Controllo oggettivo | Bicchiere ridisegnato con pareti dritte, bordo e base ellittici; getto alla bocca mantenuto. Nessuno stelo o rigonfiamento evidente a piena risoluzione; posa e matita mantenute. |
| Giudizio del proprietario | In attesa. |

**Verifiche del bicchiere:** git diff --check verde; python scripts/check-rules.py verde sul checkout corrente; controllo dei link del registro verde. Originale versione 2 verificato invariato; versione 3 identica byte per byte al file restituito; anteprima WebP 512 x 512 px, qualità 80; controllo visivo a 60 px eseguito. Pagina verificata: dieci carte, nove giudizi ok, un giudizio in attesa, 33 riferimenti immagine validi e tutte le versioni precedenti conservate. Prompt iniziali invariati. Nessun intervento sul lavoro concorrente. **Non verificato:** giudizio del proprietario su questa versione 3; nessuna decisione o chiusura del lotto. **Scelte prese:** bicchiere cilindrico semplice, mantenendo inclinazione e azione. Giro terminato in attesa del proprietario.

### Quarto giudizio del proprietario e sostituzione del bicchiere — 26 novembre 2026

> il bicchiere è sempre strano, non mi piace cambiamolo del tutto in un bicchiere da grappa

Fino all’Ultima Goccia versione 3 non accettata. Si sostituisce del tutto il cilindro con un piccolo calice da grappa a tulipano: coppa arrotondata e stretta all’imboccatura, stelo corto e piede circolare. La mano impugna lo stelo; si conserva il gesto del bere, adeguando soltanto mano e polso quanto serve. Una richiesta per la versione 4, nessun rilancio, tutte le versioni precedenti conservate. I nove «ok» restano riferiti alle altre carte; nessuna chiusura del lotto o decisione della regia.

**Diagnosi:** perimetro SB-32 pulito; originale `originali/base.pino.QuestoLoFiniscoIo-3.png` verificato, SHA-256 `90539e06526916e98b6ac4866266e45c17d511bb613de5c3c8be3ac3ac1cdbcc`. Base corrente `4f44638`, con altri commit estranei al lotto lasciati intatti. **Modifica prevista:** solo bicchiere e presa della mano nella versione 3. Unico allegato l’originale da correggere, nessuna maschera o riferimento aggiuntivo. Nessuna modifica di regole o attesi.

#### Prompt preventivo — Fino all’Ultima Goccia, versione 4

~~~text
Edit this attached illustration by completely replacing the current cylindrical tumbler with a recognizable traditional Italian grappa tasting glass. Draw one small clear stemmed tulip glass: a compact rounded bulb-shaped bowl at the bottom that narrows toward a small circular drinking rim, a short slender stem below the bowl, and one simple flat circular foot. Keep the anatomy and perspective coherent: one continuous glass, one rim, one bowl, one stem and one foot, no doubled edges or fused parts. Piera holds the short stem naturally between thumb and fingers of her raised hand and tilts the entire grappa glass toward her open mouth to drink, with the small rim at her lips and a little amber grappa flowing from the rim into her mouth. Repose only that hand and adjust the wrist minimally as needed for the new stem grip; all five fingers belong naturally to the same hand. The bowl, short stem and circular foot must all remain visibly connected and recognizable, even while tilted. Remove the old tumbler completely. Preserve Piera's recognizable face, drowsy expression, head angle, body and seated pose, all-black clothes, bun and corrected short horizontal pencil, her other hand, the anonymous patron, counter, round backless stool, slippers, bar shelves and lamp, warm lighting, restrained palette, irregular ink contours, worn print texture and square framing. No extra hand or limb, second glass, text, border or transparency. Return one opaque square illustration.
~~~

#### Risultato — Fino all’Ultima Goccia, versione 4

Prompt preventivo nel commit `9c73e29`. Una richiesta di sostituzione del bicchiere, nessun rifiuto, rilancio o tentativo scartato. Versioni 1, 2 e 3 conservate; versione 4 in attesa. Le altre nove carte restano approvate nelle rispettive versioni già indicate.

| Campo | Valore |
|---|---|
| bindingName | `base.pino.QuestoLoFiniscoIo` |
| Versione | 4 |
| promptSha256 | `461ba011fd8e64210145eb5266898fd4ec37ac6250966a887df4b59b47b40cea` (UTF-8, LF, senza ritorno finale) |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | Unico allegato: `originali/base.pino.QuestoLoFiniscoIo-3.png`: `90539e06526916e98b6ac4866266e45c17d511bb613de5c3c8be3ac3ac1cdbcc`. Nessuna maschera o altro riferimento. |
| Prompt riscritto | non esposto; testo inviato riportato nel prompt preventivo |
| source | `originali/base.pino.QuestoLoFiniscoIo-4.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a218c6-cd70-7e12-87fc-82a14ea0ace8/exec-ad0d648c-827b-4756-9fb2-ca3bac27c8bb.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2359514 / `bd7807efa0d14844f779f35e51f27f622c11bcd5afde65e7f83a7eaa81a977d5` |
| Anteprima | [WebP](anteprime/base.pino.QuestoLoFiniscoIo-4.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta alla richiesta di sostituzione del bicchiere |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Bevuta leggibile; calice minuto con stelo e piede poco distinti; punta della matita minuta, seduta tonda senza schienale visibile. |
| Controllo oggettivo | Calice da grappa con coppa arrotondata, imboccatura stretta, stelo e piede circolare visibilmente collegati. Mano ridisegnata sullo stelo e polso adattato; bicchiere inclinato alla bocca, resto della scena mantenuto. |
| Giudizio del proprietario | In attesa. |

**Verifiche del calice:** git diff --check verde; python scripts/check-rules.py verde sul checkout corrente; controllo dei link del registro verde. Originale versione 3 invariato, versione 4 identica byte per byte al file restituito, anteprima WebP verificata a 512 x 512 px, qualità 80; controllo visivo a 60 px eseguito. Pagina verificata: dieci carte, nove ok, un giudizio in attesa e 34 riferimenti immagine validi; tutte le versioni conservate. Prompt iniziali invariati; lavoro concorrente lasciato intatto. **Non verificato:** giudizio del proprietario sulla versione 4. **Scelte prese:** calice da grappa a tulipano, stelo corto e piede, con adeguamento della sola presa. Giro terminato; nessuna decisione o chiusura del lotto.

## Chiusura del lotto 4

26 novembre 2026. Il proprietario approva Fino all’Ultima Goccia 4: «Approvo, chiudi». Con le approvazioni dei giri precedenti, tutte le dieci carte del lotto sono approvate ([D214](../../../set-base-decisioni.md#decisioni-del-proprietario)); Violenta Spruzzata di Seltz resta quella del campione (Seltz 7, D192). Versioni scelte:

| Carta | bindingName | Versione | Anteprima |
|---|---|---:|---|
| Fino all’Ultima Goccia | `base.pino.QuestoLoFiniscoIo` | 4 | [WebP](anteprime/base.pino.QuestoLoFiniscoIo-4.webp) |
| Posto Fisso | `base.pino.bound.CinqueMinutiEVado` | 2 | [WebP](anteprime/base.pino.bound.CinqueMinutiEVado-2.webp) |
| Schiarirsi le Idee | `base.pino.bound.Coccio` | 2 | [WebP](anteprime/base.pino.bound.Coccio-2.webp) |
| Ultimo Giro | `base.pino.UltimoGiro` | 2 | [WebP](anteprime/base.pino.UltimoGiro-2.webp) |
| Scompenso da Ultimo Giro | `base.pino.TestataDaUltimoGiro` | 2 | [WebP](anteprime/base.pino.TestataDaUltimoGiro-2.webp) |
| Alla Goccia | `base.pino.GoingBerserk` | 3 | [WebP](anteprime/base.pino.GoingBerserk-3.webp) |
| Avamposto Fortificato al Bancone | `base.pino.IlBanconeRegge` | 2 | [WebP](anteprime/base.pino.IlBanconeRegge-2.webp) |
| Un Altro e Arrivo | `base.pino.OffroIo` | 2 | [WebP](anteprime/base.pino.OffroIo-2.webp) |
| Rutto a Bruciapelo | `base.pino.RuttoADistanzaSociale` | 2 | [WebP](anteprime/base.pino.RuttoADistanzaSociale-2.webp) |
| Un Altro... Grappino... | `base.pino.PrimaIlBrindisi` | 3 | [WebP](anteprime/base.pino.PrimaIlBrindisi-3.webp) |

Originali scelti verificati presenti in `originali/`, fuori da git; anteprime 512×512 WebP qualità 80. Nota della regia per la passata di omogeneità (D206): sotto la luce calda i vestiti neri di Piera tendono al marrone scuro. Nessuna integrazione nell’atlante in questo lotto. Nessun comportamento di gioco o atteso modificato.


## Lotto 5 — Beppe

[Prompt letterali](lotto-05-beppe.md), commit `3dbedaa`, verificati invariati. Dieci generazioni in ordine, una per prompt, con i due allegati indicati e impronte verificate; nessun rifiuto, rilancio o tentativo scartato. Modello e riscrittura non esposti. Prompt letterali senza delimitatori né ritorno finale, SHA-256 su UTF-8 con ritorni LF. Originali copiati byte per byte fuori da git; anteprime WebP 512 × 512, qualità 80. [Pagina di giudizio](giudizio-lotto-05.html). Sandbox non inizializzabile: letture, copie e verifiche eseguite tramite escalation. I file SB-34 preesistenti restano esclusi.

### Questo Torna Utile

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.QuestoTornaUtile` |
| promptSha256 | `0afbd776f8c1c44c0927af47382164a653b0f6fa2287b5dbfe09a68d39616e54` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.QuestoTornaUtile.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-274dc69b-4f00-4585-a9c1-dc89cd67bc5a.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2919372 / `68ce3e95ee1f3339bd0d59a728248edcd0e7e48f1aeebe9090e1c1c166038116` |
| Anteprima | [WebP](anteprime/base.gigi.QuestoTornaUtile.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 1, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Beppe e sedia rotta leggibili; pezzo di legno distinto. Braccia separate, dita e tasche troppo minute; nessun attrezzo in tasca distinguibile. |
| Anomalie visive | Nessuna evidente alla vista grande. |
| Giudizio del proprietario | In attesa. |

### Cuffie e Testa Bassa

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.UnaStrettaEPassa` |
| promptSha256 | `7454e1e6b1808e945ef168b8dc7f05ef99d346e7e7f05e1f93e8cb9f93707181` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.UnaStrettaEPassa.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-0390102d-8301-48fd-ab2f-f32792de1813.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2876286 / `5991df13b70782e94dbd4bc282b3ca92ac5da28fdf840fa51d83a0af93ab2395` |
| Anteprima | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 2, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Sagoma e pugni avversari leggibili; mani e arti separati, dita minute; tasche poco distinguibili, nessun attrezzo visibile. |
| Anomalie visive | Avversario parzialmente fuori campo. |
| Giudizio del proprietario | In attesa. |

### Colpo col Cacciavite

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.ColpoDiCacciavite` |
| promptSha256 | `1463ab4bdfe7947486674947bc721b1fcb5829831908a657125079d1aa4b3ae8` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.ColpoDiCacciavite.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-59afb342-466f-473d-998c-42b77758e7a3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2769225 / `5369567ed45a2b028b27f5b74c87e76eeee47d4e9b35667d4226074a78e89fe0` |
| Anteprima | [WebP](anteprime/base.gigi.bound.ColpoDiCacciavite.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 3, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Beppe e avversario distinguibili; cacciavite sottile, punta e dita minute; arti parzialmente coperti, tasche senza attrezzi distinguibili. |
| Anomalie visive | L’avversario è parzialmente fuori campo; la punta del cacciavite è coperta. |
| Giudizio del proprietario | In attesa. |

### Affilare gli Utensili

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.Lima` |
| promptSha256 | `ad370796f7bdb25309d77fa521e69b2e0db1af1ec95f5b14bdf5f06b42ac08b5` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.Lima.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-298a46f5-aacf-4fad-b725-6685e4062307.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3136621 / `66ef3e515df48fca29820307034a6f209421e8bdd66c4a7191ee36541517bb77` |
| Anteprima | [WebP](anteprime/base.gigi.bound.Lima.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 4, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Lima e chiave distinguibili come aste; estremità e impugnature minute, braccia separate; tasche non leggibili. |
| Anomalie visive | La chiave ha una estremità ad anello e una aperta; scintille visibili. |
| Giudizio del proprietario | In attesa. |

### Disassemblare

| Campo | Valore |
|---|---|
| bindingName | `bruiser.BreakYourToy` |
| promptSha256 | `6ab4bb1d08abc29cd5c7d190c68165591321bb0fcc3efe5c4de3db3de6e3e5ff` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/bruiser.BreakYourToy.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-7a528594-c9ae-4a3c-a361-a22a3f6ca588.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2878144 / `c854f269cf7a323b6f0d1c1d2a455d5506f42830603b08cee82dafc6fd8c5b0a` |
| Anteprima | [WebP](anteprime/bruiser.BreakYourToy.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 5, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Shaker e pezzi sul tavolo distinguibili; mano avversaria e braccia visibili, dita minute; tasche senza attrezzi distinguibili. |
| Anomalie visive | Il pezzo tenuto è separato dal corpo dello shaker. |
| Giudizio del proprietario | In attesa. |

### Chiave da Tredici

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ChiaveDaTredici` |
| promptSha256 | `d017f3c6bae4f7055b2225ea1a763091a274eb3d3744ceab21c63ad4c4f26843` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ChiaveDaTredici.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-ec93f7ce-8875-49bf-86c3-600c1330fce7.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2907129 / `70e09051edcd1216c73c4450b53bf0f90b9534f806a7c5c0ca1daa7b55a1b777` |
| Anteprima | [WebP](anteprime/base.gigi.ChiaveDaTredici.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 6, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Colpo e chiave leggibili; punta e mani minute, braccia sollevate separate; avversario parzialmente coperto, tasche senza attrezzi distinguibili. |
| Anomalie visive | La punta della chiave tocca la giacca; seconda mano dell’avversario coperta. |
| Giudizio del proprietario | In attesa. |

### Preparare il Lavoro

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ColpoDiChiaveInglese` |
| promptSha256 | `6e1d8bfa8b48bfc3a95c7d14733e258039e94a8606d9b0c059c404f15f01704b` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ColpoDiChiaveInglese.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-961b21b1-c772-4249-a29f-581fdef33cc0.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3054045 / `a0ce1142cbbe62bbb9515a3d2142ffec410ab748fda6959150f3a69bf5ea9c18` |
| Anteprima | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 7, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Calibro e due figure leggibili; ganasce e dita minute, braccia distinguibili; tasche senza attrezzi visibili. |
| Anomalie visive | L’avversario ha il volto parzialmente visibile; forma delle ganasce da giudicare alla vista grande. |
| Giudizio del proprietario | In attesa. |

### Secondo Bagagliaio

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.SottoIlCofano` |
| promptSha256 | `606e6ba3a3113c244cb26b06b0709faa1a30fdfb7d70d4b73728f65068247fc1` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.SottoIlCofano.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-90c9055e-7c93-497e-9b90-73efea5967bc.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3077467 / `8a5ac9b9b078925a977001a479cb3287803f9b29485d29f844f1593925777389` |
| Anteprima | [WebP](anteprime/base.gigi.SottoIlCofano.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 8, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Cofano e Beppe leggibili; asta nella mano visibile, forma e funzione minute; arti in parte coperti, tasche non verificabili. |
| Anomalie visive | Beppe impugna un’asta non richiesta; cofano e vano motore occupano gran parte della scena. |
| Giudizio del proprietario | In attesa. |

### Lavoro Fatto Bene

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.LavoroFattoBene` |
| promptSha256 | `7c2890945dadf65fafe0908febab27a2ad9d6f837adb9111bbd0cbf53106f9a2` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.LavoroFattoBene.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-ae00e95c-2957-4c6d-a183-c608996457a3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 3025136 / `8730031b3cbe85447b07131dfa6a6ec00f92a8d448bb2b7097b4dd9e03eb053a` |
| Anteprima | [WebP](anteprime/base.gigi.LavoroFattoBene.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 9, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Pugno e avversario leggibili; attrezzi sul tavolo minuti e forme non tutte distinguibili; arti separati, dita e tasche minute. |
| Anomalie visive | I cinque attrezzi sono sul tavolo; l’avversario è parzialmente fuori campo. |
| Giudizio del proprietario | In attesa. |

### Metodo Empirico

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.UnaStrettaDiProva` |
| promptSha256 | `04e26413ad320b9998fd1c3ed87dd2cadd243691aabdeaa80636f59f83fae479` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati effettivi | 1. `docs/design/set-base/identikit/riferimenti/beppe.png`: `238b9f7aba48483a9e572ca12d130ebcf8e1e9faa26b8b5761619fd1943b2d67`; 2. `docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`: `00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.UnaStrettaDiProva.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-22ae7c07-f2a7-4610-b5fa-3fe15f7cd40c.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2982108 / `5465399271f579454f4140f61418d630846ce79c4b9b5cfa44954d1d6c77cb11` |
| Anteprima | [WebP](anteprime/base.gigi.UnaStrettaDiProva.webp), 512 px, qualità 80 |
| Associazione | certa: unica risposta al prompt 10, nessuna selezione tra varianti |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Tavolo inclinato e chiave visibili; estremità e dita minute, braccia distinguibili; tasche non verificabili. |
| Anomalie visive | La mano di Beppe dietro la gamba del tavolo è parzialmente coperta. |
| Giudizio del proprietario | In attesa. |


### Correzione con maschera — Cuffie e Testa Bassa — 26 novembre 2026

Richiesta letterale del proprietario:

> Remove the area marked in the second image from the first image

Il primo allegato segnalato dalla chat non era leggibile per il prefisso Windows `/C:/`. La stessa immagine è conservata in `originali/base.gigi.bound.UnaStrettaEPassa.png`, SHA-256 `5991df13b70782e94dbd4bc282b3ca92ac5da28fdf840fa51d83a0af93ab2395`. La maschera allegata, senza percorso o impronta esposti, segna in bianco il pugno e il braccio superiore dell’avversario. Un solo ritocco locale, versione 2, mantenendo la versione precedente; nessuna decisione o chiusura del lotto. Si inviano soltanto la maschera e l’originale da correggere, caricati come immagini recenti, nell’ordine maschera e originale.

#### Prompt preventivo — Cuffie e Testa Bassa, versione 2

~~~text
Image 1 is the owner's black-and-white mask: white marks the only area to edit and black protects the rest. Image 2 is the illustration to edit. Remove the upper punching fist and its exposed forearm in the white region, including the connected sleeve portion where marked. Reconstruct the dark bar background and the natural edge of the opponent's clothing where needed, with no detached limb or replacement hand. Preserve everything outside the white area as closely as possible, especially Beppe, his headphones and both arms, the opponent's lower punching arm, the figures, bar furniture, lighting, colours, hand-inked comic style, print texture and square framing. Add no objects, text, border or transparency. Return one opaque square illustration.
~~~

#### Risultato — Cuffie e Testa Bassa, versione 2

Prompt preventivo nel commit `1401ee5`; una richiesta con maschera e originale, nessun rilancio o rifiuto. La maschera è stata usata come immagine guida, non come parametro separato. Originale copiato byte per byte; versione 1 conservata.

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.UnaStrettaEPassa` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegati | maschera della chat, impronta non esposta; originale versione 1 SHA-256 `5991df13b70782e94dbd4bc282b3ca92ac5da28fdf840fa51d83a0af93ab2395` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.UnaStrettaEPassa-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-80ef340f-d6f9-4aff-8595-2db354c706be.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2825673 / `9e9a45cde407af5204d99705cf9e772aa51e76012bdb5157cf1ba0d40f3a8c1c` |
| Anteprima | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa-2.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Beppe e pugno inferiore leggibili; braccia separate, dita minute, tasche poco distinguibili; nessun attrezzo visibile. |
| Anomalie visive | Il pugno e avambraccio superiori sono rimossi; restano i segni bianchi d’impatto sulla spalla. Braccio inferiore conservato; l’altro braccio dell’avversario non è visibile. |
| Giudizio del proprietario | In attesa. |


### Giudizio del proprietario e correzioni — 26 novembre 2026

> questo torna utile: ok
> cuffie e testa bassa: l'uomo che colpisce beppe è ancora strano: facciamo gli gli spacca una sedia sulla schiena e beppe non se ne accorge minimamente
> colpo col cacciavite: non si vede il cacciavite, ma solo il manico. facciamolo vedere nella sua interezza stretto nel pugno di beppe. benissimo il resto dell'immagine
> affilare gli utensili: le estremità della chiave sono strane
> disassemblare: perfetto
> chiave da tredici: più che una chiave da tredici questa è una chiave da centotrenta! è troppo grande
> preparare il lavoro: il calibro è strano vicino alle mani di beppe
> secondo bagagliaio: va bene
> lavoro fatto bene: ok
> metodo empirico: va bene

Cinque richieste, una per carta, con il solo originale della versione da correggere. Versioni precedenti conservate; nessuna decisione o chiusura del lotto. I cinque prompt seguenti sono preventivi.

#### Prompt preventivo — Cuffie e Testa Bassa, versione 3

~~~text
Edit only the supplied illustration. Replace the awkward attacking man and his action with an anonymous shadowy opponent smashing a wooden bar chair against Beppe's back: show the chair breaking on impact, with a coherent chair, visible fragments and a physically clear grip. Beppe does not notice at all: keep him impassive with headphones on, head lowered, sturdy stance and both hands naturally placed. Preserve Beppe's face, beard, bun, overalls, tattoo and the existing bar, warm subdued lighting, hand-inked comic style, palette, texture and square framing as closely as possible. Keep anatomy clear, with two arms and hands per person, and no tools in Beppe's pockets. No text, border, blood or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Colpo col Cacciavite, versione 2

~~~text
Edit only the supplied illustration. Keep the rest of the image as close to the original as possible. Change Beppe's tool and gripping hand locally so that the entire single screwdriver is clearly visible, naturally clenched in his fist: a recognizable handle and one continuous straight metal shaft with a visible tip, unobscured by the opponent or hand. Preserve the rest of the action, both figures, their faces and bodies, clothing, background, lighting, colour, ink texture and square framing. Keep arms and hands anatomically coherent and Beppe's pockets free of tools. No text, border, blood or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Affilare gli Utensili, versione 2

~~~text
Edit only the supplied illustration. Correct the two ends of the single spanner Beppe holds: make it one coherent, realistically proportioned metal combination spanner with a recognizable open jaw at one end and a single closed ring at the other, cleanly joined to one shaft. Keep the file and both natural grips clear. Preserve the rest of the scene, Beppe's face and body, his posture and clothes, background, lighting, colour, hand-inked texture and square framing as closely as possible. Keep hands and arms coherent and no tools in his pockets. No text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Chiave da Tredici, versione 2

~~~text
Edit only the supplied illustration. Replace the oversized spanner with one realistically sized 13 mm combination spanner, roughly hand-length rather than a huge wrench. It has one closed ring end and one open end ground to a point, a single straight shaft, and is gripped naturally as Beppe strikes the opponent's padded shoulder. Preserve the action, the two figures, their faces and clothing, bar background, lighting, restrained palette, hand-inked texture and square framing as closely as possible. Keep hands and arms coherent, no tools in Beppe's pockets, no visible wound, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Preparare il Lavoro, versione 2

~~~text
Edit only the supplied illustration. Correct the sliding caliper and Beppe's hands locally: draw one physically plausible metal caliper with one straight continuous beam, one fixed jaw and one sliding jaw, plain unmarked scales, and the two jaws closing on the opponent's nose. Both hands grip or adjust the tool naturally, without merged fingers or extra parts. Preserve the figures, action, faces, clothes, bar background, lighting, restrained palette, hand-inked texture and square framing as closely as possible. Keep two arms and two hands per figure, no tools in Beppe's pockets, and no text, border, blood or transparency. Return one opaque square illustration.
~~~

#### Risultati del giro di correzioni

Prompt preventivi nel commit `552ad6b`. Una richiesta per carta, nessun rifiuto o rilancio; originali copiati byte per byte, versioni precedenti conservate. Modello e prompt riscritto non esposti.

##### Cuffie e Testa Bassa — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.UnaStrettaEPassa` |
| promptSha256 | `18ffd000ec93e6c0bc5b3cafedfc3449a00cd4b85f006b8f04f9646f8a8de712` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.bound.UnaStrettaEPassa-2.png`, SHA-256 `9e9a45cde407af5204d99705cf9e772aa51e76012bdb5157cf1ba0d40f3a8c1c` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.UnaStrettaEPassa-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-71e9e98e-941c-4785-bc6d-832fa77a0a26.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2781609 / `89d2c5b6e3222ce3c0c33dceaa16b7890fbda6222bb22b60cf1ff1f134e45d90` |
| Anteprima | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa-3.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Sedia rotta e impatto distinguibili; mani e frammenti minuti; nessun attrezzo in tasca distinguibile. |
| Anomalie visive | Avversario con cappuccio; Beppe appare impassibile. La sedia spezzata ha elementi sovrapposti. |
| Giudizio del proprietario | In attesa. |

##### Colpo col Cacciavite — versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.ColpoDiCacciavite` |
| promptSha256 | `f6f980e1550de9d8540e31dff8e1c1dcee329e97b5890b5c22c7d8b22ef2e281` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.bound.ColpoDiCacciavite.png`, SHA-256 `5369567ed45a2b028b27f5b74c87e76eeee47d4e9b35667d4226074a78e89fe0` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.ColpoDiCacciavite-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-6a792411-73fb-43cd-b01c-98a56c3aaecf.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2552446 / `7ec4970756192745e9a06f090a795e9536558ce4fde895db400d6dd635a3a1fb` |
| Anteprima | [WebP](anteprime/base.gigi.bound.ColpoDiCacciavite-2.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Asta sottile visibile, punta e dita minute; braccia distinguibili, tasche non leggibili. |
| Anomalie visive | Cacciavite con manico, asta e punta visibili; la punta si sovrappone al vestito dell’avversario. |
| Giudizio del proprietario | In attesa. |

##### Affilare gli Utensili — versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.Lima` |
| promptSha256 | `8557d8a8ea1919b0dc72fd62c7628b9341f04c98eadf71655136bb355d782a14` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.bound.Lima.png`, SHA-256 `66ef3e515df48fca29820307034a6f209421e8bdd66c4a7191ee36541517bb77` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.Lima-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-45852c7c-0cc5-426a-95e4-a0c336ddcb92.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2893668 / `d90da9a17bfd4d55cfe3a4a9512628121839e807a13b4e96fdbb9ba9275b10db` |
| Anteprima | [WebP](anteprime/base.gigi.bound.Lima-2.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Lima e chiave leggibili; estremità e dita minute, braccia separate; tasche non verificabili. |
| Anomalie visive | Chiave con anello chiuso e bocca aperta; lima impugnata e scintille conservate. |
| Giudizio del proprietario | In attesa. |

##### Chiave da Tredici — versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ChiaveDaTredici` |
| promptSha256 | `3a476f68c38e25b7bc9bd1284198543b76bead7a1031cdf871437ebbe1089899` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ChiaveDaTredici.png`, SHA-256 `70e09051edcd1216c73c4450b53bf0f90b9534f806a7c5c0ca1daa7b55a1b777` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ChiaveDaTredici-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-1f4d3bb4-eeed-4b97-abeb-e31afdc8f323.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2672234 / `26d329fcf916f422b12720244e1b80b8d08ab8ca3e10b3ad53ae87608a914fd3` |
| Anteprima | [WebP](anteprime/base.gigi.ChiaveDaTredici-2.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Colpo e chiave più sottile visibili; estremità e mani minute, tasche poco distinguibili. |
| Anomalie visive | Chiave ridotta ma ancora lunga rispetto alla mano; il braccio superiore termina presso la mano sovrapposta e il raccordo è ambiguo. |
| Giudizio del proprietario | In attesa. |

##### Preparare il Lavoro — versione 2

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ColpoDiChiaveInglese` |
| promptSha256 | `34f81c41a6b197572d95917509b5a85794e01b4115c7e6837e5c4c03ea0d5591` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ColpoDiChiaveInglese.png`, SHA-256 `a0ce1142cbbe62bbb9515a3d2142ffec410ab748fda6959150f3a69bf5ea9c18` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ColpoDiChiaveInglese-2.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-ef076d9f-40cb-4ece-ad65-3823ffe628a3.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2712762 / `fd19d8ae477dd7d962040fafd46c222f822f4209d12909336d45eaa323307257` |
| Anteprima | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese-2.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Figure e asta del calibro leggibili; ganasce e dita minute, nessun attrezzo in tasca distinguibile. |
| Anomalie visive | Calibro ridisegnato; una ganascia sembra sotto il naso e il contatto con entrambe le ganasce non è chiaro. |
| Giudizio del proprietario | In attesa. |


### Nuovo giudizio del proprietario e correzioni — 26 novembre 2026

> cuffie e testa bassa: va bene il cappuccio, però l'azione di dargli la sedia nella schiena non è chiara per via della presa che ha l'avventore sulla sedia stessa. inoltre la gamba è troppo lunga
> cacciavite: va bene
> affilare gli utensili: va bene
> chiave da tredici non va bene per niente, è sparita una mano di beppe e la chiave è troppo lunga
> preparare il lavoro non va bene, cambiamo il calibro con una riga metrica

Tre richieste, una per carta, con il solo originale della versione precedente; tutte le versioni restano conservate. Il cappuccio è accettato dal proprietario. Nessuna decisione o chiusura del lotto.

#### Prompt preventivo — Cuffie e Testa Bassa, versione 4

~~~text
Edit only the supplied illustration. Make the chair strike on Beppe's back immediately clear: the hooded patron grips the wooden chair firmly and naturally by its two shorter legs with both hands and swings it into Beppe's back, where the chair breaks on contact. Draw one coherent chair with proportionate legs, clear hand placement and distinct fragments; no excessively long leg. Keep the patron hooded and anonymous. Beppe remains completely oblivious, wearing headphones, with his posture, face, beard, bun, clothes and both hands retained. Preserve the bar, warm restrained colours, lighting, hand-inked texture and square framing as closely as possible. Two coherent arms and hands per figure; no tools in Beppe's pockets, no blood, lettering, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Chiave da Tredici, versione 3

~~~text
Edit only the supplied illustration. Restore both of Beppe's hands with clear, continuous arms: both hands naturally grip one short 13 mm combination spanner together above his head as he strikes the opponent's padded shoulder. Make the spanner realistically small, about one hand long, not a long wrench; show a single coherent shaft, one closed ring end and one open end ground to a point. The two hands must be distinct and connected to their own arms, without missing, fused or extra limbs. Preserve the two figures, action, faces, clothing, bar, warm restrained lighting, hand-inked texture and square framing as closely as possible. No tools in pockets, visible wounds, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Preparare il Lavoro, versione 3

~~~text
Edit only the supplied illustration. Replace the caliper completely with one straight, flat metal metric ruler of realistic hand-held proportions. Beppe holds the ruler naturally against the side of the shadowy opponent's nose as if measuring it, while the opponent recoils; show a single ruler with small simple metric tick marks, no numerals or letters, and no caliper jaws or sliding parts. Both of Beppe's hands and arms are coherent and naturally positioned. Preserve the figures, faces, clothing, bar, warm restrained lighting, hand-inked texture and square framing as closely as possible. No tools in Beppe's pockets, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Risultati del nuovo giro

Prompt preventivi nel commit `05d0e19`. Una richiesta per carta, nessun rifiuto o rilancio; originali copiati byte per byte, versioni precedenti conservate. Modello e prompt riscritto non esposti.

##### Cuffie e Testa Bassa — versione 4

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.UnaStrettaEPassa` |
| promptSha256 | `76ff830ef72976fe0dd15d4d69b8dcb60ae15a4f5e6b1fca4470aba46422ca3f` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.bound.UnaStrettaEPassa-3.png`, SHA-256 `89d2c5b6e3222ce3c0c33dceaa16b7890fbda6222bb22b60cf1ff1f134e45d90` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.UnaStrettaEPassa-4.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-fc5e2cfa-e8c0-4054-9a18-97874e8f8c5a.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2689139 / `b6b38a774f4d77cea3b6b620538236c5b094df9fa1bcceee1ce948a07386121c` |
| Anteprima | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa-4.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Sedia e impatto leggibili; le due prese e i frammenti sono minuti; arti distinguibili, tasche non verificabili. |
| Anomalie visive | Due mani afferrano due elementi paralleli della sedia, spezzata sulla schiena; le gambe si sovrappongono alla seduta. |
| Giudizio del proprietario | In attesa. |

##### Chiave da Tredici — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ChiaveDaTredici` |
| promptSha256 | `be6ee7eacf57c8177f58832aeb13736685fcd9d2cdf855d14825615f28113798` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ChiaveDaTredici-2.png`, SHA-256 `26d329fcf916f422b12720244e1b80b8d08ab8ca3e10b3ad53ae87608a914fd3` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ChiaveDaTredici-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-931ad25a-45b4-40fc-8594-0a665809339b.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2536639 / `6e5e821f13f09df108e97822513c3fb36c4871288858a2b2ca78202f4cf303ef` |
| Anteprima | [WebP](anteprime/base.gigi.ChiaveDaTredici-3.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Colpo e due braccia leggibili; mani e chiave minute, tasche non distinguibili. |
| Anomalie visive | Due mani visibili; chiave ancora lunga e asta parzialmente nascosta dietro il braccio: continuità non verificabile. |
| Giudizio del proprietario | In attesa. |

##### Preparare il Lavoro — versione 3

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ColpoDiChiaveInglese` |
| promptSha256 | `9b94d1575c402a2438c2bfd0bfbea076f381a23ffa06d4aac59b035a0b551633` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ColpoDiChiaveInglese-2.png`, SHA-256 `fd19d8ae477dd7d962040fafd46c222f822f4209d12909336d45eaa323307257` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ColpoDiChiaveInglese-3.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-2b6ec589-c30a-4dfa-b37c-6eb0985655f0.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2606358 / `c838b179b455041d126da8f00fa1eb52fbad7383e9ca3aa9e4c83ae28d02ac6b` |
| Anteprima | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese-3.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Riga e figure leggibili; tacche e dita minute, braccia distinguibili; tasche non verificabili. |
| Anomalie visive | Calibro sostituito da riga rettilinea con tacche, poggiata sul naso; mani visibili. |
| Giudizio del proprietario | In attesa. |


### Ulteriore giudizio del proprietario e correzioni — 26 novembre 2026

> cuffie: le mani vanno bene, ma la sedia no, è strana. facciamogliela afferrare per lo schieale
> chiave da tredici proprio non ci siamo, cambiamo completamente scena: un primo piano di beppe che stringa la chiave fra i denti mentre tira una testata
> preparare il lavoro bene la riga, ma beppe la deve stringere in modo più naturale e con l'altra mano deve tenere fermo per la testa l'avventore

Il proprietario autorizza a generare mentre SB-34 lavora: «genera lo stesso le immagini, lasciamo sb34 a fare la sua cosa». La verifica delle regole è sospesa: `docs/design/set-base/sb-34/tabella.json` risulta eliminata nell'indice del lavoro concorrente. Tre richieste con il solo originale della versione precedente; nessuna chiusura o decisione del lotto.

#### Prompt preventivo — Cuffie e Testa Bassa, versione 5

~~~text
Edit only the supplied illustration. The hooded patron smashes one coherent wooden bar chair against Beppe's back, gripping the chair by its backrest with both hands. Show clearly how both hands grasp the backrest, with two coherent arms connected to the patron; make the chair's backrest, seat and short proportionate legs physically plausible and clearly connected except for fragments breaking at the impact. Keep the hood, Beppe's oblivious expression, headphones, face, body, clothing and pose. Preserve the bar, warm restrained lighting, colours, inked comic style, texture and square framing as closely as possible. No tools in Beppe's pockets, extra limbs, blood, text, borders or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Chiave da Tredici, versione 4

~~~text
Create a new composition by editing the supplied illustration, keeping the same Beppe, his face, beard, hair bun, black shirt and tobacco overalls, the same dive bar and the hand-inked comic style and restrained warm palette. Show a close-up of Beppe delivering a forceful headbutt to a generic shadowy opponent. Beppe clenches one short, realistically proportioned 13 mm metal combination spanner firmly between his teeth; the whole wrench is visible, with one open end and one ring end connected by a single shaft. The headbutt and contact must be clear, with no blood or visible wounds. Show coherent anatomy, no extra limbs or tools in pockets, no recognizable opponent's face, text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Preparare il Lavoro, versione 4

~~~text
Edit only the supplied illustration. Beppe holds the single straight metric ruler in one hand with a natural, anatomically coherent grip, placing it against the side of the opponent's nose to measure it. With his other hand Beppe firmly holds the opponent's head still; both hands are distinct and connected to their own arms. The ruler is one flat straight object with fine unnumbered tick marks and no caliper jaws or sliding parts. Preserve the faces, figures, clothing, bar, warm restrained lighting, hand-inked texture and square framing as closely as possible. No extra limbs, tools in Beppe's pockets, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Risultati dell’ulteriore giro

Prompt preventivi nel commit `2bfd197`. Una richiesta per carta, nessun rifiuto o rilancio; originali copiati byte per byte, versioni precedenti conservate. Modello e prompt riscritto non esposti.

##### Cuffie e Testa Bassa — versione 5

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.UnaStrettaEPassa` |
| promptSha256 | `6964b831878c4e1964a0fbcc507020311a1b0b6c8d6adb54ef1975eb4e90cd90` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.bound.UnaStrettaEPassa-4.png`, SHA-256 `b6b38a774f4d77cea3b6b620538236c5b094df9fa1bcceee1ce948a07386121c` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.UnaStrettaEPassa-5.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-a505d9eb-807d-496d-99b9-4e9b4dce490f.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2715626 / `a848ecb7ab5aa4f681f08ec0b07253c4d4681e4de9d2ba41ee88fe1a861878cd` |
| Anteprima | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa-5.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Sedia e impatto visibili; mani e giunti minuti, arti distinguibili; tasche non verificabili. |
| Anomalie visive | Il cliente afferra lo schienale con entrambe le mani; seduta e gambe sono visibili, con frammenti all’impatto. |
| Giudizio del proprietario | In attesa. |

##### Chiave da Tredici — versione 4

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ChiaveDaTredici` |
| promptSha256 | `260f8520fbc1688031e5275dde41d779d3b530c4163a907e3d104ffcb581765f` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ChiaveDaTredici-3.png`, SHA-256 `6e5e821f13f09df108e97822513c3fb36c4871288858a2b2ca78202f4cf303ef` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ChiaveDaTredici-4.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-73de32fb-7cd2-4d7f-b1b7-26a01790a2c6.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2991731 / `5e9ca9a1f2ea49c313c31a7dd742efaf7a56af05d353a36043894b8aaeb3a817` |
| Anteprima | [WebP](anteprime/base.gigi.ChiaveDaTredici-4.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Testata e chiave fra i denti leggibili; estremità e dita minute; tasche fuori campo. |
| Anomalie visive | Nuovo primo piano; chiave intera fra i denti, una mano afferra la spalla dell’avversario. |
| Giudizio del proprietario | In attesa. |

##### Preparare il Lavoro — versione 4

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ColpoDiChiaveInglese` |
| promptSha256 | `5461a949387166fc5fba33a968513851fe88ae8138a453649ecedcc389d250e1` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ColpoDiChiaveInglese-3.png`, SHA-256 `c838b179b455041d126da8f00fa1eb52fbad7383e9ca3aa9e4c83ae28d02ac6b` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ColpoDiChiaveInglese-4.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-1008e59a-c27f-46bd-89c2-edd6e77461ea.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2476235 / `0fd29109560e093bda7a84b945d784f0a5068c5dc8be127be51c763b6db966c6` |
| Anteprima | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese-4.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Riga e presa sulla testa visibili; dita e tacche minute; arti distinguibili, tasche non verificabili. |
| Anomalie visive | Una mano tiene la riga, l’altra la testa dell’avversario; il viso dell’avversario è parzialmente visibile. |
| Giudizio del proprietario | In attesa. |


### Nuovo giudizio e correzioni del proprietario — 26 novembre 2026

> cuffie: la sedia proprio non viene, cambiamo del tutto avventore e strumento. facciamone un altro che spacca addosso a beppe una spranga di legno
>
> chiave: meglio, ma beppe è troppo grosso e la sua mano sinistra è sbagliata, non si dovrebbe vedere. inoltre l'avventore è fatto strano
>
> preparare il lavoro: molto meglio, ma la riga non mi convince. facciamola più grande e mettiamoci anche una livella al centro

Tre richieste, una per carta, con il solo originale della versione precedente; tutte le versioni restano conservate. Generazione autorizzata dal proprietario mentre SB-34 lavora; verifica delle regole da ripetere quando il file SB-34 sarà disponibile. Nessuna chiusura o decisione del lotto.

#### Prompt preventivo — Cuffie e Testa Bassa, versione 6

~~~text
Edit only the supplied illustration. Completely replace the patron and chair with a different anonymous shadowy bar patron smashing a single thick wooden bar across Beppe's back; the wooden bar breaks at the point of impact, with a clear grip, a coherent bar and a few splinters. No chair remains in the scene. Give the new patron believable proportions and exactly two natural arms and hands. Beppe remains entirely oblivious with his headphones on; preserve his face, beard, bun, clothes, body and posture. Keep the bar setting, warm restrained palette, lighting, hand-inked comic style, texture and square framing as closely as possible. No tools in Beppe's pockets, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Chiave da Tredici, versione 5

~~~text
Edit only the supplied illustration. Keep the close-up headbutt and the small combination spanner clenched between Beppe's teeth, but make Beppe's body and head naturally proportioned to the other adult, reducing his exaggerated bulk. Replace the awkward opponent with one believable anonymous shadowy bar patron of normal adult proportions, clearly receiving the headbutt. Remove Beppe's visible left hand and arm from the composition; that arm is naturally outside the crop or hidden behind his body, with no stump or extra limb. Keep any remaining visible arm and hand anatomically coherent. Preserve Beppe's face, beard, hair bun, black shirt, overalls, bar setting, warm restrained lighting, hand-inked texture and square framing. No blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Preparare il Lavoro, versione 5

~~~text
Edit only the supplied illustration. Enlarge the single flat straight metric ruler Beppe holds against the side of the opponent's nose, and integrate a small clearly visible spirit-level bubble vial at the centre of that same ruler. The ruler and level form one physically plausible measuring tool, with fine unnumbered tick marks. Keep Beppe's natural one-handed grip and his other hand holding the opponent's head still, with two distinct hands attached to coherent arms. Preserve both figures, faces, clothes, bar, warm restrained lighting, hand-inked texture and square framing as closely as possible. No additional tools in pockets, caliper jaws, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Risultati del giro

Prompt preventivi nel commit `e6ab854`. Una richiesta per carta, nessun rifiuto o rilancio; originali copiati byte per byte, versioni precedenti conservate. Modello e prompt riscritto non esposti.

##### Cuffie e Testa Bassa — versione 6

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.bound.UnaStrettaEPassa` |
| promptSha256 | `4da6afb97d9b4816d0513db320ef1dec8f33a27fd73adde3beb63c934a886417` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.bound.UnaStrettaEPassa-5.png`, SHA-256 `a848ecb7ab5aa4f681f08ec0b07253c4d4681e4de9d2ba41ee88fe1a861878cd` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.bound.UnaStrettaEPassa-6.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-ff15c290-e058-40fd-8cb7-e65f098a00ee.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2696491 / `1f08811225ea97d52e339b67dc8cf3fda4b37da939ba6f0a442ec09e277c233c` |
| Anteprima | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa-6.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Spranga e colpo leggibili; mani e frammenti minuti, arti distinguibili; tasche non verificabili. |
| Anomalie visive | Avventore incappucciato impugna la spranga con due mani; impatto e schegge visibili. |
| Giudizio del proprietario | In attesa. |

##### Chiave da Tredici — versione 5

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ChiaveDaTredici` |
| promptSha256 | `68037bfe96a4636ba404165fc8bd931a98788c7247928d4c5e574a2cd900030f` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ChiaveDaTredici-4.png`, SHA-256 `5e9ca9a1f2ea49c313c31a7dd742efaf7a56af05d353a36043894b8aaeb3a817` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ChiaveDaTredici-5.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-958ee600-afc0-41ff-87f3-8d980881a11c.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2711282 / `f3f190fea5825ee447eb43140904bb1109078fab26891d0a7086ac09b3b0e488` |
| Anteprima | [WebP](anteprime/base.gigi.ChiaveDaTredici-5.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Testata e chiave fra i denti leggibili; dita minute, tasche fuori campo. |
| Anomalie visive | Beppe meno ingombrante; una mano visibile, l’altra fuori scena. Il profilo dell’avventore è in ombra. |
| Giudizio del proprietario | In attesa. |

##### Preparare il Lavoro — versione 5

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ColpoDiChiaveInglese` |
| promptSha256 | `c2591defc874575fc24924b9711846cebf880c7d82f189172bd01cf6f746122e` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ColpoDiChiaveInglese-4.png`, SHA-256 `0fd29109560e093bda7a84b945d784f0a5068c5dc8be127be51c763b6db966c6` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ColpoDiChiaveInglese-5.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-3fabcf9f-b9c9-4433-86e1-1e3c1a363277.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2477311 / `c8a2cc7f81479ef6fff38afe25daf6f593a9d64e2117c34f264ebac0e7178776` |
| Anteprima | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese-5.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Riga e presa sulla testa leggibili; livella e dita minute, arti distinguibili; tasche non verificabili. |
| Anomalie visive | Riga più larga con livella centrale, una mano la impugna e l’altra tiene la testa. |
| Giudizio del proprietario | In attesa. |


### Nuovo giudizio del proprietario — 26 novembre 2026

> cuffie: ok ce lo facciamo andare bene
>
> chiave: non ci siamo, cambiamo completamente scena. facciamo beppe che tira un pugno violento con la chiave stretta nel pugno
>
> preparare il lavoro: ancora non mi piace, manteniamo la scena così ma togliamo la riga e facciamo che la mano libera di beppe si tocca la barba, pensieroso

Due richieste, una per carta, con il solo originale della versione precedente. Versioni precedenti conservate; generazione autorizzata mentre SB-34 lavora, verifica delle regole da ripetere quando disponibile. Nessuna decisione o chiusura del lotto.

#### Prompt preventivo — Chiave da Tredici, versione 6

~~~text
Create a completely new action composition by editing the supplied illustration, keeping the same Beppe: same recognizable face, long thick beard, hair bun, black shirt and tobacco work overalls. In the same dive bar, Beppe delivers a violent straight punch to an anonymous shadowy opponent, with one small realistically proportioned 13 mm combination spanner clenched tightly in his punching fist. Show the punch, fist, impact and wrench clearly: a single coherent short metal spanner with one open end and one ring end, naturally gripped, no doubled or fused parts. The opponent reacts to the blow, with no visible wound or blood. Believable adult proportions and coherent anatomy, with no extra limbs or tools in pockets. Preserve the hand-inked European comic style, warm restrained palette, texture and square framing. No text, border or transparency. Return one opaque square illustration.
~~~

#### Prompt preventivo — Preparare il Lavoro, versione 6

~~~text
Edit only the supplied illustration. Preserve the existing scene and composition: Beppe's one hand continues holding the opponent still by the head. Completely remove the ruler and its spirit level. Beppe touches and strokes his own beard thoughtfully with his now-free other hand, looking pensive as he considers the opponent. Make both hands natural, distinct and connected to their respective arms, without extra limbs. Preserve both figures, faces, clothing, bar, warm restrained lighting, hand-inked comic texture and square framing as closely as possible. No measuring tool, tools in Beppe's pockets, blood, text, border or transparency. Return one opaque square illustration.
~~~

#### Risultati del giro

Prompt preventivi nel commit `7612c6d`. Una richiesta per carta, nessun rifiuto o rilancio; originali copiati byte per byte, versioni precedenti conservate. Modello e prompt riscritto non esposti.

##### Chiave da Tredici — versione 6

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ChiaveDaTredici` |
| promptSha256 | `eeeefee375b104c93589f97d5937cbe67547ac6153dfa6da13f06fc877ca8b12` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ChiaveDaTredici-5.png`, SHA-256 `f3f190fea5825ee447eb43140904bb1109078fab26891d0a7086ac09b3b0e488` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ChiaveDaTredici-6.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-49692825-1ffd-4041-ab37-411e2a57714a.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2859363 / `d32df4e39ebfe6a8314210ebcc4aecf87040051d3a7b91e97f5d400323248151` |
| Anteprima | [WebP](anteprime/base.gigi.ChiaveDaTredici-6.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Pugno e impatto leggibili; chiave e dita minute, tasche non verificabili. |
| Anomalie visive | Chiave con due estremità sporgenti dal pugno; volto dell’avventore visibile e parzialmente tagliato dal bordo. |
| Giudizio del proprietario | In attesa. |

##### Preparare il Lavoro — versione 6

| Campo | Valore |
|---|---|
| bindingName | `base.gigi.ColpoDiChiaveInglese` |
| promptSha256 | `e60220b3d8b27a0a196457637de82fac96028534a685813e027e4e46beb5730d` |
| tool / model / date | `image_gen.imagegen` / non esposto / 2026-11-26 |
| Allegato unico | `originali/base.gigi.ColpoDiChiaveInglese-5.png`, SHA-256 `c8a2cc7f81479ef6fff38afe25daf6f593a9d64e2117c34f264ebac0e7178776` |
| Prompt riscritto | non esposto |
| source | `originali/base.gigi.ColpoDiChiaveInglese-6.png` |
| File restituito | `C:/Users/gesucca/.codex/generated_images/01a2190c-8df2-7400-b71c-b829418a881e/exec-055fa9e0-a4aa-4e21-8dec-4f5ea7a31b4e.png` |
| sourceWidth / sourceHeight | 1254 / 1254 px |
| sourceBytes / sourceSha256 | 2473859 / `eab44835cc1a4236f550626fbe8866e943094ce54b8b6105b85711c8a0ae64dd` |
| Anteprima | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese-6.webp), 512 px, qualità 80 |
| Associazione | unica risposta al prompt preventivo |
| Tentativi scartati | Nessuno. |
| Controllo a 60 px | Beppe tocca la barba e tiene la testa dell’avventore; dita minute, arti distinguibili, tasche non verificabili. |
| Anomalie visive | Riga e livella assenti; una mano sulla barba e una sulla testa dell’avventore. |
| Giudizio del proprietario | In attesa. |

## Chiusura del lotto 5

26 novembre 2026. Il proprietario approva Chiave da Tredici 6 e Preparare il Lavoro 6: «Approvo, chiudi». Con le approvazioni dei giri precedenti, tutte le dieci carte di Beppe sono approvate ([D218](../../../set-base-decisioni.md#decisioni-del-proprietario)). Versioni scelte:

| Carta | bindingName | Versione | Anteprima |
|---|---|---:|---|
| Questo Torna Utile | `base.gigi.QuestoTornaUtile` | 1 | [WebP](anteprime/base.gigi.QuestoTornaUtile.webp) |
| Cuffie e Testa Bassa | `base.gigi.bound.UnaStrettaEPassa` | 6 | [WebP](anteprime/base.gigi.bound.UnaStrettaEPassa-6.webp) |
| Colpo col Cacciavite | `base.gigi.bound.ColpoDiCacciavite` | 2 | [WebP](anteprime/base.gigi.bound.ColpoDiCacciavite-2.webp) |
| Affilare gli Utensili | `base.gigi.bound.Lima` | 2 | [WebP](anteprime/base.gigi.bound.Lima-2.webp) |
| Disassemblare | `bruiser.BreakYourToy` | 1 | [WebP](anteprime/bruiser.BreakYourToy.webp) |
| Chiave da Tredici | `base.gigi.ChiaveDaTredici` | 6 | [WebP](anteprime/base.gigi.ChiaveDaTredici-6.webp) |
| Preparare il Lavoro | `base.gigi.ColpoDiChiaveInglese` | 6 | [WebP](anteprime/base.gigi.ColpoDiChiaveInglese-6.webp) |
| Secondo Bagagliaio | `base.gigi.SottoIlCofano` | 1 | [WebP](anteprime/base.gigi.SottoIlCofano.webp) |
| Lavoro Fatto Bene | `base.gigi.LavoroFattoBene` | 1 | [WebP](anteprime/base.gigi.LavoroFattoBene.webp) |
| Metodo Empirico | `base.gigi.UnaStrettaDiProva` | 1 | [WebP](anteprime/base.gigi.UnaStrettaDiProva.webp) |

Originali scelti verificati presenti in `originali/`, fuori da git; anteprime 512×512 WebP qualità 80. `python scripts/check-rules.py`, sospeso nei giri durante SB-34, è verde alla chiusura. Eccezioni accettate in D218 (3): volto visibile dell’avventore in Chiave da Tredici 6 e Preparare il Lavoro 6. Nessuna integrazione nell’atlante in questo lotto. Nessun comportamento di gioco o atteso modificato.

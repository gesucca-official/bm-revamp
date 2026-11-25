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

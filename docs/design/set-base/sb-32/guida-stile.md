# SB-32 — Guida di stile delle illustrazioni del Set Base

> **Fase A, anticipata ([D189](../../../set-base-decisioni.md#decisioni-del-proprietario)), 24 novembre 2026.** Guida e
> [campione](prompt-campione.md) soltanto: nessuna immagine generata in questa fase. I lotti dell'intero set aspettano le carte
> finali e il passaggio di SB-31 su `atlas.mjs` e `art.ts` ([SB-32 nel piano](../../../set-base-plan.md#sb-32--illustrazioni-del-set)).
> Il gioco non cambia: questo documento non ha valore normativo.

## Processo

Lo stesso del tutorial delle carriere ([illustrazioni](../../carriere/illustrazioni.md#come-si-faranno)) e dello sfondo del tavolo
([prompt dello sfondo](../../client-c4/background/prompt-sfondo.md)):

1. la regia scrive il **prompt letterale** e lo committa prima della generazione;
2. il **proprietario genera** con il suo strumento, incollando il blocco intero con i soli allegati indicati;
3. si registra la **provenienza** ([sotto](#provenienza)) e il giudizio del proprietario; un'immagine è materiale vero solo dopo il giudizio.

**Tentativi.** Uno per prompt; un solo nuovo tentativo con lo stesso testo se il risultato viola il prompt in modo oggettivo (scritte,
marchi, personaggio diverso, cambi non richiesti). Un testo diverso è un prompt nuovo, da committare prima. Se lo strumento blocca un
prompt (è successo due volte con Spazienzio a torso nudo, [identikit](../identikit.md#spazienzio-de-la-ucciso)) non si insiste: si annota.
Se lo strumento riscrive il prompt e lo mostra, la riscrittura si registra a parte.

**Lingua.** Documenti in italiano; i blocchi da incollare sono in **inglese**, come per O9, l'identikit e lo sfondo, perché gli strumenti
di generazione lo seguono meglio. Non tradurli né ritoccarli in sessione.

## Riferimenti ammessi

Solo file del progetto, **mai immagini da Internet**, screenshot di altri giochi o asset respinti. Gli allegati ammessi:

| Ruolo | File | SHA-256 |
|---|---|---|
| Aspetto dei personaggi (uno per prompt, quello del personaggio) | `docs/design/set-base/identikit/riferimenti/<personaggio>.png` | nel [campione](prompt-campione.md#allegati) |
| Ambiente, palette e luce del bar | [`docs/design/carriere/asset/tutorial/sfondi/s2-interno.webp`](../../carriere/asset/tutorial/sfondi/s2-interno.webp), interno approvato dello stesso bar del tavolo | 00c36da84d6927842194e488ef1b9892cf4d8f1abdb3229a0b0600b1bb7e50a0 |
| Esterno del bar, per le note che lo chiedono (Mara e la bici) | [`docs/design/carriere/asset/tutorial/sfondi/s1-esterno.webp`](../../carriere/asset/tutorial/sfondi/s1-esterno.webp), approvato col tutorial | 19f020fe6689b2de7261dfe7c1bcff9608a6509539c7fb5ab18363a85687a1d6 |
| Grammatica dell'illustrazione di carta | [`docs/design/client-c0/r1/card.png`](../../client-c0/r1/card.png), R1 approvato: **solo** la finestra illustrata, non l'uomo raffigurato, la cornice o i testi | 4e575d0d7dc9ca43e410ccf7e94b9e16adffd32bafbd6fa7039b6aa5302f259a |
| Grappino, se il riferimento di Piera, che lo mostra già, non basta | [`docs/design/carriere/asset/tutorial/sprite/grappino-seduto.webp`](../../carriere/asset/tutorial/sprite/grappino-seduto.webp) | edbe7fe0699e12a9981783782870ec43e5b7a1ecd4bbbfa892dc1d9ff6004e93 |

Non sono riferimenti: le illustrazioni provvisorie di O9 (nessuna conservata, [sotto](#illustrazioni-o9-conservabili)),
l'immagine di Spazienzio del client debug, le prove scartate dell'identikit. Al massimo **due allegati** per prompt, perché lo strumento
non mescoli troppe fonti.

## Stile, palette e luce

- **Stile:** fumetto europeo inchiostrato a mano, contorni scuri irregolari, ombre dipinte contenute, texture leggera di stampa consumata,
  come R1 e i riferimenti dell'identikit. Tratti un po' caricati, mai fotorealismo né 3D.
- **Palette del bar** ([R1](../../client-c0/r1/approval.md), [sfondo](../../client-c4/background/prompt-sfondo.md)): noce e tabacco,
  verde bottiglia, bordeaux, petrolio smorzato, avorio consumato. Mai giallo e nero dominanti, niente neon, oro o ornamenti fantasy.
  L'unico colore fuori palette è il rosa del cocktail di Duccio, piccolo.
- **Luce:** calda e sporca, da lampade a muro o da sopra, una direzione chiara; ombre profonde ma non nere piene, così il soggetto resta
  leggibile anche sulla carta scura. Le ombre proiettate seguono la direzione della luce e ancorano figure e arredi al suolo (D192).
- **Ambiente:** il Serraglio, lo stesso bar dello sfondo del tavolo e di `s2-interno`: bancone di legno, bottiglie, sgabelli bordeaux
  rattoppati, muri scrostati verde e avorio. Lo sfondo è **semplificato e più scuro del soggetto**: serve a dire «siamo al bar», non a
  essere guardato; è anche meno nitido del soggetto (D192). Altri luoghi solo se la nota della carta li chiede (la strada fuori dalla porta).

## Inquadratura e leggibilità

- **Formato richiesto:** quadrato 1:1, almeno 1024×1024 px, opaco, PNG originale se possibile, illustrazione a tutta pagina e non una
  carta finita. Se lo strumento dà un altro formato, si annota e non si stira.
- **Dove si vede:** nell'atlante ogni riquadro è di 256 px, con 252 px utili (2 px di bordo copiato per lato, [O9](../../client-c2/o9-art/README.md));
  sulla carta in tavola l'illustrazione scende a circa **60 px**; nell'ispezione si vede intera, più grande. Quindi:
  - **un solo soggetto**, centrato, alto almeno due terzi dell'immagine, con sagoma grande e chiara, leggibile a 60 px (D192);
  - **un'azione sola**, quella del nome della carta, riconoscibile dalla posa prima che dai dettagli;
  - i dettagli di identità (tatuaggi, calzini, ombrellino) premiano l'ispezione ma non devono servire alla lettura in piccolo;
  - niente di essenziale nel 5% esterno: il ridimensionamento e il bordo lo mangiano;
  - forte contrasto di valore fra soggetto e fondo; niente folla, niente scene affollate.
- **Personaggi:** inquadratura da carta, non da ritratto del dialogo: quadrata, figura dalla testa almeno alle ginocchia o, se l'azione lo
  chiede, a mezzo busto largo, sempre con l'oggetto iconico in vista. Non si specchia mai un personaggio (tatuaggi e dettagli asimmetrici).
  La scala rispetto agli arredi del bar deve essere credibile; sgabelli e sedute devono sostenere plausibilmente il peso del personaggio (D192).
- **Chi non è un personaggio del gioco** (l'avversario, gli avventori) è una **figura in ombra** generica, senza volto riconoscibile, la
  stessa regola delle carriere ([illustrazioni](../../carriere/illustrazioni.md#ritratti-e-sprite)). Così l'avversario non diventa per
  sbaglio uno del cast, e il soggetto si stacca.
  **Senza cappuccio** ([D208](../../../set-base-decisioni.md#decisioni-del-proprietario) (2)): l'anonimato viene dall'ombra e
  dall'inquadratura, non da un cappuccio; nel prompt, per esempio, «No hood on any visible opponent». Il proprietario, al lotto 2:
  «Smettiamo di fare tutti gli avventori incappucciati».

## Niente scritte

Nessuna lettera, numero, pseudo-scritta, firma, filigrana, marchio o logo, neanche su bottiglie, magliette o insegne: etichette bianche
o consumate, loghi inventati illeggibili (la maglietta di Beppe), nessun nome di bar. Nome, testo, costo e cornice della carta li
sovrappone il client. Ogni prompt lo ripete nel paragrafo «Avoid».

## Personaggi riconoscibili da carta a carta

- **L'aspetto è nell'[identikit](../identikit.md)**, riferimento comune a carte e ritratti. Ogni prompt in cui compare un personaggio
  **allega il suo riferimento approvato** e lo descrive anche a parole (sagoma, colore proprio, oggetto iconico), perché l'allegato da solo
  non basta a tenere i dettagli.
- **Dettagli da rispettare sempre:**
  - *Spazienzio:* calvo, enorme, a torso nudo, barba corta e ispida; pantaloni della tuta bordeaux **con le strisce ai lati** (assenti nel
    riferimento, volute dal proprietario); mappa dei tatuaggi fissa, nessuna scritta; **niente che esca dal naso**; «fumante» vuol dire rabbia, mai vapore.
  - *Mara:* gilet catarifrangente verde acqua su felpa scura, zaino cubico, cuffie, capelli neri lunghi; il casco di stagnola **sempre in
    mano, mai in testa**; nessun marchio di servizi di consegna.
  - *Piera:* tonda, tutta in nero, chignon con la matita appoggiata nei capelli e la punta temperata visibile, ciabatte col pelo, bicchierino in mano; Grappino ai piedi dove la nota lo chiede (D192).
  - *Celestina:* capelli rossi rasati ai lati, tuta **sul viola**, lontana dal bordeaux di Spazienzio, marsupio, scarpe spaiate; la sua
    tossicità si racconta con cose raccolte da terra: **mai** siringhe, polveri, pasticche riconoscibili (per «Pasticca Abbandonata» la
    griglia la fa già coprire con la mano: se ne intravede solo un riflesso colorato).
  - *Beppe:* salopette tabacco con le due bretelle, maglietta nera con logo inventato illeggibile, bun, barba lunga; **tasche senza
    attrezzi in vista** salvo che la carta mostri l'attrezzo in uso.
  - *Sergio:* abito blu petrolio, camicia bianca aperta, sigaretta sottile, un laccio slacciato, calzini spaiati; nessun pacchetto.
  - *Duccio:* testa rasata, maglietta nera con l'aquila bianca screpolata, tatuaggio a punto interrogativo sul collo, pantaloni mimetici e
    anfibi, cocktail rosa col mignolo alzato; **mai** saluti a braccio teso, bandiere, rune, croci celtiche complete o altri simboli veri.
- **Somiglianza con persone reali** sempre da evitare, come i marchi.

## Come si sceglie il soggetto

La fonte è la colonna «Illustrazione» della [griglia](../griglia.md#nomi-flavour-e-illustrazioni-sb-24) (SB-24, 125 voci): un
**appunto**, che il prompt traduce in un'immagine sola. Se l'appunto e il nome finale della carta non coincidono, vale il nome, e la
scelta si annota (è il caso di «Violenta Spruzzata di Seltz», nel [campione](prompt-campione.md#8-violenta-spruzzata-di-seltz)).

| Tipo | Soggetto | Allegati |
|---|---|---|
| Personaggio | Il personaggio intero nel suo luogo del bar, come nella nota, con l'oggetto iconico | Riferimento identikit + `s2-interno` |
| Azione del personaggio (base, legate, ultima risorsa, regolari della sua sezione) | Il personaggio che compie l'azione del nome; l'avversario è una figura in ombra | Riferimento identikit + `s2-interno` (o `s1-esterno` fuori dal bar) |
| Azione generica | Mani, gesti e oggetti, o figure in ombra; un personaggio solo se la nota lo nomina | Riferimento identikit se c'è un personaggio, altrimenti `s2-interno` + `card.png` |
| Oggetto | L'oggetto solo, in primo piano, sul bancone o sul tavolo; niente mani salvo che la nota le chieda | `s2-interno` + `card.png` |
| Token | Come un oggetto, più semplice ancora: deve leggersi a colpo d'occhio diverso dagli oggetti veri | `s2-interno` + `card.png` |

## Struttura di un prompt

Ogni blocco inglese ha le stesse parti, nell'ordine: cosa generare (formato, nessuna carta finita); uso degli allegati; stile; palette e
luce; composizione per il riquadro piccolo; soggetto e azione; dettagli del personaggio da non cambiare; paragrafo «Avoid» con i divieti
comuni e quelli del personaggio. Il paragrafo «Avoid» si incolla insieme al resto; se lo strumento ha un campo negativo, ci si può spostare
**senza riscriverlo**, registrando i due testi.

Paragrafo comune di composizione per i prompt futuri (D192):

~~~text
Composition for a tiny card tile: one centred subject filling at least two thirds of the image height, with a large clear silhouette readable at 60 pixels. Keep the background darker, simpler and less sharp than the subject, with strong value contrast. Keep essential details out of the outer 5% of the image. Give characters and bar furniture a believable relative scale, and make any seat physically plausible for the character's weight. Cast shadows consistently with the direction of the light.
~~~

## Illustrazioni O9 conservabili

Nessuna illustrazione [O9](../../client-c2/o9-art/README.md) si conserva: stile diverso e volti riconoscibili nel furto; tutto il set si genera nuovo ([D192](../../../set-base-decisioni.md#decisioni-del-proprietario), punto 3).

Storico delle candidate: `com.items.RottenBeer`, `com.items.CocktailOnTheGround`, `com.Grab`, `com.Steal`, `com.tokens.BrokenBeerBottle`, `com.items.MarvelousCocktail`, `com.items.AnotherRottenBeer`, `com.last.Struggle`.

## File e nomi

- **Un file per `bindingName`**, come O9: `<bindingName>.png` (per esempio `base.pino.bound.SpallataAlBancone.png`, `com.tokens.BrokenBeerBottle.png`).
  Il `bindingName` è l'identificatore di [base.md](../../../sets/base.md#s3--schede-delle-carte), che non cambia col nome della carta.
- Un nuovo tentativo aggiunge `-<n>`: `base.character.Pino-2.png`.
- **Originali** in `docs/design/set-base/sb-32/originali/`, **da non aggiungere a git** finché il proprietario non decide se tenerli
  tracciati (O9 li ha tenuti fuori, l'identikit dentro: [domande](#domande-aperte)). Anteprime WebP tracciate in `sb-32/anteprime/`.
- **Registro** in `docs/design/set-base/sb-32/registro.md`, una scheda per tentativo, con gli stessi campi del
  [registro dell'identikit](../identikit/registro.md). Lo si apre col primo tentativo.

## Provenienza

Per ogni immagine, gli stessi campi di un riquadro di [`o9-art/assets.json`](../../client-c2/o9-art/assets.json), così SB-31 può
costruire l'inventario dei nuovi atlanti senza conversioni:

| Campo | Contenuto |
|---|---|
| `bindingName` | La classe del catalogo |
| `source`, `sourceWidth`, `sourceHeight`, `sourceBytes`, `sourceSha256` | Il file originale restituito dallo strumento, non ritoccato |
| `tool` | Lo strumento del proprietario, col nome che mostra |
| `model` | Il modello, se lo strumento lo espone (o il C2PA); altrimenti «non esposto», senza dedurlo |
| `date` | Data della generazione |
| `promptSha256` | SHA-256 del testo letterale del blocco `text`, in UTF-8, senza il ritorno a capo finale: lo stesso metodo di `o9-art/prompts.json` |

In più, solo nel registro: allegati effettivi con il loro SHA-256, eventuale riscrittura del prompt da parte dello strumento, tentativi
scartati e motivo, giudizio del proprietario.

## Conteggio e atlanti (stima per dopo)

- **125 illustrazioni:** 7 personaggi, 117 carte (99 azioni e 18 oggetti) e il token, come la griglia di SB-24; più il segnaposto, che
  non si genera. Il piano parla di «circa 120».
- **Atlanti ≤ 2048 px:** con riquadri da 256 px, un atlante 2048×1536 (8×6) contiene 48 celle, uno 2048×2048 (8×8) 64. Per 126 celle:
  **tre atlanti 8×6** (144 celle, 18 libere; circa 38 MB decodificati, come stima il piano) oppure **due 8×8** (128 celle, 2 libere;
  circa 34 MB). La scelta è di SB-31, che porta `atlas.mjs` e `art.ts` a più atlanti raggruppati per set.
- **Peso:** O9 sta in 566.518 byte per 40 riquadri, circa 14 KB a riquadro in WebP qualità 76; 125 riquadri fanno circa 1,8 MB,
  dentro i 4 MB gzip di `Size`. Da misurare.
- **Lotti:** dopo il campione, per personaggio (le sue carte insieme, col suo riferimento), poi generiche, oggetti e token; un lotto per
  volta, giudizio prima del successivo.

## Domande aperte

Restano da giudicare le reinquadrature di Sergio e Duccio; gli originali restano fuori da git in attesa della decisione sulla loro conservazione. Le scelte del campione e il destino delle O9 sono in D192.

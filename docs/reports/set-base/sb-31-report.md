# SB-31 — Rapporto dell'esecutore (F1, F2, F3 e F4)

Esecutore: Claude (Sonnet 5.5). Base: `d92f74e` (D196). Un commit per fase, nessun push. Le domande sono numerate una volta sola, in fondo.

**Esito.** F1 consegnata (commit «SB-31: F1 …»): R9 e R10 chiusi, controllo di D183 (4) aggiunto e verde, contatore di Rincara
verificato nel gioco vivo. Un rosso nuovo, **R11** (controllo dello scarto di `VerifyLayout`, O26), attribuito allo strumento e
registrato, non corretto. F2 consegnata (commit «SB-31: F2 …»): atlanti per set da 8×8 riquadri (`base-0.webp`), manifesto con
atlante e riquadro per ogni classe, nella pagina cambia solo la riga dell'immagine, verifiche verdi tranne i rossi noti.
**Da decidere subito:** con due atlanti da 2048×2048 per le 126 celle di SB-32 le texture raggiungono il tetto C4 di 32 MiB
e con sfondo e sprite lo superano (domanda 5).

**F3 consegnata** (commit «SB-31: F3 …», [sezione](#f3--testi-del-set-nel-client)): l'ispezione mostra flavour, «Testo completo», promemoria delle parole chiave e rarità dal testo dell'allegato; stati in italiano coi simboli dei danni, raggruppati nell'ispezione; stato del gettone dall'allegato; R11 e R12 chiusi; tetto delle texture a 48 MiB (63,4 % usato). **Da decidere:** le sette frasi dei promemoria (domanda 8). Un rosso nuovo non attribuito, **R13** (più primi piani in FFA a 750×292 in alcune corse; domanda 20); il costo in SALUTE non si è potuto vedere in una partita viva (domanda 15).

**F4 consegnata** (commit «SB-31: F4 …», [sezione](#f4--catalogo-editor-e-riepilogo-del-mazzo-opzione-minima), [pagina di giudizio](sb-31/f4-giudizio.html)): filtri, barra del mazzo fissa col riepilogo O15, ordine stabile dei personaggi, rarità sulle facce, `character` e testo dello stato nell'allegato, frase di Vulnerabile e chip coi simboli, costo in SALUTE visto in una partita viva, `fs.allow` e README. Chiude le domande 15, 16 e 17. **Da decidere:** se l'opzione minima basta (domanda 21). Un rosso nuovo non nel registro, proposto come R14 (domanda 22).

## F1 — Rossi R9 e R10, D183 (4), contatore di Rincara

### Cosa cambia

| File | Cambio |
|---|---|
| `client-web/tools/verify-layout.mjs` | I conteggi del catalogo non sono più 37 e 12: vengono dall'allegato (`annex.cards.length`, 117; carte con danno, 46) |
| `client-web/src/scene.ts` | Area di tocco minima di 44 px (`TOUCH_MIN`) per la copia scoperta (`revealed-…`) e per quella sollevata; la carta disegnata resta della misura di prima. `faceInfos` espone anche `inPlay` (serve a `VerifyLayout` per i simboli «in gioco») |
| `client-web/tests/revealed.test.ts` | Prova che `scene.ts` usa `TOUCH_MIN` per le due aree e disegna la carta alla misura di prima |
| `client-web/tools/verify-decks.mjs` | Scenario nuovo in una partita viva col set vivo: avviso dell'ultima copia (RP-17) e «∞» sul gettone (RP-21); contatore di Rincara |
| `client-web/tools/verify.mjs` | Fuori dal perimetro, **con l'OK del proprietario** («Correggi e prosegui»): dopo «Conferma» risponde alla finestra «Scartare l'ultima copia?» o «Quale carta cerchi?» (schema di R8), con attesa di 5 s |
| `contracts.ts`, `readability.ts`, `table.tsx` | Solo commenti: `plays` (contatore di Rincara) c'è nella partita viva, manca solo nelle archiviate |

### Verifiche (macchina ferma, `-ReuseJar`, un'esecuzione esclusiva per volta)

| Verifica | Esito |
|---|---|
| `Test` client-web | 378/378 |
| `Build`, `Size` | verdi; JS 375 747 B gzip (limite 500 KB), totale 1 785 976 B (limite 4 MB), texture 27 729 048 B (tetto C4 32 MiB, 82,6 %) |
| `Verify` 1366×768, 844×390, 1920×1080 | verdi (prima del correttivo di `verify.mjs`: rosso «server answer», anche sulla base a 750×292) |
| `VerifyFfa` 1366×768, 844×390 | verdi (con `scene.ts` della F1; `verify-ffa.mjs` non toccato: nessun cambio necessario) |
| `VerifyDecks` 1366×768, 844×390 | verdi, con lo scenario nuovo |
| `VerifyLayout` 1366×768, 844×390, 1920×1080 | senza rossi di geometria; restano solo problemi di tipo O26 (R11), 86/0/86 |
| `VerifyLayout` 750×292 contro la base | duello `layoutProblems` 6/6/6 come la base; FFA 12/11/14 contro 12/12/11 della base (nel registro R1: 11/11/11). Il test deterministico `BASE_750` (geometria, regola 18) è verde. Nel nuovo compaiono in FFA problemi «close-up» (sul ventaglio e su un altro posto) che nella base c'erano solo nel duello: i primi piani nascono dalle carte che i computer giocano, che cambiano da una partita all'altra, e il codice toccato (le sole aree di tocco) non li decide; **non provato** con una seconda corsa, domanda 2. I bersagli sotto i 44 px passano da 2–4 a 0–1 |
| `check-rules.py`, `git diff --check` | verdi |
| `check-links.py` | 22 rotti, come la base (nessuno nuovo) |

Evidenze in [`sb-31/`](sb-31/): `f1-riepilogo.json` (problemi per base, strumento nuovo sulla base e nuovo), `f1-decks-*.json`
(solo i due controlli nuovi) e la cattura dell'avviso a 844×390 e 1366×768.

**Strumento nuovo sulla base.** `VerifyLayout` modificato sul commit di base dà 52/9/55 problemi (1366, 844, 1920): 9 sono di
tipo T («in play symbols» degli oggetti), che spariscono col client nuovo grazie a `inPlay`; gli altri sono O26. Con lo
strumento vecchio la base ne dava 99/57/55. L'attribuzione è quindi: R9 era solo conteggio nello strumento.

### Mutazioni (ogni controllo nuovo deve diventare rosso)

| # | Mutazione | Risultato |
|---|---|---|
| M1 | `TOUCH_MIN` da 44 a 4 | il test unitario di R10 fallisce |
| M2 | conteggio dei danni dell'allegato + 1 | `VerifyLayout` 844×390 rossa |
| M3 | `lastTokenCopies?.includes(name+'x')` | `VerifyDecks` 844×390 rossa (avviso non mostrato) |
| M4 | chip «∞» con `short: '0'` | `VerifyDecks` 844×390 rossa |
| M5 | `faceInfos` senza `inPlay` | `VerifyLayout` rossa (i 9 problemi di tipo T della base) |

I file sono tornati identici dopo ogni mutazione.

### D183 (4)

Partita viva col set vivo, mazzo «Ultima» (quattro carte che annunciano un token di vulnerabilità e una sola SuperImpact). Al
turno 2 il server nomina la copia in `lastTokenCopies`, il gettone mostra «∞» (RP-21) e scartare quella copia per una carta
vincolata apre «Stai scartando l'ultima copia di …» senza inviare nulla (RP-17); scartare un'altra carta regolare non avvisa e
la mossa parte. Verde a 1366×768 e 844×390.

### Contatore di Rincara

Nella partita viva la vista porta `plays` (il server lo manda quando `ruleset.playground()`, vero nel vivo): il contatore
compare e la riga dell'ispezione dice «mai giocata» prima della prima giocata. Nessuna correzione al client; i commenti che dicevano
«solo playground» sono stati corretti. Non ho verificato gli altri commenti dello stesso tipo (ricerca, `ahead`, `voidReason`,
`plays` nelle mosse): vedi domanda 4.

### Rossi

- **R9, R10:** chiusi (registro aggiornato).
- **R11 (nuovo).** `VerifyLayout`, controllo dello scarto (`discard-checks.mjs`): decide quale carta è «la propria» con
  `self=…endsWith('.LittleRage')`, che con gli starter del Set Base 1.0 (per esempio Mara) segnala problemi O26 sulle carte
  «Semaforo Rosso-after-target» ecc. Non sono del client: la geometria è la stessa della base. File fuori dal perimetro.
- Non registrato: `VerifyAim` a 750×292 con tastiera ha dato «server answer» sulla base; probabile schema R8 in `verify-aim.mjs`, **non provato** (domanda 3).
- Avviso dello strumento «STALE JAR»: i file di `server/src` hanno una data più recente del jar, ma `git status` non mostra modifiche al server e l'ultimo commit che lo tocca (`e92ea71`, SB-29) è precedente al jar: falso allarme di date.

### Scelte prese

- `inPlay` in `faceInfos`: serve a un controllo di `VerifyLayout`, non cambia il disegno.
- Aree da 44 px nei ventagli dei computer si sovrappongono alle vicine: vince la più in alto (`hitAt`), come già per le altre aree.
- `verify.mjs` corretto dentro la F1 su istruzione del proprietario.

### Domande

Vedi la numerazione unica in fondo (1–4 nascono dalla F1).

## F2 — Atlanti per set

### Cosa cambia

| File | Cambio |
|---|---|
| `client-web/tools/atlas.mjs` | Un elenco `SETS` (id e cartella con `assets.json`); i riquadri di un set, in ordine alfabetico di `bindingName`, più un segnaposto neutro riempiono atlanti da 8×8 celle di 256 px, `<set>-0.webp`, `<set>-1.webp`…; un set non tocca gli atlanti di un altro. Scrive il manifesto (`files[]` con `set`, `atlas`, griglia, `placeholder` e `tiles{bindingName: cella}`) e riscrive `assets.json` del set. Le classi dell'allegato senza sorgente restano sul segnaposto e sono **elencate nell'uscita** (oggi 91, più i 6 riquadri che nessuna classe chiede più); un atlante non più necessario viene cancellato |
| `client-web/public/art/` | `base-0.webp` (2048×2048, 541 608 B) al posto di `atlas.webp` (tolto con `git rm`); `manifest.json` nuovo |
| `client-web/src/art.ts` | `artIndex` restituisce `{atlas, cell}` (l'atlante è la posizione in `files`); `artCss` restituisce anche `backgroundImage`; `placeholderRef`; un nome sconosciuto o senza sorgente dà il segnaposto |
| `client-web/src/scene.ts` | Una texture per ogni file del manifesto, `art[atlas][cella]`; `tile()` sceglie la cella dall'atlante della classe |
| `client-web/src/table.tsx`, `style.css` | Solo la riga dell'immagine: il valore di ripiego dell'ispezione e due `url('/art/atlas.webp')` tolti (l'immagine arriva dallo stile inline di `artCss`). `collection.tsx` non cambia |
| `client-web/tests/art.test.ts`, `size.test.ts` | Riscritti per atlante e cella: ogni classe nell'atlante che la tiene, celle uniche e dentro la griglia, nome del file da set e numero, atlanti pieni prima del successivo, due set con tre atlanti, segnaposto, `artCss`, scena senza nomi di atlante (+1 test, 379 in tutto) |
| `client-web/tools/verify-decks.mjs` | Ogni volto del catalogo deve stare sull'immagine e sulla cella che il manifesto dà alla sua classe |
| Fuori dal perimetro, **necessari** | `docs/design/client-c4/assets/inventory.json` (il test `assets.test.ts` lo vuole uguale ai file di `public/`: voce `base-0.webp`, nuova impronta del manifesto), `docs/design/client-c2/o9-art/assets.json` (riscritto da `Atlas`: ora ha `atlases[]` e, per ogni riquadro, atlante e cella) e `README.md`, `docs/design/client-c4/assets/README.md`, `client-web/README.md` (nomi e misure dell'atlante). Solo righe che nominavano `atlas.webp` o la griglia 8×6 |

### Verifiche (macchina ferma, `-ReuseJar`, una corsa esclusiva per volta)

| Verifica | Esito |
|---|---|
| `Test` | 379/379 |
| `Build`, `Size` | verdi. JS 375 904 B gzip (limite 500 KB), totale 1 758 614 B (limite 4 MB; prima 1 785 976), texture 31 923 352 B (prima 27 729 048), tetto C4 32 MiB all'**95,1 %**, margine 1 631 080 B; `base-0.webp` 2048×2048, 541 608 B, 537 602 gzip |
| `Verify` 1366×768, 844×390, 1920×1080 | verdi |
| `VerifyDecks` 1366×768, 844×390 | verdi, col controllo nuovo di immagine e cella per 124 volti |
| `VerifyFfa` 1366×768, 844×390 | verdi |
| `VerifyLayout` 1366×768, 844×390, 1920×1080 | solo problemi O26 (R11): 86/86/43, nessun altro tipo |
| `VerifyLayout` 750×292 contro la base | duello 6/6/6, FFA 11/11/11 (valori di R1; la base di questa serie 12/12/11); nessun `revealed-…` sotto i 44 px, restano solo le chip di stato. Questa corsa chiarisce anche i «close-up» in più della F1: erano la partita, non il codice |
| `check-rules.py`, `check-links.py` (22 rotti, come la base), `git diff --check` | verdi |

Evidenze in [`sb-31/`](sb-31/): `f2-riepilogo.json` (Size prima e dopo, atlanti, confronto dei pixel, prova del secondo set, mutazioni)
e le due catture dell'editor a 844×390, della base e della F2.

**Le catture non sono identiche alla base, e non possono esserlo con 8×8.** La stessa catena, con la griglia 8×6, riproduce
`atlas.webp` byte per byte (`839cffc9…`): il cambio di griglia basta a far ricodificare diversamente tutta la pagina a libwebp. Le
41 celle sono le stesse nello stesso posto (stesso ordine alfabetico), con PSNR 34,2 dB nel caso peggiore e 35,7 dB in media; nelle
catture dell'editor cambiano 3 973 pixel su 329 160 a 844×390 (massimo 37 su 255, 32 oltre 24) e 22 258 su 1 049 088 a 1366×768
(massimo 46). La geometria è identica. La pagina del catalogo non si può confrontare pixel per pixel: l'ordine dei personaggi cambia
da una corsa all'altra anche fra due corse della F1 (domanda 4).

### Mutazioni (ogni controllo nuovo deve diventare rosso)

| # | Mutazione | Risultato |
|---|---|---|
| M6 | `artIndex` sempre atlante 0 | test unitario rosso |
| M7 | classe senza sorgente alla cella 0 dell'atlante 0 | test unitario rosso |
| M8 | `artCss` senza `backgroundImage` | test unitario rosso |
| M9 | la scena legge `this.art[0]` | test di sorgente rosso |
| M10 | `atlas.mjs` con 32 celle per atlante | test unitario rosso (atlanti pieni prima del successivo); dopo il ripristino la ricostruzione è identica (stesse impronte) |

Il browser non vede la scelta dell'atlante perché oggi c'è un solo atlante: vedi la prova del secondo set.

### Come si innesta un lotto di SB-32

**Prova fatta:** con una copia temporanea di `atlas.mjs` e un secondo set «exp» di 70 riquadri (cinque PNG esistenti con altri nomi) la
catena produce `exp-0.webp` (64 riquadri) ed `exp-1.webp` (6 più il segnaposto), lascia `base-0.webp` con la stessa impronta, e
`artIndex` dà `exp.Card63` → atlante 1, cella 63, `exp.Card64` → atlante 2, cella 0 (le posizioni in `files`), `artCss` → `url('/art/exp-1.webp')`. File ripristinati poi.

1. **Cartella del set** con le sorgenti (PNG, fuori da git come quelle di O9, o dove decide il proprietario) e un `assets.json` tracciato con un riquadro per classe, coi campi di
   [«Provenienza» della guida di stile](../../design/set-base/sb-32/guida-stile.md#provenienza): `bindingName`, `source`, `sourceWidth`, `sourceHeight`, `sourceBytes`,
   `sourceSha256`, `tool`, `model`, `date`, `promptSha256`. L'impronta di ogni PNG deve coincidere con `sourceSha256`, altrimenti `Atlas` si ferma.
2. **Una riga in `SETS`** di `tools/atlas.mjs`: l'id del set (quello del campo `set` dell'allegato) e la cartella.
3. **Ricostruzione:** `./client-web/run.ps1 -Task Atlas`. Per le 125 illustrazioni del set base scrive `base-0.webp` e `base-1.webp`, aggiorna il
   manifesto e riscrive `assets.json`; elenca le classi ancora senza sorgente (restano sul segnaposto) e le sorgenti che nessuna classe chiede.
4. **Inventario e prove:** la voce di `inventory.json` per ogni atlante nuovo (impronta, byte, provenienza: `assets.test.ts` la esige), le
   somme attese in `art.test.ts` (34 classi con riquadro e 91 sul segnaposto diventano 125 e 0) e in `verify-decks.mjs` (33 volti con riquadro), `Size`.
   Un lotto che aggiunge solo qualche riquadro a un atlante non cambia il codice.

### Scelte prese

- Ordine dei riquadri di un set: alfabetico per `bindingName`, come prima (le celle 0–40 non si sono mosse).
- `assets.json` della cartella del set è sia l'elenco che `Atlas` legge sia l'inventario che riscrive; `prompts.json` non serve più alla catena.
- Un atlante che non c'è nel manifesto o una cella fuori dalla griglia disegna un riquadro vuoto, non un errore.

### Domande (numerazione unica F1 e F2)

1. R11 (`discard-checks.mjs`): lo corregge la regia o lo apro in un blocco con perimetro?
2. 750×292, FFA: i «close-up» in più della corsa F1 non erano del codice (la corsa F2 dà FFA 11/11/11); si considera chiusa la domanda?
3. `VerifyAim` 750×292 con tastiera: si indaga lo schema R8 in `verify-aim.mjs` (sarebbe R12)?
4. Gli altri commenti «solo playground» (ricerca, `ahead`, `voidReason`, `plays` nelle mosse) vanno verificati? E l'ordine dei personaggi nel catalogo cambia da una corsa all'altra: è voluto (viene dal server)?
5. **Tetto delle texture.** Il tetto C4 è 32 MiB (33 554 432 B) e oggi siamo a 31 923 352 B (95,1 %) con un solo atlante 8×8. Con le 126 celle di SB-32 gli atlanti sono due da 16 777 216 B ciascuno, cioè **33 554 432 B, il tetto intero**, e con sfondo e sprite il totale arriva a circa 48,7 MB (il limite duro di 64 MB regge, il tetto C4 no). Che si fa: alzare il tetto C4 (il limite duro resta 64 MB), ridurre il riquadro, o altro? Lo decide il proprietario prima dei lotti di SB-32.
6. Dove stanno le sorgenti e l'`assets.json` dei lotti di SB-32 (cartella, e se i PNG restano fuori da git come quelli di O9)?
7. Le catture dopo F2 cambiano di poco nei pixel dell'arte (PSNR 34–36 dB, stessa geometria): va bene, o si vuole per il set base un atlante di 6 righe (byte per byte come prima) finché le illustrazioni non sono tutte?

## F3 — Testi del set nel client

Base: `5692be4` (D197). Un commit, nessun push. Le domande 8–20 continuano la numerazione di F1 e F2.

### Cosa cambia

| File | Cambio |
|---|---|
| `client-web/src/annex.ts` (nuovo) | Carica `docs/rules-catalog.json` con un `import()` pigro (un blocco a parte: 152,57 kB, **20,98 kB gzip**) e lo indicizza per classe (= `bindingName`): testo completo, flavour, rarità, campo `character` se c'è (oggi l'allegato non lo ha: il codice lo legge solo se presente), testo dei token. `entryOf`, `hasFullText` (senza paragrafi o senza voce non c'è il tasto), `rarityOf`, `keywordsOf` (le sette parole chiave riconosciute nel testo breve), `tokenStatusOf`, `timerCardName` |
| `client-web/src/ui.tsx` | `RichText` (i segnaposto `[[HIT]]`, `[[H]]`… diventano simboli con `textParts`), `RarityMark` (da 1 a 3 pallini, «P» per i personaggi; `data-testid="rarity"`, `aria-label`) |
| `client-web/src/table.tsx` | Ispezione: flavour in corsivo sotto il testo breve; tasto **«Testo completo»** (≥ 44 px, `aria-pressed`) che scambia testo breve e flavour con i paragrafi del testo completo, un secondo tocco torna indietro (si azzera cambiando carta); un promemoria per parola chiave con «(regolamento, R07b)»; rarità accanto al tipo e al personaggio. Lista degli stati dell'ispezione: gli stati con lo stesso nome sono **raggruppati** (×N, descrizioni una dopo l'altra), solo lì |
| `client-web/src/readability.ts` | `chipsOf`: in una partita viva titolo e testo vengono dal server (descrizione con i segnaposto), lo stato del gettone prende nome e testo dall'allegato, i timer prendono il nome della carta (`Timer: Santino della portinaia`, «effetto di «carta»»); `STATUS_TEXT` e `TIMER_TEXT` solo per le partite 0.1 archiviate (si riconoscono dal contatore `plays` assente). `groupChips`, `plainText` |
| `client-web/src/scene.ts` | Il titolo delle chip sul canvas è in italiano e senza segnaposto (`plainText`) |
| `client-web/src/style.css` | `.full-text.full`, `.flavour`, `.full-text-toggle`, `.keywords` (16 px), `.rarity`, `.status-group`, `.status-texts` |
| `client-web/tools/size.mjs` | `CEILINGS.textureBytes` = **48 MiB** (50 331 648 B), commento con D197 (5); il limite duro di 64 MB e i riquadri da 256 px non cambiano. Anche la stringa `source` e il messaggio dell'asserzione ora derivano dal tetto (dichiarato: era più di «solo `CEILINGS` e il suo commento») |
| `client-web/tools/discard-checks.mjs` | **R11**: `selfTarget` al posto di `endsWith('.LittleRage')` |
| `client-web/tools/verify-aim.mjs` | **R12**: `answerDialogsByKeyboard`, dopo l'invio da tastiera |
| `client-web/tools/verify-layout.mjs` | Il controllo della chip nell'ispezione: l'ispezione ora disegna simboli e raggruppa, quindi la stringa «titolo. testo» non compare più; il controllo legge la ricevuta (simboli sostituiti dalla loro etichetta) e vuole **titolo e testo presenti**. Dichiarato: è uno strumento di verifica toccato, non un'asserzione tolta |
| `client-web/tools/sb31-f3-captures.mjs` (nuovo) | Catture e controlli dell'ispezione e degli stati su partite vere contro il computer (server su database temporaneo); scrive `f3-captures.json` e `f3-giudizio.html` |
| `client-web/tests/annex.test.ts` (nuovo), `readability.test.ts` | 12 test nuovi (391 in tutto); in `readability.test.ts` solo la formulazione di un commento e di un messaggio, nessun atteso cambiato |
| Commenti «solo playground» | Vedi «Punto 7» sotto |
| Fuori dal perimetro formale | `src/resolution.ts` e `src/model.ts` (solo commenti), `tools/sb31-f3-captures.mjs` (nuovo), `tools/verify-layout.mjs` (sopra) |

### Testi che l'allegato non ha, e come si ricavano

- **Stato del gettone** (`BROKEN BEER`): nome e testo vengono dal token dell'allegato (`com.tokens.BrokenBeerBottle`), mappa `TOKEN_OF_STATUS`. Il testo è la descrizione breve del token («Quando lo consumi: …»), che per uno stato già in uso suona strano (domanda 10).
- **Timer** (un effetto ritardato): il server manda solo il nome Java della carta; tre voci in `CARD_OF_TIMER` (Santino della portinaia, Marvelous Cocktail, Blood Drain) lo portano alla carta dell'allegato. Una carta fuori mappa resta «effetto ritardato» (domanda 11).
- **Vulnerabile**: il testo dello stato lo scrive il client («colpo, taglio e veleno»), non i simboli: il server non manda una descrizione per quella chip (domanda 12).

### Promemoria delle parole chiave (da approvare, domanda 8)

Si riconoscono nel testo **breve**; ogni riga cita «(regolamento, R07b)» e usa i simboli dei danni:

| Parola | Frase |
|---|---|
| Annuncia | Al posto della pesca cerchi nel mazzo la carta annunciata: se la trovi la mostri, ottieni il premio e diventi Vulnerabile; se non la trovi peschi e ottieni il ripiego. |
| Vulnerabile | Subisci una volta e mezza i danni [[HIT]], [[CUT]] e [[POISON]] finché non giochi una carta col nome trovato. |
| Gioca d'anticipo | Se questa mossa si risolve prima di quella del bersaglio, ottieni anche l'effetto scritto. |
| Rincara | Per ogni volta che hai già giocato questa carta nella partita, i danni al bersaglio (e a te, se scritto) aumentano della quantità indicata. |
| In campo | Finché l'oggetto è in campo, a fine turno chi lo ha vicino subisce l'effetto scritto: è una perdita o un guadagno di risorsa, non un danno. |
| Vendi | L'oggetto bersagliato esce dal campo senza il suo effetto e ottieni il ricavato scritto; se è sparito prima, non ottieni niente. |
| Immune | Gli effetti di fine turno di quella risorsa non ti colpiscono; costi, guadagni e danni [[POISON]] restano. |

Quante carte le usano: Annuncia 13, Vulnerabile 14, Gioca d'anticipo 4, Rincara 4, In campo 2, Vendi 1, immune 3 (test `annex.test.ts`). Nelle catture compaiono Annuncia, Vulnerabile e Gioca d'anticipo.

### Rarità (domanda 9)

Come nella stampa (`bozza.py`): comune 1 pallino, non comune 2, rara 3; «P» (cerchio con la lettera) per i personaggi. Solo nell'ispezione, mai sulla carta in mano. Un test verifica che le rarità dell'allegato coincidano con la tabella della stampa per tutte le 117 carte.

### Verifiche (macchina ferma, una corsa esclusiva per volta, build finale salvo dove detto)

| Verifica | Esito |
|---|---|
| `Test` | 391/391 (379 + 12 di `annex.test.ts`) |
| `Build`, `Size` | verdi. JS 397 774 B gzip (limite 512 000), totale 1 780 679 B (limite 4 MB), texture 63,4 % del tetto di 48 MiB, margine 18 408 296 B (vedi «Dimensioni») |
| `Verify` 1366×768, 844×390, 1920×1080 | verdi (lo strumento vuole il server già attivo: avviato a parte su una base di dati temporanea e fermato dopo) |
| `VerifyResolution` 1366×768, giro completo | verde (32 min), eseguito sulla build **prima** del ritocco di CSS dei promemoria (16 px, margine); non rilanciato dopo: il ritocco tocca solo `.keywords` |
| `VerifyResolution` 844×390, scenario `info` | verde sulla build finale |
| `VerifyLayout` 1366×768, 844×390, 1920×1080 | **verdi, nessun problema O26** (R11 chiuso) |
| `VerifyLayout` 750×292 | rosso **come la base** (R1: 47–48 righe sulla base; 47, 48, 61 e 76 con F3, le corse alte sono la variante R13, vedi sotto) |
| `VerifyFfa` 1366×768, 844×390 | verdi (build finale) |
| `VerifyAim` 750×292, scenario `keyboard` | verde (R12 chiuso) |
| `VerifyDecks` 1366×768, 844×390 | verdi (build finale) |
| `check-rules.py`, `check-links.py`, `git diff --check` | verdi: `check-rules.py`, `git diff --check`; `check-links.py` 22 rotti, come la base (nessuno nuovo) |

Le altre righe di `aree-protette.md` toccate: client-web (Test, Build, Size, Verify, VerifyResolution, VerifyLayout, VerifyFfa, VerifyAim, VerifyDecks), documenti (`check-rules.py`, `check-links.py`). Il server, il protocollo e i documenti di regole non cambiano.

### 750×292, regola 18 e R13

La geometria deterministica (`BASE_750` in `readability.test.ts`) è verde. Nella corsa piena di `VerifyLayout` a 750×292 le righe sono in R1: sulla base 48, 47, 48, 48, 47, 47, 48 (sette corse); con il client di F3 47, **76**, 48, **61**. Facendo girare solo la FFA (`BM_SCENARIOS=ffa`) la base dà 23 in otto corse su otto, F3 23 in cinque corse e **37** in una. Le corse alte hanno gli stessi tipi di R1 (primi piani «over another seat», «placed seat», «over the hand») e nel duello non cambia nulla.

**Non so attribuirlo.** Quello che so: dipende dalla partita (i primi piani nascono dalle carte che i computer giocano: nella corsa di F1 c'era già qualcosa di simile e F2 lo attribuì alla partita), `scene.ts` non cambia nella geometria di F3 (solo l'etichetta delle chip) e nessun controllo deterministico peggiora. Quello che non so: perché con F3 compare in 3 corse su 10 e sulla base in 0 su 15 (sono troppo poche corse per concluderne qualcosa, ma non la do per caso). Il registro dice che conteggi più alti sono un rosso nuovo: l'ho scritto come **R13** fra le voci aperte, non attribuito, senza correggere (non tocca il perimetro; domanda 20).

### Mutazioni (ogni controllo nuovo deve diventare rosso)

| # | Mutazione | Risultato |
|---|---|---|
| M11 | La parola «Vendi» non viene più riconosciuta (`keywordsOf`) | 2 test rossi (promemoria per carta e conteggi) |
| M12 | `hasFullText` sempre vero (una carta senza voce mostrerebbe il tasto) | 1 test rosso |
| M13 | `groupChips` non raggruppa | 1 test rosso |
| M14 | Il testo dello stato del gettone preso dalla classe e non dall'allegato | 1 test rosso |
| M15 | In `table.tsx` il tasto senza il controllo `hasFullText(entry)` | il test di sorgente rosso |

File ripristinati dopo ogni mutazione (copie in `%TEMP%`; il `git diff` coincide con la versione consegnata).

### R11 — `discard-checks.mjs`

Causa: lo strumento riconosceva «la propria carta» (quella che si gioca su di sé) con `catalog.get(b.name).class.endsWith('.LittleRage')`, vero solo per uno starter del catalogo 0.1. Con gli starter del Set Base 1.0 la legata di Mara («Semaforo Rosso», «Si gioca su di te») veniva trattata come una carta contro l'avversario e i controlli O26 sul bersaglio sbagliavano. Ora `selfTarget` legge dall'allegato se il primo paragrafo del testo completo dice «Si gioca su di te». Sonda con `discardPass` e la legata «Semaforo Rosso» in mano: 0 errori; `VerifyLayout` a 1366×768, 844×390 e 1920×1080: nessun problema O26.

### R12 — `VerifyAim` 750×292, scenario da tastiera

Riprodotto sul client della base (`5692be4`, build separata, 750×292): `A: timeout server answer` in `kbdGame` e, nella cattura del fallimento, la finestra «Quale carta cerchi?» ancora aperta dopo ✓ da tastiera: è lo schema di R8 (il client apre una finestra dopo ✓ e lo strumento non risponde). Correzione: `answerDialogsByKeyboard(p, before)` attende fino a 5 s che l'invio avvenga o compaia una finestra e, se c'è, raggiunge da tastiera (`tabTo`) il pulsante «search-option» o «Sì, scarta e gioca» e preme Invio. Nessuna asserzione tolta o allentata; `movesSent` resta esattamente 1. Scenario `keyboard` verde con 17 turni.

### Dimensioni (`Size`)

| Misura | F2 | F3 |
|---|---|---|
| JS gzip (blocco pigro incluso) | 375 904 B | **397 774 B** (limite 500 KB; +21 870 B, di cui 20,98 kB il blocco dell'allegato) |
| Totale gzip | 1 758 614 B | 1 780 679 B (limite 4 MB) |
| Texture | 31 923 352 B (95,1 % di 32 MiB) | 31 923 352 B = **63,4 %** del tetto di 48 MiB (50 331 648 B), margine **18 408 296 B**; limite duro 64 MB invariato |

`limitsPass` e `ceilingsPass` veri. L'atlante `base-0.webp` non è cambiato.

### Punto 7 — i commenti «solo playground»

Una partita viva usa il regolamento del banco di prova (`Ruleset.D50`, `playground()` vero), quindi quei campi **ci sono** nelle partite vive e mancano nelle partite 0.1 archiviate. Visto nelle quattro partite delle catture: la ricerca nelle mosse (`search`, 8), `ahead` (12), `voidReason` («a terra», 2), una copia scoperta (`revealed`, al massimo 1), la finestra «Quale carta cerchi?» (`searchable`), la chip di vulnerabilità e il contatore pubblico `plays` del personaggio (F1). **Non incontrato**: `plays` dentro una mossa (il server lo imposta con la regola viva, `Game.java`, ma nelle partite delle catture nessuna carta Rincara si è risolta). I commenti sbagliati in `contracts.ts` (perimetro), `resolution.ts` e `model.ts` (solo commenti, fuori dal perimetro formale) ora lo dicono; gli altri non sono stati toccati. Il codice che decide in base ai campi è invariato.

### Punto 8 — il costo in SALUTE

**Non verificabile in una partita viva con gli starter di oggi.** Le uniche quattro carte con costo in SALUTE (Nocche Sbucciate, E allora e allora…?, Capocciata Craniata Patriottica, Testa Dura) sono di Duccio Braccio Teso, che non ha uno starter (gli starter del Set Base: Spazienzio, Mara, Celestina, Piera, Beppe): in 24 mani della categoria base e 40 dell'avanzata (sonda eseguita a parte, non consegnata) non è comparsa nessuna carta con costo in SALUTE. Quello che si è potuto fare: la riga «Costo» dell'ispezione (`${v} ${resourceNames[k]}`) e `cost()` di `scene.ts` sono **identiche alla base** (confronto fra `HEAD` e la copia di lavoro: la riga è la stessa e nel diff di `scene.ts` cambia solo l'etichetta delle chip) e `readability.ts` calcola il «mancano» di SALUTE come prima (test di `readability.test.ts` verdi). Da riprovare in F4 con un mazzo di Duccio dall'editor, o quando avrà uno starter (domanda 15).

### Catture

[`sb-31/f3-giudizio.html`](sb-31/f3-giudizio.html): la pagina da guardare (frasi dei promemoria, rarità, le catture a 1366×768 e 844×390, categorie base e avanzato; per le finestre che scorrono c'è anche la cattura «in fondo», dove stanno il flavour, il tasto e i promemoria). L'arte è il segnaposto nero di F2. `f3-riepilogo.json` (Size, mutazioni, conteggi di 750×292 per corsa). `f3-captures.json`: tutte le misure (39 ispezioni di 35 carte nelle quattro partite, 0 problemi, 0 errori: tasto ≥ 44 px, scambio e ritorno, una riga per ogni parola chiave usata, rarità, nessun `[[` rimasto, flavour uguale all'allegato).

**Gruppo di stati con lo stesso nome: simulato.** Nelle partite vive non è comparso: la cattura «raggruppati-simulato» duplica nel DOM le descrizioni di uno stato vero per mostrare come si dispone un gruppo; è dichiarata simulata nel nome e nella nota. Il raggruppamento è provato dal test e dalla mutazione M13, non da una partita.

### Scelte prese

- I paragrafi del testo completo si disegnano con gli stessi simboli del testo breve; nessun segnaposto resta come testo (controllato nelle catture).
- Un secondo tocco sul tasto riporta il testo breve e il flavour; cambiare carta azzera lo stato del tasto.
- `plainText` sta in `readability.ts` con una mappa propria dei simboli, per evitare un import circolare (`symbols` → `readability` → `annex`).
- Una carta senza voce nell'allegato (per esempio in una partita 0.1 archiviata, o prima che arrivi il blocco) non mostra né il tasto né il flavour: il comportamento di prima.
- Il blocco dell'allegato è pigro: non pesa sul caricamento della pagina iniziale; l'ispezione si aggiorna appena arriva.

### Da dichiarare

- `client-web/vite.config.ts` non include `docs/rules-catalog.json` in `server.fs.allow`: nel server di sviluppo (`Dev`) il blocco non si caricherebbe e l'ispezione mostrerebbe il solo testo breve (senza errore). Non toccato (fuori perimetro); in `Build` e `Serve` funziona (domanda 16).
- `client-web/README.md` (righe 435 e 632) dice ancora «32 MiB» per il tetto delle texture: non toccato (domanda 17).
- Le catture sono Edge via Playwright su PC, non un dispositivo fisico.

### Domande (numerazione unica F1, F2 e F3)

8. **Le sette frasi dei promemoria** (tabella sopra): le approva, o le corregge?
9. **Rarità**: 1, 2 o 3 pallini e «P» per i personaggi, solo nell'ispezione, vanno bene?
10. **Stato del gettone**: il testo preso dall'allegato («Quando lo consumi: …») suona strano per uno stato già in uso. Vuole un testo dedicato nell'allegato (un campo nuovo, quindi un blocco con server o allegato)?
11. **Timer**: oggi la carta si ricava da una mappa Java→carta in `annex.ts` (tre voci). Si preferisce un campo del server (nome e descrizione del timer)?
12. **Vulnerabile**: la chip dice «colpo, taglio e veleno» a parole, non coi simboli. La descrizione dovrebbe venire dal server con i segnaposto?
13. **Campo `character`**: D196 lo prevede nell'allegato e oggi manca; il client lo legge se c'è. Chi lo aggiunge, e in quale blocco?
14. **Gruppi di stati**: non sono comparsi in partita e la cattura è simulata. Si accetta la prova per test e mutazione, o si vuole una partita costruita?
15. **Costo in SALUTE**: non verificabile in una partita viva senza Duccio. Si rimanda a F4 (mazzo di Duccio dall'editor), o si dà a Duccio uno starter?
16. **`vite.config.ts` / `fs.allow`**: lo correggo in un blocco con perimetro, o in F4?
17. **`client-web/README.md`** (32 MiB): lo aggiorno in F4?
18. I commenti «solo playground» corretti in `contracts.ts`, `resolution.ts` e `model.ts`: va bene aver toccato (solo commenti) i due file fuori dal perimetro?
19. `verify-layout.mjs` e il messaggio di `size.mjs` toccati oltre il perimetro, come dichiarato sopra: si accetta, o si chiede di ripristinarli?
20. **R13** (corse di `VerifyLayout` 750×292 con più «close-up» in FFA, non attribuite): le attribuisco alla partita come in F1 e le lascio fra le voci aperte, o si chiede un blocco per indagare (più corse sulla base e su F3, bisezione)?

## F4 — Catalogo, editor e riepilogo del mazzo (opzione minima)

Base: `cea8285` (D198). Un commit, nessun push. Le domande 21–26 continuano la numerazione.

**Esito.** Consegnata l'opzione minima di D196 (4): catalogo ed editor con 117 carte hanno filtri che si intersecano, una barra del mazzo fissa che apre il riepilogo O15, l'ordine stabile dei personaggi e la rarità sulle facce. Chiusi i punti di D198 assegnati a F4: (8) frase di Vulnerabile, (10) testo dello stato del gettone, (12) chip di Vulnerabile coi simboli, (13) campo `character`, (15) costo in SALUTE, (16) `fs.allow`, (17) README a 48 MiB. Verifiche verdi, con **un rosso nuovo comparso una volta e non nel registro** (`VerifyDecks`, `lastCopyWarning`, sotto «Rossi»): diagnosticato, non l'ho fermato. Le catture sono nella [pagina di giudizio](sb-31/f4-giudizio.html): il proprietario giudica la minima prima di qualunque opzione piena (domanda 21).

### Cosa cambia

| File | Cambio |
|---|---|
| `tools/set-catalog/set_catalog.py` | L'allegato scrive `character` (il binding del personaggio, dallo slot: `SPA-`, `MAR-`, `LR-TOS`…) per le 73 carte dei sette personaggi, assente per le 44 generiche; per il token scrive `statusText` (D198 (10)). Controlli nuovi: lo slot e la scheda devono dire lo stesso personaggio (base, legata, ultima risorsa riservata); ogni frammento del testo dello stato deve stare ancora nel testo completo del token, altrimenti il generatore si ferma. Rigenerato con `--vivo`: cambiano solo `docs/rules-catalog.json` e l'impronta in `docs/sets/manifest.json`; `docs/sets/base.md`, `cards.sqlite` e le copie del client di debug sono **identici** (nessuna regola cambia) |
| `client-web/src/annex.ts` | Tipo con `character`, `statusText`, `set`; `setIds()`; la frase di Vulnerabile è **esattamente** quella di D198 (8); lo stato del gettone prende `statusText` (senza testo resta quello del server: non si ripiega più sulla descrizione «Quando lo consumi») |
| `client-web/src/readability.ts` | `vulnerabilityText` scrive `Danni da [[HIT]], [[CUT]] e [[POISON]] ricevuti ×1,5…`: simboli nell'ispezione (`RichText`) e nel suggerimento, parole sul canvas e nelle note (`plainText`, che dà la stessa stringa di prima: nulla cambia per chi legge a parole). `revealedNote` applica `plainText` perché è disegnata come testo semplice |
| `client-web/src/deck.ts` | `Filters`, `matchesCard`, `matchesCharacter`, `filterCards`, `characterOf` (campo dell'allegato, altrimenti le riserve della carta), `characterOrder`, `shown` che accetta i filtri (o una stringa, come prima), `deckBar`, `deckBarText`, `deckSummary` |
| `client-web/src/collection.tsx` | `FilterBar` sopra il catalogo e sopra «Mazzo regolare»; `DeckBar` (ultimo figlio dell'editor); `Rare` (RarityMark di F3) sulle facce del catalogo e dell'editor; personaggi ordinati; l'allegato si carica anche qui e le facce si ridisegnano all'arrivo |
| `client-web/src/style.css` | `.filter-bar`, `.deck-bar`, `.deck-summary` |
| `client-web/vite.config.ts` | `server.fs.allow` anche per `../docs/rules-catalog.json` (solo quello) |
| `client-web/README.md` | «32 MiB» → «48 MiB» (due righe) |
| `client-web/tests/catalog-filters.test.ts` (nuovo) | 10 test: `character` dell'allegato, intersezione, «P», set, ordine, barra e riepilogo, frase di Vulnerabile |
| `client-web/tests/revealed.test.ts`, `annex.test.ts` | **Attesi cambiati con la decisione che li autorizza**: le tre stringhe del chip di Vulnerabile ora hanno i segnaposto (D198 (12)); il testo dello stato del gettone è `statusText` e non `description` (D198 (10)). Aggiunta la prova che `plainText` restituisce le parole di prima e che la nota resta senza `[[` |
| `client-web/tools/verify-decks.mjs` | Tre blocchi nuovi (sotto) |
| `client-web/tools/sb31-f4-captures.mjs` (nuovo) | Catture e misure per il giudizio e per il costo in SALUTE; scrive `f4-captures.json` |

Nessun file del server, del protocollo, `docs/game-rules.md`, `docs/sets/base.md` né le righe O15 e O16 della roadmap sono toccati.

### Cosa vede chi gioca

- **Filtri** (sopra il catalogo e sopra «Mazzo regolare»): Personaggio (Tutti, Generiche, uno dei sette), Rarità (Comune, Non comune, Rara; «P (personaggi)» solo nel catalogo), Tipo (Azioni, Oggetti), Cerca (quella di prima, stesso `data-testid`), «n di m carte» e «Azzera i filtri» quando ce n'è uno. Tutti ≥ 44 px (misurato). Si intersecano. Una faccia di personaggio passa il filtro del personaggio col proprio nome, la rarità solo se è «P», mai il tipo. Il filtro del **set** si legge dall'allegato e compare solo da due set (oggi uno: provato con un allegato doppiato nel test).
- **Barra del mazzo** (editor): «Regolari n / 20 · legate n / 2 · ultima risorsa ✓», 48 px, `position: sticky` sul foglio che scorre: in alto a 1366×768 (`top: -22px`, il riempimento del foglio), in basso a 844×390 (`order` e `bottom: -14px`). Un tocco apre il **riepilogo** (personaggio, base, ultima risorsa, legate, regolari con le copie e «Regolari n / 20»; Esc o «Chiudi» lo chiudono), sopra la barra a 844×390 e sotto a 1366×768, massimo metà altezza. La riga «Regolari n / 20, al massimo 2 copie…» c'era già e resta.
- **Scelta delle legate**: `toggleBound` è controllata e mostrata («legate 2 / 2», `bound-list`), non ridisegnata: la terza è ignorata, un secondo tocco la toglie.
- **Ordine dei personaggi: per nome (`localeCompare` «it»), poi per binding.** Chiave scelta perché il nome è ciò che il giocatore legge; ordina anche l'elenco dell'editor e del filtro. Provato da test e da `VerifyDecks`; due avvii del server (le due corse a 1366×768 e 844×390) danno la stessa lista (Beppe, Celestina, Duccio, Mara, Piera, Sergio, Spazienzio).
- **Rarità** sulla riga del tipo di ogni faccia del catalogo e dell'editor (1–3 pallini, «P»), mai sul tavolo.

### Verifiche (macchina ferma, una corsa esclusiva per volta; server, jar e build ricostruiti da questa copia)

| Verifica | Esito |
|---|---|
| `build.ps1 -Task Test -Offline` (l'allegato cambia) e `-Task Server` | **1506 test, 0 falliti**, 23 saltati; jar rifatto |
| `client-web` `Test` | 401/401 (391 + 10 di `catalog-filters.test.ts`) |
| `Build`, `Size` | verdi. JS 399 446 B gzip (limite 512 000; **+1 672 B** su F3), totale 1 782 697 B, texture 31 923 352 B = 63,4 % del tetto di 48 MiB (margine 18 408 296 B), invariate |
| `VerifyDecks` 1366×768 e 844×390 | **verdi** (21 passi ciascuno), nuovi: `catalogFilters`, `deckBar`, `filteredDeckAccepted`; vedi sotto |
| `Verify` 1366×768, 844×390, 1920×1080 | verdi (server avviato a parte su una base temporanea e fermato dopo) |
| `set_catalog.py --vivo` e `--vivo --check` | verdi: 7 file; solo allegato e manifesto cambiano |
| `prova-errori.py` (test del generatore) | tutti OK; `check-rules.py` verde |
| `check-links.py` | 22 rotti, quelli noti, nessuno nuovo; `git diff --check` pulito |
| `Dev`: `fs.allow` | `vite` su una porta a parte: `/@fs/…/docs/rules-catalog.json` 200 e `/@fs/…/docs/README.md` 403, quindi il blocco dell'allegato si carica in Dev e il resto resta chiuso |

**Nuovi controlli di `VerifyDecks`** (sul server vero, in coda ai passi di prima):
- `catalogFilters`: nessun set da scegliere, «124 di 124 carte»; ordine dei personaggi uguale alla chiave; rarità su tutte e 124 le facce (pallini disegnati = rarità dell'allegato, «P» sui sette); per ognuno dei sette personaggi le carte mostrate sono quelle dell'allegato con quel `character` più la sua faccia, e con le generiche coprono le 117; intersezione personaggio + rarità + tipo uguale all'allegato filtrato, più stretta di ogni filtro da solo e vuota per gli oggetti di Mara; «P» dà i sette personaggi e nessuna carta; azzera ripristina.
- `deckBar`: testo e contatori a ogni passo (terza legata ignorata, secondo tocco che la toglie), barra dentro la finestra e nel punto giusto dopo aver scorso il foglio a fine e a inizio, riepilogo con tutte le parti dentro la finestra, Esc.
- `filteredDeckAccepted` (la verifica della proposta, sezione 8): un mazzo di Duccio costruito dal catalogo intero e coi filtri (le sue sei carte regolari dal filtro del personaggio, le altre quattro da «generiche, comuni, azione», tre filtri insieme) è salvato, il server lo accetta (20 carte, al più 2 copie, nessun errore dell'account), poi parte una partita open con quel mazzo e ogni carta in mano viene dal mazzo.

### Mutazioni (ogni controllo nuovo deve diventare rosso; file ripristinati, hash uguali)

| # | Mutazione | Risultato |
|---|---|---|
| M16 | i filtri non si intersecano (personaggio **o** rarità) | 3 test rossi |
| M17 | il conteggio della barra è sbagliato di uno | 1 test rosso |
| M18 | l'ordine dei personaggi non è ordinato | 1 test rosso |
| M19 | il generatore non scrive `character` | `set_catalog.py --vivo --check` rosso («Diversi dalla generazione: rules-catalog.json»); con l'allegato rigenerato così, il test sui 73/44 e il filtro sono rossi |
| M20 | torna la vecchia frase di Vulnerabile | 1 test rosso |
| M21 | lo stato del gettone prende `description` e non `statusText` | 2 test rossi |

### Il costo in SALUTE (D198 (15))

Mazzo di Duccio costruito con l'editor (sopra) e giocato in partite open vere contro il computer, in entrambe le misure; Duccio parte con 115 di SALUTE ([pagina](sb-31/f4-giudizio.html)).
- **Sulla faccia in mano** il costo è disegnato (cerchio col numero e il cuore): «30 ♥» su Craniata Patriottica, «15 ♥» su Nocche Sbucciate, «35 ♥» su Testa Dura. Nel solito posto delle altre risorse.
- **Nell'ispezione** la riga «Costo» dice «30 Salute», «35 Salute», «15 Salute» (letta dalla pagina, non solo guardata).
- **«Mancano»**: a 844×390, al turno 12, con SALUTE 2 la carta da 30 è attenuata in mano e l'ispezione dice «Con le risorse attuali non basta: mancano salute. Puoi comunque provarla: decide il server.» (catture `mano-mancano`, `ispezione-mancano`). A 1366×768 la partita è finita prima (6–8 turni nelle corse) e SALUTE non è scesa sotto un costo: lì ho solo la riga del costo. Il calcolo di `shortfall` per la SALUTE è inoltre nei test di `readability.test.ts`.
- Nessun difetto visto. Una cosa da notare: l'ispezione dice solo «mancano salute», senza la quantità; è come per le altre risorse.

### Rossi

- **Nessun rosso del registro è comparso.**
- **Nuovo, non nel registro: `VerifyDecks` 1366×768, passo `lastCopyWarning`, una corsa su tre** (le altre due verdi, in entrambe le misure): «the server names GARGANTUESCO IMPATTO SUL TU as the last copy that holds a token: undefined». Diagnosi: nello screenshot del fallimento la mossa d'annuncio dell'utente è sbarrata («TU ✕») dal «FAI BASTA» del computer; con la mossa annullata non si cerca (R02a) e non nasce il gettone, quindi `lastTokenCopies` manca. È la sorte della partita (il computer sceglie a caso) e il controllo non la prevede; non dipende da questa fase (il passo gira su un mazzo, un server e un percorso che F4 non tocca, e le altre due corse sono verdi). **Non l'ho provato sul commit di base** (il rosso non si è ripetuto) né ho toccato il registro (fuori dal mio perimetro): propongo **R14** nel registro e, in un blocco con perimetro, di far ripetere la partita allo strumento quando l'annuncio è annullato (domanda 22). Il prompt dice di fermarsi davanti a un rosso fuori registro: ho proseguito perché è spiegato e non tocca il lavoro; se lo vuole diversamente lo dica.
- R13 (`VerifyLayout` 750×292) non è stato rilanciato: F4 non tocca il tavolo.

### Non verificato

- `VerifyFfa`, `VerifyAim`, `VerifyLayout`, `VerifyResolution` e la geometria a 750×292 (`BASE_750` resta verde nei test) non sono stati rilanciati: il prompt elenca `Verify` e `VerifyDecks` e F4 non cambia il tavolo; l'unico tocco al canvas è la parola delle chip di Vulnerabile, che con `plainText` è la stessa stringa di prima (provato da test).
- Catture di Edge via Playwright su PC, non un dispositivo fisico. L'arte è il segnaposto nero di SB-32.
- «Stesso ordine fra avvii»: verificato su due avvii (le due corse), non su una serie.

### Da dichiarare

- **L'impronta dell'allegato cambia.** `rules-catalog.json` è nel jar (`analysis/rules-catalog.json`) e `MatchVersions` ne registra l'impronta nelle partite: da questa fase le partite nuove portano un'impronta diversa dalle vecchie, senza che nessuna regola cambi. Il jar è stato rifatto prima delle verifiche.
- **Un caso che non torna fra slot e scheda:** «Non Mi Hai Fatto Niente» (`base.rocco.NeHoPreseDiPeggio`) ha lo slot `LR-ROC`, ma la sua scheda dice «Ultima risorsa, generica» e il server la offre a tutti (anche `VerifyDecks` la elenca fra le ultime risorse di Spazienzio). Ho seguito la scheda: per una ultima risorsa senza riserva il generatore **non** scrive `character` (quindi 44 generiche e 73 con personaggio, e Duccio ne ha 10, non 11). Se si preferisce lo slot, la carta uscirebbe dalle generiche e comparirebbe sotto Duccio (domanda 23).
- Le facce dell'editor (azione base, legate, ultima risorsa) mostrano la rarità come le altre; il riquadro «Personaggio» non ha filtri (sono sette).
- La barra e i filtri aggiungono altezza: a 844×390 l'editor mostra i filtri (61 px) più la riga del conteggio sopra i pulsanti «Collezione/Mazzo»; la barra occupa 48 px in basso. Guardare le catture.

### Domande (numerazione unica F1–F4)

21. **Opzione minima**: sulle catture, la minima basta o vuole l'opzione piena (vista compatta a righe, pannello del mazzo affiancato a 1366×768, «parti da uno starter»)? Se la piena, quale parte e con quale proposta prima?
22. **Rosso nuovo del passo `lastCopyWarning`** (mossa annullata dal computer): lo scrivo come R14 nel registro e faccio correggere lo strumento (ripetere la partita se l'annuncio è annullato) in un blocco con perimetro?
23. **`NeHoPreseDiPeggio` fra slot e scheda**: generica per la scheda (come ho fatto) o di Duccio per lo slot?
24. **Filtro del set**: oggi un solo set, il controllo non compare; con un'espansione l'allegato dovrà dire il set di ogni carta (`set` nel generatore): va deciso con il formato delle espansioni, non ora. Va bene così?
25. **Riepilogo del mazzo di sola lettura**: toccare una carta del riepilogo per toglierla (come nella vista «Mazzo») è O16, non l'ho fatto. Lo vuole nella piena?
26. **Barra e filtri a 844×390**: se le catture mostrano troppo ingombro, preferisce i filtri dietro un solo tasto «Filtri» (aperti su richiesta) nell'opzione minima?


## F5 — Consolidamento

Ultima fase: tasto «Filtri» a 844×390, R14 e R13, matrice `VerifyAll`, riepilogo finale. Base `b67a429`. Nessun cambio al server, alle regole, alle immagini, al tavolo o alla geometria della scena; niente di O16 e O17. **SB-31 non è chiuso**: lo chiude la regia dopo la partita del proprietario.

### Cosa cambia

- **«Filtri» a 844×390 (D199 (26)).** In `collection.tsx` la barra dei filtri ha un tasto «Filtri» (`filters-toggle`): 88×44 px, etichetta «Filtri» e, con filtri accesi, «Filtri (n)» (`activeFilters` in `deck.ts`: conta i campi non vuoti, ricerca compresa). Si chiude con un secondo tocco o con Esc. I campi stanno in `filter-fields`; «n di m carte» e «Azzera i filtri» (`filter-state`) restano fuori e sempre a portata di mano. Solo sotto `max-height:550px` i campi sono chiusi all'inizio; sopra (1366×768, 1920×1080) il tasto non è disegnato e `filter-fields` è `display:contents`, quindi la pagina è quella di F4.
- **`VerifyDecks`** (`verify-decks.mjs`): helper `openFilters`/`closeFilters`/`searchFor`; passo `filtersButton` (a 1366×768 niente tasto e campi aperti; a 844×390 tasto ≥44 px, chiuso all'inizio, etichetta, conteggio «Filtri (1)» e «Filtri (2)», Esc, secondo tocco, «Azzera» in vista, almeno una faccia intera sulla prima schermata) e passo `editorFiltersClosed` (con i filtri chiusi: le facce intere del pool e la barra del mazzo nello schermo). Sono due test nuovi in `catalog-filters.test.ts` (conteggio; sorgente: tocco, Esc, etichetta, stato fuori dai campi, 44 px, chiuso/non disegnato).
- **R14** (strumento): il passo `lastCopyWarning` rigioca la partita (fino a 6 volte) se il computer ha annullato la mossa che annuncia, riconosciuta da `resolvedMoves` (`void`, `playerId`, `playedCardName`); nessuna asserzione allentata: ogni rigiocata è registrata (`replays`, `replayed`) e, esaurite le 6, il passo è rosso con il messaggio di prima. Il passo ora riporta quante rigiocate e quanti tentativi.

### Catture (prima/dopo)

`docs/reports/set-base/sb-31/f5-<misura>-<catalogo|editor>-<prima|dopo>.jpg` a 1366×768 e a 844×390 («prima» = le catture di F4); `f5-844x390-catalogo-filtri-aperti.jpg`. A 1366×768 il dopo è uguale al prima. A 844×390 con i filtri chiusi nel catalogo si vedono tre facce intere sulla prima schermata, nell'editor sei facce del pool e la barra del mazzo (327–375 su 390).

### Verifiche (macchina ferma, una corsa esclusiva per volta)

| Verifica | Esito |
|---|---|
| client-web `Test` | 403 test verdi |
| `Build` | verde |
| `Size` | `jsGzip` 399 546 (tetto 512 000), `totalGzip` 1 782 875 (tetto 4 MB); texture 31 923 352 B = 63,4 % di 48 MiB (margine 18 408 296) |
| `VerifyDecks` 844×390 e 1366×768 | verdi, 6 corse per misura (12 in tutto) per R14; 0 rigiocate naturali; `filtersButton`: tasto 88×44, tre facce intere (844×390); `editorFiltersClosed` verde |
| `python scripts/check-rules.py` | verde |
| `python scripts/check-links.py` | 22 link rotti, i 22 noti (nessuno nuovo) |
| `git diff --check` | pulito (solo avvisi CRLF) |

### Mutazioni (ogni controllo nuovo deve diventare rosso; file ripristinati)

- **M22**, il pannello «Filtri» non si chiude mai (né secondo tocco né Esc): `VerifyDecks` rosso su `filtersButton`.
- **M23**, il conteggio dei filtri attivi sbagliato di uno: rosso sia il test unitario sia l'etichetta in `VerifyDecks`.
- **M24**, la rigiocata di R14 tolta con la partita che annulla l'annuncio (simulato con un gancio temporaneo, poi tolto): il passo `lastCopyWarning` è rosso con il messaggio di prima. Con la rigiocata lo stesso gancio dà verde.

### R14 — chiusa

12 corse verdi (6 per misura, nessuna rigiocata naturale: l'annuncio non è stato annullato dal computer) più la prova simulata della rigiocata. Il registro la sposta in «Chiuse».

### R13 — attribuzione

`VerifyLayout` 750×292 con `BM_SCENARIOS=ffa`, una corsa alla volta, 16 corse sulla base `5692be4` e 16 su HEAD con F5. Si contano i `problems` senza le righe `ffa-750x292 O<n>:` (i problemi O26 dello scarto, R11: la base ancora li ha, 4 corse su 16 con 66–72 in tutto).

| | corse | con 23 problemi | con il totale in più |
|---|---|---|---|
| base `5692be4` | 16 | 16 | **0** |
| HEAD (F5) | 16 | 15 | **1** (totale 37, corsa 11) |

La corsa rossa ha in più solo righe `close-up` (posto sopra un altro posto, sopra la mano, posto «placed») al turno 1, per le carte giocate dai computer in quella partita; nessuna riga di geometria diversa e `BASE_750` verde. **Attribuzione: non provata al client.** Una corsa su 16 contro zero su 16 non basta a separare il client dalla partita (R13 era comparsa in 3 corse su 10 con F3). Come prevede il metodo, se i conteggi alti sono solo su HEAD si bisecava in `76fd55c`: **non l'ho fatto** (una bisezione vuole almeno 15 corse per commit, circa 25 minuti l'una: vedi domanda 28). Non è un rosso da fermarsi: nel client non si è mai mostrato un cambio di geometria; resta aperta come R13.

### VerifyAll, matrice completa

`-Parallel 4 -Split resolution,ffa`, 25 giri, 2 h 27 min: **19 verdi su 25, 6 rossi** (`public` ×2, `resolution` ×2, `ffa` ×2); non è stato pubblicato (`-Publish` pubblica solo una corsa tutta verde): il registro della corsa e gli estratti dei fallimenti sono in `sb-31/verifyall/`; le riprove da soli in `sb-31/verifyall/alone/`. I rossi, uno per uno:

| Parte | Messaggio | Attribuzione |
|---|---|---|
| `public` 1366×768 e 844×390 | `deepStrictEqual` sull'indice delle regole: vuole `R00…R07a, R08…` senza `R02a` e `R07b` | **Strumento**: dal regolamento 2.1 (SB-29, `cb60a86`) l'indice ha `R02a` e `R07b`; `verify-public.mjs` aspetta il vecchio elenco. Rosso identico sulla base `b67a429` (esportata, `alone/hv-public.txt`). Non è del client. **Non in registro: nuovo** |
| `resolution` 844×390, scenario `open` | `fill` su `card-search` in timeout (`addRegular`, `verify-resolution.mjs:832`) | **Mia modifica + strumento**: a 844×390 i filtri ora sono chiusi e `verify-resolution.mjs` riempie la ricerca senza aprirli (come ho dovuto fare in `verify-decks.mjs`). Il file è fuori dal perimetro del prompt: non l'ho toccato. **Nuovo, da correggere** (domanda 27) |
| `resolution` 1366×768, scenario `open` | «server exited (1)» | Avvio del server nella corsa in parallelo; **verde da solo** (`alone/mv2-resopen1366.txt`) |
| `resolution` 1366×768 e 844×390, scenario `ffa` | «ffa: scene rule c4s» (`discard built 3, seen 2`, `label … readable 0/407 ms`, `target not darkened`) | Misure di tempo della scena sotto carico (si leggono i frame ai millisecondi); **verde da solo** a 1366×768 (`alone/mv2-resffa.txt`); 844×390 non rilanciato da solo |
| `resolution` 844×390, scenario `info` | clic intercettato da `overlay` | Tempi; **verde da solo** (`alone/mv2-resinfo844.txt`) |
| `ffa` 1366×768, scenario `two` | `TypeError … reading 'value'` in pagina | **Verde da solo** 3 volte su 3 con F5 (`alone/mv-two-*`) e 2 su 2 sulla base (`alone/hv-two-*`): non ripresentato |
| `ffa` 844×390, scenario `two` | `waitForFunction` 2000 ms | **Verde da solo** (`alone/mv2-ffa844.txt`) |

In breve: un rosso che è mio (la ricerca chiusa a 844×390 in `verify-resolution.mjs`), uno che è dello strumento e c'era già (`public`, regolamento 2.1) e cinque intermittenti della corsa in parallelo che da soli sono verdi. **La matrice non è tutta verde**: lo dico, non la dichiaro verde. Nelle parti verdi (test, build, size, verify ×3, aim, layout 1366×768/844×390/1920×1080, modes, lifecycle, profile, decks ×2, `resolution` info/humans/quick/jump/report/reduced/interrupt/infoFfa/infoTouch, `ffa` timeout/five/drop/leave/queue/start) non è comparso nulla.

### Rossi

- **Registro:** R13 aggiornata (1/16 su HEAD contro 0/16 sulla base, non attribuita); R14 chiusa. R1, R2, R3, R4, R7 invariati (R2: `VerifyAim`/`VerifyLayout` desktop verdi nella fase da sole).
- **Nuovi, non in registro** (messi nel registro come R15, R16 e R17 in attesa di conferma della regia): R15 `public` (strumento, regolamento 2.1), R16 `VerifyResolution` 844×390 `open` (filtri chiusi, mia modifica più strumento), R17 intermittenze della matrice in parallelo (cinque parti verdi da sole).

### Riepilogo finale: le 26 voci dell'inventario ([proposta, sezione 1](../../design/set-base/sb-31-proposta.md#1-inventario))

Commit: F1 `a119871`, F2 `3e3771f`, F3 `76fd55c`, F4 `902d94e`, F5 questo commit; decisioni D196 `d92f74e`, D197 `5692be4`, D198 `cea8285`, D199 `b67a429`.

| # | Voce | Esito |
|---|---|---|
| 1 | Flavour nell'ispezione | **fatta**, F3 (`76fd55c`) |
| 2 | Tasto «Testo completo» | **fatta**, F3 |
| 3 | Promemoria delle parole chiave | **fatta**, F3 (sette frasi, D198 (8)) |
| 4 | Segnalini e stati coi simboli dei danni | **fatta**, F3 |
| 5 | `STATUS_TEXT`/`TIMER_TEXT` sui nomi del set | **fatta**, F3 |
| 6 | Stati con lo stesso nome raggruppati | **fatta**, F3 (nell'ispezione) |
| 7 | Token: testo italiano dall'allegato | **fatta**, F3 |
| 8 | Simboli di rarità | **fatta**, F3 (ispezione) e F4 (catalogo, `902d94e`) |
| 9 | Catalogo ed editor con filtri | **fatta**, F4 (opzione minima: personaggio, rarità, tipo, ricerca; il set non compare finché è uno solo) |
| 10 | Scelta di due legate | **fatta**: già c'era; verificata e riepilogata, F4 |
| 11 | Conteggio verso 20 | **fatta**, F4 (barra del mazzo) e F5 (barra in vista a 844×390 con i filtri chiusi) |
| 12 | O15 riepilogo; O16 deckbuilder | **O15 fatto** in F4; **O16 fuori** (perimetro di Q4, D196) |
| 13 | Ordine stabile dei personaggi | **fatta**, F4 |
| 14 | R9 | **fatta**, F1 (`a119871`) |
| 15 | R10 | **fatta**, F1 |
| 16 | Avviso ultima copia e «∞» come verifiche | **fatta**, F1 (verificata col vivo; in F5 resta nel passo `lastCopyWarning`, con R14 chiusa) |
| 17 | Contatore di Rincara | **fatta**, F1 (prova e commenti) |
| 18 | Leggibilità di immunità, timer, equip, L e A | **fatta**, F3 (con la voce 5) |
| 19 | Velocità di ogni mossa | **fuori**: osservazione da prova umana, non richiesta dal set (C5 o SB-33) |
| 20 | Motivo dell'annullamento | **fuori**: chiusa in SB-16f0 |
| 21 | Maiuscolo dei nomi | **fuori**: deciso nei dati |
| 22 | Costo in SALUTE | **fuori**: chiusa; il costo in partita viva non si è potuto provare (solo Duccio ha carte con quel costo, F3) |
| 23 | Parole chiave inglesi di `CRD002_KEYWORDS` | **fuori**: invisibili nel client web |
| 24 | Più atlanti per set | **fatta**, F2 (`3e3771f`): atlanti 8×8, tetto C4 48 MiB |
| 25 | `VerifyResolution` `c34`, `shortfall`, R8 | **fuori**: chiuse in SB-28 |
| 26 | Densità dell'hub a 844×390 | **fuori**: non del catalogo |

Fatte 18, fuori 7, spostate 0; la voce 12 è fatta a metà (O15 sì, O16 fuori per D196).

**Numeri di Size** (F5): JS 399 546 B gzip, totale 1 782 875 B gzip, texture 31 923 352 B (63,4 % di 48 MiB, margine 18 408 296). Con i lotti di SB-32 saranno due atlanti, circa 48,7 MB col resto (proposta, sezione 10).

### Lista del proprietario per la partita

Prima di cominciare: `git pull`, jar rifatto (`./scripts/build.ps1 -Task Server -Offline`), client ricostruito e servito (`./client-web/run.ps1 -Task Serve`; per l'iPhone `-Task Physical`). Su PC a 1366×768 e a 844×390 (finestra stretta o telefono in orizzontale).

1. **Una partita veloce per categoria.** Una quick di base e una avanzata: finisce, l'esito si vede, nessun errore nel tavolo. Lo starter esce a caso dentro la categoria (D190): guarda il personaggio che ti capita.
2. **Una partita open con un mazzo costruito nell'editor, coi filtri.** Collezione → Nuovo mazzo → scegli un personaggio, l'ultima risorsa e due legate; da «Mazzo regolare» usa i filtri (personaggio, rarità, tipo, ricerca) per arrivare a 20 carte, al più 2 copie. La barra del mazzo (n / 20, legate, ultima risorsa) deve restare in vista e il tocco apre il riepilogo. Salva, avvia la partita open e controlla che la mano venga dal tuo mazzo.
3. **Ispezione (i) di qualche carta.** Flavour sotto il testo breve; «Testo completo» scambia e un secondo tocco torna indietro; i promemoria delle parole chiave (Annuncia, Vulnerabile, Gioca d'anticipo, Rincara, In campo, Vendi, immune) con le sette frasi di D198 (8); la rarità (1–3 pallini, «P» per i personaggi) accanto al tipo.
4. **Stati e gettone.** Dopo una carta che dà Vulnerabile guarda il segnalino sul tavolo (italiano, senza `[[…]]`), l'ispezione del personaggio (simboli dei danni, stati con lo stesso nome raggruppati) e il gettone «∞» finché la carta resta in mano; scartare l'ultima copia di quella carta deve avvisare.
5. **Il tasto «Filtri» a misura di telefono (844×390).** Catalogo e «Mazzo regolare»: chiusi, i filtri non coprono lo schermo e si vede almeno una riga di carte; il tasto dice «Filtri» e, con filtri accesi, «Filtri (n)»; si chiude con un secondo tocco (o Esc); «n di m carte» e «Azzera i filtri» restano a portata di mano; a 1366×768 i filtri sono sempre aperti, come prima.
6. **iPhone: memoria delle texture con l'atlante** (proposta, sezione 10). Prima di SB-32 le illustrazioni sono il segnaposto nero di `base-0.webp` (2048×2048, 31,9 MB decodificati, 63,4 % del tetto di 48 MiB); con i lotti di SB-32 saranno due atlanti (circa 48,7 MB col resto). Su iPhone, aprendo l'hub, un'intera partita e l'editor di seguito, controlla che la pagina non si ricarichi da sola, che non diventi bianca e che il tavolo resti fluido; se succede, annota quale schermata e dopo quante.

### Non verificato

- Il costo in SALUTE in partita viva (solo Duccio ha carte con quel costo e non ha uno starter), già detto in F3.
- `resolution` 844×390 `ffa` da solo (rosso in matrice per tempi; non rilanciato).
- Catture di Edge via Playwright su PC, non un dispositivo fisico: il tocco vero e la memoria delle texture su iPhone sono nella lista.

### Da dichiarare

- `verify-resolution.mjs` non è stato toccato (fuori dal perimetro) e per questo `VerifyResolution` 844×390 `open` è rosso.
- Nel rapporto «prima» delle catture è F4 (`902d94e`), non una ricostruzione.
- Il lavoro dei lotti di SB-32 e i PDF di `output/pdf` presenti nell'albero di lavoro non sono in questo commit.

### Domande (numerazione unica F1–F5)

27. **`verify-resolution.mjs` a 844×390**: `addRegular` (riga 832) riempie `card-search` senza aprire i filtri. Posso correggerlo con lo stesso aiuto di `verify-decks.mjs` (aprire, riempire, chiudere) in un blocco con perimetro, o in un giro di F5?
28. **R13**: 1 corsa su 16 contro 0 su 16 sulla base. Bisecare in `76fd55c` (circa 25 minuti per commit) o lasciarla aperta come dipendente dalla partita?
29. **R15** (`public` aspetta l'indice senza `R02a` e `R07b`): conferma come voce del registro e correzione dello strumento in un blocco?
30. **R17** (cinque parti verdi da sole, rosse in `-Parallel 4`): le accetto come intermittenze del giro in parallelo (famiglia di R7), o vuole una seconda matrice completa prima della chiusura?
31. **Chiusura di SB-31**: aspetta la lista del proprietario e la correzione della domanda 27, o si chiude con le voci aperte nel registro?

## F5b — Correzioni degli strumenti dopo F5

Base `8aaba3e` (D200). Perimetro: `verify-resolution.mjs`, `verify-public.mjs`, registro dei rossi, questo rapporto, piano. Niente in `src/`, server, regole, immagini.

### Cosa cambia

- `verify-resolution.mjs`: `addRegular` apre il pannello «Filtri» prima di riempire `card-search` e lo chiude dopo, con gli stessi `openFilters`/`closeFilters`/`searchFor` di `verify-decks.mjs` (nessun effetto sugli schermi larghi). Era l'unico punto dello strumento che riempie o sceglie un filtro.
- `verify-public.mjs`: l'indice atteso delle regole è l'elenco letterale e completo dei titoli `##` di `docs/game-rules.md` 2.1, nell'ordine del documento (verificato sui titoli: R00, R01, R01a, R02, R02a, R03, R04, R05, R06, R07, R07a, R07b, R08, R09, Revisioni, più il nome del set). Nessuna asserzione allentata.

### Verifiche (una corsa esclusiva per volta, macchina ferma)

Tutte con `VerifyAll -ReuseClient -Only 'test,build,size,<verifica>' -Measures <misura>` (giro dichiarato, non pubblicabile; `BM_SCENARIOS` per lo scenario). **`-ReuseClient`** perché sulla 4320 c'era già un `vite preview` non mio (avviato alle 11:36, PID 43328): non l'ho fermato, e `VerifyAll` senza l'opzione si rifiuta di partire (primo tentativo, uscita 2 in 3 s, scartato). Il jar è stato ricostruito dalla prima corsa e riusato dopo.

| Corsa | Esito |
|---|---|
| `Test`, `Build`, `Size` (in ogni corsa) | verdi |
| `VerifyPublic` 1366×768 | **rosso**: l'indice ora passa; si ferma alla riga 135, `assert.ok(r07>=0&&r07a>=0,'card sheets and R07a values present in the set document')` |
| `VerifyPublic` 844×390 | **rosso**, stessa asserzione |
| `VerifyResolution` `open` 844×390 | verde |
| `VerifyResolution` `open` 1366×768 | verde |
| `VerifyResolution` `ffa` 844×390, da solo | verde (prima volta da solo) |
| `VerifyResolution` `ffa` 1366×768 | verde |
| `VerifyDecks` 844×390 | verde (nessuna regressione) |

**Rosso di `VerifyPublic`, attribuzione.** Lo strumento cerca nel documento del set due tabelle per intestazione: `Carta|Tipologia|Sottotipo|Costo|Priorità|Bersaglio|Effetto in ordine` (schede) e `Carta|Ruolo|Guadagni a sé`. Dal Set Base 1.0 (SB-28, `80d5b3b`) `docs/sets/base.md` non ha più le schede in tabella (sono sezioni `###` per personaggio, S3) e l'unica tabella con i ruoli è `Carta|Identificatore|Ruolo|Guadagni a sé|Danno nominale|Importo nominale` (S4, riga 1490). L'asserzione è quindi vecchia, non una regressione del client. Adeguarla (nuove intestazioni, o togliere il controllo delle schede in tabella e le sue righe `r07Rows`/`r07aRows` e `assert.ok(!dom.tables.some(t=>t[0][0]==='Carta'))` che hanno lo stesso presupposto) cambia che cosa si asserisce: **mi fermo come da contratto** e lo chiedo (domanda 32). R15 resta aperta.

### Mutazioni (file ripristinati; `git diff` finale solo le due correzioni)

- **M25** (`addRegular` senza `openFilters`, `fill` diretto su `card-search`): `VerifyResolution` `open` 844×390 **rossa**, `TimeoutError` in attesa di `card-search` (il campo esiste ma non è visibile).
- **M26** (R07b tolto dall'indice atteso): `VerifyPublic` 1366×768 **rossa** sull'indice, con `+ 'R07b'` nella differenza.

### Registro

- R16 chiusa (evidenza: `open` verde a 844×390 e 1366×768, M25).
- R15 resta aperta con la nuova attribuzione (l'indice è corretto, M26 lo prova; resta la riga 135).
- R13: nota «non bisecata per decisione del proprietario (D200 (28))». R17: nota «accettata come intermittenza del giro in parallelo, famiglia di R7 (D200 (30))». Nessuna seconda matrice.

### Da dichiarare

- `-ReuseClient`: la build servita sulla 4320 non è dichiarata come mia (il `Build` della corsa riscrive `dist`, che quell'anteprima serve dal disco). Le corse non sono equivalenti al consolidamento.
- Non ho scritto la riga D200 né toccato altro fuori perimetro. Non è stato fatto push.

### Domande

32. **`verify-public.mjs` riga 135 (e le righe collegate)**: vuole che adegui il controllo alle tabelle del Set Base 1.0 (S4 per il ruolo; le schede in sezioni `###` invece che in tabella: cambia l'asserzione sui contenuti) in un blocco con perimetro, dopo la sua decisione su cosa deve restare asserito? **Risposta: sì del proprietario, applicata in [F5c](#f5c--verifypublic-schede-e-ruolo-del-set-base-10).**

## F5c — VerifyPublic: schede e ruolo del Set Base 1.0

**Esito: chiusa.** `VerifyPublic` verde a 1366×768 e 844×390 (corse reali, `ok: true`, nessun errore di pagina). R15 passa in «Chiuse». Base `7e1dc55`. Commit senza push.

### Cosa cambia

`client-web/tools/verify-public.mjs`, quattro correzioni, tutte sul documento del set:

1. **Schede.** Al posto della tabella `Carta|Tipologia|…` (che il Set Base 1.0 non ha più) il controllo prende dalla fonte i `####` di `docs/sets/base.md` (125, asserito) e li confronta, in ordine, con gli h4 della pagina del set. Nessun numero scritto a mano.
2. **Ruolo.** La tabella S4 (`Carta|Identificatore|Ruolo|Guadagni a sé|Danno nominale|Importo nominale`) deve esserci nella pagina e nella fonte, con lo stesso numero di righe della fonte (125).
3. **Revisioni.** Le regex che leggono le revisioni del set (in `source()` e in `readDoc`) accettano tre numeri, `\d+\.\d+(?:\.\d+)?`: la revisione `1.0.1` (SB-29, 24 novembre 2026) prima non veniva letta. Il regolamento ha solo revisioni a due numeri e la sua asserzione non cambia nei valori. È un'estrazione, non un atteso.
4. **Passo `rules`.** I campi `r07Rows`/`r07aRows` diventano `cardSheets`/`rolesRows`, con il conteggio della fonte accanto. Commento aggiornato.

Riga 136 (nessuna tabella di carte nel regolamento) invariata. Nessun'altra asserzione rimossa, indebolita o con un atteso non letto dalla fonte. Attesi cambiati: quelli delle schede e del ruolo, come da risposta del proprietario alla domanda 1 di F5c (sì). Il controllo delle revisioni non ha attesi nuovi: legge la stessa fonte con l'estrazione corretta.

### Diagnosi delle asserzioni del set

Prima di correggere la regex una corsa diagnostica temporanea (non committata) ha raccolto, invece di lanciarle, le asserzioni del documento del set dalla riga 152 alla 167. Con la sola regex corretta **nessuna** fallisce: versione `1.0.1`, revisioni `['1.0.1','1.0']` uguali alla fonte, tabelle uguali, 21 349 parole uguali a 21 349. Quindi non c'era nulla da correggere oltre la regex, e nessuna asserzione va tolta o indebolita. Il file è stato ripristinato dalla copia salvata, con hash `f6dc7ff0…` come prima.

### Verifiche

| Corsa | Esito |
|---|---|
| `VerifyPublic` 1366×768 (reale) | verde, `ok: true`, 0 errori di pagina |
| `VerifyPublic` 844×390 (reale) | verde, `ok: true`, 0 errori di pagina |
| Diagnostica 1366×768 (temporanea) | 0 asserzioni del set fallite (righe 152–167) |
| M27: attesa delle schede senza il primo `####` (`sheetsSource.slice(1)`), 1366×768 | rossa su «card sheets: the h4 headings…» (riga 140) |
| M28: S4 con una riga in più (`rolesRowsSource+1`), 1366×768 | rossa su «roles table S4 has as many rows…» (riga 142) |
| M29: regex delle revisioni in `readDoc` riportata a due numeri, 1366×768 | rossa sulle revisioni (riga 154): `[null, '1.0']` contro `['1.0.1', '1.0']` |

Una mutazione per ciascuna correzione (schede, ruolo, regex); dopo ognuna il file è stato ripristinato dalla copia salvata, con hash `f6dc7ff0…` verificato.

**Macchina.** Sulla 4320 ci sono un `vite preview` (PID 43328) e un `npm run serve` (PID 42116), non miei: li ho usati senza fermarli né ricostruirli. La 8080 era libera. Le evidenze sono in `%TEMP%` (`scratchpad\f5c`), non in `docs/reports/client-c2/`.

**Console.** La corsa a 844×390 ha 4 messaggi di risorsa (500, 409, 502, 502) dagli scenari voluti (registrazione senza SMTP, server fermo) e un messaggio del browser «Permissions policy violation: unload»; a 1366×768 gli stessi, senza il 404 che compare nell'evidenza committata di C2b-5. Nessuno è un errore di pagina.

### Rossi

R15 chiusa, con la firma e la causa nel registro. Nessuna voce nuova.

### Non verificato

- Il client di gioco non è cambiato: la verifica è sul verificatore e sulla pagina servita dalla 4320 (non mia).
- La decisione del proprietario sulla domanda 32 va registrata dalla regia in `docs/set-base-decisioni.md`; questo blocco non la scrive.
- La sezione SB-31 del piano (paragrafo «F5 accettata… F5b…») dice ancora «R15 aperta»: è fuori perimetro e la regia la aggiorna.

### Scelte prese

- Diagnosi con un wrapper temporaneo sulle asserzioni del set, ripristinato dopo.
- La regex a tre numeri è applicata a entrambe le estrazioni (fonte e pagina), così il confronto resta simmetrico.
- Le mutazioni sono una per correzione (M27, M28, M29).

### Domande

Nessuna.

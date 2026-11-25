# SB-31 — Rapporto dell'esecutore (F1, F2 e F3)

Esecutore: Claude (Sonnet 5.5). Base: `d92f74e` (D196). Un commit per fase, nessun push. Le domande sono numerate una volta sola, in fondo.

**Esito.** F1 consegnata (commit «SB-31: F1 …»): R9 e R10 chiusi, controllo di D183 (4) aggiunto e verde, contatore di Rincara
verificato nel gioco vivo. Un rosso nuovo, **R11** (controllo dello scarto di `VerifyLayout`, O26), attribuito allo strumento e
registrato, non corretto. F2 consegnata (commit «SB-31: F2 …»): atlanti per set da 8×8 riquadri (`base-0.webp`), manifesto con
atlante e riquadro per ogni classe, nella pagina cambia solo la riga dell'immagine, verifiche verdi tranne i rossi noti.
**Da decidere subito:** con due atlanti da 2048×2048 per le 126 celle di SB-32 le texture raggiungono il tetto C4 di 32 MiB
e con sfondo e sprite lo superano (domanda 5).

**F3 consegnata** (commit «SB-31: F3 …», [sezione](#f3--testi-del-set-nel-client)): l'ispezione mostra flavour, «Testo completo», promemoria delle parole chiave e rarità dal testo dell'allegato; stati in italiano coi simboli dei danni, raggruppati nell'ispezione; stato del gettone dall'allegato; R11 e R12 chiusi; tetto delle texture a 48 MiB (63,4 % usato). **Da decidere:** le sette frasi dei promemoria (domanda 8). Un rosso nuovo non attribuito, **R13** (più primi piani in FFA a 750×292 in alcune corse; domanda 20); il costo in SALUTE non si è potuto vedere in una partita viva (domanda 15).

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

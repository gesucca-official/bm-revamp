# SB-31 — Rapporto dell'esecutore (F1 e F2)

Esecutore: Claude (Sonnet 5.5). Base: `d92f74e` (D196). Un commit per fase, nessun push. Le domande sono numerate una volta sola, in fondo.

**Esito.** F1 consegnata (commit «SB-31: F1 …»): R9 e R10 chiusi, controllo di D183 (4) aggiunto e verde, contatore di Rincara
verificato nel gioco vivo. Un rosso nuovo, **R11** (controllo dello scarto di `VerifyLayout`, O26), attribuito allo strumento e
registrato, non corretto. F2 consegnata (commit «SB-31: F2 …»): atlanti per set da 8×8 riquadri (`base-0.webp`), manifesto con
atlante e riquadro per ogni classe, nella pagina cambia solo la riga dell'immagine, verifiche verdi tranne i rossi noti.
**Da decidere subito:** con due atlanti da 2048×2048 per le 126 celle di SB-32 le texture raggiungono il tetto C4 di 32 MiB
e con sfondo e sprite lo superano (domanda 5).

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

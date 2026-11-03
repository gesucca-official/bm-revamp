# Rapporto C4 — Grafica e schermi

3 novembre 2026. Regolamento invariato. C4 procede a blocchi secondo il [piano C4](../client-c4-plan.md). Questo rapporto
cresce un blocco alla volta.

## C4-1 — Strumenti di verifica (O23)

3 novembre 2026. Solo strumenti: nessuna regola, server, protocollo, catalogo né sorgente del client (`client-web/src`) cambiati;
nessuna soglia né atteso di nessuna verifica toccati (diff degli script `verify-*.mjs` vuoto; l'unico script esistente modificato è
`size.mjs`, solo per il percorso di scrittura).

### Cosa è stato fatto

- **`./client-web/run.ps1 -Task VerifyAll`** (`client-web/tools/verify-all.mjs`, `npm run verify:all`): un lancio, in serie.
  Rifiuta le porte 8080 e 4320 occupate da altri (non ferma processi non suoi) e un secondo lancio insieme (blocco in `%TEMP%`);
  ricostruisce il jar (`-ReuseJar` lo riusa e lo dichiara); esegue `Test`, `Build`, `Size`; avvia l'anteprima della build appena fatta;
  `Verify` e `VerifyModes` su **un solo** server temporaneo con gli account di prova; poi, per misura, Lifecycle, Ffa, Decks,
  Public, Profile, Resolution, Aim, Layout, che avviano il server da sole (alcune lo fermano o riavviano di proposito, quindi un
  server per verifica). Ferma solo ciò che ha avviato. Una verifica che fallisce non ferma le altre; esito 1 alla fine. Tabella finale
  (verifica, misura, esito, durata) con HEAD, modifiche non committate, data e hash del jar, file e hash di `dist`.
- **`-Quick`:** una misura e scenari ridotti dove lo script ha già `BM_SCENARIOS` (ffa `queue,five`; aim `duel,ffa`; layout `duel,ffa`;
  resolution `quick,reduced`). Intestazione e riepilogo dicono che **non è equivalente** al consolidamento; non si pubblica. Anche una
  misura diversa da 1366×768 e 844×390 (per esempio `-Measures 750x292`, base di C4-1b) è dichiarata non equivalente e non si pubblica.
- **Evidenze (D13):** in cartella temporanea; con `-Publish <cartella>`, solo dopo un giro completo e verde (due misure, nessun `-Only`,
  non rapido), si copiano i JSON finali sempre e le catture solo finali, ricompresse, fino a circa 10 MB (indicazione, non soglia;
  provato sulle evidenze di C3-7: 97 catture su 328, 10,0 MB). `Size` scrive nella cartella temporanea: `docs/reports/client-c2/size.json` non cambia.
- **Avvisi:** contatori di controllo a zero (`turnsChecked`, `cardsChecked`, `boardChecks`, `unpayableSeen`, `arrowsDrawn`, `turnsSeen`)
  e jar più vecchio del sorgente del server; mai un cambio di soglia o di verdetto.
- Rimosso lo script `measure` di `package.json` (puntava a un `tools/measure.mjs` inesistente).

### Prove (build: HEAD d41fbb5 più i file di C4-1, jar ricostruito il 3 novembre 2026)

| Prova | Esito |
|---|---|
| Rapido, 1366×768 (`tabella-rapida-1366x768.txt`) | 13/13 verdi, **11 min 10 s** misurati; nessun avviso a parte le modifiche non committate (i file di C4-1) |
| **Completo, una misura, 844×390** (`tabella-completa-844x390.txt`, JSON in `full-844x390/`) | 13/13 verdi, **49 min 00 s** (Resolution 31 min 55 s, Ffa 7 min 41 s); nessun contatore a zero; `Size` verde |
| 8080 occupata da un altro processo | uscita 2 subito, nessun processo avviato, quello altrui intatto |
| Jar assente con `-ReuseJar` | uscita 2 |
| Verifica che fallisce (Verify e Modes senza client su 4320; Size verde) | proseguono le altre, tabella con FAIL, uscita 1, niente pubblicato |
| Jar più vecchio del sorgente | avviso `STALE JAR`; con una verifica fallita o un giro parziale `-Publish` non pubblica |
| Misura 750×292 | intestazione «NON-STANDARD MEASURE … NOT equivalent», nessuna pubblicazione |
| Secondo lancio mentre uno gira | rifiutato, uscita 2 |
| Pubblicazione secondo D13 | provata sulle evidenze di C3-7 (JSON sempre, catture entro 10 MB) |

**Contatori di casi visti (844×390), nuova esecuzione contro C3-7:** `Verify` turni 52 contro 26, `Ffa` 19 contro 11, `Resolution` 82 contro 88, `Aim` carte 216
contro 108 e frecce 297 contro 174; tutti sopra zero. Non sono identici perché le partite sono reali e variano, e in C3-7 `VerifyAim` era a copertura ridotta; il
raddoppio di `Verify` non l'ho spiegato oltre questo.

### Cosa non è stato eseguito

- **Il giro completo a due misure** (1366×768 e 844×390 insieme, circa due ore e mezza) **non è stato eseguito**: è il lavoro di C4-1b, poi eseguito: [vedi sotto](#c4-1b--misura-di-partenza). Con C4-1 era stato eseguito per intero il solo 844×390;
  il completo a 1366×768 non è stato eseguito (solo il rapido, non equivalente). Di conseguenza `-Publish` non è stato provato su un giro completo reale, solo sulle evidenze di C3-7.
- La ricompressione delle catture riduce poco (le catture sono già JPEG): il limite di 10 MB è ciò che le contiene.
- `Verify`/`VerifyModes` condividono un server, ma `Resolution` e le altre no: un solo punto che avvia i server c'è, ma non un solo server.
- Il rilevamento a vuoto copre solo i contatori elencati; un controllo che passa a vuoto senza un contatore con quel nome non è visto.
- Le evidenze di questa tappa sono in [client-c4/c4-1](client-c4/c4-1/): tabelle e JSON del completo a 844×390, senza catture (un giro parziale non si pubblica).

### Comando per il giro completo

```powershell
./client-web/run.ps1 -Task VerifyAll -Publish docs/reports/client-c4/c4-1b
```

## C4-1b — Misura di partenza

3 novembre 2026. Solo misura: nessun sorgente del client, regola, server, protocollo, catalogo, soglia o atteso toccati; nessun file di
`client-web/tools/` modificato. C4-1 è committato in `a6f6b1a`. Evidenze in [client-c4/c4-1b](client-c4/c4-1b/) (12 MB),
base a 750×292 in [client-c4/c4-1b/base-750x292](client-c4/c4-1b/base-750x292/) (0,6 MB).

### Build verificata

| | |
|---|---|
| Giro ufficiale | HEAD `a6f6b1a`, albero pulito, jar ricostruito dal sorgente (`a786b01436c404f3`), `dist` 18 file `512975aa314a8f9f` |
| Base 750×292 | stesso HEAD e stesso `dist`; jar ricostruito di nuovo (`904686d9ac6f8be9`, stesso sorgente) |
| Lancio | `run.ps1 -Task VerifyAll -Publish docs/reports/client-c4/c4-1b`: due misure, nessun `-Only`, non rapido; `run-summary.json` dice `equivalentToConsolidation: true` e `warnings: []` |

### Giro completo a 1366×768 e 844×390: 23 su 23 verdi, 98 min 05 s

Più veloce delle due ore e mezza attese. Nessun avviso («VACUOUS?» o «STALE JAR»). Pubblicati i JSON e 97 catture su 338 (10,0 MB).

| Verifica | 1366×768 | 844×390 |
|---|---|---|
| Test, Build, Size (una volta) | 1 s, 2 s, 0 s | |
| Verify | 1 min 23 s | 33 s |
| VerifyModes | 31 s | 20 s |
| VerifyLifecycle | 2 min 37 s | 2 min 38 s |
| VerifyFfa | 6 min 19 s | 7 min 13 s |
| VerifyDecks | 51 s | 40 s |
| VerifyPublic | 9 s | 9 s |
| VerifyProfile | 44 s | 43 s |
| VerifyResolution | 32 min 26 s | 33 min 21 s |
| VerifyAim | 1 min 51 s | 3 min 01 s |
| VerifyLayout | 1 min 17 s | 1 min 16 s |

**Contatori di casi visti** (tutti sopra zero; 1366×768 / 844×390):

- `Verify`: turni controllati 54 / 19, carte 324 / 114, controlli del tavolo 54 / 19, non pagabili viste e attenuate 62 / 4.
- `VerifyAim`, debito di C3 saldato: i cinque scenari `duel`, `touch`, `reduced`, `ffa`, `pending` girano a entrambe le misure. Carte controllate 18, 18, 12, 18, 6; frecce disegnate a 1366×768 14, 16, 12, 47, 8 e a 844×390 15, 17, 10, 38, 14.
  Osservazione: `arrowsReached` nel riepilogo è 0 in duello, tocco e movimento ridotto a entrambe le misure. Non è fra i contatori sorvegliati e il controllo proprio dello scenario `touch` riporta `reached: 1`; non l'ho indagato oltre.
- `VerifyFfa`: turni controllati 15 / 16 (cinque posti), 16+17 / 5+14 (due umani e tre computer); nessuna fuga di informazione (`leaks` 0).
- `VerifyResolution`: turni visti in `quick` 12 / 11, `ffa` 20 / 21, `open C3 contrasti` 19 / 18, `open C3 furti` 10 / 10, `humans` 9 / 9; 0 sequenze annullate dalla vista; regole 1, 2, 3, 6, c32, c34, d13, c4s tutte `ok`.
- `VerifyLayout`: duello e FFA, 3 turni ciascuno, 37 carte di catalogo, `problems` 0.

### Peso, contro i limiti e contro D9

`size.json` identico a quello di C3-7, come atteso (il codice del client non è cambiato). Verde.

| | Misura | Limite rigido | Tetto di D9 (b) |
|---|---|---|---|
| JS gzip | 330 459 B (322,7 KiB) | 512 000 | 400 KB: 82,6% (margine 69 541 B, leggendo 400 KB come 400 000 B) |
| Totale gzip | 1 113 651 B (1,06 MiB) | 4 194 304 | 2,2 MB: 50,6% (margine 1,09 MB, leggendo 2,2 MB come 2 200 000 B) |
| Texture decodificate | 18 876 320 B (18,0 MiB) | 64 MiB | 32 MiB: 56% (margine 14,0 MiB) |
| Atlante | 2048×1536 | lato 2048 | |

Il tetto di D9 non è applicato da `size.mjs`, che controlla solo i limiti rigidi: non l'ho cambiato qui; resta da decidere dove codificarlo (C4-3 estende comunque `size.mjs`). **Fatto in C4-3:** [sotto](#c4-3--simboli-font-e-inventario-degli-asset).
I tetti sono letti in modo prudente (megabyte decimali per JS e totale); in unità binarie il margine sarebbe un poco più largo.

### Sequenze e frame su desktop (dati già nelle evidenze)

Sequenze, da `VerifyResolution` (`k1.sequenceMs`, tutte `complete`, nessuna annullata):

| Partita | 1366×768 min / media / max | 844×390 min / media / max |
|---|---|---|
| Duello contro computer (`quick`) | 8,05 / 9,20 / 9,66 s (11) | 8,65 / 9,45 / 10,35 s (10) |
| FFA (`ffa`) | 8,06 / 14,80 / 19,30 s (19) | 8,85 / 14,75 / 19,70 s (20) |
| Due umani (`humans`) | 18,40 / 19,24 / 19,71 s (8) | 15,95 / 18,45 / 19,36 s (8) |

Il massimo assoluto è 19,71 s, sotto il tetto di 20 s (regola 9).

Frame, da `VerifyLayout` (intervalli fra frame mentre si sceglie, si invia e si guarda tutta la sequenza, per turno; Edge a circa 120 Hz, quindi senza i vincoli di un telefono):

| Misura | Partita | p95 | massimo | entro il limite | input massimo |
|---|---|---|---|---|---|
| 1366×768 (limite 20 ms) | duello, 2 turni | 8,5 e 8,7 ms | 53,8 e 34,0 ms | 99,7% e 99,9% | 24,0 e 15,5 ms |
| 1366×768 | FFA, 2 turni | 9,2 e 10,5 ms | 105,3 e 101,4 ms | 99,8% e 99,9% | 23,2 e 18,8 ms |
| 844×390 (limite 33 ms) | duello, 2 turni | 8,7 e 8,9 ms | 43,0 e 21,9 ms | 99,9% e 100% | 28,8 e 18,1 ms |
| 844×390 | FFA, 2 turni | 8,7 e 13,2 ms | 81,6 e 62,0 ms | 100% e 100% | 27,8 e 24,7 ms |

Picchi isolati fra 82 e 105 ms in FFA (a C3-L fino a 115 ms). `VerifyAim` conferma il trascinamento: p95 8,5 ms (1366×768) e 8,8 ms (844×390), input p95 12,7 e 14,1 ms.
Non esiste una misura di frame su una FFA con sequenza lunga a più umani oltre queste: non la invento.

### Base a 750×292 (regola 18)

`run.ps1 -Task VerifyAll -Measures 750x292 -Only verify,ffa,aim,layout`: Edge con tocco emulato, dichiarata non equivalente, non pubblicata dallo strumento;
le evidenze sono state copiate a mano nella cartella indicata. Nessuna correzione e nessuna soglia cambiata. **Un solo giro: i rossi sono la base dichiarata, non difetti da trattare qui.**

| Verifica | Esito | Durata | Cosa |
|---|---|---|---|
| Verify | **verde** | 3 min 11 s | 87 turni, 522 carte, 96 non pagabili, 30 rifiuti; mano 120×165,6, personaggio 80×110,4, oggetto 60,8×83,9 |
| VerifyFfa | **rosso** | 13 s | passa solo `queueExit`; poi si ferma alla prima asserzione sul tavolo (turno 0, 13 messaggi: sovrapposizioni fra il proprio posto e un computer, un ventaglio sopra il proprio posto, un posto sopra la mano) |
| VerifyAim | **rosso** | 2 min 12 s | `reduced` verde; `duel`: la partita non è finita in 120 turni; `touch`: il tocco sul bersaglio non ha mirato; `ffa`: una freccia passa su ✓/× (2 messaggi ripetuti); `pending`: «no playable card» |
| VerifyLayout | **rosso** | 1 min 03 s | 36 messaggi di disposizione e un'eccezione («no playable card») al terzo giro della FFA |

**`layoutProblems` in partita reale (identici a ogni turno):** **6 in duello** (nessuno spazio per le carte del round; il posto avversario sulla mano e il proprio sul fregio del tavolo; frecce verso personaggio e oggetto; primo piano; proprio posto non più grande dell'avversario, 80 contro 80) e **11 in FFA** (nessuno spazio per le carte del round; posti sovrapposti; due posti sopra mano, guscio o pile; mani coperte dietro un posto; primi piani; proprio posto non più grande, 60 contro 60).
Coincidono con la sonda del piano (5–6 e 11–14), con una voce in meno in FFA. Un gettone di immunità di 31×18 è sotto i 44 px anche in duello a questa misura.

**Frame:** duello p95 9,4 e 8,5 ms, massimo 45,9 e 33,0 ms, almeno 99,9% entro 33 ms; FFA p95 10,4 ms, massimo 65,2 ms, 100%; input massimo 23,1 ms.
Catture reali di duello e FFA in [screens](client-c4/c4-1b/base-750x292/screens/) (`layout-duel-T1`, `layout-ffa-T1`, più un primo piano e le catture dei rossi).

**Cosa non so dire dalla base:** le eccezioni «no playable card» (FFA in layout, `pending` in aim) e «duello non finito in 120 turni» non sono state diagnosticate: potrebbero essere una mano coperta da un posto o una mano senza carte giocabili in quel turno; lo strumento si ferma.
Per `VerifyFfa` la base copre solo `queueExit`: le partite FFA vere non sono state viste a questa misura oltre al primo turno.
Per la regola 18 «passa ciò che passava» significa quindi: `Verify` intero, `VerifyAim` scenario `reduced`, `queueExit` di `VerifyFfa`, e `layoutProblems` che possono solo scendere (6 in duello, 11 in FFA).

**Osservazione, non giudizio:** il proprietario su iPhone (750×292 reali in Safari) non ha segnalato blocchi, ma Edge con tocco emulato non è l'iPhone e queste partite non sono una prova umana a quella misura:
non so dire quanto questi problemi pesino su un dispositivo vero. La FFA lì ha un limite già dichiarato da D6.

### Cosa non è stato verificato

- Nulla su iPhone; nessuna prova umana. Edge a 120 Hz non dice nulla sul frame di un telefono.
- Ridisegno incrementale e tempi di input su dispositivo debole: ignoti (D6: non si misurano in C4).
- La causa dei rossi a 750×292 diversi dalla disposizione.
- I riquadri liberi dell'atlante (7 su 48) non sono stati rimisurati.

## C4-3 — Simboli, font e inventario degli asset

3 novembre 2026. Nessuna regola, server, protocollo, catalogo né `client-debug` toccati. **Stato: fatto, in attesa del giudizio del proprietario** sul
[campione](client-c4/c4-3/campione/README.md). Evidenze in [client-c4/c4-3](client-c4/c4-3/) (giro A, giro B, base a 750×292, campione).
Build verificata: HEAD `1ab2185` più le modifiche del blocco (non ancora committate al momento delle verifiche).

### Cosa è cambiato

- **Un solo sistema di simboli** per il tavolo (Pixi) e la shell (HTML): [symbols.ts](../../client-web/src/symbols.ts), sul modello di `DAMAGE_SHAPES`. Descrive in dati le quindici forme già approvate (5 risorse,
  7 ruoli, 3 danni) e i segni ✓ e ✕; `glyph` di `scene.ts` e il componente SVG di `ui.tsx` leggono gli stessi dati. **Le quindici forme non sono cambiate:** una prova a parte (non committata) ha
  confrontato, per ognuna, in tre dimensioni e con e senza accento, la sequenza delle chiamate grafiche del vecchio `glyph` con quella nuova: identiche. I poligoni dei danni vengono ancora da `readability.ts`.
- **Lettere tolte, sempre col numero.** Monete del costo: numero e simbolo della risorsa su un disco chiaro nella moneta scura (la «!» e la barra delle non pagabili restano). Guadagni: «+15» e il simbolo della risorsa
  (il triangolo dei ruoli che li marcava non c'è più). Gettoni di immunità: simbolo della risorsa su un disco chiaro con una barra obliqua, senza lettera (l'immunità non ha un numero). In HTML (catalogo, editor,
  ispezione: `Cost` e `Gains` in `ui.tsx`) le stesse monete e gli stessi bollini; il testo per un lettore è il nome della risorsa. La plancia e il riepilogo avevano già simbolo e numero.
  Le lettere restano nel testo consultabile (`gainText`, righe della plancia, etichette delle carte, `Chip.short`, stringhe del catalogo e del server).
- **Font.** Tolti Georgia (la «i») e Consolas (il codice del testo delle regole e, per difetto, lo strumento «Log»: non era nell'elenco di D4); restano Impact (con il ripiego Arial Narrow: **il font del tavolo non è cambiato**) e Arial.
  Nessun font distribuito né richiesto in rete. **Copertura misurata su Windows** (tabella `cmap` dei file di sistema): → × − ▲ ▼ ∞ ci sono in Impact e in Arial e restano testo; **✓ e ✕ non ci sono né in Impact né in Arial** e
  sono ora forme proprie (conferma ✓, annulla e chiudi ×, segno di mossa annullata ✕, riga di aiuto del menu). ◷ (orologio del clock) non c'è e non era nell'elenco di C4-3: resta testo, dichiarato.
  **Impact su iOS: non verificato**; se manca si usa il ripiego (D4, D6). Su iOS e macOS la copertura dei glifi non è stata misurata.
- **Inventario unico** in [docs/design/client-c4/assets/](../design/client-c4/assets/README.md) (`inventory.json` e pagina): `table.webp`, `atlas.webp` e `manifest.json` con autore, URL, versione, licenza, modifiche, destinazione e SHA-256, con rimando alle
  provenienze di C0-R2 e O9 (le loro lacune restano dichiarate: prompt di R2 persi, PNG e prompt di O9 solo su questo PC). Font e simboli dichiarati.
- **Test della regola 10** ([assets.test.ts](../../client-web/tests/assets.test.ts)): percorre `public/` (e `dist/`, se costruita) e fallisce per un file non registrato, con impronta diversa, con un campo mancante o per una voce senza file; controlla anche che
  non ci siano file di font, `@font-face`, `@import` o origini remote negli stili e che le famiglie nominate siano solo Impact, Arial (Arial Narrow come ripiego) e il generico sans-serif.
  **Provato con un file non registrato:** un `unregistered.txt` messo in `public/art/` ha fatto fallire il test («distributed but not in the inventory»); tolto il file, il test è tornato verde.
- **Materiali di terzi: nessuno è entrato.** Nessuna icona di Game-icons (D3 (c): nessuna lacuna reale, costi, guadagni e immunità si coprono con i simboli delle risorse), nessun font, nessun suono. Quindi **non c'è una pagina «Crediti e licenze»**
  e la frase sui diritti della home («Tutti i diritti riservati…») resta corretta. Un test impone che una licenza diversa da quella del progetto metta `thirdParty` a vero nell'inventario.
- **`Size` esteso** (`tools/image-size.mjs`, `tools/size.mjs`): legge le dimensioni di WebP, PNG, JPEG, GIF e AVIF (un raster che non sa leggere fa fallire il giro invece di restare fuori dal conto) e applica **due controlli distinti**: i limiti rigidi di C2
  (invariati) e i tetti di D9. I tetti sono letti in modo prudente (JS 400 000 B e totale 2 200 000 B decimali, texture 32 MiB), come per i margini di C4-1b. `size.json` riporta margine e percentuale di ogni tetto e un riepilogo per estensione.
  **Provato:** su un `dist` finto con 450 KB di JS incomprimibile i limiti rigidi passano e il tetto fallisce da solo («Tetto C4 (D9) … js 450158 > 400000»), uscita 1. Test dei formati: [size.test.ts](../../client-web/tests/size.test.ts).
- **`VerifyLayout` controlla in più** (nessuna soglia né atteso cambiato): le monete di ogni volto (mano, catalogo, carta piccola del round) nominano le risorse del costo del catalogo nell'ordine, i guadagni disegnati sono un prefisso di quelli del catalogo e
  nessun testo del volto è una lettera di risorsa. `FaceInfo` e `faceInfos` riportano ora anche `marks`, `cost` e `gains`.

### Size contro limiti rigidi e tetti (D9)

Da [size.json del giro A](client-c4/c4-3/giro-A/size.json) (JS e totale gzip di ogni file, texture dalle intestazioni):

| | C4-1b | C4-3 | Limite rigido | Tetto di D9 | Uso del tetto |
|---|---|---|---|---|---|
| JS gzip | 330 459 B | **331 828 B** (+1 369) | 512 000 | 400 000 | 83,0%, margine 68 172 B |
| Totale gzip | 1 113 651 B | **1 115 170 B** (+1 519) | 4 194 304 | 2 200 000 | 50,7%, margine 1 084 830 B |
| Texture decodificate | 18 876 320 B | **18 876 320 B** (invariate) | 67 108 864 | 33 554 432 | 56,3%, margine 14 678 112 B |
| Atlante | 2048×1536 | 2048×1536 | lato 2048 | | |

Entrambi i controlli passano con margine. Il JS aveva il margine più stretto (circa 68 KB di tetto).

**Revisione di D9 (3 novembre 2026, dopo C4-3).** Il proprietario ha tolto i tetti di JS (400 KB) e totale (2,2 MB): il client si serve in locale, 2,2 o 4,4 MB gzip non pesano e i limiti rigidi di C2 fermano già un errore accidentale. Restano i limiti rigidi e il tetto sulle texture decodificate (32 MiB), perché sul telefono costa la memoria e non il download. `size.mjs` applica solo quel tetto; le colonne «Tetto di D9» di JS e totale qui sopra sono storiche.

### Verifiche

Tutte con `./client-web/run.ps1 -Task VerifyAll -Only …`, porte 8080 e 4320 libere, mai due lanci insieme. Il lancio dichiara HEAD, modifiche non committate, jar e `dist`; con `-Only` **non è equivalente al consolidamento** e non pubblica da sé:
le evidenze sono state copiate nella cartella del blocco a mano.

| Giro | Cosa | Build | Esito |
|---|---|---|---|
| A | `test build size verify decks public layout`, 1366×768 e 844×390 | jar ricostruito dal sorgente (`fae8b491f557e3c5`), `dist` 18 file `9b47e084922db14f` | **11 su 11 verdi, 5 min 55 s** |
| B | `test build size resolution` con `BM_SCENARIOS=quick,ffa`, due misure | stesso jar (riusato e dichiarato: ricostruito pochi minuti prima dallo stesso sorgente), `dist` ricostruito, stesso `9b47e084922db14f` | **5 su 5 verdi, 16 min 13 s** |
| Base 750×292 | `verify ffa aim layout`, `-Measures 750x292`, non equivalente | stesso jar | non peggiora, con un'avvertenza: sotto |
| Repository | `./scripts/build.ps1 -Task Test -Offline`, `python scripts/check-rules.py` | | **verdi**: sotto |

Durate del giro A (1366×768 e 844×390): `Verify` 1 min 14 s e 56 s, `VerifyDecks` 29 s e 26 s, `VerifyPublic` 9 s e 9 s, `VerifyLayout` 1 min 16 s e 1 min 13 s. Giro B: `VerifyResolution` 9 min 23 s e 6 min 47 s.
Nessun avviso di controllo a vuoto; l'unico avviso è «modifiche non committate nei percorsi verificati». Test del client: 205 su 205.

**Contatori di casi visti** (1366×768 / 844×390): `Verify` turni 39 / 30, carte 230 / 180, controlli del tavolo 39 / 30, non pagabili viste e attenuate 43 / 33; `VerifyDecks` 37 volti di catalogo (12 con danno) e 2 personaggi, 39 in totale;
`VerifyLayout` 6 volti della mano per turno (duello e FFA, tre turni), 37 carte di catalogo come mano e come carte piccole, `problems` 0; `VerifyResolution` turni visti `quick` 20 / 9 e `ffa` 19 / 16, nessuna sequenza annullata dalla vista, nessun errore.
Sequenze (`msComplete`): duello 7,41–9,96 s, FFA 12,0–19,31 s: **massimo 19,31 s**, sotto il tetto di 20 s (regola 9).

**Regola 17 (fattori e dimensioni di C3-L).** Fattori e dimensioni dei personaggi uguali a C4-1b: 1366×768 duello me ×1,5, altri ×1,2, oggetti ×1, risorse ×1,25, personaggio proprio 225×310; FFA ×1,5, ×1, ×1, ×1,25, 175×242; 844×390 duello ×1,5, ×1, ×1, ×1,1, 120×166; FFA ×1,5, ×1, ×1, ×1,05, 90×124.
`Verify` registra a 844×390 mano 120×165,6, personaggio 120×165,6 e oggetto 60,8×83,9; a 1366×768 214×295,3, 224,6×310 e 113,8×157,1. **Regole 1–9 di C3:** le controlla `VerifyResolution` (giro B, verde).

**Frame** (`VerifyLayout`, Edge, senza i vincoli di un telefono). Nel giro A: p95 8,4–8,5 ms a 1366×768 (C4-1b 8,5–10,5) e 8,4–11,3 ms a 844×390 (C4-1b 8,7–13,2); massimi isolati fino a 110 ms a 1366×768 (C4-1b 105)
e **341,7 ms a 844×390 in FFA al secondo turno** (C4-1b 81,6): un solo intervallo, con il 99,7% dei frame entro il limite. **Non l'ho spiegato.** Rieseguito `VerifyLayout` a 844×390 due volte: verde, massimi 87,4 ms al più (nessun picco simile),
ma p95 di 16,9–19,4 ms invece di 8,4: in quei due giri il browser girava a una cadenza più lenta, per cause che non ho indagato. Il criterio di C3-L (la quota di frame entro il limite) regge in tutti i giri, la più bassa il 99,7%; il picco isolato e la cadenza variabile restano non attribuiti, e dicono poco sull'iPhone.

### Base a 750×292 (regola 18)

Edge con tocco emulato, misura non equivalente, evidenze copiate a mano in [base-750x292](client-c4/c4-3/base-750x292/). Nessuna soglia né atteso cambiato.

| Verifica | C4-1b (base) | C4-3 |
|---|---|---|
| `layoutProblems` in duello | 6 | **6, 6, 6** (tre turni) |
| `layoutProblems` in FFA | 11 | **11, 11, 11** (tre turni) |
| `Verify` | verde (87 turni) | **verde in un giro su tre** (64 turni, 384 carte; mano 120×165,6, personaggio 80×110,4, oggetto 60,8×83,9, come la base); negli altri due **rosso in 6–15 s** al passaggio sul gettone di stato |
| `VerifyFfa` | rosso, passa solo `queueExit` | uguale: stessa asserzione sul tavolo (posti sovrapposti) |
| `VerifyAim` | `reduced` verde; rossi `duel`, `touch`, `ffa`, `pending` | uguale: `reduced` verde, rossi `duel` («non finita in 120 turni»), `touch`, `ffa` (stessa freccia su ✓/× con le stesse coordinate); `pending` non è comparso in questo giro |
| `VerifyLayout` | rosso | rosso, con gli stessi messaggi di disposizione; arriva al terzo turno della FFA |

**Il `Verify` a 750×292 non è deterministico, e non per questo blocco.** Il rosso è «`status-tip` non compare»: `verify.mjs` passa il mouse sul primo gettone di stato che trova e, quando il personaggio proprio non ne ha (Spazienzio) e il computer sì (Tossico),
a quella misura il gettone dell'avversario sta sotto una carta della mano (cattura: [verify-tooltip-fail-chip-under-hand](client-c4/c4-3/base-750x292/screens/verify-tooltip-fail-chip-under-hand-750x292.jpg)) e il mouse arriva alla carta. **Ho rifatto la prova sul commit di base**, con le modifiche di C4-3 messe da parte:
su sei giri, **tre rossi in 6 s per la stessa causa e tre verdi**; con C4-3 tre giri, due rossi e uno verde. Quindi la regola 18 («`Verify` resta verde») vale come alla base, cioè nelle partite in cui il gettone è raggiungibile; il difetto è nella disposizione a 750×292, che C4-3 non ha toccato.
**Non è un verde pieno e non lo presento come tale.** Nel giro di C4-1b il gettone di stato era quello del personaggio proprio, raggiungibile (cattura della base).

### Verifiche del repository

- `python scripts/check-rules.py`: verde («Regolamento e copia client allineati: 39 carte … SQLite integro»).
- `./scripts/build.ps1 -Task Test -Offline`: BUILD SUCCESS, 266 test del server e 36 di `client-debug`, nessun fallimento.

### Cosa non è stato verificato né eseguito

- **iPhone:** nulla. **Impact su iOS:** non verificato; ✓ e ✕ non dipendono più dal font, il resto del testo del tavolo sì. Safari non è stato misurato.
- **Scala di grigi (regola 11):** nessuna cattura in scala di grigi. I simboli delle risorse si distinguono per forma (stella, occhio, goccia, bottiglia, fulmine) ma a 12–16 px non l'ho giudicato io: sta al proprietario, sul campione.
- **Contrasto dei simboli sul disco chiaro e sulla moneta:** non misurato (è di C4-8a). ALCOHOL (giallo) e TOXICITY (verde) su cartone chiaro hanno contrasti bassi già noti dal piano.
- **Lettore di schermo e tastiera sui nuovi componenti HTML:** non provati (C4-8a). `Cost` e `Gains` espongono il nome della risorsa in `aria-label`, ma nessun lettore è stato usato.
- **Carte piccole del round (36–40 px):** costo e guadagno diventano pochi pixel; non misurati oltre i controlli di posizione di `VerifyLayout`. È il residuo O21 di C4-2.
- **Giro completo di consolidamento:** non rieseguito (lo fa C4-9). Non ho rieseguito `VerifyModes`, `VerifyLifecycle`, `VerifyFfa`, `VerifyProfile` e `VerifyAim` alle misure ufficiali: non sono nella matrice di C4-3.
- **Il campione** non ha una cattura per ogni schermata: solo mano, carte del round, primo piano, plancia, FFA, conferma, catalogo ed editor.
- **Un difetto preesistente di `verify-layout.mjs`**, non toccato: la riga «a letter code for the damage» ha nel sorgente un carattere di controllo (backspace) al posto di `\b` nell'espressione regolare, quindi in pratica non scatta mai. Non l'ho corretto per non cambiare un controllo in questo blocco.
- **Librerie npm nel pacchetto** (pixi.js, react, react-dom, sockjs-client: MIT; @stomp/stompjs: Apache-2.0): non sono asset e non sono nell'inventario, ma le loro note di licenza non risultano distribuite con la build. Non verificato né risolto qui; è un tema di pubblicazione.

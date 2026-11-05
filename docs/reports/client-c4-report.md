# Rapporto C4 — Grafica e schermi

3–4 novembre 2026. Regolamento invariato. C4 procede a blocchi secondo il [piano C4](../client-c4-plan.md). Questo rapporto
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

3 novembre 2026. Nessuna regola, server, protocollo, catalogo né `client-debug` toccati. **Stato: fatto, approvato dal proprietario il 4 novembre 2026** sul
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

## C4-2 — Finitura delle dimensioni e tutela di 750×292

4 novembre 2026. **Fatto e approvato dal proprietario lo stesso giorno.** Nessuna regola, server, protocollo, catalogo o `client-debug` toccati. Evidenze in [client-c4/c4-2](client-c4/c4-2/) (7,5 MB).

### Cosa è cambiato

- **Conferma, ridisegnata dal proprietario sugli schemi:** ✓ e × stanno sulla carta scelta, velata e divisa a metà (✓ sopra, × sotto), con tinte più leggere del primo schema. Il testo della mossa sta in basso a sinistra (`confirmTextBox`). La carta aspetta il più vicino possibile a dove è stata rilasciata; col tocco o da tastiera, vicino al bersaglio (`previewSpot`, funzione pura). Non copre mai il bersaglio; la zona centrale è solo indicativa.
- **Carte piccole del round (O12):** non ho ingrandito costo e guadagno, che a 36–40 px non si leggerebbero senza deformare il volto (O14). **Alternativa dichiarata:** tutte le carte del round sono un bersaglio unico che apre «Ultimo turno», che ora dice anche il guadagno nominale. Il corpo minimo del costo sulle carte piccole è salito leggermente.
- **Bersagli:** `.server-text summary` a 44 px e area di 44 px sul riepilogo breve.
- **Gettoni di stato (D8):** l'ispezione del personaggio riporta il testo di ogni gettone.
- **Resize:** la scena attende 120 ms che la misura si fermi e ridisegna solo se è cambiata, così `fitScale` non scatta a ogni barra di Safari.
- **Strumenti:** corretto il controllo «a letter code for the damage»; aggiunti ai `verify` i passaggi su controlli, gettoni, resize, carte del round e conferma sulla carta.

Il vecchio posto della conferma resta libero per frecce e `fitScale`: serve a non spostare i fattori di C3-L (regola 17) né i conteggi a 750×292.

### Controlli sotto 44 px

| Dove | Prima | Dopo (DOM, partite reali, con carta scelta, conferma, ispezione, menu, ultimo turno e riepilogo breve) |
|---|---|---|
| `.server-text summary` | 36 px | 44 px |
| Riepilogo breve (`.toast`) | circa 27 px (calcolato) | area di 44 px |
| ✓ e × | in mezzo al tavolo, sopra il bersaglio nei casi peggiori | 82 px minimo a 1366×768, 48 px a 844×390 |
| Gettoni di stato | 31×18 – 61×36 | **invariati, eccezione di D8:** 49×29, 61×36, 36×24, 41×24, 56×36 a 1366×768; 26×18, 31×18, 46×27 a 844×390 |

L'elenco al tavolo contiene quindi **solo i gettoni**. Hub, pubblico e profilo (`.presence`, `.public button.link`, `.slot summary`, `button.back`) non sono stati toccati: sono di C4-5b.

**Prova sui gettoni (`scenarioChips`, tocco emulato su partita reale):** il tocco sul personaggio apre l'ispezione e il testo del gettone è presente, per tutti i gettoni visti. Personaggi da 60×83 e 90×124 a 844×390, 117×161 e 175×242 a 1366×768. Solo gettoni di immunità sono comparsi in questi giri; il meccanismo è lo stesso per gli altri, ma non è stato visto.

### Carte del round

Provato in partita (`roundLinkPass`): bersaglio da 241×248 e 198×232 a 1366×768, 88×66 e 91×89 a 844×390; apre «Ultimo turno», dove costo e guadagno compaiono ogni volta che il catalogo ne prevede uno.

### Dove sta la carta

Quota della carta sovrapposta agli altri oggetti del tavolo, calcolata con le funzioni pure su tutti i bersagli. La somma può contare due volte le zone comuni.

| Misura e posti | Oggetti per posto | Prima | Ora, media e massimo |
|---|---|---|---|
| 1366×768 duello | 0–3 | 45–52% | 0%, 0% |
| 1366×768 FFA | 0–1 | 59% | 0%, 1% |
| 1366×768 FFA | 3 | 57% | 13%, 27% |
| 844×390 duello | 0–3 | 85% | 0%, 0% |
| 844×390 FFA | 0–1 | 101% | 1%, 3% |
| 844×390 FFA | 3 | 101% | 1%, 10% |

**Da giudicare:** la vicinanza cede quando coprire costerebbe di più. Distanza dal punto di rilascio in partita, ora e al vecchio posto: 1366×768 duello 117 e 108 px, FFA 206–283 e 560 px; 844×390 duello 179 e 51 px, FFA 146–463 e 249 px. Nel duello il vecchio posto era più vicino solo perché stava sopra il bersaglio. Nel caso peggiore a 844×390 la carta finisce più lontana di prima.

### Verifiche

Tutte su HEAD `3b89e48` più le modifiche, jar `4094dce64490a86f`.

| Giro | Cosa | Esito |
|---|---|---|
| [A](client-c4/c4-2/giro-A/) | Test, Build, Size, Verify, VerifyFfa, VerifyAim, VerifyLayout, VerifyLifecycle, alle due misure | **13 su 13 verdi**, 29 min 47 s |
| [B](client-c4/c4-2/giro-B/) | Test, Build, Size, VerifyResolution (`quick`, `ffa`), alle due misure | **5 su 5 verdi**, 10 min 09 s |
| [Layout dopo l'ultimo controllo](client-c4/c4-2/giro-layout/) | VerifyLayout con `roundLinkPass` | 844×390 verde; 1366×768 **un rosso, poi verde**: sotto |
| [Base](client-c4/c4-2/base-750x292/) | 750×292, non equivalente | sotto |

Il giro A è stato eseguito prima di aggiungere `roundLinkPass`: dopo è cambiato solo lo strumento, non il client. `VerifyLifecycle` è stato eseguito a entrambe le misure.

`./scripts/build.ps1 -Task Test -Offline` verde (l'ultima suite: 36 su 36), `python scripts/check-rules.py` verde. Il picco di 341,7 ms a 844×390 FFA non è ricomparso: massimi 108,4 e 88,9 ms a 844×390, 183,5 e 122,8 ms a 1366×768 (FFA, giro A, 4 novembre).

**Rosso `close-up` a 1366×768 FFA:** in questo giro è comparso e nel successivo no. La diagnosi e la correzione sono in [Dopo il giudizio](#dopo-il-giudizio-del-proprietario-freccia-e-close-up).

### Controllo «a letter code for the damage»

Il carattere di controllo è ora `\b` vero. **Scatta:** lo strumento verifica all'avvio che riconosca `HIT 15`, `CUT` e `P 5` e non `HITMAN` né `Colpo`; se no, si ferma. **Nessun falso rosso:** nessuna segnalazione su nessuna faccia nei giri reali. Il caso positivo è costruito: nessuna carta reale lo fa scattare.

### Base a 750×292 (regola 18)

Edge con tocco emulato, misura non equivalente, evidenze copiate a mano.

| Verifica | C4-3 | C4-2 |
|---|---|---|
| `layoutProblems` duello | 6, 6, 6 | **6, 6, 6** |
| `layoutProblems` FFA | 11, 11, 11 | **11, 11, 11** |
| Test con la base fissata (`BASE_750`) | non c'era | aggiunto, può solo scendere |
| `Verify` | verde in un giro su tre | verde nell'unico giro: non prova che il difetto del gettone sotto la mano sia sparito |
| `VerifyFfa` | rosso, stessa asserzione | uguale |
| `VerifyLayout` | 43 messaggi | **43, stessi messaggi**; `resize` non arriva in fondo (`no playable card`, come alla base in altri scenari) e quindi **orientamento e resize non sono provati a questa misura** |
| `VerifyAim` | 6 messaggi | **17:** stessi rossi di base più **11 nuovi** |

**Gli 11 nuovi messaggi sono un criterio nuovo su una cosa nuova:** «the text of the move over a seat», solo in FFA. A questa misura la striscia del testo tocca il proprio posto ([cattura](client-c4/c4-2/base-750x292/screens/layout-ffa-750x292-confirmation-750x292.jpg)). Il testo resta leggibile e ✓ e × restano da 48 e 50 px, ma è una sovrapposizione in più e **non la presento come assenza di peggioramento**. Il proprietario ha deciso quel posto del testo; spostarlo solo a 750×292 sarebbe una disposizione nuova, quindi passa all'app futura.

Miglioramenti economici a 750×292: nessuno trovato, i problemi sono tutti di altezza. Il test «750×292 non entra» resta com'è.

### Size contro limiti e tetto (D9)

| Voce | Misura | Limite o tetto |
|---|---|---|
| JS gzip | 332 664 B | 500 KB |
| Totale gzip | 1 116 229 B | 4 MB |
| Texture decodificate | 18 876 320 B | 32 MiB in C4 (56,3%, margine 14 678 112 B); 64 MB rigido |

### Elenco per l'app futura

- Disposizione completa a 750×292, compreso il testo della mossa sul proprio posto.
- `Verify` a 750×292: il gettone sotto la mano.
- `viewport-fit=cover` e aree sicure: Safari già rientra, nessun guadagno misurabile qui e nessun modo di provarlo.
- FFA su iPhone e `resize` a 750×292.

### Cosa non è stato verificato

- **iPhone e Safari:** niente. Il resize è provato in Edge con una raffica di 10 misure (una sola applicata, nessun comando inviato, partita proseguita) e col passaggio all'altra misura e in verticale; le barre di Safari no.
- **Gettoni diversi dall'immunità** nella prova di D8.
- **Scala di grigi e contrasto** della nuova conferma (C4-8a).
- **Lettore di schermo** sui due nuovi bersagli.

### Da guardare

Giudizio del proprietario su: [conferma in duello a 1366×768](client-c4/c4-2/catture/layout-duel-1366x768-confirmation-1366x768.jpg), [FFA a 1366×768](client-c4/c4-2/catture/layout-ffa-1366x768-confirmation-1366x768.jpg), [duello a 844×390](client-c4/c4-2/catture/layout-duel-844x390-confirmation-844x390.jpg), [FFA a 844×390](client-c4/c4-2/catture/layout-ffa-844x390-confirmation-844x390.jpg), [scarto di una legata](client-c4/c4-2/catture/03-bound-discard-844x390.jpg), [ultimo turno dalle carte del round](client-c4/c4-2/catture/layout-ffa-last-turn-844x390.jpg). Le [simulazioni](client-c4/c4-2/schemi/proposta-1366x768.png) approvate hanno ancora le tinte accese: fanno fede le catture.

### Dopo il giudizio del proprietario: freccia e `close-up`

4 novembre 2026, dopo il commit `a45c92d`. Le tabelle sopra descrivono quel commit; dove differiscono, vale questa sezione. Evidenze in [dopo-giudizio](client-c4/c4-2/dopo-giudizio/).

**Freccia (richiesta del proprietario).** Mentre la mossa aspetta ✓ o ×, dalla carta al bersaglio va la stessa freccia cartoon della scelta del bersaglio, al posto della linea sottile. `VerifyAim` controlla che esista per ogni bersaglio, parta dalla carta, finisca sul bersaglio e resti nello schermo.

**Due modifiche che ne discendono, non chieste esplicitamente:**

- **Spazio per la freccia:** con la carta a ridosso del bersaglio restava un moncone, quindi `previewSpot` lascia uno spazio attorno al bersaglio (24 px per lato su desktop, 15 px a 844×390) e torna a 6 px solo se non c'è altro posto. La carta sta quindi un po' più lontana dal rilascio.
- **Difetto corretto:** il passaggio del mouse solleva il bersaglio e la carta veniva ricalcolata, quindi poteva spostarsi mentre si andava verso ✓ o ×. Ora la posizione si calcola dal bersaglio a riposo.

**Rosso `close-up`: era un falso rosso dello strumento.** Nel rapporto precedente l'avevo chiamato rosso vero: era sbagliato.

| Griglia del controllo | Distribuzioni rosse su 1024 |
|---|---|
| 24 px (`verify-layout.mjs`) | 144 |
| 16, 12, 8, 6, 4 px | 0 |

La scena cerca il posto con un passo di 8 px; il controllo ne usava uno da 24 e saltava posti che esistono. Ora `verify-layout.mjs` usa lo stesso passo della scena e un test unitario fissa i casi che fallivano. **Nessuna geometria del tavolo è cambiata e nessuna soglia è stata toccata:** il controllo cerca meglio, ma resta rosso se il posto non c'è. La griglia di `fitScale` e del resto di `layoutProblems` non è stata toccata.

**Verifiche, jar `89cdf5e8f7ce99e6`:**

| Giro | Esito |
|---|---|
| [A](client-c4/c4-2/dopo-giudizio/giro-A/): Test, Build, Size, Verify, VerifyFfa, VerifyAim, VerifyLayout, VerifyLifecycle, alle due misure | **13 su 13 verdi** |
| [B](client-c4/c4-2/dopo-giudizio/giro-B/): Test, Build, Size, VerifyResolution (`quick`, `ffa`), alle due misure | **5 su 5 verdi** |
| Test unitari | 216 su 216 |
| `build.ps1 -Task Test -Offline`, `check-rules.py` | verdi |
| Size | JS 332 790 B, totale 1 116 354 B, texture 18 876 320 B (56,3% del tetto) |

Fattori di C3-L invariati. Massimi dei frame nelle FFA: 135,4 ms a 1366×768, 105,4 ms a 844×390; il picco di 341,7 ms non è ricomparso.

**Quota coperta, ricalcolata con le funzioni pure:** invariata o quasi nei casi comuni (0–1%). Con 3 oggetti per posto in FFA il massimo sale: a 1366×768 da 27% a 29%, a 844×390 da 10% a 17%.

**Distanza dal rilascio in partita, ora e al vecchio posto:** 1366×768 duello 134 e 108 px, FFA 224 e 560 px; 844×390 duello 179 e 51 px, FFA 120 e 249 px.

**[Base a 750×292](client-c4/c4-2/dopo-giudizio/base-750x292/), non equivalente:**

- `layoutProblems` resta **6, 6, 6** e **11, 11, 11**; `Verify` verde in questo giro; `VerifyFfa` rosso come alla base.
- `VerifyAim`: 10 messaggi. Gli 8 sul testo della mossa sono quelli già dichiarati, più «partita non finita» e tocco, che c'erano già alla base.
- `VerifyLayout`: 48 messaggi, 5 più del giro precedente. 4 sono «no link on the round cards», un controllo nuovo su carte del round che a questa misura non c'erano nemmeno prima. **L'altro è una segnalazione nuova in `chips`:** il testo di un gettone proprio non è stato trovato nell'ispezione a questa misura. Nel giro precedente non era comparsa; non l'ho indagata, perché 750×292 è solo non regressione.

**Non verificato:** la freccia su iPhone e Safari; con movimento ridotto, solo che la pulsazione usa la stessa regola delle altre frecce.

Catture: [duello a 1366×768](client-c4/c4-2/dopo-giudizio/catture/layout-duel-1366x768-confirmation-1366x768.jpg), [FFA a 1366×768](client-c4/c4-2/dopo-giudizio/catture/layout-ffa-1366x768-confirmation-1366x768.jpg), [duello a 844×390](client-c4/c4-2/dopo-giudizio/catture/layout-duel-844x390-confirmation-844x390.jpg), [FFA a 844×390](client-c4/c4-2/dopo-giudizio/catture/layout-ffa-844x390-confirmation-844x390.jpg), [FFA a 750×292](client-c4/c4-2/dopo-giudizio/catture/layout-ffa-750x292-confirmation-750x292.jpg).

## C4-4 — Cornici per tipologia e segno del ruolo (O8 con O14)

4 novembre 2026. **Fatto e approvato dal proprietario lo stesso giorno, col filetto medio.** Regole, server, protocollo, catalogo e `client-debug` non sono cambiati. Nessuna soglia né atteso è stato allentato; i controlli aggiunti stanno sotto.

### Varianti e scelta

Tre varianti su carte vere, disegnate dalla scena reale a 1366×768 e 844×390, anche in grigi: [proposte e README](client-c4/c4-4/proposte/README.md).

| Variante | Cornice | Esito |
|---|---|---|
| V1 Filetto | linea diversa lungo tutto il margine | **scelta** |
| V2 Angoli e fregio | angoli e fregio, linea di oggi | nel ventaglio della mano restano quasi solo gli angoli a sinistra |
| V3 Sagoma | contorno della carta | la più lontana dal volto attuale (O14) |

Il proprietario ha scelto la V1 chiedendo un filetto meno flebile. Provati due spessori, ha scelto il **medio**: [confronto a 36 px](client-c4/c4-4/proposte/confronto-spessori-36px-844x390.jpg). Il pieno a colori si legge meglio a 36 px; in grigi il medio tiene più aperti i tratteggi.

### Cosa è cambiato

| Tipologia | Filetto | Scritta |
|---|---|---|
| Regolare (26 carte su 37) | la linea di oggi, identica | AZIONE REGOLARE |
| Personaggio | fascia oro con filo scuro | PERSONAGGIO |
| Base | doppia linea petrolio | AZIONE BASE |
| Legata | tratti lunghi color vino | AZIONE LEGATA |
| Ultima risorsa | fascia nera piena | ULTIMA RISORSA |
| Oggetto | puntini ocra | OGGETTO |
| Token | linea e punto color ruggine | OGGETTO TOKEN, TOKEN (prima: OGGETTO) |
| Neutra | tratteggio grigio sottile e rado | CARTA |
| Dorso | filo oro | nessuna |

- **Tipologia:** `cardType` in `readability.ts`, funzione pura sui dati del wire.
- **Token:** riconosciuto dal prefisso `com.tokens.` di `bindingName`, dato stabile del wire ma **non un campo dedicato**.
- **Ripiego neutro:** carta senza `bindingName` o con indicatori contraddittori. **Una classe nuova senza indicatori conta come regolare**, come la gioca il server: il Set Base non la farà risultare neutra.
- **Disegno:** `frames.ts`, sul modello di `symbols.ts`: dati e due conduttori, Pixi e SVG. Solo grafica vettoriale: nessuna texture e nessun asset nuovi.
- **Segno del ruolo:** linguetta che esce dalla cornice, con il simbolo di C4-3. Una carta senza ruolo, o con un ruolo ignoto, ha la linguetta vuota e senza parola. Sulle carte piccole resta il cerchio.
- **Dove:** mano, primi piani, carte del round, oggetti, personaggi, dorso, scarti, catalogo, editor, ispezione.
- **Catalogo ed editor:** la miniatura da 56×56 diventa una mini-carta da 66×90 (54×74 sotto i 550 px di altezza), quindi si vedono meno carte per schermata.
- **Ispezione:** il bordo color petrolio uguale per tutte lascia il posto alla cornice della tipologia.

**Un difetto che c'era già, corretto:** a 1366×768 la scritta del tipo cadeva per metà sull'illustrazione. Ora finisce dove l'illustrazione comincia. A 844×390 non si muove nulla.

### Controlli aggiunti

- **Test in unità, `tests/frames.test.ts`:** ogni classe dell'allegato ha la cornice del suo tipo (26, 4, 2, 1, 4); il token ha la sua; ripiego neutro su carta senza binding e con indicatori contraddittori.
- **Regola 11, sempre in unità:** tolto il colore, tutte le tipologie restano geometricamente diverse a 36, 45,6, 60, 120 e 214 px; ogni segno ha contrasto almeno 2:1 con la carta; i vuoti dei tratteggi a 36 px restano di almeno 2,8 px.
- **Area del volto:** a tutte le misure la cornice sta tra 1 e 6 px dal bordo, fuori da titolo e illustrazione.
- **Partita reale, `VerifyLayout`:** mano, oggetti, le 37 facce e la cornice dell'ispezione confrontate con l'allegato. **`VerifyDecks`:** le 39 cornici del catalogo pubblicato dal server reale.

La cattura ha trovato ciò che i controlli verdi non vedevano: la cornice dell'ispezione non si disegnava, perché veniva misurata prima dell'apertura della finestra. Corretta, con il suo controllo; i giri sotto sono stati rifatti tutti sul client finale.

### Verifiche

Client finale `dist` `559e1ef260a4f12e`, jar `07fa99f4457cf36e`. Con `-Only` il lancio non è equivalente al consolidamento.

| Giro | Cosa | Esito |
|---|---|---|
| [A](client-c4/c4-4/giro-A/) | Test, Build, Size, Verify, VerifyDecks, VerifyLayout, alle due misure | **9 su 9 verdi** |
| [B](client-c4/c4-4/giro-B/) | Test, Build, Size, VerifyResolution (`quick`, `ffa`), alle due misure | **5 su 5 verdi** |
| [Base](client-c4/c4-4/base-750x292/) | 750×292, non equivalente | non peggiora: sotto |
| Repository | `./scripts/build.ps1 -Task Test -Offline`, `python scripts/check-rules.py` | **verdi** |

**Peso (`Size`):**

| | C4-2 | C4-4 | Limite |
|---|---|---|---|
| JS gzip | 332 664 B | 334 343 B | 524 288 B |
| Totale gzip | 1 116 229 B | 1 117 978 B | 4 194 304 B |
| Texture decodificate | 18 876 320 B | 18 876 320 B | tetto di 32 MiB (33 554 432 B) |

**Tempi in FFA, massimi di `VerifyLayout` (giro A):** 149 e 88,7 ms a 1366×768, 84,6 e 64 ms a 844×390. Nel giro A di C4-2 erano 183,5 e 122,8, poi 108,4 e 88,9: il costo del ridisegno non si vede. Un solo giro su PC: non è la misura dell'iPhone.

**Base a 750×292 (regola 18):**

| Controllo | C4-2 | C4-4 |
|---|---|---|
| `layoutProblems`, duello e FFA | 6, 6, 6 e 11, 11, 11 | **6, 6, 6 e 11, 11, 11** |
| `BASE_750` nei test | | invariato |
| `Verify` | verde | verde |
| `VerifyFfa` | rosso | rosso, per la stessa causa |
| `VerifyAim` | 10 messaggi | 13 |
| `VerifyLayout` | 48 messaggi | 48 |

**`VerifyAim` non è un peggioramento, ma il 10 di C4-2 non è il riferimento giusto:** un giro con le cornici ne aveva dati 16. Ho rifatto la prova tre volte per parte: C4-4 ne dà 15, 17 e 14, **il commit di base senza C4-4 ne dà 14, 14 e 14**. I messaggi sono gli stessi: freccia sui comandi, testo della mossa su un posto, tocco, partita non finita. La freccia sui comandi, 4 messaggi in ogni giro, c'è anche sulla base e non era nel conto di C4-2: viene dalle partite più che dalle cornici, ma non ne ho cercato la causa.

### Giudizio del proprietario

**Approvato il 4 novembre 2026**, sulle catture del client finale in [catture](client-c4/c4-4/catture/):

- [duello a 1366×768](client-c4/c4-4/catture/duello-1366x768.jpg) e [in grigi](client-c4/c4-4/catture/duello-grigi-1366x768.jpg);
- [FFA a 844×390](client-c4/c4-4/catture/ffa-844x390.jpg) e [in grigi](client-c4/c4-4/catture/ffa-grigi-844x390.jpg);
- [catalogo a 1366×768](client-c4/c4-4/catture/catalogo-1366x768.jpg), [editor a 844×390](client-c4/c4-4/catture/editor-844x390.jpg), [ispezione](client-c4/c4-4/catture/ispezione-1366x768.jpg).

Sottoposti al giudizio: lo spessore sul tavolo, la distinzione in grigi, soprattutto tra oggetto, token e legata a 36 px, dove le scritte non si leggono, e la minore densità del catalogo.

### Non verificato

- iPhone e Safari: cornici, linguette e fascia a 750×292 reali. L'SVG del catalogo gira solo su Edge.
- Il ripiego neutro in partita reale: oggi nessuna carta del catalogo ci arriva, quindi è provato in unità e nel [foglio delle proposte](client-c4/c4-4/proposte/fogli-mano-v1-medio-1366x768.jpg).
- Il token: oltre ai test, visto in cattura reale quando la partita lo produce, non in un controllo di partita sicuro di incontrarlo.
- Il segno vuoto con un ruolo davvero ignoto servito dal server: provato solo sul prototipo.

## C4-5a — Integrazione dello sfondo del tavolo (O2)

4 novembre 2026; **approvato dal proprietario il 5 novembre 2026, O2 chiusa**. Giudizio letterale: «sottobicchiere sul bordo va bene, gli oggetti sullo sfondo si vedono bene, le carte attenuate lasciano trasparire il sotto ma i testi si leggono lo stesso». Dalla stessa prova nascono O26 (scarto della carta legata) e O27 (oggetti propri sul posacenere), assegnate a C4-5a-bis nella [roadmap](../client-roadmap.md#osservazioni-della-prova-di-c4-5a). Nessun push.

### Decisione, provenienza e conversione

Il proprietario ha scelto **piano 2 stirato a tutta scena e tre sprite non stirati**, modalità **S**, giudicando **S-piano2 la migliore**. È la decisione esplicita del 4 novembre 2026 che sostituisce nel [piano](../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2) il precedente obiettivo «nessuna deformazione alle tre misure». Non è un’approvazione della leggibilità sul client finale.

Le [schede del piano e degli sprite](../design/client-c4/background/layers/NOTA.md), l’[inventario](../design/client-c4/assets/README.md) e [conversione.json](client-c4/c4-5a/conversione.json) registrano sorgenti, strumenti, dimensioni, byte e SHA-256 prima/dopo. Controllo della regola 14: riferimenti effettivi H1 e i suoi ritagli, tutti materiali del progetto; impronte coincidenti con schede e metadati, compresi originali e PNG RGBA. Nessun altro candidato entra in public/. Nessun asset di terzi aggiunto.

Termini forniti dal proprietario, riportati letteralmente: **«quelli delle immagini generate da te»**, [fonte](../design/client-c4/background/layers/decisione-proprietario.md). Strumento delle schede: `image_gen.imagegen` integrato; nel PNG stringa osservata `ChatGPT / gpt-image`; versione numerica non esposta. Titolo/URL/versione dei termini, data effettiva di consultazione, account, restrizioni e attribuzioni specifiche restano **non verificati**. L’inventario mantiene l’indicazione di diritti riservati del progetto di CONTRIBUTING, affiancata alla dichiarazione ricevuta, senza dedurre esclusività o condizioni ulteriori. C2PA conservato negli originali: firma e certificati non verificati; metadati rimossi dalle WebP.

Confrontate **qualità 80 e 90**: [venature a pixel nativi](client-c4/c4-5a/grain.webp), ordine originale/80/90. A 80 noto blocchi e perdita di trama; a 90 non noto quegli artefatti: scelto **90 per il piano**. Sugli sprite, nel confronto su legno scuro e chiaro ([sottobicchiere](client-c4/c4-5a/edges-sottobicchiere.webp), [Negroni](client-c4/c4-5a/edges-negroni.webp), [posacenere](client-c4/c4-5a/edges-posacenere.webp)), non noto vantaggi visibili di 90: scelto **80 per tutti e tre**. Nessun nuovo alone blu/verde evidente; il contorno scuro illustrato e l’opacità del vetro appartengono già ai PNG. Sono osservazioni visive. L’alfa finale è **identica pixel per pixel** ai tre PNG (0 pixel diversi).

Conversione: **Node 24.13.0, sharp 0.35.5, libvips 8.18.7, libwebp 1.6.0**; lossy WebP, alphaQuality 100, effort 6, smartSubsample true, preset default; nessun nuovo resize/crop, quindi filtro di ridimensionamento **nessuno**. Le tavole di controllo sono lossless, fuori dal download del client. Le conversioni provvisorie e gli script restano fuori dal repository.

### Codice e geometria

`background.ts` è pura: sx=W/2006, sy=H/784; piano all’origine e dimensione W×H; centro sprite (xi·sx, yi·sy), scala uniforme **√(sx·sy)** dopo la normalizzazione altezza nominale/altezza intrinseca. `scene.ts` legge `texture.orig`, assegna trasformazioni assolute e non moltiplica mai quelle del resize precedente. Ombre: ellissi #100905, alfa 0,18/0,23/0,23, dimensioni e offset di NOTA.md, BlurFilter Pixi a quattro passaggi con forza max(0,3; 3·scala), separato per ciascun oggetto. Ordine: piano, tutte le ombre, tutti gli sprite, gioco. Nessun mascheramento dietro il bordo del tavolo.

| Misura | sx | sy | Scala uniforme sprite | Deformazione verticale del piano | Massimo assoluto ammesso dal test |
|---|---:|---:|---:|---:|---:|
| 1366×768 | 0,680957 | 0,979592 | 0,816737 | +43,8551% | 43,86% |
| 844×390 | 0,420738 | 0,497449 | 0,457488 | +18,2325% | 18,24% |
| 750×292 | 0,373878 | 0,372449 | 0,373163 | −0,3823% | 0,39% |

I test nuovi controllano copertura completa, centri e dimensioni attesi indipendenti, proporzioni degli sprite, ombre e applicazione ripetuta al renderer (andata/ritorno fra le tre misure), anche con risoluzioni intrinseche diverse. La deformazione riguarda **solo il piano**, deliberatamente. Non cambiano geometria di posti, mano, pile, comandi o codice compatto. `readability.ts`, `style.css`, `readability.test.ts` (compreso **BASE_750**) e `assets.test.ts` sono identici a C4-4. `.brand` non è stata spostata. Eventi disattivati su piano, sprite e decorazioni; nessuno di essi è negli hit o può intercettare tocchi sul gioco. O24 e O25 restano futuri. Il backdrop HTML già riferiva table.webp: usa ora lo stesso piano; sprite e ombre sono solo nella scena.

**Atteso cambiato, con motivazione:** `size.test.ts` fissava ancora 1672×941, dimensioni del vecchio tavolo. Il primo giro è quindi rosso solo su quel dato ([diagnosi](client-c4/c4-5a/diagnostica/test-dimensioni.json), [riepilogo](client-c4/c4-5a/diagnostica/run-summary-iniziale.json)). Aggiornato a **2006×784**, sorgente deliberatamente scelta dal proprietario, e aggiunte le tre dimensioni intrinseche degli sprite. Nessun atteso della geometria di gioco o soglia rilassati; test della regola 10 invariato. Ripetuto poi tutto il giro ufficiale: **230/230 test e 7/7 passi verdi**. Un precedente avvio del jar era stato fermato da `Get-FileHash` non trovato nel sottoprocesso Windows PowerShell: corretto solo PSModulePath del processo, nessun cambio agli script del progetto.

### Verifiche e Size

[JSON ufficiali e test](client-c4/c4-5a/ufficiale/), [riepilogo del lancio](client-c4/c4-5a/ufficiale/run-summary.json). `VerifyAll -Only 'test,build,size,verify,layout' -Measures '1366x768,844x390'`: **7/7 verdi in 6 min 09 s**, su Node isolato 24.13.0. Porte libere prima del lancio, jar ricostruito offline, database temporanei, un controllo alla volta; fermati solo processi propri. PC dedicato a questo lavoro durante le misure. Non è il consolidamento completo di C4-9 (`-Only`). HEAD di base del giro finale **6a00b54**, più le modifiche del blocco; l’unico commit sopraggiunto rispetto alla misura iniziale è documentale (approvazioni C4-3/C4-2). Client finale `dist` **56c79f79ca274f09**, jar ufficiale **8aa936b0ddb0b7ef**; i rilanci 750 e le catture ricostruiscono il jar, con stesso sorgente e stesso client, hash dichiarati nelle rispettive evidenze.

| Size | Prima (C4-4, rimisurato) | Dopo C4-5a | Limite |
|---|---:|---:|---:|
| JS gzip | 334 343 B | 337 244 B | 524 288 B (500 KiB) |
| Totale gzip | 1 117 978 B | 1 668 219 B | 4 194 304 B (4 MiB) |
| Texture decodificate | 18 876 320 B | 27 729 048 B | rigido 67 108 864 B; C4 **33 554 432 B** |
| Atlante | 2048×1536 | 2048×1536 | lato massimo 2048 |

[Size prima](client-c4/c4-5a/size-before.json), [dopo](client-c4/c4-5a/ufficiale/size.json). Margine sul tetto C4: **5 825 384 B**. Nessun vecchio tetto JS 400 KB/totale 2,2 MB ripristinato. Texture: intestazioni raster ×4 RGBA, secondo il metodo di Size; non è una misura della memoria GPU complessiva o dei framebuffer.

**Frame FFA osservati:** a 1366×768 p95 **10,2 e 10,4 ms**, picchi **127,2 e 77,4 ms**, frazione entro 20 ms **0,991 e 0,998**, input massimo **25,6 ms**. A 844×390 p95 **8,5 e 10,7 ms**, picchi **70,9 e 63,5 ms**, frazione entro 33 ms riportata **1,000** (arrotondata: i picchi restano), input massimo **18 ms**. Il criterio passa; non sono una misura dell’iPhone né una stima isolata del costo delle decorazioni.

Verifiche comuni [registrate separatamente](client-c4/c4-5a/repository/common-checks.json): **verdi** `./scripts/build.ps1 -Task Test -Offline` (compresi i 36 test client-debug) e `python scripts/check-rules.py`. Ulteriori controlli di CONTRIBUTING eseguiti in sequenza, con esiti distinti:

- **TestServerContext offline: rosso**, 373 test, 1 fallimento: `WebSocketIdentityTest.databaseFailureReturnsPrivateGenericError`, riga 162. Il test simula una DataAccessResourceFailureException; dopo SUBSCRIBE e SEND immediato attende 4 s sulla coda privata account/error, ma riceve null. **Ripetizione del solo metodo: verde**, 1/1 in 8,689 s. La causa precisa dell’intermittenza non è accertata; non considero il singolo verde una sanatoria del giro completo. Il test non carica client-web; sorgenti e test server invariati. Nessuna modifica fuori ambito. [Diagnosi e impronte delle evidenze](client-c4/c4-5a/repository/diagnostica.json).
- **verify-match-manifests.py: rosso**, riga 53: l’audit richiede ancora `rulesVersion == 1.6`, mentre gli export CLI appena prodotti dal contesto in `.build-logs/` riportano **1.10**, regolamento corrente. Non cambiati lo script o l’atteso, non rigenerato alcun manifest I22 tracciato per farlo coincidere con la versione attuale. [Dettaglio dell’audit](client-c4/c4-5a/repository/diagnostica.json).

Il contesto Spring completo ha la propria esecuzione: il suo rosso non viene nascosto dai test unitari verdi né confuso con l’avvio applicativo, riuscito durante le partite reali. Questi due esiti separati restano da trattare fuori dal perimetro grafico. Nessuna modifica a regole di gioco, server, protocollo, catalogo o client-debug.

### 750×292: non regressione, con rossi dichiarati

[Esiti e confronto con C4-4](client-c4/c4-5a/base-750x292/), stessa build client finale. Build verde; **Verify rosso in entrambi i tentativi**, sul timeout di `status-tip` durante hover del gettone, riga 98 del verificatore. **VerifyLayout rosso, 48 messaggi come C4-4**, nessun errore di pagina. Stesse cause: sovrapposizioni fra posti/mano, carte del round senza spazio e relativo collegamento assente, primi piani nel posto, rapporto fra personaggio proprio e altrui; nel percorso chips un tocco sul gettone proprio raggiunge un altro personaggio, come già documentato in C4-2/C4-4.

| layoutProblems reali, tre turni | C4-4 | C4-5a |
|---|---|---|
| Duello | 6, 6, 6 | **6, 6, 6** |
| FFA | 11, 11, 11 | **11, 11, 11** |

`BASE_750` è invariato e passa: 2 posti [6,6,6,5], 5 posti [11,11,12,14], con 0–3 oggetti per posto. **Nessun aumento ammesso.** Non ho trasformato 750×292 in un obiettivo di adattamento.

Diagnosi supplementare: [Verify sulla build precedente](client-c4/c4-5a/diagnostica/baseline/verdetto.json) è verde in questo giro (8 partite, una sola tipologia di personaggio arrivata all’esito, come registra il suo JSON: non equivale a una nuova copertura completa). Su partite diverse questo non risolve l’intermittenza. Ho quindi confrontato i gettoni **sulla stessa vista del server** nelle due build: [viste-e-gettoni.json](client-c4/c4-5a/catture/viste-e-gettoni.json). In duello il gettone avversario a (399,3; 124,232) resta coperto dalla mano e **non mostra il tip in entrambe**; il gettone proprio lo mostra in entrambe. In FFA i tre campioni rispondono in entrambe. Coordinate, visibilità e testi coincidono. Questo riproduce il difetto preesistente senza attribuirlo al fondo nuovo; nessun tentativo di far diventare verde il controllo cambiandone attesi o soglie.

**Frame FFA a 750×292:** p95 9,7 e 9,1 ms, picchi 57,7 e 39,4 ms; frazione entro 33 ms riportata 1,000 (arrotondata), input massimo 18,2 ms. Nessun rosso aggiunto dalle prestazioni.

**Non rifatti del giro completo 750:** VerifyFfa e VerifyAim, né gli altri percorsi del consolidamento. Qui eseguiti solo Build, Verify (due tentativi) e VerifyLayout, più il confronto mirato della stessa vista. I rossi non sono nascosti da una pubblicazione automatica.

### Catture, osservazioni dell’agente e giudizio richiesto

Otto JPEG, **1 534 685 B in tutto**, in [catture](client-c4/c4-5a/catture/). Duello e FFA reali, carte e plance correnti, mano alzata con focus, pile e scritta; le coppie prima/dopo a 1366×768 sono sulla **stessa vista del server e con lo stesso ordine della mano**, dopo un nuovo accesso a entrambe le build. Il controllo delle catture ha rilevato che il riaccesso può ricostruire diversamente l’ordine locale: le catture sono state rifatte ricaricando anche il prima, senza modificare il prodotto o allentare il confronto.

| Scena | 1366×768 | 844×390 | 750×292 |
|---|---|---|---|
| Duello | [prima](client-c4/c4-5a/catture/duello-prima-1366x768.jpg) / [dopo](client-c4/c4-5a/catture/duello-1366x768.jpg) | [dopo](client-c4/c4-5a/catture/duello-844x390.jpg) | [dopo](client-c4/c4-5a/catture/duello-750x292.jpg) |
| FFA | [prima](client-c4/c4-5a/catture/ffa-prima-1366x768.jpg) / [dopo](client-c4/c4-5a/catture/ffa-1366x768.jpg) | [dopo](client-c4/c4-5a/catture/ffa-844x390.jpg) | [dopo](client-c4/c4-5a/catture/ffa-750x292.jpg) |

**Osservazioni mie, non misure di contrasto:** il fondo appare più caldo, chiaro e vivace; la carta avorio e le plance scure tengono distinti titoli e numeri alle misure ufficiali. La trama è più insistente: sulle carte non pagabili attenuate si vede attraverso l’illustrazione, particolarmente a destra nella FFA; questo può affaticare o confondere più del fondo precedente. A 750×292 resta l’affollamento noto della mano sopra i posti, e la cascata del round può mancare: lo sfondo non lo corregge.

Gli sprite **non coprono materialmente** posti, pile o comandi perché sono sotto tutto il gioco e senza eventi. Però il posacenere si trova dietro le pile/oggetti a sinistra del duello e dietro una plancia in FFA; il sottobicchiere sotto il proprio posto; il Negroni vicino al margine destro e ai dorsi/comandi compatti. La loro ricchezza visiva può competere con pile e oggetti: non dichiaro assenza di confusione percettiva. Il vetro resta coprente e il raccordo sottobicchiere/bordo è approssimativo con piano stirato e oggetto uniforme, compromesso già descritto in NOTA.md. La scritta conserva il suo posto: nessun nuovo spostamento del layout; i riquadri conservativi di `.brand` restano tra i contatti già noti a 750.

La richiesta di giudizio sul tavolo vero è stata soddisfatta dall’approvazione del 5 novembre 2026 riportata all’inizio di questa sezione: **O2 chiusa**. Le due correzioni emerse dalla prova sono O26 e O27, in C4-5a-bis.

### Non verificato

**iPhone fisico, Safari e contrasto formale** sul disegno composto (C4-8a). Non misurata la memoria GPU reale. Non rifatto il consolidamento completo delle regole 1–9 con VerifyResolution o l’intero giro a 750×292. Termini specifici e validità crittografica C2PA restano non verificati come sopra. Approvazione del tavolo finale ricevuta il 5 novembre 2026.

## C4-5a-bis

5 novembre 2026, base `a9921d1`. **O26: fatto, in attesa del giudizio del proprietario. O27: fase A, nessun codice finale.** Verifiche sospese durante l’occupazione delle porte e riprese dopo il via libera del proprietario. Nessun push. Il blocco potrà dichiararsi «fatto, in attesa del giudizio del proprietario» dopo la scelta e l’implementazione di O27 e le verifiche richieste. L’approvazione di C4-5a, con chiusura di O2, è registrata nel commit documentale `be25814`, prima di queste correzioni.

### O26 — Riproduzione e decisione aggiornata

Riprodotto sul client precedente alla correzione (`dist 56c79f79ca274f09`), in **duello e FFA reali**, a 1366×768 e 844×390, con database temporaneo e jar ricostruito offline. [JSON e riepilogo prima](client-c4/c4-5a-bis/prima/). Catture prima: [duello desktop](client-c4/c4-5a-bis/catture/o26-duel-prima-1366x768.jpg), [FFA desktop](client-c4/c4-5a-bis/catture/o26-ffa-prima-1366x768.jpg), [duello compatto](client-c4/c4-5a-bis/catture/o26-duel-prima-844x390.jpg), [FFA compatta](client-c4/c4-5a-bis/catture/o26-ffa-prima-844x390.jpg).

Il focus mantiene ingrandita la copia in mano dopo la scelta del bersaglio: a 1366×768 l’hit della legata arriva a **239,68×360,7584 px**, contro **214×295,32 px** a riposo. Prima del bersaglio si somma anche `chosen`. I tentativi reali di raggiungere tutte le candidate riescono **10/12 in duello e 6/12 in FFA** sul desktop; **10/12 in entrambi** sul compatto. L’attenuazione precedente dipende dal bersaglio, esclude la legata selezionata, resta dopo la scelta dello scarto e non ha «non scartabile» nell’etichetta accessibile. Il controllo aggiunto a VerifyLayout rende rossi entrambi i giri prima della correzione (56 rilievi O26 per scenario, comprendenti controlli ripetuti).

**Precisazione del proprietario sulla mano:** «no, non ho mai ottenuto una mano di sette carte. durante la scelta dello scarto, la carta legata che si intende giocare rimane vicina la suo bersaglio, ma una sua copia permane comunque nella mano». La riproduzione reale è quindi a **sei carte**; sette resta un caso sintetico nei test. R02, `Player.CARDS_IN_HAND=6`, preparazione e pesca condizionata sotto sei non forniscono un percorso corrente a sette. Le quattro legate di R07 richiedono tutte un bersaglio, anche quando è sé stessi: «senza bersaglio» qui significa **prima della scelta del bersaglio**, non una nuova categoria di legata.

**Decisione successiva del proprietario:** alla proposta di nascondere la copia dopo la scelta del bersaglio ha scelto **«Sì, per tutte le carte in anteprima»**. Questa decisione sostituisce il solo riposo della copia dopo il bersaglio: nessuna copia della carta posata rimane disegnata o toccabile in mano. Il suo spazio e l’ordine locale restano conservati; annullando ricompare nella stessa posizione. La mano del modello e la vista del server restano integre.

### O26 — Modifiche preparate e copertura scritta

`Model.choosingDiscard` deriva dalla scelta corrente: client sbloccato, legata selezionata, scarto regolare ancora da scegliere. Non legge testo, hover, focus o anteprima. Vale prima e dopo il bersaglio; termina quando c’è uno scarto valido, all’annullamento o al blocco della scelta. La funzione pura `handCardState` decide riposo, area ingrandita, presenza in anteprima e alfa. La legata prima del bersaglio resta a riposo anche con focus; dopo il bersaglio tutte le carte selezionate lasciano la mano per la sola anteprima. Solo durante la scelta dello scarto le non scartabili hanno alfa 0,55 e l’etichetta «non scartabile». Le attenuazioni preesistenti di risorse insufficienti e trascinamento mantengono il loro significato.

I gesti di `Model.select`, `aim`, `confirm` e il comando non cambiano. Il server resta il giudice. L’anteprima conserva la stessa geometria, freccia e ✓/×; l’hit semantico della carta si sposta sull’anteprima per l’ispezione con I/Invio. Per il tocco, senza la copia in mano, il menu offre «Dettagli carta giocata». Nessun hit invisibile rimane sopra le candidate.

Test scritti in `hand-choice.test.ts`: tutte le categorie (regolare, base, legata, ultima risorsa, oggetto, token, regolare sconosciuta), con/senza bersaglio, stato attivo e concluso, combinazioni di focus/hover/pagabilità/drag; fasi choose/sending/pending/uncertain, esito, eliminazione, forfait, annullamento e scarto non più presente; tocchi invariati e ripristino dell’ordine anche con sette carte sintetiche. **Eseguiti: 234/234 test del client verdi.** Nessun atteso preesistente o soglia cambiati; BASE_750 invariato.

`VerifyLayout` ora esercita anche O26 sulla partita reale: hit e trasformazioni effettive, alfa ed etichette confrontati con categorie dell’allegato; ogni candidata raggiunta con mouse prima del bersaglio e tocco emulato dopo; nessuna presa della candidata coperta dall’anteprima; nessuna attenuazione di scarto dopo la scelta o annullamento. Controlla inoltre tutte le carte posabili in anteprima, l’ispezione e il ripristino della posizione con ×, senza inviare mosse. **Verde in duello e FFA alle due misure ufficiali e a 750×292: 12/12 candidate raggiunte per scenario, nessun errore O26, ripristino e ispezione verificati.**

### O27 — Fase A da completare

La riga propria del duello parte da sinistra sopra il personaggio per lasciare il centro alle carte del round (C3-L); la FFA usa già il lato destro. Le posizioni decorative sono proporzionali e indipendenti in `background.ts`.

Le tre alternative da confrontare sulla stessa partita reale con 1, 2 e 3 oggetti, a 1366×768, 844×390 e 1920×1080, sono: **A**, lato destro solo se la riga completa entra nello spazio fra personaggio/plancia e mano, senza collisioni, altrimenti sopra; **B**, riga sopra che inizia oltre il bordo destro proporzionale del posacenere; **C**, geometria di gioco invariata e solo posacenere decorativo ricollocato in uno spazio libero, altrimenti posizione attuale. La condizione di A sarà misurata sui box, senza soglia arbitraria di larghezza. C va dichiarata come spostamento dello sprite, non degli oggetti di gioco.

**Catture comparative, layoutProblems, fitScale, effetti su carte del round/pile e raccomandazione ancora da produrre**, dopo il via libera alle prove. Nessuna alternativa è implementata nel prodotto; la scelta del proprietario precederà la fase B.

### Verifiche O26 concluse

[Primo giro ufficiale](client-c4/c4-5a-bis/ufficiale/run-summary.json): **9/9 verdi**, Test (234), Build, Size, Verify e VerifyResolution alle due misure, layout FFA. BM_SCENARIOS=quick,ffa seleziona quick/FFA nella risoluzione e solo FFA nel layout; perciò [secondo giro](client-c4/c4-5a-bis/duello/run-summary.json) aggiunge esplicitamente **duello: 2/2 verdi**. Nessun -Quick, nessun riuso del jar: ricostruito offline prima dei giri, Node 24.13.0 isolato, una verifica per volta, porte libere all’avvio e processi propri chiusi dagli strumenti. Build client **eeeceb8aa87b1770**; impronte dei jar e dei percorsi modificati nei riepiloghi. Non è il consolidamento completo C4-9 (selezione -Only e risoluzione limitata a quick/FFA).

Le catture dopo sono [duello desktop](client-c4/c4-5a-bis/catture/o26-duel-dopo-1366x768.jpg), [FFA desktop](client-c4/c4-5a-bis/catture/o26-ffa-dopo-1366x768.jpg), [duello compatto](client-c4/c4-5a-bis/catture/o26-duel-dopo-844x390.jpg), [FFA compatta](client-c4/c4-5a-bis/catture/o26-ffa-dopo-844x390.jpg). Prima/dopo sono partite distinte della stessa modalità, non un confronto pixel sulla stessa vista. Osservo la copia in mano assente e le candidate leggibili; testo della mossa, freccia e ✓/× conservano la presentazione di C4-2. L’approvazione percettiva resta al proprietario.

**Size:** JS gzip **337.726 B**, totale **1.668.701 B** (+482 B ciascuno rispetto a C4-5a), texture **27.729.048 B**, margine C4 **5.825.384 B**, atlante 2048×1536. Tutti i limiti passano; nessuna soglia rilassata. [Size](client-c4/c4-5a-bis/ufficiale/size.json).

**Frame FFA osservati anche nelle catture dei primi piani:** desktop p95 **11,6/12,8 ms**, massimi **185,1/131,2 ms**, frazione entro 20 ms **0,991/0,991**, input massimo **35,3 ms**. Compatto p95 **10,4/14,3 ms**, massimi **107,8/89,3 ms**, frazione entro 33 ms **0,999/0,999**, input massimo **35,7 ms**. Criterio verde; i picchi isolati restano espliciti. Non sono misure su iPhone.

**750×292:** [giro](client-c4/c4-5a-bis/base-750x292/run-summary.json), **Verify verde** in questa esecuzione; il gettone coperto preesistente non è per questo dichiarato risolto. **VerifyLayout rosso, 47 messaggi e nessun errore di pagina**, contro 48 della prova C4-5a: sovrapposizioni, assenza delle carte del round/collegamento, primi piani e rapporto fra personaggi. Numero di messaggi dipendente dalle partite, nessun miglioramento del formato rivendicato: geometria e BASE_750 invariati; layoutProblems reali **6/6/6 duello e 11/11/11 FFA**, identici alla base. I nuovi controlli O26 passano anche qui, come chips e resize. Frame FFA p95 **10,2/11,6 ms**, massimi **76,6/49,6 ms**, input massimo **23,7 ms**: criterio verde.

[Verifiche repository separate](client-c4/c4-5a-bis/repository.json): **Test offline verde** (anche 36 test client-debug), **check-rules.py verde**, **TestServerContext offline verde, 373/373**. **verify-match-manifests.py rosso**: riga 53 richiede ancora rulesVersion 1.6, mentre gli export correnti usano 1.10; già registrato in C4-5a. Non modificati audit, regole, server, protocollo, catalogo o manifest tracciati per ottenere il verde.

**Non verificato:** iPhone fisico e Safari; nessuna prova su PC li sostituisce. Il giudizio visivo finale di O26 e la scelta tra le proposte O27 restano al proprietario.

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

- **TestServerContext offline: rosso**, 373 test, 1 fallimento: `WebSocketIdentityTest.databaseFailureReturnsPrivateGenericError`, riga 162. Il test simula una DataAccessResourceFailureException; dopo SUBSCRIBE e SEND immediato attende 4 s sulla coda privata account/error, ma riceve null. **Ripetizione del solo metodo: verde**, 1/1 in 8,689 s. La causa precisa dell’intermittenza non è accertata; non considero il singolo verde una sanatoria del giro completo. Il test non carica client-web; sorgenti e test server invariati. Nessuna modifica fuori ambito. [Diagnosi e impronte delle evidenze](client-c4/c4-5a/repository/diagnostica.json). **Diagnosi completata il 5 novembre 2026:** gara nel test (preesistente), corretta con attesa della ricevuta di sottoscrizione; vedi il [rapporto sui due rossi](c4-5a-repository-reds-report.md).
- **verify-match-manifests.py: rosso**, riga 53: l’audit richiede ancora `rulesVersion == 1.6`, mentre gli export CLI appena prodotti dal contesto in `.build-logs/` riportano **1.10**, regolamento corrente. Non cambiati lo script o l’atteso, non rigenerato alcun manifest I22 tracciato per farlo coincidere con la versione attuale. [Dettaglio dell’audit](client-c4/c4-5a/repository/diagnostica.json). **Diagnosi completata il 5 novembre 2026:** atteso obsoleto dal regolamento 1.7, ora agganciato a versione e impronte del repository; vedi il [rapporto sui due rossi](c4-5a-repository-reds-report.md).

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

5 novembre 2026, base `a9921d1`. **Stato del blocco: approvato dal proprietario il 5 novembre 2026. O26 e O27 chiuse.** Giudizio dopo una partita vera: «ho giocato una partita vera e approvo quanto abbiamo fatto». Nessun push. Giudizio C4-5a/O2 nel commit documentale `be25814`; O26 in `f6e69fd`; punto 2 e chiusura documentale nella modifica successiva. Le sospensioni per processi esterni e la pausa richiesta dal proprietario sono terminate; nessun processo altrui è stato fermato.

**Limite accettato esplicitamente dal proprietario alla chiusura:** «Chiudi con le verifiche raccolte e dichiara il limite». I giri grafici usano il jar ricostruito su **f6e69fd**, con il client O27 finale **6fd49130507af819**. Durante la pausa sono entrati i commit SB-3/SB-4 `1ab6464` e `af6e8b2`: il contesto Spring è verde su questa versione corrente, ma **non è stato effettuato un nuovo giro grafico sul suo jar**. I tentativi di lanciarlo sono stati bloccati dai controlli preventivi per nuovi processi Maven/Java esterni. Le modifiche server di quei commit non appartengono a C4-5a-bis. Il consolidamento dell’integrazione corrente resta distinto dalla verifica del blocco client qui riportata.

### O26 — Riproduzione e decisione aggiornata

Riprodotto sul client precedente alla correzione (`dist 56c79f79ca274f09`), in **duello e FFA reali**, a 1366×768 e 844×390, con database temporaneo e jar ricostruito offline. [JSON e riepilogo prima](client-c4/c4-5a-bis/prima/). Catture prima: [duello desktop](client-c4/c4-5a-bis/catture/o26-duel-prima-1366x768.jpg), [FFA desktop](client-c4/c4-5a-bis/catture/o26-ffa-prima-1366x768.jpg), [duello compatto](client-c4/c4-5a-bis/catture/o26-duel-prima-844x390.jpg), [FFA compatta](client-c4/c4-5a-bis/catture/o26-ffa-prima-844x390.jpg).

Il focus mantiene ingrandita la copia in mano dopo la scelta del bersaglio: a 1366×768 l’hit della legata arriva a **239,68×360,7584 px**, contro **214×295,32 px** a riposo. Prima del bersaglio si somma anche `chosen`. I tentativi reali di raggiungere tutte le candidate riescono **10/12 in duello e 6/12 in FFA** sul desktop; **10/12 in entrambi** sul compatto. L’attenuazione precedente dipende dal bersaglio, esclude la legata selezionata, resta dopo la scelta dello scarto e non ha «non scartabile» nell’etichetta accessibile. Il controllo aggiunto a VerifyLayout rende rossi entrambi i giri prima della correzione (56 rilievi O26 per scenario, comprendenti controlli ripetuti).

**Precisazione del proprietario sulla mano:** «no, non ho mai ottenuto una mano di sette carte. durante la scelta dello scarto, la carta legata che si intende giocare rimane vicina la suo bersaglio, ma una sua copia permane comunque nella mano». La riproduzione reale è quindi a **sei carte**; sette resta un caso sintetico nei test. R02, `Player.CARDS_IN_HAND=6`, preparazione e pesca condizionata sotto sei non forniscono un percorso corrente a sette. Le quattro legate di R07 richiedono tutte un bersaglio, anche quando è sé stessi: «senza bersaglio» qui significa **prima della scelta del bersaglio**, non una nuova categoria di legata.

**Decisione successiva del proprietario:** alla proposta di nascondere la copia dopo la scelta del bersaglio ha scelto **«Sì, per tutte le carte in anteprima»**. Questa decisione sostituisce il solo riposo della copia dopo il bersaglio: nessuna copia della carta posata rimane disegnata o toccabile in mano. Il suo spazio e l’ordine locale restano conservati; annullando ricompare nella stessa posizione. La mano del modello e la vista del server restano integre.

### O26 — Modifiche e copertura

`Model.choosingDiscard` deriva dalla scelta corrente: client sbloccato, legata selezionata, scarto regolare ancora da scegliere. Non legge testo, hover, focus o anteprima. Vale prima e dopo il bersaglio; termina quando c’è uno scarto valido, all’annullamento o al blocco della scelta. La funzione pura `handCardState` decide riposo, area ingrandita, presenza in anteprima e alfa. La legata prima del bersaglio resta a riposo anche con focus; dopo il bersaglio tutte le carte selezionate lasciano la mano per la sola anteprima. Solo durante la scelta dello scarto le non scartabili hanno alfa 0,55 e l’etichetta «non scartabile». Le attenuazioni preesistenti di risorse insufficienti e trascinamento mantengono il loro significato.

I gesti di `Model.select`, `aim`, `confirm` e il comando non cambiano. Il server resta il giudice. L’anteprima conserva la stessa geometria, freccia e ✓/×; l’hit semantico della carta si sposta sull’anteprima per l’ispezione con I/Invio. Per il tocco, senza la copia in mano, il menu offre «Dettagli carta giocata». Nessun hit invisibile rimane sopra le candidate.

Test scritti in `hand-choice.test.ts`: tutte le categorie (regolare, base, legata, ultima risorsa, oggetto, token, regolare sconosciuta), con/senza bersaglio, stato attivo e concluso, combinazioni di focus/hover/pagabilità/drag; fasi choose/sending/pending/uncertain, esito, eliminazione, forfait, annullamento e scarto non più presente; tocchi invariati e ripristino dell’ordine anche con sette carte sintetiche. **Eseguiti: 234/234 test del client verdi.** Nessun atteso preesistente o soglia cambiati; BASE_750 invariato.

`VerifyLayout` ora esercita anche O26 sulla partita reale: hit e trasformazioni effettive, alfa ed etichette confrontati con categorie dell’allegato; ogni candidata raggiunta con mouse prima del bersaglio e tocco emulato dopo; nessuna presa della candidata coperta dall’anteprima; nessuna attenuazione di scarto dopo la scelta o annullamento. Controlla inoltre tutte le carte posabili in anteprima, l’ispezione e il ripristino della posizione con ×, senza inviare mosse. **Verde in duello e FFA alle due misure ufficiali e a 750×292: 12/12 candidate raggiunte per scenario, nessun errore O26, ripristino e ispezione verificati.**

### O27 — Fase A, confronto precedente alla scelta

[Confronto e 27 catture](client-c4/c4-5a-bis/proposta-o27/README.md), [dati delle partite](client-c4/c4-5a-bis/proposta-o27/proposal.json), [sonda pura](client-c4/c4-5a-bis/proposta-o27/probe.json). Tre partite **open 1vCom reali**, sul database temporaneo, con mazzi salvati dall’editor per garantire 1, 2 e 3 oggetti propri. Due round reali prima delle catture; ogni alternativa e misura rientra sulla stessa vista del turno 2. Mano di quattro carte dopo le mosse; la condizione di spazio protegge comunque l’ingombro conservativo di sette carte, anche alzate. Non sono catture di una partita umana 1v1; il duello usa la stessa funzione geometrica. 1920×1080 serve solo alle catture comparative, non diventa una misura ufficiale.

| Alternativa | Risultato della prova | Effetto su C3-L, round e pile |
|---|---|---|
| **A — destra quando entra tutta la riga**, altrimenti sopra | Sul grande sposta 1–2 oggetti; con 3 e alle misure ufficiali mantiene la riga superiore. Passo 0,75 della carta come in FFA, pile conservate alla quota originale. | 0 layoutProblems nelle nove scene; fattori invariati; box di round, pile e mano identici alla base. |
| **B — riga sopra oltre il bordo proporzionale del posacenere** | Libera il posacenere anche sul desktop; nel compatto rimpicciolisce il posto proprio e con 3 oggetti scompare il round. | A 844 fattori proprio/altri/oggetti/risorse da 1,5/1/1/1,1 a 1/1/1/1; layoutProblems 0/1/2 con 1/2/3 oggetti. Non accettabile nella forma provata. |
| **C — spostare solo posacenere e ombra** nel più vicino spazio libero, altrimenti posizione attuale | Sul grande trova un posto per lo sprite intero, anche con 3 oggetti. Alle due misure ufficiali non trova spazio e conserva la posizione. | Tutta la geometria di gioco identica, 0 layoutProblems nelle nove scene. Cambia invece la composizione decorativa già approvata in O2. |

**Raccomandazione della fase A, precedente alla scelta: A.** usa il vuoto a destra soltanto quando disponibile, conservando il centro, le scale e la decorazione approvata. Limite esplicito: con tre oggetti sul grande resta la riga sopra. **C era un’alternativa nella fase A, poi esclusa dal proprietario**, per liberare il posacenere anche in quel caso, cambiandone la posizione. B richiederebbe una nuova proposta con ripiego nel compatto prima di poter rispettare la regola 17.

La [condizione misurabile di A](client-c4/c4-5a-bis/proposta-o27/README.md#geometria-e-limiti) verifica tutti i box della riga, il viewport e la mano espansa con un margine di 8 px, non una soglia di larghezza. La sonda supplementare alle tre misure più 750×292, 2/5 posti e 1–3 oggetti per posto, conferma per A/C nessun calo di fattori né aumento dei problemi, pile/round invariati; **box FFA identici alla base per tutte le alternative**. È evidenza di proposta, non sostituisce test e verifiche finali della fase B.

Le catture finali hanno un controllo esplicito della variante caricata. Scartate le prove preliminari in cui una navigazione al solo hash conservava la build precedente. Tutti i prototipi sono copie isolate in .tools; i [diffs A/B/C](client-c4/c4-5a-bis/proposta-o27/README.md#geometria-e-limiti) sono solo materiale di revisione. Al momento della fase A non era ancora presente codice definitivo O27 nel client. Le 27 catture O27 pesano **4.245.142 B**; con le otto O26, **5.475.114 B**, circa 5 MB in tutto.

La fase A si è fermata alla scelta. La decisione successiva e lo stato della fase B sono riportati sotto; la fase B e i risultati conclusivi sono riportati sotto.

### O27 — Fase B

**Decisione del proprietario:** alternativa A, con precedenza al passo pieno del duello (`larghezza + 6 px`); se tutta la riga non entra, provare `0,75 × larghezza`; se neppure questo entra, mantenere la riga sopra. **C esclusa e non combinata con A:** il proprietario segnala che la nuova posizione del posacenere nella cattura grande a tre oggetti copre la scritta BOTTE MICIDIALI. Sprite, ombra, background.ts e asset decorativi restano invariati.

**Implementazione:** `ownItemRow` in readability.ts è pura: costruisce la riga a destra del personaggio con i due passi nell’ordine scelto e controlla tutti i box dentro il viewport; i box espansi di 8 px su ogni lato devono restare fuori dal box conservativo della mano di sette carte, alzata e zoom compresi. Nessuna soglia arbitraria di larghezza. `arrange` applica la scelta solo agli oggetti propri effettivamente presenti nel duello, dopo aver fissato mano e pile nella geometria originale, prima di disporre il round. La FFA mantiene integralmente il percorso precedente. Nessuna modifica a tocchi, regole, server, protocollo o catalogo.

**1920×1080, controllo unitario della condizione geometrica:** bordo sinistro conservativo della mano **691,72 px**. Con il passo pieno il bordo destro espanso della riga è **581,50 / 701,50 / 821,50 px** con 1/2/3 oggetti. Quindi **1: passo pieno**, **2: ripiego 0,75**, **3: riga sopra**. Le [catture definitive](client-c4/c4-5a-bis/fase-b/README.md) confermano lo stesso risultato in tre partite reali.

**K7:** con il passo pieno non c’è sovrapposizione tra oggetti propri: il passaggio «primo tocco per alzare l’oggetto coperto» non interviene. Nel ripiego 0,75 con due oggetti sul grande, la sovrapposizione resta e il comportamento K7 preesistente resta necessario; non è stato eliminato né dalla FFA né dal ripiego. Nelle misure ufficiali e a 750×292 la riga resta sopra nella matrice provata.

**Unità: 236/236 verdi**, Node isolato 24.13.0, `./client-web/run.ps1 -Task Test`. [Esito e matrice](client-c4/c4-5a-bis/fase-b/o27-unit.json). Nuovi test in own-items.test.ts; 72 combinazioni (quattro misure, 2/5 posti, 1–3 oggetti propri incrociati con 1–3 degli altri). Snapshot di confronto o27-before.json ricavato dal codice committato **f6e69fd**, prima di O27: ogni box FFA identico alla base, nessun fattore cala, mano/pile/round e posti avversari identici, nessun aumento dei layoutProblems e a 750×292 stessi problemi della base. I test preesistenti e BASE_750 non sono modificati. Casi puri aggiuntivi: ordine dei ripieghi, confine esatto del margine, riga fuori viewport, nessuna mutazione e riga vuota.

### Verifiche finali O27

[Primo giro](client-c4/c4-5a-bis/fase-b/giro-iniziale/run-summary.json): **8/9 verdi**, con Test (236), Build, Size, Verify e VerifyResolution quick/FFA verdi alle due misure ufficiali; layout compatto verde. Unico rosso: due rilievi d’ispezione sul desktop per BadEducation, il cui nome GUI finisce con uno spazio. Il verificatore leggeva innerText, che elimina quello spazio. Non era un difetto di geometria o di gioco: **corretto soltanto il verificatore** per leggere il textContent dell’h2 e confrontarlo esattamente con il nome ricevuto, senza normalizzarlo o cambiare attesi. [Diagnosi](client-c4/c4-5a-bis/fase-b/diagnostica.json).

[Ripetizione interessata dalla correzione](client-c4/c4-5a-bis/fase-b/ufficiale/run-summary.json): **5/5 verdi**, 236 test, Build, Size e VerifyLayout completo alle due misure, con duello, FFA, chips e resize. Il client dist è identico al primo giro, **6fd49130507af819**: Verify e VerifyResolution già verdi si riferiscono alla stessa build. Il caso reale deterministico `PERMESSO SCUSA ORA SMETTI ` (spazio finale) passa da tastiera e da menu nelle [catture finali e relativi dati](client-c4/c4-5a-bis/fase-b/o27-final.json). I rossi iniziali sono conservati; nessuna soglia rilassata, nessun atteso preesistente o nome carta modificato. Non è il consolidamento C4-9: selezione -Only e risoluzione limitata a quick/FFA.

Jar ricostruiti offline prima dei giri, Node isolato **24.13.0**, verifiche in serie e controlli di processi Maven/Java e porte 8080/4320 prima dei lanci. Size scrive nell’evidenza temporanea con BM_OUT; il vecchio size.json di C2 non cambia. Riavvii e arresti degli strumenti riguardano soltanto i processi propri. Il contesto interrotto per la pausa non è contato come verde: è stato rieseguito.

**Size finale:** JS gzip **337.939 B**, totale **1.668.915 B** (+213/+214 B rispetto a O26), texture **27.729.048 B**, margine sul tetto C4 **5.825.384 B**, atlante 2048×1536. Tutti i limiti passano. [Size](client-c4/c4-5a-bis/fase-b/ufficiale/size.json). Asset, posizioni dello sfondo e sprite sono invariati.

**Frame FFA guardati anche nelle catture dei primi piani:** desktop p95 **9,7/12,6 ms**, massimi **150,2/116,5 ms**, frazione entro 20 ms **0,995/0,992**, input massimo **32,3 ms**; compatto p95 **10,8/12,3 ms**, massimi **90,8/55,6 ms**, frazione entro 33 ms **0,999/0,999**, input massimo **28,6 ms**. Criterio verde, con picchi isolati espliciti. Non è una misura del costo isolato della nuova disposizione o di un telefono.

**750×292:** [Verify verde e primo layout](client-c4/c4-5a-bis/fase-b/base-750x292/run-summary.json); layout rosso con 47 messaggi. Una nuova attività Maven esterna è stata rilevata prima delle catture: nessuna cattura è partita durante quel controllo e il layout 750 è stato [ripetuto per precauzione](client-c4/c4-5a-bis/fase-b/base-750x292-ripetizione/run-summary.json) dopo un controllo negativo di processi e porte. **Ultimo layout: 48 messaggi, nessun errore di pagina**, come la base C4-5a. Le stesse 47 voci di geometria/round/primi piani più una voce di gettone non raggiunto correttamente dall’ispezione; nel primo giro quest’ultima era passata. Nessun miglioramento del difetto del gettone rivendicato. LayoutProblems reali **6/6/6 in duello, 11/11/11 in FFA**; BASE_750 invariato. O26 passa in entrambe le modalità anche qui. Frame FFA dell’ultima misura: p95 **9/12,1 ms**, massimi **65,5/58,8 ms**, input massimo **24 ms**, criterio verde.

**Catture definitive:** [uno, due e tre oggetti a 1920×1080](client-c4/c4-5a-bis/fase-b/README.md); dati anche delle sei scene ufficiali nello stesso JSON, tutti al turno 2 di partite open reali. A 1920, con **1 oggetto** il primo tocco apre l’ispezione (passo pieno, nessun K7); con **2** il primo tocco alza l’oggetto coperto e il secondo apre l’ispezione (ripiego 0,75); con **3** resta sopra e il primo tocco apre l’ispezione. Nessuna mossa inviata dalle prove di tocco. Le mie osservazioni: il lato destro resta separato dalla mano; con due oggetti resta la copertura parziale deliberatamente prevista dal ripiego; con tre resta la copertura del posacenere da parte della riga superiore, conseguenza del ripiego scelto, senza spostare lo sprite. Pile e round mantengono i box della base. Il giudizio di leggibilità resta al proprietario. Corpus JPEG complessivo **6.197.100 B**, comprendente 27 confronti della fase A, otto O26 prima/dopo e tre definitive O27.

[Verifiche comuni finali](client-c4/c4-5a-bis/fase-b/repository.json): **Test offline verde**, completato prima della pausa (inclusi i 36 test client-debug); **check-rules.py verde** dopo la ripresa. **TestServerContext verde sul parent corrente af6e8b2: 402 test, zero fallimenti/errori, 3 skip** (BotStylesMeasureTest, SimulationControlTest, SimulationMeasureTest), senza contare il giro interrotto. **verify-match-manifests.py resta rosso**, riga 53: richiede rulesVersion 1.6 contro gli export correnti 1.10; già dichiarato, non modificati audit o manifest per forzarlo al verde. I verdi del contesto corrente non sostituiscono il giro grafico del nuovo jar, non svolto per la decisione esplicita di chiusura sopra riportata.

### Verifiche O26 concluse

[Primo giro ufficiale](client-c4/c4-5a-bis/ufficiale/run-summary.json): **9/9 verdi**, Test (234), Build, Size, Verify e VerifyResolution alle due misure, layout FFA. BM_SCENARIOS=quick,ffa seleziona quick/FFA nella risoluzione e solo FFA nel layout; perciò [secondo giro](client-c4/c4-5a-bis/duello/run-summary.json) aggiunge esplicitamente **duello: 2/2 verdi**. Nessun -Quick, nessun riuso del jar: ricostruito offline prima dei giri, Node 24.13.0 isolato, una verifica per volta, porte libere all’avvio e processi propri chiusi dagli strumenti. Build client **eeeceb8aa87b1770**; impronte dei jar e dei percorsi modificati nei riepiloghi. Non è il consolidamento completo C4-9 (selezione -Only e risoluzione limitata a quick/FFA).

Le catture dopo sono [duello desktop](client-c4/c4-5a-bis/catture/o26-duel-dopo-1366x768.jpg), [FFA desktop](client-c4/c4-5a-bis/catture/o26-ffa-dopo-1366x768.jpg), [duello compatto](client-c4/c4-5a-bis/catture/o26-duel-dopo-844x390.jpg), [FFA compatta](client-c4/c4-5a-bis/catture/o26-ffa-dopo-844x390.jpg). Prima/dopo sono partite distinte della stessa modalità, non un confronto pixel sulla stessa vista. Osservo la copia in mano assente e le candidate leggibili; testo della mossa, freccia e ✓/× conservano la presentazione di C4-2. L’approvazione percettiva resta al proprietario.

**Size:** JS gzip **337.726 B**, totale **1.668.701 B** (+482 B ciascuno rispetto a C4-5a), texture **27.729.048 B**, margine C4 **5.825.384 B**, atlante 2048×1536. Tutti i limiti passano; nessuna soglia rilassata. [Size](client-c4/c4-5a-bis/ufficiale/size.json).

**Frame FFA osservati anche nelle catture dei primi piani:** desktop p95 **11,6/12,8 ms**, massimi **185,1/131,2 ms**, frazione entro 20 ms **0,991/0,991**, input massimo **35,3 ms**. Compatto p95 **10,4/14,3 ms**, massimi **107,8/89,3 ms**, frazione entro 33 ms **0,999/0,999**, input massimo **35,7 ms**. Criterio verde; i picchi isolati restano espliciti. Non sono misure su iPhone.

**750×292:** [giro](client-c4/c4-5a-bis/base-750x292/run-summary.json), **Verify verde** in questa esecuzione; il gettone coperto preesistente non è per questo dichiarato risolto. **VerifyLayout rosso, 47 messaggi e nessun errore di pagina**, contro 48 della prova C4-5a: sovrapposizioni, assenza delle carte del round/collegamento, primi piani e rapporto fra personaggi. La singola voce in meno è il controllo del gettone proprio: nel giro precedente mancava il testo nell’ispezione, in questo giro è passato; tutte le altre categorie di messaggi hanno gli stessi conteggi (15 rapporto proprio/altri, 10 assenze, 8 sovrapposizioni dei primi piani, 6 overlaps, 6 layout, 2 primi piani nel posto). Nessun miglioramento del formato rivendicato: geometria e BASE_750 invariati; layoutProblems reali **6/6/6 duello e 11/11/11 FFA**, identici alla base. I nuovi controlli O26 passano anche qui, come chips e resize. Frame FFA p95 **10,2/11,6 ms**, massimi **76,6/49,6 ms**, input massimo **23,7 ms**: criterio verde.

[Verifiche repository separate](client-c4/c4-5a-bis/repository.json): **Test offline verde** (anche 36 test client-debug), **check-rules.py verde**, **TestServerContext offline verde, 373/373**. **verify-match-manifests.py rosso**: riga 53 richiede ancora rulesVersion 1.6, mentre gli export correnti usano 1.10; già registrato in C4-5a. Non modificati audit, regole, server, protocollo, catalogo o manifest tracciati per ottenere il verde.

**Non verificato:** iPhone fisico e Safari; nessuna prova su PC li sostituisce. Il giudizio visivo finale su O26 e O27 è stato espresso dal proprietario il 5 novembre 2026 dopo una partita vera: «ho giocato una partita vera e approvo quanto abbiamo fatto»; blocco approvato. Il nuovo giro grafico sul jar SB-3/SB-4 corrente non è stato svolto, come esplicitamente accettato alla chiusura.


## C4-5b

5 novembre 2026. **Approvato dal proprietario il 6 novembre 2026** ([approvazione](#approvazione-di-c4-5b)). Fase B completata secondo le scelte A/B del 5 novembre 2026. Nessun cambiamento a regole, server, protocollo, catalogo, asset o geometria.

### Fase 0 — Riformattazione del CSS

Preliminare: stato Git pulito in `client-web/` e `docs/reports/`; approvazione C4-5a-bis registrata separatamente in `9df4bd5`.
`style.css` passa da 156 a 1460 righe: cambiano solo gli spazi conservati nei campi `raws` del parser PostCSS 8.5.32. Script e copia precedente fuori dal repository, in TEMP.

[Prova meccanica](client-c4/c4-5b/fase-0/equivalenza-css.json): alberi analizzati identici dopo aver escluso soltanto posizione e spazi di formattazione; **273 regole, 886 dichiarazioni, 14 direttive, 9 commenti**, stesso ordine, selettori, parametri, valori e `!important`. Anche la minificazione con Lightning CSS 1.33.0 è identica byte per byte: 19.359 B, SHA-256 `b5f70d822f325eea1998c9668984c34128b1235f06cc8e2424bb73734aa3b81d`.

`VerifyAll -Only 'test,build,size'`, prima e dopo, ricostruisce il jar; **236/236 unità verdi**, Build e Size verdi. [Prima](client-c4/c4-5b/fase-0/prima-run-summary.json), [dopo](client-c4/c4-5b/fase-0/dopo-run-summary.json): gli stessi **21 file distribuiti**, impronta `6fd49130507af819`. [Size prima](client-c4/c4-5b/fase-0/prima-size.json) e [dopo](client-c4/c4-5b/fase-0/dopo-size.json): CSS 19.411 B / 4.889 B gzip; JS gzip 337.939 B; totale gzip 1.668.915 B; texture 27.729.048 B, sotto 32 MiB. Nessuna crescita del CSS distribuito.

Un primo tentativo si era fermato prima dei test perché Windows PowerShell ereditava un percorso moduli incompatibile con `Get-FileHash`; ripetuto con `PSModulePath` di Windows PowerShell. Nessun verificatore modificato, nessuna soglia o atteso cambiati. Il contesto Spring completo resta una verifica separata.

Verifiche obbligatorie di Fase 0: `./scripts/build.ps1 -Task Test -Offline` verde (339 test server, 3 saltati, nessun errore; 36/36 client-debug); `python scripts/check-rules.py` verde. Non è una prova di avvio del contesto Spring completo.


### Fase A — Inventario, prima odierno e proposta

**Stato alla consegna della Fase A (storico):** lavoro fermato alla proposta; la scelta è poi arrivata ed è registrata in Fase B. In questa fase la sola modifica a produzione è la riformattazione equivalente già committata in `11bc95e`; niente token applicati, TSX, scene, geometria, sfondo, regole, server, protocollo, catalogo o nuovi asset. Nessun push. Script, calcoli e prototipi eseguibili in TEMP, fuori repository.

- [Inventario](../design/client-c4/screens/inventario.md): tutte le schermate elencate nel piano, più linea caduta, scelta mazzo vuota/piena, conferme inline, ispezioni carta/personaggio, preparazione ed errore grafico; file, selettori, colori/font, controlli, dimensioni e stati. L’editor mantiene struttura e azioni; O15/O16 restano fuori. O26/O27 approvate non vengono riaperte.
- [Censimento](../design/client-c4/screens/censimento.md), con [ogni occorrenza in JSON](../design/client-c4/screens/censimento.json): **67 valori CSS** (comprese trasparenze), **158 occorrenze**, **18 dichiarazioni font**. Nei TSX nessun esadecimale/rgb/hsl letterale o font inline; 29 definizioni di **25 tinte condivise** per simboli/cornici, censite separatamente. Ripiego Arial Narrow ancora presente nel CSS: proposta di sostituirlo con Arial, secondo D4; non ancora applicata.
- [Prima del 5 novembre 2026](client-c4/c4-5b/prima/README.md), con [galleria](client-c4/c4-5b/prima/galleria.html), [misure DOM](client-c4/c4-5b/prima/catture.json) e [manifest](client-c4/c4-5b/prima/manifest.json): **104 JPEG, 5.829.920 B (5,56 MiB), 38 schermate/stati**, a 1366×768, 844×390 e 390×844 dove ammesso. La rotazione esiste solo in portrait; al tavolo portrait copre la scena. I dialoghi si leggono in portrait senza l’illustrazione grande. Selezionati 100 scatti dedicati su 115, omettendo 15 duplicati di stato; conservate le loro misure nel JSON. Aggiunti solo quattro scatti odierni del giro ufficiale (tooltip e FFA), ricompressi. Nessuna vecchia cattura usata come “prima”.
- [Proposta e mappa di token da approvare](../design/client-c4/screens/proposta.md), [varianti A/B affiancate](../design/client-c4/screens/proposte/README.md): 20 campioni originali e cinque confronti, **2.488.097 B**. Pulsanti/stati mostrati su editor incompleto/completo e amministrazione; ✓/× e scarto mostrati nella stessa partita open reale, incompleta e pronta. Nessun asset nuovo: segni di `symbols.ts`, cornici C4-4. Le due fusioni proposte sono quantificate (ΔE76 0,77 e 1,44); gli altri quasi duplicati sono motivatamente conservati. La prima prova della targhetta B era troppo lunga: accorciata a «Scarta» nel solo prototipo. Nessuna scelta attribuita al proprietario.

Le catture dedicate usano server locale e SQLite temporaneo; account ADMIN e tre righe del log sono sintetici e dichiarati, come in VerifyProfile. Il tavolo e i turni sono reali. Preparazione/errore sono stati reali del client provocati ritardando/bloccando le immagini nel solo browser. Le schede lunghe sono scorrevoli: una cattura non equivale a mostrarne tutto il contenuto contemporaneamente; i controlli sotto scorrimento sono censiti nei dati DOM.

**Raccomandazione e mie osservazioni, distinte dalle misure:** A generale e A di calata/scarto conservano meglio la carta calda già approvata. I verbi chiariscono ✓/× e le targhette distinguono le candidate senza il solo colore. B rende i comandi più netti e distingue anche la sagoma dei due segni, ma copre maggiormente l’illustrazione della carta in anteprima. Catalogo/editor/admin possono condividere i pannelli esistenti senza riprogettazione. Sono giudizi visivi miei, non esiti automatici né approvazioni del proprietario.

### Controlli, sorgente e limiti prima della Fase B

**Nessun verificatore, selettore, atteso o soglia cambiato.** Il confronto di produzione resta identico byte per byte, quindi nessuna azione è stata tolta per questa proposta (regola 16). Il censimento è un’analisi del sorgente, **non** il futuro test unitario che imporrà i token: quel controllo e le verifiche touch sulla nuova implementazione si scriveranno dopo la scelta.

Sotto 44 px fuori tavolo restano link pubblici/indice (32), Home (40), ordinamenti presenza (32/36), select nativo e summary dell’editor (40/36). Non sono deroghe D8: vanno corretti in Fase B. [Eccezioni D8 voce per voce](../design/client-c4/screens/inventario.md#d8-eccezioni-proposte-voce-per-voce): soli chip della scena, con contenuto nell’ispezione. Nel giro odierno i chip d’immunità alla tossicità sono letti lì a entrambe le misure; gli altri casi sono censiti, non dichiarati tutti osservati. Dischi ✓/×, miniature e bollini informativi non sono aree touch autonome; (i) e riga breve hanno già area invisibile almeno 44. Nessuna nuova eccezione proposta per le schermate.

### Verifiche della base di Fase A

`VerifyAll -Only 'test,build,size,verify,modes,lifecycle,ffa,decks,public,profile,layout'`, Node isolato **24.13.0**, jar ricostruito, un solo giro/processo di verifica alla volta, porte libere prima del lancio. **19/19 verdi, 29 min 10 s**: 236 unità, Build, Size; Verify, Modes, Lifecycle, Ffa, Decks, Public, Profile e Layout completi a **1366×768 e 844×390**. [Riepilogo e impronte](client-c4/c4-5b/verifiche/ufficiale/run-summary.json), [tutti i JSON](client-c4/c4-5b/verifiche/ufficiale/). È il giro della matrice C4-5b, non il consolidamento completo C4-9 (Resolution/Aim non rilanciate qui).

Distribuzione sempre **21 file, `6fd49130507af819`**, identica a prima della riformattazione. Test obbligatori del repository e check-rules verdi, come registrato in Fase 0; il contesto Spring completo non è stato eseguito. Durante il lavoro è entrato `7ef27db`, soltanto `docs/orchestrazione-lavoro.md`: nessun sorgente verificato è cambiato e quel documento non è stato toccato da questa attività.

**Size prima/dopo riformattazione e al giro ufficiale:** CSS **19.411 B / 4.889 B gzip**, incremento **0 B**; JS gzip **337.939 B**; totale gzip **1.668.915 B**; texture **27.729.048 B**, sotto **32 MiB** con margine **5.825.384 B**, atlante 2048×1536. [Size ufficiale](client-c4/c4-5b/verifiche/ufficiale/size.json); limiti rigidi e tetto texture verdi. Le catture e i documenti di proposta non entrano nella distribuzione.

### 750×292 — Rosso dichiarato e confronto sugli stessi input

Giro separato `VerifyAll -Only 'build,verify,layout' -Measures 750x292`, jar e client ricostruiti, stessa distribuzione. [Riepilogo](client-c4/c4-5b/verifiche/base-750x292/run-summary.json). **Build verde; Verify rosso** sul timeout del tooltip del gettone coperto dalla mano (`status-tip`, 3 s), limite già dichiarato. **VerifyLayout rosso: 74 messaggi, nessun errore di pagina**, contro i 48 del giro storico citato; non si dichiarano uguali questi due conteggi. Problemi per turno reali: **6/6/6 duello e 14/14/14 FFA**, non 11 in questa partita. Nessun rilancio per cercare un verde.

[Diagnosi senza modifiche](client-c4/c4-5b/verifiche/confronto-750.json): `readability.ts` è identico al commit precedente al lavoro `9df4bd5` (SHA normalizzata `f2a7931faa98e65a319bb5389113e6f3b502db6f8f10301930c245ce72f90455`); anche scene/background, verificatori e **BASE_750 sono invariati**. Confrontate le funzioni prima/dopo sugli stessi input: in duello **[6,6,6,5]**, in FFA **[11,11,12,14]** per 0–3 oggetti per posto, esattamente la matrice esistente. Il caso di riferimento con un oggetto resta **6/11**.

I JSON del giro non conservano tutti i conteggi degli oggetti della vista autorevole: non li invento. La ricerca diagnostica su conteggi misti 1–3 trova input compatibili con **lo stesso insieme dei 14 problemi** e il passo della mano misurato (51 px); con quegli stessi input la geometria precedente e quella attuale coincidono. Sono input compatibili **inferiti**, non una registrazione completa della vista né una nuova partita di confronto. Il risultato non consente di chiamare verde il giro reale o di sostituire 11 con 14 negli attesi; dimostra che il numero maggiore è riproducibile dalla geometria già esistente. La Fase B dovrà continuare a confrontare gli stessi casi di BASE_750 e dichiarare separatamente gli esiti reali, senza normalizzare questo rosso.

**Non verificato:** iPhone fisico, Safari, font su iOS; contrasto formale (C4-8a), giudizio umano in scala di grigi, contesto Spring completo. I prototipi non certificano la raggiungibilità o le prestazioni della futura implementazione. Alla consegna della Fase A mancavano ancora scelta e catture dopo; la Fase B è documentata di seguito.

### Fase B — Scelta e implementazione

5 novembre 2026. **Fatto, in attesa del giudizio del proprietario. Scelte applicate:** [decisione letterale](../design/client-c4/screens/scelte.md). A per editor incompleto/completo e amministrazione, come sistema comune; B per conferma/annullamento. Nello scarto un solo invito in basso sulla riga dei costi, senza etichette per carta e senza ripetizione nel fumetto sinistro. Nessuna riapertura di O26/O27.

Commit per gruppi: token/componenti comuni; accesso/home/regole/rotazione; hub/code/FFA/Al bar; catalogo/mazzi/editor; profilo/admin; dialoghi/menu/strumenti/Ultimo turno/esito. La sola modifica Pixi ammessa in questa implementazione è il ripiego del font Impact da Arial Narrow ad Arial (D4), a parità di ogni istruzione geometrica. Il controllo sorgente consente colori numerici solo nei quattro file di disegno già condivisi (`scene.ts`, `readability.ts`, `symbols.ts`, `frames.ts`); i TSX non ricevono una deroga generale. Verifiche concluse e riportate sotto; giudizio finale del proprietario ancora pendente.

**Gruppo pubblico:** Home, Regole, Accesso, Registrazione: link e Home portati a 44×44 minimi; testo, percorsi e selettori invariati. Verifica touch aggiunta ai checkpoint fotografici esistenti di VerifyPublic: misura il box CSS senza il falso ingrandimento del foglio ruotato; nessun vecchio controllo sostituito. La rotazione conserva i suoi box e la tinta calda, ora da token.

**Gruppo hub/code/FFA/Al bar:** ordinamenti e select Righe almeno 44×44; stati condivisi A, scelte ancora riconoscibili da filetto/outline oltre alla tinta. VerifyModes/Ffa/Lifecycle aggiungono la scansione touch agli stessi checkpoint esistenti, senza cambiare attese, scenari o azioni.

**Gruppo catalogo/mazzi/editor:** pannelli A e filetto coerente; summary degli slot 44 px anche compatti. Nessun TSX o struttura dell’editor cambiati: filtri, nomi, liste, salvataggio, annullamento, duplicati e cancellazione restano gli stessi. VerifyDecks conserva tutti gli attesi e aggiunge i bersagli touch agli stessi checkpoint.

**Gruppo profilo/admin:** A, stessi pannelli chiari e bordi dell’editor, azioni distruttive rosa con verbo e conferma. Dati e autorizzazione Basic invariati; nessuna azione tolta. VerifyProfile aggiunge solo i bersagli touch ai checkpoint esistenti (inclusi errori e conferme).

**Gruppo dialoghi/menu/strumenti/Ultimo turno/esito e calata:** stesse superfici e focus comuni; B con Conferma/Annulla visibili, ✓ in riquadro arrotondato e × in disco. Box delle metà invariati, label compatta con line-height controllata per restare nei 97 px esistenti. Singolo invito non interattivo alla quota della riga dei costi, soltanto dopo il bersaglio mentre manca lo scarto; il secondo rigo del fumetto sinistro è nascosto in quella fase. Carta/bersaglio, scarto scelto, errori e istruzione prima del bersaglio conservati. VerifyLayout/discard-checks mantiene ogni controllo O26 e aggiunge presenza/unicità/quota/pointer-events dell’invito e sua scomparsa dopo scelta/annullamento; aggiunta scansione touch ai checkpoint. Nessun selettore precedente cambiato.

**Eccezione metadata HTML:** il solo `meta name="theme-color"` di index.html richiede un valore letterale per il browser e resta al marrone esistente. Un test ne impone unicità e uguaglianza a `--bg-page`; vieta altre tinte HTML o CSS inline. I font dinamici non dichiarati e i colori esadecimali numerici brevi sono rifiutati dal nuovo guard, senza una deroga generale ai TSX.


### Fase B — Esiti finali e cosa giudicare

**Applicato:** A per sistema comune, editor incompleto/completo e amministrazione; B per ✓/×, Conferma/Annulla visibili; nello scarto **un solo invito sulla riga dei costi**, non interattivo, senza targhette sulle candidate e senza ripetizione dell’istruzione nel fumetto sinistro. Dopo lo scarto l’invito sparisce e la carta conserva il segno «SCARTO» già esistente. Carta/bersaglio, istruzioni prima del bersaglio, errori e riepilogo della scelta restano disponibili.

**Giro ufficiale: 19/19 verdi, 28 min 59 s.** [Riepilogo](client-c4/c4-5b/fase-b/ufficiale/run-summary.json): Test/Build/Size; Verify, Modes, Lifecycle, Ffa, Decks, Public, Profile e Layout completi a **1366×768 e 844×390**, su jar ricostruito e distribuzione **21 file, `d913cfcec0c3b05f`**. Il giro registra 239 unità; il guard dei metadati/font è stato poi aggiunto e la suite **finale 240/240** è verde nel [giro 750](client-c4/c4-5b/fase-b/base-750x292/run-summary.json), insieme a Build e Size, sulla stessa identica distribuzione. Nessun sorgente di prodotto cambiato dopo il giro ufficiale.

[Verifiche obbligatorie](client-c4/c4-5b/fase-b/repository.json): `./scripts/build.ps1 -Task Test -Offline` verde, **339 test server, 3 saltati**, zero errori/fallimenti; **36/36 client-debug**. `python scripts/check-rules.py` verde: regole, copia client e catalogo/SQLite allineati. L’avvio locale nelle partite è effettivo, ma **TestServerContext resta una verifica separata non eseguita**. Nessun processo Java/Maven esterno o porta 8080/4320 occupata ai controlli preventivi; mai fermati processi altrui, un giro alla volta.

**Sorgente:** quattro nuovi test di guardia, con casi negativi: colori CSS solo nei token di `:root`, riferimenti definiti; nessuna palette privata nei TS/TSX; solo Impact/Arial e ripiego generico sans-serif, rifiutando famiglie dinamiche non dichiarate. Eccezioni esplicite: disegno Pixi di scene.ts; costanti condivise di readability.ts, symbols.ts e frames.ts; solo meta theme-color in index.html, vincolato a `--bg-page`. Il convertitore numerico dei TSX usa quelle costanti, senza una deroga ai colori letterali nei TSX. Inventario font aggiornato a Impact/Arial, senza cambi a file pubblici o impronte.

**Verificatori:** nessun testo identificativo, selettore, atteso, soglia o BASE_750 precedente cambiato. Ai checkpoint fotografici esistenti di Public/Modes/Lifecycle/Ffa/Decks/Profile/Layout è stata aggiunta la scansione dei bersagli; nessuna vecchia asserzione è stata sostituita. In discard-checks sono aggiunte le asserzioni del solo invito (unico, quota dei costi, nessuna intercettazione del tocco, nessuna duplicazione nel fumetto, assenza dopo scelta/annullamento). I controlli O26 originari restano tutti presenti e verdi alle misure ufficiali.

### Fase B — 44 px ed eccezioni D8

[Misure touch](client-c4/c4-5b/fase-b/touch.json): **1412 controlli ordinari** nei checkpoint ufficiali a 844×390, inclusi disabilitati e controlli sotto scorrimento; minimo **44×44 px**. Misura CSS del controllo senza l’ingrandimento apparente del foglio ruotato. (i) e riga breve comprendono la loro area pseudo-elemento, non sono deroghe. Anche la raccolta delle schermate extra ripete la scansione, senza rilievi. Il nuovo invito è testo non interattivo, non un controllo esentato.

Le sole eccezioni rilevate sono chip della scena, elencati qui uno per caso misurato. **Percorso alternativo comune:** tocco sul personaggio → Stati, immunità e timer (`inspect-chip`); il renderer della ricevuta usa le stesse descrizioni di `chipsOf`. VerifyLayout prova direttamente quel percorso sui chip incontrati nel suo scenario dedicato. Non si attribuisce una prova individuale del percorso a ogni durata/timer di ogni checkpoint: i campioni diretti sono nei JSON layout; tutti i casi sotto restano della sola categoria D8 già approvata. Nessuna deroga per link, select, summary o pulsanti piccoli.

| Chip / descrizione osservata | Box CSS px |
|---|---|
| Equipaggiamento: BROKEN BEER. I tuoi colpi (HIT) ×1,5 e diventano tagli (CUT); si consuma dopo l’uso | 26×18 |
| Equipaggiamento: BROKEN BEER. I tuoi colpi (HIT) ×1,5 e diventano tagli (CUT); si consuma dopo l’uso | 31×18 |
| Equipaggiamento: BROKEN BEER. I tuoi colpi (HIT) ×1,5 e diventano tagli (CUT); si consuma dopo l’uso | 41×27 |
| Equipaggiamento: BROKEN BEER. I tuoi colpi (HIT) ×1,5 e diventano tagli (CUT); si consuma dopo l’uso | 46×27 |
| Immune a alcol. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 17×18 |
| Immune a alcol. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 24×18 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 17×18 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 24×18 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 26×18 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 31×18 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 37×22 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 41×27 |
| Immune a tossicità. Blocca il suo effetto di fine turno, non costi, variazioni o veleno. | 46×27 |
| Stato positivo: MADE OF STONE. Tagli (CUT) ricevuti ×0,5. dura ancora 2 turni dopo questo. | 31×18 |
| Timer: Bad Trip. Scatta a fine turno: ridà l’immunità alla tossicità. | 31×18 |
| Timer: Bad Trip. Scatta tra 2 fine turno: ridà l’immunità alla tossicità. | 31×18 |
| Timer: Marvelous Cocktail. Scatta a fine turno: toglie immunità e stati, poi 20 danni da veleno. | 17×18 |
| Timer: Marvelous Cocktail. Scatta tra 2 fine turno: toglie immunità e stati, poi 20 danni da veleno. | 17×18 |
| Timer: Marvelous Cocktail. Scatta tra 2 fine turno: toglie immunità e stati, poi 20 danni da veleno. | 24×18 |

### Fase B — Peso e 750×292

[Size finale](client-c4/c4-5b/fase-b/ufficiale/size.json): JS gzip **338.060 B**, totale gzip **1.669.984 B**, texture **27.729.048 B** e margine sul tetto 32 MiB **5.825.384 B**; tutti i limiti rigidi e il tetto texture verdi. CSS distribuito **24.562 B / 5.837 B gzip**, contro **19.411 / 4.889 B** prima: **+948 B gzip** per tutta la finitura, totale distribuito **+1.069 B (0,064%)**. [Analisi isolata](client-c4/c4-5b/fase-b/costo-token.json): espandendo solo i 63 token nella stessa CSS finale e applicando identica minificazione/gzip, il costo dei token è **620 B gzip**; il resto della crescita è delle nuove regole di stato, target e invito. Nessuna texture o asset aggiunto.

**750×292 non è dichiarato verde.** [Giro](client-c4/c4-5b/fase-b/base-750x292/run-summary.json): Test/Build/Size verdi; Verify rosso sullo stesso timeout `status-tip` del gettone coperto, 3 s. VerifyLayout rosso con **64 messaggi, nessun errore di pagina**, contro i **74** della partita di Fase A (i **48** citati all’inizio del compito erano di un diverso giro storico). Problemi reali per turno **6/5/5 in duello e 12/12/14 in FFA**. Non si rivendica un miglioramento da numeri di partite diverse.

[Confronto sugli stessi input](client-c4/c4-5b/fase-b/confronto-750.json): readability.ts identico alla base precedente al lavoro, come BASE_750; matrice prima/dopo **[6,6,6,5] duello, [11,11,12,14] FFA** per 0–3 oggetti per posto. Il caso di riferimento a un oggetto resta **6/11**, nessun aumento. Per il primo turno reale del giro finale, gli input misti compatibili con i dati conservati riproducono lo stesso insieme dei 12 problemi e lo stesso passo della mano nella geometria precedente e in quella attuale; sono inferiti, non una registrazione completa della vista autorevole. Fonte e attesi invariati, niente rilanci per cercare il verde. Geometria di scene.ts invariata: il suo unico diff è il ripiego del font. background.ts, regole, server, protocollo e catalogo intatti.

### Fase B — Catture finali e giudizio richiesto

[Dopo, schermata per schermata](client-c4/c4-5b/dopo/README.md), [galleria](client-c4/c4-5b/dopo/galleria.html): **104 JPEG normali, 5.826.039 B (5,56 MiB)**, le stesse 38 schermate/stati e misure del prima, controllate automaticamente per corrispondenza. 1366×768, 844×390 e 390×844 dove ammesso. Stessi percorsi e mazzo di prova, server reale su SQLite temporaneo; partite/avversari possono variare. Nessuna tinta o etichetta di prototipo iniettata nelle catture normali. Tre campioni aggiuntivi (due grigi e uno focus) **112.770 B**. [Cinque confronti leggeri](client-c4/c4-5b/confronti/README.md), **563.833 B**, per hub, editor incompleto, admin, scarto richiesto e conferma pronta.

**Mie osservazioni visive, non misure né approvazione:** il testo singolo resta sulla riga bassa senza intercettare le carte; il fumetto sinistro mantiene il contesto e non ripete la richiesta. I due verbi entrano nelle metà compatte senza alterare i box; il bordo tratteggiato distingue i disabilitati, e il focus è visibile sul foglio. Le schede lunghe continuano a scorrere; l’editor mantiene gli stessi slot e le stesse azioni. Le differenze di partite/oggetti nelle coppie non sono modifiche di questa finitura.

**Da giudicare al proprietario:** tutte le schermate della galleria dopo; in particolare editor incompleto/completo e admin (A, disabilitati/focus), hub/Al bar e link/form da 44 px, scarto richiesto (singolo invito e fumetto non ridondante), conferma pronta (B). [Focus da tastiera](client-c4/c4-5b/dopo/focus/editor-844x390.jpg); grigi dell’[editor](client-c4/c4-5b/dopo/grigi/editor-incompleto-844x390.jpg) e della [conferma](client-c4/c4-5b/dopo/grigi/conferma-pronta-844x390.jpg) per la regola 11, ottenuti con il solo filtro temporaneo grayscale del browser. Il giudizio umano in grigio resta pendente.

**Non verificato:** iPhone fisico e Safari, Impact su iOS, contrasto formale (C4-8a), partita interamente da tastiera e intero zoom del testo (C4-8a), prompt Basic nativo, TestServerContext. Le verifiche sono Edge su Windows; non sostituiscono questi controlli. **Fatto, in attesa del giudizio del proprietario. Nessun push.**

### Approvazione di C4-5b

6 novembre 2026, sulle catture dopo. Parole del proprietario: «giudizio su c4-5b positivo». Il blocco è chiuso. La revisione della regia sul repository non ha trovato attesi, soglie, selettori o `BASE_750` cambiati; ha ripetuto le unità su `8a7ef18`: 240/240 verdi. Le verifiche del blocco usano il regolamento 1.10: il regolamento 1.11 (R01, risorse a 0), entrato dopo dal filone Set Base, porta cinque risorse per posto nelle viste e non è ancora stato provato sul tavolo.

## C4-7 — Fase 0

6 novembre 2026, base `dbdd20e`, regolamento 1.11. Misura senza modifiche al client. Il jar è stato ricostruito con `./scripts/build.ps1 -Task Server -Offline`; `VerifyAll` ha usato `-ReuseJar` sul jar appena ricostruito (SHA-256 iniziale `d87271aa76a07c8d`), dopo che la ricostruzione annidata si era fermata perché `Get-FileHash` non era disponibile nel processo figlio. Porte libere e nessun processo Java/Maven esterno prima di ogni giro; `BM_OUT` impostato per Size.

Giro ufficiale `test,build,size,verify,ffa,layout`: **9/9 verdi**, entrambe le misure. [JSON e catture](client-c4/c4-7/fase-0/). Le catture T1 di duello e FFA alle due misure mostrano cinque risorse per posto; nel campione esaminato risorse, gettoni e oggetti sono visibili senza nuove coperture o troncamenti imputabili alle risorse aggiunte. Non è una prova su dispositivo fisico.

Giro separato `build,verify,layout` a 750×292: build verde, Verify e layout rossi. Verify scade attendendo `status-tip`; layout segnala i problemi di spazio già noti e una verifica del testo di un gettone. I conteggi reali di `layoutProblems` sono **6/6/5 duello, 11/11/11 FFA**, contro 6/5/5 e 12/12/14 nella partita C4-5b. Le partite hanno oggetti diversi e il JSON non conserva tutti i conteggi della vista autorevole: non si attribuisce una causa puntuale alle differenze. [Confronto](client-c4/c4-7/fase-0/confronto-750.json): geometria e test `BASE_750` identici a `9df4bd5`; matrice calcolata sugli stessi input **6/6/6/5 e 11/11/12/14**, invariata. Non sono stati cambiati attesi o soglie, né ripetuto il giro per cercare il verde. La 1.11 aggiunge gli zeri alle viste dal primo turno; non è dimostrato che spieghi le differenze dei conteggi fra partite.

### C4-7 — Fase A

6 novembre 2026. Il proprietario ha approvato la Fase 0: «regge, nessuna correzione richiesta». **C4-7: Fase A pronta, in attesa della scelta.** [Proposta di cinque suoni, agganci e catture del menu](../design/client-c4/audio/proposta.md). Nessun audio scaricato, nessuna modifica al client; Fase B subordinata alla scelta e al consenso al download dei singoli file. Verifiche di progetto: `./scripts/build.ps1 -Task Test -Offline` verde (500 server, 6 saltati; client-debug 36/36) e `python scripts/check-rules.py` verde. `TestServerContext` non eseguito; nessuna verifica audio o prova su iPhone/Safari in questa fase.

### C4-7 — Fase B

6 novembre 2026. **Fatto, in attesa del giudizio del proprietario.** Scelta «i suoni li approvo» e consenso al solo pacchetto ufficiale [registrati](../design/client-c4/audio/scelte.md). Scaricato dal collegamento temporaneo della [pagina Kenney](https://kenney.nl/assets/interface-sounds) in una cartella nuova fuori repository: 834.536 byte, sotto 2 MiB. `License.txt` incluso indica Interface Sounds 1.0, Kenney, CC0 1.0. Solo i cinque OGG approvati copiati senza modifiche: 42.616 byte in totale; peso, autore, fonte, licenza e SHA-256 individuali nell'[inventario](../design/client-c4/assets/inventory.json). Un primo URL statico ha restituito HTML, non è stato usato.

`src/sound.ts` precarica file locali, protegge storage e riproduzione, tenta al primo gesto l’attivazione silenziosa di ciascun lettore e conserva volume (20% iniziale) e muto. Selezione, invio e rifiuto seguono le transizioni del modello; impatto o esito seguono la sequenza e la chiave del round, al massimo uno per risoluzione. Salto, interruzione e fine cancellano gli eventi in sospeso; niente recuperi da background, movimento ridotto o riconnessione. Nessuna attesa sul percorso di input. [Menu desktop](client-c4/c4-7/fase-b/ufficiale-finale/menu-1366x768.jpg) e [compatto](client-c4/c4-7/fase-b/ufficiale-finale/menu-844x390.jpg), catturati su Edge/PC e database temporaneo. La home esistente distingue i suoni CC0 dai materiali del progetto; nessuna schermata nuova.

**Verifiche.** Jar ricostruito nella Fase 0, riutilizzato dichiaratamente (`-ReuseJar`, SHA iniziale `d87271aa76a07c8d`); porte libere e nessun processo Java/Maven esterno prima di ogni giro. `VerifyAll -Only 'test,build,size,verify,layout'`: **7/7**, 247 test client, misure 1366×768 e 844×390 ([risultati](client-c4/c4-7/fase-b/ufficiale-finale/run-summary.json)). Size: JS gzip **339.873 / 512.000 B**, totale **1.708.311 / 4.194.304 B**, atlante massimo **2048 px**, texture **27.729.048 / 33.554.432 B** (tetto C4; limite rigido 67.108.864 B); audio **42.616 B**, gzip 36.478 B.

Ripetuti `Verify` con `HTMLMediaElement.play` che respinge con `NotAllowedError`: **5/5** includendo test/build/size ([risultati](client-c4/c4-7/fase-b/bloccato-corretto/run-summary.json)); con i cinque file spostati temporaneamente fuori da `dist/audio`, **2/2** ([risultati](client-c4/c4-7/fase-b/mancanti-corretto/run-summary.json)), ripristinati subito nel `finally`. La preview Vite risponde con il fallback HTML alle richieste di file mancanti; si è verificato il comportamento sulla build priva dei cinque file, non un server che risponde 404. Nessun errore di pagina/console o richiesta a origine esterna nei registri finali. Sonda aggiuntiva `tools/verify-audio-probe.mjs` via `NODE_OPTIONS`, controllata da `tools/check-audio-probe.mjs`: osserva richieste, WebSocket, errori e chiamate `play`; nel caso negato sostituisce solo `play`. I verificatori esistenti non sono modificati né sostituiti. All'inizio la console registrava il 404 preesistente di `favicon.ico`: `index.html` dichiara ora una favicon vuota incorporata; il controllo finale è pulito.

`VerifyResolution` a copertura ridotta **5/5**, scenari validi `quick,interrupt`, entrambe le misure ([risultati](client-c4/c4-7/fase-b/resolution-finale/run-summary.json)); sonda: **10 tentativi di suono di sequenza in 10 round desktop, 12 in 12 round compatti**, massimo uno per round, nessuno con sequenza ferma. Il conteggio è di chiamate `play` non mute, non di suoni uditi; esclude i tentativi muti di sblocco. Test unitari coprono transizioni, vista ripetuta, muto, file mancanti, persistenza e annullamento; [rimuovendo temporaneamente la guardia dei round](client-c4/c4-7/fase-b/guardia.json) tre test falliscono, poi ripristinata e verificata verde.

`VerifyLayout` aggiuntivo: dapprima rosso su entrambe le misure perché il nuovo cursore era alto 16 px ([prima](client-c4/c4-7/fase-b/layout-prima-correzione/)); corretto a minimo 160×44 px, poi **7/7 verde** includendo Verify e Layout ([dopo](client-c4/c4-7/fase-b/ufficiale-finale/run-summary.json)). Input massimo per i quattro campioni duello/FFA: Fase 0 **17,8 / 15,8 / 21,9 / 29,0 ms** desktop e **12,3 / 13,1 / 22,7 / 27,2 ms** compatto; Fase B **13,6 / 15,6 / 21,3 / 29,9 ms** desktop e **13,9 / 18,9 / 18,4 / 20,8 ms** compatto. Tutti sotto 100 ms; il massimo desktop è aumentato di 0,9 ms, mentre quello compatto è diminuito. Partite e campioni diversi non dimostrano identità di latenza. Il primo gesto che tenta lo sblocco non è compreso in questi campioni, né è misurata la latenza percepita. Nessun atteso, selettore, soglia o `BASE_750` cambiato; nessuna geometria del tavolo cambiata.

`./scripts/build.ps1 -Task Test -Offline`: **500 server, 0 errori, 6 saltati; client-debug 36/36**. `python scripts/check-rules.py`: PASS. `TestServerContext` non eseguito. Non verificati iPhone, Safari, interruttore silenzioso, riproduzione reale e latenza percepita. Il proprietario deve ascoltare in una partita vera, giudicare volume iniziale e possibile fastidio nelle sequenze FFA lunghe, incluso il suono unico di esito anche in sconfitta.

## C4-7-bis — Fase A

6 novembre 2026, base `ffb9c2d`. **C4-7: correzione in corso (C4-7-bis), Fase A pronta, in attesa della scelta.** Nessun codice di prodotto cambiato, nessun file audio scaricato. [Diagnosi e proposta](../design/client-c4/audio/proposta-esito.md).

### Prova del proprietario

Su iPhone: «non si sente fanfara di vittoria ne suono di sconfitta»; «il "tap" di quando si seleziona una carta si sente a volte si e a volte no, e sembra avere un po' di lag»; «le animazioni su safari non sono proprio fluidissime»; «safari in lanscape taglia un sacco di spazio, laterale per l'isola con le fotocamere, in alto per le schede e la barra degli indirizzi»; «quel tooltip giallo in alto che riassume il turno da un po' fastidio visto lo schermo piccolo»; «in generale cmq il gioco mi sta piacendo molto!».

Da PC: «suoni ok da pc, ma non si sentono suoni di vittoria o sconfitta, o se si sentono sono in molto ritardo rispetto all'evento».

Decisione del proprietario sull'esito: «Due distinti» (suono di vittoria e suono di sconfitta distinti, al posto dell'unico `confirmation_002.ogg`).

Nota della regia: nelle sonde di C4-7 il suono di esito compare solo 2 volte (`resolution-finale`) e mai nel giro ufficiale; le verifiche di C4-7 non hanno coperto l'esito. Destinazioni: fluidità su Safari a C4-8b (condizione già prevista, ora attivata), O28 a C4-8b, O29 a C4-8a o C4-8b ([roadmap](../client-roadmap.md#osservazioni-registrate-durante-c4)).

### Diagnosi

Cause provate su sei partite 1vCom vere (Edge headless 1366×768, `dist` di `ffb9c2d`, jar 1.11 delle 11:35, server temporaneo), una azione nel round finale di ciascuna, con una sonda che registra ogni `play` ([script](client-c4/c4-7-bis/fase-a/outcome-probe.mjs), [risultati](client-c4/c4-7-bis/fase-a/outcome-probe-1366x768.json)); dettagli, file e righe nella [proposta](../design/client-c4/audio/proposta-esito.md#cause).

- **(a) confermata, più larga dell'ipotesi:** `advance()` scarta ogni evento audio scavalcato da un tocco; l'esito sta a `total − 700` ms, dopo l'ultima fermata intermedia (`tail.at`), quindi qualsiasi tocco nella coda lo scarta e chiude la sequenza. Tocchi fino alla fine: 0 suoni d'esito; un tocco a 8 563 ms (esito previsto a 9 250): 0.
- **(b) confermata:** lasciando scorrere l'esito suona a 8 448 ms dall'arrivo della vista (9 641 in un'altra partita), 2,9 s dopo l'ultimo impatto; nel round finale l'impatto tace per scelta.
- **(c) ridimensionamento confermato come meccanismo, `blur` smentito:** 60 px di ridimensionamento a 1,5 s chiudono la sequenza (`resize`) e l'esito non suona; un `blur` non la chiude e l'esito suona. Che la barra di Safari produca davvero quel `resize` su iPhone non è verificabile da Edge.
- **(d) confermata:** il pannello d'esito compare subito, con la sequenza appena partita; «Nuova partita» a 1,5 s smonta il tavolo e l'esito non suona. È il motivo per cui il giro ufficiale di C4-7 (4 partite fino all'esito) non ha mai suonato l'esito: `Verify` lascia il tavolo appena vede il pannello.

Il computer ha vinto tutte e sei le partite: la vittoria non è stata provata, il percorso è lo stesso. Proposte (suoni distinti con pareggio come sconfitta, due strade per la fonte, momento con due opzioni, Web Audio) nella [proposta](../design/client-c4/audio/proposta-esito.md).

### Verifiche della Fase A

Nessuna verifica di prodotto: il codice non è cambiato. `dist` ricostruito da `ffb9c2d` per la sonda; porte 8080 e 4320 libere e nessun Java/Maven esterno prima del lancio, liberate alla fine. `python scripts/check-rules.py`: PASS. `./scripts/build.ps1 -Task Test -Offline`: **571 server, 0 errori, 7 saltati; client-debug 36/36** (cifre del server cresciute con i commit del Set Base dopo C4-7). `TestServerContext` non eseguito. Non verificati iPhone, Safari, interruttore silenzioso, latenza percepita e vittoria.

## C4-7-bis — Fase B

Implementata il 6 novembre 2026, verificata il 7 novembre 2026; base `5184838` (scelte sulla Fase A). **C4-7: fatto, in attesa del giudizio del proprietario.** [Scelte del proprietario](../design/client-c4/audio/scelte.md#c4-7-bis--scelte-sulla-fase-a), [diagnosi della Fase A](../design/client-c4/audio/proposta-esito.md).

### File scelti, scaricamento e inventario

Pacchetto [Kenney Music Jingles](https://kenney.nl/assets/music-jingles) scaricato solo dalla pagina ufficiale. Un primo `curl` ha ricevuto 403. Non ho aggirato il controllo: il file viene dal flusso normale della pagina nel browser integrato («Continue without donating»). Il pacchetto, salvato in una cartella nuova fuori dal repository, pesa **1.239.525 byte**, sotto il tetto di 2 MB, con SHA-256 `b729ba57…77197b8`. Il `License.txt` incluso dichiara CC0 1.0.

File SAX e PIZZI misurati; quelli sotto 2 s sono andati su una pagina d'ascolto servita solo in LAN, mai pubblicata, poi fermata: 8 candidati per esito, con la proposta in cima. Parole del proprietario: «sconfitta SAX07 vittoria SAX10». Copiati senza modifiche:

- `jingles_SAX10.ogg` (vittoria): 13.565 B, 0,64 s;
- `jingles_SAX07.ogg` (sconfitta e pareggio): 30.900 B, 1,74 s.

`confirmation_002.ogg` esce da `public/audio` e dall'[inventario](../design/client-c4/assets/inventory.json) (versione 3, con autore, URL, versione, licenza, peso e SHA-256 per file). Ora i suoni sono sei, 72.912 byte in tutto. La home cita anche Music Jingles fra i materiali CC0.

Osservazione del proprietario sulla pagina d'ascolto, registrata nelle [scelte](../design/client-c4/audio/scelte.md#scelta-dei-file-dopo-lascolto): l'iPhone 15 «dice riprodotto, ma non si sente niente anche alzando il volume», l'iPhone 16 Pro sente tutto. Ipotesi non verificata: modalità silenziosa attiva, rispettata da Web Audio con la sessione 'ambient'.

### Cause e correzioni

- **(a) Il tocco scartava il suono.** `RoundCue` (`src/sound.ts`) tiene un solo segnale per round, l'impatto oppure l'esito. Un tocco che raggiunge o scavalca il segnale lo fa suonare allora, una volta; vale anche per l'impatto, come chiesto. Lo stesso vale per un tocco che chiude la sequenza.
- **(b) Esito a fine coda.** `roundCue` e `decisiveMove` (`src/resolution.ts`) mettono l'esito sul colpo decisivo: l'arrivo della carta che porta a 0 o meno la Salute di chi muore (Salute ≤ 0 è morte nel regolamento), al 70% del volo come l'impatto. Se la fine non viene da una carta, l'esito va all'inizio della coda: morte a fine turno, forfait, barre solo totali, oppure più morti di cui una non attribuita a una carta.
- **(c) Ridimensionamento:** regola invariata per scelta del proprietario. Un ridimensionamento chiude la sequenza e l'esito tace.
- **(d) Pannello d'esito:** invariato per scelta del proprietario. Compare ancora subito, e «Nuova partita» prima del segnale smonta il tavolo senza suono.
- **Salto, interruzioni, background, riconnessione:** restano muti, senza recuperi tardivi.
- **Fine normale:** a sequenza completa o chiusa da un tocco, un esito già partito non viene troncato. Salto e interruzione invece lo fermano.

Scelta mia, da giudicare: quando la scelta di una carta dalla mano chiude la sequenza (regola 4), suona l'esito ma non l'impatto. L'impatto suona solo con il tempo o con tocchi sul tavolo che lo raggiungono.

**Web Audio.** Un solo `AudioContext` per pagina, con i sei file locali decodificati una volta. Volume e muto passano da un `GainNode` principale e funzionano anche dove `HTMLMediaElement.volume` è ignorato. Ogni suono è un `AudioBufferSourceNode` nuovo; il client non chiama più `HTMLMediaElement.play`.

- **Sblocco:** su `pointerdown`, `touchend`, `click` e `keydown` (in cattura) il contesto viene ripreso. Al primo gesto parte un campione muto di un frame. Niente è atteso sul percorso di input: selezione, invio e rifiuto sono rinviati con `queueMicrotask`.
- **Sessione audio:** `navigator.audioSession.type = 'ambient'` dove esiste.
- **Ripiego silenzioso:** senza contesto, prima di un gesto, con il contesto sospeso o con un file mancante o non decodificabile non suona niente e niente resta in coda.

Nessuna informazione dipende dal suono. Menu, geometria del tavolo e pannello sono invariati.

### Test

- **Nuovo `tests/outcome-sound.test.ts` (4 test).** Usa i round finali registrati dal server vero, più una variante con la morte spostata sulla carta avversaria, e guida l'orologio della sequenza con le fermate vere. Copre:
  - un esito del tipo giusto (vittoria, sconfitta, pareggio come sconfitta) lasciando scorrere;
  - un esito quando si tocca fino alla fine partendo da ogni punto, e con un solo tocco ovunque;
  - colpo decisivo contro coda;
  - salto, interruzioni e scelta di carta.
- **Ricostruiti su `ffb9c2d`.** Su `ffb9c2d` i test nuovi non si caricano, perché mancano le funzioni. Ho riprodotto le sue due semantiche su copie fuori dal repository ([mutazione](client-c4/c4-7-bis/fase-b/mutazione.json)): «il tocco scarta» fa fallire 2 test su 4, «esito a `total − 700`» 1 su 4.
- **`tests/sound.test.ts`.** Solo la preparazione è adattata a un finto backend Web Audio; i 7 test restano. «Il primo gesto tenta una sola attivazione muta di ciascun lettore» diventa «il primo gesto riprende il contesto e suona un solo campione muto», perché non ci sono più lettori. Aggiunti 4 test: guadagno, nulla prima di un gesto, contesto sospeso (iOS in background), esito non troncato a fine normale.
- **Invariati:** nessun test tolto, nessun atteso, selettore, soglia o `BASE_750` cambiato.
- **Esito:** 255/255 test client.

**Sonda.** `tools/verify-audio-probe.mjs` segue ogni `AudioBufferSourceNode.start` fino al file, attraverso `fetch` e `decodeAudioData`. La scena annuncia inizio (con il segnale) e fine (con il motivo) solo se la sonda definisce `window.__bmAudioTrace`. Ogni record porta la sua pagina.

`tools/check-audio-probe.mjs` fallisce se:
- un round ha più di un suono, un suono fuori da una sequenza aperta, o un suono di tipo diverso dal segnale;
- un round finale chiuso da sé o con un tocco non ha esattamente un esito;
- un round con impatto completato non ha esattamente un impatto;
- compare un `HTMLMediaElement`;
- con `--blocked` suona qualcosa di udibile.

`--require=win,loss,input` impone la copertura. Il nuovo `VerifyOutcomeAudio` gioca 1v1 fra `devAlice` e `devBob` su server temporaneo. Nel round finale ciascuno lascia scorrere, tocca fino alla fine, tocca una volta poco prima del segnale, salta o ridimensiona.

### Verifiche

Jar del 6 novembre 11:35 (`d87271aa76a07c8d`) riutilizzato e dichiarato (`-ReuseJar`). `server/src/main` e `pom.xml` non cambiano da `2c1e23a` (regolamento 1.11); i commit C4 non toccano `server`. L'avviso «STALE JAR» di `VerifyAll` riguarda solo file di test del Set Base (`server/src/test/.../sim`). Prima di ogni giro: porte 8080 e 4320 libere, nessun Java o Maven esterno; un giro alla volta.

| Giro | Esito | Sonda |
|---|---|---|
| `VerifyAll -Only 'test,build,size,verify,layout'` ([evidenze](client-c4/c4-7-bis/fase-b/ufficiale/)) | **7/7** | 76 round, 12 impatti, massimo 1 per round; 0 esiti, perché `Verify` lascia il tavolo appena vede il pannello (causa d, invariata) |
| `VerifyResolution` ridotto, `quick,interrupt` ([evidenze](client-c4/c4-7-bis/fase-b/resolution/)) | **5/5** | 32 round, 26 impatti, 1 vittoria e 1 sconfitta a sequenza completa, massimo 1 |
| `Verify` con audio negato (contesto sospeso, `resume()` respinto) ([evidenze](client-c4/c4-7-bis/fase-b/bloccato/)) | **5/5** con test, build e size | 0 suoni udibili; 2 avvii del campione muto |
| `Verify` con i sei file tolti da `dist/audio` e ripristinati nel `finally` ([evidenze](client-c4/c4-7-bis/fase-b/mancanti/)) | **2/2** | 0 suoni udibili, nessun errore di pagina |
| `VerifyOutcomeAudio` a 1366×768 e 844×390, 4 partite per misura ([evidenze](client-c4/c4-7-bis/fase-b/esito/)) | **8/8 partite**, controllo `--require=win,loss,input` verde | esiti: 3 vittorie e 3 sconfitte (desktop), 4 e 2 (compatto); un esito esatto in ogni round finale lasciato scorrere o toccato; nessuno dopo salto o ridimensionamento |
| 750×292 `build,verify,layout` ([evidenze](client-c4/c4-7-bis/fase-b/m750/)) | build verde; Verify e layout **rossi dichiarati**, dello stesso tipo della Fase 0 di C4-7 | senza sonda |

**750×292 (regola 18).** Verify scade attendendo `status-tip`, come nella Fase 0. Layout: 48 problemi come nella Fase 0, con gli stessi tipi a parte l'ordine delle coppie sovrapposte. Conteggi per turno: duello **6/6/6** (Fase 0: 6/6/5), FFA **11/11/11** (uguale). Nel duello T2 c'è in più «arrow to item», un tipo già presente a T0 e T1 in entrambi i giri. Dipende da dove cadono gli oggetti in questa partita, e il JSON non conserva tutti i conteggi degli oggetti: non attribuisco una causa. C4-7-bis non tocca la geometria (le modifiche a `scene.ts` sono solo suono e traccia). Il confronto con `BASE_750` per numero di oggetti non si può fare dal JSON della partita. Il test `BASE_750`, che lo fa sugli stessi input, è invariato e verde (2 posti [6,6,6,5], 5 posti [11,11,12,14]). Atteso, soglie e base invariati; il giro non è stato ripetuto per cercare un verde.

Tempi dell'esito, misurati dall'inizio della sequenza sull'orologio della pagina ([tempi](client-c4/c4-7-bis/fase-b/esito/)):
- **Lasciando scorrere:** l'esito parte 8–12 ms dopo il segnale.
- **Toccando fino alla fine:** parte al tocco che scavalca il segnale, a 2,6–3,5 s invece di 8,35–8,75.
- **Con un tocco poco prima del segnale:** parte al tocco (8,63–8,65 s), una sola volta.
- **Dove cade il segnale:** in 7 partite su 8 la morte arriva a fine turno, quindi il segnale è all'inizio della coda (8,35–8,75 s su 9,95–10,35). In una partita desktop la morte viene da una carta, e la vittoria suona sul colpo, a 2,46 s.

Ne segue che, lasciando scorrere una partita che finisce a fine turno, l'esito arriva circa 0,9 s prima di `ffb9c2d` (prima: `total − 700`), ma sempre 8–9 s dopo che il pannello è comparso: il pannello non è cambiato, per scelta.

Size: JS gzip **340.716 / 512.000 B** (C4-7: 339.873), totale **1.733.198 / 4.194.304 B**, atlante massimo 2048 px, texture **27.729.048 / 33.554.432 B**; audio 6 file, **72.912 B**, gzip 60.522 B.

Input massimo nei quattro campioni duello e FFA ([layout](client-c4/c4-7-bis/fase-b/ufficiale/)):

| Misura | Fase 0 di C4-7 | Fase B di C4-7 | C4-7-bis |
|---|---|---|---|
| Desktop | 17,8 / 15,8 / 21,9 / 29,0 ms | 13,6 / 15,6 / 21,3 / 29,9 ms | **17,9 / 21,9 / 21,9 / 31,5 ms** |
| Compatto | 12,3 / 13,1 / 22,7 / 27,2 ms | 13,9 / 18,9 / 18,4 / 20,8 ms | **15,4 / 15,5 / 20,5 / 21,5 ms** |

Tutti sotto 100 ms. Il massimo desktop cresce di 1,6 ms rispetto a C4-7 e di 2,5 ms rispetto alla Fase 0; quello compatto resta sotto la Fase 0. Partite e campioni sono diversi: questo non prova identità né peggioramento. Il primo gesto, che sblocca il contesto, non è nei campioni. La latenza percepita non è misurata.

`./scripts/build.ps1 -Task Test -Offline`: **579 server, 0 errori, 7 saltati; client-debug 36/36**. Sono 8 in più della Fase A, che girava su `ffb9c2d`, prima del riallineamento sui commit SB-11a e SB-11b. `python scripts/check-rules.py`: PASS. `TestServerContext` non eseguito.

### Non verificato e da riprovare

Non verificati: iPhone, Safari, modalità silenziosa, riproduzione reale udita, decodifica OGG Vorbis su Safari in generale: dipende dalla versione, e dove manca i file non si decodificano e il gioco resta muto. Sulla pagina d'ascolto l'iPhone 16 Pro ha suonato gli stessi OGG con Web Audio, latenza percepita del tocco di selezione. Che la barra di Safari produca un `resize` che chiude la sequenza resta non verificato, e la regola non è cambiata. Le prove sono su Edge via Playwright su PC, con database temporaneo, non su un dispositivo fisico.

Da riprovare, per il proprietario:

- **PC:** una partita lasciata scorrere fino alla fine, e una toccando il tavolo dopo l'ultima carta. L'esito si sente una volta, vittoria o sconfitta secondo il risultato. Se la morte arriva a fine turno, lasciando scorrere arriva ancora circa 8 s dopo il pannello; toccando arriva subito.
- **iPhone 16 Pro:** gli stessi due casi; il tocco di selezione dovrebbe suonare ogni volta e senza ritardo, perché non passa più da `<audio>`; volume e muto dal menu.
- **iPhone 15:** prima con la modalità silenziosa disattivata, poi attivata; nel secondo caso il silenzio è atteso con 'ambient'.

## C4-7 — prova del proprietario del 7 novembre 2026

7 novembre 2026, su `c197517` (C4-7-bis Fase B), server e client avviati dalla regia in rete locale; desktop e iPhone. **C4-7 non approvato:** correzione C4-7-ter ([piano](../client-c4-plan.md#c4-7--suoni-opzionale)) e due blocchi nuovi, C4-10 e C4-11, con D15 ([piano](../client-c4-plan.md#decisioni-del-proprietario)).

### Parole del proprietario

Impressioni generali:

- «sugli schermi grandi, la conferma dello scarto può essere direttamente sulla carta che si sceglie da scartare, se no tocca spostare l'attenzione da una parte all'altra dello schermo varie volte»
- «il suono dei danni da impatto si sente solo una volta in un turno, non per ogni colpo (in 1v1, se il giocatore gioca per primo, quello dell'avversario non si sente. altri casi non provati)»
- «il suono dei danni da impatto è poco "impattante", servirebbe un bel tonfo per far capire che uno è stato menato»
- «anche il suono dei danni da taglio non comunica la sensazione del taglio»

iPhone:

- «i suoni ora sono belli responsive col tocco delle carte»
- «il suono della conferma ha un fastidioso click iniziale quando viene riprodotto»
- «su iphone15 ancora non sento nessun suono, ma forse è un problema dell'iphone di mia moglie»; poi: «iphone 15 aveva l'interruttore del silenzioso...»

Considerazioni:

- «il suono di vittoria e sconfitta non deve arrivare 8-9secondi dopo il pannello che dice che la partita è finita, ma contestualmente ad esso. e non deve comparire più tardi, ma quando la partita è finita»
- «ho notato che giocandoci l'attenzione non si sa mai dove debba andare, gli occhi vagano da un punto all'altro: valuetrei di aggiungere delle animazioni, dei resize, o delle altre strategie per guidare l'attenzione del giocatore verso cosa sta succedeno in quel momento e verso cosa deve fare»
- «inoltre, il gioco sugli schermi piccoli è affollato, mentre sugli schermi grandi è un po' spoglio. ha un feel meccanico, non ancora tanto da videogioco»
- «il gioco manca di tridimensionalità»
- sulla guida dell'attenzione: «non aggiungerei elenchi o altre cose, ma valuterei strategie visive per far intuire cosa bisogna fare. un giocatore che vuole giocare, beh, vuole giocare, non leggere»; «anzi, rivedrei il tooltip giallo in alto che a volte da fastidio»

### Lettura della regia e destinazioni

- **Un solo impatto per round:** è il comportamento previsto da C4-7 e C4-7-bis (suona l'impatto della prima carta), non un difetto; il proprietario vuole un suono per colpo → C4-7-ter.
- **Tonfo e taglio:** oggi un solo suono d'impatto (`drop_004.ogg`) per tutti i tipi di danno → C4-7-ter, con suoni per HIT e CUT e una proposta per POISON.
- **Click della conferma (`confirmation_001.ogg`) su iPhone:** causa da accertare (file o riproduzione) → C4-7-ter.
- **iPhone 15:** interruttore silenzioso attivo; con la sessione audio 'ambient' il silenzio è atteso e coerente col piano («l'interruttore silenzioso prevale»). Nessun lavoro.
- **Esito col pannello** → C4-7-ter; il pannello resta dov'è.
- **Attenzione, riepilogo giallo, conferma dello scarto sulla carta** → C4-10 (O29, O30); **affollamento, schermi grandi spogli, tridimensionalità** → C4-11 (con O28). Approvato dal proprietario: «mi sembra un buon piano» (D15).

Nessun codice cambiato, nessuna verifica eseguita per questa registrazione.

## C4-7-ter — Fase A

7 novembre 2026, base `e283f522311633fac5a09efa194949b2f2919cc5` su main, checkout pulito alla partenza e commit richiesto presente. **Fase A pronta, in attesa della scelta del proprietario. C4-7 resta non approvato; Fase B non avviata.** [Proposta completa, misure, regole, controlli e istruzioni di ascolto](../design/client-c4/audio/proposta-colpi.md).

**Solo documenti.** Regolamento, server, protocollo, catalogo, client-debug, file del Set Base, codice e test del client, asset e inventario distribuiti invariati. Nessun atteso, soglia o BASE_750 cambiato.

**Click:** nel file decodificato il picco nei primi 5 ms è 0,898749 (Edge) e 0,898729 (FFmpeg). Il render Web Audio dell'avvio coincide coi campioni decodificati (differenza 0); sblocco muto con picco 0; doppia decodifica identica. Provato il contenuto dell'attacco forte, non la causa hardware del click su iPhone. Rampa proposta di 5 ms sul guadagno della sola sorgente send, senza ritardare l'invio: campione iniziale a zero e salto massimo nei primi 5 ms ridotto del 16,8%. Pagina A/B con originale, 5 ms e alternativa 8 ms. Nessun audio convertito o modificato.

**Candidati:** Kenney Impact Sounds 1.0 e RPG Audio 1.0, CC0 esplicita sulle pagine ufficiali e nelle licenze incluse; download dal normale flusso delle pagine con Edge/Playwright in cartella nuova fuori repository. Un tentativo diretto proposto è stato respinto dal controllo automatico e non eseguito; nessun aggiramento, nessun mirror. ZIP 800850 + 964837 = **1.765.687 byte**, sotto 5 MB. Proposte HIT `impactPunch_heavy_000.ogg` (11617 B, 0,649025 s) e CUT `knifeSlice.ogg` (15532 B, 0,599542 s); tre candidati per gruppo. POISON raccomandato silenzioso, alternative come HIT o `impactSoft_medium_000.ogg` (5351 B, 0,118005 s). SHA-256 individuali e dei pacchetti nella proposta.

**Ascolto:** [pagina solo LAN](http://192.168.1.79:8767/), PC/iPhone sulla stessa rete; su iPhone disattivare il silenzioso. Server legato a IP privato, senza tunnel o pubblicazione, file solo in `%TEMP%\bm-c4-7-ter-20261107-listen`. HTTP 200, avvio dei candidati e della variante conferma verificati con Edge/Playwright, viewport 390×844: nessun errore JS e nessuno scorrimento orizzontale. Pagina lasciata attiva per la scelta; istruzioni di arresto/riavvio nella proposta. Nessun ascolto umano né raggiungibilità dall'iPhone provati dall'esecutore.

**Regole da scegliere:** tipo nominale coerente col segno visivo; una emissione per carta, priorità CUT > HIT > POISON per multi-tipo; nessun colpo sonoro per carte senza danno o annullate; colpi vicini con sorgenti indipendenti; tutti i colpi scavalcati dal tocco al tocco, con guadagno 1/N per emissioni simultanee. Esito indipendente al pannello, una volta per risultato personale live anche senza sequenza; viste storiche/riconnessione mute, nessun doppio esito dopo «Resta a guardare». Navigazione, skip e interruzioni fermano i suoni, niente recuperi. Tabella completa, alternative e motivi nella proposta: sono raccomandazioni, non decisioni già approvate.

**Sonde:** proposto il passaggio dalla guardia unica per round a identità per colpo e per esito personale, conteggio esatto dei punti raggiunti, confronto coi segni visivi e col pannello DOM; conservati errori/origini, divieto HTMLMediaElement, audio bloccato, mancanza file e copertura win/loss/input. Proposti test per ogni regola e mutazioni fuori repository della semantica c197517, senza usare import falliti come prova. Nessuna modifica alle sonde in Fase A.

**Verifiche eseguite:**

- `./scripts/build.ps1 -Task Test -Offline`: **579 server, zero fallimenti/errori, 7 saltati; client-debug 36/36**. Porte 8080 e 4320 libere e nessun Java/Maven esterno prima del lancio; nessun avvio del server per la diagnosi.
- `python scripts/check-rules.py`: **PASS**. `git diff --check`: PASS.
- Client `run.ps1 -Task Test`: **255/255**; `Build`: PASS (avviso Vite di chunk oltre 500 kB non compressi, soglie immutate); `Size`: PASS, JS gzip **340716 / 512000 B**, totale **1733198 / 4194304 B**, texture **27729048 / 33554432 B** per C4. Risultati uguali a C4-7-bis.
- Tentativo aggiuntivo `VerifyAll -Only 'test,build,size'`: **non completato**, exit 2 prima dei test: il lanciatore tenta di ricostruire il jar con Windows PowerShell e non trova `Get-FileHash`. I tre controlli sopra sono stati eseguiti singolarmente con successo; non si dichiara VerifyAll verde e non si cambia il lanciatore in questo blocco. Log in cartella temporanea.

**Non verificato:** nuovo comportamento di prodotto (non implementato), partite vere di C4-7-ter, iPhone/Safari, decodifica e interruttore fisico, suono effettivamente udito, distinguibilità e latenza percepita. `TestServerContext` e `verify-match-manifests.py` non eseguiti: nessuna attestazione di avvio Spring. Verifiche grafiche/750×292 e giri audio di Fase B non eseguiti. Nessuna nuova evidenza grafica da 5–10 MB necessaria in Fase A: misure numeriche nel documento, materiali di ascolto e script temporanei fuori git (D13).

**Al proprietario:** su PC e iPhone ascoltare HIT/CUT e confronto conferma; scegliere POISON e approvare/correggere la tabella delle regole. L'esito col pannello e un suono per colpo sono già decisi. Dopo la scelta si implementa e si esegue la matrice B, affrontando prima il problema del lanciatore; nessun codice di prodotto in questa fase.


## C4-7-ter — Fase B

7 novembre 2026, base `0e26924`; scelta registrata e pushata in `7b93b19`. **C4-7: fatto dopo C4-7-ter, in attesa del giudizio del proprietario.** [Scelte](../design/client-c4/audio/scelte.md#c4-7-ter--scelta-sulla-fase-a), [regole approvate e diagnosi](../design/client-c4/audio/proposta-colpi.md), [evidenze finali](client-c4/c4-7-ter/README.md), [conteggi](client-c4/c4-7-ter/verifiche.json).

### Risultato e perimetro

HIT usa **impactPunch_heavy_001.ogg** (10861 B, 0,535941 s); CUT **knifeSlice.ogg** (15532 B, 0,599542 s); POISON resta muto. OGG originali Kenney CC0 1.0, da Impact Sounds 1.0 (2019) e RPG Audio 1.0 (2014), scaricati in Fase A tramite pagine ufficiali. Inventario versione 4 con autore, URL ufficiali, licenza, byte e SHA-256; crediti aggiornati nella home esistente. `drop_004.ogg` rimosso. Sette file, **92075 B** totali; nessuna conversione.

`hitCues` segue lo stesso danno **nominale** del segno visivo, non inferisce danni effettivi, conversioni o causalità dai delta Salute. Ogni carta non annullata con HIT/CUT ha il proprio evento `partita/turno/indice`; multi-tipo CUT > HIT > POISON, carte senza danno, sconosciute o annullate mute. Struggle non diventa due colpi per il danno a sé. I colpi ravvicinati hanno sorgenti indipendenti; un tocco consuma tutti e soli i punti raggiunti, una volta ciascuno, con gain 1/N per le emissioni dello stesso aggiornamento. Nessuna coda o variazione del ritmo della sequenza. Scelta dalla mano scarta i pendenti.

L'esito personale è separato dalla sequenza: `OutcomeSounds` rileva una transizione nuova dal vivo e `useLayoutEffect` avvia il jingle quando il pannello è nel DOM, prima del paint. Il pannello non è spostato. Funziona anche senza sequenza; prima vista già finale, riconnessione, reset o esito ricevuto in background sono consumati muti. FFA: una sconfitta al primo pannello personale, niente secondo esito dopo «Resta a guardare». Fine normale/input lasciano finire un suono già partito; navigazione, salto e interruzioni fermano le sorgenti e non recuperano eventi. Il salto non impedisce un esito futuro nuovo dal vivo.

Per l'invio, un GainNode della sola sorgente sale da 0 a 1 in **5 ms**, con automazione e `start` sullo stesso `currentTime`; nessun timer o attesa sul comando. `confirmation_001.ogg` conserva peso e impronta. Selezione e rifiuto mantengono file e transizioni. Restano contesto unico, buffer decodificati una volta, master per volume/muto, preferenze persistenti, sessione ambient e interruttore silenzioso prevalente. Errori e audio non disponibile non bloccano il gioco e non lasciano recuperi; nessuna informazione solo sonora.

Non modificati regolamento, server, protocollo, catalogo, client-debug o file del Set Base. Nessuna geometria cambiata. `BASE_750`, soglie e test estranei all'audio invariati.

### Test e sensibilità

**265/265** test client, con **25** focalizzati su audio ed esito. Le quattro aspettative storiche di C4-7-bis sull'esito al colpo/coda e sulla sostituzione dell'impatto sono superate da D15 e dall'approvazione della Fase A, non mantenute artificialmente. Ricostruiti i test per pannello live, vittoria/sconfitta/pareggio, pannello senza sequenza, viste storiche, riconnessione/reset/background, FFA/watch, ogni colpo (secondo e quinto inclusi), multi-tipo, POISON, carte annullate/sconosciute, tempo e tocchi 0/1/N, input e interruzioni. Backend verifica sorgenti indipendenti, gain 1/N, attacco send esatto, master invariato, consumo in muto/volume zero/file assente/contesto sospeso e arresto dei suoni. Restano le prove di selezione/invio/rifiuto, storage, sblocco, ripiego silenzioso e notifiche accodate.

[Mutazioni su copie fuori repository](client-c4/c4-7-ter/mutazioni.json): baseline **25/25**; ripristinare separatamente le semantiche di `c197517` (primo colpo soltanto; stesso file di impatto; nessuna emissione dal pannello in attesa della sequenza; esito sostitutivo; nessun attacco send) fa fallire **1, 1, 3, 1, 1** test. Nessun import mancante conta come prova. I controlli già validi sulla base non sono stati forzati a fallire. Nessun atteso cambiato per assorbire una regressione: i cambi semantici dei test sono quelli deliberatamente approvati.

### Sonda e verificatore

Conservati fetch→decode→buffer→start, pagina, errori, origini esterne vietate, divieto HTMLMediaElement e audio negato. Aggiunti identità e consumo per colpo/esito, piano confrontato coi segni d'impatto realmente costruiti, punto raggiunto e tipo/file attesi. Il checker richiede esattamente un avvio per evento disponibile, nessun duplicato, colpi solo nella sequenza aperta e nessun recupero dopo chiusura; per l'esito richiede il pannello già nel DOM. Registra anche gli stop delle sorgenti; arresto e mancata ripresa hanno test unitari. [Sensibilità del checker](client-c4/c4-7-ter/checker-sensibilita.json): registro valido accettato; duplicato, esito perso, colpo perso, file errato, esito in un altro turno JS e HTMLMediaElement tutti respinti.

La prima nuova asserzione confrontava due timestamp arrotondati al millisecondo: segnalava 1 ms fra due chiamate sincrone. Corretta **senza aggiungere tolleranze temporali**: la sonda marca il turno sincrono del pannello e cancella il marcatore nella prima microtask; lo start deve portare quel marcatore. Ripetuto il giro ufficiale, stesso hash dist, sonda definitiva verde. Gli avvii osservati sono chiamate API, non suoni fisicamente uditi. `input` in `--require=win,loss,input` ora significa esito già avviato al pannello prima che il tocco chiuda la sequenza.

### Verifiche completate, una alla volta

Prima di ciascun giro porte 8080/4320 libere e nessun Java/Maven esterno; mai fermati processi altrui. Prima `./scripts/build.ps1 -Task Server` qui, poi ricostruzione Offline nel primo VerifyAll: jar **09966f18e97e23ae**, riusato dichiaratamente nei giri successivi, nessun jar di un'altra macchina. Il problema di Get-FileHash della Fase A si risolve nel solo ambiente del processo figlio usando i moduli WindowsPowerShell, senza modificare il lanciatore. Build client **b54a1228128dd03e**, invariata nei giri.

| Giro | Esito |
|---|---|
| VerifyAll `-Only 'test,build,size,verify,layout'`, misure ufficiali | **7/7**, ripetuto dopo la correzione della sonda; 76 round, fino a 2 colpi nello stesso round, 3 vittorie e 1 sconfitta al pannello anche dove Verify esce subito |
| VerifyResolution quick e interrupt, entrambe le misure (con test/build/size) | **5/5**; 34 round, fino a 2 colpi/round, 2 sconfitte al pannello, controlli di sequenza e interruzione verdi |
| Verify con audio negato, poi file mancanti, entrambe le misure | **2/2 + 2/2**, zero avvii udibili. Rimossi i sette file solo da dist/audio e ripristinati nel finally; Vite dà fallback HTML, che non si decodifica. Primo runner mancanti fermato prima della rimozione per rename fra dischi, corretto con copia di sicurezza/rimozione dei soli file generati; nessuna modifica al prodotto |
| VerifyOutcomeAudio, entrambe le misure | **8/8 partite**, **16 esiti personali** (4 vittorie e 4 sconfitte per misura), checker **--require=win,loss,input PASS** per entrambe; copre wait, tapAll, tapCross, skip, resize, uscita immediata e movimento ridotto senza sequenza |
| 750×292 `-Only 'build,verify,layout'` | build e Verify **verdi**, layout **rosso preesistente**, confronto sotto; un solo giro, non ripetuto per cercare un verde |
| `./scripts/build.ps1 -Task Test -Offline` | **579 server, zero errori/fallimenti, 7 saltati; client-debug 36/36** |
| `python scripts/check-rules.py` | **PASS** |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **686 test, 0 fallimenti, 0 errori, 7 saltati**, BUILD SUCCESS; verifica distinta dell'avvio e degli scenari applicativi |
| `python scripts/verify-match-manifests.py` | **PASS**, manifest storici non rigenerati |

**750×292:** [confronto](client-c4/c4-7-ter/m750/comparison.json) con C4-7-bis: duello **6/6/6 → 6/6/6**, FFA **11/11/11 → 11/11/11**; problemi complessivi **48 → 47**. Normalizzando solo gli ID computer e l'ordine delle coppie sovrapposte, nessun problema aggiunto; manca soltanto il vecchio errore dell'ispezione del gettone. Non si attribuisce una correzione del layout all'audio. Restano carte del round senza spazio, sovrapposizioni, primi piani e posti troppo piccoli. Verify questa volta passa: la base era variabile (gettone coperto dalla mano). BASE_750 sugli stessi input resta **[6,6,6,5]** per 2 posti e **[11,11,12,14]** per 5, test invariato e verde; nessuna soglia o atteso rilassati.

**Size:** JS gzip **341745 / 512000 B**, totale **1751615 / 4194304 B**, atlante massimo 2048 px, texture **27729048 / 33554432 B** per C4 (limite rigido 67108864). Audio 92075 B, gzip 77910 B. Tutto verde; tetti D9 invariati.

**Input**, quattro campioni duello/FFA: desktop **16,1 / 50,7 / 19,6 / 24,5 ms**, compatto **13,5 / 19,4 / 18,5 / 20,0 ms**. Tutti sotto 100 ms. Il primo giro sulla stessa build aveva desktop 12,8/14,6/15,8/29,5 e compatto 14,0/13,6/18,1/24,1; C4-7-bis aveva massimi 31,5 e 21,5. Si registra il picco di 50,7, senza nasconderlo né dedurne identità di prestazioni da partite diverse. Primo gesto di sblocco e latenza sonora percepita non misurati.

Evidenze finali circa **7.68 MB**, JSON e registri più sole catture finali selezionate e compresse (D13). Log completi, copie mutate e materiali intermedi fuori git. Catture osservate su Edge/PC; nessun cambiamento visivo del pannello o della geometria.

### Non verificato e prova del proprietario

Non verificati **iPhone, Safari, interruttore fisico, suono realmente udito e latenza percepita**; l'efficacia dell'attacco di 5 ms sul click segnalato richiede la prova fisica. Pannelli da forfait/tempo, storia finale recuperata e secondo esito FFA dopo «Resta a guardare» sono coperti dal contratto unitario del controller; non esiste un giro audio dedicato sul server vero per ognuno di questi casi. Il giro reale senza sequenza copre movimento ridotto. Il tipo sonoro è nominale come quello visivo: non certifica danno effettivo o conversioni. Non si dichiara verificato ciò che non è stato provato.

Al proprietario: **PC** — lasciare scorrere un round con due colpi e distinguere tonfo/lama, provare tocchi rapidi, vittoria/sconfitta al pannello, uscita immediata, skip e volume/muto; **iPhone** — stessi casi, soprattutto conferma senza click fastidioso e reattività, prima con silenzioso disattivato poi attivato (deve prevalere). In FFA verificare la sconfitta personale e «Resta a guardare» senza secondo jingle alla fine. La scelta dei file e delle regole è già approvata; resta il giudizio sul risultato implementato.

## C4-7-ter — prova del proprietario del 7 novembre 2026

Parole del proprietario dopo una prova della Fase B: «l'unico feedbackc he ho per ora è che il volume del sound effect del taglio è troppo alto rispetto agli altri effetti»; «mettiamo questo fix da fare da qualche parte e poi partiamo con la prossima attività».

Lettura della regia: rilievo sul livello di `knifeSlice.ogg`, non sulla scelta del file o sulle regole. La correzione è la Fase 0 di [C4-10](../client-c4-plan.md#c4-10--guida-visiva), in un commit a sé; il giudizio su C4-7 si dà dopo di essa. Per decisione del proprietario si parte con C4-10.

Nessun codice cambiato, nessuna verifica eseguita per questa registrazione.


### C4-10 — Fase 0

7 novembre 2026. **Fase 0 fatta, in attesa dell’ascolto del proprietario.** Solo volume CUT; Fase A non eseguita. Misure su file distribuiti con FFmpeg `volumedetect`, RMS medio e picco in dBFS (stesso strumento):

| File | RMS | Picco |
|---|---:|---:|
| click_001.ogg | -26,4 | -1,4 |
| confirmation_001.ogg | -11,3 | -0,9 |
| error_001.ogg | -19,0 | -0,8 |
| impactPunch_heavy_001.ogg | -17,5 | -1,2 |
| jingles_SAX07.ogg | -20,0 | -10,5 |
| jingles_SAX10.ogg | -19,7 | -9,8 |
| knifeSlice.ogg | -21,5 | -1,3 |

Il filtro FFmpeg `ebur128` misura loudness integrata -13,7 LUFS per CUT e -18,0 LUFS per HIT, differenza 4,3 LU; gli effetti sono brevi, quindi la misura non sostituisce l’ascolto. Guadagno della sola sorgente CUT **0,61** (circa -4,3 dB), moltiplicato per 1/N; master, altri suoni e file invariati. Nessuna conversione, inventario invariato.

Test su copia fuori repository: rimossa la sola moltiplicazione CUT, 2 test audio falliti su 15, 13 verdi; il test nuovo controlla anche HIT, esiti, interfaccia, master e attacco send. Aggiornato soltanto l’atteso CUT del test simultaneo, autorizzato dal proprietario; altre soglie, attesi e BASE_750 invariati.

Verifiche in sequenza, porte 8080 e 4320 libere e nessun Java/Maven esterno prima di ciascuna: jar ricostruito offline con successo; `VerifyAll -Only test,build,size -ReuseJar` 3/3 verdi, 266 test client passati, JS gzip 341.759 B, totale gzip 1.751.630 B, texture 27.729.048 B su 33.554.432 B. Il primo tentativo senza `-ReuseJar` si è fermato prima dei test: PowerShell avviato dal runner non trovava `Get-FileHash`; usato il jar appena ricostruito. `VerifyAll -Quick -Only resolution -Measures 1366x768,844x390 -ReuseJar`: 2/2 verdi (136 e 120 secondi), scenari ridotti, non giro completo. `build.ps1 -Task Test -Offline`: 579 test server, 0 errori, 7 saltati; client-debug 36/36. `python scripts/check-rules.py`: verde, 39 carte e 1 token, SQLite integro. Test unitari non attestano l’avvio del contesto Spring completo.

Non verificati iPhone, Safari e suono effettivamente udito; il proprietario giudica il bilanciamento all’ascolto.

### C4-10 — Fase A

7 novembre 2026, base `c09b946` (Fase 0) su main, checkout pulito. **Fase A pronta, in attesa della scelta del proprietario. Fase B non avviata.** [Proposta, diagnosi, catture e istruzioni per la Fase B](../design/client-c4/guida/proposta.md).

**Solo documenti e uno strumento di cattura.** Regolamento, server, protocollo, catalogo, client-debug, file del Set Base, audio e codice di prodotto del client invariati; nessuna soglia, atteso o `BASE_750` cambiato. I tre prototipi stanno in una [patch](../design/client-c4/guida/prototipo.patch) **fuori dal commit**, attivata solo da `localStorage['bm.guide']`. Committato `client-web/tools/guide-captures.mjs`, che gioca duello e FFA sul server locale e registra catture e posizioni; non è una verifica e non fallisce.

**Diagnosi (partite reali, Edge/PC, duello e FFA, 1366×768 e 844×390).** I punti peggiori: in sequenza tutto il tavolo resta acceso e il riepilogo giallo compare all'inizio della sequenza, in alto, col racconto del round in parole (in ogni cattura da 350 ms); comandi lontani dal punto d'azione: testo della calata da 440 a 680 px dalla carta col ✓ a 1366×768, ✓ da 523/708 px (duello/FFA 1366) e 220/422 px (844) dalla carta scartata (O30); nella scelta nessun segno «tocca a te» oltre al testo in basso a sinistra. La mira con le frecce funziona già.

**Strategie prototipate sul tavolo vero:** A «Riflettore» (velo scuro con fori sugli elementi a fuoco, lampo al colpo), B «Richiamo» (onda sulla mano, pulsazione dei bersagli e del ✓, tremito al colpo), C «Contrasto» (tinta grigia fuori fuoco, scala e «pugno» al colpo). Fuoco calcolato dagli `hits` e dalle postazioni, non da coordinate fisse; nessuna durata della sequenza cambiata, nessuna attesa sull'input. Misura grezza della luce: in sequenza la luminanza della mano (fuori fuoco) scende da 114/128 a 61/56 con A e a 65/66 con C (1366, duello/FFA); con B resta 111/109. **Raccomandata A** (eventualmente col tremito del colpo di B): non sposta nulla rispetto a `hits` e controlli, non cambia i colori, resta intera con movimento ridotto, è la più leggera per Safari.

**O29:** raccomandata la sostituzione del riquadro giallo con un bagliore sulle carte del round (che aprono «Ultimo turno»), testo conservato in uno stato nascosto per il lettore di schermo, note di salto (D4) invariate. **O30:** ✓ e × sulla carta scartata a tutte le misure ufficiali (distanza da 220–708 px a 0).

**Verifiche eseguite:** prima di ogni giro porte 8080 e 4320 libere e nessun Java/Maven esterno; jar ricostruito offline in locale (`aa312de0c47327e7`). Catture: oggi 3 turni, A/B/C 2 turni, duello e FFA alle due misure, più A con movimento ridotto a 1366×768; 0 errori di pagina. Sul codice di prodotto ripristinato (patch tolta, `git apply --check` della patch verde): client `Test` **266/266**, `Build` verde (solito avviso Vite sui chunk), `Size` verde (JS gzip 341 759 B, totale 1 751 630 B, texture 27 729 048 / 33 554 432 B; `size.json` di C2 riscritto da Size e ripristinato); `./scripts/build.ps1 -Task Test -Offline` **579 server, 0 fallimenti/errori, 7 saltati; client-debug 36/36**; `python scripts/check-rules.py` verde; `git diff --check` verde. Nessuna verifica Playwright della matrice (`Verify`, `VerifyFfa`, `VerifyAim`, `VerifyResolution`, `VerifyLayout`, 750×292): il prodotto non cambia; spettano alla Fase B. Contesto Spring non eseguito. Evidenze in git circa **4,9 MB** (38 catture ricompresse, misure, patch, D13); catture complete fuori git.

**Non verificato:** iPhone, Safari, fluidità percepita (le catture sono fotogrammi fermi; il movimento di B si giudica dal vivo), lettore di schermo, partite fra due umani (attesa lunga), pannello d'esito con le strategie. Nessuna verifica di Fase B sui prototipi.

**Al proprietario:** scegliere la strategia (A, B, C o ibrido), O29 (a/b/c) e O30 (a/b/c); per provarle dal vivo, applicare la patch come descritto nella proposta.

### C4-10 — Fase B

9 novembre 2026, base `d70be28` («C4-10: record the owner's choice of strategy B») su main, checkout pulito. **C4-10: fatto, in attesa del giudizio del proprietario.** [Scelta](../design/client-c4/guida/proposta.md#scelta-del-proprietario): B «Richiamo» con l'onda più veloce e meno ampia; O29 riquadro giallo tolto, nessun bagliore; O30 (a) con ✓ e × centrati sulla carta scartata e più trasparenti. Evidenze: [cartella](client-c4/c4-10/README.md).

Non toccati regolamento, `docs/sets`, server, protocollo, catalogo, client-debug, file del Set Base, audio, editor dei mazzi. Durate e calendario della sequenza invariati (gli intervalli della guida sono quelli già calcolati dalla scena); nessuna attesa né timer sul percorso di input (la guida si ricalcola nel `tick` esistente); nessun testo nuovo sullo schermo; nessun bagliore; «Ultimo turno» invariato (carte del round, menu, pannello d'esito). Soglie e `BASE_750` invariati.

#### Base di partenza

Prima del codice: porte 8080 e 4320 libere, nessun Java/Maven esterno; jar ricostruito qui con `./scripts/build.ps1 -Task Server -Offline` (**`7e6045b4e53b0395`**, BUILD SUCCESS), poi riusato dichiaratamente in tutti i giri. VerifyAll `-Only 'test,build,size,verify,layout'` alle misure ufficiali: **7/7 verde**; client **271** test; size JS gzip **344 784**, totale **1 754 655**, texture **27 729 048** B; input massimi di `VerifyLayout` duello/FFA, due campioni ciascuno: 1366×768 **14,4/17,7** e **16,2/25,0** ms, 844×390 **13,8/13,7** e **15,0/20,1** ms ([evidenze](client-c4/c4-10/base/)). La build della base è stata fatta prima di ogni modifica (dist della base); mentre il giro proseguiva ho cominciato a scrivere il codice, e il layout a 844 importa da `src/readability.ts` alcune funzioni pure che sono rimaste invariate: lo dichiaro, il risultato vale per la base.

#### Cosa fa

- **Fuoco** (`guideFocus`, `readability.ts`, puro): scelta → carte della mano; mira → bersagli ammessi da `Model.allows` (e la carta scelta); conferma → carta posata e bersaglio (la carta scartata è a fuoco ma ferma, perché ci stanno sopra ✓ e ×); scarto → sole regolari della mano e carta posata; attesa (invio, mossa ricevuta, connessione incerta) → avversari ancora in gioco; sequenza → autore e bersaglio della carta in corso, sugli intervalli costo→atterraggio già pianificati, con il colpo all'istante `hit`; esito, eliminato o forfait → nessuno. Una scelta fatta durante la sequenza vince (regola 4).
- **Movimento** (`guideMotion`, puro): onda sulla mano in scelta e scarto; pulsazione dei bersagli e della carta posata ±3,5%, degli avversari in attesa ±1,5%; autore e bersaglio +7% in sequenza; tremito del tavolo al colpo (180 ms). ✓ pulsa in CSS (scala 1,14, 1 s) finché la mossa si può confermare.
- **Applicazione** (`GuideRest` in `readability.ts`, chiamata alla fine di `tick` in `scene.ts`): a ogni frame ogni nodo mosso torna prima a riposo e poi riceve la posa; la guida tocca solo altezza e scala (mai la x, che appartiene allo scossone di C3-5 e al trascinamento); `draw()` ricrea i nodi a riposo. Il tremito sposta `world` e `fx`, mai lo strato semantico HTML.
- **Stato per le verifiche:** `window.__bm.state.guide` (`kind`, `ids`, `wave`, `pulse`, `grow`, `hit`, `shake`, `moved`, `still`), `confirmCard`, `shortSummary`, `players`; `window.__bm.guideStill(on)` ferma la guida per le misure.

#### Valori dell'onda (costanti `GUIDE`, un solo punto, da confermare dal vivo)

| | Prototipo (Fase A) | Fase B |
|---|---:|---:|
| Altezza, desktop / compatto | 14 / 8 px | **8 / 5 px** |
| Salita e discesa di una carta | 600 ms | **360 ms** |
| Ritardo fra una carta e la successiva | 110 ms | **60 ms** |
| Ripetizione in scelta / in scarto | 3,6 / 2,4 s | 3,6 / 2,4 s (invariata) |

Un passaggio su una mano di otto carte dura 780 ms invece di 1370 ms, poi la mano resta ferma fino alla ripetizione. Pulsazioni (±3,5%, ±1,5%, periodo 2π·230 ms), crescita (+7%) e tremito (6 / 3 px, 5 mezze oscillazioni in 180 ms) come nel prototipo: il proprietario le ha dette «perfette».

#### Tocchi e strato semantico

Gli `hits` non sono né letti né scritti dalla guida: sono gli stessi di oggi a ogni istante, e la prova di un tocco (`hitAt`, estratta da `scene.hit` senza cambiarne la logica) dà gli stessi risultati. Un tocco sul bordo visivo di una carta sollevata dall'onda o di un bersaglio ingrandito cade quindi dove cade oggi, anche se la carta disegnata è spostata di qualche pixel; il test `C4-10 touch` lo prova su 50 punti di bordo (dentro e appena fuori di ciascun `hit`, più i bordi visivi spostati) durante scelta, mira e colpo. Il tremito non sposta lo strato semantico (posizionato dagli `hits`) né i tocchi sul canvas (provati sugli `hits`).

**Il click dopo il tocco.** Il primo giro della matrice (`VerifyLayout` rosso a entrambe le misure, O26 «candidate … covered/unreachable (with target)») ha trovato un difetto vero portato da O30: con il bersaglio scelto, il tocco su una regolare la sceglie come scarto al `pointerup`, React disegna ✓ e × sulla carta scartata, cioè sotto il dito, e il click che il browser sintetizza dopo `touchend` cade su × e annulla la mossa. Col mouse non succede (il click va al canvas). Correzione in `scene.ts`: il canvas annulla l'azione predefinita di `touchend`, così il click sintetico non parte; il canvas lavora solo con gli eventi pointer e non ha mai usato quel click. Riprodotto prima e dopo con uno script Playwright a tocco (tre regolari: prima scelta annullata, dopo scarto scelto); test di sorgente in `guide.test.ts` e il controllo O26/O30 di `VerifyLayout`.

#### Movimento ridotto

Con `prefers-reduced-motion` (e con `guideStill`) `guideMotion` non restituisce nulla: nessuna onda, pulsazione, crescita o tremito; ✓ non pulsa (`animation: none`). Resta ciò che c'è oggi: contorni petrolio dei bersagli, frecce ferme, alone sulla carta scelta. È la stessa informazione di oggi, senza la guida; la rifinitura resta a C4-8a.

#### O29 e O30

**O29.** Il riepilogo breve non si disegna più quando non è una nota dopo un salto: il testo va in un `<p class="sr-only" role="status" data-testid="brief">`; le note di `roundNote` (D4) restano nel riquadro visibile, nel posto del layout, e si aprono su «Ultimo turno». Nessun bagliore sulle carte del round. La decisione è nella funzione pura `shortSummary`.

**O30.** Con lo scarto scelto, ✓ e × stanno sulla carta scartata **come è disegnata**: sollevata (la carta scartata ora resta sollevata qualunque cosa faccia il puntatore, così il riquadro non salta), centrata sul centro disegnato, larga e alta quanto la carta ingrandita (`H.w·zoom × H.h·zoom`), ruotata come la carta e il suo pulsante semantico. Il riquadro è più trasparente (fondo 8% invece di 15%, metà 35% invece di 70%). Stessa semantica di C4-2: metà alta conferma, metà bassa annulla, stessi pulsanti HTML. Ogni metà ≥ 44 px a 1366×768 e 844×390 (test e `VerifyLayout`). Nel prototipo il riquadro era l'`hit` sollevato, più alto della carta e spostato in basso di metà sollevamento: era «storto».

**Consegna 1 del Set Base.** Regolamento 1.13, R03: «Un giocatore vivo con un mazzo conforme a R02 ha sempre una mossa (1.12)», e i mazzi non conformi non si usano per giocare (1.12, D20): il caso del menu non si presenta più. Tolta la frase «Se nessuna carta è giocabile il gioco non prevede di passare…» da `table.tsx` e la consegna da `docs/orchestrazione-lavoro.md`.

#### Attesi cambiati (O29, decisione del proprietario del 9 novembre 2026)

- `VerifyLayout` (`briefProblems`): senza nota, il controllo diventa «nessun `.toast` disegnato; uno stato nascosto presente, non visibile, con lo stesso testo della riga del modello e della riga ricalcolata da `briefLine` sui fatti della vista». Con una nota restano tutti i controlli di C3-6 (posto, sovrapposizioni, corpo 16/13 px). Misure e catture di ogni turno con `guideStill(true)`.
- `VerifyResolution` (K5 a scheda nascosta): il riepilogo che non scade si legge nello stato nascosto, con lo stesso testo di `shortSummary`; in più nessun `.toast` disegnato né durante né dopo. Le righe guardando da eliminati registrano anche lo stato nascosto (`status: …`), separato dalle note.
- `Verify` (fine turno): il resoconto si apre dal menu, «Ultimo turno», invece che toccando il riquadro.
- Aggiunto in `discard-checks.mjs` (usato da `VerifyLayout`) il controllo O30: centro entro 1 px dal centro disegnato della carta scartata, dimensioni della carta ingrandita, rotazione uguale a carta e pulsante, classe più trasparente, due metà raggiungibili e ≥ 44 px, un posto diverso per ogni scarto.

Nessun'altra soglia o atteso toccato; `BASE_750` invariato.

#### Test e mutazioni

Client: **289 test** (271 della base + 18 nuovi in `tests/guide.test.ts`), `tsc` verde. I nuovi coprono ogni momento sul modello vero e sulla funzione pura: scelta, mira con 1 e 4 bersagli, conferma con e senza scarto, scarto, attesa (invio, mossa ricevuta, connessione incerta), sequenza a metà di ogni carta e al colpo, esito; ritorno a riposo; movimento ridotto fermo; O30 che segue lo scarto e cambia con lui, centrato a 1366×768 e 844×390 in duello e FFA; O29 con e senza nota; tocchi invariati; nessun bagliore né frase R03; il click sintetico fermato.

[Mutazioni](client-c4/c4-10/mutazioni.json) su copie di `src` e `tests` fuori dal repository (`%TEMP%`), `guide.test.ts` + `hand-choice.test.ts`, base 22/22:

| Mutazione | Test falliti |
|---|---:|
| tolto il ritorno a riposo | 1 |
| tolto il cambio della conferma (sempre sulla carta posata) | 2 |
| ridato il riquadro giallo senza nota | 1 |
| tolto il centraggio (riquadro dell'`hit` sollevato, come il prototipo) | 1 |
| tolta la precedenza della scelta sulla sequenza | 2 |
| tolto l'arresto del click dopo il tocco | 1 |
| ignorato il movimento ridotto | 1 |

#### Verifiche, una alla volta

Prima di ogni giro porte 8080 e 4320 libere e nessun Java/Maven esterno; mai fermati processi altrui (fermate solo due mie anteprime Vite rimaste sulla 4320); mai due verifiche insieme. Jar `7e6045b4e53b0395` riusato.

| Giro | Esito |
|---|---|
| Primo giro della matrice: `test,build,size,verify,ffa,aim,resolution,layout`, misure ufficiali ([evidenze](client-c4/c4-10/fase-b/primo-giro/)) | **10/13**: rossi layout 1366 e 844 (difetto nuovo, corretto: vedi «Il click dopo il tocco») e aim 844 |
| Dopo la correzione: `layout,aim,verify`, misure ufficiali ([evidenze](client-c4/c4-10/fase-b/layout-aim-verify/)) | **5/6**: verify 1366 (1 min 35 s) e 844 (2 min 11 s), aim 1366, layout 1366 e 844 **verdi**; aim 844 **rosso preesistente** |
| aim 844 sulla base `d70be28` (stash delle modifiche, ripristino verificato byte per byte) ([evidenze](client-c4/c4-10/base-aim844/)) | **rosso**, stesso tipo: freccia verso un computer «flagged as crossing the buttons» e sopra ✓/× in FFA e in attesa, con le legate al personaggio. Il calcolo delle frecce non è toccato dalla Fase B |
| Sul codice finale: `test,build,size,ffa,resolution`, misure ufficiali ([evidenze](client-c4/c4-10/fase-b/ffa-resolution/)) | **7/7**: ffa 8 min 53 s / 6 min 01 s; resolution completa 31 min 20 s / 30 min 57 s, 21 controlli per misura (quick, interruzioni, movimento ridotto, salto, umani, rientro, riepiloghi), 0 errori |
| 750×292 `verify,layout` ([evidenze e confronto](client-c4/c4-10/fase-b/m750/)) | verify **verde**; layout **rosso preesistente**: conteggi per turno duello **6/6/6**, FFA **11/11/11** come C4-7-ter; problemi 47 → 48, l'unico in più è l'ispezione del gettone già vista in C4-7-bis (variabile: gettone coperto dalla mano). `BASE_750` invariato |
| `./scripts/build.ps1 -Task Test -Offline` | **647 server, 0 fallimenti/errori, 7 saltati; client-debug 37/37** |
| `python scripts/check-rules.py` | **PASS** |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **757 test, 0 fallimenti/errori, 7 saltati**, BUILD SUCCESS (verifica separata del contesto Spring) |
| Catture finali `guide-captures.mjs`, normale e `BM_REDUCED=1` ([evidenze](client-c4/c4-10/catture/)) | 0 errori di pagina; nessun `.toast` in nessun momento; ✓ e × sulla carta scartata a entrambe le misure |

**O30 misurato da `VerifyLayout`:** a ogni scarto il centro del riquadro dista meno di 0,02 px dal centro disegnato della carta scartata; riquadro 240×331 a 1366×768 e 144×199 a 844×390; rotazione uguale a carta e pulsante.

**Size:** JS gzip **346 449 / 512 000** B (+1 665 sulla base), totale **1 756 480 / 4 194 304**, texture **27 729 048** invariate.

**Input** (`VerifyLayout`, duello due campioni / FFA due campioni, con la guida in funzione fra le misure): desktop **16,6 / 16,0 / 18,4 / 33,9** ms, compatto **14,5 / 15,7 / 24,3 / 24,0** ms; base 14,4/17,7/16,2/25,0 e 13,8/13,7/15,0/20,1; C4-7-ter 16,1/50,7/19,6/24,5 e 13,5/19,4/18,5/20,0. Tutti sotto 100 ms; il picco 33,9 (FFA desktop) è nell'intervallo già visto in C4-7-ter, partite diverse.

**Rossi:** già presenti aim 844 (provato sulla base) e layout 750×292 (stessi conteggi di C4-7-ter). Nuovo e corretto: il tocco sullo scarto. Nessun rosso nuovo rimasto.

#### Non verificato

iPhone e Safari (fluidità delle scale su molti nodi a ogni frame: rischio già noto, C4-8b), fluidità percepita in generale, lettore di schermo reale sullo stato nascosto, partite fra due umani (attesa lunga con la pulsazione degli avversari). Le catture sono fotogrammi fermi: l'onda e il tremito si giudicano dal vivo.

#### Al proprietario, dal vivo

Ampiezza e velocità dell'onda sulla mano (valori sopra, si cambiano in un punto), centraggio e trasparenza di ✓ e × sulla carta scartata, assenza del riquadro giallo (le note dopo un salto restano), e il volume del taglio della Fase 0.

## C4-10 — prova del proprietario del 9 novembre 2026

Prova dal vivo della Fase B (`c98b13d`), server locale e anteprima in rete locale preparati dalla regia. Parole del proprietario: «mi sembra tutto adatto a quello che abbiamo corretto»; «le uniche considerazioni che mi vengono verranno già affrontate nei prossimi punti, quindi direi che approvo. andiamo avanti».

**Esito.** C4-10 approvato (Fase 0, Fase B, O29 e O30), e con esso C4-7 dopo C4-7-ter e la correzione del volume del taglio: era il giudizio rimandato alla prova di C4-10. Valori dell'onda in `GUIDE` confermati come sono. Prossimo blocco: C4-11.

Revisione della regia sul repository prima della prova: commit coerente con la scelta del 9 novembre; attesi cambiati solo per O29; `BASE_750` invariato; rilanciati qui i test del client (289, 0 falliti), `tsc` e `check-rules.py` (PASS). Gli altri giri sono quelli della relazione della Fase B, non ripetuti.

### C4-10 — destinazioni della regia

- **`VerifyAim` a 844×390, rosso preesistente.** In FFA e in attesa una freccia verso un computer passa sopra ✓/× quando la carta scelta è una legata al personaggio (Ghigno co' i' Denti Marci, Ago Marcio e Spezzato); rosso anche sulla base `d70be28` ([evidenze](client-c4/c4-10/base-aim844/)). L'ultima evidenza committata di `VerifyAim` a 844 prima di C4-10 è verde, nel giro dopo il giudizio di C4-2; il caso è probabilmente comparso con i mazzi di R02 1.12 (base e due legate al personaggio), non dimostrato. È geometria del tavolo: va a **C4-11**, che lo chiude o lo dichiara.
- **Jingle d'esito tagliato da un ridimensionamento.** `scene.interrupt` con `sequence` (il valore predefinito) chiama `stopAll` anche quando nessuna sequenza è in corso; lo chiamano `resize`, `resize` di `visualViewport`, `pointercancel`, Esc e il cambio del movimento ridotto. Il jingle d'esito, che parte col pannello a sequenza finita, e i suoni dell'interfaccia possono quindi essere troncati; su iPhone basta la barra di Safari che compare o sparisce. È conforme alla regola approvata ([proposta dei colpi](../design/client-c4/audio/proposta-colpi.md), «Interruzione, resize, background, disconnessione») e alla conseguenza già dichiarata per `visualViewport` nella [proposta dell'esito](../design/client-c4/audio/proposta-esito.md), che lo rimandava a O28: O28 ora è in **C4-11**, che lo riprova su iPhone; cambiare la regola resta una decisione del proprietario.
- La consegna 1 del Set Base (frase del menu su R03) è chiusa dalla Fase B: tolta anche dal perimetro di C4-8a.

Nessun codice cambiato, nessuna verifica grafica eseguita per questa registrazione.

## C4-11 — Fase A

9 novembre 2026, base `f706a4e` («C4: record the owner's approval of C4-10 and C4-7») su main, dopo il pull dal remoto (avanti di tre commit di soli documenti ed evidenze: `d70be28`, `c98b13d`, `f706a4e`; nessun cambiamento a server, regolamento o set), checkout pulito. **Fase A pronta, in attesa della scelta del proprietario. Fase B non avviata.** [Proposta, diagnosi, catture, istruzioni per provare i prototipi e domande](../design/client-c4/spazio/proposta.md). Evidenze: [cartella](client-c4/c4-11/README.md).

**Solo documenti e due strumenti.** Regolamento, `docs/sets`, server, protocollo, catalogo, client-debug, file del Set Base, audio, editor dei mazzi, costanti `GUIDE` e logica della guida di C4-10, durate e calendario della sequenza, soglie, attesi e `BASE_750` invariati; codice di prodotto del client invariato nel commit. I prototipi stanno in una [patch](../design/client-c4/spazio/prototipo.patch) **fuori dal commit**, attivata solo da `localStorage['bm.space']` (o `?space=` nell'indirizzo). Committati [`space-probe.mjs`](../../client-web/tools/space-probe.mjs) (sonda della geometria sulle funzioni pure del client o sui layout registrati) e l'estensione di [`guide-captures.mjs`](../../client-web/tools/guide-captures.mjs) (`BM_SPACE`, `BM_SAFE`, `BM_LAYOUT`): non sono verifiche e non falliscono.

**Diagnosi (partite reali, Edge/PC, duello e FFA, 1366×768, 844×390 e 1920×1080 diagnostica).** A 844×390 il vuoto c'è (38–45%) ma è sbriciolato (in FFA il rettangolo libero più grande è 88×226), tutto è alla misura minima (carte del round 36×50, plance altrui con cifre di circa 10 px, posti a 9,6 px, 0,6 con tre oggetti) e competono titolo, posto vuoto degli scarti, colonna degli autori del round e oggetti di scena. A 1920×1080 il vuoto è il **64–70%**: i tetti di C3-L (mano 214 px, base 150 px) fermano ogni misura dai 768 px di altezza in su. Profondità: un'ombra netta sotto le carte, nient'altro. Fattori e misure di oggi (base della regola 17) e `layoutProblems` a 750×292 (duello 6/5, FFA 11/14 con 1/3 oggetti, uguali a `BASE_750`) sono nella proposta.

**Opzioni prototipate e raccomandazioni:** a) **a1 + a2** (cornice leggera; carte del round in pila: 36→60 px a 844 FFA, a 750×292 FFA 11→10 problemi); b) **b1** (misure che crescono sopra 800 px di altezza: a 1920×1080 vuoto 70→52% e 64→45%, identico a 1366×768 e sotto), b2 no; c) **c1** (ombre morbide, 16 KiB di texture), c2 da giudicare dal vivo (144 KiB, due quadrati a tutto schermo per frame); d) O28 **solo se la prova su iPhone convince**: recupera il bordo del tavolo (874 invece di 750 px), non spazio di gioco. Nessuna opzione cambia fattori o misure a 1366×768 e 844×390 (sonda), nessuna sposta gli `hits` rispetto al disegno, nessuna tocca la guida di C4-10 o il movimento ridotto.

**`VerifyAim` 844: causa trovata.** La legata scelta resta a riposo (O26), la freccia parte più in basso; a 844×390 FFA l'angolo in basso a sinistra del posto in mezzo a destra sta dentro il margine del vecchio posto di ✓/× che le frecce devono evitare (regola 17), e `aimArrows` cambia partenza e curvatura ma non la punta; `layoutProblems` prova solo la carta centrale sollevata. Riprodotto con la sonda e sul tavolo vero. **Raccomandata la correzione v1** (la punta può cadere su un altro lato del bersaglio): 0 frecce che attraversano a ogni misura, fattori e `layoutProblems` identici, `VerifyAim` invariato.

**Jingle:** comportamento conforme alla regola approvata; `stopAll` anche senza sequenza; il jingle (0,64 s vittoria, 1,74 s sconfitta) parte col pannello, all'inizio della sequenza finale, quindi «fermare solo con sequenza in corso» (J1) non lo salverebbe. **Raccomandata J2** (l'interruzione ferma solo i colpi del round). Decide il proprietario.

**Al proprietario:** sette [domande numerate](../design/client-c4/spazio/proposta.md#domande-al-proprietario) (a, b, c, d, `VerifyAim`, jingle, 1920×1080 come misura ufficiale); immagini nuove non raccomandate ora (D11).

**Verifiche eseguite.** Prima di ogni giro porte 8080 e 4320 libere e nessun Java/Maven esterno (i Node presenti sulla macchina erano di altri progetti, non toccati); mai due giri insieme; jar ricostruito una volta qui con `./scripts/build.ps1 -Task Server -Offline` (**`5684bffda536ac67`**, BUILD SUCCESS) e usato da tutte le catture. Catture: oggi a 1366×768, 844×390, 1920×1080 e 750×292; a1+a2 e v1 a 844×390; b1, b2, b1+b2 a 1920×1080; c1 e c2 alle tre misure; d a 874×292 con area sicura emulata; **0 errori di pagina** in tutti i giri. Con la patch applicata e nessuna chiave: client `Test` **289/289** (dopo aver definito in `:root` le due variabili CSS del prototipo, che il controllo dei colori di C4-5b richiede). Sul prodotto ripristinato (patch tolta, `git apply --check` verde, andata e ritorno della patch identico; SHA-256 `0cfc6ebb6562f0e4…`): client `Test` **289/289**, `Build` verde (solito avviso Vite sui chunk), `Size` verde con `BM_OUT` ([size.json](client-c4/c4-11/verifiche/size.json): JS gzip **346 449**, totale **1 756 480**, texture **27 729 048 / 33 554 432**, uguali a C4-10 Fase B; `docs/reports/client-c2/size.json` intatto); `./scripts/build.ps1 -Task Test -Offline` **647 server, 0 fallimenti/errori, 7 saltati; client-debug 37/37**; `python scripts/check-rules.py` **PASS**; `git diff --check` verde (nella patch le righe di contesto vuote sono senza lo spazio iniziale, che `git apply` accetta). Nessuna verifica Playwright della matrice: il prodotto non cambia, spettano alla Fase B. Contesto Spring non eseguito. Evidenze in git **9,8 MB** (59 catture ricompresse, JSON minificati, sonda; D13); catture intere fuori git.

**Non verificato:** iPhone e Safari (O28, `env()`, `viewport-fit` cambiato dopo il caricamento, costo per frame di c1 e c2, jingle sulla barra di Safari), fluidità percepita, lettore di schermo, partite fra due umani. La scelta da indirizzo (`?space=`) è stata aggiunta alla patch dopo le catture (le catture usano `localStorage`, stessa lettura).

## C4-11 — Fase B

10 novembre 2026. **C4-11: fatto, in attesa del giudizio del proprietario.** [Scelta del proprietario](../design/client-c4/spazio/proposta.md#scelta-del-proprietario) del 10 novembre; evidenze nella [cartella della Fase B](client-c4/c4-11/fase-b/README.md).

**Codice e verifiche in due tempi.** B1 (codice e test unitari, senza Playwright) è nei commit `066aa07` («C4-11: record the owner's choice», solo la scelta nella proposta) e `681bc20` («C4-11: phase B code (verifications pending C4-1c)»), sulla base `d795eee`. B2 (questo commit, solo documenti ed evidenze) ha eseguito le verifiche mirate sul codice di `681bc20`, senza attendere C4-1c, per **cambio di piano del proprietario**. Su questa macchina C4-1c non c'è: i suoi cambi ai documenti comuni si uniranno al rebase. All'avvio di B2 l'albero era pulito e `origin/main` era già a `681bc20` (nessun rebase necessario).

**Decisione di metodo ([D16](../client-c4-plan.md#decisioni-del-proprietario), 10 novembre 2026).** Il proprietario: «mi piace il compromesso». A ogni blocco di C4 verifiche economiche (test, build, size, test del server, `check-rules.py`) più solo le Playwright legate a ciò che il blocco tocca; [matrice completa alla fine di C4](../client-c4-plan.md#matrice-completa-di-fine-c4), prima di C5, con le correzioni allora. Le approvazioni dei blocchi restano soggette a quella matrice. C4-11 è stato sovrapposto a C4-1c, in deroga all'ordine in serie.

Non toccati: regolamento, `docs/sets`, server, protocollo, catalogo, client-debug, file del Set Base, editor dei mazzi, file audio; durate e calendario della sequenza; costanti `GUIDE` e logica della guida di C4-10; codice degli strumenti (`client-web/tools`, `client-web/run.ps1`, `vite.config.*`). Nessun asset da Internet, nessuna immagine nuova. Soglie e `BASE_750` invariati.

### Cosa fa

- **a1 (tavolo compatto, sotto 550 px di altezza):** il titolo non si mostra (CSS), gli oggetti di scena scendono al 55% (`LIGHT_FRAME`, `tableFrame`), il posto vuoto degli scarti non si disegna.
- **a2 (pila delle carte del round, solo sul compatto):** una carta visibile, con un'etichetta larga quanto la carta: autore della carta in cima (vinaccia con ✕ se annullata) e conteggio delle carte mostrate (vinaccia con ✕ se sotto la cima c'è un'annullata). a3 non implementata: resta riserva per prove future su mobile. **Diverso dal prototipo:** a 844×390 FFA con due oggetti per posto la pila del prototipo toglieva a un posto la striscia del riepilogo, e un test esistente lo ha trovato. La pila ora prende la carta più grande che lascia a ogni posto le strisce che lasciava la cascata (tre insiemi di segni: tipico, «invariato», pesante), mai più piccola della cascata; se nessuna misura ci riesce resta la cascata. Il risultato è in cache per misura, posti e oggetti (senza cache circa 10 ms per disegno, con la cache meno di 0,05 ms). Su desktop la cascata di C3-L resta com'è.
- **b1 (schermi grandi, attenuato):** vedi formula sotto. Moltiplica tetto della mano (214), sollevamento (30), tetto della base (150), pile e anteprima. Plance e dorsi non crescono (come nel prototipo) e non scendono.
- **Ombra:** vedi valori sotto.
- **d (O28):** `viewport-fit=cover` in `client-web/index.html`; `src/safe.ts` legge `env(safe-area-inset-*)` con un elemento sonda e imposta `--safe-l`/`--safe-r`; il tavolo si dispone nella larghezza sicura (`shiftLayout`, che sposta anche il testo della mossa); titolo, menu, orologio e suggerimento restano dentro. Limite: l'anteprima della carta e i riquadri della shell usano ancora la larghezza intera.
- **v1 (`aimArrows`):** se ogni percorso verso il lato del bersaglio rivolto alla carta attraversa la zona del vecchio posto di ✓ e ×, la punta prova gli altri lati, dal più vicino alla carta. `VerifyAim` non è cambiato.
- **J2:** `scene.interrupt` (ridimensionamento, `visualViewport`, `pointercancel`, Esc, cambio del movimento ridotto) chiama `Sounds.interruptRound`: ferma e consuma solo i colpi del round in corso; il jingle d'esito e i suoni dell'interfaccia continuano. La fine di una sequenza interrotta (`endSound`) ferma solo il round; «Salta effetti» ferma tutto; fine completa e input lasciano suonare. Muto, uscita dal tavolo, background, disconnessione e reset fermano tutto come prima. Aggiornata la riga «Interruzione, resize, background, disconnessione» della [proposta dei colpi](../design/client-c4/audio/proposta-colpi.md) con la decisione del 10 novembre. Nessun tipo nuovo nella traccia audio (`check-audio-probe` accetta un insieme fisso).

### Formula di b1 e misure

`fattore = max(1; 0,9 × min(altezza/800; larghezza/1422))`, sempre 1 sul tavolo compatto (`GROW`, `growth` in `readability.ts`). È il 90% della crescita del prototipo, limitata anche dalla larghezza: con la sola altezza (prototipo), a 1920×1440 i fattori di C3-L cedevano e comparivano 2–3 problemi di layout. Fino a 889 px di altezza le misure sono identiche a oggi.

| Misura | Fattore | Mano | Tuo personaggio duello / FFA | Altri duello / FFA | Carta del round duello / FFA | Vuoto duello / FFA |
|---|---|---|---|---|---|---|
| 1920×1080 | ×1,215 | 214 → 260 | 225 → 273 / 176 → 213 | 180 → 219 / 140 → 171 | 150 → 182 / 117 → 142 | 69,8 → 58,3% / 64,2 → 51,2% |
| 2560×1440 | ×1,62 | 214 → 347 | 225 → 365 / 176 → 284 | 180 → 292 / 140 → 227 | 150 → 243 / 117 → 190 | 83 → 61% / 80 → 55% |
| 1920×1440 (4:3) | ×1,215 | 260 | come 1920×1080 | come 1920×1080 | come 1920×1080 | — |

Fattori di C3-L invariati a ogni misura. Sonda prima/dopo (`space-probe.mjs`, funzioni pure; [confronto](client-c4/c4-11/fase-b/sonda/confronto.json), nessuna violazione delle regole 17 e 18): 1366×768 identico; 844×390 fattori e misure identici, carta del round in FFA 36 → 60 px (54 con due oggetti per posto), duello 40 invariato; 750×292 `layoutProblems` uguali a `BASE_750` (duello 6/5, FFA 11/14 con 1/3 oggetti); frecce che attraversano 0 a ogni misura.

### Ombra delle carte

Un solo punto: `CARD_SHADOW` e `cardShadow` in `src/frames.ts`. Prima: un rettangolo spostato di 4×6 px, opacità 60%, bordo netto. Ora: stessa direzione, spostamento **5×7,5 px**, **quattro** rettangoli arrotondati nello stesso `Graphics`, da 1,5 px più grande a 1,5 px più piccolo, ciascuno al 23,6% (1 − 0,34^¼), insieme **66%** al centro, bordo sfumato di **3 px**; nulla sporge verso l'alto o a sinistra. Nessun `BlurFilter` né texture: **0 byte di texture in più** (27 729 048 B, 82,6% del tetto di 32 MiB); il costo per carta sono quattro riempimenti invece di uno.

### Attesi cambiati con la decisione del 10 novembre 2026

- `own-items.test.ts` (fotografia della geometria O27): a 1920 il confronto diventa «nessuna misura più piccola» (b1); sul compatto vale lo stesso per la pila (a2); a 750 cade un «no round cards» quando la pila trova posto. A 1920 in duello la fila degli oggetti propri passa da «accanto al personaggio» a «sopra», l'ultima scelta prevista da O27, perché anche la mano cresce: **da giudicare dal vivo**.
- `readability.test.ts` (C3-L): sul compatto, al posto della «striscia del titolo visibile» della cascata si controlla che ci sia una sola pila.
- Nessun'altra soglia, atteso o `BASE_750` cambiato; nessun atteso delle verifiche Playwright cambiato.

### Test e mutazioni

Client **307** test (289 di C4-10 + 13 in `tests/space.test.ts` per b1, a1, a2, ombra, d e v1, + 5 in `sound.test.ts` per J2). Il test di v1 percorre tutti gli slot con la carta sollevata e a riposo a 1366, 844, 1920 e 750 e fallisce senza v1. [Mutazioni](client-c4/c4-11/fase-b/mutazioni.json): 26, su copie fuori dal repository; base 94/94, ogni mutazione 1–4 test falliti (b1 spento, non attenuato, solo altezza; a1 ciascuna delle tre parti; a2 spenta, senza strisce, senza segno, conteggio sbagliato; ombra di oggi, alone c1, ombra non usata; d senza spostamento, senza `viewport-fit`, suggerimento fuori, testo della mossa; v1 spento o con l'ordine invertito; J2 spento nella scena o nel suono, colpi non consumati, fine interrotta che ferma tutto). Il collegamento nella scena Pixi è coperto dai test sul sorgente e dalle verifiche qui sotto.

### Verifiche, una alla volta

Prima di ogni giro porte 8080 e 4320 libere; mai due verifiche insieme; fermati solo processi miei (le anteprime sulla 4320 avviate per la base e per le catture). Jar ricostruito all'inizio di B2 con `./scripts/build.ps1 -Task Server -Offline` (BUILD SUCCESS, **`d28ccf21415efc7e`**), poi riusato dichiaratamente; `dist` verificato `9aec2510555a2827` (28 file) in entrambi i giri. Secondo D16 eseguiti solo i giri legati a ciò che C4-11 tocca.

| Giro | Esito |
|---|---|
| `VerifyAll -Only test,build,size,verify,aim,layout`, 1366×768 e 844×390 ([evidenze](client-c4/c4-11/fase-b/giro-1/)) | **7/9**. Client **307/307**, `Build` verde, `Size` verde; `Verify` 1366 (1 min 27 s) e 844 (1 min 31 s) **verdi**; `VerifyAim` 844 **verde** (il rosso preesistente di C4-10 è chiuso da v1); `VerifyLayout` 844 **verde**; `VerifyAim` 1366 e `VerifyLayout` 1366 **rossi solo per la cadenza dei frame** (sotto) |
| `VerifyAll -Only verify,layout`, 1920×1080 e 750×292, **misure non standard dichiarate** ([evidenze](client-c4/c4-11/fase-b/giro-2/)) | `Verify` 1920 (4 min 13 s) e 750 (2 min 47 s) **verdi**; `VerifyLayout` 1920 **rosso solo per la cadenza** (nessun problema di geometria, sovrapposizione, striscia, primo piano o volto); `VerifyLayout` 750 **rosso preesistente** (regola 18, sotto) |
| Base `066aa07` (build in una copia fuori dal repository, stesso jar e stessi strumenti): `VerifyAim` e `VerifyLayout` 1366, `VerifyLayout` 1920 ([1366](client-c4/c4-11/fase-b/base-1366/), [1920](client-c4/c4-11/fase-b/base-1920/)) | **rossi per la stessa cadenza**, con valori uguali o peggiori |
| `VerifyOutcomeAudio` 1366×768, senza e con la sonda audio ([evidenze](client-c4/c4-11/fase-b/esito-audio/)) | **verde** entrambe le volte (quattro partite: attesa, tocchi, ✓, salto, ridimensionamento, uscita, movimento ridotto); `check-audio-probe.mjs --require=win,loss` **verde**: 4 vittorie e 4 sconfitte suonate, 60 eventi, al più 2 colpi per round, una sola sorgente fermata (il jingle di chi esce dal tavolo, come previsto) |
| `./scripts/build.ps1 -Task Test -Offline` | **647 server, 0 fallimenti/errori, 7 saltati; client-debug 37/37**, BUILD SUCCESS |
| `python scripts/check-rules.py` | **PASS** |
| `git diff --check` | pulito |
| Catture prima e dopo, normali e con movimento ridotto ([cartella](client-c4/c4-11/fase-b/catture/)) | 4 giri di `guide-captures.mjs` (base e codice, normale e `BM_REDUCED=1`), **0 errori di pagina** |

**Non eseguiti, rimandati alla [matrice completa di fine C4](../client-c4-plan.md#matrice-completa-di-fine-c4) (D16):** `VerifyFfa`, `VerifyResolution`, `VerifyLifecycle`, `VerifyDecks`, `VerifyPublic`, `VerifyProfile`, `VerifyModes`; `VerifyAim` a 750×292 e 1920×1080; contesto Spring. La riga del blocco nella matrice ne prevedeva una parte (`VerifyFfa` 750, `VerifyResolution` ridotta, `VerifyAim` 750).

**La cadenza dei frame (rosso già presente, non portato da C4-11).** Su desktop le verifiche chiedono almeno il 95% degli intervalli fra frame entro 20 ms. Oggi su questa macchina (alimentata, carico alto durante le verifiche, altri processi non miei in esecuzione) non ci arriva nemmeno la base:

| | Codice C4-11 | Base `066aa07` |
|---|---|---|
| `VerifyAim` 1366 duello / FFA, intervalli entro 20 ms | 93,1% / 95,7% | 93,7% / 94,8% |
| `VerifyLayout` 1366 duello T0/T1 | 0,944 / 0,920 | 0,941 / 0,920 |
| `VerifyLayout` 1366 FFA T0/T1 | 0,954 / 0,939 | 0,734 / 0,799 (input 137,7 e 104,9 ms) |
| `VerifyLayout` 1920 duello T0/T1 | 0,860 / 0,871 | 0,873 / 0,838 |
| `VerifyLayout` 1920 FFA T0/T1 | 0,822 / 0,792 (input 86,2 e 105,9 ms) | 0,747 / 0,783 (input 111,3 e 110,0 ms) |

A 844×390 e 750×292 (limite 33 ms) tutto entro: 0,958–0,994. Costo del ridisegno delle frecce p95 0,5–0,8 ms. In C4-10 gli stessi controlli a 1366 erano verdi in un'altra giornata: è lo stato della macchina, non il codice. Una misura su PC però non basta a dimostrarlo del tutto: il giudizio sulla fluidità resta dal vivo (C4-8b) e nella matrice di fine C4. A 1920×1080 le soglie desktop non erano mai state misurate: questi giri sono la base della regola 17 per quella misura, **rossi per cadenza anche sulla base**. I due cambi che potrebbero pesare sono l'ombra (quattro riempimenti per carta) e b1 (carte più grandi a 1920); i numeri non mostrano un peggioramento rispetto alla base. Nessuna soglia cambiata.

**750×292 (regola 18).** `Verify` verde. `VerifyLayout` rosso come alla base: `layoutProblems` per turno duello **6/6/6**, FFA **11/11/11**, stessi tipi di C4-10 («no round cards», posti sopra la mano, frecce, primi piani). Problemi totali 48 → 47: spariscono le sovrapposizioni col titolo (a1 lo nasconde) e l'ispezione variabile del gettone; nessun tipo nuovo. Nelle partite misurate a 750×292 la pila non trova posto (resta «no round cards», come prima). `BASE_750` invariato e verde nei test.

**1920×1080 (regola 17, base).** `Verify` verde; `VerifyLayout` senza problemi di geometria in duello e FFA, con le misure di b1; la fila degli oggetti propri del duello sta sopra il personaggio (ultima scelta di O27). Fattori di C3-L invariati.

**J2 nella partita vera.** Nella partita «resize» il jingle di vittoria parte col pannello a 467,2 s e il ridimensionamento chiude la sequenza a 468,0 s. Sulla pagina nessuna sorgente viene fermata fino all'uscita dal tavolo (471,6 s). Ma il jingle di vittoria dura 0,64 s: era già finito. **Questo giro da solo non prova J2**; lo provano i test unitari (falliscono senza J2, come mostrano le mutazioni). Il caso che J2 cambia davvero va sentito dal vivo: la sconfitta (1,74 s) troncata da un ridimensionamento o dalla barra di Safari.

**Size:** JS gzip **348 034** B (C4-10: 346 449; +1 585), totale **1 758 107 / 4 194 304**, texture **27 729 048** invariate (82,6% del tetto di 32 MiB). Nessuna immagine nuova.

**Input** (`VerifyLayout`, massimo per turno, duello / FFA): 1366×768 37,3 e 33,3 / 42,4 e 70,6 ms; 844×390 38,1 e 36,4 / 50,8 e 52,5 ms; 750×292 28,9 e 30,8 / 39,6 e 48,8 ms; 1920×1080 38,6 e 65,6 / 86,2 e **105,9** ms (base 111,3 e 110,0). C4-10: 1366 16,6/16,0/18,4/33,9, 844 14,5/15,7/24,3/24,0. Oggi la macchina è più lenta anche sulla base.

**Rossi.** Già presenti e provati sulla base: cadenza dei frame a 1366×768 (`VerifyAim`, `VerifyLayout`) e a 1920×1080 (`VerifyLayout`), con un input FFA a 1920 sopra 100 ms anche sulla base; `VerifyLayout` 750×292 (stessi conteggi). Chiuso: `VerifyAim` 844×390. Nessun rosso nuovo, quindi nessuna correzione necessaria.

### Catture prima e dopo

[Cartella](client-c4/c4-11/fase-b/catture/): per ogni misura ufficiale (1366×768, 844×390, 1920×1080), duello e FFA, prima e dopo, normali e con movimento ridotto. Primo piano dell'ombra: [personaggio avversario](client-c4/c4-11/fase-b/catture/ombra-primo-piano-1366.jpg), [personaggio proprio](client-c4/c4-11/fase-b/catture/ombra-primo-piano-1366-tuo.jpg), [carte della mano](client-c4/c4-11/fase-b/catture/ombra-primo-piano-1366-mano.jpg). Evidenze di B2 in git circa **10,5 MB** (60 catture ricompresse e tre primi piani 8,9 MB, JSON minificati; D13, un'indicazione e non una soglia); catture intere (circa 41 MB) e log fuori da git. Sul legno scuro la differenza è lieve, come chiesto; si vede meglio dove una carta proietta l'ombra su un'altra. C4-11 non aggiunge animazioni; le catture con movimento ridotto sono senza errori di pagina, ma non le ho confrontate in modo automatico con quelle normali.

### Non verificato

- iPhone e Safari: O28 su un dispositivo vero (`env(safe-area-inset-*)`, `viewport-fit=cover`, rotazione, barra di Safari), il jingle di sconfitta con la barra di Safari (J2), il costo per frame dell'ombra.
- Fluidità percepita, su PC e iPhone (la cadenza misurata oggi è rossa anche sulla base).
- Lettore di schermo.
- Aree sicure provate solo dai test unitari con il gancio di test; nessuna cattura con aree simulate in questa fase.
- Partite fra due umani, i giri rimandati sopra, il contesto Spring.

### Al proprietario, dal vivo

- **PC (1920×1080 o più):** quanto crescono mano, personaggi e carte del round; la fila degli oggetti propri del duello sopra il personaggio; se l'ombra si nota abbastanza (i valori sono in un punto solo, `CARD_SHADOW`).
- **PC con la finestra bassa, o 844×390:** la pila delle carte del round (autore in cima, conteggio, segno vinaccia se c'è un'annullata sotto), il titolo nascosto, gli oggetti di scena attenuati.
- **iPhone in orizzontale:** O28 (tavolo nella larghezza sicura, menu e orologio fuori dall'isola delle fotocamere), la fluidità, e il jingle di sconfitta quando la barra di Safari compare o sparisce.

## C4-1c — Fase A

10 novembre 2026. **Fase A pronta, in attesa della scelta del proprietario** ([proposta](../design/client-c4/verifiche/proposta.md), evidenze in
[client-c4/c4-1c](client-c4/c4-1c/), circa 4,7 MB). Solo strumenti; nessuna soglia, nessun atteso, nessuno scenario, `BASE_750` invariato.

**Misura.** Giro di base in serie su una copia esportata di HEAD `ed909f3` con gli strumenti di oggi, jar `dbfc5ded848bcfb2`, `dist`
`aa25c0d2c45904da`: **101 min 59 s**, 21/23 verdi. `VerifyAim` 844×390 è il rosso noto di C4-11; `VerifyProfile` 1366×768 è rosso per la
copia esportata (mancava `jar.exe` in `.tools`), verde al rilancio (55 s). `VerifyResolution` è il 66% del giro (67 min alle due misure),
`VerifyFfa` il 13%; dentro `VerifyResolution` lo scenario più lungo dura circa 6 min; 11–14 min per misura sono animazioni reali misurate.

**Prototipo** (dietro opzioni): `BM_SERVER_PORT` anche in Lifecycle, Ffa, Decks, Public e Profile; `-Parallel N`, `-Split`, `-Solo` in
`VerifyAll` (`verify-all-parallel.mjs`); `compare-runs.mjs`. Senza `-Parallel` nulla cambia: con il comando di oggi sulle cinque verifiche
toccate, alle due misure, **13/13 verdi** in 24 min 01 s su 8080 e 4320.

| Giro | Durata | Esiti |
|---|---:|---|
| Serie | 101 min 59 s | 21/23 (rossi sopra) |
| N=4, split resolution e ffa, aim e layout da sole | **38 min 03 s** | 20/23: aim 844 noto; aim 1366 sui frame subito dopo il pool (verde da sola, verde in N=8 con 15 s di quiete); ffa 844 `two`, 30 s scaduti nella ricerca della carta (verde da sola) |
| N=8, idem | 42 min 00 s | 20/23: aim 844 noto; ffa alle due misure (tre rossi come sopra, due parti appese e fermate a mano, circa 15 min persi) |

**Equivalenza.** Stessi controlli e scene in tutte le verifiche; `VerifyResolution` 21 controlli e 11 scene in tutti i giri, casi richiesti
tutti visti in parallelo; i casi opportunistici cambiano come fra i giri in serie storici. Tempi misurati: scarto delle sequenze dal piano
p95 8 ms in serie, 14–18 ms con N=4, 24–30 ms con N=8, massimo 68 ms contro 250 di tolleranza; etichette 1200 ms e clock minimo 11 s identici;
`VerifyLayout` frame entro il limite al 100% in tutti i giri, p95 massimo 11,8 → 14 ms, input massimo 31,7 ms.

**Non provato:** N=2 e N=3 (prova accorciata dal proprietario), la variabilità fra due giri completi in serie (presa dai run-summary di
C4-1b e C4-10: `VerifyResolution` 30–35 min per misura, `VerifyFfa` 6–9 min), l'altra macchina, il giro a 750×292, un giro parallelo
tutto verde (i rossi di `VerifyFfa` restano il punto aperto della Fase B). Il metodo e CONTRIBUTING.md non sono cambiati: il testo
proposto è nella proposta.

**Domande al proprietario:** nella [proposta](../design/client-c4/verifiche/proposta.md#5-domande-al-proprietario): N (raccomandato 4),
verifiche da sole (aim e layout), correzione di `VerifyFfa` in Fase B (sì), leva e) (no per ora), parallelo come consolidamento (dopo la
Fase B), altra macchina (stesse opzioni, nessun obbligo).

## C4-1c — Fase B

10 novembre 2026. **Fatto, in attesa del giudizio del proprietario.** Scelta del proprietario: «Sì, tutte», registrata nel commit separato `e96d166`
([proposta](../design/client-c4/verifiche/proposta.md#scelta-del-proprietario)). Solo strumenti e documenti: nessun codice di
prodotto, soglia, atteso, scenario, `BASE_750`, durata di sequenza, clock o limite di Size cambiato. D16 resta in vigore.
Evidenze nella [cartella della Fase B](client-c4/c4-1c/fase-b/README.md).

### Cosa cambia

- Il percorso ufficiale è `VerifyAll -Parallel 4 -Split 'resolution,ffa'`: posti isolati, coda dal più lungo al più breve;
  Aim e Layout da sole alla fine, dopo chiusura delle altre anteprime e 15 s di quiete. N>4 è dichiarato non equivalente e non
  pubblicabile. Senza `-Parallel` resta la serie su 8080/4320.
- Il blocco macchina in TEMP acquisisce lettura e scrittura del PID sotto accesso esclusivo al file, anche se il PID precedente
  è scaduto; due avvii simultanei non possono prendere entrambi il blocco. Porte occupate rifiutate, nessun processo altrui fermato.
- Ffa: nella sola ricerca della carta i 60 ms fissi sono sostituiti dall'attesa dell'input elaborato e dello stato della scena al
  frame successivo (anche un bersaglio rifiutato può lasciare lo stato invariato), massimo **2 s per input**; chiusura del dialogo
  su condizione. Ricerca, controlli, scenari e clock reali da 30 s invariati; K7 non toccato. Nessun altro verificatore con la
  stessa ricerca modificato.
- Ogni parte divisa ha **15 min** (il limite delle esecuzioni non divise resta 120 min). Scaduto il termine: rosso, log,
  chiusura dei processi discendenti; server identificato per PID, ascendenza, creazione e comando, identità ricontrollata prima
  dell'arresto. Poi verifica che i processi registrati siano spariti e la porta sia libera. Nessun rilancio automatico.
- Scenari letti dallo script, inclusi nomi nuovi; chiamate non interpretabili rifiutate. Parti riunite nello stesso JSON,
  originali in `evidence/parts`; parte mancante o uscita non zero non può diventare verde, nemmeno con un JSON `ok:true`.
- Il predefinito contiene **25 esiti**: tutte le verifiche a 1366×768 e 844×390, Verify e Layout anche a 1920×1080, più Test,
  Build e Size. `complete` controlla questa matrice; per il parallelo richiede N≤4 e Aim/Layout da sole con almeno 15 s di quiete.
  `-Measures` resta un giro dichiarato, non completo/non pubblicabile. Nessun controllo spostato a una sola misura (leva e esclusa).

### Build e preliminare

Albero pulito; `git fetch`: main e origin/main su `ac1e885`; nessun Java/Maven/Vite del repository attivo; libere 8080, 4320,
18080–18087 e 14320–14327. Jar rifatto con `./scripts/build.ps1 -Task Server -Offline`, poi conservato identico.
Al fetch finale è arrivato `6482e27` (C4-8a Fase A, solo documenti ed evidenze): rebase eseguito senza conflitti, conservando entrambe le consegne; nessun prodotto cambiato dal commit esportato.
Tutti i giri reali della Fase B usano il prodotto esportato con `git archive` di **`ac1e88554086c2385468ed7b583faec33ff6b260`**,
JDK e dipendenze propri, senza collegamenti. Jar **`2a689da0b1e783b4`**, dist **`9aec2510555a2827`**, 28 file
([provenienza e hash completi](client-c4/c4-1c/fase-b/build.json)). L'archivio non ha HEAD Git: la provenienza è dichiarata qui,
non dedotta dal campo vuoto del riepilogo. Gli strumenti sono quelli di questo blocco; quelli prima della correzione Ffa sono
quelli del commit esportato. Il rafforzamento finale del blocco macchina è successivo all'avvio della serie dopo; gli hash
separati sono nel manifest, il blocco finale è provato dai guasti e dai due giri N=4.

`-ReuseJar` è intenzionale per mantenere identici i byte: come prima, il riepilogo lascia `equivalentToConsolidation=false`
per il riuso dichiarato. `complete` e la pubblicazione dopo un giro completo verde restano distinti dal riuso; il comando di
consolidamento senza riusi ricostruisce il jar. Le prove sintetiche di pubblicazione sono etichettate come tali, senza confonderle
con build o controlli di prodotto.

### Giri e durate

<!-- C4-1c-B-runs -->
| Giro | Durata | Esito |
|---|---:|---|
| Serie completa Fase A, prodotto `ed909f3` | 101 min 59 s | 21/23: Aim 844 noto prima di C4-11, Profile 1366 per JDK incompleto nella copia (verde al rilancio) |
| Ffa prima, serie, due misure | Ffa 14 min 25 s; con Test/Build/Size 14 min 41 s | 5/5 |
| Serie dopo, Test/Build/Size + Verify/Ffa/Layout, misure ufficiali | 24 min 52 s (somma verifiche) | 11/11 |
| Primo completo N=4, matrice attuale | **41 min 43 s** (pool 28:04, fase da sole 13:16) | **25/25 verdi**, nessun rilancio, nessun timeout |
| Secondo completo N=4 | non eseguito | saltato per scelta del proprietario (sotto) |
<!-- /C4-1c-B-runs -->

**Riduzione del perimetro, 10 novembre 2026.** Per accorciare l’ETA il proprietario ha scelto «Sì, salta il secondo giro». Il secondo N=4 non viene eseguito: **variabilità fra due giri completi non verificata**. Restano il primo giro completo, le prove di guasto, i confronti e i controlli finali.

Ffa prima/dopo: **512/431 s** a 1366 e **353/357 s** a 844; totale **865/788 s**. Un campione per configurazione, partite
variabili: non è una stima statistica del guadagno. [Confronto con compare-runs.mjs](client-c4/c4-1c/fase-b/confronto-ffa.json):
stessi 11 controlli comuni; solo `k7Mouse` e `k7Touch` variano (prima a 844, dopo a 1366), perché servono un oggetto coperto e
una carta adatta incontrati nella partita. K7 e i suoi attesi non sono cambiati. I controlli dei timeout registrano ancora 30 s reali.

### Prove di guasto

Comando ripetibile: da client-web, Node 24 `tools/verify-all-faults.mjs`, a verifiche reali ferme. Copia gli strumenti in TEMP,
crea script e anteprime sintetici; il caso appeso avvia un **server Java reale** sul jar dichiarato. Nessuna opzione di guasto
resta attiva nei giri reali. [Risultati](client-c4/c4-1c/fase-b/guasti.json), tutti passati:

| Prova | Come | Risultato atteso e osservato |
|---|---|---|
| Parte esce con 1 | Scrive perfino `ok:true`, poi esce con 1 | giro rosso, parte e JSON riunito rossi |
| Parte appesa | Server reale e ciclo senza fine; solo nella copia `BM_PART_TIMEOUT_MIN=0.5` | timeout a 30 s, uscita parte 124, giro rosso; PID/comando del server nel [log](client-c4/c4-1c/fase-b/guasto-hang-processi.txt), tutti i processi registrati chiusi, porta libera |
| Scenario aggiunto | Aggiunge `run('added_2')` allo script nella copia; la nuova parte fallisce | scoperto e lanciato, giro rosso |
| Porta occupata | Listener esterno sulla 18080 | giro rifiutato/rosso, listener ancora vivo |
| Matrice sintetica predefinita | Tutti gli script scrivono esiti sintetici | 25 righe; 1920 solo Verify e Layout |
| Pubblicazione N=4 / N=6 | Matrice sintetica, ricostruzione simulata dichiarata | N=4 completo/equivalente e pubblicato solo in TEMP; N=6 non completo/non equivalente e niente pubblicazione |
| Due avvii simultanei | Due copie del lancio contro il blocco macchina reale | uno esce 0, l'altro 2 per il blocco, prima di usare porte |

La prima prova positiva del pool ha trovato un errore del nuovo controllo di pulizia: Get-NetTCPConnection restituisce errore
anche quando non trova listener. Ora si accetta **solo** quel preciso errore come porta libera; gli altri restano rossi. Le prove
sono state ripetute sullo strumento corretto. Anche un secondo lancio durante la serie reale è stato rifiutato.

### Confronto completo e fluidità C4-11

[Confronto completo con compare-runs.mjs](client-c4/c4-1c/fase-b/confronto-completo.json), [riepilogo N=4](client-c4/c4-1c/fase-b/parallelo-4/run-summary.json).
La serie completa di Fase A aveva **23 esiti** sul client prima di C4-11; il giro attuale ne ha **25**, aggiungendo Verify e
Layout a 1920. 101:59 contro 41:43 è il confronto misurato disponibile, **non** una prova con matrice e prodotto identici.
Il prototipo N=4 di Fase A durava 38:03: ora +3:40, con la misura 1920 aggiunta, codice C4-11 e partite diverse. Il pool passa
da 27:57 a 28:04 (+7 s); la fase da sole da 9:58 a 13:16, includendo Layout 1920 (2:39). Secondo giro non eseguito per scelta sopra.
Le somme delle durate dei job divisi (124:54 complessivi) **non** sono il tempo di parete 41:43.

- Verify, Modes, Lifecycle, Decks, Public, Profile: stessi nomi di controlli e scene sulle misure comuni. Profile verde anche a
  1366: nella copia è presente il JDK completo, compreso jar.exe; nessuna correzione a Profile.
- Aim: stessi **6 controlli e 5 scene**, 216 carte controllate per misura nei riepiloghi confrontati; frecce variabili con le mani.
  Aim 844 passa dal rosso geometrico noto della Fase A al verde: è v1 di C4-11, non una correzione a questo strumento.
- Layout: stesse **5 voci di scena**, nessun problema di geometria; 1920 è aggiunta, assente dalla serie di Fase A.
- Resolution: **21 controlli e 11 scene** alle due misure, nessun caso perso rispetto alla serie di Fase A. A 844 compare anche
  lethalEndOfTurn, che nella serie mancava. Tutti i 16 casi elencati dal verificatore sono visti. `turnsSeen` 63/83 → **79/75**;
  contatori positivi, nessun controllo eliminato o limitato a una misura.
- Ffa: il nucleo dei controlli coincide; K7 è opportunistico e il suo codice non cambia. Rispetto alla serie completa di Fase A,
  N=4 aggiunge k7Mouse/k7RaiseOnly/k7Touch a 1366 e non incontra k7RaiseOnly a 844. Rispetto alla serie dopo, N=4 ha gli stessi
  nomi a 1366 e manca solo k7RaiseOnly a 844. Non è uno scenario saltato: tutte le **7 parti per misura** sono verdi e riunite.
  Il report espone queste differenze invece di chiamarle copertura identica dei casi opportunistici.

**Tempi misurati dentro Resolution** (1366 / 844; nessuna soglia cambiata):

| Dato | Serie Fase A | N=4 attuale |
|---|---|---|
| Sequenze complete | 54 / 74 | 70 / 66 |
| Scarto dal piano p50 | 5 / 3 ms | 4 / 5 ms |
| Scarto p95 | 8 / 8 ms | **13 / 12 ms** |
| Scarto massimo | 12 / 40 ms | **45 / 24 ms** |
| Scarti sopra 250 ms | 0 / 0 | **0 / 0** |
| Leggibilità minima etichette | 1200 / 1200 ms | **1200 / 1200 ms** |
| Clock minimo a fine sequenza | 11 / 11 s | **11 / 10 s** |

Nessuna violazione delle regole registrate. Il clock a 844 ha un secondo in meno rispetto a quel campione della serie,
con sequenze e partite diverse; le soglie restano quelle degli script. Il secondo giro avrebbe misurato la variabilità attuale:
è stato saltato su richiesta del proprietario, quindi non si dichiara misurata.

**Frame e input, fase da sole.** Minimo degli intervalli entro soglia / massimo p95 / input massimo:

| Verifica e misura | Serie Fase A | Serie attuale mirata | N=4 attuale, fase da sole |
|---|---|---|---|
| Aim 1366 | 100% / 8,6 / 16,7 ms | non eseguita | **100% / 10,6 / 21 ms** |
| Aim 844 | 100% / 10,2 / 18 ms (rosso geometrico) | non eseguita | **100% / 8,5 / 14,7 ms**, verde |
| Layout 1366 | 99,7% / 10,6 / 28,9 ms | 99,1% / 11,9 / 31,7 ms | **98,6% / 13,4 / 30,7 ms** |
| Layout 844 | 99,9% / 11,8 / 31,4 ms | 99,9% / 12,1 / 26,2 ms | **100% / 11,9 / 31,1 ms** |
| Layout 1920 | non prevista | 99,4% / 12,2 / 27 ms | **99,9% / 11 / 21,7 ms** |

Tutte verdi sulle soglie immutate (almeno 95% entro 20 ms desktop / 33 ms compatto; input ≤100 ms). I picchi isolati restano
visibili nel confronto JSON: Layout N=4 fino a 146,5 ms a 1366, 102,7 a 844 e 115 a 1920; non sono tolti dai dati.

**Confronto con il segnale C4-11 dell'altra macchina.** Nel suo [rapporto](#c4-11--fase-b) erano rossi Aim 1366
(93,1%/95,7% duello/FFA; base 066aa07 93,7%/94,8%), Layout 1366 (minimo 92,0%; base 73,4%) e Layout 1920
(minimo 79,2%, input 105,9 ms; base 74,7%, input 111,3 ms). Qui il codice corrente è verde nei valori sopra.
Poiché **non è emerso un rosso di cadenza**, il rilancio condizionale corrente/066aa07 su questa macchina non è stato necessario
né eseguito; il confronto sulla base citato è quello già misurato sull'altra macchina, non una nuova misura qui. Nessuna
correzione al prodotto, nessuna conclusione sulla fluidità fisica di iPhone/Safari.

**Rossi e attribuzione.** Nessun rosso nel giro attuale, quindi nessun rilancio di attribuzione. Quelli della Fase A restano
attribuiti come allora: Aim 844 alla geometria precedente a v1 di C4-11; Profile 1366 al JDK incompleto della copia. Le differenze
K7 sono casi opportunistici non incontrati e sono esposte sopra; non sono esiti rossi nascosti.

**Pubblicazione.** Il controllo di ammissibilità di -Publish è passato nella prova sintetica N=4 (N=6 rifiutato). Sugli esiti
reali completi e verdi è stata provata anche la funzione di copia e compressione con l'opzione esistente BM_PUBLISH_SELFTEST,
solo nel processo di prova: **16 di 422 catture, circa 2 MB**, JSON finali conservati ([log](client-c4/c4-1c/fase-b/pubblicazione.txt)).
Questo evita di rilanciare il giro dopo il taglio del secondo N=4; non viene descritto come una nuova esecuzione delle verifiche.


### Controlli finali e limiti

[Esiti finali separati](client-c4/c4-1c/fase-b/controlli.json):

| Controllo | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` | **307/307**, 0 fallimenti |
| `./scripts/build.ps1 -Task Test -Offline` | **655 server**, 0 fallimenti/errori, 7 saltati; client-debug **37/37**, BUILD SUCCESS |
| `python scripts/check-rules.py` | **PASS** |
| `./scripts/build.ps1 -Task TestServerContext -Offline` (separato) | **765**, 0 fallimenti/errori, 7 saltati, BUILD SUCCESS; 7 min 51 s, avvio e scenari applicativi verificati |
| `python scripts/verify-match-manifests.py` | **allChecks PASS** |
| `git diff --check` e controllo dei percorsi | puliti; nessun file di prodotto, test atteso, soglia o Size modificato |
| Pulizia finale | porte 8080, 4320, 18080–18087 e 14320–14327 libere, nessun Java rimasto attivo |

Evidenze circa **4,5 MiB**, di cui circa 2 MB di catture finali ricompresse; parti originali, altre catture e log integrali in TEMP.
Il rebase sul commit di soli documenti `6482e27` non cambia il prodotto verificato; tenute entrambe le consegne.

**Non verificato:** secondo N=4 e variabilità fra due giri (taglio esplicito del proprietario); altra macchina e prova preliminare
N=2; N=6 reale (facoltativo, provato solo il rifiuto di pubblicazione sintetico); nuovo confronto 066aa07 su questa macchina
(condizione di rosso per cadenza non verificatasi); iPhone/Safari. Il giro a 750×292 non è stato rilanciato in questo blocco:
BASE_750 e i suoi attesi sono invariati e verdi nei test. Non è un consolidamento fisico su telefono.

**Comando da usare d'ora in poi**, per il giro completo e la matrice di fine C4 (D16), senza riusi:

```powershell
./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa'
```

Aggiungere `-Publish <cartella>` per copiare le evidenze dopo un giro completo verde. Sull'altra macchina le opzioni restano
facoltative: prima del parallelo un giro di prova a N=2. Per blocco restano le verifiche mirate D16.

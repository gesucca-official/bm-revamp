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

Il tetto di D9 non è applicato da `size.mjs`, che controlla solo i limiti rigidi: non l'ho cambiato qui; resta da decidere dove codificarlo (C4-3 estende comunque `size.mjs`).
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

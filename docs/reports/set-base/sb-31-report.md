# SB-31 — Rapporto dell'esecutore (F1 e F2)

Esecutore: Claude (Sonnet 5.5). Base: `d92f74e` (D196). Un commit per fase, nessun push.

**Esito.** F1 consegnata (commit «SB-31: F1 …»): R9 e R10 chiusi, controllo di D183 (4) aggiunto e verde, contatore di Rincara
verificato nel gioco vivo. Un rosso nuovo, **R11** (controllo dello scarto di `VerifyLayout`, O26), attribuito allo strumento e
registrato, non corretto. F2: vedi la sezione omonima in fondo (aggiunta nel suo commit).

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

1. R11 (`discard-checks.mjs`): lo corregge la regia o lo apro in un blocco con perimetro?
2. 750×292, FFA: i «close-up» in più della corsa nuova (vedi sopra) si accettano come casuali o si ripete la corsa di base e nuova più volte per provarlo?
3. `VerifyAim` 750×292 con tastiera: si indaga lo schema R8 in `verify-aim.mjs` (sarebbe R12)?
4. Gli altri commenti «solo playground» (ricerca, `ahead`, `voidReason`, `plays` nelle mosse) vanno verificati?

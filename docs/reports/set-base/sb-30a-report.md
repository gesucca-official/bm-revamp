# SB-30a — Livelli del computer nella partita viva: rapporto

## B1 — Regole

**Esito: consegnata il 26 novembre 2026.** Regolamento **2.2** e Set Base **1.0.2** definiscono i livelli del computer e lo stile di
ogni personaggio ([D203](../../set-base-decisioni.md#decisioni-del-proprietario),
[proposta](../../design/set-base/sb-30a-proposta.md)). **Il gioco non cambia:** il comportamento è di B2. Un rosso nel contesto
completo, trattato come noto (voce R3 del [registro](../rossi-noti.md), sotto).

Base all'inizio: `5432fd6`. Durante il blocco altre sessioni hanno committato carriere e SB-32 (solo documenti e immagini di
anteprima), fino a `785fd40`; i loro file non sono stati toccati.

### Che cosa è cambiato

- **Regolamento 2.2** (`docs/game-rules.md` e copia del client di debug): R01, R03, R08 e voce di revisione. Rispetto alla bozza
  della proposta, per D203: i livelli sono nominati in R01; lo stile del Normale è quello della scheda del personaggio; Facile se
  l'avvio non indica il livello vale per quick e open contro computer; un avvio con un altro livello si rifiuta.
- **Set Base 1.0.2:** `botStyle` nei cinque personaggi con starter di `bozza.json` (Spazienzio e Piera aggressivo, Mara prudente,
  Celestina e Beppe risorse; Sergio e Duccio senza). Il generatore scrive «Stile del computer: …» sotto il testo completo della
  scheda, rifiuta un valore fuori vocabolario e richiede lo stile a tutti e soli i personaggi con uno starter. Revisione 1.0.2; la
  1.0.1 passa a «Richiedeva il regolamento 2.1».
- **Rigenerati** col generatore: documento del set e copia, `sets/base.json`, allegato (cambia solo la versione), manifest;
  `cards.sqlite` e mazzi di prova invariati.
- **Caricatore** (`sim/Draft.java`): `botStyle` accettato e **non letto**. È l'unico file Java di produzione toccato.
- **Controllo** (`scripts/check-rules.py`, strumento condiviso): la riga dello stile non fa parte del testo completo; il controllo
  la verifica contro il file del set e confronta il resto come prima. In `prova-errori.py` un caso nuovo.
- `docs/formato-file-set.md`: descritto `botStyle` (non era nell'elenco del prompt).
- **Stampa** (`tools/print-cards/bozza.py`): il piè è composto da `footer_stamp`, senza «BOZZA · »; la fascia «BOZZA PROVVISORIA»
  resta. Test nuovo con le dodici cifre più larghe e il numero di carta più lungo, per bozza e stampa viva.
- **PDF vivi** rigenerati (Set Base 1.0.2, regolamento 2.2, impronta `8e4c6d065541`). I `bozza-*` non tracciati sono invariati.
- `docs/README.md`, `docs/setup.md`: righe di versione. [Registro dei rossi](../rossi-noti.md): R18 aperto
  (`controlla-nomi.py`), R19 e R20 chiusi (stampa).

### Risposte del proprietario (26 novembre 2026)

Ricevute nei prompt di ripresa; non trascritte nel registro delle decisioni (resta alla regia).

1. Piè della bozza: togliere il prefisso «BOZZA · », con una prova sull'impronta più larga; la stampa viva non cambia.
2. PDF vivi: rigenerarli e passare `verify.py`, senza toccare i `output/pdf/bozza-*` non tracciati.
3. `docs/README.md` e `docs/setup.md`: solo le righe di versione.
4. Prima di Maven e delle corse d'identità controllare che non giri altro; registrare il rosso di `controlla-nomi.py` e chiudere i
   due della stampa.
5. `Bozza16Test`: aggiungere `botStyle` ai campi descrittivi che il test toglie dal confronto.
6. La segnalazione di `git diff --check` sul PDF delle carte è accettata come rumore del formato; `.gitattributes` non si tocca.

### Attesi cambiati (tutti deliberati, D203)

| File | Prima → dopo | Perché |
|---|---|---|
| `MatchArchiveTest.java` | 2.1 → 2.2, 1.0.1 → 1.0.2 | l'archivio registra le versioni vigenti |
| `scripts/cli-match-export-test.cjs` | 2.1 → 2.2, 1.0.1 → 1.0.2 | idem |
| `scripts/cli-open-complete-test.cjs`, `cli-quick-complete-test.cjs` | 1.0.1 → 1.0.2 | idem |
| `tools/print-cards/test_generator.py` | 2.0 → 2.2, «Set Base 1.0» → «1.0.2» | la stampa legge le versioni dai documenti; erano indietro da SB-29, rossi già sulla base |
| `Bozza16Test.java` (`withoutSb24`) | toglie dai personaggi anche `botStyle` | campo descrittivo come `name`, `flavour` e `rarity`; risorse, oggetti, immunità e basic si confrontano come prima |

### Verifiche

| Verifica | Esito |
|---|---|
| `check-rules.py` | verde: regolamento 2.2 e Set Base 1.0.2 |
| `set_catalog.py --vivo --check` | 7 file identici |
| `prova-errori.py` | 6/6, compreso il caso nuovo |
| Mutazioni della logica nuova | 5/5 rilevate: stile sconosciuto; starter senza stile; stile senza starter; riga tolta dalla scheda; prefisso rimesso nel piè |
| `controlla-numeri.py`, `controlla-testi.py` | uscita 0, uscite identiche a prima |
| `controlla-nomi.py` | rosso noto R18, uscita identica prima e dopo |
| `test_generator.py` (stampa) | 14/14 |
| Stampa viva prima e dopo la modifica del piè, stessi ingressi | i due PDF identici byte per byte |
| `verify.py` sui PDF rigenerati | OK entrambi; 39 e 31 pagine; testo uguale a quello committato salvo versione, regolamento e impronta |
| `build.ps1 -Task Test -Offline` | verde: **1506 test, 0 falliti, 23 saltati**; client di debug 42/42 |
| `build.ps1 -Task TestServerContext -Offline` | **1711 test, 1 fallito (R3)**, 23 saltati |
| `verify-match-manifests.py` | uscita 0, tutti i controlli PASS |
| Client web `Test` | 403/403 |
| `check-links.py` | 22 rotti, quelli noti |
| `git diff --check` | pulito fuori da `output/pdf`; sul PDF delle carte la sola segnalazione accettata |

**Rosso del contesto completo.** `QuickDuelCliTest.aBaseAndAnAdvancedHumanPlayTheirOwnStarters`, «Error: Event timeout»
(`scripts/cli-quick-duel-test.cjs`, attesa di `/update` da entrambi). Nello scenario `categories` i turni 0–3 si risolvono, poi non
parte il turno 4; nel log nessun rifiuto né eccezione; disconnessione dopo 5 secondi. Corrisponde a R3 per verifica, test e firma:
per il contratto è **«noto, voce R3»** e non è stato rilanciato. La causa non è accertata. Il blocco non tocca quello script, il
server non legge `botStyle`, e gli altri test con la CLI nello stesso giro sono verdi. All'inizio del giro ha girato per pochi
secondi, in parallelo, il confronto Python di `check-rules.py`.

**Strumento condiviso.** `check-rules.py` vecchio sull'albero di base: passa; nuovo sulla base: passa, stessa uscita; vecchio
sull'albero nuovo: fallisce con `base.character.Gigi: sheet differs from the full text of the annex`; nuovo sull'albero nuovo: passa.

**Processi.** Prima di Maven e delle corse nessun altro `java` o `mvn`; presenti solo processi `node.exe` residenti di Codex, che
non sono build.

### Identità della partita

Il codice non cambia il gioco; le tre prove lo confermano.

| Prova | Confronto | Esito |
|---|---|---|
| Passo 0 (8.640 partite, bozza storica 1.5), codice di partenza contro nuovo | `deck-observations.json`, `observations.json`, `sb16i-observations.json` | identici byte per byte (`95ec14572734083b`, `0d6b9e4ed6472a0f`, `c43a95008cd0f493`) |
| | `draft.json`, `matrix.json`, `matrix.md` | stesso contenuto, sotto |
| Banco vivo, 480.000 partite, contro il riferimento di SB-28 | JSON e MD interi | identici: `ca131721c9bd6549…`, `16d3bde4c385cc3a…` |
| Giro 20/2 sul file vivo del set (403.200 partite), contro SB-28 | `deck-observations.json`, `in-play.json` | identici (`87aa84d65f8b04ed…`, `44136fa355b3678a…`) |
| | `draft.json` | differisce nei soli cinque `botStyle`: tolti, è identico byte per byte |
| | `matrix.json`, `matrix.md` | differisce la sola impronta della bozza nell'intestazione (`4cee87f1658b725f` → `f4183059d4f739f4`) |

**`draft.json` del passo 0.** L'unica differenza è l'ordine di due chiavi nei parametri di «L'ultimo giro» (`perPlay`,
`perPlaySelf`): scambiandole, il file nuovo ha la stessa impronta di quello di partenza (`e38405a279a26f2b…`). `matrix.json` e
`matrix.md` differiscono solo per quell'impronta. Dal codice, la causa è `sim/BozzeStoriche.java` (test), che aggiunge i parametri
iterando una `Map.of`, il cui ordine può cambiare da una JVM all'altra. Non dipende da B1.

### Non verificato

- Pagine dei PDF **non guardate** (né Poppler né PyMuPDF sulla macchina).
- Nessuna verifica col browser (Playwright): nessun file del client web è cambiato.
- Nessuna partita manuale: la partita viva non applica ancora i livelli.

### Per le altre macchine

- `scripts/check-rules.py` è cambiato: con questi documenti va usata la versione nuova.
- `sets/base.json` e il caricatore sono cambiati: dopo il pull il jar del server va ricostruito.

### Da giudicare

Il testo di R01, R03 e R08 della 2.2 (sotto, R03), la riga dello stile nelle schede e i PDF vivi rigenerati.

### Testo nuovo di R03

> **Il computer (2.2).** Un giocatore del computer sceglie fra le mosse valide per questa regola, con le sole informazioni di un giocatore al suo posto (R08): la propria mano e le carte che restano nel proprio mazzo, non il loro ordine, e il tavolo pubblico. Non vede la mano coperta degli altri, l'ordine di nessun mazzo né le mosse presentate e non ancora risolte. Non riceve carte, risorse o salute in più: il livello cambia solo il modo di scegliere. **Facile** sceglie a caso una carta giocabile, poi a caso un modo valido di giocarla. **Normale** sceglie secondo lo stile del computer scritto nella scheda del suo personaggio (documento del set). Prevedendo il turno in corso con le sole informazioni pubbliche, si para o si cura se un colpo mostrato e pagabile da un avversario lo porterebbe a terra, colpisce se un suo colpo porta sicuramente a terra un avversario, e fra la sconfitta e la patta sceglie la patta. Il livello si fissa all'avvio della partita e non cambia: nella quick contro computer e nell'open, se l'avvio non lo indica vale Facile, e un avvio con un livello diverso da questi due si rifiuta. Il computer sceglie quando la partita controlla se tutte le mosse sono presentate, senza attesa. Se non trovasse mosse valide passerebbe con mossa vuota: con mazzi conformi il caso non si presenta.

### Domande

1. **R3.** Va bene il rosso come noto, senza rilancio? Raccomandato: sì; B2 rieseguirà comunque il contesto completo.
2. **Ordine delle chiavi in `BozzeStoriche`.** Lo correggiamo con una mappa ordinata? Raccomandato: sì, in un blocco che tocca gli
   strumenti di misura; fino ad allora `draft.json` del passo 0 si confronta per contenuto.

## B2 — Server

**Esito: consegnata il 26 novembre 2026.** Il computer della partita viva è un `BotPlayer` a uno dei due livelli di R03 2.2,
Facile (`RandomPolicy`) o Normale (`LethalAwarePolicy(SoughtHitPolicy(<stile della scheda>, ALWAYS))`), scelto con l'header STOMP
`level` in quick e open contro computer; Normale fisso in FFA; Facile se l'header manca
([D203](../../set-base-decisioni.md#decisioni-del-proprietario), [D205](../../set-base-decisioni.md#decisioni-del-proprietario) (3)).
Prova «nessuna informazione nascosta» nuova sul percorso vivo, sempre attiva: 80/80 posizioni. Otto mutazioni rilevate. Tempi
molto sotto i limiti. Tutte le verifiche verdi; nel contesto completo un rosso noto (R3), verde al rilancio da solo.

Base: `2151caf`. Durante il blocco non sono arrivati commit di altri sulla stessa copia.

### Che cosa è cambiato

- **Livello** (`model/game/bot/ComLevel.java`, nuovo): `FACILE`, `NORMALE`, riservati `DIFFICILE` e `MAESTRO`. `parse` dell'header:
  assente o vuoto → Facile; `FACILE` o `NORMALE`, maiuscolo e confronto esatto, come la categoria; ogni altro valore, riservati
  compresi → `UnknownLevelException` («Livello sconosciuto: X (noti: FACILE, NORMALE)»).
- **Fabbrica per giocatore** (`model/game/bot/ComPolicies.java`, nuovo): `policyFor(level, character)` restituisce un'istanza nuova
  per ogni computer; lo stile del Normale viene dal `botStyle` del personaggio nel file vivo del set; un livello riservato si
  rifiuta. Non importa tipi del motore.
- `PlayerFactoryService.craftComPlayer(category, level)` al posto di `craftRandomComPlayer(category)`. La fabbrica viva crea un
  `BotPlayer` con id `ComPlayer_nnnn` (stesso formato di prima, ora dal generatore della fabbrica, quindi ripetibile nei test), col
  generatore del giocatore preso dalla fabbrica e col livello. All'avvio controlla che ogni personaggio con uno starter abbia uno
  stile noto.
- `BotPlayer`: campo `level` (null fuori dalla partita viva) e un costruttore in più; quello di prima resta per playground e
  profilo `bozza`. `level()` non è una proprietà bean, quindi le viste non lo portano.
- **Caricatore** (`sim/Draft.java`, `DraftSource`): `botStyle` ora letto (`characterBotStyle`) e rifiutato se fuori vocabolario
  (aggressivo, prudente, risorse). Il motore non lo legge.
- **Ingressi:** `GameFactoryService.craftQuick1vComGame(player, category, level)` e `craftOpen1vComGame(user, deck, level)`;
  `craftQuickMultiPlayerGame` dà Normale ai computer della FFA. `QuickGameQueuesController` legge l'header `level` dopo la
  categoria e prima di accodare o creare. `OpenGameQueuesController` lo legge prima di tutto; il rifiuto va su
  `/user/queue/game/error` con un gestore dedicato, più specifico di quello del mazzo (che risponde su
  `/user/queue/game/open/1vCom/error` con un testo generico). `ffa/join/com` non legge header di livello.
- **Archivio** (`MatchArchiveService`): `INITIAL.configuration.computers`, una voce `{playerId, level, policy}` per computer
  nell'ordine dei giocatori (`level` null col profilo `bozza`, `policy` «random» per un computer senza politica). `botPolicy` resta,
  col nome della politica del primo: per la partita viva ora `RandomPolicy` o `LethalAwarePolicy(SoughtHitPolicy(ALWAYS,…))`
  invece di «random».
- **Profilo `bozza`:** `BozzaPlayerFactory.craftComPlayer` ignora il livello e gioca lo stile di `app.bozza.bot`, come prima.
- **CLI** (`scripts/bm-cli.cjs`): il campo `level` del comando `join` è inoltrato come header `level` in quick/1vCom e open/1vCom.
- **Documenti:** `docs/api.md` (paragrafo «Livello del computer», righe dei tre join), `docs/cli.md`, `docs/match-archive.md`
  (`botPolicy` e `computers`; non era nell'elenco del prompt, ma descrive il campo nuovo).
- **Identici byte per byte** (`git diff` vuoto): `ComPlayer`, `BotView`, `TurnForecast`, `LethalAwarePolicy`, `SoughtHitPolicy`,
  `RandomPolicy`, `StyleSupport`, `AggressivePolicy`, `PrudentPolicy`, `ResourceAwarePolicy`. Nessun file di `client-web` o
  `client-debug`.

### Test nuovi

| Test | Cosa prova |
|---|---|
| `LiveNoHiddenInformationTest` (sempre attivo, circa 2 s) | 60 posizioni a due posti da partite vere col set vivo e `Ruleset.LIVE`, fra computer creati da `PlayerFactoryServiceImpl.craftComPlayer` (livelli misti; fra chi decide, tutti e cinque gli starter), più 20 a tre posti create da `GameFactoryServiceImpl.craftQuickMultiPlayerGame` (FFA, Normale). Copia col nascosto cambiato: mano coperta di **ogni** avversario scambiata con carte del mazzo di nome diverso, ordine di **tutti** i mazzi, una mossa già inviata da un avversario, generatori degli avversari avanzati. Attese: `BotView` uguali; `Move` di `BotPlayer.chooseMove(game)` uguale (carta, autore, bersaglio, partita, scarto, oggetto, vuota, nome cercato) per il computer creato dalla fabbrica e, allo stesso posto, per Facile e per Normale con ciascuno dei tre stili della fabbrica viva. Esito: 60/60 e 20/20; mano cambiata 60/60 e 20/20 (entrambi gli avversari in 19/20); mosse confrontate 300 e 100; posizioni con almeno due mosse legali 60 e 20; con una carta mostrata 8 |
| `ComLevelFactoryTest` | `parse` (assente, vuoto, i due nomi, sette valori rifiutati); stile di ogni starter uguale al file del set e alla tabella di D203 (4); Facile = `RandomPolicy`, Normale = la catena misurata, istanza nuova a ogni chiamata, riservati rifiutati; stile mancante o sconosciuto ferma l'avvio; il caricatore rifiuta un `botStyle` fuori vocabolario; `craftComPlayer` dà un `BotPlayer` con id `ComPlayer_\d{1,4}`, livello e politica; stesso seme, stessi computer; quick e open al livello chiesto, FFA a Normale |
| `DifficilePolicyTest.liveLevelFactoryAndPoliciesImportNoEngineTypeNorReflection` | confine dei tipi esteso a `ComLevel`, `ComPolicies`, `RandomPolicy`, `LethalAwarePolicy`, `SoughtHitPolicy`, i tre stili, `StyleSupport`, `TurnForecast`: nessun `Game`, `Player`, `ComPlayer`, `Character`, `Move` (anche per nome completo) né riflessione; `policyFor` restituisce una `BotPolicy`, il cui solo ingresso è la vista |
| `MatchArchiveTest.initialRecordsEveryComputerWithItsLevelAndPolicy` | `computers` con Facile, Normale, `BotPlayer` senza livello e `ComPlayer` senza politica; `botPolicy` del primo; lista vuota senza computer |
| `ComLevelContextTest` (contesto, STOMP vero, fabbriche vere) | quick 1vCom senza header, vuoto, `FACILE`, `NORMALE`; open 1vCom con un mazzo salvato, senza header, `FACILE`, `NORMALE`; sei valori non validi su entrambi i join: rifiuto su `/user/queue/game/error` col valore nel testo, nessuna partita, nessuna chiamata alla fabbrica, mazzo non letto, code vuote, niente sull'errore dell'open; FFA con due computer (uno aggiunto con header `FACILE`, ignorato): entrambi Normale; `INITIAL.computers` letto dal database coincide coi giocatori |
| CLI (`cli-quick-complete-test.cjs`, `cli-open-complete-test.cjs`) | la seconda partita di ciascuno manda `level: 'NORMALE'`; il lato Java verifica che la fabbrica riceva Facile per la prima e Normale per la seconda; `computers` nell'esportazione |

La misura dei tempi (`ComLevelTimingProbe`) gira solo con `-Dsb30a.timing=<cartella>`; non è un test a soglia e il nome non segue
lo schema dei test di Maven.

### Attesi cambiati (tutti deliberati, D203 (3) e D205 (3))

| File | Prima → dopo | Perché |
|---|---|---|
| `BozzaProfileOffContextTest.quickPlayersComeFromSqlite` | `ComPlayer.class` → `BotPlayer.class` con politica `RandomPolicy` | senza livello il computer vivo è il Facile sulla `BotView`, non più il `ComPlayer` casuale |
| `QuickStartersTest` (tre punti) | `instanceof ComPlayer` → `instanceof BotPlayer`, più l'id `ComPlayer_` | idem; le prove di distribuzione degli starter non cambiano e chiamano `craftComPlayer` |
| `QuickFfaCliTest` | `craftRandomComPlayer(null)` → `craftComPlayer(null, NORMALE)`, più «mai un livello diverso da Normale» | computer della FFA a Normale (D203 (1)) |
| `QuickCategoryContextTest`, `OpenCompleteCliTest`, `QuickCompleteCliTest`, `ArchiveLifecycleCliTest`, `MatchArchiveCliTest`, `WebSocketIdentityTest`, `BozzaRulesetTest` | firma nuova con `ComLevel.FACILE` (la CLI di quei test non manda il livello) | solo la firma; in `OpenCompleteCliTest` e `QuickCompleteCliTest` la seconda partita va a Normale (sopra) |

Nessun atteso numerico è cambiato, nessuna asserzione tolta. I test con la CLI che giocano partite intere sostituiscono il
computer con un `ComPlayer` fisso, com'era: le loro partite non cambiano e `botPolicy` resta «random». Nessun test con seme ha
dovuto ricalcolare un esito per il passaggio al Facile.

### Mutazioni (8/8 rilevate, poi ripristinate; [esiti](sb-30a/b2-mutations.json))

| | Mutazione | Test rosso |
|---|---|---|
| M1 | la fabbrica crea un computer la cui decisione legge la `Game` (generatore dalle mani coperte degli avversari) | `LiveNoHiddenInformationTest`, entrambi i casi |
| M2 | `BotView` porta la mano coperta degli avversari fra le carte mostrate | idem |
| M3 | Facile = il vecchio `ComPlayer` casuale | `LiveNoHiddenInformationTest`, `ComLevelFactoryTest`, `QuickStartersTest` |
| M4 | computer della FFA a Facile | `LiveNoHiddenInformationTest` (FFA), `ComLevelFactoryTest` |
| M5 | livello mancante → Normale | `ComLevelFactoryTest` |
| M6 | livello sconosciuto accettato come Facile | `ComLevelFactoryTest` |
| M7 | Normale senza `LethalAwarePolicy` | `ComLevelFactoryTest` |
| M8 | l'archivio salta il computer senza politica | `MatchArchiveTest` |

### Tempo per decisione ([JSON](sb-30a/b2-timing.json))

`BotPlayer.chooseMove(game)` su una copia di ogni posizione di partite vere (set vivo, `Ruleset.LIVE`), a JVM calda (seconda di due
passate), Ryzen 9 5950X, JDK Zulu 11.0.29, nessun altro carico.

| Caso | Decisioni | Mediana | P99 | Massimo |
|---|---|---|---|---|
| un computer, Facile (300 partite) | 3.752 | 0,018 ms | 0,046 ms | 0,113 ms |
| un computer, Normale (300 partite) | 2.604 | 0,078 ms | 0,179 ms | 2,467 ms |
| quattro computer, Normale, per decisione (80 FFA a cinque) | 3.444 | 0,123 ms | 0,348 ms | 2,799 ms |
| quattro computer, Normale, **turno intero** | 301 turni | 0,609 ms | 1,302 ms | 1,649 ms |
| quattro computer, Facile (non è un caso vivo), turno intero | 741 turni | 0,078 ms | 0,186 ms | 0,304 ms |

Limiti della proposta: P99 sotto 5 ms, massimo sotto 50 ms, turno FFA con quattro computer sotto 50 ms. Rispettati con margine
largo; nessuna decisione sopra 5 ms.

### Verifiche

| Verifica | Esito |
|---|---|
| `build.ps1 -Task Test -Offline` | verde: **1518 test, 0 falliti, 23 saltati** (12 in più di B1); client di debug 42/42 |
| `build.ps1 -Task TestServerContext -Offline` | **1727 test, 1 fallito (R3)**, 23 saltati |
| rilancio da solo di `QuickDuelCliTest` | verde, 11/11 |
| `verify-match-manifests.py` | uscita 0, `allChecks` PASS |
| `check-rules.py` | verde: regolamento 2.2, Set Base 1.0.2 |
| Identità viva (`ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, 480.000 partite, 100 s), nella cartella delle basi | `final-live.json` `ca131721…` (266.869 B), `final-live.md` `16d3bde4…` (26.112 B): **identici byte per byte** al riferimento di B1, riscritti dopo il codice |
| `TurnForecastFidelityTest` | verde nel giro dei test, file non toccato |
| Mutazioni | 8/8 rosse, sorgenti ripristinati (nessun `MUTANT` rimasto, `git status` uguale a prima) |
| `build.ps1 -Task Server -Offline` | jar rifatto |
| `check-links.py` | 22 rotti, quelli noti |
| `git diff --check` | pulito (solo l'avviso di fine riga di `MatchArchiveTest.java`, normalizzato da git) |

**Rosso del contesto completo.** `QuickDuelCliTest.aBaseAndAnAdvancedHumanPlayTheirOwnStarters`, «Error: Event timeout»: stessa
verifica, stesso test e stessa firma di B1, quindi **noto, voce R3** del [registro](../rossi-noti.md). È una partita 1v1 fra due
umani, senza computer. Come chiede il prompt l'ho rilanciato una volta da solo: verde (11/11).

**Processi.** Prima di ogni corsa di Maven e del banco nessun altro `java` o `mvn`; le corse una alla volta.

### Non verificato

- Nessuna verifica col browser: `client-web` non manda ancora il livello (B3), quindi oggi gioca contro il Facile. Le Playwright
  giocano contro un computer diverso dal `ComPlayer` di prima, di forza pari (51,6% nella misura della Fase A): da guardare in B3.
- Nessuna partita manuale (B4).
- Due computer con lo stesso id (quattro cifre a caso, come prima) restano possibili in FFA: non è cambiato, non indagato.

### Scelte prese

- Nomi del livello maiuscoli e confronto esatto (i nomi dell'enum); il minuscolo si rifiuta, come la categoria rifiuta «Base».
- Il rifiuto del livello nell'open va su `/user/queue/game/error`, come chiede il prompt, non sull'errore dell'open: oggi
  `client-web` per l'open ascolta solo quest'ultimo, ma non manda ancora il livello (domanda 1).
- Il caricatore rifiuta un `botStyle` fuori vocabolario: lo fa già il generatore, qui protegge l'avvio del server.
- La prova sul percorso vivo è un test nuovo nel pacchetto delle fabbriche (serve il costruttore con seme), non un'estensione di
  `Sb30bProbeTest`; ne riprende la trasformazione del nascosto.

### Per le altre macchine

- Server cambiato: dopo il pull il jar va ricostruito prima di qualsiasi verifica del client.

### Da giudicare

I tempi, il campo `computers` dell'archivio, il rifiuto del livello nell'open su `/user/queue/game/error`.

### Domande

1. **Rifiuto del livello nell'open.** Resta su `/user/queue/game/error`, e in B3 il client ascolta quella coda anche nell'open?
   Raccomandato: sì, così quick e open rifiutano il livello allo stesso modo.

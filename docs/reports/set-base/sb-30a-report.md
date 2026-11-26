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

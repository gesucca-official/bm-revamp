# SB-28 — Trasferimento nella partita viva: rapporto

Blocco secondo la [proposta](../../design/set-base/sb-28-proposta.md) e [D182](../../set-base-decisioni.md#decisioni-del-proprietario).

## Fase A

**Approvata il 23 novembre 2026 ([D183](../../set-base-decisioni.md#decisioni-del-proprietario)).** Scelte dell'esecutore accettate per D1, D2, D4, D5, D6, D8; D3: «Ultimo colpo» non entra nel 2.0; D7: avviso e «∞» escono dal regolamento verso le verifiche del client di SB-31; il formato del file del set va in `docs/formato-file-set.md` (Fase B). Le correzioni di D3 e D7 sono state fatte dalla regia nel regolamento candidato e nella corrispondenza.

**Esito: consegnata il 23 novembre 2026, STOP per la lettura del proprietario.** La norma è scritta solo come testo: il
[regolamento 2.0 candidato](../../design/set-base/sb-28/game-rules-2.0.md), la [corrispondenza](../../design/set-base/sb-28/corrispondenza.md)
e il documento del Set Base 1.0 candidato rigenerato coi rimandi al regolamento. Nulla di vivo cambia: `docs/game-rules.md`,
`docs/sets/`, copie del client, `cards.sqlite` vivo e codice del server sono invariati; `check-rules.py` sul vivo è verde senza
modifiche. Base del blocco `5870108`.

### Cosa è stato scritto

1. **Regolamento 2.0 candidato** ([game-rules-2.0.md](../../design/set-base/sb-28/game-rules-2.0.md)): la 1.14 con le regole del
   playground che governano il gioco, scritte come regole di sistema nella numerazione del regolamento. I numeri R00–R09 non
   cambiano (sono citati in tutto il repository); entrano due regole con lettera, nello stile di R01a e R07a:
   - **R02a — Ricerca al posto della pesca** (RP-8…RP-12, RP-24);
   - **R07b — Parole chiave**, ciascuna definita una volta: Annuncia, Vulnerabile e gettone, Gioca d'anticipo, Rincara, In campo,
     Vendi, «Ultimo colpo», immune.

   Le regole di sistema stanno dove la 1.14 tratta già l'argomento: pavimento a zero e «a terra» in R01, costi in R03, gruppi di
   velocità e «chi è a terra non colpisce» in R04, corazza dell'alcol in R05, ordine dei timer, effetti In campo e nessuno spareggio
   in R06, informazioni pubbliche in R08. Revisione 2.0 con la motivazione (D50, D73, D78, SB-28, D182). Un riquadro in testa dice
   che il testo è candidato e non in vigore; si toglie al passaggio.
2. **Corrispondenza** ([corrispondenza.md](../../design/set-base/sb-28/corrispondenza.md)): RP-n → regola 2.0, le altre sezioni del
   playground, le regole 1.14 che cambiano o perdono una frase (nessuna sparisce per intero: tre frasi), e le regole del formato
   (RP-22, RP-26, RP-28, più `searchShuffle`, `anticipo`, `perPlay`) col testo da portare in una pagina del formato in Fase B.
3. **Set Base 1.0 candidato coi rimandi.** I rimandi «regole del playground, RP-n» nascono in un solo posto, la tabella `RIMANDI`
   di [testi_stampati.py](../../design/set-base/testi/testi_stampati.py) (generatore dei testi di SB-25). Il file del set non li
   contiene; `tools/print-cards/bozza.py` li ha scritti a mano nella guida della stampa della bozza (sotto, «Non toccato»).
   Cambiate le dieci righe del playground e quella di «immune» (definizione spostata in R07b); poi `genera-testi.py --scrivi` e
   `set_catalog.py`. Risultato:
   - **file del set invariato:** SHA-256 `325926e3…` prima e dopo (`genera-testi.py` riscrive solo campi uguali);
   - **testo breve invariato** (sta nel file del set);
   - `testi-completi.json`: 101 campi cambiati, **tutti solo dentro le parentesi del rimando** (confronto campo per campo con
     i rimandi tolti: 101 su 101); nessun «regole del playground» rimasto; impronta `2b3e1a93…` → `ef7cd3ea…`;
   - catalogo candidato rigenerato: `sets/base.md`, copia client, `sets/base.json`, `cards.sqlite`, `manifest.json`; nel documento
     del set cambiano solo i rimandi e l'impronta dei testi completi nella riga di revisione.

   Rimandi nuovi: corazza → R05; pavimento → R01; a terra → R04; annuncia → R02a e R07b; vulnerabile, anticipo, rincara, vendi,
   in campo, immune → R07b; scarto (carta di ricerca scartata) → R02a.

### Dubbi aperti (non risolti in silenzio)

- **D1. RP-20, «fattori moltiplicati … prima dei troncamenti del percorso R05».** Il motore crea ogni Vulnerabile come uno stato
  INPUT a sé (`Vulnerability.statuses`) e `applyStatusToDamage` tronca dopo ogni stato: due gettoni su 13 HIT danno 19 poi 28, non
  13 × 2,25 = 29. **Scelto:** la 2.0 scrive quello che fa il motore (R07b Vulnerabile punto 2: troncamento per passo, «circa ×2,25»),
  coerente con R05. **Alternativa:** prodotto dei fattori e un solo troncamento, che richiede una modifica del motore e una misura.
- **D2. RP-16, «dopo tutti gli effetti di fine turno».** Nel motore il gettone soddisfatto cade con la scadenza degli stati (R06 punto 4),
  dopo veleno, alcol e timer ma prima dell'effetto In campo (punto 5). Nessun esito diverso: In campo non è un danno.
  **Scelto:** «cade con la scadenza degli stati di quel fine turno». **Alternativa:** la frase del playground, imprecisa sull'ordine.
- **D3. «Ultimo colpo».** D50 (2) dice «nessuna parola chiave», la sezione 4 del playground la conta fra le parole chiave; nessuna
  carta del Set Base 1.0 la usa (0 `lastBlow` nel file del set). **Scelto:** è in R07b, come eccezione scritta sulla carta, perché
  RP-3 è nell'elenco da tradurre e il motore la supporta. **Alternativa:** toglierla dal regolamento finché una carta non la usa.
- **D4. Vendi come parola chiave.** La proposta non la elenca, ma il testo completo di «Fiuto per gli Affari» ha un rimando proprio
  («vendi») e RP-25 è una regola generale. **Scelto:** voce «Vendi» in R07b e l'eccezione del ricavato in R04. **Alternativa:** solo
  la frase in R04, senza parola chiave.
- **D5. «Gettone».** Nei testi compare una volta («gettone di vulnerabilità»); in R01a «token oggetto» è un oggetto sul campo.
  **Scelto:** gettone = segno sul giocatore legato a un nome, uno stato (R05), distinto dal token oggetto; nel Set Base l'unico è
  Vulnerabile. **Alternativa:** non definirlo e usare solo «Vulnerabile».
- **D6. Annuncia comprende sempre Vulnerabile.** D78 (1) lo definisce così e tutte le 12 ricerche del file del set hanno il gettone,
  ma il formato e il generatore ammettono una ricerca senza. **Scelto:** la 2.0 segue D78; una carta senza Vulnerabile dovrebbe dirlo
  nella scheda (R00). **Alternativa:** Vulnerabile come parte facoltativa di Annuncia.
- **D7. Comportamenti del client nelle regole.** RP-17 (avviso prima di scartare l'ultima copia) e RP-21 («∞» sul gettone) sono
  comportamenti del client. **Scelto:** restano nel testo di R07b com'erano nelle RP. **Alternativa:** toglierli e portarli nelle
  verifiche del client (SB-31). Il contatore di Rincara è pubblico per R08, ma il client lo mostrerà solo con SB-31.
- **D8. «Immune» spostato.** La definizione passa da R01 a R07b e il rimando dei testi da «R01 e R06» a «R07b»: è un rimando non del
  playground, cambiato perché la parola chiave sia definita una volta. **Alternativa:** lasciarla in R01 e far rimandare R07b a R01.

### Verifiche

Comandi dalla tabella delle aree (catalogo candidato e suoi ingressi, file del set, dipendenza di `tools/print-cards`, «Sempre»):

| Verifica | Esito |
|---|---|
| `python -X utf8 scripts/check-rules.py` (vivo) | verde, invariato: «Regolamento 1.14 e Set Base 0.1 allineati alle copie client; … SQLite integro.» |
| `python -X utf8 scripts/check-rules.py --candidate` | verde: «Catalogo candidato …: 1 set (base 125 voci); schede uguali al testo completo, testo breve, guadagni e danno uguali al generatore di SB-25, … copie client e file identici alla generazione.» |
| `python -X utf8 tools/set-catalog/set_catalog.py --check` | «5 file … identici alla generazione.» |
| `python -X utf8 tools/set-catalog/prova-errori.py` | copia intatta uscita 0; i quattro guasti provocati escono con 1, come atteso |
| `controlla-testi.py` | «117 carte e 44 stati: … 125 testi completi coincidono; nessun gergo» |
| `controlla-numeri.py`, `controlla-nomi.py` | 0 violazioni |
| impronta del file del set | `325926e35d37…` prima e dopo |
| confronto dei testi completi | 101 campi cambiati, 101 solo nei rimandi |
| `tools/print-cards/test_generator.py`, `verify.py` | 16 test OK; «OK: 40 voci, 40 fronti …» |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: 1486 test, 0 falliti, 0 errori, 23 saltati; client di debug 37 su 37 (log in `%TEMP%\sb28-fase-a-test.log`) |
| `git diff --check` | nessuna segnalazione |
| `scripts/check-links.py` | 8 link rotti, tutti preesistenti e fuori dal blocco (`docs/design/carriere/`, verso `prototipi/carriere/` non nel repository); nessuno nuovo |

Non eseguiti: il PDF della bozza (`generate.py --bozza`) non è stato rigenerato né guardato: i rimandi nuovi sono tutti più corti dei
vecchi, quindi il libretto dei testi completi non può allungarsi. `TestServerContext` e le verifiche del client: nessun codice né file
vivo toccato.

### Non toccato, per la Fase B

- `tools/print-cards/bozza.py`: la guida della stampa della bozza cita a mano «regole del playground, RP-n» in sette frasi e le
  regole del playground come fonte. Stampa la bozza com'è oggi nel playground, quindi è ancora vera; si riscrive quando la stampa
  usa il set vivo (Fase B).
- La riga di revisione del documento del set candidato («1.0 candidata — SB-26») è scritta da `set_catalog.py` e non cita la versione
  del regolamento: al passaggio dovrebbe dire che il set richiede il regolamento 2.0.
- Commenti Javadoc di `Sb27SpecialCardsTest` (RP-13–RP-24, RP-27): solo commenti.
- Le evidenze storiche di SB-25 e SB-26 (`revisione-b.html`, `sb-26/espansione/`) restano coi rimandi del loro momento.
- I file non tracciati in `output/pdf/` (PDF della bozza) erano nel working tree all'inizio e non sono di questo blocco: non toccati
  né aggiunti.

### Scelte prese

- Numerazione: R00–R09 invariati, regole nuove con lettera (R02a, R07b), per non rompere i riferimenti esistenti.
- Regole di sistema dentro le regole 1.14 che trattano l'argomento; parole chiave tutte in R07b.
- La revisione 2.0 cita la cancellazione dei mazzi salvati (D182 (3)) come operazione del passaggio, non come regola; la quick a caso
  fra i cinque starter (D182 (1)) non cambia il testo di R01.
- Il formato del file del set non entra nel regolamento: testo pronto nella sezione 3 della corrispondenza.

### Per il proprietario

Leggere il regolamento 2.0 (soprattutto R04, R06 e R07b) e la corrispondenza. Domande:

1. I dubbi D1–D8: vanno bene le scelte?
2. Dove va la descrizione del formato del file del set: una pagina `docs/formato-file-set.md` in Fase B (proposta), o i commenti delle
   classi del caricatore?

## Fase B

**Esito: consegnata il 23 novembre 2026, in un solo commit di passaggio (`80d5b3b`).** La partita viva gioca il regolamento 2.0 col Set Base
1.0, letto dal file del set in produzione; quick a caso fra i cinque starter, mazzi salvati con carte uscite cancellati. Dettagli
(norma, carte uscite, pulizia di SB-27, attese cambiate con la decisione) in [sb-28/fasi-b-c.md](sb-28/fasi-b-c.md).

### Verifiche della Fase B

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | verde: 1497 test, 0 falliti, 23 saltati; client di debug 37 su 37 |
| `./scripts/build.ps1 -Task TestServerContext -Offline` (a parte) | verde: 1695 test, 0 falliti, 23 saltati |
| `check-rules.py`, `verify-match-manifests.py`, `set_catalog.py --vivo --check`, `prova-errori.py`, `git diff --check` | verdi |
| `client-web` `VerifyModes` (server su database temporaneo), `VerifyFfa` | verdi; `VerifyFfa` dopo la correzione della domanda 3 |
| corsa d'identità del giro 20/2 sul percorso vivo (403.200 partite, `d50`) | uguale al congelamento: `deck-observations.json` `87aa84d6…` identico, `matrix.json` uguale salvo i due campi della fonte (domanda 4); [confronto](sb-28/identita/confronto.json) |
| misura lunga `ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft` (`-Dsim.rules=1.13`) | identica: `final-live.json` `ca131721…` |
| `client-web` `Test` | **rosso, 7 test** (domanda 2) |

Le altre misure lunghe saltate (`sim.*`) non sono state eseguite.

### Domande per la regia

1. Le fixture che costruiscono `new Game` a mano giocano il motore 1.13 (`Ruleset.LEGACY`, predefinito) coi personaggi Java dello 0.1
   (100 HEALTH), mentre l'intestazione dell'archivio dice 2.0 (in `cli-match-export-test.cjs` la salute scende a −5). Le partite
   della fabbrica giocano 2.0. Restano così, o le fixture passano a `Ruleset.LIVE`?
2. `client-web` `Test` ha 7 test rossi legati allo 0.1: atlante (125 classi, 40 riquadri), cornici e impatti (conteggi 37), intestazioni
   e tabelle dei documenti (R02a, R07b, S5 tolto, personaggi), testi degli stati confrontati con le righe dello 0.1. È adeguamento del
   client (SB-31) e illustrazioni (SB-32), fuori perimetro: non toccati. Non verificato se erano verdi sulla base.
3. `client-web/tools/verify-ffa.mjs`: il controllo di riservatezza segnalava una carta «solo nella mano dell'altro» presente in
   `revealed` di un computer, cioè la copia mostrata da una ricerca, pubblica per R08 2.0. Ho escluso `revealed` dal controllo, citando
   D183. È uno strumento condiviso (passo «con proposta»): va bene così?
4. Identità: nell'intestazione della matrice cambiano `bozza` (nome della fonte) e `sha256`, perché la corsa legge il file vivo e non la
   bozza. Ogni partita è uguale. Vale come identità?
5. Restano, da decidere: le classi Java delle carte a dati dello 0.1 e i personaggi Java in `server/src/main`; il controllo
   `poison > 0` di `ToxicBloodDrain`; `verify-decks` e `verify-resolution` del client citano carte dello 0.1 (non eseguite);
   catalogo vivo senza immagini (`no-img.png` fino a SB-32).

## Fase C

**Esito: consegnata il 23 novembre 2026.** Partite reali via CLI ([runner](sb-28/partite-cli.cjs), [risultato](sb-28/partite-cli.json))
su un server col jar nuovo e un database temporaneo, contro il bot del server: un'open 1vCom fino all'esito per ognuno dei cinque
starter (Spazienzio, Mara, Celestina, Piera, Beppe) e per Sergio e Duccio (mazzi di prova fatti di carte vive), più cinque quick
1vCom. Tutte arrivate all'esito (10 vittorie, 1 sconfitta, 1 pareggio), 0 mosse rifiutate, esportazione integra, regolamento 2.0 e
set 1.0 registrati; collezione di 7 personaggi e 117 carte. Le quick hanno dato Piera, Beppe e Celestina. La migrazione ha scritto nel
log «0 saved decks … deleted, 0 kept»; sulla copia del database locale del proprietario cancellerebbe 0 mazzi (ne ha 0).

**Partita del proprietario** (da `E:\bm`, il jar è già rifatto; il primo avvio applica la migrazione al database locale):

```powershell
./scripts/dev.ps1 -Task Server -SeedAccounts
./client-web/run.ps1 -Task Build
./client-web/run.ps1 -Task Serve
```

Poi http://127.0.0.1:4320 con `devAlice` (password del seme locale). Il jar va rifatto (`./scripts/build.ps1 -Task Server -Offline`)
solo se cambia il codice.

**Non provato:** una partita giocata da una persona nel client (spetta al proprietario); FFA con cinque umani; le altre verifiche
`Verify…` del client (fra cui `VerifyDecks` e `VerifyResolution`, ancora sullo 0.1); la migrazione su mazzi salvati veri (coperta
solo da `SetBaseDecksMigrationTest`).

## Rifinitura (D184)

**Esito: consegnata il 24 novembre 2026, con un rosso aperto per la regia: `VerifyResolution` (sotto, punto 6).** Il comportamento di gioco non
cambia: nessun file di `server/src/main` è stato modificato (solo spostate le classi dello 0.1 non più usate dalla partita viva), quindi la
corsa d'identità del giro 20/2 non è stata rifatta. Nessun push, nessun deploy. Il server e l'anteprima del proprietario non sono stati toccati.

### Per punto

**1. Fixture al 2.0.** Le fixture che costruiscono `new Game` a mano giocano ora la partita viva: `Ruleset.LIVE`, personaggi e carte del file
del set (nuova `LiveFixtures`: `set()`, `character`, `card`, `player`, `computer`, `live`, `legacy`). `GameFixtures` è riscritta su
Spazienzio del Set Base 1.0 (70 HEALTH, base «ADOPERIAMOTI», ultima risorsa «Addosso!!!», legate chiamate `bound-one`/`bound-two` secondo il
bersaglio); gli attesi sono quelli del 2.0 (HEALTH non scende sotto 0, costi pagati solo con quello che si ha) e ogni numero cambiato dice
«SB-28, D184 (1)» (MoveTest, MoveCommandTest, RoundIsolationTest, LifecycleClockTest, OutcomeReasonTest, MatchArchiveTest,
MatchArchiveRecoveryTest, MatchRestartTest, i tre test CLI dell'archivio, QuickCompleteCliTest, DeckRulesContextTest, che ora ripete la regola
R02 su tutti e cinque gli starter). `LiveCharactersTest` (nuovo) prova che ogni personaggio vivo ha le cinque risorse e che la fixture è
`LIVE`. Script: `cli-match-export-test.cjs` ha ora intestazione 2.0 e salute 55/0 (era 85/−5), come `cli-archive-lifecycle-test.cjs`;
`cli-quick-complete-test.cjs` legge la salute iniziale dalla vista e calcola i turni attesi.
Restano su `Ruleset.LEGACY`, ora **esplicito** (`LegacyFixtures` o `LiveFixtures.legacy`), solo i test che provano il motore 1.13 o il
simulatore storico con le carte Java dello 0.1: `CatalogEffectsTest`, `MissingResourceTest`, `RulesConformanceTest`, `BotViewTest`,
`CardScenarios`, `ConsumeEquipStatesTest`, `PlaygroundTest`, `SimulationControlTest`. **Scostamento dalla lettera di D184 (1) da
confermare:** la lettera dice che restano su 1.13 solo i test che leggono partite archiviate; questi non leggono archivi ma giocano il
catalogo storico congelato (`/set-base/storico/0.1`), che esiste per riprodurre le misure 1.13. Portarli al 2.0 con le carte vive
significherebbe riscriverli come test nuovi.
La lettura di una partita archiviata 1.13 è provata da `ArchivedMatch113Test` (nuovo): gioca una partita 1.13 con le classi dello 0.1,
la rilegge con un servizio e una connessione nuovi, e controlla intestazione 1.13/0.1, HEALTH iniziale 100, esito, 85/−5, integrità e
accesso negato a un estraneo. `SimulationControlTest` (controllo di SB-3) ora legge `versions.rulesVersion` dall'esportazione e rifiuta
quelle che non sono 1.13: il controllo non funziona più su una partita viva 2.0 (la partita viva non è più riproducibile dal catalogo
storico).
Non convertiti: le fixture di giocatore di `QuickDuel`, `QuickFfa` e `OpenComplete` (test di contesto) che passano ancora per
personaggi Java con 100 HEALTH; le partite sono vive (2.0) e i test sono verdi, ma i numeri non sono quelli del set.

**2. `client-web` `Test`.** Sulla base `5870108` (prima del passaggio) era **369 su 369 verde**; dopo `80d5b3b` era 362 su 369 (7 rossi), tutti
causati dal passaggio. Ora **369 su 369 verde**. Cambiati (ogni atteso cita D184 (2)): `art.test.ts` (125 classi: 34 col riquadro
proprio, 91 col segnaposto `no-img.png`, le 6 classi uscite tengono un riquadro che nessuna carta chiede), `frames.test.ts` (67 regolari,
21 legate, 7 base, 4 ultime risorse, 18 oggetti; 117 carte), `impact.test.ts` (117 carte, 46 col danno nominale, `ManoLesta` per DISRUPT
perché `Cough` ora ha il danno POISON), `public.test.ts` (regolamento: R02a e R07b; documento del set: S1–S4 e Revisioni, tabelle di
personaggi, starter e ruoli del Set Base 1.0, schede in prosa), `readability.test.ts` (i cinque testi di stato `STATUS_TEXT` si confrontano
con le righe dello 0.1 in `docs/history/set-base-0.1.md`; uno stato dell'1.0 mostra il testo del server). **Nessun difetto del client emerso
da `Test`.** Un vuoto resta per SB-31: `STATUS_TEXT` è indicizzato sui nomi inglesi dello 0.1 e i marcatori `[[…]]` dei testi nuovi non hanno
una lettura nel client.

**3. Riservatezza FFA.** In `verify-ffa.mjs` l'esenzione `delete pl.revealed` è ristretta: si toglie dal testo controllato solo `revealed[].card`
(la carta mostrata da una ricerca riuscita, pubblica per R08 2.0); `copy` e `turn` e il resto della vista restano nel controllo, un campo
fuori da `copy`, `slot`, `card`, `turn` fa fallire, e `slot` (il posto nella mano) deve mancare nelle viste degli altri giocatori. La stessa
esenzione mancava in `verify-modes.mjs`, dove ha fatto fallire il controllo alla prima prova con una carta «solo nella mano dell'altro»
uguale per nome a una carta mostrata: è stata data la stessa forma stretta.

**4. Classi dello 0.1 non più usate.** Spostate **24 classi** da `server/src/main` a `server/src/test` (stesso pacchetto, `git mv`; non
cancellate): servono ancora al catalogo storico congelato e al simulatore (`SimulationCatalog` le istanzia per nome) e ai test storici, ma
la partita viva non le carica: bruiser `CantFeelAnything`, `ExtremelyViolentBlow`, `Glare`, `HealingBlow`, `MadeOfStone`, `SeagullFly`,
`SickeningBlow`, `StunningBlow`, `SuperImpact`; bruiser/character `BigBadBruiser`, `LittleRage`, `LittleSmack`; com `Grab`, `basic/BruiserGrab`,
`basic/ToxicGrab`, `items/CocktailOnTheGround`, `last/Struggle`; junkie `Cough`, `LethalHeroinDose`, `MethDrivenRage`,
`PervertedMetabolism`; junkie/character `PatheticBlade`, `RottenSmile`, `ToxicJunkie`. Restano in `main` le 22 classi di carta che il set
vivo usa (le 19 `java:true`, più `RottenBeer`, `BrokenBeerBottle` e `Contromossa`, richiamate da altre: bruiser `BadEducation`, `BreakYourToy`, `YouStop`; com `Steal`, `items/AnotherRottenBeer`, `items/MarvelousCocktail`,
`items/RottenBeer`, `tokens/BrokenBeerBottle`; junkie `AmphetamineReflexes`, `ToxicBloodDrain`; base `cesira/Contromossa`, `LoSapevo`, `Ricatto`,
`bound/NeRiparliamoFuori`, `com/BeggingMoney`, `com/ShuffleFeet`, `gigi/LavoroFattoBene`, `items/SantinoDellaPortinaia`, `pino/GoingBerserk`,
`RuttoADistanzaSociale`, `UltimoGiro`, `rocco/bound/MiRialzo`) e le 7 basi comuni (`AbstractCard`, `AbstractCharacterBoundCard`,
`AbstractItemCard`, `Card`, `LoadableCard`, `PrintedEffects`, `Tunable`). Perché non servono le classi per leggere gli archivi: l'archivio è
JSON puro (`MatchArchiveService`, `MatchEventRepository`) e non ricostruisce partite giocabili; lo prova `ArchivedMatch113Test` (punto 1).
I 24 file sono ancora in `server/src/test` e il jar (`server/target`) non li contiene più: **il jar è da rifare** (non l'ho rifatto: vedi sotto).

**5. `ToxicBloodDrain`, controllo `poison > 0`.** Il campo `poison` (`@Tunable`, 10 nel set vivo) è il danno POISON del passo 5 della scheda
«Trascinare nel Tunnel» (`docs/sets/base.md`: «Infliggi 10 POISON all'avversario», danno fisso 10 POISON). Il controllo `if (poison > 0)`
salta quel passo, nella logica e nel testo stampato per i bot, solo con `poison = 0`, valore che scrivono ancora le bozze storiche scritte
prima di D84 (`BozzeStoriche`, `PotenzaD82Test`, `BozzeStoricheTest`): così le loro misure restano quelle. Nella partita viva il valore
è 10 e il controllo non scatta mai. **La scheda e il codice concordano per la partita viva; non cambia nessun gioco e non ho toccato il
codice.** Toglierlo cambierebbe le misure storiche (le bozze con `poison = 0` infliggerebbero 0 POISON con un danno da 0 invece di saltare il
passo): decisione per la regia se si vuole comunque, con una rimisura.

**6. `VerifyDecks` e `VerifyResolution`.**
- `verify-decks.mjs` adeguato al set vivo: catalogo di 124 facce (117 carte e 7 personaggi), 46 con danno, 33 col riquadro proprio
  nell'atlante e 91 sul segnaposto (la verifica calcola, con le stesse funzioni del client, il riquadro atteso di ogni faccia); mazzi di prova
  con carte vive (`TartarugaSulMarciapiede`, `MattoneDelCantiere`, `DentiStretti` al posto delle uscite); tre legate per Spazienzio e per
  Celestina; due ultime risorse generiche. **Verde.**
- `verify-resolution.mjs` adeguato: mazzi «C3 contrasti» e «C3 furti» con carte vive al posto di `WhatchaDoin`, `BeggingMoney`, `ShuffleFeet`,
  `EverythingIsDrug`, `GoingBerserk`. **Rosso su un controllo vero**, non sugli attesi: la regola `c34` (le barre per carta della scena
  contro la misura delle righe del rapporto). Con le carte vive la scena ripiega sui totali («bars total») anche quando la misura dice che le
  righe ricostruiscono le viste: per esempio «HEALTH: i passi finiscono a 50, la vista dice 20» e «4 passi, la misura 6»; in FFA «passi
  7, misura 12». Rossi `quick` (due partite diverse), `ffa`, `humans` e `open` «C3 furti»; verdi `reduced`, `interruptions`, `infoDuel`,
  `infoFfa`, `infoTouch`, `jump`, `report` e `rule4WithClock`; in `open` «C3 contrasti» ha passato `c34`, ma il controllo della pillola di
  `ExtremelyViolentBlow`, che viene dopo i due mazzi, non è stato raggiunto. Il ripiego sui totali è il comportamento corretto
  del client quando non sa ricostruire un turno: la lacuna è nel costruttore dei passi (`reportSteps` in `client-web/src/resolution.ts`),
  che con le carte e le regole nuove non riproduce le viste, mentre `reportCheck` sì. È un difetto del client rispetto al set 1.0 (adeguamento
  SB-31), **non l'ho corretto e non ho cambiato l'atteso**; non diagnosticato oltre il sintomo. Prove in `%TEMP%` della sessione, non nel
  repository.
- Per far girare le verifiche di gioco serve rispondere alla finestra «Quale carta cerchi?» (SB-16i): con le carte nuove compare spesso
  (annunci con due nomi nel mazzo), e `verify-modes`, `verify-decks` e `verify-resolution` ora scelgono la prima opzione dopo «Conferma».
  È una modifica dello strumento, non del client.

### Verifiche

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | verde: 1501 test, 0 falliti, 23 saltati; client di debug 37 su 37; `check-rules.py` incluso |
| `./scripts/build.ps1 -Task TestServerContext -Offline` (a parte) | verde: 1699 test, 0 falliti, 23 saltati |
| `python scripts/check-rules.py`, `python scripts/verify-match-manifests.py` | verdi (`allChecks: PASS`) |
| `client-web` `Test` | verde: 369 su 369 (sulla base `5870108` era 369 su 369; sul passaggio 362 su 369) |
| `VerifyModes` | verde (dopo la risposta alla finestra di ricerca e la stretta di riservatezza) |
| `VerifyFfa` | verde, con la riservatezza ristretta |
| `VerifyDecks` | verde |
| `VerifyResolution` | **rosso**: `c34` in `quick`, `ffa`, `humans`, `open` (furti); gli altri scenari verdi (punto 6) |
| `docs/reports/set-base/sb-28/partite-cli.cjs` (7 corse da 12 partite; quattro con una copia del runner che registrava i rifiuti, poi tolta) | 12 partite su 12 arrivate all'esito in ogni corsa, 2.0 e Set Base 1.0 registrati; **una** mossa rifiutata in una corsa su sette (Duccio, `illegalMove`), 0 nelle altre; il runner non registra il motivo e non l'ho riprodotto in quattro corse con registrazione |

Le verifiche del client sono state eseguite sul jar costruito dalla copia attuale del sorgente in una cartella della sessione (porta 18080,
anteprima 14320, database temporaneo): non ho toccato né il server né l'anteprima del proprietario (8080 e 4320), né `server/target`.
**Il jar del proprietario in `server/target` non è stato rifatto** (resta quello delle 18:19 del 23 novembre): il gioco non cambia, quindi
può continuare la sua partita; va rifatto (`./scripts/build.ps1 -Task Server -Offline`) prima del push perché non contiene la pulizia.
Dopo le mie prove il processo sulla 8080 non risultava più in ascolto: non l'ho fermato io, ho chiuso solo i processi sulle porte 18080 e 14320.

### Cosa resta

1. **Decisione della regia su `VerifyResolution`** (`c34`): il client non riproduce per carta i turni del Set Base 1.0. Va a SB-31, oppure
   si decide una correzione prima del push; lo strumento non è stato allentato.
2. Confermare lo scostamento del punto 1 (le fixture storiche restano su 1.13, esplicite).
3. Una mossa rifiutata nelle partite CLI (una su circa 84): da capire se è un caso legale del runner o un difetto; non ripetibile in quattro corse.
4. SB-31: `STATUS_TEXT` sui nomi dello 0.1 e marcatori `[[…]]` senza lettura nel client; SB-32: immagini (il segnaposto `no-img.png` copre 91 classi).
5. Rifare il jar prima del push; il push resta del proprietario.

## Ultimo giro (D185)

**Esito: consegnato il 24 novembre 2026, tutte le verifiche richieste verdi** (salvo un rosso intermittente di strumento in `VerifyModes`,
registrato come R8, sotto). `VerifyResolution` è verde con `c34` intatta e il controllo della pillola raggiunto; la mossa rifiutata era un
difetto del runner, non del server. Nessun file di `server/src/main` cambiato, quindi nessuna corsa d'identità 20/2. Jar del proprietario
rifatto. Nessun push, nessun deploy.

### 1. `VerifyResolution` `c34`: causa e correzione

**Causa (una sola, nel client).** Con il regolamento 2.0 la corazza dell'alcol (R05, «Corazza dell'alcol (2.0)») fa scrivere al server la
riga del danno HIT con un'etichetta **dopo** i numeri: `HEALTH: 55->23 (-32) (ALCOHOL armor: -5 HIT)` (`Character.takeDamage`). I
numeri sono la variazione vera di HEALTH, quindi la misura di D1 (`reportCheck` di `verify-resolution.mjs`, espressione non ancorata) la
conta e ricostruisce la vista; `regularLine` del client (`client-web/src/resolution.ts`) accettava un'etichetta tra parentesi solo
**prima** della forma regolare e chiedeva che la riga finisse sui numeri, quindi saltava la riga. Da qui tutte le firme del rosso: «HEALTH:
steps end at 50, view 20» (un colpo da 30 non letto), «4 steps, measurement 6», in FFA «12 steps, measurement 13» anche con barre per
carta (una riga a variazione 0: colpo assorbito tutto dalla corazza) e «HEALTH from 21, previous step left 29» (riga precedente saltata).

**Prova sul server vero.** 12 partite CLI esportate (jar della testa `3676d70`, porta 18080, database temporaneo), ogni stringa con la forma
`RISORSA: a->b (d)` confrontata con l'espressione del client: 1.348 righe, 1.272 regolari, **le altre 75 tutte della forma
`HEALTH: N->N (N) (ALCOHOL armor: N HIT)`** nei rapporti delle mosse; nessun'altra forma (l'unica altra stringa è un testo di log
dell'`ENGINE_REPORT`, non una riga della vista). Le altre regole del 2.0 non scrivono righe di forma nuova: pavimento a zero e costi pagati
con quello che si ha passano dalla stessa `editResource` (righe regolari; quando il pagato differisce dal costo nominale misura e client
ripiegano entrambi sui totali); i guadagni delle ricerche sono righe `SELF` regolari; «In campo» scrive `(nome) RISORSA: …`, etichetta in
testa, già letta; gruppi di velocità, «a terra» e Vulnerabile non cambiano la forma delle righe. **Non è un difetto del server:** la riga è
corretta e regolare, era il client a non leggerne la forma con l'etichetta in coda.

**Correzione.** `REGULAR` accetta al più un'etichetta tra parentesi anche dopo i numeri, simmetrica a quella in testa; l'etichetta non si
legge e il resto del testo resta libero (D1). Aggiornati il commento nel codice e la frase «Barre e numeri» del
[README del client](../../../client-web/README.md#contenuto-e-regia-della-sequenza-c3-4-revisione-d13). `c34` e ogni altro controllo di
`verify-resolution.mjs` sono invariati.

**Test aggiunti** (`client-web/tests/resolution.test.ts`): la riga con la corazza è regolare e coerente, una con la variazione sbagliata è
incoerente, due etichette in coda o testo libero in coda restano testo libero; ogni round reale registrato con una riga HEALTH sul
bersaglio, con l'etichetta della corazza aggiunta, dà gli stessi passi di prima e barre per carta (almeno 3 round). **Mutazioni:** con
l'espressione vecchia falliscono i due test nuovi; accettando qualsiasi testo in coda fallisce il primo.

**Controllo della pillola.** Il binding `bruiser.ExtremelyViolentBlow` non è uscito dal set vivo: la classe Java è nei sorgenti di test, ma il
binding è una carta a dati del Set Base 1.0 («SPEDIAMOTI DUNQUE IN O-AHIO», 10 V, `HIT 6+x`, x metà della V che resta). La formula del
controllo, base del catalogo più metà di (V − costo), è quella della carta viva: il controllo è stato **raggiunto senza cambiarlo**, 4 turni
con la carta in mano, 0 problemi (V 25, costo 10, pillola «13», etichetta giusta).

**Esito di `VerifyResolution`** (1366×768, server 18081 e anteprima 14321 su database temporaneo): **verde**, `c34` verde in tutte e sei le
partite (`quick` 17 round per carta; `ffa` 17 per carta e 2 sui totali; `jump`; `humans` 8 per carta; `open` «C3 contrasti» 11 e 1,
«C3 furti» 8 e 1). I 4 round sui totali (66 misurati, 62 ricostruiti dalle righe) sono tutti un −20 HEALTH senza riga numerica, il veleno
a timer di «Timer expired …»: è il ripiego previsto da D5, con misura e client d'accordo.

### 2. Mossa rifiutata nelle partite CLI

Il [runner](sb-28/partite-cli.cjs) ora registra **ogni** rifiuto (`rejections` nel JSON e una riga `REJECTED` su stderr) con il motivo del
server, la mossa inviata, il turno, il `gameId` e la vista da cui la mossa è stata scelta. **Seme:** la partita viva non ne ha (`Player`
usa `new Random()`), quindi una posizione si identifica con `gameId`, esportazione e vista registrata; il runner non ha casualità.

**Corse:** 41 da 12 partite (492 partite, tutte all'esito) sul jar della testa. Con il runner di prima (corse 1–20) **3 rifiuti in 2 corse**,
tutti di Duccio e tutti `cant pay health down to zero`: «Craniata Patriottica» (30 H) con 30 HEALTH, «Nocche Sbucciate» (15 H) con 15
HEALTH due volte. Con il runner corretto (corse 21–41) **0 rifiuti**. Riepilogo: [rifiuti-cli.json](sb-28/rifiuti-cli.json).

**Decisione: difetto del runner.** R03 2.0 («Costi pagati con quello che si ha»): un costo in HEALTH non si paga se porterebbe a 0 o sotto,
serve una HEALTH **maggiore** del costo. Il server rifiuta giustamente (`Move.healthCostAllowed`); il runner sceglieva le carte con `>=` su
ogni risorsa. Corretto: per HEALTH serve `>`. Solo le quattro carte di Duccio costano HEALTH (nessuno starter), per questo il caso era raro.

**Trovato di passaggio, non corretto:** il client web ha lo stesso vuoto. `shortfall` (`client-web/src/readability.ts`, commentata «stesso
confronto del server») usa `<` su ogni risorsa, quindi con HEALTH uguale al costo mostra la carta pagabile e il server la rifiuta. Lo stesso
confronto è in `client-web/tools/verify.mjs` (riga 66, O11). Riguarda solo Duccio, cioè gli open con un suo mazzo, non la quick. Domanda 1.

### 3. Jar

Prima della ricostruzione **nessun server era in ascolto sulla 8080** (né sulla 4320): nulla da fermare. `./scripts/build.ps1 -Task Server
-Offline` verde: `server/target/bm-server-0.0.1-SNAPSHOT.jar` delle 14:14 del 24 novembre, senza le classi dello 0.1 spostate nei test.

### Verifiche

| Verifica | Esito |
|---|---|
| `client-web` `Test` | verde: 371 su 371 (i 369 di prima più i 2 nuovi) |
| `client-web` `Build`, `Size` (con `BM_OUT` nella sessione) | verdi; `Size` entro limiti e tetti |
| `VerifyResolution` | **verde** (sopra) |
| `VerifyFfa`, `VerifyDecks` | verdi |
| `VerifyModes` | rosso al primo giro (`B: timeout server answer`), verde al secondo: nuova voce **R8** del [registro dei rossi noti](../rossi-noti.md), strumento (sotto) |
| `./scripts/build.ps1 -Task Test -Offline` | verde: 1501 test, 0 falliti, 23 saltati; client di debug 37 su 37 |
| `./scripts/build.ps1 -Task TestServerContext -Offline` (a parte) | verde: 1699 test, 0 falliti, 23 saltati |
| `python scripts/check-rules.py`, `git diff --check` | verdi |
| `python scripts/check-links.py` | 22 link rotti, come sulla base: nessuno nuovo |
| corsa d'identità 20/2 | non rifatta: nessun file del motore cambiato |

Verifiche del client sul jar costruito dalla testa in una cartella della sessione, server 18080/18081 e anteprima 14321 su database
temporanei; la 8080, la 4320 e `server/target` non sono stati toccati fino alla ricostruzione finale. Evidenze in `%TEMP%` della sessione.

**`VerifyModes`, R8.** Dopo «Conferma» il client può aprire una finestra: «Quale carta cerchi?» (un «Annuncia X o Y» con entrambe nel mazzo)
o «Scartare l'ultima copia?». Lo strumento cerca la prima con un `count()` immediato, in gara con l'apertura, e alla seconda non risponde:
la mossa non parte e dopo 15 s scade l'attesa «server answer». La modifica di questo giro tocca solo la lettura delle righe per le barre,
non questo percorso, e la stessa firma (fase `choose`, messaggio «Controlla la calata e conferma») compare nelle prove della rifinitura,
prima di questa modifica. Non riprovato sulla base: è intermittente e un verde sulla base non proverebbe nulla. Non corretto: lo strumento
non era nel perimetro.

### Scelte prese

- L'etichetta in coda è generica (al più una, tra parentesi), come quella in testa, non legata al testo «ALCOHOL armor».
- Il controllo della pillola resta sul binding `bruiser.ExtremelyViolentBlow`, che è una carta viva: nessuna sostituzione.
- Il riepilogo dei rifiuti in git è minimo (posizione e risorse); le viste intere restano nei JSON della sessione.

### Cosa resta

1. **Domanda 1:** correggere `shortfall` del client e `verify.mjs` per il costo in HEALTH di R03 2.0 (pagabile solo con HEALTH maggiore del
   costo) qui in SB-28 o in SB-31? Oggi tocca solo Duccio negli open.
2. **Domanda 2:** R8 (`VerifyModes`, finestre dopo «Conferma»): correggere lo strumento in un blocco che lo tocca, o lasciarlo nel registro?
3. La partita del proprietario nel client (comandi nella [Fase C](#fase-c); il jar è rifatto) e il push.

## Correzioni piccole (D186)

**Esito: consegnate il 24 novembre 2026, verifiche verdi, nessun push.** Due correzioni decise da D186 (regia del 24 novembre), senza
toccare il server né gli attesi. Domanda 1 e domanda 2 qui sopra hanno avuto risposta: la 1 con la correzione (1), la 2 con la
correzione (2).

### 1. Costo in HEALTH (R03 2.0)

**Causa.** `shortfall` (`client-web/src/readability.ts`) usava `<` su ogni risorsa: con HEALTH uguale al costo mostrava la carta
pagabile e il server la rifiutava (`Move.healthCostAllowed`: con la regola 2.0, un costo in HEALTH richiede HEALTH maggiore del costo).
Lo stesso confronto era in `client-web/tools/verify.mjs` (O11).

**Correzione.** `shortfall` ora usa `have<=cost` per un costo in HEALTH positivo e `have<cost` per le altre risorse; il commento dice
che è il confronto del server. `verify.mjs` usa la stessa regola. Il server non è toccato.

**Eccezione «Ultimo colpo» non portata.** Il server ammette il pagamento a zero con `isLastBlow()`, ma il set vivo non ha
«Ultimo colpo» (`LiveSet` lo rifiuta, D183 (3)) e il client non ha quel campo: il client segue le regole 2.0 senza eccezione.
Se un giorno il client mostrasse regole diverse (`LEGACY`), questo punto va rivisto.

**Test.** `client-web/tests/readability.test.ts`, nuovo «R03 2.0 (SB-28, D186)»: HEALTH uguale al costo è un vuoto; HEALTH sopra il
costo è pagabile; un costo in HEALTH senza HEALTH è un vuoto; altre risorse uguali al costo sono pagabili; costo misto. Il test
non è stato rieseguito contro il codice precedente: per costruzione, col vecchio `<` HEALTH uguale al costo risultava pagabile e
l'asserzione sarebbe caduta.

### 2. R8: `VerifyModes` non aspettava la finestra dopo «Conferma»

**Causa.** Dopo «Conferma» il client apre «Scartare l'ultima copia?» (pulsante «Sì, scarta e gioca», che può aprire «Quale carta
cerchi?»), oppure «Quale carta cerchi?» da sola. Lo strumento cercava «Quale carta cerchi?» con un `count()` immediato e non rispondeva
mai alla finestra «Scartare»: la mossa non partiva e l'attesa «server answer» scadeva dopo 15 s.

**Correzione.** Un helper `answerConfirm(page, moves, before)` in `verify-modes.mjs`, `verify-decks.mjs` e `verify-resolution.mjs`:
dopo «Conferma» attende fino a 5 s (sondaggio ogni 100 ms) che si apra una finestra o che parta l'invio; risponde a «Sì, scarta e
gioca» e a «Quale carta cerchi?» (prima opzione, come prima). Il controllo «exactly one SEND per confirmation» resta com'era; nessuna
asserzione è stata tolta o allentata. `verify-ffa.mjs` non ha il pattern e non è cambiato.

### Verifiche

Ambiente: temporanei. Server 18080 e anteprima 14321 (la 8080 e la 4320 non sono state toccate); server di ogni verifica su
`BM_SERVER_PORT=18080` con database temporanei; evidenze in una cartella della sessione (`BM_OUT`), non in `docs/`. Jar
`server/target` del 24 novembre, 14:14, più recente dell'ultima modifica a `server/src/main` (12:57): nessuna ricostruzione, nessun
file in `server/target` toccato. Client ricostruito in `client-web/dist` (ignorato da git).

| Verifica | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` (client-web) | verde: 372 test, 0 falliti (`readability.test.ts`: 61, con il nuovo test) |
| `VerifyModes`, tre giri di seguito | verdi: exit 0 ×3 |
| `VerifyDecks` (una volta) | verde, exit 0 |
| `VerifyResolution` (una volta) | verde, exit 0 (`reportConsistency` 66 round, `sumOk` 63, `chainOk` 63) |
| `VerifyFfa` (una volta) | verde, exit 0 |
| `tsc --noEmit`, `vite build` | verdi (un avviso di dimensione del chunk, già presente) |

Non è stato rilanciato `VerifyAll`, né `VerifyLayout`/`VerifyAim` (il perimetro era «Verifiche» di questo blocco). Nessun server
(`TestServerContext`, `Test`) è stato lanciato: il server non è cambiato.

### Scelte prese

- Helper duplicato nei tre strumenti invece di un file condiviso, per non allargare il perimetro (un file nuovo in `tools/`).
- Attesa massima 5 s e sondaggio ogni 100 ms; i clic su una finestra hanno timeout di 3 s, così un'eventuale finestra sparita non
  blocca fino al timeout di Playwright.
- R7 del registro: aggiornate le righe `verify-resolution.mjs` (`125–126` → `139–140`), perché l'helper le ha spostate. Nessun altro
  cambio al comportamento dello strumento.

### Cosa resta

- La partita del proprietario nel client (la Fase C) e il push: fuori da questo blocco, non fatti.
- Il client non ha la regola «Ultimo colpo»: se un giorno il client segue `LEGACY`, il controllo HEALTH va rivisto (sopra).

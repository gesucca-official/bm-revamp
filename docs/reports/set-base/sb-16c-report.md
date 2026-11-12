# SB-16c — Regole decise in SB-16b nel playground: rapporto

**Fatto il 12 novembre 2026**, in una sola fase. Domande risposte dal proprietario lo stesso giorno ([D54](../../set-base-plan.md#decisioni-del-proprietario), [sotto](#risposte-del-proprietario)).

Le regole di [D50](../../set-base-plan.md#decisioni-del-proprietario) (punti 1, 2, 3, 5 e 6) sono nel server, dietro un interruttore,
`Ruleset`, che vale `1.13` (il gioco vivo) o `d50` (il playground). Lo accendono solo il profilo `bozza`, che parte con `d50`, e il
runner con `-Dsim.rules=d50`. Il punto 7, l'ordine dei timer, è solo verificato con un test. Il registro del turno dice perché una
mossa è annullata («a terra») e quale carta si è cercata. I bot hanno un'euristica per il ritmo caricare-colpire-parare.

- **Interruttore spento:** la partita è la stessa di prima. Sono verdi i 658 test di prima, con 0 falliti e 7 saltati. Il banco SB-7 è
  identico alla base di SB-16b: il `.md` byte per byte e il `.json` in ogni campo.
- **Interruttore acceso:** gli otto invarianti di partita restano a zero su 480.000 partite. Il banco coincide in ogni campo con la
  misura «P1 + pavimento + corazza L/4» del prototipo di SB-16b, che era scritto in modo indipendente.
- **Tetto delle bound:** con le regole accese ne supera il limite una bound, **CinqueMinutiEVado** di Piera. Con la corazza, il suo
  +10 L diventa anche una parata (vedi [sotto](#cosa-giudica-il-proprietario)).

Regolamento, documento del set, catalogo, descrizioni SQLite, allegato, client e bozza non cambiano (D12, D50). Nessuna carta nuova:
le carte di caricamento e i colpi con «Ultimo colpo» sono di SB-16d.

## Cosa cambia

### L'interruttore

- [`Ruleset`](../../../server/src/main/java/com/gsc/bm/model/game/Ruleset.java), nuovo: `LIVE` (`1.13`) e `D50` (`d50`).
  `Game.useRuleset` lo sceglie prima del primo turno e lo passa ai personaggi. Senza chiamata vale `LIVE`.
- **Profilo `bozza`:** `app.bozza.regole` in [`application-bozza.yml`](../../../server/src/main/resources/application-bozza.yml),
  `d50` di default. `1.13` serve per giocare la bozza con le regole del gioco vivo, un valore sconosciuto ferma l'avvio.
  [`BozzaDraft`](../../../server/src/main/java/com/gsc/bm/bozza/BozzaDraft.java) lo scrive nell'identità della partita archiviata
  (`"rules"`). [`GameFactoryServiceImpl`](../../../server/src/main/java/com/gsc/bm/service/factories/GameFactoryServiceImpl.java)
  applica le regole di `BozzaDraft` se il profilo c'è; senza profilo non c'è `BozzaDraft` e le partite restano `1.13`.
- **Runner:** `-Dsim.rules=d50` (o `1.13`) in
  [`SimulationRunner`](../../../server/src/test/java/com/gsc/bm/sim/SimulationRunner.java), che vale anche per il banco, il tetto
  delle bound, il listino e la ricerca dei mazzi. Il rapporto del banco dichiara le regole («Regole», `"regole"`) solo se non sono
  `1.13`: così il rapporto di oggi resta identico.

### Le regole (solo con `d50`)

1. **Chi è a terra non colpisce** (`Game.resolveMoves`). Il gruppo di velocità riunisce le mosse con la stessa priorità e la stessa
   ALERTNESS dopo i costi, e si fissa insieme all'ordine. All'inizio di ogni gruppo si guarda chi è morto. La mossa di un autore
   morto si annulla, salvo che:
   - bersagli lui stesso (`SELF` o il proprio id), e quindi anche un suo oggetto vicino;
   - la carta abbia «Ultimo colpo».

   Dentro un gruppo le mosse restano simultanee. Una mossa annullata ha già pagato, scarta e pesca; una bound annullata non scarta.
2. **Costi** (`Move.isValidFor`, e la stessa regola in `BotView.legalMoves`). Un costo in HEALTH si paga solo se lascia l'autore
   sopra 0, salvo «Ultimo colpo». Le altre risorse si pagavano già solo con quello che si ha.
3. **Pavimento a zero** (`Character.editResource`): nessuna risorsa scende sotto 0, HEALTH compresa.
4. **Corazza dell'alcol** (`Character.takeDamage`): con ALCOHOL > 0 i HIT ricevuti scendono di L/4, a divisione intera. La riduzione
   vale dopo gli stati, non va sotto 0 e conta anche sui danni a sé. CUT e POISON restano interi. La riga del danno dice quanto ha
   assorbito, ad esempio «(ALCOHOL armor: -5 HIT)».
5. **Ricerca** (`Player.searchCard`, `Game.resolveMoves`). È un passo nuovo del formato della bozza, in
   [`DataCards`](../../../server/src/main/java/com/gsc/bm/sim/DataCards.java):
   `{"op": "search", "card": "<binding>"}`, solo in `self`, una volta per carta, mai in un oggetto o in una basic.
   - Se la mossa si risolve, la pesca che la segue diventa la ricerca della copia più vicina alla cima del mazzo.
   - Se non c'è (già in mano, scartata, assente, mazzo vuoto), si pesca normalmente.
   - Il caricatore controlla che la carta cercata esista nella bozza e che il set la veda.
   - Con `1.13` il passo non fa nulla.

«Ultimo colpo» è il campo `lastBlow` delle carte a dati: si scrive sulla carta, non è una parola chiave (R00, D50). Il metodo
`Card.isLastBlow()` vale `false` per tutte le carte vive e non compare nelle viste.

### Il registro del turno

- **Mossa annullata:** il suo rapporto dice «Didn't do anything! (voided: a terra)» invece di «Didn't do anything!». Il registro degli
  eventi ha la riga «Player … 's Move … is voided: a terra».
- **Ricerca:** il rapporto della mossa ha «Searched the deck for <binding>: found <nome> (shown to everyone)», oppure «…: not in the
  deck, normal draw». La stessa riga va nel registro degli eventi.
- **Dati per i bot e le prove:** `Move` ha `voidReason`, `searchedFor` e `searchFound`, che non entrano nel JSON né in `toString`. Le
  viste del client sono quindi le stesse; il client mostra «(annullata)» come prima e non legge le frasi del rapporto (D12: il motivo nel
  client è di SB-31).

### I bot

`BotView` porta le regole della partita, «Ultimo colpo» sulle carte, e per ogni mossa dell'ultimo turno il motivo dell'annullamento e la
carta trovata, che è pubblica. L'euristica (`StyleSupport.rhythm`) vale per i tre stili e solo con `d50`:
- **Colpo dopo il caricamento:**
  - +20 alla carta che la propria ricerca ha trovato nel turno prima, se è un colpo;
  - +10 a ogni colpo mentre si ha uno stato temporaneo GOOD sull'uscita, cioè un aumento del danno che non è un equipaggiamento.
- **Reazione a un caricamento visibile**, se l'avversario ha mostrato con la ricerca un colpo da almeno 10 o ha un aumento del danno
  temporaneo:
  - +15 alle difese e alle contromosse;
  - mezzo punto per ogni punto di cura.

Sulla bozza di oggi l'euristica non cambia nessuna scelta: nessuna carta cerca e nessuna dà quegli stati. Le scelte sono identiche alla
misura di SB-16b. Lavora sulle carte di SB-16d.

## File toccati fuori da `com.gsc.bm.sim` e dalle carte di bozza

Il blocco tocca il motore, come dichiarato nel piano.

- `server/src/main/java/com/gsc/bm/model/game/Ruleset.java` (nuovo), `Game.java`, `Move.java`, `Player.java`;
- `server/src/main/java/com/gsc/bm/model/Character.java`, `model/cards/Card.java`;
- `server/src/main/java/com/gsc/bm/model/game/bot/BotView.java`, `StyleSupport.java`;
- `server/src/main/java/com/gsc/bm/bozza/BozzaDraft.java`, `server/src/main/resources/application-bozza.yml`;
- `server/src/main/java/com/gsc/bm/service/factories/GameFactoryServiceImpl.java`;
- test nuovi: `server/src/test/java/com/gsc/bm/bozza/BozzaRulesetTest.java`.

Dentro `com.gsc.bm.sim`:
- `DataCards.java` (passo `search`, campo `lastBlow`) e `Draft.java` (controllo della carta cercata), nei sorgenti principali;
- `SimulationRunner.java`, `Bench.java` e `BenchReport.java` (interruttore e dichiarazione), e `RegoleD50Test.java` (nuovo), nei test.

**Nessun atteso di un test esistente è cambiato**, e nessun test esistente è toccato. `BozzaDraft` tiene il costruttore di prima, che
usa `d50`.

## Test di conformità

[`RegoleD50Test`](../../../server/src/test/java/com/gsc/bm/sim/RegoleD50Test.java), 27 test, e
[`BozzaRulesetTest`](../../../server/src/test/java/com/gsc/bm/bozza/BozzaRulesetTest.java), 3 test. Per ogni caso del «Completamento
verificabile»:

| Caso | Test |
|---|---|
| Colpo di un autore già a terra, annullato (e con `1.13` arriva) | `theHitOfAnAuthorAlreadyDownIsVoided` |
| Cura su di sé che lo salva (D48) | `aHealOnSelfStillSavesTheAuthorDown` |
| Colpo reciproco nello stesso gruppo: patta, nessuno spareggio | `mutualHitsInTheSameSpeedGroupStaySimultaneous` |
| Stessa priorità, A diversa: due gruppi | `sameSpeedButMoreAlertnessIsAnotherGroup` |
| Bound annullata che non scarta (mano piena: non pesca) | `aVoidedBoundDoesNotDiscard` |
| Costo in HEALTH che porterebbe a 0, rifiutato (e legale per i bot solo se lo è per il motore) | `aHealthCostThatWouldBringToZeroIsRefused` |
| Accettato con «Ultimo colpo», che si risolve a terra | `ultimoColpoPaysDownToZeroAndResolvesFromTheGround`, `ultimoColpoAlsoResolvesWhenDownedByAFasterHit` |
| Risorse che non scendono sotto zero (V, HEALTH, A per l'alcol a fine turno) | `resourcesDoNotGoBelowZero` |
| Corazza sui HIT e non su CUT e POISON, divisione intera, non sotto zero | `alcoholArmorReducesHitsOnly` |
| Corazza dopo gli stati | `alcoholArmorComesAfterStatuses` |
| Corazza anche sui danni a sé | `alcoholArmorAlsoOnDamageToSelf` |
| Ricerca: carta trovata e mostrata all'avversario | `searchFindsTheCardInTheDeckAndShowsIt` |
| Ricerca: carta già in mano, già scartata o assente | `searchedCardAlreadyInHand`, `searchedCardAlreadyDiscarded`, `searchedCardAbsentFromTheDeck` |
| Ricerca: mazzo vuoto (arriva la last resort) | `searchWithAnEmptyDeckGivesTheLastResort` |
| Ricerca: oggetto trovato | `searchFindsAnItem` |
| Carta cercata scartata con una bound | `searchCardDiscardedWithABoundDoesNotSearch`, `foundCardDiscardedWithABoundLeavesTheHand` |
| Due ricerche nello stesso turno | `twoSearchesInTheSameTurn` |
| Ricerca di chi è a terra | `searchOfAnAuthorDown` |
| Ricerca con `1.13`: niente | `withTheLiveRulesTheSearchStepDoesNothing` |
| Passo `search` e campo `lastBlow` nel posto sbagliato, rifiutati alla lettura | `theDraftRefusesAMisplacedSearch` |
| Punto 7: timer che scadono nello stesso turno, in ordine di creazione | `timersExpiringInTheSameTurnRunInCreationOrder` |
| Bot: colpo dopo il caricamento | `botsPlayTheHitAfterTheirCharge` |
| Bot: parata davanti a un colpo mostrato, attacco se il mostrato non colpisce | `botsBraceForAVisibleCharge` |
| Profilo `bozza` con `d50` di default, `1.13` a richiesta, valore sconosciuto rifiutato | `theProfileBozzaPlaysD50UnlessToldOtherwise` |
| Partite del profilo con `d50`, partite vive con `1.13` | `gamesFollowTheProfileAndLiveGamesStayLive` |

**Due letture mie, da confermare** (domande 1 e 2):
- **Oggetto trovato:** va sul campo, come quando si pesca, e la pesca continua normalmente, perché un oggetto non riempie la mano.
- **Carta cercata scartata con una bound:** l'ho letta in due modi, e li ho provati tutti e due.
  - La carta di ricerca usata come scarto di una bound non si risolve, quindi non cerca: la bound pesca normalmente.
  - La carta trovata, scartata più tardi da una bound, esce dalla mano come qualunque carta.

**Mutazioni.** Dieci, tutte sulla logica nuova; ognuna fa fallire almeno un test. Elenco ed esito in
[`sb-16c/mutazioni.txt`](sb-16c/mutazioni.txt).

## Banco SB-7

Comando, dalla cartella `server` con gli strumenti di `.tools` (script in [`sb-16c/bench.ps1`](sb-16c/bench.ps1)):

```text
mvn -s ../scripts/maven-settings.xml -Dmaven.repo.local=../.tools/m2 -B -o -q test -Dtest=BenchMeasureTest#matrix
    -Dsim.bench=2000 -Dsim.draft=src/test/resources/set-base/bozza.json -Dsim.styles=aggressivo,prudente,risorse,com
    -Dsim.note=<nota> [-Dsim.rules=d50 -Dsim.strict=true]
```

Sono 2000 partite per cella, 240 celle e 480.000 partite, primo seme 7.000.000. Bozza `c43b37a5…de842cda`, la stessa di SB-16b. Circa
un minuto a giro su 32 thread.

- **Interruttore spento.** Il confronto è con la base di SB-16b ([`sb-16b/banco/base/`](sb-16b/banco/base/)), misurata su `7829b8f`:
  da allora il server non è cambiato. Con la stessa nota, il `.md` è **identico byte per byte**. Il `.json` è uguale in ogni campo una
  volta letto: quello di SB-16b è minificato, quindi i byte differiscono. Le celle sono 240 su 240, con invarianti a zero.
- **Interruttore acceso** (`-Dsim.rules=d50 -Dsim.strict=true`).
  - **Invarianti:** gli otto di partita sono a zero su 480.000 partite e 12,9 milioni circa di turni di giocatore. Senza mosse, mossa
    vuota, bound gratuite, basic e bound in mano, last resort in mano e giocabile, bound giocabile, limite di turni.
  - **Confronto col prototipo:** il `.json` è uguale in ogni campo, intestazione esclusa, a quello di SB-16b «P1 + pavimento + corazza
    L/4» ([`sb-16b/fase-b/banco/alcol4/`](sb-16b/fase-b/banco/alcol4/)). Le due implementazioni sono indipendenti e danno le stesse
    partite. I costi e la ricerca non toccano la bozza di oggi, che non ha costi in HEALTH né ricerche.
  - **Esito:** il modo rigoroso esce rosso per il **tetto delle bound**, che è un controllo statico sulla bozza e non un invariante di
    partita. Lo supera CinqueMinutiEVado, con valore per uso 8,50 contro il tetto 4 (era 3,50), perché la corazza le dà 5 di «parato» per
    uso. Lo stesso valore c'è già nella misura di SB-16b, che non girava in modo rigoroso.

| Variante | Patte | Turni medi | Quota del primo posto |
|---|---:|---:|---:|
| `1.13` (interruttore spento) | 16,9% | 13,54 | 0,503 |
| `d50` (interruttore acceso) | 11,2% | 13,65 | 0,501 |

Matchup e mazzi nelle due varianti: [`sb-16c/confronto.md`](sb-16c/confronto.md). Rapporto del banco acceso:
[`sb-16c/banco-d50/`](sb-16c/banco-d50/).

## Verifiche

Tutte sul codice finale, il 12 novembre 2026:
- `./scripts/build.ps1 -Task Test -Offline`: verde.
  - Server: 688 test, 0 falliti, 7 saltati (le misure a richiesta). Sono i 658 di prima più i 30 nuovi.
  - client-debug: 37 su 37.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: verde, 805 test, 0 falliti, 7 saltati. Il rosso noto R3 non si è presentato.
- `python scripts/check-rules.py`: verde. Regolamento 1.13 e Set Base 0.1 allineati, 39 carte e un token, SQLite integro.
- `python scripts/verify-match-manifests.py`: `allChecks: PASS`.
- `python scripts/check-links.py`: 0 link rotti su 266 file.
- `git diff --check`: verde.
- Banco SB-7, spento e acceso, e dieci mutazioni: [sopra](#banco-sb-7) e [sopra](#test-di-conformità).

Non rilanciate, perché il blocco non tocca il client web: le verifiche di `client-web` (`Test`, `Build`, `Size`) e le Playwright.

## Rossi

- **Nessun rosso nuovo**, e nessuna voce del registro dei rossi noti si è presentata.
- **Tetto delle bound a interruttore acceso:** non è un rosso del blocco, ma un effetto atteso di D50, punto 5, su una carta della
  bozza (domanda 3). A interruttore spento il tetto è rispettato come prima.

## Cosa non è verificato

- **Nessuna partita umana** col profilo `bozza` e le regole nuove; l'avvio del profilo `bozza` è coperto solo dai test e da
  `TestServerContext`.
- **La ricerca e «Ultimo colpo» non sono misurati sul banco**: nessuna carta della bozza li usa. Si misurano con le carte di SB-16d
  in SB-16e.
- **L'euristica dei bot** è provata solo su posizioni costruite: sulla bozza di oggi non scatta. Il suo peso si vedrà in SB-16e.
- **L'FFA** con le regole nuove non è provato. Il gruppo di velocità e la ricerca non dipendono dal numero di giocatori, ma nessun test
  li gioca in tre o quattro.
- **Il client** mostra «(annullata)» e non il motivo; la carta cercata si vede solo come carta pescata dal suo giocatore. Il rapporto
  della mossa c'è, ma il client non legge le frasi (SB-31).

## Cosa giudica il proprietario

1. **Oggetto trovato dalla ricerca:** va sul campo e la pesca continua, come quando un oggetto si pesca. Va bene?
2. **«Carta cercata scartata con una bound»:** l'ho provata nei due sensi. Se intendevi un terzo caso, dimmelo.
3. **CinqueMinutiEVado oltre il tetto delle bound con la corazza:** +10 L per uso diventa anche una parata di 2–3 HIT a colpo. È un
   tema di bilanciamento per SB-16d e SB-16e, non del motore. Si corregge la bound, o si contano diversamente nel tetto le risorse che
   diventano difesa?
4. **Il profilo `bozza` parte con `d50`.** Le prove umane sulla bozza giocano con le regole nuove; per tornare alle 1.13 basta
   `app.bozza.regole: 1.13`. Va bene come predefinito?

## Risposte del proprietario

12 novembre 2026, registrate come [D54](../../set-base-plan.md#decisioni-del-proprietario) con le sue parole. Nessun cambio al codice.

1. **Oggetto trovato:** A, va sul campo e la pesca continua. Il proprietario non crede che ci saranno caricamenti che cercano oggetti.
2. **Bound:** entrambe le letture sono corrette. Il caricamento è un effetto che possono avere varie carte, anche i colpi, non un tipo
   di carta. Serve a informare l'avversario: ho una carta potente e posso giocarla, ma sono vulnerabile, quindi scegli se colpire o
   difenderti.
3. **CinqueMinutiEVado:** A, si corregge la carta in SB-16d; il controllo del tetto resta.
4. **Profilo `bozza` con `d50`:** A.

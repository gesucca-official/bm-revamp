# SB-16g, Fase 2a — Carta scoperta e vulnerabilità legata alla copia

13 novembre 2026. Base `2a0c9ca`. Autorizzata da [D68](../../set-base-plan.md#decisioni-del-proprietario) (divisione 2a/2b) con
[D58](../../set-base-plan.md#decisioni-del-proprietario), [D59](../../set-base-plan.md#decisioni-del-proprietario) e D64–D66.
Tutto il comportamento nuovo vale solo con le regole `d50` (profilo `bozza`, runner): con le regole vive 1.13 la partita è identica.
Non toccati: regolamento, `docs/sets`, catalogo, SQLite, `bozza.json`, la [proposta](../../design/set-base/sb-16g-proposta.md)
(aggiornata in parallelo da un altro esecutore), client-debug. Nessuna carta nuova o cambiata: sono di 2b.

## Cosa cambia

### Motore (server)

**Identità della copia (D58).** Le carte sono uguali per nome (`AbstractCard.equals`), quindi il legame usa l'identità
dell'oggetto. Quando la ricerca trova una carta che va in mano, [Game](../../../server/src/main/java/com/gsc/bm/model/game/Game.java)
le dà un numero (`revealSerial`, un contatore per partita) e la registra fra le carte scoperte del giocatore
([Player](../../../server/src/main/java/com/gsc/bm/model/game/Player.java), `Revealed(id, card, turn)`). Resta scoperta finché
quella precisa copia esce dalla mano, giocata o scartata. Giocare o scartare un'omonima non la libera.

- `Player.discardCard` ora toglie la carta per identità (con ripiego sul nome). Con le regole vive il risultato è lo stesso di prima:
  le omonime sono indistinguibili.
- **Ripiego dichiarato.** Il protocollo sceglie la carta per nome. Con più omonime in mano, `getCardFromHand` con le regole `d50` dà
  per prima la copia scoperta più vecchia. Non c'è un selettore della copia nel comando: giocare la copia scoperta conviene sempre
  (libera la vulnerabilità e non rivela altro), quindi la scelta automatica coincide con quella migliore. Domanda 1.
- Un oggetto trovato va sul campo (D54) e non diventa una copia scoperta.

**Vulnerabilità F (D59, D64–D66).** Nuovo passo dei dati: `vulnerability` dentro il passo `search` di una carta della bozza
([DataCards](../../../server/src/main/java/com/gsc/bm/sim/DataCards.java)), per esempio
`{"op":"search","card":"x.Colpo","vulnerability":{"factor":1.5,"minTurns":2}}`. Campi
([Vulnerability](../../../server/src/main/java/com/gsc/bm/model/game/status/Vulnerability.java)): `factor` (dalla carta), `minTurns`
(2 per D59), `damage` facoltativo (predefinito HIT, CUT e POISON, D64). Il formato si convalida come gli altri passi.

- Il caricamento risolto, non annullato, mette su chi lo gioca uno stato «Vulnerable» per tipo di danno, BAD e INPUT, col fattore
  della carta. I tre stati condividono un `exposure`; `lastsForTurns = minTurns - 1`, quindi il turno del caricamento e il successivo.
- Se la ricerca trova la copia, lo stesso numero lega vulnerabilità e copia (`heldBy`). Uno stato tenuto non scade: a fine minimo si
  ferma a -1 e resta finché la copia è in mano.
- Quando la copia esce, il legame si scioglie **alla fine del gruppo di velocità** in cui è uscita (D50, punto 1: le mosse dello
  stesso gruppo sono simultanee), non nell'istante dello scarto. Se il minimo è finito lo stato si toglie subito; se no resta fino
  alla fine del minimo (uscita anticipata, D59). Domanda 2.
- Più vulnerabilità sono stati indipendenti e i fattori si moltiplicano come per gli altri stati (D66): due ×1,5 danno ×2,25.
- Una ricerca fallita lascia solo il minimo: nessun legame con le carte già in mano o pescate (D65).
- Un caricamento annullato (per esempio «a terra») non dà né vulnerabilità né ricerca. Un colpo parato o annullato esce comunque dalla
  mano e scioglie il legame. Una bound annullata non scarta e il legame resta (D65).
- A fine partita, all'eliminazione del giocatore e al forfait tutte le sue copie scoperte e tutti i suoi legami si tolgono (`dropRevealed`).
  Il vincitore non cambia. Domanda 3.
- Lo stato è parte della partita, quindi la vista si ricostruisce identica alla riconnessione e dopo `restoreFrom` (la serializzazione
  Java conserva l'identità degli oggetti).

**Vista e protocollo** ([api.md](../../api.md)). Campi nuovi, tutti assenti quando sono vuoti, quindi sempre assenti con le regole vive:

- `revealed` nella vista di ciascun giocatore ([RevealedCardView](../../../server/src/main/java/com/gsc/bm/service/view/model/client/RevealedCardView.java):
  `copy`, `card`, `turn`; `slot`, l'indice in `cardsInHand`, solo nella propria vista). La mano avversaria resta un numero:
  dell'avversario si vede solo la copia scoperta, nient'altro della mano o del mazzo.
- `search.copy` nella mossa risolta: la stessa identità della copia scoperta.
- Negli stati: `exposure`, `factor`, `heldBy`.

**Bot** ([BotView](../../../server/src/main/java/com/gsc/bm/model/game/bot/BotView.java)). La vista dei bot legge le carte scoperte
proprie e altrui (`RevealedSeen`) e i campi della vulnerabilità. Nessuna politica cambiata: usarle è lavoro di 2b.

### Client web

- [contracts.ts](../../../client-web/src/contracts.ts): i campi del protocollo.
- [scene.ts](../../../client-web/src/scene.ts): nel ventaglio dell'avversario la copia scoperta è disegnata **a faccia in su** al posto
  di un dorso, della stessa misura, all'estremità destra del ventaglio, con contorno e fascia color petrolio «SCOPERTA» (con il fattore se tiene una vulnerabilità, «SCOPERTA ×1,5»). Si solleva
  al passaggio e si apre nell'ispezione come ogni carta. Nella propria mano la stessa fascia sta sulla copia scoperta (trovata per
  identità tramite `slot`). Durante la sequenza del round una carta scoperta in quel round compare solo a sequenza finita, così non
  anticipa la pescata a faccia in su di SB-16f0.
- [readability.ts](../../../client-web/src/readability.ts): i tre stati di una vulnerabilità sono **un solo gettone** accanto agli altri
  stati, «Stato negativo: Vulnerabile ×1,5». Il testo dice tipi di danno, fattore e durata nella forma delle altre durate: «Almeno per
  1 turno dopo questo, poi finché «X», la carta scoperta, resta in mano»; a minimo finito il gettone mostra «∞» e dice «Il minimo è
  finito: dura finché …» (domanda 4). Con due vulnerabilità ci sono due gettoni e il testo aggiunge «Più vulnerabilità si moltiplicano.».
- [table.tsx](../../../client-web/src/table.tsx): l'ispezione di una carta scoperta ha una nota: di chi è, quando è stata trovata, che
  la vedono tutti, quale vulnerabilità tiene.

Il colore non porta da solo informazioni: fascia, gettone e nota sono scritti. Nessuna animazione nuova.

## Attesi cambiati e decisione

Uno solo. In [RegoleD50Test](../../../server/src/test/java/com/gsc/bm/sim/RegoleD50Test.java) il test della ricerca trovata (SB-16f0)
fissava i campi di `search` a `card`, `found`, `revealed`. Per **D58** diventano `card`, `found`, `revealed`, `copy`, e il test ora
controlla anche che `copy` coincida con la copia scoperta nella vista. Le altre asserzioni (nessun nome della mano o del mazzo
dell'autore nella vista avversaria) restano.

## Test nuovi

**Server**, [VulnerabilitaD59Test](../../../server/src/test/java/com/gsc/bm/sim/VulnerabilitaD59Test.java), 23 test su partite vere
con le regole `d50` e carte di prova costruite nel test (bozza del repository non usata). Il danno si misura con un pugno HIT 10 da
un altro giocatore, quindi 15 vuol dire ×1,5 attiva e 10 vuol dire nessuna vulnerabilità.

| Caso del prompt | Test |
|---|---|
| Minimo dei due turni | `aFailedSearchLeavesOnlyTheMinimumOfTwoTurns`, `theVulnerabilityMultipliesHitCutAndPoison`, `theDamageTypesComeFromTheCard` |
| Uscita anticipata | `anEarlyExitStillKeepsTheMinimum`; tenuta oltre il minimo `theCopyHoldsTheVulnerabilityUntilItLeavesTheHand`; uscita dentro un gruppo, con i due ordini dei posti, `insideASpeedGroupTheExitWaitsForTheEndOfTheGroup` |
| Copia omonima | `aSameNameCopyNeitherRevealsNorReleases`, `playingByNameTakesTheFaceUpCopyFirst` |
| Bound che scarta, bound annullata | `aBoundThatDiscardsTheFoundCopyReleasesIt`, `aVoidedBoundDoesNotDiscardAndKeepsTheLink`; inoltre `aVoidedStrikeStillLeavesTheHandAndReleases`, `aVoidedChargeGivesNeitherVulnerabilityNorSearch` |
| Due legami cumulati | `twoLinksMultiplyAndEndOneAtATime` (22 = 10 × 1,5 × 1,5 troncato, poi 15, poi 10) |
| Ricerca fallita | `aFailedSearchLeavesOnlyTheMinimumOfTwoTurns`, `aFailedSearchDoesNotBindACopyAlreadyInHand`, `aFailedSearchAfterASuccessfulOneDoesNotRenewTheOldLink` |
| Riconnessione | `theViewIsRebuiltFromTheMatchAtReconnection` (vista uguale prima e dopo serializzazione e `restoreFrom`, e il legame continua a funzionare) |
| Fine della partita | `theEndOfTheMatchDropsEveryLink`, `theEliminationOfTheOwnerDropsItsLinksWithoutChangingTheWinner`, `aForfeitEndsTheMatchAndDropsTheLinks` |
| Regole vive, vista, bot, formato | `withTheLiveRulesNothingChanges`, `theLiveStatusesKeepTheirShapeInTheView`, `theBotViewReadsTheFaceUpCards`, `theDraftFormatDescribesSearchVulnerabilityFactorAndMinimum` |

**Client**, [revealed.test.ts](../../../client-web/tests/revealed.test.ts), 7 test sulle viste reali registrate in
`resolution-views.json` con l'aggiunta dei soli campi nuovi: un gettone per vulnerabilità accanto agli altri stati; durata e minimo
finito; ricerca fallita; due vulnerabilità; nota della carta scoperta (propria e altrui, fattore della sola copia che la tiene);
il modello accetta le viste con carte scoperte e la mano avversaria resta un numero; riepilogo del round invariato; con le regole vive
nessun campo nuovo in nessuna registrazione.

## Verifiche

Una alla volta, nell'ordine della tabella.

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | Server **741 test, 0 falliti/errori, 10 saltati** (718 + 23); check-rules verde dentro la build; client-debug **37/37** |
| Banco SB-7 a regole 1.13 (`BenchMeasureTest#matrix`, 2000 partite per cella, 4 stili, `bozza.json`) prima e dopo la modifica | **Identico byte per byte**: stesso JSON e stesso testo, 240 celle, 480.000 partite, invarianti a zero |
| Mutazioni server ([mutations-server.json](sb-16g-2a/mutations-server.json)) | **8/9 rilevate**, sorgente ripristinato. La nona («vulnerabilità anche da un caricamento annullato») è **equivalente**: una mossa annullata non esegue il passo `search`, quindi non chiede la vulnerabilità e il controllo nel motore è una guardia ridondante. Sostituita da «minimo di un turno in più», rilevata |
| Mutazioni client ([mutations-client.json](sb-16g-2a/mutations-client.json)) | **5/5 rilevate**, sorgente ripristinato. Due erano sopravvissute al primo giro: test rafforzato (conteggio dei gettoni) e codice semplificato (una copia tiene al più una vulnerabilità), poi rilevate |
| Avvio reale del profilo bozza (jar, `local,bozza`, database temporaneo, client sulla 4320) | Partito; partite quick 1vCom giocate dall'interfaccia, nessun errore di pagina ([captures-reale.json](sb-16g-2a/captures-reale.json)) |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **858 test, 0 falliti/errori, 10 saltati** (835 + 23), 8:11 min. Le righe `MATCH_ARCHIVE_WRITE_FAILED` del log sono scenari di guasto voluti dai test. R3 non è comparso |
| `python scripts/check-rules.py` | Verde, regolamento 1.13 e Set Base 0.1, SQLite integro |
| `./client-web/run.ps1 -Task Test` | **345/345** (338 + 7) |
| `./client-web/run.ps1 -Task Build` | Verde, solito avviso del bundler sui chunk |
| `./client-web/run.ps1 -Task Size`, `BM_OUT` in TEMP | JS gzip **351.880 byte** (+1.223 su SB-16f0), totale **1.762.036**, texture **27.729.048**; limiti e tetto C4 rispettati; `docs/reports/client-c2/size.json` non toccato |
| `python scripts/check-links.py` | **293 file, 0 link rotti** |
| `git diff --check` | Verde, compresi i file nuovi |

## Catture sul profilo bozza

Script [captures.mjs](sb-16g-2a/captures.mjs), adattato da quello di SB-16f0: jar col profilo `local,bozza` su un database temporaneo,
Edge a 1366×768, movimento ridotto, specchio Spazienzio contro Spazienzio (`aggressivo`). Gioca prima il caricamento e tiene il colpo
trovato, così la copia resta scoperta per qualche turno.

La bozza del repository non ha ancora carte con `vulnerability` (sono di 2b). Per le catture della vulnerabilità ho usato una **copia
temporanea della bozza, fuori dal repository** (`%TEMP%\sb16g2a\bozza-vulnerabilita.json`, passata con `app.bozza.sources`), in cui
PAZIENZA: FINITA (bruiser.Glare) perde il suo stato HIT e ha `vulnerability {factor:1.5, minTurns:2}` sul passo `search`. Non è una
proposta di carta: serve solo a vedere il funzionamento. Esiti in [captures-vulnerabilita.json](sb-16g-2a/captures-vulnerabilita.json).

1. [La propria copia scoperta](sb-16g-2a/1-propria-scoperta.jpg): GARGANTUESCO IMPATTO SUL TU in mano con la fascia «SCOPERTA».
   Bozza del repository.
2. [La copia scoperta dell'avversario, ispezionata](sb-16g-2a/2-avversario-ispezione.jpg): la carta del computer a faccia in su nel suo
   ventaglio di dorsi, aperta nell'ispezione intera con la nota «Carta scoperta: Computer l'ha trovata con una ricerca al turno …».
3. [Copie scoperte e vulnerabilità sui due lati](sb-16g-2a/3-scoperte-con-vulnerabilita.jpg): turno 4, entrambi hanno caricato e
   tengono il colpo: fascia «SCOPERTA ×1,5» sulla propria copia e su quella del computer, a destra del suo ventaglio; sui due
   personaggi il gettone della vulnerabilità «▼ 0», l'ultimo turno del minimo.
4. [Vulnerabilità tenuta oltre il minimo](sb-16g-2a/4-vulnerabilita-tenuta.jpg): il gettone «∞» col testo «Il minimo è finito: dura
   finché «GARGANTUESCO IMPATTO SUL TU», la carta scoperta, resta in mano.».
5. [Ispezione della propria copia che tiene la vulnerabilità](sb-16g-2a/5-ispezione-propria-vulnerabilita.jpg).

Le catture precedono una semplificazione di `revealedNote` (`find` al posto di un prodotto su più vulnerabilità per copia) che non
cambia nulla di visibile, perché una copia tiene al più una vulnerabilità. Le PNG originali restano in `%TEMP%\sb16g2a`. Evidenze
del blocco: circa 1,1 MB.

## Rossi

Nessuno. R3 ([registro](../rossi-noti.md)) non è comparso in questo giro di `TestServerContext`. Nessun rosso nuovo.

## Non verificato

- FFA: le carte scoperte e i gettoni sono disegnati per ogni avversario, ma non ho catture né Playwright in FFA.
- 750×292 e le matrici Playwright (`Verify`, `VerifyLayout`, `VerifyResolution`): non eseguite, come in SB-16f0 (`Verify` non gira
  sulla bozza). Con le regole vive i campi mancano e il disegno non cambia. Con la bozza la copia scoperta prende il posto di un dorso
  della stessa misura, ma a 750×292 non ho guardato se fascia e testo restano leggibili.
- Movimento normale: catture solo col movimento ridotto. La copia scoperta in un round compare a sequenza finita; non l'ho guardata
  con l'animazione intera.
- Partite umane: le catture sono partite pilotate dallo script.
- La politica dei bot non usa ancora le carte scoperte (2b).

## Cosa giudica il proprietario

- Le catture: si capisce a colpo d'occhio quale carta dell'avversario è scoperta e che cosa tiene?
- Le quattro scelte delle domande, prese da me dove le decisioni non dicevano il dettaglio.

## Domande numerate al proprietario

1. **Copia giocata per nome.** Il comando sceglie la carta per nome; con più omonime in mano esce per prima la copia scoperta più
   vecchia. Va bene questo ripiego, o vuoi poter scegliere quale copia giocare (selettore nel protocollo e nel client)?
2. **Uscita nel gruppo di velocità.** Se la copia esce nello stesso gruppo di un colpo che ti raggiunge, quel colpo è ancora
   moltiplicato: il legame si scioglie a fine gruppo, perché le mosse del gruppo sono simultanee. Va bene?
3. **Fine partita ed eliminazione.** Tutte le copie scoperte e i legami del giocatore si tolgono; il risultato non cambia. Va bene?
4. **Gettone «∞».** A minimo finito il gettone della vulnerabilità mostra «∞» al posto dei turni e il testo dice che dura finché la
   copia resta in mano. Va bene il simbolo?
5. **Passo a 2b.** Prima delle carte nella bozza la proposta va ripresentata con le coppie concrete (D68). Procedo quando la proposta
   aggiornata è approvata?

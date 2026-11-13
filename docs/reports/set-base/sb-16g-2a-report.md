# SB-16g, Fase 2a — Carta trovata a faccia in su e gettone di vulnerabilità

13 novembre 2026. Base `2a0c9ca`. Autorizzata da [D68](../../set-base-plan.md#decisioni-del-proprietario) (divisione 2a/2b) con
D58 e D64–D66; **rivista da [D69](../../set-base-plan.md#decisioni-del-proprietario)**, domande chiuse da
[D70](../../set-base-plan.md#decisioni-del-proprietario).

**Storia.** La prima consegna (`41ffadf`) legava la vulnerabilità alla copia esatta, con il minimo di due turni di D59. Alla
consegna il proprietario ha confermato le domande, «però»: la carta scoperta è un promemoria; il gettone sta sul giocatore, è legato
al **nome** e non ha timer. Le risposte di dettaglio sono in D69 (`9e4efce`). Questa revisione rifà motore, vista, client, test,
catture e rapporto. In `41ffadf` restano solo come storia: il legame alla copia, il minimo, la preferenza della copia scoperta
nella giocata per nome e lo scarto per identità. Le due domande di questa revisione hanno avuto risposta in D70 (`1daac7f`):
durata della ricerca fallita confermata; una ricerca non può cercare un oggetto, ora rifiutato dal caricatore della bozza.

Tutto il comportamento nuovo vale solo con le regole `d50` (profilo `bozza`, runner): con le regole vive 1.13 la partita è identica.
Non toccati: regolamento, `docs/sets`, catalogo, SQLite, `bozza.json`, la [proposta](../../design/set-base/sb-16g-proposta.md)
(aggiornata in parallelo da un altro esecutore), client-debug. Nessuna carta nuova o cambiata: sono di 2b.

## Cosa cambia (D69)

### Motore (server)

**Formato.** Nuovo campo `vulnerability` dentro il passo `search` di una carta della bozza
([DataCards](../../../server/src/main/java/com/gsc/bm/sim/DataCards.java),
[Vulnerability](../../../server/src/main/java/com/gsc/bm/model/game/status/Vulnerability.java)), per esempio
`{"op":"search","card":"x.Colpo","vulnerability":{"factor":1.5,"turnsIfNotFound":2}}`:

- `factor`: il fattore scritto sulla carta;
- `turnsIfNotFound`: la durata del gettone se la ricerca fallisce, contando il turno del caricamento; 2 vuol dire questo turno e il
  successivo;
- `damage`: facoltativo, per predefinito HIT, CUT e POISON (D64).

Il formato si convalida come gli altri passi.

**Il gettone** ([Game](../../../server/src/main/java/com/gsc/bm/model/game/Game.java)). Quando il caricamento si risolve e non è
annullato, mette su chi lo gioca un gettone di vulnerabilità. È uno stato «Vulnerable» per tipo di danno, BAD e INPUT, con il
fattore della carta e un id comune.

- **Ricerca riuscita (D69 a).** Il gettone è legato al **nome** della carta trovata (`untilPlayed`) e **non ha timer**
  (`lastsForTurns` null). Finisce quando il giocatore gioca una carta con quel nome: la copia trovata o un'altra, già in mano o pescata
  dopo. Conta anche se la mossa è parata o annullata. Lo scarto non lo toglie: se la copia trovata viene scartata, il gettone resta
  finché una carta con quel nome non viene giocata.
- **Ricerca fallita (D69 b).** Il gettone non è legato a nessuna carta e dura come uno stato normale: il turno del caricamento e il
  successivo. Giocare una carta con il nome cercato non lo tocca.
- **Più gettoni (D69 c, D66).** Sono stati indipendenti e i fattori si moltiplicano: due ×1,5 danno ×2,25. Una carta giocata toglie un
  solo gettone con il suo nome, il più vecchio.
- Il gettone di una carta giocata se ne va **alla fine del gruppo di velocità** di quella giocata (domanda 2 confermata): le mosse
  dello stesso gruppo sono simultanee (D50, punto 1), quindi un colpo dello stesso gruppo è ancora moltiplicato.
- Un caricamento annullato non dà né gettone né ricerca. A fine partita, all'eliminazione e al forfait i gettoni e le carte trovate
  del giocatore si tolgono; il risultato non cambia (domanda 3 confermata).
- **Nessuna ricerca di oggetti (D70).** Il caricatore della bozza ([Draft](../../../server/src/main/java/com/gsc/bm/sim/Draft.java))
  rifiuta un passo `search` che indica un oggetto: «una ricerca non può cercare un oggetto (D70)». La bozza attuale non ne ha. Il
  motore conserva il comportamento di D54 (oggetto trovato sul campo, gettone a tempo), che una bozza valida non raggiunge più.

**La carta trovata a faccia in su (D58, D69 d)** ([Player](../../../server/src/main/java/com/gsc/bm/model/game/Player.java)). È
una vista, non uno stato fisico della carta. La copia trovata ha un id (lo stesso del suo gettone) e si mostra a tutti nella mano del
giocatore. Smette di mostrarsi quando il giocatore gioca una carta con il suo nome, perché l'informazione è spesa anche se ha giocato
un'altra copia, oppure quando quella copia esce dalla mano, per esempio con uno scarto. Le altre copie con lo stesso nome restano
coperte. Una ricerca senza `vulnerability` (oggi tutte quelle della bozza) mostra la carta allo stesso modo.

`Player.discardCard` e `Game.getCardFromHand` tornano come alla base: con il gettone legato al nome non serve più sapere quale copia
esce.

**Vista e protocollo** ([api.md](../../api.md)). Campi nuovi, tutti assenti quando sono vuoti, quindi sempre assenti con le regole vive:

- `revealed` nella vista di ciascun giocatore ([RevealedCardView](../../../server/src/main/java/com/gsc/bm/service/view/model/client/RevealedCardView.java)).
  Contiene `copy`, `card`, `turn` e, solo nella propria vista, `slot`, l'indice in `cardsInHand`. La mano avversaria resta un
  numero: dell'avversario si vede solo la carta trovata, nient'altro della mano o del mazzo.
- `search.copy` nella mossa risolta: l'id della carta trovata.
- Negli stati del gettone: `exposure` (l'id), `factor`, `untilPlayed`.

La vista è funzione dello stato della partita, quindi si ricostruisce uguale alla riconnessione e dopo `restoreFrom`.

**Bot** ([BotView](../../../server/src/main/java/com/gsc/bm/model/game/bot/BotView.java)). La vista dei bot legge le carte a faccia
in su proprie e altrui e i campi del gettone. Nessuna politica cambiata: usarli è lavoro di 2b.

### Client web

- [contracts.ts](../../../client-web/src/contracts.ts): i campi del protocollo.
- [scene.ts](../../../client-web/src/scene.ts), disegno invariato rispetto alla prima consegna:
  - nel ventaglio dell'avversario la carta trovata è **a faccia in su** al posto di un dorso, della stessa misura, all'estremità
    destra, con contorno e fascia «SCOPERTA», oppure «SCOPERTA ×1,5» se ha un gettone; si solleva al passaggio e si apre
    nell'ispezione;
  - nella propria mano la stessa fascia sta sulla copia trovata, non sulle omonime;
  - durante la sequenza del round una carta trovata in quel round compare solo a sequenza finita, così non anticipa la pescata a faccia
    in su di SB-16f0.
- [readability.ts](../../../client-web/src/readability.ts): il gettone è **un solo gettone** accanto agli altri stati, «Stato negativo:
  Vulnerabile ×1,5». Le frasi:
  - gettone legato: «∞» e «Nessun timer: finisce quando viene giocata una carta «X», quella trovata o un'altra; scartarla non basta.»;
  - gettone a tempo: il numero di turni e «La ricerca non ha trovato la carta: finisce a fine turno.» (o «dura ancora 1 turno dopo
    questo»);
  - con due gettoni il testo aggiunge «Più vulnerabilità si moltiplicano.».
- [table.tsx](../../../client-web/src/table.tsx): l'ispezione della carta trovata ha una nota. Dice chi l'ha trovata e quando, che la
  vedono tutti finché resta in mano e finché non si gioca una carta con quel nome, e quale gettone è legato a lei.

Il colore non porta da solo informazioni: fascia, gettone e nota sono scritti. Nessuna animazione nuova.

## Attesi cambiati e decisione

- [RegoleD50Test](../../../server/src/test/java/com/gsc/bm/sim/RegoleD50Test.java), test della ricerca trovata (SB-16f0): i campi di
  `search` passano da `card`, `found`, `revealed` a `card`, `found`, `revealed`, `copy`, con il controllo che `copy` coincida con la
  carta a faccia in su nella vista. Decisione **D58**, invariato in questa revisione.
- `VulnerabilitaD59Test` della prima consegna diventa **`VulnerabilitaD69Test`**: i casi del minimo, del legame alla copia esatta e
  della giocata per nome della copia scoperta sono sostituiti dai casi di **D69**. Erano test nuovi della stessa fase, mai su `main`
  prima di `41ffadf`.

## Test nuovi

**Server**, [VulnerabilitaD69Test](../../../server/src/test/java/com/gsc/bm/sim/VulnerabilitaD69Test.java), 22 test: 21 su partite vere
con le regole `d50` e carte di prova costruite nel test (bozza del repository non usata). Il danno si misura con un pugno HIT 10
dell'avversario: 15 vuol dire ×1,5 attiva, 10 nessuna vulnerabilità.

| Caso | Test |
|---|---|
| Ricerca fallita: gettone a tempo | `aFailedSearchGivesATokenThatLastsLikeANormalStatus`, `aTimedTokenIsNotEndedByPlayingTheSearchedName` |
| Tipi di danno e fattore | `theVulnerabilityMultipliesHitCutAndPoison`, `theDamageTypesComeFromTheCard` |
| Gettone legato senza timer, nessun minimo | `aFoundCardGivesATokenWithoutTimerUntilItsNameIsPlayed` (quattro turni a ×1,5, poi il colpo lo toglie), `thereIsNoMinimum` |
| Fine del gruppo di velocità, nei due ordini dei posti | `insideASpeedGroupTheTokenGoesAtTheEndOfTheGroup` |
| Copia omonima | `anotherCopyWithTheSameNameEndsTheTokenAndTheFaceUpCard` (si gioca l'omonima coperta: gettone tolto, la copia trovata resta in mano ma non si mostra più) |
| Scarto | `discardingTheFoundCardDoesNotEndTheToken` (bound che scarta: gettone resta; un'altra copia, giocata, lo toglie) |
| Mossa annullata | `aVoidedStrikeStillEndsTheToken`, `aVoidedChargeGivesNeitherTokenNorSearch` |
| Due gettoni | `twoTokensMultiplyAndOnePlayEndsTheOldest` (22 = 10 × 1,5 × 1,5 troncato, poi 15, poi 10), `aFailedSearchAfterASuccessfulOneAddsATimedToken` |
| Riconnessione | `theViewIsRebuiltFromTheMatchAtReconnection` (vista uguale prima e dopo serializzazione e `restoreFrom`, e il gettone funziona ancora) |
| Fine della partita | `theEndOfTheMatchDropsEveryTokenAndFaceUpCard`, `theEliminationOfTheOwnerDropsItsTokensWithoutChangingTheWinner`, `aForfeitEndsTheMatchAndDropsTheTokens` |
| Regole vive, vista, bot, formato | `withTheLiveRulesNothingChanges`, `theLiveStatusesKeepTheirShapeInTheView`, `theBotViewReadsTheFaceUpCardsAndTheTokens`, `theDraftFormatDescribesSearchVulnerabilityFactorAndDuration` (anche il vecchio `minTurns` è rifiutato) |
| Nessuna ricerca di oggetti (D70) | `aDraftSearchCannotTargetAnObject`: la bozza del Set Base passa; con PAZIENZA: FINITA che cerca un oggetto il caricatore la rifiuta |

**Client**, [revealed.test.ts](../../../client-web/tests/revealed.test.ts), 7 test sulle viste reali registrate in
`resolution-views.json`, con l'aggiunta dei soli campi nuovi:

- un gettone accanto agli altri stati, con «∞» e la frase del nome; uguale anche dopo uno scarto, senza carta a faccia in su;
- il gettone a tempo della ricerca fallita;
- due gettoni;
- la nota della carta trovata, propria e altrui, con il fattore del solo gettone legato a lei;
- il modello accetta le viste e la mano avversaria resta un numero;
- il riepilogo del round non cambia;
- con le regole vive nessun campo nuovo in nessuna registrazione.

## Verifiche

Sul codice finale, una alla volta, nell'ordine della tabella.

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | Server **740 test, 0 falliti/errori, 10 saltati** (718 + 22); check-rules verde dentro la build; client-debug **37/37** |
| Banco SB-7 a regole 1.13 (`BenchMeasureTest#matrix`, 2000 partite per cella, 4 stili, `bozza.json`), base `2a0c9ca` contro codice finale | **Identico byte per byte**: stesso JSON e stesso testo, 240 celle, 480.000 partite, invarianti a zero |
| Mutazioni server ([mutations-server.json](sb-16g-2a/mutations-server.json)) | **9/9 rilevate**, ciascuna da almeno un test che fallisce, sorgente ripristinato; la nona, sul divieto di D70, fatta a mano dopo le altre. Due giri prima del finale: una mutazione non compilava (rilevata per errore, corretta) e una sopravviveva perché il filtro «copia in mano» stava sia nel modello sia nelle viste; ho tolto il doppione delle viste e il flag ridondante `shown` |
| Mutazioni client ([mutations-client.json](sb-16g-2a/mutations-client.json)) | **5/5 rilevate**, sorgente ripristinato |
| Avvio reale del profilo bozza (jar rifatto, `local,bozza`, database temporaneo, client sulla 4320) | Partito; 2 partite con la bozza del repository e 5 con la copia temporanea, giocate dall'interfaccia, nessun errore di pagina ([captures-reale.json](sb-16g-2a/captures-reale.json), [captures-vulnerabilita.json](sb-16g-2a/captures-vulnerabilita.json)) |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **857 test, 0 falliti/errori, 10 saltati** (835 + 22), 7:36 min, dopo D70. Le righe `MATCH_ARCHIVE_WRITE_FAILED` del log sono scenari di guasto voluti dai test. R3 non è comparso |
| `python scripts/check-rules.py` | Verde, regolamento 1.13 e Set Base 0.1, SQLite integro |
| `./client-web/run.ps1 -Task Test` | **345/345** (338 + 7) |
| `./client-web/run.ps1 -Task Build` | Verde, solito avviso del bundler sui chunk |
| `./client-web/run.ps1 -Task Size`, `BM_OUT` in TEMP | JS gzip **351.875 byte** (+1.218 su SB-16f0), totale **1.762.032**, texture **27.729.048**; limiti e tetto C4 rispettati; `docs/reports/client-c2/size.json` non toccato |
| `python scripts/check-links.py` | **293 file, 0 link rotti** |
| `git diff --check` | Verde, compresi i file nuovi |

## Catture sul profilo bozza

Script [captures.mjs](sb-16g-2a/captures.mjs), adattato da quello di SB-16f0: jar col profilo `local,bozza` su un database temporaneo,
Edge a 1366×768, movimento ridotto, specchio Spazienzio contro Spazienzio (`aggressivo`). Gioca prima il caricamento e tiene il colpo
trovato.

La bozza del repository non ha ancora carte con `vulnerability` (sono di 2b). Per le catture del gettone ho usato una **copia
temporanea della bozza, fuori dal repository** (`%TEMP%\sb16g2a\bozza-vulnerabilita.json`, passata con `app.bozza.sources`). In
quella copia PAZIENZA: FINITA (bruiser.Glare) perde il suo stato HIT e ha `vulnerability {factor:1.5, turnsIfNotFound:2}` sul passo
`search`. Non è una proposta di carta: serve solo a vedere il funzionamento.

1. [La propria carta trovata e un'omonima](sb-16g-2a/1-propria-trovata-e-omonima.jpg): due GARGANTUESCO IMPATTO SUL TU in mano. Solo
   quella trovata ha la fascia «SCOPERTA ×1,5», l'altra resta normale; sul personaggio il gettone «▼ ∞».
2. [La carta trovata dall'avversario, ispezionata](sb-16g-2a/2-avversario-ispezione.jpg): «Carta scoperta: Computer l'ha trovata con
   una ricerca al turno 2. La vedono tutti finché resta nella sua mano e finché non gioca una carta con questo nome.», con il gettone
   legato.
3. [Il gettone legato al nome](sb-16g-2a/3-gettone-legato-al-nome.jpg): la scheda del gettone del computer, «Nessun timer: finisce
   quando viene giocata una carta «GARGANTUESCO IMPATTO SUL TU», quella trovata o un'altra; scartarla non basta.».
4. [Il gettone di una ricerca fallita](sb-16g-2a/4-gettone-ricerca-fallita.jpg): «▼ 0», «La ricerca non ha trovato la carta:
   finisce a fine turno.».
5. [Ispezione della propria carta trovata](sb-16g-2a/5-ispezione-propria.jpg), con la nota e il gettone legato.
6. [Bozza del repository, senza gettone](sb-16g-2a/6-bozza-reale-avversario.jpg): la carta trovata dal computer a faccia in su con la
   sola fascia «SCOPERTA».

Le PNG originali restano in `%TEMP%\sb16g2a\d69-*`. Evidenze del blocco: circa 1,4 MB.

## Rossi

Nessuno. R3 ([registro](../rossi-noti.md)) non è comparso in questo giro di `TestServerContext`. Nessun rosso nuovo.

## Non verificato

- FFA: carte trovate e gettoni sono disegnati per ogni avversario, ma non ho catture né Playwright in FFA.
- 750×292 e le matrici Playwright (`Verify`, `VerifyLayout`, `VerifyResolution`): non eseguite, come in SB-16f0 (`Verify` non gira
  sulla bozza). Con le regole vive i campi mancano e il disegno non cambia. Con la bozza la carta trovata prende il posto di un dorso
  della stessa misura, ma a 750×292 non ho guardato se fascia e testo restano leggibili.
- Movimento normale: catture solo col movimento ridotto.
- Partite umane: le catture sono partite pilotate dallo script.
- La politica dei bot non usa ancora carte trovate e gettoni (2b).

## Cosa giudica il proprietario

- Se la revisione corrisponde a D69 e D70.
- Le catture: si capisce quale carta dell'avversario è stata vista e che cosa toglie il gettone?

## Domande numerate al proprietario

Nessuna aperta. Le due della revisione D69 hanno avuto risposta in **D70**:

1. **Ricerca fallita.** Il gettone a tempo dura il turno del caricamento e il successivo, `turnsIfNotFound: 2`: «va bene».
2. **Oggetto trovato.** «una ricerca per ora non può trovare un oggetto, non avrebbe senso»; eventuali tutori di oggetti, in futuro,
   senza la penalità. Attuato come divieto nel caricatore della bozza.

Il passo a 2b è confermato in D69: parte dopo la proposta aggiornata con le coppie concrete e la sua approvazione.

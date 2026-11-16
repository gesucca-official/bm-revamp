# SB-16i — Passo del client sulla 1.6b

Blocco diretto del 15 novembre 2026, sulla 1.6b ([D101](../../set-base-decisioni.md#decisioni-del-proprietario)), dopo
[D97](../../set-base-decisioni.md#decisioni-del-proprietario) (2) e (4). Perimetro allargato in corsa al validatore del comando
([D102](../../set-base-decisioni.md#decisioni-del-proprietario)): STOP 1 prima di scrivere, il proprietario «Sì, allarga».

## Esito

**Consegnato, con uno STOP 3 aperto su un rosso intermittente di `VerifyResolution`** (sotto, «Rossi»). In una quick 1vCom col profilo
`bozza` (1.6b, regole `d50`) giocando un caricamento a due nomi con entrambi nel mazzo si apre la finestra «Quale carta cerchi?» e la ricerca
risolta dice i due nomi e quello scelto; «Ultimo turno» dice se una carta con «Gioca d'anticipo» è arrivata prima; il numero di giocate si
legge sulla propria last resort e nell'ispezione dell'avversario. Con le regole vive: identità viva identica byte per byte, `Verify` verde a
1366×768, 844×390 e 1920×1080, `VerifyResolution` verde a 844×390; a 1366×768 un rosso dello strumento in 2 giri su 5 sul codice del blocco
e in 0 su 3 sulla base, non attribuito.

## Cosa cambia

**Server.**

- [MoveCommandValidator](../../../server/src/main/java/com/gsc/bm/api/ws/MoveCommandValidator.java) (D102): il comando della mossa
  ammette `searchChoice`, testo non vuoto (altrimenti «Invalid search choice»), e lo passa alla mossa. Il controllo resta a
  `Move.isValidFor`: nome stampato sulla carta, una copia nel mazzo e, con le regole vive, «no search choice with these rules».
  Prima, con qualunque regola, un comando col campo era rifiutato con «Unexpected move field».
- [Move](../../../server/src/main/java/com/gsc/bm/model/game/Move.java): `searchChoice` passa da `@JsonIgnore` a scrittura sola.
  Nessuna vista lo mostra, nemmeno `pendingMove`.
- [Vista propria](../../../server/src/main/java/com/gsc/bm/service/view/model/client/ClientSelfPlayerView.java): `searchable`, solo con
  `d50`. Per ogni carta in mano che annuncia due nomi, dal suo binding, i nomi con almeno una copia nel mazzo, nell'ordine stampato. Non dice
  l'ordine del mazzo né quante copie. Manca senza carte a due nomi e con le regole vive; la vista dell'avversario non l'ha mai.
- [Vista del personaggio](../../../server/src/main/java/com/gsc/bm/service/view/model/client/ClientCharacterView.java): `plays`, il
  contatore pubblico delle giocate per titolo (nome in minuscolo, annullate comprese) che il motore teneva già
  (`Character.playCounts()`). Con `d50` c'è sempre, vuoto prima della prima giocata, così il client può dire «mai giocata»; con le
  regole vive manca.
- `search.announced`, `ahead` e `plays` della mossa pubblica c'erano già dalla Fase B: ora sono documentati.
- [api.md](../../api.md): il campo del comando, i due campi delle viste, i tre della mossa pubblica.

**Client web.**

- [contracts.ts](../../../client-web/src/contracts.ts): i campi nuovi, tutti facoltativi.
- [model.ts](../../../client-web/src/model.ts): `searchOptions` legge `searchable` per la carta scelta. Con **due** nomi `confirm`
  non compone il comando senza una scelta fra quei due; con **uno** o **nessuno** il comando parte come prima, **senza** il campo (il
  motore cerca comunque l'unico disponibile o fallisce). Con le regole vive il comando ha esattamente i cinque campi di prima.
- [table.tsx](../../../client-web/src/table.tsx): dopo «Conferma», con due nomi, la finestra **«Quale carta cerchi?»**, con lo stesso
  `dialog`, gli stessi pulsanti e lo stesso schema di «Scartare l'ultima copia?»: il testo («… annuncia due carte e nel tuo mazzo
  ci sono tutte e due. Scegli quella da cercare al posto della pesca: la vedranno tutti, poi il mazzo si mischia»), un pulsante per
  carta col nome e il costo (componente `Cost`), «Torna al tavolo». Se la vista cambia mentre è aperta, dice «La scelta è cambiata».
  Dopo l'avviso dello scarto, se servono entrambe, la scelta viene subito dopo.
- [resolution.ts](../../../client-web/src/resolution.ts), «Ultimo turno»:
  - «Ricerca al posto della pesca: «X» o «Y», scelta «Y», trovata e mostrata a tutti.», col pulsante per vedere la carta trovata come
    in SB-16f0; oppure «… «X» o «Y», nessuna delle due nel mazzo, pesca normale.». Con un nome solo, le frasi di SB-16f0;
  - «Gioca d'anticipo: sì, prima di «Z».» (Z è la carta del bersaglio in quel turno; senza, «sì.»), oppure «Gioca d'anticipo: no.»;
  - «Rincara: prima giocata della partita.» oppure «Rincara: già giocata n volte prima di questa.».
- Contatore accanto alla last resort ([readability.ts](../../../client-web/src/readability.ts), [scene.ts](../../../client-web/src/scene.ts)):
  - **propria**: sulla last resort in mano la fascia già usata per «SCOPERTA», senza la cornice delle carte viste da tutti:
    «MAI GIOCATA», «GIOCATA 1 VOLTA», «GIOCATA n VOLTE». Detto anche nell'etichetta accessibile e nell'ispezione della carta;
  - **dell'avversario**: la sua last resort non è sul tavolo (la mano è coperta). Il contatore si legge nell'ispezione del personaggio,
    riga «Last resort»: ««Last Resort: Banzai!!!» giocata n volte», oppure «mai giocata». Nel turno in cui la gioca, la riga «Rincara»
    di «Ultimo turno».
- Nessuna animazione nuova, nessun colore nuovo, nessun asset. Ogni elemento nuovo si disegna solo se il campo c'è.

## Attesi cambiati e decisione

Nessun atteso cambiato. Il messaggio di rifiuto di un comando con `searchChoice` sotto le regole vive cambia da «Unexpected move field» a
«no search choice with these rules», come chiesto dal prompt e registrato in D102 (2). Nessun test esistente lo fissava per quel campo.

## Test nuovi

- [Sb16iClientFieldsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb16iClientFieldsTest.java), 8 test: la scelta viaggia nel comando
  (validatore, poi motore) e la ricerca risolta la mostra; mai visibile in lettura; senza campo come prima; campo malformato rifiutato dal
  validatore, nome sbagliato o senza copie dal motore; con le regole vive «no search choice with these rules» e lo stesso comando senza il
  campo accettato; `searchable` (due, uno, nessuno, solo carte a due nomi, mai all'avversario, niente del mazzo all'avversario); `plays`
  per tutti e per titolo; con le regole vive i campi delle viste esattamente quelli di prima.
- [SearchChoiceWireTest](../../../server/src/test/java/com/gsc/bm/SearchChoiceWireTest.java) (contesto Spring, `TestServerContext`):
  attraverso il protocollo vero (STOMP su WebSocket) con le regole vive, `searchChoice` rifiutato su `/user/queue/illegalMove` con «no search
  choice with these rules», un valore numerico con «Invalid search choice», il comando senza il campo accettato, la vista senza campi nuovi.
- [sb16i-client.test.ts](../../../client-web/tests/sb16i-client.test.ts), 10 test sulle viste reali registrate da `VerifyResolution`
  (`resolution-views.json`), con i soli campi nuovi aggiunti come li manda il server: le righe della ricerca a due nomi, dell'anticipo e di
  «Rincara»; il contatore della last resort; la scelta nel modello (due nomi: attende e porta la scelta; uno o nessuno: parte senza campo;
  regole vive: i cinque campi di prima); con le regole vive nessun campo e nessuna riga nuova.

## Mutazioni

**8/8 rilevate**, verde dopo il ripristino ([dati](sb-16i-client/mutations.json), [esecutore](sb-16i-client/mutations.py)): il validatore
che scarta la scelta; `searchable` che ignora il mazzo; `searchable` anche per le carte a un nome; contatore anche con le regole vive; due nomi
senza attesa della scelta; il nome unico mandato come scelta; anticipo sempre «sì»; contatore su ogni carta.

## Verifiche

Riepilogo in [verifications.json](sb-16i-client/verifications.json). Una alla volta, con `java` e porte controllati prima di ogni avvio.

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | verde: `check-rules` verde, **863 test server** (855 + 8 nuovi), 0 falliti o in errore, 20 saltati; client-debug 37/37 |
| Identità viva 1.13 (`ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, 480.000 partite, fixture e cartella di base come SB-16i) | **identica byte per byte**: JSON 266.868 B e Markdown 26.111 B ([impronte](sb-16i-client/live-identity.json)) |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | verde: **981 test**, 0 falliti o in errore, 20 saltati, `SearchChoiceWireTest` compreso. Nel log, all'uscita dalla partita fixture, «Missing match recording»: lo stesso messaggio che lasciano le partite fixture di `WebSocketIdentityTest`, non un errore di test |
| `python scripts/verify-match-manifests.py` | `allChecks: PASS` |
| Jar rifatto (`-Task Server -Offline`), poi `VerifyAll -ReuseJar -Only 'test,build,size,verify,resolution'` | `Test` 366/366 (356 + 10 nuovi), `Build` verde, `Size` JS 353.571 B gzip (base 352.574), totale 1.763.728 B, texture 27,7 MB: dentro i limiti; `BASE_750` invariato (nessun test di geometria toccato); **`Verify` verde a 1366×768, 844×390 e 1920×1080**; **`VerifyResolution` verde a 844×390, rossa a 1366×768** (sotto) |
| Mutazioni | 8/8 rilevate (sopra) |
| `python scripts/check-rules.py`, `git diff --check`, `python scripts/check-links.py` | verdi; nessun link rotto |

**Geometria.** Gli elementi nuovi si disegnano solo se i campi ci sono: con le regole vive nessun elemento nuovo, `Verify` verde alle tre
misure. Nessuna riga nuova per la tabella delle aree.

## Catture sul profilo bozza

Jar del blocco, server col profilo `local,bozza` su un database temporaneo, `./client-web/run.ps1 -Task Serve` sulla 4320, Edge col
movimento ridotto, partite quick 1vCom giocate attraverso l'interfaccia dallo script [captures.mjs](sb-16i-client/captures.mjs) (sul modello
di SB-16f0). Specchio Mara contro Mara (`aggressivo`) per scelta, ricerca e anticipo; Celestina contro Celestina e Piera contro Piera
(`prudente`, poi `casuale`), con il giocatore che preferisce le carte senza danno, per arrivare a mazzo finito, unico momento in cui la
last resort è in mano. Dati delle corse in [captures.json](sb-16i-client/captures.json): nessun errore di pagina. Due corse si sono fermate
sull'avviso «Scartare l'ultima copia?» di SB-16g, che lo script non gestiva (corretto); i loro JSON e quello della corsa di Celestina sono
stati sovrascritti, le catture PNG restano in `%TEMP%\bm-sb16i-client-captures*`. Ricompresse in JPEG, 1,1 MB.

| | 1366×768 | 844×390 |
|---|---|---|
| Finestra di scelta | [1366-1](sb-16i-client/1366-1-scelta.jpg): «Ti stringo la curva», Cinghiata 20 A o Sgommata 15 A | [844-1](sb-16i-client/844-1-scelta.jpg): «Slalom d'avvicinamento» |
| Ricerca a due nomi trovata | [1366-2](sb-16i-client/1366-2-ricerca-trovata-anticipo-no.jpg): «… o «Sgommata», scelta «Sgommata», trovata e mostrata a tutti.», col pulsante; nella stessa cattura «Gioca d'anticipo: no.» del computer | [844-2](sb-16i-client/844-2-ricerca-trovata.jpg) |
| Ricerca a due nomi fallita | [1366-3](sb-16i-client/1366-3-ricerca-fallita.jpg): «Un assaggino», «… nessuna delle due nel mazzo, pesca normale.» | [844-3](sb-16i-client/844-3-ricerca-fallita.jpg) |
| Anticipo sì | [1366-4](sb-16i-client/1366-4-anticipo-si.jpg): «Gioca d'anticipo: sì, prima di «Sputo da posacenere».» | [844-4](sb-16i-client/844-4-anticipo-si.jpg): «sì, prima di «Sgommata».», e «no.» per la Sgommata del computer |
| Contatore proprio | [1366-5](sb-16i-client/1366-5-contatore-proprio.jpg): «GIOCATA 1 VOLTA» su «L'ultimo giro» in mano, turno 19 | [844-5](sb-16i-client/844-5-contatore-proprio.jpg): la fascia si legge anche col pannello d'esito |
| Contatore dell'avversario | [1366-6](sb-16i-client/1366-6-contatore-avversario.jpg): ispezione, «Last resort: «L'ultimo giro» giocata 1 volta»; [1366-7](sb-16i-client/1366-7-rincara-avversario.jpg): «Rincara: prima giocata della partita.» | [844-6](sb-16i-client/844-6-contatore-avversario.jpg) |

Osservazione fuori dal blocco: per «L'ultimo giro» il danno nominale di «Ultimo turno» dice «più metà della V residua di chi gioca», mentre la
carta somma la L residua. Viene dalla lettura di «12+x» nel client, che c'era già prima di questo blocco.

## Rossi

**`VerifyResolution` a 1366×768: rosso intermittente, non attribuito. STOP 3 aperto per il proprietario.**

- **Firma:** `TypeError: Cannot read properties of null (reading 'x')` in `restOn` (`client-web/tools/verify-resolution.mjs:669`), scenario
  `info`, azione «to the (i) right after ✓, mouse only». È lo strumento a fermarsi: nessun controllo del prodotto è fallito (`errors: []`).
- **Meccanismo:** quell'azione gareggia apposta col click su ✓. `restOn` legge l'etichetta del pulsante (i) e subito dopo ne chiede il
  riquadro; se nel frattempo la vista con la mossa in attesa ha tolto la carta, il pulsante non c'è più e `boundingBox()` dà `null`, che lo
  strumento non controlla.
- **Confronto** (`BM_SCENARIOS=info`, solo 1366×768): base `29f0544` col jar della base, **3 verdi su 3**; codice del blocco, **2 rossi su
  5** (la `VerifyAll` completa e il primo giro isolato), poi 3 verdi di fila. Con questi numeri la differenza non è significativa: non posso
  attribuirlo al blocco né dichiararlo preesistente. Non lo aggiungo al [registro dei rossi noti](../rossi-noti.md).
- **Nel codice:** con le regole vive il blocco non cambia né il pulsante (i) né la scena né l'invio. L'unica differenza viva nel clic su ✓ è
  il controllo `searchOptions`, vuoto senza `searchable`; `playsNote` torna `null` senza il contatore. Non ho trovato un nesso.
- Evidenze: `%TEMP%\bm-sb16i-client-verifyall-1` (giro completo), `%TEMP%\bm-sb16i-client-info-base` e `-info-block` (giri di
  diagnosi), riepilogo in [verifications.json](sb-16i-client/verifications.json). Nessun rilancio per tornare al verde.

## Non verificato

- La scelta in una partita con un altro umano (1v1) e in FFA: il codice è lo stesso, provato solo in quick 1vCom.
- La prossima crescita della last resort («prossima: … al bersaglio, … a sé» del rapporto SB-16i): il client non ha `perPlay` in forma
  strutturata, solo il testo della carta, che già dice «Rincara X (Y a sé)». Mostro le giocate, non il danno della prossima.
- Il client di debug (`client-debug`) non manda mai `searchChoice`: con la bozza vale il primo nome disponibile, come prima.

## Scelte prese

1. Il campo `searchable` è per carta in mano (dal binding) e non un elenco unico, così il client sa quali nomi propone ciascuna carta;
   ordine stampato, che non dice nulla del mazzo. Elenco vuoto quando nessuno dei due è nel mazzo.
2. Con un solo nome disponibile il comando parte **senza** `searchChoice`: il motore cerca comunque quello, e il comando resta quello di prima.
3. `plays` sempre presente con `d50`, anche vuoto, per poter scrivere «mai giocata»; per titolo e per tutte le carte, perché ogni giocata è
   già pubblica (D97); il client lo mostra solo per le last resort.
4. Il contatore dell'avversario sta nell'ispezione del personaggio e in «Ultimo turno», perché la sua last resort non è mai sul tavolo.
   Niente fascia sulle carte del round: sono sovrapposte a cascata e la fascia ne coprirebbe un'altra.
5. La finestra di scelta compare dopo «Conferma», non alla selezione della carta: così la scelta è l'ultimo passo prima dell'invio e
   «Annulla» resta quello di prima.
6. Il test attraverso il protocollo è un test di contesto Spring nuovo (gira con `TestServerContext`); il percorso validatore → motore è
   provato anche nei test unitari.

## Cosa giudica il proprietario

- Il rosso intermittente di `VerifyResolution` (domanda 1).
- Le parole della finestra e delle righe di «Ultimo turno» (catture sopra).
- La fascia «GIOCATA n VOLTE» sulla propria last resort e la riga nell'ispezione dell'avversario.

## Prova umana breve sulla 1.6b

Il server col profilo `bozza` legge `bozza.json`, cioè la 1.6b, e gioca con le regole `d50`: nessun file né flag a parte. Dalla radice,
dopo il pull e senza verifiche in corso (usano le stesse porte 8080 e 4320):

```powershell
./scripts/build.ps1 -Task Server -Offline
./client-web/run.ps1 -Task Build    # Serve non ricostruisce: senza, si serve la build vecchia in dist (D104)
./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Pool 'starter-mara,starter-spazienzio,starter-tossico' -Com pool -Bot risorse
# in un secondo terminale, dalla radice:
./client-web/run.ps1 -Task Serve      # http://127.0.0.1:4320, account sintetici come in docs/setup.md
```

Poi «Contro il computer», «Gioca». La riserva è facoltativa (senza `-Pool` i cinque starter). Mara ha due caricamenti a due nomi (Slalom
d'avvicinamento, Ti stringo la curva) e le tre carte con «Gioca d'anticipo»; Spazienzio PAZIENZA: FINITA e TI FACCIO SPAZIO; Celestina Dose
in preparazione e Un assaggino.

Cosa guardare:

1. **La scelta.** Gioca un caricamento a due nomi e premi ✓: con entrambe le carte nel mazzo si apre «Quale carta cerchi?» con le due carte
   e il loro costo. Con una sola nel mazzo la mossa parte subito, senza domanda; con nessuna la ricerca fallisce e si pesca.
2. **«Ultimo turno»** (menu o tocco sulla riga breve): «Ricerca al posto della pesca: «X» o «Y», scelta «Y», trovata e mostrata a tutti.»
   oppure «nessuna delle due nel mazzo»; «Gioca d'anticipo: sì, prima di «Z».» o «no.»; «Rincara: …» quando qualcuno gioca la last resort.
3. **Il contatore.** La last resort arriva in mano solo a mazzo finito (di solito dopo il 15° turno): sopra la carta «MAI GIOCATA» o
   «GIOCATA n VOLTE». Quella dell'avversario: tocca il suo personaggio, riga «Last resort».
4. Se le parole della finestra o delle righe sono chiare, e se il contatore dell'avversario nell'ispezione basta (domanda 1).

## Domande

1. **STOP 3, rosso di `VerifyResolution` a 1366×768:** lo accetti come corsa dello strumento (e lo metto nel registro dei rossi noti con i
   numeri sopra), vuoi altri giri di confronto sulla base e sul blocco prima di decidere, oppure un blocco che renda `restOn` robusto al
   pulsante sparito (strumento comune, fuori da questo perimetro)?
2. Il contatore dell'avversario nell'ispezione del personaggio (più la riga di «Ultimo turno») basta, o lo vuoi anche sul tavolo, accanto
   al suo personaggio?
3. Vuoi anche «prossima: … al bersaglio, … a sé»? Serve un campo strutturato in più (`perPlay`) nella carta o nella vista.

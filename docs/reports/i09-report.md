# I09 — Vista privata e primo comando

23 ottobre 2026. Implementato e verificato il contratto vista/comando con una partita fixture di due umani, senza avviare un round o certificare una partita completa. Regolamento e catalogo invariati: i controlli di ingresso applicano R03 e i confini gia esplicitati in R08, senza cambiare costi, effetti, pesca o risoluzione.

## Modifiche

- [ClientCharacterView](../../server/src/main/java/com/gsc/bm/service/view/model/client/ClientCharacterView.java) e [ViewExtractorServiceImpl](../../server/src/main/java/com/gsc/bm/service/view/ViewExtractorServiceImpl.java): aggiunti dead e bindingName alla vista runtime; dead deriva da Character.isDead. La mano propria resta un array, la mano avversaria un numero; nessun ordine del mazzo viene esposto.
- [player.ts](../../client-debug/src/app/model/player.ts): deck numerico allineato al JSON server, al posto del solo nome TypeScript deckSize. [character.ts](../../client-debug/src/app/model/character.ts): itemsSize dichiarato. Nessun rename del campo server esistente.
- [MoveCommandValidator](../../server/src/main/java/com/gsc/bm/api/ws/MoveCommandValidator.java): GameController riceve JSON di comando, valida e costruisce un Move nuovo. Campi previsti: playedCardName, playerId, targetId, gameId, choices. Campi di stato come isVoid/void/moveReport non sono accettati in ingresso. Identita e ID devono coincidere con principal/path/partita; partita attiva e partecipante umano richiesti. Carta in mano, bersaglio esistente e categoria SELF/OPPONENT/NEAR_ITEM/FAR_ITEM controllati. SELF resta la convenzione legacy; non viene trasformato nel nome account nel comando motore.
- Choices assente/null/vuoto e ammesso per azioni senza scelte. Per bound serve DISCARD_ONE; per item serve TARGET_ITEM, stringhe non vuote. Chiavi sconosciute, tipi errati o scelte estranee alla carta sono rifiutati. Presenza dello scarto/item e costi continuano a essere verificati da Move.isValidFor prima dell'inserimento; nessuna modifica al motore Move/Game.
- [GameController](../../server/src/main/java/com/gsc/bm/api/ws/GameController.java): validazione prima di chiamare GameSessionService. IllegalMoveException continua a rispondere privatamente su /user/queue/illegalMove. I controlli I06 su identita/path/body e sottoscrizioni restano attivi prima del controller: una violazione di sicurezza puo produrre ERROR e chiusura, anziche un errore di mossa recuperabile.
- [CardInHandComponent](../../client-debug/src/app/client-debug/card-in-hand/card-in-hand.component.ts): nessun invio con bersaglio/scarto/item incompleto; pulsante disabilitato. Il nome item mantiene l'intera parte dopo il primo separatore, senza troncare eventuali punti successivi.

Non si promette rollback generale del motore: la garanzia verificata riguarda i comandi rifiutati prima della risoluzione e il duplicato mentre la prima mossa e ancora in attesa. I log diagnostici/di tentativo possono cambiare anche per un rifiuto; mani, risorse, turno e pendingMoves non devono subire l'azione rifiutata. Completezza dei log e gestione errori durante risoluzione restano I19/I11.

## Prove

[WebSocketIdentityTest.privateGameViewValidMoveAndRejectedCommandsPreserveState](../../server/src/test/java/com/gsc/bm/WebSocketIdentityTest.java) usa server reale su porta casuale, account sintetici e partita fixture interna ai test. Nessun endpoint fixture aggiunto all'applicazione.

1. SUBSCRIBE privato e richiesta vista: mano del titolare array, avversario numero, deck numerico e dead presente; un personaggio morto nella fixture risulta dead=true.
2. Bersaglio null: errore privato, zero mosse in attesa.
3. SuperImpact valido da wireAlice a wireBob: conferma sul topic, una mossa in attesa; HEALTH 100 e VIOLENCE 25, senza pagamento anticipato del costo 25.
4. Secondo invio: errore privato, prima mossa conservata, turno ancora zero.
5. Estraneo wireEve: sottoscrizione alla vista della partita rifiutata.
6. gameId nel body diverso dal path: rifiuto sul trasporto, prima mossa invariata.

[MoveCommandTest](../../server/src/test/java/com/gsc/bm/model/game/MoveCommandTest.java), tre casi, copre campi null, payload null, campi interni non ammessi, bersaglio assente/categoria errata, scelta sconosciuta, bound senza scarto, scarto protetto, bound valida con scarto regolare, item vicino e lontano reali e item mancante. Le azioni valide sono inserite senza risoluzione o consumo di risorse.

Client: tre nuovi casi in card-in-hand.spec.ts verificano assenza invii con scelte incomplete; debug-error.spec.ts verifica che la callback di rifiuto privata apra lo snackbar con il messaggio ricevuto. Questa e una prova del componente con dipendenze finte, non rendering DOM o screenshot durante un match.

| Comando | Risultato finale |
|---|---|
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 131 test server, zero failure/error/skipped |
| `./scripts/build.ps1 -Task Test -Offline` | 78 test server ordinari e 17 client verdi |
| `./scripts/build.ps1 -Task TestClient -Offline` | 17 client verdi |
| `./scripts/build.ps1 -Task Server -Offline` | JAR prodotto |
| `./scripts/build.ps1 -Task Client -Offline` | Build produzione riuscita; warning bundle 2,21 MB oltre budget 2 MB gia noto |
| `python scripts/check-rules.py` | Regole, copia client, testi catalogo e starter allineati |

Log in `.build-logs/i09-context-final.log`, `i09-tests-final.log`, `i09-client-tests-final.log`, `i09-server.log`, `i09-client.log`. Database di test nuovi sotto target/test-databases; nessuna credenziale reale, SMTP o database condiviso usato.

## Limiti e passo successivo

Non eseguito un round quick/1vCom dal browser, non provata una partita completa, nessuna nuova verifica visuale del debug durante una partita. I10 deve verificare join reale, ready privato, vista e primo round umano/bot nella UI debug. Restano identificazione carte per nome, formato composito owner.item del client, assenza di ID comando/turno per idempotenza tra round e garanzie incomplete dopo eccezioni del motore. I09 non introduce replay, rollback, cambio delle regole o nuovi ID di protocollo.

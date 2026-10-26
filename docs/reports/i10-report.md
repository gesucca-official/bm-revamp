# I10 — Primo round quick contro il computer

23 ottobre 2026. **Completato:** login, join reale quick/1vCom, ready privato, vista iniziale, primo round e ritorno alla mano verificati nel client debug. Nessuna modifica a regolamento, catalogo, motore o politica casuale del bot. Non certificata una partita completa.

## Modifiche circoscritte

- [GameService](../../bm-web-client/src/app/service/game.service.ts): client iniziale Debug, come richiesto per la fase locale. Phaser resta selezionabile, non verificato da I10.
- [WebsocketService.joinGame](../../bm-web-client/src/app/service/websocket.service.ts): un secondo join mentre queued e vero non invia un altro comando. Il ready privato cancella la sottoscrizione temporanea e libera lo stato di attesa. Non e idempotenza server o protezione da client arbitrari che inviano nuovi join dopo il ready.
- [CodeDialogComponent template](../../bm-web-client/src/app/client-debug/code-dialog/code-dialog.component.html): pulsante Continue per Begin, Turn Resolution ed End of Turn Effects, senza dipendere da Esc o click sullo sfondo.

Il percorso server esistente QuickGameQueuesController -> GameFactoryService -> GameSessionService -> Game/ComPlayer e stato mantenuto. I controlli di appartenenza I06 e il validatore I09 restano in funzione. Non e stato necessario riscrivere componenti per eseguire il primo round.

## Test deterministico end-to-end sul trasporto

[WebSocketIdentityTest.quickJoinReadyAndFirstRoundAgainstRealBot](../../bm-server/src/test/java/com/gsc/bm/WebSocketIdentityTest.java) usa server Spring reale su porta casuale e account SQLite sintetici. Soltanto nel test, una spy della factory restituisce una partita nota al join di roundHuman. Controller, routing, autenticazione, validatore, servizio partita, risoluzione e ComPlayer sono reali. Nessun endpoint fixture o bot deterministico aggiunto all'applicazione.

Fixture: due Bruiser; umano con SuperImpact (25 VIOLENCE, 40 HIT), bot con la sola Struggle disponibile (5 autodanno e 10 HIT al bersaglio). Dopo costruzione si fissano le prossime carte del mazzo: Grab per l'umano e SuperImpact per il bot.

Verifiche:

1. Un SEND join, una chiamata factory, un gameId, due partecipanti. Ready ricevuto dal titolare; un altro account sottoscritto alla propria destinazione privata non riceve il ready altrui.
2. Comando con target null: errore privato, turno zero e nessuna pending move. Il successivo comando valido viene accettato sulla stessa connessione.
3. Update ricevuto e nuova vista privata richiesta: turno uno, due mosse risolte, esattamente una del bot. Umano HEALTH 90/VIOLENCE 0, bot HEALTH 55. Grab entra nella mano e il mazzo umano e vuoto.
4. Nessun ready duplicato. Il bot ha gia selezionato una sola mossa in attesa per il turno successivo: e il comportamento esistente di Game.resolveMoves/isReadyToResolveMoves, non una seconda mossa nello stesso round.

Le prove I06/I09 continuano a negare sottoscrizioni ai topic/vista di una partita da parte di estranei. Il test I10 aggiunge la mancata consegna del ready alla sessione di un altro account; non considera riservati i broadcast pubblici di presenza.

Client: [a-websocket.spec.ts](../../bm-web-client/tests/a-websocket.spec.ts) verifica che due join consecutivi producano un solo SEND mentre il primo e in attesa, che la destinazione ready sia privata e che la ricezione svuoti queued e annulli la sottoscrizione.

## Prova effettiva nel browser

Con JAR locale, client Angular e database nuovo `.build-logs/i10/application.sqlite`:

- Login devAlice, Debug selezionato, Quick Modes -> Join 1vCom Game: Begin con un solo bot e mano/risorse visibili.
- Primo avvio: giocata STORDIAMOTI HO DETTO. VIOLENCE 25 -> 10; bot HEALTH 100 -> 90; una nuova carta appare in mano. Turn Resolution mostra una mossa umana e una del bot; console senza errori.
- Dopo l'aggiunta del pulsante Continue e il reload di sviluppo, ripetuto il percorso su una nuova partita: Begin -> Continue -> SPEDIAMOTI DUNQUE IN O-AHIO -> Turn Resolution -> Continue -> End of Turn Effects -> Continue -> mano. Osservati VIOLENCE 25 -> 5, bot HEALTH 100 -> 78, variazioni del bot e danno periodico alla salute umana; nessun errore console, nessun dialogo residuo.

Le carte e il bot del browser erano casuali, senza fixture applicativa. I numeri attesi ripetibili sono verificati separatamente nel test sopra. Il reload non e una prova di reconnect: i match precedenti sono rimasti nel processo di test fino al suo arresto; recupero e finalizzazione restano in roadmap.

## Comandi e risultati

| Comando | Risultato |
|---|---|
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 132 test server, zero failure/error/skipped |
| `./scripts/build.ps1 -Task Test -Offline` finale | 78 test server ordinari e 18 client verdi |
| `./scripts/build.ps1 -Task TestClient -Offline` | 18 client verdi |
| `./scripts/build.ps1 -Task Client -Offline` | Build riuscita; warning bundle iniziale 2,22 MB, circa 221 kB oltre budget 2 MB |
| `./scripts/build.ps1 -Task Server -Offline` | JAR prodotto dopo arresto dei processi di prova |
| `python scripts/check-rules.py` | Regolamento, copia client e catalogo allineati |

Evidenze: `.build-logs/i10-context.log`, `i10-tests-final.log`, `i10-client-tests-final.log`, `i10-client.log`, `i10-server-build.log`; log dei processi browser in `.build-logs/i10/`. Nessuna credenziale reale, SMTP, database condiviso o regola cambiata. Processi e scheda creati per la prova arrestati al termine.

## Ripetere manualmente

Da E:/bm, avviare in due terminali `./scripts/dev.ps1 -Task Server -SeedAccounts` e `./scripts/dev.ps1 -Task Client`. Aprire http://localhost:4200/hub, accedere con devAlice/local-alice, lasciare Debug, scegliere Quick Modes -> Join 1vCom Game. Premere Continue nel riepilogo iniziale; scegliere una carta Play abilitata, completando eventuali target/scarto. Leggere Turn Resolution ed End of Turn Effects, chiudendoli con Continue.

Questa procedura prova il percorso locale di sviluppo: non garantisce che ogni mano casuale abbia una mossa umana disponibile. Quel limite e gia esplicito nel regolamento R03. Non sono verificati partita completa/esito, tutte le carte e interazioni, multiplayer, Phaser, reconnect, timeout o raccolta completa dei log. Prossimo incremento I11, risoluzione e isolamento dello stato.

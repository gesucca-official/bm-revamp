# C0 — Checklist verificabile di parità

26 ottobre 2026. Inventario statico del codice corrente, regolamento **1.6**.
Le caselle riguardano il **futuro client**, non sono una certificazione del debug
o del prototipo. Ogni caso dovrà ricevere evidenza durante C1/C2 e regressione C5.

I requisiti aggiuntivi di rappresentazione/gesto sono nella
[revisione C0-R1–R5](design/client-c0/bar-table-revision.md): mano fisica
riordinabile, calata sui bersagli, oggetti come carte e mani avversarie coperte.
Estendono la UX, senza aggiungere API o alterare la parità qui censita.

**O** = capacità operativa presente nei sorgenti; **C** = percorso condizionato
dalla configurazione; **L** = lacuna/limite da conservare esplicito. O non significa
che ogni percorso sia stato rieseguito manualmente in C0. REST qui è relativo a
`/rest` nel browser (`/api/rest/v1` sul server); comandi STOMP con `/app`, risposte
private con `/user/queue`. Non sono API nuove.

Fonti debug: [route](../client-debug/src/app/app.module.ts),
[home](../client-debug/src/app/home/home.component.html),
[home TS e link](../client-debug/src/app/home/home.component.ts),
[regole](../client-debug/src/app/home/rules/rules.component.html),
[login](../client-debug/src/app/connection/sign-in/sign-in.component.ts),
[registrazione](../client-debug/src/app/connection/sign-up/sign-up.component.ts),
[hub](../client-debug/src/app/user-hub/user-hub.component.html),
[modalità e presenza](../client-debug/src/app/connection/choose-game/choose-game.component.html),
[modalità TS](../client-debug/src/app/connection/choose-game/choose-game.component.ts),
[catalogo/mazzi](../client-debug/src/app/user-hub/collection/collection.component.html),
[mazzi TS](../client-debug/src/app/user-hub/collection/collection.component.ts),
[editor](../client-debug/src/app/user-hub/collection/edit-deck/edit-deck.component.ts),
[editor HTML](../client-debug/src/app/user-hub/collection/edit-deck/edit-deck.component.html),
[partita](../client-debug/src/app/client-debug/debug-client.component.ts),
[tavolo debug](../client-debug/src/app/client-debug/debug-client.component.html),
[mano](../client-debug/src/app/client-debug/card-in-hand/card-in-hand.component.ts),
[personaggio/oggetti](../client-debug/src/app/client-debug/character-card/character-card.component.html),
[trasporto](../client-debug/src/app/service/websocket.service.ts),
[assistente scelte](../client-debug/src/app/service/game.service.ts),
[admin](../client-debug/src/app/user-hub/admin-control-panel/admin-control-panel.component.ts),
[log errori](../client-debug/src/app/service/client-error-handler.ts).
I nomi brevi nella colonna fonte rimandano a questi file, tutti visitati.

## Navigazione, account e presenza

| ID / stato futuro | Base / fonte debug | Percorso e API esistenti | Destinazione proposta e caso verificabile |
|---|---|---|---|
| [x] P01 | O home, route | `/`, `/rules`, `/hub`, `/sign-up`; navigazione locale | Home/regole/accesso. Raggiungere tutte le destinazioni e tornare; C2. **Fatto** in [C2b-5](reports/client-c2-report.md#c2b-5--home-regole-e-registrazione), [evidenza](reports/client-c2/c2b-5/public-1366x768.json): home → regole → home (anche con indietro del browser) → accesso → hub → esci → home, navigazione a hash `#/`, `#/regole`, `#/accedi`, `#/registrati`; portrait 390×844 fuori dal tavolo (D7). |
| [x] P02 | O home TS; C link esterni | Home: Instagram, YouTube, GitHub profilo e due repository, mailto e PayPal; nessuna API gioco | Info e sostegno secondari. Verificare destinazioni uguali ai sorgenti, apertura e ritorno. Nessun asset sponsor corrente importato; C2. **Fatto** in [C2b-5](reports/client-c2-report.md#c2b-5--home-regole-e-registrazione): i sette `href` uguali a quelli di `home.component.{ts,html}` del debug (confrontati, non aperti), nessuna immagine sponsor, diritti «tutti i diritti riservati» senza licenza open source. |
| [x] P03 | O regole; L copia diritti home | `/rules`, risorsa client `assets/docs/rules.md`; nessuna API | Consultare regolamento vigente completo. Controllare identità con fonte e correggere la copia «Open Source» secondo CONTRIBUTING; C2. **Fatto** in [C2b-5](reports/client-c2-report.md#c2b-5--home-regole-e-registrazione): `docs/game-rules.md` importato al build (D10, nessuna terza copia); titoli, revisioni, ogni cella delle tabelle e tutte le parole uguali alla fonte; nessun collegamento, ancora o HTML grezzo nel testo reso. |
| [ ] P04 | O login, trasporto | Hub → login; POST `/sign-in/validate` `{username,password}`; boolean, poi SockJS `/ws` e CONNECT login/passcode | Accesso. Credenziali corrette/errate, risposta false, rete assente; nessuna credenziale nei log o storage; C1. |
| [x] P05 | O trasporto, hub | SEND `/app/user/{username}/account`; SUB `/user/queue/account/data`, `/user/queue/account/error` | Attendere profilo prima dell'hub, mostrare errore e timeout tecnico. Tentare seconda sessione stesso account; C1–C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json): profilo atteso prima dell'hub con timeout tecnico (test), seconda sessione rifiutata. |
| [x] P06 | O toolbar, trasporto | Logout: SEND `/app/session/logout`, SUB `/user/queue/session/logout`, poi chiusura trasporto | Logout esplicito. Code rimosse, eventuale forfait, dati privati puliti; ACK o fallback senza promessa di ACK ricevuto; C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json): logout con conferma, forfait in partita, ritorno all'accesso. |
| [x] P07 | O registrazione | `/sign-up`: username alfanumerico, email, password/conferma, codice numerico 6 cifre; GET `/sign-up/users/{username}/available` e `/sign-up/mail/{mail}/available` (URL codificati) | Registrazione con stessi controlli. Testare disponibile/occupato e errore rete senza spinner infinito; C2. **Fatto** in [C2b-5](reports/client-c2-report.md#c2b-5--home-regole-e-registrazione): validatori del debug in unità; devAlice occupato, nome nuovo libero, errore di rete (502 a server spento) con modulo riattivato. |
| [x] P08 | C registrazione, email locale disabilitata | POST `/sign-up/verify` `{username,email}`, POST `/sign-up/register` `{username,password,email,code}` | Locale: errore di indisponibilità esplicito; ambiente SMTP dedicato: invio, codice valido/errato, account utilizzabile. Non promettere onboarding locale pubblico; C2. **Fatto per il profilo locale** in [C2b-5](reports/client-c2-report.md#c2b-5--home-regole-e-registrazione): `verify` osservato → 500 («Email is disabled»), messaggio di indisponibilità senza promessa di onboarding; `register` con codice errato → 409; nessun account creato. Percorso positivo con SMTP non provato (D4). |
| [x] P09 | O hub | Profile da `account/data`: username, email, role | Profilo leggibile per utente ordinario e ADMIN. Nessuna modifica profilo/recupero password inventata; C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica), [evidenza](reports/client-c2/c2b-6/profile-1366x768.json): scheda «Profilo» con nome, email («—» se assente) e ruolo; devAlice (USER) senza pannello e senza richieste ai log, account sintetico ADMIN con pannello. |
| [ ] P10 | O modalità HTML/TS, trasporto | SEND `/app/connections/users/tell/me`; SUB `/topic/connections/users` | Hub presenza: userLogin/activity, conteggio, ordinamento delle due colonne e paginazione equivalente a 5/10/20. Aggiornamento entrata/uscita; C2. |

## Code e modalità

| ID / stato futuro | Base / fonte debug | Percorso e API esistenti | Destinazione proposta e caso verificabile |
|---|---|---|---|
| [ ] P11 | O modalità, trasporto | Play → Quick 1vCom; SEND `/app/game/quick/1vCom/join` corpo playerId; SUB `/user/queue/game/quick/1vCom/ready` → gameId | Selettore → attesa → tavolo → esito → nuova partita con entrambi i personaggi (assegnazione casuale); C1. |
| [ ] P12 | O modalità, trasporto | Quick 1v1, SEND `/app/game/quick/1v1/join` playerId; ready privato `/user/queue/game/quick/1v1/ready` | Due account in attesa, pronti insieme; errore join se partita già riprendibile; C2. |
| [x] P13 | O modalità, trasporto | Quick FFA: SEND `/app/game/quick/ffa/join`; SUB `/topic/game/quick/ffa/joined`, ready privato `/user/queue/game/quick/ffa/ready` | Lista playerId/human, start automatico a cinque; tavolo cinque senza perdere sedi dopo eliminazione; C2. **Fatto** in [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): lista dal topic, avvio automatico a cinque, tavolo a cinque con posti stabili. |
| [x] P14 | O modalità, trasporto | FFA → Add Com Player: SEND `/app/game/quick/ffa/join/com`; lista joined | Aggiungere bot dopo iscrizione e osservare lista/start pieno; C2. **Fatto** in [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): «Aggiungi computer», lista e avvio pieno. |
| [x] P15 | O modalità, trasporto | FFA → Start: SEND `/app/game/quick/ffa/start` | Start anticipato a due, rifiuto se meno di due, nessuna lobby privata nuova; C2. **Fatto** in [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): «Inizia ora» a due; con un iscritto il pulsante è spento e nessuno start parte. |
| [x] P16 | O modalità, choose-deck-dialog | Open 1vCom → scelta mazzo salvato; SEND `/app/game/open/1vCom/join/{username}/{deckId}`; SUB `/user/queue/game/open/1vCom/{ready,error}` | Scegliere mazzo, annullare dialogo, avviare e gestire errore. Nessun open PvP; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom), [evidenza](reports/client-c2/c2b-4/decks-1366x768.json): dialogo con i mazzi salvati, annulla senza invio, open fino all'esito con personaggio e mano dal mazzo, «Nuova partita» con lo stesso mazzo. Errore `Deck unavailable` provocato riscrivendo il frame (non raggiungibile dalla UI con un account). |
| [x] P17 | O modalità, trasporto | Attesa/errore quick su `/user/queue/game/error`, open sul canale sopra; uscita SEND `/app/session/queue/leave`, ACK omonimo privato | Ingresso una volta, pulsanti bloccati mentre in coda, uscita libera l'utente e aggiorna FFA; bot senza umani rimossi dal server. Tornare a selezione; C2. **Fatto** in [C2b-1](reports/client-c2-report.md#c2b-1--modalità-e-code) e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): uscita con ACK, computer senza umani rimossi. |

## Catalogo ed editor (nessuna nuova regola R02)

| ID / stato futuro | Base / fonte debug | Percorso e API esistenti | Destinazione proposta e caso verificabile |
|---|---|---|---|
| [x] P18 | O catalogo/mazzi, collection-card e character-card | Hub → Collection → New/Edit; `account/data.collection.{cards,characters}` include nome, effetto, costo, priorità, flag e personaggi | Consultazione dell'intero catalogo e personaggi nei selettori; dettagli leggibili, immagini nuove. Non inventare una route catalogo già presente nel debug; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): 37 carte e 2 personaggi confrontati con `rules-catalog.json`, con illustrazioni O9. |
| [x] P19 | O mazzi TS | `account/data.decks`, New Deck crea struttura locale separata | Elenco e creazione con ID. Riferimenti al catalogo, personaggio/basic/last obbligatori, regolare ≥1, bound 0–5; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): elenco e «Nuovo mazzo»; bozze incomplete non inviabili; nome senza «/» (regolamento 1.8). |
| [x] P20 | O mazzi TS, editor | Edit copia il mazzo; nome readonly per esistente; Cancel scarta la copia; nessuna richiesta | Aprire, modificare e annullare; riaprendo trovare il salvato invariato; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): modifica su copia, nome bloccato, annulla senza SEND e salvato invariato. |
| [x] P21 | O editor | Slot personaggio/basic/last: un riferimento; bound aggiunte anche duplicate, Clear bound cards | Cambiare slot, aggiungere/rimuovere bound, conteggio basic+bound ≤6; nessun filtro compatibilità personaggio, limite copie o 20+2; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): legate ripetute fino a cinque (sei iniziali), «Svuota», legata Junkie in un mazzo Bruiser. |
| [x] P22 | O editor | Regular Deck: Search Card su JSON, toggle Collection/Deck, click aggiunge una copia o rimuove una copia omonima | Ricercare nome/testo, cambiare vista, aggiungere copie, rimuoverne una; mantenere ricerca equivalente e conteggi; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): ricerca sulla carta serializzata come il debug, vista Collezione/Mazzo, aggiungi e togli una copia omonima. |
| [x] P23 | O mazzi TS, trasporto | Save: SEND `/app/user/{username}/deck` UserGuiDeck; aggiornamento `account/data`, errore `account/error` | Creare e salvare; modificare e sovrascrivere stesso ID, caricamento/errore; usare poi in Open; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): salvataggio e sovrascrittura con un SEND e attesa di `account/data`; `account/error` tradotto; usato poi in open. |
| [x] P24 | O mazzi TS, trasporto | Delete: SEND `/app/user/{username}/deck/delete` UserGuiDeck (deckId); account aggiornato/errore | Eliminare mazzo sintetico e controllare scomparsa. Nessun vincolo artificiale sulle copie; C2. **Fatto** in [C2b-4](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom): cancellazione con conferma (annulla senza SEND), il mazzo sparisce da elenco e dialogo open. |

## Tavolo, comandi e ciclo di vita

| ID / stato futuro | Base / fonte debug | Percorso e API esistenti | Destinazione proposta e caso verificabile |
|---|---|---|---|
| [x] P25 | O partita, trasporto | Ready → subscribe `/topic/game/{id}/{move,update}`, `/user/queue/game/{id}/view`, `/user/queue/illegalMove`; SEND `/app/game/{id}/{playerId}/view` | Tavolo dalla vista privata. Propria mano array, altrui conteggio, `deck` numero. Due account isolati senza mano reciproca; C1–C2. **Fatto** in [C2b-1](reports/client-c2-report.md#c2b-1--modalità-e-code) (1v1) e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json) (FFA, due account isolati). |
| [x] P26 | O personaggio/oggetti, DTO | `players[id].character`: risorse, items/capacità, statuses, equip, immunities, timers, dead/bindingName; vista | Sedi stabili, valori numerici negativi/oltre iniziali, oggetti separati da equip; distinguere personaggio/azione/oggetto/token; ispezione senza JSON; C1–C2. **Fatto** in C2a e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): cinque posti, ventagli coperti, oggetti come carte. |
| [ ] P27 | O mano, assistente scelte | SEND `/app/game/{id}/move`: `playedCardName,playerId,targetId,gameId,choices` | Carta ordinaria, selezione esplicita SELF/OPPONENT, conferma e annullamento prima del SEND; nessun costo ottimistico; C1. |
| [ ] P28 | O mano, partita | Stesso comando con `choices.DISCARD_ONE` nome GUI di altra regolare | Bound: scarto obbligatorio, basic/bound/last non scartabili; correggere scelta incompleta, persistenza mostrata; C1. |
| [ ] P29 | O mano, assistente scelte | Stesso comando con `choices.TARGET_ITEM`; targetId SELF per NEAR_ITEM o proprietario per FAR_ITEM | Basic/Grab su oggetto proprio, Steal/Break su altrui; oggetto con nome contenente punti non confuso con proprietario. Copie per nome, niente ID inventato; C1. |
| [ ] P30 | O partita/trasporto; L nessun ACK correlato | `/user/queue/illegalMove` testo, move topic testuale, rilettura vista privata con pendingMove/turn/resolvedMoves | Distinguere scelta, invio, pending propria accettata e rifiuto correggibile; nessuna sostituzione dopo accettazione, nessun reinvio cieco. [Contratto](design/client-c0/interaction-contract.md); C1. |
| [ ] P31 | O partita, code-dialog | `resolvedMoves` ordinate e `moveReport`; `timeBasedEffects`, vista finale | Riepilogo mosse e fine turno consultabile senza Continue obbligatorio. Transizioni aggregate, nessun parsing frasi per simulare effetti intermedi; C1 poi C3. |
| [x] P32 | O partita; L ora server non campionata | `moveDeadlines/reconnectDeadlines` epoch, `pendingMove` | Clock indicativo sempre consultabile; zero locale non decreta forfait, vsCom senza timeout mossa. Provare pending stesso turno, scadenze simultanee e clock durante animazione/drop; C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json) e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): clock indicativo, pending, scadenze simultanee, tempo scaduto in FFA. |
| [x] P33 | O partita, trasporto | Leave SEND `/app/game/{id}/{playerId}/leave`; ACK `/user/queue/game/{id}/leave`; logout distinto | Abbandono/forfait senza modificare HEALTH; in FFA continuano superstiti, rientro hub distinto da esito. Idempotenza leave; C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json) e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): abbandono idempotente, in FFA continuano i superstiti. |
| [x] P34 | O partita, trasporto | Drop chiude solo SockJS; nuovo CONNECT stesso account → SEND `/app/session/resume`; SUB `/user/queue/session/resume` | Rientro prima termine: stessa partita/vista privata e pending, zero reinvii. Dopo termine: esito/forfait personale e stato corrente se FFA continua; C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json) e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): rientro prima/dopo il termine; in FFA forfait personale e stato corrente. |
| [x] P35 | O partita, resume I24 | `{status:finished,archived:true,gameId,outcome:{over:true,result:draw,winner:null,reason:"riavvio server"}}` **senza view** | Pannello esito, ritorno hub senza view/watch/leave/SEND vecchio match. Nessun checkpoint giocabile; C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json): riavvio orchestrato, ricevuta senza vista né SEND al vecchio match. |
| [x] P36 | O partita | `over,winner,outcomeReason,forfeits`; `winner=NONE` per draw nella vista | Vittoria/sconfitta/draw, morto distinto da forfait, riepilogo ed hub; mosse già inviate possono risolversi dopo morte autore; C1–C2. **Fatto** in [C2b-2](reports/client-c2-report.md#c2b-2--ciclo-di-vita-in-1v1), [evidenza](reports/client-c2/c2b-2/lifecycle.json) e [C2b-3](reports/client-c2-report.md#c2b-3--ffa-a-cinque), [evidenza](reports/client-c2/c2b-3/ffa-1366x768.json): vittoria, sconfitta con vincitore in FFA, pareggio, morto distinto da forfait. |
| [ ] P37 | L R03, assistente scelte | Nessun comando umano pass affidabile | Spiegare indisponibilità, ispezione/diagnostica/abbandono raggiungibili. Non garantire conclusione ogni configurazione; nessuna nuova regola; C1–C2. |

## Diagnostica, amministrazione e log

| ID / stato futuro | Base / fonte debug | Percorso e API esistenti | Destinazione proposta e caso verificabile |
|---|---|---|---|
| [x] P38 | O mano/personaggio | Log Card, Log State, Log Item scrivono dati già visibili in console; nessuna API aggiuntiva | Strumenti secondari espliciti con stessa portata privata. Aprire i tre strumenti, senza mani altrui/ordine mazzi; C1–C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica), [evidenza](reports/client-c2/c2b-6/profile-1366x768.json): Log Card/State/Item riaperti in 1v1 (due umani, prima e dopo un turno risolto, da entrambi i lati) e in FFA a tre; nessun nome della sola mano altrui, la mano altrui solo come numero. |
| [x] P39 | O code-dialog, partita | Log JSON espone riepilogo/risoluzione/dati già disponibili; simulazione disconnessione `dropConnection()` | Strumenti → JSON e Drop, mantenere log round/fine turno e rientro; non aggiungere archivio/replay UI; C1–C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica), [evidenza](reports/client-c2/c2b-6/profile-1366x768.json): Log JSON, messaggi ricevuti e giocatori riprovati in 1v1 e FFA con lo stesso controllo; la disconnessione simulata resta coperta da `Verify`/`VerifyModes`/`VerifyLifecycle`. |
| [x] P40 | C admin nel Profile, ruolo ADMIN STOMP | GET `/logs/back/games/qty`, GET `/logs/client/web/qty` | Diagnostica admin legacy: conteggi; visibilità pannello per ruolo, **autorizzazione HTTP Basic separata**. Locale senza Basic: indisponibilità/401, non successo; C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica) (ambiente di prova D5), [evidenza](reports/client-c2/c2b-6/profile-1366x768.json): conteggi uguali a quelli del server con Basic da variabili d'ambiente; senza Basic configurato, con credenziali errate o con il prompt nativo annullato su Edge → «Non autorizzato in questo ambiente», nessun successo. |
| [x] P41 | C admin | GET `/logs/back/games/open` | Elenco non concluse in altra vista/tab come debug; prova positiva solo Basic ADMIN configurato; account gioco ADMIN da solo non basta; C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica): tabella nel pannello (non una nuova scheda), uguale a `open` del server: le righe STARTED e IN_PROGRESS, non ENDED (righe sintetiche: quick e open non arrivano in LOG001). |
| [x] P42 | C admin | GET `/logs/back/games/drain`, GET `/logs/client/web/drain` | Download JSON, non cancellazione; file realmente leggibile su dati sintetici e assenza permessi gestita; C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica): due file JSON scaricati e letti, record uguali ai conteggi, conteggi invariati dopo il download; senza permessi 401 e nessun file. |
| [x] P43 | C admin | DELETE `/logs/back/games/delete`, DELETE `/logs/client/web/delete` | Conferma esplicita prima della richiesta; annullare senza DELETE, confermare su soli log sintetici e aggiornare conteggi; non tocca archivio LOG003; C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica): conferma in linea, «Annulla» senza DELETE, conferma con un DELETE per log su soli dati sintetici del database temporaneo, conteggi a 0 riletti, LOG003 invariato. |
| [x] P44 | O log errori, LogService, app.module; C `log.db` | POST `/logs/client/web/` `{timestamp,message,additional}`; ingestione pubblica, persistenza se abilitata | Conservare segnalazione errori, limite concorrenza/timeout e niente ricorsione se fallisce ingestione; proteggere credenziali, debug CONNECT disabilitato; C2. **Fatto** in [C2b-6](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica): errore, rifiuto non gestito ed errore JSON provocati → un POST ciascuno, salvati (`log.db: Y`), senza password, nome utente o dati della vista; ingestione rifiutata o bloccata: un invio alla volta, interruzione a 5 s, nessun ciclo; al massimo dieci per caricamento. |

## Chiusura e lacune

La parità futura richiede **P01–P44**, compresi i percorsi C: un servizio
disabilitato deve avere un errore coerente, e le prove positive vanno fatte
nell'ambiente dedicato. Non serve accenderlo nel profilo locale. Le eventuali
lacune della base non diventano autorizzazione a rimuovere percorsi.

Fonti server: [account REST](../server/src/main/java/com/gsc/bm/api/rest/users/UserSignUpController.java),
[account STOMP](../server/src/main/java/com/gsc/bm/api/ws/UserController.java),
[quick](../server/src/main/java/com/gsc/bm/api/ws/QuickGameQueuesController.java),
[open](../server/src/main/java/com/gsc/bm/api/ws/OpenGameQueuesController.java),
[sessione](../server/src/main/java/com/gsc/bm/api/ws/SessionLifecycleController.java),
[partita](../server/src/main/java/com/gsc/bm/api/ws/GameController.java),
[validazione](../server/src/main/java/com/gsc/bm/api/ws/MoveCommandValidator.java),
[viste](../server/src/main/java/com/gsc/bm/service/view/model/client/ClientGameView.java),
[sicurezza log](../server/src/main/java/com/gsc/bm/conf/http/HttpSecurityConfig.java).
Le sezioni storiche di `api.md` su URL registrazione, dead/turn, autorizzazioni,
resume e presenza non prevalgono su questi sorgenti correnti.

Restano L di protocollo: nessuna revisione monotona della vista, ID comando/
evento o ora server esplicita; nomi anziché ID istanza; report intermedi
testuali. L di giocabilità: umano senza mosse R03. Nessuno di questi limiti
viene risolto alterando server/regole in C0. L'export archivio STOMP/CLI non è
un percorso del debug da aggiungere al nuovo client.

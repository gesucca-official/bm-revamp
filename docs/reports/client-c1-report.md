# Rapporto C1 — Partita completa contro computer nel client web

27 ottobre 2026. Regolamento 1.6. Tappa avviata su istruzione esplicita del
proprietario, con il piano confermato: nuova cartella `client-web/`, scena C0
congelata, topic `update`/`move` usati solo come segnale.
Regolamento, server, catalogo SQLite e client debug **non sono modificati**.

## Esito in breve

| Livello | Stato |
|---|---|
| Implementazione | Login → quick 1vCom → partita → esito → nuova partita o hub, nel tavolo del bar C0 collegato al server reale. |
| Prove automatiche | 19 test unitari (modello e sessione con trasporto finto); typecheck e build; peso entro il budget C0. |
| Partite reali su server locale | **Sì.** Edge guidato da Playwright sul server Spring locale (`dev.ps1 -Task Server -SeedAccounts`), sulla build finale: 7 partite fino all'esito in due esecuzioni (4 a 1366×768, 3 a 844×390), entrambi i personaggi in ciascuna, con 3 vittorie, 3 sconfitte e 1 pareggio. |
| Emulazione | Formato landscape compatto 844×390 sullo stesso PC, con il mouse. Nessuna emulazione touch dei gesti. |
| Dispositivo fisico | **Non eseguito** in C1: drag col dito e risposta al tocco su iPhone restano da provare. |
| Valutazione umana | **Non eseguita**: prova umana A ancora da fare. |

Tutti i criteri automatizzabili di C1 sono soddisfatti con il server reale.
Restano aperti la prova umana A e la verifica fisica del drag (riserva B4 di C0):
la chiusura del gate spetta al proprietario.

## Dove vive il client e cosa è riusato

`client-web/` nasce dalla copia di `client-c0/revision`: scena Pixi, controller dei
gesti, modello di selezione, asset approvati. `client-c0/revision` non è stata
toccata, quindi misure e catture di C0 si possono ancora riprodurre. Le fixture
sintetiche restano solo nei test (`client-web/tests/fixtures.json`); il laboratorio
C0 e `window.__c0` non entrano nel nuovo client. Il Node isolato è lo stesso,
mentre dipendenze e lock sono separati. Nuove dipendenze a versione fissata:
`@stomp/stompjs` 7.1.1 e `sockjs-client` 1.6.1 (più `@types/sockjs-client` 1.5.4
solo per lo sviluppo). [README del client](../../client-web/README.md).

## Protocollo e separazione dello stato

- **Trasporto** (`src/net/stomp.ts`): REST `/rest/sign-in/validate`, poi SockJS
  `/ws` e CONNECT con login e passcode. Il debug di stompjs è spento, perché
  scriverebbe le credenziali. Ogni SUBSCRIBE chiede un RECEIPT, che il server
  conferma tramite `SubscriptionReceiptInterceptor`; il SEND parte solo dopo la
  ricevuta. Nessuna riconnessione automatica.
- **Destinazioni:** solo private `/user/queue/...` per resume, account, ready,
  vista, illegalMove e leave. I topic `/topic/game/{id}/update` e `/move` (riservati
  ai partecipanti, contenuto solo gameId o testo) servono soltanto a chiedere di
  nuovo la vista privata, come concordato. Mani avversarie: solo il conteggio,
  che diventa ventaglio di dorsi. Il modello rifiuta una vista con fronti
  avversari.
- **Stato autorevole** (`src/session.ts`): la sola vista privata accettata per
  gameId, turno e generazione di connessione. Al massimo una richiesta di vista
  in volo; le notifiche arrivate nel frattempo si accodano in un'unica richiesta.
- **Selezione locale** (`src/model.ts`): ordine della mano, carta, bersaglio e
  scarto. Il check produce un solo comando a cinque campi; costi, carte e risorse
  cambiano solo con la vista del server. Un rifiuto conserva la scelta e il motivo.
- **Animazione** (`src/scene.ts`): voli e delta aggregati derivati da due viste
  consecutive, con chiave `gameId:turn`. Le carte avversarie sono identificate
  solo dal nome pubblicato in `resolvedMoves` e illustrate con il catalogo
  dell'account (`collection`). Nessun parsing dei report per inventare effetti.
- **Disconnessione:** stato «incerto» e pannello «Linea caduta». Il rientro è
  esplicito: stesso account, sottoscrizioni, `resume`, poi la vista. Nessun
  reinvio. La ricevuta di riavvio senza vista porta all'hub senza toccare il
  vecchio gameId (coperta da test unitario, non provata con un riavvio reale).

## Evidenze delle partite reali

Fonti: [verify.json](client-c1/verify.json) (1366×768) e
[verify-844x390.json](client-c1/verify-844x390.json), con le
[catture](client-c1/screens/). Script ripetibile: `./client-web/run.ps1 -Task Verify`.
I numeri di questa tabella vengono dalle due esecuzioni finali della commit
`82a4080`. Dopo O1/O5 `verify.json` e le catture a 1366×768 sono state
rigenerate da un nuovo giro (sezione «Residui C1 O1 e O5»); le versioni
precedenti restano nella storia git.

| Criterio C1 | Evidenza |
|---|---|
| Una partita completa con ciascun personaggio | 1366×768: Spazienzio ×3 (2 sconfitte, 1 pareggio con `winner` `NONE`), Tossico ×1 (vittoria). 844×390: Spazienzio ×2 (vittoria, sconfitta), Tossico ×1 (vittoria). Assegnazione casuale del server, su più avvii. |
| Bound con scarto | 47 bound in totale, per esempio «Ghigno co' i' Denti Marci» con `DISCARD_ONE` di una regolare. [Cattura](client-c1/screens/03-bound-discard.jpg) |
| Bersaglio oggetto | 11 mosse su oggetti, per esempio la basic «Desiderio Incontrollabile» su `SELF` con `TARGET_ITEM` «Tennents Super», oppure Steal su oggetti avversari con il proprietario come `targetId`. |
| Effetto periodico letto | Riepilogo non bloccante → «Ultimo turno» → *Fine turno*: «Tu: (TOXICITY effect) HEALTH: 100->98 (-2)» (1366). A 844×390 la sezione letta riporta invece la scadenza di uno stato, non un effetto periodico di risorsa. [Cattura](client-c1/screens/05-periodic-report.jpg) |
| Esito e ritorno all'hub senza JSON | Pannello «Hai vinto / Hai perso / Pareggio» con motivo, «Nuova partita», «Torna all'hub», «Ultimo turno»; il leave confermato riporta all'hub. [Esito](client-c1/screens/06-outcome-2.jpg), [hub](client-c1/screens/07-hub-return.jpg) |
| Calata con drag e con click/tap | Una calata trascinata per esecuzione, le altre con click carta → click bersaglio → ✓. Durante il drag `ghostOver` è vero sul bersaglio compatibile. |
| Riordino senza mosse | Drag della prima carta in fondo alla mano: ordine cambiato, 0 SEND di mossa, contatore comandi invariato. |
| Un rifiuto lascia correggere | 17 rifiuti reali del server («cant be cast with current resources»): in tutti scelta e bersaglio restano sul tavolo e si sceglie altro. [Cattura](client-c1/screens/04-rejection.jpg) |
| Nessun costo anticipato | Il modello non modifica la vista dopo il check (test unitario). Nella prova reale le risorse cambiano solo con la vista successiva. |
| Un SEND per conferma | Verificato a ogni mossa sui frame STOMP inviati: solo SEND `/app/game/{id}/move`, la SUBSCRIBE al topic non conta. |
| Disconnessione senza reinvii | «Simula disconnessione» → «Rientra», in entrambe le esecuzioni: stesso turno, ordine della mano conservato, 0 SEND di mossa. [Cattura](client-c1/screens/02-lost.jpg) |
| Errori pagina | 0 in entrambe le esecuzioni. |
| Caso senza mosse valide | Mai incontrato nelle prove. Il menu spiega il limite R03 e offre l'abbandono; lo script lo registrerebbe in `noValidMove`. |

**Riserva drag (B4).** La carta presa si stacca dalla mano a grandezza piena, con
ombra, e segue il puntatore. Su touch resta sopra il dito, sul mouse appena sotto
il cursore. Al suo posto resta una sagoma tenue e le altre carte aprono uno
spazio dove cadrebbe. Su touch il bersaglio si riconosce anche sotto la carta
sollevata. Catture a metà gesto: [calata](client-c1/screens/02-play-mid-drag.jpg)
e [riordino](client-c1/screens/02-reorder-mid-drag.jpg). Il comportamento con il
dito su iPhone **non è verificato**.

**Risposta all'input.** È misurata su PC, da Edge headless, come tempo fra input
e frame successivo: p50 12,6 ms, p95 15,4 ms, massimo 20,2 ms su 345 campioni a
1366×768; p50 12,2 ms, p95 15,3 ms su 343 campioni a 844×390. Non è confrontabile con i 116 ms misurati su
iPhone. Il ridisegno completo a ogni tocco resta. In C1 non è emerso un ritardo
percepibile, quindi il ridisegno incrementale resta in C4. La misura sul
telefono va ripetuta.

**Peso.** JS 276 KB gzip, totale 963 KB su un budget invariato di 1024 KB
([size.json](client-c1/size.json)). Il margine si è ridotto con STOMP/SockJS:
va tenuto d'occhio in C2.

## Residui C1 O1 e O5

Dopo la prima prova il proprietario ha chiesto due ritocchi
([osservazioni](../client-roadmap.md#osservazioni-del-proprietario-dopo-c1)):

- **O1:** tolti il pulsante «Riordina» e la modalità di scambio con due tocchi.
  Il riordino resta trascinando nella mano; da tastiera Maiusc+frecce spostano
  la carta con il focus di una posizione, solo in locale.
- **O5:** tolto «Dettagli carta». Un pulsante (i) compare sull'angolo in alto a
  sinistra della carta: passando il mouse su carte in mano, personaggi e oggetti,
  oppure sulla carta scelta o con il focus. Su touch basta scegliere la carta.
  L'angolo sinistro resta visibile anche nel ventaglio, dove ogni carta copre
  il lato destro della precedente. Area di tocco di 44 px con disco visibile di
  28 px; la tastiera mantiene I.

Verificati sul server reale a 1366×768 ([verify.json](client-c1/verify.json),
`checks.o1o5`, [cattura](client-c1/screens/02-info-hover.jpg)): nessun pulsante
«Riordina» o «Dettagli carta»; la (i) all'hover apre la carta indicata; la (i)
sulla carta scelta apre quella carta; Maiusc+freccia scambia le prime due
carte senza SEND di mossa. Le altre prove dello stesso giro restano verdi:
3 partite fino all'esito con entrambi i personaggi, rientro, 0 errori pagina,
input p95 15,1 ms su PC. L'esecuzione a 844×390 e le sue catture risalgono a
prima di O1/O5 e mostrano ancora i vecchi pulsanti. Sul telefono la (i) non è
provata.

## Difetti trovati e corretti durante C1

1. **Origine STOMP.** Il profilo `local` accetta solo `http://localhost:4200`, e
   CONNECT da `127.0.0.1:4320` riceveva 403. Il server non è stato toccato: il
   proxy di loopback presenta l'origine ammessa solo per le richieste che
   arrivano dalla pagina stessa del client; le altre origini restano respinte.
2. **Leave seguito da una richiesta di vista.** Il leave pubblica `update`, e la
   rilettura che seguiva verso la partita appena chiusa veniva negata dal server
   con chiusura della connessione. Ora il client smette di ascoltare la partita e
   di richiedere viste prima del leave. È coperto da test.
3. Etichetta del turno (il server conta da 0), messaggio di rifiuto conservato
   dopo la rilettura nello stesso turno, `winner` `NONE` mostrato come pareggio.

## Limiti e riserve aperte

- **Prova umana A** (due persone, partite vsCom, le tre domande): non eseguita.
- Su touch il riordino si fa solo trascinando: lo scambio con due tocchi è tolto
  per scelta del proprietario (O1).
- **Dispositivo fisico:** drag col dito, sollevamento sopra il dito e risposta al
  tocco non verificati su iPhone 16 Pro. Nessuna emulazione touch dei gesti.
- **Tastiera:** i percorsi da tastiera sono quelli della scena C0, non
  riverificati sul server reale.
- **Testo dei rifiuti:** mostrato com'è in inglese («cant be cast with current
  resources»). Tradurlo senza toccare il server richiede una tabella di
  corrispondenze lato client: da decidere in C2 o C4.
- **Rifiniture rinviate a C4:** a 844×390 il messaggio di stato tocca il riquadro
  di conferma; l'etichetta SCARTO resta in parte sotto la carta vicina; il
  pannello d'esito copre in parte la sede avversaria.
- **Clock:** contro computer non c'è timeout mossa, quindi il countdown è nascosto.
  Il conto alla rovescia indicativo multiplayer (C2) non è stato provato.
- **Riavvio server e scadenze:** coperti solo dai test della sessione e dalla
  base server; non riprovati dal nuovo client (C2).
- `window.__bm` espone in sola lettura lo stato della propria pagina per la
  verifica automatica: da rivalutare prima di C5.
- Il pass umano senza mosse resta un limite R03 della base.

## Verifiche del repository

Eseguite una volta dalla radice, dopo le modifiche al codice. In seguito è
cambiata solo una protezione contro il doppio leave in `client-web`, ricontrollata
con test, build e le due esecuzioni reali finali:

| Comando | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | PASS: server 251 test, client debug 36/36 |
| `python scripts/check-rules.py` | PASS: regolamento e copia client allineati, SQLite integro |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | PASS: 358 test con contesto Spring completo |
| `python scripts/verify-match-manifests.py` | PASS (`allChecks`) |
| `./client-web/run.ps1 -Task Test`, `Build`, `Size` | 19/19, build ok, peso PASS |
| `./client-web/run.ps1 -Task Verify` (1366×768 e 844×390) | partite reali complete, criteri soddisfatti |

Il jar del server è stato ricompilato dai sorgenti correnti
(`build.ps1 -Task Server -Offline`) prima delle partite reali, senza modifiche
ai sorgenti.

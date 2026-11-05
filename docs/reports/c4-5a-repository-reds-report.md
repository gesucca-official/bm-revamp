# C4-5a — Diagnosi dei due rossi del repository

5 novembre 2026. Diagnosi dei due rossi emersi nel giro di C4-5a (commit `a9921d1`) e rimasti fuori dal perimetro grafico, registrati in [`client-c4/c4-5a/repository/diagnostica.json`](client-c4/c4-5a/repository/diagnostica.json) e nella sezione C4-5a del [report C4](client-c4-report.md). **Nessuna regola di gioco cambiata**, nessuna soglia o atteso di gioco rilassato, nessun manifest I22 tracciato rigenerato. `client-web/` non toccato.

## 1. `WebSocketIdentityTest.databaseFailureReturnsPrivateGenericError`

**Esito: difetto del test (gara), preesistente a C4. Il server si comporta come progettato.**

### Preesistente, non nuovo

- Il test ha la stessa forma dal commit `c2fd60f` (26 ottobre, rinomina del server). Fra `c2fd60f` e `a9921d1` i file `conf/ws/*` e `UserController` differiscono solo per i fine riga (374/374 righe, CRLF→LF).
- Fra `a807aa0` (ultimo commit prima di C4) e `a9921d1` la differenza in `server/`, `scripts/`, `docs/game-rules.md` e `docs/rules-catalog.json` è **vuota**: C4 non può aver cambiato il comportamento del server.

### Causa, con prove

Il test fa `subscribe("/user/queue/account/error")` e subito `send("/app/user/profileFailure/account")`. Sul server i due frame arrivano in ordine, ma vengono **gestiti in parallelo** da thread diversi del pool `clientInboundChannel` (pool di 2 per core: 64 thread qui). La risposta d'errore (`@SendToUser`) viaggia sul broker senza attendere la registrazione della sottoscrizione: se la precede, non c'è nessun destinatario e il messaggio viene scartato. Il test aspetta 4 s e vede `null` (riga 162).

Sonda temporanea (fuori dal repository, non committata), con un `ExecutorChannelInterceptor` su `clientInboundChannel` e `brokerChannel` in un contesto Spring reale. Traccia di un caso mancato, 1500 sessioni nuove (ogni iterazione: connessione, stub, subscribe, send, disconnessione):

```
inbound begin SEND /app/user/probeUser/account        clientInboundChannel-42
broker  begin MESSAGE /queue/account/error-user<sid>  SimpleBrokerMessageHandler   (t0)
...
inbound begin SUBSCRIBE /user/queue/account/error     UserDestinationMessageHandler clientInboundChannel-37
broker  begin SUBSCRIBE /queue/account/error-user<sid> SimpleBrokerMessageHandler   (t0 + 34 µs)
```

Il broker tratta la risposta 34 µs prima di registrare la sottoscrizione, su un altro thread. Nei casi riusciti l'ordine è l'opposto.

| Variante (sonda, stesso contesto Spring) | Mancati |
|---|---|
| Sessione già aperta e calda, subscribe+send ripetuti | 0 / 300 |
| Sessioni nuove (come il test), traccia leggera | **27 / 1500 (1,8%)** |
| Sessioni nuove, traccia dentro i gestori (rallenta il server) | **122 / 1500 (8%)** |
| Sessioni nuove, subscribe con `receipt` e attesa del RECEIPT prima del send | **0 / 1500** (con la stessa traccia pesante) |

La gara dipende da temporizzazione e carico, ed è per questo che il metodo da solo risulta verde.

### Tassi sui commit

Il tasso per esecuzione del test è basso (circa 1-2% per il singolo metodo), quindi campioni di poche decine di esecuzioni **non distinguono** commit diversi; il confronto prova che non c'è una differenza di codice, non che il tasso sia misurato con precisione.

| Prova | Esiti |
|---|---|
| Giro completo `TestServerContext`, `a9921d1`, C4-5a (giro originale) | 1 rosso (questo test) |
| Giro completo, `a9921d1`, rieseguito qui | 3 verdi su 3 (373 test) |
| Classe `WebSocketIdentityTest` da sola, `a9921d1` | 7 verdi su 7 (un ottavo giro non completato) |
| Solo il metodo, `a9921d1` | 6 verdi su 6 |
| Giro completo, `a807aa0` (prima di C4, server identico) | 2 verdi su 2 validi |
| Giro completo, `c2fd60f` (26 ottobre, 358 test) | 2 verdi su 2 validi |

Il primo giro di `a807aa0` e di `c2fd60f` non è valido: lanciato con Maven direttamente, senza la cartella `.build-logs` che crea `build.ps1`, i test CLI falliscono con `NoSuchFile` (38 errori). Escluso dai conteggi.

### Correzione applicata

[`WebSocketIdentityTest`](../../server/src/test/java/com/gsc/bm/WebSocketIdentityTest.java): `subscribeConfirmed` sottoscrive con header `receipt` e attende il RECEIPT (il server lo invia dopo la registrazione, via `SubscriptionReceiptInterceptor`, già coperto da `SubscriptionReceiptTest`) prima del `send`. Il client di test riceve un `TaskScheduler` daemon, necessario per seguire le ricevute. **Non indebolisce il test**: le asserzioni (errore privato non nullo, testo `Account data unavailable`, nessun dettaglio del database) sono invariate; si aggiunge solo l'attesa della sottoscrizione, che è la precondizione che il test dava per scontata.

### Non corretto, da sapere

Gli altri test della classe (`quickJoinReadyAndFirstRoundAgainstRealBot`, `privateGameViewValidMoveAndRejectedCommandsPreserveState`, `directConnectPrivateReplyDuplicateRejectionAndReconnect`) usano lo stesso schema «subscribe poi send» e hanno la stessa gara latente, con tasso verosimilmente simile. Non cambiati per restare nella correzione minima; `subscribeConfirmed` è pronto per estenderli. Proposta: estenderla a quei siti in un intervento dedicato.

## 2. `verify-match-manifests.py` e `rulesVersion`

**Esito: atteso obsoleto dello script, non un difetto delle evidenze né del server.**

### Da quando è rosso

L'audit (I19c, 26 ottobre, regolamento 1.6) richiedeva `rulesVersion == "1.6"`. Le evidenze in `.build-logs/` non sono tracciate: sono **rigenerate a ogni giro del contesto Spring** e il server le marca con la versione del regolamento che ha caricato (`MatchVersions`). Dal regolamento 1.7 (`40d8d35`, 27 ottobre) ogni giro fresco produce export 1.7 e quindi l'audit fallisce; poi 1.8 (`9b806b8`), 1.9 (`32d30b8`) e 1.10 (`e47a0a9`, 2 novembre, versione attuale). Prova: sulle evidenze fresche prodotte da `a9921d1` (tutte 1.10) il vecchio script fallisce alla riga 53 (`assert versions["rulesVersion"] == "1.6"`). Il rosso non dipende da C4.

### Cosa deve verificare davvero

Non la versione 1.6, e nemmeno «la versione corrente» in astratto: che gli export siano stati prodotti dal **regolamento, dal catalogo e dall'annesso presenti nel repository che si sta verificando**. Gli export portano `rulesVersion`, `rulesSha256`, `catalogSha256`, `rulesCatalogSha256`. Lo script ora ricava gli stessi valori dai file del repository, replicando `MatchVersions` (testo del regolamento con CRLF→LF; byte di `cards.sqlite` e `rules-catalog.json`), e pretende che ogni export li riporti. Evidenze prodotte da un regolamento o catalogo diverso, in particolare vecchie, falliscono con un messaggio che mostra l'atteso e l'osservato; nessun controllo è stato rilassato, ma ora è agganciato alla fonte normativa invece che a una costante.

- Il manifest scritto in `.build-logs/i19c-manifest.json` riporta `rulesVersion` e `rulesSha256` effettivi (non più `"1.6"` fisso).
- `codeSha256` resta controllato solo come impronta (64 caratteri): dipende dalla build e non ha un riferimento nel repository.
- **Manifest I22 tracciati non toccati**: [`i22-candidate.json`](i22-candidate.json) e `scripts/i22-candidate.py` dichiarano `rulesVersion: 1.6` perché sono la fotografia storica della base I22 approvata; lo script di audit non li legge. Rigenerarli per far coincidere la versione sarebbe falsare quella storia.
- Resta storico anche il [report I19c](i19c-report.md) (regolamento 1.6).

### Verifica

Sulle evidenze fresche del giro completo su `a9921d1`, il nuovo script passa con gli stessi conteggi di I19c: 12 casi del ciclo di vita (169 eventi), 12 chiusure di riavvio (36 eventi), 7 conclusioni ordinarie (563 eventi). Il vecchio script, sulle stesse evidenze, fallisce alla riga 53.

## Verifiche finali

Eseguite sul worktree con le modifiche di questo rapporto (test corretto, audit corretto, documenti):

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` (include `check-rules.py` e i test client-debug) | verde, 266 test server ordinari, exit 0 |
| `python scripts/check-rules.py` | verde |
| `./scripts/build.ps1 -Task TestServerContext -Offline`, tre giri | **3 verdi su 3**, 373 test, 0 fallimenti |
| `python scripts/verify-match-manifests.py` sulle evidenze del giro precedente | verde: 12 casi / 169 eventi, 12 / 36, 7 / 563 |

Tre giri verdi non provano l'assenza della gara in sé (tasso originale circa 1-2% per esecuzione): la prova è nella sonda (0 / 1500 con ricevuta contro 27-122 / 1500 senza).

## Non verificato

- Il tasso reale del test sul giro completo: i campioni sono troppo piccoli per un confronto statistico fra commit; la prova della causa poggia sulla sonda (1500 iterazioni) e sulla traccia, non sui giri completi.
- La sonda usa un singolo utente con stub di `findById` e un interceptor che altera la temporizzazione: i tassi assoluti non sono trasferibili al test reale, solo l'ordinamento e l'effetto della ricevuta.
- Gli altri siti «subscribe poi send» della classe: gara latente non misurata.
- L'audit controlla la coerenza con il repository corrente: non può dire se le evidenze siano state generate da una build sporca (cfr. `codeSha256`).

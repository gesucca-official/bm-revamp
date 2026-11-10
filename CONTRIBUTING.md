# Contribuire a Botte Micidiali

Prima di lavorare leggere [AGENTS.md](AGENTS.md), la [guida locale](docs/setup.md)
e il [regolamento](docs/game-rules.md) con i documenti di set ([Set Base](docs/sets/base.md)),
fonte normativa del gioco.

Ogni cambiamento deliberato al comportamento richiede prima una versione e una
motivazione nel regolamento (sistema) o nel documento del set (carte), poi test, codice, descrizioni SQLite e copia client
nella stessa modifica. Non aggiornare gli attesi per accettare regressioni.

Prima di proporre una modifica eseguire dalla radice:

```powershell
./scripts/build.ps1 -Task Test -Offline
python scripts/check-rules.py
./scripts/build.ps1 -Task TestServerContext -Offline
python scripts/verify-match-manifests.py
```

Il contesto completo verifica anche l'avvio e gli scenari applicativi; i soli
unit test non lo sostituiscono. Nella proposta descrivere problema, risultato e
verifiche realmente eseguite, indicando eventuali limiti.

Per il client web le verifiche e le misure ufficiali sono nel [README del client](client-web/README.md#lancio-unico-c4-1-o23)
e nel [piano C4](docs/client-c4-plan.md#obiettivo-e-regole-comuni): 1366×768 e 844×390 per tutte, e dal 10 novembre 2026
anche **1920×1080 per `Verify` e `VerifyLayout`** (C4-11). Da C4-1c il giro predefinito la include per queste due sole verifiche.
Consolidamento e matrice completa di fine C4 (D16):

```powershell
./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa'
./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa' -Publish docs/reports/client-c4/<blocco>
```

Una sola VerifyAll per macchina; aim e layout da sole alla fine, dopo 15 s di quiete. Senza `-Parallel` resta la serie su 8080/4320.
N>4 non equivale al consolidamento e non pubblica; ogni parte divisa ha 15 min di tempo massimo, poi rosso con log e processi propri chiusi.
Sull'altra macchina nessun obbligo di parallelo: prima un giro di prova con `-Parallel 2 -Split 'resolution,ffa'`.
Un rosso del pool si rilancia da solo a macchina ferma, prima di attribuirlo; per esempio (stesso jar ricostruito in precedenza):

```powershell
./client-web/run.ps1 -Task VerifyAll -ReuseJar -Only 'test,build,size,ffa' -Measures 844x390
```

`-Only`, `-Measures`, `-Quick`, `-ReuseJar` e `-ReuseClient` dichiarano giri parziali o riusi nel riepilogo; per `-Only` includere sempre
`test,build,size`. `-Measures 1920x1080 -Only 'test,build,size,verify,layout'` resta disponibile come giro dichiarato, non pubblicabile.
Per blocco valgono le verifiche mirate D16; la matrice completa si esegue alla fine di C4.

Non includere database applicativi, journal di recupero, credenziali, cache o
log locali. Il catalogo `server/src/main/resources/cards.sqlite` e i PDF di
stampa già prodotti sono invece parte del repository. Non rigenerare i manifest
I22 per farli corrispondere a modifiche successive: documentano una base storica.

## Diritti

Il progetto mantiene la precedente indicazione «All rights reserved».
Non è stata concessa una licenza open source né definito un accordo standard
per i contributi. Concordare con il proprietario le condizioni prima di inviare
codice o materiali; la pubblicazione non modifica i diritti preesistenti.

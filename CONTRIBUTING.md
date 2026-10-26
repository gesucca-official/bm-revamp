# Contribuire a Botte Micidiali

Prima di lavorare leggere [AGENTS.md](AGENTS.md), la [guida locale](docs/setup.md)
e il [regolamento](docs/game-rules.md), fonte normativa del gioco.

Ogni cambiamento deliberato al comportamento richiede prima una versione e una
motivazione nel regolamento, poi test, codice, descrizioni SQLite e copia client
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

Non includere database applicativi, journal di recupero, credenziali, cache o
log locali. Il catalogo `server/src/main/resources/cards.sqlite` e i PDF di
stampa già prodotti sono invece parte del repository. Non rigenerare i manifest
I22 per farli corrispondere a modifiche successive: documentano una base storica.

## Diritti

Il progetto mantiene la precedente indicazione «All rights reserved».
Non è stata concessa una licenza open source né definito un accordo standard
per i contributi. Concordare con il proprietario le condizioni prima di inviare
codice o materiali; la pubblicazione non modifica i diritti preesistenti.

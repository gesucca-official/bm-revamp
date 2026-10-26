# Regole di progetto

La fonte normativa del gioco è `docs/game-rules.md`. Prevale su codice, test,
catalogo e documentazione storica. Prima di cambiare un comportamento di gioco,
aggiornare esplicitamente il regolamento con versione e motivazione, poi adeguare
test, codice, descrizioni SQLite e copia client nella stessa modifica.
Non aggiornare gli attesi dei test per accettare regressioni non deliberate.

Verifiche: `./scripts/build.ps1 -Task Test -Offline` e
`python scripts/check-rules.py`. Il contesto Spring completo ha una verifica
separata: non confondere test unitari verdi con avvio applicativo riuscito.

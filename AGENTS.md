# Regole di progetto

La fonte normativa del gioco è il regolamento `docs/game-rules.md` insieme ai
documenti di set in `docs/sets/` (oggi `docs/sets/base.md`). Prevalgono su codice,
test, catalogo e documentazione storica. Il regolamento governa il sistema, la
scheda del set governa la carta e deroga a una regola solo se lo dice
esplicitamente (R00). Prima di cambiare un comportamento di gioco, aggiornare
esplicitamente il documento interessato con la sua versione e la motivazione
(il regolamento per il sistema, il documento del set per le carte), poi adeguare
test, codice, catalogo e descrizioni SQLite, allegato e copie client nella stessa
modifica.
Non aggiornare gli attesi dei test per accettare regressioni non deliberate.

Verifiche: `./scripts/build.ps1 -Task Test -Offline` e
`python scripts/check-rules.py`. Il contesto Spring completo ha una verifica
separata: non confondere test unitari verdi con avvio applicativo riuscito.

Metodo di lavoro fra proprietario, chat di regia ed esecutori:
`docs/orchestrazione-lavoro.md`. Lo stato del progetto è in `docs/README.md`.

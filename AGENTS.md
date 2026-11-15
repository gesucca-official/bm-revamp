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

Verifiche: si scelgono secondo ciò che la modifica tocca, dalla tabella
`docs/aree-protette.md` (fonte unica della scelta; i comandi sono in
`CONTRIBUTING.md`). Per il server sono di norma
`./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`.
Il contesto Spring completo ha una verifica separata: non confondere test
unitari verdi con avvio applicativo riuscito.

Metodo di lavoro fra proprietario, chat di regia ed esecutori:
`docs/orchestrazione-lavoro.md`. Lo stato del progetto è in `docs/README.md`.

- Se ti viene detto che sei la **regia** di un filone: leggi il metodo, poi il
  riquadro «Ripartenza» in testa al piano del filone (i piani sono elencati in
  «Filoni attivi» di `docs/README.md`).
- Se sei un **esecutore**: segui il prompt e il contratto dell'esecutore nel
  metodo. Non scrivere fuori dal perimetro del prompt, niente push, niente
  azioni fuori dal repository.

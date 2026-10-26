# I11 — Risoluzione, isolamento e rollback locale

23 ottobre 2026. Completato il confine di risoluzione del servizio partite e verificata la conformita di priorita, stati e timer. **Regolamento aggiornato prima dell'implementazione alla versione 1.1.** Nessuna partita completa o nuova sessione browser certificata da I11.

## Decisioni normative e correzioni

[game-rules.md](../game-rules.md), R05/R08 e sezione Revisioni, supera l'eccezione 1.0 che conservava stati condivisi. Ogni applicazione di MadeOfStone e BrokenBeerBottle crea ora uno stato distinto, anche riusando lo stesso oggetto carta. MadeOfStone parte sempre da durata 3; BrokenBeerBottle mantiene singleUse, durata zero dopo consumo e riutilizzo nello stesso turno. Moltiplicatori, costi, effetti e composizioni starter non cambiano.

Aggiornati insieme copia client, versione e descrizioni di rules-catalog.json e i 37 riferimenti di versione nel catalogo sorgente cards.sqlite. I soli testi di effetto modificati sono quelli relativi ai due stati ora indipendenti. Il catalogo applicativo degli account non viene migrato. Il token riporta la stessa semantica nel testo interno; il vecchio hook non eseguito da Grab di RottenBeer usa la factory dello stato nuovo, senza cambiare il percorso di consumo previsto da R07.

R04 gia richiedeva parita per ordine dei partecipanti nella partita. Game usava HashMap e stabilita dell'ordine di invio delle mosse; un test storico approvava quest'ultimo comportamento, in contrasto con il testo normativo. Corretti mappa e terzo criterio del comparatore, e aggiornato esplicitamente quel test alla regola. La modifica all'atteso e motivata da questo conflitto, non da un fallimento accidentale. Priorita e ALERTNESS dopo i costi restano i primi due criteri.

Fonti: [MadeOfStone](../../bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/MadeOfStone.java), [BrokenBeerBottle](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/tokens/BrokenBeerBottle.java), [Game](../../bm-server/src/main/java/com/gsc/bm/model/game/Game.java), [RulesConformanceTest](../../bm-server/src/test/java/com/gsc/bm/model/game/RulesConformanceTest.java).

## Transazione locale del servizio

[GameSessionServiceImpl.submitMoveToGame](../../bm-server/src/main/java/com/gsc/bm/service/session/GameSessionServiceImpl.java) serializza uno snapshot dell'intero grafo Game prima dell'ultimo comando. Sul grafo vivo esegue submit, mosse automatiche e risoluzione, mantenendo il monitor del servizio. Gli eventi dei turni completati vengono accumulati localmente: logging e notifica update partono dopo il successo della risoluzione.

Una RuntimeException durante submit/risoluzione ripristina tramite Game.restoreFrom giocatori, risorse, mano, mazzo, stati, timer, pending/resolved moves, effetti temporali, turno e log interni. Le mosse gia presentate dagli altri restano; l'ultimo comando fallito viene rimosso, consentendo il nuovo tentativo. Gli errori di mossa mantengono il loro messaggio, gli altri errori di risoluzione producono un messaggio generico tramite il canale privato di GameController. Il ripristino puo sostituire riferimenti interni: i chiamanti devono usare lo stato autorevole del Game, non conservare un vecchio riferimento Player.

snapshotGame acquisisce lo stesso monitor prima di copiare il grafo; GameController usa lo snapshot sia per validare il comando sia per estrarre la vista. Una vista non puo leggere risorse temporaneamente modificate a meta risoluzione. getGame resta un accesso interno al grafo vivo e non e un'API di lettura atomica per chiamanti arbitrari. Il registro delle partite e ora di istanza del servizio, anziche statico; nella normale applicazione resta un singleton Spring.

Dopo il commit, errori di logging o callback update vengono registrati e non annullano il round. Non sono garantiti recapito o persistenza degli eventi falliti: nessun outbox/retry aggiunto, raccolta completa resta I19. Il rollback non copre crash, Error fatali JVM, effetti esterni arbitrari o lo stato globale di Math.random. Le chiamate dirette al motore Game fuori dal servizio non acquisiscono questa garanzia. Nessuna transazione distribuita, restore dopo riavvio o nuova regola di esito introdotti.

## Verifiche

Nuovo [RoundIsolationTest](../../bm-server/src/test/java/com/gsc/bm/model/game/RoundIsolationTest.java), cinque scenari:

- Eccezione dopo costo ed effetto: ripristino risorse, stati, timer e mossa precedente; nessuna pubblicazione; nuovo tentativo valido completa il round.
- Eccezione in timer dopo danni/scarti: salute, costi, countdown e pending ripristinati.
- Lettura snapshot concorrente: resta in attesa durante l'effetto e riceve lo stato ripristinato, non quello intermedio.
- Due partite e applicazioni ripetute: durata MadeOfStone e consumo BrokenBeerBottle indipendenti.
- Errori di logger e callback dopo commit: round e danni restano conclusi, senza rollback o richiesta duplicata implicita.

Regressioni esistenti RulesConformanceTest: priorita, ALERTNESS dopo costo, parita secondo partecipanti, counter con costi/scarti, morte durante round e morte reciproca, singleUse applicabile due volte nel turno, durata zero/uno, stacking danni/primo modificatore risorsa, timer e fase periodica. Aggiornato il caso che richiedeva identita condivisa secondo la revisione 1.1. Non vengono estese le garanzie a ogni combinazione possibile di carte.

La suite completa conserva le prove I09/I10 sul trasporto reale: comandi rifiutati, vista privata, join quick e primo round deterministico col bot restano verdi.

| Comando | Risultato |
|---|---|
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 137 server, zero failure/error/skipped |
| `./scripts/build.ps1 -Task Test -Offline` | 83 server ordinari e 18 client verdi |
| `./scripts/build.ps1 -Task Client -Offline` | Build riuscita, warning bundle iniziale 2,22 MB oltre budget 2 MB gia noto |
| `./scripts/build.ps1 -Task Server -Offline` | JAR prodotto con catalogo 1.1 |
| `python scripts/check-rules.py` | Versione, R07, copia client, 37 testi, starter e integrita SQLite allineati |

Log: `.build-logs/i11-context-final.log`, `i11-tests-final.log`, `i11-client.log`, `i11-server.log`. Errori iniziali di compilazione (tipo del comparatore, riferimento al vecchio stato condiviso e dichiarazione var del nuovo test) risolti; risultati finali separati dai tentativi iniziali. Nessuna credenziale reale, SMTP o database condiviso usati. Modifica SQLite limitata al catalogo sorgente versionato.

## Rischi e prossimi passi

Snapshot serializzato per comando e monitor globale del servizio sono una soluzione locale conservativa, con costo di memoria/CPU e serializzazione delle operazioni tra partite. Non e un benchmark di concorrenza. Resta da gestire in modo completo la raccolta post-commit, i cicli di soli bot, possibili stalli e la finalizzazione. I12 verifica gli effetti delle carte per lotti; I13 resta il traguardo della prima partita completa nel debug.

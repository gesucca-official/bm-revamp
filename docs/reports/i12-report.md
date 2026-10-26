# I12 — Copertura residua del catalogo

24 ottobre 2026. **Completato** contro il regolamento **1.3**, senza modifiche al comportamento, bilanciamento, contenuti o dipendenze. Non è iniziato l'incremento successivo.

## Verifica preliminare e perimetro

Letti AGENTS.md (nessun altro AGENTS nelle directory interessate), roadmap, R00–R09, decisioni in open-questions, report I11/I26, sorgenti del catalogo/motore, fixture e test effettivi. Il workspace non ha metadati Git utilizzabili: nessun diff o attribuzione Git disponibile. Interventi aggiuntivi/mirati; conservati test, attesi e contenuto storico precedenti.

I26 era implementato: CLI Node reale, scenari file/stdin e import Client, autenticazione/identità, quattro modalità e round fixture. La riesecuzione completa conferma tutti i suoi test, oltre alle nuove prove I12. I08/I11 acquisiti confermati dalle factory runtime e dai cinque test di isolamento/rollback, conservati intatti.

R07 contiene 39 carte e il token: 2 personaggi, 33 azioni, 4 oggetti. Il runtime SQLite contiene 37 carte non personaggio e 2 personaggi; BrokenBeerBottle è generato dal gioco. Le 40 classificazioni e i 33 contratti costo/priorità/bersaglio erano già verificati, ma non tutti gli effetti avevano asserzioni specifiche. Le decisioni proprietario del 24 ottobre su mazzi, timeout e log appartengono ai rispettivi incrementi; non sono state attivate qui.

## Implementazione e criteri chiusi

La [matrice carta/regola/caso/test](i12-card-matrix.md) elenca singolarmente tutte le **40 voci**, gli attesi e i metodi effettivi. I riferimenti dei metodi sono stati controllati sui sorgenti, con 40 righe distinte. Si conserva la copertura precedente e si aggiunge `CatalogEffectsTest`, **87 casi diretti**, in piccoli lotti:

1. Attacchi, tutte le bound, scarto/persistenza, tipi di danno, danno da V residua dopo costo, metabolismo positivo/zero/negativo.
2. Stati e durate reali delle carte, conversione HIT→CUT e filtri GOOD/BAD, equip rimossi prima del danno, BadTrip su tre tick, tutti gli oggetti consumati attraverso Grab e le due basic (15 combinazioni), pesca senza attivazione dei quattro oggetti, token e capacità FIFO, furto/scambio/copia con e senza oggetti.
3. Oggetto scomparso fra invio e risoluzione, costi/scarto/pesca ed effetti residui, distruzione e consumo senza effetto, counter successivo/precedente, copia solo target, counter multipli e SELF, fasi dei morti e fase viva che prosegue dopo veleno letale, pagamento/insufficienza per tutte le 33 azioni, scarti bound vietati, autodanno e immunità.

Nuovo scenario `scripts/cli-card-choices-test.cjs`, invocato da `WebSocketIdentityTest.cliCardChoicesResolveItemsDiscardAndTokenAcrossThreeRounds`: due connessioni CLI autentiche e un match sintetico installato dal runner, con carte caricate dalle factory SQLite. Nessun endpoint di bypass. Le mosse attraversano validazione, servizio, risoluzione e viste reali. Errori TARGET_ITEM/DISCARD_ONE recuperabili, assenza di mutazione sulla prima scelta illegale, poi:

| Round | Mosse e atteso normativo | Vista verificata dopo risoluzione |
|---|---|---|
| 1 | Steal contro ToxicGrab su AnotherRottenBeer: basic prima del furto, token creato, furto paga ma non trova più la birra | H A/B=100/100; ALERTNESS A/B=10/13 |
| 2 | LittleSmack scarta SuperImpact e persiste; ToxicGrab consuma il token ed equipaggia | H A/B=100/95; ALERTNESS A/B=15/5 |
| 3 | Struggle di entrambi; bottle modifica autodanno e attacco nello stesso turno; equip scade | H A/B=80/78; ALERTNESS A/B=15/5 |

Alla fine si verificano mano/basic/bound/scarto, una sola last resort ripescata per giocatore, token rimosso e stato scaduto. R06: ALCOHOL B segue 10→4→1→0; le perdite A sono 5, 2, 0 dopo gli effetti delle basic. Il terzo round non usa ToxicGrab.

Fixture dirette senza Spring/storage; scenario applicativo con SQLite temporaneo di `SqliteContextSupport`, account sintetici, processi Node con attese limitate e cleanup in finally. Nessun dato reale modificato. Nessun nuovo test applicativo via browser o trasporto simulato.

## Verifiche riproducibili

Da `E:/bm`:

| Comando | Esito finale |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | PASS: **210 server + 18 client**, zero fallimenti/errori/skipped server; log `.build-logs/i12-test.log` |
| `python scripts/check-rules.py` | PASS: regolamento/copia client, 39 carte/token, descrizioni, tipologie, starter e integrità SQLite allineati |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | PASS separato: **267 test**, zero fallimenti/errori/skipped; log `.build-logs/i12-context.log` |

Le prove specifiche I12 sono comprese nei comandi: 87 casi diretti e uno scenario CLI di tre round nel contesto completo. Contesto e runtime catalogo avviati realmente; le prove unitarie da sole non vengono usate come evidenza di bootstrap.

Durante la costruzione dei lotti sono stati corretti errori delle nuove fixture: collisione di nomi sintetici fra azioni successive; campi del modello Move esclusi dal contratto wire; lettura delle vecchie referenze dopo il rollback I11; un calcolo iniziale errato di ALERTNESS nel terzo round, corretto esplicitamente con la divisione intera di R06 sopra. Nessun atteso preesistente modificato e nessun cambiamento al motore per far passare test. Le verifiche finali comprendono le fixture corrette.

## UX, limiti e criteri aperti

Nessun criterio I12 aperto. Non sono emerse interazioni normative ambigue o difetti trasversali irrisolti nei casi esaminati. Non è una verifica esaustiva di ogni permutazione di carte/FFA/timer; nessuna precedenza fra timer simultanei è introdotta (R06). SoberUp resta fuori catalogo. Il regolamento resta 1.3 e catalogo, testi SQLite e copia client restano invariati perché non è cambiata alcuna regola o descrizione.

Nessuna nuova accettazione UX manuale: conservati i 18 test client e le evidenze storiche; I12 riguarda copertura automatica degli effetti e scelte applicative. Non si dichiarano partite complete, nuovi log/export, timeout, reconnect, modifiche ai mazzi o approvazione della base. Questi criteri restano nei rispettivi incrementi della roadmap.

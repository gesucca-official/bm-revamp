> I22, 26 ottobre 2026: regressione finale sul regolamento 1.6 invariato;
> nessuna modifica agli attesi di gioco. Esiti, copertura applicativa/CLI e
> contesto Spring separato nel [report I22](reports/i22-report.md).

> **R06 / I24 verificato, 26 ottobre 2026.** Regolamento **1.6**: draw degli attivi al restart anche dopo crash, motivo «riavvio server», esito unico senza restore giocabile o Elo. Copia client e 37 riferimenti delle descrizioni SQLite/allegato allineati; valori/effetti/starter invariati. Quattro casi diretti, tre scenari server/CLI (quattro modalità attive, un concluso, pending, arresto pulito/crash, tre riavvii e interruzione durante finalizzazione), esiti/prefissi/export e dati legacy preservati. Presentazione nel client finale verificata; ricevuta tardiva non cancella un nuovo match. **249 server + 28 client PASS**, contesto Spring completo separato **356 PASS**, check-rules PASS. [Report I24](reports/i24-report.md). I19c/I22 restano aperti; le note datate sotto sono storiche.

> **I17b completato, 25 ottobre 2026.** FFA a due/cinque, bot, code/concorrenza, viste private, partita completa, forfait individuale e prosecuzione, batch timeout e reconnect con clock controllato. Ready privato e modalità FFA a due corretti; nessun proprietario lobby o nuova persistenza. 13 scenari CLI con sei account, UX debug a due sessioni, export e rilettura SQLite. 237 server + 27 client ordinari, 329 server nel contesto separato, 13 FFA mirati finali e check-rules PASS. Regolamento 1.5 invariato. [Report ed evidenze](reports/i17b-report.md). I19b/I24/I19c/I22 restano aperti; le sezioni precedenti riportate sotto sono storiche.

> **I17a completato, 25 ottobre 2026.** R01/R03/R06/R08 verificati in dieci scenari CLI con umani distinti: coda 1v1, ready/viste private, concorrenza, 21 partite complete, scadenze/reconnect, isolamento ed export con hash/rilettura indipendente. Accettazione visiva in due contesti Edge isolati (normale/InPrivate), Alice/Bob distinti e tre partite ulteriori: round con risorse/effetti coerenti sui due lati, pending conservata nel rientro, timeout/draw/leave, hub/logout ed export UX completi. Regolamento 1.5 invariato; nessuna nuova meccanica o modifica applicativa nella chiusura UX. 237 server + 26 client, 316 server nel contesto separato e check-rules PASS; [report I17a](reports/i17a-report.md). **I17b ora completato separatamente (report I17b).**

> I14/I23, 25 ottobre 2026: completati nei criteri della roadmap dopo verifica reale I13/I19a/I26. Regolamento 1.5: clock mossa multiplayer continuo, forfait/finalizzazione/cleanup coerenti, rientro nello stesso processo entro 30 s anche vsCom, pending e sessione unica preservate, rientro tardivo e nessun restore verificati. Test ordinari **237 server + 25 client PASS**; contesto Spring separato **306 PASS** e check-rules PASS. Debug separato per avvisi, pending, timeout, coda e hub. [Report, comandi, evidenze e limiti](reports/i14-i23-report.md). Restano I17, retry/registro attivi I19b e restart-draw I24/I19c; nessuna chiusura I22. Le sezioni datate sotto rimangono storiche.

> I16, 25 ottobre 2026: open 1vCom completato con due mazzi salvati distinti via CLI fino a esito/export, configurazioni runtime e isolamento dopo modifica/delete verificati; rifiuto assente/altrui e UX scelta/errori nel debug. I13/I15/I26 riverificati. 219 server + 21 client ordinari, 281 server nel contesto separato, check-rules verde. Regolamento 1.4 invariato. [Report e limiti](reports/i16-report.md). Le sezioni datate precedenti restano storiche.

> I13, 24 ottobre 2026: quick 1vCom completo verificato via CLI con umano Bruiser e Junkie; UX debug separata con casualità reale fino al vincitore e secondo avvio. Nessuna meccanica modificata. [Report, comandi e limiti](reports/i13-report.md). Le evidenze precedenti restano storiche.

## I12 — Copertura carte contro la versione 1.3, 24 ottobre 2026

**I12 completato**, dopo conferma effettiva di I26. [Matrice carta/regola/caso/test](reports/i12-card-matrix.md) per le 39 carte e il token, con attesi da R07 e casi R02–R06: 87 nuovi test diretti, scenario CLI a due account e tre round con scelte oggetto/scarto/token, conservazione integrale dei cinque test I11 di isolamento e rollback. Nessuna modifica normativa o al motore/catalogo/client.

Verifiche finali: `./scripts/build.ps1 -Task Test -Offline` **210 server e 18 client PASS**; `python scripts/check-rules.py` **PASS**; `./scripts/build.ps1 -Task TestServerContext -Offline` **267 PASS**, senza fallimenti/errori/skipped, inclusi runtime SQLite e scenari CLI I26/I12. [Report, attesi numerici e limiti](reports/i12-report.md). Nessuna nuova UX manuale, partita completa o esaustività di tutte le combinazioni implicata. Le sezioni successive mantengono lo storico; le vecchie lacune già chiuse non rappresentano lo stato corrente.

## Revisione normativa 1.3 — Catalogo completo e tipologie

R07 raccoglie ora le **39 carte del set (2 personaggio, 33 azione, 4 oggetto) e il token oggetto**, con tipologia su ogni riga e sottotipo delle azioni/token. Le schede delle carte personaggio sono spostate da R01 a R07, con nomi visualizzati e valori invariati. R01 e R01a rimandano al catalogo completo.

L’allegato include ora anche personaggi, token e classificazioni. `check-rules.py` controlla queste voci rispetto a R07, al catalogo personaggi SQLite e al contratto `rules-card-types.tsv`, oltre alle verifiche già presenti; controlla anche la struttura delle tabelle. `CardRulesContractTest.r07_cardTypes` verifica 40 voci contro le classi effettive del gioco, incluse le carte personaggio e i flag delle azioni. Nessuna modifica alle meccaniche o agli effetti.

Verifiche del 23 ottobre 2026: comando `./scripts/build.ps1 -Task Test -Offline` riuscito, compresi i 40 nuovi casi e i 18 test client; log `.build-logs/rules-v1.3.log`. Verifica finale `python scripts/check-rules.py` superata: regolamento, copia client, classificazioni, descrizioni e starter allineati; SQLite integro. Le revisioni seguenti sono storico.

## Revisione normativa 1.2 — Tipologie di carte

La versione corrente è **1.2**. R01a esplicita carte personaggio, carte azione e carte oggetto, i quattro sottotipi delle azioni, i token oggetto e gli stati equip. È un chiarimento editoriale: meccaniche, effetti e attesi dei test restano invariati. Copia client e riferimenti di versione nel catalogo sono allineati. Controllo eseguito: `python scripts/check-rules.py`; copia, testi, contratti e starter coerenti, SQLite integro. Non è stata rieseguita la suite applicativa per questa modifica documentale. Le sezioni seguenti conservano le verifiche delle revisioni precedenti.

## Revisione normativa 1.1 - I11

Il regolamento corrente e **1.1**. L'eccezione degli stati condivisi conservata nella versione 1.0 sottostante e superata: MadeOfStone/BrokenBeerBottle hanno stato per applicazione. Il test di parita e ora coerente con R04 (ordine dei partecipanti), anziche con il vecchio ordine di invio. R08 definisce rollback locale e pubblicazione dopo commit. Nuovo RoundIsolationTest con cinque scenari; suite complessiva 137 server completi, 83 ordinari e 18 client verdi. [Motivazioni, file ed evidenze](reports/i11-report.md). Il resto del documento conserva lo storico 1.0.

# Conformità al regolamento 1.0

23 ottobre 2026. Il [regolamento ufficiale](game-rules.md) è ora la fonte normativa. Per costruirne la prima versione si è seguito il codice, compresi gli effetti insoliti; da ora si modifica il regolamento prima di adeguare il resto. La precedente baseline Q03 è sostituita da R00. Nessuna modifica al bilanciamento o alla logica di risoluzione è stata introdotta.

## Interventi

- Regolamento completo di preparazione, personaggi, mano, oggetti, mosse, danni, stati, fine turno, esito e tutte le 37 carte del catalogo più il token.
- Copia identica nel client, già letta dalla pagina Regole. README delle due repository e documenti di analisi indicano la nuova autorità; la ricognizione precedente è archiviata come storico.
- `rules-catalog.json` conserva nomi, testi e composizioni degli starter. I 37 testi SQLite derivano da R07, compresi gli effetti che prima erano descritti erroneamente. Nessun nome, costo, quantità o composizione è stato modificato nel catalogo.
- Corrette anche due stringhe nel codice: il report di RottenBeer non dichiara più un equip inesistente nel percorso Grab; il token descrive la scadenza effettiva. Logica invariata.
- `AGENTS.md` rende persistente il flusso regolamento → test/codice/catalogo/documenti per il lavoro futuro.
- `check-rules.py`, incluso nei comandi Test/TestServer/TestClient, confronta regolamento e copia client, versione, descrizioni R07 e catalogo, composizioni starter e contratto dei test. Verifica anche integrità SQLite. Non riscrive attesi o documenti.

## Copertura verificata

| Sezioni | Prove |
|---|---|
| R01 | Risorse iniziali, capacità e immunità dei due personaggi |
| R02 | Test PlayerTest: oggetti concatenati alla pesca, capacità FIFO, last resort non duplicata, persistenza basic/bound; prova aggiuntiva di scarto bound e singola pesca |
| R03 | Test MoveTest: costo insufficiente, invio senza pagamento immediato, doppio invio rifiutato; quattro test client dei payload e delle scelte |
| R04 | Priorità prima di ALERTNESS, costi prima dell'ordinamento, parità risolta per inserimento; annullamento con costo/scarto e senza scarto aggiuntivo della bound; azione dopo morte |
| R05 | Durate, singleUse riutilizzabile nello stesso turno, troncamento e accumulo danni, primo modificatore di risorsa, valori negativi e assenza di tetti, filtro GOOD/BAD, identità condivisa degli stati |
| R06 | Salute zero, vincitore e morte reciproca, veleno/alcol prima del timer, scadenza dei timer |
| R07 | 33 casi dinamici controllano costo, priorità e bersaglio di ogni azione del catalogo; scenari specifici per CantFeelAnything, GoingBerserk, LethalHeroinDose, RottenBeer via Grab, BeggingMoney, ToxicBloodDrain, AmphetamineReflexes, MarvelousCocktail e stati condivisi |
| Catalogo e documenti | Controllo coerente di 37 descrizioni, starter, copia client e contratto costi/priorità/bersagli derivato da R07 |

File aggiunti: `bm-server/src/test/java/com/gsc/bm/model/game/RulesConformanceTest.java` (22 scenari), `CardRulesContractTest.java` (33 casi) e `bm-server/src/test/resources/rules-v1-cards.tsv`. Il contratto TSV è trascritto dalla tabella normativa, non viene rigenerato dal codice durante i test. Si aggiungono agli 8 test server e 4 client già esistenti.

## Risultati riproducibili

Da `E:/bm`, con toolchain e dipendenze locali già installate:

```powershell
./scripts/build.ps1 -Task Test -Offline
python scripts/check-rules.py
```

Esito effettivo: **63 test server passati, 0 fallimenti/errori/skipped; 4 test client passati**. Copia client, descrizioni, contratti e starter coerenti; integrità SQLite `ok`, nessuna violazione delle foreign key. Log: `.build-logs/rules-conformance.log`.

## Limiti e debiti conservati

Non è una copertura esaustiva di tutte le combinazioni di carte, timer simultanei, stati o FFA. Modalità, factory, bot, restrizioni editor e viste sono state lette nel codice, non collaudate end-to-end in questa attività. I 33 contratti non sostituiscono test degli effetti di ogni singola carta. L'identità condivisa degli stati è verificata, ma non una sessione concorrente multip partita.

Il contesto Spring completo rimane separato: l'ultima prova I02 falliva per datasource esterno assente, e non è stata ripetuta qui. Nessun avvio completo, browser, servizio esterno, SMTP o persistenza è stato certificato. Restano debiti la validazione di input, gli stati condivisi, lo stallo umano senza mosse e le eccezioni senza rollback. Le regole descrivono esplicitamente i comportamenti conservati senza trasformare falle di protocollo in azioni lecite.

Le richieste precedenti di timeout/forfait, restart→draw, Elo e rimozione dei limiti mazzi restano in roadmap: non sono dichiarate implementate. Una loro introduzione deve modificare il regolamento e aggiungere le rispettive prove.

## Modifiche successive

1. Modificare il regolamento, aggiornando versione e motivazione.
2. Aggiornare gli attesi dei casi interessati e aggiungere scenari per le nuove regole.
3. Adeguare codice, testi SQLite, allegato catalogo e documentazione; pubblicare la stessa versione nel client.
4. Eseguire i controlli sopra e quelli specifici della modifica. Un controllo verde non elimina i limiti qui dichiarati.

## I15 — 24 ottobre 2026, regolamento 1.4

Validazione strutturale e preservazione su errore via CLI; editor con annullamento isolato e gestione errore recuperabile. Pesca di 20.000 oggetti senza overflow. 219 test server ordinari + 20 client e 280 server nel contesto separato verdi. Prove UX e limiti nel [report I15](reports/i15-report.md).

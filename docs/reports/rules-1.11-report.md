# Regolamento 1.11 — risorse assenti

6 novembre 2026. Correzione della partita viva, non un blocco del Set Base. Decisione del proprietario: opzione (a),
«ogni personaggio ha tutte le risorse, a 0 se la scheda non le indica».

## Difetto

Il regolamento 1.10 non diceva quanto vale una risorsa che il personaggio non ha, e il motore la lasciava assente
dalla mappa delle risorse. Spazienzio partiva con HEALTH, ALERTNESS e VIOLENCE; il Tossico con HEALTH, ALERTNESS e
TOXICITY. Tre carte leggono la propria TOXICITY senza avere un costo in T che la garantisca, e con un valore assente
l'unboxing andava in `NullPointerException`:

| Punto | Personaggio che lo rendeva raggiungibile | Stato |
|---|---|---|
| `BadTrip.applyEffectOnSelf` (riga 38) | Spazienzio con mazzo personalizzato, finché non aveva mai ricevuto T | Provato |
| `LethalHeroinDose.applyEffectOnSelf` (riga 30) | Come sopra | Provato |
| `PervertedMetabolism.applyEffectOnSelf` (riga 26) | Come sopra | Provato |
| `ToxicBloodDrain` (T) ed `ExtremelyViolentBlow` (V) | Nessuno: il costo di 10 T o 20 V le rende ingiocabili senza la risorsa | Provato il rifiuto |
| `SoberUp` (L) | Nessuno: fuori catalogo | Dedotto |
| Passi `of` delle carte a dati (`DataCards.value`) | Nessuno nella partita viva: solo sorgenti di test | Dedotto (SB-6a) |

Costi, pagamento, variazioni, svuotamento, effetti periodici e bot trattavano già l'assenza come 0 (`getOrDefault`,
`putIfAbsent`, controllo del null). HealingBlow creava già TOXICITY e ALCOHOL a 0 sul bersaglio.

Il server non limita le carte per personaggio (R02, 1.4), quindi il difetto era raggiungibile in **open 1vCom** con un
mazzo salvato. Quick usa gli starter (quello di Spazienzio non contiene le tre carte) e open PvP non esiste.

## Riproduzione (prima della correzione)

- **Motore** (`Game.resolveMoves`): NPE nelle tre carte. Senza il servizio nulla veniva annullato: con BadTrip
  restavano pagati 10 A, tolta l'immunità a T e aggiunto il timer, con le mosse ancora pendenti.
- **Servizio partite**: la risoluzione falliva, lo stato veniva ripristinato (R08) e chi aveva inviato la mossa
  riceveva «Round resolution failed; state restored, please retry». Fra due umani (non raggiungibile oggi), se la
  mossa di Spazienzio arrivava per prima l'errore toccava all'avversario a ogni invio e il turno restava bloccato.
- **Server reale**, jar ricompilato su SQLite temporaneo, account di sviluppo, mazzo di Spazienzio salvato via CLI con
  BadTrip, LethalHeroinDose, PervertedMetabolism e ShuffleFeet, open/1vCom. Sei tentativi (due per carta): ogni volta
  `/user/queue/illegalMove` con il messaggio sopra, turno fermo a 0, nessuna risorsa cambiata, carta ancora in mano,
  partita non chiusa, sei righe ERROR con la NPE nel log. ShuffleFeet poi ha chiuso il turno. Nell'archivio solo il
  turno riuscito, il forfait del leave e l'esito: i tentativi falliti non lasciano traccia.

## Regola e correzione

R01 1.11, «Risorse di partenza»: ogni personaggio ha tutte e cinque le risorse fin dalla preparazione, a 0 quelle che
la scheda R07 non indica; la risorsa speciale è quella che parte da un valore diverso da zero. Nota sotto le carte
personaggio di R07 con gli zeri dei due personaggi; riga in «Revisioni».

Codice: il costruttore di `Character` mette tutte le risorse a 0 prima di HEALTH e ALERTNESS. Nessuna carta toccata;
vale anche per i personaggi a dati e per quelli futuri (Rocco).

Effetto delle tre carte su Spazienzio senza T: BadTrip costa 10 A, aggiunge 0 T e il timer gli dà l'immunità a T al
terzo turno; LethalHeroinDose non toglie HEALTH (t = 0) e aggiunge 30 T; PervertedMetabolism guadagna e perde 0.

## Test

- Nuovo `MissingResourceTest` (7 test): mappe iniziali; caso riprodotto (Spazienzio umano contro `ComPlayer` su
  `GameSessionServiceImpl`, il round si chiude, viene pubblicato e archiviato); BadTrip, LethalHeroinDose e
  PervertedMetabolism con i valori sopra; nessun effetto periodico a 0; ToxicBloodDrain ed ExtremelyViolentBlow ancora
  rifiutate dal controllo dei costi.
- Attesi cambiati, con il perché:
  - `RulesConformanceTest.r01_initialCharacters` fissava le mappe iniziali senza gli zeri, che la 1.11 rende obbligatori;
  - `MatchArchiveTest` e `scripts/cli-match-export-test.cjs`: versione del regolamento attesa «1.11», come a ogni salto;
  - `server/src/test/resources/sb-6a/attuale.json`: le 37 descrizioni passano da «Regolamento 1.10» a «1.11»,
    perché `PlaygroundTest` confronta i testi della bozza con il catalogo e `check-rules.py` impone la versione nelle
    descrizioni SQLite. Approvato dal proprietario dopo che il controllo dei testi era diventato rosso. Nessun numero
    della bozza è cambiato.
- Catalogo: allegato `rules-catalog.json` alla 1.11 e 37 descrizioni di `cards.sqlite` con il nuovo riferimento;
  copia `client-debug/src/assets/docs/rules.md` identica.

## Partite esistenti

- Misura SB-3, 5.000 partite (`-Dtest=SimulationMeasureTest -Dsim.games=5000`), prima e dopo la correzione: identica al
  rapporto SB-3. Bruiser 1.682 (829 + 853), Junkie 2.999 (1.479 + 1.520), patte 319, `TURN_LIMIT` 0, turni media
  13,0652, mediana 13, minimo 3, massimo 24, mosse vuote 0.
- Prova d'identità di SB-6a (`PlaygroundTest.currentDraftPlaysExactlyLikeTheCatalog`) e i 200 scenari per carta: verdi
  senza modifiche. Solo il confronto dei testi ha richiesto l'adeguamento di `attuale.json` descritto sopra.

## Verifiche

- `./scripts/build.ps1 -Task Test -Offline`: 500 test server, 0 fallimenti, 0 errori, 6 saltati (le misure
  disattivate); client-debug 36 su 36.
- `python scripts/check-rules.py`: PASS.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: 607 test, 0 fallimenti, 0 errori, 6 saltati; 6:24 min.
  Comprende gli scenari CLI su server Spring e SQLite temporaneo, fra cui l'export con `rulesVersion` 1.11.

## Cosa cambia per chi gioca

Le viste, il profilo, la collezione, il client debug e l'archivio mostrano le cinque risorse di ogni personaggio dal
primo turno (Spazienzio anche TOXICITY 0 e ALCOHOL 0, il Tossico VIOLENCE 0 e ALCOHOL 0). Le partite archiviate prima
della 1.11 restano leggibili: il JSON è conservato com'è e i client leggono le risorse assenti come 0; il manifest
delle partite nuove registra `rulesVersion` 1.11.

## Cosa non è verificato

- Il tavolo di `client-web` con cinque risorse per posto non è stato guardato in un browser: i test di leggibilità
  dichiarano coperto il caso con tutte e cinque, ma i file C4 non sono stati toccati né provati a mano.
- La partita viva dopo la correzione non è stata rigiocata via CLI su un server reale: il caso è provato su
  `GameSessionServiceImpl` e nel contesto Spring solo per quanto coprono i test esistenti.
- `docs/rules-conformance.md` non elenca ancora `MissingResourceTest`.

## Set Base

- Le bozze del playground non devono più scrivere le risorse a 0 per evitare il crash, ma possono continuare a farlo:
  il risultato è lo stesso. I passi `of` funzionano anche su una risorsa non indicata.
- `sb-6a/prova-sb9.json` ha ancora 10 descrizioni con «Regolamento 1.10»: nessun test le confronta, non sono state
  toccate.
- Schede SB-9 (`docs/design/set-base/schede-personaggi.md`, che cita il regolamento 1.10): la colonna «risorsa
  speciale» resta valida; Rocco ha tutte le risorse a 0 tranne HEALTH e ALERTNESS, e Mara e Pino con V 0 sono ora la
  regola, non un'eccezione da scrivere.

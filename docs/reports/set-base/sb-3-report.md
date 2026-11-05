# SB-3 — Runner senza server e seme

4–5 novembre 2026. Worktree `E:\bm-sb3`, branch `sb-3-runner`.
Base del lavoro: `6a00b54`. Regolamento vigente 1.10, set attuale di `cards.sqlite`;
nessuna bozza o modifica di bilanciamento.

**Il blocco è chiuso** il 5 novembre 2026, su istruzione del proprietario, dopo revisione
e confronto col server reale (vedi [Confronto col server reale](#confronto-col-server-reale)).
I log citati con `tmp/sim/` sono conservati, fuori da git, in `E:\bm\tmp\sb-3\`. Il runner, i test e la prima misura sono implementati.
`TestServer` e la verifica finale `TestServerContext` sono verdi; sono riportati
anche i fallimenti precedenti e la diagnosi effettuata.

## File di produzione modificati

| File sotto `server/src/main/java/com/gsc/bm/` | Motivo |
|---|---|
| `model/game/Player.java` | Nuovo costruttore con `Random`; quello precedente delega con `new Random()`. Mescolamento del mazzo con quel generatore. Campo non transient per mantenere lo stato del seme nelle copie Java e nel rollback con `restoreFrom`; `@Getter(AccessLevel.NONE)` e `@JsonIgnore` sul campo, accesso `random()` con `@JsonIgnore`. |
| `model/game/ComPlayer.java` | Nuovo costruttore con ID esplicito e `Random`; tutti e cinque i mescolamenti usano `random()`. Costruttore precedente conservato, incluso `Math.random()` nell'ID. Dopo la revisione, `choices` è una `EnumMap`. |
| `model/cards/junkie/BeggingMoney.java` | La scelta casuale dell'oggetto usa `g.getSelf(m).random()`. Effetto invariato. |
| `model/Character.java` | Solo `timers`: da `HashSet` a `LinkedHashSet`. Il confronto iniziale nella stessa JVM e quello dopo serializzazione fallivano al seme 0 per l'ordine di Bad Trip e Marvelous Cocktail nella traccia. `Timer` usa hash d'identità; l'ordine d'inserimento resta riproducibile e sopravvive alla copia. R06 non garantisce precedenza fra timer simultanei; non viene introdotta una nuova regola. **L'ordine può cambiare lo stato:** Marvelous Cocktail cancella le immunità, Bad Trip e Blood Drain ne aggiungono una. Prima l'ordine era arbitrario, ora è quello d'inserimento, anche sul server: è l'unica modifica con effetto sulle partite in produzione. |
| `model/game/Move.java` | Solo `moveReport`: da `HashMap` a `EnumMap<CardTarget, ...>`. Due JVM producevano report con chiavi SELF/OPPONENT in ordine opposto. `EnumMap` rende stabile l'ordine delle chiavi anche quando il risultato delle carte proviene da `Map.of`. Nessun effetto di carta modificato. |

Nessun cambiamento alla logica di `Game`, alle
factory o all'autenticazione. I chiamanti di produzione continuano a usare i
vecchi costruttori. Nessuna dipendenza aggiunta, nessun test preesistente modificato.
Regolamento, cataloghi, piano, SQLite, POM e client non modificati.

## Runner e traccia

Quattro nuovi file in `server/src/test/java/com/gsc/bm/sim/`, fuori dai sorgenti
inclusi nel jar di produzione:

- `SimulationCatalog.java`: copia `/cards.sqlite` dal classpath in un temporaneo
  sotto `tmp/sim/`, lo apre via JDBC con `mode=ro`, legge `CRD001_GUI`,
  `DCK001_STARTERS` e `DCK002_STARTERS_CH` con `ORDER BY` espliciti, poi cancella
  la copia. Colonne ricavate dalle entità `repo/internal`; istanze tramite
  `Class.forName(CardFactoryService.BASE_CARDS_PKG + binding)`. Carica nomi e
  metadati descrittivi; non ricostruisce l'HTML delle keyword delle factory,
  che non interviene nella partita.
- `SimulationRunner.java`: due `ComPlayer` con ID `seat-1` e `seat-2`, ciascuno
  con `new Random(source.nextLong())` da `new Random(seed)` nell'ordine dei posti;
  `new Game(List.of(a, b), "sim", false)`. Nessun import Spring né contesto avviato.
  Sul `ROUND_COMMITTED` con contatore maggiore di 200 lancia un'eccezione propria,
  catturata esclusivamente come `TURN_LIMIT`: il limite viene quindi osservato
  dopo il turno 201. Le altre eccezioni non sono mascherate da esiti ordinari.
- `SimulationRunnerTest.java`: otto test descritti sotto, normalmente attivi.
- `SimulationMeasureTest.java`: attivo soltanto con
  `@EnabledIfSystemProperty(named = "sim.games", matches = "\\d+")`.

JSONL: una riga TURN dopo ogni turno e una FINAL, con seme, turno, mosse risolte,
scelte, report delle mosse e degli effetti periodici, risorse, mano in ordine,
dimensione del mazzo, oggetti, stati strutturali e timer di ciascun giocatore,
e log del turno. La finale contiene anche l'esito. Il drain copia gli eventi
quando serve la traccia e svuota sempre la lista, come `GameSessionServiceImpl`.
Solo gameId e frammenti `@esadecimale` vengono normalizzati; nessun altro
ordinamento o normalizzazione viene applicato alla traccia. Output del runner,
log delle JVM figlie, copie temporanee e riepilogo della misura sotto `tmp/sim/`,
ignorata da Git.

## Test aggiunti

| Test in `SimulationRunnerTest` | Copertura | Esito |
|---|---|---|
| `sameSeedSameJvm` | Venti semi 0–19, posti alternati, doppia esecuzione e confronto integrale delle tracce. | PASS |
| `sameSeedSeparateJvms` | Dopo la revisione: sei processi Java distinti con classpath Surefire e hash d'identità diversi, venti semi 0–19, SHA-256 di ogni traccia confrontato con la JVM dei test. I file temporanei si cancellano se il confronto passa. | PASS |
| `differentSeedsProduceDifferentTraces` | Venti semi 0–19 con Bruiser al primo posto; almeno due tracce distinte anche dopo aver tolto il solo campo seed dal confronto di questo test. Le tracce prodotte restano inalterate. | PASS |
| `twoHundredCompleteGames` | Dopo la revisione: semi 0–199, posti alternati, nessuna eccezione, nessun `TURN_LIMIT`, nessuna mossa vuota; traccia disattivata. | PASS |
| `serializedMidgameContinuesIdentically` | Venti semi 0–19, copia Java alla metà dei turni a partita ancora aperta; la continuazione coincide turno per turno, finale inclusa. Verificato anche `restoreFrom` con giocatori clonati. | PASS |
| `jacksonDoesNotExposeRandom` | JSON identico prima/dopo consumo del generatore, assenza ricorsiva di proprietà random/rng/seed/gaussian e assenza di getter Lombok del generatore. | PASS |
| `turnLimitStopsRecursiveVoidMoves` | Due bot sintetici sempre vuoti, usati solo per provare il watchdog: TURN_LIMIT al turno 201, 402 mosse vuote, 202 righe e log drenati. | PASS |
| `traceContainsEachRoundAndDrainsItsEvents` | Campi richiesti, una riga per turno più finale e un solo evento di fine turno per riga, senza accumulo dei log precedenti. | PASS |

Nella prima consegna, a due JVM, le tracce contenevano 270 righe ciascuna e avevano SHA-256:
`7b95d6bca80597e5fd599291a07912d78acccf5da5d90e4515090021ca15f00a`.

I primi tentativi dei nuovi test hanno rilevato i due problemi di ordinamento
motivati sopra, poi corretti senza cambiare gli attesi. La suite nuova finale
richiede 2,812 secondi nella verifica `TestServer` registrata.

## Verifiche eseguite

Dalla radice del worktree:

```powershell
./scripts/build.ps1 -Task TestServer -Offline
```

`BUILD SUCCESS`: 275 test, 0 fallimenti, 0 errori, 1 saltato (la misura disattivata).
Tempo Maven 16,092 s. `check-rules` eseguito da questo comando:
«Regolamento e copia client allineati: 39 carte (2 personaggio, 33 azione,
4 oggetto) e 1 token; tipologie, ruoli, danno nominale e importo R07a, testi e
starter coerenti; SQLite integro.» Log: `tmp/sim/test-server-final.log`.

La prima esecuzione di `./scripts/build.ps1 -Task TestServerContext -Offline`
è fallita: 382 test, 53 fallimenti, 0 errori, 1 saltato, tempo Maven 1:33 min.
La CLI non trovava `sockjs-client`; anche i tre `RestartCliTest` non trovavano
`fixture.json` perché il processo CLI era terminato con lo stesso errore,
confermato in `.build-logs/i24-clean-evidence/prepare.json`.
Non sono stati cambiati test o dipendenze per accettare questo risultato.
Il lavoro si è fermato senza commit su richiesta del proprietario, poi è stato
ripreso su sua istruzione di correggere gli errori e completare le attività.

Per correggere l'ambiente, la seconda verifica usa i moduli già presenti nel
checkout `E:\bm`: `sockjs-client` 1.5.0 e `stompjs` 2.3.3, verificati uguali alle
versioni di `client-debug/package-lock.json`. `NODE_PATH` viene ereditato anche
dai processi CLI dei test. Non serve installare o modificare il client nel
worktree SB-3 e nessun test viene escluso.

```powershell
$env:NODE_PATH = 'E:\bm\client-debug\node_modules'
./scripts/build.ps1 -Task TestServerContext -Offline *> tmp/sim/test-server-context-resumed.log
```

Seconda esecuzione: `BUILD FAILURE`, 382 test, **1 fallimento**, 0 errori,
1 saltato; tempo Maven **6:50 min**. Il solo fallimento residuo e'
`WebSocketIdentityTest.cliRejectsDuplicateMoveAndForeignAccess`, riga 360:
`CLI assertions failed: Event timeout`, processo CLI terminato con codice 1.
Le 53 anomalie precedenti da moduli mancanti non si ripresentano; i tre
`RestartCliTest` e gli otto `SimulationRunnerTest` passano (questi ultimi in
2,249 s). Il contesto Spring e i trasporti reali sono stati avviati, ma la
verifica complessiva **non è verde**.

Il proprietario ha autorizzato la diagnosi mirata senza modificare test,
attesi o file vietati. Il 5 novembre il solo test interessato è stato eseguito
in una nuova JVM con questo comando, da `server/`:

```powershell
$env:NODE_PATH = 'E:\bm\client-debug\node_modules'
$env:JAVA_HOME = (Resolve-Path '..\.tools\zulu11.84.17-ca-jdk11.0.29-win_x64').Path
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml '-Dmaven.repo.local=E:/bm-sb3/.tools/m2' -B -o -Pcontext-tests test '-Dtest=WebSocketIdentityTest#cliRejectsDuplicateMoveAndForeignAccess' *> ../tmp/sim/security-isolated.log
```

`BUILD SUCCESS`: 1 test, 0 fallimenti, 0 errori, 0 saltati; tempo Maven
16,336 s. Il timeout non si è riprodotto senza cambiare sorgenti, attesi o
limiti temporali. Questo esito da solo non stabilisce la causa del fallimento
precedente e non viene usato per dichiarare verde la suite completa.

È stata quindi avviata un'ulteriore verifica completa, dalla radice:

```powershell
$env:NODE_PATH = 'E:\bm\client-debug\node_modules'
./scripts/build.ps1 -Task TestServerContext -Offline *> tmp/sim/test-server-context-final.log
```

Verifica finale del 5 novembre: **`BUILD SUCCESS`**, **382 test, 0 fallimenti,
0 errori, 1 saltato** (la misura disattivata); tempo Maven **6:31 min**.
`WebSocketIdentityTest` passa con tutti e nove i test, incluso quello del timeout;
passano anche gli otto test del runner. Il contesto Spring completo è quindi
stato avviato e verificato, oltre ai test unitari.

Il timeout precedente non si è riprodotto né isolatamente né nella nuova suite
completa, senza modificare codice, test, attesi o timeout per farlo passare.
La causa precisa non è stata dimostrata: resta un episodio intermittente
osservato, documentato come limite della verifica, senza dichiarare una
correzione causale che non è stata eseguita. L'unica correzione d'ambiente è
la disponibilità delle dipendenze tramite `NODE_PATH`.

`git diff --check`: nessun errore di whitespace. Non è stato lanciato `-Task Test`,
come richiesto. Le prove CLI automatiche preesistenti sono parte della verifica
context richiesta; non è stato eseguito il confronto manuale runner/server
riservato al revisore.

## Prima misura Bruiser contro Junkie

Eseguita da `E:\bm-sb3\server` con questo comando esatto:

```powershell
$env:JAVA_HOME = (Resolve-Path '..\.tools\zulu11.84.17-ca-jdk11.0.29-win_x64').Path
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml '-Dmaven.repo.local=E:/bm-sb3/.tools/m2' -B -o test '-Dtest=SimulationMeasureTest' '-Dsim.games=5000' *> ../tmp/sim/measure-run.log
```

`BUILD SUCCESS`: 1 test, 0 fallimenti, 0 errori, 0 saltati. Java Zulu 11.0.29;
nessun exec-maven-plugin. Semi interi **0–4999**, 5.000 partite, un thread.
Seme pari: Bruiser primo; seme dispari: Junkie primo. Ogni personaggio occupa
ciascun posto 2.500 volte. Bot casuale attuale `ComPlayer`, nessuna euristica
nuova e nessuna bozza di set.

| Vincitore | Primo posto | Secondo posto | Totale |
|---|---:|---:|---:|
| Bruiser | 829 | 853 | 1.682 |
| Junkie | 1.479 | 1.520 | 2.999 |
| Totale vittorie | 2.308 | 2.373 | 4.681 |

- Patte: **319**; `TURN_LIMIT`: **0**; eccezioni: **0**.
- Turni: media **13,0652**, mediana **13**, minimo **3**, massimo **24**.
- Mosse vuote presentate a ROUND_READY: **0**. Le mosse annullate durante la
  risoluzione dalle contromosse sono un caso distinto e non entrano in questo conteggio.
- Durata del ciclo: **1,398054 s**, **3.576,400 partite/s** su un thread, senza
  costruzione o scrittura della traccia. Il ciclo comprende creazione dei
  giocatori, scelta delle mosse e risoluzione, inclusi i log in memoria poi drenati;
  caricamento JDBC e scrittura del riepilogo sono fuori dal cronometro.

Output grezzo conservato in `tmp/sim/measure-run.log` e
`tmp/sim/measure-5000.txt`. La velocità è indicativa: sulla macchina potevano
girare altri lavori; non è una misura isolata di laboratorio. Il bot è casuale:
questi risultati non dimostrano bilanciamento né forza con gioco umano.

## Revisione del 5 novembre

Revisione indipendente del codice: nessun difetto bloccante. Eseguita su una copia
temporanea con `main` unito, senza conflitti.

| Controllo | Esito |
|---|---|
| `TestServer` sulla copia unita | 275 test, 0 fallimenti, 1 saltato |
| Misura su 5.000 partite | Conteggi identici a quelli riportati sopra; 3.004 partite/s, indicativa |
| Stesso seme su 8 JVM, 2.000 semi | Nessuna differenza |
| Stesso controllo con `HashMap` rimessa in `moveReport` | 4 confronti su 7 differiscono su tutti i 300 semi: il controllo sa trovare l'errore |
| 20.000 partite con semi casuali | Bruiser 6.791, Junkie 11.959, patte 1.250, `TURN_LIMIT` 0; coerente coi semi consecutivi |
| Mosse con due chiavi in `choices`, 3.000 partite | Nessuna: nessuna carta legata bersaglia oggi un oggetto |
| Scadenze simultanee di timer con effetti opposti, 3.000 partite | 36 casi |

Ritocchi applicati dopo la revisione:

- `choices` in `ComPlayer` passa a `EnumMap`: con un `HashMap` su enum, la prima carta
  legata che bersaglia un oggetto avrebbe rotto la riproducibilità.
- `sameSeedSeparateJvms` usa sei JVM: con due, ogni confronto ha circa il 50% di
  probabilità di vedere lo stesso ordine per caso. Rimettendo `HashMap` in `moveReport`,
  il test ora fallisce.
- `twoHundredCompleteGames` rifiuta `TURN_LIMIT` e mosse vuote: prima due controlli non
  potevano fallire.
- I test cancellano i file temporanei quando passano.

Dopo i ritocchi, `./scripts/build.ps1 -Task TestServer -Offline` sul branch: `BUILD SUCCESS`,
275 test, 0 fallimenti, 1 saltato; gli otto test del runner richiedono 7,801 s, contro i
2,812 s precedenti. Le verifiche finali sono nella sezione seguente.

## Confronto col server reale

Il server non ha seme, quindi non si possono confrontare due partite con lo stesso seme. Il confronto
è più stretto: si rigiocano nel motore le partite vere, con le carte caricate dal catalogo del runner.

- `scripts/cli-sim-control.cjs` gioca partite `quick/1vCom` via CLI, con scelte casuali legali, e ne
  salva gli export. Server: jar del branch, database temporaneo, cinque account di sviluppo, porta 18080.
- `SimulationControlTest` è spento di norma. Per ogni export controlla il mazzo starter contro il catalogo
  del runner, ricrea i giocatori con lo stesso ordine di mazzo, ripresenta le mosse di ogni `ROUND_READY` e
  confronta lo stato con quello registrato, tramite `MatchSnapshot.state`, in `INITIAL` e a ogni `ROUND_COMMITTED`.
  Esclude solo ciò che dipende dalla sessione: gameId, clock, mosse pendenti, ruolo umano o bot, prove interne del bot.

**Esito:** [200 partite vere, 2.695 round confrontati, nessuna divergenza](sb-3/control-summary.json), esiti compresi.
Nessuna partita ha toccato il caso che il rigioco non può riprodurre: BeggingMoney con più oggetti sul bersaglio.
Alterando di un punto la HEALTH di un round in un export, il test fallisce a quel turno: il controllo sa trovare l'errore.

| Bruiser contro Junkie | Partite | Bruiser | Junkie | Patte | Turni medi |
|---|---:|---:|---:|---:|---:|
| Server reale, CLI contro bot | 102 | 29,4% | 62,7% | 7,8% | 13,06 |
| Runner, bot contro bot | 5.000 | 33,6% | 60,0% | 6,4% | 13,07 |

Con 102 partite il margine è di circa ±9 punti, quindi le distribuzioni sono compatibili ma non provate
uguali. La scelta casuale della CLI imita `ComPlayer` senza esserne una copia.

Verifiche finali sul branch, con `main` unito:

- `./scripts/build.ps1 -Task TestServerContext -Offline`, con `NODE_PATH` come sopra: `BUILD SUCCESS`, 382 test,
  0 fallimenti, 1 saltato, 7:15 min. Non comprendeva ancora `SimulationControlTest`, aggiunto dopo.
- `./scripts/build.ps1 -Task TestServer -Offline` col test aggiunto: `BUILD SUCCESS`, 276 test, 0 fallimenti, 2 saltati.
- Misura su 5.000 partite: conteggi identici a quelli della prima consegna; 3.096 partite/s, indicativa.

Per ripetere il confronto, con il server avviato e da `server/` per il test:

```powershell
$env:BM_URL = 'http://127.0.0.1:18080/api'; $env:BM_USER = 'devAlice'; $env:BM_PASSWORD = 'local-alice'
node scripts/cli-sim-control.cjs 100 tmp/sim/control-all
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -B -o test -Dtest=SimulationControlTest "-Dsim.control=E:/percorso/assoluto/tmp/sim/control-all"
```

## Cosa resta non verificato

La causa del timeout intermittente osservato nella seconda esecuzione context
non è stata accertata. Non si è più ripresentato in due verifiche complete, l'ultima a macchina libera.
Non eseguite prove umane. Il confronto col server copre solo `quick/1vCom` con gli starter:
non open, 1v1 o FFA. Non misurati FFA, altri matchup,
altri bot o versioni di set. Non costruito né ispezionato un nuovo jar: il runner
si trova esclusivamente sotto `src/test/java`. I confronti di determinismo
coprono i semi dichiarati con il runtime Java 11 usato; non sono una prova su
ogni seme o su runtime diversi.

**SB-3 è chiuso.**

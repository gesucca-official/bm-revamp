# SB-7 — Banco di misura e invarianti: rapporto

**Fatto il 6 novembre 2026, in attesa del giudizio del proprietario.** Un comando misura la bozza scelta: matrice dei matchup per coppia di
mazzi e di stili, con intervalli di Wilson, durata, patte, mazzi esauriti, last resort, risorse inutilizzate, costo in HEALTH e misure per
carta. Lo stesso comando controlla gli invarianti a ogni turno e il tetto delle bound. Un secondo comando cerca mazzi forti per mutazione.

Il rapporto esce in due file, un testo per il proprietario e un file di dati. A parità di bozza, semi e impostazioni, i due file sono
**identici byte per byte**. Partita viva, regolamento, catalogo, client, protocollo e classi di produzione non cambiano.

**Approvazione della fase A.** Il proprietario ha risposto «Sì, procedi» alla proposta, che vale quindi com'era. Ne seguono tre decisioni:

- il limite di turni diventa un invariante;
- tetto e pesi delle bound sono parametri provvisori, da tarare in SB-10;
- nella ricerca le patte contano ½.

La correzione dei bot sul costo in HEALTH resta fuori da SB-7. La proposta raccomandava un mini-blocco prima di SB-10, che resta da
programmare: vedi [Decisioni prima di SB-10](#decisioni-prima-di-sb-10).

## File

Tutto in `server/src/test/java/com/gsc/bm/sim/`, fuori dal jar come il runner e il playground:

| File | Cosa fa |
|---|---|
| `Bench.java` (nuovo) | Celle della matrice, osservatore delle partite con misure e invarianti, aggregazione, statistica (Wilson, percentili) |
| `BenchReport.java` (nuovo) | Il rapporto in testo e in dati, dagli stessi conteggi e nello stesso ordine |
| `BoundCap.java` (nuovo) | Prova di ripetizione delle bound contro un manichino, con tetto e pesi come parametri |
| `DeckSearch.java` (nuovo) | Ricerca (1+λ) per mutazione, convalida su semi disgiunti, rapporto della ricerca |
| `BenchMeasureTest.java` (nuovo) | Misure a richiesta: `-Dsim.bench` per la matrice, `-Dsim.search` per la ricerca |
| `BenchTest.java` (nuovo) | Prove della suite normale: ogni controllo sa fallire, riproducibilità, ricerca, formato |
| `SimulationRunner.java` | Un osservatore facoltativo di `ROUND_READY` e `ROUND_COMMITTED`. Le firme di prima delegano con un osservatore vuoto |
| `Draft.java` | Accessori in sola lettura (basic, bound, last resort e carte di un mazzo; personaggio; copia del JSON), bozze derivate, lettura «indulgente» per le sole prove degli invarianti |

`PlaygroundMeasureTest` non cambia: il lanciatore di SB-6a resta com'era, e le opzioni nuove si aggiungono alle sue.

**Aggiunte rispetto alla proposta**, tutte nei test:

- l'osservatore nel runner;
- gli accessori e la lettura indulgente di `Draft`;
- una fonte di giocatori sostituibile in `Bench.run`, usata solo per il giocatore manomesso (vedi [Invarianti](#invarianti)).

## Misure

L'unità di misura è la **cella**: il mazzo A con uno stile contro il mazzo B con uno stile, N partite.

- **Coppie e stili.** Le coppie di mazzi sono non ordinate, specchi compresi: con i posti alternati l'ordine sarebbe ridondante. Gli
  stili predefiniti sono i tre euristici, con tutte le 9 coppie.
- **Semi.** Da 7.000.000. Sui semi pari A gioca per primo. Tutte le celle usano gli stessi semi.
- **Riepilogo per coppia di mazzi.** Somma le coppie di stili a pari peso, e il dettaglio per stile resta nel rapporto.

| Misura | Definizione |
|---|---|
| Quota | Vittorie / (vittorie + sconfitte), come in SB-3, SB-4 e SB-6a. **Intervallo di Wilson al 95%**: resta dentro [0, 1] e corretto vicino agli estremi, dove SB-4 ha visto 0,000 e 0,997; è una formula chiusa e deterministica |
| Quota del primo posto | Vittorie di chi gioca per primo, sulle partite decise |
| Durata | Turni risolti a fine partita (`game.getTurn()`): media con intervallo al 95%, mediana, 10° e 90° percentile, minimo e massimo |
| Patte, limite | Patta: nessun vincitore (morti nello stesso turno), con Wilson. Limite: oltre i 200 turni del runner; è anche un invariante |
| Mazzo esaurito | Percentuale di partite in cui il mazzo arriva a 0 carte |
| Last resort | Percentuale di partite in cui arriva in mano; turno di arrivo, cioè il primo in cui è in mano (media e mediana) |
| Risorse inutilizzate | V, T, L e A a fine partita, in media per chi vince e per chi perde (patte e limite esclusi), accanto al costo più alto di quella risorsa nel mazzo |
| Costo in HEALTH | HEALTH spesa in costi per partita. **Morte pagando**: a `ROUND_READY` il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore; i costi si pagano prima degli effetti, quindi muore pagando (R04). «Senza uccidere»: l'avversario è vivo a fine turno. Esito della partita: sconfitta o patta |
| Per carta | Per mazzo, su tutti gli stili; il dettaglio per stile è nel file di dati |
| — giocate | Scelte e pagate, anche se poi annullate da una contromossa; per partita e percentuale di partite con almeno una giocata |
| — quota se giocata | Nelle partite in cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo |
| — morta | Turni in mano senza essere una mossa legale (costo non pagabile o nessun bersaglio), per partita in cui è stata in mano |
| — ferma | Turni in mano, legale ma non scelta: separa la carta inutile dal bot che non la sceglie |

Un intervallo copre solo l'errore di campionamento. Con molte celle, circa una su venti cade fuori per caso: il rapporto lo scrive.

## Invarianti

Si controllano a ogni `ROUND_READY`, per ogni giocatore vivo, senza cambiare la partita. Una violazione indica bozza, mazzo, stile, seme e
turno, con la mano, la dimensione del mazzo e le risorse, per esempio:

`[bound-giocabile] bozza violazione-senza-mosse.json · mazzo starter-bruiser · stile aggressivo · seme 7000000 · turno 1: bound bruiser.character.LittleSmack non legale; mano [...], mazzo 17, risorse {...}`

| Invariante | Cosa controlla | Come si prova che sa fallire |
|---|---|---|
| `senza-mosse` | Le mosse legali di `BotView` non sono vuote | Bound a costo V 99, venti carte regolari impagabili, basic senza oggetti da prendere |
| `mossa-vuota` | La mossa inviata non è vuota. Con lo stile `com` rileva anche un disaccordo fra motore e vista | Stessa bozza |
| `bound-gratuite` | Controllo statico: ogni bound della bozza è gratuita (D2). Il caricatore di SB-6a non lo controllava | Stessa bozza: due violazioni, una per bound |
| `bound-giocabile` | Se in mano c'è una carta regolare da scartare, ogni bound in mano è legale | Stessa bozza |
| `last-resort-giocabile` | La last resort in mano è sempre legale | Struggle a costo V 999, con la lettura indulgente: il caricatore normale la rifiuterebbe |
| `basic-bound-in-mano` | Basic e bound del mazzo sono sempre in mano | Giocatore manomesso che scarta le bound giocate |
| `last-resort-in-mano` | A mazzo vuoto e mano incompleta la last resort è in mano | Giocatore manomesso che non riprende la last resort |
| `limite-turni` | Nessuna partita arriva al limite dei 200 turni | Carte senza effetto e uno stile che gioca solo quelle |
| `tetto-bound` | Vedi sotto | Una bound da 20 HIT, una da +5 T al bersaglio, una pulita da 5 HIT; il tetto alzato a 25 libera la prima |

**Vincoli di bound e last resort: cosa resta da controllare in partita.** Il caricatore controlla già i bersagli sugli oggetti e la last
resort gratuita. In partita resta da controllare ciò che dipende dallo stato:

- che le carte siano davvero legali quando servono;
- che restino in mano;
- che la last resort torni.

Basic, bound e last resort in mano li garantisce oggi `Player`, non la bozza: **nessuna bozza può violarli.** Per questo la prova usa un
`BotPlayer` manomesso solo nel test. Dimostra che il banco si accorgerebbe di una regressione del motore, non che una bozza possa
provocarla.

Con `-Dsim.strict=true` il comando fallisce e riporta tutte le violazioni, tetto delle bound compreso. Senza, le violazioni finiscono nel
rapporto: la fotografia di una bozza con difetti noti deve poter uscire.

### Tetto delle bound sulla ripetizione

**Svolgimento della prova.** Il personaggio gioca **solo la bound per 8 turni** («otto turni su dieci ≈ 40 danni», dalle schede) contro un
manichino:

- il manichino ha 1000 HEALTH, A 0, nessuna risorsa, e gioca una carta senza effetto;
- la salute di tutti è alzata a 1000, perché la prova non si chiuda prima.

La stessa partita, con lo stesso seme, si gioca quattro volte:

- con la bound o con una carta senza effetto;
- contro il manichino fermo o contro uno che colpisce 10 HIT a turno.

**Valore di un uso.** Dalle differenze fra le quattro partite, uso per uso, valore = somma di:

- **danno inflitto:** salute tolta al manichino, anche periodica, cioè il veleno che cresce;
- **danno parato** sul colpo di prova, al netto degli effetti della bound su di sé;
- **salute propria:** cure positive, danni a sé negativi;
- **guadagni immediati pesati** di V, T, L e A, misurati su una copia della partita al momento della mossa, prima del dimezzamento di L.
  Così il peso di L non conta due volte il decadimento.

**Parametri.**

- Tetto: 5 unità, con tolleranza del 20% (`-Dsim.boundCap`, `-Dsim.boundTolerance`).
- Pesi: V 1, A 1, T 1 per chi è immune e 0 per chi non lo è, L 0,5 (`-Dsim.boundWeights=V:1,A:1,T:1,L:0.5`). HEALTH vale 1.

**Quando una bound viola il tetto:**

- un uso vale più di tetto × (1 + tolleranza);
- **si accumula:** il danno all'ottavo uso supera quello al primo di oltre mezzo punto;
- **lascia qualcosa sull'avversario:** dopo gli 8 usi il manichino ha T, L o A diversi dalla partita senza bound, oppure stati o timer in
  più;
- non è giocabile nella prova.

**Note che non fanno fallire:** cura, oggetti, equip, «para tutto il colpo di prova», «più di una funzione» (danno, parata e guadagno: le
schede ne chiedono una). La proposta citava le «mosse annullate»: la prova non le distingue da una parata totale, quindi la nota è «para
tutto il colpo di prova».

## Ricerca dei mazzi

- **Pool per personaggio:**
  - tutte le carte regolari della bozza, oggetti compresi. Nel formato di oggi non sono legate a un personaggio, come le azioni
    d'archetipo del piano;
  - le bound del personaggio, di cui se ne scelgono quante ne chiede il formato;
  - le last resort generiche o riservate a lui.
- **Formato.** Dimensione, copie e numero di bound vengono da `rules` della bozza. Ogni candidato passa dalla validazione di `Draft`, quindi
  è conforme per costruzione (`searchRespectsTheFormat`: 300 mutazioni di fila).
- **Algoritmo: (1+λ) con elitismo.**
  - Due partenze per personaggio: lo starter e un mazzo casuale conforme.
  - λ = 12 mutanti per generazione, ciascuno con 1–3 modifiche: una copia sostituita di norma, una bound o la last resort cambiate in un
    caso su dieci ciascuna.
  - Un seme fisso per le mutazioni.
- **Valutazione:**
  - contro tutti i mazzi della bozza, specchio compreso, nelle 9 coppie di stili euristici;
  - 16 partite per combinazione, posti alternati;
  - punteggio = (vittorie + ½ patte e limite) / partite.
- **Contro il sovradattamento:**
  - stessi semi per tutti i candidati di una generazione, ma un blocco nuovo a ogni generazione;
  - il migliore si rivaluta sempre sul blocco nuovo;
  - i finalisti si convalidano su **semi disgiunti**, con 300 partite per combinazione: il costruttore rifiuta blocchi sovrapposti. Sono
    il mazzo finale, i due migliori fra quelli accettati e lo starter come riferimento.
- **Arresto.** Al massimo 40 generazioni, oppure 10 generazioni senza un miglioramento superiore a un errore standard.
- **Semi.** Ricerca da 7.100.000, convalida da 7.900.000, mutazioni 7.000.007 combinato col personaggio.

**Prova** (`searchFindsADeliberatelySuperiorCard`):

- Bozza «attuale» più una carta gratuita a priorità 3 da 30 HIT, assente dagli starter, come nella proposta.
- La ricerca parte dallo starter di Bruiser, con lo stile aggressivo, λ 8, 15 generazioni e 200 partite di convalida per avversario.
- Il test richiede che:
  - il mazzo trovato contenga la carta;
  - la quota di convalida sia almeno 0,70 e il limite inferiore di Wilson superi 0,60, come nella proposta;
  - il limite inferiore superi il limite superiore dello starter;
  - il mazzo superi lo starter contro ciascun avversario.
- **Esito:**
  - il mazzo trovato ha una copia della carta;
  - quota di convalida **0,756 [0,708–0,797]** contro **0,239 [0,197–0,286]** dello starter.
- Una parte del guadagno viene da altre mutazioni: nella ricerca reale senza la carta Bruiser arriva a 0,639. Il test prova che la carta
  viene trovata e che il mazzo vince nettamente, non quanto vale la sola carta.
- Prima di fissare 30 HIT ho provato anche 100 HIT, per sicurezza: 0,946 [0,918–0,965], due copie.

## Riproducibilità

- `sameSeedSameReportByteForByte`: stesso testo e stessi dati con 1 e con 3 thread; con altri semi i dati cambiano; il testo non contiene
  tempi.
- Nella fotografia, quattro esecuzioni Maven separate (1 e 8 thread per ciascuna bozza) hanno dato rapporti con lo stesso SHA-256:

| Bozza | Testo | Dati |
|---|---|---|
| attuale | `7aff3eee…5610490` | `bd349c42…42fb078` |
| prova-sb9 | `bc505a98…3e43878` | `90dcc2d9…4b2ca72` |

- I tempi stanno in un file `.tempi.txt` a parte.
- Ordini fissi ovunque: mazzi, stili e celle in ordine di dichiarazione, carte per binding. Le celle in parallelo si sommano nell'ordine
  di cella, decimali e virgole con `Locale.ROOT`, JSON con a capo `\n`.
- La bozza compare come percorso relativo al repository, così il rapporto non dipende dalla cartella del checkout.

## Come si lancia

Da `server/`, con `JAVA_HOME` sul JDK di `.tools/`:

```powershell
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=BenchMeasureTest#matrix" "-Dsim.bench=1000" "-Dsim.draft=<percorso assoluto>"
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=BenchMeasureTest#search" "-Dsim.search=all" "-Dsim.draft=<percorso assoluto>"
```

**Opzioni comuni con SB-6a:**

- `sim.draft`: senza, vale la bozza «attuale»;
- `sim.decks`, `sim.styles`: gli stili noti sono `com`, `casuale`, `aggressivo`, `prudente`, `risorse`;
- `sim.firstSeed`: qui il predefinito è 7.000.000.

**Opzioni nuove:**

- `sim.threads`: il predefinito è il numero di processori, e il rapporto non cambia;
- `sim.strict`, `sim.note`;
- per il tetto: `sim.boundCap`, `sim.boundTolerance`, `sim.boundWeights`;
- per la ricerca: `sim.searchGames`, `sim.searchGenerations`, `sim.validationGames`.

**Uscite** in `tmp/sim/`:

- `sb7-<bozza>-<partite>.md`, `.json` e `.tempi.txt`;
- `sb7-ricerca-<bozza>-<all|n>.*`.

## Prima fotografia

**Dati di prova, non di bilanciamento:** carte e bot di oggi, nessuna correzione.

- Impostazioni: 1000 partite per cella, 3 stili (9 coppie), 27 celle e 27.000 partite per bozza, semi 7.000.000–7.000.999.
- Rapporti completi in [`sb-7/`](sb-7/): testo, dati e tempi su 1 e su 8 thread.

**Bozza «attuale»** ([testo](sb-7/sb7-attuale-1000.md)), SHA-256 `123c880d…491ab293`:

| A | B | quota A [IC 95%] | turni medi | patte |
|---|---|---|---:|---:|
| starter-bruiser | starter-bruiser | 0,501 [0,490–0,513] | 11,85 | 20,1% |
| starter-bruiser | starter-junkie | 0,013 [0,011–0,016] | 7,82 | 2,5% |
| starter-junkie | starter-junkie | 0,503 [0,490–0,515] | 14,25 | 32,2% |

- **Invarianti:** nessuna violazione su 27.000 partite.
- **Tetto: tutte e quattro le bound lo violano.**
  - LittleRage vale 8 per uso (+5 V e 3 parati).
  - LittleSmack vale 10 (5 HIT e +5 A).
  - RottenSmile lascia A −40 sull'avversario.
  - PatheticBlade vale fino a 30: danno da 7 al primo uso a 25 all'ottavo, e lascia T +40. È il caso noto di SB-4, che il banco trova da
    solo.
- **Altri dati:**
  - mazzo esaurito: 11,5% (Bruiser) e 37,4% (Junkie);
  - GoingBerserk è morta in mano in media 7,4 turni per partita;
  - PatheticBlade è giocata 8,7 volte per partita.

**Bozza `prova-sb9.json`** ([testo](sb-7/sb7-prova-sb9-1000.md)), SHA-256 `f4d5eb24…349d0e`, la stessa di SB-6a:

| A | B | quota A [IC 95%] | turni medi | patte |
|---|---|---|---:|---:|
| prova-mara | prova-mara | 0,499 [0,488–0,510] | 13,33 | 13,9% |
| prova-mara | prova-rocco | 0,000 [0,000–0,000] | 8,81 | 2,0% |
| prova-rocco | prova-rocco | 0,492 [0,480–0,504] | 9,56 | 22,7% |

- **Invarianti:** nessuna violazione.
- **Tetto:** tutte e quattro le bound di prova lo rispettano. `prova.rocco.Fiato` ha la nota «cura», che le schede escludono dalle bound.
- **Morti pagando** per Rocco su 9000 partite per stile: 180 con l'aggressivo, 49 con il prudente, 81 con le risorse. Metà finiscono in
  sconfitta senza uccidere, metà in patta. È il difetto dei bot già visto in SB-6a, ora misurato.
- Mara non vince mai contro Rocco con le carte di prova: è un dato sulla bozza di prova, non sui personaggi.

**Ricerca sulla bozza «attuale»** ([testo](sb-7/sb7-ricerca-attuale-all.md)), con i parametri standard e 4 ricerche:

| Personaggio | Partenza | Starter in convalida | Migliore finalista in convalida |
|---|---|---|---|
| Bruiser | starter | 0,223 [0,212–0,235] | 0,639 [0,625–0,653] |
| Bruiser | casuale | 0,223 | 0,568 [0,554–0,583] |
| Junkie | starter | 0,782 [0,770–0,794] | 0,987 [0,984–0,990] |
| Junkie | casuale | 0,782 | 0,984 [0,980–0,987] |

- Nessuna ricerca si è fermata per pazienza: tutte hanno fatto 40 generazioni.
- **Il mazzo finale vaga.** Un mutante sostituisce il migliore appena lo supera sul blocco della generazione, anche di poco. Con 288
  partite per valutazione e 12 mutanti, il più fortunato vince spesso: per Bruiser il finale convalida a 0,541, un finalista precedente a
  0,639. **Il mazzo da usare è il migliore in convalida, non l'ultimo.**
- Lo scarto fra ricerca e convalida resta piccolo: da 0,013 a 0,055.
- I mazzi trovati mescolano carte di Bruiser e del Junkie, perché nella bozza le carte regolari sono generiche.

## Tempi e costo di una matrice da 7 personaggi

Su questo portatile, Java 11, 8 processori logici, misure indicative (altri programmi potevano girare):

| Misura | 1 thread | 8 thread |
|---|---:|---:|
| Matrice «attuale», 27.000 partite, invarianti e tetto compresi | 46,5 s, **1,72 ms a partita** | 17,2 s, 0,64 ms |
| Matrice `prova-sb9`, 27.000 partite | 38,7 s, 1,43 ms | 16,3 s, 0,60 ms |
| Ricerca «attuale»: 4 ricerche da 40 generazioni, circa 690.000 partite senza invarianti | — | 227 s, circa 0,33 ms |

Per confronto, la proposta stimava 1,2 ms senza invarianti: controllarli costa circa il 40% in più.

- **Matrice da 7 personaggi:** 28 coppie × 9 coppie di stili × 1000 partite = 252.000 partite.
  - Circa **7 minuti su un thread**, circa **3 minuti su 8 thread**, se le partite durano come oggi.
  - Mazzi più complessi possono allungarle.
- **Ricerca su 7 personaggi:**
  - una valutazione costa 1008 partite (7 avversari);
  - circa 600.000 partite per ricerca, 14 ricerche;
  - circa **45–50 minuti su 8 thread**, da misurare quando la bozza esisterà.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero processi Maven o Java altrui.

- `./scripts/build.ps1 -Task Test -Offline`: **verde**, eseguito due volte (la seconda dopo aver portato la prova di ricerca a 30 HIT), in
  91 s.
  - Maven: 489 test, 0 falliti, 6 saltati: le quattro misure a richiesta di prima e le due di `BenchMeasureTest`. Gli 11 test in più sono
    i 9 di `BenchTest` e i 2 di `BenchMeasureTest`; `BenchTest` dura circa 8 s.
  - Client: 36 test su 36.
- `python scripts/check-rules.py`: regolamento e copia client allineati.
- Nessun test esistente è stato toccato e nessun atteso è cambiato. `PlaygroundTest` e `SimulationRunnerTest` passano con l'osservatore
  aggiunto al runner.
- `TestServerContext` **non lanciato**: il blocco tocca solo `server/src/test` e i documenti. Contesto Spring, CLI e classi di produzione
  non cambiano.

## Cosa non è provato

- **I bot.** Un intervallo di confidenza non corregge un bot che gioca male. Nessuno stile tiene conto del costo in HEALTH: lo dicono le
  morti pagando di Rocco. Le contromosse hanno un valore fisso o legato alla propria salute, e il «+x» è stimato 5. La ricerca trova ciò
  che questi bot sanno giocare.
- **Il tetto delle bound** si misura contro un manichino, non nelle partite.
  - Il danno parato si misura su un solo colpo di prova, da 10 HIT.
  - Pesi e tetto sono ipotesi: il listino di potenza è SB-10.
  - Una bound che vale molto solo in certi stati della partita non viene vista.
- **L'efficacia delle contromosse** non è misurata: una carta giocata conta come giocata anche se viene annullata.
- **Gli invarianti sulla mano** sono provati con un giocatore manomesso: nessuna bozza può violarli oggi.
- **La riproducibilità** è provata con Java 11 su questa macchina, con 1, 3 e 8 thread, non su runtime diversi.
- **Le stime per 7 personaggi** sono estrapolate: la durata delle partite cambierà con le carte nuove.
- **Il difetto di BadTrip** con le risorse assenti (rapporto SB-6a) non è corretto: cambierebbe la partita viva.

## Cosa serve a SB-10

- **Bot sul costo in HEALTH.** Va corretto prima delle misure su Rocco, altrimenti i suoi numeri dipendono dai suicidi.
- **Listino di potenza.** Tarare tetto e pesi, che oggi sono 5, V 1, A 1, T 1 o 0, L 0,5. Il banco li riceve come parametri, non serve
  ricompilare.
- **Ricerca.** Si sceglie il mazzo migliore in convalida, non l'ultimo. Si può valutare una sostituzione solo con un margine superiore a
  un errore standard, per ridurre il vagare del mazzo finale.
- **Una bozza con i sette personaggi**, per la prima matrice completa.

## Decisioni prima di SB-10

1. **Mini-blocco sui bot per il costo in HEALTH**, raccomandato in fase A: quando farlo.
2. **Regola di sostituzione nella ricerca:** tenerla com'è e scegliere per convalida, oppure sostituire solo con un margine. Raccomando il
   margine: è una costante del banco, non tocca la partita.
3. **Tetto delle bound**: confermare che le quattro violazioni della bozza «attuale» sono attese (le bound attuali vanno riviste, come dice
   il piano) e che SB-10 parte da questi parametri.

# SB-30b — B5b: il bot Difficile

14 novembre 2026. Base `525d9cb`, working tree pulito. Attuazione di B5b del
[progetto](../../design/set-base/sb-30b-progetto.md#5-piano-a-blocchi), approvato in
[D85 e D91](../../set-base-plan.md#decisioni-del-proprietario), sul contratto pubblico di `ViewTable` consegnato in
[B5a](sb-30b-b5a-report.md). Nessun Maestro, campionatore, memoria o scala. Il Difficile non entra nella partita viva, nella
scelta del livello o nel client. Nessun push; STOP dopo il commit.

## Cosa cambia

Solo file nuovi:

| File | Contenuto |
|---|---|
| `server/src/main/java/com/gsc/bm/model/game/bot/DifficilePolicy.java` | Il Difficile |
| `server/src/test/java/com/gsc/bm/model/game/bot/DifficilePolicyTest.java` | Scenari a due turni, restrizione del Normale, soglia di stile, regole vive, carte cercate, confine dei tipi |
| `server/src/test/java/com/gsc/bm/sim/NoHiddenInformationTest.java` | Prova «nessuna informazione nascosta», sempre attiva, Normale e Difficile |
| `server/src/test/java/com/gsc/bm/sim/DifficileMeasureTest.java` | Costo per decisione e controllo di buon senso, solo con `-Dsim.b5b` |
| `server/src/test/java/com/gsc/bm/sim/PublicCatalog.java` | Testo pubblico delle carte della bozza per la tavola, come in `ViewTableFidelityTest` |

Nessun file esistente toccato: `git status` mostra solo i cinque file nuovi, il rapporto e la sua evidenza. Restano identici
byte per byte `TurnForecast`, `LethalAwarePolicy`, stili, `StyleSupport`, `SoughtHitPolicy`, `BotView`, banco, motore,
`ViewTable`, `PrintedEffects` e `DataCards`. Nessun atteso esistente cambiato. Non toccati regolamento, `docs/sets`,
catalogo e SQLite, bozza e bancone, client, piano, README, `prototipi/carriere` e `docs/design/carriere`.

## Cosa fa il Difficile

`DifficilePolicy(inner, catalogo)` avvolge uno stile, come `LethalAwarePolicy`; nei test e nelle misure lo stile è
`SoughtHitPolicy(stile, ALWAYS)`, lo stesso del Normale. Con le regole vive passa la mano allo stile, come il Normale.
Il catalogo è il testo pubblico delle carte del set per binding: serve alla tavola per giocare la carta trovata da una ricerca
e l'oggetto creato da un consumo. Non è informazione nascosta.

1. **Restrizione del Normale per prima**, invariata: `TurnForecast.prefer` sul turno in corso. Salvo prima di tutto, colpo
   sicuramente letale se c'è, patta invece di sconfitta (D77). Le mosse scartate non vengono neppure valutate.
2. **Due turni** su `ViewTable.forecast`, senza mani campionate e senza pesca simulata. Per ogni mossa *m1* rimasta:
   - minacce del primo turno: i colpi mostrati e pagabili, gli stessi di `TurnForecast.threats`, più «nessuna mossa nota»;
   - varianti: ordine nel gruppo di velocità sempre; ricerca trovata o no solo per il posto la cui mossa cerca una carta
     descritta dal catalogo (le altre combinazioni darebbero lo stesso esito);
   - se la partita non è finita, la miglior risposta *m2* dalla mano nota dopo il primo turno, più la carta trovata se la
     variante lo dice; le carte pescate restano ignote e non si giocano; senza mosse legali, mossa vuota;
   - ogni *m2* vale il caso peggiore sui colpi mostrati al secondo turno, più «nessuna mossa nota», e sulle varianti.

   Valore di *m1* = min su minacce e varianti del turno 1 di max su *m2* di min su minacce e varianti del turno 2.
3. **Valutazione a fine orizzonte** (§2.6), semplice, con pesi dichiarati come costanti della classe. La taratura è di B6.

   | Termine | Peso |
   |---|---:|
   | Partita finita: vittoria, sconfitta, entrambi a terra | +1, −1, 0 |
   | Differenza di salute contro l'avversario in piedi più sano, per punto | 0,01 |
   | POISON dovuto alla prossima fine turno (TOXICITY/2 senza immunità), per punto, a sé (−) e all'avversario (+) | 0,01 |
   | Colpo mostrato e pagabile, contro di sé (−) o proprio (+) | 0,03 |
   | Gettone di vulnerabilità, su di sé (−) o sull'avversario (+) | 0,02 |
   | Carta propria nota, distinta, pagabile al turno dopo | 0,005 |
   | Limite di una posizione non finita | ±0,95 |

   L'ALCOHOL lo gioca la tavola dentro l'orizzonte (corazza, ALERTNESS a fine turno) e non si valuta oltre.
4. **Lo stile spareggia**: riceve le mosse entro **0,015** dalla migliore (un punto e mezzo di salute) e sceglie come sempre.
   Il Difficile non estrae numeri dal `Random`: lo fa lo stile, come nel Normale.

`values(vista, mosse)` restituisce il valore di ogni mossa rimasta dopo la restrizione: lo usano i test per confrontare due
decisioni valore per valore.

**D94, «Annuncia» con più nomi.** Le carte cercate si leggono in un solo punto, `DifficilePolicy.sought(carta)`, che
restituisce una **lista** di binding. Il resto della classe non suppone mai un nome solo: chiede soltanto se la mossa cerca
carte tutte descritte dal catalogo, per decidere quali varianti giocare. Vedi [impatto della 1.6](#impatto-previsto-della-16).

## Scenari

In `DifficilePolicyTest` lo stesso stile, che preferisce una carta e altrimenti prende la prima mossa offerta, sta dentro il
Normale (`LethalAwarePolicy`) e dentro il Difficile. Ogni test controlla la mossa dei due, le mosse offerte allo stile e i
valori che decidono. Carte sintetiche con testo stampato, per avere numeri leggibili.

| Scenario | Posizione | Normale | Difficile | Perché |
|---|---|---|---|---|
| Colpo mostrato che arriva al turno dopo | Salute 35; l'avversario mostra colpi da 30 e 12; in mano Strike e una Guard che dimezza HIT in questo turno e nel prossimo | **Strike**: contro ciascun colpo il turno resta salvo (35 − 30 = 5), nessuna restrizione | **Guard** | Strike, poi 30 ora e 12 al turno dopo: a terra anche con la Guard giocata dopo (5 − 6), valore −1. Guard ora: 15 + 6 o 6 + 15, restano 14. Allo stile è offerta solo la Guard |
| Gettone che si chiude | Salute 45; gettone ×1,5 su HIT finché non gioca «Finisher», trovato e mostrato; l'avversario mostra colpi da 20 e 10 | **Jab**: il turno resta salvo (45 − 30 = 15) | **Finisher** | Dopo il Jab il gettone resta: 30 ora e 15 al turno dopo, a terra (−1). Il Finisher chiude il gettone a fine turno: 30 + 10, restano 5 |
| Veleno che matura a fine turno | Salute 25; Swig colpisce per 30 e dà 30 TOXICITY a chi lo gioca (15 POISON a ogni fine turno); nessun colpo mostrato | **Swig**: vede solo la prima fine turno (restano 10) | **Jab** | La seconda fine turno porta a 10 − 15, a terra qualunque risposta: Swig vale −1 |
| Risorsa che non basterà per pararsi | Salute 40, ALERTNESS 5; Lunge e Guard (solo questo turno) costano 5 ALERTNESS, il Jab è gratis; colpi mostrati da 30 e 12 | **Lunge**: il turno resta salvo (40 − 30 = 10) | **Guard o Jab**, mai Lunge | Serve una Guard, ora o al turno dopo. Dopo la Lunge non è più pagabile: 30 ora e 12 dopo, a terra (−1). Dopo il Jab la Guard resta pagabile |

Tre test in più fissano le altre regole:

- **La restrizione viene prima:** un 40 mostrato contro salute 35. Il Normale offre solo la Guard, e il Difficile valuta e
  offre solo la Guard anche se lo stile preferisce lo Strike.
- **Soglia di stile:** colpi gratuiti da 10, 11, 9 e 8, nessuna minaccia. Due turni valgono 21 (10 + 11), 20 iniziando col 9
  e 19 iniziando con l'8. Il 9 sta entro 0,015 e resta, l'8 no; lo stile sceglie il 9.
- **Regole vive:** il Difficile è lo stile, come il Normale.

## Nessuna informazione nascosta

**Confine dei tipi.** `newClassesImportNoEngineTypeNorReflection` legge i sorgenti di `DifficilePolicy` e `ViewTable` e
fallisce se importano `Game`, `Player`, `ComPlayer`, `Character` o `Move`, se usano `java.lang.reflect`, `Class.forName` o
`getDeclared…`. Il Difficile riceve solo `BotView`, `LegalMove`, `Random` e il testo pubblico delle carte.

**Proprietà sul comportamento.** `NoHiddenInformationTest`, sempre attivo (circa 5 s), usa 60 posizioni da partite reali `d50`
della bozza, Normale contro Normale con stili e mazzi misti, raccolte da `Sb30bProbeTest.points` con semi da 7.400.000. Su una
copia della partita cambia solo ciò che non si vede:

- mano coperta dell'avversario, scambiata con carte del mazzo di nome diverso, mostrate, legate, base e last resort esclusi;
- ordine di entrambi i mazzi;
- mossa già inviata dall'avversario, scelta dalla sua politica e messa fra le mosse in attesa;
- stato del generatore dell'avversario, che consuma la scelta e poi da 1 a 50 estrazioni.

Le due viste devono essere uguali. Per ciascuno dei tre stili, con lo stesso seme, il Normale deve scegliere la stessa mossa;
il Difficile la stessa mossa e **gli stessi valori per mossa**.

| Esito | Numero |
|---|---:|
| Posizioni controllate | 60/60 |
| Mano coperta cambiata davvero | 57 |
| Mossa dell'avversario già inviata | 60 |
| Posizioni con carte mostrate dall'avversario | 5 |
| Posizioni in cui la restrizione del Normale toglie mosse | 6 |
| Viste uguali; stesse mosse e stessi valori per 3 stili | 60/60 |

Le posizioni con carte mostrate sono poche, perché il campione segue la sonda (un punto ogni tre turni, dal posto 1). Gli
scenari coprono quei casi in modo esplicito.

## Costo

Un thread, sulle **stesse 150 decisioni** della sonda B4 (bozza, semi da 7.200.000, mediana 9 mosse legali, massimo 14),
stili a rotazione. Un primo giro serve da riscaldamento, il secondo è misurato. Decisione intera: restrizione, due turni e stile.

| Misura | Mediana | P90 | Massimo |
|---|---:|---:|---:|
| **Difficile** | **3,69 ms** | **7,84 ms** | **14,26 ms** |
| Normale, stesse decisioni, per confronto | 0,27 ms | 0,41 ms | 1,00 ms |
| Limite superiore esaustivo della sonda (§3.3) | 5,8 ms | 11,6 ms | 22,8 ms |
| Difficile dentro le 300 partite del controllo di buon senso (2.688 decisioni, braccio B) | 1,74 ms | 4,14 ms | 25,73 ms |

**P90 7,84 ms, sotto i 50 ms di D85 punto 4.** Il test di costo fallisce se il P90 supera 50 ms. Il guadagno sul limite
della sonda viene dalla restrizione del Normale e dalle varianti di ricerca giocate solo se cambiano l'esito.

## Controllo di buon senso

Non è una scala né una misura di forza: quella è B6. Serve solo a escludere un errore che renda il Difficile più debole.
300 partite `d50` sul braccio B (bozza di riferimento, D89), semi 7.500.000–7.500.299, mazzi misti, posti alternati, stesso
stile per i due livelli.

| Stile | Difficile | Normale |
|---|---:|---:|
| Aggressivo | 44 | 47 |
| Prudente | 55 | 36 |
| Risorse | 51 | 45 |
| **Totale** | **150** | **128** |

22 patte, nessun limite di turni: il Difficile vince il **54,0% delle partite decise**. Nessun segno di un errore che lo
indebolisca. Lo scarto con l'aggressivo, 44–47, sta dentro il rumore di 91 partite e non si interpreta. Il valore medio è
vicino al 52,64% del Normale sul bot senza previsione (D76): coerente con la nota della
[proposta](../../design/set-base/bot-livelli-proposta.md#41-con-i-bot-del-banco), oggi il Difficile non è ancora il
gradino del 60–70%. Va misurato e tarato in B6, a partire dalla valutazione.

## Mutazioni

Mutanti compilati con `javac` in `target/classes` da copie in `%TEMP%`, poi `mvn surefire:test`; sorgente di prodotto mai
sostituito, classe originale ricompilata nel `finally`. Il mutante del confine dei tipi si controlla puntando il test di
confine sulla cartella del mutante (`-Db5b.botSources`). Tutti rilevati da asserzioni, non da errori di compilazione.

| Mutazione in `DifficilePolicy` | Test che cadono |
|---|---|
| M1, legge la mano coperta: importa `Player` e ne legge le carte in mano | `newClassesImportNoEngineTypeNorReflection` |
| M2, ignora il secondo turno: valuta a fine del primo | i quattro scenari a due turni e la soglia di stile |
| M3a, lo spareggio salta la restrizione: valuta tutte le mosse legali | `theNormaleRestrictionComesFirst` |
| M3b, lo spareggio salta la restrizione: lo stile riceve tutte le mosse legali | i quattro scenari, la restrizione e la soglia |
| M4, caso migliore invece del peggiore sulle minacce | colpo al turno dopo, gettone, risorsa |
| M5, soglia di spareggio ignorata | `theStyleBreaksTiesWithinTheThreshold` |

Sulla M1: dalla `BotView` non esiste una strada verso la mano coperta, quindi un Difficile che la leggesse dovrebbe passare per
un tipo del motore o per la riflessione. Il confine dei tipi è il controllo che lo rileva. La proprietà sul comportamento
copre l'altro lato: se una vista portasse un dato nascosto, le due viste delle copie sarebbero diverse.

## Identità e verifiche

Risultati in [evidence.json](sb-30b-b5b/evidence.json).

| Verifica | Esito |
|---|---|
| `ChargeMeasureTest#measure`, passo 0 B 1.5, 4 semi per cella | **8.640 partite**; matrice JSON e Markdown, osservazioni, bozza e braccio identici byte per byte a `tmp/sb16g15/step0-B` |
| `ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, regole 1.13, cartella storica 2b2 | **480.000 partite**; JSON 266.868 B e Markdown 26.111 B identici byte per byte alla base; SHA-256 `069817b8…486c` e `966af023…19be`. Il `final-live` precedente è stato spostato prima della corsa, quindi il file confrontato è stato riscritto |
| `TurnForecastFidelityTest` | **A 5.526/5.526, B 5.536/5.536**, 72/73 esclusi per timer, come in B5a |
| `ViewTableFidelityTest` | Primo turno **5.526/5.526 e 5.536/5.536**; due turni, salute e risorse, **3.026/3.026 e 3.032/3.032**, come in B5a |
| `./scripts/build.ps1 -Task Test -Offline` | **830 test server, 0 falliti o errori, 20 saltati; client-debug 37/37** |
| `./scripts/build.ps1 -Task TestServerContext -Offline`, verifica separata | **947 test, 0 falliti o errori, 20 saltati**, contesto applicativo e CLI compresi |
| `python scripts/check-rules.py`, `python scripts/check-links.py`, `git diff --check` | Verdi; 330 file, 0 link rotti |

Nessun rosso, nessuna voce del registro dei rossi noti da aggiungere o togliere. Client-web non verificato: il client non
cambia. Nessuna verifica Playwright.

## Budget

Contato come in B5a: orologio delle corse della logica nuova, compilazione compresa. Tetto dichiarato prima di ogni corsa,
un solo Maven alla volta, processi Java e porte controllati prima di ciascuna. Nessuna misura di bilanciamento in
contemporanea. Nessuna stima sbagliata di oltre il doppio.

| Corsa B5b | Tetto dichiarato | Secondi |
|---|---:|---:|
| Compilazione, scenari e anti-barare | 120 | 59,446 |
| Costo e controllo di buon senso | 150 | 56,715 |
| Sei mutazioni, `test-compile` e ripristino compresi | 170 | 77,250 |
| **Totale B5b** | | **193,411 / 300** |

**B5: 266,107 (B5a) + 193,411 = 459,518 s su 1.800.** Restano 1.340,482 s per B5c.

| Verifiche obbligatorie, fuori budget | Secondi |
|---|---:|
| Identità passo 0 (banco: 23,7 s) | 43,343 |
| Identità viva | 282,373 |
| Test ordinari | 154,071 |
| Contesto Spring completo | 587,335 |

Log, mutanti e uscite intere in `%TEMP%/bm-sb30b-b5b/`.

## Comandi riproducibili

Da `server/`, JDK e Maven di `.tools`, impostazioni come in B5a:

```powershell
& $mvn @common test '-Dtest=DifficilePolicyTest,NoHiddenInformationTest'
& $mvn @common test '-Dtest=DifficileMeasureTest' '-Dsim.b5b=all'
```

`-Dsim.b5b=cost` o `sanity` separa le due misure; `-Dsim.b5bGames` e `-Dsim.b5bPoints` cambiano i campioni.

## Limiti dichiarati

- **Serializzazione.** Il testo delle carte (`BotView.CardSeen`) non è `Serializable`, quindi una partita che contiene un
  Difficile non si copia con la serializzazione Java: fallirebbe con un errore esplicito, non in silenzio. Banco e
  `SimulationRunner` non copiano le partite; la partita viva sì, e lì il Difficile non c'è. Il collegamento vivo (SB-30a/SB-28)
  dovrà passare il catalogo da una fabbrica o renderlo serializzabile.
- **FFA.** La valutazione confronta il bot con l'avversario in piedi più sano, e una posizione con un solo avversario a terra
  termina l'orizzonte come fa la tavola. Pensata per il duello; nessuna prova FFA.
- **Fuori modello**, come in B5a: timer, stati sulle risorse, parte «x» non descritta, oggetti pescati fra i turni.
- **Valutazione:** pesi dichiarati, non tarati. Il controllo di buon senso non dice quanto valgono.

## Cosa resta a B5c e B6

- **B5c:** `PublicMemory`, `WorldSampler`, `MaestroPolicy` con numeri comuni, miscela di stili, tempo massimo, anti-barare per
  il Maestro con la stessa prova di `NoHiddenInformationTest`, che va estesa con la memoria (parte 3 di §4). Il Maestro può
  riusare `DifficilePolicy.evaluate` come valutazione a fine orizzonte, come chiede §2.6, e `PublicCatalog` nei test.
- **B6:** scala a quattro livelli; taratura dei pesi della valutazione e della soglia di stile del Difficile (oggi 54% delle
  decise contro il Normale nel controllo, non una misura); pesi della miscela del Maestro; prova umana alla cieca.

## Impatto previsto della 1.6

La proposta 1.6 porterà un «Annuncia» con al massimo due nomi (D94). Non è anticipata: la bozza resta quella di oggi.

- **Nel Difficile:** `sought` restituirà già due binding; nulla da riscrivere nella ricerca su due turni. Cambierà solo
  l'insieme delle varianti di una ricerca: da «trovata / non trovata» a «trovata la prima / la seconda / nessuna».
- **In `ViewTable`:** oggi una ricerca legge un solo `searchedCard` e `Flags` dice solo se la ricerca trova. La 1.6 dovrà
  dire come si legge la carta cercata (un campo con più nomi o più passi) e come la tavola sceglie quale carta trova. Da
  decidere con la 1.6 stessa, con le prove d'identità e di fedeltà di B5a, perché cambia una classe già consegnata.
- **Scelta del bot:** la 1.6 dice come il bot sceglie il colpo cercato. Se la scelta si fa giocando la carta, il Difficile la
  valuterà come una variante in più; se è un'opzione della mossa (come scarto e oggetto), arriverà come mosse legali distinte
  da `BotView` e il Difficile le valuterà senza cambiare.
- Gli scenari e la prova anti-barare restano validi. Per le mosse che cercano, le varianti di ricerca passano da due a tre
  per posto: il costo va rimisurato, con margine ampio rispetto ai 50 ms.

## Domande

Nessuna domanda bloccante. La regia può avviare B5c sul contratto pubblico di `ViewTable` e sulla valutazione di
`DifficilePolicy`.

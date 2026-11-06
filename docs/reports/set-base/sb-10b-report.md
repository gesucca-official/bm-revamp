# SB-10b — Griglia degli slot: rapporto

**Fatto il 6 novembre 2026.** La [griglia](../../design/set-base/griglia.md) dà un posto a tutte le 115 carte del Set Base, con ruolo, fascia
di costo, rarità, starter e motivo. Mappa anche le 39 carte di oggi e le 31 della bozza esterna. Il proprietario ha approvato i principi
(fase A) e la griglia (fase B), ogni volta con «Approvo tutte».

Il banco ha ora i predefiniti di D33. La misura di controllo del tetto in partita **non conferma il tetto di 4 unità per le bound di
danno**: propongo 3, da decidere dal proprietario (Q9 del piano).

Regolamento, catalogo SQLite, allegato, client, protocollo, classi di produzione, bot e file del filone C4 non cambiano. Nessuna carta è
scritta come dato giocabile. Il codice cambia solo in `server/src/test`.

**Origine.** Decisione [D32](../../set-base-plan.md#decisioni-del-proprietario) (divisione di SB-10) e [D33](../../set-base-plan.md#decisioni-del-proprietario)
(listino, tetto e pesi, unità gratuita da 6–8 HIT, costi in L bassi).

## Principi decisi

**Fase A**, approvata con «Approvo tutte» ([D34](../../set-base-plan.md#decisioni-del-proprietario)):

1. **Budget 115:** 37 azioni d'archetipo (6 per Cesira e Rocco, 5 per gli altri) e 23 generiche, al posto di 35 e 25. I due personaggi
   da booster non hanno starter, e le loro meccaniche (annullamenti, costi in HEALTH) non devono finire fra le generiche.
2. **Starter da 12 carte distinte:** 5 d'archetipo, 4 generiche, 3 oggetti, con varianti secondo la capacità.
3. **Bound senza parate:** generatrice, colpetto e una variante a una sola funzione. Le parate deboli sono trappole (SB-10a), e una
   parata forte supera il tetto.
4. **T del Tossico più scarsa:** carte prezzate a circa 0,3–0,5 danni per T; bound di T al massimo +10 fino a SB-13.
5. **Costi in HEALTH solo nell'archetipo di Rocco.** La salute di Mara e Rocco non cambia, ed è la prima leva nei giri di SB-12 e SB-18.
6. **Tre rarità,** circa 54, 41 e 20 carte, con la regola «picco condizionato, media in linea».
7. **Pino:** costi di 5 L o meno, carte che spendono la L residua, bound di L fino a +10.
8. **Formato dati:** due passi nuovi, `equip` dentro `status` e `consume`; il resto in Java con i numeri come parametri.

**Fase B**, approvata con «Approvo tutte» ([D35](../../set-base-plan.md#decisioni-del-proprietario)):

- B1: spendere tutta la L con una classe Java che memorizza, azzera e colpisce;
- B2: la bound +8 A nello starter di Mara, da misurare in SB-11;
- B3: rarità dell'archetipo 20, 10 e 7;
- B4: Giubbotto e Posacenere negli starter base, quindi passo `equip` da SB-11;
- B5: una classe Java nuova per la rara di Gigi.

## La griglia

Tutto nel [documento di progetto](../../design/set-base/griglia.md). In breve:

| Blocco | Slot | C · NC · R | Da inventare |
|---|---:|---|---:|
| Personaggi | 7 | 2 · 3 · 2 | 2 |
| Basic | 7 | 2 · 3 · 2 | 2 |
| Bound | 21 | 10 · 11 · 0 | 13 |
| Last resort | 4 | 1 · 2 · 1 | 1 |
| Archetipo | 37 | 20 · 10 · 7 | 15 |
| Generiche | 23 | 11 · 7 · 5 | 6 |
| Oggetti | 16 | 8 · 5 · 3 | 8 |
| **Totale** | **115** | **54 · 41 · 20** | **47** |

Fra le 15 azioni d'archetipo «da inventare», 8 prendono il nome da una carta della bozza di prova di SB-6a.

**Starter:**

- Le distinte sono 11–13 per starter. Le rare sono 1 per starter, 2 per il Tossico.
- Le generiche negli starter sono 11 distinte su 20 usi. Spazienzio e Mara ne condividono una sola.
- Restano nella collezione 12 generiche e 4 oggetti.
- **Bound:** tutte con una sola funzione e fra 1,5 e 4 unità per uso. Nessuna bersaglia oggetti, lascia qualcosa sull'avversario, cura o annulla.

**Forma:**

- 8 slot richiedono il passo `consume` (le 7 basic e Grab).
- 5 slot e il token richiedono il passo `equip`.
- 13 slot usano classi Java esistenti, con i numeri come parametri.
- 2 classi Java sono nuove, per 3 carte.
- Il resto si esprime con i sei passi di oggi.

## Mappe

- **Carte attuali (39):**
  - 16 conservate;
  - 21 riprogettate;
  - 2 sostituite: `BadTrip`, la cui funzione passa a `ToxicBloodDrain`, e `EverythingIsDrug`, il cui flavour passa nella basic del Tossico.

  Ogni carta ha slot, flavour, posizione sul listino e motivo.
- **Bozza esterna (31):** tutte assegnate, nessuna scartata. Le bound a due funzioni sono divise; le bound che diventano azioni pagate sono
  le parate e la distruzione di oggetti.

## Revisione di L

Il testo di due documenti era sbagliato; le conclusioni restano.

- Il [listino](../../design/set-base/listino.md#l-e-gli-effetti-poco-evidenti) scriveva la quantità persa a fine turno al posto di quella
  che resta: +10 diventa 4, non 6.
- Il [piano](../../set-base-plan.md#letture-del-regolamento-che-guidano-il-progetto) diceva che L «si ferma a 1 o 2 senza azzerarsi
  mai»: invece 1 e 2 vanno a zero.

Corretti entrambi, con una nota. La formula è quella del codice, `Character.java` righe 54–58: si perde L/2 + 1. Per pagare 5 L il turno dopo
serve una presa di almeno 11, non 12 come avevo scritto nella fase A.

Come Pino usa L:

- **Regime:** con la bound +10 L ogni turno, Pino resta a 8–9 L e paga sempre una carta da 5 L.
- **A:** la sua A scende sotto zero in due o tre turni, quindi nel suo starter non ci sono carte a costo A.
- **«Offro io»:** colpisce l'economia di A dell'avversario (circa −16 A in quattro turni), non la precedenza.
- **Spendere tutto:** l'ordine di R04 (effetti su sé prima di quelli sul bersaglio) impedisce di azzerare L dopo il danno con i soli dati:
  da qui la classe Java della decisione B1.

## Predefiniti del banco

`BoundCap.Params.DEFAULT` è ora quello di D33: tetto 4, tolleranza 0, pesi V 0,75, A 0,5, T 0,15 per chi è immune, L 0,35, HEALTH 1.
`fromSystem()` usa questi valori quando le proprietà `sim.bound*` mancano.

I parametri di SB-7 restano disponibili come `BoundCap.Params.SB7`.

- **Test che dipendevano dai vecchi predefiniti:** `BenchTest`.
  - `boundCapSeparatesWeakFromStrongAndLingering` vuole che una bound da 5 HIT stia nel tetto, cosa vera con SB-7 ma non con D33.
  - Le altre prove del banco costruivano le impostazioni con `DEFAULT`.
- **Cosa ho cambiato:** in `BenchTest` ogni `BoundCap.Params.DEFAULT` è diventato `BoundCap.Params.SB7`, senza toccare un atteso. Le prove
  controllano esattamente ciò che controllavano prima, con gli stessi parametri.
- **Prova nuova:** `defaultsAreTheD33Cap` controlla i predefiniti.
  - 4 HIT sta nel tetto; 5 HIT lo supera, mentre con i parametri di SB-7 ci stava.
  - +5 V vale 3,75 unità.
  - Sa fallire: con i predefiniti di SB-7 rimessi per prova in `DEFAULT`, la prova fallisce («expected: <4.0> but was: <5.0>»).
    Poi ho ripristinato i valori di D33.
- **Il resto:** `Listino` usa `DEFAULT` solo per giocare le celle, dove il tetto non entra. Le misure a richiesta (`BenchMeasureTest`,
  `ListinoMeasureTest`) partono ora dai predefiniti di D33.

## Tetto in partita

**Domanda (D33):** una bound da 4 unità di una sola funzione, contro bound nulle, resta entro +10 punti di quota?

**Metodo:**

- Lo stesso della curva «bound» di SB-10a: una sonda e una bound nulla contro due bound nulle, nello stesso contesto.
- Gruppo nuovo `tettopartita` in `Listino`, fuori da `all`, così la misura di SB-10a resta la stessa. Ogni sonda è controllata anche
  contro il manichino con i predefiniti nuovi.
- **Sonde:**
  - 4 HIT;
  - la risorsa propria del contesto alla quantità più alta entro 4 unità: +5 V, +8 A, +26 T per il Tossico immune;
  - per il Tossico anche +10 T, il limite della griglia;
  - dopo il primo risultato ho aggiunto 3 e 2 HIT, per trovare il tetto.
- **Contesti:** tutti e cinque quelli di SB-10a (neutro, Spazienzio, Mara di prova, Rocco di prova, Tossico), negli specchi.
- **Esecuzione:**
  - tre stili (aggressivo, prudente, attento alle risorse), lo stesso sui due lati;
  - 2000 partite per stile e cella, semi da 8.200.000;
  - con le curve della salute (moneta comune), che servono a convertire la quota.
- **Bozza base:** `server/src/test/resources/sb-10a/listino-base.json`, SHA-256
  `87fa95f18772385258c51c05de784487beb4fa0dc9a67062d6783fff35b7b1b1`. Ogni bozza derivata ha il suo SHA-256 nel file di dati.
- **Partite:** 246.000 in 175,8 secondi su 8 thread.

Evidenze: [testo](sb-10b/sb10b-tetto-partita.md), [dati](sb-10b/sb10b-tetto-partita.json), [tempi](sb-10b/sb10b-tetto-partita.tempi.txt).

**Risultati** (quota della sonda, Wilson al 95%; criterio: al massimo 0,60):

| Bound | Spazienzio | Tossico | Rocco (prova) | Mara (prova) | Neutro |
|---|---|---|---|---|---|
| 4 HIT | 0,475 [0,461–0,488] ✓ | 0,657 [0,643–0,670] ✗ | 0,715 [0,703–0,728] ✗ | 0,813 [0,802–0,823] ✗ | 0,998 ✗ (saturato) |
| 3 HIT | 0,445 [0,432–0,459] ✓ | 0,583 [0,569–0,597] ✓ | 0,658 [0,645–0,670] ✗ | 0,725 [0,713–0,737] ✗ | 0,969 ✗ (saturato) |
| 2 HIT | 0,476 [0,462–0,490] ✓ | 0,452 [0,438–0,467] ✓ | 0,547 [0,533–0,560] ✓ | 0,616 [0,603–0,630] ✗ | 0,843 [0,831–0,855] ✗ |
| Risorsa da 4 unità | +5 V: 0,559 ✓ | +26 T: 0,589 ✓ | +8 A: 0,485 ✓ | +8 A: 0,473 ✓ | +5 V: 0,793 ✗ |
| +10 T | — | 0,547 ✓ | — | — | — |

Contro il manichino, con i predefiniti di D33, tutte le sonde rispettano il tetto: 2, 3 e 4 HIT valgono 2, 3 e 4 unità, +5 V 3,75, +8 A
4, +26 T 3,90, +10 T 1,50.

**Lettura:**

- **Bound di risorsa da 4 unità: confermate.** Restano entro +10 punti in tutti e quattro i contesti con personaggi veri o di prova. Il
  solo superamento è nel neutro, che amplifica per costruzione: lì 1 HEALTH vale 4,8 punti, e le bound saturano già in SB-10a.
- **Bound di danno da 4: non confermate.** Reggono solo con Spazienzio. Col Tossico serve scendere a 3, con Rocco di prova a 2. Con Mara di
  prova nemmeno 2 HIT bastano, per 1,6 punti: è il caso già segnalato in SB-10a. Mara ha 85 di salute e carte regolari di prova deboli,
  quindi un danno gratuito ripetuto vale molto.
- **Il danno pesa più della risorsa.** A parità di unità, una bound di danno sposta la quota più di una di risorsa in ogni contesto
  tranne Spazienzio, dove le due restano vicine.

**Proposta, per il proprietario:**

- **tetto di 4 unità per le bound di risorsa e di 3 per quelle di danno.** Nel banco questo vuol dire dare al danno un peso di 4/3;
- da riconfermare sugli starter veri: Mara in SB-11, Rocco in SB-18;
- se lì 3 HIT supera ancora i +10 punti, si scende a 2.

Se il proprietario la accoglie, nella griglia le bound di danno passano da 4 a 3 e le varianti da 3 a 2. Sono 13 slot su 21 e nessun
totale cambia. Finché non decide, griglia e banco restano come approvati.

**Riproducibilità.** Due controlli sui dati:

- le 20 curve della salute coincidono, riga per riga, con quelle della misura completa di SB-10a;
- le sei celle a 2 e 4 HIT di Spazienzio, Mara e neutro coincidono con le celle «bound-danno» di SB-10a, anche se la sonda ha un altro
  nome.

Ho lanciato la misura due volte: la prima con solo 4 HIT (186.000 partite, 120 secondi), la seconda con anche 3 e 2 HIT. Le celle comuni
alle due esecuzioni sono identiche.

## File

| File | Cosa cambia |
|---|---|
| `server/src/test/java/.../sim/BoundCap.java` | `DEFAULT` con i valori di D33, `SB7` coi valori di prima, `fromSystem()` legge i predefiniti |
| `server/src/test/java/.../sim/BenchTest.java` | Parametri di SB-7 passati esplicitamente; prova nuova `defaultsAreTheD33Cap` |
| `server/src/test/java/.../sim/Listino.java` | Gruppo `tettopartita` fuori da `all`: famiglie di sonde, curve, bozza per il manichino |
| `server/src/test/java/.../sim/ListinoMeasureTest.java` | Accetta il gruppo nuovo e controlla le sue sonde contro il manichino |
| `server/src/test/java/.../sim/ListinoReport.java` | Titolo del gruppo e valore per uso anche per il tetto in partita |
| `docs/design/set-base/griglia.md` | Nuovo: la griglia |
| `docs/design/set-base/listino.md` | Stato approvato (D33), calo di L corretto, predefiniti nel banco |
| `docs/set-base-plan.md` | Budget, stato di SB-10b, D34, D35, Q9, idee per le espansioni, calo di L corretto |
| `docs/README.md` | Riga «Set Base» |
| `docs/reports/set-base/sb-10b/` | Evidenze della misura |

**Come si lancia** (da `server/`, con `JAVA_HOME` sul JDK di `.tools/`, come in SB-10a):

```powershell
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=ListinoMeasureTest" "-Dsim.listino=tettopartita,salute" "-Dsim.threads=8"
```

## Cosa non è provato

- **La griglia è un progetto, non una misura.** Le fasce, le stime di valore degli oggetti e le linee con l'unità a 7 sono stime: le
  linee vengono dalle misure di SB-10a meno circa 3 HIT. Nessuna carta della griglia è stata giocata.
- **Il tetto in partita** è misurato su due starter di oggi, due mazzi di prova e un mazzo sintetico, con i bot euristici di oggi. Mara e
  Rocco di prova hanno carte regolari volutamente semplici: il risultato con i loro starter veri può essere diverso.
- **Le curve dei costi degli starter** sono contate sulla griglia, non giocate. Il bilancio fra risorse generate e spese è una stima.
- **Formato dati.** I passi `consume` ed `equip`, due carte sulla stessa classe Java e le due classi nuove non sono ancora scritti.
- **TestServerContext non lanciato:** il blocco tocca solo `server/src/test` e i documenti. Contesto Spring, CLI e classi di produzione
  non cambiano.

## Cosa serve a SB-11

1. **Decidere Q9,** il tetto delle bound di danno (proposta 3), prima di scrivere le bound di Spazienzio e Mara.
2. **Passi nuovi del formato:** `consume` per le basic e Grab, `equip` (con uso singolo e conversione) per Giubbotto e Posacenere, con
   test che sappiano fallire come quelli di SB-5.
3. **Rimisurare il listino sugli starter nuovi:** voci di V, A e HEALTH e linea dell'unità gratuita a 7 HIT. Basta
   `-Dsim.listino=costo,tipo,salute` con l'àncora a 7, da rendere parametro.
4. **Misurare la bound +8 A di Mara** (decisione B2) e il tetto in partita sullo starter vero di Mara.
5. **Nomi degli starter** di Spazienzio (SB-11) e del Tossico (SB-13): ancora da inventare.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero processi Maven o Java.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.**
  - Maven: 507 test, 0 falliti, 7 saltati. I saltati sono le misure a richiesta, come in SB-10a.
  - Uno in più di SB-10a: `defaultsAreTheD33Cap`.
  - `BenchTest`, `ListinoTest`, `PlaygroundTest`, `SearchMarginTest` e `SimulationRunnerTest` passano. Nessun atteso è cambiato.
  - Client: 36 test su 36.
- `python scripts/check-rules.py`: regolamento e copia client allineati; 39 carte e 1 token; SQLite integro.
- `TestServerContext`: non lanciato, per il motivo sopra.

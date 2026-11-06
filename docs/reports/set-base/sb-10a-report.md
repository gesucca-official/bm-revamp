# SB-10a — Listino di potenza e tetto delle bound: rapporto

**Fatto il 6 novembre 2026, in attesa del giudizio del proprietario.** Il [listino](../../design/set-base/listino.md) è misurato: quanto
danno compra ogni risorsa, quanto valgono priorità, precedenza e L che decade, quanto vale una bound per uso, dove stanno le 37 carte
di oggi. Ne escono una proposta di tetto per le bound con nuovi pesi e la regola di sostituzione col margine nella ricerca dei mazzi.

Regolamento, catalogo, allegato, client, protocollo, classi di produzione e bot non cambiano. Tutto vive nei sorgenti e nelle risorse
di test. Nessuna carta del Set Base è progettata qui.

**Origine.** Decisione [D32](../../set-base-plan.md#decisioni-del-proprietario): «Sì, dividi e scrivi». SB-10 si divide in SB-10a
(listino e tetto, misure) e SB-10b (griglia degli slot). Il proprietario ha approvato la proposta della fase A con «Approvo, procedi»,
comprese le due raccomandazioni rimaste aperte da SB-7:

- **regola di sostituzione col margine** nella ricerca;
- **le quattro violazioni del tetto** nella bozza «attuale» sono attese.

Approvati anche i tre criteri del tetto, fissati prima di misurare.

## File

Tutto in `server/src/test/`, fuori dal jar come il runner, il playground e il banco:

| File | Cosa fa |
|---|---|
| `resources/sb-10a/listino-base.json` (nuovo) | Bozza base: personaggi e carte di `attuale.json` e di `prova-sb9.json`, più un personaggio e un mazzo **neutri** di sole carte a dati. Cinque mazzi di contesto, ciascuno con **quattro slot sonda** occupati dall'àncora (gratuita, priorità 1, 10 HIT; due carte, due copie). Formato allargato a 4 copie, solo perché le gemelle delle carte attuali si aggiungono alle copie già nel mazzo |
| `java/.../sim/Listino.java` (nuovo) | Le domande come esperimenti: bozze derivate col numero x, bisezione, griglia di conferma, retta pesata; curve a valori fissi |
| `java/.../sim/ListinoReport.java` (nuovo) | Rapporto in testo e in dati, senza tempi |
| `java/.../sim/ListinoMeasureTest.java` (nuovo) | Misura a richiesta: `-Dsim.listino=all` o un elenco di gruppi |
| `java/.../sim/ListinoTest.java` (nuovo) | Prove brevi nella suite: la retta trova la radice, ogni bozza derivata è valida, una sonda uguale all'àncora sta al 50% |
| `java/.../sim/SearchMarginTest.java` (nuovo) | La regola di sostituzione col margine, con una prova che sa fallire |
| `java/.../sim/DeckSearch.java` | Margine di sostituzione (`Params.margin`, 1 errore standard per difetto; 0 è la regola di SB-7), registro delle sostituzioni, riga nel rapporto della ricerca |
| `java/.../sim/Bench.java` | Il gioco delle celle esce da `run` in `playCells`, senza cambiare nulla: il listino sceglie da sé quali incontri giocare |

Le opzioni di SB-6a e SB-7 restano le stesse. `PlaygroundMeasureTest`, `BenchMeasureTest` e i rapporti del banco non cambiano.

## Metodo

**Duello sonda contro àncora.** Due mazzi identici salvo i quattro slot sonda:

- nel mazzo **sonda** c'è la carta in prova, con un numero x (danno, quantità di T o di L);
- nel mazzo **riferimento** c'è l'àncora: gratuita, priorità 1, 10 HIT, due carte e due copie.

Si cerca la x di indifferenza, cioè quella in cui la quota della sonda è il 50%. Nei non specchi il bersaglio è invece la quota della
base (il mazzo della sonda con l'àncora) contro lo stesso avversario, sugli stessi semi.

1. **Bisezione** sugli interi:
   - 400 partite per stile e punto;
   - prima i due estremi, poi il punto medio fino a un passo;
   - semi da 8.000.000, gli stessi per ogni x.
2. **Griglia di conferma:**
   - cinque punti attorno alla stima;
   - 2000 partite per stile e punto;
   - semi da 8.500.000, disgiunti da quelli della bisezione.
3. **Retta pesata** fra quota e x sulla griglia:
   - la radice al bersaglio è la stima;
   - l'intervallo al 95% viene dal metodo delta, con la varianza del bersaglio nei non specchi;
   - se la pendenza non si distingue da zero, il rapporto lo scrive e non dà un numero.
4. **Fuori intervallo:** se già all'estremo basso la sonda vince, o se all'estremo alto perde ancora, il rapporto dà solo il lato
   (≤ o ≥).
5. **Curve a valori fissi**, 2000 partite per stile e cella, semi da 8.200.000:
   - salute iniziale ±5 e ±10 (la moneta comune);
   - A iniziale fra −10 e +10;
   - bound;
   - slot;
   - handicap del non specchio.

**Stili:** aggressivo, prudente, attento alle risorse, lo stesso sui due lati. Ogni punto dà anche la stima per stile.

**Contesti** (`listino-base.json`):

| Contesto | Mazzo | Slot sonda al posto di |
|---|---|---|
| `ctx-spazienzio` | Starter di Bruiser di oggi | BadEducation, BreakYourToy, 2 StunningBlow |
| `ctx-tossico` | Starter del Junkie di oggi | 2 Steal, ShuffleFeet, LethalHeroinDose |
| `ctx-mara` | Mara della bozza di prova di SB-9 | 2 Sorpasso, 2 Steal |
| `ctx-rocco` | Rocco della bozza di prova di SB-9 | Steal, ShuffleFeet, 2 MarvelousCocktail |
| `ctx-neutro` | Personaggio neutro (100 HEALTH, A 30, altre risorse a 0), carte a dati: generatrici di V, A e L, spese da 10 V e 10 L, due parate, due colpi gratuiti | — |

**Non specchio:** Spazienzio contro Mara.

- Senza handicap Spazienzio vince il 98,6%, dove la misura non vede niente.
- La curva «handicap» (20 → 0,709; 30 → 0,377) ha fissato **25 HEALTH in meno** per Spazienzio.
- Le sonde si provano dai due lati.

**Bound:** la sonda e una bound nulla (gratuita, su di sé, senza effetti) contro due bound nulle, nello stesso contesto. La quota diventa
salute equivalente con la pendenza del contesto, e si divide per gli usi per partita. Oltre 0,9 o sotto 0,1 la cella è «saturata» e non
si converte.

**Carte attuali:** la gemella ha lo stesso costo e la stessa priorità della carta e x HIT al bersaglio, e prende due slot sonda.

- x di indifferenza = quanto HIT a quel costo vale la carta, nel suo mazzo.
- La carta è **sopra, sotto o in linea** rispetto al danno che una carta di solo danno a quel costo deve avere per valere l'àncora,
  interpolato dalle misure di costo dello stesso contesto.
- **Curva a U.** Una gemella a 0 HIT non viene mai giocata e fa da carta morta. Se a x = 0 vince senza essere mai giocata, la carta vale
  meno di una carta morta, e la ricerca riparte da 10 HIT, dove la gemella si gioca. L'ho scoperto sulla prima misura completa: per sette
  carte di Spazienzio la gemella a 0 batteva la carta, poi perdeva a 2–8 HIT e tornava a vincere più su. La regola è nel codice
  (`Bisection.playedLow`) e la misura è stata rifatta.

## Esecuzione

Bozza base `server/src/test/resources/sb-10a/listino-base.json`, SHA-256 `87fa95f1…35b7b1b1`. Ogni bozza derivata ha il suo SHA-256
nel file di dati, campo `sha256Bozza`.

**Misura definitiva** ([testo](sb-10a/sb10a-listino-all.md), [dati](sb-10a/sb10a-listino-all.json), [tempi](sb-10a/sb10a-listino-all.tempi.txt)):

- tutti i gruppi: 67 bisezioni e 105 celle di curva;
- **3.541.200 partite in 29,5 minuti** su 8 thread, 0,50 ms a partita;
- tre stili; personaggi Spazienzio, Tossico, Mara, Rocco e il neutro;
- semi 8.000.000 (bisezione), 8.500.000 (griglia), 8.200.000 (curve).

La sezione del tetto di quel rapporto usa i parametri di SB-7. Con i parametri proposti c'è una misura a parte:
[testo](sb-10a/sb10a-listino-tetto.md), [dati](sb-10a/sb10a-listino-tetto.json), 3 secondi.

**Tempo di calcolo, dichiarato contro il tetto di 2 ore:**

| Esecuzione | Partite | Minuti |
|---|---:|---:|
| Tre prove pilota a poche partite (tempi, letture, errori) | circa 0,5 milioni | circa 5 |
| Prima misura completa | 3.504.000 | 30,4 |
| Seconda misura, gemelle da 10 HIT. Fermata, ma il processo Java ha finito da solo: lo stop dei processi Java non mi è stato permesso, e non ho lanciato altro nel frattempo | 3.612.000 | 30,4 |
| Misura definitiva | 3.541.200 | 29,5 |
| Tetto con i parametri proposti | — | 0,1 |
| **Totale** | **circa 11,2 milioni** | **circa 95** |

La stima della fase A era di 30–45 minuti per una sola misura: è stata rispettata. Le due misure in più vengono dalla curva a U delle
gemelle (vedi Metodo).

**Riproducibilità.** Le tre misure complete sono esecuzioni Maven separate, ciascuna su 8 thread. Hanno dato **dati identici** su tutti
i 149 esperimenti che non toccano le gemelle (44 bisezioni e 105 curve, campo per campo nel JSON). Cambia solo il gruppo «carte»,
secondo la regola, e la seconda misura aveva in più 23 celle di confronto con la carta morta, poi assorbite nella bisezione.

**Il banco di SB-7 non cambia.** Ho rilanciato `BenchMeasureTest#matrix` con 1000 partite sulla bozza «attuale». Il rapporto è identico a
quello di [SB-7](sb-7/sb7-attuale-1000.md) salvo tre righe d'intestazione:

- la nota, non passata;
- il percorso della bozza (classpath invece del file);
- lo SHA-256 della bozza, che il commit del regolamento 1.11 aveva già cambiato riscrivendo le descrizioni.

Tutti i numeri sono uguali.

## Risultati

Il listino completo, con condizioni e cautele, è nel [documento di progetto](../../design/set-base/listino.md). In breve:

| Voce | Misura |
|---|---|
| V pagata (Spazienzio) | 1,07 · 1,15 · 1,44 danni per V a 10, 20, 30 V; per stile, a 30 V, 1,27–1,78. Non specchio: 0,93 (10 V), 1,05 (20 V) |
| A pagata | Mara 0,55–0,80; neutro 0,22–0,41; Spazienzio 0,03 |
| T pagata dal Tossico | 0,05–0,13 |
| L pagata | 5 L in Spazienzio: 5,9 danni per L (carta giocata 0,47 volte a partita); nel neutro 5 e 10 L mai pagabili |
| HEALTH pagata | 1,06–1,24 |
| CUT, POISON | 0,98–1,01 e 1,01–1,06 HIT per unità; non specchio 0,98–0,99 |
| Priorità 0 e 2 rispetto a 1 | entro ±0,5 HIT |
| A iniziale | ordinale: neutro nessun effetto; Mara gradino di 8 punti fra −1 e +1, Spazienzio 1,4 |
| T al bersaglio | 0,69–1,46 HIT per T, non lineare; 0 contro il Tossico immune |
| L guadagnata | 0,49 V per L; con una spesa dedicata in L nessuna quantità eguaglia +10 V |
| Salute iniziale | 2,48 (Rocco) – 4,77 (neutro) punti di quota per 1 HEALTH |
| Bound | il prezzo dello scarto vale 5–7 HEALTH per uso in Spazienzio, circa 1 in Mara di prova; parate deboli dannose |

**Gli intervalli statistici sono stretti** (±0,1–0,5 HIT nella maggior parte delle voci): contano gli scarti fra contesti e stili,
scritti nel listino.

### Carte attuali

Tabelle, motivi e incrocio con SB-7 sono nel [listino](../../design/set-base/listino.md#le-37-carte-attuali).

- **Le 23 azioni misurabili:** 22 stanno sotto la linea dell'àncora gratuita da 10 HIT; solo MethDrivenRage sta sopra (11,4 HIT
  equivalenti contro 10,2).
- **Otto valgono meno di una carta morta:** CantFeelAnything, StunningBlow, ExtremelyViolentBlow, YouStop, WhatchaDoin, BadEducation,
  BreakYourToy, EverythingIsDrug.
- **Il controllo:** la gemella di SuperImpact (stessa carta, altro nome) vale 39,3 [38,8–39,8] HIT contro i 40 nominali.
- **Le carte non quotabili,** cioè quattro bound, Struggle, quattro oggetti, tre prese e due basic, hanno una posizione motivata o una
  stima dichiarata come tale.

### Tetto delle bound

**Con i parametri di SB-7** (5 unità ±20%; pesi V 1, A 1, T 1, L 0,5) la misura definitiva ritrova le quattro violazioni attese della
bozza «attuale»:

- LittleRage 8;
- LittleSmack 10;
- RottenSmile lascia A −40;
- PatheticBlade fino a 30, si accumula e lascia T +40.

Le bound di prova e del neutro lo rispettano.

**Con i parametri proposti** (4 unità ±0%; pesi V 0,75, A 0,5, T 0,15 se immune, L 0,35):

| Bound | Valore per uso | Esito | Motivo | In partita, contro bound nulle |
|---|---:|---|---|---|
| LittleRage | 6,75 | viola | numerico (parata e V: due funzioni) | quota 0,61, +1,5 HEALTH per uso |
| LittleSmack | 7,50 | viola | numerico (danno e A: due funzioni) | quota 0,51, +0,1 |
| PatheticBlade | fino a 25,75 | viola | **strutturale:** si accumula, lascia T +40 | quota 0,60 nello specchio, dove l'avversario è immune |
| RottenSmile | 2,50 | viola | **strutturale:** lascia A −40 | quota 0,30, −1,1 per uso |
| ColpoDiStriscio (prova Mara) | 5,00 | viola | numerico | quota 0,82, +2,7 |
| Colpetto (prova Rocco) | 5,00 | viola | numerico | quota 0,75, +4,0 |
| Fiato (prova Rocco) | 5,00 | viola | numerico (e cura) | quota 0,68, +4,5 |
| Colpetto (neutro) | 5,00 | viola | numerico | saturata |
| Scarto (prova Mara), Riparo (neutro) | 3,00 | rispetta | | quota 0,36 e 0,24: dannose |

**Le quattro violazioni della bozza «attuale» sono attese**, come deciso:

- due sono strutturali, e restano con qualunque tetto;
- due sono numeriche, e vengono da due funzioni nella stessa carta.

Con il tetto proposto cadono anche le bound da 5 della bozza di prova. In partita le stesse bound stanno a 0,68–0,82 di quota contro
le bound nulle, cioè 18–32 punti sopra il 50%: oltre il criterio dei +10 punti. Il tetto più basso è quindi coerente con la misura in partita. Nessuna carta è stata
riprogettata: è compito di SB-10b, SB-11 e SB-13.

**Parametri del banco.** I predefiniti di `BoundCap.Params` restano quelli di SB-7 finché il proprietario non decide. I parametri
proposti si passano da riga di comando.

## Regola di sostituzione nella ricerca

`DeckSearch.Params` ha un margine in errori standard del punteggio del mazzo in carica: 1 per difetto (`Params.MARGIN`), 0 per la
regola di SB-7. Un mutante sostituisce il mazzo in carica solo se lo supera di più di `margine × errore standard`. Con margine 0 la ricerca
è identica a quella di SB-7, compreso il conteggio della pazienza. Il rapporto della ricerca ha una riga «Sostituzione» e il campo
`margineSostituzione`; ogni sostituzione si registra con generazione, guadagno ed errore standard.

`SearchMarginTest`:

- **la soglia:**
  - sotto un errore standard il mazzo in carica resta, oltre subentra lo sfidante;
  - con margine 0 basta superarlo;
  - un margine negativo è rifiutato;
- **la ricerca**, con gli stessi semi:
  - con la regola di SB-7 avvengono 8 sostituzioni, 6 delle quali entro un errore standard;
  - con il margine le sostituzioni sono 6, nessuna entro un errore standard.

**Sa fallire:** con il margine ignorato nel codice (moltiplicato per 0) falliscono entrambe le prove. La ricerca dà 8 sostituzioni, 6 «per
fortuna». Poi il codice è stato ripristinato. `searchFindsADeliberatelySuperiorCard` di SB-7, che usa la regola nuova, resta verde senza
toccare un atteso.

## Cosa non è provato

- **I bot.** Il listino misura come giocano gli stili euristici di oggi:
  - leggono solo ruolo, guadagni propri e danno nominale;
  - non vedono T o L sul bersaglio né le difese per tipo;
  - giocano le parate deboli e tengono le carte morte che promettono danno;
  - una persona può valutare diversamente A, L e le contromosse.
- **I contesti.** Due mazzi di oggi, due di prova e uno sintetico.
  - Il neutro amplifica: molte curve vi si saturano, e una carta da 20 V non vi si paga mai.
  - Con le carte nuove, soprattutto A, T e L cambieranno prezzo.
- **Il non specchio** è uno solo, con un handicap di 25 HEALTH.
- **La linearità.** La retta è una buona descrizione vicino all'indifferenza, non lontano. Le voci molto non lineari (T al bersaglio, L con
  spesa dedicata) vanno lette dalla griglia nei dati.
- **L sull'avversario** e le contromosse non sono misurate da sole. Le contromosse restano sottostimate dai bot (SB-17).
- **Il tetto** si conferma solo su bound di una funzione e negli specchi. Gli effetti contro avversari diversi, come la T di
  PatheticBlade contro Spazienzio, restano esclusi per struttura e non per valore.
- **I valori iniziali dei personaggi** delle schede SB-9 non sono misurati qui: lo saranno con gli starter nuovi (SB-11 e seguenti).
- **Riproducibilità:** le misure sono deterministiche a parità di bozza, semi e partite, perché ogni esperimento gira su un thread solo.
  La prova byte per byte su due esecuzioni è stata fatta sui gruppi che le due misure complete hanno in comune (vedi Esecuzione).

## Cosa serve a SB-10b

1. La curva dei costi in V (circa 10 + 1,1 × V fino a 20 V, poi un premio) e il prezzo in HEALTH (circa 1,1–1,2).
2. **Un'unità gratuita più bassa dell'àncora:** le carte gratuite di oggi valgono meno di una gratuita da 10 HIT.
3. L come costo da ripensare per Pino, prima di prezzarla.
4. CUT, HIT e POISON allo stesso prezzo; priorità non pagata; precedenza come gradino.
5. Il tetto delle bound proposto e i pesi, da confermare dal proprietario.
6. Prima di SB-11, rilanciare le voci di V, A e HEALTH sugli starter nuovi: `-Dsim.listino=costo,tipo,salute` costa pochi minuti.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero processi Maven o Java.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.**
  - Maven: 506 test, 0 falliti, 7 saltati. I saltati sono le misure a richiesta: le sei di prima e `ListinoMeasureTest`.
  - Nuovi: i 3 di `ListinoTest` (circa 4 s) e i 2 di `SearchMarginTest` (circa 5 s).
  - `BenchTest`, `BotStylesTest`, `PlaygroundTest` e `SimulationRunnerTest` passano senza toccare un atteso.
  - Client: 36 test su 36.
- `python scripts/check-rules.py`: regolamento e copia client allineati.
- Nessun test esistente è stato toccato e nessun atteso è cambiato.
  - Le classi esistenti modificate sono `Bench` (estrazione di `playCells`, numeri identici, vedi Esecuzione) e `DeckSearch` (margine).
  - `searchFindsADeliberatelySuperiorCard` passa anche con il margine.
- `TestServerContext` **non lanciato:** il blocco tocca solo `server/src/test` e i documenti. Contesto Spring, CLI e classi di produzione
  non cambiano.

**Come si lancia** (da `server/`, con `JAVA_HOME` sul JDK di `.tools/`, come in SB-7):

```powershell
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=ListinoMeasureTest" "-Dsim.listino=all"
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=ListinoMeasureTest" "-Dsim.listino=tetto" "-Dsim.boundCap=4" "-Dsim.boundTolerance=0" "-Dsim.boundWeights=V:0.75,A:0.5,T:0.15,L:0.35"
```

**Opzioni:**

- `sim.listino`: `all` oppure un elenco fra costo, tipo, priorita, veleno, decadimento, nonspecchio, carte, salute, allerta, bound, slot,
  handicap, tetto;
- `sim.listinoBisect` (400), `sim.listinoGrid` (2000), `sim.listinoCurve` (2000): partite per stile;
- `sim.listinoHandicap` (25);
- `sim.threads`, `sim.note` e le opzioni del tetto di SB-7.

**Uscite** in `tmp/sim/sb10a-listino-<misure>.md`, `.json` e `.tempi.txt`.

## Decisioni per il proprietario prima di SB-10b

1. **Tetto delle bound:** 4 unità per uso con tolleranza 0 (raccomandato), oppure 3 (criterio più severo, che anche Mara di prova
   rispetta solo per 2 HIT).
2. **Pesi:** V 0,75, A 0,5, T 0,15 per chi è immune, L 0,35, HEALTH 1. *Raccomandazione: adottarli come predefiniti del banco in SB-10b,
   rimisurando T e A con gli starter nuovi.*
3. **Unità gratuita per la griglia:** prezzare le carte rispetto a una gratuita da circa 6–8 HIT invece che 10. *Raccomandazione: sì.*
4. **L come costo:** in SB-10b gli slot di Pino prevedono costi in L bassi (5 o meno), oppure prese di L grandi (da 18 in su) che
   rendono pagabile una spesa da 10 al turno dopo? *Raccomandazione: costi bassi, che non chiedono carte enormi e non toccano le regole.*

# SB-16e2 — Lotto numerico dopo lo STOP di SB-16e

12 novembre 2026. Fase unica, base `3a72505`. Il primo commit, `fbfde85`, contiene solo documenti e registra
[D56](../../set-base-plan.md#decisioni-del-proprietario): il proprietario ha risposto «si a entrambe» alle domande 1 e 2 del
[rapporto SB-16e](sb-16e-report.md#domande-numerate-al-proprietario). Lo stesso commit aggiunge SB-16f0 al piano.
Perimetro: bozza, test del Set Base, griglia, rapporto ed evidenze, riga e sezione del piano. Non toccati: regolamento,
`docs/sets`, server principale, catalogo e client.

**Esito: nessuna variante soddisfa i criteri.** Tutti e quattro i profili hanno **10 violazioni**: 2 sulle patte, 2 sulle
quote e 6 sulla durata. Nella bozza è adottata la variante **(c), entrambe**, come stabilito dalla regola fissata prima del lotto.
Mi fermo qui: niente secondo lotto. I criteri ancora falliti sono elencati sotto.

## Metodo e budget fissati prima di partire

- [budget.json](sb-16e2/budget.json): un solo lotto, **1.800 secondi** di calcolo al massimo, un'unica invocazione Maven che si
  interrompe al tetto. Ordine: (a), (b), (c), controllo. Se il tempo fosse finito durante il controllo si sarebbe perso solo quello,
  già misurato in SB-16e.
- [selection.json](sb-16e2/selection.json), scritto prima dei risultati, con i criteri e la regola di adozione:
  - si adotta la variante senza violazioni;
  - altrimenti quella con meno violazioni;
  - a parità, quella con meno violazioni sulle patte;
  - poi quella con il massimo delle patte più basso;
  - se vince il controllo, la bozza non cambia.
- Profili:
  - **controllo**: bozza a `fbfde85`, identica a `sb-16e/round-3/draft.json`;
  - **(a)**: Un altro e arrivo (`base.pino.OffroIo`) +20 → **+35 A**;
  - **(b)**: danno a sé di L'ultima dose (`junkie.LethalHeroinDose`) e di L'ultimo giro (`base.pino.UltimoGiro`, `selfHit`)
    5 → **2 HIT**;
  - **(c)**: (a) e (b) insieme.

  In ogni variante anche i testi e i metadati letti dai bot seguono l'effetto.
- Banco invariato rispetto a SB-16e:
  - regole `d50`, 8 thread, stili aggressivo, prudente, risorse e com;
  - semi da 7.000.000, posti alternati;
  - matrice completa: 2.000 partite per cella, 240 celle, 480.000 partite per profilo.
- Osservatore: lo stesso di SB-16e (`StarterBalanceMeasureTest.Watch`), sui primi 400 semi per cella dei soli specchi di
  Celestina e di Piera, cioè 6.400 partite per specchio.
- Criteri di D16 e D51, invariati:
  - base contro base fra 45 e 55%;
  - ogni altro incontro fra 40 e 60%;
  - durata media fra 6 e 12 turni;
  - patte al massimo al 10% in ogni incontro, specchi compresi;
  - otto invarianti a zero;
  - nessuna bound oltre il tetto.

  Si conta una violazione per ogni coppia (incontro, criterio).

**Consumo: 971,658 secondi, cioè 16 minuti e 12 secondi, su 1.800** ([compute.json](sb-16e2/compute.json)). Per profilo:
(a) 242,5 s, (b) 262,3 s, (c) 228,6 s, controllo 219,9 s. Il resto è avvio e compilazione.
Il lanciatore ha registrato `exit: null`. Il motivo è un difetto noto di `Start-Process` in Windows PowerShell: senza un handle
salvato, `ExitCode` resta nullo. Lo script ha quindi segnalato un fallimento che non c'era. Il rapporto surefire dice
`StarterLotMeasureTest#lot`: 1 test, 0 fallimenti, 0 errori, con le asserzioni su invarianti e bound comprese, e i quattro profili
sono stati scritti. Ho corretto [run.ps1](sb-16e2/run.ps1) dopo il lotto e annotato il fatto in `compute.json`. Il lotto non è
stato ripetuto.

**Riproducibilità.** Le righe del controllo coincidono una per una con la matrice del giro 3 di SB-16e. Gli incontri che non
contengono carte toccate restano identici in tutti i profili: ad esempio Spazienzio–Mara, Mara–Beppe e Beppe–Beppe.

## Incontri

Ogni riga: 32.000 partite. In grassetto i valori fuori criterio. Tabelle generate da
[summarize.py](sb-16e2/summarize.py) in [incontri.md](sb-16e2/incontri.md).

| Incontro A–B | Controllo: quota / patte % / turni | (a) | (b) | (c), adottata |
|---|---|---|---|---|
| Spazienzio–Spazienzio | 0.498 / 2.81 / 9.92 | 0.498 / 2.81 / 9.92 | 0.498 / 2.81 / 9.92 | 0.498 / 2.81 / 9.92 |
| Spazienzio–Mara | 0.524 / 2.56 / 9.52 | 0.524 / 2.56 / 9.52 | 0.524 / 2.56 / 9.52 | 0.524 / 2.56 / 9.52 |
| Spazienzio–Celestina | 0.457 / 5.70 / 11.89 | 0.457 / 5.70 / 11.89 | 0.447 / 5.10 / 11.90 | 0.447 / 5.10 / 11.90 |
| Spazienzio–Piera | 0.487 / 6.06 / **12.43** | 0.482 / 6.16 / **12.42** | 0.463 / 4.19 / **12.45** | 0.457 / 4.20 / **12.44** |
| Spazienzio–Beppe | 0.509 / 3.11 / 10.38 | 0.509 / 3.11 / 10.38 | 0.509 / 3.11 / 10.38 | 0.509 / 3.11 / 10.38 |
| Mara–Mara | 0.496 / 3.36 / 8.78 | 0.496 / 3.36 / 8.78 | 0.496 / 3.36 / 8.78 | 0.496 / 3.36 / 8.78 |
| Mara–Celestina | 0.529 / 5.92 / 10.93 | 0.529 / 5.92 / 10.93 | 0.525 / 5.64 / 10.93 | 0.525 / 5.64 / 10.93 |
| Mara–Piera | **0.674** / 7.17 / 11.28 | **0.668** / 7.11 / 11.28 | **0.659** / 6.27 / 11.29 | **0.653** / 6.15 / 11.29 |
| Mara–Beppe | 0.571 / 1.88 / 9.39 | 0.571 / 1.88 / 9.39 | 0.571 / 1.88 / 9.39 | 0.571 / 1.88 / 9.39 |
| Celestina–Celestina | 0.501 / **22.32** / **17.51** | 0.501 / **22.32** / **17.51** | 0.497 / **18.57** / **18.22** | 0.497 / **18.57** / **18.22** |
| Celestina–Piera | **0.689** / 8.76 / **13.70** | **0.688** / 8.74 / **13.71** | **0.663** / 7.43 / **13.79** | **0.662** / 7.38 / **13.80** |
| Celestina–Beppe | 0.593 / 8.15 / **12.38** | 0.593 / 8.15 / **12.38** | 0.600 / 7.82 / **12.39** | 0.600 / 7.82 / **12.39** |
| Piera–Piera | 0.498 / **17.78** / **14.68** | 0.499 / **17.39** / **14.69** | 0.500 / **13.76** / **14.81** | 0.501 / **13.07** / **14.83** |
| Piera–Beppe | 0.449 / 9.75 / **12.84** | 0.476 / 9.29 / **12.86** | 0.478 / 8.04 / **12.86** | 0.504 / 7.46 / **12.88** |
| Beppe–Beppe | 0.504 / 8.22 / 10.84 | 0.504 / 8.22 / 10.84 | 0.504 / 8.22 / 10.84 | 0.504 / 8.22 / 10.84 |

| Profilo | Violazioni | Patte | Quote | Durata | Patte max % | Patte globali % | Turni medi | Invarianti | Bound oltre il tetto |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Controllo | 10 | 2 | 2 | 6 | 22,32 | 7,570 | 11,765 | 0 | 0 su 15 (massimo 4) |
| (a) | 10 | 2 | 2 | 6 | 22,32 | 7,514 | 11,767 | 0 | 0 su 15 |
| (b) | 10 | 2 | 2 | 6 | 18,57 | 6,584 | 11,833 | 0 | 0 su 15 |
| (c) | 10 | 2 | 2 | 6 | 18,57 | 6,488 | 11,835 | 0 | 0 su 15 |

## Specchi osservati: patte, durata e danno a sé letale

Osservatore di SB-16e, 6.400 partite per specchio. Una patta «con danno a sé letale» ha almeno un giocatore il cui ultimo passaggio
da salute positiva a zero è un danno proprio (`opponent+self`, `self+self`, `end+self`).

| Specchio | Profilo | Patte | Patte % | Turni medi | Con danno a sé letale | Stesso gruppo, due danni avversari |
|---|---|---:|---:|---:|---:|---:|
| Celestina | Controllo | 1.419 | 22,17 | 17,44 | 936 | 383 |
| Celestina | (a) | 1.419 | 22,17 | 17,44 | 936 | 383 |
| Celestina | (b) | 1.203 | 18,80 | 18,15 | 493 | 606 |
| Celestina | (c) | 1.203 | 18,80 | 18,15 | 493 | 606 |
| Piera | Controllo | 1.180 | 18,44 | 14,64 | 828 | 352 |
| Piera | (a) | 1.164 | 18,19 | 14,66 | 836 | 328 |
| Piera | (b) | 916 | 14,31 | 14,78 | 442 | 474 |
| Piera | (c) | 880 | 13,75 | 14,80 | 435 | 445 |

Cosa mostrano le misure:

- **Il danno a sé ridotto dimezza le patte con danno a sé letale** in entrambi gli specchi (936 → 493 e 828 → 435). Una parte
  delle partite risparmiate diventa però patta per due colpi avversari nello stesso gruppo, ad esempio 383 → 606 per Celestina.
  Le patte calano quindi di 3,75 punti per Celestina e di 4,71 per Piera, ma restano sopra il 10%.
- Gli specchi si allungano di circa 0,7 turni per Celestina e 0,15 per Piera: chi prima moriva da solo ora resta in piedi.
- **+35 A da solo pesa poco**: lo specchio di Piera perde 0,39 punti di patte, Piera–Beppe passa da 0.449 a 0.476 e Mara–Piera
  da 0.674 a 0.668. Insieme al danno a sé ridotto aggiunge 0,69 punti di patte in meno nello specchio di Piera e porta
  Piera–Beppe a 0.504.
- Lo specchio di Celestina è identico in (a) e in (c) rispetto al controllo e a (b): le carte di Piera non vi entrano. Torna con
  i semi fissati.
- I numeri dell'osservatore usano 400 semi per cella e non vanno confusi con le percentuali della matrice, che ne usa 2.000.

## Variante adottata e perché

Le tre regole fissate prima non bastano a separare (b) e (c): entrambe hanno 10 violazioni, 2 sulle patte e lo stesso massimo,
il 18,57% dello specchio di Celestina, che le carte di Piera non toccano. **Ho esteso lo spareggio allo stesso modo:** confronto
delle patte fuori soglia una dopo l'altra, dalla più alta alla più bassa. Al secondo valore, lo specchio di Piera, (c) ha 13,07%
e (b) 13,76%, una differenza di circa 0,7 punti su 32.000 partite. La lettura vale anche per quote e patte globali: Mara–Piera
0.653 contro 0.659, Celestina–Piera 0.662 contro 0.663, patte globali 6,49% contro 6,58%. Il prezzo è circa 0,01–0,02 turni in
più nella durata. Questa estensione è stata scelta **dopo** aver visto i dati e la dichiaro come tale. Il proprietario può
preferire (b), che cambia un numero in meno: domanda 2.

Numeri adottati nella bozza con la delega di D38 confermata da D56. Sono soli numeri, senza cambi di funzionamento o di
composizione:

| Carta | Prima (giro 3 di SB-16e) | Dopo |
|---|---|---|
| Un altro e arrivo (`base.pino.OffroIo`) | +15 L, +20 A | +15 L, **+35 A** (effetto, testo e `gains`) |
| L'ultima dose (`junkie.LethalHeroinDose`) | 5 HIT a sé; 7 POISON e +4 T | **2 HIT a sé**; 7 POISON e +4 T |
| L'ultimo giro (`base.pino.UltimoGiro`) | `selfHit` 5, base 12 | **`selfHit` 2**, base 12 |

La bozza dopo la modifica è identica al profilo (c) misurato, cioè a `sb-16e2/c/draft.json`. Lo verifica il test.

### Criteri raggiunti e non raggiunti con (c)

| Criterio | Esito |
|---|---|
| Base contro base 45–55% | **Raggiunto**: Spazienzio–Mara 0.524 |
| Altri incontri 40–60% | **Non raggiunto**: Mara–Piera 0.653, Celestina–Piera 0.662; tutti gli altri dentro |
| Durata circa 6–12 turni | **Non raggiunto**: Celestina–Celestina 18.22, Piera–Piera 14.83, Celestina–Piera 13.80, Piera–Beppe 12.88, Spazienzio–Piera 12.44, Celestina–Beppe 12.39 |
| Patte al massimo al 10% (D51) | **Non raggiunto**: specchio di Celestina 18.57%, specchio di Piera 13.07%; tutti gli altri incontri sotto il 10% |
| Invarianti a zero | **Raggiunto**: 0 su 480.000 partite |
| Tetto delle bound | **Raggiunto**: 0 bound in violazione su 15, massimo 4 |

## Attesi dei test cambiati, con la decisione

Solo per i numeri adottati, sotto **D56/D38**, con D56 citata nei messaggi dei test. Nessuna soglia allentata.

| Test / atteso | Prima | Dopo |
|---|---|---|
| `SetBaseDraftTest`, L'ultima dose risolta: salute di Celestina | 60 (65 − 5) | 63 (65 − 2) |
| `SetBaseDraftTest`, `selfHit` e testo di L'ultimo giro | 5, «5 HIT a sé» | 2, «2 HIT a sé» |
| `SetBaseDraftTest`, L'ultimo giro risolto: salute di Piera | `PINO_HEALTH − 5` | `PINO_HEALTH − 2` |
| `SetBaseDraftTest`, Un altro e arrivo risolto: A | 35 (+20) | 50 (+35) |
| `StarterRedesignTest`, caricamento di Piera dopo il fine turno: A | 13 | 28: stesso decadimento, +15 A in più |

Test nuovo: `StarterLotMeasureTest`. Il test ordinario `variantsChangeOnlyTheDeclaredNumbers` controlla tre cose:
- ogni variante, ricavata dallo snapshot del giro 3, cambia solo le carte dichiarate e i loro metadati;
- le liste dei mazzi restano uguali;
- la bozza attuale coincide con (c).

`lot`, attivato solo da una proprietà di sistema, è la misura. Mutazioni sulla logica nuova di `variant`: **4/4 rilevate**
([mutations.json](sb-16e2/mutations.json)), sorgente ripristinato e test di nuovo verde.

## Verifiche

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | Server **713 test, 0 falliti/errori, 10 saltati** (le 9 misure a richiesta di prima più `lot`); client-debug **37/37** |
| `python scripts/check-rules.py` | Verde: regolamento 1.13 e Set Base 0.1, 39 carte e un token, SQLite integro |
| `./client-web/run.ps1 -Task Test` | **333/333** |
| `./client-web/run.ps1 -Task Build` | Verde, solo avvisi del bundler. Lanciato in catena da PowerShell 5.1, l’avviso su stderr ha interrotto la catena prima di Size; non è un errore di build |
| `./client-web/run.ps1 -Task Size`, `BM_OUT` in TEMP | JS gzip **350.290 byte**, totale **1.760.434**, texture **27.729.048** (82,6% del tetto C4); limiti e tetti rispettati, come in SB-16e |
| `python scripts/check-links.py` | **290 documenti, 0 link rotti** |
| `git diff --check` | Verde ([riepilogo](sb-16e2/checks.json)) |
| Lotto: invarianti e tetto delle bound nei quattro profili | 0 violazioni |

Playwright esclusa dal brief. **Non verificato:**
- contesto Spring completo (`TestServerContext`);
- avvio reale del profilo `bozza`;
- partite umane.

Test unitari verdi non dimostrano che l'applicazione si avvii. **Rossi:** nessuno nuovo, nessuna voce del registro toccata.

Evidenze in git: circa 0,6 MB. Matrici compatte e specchi osservati per profilo, `draft.json` di ogni profilo, budget, regola di
selezione, consuntivo e criteri ([criteria.json](sb-16e2/criteria.json)). Matrici complete con le celle e log restano in
`C:\Users\PEDM17\AppData\Local\Temp\bm-sb16e2`. Nessun push.

## Domande numerate al proprietario

1. **Il lotto è esaurito senza raggiungere i criteri** (D56: niente secondo lotto). Restano fuori gli specchi di Celestina e
   Piera (patte e durata), Piera contro Mara e Celestina, e quattro incontri lunghi circa mezzo turno di troppo. Le leve numeriche
   provate in SB-16e e qui sono poche e i loro effetti piccoli. Vuoi un **ridisegno esplicito** delle due last resort o del finale
   degli specchi prima di SB-16f, oppure andare alla prova umana (SB-16f0, poi SB-16f) con questi numeri e decidere dopo aver giocato?
2. **(c) o (b)?** Ho adottato (c) con uno spareggio esteso dopo aver visto i dati. (b) cambia un numero in meno (lascia +20 A) ed è
   peggiore di 0,7 punti di patte nello specchio di Piera. Confermi (c)?

# SB-16g Fase 2b, passo 1 — rapporto

13 novembre 2026. Base `d701089`. Attua **D71–D74**, nei soli incontri con regole `d50`.
Consegna del passo 1; **STOP prima del passo 2**, in attesa della prova umana breve. Nessun push.

## Perimetro e comportamento

Contratto scritto prima del codice: [regole d50 1.0](../../design/set-base/sb-16g-2b1-rules.md).
Regolamento vivo 1.13, Set Base 0.1, catalogo SQLite, allegato e copie client delle regole sono invariati.

- **D71/M1:** una giocata omonima soddisfa il più vecchio gettone preesistente, anche se parata o annullata;
  il gettone resta attivo contro tutti i gruppi successivi e il veleno periodico, poi cade a fine turno.
- **D71/M5/K1:** senza copie del nome in mano e nel mazzo parte un ultimo turno intero di esposizione.
  La copia trovata è disegnata solo se effettivamente in mano. Il conto alla rovescia sopravvive a serializzazione/ripristino.
- **D72/M6:** ricerca fallita o non eseguita: nessun gettone. Le mappe `search.foundGains` e `search.missedGains`
  stampano i guadagni dei due esiti, applicati una volta dopo la ricerca e inclusi nel rapporto della mossa.
  Il vecchio `turnsIfNotFound` resta leggibile per bozze storiche, senza effetti. D70 continua a vietare oggetti.
- **D73/M2:** HEALTH sotto il costo di «Ultimo colpo» è ammessa solo in d50; si paga quanto resta fino a zero.
  Le altre risorse restano necessarie. `Move` e `BotView` usano lo stesso criterio.
- **M3:** i segni soddisfatti si individuano prima della risoluzione della mossa: una carta che cerca se stessa
  non consuma il gettone e la carta appena trovati.
- **Client M5/C1:** `lastTokenCopies`, presente solo nella vista privata del proprietario e solo quando necessario,
  permette l'avviso esatto prima dello scarto. Nessun contenuto o ordine del mazzo avversario viene esposto.
  Il dialogo permette di tornare alla scelta o inviare una volta; le descrizioni degli stati perdono il punto finale duplicato.

La bozza cambia esattamente **cinque** carte e nessun altro campo di gioco: stessi guadagni a ricerca riuscita,
nessun nuovo titolo, nessun danno, costo, priorità, rarità o lista cambiati. Un test confronta la bozza con il profilo
storico (c) di SB-16e2 e controlla separatamente le sole modifiche D71–D72. Griglia, descrizioni della bozza e contratto
comune della proposta sono allineati. Le dieci schede future della proposta restano da riscrivere/approvare nel passo 2.

## Bot e limiti della vista

`StyleSupport` legge le copie **ancora scoperte** anche quando la ricerca è più vecchia dell'ultimo turno e legge i fattori dei
gettoni attivi. Le tre politiche sono un involucro dello stile: **ALWAYS**, prima occasione legale dal turno dopo;
**HOLD_IF_DEFENDED**, tiene il nome se un avversario vivo ha mostrato DEFENSE/COUNTER nell'ultimo turno;
**RANDOM**, moneta con il generatore a seme, una volta per decisione. Se tenere non lascia alternative legali, si gioca.
Le scelte forzate restano nei soli insiemi di mosse legali; nessuna lettura delle mosse pendenti.

Lo stesso attacco preferisce un bersaglio con gettone, anche in FFA; lo scarto conserva il nome richiesto quando esiste
un'alternativa. In bozza il computer usa **ALWAYS** sullo stile scelto. L'archivio registra timing e stile, per esempio
`SoughtHitPolicy(ALWAYS,ResourceAwarePolicy)`; col profilo spento e con regole vive il comportamento precedente resta.

I quattro stili del giro sono aggressivo, prudente, risorse e com. **com è qui `RandomPolicy` sull'insieme legale**, avvolto
come gli altri: il vecchio `ComPlayer` sceglieva carte e bersagli con un algoritmo diverso. Per questo il confronto con AP2
è orientativo, non un esperimento che attribuisce ogni differenza al solo gettone. Non c'è pianificazione su più turni;
la politica «tieni» reagisce alla difesa già pubblica, non indovina una difesa scelta in segreto nel turno attuale.

## Un giro e budget D68

[Budget](sb-16g-2b1/budget.json): **1 giro, 121,9582339 secondi**; restano **2 giri e 7.078,0417661 secondi** per passi 2 e 3.
Nessun secondo profilo d50 o giro di taratura. Un primo comando con percorso della bozza errato è terminato prima di creare
partite (0 partite); poi il giro completo sotto. Verifiche unitarie, contesto e regressione viva non sono giri di bilanciamento.

**648.000 partite**, 15 incontri inclusi gli specchi × 16 coppie di stili × 9 coppie di politiche × 300 semi.
Semi **7.000.000–7.000.299 per cella**, identici nelle politiche, posti alternati; 8 thread; 2.160 celle.
File della bozza letto dal banco SHA-256 `c4c767c15212a7525cd9c1687924106e8467a5016618b8f43c3f31ae0acab5a9`.
Invarianti: **0 violazioni su 15.521.370 turni di giocatore**; limiti di durata 0; bound tutte entro 4.

Evidenze: [matrice completa JSON](sb-16g-2b1/matrix.json), [lettura del banco](sb-16g-2b1/matrix.md),
[osservazioni per personaggio/stile/politica](sb-16g-2b1/observations.json), [bozza misurata](sb-16g-2b1/draft.json).
I semi sono riusati tra celle: i totali non sono altrettante osservazioni indipendenti. Gli IC95 del banco per cella
sono conservati; i confronti aggregati sotto sono stime descrittive.

| Incontro | Quota A, escluse patte | Patte | Turni medi | P10–P90 |
|---|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 52.12% | 3.17% | 9.88 | 6–15 |
| Spazienzio–Mara | 48.04% | 3.09% | 9.30 | 5–14 |
| Spazienzio–Celestina | 38.42% | 4.74% | 11.69 | 7–17 |
| Spazienzio–Piera | 42.51% | 4.06% | 12.80 | 8–17 |
| Spazienzio–Beppe | 47.34% | 3.78% | 10.41 | 7–15 |
| Mara–Mara | 49.25% | 3.40% | 8.83 | 5–13 |
| Mara–Celestina | 52.12% | 5.99% | 10.89 | 7–15 |
| Mara–Piera | 67.71% | 5.85% | 11.61 | 8–15 |
| Mara–Beppe | 58.11% | 2.27% | 9.53 | 6–13 |
| Celestina–Celestina | 47.43% | 19.32% | 18.27 | 12–22 |
| Celestina–Piera | 74.39% | 6.70% | 13.94 | 10–17 |
| Celestina–Beppe | 65.67% | 8.06% | 12.33 | 9–16 |
| Piera–Piera | 52.24% | 14.38% | 15.52 | 13–18 |
| Piera–Beppe | 51.32% | 8.84% | 13.40 | 10–16 |
| Beppe–Beppe | 51.84% | 9.56% | 11.25 | 9–14 |

| Personaggio | Ricerche | Fallite | Danno avversario con gettone / ricerca riuscita | Di cui amplificazione | Danno / evento avversario con gettone | Turni successivi col gettone / trovata |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio | 159471 | 23.38% | 20.41 | 6.69 | 13.09 | 2.72 |
| Mara | 58911 | 26.23% | 18.17 | 5.77 | 13.56 | 1.16 |
| Celestina | 97434 | 40.86% | 16.07 | 5.19 | 12.77 | 1.30 |
| Piera | 200247 | 41.60% | 13.04 | 4.44 | 13.41 | 1.29 |
| Beppe | 102729 | 59.94% | 16.66 | 5.27 | 12.59 | 1.29 |

| Politica | Vittorie decisive | Patte | Turni | Fallite | Finali da metà salute | Turni successivi col gettone / trovata |
|---|---:|---:|---:|---:|---:|---:|
| Gioca sempre | 50.55% | 6.94% | 11.99 | 38.46% | 1.41% | 1.45 |
| Tieni dopo parata | 50.32% | 6.92% | 11.98 | 38.45% | 1.40% | 1.55 |
| A caso | 49.13% | 6.79% | 11.96 | 38.20% | 1.40% | 2.21 |

Totale: 6.881% patte; 11.976 turni; 16.857% con un turno da metà salute; 1.400% finite in quel turno.


Le quote della matrice escludono le patte (D51). Tutte le righe hanno 43.200 partite. Le soglie non sono state cambiate:
Celestina–Celestina **19,32%** e Piera–Piera **14,38%** restano sopra il 10%; restano fuori dal 40–60%
Spazienzio–Celestina, Mara–Piera, Celestina–Piera e Celestina–Beppe. Spazienzio–Mara è nel 45–55%.
Questo passo non chiude il bilanciamento e non tenta di correggerlo cambiando i danni.

Confronto diretto, 144.000 partite per coppia: ALWAYS contro HOLD_IF_DEFENDED **50,227%** delle decisive;
ALWAYS contro RANDOM **51,408%**; HOLD_IF_DEFENDED contro RANDOM **51,189%**. Tenere dopo una difesa
non domina; «a caso» prolunga l'esposizione. Il giudizio sull'interesse della scelta resta umano.

**Definizioni delle nuove misure.** `tokenDamage-*` conta ogni danno all'istante in cui il gettone è attivo, dopo gli stati
e la corazza e prima del limite della salute (include eventuale eccesso letale). `tokenExtra-*` ricalcola solo le funzioni
pure dei moltiplicatori omettendo i gettoni, con lo stesso ordine/troncamento; non rigioca né modifica la partita.
Attacchi avversari e autodanno/periodici sono separati nel JSON. I turni successivi col gettone si contano a ROUND_READY,
quindi escludono il turno in cui il caricamento lo crea. Le misure includono anche le finestre chiuse dal fine partita.
Il test `damageObservationPreservesTheTrace` confronta 20 tracce complete con/senza osservazione.

Un «turno da metà salute» usa la perdita netta tra inizio e fine turno, almeno metà della salute iniziale: include costi,
autodanno e periodici, le cure la riducono. La misura «finita in quel turno» richiede anche la fine partita nello stesso turno.
Non è solo danno avversario, come nella sonda AP2. Non sono state alterate salute o potenza delle carte.

## Taratura delle risorse D72

Mantengo nel profilo misurato la partenza circa un terzo arrotondata al multiplo di 5 più vicino:

| Caricamento | Trovata | Fallita, più pesca normale e nessun gettone |
|---|---|---|
| PAZIENZA: FINITA | +15 V, +15 A | +5 V, +5 A |
| Slalom d'avvicinamento | +15 A | +5 A |
| Dose in preparazione | +10 T | +5 T |
| Un altro e arrivo | +15 L, +35 A | +5 L, +10 A |
| Preparo il lavoro | +10 V | +5 V |

Il ripiego perde dal 50% a circa il 70% delle risorse e non consegna il colpo mirato. Per Celestina e Beppe l'arrotondamento porta al 50%,
non a un terzo esatto. Il premio pieno e la ricerca sono ora un unico esito: non si ottengono più tutte le risorse evitando il
gettone quando il colpo manca. I test confrontano i due esiti, la pesca anche a mazzo vuoto, l'assenza del gettone e i guadagni
scritti nel riepilogo; tutti i colpi restano quelli di oggi.

Il costo misurato della ricerca riuscita è reale (4,44–6,69 danni avversari **aggiuntivi per ricerca**, secondo personaggio).
Le quote di fallimento delle tre politiche sono vicine (38,20–38,46%): il giro non mostra una politica del timing che ricavi
un vantaggio netto cercando a vuoto. Questo non prova che ogni ricerca riuscita sia migliore in qualunque stato: senza
vulnerabilità fallire può essere il male minore quando si è già vicini al KO. La taratura sceglie un ripiego chiaramente inferiore
come risorse e accesso al colpo; il suo valore percepito, soprattutto +5 T/+5 V, è una domanda della prova umana, non un motivo
per spendere un altro giro o cambiare ora i danni.

## Verifiche e attesi deliberatamente cambiati

| Verifica | Esito |
|---|---|
| Unitari server | 756, 0 falliti/errori, 12 saltati |
| client-debug | 37/37 |
| client-web Test | 348/348 |
| client-web Build | verde |
| Size | JS gzip 352.171 B; totale gzip 1.762.328 B; texture 27.729.048 B, limiti e tetto C4 verdi |
| SB-7 1.13 | 480.000 partite su base e finale; JSON e Markdown identici byte per byte |
| Mutazioni | 8/8 rilevate con asserzioni, sorgenti ripristinati |
| Contesto Spring | 873 test, 0 falliti/errori, 12 saltati; R3 non comparso (7:42 min) |
| Avvio reale -Bozza | avviato con -Bozza su SQLite temporaneo; dialogo M5 verificato a 1366×768 e 844×390, 0 errori di pagina |
| check-rules / check-links / manifest / diff | check-rules verde; check-links 298 file/0 rotti; manifest PASS; diff --check verde |

Gli attesi modificati discendono da D64/D71 (tre danni anche per Spazienzio, fine turno e uscita), D72 (niente esposizione a
ricerca fallita e guadagni dopo la ricerca), D73 (costo HEALTH), D74 (politica d50 nell'archivio). Il vecchio test del lotto SB-16e2
continua a confrontare il profilo (c) con **il suo snapshot storico**, non con la bozza che D74 modifica.
Nessuna soglia, BASE_750 o criterio è stato allentato. Il primo contesto completo ha trovato solo l'atteso CLI
`ResourceAwarePolicy`, ora superato dall'involucro D74: corretto per controllare anche stile e timing.

Il primo confronto vivo aveva tutti i dati identici e un checksum diverso perché la sonda rileggeva il file classpath corrente
invece del fixture storico. Il confronto finale usa lo **stesso percorso e gli stessi byte del fixture** in entrambe le build;
non normalizza o esclude campi dai rapporti confrontati. Il fixture comune ha SHA-256 `faf265fad50ee0bedca125209f7008434a73660131f786ad272800235567d7c5`; il suo JSON è identico alla bozza Git di `d701089`, varia solo la terminazione delle righe. Un secondo tentativo aveva solo il percorso diverso: il banco abbrevia i percorsi interni al checkout. Il fixture finale è quindi in TEMP, esterno a entrambe le copie.

## Comandi riproducibili

Evidenze di identità: [checksum del confronto vivo](sb-16g-2b1/live-identity.json), [otto mutazioni](sb-16g-2b1/mutations.json), [esecutore delle mutazioni](sb-16g-2b1/mutations.py).

Maven da `server/`, con JDK completo di `.tools` in JAVA_HOME/PATH. Prefisso comune:

```powershell
$env:JAVA_HOME = 'E:/bm/.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$mvn = 'E:/bm/.tools/apache-maven-3.6.3/bin/mvn.cmd'
$common = @('-s','E:/bm/scripts/maven-settings.xml','-Dmaven.repo.local=E:/bm/.tools/m2','-B','-o')
& $mvn @common -q test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.chargeGames=300' `
  '-Dsim.chargeOut=E:/bm/tmp/sb16g2b1/round-1'
```

Regressione viva, **fuori budget d50**: copia esportata con `git archive d701089`, senza worktree o collegamenti agli strumenti;
snapshot dello stesso JSON della bozza di base, con terminatori CRLF, salvato in `$env:TEMP/bm-sb16g2b1-live/base-draft.json`, fuori da entrambe le radici per evitare abbreviazioni diverse del percorso nel rapporto. `$referenceDir` indica tale cartella. Sulla copia:

```powershell
& $mvn @common -q test '-Dtest=BenchMeasureTest#matrix' '-Dsim.rules=1.13' `
  "-Dsim.draft=$referenceDir/base-draft.json" '-Dsim.threads=8' '-Dsim.bench=2000' `
  '-Dsim.styles=aggressivo,prudente,risorse,com'
```

Sul codice finale (`$referenceDir = Join-Path $env:TEMP 'bm-sb16g2b1-live'`):

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft' `
  '-Dsim.rules=1.13' "-Dsim.liveReference=$referenceDir"
```

Altri comandi dalla radice:

```powershell
./scripts/build.ps1 -Task Test -Offline
./scripts/build.ps1 -Task TestServerContext -Offline
./client-web/run.ps1 -Task Test
./client-web/run.ps1 -Task Build
$env:BM_OUT='E:/bm/tmp/sb16g2b1/size'; ./client-web/run.ps1 -Task Size
./scripts/build.ps1 -Task Server -Offline
python scripts/check-rules.py
python scripts/check-links.py
python scripts/verify-match-manifests.py
git diff --check
```

Cattura automatica: [script](sb-16g-2b1/capture.mjs), client Serve sulla 4320; avvia realmente
`./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Pool starter-gigi -Com starter-spazienzio -Bot prudente`
su SQLite temporaneo, poi ferma solo i propri processi. Log estesi, copie e output intermedi restano in
`E:/bm/tmp/sb16g2b1`; il JSON della cattura riporta anche il percorso del database/log in TEMP.

## Cattura reale del dialogo

[Cattura desktop](sb-16g-2b1/warning-desktop.jpg), [viewport 844×390](sb-16g-2b1/warning-phone.jpg),
[esito automatico](sb-16g-2b1/captures.json). Viste entrambe: testo intero e due scelte leggibili, senza tagli.
Beppe cerca l'unica copia di «Lavoro fatto bene» e sceglie di scartarla per «Una stretta e passa».
Il dialogo non invia; annullare non invia; confermare invia esattamente una mossa. Dopo lo scarto nessuna carta è mostrata,
resta il gettone con il testo «Non restano copie … finisce alla fine di questo turno» nel turno successivo.
Avvio reale mediante `dev.ps1 -Bozza`, non soltanto un contesto di test. Client e server di verifica sono stati poi fermati.

## Non verificato e domande numerate

Nessuna prova umana compiuta da questa consegna; l'automazione dell'avviso non la sostituisce.
Non eseguite matrici Playwright complete, telefono fisico o simulazioni FFA di bilanciamento; i test coprono gettoni e bersagli
in FFA a tre giocatori e il salvataggio D48 con gettone attivo. M4 resta latente: nessuna nuova penalità ai costi di risorsa è stata
introdotta. Q9–Q12 del piano restano aperte; nessuna difesa POISON modificata.

Per la prova breve: giocare Spazienzio lento, poi Piera o Mara veloci; fermarsi prima del passo 2.

1. Il turno del colpo mostra un prezzo visibile anche con Piera/Mara, rispetto a Spazienzio?
2. L'avviso dello scarto e l'ultimo turno di esposizione sono chiari sul telefono?
3. Il colpo cercato conviene giocarlo subito o tenerlo dopo una parata: la scelta è interessante?
4. Il ripiego di D72 si sente chiaramente peggiore della ricerca riuscita, soprattutto +5 T di Celestina e +5 V di Beppe?

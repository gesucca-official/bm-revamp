# SB-16g — 2b, passo 3: potenza e giro finale (D82, D84, D88)

La prima parte è lo STOP prima dell'attuazione, con la risposta D84; la [seconda parte](#parte-2--attuazione-passo-0-e-giro-finale-a-due-bracci-d82-d84-d88) è l'attuazione, il giro finale a due bracci e lo STOP sui criteri.

## Parte 1 — STOP prima dell'attuazione

14 novembre 2026. Base `5f8c703`. Attuazione della [proposta 1.4](../../design/set-base/sb-16g-proposta.md#passo-3--proposta-corrente-14)
approvata in [D82](../../set-base-plan.md#decisioni-del-proprietario), **fermata prima di toccare bozza, codice o test**: due dei
funzionamenti approvati non si esprimono con i dati e i parametri esistenti del playground senza cambiare classi in `server/src/main`,
fuori dal perimetro del blocco. È il caso previsto dall'ultima riga di «Destino di ciascuna proposta» della 1.4: STOP con proposta,
nessun ampliamento implicito. Nessuna misura: **residuo D68 intatto, 1 giro / 6.340,0406251 s (6.340,041 s)**.

### Cosa sta nei dati e cosa no

Controllo fatto sul caricatore (`Draft`, `DataCards`), sulle classi `java` della bozza, su `PrintedEffects` e su `TurnForecast`.
Nessun file modificato.

| Carta della 1.4 | Esprimibile oggi | Come |
|---|---|---|
| Impatto 30 HIT, Tossicone 18 POISON, Chiave 10 V/22 CUT | sì | numeri di passi dati |
| Ti stringo +20 A, Dose +10 T/+5 A, Un assaggino +20 T | sì | `foundGains` del passo `search` |
| Cinghiata 20 A, 18 + A residua/2 CUT | sì | `amount {base 18, of ALERTNESS, divide 2}`, letto alla risoluzione dopo il costo |
| Preparo, Una stretta: 4 CUT a un avversario, ricerca a sé | sì | `targets: OPPONENT`, `search` in `self`, `damage CUT 4` in `target`; il caricatore vieta `search` solo in `target` |
| Estasi 18 + L spesa | sì | parametro `base` di `base.pino.GoingBerserk` |
| Lavoro 14 + 7 per oggetto, 10 V | sì | parametri `base`/`perItem` di `base.gigi.LavoroFattoBene` |
| Sotto il cofano +5 A | sì | passo `gain` |
| Bancone B, POISON ×0,5 nel turno | sì | secondo passo `status` (`turns: 0`), variante della bozza |
| **Travaso + 12 POISON diretti** | **no** | vedi sotto |
| **Rutto 14 + 2×L spesa, −A uguale, L azzerata** | **no** | vedi sotto |

**Travaso.** `junkie.ToxicBloodDrain` è una classe del catalogo vivo con il solo parametro `turns`. Non può diventare una carta a
dati: i passi non hanno né la rimozione dell'immunità né il timer, e gli effetti su sé si applicano prima di quelli sul bersaglio,
quindi la T letta verrebbe azzerata prima del trasferimento. Il POISON diretto richiede un parametro nuovo nella classe viva, oppure
una classe nuova con un binding nuovo, che cambia il binding nella lista di Celestina e nella ricerca di Un assaggino.

**Rutto.** È una carta a dati. `Amount` vale `base + risorsa/divide`: non ha un moltiplicatore per il «doppio della L». La L
andrebbe letta dopo il costo e azzerata dopo gli effetti sul bersaglio, ma i passi `self` vengono prima e un `empty` in `target`
azzera la risorsa del bersaglio. Due danni separati (14 + L e L) non sono equivalenti: corazza L/4 e troncamento R05 si
applicherebbero due volte. Serve una classe come `base.pino.GoingBerserk`. Per la previsione dei bot serve anche un moltiplicatore
in `PrintedEffects.Step` (oggi `base`, `of`, `divide`, `perItem`), che sta in `model/cards`, fuori dal pacchetto del bot ammesso.

**Classi solo nei sorgenti di test: scartate.** Il profilo `bozza` (`scripts/dev.ps1 -Bozza`) avvia il jar, senza classi di test:
il caricatore rifiuterebbe la bozza («nessuna classe Java») e la prova umana prevista prima di SB-17 non partirebbe.

### Proposta

**Opzione 1, raccomandata: supporto mirato alle due carte, in tre file di `server/src/main`.**

1. Nuova classe del playground `com.gsc.bm.model.cards.base.pino.RuttoADistanzaSociale`, accanto a `GoingBerserk` e
   `LavoroFattoBene` (messe in `main` da SB-8 per il profilo `bozza`). Binding invariato; nella bozza diventa `java: true`, 5 L,
   priorità 1, parametri `base` 14 e `perAlcohol` 2. Memorizza la L dopo il costo; su sé azzera la L; sul bersaglio −A pari alla L
   memorizzata, poi HIT `base + perAlcohol × L`.
2. Parametro `@Tunable poison = 0` in `junkie.ToxicBloodDrain`: dopo il trasferimento il bersaglio subisce `poison` danni da veleno,
   solo se positivo. Col valore 0 la carta viva non cambia; altre classi vive hanno già parametri `@Tunable`. Nella bozza
   `turns` 1, `poison` 12.
3. Campo `times` (default 1) in `PrintedEffects.Step` per la parte variabile (`base + times × risorsa/divide`), letto da
   `TurnForecast`. Il travaso stampa anche il suo POISON quando è positivo.

Cancelli: `liveBenchOnTheSameHistoricalDraft` identico byte per byte alla base, `TurnForecastFidelityTest` senza discrepanze sui
nuovi effetti, mutazioni sulle due classi. Poi il resto della 1.4 nei dati, il passo 0 e il giro come prefissati, senza cambi.

**Opzione 2: supporto generale nei dati** (`times` e lettura a inizio risoluzione in `Amount`, azzeramento dell'autore dopo il
bersaglio, passi per immunità e timer in `DataCards`). Più ampia e utile in futuro, non necessaria ora: non la raccomando.

**Opzione 3: togliere le due modifiche dalla 1.4.** Ridefinisce i bracci, chiede una nuova approvazione e lascia deboli due dei rari
intermedi che D80 metteva fra le priorità: non la raccomando.

### Verifiche

`git fetch` riuscito, `main` avanti su `origin/main`, nessun remoto da integrare; working tree pulito alla partenza.
`python scripts/check-rules.py`, `python scripts/check-links.py` e `git diff --check` verdi su questo commit, che tocca solo
documenti. Non eseguiti, perché nessun codice o dato è cambiato: suite server, contesto Spring, identità viva, fedeltà della
previsione, passo 0 e giro.

### Domande numerate

1. Approvi l'opzione 1, cioè l'estensione del perimetro ai tre file sopra (classe nuova del Rutto, parametro `poison` nella classe
   viva del travaso, campo `times` della previsione), con identità viva 1.13 e fedeltà della previsione come cancelli?
2. Per il travaso, invece del parametro nella classe viva, preferisci una classe del playground con binding nuovo? Titoli e copie
   restano uguali, ma cambiano il binding nella lista di Celestina e la ricerca di Un assaggino.

### Risposta del proprietario

14 novembre 2026, «D'accordo con tutte le tue considerazioni», registrata in
[D84](../../set-base-plan.md#decisioni-del-proprietario): opzione 1 col parametro `poison` nella classe viva del travaso (domanda 2: no
alla classe nuova).

## Parte 2 — attuazione, passo 0 e giro finale a due bracci (D82, D84, D88)

14 novembre 2026, ripresa dopo [D84](../../set-base-plan.md#decisioni-del-proprietario). Codice finale = codice misurato nel giro,
secondo [D88](../../set-base-plan.md#decisioni-del-proprietario) («Parametro (dati validi)»). Evidenze in [sb-16g-2b3/](sb-16g-2b3/).

### Episodi del blocco

- **Due conseguenze di D84 non previste nello STOP:** `Draft` esige nei `params` ogni `@Tunable` (tre fixture storiche e quella
  dell'identità viva non si caricavano più) e `scripts/check-rules.py` leggeva `poison` come danno nominale vivo «POISON 0».
  Le ho segnalate alla regia, proponendo un parametro facoltativo e un'eccezione nel verificatore, e intanto le ho attuate in locale.
- **Messaggi non arrivati:** il fermo della regia sul travaso e D86 non sono arrivati a questa sessione, che ha proseguito con la
  soluzione proposta e ha lanciato passo 0 e giro.
- **Interruzione:** il processo si è chiuso verso le 14:12, dopo il braccio A e prima del braccio B, per la chiusura della sessione.
  Con [D87](../../set-base-plan.md#decisioni-del-proprietario) il braccio B è stato completato sullo stesso codice e con gli stessi semi:
  è il completamento del giro prefissato, non un rilancio.
- **Clic:** in questa sessione il proprietario ha premuto «Sì, opzione 1», il pulsante rimasto dalla prima domanda dello STOP. Alla
  regia ha poi confermato «confermo quello che avevamo deciso insieme qui»: il clic non vale.
- **D86 provata e abbandonata:** dopo il braccio B il travaso è diventato la classe nuova `base.tossico.CeDelSangueNellaMiaDroga`, con i
  quattro file vivi riportati alla base. Il campione del passo 0 rifatto non coincide: `Draft` ordina le carte regolari per binding
  (`TreeMap`) prima di mescolare, e il binding nuovo sposta il travaso dall'ultimo al quinto posto nel mazzo di Celestina. Restano
  identici i 10 incontri senza Celestina; celle identiche 1.472/2.160 in A e 1.466/2.160 in B ([confronto](sb-16g-2b3/d86-equivalence.json)).
  Si rompeva anche `MultiSetTest`. Con D88 si è tornati al codice del giro, ricostruito dalle sostituzioni esatte e verificato sotto.

### Attuazione, attesi e perimetro

**Bozza e griglia.** Esattamente la tabella «Carte che cambiano» della 1.4: Impatto 30 HIT; Ti stringo +20 A; Cinghiata 20 A,
CUT 18 + A residua/2; Dose +10 T/+5 A; Tossicone 18 POISON; Un assaggino +20 T; travaso con `poison` 12; Estasi `base` 18;
Rutto `java` con `base` 14 e `perAlcohol` 2; Preparo e Una stretta su un avversario, 4 CUT anche a ricerca fallita, Preparo +15 V;
Chiave 10 V/22 CUT; Lavoro 10 V, 14 + 7 per oggetto; Sotto il cofano +5 A. Testi brevi della proposta dopo lo slot. Liste, copie,
binding, priorità, rarità e personaggi invariati (D79), verificati contro lo snapshot del passo 2. Griglia: valori barrati nelle
righe degli slot e una sezione «Potenza del passo 3».

**Braccio B.** `server/src/test/resources/set-base/bancone-b.json` contiene il solo Bancone con lo stato GOOD INPUT POISON ×0,5
nel turno (`turns: 0`) e il testo della proposta. `SetBaseArms` lo sostituisce nella bozza con `-Dsim.arm=B`; senza la proprietà il
braccio è A. `PotenzaD82Test` dimostra che fra A e B cambiano soltanto quel passo e la descrizione.

**Codice in `server/src/main` (D84, D88).**

- `base.pino.RuttoADistanzaSociale`, classe nuova del playground accanto a `GoingBerserk`: memorizza la L dopo il costo, la azzera
  su sé, poi −A e HIT `base + perAlcohol × L` sul bersaglio.
- `junkie.ToxicBloodDrain`: `@Tunable(optional = true) poison = 0`; dopo il trasferimento infligge `poison` POISON solo se positivo.
  Con 0 la carta viva ha le stesse righe e gli stessi passi stampati di prima.
- `Tunable.optional()` (default `false`) e `Draft`: un parametro facoltativo assente prende il valore vivo; un parametro sconosciuto
  o un obbligatorio mancante restano rifiutati. Solo `poison` è facoltativo.
- `PrintedEffects.Step.times` (default 1), letto da `TurnForecast`: `base + times × (risorsa / divide)`.

**`scripts/check-rules.py` (condizioni della regia, D88).** Legge `@Tunable(optional = true)` come `@Tunable` e non conta come danno
nominale un importo `@Tunable` che vale 0 nel gioco vivo. Uno script di sonda ([check_rules_probe.py](sb-16g-2b3/check_rules_probe.py))
fa girare il verificatore fino al ciclo dei danni R07a e ne salva le letture: **38 carte del catalogo su 38 identiche** alla base `5f8c703`
fatta girare su un suo export, travaso compreso, e uscita identica. Con `poison = 5` provvisorio il verificatore torna rosso
(«R07a damage amount — differs from code POISON 5»); col file ripristinato, stessa impronta SHA-256, torna verde
([dettagli](sb-16g-2b3/check-rules.json)).

**Attesi cambiati con D82** (nessuno per accettare regressioni):

- `ChargeFrequencyTest`: risorse a N+1 dopo la ricerca riuscita di Ti stringo, Dose, Un assaggino e Preparo; i due caricamenti di
  Beppe si giocano sull'avversario; il controllo storico D79 legge ora lo snapshot del passo 2, come il passo 2 fece col passo 1.
- `StarterRedesignTest`: danni dei colpi trovati (30, 18, 25, 22) più i 4 CUT di Preparo; V dopo Preparo 55; A dopo Sotto il cofano 45.
  Preparo bersaglia un avversario, quindi con l'autore a terra la mossa si annulla (D50, punto 1) e resta la pesca normale.
- `SetBaseDraftTest`: costi e numeri di Cinghiata, Tossicone (e i conti a mano che ne seguono, 53→47, 46→40), Estasi, Rutto (spende
  e azzera la L), Chiave, Preparo e Lavoro. Il controllo di «in questo turno» accetta la maiuscola a inizio frase dei testi 1.4.
- `LethalAwarePolicyTest`: l'Impatto mostrato passa da 40 a 30 HIT; soglie di salute ricalcolate perché ogni caso conservi la propria
  intenzione (letale o no, corazza, gettone).
- `TurnForecastFidelityTest` gira ora su entrambi i bracci; `BozzaProfileOffContextTest` elenca anche la classe del Rutto.

Test nuovo `PotenzaD82Test`: le 14 carte cambiate e nient'altro, numeri della 1.4, bracci A/B, effetti contro motore e previsione
(Cinghiata su A residua, Rutto con memoria e corazza persa, travaso ±12 POISON, 4 CUT di Beppe trovando e non trovando, Bancone B su
POISON diretto e periodico solo nel suo turno, gli altri colpi), parametri del travaso. Il banco `ChargeMeasureTest` conserva i
contatori del passo 2 e aggiunge quelli di «Giro finale D80»: turni da metà salute e finali in un turno con fonti e carta avversaria,
per incontro; ragione terminale delle patte; A e gruppi del turno finale; last resort e Sotto il cofano; 4 CUT di Beppe per esito;
POISON diretto e periodico ricevuto, nominale, dopo stati e salute persa, anche nei soli turni di Bancone. Tutti di sola lettura:
la prova delle venti tracce identiche con e senza osservatore resta verde.

Nessun file del regolamento, di `docs/sets`, del catalogo, del client, di client-debug o delle carriere toccato.

### Verifiche sul codice finale

| Verifica | Esito |
|---|---|
| Prova d'identità D88: passo 0 dei due bracci rifatto sul codice finale | **identico byte per byte** a quello del giro: matrix, osservazioni, snapshot, per A e B ([impronte](sb-16g-2b3/identity-d88.json)) |
| `./scripts/build.ps1 -Task Test -Offline` | verde: server **793 test, 0 falliti/errori, 13 saltati**; client-debug 37/37; `check-rules.py` verde |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | verde: **910 test, 0 falliti/errori, 13 saltati** |
| Identità viva 1.13 (`liveBenchOnTheSameHistoricalDraft`) | 480.000 partite: JSON 266.868 B e Markdown 26.111 B **identici** alla base ([impronte](sb-16g-2b3/live-identity.json)) |
| `TurnForecastFidelityTest` | A **5.412/5.412** turni, B **5.422/5.422** (72 e 73 esclusi per timer) |
| Mutazioni | **10 su 10 rilevate** ([elenco](sb-16g-2b3/mutations.json)): Rutto (lettura della L, doppio, azzeramento), travaso (riga a POISON 0, POISON assente), previsione senza `times`, `Draft` che ignora `optional`, `Tunable` facoltativo per tutti, braccio B uguale ad A, `check-rules.py` senza eccezione |
| `check-links.py`, `git diff --check` | verdi: 310 file, 0 link rotti |

La base dell'identità viva è valida per `5f8c703`: `server/` coincide con la consegna del passo 2 (`7e8b939`), la cui uscita era
identica a `caad64c`; stessa fixture `d701089`, stessa cartella, nessuna normalizzazione.

### Rossi

Un rosso nuovo e intermittente, `DevelopmentAccountsTest.provisionAuthenticateAndReopenWithoutEmail`
(`SQLITE_READONLY` su un database in `@TempDir`), comparso una volta nella suite durante l'attuazione. Isolato è passato 4/4, e non si è
ripresentato nelle suite finali. Non provato sulla base perché non riprodotto; non aggiunto al registro dei rossi noti. Il blocco
non tocca account né SQLite. I rossi di bilanciamento D16/D51 sono sotto. Nessuna soglia cambiata.

### Passo 0, giro e residuo D68

Passo 0, 4 semi per cella, otto thread, in sequenza: A **18,567 s**, B **24,558 s**; s0 = 43,125 s, stima s0 + 112,5 × s0 + 120 =
**5.014,6 s ≤ 6.340,041 s** (5.036,6 s contando anche i tentativi falliti), fattibile ([fattibilità](sb-16g-2b3/feasibility.json)).
Il primo campione B si era fermato su un `NullPointerException` a partite finite: `SetBaseArms` chiamava il braccio B come una risorsa
del classpath e il banco ne cercava l'impronta. Corretto con un test prima del campione valido; tempo speso contato.

Unico giro, semi 7.000.000–7.000.299, 300 per cella e braccio, stessi bot e politiche del passo 2: **A 648.000 partite in 658,138 s,
B 648.000 in 849,394 s**. Otto invarianti a **zero** su 12.182.258 e 12.206.992 turni di giocatore, nessun limite di durata, bound
entro 4, gettoni e copie riconciliati.

| Voce | Secondi |
|---|---:|
| Passo 0 valido A + B | 43,125 |
| Campione B fallito + prova diagnostica a 1 seme | 21,989 |
| Braccio A + braccio B | 1.507,531 |
| Prova D86 (passo 0 A + B) | 48,942 |
| Prova d'identità D88 (passo 0 A + B) | 35,799 |
| **Totale speso nel blocco** | **1.657,385** |

**Residuo D68: 0 giri, 4.682,655 s** ([registro](sb-16g-2b3/budget.json)). Nessuna taratura dopo il giro, nessun rilancio.

### Risultati dei due bracci

Riferimento: passo 2 (P2), stessi semi e bot; confronti appaiati e descrittivi. Quote sulle decisive, patte su tutte le partite.

| Incontro | P2 quota / patte / turni | A | B | B–A quota | Fuori (A e B) |
|---|---|---|---|---:|---|
| Spazienzio–Spazienzio | 50,74% / 2,63% / 8,48 | 51,90% / 2,44% / 9,67 | uguale ad A | 0 | — |
| Spazienzio–Mara | 73,67% / 2,70% / 8,95 | **57,42%** / 2,84% / 9,41 | uguale | 0 | quota |
| Spazienzio–Celestina | 61,41% / 5,19% / 10,97 | **37,25%** / 4,67% / 10,25 | uguale | 0 | quota |
| Spazienzio–Piera | 67,77% / 2,45% / 10,92 | **33,16%** / 1,57% / 10,39 | uguale | 0 | quota |
| Spazienzio–Beppe | 73,86% / 3,11% / 9,40 | **37,61%** / 0,98% / 7,98 | uguale | 0 | quota |
| Mara–Mara | 50,98% / 3,35% / 9,54 | 50,25% / 3,33% / 8,80 | uguale | 0 | — |
| Mara–Celestina | 42,14% / 4,73% / 11,59 | **34,84%** / 4,59% / 9,46 | uguale | 0 | quota |
| Mara–Piera | 61,36% / 5,73% / 11,50 | **39,07%** / 3,81% / 9,54 | **37,70%** / 3,74% / 9,59 | −1,37 | quota |
| Mara–Beppe | 53,67% / 3,05% / 10,13 | **29,32%** / 0,55% / 7,23 | uguale | 0 | quota |
| Celestina–Celestina | 50,40% / 18,32% / 18,68 | 50,20% / 5,35% / **12,98** | uguale | 0 | durata |
| Celestina–Piera | 73,23% / 7,65% / 13,63 | **64,13%** / 6,15% / 10,67 | **61,53%** / 6,73% / 10,91 | −2,60 | quota |
| Celestina–Beppe | 62,98% / 9,47% / 12,56 | **34,43%** / 5,85% / 8,43 | uguale | 0 | quota |
| Piera–Piera | 51,09% / 8,55% / 14,61 | 50,00% / 6,43% / 11,64 | uguale | 0 | — |
| Piera–Beppe | 43,86% / 7,60% / 12,87 | **37,04%** / 0,80% / 8,14 | uguale | 0 | quota |
| Beppe–Beppe | 51,23% / 15,67% / 11,57 | 51,85% / 7,61% / 6,41 | uguale | 0 | — |

**Criteri D16/D51 non raggiunti in nessuno dei due bracci:** 11 incontri su 15 fuori, celle incontro × politiche fuori 90/135 (A)
e 89/135 (B). Patte globali 3,80% / 3,83% (P2 6,68%), turni medi 9,40 / 9,42 (P2 11,69). «uguale» = identico ad A: B cambia
soltanto gli incontri con Piera.

- **Spazienzio:** da dominante a sotto quota. Impatto 30 HIT toglie molto più del previsto: 57,4% contro Mara, 33–38% contro
  Celestina, Piera e Beppe. Partite con un turno da metà salute in sua presenza: **13,76%** (P2 56,79%), finite in quel turno 2,74%
  (P2 6,39%). Annunci per partita 0,902 (P2 0,862).
- **Beppe:** da poco usato a dominante. Annunci per partita **1,529** (P2 0,345), zero annunci solo nell'8,63% delle presenze (P2 78,73%),
  e ora anche con gli euristici: aggressivo 1,751, prudente 1,566, risorse 1,750, com 1,050. 4 CUT effettivi: Preparo 201.969 riuscite
  e 64.646 fallite, Una stretta 77.968 e 51.835; salute tolta media 4,1. Vince contro Spazienzio, Mara, Celestina e Piera;
  specchio rientrato nelle patte (7,61%, P2 15,67%) ma il più breve (6,41 turni).
- **Specchi:** Celestina–Celestina rientra nelle patte (5,35%, P2 18,32%) ma resta lunga, 12,98 turni; Piera–Piera 11,64 turni.
- **Celestina–Piera e Bancone B:** B porta Celestina da 64,13% a 61,53%, ancora fuori quota. Nei turni di Bancone il POISON diretto
  ricevuto da Piera passa, dopo stati e corazza, da 186.695 (A) a 94.649 (B) su 188.232 nominali, il periodico da 113.685 a 55.466.
  Mara–Piera scende a 37,70%; durate e patte degli incontri con Piera quasi invariate (+0,05/+0,24 turni).
- **Turni da metà salute** (definizione del passo 2): partite con almeno uno 13,04% (P2 19,60%), finite in quel turno 2,52% (P2 2,34%).
  Finali in un turno per starter che subisce, A: Spazienzio 2.515, Mara 2.625, Celestina 4.097, Piera 771, Beppe 3.057; carte avversarie
  più frequenti Impatto, Lavoro fatto bene e travaso (per Celestina). Dettagli per incontro, fonti e ragioni terminali delle patte
  nel [riepilogo](sb-16g-2b3/summary.md).
- **Politiche:** ALWAYS batte HOLD_IF_DEFENDED al 50,44% e RANDOM al 53,11%; HOLD_IF_DEFENDED batte RANDOM al 52,70%. RANDOM si
  allontana più che nel passo 2 (51,51%), senza dominanza ampia.
- **Carte poco giocate (A):** Steal sotto il 13% con Mara, Celestina e Beppe; Smontiamo tutto 12,1%; Un assaggino 23,7%. Mazzo esaurito
  Celestina 19,53% e Piera 16,97% (P2 44,18% e 49,59%).

### STOP e proposta

**STOP dopo il commit:** criteri non raggiunti in entrambi i bracci, nessun giro né budget di giro rimasto. Proposta, da approvare prima
di qualsiasi misura:

1. **Braccio da tenere: B.** Il beneficio contro il POISON è visibile (Celestina–Piera −2,60 punti, POISON ricevuto dimezzato nei turni
   di Bancone) e non peggiora alcun criterio. Non riporta però Celestina–Piera in quota.
2. **Spazienzio e Beppe sono la causa principale delle quote fuori.** Una tappa intermedia per Impatto (per esempio 35 HIT) e un
   ridimensionamento dei caricamenti di Beppe (4 CUT solo se trova, oppure Chiave e Lavoro meno forti) sono le leve candidate. Un
   intervento in proposta separata, con funzionamenti da approvare e una misura con budget nuovo, perché D68 è esaurito.
3. **Specchio di Celestina:** patte rientrate, durata ancora 12,98 turni. Da riguardare dopo i punti 1–2, che cambiano i suoi incontri.

### Non verificato e domande numerate

Non eseguiti: Playwright, suite client-web, prova umana, misura FFA, trasferimento vivo. Il bilanciamento non è dichiarato chiuso.
Il codice del giro è stato ricostruito dopo D86 e verificato coi campioni del passo 0 identici byte per byte, non rigiocando il giro.

1. Scegli il **braccio B** (Bancone con POISON ×0,5) come bozza di riferimento, pur con Celestina–Piera ancora fuori quota?
2. Vuoi una **proposta 1.5** solo per Spazienzio (tappa intermedia di Impatto) e Beppe (caricamenti meno forti), con un budget di
   misura nuovo fuori da D68?
3. La **prova umana breve prima di SB-17**, prevista dal piano, va fatta su questa bozza o dopo la 1.5?
4. Va bene lasciare `junkie.ToxicBloodDrain` col parametro facoltativo fino al trasferimento (SB-28), come in D88?

### Comandi riproducibili

Dalla radice, con Java e Maven del checkout come nel [passo 2](sb-16g-2b2-report.md#comandi-riproducibili). Da `server/`, per ogni
braccio (`A`, poi `B`), passo 0 con `-Dsim.chargeGames=4` e giro con `300`:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.chargeGames=300' `
  '-Dsim.arm=A' '-Dsim.chargeOut=../tmp/sb16g2b3/round-A'
```

Aggregazione dalla radice, senza partite: `python docs/reports/set-base/sb-16g-2b3/summarize.py tmp/sb16g2b3/round-A tmp/sb16g2b3/round-B OUT`
(rigenera anche `matrix.md` e `summary.json`, lasciati fuori dal repository per peso). Sonda del verificatore:
`python docs/reports/set-base/sb-16g-2b3/check_rules_probe.py scripts/check-rules.py . OUT.json`, e lo stesso con lo script e la radice
di un export di `5f8c703`. Prova D86 abbandonata: `equivalence.py`. Identità viva: come nel passo 2, nella stessa cartella della fixture.

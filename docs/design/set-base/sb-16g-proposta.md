# SB-16g — Proposta delle carte, passo 3: potenza

**Versione 1.4 — 14 novembre 2026. Motivazione: partire dai risultati del passo 2 e dalle priorità D80, correggere selettivamente potenza e funzionamenti, ripresentare Bancone POISON e prefissare il giro finale a due bracci. Fase A con STOP dopo il commit: solo documenti, nessuna attuazione e nessuna misura.**

La sezione [Passo 3](#passo-3--proposta-corrente-14) è la proposta corrente e sostituisce la tabella di potenza della 1.2, conservata sotto come storico. La 1.3 è stata approvata in D79 e attuata nel passo 2; le sue liste restano ferme. La meccanica del [contratto d50 1.1](sb-16g-2b1-rules.md) resta approvata e invariata. I funzionamenti nuovi della 1.4, compreso il braccio B, richiedono il giudizio del proprietario prima dell'attuazione.

## Perimetro, fonti e riferimento

Questa consegna tocca soltanto questo documento, la riga e la sezione SB-16g del [piano](../../set-base-plan.md#sb-16g--coppie-caricamento-colpo-seconda-passata) e la riga Set Base dell’[indice](../../README.md). Bozza, griglia, contratto d50, regolamento, documenti del set, codice, test, catalogo e client non cambiano. Modifiche contemporanee in `prototipi/carriere` escluse dal commit. Nessun giro di misura, nessun push.

Punto di partenza: [rapporto completo del passo 2](../../reports/set-base/sb-16g-2b2-report.md), con [riepilogo](../../reports/set-base/sb-16g-2b2/summary.md) e [contatori per stile/titolo](../../reports/set-base/sb-16g-2b2/observations.json) dove servono. Vincoli: [D38, D45, D50–D52, D63–D64, D67, D71–D80](../../set-base-plan.md#decisioni-del-proprietario), [criteri D16/D51](../../set-base-plan.md#bilanciamento-metodo-e-criteri) e contratto d50 1.1. I richiami al passo 1 e al consulto nelle sezioni storiche conservano il loro contesto.

Riferimento della 1.4: base `04ac5b6`, [bozza corrente](../../../server/src/test/resources/set-base/bozza.json) del passo 2, cinque personaggi e 76 carte caricate. Nelle tabelle correnti «prima» indica questa bozza, non la 1.2. Le schede e i resoconti della 1.3 conservati sotto sono storici: il loro «oggi» era la base `b0c7ec9` del passo 1.

Il [regolamento 1.13](../../game-rules.md) e il [Set Base 0.1](../../sets/base.md) governano la partita viva. Questa proposta resta nel playground fino a SB-28 (D50). «Annuncia» è già nel contratto 1.1; qui quel file resta intatto. Il trasferimento vivo richiederà versione e motivazione nei documenti normativi; SB-25 userà i testi per chi gioca.

## Decisioni del proprietario applicate

| Decisioni | Vincolo applicato alla proposta |
|---|---|
| D8, D38, D45 | Nessuna risorsa nuova; parole chiave comprensibili ammesse da D78. Numeri tarabili sotto D38; funzionamenti e composizioni richiedono approvazione (D45, punto 7). Nessun atteso cambiato per accettare regressioni. |
| D50, D52 | Ricerca al posto della pesca, ritmo caricare–colpire–parare, difese con premio; costi con risorse possedute, pavimento a zero, corazza L/4 sul solo HIT, gruppi fissati dopo i costi. |
| D59, D65 | Minimo di due turni e precisa copia sono scelte storiche superate da D69/D71/D72, non regole ancora applicabili ai testi. |
| D60–D62 | 120 titoli/slot; in ogni starter 2 copie di un caricamento NC → 2 copie di un colpo NC, più 1 diverso caricamento NC → 1 colpo R. Un solo binding esatto per ricerca. |
| D63 | Risorse sufficienti da zero dopo fine turno; NC affidabile e raro con picco condizionato, senza obbligo di superare il NC alla preparazione minima. Il finanziamento della 1.4 è esplicitato sotto. |
| D64, D66 | Gettoni ×1,5 HIT/CUT/POISON, indipendenti e moltiplicativi; una giocata soddisfa il più vecchio per quel nome. Nessun aumento dei costi né fattore ×2/×3. |
| D67 | Difesa POISON al passo 3, da approvare; immunità a T distinta dal POISON diretto. |
| D68 | Budget unico 2b di tre giri/7.200 s; dopo il passo 2 resta **1 giro/6.340,0406251 s (6.340,041 s)**, intatto in questa consegna. |
| D69 | Gettone sul giocatore legato al nome, non alla copia; conta giocare un’omonima anche parata/annullata, non scartarla. Carta scoperta come vista; fine gruppo e gettone anonimo originari superati. |
| D70 | Nessuna ricerca di oggetti; gettone di due turni a ricerca fallita superato da D72. |
| D71–D73 | Fine turno dopo periodici, uscita un turno dopo l’assenza da mano e mazzo, carta mostrata solo in mano; ripiego senza gettone; niente auto-soddisfazione della ricerca del proprio nome. «Ultimo colpo» paga quanto resta della HEALTH anche sotto il costo, ma nessuna carta qui lo introduce. |
| D74–D75 | Tre passi distinti; prova umana del passo 1 fatta, meccanica approvata. Passo 2 attuato con D79; potenza e difesa POISON richiedono la presente proposta. |
| D76–D77 | Bot letale già consegnato, nuovo in tutte le tre politiche dei passi 2/3; nessuna nuova prova umana preliminare. Preferisce patta a sconfitta, evita di esporsi al colpo mostrato letale; niente mano coperta o pianificazione a più turni. |
| D78 | «Annuncia X» riassume la meccanica comune; premio pieno e ripiego espliciti per carta. Altre parole solo se intuitive e utili su più carte, da approvare. |
| D79–D80 | Liste e rarità ferme; diagnosi nell'ordine Spazienzio, Beppe, rari, specchi. Nessuna applicazione in blocco della 1.2. Ultimo giro con bracci A/B, riferimento passo 2 e nuovo passo 0 sui bracci effettivi. |

## Annuncia X — definizione approvata (D78–D79)

**Annuncia X:** al posto della pesca che segue questa mossa, cerca nel tuo mazzo una carta di nome X, identificata da un solo binding esatto; non può essere un oggetto.

- **Se la trovi:** mettila in mano e mostra quella copia a tutti; applica soltanto i guadagni «Se lo trovi» della carta, dopo la ricerca. Metti su di te un gettone legato al nome X: i danni HIT, CUT e POISON ricevuti sono moltiplicati per **1,5**, compreso il POISON periodico. La vista mostra la copia soltanto mentre è in mano e il relativo gettone esiste; dopo lo scarto resta solo il segnalino col nome.
- **Quando giochi X:** qualunque copia con quel nome, anche parata o annullata, soddisfa soltanto il gettone più vecchio per X già esistente prima della mossa. Gettone e relativo promemoria spariscono **dopo tutti gli effetti di fine turno**, periodici inclusi. La vulnerabilità resta contro ogni gruppo di velocità nel turno della giocata. Una ricerca del proprio nome non soddisfa il gettone che crea; giocare un’altra omonima può far sparire il promemoria della copia trovata ancora in mano.
- **Se X esce senza essere giocata:** lo scarto da solo non soddisfa il gettone. Se a fine turno N il nome manca sia dalla mano sia dal mazzo, il gettone resta per tutto N+1, periodici inclusi, poi cade. Finché esiste una copia in una delle due zone non ha timer; il client già avvisa prima dello scarto dell’ultima copia.
- **Se non la trovi:** pesca normalmente e applica soltanto i guadagni «Se non lo trovi» della carta; nessun nuovo gettone e nessuna carta mostrata. Il ripiego sostituisce il premio pieno, non si somma a esso; non rimuove gettoni già presenti.
- **Più annunci:** gettoni indipendenti, fattori moltiplicati (due ×1,5 danno ×2,25 prima dei troncamenti del percorso R05), senza fusione o tetto speciale; una giocata ne soddisfa uno solo. Pulizia a fine partita, eliminazione e forfait come nel contratto d50 1.1.

**Forma breve:** «Annuncia X. Se lo trovi: +… . Se non lo trovi: +…». Entrambi gli esiti espliciti evitano che «Guadagni … . Annuncia X» sembri dare sempre il premio pieno. Pesca, carta mostrata, gettone e durata stanno nella definizione comune, già approvata e attuata nel contratto d50 1.1.

**Altre parole chiave: nessuna proposta.** «Spendi tutta la tua L», «trasferisci tutta la tua T» e «per ogni tuo oggetto» sono già brevi; «Scarica», «Travasa» o «Attrezza» richiederebbero di ricordare cosa si azzera o conta, senza un risparmio dimostrato su più carte. «Ultimo colpo» resta la dicitura dell’eccezione esistente, non serve qui. Volto «ANNUNCIO», segnalino unico e ×1,5 sull’impatto di B2-a restano indicazioni per il client, fuori perimetro. A9 segnala il rischio di ripetere lo stesso piano su tutto il set: qui si rispettano i cinque starter D61, senza decidere Sergio, Duccio o l’economia delle buste.

## Passo 3 — proposta corrente 1.4

### Diagnosi e leve, nell'ordine D80

**1. Spazienzio: pressione finanziata e frequente, non una ragione per potenziare tutto.** Nel passo 2 vince il **73,67% / 61,41% / 67,77% / 73,86%** delle decisive contro Mara/Celestina/Piera/Beppe, con aumenti di **22,99–26,52 punti** sul passo 1. PAZIENZA +25 V rende Impatto da 40 HIT pagabile anche da V=0 a N+1; prima +15 non bastava. Gli annunci passano da 0,615 a 0,862 per presenza, 123.049 ricerche riuscite sono di PAZIENZA. Il costo aggiuntivo medio del gettone scende da 6,69 a 3,259 danni per ricerca riuscita, mentre il gettone resta 2,244 turni: la preparazione è più accessibile e il prezzo osservato non compensa la pressione. Questo è un meccanismo plausibile, non un'ablazione: cambiano anche liste e bot, senza un braccio che isoli il +25 V.

Con Spazienzio presente, **56,79%** delle presenze ha una partita con un turno da metà salute e **6,39%** una fine in quel turno, contro **19,60% / 2,34%** globali. Non sono percentuali di colpi di Spazienzio: includono danni subiti, costi e periodici. Nominalmente 40 HIT da soli raggiungono metà della salute iniziale 70/75/80, ma non di Piera 85; un bersaglio vulnerabile può subirne 60 prima di altre modifiche. È quindi un segnale di concentrazione del danno, non la prova che ogni finale sia Impatto.

Lo stile conta: annunci per presenza **1,065 aggressivo / 0,029 prudente / 1,433 risorse / 0,920 com**. Dai contatori già prodotti, su 64.800 presenze per stile, le partite finite nel turno da metà salute sono **3.371 / 1.557 / 4.863 / 6.775**; non si può attribuire l'intero fenomeno al solo stile che annuncia di più. Tutte le nove coppie di politiche restano fuori quota contro ciascun altro starter. `com` è il casuale sotto filtro letale, non una quarta euristica né una prova del computer del client.

**Leva minima proposta: solo Impatto 40→30 HIT**, conservando costo 25 V, PAZIENZA +25 V/+15 A, priorità e liste. Toglie il quarto di danno dal colpo ripetibile, conserva D63 e non indebolisce la possibilità di annunciare. Senza stati 30 è sotto metà di tutte le salute iniziali; con ×1,5 restano 45: il rischio non sparisce. È la candidata per il rientro in soglia, **non una previsione di quota misurata**. Non applicare il forte aumento del raro della 1.2. NON GIOCARE COL COLTELLO NO (+10 V e quattro turni di CUT ×0,5) può contribuire contro Mara, ma i dati non ne isolano il contributo: nessun secondo ritocco di Spazienzio proposto senza tale evidenza.

**2. Beppe: l'annuncio compra risorse già abbondanti e rinvia un colpo modesto.** Ha zero annunci nel **78,73%** delle presenze, media **0,345**; per stile **0 / 0 / 0,001 / 1,378**. I contatori chiariscono il limite: aggressivo e prudente non giocano i due annunci; risorse ne risolve **51, tutti falliti** (42 Preparo, 9 Una stretta). Tutte le **51.045** ricerche riuscite appartengono a `com`. Non manca l'occasione di vederli: ciascuno dei primi due stili vede oltre 123.000 copie di Preparo e 62.000 di Una stretta. La media globale nasconde questa selezione.

La bozza parte da **25 V** e i colpi costano solo **5 V**; dopo una ricerca riuscita le medie di V a N+1 sono 37,709/38,568, con **zero occasioni impagabili** della copia trovata. Chiave fa 12 CUT, Lavoro 6–18 HIT secondo gli oggetti, contro **5,387** danni aggiuntivi da gettone per riuscita e un turno di attesa. È coerente con un premio di V poco utile e con euristici senza pianificazione pluriturno; i dati non espongono i punteggi delle mosse e non provano quale peso escluda ciascun annuncio. Aumentare solo la V non risolve questa diagnosi.

**Leva proposta:** Chiave a **22 CUT/10 V**; Lavoro a **14+7 per oggetto HIT/10 V**; **entrambi** i caricamenti infliggono **4 CUT** immediati a un avversario e annunciano come prima, con +15 V per Preparo e +10 V per Una stretta, ripiego +5 V invariato. Così si paga davvero il seguito da zero e l'annuncio ha un'utilità visibile anche nel turno corrente, senza dipendere dalla previsione del mazzo. È un funzionamento da approvare anche per Preparo, non presente nella 1.2. Nessun premio «se cercato» sul colpo, nessuna giocata imposta, nessun cambiamento ai bot o accesso alla mano coperta. La ragionevolezza umana della scelta e l'effettivo uso euristico restano da verificare; non prometto 1–2 annunci per tutti.

**3. Rari intermedi: il costo del rischio deve comprare un picco condizionato.** Cinghiata fa oggi 12 CUT contro Sgommata 25; il travaso da zero trasferisce 0 T ed è giocato nel 17,87% delle partite in cui compare; Rutto da zero fa 5 HIT/−2 A; Lavoro senza oggetti fa 6 HIT. La 1.4 propone Cinghiata **18+A residua/2**, travaso **+12 POISON diretti** con premio +20 T, Rutto **14+2×L residua dopo il costo, poi azzerata**, Lavoro **14+7 per oggetto**. Le soglie sotto mostrano un raro più forte del NC con preparazione sufficiente, ma non automaticamente alla preparazione minima. Per Spazienzio basta conservare il raro attuale: il picco supera il nuovo NC solo accumulando molta V.

**4. Specchi: pressione e differenze di velocità, con cause terminali ancora da separare.** Celestina–Celestina è a **18,32% patte / 18,68 turni**, Beppe–Beppe a **15,67% / 11,57**. Il mazzo risulta esaurito nel 44,18%/48,04% delle presenze dei due starter, non soltanto negli specchi. Celestina è immune al periodico da T, può convertire T in cura e il travaso attuale non offre pressione diretta; Beppe ha pochi colpi efficaci e due annunci quasi ignorati dagli euristici. Questi meccanismi spiegano un possibile percorso verso il finale lungo, ma mancano i conteggi che attribuiscano le patte a simultaneità, autodanno o periodici: non dichiaro già provata la causa.

**Leve proposte:** per Celestina Tossicone **12→18 POISON**, Dose anche **+5 A**, travaso con danno diretto e perdita dell'immunità del bersaglio; per Beppe i colpi/caricamenti sopra e la carta separata Sotto il cofano sotto. Più pressione dovrebbe ridurre l'arrivo alle last resort, +A persistente può separare i gruppi in turni successivi. Aggiungere la stessa priorità a tutte le copie di una last resort non separerebbe uno specchio: non lo propongo. Bancone B non corregge direttamente questi specchi. Cure, salute iniziale, last resort e spareggi restano quelli attuali; l'effetto su patte e durata è un'ipotesi, da controllare per politica e stile.

### Carte che cambiano: prima/dopo e testo breve

Tutte le quantità variabili si leggono dopo i costi, alla risoluzione; divisioni intere. Nessuna priorità cambia. V/A/T/L restano le risorse esistenti. Le copie, i binding e le rarità sono quelli D79: **nessuna sostituzione nei cinque mazzi da 20**, 120 slot e 45 C/55 NC/20 R invariati. Nei due annunci offensivi di Beppe cambia il bersaglio da sé a un avversario; risorse e ricerca restano a sé. I 4 CUT sono indipendenti dall'esito della ricerca, anche fallita; l'annullamento della mossa impedisce tutti gli effetti, una riduzione dei CUT non annulla l'annuncio.

| Carta (binding nelle schede storiche sotto) | Prima, bozza passo 2 | Dopo, proposta 1.4: costo; testo breve | Priorità |
|---|---|---|---:|
| GARGANTUESCO IMPATTO SUL TU | 25 V; 40 HIT | **25 V**; «Infliggi 30 danni da colpo al bersaglio.» | 0 |
| Ti stringo la curva | 0; trova +15 A, manca +5 A | **0**; «Annuncia Cinghiata di traverso. Se lo trovi: +20 A. Se non lo trovi: +5 A.» | 2 |
| Cinghiata di traverso | 5 A; 12 CUT | **20 A**; «Infliggi danni da taglio pari a 18 più metà della tua A residua, arrotondata per difetto.» | 1 |
| Dose in preparazione | 0; trova +10 T, manca +5 T | **0**; «Annuncia Tossicone Scatarrante. Se lo trovi: +10 T, +5 A. Se non lo trovi: +5 T.» | 1 |
| Tossicone Scatarrante | 10 T; 12 POISON, +5 T al bersaglio | **10 T**; «Infliggi 18 danni da veleno al bersaglio. Il bersaglio guadagna 5 T.» | 1 |
| Un assaggino | 0; trova +10 T, manca +5 T | **0**; «Annuncia C'è del sangue nella mia droga. Se lo trovi: +20 T. Se non lo trovi: +5 T.» | 1 |
| C'è del sangue nella mia droga | 10 T; travaso senza danno diretto | **10 T**; «Trasferisci tutta la tua T residua al bersaglio e togligli l'immunità a T. Infliggi anche 12 danni da veleno. A fine turno ottieni l'immunità a T.» | 1 |
| Estasi da Coca Etilene | 0; azzera L, 10+L HIT | **0**; «Spendi tutta la tua L. Infliggi danni da colpo pari a 18 più la L spesa.» | 1 |
| Rutto a distanza sociale | 5 L; −A pari a L residua, 5 HIT, conserva L | **5 L**; «Spendi tutta la tua L residua. Il bersaglio perde A pari alla L spesa. Infliggi danni da colpo pari a 14 più il doppio della L spesa.» | 1 |
| Preparo il lavoro | 0; su sé, trova +10 V, manca +5 V | **0**; «Infliggi 4 danni da taglio al bersaglio. Annuncia Chiave da tredici. Se lo trovi: +15 V. Se non lo trovi: +5 V.» | 1 |
| Chiave da tredici | 5 V; 12 CUT | **10 V**; «Infliggi 22 danni da taglio al bersaglio.» | 1 |
| Una stretta di prova | 0; su sé, trova +10 V, manca +5 V | **0**; «Infliggi 4 danni da taglio al bersaglio. Annuncia Lavoro fatto bene. Se lo trovi: +10 V. Se non lo trovi: +5 V.» | 1 |
| Lavoro fatto bene | 5 V; 6+4 per oggetto HIT | **10 V**; «Infliggi danni da colpo pari a 14 più 7 per ogni tuo oggetto sul campo.» | 1 |
| Sotto il cofano — separata, fuori dalle dieci coppie | 5 V; HIT ricevuto ×0,5, CUT ×0,75 nel turno; +5 V | **5 V**; «In questo turno moltiplica per 0,5 i danni da colpo e per 0,75 quelli da taglio che ricevi. Guadagni 5 V e 5 A.» | 2 |
| Il bancone regge, io pure — **solo B**, fuori dalle coppie | 0; HIT ricevuto ×0,5 nel turno; +5 L | **0**; «In questo turno moltiplica per 0,5 i danni da colpo e da veleno che ricevi. Guadagni 5 L.» | 2 |

**Sotto il cofano, proposta separata motivata:** `base.gigi.SottoIlCofano`, C ×1 già nel mazzo. Si aggiungono soltanto **+5 A** al premio persistente; il +5 V compensa già il costo e non differenzia le velocità. Il +A mira alle patte dello specchio senza indebolire il già debole Beppe né alterare la V iniziale approvata in D45. Non cambia i gruppi già fissati nel turno della difesa; può cambiarli dal turno successivo. Non è una correzione dimostrata dai contatori: è la candidata fuori coppia da giudicare esplicitamente, inclusa in entrambi i bracci se approvata. Se non approvata, si ridefiniscono i bracci prima del passo 0, senza sostituirla in corsa con una modifica di last resort o personaggio. Nessun'altra carta fuori coppia di Spazienzio/Beppe proposta.

Il travaso conserva il timer attuale: dopo il periodico l'immunità è data **all'autore**, non restituita al bersaglio. La T del bersaglio può essere curata/azzerata o cambiare prima del periodico; immunità alla risorsa e POISON diretto restano distinti. Rutto memorizza la L dopo il costo e prima dell'azzeramento: danno e −A usano lo stesso valore, la corazza è persa alla risoluzione. La perdita di A non riordina i gruppi del turno (D50). Lavoro conta oggetti realmente sul campo, compresi token; equip consumati non contano. Non sommo i 4 CUT del caricamento al colpo successivo come se fossero un unico picco.

### Finanziamento da zero a N+1 e picchi nominali della 1.4

N è il turno del caricamento; N+1 il primo turno utile. Salute positiva, nessuna interferenza/spesa intermedia, immunità iniziali; V/A/T/L pertinenti a zero e nessun oggetto, salvo dove indicato. Per Mara L=0; per Piera L=A=0. R06 su Piera sottrae `L//2` A e poi `L//2+1` L, con pavimento a zero. V/T non decadono; Celestina è immune al periodico. Sono **conti documentali, non nuove misure**. «Picco nominale» qui è il danno della carta prima di stati, corazza e limite della salute, in condizioni dichiarate: non un massimo assoluto raggiungibile.

| Coppia | Premio pieno; risorse a N+1 da zero | Costo; residuo/effetto da zero | Preparazione e picco nominale; confronto NC/R |
|---|---|---|---|
| PAZIENZA → Impatto | +25 V/+15 A; V=25/A=15 | 25 V; V=0, **30 HIT** | NC fisso 30, nessun aumento del premio. |
| TI FACCIO SPAZIO → SPEDIAMOTI | +15 V/+15 A; V=15/A=15 | 10 V; V=5, **8 HIT** | Formula attuale 6+V/2 conservata: coi 25 V iniziali fa 21; con V=60 prima del costo, residuo 50, fa **31>30**. Il raro supera NC solo da residuo V≥50; accumularla costa turni e rischio. |
| Slalom → Sgommata | +15 A; A=15 | 15 A; A=0, **25 CUT** | NC fisso 25; nessun aumento di Slalom. |
| Ti stringo → Cinghiata | +20 A; A=20 | 20 A; A=0, **18 CUT** | Con 40 A iniziali conservati: residuo 40, **38 CUT**. Supera NC 25 da A residua≥16; al minimo è inferiore. |
| Dose → Tossicone | +10 T/+5 A; T=10/A=5 | 10 T; T=0, **18 POISON**, +5 T al bersaglio | NC diretto 18, periodico solo se non immune; il +5 A resta a N+1. |
| Un assaggino → travaso | +20 T; T=20 | 10 T; trasferisce 10 T, **12 POISON diretti** | Su bersaglio inizialmente immune a T e a T=0: 12+5 periodici=**17<18** nello stesso turno. Con i 15 T iniziali conservati trasferisce 25, totale **12+12=24>18** dopo rimozione dell'immunità, senza altre modifiche. Nello specchio il totale supera il diretto NC 18 se T totale del bersaglio dopo il travaso≥14; contro non immuni va incluso anche il periodico dei +5 T del NC, non solo 18. Confronto del totale diretto+periodico, non del solo diretto; possibili periodici futuri non sono garantiti. |
| Un altro → Estasi | +15 L/+35 A; L=7/A=28 | 0; azzera 7 L, **25 HIT** | Dai valori iniziali L=10/A=15: L=12/A=38, **30 HIT**. Conserva la linearità, non il maggior carico L della 1.2. |
| Prima il brindisi → Rutto | +15 L/+35 A; L=7/A=28 | 5 L; memorizza/azzera L=2, **18 HIT/−2 A** | Dai valori iniziali: 28 HIT/−7 A, contro Estasi 30. A L=15 prima del costo fa **34 HIT/−10 A**, contro NC 33; supera NC da L pre-costo≥15. Richiede altra preparazione, non soltanto il minimo di Brindisi. |
| Preparo → Chiave | +15 V, 4 CUT al bersaglio a N; V=15 a N+1 | 10 V; V=5, **22 CUT** | NC fisso 22, indipendente dagli oggetti; i 4 CUT di N sono separati. |
| Una stretta → Lavoro | +10 V, 4 CUT al bersaglio a N; V=10 a N+1 | 10 V; V=0, **14 HIT** senza oggetti | **14/21/28/35 HIT** con 0/1/2/3 oggetti: supera i 22 nominali del NC da 2 oggetti, senza equip. Con Guanti ×1,25 e 3 oggetti effettivamente presenti, 35→43 HIT; consumare Guanti libera un oggetto, quindi questa compresenza richiede di riempire di nuovo il posto. HIT/CUT e difese possono cambiare il confronto effettivo. |

I dieci caricamenti hanno costo **0** e picco proprio nullo, salvo i due di Beppe a **4 CUT**; quindi sono giocabili da risorse a zero, purché esista un bersaglio legale. I ripieghi restano quelli del passo 2 su entrambi i titoli di ogni personaggio: SPA +5 V/+5 A, MAR +5 A, TOS +5 T, PIN +5 L/+10 A (a N+1 L=2/A=8), GIG +5 V. Non devono finanziare il colpo mancato: dopo l'aumento dei costi, +5 A non basta più per Cinghiata e +5 V non basta più per Chiave/Lavoro. Fallire pesca e non crea un gettone; i 4 CUT di Beppe restano anche se la ricerca fallisce, con un premio di risorse nettamente inferiore alla riuscita. L'utilità del ripiego e il rischio di preferire il fallimento vanno misurati, non corretti ora con un premio segreto.

Per le due difese fuori coppia non si applica un annuncio: **Sotto il cofano da V=0 non è pagabile**, richiede 5 V prima della scelta (il guadagno non anticipa il costo). Dopo Preparo da zero ha 15 V, paga/riguadagna 5, a N+1 conserva V=15 e +5 A se L=0, senza aver soddisfatto il gettone; picco danno 0. **Bancone da zero è gratuito**, dà +5 L e dopo R06 lascia L=2/A=0 a N+1; picco danno 0. In B la riduzione comprende il POISON periodico del turno, non periodici successivi. Nessuna promessa di sopravvivenza o pagamento dopo altre spese.

### Destino di ciascuna proposta della 1.2

| Coppia della tabella 1.2 storica | Resta, cambia o cade nella 1.4 | Motivo |
|---|---|---|
| Spazienzio NC: +25 V/+15 A, 40 HIT | **Cambia:** premio resta, 40→30 HIT | Leva singola sul danno ripetibile dominante; non annullare il finanziamento D63. |
| Spazienzio R: +35 V/+5 A, 20+V/2 | **Cade l'aumento:** restano gli attuali +15 V/+15 A e 6+V/2, 10 V | Non rafforzare chi è già al 61–74%; il picco condizionato esiste anche senza l'aumento. |
| Mara NC: +20 A, 25 CUT/15 A | **Cade il +5 A:** restano +15 A e colpo attuale | Finanziamento già sufficiente; Mara è sopra quota contro Piera. |
| Mara R: +30 A, 20+A/2 CUT/20 A | **Cambia:** +20 A e base 18; restano costo 20 A e dipendenza da A | Dà un minimo sotto NC e un picco preparato sopra, con meno velocità gratuita. |
| Celestina NC: +10 T/+5 A, 18 POISON/+5 T | **Resta** | Pressione diretta contro l'immunità periodica dello specchio, più possibilità di differenziare A. |
| Celestina R: +20 T, travaso+12 POISON | **Resta** | Il diretto dà valore subito, il picco maggiore richiede T preparata; rischio cura/durata da osservare. |
| Piera NC: +25 L/+35 A, 18+L HIT | **Cambia:** resta base 18 e azzeramento, carico resta agli attuali +15 L/+35 A | Evita più corazza e più perdita di A gratuita in incontri già lunghi; migliora il colpo senza accumulo aggiuntivo. |
| Piera R: +35 L/+35 A, 20+2L HIT, −A, azzera L | **Cambia:** carico resta +15 L/+35 A, base 14; restano costo 5 L, ×2L, −A e azzeramento | D63 con picco condizionato, senza i 44 HIT minimi della 1.2 né altra corazza da carico. |
| Beppe NC: +15 V, 22 CUT/10 V | **Cambia:** resta il profilo numerico, aggiunge 4 CUT anche a Preparo | Più V da sola non affronta la mancata scelta euristica; utilità immediata e seguito più efficace. |
| Beppe R: +10 V e 4 CUT, 14+7 per oggetto HIT/10 V | **Resta** | Premio immediato leggibile e picco sopra NC da due oggetti; non buffare solo la V già abbondante. |

I funzionamenti da approvare sono quindi formula/costo Cinghiata, danno diretto del travaso, memoria/azzeramento/formula Rutto, Preparo offensivo oltre a Una stretta, premio A di Sotto il cofano e Bancone B. Gli altri cambi sono numeri di effetti già presenti. L'eventuale attuazione dovrà mantenere previsione e motore concordi sui nuovi effetti pubblici, senza allargare la vista dei bot; un supporto generale non previsto richiede STOP con proposta, non un ampliamento implicito del blocco.

### Giro finale D80: due bracci, un solo giro

**A = tutte le modifiche di potenza 1.4 approvate**, compreso Sotto il cofano separato; Bancone attuale solo HIT. **B = identico A più Bancone POISON D67**, descritto nella [sezione dedicata](#d67--difesa-candidata-contro-il-poison-solo-passo-3). Fra A e B deve cambiare soltanto quell'effetto. Il riferimento è il **passo 2 già misurato**, non un terzo braccio rigiocato. Se il proprietario cambia/rifiuta una carta, si registra prima la proposta risultante: nessuna combinazione scelta guardando i risultati del passo 0.

Disegno prefissato: **300 semi per cella per braccio**, semi **7.000.000–7.000.299**, 15 incontri inclusi gli specchi, quattro stili, tre politiche con bot D76–D77, tutti gli incroci e posti alternati del passo 2. **2.160 celle/648.000 partite per braccio, 1.296.000 in totale**; due bracci eseguiti in sequenza, otto thread come il passo 2. È **un unico giro**, non un giro per braccio o per carta. Stessi semi/bot consentono confronti appaiati descrittivi A–passo 2, B–passo 2 e B–A; non si trattano i totali come osservazioni indipendenti. Nessuna ablazione aggiuntiva né ricerca di numeri.

**Nuovo passo 0 obbligatorio sui due bracci effettivi e sul loro osservatore finale:** 4 semi per cella, gli stessi primi quattro del giro, **8.640 partite per braccio / 17.280 totali**, otto thread in sequenza. Come nel passo 2 il campione di fattibilità non consuma un giro D68; per prudenza si richiede che **anche il suo tempo stia nel residuo**, senza chiedere tempo aggiuntivo. Sia `s0` la somma dei tempi dei due campioni: si procede solo se **s0 + (75 × 1,5 × s0) + 120 ≤ 6.340,0406251 s**. Il fattore 75 porta da 4 a 300 semi, 1,5 e 120 s sono margini conservativi; è una regola di stima futura, non una misura di questa consegna. Non si deduce la fattibilità dai 738 s del passo 2: cambiano entrambi i bracci e i contatori. Sforamento della stima, invarianti/bound rossi o discrepanze nella previsione: **STOP con dati e proposta**, senza tagliare semi, eliminare un braccio o usare gli esiti per tarare le carte. Durante il giro vale comunque il limite cumulativo residuo; un braccio mancante rende il confronto incompleto.

Prima delle partite serviranno verifiche mirate di dati/testi, finanziamento, nuovi effetti e fedeltà previsione–motore; non sono qui eseguite. Il rapporto finale dovrà distinguere suite unitarie, contesto Spring/avvio, identità della partita viva e bilanciamento. Consegne ed evidenze nei limiti del contratto dell'esecutore, senza modificare soglie o attesi per accettare regressioni.

Conservare tutti i contatori del passo 2 per titolo/stile/politica: visto/giocato/risolto, riuscita/fallita (già in mano/consumato solo al banco), NC/R, 0/1/2/3+ annunci, prima occasione legale, impagabilità, uso del ripiego, gettoni/durate/uscite e danni aggiuntivi, esaurimenti, quantili della durata, IC delle celle, invarianti e bound. In più occorre rendere leggibili:

- **Turni da metà salute e finali nello stesso turno:** conservare la definizione netta del passo 2 (perdita inizio–fine ≥ metà HEALTH iniziale, compresi costi/autodanno/periodici e sottratte le cure). Pubblicare numeratori/denominatori per incontro, starter, stile e politica, presenza del gettone, nome del colpo e danni diretti/periodici/autodanno separati. Contare anche i turni-evento per giocatore e i sottoinsiemi che terminano la partita; non confondere «partita con Spazienzio» con «danno causato da Impatto».
- **Finale in un turno:** la misura storica sopra non significa «KO da almeno metà salute». Aggiungere separatamente inizi con HEALTH ≥ metà iniziale che arrivano a zero nel turno, fine partita e vincitore/patta, con gruppi/velocità e fonti del danno; niente modifica retroattiva del contatore storico.
- **Specchi e Beppe:** ragione terminale delle patte (gruppo simultaneo, autodanno, periodico, eventuale limite), esaurimento e uso di last resort, distribuzione di A/gruppi nel finale e passaggi per Sotto il cofano. Per i due annunci offensivi, 4 CUT effettivi per riuscita/fallita, frequenza distinta dei tre euristici rispetto a `com`; non usare la media casuale per dichiarare risolto lo scarso uso.
- **Effetto B:** POISON diretto/periodico ricevuto e ridotto nei turni di Bancone, quota Celestina–Piera, tenuta dei colpi e durata/patte di tutti gli incontri con Piera. Separare danno nominale e dopo stati/corazza; nessun nuovo dato nascosto ai bot.

**Cancello finale invariato D16/D51:** 45–55% fra base (Spazienzio–Mara), 40–60% negli altri incontri non speculari, circa 6–12 turni, patte ≤10% in ogni incontro/specchio; controllo delle nove coppie di politiche e degli stili, nessuna carta quasi sempre/quasi mai, pochi esaurimenti, zero turni senza mosse legali, otto invarianti a zero, bound ≤4. Non invento soglie numeriche per i due criteri qualitativi o per i nuovi contatori. Una media globale verde non sana una cella fuori criterio; gli IC e il dettaglio servono al giudizio, non ad allentare i limiti.

Se uno dei bracci soddisfa tutti i criteri si presenta quel risultato al proprietario; se entrambi li soddisfano, B si propone solo se il beneficio contro POISON è visibile senza peggiorare i criteri, altrimenti si propone A. Se nessuno li soddisfa o il confronto è incompleto, **STOP con dati, incertezze e proposta al proprietario: nessun rilancio, altra taratura o altro giro**. Un braccio parzialmente migliore non viene dichiarato bilanciato. Anche un risultato verde richiede il giudizio umano finale prima di SB-17.

### Incertezze e domande della 1.4

Non sono misurati il rientro di Spazienzio con 30 HIT, l'uso euristico dei due annunci offensivi, il calo delle patte dovuto a +A/pressione né il beneficio netto di Bancone B. Restano possibili più cure da T, nuovi picchi su bersagli vulnerabili, un raro di Spazienzio ancora poco appetibile e una difesa B che allunga le partite. Le differenze A–passo 2 includeranno più carte insieme: non proveranno il contributo causale di ogni singola leva. Sotto il cofano è la candidata meno sorretta da contatori causali; il giro dovrà esporne il limite, senza correggerla in corsa. Comprensibilità e interesse umano non sono deducibili dalle sole frequenze.

1. **Approvi Impatto 40→30 HIT come unica leva su Spazienzio**, con PAZIENZA e raro attuali, accettando che il rientro in soglia resti da verificare?
2. **Approvi i due caricamenti offensivi di Beppe** (4 CUT anche a ricerca fallita, premi/ripieghi indicati), Chiave 22 CUT/10 V e Lavoro 14+7 per oggetto/10 V, senza modificare i bot?
3. **Approvi Cinghiata, travaso, Estasi e Rutto con i costi/formule/premi della 1.4**, oltre a Dose/Tossicone, e i picchi condizionati esplicitati invece dell'applicazione in blocco della 1.2?
4. **Approvi separatamente Sotto il cofano +5 A**, fuori dalle coppie, e **Bancone POISON solo nel braccio B**, periodico del turno incluso e CUT pieno?
5. **Approvi il disegno concreto del giro finale e del nuovo passo 0**, due bracci a semi/bot identici, limite unico di 1 giro/6.340,041 s e STOP senza rilancio se fattibilità o criteri non tornano?

### Verifiche della consegna 1.4

Solo i tre documenti autorizzati. Base di partenza `04ac5b6`, `main`; fetch riuscito, alla partenza HEAD avanti di un commit su origin/main, nessun remoto da integrare. Durante il lavoro sono arrivati commit della sessione carriere nello stesso checkout, senza cambiamenti ai tre file di questo blocco. Working tree già modificato da quella sessione: file esclusi da letture di contenuto, modifiche e commit. Nessun server/processo altrui toccato; nessuna misura. Python 3.13.0 già presente in `%TEMP%/bm-sb16g-proposta-python-3.13.0/python.exe`, usato senza download dopo l'indicazione del proprietario di cercare un interprete sulla macchina.

**Verifiche verdi:** `python scripts/check-rules.py` (regolamento 1.13, Set Base 0.1, copie client, allegato, SQLite e R02 coerenti), `python scripts/check-links.py` (**305 file, 0 link rotti**), `git diff --check`. Nessun rosso documentale; i rossi di bilanciamento del passo 2 restano aperti e non vengono rimisurati. Non eseguiti per il perimetro esplicito: suite server/client, Spring, avvio applicativo, Playwright, passo 0, giri o prove umane. Nessun bilanciamento o avvio dichiarato riuscito. **STOP dopo il commit; i numeri e i funzionamenti sono una proposta da approvare.**

## Passo 2 — separazione dalla potenza

**Storico 1.3, approvato in D79 e attuato nel passo 2.** Le schede, la tabella 1.2 e i conti del passo 2 qui sotto documentano le tappe precedenti; la proposta corrente di potenza è soltanto la 1.4 sopra. Le quattro domande originarie in fondo sono già state risposte in D79.

**Proposta da approvare:** conservare danni, formule, costi, priorità ed effetti secondari attuali dei dieci colpi. Conservare i guadagni attuali dei caricamenti esistenti e riusare il profilo del personaggio per i nuovi, **con una sola eccezione necessaria a D63**: PAZIENZA da +15 a **+25 V**, lasciando +15 A, perché Impatto costa 25 V. È l’aumento della 1.2 anticipato per finanziare da zero senza cambiarne il costo; su Spazienzio la misura non isolerà quindi la sola frequenza. TI FACCIO SPAZIO può invece usare +15 V/+15 A, sufficienti al costo 10 V.

I nuovi caricamenti riusano i ripieghi del passo 1 del personaggio, senza ricalcolare un terzo sul premio proposto. Una stretta di prova **non infligge ancora 4 CUT**: anche quel danno resta al passo 3. Le rare Cinghiata, travaso e Rutto possono ancora essere deboli nella tappa intermedia; la rarità non ne aumenta da sola i numeri. I picchi D63 si completano nel passo 3.

**Effetto atteso, qualitativo e da misurare:** tre caricamenti per starter aumentano le occasioni di annuncio, ma sostituire attacchi o cure con preparazioni può anche allungare la partita; nessuna riduzione di patte o durata è già dimostrata. Spazienzio perde una copia del raro e finanzia davvero Impatto; Mara perde una Cinghiata economica e uno Spintone, quindi ha meno attacchi immediati. Celestina perde una Rincorsa: più ricerca del travaso può significare più T per curarsi, senza correggere lo specchio. Piera perde una Fasciatura, ma più L dà anche corazza e consuma A. Beppe perde due Mattoni e raddoppia il caricamento verso Chiave: cambia la pressione da oggetti e dai colpi immediati. Il filtro letale può inoltre evitare caricamenti che esporrebbero al KO, riducendo la frequenza teorica. Questi rischi richiedono la misura del passo 2 prima di giudicare la potenza finale.

Le dieci schede sono dei **caricamenti**; ciascuna specifica il colpo, per dieci ricerche e venti titoli coinvolti. V/A/T/L sono le risorse del regolamento; quantità variabili dopo il costo, alla risoluzione, divisioni intere. Guadagni/perdite successivi di A non riordinano i gruppi.

### 1. PAZIENZA: FINITA — Spazienzio

**SPA-AR3**, `bruiser.Glare`; **2 copie, NC** (oggi 2 C). Gratuita, priorità 0, bersaglio sé.

> Annuncia GARGANTUESCO IMPATTO SUL TU. Se lo trovi: +25 V, +15 A. Se non lo trovi: +5 V, +5 A.

**Colpo:** SPA-AR1, `bruiser.SuperImpact`; **NC ×2 (oggi C)**; costo **25 V**, priorità 0, un avversario. Testo attuale: «Infliggi 40 danni da colpo al bersaglio.»

Da zero V=25 a N+1: paga esattamente 25. Sola anticipazione numerica necessaria a D63; danno invariato.

### 2. TI FACCIO SPAZIO — Spazienzio

**nuovo SPA-AR6**, `base.bruiser.TiFaccioSpazio`; **1 copia, NC** (ID proposto). Gratuita, priorità 0, bersaglio sé.

> Annuncia SPEDIAMOTI DUNQUE IN O-AHIO. Se lo trovi: +15 V, +15 A. Se non lo trovi: +5 V, +5 A.

**Colpo:** SPA-AR2, `bruiser.ExtremelyViolentBlow`; **R ×1 (oggi 2 R)**; costo **10 V**, priorità 1, un avversario. Testo attuale: «Infliggi danni da colpo pari a 6 più metà della tua V residua, arrotondata per difetto.»

Da zero, dopo il costo V=5: **8 HIT**. Conservando i 25 V iniziali V=30: **21 HIT**. Conserva l’anticipo, senza promettere il picco della 1.2.

### 3. Slalom d'avvicinamento — Mara

**MAR-AR5**, `base.mara.Slalom`; **2 copie, NC** (oggi 1 R). Gratuita, priorità 2, bersaglio sé.

> Annuncia Sgommata. Se lo trovi: +15 A. Se non lo trovi: +5 A.

**Colpo:** MAR-AR2, `base.mara.Sgommata`; **NC ×2 (oggi C)**; costo **15 A**, priorità 1, un avversario. Testo attuale: «Infliggi 25 danni da taglio al bersaglio.»

A L=0 i 15 A restano a N+1; dopo il costo A=0. Non si anticipa +20 A.

### 4. Ti stringo la curva — Mara

**nuovo MAR-AR6**, `base.mara.TiStringoLaCurva`; **1 copia, NC** (ID proposto). Gratuita, priorità 2, bersaglio sé.

> Annuncia Cinghiata di traverso. Se lo trovi: +15 A. Se non lo trovi: +5 A.

**Colpo:** MAR-AR1, `base.mara.CinghiataDiTraverso`; **R ×1 (oggi 2 C)**; costo **5 A**, priorità 1, un avversario. Testo attuale: «Infliggi 12 danni da taglio al bersaglio.»

Da zero resta A=10 dopo il costo. Cambiano rarità e copie; formula variabile e costo 20 A restano al passo 3: non ha ancora il picco superiore a Sgommata.

### 5. Dose in preparazione — Celestina

**TOS-AR1**, `junkie.MethDrivenRage`; **2 copie, NC** (oggi 2 C). Gratuita, priorità 1, bersaglio sé.

> Annuncia Tossicone Scatarrante. Se lo trovi: +10 T. Se non lo trovi: +5 T.

**Colpo:** TOS-AR2, `junkie.Cough`; **NC ×2 (oggi C)**; costo **10 T**, priorità 1, un avversario. Testo attuale: «Infliggi 12 danni da veleno al bersaglio. Il bersaglio guadagna 5 T.»

T non decade; Celestina è inizialmente immune al suo periodico. Da zero paga 10 T. Niente +5 A o 18 POISON della 1.2. Immunità a T distinta dal POISON diretto.

### 6. Un assaggino — Celestina

**nuovo TOS-AR6**, `base.tossico.UnAssaggino`; **1 copia, NC** (ID proposto). Gratuita, priorità 1, bersaglio sé.

> Annuncia C'è del sangue nella mia droga. Se lo trovi: +10 T. Se non lo trovi: +5 T.

**Colpo:** TOS-AR5, `junkie.ToxicBloodDrain`; **R ×1**; costo **10 T**, priorità 1, un avversario. Testo attuale: «Trasferisci tutta la tua T residua al bersaglio e togligli l’immunità a T. A fine turno ottieni l’immunità a T.»

Memorizza T dopo il costo, azzera quella dell’autore e trasferisce il valore. Il timer attuale dà immunità **all’autore**, dopo il periodico, non la restituisce al bersaglio. **Nessun POISON diretto aggiunto.** Da zero paga ma trasferisce 0 T; conservando i 15 T iniziali trasferisce 15 T. Il periodico dipende dalla T del bersaglio: finanziare non equivale a rendere forte il raro.

### 7. Un altro e arrivo — Piera

**PIN-AR4**, `base.pino.OffroIo`; **2 copie, NC** (oggi 2 NC). Gratuita, priorità 1, bersaglio sé.

> Annuncia Estasi da Coca Etilene. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A.

**Colpo:** PIN-AR2, `base.pino.GoingBerserk`; **NC ×2 (oggi C)**; costo **0**, priorità 1, un avversario. Testo attuale: «Spendi tutta la tua L. Infliggi danni da colpo pari a 10 più la L spesa.»

«Spendi» è un effetto: memorizza e azzera L, non richiede L positiva e toglie la corazza alla risoluzione. Da L=A=0, dopo R06 L=7/A=28 a N+1: **17 HIT**.

### 8. Prima il brindisi — Piera

**nuovo PIN-AR6**, `base.pino.PrimaIlBrindisi`; **1 copia, NC** (ID proposto). Gratuita, priorità 1, bersaglio sé.

> Annuncia Rutto a distanza sociale. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A.

**Colpo:** PIN-AR5, `base.pino.RuttoADistanzaSociale`; **R ×1**; costo **5 L**, priorità 1, un avversario. Testo attuale: «Il bersaglio perde A pari alla tua L residua. Infliggi 5 danni da colpo al bersaglio.»

**Non azzera L** nel passo 2. Da zero L=7/A=28 a N+1; dopo il costo L=2: −2 A e **5 HIT**. Dai valori iniziali L=10/A=15 arriva a L=12/A=38; dopo il costo L=7: −7 A e 5 HIT. Aspettando L decade ancora e può non bastare più; scartare non libera subito, ma vale l’uscita D71 se il nome manca da entrambe le zone.

### 9. Preparo il lavoro — Beppe

**GIG-AR3**, `base.gigi.ColpoDiChiaveInglese`; **2 copie, NC** (oggi 1 C). Gratuita, priorità 1, bersaglio sé.

> Annuncia Chiave da tredici. Se lo trovi: +10 V. Se non lo trovi: +5 V.

**Colpo:** GIG-AR2, `base.gigi.ChiaveDaTredici`; **NC ×2 (oggi C)**; costo **5 V**, priorità 1, un avversario. Testo attuale: «Infliggi 12 danni da taglio al bersaglio.»

Ricerca **cambiata da Lavoro fatto bene a Chiave da tredici**. Da zero V=10 a N+1, paga 5 e conserva 5. Indipendente dagli oggetti, danno e costo attuali.

### 10. Una stretta di prova — Beppe

**nuovo GIG-AR6**, `base.gigi.UnaStrettaDiProva`; **1 copia, NC** (ID proposto). Gratuita, priorità 1, bersaglio sé.

> Annuncia Lavoro fatto bene. Se lo trovi: +10 V. Se non lo trovi: +5 V.

**Colpo:** GIG-AR5, `base.gigi.LavoroFattoBene`; **R ×1**; costo **5 V**, priorità 1, un avversario. Testo attuale: «Infliggi danni da colpo pari a 6 più 4 per ogni tuo oggetto sul campo.»

Da zero V=10, paga 5; con 0/1/2/3 oggetti fa **6/10/14/18 HIT** prima degli stati. Token sul campo contano, equip già consumati no; furto/distruzione/consumo prima del gruppo cambiano il conto. I 4 CUT e il bersaglio avversario della 1.2 sono solo per il passo 3: qui il caricamento è su sé e non attacca.

## Tabella riassuntiva delle dieci carte — solo passo 2

Guadagni alternativi dopo la ricerca; costi e danni dei colpi sono quelli della bozza attuale.

| Nome | Rarità; copie | Testo breve | Costo caricamento; guadagno riuscita / fallita | Colpo cercato; rarità e costo |
|---|---|---|---|---|
| PAZIENZA: FINITA | NC; 2 | Annuncia GARGANTUESCO IMPATTO SUL TU. Se lo trovi: +25 V, +15 A. Se non lo trovi: +5 V, +5 A. | 0; +25 V, +15 A / +5 V, +5 A | GARGANTUESCO IMPATTO SUL TU; NC ×2 (oggi C); 25 V |
| TI FACCIO SPAZIO | NC; 1 | Annuncia SPEDIAMOTI DUNQUE IN O-AHIO. Se lo trovi: +15 V, +15 A. Se non lo trovi: +5 V, +5 A. | 0; +15 V, +15 A / +5 V, +5 A | SPEDIAMOTI DUNQUE IN O-AHIO; R ×1 (oggi 2 R); 10 V |
| Slalom d'avvicinamento | NC; 2 | Annuncia Sgommata. Se lo trovi: +15 A. Se non lo trovi: +5 A. | 0; +15 A / +5 A | Sgommata; NC ×2 (oggi C); 15 A |
| Ti stringo la curva | NC; 1 | Annuncia Cinghiata di traverso. Se lo trovi: +15 A. Se non lo trovi: +5 A. | 0; +15 A / +5 A | Cinghiata di traverso; R ×1 (oggi 2 C); 5 A |
| Dose in preparazione | NC; 2 | Annuncia Tossicone Scatarrante. Se lo trovi: +10 T. Se non lo trovi: +5 T. | 0; +10 T / +5 T | Tossicone Scatarrante; NC ×2 (oggi C); 10 T |
| Un assaggino | NC; 1 | Annuncia C'è del sangue nella mia droga. Se lo trovi: +10 T. Se non lo trovi: +5 T. | 0; +10 T / +5 T | C'è del sangue nella mia droga; R ×1; 10 T |
| Un altro e arrivo | NC; 2 | Annuncia Estasi da Coca Etilene. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. | 0; +15 L, +35 A / +5 L, +10 A | Estasi da Coca Etilene; NC ×2 (oggi C); 0 |
| Prima il brindisi | NC; 1 | Annuncia Rutto a distanza sociale. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. | 0; +15 L, +35 A / +5 L, +10 A | Rutto a distanza sociale; R ×1; 5 L |
| Preparo il lavoro | NC; 2 | Annuncia Chiave da tredici. Se lo trovi: +10 V. Se non lo trovi: +5 V. | 0; +10 V / +5 V | Chiave da tredici; NC ×2 (oggi C); 5 V |
| Una stretta di prova | NC; 1 | Annuncia Lavoro fatto bene. Se lo trovi: +10 V. Se non lo trovi: +5 V. | 0; +10 V / +5 V | Lavoro fatto bene; R ×1; 5 V |

## Passo 3 — potenza della 1.2, proposta separata e non attuata

**Storico 1.2, superato dalla proposta corrente 1.4.** Si conserva la tabella e il testo originario per confrontare le scelte; nessuna di queste righe autorizza l'attuazione o prevale sulla 1.4. Alla consegna 1.3 questi valori erano separati dal passo 2 e ancora da approvare. Il loro destino, riga per riga, è dichiarato nella sezione corrente sopra.

| Coppia | Premio pieno del caricamento nella 1.2 | Colpo proposto per il passo 3 | Differenza dal passo 2 |
|---|---|---|---|
| Spazienzio NC | +25 V, +15 A | 25 V, priorità 0, 40 HIT | Nessun altro aumento: finanziamento anticipato per D63. |
| Spazienzio R | +35 V, +5 A | 10 V, priorità 1, **20 + V residua/2 HIT** | Da +15 V/+15 A e base 6. |
| Mara NC | +20 A | 15 A, priorità 1, 25 CUT | Da +15 A; danno invariato. |
| Mara R | +30 A | **20 A**, priorità 1, **20 + A residua/2 CUT** | Da +15 A, costo 5 A e 12 CUT fissi. |
| Celestina NC | +10 T, +5 A | 10 T, priorità 1, **18 POISON** e +5 T al bersaglio | Aggiunge A, da 12 a 18 POISON. |
| Celestina R | +20 T | 10 T, priorità 1, travaso attuale **più 12 POISON diretti** | Da +10 T; danno diretto nuovo, distinto dal periodico. |
| Piera NC | +25 L, +35 A | Gratuito, priorità 1, **18 + L HIT**, azzera L | Da +15 L e base 10. |
| Piera R | +35 L, +35 A | 5 L, priorità 1, **20 + 2×L residua HIT**, −A pari a quella L, **azzera L** | Da +15 L e 5 HIT, L memorizzata dopo il costo. |
| Beppe NC | +15 V | **10 V**, priorità 1, **22 CUT** | Da +10 V, costo 5 V e 12 CUT. |
| Beppe R | +10 V **e 4 CUT all’avversario** | **10 V**, priorità 1, **14 + 7 per oggetto HIT** | Caricamento offensivo su avversario; da costo 5 V e formula 6+4 per oggetto. |

**Testi dei funzionamenti nuovi, solo passo 3:** Cinghiata «Infliggi danni da taglio pari a 20 più metà della tua A residua, arrotondata per difetto»; travaso aggiunge «Infliggi anche 12 danni da veleno al bersaglio»; Rutto «Spendi tutta la tua L residua dopo il costo. Il bersaglio perde A pari alla L spesa. Infliggi danni da colpo pari a 20 più il doppio di quella L». Una stretta di prova aggiunge «Infliggi 4 danni da taglio al bersaglio» fuori dagli esiti della ricerca: come nella 1.2 il danno è un effetto della mossa anche a ricerca fallita, mentre +10 V e +5 V sono alternativi. Se annullata, la mossa non dà effetti; una parata dei soli CUT non annulla il resto. Nessun bonus nascosto «se cercato» sui colpi, che funzionano anche se pescati normalmente.

**Picchi nominali conservati dalla 1.2, non simulati:** da zero dopo caricamento e R06, Spazienzio R 32 HIT (45 conservando i 25 V iniziali), Mara R 25 CUT (45 conservando i 40 A iniziali); Celestina R trasferisce 10 T (25 conservando i 15 T iniziali), più 12 POISON diretti e periodico dipendente dal bersaglio. Piera NC 30 HIT (35 dai valori iniziali L=10/A=15), R 44 HIT/−12 A (54 HIT/−17 A dai valori iniziali). Beppe R 14/21/28/35 HIT con 0/1/2/3 oggetti, oltre ai 4 CUT del turno precedente. Lavoro con Guanti attivi può arrivare a 43 HIT prima degli stati del bersaglio, ma consumare Guanti riduce gli oggetti sul campo: non si presume la compresenza del massimo. Il raro non deve sempre superare il NC al minimo di preparazione.

Nel passo 3 serviranno una variante di bozza del travaso con POISON diretto parametrico e una del Rutto che memorizzi L prima di azzerarla: leggere L dopo `empty L` vedrebbe zero. Estasi e Lavoro hanno già parametri base/per-oggetto. Costi tecnici dichiarati, senza cambiare silenziosamente classi vive. Se emergesse una modifica generale del motore non prevista, il passo 0 dovrà dichiararla e fermarsi su quel punto.

## D67 — Difesa candidata contro il POISON, solo passo 3

**Proposta corrente 1.4, braccio B soltanto.** D67 ha approvato la valutazione; D79 ne ha mantenuto la separazione dal passo 2 e D80 il confronto a due bracci. Il funzionamento qui descritto deve ancora essere approvato. In A la carta resta esattamente quella della bozza del passo 2.

### Il bancone regge, io pure — PIN-AR3

**Binding:** `base.pino.IlBanconeRegge`. **Copie:** 2, già nello starter di Piera. **Rarità:** C, invariata. **Costo:** gratuito. **Priorità:** 2. **Bersaglio:** sé. **Ricerca:** nessuna. **Vulnerabilità propria:** nessuna. **Durata delle riduzioni:** solo il turno corrente, fino al suo fine turno compreso.

**Testo proposto per il passo 3, invariato rispetto alla 1.2:**

> In questo turno moltiplica per 0,5 i danni da colpo e da veleno che ricevi. Guadagni 5 L.

Rispetto alla bozza si aggiunge soltanto lo stato GOOD INPUT POISON ×0,5 per il turno. Restano HIT ×0,5, gratuità, priorità 2 e guadagno di 5 L anche se nessuno attacca. Il CUT resta pieno; non si aggiunge una cura. La difesa vale anche sul POISON periodico da T nel fine turno corrente, perché quello attraversa gli stati INPUT: restringerla ai soli danni delle carte richiederebbe un filtro diverso, che non propongo.

**Perché questa carta:** Piera è sotto quota contro Celestina e ha già due copie della difesa, quindi non serve aggiungere uno slot o distribuire la stessa generica a tutti. Una protezione gratuita resta giocabile anche quando A è a zero. Conserva il premio previsto da D52/D67 e la possibilità di difendersi nel turno dopo il caricamento, mantenendo il colpo cercato e la relativa vulnerabilità. Il +5 L può finanziare un seguito più forte, ma la L continua a decadere e non soddisfa il gettone: serve giocare il nome corrispondente, oppure l’uscita D71 dopo che il nome manca da mano e mazzo.

**Esempi nominali del passo 3:** Tossicone proposto da 18 POISON diventa 9 senza altri stati. Se una vulnerabilità ×1,5 è già presente prima del Bancone, il percorso 18→27→13 lascia 13 anziché 27, per il troncamento R05. Il periodico da T=20 scende da 10 a 5 prima di altre modifiche. La corazza dell'alcol non riduce POISON: non viene sommata impropriamente a questi esempi. Rutto, immunità alla risorsa T e azzeramenti di T non vengono alterati dalla difesa.

**Impatto da misurare nel passo 3:** ridurre il vantaggio di Celestina contro Piera (**73,23%** delle decisive nel passo 2, non una previsione della difesa), offrire una risposta leggibile all'annuncio di Tossicone/travaso e rendere possibile tenere il colpo in mano a un prezzo sostenibile. Non migliora la difesa di Piera al CUT di Mara, favorita al **61,36%** nel passo 2. Non modifica direttamente gli specchi di Celestina o Beppe. Può aumentare durata e patte degli incontri con Celestina; può inoltre migliorare la difesa contro il timer del Mescolone. **B–A isola soltanto questa estensione**, con potenza identica e liste D79 ferme; non si attribuiscono a Bancone le differenze A–passo 2. Il proprietario deve approvare questa carta prima dell’eventuale modifica; l’inclusione della sola valutazione in D67 non basta. Nessuna estensione al POISON già attuata.

## Liste complete e conto delle 120 carte

Liste e sostituzioni ricontrollate sulla bozza corrente il 14 novembre 2026. Le liste seguenti contano **solo le 20 regolari**; personaggio, basic fissa, due bound diverse del personaggio e last resort restano separati e invariati (R02 1.12). Nessun titolo ha più di due copie. «Archetipo» segue lo slot progettuale, non il package Java. I nomi propri sono quelli visualizzati nella bozza; gli ID interni Tossico/Pino/Gigi restano riferimenti tecnici.

| Starter | Archetipo | Generiche | Oggetti |
|---|---|---|---|
| Spazienzio | GARGANTUESCO IMPATTO SUL TU 2; SPEDIAMOTI DUNQUE IN O-AHIO 1; PAZIENZA: FINITA 2; NON GIOCARE COL COLTELLO NO 2; FAI BASTA 2; TI FACCIO SPAZIO 1 (**10**) | GABBIANO DUNQUE VOLIAMOTI 2; Tartaruga sul marciapiede 2; Mattone del cantiere 1; ORMALE GUARIAMOTI 1; Denti stretti 1 (**7**) | Negroni Trovato per Terra 2; Posacenere di vetro 1 (**3**) |
| Mara | Cinghiata di traverso 1; Sgommata 2; Sorpasso in curva 2; Tra due paraurti 2; Slalom d'avvicinamento 2; Ti stringo la curva 1 (**10**) | Spintone 1; Sputo da posacenere 2; Tartaruga sul marciapiede 1; Steal 1 (**5**) | Espresso del distributore 2; Panino del kebab dimenticato 2; Giubbotto di finta pelle 1 (**5**) |
| Celestina | Dose in preparazione 2; Tossicone Scatarrante 2; Metabolismo Corrotto 2; Riflessi Aumentati dalla Speed 2; C'è del sangue nella mia droga 1; Un assaggino 1 (**10**) | Grab 2; Rincorsa dal marciapiede 1; Steal 1; Fasciatura col fazzolettaccio 1 (**5**) | Pasticca trovata sul bancone 2; Panino del kebab dimenticato 2; Mescolone Micidiale 1 (**5**) |
| Piera | Testata da ultimo giro 2; Estasi da Coca Etilene 2; Il bancone regge, io pure 2; Un altro e arrivo 2; Rutto a distanza sociale 1; Prima il brindisi 1 (**10**) | Grab 2; Spintone 2; Fasciatura col fazzolettaccio 1 (**5**) | Amaro nel bicchiere di plastica 2; Peroni da 66, calda 2; Tennents Super 1 (**5**) |
| Beppe | Smontiamo tutto 2; Chiave da tredici 2; Preparo il lavoro 2; Sotto il cofano 1; Lavoro fatto bene 1; Una stretta di prova 1 (**9**) | Steal 2; GABBIANO DUNQUE VOLIAMOTI 1; Spintone 1 (**4**) | Guanti da officina 2; Giubbotto di finta pelle 2; Casco da lavoro 2; Espresso del distributore 1 (**7**) |

I titoli distinti finali sono **13, 13, 13, 12, 13**: maggiore varietà rispetto all'indicazione iniziale di dodici, senza aumentare le copie totali o violare il massimo due. Gli attacchi/difese/contromosse personali non vengono sostituiti da una sola sequenza obbligata.

**Nuovi titoli nel pool:** esclusivamente SPA-AR6 TI FACCIO SPAZIO, MAR-AR6 Ti stringo la curva, TOS-AR6 Un assaggino, PIN-AR6 Prima il brindisi e GIG-AR6 Una stretta di prova, tutti NC. I dieci bersagli sono carte di slot già esistenti; Cinghiata e Rutto saranno riprogettate nel passo 3, senza aggiungere titoli; nel passo 2 conservano gli effetti attuali. Le generiche tolte o ridotte negli starter restano disponibili nel pool; Mattone non viene cancellato dal set.

| Categoria di slot | Progetto precedente | Proposta |
|---|---:|---:|
| Azioni d'archetipo | 37 | **42** |
| Azioni generiche | 23 | **23** |
| Personaggi / basic / bound / last resort / oggetti | 7 / 7 / 21 / 4 / 16 | **Invariati** |
| Totale, token escluso | 115 | **120** |

**Rarità dell'intero progetto:** conteggio della griglia attuale **54 C / 41 NC / 20 R**. Otto carte passano C→NC: Impatto, PAZIENZA: FINITA, Sgommata, Dose, Tossicone, Estasi, Chiave e Preparo. Slalom passa R→NC e Cinghiata C→R; si aggiungono cinque nuove NC. Il risultato è **45 C / 55 NC / 20 R = 120**. Il numero di rare non cresce; cambia la loro distribuzione fra gli slot di Mara. La maggioranza di NC è una conseguenza esplicita dello schema approvato, da accettare insieme alle carte o da compensare in un altro blocco; questa proposta non inventa compensazioni sulle carte delle buste non esaminate.


| Starter | Sostituzioni rispetto a oggi | Totale; titoli distinti | Copie C / NC / R proposte |
|---|---|---|---|
| Spazienzio | +1 TI FACCIO SPAZIO; SPEDIAMOTI 2→1 | 10+7+3=20; 12→13 | 10 / 9 / 1 |
| Mara | Slalom 1→2; +1 Ti stringo la curva; Cinghiata 2→1; Spintone 2→1 | 10+5+5=20; 12→13 | 12 / 7 / 1 |
| Celestina | +1 Un assaggino; Rincorsa 2→1 | 10+5+5=20; 12→13 | 11 / 7 / 2 |
| Piera | +1 Prima il brindisi; Fasciatura 2→1 | 10+5+5=20; 11→12 | 13 / 6 / 1 |
| Beppe | Preparo 1→2; +1 Una stretta di prova; Mattone 2→0 | 9+4+7=20; 13→13 | 10 / 9 / 1 |

Sono le stesse sostituzioni della 1.2, ancora da approvare. Restano tutte le difese e contromosse personali; Mattone esce solo dallo starter di Beppe, non dal pool. Nella tappa a potenza attuale Cinghiata è già R.

| Starter | Basic fissa | Due bound diverse, invariate | Last resort invariata |
|---|---|---|---|
| Spazienzio | `com.basic.BruiserGrab` | `bruiser.character.LittleRage`; `bruiser.character.LittleSmack` | `com.last.Struggle` |
| Mara | `base.mara.PresoAlVolo` | `base.mara.bound.PassoStretto`; `base.mara.bound.CambioMarcia` | `com.last.Struggle` |
| Celestina | `com.basic.ToxicGrab` | `junkie.character.PatheticBlade`; `base.tossico.bound.RaschiareIlFondo` | `junkie.LethalHeroinDose` |
| Piera | `base.pino.QuestoLoFiniscoIo` | `base.pino.bound.CinqueMinutiEVado`; `base.pino.bound.SpallataAlBancone` | `base.pino.UltimoGiro` |
| Beppe | `base.gigi.QuestoTornaUtile` | `base.gigi.bound.UnaStrettaEPassa`; `base.gigi.bound.ColpoDiCacciavite` | `com.last.Struggle` |

Le 120 sono **titoli/slot**, non copie nei mazzi: 7 personaggi + 7 basic + 21 bound + 4 last resort + 42 archetipo + 23 generiche + 16 oggetti, token escluso. Il sottoinsieme caricato passerebbe da **76 a 81 voci** personaggio/carta coi cinque nuovi titoli: il progetto include anche slot non ancora attuati di Sergio, Duccio e buste. Salute, risorse iniziali, capacità, immunità e dotazioni iniziali restano invariate.

## Verifica del finanziamento da zero — passo 2

N è il turno del caricamento, N+1 il primo utile per il colpo. Risorse richieste a zero, HEALTH positiva, immunità iniziali del personaggio, senza oggetti, altre spese o interferenze; per Piera L=A=0, per Mara L=0. V e T non decadono; Celestina è immune al periodico di T. Per Piera R06 sottrae `L//2` A, poi `L//2 + 1` L, con pavimento a zero. Nessuna promessa di sopravvivere a ogni attacco o di finanziare dopo altre spese.

| Caricamento → colpo | Premio pieno | Disponibile a N+1 | Costo attuale | Residuo dopo costo; effetto attuale nominale |
|---|---|---|---|---|
| PAZIENZA → Impatto | +25 V, +15 A | V=25, A=15 | 25 V | V=0; 40 HIT |
| TI FACCIO SPAZIO → SPEDIAMOTI | +15 V, +15 A | V=15, A=15 | 10 V | V=5; 8 HIT a priorità 1 |
| Slalom → Sgommata | +15 A | A=15 | 15 A | A=0; 25 CUT |
| Ti stringo la curva → Cinghiata | +15 A | A=15 | 5 A | A=10; 12 CUT |
| Dose → Tossicone | +10 T | T=10 | 10 T | T=0; 12 POISON e +5 T al bersaglio |
| Un assaggino → travaso | +10 T | T=10 | 10 T | T=0 trasferita; toglie immunità, nessun POISON diretto |
| Un altro → Estasi | +15 L, +35 A | L=7, A=28 | 0 | Memorizza e azzera L=7; 17 HIT |
| Prima il brindisi → Rutto | +15 L, +35 A | L=7, A=28 | 5 L | L=2 conservata; −2 A al bersaglio e 5 HIT |
| Preparo → Chiave | +10 V | V=10 | 5 V | V=5; 12 CUT |
| Una stretta → Lavoro | +10 V | V=10 | 5 V | V=5; 6/10/14/18 HIT con 0/1/2/3 oggetti |

Tutti i costi sono finanziati nel caso nominale D63. **Non tutti i rari superano i NC** nella tappa intermedia: il travaso da zero non aggiunge T al bersaglio. Nasconderlo con i numeri della 1.2 confonderebbe frequenza e potenza. La tabella è aritmetica sulle regole, non simulazione.

**Ripieghi del passo 1, proposti su entrambi i caricamenti di ciascun personaggio:**

| Personaggio | Guadagno a ricerca fallita | Disponibile a N+1 da zero | Finanzia da solo il colpo mancato? |
|---|---|---|---|
| Spazienzio | +5 V, +5 A | V=5, A=5 | No: né Impatto 25 V né raro 10 V. |
| Mara | +5 A | A=5, con L=0 | Solo Cinghiata 5 A se già in mano; non Sgommata 15 A. |
| Celestina | +5 T | T=5 | No: entrambi costano 10 T. |
| Piera | +5 L, +10 A | L=2, A=8 | Estasi è gratuita; non basta per Rutto 5 L. |
| Beppe | +5 V | V=5 | Sì, ai costi attuali di entrambi, se già in mano; nessun colpo consegnato. |

La ricerca guarda il mazzo, non la mano: può fallire col colpo già in mano oltre che consumato. Per Mara e Beppe il ripiego può finanziare un colpo già posseduto senza nuovo gettone; è una proprietà del contratto, non una certezza di vantaggio. Vicino al KO fallire può essere il male minore. Non si ritocca D72 qui: premio pieno, accesso al colpo e rischio vanno confrontati nel passo 2.

## Evidenze attuali, misure future e incertezze

**Storico della consegna 1.3:** le misure e i programmi seguenti si riferiscono al passo 1 e al passo 2 allora futuro. Il riferimento e il budget correnti della 1.4 sono nella nuova sezione Passo 3, basati sul passo 2 consegnato.

Il passo 1 misura **648.000 partite**, 15 incontri inclusi gli specchi, quattro stili e tre politiche su semi condivisi. Questi numeri vengono dal rapporto, **non dalla composizione proposta**; gli aggregati sono descrittivi, non altrettante osservazioni indipendenti.

| Personaggio | Fallite / ricerche | Danno avversario col gettone / ricerca riuscita | Di cui danno aggiuntivo da gettone | Ripiego conservato |
|---|---|---|---|---|
| Spazienzio | 23,38% | 20,41 | 6,69 | +5 V/+5 A |
| Mara | 26,23% | 18,17 | 5,77 | +5 A |
| Celestina | 40,86% | 16,07 | 5,19 | +5 T |
| Piera | 41,60% | 13,04 | 4,44 | +5 L/+10 A |
| Beppe | 59,94% | 16,66 | 5,27 | +5 V |

L’amplificazione è ricalcolata sullo stesso evento togliendo il solo gettone, con ordine, troncamenti e corazza invariati; non è la differenza fra partite rigiocate. Nel passo 1 patte globali **6,881%**, specchi Celestina **19,32%**, Piera **14,38%**, Beppe **9,56%**; turni dei primi due **18,27** e **15,52**. Fuori dal 40–60% Spazienzio–Celestina (38,42%), Mara–Piera (67,71%), Celestina–Piera (74,39%), Celestina–Beppe (65,67%); Spazienzio–Mara al 48,04%, nel 45–55%. Sei incontri oltre 12 turni. Zero invarianti violate e bound entro 4 non significano bilanciamento chiuso.

**Bot di oggi, D76–D77:** con sola vista pubblica e previsione del turno restringe le mosse alla migliore possibilità di restare in piedi contro un colpo mostrato e pagabile; fra queste preferisce un KO certo, compresa la patta se cade comunque. Evita anche un caricamento che renderebbe letale quel colpo. Considera stati, gettoni, corazza, costi, gruppi, periodico e varianti incerte. Non legge mosse pendenti, mano coperta o ordine del mazzo e non pianifica oltre il turno. Le politiche «sempre», «tieni dopo difesa pubblica nel turno precedente», «caso» operano entro le possibilità rimaste: il caso non è più casuale su tutte le mosse legali senza filtro letale.

Il confronto del bot (288.000 partite, ALWAYS, fuori budget D68) dà **52,64%** delle decisive al nuovo contro il vecchio. Nuovo–nuovo **6,37%** patte, specchi Celestina **18,19%**, Piera **14,10%**. Amplificazione aggregata **4,91** contro **4,86** danni per ricerca riuscita; coi soli nuovi, per personaggio **6,21 / 5,30 / 4,49 / 3,72 / 4,64**. Non è una nuova matrice delle tre politiche né una misura della 1.3: non sostituisce le celle del passo 1. Il modesto aumento medio non prova irrilevante il rischio di KO. D77 esclude una nuova prova umana preliminare contro il bot.

**Passo 2, un giro entro il residuo D68:** bot nuovi in tutte le tre politiche di `ChargeMeasureTest`, quattro stili, posti alternati e semi confrontabili. La previsione deve leggere nuovi caricamenti e due esiti di risorse. Base documentata: passo 1; riferimento del confronto con bot nuovi, senza attribuire alle sole carte differenze dovute al bot. Un eventuale braccio con composizione precedente e bot nuovi va prefissato e contato nello stesso giro e tempo, non diventa un giro gratuito. Registrare:

- caricamenti visti, rimasti in mano, giocati e risolti per titolo; ricerche riuscite/fallite/non eseguite con denominatori separati, NC e raro singolo distinti; nella sola diagnostica del banco, colpo già in mano distinto da colpo consumato;
- colpi trovati giocati al primo turno legale, tenuti, impagabili, parati/annullati o scartati; annunci per partita e distribuzione 0/1/2/3+, non solo media, per l’obiettivo umano «una o due volte»;
- premio pieno/ripiego e risorse effettive a N+1, spese altrove, utilità del ripiego col colpo già in mano (Mara/Beppe); nessuna informazione nascosta aggiunta ai bot;
- gettoni creati, soddisfatti/restanti, durata e uscita D71; danno avversario totale e aggiuntivo per ricerca riuscita, POISON diretto/periodico e autodanno separati, finestre chiuse dal fine partita comprese;
- quote sulle decisive, patte su tutte le partite per incontro/specchio e politica, turni/quantili, mazzi esauriti, mosse legali e invarianti; turni da metà salute e finali nello stesso turno con la definizione del passo 1. Potenza e difesa si valutano nel passo 3.

**Non stimato con certezza:** frequenza effettiva di 1–2 annunci per partita, fallimenti delle nuove coppie 2→2/1→1, costo medio del gettone dopo le sostituzioni, utilità dei rari/ripieghi e nuove quote/patte/durate. Non estrapolo 59,94% di Beppe o 41,60% di Piera al nuovo titolo raro: cambiano copie, destinazioni, scelte e durata. Non propongo stime numeriche aggiuntive; il passo 2 misurerà questi esiti come sopra. Aritmetica dei costi, copie e rarità sono invece deterministiche. Comprensibilità a freddo e interesse della scelta restano giudizi umani. Nel passo 3 potenza e D67 vanno confrontati separatamente entro il giro previsto, senza un nuovo giro per ogni carta o ablazione.

Criteri **D16/D51 invariati:** **45–55% fra starter base, 40–60% negli altri incontri, circa 6–12 turni, patte ≤10% in ogni incontro/specchio**, pochi mazzi esauriti, nessuna carta quasi sempre o quasi mai giocata, zero turni senza mosse legali, otto invarianti a zero e bound entro 4. Una media globale verde non sana una cella fuori soglia. Residuo totale passi 2+3 **2 giri / 7.078,042 s**, intatto. Se criteri o budget non tornano, STOP con dati e proposta. Dopo la sequenza resta il giudizio umano prima di SB-17; non si riapre il cancello preliminare escluso da D77.

## Cambi rispetto alla 1.2 e motivo

**Storico: modifiche della 1.3 rispetto alla 1.2.**

| Cambio | Motivo |
|---|---|
| «Annuncia» definita una volta, dieci schede brevi con due guadagni alternativi | D78; elimina paragrafi ripetuti e premio pieno apparentemente incondizionato. Nessun’altra parola senza beneficio chiaro. |
| Fine turno dopo periodici, nome, vista solo in mano, uscita D71, nessun gettone a ricerca fallita | Elimina residui superati D59/D65/D69/D70 in schede, rischi e domande; coerenza con d50 1.0 e D75. |
| Danni/costi/effetti attuali nel passo 2; aumenti 1.2 nel passo 3 | D74, frequenza distinta da potenza. Niente nuovo danno a travaso/caricamento Beppe o azzeramento L nel Rutto nel passo 2. |
| Guadagni attuali o riusati per i nuovi titoli, solo PAZIENZA +25 V anticipata | Evita di anticipare tutti gli aumenti; unica eccezione D63 esplicita, con limite di attribuzione nelle misure. |
| Ripieghi concreti del passo 1 sui dieci caricamenti | D72 già tarata come partenza: +5 V/+5 A, +5 A, +5 T, +5 L/+10 A, +5 V. |
| Bot nuovo nelle tre politiche, nessuna prova preliminare aggiunta | D76–D77 già attuati; meccanica approvata D75, carte concrete no. |
| Sostituzioni/liste e 45 C/55 NC/20 R riconfermate | Nessuna nuova sostituzione; 120 slot distinti dalle 76 voci caricate. Maggioranza NC dichiarata. |
| D67 invariata come carta, solo riferimenti e uscita aggiornati | Resta al passo 3; corretto ciò che decisioni e misure successive rendono obsoleto. |
| Verifiche e budget aggiornati alla consegna presente | Rimossi vecchio stato 2a e vecchio link rotto dal resoconto corrente; nessuna attribuzione alla 1.3 di misure/avvii non fatti. |

## Verifiche e limiti di questa consegna

**Storico: esiti della consegna 1.3.** La ricerca dell'interprete e gli esiti attuali della 1.4 sono riportati nella sezione corrente; nessun download in questa sessione.

Base `b0c7ec9`, branch `main`, fetch riuscito: HEAD avanti di 3 commit su origin/main, nessun commit remoto da integrare. Working tree già modificato dall’altra sessione in `prototipi/carriere`, come dichiarato nel prompt; nessun reset/rebase o inclusione di quei file. Nessun server, porta o processo altrui toccato.

**Verifiche:** `python scripts/check-rules.py` verde (regolamento 1.13, Set Base 0.1, copie client, allegato, SQLite e R02 coerenti); `git diff --check` verde. `python scripts/check-links.py` globale: **302 file, 8 link rotti**, tutti nel file **non tracciato** `docs/design/carriere/mockup-principale.md` comparso durante la lavorazione parallela; nessuno nei tre documenti di questo blocco. Firma: catture mancanti alle righe 48, 73–76, 81–82 e 84 (`p-o-01-mappa-intera.jpg`, `p-o-02-giro-a-torneo-perso.jpg`, `p-o-03-giro-b-dietro-a-grappino.jpg`, `p-o-04-s2-dopo-f1.jpg`, `p-o-05-giro-c-notte.jpg`, `p-v-01-mappa-intera.jpg`, `p-v-03-giro-b-dietro-a-grappino.jpg`, `p-giro-bacheca.webm`). Confronto eseguito sulla base `b0c7ec9` esportata in `%TEMP%/bm-sb16g-links-base-44eaf9736cef4cbfb082be8e6a1b2d1f/checkout`: **301 file, 0 link rotti**. È un rosso esterno della lavorazione parallela, non una regressione del blocco né una voce Rn preesistente; il file non è nella base o nel commit. Registro dei rossi non modificato perché fuori dal perimetro esplicito dei tre documenti.

Python portatile 3.13.0 dal sito ufficiale in `%TEMP%/bm-sb16g-proposta-python-3.13.0`, perché `python` non è nel PATH e `py` non trova installazioni; nessuna installazione o dipendenza nel repository. Conteggi ricontrollati con calcolo documentale in memoria su bozza e griglia, senza scrivere una bozza alternativa. Controllo mirato dei tre documenti: 0 link rotti.

Non eseguiti per il perimetro documentale: suite server/client, contesto Spring completo, avvio applicativo, Playwright, giri, FFA o nuove prove umane. Non si dichiarano avvio riuscito o bilanciamento raggiunto. Nessun atteso, soglia, durata, bozza o carta viva modificati. Residuo D68 intatto.

**STOP dopo il commit: nessuna carta inserita nella bozza. Il proprietario approva una proposta concreta; questa consegna non avvia i passi 2 o 3.**

## Domande numerate al proprietario

**Storico 1.3: tutte approvate in D79 il 14 novembre 2026 («Approvo tutto»).** Le domande ancora da giudicare sono le cinque della 1.4 nella sezione corrente.

1. **Approvi la forma breve «Annuncia X. Se lo trovi: … . Se non lo trovi: …» e la definizione unica?** È il comportamento d50 1.0 approvato, con fine turno, uscita D71 e ripiego senza nuovo gettone; nessun’altra parola proposta.
2. **Approvi dieci schede del passo 2 con danni/costi attuali, ripieghi del passo 1 e sola anticipazione PAZIENZA +15→+25 V necessaria per D63?** Nuovi caricamenti col premio attuale del personaggio; Cinghiata R a 12 CUT, travaso da zero di 0 T, Rutto a 5 HIT senza azzerare L, Una stretta senza 4 CUT. È una tappa di frequenza, non certifica il picco raro finale; l’effetto di PAZIENZA non sarà attribuibile alla sola frequenza.
3. **Approvi sostituzioni e cinque liste da 20, 120 slot e 45 C / 55 NC / 20 R?** Difese/contromosse personali restano; escono le copie indicate, senza cancellare generiche dal pool né compensare NC su slot non esaminati.
4. **Confermi potenza della 1.2 e Bancone contro POISON come proposte separate per il passo 3?** Formula/costo Cinghiata, +12 POISON al travaso, azzeramento/formula Rutto e 4 CUT del caricamento Beppe richiedono il giudizio sul funzionamento prima dell’attuazione; questa domanda non li anticipa nel passo 2.

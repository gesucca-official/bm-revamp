# SB-16g — Proposta aggiornata delle carte prima di 2b

**Versione 1.3 — 14 novembre 2026. Motivazione: applicare D71–D78 alle dieci schede, definire «Annuncia» una volta sola e separare frequenza (passo 2, danni attuali) da potenza e difesa POISON (passo 3). Proposta 1.3 consegnata, in attesa di approvazione. Fase A con STOP: solo documenti, nessuna attuazione.**

La meccanica del [contratto d50 1.0](sb-16g-2b1-rules.md) è approvata (D75); carte concrete e sostituzioni richiedono ancora il giudizio del proprietario. D78 approva «Annuncia», non i numeri delle carte. Gli aumenti della 1.2 restano proposti nella sezione del passo 3.

## Perimetro, fonti e riferimento

Questa consegna tocca soltanto questo documento, la riga e la sezione SB-16g del [piano](../../set-base-plan.md#sb-16g--coppie-caricamento-colpo-seconda-passata) e la riga Set Base dell’[indice](../../README.md). Bozza, griglia, contratto d50, regolamento, documenti del set, codice, test, catalogo e client non cambiano. Modifiche contemporanee in `prototipi/carriere` escluse dal commit. Nessun giro di misura, nessun push.

Fonti: [decisioni D8–D78](../../set-base-plan.md#decisioni-del-proprietario), [criteri D16/D51](../../set-base-plan.md#bilanciamento-metodo-e-criteri), [griglia](griglia.md), [passo 1](../../reports/set-base/sb-16g-2b1-report.md), [bot letale](../../reports/set-base/sb-16g-bot-letale-report.md), consulto nelle sole parti [A5-a](../../reports/set-base/consulto-design-fable-2026-11-13.md#a5-ricerca-colpi-annunciati-e-vulnerabilità-d58d70), [B2-a](../../reports/set-base/consulto-design-fable-2026-11-13.md#b2-leggibilità-di-carte-e-risoluzione), [A9](../../reports/set-base/consulto-design-fable-2026-11-13.md#a9-profondità-a-lungo-termine-set-e-rarità) e [C3-3](../../reports/set-base/consulto-design-fable-2026-11-13.md#c3-cosa-cambierei-prima-della-2b).

Riferimento ricontrollato su `b0c7ec9`: [bozza corrente](../../../server/src/test/resources/set-base/bozza.json), SHA-256 dei byte `53fa5ea67a2821dee7d979bc24f09a44c7c9b58c3dd98d1550f035355da9bd79`. Il JSON è semanticamente identico alla [bozza misurata nel passo 1](../../reports/set-base/sb-16g-2b1/draft.json); il diverso hash del rapporto deriva dalla serializzazione. I valori «oggi» sotto vengono da questo file, non dalle schede superate. Il sottoinsieme caricato ha cinque personaggi e 71 carte, non tutti i 115 slot progettuali.

Il [regolamento 1.13](../../game-rules.md) e il [Set Base 0.1](../../sets/base.md) governano la partita viva. Questa proposta resta nel playground fino a SB-28 (D50). «Annuncia» andrà riportata nel contratto del playground durante l’attuazione approvata (D78); qui quel file resta intatto. Il trasferimento vivo richiederà versione e motivazione nei documenti normativi; SB-25 userà i testi per chi gioca.

## Decisioni del proprietario applicate

| Decisioni | Vincolo applicato alla 1.3 |
|---|---|
| D8, D38, D45 | Nessuna risorsa nuova; parole chiave comprensibili ammesse da D78. Numeri tarabili sotto D38; funzionamenti e composizioni richiedono approvazione (D45, punto 7). Nessun atteso cambiato per accettare regressioni. |
| D50, D52 | Ricerca al posto della pesca, ritmo caricare–colpire–parare, difese con premio; costi con risorse possedute, pavimento a zero, corazza L/4 sul solo HIT, gruppi fissati dopo i costi. |
| D59, D65 | Minimo di due turni e precisa copia sono scelte storiche superate da D69/D71/D72, non regole ancora applicabili ai testi. |
| D60–D62 | 120 titoli/slot; in ogni starter 2 copie di un caricamento NC → 2 copie di un colpo NC, più 1 diverso caricamento NC → 1 colpo R. Un solo binding esatto per ricerca. |
| D63 | Risorse sufficienti da zero dopo fine turno; NC affidabile e raro con picco condizionato come direzione finale. Il passo 2 conserva la potenza attuale, senza promettere già il picco finale dei rari. |
| D64, D66 | Gettoni ×1,5 HIT/CUT/POISON, indipendenti e moltiplicativi; una giocata soddisfa il più vecchio per quel nome. Nessun aumento dei costi né fattore ×2/×3. |
| D67 | Difesa POISON al passo 3, da approvare; immunità a T distinta dal POISON diretto. |
| D68 | Budget unico 2b di tre giri/7.200 s; dopo il passo 1 restano **2 giri/7.078,042 s** (7.078 s arrotondati), intatti in questa consegna. |
| D69 | Gettone sul giocatore legato al nome, non alla copia; conta giocare un’omonima anche parata/annullata, non scartarla. Carta scoperta come vista; fine gruppo e gettone anonimo originari superati. |
| D70 | Nessuna ricerca di oggetti; gettone di due turni a ricerca fallita superato da D72. |
| D71–D73 | Fine turno dopo periodici, uscita un turno dopo l’assenza da mano e mazzo, carta mostrata solo in mano; ripiego senza gettone; niente auto-soddisfazione della ricerca del proprio nome. «Ultimo colpo» paga quanto resta della HEALTH anche sotto il costo, ma nessuna carta qui lo introduce. |
| D74–D75 | Tre passi distinti; prova umana del passo 1 fatta, meccanica approvata. Carte concrete del passo 2 da approvare; potenza e difesa POISON al passo 3. |
| D76–D77 | Bot letale già consegnato, nuovo in tutte le tre politiche dei passi 2/3; nessuna nuova prova umana preliminare. Preferisce patta a sconfitta, evita di esporsi al colpo mostrato letale; niente mano coperta o pianificazione a più turni. |
| D78 | «Annuncia X» riassume la meccanica comune; premio pieno e ripiego espliciti per carta. Altre parole solo se intuitive e utili su più carte, da approvare. |

## Annuncia X — unica definizione proposta (D78)

**Annuncia X:** al posto della pesca che segue questa mossa, cerca nel tuo mazzo una carta di nome X, identificata da un solo binding esatto; non può essere un oggetto.

- **Se la trovi:** mettila in mano e mostra quella copia a tutti; applica soltanto i guadagni «Se lo trovi» della carta, dopo la ricerca. Metti su di te un gettone legato al nome X: i danni HIT, CUT e POISON ricevuti sono moltiplicati per **1,5**, compreso il POISON periodico. La vista mostra la copia soltanto mentre è in mano e il relativo gettone esiste; dopo lo scarto resta solo il segnalino col nome.
- **Quando giochi X:** qualunque copia con quel nome, anche parata o annullata, soddisfa soltanto il gettone più vecchio per X già esistente prima della mossa. Gettone e relativo promemoria spariscono **dopo tutti gli effetti di fine turno**, periodici inclusi. La vulnerabilità resta contro ogni gruppo di velocità nel turno della giocata. Una ricerca del proprio nome non soddisfa il gettone che crea; giocare un’altra omonima può far sparire il promemoria della copia trovata ancora in mano.
- **Se X esce senza essere giocata:** lo scarto da solo non soddisfa il gettone. Se a fine turno N il nome manca sia dalla mano sia dal mazzo, il gettone resta per tutto N+1, periodici inclusi, poi cade. Finché esiste una copia in una delle due zone non ha timer; il client già avvisa prima dello scarto dell’ultima copia.
- **Se non la trovi:** pesca normalmente e applica soltanto i guadagni «Se non lo trovi» della carta; nessun nuovo gettone e nessuna carta mostrata. Il ripiego sostituisce il premio pieno, non si somma a esso; non rimuove gettoni già presenti.
- **Più annunci:** gettoni indipendenti, fattori moltiplicati (due ×1,5 danno ×2,25 prima dei troncamenti del percorso R05), senza fusione o tetto speciale; una giocata ne soddisfa uno solo. Pulizia a fine partita, eliminazione e forfait come nel contratto d50 1.0.

**Forma breve:** «Annuncia X. Se lo trovi: +… . Se non lo trovi: +…». Entrambi gli esiti espliciti evitano che «Guadagni … . Annuncia X» sembri dare sempre il premio pieno. Pesca, carta mostrata, gettone e durata stanno nella definizione comune. La parola è approvata; questa stesura va giudicata insieme alle carte, senza cambiare il comportamento d50 1.0.

**Altre parole chiave: nessuna proposta.** «Spendi tutta la tua L», «trasferisci tutta la tua T» e «per ogni tuo oggetto» sono già brevi; «Scarica», «Travasa» o «Attrezza» richiederebbero di ricordare cosa si azzera o conta, senza un risparmio dimostrato su più carte. «Ultimo colpo» resta la dicitura dell’eccezione esistente, non serve qui. Volto «ANNUNCIO», segnalino unico e ×1,5 sull’impatto di B2-a restano indicazioni per il client, fuori perimetro. A9 segnala il rischio di ripetere lo stesso piano su tutto il set: qui si rispettano i cinque starter D61, senza decidere Sergio, Duccio o l’economia delle buste.

## Passo 2 — separazione dalla potenza

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

Questi sono i valori della 1.2, **non quelli da inserire nel passo 2**. Restano proposti e tarabili sotto D38; i nuovi funzionamenti richiedono approvazione. Ripieghi del passo 1 conservati finché una misura autorizzata non ne motivi la taratura.

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


### Il bancone regge, io pure — PIN-AR3

**Binding:** `base.pino.IlBanconeRegge`. **Copie:** 2, già nello starter di Piera. **Rarità:** C, invariata. **Costo:** gratuito. **Priorità:** 2. **Bersaglio:** sé. **Ricerca:** nessuna. **Vulnerabilità propria:** nessuna. **Durata delle riduzioni:** solo il turno corrente, fino al suo fine turno compreso.

**Testo proposto per il passo 3, invariato rispetto alla 1.2:**

> In questo turno moltiplica per 0,5 i danni da colpo e da veleno che ricevi. Guadagni 5 L.

Rispetto alla bozza si aggiunge soltanto lo stato GOOD INPUT POISON ×0,5 per il turno. Restano HIT ×0,5, gratuità, priorità 2 e guadagno di 5 L anche se nessuno attacca. Il CUT resta pieno; non si aggiunge una cura. La difesa vale anche sul POISON periodico da T nel fine turno corrente, perché quello attraversa gli stati INPUT: restringerla ai soli danni delle carte richiederebbe un filtro diverso, che non propongo.

**Perché questa carta:** Piera è sotto quota contro Celestina e ha già due copie della difesa, quindi non serve aggiungere uno slot o distribuire la stessa generica a tutti. Una protezione gratuita resta giocabile anche quando A è a zero. Conserva il premio previsto da D52/D67 e la possibilità di difendersi nel turno dopo il caricamento, mantenendo il colpo cercato e la relativa vulnerabilità. Il +5 L può finanziare un seguito più forte, ma la L continua a decadere e non soddisfa il gettone: serve giocare il nome corrispondente, oppure l’uscita D71 dopo che il nome manca da mano e mazzo.

**Esempi nominali del passo 3:** Tossicone proposto da 18 POISON diventa 9 senza altri stati. Se una vulnerabilità ×1,5 è già presente prima del Bancone, il percorso 18→27→13 lascia 13 anziché 27, per il troncamento R05. Il periodico da T=20 scende da 10 a 5 prima di altre modifiche. La corazza dell'alcol non riduce POISON: non viene sommata impropriamente a questi esempi. Rutto, immunità alla risorsa T e azzeramenti di T non vengono alterati dalla difesa.

**Impatto da misurare nel passo 3:** ridurre il vantaggio di Celestina contro Piera (74,39% delle decisive nel passo 1, non una previsione della difesa), offrire una risposta leggibile all'annuncio di Tossicone/travaso e rendere possibile tenere il colpo in mano a un prezzo sostenibile. Non migliora la difesa di Piera al CUT di Mara, favorita al 67,71% nel passo 1. Non modifica direttamente gli specchi di Celestina o Beppe. Può aumentare la durata degli incontri con Celestina e le patte di fine turno; può inoltre migliorare la difesa contro il timer del Mescolone. Per questo il confronto con/senza aggiunta POISON deve essere separato da aumenti di danno e sostituzione della Fasciatura. Il proprietario deve approvare questa carta prima dell’eventuale modifica; l’inclusione della sola valutazione in D67 non basta. Nessuna estensione al POISON nel passo 2.

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

Base `b0c7ec9`, branch `main`, fetch riuscito: HEAD avanti di 3 commit su origin/main, nessun commit remoto da integrare. Working tree già modificato dall’altra sessione in `prototipi/carriere`, come dichiarato nel prompt; nessun reset/rebase o inclusione di quei file. Nessun server, porta o processo altrui toccato.

**Verifiche:** `python scripts/check-rules.py` verde (regolamento 1.13, Set Base 0.1, copie client, allegato, SQLite e R02 coerenti); `git diff --check` verde. `python scripts/check-links.py` globale: **302 file, 8 link rotti**, tutti nel file **non tracciato** `docs/design/carriere/mockup-principale.md` comparso durante la lavorazione parallela; nessuno nei tre documenti di questo blocco. Firma: catture mancanti alle righe 48, 73–76, 81–82 e 84 (`p-o-01-mappa-intera.jpg`, `p-o-02-giro-a-torneo-perso.jpg`, `p-o-03-giro-b-dietro-a-grappino.jpg`, `p-o-04-s2-dopo-f1.jpg`, `p-o-05-giro-c-notte.jpg`, `p-v-01-mappa-intera.jpg`, `p-v-03-giro-b-dietro-a-grappino.jpg`, `p-giro-bacheca.webm`). Confronto eseguito sulla base `b0c7ec9` esportata in `%TEMP%/bm-sb16g-links-base-44eaf9736cef4cbfb082be8e6a1b2d1f/checkout`: **301 file, 0 link rotti**. È un rosso esterno della lavorazione parallela, non una regressione del blocco né una voce Rn preesistente; il file non è nella base o nel commit. Registro dei rossi non modificato perché fuori dal perimetro esplicito dei tre documenti.

Python portatile 3.13.0 dal sito ufficiale in `%TEMP%/bm-sb16g-proposta-python-3.13.0`, perché `python` non è nel PATH e `py` non trova installazioni; nessuna installazione o dipendenza nel repository. Conteggi ricontrollati con calcolo documentale in memoria su bozza e griglia, senza scrivere una bozza alternativa. Controllo mirato dei tre documenti: 0 link rotti.

Non eseguiti per il perimetro documentale: suite server/client, contesto Spring completo, avvio applicativo, Playwright, giri, FFA o nuove prove umane. Non si dichiarano avvio riuscito o bilanciamento raggiunto. Nessun atteso, soglia, durata, bozza o carta viva modificati. Residuo D68 intatto.

**STOP dopo il commit: nessuna carta inserita nella bozza. Il proprietario approva una proposta concreta; questa consegna non avvia i passi 2 o 3.**

## Domande numerate al proprietario

1. **Approvi la forma breve «Annuncia X. Se lo trovi: … . Se non lo trovi: …» e la definizione unica?** È il comportamento d50 1.0 approvato, con fine turno, uscita D71 e ripiego senza nuovo gettone; nessun’altra parola proposta.
2. **Approvi dieci schede del passo 2 con danni/costi attuali, ripieghi del passo 1 e sola anticipazione PAZIENZA +15→+25 V necessaria per D63?** Nuovi caricamenti col premio attuale del personaggio; Cinghiata R a 12 CUT, travaso da zero di 0 T, Rutto a 5 HIT senza azzerare L, Una stretta senza 4 CUT. È una tappa di frequenza, non certifica il picco raro finale; l’effetto di PAZIENZA non sarà attribuibile alla sola frequenza.
3. **Approvi sostituzioni e cinque liste da 20, 120 slot e 45 C / 55 NC / 20 R?** Difese/contromosse personali restano; escono le copie indicate, senza cancellare generiche dal pool né compensare NC su slot non esaminati.
4. **Confermi potenza della 1.2 e Bancone contro POISON come proposte separate per il passo 3?** Formula/costo Cinghiata, +12 POISON al travaso, azzeramento/formula Rutto e 4 CUT del caricamento Beppe richiedono il giudizio sul funzionamento prima dell’attuazione; questa domanda non li anticipa nel passo 2.

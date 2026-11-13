# SB-16g — Proposta aggiornata delle carte prima di 2b

**Versione 1.0 — 13 novembre 2026. Proposta concreta da approvare (D68).** Sostituisce le schede e le composizioni a un solo bersaglio della versione 0.11. Le decisioni D59–D68 restano valide; queste carte, le sostituzioni e la difesa dal POISON non sono ancora approvate né attuate. I numeri sono indicativi, tarabili in Fase 2 secondo D38.

| Starter | Coppia NC: 2 copie di ciascun titolo | Coppia rara: 1 copia di ciascun titolo; caricamento sempre NC | Copie che escono rispetto alla bozza corrente | Composizione finale |
|---|---|---|---|---|
| Spazienzio | PAZIENZA: FINITA → GARGANTUESCO IMPATTO SUL TU: +25 V/+15 A → 25 V, 40 HIT | **TI FACCIO SPAZIO** → SPEDIAMOTI DUNQUE IN O-AHIO: +35 V/+5 A → 10 V, 20 + V residua/2 HIT | 1 SPEDIAMOTI DUNQUE IN O-AHIO (da 2 a 1) | 10 archetipo + 7 generiche + 3 oggetti = **20** |
| Mara | Slalom d'avvicinamento → Sgommata: +20 A → 15 A, 25 CUT | **Ti stringo la curva** → Cinghiata di traverso: +30 A → 20 A, 20 + A residua/2 CUT | 1 Cinghiata di traverso (2→1); 1 Spintone (2→1) | 10 + 5 + 5 = **20** |
| Celestina | Dose in preparazione → Tossicone Scatarrante: +10 T/+5 A → 10 T, 18 POISON e +5 T al bersaglio | **Un assaggino** → C'è del sangue nella mia droga: +20 T → 10 T, 12 POISON più travaso della T residua e perdita dell'immunità del bersaglio | 1 Rincorsa dal marciapiede (2→1) | 10 + 5 + 5 = **20** |
| Piera | Un altro e arrivo → Estasi da Coca Etilene: +25 L/+35 A → gratuita, 18 + L HIT, azzera L | **Prima il brindisi** → Rutto a distanza sociale: +35 L/+35 A → 5 L, 20 + 2×L residua HIT, sottrae quella L alla A avversaria, azzera la propria L | 1 Fasciatura col fazzolettaccio (2→1) | 10 + 5 + 5 = **20** |
| Beppe | Preparo il lavoro → Chiave da tredici: +15 V → 10 V, 22 CUT | **Una stretta di prova** → Lavoro fatto bene: +10 V e 4 CUT → 10 V, 14 + 7 per proprio oggetto HIT | 2 Mattoni del cantiere (2→0) | 9 + 4 + 7 = **20** |

**Vulnerabilità iniziale per tutti i dieci caricamenti: ×1,5 a HIT, CUT e POISON**, con durata F già decisa: almeno il turno del tutore e il successivo, poi finché resta in mano la precisa copia cercata. Ogni applicazione resta indipendente e si cumula moltiplicativamente (D59, D64–D66). Nessuna vulnerabilità aggiuntiva è impressa sui dieci titoli di colpo: «—» nelle loro schede significa che non ne creano una propria; si applicano normalmente gli stati già presenti.

**D67, difesa candidata:** «Il bancone regge, io pure», due copie già nello starter di Piera: gratuita, priorità 2, bersaglio sé; HIT ricevuti ×0,5 **e POISON ricevuti ×0,5** nel turno; +5 L. Il costo, la priorità e il premio restano quelli attuali. Il POISON comprende anche quello periodico di fine turno; la protezione non toglie T né conferisce immunità. Proposta dettagliata sotto.

## Perimetro, fonti e riferimento

Questa consegna aggiorna soltanto questo documento. Il piano, la griglia, la bozza, codice, test, client, regolamento, documento del set e catalogo restano fuori dal nostro intervento. La Fase 2a su server/client è assegnata a un altro esecutore: nessun suo file è incluso nel commit. Si progettano qui le carte da sottoporre al proprietario prima della Fase 2b; non si avvia il giro.

Fonti: [decisioni D60–D68 e SB-16g](../../set-base-plan.md#decisioni-del-proprietario), [griglia](griglia.md), [listino](listino.md), [proposta SB-16d](sb-16d-proposta.md), rapporti [SB-16e](../../reports/set-base/sb-16e-report.md) e [SB-16e2](../../reports/set-base/sb-16e2-report.md). Il [regolamento](../../game-rules.md) e il [Set Base](../../sets/base.md) governano la partita viva; i cambi D50 e queste carte restano nel playground fino a SB-28.

Riferimento delle sostituzioni: [bozza corrente](../../../server/src/test/resources/set-base/bozza.json), variante (c), letta sul commit `ee7f4d3`; SHA-256 `d435a8796e81b7be8955cd27feb0639126cf8d2e3868c6069881e396fc3d8e19`. Il confronto è con quella bozza giocabile, non con le vecchie schede della proposta. Le versioni 0.x e il confronto fra conseguenze alternative restano nella storia Git; la conseguenza scelta è F.

## Decisioni del proprietario applicate

Le approvazioni riguardano lo schema e il comportamento generale. Non si deduce da esse l'approvazione dei nuovi numeri o delle carte concrete.

| Decisione | Parole del proprietario e vincolo applicato |
|---|---|
| D59 | «Sì, scegliamo F, con almeno due turni di vulnerabilità. Per due turni si intende quello in cui giochi l carta tutore e il turno successivo, in cui potresti giocare o meno il colpo. giusto?» Minimo N e N+1; poi prolungamento mentre si tiene la copia. |
| D60 | «va bene 120 carte, ma:» e proposta di distinguere colpo NC e raro. Totale **120**, non 125; i bersagli rari riusano slot esistenti. |
| D61 | «Sì, adottiamo questo schema per tutti e cinque gli starter. Precisando, 2 caricamenti non comuni e 2 colpi non comuni sono due copie della stessa carta: è uno starter deck, poi nelle buste ci saranno magari altri caricamenti e altri colpi diversi». Tre caricamenti e tre colpi, **quattro titoli distinti**, per ogni starter. |
| D62 | «va bene» al secondo caricamento anch'esso NC, presente in una copia e diretto al raro. |
| D63 | «approvo» alla direzione: risorse sufficienti da zero dopo il fine turno; NC potente e affidabile; raro con picco legato a preparazione/tavolo. Numeri tarabili, carte da ripresentare. |
| D64 | «approvo vulnerabilità a tutti i danni.» Registrate anche le possibilità future di costi aumentati o fattori ×2/×3. Qui si parte da ×1,5; non si introduce un modificatore dei costi. |
| D65 | «si, la vulnerabilità inflitta segue quella precisa copia». Giocata/scarto effettivo concludono il prolungamento; il minimo resta. Ricerca fallita: solo il minimo, nessun legame a carte già in mano o pescate normalmente. |
| D66 | «approvo» al cumulo moltiplicativo indipendente. Una copia liberata non libera le altre. |
| D67 | «si includiamola» alla **valutazione** di una difesa regolare anche contro POISON, preservando il premio; carta ed effetto concreti da approvare. |
| D68 | «approvo» alla divisione **2a** (D58, conseguenza nel motore, vista server/client, test) / **2b** (carte, bot con tre politiche, giro). Prima della bozza si approvano le carte aggiornate. |

## Contratto comune e lettura dei testi

- Tutti i caricamenti sono azioni regolari NC, non basic o bound. Ogni titolo cerca **un solo binding esatto**, quello indicato nella scheda; non una scelta fra i due colpi. Ricerche riuscite: la copia trovata resta scoperta in mano per tutti fino a giocata/scarto (D58). Assenza del bersaglio: normale pesca, senza recupero dagli scarti e senza ulteriori carte.
- Nei testi, «la copia trovata» è l'esemplare effettivo di quella ricerca. Un'omonima già in mano non prende il suo posto. Una ricerca fallita lascia il minimo N/N+1 ma non prolunga né rinnova vecchi legami. Una copia realmente giocata o scartata per una bound conclude soltanto il suo prolungamento; colpo parato/annullato: conta se esce dalla mano. Restano sempre i due turni minimi. Identità della copia, gestione della sua uscita e visibilità sono supporto della 2a, non una nuova regola di queste carte.
- Ogni stato di esposizione applicato rimane indipendente: due ×1,5 hanno fattore composto 2,25 prima degli arrotondamenti del percorso reale. Vale R05, con troncamento a ogni trasformazione, senza tetto o fusione speciali. L'esposizione amplifica anche il POISON periodico di chi non è immune; l'immunità a T non protegge dal danno POISON diretto.
- Tutte le quantità variabili si leggono **dopo il costo**, alla risoluzione, salvo il valore esplicitamente memorizzato prima di azzerare/travasare una risorsa. Le divisioni sono intere. A dopo i costi fissa il gruppo del turno; guadagni e perdite successivi non riordinano i gruppi già fissati (D50).
- Gli esempi di finanziamento partono dalla risorsa richiesta a zero, con le proprietà iniziali del personaggio, senza altre spese o interferenze avversarie. Non partono da HEALTH=0 e non promettono di sopravvivere a qualunque attacco. I costi restano pagabili solo con risorse possedute; nessuna riserva protetta e nessun debito.
- Non si aggiunge autodanno ai caricamenti né l'eccezione «Ultimo colpo». Basic, bound, last resort, salute e risorse iniziali non cambiano qui. Le difese/contromosse personali restano nelle liste. Il raro deve poter essere parato, anticipato o ridimensionato da una risposta: il suo picco non è danno garantito.
- I colpi hanno lo stesso effetto anche se pescati normalmente. Nessun bonus nascosto «se cercato»; le condizioni del picco sono risorse e oggetti già visibili. L'esposizione parte alla risoluzione, senza aumentare retroattivamente danni arrivati prima.

## Spazienzio — il NC lento e il raro che premia l'accumulo

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| PAZIENZA: FINITA, SPA-AR3 (`bruiser.Glare`) | 2; **NC** (da C) | Gratuita | 0; sé | ×1,5, durata F | `bruiser.SuperImpact` |
| GARGANTUESCO IMPATTO SUL TU, SPA-AR1 (`bruiser.SuperImpact`) | 2; **NC** (da C) | 25 V | 0; un avversario | — | Nessuna |
| TI FACCIO SPAZIO, nuovo SPA-AR6 (`base.bruiser.TiFaccioSpazio`, ID proposto) | 1; NC | Gratuita | 0; sé | ×1,5, durata F | `bruiser.ExtremelyViolentBlow` |
| SPEDIAMOTI DUNQUE IN O-AHIO, SPA-AR2 (`bruiser.ExtremelyViolentBlow`) | 1; R | 10 V | 1; un avversario | — | Nessuna |

**PAZIENZA: FINITA — testo:**

> Guadagni 25 V e 15 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo GARGANTUESCO IMPATTO SUL TU e mostralo a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non lo trovi, pesca normalmente.

**GARGANTUESCO IMPATTO SUL TU — testo:**

> Infliggi 40 danni da colpo al bersaglio.

**TI FACCIO SPAZIO — testo:**

> Guadagni 35 V e 5 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo SPEDIAMOTI DUNQUE IN O-AHIO e mostralo a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non lo trovi, pesca normalmente.

**SPEDIAMOTI DUNQUE IN O-AHIO — testo:**

> Infliggi al bersaglio danni da colpo pari a 20 più metà della tua V rimasta dopo il costo, arrotondata per difetto.

**Finanziamento e picco.** V non decade: da V=0 i due tutori lasciano 25 e 35 V in N+1, sufficienti per 25 e 10. Il NC dà 40 HIT, circa 5,7 unità nominali da 7, senza condizione aggiuntiva. Il raro, da zero e dopo il suo tutore, lascia V=25 dopo il costo e fa **32 HIT a priorità 1**; non supera sempre il NC lento. Con i 25 V iniziali conservati, più il tutore, dopo il costo ha V=50 e fa **45 HIT**. Con altre preparazioni cresce ancora; supera 40 quando V prima del costo è almeno 52. Il raro offre dunque anticipo e picco di accumulo, non un 45 fisso. Spendere V altrove riduce il picco, ma rende sostenibile scegliere una contromossa invece del colpo annunciato.

**Sostituzioni:** entra 1 TI FACCIO SPAZIO; SPEDIAMOTI DUNQUE IN O-AHIO passa 2→1. Nessun altro titolo esce interamente: Denti stretti rimane come preparazione alternativa del raro. Restano NON GIOCARE COL COLTELLO NO e FAI BASTA, due copie ciascuno. Si passa da 12 a 13 titoli regolari distinti.

**Atteso e rischio:** meno Impatti impagabili e meno attesa; l'anticipo del raro può evitare un finale reciproco, ma quantità elevate di V e Posacenere rendono possibili picchi letali. Estendere l'esposizione al CUT espone davvero contro Mara. Controllare il 45–55% fra i due base e Spazienzio–Piera lungo; non dedurre meno patte dal solo aumento dei danni. La formula del raro usa già il tipo di quantità `base + risorsa/divisore`; qui cambiano base 6→20 e la ricerca, non la meccanica di calcolo.

## Mara — taglio affidabile e picco sulla A residua

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Slalom d'avvicinamento, MAR-AR5 (`base.mara.Slalom`) | 2; **NC** (da R) | Gratuita | 2; sé | ×1,5, durata F | `base.mara.Sgommata` |
| Sgommata, MAR-AR2 (`base.mara.Sgommata`) | 2; **NC** (da C) | 15 A | 1; un avversario | — | Nessuna |
| Ti stringo la curva, nuovo MAR-AR6 (`base.mara.TiStringoLaCurva`, ID proposto) | 1; NC | Gratuita | 2; sé | ×1,5, durata F | `base.mara.CinghiataDiTraverso` |
| Cinghiata di traverso, MAR-AR1 (`base.mara.CinghiataDiTraverso`) | 1; **R** (da C) | **20 A** (da 5) | 1; un avversario | — | Nessuna |

**Slalom d'avvicinamento — testo:**

> Guadagni 20 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Sgommata e mostrala a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non la trovi, pesca normalmente.

**Sgommata — testo:**

> Infliggi 25 danni da taglio al bersaglio.

**Ti stringo la curva — testo:**

> Guadagni 30 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Cinghiata di traverso e mostrala a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non la trovi, pesca normalmente.

**Cinghiata di traverso — testo:**

> Infliggi al bersaglio danni da taglio pari a 20 più metà della tua A rimasta dopo il costo, arrotondata per difetto.

**Finanziamento e picco.** Da A=L=0, il NC arriva a N+1 con A=20; paga 15 e resta a 5. Il raro arriva con A=30; paga 20 e resta a 10, per **25 CUT**. Conservando invece i 40 A iniziali e aggiungendo il suo tutore arriva ad A=70, paga 20, resta a 50 e fa **45 CUT**. Quei 50 A contano anche per la precedenza a priorità 1: il costo maggiore paga sia picco sia velocità residua. NC 25 CUT resta circa 3,6 unità nominali, aggira la corazza ed è già potente; non ne aumento il danno. L ricevuta o sottrazioni avversarie di A possono impedire il seguito: è interazione legittima, non finanziamento garantito contro ogni disturbo.

**Sostituzioni:** Slalom 1→2 ed entra 1 Ti stringo la curva; Cinghiata di traverso 2→1 e Spintone 2→1. Quindi nessun titolo sparisce, ma escono una copia del vecchio attacco economico e una del colpo gratuito. La rara passa dallo slot Slalom alla Cinghiata, senza aggiungere una seconda rara personale nello starter. Restano Sorpasso in curva, Tra due paraurti, Tartaruga e Steal. Titoli distinti 12→13.

**Atteso e rischio:** due attacchi a basso impegno in meno, più preparazioni visibili e un solo picco raro. Possibile riduzione della durata, ma il picco a priorità/A elevate può rendere ancora peggiore il 65,3% di Mara contro Piera nelle decisive della variante (c). Prima di alzare ulteriormente CUT o A, verificare anche il 45–55% contro Spazienzio. La formula variabile usa operazioni già presenti nella bozza; la trasformazione della Cinghiata è un funzionamento da approvare, non una sola taratura di danno.

## Celestina — POISON diretto NC e raro di travaso

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Dose in preparazione, TOS-AR1 (`junkie.MethDrivenRage`) | 2; **NC** (da C) | Gratuita | 1; sé | ×1,5, durata F | `junkie.Cough` |
| Tossicone Scatarrante, TOS-AR2 (`junkie.Cough`) | 2; **NC** (da C) | 10 T | 1; un avversario | — | Nessuna |
| Un assaggino, nuovo TOS-AR6 (`base.tossico.UnAssaggino`, ID proposto) | 1; NC | Gratuita | 1; sé | ×1,5, durata F | `junkie.ToxicBloodDrain` |
| C'è del sangue nella mia droga, TOS-AR5 (`junkie.ToxicBloodDrain`, riferimento dello slot) | 1; R | 10 T | 1; un avversario | — | Nessuna |

**Dose in preparazione — testo:**

> Guadagni 10 T e 5 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Tossicone Scatarrante e mostralo a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non lo trovi, pesca normalmente.

**Tossicone Scatarrante — testo:**

> Infliggi 18 danni da veleno al bersaglio. Il bersaglio guadagna 5 T.

**Un assaggino — testo:**

> Guadagni 20 T. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo C'è del sangue nella mia droga e mostralo a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non lo trovi, pesca normalmente.

**C'è del sangue nella mia droga — testo:**

> Dopo il costo, trasferisci tutta la tua T residua al bersaglio e togli al bersaglio l'immunità agli effetti della T. Infliggi anche 12 danni da veleno al bersaglio. Alla fine di questo turno ottieni l'immunità agli effetti della T.

**Ordine concreto del raro:** memorizza la T dopo il costo, azzera quella dell'autore, rimuove l'immunità a T del bersaglio, gli aggiunge la quantità memorizzata e infligge i 12 POISON diretti. Conserva il timer attuale di un turno: dà immunità **all'autore**, non al bersaglio. Non si introduce qui una restituzione dell'immunità al bersaglio o una durata nuova della sua perdita. Il timer si risolve dopo il veleno periodico secondo R06/D50: se l'autore aveva perso l'immunità, ottenerla a fine turno non lo protegge retroattivamente dal periodico appena dovuto. Questo dettaglio già presente nel travaso non è una cura.

**Finanziamento e picco.** T non decade. Da T=0, Dose lascia 10 e Un assaggino 20, sufficienti per il costo 10. Il NC garantisce **18 POISON diretti**, circa 2,6 unità nominali, anche contro l'immune a T; i +5 T sono un effetto separato. Il raro da zero, dopo il suo tutore e il costo, trasferisce 10 T: contro un bersaglio senza T sono 12 diretti e 5 periodici alla sua fase di fine turno, prima degli stati. Con i 15 T iniziali di Celestina conservati più il tutore, trasferisce **25 T**: su un bersaglio a T=0 il primo periodico è 12, quindi 24 nominali nel turno, più i periodici successivi; su un'altra Celestina ancora a T=15 si arriva a T=40 e 20 periodici, più i 12 diretti. Il picco dipende da T accumulata e T/immunità avversarie, non da una semplice etichetta di rarità. Più danni periodici non equivalgono a danno garantito: l'avversario può ridurre POISON o azzerare T.

**Sostituzioni:** entra 1 Un assaggino, esce 1 Rincorsa dal marciapiede (2→1). Restano il travaso nello stesso slot raro, due Metabolismi, due Riflessi e Steal. Titoli distinti 12→13. L'altro oggetto raro, Mescolone Micidiale, resta: «un colpo raro» non significa «una sola carta rara complessiva nello starter».

**Atteso e rischio:** si cerca di abbreviare lo specchio oggi a 18,22 turni/18,57% di patte con pressione che funziona anche sugli immuni e un po' di A differente. La T può però finanziare più cure; già in SB-16e spegnere il caricamento accorciava lo specchio, quindi altra T da sola non risolve. Il raro colpisce direttamente e lascia un veleno persistente: rischio importante di dominio o morti reciproche nello stesso fine turno, soprattutto contro bersagli esposti. La candidata D67 offre a Piera una risposta; il solo miglioramento del danno non prova i criteri. I 12 POISON aggiunti al travaso richiedono un adattamento specifico della carta nel playground, dichiarato nella sezione tecnica.

## Piera — spendere la L per due chiusure differenti

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Un altro e arrivo, PIN-AR4 (`base.pino.OffroIo`) | 2; NC | Gratuita | 1; sé | ×1,5, durata F | `base.pino.GoingBerserk` |
| Estasi da Coca Etilene, PIN-AR2 (`base.pino.GoingBerserk`) | 2; **NC** (da C) | Gratuita | 1; un avversario | — | Nessuna |
| Prima il brindisi, nuovo PIN-AR6 (`base.pino.PrimaIlBrindisi`, ID proposto) | 1; NC | Gratuita | 1; sé | ×1,5, durata F | `base.pino.RuttoADistanzaSociale` |
| Rutto a distanza sociale, PIN-AR5 (`base.pino.RuttoADistanzaSociale`) | 1; R | 5 L | 1; un avversario | — | Nessuna |

**Un altro e arrivo — testo:**

> Guadagni 25 L e 35 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Estasi da Coca Etilene e mostrala a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non la trovi, pesca normalmente.

**Estasi da Coca Etilene — testo:**

> Spendi tutta la tua L. Infliggi al bersaglio danni da colpo pari a 18 più la L spesa in questo modo.

**Prima il brindisi — testo:**

> Guadagni 35 L e 35 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Rutto a distanza sociale e mostralo a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non lo trovi, pesca normalmente.

**Rutto a distanza sociale — testo:**

> Spendi tutta la tua L rimasta dopo il costo. Il bersaglio perde A pari alla L spesa in questo modo. Infliggi al bersaglio danni da colpo pari a 20 più il doppio di quella L.

**Ordine concreto dei due colpi:** Estasi conserva la semantica attuale della classe: memorizza L alla risoluzione e la azzera su sé prima degli effetti sul bersaglio. Il nuovo Rutto memorizza L dopo il costo di 5, la azzera su sé e usa quel valore sia per sottrarre A sia per il danno. «Spendi tutta» è un effetto di azzeramento, distinto dal costo: non richiede L positiva per Estasi e non trattiene la corazza per il resto della mossa o del turno. Il Rutto conserva il disturbo di A ma diventa un vero colpo che scarica tutta la riserva; non si modifica per sbaglio la last resort, che resta base 12 e autodanno 2.

**Finanziamento e picco, dopo R06:** da L=A=0, +25 L/+35 A lascia **L=12, A=23** in N+1: Estasi costa zero e fa **30 HIT**. +35 L/+35 A lascia **L=17, A=18**: il raro paga 5, memorizza 12, toglie 12 A e fa **44 HIT**. Non si usano i 35 L appena guadagnati come se non decadessero. Dai valori iniziali L=10/A=15, i due caricamenti lasciano rispettivamente **L=17/A=33** (Estasi 35 HIT) e **L=22/A=28** (Rutto: costo 5, residuo 17, **54 HIT** e −17 A). Il raro ha un picco più alto ma perde più precedenza nella preparazione e richiede almeno 5 L.

**Sostituzioni:** entra 1 Prima il brindisi; Fasciatura col fazzolettaccio 2→1. Rimangono due Testate, due Banconi, Rutto nello slot raro, una Fasciatura, Spintoni e tutti gli oggetti. Titoli distinti 11→12.

**Atteso e rischio:** meno cura ripetuta, recupero A e chiusure più forti possono ridurre i 14,83 turni/13,07% di patte dello specchio e gli incontri lunghi. La L del caricamento dà anche corazza e consuma A; il raro può fare molto danno ma costa l'intera riserva, compresa la protezione contro l'HIT. Se si rinvia, L decade ancora e il raro può diventare impagabile; restano il sacrificio via bound, gli oggetti e altri caricamenti. Non si nasconde questa pressione sotto la promessa di poter aspettare senza conseguenze. Il nuovo Bancone può offrire una difesa nel turno dell'annuncio, ma prolungare gli incontri: i due interventi vanno separati nelle misure.

## Beppe — NC indipendente dagli oggetti, raro da tavolo preparato

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Preparo il lavoro, GIG-AR3 (`base.gigi.ColpoDiChiaveInglese`) | 2; **NC** (da C) | Gratuita | 1; sé | ×1,5, durata F | **`base.gigi.ChiaveDaTredici`** (nuova destinazione) |
| Chiave da tredici, GIG-AR2 (`base.gigi.ChiaveDaTredici`) | 2; **NC** (da C) | **10 V** (da 5) | 1; un avversario | — | Nessuna |
| Una stretta di prova, nuovo GIG-AR6 (`base.gigi.UnaStrettaDiProva`, ID proposto) | 1; NC | Gratuita | 1; un avversario; guadagno/esposizione su sé | ×1,5, durata F | `base.gigi.LavoroFattoBene` |
| Lavoro fatto bene, GIG-AR5 (`base.gigi.LavoroFattoBene`) | 1; R | **10 V** (da 5) | 1; un avversario | — | Nessuna |

**Preparo il lavoro — testo:**

> Guadagni 15 V. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Chiave da tredici e mostrala a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non la trovi, pesca normalmente.

**Chiave da tredici — testo:**

> Infliggi 22 danni da taglio al bersaglio.

**Una stretta di prova — testo:**

> Guadagni 10 V e infliggi 4 danni da taglio al bersaglio. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Lavoro fatto bene e mostralo a tutti: la copia trovata resta scoperta nella tua mano finché la giochi o la scarti. Se resta in mano oltre il prossimo turno, la vulnerabilità continua finché quella copia esce dalla mano. Se non lo trovi, pesca normalmente.

**Lavoro fatto bene — testo:**

> Infliggi al bersaglio danni da colpo pari a 14 più 7 per ogni tuo oggetto sul campo.

**Finanziamento e picco.** V non decade: da zero Preparo lascia 15, paga 10 e conserva 5; la nuova carta lascia 10 e paga esattamente il raro. Il NC fa **22 CUT** indipendentemente dagli oggetti, circa 3,1 unità nominali, e supera la corazza. Il raro con 0/1/2/3 oggetti fa **14/21/28/35 HIT** prima degli stati. Due o tre oggetti producono il picco, mentre a campo vuoto il NC è migliore: la condizione deve contare. Equip già consumati non contano come oggetti; possono però potenziare il colpo. Token sul campo contano. Lavoro risolto con tre oggetti e Guanti attivi può arrivare a 43 HIT prima degli stati del bersaglio; consumare Guanti ha però tolto un oggetto, quindi non si presume automaticamente la compresenza del massimo.

**Sostituzioni:** Preparo 1→2 ed entra 1 Una stretta di prova; escono le **due copie di Mattone del cantiere (2→0)**. Lavoro resta una rara in una copia; non se ne aggiunge una seconda. Restano Chiave 2, Smontiamo tutto 2, Sotto il cofano 1, Steal 2, GABBIANO DUNQUE VOLIAMOTI 1, Spintone 1 e sette oggetti. Titoli distinti 13→13.

**Atteso e rischio:** il taglio NC offre pressione subito utile anche a campo povero; il raro continua a premiare tenere oggetti, aspettare o consumare un equip al momento giusto. Furto/distruzione possono abbassarne il picco. Il tutore raro è offensivo: se annullato, anche perché Beppe è già a terra prima del suo gruppo, non concede risorse, stati o ricerca. Una parata che azzera soltanto i 4 CUT non annulla il resto della mossa. Si spera di accorciare Beppe–Celestina/Piera oltre 12 turni; controllare che il suo specchio, già all'8,22% di patte, non peggiori per colpi simultanei più forti.
## D67 — Difesa candidata contro il POISON

### Il bancone regge, io pure — PIN-AR3

**Binding:** `base.pino.IlBanconeRegge`. **Copie:** 2, già nello starter di Piera. **Rarità:** C, invariata. **Costo:** gratuito. **Priorità:** 2. **Bersaglio:** sé. **Ricerca:** nessuna. **Vulnerabilità propria:** nessuna. **Durata delle riduzioni:** solo il turno corrente, fino al suo fine turno compreso.

**Testo proposto:**

> In questo turno moltiplica per 0,5 i danni da colpo e da veleno che ricevi. Guadagni 5 L.

Rispetto alla bozza si aggiunge soltanto lo stato GOOD INPUT POISON ×0,5 per il turno. Restano HIT ×0,5, gratuità, priorità 2 e guadagno di 5 L anche se nessuno attacca. Il CUT resta pieno; non si aggiunge una cura. La difesa vale anche sul POISON periodico da T nel fine turno corrente, perché quello attraversa gli stati INPUT: restringerla ai soli danni delle carte richiederebbe un filtro diverso, che non propongo.

**Perché questa carta:** Piera è sotto quota contro Celestina e ha già due copie della difesa, quindi non serve aggiungere uno slot o distribuire la stessa generica a tutti. Una protezione gratuita resta giocabile anche quando A è a zero. Conserva il premio previsto da D52/D67 e la possibilità di difendersi nel turno dopo il caricamento, mantenendo il colpo cercato e la relativa vulnerabilità. Il +5 L può finanziare un seguito più forte, ma la L continua a decadere e non cancella il legame F.

**Esempi nominali:** Tossicone proposto da 18 POISON diventa 9 senza altri stati. Se una vulnerabilità ×1,5 è già presente prima del Bancone, il percorso 18→27→13 lascia 13 anziché 27, per il troncamento R05. Il periodico da T=20 scende da 10 a 5 prima di altre modifiche. La corazza dell'alcol non riduce POISON: non viene sommata impropriamente a questi esempi. Rutto, immunità alla risorsa T e azzeramenti di T non vengono alterati dalla difesa.

**Impatto atteso:** ridurre la quota 0,662 di Celestina contro Piera nelle decisive della variante (c), offrire una risposta leggibile all'annuncio di Tossicone/travaso e rendere possibile tenere il colpo in mano a un prezzo sostenibile. Non migliora la difesa di Piera al CUT di Mara, già favorita 0,653. Non modifica direttamente gli specchi di Celestina o Beppe. Può aumentare la durata degli incontri con Celestina e le patte di fine turno; può inoltre migliorare la difesa contro il timer del Mescolone. Per questo il confronto con/senza aggiunta POISON deve essere separato da aumenti di danno e sostituzione della Fasciatura. Il proprietario deve approvare questa carta prima dell'eventuale modifica; l'inclusione della sola valutazione in D67 non basta.

## Liste complete e conto delle 120 carte

Le liste seguenti contano **solo le 20 regolari**; basic fissa, due bound diverse e last resort restano quelle della bozza di riferimento. Nessun titolo ha più di due copie. «Archetipo» segue lo slot progettuale, non il package Java. I nomi propri sono quelli visualizzati nella bozza; gli ID interni Tossico/Pino/Gigi restano riferimenti tecnici.

| Starter | Archetipo | Generiche | Oggetti |
|---|---|---|---|
| Spazienzio | Impatto 2; SPEDIAMOTI DUNQUE IN O-AHIO 1; PAZIENZA: FINITA 2; NON GIOCARE COL COLTELLO NO 2; FAI BASTA 2; TI FACCIO SPAZIO 1 (**10**) | GABBIANO DUNQUE VOLIAMOTI 2; Tartaruga sul marciapiede 2; Mattone del cantiere 1; ORMALE GUARIAMOTI 1; Denti stretti 1 (**7**) | Negroni Trovato per Terra 2; Posacenere di vetro 1 (**3**) |
| Mara | Cinghiata di traverso 1; Sgommata 2; Sorpasso in curva 2; Tra due paraurti 2; Slalom d'avvicinamento 2; Ti stringo la curva 1 (**10**) | Spintone 1; Sputo da posacenere 2; Tartaruga sul marciapiede 1; Steal 1 (**5**) | Espresso del distributore 2; Panino del kebab dimenticato 2; Giubbotto di finta pelle 1 (**5**) |
| Celestina | Dose in preparazione 2; Tossicone Scatarrante 2; Metabolismo Corrotto 2; Riflessi Aumentati dalla Speed 2; C'è del sangue nella mia droga 1; Un assaggino 1 (**10**) | Grab 2; Rincorsa dal marciapiede 1; Steal 1; Fasciatura col fazzolettaccio 1 (**5**) | Pasticca trovata sul bancone 2; Panino del kebab dimenticato 2; Mescolone Micidiale 1 (**5**) |
| Piera | Testata da ultimo giro 2; Estasi da Coca Etilene 2; Il bancone regge, io pure 2; Un altro e arrivo 2; Rutto a distanza sociale 1; Prima il brindisi 1 (**10**) | Grab 2; Spintone 2; Fasciatura col fazzolettaccio 1 (**5**) | Amaro nel bicchiere di plastica 2; Peroni da 66, calda 2; Tennents Super 1 (**5**) |
| Beppe | Smontiamo tutto 2; Chiave da tredici 2; Preparo il lavoro 2; Sotto il cofano 1; Lavoro fatto bene 1; Una stretta di prova 1 (**9**) | Steal 2; GABBIANO DUNQUE VOLIAMOTI 1; Spintone 1 (**4**) | Guanti da officina 2; Giubbotto di finta pelle 2; Casco da lavoro 2; Espresso del distributore 1 (**7**) |

«Impatto» nella lista compatta indica GARGANTUESCO IMPATTO SUL TU, non un titolo aggiuntivo. I titoli distinti finali sono **13, 13, 13, 12, 13**: maggiore varietà rispetto all'indicazione iniziale di dodici, senza aumentare le copie totali o violare il massimo due. Gli attacchi/difese/contromosse personali non vengono sostituiti da una sola sequenza obbligata.

**Nuovi titoli nel pool:** esclusivamente SPA-AR6 TI FACCIO SPAZIO, MAR-AR6 Ti stringo la curva, TOS-AR6 Un assaggino, PIN-AR6 Prima il brindisi e GIG-AR6 Una stretta di prova, tutti NC. I dieci bersagli sono carte di slot già esistenti; Cinghiata e Rutto sono riprogettate, non titoli aggiuntivi. Le generiche tolte o ridotte negli starter restano disponibili nel pool; Mattone non viene cancellato dal set.

| Categoria di slot | Progetto precedente | Proposta |
|---|---:|---:|
| Azioni d'archetipo | 37 | **42** |
| Azioni generiche | 23 | **23** |
| Personaggi / basic / bound / last resort / oggetti | 7 / 7 / 21 / 4 / 16 | **Invariati** |
| Totale, token escluso | 115 | **120** |

**Rarità dell'intero progetto:** conteggio della griglia attuale **54 C / 41 NC / 20 R**. Otto carte passano C→NC: Impatto, PAZIENZA: FINITA, Sgommata, Dose, Tossicone, Estasi, Chiave e Preparo. Slalom passa R→NC e Cinghiata C→R; si aggiungono cinque nuove NC. Il risultato è **45 C / 55 NC / 20 R = 120**. Il numero di rare non cresce; cambia la loro distribuzione fra gli slot di Mara. La maggioranza di NC è una conseguenza esplicita dello schema approvato, da accettare insieme alle carte o da compensare in un altro blocco; questa proposta non inventa compensazioni sulle carte delle buste non esaminate.

## Verifica del finanziamento da zero

N è il turno del tutore, N+1 il primo turno utile per il colpo. V e T non decadono automaticamente; si considerano le immunità iniziali dei personaggi. Per Piera, senza immunità a L, il fine turno sottrae `L//2` A e poi `L//2 + 1` L, con pavimento a zero. La A di Mara è stabile se L=0. Nessun esempio usa danni o risorse negativi.

| Starter e destinazione | Guadagno da risorsa zero | Risorsa disponibile a inizio N+1 | Costo del colpo | Residuo dopo costo / danno nominale iniziale |
|---|---|---|---|---|
| Spazienzio NC | +25 V, +15 A | V=25 | 25 V | V=0; **40 HIT** |
| Spazienzio R | +35 V, +5 A | V=35 | 10 V | V=25; **32 HIT** a priorità 1 |
| Mara NC | +20 A | A=20 | 15 A | A=5; **25 CUT** |
| Mara R | +30 A | A=30 | 20 A | A=10; **25 CUT**, picco crescente con A conservata |
| Celestina NC | +10 T, +5 A | T=10 | 10 T | T=0; **18 POISON** e +5 T al bersaglio |
| Celestina R | +20 T | T=20 | 10 T | T=10 poi travasata; **12 POISON** più periodico dipendente dal bersaglio |
| Piera NC | +25 L, +35 A | L=12, A=23 | Gratuito | L=12 memorizzata e azzerata; **30 HIT** |
| Piera R | +35 L, +35 A | L=17, A=18 | 5 L | L=12 memorizzata e azzerata; **44 HIT**, −12 A al bersaglio |
| Beppe NC | +15 V | V=15 | 10 V | V=5; **22 CUT** |
| Beppe R | +10 V e 4 CUT | V=10 | 10 V | V=0; **14–35 HIT** secondo 0–3 oggetti; i 4 CUT sono della mossa precedente |

Il requisito D63 è **finanziare il costo**, non assicurare che il raro superi sempre il NC al minimo assoluto di preparazione. I NC restano solidi senza accumuli aggiuntivi; i rari hanno un picco condizionato, con casi in cui conservarli non rende. Stati esterni che cambiano guadagni/costi, T letale senza immunità, avversari che sottraggono risorse o scelte volontarie di spesa sono interazioni da misurare, non risorse da ignorare nella validazione delle mosse.

## Lavoro tecnico previsto per 2b, dopo l'approvazione

**Il supporto 2a resta quello delle decisioni**, senza nuove richieste sul formato di rete in questo documento: copia scoperta, legame e durata minima, gestione dell'uscita e fattori indipendenti. I nomi degli ID nuovi sono proposti per rendere univoche le ricerche, non una prescrizione di campi JSON prima di leggere il contratto consegnato dalla 2a. Se quella consegna cambia un vincolo rilevante, lo si espone prima dell'attuazione delle carte.

**Dati già esprimibili:** i cinque nuovi tutori usano guadagni, esposizione collegata e ricerca esatta della 2a; la carta offensiva di Beppe aggiunge danno al bersaglio. NC e rari di Spazienzio/Mara usano danni fissi o `base + risorsa/divisore`; Preparo cambia esplicitamente la sua destinazione da Lavoro a Chiave. Chiave cambia costo/danno e rarità. Estasi e Lavoro riusano le classi parametriche con base/per-oggetto aggiornati. Bancone richiede uno stato POISON del turno in aggiunta a quello HIT, con il guadagno L esistente. Nessuno di questi introduce una nuova risorsa o parola chiave (D8).

**Due adattamenti specifici di carta, costo dichiarato:**

1. **C'è del sangue nella mia droga:** serve una versione di bozza del travaso con quantità di POISON diretto parametrica, inizialmente 12, oltre a memorizzazione/trasferimento/immunità e timer già esistenti. Costo contenuto ma reale: una variante di carta, metadati e test su ordine, immune/non immune e timer. Non basta cambiare la descrizione; non si modifica silenziosamente la classe usata dalla partita viva.
2. **Rutto a distanza sociale:** serve memorizzare L dopo il costo, azzerarla e usare il valore per due effetti diversi sul bersaglio: perdita A e danno `20 + 2×L`. La sola lista di effetti su sé viene prima di quella sul bersaglio, quindi un `empty L` più una quantità letta dopo vedrebbe zero. Costo medio: una carta parametrica di bozza con snapshot della risorsa, secondo il modello già usato da Estasi/travaso, più test della formula e della corazza persa. Non serve introdurre un nuovo operatore generale del motore o una condizione sulla ricerca.

Questi sono effetti di carta composti da meccaniche esistenti, non nuove regole generali assegnate alla 2a. Se l'implementazione richiedesse invece una modifica del motore condiviso, il passo 0 deve dichiararla e fermarsi su quel punto. I binding di riferimento delle carte esistenti non devono portare il loro nuovo effetto nella partita viva; l'eventuale mappatura a classi di bozza va descritta e testata in 2b.

**Bozza e verifiche future:** dopo approvazione, aggiornare effetti, priorità, costi, rarità, copie, descrizioni, ruoli e metadati dei guadagni/danni nella stessa modifica, insieme alla griglia sperimentale. Nessuna modifica agli attesi per accettare regressioni. Nei test mirati coprire:

- le dieci ricerche esatte e il requisito da zero attraverso il fine turno, non soltanto subito dopo il guadagno;
- minimo N/N+1, due copie omonime, ricerca fallita, scarto per bound risolta/annullata, colpo parato/annullato e due legami indipendenti, riusando le prove della 2a senza duplicarne tutta l'implementazione;
- rare di Spazienzio/Mara prima/dopo il costo e soglie del picco; anticipo del raro di Spazienzio e A residua di Mara;
- travaso: T memorizzata dopo il costo, autore azzerato, immunità del bersaglio rimossa, POISON diretto distinto dal periodico e timer di immunità **all'autore**;
- Estasi/Rutto: esempi da 0 e dai valori iniziali, L azzerata, A sottratta senza riordinare gruppi già fissati, nessuna variazione alla last resort;
- Lavoro con 0–3 oggetti, token/equip distinti, furto/distruzione e consumi prima del suo gruppo;
- Bancone: POISON diretto e periodico, esposizione, arrotondamenti, priorità 2 e guadagno di 5 L anche senza attacco; costo gratuito anche ad A=0;
- liste da 20, copie massime due, rarità delle due coppie, set da 120 e isolamento del profilo vivo. Mutazioni solo sui nuovi rami di logica che verranno davvero introdotti.

**Bot e misure:** mantenere i quattro stili e confrontare le tre politiche decise, «gioca sempre il turno dopo», «tieni se l'avversario si è parato», «a caso». «Si è parato» usa ultimo turno risolto/stati pubblici, non la scelta segreta attuale. Ogni politica legge le copie scoperte persistenti e distingue colpo legale da impagabile; sa sacrificare una copia per chiudere il suo legame. Valutare anche Rare vs NC, risorse spese altrove, campo oggetti e difesa dal POISON. Nessuna conoscenza del mazzo avversario e nessun pianificatore a più turni.

Il riferimento dei confronti è la variante (c). Separare frequenza/composizione, potenza dei colpi e difesa POISON con ablazioni prefissate entro il budget di **tre giri/due ore cumulative di calcolo** di 2b, non un lotto aggiuntivo implicito per ogni idea. I caricamenti visti, risolti, le ricerche riuscite/mancate, le copie NC/rare giocate subito/tenute/scartate, le esposizioni subite e il danno parato devono avere denominatori separati. Per il raro singolo misurare esplicitamente i tutori che cercano a vuoto. Anche il turno offensivo di Una stretta di prova va distinto dal danno successivo di Lavoro.

Restano D16/D51: **45–55% fra i base, 40–60% negli altri incontri, circa 6–12 turni, patte ≤10% in ogni incontro/specchio**, pochi mazzi esauriti, zero turni senza mosse legali, otto invarianti a zero e tetto bound invariato. Quota sulle decisive, patte su tutte le partite; una media globale buona non sana una cella fuori criterio. La variante (c) non li raggiunge: specchi Celestina/Piera, quote contro Piera e sei durate oltre 12. Non si attribuisce al nuovo progetto un esito già misurato. Se criteri o budget non tornano, STOP con dati e proposta. Dopo i bot resta la breve prova umana prima di SB-17.

## Verifiche e limiti di questa consegna

Checkout inizialmente pulito; fetch riuscito, `main` e `origin/main` allineati a `ee7f4d3`; nessun listener su 8080/4320 al controllo preliminare. Non sono stati avviati server, Maven o verifiche client in concorrenza con la 2a. Le letture tecniche sono state in sola lettura; unico percorso modificato da questo lavoro: `docs/design/set-base/sb-16g-proposta.md`.

Controlli aritmetici eseguiti in memoria sulla bozza: cinque liste da 20, massimo due copie, titoli distinti 13/13/13/12/13; conto delle rarità della griglia 54/41/20 e redistribuzione proposta 45/55/20; esempi di risorse residue attraverso R06. Nessuna bozza alternativa o script di test è stato scritto. Le quantità di danno riportate sono calcoli nominali, non una simulazione.

**Esiti delle verifiche documentali:**

- `python scripts/check-links.py docs/design/set-base/sb-16g-proposta.md`: **1 documento, 0 link rotti**.
- `git diff --check`: **verde**, sia globale sia sul solo documento.
- `python scripts/check-links.py`: **292 documenti, 1 link rotto** nel lavoro parallelo della 2a: `docs/api.md:172` punta a `reports/set-base/sb-16g-2a-report.md`, non ancora presente al controllo. Il riferimento è un’aggiunta nel diff non committato di `docs/api.md`, assente nella versione HEAD; questa proposta non lo introduce e non punta a quel rapporto. Il file dell’altro esecutore non è stato corretto o incluso. È un rosso transitorio fuori perimetro, non una voce preesistente del registro dei rossi noti.

Le cinque liste scritte nel documento sono state ricontate direttamente dalle celle: 10/7/3, 10/5/5, 10/5/5, 10/5/5 e 9/4/7, tutte con totale 20 e massimo due copie. La bozza conserva l’impronta di riferimento al controllo finale. I controlli dei link e degli spazi sono ripetuti prima del commit sul testo conclusivo.

Non eseguiti in questa fase documentale: suite server/client, contesto Spring completo, avvio reale, Playwright, giri di bilanciamento, FFA e prove umane. Nessun atteso o soglia modificato; il verde dei link della proposta non prova l’avvio o il bilanciamento del gioco. Nessun push.

**STOP: nessuna carta nella bozza prima dell'approvazione.** La 2a parallela non approva implicitamente le carte o le liste qui proposte.

## Domande numerate al proprietario

1. **Approvi le cinque coppie NC/rare concrete, con questi testi, costi, priorità e destinazioni di ricerca?** Tutti i caricamenti sono NC e partono da ×1,5; le risorse bastano da zero dopo il fine turno. I NC sono affidabili; il raro può rendere meno al minimo e avere un picco maggiore con preparazione/tavolo. In particolare Cinghiata diventa rara a danno variabile, il travaso di Celestina aggiunge 12 POISON e Rutto scarica tutta la L per danno e disturbo. I numeri restano indicativi sotto D38.
2. **Approvi le sostituzioni e le cinque liste da 20, senza eliminare difese e contromosse personali?** Escono una copia di SPEDIAMOTI DUNQUE IN O-AHIO, una Cinghiata e uno Spintone da Mara, una Rincorsa da Celestina, una Fasciatura da Piera e due Mattoni da Beppe. Entrano solo cinque titoli nel pool, uno per starter; il set resta da 120 con **45 C / 55 NC / 20 R**. Il maggiore numero di NC e i 12–13 titoli distinti per starter sono dichiarati, senza compensazioni nascoste su altri slot.
3. **Approvi «Il bancone regge, io pure» anche contro POISON ×0,5**, diretto e periodico del turno, conservando gratuità, priorità 2 e +5 L? È la candidata D67 per dare a Piera una risposta al veleno; il rischio di allungare gli incontri va misurato separatamente. Nessuna immunità aggiunta né riduzione del CUT.

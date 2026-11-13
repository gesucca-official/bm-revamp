# SB-16g — Proposta aggiornata delle carte prima di 2b

**Versione 1.2 — 13 novembre 2026. Contratto comune aggiornato a D71–D74; le dieci schede proposte sotto restano da riscrivere e approvare nel passo 2. Motivo: correggere fine gruppo, ricerca fallita e uscita senza copie.**

Il passo 1 della 2b attua il [contratto d50 1.0](sb-16g-2b1-rules.md) sui cinque caricamenti esistenti, senza cambiare danni o composizioni. Questa proposta delle dieci coppie, delle sostituzioni e della difesa POISON resta da riallineare nelle singole schede e approvare prima dei passi 2 e 3 (D74). Quantità, costi, priorità, rarità e liste della versione 1.0 restano proposti senza variazioni numeriche (D38).

**Motivazione della revisione 1.2:** D71 sostituisce la fine gruppo con la fine turno e aggiunge l'uscita senza copie; D72 sostituisce il gettone a ricerca fallita con un guadagno ridotto; K1 conserva la carta mostrata solo in mano. Le parti storiche D59–D70 della tabella delle decisioni sotto spiegano l'origine, non prevalgono sul contratto vigente.

| Starter | Coppia NC: 2 copie di ciascun titolo | Coppia rara: 1 copia di ciascun titolo; caricamento sempre NC | Copie che escono rispetto alla bozza corrente | Composizione finale |
|---|---|---|---|---|
| Spazienzio | PAZIENZA: FINITA → GARGANTUESCO IMPATTO SUL TU: +25 V/+15 A → 25 V, 40 HIT | **TI FACCIO SPAZIO** → SPEDIAMOTI DUNQUE IN O-AHIO: +35 V/+5 A → 10 V, 20 + V residua/2 HIT | 1 SPEDIAMOTI DUNQUE IN O-AHIO (da 2 a 1) | 10 archetipo + 7 generiche + 3 oggetti = **20** |
| Mara | Slalom d'avvicinamento → Sgommata: +20 A → 15 A, 25 CUT | **Ti stringo la curva** → Cinghiata di traverso: +30 A → 20 A, 20 + A residua/2 CUT | 1 Cinghiata di traverso (2→1); 1 Spintone (2→1) | 10 + 5 + 5 = **20** |
| Celestina | Dose in preparazione → Tossicone Scatarrante: +10 T/+5 A → 10 T, 18 POISON e +5 T al bersaglio | **Un assaggino** → C'è del sangue nella mia droga: +20 T → 10 T, 12 POISON più travaso della T residua e perdita dell'immunità del bersaglio | 1 Rincorsa dal marciapiede (2→1) | 10 + 5 + 5 = **20** |
| Piera | Un altro e arrivo → Estasi da Coca Etilene: +25 L/+35 A → gratuita, 18 + L HIT, azzera L | **Prima il brindisi** → Rutto a distanza sociale: +35 L/+35 A → 5 L, 20 + 2×L residua HIT, sottrae quella L alla A avversaria, azzera la propria L | 1 Fasciatura col fazzolettaccio (2→1) | 10 + 5 + 5 = **20** |
| Beppe | Preparo il lavoro → Chiave da tredici: +15 V → 10 V, 22 CUT | **Una stretta di prova** → Lavoro fatto bene: +10 V e 4 CUT → 10 V, 14 + 7 per proprio oggetto HIT | 2 Mattoni del cantiere (2→0) | 9 + 4 + 7 = **20** |

**Contratto vigente del passo 1:** [regole d50 1.0](sb-16g-2b1-rules.md). Gettone ×1,5 su HIT, CUT e POISON soltanto se la ricerca trova. Cade a fine turno della giocata omonima, anche parata/annullata; oppure un turno dopo l'assenza del nome da mano e mazzo. La copia trovata si mostra solo se in mano. A ricerca fallita: pesca e risorse ridotte scritte sulla carta, nessun gettone. I numeri e le sostituzioni della tabella sono ancora proposte del passo 2, non la bozza del passo 1.

**D67, difesa candidata:** «Il bancone regge, io pure», due copie già nello starter di Piera: gratuita, priorità 2, bersaglio sé; HIT ricevuti ×0,5 **e POISON ricevuti ×0,5** nel turno; +5 L. Il costo, la priorità e il premio restano quelli attuali. Il POISON comprende anche quello periodico di fine turno; la protezione non toglie T né conferisce immunità. Proposta dettagliata sotto.

## Perimetro, fonti e riferimento

Questa consegna aggiorna soltanto questo documento. Il piano, la griglia, la bozza, codice, test, client, regolamento, documento del set e catalogo restano fuori dal nostro intervento. La consegna originaria 1.0 era soltanto documentale; il passo 1 attuale è descritto nel contratto d50 separato. Si progettano qui le carte da sottoporre al proprietario prima della Fase 2b; non si avvia il giro.

Fonti: [decisioni D60–D69 e SB-16g](../../set-base-plan.md#decisioni-del-proprietario), [griglia](griglia.md), [listino](listino.md), [proposta SB-16d](sb-16d-proposta.md), rapporti [SB-16e](../../reports/set-base/sb-16e-report.md) e [SB-16e2](../../reports/set-base/sb-16e2-report.md). Il [regolamento](../../game-rules.md) e il [Set Base](../../sets/base.md) governano la partita viva; i cambi D50 e queste carte restano nel playground fino a SB-28.

Riferimento delle sostituzioni: [bozza corrente](../../../server/src/test/resources/set-base/bozza.json), variante (c), letta sul commit `ee7f4d3`; SHA-256 `d435a8796e81b7be8955cd27feb0639126cf8d2e3868c6069881e396fc3d8e19`. Il confronto delle copie e dei valori è con quella bozza giocabile, non con le vecchie schede della proposta. Per la penalità vale invece D69, registrata in `9e4efce`, che rivede la precedente F. La [consegna iniziale 2a](../../reports/set-base/sb-16g-2a-report.md) precede questa revisione e non dimostra già attuato D69: il piano indica revisione 2a in corso. Le versioni precedenti restano nella storia Git.

## Decisioni del proprietario applicate

Le approvazioni riguardano lo schema e il comportamento generale. Non si deduce da esse l'approvazione dei nuovi numeri o delle carte concrete. Le righe D58/D59/D65 precedenti vanno lette con la revisione D69: i due turni non sono più un minimo per i gettoni legati al nome.

| Decisione | Parole del proprietario e vincolo applicato |
|---|---|
| D59 | «Sì, scegliamo F, con almeno due turni di vulnerabilità. Per due turni si intende quello in cui giochi l carta tutore e il turno successivo, in cui potresti giocare o meno il colpo. giusto?» Scelta storica, **rivista da D69**: nessun minimo per il gettone legato al nome; N/N+1 restano soltanto per la ricerca fallita. |
| D60 | «va bene 120 carte, ma:» e proposta di distinguere colpo NC e raro. Totale **120**, non 125; i bersagli rari riusano slot esistenti. |
| D61 | «Sì, adottiamo questo schema per tutti e cinque gli starter. Precisando, 2 caricamenti non comuni e 2 colpi non comuni sono due copie della stessa carta: è uno starter deck, poi nelle buste ci saranno magari altri caricamenti e altri colpi diversi». Tre caricamenti e tre colpi, **quattro titoli distinti**, per ogni starter. |
| D62 | «va bene» al secondo caricamento anch'esso NC, presente in una copia e diretto al raro. |
| D63 | «approvo» alla direzione: risorse sufficienti da zero dopo il fine turno; NC potente e affidabile; raro con picco legato a preparazione/tavolo. Numeri tarabili, carte da ripresentare. |
| D64 | «approvo vulnerabilità a tutti i danni.» Registrate anche le possibilità future di costi aumentati o fattori ×2/×3. Qui si parte da ×1,5; non si introduce un modificatore dei costi. |
| D65 | «si, la vulnerabilità inflitta segue quella precisa copia». Scelta storica, **rivista da D69**: basta giocare quel nome, lo scarto non conta. Ricerca fallita: gettone anonimo temporaneo, non legato alle carte in mano. |
| D66 | «approvo» al cumulo moltiplicativo indipendente. D69 precisa: una carta giocata rimuove soltanto il gettone più vecchio per quel nome, non tutti. |
| D67 | «si includiamola» alla **valutazione** di una difesa regolare anche contro POISON, preservando il premio; carta ed effetto concreti da approvare. |
| D68 | «approvo» alla divisione **2a** (D58, conseguenza nel motore, vista server/client, test) / **2b** (carte, bot con tre politiche, giro). Prima della bozza si approvano le carte aggiornate. |
| D69 | «il gettone della penalità sul danno (o su qualunque altra cosa sia) è sul giocatore, non sulla carta»; «non c'è nessun timer sul gettone, va via quando si gioca una carta col nome che lo ha creato»; sullo scarto «no, solo se viene giocata. se uno scarta la sua unica copia, doveva pensarci prima». La carta mostrata è «solo una vista». Gettone legato al nome, rimosso dalla giocata anche di un'omonima; a ricerca fallita, gettone anonimo per N/N+1; per più gettoni dello stesso nome se ne toglie uno solo, il più vecchio, a fine gruppo. Restano moltiplicazione dei fattori e pulizia a fine partita/eliminazione/forfait. Rivede D58/D59/D65; nessuna scelta della precisa copia richiesta. |

## Contratto comune e lettura dei testi

- Tutti i caricamenti sono azioni regolari NC, non basic o bound. Ogni titolo cerca **un solo colpo esatto**, quello identificato nella scheda; non una scelta fra i due bersagli. Se lo trova, mette sul giocatore un gettone legato al nome di quel colpo: la copia fisica non è vincolata. Il colpo mostrato rimane nella vista finché quella copia è in mano e c'è il relativo gettone; dopo uno scarto resta solo il segnalino col nome (D71, K1). Quando il gettone viene rimosso, sparisce anche il suo promemoria, pure se è stata giocata un'altra copia omonima.
- **Giocata che soddisfa il gettone (D71):** qualsiasi omonima, anche parata o annullata, toglie soltanto il più vecchio gettone preesistente alla mossa, dopo tutti gli effetti di fine turno. Una carta che cerca il proprio nome non soddisfa il gettone appena creato (M3).
- **Uscita (D71):** se a fine turno il nome non è più né in mano né nel mazzo, la vulnerabilità resta per il turno successivo intero e poi cade. Il client avvisa prima dello scarto dell'ultima copia.
- **Ricerca fallita (D72):** pesca normale e risorse ridotte esplicite, nessun gettone o carta scoperta. Partenza circa un terzo arrotondata a 5, da tarare nel giro del passo 1.
- **Più gettoni (D66):** indipendenti e moltiplicativi; una giocata ne soddisfa uno solo, il più vecchio. Pulizia a fine partita, eliminazione e forfait. «∞» finché il nome è disponibile; un turno residuo quando l'ultima copia è uscita.
- Ogni stato di esposizione applicato rimane indipendente: due ×1,5 hanno fattore composto 2,25 prima degli arrotondamenti del percorso reale. Vale R05, con troncamento a ogni trasformazione, senza tetto o fusione speciali. L'esposizione amplifica anche il POISON periodico di chi non è immune; l'immunità a T non protegge dal danno POISON diretto.
- Tutte le quantità variabili si leggono **dopo il costo**, alla risoluzione, salvo il valore esplicitamente memorizzato prima di azzerare/travasare una risorsa. Le divisioni sono intere. A dopo i costi fissa il gruppo del turno; guadagni e perdite successivi non riordinano i gruppi già fissati (D50).
- Gli esempi di finanziamento partono dalla risorsa richiesta a zero, con le proprietà iniziali del personaggio, senza altre spese o interferenze avversarie. Non partono da HEALTH=0 e non promettono di sopravvivere a qualunque attacco. I costi restano pagabili solo con risorse possedute; nessuna riserva protetta e nessun debito.
- Non si aggiunge autodanno ai caricamenti né l'eccezione «Ultimo colpo». Basic, bound, last resort, salute e risorse iniziali non cambiano qui. Le difese/contromosse personali restano nelle liste. Il raro deve poter essere parato, anticipato o ridimensionato da una risposta: il suo picco non è danno garantito.
- I colpi hanno lo stesso effetto anche se pescati normalmente. Nessun bonus nascosto «se cercato»; le condizioni del picco sono risorse e oggetti già visibili. L'esposizione parte alla risoluzione, senza aumentare retroattivamente danni arrivati prima.

**Impatto di D71–D74:** il gettone resta attivo contro i gruppi più lenti e il periodico nel turno della giocata. Il confronto delle tre politiche precede le modifiche di frequenza e potenza; il passo 1 conserva i cinque titoli e i danni attuali. Le dieci schede successive sono proposte storiche da riallineare prima del passo 2.

## Spazienzio — il NC lento e il raro che premia l'accumulo

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| PAZIENZA: FINITA, SPA-AR3 (`bruiser.Glare`) | 2; **NC** (da C) | Gratuita | 0; sé | ×1,5, gettone D69 | `bruiser.SuperImpact` |
| GARGANTUESCO IMPATTO SUL TU, SPA-AR1 (`bruiser.SuperImpact`) | 2; **NC** (da C) | 25 V | 0; un avversario | — | Nessuna |
| TI FACCIO SPAZIO, nuovo SPA-AR6 (`base.bruiser.TiFaccioSpazio`, ID proposto) | 1; NC | Gratuita | 0; sé | ×1,5, gettone D69 | `bruiser.ExtremelyViolentBlow` |
| SPEDIAMOTI DUNQUE IN O-AHIO, SPA-AR2 (`bruiser.ExtremelyViolentBlow`) | 1; R | 10 V | 1; un avversario | — | Nessuna |

**PAZIENZA: FINITA — testo:**

> Guadagni 25 V e 15 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo GARGANTUESCO IMPATTO SUL TU. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**GARGANTUESCO IMPATTO SUL TU — testo:**

> Infliggi 40 danni da colpo al bersaglio.

**TI FACCIO SPAZIO — testo:**

> Guadagni 35 V e 5 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo SPEDIAMOTI DUNQUE IN O-AHIO. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**SPEDIAMOTI DUNQUE IN O-AHIO — testo:**

> Infliggi al bersaglio danni da colpo pari a 20 più metà della tua V rimasta dopo il costo, arrotondata per difetto.

**Finanziamento e picco.** V non decade: da V=0 i due tutori lasciano 25 e 35 V in N+1, sufficienti per 25 e 10. Il NC dà 40 HIT, circa 5,7 unità nominali da 7, senza condizione aggiuntiva. Il raro, da zero e dopo il suo tutore, lascia V=25 dopo il costo e fa **32 HIT a priorità 1**; non supera sempre il NC lento. Con i 25 V iniziali conservati, più il tutore, dopo il costo ha V=50 e fa **45 HIT**. Con altre preparazioni cresce ancora; supera 40 quando V prima del costo è almeno 52. Il raro offre dunque anticipo e picco di accumulo, non un 45 fisso. Spendere V altrove riduce il picco, ma rende sostenibile scegliere una contromossa invece del colpo annunciato.

**Sostituzioni:** entra 1 TI FACCIO SPAZIO; SPEDIAMOTI DUNQUE IN O-AHIO passa 2→1. Nessun altro titolo esce interamente: Denti stretti rimane come preparazione alternativa del raro. Restano NON GIOCARE COL COLTELLO NO e FAI BASTA, due copie ciascuno. Si passa da 12 a 13 titoli regolari distinti.

**Atteso e rischio:** meno Impatti impagabili e meno attesa; l'anticipo del raro può evitare un finale reciproco, ma quantità elevate di V e Posacenere rendono possibili picchi letali. Estendere l'esposizione al CUT espone davvero contro Mara. Controllare il 45–55% fra i due base e Spazienzio–Piera lungo; non dedurre meno patte dal solo aumento dei danni. La formula del raro usa già il tipo di quantità `base + risorsa/divisore`; qui cambiano base 6→20 e la ricerca, non la meccanica di calcolo.

## Mara — taglio affidabile e picco sulla A residua

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Slalom d'avvicinamento, MAR-AR5 (`base.mara.Slalom`) | 2; **NC** (da R) | Gratuita | 2; sé | ×1,5, gettone D69 | `base.mara.Sgommata` |
| Sgommata, MAR-AR2 (`base.mara.Sgommata`) | 2; **NC** (da C) | 15 A | 1; un avversario | — | Nessuna |
| Ti stringo la curva, nuovo MAR-AR6 (`base.mara.TiStringoLaCurva`, ID proposto) | 1; NC | Gratuita | 2; sé | ×1,5, gettone D69 | `base.mara.CinghiataDiTraverso` |
| Cinghiata di traverso, MAR-AR1 (`base.mara.CinghiataDiTraverso`) | 1; **R** (da C) | **20 A** (da 5) | 1; un avversario | — | Nessuna |

**Slalom d'avvicinamento — testo:**

> Guadagni 20 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Sgommata. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**Sgommata — testo:**

> Infliggi 25 danni da taglio al bersaglio.

**Ti stringo la curva — testo:**

> Guadagni 30 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Cinghiata di traverso. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**Cinghiata di traverso — testo:**

> Infliggi al bersaglio danni da taglio pari a 20 più metà della tua A rimasta dopo il costo, arrotondata per difetto.

**Finanziamento e picco.** Da A=L=0, il NC arriva a N+1 con A=20; paga 15 e resta a 5. Il raro arriva con A=30; paga 20 e resta a 10, per **25 CUT**. Conservando invece i 40 A iniziali e aggiungendo il suo tutore arriva ad A=70, paga 20, resta a 50 e fa **45 CUT**. Quei 50 A contano anche per la precedenza a priorità 1: il costo maggiore paga sia picco sia velocità residua. NC 25 CUT resta circa 3,6 unità nominali, aggira la corazza ed è già potente; non ne aumento il danno. L ricevuta o sottrazioni avversarie di A possono impedire il seguito: è interazione legittima, non finanziamento garantito contro ogni disturbo.

**Sostituzioni:** Slalom 1→2 ed entra 1 Ti stringo la curva; Cinghiata di traverso 2→1 e Spintone 2→1. Quindi nessun titolo sparisce, ma escono una copia del vecchio attacco economico e una del colpo gratuito. La rara passa dallo slot Slalom alla Cinghiata, senza aggiungere una seconda rara personale nello starter. Restano Sorpasso in curva, Tra due paraurti, Tartaruga e Steal. Titoli distinti 12→13.

**Atteso e rischio:** due attacchi a basso impegno in meno, più preparazioni visibili e un solo picco raro. Possibile riduzione della durata, ma il picco a priorità/A elevate può rendere ancora peggiore il 65,3% di Mara contro Piera nelle decisive della variante (c). Prima di alzare ulteriormente CUT o A, verificare anche il 45–55% contro Spazienzio. La formula variabile usa operazioni già presenti nella bozza; la trasformazione della Cinghiata è un funzionamento da approvare, non una sola taratura di danno.

## Celestina — POISON diretto NC e raro di travaso

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Dose in preparazione, TOS-AR1 (`junkie.MethDrivenRage`) | 2; **NC** (da C) | Gratuita | 1; sé | ×1,5, gettone D69 | `junkie.Cough` |
| Tossicone Scatarrante, TOS-AR2 (`junkie.Cough`) | 2; **NC** (da C) | 10 T | 1; un avversario | — | Nessuna |
| Un assaggino, nuovo TOS-AR6 (`base.tossico.UnAssaggino`, ID proposto) | 1; NC | Gratuita | 1; sé | ×1,5, gettone D69 | `junkie.ToxicBloodDrain` |
| C'è del sangue nella mia droga, TOS-AR5 (`junkie.ToxicBloodDrain`, riferimento dello slot) | 1; R | 10 T | 1; un avversario | — | Nessuna |

**Dose in preparazione — testo:**

> Guadagni 10 T e 5 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Tossicone Scatarrante. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**Tossicone Scatarrante — testo:**

> Infliggi 18 danni da veleno al bersaglio. Il bersaglio guadagna 5 T.

**Un assaggino — testo:**

> Guadagni 20 T. Al posto della pesca che segue questa mossa cerca nel tuo mazzo C'è del sangue nella mia droga. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**C'è del sangue nella mia droga — testo:**

> Dopo il costo, trasferisci tutta la tua T residua al bersaglio e togli al bersaglio l'immunità agli effetti della T. Infliggi anche 12 danni da veleno al bersaglio. Alla fine di questo turno ottieni l'immunità agli effetti della T.

**Ordine concreto del raro:** memorizza la T dopo il costo, azzera quella dell'autore, rimuove l'immunità a T del bersaglio, gli aggiunge la quantità memorizzata e infligge i 12 POISON diretti. Conserva il timer attuale di un turno: dà immunità **all'autore**, non al bersaglio. Non si introduce qui una restituzione dell'immunità al bersaglio o una durata nuova della sua perdita. Il timer si risolve dopo il veleno periodico secondo R06/D50: se l'autore aveva perso l'immunità, ottenerla a fine turno non lo protegge retroattivamente dal periodico appena dovuto. Questo dettaglio già presente nel travaso non è una cura.

**Finanziamento e picco.** T non decade. Da T=0, Dose lascia 10 e Un assaggino 20, sufficienti per il costo 10. Il NC garantisce **18 POISON diretti**, circa 2,6 unità nominali, anche contro l'immune a T; i +5 T sono un effetto separato. Il raro da zero, dopo il suo tutore e il costo, trasferisce 10 T: contro un bersaglio senza T sono 12 diretti e 5 periodici alla sua fase di fine turno, prima degli stati. Con i 15 T iniziali di Celestina conservati più il tutore, trasferisce **25 T**: su un bersaglio a T=0 il primo periodico è 12, quindi 24 nominali nel turno, più i periodici successivi; su un'altra Celestina ancora a T=15 si arriva a T=40 e 20 periodici, più i 12 diretti. Il picco dipende da T accumulata e T/immunità avversarie, non da una semplice etichetta di rarità. Più danni periodici non equivalgono a danno garantito: l'avversario può ridurre POISON o azzerare T.

**Sostituzioni:** entra 1 Un assaggino, esce 1 Rincorsa dal marciapiede (2→1). Restano il travaso nello stesso slot raro, due Metabolismi, due Riflessi e Steal. Titoli distinti 12→13. L'altro oggetto raro, Mescolone Micidiale, resta: «un colpo raro» non significa «una sola carta rara complessiva nello starter».

**Atteso e rischio:** si cerca di abbreviare lo specchio oggi a 18,22 turni/18,57% di patte con pressione che funziona anche sugli immuni e un po' di A differente. La T può però finanziare più cure; già in SB-16e spegnere il caricamento accorciava lo specchio, quindi altra T da sola non risolve. Il raro colpisce direttamente e lascia un veleno persistente: rischio importante di dominio o morti reciproche nello stesso fine turno, soprattutto contro bersagli esposti. La candidata D67 offre a Piera una risposta; il solo miglioramento del danno non prova i criteri. I 12 POISON aggiunti al travaso richiedono un adattamento specifico della carta nel playground, dichiarato nella sezione tecnica.

## Piera — spendere la L per due chiusure differenti

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Un altro e arrivo, PIN-AR4 (`base.pino.OffroIo`) | 2; NC | Gratuita | 1; sé | ×1,5, gettone D69 | `base.pino.GoingBerserk` |
| Estasi da Coca Etilene, PIN-AR2 (`base.pino.GoingBerserk`) | 2; **NC** (da C) | Gratuita | 1; un avversario | — | Nessuna |
| Prima il brindisi, nuovo PIN-AR6 (`base.pino.PrimaIlBrindisi`, ID proposto) | 1; NC | Gratuita | 1; sé | ×1,5, gettone D69 | `base.pino.RuttoADistanzaSociale` |
| Rutto a distanza sociale, PIN-AR5 (`base.pino.RuttoADistanzaSociale`) | 1; R | 5 L | 1; un avversario | — | Nessuna |

**Un altro e arrivo — testo:**

> Guadagni 25 L e 35 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Estasi da Coca Etilene. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**Estasi da Coca Etilene — testo:**

> Spendi tutta la tua L. Infliggi al bersaglio danni da colpo pari a 18 più la L spesa in questo modo.

**Prima il brindisi — testo:**

> Guadagni 35 L e 35 A. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Rutto a distanza sociale. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**Rutto a distanza sociale — testo:**

> Spendi tutta la tua L rimasta dopo il costo. Il bersaglio perde A pari alla L spesa in questo modo. Infliggi al bersaglio danni da colpo pari a 20 più il doppio di quella L.

**Ordine concreto dei due colpi:** Estasi conserva la semantica attuale della classe: memorizza L alla risoluzione e la azzera su sé prima degli effetti sul bersaglio. Il nuovo Rutto memorizza L dopo il costo di 5, la azzera su sé e usa quel valore sia per sottrarre A sia per il danno. «Spendi tutta» è un effetto di azzeramento, distinto dal costo: non richiede L positiva per Estasi e non trattiene la corazza per il resto della mossa o del turno. Il Rutto conserva il disturbo di A ma diventa un vero colpo che scarica tutta la riserva; non si modifica per sbaglio la last resort, che resta base 12 e autodanno 2.

**Finanziamento e picco, dopo R06:** da L=A=0, +25 L/+35 A lascia **L=12, A=23** in N+1: Estasi costa zero e fa **30 HIT**. +35 L/+35 A lascia **L=17, A=18**: il raro paga 5, memorizza 12, toglie 12 A e fa **44 HIT**. Non si usano i 35 L appena guadagnati come se non decadessero. Dai valori iniziali L=10/A=15, i due caricamenti lasciano rispettivamente **L=17/A=33** (Estasi 35 HIT) e **L=22/A=28** (Rutto: costo 5, residuo 17, **54 HIT** e −17 A). Il raro ha un picco più alto ma perde più precedenza nella preparazione e richiede almeno 5 L.

**Sostituzioni:** entra 1 Prima il brindisi; Fasciatura col fazzolettaccio 2→1. Rimangono due Testate, due Banconi, Rutto nello slot raro, una Fasciatura, Spintoni e tutti gli oggetti. Titoli distinti 11→12.

**Atteso e rischio:** meno cura ripetuta, recupero A e chiusure più forti possono ridurre i 14,83 turni/13,07% di patte dello specchio e gli incontri lunghi. La L del caricamento dà anche corazza e consuma A; il raro può fare molto danno ma costa l'intera riserva, compresa la protezione contro l'HIT. Se si rinvia, L decade ancora e il raro può diventare impagabile; per liberare il gettone occorre finanziare e giocare quel nome con oggetti o altri caricamenti. Lo scarto per una bound sacrifica la carta ma non libera il gettone. Non si nasconde questa pressione sotto la promessa di poter aspettare senza conseguenze. Con D69, scartare il raro non libera il gettone: se la L scende sotto 5 e mancano altre fonti di L, la penalità può restare fino a fine partita. Giocare invece Estasi costa zero e può soddisfare il suo nome anche a L=0. Il nuovo Bancone può offrire una difesa nel turno dell'annuncio, ma prolungare gli incontri: i due interventi vanno separati nelle misure.

## Beppe — NC indipendente dagli oggetti, raro da tavolo preparato

| Carta e slot | Copie; rarità | Costo | Priorità; bersaglio | Vulnerabilità propria | Ricerca esatta |
|---|---|---|---|---|---|
| Preparo il lavoro, GIG-AR3 (`base.gigi.ColpoDiChiaveInglese`) | 2; **NC** (da C) | Gratuita | 1; sé | ×1,5, gettone D69 | **`base.gigi.ChiaveDaTredici`** (nuova destinazione) |
| Chiave da tredici, GIG-AR2 (`base.gigi.ChiaveDaTredici`) | 2; **NC** (da C) | **10 V** (da 5) | 1; un avversario | — | Nessuna |
| Una stretta di prova, nuovo GIG-AR6 (`base.gigi.UnaStrettaDiProva`, ID proposto) | 1; NC | Gratuita | 1; un avversario; guadagno/esposizione su sé | ×1,5, gettone D69 | `base.gigi.LavoroFattoBene` |
| Lavoro fatto bene, GIG-AR5 (`base.gigi.LavoroFattoBene`) | 1; R | **10 V** (da 5) | 1; un avversario | — | Nessuna |

**Preparo il lavoro — testo:**

> Guadagni 15 V. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Chiave da tredici. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

**Chiave da tredici — testo:**

> Infliggi 22 danni da taglio al bersaglio.

**Una stretta di prova — testo:**

> Guadagni 10 V e infliggi 4 danni da taglio al bersaglio. Al posto della pesca che segue questa mossa cerca nel tuo mazzo Lavoro fatto bene. Se lo trovi, mostralo a tutti e metti su di te un gettone legato a quel nome: moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi. Il gettone non ha scadenza; il colpo mostrato ne resta un promemoria. Quando giochi una carta con quel nome, anche un’altra copia e anche se la mossa è parata o annullata, rimuovi alla fine di quel gruppo di velocità un solo gettone per quel nome, il più vecchio. Scartare non lo rimuove. Se non lo trovi, pesca normalmente e ricevi invece la stessa vulnerabilità solo per questo turno e il prossimo, senza legarla a un nome.

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

**Perché questa carta:** Piera è sotto quota contro Celestina e ha già due copie della difesa, quindi non serve aggiungere uno slot o distribuire la stessa generica a tutti. Una protezione gratuita resta giocabile anche quando A è a zero. Conserva il premio previsto da D52/D67 e la possibilità di difendersi nel turno dopo il caricamento, mantenendo il colpo cercato e la relativa vulnerabilità. Il +5 L può finanziare un seguito più forte, ma la L continua a decadere e non rimuove il gettone D69: serve giocare il nome corrispondente.

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

**Il supporto richiesto alla revisione 2a è quello di D69:** gettone sul giocatore legato al nome, senza timer; giocata anche di un'omonima e anche annullata/parata che soddisfa il gettone più vecchio a fine gruppo; scarto che non libera; ricerca fallita con gettone anonimo N/N+1; carta mostrata come promemoria della vista. La consegna iniziale 2a era legata alla copia e non va riutilizzata come contratto definitivo. Prima della 2b verificare la consegna della revisione D69, senza richiedere un selettore della copia fisica o una durata minima per i gettoni legati. Nomi degli ID nelle schede e ricerche esatte restano proposti; non si prescrivono qui campi JSON in concorrenza con l'altro esecutore.

**Dati già esprimibili:** i cinque nuovi tutori usano guadagni, esposizione collegata e ricerca esatta della 2a; la carta offensiva di Beppe aggiunge danno al bersaglio. NC e rari di Spazienzio/Mara usano danni fissi o `base + risorsa/divisore`; Preparo cambia esplicitamente la sua destinazione da Lavoro a Chiave. Chiave cambia costo/danno e rarità. Estasi e Lavoro riusano le classi parametriche con base/per-oggetto aggiornati. Bancone richiede uno stato POISON del turno in aggiunta a quello HIT, con il guadagno L esistente. Nessuno di questi introduce una nuova risorsa o parola chiave (D8).

**Due adattamenti specifici di carta, costo dichiarato:**

1. **C'è del sangue nella mia droga:** serve una versione di bozza del travaso con quantità di POISON diretto parametrica, inizialmente 12, oltre a memorizzazione/trasferimento/immunità e timer già esistenti. Costo contenuto ma reale: una variante di carta, metadati e test su ordine, immune/non immune e timer. Non basta cambiare la descrizione; non si modifica silenziosamente la classe usata dalla partita viva.
2. **Rutto a distanza sociale:** serve memorizzare L dopo il costo, azzerarla e usare il valore per due effetti diversi sul bersaglio: perdita A e danno `20 + 2×L`. La sola lista di effetti su sé viene prima di quella sul bersaglio, quindi un `empty L` più una quantità letta dopo vedrebbe zero. Costo medio: una carta parametrica di bozza con snapshot della risorsa, secondo il modello già usato da Estasi/travaso, più test della formula e della corazza persa. Non serve introdurre un nuovo operatore generale del motore o una condizione sulla ricerca.

Questi sono effetti di carta composti da meccaniche esistenti, non nuove regole generali assegnate alla 2a. Se l'implementazione richiedesse invece una modifica del motore condiviso, il passo 0 deve dichiararla e fermarsi su quel punto. I binding di riferimento delle carte esistenti non devono portare il loro nuovo effetto nella partita viva; l'eventuale mappatura a classi di bozza va descritta e testata in 2b.

**Bozza e verifiche future:** dopo approvazione, aggiornare effetti, priorità, costi, rarità, copie, descrizioni, ruoli e metadati dei guadagni/danni nella stessa modifica, insieme alla griglia sperimentale. Nessuna modifica agli attesi per accettare regressioni. Nei test mirati coprire:

- le dieci ricerche esatte e il requisito da zero attraverso il fine turno, non soltanto subito dopo il guadagno;
- ricerca riuscita senza minimo o timer; giocata della carta trovata o di un’altra omonima, anche parata/annullata; rimozione soltanto a fine gruppo e danni ancora amplificati nello stesso gruppo; due gettoni dello stesso nome e rimozione di uno solo, il più vecchio;
- scarto per bound risolta/annullata che non soddisfa mai il gettone, anche se si perde l’unica copia; ricerca fallita con gettone anonimo per N/N+1 che una giocata omonima non libera; promemoria conservato fino al suo gettone, rimosso anche quando si gioca un’altra copia; pulizia a fine partita/eliminazione/forfait. Riutilizzare le prove della revisione 2a D69 senza duplicarne tutta l’implementazione;
- rare di Spazienzio/Mara prima/dopo il costo e soglie del picco; anticipo del raro di Spazienzio e A residua di Mara;
- travaso: T memorizzata dopo il costo, autore azzerato, immunità del bersaglio rimossa, POISON diretto distinto dal periodico e timer di immunità **all'autore**;
- Estasi/Rutto: esempi da 0 e dai valori iniziali, L azzerata, A sottratta senza riordinare gruppi già fissati, nessuna variazione alla last resort;
- Lavoro con 0–3 oggetti, token/equip distinti, furto/distruzione e consumi prima del suo gruppo;
- Bancone: POISON diretto e periodico, esposizione, arrotondamenti, priorità 2 e guadagno di 5 L anche senza attacco; costo gratuito anche ad A=0;
- liste da 20, copie massime due, rarità delle due coppie, set da 120 e isolamento del profilo vivo. Mutazioni solo sui nuovi rami di logica che verranno davvero introdotti.

**Bot e misure:** mantenere i quattro stili e confrontare le tre politiche decise, «gioca sempre il turno dopo», «tieni se l'avversario si è parato», «a caso». «Si è parato» usa ultimo turno risolto/stati pubblici, non la scelta segreta attuale. Ogni politica legge gettoni per nome e promemoria pubblici, distinguendoli dal contenuto certo della mano avversaria: una carta ricordata potrebbe essere stata scartata. Giocare una qualsiasi omonima soddisfa il più vecchio gettone per quel nome; sacrificarla per una bound non libera il gettone, e il bot deve valutare il rischio di scartare l’unica copia. Distinguere colpo legale da impagabile. Valutare anche Rare vs NC, risorse spese altrove, campo oggetti e difesa dal POISON. Nessuna conoscenza del mazzo avversario e nessun pianificatore a più turni.

Il riferimento dei confronti è la variante (c). Separare frequenza/composizione, potenza dei colpi e difesa POISON con ablazioni prefissate entro il budget di **tre giri/due ore cumulative di calcolo** di 2b, non un lotto aggiuntivo implicito per ogni idea. I caricamenti visti, risolti, le ricerche riuscite/mancate, i colpi NC/rare giocati subito/dopo o scartati, i gettoni per nome soddisfatti/restanti, le esposizioni subite e il danno parato devono avere denominatori separati. Contare anche durata dei gettoni, casi persistenti dopo scarto dell’unica copia, rimozione a fine gruppo e temporanei da ricerca fallita. Per il raro singolo misurare esplicitamente i tutori che cercano a vuoto. Anche il turno offensivo di Una stretta di prova va distinto dal danno successivo di Lavoro.

Restano D16/D51: **45–55% fra i base, 40–60% negli altri incontri, circa 6–12 turni, patte ≤10% in ogni incontro/specchio**, pochi mazzi esauriti, zero turni senza mosse legali, otto invarianti a zero e tetto bound invariato. Quota sulle decisive, patte su tutte le partite; una media globale buona non sana una cella fuori criterio. La variante (c) non li raggiunge: specchi Celestina/Piera, quote contro Piera e sei durate oltre 12. Non si attribuisce al nuovo progetto un esito già misurato. Se criteri o budget non tornano, STOP con dati e proposta. Dopo i bot resta la breve prova umana prima di SB-17.

## Verifiche e limiti di questa consegna

**Allineamento 1.1 a D69:** base `9e4efce`, fetch riuscito, nessun commit remoto da integrare; checkout già con modifiche dell'altro esecutore per la revisione 2a. Questo lavoro modifica e committa soltanto `docs/design/set-base/sb-16g-proposta.md`, senza includere modifiche o file già in staging dell'altro esecutore. Non sono stati avviati server, Maven o verifiche client in concorrenza con la 2a.

Confronto documentale con la versione 1.0: invariati tabella iniziale delle coppie, costi/priorità/bersagli/ricerche, risorse, danni, liste e tabella di finanziamento. Cambiano i dieci testi dei tutori e il contratto della penalità, i rischi, le indicazioni per bot e verifiche future. Restano cinque liste da 20, massimo due copie, titoli distinti 13/13/13/12/13 e totale progettuale 120 (45 C/55 NC/20 R). Sono calcoli nominali, non una simulazione.

**Controlli documentali dell'allineamento:** il documento ha 0 link rotti; `git diff --check` è verde. Il controllo globale `python scripts/check-links.py` trova per ora **293 documenti e 1 link rotto** nel rapporto della 2a: `docs/reports/set-base/sb-16g-2a-report.md:85` punta al test `VulnerabilitaD59Test.java`, rinominato dall'altro esecutore in `VulnerabilitaD69Test.java` durante la revisione. Questo documento non introduce quel riferimento e non corregge il rapporto altrui. La precedente segnalazione della versione 1.0 sul rapporto 2a mancante non è più attuale: il rapporto è ora presente. I controlli vengono ripetuti sul testo finale prima del commit.

Non eseguiti in questo allineamento documentale: suite server/client, contesto Spring completo, avvio reale, Playwright, giri di bilanciamento, FFA e prove umane. Non si attribuiscono alla revisione D69 gli esiti applicativi della consegna 2a precedente. Nessun atteso o soglia modificato, nessuna bozza alternativa scritta, nessun push.

**STOP: nessuna carta nella bozza prima dell'approvazione.** La 2a parallela non approva implicitamente le carte o le liste qui proposte.

## Domande numerate al proprietario

1. **Approvi le cinque coppie NC/rare concrete, con questi testi, costi, priorità e destinazioni di ricerca?** Tutti i caricamenti sono NC e partono da ×1,5 con il gettone D69, senza timer se la ricerca riesce e temporaneo N/N+1 se fallisce; lo scarto non libera la penalità. Le risorse bastano da zero dopo il fine turno. I NC sono affidabili; il raro può rendere meno al minimo e avere un picco maggiore con preparazione/tavolo. In particolare Cinghiata diventa rara a danno variabile, il travaso di Celestina aggiunge 12 POISON e Rutto scarica tutta la L per danno e disturbo. I numeri restano indicativi sotto D38.
2. **Approvi le sostituzioni e le cinque liste da 20, senza eliminare difese e contromosse personali?** Escono una copia di SPEDIAMOTI DUNQUE IN O-AHIO, una Cinghiata e uno Spintone da Mara, una Rincorsa da Celestina, una Fasciatura da Piera e due Mattoni da Beppe. Entrano solo cinque titoli nel pool, uno per starter; il set resta da 120 con **45 C / 55 NC / 20 R**. Il maggiore numero di NC e i 12–13 titoli distinti per starter sono dichiarati, senza compensazioni nascoste su altri slot.
3. **Approvi «Il bancone regge, io pure» anche contro POISON ×0,5**, diretto e periodico del turno, conservando gratuità, priorità 2 e +5 L? È la candidata D67 per dare a Piera una risposta al veleno; il rischio di allungare gli incontri va misurato separatamente. Nessuna immunità aggiunta né riduzione del CUT.

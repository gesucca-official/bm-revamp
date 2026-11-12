# SB-16d — Proposta per i cinque starter

**Versione 0.2 — 12 novembre 2026. Proposta 0.1 approvata; approvazione registrata, attuazione non eseguita.**

| Starter | Cambi proposti | Coppia con ricerca | Scopo principale |
|---|---|---|---|
| Spazienzio, «Pazienza finita» | PAZIENZA: FINITA cerca il colpo; Tartaruga cura 3 | PAZIENZA: FINITA → GARGANTUESCO IMPATTO SUL TU (2 caricamenti / 2 colpi) | Rendere leggibile la carica già esistente e utile la difesa |
| Mara, «Consegna sul muso» | Slalom diventa caricamento; Paraurti dà +5 A; Tartaruga cura 3 | Slalom d'avvicinamento → Sgommata (1 / 2) | Scegliere fra caricare A, spenderla e conservarla per arrivare prima |
| Celestina, «Tutto è droga» | Rabbia Psicotica diventa caricamento; Tossicone passa da 8 a 12 POISON | Dose in preparazione → Tossicone Scatarrante (2 / 2) | Un attacco annunciato che conta anche nello specchio immune alla T |
| Piera, «Chiude quando dico io» | Offro io diventa caricamento di L e A, con esposizione | Un altro e arrivo → Estasi da Coca Etilene (2 / 2) | Spendere L per chiudere prima; creare differenze di A anche nel finale |
| Beppe, «Intervento sul posto» | Colpo di chiave diventa caricamento; Sotto il cofano dà +5 V | Preparo il lavoro → Lavoro fatto bene (1 / 1) | Annunciare il colpo legato agli oggetti e rendere utile la copertura |

**Nove slot distinti cambiano:** GEN-13, SPA-AR3, MAR-AR4, MAR-AR5, TOS-AR1, TOS-AR2, PIN-AR4, GIG-AR3, GIG-AR4.
Sono rispettivamente **2, 3, 2, 1 e 2 carte distinte per starter**, contando Tartaruga in entrambi i mazzi base.
Le quantità nella tabella sono copie già presenti: nessuna sostituzione di slot nella composizione, nessun aumento delle 20 regolari,
nessun cambio di rarità, basic, bound o last resort. I numeri sono punti di partenza per SB-16e, sotto la delega D38/D53.

## Approvazione del proprietario

Il 12 novembre 2026, dopo il riepilogo dei cinque starter e delle tre domande finali, il proprietario ha risposto:

> approvo, poi cmq le ritestiamo estensivamente

Sono approvati i nove slot e le cinque coppie descritti nella proposta 0.1, compreso il recupero di A di Piera,
le esposizioni per due turni, la ricerca esatta e i premi delle tre difese. Copie, rarità e composizione restano quelle proposte.
I numeri sono indicativi: l'approvazione non certifica il bilanciamento né il raggiungimento del 10% di patte.
La richiesta di ritestare estesamente si applica alle misure di SB-16e (coppie attive/disattive, tutti gli incontri e gli specchi,
stili, patte, durata e invarianti) e alla prova umana SB-16f. Restano i limiti di D53: al massimo tre giri e due ore di calcolo;
nessun ampliamento del budget è stato deciso.

**Consegna arrivata da SB-16c:** il blocco è concluso e le risposte del proprietario sono registrate in
[D54](../../set-base-plan.md#decisioni-del-proprietario). D54 richiede anche di correggere CinqueMinutiEVado di Piera:
con la corazza vale 8,50 per uso, oltre il tetto 4. La correzione non era nei nove slot della proposta 0.1 presentata e approvata;
va integrata nella successiva parte di SB-16d, mantenendo il tetto. Non si considera approvato qui un funzionamento non presentato.
La registrazione dell'approvazione conclude soltanto la prima parte: griglia, bozza e codice non vengono aggiornati in questa consegna.

## Perimetro e riferimenti

La proposta applica [SB-16d e D50–D53](../../set-base-plan.md#sb-16d--riprogettazione-dei-cinque-starter-p3-e-p5).
D8 limita le novità alle meccaniche esistenti, con l'eccezione della ricerca già decisa; D34/D35 fissano slot e identità;
D38 delega i numeri; D43/D44 conservavano i problemi degli avanzati fino alla prova umana; D45, punto 7, riserva al proprietario
funzionamento e composizione. L'approvazione del proprietario è riportata sopra; le misure restano da svolgere.

Il «testo di oggi» sotto viene dalla bozza letta sul commit iniziale `d892bc3`, non dalle vecchie ipotesi della griglia:
`server/src/test/resources/set-base/bozza.json`, SHA-256
`c43b37a5385a9b786c00a8c6254cbfaa125a6efba6d3cb782ecd9408de842cda`.
È la stessa bozza delle misure di SB-16b. I testi sono resi in forma da carta, mantenendo costi, priorità e ordine degli effetti.
Le priorità sono indicate separatamente dal testo dell'effetto.

Fonti di progetto: [schede](schede-personaggi.md), [griglia](griglia.md), [listino](listino.md),
[rapporto SB-16b, Fase B](../../reports/set-base/sb-16b-report.md#fase-b--decisioni-e-misure-aggiuntive),
[confronto alcol](../../reports/set-base/sb-16b/fase-b/confronto-alcol.md),
[confronto pavimento](../../reports/set-base/sb-16b/fase-b/confronto-pavimento.md) e
[contatori](../../reports/set-base/sb-16b/fase-b/contatori.txt).
Il [Set Base 0.1](../../sets/base.md) resta il documento normativo della partita viva: non contiene questi starter di bozza.

**Cancello:** dopo l'approvazione del proprietario **e dopo SB-16c** si potranno aggiornare griglia e bozza e implementare le carte.
Questa consegna modifica soltanto questo documento; non aggiorna piano, schede, listino, regolamento, set, catalogo, server o test.

## Contratto delle cinque coppie

- Il caricamento è una regolare che bersaglia sé stessi, con risorse e uno stato negativo pubblico che nomina il colpo cercato.
  Non nasce una risorsa «carica» e non si introduce una parola chiave. Il colpo resta giocabile anche senza caricamento e conserva
  lo stesso effetto: la coppia procura risorse e accesso alla carta, senza un bonus condizionale nascosto.
- La ricerca riguarda **un solo ID esatto**, quello indicato sulla carta. Sostituisce soltanto la pesca che segue quella mossa:
  prende una copia ancora nel mazzo, la mostra all'avversario e la mette in mano; se non c'è, avviene la pesca ordinaria.
  Nessun recupero dagli scarti, nessuna pesca supplementare, nessuna ricerca su nomi o famiglie. Il resto segue il contratto di SB-16c.
- Un caricamento annullato non applica i suoi effetti né prenota la ricerca. Si esegue la pesca ordinaria prevista per la mossa annullata.
- Se una copia è già in mano ma un'altra è nel mazzo, la ricerca trova quella nel mazzo. Se entrambe sono fuori, si pesca normalmente.
  Questo può procurare un doppione: è un costo da misurare, particolarmente per le coppie con una sola copia del colpo.
- L'esposizione dura **questo turno e il successivo** (`turns: 1`, D38). Parte quando il caricamento si risolve: non modifica
  retroattivamente un attacco già arrivato. Resta fino alla sua scadenza anche se il colpo manca, viene scartato, è annullato o
  si sceglie invece una difesa. Gli stati si cumulano secondo R05; ricaricare subito può sovrapporre due esposizioni.
- Con D50, chi è già a terra all'inizio del proprio gruppo non può far partire il colpo. Il caricamento su sé stessi può ancora
  risolversi, ma da solo non cura e non salva. Le mosse dello stesso gruppo restano simultanee. Il salvataggio tramite cure resta.
- Nessuna carta nuova spende HEALTH o richiede risorse negative. «Perdi X» significa perdere al massimo ciò che si possiede;
  nessun testo usa `abs`. La corazza sottrae L/4 intero **dopo gli stati**, soltanto all'HIT, anche a sé. L'esposizione non la disattiva.

**«Ultimo colpo».** Non propongo questa eccezione per le coppie o per le last resort: aumenterebbe i colpi reciproci che D51 chiede
di ridurre. Se in seguito una carta la richiederà, dovrà riportare per esteso, sulla carta:

> Ultimo colpo: puoi pagare questo costo in salute anche se ti porta a zero; questa mossa si risolve anche se sei già a terra.

È il testo di un'eccezione R00, non una nuova parola chiave. I 5 HIT a sé di Struggle, L'ultima dose e L'ultimo giro sono effetti,
non costi in HEALTH: se l'autore è vivo all'inizio del gruppo, l'autodanno non interrompe la sua mossa; se era già a terra, non attacca.
Non si estende loro implicitamente «Ultimo colpo» e non si aggiunge uno spareggio.

## Difesa condivisa: GEN-13

### Tartaruga sul marciapiede — Spazienzio 2 copie, Mara 1

**Oggi → nuova:** stesso nome, costo **5 A**, priorità **2**, bersaglio sé stessi, rarità C.

> Oggi: in questo turno moltiplica per 0,6 i danni da colpo e da taglio che ricevi.

> Nuova: in questo turno moltiplica per 0,6 i danni da colpo e da taglio che ricevi. Recuperi 3 salute.

**Principio:** P3/D52. Anche contro una preparazione altrui lascia una piccola cura. Non genera la risorsa specifica di un solo
personaggio, perché è generica. **Effetto atteso:** una risposta utile ai colpi annunciati, soprattutto contro Mara e Beppe;
la cura può però allungare gli incontri. Non è una leva autonoma contro le patte e va misurata separatamente dalle coppie.

**Bozza e bot:** aggiungere `gain HEALTH 3` dopo i due `status` esistenti (`turns: 0`); aggiornare descrizione e `gui.gains`.
Nessuna classe nuova. Il bot considera cura effettiva e danno evitabile, senza presumere che il colpo mostrato verrà giocato subito.

## Spazienzio — una sola modifica personale

### SPA-AR3 — PAZIENZA: FINITA → PAZIENZA: FINITA

Due copie, C, gratuita, priorità **0**, bersaglio sé stessi.

> Oggi: per questo turno e il prossimo moltiplica per 1,5 i danni da colpo che ricevi. Guadagni 15 V e 15 A.

> Nuova: per questo turno e il prossimo moltiplica per 1,5 i danni da colpo che ricevi. Guadagni 15 V e 15 A.
> Al posto della pesca che segue questa mossa, cerca nel tuo mazzo GARGANTUESCO IMPATTO SUL TU e mostralo all'avversario.
> Se non c'è, pesca normalmente.

**Colpo della coppia, SPA-AR1, invariato:** GARGANTUESCO IMPATTO SUL TU (`bruiser.SuperImpact`), due copie C,
costo **25 V**, priorità **0**, avversario.

> Infliggi 40 danni da colpo al bersaglio.

**Principio:** P5/D52 con il minimo cambiamento: il rischio di due turni esiste già, manca soltanto la ricerca.
Lo stato pubblico deve associare PAZIENZA: FINITA al nome del colpo. Si preservano maiuscole, attacco lento e contromossa FAI BASTA.
**Effetto atteso:** meno turni di sola accumulazione e più risposte leggibili. Non si aumenta il danno per compensare subito
la corazza: contro Piera la quota attuale è 0,334, quindi sarà probabilmente necessaria anche la leva numerica su Piera in SB-16e.
La ricerca può intasare la mano di un'altra carta da 25 V: non è un miglioramento gratuito.

**Bozza e bot:** mantenere tutti i passi attuali di Glare e aggiungere il passo di ricerca esatta di SB-16c per `bruiser.SuperImpact`.
Nessuna classe nuova; SPA-AR1 non cambia. Il bot calcola se può pagare 25 V il turno dopo e se può sopravvivere fino al gruppo
lento; chi vede lo stato può difendersi, annullare o colpire durante l'esposizione. Non si forza il colpo cercato.

## Mara — caricare A senza perdere la contromossa

### MAR-AR5 — Slalom → Slalom d'avvicinamento

Una copia R. **Oggi:** 10 A, priorità 2, avversario. **Nuova:** gratuita, priorità **2**, sé stessi.

> Oggi: infliggi al bersaglio danni da taglio pari a 5 più metà della tua A rimasta dopo il costo, arrotondata per difetto.

> Nuova: guadagni 15 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi.
> Al posto della pesca che segue questa mossa, cerca nel tuo mazzo Sgommata e mostrala all'avversario.
> Se non c'è, pesca normalmente.

**Colpo della coppia, MAR-AR2, invariato:** Sgommata (`base.mara.Sgommata`), due copie C,
costo **15 A**, priorità **1**, avversario.

> Infliggi 25 danni da taglio al bersaglio.

**Principio:** P5. Si cambia la rara anziché Sorpasso in curva: Mara conserva la contromossa che toglie A senza annullare.
Il picco della rara è condizionato a spendere due turni e superare l'esposizione, non ad avere molto danno sulla carta stessa.
**Effetto atteso:** ripristinare A per Sgommata o per la precedenza; il CUT evita la corazza di Piera. Può ridurre il 12,1% di patte
Mara–Piera arrivando al finale con A diverse. Rinunciare al vecchio Slalom toglie però un colpo rapido: il rapporto fra i due base
va ricontrollato nel 45–55%, senza presumere un rafforzamento di Mara.

**Bozza e bot:** sullo stesso binding `base.mara.Slalom`, sostituire costo, bersaglio, ruolo (`RESOURCES`) ed effetti con `gain A 15`,
tre `status BAD INPUT` (HIT, CUT, POISON; fattore 1,5; `turns: 1`) e ricerca di `base.mara.Sgommata`.
Niente classe nuova. Il nome visibile degli stati deve indicare «Slalom d'avvicinamento → Sgommata».
Il bot distingue l'A guadagnata dagli ordinamenti del turno: il guadagno non ricalcola i gruppi già fissati dopo i costi.

### MAR-AR4 — Tra due paraurti → Tra due paraurti

Due copie NC, costo **5 A**, priorità **2**, sé stessi.

> Oggi: in questo turno moltiplica per 0,4 i danni da colpo e da taglio che ricevi.

> Nuova: in questo turno moltiplica per 0,4 i danni da colpo e da taglio che ricevi. Guadagni 5 A.

**Principio:** P3. Il guadagno restituisce la moneta pagata anche quando l'avversario prepara; il costo resta necessario all'invio.
**Effetto atteso:** una parata sostenibile prima di Sgommata, ma non una generatrice netta di A. Può anche prolungare Mara–Piera:
non attribuirle da sola una riduzione delle patte.

**Bozza e bot:** aggiungere `gain A 5` agli stati attuali, aggiornare `gui.gains`; nessuna classe nuova.
Il bot paga comunque 5 A e calcola la precedenza con A dopo il costo, senza anticipare il rimborso.

## Celestina — il veleno diretto conta anche nello specchio

### TOS-AR1 — Rabbia Psicotica da Meth → Dose in preparazione

Due copie C. **Oggi:** 10 T, priorità 1, avversario. **Nuova:** gratuita, priorità **1**, sé stessi.

> Oggi: subisci 5 danni da colpo; infliggi 15 danni da colpo al bersaglio.

> Nuova: guadagni 15 T. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi.
> Al posto della pesca che segue questa mossa, cerca nel tuo mazzo Tossicone Scatarrante e mostralo all'avversario.
> Se non c'è, pesca normalmente.

**Principio:** P5; accumulare T non è più sempre sicuro grazie all'immunità. L'immunità al periodico di T resta, ma non protegge
contro il POISON diretto amplificato dall'esposizione. Metabolismo Corrotto e Riflessi Aumentati dalla Speed conservano cura e contromossa.
**Effetto atteso:** nello specchio l'altra Celestina può punire la preparazione con Tossicone, senza dipendere dalla T periodica
che non le fa danno. Si perde un attacco immediato: il solo caricamento potrebbe rallentare la partita, motivo della piccola
correzione del colpo sotto.

**Bozza e bot:** sul binding `junkie.MethDrivenRage`, sostituire costo, bersaglio, ruolo ed effetti con `gain T 15`, tre stati BAD
INPUT ×1,5 per due turni e ricerca di `junkie.Cough`. Nessuna classe nuova. Stato visibile «Dose in preparazione → Tossicone Scatarrante».
Il bot non valuta la T come danno certo su un immune e considera anche la cura alternativa con Metabolismo.

### TOS-AR2 — Tossicone Scatarrante → Tossicone Scatarrante

Due copie C, costo **10 T**, priorità **1**, avversario. È il colpo cercato.

> Oggi: infliggi 8 danni da veleno al bersaglio; il bersaglio guadagna 5 T.

> Nuova: infliggi 12 danni da veleno al bersaglio; il bersaglio guadagna 5 T.

**Principio:** partite più corte (D51); numero indicativo sotto D38. Non si aumenta la T lasciata all'avversario, che contro gli
immuni non risolve il problema. **Effetto atteso:** più pressione nei quattro incontri oltre soglia che coinvolgono Celestina;
la corazza non sottrae nulla ai 12 POISON. Contro un caricamento esposto ×1,5 sono 18 prima di eventuali altri stati.
È anche un potenziamento del colpo giocato senza ricerca: SB-16e deve separarlo dall'effetto del caricamento.

**Bozza e bot:** cambiare soltanto `damage POISON.amount` da 8 a 12, descrizione e `gui.damageAmount`; nessuna classe nuova.
Il bot usa il danno effettivo dopo gli stati, senza confondere POISON diretto e veleno periodico.

## Piera — uscire dalla simmetria ad A zero

### PIN-AR4 — Offro io → Un altro e arrivo

Due copie NC. **Oggi:** 5 L, priorità 1, avversario. **Nuova:** gratuita, priorità **1**, sé stessi.

> Oggi: il bersaglio guadagna 20 L.

> Nuova: guadagni 15 L e 10 A. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi.
> Al posto della pesca che segue questa mossa, cerca nel tuo mazzo Estasi da Coca Etilene e mostrala all'avversario.
> Se non c'è, pesca normalmente.

**Colpo della coppia, PIN-AR2, invariato:** Estasi da Coca Etilene (`base.pino.GoingBerserk`), due copie C,
gratuita, priorità **1**, avversario.

> Infliggi al bersaglio danni da colpo pari a 10 più la tua L attuale, poi azzera la tua L.

**Principio:** P5 e D51. Offro io adesso regala anche corazza e, contro chi è già ad A zero, non può più rallentare ulteriormente:
è il primo slot da ripensare. Il recupero di A è una scelta di funzionamento da approvare, non un semplice ritocco delegato.
Restano il Bancone (+5 L), Testata e Rutto a distanza sociale come disturbo della A altrui.

**Effetto atteso:** da L=0 e A=0, senza altri effetti, il caricamento porta a L=15 e A=10; a fine turno si perdono 7 A e 8 L:
si arriva al turno dopo con **A=3, L=7**. Estasi può quindi infliggere **17 HIT nominali**, e chi ha caricato può precedere
una Piera ancora ad A zero. Durante la preparazione la corazza vale 3; nel turno dopo vale 1 finché L non viene azzerata.
Spendere L con Estasi toglie la propria corazza ai colpi successivi: il rischio prosegue anche con questa scelta.

È la leva specifica per lo specchio al 36,4% e per Mara–Piera, Celestina–Piera, Piera–Beppe. I tempi diversi di caricamento possono
lasciare A diverse fino alle last resort. **Non basta a garantire il 10%:** due Piera che caricano negli stessi turni restano alla
stessa velocità. Una priorità uguale per entrambe non risolverebbe questa simmetria; serve ridurre l'arrivo al finale ripetitivo.
Contro Spazienzio l'esposizione all'HIT viene prima della corazza, ma parte solo alla risoluzione: il caricamento non è un bersaglio
retroattivo. Le leve numeriche di SB-16e restano prima L iniziale, poi salute (D44/SB-16e), senza alterarle qui.

**Bozza e bot:** sul binding `base.pino.OffroIo`, rimuovere il costo e l'effetto sul bersaglio, impostare SELF/RESOURCES,
aggiungere `gain L 15`, `gain A 10`, tre stati BAD INPUT ×1,5 per due turni e ricerca di `base.pino.GoingBerserk`.
Nessuna classe nuova: il colpo usa già la classe parametrica di SB-14. Stato «Un altro e arrivo → Estasi da Coca Etilene».
Il bot calcola decadimento di L e perdita di A nell'ordine di R06, costo di eventuali alternative e corazza che perderà scaricando L.
Il +10 A non cambia i gruppi del turno del caricamento. Non assume che tutta la L guadagnata sopravviva fino al colpo.

## Beppe — preparare il lavoro, conservando la risposta sugli oggetti

### GIG-AR3 — Colpo di chiave inglese → Preparo il lavoro

Una copia C, gratuita, priorità **1**. Bersaglio da avversario a sé stessi.

> Oggi: infliggi 6 danni da colpo al bersaglio.

> Nuova: guadagni 10 V. Per questo turno e il prossimo moltiplica per 1,5 i danni da colpo, taglio e veleno che ricevi.
> Al posto della pesca che segue questa mossa, cerca nel tuo mazzo Lavoro fatto bene e mostralo all'avversario.
> Se non c'è, pesca normalmente.

**Colpo della coppia, GIG-AR5, invariato:** Lavoro fatto bene (`base.gigi.LavoroFattoBene`), una copia R,
costo **5 V**, priorità **1**, avversario.

> Infliggi al bersaglio danni da colpo pari a 6 più 4 per ogni tuo oggetto sul campo.

**Principio:** P5 senza trasformare Beppe in un secondo Spazienzio. Il colpo cercato vale 6–18 HIT prima degli stati;
gli equip già consumati non contano come oggetti sul campo. Smontiamo tutto e Steal restano le contromosse; rubare o distruggere
un oggetto dopo l'annuncio riduce il colpo. Caricare espone anche al POISON che i suoi equip non fermano.

**Effetto atteso:** procurare il colpo condizionato e la V per pagarlo prima di esaurire il mazzo. La V residua può anche sbloccare
Mattone e SeagullFly, senza cambiare la composizione riservata al proprietario da D45(7). La coppia è volutamente **1 / 1**:
se la rara è già in mano o scartata, la ricerca manca. Nello specchio al 19,4% la scelta fra preparazione, consumo degli oggetti
e attacco può produrre salute e A diverse (consumi di Espresso, costi di Steal). Non aggiungo A al caricamento per forzare una soluzione.
Piera può assorbire il colpo con Bancone e corazza; qui la leva è arrivare prima al colpo e punire l'esposizione, non promettere
che l'HIT attraversi la corazza.

**Bozza e bot:** sul binding `base.gigi.ColpoDiChiaveInglese`, cambiare bersaglio e ruolo, sostituire il danno con `gain V 10`,
tre stati BAD INPUT ×1,5 per due turni e ricerca di `base.gigi.LavoroFattoBene`. Nessuna classe nuova;
`LavoroFattoBene` resta quella parametrica di SB-15. Stato «Preparo il lavoro → Lavoro fatto bene».
Il bot conta gli oggetti pubblici, valuta furti/distruzioni e non presume il massimo di 18 HIT quando il tavolo è vuoto.

### GIG-AR4 — Sotto il cofano → Sotto il cofano

Una copia C, costo **5 V**, priorità **2**, sé stessi.

> Oggi: in questo turno moltiplica per 0,5 i danni da colpo e per 0,75 quelli da taglio che ricevi.

> Nuova: in questo turno moltiplica per 0,5 i danni da colpo e per 0,75 quelli da taglio che ricevi. Guadagni 5 V.

**Principio:** P3. Come Paraurti, rimborsa il costo senza poter essere inviata senza la risorsa necessaria.
**Effetto atteso:** coprirsi senza perdere tutta l'economia quando l'altro prepara; nello specchio può però aumentare durata
e patte se il bot la preferisce troppo spesso al colpo. **Bozza e bot:** aggiungere `gain V 5` e `gui.gains` agli stati esistenti;
nessuna classe nuova. Valutare il rimborso senza anticiparlo al pagamento o confonderlo con +5 V nette.

## Difese e composizione che la proposta conserva

P3 cambia tutte le parate pure dei cinque starter: Tartaruga, Paraurti e Sotto il cofano. MadeOfStone dura più turni e dà già +10 V;
il Bancone dà già +5 L; Metabolismo è una cura che consuma T; gli equip restano difese persistenti.
FAI BASTA e Riflessi Aumentati dalla Speed restano contromosse senza rendita se la lettura è sbagliata, come distingue la
[P3 di SB-16b](../../reports/set-base/sb-16b-report.md#p3--nessuna-parata-pura-griglia-e-bozza).
Mara conserva Sorpasso e non riceve annullamenti; Beppe conserva furto e distruzione; Piera conserva Rutto.

Le bound restano a una funzione e senza parate (D34/D35): nessuna ricerca ripetibile, cura o equip nelle bound.
Restano le quattro last resort della griglia, comprese le tre usate qui; non si cambia la loro priorità né il danno a sé.
GEN-11, CES-AR5 e ROC-AR2 andranno progettate con P3 nei rispettivi blocchi, senza allargare questa proposta a carte fuori starter.

## Effetto atteso sugli incontri oltre il 10%

Punto di confronto corretto: **P1 + pavimento + corazza L/4**, non i soli P1 o P1 + pavimento a cui si riferiscono alcuni numeri
arrotondati di D51. [Misura Fase B](../../reports/set-base/sb-16b/fase-b/confronto-alcol.md): 2.000 partite per cella,
480.000 per variante, stessi semi e quattro stili. Le nuove carte e la ricerca **non sono ancora misurate**.

| Incontro | Patte / turni attuali con L/4 | Leva proposta | Rischio da controllare |
|---|---|---|---|
| Piera–Piera | 36,4% / 16,9 | Recupero di A, spesa di L con Estasi, fine prima delle last resort | Caricamenti simultanei mantengono la parità; altra L dà anche corazza |
| Celestina–Celestina | 19,9% / 16,9 | POISON diretto 12, esposizione al POISON e ricerca del colpo | T periodica non punisce gli immuni; più T può finanziare più cure |
| Beppe–Beppe | 19,4% / 13,9 | Cercare il colpo sugli oggetti, punire chi prepara, V per liberare la mano | Equip difensivi e rimborso di Cofano possono allungare lo specchio |
| Piera–Beppe | 15,0% / 15,4 | A diverse e colpi disponibili prima; esposizioni attaccabili | Il colpo di Beppe resta HIT e subisce Bancone e corazza |
| Celestina–Piera | 12,7% / 15,7 | POISON contro corazza ed esposizione di Piera; A recuperata da Piera | Celestina è già a quota 0,606: vietato migliorare soltanto le patte rompendo il 40–60% |
| Mara–Piera | 12,1% / 14,1 | Sgommata cercata aggira la corazza; gestione della A nel finale | Cure e Paraurti possono annullare il guadagno di durata |
| Celestina–Beppe | 11,1% / 14,2 | POISON 12 contro equip, esposizione e accesso al colpo sugli oggetti | Celestina può rafforzarsi più di Beppe; controllare quota e singoli stili |

Non assegno percentuali previste: sarebbero numeri inventati. Tutti e sette devono scendere a **≤10%**, specchi compresi,
con durata circa 6–12 turni, quote 45–55% fra i base e 40–60% negli altri incontri, invarianti a zero.
Vanno controllati anche gli incontri oggi sotto soglia: Spazienzio–Piera è fuori quota (0,334) e Spazienzio–Beppe è al limite (0,399).
Le cure di P3 non devono farli rientrare al prezzo di nuove patte o incontri più lunghi.

## Slot della griglia da aggiornare dopo il cancello

| Slot | Cambiamento da registrare | Copie e rarità |
|---|---|---|
| GEN-13 | Difesa del turno più cura 3 | Spazienzio 2, Mara 1; C |
| SPA-AR3 | Carica rischiosa più ricerca esatta di SPA-AR1 | 2; C |
| MAR-AR4 | Difesa più rimborso di 5 A | 2; NC |
| MAR-AR5 | Da attacco variabile pagato a caricamento gratuito di A con ricerca di MAR-AR2 | 1; R |
| TOS-AR1 | Da attacco con autodanno a caricamento gratuito di T con ricerca di TOS-AR2 | 2; C |
| TOS-AR2 | POISON diretto 8 → 12; T al bersaglio invariata | 2; C |
| PIN-AR4 | Da L al bersaglio a caricamento proprio di L e A con ricerca di PIN-AR2 | 2; NC |
| GIG-AR3 | Da piccolo HIT a caricamento di V con ricerca di GIG-AR5 | 1; C |
| GIG-AR4 | Difesa più rimborso di 5 V | 1; C |

SPA-AR1, MAR-AR2, PIN-AR2 e GIG-AR5 acquisirebbero solo una nota di collegamento alla coppia: il loro funzionamento non cambia.
Andrebbero aggiornati anche i principi della griglia e i triangoli, indicando ricerca, esposizione e P3. Le righe degli starter
cambierebbero i nomi delle carte, senza spostare copie o rarità. Budget 115, 37 azioni d'archetipo e 23 generiche restano quelli di D34.

## Cosa servirà all'attuazione e alla misura

**Formato:** l'unica operazione nuova richiesta è il passo di ricerca esatta già assegnato a SB-16c. La sua sintassi definitiva
si riprende da quel blocco, senza fissarne qui una concorrente. Tutti gli altri effetti usano `gain`, `damage`, `status` e i campi
attuali. I caricamenti hanno cinque destinazioni fisse, tutte azioni; non richiedono condizioni «se caricato», nuovi timer,
bonus di priorità, nuovi equip o nuove classi Java. I due colpi Java riusano le classi di SB-14/SB-15.
Gli stati visibili e il registro della carta trovata devono rendere leggibile la coppia nella bozza esistente, prima di qualsiasi
intervento sul client in SB-31. Non basta una riga `say` per chiamare pubblico uno stato che la vista non espone.

**Bot:** riusare l'euristica di SB-16c con le cinque associazioni esplicite, non con una scansione del mazzo nascosto.
Per sé usa mano e conteggi conosciuti; per gli avversari solo stato, risorse, oggetti e carte mostrate. Conserva memoria della carta
rivelata finché una giocata o uno scarto pubblico ne spiega l'uscita. Valuta almeno: caricamento pagabile e utile, rischio fino al
prossimo gruppo, danno dopo stati/corazza, difesa contro colpo noto, attacco contro esposizione, contromossa appropriata e alternativa
al colpo cercato. In particolare lo scarto per una bound può sacrificare proprio la carta cercata: non è un errore di formato.

**SB-16e, entro 3 giri e 2 ore, senza avviare giri in questa fase:**

1. Conservare come riferimento le cinque liste dopo SB-16c con D50, prima dei cambi di carte. Usare stessi semi e stili.
2. Separare P3 dalle coppie con confronti controllati; confrontare ogni coppia attiva/disattiva a parità degli altri cambi.
   Per Celestina isolare anche 8 → 12 POISON; per Piera separare il contributo del +10 A da quello della ricerca, senza adottare
   tali varianti come funzionamenti alternativi. Questi confronti stanno nei lotti dei giri previsti, non aprono altri giri.
3. Per ogni coppia contare caricamenti risolti, ricerche riuscite/mancate, colpo già in mano, colpi cercati poi giocati/scartati,
   annullati perché a terra o da contromossa, parati e relativo danno assorbito. Contare esposizioni punite, danno amplificato,
   sopravvivenza al caricamento, turni fra ricerca e colpo e copie rimaste inutilizzate. Esplicitare i denominatori.
4. Riportare patte per incontro e stile, durata, mazzi esauriti, accesso alle last resort e causa della patta: stesso gruppo,
   autodanno o effetti di fine turno. Per Piera aggiungere quota dei finali con entrambe ad A=0 e distribuzione della differenza di A.
5. Tarare i numeri delegati, compresi premi di P3, danni, risorse iniziali e corazza, senza cambiare funzione o composizione di nascosto.
   Prima leva su Piera: L iniziale, poi salute; su Celestina, se troppo forte, T iniziale (D43); su Beppe V iniziale, poi salute (D45).
   Rimisurare priorità e A: il listino precedente alla regola «a terra» e alla corazza non è un prezzo definitivo.
6. Se resta un incontro sopra soglia, fermarsi con i dati e una proposta al proprietario. In particolare la coppia non garantisce
   di spezzare uno specchio perfettamente simmetrico: nuovi funzionamenti delle last resort o sostituzioni di Mattone/SeagullFly
   richiederebbero un'altra decisione. Nessuna riduzione della soglia e nessun riallineamento degli attesi per accettare regressioni.

## Verifiche e limiti di questa consegna

Le verifiche e i rinvii seguenti documentano la prima consegna (0.1); gli esiti della registrazione di approvazione (0.2) sono riportati dopo.

La proposta è una revisione documentale: non ci sono carte implementate, nuove partite, invarianti misurate o prove umane.
Le misure citate restano quelle di SB-16b, non validazioni di queste carte.

- Preliminare: checkout inizialmente pulito su `main`, `git fetch` riuscito, HEAD e origin/main entrambi a `d892bc3`; porte di prova libere.
- `python scripts/check-rules.py`: verde, regolamento 1.13 / Set Base 0.1 allineati, 39 carte e un token, SQLite integro.
- `python scripts/check-links.py`: verde, 263 file controllati, zero link rotti.
- `./client-web/run.ps1 -Task Test`: verde, 333/333.
- `./client-web/run.ps1 -Task Build`: verde; avviso del bundler sulla dimensione di un chunk, senza errore di build.
- `./client-web/run.ps1 -Task Size`, con `BM_OUT` in TEMP: verde; JS gzip 350.290 byte, totale gzip 1.760.434 byte,
  texture decodificate 27.729.048 byte, tetti ordinari e C4 rispettati. Nessuna riscrittura del rapporto Size tracciato.
- `python scripts/verify-match-manifests.py`: verde, `allChecks: PASS`.
- `git diff --check` e controllo del nuovo file: nessun errore di spaziatura; controllo finale ripetuto sul solo documento in staging.

Log dei tre controlli client e `size.json` fuori da git:
`C:\Users\gesucca\AppData\Local\Temp\bm-sb16d-5c9e7d2d50c14a58b58fca56fadd9256`.
Sono stati eseguiti in sequenza, senza Java attivo ai controlli prima dell'avvio.

**Rimandate le verifiche Java** `./scripts/build.ps1 -Task Test -Offline` e del contesto Spring completo:
SB-16c modifica contemporaneamente il server e ha avviato Maven durante questa consegna. Non si sovrappongono verifiche sulla
macchina e non si attribuisce a questa proposta l'esito di un server ancora in lavorazione. Nessuna verifica Playwright o banco
nuovo in questa fase; nessun atteso o soglia cambiato. Nessun rosso emerso nei controlli eseguiti. Il contesto Spring e le carte
proposte restano non verificati. Il giudizio sul funzionamento spetta al proprietario; i numeri si tarano in SB-16e e la prova umana
resta SB-16f.

### Verifiche della registrazione di approvazione (0.2)

Rilanciate in sequenza il 12 novembre 2026 sul checkout con SB-16c concluso, prima del commit di sola approvazione:

- `./scripts/build.ps1 -Task Test -Offline`: verde; server 688 test, zero fallimenti/errori, 7 saltati (misure a richiesta);
  client-debug 37/37. Questo esito aggiorna il rinvio della prima consegna per i test unitari, non per il contesto Spring completo.
- `./client-web/run.ps1 -Task Test`, `Build`, `Size`: verdi; 333 test, stesso avviso del bundler e stesse misure Size della 0.1,
  `BM_OUT` in TEMP e tetti ordinari/C4 rispettati.
- `python scripts/check-rules.py`: verde; `python scripts/check-links.py`: verde, 273 file, zero link rotti.
- `git diff --check`: verde. Solo questo documento modificato; nessun atteso, soglia o comportamento cambiato.

Log e `size.json`: `C:\Users\gesucca\AppData\Local\Temp\bm-sb16d-approval-53afe36a2e03420d9bc59b30260b1ec0`.
Il contesto Spring completo non è stato rilanciato per questa registrazione documentale; nessun banco di bilanciamento o playtest
è stato eseguito sulle carte proposte, che restano da implementare.

## Domande al proprietario

**Esito del 12 novembre 2026: tutte e tre approvate**, con le parole riportate in apertura. Le domande si conservano come riferimento della decisione.

1. **Approvi le cinque coppie e i nove slot proposti**, con copie, rarità e composizione conservate? In particolare Slalom,
   Rabbia Psicotica da Meth e Colpo di chiave inglese diventano caricamenti, mantenendo le contromosse degli starter.
2. **Approvi Un altro e arrivo al posto di Offro io**, compreso il recupero di A per spezzare i finali a pari velocità di Piera?
   La L resta anche corazza e il colpo la azzera: entrambi i lati vanno misurati.
3. **Approvi esposizione per due turni e ricerca obbligata di un solo colpo**, con fallback alla pesca ordinaria se assente,
   e le tre difese con cura/rimborso? I valori proposti, incluso Tossicone a 12, restano indicativi sotto D38/D53.

Le risposte sono registrate in apertura. SB-16c è concluso; l'attuazione e l'integrazione di D54 appartengono alla parte successiva del blocco.

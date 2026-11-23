# Piano Set Base — Dal set provvisorio al primo set bilanciato

Scritto il 2 novembre 2026 col regolamento 1.10, aggiornato all'8 novembre 2026 (regolamento **1.13** e Set Base 0.1, da SB-1 e SB-2).
**Solo piano:** questo documento, come ogni roadmap (R00), non introduce regole attive; le regole cambiano solo nei blocchi che
aggiornano il regolamento. La partita viva resta quella del regolamento vigente: nulla della bozza la raggiunge prima di SB-28.

> **Ripartenza** (aggiornata il 23 novembre 2026, dopo D182). La aggiorna chi chiude un blocco e la regia a ogni decisione ([metodo](orchestrazione-lavoro.md#avvio-di-un-filone)).
>
> - **In vigore:** partita viva al regolamento **1.14** (la 1.14 aggiunge solo la rarità P, descrittiva) e Set Base 0.1; bozza congelata **1.7** (SB-24, D166); regole `d50` solo nel playground ([regole-playground.md](design/set-base/regole-playground.md)); formato 20/2 (D94); soglia minima per gli starter (D95); bozza di riferimento **1.6b** (D101) con le correzioni di D139, D149 e D152 (Estasi GEN-24, Giro secco in PIN-AR2), set a 124 carte (D152, D155).
> - **In corso:** SB-28, **Fase A approvata** ([D183](#decisioni-del-proprietario), [rapporto](reports/set-base/sb-28-report.md#fase-a)): [regolamento 2.0 candidato](design/set-base/sb-28/game-rules-2.0.md) e [corrispondenza](design/set-base/sb-28/corrispondenza.md), Set Base 1.0 candidato coi rimandi al regolamento (bozza `325926e3…` invariata); «Ultimo colpo» fuori dal 2.0, avviso e «∞» del client rinviati alle verifiche di SB-31, formato del file in `docs/formato-file-set.md`.
> - **Prossimo:** SB-28 Fase B (il passaggio in un solo commit), secondo la [proposta](design/set-base/sb-28-proposta.md) e [D182](#decisioni-del-proprietario) e [D183](#decisioni-del-proprietario): quick a caso fra i cinque starter, mazzi salvati con carte uscite cancellati. Q12 resta aperta. B5c di SB-30b quando lo lancia il proprietario, mai insieme a una misura.
> - **Decisioni da leggere:** D183, D182, D181, D180, D179, D178, D177, D176, D175, D174, D173, D172, D171, D170, D169, D168, D165, D164, D163, D162, D161, D160, D159, D158, D157, D156, D155, D154, D153, D152, D151, D150, D149, D148, D147, D143, D142, D131, D95, D93. Le altre nel [registro](set-base-decisioni.md#decisioni-del-proprietario) (D1–D183).

Questo documento è lo **stato** del filone: obiettivo, regole di lavoro, criteri in vigore, blocchi aperti e futuri. La cronologia dei blocchi chiusi è nello [storico](history/set-base-plan-storico.md). Fondamenta, strumenti, progetto e i cinque starter sono chiusi e approvati.

## Obiettivo e regole comuni

**Risultato:** un Set Base di 120 carte, giocabile per intero, in cui gli starter si
equivalgono, costruire un mazzo premia chi esplora e nessuna strategia domina. Il bilanciamento
perfetto non è l'obiettivo: contano l'assenza di strategie dominanti e il peso della lettura
dell'avversario. Il set deve **esplorare a fondo le meccaniche di base**, senza consumare le idee
creative destinate alle espansioni, e la struttura deve accogliere le espansioni senza rifacimenti.

Valgono per **ogni** blocco:

- **Un blocco parte solo dopo l'istruzione del proprietario** e segue il [contratto dell'esecutore](orchestrazione-lavoro.md#contratto-dellesecutore)
  (passo, STOP, commit con il prefisso del blocco).
- **Il regolamento viene prima del codice** per tutto ciò che cambia la partita viva (AGENTS):
  versione e motivazione, poi test, codice, catalogo, copia del debug nella stessa modifica. Non si
  aggiorna un atteso per accettare una regressione.
- **Il playground non è normativo.** Finché una carta vive nella bozza si può cambiare senza
  toccare il regolamento. Nulla della bozza raggiunge le partite normali prima di SB-28.
- **Verifiche:** secondo la [tabella delle aree](aree-protette.md), che dice quali modifiche fanno
  scattare test del server, `check-rules.py`, contesto Spring, identità e verifiche di `client-web`
  (test unitari verdi non provano l'avvio). Per il client vale il [metodo del piano C3](client-c3-plan.md#obiettivo-e-regole-comuni)
  (partite reali, database temporaneo, 1366×768 e 844×390).
- **Numeri riproducibili:** ogni misura dichiara seme, numero di partite, bot e versione della
  bozza. Un risultato senza questi dati non motiva una modifica.
- **Documenti nello stesso commit:** rapporto in `docs/reports/set-base/sb-n-report.md` (una proposta in
  `docs/design/set-base/`), evidenze in `docs/reports/set-base/sb-n/`, stato nella riga e nella sezione del blocco e nella
  Ripartenza; l'indice solo se cambia il prossimo passo (contratto).
- Testi nuovi in italiano; identificatori stabili e nomi visualizzati restano separati.

## Cosa c'è oggi

Fotografia di partenza del 2 novembre 2026 (tabella per ambito): [storico](history/set-base-plan-storico.md#cosa-cè-oggi). Oggi, secondo i blocchi chiusi: la partita viva è al regolamento **1.13** e al Set Base **0.1** (39 carte), con le regole dei mazzi di R02 1.12 (SB-1) e la separazione fra regolamento e set (SB-2); esistono il runner con seme, i bot euristici e il banco di misura (SB-3, SB-4, SB-7), il playground a dati (SB-5, SB-6) e la bozza giocabile da umani col profilo `bozza` (SB-8), dove le regole `d50` valgono solo nel playground (SB-16c). Catalogo `cards.sqlite`, testi per i giocatori, illustrazioni, quick e bot della partita viva cambiano nei blocchi SB-26, SB-25, SB-32, SB-29 e SB-30.

### Letture del regolamento che guidano il progetto

- **Le risorse sono i «colori» del gioco.** Una carta da 20 V è giocabile da tutti solo sulla carta.
  Ogni risorsa ha già un'identità: **V** si accumula ed esplode; **T** è carburante e veleno che
  scala nel tempo; **L** si dimezza a ogni fine turno e va spesa subito; **A** è costo e precedenza
  insieme, perché l'ordine si calcola dopo i costi (R04). Generiche vere sono le carte gratuite o a
  costo A.
- **L è poco sfruttata e ha effetti poco evidenti.** Con la formula di R06 a fine turno si perde L/2 + 1: 10 diventa 4, e 1 o 2 vanno
  a zero. GoingBerserk costa 10 L, ma i +15 L del Cocktail a fine turno sono già 7. *Corretto in SB-10b: la prima versione diceva che L
  si ferma a 1 o 2 senza azzerarsi mai, e che 15 diventa 8.*
- **La scelta reale è stretta.** Con 6 carte in mano e 3 fisse restano circa 3 slot regolari: le
  carte costose intasano in fretta.
- **Listino di partenza.** A occhio circa 1,5 danni per V: SuperImpact (25 V → 40), SeagullFly
  (10 V → 15). Va misurato (SB-10).
- **Il cuore del divertimento è il triangolo attacco, difesa, contromossa**, dato che le mosse sono
  simultanee. Ogni archetipo deve averne una sua versione.

## Il set in numeri

Totale **120 carte** (D60, D79; D34 diceva 115), con 45 comuni, 55 non comuni e 20 rare ([griglia](design/set-base/griglia.md)). Ogni carta ha una rarità.

| Blocco | Carte | Note |
|---|---:|---|
| Personaggi | 7 | 2 base, 3 avanzati (premium), 2 da booster |
| Basic | 7 | Una per personaggio |
| Bound | 21 | Almeno 3 per personaggio; se ne scelgono 2 |
| Last resort | 4 | Struggle generica più 3 legate a un personaggio, dove flavour e meccanica si sposano |
| Azioni d'archetipo | 42 | 6 per personaggio ([griglia](design/set-base/griglia.md), D60–D61; erano 37 in D34): si sposano con la strategia senza esservi vincolate |
| Azioni generiche | 23 | Giocabili da tutti; compaiono in più starter (erano 25, D34) |
| Oggetti | 16 | I token non contano, come oggi |
| **Totale** | **120** | |

Il budget è stretto: Bruiser usa 15 carte distinte su 20 slot, quindi cinque starter consumerebbero
gran parte del pool senza condividere le generiche. Per ogni personaggio ci sono **almeno tre carte
legate**, come negli appunti; qui sono quattro (basic e tre bound).

## Regole dei mazzi concordate

Tutte decise dal proprietario, da attivare in SB-1.

- **Esattamente 20 carte regolari, massimo 2 copie per carta**, oggetti compresi. Dimensione esatta e
  non minima: senza rimescolamento un mazzo da 40 non arriverebbe mai alla last resort e aggirerebbe la
  pressione del mazzo che finisce. **25 carte con 3 copie** resta un'ipotesi da valutare in seguito, come
  parametro del playground.
- **Basic obbligatoria e fissa per personaggio:** è la sua firma. **Tutte le basic sono prese di oggetti con
  un tratto personale**, come BruiserGrab e ToxicGrab, altrimenti gli oggetti resterebbero bloccati.
- **Due bound obbligatorie del proprio personaggio**, scelte fra quelle disponibili: almeno tre nel Set
  Base, quante si vuole nelle espansioni. Lo starter ne contiene due; le altre si trovano nella collezione.
- **Last resort obbligatoria**, generica o legata al proprio personaggio.

### Bound: fallback gratuito e debole

Tutte le bound sono **gratuite e con effetti deboli**: servono come ripiego, e il loro prezzo è lo scarto di una
carta. «Debole» si misura **sulla ripetizione**, perché la bound resta in mano e si rigioca. PatheticBlade lo
mostra: 5 CUT sembrano poco, ma i +5 T al bersaglio si sommano, e dopo quattro usi sono 20 T, cioè 10 POISON a ogni
turno per sempre su chi non è immune.

Tetto iniziale, da verificare in SB-10: **circa 5 danni oppure 5 risorse per uso, senza effetti che si accumulano
sull'avversario.** LittleSmack, RottenSmile e PatheticBlade vanno quindi riviste. Struggle deve restare più forte di
una bound, ma con il suo prezzo.

### Nessun giocatore senza mosse

Le regole obbligatorie chiudono la lacuna di R03. Finché il mazzo ha carte la mano resta piena, quindi c'è sempre
una carta da scartare per giocare una bound; a mazzo vuoto entra la last resort, che torna dopo ogni uso. Valgono
però due **vincoli di progetto**, da verificare su ogni carta:

1. Nessuna bound può bersagliare oggetti, così ha sempre un bersaglio valido.
2. Ogni last resort è gratuita e sempre giocabile, anche quelle a tema.

**Il «passo» non si aggiunge:** dover giocare Struggle, che fa male anche a chi la usa, è ciò che chiude le partite
lunghe. Il ragionamento va provato: SB-7 misura come invariante **zero turni senza mosse legali**.

## Personaggi

Concept approvati in linea di massima. Mara, Pino e Gigi vengono dalla [bozza esterna](#bozza-esterna-di-carte), al posto dei segnaposto il Lesto,
Sor Boccione e Zi' Arraffa, che restano nomi di riserva. **Schede approvate in SB-9** il 6 novembre 2026, con nomi provvisori, valori iniziali da misurare
in SB-10 e triangolo di ciascuno: [schede dei personaggi](design/set-base/schede-personaggi.md).

**Nomi e flavour dell'8 novembre 2026**, dai concept del proprietario ([serbatoio di flavour](design/set-base/flavour.md)), portati nelle schede dopo
l'approvazione di SB-15: Pino diventa **Piera Ultimo Giro**, Gigi **Beppe Bulletta**, il Tossico **Celestina Bucatina**, Cesira la Malalingua
**Sergio Sommerso**, Rocco «Sant'Incasso» **Duccio Braccio Teso**. Meccaniche e numeri non cambiano; ID degli slot, decisioni e rapporti dei
blocchi passati restano con i nomi del loro momento. Il Tossico resta «Tossico del Serraglio» nella partita viva e nel [documento del set](sets/base.md)
finché un cambio deliberato del set, con versione e motivazione, non lo rinomina (SB-24 o SB-28). Prima di SB-18 il proprietario decide se il costo
in salute regge come identità di Duccio ([domanda nella scheda](design/set-base/schede-personaggi.md#domanda-per-sb-18-il-costo-in-salute-con-duccio)).

| Slot | Personaggio | Stile di gioco | Rischio |
|---|---|---|---|
| Base | **Spazienzio** (esiste) | Accumula V e tira colpi enormi | Lento, pochi oggetti |
| Base | **Mara Contromano** | Rider: A, priorità alta, tanti piccoli CUT, consuma gli oggetti prima che glieli tolgano | Poca salute; pagare A le toglie la precedenza |
| Avanzato | **Celestina Bucatina** (il Tossico, esiste; lascia gli starter base) | T come carburante e veleno | Gestione complessa delle immunità |
| Avanzato | **Piera Ultimo Giro** (era Pino) | Frequentatrice del bancone: L da spendere, bottiglie, equip | Basso A; senza immunità a L ([D28](#decisioni-del-proprietario)) perde A a ogni fine turno |
| Avanzato | **Beppe Bulletta** (era Gigi) | Tornitore e meccanico in nero: tanti oggetti ed equip, ruba e smonta quelli altrui, costruisce V con piccoli colpi | Debole se il tavolo è vuoto; distruzione da tenere a bada |
| Booster | **Sergio Sommerso** (era Cesira) | Ricco e losco, provoca e ricatta: contromosse e letture dell'avversario, pagate in A | Se legge male, spreca il turno |
| Booster | **Duccio Braccio Teso** (era Rocco) | Militante di destra che finisce sempre per prenderle. **Usa la salute come risorsa:** paga le mosse con la propria HEALTH, più riduzioni del danno e contrattacchi | Muore se esagera; lento a chiudere la partita se si limita a incassare |

Gli starter base devono mostrare le meccaniche di base con contrasto: Spazienzio con V e HIT, Mara con A e CUT.
Celestina passa agli avanzati perché immunità, BadTrip, ToxicBloodDrain e LethalHeroinDose non insegnano le basi.

### Perimetro creativo

**Nel Set Base niente risorse o parole chiave nuove.** Si usano solo le quattro risorse, la salute come prezzo (D27) e i tre tipi di danno esistenti,
stati, equip, timer, token, contromosse e oggetti. Le idee che sforano finiscono nell'[elenco per le
espansioni](#idee-per-le-espansioni). Le carte attuali sono **riprogettabili**, ma il loro flavour piace: nome e tono si
conservano di default, le meccaniche possono cambiare.

### Flavour

- **Personaggi subito** (SB-9): una scheda breve con nome, chi è, come picchia, risorsa e rischio, perché un concept
  genera meccaniche.
- **Carte con nome provvisorio** fino al congelamento: molte cambieranno o spariranno. Se una battuta viene spontanea si
  tiene, altrimenti basta un nome descrittivo.
- **Passata finale** (SB-24) a meccaniche congelate; se una carta non si lega al personaggio si può ritoccarne l'effetto.
- **Serbatoio di flavour** (8 novembre 2026): i concept del proprietario per personaggi, carte e illustrazioni stanno in
  [flavour.md](design/set-base/flavour.md), senza valore normativo, raccolti in una sessione a sé su sua scelta («sarà meglio se lo
  facciamo in una sessione pulita»). Portati nei documenti vivi (schede, griglia, piano, indice) e nei nomi della bozza con «Sì,
  affidalo»: Piera Ultimo Giro (Pino), Beppe Bulletta (Gigi), Celestina Bucatina (Tossico), Sergio Sommerso (Cesira), Duccio Braccio
  Teso (Rocco); ID degli slot, rapporti e decisioni invariati. **Celestina non è ancora nella partita viva:** documento del set,
  catalogo e test del client dicono «Tossico del Serraglio» fino a un cambio deliberato del documento del set (SB-24 o SB-28). Le idee
  che toccano una meccanica (cane di Piera, oggetti di Mara) restano annotate in flavour.md per SB-24 o per le espansioni.

### Rarità

Riflette **complessità e potenza insieme**. Paletto: una rara può avere un picco più alto o premiare un mazzo costruito
attorno a lei, ma **non può essere una comune migliore allo stesso costo**. Le comuni restano la spina dorsale. In questo
piano la rarità è solo un dato del catalogo: non esistono buste né proprietà delle carte.

## Bozza esterna di carte

La [proposta da 70 carte](design/set-base/bozza-esterna-proposta-70-carte.md) è conservata come **serbatoio di idee**: non è normativa, non è approvata e non si tiene aggiornata. Le sue carte
entrano nel set solo passando dai blocchi del piano, e dove contrasta col piano prevale il piano. Il bilanciamento dei suoi numeri non è validato.

Copertura massima della bozza (stima del 2 novembre 2026, tabella per blocco): [storico](history/set-base-plan-storico.md#bozza-esterna-di-carte).

**Punti di forza da portare nei blocchi:**

- **Nomi e mondo:** Mara, Pino e Gigi, e il tono di strada e di bar di carte come «Mattone del cantiere» o «Rutto a distanza sociale» (SB-9, SB-24). Le carte che restano possono tenere il loro nome.
- **Starter con un nome proprio:** «Chiude quando dico io», «Consegna sul muso», «Intervento sul posto». Lo si estende a tutti gli starter (SB-11, SB-13–SB-15).
- **Personaggi con valori diversi:** salute da 85 a 110, A da 15 a 40, capacità di oggetti da 2 a 3. Sono leve in più per differenziarli, senza meccaniche nuove (SB-9).
- **Basic:** le tre della bozza sono già prese di oggetti con un tratto personale, e confermano D3 (SB-11, SB-13–SB-15).
- **Bound che generano la risorsa del personaggio:** il ripiego è anche il modo per restare in gioco quando la risorsa manca. Di solito uniscono una risorsa e un piccolo danno, e superano il tetto ipotizzato: SB-10 misura se va cambiato il tetto o la carta.
- **Forma degli starter:** 14 azioni e 6 oggetti, 10 carte distinte in doppia copia, molte generiche condivise. Alleggerisce il budget rispetto alle 15 distinte di oggi, a scapito della varietà: SB-10 sceglie fra 10 e 15.
- **Meccaniche di base oggi poco esplorate:** POISON diretto («Sputo da posacenere», oggi nessuna carta lo infligge), cure e pulizia («Fasciatura col fazzolettaccio», «Due dita in gola», «Panino del kebab dimenticato», «Mezza minerale sgasata»), equip da oggetti («Guanti da officina», «Giubbotto di finta pelle»), CUT a costo A o V, contrasto all'alcol. Sono tutti candidati per SB-10 e SB-19.
- **Rischi già individuati**, da verificare nei rispettivi blocchi: A alta di Mara che rende troppo affidabili YouStop e WhatchaDoin; distruzione ripetibile di Beppe; pulizia gratuita che indebolisce la tossicità; accumulo di equip con molte copie.
- **Leggibilità:** distinguere immunità periodica e POISON, costi e perdite di A, oggetti sul campo ed equip attivi, durate (durata 2 significa tre turni). Va in SB-25 e SB-31.

**Ciò che non vale più** (70 carte, cinque personaggi, nessun limite di copie, «Smontiamo tutto» come bound, immunità di Pino a L: superati da D1, D2, D6, D7, D14 e D28): [storico](history/set-base-plan-storico.md#bozza-esterna-di-carte).

## Struttura per set ed espansioni

Decisa dal proprietario: **il regolamento contiene le regole generali, un documento per set contiene le carte.** Con 120
carte le tabelle di R07 diventerebbero ingestibili e ogni ritocco cambierebbe la versione delle regole.

- **Regolamento:** sistema, tipologie, risoluzione, danni, regole dei mazzi. Le citazioni di carte specifiche in R04 e R05
  diventano regole generali o si spostano nelle schede.
- **Documento di set** (proposta: `docs/sets/`): schede normative delle carte, versione propria e motivazioni.
- **Precedenza:** il regolamento governa il sistema, la scheda governa la carta; una carta deroga a una regola **solo se lo
  dice esplicitamente**.
- **Due testi per ogni carta:** la **scheda normativa**, precisa e tecnica, e il **testo per i giocatori**, in italiano chiaro e sul tono del gioco. Il
  secondo è descrittivo: in caso di dubbio prevale la scheda.
- **Fonte unica:** oggi una carta vive in R07, nell'allegato, in SQLite e in Java. Il file del set deve generare descrizioni e
  catalogo, così da ridurre i disallineamenti.
- **Pronti per le espansioni:** ogni carta dichiara il proprio set, il catalogo si carica da più set, un mazzo può mescolarli e
  nessun formato presume che le bound di un personaggio siano tre. Un'espansione si bilancia contro il set base già fermo.

## Bilanciamento: metodo e criteri

**Lavoriamo a strati.** Non si creano tutte le carte per poi provarle: con 120 carte le interazioni sono troppe e i problemi di
fondo emergerebbero quando è già tutto da rifare. Si costruisce un personaggio alla volta contro una base stabile, e alla fine si
bilancia l'intero set.

**Strumenti:**

| Strumento | A cosa serve |
|---|---|
| Runner Java | Migliaia di partite, matchup scelti, varianti come 20 o 25 carte, statistiche per carta |
| CLI | Poche partite di controllo sul server reale, per confermare che la bozza funzioni end-to-end |
| Client web | Partite umane, per giudicare se il gioco diverte: il simulatore misura l'equilibrio, non il divertimento |

**Formato di riferimento: 1v1.** Il FFA è solo un controllo: si guarda che nessun personaggio sia ingiocabile o dominante.

**Criteri di arrivo**, approvati in linea di massima; sono ipotesi iniziali che i dati possono correggere. **Da [D93](#decisioni-del-proprietario)** (14 novembre 2026) quote, durata e patte si giudicano sulle sole partite fra **bot euristici** (aggressivo, prudente, risorse); lo stile `com`, casuale, resta nei rapporti con un controllo a parte, `com` contro `com` fra 35% e 65% fuori dagli specchi ([primo ricalcolo](reports/set-base/criteri-euristici-1.5.md)):

| Misura | Obiettivo |
|---|---|
| Matchup fra starter base | 45–55% |
| Altri matchup fra starter | 40–60%, compresi quelli base contro avanzato, perché la coda quick è mista |
| Durata | Circa 6–12 turni |
| Patte | Al massimo 10% in ogni incontro fra starter, specchi compresi ([D51](#decisioni-del-proprietario)) |
| Mazzi esauriti | Pochi |
| Turni senza mosse legali | Zero, con mazzi conformi |
| Carte | Nessuna quasi sempre giocata o quasi mai |
| Mazzi costruiti contro starter | Il migliore può vincere anche al 65–70%: è giusto che **una strategia da scoprire aprendo pacchetti** sia più forte |
| Mazzi costruiti fra loro | Nessun dominio: ogni mazzo di vertice ha almeno un matchup sfavorevole; ai vertici ci sono almeno 3 o 4 personaggi diversi |
| **Giudizio del proprietario** | **Decisivo**, dopo partite umane |

**Soglia minima fino a SB-18 ([D95](#decisioni-del-proprietario)).** Starter e personaggi nuovi si giudicano per ora con una soglia minima: ogni incontro
fra 35% e 65% sui bot euristici, patte al massimo 10%, durata entro 12 turni fuori dagli specchi. I criteri della tabella tornano in SB-20 e
SB-21, sul set intero.

**Ordine delle correzioni:** prima i numeri, poi costo e priorità, infine il ridisegno della carta. Dopo ogni correzione si rilancia
la matrice. I giri hanno un **numero massimo fissato in anticipo**.

**Limite noto:** un bot può far sembrare debole un personaggio soltanto perché lo gioca male, e la ricerca automatica trova solo ciò che
i bot sanno giocare. Per questo ci sono più stili di bot e le prove umane.

**Prova che un giro non tocca il motore** (precisata da SB-8, 10 novembre 2026). Finora un blocco di bilanciamento lo provava con un diff
senza file di `server/src/main`. Da SB-8 il caricatore della bozza (`com.gsc.bm.sim`: `Draft`, `DataCards`, `PlayerSource`,
`DraftSource`) e le classi Java delle carte di bozza (`com.gsc.bm.model.cards.base`) stanno in `server/src/main`, perché il server di
sviluppo (profilo `bozza`) deve giocarle; senza il profilo non sono raggiungibili. La regola diventa: **nessun file di `server/src/main`
cambiato fuori da `com/gsc/bm/sim` e `com/gsc/bm/model/cards/base`**, più nessun cambiamento a `cards.sqlite`, regolamento, documento
del set, allegato e client. Un cambiamento a quei due package resta un cambiamento della bozza, non della partita viva; uno a
`com/gsc/bm/bozza` (le fabbriche del profilo) è uno strumento, da dichiarare. Dal 15 novembre 2026 condizioni e verifiche operative di questa regola sono nella [tabella delle aree](aree-protette.md#playground-e-misure); motore e bot stanno fuori dai due package e seguono la riga della partita viva.

## Blocchi

| Fase | Blocco | Contenuto | Dipende da | Stato |
|---|---|---|---|---|
| Fondamenta | SB-1 | Regole dei mazzi | — | chiuso (anticipato, D40) |
| | SB-2 | Separazione fra regolamento e set | SB-1 | chiuso (anticipato, D42) |
| Strumenti | SB-3 | Runner senza server e seme | — | chiuso |
| | SB-4 | Vista limitata e bot euristici | SB-3 | chiuso |
| | SB-5 | Prova del formato dati | SB-3 | chiuso |
| | SB-6a | Nucleo del playground | SB-5 | chiuso |
| | SB-6b | Più set e mini-espansione di prova | SB-2, SB-6a | chiuso |
| | SB-7 | Banco di misura e invarianti | SB-4, SB-6a | chiuso |
| | SB-7b | Bot e costo in HEALTH | SB-7 | chiuso |
| | SB-8 | Bozza giocabile da umani | SB-6a, SB-6b | chiuso |
| Progetto | SB-9 | Schede dei personaggi | — | chiuso |
| | SB-10a | Listino di potenza e tetto delle bound (misure) | SB-7b, SB-9 | chiuso |
| | SB-10b | Griglia degli slot (progetto) | SB-10a | chiuso |
| Carte | SB-11a | Passi `consume` ed `equip` del formato dati | SB-10b | chiuso |
| | SB-11b | Bozza degli starter base | SB-11a | chiuso |
| | SB-12a | Giro coi bot sugli starter base | SB-11b | chiuso |
| | SB-12b | Prova umana degli starter base | SB-8, SB-12a | fatto, giudizio registrato (12 novembre 2026) |
| | SB-13 | Celestina Bucatina: bozza e giro | SB-12a (D42; prima SB-12) | chiuso (anticipato, D42) |
| | SB-14 | Piera Ultimo Giro: bozza e giro | SB-13 | chiuso |
| | SB-15 | Beppe Bulletta: bozza e giro | SB-14 | chiuso |
| | SB-16 | Prova umana degli avanzati | SB-8, SB-15 | fatto, giudizio registrato (12 novembre 2026) |
| | SB-16b | Revisione critica delle regole (D49) | SB-12b, SB-16 | chiuso: Fase A e B fatte (12 novembre 2026), D50–D53 |
| | SB-16c | Regole decise in SB-16b nel playground | SB-16b | fatto (12 novembre 2026), domande risposte (D54) |
| | SB-16d | Riprogettazione dei cinque starter (P3 e P5) | SB-16c | fatto (12 novembre 2026), proposta approvata D55; invarianti e tetto bound verdi |
| | SB-16e | Giro sui cinque starter con le regole nuove | SB-16d | eseguito (12 novembre 2026), STOP dopo 3 giri: criteri non raggiunti; proposta nel rapporto |
| | SB-16e2 | Lotto numerico dopo lo STOP di SB-16e | SB-16e | eseguito (12 novembre 2026), criteri non raggiunti; (c) confermata, prima la prova umana (D57) |
| | SB-16f0 | Leggibilità della ricerca e dell’annullamento | SB-16e2 | fatto (12 novembre 2026); da giudicare dal proprietario nelle catture e in SB-16f |
| | SB-16f | Prova umana degli starter rifatti | SB-16f0 | fatto, giudizio registrato (13 novembre 2026) |
| | SB-16g | Coppie caricamento-colpo, seconda passata | SB-16f | consegnato (passi 1–3 e correzione 1.5): 1.5 bozza di riferimento ([D92](#decisioni-del-proprietario)); budget esauriti, cancello completo non raggiunto; prosegue in SB-16i. [Sezione](#sb-16g--coppie-caricamento-colpo-seconda-passata), [rapporto 1.5](reports/set-base/sb-16g-15-report.md) |
| | SB-16h | Prova esplorativa della dimensione del mazzo (SB-23 anticipata, D81) | SB-16g | chiusa in [D94](#decisioni-del-proprietario): formato 20/2 ([rapporto](reports/set-base/sb-16h-report.md)) |
| | SB-16i | Correzione 1.6: meccaniche di sistema e soglia minima (D95) | SB-16h | Fasi A, B, A2 e B2 fatte: **1.6b** bozza di riferimento ([D101](#decisioni-del-proprietario)), fuori solo le patte accettate dello specchio di Celestina ([rapporto B](reports/set-base/sb-16i-report.md), [rapporto B2](reports/set-base/sb-16i-b2-report.md)); passo del client consegnato e chiuso ([rapporto](reports/set-base/sb-16i-client-report.md), [D102](#decisioni-del-proprietario), [D103](#decisioni-del-proprietario)); prova umana breve superata, **chiuso** il 16 novembre 2026 ([D104](#decisioni-del-proprietario)) |
| | SB-17 | Sergio Sommerso: bozza e giro | SB-16i | Fasi B–B6 fatte ([rapporto B5e](reports/set-base/sb-17-b5e-report.md), [rapporto B6](reports/set-base/sb-17-b6-report.md)); in bozza la V4 con R1, Celestina 32,2% accettata ([D122](#decisioni-del-proprietario)); prova del proprietario superata, **chiuso** il 17 novembre 2026 ([D123](#decisioni-del-proprietario)) |
| | SB-18 | Duccio Braccio Teso: bozza e giro | SB-17 | Fasi B e B1e fatte ([rapporto B](reports/set-base/sb-18-b-report.md), [rapporto B1e](reports/set-base/sb-18-b1e-report.md)); la leva sono i costi; Fase B2 fatta ([rapporto B2](reports/set-base/sb-18-b2-report.md)): Duccio in bozza, scostamento su Mara accettato ([D127](#decisioni-del-proprietario)); prova del proprietario superata, **chiuso** il 17 novembre 2026 ([D128](#decisioni-del-proprietario)) |
| | SB-19 | Resto del pool e giro di blocco | SB-18 | Proposte A e A2 approvate ([D129](#decisioni-del-proprietario), [D130](#decisioni-del-proprietario)); Fasi B1 e B1b fatte e accettate ([D131](#decisioni-del-proprietario), [D132](#decisioni-del-proprietario)); Fase B2 ferma al passo 2 ([rapporto](reports/set-base/sb-19-b2-report.md)); Fase B2a dei bot fatta, patch assorbita, set a 123 ([rapporto](reports/set-base/sb-19-b2a-report.md)); ripresa della B2 fatta: oggetti tenuti coi valori di M1 ([D134](#decisioni-del-proprietario)); prova del proprietario superata, **chiuso** il 18 novembre 2026 ([D135](#decisioni-del-proprietario)) |
| Set intero | SB-20 | Prima misura dell'intero set | SB-19 | STOP 4, budget esaurito: porta verde, matrice completa, ricerca 4/7 ([rapporto](reports/set-base/sb-20-report.md)); **chiuso** il 19 novembre 2026 con la fotografia parziale ([D145](#decisioni-del-proprietario)) |
| | SB-21 | Giri di correzione | SB-20 | Giri 1, 2, 3a, 3a bis e 3b fatti ([rapporto 3a bis](reports/set-base/sb-21-giro-3a-bis-report.md), [rapporto 3b](reports/set-base/sb-21-giro-3b-report.md)); **chiuso** il 19 novembre 2026 con la bozza di D149; SB-21t sul tetto di Estasi chiuso senza tetto ([D151](#decisioni-del-proprietario)) |
| | SB-22 | Prova umana con mazzi costruiti | SB-21 | **chiuso** il 21 novembre 2026 ([D163](#decisioni-del-proprietario)): il set piace, i costruiti non bloccano ([guida](reports/set-base/sb-22-prova.md)) |
| | SB-23 | Valutazione delle varianti del formato | SB-21 | **chiuso** il 21 novembre 2026: formato 20/2 confermato ([D165](#decisioni-del-proprietario), [report](reports/set-base/sb-23-report.md)) |
| Congelamento | SB-24 | Flavour finale e congelamento | SB-22, SB-23 | **chiuso** il 22 novembre 2026: bozza congelata **1.7** con i nomi e il flavour del proprietario, regolamento 1.14 ([D166](#decisioni-del-proprietario), [D167](#decisioni-del-proprietario), [report](reports/set-base/sb-24-report.md)) |
| | SB-25 | Testi delle carte per i giocatori | SB-24 | **chiuso** il 23 novembre 2026 ([D174](#decisioni-del-proprietario)): testi approvati senza correzioni, bozza 1.7 congelata coi testi (`a8930ede…`); [proposta](design/set-base/sb-25-proposta.md) approvata ([D168](#decisioni-del-proprietario)): danni come simboli, flavour nel client in SB-31; [Fase A](design/set-base/sb-25-fase-a.md) approvata ([D169](#decisioni-del-proprietario), [D170](#decisioni-del-proprietario)); [Fase B1](reports/set-base/sb-25-report.md) consegnata e accettata ([D171](#decisioni-del-proprietario)), [Fase B2](reports/set-base/sb-25-report.md#fase-b2--simboli-dei-danni-nel-client-e-nel-pdf-guida-stampata-prova-dingombro-pagina-con-tutti-i-testi) consegnata e accettata; simbolo nuovo del veleno ([D172](#decisioni-del-proprietario)) consegnato e accettato ([report](reports/set-base/sb-25-report.md#simbolo-del-veleno-d172)); verbi dei danni nei testi ([D173](#decisioni-del-proprietario)) consegnati e accettati ([report](reports/set-base/sb-25-report.md#verbi-dei-danni-d173)), poi la revisione del proprietario sulla [pagina](design/set-base/sb-25/revisione-b.html); ogni carta ha anche un testo completo |
| | SB-26 | Generazione del catalogo dal set | SB-25 | [proposta](design/set-base/sb-26-proposta.md) approvata ([D175](#decisioni-del-proprietario)); consegnato il 23 novembre 2026 ([report](reports/set-base/sb-26-report.md)): **chiuso** il 23 novembre 2026 ([D176](#decisioni-del-proprietario)): catalogo 1.0 candidato generato dalla bozza, documento approvato |
| | SB-27 | Carte d'effetto speciale in forma definitiva | SB-26 | [proposta](design/set-base/sb-27-proposta.md) approvata ([D177](#decisioni-del-proprietario)); **chiuso** il 23 novembre 2026 ([D181](#decisioni-del-proprietario), [report](reports/set-base/sb-27-report.md)): carte speciali in forma definitiva, 125 voci testate contro la scheda; nome del token rinviato a SB-28 (D168 (4)) |
| | SB-28 | Trasferimento nella partita viva | SB-26, SB-27 | [proposta](design/set-base/sb-28-proposta.md) con le risposte di [D182](#decisioni-del-proprietario); **Fase A approvata** ([D183](#decisioni-del-proprietario)) ([rapporto](reports/set-base/sb-28-report.md#fase-a)) |
| Prodotto | SB-29 | Quick con categorie base e avanzata | SB-28 |  |
| | SB-30 | Bot nelle partite contro computer | SB-4, SB-28 |  |
| | SB-31 | Adeguamento del client | SB-28 |  |
| | SB-32 | Illustrazioni del set | SB-28, SB-31 |  |
| | SB-33 | Consolidamento e giudizio del proprietario | tutti |  |

**Ordine seguito.** SB-3, SB-4 e SB-5; poi, con [D30](#decisioni-del-proprietario), SB-9 → SB-6a → SB-7 → SB-7b → SB-10a → SB-10b → SB-11a → SB-11b → SB-12a, con SB-1 in parallelo a C4 ([D40](#decisioni-del-proprietario)); SB-13 e SB-2 ([D42](#decisioni-del-proprietario)), SB-6b e SB-14, SB-15, SB-8 ([D43](#decisioni-del-proprietario)–[D46](#decisioni-del-proprietario)); prove umane SB-12b e SB-16 e revisione SB-16b–SB-16h (12–14 novembre 2026, [D49](#decisioni-del-proprietario)–[D94](#decisioni-del-proprietario)). **Prossimo:** Fase A2 e B2 di SB-16i su Mara ([D98](#decisioni-del-proprietario)), passo del client, prova umana breve, poi SB-17 comunque ([D95](#decisioni-del-proprietario), punto 3). SB-30 può essere anticipato per le carte attuali, se il bot si dimostra utile prima: è una scelta del proprietario. Cronologia completa: [storico](history/set-base-plan-storico.md#tabella-dei-blocchi-e-ordine-seguito).

### SB-1 — Regole dei mazzi

**Chiuso e approvato l'8 novembre 2026** ([D42](#decisioni-del-proprietario)): regolamento **1.12**, con le regole dei mazzi in R02 (20 carte, massimo 2 copie, basic e last resort riservate, due bound) e R03 senza la lacuna del giocatore senza mosse; `DeckRules` su server, editor di client-web e client-debug, mazzi sintetici delle verifiche riscritti. [Rapporto SB-1](reports/set-base/sb-1-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-1--regole-dei-mazzi).

### SB-2 — Separazione fra regolamento e set

**Chiuso e approvato l'8 novembre 2026** ([D43](#decisioni-del-proprietario)): regolamento **1.13** (R00 con la precedenza fra regolamento e documenti di set, R07 «Carte e documenti di set», R04 e R05 senza citazioni di carte) e documento del set [Set Base 0.1](sets/base.md) con le 39 carte e il token di prima; colonne `C_SET` e `C_RARITY` nel catalogo, `check-rules.py` rifiuta i disallineamenti. [Rapporto SB-2](reports/set-base/sb-2-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-2--separazione-fra-regolamento-e-set).

### SB-3 — Runner senza server e seme

**Chiuso il 5 novembre 2026:** partita in-process senza Spring, con caricatore proprio e fonte di casualità con seme; la partita non cambia (200 partite vere rigiocate senza divergenze). [Rapporto](reports/set-base/sb-3-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-3--runner-senza-server-e-seme).

### SB-4 — Vista limitata e bot euristici

**Chiuso il 5 novembre 2026:** bot euristici (aggressivo, prudente, attento alle risorse) con la sola vista di R08, che battono il casuale in tutti gli abbinamenti; il casuale resta come livello facile e come metro. Il server usa ancora il casuale. [Rapporto](reports/set-base/sb-4-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-4--vista-limitata-e-bot-euristici).

### SB-5 — Prova del formato dati

**Chiuso il 5 novembre 2026:** formato dati ibrido, JSON con sei passi per le carte semplici e Java per le altre; 20 carte su 37 a dati identiche alle classi Java in 16.000 partite (23 su 37 dopo SB-11a). [Rapporto](reports/set-base/sb-5-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-5--prova-del-formato-dati).

### SB-6 — Playground e mini-espansione di prova

Diviso da [D30](#decisioni-del-proprietario). **SB-6a** (6 novembre 2026): bozza in file con carte a dati, carte Java con `@Tunable`, parametri del formato, validazione alla lettura; la bozza «attuale» gioca come il catalogo ([rapporto](reports/set-base/sb-6a-report.md)). **SB-6b** (8 novembre 2026, [D44](#decisioni-del-proprietario)): formato `sb-6b/1` con più set insieme, rarità del vocabolario di R07, mini-espansione di prova nei soli test ([rapporto](reports/set-base/sb-6b-report.md)). Testo completo: [storico](history/set-base-plan-storico.md#sb-6--playground-e-mini-espansione-di-prova).

### SB-7 — Banco di misura e invarianti

**Fatto il 6 novembre 2026:** banco di misura con la matrice dei matchup (intervalli di Wilson), rapporto riproducibile col seme, otto invarianti in partita, tetto delle bound sulla ripetizione e ricerca di mazzi per mutazione. [Rapporto](reports/set-base/sb-7-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-7--banco-di-misura-e-invarianti).

### SB-7b — Bot e costo in HEALTH

**Fatto il 6 novembre 2026** ([D31](#decisioni-del-proprietario)): gli stili euristici tengono conto del costo in HEALTH; sulla bozza di prova le morti pagando scendono da 310 a 0 su 27.000 partite, banco della bozza «attuale» identico. [Rapporto](reports/set-base/sb-7b-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-7b--bot-e-costo-in-health).

### SB-8 — Bozza giocabile da umani

**Fatto e approvato il 10 novembre 2026** ([D46](#decisioni-del-proprietario)): profilo di sviluppo `bozza` (solo con `local` o `test`, mai `heroku`), bozza letta da file (`set-base/bozza.json`) su un database separato, cinque starter come mazzi pronti, computer con uno stile euristico; caricatore e classi Java di bozza in `server/src/main`, nessun file del client. Avvio in [setup](setup.md#avvio-con-la-bozza-del-set-base-sb-8); regola del diff dei giri in [metodo e criteri](#bilanciamento-metodo-e-criteri). [Rapporto](reports/set-base/sb-8-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-8--bozza-giocabile-da-umani).

### SB-9 — Schede dei personaggi

**Chiuso il 6 novembre 2026:** [schede dei personaggi](design/set-base/schede-personaggi.md) approvate ([D28](#decisioni-del-proprietario), [D29](#decisioni-del-proprietario)); nomi e flavour aggiornati l'8 novembre (sezione [Personaggi](#personaggi)). [Rapporto](reports/set-base/sb-9-report.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-9--schede-dei-personaggi).

### SB-10 — Griglia degli slot e listino di potenza

Diviso da [D32](#decisioni-del-proprietario). **SB-10a** (6 novembre 2026, [D33](#decisioni-del-proprietario)): [listino di potenza](design/set-base/listino.md) misurato e tetto delle bound a 4 unità ([rapporto](reports/set-base/sb-10a-report.md)). **SB-10b** (6 novembre 2026, [D34](#decisioni-del-proprietario), [D35](#decisioni-del-proprietario), [D36](#decisioni-del-proprietario)): [griglia degli slot](design/set-base/griglia.md) per le 115 carte; tetto 3 per le bound di danno ([rapporto](reports/set-base/sb-10b-report.md)). Testo completo: [storico](history/set-base-plan-storico.md#sb-10--griglia-degli-slot-e-listino-di-potenza).

### SB-11 — Bozza degli starter base

Diviso da [D37](#decisioni-del-proprietario). **SB-11a** (6 novembre 2026): passi `consume` ed `equip` del formato dati ([rapporto](reports/set-base/sb-11a-report.md)). **SB-11b** (6 novembre 2026, [D38](#decisioni-del-proprietario), [D39](#decisioni-del-proprietario)): bozza `set-base/bozza.json` con gli starter di Spazienzio «Pazienza finita» e di Mara «Consegna sul muso»; Spazienzio contro Mara 0,937 passa a SB-12 ([rapporto](reports/set-base/sb-11b-report.md)). Testo completo: [storico](history/set-base-plan-storico.md#sb-11--bozza-degli-starter-base).

### SB-12 — Giro sugli starter base e prova umana

Diviso da [D40](#decisioni-del-proprietario). **SB-12a** (7 novembre 2026, [D41](#decisioni-del-proprietario)): tre giri coi bot, Spazienzio contro Mara 0,525 in partite di 11,3 turni, invarianti a zero ([rapporto](reports/set-base/sb-12a-report.md)). **SB-12b** (prova umana, 12 novembre 2026): «gli starter base mi sembrano abbastanza bilanciati fra loro», Mara un po' più debole di Spazienzio (evidenza aneddotica); nessun cambio, si riguarda in SB-20, SB-21 e SB-22. Testo completo: [storico](history/set-base-plan-storico.md#sb-12--giro-sugli-starter-base-e-prova-umana).

### SB-13, SB-14, SB-15 — Starter avanzati

Chiusi e approvati l'8 novembre 2026: Celestina Bucatina, starter «Tutto è droga» ([D43](#decisioni-del-proprietario), [rapporto](reports/set-base/sb-13-report.md)); Piera Ultimo Giro, «Chiude quando dico io» ([D44](#decisioni-del-proprietario), [rapporto](reports/set-base/sb-14-report.md)); Beppe Bulletta, «Intervento sul posto», con le rarità della griglia nella bozza `sb-6b/1` ([D45](#decisioni-del-proprietario), [rapporto](reports/set-base/sb-15-report.md)). Invarianti a zero; i numeri sono stati rivisti da SB-16d in avanti. Testo completo: [storico](history/set-base-plan-storico.md#sb-13-sb-14-sb-15--starter-avanzati).

### SB-16 — Prova umana degli avanzati

**Prova umana del 12 novembre 2026, giudizio registrato:** «anche gli starter avanzati mi sembrano ok, con celestina che sembra leggermente piu debole di beppe bulletta»; i bot dicono il contrario (Beppe contro Celestina 0,470 in [SB-15](reports/set-base/sb-15-report.md)). Nessun cambio, si riguarda in SB-20, SB-21 e SB-22. Testo completo: [storico](history/set-base-plan-storico.md#sb-16--prova-umana-degli-avanzati).

### SB-16b — Revisione critica delle regole

**Fase A e B fatte il 12 novembre 2026** ([D49](#decisioni-del-proprietario); [rapporto](reports/set-base/sb-16b-report.md)): adottati chi è a terra non colpisce (P1), costi pagati con quello che si ha («Ultimo colpo» scritto sulla carta), pavimento a zero, corazza dell'alcol a L/4 sui colpi, ricerca al posto della pesca, nessuna parata pura (P3), ritmo caricare-colpire-parare (P5), ordine dei timer (P4, nel regolamento 1.14 a SB-28); scartati P2 e lo spareggio ([D50](#decisioni-del-proprietario)–[D53](#decisioni-del-proprietario)). Solo nel playground fino a SB-28 ([D12](#decisioni-del-proprietario)). Fase C nei blocchi SB-16c–SB-16f ([D53](#decisioni-del-proprietario)). Testo completo: [storico](history/set-base-plan-storico.md#sb-16b--revisione-critica-delle-regole).

### SB-16c — Regole decise in SB-16b nel playground

**Fatto il 12 novembre 2026** ([D54](#decisioni-del-proprietario); [rapporto](reports/set-base/sb-16c-report.md)): le regole di [D50](#decisioni-del-proprietario) nel server dietro l'interruttore `Ruleset` (`1.13` o `d50`); il profilo `bozza` parte con `d50` (`app.bozza.regole`), il runner con `-Dsim.rules=d50`. Trenta test nuovi e dieci mutazioni uccise; con l'interruttore spento banco identico alla base di SB-16b. Regole in vigore: [regole-playground.md](design/set-base/regole-playground.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-16c--regole-decise-in-sb-16b-nel-playground).

### SB-16d — Riprogettazione dei cinque starter (P3 e P5)

**Fatto il 12 novembre 2026, proposta approvata** ([D55](#decisioni-del-proprietario); [proposta 0.2](design/set-base/sb-16d-proposta.md), [rapporto](reports/set-base/sb-16d-report.md)): cinque coppie caricamento-colpo con `search`, esposizioni per due turni, difese con cura o rimborso; CinqueMinutiEVado da +10 a +5 L. Banco `d50` da 480.000 partite: invarianti e bound a zero, criteri di bilanciamento non ancora raggiunti. Testo completo: [storico](history/set-base-plan-storico.md#sb-16d--riprogettazione-dei-cinque-starter-p3-e-p5).

### SB-16e — Giro sui cinque starter con le regole nuove

**Eseguito il 12 novembre 2026, STOP al terzo giro** ([D53](#decisioni-del-proprietario); [rapporto](reports/set-base/sb-16e-report.md)): invarianti e bound a zero, criteri D16/D51 non raggiunti (Piera fuori quota contro Mara e Celestina; patte negli specchi di Celestina 22,32% e Piera 17,78%). Testo completo: [storico](history/set-base-plan-storico.md#sb-16e--giro-sui-cinque-starter-con-le-regole-nuove).

### SB-16e2 — Lotto numerico dopo lo STOP di SB-16e

**Eseguito il 12 novembre 2026** ([D56](#decisioni-del-proprietario), [D57](#decisioni-del-proprietario); [rapporto](reports/set-base/sb-16e2-report.md)): un lotto numerico, adottata la variante (c) (Un altro e arrivo +35 A, danno a sé di L'ultima dose e L'ultimo giro 2 HIT); criteri non raggiunti, prima la prova umana. Testo completo: [storico](history/set-base-plan-storico.md#sb-16e2--lotto-numerico-dopo-lo-stop-di-sb-16e).

### SB-16f0 — Leggibilità della ricerca e dell’annullamento

**Fatto il 12 novembre 2026** ([D56](#decisioni-del-proprietario); [rapporto](reports/set-base/sb-16f0-report.md)): campi opzionali `voidReason` e `search` nella vista del playground; nel client «Annullata: a terra.» e la carta trovata ispezionabile. Testo completo: [storico](history/set-base-plan-storico.md#sb-16f0--leggibilità-della-ricerca-e-dellannullamento).

### SB-16f — Prova umana degli starter rifatti

**Prova umana del 13 novembre 2026, giudizio registrato:** le quattro osservazioni sulle carte che cercano i colpi annunciati (più frequenti, risorse sufficienti, colpi potenti, una conseguenza se il colpo non si gioca il turno dopo) vanno tutte a [SB-16g](#sb-16g--coppie-caricamento-colpo-seconda-passata); «il resto mi sembra a posto». Il server si è fermato una volta da solo, senza errori nel log: da riguardare se ricapita. Testo completo: [storico](history/set-base-plan-storico.md#sb-16f--prova-umana-degli-starter-rifatti).

### SB-16g — Coppie caricamento-colpo, seconda passata

Aperto il 13 novembre 2026 dalle osservazioni di SB-16f; consegnato il 14 novembre 2026. Fase 1 ([D59](#decisioni-del-proprietario)–[D68](#decisioni-del-proprietario)), 2a ([D69](#decisioni-del-proprietario), [D70](#decisioni-del-proprietario)), consulto esterno e 2b in tre passi ([D71](#decisioni-del-proprietario)–[D74](#decisioni-del-proprietario), [D78](#decisioni-del-proprietario)–[D80](#decisioni-del-proprietario), [D82](#decisioni-del-proprietario)–[D88](#decisioni-del-proprietario)), bot consapevole del colpo letale ([D76](#decisioni-del-proprietario), [D77](#decisioni-del-proprietario)), correzione 1.5 ([D89](#decisioni-del-proprietario), [D90](#decisioni-del-proprietario)). **Esito:** la 1.5 è la bozza di riferimento ([D92](#decisioni-del-proprietario)); budget D68 e D90 esauriti; cancello completo dei criteri non raggiunto (6 incontri su 15 fuori); il lavoro prosegue in [SB-16i](#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima).
Rapporti: [2a](reports/set-base/sb-16g-2a-report.md), [2b passo 1](reports/set-base/sb-16g-2b1-report.md), [bot letale](reports/set-base/sb-16g-bot-letale-report.md), [2b passo 2](reports/set-base/sb-16g-2b2-report.md), [2b passo 3](reports/set-base/sb-16g-2b3-report.md), [correzione 1.5](reports/set-base/sb-16g-15-report.md), [stati in sequenza](reports/set-base/stati-in-sequenza-report.md); [consulto](reports/set-base/consulto-design-fable-2026-11-13.md) e [revisione indipendente](reports/set-base/revisione-fable-2026-11-13.md). Proposta storica: [sb-16g-proposta.md](design/set-base/sb-16g-proposta.md); contratto: [sb-16g-2b1-rules.md](design/set-base/sb-16g-2b1-rules.md). Carte in vigore: [bozza-di-riferimento.md](design/set-base/bozza-di-riferimento.md). Testo completo: [storico](history/set-base-plan-storico.md#sb-16g--coppie-caricamento-colpo-seconda-passata).

### SB-16h — Prova esplorativa della dimensione del mazzo

**Chiusa il 14 novembre 2026 in [D94](#decisioni-del-proprietario)** (nata da [D81](#decisioni-del-proprietario); proposta approvata in [D83](#decisioni-del-proprietario); [rapporto](reports/set-base/sb-16h-report.md), [proposta](design/set-base/sb-16h-proposta.md)): Fase B con 3.672.000 partite su 20/2, 25/2, 25/3, 30/2, 30/3 e braccio misto; nessuna alternativa soddisfa [D83](#decisioni-del-proprietario). Il formato resta **20 carte e 2 copie** (Q7); le ricerche fallite si affrontano sulle carte, con «Annuncia» di al massimo due nomi in SB-16i. Testo completo: [storico](history/set-base-plan-storico.md#sb-16h--prova-esplorativa-della-dimensione-del-mazzo).

### SB-16i — Correzione 1.6: meccaniche di sistema e soglia minima

**Origine.** [D95](#decisioni-del-proprietario), dopo la prova umana della 1.5 del 14 novembre 2026: prima le meccaniche che valgono per tutto il set, poi un
bilanciamento minimo degli starter. Sostituisce la proposta 1.6 di D92 e comprende D94. Gli incontri fra starter contano soprattutto nella partita
rapida; nelle carriere i nemici useranno per lo più mazzi personalizzati.

**Contenuti.**

- «Annuncia» con al massimo due nomi ([D94](#decisioni-del-proprietario)), di norma il colpo raro e quello comune dello stesso personaggio.
- Parola chiave modificatore «se risolvi prima del bersaglio: effetto aggiuntivo», per dare peso alla velocità di Mara; riusabile in altre carte.
- Carte che abbassano o tolgono la TOXICITY, per gli starter che oggi non hanno risposta. Nessuna regola nuova: R06 resta com'è.
- Last resort che cresce: a ogni giocata della propria last resort danni e contraccolpo aumentano di un valore scritto sulla carta; last resort
  diverse possono crescere in modo diverso. Obiettivo: arrivati al last resort, la partita si chiude in pochi turni.
- Piera: un po' meno muro contro i colpi; il ruolo di muro resta.

**Fase A — proposta e STOP.** Carte e testi concreti, modifiche alle liste degli starter, supporto necessario nel motore del playground
(D50, D84), come bot, `TurnForecast` e `ViewTable` leggono le novità, budget della Fase B. Il proprietario approva.

**Fase A approvata il 14 novembre 2026 in [D97](#decisioni-del-proprietario)** ([proposta 0.1](design/set-base/sb-16i-proposta.md)), con modifiche: parola chiave «Gioca d'anticipo»; con due nomi sceglie il giocatore quando gioca il caricamento, fra i nomi ancora nel mazzo, e dopo ogni ricerca il mazzo si mischia; premi dei caricamenti della 1.5 invariati; client e `docs/api.md` (pop-up della scelta, anticipo, contatore) in un passo a parte dopo il giro e prima della prova umana breve.

**Fase B — attuazione e misura.** Solo nel playground. Un giro e al massimo una correzione numerica, nel budget approvato (3.300 s di orologio, [D97](#decisioni-del-proprietario)).

**Fase B consegnata il 15 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-16i-report.md)). Codice del playground e bot, cancelli d'identità verdi (passo 0 della 1.5 identico al secondo tentativo, identità viva 1.13, fedeltà dei bot sui tre effetti nuovi, mutazioni), 1.6 in `bozza.json` con la 1.5 congelata in `set-base/storico/1.5/`, [regole-playground.md](design/set-base/regole-playground.md) 1.1, [bozza di riferimento 1.6](design/set-base/bozza-di-riferimento.md). Giro unico di 648.000 partite: fuori dalla soglia minima Spazienzio–Mara 26,5%, Mara–Piera 77,6% (Mara da più debole a più forte) e le patte dello specchio di Celestina 12,1%; ricerche fallite 34,0% → 21,2%. Correzione numerica non eseguita: nessuna riserva scritta agisce su questi scostamenti. Spesi 1.014,7 s su 3.300. Domande nel rapporto.

**Fase A2 e B2 — Mara ([D98](#decisioni-del-proprietario)).** Proposta breve e STOP con 2 o 3 leve sulle carte di Mara, perché Spazienzio–Mara e Mara–Piera rientrino nella soglia D95 senza togliere senso a «Gioca d'anticipo»; poi un giro e al massimo una correzione numerica nel residuo del budget D97 (2.285 s). Le domande 2–5 del rapporto della Fase B restano aperte.

**Fase A2 consegnata il 15 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-16i-proposta-mara.md)). Diagnosi: il Sorpasso d'anticipo è quasi uguale contro tutti; a portare fuori Spazienzio–Mara e Mara–Piera sono la Sgommata e la Cinghiata d'anticipo, frequenti contro i lenti. Tre leve: raccomandata la A, solo numeri (Sorpasso +4 A, Sgommata ×0,8, Cinghiata +5 CUT). Domanda 3 del rapporto tenuta fuori dalla B2. Budget B2 al massimo 2.100 s, con una correzione di riserva per direzione. Quattro domande.

**Fase A2 approvata il 15 novembre 2026 in [D99](#decisioni-del-proprietario)**: leva A, correzioni di riserva e regola come nella proposta; regola dei bot di D97 invariata; patte dello specchio di Celestina accettate; dopo la B2 il passo del client.

**Fase B2 consegnata il 15 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-16i-b2-report.md)). Leva A in `bozza.json` (bozza **1.6b**: Sorpasso +4 A, Sgommata ×0,8, Cinghiata +5 CUT), [bozza di riferimento 1.6b](design/set-base/bozza-di-riferimento.md). Giro di 648.000 partite; i 10 incontri senza Mara sono identici cella per cella alla Fase B. Spazienzio–Mara 38,8%, Mara–Piera 61,9%; fuori dalla soglia minima solo le patte dello specchio di Celestina (12,1%, accettate in D99 (4)). Correzione non eseguita: la regola della sezione 4 dà «tutti dentro». Un atteso di `Sb16iBotsTest` cambiato (D99 (7)). Spesi 703,8 s su 2.100. Domanda: adozione della 1.6b per il passo del client e la prova umana breve.

**1.6b adottata il 15 novembre 2026 in [D101](#decisioni-del-proprietario)** come bozza di riferimento, al posto della 1.5, per il passo del client e la prova umana breve. Rilancio del passo 0 a rete: [D100](#decisioni-del-proprietario).

**Passo del client consegnato il 15 novembre 2026** ([rapporto](reports/set-base/sb-16i-client-report.md)). Perimetro allargato al validatore del comando in [D102](#decisioni-del-proprietario). Il comando della mossa porta `searchChoice` (rifiutato con le regole vive); la vista propria dice quali dei due nomi sono nel mazzo, quella dei personaggi il contatore delle giocate. Nel client la finestra «Quale carta cerchi?» con due nomi disponibili, le righe della ricerca a due nomi, di «Gioca d'anticipo» e di «Rincara» in «Ultimo turno», il contatore sulla propria last resort e nell'ispezione dell'avversario. Con le regole vive identità viva identica e `Verify` verde; `VerifyResolution` a 1366×768 rossa in 2 giri su 5 per una corsa dello strumento, non attribuita (STOP 3, domanda 1 del rapporto). Prossimo: la prova umana breve.

**Rivisto dalla regia il 16 novembre 2026.** Nessun file fuori dal perimetro (D102 compreso), nessun atteso cambiato, solo test nuovi; impronte dell'identità viva uguali a quelle della Fase B; D102 conforme alla trascrizione dell'esecutore. Con le regole vive il percorso del clic su ✓ non cambia; il rosso viene da `restOn` (`client-web/tools/verify-resolution.mjs`), che non controlla un riquadro nullo nella corsa voluta col clic. Fuori dal blocco: per «L'ultimo giro» di Piera «Ultimo turno» legge «12+x» come metà della V residua, mentre la carta somma la L residua; è un difetto preesistente del client, da correggere in un suo blocco. **Aggiornato il 19 novembre 2026.** `restOn` è corretto e R6 è chiuso (`a918e4f`, [rapporto](reports/set-base/sb-client-reston-report.md), rivisto dalla regia). La lettura di «12+x» è rimandata: il client riceve solo `damageAmount` ("HIT 12+x") e legge ogni x come metà della V, sbagliando tutte le carte che si basano su un'altra risorsa (L spesa, A residua, oggetti sul campo). Serve che il server mandi risorsa e moltiplicatore, una modifica del contratto da fare con SB-28, quando le carte vere vengono ricostruite.

**Domande del passo del client decise il 16 novembre 2026 in [D103](#decisioni-del-proprietario).** Il rosso dello strumento è il rosso noto R6 e la correzione di `restOn` è la consegna 2 al client; contatore dell'avversario e «prossima: …» restano come sono fino alla prova umana breve, che il proprietario fa il 17 novembre 2026 sull'altra macchina. Dopo la prova, in un blocco piccolo del client del Set Base, la lettura di «12+x» per «L'ultimo giro» (`client-web/src/readability.ts`).

**Prova umana breve della 1.6b fatta il 16 novembre 2026, SB-16i chiuso ([D104](#decisioni-del-proprietario)).** Su questa macchina e un giorno prima del previsto. La finestra della scelta all'inizio non compariva per una build vecchia del client (i comandi della prova ora la ricostruiscono); dopo, il proprietario: «dalla prova sul lavoro fatto non emergono criticità». Contatore dell'avversario e assenza di «prossima: …» restano come sono.

**Completamento verificabile.** Soglia minima D95: ogni incontro fra starter fra 35% e 65% sui bot euristici, patte al massimo 10%, durata
entro 12 turni fuori dagli specchi; invarianti e bound verdi. Gli scostamenti residui si dichiarano e si passa comunque a SB-17.

**Rischi.** Parole chiave che allungano i testi o diventano un rebus (D78); una last resort che cresce troppo in fretta chiude anche partite
che oggi sono belle lunghe.

### SB-17, SB-18 — Personaggi da booster

Un blocco per personaggio: **Sergio Sommerso**, poi **Duccio Braccio Teso**. Senza starter: basic, bound, carte d'archetipo e un **mazzo di prova**.

**Passo con proposta ([D105](#decisioni-del-proprietario)).** Fase A: proposta breve in `docs/design/set-base/sb-17-proposta.md`, con le carte di Sergio aggiornate alla bozza di riferimento 1.6b e alle regole `d50` (le righe `CES-*` della griglia sono precedenti), la risposta a Q11, il mazzo di prova, il lavoro di codice per i bot e il budget della Fase B; STOP per il proprietario. Fase B: bozza, giro e mazzo di prova.

**Fase A consegnata il 16 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-17-proposta.md)). Q11: Sergio senza coppia né «Annuncia», punisce gli annunci altrui; revisione proposta di D52 (3). Quattro carte cambiano (Ricatto con metà del danno base al posto di WhatchaDoin, Lo sapevo col gettone che resta, Conto salato sul gettone, Fare il vago con +5 A), Malelingue più forte, salute 75 (stima). Mazzo di prova con le sole generiche della bozza; tre effetti Java nuovi e il lavoro dei bot; budget della Fase B 2.000 s, al più 3 giri. Cinque domande.

**Fase A approvata il 16 novembre 2026 in [D106](#decisioni-del-proprietario)**, con una modifica: Sergio ha un «Annuncia» (Oh, guarda là, NC, cerca Conto salato o Malelingue); Q11 chiusa e D52 (3) invariata. «Il gettone resta» solo come effetto stampato su Lo sapevo. Fase B: bozza, giro e mazzo di prova nel budget di 2.000 s. Con [D107](#decisioni-del-proprietario) il mazzo di prova usa le generiche suggerite dalla griglia, portate nella bozza con le classi Java che servono.

**Fase B consegnata il 16 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-17-report.md)). Sergio, le sue carte e `prova-sergio` in `bozza.json`; passo 0 e identità viva identici, fedeltà al 100%, mutazioni 7/7. Tre giri con entrambe le riserve «troppo debole» (salute 85, Conto salato 20 sul gettone): Sergio resta sotto la soglia D95 contro Mara (26,0%), Beppe (23,0%), Piera (7,2%) e Celestina (3,6%), dentro solo contro Spazienzio (38,7%); patte dello specchio 14,4%. La ricerca per mutazione trova mazzi da 95–99% senza carte di Sergio. Spesi 550,7 s su 2.000. Sei domande.

**Fase B rivista dalla regia il 16 novembre 2026; decisioni in [D109](#decisioni-del-proprietario).** Perimetro rispettato (con D108); attesi cambiati solo per contare Sergio nella bozza, dichiarati; passo 0, identità viva, fedeltà e contesto verdi. Due strascichi: `genera-bozza-di-riferimento.py --verifica` rosso (la bozza di riferimento è fuori perimetro) e la riserva predefinita del profilo `bozza` che ora comprende prova-sergio (`BozzaDraftTest`, mentre `docs/setup.md` dice «i cinque»): li sistema il blocco tecnico di D109 (3). Prossimo: ricerca di diagnosi sugli starter, poi la proposta A2.

**Fase A2 consegnata il 16 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-17-proposta-a2.md)). Ricerca di diagnosi sui cinque personaggi degli starter (628,7 s su 900, [evidenze](reports/set-base/sb-17/a2-search/search.md)): tutti arrivano al 77–99,5% coi mazzi costruiti tenendo al più 4 carte d'archetipo proprie; Estasi da Coca Etilene in tutte le ricerche dei non-Piera. Il 95% viene dal pool, ma lo starter di Sergio (21,8% contro 47–61,5%) è debole per conto suo. Proposta: «Lo sanno tutti» (15 A, 20 HIT) al posto di Fare il vago, Conto salato 8 + 6 sul gettone, Oh, guarda là che annuncia il colpo nuovo, mazzo di prova rivisto; riserve R1–R4, budget 1.000 s. Cinque domande.

**Fase A2 approvata il 16 novembre 2026 in [D110](#decisioni-del-proprietario)**, come raccomandata: Lo sanno tutti al posto di Fare il vago, Conto salato 8 + 6 sul gettone, Oh, guarda là che annuncia Lo sanno tutti o Conto salato, mazzo di prova rivisto con Spintone; Fase B2 con le riserve R1–R4 e 1.000 s. Il criterio dei mazzi costruiti non è un cancello per SB-17 e SB-18.

**Blocco tecnico SB-17t (D109 (3)) eseguito e rivisto dalla regia il 16 novembre 2026.** Senza `-Pool` la riserva del profilo bozza sono i mazzi con id `starter-*` (i cinque); `prova-sergio` resta scelto in «Con un tuo mazzo», con `-Com` e con `-Pool` esplicito; la bozza di riferimento lo chiama «mazzo di prova». Il generatore torna verde; la B2 cambia di nuovo `bozza.json`, quindi la bozza di riferimento si rigenera dopo la B2 (fuori dal suo perimetro), e allora la regia rilancia anche `TestServerContext` con i manifest, che la revisione non ha potuto rieseguire con la misura in corso.

**Fase B2 consegnata il 16 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-17-b2-report.md)). Dati di D110 in `bozza.json`; con [D111](#decisioni-del-proprietario) corretto in `BotView` il limite della previsione sugli oggetti Java consumati (Tennents Super), con passo 0 e identità viva identici, fedeltà al 100%, mutazioni 3/3. Giro con R1 (Lo sanno tutti 24 HIT) e R3 (20 A): al giro 3 Sergio è sotto D95 contro Celestina (24,9%) e Piera (33,7%), dentro negli altri incontri; patte dello specchio 5,9%. Il giro 2 (solo R1) aveva un solo incontro fuori (Spazienzio 68,3%). La ricerca tiene 2 carte proprie su 20. Spesi 486,2 s su 1.000. Tre domande.

**Fase B2 rivista dalla regia il 16 novembre 2026; decisioni in [D111](#decisioni-del-proprietario) e [D112](#decisioni-del-proprietario).** Correzione di `BotView` con passo 0 e identità viva identici, fedeltà al 100%, contesto e manifest verdi. Il giro 3 (R1 + R3) lasciava Celestina al 24,9% e Piera al 33,7%; il proprietario tiene lo stato del giro 2 (Lo sanno tutti 15 A, 24 HIT), già misurato, con il solo Spazienzio al 68,3%. La regia ha riportato il costo a 15 A in `bozza.json`, adeguato l'atteso di `Sb17CardsTest` e rigenerato la bozza di riferimento (`--verifica` verde); suite del server verde (883 test). Resta la prova del proprietario col mazzo di prova.

**Prova del proprietario col mazzo di prova, 16 novembre 2026 ([D113](#decisioni-del-proprietario)).** Le bound di Sergio sono due carte di danno, una strettamente peggiore dell'altra; meglio bound che trasformano gli oggetti propri in risorse o salute. Nomi da rivedere in SB-24. Prossimo: Fase A3 sulle bound.

**Fase A3 consegnata il 16 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-17-proposta-a3.md)). CES-BO3 «Lo rivendo» al posto di Frecciatina al volo: bersaglio sé, il proprio oggetto più vecchio esce senza effetto per +7 HEALTH, senza oggetti +2 HEALTH (4 unità nette con un oggetto da 3, R03 intatta); Battutina e Mi informo invariate. Mazzo di prova con 5 oggetti (Santino 2, Peroni 1; fuori una Tartaruga e Acqua in faccia). Forma Java con codice di bot (identità viva, contesto, fedeltà); giro corto con una riserva (R1: +5 HEALTH) e 500 s. Cinque domande.

**Proposta A3 approvata il 16 novembre 2026 in [D114](#decisioni-del-proprietario)**, con una modifica: l'oggetto che Lo rivendo vende lo sceglie il giocatore, non è il più vecchio in automatico. Prossimo: Fase B3.

**Fase B3 rivista dalla regia; il proprietario sceglie il mazzo intermedio e un giro prima della prova finale ([D116](#decisioni-del-proprietario)).** **Fase B3 consegnata il 16 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-17-b3-report.md)). Prima uno STOP prima del codice: la scelta dell'umano chiedeva validatore e client; con [D115](#decisioni-del-proprietario) («A, client dopo») la scelta è un campo facoltativo della mossa, il più vecchio se manca, i bot scelgono l'oggetto meno prezioso; il passo del client viene dopo. Regole del playground 1.2 (RP-25, RP-26), Lo rivendo in `bozza.json` con il mazzo della § 3; passo 0 e identità viva identici, fedeltà al 100%, contesto e manifest verdi, mutazioni 8/8. Giro: Spazienzio 76,9% e Mara 72,8%, con R1 (+5 HEALTH con l'oggetto) 74,9% e 69,2%; scostamento dichiarato. Una diagnosi a 4 semi attribuisce il salto ai ritocchi del mazzo più che alla bound; domande al proprietario sullo stato da tenere.

**Giro sul mazzo intermedio fatto il 16 novembre 2026 (D116), STOP per il proprietario** ([rapporto, § 8](reports/set-base/sb-17-b3-report.md#8-giro-sul-mazzo-intermedio-d116)). Solo dati. Giro 1 (Santino ×2, Espresso ×2, Acqua in faccia ×1, niente Peroni): Spazienzio 72,9% e Mara 67,2%, fuori D95. Giro 2 (mazzo della B2, Lo rivendo R1): solo Spazienzio fuori, 69,7% contro 68,3% (scostamento dichiarato); Mara 63,4%. Invarianti e bound oltre il tetto a 0. Resta in bozza il mazzo della B2; bozza di riferimento rigenerata; 134,2 s su 240. La prova finale del proprietario si fa su questo stato.

**Prova finale del proprietario, 16 novembre 2026 ([D117](#decisioni-del-proprietario)).** Forza in linea, «un po' forte»; le due bound «ci stanno»; Lo rivendo piace ma dovrebbe bersagliare l'oggetto. Idea del proprietario: Lo rivendo come basic, Sergio non usa gli oggetti ma li rivende; bound una di danno e una di difesa leggera. Prossimo: Fase A4, proposta.

**Fase B4 consegnata il 16 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-17-b4-report.md)). Regole del playground 1.3 e griglia (commit `53cb385`); Lo rivendo basic di Sergio (+6 HEALTH, con R1 +8), Lo metto in conto fuori, Fare il vago bound, mazzo di prova con Espresso ×1 e Santino ×2; caricatore, bot, previsore e tavolo come la § 6 della proposta. Passo 0 e identità viva identici, suite, contesto e manifest verdi, fedeltà al 100%, mutazioni 7/8 (una equivalente sugli oggetti di oggi). Giro: Sergio sotto D95 contro Celestina, Piera, Mara e Beppe (15–33%), specchio con patte al 19%; Spazienzio 47,1%. Letture: Fare il vago giocata 3,8 volte a partita, una su sei contro un colpo mostrato; mazzo esaurito nel 43% delle partite. Tre domande. Il passo del client di D115 (2) è chiuso: l'oggetto è il bersaglio della basic (D118 (6)).

**Prova del proprietario su Duccio, 17 novembre 2026: SB-18 chiuso ([D128](#decisioni-del-proprietario)).** Carte a costo HEALTH «molto rischiose», morti nel turno del colpo creduto decisivo; Mara difficile ma accettata; partite brevi; bound giocate quando il resto della mano ucciderebbe; forza «piu o meno» in linea. Le morti pagando e le partite brevi vanno in ingresso a SB-21. Prossimo: SB-19.

**Fase B2 rivista dalla regia il 17 novembre 2026; decisione in [D127](#decisioni-del-proprietario).** Perimetro rispettato, attesi cambiati solo per Duccio in bozza, verifiche verdi. R1, col verso letto dalla media, ha allontanato Mara e R2 l'ha riportata: le due quasi si annullano. Il proprietario accetta Mara al 33,00% e tiene la bozza finale. Prossimo: la sua prova sul jar, che chiude SB-18.

**Fase B2 di SB-18 eseguita il 17 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-18-b2-report.md), [D126](#decisioni-del-proprietario)). Taratura sulla V3: K170 (×1,7) 3 incontri fuori, **K185 (×1,85) 1** (Mara 33,94%), media 52,32%: vince K185. Duccio in `bozza.json` con le righe `ROC-*` della griglia, correzione di `StyleSupport.unlockedDamage` per la HEALTH con d50 (unico codice in `server/src/main`), test del costo in HEALTH sulle carte vere, braccio di Duccio nelle prove di fedeltà (100%), tetto D36 rispettato, mutazioni 6/6, passo 0 e identità viva identici. Giro 1 Mara 33,91%; R1 (costi ×1,95, verso scritto dalla media) Mara 26,45%; R2 (salute 115) **Mara 33,00%**, gli altri 49–62%, media 51,75%, specchio 7,53% di patte: **scostamento dichiarato** di 2 punti (D126 (3)). Bozza finale: salute 115, costi 16 / 10 / 28 / 33 HEALTH. Salute spesa 63 a partita (scheda 30–40). 337,4 s su 450. Tre domande.

**Fase B1e di SB-18 eseguita il 17 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-18-b1e-report.md), [D125](#decisioni-del-proprietario)). Cinque copie della V3, una leva per variante, senza «Ultimo colpo», bot e `bozza.json` invariati, nessun codice (banco e lanciatore come sono), 259.200 partite l'uno. Quota media contro gli starter (euristici; V3 92,1%): L1 salute 85 **60,0%** (−32,1), L2 1 HIT per HEALTH 80,9% (−11,2), **L3 costi ×2 44,7% (−47,4, un solo incontro fuori D95: Mara 26,3%)**, L4 senza cure 88,0% (−4,2), L5 = L1 + L3 11,5% (−80,6, leve quasi additive). Raccomandazione: V3 con costi ×1,85 (15 / 9 / 26 / 30 H), riserve R1 (costi ±0,1) e R2 (salute ±5), ma margine nullo su Mara e Spazienzio: taratura B1f prima della B2. 390,6 s su 600. Quattro domande.

**Fase B di SB-18 eseguita il 17 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-18-b-report.md)). Controllo e tre varianti nello stesso giro, 259.200 partite l'uno, nessuna riserva, nessun codice in `server/src/main`, passo 0 identico prima e dopo il banco. Incontri fuori D95: C 6, V1 6, V2 6, **V3 5**: per la regola scritta vince la V3, ma Duccio vince l'85–99% contro ogni starter in tutte e quattro, cioè 20–34 punti oltre il 65%. Mazzo esaurito sotto l'1,1% (partite da 5 a 8 turni), salute spesa 37–48 a partita contro 3–9 recuperata, Testa dura da suicida nel 3,5% (V1) e 2,6% (V2) dei posti-partita, con patta una volta su due (V1) o su tre (V2). 283,6 s su 600. Tre domande: quale variante e se serve un giro di taratura prima della B2, «Ultimo colpo» su Testa dura, patte dello specchio.

**Fase B1e rivista dalla regia il 17 novembre 2026; decisione in [D126](#decisioni-del-proprietario).** Solo dati, verifiche verdi. Costi ×2: media 44,7%, fuori solo Mara 26,3%; salute 85: 60,0%, due fuori; HIT e cure spostano poco. Candidato ×1,85 con Mara e Spazienzio al bordo. Prossimo: Fase B2, taratura a ×1,7 e ×1,85 dentro, poi bozza e verifiche complete.

**Fase B rivista dalla regia il 17 novembre 2026; decisione in [D125](#decisioni-del-proprietario).** Solo dati e test, passo 0 identico, verifiche verdi. In tutte le varianti Duccio vince dall'85% al 99% contro gli starter, partite di 5–7 turni; la meno lontana è la V3. Prossimo: Fase B1e, giro esplorativo sulle leve con base V3, «Ultimo colpo» fuori.

**Proposta di SB-18 approvata il 17 novembre 2026 in [D124](#decisioni-del-proprietario)**, con tutte le raccomandazioni. Prossimo: Fase B, controllo e tre varianti di Duccio nello stesso giro.

**SB-17 chiuso il 17 novembre 2026 ([D123](#decisioni-del-proprietario)).** Prova del proprietario sulla B6: «mi sembra tutto ok per lo stato in cui siamo». **SB-18 (Duccio): passo con proposta come SB-17.** Fase A: proposta breve in `docs/design/set-base/sb-18-proposta.md`, con due o tre varianti da misurare insieme nel primo giro della Fase B (lezione della B5e); STOP per il proprietario.

**Fase A consegnata il 17 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-18-proposta.md)). Costo in HEALTH come identità, tutto in dati (costo `HEALTH`, `lastBlow`, premio della ricerca in HEALTH): nessuna classe Java nuova. Salute 130 → 110 (stima); ROC-AR5 diventa il caricamento «Annuncia» (C → NC), premio +10 / +3 HEALTH; «Ultimo colpo» solo sulla rara Testa dura (25 H, 40 HIT), che prende il posto della cura rara; pari per suicidio lecito, coi bot che lo scelgono solo a sconfitta certa (filtri già nel codice). Mazzo di prova con generiche e oggetti già in bozza. Fase B come la B5e: controllo (griglia) e tre varianti (V1 salute che torna, V2 banca di salute a 130, V3 costi piccoli senza «Ultimo colpo») nello stesso giro, bozza e bot invariati, 600 s; poi B2 con la correzione di `StyleSupport.unlockedDamage`, i test del costo in HEALTH e la riserva R1 (salute ±10). Sei domande.

**B6 rivista dalla regia il 16 novembre 2026; decisione in [D122](#decisioni-del-proprietario).** V4 in bozza con R1 (Lo metto in conto +7 A); dentro D95 tutti gli incontri salvo Celestina al 32,2%, scostamento accettato; verifiche verdi, fedeltà al 100%, nessun codice in `server/src/main`. Resta la prova del proprietario.

**B5e rivista dalla regia il 16 novembre 2026; scelta in [D121](#decisioni-del-proprietario).** Solo la V4 porta Sergio quasi dentro D95 (fuori Celestina 31,6%), mazzo esaurito 27%, patte basse. Prossimo: Fase B6, V4 in bozza con un giro e la riserva R1 (Lo metto in conto +7 A), poi la prova del proprietario.

**Fase B6 eseguita il 16 novembre 2026** ([rapporto](reports/set-base/sb-17-b6-report.md)): V4 in bozza (94 carte; regole del playground 1.4, griglia CES-AR7). Giro 1 identico alla V4 della B5e: fuori solo Celestina 31,6%. Riserva R1 (Lo metto in conto +5 → +7 A): Celestina 32,2%, ancora 2,78 punti sotto; mazzo esaurito 26,7%, patte ≤ 5,3%, Spazienzio 59,7%. 212 s su 300, fedeltà al 100%. Scostamento dichiarato, STOP per il proprietario: la prova con il jar ricostruito.

**Fase B5e esplorativa ([D120](#decisioni-del-proprietario)), al posto della B5 di D119.** Quattro varianti con lo stesso giro, a confronto con la B4: V1 Lo rivendo con A e HEALTH; V2 carte di A nel mazzo; V3 carte che usano gli oggetti nel mazzo; V4 Lo metto in conto di nuovo basic e Lo rivendo carta del mazzo. Poi STOP con una raccomandazione.

**Fase B5e eseguita il 16 novembre 2026** ([rapporto](reports/set-base/sb-17-b5e-report.md)): un giro per variante, nessuna riserva. Incontri fuori D95: controllo 5, V1 3, V2 4, V3 4, **V4 1** (Celestina, 3,44 punti); mazzo esaurito 43% → 33 / 39 / 36 / **27**%. Raccomandazione: V4. Richiede una deroga: `vendi` in una regolare (caricatore, sim, con test). STOP per il proprietario.

**Fase B4 rivista dalla regia il 16 novembre 2026; decisione in [D119](#decisioni-del-proprietario).** Verifiche verdi (una mutazione equivalente sopravvissuta, dichiarata); Sergio fuori D95 dal basso anche con R1 (Celestina 15,4%, Piera 17,5%, Mara 27,0%, Beppe 33,4%), mazzo esaurito 43%, patte dello specchio 18,9%. Lettura della regia: senza la A di Lo metto in conto Sergio ripiega sulle bound, che scartano. Prossimo: Fase B5, Lo rivendo +12 A e bot di Fare il vago.

**Proposta A4 approvata il 16 novembre 2026 in [D118](#decisioni-del-proprietario)**, con tutte le raccomandazioni; con l'oggetto sparito alla risoluzione nessun guadagno. Prossimo: Fase B4. **Fase A4 consegnata il 16 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-17-proposta-a4.md)). Lo rivendo diventa la basic (CES-BA, pr. 1, bersaglia un proprio oggetto, che esce senza effetto: +6 HEALTH; con l'oggetto sparito nessun guadagno); Lo metto in conto esce dalla bozza (R02: una sola basic). Al posto della bound di vendita «Fare il vago» (CES-BO3, pr. 2, HIT e CUT ×0,75 nel turno, 2,5 unità); Battutina resta. Parate nel mazzo di prova: 2 su 20 più 4 contromosse; con la bound la parata è sempre in mano; un solo ritocco, Espresso 2 → 1 e Santino 1 → 2. Il passo del client di D115 (2) non serve più: l'oggetto è il bersaglio della basic. Forma dati col passo `vendi` spostato, codice dei bot con identità viva, contesto, fedeltà e mutazioni; giro corto con R1 (±2 HEALTH sul ricavato) e 300 s. Cinque domande.

**Perimetro.** Bozza e giro contro gli starter e fra loro. Possono essere più forti degli starter se la costruzione del mazzo lo richiede.

**Completamento verificabile.** Mazzi di prova competitivi ma non dominanti secondo i criteri per i mazzi costruiti. Invarianti verdi. Alcune partite del proprietario con il mazzo di prova. Per Duccio, test sul costo in HEALTH: la mossa si presenta solo con salute sufficiente; un costo che porterebbe a 0 o sotto non si paga, salvo le carte con «Ultimo colpo», che si risolvono anche a terra (D50, punto 2); il bot non si suicida per caso. Contro gli starter vale la soglia minima di [D95](#decisioni-del-proprietario); i criteri completi tornano in SB-21.

**Rischi.** Contromosse che rendono frustrante la partita (Sergio); partite infinite o, col prezzo in salute, suicidi facili (Duccio): durata sotto controllo.

**Deciso il 10 novembre 2026 ([D47](#decisioni-del-proprietario)): il costo in salute di Duccio resta.** Col concept nuovo il gioco
di parole «incassare = prendere soldi» cade. La sessione di flavour ha proposto di tenerlo, con tre letture
([scheda](design/set-base/schede-personaggi.md#domanda-per-sb-18-il-costo-in-salute-con-duccio)): si fa male dandole; non arretra per
principio; il martire della causa. Il proprietario ha accolto la raccomandazione della regia: tenerlo, preferire le prime due letture,
cautela sulla terza (per un personaggio satirico di estrema destra rischia di suonare celebrativa invece che ridicola). SB-18 parte da
qui; la meccanica non cambia. I nomi di lavoro delle carte legati ai concept vecchi (`CES-*`, `ROC-*`) si rifanno in SB-17, SB-18 o SB-24.

### SB-19 — Resto del pool e giro di blocco

**Perimetro.** Generiche, oggetti e last resort rimaste, comprese terze bound e carte rare, partendo dalle candidate della bozza non ancora assegnate. **Sono l'ultimo blocco perché creano le combo più pericolose.** Giro sulle sole aggiunte.

**Completamento verificabile.** Griglia completa: totale fra 110 e 120 (con [D129](#decisioni-del-proprietario) si può superare di poco, circa 123), ogni carta con rarità. Gli starter non peggiorano.

**Rischi.** Il pool può arrivare stanco: le generiche devono restare interessanti, non riempitivi.

**In ingresso ([D124](#decisioni-del-proprietario)).** Secondo fiato (ex ROC-AR6, +15 HEALTH e HIT ricevuto ×1,25 per 2 turni), come idea per una generica; il conto del set e le rarità con Duccio a 2 C / 3 NC / 1 R e CES-AR7.

**In ingresso ([D117](#decisioni-del-proprietario)).** Dalla prova di Sergio: oggetti con un malus per chi li ha in campo (Sergio li rivende); carte che anticipano i guadagni di risorse, anche rubandole all'avversario.

**In ingresso ([D110](#decisioni-del-proprietario)).** La [ricerca di diagnosi di SB-17](reports/set-base/sb-17/a2-search/search.md): coi mazzi costruiti ogni personaggio batte gli starter al 77–99,5%. Ricorrono Estasi da Coca Etilene (PIN-AR2, un colpo da 18 senza costo per chi non ha L, in tutti i mazzi vincenti di chi non è Piera), Sgommata e gli oggetti. Da guardare qui e in SB-20, insieme alle carte d'archetipo giocate fuori dal loro personaggio; parte del dato può venire dai bot.

**SB-19 chiuso il 18 novembre 2026 ([D135](#decisioni-del-proprietario)).** Prova del proprietario col client superata: «mi sembra funzioni tutti come dovrebbe». Set a 123 carte.

**Fase B2a rivista dalla regia il 18 novembre 2026.** Perimetro di D133 rispettato; le tre carte vive toccate ricevono solo il testo del loro timer, letto dal solo Difficile con `d50`; identità viva, Rif e contesto identici o verdi, fedeltà al 100% con le pesche escluse e contate, i timer ora confrontati, nove mutazioni uccise. Nessuna domanda. Prossimo: ripresa della B2.

**Fase B2a consegnata il 18 novembre 2026** ([rapporto](reports/set-base/sb-19-b2a-report.md)). La patch della B2 è assorbita: due oggetti, dieci mazzi, griglia a 123 carte (44 C / 59 NC / 20 R), attesi della bozza cambiati solo per D130. `ViewTable` gioca i timer come il motore (testo dei timer in una lista a parte di `PrintedEffects`, dichiarato in tre carte); `ViewTableFidelityTest` esclude e conta per causa le pesche del turno confrontato (532 e 36 finestre nel braccio «malus», 0 negli altri) e confronta ora anche i turni con un timer. Tutte le fedeltà al 100%, bracci vecchi con finestre uguali o più; passo 0, identità viva, «Rif», suite, contesto e manifest identici o verdi. Prossimo: la B2 dal passo 2.

**Ripresa della B2 rivista dalla regia il 18 novembre 2026; decisione in [D134](#decisioni-del-proprietario).** Codice di `main` invariato (solo prove, strumenti e client); scambio dei mazzi di Sergio confermato sulla bozza (tolti i due Espresso); il +17 di Beppe contro Spazienzio c'era già con Colpo allo stomaco. Oggetti tenuti a M1, Sergio e ricerca «dopo» a SB-20.

**Ripresa della B2 consegnata il 18 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-19-b2-report.md#ripresa-18-novembre-2026)). Prove unitarie del caricatore (RP-28) e del motore (RP-27), 14 mutazioni uccise; «Rif» identico; giro M1/M2 e controllo senza malus; client con la pillola del malus. Alla lettera la regola di scelta fa uscire entrambi gli oggetti (M1 e M2 non passano per i mazzi di Sergio; Beppe + Conto supera +15), ma i mazzi di Sergio escono in giù anche senza malus, per lo scambio dei suoi Espresso: lettura e domande al proprietario. Ricerca «dopo» su 4 personaggi di 7: il primo lancio (1.982 s) ha superato il budget. Gli oggetti restano in `main` coi valori di M1.

**Fase B2 rivista dalla regia il 18 novembre 2026; decisione in [D133](#decisioni-del-proprietario).** Regola, motore e bot fatti; passo 0, identità viva, Rif e contesto identici o verdi. Rossa la fedeltà della vista sul braccio «malus»: 440 finestre per pesche nel turno (informazione nascosta) e 6 per timer che la vista non modella. Prima un passo dei bot, B2a (timer modellati, pesche escluse e dichiarate), poi la B2 riparte dalla patch.

**Fase B2 fermata il 18 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-19-b2-report.md)). Regola 1.5 (RP-27, RP-28) scritta prima del codice; motore, caricatore e bot dietro `d50`, con passo 0, identità viva, «Rif», contesto e suite identici o verdi. Il braccio nuovo «malus» di `ViewTableFidelityTest` è rosso in 446 finestre su 5.024, tutte informazione nascosta (oggetti col malus pescati o scalzati nel turno confrontato) o timer non modellati. Il proprietario, interpellato, ha scelto lo STOP. Bozza coi due oggetti, dieci mazzi e braccio di fedeltà sono in una patch del rapporto, non in `main`. Giro, ricerca, client e jar da fare; tre domande.

**Fase A2 consegnata il 17 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-19-proposta-a2.md)). Regola nuova proposta, RP-27 con il formato RP-28: un oggetto può avere un effetto «In campo» che agisce a fine turno su chi lo ha vicino in quel momento, anche nel turno d'arrivo; non è un danno e non tocca mai HEALTH; consumato, venduto o scalzato non agisce. Due oggetti: OGG-17 «Conto del tavolo sei» (NC, −3 A a fine turno, consumato +15 V, l'idea pilota) e OGG-18 «Sigaretta accesa» (R, +2 T a fine turno, consumato +10 A). Set a 123, 44 C / 59 NC / 20 R. Forma: campo facoltativo `inPlay` nelle bozze, motore dietro `d50`, letture dei bot che valgono zero senza oggetti col malus, una pillola nel client. Fase B proposta in due: B1 le 9 carte (2.400 s), poi B2 regola, codice, bot, client e prova (2.400 s), con la ricerca «dopo» una volta sola. Niente misure. Cinque domande.

**Proposta A2 approvata il 17 novembre 2026 in [D130](#decisioni-del-proprietario)**, con tutte le raccomandazioni: RP-27 senza turno di grazia e mai su HEALTH, Conto del tavolo sei (NC) e Sigaretta accesa (R), set a 123, Fase B in due (B1 le 9 carte, B2 la meccanica). Prossimo: Fase B1.

**Proposta rivista dalla regia il 17 novembre 2026; decisioni in [D129](#decisioni-del-proprietario).** Approvate Secondo fiato e Mano lesta; Grappa resta e il tetto di 120 si può superare di poco; due oggetti col malus in campo entrano ora, in aggiunta; Estasi e Sgommata solo misurate. Prossimo: Fase A2, proposta della meccanica e dei due oggetti, con la Fase B riscritta.

**Fase A consegnata il 17 novembre 2026, STOP per il proprietario** ([proposta](design/set-base/sb-19-proposta.md)). Alla bozza mancano 9 slot (GEN-04, 08, 10, 11, 19, 20, 21; OGG-08, 16); ne entrano 8 e il set chiude a 120 con CES-AR7 dentro e senza Grappa (OGG-16), rarità 44 C / 58 NC / 18 R. Secondo fiato (D124) prende lo slot di «Sedia in testa», col malus su HIT e CUT; Mano lesta (D117, gratis, ±5 A) quello di «Bottigliata»; GEN-11 e OGG-08 prendono +5 A. L'oggetto col malus in campo (D117) non diventa una carta: chiede regola nuova, motore, bot e client; resta un'idea pilota. Estasi e Sgommata si misurano senza toccarle. Fase B: riferimento e due bracci nello stesso giro, ricerca di diagnosi prima e dopo, criteri e riserve scritti, tetto 3.600 s. Cinque domande.

**Fase B1b rivista dalla regia il 18 novembre 2026; decisione in [D132](#decisioni-del-proprietario).** Solo dati, Rif identico, attesi cambiati solo per le tre varianti scelte. I numeri muovono poco: il limite è come i bot giocano le carte nuove; il progresso vero viene dagli scambi rivisti di Mara e Duccio. Accettata come limite dei bot. Prossimo: Fase B2.

**B1b, 18 novembre 2026** ([rapporto](reports/set-base/sb-19-b1b-report.md)). Misurate 3 varianti per carta in isolamento (1.049 s su 1.800): nessuna carta nuova esce dalla banda nel verso che serve ai mazzi con le aggiunte, perché il limite non sono i numeri ma quanto poco i bot giocano le carte (Mano lesta 0,12 giocate per partita, Coccio con tre moltiplicatori identici); la sola vera correzione è lo scambio dei mazzi di Mara e Duccio (Mano lesta ora sta al posto di carte della sua famiglia: da −13,5 a +4,4 in isolamento). Scelte: Elemosina gratis, Non sento niente 5 V ×0,25, Mezza minerale +20 A; Mano lesta, Coccio, Maleducazione, Colpo e Secondo fiato (+12) restano. Dei nove mazzi nessuno sta nella banda (Mara + è in su, +11,6); la riserva non ha varianti che cambino qualcosa.

**Fase B1 rivista dalla regia il 17 novembre 2026; decisioni in [D131](#decisioni-del-proprietario).** Perimetro rispettato (due ancore aggiornate per il titolo della griglia), riferimento identico, attesi cambiati solo per le carte nuove. Il criterio 2 misurava solo gli eccessi; il proprietario fissa il principio: le carte da booster rendono il mazzo più forte dello starter, fra 0 e +10 punti di media, mai oltre +15. Molte carte nuove oggi lo indeboliscono. Prossimo: Fase B1b, rinforzo con varianti nello stesso giro.

**Fase B1 consegnata il 17 novembre 2026, STOP per il proprietario** ([rapporto](reports/set-base/sb-19-b1-report.md)). Le nove carte sono in griglia e in bozza (121 carte, 44 C / 58 NC / 19 R); «Rif» identico alla bozza di oggi su 403.200 partite; nessun mazzo con le aggiunte passa i criteri 2–3 alla lettera: in su Secondo fiato (portata al valore A2, +12 HEALTH), Estasi e Grappa, in giù i mazzi più deboli dei riferimenti, che la riserva scritta non ripara. Ricerca «prima»: Estasi nel mazzo vincente di 14 ricerche su 14. Nessuna soglia spostata; cinque domande nel rapporto.

### SB-20 — Prima misura dell'intero set

**Perimetro.** Fotografia, senza correzioni: **matrice completa** degli starter, **ricerca automatica** dei mazzi più forti per personaggio, **analisi delle carte** dominanti o inutilizzate,
controllo FFA.

**Completamento verificabile.** Rapporto completo e riproducibile. Elenco dei problemi in ordine di gravità, proposto al proprietario insieme al numero massimo di giri.

**Rischi.** Molti problemi insieme: si parte da quelli che spostano più matchup.

**Consegna SB-20 (19 novembre 2026), STOP 4** ([rapporto](reports/set-base/sb-20-report.md)). Bozza D143, porta «Rif» identica a SB-20c B1, matrice dei sette riferimenti completa. Ricerca «dopo» conclusa per quattro personaggi su sette prima di esaurire 4.000 s. **Chiuso** il 19 novembre 2026 ([D145](#decisioni-del-proprietario)): niente ripresa, i tre personaggi mancanti si misurano nel giro 1 di SB-21; FFA alla prova umana di SB-22.

**In ingresso ([D137](#decisioni-del-proprietario)).** Rarità P per i sette personaggi (42 C / 56 NC / 18 R / 7 P), regolamento 1.14: spostata a SB-24 da [D144](#decisioni-del-proprietario).

**In ingresso ([D136](#decisioni-del-proprietario)).** Prima di SB-20: SB-20a (pagina HTML locale con le 123 carte, campi modificabili, esportazione delle modifiche), revisione del proprietario, sue scelte applicate. SB-20 resta senza correzioni: Estasi e Grappa (D131) si misurano e vanno in cima all'elenco dei problemi, si correggono nel primo giro di SB-21.

**SB-20a rivista dalla regia il 18 novembre 2026.** Nessun dato toccato, script e conti (123; 44 C / 59 NC / 20 R) rifatti. Domande 1 e 2 del rapporto risolte senza il proprietario: base.md descrive il vivo e la bozza il playground, la differenza è attesa; i turni hanno una sola convenzione (`turns` conta i turni dopo quello corrente, il testo li conta tutti), nessun errore. Flavour e illustrazioni delle carte partono vuoti: li scrive il proprietario nella pagina. Le intestazioni di `flavour.md` coi nomi precedenti si sistemano nel blocco che applica la revisione.

**Consegna SB-20a (18 novembre 2026).** Pagina e script in `docs/design/set-base/revisione/genera-pagina.py`, che genera `tmp/revisione-carte.html` (un solo file, senza rete); rapporto [sb-20a-report](reports/set-base/sb-20a-report.md). Le 123 carte (116 di bozza e 7 personaggi) con 44 C / 59 NC / 20 R come nella griglia. Aperte per il proprietario: il contrasto fra base.md e bozza su Spazienzio e Celestina; i turni nei testi di cinque carte e il costo «0 A» di CES-AR7; il flavour delle carte da scrivere; i nomi dei personaggi in `flavour.md`. Nessun dato del gioco cambiato: revisione del proprietario da fare prima di SB-20.

**Consegna SB-20b, Fase A (18 novembre 2026), STOP per il proprietario** ([proposta](design/set-base/sb-20b-proposta.md)). Solo documenti. Quattro regole controllabili (R1 non interi, R2 moltiplicatori a quarti, R3 importi fuori scala, R4 testo e dati); «non multiplo di 5» scartata perché segnalerebbe 62 carte su 116. Il set è già quasi pulito: proposti **3 moltiplicatori** (MAR-AR4 ×0,4 → ×0,5, GEN-13 ×0,6 → ×0,5, OGG-11 ×0,8 → ×0,75), **GARGANTUESCO IMPATTO 34 → 35** (eccezione argomentata a D90 (1)), il testo di CES-AR7 e il riallineamento della griglia su tre carte di Mara (D99); intoccabili D134, D127, D132, D97, D99. Fase B: applicazione, «Rif» prima e dopo con gli strumenti di SB-19, identità sui mazzi senza carte toccate, ritiro del singolo cambio che spinge una coppia fuori da D95, budget 1.200 s. Cinque domande. **Approvata in [D139](#decisioni-del-proprietario)** («Sì, tutte»): tutti i cambi proposti, nessun arrotondamento di MAR-AR3 e GIG-BA, controllo `controlla-numeri.py` in Fase B.

**Consegna SB-20b, Fase B (18 novembre 2026)** ([rapporto](reports/set-base/sb-20b-report.md)). In `bozza.json` i cinque cambi di D139: MAR-AR4 e GEN-13 ×0,5, OGG-11 ×0,75, GARGANTUESCO IMPATTO 35 HIT, CES-AR7 senza «0 A:»; griglia riallineata (MAR-AR1–AR3 a D99). «Rif» prima e dopo: base identica a B2a, criteri 1–4 rispettati (spostamento massimo 2,66, Spazienzio–Mara; Mara–Beppe 39,58%), riserva non usata, 229 s su 1.200. Spazienzio 43,2% → 44,9% di media non-specchio, Mara 52,6% → 51,5%. Nuovo controllo [controlla-numeri.py](design/set-base/controlla-numeri.py) (R1–R4, valori tenuti citati), verde. Attesi di cinque test cambiati per D139 (`Bozza16Test` con D140, dopo uno STOP 1); suite `Test` verde. **Chiuso** il 18 novembre 2026 ([D141](#decisioni-del-proprietario)).

**In ingresso ([D134](#decisioni-del-proprietario)).** Rimisurare Conto e Sigaretta nei mazzi di Sergio senza togliere gli Espresso (con lo scambio della B2 escono a −31/−32, −23/−18 anche senza malus); rifare intera la ricerca «dopo» (nella B2 solo 4 personaggi su 7; il banco a 26 mazzi costa circa 2,6 volte la «prima»).

**In ingresso ([D131](#decisioni-del-proprietario)).** Le carte da booster rendono il mazzo più forte dello starter, fra 0 e +10 punti di media, mai oltre +15 in un confronto: vale per tutte le carte fuori dagli starter, anche quelle d'archetipo. Estasi (nel mazzo vincente di 14 ricerche su 14 prima di SB-19) e Grappa (+11,5 da sola in un mazzo di Beppe senza chi usa L, da spiegare) si misurano qui e si correggono nel primo giro di SB-21 (D136).

**SB-20c, Fase A.** [Proposta sui testi generati](design/set-base/sb-20c-proposta.md) e prototipo su 116 carte; STOP per decisione del proprietario. **Approvata in [D142](#decisioni-del-proprietario)** («Sì, tutto»), con la Fase B in due: B1 testi in bozza e controllo, B2 simboli nel client.

**SB-20c, Fase B1 consegnata.** [Rapporto](reports/set-base/sb-20c-b1-report.md). Testi in bozza per 116 carte, controllo esatto verde e undici mutazioni respinte. «Rif» identico alla base su 403.200 partite, suite `Test` verde. Il controllo accompagna R1–R4 a ogni diff di SB-21 (D142). **Chiusa** il 19 novembre 2026 ([D143](#decisioni-del-proprietario)); i due controlli entrano nella tabella delle aree. Resta la **Fase B2** (escape nella fabbrica della bozza, simboli nel client web), da fare prima delle prove umane.

**SB-20c, Fase B2 consegnata il 19 novembre 2026, rivista dalla regia e chiusa** ([rapporto](reports/set-base/sb-20c-b2-report.md)). Escape nella fabbrica della bozza e simboli delle risorse nel client (ispezione, collezione, volto Pixi), con i cinque nomi accessibili in italiano. Nessun dato di `bozza.json` toccato. Suite `Test` e contesto verdi, 367 test web, matrice del vivo 8/8, identità del vivo e profilo bozza verificati, mutazioni nel browser respinte. A 750×292 nessun problema nuovo rispetto alla base (un problema isolato del layout non si ripresenta e c'è anche sulla base). Prima di SB-22 valgono l'ordine di D152 e il blocco separato per «12+x» di «L'ultimo giro». STOP per la revisione della regia.

### SB-21 — Giri di correzione

**Perimetro.** Ripetibile. Un giro per sessione. Si corregge secondo l'[ordine concordato](#bilanciamento-metodo-e-criteri), si rilancia matrice e ricerca e si registra cosa è cambiato. Da [D95](#decisioni-del-proprietario) qui si ricontrollano anche gli starter fra loro, per la partita rapida, coi criteri completi.
Massimo: 3 giri prima di tornare dal proprietario, i primi due da 5.500 s, il terzo in due sessioni da 7.000 e 9.000 s; ricerca un personaggio per volta ([D145](#decisioni-del-proprietario), [D148](#decisioni-del-proprietario)).

**Giro 1 (19 novembre 2026), STOP di selezione.** Estasi resta a 18 e Grappa a +25 L. Le tre varianti di Estasi fanno uscire almeno tre coppie di Piera dal 35–65%. Nessuna variante di Grappa rientra nella banda D131. Isolamenti e matrice consegnati, ricerca in attesa della decisione sulla leva per Estasi ([rapporto](reports/set-base/sb-21-giro-1-report.md)).

**Giro 2 (19 novembre 2026), STOP di selezione.** Nessuna delle quattro varianti di D147 passa. La bozza conserva Estasi gratuita a 18 + L e Grappa a +25 L. Passo 0 e matrice identici a SB-20; ricerca «dopo» e scontri fra costruiti sospesi alla selezione ([rapporto](reports/set-base/sb-21-giro-2-report.md)).

**Giro 3a (19 novembre 2026), STOP di selezione.** Passo 0 identico a SB-20. Con Estasi 10 + 2 × L nessuno dei sei compensi singoli e delle tre combinazioni tiene tutte le coppie di Piera nel 35–65%. Miglior combinazione al 33,39% contro Celestina. La bozza in consegna resta quella di SB-20, con 5 coppie su 21 fuori obiettivo. Prove sugli starter sospese alla selezione ([rapporto](reports/set-base/sb-21-giro-3a-report.md)).

**Giro 3a rifatto (19 novembre 2026), D149 superata.** Estasi 10 + 2 × L, verificata nei tre isolamenti. Tutte le coppie nel 35–65% e fuori obiettivo 5 → 3. La bozza consegnata è l'ingresso del giro 3b ([rapporto](reports/set-base/sb-21-giro-3a-bis-report.md)).

**Giro 3b (19 novembre 2026), STOP per il proprietario.** Ricerca dei sette e scontri diretti completi. Tutti i 35 incroci costruito–starter sopra il 70%, Piera senza incroci sfavorevoli. Tre passate scartate per D149, bozza del 3a-bis confermata. [Rapporto e domande](reports/set-base/sb-21-giro-3b-report.md).

**SB-21t (19 novembre 2026), chiuso.** Nessun tetto adottato: a 35 e 30 HIT Piera costruita resta all'87% contro i costruiti e la matrice degli starter esce dal controllo di D149. Per SB-22 valgono i sette finalisti del giro 3b; niente altri giri prima della prova umana ([D151](#decisioni-del-proprietario)).

**SB-21e ([D152–D154](#decisioni-del-proprietario)), STOP per il proprietario.** Estasi da Coca Etilene torna come GEN-24, rara, 10 T + 10 L per 30 HIT. Il set arriva a 124 carte e l'isolamento con Celestina perde 12,17 punti di media. Giro secco, nome di lavoro di PIN-AR2, resta gratuito e fa 10 HIT più il doppio della L spesa, con 0 HIT a sé. Con i finalisti del giro 3b Piera costruita vince tutti e sei gli scontri con ogni candidato misurato. [Rapporto e domande](reports/set-base/sb-21e-report.md). **Rivisto dalla regia il 20 novembre 2026 e chiuso con [D155](#decisioni-del-proprietario):** bozza adottata così com'è. Giro secco è in tutte e sette le liste costruite, quindi indebolirlo toglie forza anche agli avversari; il dominio di Piera viene dal suo motore a L. Si va a SB-22.

**SB-21f (20 novembre 2026), STOP per il proprietario.** Giro secco a 10 + L ed Estasi a 40 HIT ([D156](#decisioni-del-proprietario)). Starter nel controllo D149 con Testata a 35 HIT e Piera a 79 salute. Ricerca dei sette completa. Piera vince 6/6 anche nei due candidati ricercati, e 32/35 incroci costruito–starter superano il 70%. Giro secco in Beppe ed Estasi in Celestina sono sotto D131. Banco 5.974,56 s su 6.000, incluso il confronto rapido con la copia arrotondata. [Rapporto e finalisti](reports/set-base/sb-21f-report.md). **Rivisto dalla regia e chiuso con [D157](#decisioni-del-proprietario):** bozza adottata, si riprende SB-22.

**SB-21g ([D158](#decisioni-del-proprietario)), concluso e rivisto dalla regia il 20 novembre 2026.** Bozza conforme. Starter 21/21 nel 35–65%, 2 fuori obiettivo, patte 4,164%, durata 8,702 turni, tutte le bound entro D33/D36. Giro secco in Beppe ed Estasi in Celestina sotto banda D131. Ricerca dei sette e due matrici complete. Piera vince 6/6, 35/35 incroci costruito–starter oltre il 70%. Banco 5.239,78 s su 6.000. [Rapporto e finalisti](reports/set-base/sb-21g-report.md).

**SB-21h ([D159](#decisioni-del-proprietario)), bound ripensate.** Ogni personaggio: (a) danno più risorsa o pulizia, (b) risorsa più HIT, CUT e POISON ricevuti ×0,75 per un turno, (c) variante per i costruiti fuori dagli starter. Criterio: +10 punti al massimo contro bound nulle, al posto del tetto in unità. Fase A proposta, Fase B misura e ribilanciamento. **Fase A** consegnata e rivista ([proposta](design/set-base/sb-21h-bound-proposta.md)), approvata con correzioni in [D160](#decisioni-del-proprietario): risorsa della difesa dalle generatrici di oggi, prima i bot, Fase B da 9.000 s. **Fase B** ([report](reports/set-base/sb-21h-report.md)), **STOP per il proprietario** al punto 4 di D160: bot che leggono difesa di un turno con guadagno e pulizia parziale (identità viva e passo 0 conservati), le due varianti Java, criterio +10 per bound rispettato coi valori tenuti (Sergio (b) solo senza risorsa), ma gli starter non passano D149 (4): Spazienzio +20 punti circa su tutti, 9 coppie fuori obiettivo, durata 8,70 → 9,13 turni; le due alternative a dati non bastano (9,05 e 9,01). Bozza tornata alla consegna di SB-21g; candidato misurato in `server/src/test/resources/set-base/sb-21h/`. Ricerca dei costruiti non fatta. Budget 3.758 s su 9.000. **Chiuso** con [D161](#decisioni-del-proprietario): si prosegue in SB-21z.

**SB-21z ([D161](#decisioni-del-proprietario)), ultimo bilanciamento, eseguito dalla regia.** Bound di SB-21h in bozza; numeri belli davvero; criteri assoluti (coppie di starter 35–65%, durata media ≤ 10 turni, specchi ≤ 15 turni, patte ≤ 6% e ≤ 12% negli specchi; fra costruiti nessuno 6/6 e nessuno scontro oltre il 70%); ricerca automatica sulle leve dei personaggi, poi sulle carte degli starter, poi costruiti. Poi la bozza si congela. **Chiuso** ([D162](#decisioni-del-proprietario), [report](reports/set-base/sb-21z-report.md)): starter, numeri belli e bound a posto nel candidato z2, ora `bozza.json` (salute 70/65/65/80/75/85/115; Spazienzio misurato coi bot è il meno affidabile); costruiti fuori criterio, 12 scontri oltre il 70% con la forza che segue la salute. Il proprietario sceglie la prova umana invece di un altro blocco sui costruiti; test adeguati ai valori di z2. Banco 12.609 s.

**Completamento verificabile.** Criteri di arrivo raggiunti o scostamenti residui dichiarati e sottoposti al proprietario.

**Rischi.** Inseguire il perfetto: una strategia un po' più forte è ammessa. Correzioni che rompono gli starter stabili: la matrice lo mostra.

**Anticipato ([D138](#decisioni-del-proprietario)).** La pulizia dei numeri «brutti» (SB-20b) si fa prima di SB-20, perché SB-20 misuri il set già pulito. Restano qui le correzioni che vengono dalla misura, comprese Estasi e Grappa ([D136](#decisioni-del-proprietario)).

**In ingresso ([D121](#decisioni-del-proprietario)).** I bot giocano Fare il vago (bound di difesa di Sergio) 3,3 volte a partita, una su sei contro un colpo mostrato: insegnare a giocarla solo contro un colpo mostrato o previsto.

**In ingresso ([D127](#decisioni-del-proprietario)).** `StyleSupport.affordableAfter` legge ancora un costo in HEALTH con `>=`: con d50 un bot può stimare pagabile una carta a salute pari al costo (il motore la rifiuta). Allinearlo alla correzione di `unlockedDamage` della B2 di SB-18.

**In ingresso ([D132](#decisioni-del-proprietario)).** I bot quasi non giocano Mano lesta (0,12 volte a partita) e non sfruttano Coccio di bottiglia (stesso risultato a ×1,5, ×2 e ×2,5): insegnare a leggerle, poi rimisurare i mazzi con le aggiunte di SB-19 contro la banda di D131.

**In ingresso ([D128](#decisioni-del-proprietario)).** Dalla prova di Duccio: morti nel turno in cui paga in salute il colpo che crede decisivo, partite molto brevi («si muore o si vince molto alla svelta»). Ricontrollare col set intero, insieme a Duccio–Mara (33,00%, D127).

### SB-22 — Prova umana con mazzi costruiti

**Perimetro.** Partite umane con mazzi costruiti, compresi quelli trovati dalla ricerca, e qualche FFA. Eventuali correzioni tornano a SB-21.

**Completamento verificabile.** **Giudizio del proprietario** registrato: è il criterio decisivo.

**Chiuso il 21 novembre 2026** ([D163](#decisioni-del-proprietario)): «mi piace molto il set»; i costruiti non sono ottimali, ma ogni giocatore si costruirà i suoi mazzi. Nessuna correzione alla bozza di D162.

**Rischi.** Pochi giocatori: il giudizio resta soggettivo, ed è dichiarato come tale.

**Guida ([D162](#decisioni-del-proprietario)).** [sb-22-prova.md](reports/set-base/sb-22-prova.md): avvio del server della bozza coi sette costruiti di SB-21z, partite in ordine di importanza, cosa annotare.

**Per il tavolo.** Oltre al client, la bozza e gli starter si stampano con `tools/print-cards/generate.py --bozza` (anche `--starter`), che rilegge `bozza.json` a ogni esecuzione e mette l'impronta sulle carte ([rapporto](reports/set-base/stampa-bozza-report.md)). Ristampare dopo ogni cambio della bozza, a partire da SB-21e.

### SB-23 — Valutazione delle varianti del formato

**Perimetro.** Si confrontano **20 carte e 2 copie con 25 carte e 3 copie**, e si misura l'effetto della dimensione sul ritmo e sulla costanza dei mazzi. La prima misura è anticipata in [SB-16h](#sb-16h--prova-esplorativa-della-dimensione-del-mazzo) (D81); qui resta la conferma sul set intero e coi mazzi costruiti.

**Completamento verificabile.** Dati presentati al proprietario, che decide. Se il formato cambia, SB-1 si riapre con una nuova versione e si rilanciano le misure.

**Rischi.** Più copie aumentano la costanza delle combo.

**Chiuso il 21 novembre 2026 con [D165](#decisioni-del-proprietario): formato 20/2 confermato.** Strada B ([D164](#decisioni-del-proprietario)), misura consegnata il 21 novembre 2026 ([report](reports/set-base/sb-23-report.md)). Sette starter della bozza di D162, 20/2 contro 25/3, 403.200 partite per formato. A 20/2: ricerche fallite 17,6% (soglia 25%), finali in last resort 9,9% (fascia 5–15%): le soglie di D164 non scattano, verdetto del report «si conferma 20/2». 25/3 abbassa last resort e ricerche ma non passa i criteri D161 sulle coppie (4 fuori dal 35–65%, specchio di Beppe 16,1% di patte). Decide la regia.

### SB-24 — Flavour finale e congelamento

**Perimetro.** Nomi e testi definitivi di tutte le carte, in linea con il tono del gioco, conservando quanto piace del flavour attuale. Una carta che non si lega al personaggio può cambiare
effetto; in quel caso, ultimo controllo di SB-7. Rarità definitive. **Congelamento della bozza.**

**Completamento verificabile.** Approvazione del proprietario. Nessuna carta con nome provvisorio. Misure finali sulla versione congelata. Per [D166](#decisioni-del-proprietario) le misure finali sono quelle di SB-23: la Fase B non cambia valori e lo dimostra coi test e con `controlla-numeri.py`.

**In ingresso ([D144](#decisioni-del-proprietario)).** La revisione del proprietario di nomi, flavour e illustrazioni sulla pagina di SB-20a (rigenerata allora) e la rarità P dei personaggi (D137, regolamento 1.14) si fanno qui. Le battute tolte dai testi stampati in SB-20c (per esempio «Tutto è droga», «alito marcio») possono tornare come flavour.

**Rischi.** Ritocchi che riaprono il bilanciamento: ogni variazione di numeri torna a SB-21.

**Fase A consegnata il 21 novembre 2026.** [Proposta](design/set-base/sb-24-proposta.md) con tono, nomi provvisori e proposti, rarità P (42 C / 56 NC / 19 R / 7 P), piano del congelamento e domande 1–5. Nomi, flavour, illustrazioni e rarità di tutte le 125 voci in [proposta.json](design/set-base/sb-24/proposta.json); la [pagina di revisione](design/set-base/sb-24/revisione.html), generata da [genera-revisione.py](design/set-base/sb-24/genera-revisione.py), salva il lavoro del proprietario in `design/set-base/sb-24/revisione-proprietario.json`, nel repository, per rivedere a rate da qualunque PC. Nessun dato del gioco cambia.

**Revisione del proprietario, 22 novembre 2026 ([D166](#decisioni-del-proprietario)).** Fatta sulla pagina: 105 nomi, 118 flavour e 23 illustrazioni diversi dalla proposta, rarità come proposte. La regia ha corretto i refusi nel file, che è la fonte della Fase B. Domande 1–5 risolte; flavour stampato sulla carta, da accorciare in SB-25 solo se non entra; bozza congelata 1.7; niente misure nuove.

**Fase B consegnata il 22 novembre 2026 ([rapporto](reports/set-base/sb-24-report.md)).** Regolamento **1.14**: R07 ammette la rarità PROTAGONIST (P), senza effetti su gioco e mazzi. Nella bozza i nomi e il flavour del proprietario e la P dei sette personaggi (42 C / 56 NC / 19 R / 7 P); i nomi nuovi negli «Annuncia», in OGG-03, nella griglia (sezione generata con nome, flavour e illustrazione delle 125 voci), nella bozza di riferimento e nelle regole del playground (1.6). Controllo nuovo `controlla-nomi.py` contro i nomi provvisori. Nessun numero cambia (prova `numeri-invariati.py`, passo 0 d'identità identico). **Impronta di congelamento: bozza 1.7, `server/src/test/resources/set-base/bozza.json`, SHA-256 `0fa0431e77b53d65bf50e8ffd71069d3611b21b73f613fd3411a2d027e564657`.** Da qui ogni numero che cambia torna a SB-21.

**Chiuso il 22 novembre 2026 ([D167](#decisioni-del-proprietario)).** Il proprietario approva; OGG-02 diventa «Bionda da 66, Calda». **Impronta di congelamento definitiva: bozza 1.7, SHA-256 `65bc46cf0b336dbc3c55546792d318e72405700ac0b45e02269c2ec14e1e01a4`.**

**Anticipato ([D136](#decisioni-del-proprietario), [D137](#decisioni-del-proprietario)), poi riportato qui da [D144](#decisioni-del-proprietario) e [D151](#decisioni-del-proprietario); resta come storia.** Il proprietario rivede nomi, flavour e illustrazioni sulla pagina di SB-20a e la rarità P dei personaggi entra prima di SB-20. Nomi e flavour scelti allora sono **provvisori**: le correzioni di SB-21 possono cambiare l'effetto di una carta o toglierla. Restano qui la conferma di nomi e flavour sulle carte finali, le rarità definitive e il congelamento.

### SB-25 — Testi delle carte per i giocatori

**Perimetro.** Passata di abbellimento su **tutti** i testi che il giocatore legge: effetti delle carte, personaggi, oggetti e token, parole chiave
(oggi «Quick Move», «Fallback Move») e stati. Via formule (`abs(T)`, `t>=30`, `×0,75`), lettere al posto delle risorse, sigle come GOOD, «autore» e
«bersaglio» da manuale, riferimenti al regolamento. Si scrive in italiano semplice e sul tono del gioco, con frasi brevi che entrano sul volto della carta.
Si parte da un **glossario** (come si chiamano risorse, tipi di danno, durate e bersagli) e da un **campione di una decina di carte, comprese le più
difficili**, approvato dal proprietario prima di scrivere le altre. I valori restano: un numero non diventa «picchia forte». Fino a questo blocco
le prove umane leggono testi provvisori.

**Completamento verificabile.** Approvazione del proprietario su campione e testo completo. Un controllo automatico rifiuta formule, sigle, lettere isolate delle
risorse e riferimenti alle regole. Rilettura carta per carta contro la scheda: stessi numeri, stesso bersaglio, stessa durata. Tutti i testi entrano sul volto o
nell'ispezione a 1366×768 e 844×390. Nessun effetto cambia.

**Rischi.** Un testo gradevole ma impreciso inganna il giocatore: per i casi sottili conta la scheda, che resta consultabile. Carte molto complesse possono non entrare: si
accorcia il testo o si semplifica la carta, tornando a SB-24. Le frasi del report del server in «Ultimo turno» sono fuori, salvo Q8.

**Anticipato ([D138](#decisioni-del-proprietario)).** SB-20c genera i testi stampati dai dati, con segnaposto per i simboli delle risorse disegnati dal client, così testo e dati non divergono durante SB-21 e la prova di SB-22. Restano qui il glossario, la passata di stile in italiano semplice, il campione approvato dal proprietario, il controllo automatico delle formule e la prova di ingombro.

**Fase A, 22 novembre 2026 ([D168](#decisioni-del-proprietario)).** Consegnata la [proposta della Fase A](design/set-base/sb-25-fase-a.md) con la [pagina di revisione](design/set-base/sb-25/revisione.html): glossario di 35 voci, campione di 13 (le 12 della proposta più il token), testi generati dalla bozza 1.7 dal prototipo [frasi.py](design/set-base/sb-25/frasi.py), che gira su tutte le 125 voci. Segnaposto dei danni `[[HIT]]`, `[[CUT]]`, `[[POISON]]`; parole chiave e stati con le parole dei segnalini del client (Vulnerabile, stato positivo/negativo, equipaggiamento, immune). Nessun file di gioco cambiato. STOP per il proprietario: correzioni sulla pagina e domande 1–4 (arrotondamento, dove si legge la regola intera delle parole chiave, nomi degli stati, campo dello slot).

**Domande e fattori, 22 novembre 2026 ([D169](#decisioni-del-proprietario)).** Le quattro proposte della Fase A valgono: arrotondamento detto una volta nella guida, regola intera delle parole chiave nelle pagine di guida stampate (promemoria nel client in SB-31), stati rinominati in italiano nella Fase B, codice dello slot in un file a parte. Il proprietario vuole i fattori come parte dei danni («subisci tre quarti dei danni che subiresti»); la regia ha aggiornato prototipo, glossario e pagina, estendendo la forma agli aumenti («una volta e mezza i [[HIT]] che infliggeresti»). La media dei testi sale da 66 a 68 caratteri, il massimo resta 165.

**Approvazione e testo completo, 22 novembre 2026 ([D170](#decisioni-del-proprietario)).** Glossario e campione approvati senza correzioni. Il proprietario chiede un testo da consultare che tolga ogni dubbio sull'effetto, l'«oracle text»: ogni carta, personaggio e token avrà un **testo completo**, generato dagli stessi dati, che prevale sul testo breve. Si legge nella pagina di revisione, nella guida stampata, nel client in SB-31 e, nel vivo, come scheda normativa del documento del set (SB-26, SB-28). La Fase B si divide in **B1** (testi) e **B2** (client e stampa), due esecutori Opus in fila.

**Fase B1, 22 novembre 2026 ([report](reports/set-base/sb-25-report.md)).** Il generatore scrive il testo breve approvato nelle 117 carte, senza codice di slot (ora in [testi/slot.json](design/set-base/testi/slot.json)), e il testo completo di carte, personaggi e token in [testi/testi-completi.json](design/set-base/testi/testi-completi.json); i 44 stati hanno il nome della carta e una descrizione col glossario; `controlla-testi.py` confronta tutto col generatore e respinge il gergo. Nessun numero cambia (prova e corsa d'identità nel report). Aperti per la regia: print-cards (rarità P già rifiutata a `dce3733`, segnaposto dei danni da disegnare nella B2, `reportlab` assente), `controlla-nomi.py` che non trova più il token, e altre tre domande.

**Revisione della B1, 22 novembre 2026 ([D171](#decisioni-del-proprietario)).** La regia ha accettato la B1: perimetro rispettato, attesi dei test cambiati solo per seguire testi, nomi degli stati e slot, test del server verdi (978) e controlli della bozza verdi rilanciati, testi completi riletti a campione. Il proprietario tiene Mescolone che toglie anche Vulnerabile (da scrivere nelle regole del playground con un test) e ha fatto installare reportlab e pypdf. print-cards e `controlla-nomi.py` si sistemano nella B2.

**Fase B2, 22 novembre 2026 ([report](reports/set-base/sb-25-report.md#fase-b2--simboli-dei-danni-nel-client-e-nel-pdf-guida-stampata-prova-dingombro-pagina-con-tutti-i-testi)).** Il client disegna i simboli dei danni nei testi delle carte (`DamageMark`); il PDF della bozza accetta la rarità P, disegna i danni, stampa il flavour e ha la guida con le regole complete delle parole chiave e il libretto dei testi completi (125 voci). Prova d'ingombro di testo breve più flavour sulla carta stampata e nell'ispezione a 1366×768 e 844×390: entra tutto, nessun taglio, bozza invariata (`ea5f77b6…`). `controlla-nomi.py` torna a 125 voci; Mescolone che toglie Vulnerabile è RP-29 (regole del playground 1.7) con `MescoloneD171Test`. Pronta la [pagina con tutti i testi](design/set-base/sb-25/revisione-b.html) per il proprietario; quattro domande per la regia nel report.

**Revisione della B2, 22 novembre 2026.** La regia ha accettato la B2: perimetro rispettato (commit `f6c3a78`, nessun file delle carriere), bozza invariata, verifiche rilanciate verdi (controlli della bozza, `numeri-invariati.py`, `test_generator.py`, `verify.py`, `check-rules.py`, test del server). Le regole delle parole chiave nella guida stampata sono state confrontate col regolamento (R05, R06) e con RP-1, RP-2, RP-4, RP-6, RP-13…RP-20: dicono lo stesso. RP-29 è fissata da un test che prova anche l'ordine (gettoni tolti prima dei 20 POISON del timer). Alle quattro domande dell'esecutore: (1) segnalini e lista degli stati del client che mostrano i segnaposto dei danni come testo, e (2) il testo inglese del token nel client, vanno in [SB-31](#sb-31--adeguamento-del-client); prima della B1 quei testi erano comunque in inglese da scheda; (3) la riga di `tools/print-cards/` in [aree-protette.md](aree-protette.md) resta; (4) il PDF vivo in `output/pdf/` (timbro del regolamento 1.13 invece di 1.14, nessuna carta diversa) si rigenera in [SB-28](#sb-28--trasferimento-nella-partita-viva), quando il catalogo vivo cambia comunque. Nel testo, alla dimensione delle lettere, il simbolo del veleno (`[[POISON]]`) e quello della tossicità (`[[T]]`) erano due gocce verdi quasi uguali.

**Simbolo del veleno, 22 novembre 2026 ([D172](#decisioni-del-proprietario)).** Il proprietario vuole un simbolo diverso per il danno da veleno e sceglie, fra le [quattro proposte](design/set-base/sb-25/veleno-proposta.html) della regia, il teschio davanti al matraccio (A). Vale ovunque compaia il danno POISON, partita viva compresa; lo disegna un esecutore nel client e nella stampa, poi la pagina della B2 si rigenera e il proprietario la rivede. **Consegnato** ([report](reports/set-base/sb-25-report.md#simbolo-del-veleno-d172)): teschio verde scuro davanti al matraccio verde chiaro nel client (testi, distintivo, tavolo, impatto), nella stampa viva e della bozza, nella pagina `revisione-b.html` rigenerata; nessuna regola, dato di carta o numero cambiato.

**Revisione del simbolo, 23 novembre 2026.** La regia ha accettato il simbolo: perimetro rispettato (commit `19afa2d`, nessun file delle carriere), bozza invariata (`ea5f77b6…`), `output/pdf/` intatto; rilanciati verdi i test del client (369), `test_generator.py`, `verify.py` e `controlla-testi.py`. Il teschio si distingue dalla goccia della tossicità anche nel testo e nella guida stampata; gli attesi dei test cambiati citano D172. Il matraccio è un po' più piccolo e più sottile della proposta A, per leggerlo a 12 px: accettato. Alle due domande dell'esecutore: il rosso di `VerifyResolution` a 1366×768 nel giro completo, rosso anche sulla base, diventa la voce R7 del [registro dei rossi noti](reports/rossi-noti.md); la voce R2 annota che su questa macchina `VerifyLayout` è rossa anche da sola sulla base.

**Verbi dei danni, 23 novembre 2026 ([D173](#decisioni-del-proprietario)).** Il proprietario vuole che ogni danno, nei testi che vede il giocatore, abbia il suo verbo («infliggi», «subisci»), per riusare la stessa forma nelle meccaniche future; il testo completo, che è il testo di riferimento della carta, non va complicato. Lo fa un esecutore nel generatore dei testi, prima della revisione del proprietario sulla pagina della B2. **Consegnato** ([report](reports/set-base/sb-25-report.md#verbi-dei-danni-d173)): 46 testi brevi su 125 e 46 frasi dei completi (la nota dei danni fissi) avevano un danno senza verbo, ora nessuno; il completo cambia solo per il verbo; il controllo dei testi respinge un danno senza verbo; ingombro stampato e nel client invariato, pagina di revisione rigenerata, nessun numero cambiato (`a8930ede…`). Due domande per la regia nel report.

**Revisione dei verbi, 23 novembre 2026.** La regia ha accettato il blocco (commit `ad14919`, nessun file delle carriere): rilanciati verdi `controlla-testi.py`, `numeri-invariati.py` e `controlla-numeri.py`, impronta `a8930ede…` ricalcolata; nella bozza cambiano solo 46 testi brevi. Alle due domande dell'esecutore: (1) i quattro attesi di `SetBaseDraftTest.java` e `bozza-di-riferimento.md`, rigenerato col suo strumento, sono conseguenze dirette di D173 e restano, gli attesi citano D173; (2) «Rincara N» e «crescono di N» restano senza verbo: sono la parola chiave dell'aumento per giocata, non una quantità di danno col suo simbolo, e la regola del proprietario chiede di non complicare il testo completo.

**Chiusura, 23 novembre 2026 ([D174](#decisioni-del-proprietario)).** Il proprietario ha rivisto la pagina della B2 senza correzioni: «non ho correzioni, chiudiamo SB-25». SB-25 è chiuso; la bozza 1.7 resta congelata coi testi, impronta SHA-256 `a8930edeb822028918d8fcd4c78fce2e4ffda007b2edca883ff48528290b527d`. Rilanciati verdi dalla regia `controlla-testi.py`, `controlla-nomi.py`, `controlla-numeri.py` e `check-rules.py`.

### SB-26 — Generazione del catalogo dal set

**Perimetro.** Dal file del set si generano testi per i giocatori, righe SQLite, allegato e documento normativo, secondo la **fonte unica**. La scheda normativa di ogni carta è il suo testo completo di SB-25 ([D170](#decisioni-del-proprietario)). `check-rules.py` non impone più che
la descrizione coincida con la scheda: controlla scheda e testo come due campi distinti, e riconosce anche i costi in HEALTH (D27). Formato espandibile verificato sulla mini-espansione. Si stabilisce
che i dati restino la forma definitiva anche in produzione.

**Completamento verificabile.** Generazione ripetibile a parità di output. `check-rules.py` adeguato. Nessuna carta viva ancora cambiata.

**Proposta, 23 novembre 2026 ([D175](#decisioni-del-proprietario)).** [Proposta](design/set-base/sb-26-proposta.md) approvata: catalogo 1.0 candidato generato dalla bozza in una cartella di prova, dati come forma definitiva, una scheda per carta col testo completo. Una fase, esecutore.

**Rischi.** Forme descrittive di R07a (ruolo, guadagni, danno) da generare correttamente per ogni carta.

**Consegna, 23 novembre 2026 ([report](reports/set-base/sb-26-report.md)).** `tools/set-catalog/set_catalog.py` genera dalla bozza 1.7 e dai testi di SB-25, sempre negli stessi byte, il [documento del Set Base 1.0 candidato](../server/src/test/resources/set-base/catalogo/sets/base.md) (una scheda per carta col testo completo, R07a), l'allegato, il `cards.sqlite` con testo completo e flavour e la copia per il client, in `server/src/test/resources/set-base/catalogo/`. `check-rules.py` controlla scheda e testo breve come campi distinti, accetta i costi in HEALTH e con `--candidate` controlla il catalogo candidato, anche con più set; la partita viva resta verde con le stesse regole. Prova dell'espansione con la mini di SB-6b in `reports/set-base/sb-26/espansione/`. STOP: lettura del documento candidato da parte del proprietario; quattro domande per la regia.

**Revisione della regia, 23 novembre 2026.** Consegna accettata: perimetro rispettato (commit `d1b4816`), norma viva, `server/src/main` e bozza invariati (`a8930ede…`). Rilanciati verdi `check-rules.py` (vivo, invariato nel significato: il controllo del testo è solo diviso in due), `check-rules.py --candidate` sul candidato e sull'espansione, `set_catalog.py --check`, `prova-errori.py` (quattro fallimenti attesi) e i test del server (979, 0 falliti; client di debug 37 su 37). Una correzione della regia: i due `cards.sqlite` generati non erano nel commit, perché `.gitignore` esclude i `*.sqlite`; aggiunte le eccezioni e i due file, altrimenti `--candidate` fallisce sull'altra macchina. Alle domande dell'esecutore: (1) sì, i rimandi «regole del playground, RP-n» cambiano in SB-28 nella tabella `RIMANDI` e si rigenera tutto, i testi non si toccano adesso; (2) nomi e categoria degli starter entrano nel file del set in SB-28, quando diventa vivo; (3) i mazzi di prova escono dal file vivo in SB-28 e restano nelle risorse di test; (4) `CRD002_KEYWORDS` si rinnova con SB-31 (promemoria del client), le immagini con SB-32. STOP per la lettura del proprietario.

**Chiusura, 23 novembre 2026 ([D176](#decisioni-del-proprietario)).** Il proprietario ha letto il documento candidato: «Va bene, chiudi». SB-26 è chiuso.

### SB-27 — Carte d'effetto speciale in forma definitiva

**Perimetro.** Classi Java definitive per le carte che non sono dati, senza parametri di comodo. Test d'effetto di **tutte** le carte, secondo la scheda.

**Completamento verificabile.** Ogni carta ha test che provano la sua scheda; la copertura è dichiarata per casi. Il runner riproduce con la forma definitiva le misure del congelamento.

**Rischi.** Differenze fra bozza e forma definitiva: emergono dal confronto a parità di seme.

**Proposta, 23 novembre 2026 ([D177](#decisioni-del-proprietario)).** [Proposta](design/set-base/sb-27-proposta.md) approvata: numeri nel file del set, logica nella classe, classi condivise col vivo pulite in SB-28, suite contro la scheda. Fase A (19 carte Java) e Fase B (carte a dati) a due esecutori in fila.

**Fase A eseguita, 23 novembre 2026, in attesa di revisione.** [Report](reports/set-base/sb-27-report.md): le 11 classi del set nuovo tengono solo la logica e prendono ogni numero dal file del set; «Ultimo Giro» e «Ce l'Hai Due Spicci?» diventano classi a sé; il file del set perde i due parametri spenti a 0 (impronta `325926e3…`), numeri e testi invariati; le 19 carte hanno test dalla scheda (`Sb27SpecialCardsTest`, 70 casi), le bozze storiche si leggono nei test con l'adattatore `BozzeStoriche`; corsa d'identità uguale salvo l'impronta della bozza nell'intestazione della matrice. Lista di pulizia delle otto classi condivise per SB-28 nel report.

**Revisione della regia della Fase A, 23 novembre 2026.** Consegna accettata (commit `16f8f24`). Perimetro rispettato, con le due deviazioni autorizzate dal proprietario nei due STOP (`testi_stampati.py`, «Sì, autorizzalo»; i 14 test vecchi con l'adattatore `BozzeStoriche`, solo nei test). Le tre condizioni della deroga reggono: nessun file di `server/src/main` fuori da `model/cards/base`, il `git grep` non stampa nulla, `cards.sqlite` invariato. Rilanciati verdi `check-rules.py` e `--candidate`, `set_catalog.py --check`, `controlla-nomi.py`, `controlla-numeri.py`, `controlla-testi.py`, `sb-27/numeri-invariati.py` (impronta `325926e3…`) e i test del server (1050, 0 falliti, 23 saltati; client di debug 37 su 37). Lette le classi di «Alla Goccia», «Ultimo Giro» e «Ce l'Hai Due Spicci?» e l'adattatore: fanno quanto dice il report. Alle domande dell'esecutore: (1) sì, vale come identità: la matrice differisce solo per l'impronta della bozza nell'intestazione, che cambia per la correzione del proprietario, e ogni risultato di partita è uguale byte per byte; (2) sì, `perAlcohol` 1 per «Alla Goccia» nelle bozze storiche è la stessa regola del proprietario (il numero che la classe di allora usava quando la bozza lo taceva); (3) il costo `{"ALERTNESS": 0}` di «Ce l'Hai Due Spicci?» si toglie in SB-28, quando il file del set diventa vivo: oggi cambierebbe di nuovo l'impronta senza cambiare la carta. Aggiunto alla lista per SB-28: `testi_stampati.py` tiene `perAlcohol` facoltativo per «Alla Goccia», mentre la classe lo rende obbligatorio; si allinea in SB-28. Prossimo: la Fase B.

**Fase B consegnata il 23 novembre 2026, STOP per la revisione della regia.** [Rapporto e inventario](reports/set-base/sb-27-report.md#fase-b). D178 e D179 hanno corretto i testi completi di Annuncia. D180 ha corretto RP-15 e la scelta del gettone nel motore del playground. Identità SB-23 20/2 e identità viva (dopo l’instradamento della fixture con BozzeStoriche) confermate byte per byte. La tabella rende conto delle 125 voci e delle prove comuni. La regia ha rinviato a SB-28 il nome selezionabile di Bottiglia Spaccata (D168 (4)), con diagnostico conservato per trasformarlo in un test ordinario. Bozza invariata, SHA-256 `325926e3…`.

**Revisione della regia della Fase B, 23 novembre 2026.** Consegna accettata (ultimo commit `80db3be`). Tutte le 125 voci hanno casi con attesi letterali dalla scheda (436 casi nuovi più i 70 della Fase A); campione letto, nessun atteso ricavato dai parametri. Le tre differenze emerse sono decise dal proprietario: D178 e D179 (frase della carta mostrata nei 12 testi completi di Annuncia), D180 (scelta del gettone nel motore del playground, unica modifica a `server/src/main`, autorizzata). Le misure lunghe che leggono bozze storiche passano dall'adattatore `BozzeStoriche` (buco della Fase A, sfuggito anche alla revisione della regia); identità SB-23 20/2 e identità viva uguali byte per byte prima e dopo D180. Il nome del token resta in inglese sul server fino a SB-28 (D168 (4)). Rilanciati verdi: test del server (1486, 0 falliti, 23 saltati; client di debug 37 su 37), `check-rules.py` e `--candidate`, `set_catalog.py --check`, `controlla-testi.py`; bozza `325926e3…`. SB-27 pronto per la chiusura del proprietario.

**Chiusura, 23 novembre 2026 ([D181](#decisioni-del-proprietario)).** Il proprietario: «Sì, chiudi». SB-27 chiuso.

### SB-28 — Trasferimento nella partita viva

**Perimetro.** Pubblicazione del documento del set, nuova versione del regolamento, catalogo, starter, test, copia del debug, stampa carte. Le carte superate escono; Junkie passa da starter base ad avanzato.
Le nuove carte diventano quelle delle partite normali.

**Completamento verificabile.** Tutte le verifiche verdi, compresa `TestServerContext`. Partite reali con tutti e cinque gli starter e con i due personaggi da booster, anche via CLI. Il rapporto del runner coincide
con quello del congelamento.

**Rischi.** La quick presume due personaggi: dopo SB-28 assegna a caso uno dei cinque starter (D182). Partite archiviate: restano leggibili con le versioni registrate.

**Proposta, 23 novembre 2026.** [Proposta](design/set-base/sb-28-proposta.md) della regia: Fase A la norma (regolamento 2.0 con le regole del playground, documento del set 1.0 coi rimandi al regolamento), STOP per la lettura del proprietario; Fase B il passaggio in un solo commit (file del set in produzione, catalogo vivo generato, carte dello 0.1 fuori, otto classi condivise pulite, identità del giro 20/2); Fase C partite vere via CLI e nel client. Risposte in [D182](#decisioni-del-proprietario): quick a caso fra i cinque starter, mazzi salvati con carte uscite cancellati.

**Fase A consegnata, 23 novembre 2026, in attesa della lettura del proprietario.** [Rapporto](reports/set-base/sb-28-report.md#fase-a). Il [regolamento 2.0 candidato](design/set-base/sb-28/game-rules-2.0.md) porta le regole del playground nel sistema: R00–R09 restano, entrano R02a (ricerca al posto della pesca) e R07b (parole chiave definite una volta); la [corrispondenza](design/set-base/sb-28/corrispondenza.md) dice dove va ogni RP-n, quali frasi della 1.14 cadono e il testo del formato del file del set (RP-22, RP-26, RP-28). I rimandi dei testi completi citano il regolamento (tabella `RIMANDI` del generatore), catalogo candidato rigenerato; bozza `325926e3…` e testo breve invariati, nulla di vivo cambiato. Otto dubbi di traduzione (D1–D8) e due domande nel rapporto. Prossimo: la Fase B, dopo la lettura.

### SB-29 — Quick con categorie base e avanzata

**Perimetro.** Nuova versione di R01: il giocatore **sceglie la categoria, base o avanzata, e riceve uno starter a caso al suo interno**. **La coda resta mista: una partita può opporre base e avanzato;**
il matchmaking si sistemerà in futuro. Protocollo d'ingresso, `PlayerFactoryServiceImpl` senza personaggi scritti nel codice, scelta nel client, CLI.

**Completamento verificabile.** Le due categorie assegnano solo i propri starter. Quick 1v1 con un base e un avanzato completa regolarmente. FFA verificata. `TestServerContext`, `VerifyModes` e `VerifyFfa` verdi.

**Rischi.** Tocca le modalità O18, da progettare insieme se quell'attività è già partita.

### SB-30 — Bot nelle partite contro computer

**Perimetro.** Nuova versione di R03: i bot euristici di SB-4 diventano l'avversario di `ComPlayer`, a parità di informazioni con un giocatore; il **casuale resta come livello facile**. Livelli e scelta come da decisione del proprietario.

**Completamento verificabile.** Partite reali contro computer con tutti gli starter. Il bot non vede carte nascoste. Tempo di scelta che non rallenta il turno.

**Rischi.** Un bot forte non è per forza divertente.

**Livelli decisi in [D85](#decisioni-del-proprietario)** (era Q2; [proposta](design/set-base/bot-livelli-proposta.md)). Il blocco si divide: **SB-30a**, qui, collega Facile (casuale) e Normale (bot consapevole del colpo letale) alla partita viva, con la scelta del livello e la prova «nessuna informazione nascosta»; **SB-30b**, Difficile (due turni) e Maestro, si anticipa come prototipo nel playground dopo il passo 3 di SB-16g, con budget fissato dopo la sonda di costo. **SB-30b avanzamento:** Fase A (progetto e sonda B4) approvata in [D91](#decisioni-del-proprietario); **B5a fatto** il 14 novembre 2026 ([rapporto](reports/set-base/sb-30b-b5a-report.md)): `ViewTable` nel pacchetto bot e testo stampato completato in modo additivo, quattro scarti della sonda chiusi, bot esistenti, banco e partita viva identici byte per byte, 266 s su 300 del budget B5. **B5b fatto** lo stesso giorno ([rapporto](reports/set-base/sb-30b-b5b-report.md)): `DifficilePolicy`, classe nuova, previsione su due turni dopo la restrizione invariata del Normale, quattro scenari espliciti, prova «nessuna informazione nascosta» sempre attiva per Normale e Difficile (60/60 posizioni, stesse mosse e stessi valori), costo P90 7,84 ms su 50, sei mutazioni rilevate; solo file nuovi, identità passo 0 e viva byte per byte, contesto Spring verde; controllo di buon senso Difficile–Normale 150–128 su 300 partite (54% delle decise: non ancora il gradino di D85, da tarare in B6); lettura delle carte cercate già a lista per l'«Annuncia» a due nomi di D94. Budget B5 **459,518 s su 1.800**. Da ricordare per SB-30a/SB-28: il catalogo del Difficile non è serializzabile, il collegamento vivo lo passerà da una fabbrica. Prossimo: B5c (Maestro), lanciato dal proprietario, mai insieme a una misura di bilanciamento.

### SB-31 — Adeguamento del client

**Perimetro.** Quanto serve al set: catalogo ed editor con circa 120 carte, filtri per set, rarità e personaggio, scelta di due bound fra quelle disponibili, conteggio verso 20 carte; effetti, stati e simboli di carte nuove, simboli di rarità; nell'ispezione (i) il flavour e un tasto «Testo completo» ([D168](#decisioni-del-proprietario), [D170](#decisioni-del-proprietario)); i segnalini e la lista degli stati disegnano i simboli dei danni come `EffectText` (dalla Fase B1 di SB-25 le descrizioni degli stati li contengono) e il token mostra il suo testo italiano generato, non quello della classe Java. Le osservazioni delle prove umane finiscono qui. O15 e O16 sono la cornice naturale: vedi le decisioni aperte.

**Completamento verificabile.** Verifiche di `client-web` verdi a 1366×768 e 844×390, compreso il peso. Costruire un mazzo valido con il catalogo intero è praticabile. Nessuna carta senza effetto visibile o testo leggibile.

**Rischi.** Densità del catalogo a 844×390.

### SB-32 — Illustrazioni del set

**Perimetro.** A carte **testate, bilanciate e finalizzate**, un'illustrazione per ogni carta, personaggio e token del set, così non si genera niente che poi sparisca. Si parte da una
**guida di stile** e da un **campione** di qualche personaggio e carta, approvati dal proprietario, poi lotti con revisione. Si conservano le illustrazioni attuali delle carte il cui soggetto resta
valido, se reggono accanto alle nuove. Come per O9: **generate ex novo, mai prese da Internet**, con prompt e provenienza registrati. `atlas.mjs` e `art.ts` passano a più atlanti, con i set come
raggruppamento, così un'espansione aggiunge un atlante senza toccare gli altri.

**Completamento verificabile.** Ogni classe del catalogo ha il suo riquadro, senza duplicati; nessun segnaposto nel set. `Size` verde: totale ≤ 4 MB gzip, atlante ≤ 2048 px, texture ≤ 64 MB. Illustrazioni leggibili
sul volto, nell'ispezione e nei primi piani, a 1366×768 e 844×390 e su iPhone. Partite reali senza regressioni di cadenza. Approvazione del proprietario.

**Rischi.** Servono circa 120 riquadri, cioè almeno tre atlanti: stimati in circa 1,7 MB compressi e 38 MB decodificati, da misurare. Coerenza di stile su tanti lotti. Disponibilità dello strumento di generazione, da confermare
all'avvio. Decisioni di C4 su cornici e grafica vanno rispettate. Il segnaposto resta per le espansioni in lavorazione.

### SB-33 — Consolidamento e giudizio del proprietario

**Perimetro.** Nessuna funzione nuova, salvo correzioni. Tutte le verifiche sulla stessa build, partite reali in tutte le modalità, rapporto finale, stato nell'indice, `IDEAS.md` aggiornato.

**Completamento verificabile.** Tutto verde, compreso il controllo end-to-end. **Set Base chiuso solo dopo il giudizio del proprietario.**

**Rischi.** Osservazioni che chiedono economia o matchmaking vanno registrate, non risolte qui.

## Decisioni del proprietario

Le decisioni D1–D150 del proprietario sono nel [registro delle decisioni](set-base-decisioni.md#decisioni-del-proprietario): spostate dal piano parola per parola nel consolidamento D96 (14 novembre 2026), con una colonna «Stato» (in vigore, superata o da verificare). Le citazioni «Dn» di questo piano rimandano là.

**Decisioni in vigore per tema** (solo numeri; il testo e lo stato di ciascuna sono nel [registro](set-base-decisioni.md#decisioni-del-proprietario), dove le decisioni «superate» non si seguono):

- **Bilanciamento e criteri:** D16 criteri riferiti agli starter; D33 e D36 tetto delle bound (4 unità, 3 HIT di danno); D38 delega dei numeri; D51 patte al massimo 10%; D93 criteri sui soli bot euristici; D95 soglia minima fino a SB-18, criteri completi in SB-20 e SB-21; D90 e D92 correzione 1.5; D101 bozza di riferimento 1.6b; D102 e D103 passo del client.
- **Formato e composizione:** D1 e D94 20 carte e 2 copie; D2–D5 bound, basic, last resort, nessun giocatore senza mosse; D7 sette personaggi; D60–D62 e D79 120 carte, liste da 20 e schema delle coppie.
- **Annuncia e caricamenti:** D52 ritmo caricare-colpire-parare; D63 risorse sufficienti; D64 e D66 gettone ×1,5 e cumulo; D69, D71, D72 gettone legato al nome, uscita, ripiego; D75 meccanica approvata; D78 parole chiave ragionevoli; D94 e D95 «Annuncia» a due nomi, modificatore di velocità, last resort che cresce; D97 scelta del giocatore fra i due nomi, mazzo mischiato dopo ogni ricerca, «Gioca d'anticipo», «Rincara».
- **Regole del playground:** D12 solo nel playground fino a SB-28; D48 salvataggio in extremis; D50 regole d50; D54 e D70 ricerca; D73 «Ultimo colpo». Testo unico: [regole-playground.md](design/set-base/regole-playground.md).
- **Bot:** D18 un solo bot per simulatore e partita; D76 e D77 consapevole del colpo letale; D85 quattro livelli; D91 progetto di SB-30b.
- **Budget di calcolo:** D68, D83 e D90 esauriti; D91 B5 al massimo 1.800 s e B6 al massimo 18.000 s; D95 SB-16i un giro e una correzione numerica; D98 e D99 Fase B2 al massimo 2.100 s nel residuo D97 (2.285 s).
- **Documentazione e metodo:** D11 regolamento e documenti di set; D45 funzionamenti e composizioni li approva il proprietario; D8 perimetro creativo (parole chiave riviste da D78); D96 consolidamento della documentazione.

## Decisioni ancora aperte

Con la proposta; nessuna blocca i primi blocchi.

| ID | Domanda | Proposta | Quando |
|---|---|---|---|
| Q1 | Avversari computer in quick | Stessa categoria dell'umano in 1vCom; qualunque starter nei bot aggiunti alla FFA | SB-29 |
| Q3 | Anticipare il bot sulle carte attuali | Sì, se si dimostra utile dopo SB-4. Dato di SB-4: con le carte attuali il Junkie euristico schiaccia Bruiser, da decidere prima di anticipare | Dopo SB-4 |
| Q4 | Deckbuilder O15 e O16 | Anticiparli in SB-31, perché con 120 carte l'editor attuale difficilmente basta. Da valutare insieme a O17 e O18 | Prima di SB-31 |
| Q5 | Numero massimo di giri | 3, prima di tornare dal proprietario | SB-20 |
| Q7 | Formato definitivo | 20 carte e 2 copie, confermato dopo la misura di SB-16h in [D94](#decisioni-del-proprietario) | **Risolta** in SB-23 ([D165](#decisioni-del-proprietario)) |
| Q8 | Report del server in «Ultimo turno» | Resta com'è: i fatti in italiano vengono prima, il testo inglese è secondario (D7 del piano C3). Da riconsiderare se la prova umana lo chiede | SB-25 |
| Q10 | Volto del caricamento e «×1,5» visibile nel client | Dal [consulto](reports/set-base/consulto-design-fable-2026-11-13.md) (B2-a, C4-1): timbro proprio sul volto del caricamento, gettone unico, «×1,5» sull'impatto dei colpi amplificati e indicazione quando il gettone non ha agito e perché | Dopo la prova umana del passo 1 di SB-16g |
| Q11 | Sergio e Duccio senza la coppia standard di D52(3) | Dal [consulto](reports/set-base/consulto-design-fable-2026-11-13.md) (A9, C4-3): non dare a tutti i sette personaggi lo stesso schema caricamento-colpo; Sergio può essere quello che punisce gli annunci. Richiede di rivedere D52(3) | Proposta di SB-17 (D105), poi SB-18 |
| Q12 | Prova con una persona fuori dal progetto | Dal [consulto](reports/set-base/consulto-design-fable-2026-11-13.md) (C4-2): un'ora di gioco osservata senza aiutare, poi tre domande; primo giudizio non viziato dal conoscere le regole | Prima di SB-22 ([D105](#decisioni-del-proprietario)) |

## Cosa non è in questo piano

- **Economia:** buste, sblocchi, acquisti, carte possedute (O17). Gli starter avanzati e i personaggi da booster sono disponibili a tutti: «sbloccabili» e «trovabili» sono
  etichette di progetto, da realizzare in un piano successivo.
- **Matchmaking** ed **Elo**.
- **Open PvP** e scelta libera del mazzo in ogni coda (O18), se non anticipati dal proprietario.
- **Espansioni:** si predispongono, non si progettano.
- `client-debug` riceve solo gli adeguamenti alle regole già richiesti da R00 (copia e editor).

## Idee per le espansioni

Si conservano qui le idee che escono dal perimetro del Set Base.

- Bound aggiuntive per i personaggi del Set Base.
- Da SB-9 ([schede dei personaggi](design/set-base/schede-personaggi.md#idee-fuori-perimetro-per-le-espansioni)):
  - **Più ferito, più forte:** danni che crescono con la salute persa (Duccio).
  - **Restituire il danno** all'autore, in parte (Duccio).
  - **Vedere la mano o il mazzo dell'avversario,** anche una sola carta: cambia R08 (Sergio).
  - **Scarto forzato** di una carta dell'avversario, o una sua carta bloccata (Sergio).
  - **Scommesse:** indovinare in anticipo la mossa dell'avversario (Sergio).
  - **Schivata vera:** annullare il danno ricevuto invece di ridurlo (Mara).
  - **Astinenza:** penalità se Celestina resta senza T.
  - **Riparare o costruire oggetti** dagli scarti, slot di equip (Beppe).
  - **Il giro offerto in FFA:** alcol a tutti gli avversari insieme (Piera).
- Da SB-10b ([griglia](design/set-base/griglia.md#idee-fuori-perimetro-per-le-espansioni)):
  - **Danno moltiplicato per una risorsa** (due HIT per ogni L): il formato sa solo dividere.
  - **Contromosse generiche** aperte a tutti: darebbero annullamenti a Mara.
  - **Bound di parata** valide solo contro il colpo successivo: richiedono una regola di consumo.
  - **«Tavolo ribaltato»:** distruggere tutti gli oggetti sul campo.
  - **Cassetta degli attrezzi:** un oggetto che crea un token attrezzo (Beppe).
  - **Equip permanenti,** senza durata.

## Registro degli accordi

Dove finisce ogni idea concordata, per controllo.

| Idea | Dove |
|---|---|
| 110–120 carte, ognuna con rarità | [Il set in numeri](#il-set-in-numeri), SB-10, SB-19 |
| 7 personaggi: 2 base, 3 avanzati, 2 booster | [Personaggi](#personaggi), D7 |
| Almeno tre carte legate; last resort legabili; le altre generiche | [Il set in numeri](#il-set-in-numeri), SB-10 |
| Budget stretto, generiche condivise fra starter | [Il set in numeri](#il-set-in-numeri), SB-10 |
| Risorse come colori, identità di V, T, L, A | [Letture del regolamento](#letture-del-regolamento-che-guidano-il-progetto), SB-9, SB-10 |
| L poco sfruttata; caso GoingBerserk | [Letture del regolamento](#letture-del-regolamento-che-guidano-il-progetto), SB-10, SB-14 |
| Junkie a premium; secondo base veloce in contrasto | [Personaggi](#personaggi), SB-11, SB-13 |
| Rarità: complessità e potenza, con paletto | [Rarità](#rarità), SB-10 |
| Niente cartucce sprecate; elenco per le espansioni | [Perimetro creativo](#perimetro-creativo), [Idee per le espansioni](#idee-per-le-espansioni) |
| Personaggio che usa la salute come risorsa, nel Set Base | [Personaggi](#personaggi), SB-9, SB-18, D27 |
| Bozza esterna: nomi, starter con nome, valori diversi, candidate, rischi | [Bozza esterna](#bozza-esterna-di-carte), SB-9, SB-10, SB-19, D26 |
| Immunità di Pino | D28, SB-14 |
| Non creare tutto e poi provare: strati | [Bilanciamento](#bilanciamento-metodo-e-criteri), fasi Carte e Set intero |
| Giri espliciti, anche sull'intero set | SB-12–SB-23, D21 |
| 20 carte esatte, 2 copie; 25 e 3 da valutare | [Regole dei mazzi](#regole-dei-mazzi-concordate), SB-1, SB-23 |
| Basic fissa e presa di oggetti; 2 bound scelte; last resort obbligatoria | [Regole dei mazzi](#regole-dei-mazzi-concordate), SB-1 |
| Bound gratis e deboli, tetto, ripetizione, caso PatheticBlade | [Bound](#bound-fallback-gratuito-e-debole), SB-7, SB-10 |
| Nessun giocatore senza mosse, nessun «passo» | [Nessun giocatore senza mosse](#nessun-giocatore-senza-mosse), SB-1, SB-7 |
| Scelta stretta: 3 slot regolari | [Letture del regolamento](#letture-del-regolamento-che-guidano-il-progetto), SB-10 |
| Listino di potenza | SB-10 |
| Triangolo attacco, difesa, contromossa | [Letture del regolamento](#letture-del-regolamento-che-guidano-il-progetto), SB-9 |
| Bot che sa giocare, condiviso; casuale come metro e livello facile; più stili; solo informazioni lecite | SB-4, SB-30 |
| Runner diretto, seme, CLI per il controllo, client per le persone | [Strumenti](#bilanciamento-metodo-e-criteri), SB-3, SB-8 |
| Playground in cui cambiare tutto | SB-5, SB-6a, SB-6b, D12 |
| Regole generali e documenti per set; precedenza; fonte unica | [Struttura](#struttura-per-set-ed-espansioni), SB-2, SB-26 |
| Espansioni predisposte; mini-espansione di prova | [Struttura](#struttura-per-set-ed-espansioni), SB-6b |
| 1v1 di riferimento, FFA come controllo | D13, SB-20, SB-22 |
| Matchup degli starter; strategia da scoprire più forte; nessun dominio | [Criteri](#bilanciamento-metodo-e-criteri), SB-20, SB-21 |
| Carte attuali riprogettabili, flavour conservato | [Perimetro creativo](#perimetro-creativo), SB-10, SB-24 |
| Personaggi subito, nomi delle carte alla fine, identificatori stabili | [Flavour](#flavour), SB-9, SB-24 |
| Prove umane a ogni passaggio, giudizio decisivo | SB-12, SB-16, SB-22, SB-33 |
| Quick: categoria e starter a caso, coda mista | SB-29, D19 |
| Mazzi salvati sacrificabili | SB-1, D20 |
| Economia fuori dal piano | [Cosa non è in questo piano](#cosa-non-è-in-questo-piano), D10 |
| Testi senza formule e simboli letterali, due testi per carta | [Struttura](#struttura-per-set-ed-espansioni), SB-25, D23 |
| Illustrazioni generate a carte finalizzate, con stile, campione e provenienza | SB-32, D24 |
| Inizio a client web completato; strumenti e progetto anticipati | Testa del piano, D22, D30 |

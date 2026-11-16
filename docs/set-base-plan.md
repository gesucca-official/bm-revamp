# Piano Set Base — Dal set provvisorio al primo set bilanciato

Scritto il 2 novembre 2026 col regolamento 1.10, aggiornato all'8 novembre 2026 (regolamento **1.13** e Set Base 0.1, da SB-1 e SB-2).
**Solo piano:** questo documento, come ogni roadmap (R00), non introduce regole attive; le regole cambiano solo nei blocchi che
aggiornano il regolamento. La partita viva resta quella del regolamento vigente: nulla della bozza la raggiunge prima di SB-28.

> **Ripartenza** (aggiornata il 16 novembre 2026, dopo D110). La aggiorna chi chiude un blocco e la regia a ogni decisione ([metodo](orchestrazione-lavoro.md#avvio-di-un-filone)).
>
> - **In vigore:** partita viva al regolamento **1.13** e Set Base 0.1; regole `d50` solo nel playground ([regole-playground.md](design/set-base/regole-playground.md)); formato **20 carte e 2 copie** ([D94](#decisioni-del-proprietario)); soglia minima per gli starter ([D95](#decisioni-del-proprietario)); bozza di riferimento **1.6b** in `bozza.json` (1.6 con la leva A su Mara, [D99](#decisioni-del-proprietario), adottata in [D101](#decisioni-del-proprietario); [rapporto della B2](reports/set-base/sb-16i-b2-report.md)); la 1.5 in `set-base/storico/1.5/`, la 1.6 nel commit `336e0ff`.
> - **In corso:** [SB-17](#sb-17-sb-18--personaggi-da-booster): proposta A2 di Sergio approvata in D110; Fase B2 da lanciare. In attesa: revisione di SB-17t (riserva `-Pool` = i cinque starter).
> - **Prossimo:** SB-17 Fase B2 (D110: dati di Sergio A2 in `bozza.json`, un giro e al più due di riserva, 1.000 s), e il blocco tecnico SB-17t di D109 (3), mai insieme alla misura. Quando il proprietario li lancia, due blocchi piccoli del client: la lettura di «12+x» per «L'ultimo giro» e `restOn` ([consegna 2](orchestrazione-lavoro.md#allineamento-fra-le-macchine)). B5c di SB-30b (Maestro) quando il proprietario lo lancia, mai insieme a una misura.
> - **Decisioni da leggere:** D110, D109, D108, D107, D106, D105, D104, D103, D102, D101, D99, D98, D97, D95, D94, D92 nel [registro](set-base-decisioni.md#decisioni-del-proprietario) (D1–D110).

Questo documento è lo **stato** del filone: obiettivo, regole di lavoro, criteri in vigore, blocchi aperti e futuri. La cronologia dei blocchi chiusi è nello [storico](history/set-base-plan-storico.md). Fondamenta, strumenti, progetto e i cinque starter sono chiusi e approvati.

## Obiettivo e regole comuni

**Risultato:** un Set Base di 120 carte, giocabile per intero, in cui gli starter si
equivalgono, costruire un mazzo premia chi esplora e nessuna strategia domina. Il bilanciamento
perfetto non è l'obiettivo: contano l'assenza di strategie dominanti e il peso della lettura
dell'avversario. Il set deve **esplorare a fondo le meccaniche di base**, senza consumare le idee
creative destinate alle espansioni, e la struttura deve accogliere le espansioni senza rifacimenti.

Valgono per **ogni** blocco:

- **Un blocco = una sessione = un commit**, in ordine, solo dopo l'istruzione del proprietario.
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
- **Documenti nello stesso commit:** una sezione «SB-n» in `docs/reports/set-base-report.md`
  (creato in SB-1), evidenze in `docs/reports/set-base/sb-n/`, stato in questo piano e nell'indice.
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
| | SB-17 | Sergio Sommerso: bozza e giro | SB-16i | Fase B consegnata ([rapporto](reports/set-base/sb-17-report.md)): Sergio sotto D95 contro 4 starter ([D109](#decisioni-del-proprietario)); Fase A2 approvata ([proposta](design/set-base/sb-17-proposta-a2.md), [D110](#decisioni-del-proprietario)); Fase B2 da lanciare |
| | SB-18 | Duccio Braccio Teso: bozza e giro | SB-17 |  |
| | SB-19 | Resto del pool e giro di blocco | SB-18 |  |
| Set intero | SB-20 | Prima misura dell'intero set | SB-19 |  |
| | SB-21 | Giri di correzione | SB-20 |  |
| | SB-22 | Prova umana con mazzi costruiti | SB-21 |  |
| | SB-23 | Valutazione delle varianti del formato | SB-21 |  |
| Congelamento | SB-24 | Flavour finale e congelamento | SB-22, SB-23 |  |
| | SB-25 | Testi delle carte per i giocatori | SB-24 |  |
| | SB-26 | Generazione del catalogo dal set | SB-25 |  |
| | SB-27 | Carte d'effetto speciale in forma definitiva | SB-26 |  |
| | SB-28 | Trasferimento nella partita viva | SB-26, SB-27 |  |
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

**Rivisto dalla regia il 16 novembre 2026.** Nessun file fuori dal perimetro (D102 compreso), nessun atteso cambiato, solo test nuovi; impronte dell'identità viva uguali a quelle della Fase B; D102 conforme alla trascrizione dell'esecutore. Con le regole vive il percorso del clic su ✓ non cambia; il rosso viene da `restOn` (`client-web/tools/verify-resolution.mjs`), che non controlla un riquadro nullo nella corsa voluta col clic. Fuori dal blocco: per «L'ultimo giro» di Piera «Ultimo turno» legge «12+x» come metà della V residua, mentre la carta somma la L residua; è un difetto preesistente del client, da correggere in un suo blocco.

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

**Blocco tecnico SB-17t (D109 (3)) eseguito il 16 novembre 2026, da rivedere.** Senza `-Pool` la riserva del profilo bozza sono i mazzi con id `starter-*` (i cinque); `prova-sergio` resta scelto in «Con un tuo mazzo», con `-Com` e con `-Pool` esplicito; la bozza di riferimento lo chiama «mazzo di prova».

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

**Completamento verificabile.** Griglia completa: totale fra 110 e 120, ogni carta con rarità. Gli starter non peggiorano.

**Rischi.** Il pool può arrivare stanco: le generiche devono restare interessanti, non riempitivi.

**In ingresso ([D110](#decisioni-del-proprietario)).** La [ricerca di diagnosi di SB-17](reports/set-base/sb-17/a2-search/search.md): coi mazzi costruiti ogni personaggio batte gli starter al 77–99,5%. Ricorrono Estasi da Coca Etilene (PIN-AR2, un colpo da 18 senza costo per chi non ha L, in tutti i mazzi vincenti di chi non è Piera), Sgommata e gli oggetti. Da guardare qui e in SB-20, insieme alle carte d'archetipo giocate fuori dal loro personaggio; parte del dato può venire dai bot.

### SB-20 — Prima misura dell'intero set

**Perimetro.** Fotografia, senza correzioni: **matrice completa** degli starter, **ricerca automatica** dei mazzi più forti per personaggio, **analisi delle carte** dominanti o inutilizzate,
controllo FFA.

**Completamento verificabile.** Rapporto completo e riproducibile. Elenco dei problemi in ordine di gravità, proposto al proprietario insieme al numero massimo di giri.

**Rischi.** Molti problemi insieme: si parte da quelli che spostano più matchup.

### SB-21 — Giri di correzione

**Perimetro.** Ripetibile. Un giro per sessione. Si corregge secondo l'[ordine concordato](#bilanciamento-metodo-e-criteri), si rilancia matrice e ricerca e si registra cosa è cambiato. Da [D95](#decisioni-del-proprietario) qui si ricontrollano anche gli starter fra loro, per la partita rapida, coi criteri completi.
Massimo proposto: 3 giri prima di tornare dal proprietario.

**Completamento verificabile.** Criteri di arrivo raggiunti o scostamenti residui dichiarati e sottoposti al proprietario.

**Rischi.** Inseguire il perfetto: una strategia un po' più forte è ammessa. Correzioni che rompono gli starter stabili: la matrice lo mostra.

### SB-22 — Prova umana con mazzi costruiti

**Perimetro.** Partite umane con mazzi costruiti, compresi quelli trovati dalla ricerca, e qualche FFA. Eventuali correzioni tornano a SB-21.

**Completamento verificabile.** **Giudizio del proprietario** registrato: è il criterio decisivo.

**Rischi.** Pochi giocatori: il giudizio resta soggettivo, ed è dichiarato come tale.

### SB-23 — Valutazione delle varianti del formato

**Perimetro.** Si confrontano **20 carte e 2 copie con 25 carte e 3 copie**, e si misura l'effetto della dimensione sul ritmo e sulla costanza dei mazzi. La prima misura è anticipata in [SB-16h](#sb-16h--prova-esplorativa-della-dimensione-del-mazzo) (D81); qui resta la conferma sul set intero e coi mazzi costruiti.

**Completamento verificabile.** Dati presentati al proprietario, che decide. Se il formato cambia, SB-1 si riapre con una nuova versione e si rilanciano le misure.

**Rischi.** Più copie aumentano la costanza delle combo.

### SB-24 — Flavour finale e congelamento

**Perimetro.** Nomi e testi definitivi di tutte le carte, in linea con il tono del gioco, conservando quanto piace del flavour attuale. Una carta che non si lega al personaggio può cambiare
effetto; in quel caso, ultimo controllo di SB-7. Rarità definitive. **Congelamento della bozza.**

**Completamento verificabile.** Approvazione del proprietario. Nessuna carta con nome provvisorio. Misure finali sulla versione congelata.

**Rischi.** Ritocchi che riaprono il bilanciamento: ogni variazione di numeri torna a SB-21.

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

### SB-26 — Generazione del catalogo dal set

**Perimetro.** Dal file del set si generano testi per i giocatori, righe SQLite, allegato e documento normativo, secondo la **fonte unica**. `check-rules.py` non impone più che
la descrizione coincida con la scheda: controlla scheda e testo come due campi distinti, e riconosce anche i costi in HEALTH (D27). Formato espandibile verificato sulla mini-espansione. Si stabilisce
che i dati restino la forma definitiva anche in produzione.

**Completamento verificabile.** Generazione ripetibile a parità di output. `check-rules.py` adeguato. Nessuna carta viva ancora cambiata.

**Rischi.** Forme descrittive di R07a (ruolo, guadagni, danno) da generare correttamente per ogni carta.

### SB-27 — Carte d'effetto speciale in forma definitiva

**Perimetro.** Classi Java definitive per le carte che non sono dati, senza parametri di comodo. Test d'effetto di **tutte** le carte, secondo la scheda.

**Completamento verificabile.** Ogni carta ha test che provano la sua scheda; la copertura è dichiarata per casi. Il runner riproduce con la forma definitiva le misure del congelamento.

**Rischi.** Differenze fra bozza e forma definitiva: emergono dal confronto a parità di seme.

### SB-28 — Trasferimento nella partita viva

**Perimetro.** Pubblicazione del documento del set, nuova versione del regolamento, catalogo, starter, test, copia del debug, stampa carte. Le carte superate escono; Junkie passa da starter base ad avanzato.
Le nuove carte diventano quelle delle partite normali.

**Completamento verificabile.** Tutte le verifiche verdi, compresa `TestServerContext`. Partite reali con tutti e cinque gli starter e con i due personaggi da booster, anche via CLI. Il rapporto del runner coincide
con quello del congelamento.

**Rischi.** La quick presume due personaggi: fino a SB-29 assegna solo quelli previsti, dichiarandolo. Partite archiviate: restano leggibili con le versioni registrate.

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

**Perimetro.** Quanto serve al set: catalogo ed editor con circa 120 carte, filtri per set, rarità e personaggio, scelta di due bound fra quelle disponibili, conteggio verso 20 carte; effetti, stati e simboli di carte nuove, simboli di rarità. Le osservazioni delle prove umane finiscono qui. O15 e O16 sono la cornice naturale: vedi le decisioni aperte.

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

Le decisioni D1–D110 del proprietario sono nel [registro delle decisioni](set-base-decisioni.md#decisioni-del-proprietario): spostate dal piano parola per parola nel consolidamento D96 (14 novembre 2026), con una colonna «Stato» (in vigore, superata o da verificare). Le citazioni «Dn» di questo piano rimandano là.

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
| Q7 | Formato definitivo | 20 carte e 2 copie, confermato dopo la misura di SB-16h in [D94](#decisioni-del-proprietario) | Conferma finale in SB-23 |
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

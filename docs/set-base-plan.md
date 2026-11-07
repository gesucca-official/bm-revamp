# Piano Set Base — Dal set provvisorio al primo set bilanciato

2 novembre 2026. Regolamento **1.10**. **Solo piano:** nessuna modifica a regole, carte,
server, catalogo o client. La partita viva resta quella del regolamento vigente; questo
documento, come ogni roadmap (R00), non introduce regole attive. Il lavoro procede su istruzione del
proprietario, **un blocco alla volta**. Gli strumenti e i blocchi che non toccano il client partono subito,
nell'ordine SB-9 → SB-6a → SB-7 → SB-7b → SB-10a → SB-10b → SB-11a → SB-11b → SB-12a ([D30, D31, D32, D37, D40](#decisioni-del-proprietario)); SB-1 è
anticipato in parallelo a C4 ([D40](#decisioni-del-proprietario)); SB-2 e SB-6b restano legati al completamento del client web ([C3-7, C4 e C5](client-roadmap.md)) e vanno chiusi prima di SB-8. Stato corrente
nell'[indice della documentazione](README.md#stato-corrente).

Fonti lette: [istruzioni](../AGENTS.md), [indice](README.md), [regolamento](game-rules.md),
[allegato](rules-catalog.json), [appunti sul set](../IDEAS.md), [CLI](cli.md),
[piano C3](client-c3-plan.md) come modello, [roadmap del client](client-roadmap.md) (O9,
O15–O18), [bozza esterna di carte](design/set-base/bozza-esterna-proposta-70-carte.md), `cards.sqlite`, `scripts/check-rules.py`, `tools/print-cards/` e, nel server,
`Game`, `Player`, `ComPlayer`, `AbstractCard`, alcune carte, le factory, `MatchVersions` e la
validazione dei mazzi. Non sono state lette tutte le carte e non è stata giocata nessuna
partita per questo piano: ciò che è dedotto e non provato è indicato come tale.

## Obiettivo e regole comuni

**Risultato:** un Set Base di circa 115 carte, giocabile per intero, in cui gli starter si
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
- **Verifiche:** `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`
  sempre; `./scripts/build.ps1 -Task TestServerContext -Offline` quando il blocco tocca il contesto
  Spring o i percorsi CLI (test unitari verdi non provano l'avvio); le verifiche di `client-web`
  quando il blocco tocca il client. Vale il [metodo del piano C3](client-c3-plan.md#obiettivo-e-regole-comuni)
  (partite reali, database temporaneo, 1366×768 e 844×390).
- **Numeri riproducibili:** ogni misura dichiara seme, numero di partite, bot e versione della
  bozza. Un risultato senza questi dati non motiva una modifica.
- **Documenti nello stesso commit:** una sezione «SB-n» in `docs/reports/set-base-report.md`
  (creato in SB-1), evidenze in `docs/reports/set-base/sb-n/`, stato in questo piano e nell'indice.
- Testi nuovi in italiano; identificatori stabili e nomi visualizzati restano separati.

## Cosa c'è oggi

Verificato nei sorgenti il 2 novembre 2026.

| Ambito | Stato | Conseguenza per il piano |
|---|---|---|
| Set | 39 carte: 2 personaggi, 2 basic, 4 bound, 1 last resort, 26 azioni regolari, 4 oggetti; più 1 token. `SoberUp` è fuori catalogo | Ne servono **fino a 76 nuove** |
| Carte | Una classe Java per carta con i valori scritti nel costruttore e negli effetti, per esempio `SuperImpact` (25 V, 40 HIT). `CardFactoryServiceImpl` le carica con `Class.forName` | Cambiare un numero richiede una ricompilazione: serve il playground (SB-5, SB-6) |
| Catalogo | `cards.sqlite`: `CRD001_GUI`, `CRD002_KEYWORDS`, `CRD003_CHARACTERS`, `DCK001_STARTERS`, `DCK002_STARTERS_CH` con due colonne bound. Nessun campo set o rarità | Da estendere (SB-2, SB-28) |
| Regole ↔ carte | R07 e R07a elencano ogni carta; R04 e R05 citano carte specifiche (Grab, Steal, SeagullFly, MadeOfStone…). `check-rules.py` legge le tabelle di R07; `rules-v1-cards.tsv` è il contratto dei test; `MatchVersions` legge la versione delle regole | La separazione regole/set deve adeguare tutto questo (SB-2) |
| Mazzi | Il server chiede solo regolare non vuoto e massimo sei carte iniziali (`UserAccountServiceImpl`); `client-web/src/deck.ts` ammette fino a 5 bound, senza limiti di copie | Da sostituire (SB-1) |
| Mazzi sintetici | `verify-decks.mjs` (4 Glare), `cli-open-complete-test.cjs`, `cli-restart-test.cjs` (una carta), `cli-security-test.cjs` (12 SuperImpact) e le verifiche che si basano sulla D8 del piano C3 violano le nuove regole | Vanno riscritti in SB-1, senza indebolire ciò che provano |
| Quick | `PlayerFactoryServiceImpl.randomPlayer` sceglie fra due personaggi scritti nel codice | Da riscrivere (SB-29) |
| Bot | `ComPlayer` è casuale: mescola la mano e gioca la prima mossa valida per `isValidFor`. Riceve l'intero `Game` | Vista limitata a R08 e stili fatti in SB-4, non usati dal server fino a SB-30 |
| Motore | Nessun import di Spring sotto `model`; i test creano `new Game(players, mode, false)` (`GameFixtures`). Le factory invece sono servizi Spring | Runner diretto **provato** in SB-3, con un caricatore proprio |
| Casualità | `Collections.shuffle` senza seme in `Player`, `ComPlayer`, `BeggingMoney`; `Math.random` in `PlayerFactoryServiceImpl` | Fonte con seme fatta in SB-3; resta `Math.random` in `PlayerFactoryServiceImpl`, da riscrivere in SB-29 |
| CLI | [`bm-cli.cjs`](cli.md) passa sempre da server, login, REST, SockJS/STOMP e archivio. Le modalità non permettono di scegliere il matchup, e l'open si gioca solo contro il bot casuale | Adatta alle prove end-to-end, non alle simulazioni di massa |
| Testi delle carte | La descrizione in SQLite è il testo normativo di R07 più «Riferimento: Regolamento 1.10, R02-R07», e `check-rules.py` impone che coincidano. Il giocatore legge quindi `abs(T)`, «15 HIT: solo GOOD dell'autore», lettere al posto delle risorse. Le parole chiave in `CRD002_KEYWORDS` sono in inglese | Testo normativo e testo per i giocatori vanno separati (SB-25) |
| Illustrazioni | 40 provvisorie generate ex novo (O9), con prompt e provenienza registrati e sorgenti fuori da git. Atlante unico 8×6 da 256 px, cioè 48 riquadri; `atlas.mjs` costruisce dall'allegato e si ferma se le sorgenti non coincidono. Un nome sconosciuto usa il segnaposto | Le carte nuove compaiono col segnaposto fino a SB-32; un atlante non basta |

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

Intervallo ammesso 110–120 carte, obiettivo 115. Ogni carta ha una rarità.

| Blocco | Carte | Note |
|---|---:|---|
| Personaggi | 7 | 2 base, 3 avanzati (premium), 2 da booster |
| Basic | 7 | Una per personaggio |
| Bound | 21 | Almeno 3 per personaggio; se ne scelgono 2 |
| Last resort | 4 | Struggle generica più 3 legate a un personaggio, dove flavour e meccanica si sposano |
| Azioni d'archetipo | 37 | 5 per personaggio, 6 per Cesira e Rocco ([D34](#decisioni-del-proprietario)): si sposano con la strategia senza esservi vincolate |
| Azioni generiche | 23 | Giocabili da tutti; compaiono in più starter (erano 25, D34) |
| Oggetti | 16 | I token non contano, come oggi |
| **Totale** | **115** | |

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

| Slot | Personaggio | Stile di gioco | Rischio |
|---|---|---|---|
| Base | **Spazienzio** (esiste) | Accumula V e tira colpi enormi | Lento, pochi oggetti |
| Base | **Mara Contromano** | Rider: A, priorità alta, tanti piccoli CUT, consuma gli oggetti prima che glieli tolgano | Poca salute; pagare A le toglie la precedenza |
| Avanzato | **Tossico del Serraglio** (esiste; lascia gli starter base) | T come carburante e veleno | Gestione complessa delle immunità |
| Avanzato | **Pino l'Ultimo Giro** | Frequentatore del bancone: L da spendere, bottiglie, equip | Basso A; senza immunità a L ([D28](#decisioni-del-proprietario)) perde A a ogni fine turno |
| Avanzato | **Gigi del Carro Attrezzi** | Meccanico: tanti oggetti ed equip, ruba e smonta quelli altrui, costruisce V con piccoli colpi | Debole se il tavolo è vuoto; distruzione da tenere a bada |
| Booster | **Cesira la Malalingua** (provvisorio) | La portinaia che sa tutto: contromosse e letture dell'avversario, pagate in A | Se legge male, spreca il turno |
| Booster | **Rocco «Sant'Incasso»** (provvisorio) | Ex pugile delle sagre. **Usa la salute come risorsa:** paga le mosse con la propria HEALTH, più riduzioni del danno e contrattacchi | Muore se esagera; lento a chiudere la partita se si limita a incassare |

Gli starter base devono mostrare le meccaniche di base con contrasto: Spazienzio con V e HIT, Mara con A e CUT.
Il Tossico passa agli avanzati perché immunità, BadTrip, ToxicBloodDrain e LethalHeroinDose non insegnano le basi.

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

### Rarità

Riflette **complessità e potenza insieme**. Paletto: una rara può avere un picco più alto o premiare un mazzo costruito
attorno a lei, ma **non può essere una comune migliore allo stesso costo**. Le comuni restano la spina dorsale. In questo
piano la rarità è solo un dato del catalogo: non esistono buste né proprietà delle carte.

## Bozza esterna di carte

La [proposta da 70 carte](design/set-base/bozza-esterna-proposta-70-carte.md) è conservata come **serbatoio di idee**: non è normativa, non è approvata e non si tiene aggiornata. Le sue carte
entrano nel set solo passando dai blocchi del piano, e dove contrasta col piano prevale il piano. Il bilanciamento dei suoi numeri non è validato.

Copre circa 31 degli slot nuovi. **Copertura massima**, sommando carte attuali e candidate: carte riprogettate o scartate la riducono.

| Blocco | Nel set | Attuali + bozza | Da inventare |
|---|---:|---:|---:|
| Personaggi | 7 | 5 | 2 (il Malalingua, Sant'Incasso) |
| Basic | 7 | 5 | 2 |
| Bound | 21 | 10 | 11 (la bozza ne ha due per personaggio) |
| Last resort | 4 | 1 | 3 |
| Azioni regolari | 60 | 39 | 21 |
| Oggetti | 16 | 10 | 6 |
| **Totale** | **115** | **70** | **45** |

**Punti di forza da portare nei blocchi:**

- **Nomi e mondo:** Mara, Pino e Gigi, e il tono di strada e di bar di carte come «Mattone del cantiere» o «Rutto a distanza sociale» (SB-9, SB-24). Le carte che restano possono tenere il loro nome.
- **Starter con un nome proprio:** «Chiude quando dico io», «Consegna sul muso», «Intervento sul posto». Lo si estende a tutti gli starter (SB-11, SB-13–SB-15).
- **Personaggi con valori diversi:** salute da 85 a 110, A da 15 a 40, capacità di oggetti da 2 a 3. Sono leve in più per differenziarli, senza meccaniche nuove (SB-9).
- **Basic:** le tre della bozza sono già prese di oggetti con un tratto personale, e confermano D3 (SB-11, SB-13–SB-15).
- **Bound che generano la risorsa del personaggio:** il ripiego è anche il modo per restare in gioco quando la risorsa manca. Di solito uniscono una risorsa e un piccolo danno, e superano il tetto ipotizzato: SB-10 misura se va cambiato il tetto o la carta.
- **Forma degli starter:** 14 azioni e 6 oggetti, 10 carte distinte in doppia copia, molte generiche condivise. Alleggerisce il budget rispetto alle 15 distinte di oggi, a scapito della varietà: SB-10 sceglie fra 10 e 15.
- **Meccaniche di base oggi poco esplorate:** POISON diretto («Sputo da posacenere», oggi nessuna carta lo infligge), cure e pulizia («Fasciatura col fazzolettaccio», «Due dita in gola», «Panino del kebab dimenticato», «Mezza minerale sgasata»), equip da oggetti («Guanti da officina», «Giubbotto di finta pelle»), CUT a costo A o V, contrasto all'alcol. Sono tutti candidati per SB-10 e SB-19.
- **Rischi già individuati**, da verificare nei rispettivi blocchi: A alta di Mara che rende troppo affidabili YouStop e WhatchaDoin; distruzione ripetibile di Gigi; pulizia gratuita che indebolisce la tossicità; accumulo di equip con molte copie.
- **Leggibilità:** distinguere immunità periodica e POISON, costi e perdite di A, oggetti sul campo ed equip attivi, durate (durata 2 significa tre turni). Va in SB-25 e SB-31.

**Ciò che non vale più:**

- **70 carte, cinque personaggi, nessun limite di copie, nessuna esclusività delle bound, starter di Bruiser e Junkie invariati, regolamento 1.5:** superati da D1, D2, D6, D7 e D14.
- **«Smontiamo tutto» come bound:** bersaglia un oggetto e viola il [vincolo sulle bound](#nessun-giocatore-senza-mosse). L'idea può vivere come azione regolare.
- **Immunità di Pino all'effetto periodico di L:** contrasta con l'identità di L che decade. Esclusa da D28; la variante si prova solo nel playground (SB-14).

## Struttura per set ed espansioni

Decisa dal proprietario: **il regolamento contiene le regole generali, un documento per set contiene le carte.** Con 115
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

**Lavoriamo a strati.** Non si creano tutte le carte per poi provarle: con 115 carte le interazioni sono troppe e i problemi di
fondo emergerebbero quando è già tutto da rifare. Si costruisce un personaggio alla volta contro una base stabile, e alla fine si
bilancia l'intero set.

**Strumenti:**

| Strumento | A cosa serve |
|---|---|
| Runner Java | Migliaia di partite, matchup scelti, varianti come 20 o 25 carte, statistiche per carta |
| CLI | Poche partite di controllo sul server reale, per confermare che la bozza funzioni end-to-end |
| Client web | Partite umane, per giudicare se il gioco diverte: il simulatore misura l'equilibrio, non il divertimento |

**Formato di riferimento: 1v1.** Il FFA è solo un controllo: si guarda che nessun personaggio sia ingiocabile o dominante.

**Criteri di arrivo**, approvati in linea di massima; sono ipotesi iniziali che i dati possono correggere:

| Misura | Obiettivo |
|---|---|
| Matchup fra starter base | 45–55% |
| Altri matchup fra starter | 40–60%, compresi quelli base contro avanzato, perché la coda quick è mista |
| Durata | Circa 6–12 turni |
| Patte e mazzi esauriti | Pochi |
| Turni senza mosse legali | Zero, con mazzi conformi |
| Carte | Nessuna quasi sempre giocata o quasi mai |
| Mazzi costruiti contro starter | Il migliore può vincere anche al 65–70%: è giusto che **una strategia da scoprire aprendo pacchetti** sia più forte |
| Mazzi costruiti fra loro | Nessun dominio: ogni mazzo di vertice ha almeno un matchup sfavorevole; ai vertici ci sono almeno 3 o 4 personaggi diversi |
| **Giudizio del proprietario** | **Decisivo**, dopo partite umane |

**Ordine delle correzioni:** prima i numeri, poi costo e priorità, infine il ridisegno della carta. Dopo ogni correzione si rilancia
la matrice. I giri hanno un **numero massimo fissato in anticipo**.

**Limite noto:** un bot può far sembrare debole un personaggio soltanto perché lo gioca male, e la ricerca automatica trova solo ciò che
i bot sanno giocare. Per questo ci sono più stili di bot e le prove umane.

## Blocchi

| Fase | Blocco | Contenuto | Dipende da |
|---|---|---|---|
| Fondamenta | SB-1 | Regole dei mazzi | — (anticipato da D40; fatto, in attesa del giudizio) |
| | SB-2 | Separazione fra regolamento e set | SB-1 |
| Strumenti | SB-3 | Runner senza server e seme | — |
| | SB-4 | Vista limitata e bot euristici | SB-3 |
| | SB-5 | Prova del formato dati | SB-3 |
| | SB-6a | Nucleo del playground | SB-5 |
| | SB-6b | Più set e mini-espansione di prova | SB-2, SB-6a |
| | SB-7 | Banco di misura e invarianti | SB-4, SB-6a |
| | SB-7b | Bot e costo in HEALTH | SB-7 |
| | SB-8 | Bozza giocabile da umani | SB-6a, SB-6b |
| Progetto | SB-9 | Schede dei personaggi | — |
| | SB-10a | Listino di potenza e tetto delle bound (misure) | SB-7b, SB-9 |
| | SB-10b | Griglia degli slot (progetto) | SB-10a |
| Carte | SB-11a | Passi `consume` ed `equip` del formato dati | SB-10b |
| | SB-11b | Bozza degli starter base | SB-11a |
| | SB-12a | Giro coi bot sugli starter base | SB-11b |
| | SB-12b | Prova umana degli starter base | SB-8, SB-12a |
| | SB-13 | Tossico: bozza e giro | SB-12 |
| | SB-14 | Pino l'Ultimo Giro: bozza e giro | SB-13 |
| | SB-15 | Gigi del Carro Attrezzi: bozza e giro | SB-14 |
| | SB-16 | Prova umana degli avanzati | SB-15 |
| | SB-17 | Il Malalingua: bozza e giro | SB-16 |
| | SB-18 | Sant'Incasso: bozza e giro | SB-17 |
| | SB-19 | Resto del pool e giro di blocco | SB-18 |
| Set intero | SB-20 | Prima misura dell'intero set | SB-19 |
| | SB-21 | Giri di correzione | SB-20 |
| | SB-22 | Prova umana con mazzi costruiti | SB-21 |
| | SB-23 | Valutazione delle varianti del formato | SB-21 |
| Congelamento | SB-24 | Flavour finale e congelamento | SB-22, SB-23 |
| | SB-25 | Testi delle carte per i giocatori | SB-24 |
| | SB-26 | Generazione del catalogo dal set | SB-25 |
| | SB-27 | Carte d'effetto speciale in forma definitiva | SB-26 |
| | SB-28 | Trasferimento nella partita viva | SB-26, SB-27 |
| Prodotto | SB-29 | Quick con categorie base e avanzata | SB-28 |
| | SB-30 | Bot nelle partite contro computer | SB-4, SB-28 |
| | SB-31 | Adeguamento del client | SB-28 |
| | SB-32 | Illustrazioni del set | SB-28, SB-31 |
| | SB-33 | Consolidamento e giudizio del proprietario | tutti |

SB-3 e SB-9 non dipendono dalle fondamenta: a lavoro avviato possono precedere SB-1. Con [D30](#decisioni-del-proprietario) l'ordine
corrente è SB-9 → SB-6a → SB-7 → SB-7b → SB-10a → SB-10b → SB-11a → SB-11b → SB-12a ([D31, D32, D37, D40](#decisioni-del-proprietario)), senza aspettare il client; SB-1 è anticipato in parallelo a C4 (D40);
SB-2 e SB-6b restano legati al client e vanno chiusi, con SB-1, prima di SB-8. SB-30 può essere anticipato per le carte attuali, se il bot si
dimostra utile prima: è una scelta del proprietario.

### SB-1 — Regole dei mazzi

**Anticipato da [D40](#decisioni-del-proprietario)**, in parallelo a C4: i blocchi C4 rimasti (C4-10, C4-11, C4-8a, C4-8b, C4-9) non toccano
l'editor dei mazzi (`deck.ts`, `collection.tsx`). Paletti: niente modifiche a `client-web/src/style.css`, su cui lavorano C4-10, C4-11 e C4-8a;
`verify-decks.mjs` riscritto e pushato prima che parta C4-8a, che usa `VerifyDecks`; dopo il pull l'altra macchina rifà il jar, perché cambiano
regolamento e validazione del server.

**SB-1 fatto il 7 novembre 2026, in attesa del giudizio del proprietario.** Regolamento **1.12**: R02 con le regole dei mazzi concordate per
starter e mazzi personalizzati, R03 senza la lacuna del giocatore vivo senza mosse, tre carte iniziali. `DeckRules` le applica al salvataggio e
all'avvio open; basic e last resort riservate con la colonna `C_EXCLUSIVE_TO` (carta `exclusiveToCharacter`, Q1), bound con
`boundToCharacter`. I mazzi salvati prima restano nel profilo ma non si giocano (Q2). Editor di client-web e client-debug che prevengono e
segnalano (Q3). Mazzi sintetici di `verify-decks.mjs`, `verify-resolution.mjs` e delle tre CLI riscritti in regola: nessun caso raro perso
nello scenario open misurato prima e dopo (Q4); lo stato «vivo senza mosse» non si provoca più. Da fare in C4: la frase del menu al tavolo
su R03 (Q5). [Rapporto SB-1](reports/set-base/sb-1-report.md).

**Perimetro.** Prossima versione del regolamento: R02 con le [regole dei mazzi concordate](#regole-dei-mazzi-concordate), R03 senza la lacuna
del giocatore senza mosse, R01a e il conteggio delle carte iniziali coerenti. Poi validazione in `UserAccountServiceImpl`, editor di
`client-web` (`deck.ts`) e `client-debug`, test, catalogo e copia del debug. I mazzi salvati sono provvisori: **si possono perdere, senza
migrazione**; quelli non validi si rifiutano o si eliminano, secondo la via più semplice.

**Completamento verificabile.** I due starter restano validi e la partita non cambia. Mazzi con 19 o 21 carte, una terza copia, bound
altrui, bound duplicate, basic altrui o senza last resort vengono rifiutati da server ed editor. I mazzi sintetici di verifiche e CLI sono
riscritti e continuano a provare gli stessi casi; `TestServerContext` e `VerifyDecks` verdi.

**Rischi.** Le verifiche del client si appoggiano a mazzi fuori regola per provocare casi rari (D8 del piano C3): riscriverli senza
perdere copertura è la parte più delicata. Oggi Bruiser e Junkie hanno solo due bound, quindi la scelta esiste solo dal Set Base in poi.

### SB-2 — Separazione fra regolamento e set

**Perimetro.** Nuova versione del regolamento secondo la [struttura concordata](#struttura-per-set-ed-espansioni): R07 e R07a passano a un
documento per il set attuale; R04 e R05 si ripuliscono dalle citazioni di carte senza cambiarne il senso. `check-rules.py`, allegato,
`MatchVersions`, `tools/print-cards`, copia nel debug e documenti che rimandano a R07 si adeguano. Campi set e rarità previsti nel
catalogo. **Le carte del Set Base entrano nel documento solo a bilanciamento concluso** (SB-28).

**Completamento verificabile.** Nessun effetto cambia: `CatalogEffectsTest`, `RulesConformanceTest` e contratti verdi senza toccare gli
attesi. `check-rules.py` rifiuta un disallineamento fra documento del set, allegato e catalogo. L'archivio partite registra anche la
versione del set.

**Rischi.** Riscrivere R04 e R05 può cambiare una regola senza volerlo: ogni frase spostata va confrontata. AGENTS e R00 vanno aggiornati.

### SB-3 — Runner senza server e seme

**Chiuso il 5 novembre 2026**, anticipato rispetto a D22 su istruzione del proprietario: la partita non cambia, salvo l'ordine prima
arbitrario dei timer simultanei, ora quello d'inserimento (R06 non garantisce precedenze). 200 partite vere rigiocate nel motore senza divergenze.
[Rapporto](reports/set-base/sb-3-report.md).

**Perimetro.** Controllo aperto dal piano: una partita completa in-process, senza Spring, con caricatore proprio delle carte. Fonte di casualità
con seme iniettabile in `Player`, `ComPlayer`, `BeggingMoney` e negli altri punti trovati; il comportamento di gioco non cambia. Il runner resta
fuori dall'artefatto distribuito. Usa il bot casuale attuale.

**Completamento verificabile.** Stesso seme, stessa partita, evento per evento. Partite di controllo coerenti con il server reale (via CLI) sulle
stesse regole. Partite al secondo misurate e dichiarate, così si sa quanto costa una matrice. Prima misura di base **Bruiser contro Junkie**,
registrata anche se il bot casuale dice poco.

**Rischi.** Dipendenze nascoste da Spring o dai log per turno.

### SB-4 — Vista limitata e bot euristici

**Chiuso il 5 novembre 2026**, anticipato rispetto a D22 su istruzione del proprietario: regole e carte non cambiano, il server usa ancora il casuale.
Aggressivo, prudente e attento alle risorse battono il casuale in tutti gli abbinamenti. Stile contro stile, Bruiser contro Junkie euristico vince al massimo il 4,6%:
una carta legata gratuita ripetuta basta a chiudere in 7–8 turni, dato per SB-10 e Q3. [Rapporto](reports/set-base/sb-4-report.md).

**Perimetro.** Il bot riceve **solo ciò che un giocatore può vedere** (R08), non l'intero `Game`, altrimenti bara. Primo bot euristico e **più stili
di gioco** (aggressivo, prudente, attento alle risorse), riutilizzabili anche in `ComPlayer` senza riscrittura. **Il casuale resta**, come livello
facile e come metro.

**Completamento verificabile.** Ogni bot euristico batte nettamente il casuale; se non lo fa va rifatto. Un test prova che il bot non può leggere mano o
mazzo altrui. Con Bruiser e Junkie gli stili producono risultati dichiarati e confrontati.

**Rischi.** Euristiche legate alle carte attuali: devono basarsi su costi, ruolo e danno, non su nomi.

### SB-5 — Prova del formato dati

**Chiuso il 5 novembre 2026**, anticipato rispetto a D22 su istruzione del proprietario: la prova sta nei test, partita e regole non cambiano.
Decisione: JSON con sei passi per le carte semplici, Java per le altre. 20 carte su 37 a dati, identiche alle classi Java in 16.000 partite.
I numeri delle 17 carte in Java restano nel codice: da risolvere in SB-6 (fatto in SB-6a). Con i passi `consume` ed `equip` di SB-11a le carte a dati salgono a 23 su 37. [Rapporto](reports/set-base/sb-5-report.md).

**Perimetro.** Secondo controllo aperto. Esprimere carte come dati: costo, priorità, bersaglio, effetti su sé e sul bersaglio, a partire da primitive
già esistenti. **Soluzione ibrida:** le carte semplici sono dati, quelle davvero strane (come `WhatchaDoin`) restano in Java con i numeri esposti come
parametri. Si convertono in prova alcune carte per tipo.

**Completamento verificabile.** Una carta convertita si comporta come l'originale nei test d'effetto esistenti. Conteggio di quante delle 33 azioni e dei
4 oggetti possono essere dati, con l'elenco di quelle che restano in Java. Decisione documentata sul formato.

**Rischi.** Un linguaggio per gli effetti troppo ricco: deve coprire le meccaniche di base, non anticipare le espansioni.

### SB-6 — Playground e mini-espansione di prova

Diviso da [D30](#decisioni-del-proprietario) in due blocchi. **SB-6a, nucleo del playground,** anticipato e senza SB-2: bozza in file con carte a
dati, carte Java parametriche, personaggi, mazzi e parametri del formato, validazione al caricamento, identità con il set di oggi.
**SB-6b, più set e mini-espansione,** dopo SB-2 e SB-6a: caricamento da più set contemporaneamente, campi set e rarità, mini-espansione di prova.
Il perimetro che segue vale per i due blocchi insieme.

**SB-6a fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «sb6a dovrebbe aver fatto,
procediamo?». Bozza in JSON con carte a dati, carte Java coi numeri
come parametri (`@Tunable`, valori di oggi come predefiniti), personaggi, mazzi e parametri del formato, rifiutata alla lettura se
errata. La bozza «attuale» gioca come il catalogo in 400 partite a ogni esecuzione e in 10.000 una tantum; una bozza di prova con
Mara e Rocco di SB-9 gira senza modifiche al motore. [Rapporto](reports/set-base/sb-6a-report.md).

**Perimetro.** Una **bozza di set** in file, caricata dal runner, in cui si cambia ciò che si vuole: numeri, carte, personaggi, starter e **parametri del
formato** (20 o 25 carte, 2 o 3 copie). Da più set contemporaneamente. Nessun legame col regolamento. Una **mini-espansione fittizia di poche carte**,
solo di prova, verifica la struttura multi-set, comprese bound aggiuntive di un personaggio esistente.

**Completamento verificabile.** Cambiare un numero non richiede ricompilazione. Una bozza errata viene rifiutata con un messaggio chiaro. Aggiungere la
mini-espansione **non tocca motore né regole generali**; se li tocca, si corregge qui, quando costa poco.

**Rischi.** La bozza che diverge dalla partita viva: le carte non convertite passano dalle stesse classi.

### SB-7 — Banco di misura e invarianti

**SB-7 fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» (SB-7 e SB-7b). Un comando a richiesta produce la matrice dei matchup per coppia
di mazzi e di stili, con intervalli di Wilson, e un rapporto in testo e in dati, identico byte per byte a parità di seme e bozza. Lo stesso
comando controlla otto invarianti in partita e il tetto delle bound sulla ripetizione, con tetto e pesi come parametri. Una ricerca per
mutazione, convalidata su semi disgiunti, ritrova una carta volutamente superiore. Ogni controllo è provato su una bozza costruita per
violarlo. Prima fotografia sulla bozza «attuale» e su quella di prova: nessun invariante violato, tutte e quattro le bound attuali oltre il
tetto. Una matrice da 7 personaggi costa circa 7 minuti su un thread. [Rapporto](reports/set-base/sb-7-report.md).

**Perimetro.** Un comando che produce la **matrice dei matchup** per stile di bot e un rapporto: esiti con intervallo di confidenza, durata, patte, mazzi
esauriti, tempo fino alla last resort, risorse inutilizzate, carte per giocata e per vittoria quando giocate, carte morte in mano. Controlli automatici
sulla bozza: **zero turni senza mosse legali**, [vincoli delle bound e delle last resort](#nessun-giocatore-senza-mosse), tetto di debolezza sulla
ripetizione. Ricerca automatica di mazzi forti (per mutazione) con limiti di copie e formato.

**Completamento verificabile.** Rapporto riproducibile col seme. Un mazzo costruito apposta per violare un invariante viene segnalato. La ricerca ritrova un
mazzo volutamente superiore inserito come prova.

**Rischi.** Falsa precisione: un intervallo di confidenza non corregge i limiti del bot.

### SB-7b — Bot e costo in HEALTH

Aggiunto da [D31](#decisioni-del-proprietario): mini-blocco prima di SB-10, perché la prima fotografia di SB-7 mostra Rocco che muore pagando in
HEALTH fino a 180 volte su 9000 partite con lo stile aggressivo, e le misure di SB-10 su Sant'Incasso ne sarebbero falsate.

**SB-7b fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno** («Approvo entrambi»). Sulla bozza di prova le morti pagando scendono da 310 a 0
su 27.000 partite di Rocco, con la stessa HEALTH spesa per partita. Sulla bozza «attuale» il rapporto del banco resta identico byte per
byte. [Rapporto](reports/set-base/sb-7b-report.md).

**Perimetro.** Gli stili euristici di `model/game/bot` tengono conto del costo in HEALTH. Una mossa che costa almeno la salute rimasta non
si gioca mai, nemmeno se ucciderebbe l'avversario: pagando si muore prima degli effetti (R04), quindi si arriva al massimo a una patta, e
una contromossa può lasciare solo la morte (fase A approvata). La salute spesa pesa come danno subito. Nessuna regola o carta cambia; il server non usa ancora i bot (SB-30).
Le contromosse sottostimate restano fuori, a SB-17.

**Completamento verificabile.** Sulla bozza di prova di SB-9 le morti pagando misurate dal banco di SB-7 scendono a zero, salvo le mosse
che uccidono l'avversario. Gli stili battono ancora il casuale come in SB-4; `BotStylesTest` verde senza toccare gli attesi. Matrice di SB-7
rilanciata e confrontata con la prima fotografia.

**Rischi.** Uno stile troppo cauto con la salute che non paga mai: il banco lo mostra nella HEALTH spesa per partita.

### SB-8 — Bozza giocabile da umani

**Perimetro.** Il server di sviluppo avvia partite con la bozza, senza toccare il catalogo di produzione; `client-web` le mostra, anche per carte **senza
illustrazione**. Serve a tutte le prove umane, con un controllo end-to-end via CLI.

**Completamento verificabile.** Partita reale con una carta di bozza, a 1366×768 e 844×390. Col profilo normale nessuna carta di bozza è raggiungibile.
`TestServerContext` verde.

**Rischi.** Il client presume dati del catalogo come ruolo, danno e immagini: i campi mancanti devono avere un ripiego.

### SB-9 — Schede dei personaggi

**Chiuso il 6 novembre 2026** con l'approvazione del proprietario a tutte le raccomandazioni: [schede dei personaggi](design/set-base/schede-personaggi.md).
Nomi provvisori Cesira la Malalingua e Rocco «Sant'Incasso»; Spazienzio invariato, Tossico con capacità 2, Mara e Pino con V 0; Q10 e Q6 decise (D28, D29).
Valori iniziali e indicazioni sulle bound sono ipotesi da misurare in SB-10. [Rapporto](reports/set-base/sb-9-report.md).

**Perimetro.** Scheda di ciascuno dei sette, attingendo alla [bozza esterna](#bozza-esterna-di-carte): nome, chi è, come picchia, risorsa, rischio, valori iniziali (salute e capacità comprese), versione propria del triangolo
attacco-difesa-contromossa. Revisione dei concept col proprietario, **senza consumare le cartucce creative**: quanto eccede il perimetro va all'elenco per le
espansioni. Bozza di tono coerente con Spazienzio de la Ucciso e il Tossico del Serraglio.

**Completamento verificabile.** Sette schede approvate dal proprietario, compresi nomi almeno provvisori. Nessuna risorsa o parola chiave nuova.

**Rischi.** Personaggi troppo simili sul piano delle risorse: V, T, L e A coprono solo quattro identità su sette. Malalingua, Gigi e Sant'Incasso si distinguono per
strategia e devono comunque pagare con le risorse di base.

### SB-10 — Griglia degli slot e listino di potenza

Diviso da [D32](#decisioni-del-proprietario) in due blocchi. **SB-10a, listino di potenza e tetto delle bound,** è di sole misure: danno per
risorsa, valore della priorità, valore di L che decade, tetto delle bound e suoi pesi, posizione delle carte attuali rispetto al listino.
**SB-10b, griglia degli slot,** è di progetto e usa il listino. Il perimetro che segue vale per i due blocchi insieme.

**SB-10a fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, scrivi», insieme alle quattro
raccomandazioni del rapporto ([D33](#decisioni-del-proprietario)). Il [listino](design/set-base/listino.md) è misurato con duelli fra
carta sonda e àncora (gratuita, 10 HIT), su cinque contesti e tre stili di bot. In sintesi:
- V costa circa 1,1 danni per unità fino a 20 V e di più oltre;
- A e la T del Tossico costano poco, HEALTH circa 1,1–1,2;
- CUT, POISON e HIT si equivalgono e la priorità vale quasi niente;
- la precedenza è ordinale;
- L guadagnata vale circa metà di V e, come costo, è quasi sempre impagabile.

Proposti tetto delle bound a 4 unità e nuovi pesi. Nella ricerca dei mazzi un mutante sostituisce il migliore solo oltre un errore
standard. [Rapporto](reports/set-base/sb-10a-report.md).

**SB-10b fatto il 6 novembre 2026.** Principi e griglia approvati dal proprietario lo stesso giorno, con le sue parole: «Approvo tutte»
(fase A, [D34](#decisioni-del-proprietario); fase B, [D35](#decisioni-del-proprietario)). La
[griglia](design/set-base/griglia.md) dà un posto a tutte le 115 carte, con ruolo, fascia di costo, rarità, starter e motivo; mappa le 39 carte di
oggi e le 31 della bozza esterna. I predefiniti del banco sono quelli di D33. La misura in partita conferma il tetto di 4 unità per le
bound di risorsa ma non per quelle di danno; il proprietario ha scelto il tetto 3 per il danno ([D36](#decisioni-del-proprietario)).
[Rapporto](reports/set-base/sb-10b-report.md).

**Perimetro.** Griglia delle circa 115 carte: slot per archetipo, ruolo, costo e rarità, secondo il [budget](#il-set-in-numeri), con le candidate della [bozza esterna](#bozza-esterna-di-carte) assegnate agli slot; numero di carte distinte per starter (10–15); quali generiche compaiono in quali
starter; curva dei costi rispetto ai 3 slot regolari in mano. **Listino di potenza** ricavato dalle carte attuali e misurato: danno per risorsa, valore della priorità,
valore di L che decade. Distribuzione delle rarità con il [paletto](#rarità). Verifica del tetto delle bound. Revisione degli effetti poco evidenti di L.

**Completamento verificabile.** Ogni slot ha un motivo; il totale è fra 110 e 120. Ogni carta attuale è mappata: conservata, riprogettata o sostituita, flavour compreso. Ogni carta della bozza è assegnata a uno slot o scartata con un motivo.
Listino e tetto delle bound confermati da misure.

**Rischi.** Una griglia troppo rigida frena le idee: gli slot si possono scambiare, purché il totale tenga.

### SB-11 — Bozza degli starter base

Diviso da [D37](#decisioni-del-proprietario) in due blocchi. **SB-11a, passi `consume` ed `equip` del formato dati,** prepara ciò che gli
starter base richiedono secondo la [griglia](design/set-base/griglia.md): la presa di oggetti delle basic e di Grab, gli equip da oggetti
con uso singolo e conversione del danno (Giubbotto e Posacenere, decisione B4 di D35), l'àncora del listino come parametro. **SB-11b, bozza
degli starter base,** scrive gli starter di Spazienzio e Mara con quei passi. Il perimetro che segue vale per SB-11b.

**SB-11a fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, scrivi». Il formato dati, nei soli sorgenti di test, ha il passo
`consume` (presa di un oggetto vicino, con i passi prima e dopo nell'ordine scritto), il passo `equip` dentro `status` (flusso, uso singolo
o durata, conversione del tipo) e il campo `basic`. Grab, BruiserGrab, ToxicGrab e il token BrokenBeerBottle scritti a dati coincidono
con le classi Java su 200 stati casuali con oggetti presenti, assenti e spariti, e in partite intere; Giubbotto, Posacenere, BadEducation e la
scadenza secondo R05 sono provati su stati costruiti a mano. Dopo SB-5 le carte a dati sono 23 su 37, le altre 14 restano in Java. L'àncora del
listino è un parametro (`-Dsim.listinoAnchor`, 10 di difetto, 7 per l'unità di D33). Regolamento, catalogo, client e classi di produzione non
cambiano. [Rapporto](reports/set-base/sb-11a-report.md).

**SB-11b fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, maiuscolo nei dati»; con
SB-11a, **SB-11 è chiuso**. Le risposte alle domande della fase A sono in
[D38 e D39](#decisioni-del-proprietario).
- **La bozza.** È un file unico che crescerà, `server/src/test/resources/set-base/bozza.json`, con gli starter di Spazienzio «Pazienza finita»
  e di Mara «Consegna sul muso» come nella griglia. Le carte di oggi tengono il binding della loro classe, le nuove hanno il prefisso `base.`.
- **Controlli.** Invarianti di SB-7 a zero in modo stretto su 96.000 partite; tutte le meccaniche di base coperte.
- **Il risultato centrale.** **Spazienzio batte Mara 0,937**, mentre gli specchi stanno a 0,50. Partite di 13,5–16,5 turni.
- **D36 e B2.** D36 regge per Spazienzio ma non per Mara, nemmeno con 2 di danno; la bound +8 A supera il criterio nello specchio, ma
  toglierla peggiora Mara.
- **Listino a 7 HIT.** La A di Mara vale circa 1 HIT, non 0,6.

Nulla è bilanciato qui: i correttivi sono misurati su varianti e passano a SB-12. [Rapporto](reports/set-base/sb-11b-report.md).

**Perimetro.** Spazienzio riprogettato e Mara: personaggio, basic, tre bound, last resort, azioni d'archetipo e generiche per due mazzi da 20. Nomi provvisori. Le carte
devono mostrare danno, difesa, priorità, oggetti e almeno una contromossa.

**Completamento verificabile.** Controlli di SB-7 verdi. Ogni meccanica di base compare in almeno uno dei due mazzi. Solo bozza.

**Rischi.** Semplicità contro interesse: il mazzo base deve insegnare senza annoiare.

### SB-12 — Giro sugli starter base e prova umana

Diviso da [D40](#decisioni-del-proprietario) in due blocchi. **SB-12a, giro coi bot,** porta gli starter base ai criteri con il banco e
non aspetta il client. **SB-12b, prova umana,** sono le partite del proprietario e richiede SB-8. Il perimetro che segue vale per i due insieme.

**SB-12a fatto il 7 novembre 2026, in attesa del giudizio del proprietario.** Tre giri coi bot (il massimo di Q5), circa 35 minuti di calcolo
su un tetto di 2 ore; correzioni decise con la delega di D38 e registrate in [D41](#decisioni-del-proprietario).
- **Giri.** 1: punto di partenza di D38 e Sgommata 22 → 26 CUT (0,525). 2: salute di Spazienzio 100 → 85 e di Mara 95 → 80, per la durata
  (0,500, 11 turni). 3: Sgommata 26 → 25, per centrare il matchup anche senza il bot attuale.
- **Esito.** Spazienzio contro Mara **0,520** [0,514–0,526] (0,476 coi soli stili euristici), partite di **11,1–11,3 turni**, mazzi esauriti
  10–15%, patte 10–13%, invarianti a zero su 96.000 partite. Bozza SHA-256 `441b1ecd…ef4841cf4`.
- **Bot.** Parate del turno, contromosse e Steal valgono meno di un colpo semplice in mano ai bot, per tutti e due: tenute, non tagliate.
- **D36 e B2.** Le bound stanno sotto 4 HEALTH equivalenti per uso, salvo la +8 A di Mara (circa 4,5): +6 A la riporta a 3,3 senza
  spostare il matchup, proposta al proprietario.
- **Listino a 7 HIT.** Prezzi quasi invariati: A di Mara circa 1 HIT, V oltre 20 molto più cara.

Il giudizio e le quattro domande aperte (B2 a +6 A, scala della salute degli altri personaggi, patte, Steal) sono nel
[rapporto](reports/set-base/sb-12a-report.md).

**Perimetro.** Giro di bilanciamento fino ai criteri, poi partite del proprietario. Il risultato è la **base stabile** per i blocchi successivi.

**Punto di partenza da SB-11b** ([D38](#decisioni-del-proprietario)):
- **Matchup:** Spazienzio contro Mara 0,937. Primo passo: costi di Mara −5 A su Cinghiata, Sgommata, Slalom, Paraurti e Sputo, e HEALTH di
  Mara 95 (misurato 0,593). Poi un secondo passo.
- **Prezzi del listino a 7 HIT:** la A di Mara vale circa 1 HIT, la V oltre 20 è molto più cara.
- **Durata:** sopra l'obiettivo.
- **D36 e B2:** si rimisurano sugli starter corretti, anche come salute equivalente per uso (al massimo 4).
- **Bot:** prima di tagliare carte, controllare se sono i bot a giocarle male.

**Completamento verificabile.** Matchup 45–55%, durata e invarianti nei limiti. Giudizio del proprietario registrato, con le osservazioni assegnate.

**Rischi.** Fermarsi ai numeri: se diverte poco, si torna a SB-11.

### SB-13, SB-14, SB-15 — Starter avanzati

Un blocco per personaggio, nell'ordine **Tossico del Serraglio, Pino l'Ultimo Giro, Gigi del Carro Attrezzi**.

**Perimetro.** Bozza dello starter (Junkie riprogettato sul primo blocco, conservandone il flavour), poi giro contro tutti gli starter già stabili, **senza toccarli se non
serve**; se serve, lo si dichiara e si rilancia la matrice.

**Completamento verificabile.** Matchup 40–60% con gli starter stabili, compresi quelli base. Invarianti verdi. Carte d'archetipo davvero giocate dal mazzo.

**Rischi.** Bot che gioca male i mazzi complessi: si aggiunge uno stile prima di correggere le carte. Pino: uso di L che decade o, con l'immunità, GoingBerserk troppo affidabile. Gigi: tavoli vuoti e distruzione ripetibile. Tossico: pulizie gratuite delle altre carte.

### SB-16 — Prova umana degli avanzati

**Perimetro.** Partite del proprietario con i tre avanzati, anche contro i base.

**Completamento verificabile.** Giudizio registrato. Osservazioni assegnate ai blocchi interessati, rifatti se serve.

**Rischi.** Complessità poco leggibile sul tavolo: va annotata per SB-31.

### SB-17, SB-18 — Personaggi da booster

Un blocco per personaggio: **Il Malalingua**, poi **Sant'Incasso**. Senza starter: basic, bound, carte d'archetipo e un **mazzo di prova**.

**Perimetro.** Bozza e giro contro gli starter e fra loro. Possono essere più forti degli starter se la costruzione del mazzo lo richiede.

**Completamento verificabile.** Mazzi di prova competitivi ma non dominanti secondo i criteri per i mazzi costruiti. Invarianti verdi. Alcune partite del proprietario con il mazzo di prova. Per Sant'Incasso, test sul costo in HEALTH: la mossa si presenta solo con salute sufficiente; pagare tutta la salute uccide e la mossa prosegue secondo R04; il bot non si suicida per caso.

**Rischi.** Contromosse che rendono frustrante la partita (Malalingua); partite infinite o, col prezzo in salute, suicidi facili (Sant'Incasso): durata sotto controllo.

### SB-19 — Resto del pool e giro di blocco

**Perimetro.** Generiche, oggetti e last resort rimaste, comprese terze bound e carte rare, partendo dalle candidate della bozza non ancora assegnate. **Sono l'ultimo blocco perché creano le combo più pericolose.** Giro sulle sole aggiunte.

**Completamento verificabile.** Griglia completa: totale fra 110 e 120, ogni carta con rarità. Gli starter non peggiorano.

**Rischi.** Il pool può arrivare stanco: le generiche devono restare interessanti, non riempitivi.

### SB-20 — Prima misura dell'intero set

**Perimetro.** Fotografia, senza correzioni: **matrice completa** degli starter, **ricerca automatica** dei mazzi più forti per personaggio, **analisi delle carte** dominanti o inutilizzate,
controllo FFA.

**Completamento verificabile.** Rapporto completo e riproducibile. Elenco dei problemi in ordine di gravità, proposto al proprietario insieme al numero massimo di giri.

**Rischi.** Molti problemi insieme: si parte da quelli che spostano più matchup.

### SB-21 — Giri di correzione

**Perimetro.** Ripetibile. Un giro per sessione. Si corregge secondo l'[ordine concordato](#bilanciamento-metodo-e-criteri), si rilancia matrice e ricerca e si registra cosa è cambiato.
Massimo proposto: 3 giri prima di tornare dal proprietario.

**Completamento verificabile.** Criteri di arrivo raggiunti o scostamenti residui dichiarati e sottoposti al proprietario.

**Rischi.** Inseguire il perfetto: una strategia un po' più forte è ammessa. Correzioni che rompono gli starter stabili: la matrice lo mostra.

### SB-22 — Prova umana con mazzi costruiti

**Perimetro.** Partite umane con mazzi costruiti, compresi quelli trovati dalla ricerca, e qualche FFA. Eventuali correzioni tornano a SB-21.

**Completamento verificabile.** **Giudizio del proprietario** registrato: è il criterio decisivo.

**Rischi.** Pochi giocatori: il giudizio resta soggettivo, ed è dichiarato come tale.

### SB-23 — Valutazione delle varianti del formato

**Perimetro.** Si confrontano **20 carte e 2 copie con 25 carte e 3 copie**, e si misura l'effetto della dimensione sul ritmo e sulla costanza dei mazzi.

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

### SB-31 — Adeguamento del client

**Perimetro.** Quanto serve al set: catalogo ed editor con circa 115 carte, filtri per set, rarità e personaggio, scelta di due bound fra quelle disponibili, conteggio verso 20 carte; effetti, stati e simboli di carte nuove, simboli di rarità. Le osservazioni delle prove umane finiscono qui. O15 e O16 sono la cornice naturale: vedi le decisioni aperte.

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

D1–D27 del 2 novembre 2026; le successive riportano la propria data.

| ID | Domanda | Decisione |
|---|---|---|
| D1 | Dimensione e copie | **Esattamente 20 carte, massimo 2 copie.** 25 con 3 da valutare in seguito (SB-23) |
| D2 | Bound | **Si scelgono 2 alla costruzione del mazzo**; almeno 3 nel set, quante si vuole nelle espansioni. **Tutte gratuite e deboli, come fallback** |
| D3 | Basic | **Carta del set, fissa per personaggio, sempre una presa di oggetti** con un tratto personale |
| D4 | Last resort | **Obbligatoria**; può essere legata a un personaggio |
| D5 | Giocatore senza mosse | **Risolto con bound e last resort obbligatorie**, senza «passo» |
| D6 | Junkie | **Passa agli avanzati (premium)** |
| D7 | Struttura dei personaggi | **7: 2 base, 3 avanzati, 2 da booster**; concept approvati in linea di massima |
| D8 | Perimetro creativo | **Esplorare le meccaniche di base, senza spararsi subito tutte le cartucce**: niente risorse o parole chiave nuove |
| D9 | Rarità | **Complessità e anche potenza**, con il paletto; solo un dato del catalogo |
| D10 | Fuori dal piano | **Buste, sblocchi, acquisti, proprietà delle carte.** Le illustrazioni erano qui: rientrano con D24 |
| D11 | Regolamento e set | **Regole generali da una parte, documenti di set dall'altra**, con predisposizione per le espansioni |
| D12 | Modifiche durante il bilanciamento | **Playground**, trasferito nel regolamento solo a bilanciamento concluso |
| D13 | Formato di riferimento | **1v1**; FFA come controllo |
| D14 | Carte attuali | **Riprogettabili**; il flavour non si scarta a prescindere |
| D15 | Flavour | **Personaggi subito**, nomi delle carte provvisori fino alla passata finale |
| D16 | Criteri | **Approvati in linea di massima**, con matchup riferiti agli **starter**: una strategia da scoprire può essere più forte |
| D17 | Simulatore | **Runner Java diretto**; CLI per le prove end-to-end |
| D18 | Bot | **Lo stesso bot** serve al simulatore e a migliorare l'avversario attuale |
| D19 | Quick | **Si sceglie base o avanzata, starter a caso. Coda mista;** matchmaking in futuro |
| D20 | Mazzi salvati | **Provvisori: si possono perdere** |
| D21 | Giri di bilanciamento | **Espliciti**, per blocco e sull'intero set (SB-20–SB-23) |
| D22 | Inizio | **A client web completato** |
| D23 | Testi delle carte | **Passata di abbellimento:** niente formule, simboli letterali e simili nei testi per i giocatori (SB-25) |
| D24 | Illustrazioni | **Generate nel piano, a carte testate, bilanciate e finalizzate** (SB-32) |
| D25 | Interpretazioni del piano | **Confermate:** due bound diverse, nessun doppione; lavori a client web completato; segnaposto per le carte nuove fino alle illustrazioni |
| D26 | Bozza esterna | **Conservata come serbatoio di idee**, da raccordare col piano. Mara, Pino e Gigi prendono il posto dei segnaposto |
| D27 | Personaggio che usa la salute | **Nel Set Base:** Sant'Incasso paga con la propria HEALTH. Non è una meccanica nuova: `Resource.HEALTH` esiste, `Move` controlla e paga i costi per qualsiasi risorsa, e danni a sé e perdite di salute ci sono già. Da aggiungere alle convenzioni dei costi di scheda e controlli |
| D28 | Pino immune all'effetto periodico di L (era Q10) | 6 novembre 2026, SB-9: **no.** L resta una risorsa da spendere subito, diversa da V; la variante immune si prova solo nel playground in SB-14 |
| D29 | Last resort proprie (era Q6) | 6 novembre 2026, SB-9: **Pino, Tossico e Sant'Incasso**; Struggle per gli altri quattro. Gratuite, sempre giocabili e fatte per chiudere la partita; SB-10 le colloca nella griglia |
| D30 | Ordine dei blocchi senza aspettare il client | 6 novembre 2026, con le parole del proprietario: «sono d'accordo con la tua idea per arrivare a progettare le carte il prima possibile senza aspettare la fine del lavoro sul client». **SB-6 si divide** in SB-6a (nucleo, anticipato, senza dipendere da SB-2) e SB-6b (più set e mini-espansione, dipende da SB-2 e SB-6a). **Ordine: SB-9 → SB-6a → SB-7 → SB-10.** SB-7 dipende da SB-4 e SB-6a; SB-8 da SB-6a e SB-6b. SB-1, SB-2 e SB-6b restano legati al client (l'editor), ma vanno chiusi prima di SB-8. Precisa D22 |
| D31 | Correzione dei bot sul costo in HEALTH | 6 novembre 2026, SB-7, con le parole del proprietario: «Prima di SB-10». **Mini-blocco SB-7b** dopo SB-7 e prima di SB-10: gli stili euristici smettono di suicidarsi pagando in HEALTH. Le contromosse sottostimate restano a SB-17. **Ordine: SB-9 → SB-6a → SB-7 → SB-7b → SB-10** |
| D32 | Divisione di SB-10 | 6 novembre 2026, con le parole del proprietario: «Sì, dividi e scrivi». **SB-10 si divide** in SB-10a (listino di potenza e tetto delle bound, misure) e SB-10b (griglia degli slot, progetto). SB-10a dipende da SB-7b e SB-9; SB-10b da SB-10a; SB-11 da SB-10b. **Ordine: SB-9 → SB-6a → SB-7 → SB-7b → SB-10a → SB-10b** |
| D33 | Listino e tetto delle bound (SB-10a) | 6 novembre 2026, con le parole del proprietario: «Approvo, scrivi». Accolte le quattro raccomandazioni di SB-10a: **(1)** tetto delle bound a **4 unità per uso, tolleranza 0**, da confermare in partita in SB-10b (una bound da 4 contro bound nulle entro +10 punti di quota); **(2)** pesi **V 0,75, A 0,5, T 0,15 per chi è immune, L 0,35, HEALTH 1** come predefiniti del banco, da rimisurare sugli starter nuovi; **(3)** carte prezzate rispetto a un'**unità gratuita da circa 6–8 HIT** invece che 10; **(4)** **L come costo: costi bassi, 5 o meno**, senza toccare le regole. Cautele per SB-10b: le contromosse risultano sotto il listino anche perché i bot le sottostimano (SB-17); la salute iniziale vale 2,5–4,8 punti di quota per 1 HEALTH |
| D34 | Principi della griglia (SB-10b, fase A) | 6 novembre 2026, con le parole del proprietario: «Approvo tutte». **(1)** Budget 115 con 37 azioni d'archetipo (6 per Cesira e Rocco) e 23 generiche; **(2)** starter da 12 carte distinte (5 d'archetipo, 4 generiche, 3 oggetti), con varianti per capacità; **(3)** bound senza parate: generatrice, colpetto e una variante a una sola funzione; **(4)** T del Tossico più scarsa, carte prezzate a circa 0,3–0,5 danni per T, bound di T al massimo +10 fino a SB-13; **(5)** costi in HEALTH solo nell'archetipo di Rocco, salute di Mara e Rocco invariata e prima leva nei giri; **(6)** tre rarità, circa 54, 41 e 20, «picco condizionato, media in linea»; **(7)** Pino con costi di 5 L o meno e carte che spendono la L residua; **(8)** passi nuovi `equip` e `consume`, il resto in Java coi parametri |
| D35 | Griglia degli slot (SB-10b, fase B) | 6 novembre 2026, con le parole del proprietario: «Approvo tutte». [Griglia](design/set-base/griglia.md) approvata con cinque scelte: spendere tutta la L con una classe Java (come `ToxicBloodDrain`); bound +8 A nello starter di Mara, da misurare in SB-11; rarità dell'archetipo 20, 10, 7; Giubbotto e Posacenere negli starter base, quindi passo `equip` da SB-11; una classe Java nuova per la rara di Gigi |
| D36 | Tetto delle bound di danno (SB-10b, era Q9) | 6 novembre 2026, con le parole del proprietario: «Sì, danno a 3». La misura in partita conferma 4 unità per le bound di risorsa ma non per quelle di danno (4 HIT oltre i +10 punti con Tossico, Rocco e Mara di prova). **Tetto: 4 unità per le bound di risorsa, 3 per quelle di danno**; nel banco il danno inflitto pesa 4/3 (`BoundCap.Params.DEFAULT`). Nella griglia le bound di danno passano da 4 a 3 e le varianti da 3 a 2. Da riconfermare sugli starter veri di Mara (SB-11) e Rocco (SB-18); se 3 supera ancora i +10 punti, si scende a 2 |
| D37 | Divisione di SB-11 | 6 novembre 2026, con le parole del proprietario: «Sì, dividi e scrivi». **SB-11 si divide** in SB-11a (passi `consume` ed `equip` del formato dati e àncora del listino come parametro, dipende da SB-10b) e SB-11b (bozza degli starter base, dipende da SB-11a). SB-12 dipende da SB-8 e SB-11b. **Ordine: SB-10b → SB-11a → SB-11b** |
| D38 | Bozza degli starter base (SB-11b, fase A) | 6 novembre 2026, con le parole del proprietario: «approvo le raccomandazioni su queste e anche delle prossime (a questo livello di dettaglio mi fido di te)». **(1)** Bozza in un file unico, `set-base/bozza.json`; carte di oggi col binding della classe, nuove col prefisso del set `base.`, slot nella descrizione; **(2)** durate: «per N turni» = `turns: N − 1` (R05), l'incoerenza dei testi di oggi va a SB-25; **(3)** D36: tetto del danno a 3, non a 2, che sullo starter di Mara non risolve; in SB-12 le bound si valutano anche come salute equivalente per uso, al massimo 4; **(4)** B2: la bound +8 A resta nello starter di Mara; **(5)** SB-12 parte da costi di Mara −5 A su cinque carte e HEALTH 95; **(6)** prezzi del listino a 7 HIT (A di Mara circa 1 HIT, V oltre 20 più cara) registrati qui e usati in SB-12, senza riscrivere ora la griglia; **(7)** limiti dei bot da guardare in SB-12 prima di tagliare carte |
| D39 | Nome e voce di Spazienzio (SB-11b) | 6 novembre 2026, con le parole del proprietario: «su spazienzio il mazzo lo chiamiamo "pazienza finita" e i nomi delle sue carte li teniamo tutti in maiuscolo (sull'interfaccia, non nei dati o nel codice), perché lui ha perso la pazienza e urla». Lo starter di Spazienzio si chiama **«Pazienza finita»**; i **nomi visualizzati** delle sue carte (slot `SPA-*`) sono **in maiuscolo**, mentre binding, id e codice restano come sono. Precisato dal proprietario all'approvazione di SB-11b: «maiuscolo nei dati», cioè il maiuscolo sta nel nome visualizzato scritto nella bozza (`gui.name`), non è l'interfaccia a trasformarlo. Vale anche per la passata finale (SB-24) e per i testi per i giocatori (SB-25) |
| D40 | Divisione di SB-12 e anticipo di SB-1 | 7 novembre 2026, con le parole del proprietario: «Sì, entrambi». **SB-12 si divide** in SB-12a (giro coi bot sugli starter base, dipende da SB-11b) e SB-12b (prova umana, dipende da SB-8 e SB-12a). **SB-1 è anticipato** in parallelo a C4, che si è allungato con C4-10 e C4-11, perché è il primo anello verso SB-8 e la prova umana; paletti: niente `style.css`, `verify-decks.mjs` pushato prima di C4-8a, jar rifatto sull'altra macchina dopo il pull. SB-13 resta dopo SB-12 intero; se la prova umana tarda, il proprietario può decidere di anticiparlo dopo SB-12a. Precisa D22 e D30 |
| D41 | Correzioni degli starter base (SB-12a) | 7 novembre 2026, **decise dall'esecutore con la delega di D38** («a questo livello di dettaglio mi fido di te»), **in attesa del giudizio del proprietario**. Tre giri al massimo (Q5). Salute iniziale di **Spazienzio 85** e di **Mara 80**; costi di Mara −5 A su Cinghiata, Sgommata, Slalom, Paraurti e Sputo (D38); **Sgommata 25 CUT**. Steal, parate e contromosse restano negli starter: le varianti mostrano che sono i bot a giocarle male. Proposte al proprietario, non applicate: MAR-BO2 da +8 a +6 A (B2 sopra 4 unità per uso), scala della salute per SB-13. Precisa D34(5), D36 e D38 |

## Decisioni ancora aperte

Con la proposta; nessuna blocca i primi blocchi.

| ID | Domanda | Proposta | Quando |
|---|---|---|---|
| Q1 | Avversari computer in quick | Stessa categoria dell'umano in 1vCom; qualunque starter nei bot aggiunti alla FFA | SB-29 |
| Q2 | Livelli di difficoltà del bot | Facile (casuale) e normale (euristico), scelti alla partita | SB-30 |
| Q3 | Anticipare il bot sulle carte attuali | Sì, se si dimostra utile dopo SB-4. Dato di SB-4: con le carte attuali il Junkie euristico schiaccia Bruiser, da decidere prima di anticipare | Dopo SB-4 |
| Q4 | Deckbuilder O15 e O16 | Anticiparli in SB-31, perché con 115 carte l'editor attuale difficilmente basta. Da valutare insieme a O17 e O18 | Prima di SB-31 |
| Q5 | Numero massimo di giri | 3, prima di tornare dal proprietario | SB-20 |
| Q7 | Formato definitivo | 20 carte e 2 copie, salvo dati contrari | SB-23 |
| Q8 | Report del server in «Ultimo turno» | Resta com'è: i fatti in italiano vengono prima, il testo inglese è secondario (D7 del piano C3). Da riconsiderare se la prova umana lo chiede | SB-25 |

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
  - **Più ferito, più forte:** danni che crescono con la salute persa (Sant'Incasso).
  - **Restituire il danno** all'autore, in parte (Sant'Incasso).
  - **Vedere la mano o il mazzo dell'avversario,** anche una sola carta: cambia R08 (Malalingua).
  - **Scarto forzato** di una carta dell'avversario, o una sua carta bloccata (Malalingua).
  - **Scommesse:** indovinare in anticipo la mossa dell'avversario (Malalingua).
  - **Schivata vera:** annullare il danno ricevuto invece di ridurlo (Mara).
  - **Astinenza:** penalità se il Tossico resta senza T.
  - **Riparare o costruire oggetti** dagli scarti, slot di equip (Gigi).
  - **Il giro offerto in FFA:** alcol a tutti gli avversari insieme (Pino).
- Da SB-10b ([griglia](design/set-base/griglia.md#idee-fuori-perimetro-per-le-espansioni)):
  - **Danno moltiplicato per una risorsa** (due HIT per ogni L): il formato sa solo dividere.
  - **Contromosse generiche** aperte a tutti: darebbero annullamenti a Mara.
  - **Bound di parata** valide solo contro il colpo successivo: richiedono una regola di consumo.
  - **«Tavolo ribaltato»:** distruggere tutti gli oggetti sul campo.
  - **Cassetta degli attrezzi:** un oggetto che crea un token attrezzo (Gigi).
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

# Botte Micidiali — Regolamento ufficiale

Versione **2.0 — 23 novembre 2026**. Fonte normativa del gioco, insieme ai documenti di set (R00).

> **Candidata, non in vigore** (SB-28, Fase A). Questo testo diventa `docs/game-rules.md` nel passaggio di SB-28 (Fase B), insieme
> al Set Base 1.0; fino ad allora vale il regolamento 1.14. La corrispondenza con le regole del playground e con la 1.14 è in
> [corrispondenza.md](corrispondenza.md). Al passaggio questo riquadro si toglie.

## R00 — Autorità

Questa prima versione deriva da codice server/client, catalogo SQLite e documentazione esistente. Nei conflitti iniziali prevale il codice. Da questa versione prevalgono **questo regolamento e i documenti di set** su codice, test, catalogo e altri documenti. I test devono verificarli, non modificarli implicitamente.

**Regolamento e set (1.13).** Il regolamento governa il sistema: preparazione, tipologie, mazzi, scelta e risoluzione delle mosse, danni, stati, fine turno e informazioni. Ogni set ha un proprio documento in `docs/sets/`, con versione e revisioni proprie, e le sue schede governano le carte del set (R07). Una scheda deroga a una regola di questo regolamento solo se lo dice esplicitamente; in ogni altro caso, e nel dubbio, prevale il regolamento. Il set in vigore è il Set Base, `docs/sets/base.md`.

**Parole chiave (2.0).** Le parole chiave che le carte stampano (Annuncia, Vulnerabile, Gioca d'anticipo, Rincara, In campo, Vendi, «Ultimo colpo», immune) sono definite una sola volta, in R07b, e valgono per ogni carta che le usa senza che la scheda le ripeta. Una parola chiave nuova entra solo con una revisione di questo regolamento: deve accorciare davvero i testi e restare intuitiva per chi gioca, e non introduce risorse nuove.

Per modificare il gioco: aggiornare prima versione e testo del documento interessato, motivando la modifica: questo regolamento per il sistema, il documento del set per le sue carte; poi adeguare test, codice, catalogo e documentazione nella stessa modifica. Non cambiare un atteso soltanto per accettare una regressione. Le copie pubblicate in `client-debug/src/assets/docs/` devono essere identiche: `rules.md` per questo regolamento, `sets/` per i documenti di set; `scripts/check-rules.py` controlla l'allineamento. Gli audit precedenti sono storici subordinati. La roadmap non introduce automaticamente regole attive.

## R01 — Obiettivo e preparazione

Botte Micidiali simula una rissa con carte: vince l'ultimo personaggio vivo; se muoiono tutti si pareggia (R06). Le mosse si scelgono simultaneamente e si risolvono in sequenza.

Modalità: quick contro computer, quick 1v1, quick FFA (tutti contro tutti), open contro computer. Quick assegna casualmente un personaggio con il suo starter, fra quelli indicati dal documento del set; open usa un mazzo salvato dell'umano, conforme a R02, e un bot casuale. Open PvP non è disponibile. La coda 1v1 parte a due iscritti, FFA a cinque; l'avvio anticipato richiede almeno due iscritti. Le code possono includere bot.

Ogni giocatore è rappresentato da una carta personaggio. Le schede complete di tutte le carte del set, comprese quelle personaggio, sono raccolte nel documento del set (R07).

HEALTH è la salute; ALERTNESS determina la precedenza a pari priorità; VIOLENCE è una risorsa di costo; TOXICITY e ALCOHOL sono risorse di costo con effetti periodici; ALCOHOL fa anche da corazza (R05). Non esistono tetti: le risorse possono superare i valori iniziali. L'immunità a una risorsa è definita in R07b.

**Pavimento a zero (2.0).** Nessuna risorsa scende sotto zero, HEALTH compresa: chi perde più di quanto ha, per un costo, un danno o una perdita, arriva a 0 e lì si ferma. Un personaggio a HEALTH 0 è **a terra**: durante il turno non colpisce (R04), e se lo è ancora a fine turno è morto (R06).

**Risorse di partenza (1.11).** Ogni personaggio ha tutte e cinque le risorse fin dalla preparazione: quelle che la sua scheda non indica partono da 0. La risorsa speciale della scheda è quella che parte da un valore diverso da zero. Una risorsa a 0 si legge, si paga, si guadagna e si perde come le altre, e gli effetti periodici di R06 non scattano finché non supera 0: per esempio, una carta che aggiunge alla propria TOXICITY il suo valore assoluto, giocata da chi non ha mai ricevuto TOXICITY, aggiunge abs(0) = 0. Gli esempi con le carte del set sono nel documento del set.

## R01a — Tipologie di carte

Il gioco distingue **carte personaggio, carte azione e carte oggetto**. Questa distinzione descrive il ruolo delle carte; le schede di tutte le carte, comprese quelle personaggio, sono nel documento del set (R07).

| Tipologia | Cosa rappresenta | Dove si trova e come si usa |
|---|---|---|
| **Carta personaggio** | Il combattente controllato dal giocatore, con risorse iniziali, capacità di oggetti e immunità | È assegnata o scelta nella preparazione e rappresenta il personaggio per tutta la partita. Non fa parte del mazzo di pesca, non occupa la mano e non si gioca come mossa. Le carte personaggio disponibili sono elencate nel documento del set. |
| **Carta azione** | Una mossa del personaggio, con bersaglio, priorità, eventuali costi ed effetti | Si trova in mano e si sceglie per presentare una mossa secondo R03. Il sottotipo stabilisce come entra in mano e se viene scartata dopo l'uso. |
| **Carta oggetto** | Un oggetto disponibile sul campo, vicino a un personaggio | Fa parte del mazzo regolare. Quando viene pescata va subito sul campo e si pesca ancora; non rimane in mano. Per consumarla o interagire con essa occorre un'azione che bersaglia oggetti, come una presa o un furto. La pesca da sola non ne attiva l'effetto. Un oggetto non fa nulla finché non è consumato, salvo un effetto «In campo» scritto sulla carta (R07b). |

### Sottotipi delle carte azione

| Sottotipo | Come entra in mano | Uso e scarto |
|---|---|---|
| **Azione regolare** | Si pesca dal mazzo regolare | Può avere un costo in risorse oppure essere gratuita. Dopo l'uso viene scartata. |
| **Azione base (basic)** | Entra in mano alla preparazione; ogni mazzo ha la basic del proprio personaggio, una sola e fissa | Non costa risorse e non richiede uno scarto aggiuntivo. Resta in mano dopo l'uso, ma deve comunque soddisfare i requisiti del bersaglio: per esempio, avere un oggetto vicino. |
| **Azione legata al personaggio (character-bound, o bound)** | Entra in mano alla preparazione; ogni mazzo ne ha due, diverse e legate al proprio personaggio | È associata a uno specifico personaggio. Non costa risorse, ma richiede lo scarto di un'altra carta ammessa da R02. La bound resta in mano dopo l'uso. |
| **Azione di ultima risorsa (last resort)** | Sostituisce una pesca quando il mazzo è vuoto, se non è già in mano; ogni mazzo ne ha una, generica o riservata al proprio personaggio | Non costa risorse; si scarta dopo l'uso e può tornare con una nuova pesca a mazzo vuoto. Non può essere lo scarto richiesto da una bound. |

L'espressione **carte regolari del mazzo** comprende azioni regolari e carte oggetto: non indica soltanto le azioni regolari. Carta personaggio, basic, bound e last resort sono predisposte separatamente dal mazzo regolare di ogni mazzo.

### Token oggetto ed equipaggiamenti

Un **token oggetto** è un oggetto creato da un effetto, anziché pescato dal mazzo iniziale. Sul campo segue le stesse regole degli oggetti, compreso il limite di capacità; non costituisce una quarta tipologia principale di carta. I token di un set sono elencati nel suo documento. Il token oggetto non va confuso con il **gettone** di R07b, che è uno stato del giocatore e non sta sul campo.

Un **equipaggiamento (equip)** è invece uno stato del personaggio, regolato da R05. Un oggetto o un token può produrlo quando viene consumato: l'oggetto sul campo e lo stato equipaggiato sono due elementi distinti. Per esempio, consumare un token che equipaggia rimuove il token dal campo e aggiunge il relativo stato.

## R02 — Mazzo, mano e oggetti

Ogni starter contiene 20 carte regolari (azioni e oggetti), oltre a una basic, due character-bound e una last resort. Basic, bound e last resort di ogni starter sono indicate nel documento del set; le composizioni esatte sono nel suo allegato, `rules-catalog.json`.

Si mescola il mazzo regolare, si mettono basic e bound in mano e si tentano le pescate mancanti a sei. Un oggetto pescato va automaticamente vicino al personaggio e provoca un'altra pesca. Superata la capacità degli oggetti scompare il più vecchio, anche per furti, scambi e token. A mazzo vuoto si aggiunge la last resort solo se non è già in mano: la mano può restare sotto sei. Non si rimescolano gli scarti; il mazzo si mischia di nuovo solo dopo una ricerca (R02a).

Le azioni regolari possono essere gratuite e vengono scartate dopo l'uso. Basic e bound persistono. Una bound richiede lo scarto di un'altra carta in mano che non sia basic, bound o last resort; lo scarto avviene all'inizio del suo effetto. Una basic non richiede scarto, ma può richiedere un oggetto: non garantisce una mossa sempre giocabile.

Dopo ogni mossa risolta si scarta la carta giocata quando previsto e, se la mano è sotto sei, si effettua **una sola pesca**, con eventuale catena di oggetti, oppure la ricerca che la sostituisce (R02a). Non si riempie tutta la mano. La last resort si scarta e può essere ripescata immediatamente.

**Costruzione del mazzo (1.12).** Ogni mazzo, starter o personalizzato, è formato da:

- un personaggio del catalogo;
- la **basic del personaggio**: ogni personaggio ne ha una sola, fissa;
- **due bound diverse legate al proprio personaggio**, scelte fra quelle disponibili;
- **una last resort**, generica o riservata al proprio personaggio;
- **esattamente 20 carte regolari** (azioni regolari e oggetti), con **al massimo 2 copie** della stessa carta.

Basic e bound di ciascun personaggio, e se una last resort è generica o riservata, sono indicati nel documento del set. Il mazzo personalizzato ha inoltre un identificativo non vuoto e senza il carattere «/» (1.8). I riferimenti devono appartenere al catalogo e i sottotipi devono corrispondere ai rispettivi posti. Un mazzo che non rispetta queste regole non si salva e non si usa per giocare.

Le **carte iniziali** sono sempre tre: la basic e le due bound. Personaggio, last resort e mazzo regolare non entrano in questo conteggio. La last resort entra solo con la pesca a mazzo vuoto. Le pescate di preparazione completano la mano fino a sei secondo le regole sopra.

## R02a — Ricerca al posto della pesca (2.0)

Una carta può **sostituire la pesca che segue la sua mossa** con la **ricerca** nel mazzo di una carta indicata per nome. Nelle carte la ricerca si scrive con la parola chiave Annuncia (R07b), che ne dice anche le conseguenze.

1. **Quando.** La ricerca prende il posto dell'unica pesca di R02, dopo lo scarto della carta giocata: avviene solo se quella pesca ci sarebbe, cioè se la mano è sotto sei. Una mossa annullata non cerca e pesca normalmente (R04).
2. **Quali carte.** Può cercare una carta che si gioca e poi pesca: un'azione regolare, una bound o una last resort. Una basic, che resta in mano senza pescare, e un oggetto non cercano.
3. **Cosa si cerca.** Solo carte che vanno in mano, mai oggetti. La carta indica uno o due nomi esatti, distinti; con due nomi il giocatore ne sceglie uno quando gioca la carta (R03).
4. **Esito.** Se nel mazzo c'è una copia del nome cercato, quella copia va in mano e si mostra a tutti; la catena di oggetti di R02 non scatta, perché non si pesca. Se non c'è, si pesca normalmente, con l'eventuale catena di oggetti.
5. **Dopo ogni ricerca il mazzo si mischia**, trovata o no, con uno o due nomi.
6. **Carta di ricerca scartata.** Una carta che cerca, usata come scarto di una bound, non cerca. Una carta trovata e scartata più tardi esce dalla mano come ogni altra.
7. **Nulla cambia il mazzo fra la giocata e la ricerca.** Nessuna carta tocca il mazzo di un altro giocatore e l'autore pesca solo dopo la propria ricerca; se succedesse, la partita si ferma con un errore (R08) invece di cercare in un mazzo diverso da quello visto alla giocata.

Due ricerche nello stesso turno, di giocatori diversi, si eseguono ciascuna nell'ordine della propria mossa (R04). La ricerca di chi è a terra segue la sua mossa: se la mossa si annulla (R04), non cerca.

## R03 — Scelta della mossa

Si sceglie una carta in mano, il bersaglio previsto e le eventuali scelte aggiuntive. SELF indica sé, OPPONENT un avversario, NEAR_ITEM un proprio oggetto, FAR_ITEM un oggetto avversario. Per gli oggetti si indicano separatamente proprietario e nome. Per una bound si indica la carta da scartare. Per una carta con «Annuncia X o Y» (R07b) si può indicare il nome scelto: deve essere uno dei nomi stampati e avere almeno una copia nel mazzo; se la mossa non lo dice vale il primo nome stampato fra quelli con una copia nel mazzo.

Una mossa ordinaria richiede carta in mano, costi disponibili, nessuna mossa già presentata da quel giocatore e scarto/oggetto richiesti presenti. L'invio non paga i costi. Un secondo invio non sostituisce la prima scelta.

**Costi pagati con quello che si ha (2.0).** Ogni costo richiede, all'invio, almeno quella quantità della risorsa. Un costo in HEALTH richiede di più: non si paga se porterebbe a 0 o sotto, quindi serve una HEALTH maggiore del costo. Fa eccezione solo una carta con «Ultimo colpo» (R07b).

I morti senza mossa ricevono una mossa vuota. **Un giocatore vivo con un mazzo conforme a R02 ha sempre una mossa (1.12).** Finché il mazzo regolare ha carte, dopo ogni mossa presentata, anche annullata, si ripesca: la mano resta piena e contiene, oltre a basic e bound, tre carte regolari, quindi una bound si gioca scartandone una. A mazzo vuoto entra la last resort, gratuita e sempre giocabile. Per questo ogni set rispetta due vincoli (1.13): nessuna bound e nessuna last resort bersaglia oggetti, e ogni last resort è gratuita. Non esiste il «passo». Il bot prova carte e bersagli casuali e, se non trovasse mosse valide, passerebbe con mossa vuota: con mazzi conformi il caso non si presenta.

Le lacune del server nel controllo di identità, bersagli ordinari, compatibilità bound o invii dopo la fine non autorizzano mosse fuori dalle categorie descritte. I comandi malformati sono fuori dal regolamento.

## R04 — Risoluzione del turno

1. Si attende una mossa per partecipante, comprese quelle automatiche; una partita già finita non avvia un altro turno.
2. Si eliminano le mosse già vuote; tutte le altre pagano i costi prima di qualsiasi effetto. Si paga con quello che si ha (R03) e nessuna risorsa scende sotto zero (R01).
3. Si ordina per priorità decrescente, poi ALERTNESS decrescente **dopo i costi**. A parità di entrambi vale l'ordine d'inserimento nella partita. Le mosse con la stessa priorità e la stessa ALERTNESS dopo i costi formano un **gruppo di velocità** (2.0); i gruppi si susseguono in quest'ordine.
4. L'ordine resta fissato. All'inizio di ogni gruppo di velocità si annullano le mosse degli autori a terra (sotto). Ogni carta, nell'ordine, applica logica speciale, effetti su sé, effetti sul bersaglio; una bound scarta prima la carta aggiuntiva.
5. Seguono scarto della carta giocata e pesca secondo R02, o la ricerca che la sostituisce (R02a).
6. Esaurite le mosse, ogni personaggio ancora vivo esegue R06; il turno aumenta e si determina l'esito.

**Chi è a terra non colpisce (2.0).** La mossa di un autore a terra (R01) all'inizio del proprio gruppo di velocità si annulla, salvo che bersagli l'autore stesso o un suo oggetto vicino, o che la carta abbia «Ultimo colpo» (R07b). Dentro un gruppo le mosse restano simultanee: un autore portato a terra da una mossa del suo stesso gruppo risolve comunque la propria, e una mossa continua anche se l'autore cade durante il proprio effetto. Il registro del turno dice il motivo dell'annullamento («a terra»).

Una mossa su di sé già presentata si risolve anche da terra: una cura, per esempio, può riportare l'autore sopra 0 prima della fine del turno, e chi non è più a terra a fine turno resta in partita (salvataggio in extremis). Un bersaglio a terra può ricevere gli effetti già programmati. Il turno non si interrompe alla prima morte.

Una mossa annullata durante la risoluzione non produce effetti, ma ha già pagato e procede con scarto/pesca; non cerca (R02a). Una bound annullata non scarta la carta aggiuntiva. Una mossa già vuota rimossa prima dei costi non pesca.

Una carta che bersaglia un oggetto lo ricontrolla alla risoluzione: se l'oggetto è scomparso non lo consuma, non lo ruba e non lo distrugge, ma applica gli altri suoi effetti; restano costi, scarto e pesca. La vendita (Vendi, R07b) fa eccezione: il ricavato è la condizione stampata della vendita, non un altro effetto, e senza l'oggetto non si ottiene.

## R05 — Danni e stati

Danni: HIT, CUT, POISON. Si applicano stati OUTPUT dell'autore, INPUT del destinatario, poi la corazza dell'alcol (sotto) e infine la variazione HEALTH con i relativi stati di risorsa. Gli autodanni via inflictDamage attraversano entrambi i passaggi; il veleno periodico parte da INPUT.

Gli stati di danno compatibili si applicano cumulativamente nell'ordine di aggiunta. Una conversione di tipo modifica quali stati successivi sono compatibili. Ogni trasformazione numerica tronca verso zero. Per variazioni di risorsa si applica **solo il primo stato compatibile**, senza composizione o controllo INPUT/OUTPUT.

**Corazza dell'alcol (2.0).** Chi ha ALCOHOL (L) maggiore di 0 riduce ogni danno HIT ricevuto di L/4, divisione intera, dopo gli stati e senza scendere sotto zero. Non riduce CUT né POISON. Vale per tutti, anche sui danni a sé. È una regola del sistema, non uno stato: nessuno stato la toglie, e la sola L conta, al momento del danno.

Guadagnare n aggiunge abs(n); perdere n sottrae abs(n), prima degli stati. Svuotare porta a zero senza modificatori. Nessuna variazione porta una risorsa sotto zero (R01). Il filtro inviato al destinatario da inflictDamage include GOOD e BAD per ogni sottoinsieme ordinario, anche vuoto: una carta che limita gli stati dell'autore, per esempio ai soli GOOD, non limita quelli del bersaglio.

Uno stato senza durata persiste. Una durata d diminuisce a fine turno; lo stato scompare solo sotto zero: d=0 copre il turno corrente, d=1 anche il successivo. SingleUse imposta durata zero dopo l'uso: può applicarsi ancora nello stesso turno. Gli equip sono stati che un effetto può rimuovere, se la sua scheda lo prevede. Un gettone (R07b) è uno stato del giocatore e segue queste regole, salvo la durata, che dice la sua parola chiave.

**Isolamento degli stati (1.1):** ogni applicazione di uno stato crea uno stato distinto. Durata e consumo non sono condivisi fra applicazioni, personaggi o partite: ogni stato parte dalla durata della sua scheda, e uno stato singleUse segue la regola precedente.

## R06 — Fine turno e partita

Per ogni personaggio vivo all'inizio della propria fase, nell'ordine:

1. Se TOXICITY > 0 e non immune (R07b): POISON pari a TOXICITY/2, divisione intera. TOXICITY non cala automaticamente.
2. Se ALCOHOL > 0 e non immune: perde ALERTNESS pari ad ALCOHOL/2; poi ALCOHOL pari ad ALCOHOL/2 + 1.
3. Ogni timer diminuisce di uno; a zero o meno esegue l'effetto e scompare. Conta anche il turno di creazione. **I timer che scadono nello stesso turno si eseguono in ordine di creazione (2.0).**
4. Si decrementano e rimuovono gli stati secondo R05; con loro cadono i gettoni Vulnerabile finiti (R07b).
5. **(2.0)** Agiscono gli effetti «In campo» degli oggetti vicini, un oggetto alla volta dal più vecchio (R07b), se il personaggio non è morto nei punti precedenti.

Dopo le fasi di tutti i personaggi si tolgono le carte mostrate che non valgono più (Annuncia, R07b).

La fase iniziata prosegue anche se il veleno uccide. Chi era già morto prima della fase non esegue effetti periodici, timer o scadenze. HEALTH a 0 significa morto: per il pavimento di R01 la HEALTH non scende sotto. Un solo superstite vince; zero superstiti significa patta. **Nessuno spareggio (2.0):** senza superstiti la patta resta, qualunque sia la HEALTH di inizio turno o il modo in cui si è caduti. Nessun premio o aggiornamento Elo. L'uscita dalla sessione è distinta dall'esito.

A fine partita, e per un giocatore eliminato o in forfait, si tolgono i suoi gettoni e le sue carte mostrate (R07b).

### Clock, forfait e disconnessione (1.5, I14/I23)

Nelle partite iniziate con almeno due umani ogni umano non eliminato ha **30 secondi per presentare la mossa**. Il primo termine decorre dall'avvio della partita, quando la prima mossa è presentabile; i successivi dal completamento del turno precedente, quando la nuova mossa è presentabile. Il termine resta assoluto e continua durante la disconnessione. Una mossa accettata ferma il solo clock mossa del suo autore per quel turno. Contro computer non esiste timeout mossa. Il tempo del server è autoritativo: a tempo **uguale o successivo** al termine la mossa è tardiva.

L'abbandono esplicito (leave o logout) e la scadenza producono **forfait del singolo**, senza alterarne HEALTH: è escluso dai superstiti e dalle nuove mosse, e la sua eventuale mossa pendente è annullata senza costi o pesca. Le mosse già presentate dagli altri restano valide, anche verso chi abbandona, come per un bersaglio morto. In FFA gli altri proseguono. Tutte le scadenze già maturate si applicano in ordine di termine; quelle con lo stesso termine sono applicate insieme prima di contare i superstiti. Un superstite vince, zero producono draw; con almeno due si prosegue. Quindi in 1v1 scadenze simultanee di entrambi producono draw; in FFA non terminano la partita se restano almeno due partecipanti. Eventi duplicati non producono un nuovo forfait o esito.

Una disconnessione di trasporto, distinta da logout/leave, apre una finestra di **30 secondi** per lo stesso account, anche contro computer, nel solo processo vivo. Il termine parte dal primo drop e i tentativi di accesso o i drop prima del rientro effettivo non lo spostano. Il rientro prima del termine ripristina la stessa partita, la vista privata e la mossa già accettata, senza reinviarla. Al termine esatto il rientro è tardivo e scatta forfait; un clock mossa che scade prima prevale. Vale sempre una sola sessione attiva; messaggi di una vecchia connessione non comandano quella nuova. Un rientro tardivo riceve l'esito disponibile o il proprio forfait e lo stato corrente se gli altri stanno ancora giocando. La finalizzazione è unica, conserva i log e chiude i clock; il ritorno all'hub è distinto dall'esito.

### Riavvio del server (1.6, I24; decisione R06/Q14)

Al riavvio tutte le partite ancora attive nel registro persistente terminano in **draw**, sia dopo un arresto pulito sia dopo un crash. L'esito è finalizzato una sola volta con motivo **«riavvio server»**, consultabile dal partecipante autenticato anche senza una partita in memoria. I match già conclusi e tutti i dati precedenti rimangono invariati. Una finalizzazione interrotta viene completata al successivo avvio senza duplicare esiti. Il server completa questa chiusura prima di accettare nuove partite; un errore di persistenza ne impedisce l'avvio operativo.

Non si ripristinano partite giocabili, mosse o clock; gli ultimi dati osservati restano dati di analisi, non uno stato eseguibile. Il draw tecnico non dipende da HEALTH, forfait o mosse pendenti e non modifica quei dati storici. Nessun premio o aggiornamento Elo. Il recupero delle scritture già durevoli precede la chiusura: un esito già registrato nel journal locale viene conservato, non sostituito da un draw.

## R07 — Carte e documenti di set

Le carte stanno nei documenti di set (R00), uno per set, in `docs/sets/`; il set in vigore è il Set Base, `docs/sets/base.md`. Un documento di set contiene l'inventario delle sue carte e dei suoi token, gli starter, una **scheda normativa** per ogni carta, compresi i personaggi, e i campi descrittivi di R07a. Ha una versione propria, con revisioni motivate, e un allegato con nomi visualizzati e composizioni degli starter, a cui il catalogo SQLite deve corrispondere. Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte alla preparazione secondo R01a.

Convenzioni delle schede: identificatori stabili delle classi; i nomi visualizzati sono nell'allegato. Ogni riga indica tipologia e, dove previsto, sottotipo. V=VIOLENCE, A=ALERTNESS, T=TOXICITY, L=ALCOHOL; —=nessun costo risorse. Effetti prima dei modificatori R05; t è il valore al momento dell'effetto, dopo i costi. Una bound richiede lo scarto R02 anche se la scheda non lo ripete; le durate seguono R05. La scheda di un personaggio indica HEALTH, ALERTNESS, risorsa speciale, capacità di oggetti e immunità iniziale; le altre risorse partono da 0 (R01). Le schede usano le parole chiave di R07b e, quando le citano, rimandano alla regola («regolamento, Rnn»).

**Rarità (1.14).** Ogni carta può avere una rarità, COMMON, UNCOMMON, RARE o PROTAGONIST, oppure nessuna. È un dato del catalogo indicato dal documento del set: non è un effetto, non cambia costi, bersagli, priorità o risoluzione e non limita la costruzione dei mazzi. PROTAGONIST, in breve P, segue le stesse regole delle altre: nessun effetto sul gioco né sulla costruzione dei mazzi.

## R07a — Ruoli descrittivi delle carte (1.7)

Ogni carta ha un **ruolo** e l'elenco dei **guadagni di risorse a sé**. Sono campi descrittivi del catalogo per aiutare a riconoscere le carte: non sono effetti, non modificano costi, bersagli, priorità o risoluzione e non autorizzano mosse. In caso di dubbio prevale la scheda. I personaggi non si giocano e non hanno ruolo. I valori di ogni carta sono nel documento del suo set.

| Ruolo | Significato |
|---|---|
| DAMAGE | Danno: il suo scopo principale è infliggere danno all'avversario |
| DEFENSE | Difesa: riduce il danno ricevuto |
| RESOURCES | Risorse: fa guadagnare risorse o salute a chi la usa |
| COUNTER | Contrasto: annulla mosse avversarie |
| DISRUPT | Disturbo: toglie risorse all'avversario o gli aggiunge tossicità |
| ITEMS | Oggetti: prende, ruba, scambia o distrugge oggetti |
| OTHER | Altro: ruolo ambiguo, da rivedere con il bilanciamento |

I guadagni elencano solo le risorse aggiunte a chi gioca o consuma la carta, con le lettere di R07 e H=HEALTH; x indica una quantità variabile. Non includono costi, perdite, effetti sul bersaglio o quelli dell'oggetto consumato da una presa.

Le carte azione e oggetto portano ruolo e guadagni nel catalogo SQLite; un token, che non è nel catalogo, li dichiara nella propria classe come il nome visualizzato.

### Danno nominale (1.9)

Ogni carta ha anche un **danno nominale**: i tipi di danno di R05 (HIT, CUT, POISON) che la carta stessa infligge quando si risolve, a chi la gioca o al bersaglio, separati da virgola se sono più di uno; — se nessuno. Come ruolo e guadagni è un campo descrittivo: non è un effetto e non cambia la risoluzione. Il danno effettivo può avere un altro tipo per una conversione R05 o non avvenire, per esempio se la mossa è annullata. In caso di dubbio prevale la scheda. I personaggi non si giocano e non hanno danno nominale.

Non entrano nel danno nominale:

- il veleno di fine turno da TOXICITY (R06), quindi nemmeno le carte che aggiungono TOXICITY;
- i danni dei timer, che arrivano dopo la risoluzione;
- le perdite di HEALTH che non sono danni R05;
- gli stati che modificano il danno inflitto o ricevuto, compreso un equip che converte i colpi di chi lo porta ma di suo non infligge danno;
- gli effetti presi da altre carte: quello di una carta che esegue l'effetto di un'altra e quello dell'oggetto consumato da una presa.

**Importo nominale (1.10).** Ogni carta con danno nominale ha anche l'**importo** che infligge al bersaglio quando si risolve, scritto come tipo e numero, per esempio `HIT 15`; con più tipi, uno per tipo nell'ordine HIT, CUT, POISON, separati da virgola (somma degli importi dello stesso tipo); — se nessun danno. Un importo che dipende da una risorsa di chi gioca usa x per la quantità variabile, come i guadagni, per esempio `HIT 20+x`; la scheda dice quanto vale x. L'importo è quello della carta prima di qualsiasi stato o conversione di R05: il danno effettivo può essere diverso, o non avvenire. Il danno che la carta infligge a sé non entra: si mostra solo l'importo al bersaglio. Le carte con — nel tipo hanno — anche nell'importo. È descrittivo come il tipo: nessun effetto cambia, e in caso di dubbio prevale la scheda.

Il danno nominale e il suo importo stanno nel catalogo SQLite accanto a ruolo e guadagni; un token lo dichiara nella propria classe.

## R07b — Parole chiave (2.0)

Ogni parola chiave è definita qui una volta sola e vale per ogni carta che la stampa (R00). La scheda dice i numeri e le scelte della carta (nomi cercati, guadagni, importi, effetto); la regola dice come funziona. Un effetto stampato su una sola carta che contraddice una parola chiave vale solo se la scheda lo dice esplicitamente (R00).

### Annuncia

> **Annuncia X.** Al posto della pesca che segue la tua mossa cerchi nel mazzo una carta di nome X. Se lo trovi: la mostri, ottieni il premio e diventi Vulnerabile. Se non lo trovi: peschi normalmente e ottieni il ripiego.

1. **La ricerca.** È la ricerca di R02a, per un solo nome esatto X, mai un oggetto. Con **«Annuncia X o Y»** la carta stampa due nomi distinti, nell'ordine; il giocatore ne sceglie uno quando gioca la carta (R03), fra quelli che hanno almeno una copia nel mazzo in quel momento; se ce n'è uno solo la scelta è automatica; se non ce n'è nessuno la ricerca fallisce. La ricerca avviene dopo la mossa, sul nome scelto.
2. **Se lo trovi.** La carta va in mano e quella copia si mostra a tutti; si applicano solo i guadagni «Se lo trovi» della carta, dopo la ricerca; chi ha cercato diventa **Vulnerabile**, con un gettone legato al nome trovato (con due nomi: quello scelto e trovato; l'altro non c'entra).
3. **Se non lo trovi** (con due nomi: se nel mazzo non c'è né X né Y): si pesca normalmente, si applicano solo i guadagni «Se non lo trovi», ridotti e scritti sulla carta, e non si crea alcun gettone né carta mostrata. Il ripiego sostituisce il premio, non si somma, e non toglie gettoni già presenti.
4. **Premio con due nomi.** Una carta con due nomi ha un solo premio «Se lo trovi», pensato per il primo nome stampato, il colpo per cui la carta è fatta.
5. **Carta mostrata.** La copia trovata si mostra a faccia in su finché resta in mano e finché non giochi una carta con quel nome; dopo uno scarto resta soltanto il segnalino col nome. È un promemoria per tutti, non uno stato fisico della carta. Quando il suo gettone finisce per una giocata del nome, la carta mostrata cade con lui a fine turno; se il gettone è tolto da un effetto che toglie gli stati, la carta resta mostrata finché è in mano.
6. **Mossa annullata.** Una carta con Annuncia la cui mossa si annulla non cerca e pesca normalmente (R02a); scartata per giocare una bound non cerca niente.
7. **Registro.** Il registro del turno e la vista pubblica dicono i nomi annunciati, quello scelto e se è stato trovato.

### Vulnerabile e gettone

Un **gettone** è un segno che un effetto lascia sul giocatore, legato a un nome. È uno stato del personaggio (R05) e ne segue le regole, salvo la durata, che dice la parola chiave; non è un oggetto e non sta sul campo (R01a). Nel Set Base l'unico gettone è quello di Vulnerabile.

> **Vulnerabile.** Subisci una volta e mezza i danni HIT, CUT e POISON che subiresti, veleno di fine turno compreso. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta col nome trovato.

1. **Effetto.** Ogni gettone Vulnerabile è uno stato INPUT di chi lo porta che moltiplica per 1,5 i danni HIT, CUT e POISON ricevuti, compreso il POISON periodico di R06, troncando come ogni stato (R05).
2. **Più gettoni** sono indipendenti: ciascuno è uno stato distinto (R05, isolamento), applicato nell'ordine di aggiunta, quindi due gettoni moltiplicano per 1,5 due volte (circa ×2,25, con un troncamento per passo); nessuna fusione e nessun tetto speciale.
3. **Quando si soddisfa.** Una qualsiasi carta col nome trovato, giocata dal portatore, anche parata o annullata, soddisfa il gettone; lo scarto non lo soddisfa. Si soddisfa **un solo gettone** per giocata: il più vecchio ancora attivo fra quelli esistenti prima della mossa. Una ricerca del proprio nome non soddisfa il gettone che crea. I promemoria dello stesso nome rimasti senza gettone cadono a fine turno insieme a lui.
4. **Fine del gettone soddisfatto.** Il gettone resta per tutto il turno della giocata, contro ogni gruppo di velocità e contro il veleno di fine turno, e cade con la scadenza degli stati di quel fine turno (R06, punto 4).
5. **Uscita senza giocare.** Se a fine turno nessuna copia del nome è più né in mano né nel mazzo, il gettone resta per tutto il turno successivo, effetti di fine turno compresi, poi cade. Finché una copia è in mano o nel mazzo non ha scadenza. Il client avvisa prima di scartare l'ultima copia di una carta che tiene un gettone.
6. **Effetti che tolgono tutti gli stati** tolgono anche i gettoni Vulnerabile, che sono stati: se lo fanno prima di un danno nello stesso effetto, quel danno non è moltiplicato. La carta mostrata resta finché è in mano (Annuncia, punto 5).
7. **Fine partita.** A fine partita, a eliminazione e a forfait gettoni e carte mostrate si tolgono (R06). Sul gettone legato a un nome il client mostra «∞».

### Gioca d'anticipo

> **Gioca d'anticipo: E.** Se questa mossa si risolve **prima** della mossa del bersaglio, applica anche E.

1. «Prima» vuol dire in un **gruppo di velocità precedente** (R04): priorità più alta, oppure stessa priorità e ALERTNESS più alta dopo i costi. Nello stesso gruppo le mosse sono simultanee: nessun anticipo, anche se l'ordine d'inserimento le mette in fila.
2. Si decide **quando la mossa si risolve**, guardando l'ordine già fissato (R04, punti 3–4): se il bersaglio ha una mossa in un gruppo successivo, E si applica, dopo gli effetti scritti prima.
3. **Il bersaglio non gioca** (nessuna mossa, mossa vuota tolta prima dei costi, eliminato o forfait): nessun anticipo.
4. **La mossa del bersaglio sarà annullata più tardi**, da una carta o perché a terra all'inizio del suo gruppo: l'anticipo vale.
5. **La propria mossa è annullata:** nessun effetto, quindi nessun anticipo.
6. **Il bersaglio è già a terra** ma la sua mossa è ancora in attesa in un gruppo successivo: l'anticipo vale.
7. Con più avversari conta solo la mossa del giocatore bersagliato.

Il registro del turno scrive «Gioca d'anticipo: sì» o «no» per ogni mossa con la parola chiave, e la mossa pubblica lo dice.

### Rincara

> **Rincara X (Y a sé).** Per ogni volta che hai già giocato questa carta nella partita, +X ai danni al bersaglio e +Y ai danni a sé.

- Si conta **per giocatore e per titolo**: le tue giocate di questa carta; quelle dell'avversario non contano.
- **Conta ogni giocata, anche annullata**: la mossa è stata mostrata e pagata.
- Il contatore è **informazione pubblica** (R08): la mossa pubblica porta il numero delle giocate precedenti per le carte con la parola chiave.

### In campo

> **In campo: E.** Finché l'oggetto è in campo, alla fine di ogni turno chi lo ha vicino subisce E.

1. È una deroga scritta sulla carta alla regola che un oggetto non fa nulla finché non è consumato (R01a), solo per quell'effetto.
2. **Agisce a fine turno su chi ha l'oggetto vicino in quel momento**, dopo gli altri suoi effetti di fine turno (R06, punto 5), un oggetto alla volta dal più vecchio.
3. **Conta dove l'oggetto è, non da dove viene:** rubato, scambiato o copiato, colpisce chi lo ha ora; agisce anche nel turno in cui arriva.
4. **Fuori dal campo non agisce:** consumato, venduto (la vendita non dà nemmeno questo effetto), distrutto o scalzato dalla capacità (R02) prima della fine del turno, niente. Chi è morto non ha effetti di fine turno (R06), nemmeno se lo uccide il veleno dello stesso fine turno.
5. **Non è un danno:** è una perdita o un guadagno di risorsa, che stati, equip e parate non cambiano. Vale il pavimento a zero (R01): su una risorsa a zero non costa nulla.
6. **Non tocca mai HEALTH,** quindi da solo non uccide nessuno. La TOXICITY che dà avvelena dal turno dopo; a chi è immune resta la risorsa senza il veleno.

### Vendi

> **Vendi il tuo oggetto: E.** L'oggetto bersagliato esce dal campo senza il suo effetto e ottieni E.

1. Si gioca su un proprio oggetto (NEAR_ITEM, R03): il giocatore lo sceglie col bersaglio, e senza oggetti la carta non si gioca.
2. **Si decide alla risoluzione:** se l'oggetto bersagliato è ancora fra i propri, esce dal campo **senza il suo effetto** (nessun guadagno, immunità, equip, timer o effetto In campo) e va negli scarti come un oggetto consumato; il registro del turno lo dice; poi si applica E, il ricavato.
3. **Se l'oggetto è sparito prima** (rubato, distrutto, scalzato dalla capacità) non si vende e non si ottiene niente: il ricavato è la condizione della vendita, non un altro effetto nel senso di R04.

### «Ultimo colpo»

> **Ultimo colpo.** Puoi giocare questa carta anche se il costo in HEALTH supera la tua salute: paghi quello che hai e la mossa si risolve anche da terra.

È un'eccezione scritta sulla carta alle regole dei costi (R03) e di chi è a terra (R04). Permette un costo in HEALTH uguale o superiore alla salute disponibile: si paga quello che c'è, ci si ferma a 0 (R01) e la mossa si risolve anche se l'autore è a terra all'inizio del suo gruppo. Le altre risorse del costo devono essere sufficienti come sempre. Chi resta a 0 a fine turno è morto (R06).

### Immune

> **Immune a una risorsa.** Gli effetti periodici di quella risorsa non ti colpiscono.

L'immunità a una risorsa blocca il suo effetto periodico di fine turno (R06): niente veleno da TOXICITY, niente perdita di ALERTNESS e di ALCOHOL da ALCOHOL. Non blocca costi, guadagni, perdite, né alcun danno POISON. La scheda del personaggio dice le immunità iniziali; una carta può darne o toglierne, e la sua scheda dice fino a quando.

## R08 — Informazioni e confini

Le viste di gioco mostrano la mano solo al proprietario, risorse e oggetti a tutti; non mostrano l'ordine del mazzo. Sono pubbliche anche le carte mostrate e i gettoni (R07b), l'esito di ogni ricerca (nomi annunciati, nome scelto, trovato o no), l'anticipo e il contatore di Rincara. Questo non certifica sicurezza di API debug e log. La collezione espone l'intero catalogo a tutti, senza economia o proprietà individuale.

Nel servizio partite, invio e risoluzione sono una transazione locale in memoria: se una risoluzione fallisce si ripristina lo stato precedente all'ultimo comando, incluse mosse gia in attesa, mani, mazzi, risorse, stati e timer. Non si pubblicano viste o report di turni parziali; il mittente riceve un errore e puo ritentare. La lettura delle viste usa snapshot coerenti. Logging e notifiche dopo commit non annullano il round; un crash non e coperto da questo rollback.

Restano separati: autenticazione, validazione degli input, persistenza e contesto applicativo. Dopo un crash il riavvio applica il draw tecnico R06 agli attivi persistenti; non ricostruisce i turni non registrati. I test di regole non certificano avvio completo o partita end-to-end.

## R09 — Fonti e verifica

Fonti iniziali: Game, Move, Player, ComPlayer, Character, Status, tutte le classi model/cards, factory, code e viste del server; editor mazzi client; cards.sqlite; documenti locali. La vecchia ricognizione è conservata in `docs/reports/game-rules-audit-2026-10-23.md` come storico. Le regole entrate nella 2.0 vengono dalle regole del playground 1.9 (`docs/design/set-base/regole-playground.md`), storiche dalla 2.0; la corrispondenza è in `docs/design/set-base/sb-28/corrispondenza.md`.

Mappa test e risultati: `docs/rules-conformance.md`. Verifica dal workspace: `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`. La copertura è dichiarata per casi, non come prova esaustiva di tutte le combinazioni.

## Revisioni

- **2.0 — 23 novembre 2026, SB-28 (regole del Set Base 1.0):** entrano nel regolamento, come regole di sistema, le regole con cui il Set Base 1.0 è stato progettato, misurato e approvato, finora valide solo nel playground (regole del playground 1.9: RP-1…RP-21, RP-23…RP-25, RP-27, RP-29). R01: pavimento a zero per tutte le risorse, HEALTH compresa, e definizione di «a terra»; l'immunità passa in R07b. R02a, nuova: la ricerca al posto della pesca, col mazzo che si mischia dopo ogni ricerca. R03: costi pagati solo con quello che si ha (un costo in HEALTH non porta a 0) e scelta del nome per «Annuncia X o Y». R04: gruppi di velocità, chi è a terra all'inizio del proprio gruppo non colpisce (salvo mosse su di sé e «Ultimo colpo»), salvataggio in extremis conservato; la mossa annullata non cerca; la vendita non dà il ricavato senza l'oggetto. R05: corazza dell'alcol, L/4 sui danni HIT ricevuti. R06: timer simultanei in ordine di creazione (P4), effetti «In campo» dopo gli altri effetti di fine turno, nessuno spareggio, gettoni e carte mostrate tolti a fine partita, eliminazione e forfait. R07b, nuova: le parole chiave Annuncia, Vulnerabile e gettone, Gioca d'anticipo, Rincara, In campo, Vendi, «Ultimo colpo» e immune, definite una volta sola. R08: carte mostrate, gettoni, esito delle ricerche, anticipo e contatore di Rincara sono pubblici. Le regole del formato del file del set (RP-22, RP-26, RP-28) non sono regole del gioco e stanno nella descrizione del formato. Decisioni del proprietario del piano Set Base: D50 (12 novembre 2026, regole di sistema, «sì, applichiamola»; punto 8, «A»: nel playground fino al trasferimento, poi nel regolamento con P4), D73 («Si paga quel che c'è»), D78 (14 novembre 2026, parole chiave: «possiamo inventare tutte le keyword ragionevoli che ci consentono di avere testi delle carte piu concisi, purche non diventino un rebus»; le definizioni entrano nel regolamento al trasferimento), D71, D72, D97, D121, D130, D171, D179, D180 per le singole regole, e la proposta di SB-28 con D182. Motivazione: il Set Base 1.0 sostituisce lo 0.1 nella partita viva e le sue carte non si giocano senza queste regole; la versione è maggiore perché cambiano risoluzione, costi, danni, risorse e fine turno, non solo un dettaglio. Le partite archiviate restano leggibili con la versione registrata. Al passaggio i mazzi personalizzati salvati che contengono carte dello 0.1 uscite dal set si cancellano (D182).

- **1.14 — 22 novembre 2026, SB-24 (rarità P):** R07 ammette una quarta rarità, PROTAGONIST (in breve P), accanto a COMMON, UNCOMMON e RARE; come le altre è un dato descrittivo del catalogo, senza effetti sul gioco né sulla costruzione dei mazzi. Decisioni del proprietario D137 del piano Set Base (18 novembre 2026: «tutti i personaggi vorrei che avessero una rarità loro, P, che funziona un po' come la mythic rarity di mtga»), D144 e D166 (5) (22 novembre 2026: «andiamo con la fase B»). Motivazione: i sette personaggi del Set Base in progettazione hanno una rarità propria; frequenza nelle buste e jolly si progettano con l'economia (EC-0) e non sono regole del gioco. Il codice di catalogo PROTAGONIST è una scelta dell'esecutore, inglese come gli altri tre e con l'iniziale P. Nessuna regola, effetto, costo, priorità, bersaglio, starter o bilanciamento cambia; il Set Base 0.1 della partita viva resta senza rarità.

- **1.13 — 8 novembre 2026, SB-2 (regolamento e set):** il regolamento contiene le regole generali e le carte passano ai documenti di set in `docs/sets/`, con versione propria; il primo è il Set Base 0.1, con le 39 carte e il token di prima. R00: fonte normativa sono regolamento e documenti di set; il regolamento governa il sistema, la scheda governa la carta e deroga solo se lo dice esplicitamente. R07 diventa «Carte e documenti di set», con le convenzioni delle schede e la rarità come dato descrittivo del catalogo (COMMON, UNCOMMON, RARE o nessuna; nel Set Base 0.1 nessuna); R07a conserva le definizioni e lascia al set le tabelle per carta. Le frasi che citavano carte specifiche diventano regole generali con lo stesso esito sulle carte di oggi: R04, una carta che bersaglia un oggetto scomparso non lo consuma, ruba o distrugge ma applica gli altri suoi effetti (prima Grab, Steal, BreakYourToy ed EverythingIsDrug); R05, un filtro sugli stati dell'autore non limita quelli del bersaglio (prima SeagullFly), gli equip si rimuovono con gli effetti che lo prevedono (prima BadEducation), ogni applicazione di uno stato è uno stato distinto (prima MadeOfStone e BrokenBeerBottle; la durata 3 di MadeOfStone passa alla sua scheda); R03, nessuna bound o last resort bersaglia oggetti e ogni last resort è gratuita, ora vincoli per ogni set; R01, R01a e R02 rimandano al documento del set per personaggi, starter, token ed esempi. Decisioni del proprietario D11 e D42 del piano Set Base e raccomandazioni della fase A di SB-2, approvate l'8 novembre 2026 («vanno bene tutte le raccomandazioni»). Motivazione: con 115 carte le tabelle di R07 diventerebbero ingestibili e ogni ritocco di una carta cambierebbe la versione delle regole; ora cambia quella del set. Nessun effetto, costo, priorità, bersaglio, starter o bilanciamento cambia; le descrizioni SQLite citano il set («Riferimento: Set Base 0.1.») invece del regolamento.

- **1.12 — 7 novembre 2026, SB-1 (regole dei mazzi):** R02 sostituisce i requisiti minimi dei mazzi personalizzati (1.4) con una regola unica per starter e mazzi personalizzati: esattamente 20 carte regolari con al massimo 2 copie per carta, oggetti compresi; la basic fissa del personaggio; due bound diverse legate al proprio personaggio; una last resort generica o riservata al proprio personaggio. Le carte iniziali sono sempre tre. R01a dice che cosa ha ogni mazzo anziché ogni starter. R03 chiude la lacuna del giocatore vivo senza mosse: con un mazzo conforme una bound o la last resort è sempre giocabile, e il «passo» non si aggiunge. Decisioni del proprietario D1–D5, D25 e D29 del piano Set Base, anticipate da D40. Motivazione: la dimensione esatta conserva la pressione del mazzo che finisce, perché gli scarti non si rimescolano; basic, bound e last resort obbligatorie danno a ogni personaggio la sua firma e garantiscono una mossa a ogni turno. I due starter erano già conformi: nessuna carta, effetto, starter o partita cambia. I mazzi salvati che non rispettano le nuove regole restano visibili ma non si usano per giocare, finché non vengono corretti o cancellati (D20).

- **1.11 — 6 novembre 2026, risorse assenti:** aggiunta a R01 la regola delle risorse di partenza: ogni personaggio ha tutte e cinque le risorse, a 0 quelle che la scheda R07 non indica; nota corrispondente sotto le carte personaggio. Decisione del proprietario (6 novembre 2026, opzione «tutte a 0»). Motivazione: il regolamento non diceva quanto vale una risorsa che il personaggio non ha, e il motore la lasciava assente. Le carte che leggono la propria TOXICITY senza costo in T (BadTrip, LethalHeroinDose, PervertedMetabolism), giocate da Spazienzio con un mazzo personalizzato prima di aver mai ricevuto T, facevano fallire la risoluzione del round: il servizio ripristinava lo stato (R08) e la carta restava in mano, inutilizzabile. Ora si risolvono con T = 0. Nelle partite che prima non fallivano nessun numero cambia, perché costi, variazioni ed effetti periodici trattavano già l'assenza come 0; cambia ciò che si vede: le viste, il profilo, la collezione e l'archivio mostrano le cinque risorse di ogni personaggio dal primo turno. Nessuna modifica a carte, costi, starter o bilanciamento.

- **1.10 — 2 novembre 2026, A3 (C3-5, O7):** aggiunto a R07a l'importo nominale del danno di ogni carta e del token, accanto al tipo (1.9): `HIT 15`, `HIT 20+x` per ExtremelyViolentBlow (x = metà della V residua di chi gioca), — se nessun danno, conservato nel catalogo SQLite e nell'allegato. Decisione del proprietario (2 novembre 2026): contano solo gli importi inflitti al bersaglio alla risoluzione, prima di stati e conversioni; il danno a sé di Struggle e MethDrivenRage non entra; i casi esclusi dal tipo in 1.9 restano —. Motivazione: mostrare l'importo del danno sul volto della carta nel client web, accanto a costo e variazioni. Campo descrittivo: nessun effetto, costo, bersaglio, priorità, starter o bilanciamento cambia.

- **1.9 — 29 ottobre 2026, A1 (C3/D2, O7):** aggiunto a R07a il danno nominale di ogni carta e del token: i tipi di danno HIT, CUT o POISON che la carta infligge quando si risolve, più tipi o nessuno, conservati nel catalogo SQLite e nell'allegato accanto a ruolo e guadagni. Decisione del proprietario (D2 del piano C3 e casi ambigui confermati il 29 ottobre 2026): contano solo i danni inflitti dalla carta alla risoluzione; hanno — BrokenBeerBottle (conversione), le difese, MarvelousCocktail (veleno del timer), WhatchaDoin (effetto replicato) e LethalHeroinDose (perdita di HEALTH); il veleno di fine turno è R06. Motivazione: rendere riconoscibile il tipo di danno nel client web per gli effetti di C3-5 (osservazione O7), nello stesso posto delle altre informazioni sulle carte, come per O14. Campo descrittivo: nessun effetto, costo, bersaglio, priorità, starter o bilanciamento cambia.

- **1.8 — 28 ottobre 2026, C2b-4:** l'identificativo di un mazzo personalizzato non può contenere «/». Decisione del proprietario. Motivazione: l'avvio open 1vCom porta l'identificativo come segmento della destinazione `/app/game/open/1vCom/join/{username}/{deckId}`; con «/» il mazzo si salvava ma la richiesta di avvio veniva rifiutata dal controllo delle destinazioni, quindi il mazzo non era giocabile. Il server rifiuta ora il salvataggio come gli altri mazzi non validi. Nessuna modifica a carte, effetti, starter, bilanciamento o agli altri requisiti dei mazzi.

- **1.7 — 27 ottobre 2026, C2a/O14:** aggiunta R07a con ruolo descrittivo e guadagni di risorse a sé per ogni carta e per il token, conservati nel catalogo SQLite e nell'allegato. Decisione del proprietario: la classificazione vive nel catalogo, così tutte le informazioni sulle carte restano nello stesso posto; le carte ambigue hanno ruolo OTHER, da rivedere con il bilanciamento. Motivazione: rendere riconoscibili ruolo e guadagni nel client web (osservazioni O13 e O14 della prova umana A). Campo descrittivo: nessun effetto, costo, bersaglio, priorità, starter o bilanciamento cambia.

- **1.6 — 26 ottobre 2026, I24:** applicata la decisione R06/Q14 del proprietario: draw degli attivi al restart anche dopo crash, motivo consultabile «riavvio server», finalizzazione persistente unica e ripetibile dopo interruzione. Motivazione: chiudere in modo durevole le partite che il processo nuovo non può riprendere, conservando esiti conclusi e dati precedenti. Nessun restore giocabile, Elo o modifica a carte/bilanciamento.

- **1.5 — 25 ottobre 2026, I14/I23:** attivate Q06/Q10 e decisioni R02/R04: clock mossa continuo, decorrenza dalla possibilità di invio, nessun timeout mossa vsCom, forfait e reconnect 30 s. Chiarimento del proprietario: primo turno dall’avvio, confine escluso; in FFA forfait simultanei dei soli scaduti e successivo conteggio dei superstiti. Motivazione: rendere deterministici ciclo di vita, esito e coordinamento dei due clock senza cambiare carte o bilanciamento.

- **1.4 — 24 ottobre 2026, I15:** applicate le decisioni R03 del proprietario: basic e last resort obbligatorie, regolare non vuoto e massimo sei carte predisposte (basic più bound). Rimossi i limiti editor 20+2 e il filtro di compatibilità bound; restano catalogo, sottotipi e titolarità. Nessuna modifica agli effetti delle carte o agli starter.

- **1.3 — 23 ottobre 2026:** R07 raccoglie tutte le carte del set, incluse le due carte personaggio prima descritte in R01. Aggiunte tipologia per ogni carta e sottotipo per azioni/token; allegato e verifiche includono l’intero set. Nessuna modifica alle meccaniche.

- **1.2 — 23 ottobre 2026:** aggiunta R01a per esplicitare le tre tipologie di carte, i quattro sottotipi di azione e la distinzione fra oggetti, token ed equipaggiamenti. Chiarimento della terminologia già applicata, senza modifiche alle meccaniche o agli effetti.
- **1.1 — 23 ottobre 2026, I11:** rimossa l'eccezione degli stati condivisi per isolare applicazioni e partite; durate e moltiplicatori invariati. Esplicitato rollback locale del servizio su errore di risoluzione e pubblicazione dopo commit. Corretto l'ordine di parita affinche rispetti R04 (inserimento dei partecipanti), senza modificarne la regola.

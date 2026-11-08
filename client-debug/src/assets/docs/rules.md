# Botte Micidiali — Regolamento ufficiale

Versione **1.13 — 8 novembre 2026**. Fonte normativa del gioco, insieme ai documenti di set (R00).

## R00 — Autorità

Questa prima versione deriva da codice server/client, catalogo SQLite e documentazione esistente. Nei conflitti iniziali prevale il codice. Da questa versione prevalgono **questo regolamento e i documenti di set** su codice, test, catalogo e altri documenti. I test devono verificarli, non modificarli implicitamente.

**Regolamento e set (1.13).** Il regolamento governa il sistema: preparazione, tipologie, mazzi, scelta e risoluzione delle mosse, danni, stati, fine turno e informazioni. Ogni set ha un proprio documento in `docs/sets/`, con versione e revisioni proprie, e le sue schede governano le carte del set (R07). Una scheda deroga a una regola di questo regolamento solo se lo dice esplicitamente; in ogni altro caso, e nel dubbio, prevale il regolamento. Il set in vigore è il Set Base, `docs/sets/base.md`.

Per modificare il gioco: aggiornare prima versione e testo del documento interessato, motivando la modifica: questo regolamento per il sistema, il documento del set per le sue carte; poi adeguare test, codice, catalogo e documentazione nella stessa modifica. Non cambiare un atteso soltanto per accettare una regressione. Le copie pubblicate in `client-debug/src/assets/docs/` devono essere identiche: `rules.md` per questo regolamento, `sets/` per i documenti di set; `scripts/check-rules.py` controlla l'allineamento. Gli audit precedenti sono storici subordinati. La roadmap non introduce automaticamente regole attive.

## R01 — Obiettivo e preparazione

Botte Micidiali simula una rissa con carte: vince l'ultimo personaggio vivo; se muoiono tutti si pareggia. Le mosse si scelgono simultaneamente e si risolvono in sequenza.

Modalità: quick contro computer, quick 1v1, quick FFA (tutti contro tutti), open contro computer. Quick assegna casualmente un personaggio con il suo starter, fra quelli indicati dal documento del set; open usa un mazzo salvato dell'umano, conforme a R02, e un bot casuale. Open PvP non è disponibile. La coda 1v1 parte a due iscritti, FFA a cinque; l'avvio anticipato richiede almeno due iscritti. Le code possono includere bot.

Ogni giocatore è rappresentato da una carta personaggio. Le schede complete di tutte le carte del set, comprese quelle personaggio, sono raccolte nel documento del set (R07).

HEALTH è la salute; ALERTNESS determina la precedenza a pari priorità; VIOLENCE è una risorsa di costo; TOXICITY e ALCOHOL sono risorse di costo con effetti periodici. Non esistono tetti o pavimenti generali: le risorse possono essere negative o superare i valori iniziali. L'immunità a una risorsa blocca il suo effetto periodico, non costi, variazioni o qualsiasi danno POISON.

**Risorse di partenza (1.11).** Ogni personaggio ha tutte e cinque le risorse fin dalla preparazione: quelle che la sua scheda non indica partono da 0. La risorsa speciale della scheda è quella che parte da un valore diverso da zero. Una risorsa a 0 si legge, si paga, si guadagna e si perde come le altre, e gli effetti periodici di R06 non scattano finché non supera 0: per esempio, una carta che aggiunge alla propria TOXICITY il suo valore assoluto, giocata da chi non ha mai ricevuto TOXICITY, aggiunge abs(0) = 0. Gli esempi con le carte del set sono nel documento del set.

## R01a — Tipologie di carte

Il gioco distingue **carte personaggio, carte azione e carte oggetto**. Questa distinzione descrive il ruolo delle carte; le schede di tutte le carte, comprese quelle personaggio, sono nel documento del set (R07).

| Tipologia | Cosa rappresenta | Dove si trova e come si usa |
|---|---|---|
| **Carta personaggio** | Il combattente controllato dal giocatore, con risorse iniziali, capacità di oggetti e immunità | È assegnata o scelta nella preparazione e rappresenta il personaggio per tutta la partita. Non fa parte del mazzo di pesca, non occupa la mano e non si gioca come mossa. Le carte personaggio disponibili sono elencate nel documento del set. |
| **Carta azione** | Una mossa del personaggio, con bersaglio, priorità, eventuali costi ed effetti | Si trova in mano e si sceglie per presentare una mossa secondo R03. Il sottotipo stabilisce come entra in mano e se viene scartata dopo l'uso. |
| **Carta oggetto** | Un oggetto disponibile sul campo, vicino a un personaggio | Fa parte del mazzo regolare. Quando viene pescata va subito sul campo e si pesca ancora; non rimane in mano. Per consumarla o interagire con essa occorre un'azione che bersaglia oggetti, come una presa o un furto. La pesca da sola non ne attiva l'effetto. |

### Sottotipi delle carte azione

| Sottotipo | Come entra in mano | Uso e scarto |
|---|---|---|
| **Azione regolare** | Si pesca dal mazzo regolare | Può avere un costo in risorse oppure essere gratuita. Dopo l'uso viene scartata. |
| **Azione base (basic)** | Entra in mano alla preparazione; ogni mazzo ha la basic del proprio personaggio, una sola e fissa | Non costa risorse e non richiede uno scarto aggiuntivo. Resta in mano dopo l'uso, ma deve comunque soddisfare i requisiti del bersaglio: per esempio, avere un oggetto vicino. |
| **Azione legata al personaggio (character-bound, o bound)** | Entra in mano alla preparazione; ogni mazzo ne ha due, diverse e legate al proprio personaggio | È associata a uno specifico personaggio. Non costa risorse, ma richiede lo scarto di un'altra carta ammessa da R02. La bound resta in mano dopo l'uso. |
| **Azione di ultima risorsa (last resort)** | Sostituisce una pesca quando il mazzo è vuoto, se non è già in mano; ogni mazzo ne ha una, generica o riservata al proprio personaggio | Non costa risorse; si scarta dopo l'uso e può tornare con una nuova pesca a mazzo vuoto. Non può essere lo scarto richiesto da una bound. |

L'espressione **carte regolari del mazzo** comprende azioni regolari e carte oggetto: non indica soltanto le azioni regolari. Carta personaggio, basic, bound e last resort sono predisposte separatamente dal mazzo regolare di ogni mazzo.

### Token oggetto ed equipaggiamenti

Un **token oggetto** è un oggetto creato da un effetto, anziché pescato dal mazzo iniziale. Sul campo segue le stesse regole degli oggetti, compreso il limite di capacità; non costituisce una quarta tipologia principale di carta. I token di un set sono elencati nel suo documento.

Un **equipaggiamento (equip)** è invece uno stato del personaggio, regolato da R05. Un oggetto o un token può produrlo quando viene consumato: l'oggetto sul campo e lo stato equipaggiato sono due elementi distinti. Per esempio, consumare un token che equipaggia rimuove il token dal campo e aggiunge il relativo stato.

## R02 — Mazzo, mano e oggetti

Ogni starter contiene 20 carte regolari (azioni e oggetti), oltre a una basic, due character-bound e una last resort. Basic, bound e last resort di ogni starter sono indicate nel documento del set; le composizioni esatte sono nel suo allegato, `rules-catalog.json`.

Si mescola il mazzo regolare, si mettono basic e bound in mano e si tentano le pescate mancanti a sei. Un oggetto pescato va automaticamente vicino al personaggio e provoca un'altra pesca. Superata la capacità degli oggetti scompare il più vecchio, anche per furti, scambi e token. A mazzo vuoto si aggiunge la last resort solo se non è già in mano: la mano può restare sotto sei. Non si rimescolano gli scarti.

Le azioni regolari possono essere gratuite e vengono scartate dopo l'uso. Basic e bound persistono. Una bound richiede lo scarto di un'altra carta in mano che non sia basic, bound o last resort; lo scarto avviene all'inizio del suo effetto. Una basic non richiede scarto, ma può richiedere un oggetto: non garantisce una mossa sempre giocabile.

Dopo ogni mossa risolta si scarta la carta giocata quando previsto e, se la mano è sotto sei, si effettua **una sola pesca**, con eventuale catena di oggetti. Non si riempie tutta la mano. La last resort si scarta e può essere ripescata immediatamente.

**Costruzione del mazzo (1.12).** Ogni mazzo, starter o personalizzato, è formato da:

- un personaggio del catalogo;
- la **basic del personaggio**: ogni personaggio ne ha una sola, fissa;
- **due bound diverse legate al proprio personaggio**, scelte fra quelle disponibili;
- **una last resort**, generica o riservata al proprio personaggio;
- **esattamente 20 carte regolari** (azioni regolari e oggetti), con **al massimo 2 copie** della stessa carta.

Basic e bound di ciascun personaggio, e se una last resort è generica o riservata, sono indicati nel documento del set. Il mazzo personalizzato ha inoltre un identificativo non vuoto e senza il carattere «/» (1.8). I riferimenti devono appartenere al catalogo e i sottotipi devono corrispondere ai rispettivi posti. Un mazzo che non rispetta queste regole non si salva e non si usa per giocare.

Le **carte iniziali** sono sempre tre: la basic e le due bound. Personaggio, last resort e mazzo regolare non entrano in questo conteggio. La last resort entra solo con la pesca a mazzo vuoto. Le pescate di preparazione completano la mano fino a sei secondo le regole sopra.

## R03 — Scelta della mossa

Si sceglie una carta in mano, il bersaglio previsto e le eventuali scelte aggiuntive. SELF indica sé, OPPONENT un avversario, NEAR_ITEM un proprio oggetto, FAR_ITEM un oggetto avversario. Per gli oggetti si indicano separatamente proprietario e nome. Per una bound si indica la carta da scartare.

Una mossa ordinaria richiede carta in mano, costi disponibili, nessuna mossa già presentata da quel giocatore e scarto/oggetto richiesti presenti. L'invio non paga i costi. Un secondo invio non sostituisce la prima scelta.

I morti senza mossa ricevono una mossa vuota. **Un giocatore vivo con un mazzo conforme a R02 ha sempre una mossa (1.12).** Finché il mazzo regolare ha carte, dopo ogni mossa presentata, anche annullata, si ripesca: la mano resta piena e contiene, oltre a basic e bound, tre carte regolari, quindi una bound si gioca scartandone una. A mazzo vuoto entra la last resort, gratuita e sempre giocabile. Per questo ogni set rispetta due vincoli (1.13): nessuna bound e nessuna last resort bersaglia oggetti, e ogni last resort è gratuita. Non esiste il «passo». Il bot prova carte e bersagli casuali e, se non trovasse mosse valide, passerebbe con mossa vuota: con mazzi conformi il caso non si presenta.

Le lacune del server nel controllo di identità, bersagli ordinari, compatibilità bound o invii dopo la fine non autorizzano mosse fuori dalle categorie descritte. I comandi malformati sono fuori dal regolamento.

## R04 — Risoluzione del turno

1. Si attende una mossa per partecipante, comprese quelle automatiche; una partita già finita non avvia un altro turno.
2. Si eliminano le mosse già vuote; tutte le altre pagano i costi prima di qualsiasi effetto.
3. Si ordina per priorità decrescente, poi ALERTNESS decrescente **dopo i costi**. A parità di entrambi vale l'ordine d'inserimento nella partita.
4. L'ordine resta fissato. Ogni carta applica logica speciale, effetti su sé, effetti sul bersaglio; una bound scarta prima la carta aggiuntiva.
5. Seguono scarto della carta giocata e pesca secondo R02.
6. Esaurite le mosse, ogni personaggio ancora vivo esegue R06; il turno aumenta e si determina l'esito.

Una mossa già presentata continua anche se l'autore muore prima di agire o durante il proprio effetto. Un bersaglio morto durante il turno può ricevere gli effetti già programmati. Il turno non si interrompe alla prima morte.

Una mossa annullata durante la risoluzione non produce effetti, ma ha già pagato e procede con scarto/pesca. Una bound annullata non scarta la carta aggiuntiva. Una mossa già vuota rimossa prima dei costi non pesca.

Una carta che bersaglia un oggetto lo ricontrolla alla risoluzione: se l'oggetto è scomparso non lo consuma, non lo ruba e non lo distrugge, ma applica gli altri suoi effetti; restano costi, scarto e pesca.

## R05 — Danni e stati

Danni: HIT, CUT, POISON. Si applicano stati OUTPUT dell'autore, INPUT del destinatario, poi variazione HEALTH con i relativi stati di risorsa. Gli autodanni via inflictDamage attraversano entrambi i passaggi; il veleno periodico parte da INPUT.

Gli stati di danno compatibili si applicano cumulativamente nell'ordine di aggiunta. Una conversione di tipo modifica quali stati successivi sono compatibili. Ogni trasformazione numerica tronca verso zero. Per variazioni di risorsa si applica **solo il primo stato compatibile**, senza composizione o controllo INPUT/OUTPUT.

Guadagnare n aggiunge abs(n); perdere n sottrae abs(n), prima degli stati. Svuotare porta a zero senza modificatori. Il filtro inviato al destinatario da inflictDamage include GOOD e BAD per ogni sottoinsieme ordinario, anche vuoto: una carta che limita gli stati dell'autore, per esempio ai soli GOOD, non limita quelli del bersaglio.

Uno stato senza durata persiste. Una durata d diminuisce a fine turno; lo stato scompare solo sotto zero: d=0 copre il turno corrente, d=1 anche il successivo. SingleUse imposta durata zero dopo l'uso: può applicarsi ancora nello stesso turno. Gli equip sono stati che un effetto può rimuovere, se la sua scheda lo prevede.

**Isolamento degli stati (1.1):** ogni applicazione di uno stato crea uno stato distinto. Durata e consumo non sono condivisi fra applicazioni, personaggi o partite: ogni stato parte dalla durata della sua scheda, e uno stato singleUse segue la regola precedente.

## R06 — Fine turno e partita

Per ogni personaggio vivo all'inizio della propria fase, nell'ordine:

1. Se TOXICITY > 0 e non immune: POISON pari a TOXICITY/2, divisione intera. TOXICITY non cala automaticamente.
2. Se ALCOHOL > 0 e non immune: perde ALERTNESS pari ad ALCOHOL/2; poi ALCOHOL pari ad ALCOHOL/2 + 1.
3. Ogni timer diminuisce di uno; a zero o meno esegue l'effetto e scompare. Conta anche il turno di creazione. Nessuna precedenza garantita fra timer simultanei.
4. Si decrementano e rimuovono gli stati secondo R05.

La fase iniziata prosegue anche se il veleno uccide. Chi era già morto prima della fase non esegue effetti periodici, timer o scadenze. HEALTH <= 0 significa morto. Un solo superstite vince; zero superstiti significa patta. Nessun premio o aggiornamento Elo. L'uscita dalla sessione è distinta dall'esito.

### Clock, forfait e disconnessione (1.5, I14/I23)

Nelle partite iniziate con almeno due umani ogni umano non eliminato ha **30 secondi per presentare la mossa**. Il primo termine decorre dall'avvio della partita, quando la prima mossa è presentabile; i successivi dal completamento del turno precedente, quando la nuova mossa è presentabile. Il termine resta assoluto e continua durante la disconnessione. Una mossa accettata ferma il solo clock mossa del suo autore per quel turno. Contro computer non esiste timeout mossa. Il tempo del server è autoritativo: a tempo **uguale o successivo** al termine la mossa è tardiva.

L'abbandono esplicito (leave o logout) e la scadenza producono **forfait del singolo**, senza alterarne HEALTH: è escluso dai superstiti e dalle nuove mosse, e la sua eventuale mossa pendente è annullata senza costi o pesca. Le mosse già presentate dagli altri restano valide, anche verso chi abbandona, come per un bersaglio morto. In FFA gli altri proseguono. Tutte le scadenze già maturate si applicano in ordine di termine; quelle con lo stesso termine sono applicate insieme prima di contare i superstiti. Un superstite vince, zero producono draw; con almeno due si prosegue. Quindi in 1v1 scadenze simultanee di entrambi producono draw; in FFA non terminano la partita se restano almeno due partecipanti. Eventi duplicati non producono un nuovo forfait o esito.

Una disconnessione di trasporto, distinta da logout/leave, apre una finestra di **30 secondi** per lo stesso account, anche contro computer, nel solo processo vivo. Il termine parte dal primo drop e i tentativi di accesso o i drop prima del rientro effettivo non lo spostano. Il rientro prima del termine ripristina la stessa partita, la vista privata e la mossa già accettata, senza reinviarla. Al termine esatto il rientro è tardivo e scatta forfait; un clock mossa che scade prima prevale. Vale sempre una sola sessione attiva; messaggi di una vecchia connessione non comandano quella nuova. Un rientro tardivo riceve l'esito disponibile o il proprio forfait e lo stato corrente se gli altri stanno ancora giocando. La finalizzazione è unica, conserva i log e chiude i clock; il ritorno all'hub è distinto dall'esito.

### Riavvio del server (1.6, I24; decisione R06/Q14)

Al riavvio tutte le partite ancora attive nel registro persistente terminano in **draw**, sia dopo un arresto pulito sia dopo un crash. L'esito è finalizzato una sola volta con motivo **«riavvio server»**, consultabile dal partecipante autenticato anche senza una partita in memoria. I match già conclusi e tutti i dati precedenti rimangono invariati. Una finalizzazione interrotta viene completata al successivo avvio senza duplicare esiti. Il server completa questa chiusura prima di accettare nuove partite; un errore di persistenza ne impedisce l'avvio operativo.

Non si ripristinano partite giocabili, mosse o clock; gli ultimi dati osservati restano dati di analisi, non uno stato eseguibile. Il draw tecnico non dipende da HEALTH, forfait o mosse pendenti e non modifica quei dati storici. Nessun premio o aggiornamento Elo. Il recupero delle scritture già durevoli precede la chiusura: un esito già registrato nel journal locale viene conservato, non sostituito da un draw.

## R07 — Carte e documenti di set

Le carte stanno nei documenti di set (R00), uno per set, in `docs/sets/`; il set in vigore è il Set Base, `docs/sets/base.md`. Un documento di set contiene l'inventario delle sue carte e dei suoi token, gli starter, una **scheda normativa** per ogni carta, compresi i personaggi, e i campi descrittivi di R07a. Ha una versione propria, con revisioni motivate, e un allegato con nomi visualizzati e composizioni degli starter, a cui il catalogo SQLite deve corrispondere. Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte alla preparazione secondo R01a.

Convenzioni delle schede: identificatori stabili delle classi; i nomi visualizzati sono nell'allegato. Ogni riga indica tipologia e, dove previsto, sottotipo. V=VIOLENCE, A=ALERTNESS, T=TOXICITY, L=ALCOHOL; —=nessun costo risorse. Effetti prima dei modificatori R05; t è il valore al momento dell'effetto, dopo i costi. Una bound richiede lo scarto R02 anche se la scheda non lo ripete; le durate seguono R05. La scheda di un personaggio indica HEALTH, ALERTNESS, risorsa speciale, capacità di oggetti e immunità iniziale; le altre risorse partono da 0 (R01).

**Rarità (1.13).** Ogni carta può avere una rarità, COMMON, UNCOMMON o RARE, oppure nessuna. È un dato del catalogo indicato dal documento del set: non è un effetto, non cambia costi, bersagli, priorità o risoluzione e non limita la costruzione dei mazzi.

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

## R08 — Informazioni e confini

Le viste di gioco mostrano la mano solo al proprietario, risorse e oggetti a tutti; non mostrano l'ordine del mazzo. Questo non certifica sicurezza di API debug e log. La collezione espone l'intero catalogo a tutti, senza economia o proprietà individuale.

Nel servizio partite, invio e risoluzione sono una transazione locale in memoria: se una risoluzione fallisce si ripristina lo stato precedente all'ultimo comando, incluse mosse gia in attesa, mani, mazzi, risorse, stati e timer. Non si pubblicano viste o report di turni parziali; il mittente riceve un errore e puo ritentare. La lettura delle viste usa snapshot coerenti. Logging e notifiche dopo commit non annullano il round; un crash non e coperto da questo rollback.

Restano separati: autenticazione, validazione degli input, persistenza e contesto applicativo. Dopo un crash il riavvio applica il draw tecnico R06 agli attivi persistenti; non ricostruisce i turni non registrati. I test di regole non certificano avvio completo o partita end-to-end.

## R09 — Fonti e verifica

Fonti iniziali: Game, Move, Player, ComPlayer, Character, Status, tutte le classi model/cards, factory, code e viste del server; editor mazzi client; cards.sqlite; documenti locali. La vecchia ricognizione è conservata in `docs/reports/game-rules-audit-2026-10-23.md` come storico.

Mappa test e risultati: `docs/rules-conformance.md`. Verifica dal workspace: `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`. La copertura è dichiarata per casi, non come prova esaustiva di tutte le combinazioni.

## Revisioni

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

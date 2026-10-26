# Botte Micidiali — Regolamento ufficiale

Versione **1.6 — 26 ottobre 2026**. Fonte normativa del gioco.

## R00 — Autorità

Questa prima versione deriva da codice server/client, catalogo SQLite e documentazione esistente. Nei conflitti iniziali prevale il codice. Da questa versione prevale **questo regolamento** su codice, test, catalogo e altri documenti. I test devono verificarlo, non modificarlo implicitamente.

Per modificare il gioco: aggiornare prima versione e regole di questo documento, motivando la modifica; poi adeguare test, codice, catalogo e documentazione nella stessa modifica. Non cambiare un atteso soltanto per accettare una regressione. La copia pubblicata in `client-debug/src/assets/docs/rules.md` deve essere identica; `scripts/check-rules.py` controlla l'allineamento. Gli audit precedenti sono storici subordinati. La roadmap non introduce automaticamente regole attive.

## R01 — Obiettivo e preparazione

Botte Micidiali simula una rissa con carte: vince l'ultimo personaggio vivo; se muoiono tutti si pareggia. Le mosse si scelgono simultaneamente e si risolvono in sequenza.

Modalità: quick contro computer, quick 1v1, quick FFA (tutti contro tutti), open contro computer. Quick assegna casualmente Bruiser o Junkie con il suo starter; open usa il mazzo salvato dell'umano e un bot casuale. Open PvP non è disponibile. La coda 1v1 parte a due iscritti, FFA a cinque; l'avvio anticipato richiede almeno due iscritti. Le code possono includere bot.

Ogni giocatore è rappresentato da una carta personaggio. Le schede complete di tutte le carte del set, comprese quelle personaggio, sono raccolte in R07.

HEALTH è la salute; ALERTNESS determina la precedenza a pari priorità; VIOLENCE è una risorsa di costo; TOXICITY e ALCOHOL sono risorse di costo con effetti periodici. Non esistono tetti o pavimenti generali: le risorse possono essere negative o superare i valori iniziali. L'immunità a una risorsa blocca il suo effetto periodico, non costi, variazioni o qualsiasi danno POISON.

## R01a — Tipologie di carte

Il gioco distingue **carte personaggio, carte azione e carte oggetto**. Questa distinzione descrive il ruolo delle carte; le schede di tutte le carte, comprese quelle personaggio, sono in R07.

| Tipologia | Cosa rappresenta | Dove si trova e come si usa |
|---|---|---|
| **Carta personaggio** | Il combattente controllato dal giocatore, con risorse iniziali, capacità di oggetti e immunità | È assegnata o scelta nella preparazione e rappresenta il personaggio per tutta la partita. Non fa parte del mazzo di pesca, non occupa la mano e non si gioca come mossa. Le carte personaggio disponibili sono elencate in R07. |
| **Carta azione** | Una mossa del personaggio, con bersaglio, priorità, eventuali costi ed effetti | Si trova in mano e si sceglie per presentare una mossa secondo R03. Il sottotipo stabilisce come entra in mano e se viene scartata dopo l'uso. |
| **Carta oggetto** | Un oggetto disponibile sul campo, vicino a un personaggio | Fa parte del mazzo regolare. Quando viene pescata va subito sul campo e si pesca ancora; non rimane in mano. Per consumarla o interagire con essa occorre un'azione appropriata, come Grab o Steal. La pesca da sola non ne attiva l'effetto. |

### Sottotipi delle carte azione

| Sottotipo | Come entra in mano | Uso e scarto |
|---|---|---|
| **Azione regolare** | Si pesca dal mazzo regolare | Può avere un costo in risorse oppure essere gratuita. Dopo l'uso viene scartata. |
| **Azione base (basic)** | Entra in mano alla preparazione; gli starter ne hanno una | Non costa risorse e non richiede uno scarto aggiuntivo. Resta in mano dopo l'uso, ma deve comunque soddisfare i requisiti del bersaglio: per esempio, avere un oggetto vicino. |
| **Azione legata al personaggio (character-bound, o bound)** | Entra in mano alla preparazione; gli starter ne hanno due | È associata a uno specifico personaggio. Non costa risorse, ma richiede lo scarto di un'altra carta ammessa da R02. La bound resta in mano dopo l'uso. |
| **Azione di ultima risorsa (last resort)** | Sostituisce una pesca quando il mazzo è vuoto, se non è già in mano | Non costa risorse; si scarta dopo l'uso e può tornare con una nuova pesca a mazzo vuoto. Non può essere lo scarto richiesto da una bound. |

L'espressione **carte regolari del mazzo** comprende azioni regolari e carte oggetto: non indica soltanto le azioni regolari. Carta personaggio, basic, bound e last resort sono predisposte separatamente dal mazzo regolare degli starter.

### Token oggetto ed equipaggiamenti

Un **token oggetto** è un oggetto creato da un effetto, anziché pescato dal mazzo iniziale. Sul campo segue le stesse regole degli oggetti, compreso il limite di capacità; non costituisce una quarta tipologia principale di carta. BrokenBeerBottle è il token del set attuale.

Un **equipaggiamento (equip)** è invece uno stato del personaggio, regolato da R05. Un oggetto o un token può produrlo quando viene consumato: l'oggetto sul campo e lo stato equipaggiato sono due elementi distinti. Per esempio, consumare BrokenBeerBottle rimuove il token dal campo e aggiunge il relativo stato.

## R02 — Mazzo, mano e oggetti

Ogni starter contiene 20 carte regolari (azioni e oggetti), oltre a una basic, due character-bound e una last resort. Bruiser ha BruiserGrab, LittleSmack e LittleRage; Junkie ha ToxicGrab, RottenSmile e PatheticBlade; entrambi hanno Struggle. Le composizioni esatte sono nell'allegato `rules-catalog.json`.

Si mescola il mazzo regolare, si mettono basic e bound in mano e si tentano le pescate mancanti a sei. Un oggetto pescato va automaticamente vicino al personaggio e provoca un'altra pesca. Superata la capacità degli oggetti scompare il più vecchio, anche per furti, scambi e token. A mazzo vuoto si aggiunge la last resort solo se non è già in mano: la mano può restare sotto sei. Non si rimescolano gli scarti.

Le azioni regolari possono essere gratuite e vengono scartate dopo l'uso. Basic e bound persistono. Una bound richiede lo scarto di un'altra carta in mano che non sia basic, bound o last resort; lo scarto avviene all'inizio del suo effetto. Una basic non richiede scarto, ma può richiedere un oggetto: non garantisce una mossa sempre giocabile.

Dopo ogni mossa risolta si scarta la carta giocata quando previsto e, se la mano è sotto sei, si effettua **una sola pesca**, con eventuale catena di oggetti. Non si riempie tutta la mano. Struggle si scarta e può essere ripescata immediatamente.

I mazzi personalizzati richiedono identificativo non vuoto, personaggio del catalogo, una basic, una last resort e almeno una carta regolare (azione o oggetto). Non sono imposti 20 regolari, due bound, limiti di copie o compatibilità di personaggio delle bound. I riferimenti devono appartenere al catalogo e i sottotipi devono corrispondere ai rispettivi slot.

Le **carte iniziali** si contano prima delle pescate: una basic più il numero di bound, contando ogni copia. Sono al massimo sei (quindi da zero a cinque bound). Personaggio, last resort e mazzo regolare non entrano in questo conteggio. La last resort entra solo con la pesca a mazzo vuoto. Le pescate di preparazione completano la mano fino a sei secondo le regole sopra. Questo conteggio deriva dai campi separati e dalla preparazione del modello Player.

## R03 — Scelta della mossa

Si sceglie una carta in mano, il bersaglio previsto e le eventuali scelte aggiuntive. SELF indica sé, OPPONENT un avversario, NEAR_ITEM un proprio oggetto, FAR_ITEM un oggetto avversario. Per gli oggetti si indicano separatamente proprietario e nome. Per una bound si indica la carta da scartare.

Una mossa ordinaria richiede carta in mano, costi disponibili, nessuna mossa già presentata da quel giocatore e scarto/oggetto richiesti presenti. L'invio non paga i costi. Un secondo invio non sostituisce la prima scelta.

I morti senza mossa ricevono una mossa vuota. Il bot prova carte e bersagli casuali e, se non trova mosse valide, passa con mossa vuota. Non esiste una procedura equivalente affidabile per un umano senza mosse: è un limite della versione, non una sconfitta automatica.

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

Grab, Steal e BreakYourToy ricontrollano l'oggetto alla risoluzione: se scomparso non lo consumano, rubano o distruggono; restano costi/scarto/pesca. EverythingIsDrug mantiene +20 TOXICITY anche se l'oggetto è scomparso nel frattempo.

## R05 — Danni e stati

Danni: HIT, CUT, POISON. Si applicano stati OUTPUT dell'autore, INPUT del destinatario, poi variazione HEALTH con i relativi stati di risorsa. Gli autodanni via inflictDamage attraversano entrambi i passaggi; il veleno periodico parte da INPUT.

Gli stati di danno compatibili si applicano cumulativamente nell'ordine di aggiunta. Una conversione di tipo modifica quali stati successivi sono compatibili. Ogni trasformazione numerica tronca verso zero. Per variazioni di risorsa si applica **solo il primo stato compatibile**, senza composizione o controllo INPUT/OUTPUT.

Guadagnare n aggiunge abs(n); perdere n sottrae abs(n), prima degli stati. Svuotare porta a zero senza modificatori. Il filtro inviato al destinatario da inflictDamage include GOOD e BAD per ogni sottoinsieme ordinario, anche vuoto: SeagullFly usa solo GOOD sull'autore ma tutti gli stati sul bersaglio.

Uno stato senza durata persiste. Una durata d diminuisce a fine turno; lo stato scompare solo sotto zero: d=0 copre il turno corrente, d=1 anche il successivo. SingleUse imposta durata zero dopo l'uso: può applicarsi ancora nello stesso turno. Gli equip sono stati rimovibili da BadEducation.

**Isolamento degli stati (1.1):** ogni applicazione di MadeOfStone e BrokenBeerBottle crea uno stato distinto. Durata e consumo non sono condivisi fra applicazioni, personaggi o partite. MadeOfStone parte sempre da durata 3. BrokenBeerBottle mantiene singleUse e puo applicarsi ancora nello stesso turno secondo la regola precedente.

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

## R07 — Carte del set

Il set comprende **39 carte: 2 personaggio, 33 azione e 4 oggetto**, oltre a un token oggetto generato durante il gioco. Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte alla preparazione secondo R01a. Ogni riga indica tipologia e, dove previsto, sottotipo.

Identificatori stabili delle classi; i nomi visualizzati sono nell'allegato. V=VIOLENCE, A=ALERTNESS, T=TOXICITY, L=ALCOHOL; —=nessun costo risorse. Effetti prima dei modificatori R05; t è il valore al momento dell'effetto, dopo i costi. Le quattro bound richiedono lo scarto R02.

### Carte personaggio

| Carta | Tipologia | Nome visualizzato | HEALTH | ALERTNESS | Risorsa speciale | Capacità oggetti | Immunità iniziale |
|---|---|---|---:|---:|---|---:|---|
| BigBadBruiser | Personaggio | Spazienzio de la Ucciso | 100 | 20 | VIOLENCE 25 | 1 | Nessuna |
| ToxicJunkie | Personaggio | Tossico del Serraglio | 100 | 35 | TOXICITY 10 | 3 | Effetto periodico di TOXICITY |

### Carte azione

| Carta | Tipologia | Sottotipo | Costo | Priorità | Bersaglio | Effetto in ordine |
|---|---|---|---|---:|---|---|
| LittleSmack | Azione | Legata al personaggio | — | 1 | Avversario | +5 A a sé; 5 HIT al bersaglio |
| LittleRage | Azione | Legata al personaggio | — | 2 | Sé | HIT ricevuto ×0,75, durata 0; +5 V |
| PatheticBlade | Azione | Legata al personaggio | — | 1 | Avversario | +5 T a sé; 5 CUT e +5 T al bersaglio |
| RottenSmile | Azione | Legata al personaggio | — | 2 | Avversario | +5 A a sé; −5 A al bersaglio |
| BruiserGrab | Azione | Base | — | −1 | Oggetto vicino | Basic: consuma come Grab |
| ToxicGrab | Azione | Base | — | 1 | Oggetto vicino | Basic: perde abs(A/2), poi consuma come Grab; perde A anche se l'oggetto è scomparso |
| Struggle | Azione | Ultima risorsa | — | 1 | Avversario | Last resort: 5 HIT a sé; 10 HIT al bersaglio |
| Grab | Azione | Regolare | — | 1 | Oggetto vicino | Rimuove l'oggetto, applica solo effetti self/target, non logica speciale |
| Steal | Azione | Regolare | 10 A | 0 | Oggetto lontano | Trasferisce l'oggetto vicino a sé senza consumarlo |
| ShuffleFeet | Azione | Regolare | — | −1 | Avversario | Scambia tutti gli oggetti rispettando le capacità dei destinatari |
| BadEducation | Azione | Regolare | 10 V | 1 | Avversario | Rimuove equip del bersaglio; 10 HIT |
| BreakYourToy | Azione | Regolare | 10 V | 1 | Oggetto lontano | Distrugge l'oggetto |
| CantFeelAnything | Azione | Regolare | 20 V | 2 | Sé | HIT ricevuto ×0,35, durata 0; +10 A |
| ExtremelyViolentBlow | Azione | Regolare | 20 V | 1 | Avversario | HIT pari a 20 + V residua/2 |
| Glare | Azione | Regolare | — | 0 | Sé | HIT ricevuto ×1,5, durata 1; +15 V e +15 A |
| HealingBlow | Azione | Regolare | 20 V | 1 | Avversario | 30 HIT; azzera T e L del bersaglio |
| MadeOfStone | Azione | Regolare | — | 0 | Sé | CUT ricevuto ×0,5, stato indipendente R05; +10 V |
| SeagullFly | Azione | Regolare | 10 V | 1 | Avversario | 15 HIT: solo GOOD dell'autore, tutti gli stati del bersaglio |
| SickeningBlow | Azione | Regolare | 15 V | 1 | Avversario | 10 HIT; +10 T al bersaglio |
| StunningBlow | Azione | Regolare | 15 V | 1 | Avversario | −10 A; 10 HIT al bersaglio |
| SuperImpact | Azione | Regolare | 25 V | 0 | Avversario | 40 HIT |
| YouStop | Azione | Regolare | 5 V | 2 | Avversario | Annulla mossa del bersaglio solo se successiva; se trovata +10 A al bersaglio |
| WhatchaDoin | Azione | Regolare | 10 V + 10 A | 2 | Avversario | Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale |
| AmphetamineReflexes | Azione | Regolare | 10 T | 2 | Sé | Annulla mosse successive di avversari vivi con target pari al proprio ID; nessun +A |
| BadTrip | Azione | Regolare | 10 A | 2 | Sé | Toglie immunità T; timer 3 la aggiunge a sé; aggiunge abs(T) alla propria T |
| BeggingMoney | Azione | Regolare | 25 T | 0 | Avversario | Aggiunge un oggetto casuale del bersaglio vicino a sé senza rimuoverlo da lui; −10 A al bersaglio. Nessun recupero da alcol |
| Cough | Azione | Regolare | 10 T | 1 | Avversario | +5 T; −5 A al bersaglio |
| EverythingIsDrug | Azione | Regolare | — | 1 | Oggetto vicino | Consuma senza effetti dell'oggetto; +20 T a sé |
| GoingBerserk | Azione | Regolare | 10 L | 1 | Avversario | 30 HIT; nessun costo T |
| LethalHeroinDose | Azione | Regolare | — | 1 | Sé | Se t>=30 perde t HEALTH; aggiunge abs(t−30) a T. Esempio: 40→50, perdendo 40 HEALTH |
| MethDrivenRage | Azione | Regolare | 5 T | 1 | Avversario | 5 HIT a sé; 15 HIT al bersaglio |
| PervertedMetabolism | Azione | Regolare | — | 1 | Sé | Guadagna abs(T/2) HEALTH; perde abs(T) TOXICITY |
| ToxicBloodDrain | Azione | Regolare | 10 T | 1 | Avversario | Memorizza T residua, la perde e la aggiunge al bersaglio; rimuove immunità T al bersaglio; timer 1 aggiunge immunità T all'autore |

### Carte oggetto e token

Gli oggetti si attivano tramite Grab/derivate, non alla pesca. Nessun costo proprio; conta la priorità dell'azione che li consuma.

| Carta / token | Tipologia | Sottotipo | Effetto del consumo |
|---|---|---|---|
| CocktailOnTheGround | Oggetto | — | +20 V, +15 L, +5 T |
| RottenBeer | Oggetto | — | +5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario |
| AnotherRottenBeer | Oggetto | — | Crea BrokenBeerBottle vicino a sé; +10 L |
| MarvelousCocktail | Oggetto | — | Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON |
| BrokenBeerBottle | Oggetto | Token | Equip GOOD OUTPUT: HIT ×1,5 convertito in CUT; singleUse e stato indipendente secondo R05 |

SoberUp è una classe incompleta fuori dal catalogo (bersaglio non definito), non una carta giocabile o un terzo personaggio.


## R08 — Informazioni e confini

Le viste di gioco mostrano la mano solo al proprietario, risorse e oggetti a tutti; non mostrano l'ordine del mazzo. Questo non certifica sicurezza di API debug e log. La collezione espone l'intero catalogo a tutti, senza economia o proprietà individuale.

Nel servizio partite, invio e risoluzione sono una transazione locale in memoria: se una risoluzione fallisce si ripristina lo stato precedente all'ultimo comando, incluse mosse gia in attesa, mani, mazzi, risorse, stati e timer. Non si pubblicano viste o report di turni parziali; il mittente riceve un errore e puo ritentare. La lettura delle viste usa snapshot coerenti. Logging e notifiche dopo commit non annullano il round; un crash non e coperto da questo rollback.

Restano separati: autenticazione, validazione degli input, persistenza e contesto applicativo. Dopo un crash il riavvio applica il draw tecnico R06 agli attivi persistenti; non ricostruisce i turni non registrati. I test di regole non certificano avvio completo o partita end-to-end.

## R09 — Fonti e verifica

Fonti iniziali: Game, Move, Player, ComPlayer, Character, Status, tutte le classi model/cards, factory, code e viste del server; editor mazzi client; cards.sqlite; documenti locali. La vecchia ricognizione è conservata in `docs/reports/game-rules-audit-2026-10-23.md` come storico.

Mappa test e risultati: `docs/rules-conformance.md`. Verifica dal workspace: `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`. La copertura è dichiarata per casi, non come prova esaustiva di tutte le combinazioni.

## Revisioni

- **1.6 — 26 ottobre 2026, I24:** applicata la decisione R06/Q14 del proprietario: draw degli attivi al restart anche dopo crash, motivo consultabile «riavvio server», finalizzazione persistente unica e ripetibile dopo interruzione. Motivazione: chiudere in modo durevole le partite che il processo nuovo non può riprendere, conservando esiti conclusi e dati precedenti. Nessun restore giocabile, Elo o modifica a carte/bilanciamento.

- **1.5 — 25 ottobre 2026, I14/I23:** attivate Q06/Q10 e decisioni R02/R04: clock mossa continuo, decorrenza dalla possibilità di invio, nessun timeout mossa vsCom, forfait e reconnect 30 s. Chiarimento del proprietario: primo turno dall’avvio, confine escluso; in FFA forfait simultanei dei soli scaduti e successivo conteggio dei superstiti. Motivazione: rendere deterministici ciclo di vita, esito e coordinamento dei due clock senza cambiare carte o bilanciamento.

- **1.4 — 24 ottobre 2026, I15:** applicate le decisioni R03 del proprietario: basic e last resort obbligatorie, regolare non vuoto e massimo sei carte predisposte (basic più bound). Rimossi i limiti editor 20+2 e il filtro di compatibilità bound; restano catalogo, sottotipi e titolarità. Nessuna modifica agli effetti delle carte o agli starter.

- **1.3 — 23 ottobre 2026:** R07 raccoglie tutte le carte del set, incluse le due carte personaggio prima descritte in R01. Aggiunte tipologia per ogni carta e sottotipo per azioni/token; allegato e verifiche includono l’intero set. Nessuna modifica alle meccaniche.

- **1.2 — 23 ottobre 2026:** aggiunta R01a per esplicitare le tre tipologie di carte, i quattro sottotipi di azione e la distinzione fra oggetti, token ed equipaggiamenti. Chiarimento della terminologia già applicata, senza modifiche alle meccaniche o agli effetti.
- **1.1 — 23 ottobre 2026, I11:** rimossa l'eccezione degli stati condivisi per isolare applicazioni e partite; durate e moltiplicatori invariati. Esplicitato rollback locale del servizio su errore di risoluzione e pubblicazione dopo commit. Corretto l'ordine di parita affinche rispetti R04 (inserimento dei partecipanti), senza modificarne la regola.

# Botte Micidiali — Formato delle carriere

> **Proposta, non in vigore.** Proposta di CA-0b del [piano CA-0](../ca-plan.md#ca-0b--formato-delle-carriere-01), in attesa della
> decisione del proprietario. Fino ad allora il riferimento del formato resta il [prototipo](../design/carriere/prototipo.md) (CA-0a).

Versione **0.1 — 21 novembre 2026**. Documento normativo del formato in cui si scrive una carriera single-player: la storia in markdown
di regia, il cast che condivide con le altre carriere e ciò che il controllo garantisce su entrambi.

Il documento è subordinato al [regolamento](../game-rules.md) e ai documenti di set (R00). Il regolamento governa partite, mosse e
carte, le schede del set governano i personaggi come carte; il formato governa solo come una carriera si scrive, come si legge e che
cosa promette al giocatore. Una carriera non deroga mai a una regola: dove dichiara qualcosa sulle partite (chi gioca, contro chi, con
quali modificatori), è il regolamento a dire che cosa significa. Le storie scritte in questo formato restano nel
[serbatoio](../design/carriere/README.md) senza valore normativo fino all'avvio di CA-1 e CA-2 (DC4); qui sono citate solo come esempi.
Gli esempi vengono dal tutorial (`tutorial-dialoghi.md`) e dalla campagna principale (`principale-dialoghi.md`).

## F1 — Il file

Una carriera è un file markdown. Si legge per **blocchi**: un paragrafo (righe consecutive, fino a una riga vuota) o una voce di elenco
(`- …`, con le righe di seguito rientrate di almeno due spazi).

- **Titolo:** la prima riga `# …`. La parte prima di « — » è il titolo della carriera.
- **Preambolo:** tutto ciò che sta prima della prima sezione `## `. Non si legge, salvo il comando di carriera:

  > `[Carriera: tutorial; obbligatori: starter-mara, starter-spazienzio, carriera-principale]`

  Il primo argomento è l'identificativo della carriera; `obbligatori:` elenca gli sblocchi che ogni percorso fino a una fine completata
  deve dare (F8). Senza il comando l'identificativo viene dal titolo e non ci sono obbligatori, con un avviso.
- **Sezioni:** `## Etichetta — Titolo` è un nodo (F2); `## Achievement` raccoglie gli achievement (F10); ogni altra sezione `## `
  (per esempio «Note per la revisione») non si legge.
- **Identificativi:** etichette, sblocchi, achievement, finali, valori dei segni ed espressioni si riducono a minuscole senza accenti,
  con i trattini al posto di spazi e apostrofi («quasi calmo» → `quasi-calmo`, «Il Serraglio resta» → `il-serraglio-resta`). I nomi
  dei segni si scrivono già così e ammettono lettere, cifre, `_` e `-` (`tutorial_con`, `via-atto-1`).

## F2 — Nodi

Un nodo è una tappa della bacheca: una sequenza di passi senza rami, che finisce con un'uscita (F9). L'etichetta è come lo chiama
l'autore, il titolo è come appare sulla bacheca.

> `## I1 — Il cartello`

Un nodo si raggiunge per etichetta o per titolo. Il primo nodo del file è l'inizio. Due nodi con la stessa etichetta sono un errore.
Subito sotto il titolo, `[Nodo: …]` dichiara le opzioni del nodo, separate da `;`:

- **`segreto`**: non compare sulla bacheca finché non lo si è visto in un giro. Un nodo che si raggiunge solo perdendo una partita
  dev'essere segreto, salvo una scena finale (un nodo le cui uscite sono tutte fini), che resta visibile come gli altri finali.
- **`tasca`**: una scena che si apre perdendo e pende dal nodo perso, senza strade proprie sulla bacheca; la storia riprende dal nodo
  perso. Una tasca si raggiunge solo perdendo.
- **`se <condizione>`**: per entrarci serve anche la condizione (F8).

> `[Nodo: segreto; tasca]` · `[Nodo: segreto; se finale Il Serraglio resta]`

## F3 — Battute e testo che si legge

**Battuta:** `**Nome** (espressione): testo`. Il nome è quello di un personaggio del cast o un suo alias (F11); l'espressione è una di
quelle del personaggio.

> `**Mara** (sospettosa): Che guardi? Il cartello? Lo so, è molto sospetto.`

- **Alias:** il nome che compare nella finestra; aspetto ed espressioni restano quelli del personaggio
  («**Un signore** (strafottente): Guarda guarda... gli scappati di casa del Serraglio.», un alias di Sergio).
- **Figure in ombra** (chi non è un personaggio del gioco): battuta senza espressione, con il nome o un alias.
  > `**Un amico**: ...ma siamo sicuri che il posto sia questo?`

  Un'espressione scritta per una figura in ombra non si vede e dà un avviso. Una battuta di un personaggio senza espressione è un errore.
- **`{giocatore}`** nel testo è il nome utente del giocatore; ogni altro `{…}` nel testo dà un avviso.
- **Stacchi:** `[Stacchi: Nome espressione, …]` dopo una battuta: la battuta arriva a pezzi e fra un pezzo e l'altro l'inquadratura stacca
  su chi ascolta, nell'ordine scritto. **`[Interrotta]`** dopo una battuta: quella che segue entra prima che finisca.
  > `[Stacchi: Mara neutra, Spazienzio quasi calmo] [Interrotta]`
- **Narrazione:** un paragrafo in corsivo, `*…*`, letto nella finestra senza nome né ritratto.
  > `*Il ghiaccio norvegese si scioglie piano. Da qualche parte, lontano, qualcuno sta urlando «UCCIDIAMOTI».*`
- **Messaggio sul telefono:** un paragrafo `*«…»*`. `[Telefono: Nome]` subito prima dice chi lo manda.
  > `[Telefono: combriccola]` e poi `*«Sei ancora tra i vivi? Noi siamo tutti al Dimmi Di Sì.»*`

Battute, narrazioni e messaggi possono avere una condizione davanti: si leggono solo se vale (F8).

> `[Se segno tutorial_con = mara] **Spazienzio** (fumante): MI MOLLI PER QUELLA CHE PORTA I KEBAB? AFFETTIAMOTI ALLORA!`

**Note dell'autore.** `[Regia: …]` è un comando che non si legge e non fa nulla: descrive la scena a chi la realizza. Un paragrafo che non
è nessuno dei costrutti di questo documento, e una voce di elenco fuori da una scelta, restano note dell'autore con un avviso.

## F4 — Comandi di scena

Comandi fra parentesi quadre, anche più d'uno sulla stessa riga, che cambiano la scena senza leggersi.

- **`[Sfondo: Sn …]`**: lo sfondo `Sn` del cast. Il resto è descrizione; una variante o un ripiego dello sfondo (F11) si riconosce se il
  suo nome compare a parole intere nella descrizione. Dopo «Regia:» la descrizione è una nota dell'autore.
  > `[Sfondo: S1 insegna-spenta, di notte. Regia: il marciapiede davanti al Serraglio. …]`

  Anche `Sfondo: Sn …` dentro una nota di regia cambia lo sfondo in quel punto:
  > `[Regia: Sfondo: S1 di sera. La stessa strada, una settimana dopo. …]`
- **`[Entra: …]`, `[Esce: …]`, `[Sprite: …]`**: uno sprite del cast, eventualmente seguito dalla posa; entra, esce o cambia posa.
  > `[Suono: frenata] [Entra: bici-mara]` · `[Sprite: grappino ringhia]` · `[Esce: combriccola in fuga]`
- **`[Scossa]`** scuote la scena; **`[Sfarfallio: variante]`** fa sfarfallare lo sfondo verso una sua variante.
  > `[Sfarfallio: insegna-spenta] [Entra: combriccola davanti alla porta]`
- **`[Suono: nome]`**: un suono.

## F5 — Partite

Una partita è una riga con la freccia; l'identificativo segue «Partita». Chi prende le parti del giocatore è scritto prima di
«(giocatore)», gli avversari dopo «contro», separati da virgole o da «e». Con un avversario è un duello, con due o più tutti contro tutti.

> `→ Partita 1: Mara (giocatore) contro Spazienzio`
> `→ Partita I3b: Spazienzio (giocatore) contro Duccio, Mara e Beppe`

Al posto di un nome:

- **`{segno}`**: il personaggio scritto in un segno (F8), che deve valere un personaggio del cast su ogni percorso che arriva lì.
  > `→ Partita II3: {ii3} (giocatore) contro Duccio`
- **`gli altri fra A, B e C`** (solo per gli avversari): tutti quelli dell'elenco tranne chi gioca.
  > `→ Partita 3: {tutorial_con} (giocatore) contro gli altri fra Mara, Spazienzio e Piera`
- **`a scelta fra A, B e C`** (solo per il giocatore): il giocatore sceglie il personaggio prima della partita; non è una scelta di storia.
  Servono almeno due personaggi. Con un segno davanti la scelta c'è solo se il segno non è assegnato.
  > `→ Partita II1: a scelta fra Celestina, Mara e Spazienzio (giocatore) contro Sergio`
  > `→ Partita III1: {iii1} o a scelta fra Mara, Spazienzio, Celestina, Piera e Beppe (giocatore) contro Duccio`

Dopo la vittoria i passi del nodo continuano. Dopo una sconfitta si ritenta, salvo che la partita abbia una sconfitta che apre un ramo.

- **Ritento:** `**Ritento.**` seguito da una o più battute separate da « · », mostrate a turno prima di rigiocare e sempre saltabili.
  > `**Ritento.** **Mara** (agitata): Di nuovo. Più veloce, o il suo kebab si fredda. · **Spazienzio** (fumante): ANCORA VOI? ANNICHILIAMOVI.`
- **Sconfitta che apre un ramo:** `[Sconfitta: → Nodo]` dopo la partita. Perdendo si va lì da soli, senza ritento.
  > `[Sconfitta: → I1s]`
- **Modificatori di incontro:** `[Modificatori: …]` dopo la partita. È un posto riservato (F13): la storia li nomina, il significato lo
  darà il regolamento con CA-0e.
  > `[Modificatori: ce l'hanno tutti con te]`

**Partita a catena.** Ogni personaggio in catena fa un duello contro lo stesso avversario, uno alla volta, nell'ordine che sceglie il
giocatore, senza ritento. Si vince se vincono tutti; la prima sconfitta chiude la catena e va dove dice `[Sconfitta: …]`, obbligatoria.
`[Catena: …]` scrive la regola a parole e non si legge. Ogni personaggio in catena ha una battuta dell'avversario prima del suo duello,
`[Catena, prima di X] **Avversario** (espressione): …`; una catena ne ha almeno due. Un personaggio per cui la carriera dà lo sblocco
`starter-<personaggio>` è in catena solo se l'ha preso in quel giro; gli altri ci sono sempre.

> `→ Partita III5, a catena: ogni personaggio sbloccato (giocatore), uno alla volta nell'ordine che sceglie il giocatore, contro Sergio, boss finale`
> `[Catena: si vince se tutti battono Sergio; alla prima sconfitta la catena finisce]`
> `[Sconfitta: → F3]`
> `[Catena, prima di Mara] **Sergio** (strafottente): La ciclista dei complotti. Chi ti manda stavolta, gli Illuminati o i satelliti?`

## F6 — Scelte

Il giocatore non parla mai. Le scelte sono di due modi:

- **Scelta muta** (`→ Scelta muta: …`): con chi andare. Ogni opzione comincia con «con <personaggio>», che la bacheca mostra; senza, un
  avviso.
- **Scelta per messaggio** (`→ Scelta: …`): una risposta scritta sul telefono. Ogni opzione è un messaggio `*«…»*`; senza, un avviso.

Le opzioni stanno in elenco sotto la scelta, e dopo i due punti c'è la domanda; oppure sulla riga stessa, separate da « · ».

> `→ Scelta muta: chi segui?`
> `- con Mara, a scoprire chi vuole vendere [Segno: via-atto-1 = mara] → I2a`
>
> `→ Scelta muta: con Mara [Segno: tutorial_con = mara] · con Spazienzio [Segno: tutorial_con = spazienzio]`

Un'opzione può avere `[Se …]` (è visibile solo se vale), `[Segno: …]` e `[Sblocca: …]`, e nessun altro comando. Dopo `→` la sua
destinazione (F9); dopo la destinazione, « — commento» resta libero per chi legge il markdown.

> `- *«Sticazzi di quel posto da fighetti, venite voi qui! È fantastico.»* → Fine: completata [Sblocca: carriera-principale] — il giocatore resta nel bar`

O tutte le opzioni hanno una destinazione, e la scelta chiude il nodo (dopo, solo note); o nessuna, e la scelta lascia solo segni e
sblocchi e il nodo prosegue. Su ogni percorso almeno un'opzione dev'essere visibile.

**Scelta se c'è** (`→ Scelta muta, se c'è: …`): senza opzioni visibili si salta. Non chiude mai il nodo: le opzioni con destinazione
portano lì, quelle senza proseguono fino alle uscite del nodo.

> `→ Scelta muta, se c'è: con chi sei d'accordo?`
> `- con Sergio, che crede di saper fare di meglio [Se finale Il Serraglio resta] → S2`
> `- con Spazienzio, che è contento di aver vinto [Se finale Il Serraglio resta]`

## F7 — Segni e sblocchi

- **Segno:** `[Segno: nome = valore]`, o `[Segno: nome]` per il valore «si». Un segno vale per il giro; l'ultimo assegnato prevale.
  Un segno che una partita legge come personaggio vale l'identificativo di un personaggio.
- **Sblocco:** `[Sblocca: a, b]`. Gli sblocchi sono le ricompense del giro (personaggi, carriere, modalità), che il motore darà
  all'account. Lo sblocco di un personaggio si chiama `starter-<personaggio>` (F5, la catena).
- **Con condizione:** `[Se …]` davanti a segni e sblocchi sulla stessa riga; vale per tutti quelli che seguono, e per nessun altro comando.
  > `[Se segno frase] [Segno: ii3 = beppe] [Sblocca: starter-beppe]`

**Obbligatori.** Gli sblocchi elencati in `[Carriera: …]` devono essere presi su ogni percorso che arriva a una fine completata. È la
promessa di una carriera: per esempio che il tutorial dia sempre i due starter e la carriera principale.

## F8 — Condizioni

Senza linguaggio di scripting. Atomi:

| Atomo | Vale se | Ambito |
|---|---|---|
| `segno x` | il segno x ha un valore | giro |
| `segno x = v` | il segno x vale v | giro |
| `visto N` | il nodo N è stato visto | giro |
| `vinto N` | la partita del nodo N è stata vinta | giro |
| `esplorato N` | il nodo N è stato visto in un giro qualsiasi | account |
| `finale F` | il finale F è stato visto in un giro qualsiasi | account |

`non` nega un atomo; `e` li unisce. I nodi si citano per etichetta o per titolo, i finali per nome. Un segno citato in una condizione
dev'essere assegnato da qualche parte, e con quel valore.

> `[Se non segno pista = beppe e non segno ii3 = beppe]` · `[Quando: vinto II2a e visto III4]` · `- Indizio, se esplorato Scena 4: …`

## F9 — Uscite e finali

Un nodo finisce con una scelta con destinazioni (F6) o con un'uscita:

- **`→ Vai a: Nodo`**.
- **`→ Torna a: Nodo, scelta`**: si rientra nel nodo saltando fino alla sua scelta, senza rigiocarne le partite.
  > `→ Torna a: Scena 4, scelta`
- **`→ Fine: completata`**, o **`→ Fine: completata, Nome del finale`** per una fine con nome. Un finale si cita per nome nelle
  condizioni (F8).
  > `→ Fine: completata, Disco pub`
- **Uscite condizionate:** più uscite, una per riga, con `[Se …]` in fondo; vale la prima la cui condizione vale. L'ultima può essere
  senza condizione; dopo un'uscita senza condizione non ne viene un'altra. Su ogni percorso almeno un'uscita deve valere.
  > `→ Vai a: F2 [Se segno via-atto-3 = torneo]`
  > `→ Vai a: F1`

Senza uscita né scelta con destinazioni, si passa al nodo seguente nel file; l'ultimo nodo del file deve averne una. Nessun passo dopo
l'uscita.

## F10 — Achievement

Nella sezione `## Achievement`, uno per sottosezione `### Titolo`, con:

- la descrizione, in prosa;
- `[Nascosto]`: si mostra «???» finché non compare un indizio;
- `[Quando: condizione]`: lo dà la condizione, valutata a fine nodo e a fine giro; altrimenti lo dà un passo `[Achievement: Titolo]` in un
  nodo;
- almeno un **indizio**, progressivi: `- Indizio: …` e `- Indizio, se condizione: …`; si mostra l'ultimo la cui condizione vale.

> `### Amici del Dimmi Di Sì`
> `[Nascosto]`
> `Hai preferito un Virgin Cuba Libre a sedici euro.`
> `- Indizio: Certi amici scrivono sempre al momento sbagliato.`
> `- Indizio, se esplorato Scena 4: E se alla combriccola rispondessi come vorrebbe lei?`

Un achievement citato da un passo dev'essere definito; ogni achievement dev'essere dato da un passo o da `[Quando: …]`.

## F11 — Il cast

Il cast è unico e condiviso fra le carriere; lo scrive la regia. Per il formato contano:

- **Personaggi**, per identificativo: il nome mostrato, gli **alias** (altri nomi con cui compare nella finestra), le **espressioni** con
  un ritratto, le **espressioni future** (previste ma senza ritratto: usarle è un errore che lo dice) e i **ripieghi**: un'espressione
  scritta senza ritratto si mostra come quella dichiarata, con un avviso; `*` vale per ogni espressione che manca (un ritratto
  segnaposto). Un'espressione senza ritratto e senza ripiego è un errore. Una **figura in ombra** non ha espressioni.
- **Sfondi** `S1`, `S2`, …: un'immagine di base, le **varianti** (altre immagini) e i **ripieghi** (un'ambientazione senza immagine, come
  «di notte», si mostra come una variante o come l'immagine di base, con un avviso).
- **Sprite**, per identificativo, con le loro **pose**.

Velocità del testo, animazione, bocca, misure e posizione degli sprite sono nel cast ma non sono del formato: le decide la scena di
dialogo (CA-0g). Un cambio del cast non cambia la versione del formato (F12).

## F12 — Il controllo

Una carriera è valida se il controllo non trova errori; gli avvisi si leggono ma non la fermano. Il controllo esplora tutti gli stati
raggiungibili di un giro (nodo, segni e nodi visti, partite vinte e perse, sblocchi e achievement presi) con le condizioni valutate davvero.
Gli atomi dell'account (`esplorato`, `finale`) valgono «forse»: si seguono tutte e due le strade. Il tetto è di **200 000 stati**:
superarlo è un errore, e la storia va semplificata o il tetto rivisto con una nuova versione del formato.

**Errori,** oltre a ogni riga che non rispetta F1–F11: nodi doppi o non raggiungibili; destinazioni, nodi, finali, segni, personaggi,
espressioni, sfondi e sprite sconosciuti; vicoli ciechi (uno stato da cui non si arriva a nessuna fine, anche entrando in un nodo la cui
condizione non vale); nessuna fine raggiungibile; scelte senza opzioni visibili e nodi senza uscita valida su qualche percorso; un
obbligatorio non preso su qualche percorso fino a una fine completata; una partita che legge un segno non assegnato su qualche percorso;
un personaggio di una catena assente su qualche percorso; un achievement senza percorso o mai definito.

**Avvisi:** ripieghi del cast; note dell'autore non riconosciute; espressioni scritte per figure in ombra; segnaposto sconosciuti; opzioni
senza «con <personaggio>» o senza messaggio; una battuta con condizione che non si vede mai; un indizio che non può mai comparire; un nodo
raggiunto solo perdendo che non è segreto (salvo una scena finale); una tasca che si raggiunge anche senza perdere, o mai perdendo.

## F13 — Versioni

- **Versione del formato** (questo documento): cambia con ogni modifica a un costrutto, al suo significato, alle garanzie del controllo
  (un avviso che diventa errore, il tetto) o alla parte del cast che il formato usa. Si aggiorna prima il documento, con la motivazione,
  poi lo strumento e le storie nella stessa modifica, come per il regolamento. Il formato passa alla 1.0 quando il gioco legge le carriere
  (CA-0f e CA-0g).
- **Versione di una carriera:** cambia quando cambia la storia (battute, nodi, segni, sblocchi, achievement) o il cast che usa. La porta il
  pacchetto della carriera (CA-0d), con il formato a cui si attiene; il markdown non la dichiara.
- **Posti riservati:** i **modificatori di incontro** (`[Modificatori: …]`, F5) si scrivono e si controllano solo come nomi; il loro
  significato e la loro precedenza arrivano con CA-0e, nel regolamento, e allora il formato cambia versione.

## Revisioni

- **0.1 — 21 novembre 2026, CA-0b:** prima versione, proposta. Descrive i costrutti che il convertitore del prototipo CA-0a accetta sul
  tutorial e sulla campagna principale con i dialoghi veri, e le garanzie del suo controllo del grafo. Ciò che il prototipo accetta ma
  nessuna storia vera usa resta fuori, in attesa della decisione del proprietario (rapporto di CA-0b). Motivazione: una carriera
  diventa un pacchetto con una versione che uno strumento valida e il gioco legge (piano CA-0, DC4).

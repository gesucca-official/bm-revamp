# Carriere — prototipo CA-0a

> Documento del primo pezzo di CA-0 anticipato ([D22](../../product-roadmap.md#decisioni-del-proprietario)), scritto l'11 novembre 2026.
> **Lo stato sta nella riga di CA-0a della tabella dei [lavori anticipati](../../product-roadmap.md#lavori-anticipati)**, non qui; questo
> documento dice cosa si costruisce, come e cosa giudica il proprietario. Senza valore normativo: le carriere giocabili passeranno dal loro
> documento con versione, come i set.

## Obiettivo

Provare, prima che esista nel client, come funziona una carriera: **la struttura a rombi**, con scelte, segni, condizioni, sconfitte che
aprono un ramo e nodi segreti, e **le scene di dialogo** con il materiale vero del tutorial. Il valore che resta è **il formato dei dati
delle carriere**, con il convertitore dalle storie in markdown e il controllo automatico del grafo: sono il cuore di
[CA-0](../../product-roadmap.md#ca--carriera-single-player) e potranno passarci quasi tali e quali. Il resto, interfaccia compresa, è usa e
getta.

## Perimetro

**Dentro:**

1. **Formato dei dati** di una carriera: nodi (scene e partite), archi (scelte con chi andare, risposte ai messaggi, vittoria e
   sconfitta), segni lasciati dalle scelte, condizioni sui nodi e sugli archi, battute con chi parla, espressione, testo e regia,
   sblocchi (starter, PvP), achievement con indizi progressivi. Con un controllo di validità dello schema.
2. **Convertitore** dalle storie scritte nel [formato markdown delle scene](README.md#come-si-scrivono-le-scene) ai dati: il proprietario
   continua a scrivere in markdown. Primo banco di prova: [tutorial-dialoghi.md](tutorial-dialoghi.md), senza riscriverlo a mano.
3. **Lettore di scene** con gli asset approvati in `docs/design/carriere/asset/tutorial/`: sfondo, un personaggio alla volta, finestra di
   dialogo, testo che scorre con velocità per personaggio, stacchi su chi ascolta e interruzioni (la regia di Piera), fuori campo,
   notifica sul telefono, `{giocatore}` sostituito, sprite (bici, Grappino, combriccola) posati alla scala della
   [specifica](specifica-asset.md), varianti di sfondo, salto della battuta e della scena, ritorno alla scelta quando si ritenta.
   Orizzontale e verticale, come le composizioni di prova.
4. **Mappa dei rami:** la struttura a rombi della carriera, con i nodi visti, quelli disponibili e quelli ancora «???», da cui si sceglie
   dove andare; un nuovo giro azzera la storia e conserva i rami esplorati.
5. **Partite simulate:** al posto della partita, i pulsanti «vinci» e «perdi».
6. **Una mini-carriera di prova a rombi,** 6–8 nodi con battute segnaposto della regia e gli asset del tutorial, che mostri: rami che si
   dividono e si riuniscono; una scelta che ne esclude un'altra; un segno che cambia una battuta più avanti; una sconfitta che apre un ramo;
   un nodo segreto raggiungibile solo da un certo percorso; uno sblocco presente su ogni percorso; un achievement con il suo indizio.
7. **Controllo del grafo,** un comando come `check-rules.py`: ogni nodo raggiungibile, nessun vicolo cieco, gli sblocchi su ogni
   percorso, ogni nodo segreto e ogni achievement con almeno un percorso. Gira sul tutorial e sulla mini-carriera.

**Fuori:** partite vere e motore di gioco, server e account (il progresso può stare nel browser), audio, ritratti o asset nuovi,
rifinitura grafica, deploy, qualsiasi file di `client-web`, `client-debug`, `server`, regolamento e documenti di set.

## Come

- **Cartella propria,** `prototipi/carriere/` alla radice del repository, come fu il laboratorio di C0.
- **Stesso stack del client** e stesse versioni: TypeScript 5.9.3, React 19.3.1, Vite 8.3.5; lo stesso Node isolato di C0 e del client
  (`./client-c0/run.ps1 -Task Bootstrap`), con dipendenze proprie e un `run.ps1` sul modello di quello di `client-web`, che installa anche
  senza rete dalla cache di npm.
- **Gli asset non si copiano:** il prototipo li legge da `docs/design/carriere/asset/tutorial/`.
- **Test unitari** per convertitore, schema e controllo del grafo, come quelli di `client-web` (`node --test`).
- **Per provarlo sul telefono:** server di sviluppo raggiungibile dalla rete locale, come per le prove del client.

## Fasi

**Fase A, proposta e STOP.** Il formato è una scelta che resta, quindi prima si propone:

- il formato dei dati, con lo schema e un esempio: le scene 0 e 1 del tutorial convertite, e i nodi della mini-carriera;
- come si scrivono nel markdown i pezzi che oggi mancano: condizioni, segni, sblocchi, achievement, nodi e archi della mappa;
- il grafo della mini-carriera, disegnato, con cosa dimostra ogni nodo;
- l'elenco delle schermate del prototipo e cosa si vede in ognuna;
- come si installa e si avvia, e le verifiche.

Nessun codice dell'interfaccia in Fase A; è ammesso un abbozzo del convertitore se serve a mostrare che il formato regge sul tutorial vero.

**Fase B, costruzione,** dopo il via sulla Fase A. **Delega del proprietario (11 novembre 2026):** «dallo te a una tua sottosessione, così
gestisci anche la sua fine e avvii la fase b in autonomia». La regia avvia la Fase A in una sessione collegata, ne rivede la proposta nel
repository e dà lei il via alla Fase B; al proprietario restano solo le domande che toccano il suo gusto o le sue scelte (come si scrive il
markdown, cosa dimostra la mini-carriera), e il giudizio sul prototipo finito.

## Cosa giudica il proprietario

- **In Fase A:** se il formato è comodo da scrivere (il markdown resta suo) e se la mini-carriera dimostra quello che serve.
- **In Fase B:** il prototipo usato, su PC e su telefono: se la mappa fa capire dove si è e cosa manca, se le scene «si leggono» come una
  visual novel, se il ritmo del tutorial regge, se le scelte e la sconfitta che apre un ramo funzionano come se le immagina.

## Fase C, ritocchi dopo la prova

Avviata dalla regia l'11 novembre 2026, dopo la [prova del proprietario](prototipo-fase-b.md#prova-del-proprietario) («la direzione è
giusta»), nella stessa sessione delle fasi A e B. Due parti:

1. **Ritocchi diretti**, decisi dalla regia sulle impressioni del proprietario:
   - finestra di dialogo più bassa, al più tre righe: circa il 20% dell'altezza in orizzontale e il 22% in verticale (la
     [specifica](specifica-asset.md#come-appare-la-scena) si aggiorna di conseguenza);
   - carattere dei dialoghi più grande e con più personalità: due o tre font liberi (SIL OFL), salvati in locale, da confrontare nel
     prototipo con un selettore, per la scelta del proprietario sul telefono (candidati: Shantell Sans, Patrick Hand, Comic Neue);
   - ritratti più grandi in verticale, circa il 75% dell'altezza;
   - stacchi su chi ascolta Piera che restano fino al tocco, con una durata minima;
   - pulsanti più grandi sul telefono (almeno 48 px), con le azioni principali in basso;
   - meno incroci fra gli archi della mappa.
2. **La [bacheca a lettere](bacheca.md)**, scelta dal proprietario per la mappa e per l'aspetto generale: prima un **bozzetto statico** della
   mappa a metà giro, nei due orientamenti, da far giudicare al proprietario; la mappa intera e il resto dell'aspetto solo dopo il suo via.

## Fase D, la mappa vera come bacheca

Avviata dalla regia l'11 novembre 2026 dopo il [secondo giudizio](prototipo-fase-c.md#giudizio-del-proprietario-secondo-giro) del
proprietario sul bozzetto («io partirei a fare la mappa vera»), nella stessa sessione delle fasi precedenti. Il font dei dialoghi si sceglie
alla fine del prototipo.

1. **La mappa vera diventa la [bacheca](bacheca.md),** al posto della mappa a caselle, nei due orientamenti e per tutte e due le carriere:
   si tocca un nodo disponibile per entrare, «Continua» resta, tutti gli stati dei nodi e delle cordicelle come nel bozzetto, intestazione,
   finali come «piatti del giorno», legenda. Il bozzetto statico si toglie.
2. **Più tridimensione,** come chiede il proprietario:
   - **cordicelle che penzolano** con la loro gravità (più lunghe, più pendenti) e proiettano un'ombra sul feltro; tese per il percorso fatto;
   - **puntine più 3D,** con un'ombra portata calcolata dal client; disegnate dal codice finché non arrivano le
     [immagini generate](prompt-bacheca.md), poi sostituite, con la possibilità di ricolorare quelle di plastica;
   - **macchie più grandi e parti consunte:** aloni di vino più ampi, feltro spelacchiato e schiarito in alcune zone, sempre in posizioni
     fisse decise dai dati.
3. **La cornice generata** al posto di quella disegnata, tagliata in nove fette, quando arriva.
4. **Prestazioni sul telefono:** la bacheca è un disegno SVG con filtri; la mappa si apre spesso, quindi va misurato il tempo di apertura e,
   se serve, il fondo fisso (feltro, scanalature, macchie) si disegna una volta sola in un'immagine.

## Fase E, font, finestra e ritratti animati

Avviata dalla regia il 12 novembre 2026 dopo il [giudizio del proprietario sui ritocchi della mappa](prototipo-fase-d.md#giudizio-del-proprietario-sui-ritocchi).

1. **Font più squadrati e «violenti»:** da quattro a sei font SIL OFL in più nel campionario, dallo stesso repository di Google Fonts, con
   le accentate italiane: squadrati, pesanti, da lettering di fumetto d'azione o consumati, sempre leggibili sul telefono. Fra questi almeno un
   lettering da fumetto tutto maiuscolo, che è la convenzione dei fumetti (Spazienzio urla già in maiuscolo). La scelta resta del proprietario.
2. **Finestra di dialogo più compatta:** alta quanto il testo che contiene, non una fascia fissa; in verticale niente spazio vuoto sotto il
   testo, e i pulsanti della scena non devono aggiungere altra fascia. La [specifica](specifica-asset.md#come-appare-la-scena) si aggiorna.
3. **Ritratti animati senza un asset per fotogramma.** La strada proposta dalla regia, in ordine di costo:
   - **movimento procedurale sull'immagine che c'è già,** zero asset: respiro (lieve allungamento verticale), piccolo sobbalzo a ogni parola
     mentre il testo scorre, e un movimento per espressione (tremito per «furioso», ondeggiare lento per Piera «brilla», scatti nervosi per
     Mara «agitata», ingresso con rimbalzo quando cambia espressione), con lo schiacciamento e l'allungamento tipici del fumetto;
   - **deformazione a maglia di un'unica immagine,** sempre zero asset: la testa che annuisce o si inclina e il busto che respira, piegando
     l'immagine con pochi punti di controllo, come fanno gli strumenti di animazione 2D a ritaglio. Da provare su un personaggio solo, per
     vedere se regge lo stile inchiostrato senza sembrare gomma;
   - **solo se servono dopo la prova:** pochi ritagli generati per la bocca aperta o gli occhi chiusi, sovrapposti al ritratto, da chiedere
     con un giro di prompt.
   Il proprietario sceglie dopo averle viste; il movimento si spegne con la preferenza di movimento ridotto.

## Fase F, rifinitura finale

Avviata dalla regia il 12 novembre 2026 dopo il [giudizio del proprietario sulla Fase E](prototipo-fase-e.md#giudizio-del-proprietario).

1. **Font dei dialoghi: Russo One,** scelto dal proprietario, «un po' meno grassetto». Russo One ha un solo peso: si prova ad alleggerirlo
   (per esempio con un contorno del colore della finestra che assottiglia il tratto) e si mettono accanto uno o due font liberi dalla stessa
   famiglia di forme con più pesi (squadrati, con un asse del peso), per la scelta finale. Gli altri font si tolgono dal prototipo.
2. **Animazioni a seconda dei casi:** la maglia diventa il modo normale per tutti i personaggi, ciascuno con i suoi punti di controllo; il
   movimento procedurale resta per i casi in cui serve, più morbido (meno rimbalzi e scatti), e l'ondeggiare di Piera brilla resta com'è.
   Il cast dice, per personaggio ed espressione, quale si usa.
3. **Bocca che si apre e si chiude** quando il personaggio parla, alternando il ritratto con la sua versione «bocca»
   ([prompt](prompt-bocche.md)) al ritmo del testo, sotto la maglia e il movimento; se la seconda versione cambia anche fuori dalla bocca,
   si prende solo la zona della bocca con una maschera. Gli stacchi su chi ascolta Piera usano le nuove espressioni esasperate. Finché le
   immagini non ci sono, il lettore funziona come oggi.
4. **Spazienzio in verticale** più in alto rispetto allo sfondo: misura e correzione per personaggio nel cast.
5. **Finestra di dialogo ad altezza fissa di due righe:** le battute più lunghe si dividono in pagine da due righe, che si avanzano con un
   tocco, come nelle visual novel. La [specifica](specifica-asset.md#come-appare-la-scena) si aggiorna.

## Fase G, la bacheca si muove

Avviata dalla regia il 12 novembre 2026 sulla richiesta del proprietario nel [giudizio sulla Fase F](prototipo-fase-f.md#giudizio-del-proprietario)
(«la mappa sembra un po' statica… non troppo se no disturba»), con le idee che ha scelto fra quelle proposte dalla regia: «partiamo dalle mie
più la 3 e la 4».

1. **Fili che oscillano** (idea del proprietario): un ondeggiare lento delle cordicelle che penzolano, come per la corrente della porta; si
   agitano di più quando si tocca un nodo o quando la puntina «sei qui» si sposta. Le cordicelle tese oscillano poco o niente.
2. **La lettera che cade** (idea del proprietario): ogni tanto una lettera allentata tremola, poi cade e finisce in fondo alla cornice; il
   giocatore la rimette al suo posto trascinandola. Al più una lettera allentata per volta, mai durante un'azione, scelta in modo ripetibile
   dai dati; la lettera rimessa a posto resta a posto. *Variante della regia, da confermare:* un achievement nascosto per chi le rimette a
   posto tutte.
3. **La puntina «sei qui» che viaggia:** quando si arriva a un nodo nuovo, la puntina rossa si stacca dal nodo di prima, passa sopra il feltro
   con la sua ombra e si ripianta con un piccolo colpo; la cordicella nuova si tende dietro di lei.
4. **Il post-it che si stacca:** quando si scopre un nodo «???», il suo post-it si stacca e cade, e sotto compaiono le lettere del titolo.

Tutto si spegne con il movimento ridotto del sistema, niente si muove mentre il giocatore legge o sceglie, e il movimento non deve pesare
sull'apertura della mappa misurata nella [Fase D](prototipo-fase-d.md#prestazioni-sul-telefono).

## Fase H, fluidità, entrate e bacheca viva

Avviata dalla regia il 12 novembre 2026 dopo il [giudizio del proprietario sulla Fase G](prototipo-fase-g.md#giudizio-del-proprietario).

1. **Banco della fluidità,** come chiede il proprietario: uno strumento che registra le scene e la bacheca a frequenza piena, nei due
   orientamenti e con la CPU rallentata, e controlla da solo i fotogrammi: fotogrammi in cui il ritratto manca o lampeggia, salti di
   posizione, contorni scuri attorno alle figure, zona della bocca che non combacia, fotogrammi lunghi. Dà un rapporto con numeri e
   fotogrammi incriminati, e si rilancia dopo ogni correzione finché i difetti sono a zero. Resta per CA-0, come le altre verifiche.
2. **Bocche:** con il banco, eliminare gli sfarfallii e il contorno nero che compare in qualche fotogramma di Mara. Le due immagini da
   rifare ([prompt](prompt-bocche.md#secondo-giro)) arrivano a parte; il prototipo deve reggere anche prima.
3. **Entrate e uscite dei personaggi:** niente più comparse di colpo. Il personaggio entra e esce di scena da un lato o arrivando da lontano
   (piccolo che cresce, con una leggera sfocatura che si toglie), e il cambio di espressione non deve lampeggiare. Il modo si sceglie per
   scena con un comando di regia nel markdown, con un valore normale nel cast.
4. **Bacheca viva:** l'achievement per chi rimette a posto le lettere si accende; si aggiungono le altre idee proposte dalla regia e
   approvate dal proprietario: un angolo di post-it che ogni tanto si solleva e ricade, una mosca che ogni tanto passeggia sul feltro e vola
   via (o si schiaccia) se toccata, l'ombra delle lampade del bar che scorre piano sulla bacheca. Sempre poco, mai mentre si legge o si
   sceglie, spento con il movimento ridotto.
5. **Font di bottoni e cartoncini:** via la scrittura a mano «tipo Comic Sans» da pulsanti, schede, legenda e notifiche; al suo posto
   Russo One alleggerito, il font scelto per i dialoghi, oppure, per i cartoncini scritti a mano, un pennarello meno tondo, da far giudicare.

## Fase I, Piera lenta, teste più ferme, nodi strappati

Avviata dalla regia il 12 novembre 2026 dopo il [giudizio del proprietario sulla Fase H](prototipo-fase-h.md#giudizio-del-proprietario).

1. **Piera estremamente lenta:** parla lentamente, e così si muove. Tutte le sue animazioni rallentano molto: l'ondeggiare di Piera brilla,
   la maglia, il ritmo della bocca, le entrate e le uscite. Un fattore per personaggio nel cast, nello stesso spirito della `velocita` del
   testo, che per gli altri resta 1.
2. **Testa meno deformata:** l'oscillazione della testa nella maglia distorce troppo; si limita l'ampiezza della piega, per tutti, perché
   la testa ondeggi senza sembrare di gomma. Il banco della fluidità resta a zero difetti.
3. **Nodi chiusi strappati o accartocciati:** un nodo non più raggiungibile in questo giro non è più solo segnato come chiuso. Il suo
   cartoncino o post-it si strappa un poco (un angolo o un bordo lacerato, un pezzo che manca) oppure si accartoccia (pieghe, ombre, un
   poco rimpicciolito). Lo strappo si vede quando un nodo si chiude e poi resta; un nuovo giro rimette la carta intera. Sempre poco, spento
   con il movimento ridotto, come il resto della bacheca.
4. **Pulsanti della bacheca in verticale:** le etichette non devono tagliarsi (oggi «Achieve…», «Nuovo g…»).

## Fase J, due in scena, solo di lato, strappi più netti

Avviata dalla regia il 12 novembre 2026 dopo il [giudizio del proprietario sulla Fase I](prototipo-fase-i.md#giudizio-del-proprietario).

1. **Due in scena durante gli stacchi:** quando qualcuno reagisce mentre Piera parla, Piera non esce. Si sposta di lato e chi reagisce
   entra dal suo lato e le resta a fianco. Proposta della regia, da far giudicare al proprietario:
   - chi reagisce resta in scena finché dura la tirata di Piera, poi esce dal suo lato;
   - chi parla è in piena luce, l'altro un poco più scuro e indietro;
   - si muove solo la bocca di chi parla;
   - in verticale i due si sovrappongono un poco, con chi parla davanti;
   - niente ritratti specchiati, perché i ritratti sono asimmetrici.

   Lo stesso vale, in generale, per ogni stacco di regia su chi ascolta. La [specifica](specifica-asset.md#come-appare-la-scena), che oggi
   dice «un personaggio alla volta», si aggiorna.
2. **Si entra solo di lato:** via l'entrata «da lontano» che cresce. Chi compare per parlare arriva di lato, sempre; il comando
   `[Entrate: …]` e le sue due righe nelle storie si tolgono, o restano solo per lato e stacco se servono ancora.
3. **Nodi chiusi strappati in più punti, con la scritta grigia:** il post-it di un nodo non più raggiungibile è strappato in due o tre punti
   e il «???» diventa grigio. Via l'accartocciato.

## Fase K, ultimi ritocchi e chiusura

Avviata dalla regia il 12 novembre 2026 dopo il [giudizio del proprietario sulla Fase J](prototipo-fase-j.md#giudizio-del-proprietario).
È l'ultima fase: con questi ritocchi il proprietario considera il prototipo riuscito.

1. **Sempre a fuoco chi parla.** Il valore di `?fuoco=parla` diventa quello normale e la scelta si toglie.
2. **Chi reagisce più piccolo e defilato.** Il personaggio che reagisce sta più verso il bordo, ed è più piccolo di chi parla anche a parità
   di inquadratura: oggi Mara, inquadrata più da vicino, sembra più grande di Piera. Le misure si prendono dalla testa, non dall'immagine, e
   la [specifica](specifica-asset.md#come-appare-la-scena) si aggiorna.
3. **Il filo che resta sospeso.** Quando la puntina di un nodo si toglie, il filo che vi era legato non resta a mezz'aria. Soluzione
   proposta dal proprietario: il capo libero cade, penzola, e la puntina rossa «sei qui» lo riprende. L'esecutore può proporne un'altra
   se regge meglio, ma nessun filo deve finire legato al nulla.
4. **I nodi affrontabili si leggono.** I nodi che il giocatore può affrontare subito mostrano il loro nome sulla bacheca, già prima di
   esserci stati, e il pulsante dice «Continua verso» con il nome vero. Il post-it «???» resta solo sui nodi più lontani. Il post-it si
   stacca quando il nodo diventa affrontabile, non più quando ci si arriva; il [concetto della bacheca](bacheca.md) si aggiorna.
5. **Chiusura del prototipo:**
   - via i font di prova (Russo One pieno, Changa, Oxanium) e le scelte di confronto che non servono più (`?fuoco`, `?testa=larga`,
     `?cartoncini=russo`);
   - restano gli interruttori di prova delle cose rare (`?mosca`, `?angolo`, `?allenta`) e il banco;
   - una sezione di chiusura, in questo documento, che dice cosa passa a CA-0 (formato e convertitore, controllo del grafo, banco della
     fluidità, misure della scena e della bacheca, lezioni sulle immagini e sulle bocche), cosa si butta, e cosa resta aperto: le due
     immagini del [secondo giro delle bocche](prompt-bocche.md#secondo-giro) e la prova su un telefono vero.

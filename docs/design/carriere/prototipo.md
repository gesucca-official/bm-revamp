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

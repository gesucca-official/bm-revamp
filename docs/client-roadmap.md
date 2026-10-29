# Roadmap del client web animato

**29 ottobre 2026 — versione 23. C0, C1 e C2 sono chiuse; la prossima tappa è
C3, pianificata nel [piano C3](client-c3-plan.md).** Stato corrente in sintesi nell'[indice della documentazione](README.md#stato-corrente);
esiti nei rapporti [C0](reports/client-c0-r2-report.md), [C1](reports/client-c1-report.md)
e [C2](reports/client-c2-report.md). Questa pagina tiene criteri e attività delle
tappe, osservazioni [O1–O14](#osservazioni-del-proprietario-dopo-c1) e
[O15–O18](#osservazioni-della-prova-umana-b-c2b-7) e decisioni aperte; le revisioni
1–20 sono [archiviate](history/client-roadmap-revisions.md). Obiettivo: permettere a giocatori umani di
provare Botte Micidiali attraverso un client leggibile, rapido e piacevole,
con tavolo e carte animati. Le funzionalità finali saranno le stesse del
client debug; il web sarà la base riutilizzabile per eventuali client dedicati.

Il proprietario ha respinto la prima grafica e ha poi **approvato come
riferimento visivo [duello, FFA cinque e carta/ispezione R1](design/client-c0/r1/approval.md)**.
Sono identificati dall'inventario R1; gli asset precedenti restano esclusi.
La [revisione del tavolo del bar](design/client-c0/bar-table-revision.md) è
ora implementata in [una sola scena sintetica](../client-c0/revision/README.md),
con PixiJS/TypeScript per il tavolo e React/HTML per shell e dettagli.
Duello e FFA sono configurazioni della stessa scena, senza collegamento al server.

**C0 è chiusa** (27 ottobre 2026), con deroga sulla risposta al tocco e
landscape forzato: [esiti C0-R5](reports/client-c0-r5-procedure.md#esiti),
[rapporto ed evidenze](reports/client-c0-r2-report.md). **C1 è chiusa** in
[client-web](../client-web/README.md) (27 ottobre 2026) e **C2 è chiusa**
(29 ottobre 2026): dettagli nelle rispettive sezioni sotto.
`client-c0/revision` resta congelata come evidenza del gate C0.

La [checklist P01–P44](client-c0-parity.md) e il [contratto delle interazioni](design/client-c0/interaction-contract.md)
sono state le basi di C1–C2. Il [primo rapporto](reports/client-c0-report.md)
e il laboratorio Angular sono evidenze storiche della scena respinta.
Il [regolamento 1.8](game-rules.md) rimane la fonte normativa (1.8, C2b-4: nessun «/» nell'identificativo dei mazzi). Il rifacimento
non cambia regole né effetti; per decisione del proprietario su O14 il catalogo
ha due campi descrittivi (ruolo e guadagni, R07a), esposti dal server e copiati
nelle regole del debug. La base I22
resta [approvata e archiviata](roadmap.md); C0–C5 non riaprono gli incrementi storici differiti.

## Base effettiva e fonti

La ricognizione del 26 ottobre comprende [istruzioni](../AGENTS.md),
[contributi](../CONTRIBUTING.md), [preparazione precedente](history/client-roadmap-preparation.md),
[setup](setup.md), [decisioni](open-questions.md), [API](api.md),
[archivio](match-archive.md) e [report I22](reports/i22-report.md), confrontati
con i sorgenti correnti. I report attestano la base storica; non certificano
l'esperienza del futuro client animato.

Il client grafico collegato al gioco resta [client-debug](../client-debug/README.md):
Angular 11.2, TypeScript 4.1, RxJS 6, SockJS e STOMP, con Node 12 fissato dalla
[toolchain](../scripts/toolchain.json). Le route sono home, rules, hub e
sign-up: Phaser, route `/phaser` e relative dipendenze sono stati rimossi.
La [CLI](cli.md) è disponibile per scenari applicativi, senza interfaccia
grafica. Non esistono client dedicati desktop o mobile.

Il debug usa schede Material, carte in pannelli espandibili, menu per bersaglio
e scarto, messaggi e finestre di riepilogo con Continue e Log JSON. Il gioco è
utilizzabile, ma leggere finestre sequenziali interrompe il tavolo; effetti,
stati e decisioni sono presentati soprattutto come dati. Le fonti operative
sono [hub](../client-debug/src/app/user-hub/user-hub.component.html),
[partita](../client-debug/src/app/client-debug/debug-client.component.ts),
[carta in mano](../client-debug/src/app/client-debug/card-in-hand/card-in-hand.component.ts)
e [trasporto](../client-debug/src/app/service/websocket.service.ts).

L'identità visiva R1 è approvata come riferimento. **Gli asset storici sono esclusi dal
nuovo client**, su indicazione del proprietario: non costituiscono riferimenti
artistici né materiali da recuperare. Restano nei file della base; il nuovo
percorso usa risorse selezionate ex novo. I mockup R1 sono immagini nuove
generate con imagegen; i precedenti schizzi e asset non sono stati usati come input.

## Perimetro e parità funzionale

La prima partita completa è una consegna intermedia; la roadmap si completa
soltanto con la parità dell'intero client debug. Le schermate possono cambiare,
ma ogni operazione esistente deve avere un equivalente raggiungibile. I tool
diagnostici restano in una sezione secondaria, senza occupare il tavolo.

| Area | Funzionalità da mantenere e confini | Tappa di parità |
|---|---|---|
| Home e regole | Presentazione, navigazione, collegamenti informativi/contatto/sostegno esistenti, consultazione del regolamento vigente. Correggere la copia informativa obsoleta sui diritti secondo README/CONTRIBUTING. | C2 |
| Accesso e registrazione | Login, caricamento profilo, errori, sessione unica, logout; form registrazione, disponibilità username/email, codice e invio registrazione sui servizi esistenti. Il profilo locale ha email disabilitata: mantenere il percorso e l'errore di indisponibilità, senza promettere onboarding pubblico. | Login C1; restante C2 |
| Hub e presenza | Elenco utenti e attività, conteggio, ordinamento/paginazione equivalenti; ingresso, attesa, errori e uscita dalle code. | C2 |
| Modalità | Quick 1vCom, quick 1v1, quick FFA, open 1vCom con scelta del mazzo salvato; elenco FFA, aggiunta bot e avvio anticipato con almeno due iscritti. FFA parte a cinque; niente open PvP o lobby privata nuova. | Quick 1vCom C1; tutte C2 |
| Catalogo e mazzi | Consultazione carte/personaggi ed effetti, immagini sostitutive; elenco, creazione, modifica, annullamento, salvataggio/sovrascrittura e cancellazione mazzi; ricerca e gestione copie/slot già presenti. R02, senza nuovi vincoli 20+2, limiti copie o filtri di compatibilità bound. | C2 |
| Partita | Mano privata; personaggi, risorse, oggetti, stati, timer e immunità; bersaglio, scarto bound, proprietario/oggetto; invio, rifiuto, pending, risoluzione e fine turno. Distinguere personaggio, azione, oggetto, token ed equip. | C1; FFA C2 |
| Ciclo di vita | Clock, forfait, abbandono, disconnessione e rientro con lo stesso account, pending conservata, esiti e ritorno all'hub; ricevuta privata di draw al riavvio anche senza vista. | C2 |
| Diagnostica | Equivalenti di Log Card, Log State, Log Item, Log JSON e simulazione disconnessione; stessi dati consentiti, con accesso secondario esplicito. Riepiloghi mosse/fine turno consultabili senza finestre obbligatorie. | C1–C2 |
| Profilo e amministrazione | Lettura username/email/ruolo; per ADMIN conteggio log partite/client, elenco partite non concluse, download e cancellazione log con conferma. Conservare la separazione fra account di gioco e HTTP Basic amministrativo configurato; niente console amministrativa nuova. | C2 |
| Log client | Conservare segnalazione errori/ingestione esistenti e protezione delle credenziali nei log. I log legacy non coincidono con l'archivio eventi delle partite. | C2 |

Per riferimenti: [selezione modalità](../client-debug/src/app/connection/choose-game/choose-game.component.html),
[editor](../client-debug/src/app/user-hub/collection/edit-deck/edit-deck.component.html),
[registrazione](../client-debug/src/app/connection/sign-up/sign-up.component.ts),
[pannello admin](../client-debug/src/app/user-hub/admin-control-panel/admin-control-panel.component.ts).
La parità comprende anche questi percorsi condizionati dalla configurazione;
non richiede di rendere SMTP o account amministrativi disponibili per default.

Fuori perimetro: nuove modalità, pass umano, modifiche ai mazzi o alle carte,
bot diverso, Elo, economia, premi, recupero password, cronologia persistente,
replay utente, spettatori, hosting pubblico e sviluppo dei client dedicati.
L'export archivio esiste nel server/CLI ma non nella UI debug corrente:
riusarlo per le evidenze tecniche non implica aggiungere una nuova funzione UI.

## Contratti disponibili e lacune

Il server Spring rimane autorevole. Il proxy locale espone `/rest` e `/ws`
verso `/api/rest/v1` e `/api/ws/v1`; REST valida l'accesso, CONNECT STOMP usa
login/passcode e non un token REST. Il client deve continuare a consumare le
destinazioni private `/user/queue/...`, senza accedere alle mani avversarie o
all'ordine dei mazzi. Le sezioni storiche di API/architettura contengono
diagnosi superate: per esempio `dead`, `bindingName`, `turn`, autorizzazioni e
resume sono presenti nel codice corrente.

| Bisogno della UX | Capacità effettiva | Conseguenza per il piano |
|---|---|---|
| Tavolo e mano | `ClientGameView`: players, mano propria completa e conteggi altrui, personaggio, oggetti, risorse, stati, immunità e timer. | Sufficiente per il tavolo 2D e i dettagli carte, senza nuovo motore delle regole nel client. Mostrare anche valori negativi e oltre quelli iniziali. |
| Scelta e conferma | `/app/game/{gameId}/move` accetta nomi carta, player/target/game e `choices` con `DISCARD_ONE`/`TARGET_ITEM`. Notifica move testuale; rifiuto su `/user/queue/illegalMove`; richiesta privata view. | Separare selezione locale, invio in corso e accettazione. Pending propria o avanzamento turno confermano il risultato; il solo SEND non basta. Nessuna sostituzione della mossa accettata o ritrasmissione cieca dopo drop. |
| Animazioni del round | `resolvedMoves` ordinate, `moveReport` testuali, `timeBasedEffects`, vista finale. `/topic/game/{id}/update` segnala di rileggere la vista. | Si possono animare carta/autore/bersaglio e risultato complessivo verificato. Mancano eventi strutturati con tutti gli stati intermedi: niente calcolo locale degli effetti o parsing fragile delle frasi per inventarli. |
| Coerenza degli aggiornamenti | `turn` e `gameId` disponibili; nessuna revisione monotona della vista o ID univoco per ogni evento UI. Le viste dello stesso turno possono avere pending/clock diversi. | Applicare gli aggiornamenti dello stesso turno, evitare doppie animazioni del round, ignorare callback di vecchie connessioni. Se manca un round dopo reconnect, mostrare lo stato attuale senza ricostruirlo. Valutare revisioni/eventi solo se i casi reali ne dimostrano la necessità. |
| Carte e oggetti duplicati | Comandi identificati per nome, senza ID di istanza esposto; le copie esistono nei mazzi. | Chiavi locali per la sola resa grafica, senza cambiare il comando. Non promettere di selezionare una specifica copia identica distinguibile solo dal client; verificare il comportamento dei duplicati in C0. |
| Clock e ripresa | `moveDeadlines`, `reconnectDeadlines`, `pendingMove`, `forfeits`, `outcomeReason`; `/app/session/resume`, queue/leave/logout e ricevuta restart senza `view`. | Il clock server continua durante animazioni e drop. Epoch disponibili, ma nessun campione esplicito dell'ora server nella vista: countdown indicativo, nessun esito deciso localmente; valutare una misura dello scarto orario prima di promettere precisione. |
| Nessuna mossa valida | R03 dichiara il limite umano; il pass del bot non è un comando umano affidabile. | Spiegare l'assenza di azioni disponibili, conservare dati diagnostici e abbandono. Registrare il caso come limite di giocabilità: risolverlo con nuove regole richiederebbe un'attività distinta secondo R00. Non dichiarare garantita la conclusione di ogni configurazione possibile. |
| Account e admin | Form/API registrazione presenti, email locale disabilitata; log REST protetti da ADMIN HTTP Basic, distinto dal ruolo del profilo STOMP. | Parità del client e messaggi coerenti; prove positive solo con configurazioni di test dedicate. Nessun nuovo servizio account o bypass delle autorizzazioni. |

Fonti di codice: [controller](../server/src/main/java/com/gsc/bm/api/ws/GameController.java),
[validatore](../server/src/main/java/com/gsc/bm/api/ws/MoveCommandValidator.java),
[vista](../server/src/main/java/com/gsc/bm/service/view/model/client/ClientGameView.java),
[estrattore](../server/src/main/java/com/gsc/bm/service/view/ViewExtractorServiceImpl.java),
[sicurezza HTTP](../server/src/main/java/com/gsc/bm/conf/http/HttpSecurityConfig.java).
L'archivio completo è uno strumento di verifica a partita conclusa, non un
flusso animabile in tempo reale. Un eventuale contratto di eventi strutturati
resta rinviato: la prima esperienza deve funzionare con le API disponibili.

## Direzione visiva e interazioni

### Identità e scena richieste dal proprietario

**Un videogioco che rappresenta una partita a carte in un bar marcio.**
Tavolo sudicio con aloni di bicchieri, macchie, bruciature e mozziconi;
fumetto semplice, materiali e spessore leggibili. La griglia carbone/ambra
dei primi schizzi è respinta e non costituisce la base artistica da rifinire.
Direzione approvata: legno noce/tabacco, macchie brune, vetro verdastro, carta
avorio consumato, accenti bordeaux/petrolio; niente predominio giallo/nero.
Niente 3D, sfondi video o art completa delle 39 carte come prerequisiti.

Mano propria a ventaglio in primo piano, carte sovrapposte che si prendono,
si riordinano e si calano. Carta personaggio presso ogni postazione e
**carte oggetto scoperte fisicamente sul tavolo**, accanto al proprietario:
fronte, bordo e ombra, ispezione e bersaglio diretto, non scrittine sotto
un avatar. Equip/stati non diventano nuove carte oggetto se il modello non
li rappresenta tali. Sporcizia scenica non interattiva distinta dalle carte
giocabili, senza aggiungere oggetti/regole al catalogo.

Ogni avversario ha una **mano visibile di carte coperte**, in piccolo ventaglio
rivolto alla sua sede; numero uguale a `cardsInHand` della vista, anche zero.
In FFA si vedono tutte e quattro le mani avversarie. I dorsi non rivelano
fronti, identità o pending altrui: il server fornisce soltanto il conteggio.
Le carte giocate diventano scoperte quando la risoluzione pubblicata le identifica.

Gerarchia: scena e carte, bersagli e salute, clock, altre risorse/stati;
testo completo su ispezione, regole/riepilogo/diagnostica in accesso secondario.
Niente citazioni Rxx, JSON, testi di laboratorio o spiegazioni normative nel
normale tavolo. Il testo meccanico fedele resta consultabile, senza modificare
SQLite, regolamento o copia debug. HUD discreto; nessuna scheda dati permanente
come sostituto della carta. Il proprio personaggio è in basso, gli avversari
in sedi stabili, distinguendo morte e forfait. Il centro ospita calata e
risoluzione, senza nuove zone con significato regolamentare.

La carta mostra nome, tipo/sottotipo, costo e priorità prima del testo esteso.
Ingrandimento su focus/hover e apertura su tap, con testo leggibile senza
zoom del browser. Azioni base e bound persistenti hanno un segno diverso dalle
azioni da scartare; oggetti sul tavolo ed equipaggiamenti hanno aree distinte.
La barra salute accompagna sempre il valore numerico e non nasconde eccessi
o numeri negativi dietro un limite grafico.

### Spunti dai quattro riferimenti

I collegamenti rimandano ai materiali ufficiali. Le traduzioni in scelte UX
sono proposte per Botte Micidiali, senza importare le meccaniche dei riferimenti.

| Riferimento | Spunto da adattare | Applicazione proposta |
|---|---|---|
| [Magic The Gathering Arena](https://magic.wizards.com/en/mtgarena) | Tavolo riconoscibile, mano in primo piano e ispezione carta. | Zone stabili e collegamento visivo carta→bersaglio; nessuna pila o finestra di risposta nuova. |
| [Hearthstone](https://hearthstone.blizzard.com/en-us) | Materialità delle carte, gesto diretto e risposta immediata. | Sollevamento leggero, selezione netta, impatto breve e suono discreto; click/tap completo anche senza trascinamento. |
| [Gwent](https://www.playgwent.com/en/play-mobile) | Composizione ordinata e spazio per leggere carte e campo. | Ridurre decorazioni nelle aree informative; distribuire i partecipanti FFA senza introdurre righe tattiche. |
| [Yu-Gi-Oh! Master Duel](https://www.konami.com/yugioh/masterduel/us/en/) | Enfasi sugli eventi importanti e sequenza di risoluzione comprensibile. | Breve accento per annullamento, eliminazione ed esito; evitare filmati lunghi e conferme ripetitive. |

Questi giochi sono riferimenti visivi, non fonti di asset riutilizzabili.

### Gesto di gioco e feedback

1. Mano riordinabile: drag entro la mano per inserire la carta in un'altra
   posizione; alternativa da tastiera (Maiusc+frecce). Il pulsante
   «Riordina» con scambio click/tap è tolto su decisione del proprietario (O1):
   il riordino è solo locale e non è un'azione essenziale. Solo ordine grafico locale, nessuna API/ordine mazzo
   modificato; copie omonime senza ID d'istanza wire inventati.
2. Prendere la carta e calarla **direttamente sul bersaglio nel tavolo**:
   carta personaggio/postazione o carta oggetto. Evidenziare la categoria
   ammessa e il destinatario, senza promettere validazione locale definitiva.
   Alternativa equivalente: click/tap carta, poi click/tap bersaglio; tastiera
   completa. Nessun menu obbligatorio al posto degli oggetti visibili.
3. Rilascio valido: anteprima della calata e proposta di piccolo check/annulla
   vicino alla carta. Bound: scegliere prima del check una regolare dalla
   mano come scarto, con gesto distinto dal riordino. Drop invalido, Escape
   o pointercancel: ritorno in mano senza invio. Check: un solo SEND con
   gli stessi campi correnti, senza pagare o consumare ottimisticamente.
4. Mostrare invio in corso, mossa ricevuta o rifiuto recuperabile con feedback
   breve nella scena. Calare non significa colpire subito: scelta simultanea
   e risoluzione restano quelle server. Dopo accettazione niente ripensamento.
   Nell'attesa si possono ispezionare dati già visibili; le mosse altrui
   restano nascoste.
5. Presentare la risoluzione nell'ordine server: costi prima degli effetti,
   poi mosse, scarto/pesca quando osservabili, effetti periodici ed esito.
   Con i dati attuali usare transizioni aggregate per le variazioni non
   attribuibili con certezza, mantenendo il report leggibile a richiesta.

Durate iniziali proposte: 100–150 ms per selezione, 200–350 ms per spostamento
carta o impatto; sequenza totale normalmente entro 2 s. Il nuovo turno è
utilizzabile appena la vista autorevole arriva: animazioni interrompibili,
accelerate o saltate se ostacolano l'input, con riepilogo consultabile. Nessun
Continue obbligatorio tra turni e nessuna pausa del clock multiplayer. Con
movimento ridotto mantenere evidenziazioni e testo, eliminando scosse e voli.
Le mosse già inviate possono risolversi anche dopo la morte dell'autore;
l'animazione non deve fermare il round alla prima eliminazione.

Nuove viste, resize/orientamento, background e interruzione del puntatore
devono cancellare anche un drag in corso senza generare comandi. Sul minimo
landscape, mano/bersagli/conferma raggiungibili nella scena senza scorrere
pannelli; dettaglio testo apribile e richiudibile. La precedente proposta
di pagina lunga con scroll non è approvata. [Dettagli e casi](design/client-c0/bar-table-revision.md).

## Stack proporzionato e riuso futuro

### Decisione C0-R1, rivalutata dopo la nuova direzione artistica

**Implementazione corrente: PixiJS 8.22.0 + TypeScript 5.9.3 per tutto il
tavolo; React/ReactDOM 19.3.1 con HTML/CSS per shell e ispezione; Vite 8.3.5.**
Node 24.13.0 e npm 11.6.2 isolati, dipendenze e integrità fissate nel lock.
La build supera peso e misure sul PC; confermata alla chiusura di C0, con
deroga del proprietario sulla risposta al tocco su iPhone. [Confronto, fonti primarie e confini](design/client-c0/r1/technology.md).
Il confronto è stato riaperto su richiesta del proprietario in C0-R1: la precedente
raccomandazione Angular/DOM con Pixi limitato agli effetti è superata.

La scena richiesta usa carte ruotate, ombre, sovrapposizione, ventagli di
dorsi e bersagli sullo stesso tavolo. Si preferisce un solo spazio di coordinate
e una gerarchia grafica per questi elementi. Non servono fisica o simulazione
locale. La qualità artistica viene da composizione e asset: cambiare libreria
non produce automaticamente un bar convincente.

| Alternativa | Decisione e compromesso |
|---|---|
| Angular + DOM/CSS/SVG | Capace di questa grafica e valido per form e parità. Il precedente layout non è un limite del framework. Resta alternativa di riserva se canvas/peso/accessibilità non reggono; il vecchio tavolo non è la base artistica da conservare. |
| React + DOM/CSS/SVG | Stesse capacità grafiche di base. Il solo cambio di framework non risolve mano e tavolo; non è la scelta per la scena. |
| PixiJS + shell HTML | Implementata in C0: tavolo, carte, bersagli e animazioni nel renderer 2D; testo esteso e controlli applicativi HTML. Coordinate e livelli comuni, ma texture, GPU e accessibilità richiedono lavoro esplicito. |
| Phaser + shell HTML | Alternativa capace di scene, input e tween. Non scelto per questa singola scena senza simulazione locale: i servizi aggiuntivi non sono un requisito. Nessun vantaggio di peso o prestazioni dichiarato senza confronto. |

React è una scelta della shell, non del rendering: integrazione imperativa
del tavolo e componenti HTML per il resto. Angular potrebbe ospitare lo stesso
renderer; React comporta un porting dei flussi esistenti, da verificare nella
parità P01–P44. Nessuna promessa di bundle minore o porting gratuito.

### Composizione e vincoli

| Parte | Scelta proposta |
|---|---|
| Tavolo | PixiJS possiede carte, personaggi, oggetti, ventagli, ordine di disegno e movimento. Un controller dei gesti per drag, riordino, mira e scarto; tastiera e click/tap chiamano gli stessi intenti. |
| Shell e testo | React/HTML per account, hub, catalogo, editor, menu e dettagli. Testo reale selezionabile, focus e controlli semantici; niente pannelli applicativi permanenti al posto del tavolo. |
| Accessibilità | Overlay semantico esplicito, focus visibile, ordine prevedibile, alternativa completa al drag e movimento ridotto. Il supporto Pixi opt-in non equivale a una verifica già passata. |
| Stato e rete | DTO/adattatori TypeScript indipendenti dal renderer; stato autorevole, selezione e animazione separati. STOMP/SockJS e destinazioni private invariati; niente secondo motore delle regole, effetti predittivi o reinvio automatico. |
| Risorse | Illustrazione, cornice, dorso e testo separati nella scena corrente; PNG R1 solo per revisione. Caricamento mirato, texture ottimizzate, nomi/numeri dal catalogo/vista. |
| Versioni e build | Versioni puntuali e lock in client-c0/revision; runtime Node isolato condiviso con la prima prova, dipendenze separate. R1 resta una consegna statica storica. |
| Continuità | Server, SQLite, debug e laboratorio Angular storico intatti. La toolchain già compilata (Angular 21.2, TS 5.9, Node 24) documenta solo la prima prova, non la proposta nuova. |

Le misure Angular precedenti validano solo la scena storica. Le nuove
[evidenze R2–R5](reports/client-c0-r2-report.md) riguardano la build Pixi/React,
con soglie invariate e tutte le risorse di produzione incluse nel peso.
Il cambio è motivato dalla costruzione della scena, senza attribuire il
rifiuto artistico a un fallimento prestazionale di Angular.

Sono verificati automaticamente perdita/ripristino del contesto grafico,
teardown, resize, zoom emulato, carte sovrapposte, interruzione del drag e focus. Se la scena non supera
le soglie dopo una semplificazione mirata, confrontare lo stesso contenuto
in DOM/SVG; non alzare i budget per giustificare la scelta. Nessun confronto
aggiuntivo è stato necessario: sul telefono la fluidità passa e la soglia input
è accettata con deroga dal proprietario, senza confronto DOM/SVG.

Il riuso futuro riguarda contratti, stato, asset e comportamenti. Un contenitore
desktop/mobile rimane futuro, senza app native, PWA, service worker, fisica,
3D o pipeline di shader aggiunti ora. La scelta React non implica riuso diretto
in React Native. Il perimetro rimane un unico client web a parità del debug.

## Asset iniziali e condizioni di utilizzo

Fonti consultate il 26 ottobre 2026. La prima prova ha prodotto SVG/CSS
e screenshot storici. **C0-R1 aggiunge tre mockup PNG illustrati**, generati
ex novo con imagegen integrato, senza asset precedenti o immagini esterne
come input. [Inventario R1 e prompt](design/client-c0/r1/README.md). Le PNG
sono elaborati di revisione. La scena usa due nuove texture WebP derivate
dal riferimento approvato, con testo e cornici disegnati separatamente:
[provenienza](design/client-c0/r2-assets/README.md). Preferire poche risorse locali, senza dipendenze
da CDN durante la partita; mai importare un intero set quando bastano pochi
SVG. Il primo set non richiedeva illustrazioni individuali delle 39 carte;
ora sono previste in forma provvisoria in C2 (O9).

| Fonte | Uso proposto | Condizioni da conservare |
|---|---|---|
| SVG/CSS originali semplici | Cornici, dorso, tavolo, sagome personaggio e segni d'impatto; testo e pittogramma distinguono le carte senza art dedicata. | Materiali nuovi del progetto secondo i diritti concordati; nessuna nuova licenza open source implicita. |
| [Game-icons.net](https://game-icons.net/about.html) | Piccola famiglia coerente di simboli per azioni, risorse, bottiglie, danni e stati; fonte principale dei pittogrammi di gioco. | CC BY 3.0: attribuire l'autore di ciascuna icona, collegare fonte e licenza, indicare adattamenti. Verificare la pagina del singolo file prima dell'inclusione. |
| [Kenney UI Pack](https://kenney.nl/assets/ui-pack) | Pochi elementi neutri o riferimenti per controlli secondari, solo se coerenti con il tavolo vettoriale. | Pack dichiarato CC0: uso e adattamento anche commerciale, attribuzione non obbligatoria; conservare comunque provenienza e licenza. Non è necessario usare il pack completo. |
| [Lucide](https://lucide.dev/license) | Alternativa per sole icone di navigazione e strumenti, evitando di mescolarle casualmente ai simboli di gioco. | ISC: conservare copyright e avviso di licenza; verificare le note dei file distribuiti. |
| [Play nel repository Google Fonts](https://github.com/google/fonts/tree/main/ofl/play) e [licenza](https://raw.githubusercontent.com/google/fonts/main/ofl/play/OFL.txt) | Un solo font iniziale per UI e carte, numeri ben leggibili; font di sistema come fallback. Scelta ex novo, indipendente dagli asset precedenti. | SIL OFL 1.1: distribuire copyright e licenza, non vendere il font da solo; rispettare i nomi riservati in caso di modifica. |
| [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) | Facoltativamente pochi suoni per selezione, invio ed esito in C4, con volume/mute. | Pack CC0; nessuna attribuzione obbligatoria. Non subordinare il feedback alla disponibilità dell'audio. |

All'inclusione registrare file, autore, URL originale, versione/data, licenza,
eventuali modifiche e destinazione in un inventario asset con testi di licenza
e crediti consultabili. I permessi dei fornitori riguardano le loro risorse,
non cambiano «tutti i diritti riservati» del progetto. Nessuna art, musica,
cornice o marchio estratto dai quattro giochi di riferimento.

## Tappe ordinate per dipendenze

Ordine: **C0 → C1 → C2 → C3 → C4 → C5**. Si anticipano gioco completo e
parità; la finitura costosa arriva dopo. L'aspetto da partita a carte e i gesti
fondamentali devono però esserci già in C0/C1, non essere rinviati alla finitura.
C0 ha prodotto una prima prova tecnica, respinta nella direzione visiva, poi
i passaggi di revisione R1–R5 che hanno chiuso la tappa. C1–C5 restano future.
Nessuna stima di calendario finché non sono noti disponibilità e dispositivi;
la priorità è chiudere un risultato osservabile per tappa.

### C0 Definire i contratti e verificare la tecnologia

**Risultato richiesto:** parità tracciata, tavolo da bar riconoscibile,
mano e calata convincenti, tecnologia motivata su una prova rappresentativa.
Le sole prestazioni non chiudono C0.

**Stato al 27 ottobre:** [rapporto e verifiche](reports/client-c0-r2-report.md),
[scena ripetibile](../client-c0/revision/README.md),
[catture della build](design/client-c0/r2-screenshots/README.md).
Una sola scena con snapshot sintetici conformi ai DTO: FFA cinque, sei
azioni proprie, quattro ventagli coperti, nove carte oggetto alle capacità
1/3/1/3/1, stati/immunità/timer e testo reale anche lungo. Nessun account,
trasporto di gioco o risolutore locale. Il check produce un'anteprima comando;
il laboratorio inietta viste fissate indipendenti dalla scelta.

| Passaggio | Esito corrente | Evidenza e limite |
|---|---|---|
| C0-R1 Scena e carte | **Approvata** come riferimento visivo | [Duello, FFA cinque e carta](design/client-c0/r1/approval.md), identificati dall'inventario R1. Non approva automaticamente i gesti successivi. |
| C0-R2 Mano interattiva | Implementata e verificata automaticamente | Ventaglio, dettagli HTML, drag, scambio click/tap, frecce/Invio/Escape; copie conservate e conteggi 0/1/6/4. Privacy limitata ai dati DTO sintetici. |
| C0-R3 Calata e oggetti | Implementata e verificata automaticamente | Personaggio/oggetto, proprietario, SELF, scarto bound, check unico, zero comandi su riordino o annullamento. Touch emulato; mira sul telefono confermata nella revisione R5. |
| C0-R4 Interruzioni e stato | Implementata e verificata automaticamente | Pending/rifiuto/drop/ripresa, viste dello stesso turno, callback vecchie, resize/zoom/orientamento, movimento ridotto, focus, clock e contesto WebGL. Alcuni segnali background sono sintetizzati e dichiarati. |
| C0-R5 Misure e accettazione | **Chiusa con deroga** | Produzione desktop e touch emulato 60+ s, peso entro budget. iPhone 16 Pro: frame PASS, input 116 ms accettato dal proprietario; revisione umana sì con riserve; landscape forzato. |

La prima prova Angular e le sue misure restano storiche. Il rifacimento
R1–R5 è registrato separatamente, fra 26 e 27 ottobre con due sospensioni
per limite d'uso ([punto di ripresa archiviato](history/client-c0-resume.md));
non è disponibile una misura affidabile delle ore attive.
Non estendere questa prova a un client completo o all'art delle 39 carte.

| Criterio | Soglia mantenuta e verifica |
|---|---|
| Scena e leggibilità | Atmosfera R1 approvata; sei carte proprie, quattro mani coperte e oggetti come carte. Testo completo su richiesta, alternativa a drag/hover, nessuno scroll di pannelli per giocare in landscape. Controlli principali almeno 44 CSS px; geometria e dettaglio ≥15 px verificati automaticamente. Lettura e mira sul minimo reale 750×292 confermate nella revisione R5, con riserve sui dettagli grafici. |
| Fluidità | Cattura di almeno 60 s sulla stessa FFA: obiettivo 60 fps, almeno 95% degli intervalli ≤20 ms desktop e ≤33 ms touch campione. Input→feedback software ≤100 ms. PC Windows/Edge ed emulazione PASS; iPhone 16 Pro: frame PASS, input 116 ms accettato con deroga. |
| Peso | Fissato in C0: 500 KiB gzip JS e 1 MiB gzip complessivo. **Dal 27 ottobre 2026, decisione del proprietario per O9:** JS ≤ 500 KB gzip invariato; totale ≤ 4 MB gzip; ogni atlante ≤ 2048×2048; texture decodificate in tutto ≤ 64 MB. La misura include tutti i file produzione, anche chunk facoltativi e manifest, quindi è conservativa; `tools/size.mjs` verifica i quattro limiti. Riconfermare a parità C2 e finitura C4. |
| Semplicità | Un controller degli intenti e una vista autorevole; animazioni cancellabili senza risolvere le carte nel client. Dorsi da conteggi, nessuna identità avversaria ricostruita o danno ottimistico. |

Desktop 1366×768 e landscape emulato 844×390 sono verificati; su iPhone 16 Pro
Safari lascia 750×292 CSS px, giudicati sufficienti dal proprietario. **Decisione:
landscape obbligatorio**; in portrait resta la richiesta di rotazione, senza
layout verticale. Un futuro contenitore a schermo intero recupererà lo spazio
della barra del browser; il touch web non è un'app nativa.

**Stato del gate C0:**

- [x] Checklist P01–P44, contratti, tre esempi di comando e restart senza vista.
- [x] Prima grafica respinta e conservata come storico; asset precedenti esclusi.
- [x] R1 approvata dal proprietario nei tre elaborati definitivi.
- [x] R2–R4 implementate e provate nella sola scena sintetica.
- [x] R5: build produzione, misure PC/emulazione e peso documentati.
- [x] R5: almeno 60 s sul touch fisico, con modello, browser, CSS px e input
  annotati — **accettato con deroga dal proprietario**. Due catture su iPhone
  16 Pro/Safari (750×292): frame entro soglia, input max 125 e poi 116 ms
  contro 100 ms dopo l'unica semplificazione mirata. Fluidità giudicata
  accettabile; soglie invariate, ridisegno incrementale da riconsiderare in C4.
  [Esiti](reports/client-c0-r5-procedure.md#esiti).
- [x] R5: breve giudizio umano su atmosfera della scena, lettura, riordino e mira al minimo — sì su tutti i punti, riserve su riordino, rifinitura grafica e controlli; landscape forzato.

**C0 chiusa il 27 ottobre 2026.** La prova fisica ha richiesto
l'unica semplificazione mirata (testo riusato nei ridisegni); la soglia input
resta superata e il proprietario ha accettato la fluidità, senza confronto
DOM/SVG e senza cambiare le soglie. **Stack confermato:** PixiJS/TypeScript per
il tavolo, React/HTML e Vite. Riserve da portare avanti: in C1 la carta presa
segue chiaramente dito o mouse nel trascinamento; in C4 ridisegno incrementale,
rifinitura grafica e dei controlli, nuova misura fisica a parità completa.

### C1 Giocare una partita completa contro computer

**Stato (27 ottobre 2026): chiusa** dal proprietario. Criteri
automatizzabili soddisfatti con partite reali sul server locale
([rapporto](reports/client-c1-report.md)). Su iPhone 16 Pro, servito in rete
locale con `client-web/run.ps1 -Task Physical`, il proprietario giudica
adeguati drag col dito e risposta al tocco (valutazione umana, senza misure).
La prova umana A non riferisce blocchi; le quattro incomprensioni principali
sono O11–O14.

**Dipende da C0. Risultato:** login → quick 1vCom → partita → esito → nuova
partita nel nuovo client, con il tavolo del bar e le carte/gesti accettati in C0.

**Attività:** usare la soluzione grafica confermata in C0 per collegare
protocollo e viste private a mano, personaggi/risorse e stati/oggetti;
collegare riordino locale della mano, calata su personaggio/carta oggetto,
scarto bound dalla mano, check discreto e feedback invio/rifiuto. Carte
avversarie coperte dai conteggi server, senza rivelarne i fronti. Riepilogo
non bloccante e diagnostica equivalente. Gestire
disconnessione senza invii automatici duplicati. Animazioni limitate a
selezione, passaggio carta e risultato aggregato; niente effetti specifici
per ogni carta.

**Completamento verificabile:** completare una partita con ciascuno dei due
personaggi, anche attraverso più avvii per l'assegnazione casuale; eseguire
bound e bersaglio oggetto, leggere un effetto periodico, raggiungere un esito
e rientrare all'hub senza JSON obbligatorio. Oggetti visibili come carte e
mani avversarie come dorsi; provare calata drag, percorso click/tap e riordino
che non invia mosse. Un rifiuto lascia correggere la
scelta. Nessuna sottrazione costi anticipata, nessuna alterazione R02–R06.
Un caso senza mosse valide deve essere segnalato come limite esistente.

**Prova umana A:** due persone, circa 30–45 minuti complessivi, partite vsCom
e tre domande: «cosa puoi fare?», «su chi agisci?», «cosa è successo?».
Entrambe devono inviare autonomamente una mossa completa dopo la sola
spiegazione iniziale. Annotare solo blocchi e principali incomprensioni;
correggere quelli che impediscono di giocare prima di estendere la copertura.

**Residui prima della prova A:** O1 (togliere il pulsante «Riordina») e O5
(dettagli carta con un tocco) sono **fatti** e verificati sul server reale
([rapporto](reports/client-c1-report.md#residui-c1-o1-e-o5)).

### C2 Raggiungere la parità del client debug

**Dipende da C1. Risultato:** tutte le righe della matrice disponibili nel
nuovo client, ancora con finitura essenziale.

**Attività:** aggiungere 1v1 e FFA, code/bot/start/leave, open con mazzo
salvato; portare catalogo/editor, presenza/profilo, home/regole, registrazione
e funzioni admin/diagnostiche esistenti. Completare clock e ciclo di vita,
forfait FFA, rientro pending, sessione unica e ricevuta restart. Conservare
errori e limitazioni di servizi disabilitati senza introdurre nuovi servizi.
La FFA conserva quattro mani avversarie coperte e oggetti come carte presso
le rispettive postazioni; non tornare a pannelli testuali per far spazio.

**Completamento verificabile:** checklist di parità senza omissioni; creare,
modificare, salvare e cancellare un mazzo e usarlo in open; completare le
quattro modalità. Eseguire FFA anticipata a due e piena a cinque, anche con bot;
due account isolati non leggono la mano reciproca. Provare rientro prima/dopo
scadenza, pending conservata, logout/leave, timeout simultaneo e restart-draw
senza inviare comandi al vecchio match. Negli ambienti previsti verificare
registrazione e azioni admin; nel profilo locale verificarne indisponibilità
esplicita, non dichiararne il successo. Le cancellazioni admin si provano su
dati sintetici. Nessuna nuova legalità imposta ai mazzi.

**Prova umana B:** 3–5 partecipanti in una sessione di circa un'ora, combinando
duello, FFA con eventuali bot e uso di un mazzo salvato. Ogni persona coinvolta
deve riconoscere attesa, mossa accettata e proprio esito; chi è ancora in FFA
deve poter continuare dopo un forfait altrui. Le scadenze rare si verificano
con CLI/fixture, senza far attendere ripetutamente i giocatori.

**Blocchi.** C2a «leggibilità di base» (O11–O14 con O3/O4, solo quick 1vCom):
**chiuso** dal proprietario il 27 ottobre 2026, dopo verifica su server locale,
prova del proprietario su iPhone e desktop senza rilievi, distinta dalla prova umana B del 29 ottobre ([rapporto](reports/client-c2-report.md#c2a--leggibilità-di-base)).
O9 (illustrazioni provvisorie) non è in C2a: è stata fatta dopo, 40 illustrazioni in un atlante
([rapporto](reports/client-c2-report.md#o9--illustrazioni-provvisorie)). C2b porta le modalità e il resto
della parità in sette blocchi ([piano](history/client-c2b-plan.md)): C2b-1 modalità e code, C2b-2 ciclo
di vita in 1v1, C2b-3 FFA a cinque, C2b-4 catalogo, mazzi e open 1vCom, C2b-5 home, regole e registrazione e C2b-6 profilo, amministrazione e log client e C2b-7 checklist e prova umana B sono fatti: **C2 è chiusa** dal proprietario il 29 ottobre 2026 ([rapporto](reports/client-c2-report.md#c2b-7--checklist-di-parità-e-prova-umana-b)). La FFA usa la geometria di C2a (oggetti
propri sulla riga del personaggio, ventaglio che inizia dopo di loro, oggetti avversari
sovrapposti al 25% che si alzano al passaggio del mouse o al primo tocco), provata
su viste reali a ogni turno; i ventagli avversari hanno ora uno spazio proprio e
ruotano meno ([rapporto](reports/client-c2-report.md#c2b-3--ffa-a-cinque)). L'editor dei
mazzi applica solo le regole del debug e di R02; per decisione del proprietario il
regolamento 1.8 vieta «/» nel nome di un mazzo, perché l'avvio open lo porta nella
destinazione ([rapporto](reports/client-c2-report.md#c2b-4--catalogo-editor-mazzi-e-open-1vcom)). Il
regolamento mostrato dal client web è `docs/game-rules.md` importato al build, senza una
terza copia; nel profilo locale la registrazione dice solo che non è disponibile
([rapporto](reports/client-c2-report.md#c2b-5--home-regole-e-registrazione)). Il pannello di
amministrazione lascia le credenziali HTTP Basic al browser (prompt nativo, verificato su
Edge) e la segnalazione degli errori manda un invio alla volta, senza credenziali né dati di
gioco ([rapporto](reports/client-c2-report.md#c2b-6--profilo-amministrazione-log-client-e-diagnostica)).

**Osservazioni assegnate:** prima della prova umana B, perché aiutano a
riconoscere le carte in mano e sul tavolo durante i playtest:
O9 (illustrazione provvisoria per ogni carta); O11 (carte non pagabili
attenuate); O12 (carte più grandi e leggibili, dimensionate insieme alla FFA);
O13 con O3 e O4, anticipate da C3 (risorse proprie leggibili e carte che le
danno); O14 in forma essenziale (ruolo della carta riconoscibile). Finitura
grafica in C4. Sono leggibilità di base, non nuove regole: il server resta
l'unico giudice di costi e legalità.

### C3 Rendere leggibile e soddisfacente la risoluzione

**Dipende da C2. Risultato:** il round si comprende dal tavolo, con movimento
ed enfasi coerenti, senza rallentare le decisioni.

**Piano (29 ottobre 2026):** sette blocchi C3-1…C3-7, osservazione del server reale,
regole di non-regressione e decisioni nel [piano C3](client-c3-plan.md).

**Attività:** affinare selezione/bersagli, costo, carta confermata, annullamento,
variazioni risorse, trasferimento/consumo oggetti, scarto/pesca osservabili,
fine turno ed esito. Usare i report disponibili come spiegazione testuale;
mostrare delta aggregati quando non esiste una sequenza strutturata affidabile.
Gestire viste ripetute, aggiornamenti nello stesso turno, cancellazione delle
animazioni, scheda in background e reconnect. Report dell'ultimo round
consultabile, senza creare cronologia persistente o replay.
Con lo stack implementato in C0 il renderer possiede l’intero tavolo;
la shell HTML non mantiene una seconda versione interattiva delle carte.
Resta una sola fonte dello stato e un solo controller degli intenti.

**Completamento verificabile:** una stessa risoluzione non si anima due volte;
lo stato finale coincide sempre con la vista server; pending dello stesso turno
si aggiorna. Nessuna risoluzione inventata dopo un round saltato. Le animazioni
non impediscono invio o lettura del clock del turno corrente; movimento
ridotto e salto sequenza conservano le informazioni. Coprire annullamento,
oggetto scomparso, morte con mossa già inviata e fine turno letale con pochi
scenari mirati esistenti. La verifica umana del ritmo confluisce nella sessione
finale C5, evitando un nuovo ciclo separato di playtest.

**Osservazioni assegnate:** O6 (frecce dalla carta ai bersagli ammessi),
O7 (effetti di risoluzione: colpo, taglio, veleno e altro). O3 e O4 sono
anticipate in C2 con O13.

### C4 Rifinire grafica e uso su schermi diversi

**Dipende da C3. Risultato:** identità provvisoria coerente in tutte le
schermate e controlli utilizzabili anche senza hover.

**Attività:** rifinire l'identità del bar e i gesti già accettati in C0/C1,
uniformare tavolo/carte/form, sostituire tutti i placeholder
incoerenti con il piccolo set selezionato; ottimizzare SVG e caricamento,
aggiungere eventuali suoni brevi. Adattare mano, FFA e editor a desktop e touch;
focus visibile, testi ampliabili, contrasto, simboli oltre al colore, dimensione
comoda dei controlli e preferenza movimento ridotto. Catalogo/editor e admin
possono essere sobri, ma devono restare completi e leggibili.

**Completamento verificabile:** nessun asset casuale precedente nel nuovo
client; ogni file esterno ha provenienza/licenza. Proposta iniziale di misura:
desktop 1366×768 e touch landscape circa 844×390 CSS pixel, minimo reale
750×292 su iPhone 16 Pro/Safari; landscape obbligatorio deciso in C0, con
richiesta di rotazione in portrait.
Nessuna azione essenziale dipende dal drag; target principali di almeno 44 CSS
pixel e testo carta completo consultabile. Sul dispositivo campione puntare
a 60 fps nelle transizioni comuni, verificando le soglie di frame/input e il
budget di download stabiliti in C0 su round normale e FFA, a parità completa.
Distinguere ritardo rete; se il budget non regge, ridurre decorazioni prima di
rivalutare il renderer secondo gli stessi criteri C0, senza una nuova campagna
di confronti tecnologici.
La valutazione umana di leggibilità e touch confluisce in C5.

**Osservazioni assegnate:** O2 (sfondo con sedute da bar marcio), O8 con
O14 (cornice per tipologia e segno del ruolo nella stessa grafica), O10
(simboli per costi, priorità e risorse sulle carte), finitura di O12 su
desktop e touch. Sostituiscono anche le illustrazioni provvisorie di O9 dove
serve.

### C5 Consegnare il client web per i playtest

**Dipende da C4. Risultato:** versione locale ripetibile, a parità funzionale,
che i giocatori possono usare per provare il gioco con istruzioni brevi.

**Attività:** una regressione consolidata dei percorsi, una prova umana finale,
correzione dei blocchi emersi, guida di avvio del nuovo client e rapporto con
limiti residui. Conservare il debug come riferimento diagnostico finché la
parità non è verificata. Non includere deploy o pacchetti nativi.

**Completamento verificabile:** tutte le righe della matrice chiuse con
evidenza o limitazione della base esplicita; nessun nuovo blocco nei percorsi
prima funzionanti. Nessuna discrepanza con il regolamento, nessun dato privato
in più, nessuna funzione rimossa per privilegiare la grafica. Avvio documentato
da checkout con cache predisposte, esiti e rientro ripetibili.

**Prova umana C:** quattro persone, includendone almeno una nuova al client,
circa un'ora; un duello, una FFA e passaggi mirati su editor/touch. Ciascuno
deve riconoscere costo, bersaglio, scarto, accettazione ed esito senza aprire
diagnostica; almeno tre su quattro devono spiegare correttamente l'ultimo
round osservato e valutare chiarezza e reattività almeno 4/5. È una soglia
pratica di accettazione, non una misura statistica. Un solo passaggio di
correzione e controllo mirato; ripetere una sessione completa solo se restano
problemi che impediscono o falsano il gioco.

## Osservazioni del proprietario dopo C1

27 ottobre 2026: O1–O10 dopo la prima prova del proprietario, O11–O14 dalla
prova umana A. Ogni osservazione ha una tappa; l'ordine C1→C5 resta
invariato. Nessuna richiede modifiche a regole, server o catalogo, salvo dove
indicato come decisione aperta.

| ID | Osservazione | Tappa | Note e vincoli |
|---|---|---|---|
| O1 | Il pulsante «Riordina» non serve: il riordino si fa trascinando. | C1, **fatto** | Decisione del proprietario: aggiornato il gesto 1. Resta l'alternativa da tastiera; su touch il riordino resta solo trascinando, accettabile perché non è un'azione di gioco. |
| O2 | Le sedie dello sfondo sono troppo eleganti per un bar marcio. | C4 | Rigenerare la texture del tavolo con lo stesso processo e registro di provenienza delle WebP C0; sedute consumate e spaiate, stessa palette. |
| O3 | Allerta, tossicità, violenza e alcol sono poco visibili rispetto alla salute. | C2a con O13, **implementata** | Integrarle nel segnapunti della salute con simboli e colori propri, sempre con il numero. Nessuna informazione affidata solo al colore. |
| O4 | Oltre al numero serve una barra o una torta per capire se una risorsa è tanta o poca. | C2a con O13, **implementata** | Indicatore rispetto al valore iniziale del personaggio: salute piena all'inizio, le altre risorse a metà barra (decisione del proprietario in C2a). R01 non ha tetti né pavimenti: mostrare eccesso oltre l'iniziale e valori negativi, senza saturare l'indicatore o nascondere il numero. |
| O5 | «Dettagli carta» è scomodo: meglio un pulsantino (i) sulla carta. | C1, **fatto** | (i) in alto a sinistra su hover e sulla carta selezionata o con focus. Su touch non c'è hover: il pulsante compare sulla carta selezionata. Tastiera invariata (I). |
| O6 | Oltre al contorno, frecce dalla carta selezionata ai bersagli possibili. | C3 | Frecce verso le sole categorie ammesse dalla carta, come gli attuali contorni: assistenza visiva, non validazione definitiva del server. |
| O7 | Manca un'animazione della risoluzione: colpi, tagli, effetti spettacolari. | C3 | Effetti per carta e per tipo di danno, nell'ordine di `resolvedMoves`, interrompibili e con movimento ridotto. Con le API attuali i valori finali restano quelli della vista e le variazioni intermedie non sono attribuibili con certezza. **Deciso il 29 ottobre 2026** ([piano C3](client-c3-plan.md), D1–D2): solo dati certi, nessun evento strutturato dal server in C3; il tipo di danno, che il server non pubblica, verrà da un campo descrittivo del catalogo (attività A1, dal regolamento). |
| O8 | Le carte sono tutte uguali; il tipo si capisce solo dalla scritta. | C4 | Cornice, colore o fregio diversi per personaggio, azione regolare, base, legata, ultima risorsa, oggetto e token, mantenendo la scritta. |
| O9 | Mancano le immagini di molte carte; servono anche provvisorie. | C2, **chiusa** (iPhone e giudizio del proprietario) | Una illustrazione provvisoria per ognuna delle 39 carte e del token. **Non immagini prese da Internet:** diritti incerti e progetto «tutti i diritti riservati». Si generano ex novo, come le WebP C0, con prompt e provenienza registrati, oppure si usano fonti con licenza compatibile. Supera la vecchia indicazione che il primo set non richiedesse illustrazioni individuali. |
| O10 | Priorità, costi ed effetti in basso sulla carta vanno bene, ma con simboli invece delle lettere. | C4 | Famiglia di simboli coerente (fonti e licenze in «Asset iniziali»), sempre con il numero e consultabile in testo. Da usare anche in O3. |
| O11 | Prova A: non si capisce quando una carta si può giocare con le risorse disponibili. | C2a, **implementata** | Attenuare leggermente le carte in mano il cui costo supera le risorse correnti della vista (R03: costi disponibili all'invio). La carta resta ispezionabile e il percorso di scelta e invio non cambia: il server resta l'unico giudice e il rifiuto resta gestito. Solo il costo in risorse; gli altri requisiti restano al rifiuto. |
| O12 | Prova A: le carte sono piccole e sul tavolo si leggono male. | C2a **implementata**, finitura C4 | Carte in mano e sul tavolo più grandi ai formati di riferimento, decise insieme alla disposizione FFA a cinque, che riduce lo spazio. La (i) resta per il testo completo. |
| O13 | Prova A: non si capisce quali e quante risorse si hanno, né quali carte in mano le fanno ottenere. | C2a con O3 e O4, **implementata** | Risorse proprie leggibili vicino al proprio personaggio e alla mano; sulle carte, guadagni di risorse riconoscibili a colpo d'occhio dall'effetto, oltre al costo. |
| O14 | Prova A: le tipologie devono riconoscersi a colpo d'occhio, compresi i ruoli: danno, risorse, contrasto delle mosse avversarie. | C2a essenziale **implementata**, C4 con O8 | Un segno di ruolo sulla carta senza snaturarne l'aspetto attuale, che piace. In C2 un segno essenziale; in C4 cornici e simboli definitivi con O8 e O10. **Deciso il 27 ottobre 2026:** la classificazione è un campo del catalogo SQLite, così tutte le informazioni sulle carte restano nello stesso posto ([regolamento 1.7, R07a](game-rules.md#r07a--ruoli-descrittivi-delle-carte-17)). Ruoli DAMAGE, DEFENSE, RESOURCES, COUNTER, DISRUPT, ITEMS e OTHER per le carte ambigue, da rivedere con il bilanciamento; accanto, i guadagni a sé usati da O13. Il server li espone come `role` e `gains` della carta. |

## Osservazioni della prova umana B (C2b-7)

29 ottobre 2026, prova condotta dal proprietario con la
[scheda](reports/client-c2/c2b-7/prova-b-scheda.md): duello, FFA con computer e telefono
senza rilievi; dal mazzo salvato (S3) una incomprensione e tre proposte. Nessun blocco.

| ID | Osservazione | Tappa | Note e vincoli |
|---|---|---|---|
| O15 | Prova B: nell'editor non si capisce bene cosa è nel mazzo e cosa no; manca un riepilogo del mazzo corrente. | Con O16 in un'attività successiva dedicata, **deciso** dal proprietario | Solo client: riepilogo sempre visibile di personaggio, base, ultima risorsa, legate e regolari con le copie. Nessuna regola cambia. |
| O16 | Prova B: l'editor riprende la struttura del debug; un deckbuilder più funzionale. | Attività successiva dedicata, con O15 | Solo client, se resta dentro R02. Da progettare tenendo conto di O17. |
| O17 | Prova B: in seguito il mazzo si costruirà con le carte della collezione dell'utente. | **Regole**, attività separata | Concetto nuovo di carte possedute: oggi la collezione dell'account (`account/data.collection`) è l'intero catalogo e R02 non limita le carte a quelle possedute. Cambia regolamento, server e dati: prima `docs/game-rules.md` con versione e motivazione (AGENTS.md). Fuori dal perimetro attuale («economia», «modifiche ai mazzi»). |
| O18 | Prova B: il mazzo si sceglie sempre, non in una coda a parte; starter sempre selezionabile per ogni personaggio, oppure un mazzo proprio. | **Regole**, attività separata | Oggi R00 assegna a caso personaggio e starter nelle code quick, e solo open usa un mazzo salvato. Richiede regolamento (R00/R02), code e protocollo di ingresso. |

## Verifiche proporzionate

Conservare test del motore e scenari CLI già acquisiti. Aggiungere prove
mirate solo per nuovi rischi client: composizione comando, transizioni
selezione/invio/pending/rifiuto, riconciliazione viste, annullamento animazioni
e resize/focus. Pochi percorsi browser verificano interazione e parità; non
riscrivere con il mouse tutte le combinazioni di carte coperte dal server.

Tre sessioni umane A/B/C sono sufficienti come piano iniziale. Raccogliere
per ciascuna una breve lista di blocchi, incomprensioni e interventi ordinati
per impatto. I test automatici non sostituiscono il giudizio su leggibilità
e soddisfazione; i giocatori non devono ripetere scenari tecnici di crash.

Alle consegne eseguire le verifiche del repository elencate in
[CONTRIBUTING](../CONTRIBUTING.md), oltre ai controlli del nuovo client
(per la scena C0: [verifiche ripetibili](../client-c0/revision/README.md#verifiche-ripetibili)). Una sola esecuzione
consolidata per consegna è sufficiente se non emergono nuove modifiche o
difetti. Il contesto Spring resta separato: unit test verdi non attestano
l'avvio applicativo, né un browser aperto attesta una partita completa.
Manifest e approvazione I22 non vanno rigenerati per adeguarli al nuovo client.

## Decisioni ancora aperte

- **Direzione artistica acquisita:** i tre mockup R1 sono approvati. Bar
  marcio, materiali, palette e carte fisiche guidano già la scena corrente
  e C1; gli asset precedenti restano esclusi. Resta da giudicare il risultato
  interattivo, senza riaprire automaticamente il confronto artistico.
- **Dispositivi:** PC Windows/Edge e iPhone 16 Pro/Safari come touch campione
  registrato. Landscape obbligatorio; 750×292 reali in Safari accettati.
- **Stack:** PixiJS/TypeScript e React/HTML/Vite confermati a gate C0 chiuso.
  Porting e parità applicativa rimangono attività C1–C2.
- **Conferma e riordino:** check dopo drop e tastiera accettati; scambio
  click/tap tolto con il pulsante «Riordina» (O1). In C1 la carta trascinata segue il puntatore a grandezza piena,
  sopra il dito su touch: confermato su iPhone dal proprietario; aspetto dei controlli in C4.
- **Origine STOMP locale:** il profilo `local` ammette una sola origine
  (`localhost:4200`). Il proxy di loopback di `client-web` la presenta solo per
  la propria pagina, senza modificare il server; per un ambiente condiviso
  serve una configurazione esplicita delle origini.
- **Contratto visivo:** accettare animazioni aggregate con le API correnti;
  valutare in seguito eventi strutturati/revisioni/ora server solo per esigenze
  dimostrate. Non condizionare la prima partita a un nuovo protocollo. Confermato
  per C3 dal proprietario (D1 del [piano C3](client-c3-plan.md)).
- **Lingua e audio:** proposta UI italiana con identificatori wire invariati;
  decidere suoni e volume iniziale. La copia di regole pubblicata deve restare
  identica alla fonte; nessuna traduzione normativa implicita.
- **Organizzazione:** disponibilità dei giocatori, responsabile dell'accettazione,
  tempo/budget e configurazioni per provare registrazione/admin. Resta da
  decidere come trattare in un'attività distinta il limite umano senza mosse,
  se le prove ne mostrano frequenza incompatibile con i playtest.

**Prossimo passo:** C3-1 del [piano C3](client-c3-plan.md), su istruzione del
proprietario e dopo la conferma delle decisioni D5–D11; l'attività A1 (tipo di
danno nel catalogo, dal regolamento) precede C3-5. Poi C4 (rifinitura
di art, audio, layout e prestazioni) e C5 (playtest finali). O15 e O16
(riepilogo del mazzo e deckbuilder più funzionale) vanno insieme in
un'attività successiva dedicata; O17 e O18 cambiano regole e protocollo:
attività separate, da aprire dal regolamento.
Nessuna prova sintetica vale come parità funzionale o partita reale.

## Revisioni

- **Versione 23 — 29 ottobre 2026, piano C3:** [piano C3](client-c3-plan.md) in sette
  blocchi, fondato su un'osservazione del server reale su database temporaneo. Il
  proprietario conferma D1–D4: risoluzione animata con i soli dati certi, tipo di
  danno da un campo del catalogo (A1, dal regolamento), frecce O6 verso i posti
  ammessi, nessuna animazione dopo un salto di turni. O7 non è più una decisione
  aperta. Nessuna regola, API o servizio cambiato.
- **Versione 22 — 29 ottobre 2026, riordino documentale prima di C3:** apertura
  ridotta a sintesi con rimando all'indice, «Prossimo passo» aggiornato (C3 è la
  prossima tappa), O15 e O16 assegnate dal proprietario a un'attività successiva
  dedicata, precisato che la prova del 27 ottobre che chiude C2a è distinta
  dalla prova umana B del 29 ottobre. Revisioni 1–20 archiviate; piano C2b
  spostato in `history/`. Nessuna regola, API o servizio cambiato.
- **Versione 21 — 29 ottobre 2026, chiusura di C2:** il proprietario chiude C2 dopo la
  prova umana B di C2b-7 (nessun blocco). O15 (riepilogo del mazzo) non si corregge in C2:
  va con il nuovo deckbuilder O16. O17 e O18 restano attività separate che partono dal
  regolamento. Nessuna regola, API o servizio cambiato.

- **Versioni 1–20 (26–29 ottobre 2026):** [archiviate](history/client-roadmap-revisions.md).

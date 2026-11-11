# Roadmap del prodotto — dopo C5 e il Set Base

Scritta il 10 novembre 2026 (versione 6 dell'11 novembre 2026: [lavori anticipati](#lavori-anticipati) e D22), a partire dalle idee del proprietario raccolte e riordinate con la regia lo stesso giorno.
**Solo roadmap:** come ogni roadmap (R00 del [regolamento](game-rules.md)), non introduce regole attive; le tappe che cambiano il
gioco aggiornano prima il regolamento o il documento interessato. Lo stato del progetto resta nell'[indice](README.md#stato-corrente);
qui ci sono l'ordine delle tappe, le decisioni prese e i punti critici. I piani di dettaglio, con blocchi e verifiche, si scrivono
all'avvio di ciascuna tappa, come per [C4](client-c4-plan.md) e il [Set Base](set-base-plan.md).

**Quando parte ([D1](#decisioni-del-proprietario)):** dopo la chiusura di C5. Nulla di questa roadmap interferisce con C4, C5 e i
blocchi del Set Base in corso. Le prove umane che quei piani chiedono le fa il proprietario come oggi; i ritorni di amici e tester
arrivati dopo si correggono dopo. **Eccezione ([D22](#decisioni-del-proprietario)):** il lavoro di progetto e di contenuto delle carriere,
che non tocca `client-web` né i piani in corso, procede già ora; lo stato è nella sezione [lavori anticipati](#lavori-anticipati).

## Punto di partenza

Cosa esiste già e verrà riusato:

- **Client web** PixiJS/TypeScript con shell React ([scelta dello stack](client-roadmap.md#stack-proporzionato-e-riuso-futuro)), a parità del
  debug dopo C5. Il tavolo calcola le posizioni da larghezza e altezza (`tableLayout`); il landscape è obbligatorio dal gate C0.
- **Server** Spring Boot con partite e connessioni STOMP/SockJS in memoria, quindi un'istanza sola; dati applicativi in un file SQLite.
- **Bot su vista limitata con stili** (SB-4), in partita dal blocco SB-30; **runner con seme** (SB-3) e **banco di misura** (SB-7) per
  misurare coi bot; **archivio ed export delle partite** ([contratto](match-archive.md)); **CLI** per gli scenari automatici.
- **Modalità** di R01: quick contro computer, quick 1v1, quick FFA, open contro computer. **Open PvP non è disponibile.**
- **Decisioni rinviate** che questa roadmap riprende: collezione ed economia ([Q12](open-questions.md)), Elo e classifiche ([Q18, R08](open-questions.md)),
  hosting pubblico e client dedicati ([perimetro del client](client-roadmap.md#perimetro-e-parità-funzionale)).

Il paletto della [rarità](set-base-plan.md#rarità) del Set Base resta valido ed è la prima difesa contro il «pay to win»: una rara può avere
un picco più alto, ma non può essere una comune migliore allo stesso costo.

## Filoni e ordine

| Filone | Tappe | Dipende da | In breve |
|---|---|---|---|
| [Strumenti](#st--strumenti-di-verifica) | ST-1 | C5 | Verifiche a livelli, prima di aggiungere orientamenti e piattaforme |
| [Deploy](#de--deploy-per-giocare-con-gli-amici) | DE-1…DE-3 | C5 | Istanza privata a costo zero, per il proprietario e amici su invito |
| [App](#ap--app-e-client-desktop) | AP-1…AP-3 | DE-1 | Il client web nei contenitori: prova con soglie, pacchetti per gli amici, store solo con l'apertura |
| [Verticale](#ve--tavolo-in-verticale) | VE-1…VE-3 | ST-1 | Duello e FFA col telefono in verticale |
| [Economia](#ec--economia) | EC-0…EC-2 | C5, SB-28 | Due valute, collezione posseduta, jolly, buste e negozio con le sole valute di gioco |
| [Carriera](#ca--carriera-single-player) | CA-0…CA-5 | SB-30, EC-0 | Tutorial, campagna principale a rami con achievement, completamento al 100%, endgame infinito, carriere di Sergio e Duccio |
| [PvP](#pv--pvp-e-classifica) | PV-1, PV-2 | EC-1, CA-2 | Mazzi costruiti contro persone, poi classifica del solo duello |
| [Apertura al pubblico](#pu--apertura-al-pubblico) | PU | decisione del proprietario | Registrazione aperta, parere legale e fiscale, acquisti con soldi veri, cosmetici, store |

**Ordine proposto.** Al massimo due filoni attivi insieme, come oggi, con file separati.

1. **Subito dopo C5:** ST-1 e DE-1.
2. **Poi:** AP-1, DE-2 e DE-3, VE-1 → VE-2 → VE-3; in parallelo, come soli documenti, EC-0 e CA-0.
3. **A Set Base trasferito nella partita viva (SB-28) e bot in partita (SB-30):** EC-1, CA-1, CA-2, EC-2, PV-1.
4. **Poi:** CA-3, CA-4, CA-5, AP-2 e le carriere successive.
5. **Quando ci sono abbastanza giocatori:** PV-2.
6. **Su decisione del proprietario:** PU, con AP-3.

## Lavori anticipati

Lavori di questa roadmap fatti prima che la sua tappa parta, per [D22](#decisioni-del-proprietario). **Questa tabella è la fonte del loro
stato:** si aggiorna a ogni passo, l'[indice](README.md#stato-corrente) ne riporta solo una riga corta. I documenti di dettaglio stanno nel
[serbatoio delle carriere](design/carriere/README.md) e nell'[identikit](design/set-base/identikit.md).

| Lavoro | Tappa | Stato | Documenti |
|---|---|---|---|
| Storia e dialoghi del tutorial | CA-1 | **Fatto** (10–11 novembre 2026), testo del proprietario; manca l'epilogo del fallimento | [scaletta](design/carriere/tutorial.md), [dialoghi](design/carriere/tutorial-dialoghi.md) |
| Identikit dei personaggi | CA, SB-32 | **Spazienzio, Mara e Piera approvati** (11 novembre 2026), originali di riferimento in git; gli altri quattro da fare | [identikit](design/set-base/identikit.md) |
| Specifica degli asset del dialogo | CA-0 | **Confermata** dalla fetta verticale (11 novembre 2026) | [specifica](design/carriere/specifica-asset.md) |
| Materiale visivo del tutorial | CA-1 | **Completo e approvato** (11 novembre 2026): 3 sfondi con 2 varianti, 15 ritratti, 3 pose di Grappino, la bici, 2 sagome. **Da aggiungere:** Mara e Spazienzio esasperati, per chi ascolta Piera (P8 del prototipo) | [fetta](design/carriere/prompt-fetta.md), [tre giri](design/carriere/prompt-tutorial-resto.md) |
| Nome del bar | CA | **Deciso** (11 novembre 2026): Il Serraglio, insegna «BAR IL SERRAGLIO»; resta se farne il titolo del gioco | [flavour](design/set-base/flavour.md#il-mondo) |
| **CA-0a** Prototipo delle carriere | CA-0 | **Fase A fatta e rivista; Fase B avviata** (11 novembre 2026) nella stessa sessione, per delega del proprietario; domande P1–P8 al proprietario | [prototipo](design/carriere/prototipo.md), [proposta della Fase A](design/carriere/prototipo-fase-a.md) |
| Epilogo del tutorial | CA-1 | Da scrivere: battute al Dimmi Di Sì per chi raggiunge gli amici | [dialoghi](design/carriere/tutorial-dialoghi.md#epilogo-del-fallimento--da-scrivere) |

**CA-0a, il prototipo.** È il primo pezzo di [CA-0](#ca--carriera-single-player) anticipato, usa e getta, in una cartella sua fuori da
`client-web`: definisce il formato dei dati delle carriere (nodi, scelte, segni, condizioni, battute), un convertitore dalle storie in
markdown, un lettore di scene con gli asset veri, la mappa dei rami, partite simulate con «vinci» e «perdi», una mini-carriera finta a
rombi e il controllo automatico del grafo. Formato, convertitore e controllo potranno passare in CA-0; il resto si butta.

## ST — Strumenti di verifica

Il giro completo delle verifiche del client dura già 41:43 con `-Parallel 4` ([C4-1c](client-c4-plan.md#c4-1c--verifiche-più-veloci)), su due
viewport più una terza per due verifiche. Ogni orientamento o piattaforma in più lo moltiplicherebbe.

**ST-1 Verifiche a livelli.** Tre livelli:

1. **Geometria fuori dal browser:** sovrapposizioni, dimensioni minime, aree sicure e leggibilità calcolate dalle funzioni pure della
   disposizione, come test unitari in Node, per tutte le viewport e gli orientamenti. Secondi, non minuti.
2. **Giri nel browser per blocco:** un caso per flusso e per orientamento (duello, FFA, mira, una risoluzione), scelti in base ai file cambiati.
3. **Matrice completa** solo a fine tappa, come la [matrice di fine C4](client-c4-plan.md#matrice-completa-di-fine-c4).

**Completamento verificabile:** tempo del giro per blocco misurato prima e dopo; nessun controllo indebolito, con gli stessi contatori
di casi visti e un difetto introdotto apposta ancora rilevato.

## DE — Deploy per giocare con gli amici

Pubblico: il proprietario e amici su invito ([D2](#decisioni-del-proprietario)). Costo zero, anche con un indirizzo provvisorio senza dominio ([D3](#decisioni-del-proprietario)).

**DE-1 Istanza privata.** Un container con server e client web statico; SQLite su un volume persistente; HTTPS; account creati dal
proprietario, quindi registrazione chiusa e niente server di posta; backup del file SQLite; rilascio dal ramo `main` con uno script.
Prima di esporre il servizio, un ricontrollo di sicurezza mirato: l'autorizzazione dei comandi è stata trattata nella base I22
([debito tecnico](technical-debt.md)), restano da guardare codici di verifica, limiti ai tentativi di accesso, credenziali di
amministrazione e log.

**Rimandati da C4 al primo client servito in rete,** quindi da fare in DE-1 (decisioni del proprietario dell'11 novembre 2026):

- **Peso e caricamento degli asset:** compressione e caricamento mirato, il punto 2 di [C4-8b](client-c4-plan.md#c4-8b--prestazioni-e-budget)
  («rimandiamolo a quando il client vivrà da qualche parte che non sia il locale»); per un client online il peso torna da valutare (D9
  rivista). Vale anche per gli asset delle carriere, che oggi pesano 0,5–0,6 MB a ritratto.
- **Dichiarazione sulle immagini generate e relative stringhe** nel client, rimandate in [C4-9](client-c4-plan.md#c4-9--consolidamento-e-giudizio-del-proprietario)
  («Rimanda (b)»).

Hosting, da riverificare all'avvio perché le offerte gratuite cambiano:

- **Strada principale:** una VM gratuita sempre accesa (per esempio Oracle Cloud «Always Free», ARM), con un sottodominio gratuito
  (DuckDNS, nip.io o sslip.io) e Caddy per il certificato. Limiti: carta di credito chiesta per la sola verifica; le macchine gratuite
  inattive a lungo possono essere riprese.
- **Ripiego:** il PC del proprietario esposto con un tunnel, Tailscale Funnel (indirizzo fisso `*.ts.net`) o Cloudflare quick tunnel
  (indirizzo che cambia a ogni avvio). Gratuito, con HTTPS e WebSocket, ma si gioca solo a PC acceso.
- **Escluse:** le piattaforme che spengono il servizio quando è inattivo o che non hanno disco persistente gratuito, perché partite
  e connessioni vivono nel processo.

**DE-2 Due ambienti.** «Vivo», con la partita del regolamento vigente, e «bozza» (profilo `bozza`, [avvio](setup.md#avvio-con-la-bozza-del-set-base-sb-8))
finché il Set Base è in bilanciamento; dati separati.

**DE-3 Ritorni dei tester.** Le partite giocate online restano nell'archivio e si esportano per il bilanciamento; un modo semplice per
segnalare un problema legato a una partita (il suo identificativo e una nota).

## AP — App e client desktop

**Giudizio della regia (10 novembre 2026).** Il client web è una base credibile per app e desktop. Il tavolo è disegnato su WebGL come un
gioco 2D; precedenti come Duelyst (gioco di carte HTML5 su Steam dentro Electron), Vampire Survivors e CrossCode hanno seguito questa
strada. La qualità percepita viene da illustrazioni, animazioni, suono e ritmo più che dal motore. Wrappare non basta da solo: restano
acquisti nelle app, regole degli store, prestazioni sulle WebView economiche, ciclo di vita dell'app (background, rete, audio su iOS),
aree sicure e orientamento.

**AP-1 Prova dei contenitori,** con soglie decise prima: Capacitor su Android (e iOS se c'è un Mac o una build in cloud gratuita), Tauri o
Electron su desktop. Si misurano fluidità, risposta al tocco (oggi 116 ms con deroga su iPhone, [C0](reports/client-c0-r5-procedure.md#esiti)),
memoria, ripresa dal background, riconnessione, peso e audio. **Esito:** una decisione, avanti con il web o valutare un client nativo.

**AP-2 Pacchetti per gli amici,** a costo zero: APK Android installato a mano, installabile desktop, su iPhone la versione web aggiunta
alla schermata Home a tutto schermo. Il contenitore blocca il landscape (o accoglie il verticale, VE) e recupera lo spazio della barra del
browser ([O28](client-roadmap.md#osservazioni-registrate-durante-c4)).

**AP-3 Store,** solo con l'apertura al pubblico: account sviluppatore Apple (99 $/anno) e Google Play (25 $ una volta), probabilità delle
buste pubblicate, acquisti tramite i sistemi di Apple e Google.

**Quando valutare un client nativo (per esempio Unity):** tavolo 3D, console, oppure AP-1 che fallisce le soglie dopo una
semplificazione mirata. Sarebbe una riscrittura del client; server, regole, protocollo e asset restano.

## VE — Tavolo in verticale

Riapre la decisione del gate C0 «landscape obbligatorio con richiesta di rotazione»; all'avvio di VE-1 la
[roadmap del client](client-roadmap.md) la registra con la motivazione. Le altre schermate ammettono già il verticale (D7 di C2b).
Viene dopo ST-1, per non raddoppiare i tempi delle verifiche, e meglio prima di AP-2.

**VE-1 Mockup,** come R1: duello e FFA in verticale, giudicati dal proprietario sul telefono prima di scrivere codice.

**VE-2 Duello in verticale.** Avversario in alto, giocatore in basso, mano a ventaglio sul fondo, mira trascinando verso l'alto; testo
completo a richiesta per le carte sovrapposte.

**VE-3 FFA in verticale** con gli avversari che scorrono ([D12](#decisioni-del-proprietario)): una fila compatta sempre visibile con tutti gli
avversari (volto, salute, uno o due stati) e sotto l'avversario aperto, che si cambia scorrendo o toccando la fila. La freccia di mira
punta al volto nella fila; durante la risoluzione il colpo si vede sulla fila o la scena apre l'avversario colpito. La rotazione a
partita in corso ridispone il tavolo senza perdere la selezione.

## EC — Economia

**Decisioni prese:** due valute ([D10](#decisioni-del-proprietario)), una «scarsa» che si guadagna anche solo giocando, così il gioco resta free to
play, e una «forte» che si compra con soldi veri o si vince in modi più ostici. Nomi a tema da trovare: esempi del proprietario sono
tappi di bottiglia e denti rotti. La valuta forte è l'unica cosa comprabile che incide sul gioco: buste e forse jolly ([D9](#decisioni-del-proprietario)).
I soldi veri restano fuori dall'implementazione fino all'apertura al pubblico. Jolly sì, fonti da decidere ([D8](#decisioni-del-proprietario)).
Cosmetici molto più avanti.

**EC-0 Progetto dell'economia,** solo documenti e simulatore:

- **Entrate e uscite** di ogni valuta; prezzi di buste, starter avanzati e jolly.
- **Buste:** carte per rarità, garanzia minima di rare, due personaggi da booster.
- **Jolly,** da bilanciare fra quattro fonti candidate: dentro le buste al posto di una carta, con garanzia ogni N buste; dai doppioni
  oltre le 2 copie utili (R02), convertiti in frammenti, che sono anche la protezione dai doppioni; dalle tappe importanti della
  carriera; con la valuta forte, solo dopo le simulazioni e con prezzo alto o limite, perché vuol dire comprare la carta esatta.
- **Tetti contro farming e inflazione:** ricompense giornaliere o decrescenti, decise dal server.
- **Obiettivo free to play misurabile:** per esempio un mazzo da classifica in N settimane di gioco normale.
- **Simulatore,** con la stessa cultura del banco di misura: guadagno medio per giorno, tempo per ogni traguardo.
- **Niente scambi fra giocatori** almeno all'inizio (truffe, commercio di account).

**EC-1 Collezione posseduta e registro dei movimenti.** Inventario per account, con gli starter base dati alla registrazione; valute
come movimenti (chi, quanto, perché, da dove), non come saldo; valuta forte guadagnata e comprata tenute separate fin da subito, per
rimborsi, storni e norme che le trattano in modo diverso; modello dati pronto anche per i cosmetici. **Tocca le regole:** R02 e le
modalità dovranno dire che un mazzo usa le carte possedute; l'accesso all'intero catalogo resta per test, bozza e strumenti (Q12).

**EC-2 Negozio con le valute di gioco:** buste, starter avanzati, jolly; probabilità delle buste dichiarate fin da ora.

**Punti critici.** «Pay to win» nella classifica, se le carte che contano si comprano: lo limitano il paletto della rarità, i jolly e
l'obiettivo free to play. Un'economia generosa nel single player senza tetti si svaluta. I soldi veri trasformano il progetto in
un'attività con aspetti fiscali e legali (sotto, [PU](#pu--apertura-al-pubblico)).

## CA — Carriera single player

**Decisioni prese:**

- **Tutorial,** poi una carriera contro il computer in cui si guadagnano carte e valuta.
- **Sblocchi:** il PvP a circa un terzo della campagna principale; gli starter avanzati lungo il percorso, non necessariamente insieme
  al PvP ([D5](#decisioni-del-proprietario)).
- **Avvincente da sola,** perché chi non vuole il PvP possa giocare solo quella; completarla al 100% richiede grind o acquisti ([D6](#decisioni-del-proprietario)).
- **Endgame infinito** per guadagnare valuta.
- **Più storie e più carriere** nel tempo ([D7](#decisioni-del-proprietario)): per il Set Base tutorial lineare, principale a rami e due
  secondarie, di Sergio e di Duccio ([D16, D17](#decisioni-del-proprietario)).
- **La FFA ha molto spazio nella carriera** ([D4](#decisioni-del-proprietario)), anche con varianti narrative come «ce l'hanno tutti con te» ([D11](#decisioni-del-proprietario)).
- **Una storia comica fa da filo conduttore,** con liti fra i personaggi, non una lista di partite ([D13](#decisioni-del-proprietario)).
- **Il giocatore è sé stesso e non parla mai** ([D14](#decisioni-del-proprietario)): a ogni incontro un frequentatore del bar prende le sue
  parti, ed è il personaggio che gioca, con un mazzo salvato di quel personaggio.
- **Racconto in stile visual novel,** con più testo ma senza esagerare, e dialoghi sempre saltabili, soprattutto quando si ritenta
  ([D15](#decisioni-del-proprietario)).

**Come si racconta: conseguenze di D13–D15** (ragionamento della regia, 10 novembre 2026).

- **Il personaggio lo sceglie la storia, il mazzo il giocatore.** Ogni incontro fissa l'alleato e l'avversario; il giocatore sceglie uno dei
  suoi mazzi salvati per quell'alleato, o lo starter se non ne ha. È la modalità open contro computer, con personaggi e avversario decisi
  dalla carriera.
- **Gli sblocchi diventano racconto.** La prima volta che un personaggio prende le parti del giocatore può consegnargli il suo starter: lo
  sblocco degli avanzati lungo il percorso ([D5](#decisioni-del-proprietario)) diventa una scena. Resta possibile comprarli prima con la valuta.
- **Alleati e avversari si scambiano i ruoli.** Chi ti difende in un capitolo può attaccare briga nel successivo: è il motore delle liti fra
  personaggi. Lo stesso personaggio dalle due parti del tavolo va evitato o giustificato con una battuta.
- **Le scelte restano mute.** Un protagonista muto non ha risposte da scegliere: la scelta è *con chi* andare, quando due personaggi si
  offrono, ed è quella che ramifica il percorso ([D16](#decisioni-del-proprietario)). Niente dialoghi a rami.
- **Coerente con il 100% ([D6](#decisioni-del-proprietario)).** Il percorso principale si completa con lo starter di ogni alleato; le sfide del
  100% chiedono mazzi migliori per ciascun personaggio, quindi collezione, tempo o valuta forte.
- **La scena di dialogo è un pezzo nuovo del client:** ritratti con espressioni, nome di chi parla, avanzamento, salto delle scene già viste e
  di tutte al ritentare, magari la cronologia delle battute. Va nella shell React/HTML, non nel tavolo Pixi, che costa meno anche nelle
  verifiche, e regge bene anche in verticale (VE). I testi stanno nei dati della carriera, non nel codice, anche in vista di traduzioni.
- **Costo:** i ritratti con più espressioni per personaggio sono illustrazioni in più rispetto a quelle delle carte (SB-32); la scrittura è
  tempo del proprietario, con stesure e varianti della regia segnate come tali.

**Rami, rigiocabilità e achievement: conseguenze di D16–D19** (ragionamento della regia, 10 novembre 2026).

- **Rami che si riuniscono.** La mappa è a rombi: i rami si dividono e si ritrovano nei capitoli chiave. Le scelte lasciano *segni* (chi ti è
  amico, chi ce l'ha con te) che cambiano battute e incontri successivi senza duplicare la storia; i contenuti crescono in modo lineare, non
  esponenziale. Alcune scelte chiudono altri rami: per vederli tutti si rigioca la carriera.
- **Sblocchi garantiti su ogni percorso.** Lo sblocco del PvP e i tre starter avanzati stanno su tutti i percorsi, nei capitoli dove i rami si
  riuniscono o con incontri garantiti. Solo su certi percorsi: boss segreti, superboss, ricompense extra.
- **Sconfitte.** Di norma si ritenta lo stesso incontro, coi dialoghi saltabili; ogni tanto una sconfitta apre un altro ramo invece di fermare.
- **Rigiocare senza rompere l'economia.** Ricompense piene solo alla prima vittoria di ogni incontro, ridotte dopo. Un nuovo giro azzera solo
  la storia: collezione, sblocchi e rami già esplorati restano sull'account.
- **Achievement come guida alla scoperta.** Dicono quali rami, boss segreti e obiettivi mancano, con indizi su come arrivarci, scritti nel
  tono del gioco e progressivi (prima vago, poi più chiaro). Si calcolano dagli stessi dati della carriera (nodi, segni, condizioni) e dagli
  esiti delle partite in archivio, lato server. Ricompense una tantum, quindi niente farming. Gli achievement nascosti restano «???» finché
  non arriva un indizio. Possono coprire anche collezione, FFA e, più avanti, PvP; un giorno si possono rispecchiare in quelli degli store.
- **Ordine di grandezza di partenza,** da correggere scrivendo le storie: principale con 15–20 incontri per giro e 30–40 nodi in tutto;
  secondarie con 8–12 nodi.

**CA-0 Motore e formato delle carriere.** Ogni carriera è un pacchetto di dati con un documento e una versione, come
[`docs/sets/base.md`](sets/base.md) per le carte. È un grafo: incontri come nodi (alleato e avversario, personaggi e mazzi, duello o FFA,
modificatori, testi e dialoghi, ricompense), scelte come archi, segni lasciati dalle scelte e condizioni sui nodi (rami presi, segni,
obiettivi secondari come «vinci con Mara in meno di N round»), più gli achievement con i loro indizi. Niente linguaggio di scripting: bastano
segni e condizioni. Un controllo automatico, come `check-rules.py` per le carte, verifica che ogni nodo sia raggiungibile, che non ci siano
vicoli ciechi, che PvP e starter avanzati stiano su ogni percorso e che ogni boss segreto e ogni achievement abbiano almeno un percorso; il
banco dei bot misura la difficoltà dei singoli incontri. Una nuova storia è contenuto, non codice, e può uscire con un'espansione. I **modificatori di incontro** sono deroghe alle regole: il regolamento li definisce come sistema, e il
documento della carriera elenca quelli concreti, con la stessa precedenza fra regolamento e set di R00. Fra i modificatori ci sono le
regole con cui i bot della FFA scelgono i bersagli. Di norma non si accaniscono tutti sul giocatore né si ignorano fra loro; «ce l'hanno
tutti con te» è una variante dichiarata.

**CA-1 Tutorial:** tre partite guidate, scriptate col runner con seme: duello con Mara contro Spazienzio, duello con Spazienzio contro
Piera, FFA a tre col personaggio scelto in silenzio fra i due. Insegnano costi e precedenza, bound, V e annullamento, FFA e last resort, e
sbloccano i due starter base; il tutorial si chiude con la risposta del giocatore ai messaggi della combriccola, che lo completa o lo fa
fallire. Scaletta e dialoghi in [carriere/tutorial.md](design/carriere/tutorial.md), dentro il
[serbatoio delle carriere](design/carriere/README.md). **Già pronto, in anticipo sulla tappa:** il materiale visivo del tutorial (sfondi,
ritratti, sprite), approvato l'11 novembre 2026 secondo la [specifica degli asset](design/carriere/specifica-asset.md); resta da costruire
la scena di dialogo nel client, con CA-0.

**CA-2 Campagna principale, primo terzo:** fino allo sblocco del PvP, con i primi starter avanzati. Per gli amici invitati serve un modo
per saltarla.

**CA-3 Resto della campagna e 100%.** Su due livelli: il percorso principale si completa con le carte che la carriera stessa dà, se si gioca
bene; il 100% (stelle, sfide extra, boss difficili, superboss finale) chiede una collezione migliore, quindi tempo o valuta forte. La
difficoltà viene da bot più bravi e mazzi più forti, misurata col banco prima della prova umana, mai da bot che vedono informazioni nascoste.
**L'unica eccezione è il superboss finale, che può barare** ([D11](#decisioni-del-proprietario)); la raccomandazione della regia è che bari
apertamente, con modificatori dichiarati e mostrati al tavolo (per esempio «vede la tua mano», «pesca due volte»), così resta una sfida e
non un inganno.

**CA-4 Endgame infinito:** corsa a tappe con modificatori e una sconfitta che la chiude; sfide giornaliere e settimanali; scala contro bot
sempre più forti. Ricompense con i tetti di EC-0.

**CA-5 Carriere secondarie di Sergio e Duccio** ([D17](#decisioni-del-proprietario)). Nella principale i due personaggi da booster si fanno
«annusare», come avversari o comparse, ma non si giocano. Chi trova il personaggio in una busta sblocca la sua mini-carriera: è anche
l'incentivo a comprare buste. Dipende da EC-2 (buste) e da CA-0. Per trovarli in un tempo ragionevole, buste speciali con un personaggio
non ancora posseduto come rara, offerte finché ne restano ([D20](#decisioni-del-proprietario)). Da decidere in EC-0: che cosa si ottiene col personaggio per avere subito un mazzo conforme a R02 (basic e bound, mazzo iniziale della
mini-carriera).

**Punti critici.** Tutta la carriera dipende dalla qualità dei bot, quindi da SB-30 e probabilmente da più livelli di difficoltà. Il costo vero
è il contenuto: scrittura, illustrazioni degli avversari, bilanciamento degli incontri. La CLI permette di giocare in automatico, quindi le
ricompense vanno protette dal farming lato server.

## PV — PvP e classifica

**PV-1 PvP con mazzi costruiti e sfide fra amici.** Oggi open PvP non esiste (R01): serve una modifica del regolamento, coi mazzi conformi a
R02 e alla collezione posseduta. Lo sblocco viene dalla carriera, con deroga per gli amici invitati. Quick resta com'è; le categorie base e
avanzata di SB-29 e gli starter posseduti decidono i personaggi ammessi.

**PV-2 Classifica del solo duello** ([D4](#decisioni-del-proprietario)). La FFA resta fuori dalla classifica, per alleanze tacite,
accordi fra amici in coda e giocatori già persi che decidono chi vince. Raccomandazione della regia: Glicko-2, un Elo migliorato; ai
giocatori si mostrano fasce con nomi a tema e stagioni con un azzeramento parziale, mentre il numero preciso resta nascosto. Risponde alle
domande di [R08](open-questions.md): niente bot nelle partite classificate; da decidere forfait e pareggio da riavvio. **Si apre solo quando ci
sono abbastanza giocatori** perché le attese siano brevi e il rating abbia senso; la soglia è da decidere.

## PU — Apertura al pubblico

Solo su decisione del proprietario ([D2](#decisioni-del-proprietario)). Comprende:

- **Registrazione e sicurezza:** registrazione aperta con email (server di posta), dominio, protezioni d'accesso, privacy e condizioni d'uso.
- **Parere legale e fiscale prima dei soldi veri.** Buste a sorpresa comprate con denaro: vietate in Belgio e discusse altrove,
  probabilità obbligatorie sugli store, indicazione PEGI. Principi europei sulle valute virtuali: prezzo reale chiaro, tutela dei minori.
  Poi IVA europea sui servizi digitali, commissioni degli store, rimborsi e storni, assistenza.
- **Prodotto:** acquisto della valuta forte, negozio completo, cosmetici, store (AP-3).

## Rischi trasversali

- **Scala.** Ogni filone è un prodotto a sé; le grandi produzioni reggono questo schema con squadre che producono contenuti di continuo.
  Ogni fase deve essere giocabile anche se le successive non arrivano.
- **Numero di giocatori.** Il PvP, e ancora di più la classifica, hanno senso solo con abbastanza persone online; la carriera deve reggere da sola.
- **Rarità e congelamento del set.** Le rarità del Set Base decidono quanto è difficile ottenere una carta. Cambiarle dopo SB-24 costerebbe
  molto di più: vedi la [domanda aperta](#domande-aperte) sulle linee guida delle buste.

## Decisioni del proprietario

Tutte del 10 novembre 2026, nella conversazione che ha prodotto questa roadmap.

| # | Decisione |
|---|---|
| D1 | Il deploy, e con lui questa roadmap, parte dopo la fine del client (C5), «per non avere troppa carne al fuoco e non interferire con lo svolgimento dei piani in corso». Le prove umane dei piani in corso le fa il proprietario; ritorni arrivati dopo si correggono dopo. |
| D2 | Per ora solo il proprietario e amici su invito; l'apertura al pubblico più avanti. |
| D3 | Costo zero se possibile, anche con un indirizzo provvisorio senza dominio. |
| D4 | Classifica solo per il duello; la FFA è per divertimento e verrà usata ampiamente nella carriera. |
| D5 | Il PvP si sblocca a circa un terzo della campagna principale, non necessariamente insieme agli starter avanzati. |
| D6 | La carriera deve essere avvincente e soddisfacente, giocabile anche senza mai fare PvP, e abbastanza difficile da chiedere grind o acquisti di valuta forte per il 100%. |
| D7 | Prevedere più storie e più carriere, scritte via via. |
| D8 | Jolly sì; da decidere come e dove si ottengono, anche se con la valuta forte. |
| D9 | Soldi veri fuori dall'implementazione; la valuta forte sarà l'unica cosa comprabile con soldi veri che incide sul gioco (buste e forse jolly). Cosmetici molto più avanti. |
| D10 | Due valute, una scarsa guadagnabile giocando e una forte comprabile o vincibile in modi più ostici, con nomi a tema (esempi: tappi di bottiglia, denti rotti). |
| D11 | Varianti narrative nella FFA della carriera, come «ce l'hanno tutti con te»; per il 100% un superboss finale che può anche barare. |
| D12 | Nella FFA in verticale gli avversari scorrono. |
| D13 | Le carriere hanno una storia che fa da filo conduttore, con liti fra personaggi in chiave comica come tutto il tono del gioco: tutorial, carriera principale del Set Base e una carriera secondaria sbloccabile con un obiettivo secondario della principale. Le storie le inventa il proprietario («sono un vulcano di idee bislacche»). |
| D14 | Il giocatore è sé stesso, non uno dei personaggi, e non parla mai direttamente. La gente del bar prende di volta in volta le sue parti, e chi lo fa è il personaggio che gioca, con la scelta di un suo mazzo salvato per quel personaggio. Esempio del proprietario: qualcuno attacca briga col giocatore, Spazienzio dice «oh, non preoccuparti, so esattamente cosa fare con quelli come lui», poi scelta del mazzo e duello. |
| D15 | Più testo, senza esagerare coi dialoghi, in uno stile da visual novel; dialoghi sempre saltabili, importante quando si ritenta. |
| D16 | Il giocatore sceglie con chi andare e il percorso si ramifica, come una mappa a rami: alcune scelte ne precludono altre, per esplorare tutti i rami si rigioca la carriera, e boss segreti e superboss si raggiungono prendendo determinati percorsi. Sblocco del PvP e starter avanzati su ogni percorso. Ogni tanto una sconfitta apre un altro ramo. Ricompense piene alla prima vittoria di un incontro e ridotte dopo; un nuovo giro azzera solo la storia. |
| D17 | Carriere previste: tutorial (lineare), principale del Set Base e due secondarie, una di Sergio e una di Duccio. Nella principale si fanno «annusare»; la loro mini-carriera si sblocca trovandoli nelle buste, come incentivo a comprarle. Supera, per le secondarie, lo sblocco con un obiettivo secondario della principale detto in D13. |
| D18 | Lo starter avanzato di un personaggio arriva come ricompensa la prima volta che prende le parti del giocatore; Sergio e Duccio, solo da booster, nella principale non si giocano. |
| D19 | Un sistema di achievement fa sapere al giocatore quali rami della carriera gli mancano da scoprire e gli dà indizi su come arrivarci. |
| D20 | Direzione per trovare Sergio e Duccio in un tempo ragionevole (esempio del proprietario, da dettagliare in EC-0): buste speciali in cui la rara è sicuramente un personaggio non ancora in collezione, che non vengono più offerte quando non restano personaggi di quel set da trovare. |
| D21 | Le battute delle carriere che si rivolgono al giocatore o parlano di lui sono neutre rispetto al genere. |
| D22 | (11 novembre 2026) Il lavoro sulle carriere che non tocca il client né i piani in corso procede in anticipo, in parallelo a C5 e al Set Base: storie, identikit, materiale visivo e ora il prototipo («potremmo cominciare a fare il prototipo che si diceva per le carriere?»). La roadmap tiene traccia di questi lavori («utilizziamola per segnarci quello che facciamo»). |

## Domande aperte

1. **Linee guida delle buste prima di SB-24?** Contenuto delle buste per rarità e modo di ottenere i due personaggi da booster, per non
   dover toccare le rarità dopo il congelamento del set. È l'unico punto di questa roadmap che toccherebbe un piano in corso.
2. **Jolly:** quali delle quattro fonti candidate, e se comprabili con la valuta forte (EC-0).
3. **Durata della campagna principale** e del percorso fino allo sblocco del PvP.
4. **Nomi delle due valute.**
5. **Superboss:** bara apertamente, come raccomanda la regia, o in modo nascosto?
6. **Soglia di giocatori** per aprire la classifica (PV-2).
7. **Hosting di DE-1,** scelto all'avvio dopo aver riverificato le offerte gratuite.
8. **Sergio e Duccio nelle buste:** la direzione per la garanzia è data ([D20](#decisioni-del-proprietario)); resta da decidere in EC-0
   cosa si riceve col personaggio per giocare subito la sua mini-carriera (CA-5), e il prezzo di quelle buste in ciascuna valuta.
9. **Achievement:** quali ricompense (valuta una tantum, cosmetici come titoli o dorsi) e se gli indizi sono tutti gratuiti.

## Revisioni

- **Versione 1 — 10 novembre 2026:** prima stesura dalle idee del proprietario; filoni ST, DE, AP, VE, EC, CA, PV, PU; decisioni D1–D12.
- **Versione 2 — 10 novembre 2026:** come si racconta la carriera (D13–D15), con le conseguenze ragionate e le domande 8–10.
- **Versione 3 — 10 novembre 2026:** rami e rigiocabilità, quattro carriere, starter come ricompensa, achievement (D16–D19), buste speciali per Sergio e Duccio (D20); carriere
  secondarie di Sergio e Duccio come CA-5; formato delle carriere come grafo con controllo automatico; domande 8–10 della versione 2 decise
  e sostituite.
- **Versione 4 — 10 novembre 2026:** CA-1 descritto con le tre partite della scaletta del tutorial; aperto il
  [serbatoio delle carriere](design/carriere/README.md).
- **Versione 6 — 11 novembre 2026:** sezione dei lavori anticipati, che tiene lo stato del lavoro sulle carriere fatto prima della tappa;
  D22; CA-0a, il prototipo delle carriere.
- **Versione 5 — 10 novembre 2026:** battute neutre sul giocatore (D21); CA-1 con la scelta finale del tutorial, dialoghi scritti dal
  proprietario.

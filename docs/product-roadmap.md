# Roadmap del prodotto — dopo C5 e il Set Base

Scritta il 10 novembre 2026 (versione 1), a partire dalle idee del proprietario raccolte e riordinate con la regia lo stesso giorno.
**Solo roadmap:** come ogni roadmap (R00 del [regolamento](game-rules.md)), non introduce regole attive; le tappe che cambiano il
gioco aggiornano prima il regolamento o il documento interessato. Lo stato del progetto resta nell'[indice](README.md#stato-corrente);
qui ci sono l'ordine delle tappe, le decisioni prese e i punti critici. I piani di dettaglio, con blocchi e verifiche, si scrivono
all'avvio di ciascuna tappa, come per [C4](client-c4-plan.md) e il [Set Base](set-base-plan.md).

**Quando parte ([D1](#decisioni-del-proprietario)):** dopo la chiusura di C5. Nulla di questa roadmap interferisce con C4, C5 e i
blocchi del Set Base in corso. Le prove umane che quei piani chiedono le fa il proprietario come oggi; i ritorni di amici e tester
arrivati dopo si correggono dopo.

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
| [Carriera](#ca--carriera-single-player) | CA-0…CA-4 | SB-30, EC-0 | Tutorial, campagna principale, completamento al 100%, endgame infinito, più carriere |
| [PvP](#pv--pvp-e-classifica) | PV-1, PV-2 | EC-1, CA-2 | Mazzi costruiti contro persone, poi classifica del solo duello |
| [Apertura al pubblico](#pu--apertura-al-pubblico) | PU | decisione del proprietario | Registrazione aperta, parere legale e fiscale, acquisti con soldi veri, cosmetici, store |

**Ordine proposto.** Al massimo due filoni attivi insieme, come oggi, con file separati.

1. **Subito dopo C5:** ST-1 e DE-1.
2. **Poi:** AP-1, DE-2 e DE-3, VE-1 → VE-2 → VE-3; in parallelo, come soli documenti, EC-0 e CA-0.
3. **A Set Base trasferito nella partita viva (SB-28) e bot in partita (SB-30):** EC-1, CA-1, CA-2, EC-2, PV-1.
4. **Poi:** CA-3, CA-4, AP-2 e le carriere successive.
5. **Quando ci sono abbastanza giocatori:** PV-2.
6. **Su decisione del proprietario:** PU, con AP-3.

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
- **Più storie e più carriere** nel tempo ([D7](#decisioni-del-proprietario)).
- **La FFA ha molto spazio nella carriera** ([D4](#decisioni-del-proprietario)), anche con varianti narrative come «ce l'hanno tutti con te» ([D11](#decisioni-del-proprietario)).

**CA-0 Motore e formato delle carriere.** Ogni carriera è un pacchetto di dati con un documento e una versione, come
[`docs/sets/base.md`](sets/base.md) per le carte. Contiene capitoli e incontri: avversario con nome, personaggio e mazzo (i frequentatori del
bar), duello o FFA, modificatori, condizioni di sblocco, ricompense, testi e dialoghi. Una nuova storia è contenuto, non codice, e può
uscire con un'espansione. I **modificatori di incontro** sono deroghe alle regole: il regolamento li definisce come sistema, e il
documento della carriera elenca quelli concreti, con la stessa precedenza fra regolamento e set di R00. Fra i modificatori ci sono le
regole con cui i bot della FFA scelgono i bersagli. Di norma non si accaniscono tutti sul giocatore né si ignorano fra loro; «ce l'hanno
tutti con te» è una variante dichiarata.

**CA-1 Tutorial:** tre o quattro partite guidate brevi con i due starter base, scriptate col runner con seme, che insegnano risorse,
bound, last resort e risoluzione del round.

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

## Domande aperte

1. **Linee guida delle buste prima di SB-24?** Contenuto delle buste per rarità e modo di ottenere i due personaggi da booster, per non
   dover toccare le rarità dopo il congelamento del set. È l'unico punto di questa roadmap che toccherebbe un piano in corso.
2. **Jolly:** quali delle quattro fonti candidate, e se comprabili con la valuta forte (EC-0).
3. **Durata della campagna principale** e del percorso fino allo sblocco del PvP.
4. **Nomi delle due valute.**
5. **Superboss:** bara apertamente, come raccomanda la regia, o in modo nascosto?
6. **Soglia di giocatori** per aprire la classifica (PV-2).
7. **Hosting di DE-1,** scelto all'avvio dopo aver riverificato le offerte gratuite.

## Revisioni

- **Versione 1 — 10 novembre 2026:** prima stesura dalle idee del proprietario; filoni ST, DE, AP, VE, EC, CA, PV, PU; decisioni D1–D12.

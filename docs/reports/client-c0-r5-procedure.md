# C0-R5 — Prova touch fisica e accettazione umana

27 ottobre 2026. Procedura per i due criteri ancora aperti del gate C0
([roadmap](../client-roadmap.md), [rapporto R2–R5](client-c0-r2-report.md)).
**Esito: C0 chiusa il 27 ottobre 2026**, con deroga del proprietario sulla
soglia input e revisione umana superata con riserve ([chiusura](#chiusura-del-gate)).
Nessuna emulazione ha sostituito questi passaggi; C1 non inizia senza istruzione esplicita.

## Evidenze già presenti

Situazione all'avvio della procedura; gli esiti A/B sono registrati [sotto](#esiti).

| Area | Stato | Fonte |
|---|---|---|
| R1 riferimento visivo | Approvato dal proprietario | [approval.md](../design/client-c0/r1/approval.md) |
| R2–R4 scena interattiva | Implementata, prove automatiche PASS | [verification.json](client-c0-r2/verification.json), [lifecycle.json](client-c0-r2/lifecycle.json) |
| Fluidità desktop 1366×768 | PASS, 62,75 s, 99,99% ≤20 ms | [performance.json](client-c0-r2/performance.json) |
| Touch emulato 844×390 sul PC | PASS solo come emulazione | idem |
| Peso | 255386 B JS gzip, 941002 B totali, PASS | [size.json](client-c0-r2/size.json) |
| Touch fisico 60+ s | **Mancante** | questa procedura, parte A |
| Giudizio umano al minimo e orientamento | **Mancante** | questa procedura, parte B |

## Strumento di cattura

`./client-c0/revision/run.ps1 -Task Physical` serve la build di produzione
**invariata** su 127.0.0.1:4310 e verifica all'avvio che i suoi hash coincidano
con la build misurata su PC. Solo nella pagina servita da questo comando inietta
[physical-probe.js](../../client-c0/revision/tools/physical-probe.js): un piccolo
cartiglio non interattivo in alto a sinistra, aggiornato una volta al secondo.
La cattura parte al **primo tocco touch** dopo il caricamento (un clic del mouse
non la avvia), dura 65 s, usa la stessa telemetria `__c0.measureStart/End` del
desktop e invia al PC frame, input, eventi puntatore, background, resize e
dati del dispositivo. Il file va in `docs/reports/client-c0-r2/physical/`
con le stesse soglie: ≥95% intervalli ≤33 ms, input→feedback ≤100 ms, ≥60 s.

Il file è marcato `physical-touch-candidate` con `operatorAttestation: null`:
il browser non può distinguere un dito reale da un tocco iniettato. Diventa
evidenza fisica solo con la dichiarazione dell'operatore su modello e input.
L'autoverifica dello strumento è stata fatta in emulazione headless, con
output fuori dal repository: non costituisce una cattura.

## Parte A — Cattura sul telefono (circa 10 minuti)

Preparazione, una volta sola, su telefono Android con Chrome:

1. Attivare Opzioni sviluppatore e **Debug USB**; collegare il cavo al PC e
   accettare sul telefono l'autorizzazione del PC.
2. Sul PC, in Edge: `edge://inspect/#devices`, spuntare *Discover USB devices*,
   poi *Port forwarding…*: porta `4310` → `localhost:4310`, attivare
   *Enable port forwarding*. Il telefono deve comparire nell'elenco.
   Edge usa il proprio ADB integrato; non serve installare altro.
3. Sul PC: `./client-c0/revision/run.ps1 -Task Physical`. Deve stampare
   «stessa build misurata: sì».

Il traffico passa sul cavo verso il loopback del PC: la scena non è esposta
alla rete locale.

### Variante iPhone via rete locale

Da Windows non esiste l'inoltro USB verso Safari: il server si apre alla rete
locale soltanto durante la prova, con queste protezioni dello strumento:
un solo indirizzo IPv4 privato del PC (mai 0.0.0.0 o indirizzi pubblici), un
codice d'accesso casuale nuovo a ogni avvio, risposta 403 a pagina, asset e
invio dati senza il codice, elenco a terminale dei dispositivi ammessi. Ctrl+C
chiude tutto. Nel file di cattura è registrato il trasporto `lan-access-code`.

1. iPhone sulla stessa rete del PC; Wi-Fi di casa, non una rete pubblica.
2. Sul PC, in PowerShell dalla radice:
   `$env:C0_PHYSICAL_HOST='lan'; ./client-c0/revision/run.ps1 -Task Physical`
   e, a prova finita, `Remove-Item Env:C0_PHYSICAL_HOST`. Il terminale stampa
   l'indirizzo completo `http://192.168.x.x:4310/?k=…`.
3. Se Windows chiede di consentire `node.exe`: è una tua decisione. Basta
   *Reti private*; la regola si può togliere dopo da *Windows Defender
   Firewall → App consentite*. Lo strumento non modifica il firewall.
4. Su iPhone: Safari, digitare l'indirizzo con il codice. **Modalità risparmio
   energetico disattivata**: limita le animazioni a 30 fps e falserebbe la misura.

Differenze da annotare: Safari non espone il modello nel browser, quindi va
dichiarato; Safari limita di norma l'animazione a 60 Hz anche su ProMotion; la
barra degli indirizzi riduce lo spazio in landscape (lo strumento registra le
misure CSS effettive). Su questo PC non c'è un motore WebKit: la scena **non è
mai stata provata in Safari**, quindi la prima apertura è anche una prova di
compatibilità. Segnalare in particolare lente o menu da pressione prolungata,
selezione di testo, rimbalzo della pagina, gesto indietro dal bordo.

Esecuzione:

1. Telefono in **landscape**, risparmio energetico disattivato, nessun'altra
   app pesante. Aprire `http://localhost:4310` in Chrome (Android) oppure
   l'indirizzo con codice in Safari (iPhone).
2. Attendere «Cattura · tocca il tavolo per iniziare», poi giocare per tutto
   il conto alla rovescia con le dita, senza fermarsi a lungo:
   - toccare una carta e poi un avversario; annullare con ×;
   - trascinare una carta su un personaggio e una su una carta oggetto; check;
   - giocare una bound scegliendo lo scarto dalla mano; annullare;
   - trascinare entro la mano per riordinare; usare «Riordina» per uno scambio;
   - aprire «Dettagli carta» e richiudere;
   - ••• → Laboratorio → «FFA cinque · riparti», poi ••• → Laboratorio →
     «Vista turno successivo», due o tre volte nel corso della prova, per
     includere le animazioni. «Vista turno successivo» carica sempre lo
     stesso turno fisso: ripeterlo senza «riparti» non anima di nuovo.
3. Alla fine compare «Cattura salvata · soglie OK/da rivedere · file». Non
   ricaricare prima di questo messaggio. Il terminale del PC riporta il riepilogo.
4. Comunicare: modello, versione del sistema (Android/iOS), browser e
   versione, frequenza dello schermo se impostata (60/90/120 Hz), conferma che
   l'input era il dito sul vetro, eventuali scatti o gesti di sistema indesiderati.

Se le soglie non passano: annotare, non ripetere a oltranza. Una sola
semplificazione mirata della scena, poi nuova cattura con le stesse soglie;
se il limite persiste, confronto DOM/SVG come previsto dalla roadmap.

## Parte B — Accettazione umana al minimo (circa 10 minuti)

Fermare Physical (Ctrl+C) e avviare `./client-c0/revision/run.ps1 -Task Serve`:
stessa porta e stesso inoltro, scena senza cartiglio. Su iPhone Serve è solo
loopback: usare invece `$env:C0_PHYSICAL_PROBE='0'` con `C0_PHYSICAL_HOST='lan'`
e `-Task Physical`, che serve la stessa build senza sonda e con un nuovo
codice; poi rimuovere entrambe le variabili. Valutare sul telefono,
in landscape, ricaricando (••• → Laboratorio → «FFA cinque · riparti») se serve.

| # | Domanda | Esito (sì / no / con riserva) e nota |
|---|---|---|
| B1 | L'insieme si legge come una partita a carte in un bar marcio, coerente con R1? | |
| B2 | Si riconoscono i cinque posti, le quattro mani coperte e a chi appartiene ogni carta oggetto? | |
| B3 | Nome, costo e priorità delle carte in mano si leggono senza zoom; il dettaglio lungo si apre e si chiude bene? | |
| B4 | Riordino a trascinamento e scambio «Riordina» funzionano senza errori di presa? | |
| B5 | Il dito colpisce il bersaglio voluto, personaggio e carta oggetto vicina, senza sbagliare sede? | |
| B6 | Scarto bound, check e annulla sono raggiungibili e comprensibili? | |
| B7 | «Mossa accettata» e «Rifiuto» dal laboratorio sono distinguibili nel tavolo? | |
| B8 | 844×390 o lo spazio reale di Chrome sul telefono basta per giocare senza scorrere? | |
| B9 | Ruotando in portrait, la richiesta di rotazione è accettabile rispetto a un layout verticale? | |

Decisione finale: **landscape obbligatorio con richiesta di rotazione** oppure
**layout portrait da realizzare** (che rientrerebbe in una modifica mirata
prima della chiusura). Elencare eventuali blocchi in ordine d'impatto.

## Chiusura

C0 si chiude solo se A passa con attestazione dell'operatore e B non presenta
blocchi che impediscono il gioco. Gli esiti vanno in questo documento, nel
[rapporto](client-c0-r2-report.md), in [delivery.json](client-c0-r2/delivery.json)
e nello stato del gate della [roadmap](../client-roadmap.md). Riserve minori
diventano note per C1/C4; un blocco richiede correzione e nuova verifica.

## Esiti

### A1 — iPhone 16 Pro, 27 ottobre 2026: **non superata**

Dispositivo e input dichiarati dal proprietario: iPhone 16 Pro, Safari, dita
sul vetro, nessun problema grafico, tutto visibile. User agent: iOS 18.7,
Safari 27.0.1. Rete locale con codice d'accesso. Viewport landscape effettiva
**750×292 CSS px**, DPR 3. [Cattura](client-c0-r2/physical/capture-2026-10-27T12-14-14-727Z.json).

| Misura | Valore | Soglia | Esito |
|---|---:|---:|---|
| Durata | 65,5 s | ≥60 s | PASS |
| Intervalli ≤33 ms | 96,3% (mediana 17 ms, 60 Hz) | ≥95% | PASS stretto |
| Input→feedback | mediana ~85 ms, p95 121 ms, max 125 ms | ≤100 ms | **FAIL** |
| Tocchi e trascinamenti | 51 tocchi, 533 movimenti touch | — | — |
| Animazioni di risoluzione | 0 sequenze | da includere | non coperte |

Diagnosi sul PC, con profilo CPU: ogni tocco ridisegna l'intero tavolo. I
titoli lunghi venivano riadattati misurando il testo con ritorno a capo
a ogni lettera tolta: circa 500 misure di testo e 2500 di parole per tocco.
Poi le texture dei testi erano rasterizzate di nuovo, perché i nodi vecchi
venivano distrutti prima del render. I frame lenti coincidono con i tocchi.

**Semplificazione mirata, unica:** titolo adattato calcolato una volta per
dimensione; nodi vecchi distrutti dopo il render successivo, così Pixi riusa
le texture dei testi. Nessun cambiamento di aspetto, gesti o soglie. Stima
diagnostica sul PC con CPU rallentata 6× e 750×292/DPR 3 emulati: input
mediano 160→86 ms, p95 210→110 ms, p95 frame 73→25 ms. **Non è una misura
del telefono.** Dopo la correzione: test 8 PASS, Verify 3 viewport e 10 casi
di ciclo di vita PASS, peso 255535 B JS / 941150 B totali PASS, misure PC
ripetute PASS (desktop 99,96% ≤20 ms, input max 28 ms; emulazione 100%
≤33 ms, input max 21 ms).

Serve una **nuova cattura A2 sull'iPhone** con la build corretta, includendo
due o tre volte «Vista turno successivo». La viewport reale 750×292 è sotto
il minimo proposto 844×390: geometria verificata in emulazione (bersagli ≥44
px, nulla fuori schermo), ma la valutazione B la deve giudicare sul telefono.

### A2 — iPhone 16 Pro, build corretta, 27 ottobre 2026: **non superata**

Stesso iPhone, Safari e operatore della A1, dita sul vetro; viewport 750×292,
DPR 3; build identica a quella misurata su PC. [Cattura](client-c0-r2/physical/capture-2026-10-27T12-29-18-527Z.json).

| Misura | A1 | A2 | Soglia | Esito A2 |
|---|---:|---:|---:|---|
| Intervalli ≤33 ms | 96,3% | 98,7% (p95 19 ms) | ≥95% | PASS |
| Input→feedback max | 125 ms | 116 ms | ≤100 ms | **FAIL** |
| Input tipico su tocco che ridisegna | ~85 ms | 70–90 ms | — | — |
| Animazioni di risoluzione | 0 | 1 (1217 ms) | incluse | coperte |

La semplificazione migliora i frame ma non porta l'input entro soglia: ogni
tocco che cambia la scelta ricostruisce ancora tutto il tavolo, e su Safari
questo costa circa 55–75 ms oltre al frame di attesa compreso nella misura.
I tocchi che non ridisegnano rispondono in circa 15 ms.

Segnalazione del proprietario: dopo una carta su sé stessi, «Vista turno
successivo» non faceva più niente. Riprodotto in emulazione: la prima
pressione funziona anche dopo una carta su SELF, la seconda riceve lo stesso
turno fisso e mostra solo «Stato aggiornato». È il comportamento previsto
contro le doppie animazioni. La causa è l'istruzione di questa procedura,
ora corretta; la scena non è modificata.

**Stato:** la soglia input fallisce dopo l'unica semplificazione mirata.

**Decisione del proprietario, 27 ottobre 2026:** fluidità percepita
accettabile sul telefono; non insistere ora sulle prestazioni. Il criterio
fisico è **accettato con deroga**, non superato: valori registrati invariati
(input max 116 ms contro 100 ms), soglie non modificate. Il confronto DOM/SVG
non si esegue. Il ridisegno incrementale del tavolo, invece della ricostruzione
completa a ogni tocco, resta un'attività nota da riconsiderare in C4 con le
stesse soglie, o prima se in C1 il ritardo diventa percepibile.

### B — Revisione del proprietario su iPhone 16 Pro, 27 ottobre 2026

Scena di revisione senza sonda, stessa build, Safari landscape 750×292.

| # | Esito | Nota del proprietario |
|---|---|---|
| B1 Atmosfera | Sì | — |
| B2 Sedi, mani coperte, proprietari | Sì | — |
| B3 Lettura e dettaglio | Sì, con riserva | Dettagli grafici da rifinire più avanti. |
| B4 Riordino | Sì, con riserva | Poco intuitivo: la carta presa deve seguire dito o mouse durante il trascinamento. |
| B5 Mira | Sì | — |
| B6 Bound, check, annulla | Sì, con riserva | Aspetto dei controlli da migliorare. |
| B7 Accettata e rifiuto | Sì | — |
| B8 Spazio al minimo | Sì | La barra di Safari occupa molto spazio; un futuro contenitore a schermo intero lo risolverà. |
| B9 Portrait | Sì | Per ora richiesta di rotazione. |

**Decisione: landscape obbligatorio con richiesta di rotazione.** Nessun
layout verticale per ora. Nessun blocco che impedisca il gioco; le riserve
non sono correzioni da fare prima della chiusura.

## Chiusura del gate

**C0 chiusa il 27 ottobre 2026 su decisione del proprietario.** Criterio
fisico accettato con deroga (input 116 ms contro 100 ms, soglie invariate);
revisione umana superata con riserve; landscape forzato. Stack confermato:
PixiJS/TypeScript per il tavolo, React/HTML per shell e dettagli, Vite.

Note che entrano nelle tappe successive, senza essere già realizzate:

- **C1:** durante il trascinamento la carta presa segue il dito o il mouse in
  modo evidente, sia per calare sia per riordinare (riserva B4). Tenere
  d'occhio la risposta al tocco, misurata a 116 ms.
- **C4:** ridisegno incrementale del tavolo con le soglie di C0; rifinitura
  di dettagli grafici e controlli bound/check/annulla (B3, B6); nuova misura
  fisica a parità completa.
- **Futuro contenitore a schermo intero:** recupera lo spazio della barra del
  browser (B8). Resta fuori dal perimetro corrente del client web.

C1 non è iniziata e richiede un'istruzione esplicita del proprietario.

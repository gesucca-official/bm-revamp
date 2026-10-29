# Client web animato (C1, C2a, O9, C2b-1…C2b-7, C3-1, C3-2)

Il tavolo del bar approvato in C0, collegato al server reale. Percorso disponibile:
home (regole, registrazione) → login → hub «Gioca» (contro il computer, uno contro uno, tutti contro tutti fino a
cinque o contro il computer con un mazzo salvato) → partita → esito → nuova partita
nella stessa modalità oppure ritorno all'hub; scheda «Collezione» con catalogo ed
editor dei mazzi; scheda «Profilo» con il pannello di amministrazione per il ruolo
ADMIN; segnalazione al server degli errori non gestiti. Lo stato delle tappe è
nell'[indice della documentazione](../docs/README.md#stato-corrente); il
[rapporto C2](../docs/reports/client-c2-report.md) e il
[piano C2b (storico)](../docs/history/client-c2b-plan.md) descrivono come ci si è arrivati. La scena C0 resta congelata in
[client-c0/revision](../client-c0/revision/README.md) come evidenza del gate.

C2a aggiunge la leggibilità di base (O11–O14): carte più grandi, ruolo e
guadagni sulle carte, plancia delle risorse, carte non pagabili attenuate.
Ruolo e guadagni vengono dal catalogo (regolamento 1.7, R07a); nessuna regola
è calcolata qui. O9 aggiunge le illustrazioni provvisorie delle 40 classi
([rapporto C2](../docs/reports/client-c2-report.md)).

## Avvio locale

Dalla radice del repository, Windows / PowerShell, in due terminali:

```powershell
./scripts/dev.ps1 -Task Server -SeedAccounts
```

```powershell
# Solo la prima volta (Node isolato condiviso con C0, dipendenze separate):
./client-c0/run.ps1 -Task Bootstrap
./client-web/run.ps1 -Task Install
./client-web/run.ps1 -Task Build
./client-web/run.ps1 -Task Serve
```

Aprire `http://127.0.0.1:4320` e accedere con un account sintetico della
[guida locale](../docs/setup.md). `Serve` usa la build di produzione (`vite preview`);
`Dev` avvia il server di sviluppo sulla stessa porta. Entrambi ascoltano solo su
loopback e fanno da proxy come il debug: `/rest` → `/api/rest/v1`, `/ws` →
`/api/ws/v1` su `127.0.0.1:8080` (variabile `BM_SERVER` per cambiarlo).

**Origine STOMP.** Il profilo `local` del server accetta una sola origine
(`stomp.allowedOrigin`, `http://localhost:4200`, quella del debug). Il proxy di
[vite.config.ts](vite.config.ts) presenta quell'origine **solo** per le richieste
che provengono dalla pagina del client stesso (`127.0.0.1:4320` o `localhost:4320`);
ogni altra origine passa invariata e il server continua a rifiutarla. Il server non
è modificato. `BM_STOMP_ORIGIN` cambia il valore se il profilo cambia.

## Prova su telefono (rete locale)

Il telefono non raggiunge il loopback del PC. Con il server avviato come sopra:

```powershell
./client-web/run.ps1 -Task Physical
```

Ricompila e serve la build sull'indirizzo privato del PC (`BM_LAN=lan` sceglie
il primo IPv4 privato, preferendo 192.168.x; `BM_LAN=<ip>` ne fissa uno). Stampa
un indirizzo con codice d'accesso monouso, per esempio
`http://192.168.1.79:4320/?k=…`: aprirlo sul telefono, nella stessa Wi-Fi.
Il codice imposta un cookie e cambia a ogni avvio; senza cookie ogni richiesta,
WebSocket compreso, riceve 403 o viene chiusa. Il server di gioco resta su
loopback dietro il proxy, che riconosce come pagina propria anche l'indirizzo
LAN. Al primo avvio Windows può chiedere di consentire Node sulle reti private.
Ctrl+C chiude; mentre è attivo, `127.0.0.1:4320` non risponde.

## Home, regole e registrazione (C2b-5)

Prima del login la pagina sceglie la schermata dall'hash, senza dipendenze di routing:
`#/` home, `#/regole`, `#/accedi`, `#/registrati` (ogni altro hash è la home). Indietro e
avanti del browser funzionano; dopo «Esci» si torna alla home, un login rifiutato resta
sul modulo con il messaggio. Fuori dal tavolo il portrait è ammesso (D7): il foglio scorre
in verticale, mai la pagina in orizzontale.

- **Home**: presentazione, «Accedi», «Registrati», «Regole» e una sezione secondaria con
  gli stessi collegamenti del debug (`href` identici a `home.component.{ts,html}`:
  Instagram, YouTube, GitHub profilo e due repository, email, PayPal). Testo dei diritti
  come README e CONTRIBUTING: tutti i diritti riservati, nessuna licenza open source.
  Nessuna immagine sponsor.
- **Regole**: `docs/game-rules.md` importato al build (`?raw`, D10), nessuna terza copia.
  `src/rules.ts` legge solo il sottoinsieme usato (titoli, paragrafi, elenchi, tabelle,
  grassetto, corsivo, codice) e produce dati resi come testo React: HTML grezzo resta
  testo, collegamenti e ancore diventano la sola etichetta, i titoli non hanno `id`.
  L'indice R00–Revisioni scorre alla sezione senza toccare l'hash. Le regole non chiedono
  nulla al server.
- **Registrazione**: le regole del modulo del debug (`src/signup.ts`): nome alfanumerico,
  email (stesso controllo di Angular), codice di sei cifre, password e conferma uguali.
  «Invia codice» chiede la disponibilità del nome, poi dell'email, poi
  `POST sign-up/verify`; «Registrati» manda `POST sign-up/register`. Ogni richiesta
  (`src/net/rest.ts`) finisce con una risposta o con un errore entro 10 s, senza ripetizioni.
  Risposte osservate sul server locale e messaggi:

  | Caso | Server | Messaggio |
  |---|---|---|
  | nome o email occupati | `available` → `false` | «Questo nome è già usato…» / «Questa email è già usata…» |
  | invio del codice nel profilo locale (`app.mail.enabled: false`) | `verify` → 500 (`Email is disabled`) | «Registrazione non disponibile in questo ambiente: il server non può inviare il codice per email. Nessun account è stato creato.» |
  | codice errato, anche senza invio | `register` → 409 | «Registrazione rifiutata: il codice non è quello inviato per email…» |
  | server spento dietro il proxy | 502, o nessuna risposta | «Server non raggiungibile. Riprova tra poco.» |

  Dopo ogni errore il modulo torna attivo. Un invio riuscito (solo con SMTP) blocca un
  nuovo invio per 15 s, come il debug.

## Hub «Gioca» (C2b-1, C2b-3)

- Modalità: contro il computer, uno contro uno, tutti contro tutti e «Con un tuo
  mazzo» (open 1vCom, C2b-4). «Gioca» entra nella coda scelta; per open apre prima la
  scelta fra i mazzi salvati (nessun mazzo: rimando alla collezione).
- In coda: «Esci dalla coda» chiede `/app/session/queue/leave` e torna all'hub solo
  all'ACK del server; senza ACK (5 s) resta in coda con un errore e si può riprovare.
  Un ingresso rifiutato (`game/error`) riporta all'hub con il messaggio del server.
- La coda 1v1 non ha una lista pubblica: l'attesa finisce solo con la partita.
- Tutti contro tutti (C2b-3): la lista di chi siede al tavolo arriva dal topic
  pubblico `/topic/game/quick/ffa/joined`, in ordine d'ingresso, con i posti liberi.
  «Aggiungi computer» chiede un computer; a cinque la partita parte da sola.
  «Inizia ora» è attivo solo con almeno due iscritti (con meno il server non
  risponde). Se l'ultimo umano esce dalla coda, i computer rimasti spariscono.
- Più computer allo stesso tavolo si chiamano «Computer 1–4» nell'ordine della
  vista del server (stabile per tutta la partita; la coda non li distingue); uno
  solo resta «Computer». L'ID completo è nell'ispezione del personaggio e in
  Strumenti → Giocatori.
- «Nuova partita» rientra nella coda della modalità appena giocata (open: con lo
  stesso mazzo); dopo un rientro con un nuovo login la modalità si deduce dalla vista
  (più di due giocatori: tutti contro tutti; una partita open vale quick 1vCom).
- Open 1vCom: `/app/game/open/1vCom/join/{utente}/{deckId}` dopo le sottoscrizioni di
  `open/1vCom/ready` e `open/1vCom/error`; un mazzo assente (o una partita ancora da
  riprendere, che il server segnala con lo stesso messaggio) riporta all'hub con
  «Mazzo non disponibile sul server».
- «Al bar»: utenti collegati e attività (`/topic/connections/users`), conteggio,
  ordinamento per colonna, pagine da 5, 10 o 20 righe.
- Il `resume` del login si applica una sola volta; un `account/data` successivo
  aggiorna solo il profilo.

## Collezione (C2b-4)

- **Catalogo**: le carte di `account/data.collection` (37 fra azioni e oggetti più i
  2 personaggi) con l'illustrazione O9, tipologia, costo, priorità, ruolo, guadagni,
  bersaglio e testo, in ordine stabile.
- **Mazzi**: elenco, «Nuovo mazzo», «Modifica» su una copia (nome bloccato),
  «Annulla» che non invia nulla, «Salva» / «Sovrascrivi» e «Cancella» con conferma.
  Salvataggio e cancellazione aspettano il nuovo `account/data` (o `account/error`,
  tradotto); senza risposta in 5 s l'editor resta aperto con un errore.
- **Editor**, solo le regole del debug e di R02 (`src/deck.ts`, funzioni pure):
  personaggio, azione base e ultima risorsa obbligatori; azioni legate ripetibili
  fino a cinque (carte iniziali base + legate ≤ 6) con «Svuota»; almeno una carta
  regolare; nome non vuoto e senza «/» (regolamento 1.8). Nessun limite di copie,
  nessun 20+2, nessun filtro di compatibilità delle legate. Ricerca come il debug
  (sottostringa della carta serializzata), vista Collezione/Mazzo, un tocco aggiunge
  una copia o ne toglie una omonima. Il server resta il giudice.

## Profilo, amministrazione e segnalazione errori (C2b-6)

- **Profilo** (scheda dell'hub): nome, email (o «—») e ruolo da `account/data`, come il
  debug; nulla da modificare.
- **Amministrazione**, solo se il ruolo del profilo è `ADMIN`: conteggi delle partite
  registrate e del log del client, partite non concluse in tabella, download dei due log
  come file JSON, cancellazione con conferma in linea («Annulla» non invia nulla) e
  conteggi riletti dopo la cancellazione. Un'operazione alla volta. Gli endpoint
  `/rest/logs/**` vogliono un'identità **HTTP Basic separata**: la chiede il browser con la
  sua finestra (D6), il client non la chiede, non la vede e non la conserva. 401 o 403
  diventano «Non autorizzato in questo ambiente…», mai un successo; anche un 200 con una
  forma inattesa è un errore. Attesa massima 120 s (la finestra del browser è tempo umano).
  Le partite quick e open non finiscono nel log delle partite (il server le archivia
  altrove): con le modalità del client quel conteggio resta 0.
- **Segnalazione errori** (`src/report.ts`, D14): `error` e `unhandledrejection` della
  finestra vanno a POST `/rest/logs/client/web/` con `{timestamp, message, additional:
  ["client-web"]}`. Un invio alla volta (gli errori che arrivano durante un invio sono
  scartati, non accodati), timeout 5 s, al massimo dieci per caricamento della pagina,
  nessuna segnalazione sull'invio fallito. Il messaggio è solo nome e testo dell'errore,
  tagliato prima di qualsiasi JSON, senza valori fra virgolette, con nome utente e
  password sostituiti da `***`; un valore che non è un `Error` non viene mai serializzato.
- **Strumenti** del menu in partita (Log Card, State, Item, JSON, messaggi, giocatori,
  disconnessione simulata): invariati, riprovati in 1v1 e FFA senza la mano altrui.

## Gesti

- Scegli una carta e poi il bersaglio sul tavolo (personaggio o carta oggetto),
  oppure trascina la carta direttamente sul bersaglio. La carta presa segue
  il puntatore; su touch resta sopra il dito. ✓ conferma, × o Escape annullano.
- Bound: dopo il bersaglio scegli dalla mano una regolare da scartare.
- Trascina entro la mano per riordinare; da tastiera Maiusc+frecce spostano la
  carta con il focus. Il riordino è solo locale e non invia nulla.
- Per leggere una carta tocca la (i) sul suo angolo in alto a sinistra: compare
  passando il mouse su carte, personaggi e oggetti, e sulla carta scelta o con
  il focus (su touch basta sceglierla). Da tastiera: I.
- ✓ invia **un solo** comando; costi e carte cambiano solo con la vista del server.
  Un rifiuto lascia la scelta sul tavolo per correggerla.
- Sulla carta: timbro del ruolo sotto il titolo (danno, difesa, risorse,
  contrasto, disturbo, oggetti, altro), bollini ▲ con le risorse che ti dà,
  monete scure con il costo e priorità in basso. Una carta più spenta, con «!» sul
  costo, oggi non è pagabile: si può comunque provare, decide il server.
- Le carte coperte nel ventaglio si alzano intere passando il mouse, scegliendole
  con un tocco o con il focus da tastiera.
- Le tue risorse sono nella plancia accanto al personaggio: simbolo, numero e
  barra. La salute parte piena; le altre risorse partono a metà, dove c'è la tacca.
  Una striscia chiara indica che si è oltre la barra, un tratteggio che si è sotto zero.
- Stati, equipaggiamenti, immunità e timer sono gettoni sulla carta personaggio:
  passando il mouse o toccandoli compare un riepilogo breve.
- Un tocco o un clic in un punto vuoto del tavolo riabbassa le carte e annulla la
  scelta, come Escape.
- Dopo ogni turno compare una riga di riepilogo non bloccante; toccandola si apre
  l'ultimo turno con mosse, report ed effetti di fine turno.
- Tutti contro tutti: quattro ventagli coperti con tante carte quante il server
  dice, oggetti come carte presso ogni posto. Gli oggetti di un posto si
  sovrappongono un poco: passando il mouse quello coperto si alza; su touch il
  primo tocco lo alza e il secondo lo sceglie come bersaglio (o lo ispeziona).
- Menu •••: aiuto, ultimo turno, salta effetti, strumenti (Log Card, Log State,
  Log Item, Log JSON, messaggi ricevuti, giocatori con ID, simula disconnessione),
  abbandono, uscita dall'account (in partita vale come forfait, con conferma).

## Ciclo di vita (C2b-2, C2b-3)

- Clock indicativo della mossa fra umani, calcolato dall'epoch della vista: non
  decide mai l'esito. Un avversario caduto mostra «fuori linea · N s».
- Esiti e forfait tradotti: abbandono, mossa non inviata in 30 s, rientro oltre
  30 s, pareggio per scadenze simultanee. In tutti contro tutti una sconfitta dice
  chi ha vinto.
- Tutti contro tutti: il forfait o la morte di un altro non fermano la partita.
  Dopo la propria morte si può restare a guardare fino all'esito («Resta a
  guardare»; dal menu si torna all'hub); dopo il proprio forfait compaiono esito e
  ritorno all'hub.

Dopo una disconnessione nessun comando parte da solo: «Rientra» riapre la
connessione con lo stesso account e chiede `resume`; la mossa già accettata resta
in attesa sul server. Landscape obbligatorio: in portrait compare la richiesta
di rotazione.

## Fatti della risoluzione (C3-1)

`src/resolution.ts` ricava da due viste i **fatti certi** del round (D1 del
[piano C3](../docs/client-c3-plan.md)): relazione fra le viste (`next`, `same`,
`jump`, `other-game`, `older`, `first`), mosse nell'ordine di `resolvedMoves` con
autore, carta, bersaglio, oggetto scelto, scarto, annullamento e costo **nominale**
dal catalogo; solo per un round contiguo, per posto, la variazione complessiva di
ogni risorsa, oggetti spariti e comparsi, mano e mazzo, morte e forfait; chi ha
effetti di fine turno; esito. Un oggetto sparito è collegato a una mossa solo se la
sua `TARGET_ITEM` lo nomina sul posto da cui è sparito e nessun'altra mossa lo
contende. Non legge mai il testo del server e non calcola effetti. I fatti di ogni
vista sono esposti anche in `window.__bm.resolutions` (e `state.resolution`) per la
verifica.

## Sequenza e riepilogo del round (C3-2)

`Model.round` conserva l'ultimo round risolto: le viste dello stesso turno non lo
cambiano; dopo una caduta o un reset è marcato `crossed` e non mostra differenze.
La scena anima lo stesso contenuto di prima (voli delle carte nell'ordine di
`resolvedMoves`, accenti, totale di salute), ma **fino in fondo** (1,2 s):

- una vista dello stesso turno annulla solo un trascinamento, non la sequenza (K1);
- la sequenza si chiude solo con un nuovo turno, un reset, una caduta, un input sul
  tavolo (tocco, clic, tasto: la carta toccata si sceglie subito), «Salta effetti»,
  ridimensionamento o scheda nascosta; aprire un dialogo o perdere il fuoco della
  finestra non la ferma;
- parte al massimo una volta per `gameId/turn` e solo per un round contiguo della
  stessa connessione, con movimento possibile;
- dopo un salto di turni o un round arrivato dopo una caduta: nessuna sequenza,
  nessuna variazione e una riga «Risolti N turni…» che rimanda a «Ultimo turno» (nel
  riepilogo breve e sul pannello d'esito) (K2, D4).

**Riepilogo statico** (K3, K4, D6): per ogni posto una striscia larga quanto la
plancia (sopra la propria e sopra quella del posto FFA di sinistra, sotto le altre)
con le variazioni complessive del round («H −7 A −10 ogg +1», «invariato»), presa dal
modello. Compare a sequenza finita, saltata o interrotta, subito con movimento
ridotto o a scheda nascosta, e resta fino alla prima scelta di carta o al round
successivo. Il riepilogo breve testuale conta i suoi 6 s solo a scheda visibile (K5).

## Verifiche

```powershell
./client-web/run.ps1 -Task Test     # modello e sessione con trasporto finto
./client-web/run.ps1 -Task Build    # tsc + build di produzione
./client-web/run.ps1 -Task Size     # JS 500 KB e totale 4 MB gzip, atlante 2048 px, texture 64 MB
./client-web/run.ps1 -Task Atlas    # rigenera l'atlante O9 (servono i PNG locali, fuori da git)
./client-web/run.ps1 -Task Verify   # partite reali: richiede server e Serve attivi
./client-web/run.ps1 -Task VerifyModes   # due account, code e 1v1: richiede server e Serve attivi
./client-web/run.ps1 -Task VerifyLifecycle   # clock, forfait, rientri, riavvio: avvia da sé il server
./client-web/run.ps1 -Task VerifyFfa     # tutti contro tutti a cinque: avvia da sé il server
./client-web/run.ps1 -Task VerifyDecks   # catalogo, mazzi e open 1vCom: avvia da sé il server
./client-web/run.ps1 -Task VerifyPublic  # home, regole, registrazione: avvia da sé il server
./client-web/run.ps1 -Task VerifyProfile # profilo, admin, errori, strumenti: avvia da sé il server
./client-web/run.ps1 -Task VerifyResolution # fatti della risoluzione su partite reali: avvia da sé il server
```

`Verify` guida il client con Edge (Playwright) contro il server locale: login,
quick 1vCom, partite fino all'esito per entrambi i personaggi, bound con scarto,
bersaglio oggetto, rifiuto, effetto periodico letto dal riepilogo, calata con
drag e con click, riordino senza SEND, disconnessione e rientro senza reinvii,
ritorno all'hub e uscita. A ogni turno controlla anche C2a: misure delle carte,
plancia uguale alle risorse della vista, attenuazione calcolata come il server,
ruolo e guadagni uguali all'allegato del regolamento, alzata al passaggio del
mouse; invia apposta una carta attenuata e si aspetta il rifiuto del server. Mette a fuoco
una carta che esce dal bordo e controlla che la pagina del tavolo non scorra (C2b-7: lo
strato semantico è ritagliato con `overflow: clip`).
`VerifyModes` usa devAlice e devBob in due contesti Edge: presenza, uscita dalla
coda, 1v1 fino all'esito con controllo delle viste private, «Nuova partita»,
ingresso rifiutato con partita riprendibile (da un secondo socket STOMP grezzo
dello stesso account, perché dal client l'hub non è raggiungibile in quello stato),
abbandono e uscita. Accetta le stesse variabili di `Verify`.
`VerifyLifecycle` e `VerifyFfa` avviano e fermano da sé il server su un database
temporaneo (la porta 8080 deve essere libera, `Serve` attivo) e aspettano davvero
i 30 s. `VerifyFfa`: coda con computer e uscita, A più quattro computer fino
all'esito, A e B con tre computer (viste private), «Inizia ora» a due, forfait
altrui per abbandono, per tempo scaduto e per rientro tardivo con A che continua
fino all'esito; a ogni turno rilegge la scena (cinque posti, ventagli uguali a
`cardsInHand`, oggetti come carte, nessuna sovrapposizione fra posti, mano e
bordi, con le stesse funzioni dei test) e prova l'oggetto coperto con mouse e
tocco emulato. `BM_SCENARIOS` sceglie gli scenari (`queue,five,two,start,leave,timeout,drop`).
`VerifyDecks` (anche lui su database temporaneo) confronta il catalogo con l'allegato
del regolamento, prova bozze non salvabili, crea, annulla, sovrascrive e cancella
mazzi dalla UI, gioca un open 1vCom fino all'esito controllando che personaggio e
mano vengano dal mazzo, ripete con «Nuova partita», avvia un mazzo con sei carte
iniziali e provoca «Deck unavailable» riscrivendo il deckId del frame in uscita
(non raggiungibile dalla UI con un solo account); in quella partita senza mosse controlla
che il menu spieghi il limite R03 (C2b-7).
`VerifyPublic` (database temporaneo) confronta gli `href` della home con il sorgente del
debug senza aprirli, il testo delle regole con `docs/game-rules.md` (titoli, revisioni,
ogni cella delle tabelle, tutte le parole), prova home → regole → home (anche con
indietro del browser) → accesso → hub → esci → home, la registrazione (devAlice occupato,
nome nuovo libero, «Invia codice» indisponibile, codice errato, nessun account creato) e,
a server fermo, errore di rete su registrazione e login; in più home, regole,
registrazione e accesso in portrait 390×844. Gli altri script entrano da `#/accedi`.
`VerifyProfile` prepara un ambiente di prova (D5) su database temporaneo: aggiunge un
account sintetico `ADMIN` e tre righe sintetiche al log delle partite, e avvia il server
prima senza e poi con HTTP Basic da variabili d'ambiente (`HTTP_AUTH_USERNAME`,
`HTTP_AUTH_PASSWORD` con l'hash BCrypt di una password generata per l'esecuzione). Prova
il profilo USER senza pannello, tre errori provocati nella pagina (un POST ciascuno,
salvati, senza credenziali né dati di gioco), l'ingestione rifiutata e bloccata (un
invio alla volta, interruzione a 5 s, nessun ciclo), gli strumenti in 1v1 e FFA, il
pannello senza Basic configurato e con credenziali errate (401, nessun successo), poi
conteggi, partite non concluse, download e cancellazione con annullamento e conferma.
Il browser risponde alla sfida Basic con le credenziali del contesto Playwright;
`BM_NATIVE_PROMPT=1` apre anche un Edge visibile, cattura la finestra nativa del browser,
la annulla (Esc) e la compila da tastiera dopo «Riprova».
`VerifyResolution` (C3-1, C3-2, database temporaneo) gioca quick 1vCom con caduta e rientro,
tre round con movimento ridotto emulato, interruzioni in quick 1vCom («Salta effetti»,
tocco sul tavolo vuoto, carta scelta durante la sequenza, scheda nascosta: reale se il
browser la riporta, altrimenti emulata e dichiarata),
FFA con quattro computer (guardando dopo la propria morte), FFA con devBob e tre computer
in cui i due umani lasciano scadere il clock (salto di turni) e open 1vCom con due mazzi
sintetici salvati dall'editor («C3 contrasti», «C3 furti»: annullamenti, oggetti presi,
rubati e token). A ogni vista confronta i fatti esposti dal client con quelli ricalcolati
sulle viste ricevute, controlla che le variazioni sommate alla vista precedente diano la
nuova, che salti, altre partite e viste dello stesso turno non portino differenze e che i
fatti non cambino sostituendo il testo del server. Da C3-2 controlla anche la scena:
regole 1, 2, 3 e 6 del piano, una sequenza completa (circa 1,2 s) per ogni round
contiguo con mosse, mai chiusa da una vista, riepilogo statico del round a ogni scelta,
nessuna sequenza né riepilogo dopo un salto e la riga dei turni risolti; fra umani, la
regola 4 con il clock che continua. `BM_SCENARIOS` sceglie
gli scenari (`quick,reduced,interrupt,ffa,jump,open`); `BM_RECORD=1` aggiunge a
`tests/resolution-views.json` i casi non ancora registrati (viste reali, carte ridotte
ai campi che il modello legge).
`BM_VIEWPORT=844x390` ripete al formato landscape
compatto; `BM_HEADED=1` mostra Edge; `BM_CLIENT` cambia l'indirizzo (anche
quello LAN con `?k=`); `BM_OUT` scrive altrove le evidenze. Evidenze correnti in
[docs/reports/client-c2](../docs/reports/client-c2/) (quelle di C1 restano in `client-c1`;
quelle di C3 in [docs/reports/client-c3](../docs/reports/client-c3/));
lì scrive anche `Size`. È un'esecuzione su PC:
non sostituisce il dispositivo fisico né la prova umana.

## Risorse grafiche

`public/art/table.webp` è la copia approvata in C0
([provenienza](../docs/design/client-c0/r2-assets/README.md)). `atlas.webp` è
l'atlante O9: 2048×1536, 8×6 riquadri da 256 px con le 40 illustrazioni
provvisorie, più un segnaposto neutro. `manifest.json` dice quale riquadro spetta
a ogni `bindingName` (`src/art.ts`); un nome sconosciuto usa il segnaposto.
[Provenienza e scelte](../docs/design/client-c2/o9-art/README.md). Nessun font
remoto o audio; simboli e timbri di C2a sono vettoriali.

## Confini del codice

- `src/net/`: trasporto. `stomp.ts` (STOMP su SockJS, REST di validazione,
  sottoscrizioni confermate da RECEIPT prima di ogni SEND, nessuna riconnessione
  automatica); `link.ts` è il confine sostituibile nei test.
- `src/session.ts`: flusso applicativo e protocollo. Vista privata come unica
  fonte autorevole; i topic `update` e `move` della partita servono solo a
  richiedere di nuovo la vista; al massimo una richiesta in volo; generazioni
  di connessione per ignorare i callback vecchi; uscita che smette di ascoltare
  la partita prima del leave.
- `src/model.ts`: selezione locale, ordine della mano e comando a cinque campi.
  Nessun effetto delle carte calcolato qui.
- `src/readability.ts`: funzioni pure di C2a: pagabilità (stesso confronto del
  server), ruolo e guadagni dal catalogo, indicatore delle risorse senza tetti né
  pavimenti, geometria del tavolo per duello e FFA a cinque (ventagli coperti,
  oggetti coperti da alzare al primo tocco).
- `src/art.ts`: riquadro dell'atlante per `bindingName` (manifest letto a runtime).
- `src/scene.ts`: tavolo Pixi, gesti e animazioni aggregate; non modifica il modello.
- `src/resolution.ts`: fatti certi del round da due viste (C3-1), riepilogo per posto
  e riga dei turni risolti (C3-2), funzioni pure;
  nessun testo del server letto, nessun effetto calcolato.
- `src/hub.tsx`, `src/presence.ts`: hub «Gioca», coda FFA, scelta del mazzo open e
  presenza (ordinamento, pagine e nomi dei giocatori come funzioni pure).
- `src/collection.tsx`, `src/deck.ts`: scheda «Collezione» (catalogo, mazzi, editor);
  le regole dell'editor e i messaggi del server sono funzioni pure.
- `src/lifecycle.ts`: esiti, ragioni di forfait e countdown indicativi (funzioni pure).
- `src/public.tsx`, `src/rules.ts`, `src/signup.ts`, `src/net/rest.ts`: home, regolamento
  importato, registrazione (regole del modulo, mappa delle risposte e hash come funzioni pure).
- `src/profile.tsx`, `src/report.ts`: scheda «Profilo» con il pannello admin (client REST e
  messaggi in `src/net/rest.ts`) e segnalazione degli errori (testo e limitatore puri).
- `src/table.tsx`, `src/main.tsx`, `src/ui.tsx`: shell React (accesso, navigazione a hash,
  tavolo, esito, dialoghi).
- `window.__bm` e `window.__bmReports` (conteggi della segnalazione errori): stato in sola
  lettura della pagina per la verifica automatica; nessun comando. Da rivalutare prima della consegna C5.

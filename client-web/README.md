# Client web animato (C1, C2a, O9, C2b-1…C2b-7, C3-1…C3-4, C3-L, C3-4s, C3-6, C3-5, C3-7)

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
  contrasto, disturbo, oggetti, altro), bollini col numero e il simbolo di ogni risorsa che ti dà (C4-3),
  monete scure con il costo (numero e simbolo della risorsa) in basso a sinistra e, in basso a destra, il bollino del danno
  nominale: simbolo del tipo (stella per il colpo, coltello per il taglio, goccia per il
  veleno) e importo del catalogo (C3-5). La priorità non è sul volto: sta nella (i).
  Una carta più spenta, con «!» sul costo, oggi non è pagabile: si può comunque provare, decide il server.
- Le carte coperte nel ventaglio si alzano intere passando il mouse, scegliendole
  con un tocco o con il focus da tastiera.
- Le tue risorse sono nella plancia accanto al personaggio: simbolo, numero e
  barra. La salute parte piena; le altre risorse partono a metà, dove c'è la tacca.
  Una striscia chiara indica che si è oltre la barra, un tratteggio che si è sotto zero.
- Stati, equipaggiamenti, immunità e timer sono gettoni sulla carta personaggio:
  passando il mouse o toccandoli compare un riepilogo breve.
- Un tocco o un clic in un punto vuoto del tavolo riabbassa le carte e annulla la
  scelta, come Escape.
- Dopo ogni turno compare una riga di riepilogo non bloccante, in un posto che il tavolo le
  riserva senza coprire nessun personaggio (C3-6); toccandola si apre l'ultimo turno: prima i fatti
  certi in italiano, poi il testo del server.
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
La sequenza va **fino in fondo**, **una carta per volta**, con la regia di D13 (revisione
di C3-4, sezione sotto). Il ritmo (`pace` in `src/resolution.ts`) sta entro il **tetto di
20 s** per round di D10, anche in FFA con cinque mosse; il tetto non è la durata tipica: un
duello dura meno della metà.

- una vista dello stesso turno annulla solo un trascinamento, non la sequenza (K1);
- un tocco, clic o tasto sul tavolo passa al **passo successivo** della carta (D12 con
  D13), poi alla pesca, al fine turno e alla coda; dopo l'ultimo la sequenza finisce. Scegliere
  una carta della mano la chiude e sceglie subito la carta;
- la sequenza si chiude anche con un nuovo turno, un reset, una caduta, «Salta
  effetti», ridimensionamento o scheda nascosta; aprire un dialogo o perdere il fuoco
  della finestra non la ferma;
- parte al massimo una volta per `gameId/turn` e solo per un round contiguo della
  stessa connessione, con movimento possibile;
- dopo un salto di turni o un round arrivato dopo una caduta: nessuna sequenza,
  nessuna variazione e una riga «Risolti N turni…» che rimanda a «Ultimo turno» (nel
  riepilogo breve e sul pannello d'esito) (K2, D4).

**Riepilogo statico** (K3, K4, D6; leggibile dal C3-6): per ogni posto una striscia con le variazioni
complessive del round, presa dal modello: una cella per voce, il **simbolo** della risorsa (lo stesso delle
plance; per gli oggetti quello degli oggetti) e il numero con segno («−7», «+1»); «invariato» se nulla è
cambiato. Il testo è grande (19 px a 1366×768, 14 px a 844×390, mai sotto 16 e 12 px) e la striscia, con la
dimensione delle sue celle, si dispone a ogni round (`stripPlan` in `readability.ts`): accanto alla plancia
o al personaggio del suo posto, libera da ogni altra cosa del tavolo e da un altro posto, nel carattere più
grande che trova posto e con meno righe possibile. Dove non c'è posto (FFA compatta con tutte e cinque le
risorse cambiate) la striscia manca e restano riga breve e «Ultimo turno». Compare a sequenza finita, saltata
o interrotta, subito con movimento ridotto o a scheda nascosta, e resta fino alla prima scelta di carta o al
round successivo.

**Riepilogo breve** (K5, C3-6): una riga («Turno 3: tu → Gancio · Computer 1 → …», dai fatti del modello) di
16 px (13 px a 844×390), di due o più righe di testo, nel posto che `briefSpot` trova libero fuori dal centro
del tavolo, dal titolo decorativo e dalle strisce; il testo è troncato con «…» e un tocco apre «Ultimo
turno». Conta i suoi 6 s solo a scheda visibile. A 844×390 in FFA il posto libero è stretto (una riga di
120–160 px o poco più) e, se manca del tutto, la riga non compare e «Ultimo turno» resta nel menu.

## Volto della carta ed effetti per tipo di danno (C3-5)

- **Volto:** in basso a destra il bollino del danno **nominale** della carta: simbolo del tipo (stella per il colpo, coltello per il taglio, goccia per
  il veleno) e importo del catalogo, uno per tipo; nessun bollino per le carte senza danno. Viene da `damage` e `damageAmount` (regolamento 1.9 e 1.10),
  letti da `contracts.ts` e interpretati da `damageOf` in `readability.ts`; il client non calcola né corregge (D1): stati e difese possono cambiare il
  danno reale. `HIT 20+x` mostra il totale con la V di chi gioca (metà della V rimasta dopo il costo, troncata verso zero) in mano, nell'anteprima, nel
  trascinamento e nel primo piano; «20+» dove la V non è nota (catalogo, editor); le carte piccole del round hanno il solo simbolo.
- **Priorità:** non è più sul volto. Sta nell'ispezione («Priorità», con la riga «Danno nominale») e nell'etichetta accessibile della carta.
- **Stesso volto ovunque:** mano, anteprima, trascinamento, primo piano della regia (D13), catalogo ed editor (in HTML con gli stessi simboli, `DamagePills`
  in `ui.tsx`, poligoni in `DAMAGE_SHAPES`). Dal C4-3 anche costi e guadagni sono simboli (sezione sotto).
- **Impatto di ogni carta** (`impactOf`): il segno del suo tipo di danno sul bersaglio (colpo: stella rossa con cuore giallo e onda d'urto circolare che si espande; taglio: coltello; veleno:
  goccia che sale; la carta personaggio del bersaglio vibra e si scurisce per ogni danno, colpo o taglio, mai con movimento ridotto; più tipi, un segno ciascuno) oppure, dove il tipo non si applica, quello del ruolo R07a in un cerchio colorato (difesa, risorse,
  contrasto, disturbo, oggetti, altro); senza tipo né ruolo l'anello semplice. È la natura della carta, non il danno risolto: una conversione come
  `BrokenBeerBottle` non si vede e non si deduce.
- **Enfasi brevi:** annullata = croce e timbro «ANNULLATA» (senza impatto di tipo); eliminazione = timbro, anello e scossa del posto; forfait = timbro;
  esito = banner «VITTORIA», «SCONFITTA» o «PAREGGIO» in 700 ms (`PACE.outcome`) in coda al solo round che chiude la partita. Tutto vettoriale (D9).
- **Movimento ridotto:** nessuna sequenza, quindi nessun impatto né scossa; il segno del tipo resta sul volto (`impactOf(carta, true).shake` è 0).
- **Scritte delle variazioni:** il tempo leggibile misurato va dal primo frame intero al frame in cui comincia a sfumare (`end`); la scena registra anche il
  più lungo intervallo fra frame nella finestra (`gap`).

## «Ultimo turno» (C3-6)

Il dialogo dell'ultimo round dice **prima i fatti certi in italiano** (`roundReport`, funzione pura di
`resolution.ts`, D7) e **poi il testo del server**, invariato, in una sezione secondaria («Testo del server»,
chiusa, un tocco la apre). Ogni frase viene dai fatti del modello: nessuna frase del server è letta, nessun
collegamento solo probabile è detto certo.

- **Cosa è successo nel turno N:** le mosse nell'ordine di risoluzione («2. Computer 1 gioca «X» su Computer 3»),
  ciascuna con il costo **nominale** del catalogo (l'importo pagato può differire, R05; «non noto» se la carta non è
  nel catalogo del client), «Annullata durante il round (la vista non dice da quale mossa)», l'oggetto scelto con
  «sparito da quel posto» solo se la vista lo conferma (altrimenti «non permette di dire con certezza»; la
  comparsa di un oggetto con lo stesso nome presso l'autore è un fatto, non una causa) e la carta da scartare indicata.
- **Variazioni complessive:** per ogni posto, risorse con «da a a b» e oggetti spariti e comparsi, non attribuite a una
  singola mossa (costi, effetti e fine turno insieme). Eliminazioni e forfait del turno. **Fine turno:** su quali
  giocatori, mai cosa è successo (lo dice solo il testo del server). Esito se la partita è finita.
- **Dopo un salto di turni**, un round arrivato dopo una caduta o una prima vista (ricarica, rientro): una nota dice quanti
  turni sono stati risolti, che i fatti riguardano solo l'ultimo e che variazioni, oggetti ed eliminazioni non sono
  disponibili; restano le mosse dell'ultimo round, che sono sempre certe.
- Nessuna cronologia persistente né replay: solo l'ultimo round della vista.

Il testo è di 18 px (16 px a 844×390) per i titoli delle mosse e delle variazioni, 17 e 15 px per le loro righe;
il dialogo scorre, con i fatti in cima. `VerifyResolution`, scenario `report`, lo rilegge nelle partite reali
(duello e FFA a cinque, due misure) contro le **viste grezze del socket**, non contro la funzione del client.

## Contenuto e regia della sequenza (C3-4, revisione D13)

`timeline` in `src/resolution.ts` (funzione pura) costruisce il round dai soli dati
certi: fatti del modello, catalogo (costo nominale, quali nomi sono oggetti del mazzo) e
righe regolari del report verificate. `pace` ne fa la regia (D13, dopo la prova del
proprietario su C3-4) e `directionProblems` ne controlla l'ordine. La scena
(`beginSequence` in `src/scene.ts`) la disegna così:

1. **per ogni carta,** nell'ordine di `resolvedMoves` (duello contro computer compreso), sei
   passi uno dopo l'altro:
   - **costo** (0,4 s): i gettoni del costo nominale lasciano **quell'**autore, anche per
     le mosse poi annullate; la bound scarta la carta in più; con le righe verificate le
     risorse del costo calano. Senza nulla da pagare il passo non dura nulla;
   - **primo piano di chi gioca** (0,9 s): una copia del suo personaggio si ingrandisce e va
     in una parte libera del tavolo, con accanto la carta giocata in primo piano, e resta lì.
     Il posto è `closeUp` in `src/readability.ts`: dentro lo schermo, lontano dagli altri
     posti (personaggio, plancia, oggetti, mano coperta) e dalla mano, la scala più grande
     vicina al centro; se non c'è posto il personaggio si ingrandisce nel suo posto;
   - **ritorno** (0,3 s) alla posizione originale;
   - **volo e impatto** (0,65 s), come prima: la carta vola dal posto dell'autore al
     bersaglio (o su sé) e lo colpisce; l'annullata riceve il timbro «ANNULLATA»;
   - **primo piano del bersaglio** (0,5 s): il bersaglio si ingrandisce un po' nel suo posto
     (`targetUp`), sotto la carta che lo ha colpito. L'oggetto scelto e sparito da quel posto
     si consuma (oggetto proprio), passa all'autore (stesso nome comparso presso di lui) o si
     rompe (sparito da un altro posto senza ricomparire);
   - **variazioni** (0,6 s, solo se la carta ne ha di verificate): barre e numeri della
     carta, con la risorsa ingrandita. Poi la carta si posa nella cascata delle carte del round
     al centro del tavolo (C3-L, sezione sotto); oltre i posti della cascata va allo scarto dell'autore;
2. **pesca:** dal mazzo di ogni posto escono quante carte dice il conteggio (il proprio mazzo è
   disegnato accanto al proprio personaggio da C3-L). Le proprie
   arrivano scoperte nella mano, quelle degli avversari come dorsi. Gli oggetti del mazzo
   comparsi senza una mossa che li passi vanno al tavolo (il token non è nel catalogo e non
   arriva dal mazzo);
3. **fine turno:** un riquadro sui posti con righe di fine turno (chi, mai cosa);
4. **coda:** timbri «ELIMINATO» e «FORFAIT».

Oltre il tetto di 20 s (più di cinque carte con tutto) ogni durata si riduce in
proporzione. Il server paga **tutti** i costi prima di qualsiasi effetto (R04); la regia
mostra invece il costo di ogni carta subito prima della carta. I passi conservano la loro
variazione e partono dal valore mostrato, quindi finiscono sempre sulla vista; quando un
autore successivo paga con una risorsa cambiata da una carta precedente, il valore di
partenza mostrato differisce da quello del server (`drift` della linea temporale e di
`stats.beats`).

**Barre e numeri (D1 riaperta, D5).** `reportSteps` legge solo le righe nella forma
regolare `RISORSA: a->b (d)`, alla fine della riga e al più dopo un'etichetta tra
parentesi. Il resto del testo del server non si interpreta mai. La verifica segue R04:
prima i costi nominali, poi le righe di ogni mossa (`SELF` all'autore, `OPPONENT` al
bersaglio), poi il fine turno. Ogni riga deve partire da dove ha lasciato il passo
precedente e i passi devono finire esattamente sulla nuova vista. Allora le plance si
muovono **per carta**, nell'ordine di D13 (costo della carta nel suo passo costo, righe nel
suo passo variazioni): ogni passo cambia barra e numero nel suo momento, con la risorsa
ingrandita sopra la plancia («95 → 90» e barra). Altrimenti (veleno a timer di MarvelousCocktail, costo
pagato diverso dal nominale, nome sconosciuto) barre e numeri restano al valore
precedente e vanno al finale nella coda (D5), ingranditi allo stesso modo. Le decisioni
usano sempre la vista finale: solo il disegno delle plance segue i passi, e a sequenza
finita, saltata o interrotta le plance mostrano la vista. Oggetti, dorsi e mano in arrivo seguono
la sequenza (C3-4s, sotto); punti d'interazione e decisioni restano sulla vista finale. I conteggi di ogni sequenza sono in
`window.__bm.state.stats.beats`, l'inizio di ogni passo di ogni carta come la scena lo ha
programmato in `stats.schedule`, i primi piani (riquadro, scala, posto) in `stats.closeUps`.
Con movimento ridotto non c'è sequenza: lo stesso contenuto resta nel riepilogo statico per
posto (con i simboli e il testo grande di C3-6).

## Rifinitura della sequenza (C3-4s)

Dopo la prova di C3-L ([rapporto](../docs/reports/client-c3-report.md#c3-4s--rifinitura-delle-animazioni-della-sequenza)).
Tutto viene dai fatti di C3-1 (D1); con movimento ridotto nessun volo né scritta, stesso contenuto nel riepilogo statico.

- **Scritte delle variazioni** (`LABEL` in `src/resolution.ts`): entrata 120 ms, lettura 1200 ms a piena opacità, uscita
  180 ms, contati dal primo fotogramma che le mostra. Durano più del loro passo; `labelSpot` (`src/readability.ts`) le
  tiene separate. In `stats.labels` posto, risorsa, riquadro, tempi e lettura misurata.
- **Sgombero** (fase `clear`, 0,5 s): all'inizio della sequenza le carte del round prima lasciano la cascata. Regolari e
  ultima risorsa vanno alla pila dell'autore, base e legate tornano in mano (R02). Le pile altrui non sono disegnate: la
  carta vola accanto al posto e sfuma. La legata scartata in più parte dalla mano o dai dorsi.
- **Pesche:** dal mazzo del posto, proprie scoperte, altrui come dorsi nel ventaglio.
- **Oggetti:** in sequenza la scena disegna lo stato intermedio (`staged`). Pescato: dal mazzo o comparsa al posto;
  consumato, rubato, rotto: volo o scomparsa dai fatti. Senza legame con una mossa: compare o svanisce nella fase pesche.
- **Conteggi per la verifica:** `stats.flown` (voli costruiti, visti, verso pila e mano, oggetti a inizio e fine).
- **(i) e fuoco:** `table.tsx` azzera `overInfo` quando il suo id non è più esposto (un elemento tolto sotto il puntatore
  non dà `pointerleave`); `escape()` e ogni round nuovo azzerano il fuoco lasciato dalla pressione, non quello da tastiera.

## Simboli, font e inventario (C4-3)

Un solo sistema di simboli per il tavolo (Pixi) e la shell (HTML), sul modello di `DAMAGE_SHAPES`: **`src/symbols.ts`** descrive in dati (-1…1) le quindici forme approvate
(cinque risorse, sette ruoli, tre tipi di danno, invariate: i poligoni dei danni vengono da `readability.ts`) e i due segni ✓ e ✕; `drawSymbol` le disegna con Graphics
(`glyph` in `scene.ts`), `svgParts` le dà come elementi SVG (`SymbolMark`, `Mark`, `Cost`, `Gains` in `ui.tsx`). Colori in `RES_COLOR` e `ROLE_COLOR` di `readability.ts`.

- **Nessuna lettera di risorsa sul volto, nelle plance e nei gettoni, sempre col numero.** Monete del costo: numero e simbolo della risorsa su un disco chiaro dentro la moneta scura
  (la «!» e la barra delle non pagabili restano); guadagni: `+15` e il simbolo della risorsa, nel bollino col bordo del colore della risorsa (non c'è più il triangolo dei ruoli);
  gettoni di immunità: il simbolo della risorsa su un disco chiaro con una barra obliqua, senza lettera (nessun numero: l'immunità non ne ha). La plancia mostrava già simbolo e numero.
  In HTML (catalogo, editor, ispezione) gli stessi simboli con le stesse monete e gli stessi bollini; il testo per un lettore è il nome della risorsa.
- **Le lettere restano nel testo consultabile:** `gainText`, le righe `rows` della plancia, le etichette delle carte (`cost()`), il testo di `Chip.short` e le stringhe del catalogo.
  `FaceInfo.marks` dice quali simboli ha disegnato il volto; `VerifyLayout` controlla che coincidano col costo e con i guadagni del catalogo e che nessun testo del volto sia una lettera di risorsa.
- **Font:** Impact (tavolo, con ripiego Arial Narrow) e Arial (shell). Tolti Georgia (la «i») e Consolas (codice delle regole e strumenti, che era anche il carattere predefinito di `pre`). Nessun font distribuito,
  nessuna richiesta di rete. **Impact su iOS: non verificato.** ✓ e ✕ non sono in Impact né in Arial (misurato su Windows): sono forme proprie; → × − ▲ ▼ ∞ restano testo (presenti in entrambi).
- **Inventario:** [docs/design/client-c4/assets/](../docs/design/client-c4/assets/README.md) (`inventory.json`). `tests/assets.test.ts` percorre `public/` (e `dist/`, se costruita) e fallisce per un file non registrato,
  con impronta diversa, con un campo mancante o per una voce senza file; controlla anche che non ci siano font, `@font-face` o origini remote e che le famiglie siano solo queste.
- **`Size`:** legge le dimensioni di ogni formato raster (`tools/image-size.mjs`: WebP, PNG, JPEG, GIF, AVIF; un raster che non sa leggere fa fallire il giro) e controlla **due cose distinte**: i limiti rigidi di C2 (invariati) e il tetto di C4 (D9, rivista il 3 novembre 2026:
  solo le texture decodificate, 32 MiB; per JS e totale valgono i soli limiti rigidi). `size.json` riporta margine e percentuale del tetto e un riepilogo per estensione.

## Scala e spazio del tavolo (C3-L)

Scelte del proprietario del 30 ottobre 2026, dopo le misure del blocco
([rapporto C3](../docs/reports/client-c3-report.md#c3-l--scala-e-uso-dello-spazio-del-tavolo)). Solo geometria: sfondo,
cornici, simboli e texture restano a C4.

- **Fattori (`SCALE` in `src/readability.ts`)** sulle dimensioni di C2: personaggio proprio ×1,5, altri ×1,2,
  oggetti ×1, plance delle risorse ×1,25. Quando il tavolo non basta cedono, 0,05 alla volta fino a 1, in
  quest'ordine (`YIELD`): oggetti, altri, risorse, personaggio proprio. `fitScale` prova la disposizione con tre
  oggetti per posto e la tiene una volta per misura dello schermo e numero di posti. Il controllo è
  `layoutProblems`: tutto nello schermo, nessun posto su un altro, sulla mano coperta di un altro, sulla mano, sul
  suggerimento, sui controlli in alto, sulle carte del round o sulle pile, passo della mano ≥ 44 px, un posto
  libero per ogni primo piano D13, primi piani dei bersagli che non coprono gli altri personaggi, frecce di
  C3-3 lontane da ✓ e ×.
- **Risultato:** 1366×768 duello tuo ×1,5, altri ×1,2, risorse ×1,25; FFA tuo ×1,5, altri ×1, risorse ×1,25;
  844×390 duello tuo ×1,5, altri ×1, risorse ×1,1; FFA tuo ×1,5, altri ×1, risorse ×1,05.
- **Tuo posto:** plancia contro il bordo sinistro, personaggio accanto, il piede appena sopra il suggerimento
  «Scegli…». Caratteri e colonne delle plance seguono la loro misura; sulle plance altrui il nome ha la prima riga
  intera, la salute sta accanto alla sua barra. I gettoni di stato crescono con il personaggio.
- **Carte del round al centro (`played`):** le carte dell'ultimo round risolto della vista, nell'ordine di
  `resolvedMoves`: la prima risolta sotto, ogni successiva una striscia del titolo più in basso e un po' a destra,
  sopra la precedente. Accanto, una colonna con l'autore di ogni carta («TU», «COMPUTER 2»…); l'annullata ha
  l'etichetta color vino con «✕» e una riga sulla sua striscia. La carta più grande la cui cascata (un posto per
  giocatore) trova posto vicino al centro, da quella di un personaggio a metà. Durante la sequenza ogni carta,
  dopo le sue variazioni, si posa nel suo posto della cascata; prima, la cascata mostra solo quelle già posate. A
  sequenza finita, saltata o con movimento ridotto mostra la vista. Restano fino al round successivo; dopo un salto
  di turni, l'ultimo round della vista senza animazione (D4).
- **Mazzo e scarti propri (`piles`), piccoli accanto al tuo posto:** il mazzo con il conteggio della vista, la
  pila degli scarti con l'illustrazione dell'ultima carta che vi è andata (`discardTop`, R02: regolare o ultima
  risorsa dopo l'uso anche se annullata, la carta scartata da una bound non annullata; basic e bound restano in
  mano). Nella FFA uno sopra l'altro a destra del personaggio, prima degli oggetti (stretti, perché la mano tenga il passo); nel duello nella riga degli oggetti sopra il posto.
  Pescate e scarti delle bound partono e arrivano lì; quelli degli avversari restano accanto al loro posto.
- **Duello:** gli oggetti propri stanno in una riga sopra il proprio posto, per lasciare il centro alle carte del
  round; l'avversario sta più a destra su desktop.
- **Primi piani (D13):** il personaggio proprio, già il più grande, può restare alla sua scala nel primo piano
  (`closeUpRange`) e come bersaglio cresce poco (`targetScale`). Il primo piano di un bersaglio cresce attorno al
  centro, oppure dal bordo alto o basso, nel primo modo che non copre gli altri personaggi (`targetOf`). Un primo
  piano evita le carte del round e le pile, salvo quando passarci sopra gli permette di crescere di più o di
  avvicinarsi al centro.
- **(i) della carta alzata:** con una carta scelta, la (i) che cadrebbe su un personaggio o un oggetto del tavolo
  non compare, così un clic lì mira (a 844×390 la carta alzata può coprire un oggetto avversario).
- **750×292 (minimo iPhone):** non entra ancora, come già prima di C3-L. Registrato per C4 e controllato da un
  test che avvisa quando cambia.

## Frecce verso i bersagli (C3-3, O6)

Con una carta scelta o trascinata, una freccia parte dal bordo della carta e arriva al
bordo di ogni bersaglio ammesso: un personaggio per ogni categoria `SELF`/`OPPONENT` che
la carta dichiara (stessa chiamata dei contorni, `Model.allows`, quindi niente morti né
forfait) e, per le carte che prendono un oggetto, una per posto che ne ha, verso
l'ultimo oggetto ammesso. Gli oggetti restano contornati. Sono un aiuto visivo: il server
giudica la mossa. Nessuna freccia quando la scelta è bloccata (pending, eliminato,
esito) e quando il bersaglio è già scelto (resta la linea verso l'anteprima); con la carta
che già tocca il bersaglio la freccia non si disegna. La pulsazione leggera si spegne con
movimento ridotto. La geometria è `aimArrows` in `src/readability.ts` (curve nello schermo,
lontane dai pulsanti ✓ e ×), disegnata da `drawAim` in `src/scene.ts`.

Il suggerimento del tavolo («Scegli una carta», «Scegli il bersaglio sul tavolo», «Mossa ricevuta…») sta
nell'angolo in basso a sinistra (`.hint`), con un alone che pulsa piano quando si chiede una scelta (classe `ask`,
fisso con movimento ridotto).

## Lancio unico (C4-1, O23)

```powershell
./client-web/run.ps1 -Task VerifyAll                 # giro completo, due misure, nessuna evidenza copiata
./client-web/run.ps1 -Task VerifyAll -Publish docs/reports/client-c4/<blocco>   # a fine giro verde e completo copia le evidenze
./client-web/run.ps1 -Task VerifyAll -Quick          # controllo di sviluppo: NON equivalente al consolidamento
```

Un solo comando, in serie: controlla che 8080 (e 4320) siano libere e si ferma se non lo sono, **ricostruisce il jar**
(`build.ps1 -Task Server -Offline`; `-ReuseJar` lo riusa e lo dichiara), esegue `Test`, `Build`, `Size`, avvia da sé
l'anteprima della build appena fatta, poi `Verify` e `VerifyModes` su **un solo** server temporaneo con gli account di
prova e infine, per ogni misura, le verifiche che avviano il server da sole (Lifecycle, Ffa, Decks, Public, Profile,
Resolution, Aim, Layout; per loro il server resta uno per verifica, perché alcune lo fermano o lo riavviano di proposito).
Ferma solo i processi che ha avviato. Se una verifica fallisce prosegue e restituisce errore alla fine. In coda stampa
HEAD e data del jar verificati, la tabella (verifica, misura, esito, durata), gli avvisi e le cartelle di evidenze e log.

- **Misure:** `-Measures 1366x768,844x390`; qualunque altra (per esempio `750x292`, base di C4-1b) è un'esecuzione dichiarata **non equivalente** al consolidamento e non si pubblica (predefinite le due; in `-Quick` solo la prima). **Selezione:** `-Only verify,modes,resolution,…`
  (nomi: `test build size verify modes lifecycle ffa decks public profile resolution aim layout`); un giro parziale non si pubblica.
- **Evidenze (D13 del [piano C4](../docs/client-c4-plan.md)):** sempre in una cartella temporanea (`%TEMP%\bm-verify-all-…\evidence`, con `logs`), mai nel
  repository finché non si chiede `-Publish <cartella>`. La pubblicazione avviene solo se tutto è verde e il giro è completo (due misure,
  nessun `-Only`, non rapido) e copia: **i JSON finali sempre** (con `run-summary.json`), **le catture solo finali e ricompresse**
  (JPEG, qualità 0,55) fino a circa 10 MB (`BM_CAPTURE_BUDGET_MB`, un'indicazione e non una soglia: quante ne restano fuori è
  dichiarato), il resto resta nella cartella temporanea. `Size` scrive nella stessa cartella: `docs/reports/client-c2/size.json` non cambia.
  `run-summary.json` registra HEAD, jar (data, hash), `dist` (file e hash), modifiche non committate nei percorsi verificati,
  risultati e avvisi. Un solo giro alla volta: un secondo lancio è rifiutato (blocco in `%TEMP%\bm-verify-all.lock`).
- **Avvisi (mai soglie):** un contatore di controllo a zero (`turnsChecked`, `cardsChecked`, `boardChecks`, `unpayableSeen`,
  `arrowsDrawn`, `turnsSeen`) è segnalato come «VACUOUS?»; un jar più vecchio del sorgente del server come «STALE JAR». Soglie e attesi delle
  verifiche non sono toccati.
- **`-Quick`:** scenari ridotti dove lo script ha già `BM_SCENARIOS` (ffa `queue,five`; aim `duel,ffa`; layout `duel,ffa`;
  resolution `quick,reduced`) e una sola misura. Intestazione e riepilogo dicono che **non è equivalente** al consolidamento, non pubblica,
  e non va citato come verifica di blocco.
- **Durata:** il giro completo a due misure costa circa due ore e mezza (`Resolution` circa 35 minuti per misura); `-Quick` qualche decina di minuti.
- `-ReuseClient` usa l'anteprima già attiva su 4320 (non è un processo suo, la sua build non è dichiarata).

## Verifiche

```powershell
./client-web/run.ps1 -Task Test     # modello e sessione con trasporto finto
./client-web/run.ps1 -Task Build    # tsc + build di produzione
./client-web/run.ps1 -Task Size     # limiti rigidi (JS 500 KB e totale 4 MB gzip, atlante 2048 px, texture 64 MB) e, a parte, il tetto di C4 sulle texture (32 MiB)
./client-web/run.ps1 -Task Atlas    # rigenera l'atlante O9 (servono i PNG locali, fuori da git)
./client-web/run.ps1 -Task Verify   # partite reali: richiede server e Serve attivi
./client-web/run.ps1 -Task VerifyModes   # due account, code e 1v1: richiede server e Serve attivi
./client-web/run.ps1 -Task VerifyLifecycle   # clock, forfait, rientri, riavvio: avvia da sé il server
./client-web/run.ps1 -Task VerifyFfa     # tutti contro tutti a cinque: avvia da sé il server
./client-web/run.ps1 -Task VerifyDecks   # catalogo, mazzi e open 1vCom: avvia da sé il server
./client-web/run.ps1 -Task VerifyPublic  # home, regole, registrazione: avvia da sé il server
./client-web/run.ps1 -Task VerifyProfile # profilo, admin, errori, strumenti: avvia da sé il server
./client-web/run.ps1 -Task VerifyResolution # fatti della risoluzione su partite reali: avvia da sé il server
./client-web/run.ps1 -Task VerifyAim # frecce verso i bersagli ammessi su partite reali: avvia da sé il server
./client-web/run.ps1 -Task VerifyLayout # scala e spazio del tavolo su partite reali: avvia da sé il server
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
**Consolidamento (C3-7).** Dal C4-1 si lancia tutto con `-Task VerifyAll` (sezione «Lancio unico»); quanto segue vale per le singole verifiche. Prima di eseguire tutte le verifiche, ricostruire il jar dal sorgente (`./scripts/build.ps1 -Task Server -Offline`: il jar in `server/target` può essere vecchio e i controlli sul volto passano a vuoto) e tenere `Serve` attivo. `Verify` e `VerifyModes` **non** avviano il server (serve un server su database temporaneo con `--app.dev.seed-accounts=true` sulla 8080); le altre lo avviano da sole e vogliono la 8080 libera. Non lanciare due verifiche insieme: usano gli stessi account. `BM_OUT=../docs/reports/client-c3/c3-7` e `BM_VIEWPORT=1366x768|844x390`. `Size` scrive in `docs/reports/client-c2/size.json`. Durata indicativa: `VerifyResolution` circa 35 minuti per misura, `VerifyLayout` e `VerifyAim` ridotti con `BM_SCENARIOS=duel,ffa` pochi minuti.
`VerifyAim` (C3-3, database temporaneo): per ogni carta della mano in duello, tocco emulato,
movimento ridotto e FFA a cinque, confronta le frecce della scena con i bersagli che la
vista ricevuta ammette (numero, destinazione, dentro lo schermo, fuori dai rettangoli reali
di ✓ e ×), nessuna freccia a scelta bloccata (pending fra due umani, esito), mira con mouse
e tocco senza comandi, riordino, annullamento, interruzione del trascinamento, D12 e
prestazioni del trascinamento. `BM_SCENARIOS` sceglie `duel,touch,reduced,ffa,pending`.
`VerifyLayout` (C3-L, database temporaneo) gioca tre turni di quick 1vCom e di FFA con quattro computer e a ogni
turno legge la scena e la shell HTML: misure in CSS px, spazio libero al centro, sovrapposizioni. Controlla il
personaggio proprio più grande degli altri, le carte del round uguali per nome e ordine a `resolvedMoves`, il mazzo
con il conteggio della vista, personaggi e oggetti di almeno 44 px, nessun posto fuori schermo o sovrapposto
(salvo la scritta decorativa «BOTTE MICIDIALI»), ogni primo piano della sequenza dentro lo schermo e lontano dagli
altri posti e dalla mano, e la cadenza dei frame del criterio di C0 dalla scelta alla fine della sequenza.
`BM_OUT=…/before` misura una build precedente senza controlli. Da C3-5 disegna ogni carta del catalogo come la mano e come carta piccola del round e controlla il danno del catalogo (tipo e importo, senza lettere, senza priorità, dentro il volto e fuori dai gettoni del costo), le facce della mano a ogni turno e l'ispezione (priorità e simboli del danno). Da C3-6 controlla anche le strisce del riepilogo (una per posto, nel carattere richiesto, libere da ogni posto, dalla mano, dalle pile, dalle carte del round e dalla riga breve) e la riga breve stessa (nel posto che la scena le ha dato, a 16 o 13 px, mai su un posto). `BM_SCENARIOS` sceglie `duel,ffa`.
`VerifyResolution` (C3-1, C3-2, C3-4 e revisione, C3-4s, C3-6, C3-5, database temporaneo; da C3-5 controlla anche gli impatti di ogni carta giocata contro le stringhe del catalogo, le enfasi e il banner dell'esito, e in movimento ridotto nessun segno né scossa) gioca quick 1vCom con caduta e rientro,
tre round con movimento ridotto emulato, interruzioni in quick 1vCom («Salta effetti»,
tocchi sul tavolo vuoto che passano di passo in passo, carta scelta durante la sequenza,
scheda nascosta: reale se il
browser la riporta, altrimenti emulata e dichiarata),
FFA con quattro computer (guardando dopo la propria morte), FFA con devBob e tre computer
in cui i due umani lasciano scadere il clock (salto di turni) e open 1vCom con due mazzi
sintetici salvati dall'editor («C3 contrasti», «C3 furti»: annullamenti, oggetti presi,
rubati e token). A ogni vista confronta i fatti esposti dal client con quelli ricalcolati
sulle viste ricevute, controlla che le variazioni sommate alla vista precedente diano la
nuova, che salti, altre partite e viste dello stesso turno non portino differenze e che i
fatti non cambino sostituendo il testo del server. Da C3-2 controlla anche la scena:
regole 1, 2, 3 e 6 del piano, una sequenza completa della durata pianificata (al
massimo 20 s dalla revisione di C3-4) per ogni round
contiguo con mosse, mai chiusa da una vista, riepilogo statico del round a ogni scelta,
nessuna sequenza né riepilogo dopo un salto e la riga dei turni risolti; fra umani, la
regola 4 con il clock che continua. Da C3-4, a ogni sequenza, calate, timbri, gettoni,
oggetti, scarti, pesche e passi animati uguali ai fatti ricalcolati sulle viste del socket,
barre per carta esattamente quando la misura delle righe del report torna, ogni plancia
uguale alla vista a sequenza finita; lo scenario `humans` (FFA con devAlice, devBob e tre
computer, otto round) registra durata e clock residuo a fine sequenza (sotto 10 s lo segnala
in `under10s`, come dato per A2). Da C3-4s, a ogni sequenza, voli uguali ai fatti (sgombero, pila, mano, scarti, oggetti,
pesche, dorsi) e scritte lette almeno `LABEL.read` − 50 ms, dentro lo schermo e non sovrapposte; gli scenari `info`,
`infoFfa` e `infoTouch` (partite lunghe, anche iPhone emulato) controllano (i) e ispezione a ogni round dopo ogni azione:
tocchi, «Salta effetti», carta durante la sequenza, ispezione, puntatore fermo sulla (i). Dalla revisione di C3-4 (D13), per ogni carta: tutti i passi
nell'ordine di D13 alle ore pianificate (costo, primo piano, ritorno, volo con l'impatto
dentro, primo piano del bersaglio, variazioni), le variazioni del costo dentro il passo costo
della propria carta e mai prima, un primo piano dell'autore e uno del bersaglio, piano della
scena uguale a quello ricalcolato sulle viste del socket, primi piani dentro lo schermo e senza
coprire gli altri posti. `BM_SCENARIOS` sceglie
gli scenari (`quick,reduced,interrupt,ffa,jump,humans,open`); `BM_RECORD=1` aggiunge a
`tests/resolution-views.json` i casi non ancora registrati (viste reali, carte ridotte
ai campi che il modello legge) e il catalogo dell'account se manca. Misura anche, senza effetti sul client, quanto spesso le
righe «RISORSA: a->b» del report più costi e fine turno danno la differenza fra le viste
(`reportConsistency`, base della decisione D1 riaperta). `BM_SERVER_PORT` avvia il server
temporaneo su un'altra porta, con un'anteprima su `BM_PORT` (variabile letta da
`vite.config.ts`) che punta a lui con `BM_SERVER`: serve per verificare accanto a un
server locale già acceso.
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
distribuito o remoto e nessun audio; simboli e timbri sono vettoriali. Da C4-3 ogni file di `public/` è nell'[inventario](../docs/design/client-c4/assets/README.md)
e `tests/assets.test.ts` fallisce per un file non registrato o con impronta diversa (vedi «Simboli, font e inventario»).

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
- `src/readability.ts`: funzioni pure di C2a e, da C3-3, la geometria delle frecce di mira: pagabilità (stesso confronto del
  server), ruolo e guadagni dal catalogo, indicatore delle risorse senza tetti né
  pavimenti, geometria del tavolo per duello e FFA a cinque (ventagli coperti,
  oggetti coperti da alzare al primo tocco).
- `src/art.ts`: riquadro dell'atlante per `bindingName` (manifest letto a runtime).
- `src/scene.ts`: tavolo Pixi, gesti e animazioni aggregate; non modifica il modello.
- `src/resolution.ts`: fatti certi del round da due viste (C3-1), riepilogo per posto
  e riga dei turni risolti (C3-2), il testo di «Ultimo turno» e la riga breve (`roundReport`, `briefLine`, C3-6),
  funzioni pure; nessun testo del server letto, nessun effetto calcolato.
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

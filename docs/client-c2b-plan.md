# Piano C2b — Parità del client debug

**Decisioni D1–D14: tutte le raccomandazioni sono state confermate dal proprietario il 27 ottobre 2026.**

27 ottobre 2026. Regolamento **1.7**, [roadmap del client](client-roadmap.md)
versione 14. **Solo piano:** nessun codice, nessuna modifica a regole, server,
catalogo o `client-debug`. C2a e O9 sono chiuse; C2b non è iniziata e parte
solo su istruzione esplicita del proprietario, un blocco alla volta.

Fonti lette: [regolamento](game-rules.md), [roadmap](client-roadmap.md)
(C2, matrice di parità, O1–O14, C3/C4), [rapporto C2](reports/client-c2-report.md),
[client-web](../client-web/README.md) e i suoi sorgenti, [checklist P01–P44](client-c0-parity.md),
[CLI](cli.md), [setup](setup.md), i sorgenti di `client-debug` (hub, modalità,
dialogo mazzo, collezione, editor, registrazione, admin, home, log errori,
trasporto) e dei controller server (code, partita, sessione, account, sign-up,
sicurezza HTTP).

## Obiettivo e regole comuni

**Risultato di C2b:** ogni operazione del client debug ha un equivalente
raggiungibile in `client-web`, con la finitura essenziale di C2a. Il server
resta l'unico giudice di legalità, costi ed esiti; nessuna nuova regola,
API o servizio.

Valgono per **ogni** blocco:

- **Un blocco = una sessione = un commit**, in quest'ordine, solo dopo
  l'istruzione del proprietario. Un blocco non si chiude con i soli test unitari.
- **Partite reali** sul server locale (`./scripts/dev.ps1 -Task Server -SeedAccounts`
  e `./client-web/run.ps1 -Task Serve`), guidate da Edge/Playwright, a
  1366×768 e 844×390. Una scena sintetica, una fixture o un trasporto finto
  non valgono come partita reale. Le scadenze di 30 s si provano in tempo reale.
- Regressione: il `Verify` esistente (quick 1vCom, C1+C2a) resta verde a ogni blocco.
- Verifiche: `./client-web/run.ps1 -Task Test`, `Build`, `Size` (JS ≤ 500 KB gzip,
  totale ≤ 4 MB gzip, atlante ≤ 2048 px, texture ≤ 64 MB), più quelle di AGENTS:
  `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`.
  Il contesto Spring non serve se il server non cambia; se un blocco lo
  tocca per decisione del proprietario, va eseguito a parte.
- Documenti aggiornati nello stesso commit: `client-web/README.md`, una sezione
  «C2b-n» in [rapporto C2](reports/client-c2-report.md), la revisione della
  [roadmap](client-roadmap.md), le righe P della [checklist](client-c0-parity.md)
  chiuse dal blocco con il collegamento all'evidenza. Evidenze in
  `docs/reports/client-c2/c2b-n/` (`BM_OUT`), senza sovrascrivere quelle di C2a/O9.
- Lingua dei testi nuovi secondo D1; identificatori wire, nomi carta e
  descrizioni del catalogo invariati.
- La FFA conserva quattro mani avversarie coperte e oggetti come carte presso
  le postazioni; nessun pannello testuale al posto del tavolo.

## Punto di partenza in client-web

Già presenti (C1, C2a, O9): login REST + CONNECT STOMP, profilo con timeout,
`resume`, hub minimo, quick 1vCom, tavolo Pixi con gesti, rifiuto, pending,
riepilogo del turno, esito, «Nuova partita», abbandono con conferma,
disconnessione simulata e «Rientra» senza reinvii, ricevuta di riavvio
(solo con dati di test), strumenti Log Card/State/Item/JSON, geometria FFA
verificata in unità.

Difetti e limiti trovati nel codice, da correggere nel blocco indicato:

| # | Dove | Problema | Blocco |
|---|---|---|---|
| K1 | `session.ts`, `open()` | `settle()` riapplica il vecchio `resume` a **ogni** `account/data`. Oggi arriva una sola volta; con salvataggio/cancellazione mazzi arriverà di nuovo e potrebbe riportare all'hub, rimostrare la ricevuta o reimpostare il modello su una vista vecchia. Va reso a uso singolo. | C2b-1 |
| K2 | `session.ts` | `quick()` e `leave('quick')` sono legati a 1vCom; nessuna uscita dalla coda (`/app/session/queue/leave`). | C2b-1 |
| K3 | `contracts.ts` | `Account` non ha `decks`; manca il tipo del mazzo (`UserGuiDeck`: `deckId`, `character`, `basicActionCard`, `lastResortCard`, `characterBoundCards`, `regularCards`, carte complete). | C2b-1 / C2b-4 |
| K4 | `scene.ts`, `playerName` | Ogni bot si chiama «Computer»: con tre o quattro bot in FFA non si distinguono (D9). | C2b-3 |
| K5 | `table.tsx` | Le ragioni di forfait (`leave`, `move timeout`, `reconnect timeout`) non sono tradotte; l'esito mostra solo `outcomeReason`. | C2b-2 |
| K6 | `table.tsx` | Nessun logout durante la partita (il debug lo ha nella barra). | C2b-2 |
| K7 | `scene.ts` | Gli oggetti avversari sovrapposti al 25% si alzano solo al passaggio del mouse; su touch un tocco li sceglie come bersaglio ma non li scopre prima. | C2b-3 |
| K8 | `main.tsx` | Nessuna navigazione: si parte dal login. Mancano home, regole, registrazione, collezione, profilo, presenza. | C2b-1, -4, -5, -6 |

## Checklist di parità

Stato in `client-web` oggi: **fatto** (verificato su server reale in C1/C2a),
**parziale**, **assente**. «C» = percorso condizionato dalla configurazione.
Endpoint relativi a `/rest` (REST, verso `/api/rest/v1`) e `/app`/`/user/queue`/`/topic` (STOMP).

### Navigazione, account e presenza

| ID | Funzione | Stato oggi | Endpoint / server | Rischio | Blocco |
|---|---|---|---|---|---|
| P01 | Home, regole, accesso, registrazione e ritorno | assente | nessuno (navigazione locale) | basso | C2b-5 |
| P02 | Collegamenti informativi, contatto, sostegno | assente | nessuno; link esterni del debug | basso; diritti da correggere (D8) | C2b-5 |
| P03 | Regolamento vigente completo | assente (solo aiuto breve nel menu) | nessuno; fonte `docs/game-rules.md` | medio: nessuna terza copia (D10) | C2b-5 |
| P04 | Login, errori, rete assente | **fatto** | POST `sign-in/validate`, CONNECT login/passcode | — | regressione |
| P05 | Profilo prima dell'hub, errore, timeout; seconda sessione | parziale: seconda sessione non provata | `/app/user/{u}/account`, `account/data`, `account/error` | basso | C2b-2 |
| P06 | Logout esplicito (anche in partita) | parziale: solo hub e «linea caduta» | `/app/session/logout`, ACK `session/logout` | medio: in partita è forfait | C2b-2 |
| P07 | Form registrazione, disponibilità username/email | assente | GET `sign-up/users/{u}/available`, `sign-up/mail/{m}/available` | basso | C2b-5 |
| P08 | Invio codice e registrazione (C) | assente | POST `sign-up/verify`, `sign-up/register`; email locale disabilitata | medio: solo errore esplicito in locale (D4) | C2b-5 |
| P09 | Lettura profilo (username, email, ruolo) | assente | `account/data` | basso | C2b-6 |
| P10 | Presenza: utenti, attività, conteggio, ordinamento, pagine 5/10/20 | assente | `/app/connections/users/tell/me`, `/topic/connections/users` | basso | C2b-1 |

### Code e modalità

| ID | Funzione | Stato oggi | Endpoint / server | Rischio | Blocco |
|---|---|---|---|---|---|
| P11 | Quick 1vCom | **fatto** | `/app/game/quick/1vCom/join`, `quick/1vCom/ready` | — | regressione |
| P12 | Quick 1v1 con due account | assente | `/app/game/quick/1v1/join`, ready privato `quick/1v1/ready` | medio: due contesti browser | C2b-1 |
| P13 | Quick FFA: lista iscritti, avvio automatico a cinque, tavolo a cinque | assente (solo geometria in unità) | `/app/game/quick/ffa/join`, `/topic/game/quick/ffa/joined`, ready `quick/ffa/ready` | **alto**: scena a cinque mai vista con dati reali | C2b-3 |
| P14 | Aggiunta bot | assente | `/app/game/quick/ffa/join/com` | basso | C2b-3 |
| P15 | Avvio anticipato da due | assente | `/app/game/quick/ffa/start`; con meno di due il server non risponde | medio: nessun messaggio di rifiuto dal server | C2b-3 |
| P16 | Open 1vCom con mazzo salvato | assente | `/app/game/open/1vCom/join/{u}/{deckId}`, `open/1vCom/ready`, `open/1vCom/error` | medio: errore difficile da provocare dalla UI | C2b-4 |
| P17 | Attesa, errori, uscita dalla coda | parziale: solo errore quick | `/user/queue/game/error`, `/app/session/queue/leave` + ACK | medio: sottoscrizioni da chiudere | C2b-1, C2b-3 |

### Catalogo ed editor (R02, nessun vincolo nuovo)

| ID | Funzione | Stato oggi | Endpoint / server | Rischio | Blocco |
|---|---|---|---|---|---|
| P18 | Consultazione catalogo e personaggi | assente (catalogo usato solo dal tavolo) | `account/data.collection` | basso | C2b-4 |
| P19 | Elenco e creazione mazzi | assente | `account/data.decks` | basso | C2b-4 |
| P20 | Modifica e annullamento (nome bloccato se esistente) | assente | nessuna richiesta | basso | C2b-4 |
| P21 | Slot personaggio/basic/last, bound duplicabili ≤ 5, svuota bound | assente | nessuna richiesta | medio: non aggiungere filtri | C2b-4 |
| P22 | Ricerca, vista collezione/mazzo, aggiungi/togli una copia | assente | nessuna richiesta | basso | C2b-4 |
| P23 | Salvataggio e sovrascrittura | assente | `/app/user/{u}/deck`, `account/data`, `account/error` | medio: K1 | C2b-4 |
| P24 | Cancellazione | assente | `/app/user/{u}/deck/delete` | basso | C2b-4 |

### Tavolo, comandi e ciclo di vita

| ID | Funzione | Stato oggi | Endpoint / server | Rischio | Blocco |
|---|---|---|---|---|---|
| P25 | Tavolo dalla vista privata; isolamento fra due account | parziale: isolamento non provato | `/user/queue/game/{id}/view`, `/topic/game/{id}/{update,move}`, `illegalMove` | medio | C2b-1, C2b-3 |
| P26 | Personaggi, risorse, oggetti, stati, timer, immunità | **fatto** in duello | vista | medio in FFA (spazio) | C2b-3 |
| P27–P29 | Comando ordinario, bound con scarto, bersaglio oggetto | **fatto** | `/app/game/{id}/move` | — | regressione |
| P30 | Scelta, invio, pending, rifiuto | **fatto** | come sopra | — | regressione |
| P31 | Riepilogo mosse e fine turno | **fatto** (finitura in C3) | vista | — | regressione |
| P32 | Clock indicativo, pending, scadenze simultanee | parziale: mai provato in multigiocatore | `moveDeadlines`, `reconnectDeadlines` | **alto**: 30 s reali, nessuna ora server | C2b-2, C2b-3 |
| P33 | Abbandono/forfait, FFA che prosegue, idempotenza | parziale: solo 1vCom | `/app/game/{id}/{p}/leave` + ACK | medio | C2b-2, C2b-3 |
| P34 | Rientro prima/dopo il termine, pending conservata | parziale: solo 1vCom prima del termine | `/app/session/resume`, `session/resume` | **alto** | C2b-2, C2b-3 |
| P35 | Ricevuta di draw al riavvio senza vista | parziale: codice C1, mai provato con un riavvio vero | `resume` con `archived`, nessuna `view` | medio: riavvio orchestrato (D12) | C2b-2 |
| P36 | Vittoria, sconfitta, pareggio, morto/forfait | parziale: solo esiti di combattimento | `over`, `winner`, `outcomeReason`, `forfeits` | basso | C2b-2, C2b-3 |
| P37 | Nessuna mossa valida (limite R03) | **fatto** (spiegazione nel menu) | nessuno | — | regressione |

### Diagnostica, amministrazione e log

| ID | Funzione | Stato oggi | Endpoint / server | Rischio | Blocco |
|---|---|---|---|---|---|
| P38 | Log Card, Log State, Log Item | **fatto** | nessuno | da riprovare in 1v1/FFA (nessuna mano altrui) | C2b-6 |
| P39 | Log JSON, simulazione disconnessione | **fatto** | nessuno | — | C2b-6 |
| P40 | Pannello admin per ruolo ADMIN, conteggi (C) | assente | GET `logs/back/games/qty`, `logs/client/web/qty`; HTTP Basic separato | **alto**: in locale nessun ADMIN né Basic (D5) | C2b-6 |
| P41 | Partite non concluse (C) | assente | GET `logs/back/games/open` | come P40 | C2b-6 |
| P42 | Download log (C) | assente | GET `logs/back/games/drain`, `logs/client/web/drain` | come P40 | C2b-6 |
| P43 | Cancellazione log con conferma (C) | assente | DELETE `logs/back/games/delete`, `logs/client/web/delete` | alto: solo dati sintetici | C2b-6 |
| P44 | Segnalazione errori client | assente | POST `logs/client/web/` (pubblico; `log.db: Y` nel profilo locale) | medio: niente credenziali, niente ricorsione | C2b-6 |

## Blocchi

Rispetto alla traccia suggerita (cinque blocchi) propongo **sette blocchi**,
per due ragioni emerse dal codice:

1. **Il ciclo di vita si separa dalle modalità.** Clock, scadenze, rientri e
   riavvio richiedono attese reali di 30 s, due account e un riavvio del server:
   è il blocco più rischioso e va provato prima su 1v1, dove gli esiti sono
   semplici, e poi riusato in FFA.
2. **Open 1vCom passa accanto all'editor.** Richiede un mazzo salvato e lo stesso
   aggiornamento di `account/data` del salvataggio (K1): provarlo prima
   dell'editor obbligherebbe a creare il mazzo con il debug o la CLI.
   Home, regole e registrazione (tutte prima del login, solo REST) formano un
   blocco a sé; profilo, admin e log un altro.

| Blocco | Contenuto | Dipende da |
|---|---|---|
| C2b-1 | Modalità e code: hub «Gioca», 1v1, uscita dalla coda, presenza | — |
| C2b-2 | Ciclo di vita 1v1: clock, forfait, rientri, logout, riavvio | C2b-1 |
| C2b-3 | FFA a cinque con la geometria C2a, bot, avvio anticipato, forfait altrui | C2b-1, C2b-2 |
| C2b-4 | Catalogo, editor mazzi e open 1vCom | C2b-1 |
| C2b-5 | Home, regole e registrazione | — (dopo C2b-1 per l'hub) |
| C2b-6 | Profilo, amministrazione, log client e diagnostica | C2b-1 |
| C2b-7 | Checklist di parità completa e prova umana B | tutti |

C2b-4, C2b-5 e C2b-6 sono indipendenti fra loro dopo C2b-1 e possono cambiare
ordine. C2b-3 non parte prima di C2b-2.

### C2b-1 — Modalità e code

**Perimetro.** Generalizzare `Session` da «quick 1vCom» a `join(modalità)` con
stato di coda (modalità, iscritti FFA), uscita dalla coda con ACK e chiusura
delle sottoscrizioni di coda; correggere K1 e K2; aggiungere `decks` al
contratto (K3, solo tipo). Hub a schede **Gioca** (le altre schede arrivano
nei blocchi successivi): selettore delle modalità (quick 1vCom, quick 1v1;
FFA e open visibili ma rimandati ai propri blocchi), attesa con «Esci dalla
coda», errore di ingresso, elenco della presenza (utente, attività, conteggio,
ordinamento per colonna, pagine 5/10/20). «Nuova partita» ripete la modalità
appena giocata (D11). Il tavolo 1v1 è quello del duello, senza cambi grafici.

**Completamento verificabile (partite reali).** Nuovo script di verifica con
**due contesti Edge** (devAlice, devBob):
- entrambi in coda 1v1 ricevono lo stesso `gameId` e giocano fino all'esito,
  una partita a 1366×768 e una a 844×390;
- ogni vista ricevuta da A ha la propria mano come array e quella di B come
  numero, e viceversa; nei frame WebSocket di A non compare nessun nome di
  carta della mano di B fuori dalle mosse risolte;
- A entra in coda 1v1 ed esce: arriva l'ACK, i pulsanti tornano attivi, poi B
  entra da solo e resta in attesa senza partita; esce anche lui;
- ingresso rifiutato mentre una partita è riprendibile → messaggio dal canale
  `game/error`, nessuno spinner infinito;
- A vede B comparire e sparire dalla presenza, con il conteggio aggiornato;
- dopo l'esito «Nuova partita» rientra nella coda 1v1;
- test unitari della sessione con trasporto finto: `account/data` ripetuto non
  riapplica `resume` (K1), uscita dalla coda, sottoscrizioni chiuse.

**File toccati.** `src/session.ts`, `src/contracts.ts`, `src/main.tsx`, nuovo
`src/hub.tsx`, `src/table.tsx` (solo «Nuova partita»), `tests/session.test.ts`,
nuovo `tools/verify-modes.mjs` (o scenari in `verify.mjs`), `package.json`,
`run.ps1` (nuovo task), documenti comuni.

**Rischi.** Due sessioni Playwright parallele e tempi del matchmaking; la
coda 1v1 non ha lista pubblica, quindi l'attesa si riconosce solo dal ready.
Peso stimato +5–10 KB gzip.

### C2b-2 — Ciclo di vita in 1v1

**Perimetro.** Clock indicativo per l'umano in partite fra umani (già presente,
mai provato); ragioni di forfait tradotte (K5); logout dal menu in partita con
conferma, perché vale come forfait (K6); esiti per abbandono, tempo scaduto
e rientro scaduto; rientro prima e dopo il termine, pending conservata;
sessione unica; ricevuta di riavvio senza vista. Nessun cambio al protocollo:
countdown dall'epoch della vista, esito deciso solo dal server.

**Completamento verificabile (partite reali, 1v1 con due contesti).**
1. A invia, B no: allo scadere dei 30 s B perde per tempo scaduto, A vince;
   l'HEALTH di B resta quella della vista.
2. Nessuno dei due invia: pareggio per scadenze simultanee.
3. A invia, poi «Simula disconnessione», rientra entro 30 s: stessa partita,
   stessa pending, **zero** SEND dopo il rientro (conteggio dei frame).
4. A cade e rientra dopo 30 s: riceve il proprio forfait; B vince.
5. A abbandona dal menu: ACK, forfait, ritorno all'hub; un secondo leave non
   produce un altro esito.
6. A fa logout in partita: forfait, ritorno al login.
7. Secondo login di A da un altro contesto mentre il primo è collegato: rifiutato
   con il messaggio esistente.
8. Riavvio (D12): partita 1v1 in corso, server arrestato e riavviato; al nuovo
   login entrambi vedono «Pareggio — riavvio server» nell'hub; nei frame nessun
   SUBSCRIBE/SEND al vecchio `gameId`.
9. Regressione vsCom: caduta oltre 30 s → forfait anche contro computer.

**File toccati.** `src/session.ts`, `src/table.tsx`, `src/main.tsx`,
`tests/session.test.ts`, verifica nuova (`tools/verify-lifecycle.mjs`) ed
eventualmente un task che avvia e ferma il server su un database temporaneo
(`BM_DATABASE_PATH`) senza modificare `scripts/`, documenti comuni.

**Rischi.** Attese reali (circa 5 minuti di verifica); la vista non porta l'ora
del server, quindi il countdown può differire di qualche centinaio di ms e il
test deve aspettare l'esito del server, non lo zero locale. Riavvio orchestrato
fragile su Windows (processo Java figlio). Peso trascurabile.

### C2b-3 — FFA a cinque

**Perimetro.** Coda FFA: lista iscritti (umani e computer) dal topic pubblico,
«Aggiungi computer», «Inizia ora» attivo solo con almeno due iscritti (il server
non risponde con meno di due), avvio automatico al quinto; tavolo a cinque
con la geometria `tableLayout` di C2a (oggetti propri sulla riga del personaggio,
ventaglio dopo di loro, oggetti avversari sovrapposti al 25% che si alzano al
passaggio del mouse **o al primo tocco**, K7), quattro ventagli coperti dai
conteggi, nomi distinti dei computer (K4, D9). Forfait e morte altrui: gli altri
proseguono; proprio forfait o eliminazione secondo D11. Nessun pannello
testuale nuovo sul tavolo.

**Completamento verificabile (partite reali).**
- A + quattro computer: avvio automatico a cinque, partita fino all'esito a
  1366×768 e a 844×390; a ogni turno la lettura della scena conferma cinque
  posti, quattro ventagli con numero uguale a `cardsInHand`, oggetti come carte,
  nessuna sovrapposizione fra posti, mano e bordi (stessi controlli dei test
  di geometria, ma sulle viste reali); catture.
- A + B + tre computer: due umani nella stessa FFA, isolamento delle mani
  come in C2b-1.
- A + B, «Inizia ora» con due iscritti: FFA a due (`quickFFA`) fino all'esito.
- A in coda con computer esce: i computer rimasti senza umani spariscono dalla lista.
- In FFA con A, B e computer: B abbandona, A continua fino all'esito; in un'altra
  partita B lascia scadere il clock e A continua; B cade e rientra dopo il
  termine e vede il proprio forfait e lo stato corrente.
- Bersagli su un oggetto avversario sovrapposto, con mouse e con tocco emulato.
- Prova del proprietario su iPhone a 750×292 (giudizio, senza misure).

**File toccati.** `src/session.ts`, `src/hub.tsx`, `src/scene.ts`,
`src/readability.ts` (solo se la prova reale smentisce la geometria),
`src/table.tsx`, test unitari di geometria e nomi, verifica FFA, documenti comuni.

**Rischi.** È il blocco con più incognite grafiche: densità a 844×390 e 750×292,
riepilogo del turno che copre gli avversari in alto (limite noto di C2a,
finitura in C3), testo dei ventagli piccoli, prestazioni con cinque posti
(misurate in C0 solo sulla scena sintetica). Se la geometria non regge si
riducono decorazioni e dimensioni secondarie, non si tolgono mani coperte né
oggetti come carte. ID dei bot casuali (`ComPlayer_` + numero < 10000):
collisioni improbabili, fuori perimetro.

### C2b-4 — Catalogo, editor mazzi e open 1vCom

**Perimetro.** Scheda **Collezione** in HTML/React: catalogo completo di carte e
personaggi con le illustrazioni O9 (`artCss`), ruolo, guadagni, costo,
priorità, bersagli e testo; elenco mazzi, nuovo, modifica su copia, annulla,
salva/sovrascrivi (nome bloccato per un mazzo esistente), cancella con conferma
(D11). Editor con le stesse regole del debug e di R02, niente di più: personaggio,
basic e last resort obbligatori; bound duplicabili fino a cinque (iniziali
basic + bound ≤ 6) con «Svuota»; almeno una regolare; ricerca sul testo, vista
collezione/mazzo, aggiungi una copia e togli una copia omonima. Nessun limite
di copie, nessun 20+2, nessun filtro di compatibilità delle bound. Errori da
`account/error`. **Open 1vCom**: dialogo di scelta fra i mazzi salvati (vuoto →
rimando alla collezione), annulla, avvio, errore dal canale `open/1vCom/error`.
La logica dell'editor sta in un modulo puro testato in unità.

**Completamento verificabile (partite reali).** Con devAlice: crea un mazzo
sintetico (per esempio Spazienzio, BruiserGrab, Struggle, due bound, poche
regolari ripetute) → salva → compare nell'elenco → riapri e annulla, il salvato
è invariato → modifica e sovrascrivi → open 1vCom con quel mazzo fino all'esito,
controllando che personaggio e carte in mano provengano dal mazzo → cancella →
scompare dall'elenco e dal dialogo. Un mazzo non valido per il debug resta non
salvabile; uno valido secondo R02 ma «strano» (sei carte iniziali, regolari
tutte uguali) si salva e si gioca. Il catalogo mostra tutte le 39 carte e i
2 personaggi, confrontati con l'allegato `rules-catalog.json`.

**File toccati.** Nuovi `src/collection.tsx` e `src/deck.ts`, `src/hub.tsx`,
`src/session.ts` (salva, cancella, open), `src/contracts.ts`, `src/style.css`,
`tests/deck.test.ts`, verifica, documenti comuni.

**Rischi.** L'errore open (`Deck unavailable`) non è raggiungibile dalla UI
con un solo account (il dialogo elenca solo mazzi esistenti): prova reale solo
se si trova un percorso, altrimenti unità + scenario CLI I16 esistente, dichiarato
come limite. Lista lunga di carte su 844×390: scorrimento della scheda accettabile
(non è il tavolo). Peso stimato +10–20 KB gzip.

### C2b-5 — Home, regole e registrazione

**Perimetro.** Schermate prima del login, con navigazione e ritorno: home con
presentazione, «Accedi», «Registrati», «Regole», sezione secondaria con gli
stessi collegamenti del debug (Instagram, YouTube, GitHub profilo e due
repository, email, PayPal) e il testo dei diritti corretto secondo README e
CONTRIBUTING («tutti i diritti riservati», nessuna licenza open source); nessuna
immagine sponsor storica. **Regole:** il regolamento vigente letto da
`docs/game-rules.md` al build (D10), senza una terza copia. **Registrazione:**
username alfanumerico, email, password e conferma, codice di sei cifre;
disponibilità di username ed email; invio codice e registrazione; nel profilo
locale errore esplicito di servizio non disponibile, senza promettere
l'onboarding. Navigazione con hash, senza nuove dipendenze di routing.

**Completamento verificabile (server locale reale).** Percorso home → regole →
home → accesso → hub → esci → home. I collegamenti hanno le stesse destinazioni
del sorgente debug (confronto degli `href`, senza aprirli nel test). Il testo
delle regole coincide con `docs/game-rules.md` (titoli R00–R09, revisioni,
tabelle R07/R07a). Registrazione: `devAlice` risulta occupato, un nome nuovo
libero; «Invia codice» nel profilo locale produce il messaggio di indisponibilità
e riabilita il modulo; codice errato rifiutato; nessun account creato (la
validazione del nuovo nome resta falsa). Con il server spento: errore di rete,
nessuno spinner infinito. Portrait ammesso fuori dal tavolo (D7).

**File toccati.** Nuovo `src/public.tsx` (home, regole, registrazione), nuovo
`src/net/rest.ts`, `src/main.tsx`, `src/style.css`, `vite.config.ts` (import del
regolamento), test unitari dei validatori, verifica, documenti comuni.

**Rischi.** Collegamenti interni del regolamento (ancore, `rules-catalog.json`)
da rendere innocui; peso del testo (circa 10 KB gzip). Il comportamento esatto
di `sign-up/verify` senza SMTP va osservato e mappato, non supposto.

### C2b-6 — Profilo, amministrazione, log client e diagnostica

**Perimetro.** Scheda **Profilo**: username, email (o «—»), ruolo. Per il ruolo
ADMIN del profilo STOMP, pannello admin come il debug: conteggi partite e log
client, partite non concluse, download dei due log, cancellazione con conferma
esplicita e aggiornamento dei conteggi. Autorizzazione **HTTP Basic separata**
lasciata al browser (D6): il client non chiede né conserva credenziali
amministrative. 401/403 → «non autorizzato in questo ambiente», mai un successo.
**Log client:** segnalazione degli errori non gestiti (`error`,
`unhandledrejection`) a POST `logs/client/web/` con `{timestamp,message,additional}`,
un invio alla volta, timeout 5 s, nessuna ricorsione se l'invio fallisce,
nessuna credenziale né vista nel messaggio. **Diagnostica:** strumenti esistenti
riprovati in 1v1 e FFA (nessuna mano altrui, nessun ordine dei mazzi).

**Completamento verificabile (server locale reale).** devAlice (USER) vede il
profilo e nessun pannello. Un errore provocato nella pagina produce un solo
POST accettato (`log.db: Y` lo persiste), senza password nel corpo; con
l'ingestione irraggiungibile nessun ciclo di invii. In 1v1 Log State/Item/JSON
non contengono la mano avversaria. Percorso ADMIN secondo D5: in un ambiente di
prova dedicato (database temporaneo con un account sintetico ADMIN e Basic
configurato) conteggi, elenco, download leggibile, annulla senza DELETE,
conferma con DELETE su soli log sintetici; senza Basic il pannello mostra
l'indisponibilità. Se D5 non è approvata, il blocco dichiara il percorso
positivo non provato.

**File toccati.** Nuovi `src/profile.tsx` e `src/report.ts`, `src/net/rest.ts`,
`src/hub.tsx`, `src/main.tsx`, test unitari del limitatore, verifica, documenti
comuni.

**Rischi.** Il prompt Basic del browser per `fetch` DELETE dietro il proxy Vite
può non comparire in tutti i browser: va verificato su Edge, eventuale ripiego
da decidere senza gestire password nel client. I DELETE cancellano davvero:
solo su database temporaneo.

### C2b-7 — Checklist di parità e prova umana B

**Perimetro.** Nessuna funzione nuova salvo correzioni di blocchi emersi.
Esecuzione consolidata di tutte le verifiche (1vCom, 1v1, ciclo di vita, FFA,
mazzi/open, schermate pubbliche, profilo) a 1366×768 e 844×390; `Size`; verifiche
del repository; P01–P44 chiuse con evidenza o limite della base esplicito;
roadmap aggiornata («C2 chiusa» solo dopo il giudizio del proprietario).
**Prova umana B** sulla parità completa (D3, D13): 3–5 persone, circa un'ora,
duello, FFA con eventuali computer e un mazzo salvato, anche su telefono con
`run.ps1 -Task Physical`. Ognuno riconosce attesa, mossa accettata e proprio
esito; in FFA chi resta continua dopo un forfait altrui. Le scadenze rare restano
alle verifiche automatiche, non ai giocatori.

**Completamento verificabile.** Tutte le verifiche verdi nella stessa build;
checklist senza omissioni; prova B annotata con blocchi e incomprensioni
assegnati a C2/C3/C4; giudizio del proprietario.

**File toccati.** Documenti (checklist, rapporto, roadmap, README), evidenze,
correzioni puntuali.

**Rischi.** Disponibilità di account e persone (D3); osservazioni che chiedono
finitura (C3/C4) vanno solo registrate e assegnate.

## Decisioni del proprietario

Ogni domanda ha una risposta chiusa; in grassetto la raccomandazione.

| ID | Domanda | Opzioni | Raccomandazione |
|---|---|---|---|
| D1 | Lingua dell'interfaccia | italiano / inglese come il debug | **Italiano**, come C1–C2a; identificatori wire, nomi e testi del catalogo invariati. |
| D2 | Divisione in sette blocchi invece di cinque | sette / cinque della traccia | **Sette**: ciclo di vita separato, open accanto all'editor, pagine pubbliche separate da profilo/admin. |
| D3 | Account per prove a più umani e per la prova B (oggi solo devAlice e devBob) | a) altri account sintetici locali (piccola modifica server, commit separato approvato) / b) FFA con due umani più computer e prova B a due umani per volta / c) ambiente SMTP di prova | **a)** prima di C2b-7, fuori da C2b; per C2b-1…6 bastano due account più i computer. |
| D4 | Registrazione nel profilo locale (email disabilitata) | solo errore esplicito / prova positiva con SMTP dedicato | **Solo errore esplicito** in C2b; prova positiva solo se il proprietario fornisce un ambiente SMTP. |
| D5 | Prova positiva dell'admin | ambiente temporaneo (database temporaneo con account sintetico ADMIN e Basic da variabili d'ambiente, nessun cambio di codice) / solo indisponibilità locale | **Ambiente temporaneo**, cancellazioni su soli dati sintetici. |
| D6 | Credenziali Basic dell'admin | prompt nativo del browser / modulo nel client | **Prompt nativo**, come il debug: il client non tocca password amministrative. |
| D7 | Orientamento fuori dal tavolo | portrait ammesso per home, regole, moduli e collezione / landscape ovunque | **Portrait ammesso fuori dal tavolo**; il tavolo resta solo landscape. |
| D8 | Home: collegamenti e diritti | stessi link del debug con diritti corretti / togliere i link | **Stessi link**, testo «tutti i diritti riservati», nessuna immagine sponsor storica. |
| D9 | Nomi dei computer in FFA | «Computer 1–4» per ordine d'ingresso, ID completo in ispezione e strumenti / ID grezzo | **Computer 1–4**. |
| D10 | Fonte del regolamento nel client web | importare `docs/game-rules.md` al build / nuova copia controllata da `check-rules.py` | **Importare la fonte**: nessuna terza copia, R00 e `check-rules.py` invariati. |
| D11 | Comportamenti di comodo: «Nuova partita», conferma cancellazione mazzo, proprio forfait in FFA | come proposto / come il debug | **Come proposto:** «Nuova partita» ripete la modalità (open con lo stesso mazzo); conferma prima di cancellare un mazzo; dopo la propria morte si può restare a guardare fino all'esito, dopo il proprio forfait esito e ritorno all'hub come nel debug. |
| D12 | Prova del riavvio | verifica che avvia e ferma il server su un database temporaneo / passo manuale guidato | **Server orchestrato su database temporaneo**, senza toccare i dati locali. |
| D13 | Prova umana B | nuova sessione completa in C2b-7 / basta quella di C2a | **Nuova sessione completa**: la B di C2a copriva solo quick 1vCom. |
| D14 | Segnalazione errori client | solo errori / anche log informativi come l'NGXLogger del debug | **Solo errori**, senza nomi utente né credenziali nel messaggio. |

## Cosa non è in C2b

- **C3, risoluzione osservabile:** frecce verso i bersagli (O6), effetti per
  carta e tipo di danno (O7), sequenza animata del round, revisione del
  riepilogo che copre gli avversari, gestione più fine di viste ripetute e
  background oltre a quanto già fatto in C1.
- **C4, finitura:** sfondo (O2), cornici per tipologia e ruolo definitivo
  (O8/O14), simboli al posto delle lettere (O10), finitura O12, aspetto dei
  controlli, suoni, ridisegno incrementale, nuova misura fisica a parità completa,
  sostituzione delle illustrazioni provvisorie.
- **Regole e server:** nessuna nuova regola (pass umano, limiti dei mazzi,
  bilanciamento), nessun nuovo endpoint, evento strutturato, revisione della vista
  o ora del server; nessuna modifica al catalogo. Eventuali account sintetici in
  più (D3) sono un commit separato, approvato a parte.
- **Fuori perimetro della roadmap:** open PvP, lobby private, Elo, premi,
  recupero password, modifica del profilo, cronologia, replay, spettatori,
  interfaccia di export dell'archivio, hosting pubblico, client nativi, PWA.
- `client-debug` non cambia e resta il riferimento fino a C5; `window.__bm` si
  rivaluta in C5.

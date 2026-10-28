# Client web animato (C1, C2a, O9, C2b-1, C2b-2, C2b-3)

Il tavolo del bar approvato in C0, collegato al server reale. Percorso disponibile:
login → hub «Gioca» (contro il computer, uno contro uno o tutti contro tutti fino a
cinque) → partita → esito → nuova partita nella stessa modalità oppure ritorno
all'hub. Open con mazzo e il resto della parità del debug arrivano nei blocchi
successivi di C2b
([piano](../docs/client-c2b-plan.md)). La scena C0 resta congelata in
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

## Hub «Gioca» (C2b-1, C2b-3)

- Modalità: contro il computer, uno contro uno e tutti contro tutti; open compare
  ma è disattivata fino al suo blocco. «Gioca» entra nella coda scelta.
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
- «Nuova partita» rientra nella coda della modalità appena giocata; dopo un rientro
  la modalità si deduce dalla vista (più di due giocatori: tutti contro tutti).
- «Al bar»: utenti collegati e attività (`/topic/connections/users`), conteggio,
  ordinamento per colonna, pagine da 5, 10 o 20 righe.
- Il `resume` del login si applica una sola volta; un `account/data` successivo
  aggiorna solo il profilo.

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
```

`Verify` guida il client con Edge (Playwright) contro il server locale: login,
quick 1vCom, partite fino all'esito per entrambi i personaggi, bound con scarto,
bersaglio oggetto, rifiuto, effetto periodico letto dal riepilogo, calata con
drag e con click, riordino senza SEND, disconnessione e rientro senza reinvii,
ritorno all'hub e uscita. A ogni turno controlla anche C2a: misure delle carte,
plancia uguale alle risorse della vista, attenuazione calcolata come il server,
ruolo e guadagni uguali all'allegato del regolamento, alzata al passaggio del
mouse; invia apposta una carta attenuata e si aspetta il rifiuto del server.
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
`BM_VIEWPORT=844x390` ripete al formato landscape
compatto; `BM_HEADED=1` mostra Edge; `BM_CLIENT` cambia l'indirizzo (anche
quello LAN con `?k=`); `BM_OUT` scrive altrove le evidenze. Evidenze correnti in
[docs/reports/client-c2](../docs/reports/client-c2/) (quelle di C1 restano in `client-c1`);
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
- `src/hub.tsx`, `src/presence.ts`: hub «Gioca», coda FFA e presenza (ordinamento,
  pagine e nomi dei giocatori come funzioni pure).
- `src/lifecycle.ts`: esiti, ragioni di forfait e countdown indicativi (funzioni pure).
- `src/table.tsx`, `src/main.tsx`, `src/ui.tsx`: shell React (accesso,
  tavolo, esito, dialoghi).
- `window.__bm`: stato in sola lettura della pagina per la verifica automatica;
  nessun comando. Da rivalutare prima della consegna C5.

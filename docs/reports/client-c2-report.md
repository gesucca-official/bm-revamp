# Rapporto C2 — Parità del client debug

27 ottobre 2026. Regolamento **1.7**. C2 è avviata su istruzione esplicita del
proprietario a partire dal primo blocco, C2a «leggibilità di base», con il piano
confermato. C2b (1v1, FFA, code, open, editor e il resto della parità) è in corso a
blocchi: **C2b-1 (modalità e code) è fatto** ([sezione](#c2b-1--modalità-e-code)), **C2b-2 (ciclo di vita in 1v1) è fatto** ([sezione](#c2b-2--ciclo-di-vita-in-1v1)), **C2b-3 (FFA a cinque) è fatto** ([sezione](#c2b-3--ffa-a-cinque)), **C2b-4 (catalogo, editor mazzi e open 1vCom) è fatto** ([sezione](#c2b-4--catalogo-editor-mazzi-e-open-1vcom)), **C2b-5 (home, regole e registrazione) è fatto** ([sezione](#c2b-5--home-regole-e-registrazione)), **C2b-6 (profilo, amministrazione, log client e diagnostica) è fatto** ([sezione](#c2b-6--profilo-amministrazione-log-client-e-diagnostica)), **C2b-7 (checklist e prova umana B) è fatto** ([sezione](#c2b-7--checklist-di-parità-e-prova-umana-b)). **C2 è chiusa** dal proprietario il 29 ottobre 2026. Dopo C2a è fatta e chiusa O9, le illustrazioni provvisorie
([sezione O9](#o9--illustrazioni-provvisorie)).

## C2a — Leggibilità di base

Obiettivo: rendere leggibili carte e risorse prima della prova umana B, nel solo
percorso quick 1vCom già esistente (osservazioni O11–O14 con O3 e O4 della
[roadmap](../client-roadmap.md#osservazioni-del-proprietario-dopo-c1)).

### Esito in breve

| Livello | Stato |
|---|---|
| Implementazione | O14: regolamento 1.7 con R07a, ruolo e guadagni nel catalogo SQLite, esposti dal server. In `client-web`: O11 carte non pagabili attenuate, O12 carte più grandi che si alzano intere, O13/O3/O4 plancia delle risorse e guadagni sulle carte, O14 timbro di ruolo. |
| Test automatici | Client 30 test unitari (19 di C1 e 11 nuovi su attenuazione, ruoli, guadagni, indicatore, stati e geometria duello/FFA). Server 252 unit test, contesto Spring completo 359, client debug 36, `check-rules.py`: tutti verdi. Typecheck, build e peso entro il budget. |
| Partite reali su server locale | **Sì.** `Verify` esteso con i controlli C2a, sulla build finale dopo la revisione del proprietario: 5 partite fino all'esito a 1366×768 (2 vittorie, 2 sconfitte, 1 pareggio) e 3 a 844×390 (1 vittoria, 2 sconfitte), entrambi i personaggi in ciascuna esecuzione. |
| Emulazione | 844×390 sullo stesso PC, con il mouse. Nessuna emulazione touch. |
| Dispositivo fisico | **Sì.** Il proprietario ha provato tutta C2a su iPhone (27 ottobre 2026): giudizio umano, nessuna misura. |
| Valutazione umana | **Sì.** Prova umana B senza rilievi rilevanti; il proprietario ha provato anche su desktop e chiude C2a (27 ottobre 2026). |

### O14 — Ruolo nel catalogo (commit dati separato)

Decisione del proprietario: la classificazione è un campo del catalogo SQLite.
Valori approvati dal proprietario, con OTHER per le carte ambigue da rivedere con il
bilanciamento. Glare, BadEducation, EverythingIsDrug e il token BrokenBeerBottle
sono OTHER.

- [Regolamento 1.7, R07a](../game-rules.md#r07a--ruoli-descrittivi-delle-carte-17):
  ruolo (DAMAGE, DEFENSE, RESOURCES, COUNTER, DISRUPT, ITEMS, OTHER) e guadagni
  a sé per 37 carte e token; personaggi «—». Campi descrittivi: nessun effetto,
  costo, bersaglio, priorità, starter o bilanciamento cambia. Copia identica in
  `client-debug/src/assets/docs/rules.md`.
- `cards.sqlite`: colonne `T_GUI_ROLE` e `T_GUI_GAINS` in `CRD001_GUI`; il
  suffisso delle 37 descrizioni passa a «Regolamento 1.7». Allegato
  `rules-catalog.json` alla 1.7 con `role` e `gains`.
- Server, modifica minima: due colonne in `CardsGuiRecord`, `setGuiRole` in
  `LoadableCard`/`AbstractCard`, chiamata nel `CardFactoryServiceImpl`. Le carte
  le serializzano già come `role` e `gains`. Il token, che non è nel catalogo, li
  dichiara nel costruttore come il suo nome.
- Verifiche:
  - `check-rules.py` confronta R07a con allegato, SQLite e il nuovo
    `rules-card-roles.tsv`.
  - `CardRulesContractTest.r07a_rolesReachTheCards` controlla token e factory.
  - `CatalogRuntimeTest` (contesto) controlla tutte le carte dal vero SQLite.
- Attesi cambiati per il solo cambio deliberato di versione: `MatchArchiveTest` e
  `scripts/cli-match-export-test.cjs` leggono ora `rulesVersion` 1.7. La prima
  esecuzione del contesto dopo il cambio è fallita proprio lì (2 casi del
  `MatchArchiveCliTest`); dopo l'adeguamento sono 359 su 359.

### Interfaccia (solo `client-web`)

La logica nuova sta in `src/readability.ts`: funzioni pure sulla vista privata,
senza costi sottratti né effetti calcolati. `scene.ts` la disegna.

- **O11 — carte non pagabili.** Una carta della mano il cui costo supera le
  risorse correnti è più spenta (opacità 0,66). Sulla moneta del costo compaiono
  anche «!» e una barra, così il segnale non è affidato al solo colore. Il confronto è quello del server
  (`Move.java`: risorsa ≥ costo, assente = 0). La carta resta selezionabile,
  ispezionabile e inviabile; nell'ispezione una riga dice quale risorsa manca.
  Riguarda solo il costo in risorse: bersagli, oggetti e scarti restano al rifiuto.
- **O12 — dimensioni.** In px CSS:

  | Elemento | 1366×768 (C1 → C2a) | 844×390 (C1 → C2a) | FFA cinque (solo geometria) |
  |---|---|---|---|
  | Carta in mano | 164×226 → **214×295**, passo 62% | 94×130 → **120×166**, passo 60% | uguale, passo ridotto fino a stare dopo gli oggetti propri |
  | Personaggio | 112×155 → **150×207** | 56×77 → **80×110** | 117×161 / 60×83 |
  | Oggetto sul tavolo | 81×113 → **114×157** | 44×62 → **61×84** | 89×123 / 46×63, sovrapposti al 25% |

  - Le carte del ventaglio tengono a sinistra tutto ciò che serve: timbro, guadagni
    e costo, la parte che resta scoperta.
  - Una carta si alza intera e un po' ingrandita (×1,12 / ×1,2):
    - **passando il mouse**, senza cambiare l'area attiva, così scorrendo a sinistra
      si raggiunge la carta precedente;
    - **con un tocco**, cioè scegliendola;
    - **con il focus** da tastiera.
  - Scelto il bersaglio, la carta è nell'anteprima al centro e in mano torna al suo
    posto: una legata non copre più la carta vicina da scartare.
  - Gli oggetti sul tavolo si alzano al passaggio del mouse.
  - I titoli lunghi riducono il carattere fino al 75% prima di ricorrere ai puntini.
  - Nel duello gli oggetti propri stanno in alto a destra del personaggio, lasciando
    la fascia bassa al ventaglio. Per la FFA la geometria di `tableLayout` mette gli
    oggetti propri sulla riga del personaggio e fa iniziare il ventaglio dopo di loro.
    I test controllano a entrambi i formati che, con cinque posti e tre oggetti
    ciascuno, nessun posto copra un altro né la mano di sette carte e che tutto
    resti nello schermo. **La FFA non è implementata:** non è provata con una
    partita né guardata.
- **O13, O3, O4 — risorse.**
  - Accanto al proprio personaggio c'è una plancia con cinque righe: simbolo
    vettoriale (cuore, occhio, fulmine, goccia, bottiglia), numero e barra.
  - Il valore iniziale viene dalla carta personaggio del catalogo
    (`collection.characters`). La salute parte con la barra piena; le altre
    risorse partono a metà barra, segnata da una tacca: l'iniziale è un valore
    medio da far crescere con le carte apposite. La barra piena vale almeno 20,
    così si muovono anche le risorse che partono da zero.
  - Oltre l'iniziale compare una seconda striscia chiara; sotto zero un tratteggio
    a sinistra della linea dello zero; oltre il doppio, o sotto il negativo pieno,
    una freccia. Il numero è sempre visibile; R01 non ha tetti né pavimenti.
  - Gli avversari hanno un riquadro con nome, salute e barra, più gli altri
    quattro simboli con il numero.
  - Sulle carte, i guadagni a sé del catalogo sono bollini chiari con ▲ e il
    colore della risorsa (per esempio «▲ +5 A»), distinti dalle monete scure del
    costo.
- **O14 — ruolo.** Timbro sotto il titolo con forma propria e parola: DANNO
  (stella d'impatto), DIFESA (scudo), RISORSE (▲), CONTRASTO (segnale di stop),
  DISTURBO (▼), OGGETTI (due carte), ALTRO (tre punti). Sugli oggetti piccoli c'è
  solo il disco con la forma. La (i) e l'etichetta accessibile riportano ruolo e
  guadagni.
- **Ritocchi emersi dalle prove:**
  - il suggerimento di stato passa nel riquadro di conferma quando quello è
    aperto;
  - la (i) non compare sopra ✓ e ×; a 844×390 li copriva e bloccava la conferma;
  - l'aiuto del menu spiega timbro, bollini, monete e plancia.

### Revisione dopo la prova del proprietario

Prima del commit il proprietario ha provato C2a e ha chiesto cinque ritocchi, tutti
implementati:

1. **Plancia:** tolta la lettera dopo il simbolo nelle risorse proprie.
2. **Barre:** le risorse diverse dalla salute partono a metà barra, con una tacca
   sul valore iniziale. Prima la barra era piena già all'inizio.
3. **Toccare altrove:** un clic o un tocco in un punto vuoto del tavolo, o su
   un elemento che non è un bersaglio ammesso, abbassa le carte e annulla la
   scelta, come Escape. Chiude anche il riepilogo degli stati.
4. **Stati visibili:** stati positivi (▲) e negativi (▼), equipaggiamenti
   (stella), immunità (cerchio barrato con la lettera) e timer (orologio) sono
   gettoni sulla parte bassa della carta personaggio, con la durata o il conto
   alla rovescia. Il riepilogo breve compare passando il mouse, con un tocco o
   con il focus. Con una carta scelta, toccare un gettone vale come toccare quel
   personaggio. Il riepilogo è in italiano per gli stati del set attuale e un
   test confronta i moltiplicatori con R07; per stati nuovi si usa la descrizione
   del server.
5. **Carte più grandi:** su desktop mano 214×295, personaggio 150×207, oggetti
   114×157; a 844×390 mano 120×166, personaggio 80×110. Il mio posto si sposta
   un poco a sinistra. Le prime versioni ai bordi non stavano nella FFA a cinque,
   per cui gettoni sulla carta e posto spostato sono stati scelti di conseguenza.

### Evidenze delle partite reali

Fonti: [verify.json](client-c2/verify.json) (1366×768),
[verify-844x390.json](client-c2/verify-844x390.json), [catture](client-c2/screens/),
[size.json](client-c2/size.json). Comando invariato (`./client-web/run.ps1 -Task Verify`).
Le evidenze di C1 restano in `client-c1/`.

| Controllo | 1366×768 | 844×390 |
|---|---|---|
| Partite fino all'esito, personaggi | 3, Spazienzio e Tossico | 2, Tossico e Spazienzio |
| Criteri C1 ripetuti (legata con scarto, oggetto, drag, tap, riordino, rientro, rifiuto, effetto periodico, O1/O5) | tutti | tutti |
| Turni con controlli C2a / carte controllate | 75 / 450 | 41 / 246 |
| O11: carte non pagabili viste e tutte attenuate | 60 su 60 | 18 su 18 |
| O11: carta attenuata inviata apposta | SPEDIAMOTI DUNQUE IN O-AHIO → rifiuto del server, scelta conservata | Tossicone Scatarrante → rifiuto del server, scelta conservata |
| O11: nessuna carta attenuata accettata dal server | sì | sì |
| O12: misure e alzata al passaggio del mouse | mano 214×295, alzata 295 → 325 di area attiva | mano 120×166, alzata 166 → 184 |
| Clic in un punto vuoto: carta scelta deselezionata e tornata al suo posto | sì | sì |
| Stato: riepilogo con il mouse, con il clic, chiuso cliccando altrove | sì (immunità alla tossicità) | sì (immunità alla tossicità) |
| O13: plancia uguale alle risorse della vista, ogni turno | sì | sì |
| O13/O14: ruolo e guadagni dal server uguali all'allegato, per ogni carta | sì, tutti e 7 i ruoli visti | sì, tutti e 7 |
| Errori pagina, stalli | 0, 0 | 0, 0 |
| Input → frame su PC (p50 / p95) | 11,4 / 14,9 ms | 10,9 / 15,1 ms |

Catture C2a: [tavolo](client-c2/screens/08-c2a-table.jpg),
[alzata al passaggio del mouse](client-c2/screens/08-c2a-hover.jpg),
[carta non pagabile](client-c2/screens/08-c2a-unpayable.jpg),
[riepilogo di uno stato](client-c2/screens/08-c2a-status.jpg) e le stesse con
`-844x390`. Per la legata con scarto a 844×390:
[cattura](client-c2/screens/03-bound-discard-844x390.jpg).

**Peso.** JS 282 KB gzip, totale 968 KB su 1024 (C1: 276 e 963). Nessun nuovo asset:
simboli e timbri sono vettoriali.

**Esecuzioni intermedie.** Prima della build finale due esecuzioni a 844×390 si
sono bloccate e hanno fatto emergere tre difetti, tutti corretti e poi riverificati:

1. la carta alzata dal mouse allargava la sua area attiva sopra la carta precedente;
2. la legata scelta restava alzata e copriva la carta da scartare;
3. la (i) copriva ✓.

Lo script ora tocca le carte della mano sulla parte sinistra scoperta, come
farebbe una persona.

### Limiti e residui

- **Non provato su iPhone** né valutato da persone. Su touch l'alzata avviene
  scegliendo la carta, perché senza mouse non c'è passaggio.
- A 844×390 la parola nel timbro di ruolo è piccola (circa 9 px) e una carta
  oggetto mostra solo i bollini dei guadagni che ci stanno. La parola completa è
  nella (i). Finitura in C4 con O8/O10.
- A 844×390 la riga di riepilogo del turno copre per qualche secondo la parte alta
  dell'avversario e i suoi dorsi; toccarla apre il riepilogo. C'era già in C1; da
  rivedere con C3.
- Le barre degli avversari mostrano solo la salute; le altre risorse avversarie
  hanno simbolo e numero.
- Nelle partite reali il riepilogo è stato provato solo sull'immunità alla
  tossicità, che il Tossico ha dall'inizio. Gli altri tipi di gettone (stati,
  equipaggiamento, timer) sono coperti dai test unitari.
- A 844×390 il riepilogo di uno stato avversario può coprire per un momento il
  riquadro delle sue risorse.
- FFA: solo la geometria è verificata, da test unitari.
- Il valore di riferimento delle barre viene dalla collezione dell'account.
  Se manca, si usa la prima vista vista dal client in quella partita.

Regole ed effetti invariati. Server e catalogo cambiano solo per il campo
descrittivo O14; il client debug solo per la copia delle regole.

## O9 — Illustrazioni provvisorie

27 ottobre 2026. Ogni carta, personaggio e il token hanno un'illustrazione
provvisoria generata ex novo (40 classi), cercata per `bindingName`. Regole,
server, catalogo e `client-debug` invariati; nessun altro cambiamento grafico.
Provenienza, costruzione e scelta di tenere sorgenti e prompt fuori da git in
[o9-art/README.md](../design/client-c2/o9-art/README.md).

### Esito in breve

| Livello | Stato |
|---|---|
| Implementazione | `public/art/atlas.webp` sostituito da un atlante 2048×1536 (8×6 riquadri da 256 px, WebP 76, 566518 byte) con 40 illustrazioni e un segnaposto neutro; `table.webp` invariato. `src/art.ts` sceglie il riquadro per `bindingName` dal manifest, al posto di `artIndex` con 12 riquadri fissi, in `scene.ts` (carte e personaggi) e nell'ispezione (i) di `table.tsx`. Un nome sconosciuto usa il segnaposto. `tools/atlas.mjs` (`run.ps1 -Task Atlas`) costruisce atlante, manifest e inventario. |
| Test automatici | Client 34 test (30 + 4 nuovi in `tests/art.test.ts`: ogni classe dell'allegato ha il suo riquadro, senza duplicati e dentro l'immagine; limiti dell'atlante; segnaposto; fondo dell'ispezione). `Test`, `Build` e `Size` passano. Server, regole e debug non rieseguiti: non toccati. |
| Partite reali su server locale | **Sì.** `Verify` completo contro il server locale (`dev.ps1 -Task Server -SeedAccounts`) e `Serve`, a 1366×768 (2 partite: 1 vittoria, 1 sconfitta) e 844×390 (2 partite: 1 vittoria, 1 sconfitta), con bound, oggetto, drag, tocco, riordino, rifiuto ed effetto periodico. Le evidenze sono quelle dell'ultima esecuzione, dopo l'aggiunta della cattura dell'ispezione; una esecuzione precedente con la stessa verifica era già passata. |
| Emulazione | 844×390 sullo stesso PC, con il mouse. Nessuna emulazione touch. |
| Dispositivo fisico | **Sì, solo O9.** Il proprietario ha provato la build con le illustrazioni su iPhone e ha confermato che va bene (27 ottobre 2026: nessuna misura, nessun dettaglio registrato). |
| Valutazione umana | **Parziale.** Il proprietario ha giudicato adeguate le illustrazioni provvisorie sul telefono. La prova umana B su una partita completa resta separata. |

### Peso (limiti decisi dal proprietario per O9)

| Misura | Limite | Valore |
|---|---|---|
| JS gzip | 500 KB (invariato) | 281851 byte |
| Totale gzip, tutti i file di produzione | 4 MB (prima 1 MB) | 1062954 byte |
| Lato di ogni atlante | 2048 px | 2048×1536 |
| Texture decodificate in tutto | 64 MB | 18876320 byte (atlante 12,6 MB + tavolo 6,3 MB, RGBA, senza mipmap) |

`tools/size.mjs` verifica tutti e quattro i limiti e scrive la misura delle
texture in [size.json](client-c2/size.json); legge le dimensioni dall'intestazione
WebP. Il limite totale di C0 (1 MB) sarebbe superato di poco (1062954 contro
1048576) e non vale più. L'atlante WebP non si comprime ulteriormente con gzip.
La stima del piano (circa 580 KB di atlante, circa 19 MB di texture) è confermata.

### Evidenze

[verify.json](client-c2/verify.json), [verify-844x390.json](client-c2/verify-844x390.json)
e le [catture](client-c2/screens/) sono ora quelle dell'esecuzione O9; quelle di
C2a sono nella cronologia git. `Verify` fotografa anche l'ispezione
([02-inspect-art.jpg](client-c2/screens/02-inspect-art.jpg), con `-844x390`):
cattura nuova, aggiunta a `verify.mjs` senza altre modifiche.

### Limiti e residui

- C2a e O9 **chiuse** dal proprietario dopo la prova su iPhone e desktop e la prova umana B, senza rilievi rilevanti.
- Le illustrazioni sono provvisorie e senza cornice per tipologia (O8, C4).
- Le sorgenti PNG e i prompt letterali non sono tracciati: l'atlante non si
  rigenera da un clone pulito.
- Il segnaposto neutro non è mai comparso in partita: è coperto solo dal test.
- Un solo atlante: il caricamento della scena aspetta tutti i 566 KB.

## C2b-1 — Modalità e code

27 ottobre 2026. Regolamento 1.7, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md)). Nessuna modifica a regole, server,
catalogo o `client-debug`.

### Esito in breve

| Livello | Stato |
|---|---|
| K1 | Corretto in `session.ts`: il `resume` del login si applica una sola volta. Il test che lo riproduceva (due casi) falliva prima della correzione. |
| K2, K3 | `join(modalità)` al posto di `quick()`, `leaveQueue()` con ACK di `/user/queue/session/queue/leave`; tipi `UserGuiDeck` e `Presence` nel contratto (solo tipi). |
| Interfaccia | Nuovo `hub.tsx`: scheda «Gioca», selettore delle modalità (1vCom, 1v1; FFA e open visibili e disattivate), attesa con «Esci dalla coda», errore di ingresso, presenza con ordinamento per colonna e pagine 5/10/20. «Nuova partita» ripete la modalità giocata (D11). Tavolo invariato. |
| Test automatici | Client 46 (34 + 12: K1, 1v1, nuova partita, uscita dalla coda con e senza ACK, annullo prima della conferma, ready più veloce del leave, presenza, ordinamento e pagine). `build.ps1 -Task Test -Offline` (253 server + 36 debug) e `check-rules.py` passano. |
| Partite reali | **Sì.** `VerifyModes` (nuovo, `run.ps1 -Task VerifyModes`) con devAlice e devBob in due contesti Edge, a 1366×768 e 844×390: presenza di B che compare e sparisce con il conteggio; uscita dalla coda con ACK e pulsanti di nuovo attivi; B solo in coda resta in attesa senza partita; stesso `gameId` e 1v1 fino all'esito (10 turni ciascuno a 1366×768); mano propria come array e altrui come numero in tutte le viste (28 per account), nessun nome di carta della sola mano altrui nelle parti non pubbliche; «Nuova partita» rientra in 1v1 con un nuovo `gameId`; abbandono con vittoria dell'altro. `Verify` 1vCom rieseguito a entrambe le misure (2 partite ciascuna): regressione assente. |
| Peso | JS gzip 283323 byte (+1,5 KB rispetto a O9, limite 500 KB); totale gzip 1064763 byte (limite 4 MB). |
| Emulazione / dispositivo / umano | 844×390 sul PC con il mouse; nessun dispositivo fisico né prova umana in questo blocco. |

### Limiti e residui

- **Ingresso rifiutato con partita riprendibile**: dal client l'hub non è
  raggiungibile in quello stato, quindi la verifica reale usa un secondo socket
  STOMP grezzo dello stesso account mentre il client è disconnesso: il server
  risponde su `/user/queue/game/error` («Leave or resume the current game
  first»). Il comportamento dell'hub davanti a quel messaggio (ritorno all'hub,
  nessuno spinner) è coperto solo dal test di sessione con trasporto finto.
- Senza ACK dell'uscita dalla coda il client resta in coda con un errore (non
  torna all'hub), per non perdere una partita che il server potrebbe ancora
  assegnare. Coperto in unità, non provocato sul server reale.
- Dopo un rientro la modalità giocata non è nota: «Nuova partita» la deduce
  (avversario `ComPlayer_` → 1vCom, altrimenti 1v1); in FFA andrà rivista (C2b-3).
- La verifica chiude da sola una partita lasciata da una prova precedente agli
  account sintetici (`resumedLeftoverA/B` nelle evidenze).
- Evidenze: [modes.json](client-c2/modes.json), [modes-844x390.json](client-c2/modes-844x390.json),
  [catture](client-c2/screens/) `modes-*`; `verify*.json` aggiornati.

## C2b-2 — Ciclo di vita in 1v1

28 ottobre 2026. Regolamento 1.7, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md)). Nessuna modifica a regole, server,
catalogo o `client-debug`; nessun cambio di protocollo. Il countdown parte dall'epoch
della vista e l'esito lo decide solo il server.

### Esito in breve

| Livello | Stato |
|---|---|
| K5 | Nuovo `src/lifecycle.ts` (funzioni pure): ragioni d'esito e di forfait tradotte. `move timeout` → «non ha mosso entro 30 secondi», `reconnect timeout` → «non è rientrato entro 30 secondi», `leave` → «ha abbandonato» (in seconda persona per sé); un codice sconosciuto resta leggibile. Pareggio per scadenze simultanee: «Pareggio · Tempo scaduto per tutti». Anche l'ispezione di un avversario dice la ragione del forfait. |
| K6 | Menu ••• → «Esci dall'account» con conferma («Uscire durante la partita è un forfait…»). `logout()` smette di ascoltare la partita prima di `/app/session/logout`, come il leave: nessuna richiesta di vista verso una partita chiusa. Il forfait lo applica il server (`forfeits: {devAlice: "leave"}`). |
| Altro client | Indicatore «*avversario* fuori linea · N s» da `reconnectDeadlines`, sotto il clock. Corretto un difetto trovato nella prova reale: dopo «Torna all'hub» da una partita ripresa restava nell'hub l'avviso «Rientro nella partita in corso» / «Rientro riuscito»; ora l'ACK del leave lo cancella. |
| Test automatici | Client 57 (46 + 11: 7 su `lifecycle.ts`, 4 di sessione: logout in partita, secondo leave, rientro dopo il termine senza sottoscrizioni né SEND e senza avviso residuo, rientro nel termine con pending e una sola richiesta di vista). Scritti prima del codice; i tre che descrivevano comportamenti nuovi fallivano. Nessun atteso esistente cambiato. `build.ps1 -Task Test -Offline` (36/36) e `check-rules.py` passano. |
| Partite reali | **Sì.** Nuovo `VerifyLifecycle` (`run.ps1 -Task VerifyLifecycle`, `tools/verify-lifecycle.mjs`): avvia **da sé** il server su un database temporaneo (D12, giornale di recupero compreso, perché sta accanto al database), con devAlice e devBob in due contesti Edge e attese reali; verde a 1366×768 e 844×390. Esiti dei nove scenari del piano sotto. |
| `Verify` 1vCom | **Verde** a 1366×768 e 844×390 dopo una correzione di `tools/verify.mjs` in un commit separato: prima era rosso anche con i sorgenti di C2b-1 (vedi sotto). |
| Peso | JS gzip 283790 byte (+467 byte rispetto a C2b-1); totale gzip 1065279 byte ([size.json](client-c2/c2b-2/size.json)). |
| Emulazione / dispositivo / umano | 844×390 sul PC con il mouse; nessun dispositivo fisico né prova umana. |

### Scenari reali (entrambe le misure)

1. **Scadenza di mossa.** A invia, B no: esito dopo 30 s (misurati 30 s),
   `outcomeReason: "timeout"`, `forfeits: {devBob: "move timeout"}`, A vince. HEALTH
   di entrambi uguale all'ultima vista prima della scadenza (100/100). Clock di B
   indicativo (17–18 s a metà attesa), quello di A «—» con la mossa in attesa.
2. **Pareggio per scadenze simultanee.** Nessuno invia: `winner: "NONE"`, forfait
   `move timeout` per entrambi; a tutti e due «Pareggio · Tempo scaduto per tutti».
3. **Rientro nel termine.** A invia, «Simula disconnessione», rientra dopo 3 s:
   stessa partita (`resume` `resumed`, stesso `gameId`), stessa pending, **zero**
   SEND di mosse; dopo il rientro solo `resume`, profilo, presenza e una richiesta
   di vista. B intanto vede «devAlice fuori linea · 28 s».
4. **Rientro oltre il termine.** Turno successivo: A invia e cade, B invia; dopo
   31 s fuori A rientra e riceve il proprio forfait (`resume` `finished`,
   `reconnect timeout`, «Non sei rientrato entro 30 secondi»); B vince. Dal
   rientro fino a «Torna all'hub» nessuna SUBSCRIBE né SEND verso quella partita;
   nell'hub nessun avviso residuo.
5. **Abbandono.** ACK, `forfeits: {devAlice: "leave"}`, ritorno all'hub, un solo
   SEND di leave. Un **secondo** leave di devAlice da un socket STOMP grezzo, dopo
   il logout del client, riceve di nuovo `true`, il `resume` successivo dice
   `none` e B non vede un altro esito (una sola coppia vincitore/forfait).
6. **Logout in partita.** Conferma, poi un solo SEND (`/app/session/logout`) e
   ritorno all'accesso; B vince per `leave`. Al login successivo il `resume` è
   `none`: niente da riprendere.
7. **Seconda sessione.** Login di devAlice da un terzo contesto mentre gioca:
   «Credenziali errate, oppure l'account è già collegato altrove.»; la prima
   sessione continua.
8. **Riavvio (D12).** 1v1 in corso con una mossa in attesa, server terminato
   (`taskkill /T /F`) e riavviato sullo stesso database temporaneo. A usa
   «Rientra», B «Esci» e un nuovo login: entrambi ricevono `resume`
   `finished`/`archived` senza `view` e vedono nell'hub «Pareggio — riavvio
   server…»; nei frame dopo la riconnessione nessuna SUBSCRIBE né SEND con il
   vecchio `gameId`.
9. **Regressione vsCom.** Caduta di 33 s contro il computer: forfait
   `reconnect timeout`, «Hai perso».

### Limiti e residui

- **`Verify` 1vCom: era rosso già prima di C2b-2, poi corretto.** Cinque esecuzioni con i sorgenti C2b-2
  (tre a 1366×768, due a 844×390) e due con quelli di HEAD (una per misura)
  falliscono negli stessi punti di `tools/verify.mjs`: a
  1366×768 il trascinamento di riordino non cambia l'ordine (finisce su un oggetto
  e apre l'ispezione), a 844×390 nessuno dei punti candidati per il tocco «nel
  vuoto» è libero. Nelle catture delle esecuzioni fallite il server ha assegnato
  Tossico contro Tossico, quindi sei oggetti sul tavolo
  ([1366×768](client-c2/c2b-2/screens/verify-head-fail-1366x768-reorder.jpg),
  [844×390](client-c2/c2b-2/screens/verify-head-fail-844x390-empty-spot.jpg)).
  **Correzione** (commit separato, solo `tools/verify.mjs`, nessun cambio al client):
  il punto vuoto si cerca su una griglia del tavolo lontana da ogni bersaglio, anche
  per chiudere il riepilogo di uno stato; la carta della mano si preme in un punto che
  nessun oggetto o personaggio copre, sia per il riordino sia per la calata trascinata;
  il rilascio del riordino scende nella parte bassa della carta. Le evidenze annotano
  ora anche il personaggio avversario. Dopo la correzione sei esecuzioni verdi
  (quattro a 844×390, due a 1366×768); una settima si è fermata al login perché il
  server non era ancora pronto. Quelle conservate hanno Tossico contro Tossico
  nella prima partita, dove cadono il tocco nel vuoto e il riordino
  ([verify-1366x768.json](client-c2/c2b-2/verify-1366x768.json),
  [verify-844x390.json](client-c2/c2b-2/verify-844x390.json), catture senza prefisso
  `lifecycle-` nella stessa cartella).
- **Dati locali.** `./scripts/dev.ps1 -Task Server -SeedAccounts` non parte sul
  database locale: «Conflicting recovery sequence» in
  `server/data/bm.sqlite.match-recovery`. I file sono fermi al 27 ottobre alle
  20:27, prima di questa sessione, e non sono stati toccati né riparati; tutte le
  prove di C2b-2 e i `Verify` hanno usato database temporanei.
- Non provati: il clock su un vero cambio di fuso o con una deriva fra gli orologi
  (lo stesso PC fa da client e server); una riconnessione fallita per rete assente
  (la prova la simula chiudendo il socket); dispositivo fisico e prova umana.
- L'indicatore «fuori linea» si basa sull'ultima vista: dopo la caduta di
  un avversario lo aggiorna solo una nuova vista del server, e il conteggio è indicativo come il clock.
- `README.md`, roadmap e checklist P05/P06/P32–P36 non sono aggiornati in questo
  commit, per istruzione del proprietario (solo la riga del piano e questo rapporto). Aggiornati
  con C2b-3.
- Evidenze: [lifecycle.json](client-c2/c2b-2/lifecycle.json),
  [lifecycle-844x390.json](client-c2/c2b-2/lifecycle-844x390.json),
  [catture](client-c2/c2b-2/screens/) `lifecycle-*`.

## C2b-3 — FFA a cinque

28 ottobre 2026. Regolamento 1.7, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md)). Nessuna modifica a regole, server,
catalogo o `client-debug`; nessun cambio di protocollo.

### Esito in breve

| Livello | Stato |
|---|---|
| Coda FFA (P13–P15, P17) | `join('quick/ffa')` sottoscrive il ready e il topic pubblico `/topic/game/quick/ffa/joined` prima del join; la lista (`[{playerId, human}]`, computer in coda tutti `QueuedComPlayer`) segue il topic. Nell'hub: iscritti in ordine d'ingresso con i posti liberi, «Aggiungi computer» (fino a cinque), «Inizia ora» attivo solo con almeno due iscritti e inviato una volta; a cinque la partita parte da sola. L'uscita con ACK chiude anche il topic. |
| K4, D9 | `playerName(id, ids)` in `presence.ts`: un solo computer resta «Computer» (1vCom invariato), più computer diventano «Computer 1–4» nell'ordine della vista; la coda li numera allo stesso modo. ID completo nell'ispezione del personaggio e in Strumenti → Giocatori. |
| K7 | Gli oggetti coperti (in FFA tutti tranne l'ultimo di un posto, `coveredItems`) si alzano al passaggio del mouse, con il focus e **al primo tocco** (`touchRaises`); il secondo tocco li sceglie come bersaglio o li ispeziona. |
| Tavolo a cinque | Geometria `tableLayout` di C2a, con una correzione emersa dai test sui conteggi reali: con sei carte i ventagli laterali uscivano dallo schermo o coprivano i propri oggetti. Ogni posto ha ora uno spazio per il ventaglio (in alto sopra il personaggio; a sinistra sotto la plancia; a destra sopra gli oggetti, mai sul personaggio); il passo si stringe per starci e in FFA la rotazione scende da 0,13 a 0,05 rad per carta (decorazione ridotta, nessuna carta tolta). Il duello resta com'era. In FFA il riepilogo del turno sta su una riga con puntini: su tre righe, a 844×390 copriva gli oggetti dei posti in alto e intercettava il tocco. |
| D11, P36 | Dopo la propria morte la partita prosegue: «Sei fuori dalla partita · Eliminato: puoi guardare fino all’esito», con «Resta a guardare» (dal menu si torna all'hub). Dopo il proprio forfait: esito e ritorno all'hub. In FFA una sconfitta dice chi ha vinto («Vince Computer 3»). «Nuova partita» ripete la FFA; dopo un rientro, una vista con più di due giocatori vale FFA. |
| Correzione trovata nella prova reale | Un tocco che apre un dialogo dal tavolo (ispezione di un oggetto o di un personaggio) era seguito dal suo click di compatibilità, che cadeva sullo sfondo del dialogo e lo richiudeva subito. Ora il click sullo sfondo è ignorato nei primi 500 ms dopo l'apertura. |
| Hub compatto | In coda, a 844×390 «Esci dalla coda» finiva fuori dal foglio. Durante l'attesa spariscono il suggerimento della modalità, «Esci» (già spento in coda) e, in formato compatto, i pulsanti delle modalità (spenti); i pulsanti della coda non vanno a capo. |
| Test automatici | Client 71 (57 + 14): nuovo `tests/ffa.test.ts` (nomi, coda, oggetti coperti, primo tocco, ventagli fino a otto carte dentro lo schermo e lontani da posti e mano a entrambe le misure, vincitore in FFA, propria eliminazione) e 6 test di sessione (coda e topic, computer e avvio, limite di cinque, uscita, nuova partita e rientro, forfait altrui e morte). Scritti prima del codice: fallivano tutto il nuovo file e cinque test di sessione su sei; quello sul forfait altrui passava già e documenta il comportamento esistente. Nessun atteso esistente cambiato. Typecheck pulito. |
| Partite reali | **Sì.** Nuovo `VerifyFfa` (`run.ps1 -Task VerifyFfa`, `tools/verify-ffa.mjs`), che come `VerifyLifecycle` avvia da sé il server su un database temporaneo; devAlice (con tocco emulato) e devBob in due contesti Edge, attese reali. Verde a 1366×768 e 844×390; scenari sotto. |
| Regressione | `Verify` (1vCom), `VerifyModes` e `VerifyLifecycle` verdi a entrambe le misure con la build finale; `Verify` e `VerifyModes` su un server con database temporaneo. `build.ps1 -Task Test -Offline` 36/36, `check-rules.py` passa. |
| Peso | JS gzip 285282 byte (+1492 rispetto a C2b-2); totale gzip 1066917 byte ([size.json](client-c2/c2b-3/size.json)). |
| Emulazione / dispositivo / umano | Due misure sul PC, tocco emulato da Playwright; nessun dispositivo fisico né prova umana. La prova su iPhone a 750×292 spetta al proprietario. |

### Scenari reali (entrambe le misure)

Il server assegna i personaggi a caso: le evidenze registrano quelli di ogni partita
(Spazienzio de la Ucciso e Tossico del Serraglio, in varie combinazioni).

1. **Uscita dalla coda.** A da solo: lista «devAlice (tu)», «Inizia ora» spento.
   Con due computer: «Computer 1», «Computer 2». A esce: ACK, e l'ultima lista vista da A
   è vuota; B entra subito dopo e vede solo sé stesso. Nessuno start inviato con un iscritto.
2. **A + quattro computer.** Avvio automatico al quinto ingresso, nessuno start
   inviato. Lettura della scena a ogni turno (10 turni a 1366×768, 12 a 844×390): cinque
   posti, ordine dei giocatori stabile, quattro ventagli uguali a `cardsInHand` (sempre
   6), oggetti come carte quanti nella vista (fino a 3), nessuna sovrapposizione fra
   posti, ventagli, mano e bordi. Esito di combattimento; «Nuova partita» rientra nella
   coda FFA con A da solo.
3. **A + B + tre computer.** Stesso `gameId`; l'ispezione di un computer mostra
   «Computer 1 · ID ComPlayer_…». Entrambi giocano fino all'esito, con la scena controllata
   a ogni turno. Viste private: 51 per account a 1366×768 e 58 a 844×390, con la propria mano
   come array e le altre quattro come numero, e nessun nome della sola mano altrui fuori
   dalle mosse risolte. A muore (turno 9 e turno 13) e con «Resta a guardare» segue la
   partita fino all'esito (turno 21 e turno 22, pareggio fra gli ultimi).
4. **«Inizia ora» con due iscritti.** Spento con un iscritto, attivo con due; un solo
   start; FFA a due (`devAlice`, `devBob`) fino all'esito.
5. **B abbandona.** A vede il posto di B «forfait» nello stesso turno e continua fino
   all'esito (14 e 16 turni dopo): «devBob ha abbandonato».
6. **B lascia scadere il clock.** B vede «◷ 30 s»; forfait `move timeout` dopo 30 s
   misurati, pannello «Non hai mosso entro 30 secondi», ritorno all'hub; A continua fino
   all'esito.
7. **B cade e rientra dopo il termine.** B invia la mossa e cade; A vede «devBob fuori
   linea · 30 s» e gioca il turno successivo. Dopo 31 s B rientra: `resume` `finished`
   con la vista corrente (turno 2, lo stesso di A), forfait `reconnect timeout`,
   «Non sei rientrato entro 30 secondi». Dopo il rientro solo `resume`, profilo e
   presenza, nessuna SUBSCRIBE né SEND verso la partita. A continua fino all'esito.
8. **Oggetto avversario coperto (K7).** Senza carta scelta: il primo tocco lo alza
   (larghezza 89→102 px a 1366×768, 46→52 px a 844×390), il secondo apre l'ispezione; il
   mouse lo alza al passaggio. Con «BELLO IL TUO GIOCATTOLO SI» (bersaglio FAR_ITEM):
   un clic sull'oggetto alzato dal mouse lo mira; con il tocco, il primo tocco alza senza
   mirare e il secondo mira. Nella passata completa la carta adatta non è capitata in mano:
   la mira è provata in una partita a cinque ripetuta con la build finale
   ([k7/](client-c2/c2b-3/k7/)); nella passata completa è provata l'alzata.

### Limiti e residui

- **Ordine dei computer.** La vista non elenca i giocatori nell'ordine della coda
  (devAlice capita prima, seconda o quarta) e in coda i computer sono indistinguibili:
  «Computer 1–4» segue l'ordine della vista, verificato stabile a ogni turno.
- Una FFA a due avviata con «Inizia ora» e ripresa dopo un rientro viene presa per un
  duello: «Nuova partita» rientra in 1v1 o 1vCom.
- Quando A muore e restano solo computer, il server risolve i turni restanti senza
  attese: l'esito arriva prima che «Resta a guardare» serva. La visione fino all'esito è
  provata quando resta un altro umano (scenario 3).
- Ventagli: nelle partite reali sempre sei carte; uno e otto solo nei test di geometria.
  Al massimo tre oggetti per posto.
- Osservazioni di finitura per **C3/C4**: il riepilogo del turno, anche su una riga,
  copre per 6 s i ventagli dei posti in alto. A 844×390 la carta della mano alzata dal
  focus copre in parte gli oggetti del posto a destra, e il testo della calata (✓/×) si
  sovrappone alla plancia di quel posto
  ([cattura](client-c2/c2b-3/k7/screens/ffa-k7-touch-target-844x390.jpg)). Nel duello
  (anche nella FFA a due) il ventaglio ruotato scende di pochi pixel sul bordo alto del
  personaggio, come in C2a: il controllo dei ventagli vale solo per i tavoli a più di due posti.
- La correzione del dialogo dopo il tocco è provata solo con il tocco emulato.
- Non provati: iPhone a 750×292 (prova del proprietario), dispositivo fisico, prova umana;
  hub a 750×292.
- Dati locali non toccati: tutte le prove su database temporanei. Delle verifiche di
  regressione si conservano i JSON, non le catture (uguali a quelle dei blocchi precedenti).
- Evidenze: [ffa-1366x768.json](client-c2/c2b-3/ffa-1366x768.json),
  [ffa-844x390.json](client-c2/c2b-3/ffa-844x390.json), [k7/](client-c2/c2b-3/k7/),
  [catture](client-c2/c2b-3/screens/) `ffa-*`; regressione `verify-*`, `modes-*`,
  `lifecycle-*` nella stessa cartella.

## C2b-4 — Catalogo, editor mazzi e open 1vCom

28 ottobre 2026. Regolamento **1.8**, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md)). Nessun cambio di protocollo né di
`client-debug` (salvo la copia del regolamento).

**Decisione del proprietario durante il blocco.** R02 chiedeva solo un identificativo
non vuoto, e il debug non pone altri limiti. Però l'avvio open porta il nome nella
destinazione `/app/game/open/1vCom/join/{utente}/{deckId}`: un mazzo «a/b» si salvava,
ma il controllo delle destinazioni rifiutava il suo avvio, quindi non era giocabile.
Alla domanda, il proprietario ha scelto di vietare «/». Il regolamento passa a **1.8**
(R02 e revisioni), il server rifiuta il salvataggio con `Invalid deck`, i test
(`UserAccountServiceImplTest` in unità, `cli-security-test.cjs` nel contesto) lo
provano, e descrizioni SQLite e allegato sono al suffisso 1.8. Tutto questo è in un
commit separato, prima di questo blocco: `Test -Offline` 253 + 36 test e
`TestServerContext` 360 test, verdi. Nessun'altra regola, carta o API cambia.

### Esito in breve

| Livello | Stato |
|---|---|
| Catalogo (P18) | Scheda «Collezione» → «Catalogo»: le 37 carte e i 2 personaggi di `account/data.collection`, in ordine stabile (base, legate, ultima risorsa, azioni regolari, oggetti; poi per nome), con l'illustrazione O9 (`artCss`), tipologia, costo, priorità, ruolo, guadagni, bersaglio e testo. I personaggi mostrano risorse iniziali e capacità degli oggetti. |
| Mazzi (P19, P20, P23, P24) | Elenco ordinato per nome, «Nuovo mazzo», «Modifica» su una copia (nome in sola lettura), «Annulla» senza invio, «Salva», o «Sovrascrivi» se il nome esiste già, e «Cancella» con conferma in riga (D11). Salvataggio e cancellazione sono una richiesta alla volta. Si chiudono con il nuovo `account/data` o con `account/error` (tradotto, l'editor resta aperto). Senza risposta in 5 s, o se la linea cade, compare un errore e nessuno spinner resta acceso. K1 resta chiuso: un `account/data` dopo il salvataggio aggiorna solo il profilo. |
| Editor (P21, P22) | Modulo puro `src/deck.ts`: le regole del debug e di R02, nient'altro. Personaggio, azione base e ultima risorsa obbligatori. Azioni legate ripetibili fino a cinque, con il conteggio delle carte iniziali (base + legate ≤ 6) e «Svuota». Almeno una carta regolare; nome non vuoto e senza «/» (1.8). Nessun limite di copie, nessun 20+2, nessun filtro di compatibilità delle legate. Ricerca come il debug (sottostringa della carta serializzata, quindi anche nel testo e nel `bindingName`). Vista Collezione/Mazzo: la vista Mazzo raggruppa le copie (×n), e un tocco toglie una copia omonima. Ciò che manca è elencato, e «Salva» resta spento finché c'è qualcosa. |
| Open 1vCom (P16) | Modalità «Con un tuo mazzo»: «Gioca» apre il dialogo dei mazzi salvati (nessuno: «Vai alla collezione»), «Annulla» non invia nulla. L'avvio sottoscrive `open/1vCom/ready` e `open/1vCom/error`, poi manda il join con utente e `deckId`. L'errore riporta all'hub con «Mazzo non disponibile sul server». «Nuova partita» ripete open con lo stesso mazzo (D11). Cambiando scheda, il messaggio della scheda precedente sparisce. |
| Test automatici | Client 88 (71 + 17): nuovo `tests/deck.test.ts`, con 10 test su slot, requisiti, «/», legate, copie, ricerca, copia di modifica, ordine e messaggi. In più 7 test di sessione: salvataggio con K1, rifiuto e cancellazione, timeout, caduta, open con il canale d'errore, nuova partita open, pulizia dei messaggi. Nessun atteso esistente cambiato; typecheck pulito. |
| Partite reali | **Sì.** Nuovo `VerifyDecks` (`run.ps1 -Task VerifyDecks`, `tools/verify-decks.mjs`): devAlice in Edge, server avviato da sé su un database temporaneo. Verde a 1366×768 e 844×390; scenari sotto. |
| Regressione | `VerifyDecks`, `Verify` (1vCom) e `VerifyModes` verdi a entrambe le misure con la build finale; `Verify` e `VerifyModes` su un server con database temporaneo. `VerifyLifecycle` e `VerifyFfa` verdi a entrambe le misure con la build che precede le ultime due correzioni (messaggio dell'hub cancellato al cambio scheda, margine nell'editor), che non toccano coda, partita o tavolo. `build.ps1 -Task Test -Offline` (253 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 289023 byte (+3741 rispetto a C2b-3); totale gzip 1071229 byte ([size.json](client-c2/c2b-4/size.json)). |
| Emulazione / dispositivo / umano | Due misure sul PC; nessun dispositivo fisico né prova umana. |

### Scenari reali (entrambe le misure)

1. **Catalogo.** 37 carte e 2 personaggi, 39 in tutto. Classi e nomi sono uguali a
   `docs/rules-catalog.json` (versione 1.8) e ognuna ha l'illustrazione. Nessuno
   scorrimento orizzontale; il foglio scorre in verticale.
2. **Bozze non salvabili.** Una bozza vuota elenca cinque mancanze. Senza regolari
   resta «Metti almeno una carta regolare» (più il nome). Con il nome «a/b» resta solo
   «Il nome non può contenere «/»». «Salva» resta spento e nessun SEND parte verso `/deck`.
3. **Creazione di «Strano».** Spazienzio de la Ucciso, BruiserGrab, Struggle. Tre
   LittleSmack aggiunte («×3»), «Svuota», poi LittleSmack e PatheticBlade: una legata
   del Junkie in un mazzo del Bruiser, senza filtro. In più 4 Glare e 3 ShuffleFeet; la
   ricerca «ShuffleFeet» trova una carta, e nella vista Mazzo una copia viene tolta
   («×4», «×2»). Un solo SEND `/app/user/devAlice/deck`, poi il mazzo arriva in
   `account/data` e nell'elenco.
4. **Riapri e annulla.** Nome in sola lettura. Due SuperImpact aggiunti e legate
   svuotate, poi «Annulla»: zero SEND. Riaperto, il mazzo è quello salvato (3 iniziali,
   6 regolari, le stesse due legate).
5. **Sovrascrittura.** Aggiunte LittleRage e due Glare. Il pulsante dice «Sovrascrivi»,
   parte un SEND e resta un solo mazzo «Strano» (3 legate, 8 regolari).
6. **Open 1vCom fino all'esito.** Dialogo con «Strano»: «Annulla» non invia nulla, poi
   l'avvio manda un solo join `/app/game/open/1vCom/join/devAlice/Strano`. Personaggio
   BigBadBruiser contro un computer, mano iniziale con base e tre legate, mano più mazzo
   uguale a 12 (1 + 3 + 8). La scena è pronta 0,4–0,6 s dopo la richiesta. La partita
   va giocata dalla UI fino all'esito (nella passata finale 5 turni e vittoria a entrambe le misure; nelle passate precedenti anche 7 turni e sconfitta). In tutte le viste ogni carta della mano
   viene dal mazzo salvato.
7. **«Nuova partita».** Riparte con lo stesso join open e lo stesso mazzo; la partita
   viene poi abbandonata dal menu (forfait) e si torna all'hub.
8. **Valido ma strano.** «Sei iniziali»: Tossico del Serraglio, ToxicGrab, Struggle,
   cinque legate (LittleSmack e RottenSmile alternate, sei carte iniziali) e 12 Cough
   tutte uguali. Si salva, e l'open parte con la mano di sei carte iniziali, mazzo 12,
   tutte dal mazzo. Con la mano piena non c'è pesca. Senza una regolare in mano, le
   legate non hanno uno scarto e ToxicGrab non ha un oggetto: nessuna mossa è
   possibile. È il limite noto di R03, non una regola nuova; la partita viene abbandonata.
9. **Deck unavailable.** Provocato riscrivendo il `deckId` del frame di join in uscita
   (`Strano` → `Assente`, Playwright `routeWebSocket`). Il server risponde su
   `open/1vCom/error` con «Deck unavailable. …». Il client torna all'hub con «Mazzo non
   disponibile sul server: scegli un mazzo salvato e riprova.», nessun ready e «Gioca»
   attivo. Passando a «Collezione» il messaggio sparisce.
10. **Cancellazione.** La conferma in riga con «Annulla» non invia nulla. Poi entrambi i
    mazzi vengono cancellati (due SEND `/deck/delete`) ed escono dall'elenco. Il dialogo
    open dice «Nessun mazzo salvato» e «Vai alla collezione» porta alla scheda.

### Limiti e residui

- **`Deck unavailable` non è raggiungibile dalla UI** con un solo account: il dialogo
  elenca solo mazzi salvati, e la sessione è unica. La prova reale altera il frame in
  uscita, quindi mostra la gestione della risposta vera del server, non un percorso da
  utente. Lo stesso messaggio arriva quando l'account ha una partita da riprendere
  (`checkAvailable` lancia `IllegalArgumentException`, gestita dal canale open). Dal
  client quell'hub non è raggiungibile; il messaggio, però, non distingue le due cause.
- Un mazzo con sei carte iniziali si salva e si avvia, ma senza regolari in mano non ha
  mosse (limite di R03, scenario 8). L'editor non lo impedisce, perché R02 lo ammette.
- Dopo un rientro con un nuovo login una partita open vale quick 1vCom per «Nuova
  partita»: la vista non dice da quale mazzo viene.
- Il nome di un mazzo nuovo uguale a uno esistente sovrascrive, come nel debug; il
  pulsante lo dice («Sovrascrivi»), senza una conferma in più. Spazi iniziali o finali
  nel nome sono conservati, come nel debug.
- Gli oggetti vicino al personaggio non sono controllati come «dal mazzo»: ShuffleFeet li
  scambia con l'avversario (in una passata è comparsa una birra del computer), e i token
  nascono da effetti.
- La console del browser registra un 404 per `favicon.ico`, presente anche prima di
  questo blocco.
- Non provati: dispositivo fisico, iPhone a 750×292, prova umana, portrait (ammesso
  fuori dal tavolo per D7, ma non misurato).
- Dati locali non toccati: tutte le prove su database temporanei. Delle verifiche di
  regressione si conservano i JSON, non le catture.
- Evidenze: [decks-1366x768.json](client-c2/c2b-4/decks-1366x768.json),
  [decks-844x390.json](client-c2/c2b-4/decks-844x390.json), [catture](client-c2/c2b-4/screens/)
  `decks-*`; regressione `verify-*`, `modes-*`, `lifecycle-*`, `ffa-*` e
  [size.json](client-c2/c2b-4/size.json) nella stessa cartella.

## C2b-5 — Home, regole e registrazione

28 ottobre 2026. Regolamento **1.8**, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md)), in particolare D4 (registrazione locale:
solo errore esplicito), D7 (portrait fuori dal tavolo), D8 (stessi collegamenti, diritti
corretti) e D10 (regolamento importato). Nessun cambio a regole, server, protocollo,
catalogo o `client-debug`.

**Comportamento osservato prima di scrivere il client** (server reale, profilo `local`,
database temporaneo, richieste dirette e attraverso il proxy di `Serve`):

| Richiesta | Risposta |
|---|---|
| GET `sign-up/users/devAlice/available` | 200 `false` |
| GET `sign-up/users/{nome nuovo}/available`, `sign-up/mail/{email}/available` | 200 `true` (gli account sintetici non hanno email: in locale nessuna email risulta occupata) |
| GET `sign-up/mail/a%2Fb@x.it/available` (o un nome con `/`) | 400 dal contenitore web, pagina HTML |
| POST `sign-up/verify` con nome ed email liberi | **500**, corpo JSON con `message` vuoto; nel log `MailSendException: Email is disabled` |
| POST `sign-up/verify` con devAlice | 409 |
| POST `sign-up/register` con codice errato, con o senza `verify` precedente | 409; il nome resta disponibile, nessuna riga nuova in `USR001_CREDENTIALS` |
| POST `sign-up/register` senza `code` | 500 (non raggiungibile dal modulo, che manda sempre sei cifre) |
| Server spento, attraverso il proxy Vite | 502 |

Il client mappa esattamente questi casi (`failureMessage` in `src/signup.ts`, provata in
unità): 500 su `verify` → «Registrazione non disponibile in questo ambiente: il server non
può inviare il codice per email. Nessun account è stato creato.», senza promettere email né
onboarding; 409 su `register` → codice errato o nome/email già usati; 502 o nessuna
risposta → «Server non raggiungibile».

### Esito in breve

| Livello | Stato |
|---|---|
| Navigazione (P01) | Prima del login l'hash sceglie la schermata: `#/` home, `#/regole`, `#/accedi`, `#/registrati`; ogni altro hash è la home. Nessuna dipendenza di routing nuova; indietro e avanti del browser funzionano. Dopo «Esci» (hub, linea caduta o logout in partita) si torna alla home; un login rifiutato o una sessione chiusa per errore restano sul modulo di accesso con il messaggio. Lasciando l'accesso il vecchio messaggio sparisce. |
| Home (P02) | Presentazione, «Accedi», «Registrati», «Regole»; sezione secondaria con Instagram, YouTube, GitHub (profilo, client web, server), email e PayPal, con gli stessi `href` del debug (in una nuova scheda con `noopener`, l'email no). Diritti come README e CONTRIBUTING: «Tutti i diritti riservati. Non è concessa alcuna licenza open source…»; la frase del debug sull'«Open Source» non è ripresa. Nessuna immagine sponsor. |
| Regole (P03) | `docs/game-rules.md` importato al build con `?raw` (D10): nessuna terza copia, `check-rules.py` e R00 invariati. `src/rules.ts` legge il sottoinsieme usato dal regolamento e produce dati resi come testo React: niente `dangerouslySetInnerHTML`, HTML grezzo come testo, collegamenti ridotti all'etichetta, titoli senza `id` né ancore. Un indice R00–Revisioni scorre alla sezione senza cambiare l'hash; le tabelle larghe scorrono nel proprio riquadro. Le regole si leggono anche a server spento. |
| Registrazione (P07, P08) | Modulo con i controlli del debug: nome alfanumerico, email (regola di Angular), codice di sei cifre, password e conferma. Gli errori compaiono sotto i campi dopo averli toccati; «Invia codice» è attivo con nome ed email validi, «Registrati» con tutto valido. «Invia codice» chiede la disponibilità del nome, poi dell'email, poi `verify`, e si ferma al primo rifiuto. Ogni richiesta finisce entro 10 s; dopo ogni errore il modulo torna attivo e il messaggio viene portato in vista. Un invio riuscito (solo con SMTP) blocca un nuovo invio per 15 s, come il debug. |
| Test automatici | Client 97 (88 + 9): nuovo `tests/public.test.ts` sul regolamento vero (titoli, versione, revisioni, ogni riga e cella delle tabelle, tutte le parole), markup in linea e innocuità di collegamenti e HTML, validatori, mappa delle risposte osservate, sequenza «Invia codice», client REST (percorsi codificati, corpi, stati, timeout, risposta non booleana) e hash. Nessun atteso esistente cambiato; typecheck pulito. |
| Server reale | **Sì.** Nuovo `VerifyPublic` (`run.ps1 -Task VerifyPublic`, `tools/verify-public.mjs`): server avviato da sé su un database temporaneo e fermato per l'ultimo scenario. Verde a 1366×768 e 844×390, più portrait 390×844; scenari sotto. |
| Regressione | `VerifyPublic`, `Verify` (1vCom) e `VerifyModes` verdi a entrambe le misure con la build finale; `Verify` e `VerifyModes` su un server con database temporaneo. `VerifyLifecycle`, `VerifyFfa` e `VerifyDecks` verdi a entrambe le misure con la build che precede l'ultima correzione (il testo del messaggio di codice inviato, raggiungibile solo con SMTP), che non tocca coda, partita o tavolo. `build.ps1 -Task Test -Offline` (253 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 304247 byte (+15224 rispetto a C2b-4, quasi tutto il testo del regolamento); totale gzip 1086878 byte ([size.json](client-c2/c2b-5/size.json)). |
| Emulazione / dispositivo / umano | Due misure landscape e un portrait sul PC; nessun dispositivo fisico né prova umana. |

### Scenari reali (entrambe le misure)

1. **Home.** Sette collegamenti con `href` uguali all'insieme estratto da
   `client-debug/src/app/home/home.component.{ts,html}` (confronto, nessuna apertura),
   ciascuno una volta; testo dei diritti; nessuna immagine né sfondo nel foglio, nessuno
   «sponsor», nessuna affermazione «open source». Nessuno scorrimento orizzontale.
2. **Regole.** Intestazione «Regolamento 1.8» uguale alla versione della fonte. I 21
   titoli, le otto revisioni (1.8…1.1), le sette tabelle con ogni cella (R07: 33 righe;
   R07a: 40) e tutte le 4189 parole sono uguali a `docs/game-rules.md`, markup a parte. Nel
   testo reso zero `a`, zero `id`, zero `script`/`iframe`/`img`. L'indice porta R07a in
   vista lasciando l'hash `#/regole`.
3. **Ritorno.** Indietro del browser → home, avanti → regole, «← Home» → `#/`.
4. **Accesso.** Home → «Accedi» (`#/accedi`) → devAlice → hub «Ciao, devAlice» → «Esci» →
   home. Con la password errata resta su `#/accedi` con «Credenziali errate…».
5. **Moduli non validi.** All'apertura «Invia codice» e «Registrati» sono spenti; «a b» e
   «non-una-email» mostrano i due errori e lasciano spento l'invio.
6. **Nome occupato.** devAlice: una sola richiesta (`users/devAlice/available` 200),
   nessun `verify`, «Questo nome è già usato: scegline un altro.», modulo attivo.
7. **Invio del codice nel profilo locale.** Nome nuovo, libero prima della prova: tre
   richieste, `users/…/available` 200, `mail/…/available` 200, `verify` 500; messaggio di
   indisponibilità come `alert`, in vista nel foglio, campi e «Invia codice» di nuovo attivi.
8. **Codice errato.** Con la conferma diversa: «Le due password non coincidono.» e
   «Registrati» spento. Poi `register` 409 e messaggio di rifiuto. Dopo la prova il nome
   risulta ancora disponibile e il suo login è falso: **nessun account creato**.
9. **Server spento.** «Invia codice»: un `available` con 502, «Server non raggiungibile.
   Riprova tra poco.» in meno di 0,1 s, modulo attivo. Login: stesso messaggio, pulsante
   attivo. Le regole si aprono comunque.
10. **Portrait 390×844 (D7).** Home, regole, registrazione e accesso senza scorrimento
    orizzontale, foglio dentro lo schermo, nessuna richiesta di rotazione; la home ha gli
    stessi collegamenti e diritti.

### Limiti e residui

- **Percorso positivo della registrazione non provato** (D4): senza SMTP il server non
  invia il codice. Messaggio di invio riuscito, blocco di 15 s e «Account creato» sono
  provati solo in unità; serve un ambiente SMTP del proprietario.
- **Email occupata** non provata sul server: gli account sintetici non hanno email, quindi
  `mail/…/available` risponde sempre `true` in locale. Il messaggio è provato in unità.
- **Osservazione sul server, fuori perimetro:** `sendVerificationEmail` salva il codice in
  memoria *prima* di tentare l'invio, e il codice resta valido dopo il 500. In un profilo
  senza SMTP chi indovina le sei cifre potrebbe completare la registrazione, e il server non
  limita i tentativi di `register`. Il client non lo sfrutta e non lo cambia: va valutato
  dal proprietario (nessuna modifica a server o regole in questo blocco).
- Un'email con «/» è valida per la regola di Angular e per il client, ma il contenitore web
  risponde 400 a `mail/…/available`: il client mostra «Il server non accetta questo valore»
  (il debug dava un errore generico). Provato in unità, non sulla UI.
- I collegamenti esterni non sono stati aperti, come da piano: destinazione confrontata,
  raggiungibilità non verificata.
- **Cambi alle verifiche esistenti.** La pagina parte dalla home, quindi `Verify`,
  `VerifyModes`, `VerifyLifecycle`, `VerifyFfa` e `VerifyDecks` entrano da `#/accedi` e, dopo
  «Esci», aspettano la home invece del modulo di accesso. In più `VerifyModes` a 844×390 è
  fallito due volte sul controllo di riservatezza con un falso positivo: il nome segnalato
  era nella **mano propria** di chi guardava (`players.<sé>.cardsInHand` della vista finale),
  pescato all'ultimo turno e quindi mai registrato dal ciclo della UI, che raccoglie la mano
  solo nei turni giocati. Il controllo ora esclude la mano propria dal testo cercato
  (resta verificato che sia un array e che quella altrui sia un numero). Nessun altro
  atteso cambiato.
- La console registra le risposte 500, 409 e 502 provocate apposta e il 404 di
  `favicon.ico` già noto.
- Non provati: dispositivo fisico, iPhone, prova umana, lettore di schermo.
- Dati locali non toccati: tutte le prove su database temporanei.
- Evidenze: [public-1366x768.json](client-c2/c2b-5/public-1366x768.json),
  [public-844x390.json](client-c2/c2b-5/public-844x390.json), [catture](client-c2/c2b-5/screens/)
  `public-*` (portrait `*-390x844`); regressione `verify-*`, `modes-*`, `lifecycle-*`,
  `ffa-*`, `decks-*` e [size.json](client-c2/c2b-5/size.json) nella stessa cartella.

## C2b-6 — Profilo, amministrazione, log client e diagnostica

28 ottobre 2026. Regolamento **1.8**, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md)), in particolare D5 (admin provato in un
ambiente temporaneo), D6 (credenziali Basic al solo browser) e D14 (solo errori, senza
nomi utente né credenziali). Nessun cambio a regole, server, protocollo, catalogo o
`client-debug`.

**Comportamento osservato prima di scrivere il client** (server reale, profilo `local`,
database temporaneo, richieste dirette e attraverso il proxy di `Serve`):

| Richiesta | Risposta |
|---|---|
| GET `logs/back/games/qty`, `logs/client/web/qty`, `…/open`, `…/drain` senza credenziali | 401 con `WWW-Authenticate: Basic realm="Realm"` (anche i conteggi: la regola `/rest/v1/logs/**` vuole ADMIN) |
| Stesse richieste con Basic errato, o con Basic qualsiasi se il server non lo ha configurato | 401 |
| Con Basic configurato da `HTTP_AUTH_USERNAME` e `HTTP_AUTH_PASSWORD` (hash BCrypt) | 200: numero, lista JSON, `application/octet-stream` con un array JSON; `DELETE …/delete` → `true` |
| POST `logs/client/web/` con `{timestamp,message,additional}` | 200 senza corpo, riga salvata (`log.db: Y`); `C_TIMESTAMP` è chiave primaria |
| POST senza la barra finale | 401 (è pubblico solo il percorso con la barra) |
| Partite quick e open | **mai in `LOG001_GAMES`**: `GameLoggingServiceImpl` le manda solo all'archivio LOG003. Con le modalità del client il conteggio delle partite resta 0 |
| Una richiesta qualsiasi con un header Basic errato, anche `sign-in/validate` | 401 (filtro Basic di Spring); il browser memorizza le credenziali solo dopo un successo |
| Edge, `fetch` verso `/rest/logs/…` attraverso il proxy Vite | la richiesta resta in attesa e compare la finestra nativa «Esegui l'accesso per accedere a questo sito»; Edge headless senza credenziali tiene la sfida aperta |

Il prompt nativo compare, quindi nessun ripiego: il client non gestisce password
amministrative.

### Esito in breve

| Livello | Stato |
|---|---|
| Profilo (P09) | Scheda «Profilo» nell'hub: nome, email (o «—»), ruolo da `account/data`, come il debug; nulla da modificare, nessun recupero password. |
| Amministrazione (P40–P43) | Solo per il ruolo `ADMIN` del profilo STOMP, come il debug. Conteggi letti uno dopo l'altro (il browser chiede una volta sola), partite non concluse in una tabella del pannello, download dei due log come file JSON (letti e controllati prima di salvarli), cancellazione con conferma in linea e conteggi riletti. Un'operazione alla volta. Il client non manda mai `Authorization`: la sfida Basic la risolve il browser (D6). 401/403 → «Non autorizzato in questo ambiente: servono le credenziali HTTP del server, che chiede il browser. Nessuna operazione eseguita.»; anche un 200 di forma inattesa (non numero, non lista, non `true`, JSON illeggibile) è un errore. Attesa massima 120 s, perché la finestra del browser è tempo umano. |
| Segnalazione errori (P44) | `src/report.ts`: `error` e `unhandledrejection` → POST `/rest/logs/client/web/` con `{timestamp, message, additional: ["client-web"]}`. Un invio alla volta: gli errori durante un invio sono scartati, non accodati; timeout 5 s; al massimo dieci invii per caricamento; nessuna segnalazione sull'invio fallito e nessun errore dal gestore stesso. Il messaggio è nome e testo dell'errore, tagliato alla prima `{` o `[`, senza valori fra virgolette, con nome utente e password sostituiti da `***`; un valore che non è un `Error` non viene serializzato (potrebbe essere una vista). Il corpo vuoto della risposta viene letto, altrimenti il browser registra la richiesta come interrotta. |
| Diagnostica (P38, P39) | Strumenti del menu invariati, riprovati in 1v1 e FFA con due umani. |
| Test automatici | Client 104 (97 + 7): nuovo `tests/report.test.ts` (testo ripulito, limitatore con timer finti, timeout, invio fallito senza nuovo invio, limite di dieci, ascoltatori senza ciclo, client admin con percorsi, nessun `Authorization`, risposte attese e inattese, 401/403, timeout, messaggi). Nessun atteso esistente cambiato; typecheck pulito. |
| Server reale | **Sì.** Nuovo `VerifyProfile` (`run.ps1 -Task VerifyProfile`, `tools/verify-profile.mjs`): ambiente di prova D5 su database temporaneo, server avviato tre volte (seme, ADMIN senza Basic, ADMIN con Basic). Verde a 1366×768 (con il prompt nativo di Edge) e a 844×390; scenari sotto. |
| Regressione | Sulla build finale (stesso hash del bundle prima e dopo l'ultima build): `Verify` e `VerifyModes` (server con database temporaneo), `VerifyLifecycle`, `VerifyFfa`, `VerifyDecks` e `VerifyPublic` verdi a 1366×768 e 844×390. `build.ps1 -Task Test -Offline` (253 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 306939 byte (+2692 rispetto a C2b-5); totale gzip 1089730 byte ([size.json](client-c2/c2b-6/size.json)). |
| Emulazione / dispositivo / umano | Due misure landscape sul PC e una finestra Edge visibile per il prompt; nessun dispositivo fisico né prova umana. |

### Ambiente di prova (D5)

`VerifyProfile` avvia il server con `--app.dev.seed-accounts=true` su un database
temporaneo e lo ferma; poi, a server spento, aggiunge l'account sintetico `c2b6Admin`
(ruolo `ADMIN`, email `c2b6-admin@example.invalid`, stesso hash di devAlice) e tre righe
sintetiche in `LOG001_GAMES` (STARTED, IN_PROGRESS, ENDED: le partite reali non ci
arrivano). Il secondo avvio è senza Basic; il terzo con `HTTP_AUTH_USERNAME=c2b6basic` e
`HTTP_AUTH_PASSWORD` uguale all'hash BCrypt di una password casuale generata per
l'esecuzione con l'encoder del server (`spring-security-core` estratto dal jar). La
password non è scritta nelle evidenze. Nessun file di `scripts/` o del server cambia; i
DELETE toccano solo il database temporaneo, cancellato alla fine.

### Scenari reali (entrambe le misure)

1. **Basic non configurato.** `c2b6Admin` vede profilo e pannello; con credenziali offerte
   dal browser il conteggio risponde 401: messaggio di non autorizzazione, conteggi «—»,
   «Cancella» spento, «Riprova» visibile, nessun DELETE.
2. **Profilo USER.** devAlice: nome, «—», `USER`, nessun pannello e nessuna richiesta ai
   log; nessuno scorrimento orizzontale.
3. **Errori provocati.** Un errore non gestito con nome e password nel testo, un rifiuto non
   gestito e un errore di `JSON.parse` su un frammento di vista: tre POST, 200, tre righe
   in più sul server con lo stesso testo. Messaggi: «Error: c2b6-synthetic uncaught for
   \*\*\* with \*\*\*», «Error: c2b6-synthetic rejection», «SyntaxError: Unexpected token "…",
   ..."…":…». Nessuna password, nome utente, `gameId`, mano o nome di carta.
4. **Ingestione irraggiungibile.** Rifiutata: tre errori nello stesso momento → un solo
   tentativo. Bloccata: il POST viene interrotto dopo circa 5 s (5003–5014 ms nelle esecuzioni), un errore
   arrivato durante l'attesa non parte, il successivo sì (uno solo). In 2 s di attesa
   finale nessun invio spontaneo.
5. **Strumenti in 1v1.** devAlice e devBob in coda 1v1. Al primo turno e dopo un turno
   risolto, da entrambi i lati, Log State, Log Item, Log JSON, messaggi ricevuti e giocatori
   non contengono nessun nome della sola mano altrui (carte giocate e scarti delle azioni
   legate esclusi, perché pubblici); nelle viste la mano propria è un array e quella altrui
   un numero. Log Card è spento senza carta scelta e, con una carta scelta, mostra quella
   carta della propria mano.
6. **Strumenti in FFA.** devAlice, devBob e un computer, «Inizia ora»: stesso controllo dal
   lato di A, tutte le mani altrui solo come numero.
7. **Credenziali errate.** `c2b6Admin` con Basic sbagliato: 401 su conteggi e download,
   messaggio di non autorizzazione, nessun messaggio di successo, «Cancella» spento.
8. **Conteggi.** Con Basic giusto: 3 partite e le righe del log client, uguali alle
   risposte dirette del server.
9. **Partite non concluse.** Tabella con `c2b6-synthetic-1` (STARTED) e
   `c2b6-synthetic-2` (IN_PROGRESS), uguale a `open`; la ENDED non compare.
10. **Download.** `bm-log-partite-….json` e `bm-log-client-….json` letti come JSON: tre
    partite sintetiche e le segnalazioni dello scenario 3; conteggi invariati (drain non
    cancella).
11. **Cancellazione.** «Cancella» → «Cancellare dal database tutti i record (3)? Non si
    può annullare.» → «Annulla»: nessun DELETE. Poi conferma: un DELETE per log (200),
    conteggi riletti a 0, «… log cancellati.»; le righe dell'archivio LOG003 restano le
    stesse.
12. **Prompt nativo su Edge** (solo 1366×768, `BM_NATIVE_PROMPT=1`, finestra visibile):
    con il pannello aperto la richiesta resta in attesa e Edge mostra la propria finestra
    di accesso ([cattura](client-c2/c2b-6/screens/profile-10-native-prompt-edge.png)); Esc
    → 401 e messaggio di non autorizzazione; «Riprova» → la finestra torna
    ([cattura](client-c2/c2b-6/screens/profile-11-native-prompt-retry-edge.png)), nome e
    password digitati da tastiera (SendKeys) → conteggi
    ([cattura](client-c2/c2b-6/screens/profile-12-native-prompt-answered-edge.png)).

### Limiti e residui

- **Prompt nativo provato solo su Edge per Windows** e solo in questo ambiente: la
  digitazione è simulata con SendKeys sulla finestra portata in primo piano. Altri browser,
  telefoni e un ambiente pubblico con TLS non sono provati. Negli scenari headless il
  browser risponde alla sfida con le credenziali del contesto Playwright, come farebbe la
  finestra nativa; Edge headless senza credenziali tiene la sfida aperta, per questo il
  caso «annullato» headless è sostituito da credenziali errate. Due esecuzioni su
  quattro hanno perso un tasto (la prima volta la digitazione è partita prima che la
  finestra tornasse, l'altra l'Invio è arrivato a finestra non più in primo piano): ora la
  prova aspetta 2 s, cattura la finestra, digita e manda l'Invio a parte, ripetendolo una
  volta se i conteggi non arrivano. È fragilità dell'automazione da tastiera, non del client.
- **Partite registrate**: con le modalità raggiungibili dal client (quick e open) il server
  non scrive mai `LOG001_GAMES`; conteggio, elenco e download delle partite sono provati
  su righe sintetiche. È un comportamento del server, fuori perimetro.
- **403** non è raggiungibile: l'unico utente Basic è ADMIN. Il messaggio è provato in
  unità.
- Il limite di dieci invii per caricamento è in più rispetto al debug (che non ne ha),
  per non inondare il log se un errore si ripete a ogni fotogramma.
- **Osservazione sul server, fuori perimetro:** l'ingestione dei log client è pubblica e
  senza limiti (il controller ha «TODO authenticate this!!!»); chiunque raggiunga il server
  può riempire `LOG002_WEB_CLIENT`, e due righe con lo stesso timestamp collidono sulla
  chiave primaria.
- Il controllo della mano altrui negli strumenti cerca i nomi presenti **solo** nella mano
  dell'altro giocatore. In una prova precedente aveva segnalato «Grab», scartata da B con
  un'azione legata (scelta pubblica della mossa risolta) mentre anche A ne aveva una: falso
  positivo, ora escluso insieme alle carte giocate.
- Dispositivo fisico, iPhone, prova umana e lettore di schermo non provati.
- Dati locali non toccati: tutte le prove su database temporanei.
- Evidenze: [profile-1366x768.json](client-c2/c2b-6/profile-1366x768.json),
  [profile-844x390.json](client-c2/c2b-6/profile-844x390.json), [catture](client-c2/c2b-6/screens/)
  `profile-*` (prompt nativo `profile-10…12-*-edge.png`); regressione `verify-*`, `modes-*`,
  `lifecycle-*`, `ffa-*`, `decks-*`, `public-*` e [size.json](client-c2/c2b-6/size.json)
  nella stessa cartella.

## C2b-7 — Checklist di parità e prova umana B

29 ottobre 2026. Regolamento **1.8**, decisioni D1–D14 del piano
([client-c2b-plan.md](../client-c2b-plan.md#c2b-7--checklist-di-parità-e-prova-umana-b)),
in particolare D3 (cinque account sintetici locali, commit `30b8855`) e D13 (prova B
completa). La parte automatica è nel commit `4cab6ba`; la prova umana B è stata fatta lo stesso giorno
([sotto](#prova-umana-b)). **C2 è chiusa** dal proprietario il 29 ottobre 2026.

### Esito in breve

| Livello | Stato |
|---|---|
| Correzione emersa | **Il tavolo poteva scorrere di 14 px.** Prima esecuzione consolidata: `Verify` a 1366×768 è fallito (riepilogo di uno stato non aperto dal mouse), e di nuovo su un server temporaneo nuovo. Diagnosi: i pulsanti semantici delle carte della mano (lo strato accessibile sopra il canvas) escono dal bordo basso dello schermo (fino a y 782 su 768). Il documento diventava alto 782 px, e mettere a fuoco una di quelle carte (Tab, oppure il ritorno del fuoco dopo un'ispezione) faceva scorrere la pagina di 14 px. Il gioco restava coerente, perché `point()` usa `getBoundingClientRect`, ma il tavolo saliva lasciando una banda scura in basso. La verifica, che clicca in coordinate dello schermo, mancava il gettone. Correzione in `src/style.css`: `overflow: clip` sullo strato semantico. Dopo la correzione documento 768 px, scorrimento 0. `Verify` ha un controllo nuovo e deterministico (`checks.noScroll`). Il difetto c'era almeno da C2a (carte più grandi), non da D3. |
| Verifiche sulla stessa build | **Tutte verdi** dopo la correzione, sulla build finale (hash di `dist` uguale prima e dopo la serie): `Verify` e `VerifyModes` su un server con database temporaneo avviato per la serie, `VerifyLifecycle`, `VerifyFfa`, `VerifyDecks`, `VerifyPublic` e `VerifyProfile` ciascuno sul proprio server temporaneo, a 1366×768 e 844×390 (14 esecuzioni, zero errori pagina); `Size`; `client-web` `Test` 104/104 (nessun test nuovo: la correzione è CSS e la copre `Verify`); `build.ps1 -Task Test -Offline` 253 server + 36 debug, verdi; `check-rules.py` passa. Contesto Spring non rieseguito: server invariato in questo blocco. Nessuna partita lasciata da prove precedenti (`resumedLeftover*` assenti). |
| Peso | JS gzip 306934 byte (−5 rispetto a C2b-6), totale gzip 1089729 byte, texture 18876320 byte ([size.json](client-c2/c2b-7/size.json)). |
| Checklist P01–P44 | Tutte con evidenza. Le voci ancora aperte (P04, P10, P11, P12, P27–P31, P37) citano le evidenze di questo blocco e dei precedenti; i limiti della base o dell'ambiente sono scritti nella riga ([checklist](../client-c0-parity.md)). Per P37 `VerifyDecks` controlla ora, nella partita reale senza mosse, che il menu spieghi il limite R03 (`sixInitialPlayed.menuExplainsR03`). |
| Prova umana B | **Fatta** il 29 ottobre 2026 dal proprietario ([sezione](#prova-umana-b), [scheda compilata](client-c2/c2b-7/prova-b-scheda.md)): nessun blocco. |
| Giudizio del proprietario | **C2 chiusa** (29 ottobre 2026); O15 con il nuovo deckbuilder (O16). |
| Emulazione / dispositivo / umano | Due misure landscape sul PC, tocco emulato in `VerifyFfa`; nessun dispositivo fisico né prova umana. |

### Esecuzione consolidata (stessa build, entrambe le misure)

| Verifica | 1366×768 | 844×390 |
|---|---|---|
| `Verify` (quick 1vCom, C1+C2a) | 2 partite (pareggio, vittoria), entrambi i personaggi; 20 rifiuti reali con scelta conservata; effetto periodico letto; legata con scarto, oggetto, drag, tocco, riordino, rientro senza SEND; 32 turni con controlli C2a; nessuno scorrimento (`noScroll`: 768/768); input p95 14,8 ms su PC | 4 partite (2 vittorie, 2 sconfitte), entrambi i personaggi; 14 rifiuti; stessi controlli; 53 turni C2a; `noScroll` 390/390; p95 14,7 ms |
| `VerifyModes` (1v1, code, presenza) | stesso `gameId`, vittoria/sconfitta in 11 turni, viste private corrette, «Nuova partita» in 1v1, ingresso rifiutato con partita riprendibile, presenza | idem, 12 turni |
| `VerifyLifecycle` | nove scenari di C2b-2: scadenza di mossa in 30 s, pareggio per scadenze simultanee, rientro nel termine con pending e zero SEND di mosse, rientro tardivo, abbandono idempotente, logout in partita, seconda sessione rifiutata, riavvio con ricevuta senza vista, vsCom | idem |
| `VerifyFfa` | sette scenari di C2b-3; cinque posti controllati a ogni turno; mira sull'oggetto coperto provata con mouse **e** tocco nella passata completa | idem, mouse e tocco |
| `VerifyDecks` | dieci scenari di C2b-4 e, nuovo, menu R03 nella partita senza mosse | idem |
| `VerifyPublic` | undici scenari di C2b-5, portrait 390×844 compreso | idem |
| `VerifyProfile` | tredici scenari di C2b-6 (headless) | idem |

Controllo a campione: JSON letti uno per uno (`ok`, errori, chiavi citate dalla checklist), catture del
riepilogo di uno stato, del menu R03 e degli esiti FFA guardate; differenze rispetto alle evidenze dei
blocchi precedenti: ID di partita, carte casuali, tempi.

### Limiti e residui

- **Prompt Basic nativo non ripetuto**: `VerifyProfile` è stato eseguito headless; la prova con la
  finestra di Edge e la digitazione da tastiera (`BM_NATIVE_PROMPT=1`) prende il primo piano del desktop
  e resta quella di C2b-6 ([catture](client-c2/c2b-6/screens/)), su un client che da allora cambia solo
  per il ritaglio dello strato semantico.
- **La correzione dello scorrimento** è provata a 1366×768 e 844×390 su Edge, con il fuoco messo da
  programma su una carta che esce dal bordo; non su iPhone né con la tastiera di una persona. Il
  difetto era intermittente in `Verify` (3 esecuzioni fallite su 15 fra serie e diagnosi, tutte con il gettone di uno stato del proprio
  personaggio); il nuovo controllo è invece deterministico.
- **Database locale non toccato**: tutte le prove su database temporanei. Lo stato di
  `server/data/bm.sqlite` («Conflicting recovery sequence» in C2b-2) non è stato riprovato; la scheda
  propone un database dedicato per la prova B.
- Il menu del tavolo a 844×390 richiede di scorrere il dialogo per vedere la spiegazione R03 e
  «Abbandona» ([cattura](client-c2/c2b-7/screens/decks-08b-six-initial-menu-844x390.jpg)); finitura C4.
- Restano validi i limiti dei blocchi C2b-1…C2b-6 (registrazione positiva senza SMTP, `Deck unavailable`
  provocato riscrivendo il frame, 403 admin solo in unità, pagine della presenza solo in unità).
- Non provati: dispositivo fisico, iPhone a 750×292, lettore di schermo.
- Evidenze: [c2b-7/](client-c2/c2b-7/) — `verify-*`, `modes-*`, `lifecycle-*`, `ffa-*`, `decks-*`,
  `public-*`, `profile-*` alle due misure, [size.json](client-c2/c2b-7/size.json), catture in `screens/`.

### Prova umana B

29 ottobre 2026, condotta dal proprietario con la [scheda](client-c2/c2b-7/prova-b-scheda.md), sulla
build di C2b-7 servita con `Physical` (indirizzo Ethernet del PC) e il server con `-SeedAccounts` su un
database dedicato. Dal log del server: almeno devAlice, devBob e devCarol nella stessa FFA con due
computer; oltre al PC è entrato in rete locale un secondo dispositivo. Esito riferito per scenario:

| Scenario | Esito |
|---|---|
| S1 duello | Niente da segnalare. |
| S2 FFA con computer (forfait altrui) | Niente da segnalare. |
| S3 mazzo salvato | Una incomprensione: non si capisce bene cosa è nel mazzo e cosa no, manca un riepilogo del mazzo corrente (**O15**). Tre proposte: un deckbuilder più funzionale della struttura del debug (**O16**); il mazzo costruito con la collezione posseduta dall'utente (**O17**); la scelta del mazzo in ogni modalità, con uno starter selezionabile per ogni personaggio o un mazzo proprio (**O18**). |
| S4 telefono | Niente da segnalare. |

Nessun blocco: attesa, mossa accettata, proprio esito e forfait altrui in FFA sono stati riconosciuti.
O15 e O16 riguardano solo il client; O17 e O18 cambiano R00/R02, server e code, quindi non si toccano
senza passare dal regolamento (AGENTS.md). Assegnazione nella
[roadmap](../client-roadmap.md#osservazioni-della-prova-umana-b-c2b-7).

**Giudizio del proprietario (29 ottobre 2026):** C2 è chiusa. O15 non si corregge in C2 e va con il
nuovo deckbuilder (O16).

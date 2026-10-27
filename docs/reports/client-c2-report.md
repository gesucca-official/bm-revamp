# Rapporto C2 — Parità del client debug

27 ottobre 2026. Regolamento **1.7**. C2 è avviata su istruzione esplicita del
proprietario a partire dal primo blocco, C2a «leggibilità di base», con il piano
confermato. C2b (1v1, FFA, code, open, editor e il resto della parità) è in corso a
blocchi: **C2b-1 (modalità e code) è fatto**, gli altri no ([sezione](#c2b-1--modalità-e-code)). Dopo C2a è fatta e chiusa O9, le illustrazioni provvisorie
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
| Test automatici | Client 46 (34 + 12: K1, 1v1, nuova partita, uscita dalla coda con e senza ACK, annullo prima della conferma, ready più veloce del leave, presenza, ordinamento e pagine). `build.ps1 -Task Test -Offline` e `check-rules.py` passano. |
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

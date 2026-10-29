# Rapporto C3 — Rendere leggibile e soddisfacente la risoluzione

29 ottobre 2026. Regolamento **1.8**. C3 procede a blocchi secondo il
[piano C3](../client-c3-plan.md), con le decisioni D1–D11 confermate dal proprietario.
**C3-1 (modello puro della risoluzione e strumento di verifica) è fatto**
([sezione](#c3-1--modello-puro-della-risoluzione-e-strumento-di-verifica)). Gli altri
blocchi non sono iniziati.

## C3-1 — Modello puro della risoluzione e strumento di verifica

29 ottobre 2026. Decisioni D1 (solo dati certi), D4 (nessuna differenza dopo un salto)
e D8 (mazzi sintetici e viste registrate) del piano. Nessun cambio a regole, server,
protocollo, catalogo o `client-debug`; **la scena non cambia comportamento** (K1 si
corregge in C3-2).

### Esito in breve

| Livello | Stato |
|---|---|
| Modello (`src/resolution.ts`) | Funzione pura `resolve(precedente, nuova, io, catalogo)`. **Relazione** fra le viste: `next` (turno successivo, stessa partita), `same`, `jump`, `other-game`, `older`, `first`; solo `next` è contigua. **Mosse** nell'ordine di `resolvedMoves`: autore, carta, bersaglio (`SELF` risolto nell'autore), oggetto scelto con il posto su cui è stato scelto, scarto, `void`, costo **nominale** dal catalogo per nome (`null` se il nome non è noto). **Solo per un round contiguo, per posto:** prima, dopo e variazione di ogni risorsa presente in una delle due viste, oggetti spariti e comparsi per nome con molteplicità, mano e mazzo prima e dopo, morte, nuovo forfait; per il proprio posto le carte uscite ed entrate in mano per nome. **Fine turno:** i giocatori con righe non vuote, mai il loro contenuto. **Esito:** `over`, `winner`, `outcomeReason`. |
| Collegamento oggetto–mossa | Solo se la `TARGET_ITEM` di una mossa **non annullata** nomina l'oggetto sul posto da cui è sparito e le sparizioni di quel nome su quel posto bastano per tutte le mosse che lo nominano; altrimenti nessun collegamento. Il fatto aggiuntivo «stesso nome comparso presso l'autore» è una coincidenza registrata, non un'attribuzione. |
| D1 | Nessuna lettura di `moveReport` né del testo di `timeBasedEffects`; nessun effetto calcolato. Verificato in unità e su ogni round reale: sostituendo tutte le frasi del server i fatti sono identici. |
| Esposizione | `src/table.tsx` calcola i fatti a ogni vista ricevuta (`view` e `reset`) e li espone solo in `window.__bm.resolutions` (ultime 400, con i contatori della scena letti dopo tutti gli ascoltatori) e `__bm.state.resolution`. La scena non li legge. |
| Test automatici | Client **123** (104 + 19): nuovo `tests/resolution.test.ts` su **viste reali** registrate dal server (`tests/resolution-views.json`, 11 coppie). Nessun atteso esistente cambiato; typecheck pulito. |
| Server reale | **Sì.** Nuovo `VerifyResolution` (`run.ps1 -Task VerifyResolution`, `tools/verify-resolution.mjs`), server avviato dallo strumento su database temporaneo. Verde a 1366×768 e 844×390; scenari sotto. |
| Regressione | Sulla build finale: `Verify` (quick 1vCom, server su database temporaneo) verde a 1366×768 e 844×390. Le altre verifiche non sono state ripetute: il blocco non tocca i loro percorsi (solo l'esposizione in `__bm` e un modulo nuovo non usato dalla scena). `build.ps1 -Task Test -Offline` (253 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 308045 byte (+1106 rispetto a C2b-6); totale gzip 1090840 byte ([size.json](client-c3/c3-1/size.json)). |
| Emulazione / dispositivo / umano | Due misure landscape sul PC (Edge via Playwright); nessun dispositivo fisico né prova umana, non richiesti per questo blocco. |

### Viste registrate per i test (D8)

`BM_RECORD=1` fa scrivere allo strumento, per ogni caso non ancora presente, la coppia
vista precedente / vista nuova come è arrivata al client. Le carte (mano, oggetti) sono
ridotte ai campi che il modello legge, stati e timer ai campi descrittivi; tutto il resto
(risorse, conteggi, `resolvedMoves` con `moveReport`, `timeBasedEffects`, esito) è quello
del server. Le viste del piano ([osservazione](client-c3/c3-plan/observation.json))
contengono solo riepiloghi, non viste complete: i casi sono stati registrati di nuovo.

| Caso | Partita reale | Cosa prova in unità |
|---|---|---|
| `itemConsumed`, `boundDiscard` | quick 1vCom, turno 0→1 | ADOPERIAMOTI su un Negroni proprio: collegato; scarto della bound di un computer |
| `drawnToTable`, `death`, `over` | quick 1vCom, turno 7→8 | oggetto comparso sul proprio posto con il mazzo calato più delle carte arrivate in mano; morte di devAlice ed esito nello stesso round |
| `rejoinSame` | quick 1vCom, rientro al turno 2 | vista di `resume` con la stessa risoluzione: relazione `same`, nessuna differenza |
| `void` | FFA con quattro computer, turno 0→1 | SVEGLIAMOCI MA TU NO annullata, ancora in ordine, nessun collegamento |
| `jump` | FFA, devAlice morta e guarda, turno 16→18 | salto riconosciuto, ultime mosse conservate, nessuna differenza |
| `jumpAfterForfeits` | FFA con devBob e tre computer, forfait per tempo di entrambi, turno 1→22 | salto di 21 turni, esito, fine turno solo di chi ha righe |
| `itemNamedNotGone` | open «C3 contrasti», turno 5→6 | Grab su un Negroni consumato mentre un altro Negroni arriva dal mazzo: per nome nulla sparisce, quindi **nessun collegamento** (mazzo −2) |
| `itemFromOther` | open «C3 furti», turno 5→6 | Steal di una Peroni del computer: collegata, comparsa presso devAlice; la Tennents uscita per capienza non è collegata a nulla |

In più, derivati dalle viste reali: somma sbagliata scoperta dal controllo, due mosse
che contendono una sola sparizione (nessun collegamento), altra partita con turno
successivo (nessuna differenza), forfait nuovo e vecchio, `choices` `{}` dei computer.

### Scenari reali (entrambe le misure)

`VerifyResolution` gioca dalla UI e a ogni vista registra: viste ricevute sul socket,
fatti esposti dal client, contatori della scena. **Controlli bloccanti sul modello:**
per ogni coppia di turni ricevuti, la variazione di ogni posto sommata alla vista
precedente dà la nuova (risorse, oggetti, mano, mazzo, morte); un salto è riconosciuto
come non contiguo e senza differenze; i fatti esposti dal client coincidono con quelli
ricalcolati sulle viste del socket; le mosse sono nell'ordine del server; nessun
collegamento senza sparizione; fatti invariati sostituendo le frasi del server.
**Regole del piano sulla scena (solo registrate):** 1 (al massimo una sequenza per
`gameId/turn`), 2 (alla scelta la scena mostra la vista: plancia, ventagli, oggetti,
mano), 3 (nessuna sequenza né differenza dopo un salto o in un'altra partita), 6 (una
vista dello stesso turno non avvia sequenze).

1. **Quick 1vCom con caduta e rientro.** Al secondo turno proprio «Simula
   disconnessione» → «Rientra»: due viste del turno, entrambe `same` senza differenze,
   sequenze 2 → 2 (nessuna rianimazione), zero SEND di mosse; partita fino all'esito.
2. **Movimento ridotto emulato** (tre round, poi abbandono): zero sequenze e zero
   variazioni nella scena, mentre il modello ha 3–5 variazioni di risorse per round;
   resta solo il riepilogo breve testuale.
3. **FFA con quattro computer**, guardando dopo la propria morte: a entrambe le misure
   devAlice muore prima della fine e i computer risolvono i round a catena (15→27 a
   1366×768, 9→15 a 844×390).
4. **FFA con devBob e tre computer, forfait per tempo di entrambi** (35 s reali): turno
   1 → 21 e 1 → 22.
5. **Open 1vCom con due mazzi sintetici** salvati dall'editor sul database temporaneo:
   «C3 contrasti» (BigBadBruiser, BruiserGrab, LittleRage, 7 FAI BASTA, 5 Negroni,
   3 Grab, 2 COSA FAI, 3 GARGANTUESCO IMPATTO) e «C3 furti» (ToxicJunkie, ToxicGrab,
   PatheticBlade, 6 Steal, 5 Tennents, 3 Tutto è Droga, 2 Mescolone, 4 Rabbia da Meth).
   Le mani sono ordinate per preferire contrasti, prese e furti quando c'è un oggetto.

| Esecuzione finale | 1366×768 | 844×390 |
|---|---|---|
| Round contigui controllati (somma = vista nuova) | 44 su 5 partite, 0 differenze | 54 su 5 partite, 0 differenze |
| Salti riconosciuti | 15→27, 1→21 | 9→15, 1→22 |
| Casi visti (round) | annullate 7, oggetto proprio consumato 21, oggetto altrui collegato 4, pescato sul tavolo 7, morte 5, esito 3, bound con scarto 29, fine turno 37, rientro 1 | annullate 11, consumato 14, altrui 1, pescato 7, morte 4, esito 3, bound 44, fine turno 46, oggetto nominato non sparito 2, rientro 1 |
| Regola 1 (una sequenza per round) | rispettata | rispettata |
| Regola 2 (stato finale = vista) | rispettata a ogni scelta | rispettata a ogni scelta |
| Regola 3 (nessuna animazione dopo un salto) | **violata** in entrambi i salti (K2) | **violata** in entrambi i salti (K2) |
| Regola 6 (stesso turno senza riavvio) | rispettata | rispettata |

Nelle prove intermedie si sono visti anche: un salto 16→18 in FFA, un salto 1→9 e una
mano senza mosse valide in «C3 furti» (limite R03: lo strumento ora abbandona la
partita, cattura e dichiara il caso invece di fermarsi).

### K1–K6: stato di partenza misurato

Valori delle esecuzioni finali ([1366×768](client-c3/c3-1/resolution-1366x768.json),
[844×390](client-c3/c3-1/resolution-844x390.json), campo `scene`).

| # | Misura | Esito |
|---|---|---|
| K1 | Sequenze annullate dalla seconda vista dello stesso round (motivo `view`) | **Tutte** nei round giocati: 7/7, 16/16, 13/13, 8/8 a 1366×768; 11/11, 10/10, 20/20, 13/13 a 844×390. Durata 5–30 ms contro 1200 nominali. Uniche sequenze complete (1202–1205 ms): quelle del salto, perché nessuna vista è arrivata dopo. |
| K2 | Animazione dopo un salto | In tutti e quattro i salti la scena avvia la sequenza delle mosse dell'ultimo round e scrive 3–5 variazioni «totale turno» su differenze che coprono 6–21 round; anche i trasferimenti di oggetti. Il modello dà `jump` senza differenze. |
| K3 | Movimento ridotto | Confermato: zero sequenze e zero variazioni nella scena per tre round, mentre il modello ne ha 3–5 per round. |
| K4 | «Salta effetti» e tocco cancellano le variazioni | Non osservabile in pratica oggi: per K1 la sequenza dura 5–30 ms, prima di qualunque input. Il percorso è nel codice (`stopEffects` svuota anche `deltas`); da riprovare in C3-2 quando la sequenza dura davvero. |
| K5 | Riepilogo breve a scheda nascosta | Non misurato in questo blocco (Playwright non nasconde la scheda in modo affidabile): resta la verifica del codice del piano (timer di 6 s indipendente da `document.hidden`). Da provare in C3-2. |
| K6 | Contenuto della scena rispetto ai fatti | Round contigui con variazioni di risorse diverse da HEALTH: **tutti** (es. 13/13 in «C3 contrasti» a 1366×768); con oggetti spariti o comparsi 1–14 per partita; con mosse annullate fino a 8; con fine turno quasi tutti; con pesche tutti. La scena mostra solo il totale di HEALTH (`aggregateDeltas`) e 0–3 trasferimenti uno a uno per partita; costi, altre risorse, pesca, annullamenti e fine turno non sono nella scena. |

### Limiti e residui

- **Salto di 25 turni:** il piano lo cita dall'osservazione (1→26). Nelle esecuzioni il
  salto massimo registrato è 1→24 (in una prova intermedia; 20–21 turni nelle esecuzioni finali): la lunghezza dipende dalle
  mosse casuali dei computer. Il modello non distingue la lunghezza oltre `turnsAdvanced`.
- **Oggetti per nome:** il server non pubblica identità degli oggetti. Un oggetto
  consumato e uno uguale pescato nello stesso round si compensano: nessuna sparizione,
  nessun collegamento (caso reale `itemNamedNotGone`). È la scelta prudente di D1; C3-4
  mostrerà un oggetto comparso dal mazzo e nessuna consumazione.
- **Costo nominale:** il costo è quello del catalogo per nome visualizzato; le carte di
  un computer non presenti nel catalogo noto al client darebbero `null`. Con il catalogo
  completo dell'account ogni carta del set è nota; l'importo pagato può differire con
  stati di risorsa (R05) e la differenza vera è nella variazione complessiva.
- **Rientro dopo un turno avanzato:** il modello tratta come `next` anche una vista di
  `resume` che arriva esattamente al turno successivo (la differenza copre un round).
  Il piano (regola 3) chiede di non animare dopo una connessione precedente al salto: la
  scelta su `reset` e generazione è della scena, in C3-2. Nelle prove il rientro è
  avvenuto sempre nello stesso turno.
- **Osservazione sul server, fuori perimetro:** nelle viste ripetute dello stesso turno
  l'**ordine dei timer** di un personaggio può cambiare (stessi nomi e valori, per esempio
  due Mescolone con 3 e 4, o Mescolone e Presa Male), visto in prove intermedie con
  «C3 furti» e «C3 contrasti». Non riguarda il modello, che non legge i timer; lo
  strumento confronta le viste ripetute senza ordine dei timer e conta i casi
  (`timerOrderOnly`). Le altre parti delle viste ripetute sono risultate identiche salvo
  `pendingMove`, come nel piano.
- **Mano senza mosse valide (R03):** può capitare con un mazzo sintetico; lo strumento
  abbandona la partita e lo registra (`noValidMove`), come limite noto della versione.
- K4 e K5 sono dichiarati, non misurati (vedi sopra). Movimento ridotto provato solo
  per emulazione del browser.
- Dispositivo fisico, iPhone, prova umana e lettore di schermo non provati in questo
  blocco.
- Dati locali non toccati: tutte le prove su database temporanei.
- Evidenze: [resolution-1366x768.json](client-c3/c3-1/resolution-1366x768.json),
  [resolution-844x390.json](client-c3/c3-1/resolution-844x390.json), [catture](client-c3/c3-1/screens/)
  `resolution-*`; regressione `verify-*` e [size.json](client-c3/c3-1/size.json) nella
  stessa cartella.

# Rapporto C3 — Rendere leggibile e soddisfacente la risoluzione

29 ottobre 2026. Regolamento **1.9** (1.8 per C3-1). C3 procede a blocchi secondo il
[piano C3](../client-c3-plan.md), con le decisioni D1–D11 confermate dal proprietario,
poi D12 e D1 riaperta dopo la prova di C3-2, D13 e il tetto di 20 s (D10) dopo la prova di C3-4.
**C3-1 (modello puro della risoluzione e strumento di verifica) è fatto**
([sezione](#c3-1--modello-puro-della-risoluzione-e-strumento-di-verifica)), **C3-2
(sequenza affidabile) è fatto** ([sezione](#c3-2--sequenza-affidabile)), con una
**revisione dopo la prova del proprietario** (una carta per volta, tocco che passa alla
successiva, D1 riaperta per C3-4: [sezione](#c3-2--revisione-dopo-la-prova-del-proprietario)). **C3-3 (frecce verso i bersagli ammessi, O6) è fatto**
([sezione](#c3-3--o6-frecce-verso-i-bersagli-ammessi)). **C3-4 (sequenza del round con i soli dati certi) è
fatto** ([sezione](#c3-4--sequenza-del-round-con-i-soli-dati-certi)), con una **revisione dopo la prova del
proprietario** (regia D13 di ogni carta con primi piani di chi gioca e del bersaglio:
[sezione](#c3-4--revisione-dopo-la-prova-del-proprietario)). **C3-L (scala e uso dello spazio del tavolo), blocco
aggiunto dopo il feedback del proprietario, è fatto** ([sezione](#c3-l--scala-e-uso-dello-spazio-del-tavolo)). Gli altri
blocchi non sono iniziati; l'attività A1 (tipo di danno nel catalogo, regolamento 1.9)
è fatta a parte.

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
- **Caso K7 col mouse:** dipende dalle carte pescate (serve una carta che miri un oggetto lontano); nel giro finale
  è stato eseguito e verde, ma un giro con altre pescate può saltarlo.
- Dati locali non toccati: tutte le prove su database temporanei.
- Evidenze: [resolution-1366x768.json](client-c3/c3-1/resolution-1366x768.json),
  [resolution-844x390.json](client-c3/c3-1/resolution-844x390.json), [catture](client-c3/c3-1/screens/)
  `resolution-*`; regressione `verify-*` e [size.json](client-c3/c3-1/size.json) nella
  stessa cartella.

## C3-2 — Sequenza affidabile

29 ottobre 2026. Regolamento **1.9** (A1 fatta a parte, commit `32d30b8`; nessun
effetto per questo blocco). Regole di non-regressione 1–6 del piano, decisioni D4, D5
(il passo delle barre resta a C3-4), D6. Nessun cambio a regole, server, protocollo,
catalogo o `client-debug`. Prima delle partite il jar del server è stato ricostruito
sui sorgenti correnti (quello presente era precedente ad A1).

### Esito in breve

| Livello | Stato |
|---|---|
| Modello (`src/model.ts`) | `Model.round`: fatti del **round** (`resolve` di C3-1) aggiornati solo quando cambia il turno; una vista dello stesso turno lo lascia identico. `crossed` se la vista precedente è di una connessione precedente (caduta, rientro) o di un reset: un round così non ha mai differenze (regola 3). |
| Funzioni pure (`src/resolution.ts`) | `hasDifference` (contiguo, stessa connessione), `plays` (in più: mosse presenti, chiave non ancora animata, movimento possibile), `seatMarks` (variazioni per posto dalle `seats` del modello, oggetti spariti e comparsi) e `roundNote` (la riga dopo un salto o un rientro). Nessun testo del server letto. |
| K1 | Una vista dello stesso turno annulla solo un trascinamento (C0-R4 invariato), **non** la sequenza. Si chiude solo con nuovo turno, reset, caduta, input sul tavolo (tocco, clic, tasto), «Salta effetti», ridimensionamento o zoom, scheda nascosta, cambio di movimento ridotto. Aprire un dialogo o perdere il fuoco della finestra non la chiude più: così «Salta effetti» ha davvero una sequenza da fermare. |
| K2 | Nessuna sequenza e nessuna variazione se il round non è contiguo o arriva dopo una caduta; al loro posto la riga «Risolti N turni fino al turno T: valori finali della vista. L’ultimo turno è in «Ultimo turno».» nel riepilogo breve e sul pannello d'esito, finché non arriva il round successivo o si sceglie una carta. |
| K3, K4 | **Riepilogo statico del round** disegnato nel tavolo (non nel livello effetti): per ogni posto una striscia larga quanto la plancia, sopra la propria e sopra quella del posto FFA di sinistra (dove sotto ci sono le carte coperte), sotto le altre, con «H −7 A −10 V +5 ogg −1 ogg +1» o «invariato». Compare a sequenza finita, saltata o interrotta, subito con movimento ridotto, scheda nascosta o contesto grafico perso; resta fino alla prima scelta di carta o al round successivo (D6). Geometria in `tableLayout`, controllata in unità a 1366×768 e 844×390 in duello e FFA a cinque: dentro lo schermo e lontana da mano, posti, oggetti, stati, ventagli di otto carte e dalle altre strisce. |
| K5 | Il riepilogo breve conta i suoi 6 s solo a scheda visibile. Resta il limite FFA di P31 (copre i posti in alto per qualche secondo), assegnato a C3-6. |
| Contenuto animato | Invariato rispetto a prima: voli delle carte giocate nell'ordine di `resolvedMoves`, accenti sui bersagli, totale di HEALTH a fine sequenza, trasferimenti uno a uno; durata 1,2 s. Il contenuto nuovo (costi, pesca, annullate, fine turno) è di C3-4. |
| Test automatici | Client **131** (123 + 8): riepilogo per posto uguale alle differenze del modello su tutte le viste reali registrate, nessun riepilogo e riga dei turni dopo un salto o un rientro, sequenza una volta per chiave e mai senza movimento, `Model.round` invariato dallo stesso turno e `crossed` dopo caduta o reset, quattro controlli di geometria delle strisce. Nessun atteso esistente cambiato. |
| Server reale | **Sì.** `VerifyResolution` esteso: le regole 1, 2, 3, 6 e i controlli di C3-2 sono ora bloccanti; nuovo scenario `interrupt`. Verde a 1366×768 e 844×390. |
| Regressione | Il blocco tocca il tavolo di ogni partita: sulla build finale `Verify` e `VerifyModes` (server su database temporaneo), `VerifyLifecycle`, `VerifyFfa` e `VerifyDecks` verdi a 1366×768 e 844×390. `VerifyPublic` e `VerifyProfile` non ripetute (home, regole, profilo e amministrazione non cambiano). `build.ps1 -Task Test -Offline` (254 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 310185 byte (+2140 rispetto a C3-1); totale gzip 1092979 byte ([size.json](client-c3/c3-2/size.json)). |
| Emulazione / dispositivo / umano | Due misure landscape sul PC; movimento ridotto emulato dal browser; scheda nascosta **emulata** (Edge headless riporta sempre la pagina come visibile, anche con un'altra pagina in primo piano: lo strumento sovrascrive `document.hidden` e `visibilityState` e invia `visibilitychange`). Nessun dispositivo fisico né prova umana. |

### Scenari reali (entrambe le misure)

Esecuzioni finali ([1366×768](client-c3/c3-2/resolution-1366x768.json),
[844×390](client-c3/c3-2/resolution-844x390.json), campi `scene.*.sequenceEnds`,
`summariesAtChoice`, `notes`). Lo strumento lascia finire ogni sequenza prima della
mossa successiva, così la completezza è misurata.

| Partita | 1366×768 | 844×390 |
|---|---|---|
| Quick 1vCom con caduta e rientro | 19 round contigui, 19 sequenze tutte complete (1200–1208 ms), riepilogo a ogni scelta; rientro: sequenze 2 → 2, nessuna rianimazione | 7 round, 7 complete (1201–1208 ms); rientro 2 → 2 |
| FFA con quattro computer | 12 round, 12 complete; devAlice muore e il server risolve il resto a catena: salto 12→24 senza sequenza né riepilogo, riga sul pannello d'esito | 18 round, 18 complete; devAlice resta fino all'esito senza salti |
| FFA con devBob e tre computer, forfait per tempo | salto 1→20: nessuna sequenza, nessun riepilogo, «Risolti 19 turni fino al turno 20…» sul pannello | salto 1→23, «Risolti 22 turni…» |
| Open «C3 contrasti» | 19 round, 19 complete | 15 round, 15 complete |
| Open «C3 furti» | 18 round, 18 complete | 8 round, 8 complete |
| Sequenze chiuse da una vista (K1) | **0** | **0** |
| Regole 1, 2, 3, 6 | rispettate in tutte le partite | rispettate in tutte le partite |

**Interruzioni** (scenario `interrupt`, quick 1vCom, entrambe le misure):

1. **«Salta effetti»** durante la sequenza: menu aperto (la sequenza continua), poi il
   pulsante la chiude con motivo `skip` dopo 128–137 ms; stato finale uguale alla vista,
   riepilogo del round presente.
2. **Tocco sul tavolo vuoto** (punto del canvas senza bersagli né HTML sopra): chiusa
   con motivo `input` dopo circa 100 ms, nessuna carta scelta, riepilogo presente.
3. **Carta toccata durante la sequenza** (regola 4): scelta al primo tocco, sequenza
   chiusa (`input`), riepilogo nascosto dalla scelta (D6).
4. **Scheda nascosta** (emulata) dalla calata alla risoluzione e per altri 7 s: al
   ritorno nessuna sequenza (3 → 3), riepilogo del turno presente, riepilogo breve ancora
   visibile («Turno 4: …»): i 6 s non sono passati a scheda nascosta (K5).
5. **Movimento ridotto** emulato per tre round: zero sequenze, riepilogo statico di ogni
   round sul tavolo (per esempio «H −2 A −7 V +20 T +5 L +7 ogg −1» presso il computer).

**Regola 4 fra umani** (FFA con devBob, primo round): durante la sequenza una carta di
devAlice si sceglie al primo tocco (sequenza chiusa con `input`) e il clock della mossa
passa da 30 a 28 s nei 2,3 s successivi.

### Limiti e residui

- **Scheda nascosta emulata:** in Edge headless la visibilità non cambia; lo strumento
  prova prima con un'altra pagina in primo piano e, se la pagina resta visibile, emula
  l'evento. Il percorso reale del browser (timer sospesi, `app.stop`) non è provato qui.
- **«Resta a guardare» con la riga dei turni:** quando restano solo computer il server
  risolve il resto della partita in un colpo, quindi la vista successiva alla morte è
  già l'esito: la riga compare sul pannello d'esito, non durante la visione. Guardare
  con almeno un altro umano vivo non produce salti (il round aspetta la sua mossa); il
  percorso del riepilogo breve con la riga è provato in unità (`roundNote`).
- **Rientro al turno successivo** (vista di una connessione precedente): provato in
  unità (`Model.round.crossed`, nessuna differenza, riga «… mentre eri fuori linea»);
  nelle partite reali il rientro è avvenuto nello stesso turno.
- **Resize e cambio di orientamento** chiudono la sequenza (non la riavviano: regola 1);
  non c'è una prova reale dedicata in questo blocco.
- Il riepilogo statico mostra variazioni **complessive** del round: costi, effetti e fine
  turno sommati, come previsto dal piano; l'attribuzione resta impossibile (D1).
- Il riepilogo breve in alto copre ancora per 6 s i posti superiori della FFA (P31):
  C3-6.
- Durata della sequenza ancora 1,2 s con il contenuto di prima: i 5 s di D10 servono a
  C3-4.
- Dispositivo fisico, iPhone e prova umana non provati in questo blocco.
- Dati locali non toccati: tutte le prove su database temporanei.
- Evidenze: [resolution-1366x768.json](client-c3/c3-2/resolution-1366x768.json),
  [resolution-844x390.json](client-c3/c3-2/resolution-844x390.json),
  [catture](client-c3/c3-2/screens/) `resolution-*` (riepiloghi statici in `*-turn2-*`,
  movimento ridotto, dopo la scheda nascosta, dopo il salto); regressione `verify-*`,
  `lifecycle-*`, `ffa-*`, `decks-*`, `modes-*` e [size.json](client-c3/c3-2/size.json)
  nella stessa cartella (catture conservate solo per `VerifyResolution` e `Verify`, per
  non appesantire il repository).

## C3-2 — Revisione dopo la prova del proprietario

29 ottobre 2026. Il proprietario ha provato C3-2 sul client locale e ha osservato:

1. le carte sono troppo veloci e non si capisce cosa succede;
2. guadagni e perdite non seguono l'attivazione delle carte: compaiono solo come totale
   nella striscia sopra le risorse.

**Decisioni del proprietario** (piano C3 aggiornato):

- **D12:** una carta per volta, più lenta, con avanzamento automatico. Un tocco passa alla
  carta successiva; scegliere una carta della mano e «Salta effetti» chiudono la sequenza.
  Nessun blocco della scelta, nessun Continue: la regola 4 resta nella sostanza.
- **D10 portata a 10 s per round**, così anche le cinque carte di una FFA hanno il ritmo
  del duello.
- **D1 riaperta.** Le variazioni carta per carta, con la barra della risorsa ingrandita,
  verranno dalle sole righe regolari del report, verificate sulla vista, con ripiego sul
  totale. **Restano a C3-4.** Questa revisione cambia solo il ritmo.

### Misura che ha motivato D1 riaperta

Prima di decidere ho misurato, senza toccare il client, su partite reali (quick 1vCom,
FFA con computer, open con i mazzi sintetici; database temporaneo). Per ogni round
contiguo: righe «RISORSA: a->b» del report (autore per `SELF`, bersaglio per `OPPONENT`,
anche sulle mosse su sé), più i costi nominali tolti prima degli effetti (R04), più le
righe di fine turno, confrontate con la differenza fra le due viste. Due controlli: la
**somma** per posto e risorsa, e la **catena**, cioè ogni riga parte dal valore lasciato
dalla precedente.

| Esecuzioni | Round | Somma e catena tornano |
|---|---|---|
| Misura dedicata, due esecuzioni ([d1-measure.json](client-c3/c3-4/d1-measure.json)) | 118 | 113 (96%) |
| Esecuzioni finali di questa revisione, entrambe le misure (`reportConsistency`) | 131 | 128 |

Tutti gli scarti della misura dedicata hanno la stessa causa: mancano esattamente 20 di
HEALTH presso un posto con un timer di **MarvelousCocktail** (Mescolone Micidiale) in
scadenza. Quel veleno arriva dal timer, e per i timer il server scrive solo «Timer
expired … effect triggered», senza numeri. Dove la somma torna, torna sempre anche la
catena.

### Esito in breve

| Livello | Stato |
|---|---|
| Ritmo (`pace` in `src/resolution.ts`) | Una carta per volta: per il 22% della sua durata compare presso l'autore (ingrandendosi), fino al 72% vola al bersaglio, poi lo colpisce (accento) e svanisce. Dopo le carte vengono i trasferimenti di oggetti (550 ms) e il totale di HEALTH (800 ms). Ogni carta dura fra 0,85 e 1,5 s, in base a quanto lascia il budget di 10 s: in duello 1,5 s per carta (3,8 s per round, contro 1,2 s di prima); in FFA con cinque carte e oggetti ancora 1,5 s (8,85 s). Contenuto animato invariato. |
| Avanzamento (D12) | Tocco o clic sul tavolo, anche su un personaggio o un oggetto, e tasto su un elemento: la sequenza salta all'inizio della carta successiva, poi agli oggetti, ai totali, e infine finisce. Il tocco fa anche la sua azione (ispezione, alzare un oggetto coperto). Una carta della mano chiude la sequenza e viene scelta subito. «Salta effetti», nuovo turno, reset, caduta, ridimensionamento e scheda nascosta la chiudono come in C3-2. |
| Test automatici | Client **133** (131 + 2): ritmo entro il budget e senza sovrapposizioni fra carte per 1–5 carte con e senza oggetti, 1,5 s in duello e in FFA; ogni tocco porta alla fermata successiva fino alla fine. |
| Server reale | **Sì.** `VerifyResolution` controlla che ogni sequenza completata duri quanto il suo piano (±250 ms) e che nessun piano superi 10 s. Lo scenario dei tocchi attraversa un round tocco dopo tocco. Verde a 1366×768 e 844×390 sulla build finale. |
| Regressione | Sulla build finale: `Verify` e `VerifyModes` (server su database temporaneo), `VerifyLifecycle`, `VerifyFfa` e `VerifyDecks` verdi a 1366×768 e 844×390; `build.ps1 -Task Test -Offline` (254 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 310757 byte (+572 rispetto a C3-2); totale gzip 1093552 byte ([size.json](client-c3/c3-2r/size.json)). |
| Strumenti | Porte configurabili per verificare accanto a un server locale acceso: `BM_SERVER_PORT` nello strumento, `BM_PORT` in `vite.config.ts`. Predefiniti invariati (8080, 4320). |

### Scenari reali (entrambe le misure)

Esecuzioni finali: [1366×768](client-c3/c3-2r/resolution-1366x768.json) e
[844×390](client-c3/c3-2r/resolution-844x390.json).

| Partita | 1366×768 | 844×390 |
|---|---|---|
| Quick 1vCom con caduta e rientro | 12 round, 12 sequenze complete in 3800–3806 ms | 17 round, 17 complete in 3800–3808 ms |
| FFA con quattro computer | 20 round, 20 complete in 5305–8850 ms; salto 20→22 dopo la morte di devAlice, riga sul pannello | 19 round, 19 complete in 3800–8856 ms |
| FFA con devBob, forfait per tempo | salto 1→16 senza sequenza né riepilogo, riga «Risolti 15 turni…» | salto 1→21, «Risolti 20 turni…» |
| Open «C3 contrasti» / «C3 furti» | 14 e 13 round, tutte complete (3,8 s) | 17 e 17 round, tutte complete (3,8–4,36 s con oggetti) |
| Tocchi (D12) | round di due carte, piano 3800 ms: tre tocchi sul tavolo vuoto (seconda carta, totali, fine), chiusa dopo 3076 ms con motivo `input`, riepilogo presente | uguale, chiusa dopo 3079 ms |
| «Salta effetti», carta scelta, scheda nascosta (emulata) | `skip` dopo 123 ms; la carta toccata è scelta subito (`input`); nessuna sequenza al ritorno | `skip` dopo 119 ms; come a sinistra |
| Regola 4 fra umani | carta scelta durante la sequenza, clock da 30 a 28 s | come a sinistra |
| Sequenze chiuse da una vista | 0 | 0 |

### Limiti e residui

- **Tempo di lettura fra umani:** una FFA con cinque mosse dura fino a 8,85 s dei 30 s
  del clock. La scelta resta libera durante la sequenza (regola 4), e la sequenza si
  attraversa con i tocchi. Il dato per un'eventuale A2 si raccoglie in C3-4 e C3-7.
- **Avanzamento con un tocco su un bersaglio:** quando non c'è una carta scelta, il tocco
  su un personaggio o un oggetto apre anche l'ispezione, come prima. È voluto (il tocco
  non perde la sua azione), ma da valutare nella prova.
- Variazioni carta per carta e barra ingrandita: C3-4, con D1 riaperta.
- Scheda nascosta ancora **emulata** (Edge headless); dispositivo fisico, iPhone e
  prova umana del ritmo non fatti in questa revisione.
- Dati locali non toccati dalle verifiche: tutte su database temporanei.
- Evidenze: `resolution-*`, regressione `verify-*`, `lifecycle-*`, `ffa-*`, `decks-*`,
  `modes-*` e [size.json](client-c3/c3-2r/size.json) in
  [client-c3/c3-2r](client-c3/c3-2r/) (catture solo per `VerifyResolution` e `Verify`);
  misura D1 in [c3-4/d1-measure.json](client-c3/c3-4/d1-measure.json).

## C3-3 — O6: frecce verso i bersagli ammessi

30 ottobre 2026. Decisione D3 del piano (confermata). Nessun cambio a regole, server,
protocollo, catalogo o `client-debug`; la sequenza del round non cambia.

### Esito in breve

| Livello | Stato |
|---|---|
| Geometria pura (`src/readability.ts`) | `aimArrows(carta, bersagli, schermo, {avoid, head})`: una freccia per bersaglio che le viene dato, dal bordo della carta al bordo del bersaglio (scarto 4 px) su una curva quadratica il cui punto di controllo resta nello schermo (quindi lo restano curva e punta). La curva piega verso il centro dello schermo; se attraversa la zona da tenere libera (la colonna di ✓ e ×, `confirmButtons`, con 8 px di margine) prova partenze lungo il bordo della carta e piegature maggiori dai due lati e sceglie la meno interferente; `crosses` dice se non basta. `reached`: la carta è già sul bersaglio o la freccia sarebbe un moncone (< 12 px): niente da disegnare. Appoggi: `edgePoint`, `bezier`, `confirmBox`, `confirmButtons`. |
| Scena (`src/scene.ts`) | `drawAim()` su un livello `aimLayer` fra tavolo ed effetti: una freccia per personaggio per cui `Model.allows` è vero (le stesse categorie dei contorni) e, per le carte che prendono un oggetto, una per posto che ne ha, verso l'ultimo oggetto ammesso (l'unico per intero nella FFA); gli oggetti restano contornati come prima. Ridisegno a ogni vista, scelta e trascinamento (al massimo una volta per frame; la partenza segue la carta trascinata). Nessuna freccia se la scelta è bloccata (`Model.locked`: pending, eliminato, esito) o se è già stato scelto un bersaglio (resta la linea verso l'anteprima). Stile fumetto pop-art (riferimento del proprietario, dopo la prova): nastro che si allarga in una punta con alette, tutto celestino come il contorno dei bersagli, con riflesso chiaro sulla punta, contorno nero spesso ed estrusione nera piena in basso a sinistra (`arrowShape`, un poligono), livello semitrasparente con un solo filtro (le sovrapposizioni non si scuriscono) per lasciare intravedere ciò che coprono. La punta ha angolo fisso e appuntito; entra sempre di qualche pixel nella carta bersaglio e, sulle frecce corte, di più (fino a metà della carta) perché la freccia non si riduca a un moncherino: coprire un po' il bersaglio è accettato. Pulsazione leggera dell'opacità (0,88–1); con movimento ridotto il livello è fisso a opacità 1. Il server resta il giudice: le frecce non validano nulla. |
| Esposizione | `window.__bm.state.arrows` (con `reached` e `crosses`), `aimAlpha`, `reduced`, `stats.aimDraws` e `aimMs`: solo per la verifica. |
| Test automatici | Client **148** (da 133): 15 nuovi in `tests/readability.test.ts` per duello e FFA a cinque a 1366×768 e 844×390 (una freccia per bersaglio, punta sul bordo, curva e testa nello schermo, fuori da ✓ e ×, `reached`, scelta del lato). Nessun atteso esistente cambiato; typecheck pulito. |
| Server reale | **Sì.** Nuovo `VerifyAim` (`run.ps1 -Task VerifyAim`, `tools/verify-aim.mjs`), server avviato dallo strumento su database temporaneo. Verde a 1366×768 e 844×390, zero problemi. |
| Peso | JS gzip 313528 byte (+5483 rispetto a C3-1), totale gzip 1096473 ([size.json](client-c3/c3-3/size.json)). |
| Emulazione / dispositivo / umano | Edge via Playwright sul PC; tocco emulato con eventi reali del protocollo; nessun dispositivo fisico né prova umana. |

### Cosa controlla `VerifyAim`

Gli attesi sono ricalcolati dalla **vista ricevuta sul socket** (categorie `canTarget` della carta,
morti e forfait, oggetti per posto), non dalla chiamata del client. Per ogni carta della mano, a tre
turni di partita, la carta si sceglie con un tocco e si legge la scena.

| Scenario | Cosa si prova |
|---|---|
| `duel` (quick 1vCom, mouse) | frecce per ogni carta; trascinamento con le frecce che seguono la carta; rilascio su un bersaglio (mira senza comandi); annullamento per rilascio sul tavolo vuoto; riordino; interruzione del trascinamento con `blur` (C0-R4); pulsazione; prestazioni; poi la partita fino all'esito (nessuna freccia e nessuna scelta a partita finita) |
| `touch` (quick 1vCom, tocco emulato) | tocco carta e tocco bersaglio; trascinamento con eventi di tocco reali (carta sopra il dito); nessun comando |
| `reduced` (movimento ridotto) | livello fisso a opacità 1 su 14 campioni in 1 s, frecce presenti |
| `ffa` (cinque posti, quattro computer) | frecce ai quattro avversari e agli oggetti, nessuna fuori dallo schermo né sopra ✓ o ×, prestazioni del trascinamento |
| `pending` (FFA con devAlice, devBob e tre computer) | devAlice invia e resta in pending: scegliere una carta o trascinarla non disegna frecce |

Per ogni carta: insieme degli id delle frecce uguale a quello della vista; punta entro 8 px dal bordo del
bersaglio e mai dentro; 25 campioni della curva e i tre punti della testa dentro lo schermo; nessun campione
(fuori dalla carta) sopra i **rettangoli reali** di ✓ e × letti dal DOM dopo aver mirato; zero frecce a mira fatta
e dopo Esc. D12: scegliere una carta con la sequenza in corso la chiude (`input`), la carta resta scelta e le sue
frecce sono quelle ammesse (esercitato 3 volte su 3 in ogni scenario con sequenza, a entrambe le misure).

| | 1366×768 | 844×390 |
|---|---:|---:|
| Carte controllate (duello, tocco, ridotto, FFA, pending) | 72 | 72 |
| Frecce disegnate / già sul bersaglio (`reached`) | 92 / 6 | 105 / 12 |
| Carte senza bersagli ammessi (zero frecce, come la vista) | 11 | 1 |
| Problemi | 0 | 0 |

### Prestazioni del trascinamento con le frecce

Stesso criterio di C0 (almeno 95% degli intervalli entro 20 ms desktop e 33 ms touch, nessun input oltre
100 ms), ma su **partita reale**: trascinamenti consecutivi sui bersagli per 3,6 s, con la misura della scena
(`startMeasure` e `endMeasure`). Edge senza finestra visibile, 120 Hz.

| | duello 1366×768 | FFA 1366×768 | duello 844×390 | FFA 844×390 |
|---|---:|---:|---:|---:|
| Intervalli rAF | 501 | 513 | 507 | 513 |
| Cadenza | 120 Hz | 120,1 Hz | 120 Hz | 120,1 Hz |
| p95 / massimo | 8,5 / 12,7 ms | 8,5 / 10,2 ms | 8,5 / 9,8 ms | 8,5 / 11,2 ms |
| Entro soglia | 100% (20 ms) | 100% (20 ms) | 100% (33 ms) | 100% (33 ms) |
| Input → frame p95 / max | 12,2 / 12,2 ms | 10,3 / 10,3 ms | 12,1 / 12,1 ms | 11,7 / 11,7 ms |
| Ridisegni delle frecce | 467 | 467 | 459 | 467 |
| Costo di un ridisegno p95 / max | 0,1 / 0,2 ms | 0,1 / 0,2 ms | 0,1 / 0,2 ms | 0,2 / 0,2 ms |

Confronto con C0 (p95 8,4 ms; input p95 7,3 ms desktop e 16,6 ms touch emulato): le frecce non cambiano la
cadenza. Il campione di input è piccolo (una `pointerdown` per trascinamento). **Non misurato** né senza
frecce nella stessa corsa (nessun interruttore nel codice) né su dispositivo fisico.

### Limiti e residui

- **Frecce «già sul bersaglio»:** quando la carta alzata tocca il bordo del bersaglio (FFA: la carta alzata sta
  contro il personaggio in mezzo a destra; nel trascinamento, appena la carta gli passa sopra) la freccia sarebbe
  un moncone e non si disegna (`reached`); il contorno resta e l'elenco la conta.
- **Carte che prendono un oggetto proprio** (azioni base): la carta alzata copre in parte i propri oggetti e la
  freccia è corta, a volte assente. Il contorno resta.
- **Zona di ✓ e ×:** le frecce evitano la colonna dei due pulsanti, non l'intero pannello. In alcune scelte
  (`crossPanel` nelle evidenze) una freccia attraversa l'area del testo del pannello, che però compare solo a
  scelta fatta, quando le frecce non ci sono più.
- **Pending ed esito** provati su partite reali (due umani; duello perso fino alla fine). L'eliminazione in FFA
  con un morto che guarda passa dallo stesso `Model.locked` ma non è capitata in queste partite.
- Frecce dello stesso stile per personaggi e oggetti: la differenza è la destinazione. Le misure di forma (larghezza, punta, estrusione, trasparenza) sono a occhio, da rifinire con il proprietario.
- **Regressione sulla build finale:** `Verify` e `VerifyModes` verdi a entrambe le misure; `VerifyResolution` verde a entrambe; `VerifyFfa` verde a entrambe le misure (la corsa a 844×390 è finita dopo un mio rilancio sovrapposto, che ha trovato la porta occupata dal suo server). `build.ps1 -Task Test -Offline` e `check-rules.py` passano.
- Dispositivo fisico, iPhone, prova umana: non fatti. Dati locali non toccati.
- **Osservazione del proprietario durante il blocco:** le scritte «Scegli una carta» e «Scegli il bersaglio sul
  tavolo» al centro del tavolo erano brutte e finivano sotto le carte alzate. Fatto a parte: vedi
  [C3-3 — Scritte di scelta](#c3-3--scritte-di-scelta).
- Evidenze: [aim-1366x768.json](client-c3/c3-3/aim-1366x768.json), [aim-844x390.json](client-c3/c3-3/aim-844x390.json),
  [catture](client-c3/c3-3/screens/) `aim-*`; regressione e [size.json](client-c3/c3-3/size.json) nella stessa cartella.

## C3-3 — Scritte di scelta

30 ottobre 2026. Attività separata da C3-3, su osservazione del proprietario: le scritte «Scegli una carta» e
«Scegli il bersaglio sul tavolo» stavano al centro del tavolo e finivano sotto la carta alzata. Solo presentazione:
nessun testo, regola, server o protocollo cambiato.

- **Posizione:** il suggerimento (`.hint`) è ora una pillola scura con bordo nell'angolo in basso a sinistra, l'unica
  zona libera in entrambe le misure e nei due modi (sotto la plancia propria, a sinistra della mano), larga al massimo
  380 px (250 px a 844×390).
- **Richiamo dell'attenzione:** quando si chiede una scelta («Scegli …», fase `choose`) la pillola prende la classe
  `ask`: bordo petrolio e alone che pulsa piano (2,2 s). Con movimento ridotto l'alone è fisso. Gli altri messaggi
  («Mossa ricevuta · In attesa», «Invio in corso», «Sei fuori…») restano in tinta sobria, senza alone.
- **Invariato:** `role="status"` e `aria-live="polite"`, i testi di `model.ts`, ✓/× (il suggerimento si nasconde con la
  conferma, come prima), semantic layer.
- **Verifica:** `VerifyAim` esteso: a ogni scelta il suggerimento sta tutto nello schermo e non tocca personaggi, oggetti,
  mano, plance né mani coperte; ha la classe `ask` e l'animazione in movimento normale, nessuna animazione con movimento
  ridotto; in pending resta visibile senza `ask`. Verde a 1366×768 e 844×390 (duello, tocco, ridotto, FFA a cinque, pending),
  server temporaneo. `Verify` verde a entrambe le misure; test client 144; server e `check-rules.py` verdi; JS gzip
  312287 byte, totale 1095232 ([size.json](client-c3/c3-3r/size.json)). Catture dopo in [c3-3r](client-c3/c3-3r/screens/)
  (`aim-*-chosen-*`), prima in [c3-3](client-c3/c3-3/screens/) con gli stessi nomi.
- **Non provato:** `VerifyModes`, `VerifyFfa` e `VerifyResolution` (percorso non toccato); dispositivo fisico e giudizio
  del proprietario sul nuovo aspetto. La porta 8080 era occupata da un altro server: le verifiche hanno usato un server
  temporaneo su 18080 con un'anteprima su 4321 (`BM_SERVER_PORT`, `BM_PORT`, `BM_SERVER`, `BM_CLIENT`).


## C3-4 — Sequenza del round con i soli dati certi

30 ottobre 2026. Decisioni D1 (come riaperta dopo la prova di C3-2), D5, D10 (10 s), D12; regole di
non-regressione 1–9; difetto K6. Nessun cambio a regolamento (1.9), server, protocollo, catalogo o
`client-debug`.

### Esito in breve

| Livello | Stato |
|---|---|
| Linea temporale pura (`src/resolution.ts`) | `timeline(precedente, nuova, fatti, catalogo)` costruisce il round dai fatti di C3-1, dal catalogo (costo nominale per nome, quali nomi sono oggetti del mazzo) e dalle righe verificate. Cinque fasi nell'ordine di R04: **costi** (un gettone per mossa e risorsa del costo nominale, anche per le annullate), **mosse** (calata, timbro «ANNULLATA», oggetto scelto e sparito che si consuma, passa all'autore o si rompe, scarto della bound non annullata), **pesca** (dal mazzo quante carte dice il conteggio: proprie per nome, avversarie come dorsi, oggetti del mazzo comparsi senza mossa che li passi al tavolo, mai il token), **fine turno** (chi ha righe, mai cosa), **coda** (barre di D5 se serve, «ELIMINATO» e «FORFAIT»). `beats` conta ciò che la sequenza anima, con le stesse regole per scena e verifiche. `pace` aggiunge le fasi di costi, pesca e fine turno al ritmo di C3-2, sempre entro 10 s. |
| Righe del report (D1 riaperta) | `regularLine` accetta solo `RISORSA: a->b (d)` a fine riga, al più dopo un'etichetta tra parentesi (le righe di fine turno «(TOXICITY effect) …»), con il delta coerente; ogni altro testo resta non interpretato. `reportSteps` applica in ordine costi nominali, righe di ogni mossa (`SELF` all'autore, `OPPONENT` al bersaglio, che per una mossa su sé è l'autore) e fine turno: ogni riga deve partire dal valore lasciato dal passo precedente e i passi devono finire **esattamente** sulla nuova vista. Altrimenti `verified: false` con il motivo, e la scena ripiega sul totale (passo 5, D5). |
| Scena (`src/scene.ts`) | `beginSequence` disegna la linea temporale. Durante la sequenza le plance mostrano i valori del passo raggiunto (`display`): per carta, ogni passo cambia barra e numero al colpo della carta e ingrandisce sopra la plancia la risorsa toccata («95 → 90» con la barra); col ripiego le plance restano al valore precedente fino alla coda e poi vanno al finale, ingrandite allo stesso modo. Solo il disegno delle plance segue i passi: decisioni, contorni, mira, mano, oggetti e dorsi usano sempre la vista finale (regola 2), e a sequenza finita, saltata o interrotta le plance mostrano la vista. Le carte giocate vanno allo scarto dell'autore dopo il colpo; mazzo e scarto non sono disegnati e stanno ai lati del personaggio. D12 invariato: un tocco o tasto passa alla carta successiva, poi alla pesca, al fine turno e alla coda; una carta della mano e «Salta effetti» chiudono; nessun blocco di invio né del clock. |
| Test automatici | Client **154** (149 + 5): forma regolare e testo libero; su tutte le viste reali registrate i passi si concatenano dalla vista precedente alla nuova; ripiego con motivo (veleno a timer simulato, riga che non parte dal valore lasciato, costo sconosciuto); D1 (testo del server sostituito: stesse animazioni, solo ripiego sulle barre); linea temporale uguale ai fatti (calate, timbri, gettoni, destini degli oggetti, pesche entro il conteggio del mazzo, token mai dal mazzo, morte con mossa già presentata, fine turno letale, bound annullata senza scarto); ritmo con tutte le fasi entro 10 s e fermate di D12. I due test del ritmo di C3-2 sono stati adeguati alle nuove fasi (cambio deliberato di C3-4, stesse proprietà). Nuove viste reali registrate: `itemGoneBefore`, `deathWithMove`, `lethalEndOfTurn` e il **catalogo dell'account** (nomi e costi nominali, comprese le carte dei computer), necessario per i costi nelle unità. |
| Server reale | **Sì.** `VerifyResolution` esteso e verde a 1366×768 e 844×390. A ogni sequenza confronta i conteggi costruiti dalla scena (`stats.beats`) con i fatti ricalcolati sulle viste del socket: calate, timbri, gettoni e destini degli oggetti direttamente dai fatti, pesche, scarti e passi dalla linea temporale. Le barre devono essere per carta **esattamente** quando la misura D1 indipendente (non ancorata, quella di C3-2) dice che le righe tornano, con lo stesso numero di passi, e ogni passo deve avere la sua risorsa ingrandita. Lo stato finale di **ogni** plancia deve essere la vista. Nuovo scenario `humans` e catture dei passaggi (costi, carta, coda). |
| Regressione | Sulla build finale, server su database temporaneo: `Verify` e `VerifyModes`, `VerifyLifecycle`, `VerifyFfa` e `VerifyDecks` verdi a 1366×768 e 844×390. **Un controllo di `Verify` adeguato, non un atteso rilassato:** O13 confrontava la plancia propria con la vista anche quando la scelta avviene durante la sequenza (regola 4); con D5 e le variazioni per carta, durante la sequenza la plancia mostra il passo raggiunto. Ora a sequenza ferma deve mostrare la vista come prima, durante la sequenza i valori del passo esposti dalla scena (`readout.boards`); O11 (pagabilità) resta sempre sulla vista finale. Il ramo nuovo è stato attraversato 25 volte su 27 turni a 1366×768 e 28 su 30 a 844×390. Il primo fallimento aveva lasciato una partita aperta sullo stesso server e fatto cadere anche `VerifyModes` a 1366×768 e `Verify` a 844×390; rilanciate ciascuna su un server nuovo, sono verdi. `VerifyPublic`, `VerifyProfile` e `VerifyAim` non ripetute (home, regole, profilo, amministrazione e mira non cambiano). `build.ps1 -Task Test -Offline` (254 server + 36 debug) e `check-rules.py` passano. |
| Peso | JS gzip 317372 byte (+5085 rispetto a C3-3); totale gzip 1100317 byte ([size.json](client-c3/c3-4/size.json)). Budget rispettato. |
| Emulazione / dispositivo / umano | Due misure landscape sul PC (Edge via Playwright); nessun dispositivo fisico né prova umana del ritmo. |

### Scenari reali (entrambe le misure)

Esecuzioni finali: [1366×768](client-c3/c3-4/resolution-1366x768.json) e
[844×390](client-c3/c3-4/resolution-844x390.json), campi `scene.*.rounds` (conteggi, modo delle
barre, durata di ogni round), `scene.humans.clock`, `cases`, `reportConsistency`. Mazzi sintetici di
D8 come in C3-1 («C3 contrasti», «C3 furti»), salvati dall'editor sul database temporaneo.

| Partita | 1366×768 | 844×390 |
|---|---|---|
| Quick 1vCom con caduta e rientro | 8 round, tutte complete in 4,46–5,86 s, 8 per carta | 7 round, complete in 5,20–5,86 s, 6 per carta e 1 totale |
| FFA con quattro computer | 21 round, complete in 4,55–10,01 s (9 con cinque mosse), 20 per carta e 1 totale | 8 round, complete in 9,70–10,01 s (8 con cinque mosse), 7 per carta e 1 totale |
| FFA con devBob, forfait per tempo | salto 1→19: nessuna sequenza, «Risolti 18 turni…» | salto 1→20, «Risolti 19 turni…» |
| **FFA fra umani** (`humans`: devAlice, devBob, tre computer, otto round) | 8 round tutti con cinque mosse, complete in 9,70–10,01 s; 7 per carta e 1 totale | 8 round con cinque mosse, complete in 9,70–10,01 s; 8 per carta |
| Open «C3 contrasti» / «C3 furti» | 14 e 9 round, complete in 4,46–5,86 s; 14 e 8 per carta, 1 totale | 18 e 12 round, complete in 3,80–5,86 s; 18 e 11 per carta, 1 totale |
| Animato in tutto (calate · timbri · gettoni · oggetti · scarti · pesche · fine turno · enfasi · passi) | 185 · 11 · 55 · 57 · 88 · 174 · 121 · 7 · 500 | 159 · 13 · 43 · 55 · 73 · 150 · 89 · 5 · 437 |
| Conteggi della scena diversi dai fatti / plance diverse dalla vista a fine sequenza | **0** / **0** | **0** / **0** |
| Barre per carta senza che la misura D1 torni, o viceversa | 0 (58 per carta, 3 totali su 61 round) | 0 (51 per carta, 3 totali su 54 round) |
| Regole 1, 2, 3, 6 e controlli di C3-2 | rispettate | rispettate |
| Interruzioni | «Salta effetti» `skip` dopo 127 ms; tocchi: cinque tocchi attraversano un round fino a `input`; carta scelta subito (`input`); scheda nascosta: nessuna sequenza al ritorno | `skip` dopo 134 ms; come a sinistra |

**Ripiego sul totale.** Tutti i sei round con barre totali hanno la causa già misurata per D1: 20 di HEALTH tolti dal
timer di MarvelousCocktail (Mescolone Micidiale), che il server riporta senza numeri. La scena lo dice con il motivo
in `stats.beats` (per esempio «devAlice HEALTH: steps end at 65, view 45») e anima le stesse carte, solo con le barre
al finale nella coda.

**Scenari richiesti** (`cases`; ciascuno su partite reali, mazzi sintetici di D8 compresi):

| Scenario | 1366×768 | 844×390 |
|---|---|---|
| Annullamento (timbro «ANNULLATA», carta allo scarto) | 11 round | 13 |
| Oggetto consumato / rubato (passato all'autore) | 20 / 3 | 22 / 2 |
| Oggetto scomparso prima della risoluzione | 2 round (Steal di un computer sul Negroni di devAlice, ADOPERIAMOTI di devAlice sullo stesso: «Couldn't Grab»); registrato come `itemGoneBefore` | non capitato |
| Morte con mossa già presentata (regola 7) | 7 | 4 |
| Fine turno letale (riga di fine turno che porta HEALTH da positivo a ≤ 0, verificata) | 5 | 3 |
| Bound con scarto | 46 | 37 |
| Oggetto pescato sul tavolo | 6 | 6 |
| FFA a cinque con cinque mosse entro 10 s | 18 round (17 completi, uno chiuso dal tocco della regola 4), massimo 10,01 s | 17 round (16 completi), massimo 10,01 s |

L'oggetto scomparso prima della risoluzione è conteso da due mosse che lo nominano sullo stesso posto, con una sola
sparizione: per la regola di C3-1 **nessuna** delle due anima l'oggetto (né il furto né la presa mancata), e il
riepilogo statico mantiene «ogg −1 / ogg +1». È la scelta prudente di D1; il caso è anche nelle unità con le viste
registrate.

### Durata e clock fra umani (dato per A2)

Scenario `humans`, otto round per misura, ogni umano lascia finire la sequenza; clock della mossa letto a fine
sequenza (`scene.humans.clock`).

| Misura | Mosse per round | Sequenza | Clock residuo a fine sequenza |
|---|---|---|---|
| 1366×768 | 5 in tutti gli otto round | 9,70–10,01 s | 20–21 s su 30, per entrambi gli umani |
| 844×390 | 5 in tutti gli otto round | 9,70–10,01 s | 20–21 s su 30 |

Con cinque mosse la sequenza usa quasi tutto il budget di D10: chi aspetta la fine per scegliere ha circa due terzi del
clock. La scelta resta libera durante la sequenza (regola 4: carta scelta al primo tocco, clock da 30 a 28 s nei 2,3 s
successivi, entrambe le misure) e si attraversa a tocchi. Per un duello la sequenza dura 3,8–5,9 s. Il dato va a C3-7 e a
un'eventuale A2; nessuna conclusione qui.

### Limiti e residui

- **Plance durante la sequenza:** mostrano il passo raggiunto, quindi per qualche secondo valori precedenti a quelli
  finali; le decisioni usano la vista, e scegliere una carta porta subito al finale. Oggetti, dorsi e mano sul tavolo
  sono quelli della vista finale fin dall'inizio: le animazioni di oggetti e pesca volano verso la loro posizione finale.
- **Mazzo e scarto** non sono disegnati: le carte partono e arrivano ai lati del personaggio. Gli oggetti spariti senza
  una mossa collegata (capienza superata, contese) non si animano; restano nel riepilogo statico.
- **«Si rompe»** indica un oggetto sparito da un altro posto senza ricomparire presso l'autore: il client non distingue
  consumo a distanza e distruzione (nessuna lettura del testo del server).
- **Costo nominale:** con uno stato di risorsa l'importo pagato può differire; in quel caso le righe non tornano e il
  round ripiega sul totale (nessun caso osservato oltre MarvelousCocktail).
- **Morti e forfait** sono timbrati in coda, non nel momento in cui avvengono (il server non pubblica il momento).
- Oggetto scomparso prima della risoluzione non capitato a 844×390 (visto a 1366×768 e in unità).
- Dispositivo fisico, iPhone, prova umana del ritmo e scheda nascosta reale non provati (headless emula la visibilità).
- Dati locali non toccati: tutte le prove su database temporanei; `VerifyResolution` a 844×390 ha usato un server
  temporaneo su 18080 con un'anteprima su 4321, in parallelo all'esecuzione a 1366×768.
- Evidenze: [resolution-1366x768.json](client-c3/c3-4/resolution-1366x768.json),
  [resolution-844x390.json](client-c3/c3-4/resolution-844x390.json), [catture](client-c3/c3-4/screens/)
  `resolution-*-sequence-costs|card|tail-*` (passaggi di una sequenza) e `resolution-humans-*`; regressione
  `verify-*`, `modes-*`, `lifecycle-*`, `ffa-*`, `decks-*` e [size.json](client-c3/c3-4/size.json) nella stessa cartella
  (catture solo per `VerifyResolution` e `Verify`).

## C3-4 — Revisione dopo la prova del proprietario

30 ottobre 2026. Il proprietario ha provato C3-4 e ha osservato che, quando un personaggio gioca una carta, **prima
si animano le sue risorse e poi la carta**. Decisione D13 (piano C3 aggiornato), con D10 rivista a un **tetto di
20 s** per round; il clock della mossa resta 30 s (regolamento 1.9). Nessun cambio a regolamento, server,
protocollo, catalogo o `client-debug`. Il riepilogo statico piccolo con lettere non è in questa revisione (C3-6).

**D13, per ogni carta del round, sempre (duello contro computer compreso):** costo → primo piano di chi gioca →
ritorno al posto → volo e impatto → primo piano del bersaglio → variazioni. Il tocco o tasto sul tavolo passa al
passo successivo (D12), una carta della mano e «Salta effetti» chiudono; nessun blocco di invio né del clock.
Una sequenza velocizzata attivabile dall'utente è un'osservazione per C4/C5, **non fatta**.

### Causa accertata

Riprodotta prima della modifica, sulla build di HEAD (f75d85a), in quick 1vCom reali su database temporaneo, campionando
ogni ~30 ms i valori delle plance dal momento in cui il nuovo turno è disegnato
([order-before.json](client-c3/c3-4r/order-before.json), tre esecuzioni, 1366×768 e 844×390):

| Round con costi | Prima plancia che cambia | Prima carta compare |
|---|---|---|
| devAlice → LIEVE FASTIDIO, poi computer → Steal | 214 ms: ALERTNESS del computer 35 → 25 (costo di Steal, **seconda** carta) | 650 ms |
| computer → Rabbia Psicotica da Meth, poi devAlice | 282–287 ms: TOXICITY del computer (costo) | 650 ms |
| devAlice → LIEVE FASTIDIO, poi computer → Rabbia Psicotica da Meth | 236 ms: TOXICITY del computer (costo della seconda carta) | 650 ms |

Nei round senza costi la prima variazione arrivava solo all'impatto (circa 1,03 s), dopo la carta. **Causa nel codice:** la
fase 1 di `timeline`/`pace` (C3-4) metteva i costi di **tutti** gli autori in un unico passo iniziale di 650 ms
(`PACE.costs`), e `beginSequence` in `src/scene.ts` vi faceva salire i gettoni e cambiare le barre del costo
(`T.costSteps`, dal 45% della fase) prima della prima calata. Le righe `SELF` non c'entrano: si applicavano già al colpo.

### Esito in breve

| Livello | Stato |
|---|---|
| Regia pura (`src/resolution.ts`) | `pace(carte, fasi)` dà a ogni carta sei passi consecutivi, `BEATS`: **costo** 0,4 s (solo se c'è da pagare: gettoni o scarto della bound), **primo piano di chi gioca** 0,9 s (crescita nel primo 25%), **ritorno** 0,3 s, **volo e impatto** 0,65 s (colpo al 70%), **primo piano del bersaglio** 0,5 s, **variazioni** 0,45 s (solo se la carta ne ha di verificate); poi pesca 0,65 s, fine turno 0,75 s e coda 0,8 s. Oltre il tetto di 20 s (`PACE.budget`) tutto si riduce in proporzione. `nextStop` ferma a ogni passo che mostra qualcosa. `directionProblems` controlla ordine, contiguità, passi obbligatori e tetto: lo usano test e verifica. `timeline` dà a ogni carta i suoi gettoni (`tokens`), le variazioni del costo (`costSteps`) e quelle della carta (`steps`). |
| Costo prima di ogni carta e R04 | Il server paga **tutti** i costi prima di ogni effetto (R04) e la verifica delle righe (`reportSteps`) resta in quell'ordine. Mostrati per carta, i passi conservano la propria variazione e partono dal valore mostrato, quindi finiscono sempre sulla vista. Quando un autore successivo paga con una risorsa cambiata da una carta precedente, il valore di partenza mostrato differisce da quello del server: `drift` lo conta. È una scelta di presentazione di D13, non una regola. |
| Primi piani (`src/readability.ts`) | `closeUp`: copia del personaggio ingrandita con la carta giocata accanto, nella parte libera del tavolo, dentro lo schermo e senza toccare personaggio, plancia, oggetti e mano coperta degli altri posti né la mano propria. Vince la scala più grande (fino a 1,6) con un posto vicino al centro; se nessun posto esiste anche a 1,15, il personaggio cresce nel suo posto. `targetUp`: il bersaglio a 1,25 nel suo posto, sotto la carta che lo ha colpito. |
| Scena (`src/scene.ts`) | `beginSequence` disegna la regia carta per carta. Registra quando ogni passo inizia (`stats.schedule`), dove va ogni primo piano (`stats.closeUps`) e i conteggi, con `closeUps`, `targetUps` e `drift` (`stats.beats`). Le decisioni usano sempre la vista finale (regola 2); movimento ridotto: nessuna sequenza, riepilogo statico (regola 5). |
| Test automatici | Client **161** (154 + 7). Regia: ordine e tetto per 1–5 e 8 carte con ogni combinazione di passi; duello sotto 10 s; FFA a cinque con primi piani nelle durate proposte; fermate dei tocchi; controllo d'ordine che riconosce piani sbagliati. Ogni round registrato con costi e righe della propria carta, finale uguale alla vista; caso sintetico con `drift` che finisce comunque sulla vista. Primi piani dentro lo schermo, senza coprire altri posti né la mano, in duello e FFA alle due misure. **Cambio deliberato:** i due test del ritmo di C3-2/C3-4, con i costi di tutti gli autori per primi e il budget di 10 s, sono sostituiti da quelli di D13. |
| Server reale | **Sì.** `VerifyResolution` estesa, verde a 1366×768 e 844×390 (dettagli sotto). |
| Regressione | Sulla build finale, ogni strumento su un server nuovo con database temporaneo: `Verify`, `VerifyModes`, `VerifyLifecycle`, `VerifyFfa` e `VerifyDecks` verdi a 1366×768 e 844×390. `build.ps1 -Task Test -Offline` (254 server, 36 debug) e `check-rules.py` passano. `VerifyPublic`, `VerifyProfile` e `VerifyAim` non ripetute: home, profilo e mira non cambiano. |
| Peso | JS gzip 318870 byte (+1498 rispetto a C3-4), totale gzip 1101815 byte ([size.json](client-c3/c3-4r/size.json)). Budget rispettato. |
| Emulazione / dispositivo / umano | Edge via Playwright sul PC, due misure landscape; nessun dispositivo fisico, iPhone o prova umana del ritmo. |

### Cosa controlla in più `VerifyResolution`

A ogni sequenza, oltre ai controlli di C3-1…C3-4:

- **Ordine D13 per ogni carta**, su ciò che la scena ha programmato (`stats.schedule`):
  - ogni passo all'ora del piano;
  - gettoni ≤ primo piano < ritorno < volo < colpo < primo piano del bersaglio ≤ variazioni;
  - variazioni del costo dentro il passo costo della propria carta, mai prima che la carta inizi;
  - variazioni della carta mai prima del primo piano del bersaglio.
- **Piano corretto:** il piano della scena è identico a quello ricalcolato sulle viste del socket, `directionProblems` è vuoto e il piano resta entro 20 s.
- **Un primo piano dell'autore e uno del bersaglio per carta.**
- **Geometria dei primi piani:**
  - dentro lo schermo;
  - quello dell'autore senza sovrapporsi ai riquadri degli altri posti, come erano disposti all'inizio della sequenza;
  - quello del bersaglio senza coprire gli altri personaggi.
- **Clock fra umani:** sotto 10 s residui viene segnalato in `under10s` come dato per A2, senza far fallire la verifica.
- **Tocchi:** attraversano un round passo dopo passo fino alla chiusura con motivo `input`.

### Scenari reali (entrambe le misure)

Esecuzioni finali: [1366×768](client-c3/c3-4r/resolution-1366x768.json) e
[844×390](client-c3/c3-4r/resolution-844x390.json) (campi `scene.*.rounds`, `scene.*.closeUps`, `scene.humans.clock`,
`cases`, `reportConsistency`).

| Partita | 1366×768 | 844×390 |
|---|---|---|
| Quick 1vCom con caduta e rientro | 9 round, tutti completi in 7,05–8,61 s; 8 per carta, 1 totale | 14 round, completi in 7,16–8,61 s; 14 per carta |
| FFA con quattro computer | 7 round con cinque mosse, completi in 15,15–18,20 s; 6 per carta, 1 totale | 14 round con 3–5 mosse, completi in 11,00–18,20 s (cinque mosse: 17,8–18,2 s); 14 per carta |
| FFA con devBob, forfait per tempo (salto) | turno 0 chiuso dal tocco della regola 4; poi salto senza sequenza, «Risolti 21 turni…» | uguale |
| **FFA fra umani** (`humans`) | 8 round con cinque mosse, completi in 16,05–18,21 s; 8 per carta | 8 round (6 con cinque mosse, 2 con quattro), completi in 14,15–18,21 s; 7 per carta, 1 totale |
| Open «C3 contrasti» / «C3 furti» | 12 e 18 round, completi in 7,00–8,60 s; 11 e 18 per carta | 21 e 5 round (in «C3 furti» devAlice resta senza mosse valide, limite R03 noto, e abbandona), completi in 6,35–8,61 s; tutti per carta |
| Carte animate · primi piani dell'autore al centro (`placed: middle`) · nel posto | 158 · 158 · 0 | 187 · 187 · 0 |
| Scala del primo piano dell'autore | 1,15–1,60 | 1,15–1,60 |
| Ordine D13, piano e geometria violati | **0** | **0** |
| Conteggi della scena diversi dai fatti / plance diverse dalla vista a fine sequenza | **0** / **0** | **0** / **0** |
| Passi con partenza mostrata diversa dal server (`drift`), sempre finiti sulla vista | 4 (FFA 2, «C3 furti» 2) | 4 («C3 contrasti» 2, «C3 furti» 2) |
| Regole 1, 2, 3, 6 e controlli di C3-2 e C3-4 | rispettate | rispettate |
| Interruzioni | «Salta effetti» `skip` dopo 138 ms; 14 tocchi attraversano un round di due carte fino a `input` (7,5 s); carta scelta subito; scheda nascosta (emulata): nessuna sequenza al ritorno | `skip` dopo 135 ms; 13 tocchi fino a `input`; come a sinistra |
| Movimento ridotto emulato | tre round, zero sequenze, riepilogo statico del round presente | uguale |

Tutti i round con barre totali hanno la causa già nota di D1: 20 di HEALTH tolti dal timer di MarvelousCocktail
(Mescolone Micidiale), che il server riporta senza numeri. Gli scenari di C3-4 sono di nuovo tutti visti su partite
reali, alle due misure: annullamento, oggetto consumato e rubato, oggetto scomparso prima della risoluzione, morte
con mossa già presentata, fine turno letale, bound con scarto, oggetto pescato sul tavolo, salto e rientro.

### Durata e clock fra umani (dato per A2)

Scenario `humans`, FFA con devAlice, devBob e tre computer. Otto round per misura; ogni umano lascia finire la
sequenza e il clock della mossa (30 s) viene letto alla fine.

| Misura | Mosse per round | Sequenza | Clock residuo a fine sequenza |
|---|---|---|---|
| 1366×768 | 5 in tutti gli otto round | 16,05–18,21 s | **12–15 s** su 30, per entrambi gli umani |
| 844×390 | 5 in sei round, 4 in due | 14,15–18,21 s | **12–16 s** su 30 |

**Nessun round fra umani lascia meno di 10 s** (`under10s` vuoto alle due misure), quindi nessun segnale per A2 da questo dato.
Il margine è però stretto: una sequenza con cinque mosse occupa da 16 a 18 dei 30 s. **Il tetto basta per cinque mosse:**
sulla carta 18,2 s con tutti i passi e tutte le fasi, misurati al massimo 18,21 s. Oltre il tetto, con sei o più carte che è
impossibile al tavolo da cinque, le durate si ridurrebbero in proporzione. Il duello dura 6,4–8,6 s (prima 3,8–5,9). La regola 4
resta: carta scelta al primo tocco durante la sequenza, clock da 30 a 28 s nei 2 s successivi, alle due misure.

### Limiti e residui

- **Primo piano piccolo in alcuni posti:** nel duello a 1366×768 il proprio personaggio arriva solo a 1,15. Il centro libero
  è stretto fra la mano e il posto avversario, e il posto più vicino al centro prevale su una scala maggiore. Lo stesso
  vale nella FFA a 844×390 per i posti laterali, a 1,15–1,2. Va giudicato nella prova del proprietario; scala e
  preferenza per il centro sono parametri di `closeUp`.
- **Valori intermedi (drift):** 8 passi su quasi mille (985) partono da un valore mostrato diverso da quello del server. Il
  finale è sempre la vista. È il prezzo di mostrare ogni costo prima della propria carta (D13) mentre il server li paga
  tutti prima (R04).
- **Rapporto dei rilanci:**
  - la prima esecuzione a 844×390, in parallelo con l'avvio delle regressioni, ha chiuso un round di «C3 furti» in 8553 ms
    contro 8200 previsti, oltre la tolleranza di 250 ms di C3-2: probabile carico della macchina, con l'ordine D13 verde;
  - la seconda ha trovato un difetto dello strumento: il clock veniva letto anche per un umano già fuori partita, dove
    non c'è (`NaN`). Lo strumento ora misura solo i round della propria sequenza con un clock leggibile;
  - la terza, da sola, è quella registrata. L'esecuzione a 1366×768 è precedente a questa correzione, che riguarda solo
    quel filtro, ed era verde.
- Dispositivo fisico, iPhone, prova umana del ritmo e scheda nascosta reale non provati: Edge headless emula la visibilità.
- Dati locali non toccati: tutte le prove su database temporanei.
- Evidenze in [client-c3/c3-4r](client-c3/c3-4r/):
  - riproduzione [order-before.json](client-c3/c3-4r/order-before.json);
  - `resolution-*`, con le catture `resolution-*-sequence-cost|author|flight|target|changes|tail-*` (i passi di una carta);
  - regressione `verify-*`, `modes-*`, `lifecycle-*`, `ffa-*`, `decks-*` e [size.json](client-c3/c3-4r/size.json), con catture
    solo per `VerifyResolution` e `Verify`.

## C3-L — Scala e uso dello spazio del tavolo

30 ottobre 2026. Blocco nuovo fra C3-4r e C3-6, dal feedback del proprietario dello stesso giorno: (1) il centro
del tavolo è quasi sempre vuoto; (2) risorse, personaggi e oggetti di tutti sono ancora un po' piccoli; (3) il proprio
personaggio è grande quanto gli altri. Geometria, non arte: sfondo, cornici, simboli e texture restano a C4. Nessun
cambio a regolamento, server, protocollo, catalogo o `client-debug`.

### Stato di partenza misurato

Build di HEAD (836ce39), partite reali su database temporaneo (quick 1vCom e FFA con quattro computer, turni 0–2),
Edge via Playwright; la nuova verifica `VerifyLayout` con `BM_OUT=…/before` legge scena e shell HTML. Evidenze:
[duello](client-c3/c3-l/before/), [FFA](client-c3/c3-l/before-ffa/).

| CSS px | 1366×768 duello | 1366×768 FFA5 | 844×390 duello | 844×390 FFA5 |
|---|---|---|---|---|
| Personaggio proprio | 150×207 | 117×161 | 80×110 | 60×83 |
| Altri personaggi | 150×207 (uguale) | 117×161 | 80×110 | 60×83 |
| Oggetti | 114×157 | 89×123 | 61×84 | 46×63 |
| Plancia propria / riga di una risorsa | 170×150 / 30 | 170×150 / 30 | 110×92 / 18,4 | 110×92 / 18,4 |
| Plancia altrui (carattere) | 150×58 (14 px) | 120×58 (14 px) | 100×40 (10 px) | 84×40 (10 px) |
| Mano: carta / passo | 214×295 / 133 | 214×295 / 120 | 120×166 / 72 | 120×166 / 71 |
| Centro libero (36%×30% dello schermo al centro) | 78–80% | 87–91% | 65–82% | 70–86% |
| Bersagli sotto 44 px | gettoni di stato 41×24 | 41×24 | 31×18 | 31×18, 17×18 |
| Sovrapposizioni | nessuna | nessuna | nessuna | plancia in alto a sinistra sulla scritta decorativa |

Rispetto al minimo di C4 (44 px dove si tocca): personaggi, oggetti e carte della mano erano già sopra la soglia, i
gettoni di stato no. **Trovato in più:** a 750×292 (minimo iPhone) la disposizione di allora già si sovrapponeva
(duello: posto proprio sul posto avversario e sulla mano; FFA: un posto fuori schermo, nessun posto per i primi piani):
le dimensioni compatte sono fisse e la mano occupa 166 px su 292.

### Proposta e scelte del proprietario (D14)

Prima di implementare: tre insiemi di fattori misurati con un prototipo della geometria sugli stessi controlli dei
test, con schemi sullo sfondo vero del tavolo ([1366×768](client-c3/c3-l/proposal/options-1366x768.jpg),
[844×390](client-c3/c3-l/proposal/options-844x390.jpg)). Scelte: **B2** (proprio ×1,5, altri ×1,2, oggetti ×1, risorse
×1,25), priorità **personaggio proprio, risorse, altri, oggetti**, 750×292 solo registrato per C4. Per il centro il
proprietario ha scelto prima **mazzo e scarti propri**, ogni giocatore con la sua pila degli scarti; viste le catture
della prima versione ha **cambiato in corsa**: al centro le **carte giocate nell'ultimo round**, impilate in ordine di
risoluzione con le prime sotto, a **cascata leggera**; **mazzo e scarti propri piccoli accanto al proprio posto**.

### Esito in breve

| Livello | Stato |
|---|---|
| Geometria pura (`src/readability.ts`) | `SCALE` e `YIELD` (ordine di cessione: oggetti, altri, risorse, proprio); `arrange` (disposizione a fattori dati); `layoutProblems`: tutto nello schermo; nessun posto su un altro, su una mano coperta, sulla mano, sul suggerimento, sui controlli in alto, sulle carte del round o sulle pile; passo della mano ≥ 44 px; un posto libero per ogni primo piano D13; primi piani dei bersagli che non coprono altri personaggi; frecce di C3-3 lontane da ✓ e ×. `fitScale` (una volta per misura e numero di posti, con tre oggetti per posto) e `tableLayout` che li compone. Nuovi `played` (cascata, un posto per giocatore, colonna degli autori), `piles`, `shellBoxes`, `freeSpot`, `tableBoxes`, `closeUpRange`, `targetOf`, `discardTop` (R02). |
| Fattori ottenuti | 1366×768: duello proprio ×1,5, altri ×1,2, risorse ×1,25; FFA proprio ×1,5, altri ×1, risorse ×1,25. 844×390: duello proprio ×1,5, altri ×1, risorse ×1,1; FFA proprio ×1,5, altri ×1, risorse ×1,05. Oggetti ×1 ovunque (B2). |
| Scena (`src/scene.ts`) | Disegna la cascata delle carte del round (`roundCards`) e le pile (`piles`). In sequenza ogni carta, dopo le sue variazioni, si posa nel suo posto della cascata (`land`), che intanto mostra solo le carte già posate. Pescate e scarti delle bound propri partono e arrivano alle pile. Plance con caratteri e colonne proporzionali; sulle plance altrui il nome ha la prima riga intera e la salute sta accanto alla barra. Primi piani con `closeUpRange` e `targetOf`; evitano cascata e pile salvo crescere di più o avvicinarsi al centro. In FFA le due pile stanno una sopra l'altra a destra del proprio personaggio (affiancate spingevano la mano). `table.tsx` espone `deckCount` e `lastMoves` per la verifica e, con una carta scelta, toglie la (i) della carta alzata quando cadrebbe su un personaggio o un oggetto del tavolo, così un clic lì mira (trovato da `VerifyFfa` K7 a 844×390, dove la carta alzata copre un oggetto avversario). |
| Duello | Oggetti propri in una riga sopra il proprio posto (con le pile su desktop) per lasciare il centro alla cascata; avversario a 0,64 della larghezza su desktop, a 0,56 in compatto (più a destra la freccia verso di lui attraversa la conferma). |
| Test automatici | Client **168** (161 + 7). Nuovi: fattori ottenuti alle due misure in duello e FFA; nessun problema di disposizione con 0–3 oggetti per posto; proprio almeno ×1,24 degli altri; personaggi e oggetti ≥ 44 px; cascata al centro con la striscia di ogni titolo visibile; pile presso il proprio posto; ordine di cessione e massimalità dei fattori; 750×292 ancora fuori (avvisa quando cambia); `discardTop` sui casi di R02. **Cambio deliberato:** i test dei primi piani di C3-4r usano `closeUpRange` e `targetOf` (il proprio, già il più grande, può restare a scala 1; come bersaglio cresce di 1,1). |
| Server reale | **Sì.** `VerifyLayout` nuova (`run.ps1 -Task VerifyLayout`), verde a 1366×768 e 844×390. |
| Regressione | Sulla build finale, a 1366×768 e 844×390: `Verify`, `VerifyModes`, `VerifyResolution`, `VerifyAim`, `VerifyLifecycle`, `VerifyFfa` (K7 mouse e tocco eseguiti), `VerifyDecks`, `VerifyLayout` tutte verdi. `Test` e `Build` del client verdi (168 test). `./scripts/build.ps1 -Task Test -Offline` verde (server 254, `client-debug` 36); `python scripts/check-rules.py` verde. |
| Peso | JS gzip 321781 byte (+2911 rispetto a C3-4r), totale gzip 1104726 byte ([size.json](client-c3/c3-l/size.json)). Budget rispettato. |
| Emulazione / dispositivo / umano | Edge via Playwright sul PC, due misure landscape; nessun dispositivo fisico, iPhone o prova umana. |

### Misure dopo C3-L (partite reali)

[1366×768](client-c3/c3-l/layout-1366x768.json), [844×390](client-c3/c3-l/layout-844x390.json), catture in
[screens](client-c3/c3-l/screens/) (`layout-*-T*` a turno fermo, `layout-*-closeup-*` durante la sequenza).

| CSS px | 1366×768 duello | 1366×768 FFA5 | 844×390 duello | 844×390 FFA5 |
|---|---|---|---|---|
| Personaggio proprio | **225×310** (prima 150×207) | **175×242** (117×161) | **120×166** (80×110) | **90×124** (60×83) |
| Altri personaggi | **180×248** (150×207) | 117×161 | 80×110 | 60×83 |
| Oggetti | 114×157 | 89×123 | 61×84 | 46×63 |
| Plancia propria / riga | **213×188 / 37,5** | **213×188 / 37,5** | **121×101 / 20,2** | **116×97 / 19,3** |
| Plancia altrui | **188×73** | **150×73** | **110×44** | **88×42** |
| Carte del round (una carta) | 150×207 | 82×113 | 40×55 | 36×50 |
| Pile proprie (una carta) | 40×55 | 40×55 | 26×36 | 26×36 |
| Mano: carta / passo | 214×295 / 114 | 214×295 / 98 | 120×166 / 72 | 120×166 / 66 |
| Bersagli sotto 44 px | gettoni 49×29 | gettoni 41×24, 61×36 | gettoni 31×18 | gettoni 31×18, 46×27 |
| Sovrapposizioni | nessuna | nessuna | nessuna | come prima: plancia sulla scritta decorativa |
| Primi piani D13 (numero, posto, scala) | 4, al centro, 1,0–1,6 | 10, al centro, 1,0–1,6 | 4, al centro, 1,0–1,6 | 10, al centro, 1,0–1,55 |
| Frame dalla scelta alla fine della sequenza (criterio C0) | p95 8,4–8,5 ms, 99,8% entro 20 ms, max 56 ms | p95 8,5 ms, 99,5% entro 20 ms, max 115 ms | p95 8,5 ms, 100% entro 33 ms, max 30 ms | p95 8,5–8,6 ms, 100% entro 33 ms, max 70 ms |
| Input → frame, massimo | 21 ms | 36 ms | 29 ms | 22 ms |

Il centro (riquadro 36%×30% dello schermo) ora è libero solo per il 49–64% (prima 65–91%): ci stanno la cascata,
i personaggi più grandi e, nel duello, l'avversario più grande.

### Limiti e residui

- **Gli altri personaggi crescono solo nel duello desktop (×1,2).** In FFA, a 844×390 due file di avversari con le
  mani coperte sopra e la mano in basso lasciano circa 175 px per due personaggi; a 1366×768, già con gli altri a
  ×1,05, i primi piani dei bersagli centrali coprirebbero i vicini. Nel duello compatto la freccia verso l'oggetto
  avversario e i primi piani fermano gli altri a ×1. Le risorse altrui crescono comunque (×1,05–1,25).
- **Carte del round piccole a 844×390** (40×55 nel duello, 36×50 in FFA; con tre oggetti per posto la FFA scende a 30×41): il titolo è al limite, l'autore si legge
  nella colonna accanto. Per i dettagli resta «Ultimo turno»; un tocco per ispezionarle è un'idea per C3-6 o C4.
- **Primo piano proprio a scala 1:** il personaggio proprio, già il più grande, non trova al centro un posto più
  grande di sé; il primo piano porta la carta accanto e si sposta verso il centro quando c'è posto.
- **Frame:** qualche intervallo isolato fino a 115 ms su desktop FFA (122 ms in un giro precedente) durante la sequenza (ridisegno di cascata e
  testi a ogni passo), sempre oltre il 99% entro soglia. Non misurato su dispositivo fisico.
- **`fitScale`** costa fino a circa 150 ms la prima volta per una misura e un numero di posti (FFA desktop), poi resta
  in memoria: si paga a ogni ridimensionamento verso una misura nuova.
- **750×292** non entra, come prima: registrato in roadmap per C4, con un test che avvisa quando cambia.
- **Frecce verso l'oggetto avversario con 1–2 oggetti a 844×390:** già prima di C3-L attraversavano il riquadro
  intero della conferma (non i pulsanti ✓ e ×, che la scena evita). Il controllo di C3-3 resta con tre oggetti per
  posto; il nuovo controllo per 0–3 oggetti usa i pulsanti, come `VerifyAim`.
- **Scritta decorativa:** in FFA a 844×390 la plancia in alto a sinistra copre «BOTTE MICIDIALI», come prima.
- Dati locali non toccati: tutte le prove su database temporanei.

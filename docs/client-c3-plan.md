# Piano C3 — Rendere leggibile e soddisfacente la risoluzione

29 ottobre 2026. Regolamento **1.8** (1.9 dopo [A1](#attività-separate)), [roadmap del client](client-roadmap.md)
versione 24. **Solo piano:** nessun codice client, nessuna modifica a regole,
server, protocollo, catalogo o `client-debug`. C0, C1 e C2 sono chiuse; C3 parte
su istruzione del proprietario, **un blocco alla volta**. Stato corrente
nell'[indice della documentazione](README.md#stato-corrente).

**Decisioni D1–D11 confermate dal proprietario il 29 ottobre 2026**, D10 con una
durata più lunga della proposta: fino a 5 s per round. Le modifiche di regole e
catalogo (A1, eventualmente A2) sono attività separate che partono dal regolamento.

Fonti lette: [istruzioni](../AGENTS.md), [indice](README.md), [roadmap](client-roadmap.md)
(C3, O6, O7, «Contratti disponibili e lacune», «Decisioni ancora aperte»),
[piano C2b](history/client-c2b-plan.md) come modello, [regolamento](game-rules.md)
(R03–R06, R07a, R08), [rapporto C2](reports/client-c2-report.md), i sorgenti di
`client-web` (`scene.ts`, `model.ts`, `table.tsx`, `readability.ts`, `session.ts`,
`contracts.ts`, `lifecycle.ts`) e quelli del server che producono la vista
(`Game.resolveMoves`, `Move`, `Character.editResource` e `resolveTimeBasedEffects`,
`ClientGameView`).

## Obiettivo e regole comuni

**Risultato di C3:** il round si capisce guardando il tavolo. Movimento ed
enfasi sono coerenti con ciò che il server ha davvero pubblicato e non rallentano
le decisioni. Il server resta l'unico giudice: il client non calcola effetti, non
interpreta le frasi del server e non ricostruisce i passaggi che non conosce.

Valgono per **ogni** blocco, come in C2b:

- **Un blocco = una sessione = un commit**, in ordine, solo dopo l'istruzione del
  proprietario. Un blocco non si chiude con i soli test unitari.
- **Partite reali** sul server locale avviato dalla verifica su un **database
  temporaneo** (come `VerifyLifecycle`), guidate da Edge/Playwright a **1366×768 e
  844×390**. Scene sintetiche, fixture e trasporti finti servono ai test unitari ma
  non valgono come partita reale.
- Verifiche: `./client-web/run.ps1 -Task Test`, `Build`, `Size` (JS ≤ 500 KB gzip,
  totale ≤ 4 MB gzip, atlante ≤ 2048 px, texture ≤ 64 MB), le verifiche del blocco e
  quelle di AGENTS: `./scripts/build.ps1 -Task Test -Offline` e
  `python scripts/check-rules.py`. Il server non cambia in C3: il contesto Spring
  non serve. Se A1 lo tocca, va verificato a parte in quell'attività.
- Regressione: `Verify` (quick 1vCom) resta verde a ogni blocco; le altre verifiche
  (`VerifyModes`, `VerifyLifecycle`, `VerifyFfa`, `VerifyDecks`, `VerifyPublic`,
  `VerifyProfile`) quando il blocco tocca il loro percorso, e tutte in C3-7.
- Documenti nello stesso commit: `client-web/README.md`, una sezione «C3-n» nel
  rapporto C3 (`docs/reports/client-c3-report.md`, creato in C3-1), la revisione
  della roadmap, le righe P della [checklist](client-c0-parity.md) toccate
  (P30, P31, P36). Evidenze in `docs/reports/client-c3/c3-n/`.
- Testi nuovi in italiano; identificatori wire, nomi carta e testo del server invariati.
- La FFA conserva quattro mani avversarie coperte e gli oggetti come carte presso le
  postazioni; nessun pannello testuale al posto del tavolo.

## Cosa arriva oggi dal server

Osservazione del 29 ottobre 2026 sul server reale (jar corrente, profilo
`local`, account sintetici, **database temporaneo**; dati locali non toccati).
Script Node con il `Client` della [CLI](cli.md) e Playwright con la build corrente;
gli script restano fuori dal repository (lo strumento di verifica ufficiale nasce
in C3-1). Evidenze: [osservazione delle viste](reports/client-c3/c3-plan/observation.json)
(quick 1vCom di 18 turni con caduta e rientro; FFA con due umani e tre computer),
[client a 1366×768](reports/client-c3/c3-plan/probe-1366x768.json) e
[a 844×390](reports/client-c3/c3-plan/probe-844x390.json).

| Dato | Cosa contiene (verificato) | Cosa **non** contiene |
|---|---|---|
| `resolvedMoves` | Le mosse del round **già nell'ordine di risoluzione** (R04: priorità, poi ALERTNESS dopo i costi, poi inserimento): autore, nome carta, bersaglio (`SELF` o id), `choices` (`DISCARD_ONE`, `TARGET_ITEM`; i computer mandano `{}` invece di `null`). `void: true` per le mosse annullate durante il round, che hanno comunque pagato. | Le mosse vuote rimosse prima dei costi (morti, computer che passano). Quale mossa ha annullato quella `void`. Il momento delle morti dentro il round. |
| `moveReport` | Testo inglese prodotto dalle carte, con chiavi `SELF`/`OPPONENT` (per una mossa su sé, `OPPONENT` è ancora chi gioca). Le variazioni di risorsa hanno la forma regolare `RISORSA: prima->dopo (delta)`, da un solo metodo del server; il resto è testo libero («Countered Target's own Move», «Grabbed and consumed Item …», «Didn't do anything!»). | **I costi pagati.** **Il tipo di danno** (colpo, taglio e veleno producono tutti `HEALTH: a->b`). Gli oggetti pescati che finiscono sul tavolo. Le frasi non sono un contratto e non hanno un ordine garantito fra `SELF` e `OPPONENT`. |
| `timeBasedEffects` | Per ogni giocatore **vivo**, righe testuali di fine turno: veleno da TOXICITY, alcol, stati scaduti. | I giocatori eliminati. L'effetto dei timer: il server scrive solo «Timer expired for … effect triggered» (TODO nel codice). |
| Vista finale | Risorse, oggetti, stati, timer, immunità, morti, forfait, esito; mano propria completa e conteggi di mano e mazzo altrui. | Una revisione monotona o un id di evento: solo `gameId` e `turn`. |
| Differenza fra viste consecutive | Variazione **complessiva** del round per posto: costi, effetti e fine turno insieme. Oggetti spariti e comparsi per posto (un oggetto pescato va sul tavolo e il mazzo cala di due). Carta giocata uscita dalla propria mano e carte pescate. | L'attribuzione di una variazione a una mossa: costi, effetti di più mosse e fine turno si sommano. |
| Viste ripetute | **Due viste per round** (una per il segnale `update`, una per `move`), identiche per giocatori e risoluzione; nello stesso turno cambia solo la `pendingMove`. Il rientro dopo una caduta restituisce la stessa risoluzione già vista. | — |
| Round saltati | Con soli computer ancora in gioco il server risolve i round **a catena**. Osservato: devAlice e devBob in forfait per tempo scaduto, tre computer, vista passata **dal turno 1 al 26** con un solo segnale `update` e la sola risoluzione dell'ultimo round. Dal codice (`Game.isEliminated` comprende morti e forfait) lo stesso vale per chi guarda da morto quando restano solo computer. Un umano ancora in gioco non salta round, perché il round aspetta la sua mossa. | I 24 round intermedi. |

**Attribuibile con certezza:** ordine delle mosse, autore, carta, bersaglio, oggetto
scelto, annullamento, costo **nominale** dal catalogo (l'importo pagato può differire
se uno stato di risorsa si applica, R05), chi ha effetti di fine turno, variazione
complessiva del round per posto e per risorsa, oggetti spariti o comparsi, propria
carta giocata e pescata, morti, forfait, esito. **Non attribuibile:** quanto ha tolto
ciascuna mossa, il tipo di danno, quale contrasto ha annullato quale mossa, chi ha
preso un oggetto sparito senza una `TARGET_ITEM` coincidente, il contenuto degli
effetti dei timer, le carte pescate dagli avversari oltre al conteggio.

### Difetti del client attuale

| # | Dove | Problema verificato | Blocco |
|---|---|---|---|
| K1 | `scene.ts`, sottoscrizione al modello | Ogni vista chiama `interrupt('view')` e quindi `stopEffects()`. La seconda vista identica dello stesso round **annulla la sequenza appena partita**: misurati 9–21 ms di durata contro 1200 nominali, 12 round su 12 a 1366×768 e 10 su 10 a 844×390, motivo `view`. Oggi la risoluzione in pratica non si anima. | C3-2 |
| K2 | `scene.ts`, `beginSequence(previous)` | Nessun controllo di contiguità: dopo un salto di turni anima l'ultimo round e scrive «totale turno» su una differenza che copre più round. Lo stesso per i trasferimenti di oggetti. | C3-1, C3-2 |
| K3 | `scene.ts`, `beginSequence` | Con movimento ridotto, scheda nascosta o contesto grafico perso esce subito: le variazioni non si vedono da nessuna parte. | C3-2 |
| K4 | `scene.ts`, `stopEffects` | «Salta effetti» e qualunque tocco sul tavolo cancellano anche le variazioni: l'informazione si perde con l'animazione. | C3-2 |
| K5 | `table.tsx`, riepilogo breve | Il riepilogo sparisce dopo 6 s anche a scheda nascosta: al ritorno resta solo «Ultimo turno» nel menu. In FFA copre i posti in alto (limite noto di P31). | C3-2, C3-6 |
| K6 | `scene.ts` | Solo HEALTH ha una variazione; oggetti trasferiti solo se uno sparisce da un posto e compare in un altro; nessun costo, pesca, annullamento o fine turno nella scena. | C3-4 |

Comportamenti già corretti da conservare: una risoluzione è identificata da
`gameId/turn` e non si rianima su rientro, ricarica o vista ripetuta; il nuovo
modello azzera l'identificativo; nessun reinvio dopo il rientro.

## Parità e lacune rispetto ai criteri di C3

Stato in `client-web` oggi: **c'è**, **parziale** (presente ma difettoso o
incompleto), **manca**.

| Bisogno (roadmap C3) | Oggi | Fonte certa | Blocco |
|---|---|---|---|
| Bersagli ammessi durante la scelta (O6) | parziale: contorni per categoria | `canTarget` della carta, vista | C3-3 |
| Carta confermata e mossa ricevuta | c'è: anteprima, ✓, «Mossa ricevuta · In attesa» | `pendingMove` | regressione |
| Costo pagato | manca nella risoluzione | costo nominale del catalogo per nome | C3-4 |
| Calata, autore e bersaglio in ordine | parziale: voli tagliati da K1 | `resolvedMoves` | C3-2, C3-4 |
| Annullamento | parziale: «(annullata)» nel testo | `void` | C3-4, C3-5 |
| Variazioni di risorse | parziale: solo HEALTH, tagliata, sbagliata dopo un salto | differenza fra viste contigue | C3-1, C3-2, C3-4 |
| Oggetti consumati, rubati, distrutti, comparsi | parziale: solo trasferimento uno a uno | oggetti per posto + `TARGET_ITEM` | C3-4 |
| Scarto e pesca osservabili | manca | propria mano, `DISCARD_ONE`, conteggi altrui | C3-4 |
| Effetti di fine turno | parziale: solo conteggio e testo | `timeBasedEffects` (chi), testo | C3-4 |
| Effetti per tipo di danno (O7) | manca | campo `damage` della carta (A1, regolamento 1.9) | C3-5 |
| Morte, forfait ed esito | c'è come pannello; nessuna enfasi nel round | `dead`, `forfeits`, `over`, `winner` | C3-4, C3-5 |
| Report dell'ultimo round | c'è: riepilogo di 6 s e «Ultimo turno» con il testo del server | come sopra | C3-6 |
| Viste ripetute e stesso turno | parziale: K1 | `gameId`, `turn` | C3-2 |
| Round saltati | parziale: K2 | salto di `turn` | C3-1, C3-2 |
| Movimento ridotto, salto, background | parziale: K3–K5 | — | C3-2 |
| Rientro | c'è: nessuna rianimazione | `resume` | regressione |

## Regole di non-regressione

Valgono da C3-2 in poi e sono controllate a **ogni round** dalla verifica di C3-1:

1. **Una risoluzione si anima al massimo una volta.** La chiave è `gameId/turn`.
   Viste ripetute dello stesso turno, rientro, ricarica, ritorno dal background,
   resize e cambio di orientamento non la riavviano.
2. **Lo stato finale è la vista server.** A sequenza finita, saltata o interrotta
   la scena mostra esattamente i valori dell'ultima vista: risorse, oggetti, mano,
   conteggi, stati, morti, forfait, esito. Le decisioni del giocatore (O11, mira)
   usano sempre la vista finale, anche durante la sequenza.
3. **Nessuna risoluzione inventata.** Se il turno avanza di più di uno, o la vista
   precedente appartiene a un'altra partita o a una connessione precedente al
   salto, nessuna animazione e nessuna variazione (D4). Mai effetti calcolati nel
   client, mai interpretazione delle frasi del server (D1).
4. **Le animazioni non bloccano invio né clock.** La scelta è possibile appena
   arriva la vista; il primo tocco o tasto sul tavolo porta la sequenza allo stato
   finale; il clock HTML continua; nessun Continue.
5. **Movimento ridotto e salto sequenza conservano le informazioni.** Il riepilogo
   statico del round (variazioni per posto, annullate, oggetti, eliminazioni, fine
   turno) appare comunque, e «Ultimo turno» resta consultabile.
6. **La pending dello stesso turno si aggiorna** senza interrompere né riavviare la
   sequenza.
7. **La sequenza non si ferma alla prima eliminazione:** le mosse già presentate si
   risolvono anche dopo la morte dell'autore (R04).
8. **Privacy:** nessun fronte avversario fuori da quanto `resolvedMoves` identifica;
   dorsi dai conteggi.
9. **Durata:** fino a 5 s per round (D10), anche con cinque mosse in FFA; resta
   valida la regola 4, quindi la sequenza non toglie la possibilità di scegliere.

## Blocchi

| Blocco | Contenuto | Dipende da |
|---|---|---|
| C3-1 | Modello puro della risoluzione e strumento di verifica — **fatto** il 29 ottobre 2026 ([rapporto](reports/client-c3-report.md#c3-1--modello-puro-della-risoluzione-e-strumento-di-verifica)) | — |
| C3-2 | Sequenza affidabile: K1–K5 e riepilogo statico — **fatto** il 29 ottobre 2026 ([rapporto](reports/client-c3-report.md#c3-2--sequenza-affidabile)) | C3-1 |
| C3-3 | O6, frecce verso i bersagli ammessi | — |
| C3-4 | Sequenza del round con i soli dati certi | C3-2 |
| C3-5 | Effetti per tipo di danno ed enfasi (O7) | C3-4, A1 |
| C3-6 | Riepilogo e «Ultimo turno» leggibili | C3-2 |
| C3-7 | Consolidamento e giudizio del proprietario | tutti |

C3-3 è indipendente e può andare in qualunque punto; C3-6 può precedere C3-4. Se A1
non è approvata o non è pronta, C3-5 ripiega sugli impatti per ruolo R07a (D2) e lo
dichiara.

### C3-1 — Modello puro della risoluzione e strumento di verifica

**Perimetro.** Nuovo modulo puro `src/resolution.ts`: da vista precedente, vista
nuova, giocatore e catalogo produce i **fatti certi** del round. Contiene: contiguità
(`turn` successivo e stessa partita); mosse in ordine con autore, carta, bersaglio,
oggetto scelto, annullamento e costo nominale; per posto, variazione complessiva di
ogni risorsa, oggetti spariti e comparsi, conteggi di mano e mazzo, morte e forfait;
giocatori con effetti di fine turno; esito. Collega un oggetto sparito a una mossa
solo se la sua `TARGET_ITEM` lo nomina sul posto da cui è sparito. Nessun testo del
server viene letto. Nuovo strumento `tools/verify-resolution.mjs` (task
`VerifyResolution`): avvia il server su un database temporaneo e gioca partite reali.
A ogni round registra le viste arrivate, i fatti del modello e lo stato della scena
esposto da `window.__bm`, e controlla le regole 1–3 e 6. In questo blocco le regole
della scena si limitano a registrare, perché K1 si corregge in C3-2. Dati e partite
come in D8.

**Completamento verificabile.** Test unitari con viste **registrate dal server
reale** (quelle di questa osservazione e nuove), compresi annullamento, oggetto
consumato, oggetto pescato sul tavolo, morte, fine partita, salto di 25 turni e
rientro con la stessa risoluzione. Su partite reali a 1366×768 e 844×390 (quick
1vCom, FFA con computer, open 1vCom con mazzi sintetici) le variazioni del modello,
sommate alla vista precedente, coincidono con la vista nuova a ogni round. Il salto
di turni è riconosciuto come non contiguo. Il rapporto registra K1–K6 come stato di
partenza misurato.

**File toccati.** Nuovi `src/resolution.ts`, `tests/resolution.test.ts`, fixture di
viste registrate, `tools/verify-resolution.mjs`; `package.json`, `run.ps1`;
`src/table.tsx` solo per esporre i fatti in `window.__bm`; nuovo
`docs/reports/client-c3-report.md`; documenti comuni.

**Rischi.** Provocare i casi rari sul server reale senza ganci di test (D8). Le
viste dei computer cambiano a ogni partita: le verifiche controllano proprietà e
non sequenze fisse. Peso trascurabile.

### C3-2 — Sequenza affidabile

**Perimetro.** La scena usa il modello di C3-1. **K1:** una vista dello stesso turno
aggiorna pending, clock e disegno senza interrompere la sequenza; solo nuovo turno,
reset, disconnessione e input sul tavolo la chiudono. **K2:** nessuna sequenza e
nessuna variazione se il round non è contiguo; una riga dice quanti turni sono stati
risolti e rimanda a «Ultimo turno» (D4). **K3–K5:** un **riepilogo statico del
round**, cioè piccoli segni accanto a ogni posto con la variazione complessiva, resta
visibile secondo D6 con movimento ridotto, dopo «Salta effetti», dopo un tocco e al
ritorno dal background; il riepilogo breve non scade mentre la scheda è nascosta. Si
anima lo stesso contenuto di oggi (voli, accenti, variazione di HEALTH), ma fino in
fondo.

**Completamento verificabile (partite reali, entrambe le misure).** In quick 1vCom
e in FFA con computer ogni round completa una sola sequenza senza annullamenti di
motivo `view`, con durata registrata. Con le due viste del round la sequenza parte
una volta. Movimento ridotto emulato: zero sequenze, riepilogo statico presente a
ogni round. «Salta effetti» e un tocco durante la sequenza portano allo stato finale
e lasciano il riepilogo. Scheda nascosta durante un round: al ritorno nessuna
sequenza e riepilogo presente. Rientro dopo «Simula disconnessione»: nessuna
rianimazione. FFA con due umani e tre computer in cui entrambi gli umani vanno in
forfait per tempo, come nell'osservazione: il salto di turni è riconosciuto, senza
sequenza né variazioni. Se in una FFA reale l'umano muore e restano solo computer,
lo stesso vale guardando dopo «Resta a guardare», con la riga dei turni risolti; se
il caso non capita, il percorso si prova in unità e si dichiara. Regola 4:
durante la sequenza una carta si sceglie al primo tocco e il clock continua.

**File toccati.** `src/scene.ts`, `src/model.ts` (contiguità esposta),
`src/table.tsx`, `src/style.css`, test, verifica, documenti comuni.

**Rischi.** Le viste dello stesso turno possono arrivare durante un drag: deve
restare valida l'interruzione del drag (C0-R4) senza chiudere la sequenza nel livello
effetti. Il riepilogo statico nella FFA a 844×390 compete per lo spazio con stati e
ventagli.

### C3-3 — O6: frecce verso i bersagli ammessi

**Perimetro.** Con una carta scelta o trascinata, frecce dalla carta ai bersagli
delle **sole categorie ammesse** (`canTarget`, come i contorni di `Model.allows`),
secondo D3: una freccia per personaggio ammesso e, per le carte che prendono un
oggetto, una per posto che ne ha, con gli oggetti contornati come oggi. Le frecce sono
assistenza visiva e non validazione: il server resta il giudice. Nessuna freccia
quando la scelta è bloccata (pending, eliminato, esito). Con movimento ridotto le
frecce sono statiche, senza pulsazione. La geometria è una funzione pura in
`readability.ts`: ancoraggi, curve, nessuna freccia sopra la conferma ✓/×.

**Completamento verificabile (partite reali, entrambe le misure).** Per ogni carta
scelta il numero e la destinazione delle frecce coincidono con i bersagli ammessi
della vista; zero frecce a scelta bloccata. In FFA a cinque nessuna freccia esce
dallo schermo né copre ✓ o ×. Mira con tocco emulato e con mouse invariata;
riordino e annullamento non inviano comandi.

**File toccati.** `src/scene.ts`, `src/readability.ts`,
`tests/readability.test.ts`, verifica, documenti comuni.

**Rischi.** Densità in FFA a 844×390; ridisegno durante il drag (prestazioni: la
misura di C0 vale per la scena sintetica, va ripresa con le frecce).

### C3-4 — Sequenza del round con i soli dati certi

**Perimetro.** Sequenza nell'ordine di `resolvedMoves`, secondo D1:

1. **Costi:** gettoni del costo nominale lasciano ogni autore, tutti insieme
   (R04: i costi precedono gli effetti), anche per le mosse poi annullate.
2. **Per ogni mossa:** la carta compare scoperta all'autore e si cala sul bersaglio
   (o su sé), con un impatto generico. L'annullata riceve il timbro «annullata» e
   torna allo scarto. Un oggetto scelto e sparito da quel posto si consuma, passa o
   si rompe. Le bound mostrano la carta scartata.
3. **Pesca:** la propria carta giocata va allo scarto e le nuove arrivano dal mazzo;
   gli avversari mostrano un dorso dal mazzo solo se i conteggi lo dicono; un
   oggetto comparso senza mossa collegata arriva dal mazzo al tavolo.
4. **Fine turno:** un accento sui posti con effetti, senza numeri propri.
5. **Variazioni:** barre e numeri vanno dal valore precedente a quello finale per
   ogni risorsa (D5), poi resta il riepilogo statico; morti e forfait ricevono
   l'enfasi.

Le mosse continuano dopo una morte (regola 7). Durata fino a 5 s (D10),
interrompibile.

**Completamento verificabile (partite reali, entrambe le misure).** A ogni round il
numero di calate, timbri, gettoni e oggetti animati coincide con i fatti del modello;
lo stato finale coincide con la vista. Scenari, ciascuno visto almeno una volta in
partita reale con i mazzi sintetici di D8: **annullamento**, **oggetto consumato e
oggetto rubato**, **oggetto scomparso prima della risoluzione** (se non si ottiene,
unità con viste registrate dichiarate come limite), **morte con mossa già inviata**,
**fine turno letale**, bound con scarto, oggetto pescato sul tavolo. FFA a cinque
con cinque mosse entro 5 s. Durata registrata a ogni round e, nelle partite fra umani,
tempo residuo del clock di 30 s alla fine della sequenza (dato per A2). Catture dei
passaggi.

**File toccati.** `src/scene.ts`, `src/resolution.ts` (linea temporale pura),
test, verifica, documenti comuni.

**Rischi.** Una sequenza lunga riduce il tempo di lettura prima del clock di 30 s
nelle partite fra umani: l'input resta libero (regola 4) e il dato raccolto decide
A2. Costo nominale diverso da quello
pagato con stati di risorsa (si mostra il nominale, la variazione vera arriva nel
complessivo); prestazioni su iPhone (misura di C4).

### C3-5 — Effetti per tipo di danno ed enfasi (O7)

**Perimetro.** Impatti diversi per **colpo, taglio e veleno** dal campo descrittivo
di A1 (D2), presentati come natura della carta e non come danno risolto: una
conversione come BrokenBeerBottle non è visibile e non va dedotta. Impatti per ruolo
R07a dove il tipo non si applica (difesa, risorse, contrasto, disturbo, oggetti).
Enfasi breve per annullamento, eliminazione ed esito, ispirata alla
[Yu-Gi-Oh! Master Duel](client-roadmap.md#spunti-dai-quattro-riferimenti) senza
filmati. Solo grafica vettoriale Pixi, nessun asset raster o audio nuovo (D9).
Movimento ridotto: stesso segno senza scosse né voli.

**Completamento verificabile (partite reali, entrambe le misure).** Ogni carta del
catalogo con tipo di danno produce l'impatto di quel tipo, verificato sulle carte
giocate nelle partite e, per quelle non uscite, con la stessa funzione in unità
sull'intero catalogo. Movimento ridotto senza scosse. Peso entro budget.

**File toccati.** `src/scene.ts`, `src/contracts.ts` (campo di A1),
`src/resolution.ts`, test, verifica, documenti comuni.

**Rischi.** Dipende da A1. Effetti «spettacolari» contro ritmo e prestazioni:
prima si semplificano gli effetti, poi si riconsidera la durata.

### C3-6 — Riepilogo e «Ultimo turno» leggibili

**Perimetro.** Il riepilogo breve non copre i posti della FFA (limite di P31). Il
dialogo «Ultimo turno» mette prima i **fatti certi in italiano** (chi, cosa, su chi,
annullata, costo nominale, variazioni complessive per posto, oggetti, eliminazioni,
fine turno) e poi il **testo del server** invariato, in una sezione secondaria (D7).
Dopo un salto di turni dice quanti turni sono stati risolti e che i fatti riguardano
solo l'ultimo. Nessuna cronologia persistente né replay: solo l'ultimo round della
vista.

**Completamento verificabile (partite reali, entrambe le misure).** In duello e
FFA il riepilogo non si sovrappone ai posti (stesso controllo di geometria di
C2b-3); i fatti del dialogo coincidono con il modello; il testo del server è lo
stesso della vista; salto di turni descritto correttamente; dialogo leggibile a
844×390 senza zoom.

**File toccati.** `src/table.tsx`, `src/style.css`, `src/resolution.ts` (testo),
test, verifica, documenti comuni.

**Rischi.** Lunghezza del dialogo in FFA a cinque; rischio di presentare come certo
un collegamento solo probabile: ogni frase deve venire dal modello.

### C3-7 — Consolidamento e giudizio del proprietario

**Perimetro.** Nessuna funzione nuova salvo correzioni di blocchi emersi.
Esecuzione consolidata di tutte le verifiche a 1366×768 e 844×390, `Size`, verifiche
del repository; righe P30, P31, P36 aggiornate; roadmap con «C3 chiusa» solo dopo il
giudizio del proprietario su desktop e iPhone (D11). La prova umana del ritmo resta
nella sessione finale C5, come da roadmap.

**Completamento verificabile.** Tutte le verifiche verdi sulla stessa build; regole
1–9 verificate su partite reali e dichiarate per ciascun blocco; durate delle
sequenze e tempo residuo del clock riassunti per decidere se proporre A2; giudizio del
proprietario registrato.

**File toccati.** Documenti, evidenze, correzioni puntuali.

**Rischi.** Osservazioni del proprietario che chiedono finitura (C4) vanno
registrate e assegnate, non risolte in C3.

## Attività separate

- **A1 — Tipo di danno nel catalogo** (decisa da D2, **prima di C3-5**). Parte dal
  regolamento, come prescrive AGENTS: regolamento 1.9 con un campo descrittivo
  accanto a ruolo e guadagni di R07a, cioè i tipi di danno nominali di ogni carta
  (HIT, CUT, POISON, nessuno, più tipi). Il campo non ha effetti, come R07a.
  Seguono catalogo SQLite, allegato `rules-catalog.json`, `check-rules.py`, il server
  che lo espone con la carta, la copia delle regole del debug e la versione con
  motivazione. Il proprietario decide i casi ambigui: BrokenBeerBottle che converte
  i colpi in tagli, il veleno ritardato di Marvelous Cocktail; il veleno di fine
  turno è R06 e non una carta. Nessun effetto cambia.

  **Fatta il 29 ottobre 2026 (regolamento 1.9).** Sottosezione «Danno nominale»
  di [R07a](game-rules.md#danno-nominale-19): i tipi di danno che la carta infligge
  quando si risolve. Casi ambigui decisi dal proprietario: hanno «—»
  BrokenBeerBottle (converte, non infligge), le difese con `impactedProperty`,
  MarvelousCocktail (il veleno arriva dal timer), WhatchaDoin (effetto replicato) e
  LethalHeroinDose (perdita di HEALTH, non un danno R05); il veleno di fine turno
  resta R06. Oggi solo HIT e CUT compaiono (11 carte HIT, PatheticBlade CUT); nessuna
  carta ha più tipi o POISON, ma la forma li ammette.
  **Forma esposta dal server per C3-5:** campo `damage` della carta JSON, accanto a
  `role` e `gains`: stringa `"HIT"`, `"CUT"`, `"POISON"`, più tipi in ordine
  HIT, CUT, POISON separati da `", "` (es. `"HIT, CUT"`), oppure `"—"` per nessuno.
  Assente sui server precedenti. In `contracts.ts` C3-5 potrà aggiungere
  `damage?: string | null` accanto a `role` e `gains`; i personaggi non lo hanno.
- **A2 — Clock della mossa più lungo** (eventuale, indicato dal proprietario con D10).
  Solo se C3-4 e C3-7, o la prova C5, mostrano che sequenze fino a 5 s tolgono troppo
  tempo per scegliere. Cambia R06 (clock di 30 s, regolamento 1.5): prima il
  regolamento con versione e motivazione, poi server, test e copia del debug. Non è
  in C3.
- **Eventi strutturati dal server:** non pianificati (D1). Si riconsiderano solo se
  la prova C5 mostra che il round resta incomprensibile con i dati certi.
- **Osservazione da valutare a parte, senza conclusioni ora:** nella FFA osservata,
  dopo il forfait per tempo dei due umani i computer hanno combattuto altri 25
  round, e l'esito riporta `outcomeReason: timeout` con un computer vincitore. Non
  riguarda C3.

## Decisioni del proprietario

In grassetto la scelta. Tutte **confermate** dal proprietario il 29 ottobre 2026:
D1–D4 prima della stesura, D5–D11 dopo; D10 con una modifica rispetto alla proposta.

| ID | Domanda | Opzioni | Raccomandazione |
|---|---|---|---|
| D1 (O7) | Con quali informazioni si anima la risoluzione | solo dati certi / anche i numeri `RISORSA: a->b` del report / eventi strutturati dal server prima di C3 | **Solo dati certi** — confermata. Il testo del server resta da leggere, non viene interpretato; gli eventi strutturati non sono pianificati. |
| D2 | Fonte del tipo di danno per gli effetti | campo descrittivo nel catalogo (A1, regolamento 1.9) / solo ruolo R07a / tabella nel client | **Campo nel catalogo** — confermata, come O14: le informazioni sulle carte restano in un posto. Senza A1, C3-5 ripiega sul ruolo. |
| D3 (O6) | Frecce in FFA | posti ammessi, oggetti contornati / ogni bersaglio / solo verso il bersaglio sotto il puntatore | **Posti ammessi, oggetti contornati** — confermata. |
| D4 | Dopo un salto di turni | stato finale e testo / animare l'ultimo round senza numeri | **Stato finale e testo** — confermata. |
| D5 | Barre e numeri durante la sequenza | dal valore precedente al finale nel passo delle variazioni / subito il valore finale come oggi | **Dal precedente al finale** nel passo 5, solo con round contiguo; con movimento ridotto, salto o interruzione subito il finale. Le decisioni usano sempre la vista finale. Confermata. |
| D6 | Quanto resta il riepilogo statico | fino alla prima scelta di carta o al round successivo / tempo fisso | **Fino alla prima scelta di carta o al round successivo**; sempre consultabile in «Ultimo turno». Confermata. |
| D7 | Lingua del report | fatti certi in italiano più testo del server invariato / tradurre le frasi del server | **Fatti in italiano più testo del server** in sezione secondaria; tradurre vorrebbe dire interpretare frasi che non sono un contratto. Confermata. |
| D8 | Casi rari su partite reali | mazzi sintetici validi per R02 salvati sul database temporaneo e usati in open 1vCom, più viste registrate per le unità / ganci di test nel server | **Mazzi sintetici e viste registrate**: per esempio molte carte di contrasto, presa e furto, tossicità alta, Banzai. Nessun cambio al server; i casi non ottenuti si dichiarano. Confermata. |
| D9 | Asset degli effetti | grafica vettoriale Pixi / nuove texture e suoni | **Vettoriale**; texture e suoni restano a C4 con provenienza e licenze. Confermata. |
| D10 | Ritmo | entro 2 s per round (proposta) / più lunga per animazioni più curate | **Fino a 5 s per round** — confermata con modifica dal proprietario: si preferiscono animazioni più curate. La sequenza resta chiusa dal primo input sul tavolo e da «Salta effetti»; nessuna impostazione di velocità in C3. Se il clock di 30 s ne risente, A2. |
| D11 | Chiusura | giudizio del proprietario su desktop e iPhone, prova formale in C5 / nuova prova umana in C3 | **Giudizio del proprietario**, come C2a; la prova del ritmo resta in C5. Confermata. |

## Cosa non è in C3

- **C4:** sfondo (O2), cornici per tipologia (O8), simboli (O10), finitura O12,
  suoni, texture degli effetti, ridisegno incrementale e nuova misura fisica.
- **Regole, server e protocollo:** nessuna modifica in C3. A1 è un'attività separata
  dal regolamento; nessun evento strutturato, revisione della vista o ora del server.
- **Fuori perimetro della roadmap:** cronologia persistente, replay, spettatori,
  deckbuilder (O15, O16), carte possedute e scelta del mazzo (O17, O18).
- `client-debug` non cambia.

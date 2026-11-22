# SB-25 — Testi delle carte per i giocatori

## Fase B1 — Testo breve, testo completo, stati, slot in un file a parte

Esecutore, 22 novembre 2026, sul commit di base `dce3733`. Passo diretto ([D170](../../set-base-decisioni.md#decisioni-del-proprietario)),
prompt della regia. Evidenze in [sb-25/](sb-25/).

### Esito

**Consegnata, verde nel perimetro; due rossi fuori perimetro da decidere (print-cards, sotto).** Il generatore scrive il testo breve
approvato (glossario e campione di D170) in `gui.description` delle 117 carte, senza codice di slot, e il testo completo di 117 carte,
7 personaggi e del token in un file generato; i 44 stati delle carte hanno nome italiano e descrizione con le frasi del glossario; il
controllo confronta tutto col generatore e respinge il gergo. Nessun numero della bozza cambia: lo provano `numeri-invariati.py`,
`controlla-numeri.py`, i test e la corsa d'identità sul banco.

**Impronta provvisoria** (non congelamento): `server/src/test/resources/set-base/bozza.json`, SHA-256
`ea5f77b6b36a88298ad2756b14e40ba8e40afcb14b9dd468ee572ba42a2047ac` (byte del repository, LF). La 1.7 di partenza era `65bc46cf…`.

### Stato per tappe

1. Preliminari: letti metodo, nota della Fase A nella cartella condivisa, generatore e lettori dello slot. Fatto.
2. Slot fuori dal testo: [slot.json](../../design/set-base/testi/slot.json), letto da generatore, controllo e `tools/print-cards/bozza.py`.
   Fatto.
3. Testo breve: le frasi di `frasi.py` portate in `testi_stampati.py`, `--scrivi` ha riscritto le 117 descrizioni. Fatto.
4. Testo completo: generato per carte, personaggi e token, riletto voce per voce contro il motore. Fatto.
5. Stati rinominati e descritti. Fatto.
6. Controllo con le regole del gergo e prova con un caso respinto per regola. Fatto.
7. Prove: numeri invariati, corsa d'identità, verifiche. Fatto (print-cards non eseguibile, sotto).
8. Report, piano, commit. Fatto.

### Cosa cambia

1. **Codice dello slot in un file a parte** ([D169](../../set-base-decisioni.md#decisioni-del-proprietario) (5)):
   [testi/slot.json](../../design/set-base/testi/slot.json), tenuto a mano, mappa binding → slot per le 125 voci (7 personaggi, 117 carte,
   il token). Estratto una volta dal prefisso delle descrizioni di `dce3733`; `numeri-invariati.py` prova che coincide con quel prefisso per
   ogni carta. Il server non cambia (`Draft.java` rifiuta campi `gui` sconosciuti, per questo lo slot non è un campo della bozza).
2. **Generatore** ([testi_stampati.py](../../design/set-base/testi/testi_stampati.py)): controllo di schema e campi nominali (`gains`,
   `damageAmount`) invariati; il testo breve è quello di `frasi.py` della Fase A con le correzioni di D169, portato senza cambiamenti; il
   testo completo è nuovo; nome e descrizione degli stati; le regole del gergo (`gergo`). I segnaposto ammessi diventano `[[H]]`, `[[A]]`,
   `[[V]]`, `[[T]]`, `[[L]]`, `[[HIT]]`, `[[CUT]]`, `[[POISON]]`.
3. **Testo breve** in `gui.description` delle 117 carte: identico, voce per voce, a quello di `frasi.py` su tutte le 125 voci e ai 13 testi
   del campione approvato nella [pagina di revisione](../../design/set-base/sb-25/revisione.html). **Nessuna differenza da elencare.**
4. **Testo completo** ([testi/testi-completi.json](../../design/set-base/testi/testi-completi.json), generato, circa 101.000 caratteri): per
   binding, slot, nome, tipo, testo breve e paragrafi del testo completo. Per ogni carta dice tipo e rimando al regolamento, costo (pagato
   prima di ogni effetto), priorità, bersaglio; per le legate lo scarto R02 all'inizio dell'effetto; gli effetti nell'ordine in cui si
   risolvono; quando si legge una risorsa (dopo i costi, dopo le mosse risolte prima e gli effetti precedenti della carta) e
   l'arrotondamento per difetto; il pavimento a 0 delle risorse; durate da quando a quando, veleno di fine turno compreso; cosa conta e cosa
   no (stati del lanciatore e del ricevente in ordine, corazza dell'alcol, oggetti e token contati, equipaggiamenti no); le condizioni
   (Gioca d'anticipo, Vulnerabile, Rincara, Annuncia) col loro rimando; i danni fissi che «Buon Vecchio Ricatto» rimanda. Niente formule:
   simboli come nel testo breve. Le note «sottili» di `campione.json` sono state la lista di controllo; ogni affermazione è stata riletta
   contro il codice del motore (`server/src/main`, solo lettura).
5. **Stati** (D169 (4)): i 44 oggetti stato delle carte hanno per nome il nome della carta (prima «MI TENGO AL BANCO - HIT», «MADE OF
   STONE», …) e per descrizione una frase del glossario in terza persona, letta sul segnalino da chiunque: «Chi lo ha subisce tre quarti
   dei [[HIT]] che subirebbe.», «I [[HIT]] di chi lo ha diventano [[CUT]] e ne infligge una volta e mezza. Dopo il primo uso dura solo
   fino a fine turno.». La durata la mostra il client dal dato. Gli stati di una stessa carta su più tipi di danno hanno lo stesso nome:
   il motore li confronta per identità, non per nome (nessun `equals` in `Status`), e i bot non leggono i nomi; la corsa d'identità lo
   conferma.
6. **Scrittura e controllo**: [genera-testi.py](../../design/set-base/testi/genera-testi.py) `--scrivi` riscrive nella bozza solo i tre
   campi stampati e nome e descrizione degli stati, conservando la formattazione (verifica che la bozza riletta sia uguale all'attesa), e
   scrive `testi-completi.json`. [controlla-testi.py](../../design/set-base/testi/controlla-testi.py) controlla l'uguaglianza esatta di
   campi stampati, stati e file dei testi completi (byte per byte), poi il gergo: nel testo breve (descrizioni delle carte e degli stati)
   niente «×», formule (`abs(`, `>=`, `<=`, `/`), abbreviazioni (HIT, CUT, POISON, HEALTH, GOOD, BAD, «equip»), lettere isolate fuori dai
   segnaposto (ammesse «a», «e», «i», «o» e la maiuscola a inizio frase), rimandi al regolamento, «bersaglio», «autore», «a sé», codici di
   slot; nel testo completo le stesse regole tranne i rimandi. I nomi di carta fra «» non si guardano.
   [prova-controlla-testi.py](sb-25/prova-controlla-testi.py) mostra un caso respinto per regola, nel breve e nel completo, cinque frasi
   pulite che passano e dieci alterazioni della bozza e del file dei testi completi, ognuna respinta con l'errore atteso.
7. **Test del server** (solo attesi che fissano descrizioni o nomi di stato): `Bozza16Test` toglie dal confronto anche nome e descrizione
   degli stati; `SetBaseDraftTest` legge lo slot da `slot.json` (helper `slots()`), riconosce «in questo turno e nel prossimo» come
   `turns` 1 e confronta i testi nuovi; `Sb19CardsTest` cerca gli stati col nome della carta (i due di «Riprendere Fiato» si distinguono per
   la descrizione) e lo slot in `slot.json`; `Sb23ListsTest` riconosce i tutor (`…-AR6`) da `slot.json`: senza la correzione il suo controllo
   sulle copie singole sarebbe passato in silenzio senza guardare i tutor.
8. **print-cards** ([bozza.py](../../../tools/print-cards/bozza.py)): lo slot del piè di carta si legge da `slot.json`; il piè non cambia.
9. **Bozza di riferimento** rigenerata col suo generatore: la colonna «Testo» porta il testo breve nuovo, senza slot. La sezione generata di
   `griglia.md` non legge descrizioni né nomi di stato e non cambia (prova sotto).
10. **frasi.py** ridotto a un rimando: le frasi sono nel generatore; la versione della Fase A si legge con `git show dce3733:…`.

### Scelte prese

- Nome degli stati: il nome della carta, anche quando la carta dà più stati (uno per tipo di danno). Alternativa scartata: suffissi
  italiani («– colpo»), che il glossario non prevede e che il segnalino del client già distingue col simbolo.
- Descrizione degli stati in terza persona («chi lo ha»): il segnalino lo legge anche l'avversario.
- La prova delle regole sta in `docs/reports/set-base/sb-25/`, come quella di SB-24, per restare nei due file nuovi concessi in `testi/`.
- Riga nuova in `aree-protette.md`: non serve, `controlla-testi.py` c'è già nella riga della bozza; la prova si lancia a mano.
- Per le legate il testo completo dice lo scarto R02 («lo scarto avviene all'inizio del suo effetto», regolamento R02). «Discutiamone in
  Privato» e «Rialziamoci e Partite!», classi Java legate per `setBoundToCharacter`, sono riconosciute come legate anche se nessun mazzo le
  elenca fra le bound.

### Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check` | pulito |
| `python scripts/check-links.py` | 8 link rotti, tutti in `docs/design/carriere/` (altro filone, preesistenti); nessuno nei file di SB-25 |
| `python scripts/check-rules.py` | verde |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: 978 test, 0 rossi, 23 saltati (al quarto giro, dopo gli attesi adeguati; sotto) |
| `python -X utf8 docs/design/set-base/controlla-numeri.py` | 0: 117 carte, 7 personaggi, nessuna violazione |
| `python -X utf8 docs/design/set-base/testi/controlla-testi.py` | 0: 117 carte e 44 stati coincidono, 125 testi completi coincidono, nessun gergo |
| `python -X utf8 docs/design/set-base/controlla-nomi.py` | 0 violazioni, ma **124 voci invece di 125**: il token non è più trovato (domanda 2) |
| [prova-controlla-testi.py](sb-25/prova-controlla-testi.py) | tutti i casi come attesi (36 di gergo, 5 frasi pulite, 10 alterazioni) |
| [numeri-invariati.py](sb-25/numeri-invariati.py) | 0: tolti solo `gui.description` e nome e descrizione degli stati, identica a `dce3733`; lo slot tolto coincide con `slot.json` per tutte le 117 carte |
| `genera-bozza-di-riferimento.py --verifica` | allineata (dopo `--scrivi`) |
| griglia: copia di `sb-24/genera-nomi-griglia.py` che legge lo slot da `slot.json` (scratchpad, `--verifica`) | «griglia.md allineata»: la sezione generata non cambia |
| Corsa d'identità sul banco ([identita.json](sb-25/identita.json)) | partite e numeri identici; una sola etichetta diagnostica cambia (sotto) |
| `tools/print-cards/test_generator.py`, `verify.py` | **non eseguiti**: `reportlab` non è installato e installarlo è fuori dal repository (domanda 1) |
| print-cards, prova a moduli finti (solo `load_bozza` e `parse_inline`) | slot letto da `slot.json` per 117 carte, codici uguali a prima; 63 testi non stampabili per i segnaposto dei danni (domanda 1) |

**Corsa d'identità.** Stesso banco del passo 0 di SB-24 (`docs/reports/set-base/sb-21z/run.ps1 -Phase feasibility`,
`Sb19MeasureTest#round`, d50, sette mazzi di riferimento, 4 semi per cella dal 7.000.000), stesso codice, due bozze: quella di `dce3733` e
quella della B1; circa 32 s ciascuna, uscite in `%TEMP%\bm-sb25\out`. `deck-observations.json` e `in-play.json` **identici byte per
byte**; `draft.json` identico dopo la spoliazione di `numeri-invariati.py`. `matrix.json` e `matrix.md` hanno le stesse righe e
differiscono nell'intestazione (percorso e SHA-256 della bozza) e in **una nota diagnostica** del tetto delle bound: per
`base.gigi.bound.Lima` il banco stampa il nome dello stato, che passa da «equip AFFILO L'ATTREZZO» a «equip Affilare gli Utensili».
Ogni altro campo, partite e numeri compresi, è identico. Non è quindi «identico byte per byte» come chiedeva il prompt, ed è l'unica
differenza: il nome dello stato è un'etichetta, non entra nel gioco. Il banco non scrive un `observations.json`: i file sono quelli
elencati. Impronte in [identita.json](sb-25/identita.json).

### Lettori del vecchio prefisso dello slot fuori perimetro

Non cambiati, come chiesto; da oggi non girano più o girano peggio sulla bozza nuova:

- `docs/design/set-base/controlla-nomi.py` (SB-24, riga della bozza in `aree-protette.md`): esce con 0, ma l'etichetta di ogni carta è ora
  la descrizione intera invece dello slot, e la regola del token (`crea il token «…»`) non trova più «Bottiglia Spaccata», che quindi esce
  da N1–N3 (domanda 2).
- `docs/design/set-base/sb-24/genera-nomi-griglia.py` (`--verifica` esce con «bozza e proposta non hanno gli stessi slot`), `sb-24/
  genera-revisione.py`, `docs/reports/set-base/sb-24/applica.py`, `docs/reports/set-base/sb-24/prova-controlla-nomi.py`: blocco SB-24
  chiuso.
- `docs/design/set-base/revisione/genera-pagina.py` (SB-20a), `docs/reports/set-base/sb-21h/fase-b/sb21h.py`, `sb-21h/probe.py`: blocchi
  chiusi.
- `docs/design/set-base/sb-25/genera-revisione.py`: importava `frasi.py`; la pagina approvata resta com'era.
- `docs/design/set-base/controlla-numeri.py` legge ancora lo slot dal prefisso ma, non trovandolo, usa il binding come etichetta: funziona.

### Domande per la regia

1. **print-cards.** (a) Il modo `--bozza` era già rotto a `dce3733`: `load_bozza` rifiuta la rarità `PROTAGONIST` dei personaggi, entrata
   con SB-24 (provato a moduli finti sulla bozza di `dce3733`). (b) Con la B1, 63 testi contengono `[[HIT]]`, `[[CUT]]` o `[[POISON]]` e
   `parse_inline` li rifiuta: è lavoro della B2 (simboli dei danni nel PDF), fuori dal mio perimetro di print-cards. (c) `reportlab` non è
   installato qui, quindi `test_generator.py` e `verify.py` non girano; installarlo vuol dire scaricare pacchetti fuori dal repository.
   Proposta: la B2 aggiunge a `parse_inline` i tre segnaposto dei danni (forme di `DAMAGES` in `symbols_pdf.py`) e la rarità P, e chi ha
   `reportlab` lancia le due prove.
2. **controlla-nomi.py.** Perde il token (124 voci) e le etichette per slot. Proposta: farlo leggere da `slot.json` e cercare il token per
   binding (`com.tokens.BrokenBeerBottle`, nome in `testi_stampati.TOKEN_NOME`), in un blocco che ha quel file nel perimetro.
3. **OGG-04 «Mescolone Micidiale».** Il testo completo dice che alla fine del quinto turno perdi anche Vulnerabile: dal codice, i gettoni
   di vulnerabilità sono stati nella lista degli stati e il timer svuota la lista. Lo dice la lettura del motore, non un test (il perimetro
   non ammette test nuovi di comportamento). Serve un test?
4. **Stati con lo stesso nome.** Il client oggi mostra nome e descrizione dello stato; con la B1 tre segnalini di «LIEVE FASTIDIO» hanno lo
   stesso nome e si distinguono per la descrizione, che contiene i segnaposto dei danni (la B2 li disegna). Da guardare nella B2 o in
   SB-31: raggrupparli in un solo segnalino?
5. **Testi «Gained status: …» dei say.** I testi di servizio che il server scrive nel registro del turno restano in inglese e prendono il
   nome nuovo dello stato. Fuori perimetro (Q8).

### Rossi

Solo i rossi attesi dei test che fissavano i testi vecchi: 13 al primo giro (`Bozza16Test` 1, `Sb19CardsTest` 4, `SetBaseDraftTest` 8),
tutti adeguati come al punto 7; `Sb23ListsTest` corretto prima che diventasse un falso verde. Un mio errore di battitura in `Sb19CardsTest` (un commento a metà riga) ha fermato la compilazione del secondo giro; due
attesi (durata «Per 4 turni» a inizio testo, testo di «Lavoro Fatto Bene») sono emersi al terzo, dietro asserzioni che
prima fallivano prima. Quarto giro verde. Nessun rosso del registro.

### File

`docs/design/set-base/testi/{testi_stampati.py, genera-testi.py, controlla-testi.py, slot.json, testi-completi.json}`,
`server/src/test/resources/set-base/bozza.json`, `server/src/test/java/com/gsc/bm/sim/{Bozza16Test, SetBaseDraftTest, Sb19CardsTest,
Sb23ListsTest}.java`, `tools/print-cards/bozza.py`, `docs/design/set-base/sb-25/frasi.py`, `docs/design/set-base/bozza-di-riferimento.md`,
`docs/reports/set-base/sb-25/{prova-controlla-testi.py, numeri-invariati.py, identita.json}`, questo report, `docs/set-base-plan.md`.

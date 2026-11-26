# SB-34 B1 — Classi delle carte, caricatore, documento del set 1.0.3

**Esito: accettata il 26 novembre 2026 ([D215](../../set-base-decisioni.md#decisioni-del-proprietario)): domande 1, 2 e 4 come raccomandato, 3 resta aperta.** Le 20 classi vive delle carte e le 2 superclassi portano i
nomi approvati ([D213](../../set-base-decisioni.md#decisioni-del-proprietario), tabella di
[sb-34/tabella.json](../../design/set-base/sb-34/tabella.json)) sotto `com.gsc.bm.model.cards.base.<personaggio>` / `common` /
`items` / `tokens` e dichiarano il loro id invariato con `@CardId`; il caricatore cerca prima il registro esplicito `SetBaseClasses`,
poi la regola storica. Documento del set **1.0.3**, nessuna carta cambia. Identità viva identica alla base, passo 0 identico (con la
differenza nota dell'ordine di due chiavi in `draft.json`). Tutte le verifiche verdi salvo R3, noto. Tre allargamenti del perimetro
e due attesi, tutti decisi dal proprietario in sessione (sotto).

## Cosa cambia

**Classi (22, spostate con `git mv`).** Le 20 vive coi nomi della tabella, più `base.cesira.Contromossa` →
`base.sergio.Countermove` (astratta, senza id) e `com.items.RottenBeer` → `base.items.WarmBlonde66` (superclasse concreta di
`DiscountDoubleMalt`, `@CardId("com.items.RottenBeer")`). I nomi delle superclassi non erano nella tabella: li ho scelti io (domanda 1).
Una stringa di gioco e due commenti che la sostituzione automatica aveva toccato («Couldn't Steal anything!», «Buon Vecchio Ricatto»)
sono stati ripristinati.

**Identificativo.** `@CardId` (`model/cards/CardId.java`, non ereditata). `CardClasses` (`model/cards`): `idOf(classe)` dà l'id
dichiarato o, senza annotazione, il nome della classe senza `com.gsc.bm.model.cards.` (classi storiche e personaggi), con una
`ClassValue` come cache; `forId(id)` cerca prima il registro, poi la regola package + id. Due errori di caricamento: un id risolto da
entrambe le strade, e il nome di una classe viva usato come id. `getBindingName()`, `Character` e `AbstractCharacterBoundCard`
passano da `idOf`. Registro `model/cards/base/SetBaseClasses`: 21 classi concrete (le 20 vive e `WarmBlonde66`, che i test del
catalogo 1.x istanziano per id), nessuna scansione del classpath; il registro rifiuta classi senza id, astratte o con un id ripetuto.

**Caricatore.** `Draft.javaCard` usa `CardClasses.forId` e rifiuta una classe che dichiara un id diverso dalla carta. Le altre
ricerche per id fuori dal caricatore passano da `forId`: `UserAccountServiceImplTest`, `SimulationCatalog` e, oltre a quanto previsto
dalla proposta, `CardRulesContractTest` (3) e `CatalogEffectsTest` (1), che facevano anch'essi `Class.forName` sull'id per le tabelle
del regolamento 1.x. `DeckFactoryServiceImpl` non cerca classi: non cambia.

**Test.** Import e riferimenti in 22 file di test. Nomi duplicati fra main e test controllati uno per uno: in `CatalogEffectsTest`
e `RulesConformanceTest` `ShuffleFeet`, `GoingBerserk` e `BeggingMoney` erano e restano le classi storiche di test (import a
asterisco di `com.*` e `junkie.*`); nessun file importava le omonime vive. `MissingResourceTest` dà alla carta in mano il nome
semplice della classe: la mossa ora cita `DragIntoTheTunnel` (riferimento, non atteso). Due test nuovi:
`sim/CardClassesLoadTest` (registro = tabella approvata; le 19 carte `java: true` del set vivo, il token e `WarmBlonde66`; le 28 delle
bozze storiche 0.1 e 1.5, 19 dal registro e 9 dalla regola, ognuna con id e classe attesi attraverso il caricatore vero) e
`model/cards/CardClassesTest` (id dichiarato e regola, i due errori, i rifiuti del registro).

**Documento del set 1.0.3** con la nota nelle Revisioni; la frase in testa parla dell'«identificatore stabile della carta» (D213);
le 20 schede con una classe scrivono «id · classe · slot». `set_catalog.py` legge la classe dal registro e dal `@CardId` di ogni
classe (solo `--vivo`; le generazioni di prova restano come prima) e mette il registro fra gli ingressi del manifest. Rigenerati
documento, copia del client di debug, allegato (solo la versione) e manifest; `cards.sqlite` e `sets/base.json` invariati.
`check-rules.py`: la riga dell'identificatore accetta «· classe». `formato-file-set.md`: punto «Identificatore e classe».
`data-model.md`: il rischio dei mazzi salvati non dipende più dal nome delle classi. `aree-protette.md`: deroga del playground
riscritta (sotto).

## Allargamenti e attesi decisi dal proprietario

1. **`docs/design/set-base/testi/testi_stampati.py`** (fuori perimetro, STOP 1): cercava il sorgente di una carta Java dal suo id e
   con le classi spostate `set_catalog.py --vivo` si fermava. Domanda: allargare a quel file cambiando solo la ricerca del sorgente,
   col catalogo identico nei testi. Risposta: «Sì, allarga». Ora `sorgente_java` trova la classe viva dal `@CardId`, altrimenti il
   percorso dell'id; testi e catalogo identici.
2. **13 link** verso i vecchi file Java (3 in `domain-model.md` e `technical-debt.md`, 10 in rapporti storici: audit del 23
   ottobre, i11, sb-15, sb-19-b1). Risposta: «Ripunta tutti i 13». Cambia solo la destinazione; il testo visibile resta col nome del
   momento (D210 (3)).
3. **Atteso `1.0.2` → `1.0.3`** della versione del set nell'archivio, in `MatchArchiveTest` (risposta «Sì, aggiorna») e nei tre
   script CLI `cli-match-export-test.cjs`, `cli-open-complete-test.cjs`, `cli-quick-complete-test.cjs` (risposta «Sì, aggiorna i
   tre»). Autorizzati da D213 (5), che fissa il documento 1.0.3; nessun altro atteso cambia.

## Deroga del playground

La deroga esentava `sim` e `model/cards/base` di `server/src/main` dall'identità viva e dal contesto completo. Le sue condizioni 2 e 3
erano già false da SB-28 (`LiveSet` e le fabbriche importano `sim.DraftSource`; il catalogo vivo usa classi di `model/cards/base`) e
ora lì stanno tutte le classi vive. Il testo nuovo lo dice: entrambi i package seguono le righe della partita viva, più il passo 0;
resta playground ciò che sta nei sorgenti e nelle risorse di test (banchi, bracci, dati della bozza) e le regole dietro
`Ruleset.playground()`. Il comando della condizione 2 oggi stampa `CardClasses`, `PrintedEffects`, `LiveSet` e quattro fabbriche.

## Verifiche

Processi controllati prima di ogni corsa esclusiva (nessun altro `java`; solo `node` residenti). Uscite in `%TEMP%\bm-sb34`.

| Verifica | Esito |
|---|---|
| Identità viva (`ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, 480.000 partite, cartella `bm-sb16g2b2-live`), base `78d3fa6` contro codice nuovo | **identici byte per byte**: `final-live.json` `ca131721c9bd6549…`, `final-live.md` `16d3bde4c385cc3a…`, uguali anche al riferimento di SB-30a (78 s) |
| Passo 0 (bozza storica 1.5, braccio B, 4 semi, `deckObserve`, `sb16iCounters`), base contro nuovo | `deck-observations.json` `95ec1457…`, `observations.json` `0d6b9e4e…`, `sb16i-observations.json` `c43a9500…` **identici**; `draft.json` stesso contenuto, differisce solo l'ordine di `perPlay`/`perPlaySelf` di «L'ultimo giro» (`Map.of` in `BozzeStoriche`, già in SB-30a, domanda 2 di B1 lì); `matrix.json` e `matrix.md` differiscono solo per quell'impronta (`e38405a2…` → `aabe0279…`) |
| `build.ps1 -Task Test -Offline` | verde: **1527 test, 0 falliti, 23 saltati** (9 nuovi); client di debug 54/54 |
| `build.ps1 -Task TestServerContext -Offline` | **1736 test, 1 fallito**: `QuickDuelCliTest.aBaseAndAnAdvancedHumanPlayTheirOwnStarters`, «Event timeout», **noto, voce R3**, senza rilancio |
| `verify-match-manifests.py` | uscita 0, `allChecks` PASS (i `codeSha256` delle partite nuove cambiano, com'è atteso) |
| `set_catalog.py --vivo --check` | 7 file identici alla generazione |
| `check-rules.py` | verde: regolamento 2.2, Set Base 1.0.3 |
| `prova-errori.py` | 6/6 OK |
| `controlla-testi.py` | 117 carte, 125 testi completi coincidono |
| `controlla-nomi.py` | uscita 1, «125 voci, 5 violazioni»: **noto, voce R18**, stessa uscita |
| `check-links.py` | 22 rotti, quelli noti |
| `git diff --check` | pulito (avvisi di fine riga dei test CRLF già esistenti) |
| Mutazioni (4, su `SetBaseClasses` e `CardClasses`) | 4/4 rosse, sorgenti ripristinati (impronte uguali, nessun `MUTANT`): M1 tolta `ThatsEnough` dal registro → falliscono registro, carico del set vivo e delle bozze storiche, `forId`; M2 senza il controllo delle due strade → `anIdResolvedBothWaysIsALoadError`; M3 `idOf` ignora l'annotazione → 4 test; M4 nome di classe viva accettato come id → `aLiveClassReachedByItsClassNameIsALoadError` |

**Non verificato.** Nessuna partita manuale né verifica del client web (nessun file del client cambia; la copia del documento nel
client di debug è nei test). La stampa (`tools/print-cards`) non è stata rifatta: il file del set non cambia e non legge i testi.

**Nota sulla procedura.** Durante il primo giro di Maven ho tentato un `git stash` per misurare i link della base: è fallito senza
effetti (nessuno stash creato, albero intatto), ma non andava tentato con una verifica in corso; la base dei link l'ho poi ricavata
dai percorsi vecchi.

## Per le altre macchine

Dopo il pull il jar del server va ricostruito (cambiano server e documento del set). `check-rules.py` e `testi_stampati.py` sono
cambiati.

## Domande

1. **Nomi delle superclassi**, non in tabella: `Countermove` (da `Contromossa`) e `WarmBlonde66` (da `RottenBeer`, lo stesso nome
   della carta «Bionda da 66, Calda» che oggi è a dati). Vanno bene?
2. **`WarmBlonde66` nel registro** con l'id `com.items.RottenBeer`, che nel set vivo è una carta a dati: il caricatore consulta il
   registro solo per le carte `java: true`, quindi il set vivo non cambia. Raccomandato: tenerla così finché esistono i test 1.x che
   la istanziano.
3. **Ordine delle chiavi in `BozzeStoriche`** (già domanda 2 di SB-30a B1): resta aperto; il passo 0 si confronta per contenuto.
4. **Prossimo:** B2 (costanti dei nomi nei test), come in D213 (3)?

---

# SB-34 B2 — Costanti degli id nei test

**Esito: consegnata, in attesa del proprietario (STOP).** `SetBaseIds` ha **130 costanti** (117 carte, 7 personaggi, 1 token,
5 starter), generata da `tools/set-catalog` e controllata da `--vivo --check` e da `check-rules.py`; nei test **1432 stringhe in 90
file** sono diventate la costante dello stesso valore, **42 restano di proposito**. Nessun id, atteso, risorsa di test o file di
`server/src/main` cambia. Base `8c61c12`; passo diretto ([D213](../../set-base-decisioni.md#decisioni-del-proprietario) (3),
[D215](../../set-base-decisioni.md#decisioni-del-proprietario)).

## Cosa cambia

**Classe generata:** `server/src/test/java/com/gsc/bm/model/cards/base/SetBaseIds.java`. Nome in UPPER_SNAKE_CASE dal nome inglese
approvato ([tabella](../../design/set-base/sb-34/tabella.json)); commento col nome italiano della carta; gli starter sono
`STARTER_<nome inglese>` (`STARTER_PIERA = "starter-pino"`). Gli id vengono dal set vivo, non dalla tabella. Nessuna collisione.

**Generatore:** `set_catalog.py --vivo` scrive anche la classe; si ferma su un id senza riga nella tabella, una riga senza id, due
nomi uguali, un nome o un id non scrivibile in Java. `docs/sets/manifest.json` ha la classe fra le uscite e la tabella fra gli
ingressi (nessun'altra uscita cambia). `prova-errori.py`: copia anche i due file e ha un caso in più (costante cambiata a mano).
`formato-file-set.md` elenca la classe fra i file generati.

**Test:** un test nuovo, `SetBaseIdsTest`: costanti e id del set vivo coincidono uno a uno (liste ordinate, quindi anche i
doppioni sono una differenza). Negli altri 90 file cambiano solo le stringhe sostituite e le righe di import.

## Stringhe lasciate

| Cosa | Quante | Perché |
|---|---:|---|
| `sim/CardClassesLoadTest` | 27 | provano che gli id sono quelli congelati: con una costante derivata dal set l'atteso seguirebbe un cambio di id |
| `model/cards/CardClassesTest` | 12 | come sopra |
| `conf/db/SetBaseDecksMigrationTest` | 3 | sostituiscono testo dentro il JSON dei mazzi salvati, scritto per esteso |
| id dentro stringhe più lunghe (messaggi, chiavi, JSON, SQL) | 67 in 9 file | come da prompt (14 sono il JSON di `SetBaseDecksMigrationTest`) |
| id fuori dal set vivo (bozze 0.1 e 1.5) | tutti | come da prompt; le 32 classi storiche non contengono id vivi scritti per esteso |

## Verifiche

Uscite in `%TEMP%\bm-sb34-b2`. Processi controllati prima di ogni corsa esclusiva (nessun altro `java`).

| Verifica | Esito |
|---|---|
| `build.ps1 -Task Test -Offline`, base `8c61c12` | **1527 test, 0 falliti, 0 errori, 23 saltati**; client di debug 54/54 |
| `build.ps1 -Task Test -Offline`, nuovo | **1528 test, 0 falliti, 0 errori, 23 saltati**; client di debug 54/54; per classe cambia solo la nuova `SetBaseIdsTest` (1) |
| bytecode delle classi di test, base contro nuovo (`javap -c -p -constants`) | 336 classi della base **uguali** (a meno di numerazione del constant pool, `ldc`/`ldc_w` e offset); 2 nuove (`SetBaseIds`, `SetBaseIdsTest`) |
| token dei sorgenti, `HEAD` contro nuovo | 90 file: 1432 stringhe diventate la costante dello stesso valore, **nessun'altra differenza** oltre agli import |
| `set_catalog.py --vivo --check` | 8 file identici alla generazione |
| `prova-errori.py` | 7/7 OK |
| `check-rules.py` | verde |
| `check-links.py` | 22 rotti, quelli noti |
| `git diff --check` | pulito (avvisi di fine riga dei test CRLF già esistenti) |
| prove del generatore su copie temporanee (5) | tutte rosse: id senza riga, riga senza id, nomi doppi, costante tolta a mano, classe mancante |
| mutazioni di `SetBaseIdsTest` su copie compilate fuori dal repository (4) | tutte rosse: costante tolta, doppia, con id cambiato, fuori dal set |
| `build.ps1 -Task TestServerContext -Offline` | **1737 test, 1 fallito**, 23 saltati: `QuickDuelCliTest.aBaseAndAnAdvancedHumanPlayTheirOwnStarters`, «Event timeout», **noto, voce R3**, senza rilancio; 1737 sono i 1736 di B1 più il test nuovo |
| `verify-match-manifests.py` | uscita 0, `allChecks` PASS (lanciato a parte: lo script si era fermato sul rosso) |

**Rossi:** il solo R3. Il file del test rosso è fra quelli toccati, ma le sue classi compilate sono uguali a quelle della base (riga del bytecode).

**Non rifatti:** identità viva e passo 0. Nessun file di `server/src/main` cambia e il bytecode dei banchi di `sim` è quello della
base, quindi «stesso codice, stessi numeri» vale per costruzione. Nessuna verifica del client web (nessun file cambia).

## Scelte prese

1. Gli alias locali dei test restano (`IMPACT = GARGANTUAN_IMPACT_ON_YOU`): cambia solo il valore a destra.
2. Import statico di `SetBaseIds.*`; gli otto nomi che i test usano già per altro (`SPAZIENZIO`, `MARA`, `CELESTINA`, `PIERA`,
   `BEPPE`, `SERGIO`, `DUCCIO`, `GRAB`) si scrivono sempre `SetBaseIds.X` (per esempio `LiveFixtures.MARA` è lo starter).
3. Le tre eccezioni della tabella «Stringhe lasciate».
4. `TestServerContext` aggiunto alle verifiche del prompt: cambiano test di contesto e della CLI
   ([aree protette](../../aree-protette.md#partita-viva)).

## Cosa sapere

- Prima di B2 le stringhe sparse nei test avrebbero fatto fallire un cambio accidentale di id; ora le costanti seguono il set.
  Restano a fermarlo: la tabella dei nomi (un id cambiato senza la sua riga ferma `--vivo` e `check-rules.py`), le stringhe lasciate
  in `CardClassesLoadTest` e `CardClassesTest` (solo le classi Java) e i dati salvati o archiviati dei test.
- **Una carta nuova** deve avere la sua riga in `design/set-base/sb-34/tabella.json`, altrimenti `--vivo` e `check-rules.py` si
  fermano. La tabella è passata da evidenza di progetto a ingresso del generatore.
- Dopo il pull la regola chiede di rifare il jar (cambiano file sotto `server/` e `docs/sets/`), anche se il server non cambia.

## Domande

1. Basta quella protezione degli id congelati, o vuoi un test che li fissi tutti e 130 per esteso (o con un'impronta della lista
   ordinata)? Raccomandato: un'impronta nel test, in B3.
2. La tabella dei nomi resta in `docs/design/set-base/sb-34/` o passa sotto `tools/set-catalog/`? Raccomandato: spostarla con la
   prima carta nuova, non ora.

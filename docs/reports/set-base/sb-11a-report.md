# SB-11a — Passi `consume` ed `equip` del formato dati: rapporto

**Fatto il 6 novembre 2026, in attesa del giudizio del proprietario.** Il formato dati ha ora il passo `consume`, il passo `equip` (dentro
`status`) e il campo `basic`. Con questi, quattro classi Java si scrivono come dati e coincidono con gli originali: `Grab`, `BruiserGrab`,
`ToxicGrab` e il token `BrokenBeerBottle`. L'àncora del listino è un parametro. Il codice cambia solo in `server/src/test`: regolamento,
catalogo SQLite, allegato, client, protocollo, classi di produzione, bot e file del filone C4 non sono toccati, e nessuna carta del Set Base
è scritta (è SB-11b).

Il blocco è la prima metà di SB-11 ([D37](../../set-base-plan.md#decisioni-del-proprietario)): prepara ciò che gli starter base richiedono
secondo la [griglia](../../design/set-base/griglia.md) (decisione B4 di D35: Giubbotto e Posacenere negli starter base, quindi `equip`).

## Passi nuovi

Tutti nella lista `self` o `target` di una carta, eseguiti nell'ordine scritto come i sei passi di SB-5. Le carte «prova.*» dei test
(`server/src/test/resources/sb-11a/prove.json`) sono attrezzi di test, non carte del set.

### `consume`

Consuma un oggetto vicino scelto dal giocatore, come `Grab`: lo toglie dal campo e applica gli effetti dell'oggetto a chi lo consuma.

```json
{
  "binding": "com.basic.ToxicGrab",
  "kind": "ACTION",
  "basic": true,
  "targets": ["NEAR_ITEM"],
  "self": [
    {"op": "lose", "resource": "ALERTNESS", "amount": {"base": 0, "of": "ALERTNESS", "divide": 2}},
    {"op": "consume"}
  ]
}
```

- **Ordine.** «−5 A a sé, poi consuma» (Mara) è `[lose ALERTNESS 5, consume]`; «consuma, poi +3 HEALTH» (Rocco) è `[consume, gain HEALTH 3]`.
- **Rapporto.** Con l'oggetto: «Grabbed and consumed Item <nome>», poi le righe degli effetti dell'oggetto. Se l'oggetto è sparito prima
  della risoluzione (R04): «Couldn't Grab that Item!». I passi prima e dopo valgono in tutti e due i casi, e `ToxicGrab` perde A anche
  senza oggetto, come la classe Java.
- **Dove sta.** Solo in `self`, una volta, in un'azione regolare o basic che bersaglia un oggetto vicino (`targets` con `NEAR_ITEM`). Gli
  effetti sul bersaglio dell'oggetto, se ne avesse, seguono quelli della carta, come in `Grab`.
- **Rifiutato alla lettura** nella lista `target`, nelle bound, nelle last resort, negli oggetti, senza `NEAR_ITEM`, ripetuto, con campi
  aggiunti. Esempio di messaggio: `bozza-errata.json: carta bruiser.character.LittleSmack: self[2]: consume non è ammesso in una bound: una
  bound non può bersagliare oggetti`.

### `equip`, dentro `status`

Uno stato d'equipaggiamento: lo stato di `status` con `"equip": true`, lo stesso che il motore costruisce per `BrokenBeerBottle` e che
`BadEducation` sa togliere (R05).

```json
{
  "op": "status",
  "name": "BROKEN BEER",
  "description": "Hit Damage dealt x1.5 and turned to Cut Damage",
  "statusType": "GOOD",
  "flow": "OUTPUT",
  "property": "HIT",
  "factor": 1.5,
  "equip": true,
  "singleUse": true,
  "convertTo": "CUT"
}
```

| Campo | Significato |
|---|---|
| `flow` | `OUTPUT` per il danno inflitto da chi lo porta, `INPUT` per quello ricevuto |
| `property`, `factor` | Tipo di danno e moltiplicatore, positivo, con la troncatura verso zero di R05 |
| `convertTo` | Facoltativo: il tipo in cui il danno si converte, che cambia quali stati successivi si applicano |
| `singleUse` | Facoltativo: durata zero dopo l'uso, può applicarsi ancora nello stesso turno (R05) |
| `turns` | Durata del motore (`lastsForTurns`): 0 copre il turno corrente, 2 anche i due successivi. Senza `turns` lo stato non scade finché non si usa |

- **Sempre con una durata o con l'uso singolo.** Gli equip permanenti restano fuori (idee per le espansioni). Per i non equip `turns` è
  obbligatorio, come prima; `singleUse` e `convertTo` valgono solo con `equip: true`.
- **Rifiutati alla lettura:** campi mancanti o sconosciuti, moltiplicatore zero o negativo, conversione verso un tipo che non esiste o
  verso lo stesso tipo, equip senza `turns` né `singleUse`, `singleUse` o `convertTo` senza `equip`. Messaggi: `bozza-errata.json: carta
  prova.giubbotto: self[0]: equip senza durata né uso singolo: serve turns oppure singleUse`.
- **Un oggetto con `equip`** (Giubbotto, Posacenere, il token) è un oggetto a dati con lo stato in `self`; una **azione** può produrlo
  allo stesso modo (il Coccio della griglia).

### `basic`

Campo booleano di una carta ACTION, come `lastResort`: la carta persiste in mano e non si scarta. Serve perché le basic (`BruiserGrab`,
`ToxicGrab`) sono prese di oggetti; senza il campo una basic non si poteva scrivere a dati. Escluso su oggetti e bound e insieme a
`lastResort`.

## Come si prova l'identità

`ConsumeEquipTest`, sul modello di SB-5 e SB-6a. Non tocca `DataCardsTest`, `PlaygroundTest`, `BenchTest` e `ListinoTest`.

1. **Carta per carta.** `Grab`, `BruiserGrab` e `ToxicGrab` a dati coincidono con le classi Java nei campi, nelle righe di rapporto e nello
   stato finale su 200 stati casuali di `CardScenarios`, che ora ha una variante con oggetti: per seme l'oggetto è presente da solo, scelto
   ma assente dal campo, sparito fra la scelta e la risoluzione, presente accanto a un altro (RottenBeer, Cocktail per terra, Cocktail
   meraviglioso, AnotherRottenBeer, token). Un test controlla che gli scenari tocchino davvero i tre casi: 100 presenti, 50 assenti, 50 spariti.
   Il token a dati coincide con `BrokenBeerBottle` negli stessi 200 stati.
2. **Partite intere.** La bozza «attuale» di SB-6a con le tre prese scritte a dati (stessi testi, stessa posizione, nient'altro cambia)
   gioca **400 partite** per esecuzione identiche, evento per evento, a quelle di SB-6a: 25 coppie ordinate di stili per 4 coppie di
   personaggi per 4 semi da 0. Ogni carta convertita viene giocata almeno una volta; in più di 100 partite una presa riesce.
   Il token a dati, in un mazzo per parte (al posto di una copia di un oggetto), gioca 400 partite identiche a quelle col token Java; il
   token si consuma e `BadEducation` gli toglie lo stato.
   **Prova una tantum più ampia: 10.000 partite per ciascuna delle due prove (100 semi per abbinamento di stili e personaggi, a partire
   da 7.000.000), tutte identiche**, in circa 131 secondi:
   `-Dtest=ConsumeEquipTest#convertedCurrentDraftPlaysExactlyLikeSb6a+dataTokenPlaysExactlyLikeTheJavaToken -Dsim.consumeGames=100 -Dsim.firstSeed=7000000`.
3. **Sa fallire.** Ogni numero, enumerato, testo e campo delle quattro carte viene alterato o tolto, ogni passo tolto e scambiato col
   successivo (sono esclusi, come in SB-5, gli scambi di uno stato con un passo che non fa danno, che non cambiano nulla). Ogni
   alterazione deve essere rifiutata alla lettura oppure notata dal confronto: `Grab` 4 alterazioni (2 rifiutate, 2 notate),
   `BruiserGrab` 8 (2 e 6), `ToxicGrab` 17 (5 e 12), token 23 (12 e 11). Tutte notate. In più ho sabotato il codice del passo, a mano, in
   tre modi (il testo di «Couldn't Grab», l'uso singolo ignorato, l'oggetto che non esce dal campo): ogni volta i test sono diventati
   rossi, e poi ho ripristinato.
4. **Casi che il set di oggi non copre**, su stati costruiti a mano (`ConsumeEquipStatesTest`):
   - **Giubbotto** (INPUT, CUT ×0,75, durata 2, cioè tre turni): il CUT ricevuto passa da 20 a 15, gli altri tipi e il CUT inflitto no, vale
     anche per gli autodanni; a fine del terzo turno scade con «Cleared out of … status»; al quarto turno 20.
   - **Guanti** (OUTPUT, HIT ×1,25, tre turni, senza uso singolo): ogni HIT inflitto, due volte nello stesso turno, poi scade.
   - **Posacenere** (OUTPUT, HIT ×1,5, uso singolo, senza conversione né durata): un CUT non lo consuma; dopo cinque fine turno è ancora
     lì; il primo HIT passa da 10 a 15, il secondo nello stesso turno ancora 15 (R05), a fine turno scade, il turno dopo 10.
   - **Equip che converte** (come il token, da un'azione): 10 HIT diventano 15 CUT e incontrano gli stati del CUT del bersaglio (×0,5 → 7),
     non quelli del HIT.
   - **`BadEducation`** toglie tutti gli equip, di ogni forma, a dati e del motore, e lascia lo stato non equip.
   - **Gli stati a dati sono quelli del motore:** ogni equip a dati, confrontato con lo stesso stato fatto col builder del motore (o con
     `BrokenBeerBottle.newStatus()`), ha gli stessi campi e la stessa sequenza di cinque turni di colpi di ogni tipo.
   - **Ordine attorno a `consume`:** Mara (−5 A, poi presa), Rocco (presa, poi +3 HEALTH) e un passo prima e uno dopo; con l'oggetto
     sparito i passi prima e dopo valgono e la riga è quella di `Grab`. La carta si riusa fra un turno e l'altro senza ricordare l'oggetto.
5. **Copia a metà partita.** Nelle partite col token a dati, la copia presa quando un equip è in gioco ha lo stesso seguito (almeno 5
   copie su 60 partite); stati e carta con l'oggetto consumato si serializzano e dopo si comportano allo stesso modo.
6. **Definizioni errate.** 24 rifiuti (`ConsumeEquipValidationTest`): consume fuori posto in sette modi, equip con campi mancanti o
   sconosciuti, moltiplicatore zero o negativo, conversione verso `ACID`, equip senza durata né uso singolo, `basic` fuori posto. Ogni
   messaggio contiene file, carta, voce della lista e campo. Sei combinazioni valide (equip con durata e uso singolo insieme, ecc.) passano.

## Conteggio di SB-5, aggiornato

| | A dati | In Java | Totale |
|---|---:|---:|---:|
| Azioni (33) | 21 | 12 | 33 |
| Oggetti (4) | 2 | 2 | 4 |
| **Carte del catalogo** | **23** | **14** | **37** |

Passano a dati `Grab`, `BruiserGrab` e `ToxicGrab`. Il token `BrokenBeerBottle` non è nel catalogo e non conta fra le 37. Il file
`sb-11a/java-cards.tsv` elenca le 14 rimaste, e un test controlla che ogni carta sia a dati (SB-5 o SB-11a) o in Java con un motivo,
mai entrambe. Restano in Java:

| Motivo | Carte | Quante |
|---|---|---:|
| Toccano gli oggetti sul campo, in modi che `consume` non copre | `EverythingIsDrug`, `Steal`, `BreakYourToy`, `BeggingMoney`, `ShuffleFeet`, `AnotherRottenBeer` | 6 |
| Annullano mosse altrui | `WhatchaDoin`, `YouStop`, `AmphetamineReflexes` | 3 |
| Timer e immunità | `MarvelousCocktail`, `BadTrip`, `ToxicBloodDrain` | 3 |
| Condizioni sullo stato | `LethalHeroinDose`, `BadEducation` | 2 |

`EverythingIsDrug` toglie l'oggetto senza applicarne gli effetti (e tiene +20 T anche se l'oggetto è sparito, R04): `consume` ne applica
gli effetti, e nessun passo scarta soltanto. La griglia la sostituisce comunque con la basic del Tossico. `AnotherRottenBeer` crea un
oggetto sul campo: nessun passo aggiunge oggetti.

## Quali carte della griglia sono ora esprimibili come dati

Secondo la colonna «Forma» della [griglia](../../design/set-base/griglia.md#tabelle-di-controllo):

- **`consume`, 8 slot, ora a dati:** le sette basic (SPA-BA, MAR-BA, TOS-BA, PIN-BA, GIG-BA, CES-BA, ROC-BA) e GEN-01. Provate le forme
  «consuma» (`Grab`, `BruiserGrab`), «perdi A a sé, poi consuma» (`ToxicGrab`, una carta di prova per Mara), «consuma, poi +3 HEALTH»
  (carta di prova per Rocco) e un passo prima e uno dopo. «+5 T», «+5 L», «+4 V» e «+5 A» prima della presa sono lo stesso passo `gain`
  davanti a `consume`: coperti per costruzione, non provati carta per carta.
- **`equip`, 5 slot e il token, ora a dati:** OGG-09 (Guanti), OGG-10 (Giubbotto), OGG-11 (Casco: HIT ricevuto ×0,8, stessa forma del
  Giubbotto con un altro tipo), OGG-13 (Posacenere), GEN-21 (Coccio) e il token.
- **Ancora in Java, come previsto dalla griglia:** i 13 slot con classi esistenti e le due classi nuove (conteggio degli oggetti,
  memoria e azzeramento di L); le due carte sulla stessa classe Java (`PIN-AR2` e `LR-PIN`) restano a SB-14.
- **Non esprimibili con i passi di oggi, e non previste:** una presa che scarta soltanto (come `EverythingIsDrug`), creare oggetti
  (come `AnotherRottenBeer`), gli equip permanenti.

## Àncora del listino come parametro

`-Dsim.listinoAnchor=<HIT>` (10 di difetto, intero da 1 a 100): le due carte àncora della bozza base hanno quel danno, e le letture
(«danni per unità = (x − 10) / c»), i limiti di ricerca e il rapporto lo seguono. Con il difetto la bozza base è il file di SB-10a, byte per byte
(SHA-256 `87fa95f1…b1`, controllato da un test), e i testi delle domande sono gli stessi. Con un altro valore il rapporto scrive una riga
«Àncora» e il campo `ancora` nei dati, e la bozza derivata ha la sua impronta.

**Con il valore di difetto i rapporti di SB-10a e SB-10b restano identici nei numeri.** Provato rilanciando due misure con i parametri
degli originali (8 thread) e confrontando i dati con le evidenze committate:

| Misura rilanciata | Partite | Confronto con l'evidenza |
|---|---:|---|
| `tettopartita,salute` (SB-10b, 41 curve) | 246.000 | impronta SHA-256 di ogni bozza derivata, vittorie, sconfitte, patte, quota e intervallo di ogni punto, e pendenze della salute: **tutti identici** a `sb-10b/sb10b-tetto-partita.json` |
| `costo` (SB-10a, 20 bisezioni) | 979.200 | impronta della bozza, radice, radici per stile, ricerca, lettura e stato di ogni bisezione: **tutti identici** a `sb-10a/sb10a-listino-all.json` |

Le uniche differenze sono nell'intestazione (nota e tempi). Il valore di difetto non cambia nemmeno la bozza base: SHA-256 uguale a quello dei
rapporti.

**Con l'àncora a 7 funziona.** Un giro del gruppo `costo` con `-Dsim.listinoAnchor=7` e partite ridotte (100 per punto di bisezione, 400 per
punto di griglia, quindi intervalli larghi: dimostra il parametro, non è una misura) dà radici più basse, come deve essere con un riferimento
più debole, per esempio costo 10 V per Spazienzio: radice 17,1 contro 20,7 con l'àncora a 10, cioè 1,01 danni per V contro 1,07. Il
rapporto scrive la riga «Àncora 7 HIT» e la bozza derivata ha una sua impronta. I numeri veri con l'unità a 7 si misurano in SB-11b sugli
starter nuovi.

## Come si lancia

Da `server/`, con `JAVA_HOME` sul JDK di `.tools/`, come in SB-10b:

```powershell
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=ListinoMeasureTest" "-Dsim.listino=costo,tipo,salute" "-Dsim.listinoAnchor=7" "-Dsim.threads=8"
```

Le prove di questo blocco: `-Dtest=ConsumeEquipTest,ConsumeEquipStatesTest,ConsumeEquipValidationTest,ListinoAnchorTest`.
Partite più numerose: `-Dsim.consumeGames=<semi per abbinamento>` e `-Dsim.firstSeed=<primo seme>`.

## File

| File | Cosa cambia |
|---|---|
| `server/src/test/java/.../sim/DataCards.java` | Passo `consume`, campi `equip`, `singleUse`, `convertTo` e `turns` facoltativo con regole, campo `basic`, validazione |
| `server/src/test/java/.../sim/CardScenarios.java` | Variante con oggetti sul campo (`withItems()`); `outcome` visibile al pacchetto. Nessuna riga di comportamento esistente cambia |
| `server/src/test/java/.../sim/Listino.java`, `ListinoReport.java` | Àncora come parametro; testi con l'àncora; riga e campo nel rapporto solo con un valore diverso dal difetto |
| `server/src/test/java/.../sim/ConsumeEquipTest.java`, `ConsumeEquipStatesTest.java`, `ConsumeEquipValidationTest.java`, `ConsumeEquipFixtures.java` | Nuovi: identità, stati a mano, validazione, strumenti |
| `server/src/test/java/.../sim/ListinoAnchorTest.java` | Nuovo: àncora di difetto, derivazione, effetto sulle sonde, valori errati |
| `server/src/test/resources/sb-11a/` | `cards.json` (le quattro carte), `prove.json` (attrezzi di test), `java-cards.tsv` (le 14 rimaste in Java) |
| `docs/` | Questo rapporto; stato nel piano, nell'indice e nella griglia |

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero processi Maven o Java altrui.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.**
  - Maven: 571 test, 0 falliti, 7 saltati (le misure a richiesta, come in SB-10b). I nuovi sono 64: 60 nelle tre classi `ConsumeEquip*` e 4 in
    `ListinoAnchorTest`.
  - `PlaygroundTest`, `DataCardsTest`, `BenchTest` e `ListinoTest` passano senza modifiche; nessun atteso è cambiato.
  - Client: 36 test su 36.
- `python scripts/check-rules.py`: regolamento e copia client allineati; 39 carte e 1 token; SQLite integro (anche lanciato da solo).
- `TestServerContext`: **non lanciato**, perché il blocco tocca solo `server/src/test` e i documenti.
- Prova ampia e misure di regressione dell'àncora: vedi sopra, tutte verdi.

## Cosa non è provato

- **Il token a dati in partita passa da un mazzo di prova.** In una partita normale il token lo crea `AnotherRottenBeer`, che lo costruisce
  con `new BrokenBeerBottle()`: resta in Java e non usa la carta a dati. La prova mette il token in un mazzo, dove una presa lo consuma,
  perché in nessun'altra partita l'equip a dati viene giocato.
- **Le carte della griglia non sono scritte.** Le forme sono provate su `Grab`, le basic di oggi, il token e carte di prova. Casco, Guanti,
  Coccio e le basic dei personaggi nuovi sono provati solo come forme (carte «prova.*» o per analogia).
- **Il significato di «per 3 turni».** `turns` è la durata del motore: con `turns: 2` lo stato copre il turno in cui si consuma e i due
  successivi. Se la griglia intende un'altra misura, SB-11b deve scegliere il valore (vedi sotto).
- **I bot.** Leggono solo i propri guadagni e il danno nominale: non sanno che una carta con equip prepara un colpo. Non misurato.
- **Nessun equip permanente, nessun passo che scarta soltanto, nessun passo che crea oggetti:** scelte, non lacune.
- **`TestServerContext` non lanciato:** il blocco tocca solo `server/src/test` e i documenti; contesto Spring, CLI e classi di produzione
  non cambiano.
- **Partita viva.** Come in SB-5, `CardFactoryServiceImpl` e le factory non conoscono le carte a dati: riguarda SB-26–SB-28.

## Cosa serve a SB-11b

1. **Scrivere le carte** con i passi nuovi: SPA-BA e MAR-BA con `consume` (`-1` e `2` di priorità; per Mara `lose ALERTNESS 5` prima),
   GEN-01, OGG-10 (Giubbotto) e OGG-13 (Posacenere). Il formato accetta già `basic: true`, `targets: ["NEAR_ITEM"]` e gli equip.
2. **Scegliere `turns` del Giubbotto:** «CUT ricevuto ×0,75 per 3 turni» è `turns: 2` (turno corrente più due) con la regola di R05, ma
   `MadeOfStone` oggi usa `turns: 3` per «3 turni». Una scelta di progetto, da dichiarare nella bozza.
3. **Il testo `gui` si scrive a mano** e nulla controlla che il danno nominale corrisponda ai passi (limite di SB-6a, invariato).
4. **Rimisurare il listino con l'unità a 7 HIT** (`-Dsim.listinoAnchor=7`, gruppi `costo,tipo,salute`) sugli starter nuovi, riconfermare D36
   sullo starter vero di Mara e misurare la bound +8 A (punti 3 e 4 di «Cosa serve a SB-11» di SB-10b).
5. **Nomi degli starter** di Spazienzio: ancora da inventare.

# SB-6a — Nucleo del playground: rapporto

**Fatto il 6 novembre 2026, in attesa del giudizio del proprietario.** Una bozza di set è un file JSON caricato dal runner. Contiene
carte a dati, carte Java con i loro numeri, personaggi, mazzi e parametri del formato, e si controlla tutta alla lettura. La bozza
«attuale», cioè il set di oggi scritto come bozza, gioca partite identiche evento per evento a quelle del catalogo. Cambiare un numero
non richiede più di ricompilare, anche per le 17 carte in Java. Partita viva, regolamento, catalogo e client non cambiano.

Il blocco è la prima metà di SB-6, anticipata da [D30](../../set-base-plan.md#decisioni-del-proprietario). Più set e mini-espansione
restano a SB-6b, dopo SB-2. La proposta della fase A è stata approvata dal proprietario così com'era, comprese le tre scelte:
annotazione e riflessione, risorse a 0 scritte per i personaggi nuovi, `BruiserGrab` come basic segnaposto nella bozza di prova.

## Classi di produzione toccate

Sotto `server/src/main/java/com/gsc/bm/model/`. Nessuna cambia il comportamento: i valori iniziali sono quelli di prima, e le factory
creano le carte col costruttore senza argomenti, come prima.

| File | Cosa cambia e perché |
|---|---|
| `Character.java` | Un costruttore protetto con l'id esplicito; quello di prima gli delega. Serve ai personaggi scritti come dati, che non hanno una classe propria. |
| `cards/Tunable.java` (nuovo) | Annotazione su un campo `int` che contiene un numero di una carta Java. Il codice vivo non la legge. |
| `cards/bruiser/BadEducation.java` | `hitDamage` = 10 |
| `cards/bruiser/YouStop.java` | `alertnessToTarget` = 10 |
| `cards/com/basic/ToxicGrab.java` | `alertnessDivisor` = 2 |
| `cards/com/items/AnotherRottenBeer.java` | `alcohol` = 10 |
| `cards/com/items/MarvelousCocktail.java` | `alcohol` 20, `toxicity` 20, `turns` 5, `poison` 20. Il timer riceve il valore in una variabile locale, non la carta. |
| `cards/junkie/BadTrip.java` | `turns` = 3, usato anche nella riga «Lost Immunity to Toxicity for 3 Turns» |
| `cards/junkie/BeggingMoney.java` | `alertnessFromTarget` = 10 |
| `cards/junkie/EverythingIsDrug.java` | `toxicity` = 20 |
| `cards/junkie/LethalHeroinDose.java` | `threshold` = 30, un solo parametro per i due usi (soglia e T − 30) |
| `cards/junkie/ToxicBloodDrain.java` | `turns` = 1 |

- **Le altre sette carte Java non cambiano:** `BreakYourToy`, `WhatchaDoin`, `Grab`, `ShuffleFeet`, `Steal`, `BruiserGrab` e
  `AmphetamineReflexes` hanno solo costo e priorità. Sono già campi di `AbstractCard`, e il caricatore li imposta per riflessione.
- **Non sono parametri:** il «+T pari a T» di `BadTrip`, che è una formula, e l'×1,5 del token `BrokenBeerBottle`, che non è nel catalogo.
- **Sicurezza dei nuovi campi:** sono privati e senza getter, quindi Jackson non li espone e il protocollo non cambia (lo confermano i
  contratti verdi). La serializzazione Java serve solo alle copie in memoria; l'archivio delle partite è JSON.
- **`BigBadBruiser` e `ToxicJunkie` non cambiano:** nella bozza i due personaggi sono dati, e la prova d'identità mostra che coincidono.

**Fuori dalla produzione, `scripts/check-rules.py`.** Legge l'importo dei danni dal codice Java. Ora risolve un identificatore marcato
`@Tunable` col suo valore iniziale, cioè quello della partita viva. Il controllo resta stretto: con `hitDamage = 11` segnala «R07a damage
amount HIT 10 differs from code HIT 11» (provato e ripristinato).

## Sorgenti di test

In `server/src/test/java/com/gsc/bm/sim/`, fuori dal jar come il runner:

- `Draft`: caricatore e validazione della bozza, personaggi a dati (`DraftCharacter`), carte Java parametriche.
- `PlayerSource`: ciò che serve a `SimulationRunner`. Lo implementano `SimulationCatalog` (SB-3) e `Draft`.
- `CardScenarios`: il confronto carta per carta di SB-5 (campi più 200 stati casuali), spostato da `DataCardsTest` senza cambiarne
  una riga, verificato con un `diff`, per usarlo anche qui.
- `DataCards`: ora rifiuta alla lettura i campi mancanti dei passi, prima scoperti solo eseguendo la carta. Le bound si legano a un id,
  anche di un personaggio che esiste solo nella bozza.
- `PlaygroundTest`: le prove descritte sotto.
- `PlaygroundMeasureTest`: la misura a richiesta.

Le risorse stanno in `server/src/test/resources/sb-6a/`: `attuale.json` è il set di oggi, `prova-sb9.json` è solo una bozza di prova.

## Formato

```json
{
  "format": "sb-6a/1",
  "rules": {"deckSize": 20, "maxCopies": 2, "basicFixedPerCharacter": true, "boundChoices": 2, "lastResortRequired": true},
  "characters": [{"id": "bruiser.character.BigBadBruiser", "name": "Spazienzio de la Ucciso",
                  "resources": {"HEALTH": 100, "ALERTNESS": 20, "VIOLENCE": 25}, "items": 1, "immunities": [],
                  "basic": "com.basic.BruiserGrab"}],
  "cards": [
    {"binding": "bruiser.SuperImpact", "kind": "ACTION", "priority": 0, "targets": ["OPPONENT"], "cost": {"VIOLENCE": 25},
     "target": [{"op": "damage", "type": "HIT", "amount": 40}],
     "gui": {"name": "GARGANTUESCO IMPATTO SUL TU", "role": "DAMAGE", "gains": "—", "damage": "HIT", "damageAmount": "HIT 40"}},
    {"binding": "bruiser.YouStop", "java": true, "cost": {"VIOLENCE": 5}, "priority": 2, "params": {"alertnessToTarget": 10},
     "gui": {"name": "FAI BASTA", "role": "COUNTER", "gains": "—", "damage": "—", "damageAmount": "—"}}
  ],
  "decks": [{"id": "starter-bruiser", "character": "bruiser.character.BigBadBruiser",
             "bound": ["bruiser.character.LittleSmack", "bruiser.character.LittleRage"], "lastResort": "com.last.Struggle",
             "cards": {"bruiser.SuperImpact": 1, "bruiser.YouStop": 2}}]
}
```

- **Carte a dati.** Sono le carte di SB-5 più il blocco `gui`. Il blocco serve perché i bot leggono ruolo, guadagni e danno nominale, e
  la traccia e la mano usano il nome. `description`, `image` e `sprite` sono facoltativi: le carte nuove non hanno illustrazione.
- **Carte Java.** `java: true`, poi `cost`, `priority` e tutti i `params` della classe. Per gli oggetti costo e priorità sono fissi,
  quindi i due campi non sono ammessi.
- **Personaggi.** Una mappa `resources` con HEALTH e ALERTNESS obbligatorie. Una risorsa assente resta assente, come nel codice di oggi;
  uno 0 scritto è uno 0. Le bound disponibili sono le carte `BOUND` con `boundTo` uguale all'id.
- **Last resort legate a un personaggio (D29).** Il campo facoltativo `exclusiveTo` limita a quel personaggio i mazzi che possono usarle.
- **Set e rarità** non hanno campi, ma il formato non li impedisce. La stringa `format` dà una versione al formato, e SB-6b può
  aggiungerli in modo esplicito. Gli id sono stringhe libere e possono avere un prefisso per set.

**Validazione al caricamento.** Il messaggio indica sempre file, voce e campo, per esempio
`bozza-errata.json: carta bruiser.SuperImpact: target[0]: campo amount mancante`. Vengono rifiutati:

- campi sconosciuti o mancanti in ogni livello, compresi i passi: stato senza durata, `amount` senza `base`, `divide` a zero, passo sconosciuto;
- parametri Java sconosciuti (con l'elenco di quelli noti), mancanti, testuali o decimali; classi inesistenti; costo o priorità su un oggetto;
- nomi di carta uguali senza distinguere maiuscole, perché la mano cerca le carte per nome;
- bound che bersagliano oggetti, last resort con un costo o che bersagliano oggetti, `exclusiveTo` fuori da una last resort;
- mazzi fuori formato: dimensione diversa, troppe copie, bound altrui, ripetute o in numero sbagliato, basic diversa da quella fissa,
  last resort assente, non tale o riservata ad altri, basic, bound o last resort fra le carte regolari, carte o personaggi sconosciuti;
- `lastResortRequired: false`, perché `Player` metterebbe in mano un `null`; `boundChoices` oltre 4, perché la mano ha 6 carte.

## Come si prova l'identità

`PlaygroundTest` gioca le stesse partite col catalogo SB-3, che usa solo classi Java e SQLite, e con la bozza «attuale». Confronta le
tracce JSONL evento per evento tramite impronta SHA-256; in caso di differenza mostra il confronto testuale completo.

- **Ogni esecuzione: 400 partite.** 25 coppie ordinate di stili (l'attuale `ComPlayer` e i quattro stili di SB-4) per 4 coppie di
  personaggi per 4 semi (da 0). Ogni carta usata dagli starter viene giocata almeno una volta, altrimenti il test fallisce.
- **Carta per carta, tutte e 37:** stessi testi del catalogo, stessi campi e stesso esito su 200 stati casuali della classe Java.
  `BeggingMoney` è nel catalogo ma in nessuno starter: solo qui si può provare. La prima versione del test l'ha segnalata come mai giocata.
- **La prova sa fallire.** Ogni numero alterato di +1 deve cambiare almeno una partita:
  - 38 numeri delle carte Java: 10 voci di costo, 15 priorità e 13 parametri;
  - 10 campi dei personaggi: risorse, capacità e immunità tolte o aggiunte.

  Tutte e 48 le alterazioni vengono notate nelle partite, tranne le tre di `BeggingMoney`, notate dal confronto carta per carta.
- **Prova una tantum: 10.000 partite identiche**, 100 semi per abbinamento a partire da 6.000.000. Dura circa 55 secondi:
  `-Dtest=PlaygroundTest#currentDraftPlaysExactlyLikeTheCatalog -Dsim.draftGames=100 -Dsim.firstSeed=6000000`.

**Un numero senza ricompilare.** Il test copia la bozza in `tmp/sim/`, cambia un valore e la sceglie con `-Dsim.draft`, come al lancio.
Su 100 partite fra aggressivi, i due esiti cambiano nel verso atteso:

- SuperImpact a 400 HIT, carta a dati: Spazienzio vince di più;
- veleno di MarvelousCocktail a 200, parametro Java: il Tossico vince di meno.

## Bozza di prova con i valori di SB-9

`prova-sb9.json` usa i valori iniziali delle [schede](../../design/set-base/schede-personaggi.md):

- **Mara:** 85 HEALTH, A 40, V 0, capacità 2;
- **Rocco:** 130 HEALTH, A 15, nessuna risorsa speciale, capacità 2.

Per entrambi V, T e L sono scritte a 0: con risorse assenti alcune carte vanno in NullPointerException (vedi sotto).

Le carte sono di prova:
- carte esistenti;
- bound deboli;
- un colpo e una parata pagati in HEALTH per Rocco, con la sua last resort riservata («Porgi l'altra guancia»);
- `BruiserGrab` come basic segnaposto per tutti e due.

**Solo test, non è il set.** Il motore la gioca senza modifiche:

- 200 partite (tutte le coppie di stili e di mazzi, specchi compresi) finiscono senza errori, senza limite di turni e senza mosse vuote;
- le carte di Rocco pagate in salute vengono giocate.

Un test separato prova il costo in HEALTH: con 14 di salute il colpo da 15 è rifiutato; con 15 è valido, Rocco muore pagando e la mossa
arriva lo stesso (R04).

## Come si lancia

Da `server/`, con `JAVA_HOME` sul JDK di `.tools/` e il Maven e le impostazioni di `scripts/build.ps1`:

```powershell
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=PlaygroundMeasureTest" "-Dsim.playground=100" "-Dsim.draft=<percorso assoluto>" "-Dsim.styles=com,aggressivo,risorse"
```

- `-Dsim.playground=<partite>` attiva la misura: ogni coppia ordinata di mazzi, specchi compresi, per ogni coppia ordinata di stili,
  a posti alternati per seme.
- `-Dsim.draft` è facoltativo: senza vale la bozza «attuale».
- `-Dsim.decks` e `-Dsim.styles` restringono mazzi e stili; gli stili noti sono `com`, `casuale`, `aggressivo`, `prudente` e `risorse`.
- `-Dsim.firstSeed` fissa il primo seme.
- Il riepilogo, con percorso e SHA-256 della bozza, va in `tmp/sim/playground-<bozza>-<partite>.txt`.

Uso `sim.playground` e non `sim.games`, che proponevo in fase A, perché `sim.games` attiva già la misura di SB-3.

Prova del lancio: 100 partite per riga sulla bozza di prova, stili `com`, `aggressivo` e `risorse`, 36 righe in circa 10 secondi.
SHA-256 della bozza: `f4d5eb2411da85cbed644840b6b940861d7e9acbea107417fe6dd2e49b349d0e`. I numeri riguardano carte di prova e non dicono
nulla sul bilanciamento.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero processi Maven o Java altrui.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.**
  - Maven: 478 test, 0 falliti, 4 saltati (le misure a richiesta);
  - client: 36 test su 36;
  - `PlaygroundTest`: 138 test.
  - Il primo tentativo si era fermato su `check-rules.py`, che leggeva `hitDamage` come importo variabile. L'ho corretto come descritto sopra.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **verde**, 585 test, 0 falliti, 4 saltati, 10:07 min.
- `python scripts/check-rules.py`: regolamento e copia client allineati.

## Cosa resta com'era

- `CatalogEffectsTest`, `RulesConformanceTest` e i contratti sono verdi senza toccare un atteso.
- `DataCardsTest` è verde con le stesse prove: il confronto carta per carta è solo spostato in `CardScenarios`.
- Regolamento, catalogo SQLite, allegato, client, protocollo e factory Spring non sono toccati, e nemmeno i file del filone C4.

## Cosa non è provato

- **Risorse assenti.** Provato in fase A con una prova poi cancellata: un personaggio senza T va in NullPointerException con `BadTrip`,
  `LethalHeroinDose` e i passi `of` (per esempio `PervertedMetabolism`). La bozza lo evita scrivendo le risorse a 0.
  - **Dedotto:** lo stesso può succedere già oggi nella partita viva, se un mazzo utente mette quelle carte a Spazienzio, perché il
    server non limita le carte per personaggio. Non lo correggo qui: è una modifica alla partita viva.
- **Bot e costo in HEALTH.** In fase A l'aggressivo si è ucciso una volta in 200 partite pagando senza uccidere: nessuno stile tiene
  conto del costo in salute. È materia di SB-7 e SB-18.
- **Carte nuove con meccaniche non esprimibili a dati.** Servono ancora classi Java, quindi una compilazione. Una classe nei sorgenti di
  test sotto `com.gsc.bm.model.cards` sarebbe caricabile dalla bozza senza toccare il jar: dedotto, non provato.
- **Testi `gui`.** Si scrivono a mano; nulla controlla che il danno nominale corrisponda ai passi.
- **La bozza «attuale»** è stata generata una volta da SQLite, dal JSON di SB-5 e dai valori Java. Lo script non è conservato: il file ora
  è la fonte, e i test garantiscono che coincida col catalogo.
- Partite al secondo non misurate apposta. Indicazione dai tempi: 400 partite con traccia in meno di 2 secondi.

## Cosa resta

- **SB-6b:** caricamento da più set insieme, campi set e rarità, mini-espansione con bound aggiuntive. Il formato ha già una versione per
  crescere.
- **SB-7:** matrice con intervalli di confidenza e invarianti (zero turni senza mosse, vincoli di bound e last resort già controllati qui
  alla lettura, tetto delle bound), ricerca dei mazzi. Da qui riceve `Draft`, `PlayerSource`, gli stili e il lanciatore da allargare.
- **SB-8:** il server di sviluppo deve leggere la stessa bozza. Il costruttore di `Character` e le carte parametriche sono già in produzione,
  ma `Draft` vive nei test.

# SB-6b — Più set e mini-espansione di prova: rapporto

**Fatto l'8 novembre 2026, in attesa del giudizio del proprietario.** Il playground carica più set insieme. Un file di bozza
dichiara il proprio set e la versione, le carte e i personaggi possono avere una rarità del vocabolario di R07, un mazzo mescola
carte di set diversi secondo le regole dei mazzi del regolamento 1.12. Una mini-espansione di prova di cinque carte si carica
sia col set di oggi sia con la bozza del Set Base, gioca partite intere e una piccola matrice col banco, e non cambia nessuna
partita fra i mazzi di base. Partita viva, regolamento, documento del set, catalogo, protocollo e client non cambiano.

Il blocco è la seconda metà di SB-6 ([D30](../../set-base-plan.md#decisioni-del-proprietario)), dopo SB-6a e SB-2. Il proprietario
ha approvato la proposta della fase A con «Approvo tutte» (Q1–Q9, sotto).

## Decisioni del proprietario sulla fase A

| | Domanda | Decisione |
|---|---|---|
| Q1 | Formato | `sb-6b/1`: un file per set con testata `set` (id, nome, versione) e `requires`; più file composti in una vista unita |
| Q2 | File `sb-6a/1` | Si leggono come prima e sono il set `base` con versione non dichiarata |
| Q3 | Prefisso degli id | Obbligatorio `<set>.` per carte, personaggi e mazzi dei set diversi da `base` |
| Q4 | Rarità delle carte di oggi | Restano vuote fino a SB-28 (`C_RARITY`, allegato e Set Base 0.1 invariati) |
| Q5 | Rarità della bozza del Set Base | Dalla griglia, dopo il commit di SB-14; altrimenti al blocco successivo che tocca la bozza |
| Q6 | Prove della mini | Con la bozza «attuale» per l'identità, con la bozza del Set Base per caricamento e partite; se la bozza cambia si adatta la mini |
| Q7 | `check-rules.py` | Legge il vocabolario delle rarità da R07 e lo confronta col caricatore |
| Q8 | Rarità dei personaggi | Ammessa nel formato; la colonna in `CRD003_CHARACTERS` resta a SB-28 |
| Q9 | Carta Java della mini | Classe nei sorgenti di test |

## File toccati

Tutti fuori dalla produzione: nessun file in `server/src/main`, `cards.sqlite`, regolamento, documento del set, allegato o client.

| File | Cosa cambia |
|---|---|
| `server/src/test/java/com/gsc/bm/sim/Draft.java` | Formato `sb-6b/1`, composizione di più set, rarità, visibilità fra set, messaggi col set; `Draft.load`, `fromProperty`, accessi a set e rarità |
| `server/src/test/java/com/gsc/bm/sim/BenchReport.java` | Il rapporto del banco scrive il formato della bozza letta invece della costante: identico per i file `sb-6a/1` |
| `server/src/test/java/com/gsc/bm/sim/MultiSetTest.java` (nuovo) | Le prove descritte sotto |
| `server/src/test/java/com/gsc/bm/model/cards/mini/RintoccoDiCampana.java` (nuovo) | La carta Java della mini, nei sorgenti di test |
| `server/src/test/resources/sb-6b/mini.json` (nuovo) | La mini-espansione di prova |
| `scripts/check-rules.py` | Vocabolario delle rarità letto da R07 e confrontato col caricatore |
| `docs/reports/set-base/sb-6b/check-rules-rarity.py` (nuovo) | Prova dei disallineamenti del vocabolario, su copie temporanee |
| `docs/reports/set-base/sb-6b/rarita-bozza.py` (nuovo) | Per Q5: porta la bozza del Set Base a `sb-6b/1` e le scrive le rarità della griglia; con `--check` le confronta. Non eseguito su `bozza.json` |
| `docs/reports/set-base/sb-6b/banco-attuale-mini-20.md` (nuovo) | Rapporto del banco sulla bozza «attuale» con la mini |
| `docs/reports/set-base/sb-2/check-rules-mismatch.py` | Una riga: copia anche `Draft.java`, che `check-rules.py` ora legge, così la prova di SB-2 resta eseguibile |

`DataCards`, `SimulationCatalog`, `PlayerSource`, `PlaygroundTest`, `SetBaseDraftTest`, `Bench`, `BoundCap`, `DeckSearch` e i file del
listino non sono toccati. Le risorse `sb-5/`, `sb-6a/`, `sb-11a/` e `set-base/bozza.json` non cambiano una riga.

## Formato `sb-6b/1`

**Un file per set.** La testata dice il set, la versione e i set da cui prende carte:

```json
{
  "format": "sb-6b/1",
  "set": {"id": "mini", "name": "Mini-espansione di prova", "version": "0.1"},
  "requires": [{"set": "base"}],
  "characters": [],
  "cards": [{"binding": "mini.spazienzio.bound.Sbuffata", "rarity": "COMMON", "kind": "BOUND",
             "boundTo": "bruiser.character.BigBadBruiser", "...": "..."}],
  "decks": [{"id": "mini.spazienzio", "character": "bruiser.character.BigBadBruiser",
             "bound": ["bruiser.character.LittleSmack", "mini.spazienzio.bound.Sbuffata"], "...": "..."}]
}
```

- **Appartenenza.** Carte, personaggi e mazzi di un file sono del set della testata. Nel file non si scrive `set` sulle voci: il
  caricatore lo assegna, e lo rifiuta se c'è.
- **Versione.** `version` è un testo obbligatorio. In `requires` la versione è facoltativa: se c'è, il set caricato deve averla.
- **Regole del formato.** `rules` sta solo nel set di partenza, quello senza `requires`. Un set che ne richiede altri non può
  dichiararle, e se due file le dichiarano la bozza si rifiuta: il formato è del gioco, non di un'espansione.
- **Id.** Carte, personaggi e mazzi di un set diverso da `base` cominciano con `<set>.` (Q3). Le carte Java legano l'id alla classe:
  `mini.RintoccoDiCampana` è `com.gsc.bm.model.cards.mini.RintoccoDiCampana`.
- **Rarità.** Campo facoltativo `rarity` su carte e personaggi, con i valori di R07: COMMON, UNCOMMON, RARE; assente vuol dire
  nessuna. Il caricatore li tiene in `Draft.RARITIES`, che `check-rules.py` confronta col regolamento.
- **Compatibilità.** Un file `sb-6a/1` si legge esattamente come prima, con la stessa rigidità: `set` o `rarity` sulle voci sono
  campi sconosciuti, come `sets` in testa. È il set `base` con versione non dichiarata (Q2). Lo provano `PlaygroundTest`, che ha già i
  casi «formato diverso» (un `sb-6a/1` riscritto come `sb-6b/1` senza testata) e «rarity» come campo sconosciuto, e `SetBaseDraftTest`,
  verdi senza toccarli.

**Più set insieme.** `Draft.load(fonti)` accetta percorsi e `classpath:/risorsa.json`, in qualunque ordine; al lancio
`-Dsim.draft` accetta più fonti separate da `;`:

```powershell
"-Dsim.draft=classpath:/sb-6a/attuale.json;classpath:/sb-6b/mini.json"
```

La bozza composta si chiama coi nomi dei file, per esempio `attuale.json + mini.json`. Il caricatore unisce i file in una **vista
unita**: `sets` in testa, con id, nome, versione, `requires` e file di ogni set, e `set` scritto su ogni voce. `json()` restituisce
quella vista e `derive()` la rilegge, così banco, tetto delle bound e ricerca dei mazzi funzionano sulle bozze composte senza
modifiche. Una voce senza `set` nella vista unita è **libera** e vede tutti i set caricati: sono le sonde del banco e i mazzi
costruiti dalla ricerca, come un mazzo che il giocatore compone dalla collezione. Con un file solo `json()` restituisce il file com'è.

**Visibilità.** Una voce di un set usa solo il proprio set e quelli che richiede, anche indirettamente. Vale per le carte, le
bound e le last resort di un mazzo, il personaggio di un mazzo, la basic di un personaggio, il `boundTo` di una bound e
l'`exclusiveTo` di una last resort. Un'espansione non può ridefinire una carta del set che richiede: l'id ripetuto si rifiuta.

### Validazione

Il messaggio comincia col file in lettura o, per gli errori fra set, con la bozza composta, e poi dice set, voce e campo. Con più
set la voce porta il suo set, per esempio
`attuale.json + mini.json: mazzo mini.tossico (set mini): cards: la carta terzo.Gomitata è del set terzo, che il set mini non richiede (richiede: base)`.
Con un set solo i messaggi sono quelli di SB-6a.

| Errore | Esempio di messaggio |
|---|---|
| Set mancante | `mini.json: set mini: richiede il set base, che non è caricato (caricati: mini)` |
| Set caricato due volte | `… set mini: caricato due volte: mini.json e mini-copia.json` |
| Due set di partenza | `altra.json: bozza: regole del formato già dichiarate da attuale.json: le dichiara solo il set di partenza` |
| Versione richiesta diversa | `… set mini: richiede base 0.1, caricato in versione non dichiarata` |
| Requires circolare o verso sé | `… set mini: requires circolare: …`, `… set mini: richiede sé stesso` |
| Regole in un'espansione, set di partenza senza regole | `mini.json: bozza: campo rules non ammesso: …`, `mini.json: bozza: campo rules mancante: …` |
| Testata assente o incompleta, formato sconosciuto, id del set non valido | `mini.json: bozza: format sb-6b/1: campo set mancante …` |
| Id ripetuto fra set (carta, mazzo) | `… carta mini.Spallucce (set mini): binding ripetuto: è sia nel set base (attuale.json) sia nel set mini (mini.json)` |
| Nome di carta già usato in un altro set | `… gui.name «fai basta» già usato da bruiser.YouStop del set base (la mano cerca le carte per nome)` |
| Id senza prefisso del set | `… carta Spallucce (set mini): l'id deve iniziare con «mini.», il prefisso del suo set` |
| `set` su una voce, `set` o `rarity` in un file `sb-6a/1` | `mini.json: carta mini.Spallucce: campo set non ammesso …`, `attuale.json: carta com.Grab: campo sconosciuto rarity` |
| Carta di un set non caricato | `… mazzo mini.tossico (set mini): cards: carta sconosciuta: terzo.Gomitata (set caricati: base, mini)` |
| Carta di un set caricato ma non richiesto | `… la carta terzo.Gomitata è del set terzo, che il set mini non richiede (richiede: base)` |
| Il set base che usa una carta della mini | `… mazzo starter-bruiser (set base): cards: la carta mini.CalcioAlBidone è del set mini, che il set base non richiede (richiede: nessuno)` |
| Bound legata a un personaggio di un set non richiesto | `… carta mini.spazienzio.bound.Sbuffata (set mini): il personaggio terzo.character.Pippo è del set terzo, …` |
| Rarità fuori vocabolario (anche minuscola, non testuale, su una carta Java) | `… rarity LEGENDARY fuori vocabolario: COMMON, UNCOMMON, RARE (R07), oppure nessuna` |
| Mazzo misto contro le regole dei mazzi | bound della mini a un altro personaggio, tre bound, bound ripetuta, bound fra le regolari, 21 carte, terza copia, basic diversa da quella fissa, last resort che non lo è |

## Mazzi che mescolano set

I mazzi citano le carte col solo id, che è unico fra i set caricati. Le regole dei mazzi del regolamento 1.12 (R02) valgono come
prima, con i parametri del formato del set di partenza:

- **basic** fissa del personaggio, dal suo set: un'espansione non la cambia;
- **due bound diverse del proprio personaggio**, scelte fra tutte le bound visibili col suo `boundTo`, di qualunque set;
- **last resort** generica o riservata (`exclusiveTo`, anche verso un personaggio di un set richiesto);
- **20 carte regolari**, al massimo 2 copie, da qualunque set visibile.

Nessun controllo presume tre bound per personaggio. `boundsAvailable(personaggio)` elenca quelle fra cui un mazzo sceglie: col set
di oggi e la mini Spazienzio ne ha tre (LittleRage, LittleSmack, Sbuffata), con la bozza del Set Base una in più di quelle della bozza.

## Mini-espansione di prova

`server/src/test/resources/sb-6b/mini.json`, set `mini` 0.1, che richiede `base`. **Solo prova:** nessuna sua carta è nel documento
del set, nel catalogo o nella partita viva, e i testi dicono «Solo prova di SB-6b».

| Carta | Forma | Rarità | Cosa prova |
|---|---|---|---|
| `mini.spazienzio.bound.Sbuffata` | dati, BOUND di Spazienzio, +4 V a sé | COMMON | Bound aggiuntiva di un personaggio di un altro set |
| `mini.CalcioAlBidone` | dati, 10 V, 12 HIT | RARE | Carta nuova a dati |
| `mini.RintoccoDiCampana` | Java, 5 A, HIT pari a `base` 4 più `perItem` 3 per oggetto vicino al bersaglio | UNCOMMON | Carta Java parametrica di un altro set, classe nei sorgenti di test |
| `mini.items.LattinaSchiacciata` | dati, oggetto, +8 A | COMMON | Oggetto di un altro set |
| `mini.Spallucce` | dati, +6 A a sé | nessuna | Carta senza rarità, ammessa da R07 |

Due mazzi misti: `mini.spazienzio` (LittleSmack e Sbuffata, quattro carte della mini e sei di base) e `mini.tossico` (le due bound di
base, tre carte della mini). Citano solo carte di base che sono regolari nella bozza «attuale» e nella bozza del Set Base, sia
nel commit di partenza sia nel lavoro in corso di SB-14, così la mini si carica con tutte. Due carte sono state sostituite durante il
blocco, ed è il rischio previsto in Q6 (se la bozza cambia, si adatta la mini):

- `junkie.LethalHeroinDose`, che nella bozza di SB-14 è la last resort del Tossico: il caricatore l'ha rifiutata («basic, bound e last
  resort non vanno fra le carte regolari»);
- `com.items.RottenBeer`, che c'è nella bozza di SB-14 ma non in quella del commit di partenza: la verifica nel worktree pulito l'ha
  rifiutata («carta sconosciuta: com.items.RottenBeer (set caricati: base, mini)»).

Al loro posto, due copie di `com.Steal`.

`RintoccoDiCampana` conferma ciò che SB-6a dava per dedotto: una classe nei sorgenti di test sotto `com.gsc.bm.model.cards` si carica
dalla bozza con i suoi `@Tunable`, senza toccare il jar. Nel frattempo SB-14 lo usa anche per Pino.

### Perché la mini non tocca motore né regole generali

- Il diff del blocco non contiene file di `server/src/main`, `cards.sqlite`, regolamento, documento del set, allegato o client.
- **Identità delle partite di base.** Per la bozza «attuale» e per quella del Set Base, ogni coppia ordinata di starter, i cinque stili
  contro l'aggressivo e quattro semi: la traccia JSONL con la mini caricata è identica evento per evento a quella senza (80 partite con
  l'«attuale» a due starter; con la bozza del Set Base 320 partite sui quattro starter del lavoro in corso di SB-14, 180 sui tre
  starter del commit di partenza).
- `PlaygroundTest` (identità della bozza «attuale» col catalogo, 400 partite) e `SetBaseDraftTest` verdi senza toccarli.
- L'ordine dei file non conta: stesse carte, stessi mazzi e stesse tracce.

### Partite e banco

- **Partite intere:** i due mazzi della mini contro sé stessi e contro gli starter di oggi, cinque stili, tre semi: 120 partite,
  nessuna al limite di turni, zero mosse vuote. Ogni carta della mini viene giocata almeno una volta, altrimenti il test fallisce.
- **Con la bozza del Set Base:** una partita per ogni mazzo della mini contro ogni starter della bozza, senza limite di turni né mosse vuote.
- **Piccola matrice col banco di SB-7** sulla bozza composta: quattro mazzi, stili aggressivo e risorse, 4 partite per cella, 160
  partite, **zero violazioni degli otto invarianti**. Il tetto delle bound misura anche Sbuffata. Il rapporto dice `sb-6b/1` ed è
  identico a parità di seme e di file.

## Rarità

- **Carte di oggi** (Q4): nessun valore. `C_RARITY` resta vuota, l'allegato non ha `rarity` e Set Base 0.1 dice in S1 che nessuna
  carta ha una rarità. Le carte del Set Base in progettazione le avranno quando entreranno nel catalogo (SB-28).
- **Bozza del Set Base** (Q5): le rarità della [griglia](../../design/set-base/griglia.md) (D34, punto 6) **non sono ancora nella
  bozza**. Alla chiusura di SB-6b, SB-14 non aveva ancora fatto il commit e lavorava su `set-base/bozza.json`, che questo blocco non
  doveva toccare. Le scrive il prossimo blocco che modifica la bozza, con [`sb-6b/rarita-bozza.py`](sb-6b/rarita-bozza.py): porta il file a `sb-6b/1` con testata
  `{"id": "base", "name": "Set Base", "version": "bozza"}` e si aggiunge `rarity` a ogni carta e personaggio, prendendo il valore dalla
  riga della griglia il cui ID (`SPA-BA`, `MAR-AR2`, …) è già all'inizio della descrizione della carta. Il caricatore e i controlli sono pronti.
- **Personaggi** (Q8): il formato ammette la rarità anche su di loro, come chiede la griglia. Il catalogo non ha ancora la colonna in
  `CRD003_CHARACTERS`: la aggiungerà SB-28.
- **`check-rules.py`** (Q7): legge il vocabolario dal paragrafo «Rarità (1.13)» di R07 invece di averlo scritto nel codice e
  controlla che `Draft.RARITIES` sia lo stesso, nello stesso ordine; poi, come prima, `C_RARITY` nel vocabolario e uguale
  all'allegato. Il controllo «un solo documento di set» resta: la mini non ha documento, e un secondo documento arriverà con SB-26 o SB-28.
  [`sb-6b/check-rules-rarity.py`](sb-6b/check-rules-rarity.py) lavora su copie temporanee:

| Caso | Esito |
|---|---|
| Copia pulita | Verde |
| Caricatore con MYTHIC in più | `Draft.java RARITIES differ from R07: "COMMON", "UNCOMMON", "RARE", "MYTHIC" vs COMMON, UNCOMMON, RARE` |
| Caricatore in altro ordine | `Draft.java RARITIES differ from R07: "RARE", "UNCOMMON", "COMMON" vs COMMON, UNCOMMON, RARE` |
| Caricatore senza `RARITIES` | `Draft.java: RARITIES not found` |
| Regolamento con EPIC in più (e copia client) | `Draft.java RARITIES differ from R07: … vs COMMON, UNCOMMON, RARE, EPIC` |

  La prova di SB-2 ([`sb-2/check-rules-mismatch.py`](sb-2/check-rules-mismatch.py)) copia ora anche `Draft.java` ed è di nuovo
  tutta come attesa (pulita verde, sette disallineamenti rifiutati).

## Verifiche

Una alla volta, ciascuna partita solo quando sul repository non girava Java da 30 secondi. Sullo stesso checkout SB-14 lavorava con
modifiche non committate a `Listino.java`, `SetBaseDraftTest.java` e `set-base/bozza.json`. Per questo la verifica completa è stata
fatta in un **worktree temporaneo**: il commit di partenza (ff2b45d) più i soli file di SB-6b.

- `./scripts/build.ps1 -Task Test -Offline` nel worktree: **verde.** `check-rules.py` dentro la build; Maven 639 test, 0 falliti, 7
  saltati (le misure a richiesta); client-debug 37 su 37. `MultiSetTest` 48, `PlaygroundTest` 138, `SetBaseDraftTest` 12, `ListinoTest`
  3, `BenchTest` verdi; nessun atteso esistente cambiato.
- Lo stesso giro sul checkout condiviso era caduto solo su `ListinoTest`, con «mazzo assente: ctx-pino». La causa era nel `Listino.java`
  di SB-14 non ancora committato, che non è un file di questo blocco. Ho avvisato SB-14, che l'ha corretto. Sul checkout condiviso,
  con la bozza di SB-14 a quattro starter, `MultiSetTest` (48), `SetBaseDraftTest` (15), `ListinoTest` (3, dopo la correzione di
  SB-14) e `PlaygroundTest` (138) sono verdi.
- `python scripts/check-rules.py`: **verde**, «… rarità ammesse (COMMON, UNCOMMON, RARE, anche nel caricatore delle bozze) …».
  Più i quattro disallineamenti di [`sb-6b/check-rules-rarity.py`](sb-6b/check-rules-rarity.py), tutti rifiutati, e la prova di SB-2,
  tutta come attesa.
- **Banco da riga di comando con due set:** 20 partite per cella sulla bozza «attuale» con la mini, stili aggressivo, prudente e
  risorse, 1.800 partite in circa 5 secondi su 8 thread. Zero violazioni degli otto invarianti in partita. Quattro bound su cinque sono
  oltre il tetto: sono le quattro bound di oggi, come in SB-7, mentre Sbuffata è entro il tetto.
  [Rapporto](sb-6b/banco-attuale-mini-20.md). Il rapporto mostra la bozza come `server/attuale.json + mini.json`: è un difetto
  estetico di `Bench.shownSource`, che tratta il nome composto come un percorso relativo, e non l'ho corretto.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **non eseguito**. Il blocco non tocca `server/src/main` né `cards.sqlite`.

### Incidente sugli strumenti locali

Il worktree temporaneo aveva due collegamenti (junction) verso `.tools` e `client-debug/node_modules` del checkout, per non
duplicare JDK, Maven e dipendenze. Alla fine, `git worktree remove --force` ha seguito il collegamento e ha cancellato file veri del
checkout prima di fermarsi su un percorso troppo lungo:

- `.tools/apache-maven-3.6.3` e il suo zip: ripristinati alle 13:52 dalla regia con `scripts/bootstrap.py` (SHA-1 dello zip uguale a
  `scripts/toolchain.json`);
- parte di `.tools/client-c0/node-v24.13.0-win-x64`, `node.exe` compreso: riestratta dallo zip locale, il cui SHA-256 coincide con
  `SHASUMS256.txt`; 2.721 file su 2.721, tutti presenti e della dimensione dello zip; `node` v24.13.0 e `npm` 11.6.2 rispondono.

JDK, `m2`, Node 12, `npm-cache`, lo zip di Node 24 e `client-debug/node_modules` risultano intatti. I collegamenti sono stati tolti
prima di ogni altra operazione. SB-14 è stato avvisato: una sua misura è caduta alle 13:50:50 per «mvn.cmd non trovato» ed è stata
rilanciata, senza altri danni. **Lezione:** un worktree temporaneo non deve avere collegamenti verso cartelle del checkout; per toglierlo si tolgono prima
i collegamenti.

## Cosa non è provato

- **Rarità della bozza del Set Base:** non scritte (vedi sopra). Il caricatore le controllerà quando ci saranno.
- **Nessuna lettura della rarità:** nessun codice la usa, né i bot né il banco né il rapporto. È un dato, come dice R07.
- **Un secondo set di partenza** con regole diverse non si può comporre: è voluto. Due set di partenza indipendenti nella stessa
  bozza non hanno un caso d'uso oggi.
- **Ricerca dei mazzi e listino sulle bozze composte:** dovrebbero funzionare, perché leggono `json()` e usano `derive()` come il
  banco, ma non li ho provati. Il banco e il tetto delle bound sì.
- **La mini con la bozza del Set Base** è provata sullo stato di lavoro di SB-14, non ancora committato: se la bozza cambia ancora,
  una carta di base citata dalla mini può sparire o cambiare ruolo, come è già successo con `LethalHeroinDose` e `RottenBeer`.
- **Partita viva:** nessuna carta della mini, nessuna rarità e nessun set nuovo la raggiungono. Il server non conosce la bozza.

## Cosa serve a SB-8

SB-8 deve far avviare al server di sviluppo partite con la bozza, senza toccare il catalogo di produzione.

**Pronto da questo blocco:**

- un solo ingresso, `Draft.load(fonti)`, per uno o più set, da file o da classpath; `-Dsim.draft` con più fonti separate da `;`;
- per ogni mazzo `player(mazzo, id, random, policy)`, già usato dal runner: crea personaggio, basic, bound, last resort e mazzo
  regolare coi numeri della bozza;
- accessi per le liste e le viste: `deckIds()`, `characterOf`, `characterName`, `boundsAvailable`, `sets()` con nome e versione,
  `setOfCard`, `rarityOf`, `characterRarity`, e i testi `gui` di ogni carta (nome, descrizione, ruolo, guadagni, danno; immagine e
  sprite facoltativi);
- `Draft` e `DataCards` dipendono solo da modello, bot e Jackson, non da JUnit: si possono spostare in `server/src/main` così come sono.

**Lasciato a SB-8:**

- lo spostamento del caricatore in produzione dietro un profilo di sviluppo, e la scelta di quali file caricare;
- le classi Java delle carte di bozza, oggi nei sorgenti di test (`base.pino.*` di SB-14, `mini.*`): in produzione servono nel jar
  del profilo di sviluppo, o restano solo per i test;
- il protocollo e il client: id nuovi come `base.mara.Sgommata` o `mini.*`, carte senza immagine (`gui.image` assente), rarità non
  mostrata; ripieghi da decidere lì;
- che col profilo normale nessuna carta di bozza sia raggiungibile, e `TestServerContext` verde.

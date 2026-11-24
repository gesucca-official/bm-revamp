# SB-29 — Proposta: quick con categorie base e avanzata

Fase A, preparata da un esecutore il 24 novembre 2026 dopo [D188](../../set-base-decisioni.md#decisioni-del-proprietario):
SB-29 si fa come è scritto nel [piano](../../set-base-plan.md#sb-29--quick-con-categorie-base-e-avanzata); le modalità attuali
sono strumenti di prova, quindi qui non si progettano quelle definitive né O18. Solo proposta: nessun codice, regolamento o set
cambia prima dell'approvazione. Domande in fondo.

## Da dove si parte

- **Regola.** R01 (regolamento 2.0): «Quick assegna casualmente un personaggio con il suo starter, fra quelli indicati dal
  documento del set». Il Set Base 1.0, S1, dà a ogni starter nome e categoria (D182): base Spazienzio e Mara, avanzati
  Celestina, Piera e Beppe; la frase «La quick assegna a caso uno dei 5 starter, base o avanzato (R01)» è generata da
  `tools/set-catalog/set_catalog.py` (riga 403).
- **Categorie già nel file del set.** `server/src/main/resources/sets/base.json` porta `"category": "base" | "avanzato"` sugli
  starter; `Draft.STARTER_CATEGORIES` è il vocabolario, `DraftSource.deckCategory` e `DraftSource.starters()` le leggono,
  `LiveSet.starters()` le espone. Nessun nome di personaggio è scritto nel codice della partita viva.
- **Fabbrica.** `PlayerFactoryServiceImpl.randomStarter()` pesca con `ThreadLocalRandom` fra tutti gli starter;
  `craftRandomPlayer(playerId)` e `craftRandomComPlayer()` non ricevono categorie. Le chiamano
  `GameFactoryServiceImpl.craftQuick1vComGame`, `craftOpen1vComGame` (solo il computer) e `craftQuickMultiPlayerGame` (1v1 e
  FFA, umani e bot). Il profilo bozza ha la sua `BozzaPlayerFactory`, che pesca dal pool della bozza.
- **Ingresso.** `QuickGameQueuesController` riceve in `/app/game/quick/{1vCom|1v1|ffa}/join` un **corpo che è il solo
  playerId**; `DestinationPolicy.check` (righe 46–48) rifiuta il join se il corpo non coincide con l'utente. I bot FFA entrano da
  `/app/game/quick/ffa/join/com` come `QueuedPlayer("QueuedComPlayer", false)`. Le code tengono `QueuedPlayer(playerId, isHuman)`,
  con `equals` Lombok: `QueueServiceImpl.leaveAllQueues` usa `contains(player)` con un `QueuedPlayer` ricostruito. La lista
  della coda FFA esce serializzata su `/topic/game/quick/ffa/joined`.
- **Client.** `client-web`: `hub.tsx` (gruppo `modes`, tasto `quick`) chiama `Session.join(mode)`, che manda
  `link.send('/app/game/'+mode+'/join', user)`; `net/link.ts` `send(destination, body?)` e `net/stomp.ts` non passano header.
  `client-debug`: `choose-game.component.html` (menu `quickPlayModes`) e `WebsocketService` (`stompClient.send(..., {}, playerId)`).
  CLI: `scripts/bm-cli.cjs`, comando `join` con `mode`; le prove `scripts/cli-quick-*.cjs` sono lanciate da `QuickDuelCliTest`,
  `QuickFfaCliTest` e `OpenCompleteCliTest`, che fissano i giocatori con `@SpyBean PlayerFactoryService`.
- **Test attuale.** `QuickStartersTest` controlla che in 400 estrazioni escano tutti e cinque gli starter, conformi al file.

## 1. Regolamento e documento del set

**R01, secondo paragrafo, nuovo testo (regolamento 2.1):**

> Modalità: quick contro computer, quick 1v1, quick FFA (tutti contro tutti), open contro computer. **Nella quick ogni umano
> sceglie una categoria di starter fra quelle del documento del set e riceve a caso, con la stessa probabilità, un personaggio
> con uno starter di quella categoria; se non sceglie, riceve la categoria base. Il computer della quick contro computer riceve
> uno starter a caso della stessa categoria dell'umano; i computer aggiunti alla FFA, uno starter a caso fra tutti quelli del
> set. La coda non tiene conto delle categorie: una partita può opporre starter di categorie diverse.** Open usa un mazzo
> salvato dell'umano, conforme a R02, e un bot casuale. Open PvP non è disponibile. La coda 1v1 parte a due iscritti, FFA a
> cinque; l'avvio anticipato richiede almeno due iscritti. Le code possono includere bot.

**Revisione 2.1 — 24 novembre 2026 (proposta):** R01, la quick assegna lo starter a caso dentro la categoria scelta. Decisione
del proprietario D188 («facciamo sb-29 come è scritto: le modalità di gioco attuali sono una cosa da debug, quelle "vere"
andranno ripensate tutte in seguito») e D182 (categorie). Motivazione: dare al giocatore il controllo sulla difficoltà dello
starter senza aspettare carriere ed economia; la versione è minore perché cambia solo la preparazione della quick, non carte,
risoluzione o mazzi. Le partite archiviate restano valide.

**Chi dice cosa (R00).** Il regolamento dice il **sistema**: che si sceglie una categoria, l'estrazione uniforme dentro di
essa, il default, i computer, la coda mista. Il **documento del set** dice **quali** categorie esistono e quali starter ci
stanno (S1, già così). La sua frase di S1 diventa: «Ogni starter ha un nome e una categoria (D182): **base** Spazienzio e Mara;
**avanzati** Celestina, Piera e Beppe. Nella quick si sceglie la categoria e lo starter esce a caso al suo interno (R01).» La
riga cambia nel generatore (`set_catalog.py`, riga 403) e si rigenera con `--vivo`; nessuna carta cambia, quindi propongo una
revisione **1.0.1** del Set Base (domanda 3). Il regolamento non nomina «base» e «avanzato» come valori fissi: li prende dal set,
così un'espansione con un'altra categoria non lo cambia.

## 2. Q1: lo starter del computer

| Partita | Proposta | Perché |
|---|---|---|
| **Quick contro computer** | stessa categoria dell'umano | Chi sceglie «base» per imparare non incontra un avanzato; è la proposta già scritta in Q1 |
| **Bot aggiunti alla FFA** | uno qualunque dei cinque | Il bot è aggiunto alla coda, non appartiene a un umano: con più umani di categorie diverse non c'è una categoria «giusta»; resta il comportamento di oggi |
| **Computer dell'open** | invariato: uno qualunque dei cinque | Fuori perimetro (l'open non è quick) |

**Raccomandazione: quella sopra, la proposta di Q1 com'è.** La coda resta mista: in 1v1 e in FFA ognuno porta la propria
categoria, un base può incontrare un avanzato. Alternativa scartata: il bot FFA prende la categoria di chi lo aggiunge; obbliga a
cambiare anche `/join/com` (oggi `client-debug` lo manda con corpo vuoto) per poco guadagno, con modalità che saranno rifatte.

## 3. Protocollo

- **Come viaggia:** un **header STOMP `category`** sul SEND di `/app/game/quick/{1vCom|1v1|ffa}/join`. Il corpo resta il
  playerId, quindi `DestinationPolicy` e i suoi test non cambiano; destinazioni e canali `ready` restano gli stessi. Nel
  controller: `@Header(name = "category", required = false) String category` (Spring legge gli header nativi STOMP; un test di
  contesto lo prova). Scartate: un suffisso nella destinazione (tocca `DestinationPolicy`, le liste ammesse e i client in più
  punti) e un corpo JSON (rompe l'identità corpo = utente).
- **Valori:** quelli del file del set, oggi `base` e `avanzato` (`Draft.STARTER_CATEGORIES`), in minuscolo, confronto esatto.
- **Mancante o vuoto:** `base`. Così `client-debug`, CLI e client vecchi continuano a giocare senza modifiche, con uno starter
  base (oggi ricevono uno dei cinque: è l'unico cambiamento per loro).
- **Sconosciuto** (per esempio `esperto`, `Base`, o una categoria senza starter nel set vivo): `IllegalArgumentException` prima
  di entrare in coda o creare la partita; il gestore esistente del controller la manda su `/user/queue/game/error`, come gli
  altri rifiuti quick. Nessuna coda toccata.
- **In coda:** `QueuedPlayer` guadagna `category`, **esclusa da `equals`/`hashCode`** (`leaveAllQueues` confronta un
  `QueuedPlayer` ricostruito senza categoria) e **da JSON** (`@JsonIgnore`), così la lista FFA pubblica non cambia. I bot
  hanno `category` null = tutti.
- `docs/api.md`: le righe dei tre join dicono l'header facoltativo, il default e il rifiuto.

## 4. Server

- `PlayerFactoryService`: `craftRandomPlayer(String playerId, String category)` e `craftRandomComPlayer(String category)`, con
  `category` null = tutti gli starter (bot FFA, computer dell'open). Le firme vecchie spariscono; si adeguano
  `GameFactoryServiceImpl`, `BozzaPlayerFactory` (il profilo bozza resta col suo pool e ignora la categoria) e gli stub dei test.
- `GameFactoryService`: `craftQuick1vComGame(playerId, category)` passa la stessa categoria all'umano e al computer;
  `craftQuickMultiPlayerGame` legge la categoria da ogni `QueuedPlayer`.
- `PlayerFactoryServiceImpl.randomStarter(category)`: filtra `LiveSet.starters()` con `set.deckCategory(deck)`, pesca uniforme
  nel sottoinsieme; lista vuota = categoria sconosciuta → `IllegalArgumentException`. Le categorie valide sono quelle che hanno
  almeno uno starter nel set vivo; nessun nome di personaggio nel codice.
- **Caso con seme:** un `java.util.Random` iniettato nel costruttore (il bean ne crea uno senza seme; un costruttore di pacchetto
  per i test lo riceve con seme), al posto di `ThreadLocalRandom`. Per le prove di contesto restano gli `@SpyBean` di oggi.
- La validazione sta nella fabbrica (che conosce il set) e il controller la chiama prima di accodare: un solo punto.

## 5. Client

- **client-web**, senza riprogettare: sotto i quattro modi del hub, quando il modo scelto è quick, un gruppo di due radio
  «Starter: Base / Avanzato» con un suggerimento di una riga («Base: per imparare. Avanzato: personaggi più complessi.»),
  default Base, ricordato nella `Session` per la durata della sessione. Scompare per «Con un tuo mazzo». `Session.join(mode,
  deckId, category)` passa l'header; `Link.send(destination, body?, headers?)` e `stomp.ts` lo inoltrano a `client.publish`.
  L'etichetta dei valori viene da una tabella del client (`base` → «Base», `avanzato` → «Avanzato»). Da provare a 1366×768 e
  844×390, dove il hub è già denso: se a 844×390 non ci sta, il gruppo va sulla stessa riga del tasto «Gioca».
- **client-debug:** una `mat-button-toggle-group` Base/Avanzato accanto al tasto del menu quick; `WebsocketService.joinGame`
  manda `{category}` negli header (oggi `{}`). Senza toggle resta `base`.
- **CLI:** `bm-cli.cjs`, comando `join` con campo facoltativo `category`, inoltrato come header; `docs/cli.md` lo dice.

## 6. Verifiche della fase B

Test nuovi o estesi (devono poter fallire):

- `QuickStartersTest`: con `Random` a seme, 400 estrazioni per categoria → l'insieme uscito è **esattamente** quello degli starter
  della categoria nel file (quindi tutti escono e nessun altro); `craftRandomComPlayer(c)` idem; null → tutti e cinque;
  `esperto` → eccezione. Confronto con `deckCategory` del file, non con nomi scritti nel test.
- Test di contesto sul controller: header `avanzato` in 1vCom → umano e computer avanzati; header assente → base; header
  `esperto` → messaggio su `/user/queue/game/error` e nessuna coda; un giocatore accodato con categoria esce con
  `leaveAllQueues`; la lista FFA pubblica non contiene `category`.
- CLI: `cli-quick-duel-test.cjs` con un umano `base` e uno `avanzato` che **completa** la partita (lo starter reale, non lo stub,
  in uno scenario); `cli-quick-ffa-test.cjs` con categorie miste e bot.
- `client-web/tests/session.test.ts`: il join quick porta l'header della categoria scelta, l'open no.

Comandi, dalla [tabella delle aree](../../aree-protette.md): `./scripts/build.ps1 -Task Test -Offline` e
`python -X utf8 scripts/check-rules.py` (sempre; copie client del regolamento); `python -X utf8 tools/set-catalog/set_catalog.py
--vivo` poi `check-rules.py` e `prova-errori.py` (cambia il generatore); `./scripts/build.ps1 -Task TestServerContext -Offline` e
`python scripts/verify-match-manifests.py` (server vivo); `./scripts/build.ps1 -Task Server -Offline` (jar rifatto) poi
`./client-web/run.ps1 -Task Test`, `Build`, `Size`, `VerifyModes`, `VerifyFfa` e `VerifyLayout` a 1366×768 e 844×390 (più
1920×1080 per `VerifyLayout`); `python scripts/check-links.py`.

**Mutazioni previste (6):** (1) il filtro ignora la categoria; (2) il computer 1vCom pesca fra tutti; (3) default `avanzato` al
posto di `base`; (4) categoria sconosciuta ripiegata su `base` invece che rifiutata; (5) `category` dentro `equals` di
`QueuedPlayer`; (6) il client manda l'header solo in 1vCom. Ognuna deve far fallire almeno un test sopra.

## 7. Rischi e fuori perimetro

**Rischi.**

- `equals` di `QueuedPlayer`: con la categoria dentro, `leaveAllQueues` smetterebbe di togliere i giocatori (mutazione 5).
- Header nativi STOMP: se una versione di Spring non li risolvesse con `@Header`, ripiego su `SimpMessageHeaderAccessor
  .getFirstNativeHeader`; lo dice il test di contesto.
- Densità del hub a 844×390 (stesso rischio di SB-31).
- Le prove CLI e `VerifyModes` oggi accettano qualunque starter: con il default `base` alcune catture del client possono
  cambiare personaggio. È un cambiamento deliberato (D188), da dichiarare nel rapporto, non un atteso da forzare.
- Lavoro forse rifatto quando si ripenseranno le modalità (D188 (3)): per questo il minimo, senza schermate nuove.

**Fuori.** Lo sblocco degli avanzati con carriere ed economia (D182 (2), D188 (2)): restano scelti liberamente. Matchmaking per
categoria ed Elo. O18 (mazzo scelto in ogni coda, open PvP). L'open e il suo computer. Livelli del bot (SB-30). Mostrare agli
altri la categoria dell'avversario.

## 8. Ripartizione della fase B

Due esecutori **in sequenza**, perché le verifiche del client vogliono il jar del server e usano le porte di gioco:

1. **B1, server e regole:** R01 e revisione 2.1, generatore e set 1.0.1, copie client e allegato, protocollo, fabbrica,
   controller, `QueuedPlayer`, `bm-cli.cjs`, `docs/api.md` e `docs/cli.md`, test server e CLI, mutazioni 1–5. Proposta: Sonnet
   5.5, sforzo medio-alto (lavoro preciso ma ben delimitato).
2. **B2, client:** `client-web` (hub, `Session`, `Link`, `stomp.ts`, test) e `client-debug`, verifiche Playwright, mutazione 6.
   Proposta: Sonnet 5.5, sforzo medio. Parte dal commit di B1.

In alternativa un solo esecutore: il lavoro è piccolo, la divisione serve solo se il proprietario vuole spendere poco per blocco.

## Domande

1. **Q1:** computer della quick contro computer nella stessa categoria dell'umano, bot FFA fra tutti e cinque. Va bene?
2. **Default** quando il client non manda la categoria: `base` (proposta) oppure tutti e cinque come oggi?
3. **Versioni:** regolamento **2.1** e Set Base **1.0.1** (solo la frase di S1), oppure il set resta 1.0 e la frase sparisce
   dal documento del set, lasciando la regola solo in R01?
4. **client-web:** due radio «Base / Avanzato» sotto i modi, con suggerimento di una riga e default Base. Va bene così, o
   preferisci un'altra parola al posto di «Starter:» / «Avanzato»?
5. **Ripartizione:** due esecutori in sequenza (server poi client) o uno solo?

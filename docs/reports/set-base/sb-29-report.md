# SB-29 — Quick con categorie base e avanzata: rapporto

Blocco secondo la [proposta](../../design/set-base/sb-29-proposta.md), approvata in [D190](../../set-base-decisioni.md#decisioni-del-proprietario)
(24 novembre 2026, «Sì, come proponi») con una differenza: **senza categoria il giocatore riceve uno starter qualunque dei cinque**, come prima.
Fase B intera, un esecutore. Base `1d150a5` (HEAD all'avvio; D190 registrato per primo in `ef40110`).

## Esito

**Consegnato il 24 novembre 2026, STOP per la lettura del proprietario.** La quick ha la scelta della categoria: regolamento 2.1, Set Base 1.0.1,
header STOMP `category` sui tre join quick, fabbrica che pesca dentro la categoria, coda mista, due radio «Base / Avanzato» in `client-web`
(default Base), selettore minimo in `client-debug`, campo `category` nel CLI. Verdi: unitari del server (1506) e di `client-debug` (42),
`check-rules`, `prova-errori`, `verify-match-manifests`, `client-web` Test/Build/Size, `VerifyModes` a 1366×768 e 844×390, `VerifyFfa` a 1366×768,
sette mutazioni su sette respinte. **Rossi, tutti spiegati e non attribuibili a SB-29** (sotto): `VerifyLayout` alle tre misure e `VerifyFfa` a
844×390, più due «Event timeout» della voce R3 nelle prove CLI. Non fatto: una prova sul commit di base di `VerifyLayout` (vedi «Rossi»).

## Cosa cambia

1. **Regolamento 2.1** (R01 e revisione): l'umano sceglie una categoria fra quelle del documento del set e riceve a caso, con la stessa probabilità,
   uno starter di quella categoria; se non sceglie, uno a caso fra tutti. Il computer della quick contro computer pesca nella categoria dell'umano
   (fra tutti se l'umano non ha scelto), i computer della FFA fra tutti, la coda non tiene conto delle categorie. Il regolamento non nomina «base» e
   «avanzato»: li prende dal set. Copia in `client-debug/src/assets/docs/rules.md`.
2. **Set Base 1.0.1**, dal generatore (`set_catalog.py`: versione, data e regolamento richiesto 2.1 del documento vivo; revisione 1.0.1 aggiunta,
   la 1.0 conservata con «Richiedeva il regolamento 2.0»; frase di S1: «Nella quick si sceglie la categoria e lo starter esce a caso al suo interno
   (R01)»). Rigenerati `docs/sets/base.md`, la copia client, `docs/rules-catalog.json` e `manifest.json`; `cards.sqlite` identico per contenuto.
   Nessuna carta cambia.
3. **Protocollo.** Header STOMP `category` facoltativo su `/app/game/quick/{1vCom|1v1|ffa}/join`; il corpo resta il playerId e `DestinationPolicy`
   non cambia. Assente o vuoto = nessuna scelta = uno qualunque dei cinque. Valore sconosciuto (anche `Base`, ` base`) = `IllegalArgumentException`
   → `/user/queue/game/error`, prima di accodare o creare la partita. `docs/api.md` e `docs/cli.md` lo dicono.
4. **Server.** `PlayerFactoryService.craftRandomPlayer(id, category)`, `craftRandomComPlayer(category)` e `checkCategory(category)` (null = tutti; le
   categorie valide sono quelle con almeno uno starter nel set vivo: nessun nome di personaggio nel codice); `Random` iniettato (a seme nei test, un
   costruttore di pacchetto); `GameFactoryService.craftQuick1vComGame(id, category)` passa la stessa categoria a umano e computer; l'open e i computer
   della FFA chiamano con `null`. `QueuedPlayer.category`, fuori da `equals`/`hashCode` e da JSON (`leaveAllQueues` e la lista pubblica FFA non
   cambiano). Il profilo `bozza` valida con la fabbrica vera e ignora la categoria.
5. **Client.** `client-web`: `Session.category` (default `base`, per la durata della sessione e ripetuto da «Nuova partita»), `join(mode, deckId,
   category)`, `Link.send(destination, body, headers)` e `stomp.ts` inoltrano l'header; l'open non lo manda. Nel hub due radio «Base / Avanzato» con
   il suggerimento di una riga, solo per i modi quick; etichette da una tabella del client (`CATEGORIES`). `client-debug`: un `<select>`
   «Qualunque / Base / Avanzato» (default Qualunque, nessun header) accanto ai menu. CLI: `join` con `category` facoltativo, inoltrato come header.

## Attesi cambiati e decisione

| Dove | Cambio | Decisione |
|---|---|---|
| `MatchArchiveTest`, `cli-match-export-test.cjs` | `rulesVersion` 2.0 → 2.1; versione del set 1.0 → 1.0.1 | D190 (3) |
| `cli-open-complete-test.cjs`, `cli-quick-complete-test.cjs` | versione del set 1.0 → 1.0.1 | D190 (3) |
| `client-web/tests/session.test.ts` | i join quick portano `headers: {category: 'base'}` (finto del trasporto: registra gli header solo se ci sono) | D190 (4) |
| `client-web/tests/public.test.ts` | il controllo delle revisioni del set accetta numeri a tre parti (`1.0.1`): la regex vecchia leggeva `undefined`; il confronto resta lo stesso | D190 (3) |
| test del server che stubbano la fabbrica | solo la firma: `craftRandomPlayer(user, null)`, `craftRandomComPlayer(null)`, `craftQuick1vComGame(user, null)` | D190 (2): senza categoria, come prima |

**Nessuna cattura è cambiata.** Il CLI e `client-debug` senza categoria ricevono uno qualunque dei cinque, quindi le prove `cli-quick-*`, `cli-open-*` e
gli `@SpyBean` restano com'erano. `VerifyModes` (due umani di `client-web`, ora entrambi Base) è verde a entrambe le misure senza toccare un atteso.

## Verifiche

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | **verde**: 1506 test, 0 falliti, 23 saltati; `client-debug` 42/42 (compreso il nuovo caso dell'header) |
| `python -X utf8 scripts/check-rules.py` | verde: regolamento 2.1, Set Base 1.0.1, copie client, file identici alla generazione |
| `set_catalog.py --vivo` poi `prova-errori.py` | verdi (le quattro correzioni a mano sono respinte) |
| `-Task TestServerContext -Offline` | 1711 test, 4 rossi: due miei, corretti (sotto); due «Event timeout», **noti, voce R3** (`simultaneousJoinsCreateTwoDisjointDuels`, `ffaQueueAndLifecycle` move-exact) |
| `QuickDuelCliTest` + `QuickFfaCliTest` dopo la correzione | duello 11/11 verde, compreso `aBaseAndAnAdvancedHumanPlayTheirOwnStarters`; FFA 13/14, resta un «Event timeout» a `barrier` nello scenario `full`, **noto R3** (non manda categoria) |
| `python scripts/verify-match-manifests.py` | `allChecks: PASS` |
| `./client-web/run.ps1 -Task Test` | verde: 377 test (372 prima, 5 nuovi) |
| `VerifyAll -Only test,build,size,modes,ffa,layout` (jar rifatto) | `test`, `build`, `size` (JS 375.728 B gzip, totale 1.785.957 B), `modes` 1366×768 e 844×390, `ffa` 1366×768: **verdi**; `ffa` 844×390 e `layout` 1366×768, 844×390, 1920×1080: **rossi** |
| `python scripts/check-links.py` | 22 link rotti, tutti in file che non ho toccato (audit del 23 ottobre, carriere, `domain-model`, `technical-debt`…); nessuno nuovo da SB-29 |

Il hub con le due radio sta a 1366×768 e a 844×390 senza scorrere: [1366×768](sb-29/hub-1366x768.jpg), [844×390](sb-29/hub-844x390.jpg)
(a 844×390 la riga «Starter: Base Avanzato» e il suggerimento occupano due righe e «Gioca» resta nel foglio; non è servito spostare il gruppo).

**Nuovi test.** `QuickStartersTest` (6): con `Random` a seme, 400 estrazioni per categoria → l'insieme uscito è esattamente quello degli starter della
categoria nel file, per umano e computer; null → tutti e cinque; uniformità entro 5 punti su 3.000 estrazioni; categorie sconosciute rifiutate
(`esperto`, `Base`, `AVANZATO`, ` base`, `base `); vuoto/bianco = nessuna scelta; il seme rende ripetibile; `category` fuori dall'identità di `QueuedPlayer`.
`QuickCategoryContextTest` (5, server vero e client STOMP vero): 1vCom con `base` e con `avanzato` → umano e computer della categoria (6 giri per
categoria, fabbrica non stubbata); header assente o vuoto → la fabbrica riceve `null` (D190 (2)); `esperto`, `Base`, `AVANZATO`, ` base` sui tre join
→ errore su `/user/queue/game/error`, nessuna partita creata, nessuna coda toccata; giocatore accodato con categoria → la tiene, esce con
`leaveAllQueues`, la lista FFA pubblica non la mostra; 1v1 con un base e un avanzato → ognuno la sua. `cli-quick-duel-test.cjs`, scenario `categories`:
un umano `base` e uno `avanzato`, **starter veri** (le fixture rispondono solo ai join senza categoria), categoria di ciascun personaggio letta dal
file del set (`BM_STARTERS`), partita giocata con le carte vere e chiusa. `cli-quick-ffa-test.cjs`, scenario `categories`: due umani di categorie
diverse più un computer, lista pubblica senza `category`, uscita e export; il runner verifica che il computer sia stato chiesto con `null`.
`session.test.ts` (+5) e `a-websocket.spec.ts` (+5): l'header nei tre join quick, mai nell'open, ripetuto da «Nuova partita».

## Mutazioni

Sette, applicate una alla volta sul codice e ripristinate (`git status` pulito dopo ognuna), ciascuna respinta:

| # | Mutazione | Test che falliscono |
|---|---|---|
| 1 | il filtro ignora la categoria | `QuickStartersTest`: tutti e cinque come categoria, uniformità, categoria sconosciuta |
| 2 | il computer 1vCom pesca fra tutti | `QuickCategoryContextTest.humanAndComputerOfQuick1vComShareTheChosenCategory` |
| 3 | categoria mancante trattata come `base` (D190 (2)) | `withoutHeaderTheFactoryIsAskedForAnyStarter`, `QuickStartersTest.anUnknownCategory…` |
| 4 | categoria sconosciuta ripiegata su `base` | `unknownCategoryIsRefused…` (contesto), `QuickStartersTest.anUnknownCategory…` |
| 5 | `category` dentro `equals` di `QueuedPlayer` | `QuickStartersTest.theCategoryOfAQueuedPlayerIsNotItsIdentity`, `queuedPlayerKeepsTheCategory…` (contesto) |
| 6 | il client manda l'header solo in 1vCom | `session.test.ts`: 1v1, FFA e i join con header (6 rossi su 377) |
| 7 | il 1v1 scarta l'header | `quick1vWithOneBaseAndOneAdvanced…`, `unknownCategoryIsRefused…` |

## Rossi

- **`VerifyLayout`, tutte e tre le misure.** In ogni log: «the catalog has 117 cards, not 37» e «46 faces with damage, the catalog has 12»; a
  844×390 anche una serie di problemi O26 sullo scarto. Lo strumento aspetta ancora il catalogo 0.1 (37 carte) e il rapporto di SB-28 dice di non
  averlo rilanciato («né `VerifyLayout`/`VerifyAim`»): è un rosso di SB-28 che nessuno aveva ancora visto, non di questo blocco. A 1366×768 si
  aggiungono i bersagli al tocco (sotto). **Non provato sul commit di base** (servirebbe un jar e un client di base, cioè una copia con i propri
  `.tools`); la lettura del messaggio basta a dire che dipende dal catalogo, non dalla categoria.
- **Controllo dei bersagli al tocco, `revealed-…` 18×25 px** (`VerifyFfa` 844×390, `VerifyLayout` 1366×768): la copia scoperta di un computer con
  «tiene una vulnerabilità ×1,5» (Tossicone Scatarrante, Lavoro Fatto Bene, GARGANTUESCO IMPATTO SUL TU, Chiave da Tredici) ha un'area di tocco sotto i
  44 px. Compare a seconda delle carte pescate. **Riprodotto senza l'header** (client con il join senza categoria, quindi il server pesca uno dei
  cinque come prima di SB-29): `VerifyFfa` 844×390 rosso allo stesso modo, con altre due carte scoperte. È codice che questo blocco non tocca.
- **R3** («Event timeout» nelle prove CLI), a ogni giro un insieme diverso: voce già nel registro, non riprovata sulla base.
- **Corretti prima di consegnare**: nello scenario `categories` del duello la carta «ultima risorsa» non è sempre in mano con gli starter veri (ora si
  gioca la prima carta pagabile e mirabile, con la risposta del server; dopo 25 turni senza vincitore uno esce); nella FFA non si può chiedere la
  vista dopo l'uscita.

## Non verificato

`VerifyAll` completo, `VerifyDecks`, `VerifyResolution`, `VerifyAim`, `VerifyLifecycle`, 750×292: il blocco non tocca il tavolo né la geometria
(solo hub e trasporto). Nessun giro del proprietario nel client. `client-debug` non è stato avviato a mano: la modifica è coperta dai test
(`a-websocket.spec.ts`) e dalla compilazione di `npm test`, non dalla vista.

## Scelte prese

1. **Vuoto = nessuna scelta**: una intestazione vuota o fatta di spazi vale come assente; ` base` con lo spazio è invece sconosciuta.
2. **Validazione nella fabbrica** (`checkCategory`), chiamata dal controller prima di qualunque effetto; il controller riceve `PlayerFactoryService`
   come nuova dipendenza.
3. **Il test di contesto non fissa i giocatori**: i quattro punti dell'header si provano con la fabbrica vera; il caso assente/vuoto con `verify` su `null`
   (gli starter reali sono casuali, quindi «tutti e cinque» si prova nel test unitario con il seme).
4. **Scenario CLI senza esito di combattimento garantito**: se dopo 25 turni nessuno ha vinto, un umano esce e l'altro vince; il controllo registra
   quale dei due percorsi è avvenuto (`by combat` o `by forfeit`).
5. **`client-debug` con «Qualunque» di default**, così le sue catture restano quelle di oggi.
6. Revisione 1.0.1 nel generatore come riga in più: la 1.0 resta com'era nel documento.

## Cosa giudica il proprietario

Provare in `client-web`: scegliere **Avanzato** nella quick contro il computer e controllare che entrambi i lati siano avanzati (Celestina, Piera,
Beppe) e che, con **Base**, lo siano Spazienzio e Mara; in 1v1 con due account, uno per categoria, che la partita parta lo stesso; che la scelta resti
dopo «Nuova partita»; che a 844×390 il hub si legga. Il suggerimento di una riga è «Base: per imparare. Avanzato: personaggi più complessi.»

## Domande

1. **Rossi nuovi nel registro.** Vanno aggiunti a [rossi-noti.md](../rossi-noti.md): (a) `VerifyLayout` aspetta ancora il catalogo 0.1 (SB-28); (b) il
   controllo dei bersagli al tocco su `revealed-…` 18×25 px, che dipende dalle carte pescate (`VerifyFfa` 844×390, `VerifyLayout`)? Il file è fuori dal
   mio perimetro. Se sì, (a) è lavoro di SB-31 (adeguare lo strumento) e (b) un'area di tocco da allargare, anch'essa in SB-31.
2. **Documenti con la versione.** `docs/README.md` (righe 25 e 60) e `docs/setup.md` (riga 87) dicono ancora «regolamento 2.0» e «Set Base 1.0»; non
   li ho toccati (fuori perimetro, e il contratto vuole `README` solo se cambia il prossimo passo). Li allineo io, o li lascia alla chiusura?
3. **Prova sul commit di base di `VerifyLayout`.** Basta l'attribuzione qui sopra, o la vuole davvero su una copia di base?
4. **`output/pdf/botte-micidiali-*.pdf`** nominano «regolamento 2.0 | Set Base 1.0» nei metadati: sono generati da altro strumento, vanno rigenerati
   alla prossima stampa?

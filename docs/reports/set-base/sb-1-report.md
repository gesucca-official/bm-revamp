# SB-1 — Regole dei mazzi: rapporto

**Fatto il 7 novembre 2026 e approvato dal proprietario l'8 novembre**, con le sue parole: «Sì, entrambi» ([D42](../../set-base-plan.md#decisioni-del-proprietario)). Il regolamento passa alla **1.12**: un mazzo, starter o
personalizzato, ha esattamente 20 carte regolari con al massimo 2 copie per carta, la basic fissa del personaggio, due bound diverse del
personaggio e una last resort generica o propria. Un giocatore vivo con un mazzo conforme ha sempre una mossa. Server ed editor dei due
client rifiutano i mazzi fuori regola; i mazzi sintetici di verifiche e CLI sono riscritti in regola.

**La partita non cambia.** I due starter erano già conformi: nessuna carta, effetto, starter o bilanciamento cambia. La misura di SB-3 e
la prova d'identità di SB-6a (`PlaygroundTest`) restano verdi senza toccarle; l'unico atteso adeguato in `PlaygroundTest` è il suffisso di
versione nelle descrizioni di `sb-6a/attuale.json`, come fece la 1.11.

**Origine.** [D40](../../set-base-plan.md#decisioni-del-proprietario): SB-1 anticipato in parallelo a C4. Il proprietario ha approvato la
proposta della fase A con «Sì, procedi», con tutte le raccomandazioni (Q1–Q6, sotto).

**Per chi lavora a C4 sull'altra macchina:** dopo il pull **rifare il jar** (`./scripts/build.ps1 -Task Server -Offline`), perché cambiano
regolamento, catalogo SQLite e validazione del server. `verify-decks.mjs` è riscritto (vedi sotto): C4-8a, che usa `VerifyDecks`, deve
partire da questo commit. `style.css`, `scene.ts`, `table.tsx`, `readability.ts`, `sound.ts`, `resolution.ts` e `index.html` non sono stati
toccati.

## Decisioni del proprietario sulla fase A

| | Domanda | Decisione |
|---|---|---|
| Q1 | Campo facoltativo `exclusiveToCharacter` sulle carte, che il protocollo prima non aveva | Sì: aggiunto, come `role` e `damage` in 1.7–1.10 |
| Q2 | Mazzi salvati non validi | Rifiuto all'uso: restano nel profilo, l'avvio open li rifiuta |
| Q3 | Editor | Previene: basic con il personaggio, solo le carte ammesse, terza copia e ventunesima carta ignorate; segnala comunque i problemi |
| Q4 | Casi rari | Scenario open di VerifyResolution prima e dopo, alle due misure |
| Q5 | Frase del menu al tavolo su R03 | Resta a C4 (`table.tsx`): segnalata sotto |
| Q6 | `sb-10a/listino-base.json` | Non toccato: nessun test lo ha imposto |

## Regola

[Regolamento 1.12](../../game-rules.md), revisione motivata:

- **R02, costruzione del mazzo:** personaggio del catalogo; la basic del personaggio, una sola e fissa; due bound diverse legate al
  personaggio; una last resort generica o riservata al personaggio; esattamente 20 carte regolari, oggetti compresi, al massimo 2 copie
  ciascuna. Restano l'identificativo senza «/» (1.8) e i riferimenti al catalogo. Un mazzo fuori regola non si salva e non si usa per
  giocare. Le **carte iniziali** sono sempre tre.
- **R03:** un giocatore vivo con un mazzo conforme ha sempre una mossa. Finché il mazzo ha carte, dopo ogni mossa presentata, anche
  annullata, si ripesca (verificato nel motore, `Game.resolveMoves`): la mano resta piena con tre carte regolari, quindi una bound si gioca
  scartandone una. A mazzo vuoto entra la last resort. Il «passo» non si aggiunge.
- **R01a:** basic, bound e last resort descritte per ogni mazzo anziché per gli starter; R01 dice che l'open usa un mazzo conforme.

## Di chi sono le carte

| Carta | Dove sta il proprietario | Valori oggi |
|---|---|---|
| Bound | Nella classe Java (`boundToCharacter`), già prima di SB-1 e già inviato ai client | LittleSmack, LittleRage → Spazienzio; RottenSmile, PatheticBlade → Tossico |
| Basic | Nuova colonna `C_EXCLUSIVE_TO` di `CRD001_GUI`, allegato `exclusiveTo`, carta `exclusiveToCharacter` | BruiserGrab → Spazienzio; ToxicGrab → Tossico |
| Last resort | Stessa colonna; vuota = generica | Struggle generica: nessuna last resort riservata nel catalogo (D29 le porta con il Set Base) |

Regge per il Set Base: le bound di un personaggio possono essere quante si vuole, la basic resta una per personaggio, la last resort a tema
usa la stessa colonna. È lo stesso schema del playground (`basic` sul personaggio, `boundTo`, `exclusiveTo`). `check-rules.py` controlla
che allegato e SQLite coincidano, che ogni personaggio abbia una sola basic sua, e che i due starter rispettino R02 1.12 (20 carte, al
massimo 2 copie, basic propria, due bound diverse proprie secondo il costruttore Java, last resort ammessa).

## Validazione

**Server.** `DeckRules` (nuovo, `service.account`) applica le regole su carte del catalogo, mai su ciò che manda il client.

| Dove | Quando | Risposta |
|---|---|---|
| `UserAccountServiceImpl.addUserDeck` | Salvataggio | `Invalid deck: <regola>` su `account/error`, niente salvato |
| `PlayerFactoryServiceImpl.craftOpenPlayer` | Avvio open di un mazzo salvato prima della 1.12 | `Invalid deck: <regola>. Edit or delete it in your collection.` su `open/1vCom/error`, nessuna partita |

Messaggi: `Exactly 20 regular cards required, found N`, `At most 2 copies per card: <carta> has N`, `Bound card of another character:
<carta>`, `Bound cards must be different: <carta>`, `Two different bound cards of the character required, found N`, `Basic of another
character: <carta>`, `Last resort reserved to another character: <carta>`, più quelli di prima (`Basic and last resort required`,
`Regular card required`, `Bound card required`, `Unknown or missing card`, identificativo). Il protocollo cambia solo per il messaggio
d'errore dell'open e il campo facoltativo `exclusiveToCharacter` della carta (Q1), che compare anche nelle viste di partita e nell'archivio
come gli altri campi descrittivi; nessun effetto lo legge.

**Mazzi salvati prima (D20).** Nessuna eliminazione: restano nel profilo; client-web li segna «Non rispetta le regole attuali: modificalo o
cancellalo»; l'editor ne elenca i problemi; l'avvio open li rifiuta con la regola violata, che client-web traduce in «Il mazzo non rispetta
le regole attuali (…): correggilo o cancellalo nella collezione».

**client-web** (`deck.ts`, `collection.tsx`, solo classi esistenti). Scelto il personaggio, la basic si imposta da sola e compaiono solo le
sue bound (prese e lasciate con un tocco, al massimo due) e le last resort ammesse; cambiando personaggio escono bound e last resort
altrui, le regolari restano. Il pulsante di una carta regolare si disattiva alla seconda copia o a 20 carte. `problems()` segnala ogni
regola violata, anche per un mazzo salvato prima.

**client-debug** (editor dei mazzi). Stesse regole: liste filtrate per personaggio, basic automatica, bound a commutazione, copie e totale
limitati, elenco dei problemi sopra l'editor, salvataggio solo senza problemi.

## Mazzi sintetici: prima e dopo

| Dove | Prima | Cosa prova | Dopo | Stessa prova? |
|---|---|---|---|---|
| `verify-decks.mjs` bozze non valide | 1 Glare | Bozza incompleta non inviabile; «/» rifiutato | Mazzo Bruiser costruito passo passo | Sì, più: basic con il personaggio, solo bound e last resort ammesse, bound a commutazione, terza copia e 21ª carta disattivate, 19 carte non salvabili, cambio di personaggio |
| `verify-decks.mjs` «Strano» | Bound altrui, Glare×4, ShuffleFeet×3; poi 3 bound e 8 carte | Creazione, ricerca, togli una copia, un invio, annulla, sovrascrivi, open fino all'esito con sole carte del mazzo, «Nuova partita» | LittleSmack+LittleRage, dieci azioni ×2; togli e rimetti una copia (19 non salvabile); sovrascrittura SuperImpact→ExtremelyViolentBlow; mano + mazzo = 1+2+20 | Sì |
| `verify-decks.mjs` «Sei iniziali» | 5 bound, Cough×12 | Sei carte iniziali; stato reale senza mosse con la spiegazione di R03 nel menu | «Tossico»: mazzo valido del Junkie; all'avvio mano di 6 (ToxicGrab, 2 bound, 3 regolari) e mazzo 17 | **No per lo stato senza mosse**: è la lacuna che 1.12 chiude, non si provoca più |
| `verify-resolution.mjs` «C3 contrasti» | YouStop×7, Cocktail×5, Grab×3, WhatchaDoin×2, SuperImpact×3; 1 bound | Annullamento, oggetti pescati e consumati, morte, fine turno letale | YouStop, WhatchaDoin, AmphetamineReflexes, Glare, Cocktail, MarvelousCocktail, AnotherRottenBeer, Grab, SuperImpact, ExtremelyViolentBlow ×2; 2 bound | Vedi misura sotto |
| `verify-resolution.mjs` «C3 furti» | Steal×6, AnotherRottenBeer×5, EverythingIsDrug×3, MarvelousCocktail×2, MethDrivenRage×4; 1 bound | Furto, token, oggetto altrui | Steal, BeggingMoney, ShuffleFeet, AnotherRottenBeer, EverythingIsDrug, MarvelousCocktail, Cocktail, Grab, MethDrivenRage, GoingBerserk ×2; 2 bound | Vedi misura sotto |
| `cli-security-test.cjs` | 12 SuperImpact, 0 bound; poi 1 Grab e 5 RottenSmile altrui | Salvataggio, isolamento, rifiuto atomico, quattro modalità | Due mazzi Bruiser validi diversi (bound invertite, Grab al posto di SuperImpact) | Sì, più nove rifiuti nuovi controllati per messaggio |
| `cli-open-complete-test.cjs` | ShuffleFeet×1 e ×8, 0 e 2 bound uguali | Partite open complete e aritmetica esatta, rifiuti, record cambiato in partita, export | 20 azioni ×2 per personaggio; ogni turno la bound senza danni (LittleRage, RottenSmile) con scarto, poi Struggle; 30 turni, mazzo 17 − turni | Sì, più bound con scarto e rifiuto di un mazzo salvato con le regole 1.11. Perde solo la variazione «0 contro 2 bound», non più legale |
| `cli-restart-test.cjs` | ShuffleFeet×1 | Una partita open attiva al riavvio | Mazzo Bruiser valido | Sì |
| `deck.test.ts`, `deck-editor.spec.ts` | Nessun limite di copie, 5 bound ripetibili, bound altrui, 21 carte | Le regole 1.4 dell'editor | Le regole 1.12, casi limite compresi | Gli attesi cambiati erano la regola vecchia |

Restano come prima, perché non sono mazzi salvati: il bot senza mosse fissato in `OpenCompleteCliTest` (un `ComPlayer` con mazzo vuoto,
che serve proprio a rendere esatta l'aritmetica), i giocatori di `ArchiveLifecycleCliTest` e `GameFixtures`, i mazzi da due carte scritti
direttamente nell'archivio da `ApplicationPersistenceTest` (prova la persistenza, e conferma che un mazzo vecchio resta leggibile).

### Casi rari prima e dopo (Q4)

Stesso comando prima e dopo: `$env:BM_SCENARIOS='open'; ./client-web/run.ps1 -Task VerifyAll -Only 'build,resolution'`, una partita
open per mazzo contro il bot casuale, alle due misure. Prima: HEAD a2e2d2e, jar rifatto. Dopo: le modifiche di SB-1, jar rifatto dalla
verifica client ufficiale e riusato. Il bot è casuale e non ha seme: i numeri sono indicativi. Tutte e quattro le esecuzioni sono verdi.

Volte in cui il caso compare, somma dei due mazzi (1366×768 / 844×390):

| Caso | Prima | Dopo |
|---|---|---|
| Annullamento (`void`) | 7 / 8 | 4 / 3 |
| Oggetto consumato | 9 / 12 | 14 / 8 |
| Oggetto preso a un altro | 0 / 2 | 1 / 0 |
| Oggetto pescato sul tavolo | 4 / 4 | 7 / 6 |
| Oggetto sparito prima della risoluzione | 1 / 0 | 1 / 1 |
| Oggetto nominato e non sparito | 2 / 0 | 1 / 2 |
| Morte, morte con mossa inviata, fine partita | 2 / 2 | 2 / 2 |
| Fine turno letale | 2 / 1 | 0 / 1 |
| Bound con scarto | 10 / 17 | 20 / 11 |

**Nessun caso si è perso:** ognuno compare almeno una volta dopo, come prima. L'annullamento è circa dimezzato (6 carte di contrasto
contro 9 nel mazzo «contrasti»), il fine turno letale e l'oggetto preso a un altro restano rari come prima (uno per esecuzione al più).
Le bound con scarto aumentano, perché ora ogni mazzo ha due bound.

## Prove

- `UserAccountServiceImplTest` (unità, carte vere con il campo del catalogo): mazzo valido salvato; 19, 21 e 0 carte; terza copia di
  un'azione e di un oggetto; bound altrui, uguali, una, nessuna, tre, regolare al posto di una bound; basic altrui e regolare al posto della
  basic; last resort assente, regolare al suo posto, riservata ad altri e riservata al proprio personaggio (con un catalogo che riserva
  Struggle al Tossico, perché nel catalogo vero non ce n'è nessuna); carte speciali fra le regolari; carta sconosciuta.
- `OpenGameQueuesControllerTest` (unità): messaggio con la regola violata; «Deck unavailable» invariato negli altri casi.
- `DeckRulesContextTest` (contesto): i due starter del catalogo vero passano `DeckRules`; basic riservate e Struggle generica; un mazzo
  salvato con le regole 1.11 e uno con una bound altrui restano nel profilo ma l'avvio open li rifiuta; uno valido dà 6 carte in mano, 3
  iniziali.
- `OpenCompleteCliTest` + CLI: il rifiuto all'avvio passa per il server reale e STOMP.
- `check-rules.py`: allegato e SQLite su `exclusiveTo`, starter conformi.

## Verifiche

Una alla volta, dopo aver controllato che non girassero Maven, Java o verifiche di questo repository. SB-12a ha lanciato i suoi Maven
sullo stesso checkout durante il lavoro: ho aspettato ogni volta che finissero.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.** Maven 587 test, 0 falliti, 7 saltati (le misure a richiesta); client-debug 37 su
  37. La prima esecuzione ha fallito solo sui 37 confronti di testo di `PlaygroundTest` (`everyCardOfTheCurrentDraftMatchesTheCatalogCard`),
  perché `sb-6a/attuale.json` aveva ancora «Regolamento 1.11» nelle descrizioni: aggiornate a 1.12, come fece la 1.11. Nessun altro atteso
  toccato in `PlaygroundTest`; la prova d'identità e la misura di SB-3 sono verdi.
- `python scripts/check-rules.py`: regolamento e copia client allineati, starter conformi alle regole dei mazzi R02 1.12.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **verde.** 697 test, 0 falliti, 7 saltati, 6:49 min. Dentro ci sono le CLI
  riscritte, ciascuna nel suo test: `cli-security-test.cjs` (`WebSocketIdentityTest`), `cli-open-complete-test.cjs` (`OpenCompleteCliTest`),
  `cli-restart-test.cjs` (`RestartCliTest`), `cli-match-export-test.cjs` (`MatchArchiveCliTest`, versione 1.12); e `DeckRulesContextTest`.
- Jar rifatto da `VerifyAll` (`build.ps1 -Task Server -Offline`), poi `./client-web/run.ps1 -Task VerifyAll -Only
  'test,build,size,verify,modes,decks,profile,public,lifecycle'` alle misure ufficiali: **15 su 15 verdi**, 18:34 min. Unità client-web 269
  su 269; Size con `BM_OUT` sulla cartella temporanea della verifica. `VerifyDecks` a 1366×768 e 844×390: editor, «Strano» giocato fino
  all'esito (13 e 14 turni) con sole carte del mazzo, «Tossico» con mano di 6 e mazzo 17.
- Scenario open di `VerifyResolution`, prima e dopo: sopra.

Gli attesi cambiati, tutti legati alla regola vecchia o alla versione: `deck.test.ts` e `deck-editor.spec.ts` (regole 1.4 dell'editor),
`UserAccountServiceImplTest` (riscritto attorno a 1.12, il caso «/» invariato), `MatchArchiveTest` e `cli-match-export-test.cjs`
(`rulesVersion` 1.12), `sb-6a/attuale.json` (descrizioni 1.12), le asserzioni di `verify-decks.mjs` e delle CLI sui mazzi riscritti.

## Cosa non è provato

- **Una last resort riservata ad altri** non si provoca da client o CLI reali: il catalogo non ne ha. La provano `UserAccountServiceImplTest`
  e i test dei due editor.
- **Il rifiuto all'avvio di un mazzo vecchio nel browser** non è provato in partita reale: dall'interfaccia non si salva un mazzo fuori
  regola. Lo provano il contesto Spring, la CLI sul server reale e il test di `serverMessage`.
- **Lo stato «giocatore vivo senza mosse»** non si provoca più con mazzi conformi, quindi nemmeno la spiegazione nel menu al tavolo. Lo
  invariante «zero turni senza mosse legali» resta da misurare in SB-7/SB-12a sul banco.
- **La frase del menu al tavolo** (`table.tsx`) dice ancora: «Se nessuna carta è giocabile il gioco non prevede di passare: è un limite
  noto di questa versione». Con 1.12 il caso non si presenta più. `table.tsx` è di C4: va tolta o riscritta lì (Q5).
- **Prova umana** dell'editor nuovo: nessuna.

## Cosa resta

- **C4 sull'altra macchina:** pull, jar rifatto, poi C4-8a con `VerifyDecks` di questo commit; la frase del menu in `table.tsx`.
- **SB-2** e il resto del Set Base: le regole dei mazzi sono ora nel regolamento; il playground le aveva già (`rules` della bozza).

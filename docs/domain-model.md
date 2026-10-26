> Pianificazione aggiornata il 24 ottobre 2026: [roadmap della versione base approvata](roadmap.md). I01–I11 acquisiti; prossimo I26, CLI testuale leggero per gli scenari automatici applicativi senza UX (unit e integrazioni mirate restano diretti). Elo/I25/F38 rinviato, fuori dalla base. Chiusura I22 con prove tecniche e UX e approvazione esplicita del proprietario. Nessuna nuova implementazione con questa revisione; regolamento vigente 1.3. I censimenti e i risultati datati sotto restano storici nei rispettivi ambiti.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

# Modello di dominio

**Requisiti aggiornati, non implementati:** sessione unica/account, reconnect sul processo vivo, timeout multiplayer e forfait, esito draw al restart, dati di partita completi e CLI I26 per automazione non UX. Elo rinviato. Economia/inventario posseduto rinviati; modello di persistenza futuro libero. Le entità sotto descrivono esclusivamente il codice censito. Fonte: [decisioni del proprietario](E:/bm/docs/open-questions.md); [roadmap aggiornata](E:/bm/docs/roadmap.md).

**V** indica strutture e comportamento letti nel codice; **D** una deduzione; **M** un requisito non ricostruibile. Non tutte le classi rappresentano entità persistenti.

```mermaid
classDiagram
    Game "1" *-- "molti" Player
    Player <|-- ComPlayer
    Player "1" *-- "1" Character
    Player "1" o-- "molte" Card : mano e mazzo
    Game "1" o-- "molte" Move : pending e resolved
    Character "1" o-- "molte" Card : oggetti vicini
    Character "1" o-- "molti" Status
    Character "1" o-- "molti" Timer
    Move --> Card : nome della carta
    UserGuiDeck --> Card : selezioni
    UserGuiDeck --> CharacterCardView
```

## Entità del motore

| Entità | Contenuto e responsabilità verificati | Fonte |
|---|---|---|
| `Game` | `gameId`, mappa player, mosse pendenti/risolte, report temporali, contatore `turn`, tipo e log; validazione/invocazione mosse, fine partita | [Game](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Game.java:25) |
| `Player` | ID, personaggio, mano, pila mazzo, carta last resort; mescola/pesca/scarta; non è l'account persistito | [Player](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Player.java:14) |
| `ComPlayer` | Sottoclasse che mescola carte candidate, sceglie bersagli casuali e restituisce la prima mossa valida, oppure una mossa vuota | [ComPlayer.chooseMove](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/ComPlayer.java:17) |
| `Character` | `bindingName`, risorse, coda circolare oggetti, stati, immunità e timer; calcolo danni/variazioni risorse | [Character](E:/bm/bm-server/src/main/java/com/gsc/bm/model/Character.java:17) |
| `Card` / `AbstractCard` | Nome GUI, identificatore classe, descrizione HTML, immagine/sprite, costo, priorità, bersagli e flag; esecuzione tramite tre hook | [AbstractCard.resolve](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/AbstractCard.java:43) |
| `Move` | Nome carta, player/target/game ID, `choices`, flag void, report per bersaglio; controlli e applicazione costo/effetti | [Move](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Move.java:20) |
| `Resource` | `HEALTH`, `ALERTNESS`, `VIOLENCE`, `TOXICITY`, `ALCOHOL`; valori interi in una mappa | [Resource](E:/bm/bm-server/src/main/java/com/gsc/bm/model/Resource.java:5) |
| `Damage` | Tipo `HIT`, `CUT`, `POISON` e quantità mutabile | [Damage](E:/bm/bm-server/src/main/java/com/gsc/bm/model/Damage.java:14) |
| `Status` | Nome, descrizione, GOOD/BAD, INPUT/OUTPUT, proprietà colpita, funzioni quantità/tipo, durata opzionale, equip e single-use | [Status](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/status/Status.java:13) |
| `Timer` | Nome, contatore di turni e callback sul personaggio; non è un timer di tempo reale | [Timer](E:/bm/bm-server/src/main/java/com/gsc/bm/model/game/Timer.java:10) |

**V:** il dominio non ha un'entità `Turn`, un'entità pila scarti o un'entità deck runtime autonoma: `turn` e liste sono in `Game`/`Player`. Gli scarti rimuovono carte dalla mano senza conservarle in una zona separata. `Move` individua la carta per nome, non per ID d'istanza. Carte duplicate sono quindi indistinguibili nel comando. `AbstractCard.equals` confronta il nome e non ridefinisce `hashCode`.

## Personaggi effettivi

| Classe | HEALTH | ALERTNESS | Risorsa aggiuntiva | Capacità oggetti | Immunità iniziale |
|---|---:|---:|---|---:|---|
| [BigBadBruiser](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/character/BigBadBruiser.java:6) | 100 | 20 | VIOLENCE 25 | 1 | Nessuna |
| [ToxicJunkie](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/junkie/character/ToxicJunkie.java:6) | 100 | 35 | TOXICITY 10 | 3 | TOXICITY |

**V:** sono gli unici personaggi nel catalogo `CRD003_CHARACTERS`, e `PlayerFactoryServiceImpl.randomPlayer` sceglie soltanto fra questi due. I nomi visualizzati provengono da SQLite, non dai nomi Java.

## Tipi di carta e caricamento

**V:** `AbstractCharacterBoundCard` scarta la carta indicata da `DISCARD_ONE` e poi risolve gli effetti. `AbstractItemCard` imposta item, bersaglio SELF e costo vuoto; `Player.drawCard` sposta gli item sul campo. `BruiserGrab`/`ToxicGrab` sono basic action; `Struggle` è last resort. [Classi base](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/AbstractCharacterBoundCard.java:11), [Struggle](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/com/last/Struggle.java:12).

**V:** `bindingName` è il nome della classe relativo a `com.gsc.bm.model.cards.`; le factory usano `Class.forName` e un costruttore vuoto. Effetti, costi e priorità risiedono nel codice Java; nomi, descrizioni e immagini sono nel catalogo SQLite. Non esiste un interprete generico delle descrizioni delle carte. [CardFactoryServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/factories/CardFactoryServiceImpl.java:14).

**V:** `BrokenBeerBottle` è un token costruito direttamente da `AnotherRottenBeer`, senza riga nel catalogo. `SoberUp` ha un effetto scritto ma non una riga di catalogo e non configura `canTarget`; non basta la sua presenza per dichiararlo giocabile. [AnotherRottenBeer](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/com/items/AnotherRottenBeer.java:9), [SoberUp](E:/bm/bm-server/src/main/java/com/gsc/bm/model/cards/bitch/SoberUp.java:11).

## Account, collezione, mazzi e viste

**V:** credenziali persistite e giocatore di partita sono distinti. `UserAccountInfo` trasporta username, email, ruolo, mazzi e collezione. `UserGuiDeck` contiene ID mazzo, personaggio, basic action, last resort, lista character-bound e lista regolare. `UserStoredDeck` persiste soltanto i riferimenti alle classi. [UserAccountInfo](E:/bm/bm-server/src/main/java/com/gsc/bm/service/account/model/UserAccountInfo.java:14), [UserGuiDeck](E:/bm/bm-server/src/main/java/com/gsc/bm/service/account/model/UserGuiDeck.java:16), [UserDecksRecord](E:/bm/bm-server/src/main/java/com/gsc/bm/repo/external/UserDecksRecord.java:24).

**V:** `UserCollection` è un DTO generato dall'intero catalogo, non una tabella di possesso. La relazione account→mazzo è implementata tramite username e query repository, senza associazione ORM `@ManyToOne`. [UserAccountServiceImpl](E:/bm/bm-server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java:20).

**V:** `ClientSelfPlayerView.cardsInHand` contiene carte, `ClientOpponentView.cardsInHand` un numero. Entrambi espongono `deck` come conteggio. `ClientCharacterView` non espone `dead`, mentre il client lo usa; il tipo TypeScript Player dichiara `deckSize`. Sono differenze effettive, dettagliate in [API](E:/bm/docs/api.md).

**M:** rarità, inventario posseduto, pacchetti, acquisti, scambi, progressione, ranking, matchmaking per abilità e identità stabile delle copie non sono rappresentati nei modelli e percorsi censiti. Non se ne deduce una specifica di prodotto.

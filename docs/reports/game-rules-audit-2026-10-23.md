> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](../game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](../rules-conformance.md).

# Regole ricostruite dal codice

**Baseline provvisoria decisa dal proprietario (Q03):** per ora vale il comportamento del codice; raccordo con regolamento e bilanciamento avverranno dopo. Le divergenze sotto restano evidenze da caratterizzare, non richieste di cambiare automaticamente effetti/valori. Nuove decisioni esplicite: mazzi senza limiti di legalità per lo sviluppo, 30 s per mossa con altri umani e forfait, nessun timeout mossa vsCom, restart→draw senza restore. Queste ultime non sono implementazioni già presenti. Fonte: [decisioni del proprietario](../open-questions.md); [roadmap aggiornata](../roadmap.md).

**V:** comportamento staticamente verificato. **D:** conseguenza o rischio da provare. **M:** regola intenzionale sconosciuta. Questo documento non completa il regolamento e non assume che il codice esprima correttamente l'intenzione dell'autore.

## Preparazione e modalità

**V:** [QueueServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/session/QueueServiceImpl.java) avvia quick 1v1 a due iscritti e FFA a cinque; FFA può essere forzata con almeno due iscritti e includere bot. [GameFactoryServiceImpl](../../bm-server/src/main/java/com/gsc/bm/service/factories/GameFactoryServiceImpl.java) crea quick 1vCom, quick multiplayer o open 1vCom. Nelle quick, i personaggi sono scelti tra Bruiser e Junkie e i mazzi vengono dal catalogo; open usa il mazzo salvato dell'umano e un bot casuale. Non risultano modalità open PvP.

**V:** [Player.constructor](../../bm-server/src/main/java/com/gsc/bm/model/game/Player.java) mette in mano basic action e carte character-bound, mescola le regolari e pesca fino al valore iniziale `CARDS_IN_HAND=6`. I due starter verificati in `cards.sqlite/DCK001_STARTERS` contengono 20 carte; `DCK002_STARTERS_CH` assegna una basic, due character-bound e una last resort. Per mazzi utente la regola 20+2 è verificata soltanto nella UI [EditDeckComponent.isDeckValid](../../bm-web-client/src/app/user-hub/collection/edit-deck/edit-deck.component.ts), non dal server.

**V:** pescare un item lo aggiunge alla coda circolare del personaggio e provoca una nuova pesca; il superamento della capacità elimina gli oggetti più vecchi. A mazzo vuoto, `drawCard` aggiunge la last resort se non è già in mano. Basic e character-bound non sono rimosse da `discardCard`; le altre carte sì. Non esiste rimescolamento degli scarti. [Player.drawCard/discardCard](../../bm-server/src/main/java/com/gsc/bm/model/game/Player.java), [Character.constructor](../../bm-server/src/main/java/com/gsc/bm/model/Character.java).

## Turno e ordine di risoluzione

Il percorso verificato è [Game.submitMove/isReadyToResolveMoves/resolveMoves](../../bm-server/src/main/java/com/gsc/bm/model/game/Game.java):

1. Il giocatore invia una mossa; `Move.isValidFor` verifica alcuni requisiti e la mette fra le pendenti.
2. I morti senza mossa ricevono una mossa vuota; i bot senza mossa scelgono automaticamente.
3. Si risolve quando il numero di mosse è uguale al numero di giocatori e la partita non è già finita.
4. Le mosse già vuote vengono rimosse. Tutte le altre pagano i costi prima di qualsiasi effetto.
5. Ordinamento per priorità decrescente della carta, poi ALERTNESS decrescente del personaggio **dopo il pagamento dei costi**.
6. Ogni mossa applica gli effetti, scarta la carta giocata quando previsto e pesca una carta se la mano ha meno di sei carte. Non viene eseguito un ciclo di riempimento completo.
7. Le mosse risolte diventano il report del turno, le pendenti si svuotano; per ogni personaggio ancora vivo si risolvono gli effetti temporali.
8. Il turno aumenta; eventuali turni già pronti proseguono ricorsivamente, altrimenti si invoca la callback di aggiornamento.

**V:** a parità di entrambi i criteri non è espresso un terzo criterio di gioco; la lista conserva l'ordine degli inserimenti a parità di confronto. **D:** la sequenza di arrivo può decidere gli spareggi. **M:** non è documentato se questa sia la regola desiderata.

**V:** non c'è un controllo di morte del lanciatore prima di ogni effetto nella lista già ordinata: una mossa precedentemente presentata continua anche se il personaggio è stato ucciso durante il turno. Non c'è rollback se un effetto solleva un'eccezione. Questi sono comportamenti del percorso, non regole approvate.

## Validazione e bersagli

**V:** [Move.isValidFor](../../bm-server/src/main/java/com/gsc/bm/model/game/Move.java) controlla carta in mano, costo disponibile, mossa già presentata, scarto per character-bound e presenza dell'item indicato per NEAR_ITEM/FAR_ITEM. Lo scarto non può essere basic, character-bound o last resort. `SELF` è risolto da `Game.getTarget` come il giocatore stesso; gli altri target sono ID nella mappa giocatori.

**V:** non sono controllati sistematicamente appartenenza del mittente, esistenza/vitalità del target ordinario, conformità SELF/OPPONENT, partita già conclusa o compatibilità del personaggio con carte bound. `isVoid=true` esce immediatamente con esito valido; l'effettiva deserializzazione di questo flag da input ostile non è stata provata. **D:** input incoerenti possono aggirare invarianti o produrre null pointer; la UI non sostituisce la validazione server.

## Risorse, danni, stati e durata

**V:** morte con HEALTH **minore o uguale a zero**. Le risorse non hanno limiti generali minimi o massimi; `gainResource` e `loseResource` usano il valore assoluto dell'importo. Danni HIT/CUT/POISON passano per modificatori del lanciatore OUTPUT, del ricevente INPUT e infine della risorsa HEALTH. [Character](../../bm-server/src/main/java/com/gsc/bm/model/Character.java).

**V:** in `resolveTimeBasedEffects`, nell'ordine:

- Se TOXICITY > 0 e non immune: danno POISON pari a TOXICITY / 2 con divisione intera; non riduce automaticamente TOXICITY.
- Se ALCOHOL > 0 e non immune: perdita ALERTNESS pari ad ALCOHOL / 2, poi perdita ALCOHOL pari ad ALCOHOL / 2 + 1.
- Ogni timer diminuisce di uno; a valore <= 0 esegue la callback e viene rimosso.
- Gli stati decrementano `lastsForTurns` se presente; vengono rimossi solo quando il valore diventa < 0. Uno stato creato con 0 dura fino alla fine del turno corrente.

**V:** gli stati di danno si applicano in successione; per variazioni di risorsa il metodo restituisce il risultato del primo stato compatibile. `singleUse` imposta la durata a 0, ma la rimozione avviene a fine turno: il metodo non lo esclude da ulteriori applicazioni nello stesso turno. [Character.applyStatusToDamage/applyStatusToResourceChange](../../bm-server/src/main/java/com/gsc/bm/model/Character.java), [Status.expended](../../bm-server/src/main/java/com/gsc/bm/model/game/status/Status.java).

## Effetti concreti rappresentativi

Le righe seguenti riportano gli effetti del codice, non dedotti dai nomi; le quantità possono essere trasformate dagli stati descritti sopra.

| Carta / metodo | Comportamento verificato |
|---|---|
| [LittleSmack](../../bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/character/LittleSmack.java), hook self/target | +5 ALERTNESS a sé, 5 HIT al bersaglio; richiede scarto tramite classe base |
| [PatheticBlade](../../bm-server/src/main/java/com/gsc/bm/model/cards/junkie/character/PatheticBlade.java) | +5 TOXICITY a sé; 5 CUT e +5 TOXICITY al target |
| [SuperImpact](../../bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/SuperImpact.java) | Costo 25 VIOLENCE, priorità 0, 40 HIT |
| [Struggle](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/last/Struggle.java) | Costo vuoto, 5 HIT a sé e 10 HIT al bersaglio |
| [YouStop](../../bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/YouStop.java) | Costo 5 VIOLENCE, priorità 2; rende void una mossa successiva del target e gli dà 10 ALERTNESS se trovata |
| [AmphetamineReflexes](../../bm-server/src/main/java/com/gsc/bm/model/cards/junkie/AmphetamineReflexes.java) | Costo 10 TOXICITY, priorità 2; annulla mosse successive che bersagliano il lanciatore |
| [Grab](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/Grab.java) | Rimuove l'item vicino e chiama gli hook self/target dell'item; non ne chiama l'hook di logica aggiuntiva |
| [Steal](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/Steal.java) | Costo 10 ALERTNESS, priorità 0; sposta l'item dal target al lanciatore se ancora presente |
| [AnotherRottenBeer](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/items/AnotherRottenBeer.java) | +10 ALCOHOL e aggiunta del token BrokenBeerBottle |
| [MarvelousCocktail](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/items/MarvelousCocktail.java) | +20 ALCOHOL/TOXICITY, immunità a entrambi; timer 5 che svuota immunità e stati e infligge 20 POISON |
| [BadTrip](../../bm-server/src/main/java/com/gsc/bm/model/cards/junkie/BadTrip.java) | Toglie immunità TOXICITY, raddoppia la risorsa aggiungendone il valore, la ripristina con timer 3 |

**V:** una mossa annullata durante la risoluzione ha già pagato il costo; `applyEffectTo` produce “Didn't do anything!”, ma il ciclo esegue comunque scarto/pesca. La carta bound annullata non arriva al proprio scarto aggiuntivo. [Game.resolveMoves](../../bm-server/src/main/java/com/gsc/bm/model/game/Game.java), [Move.applyEffectTo](../../bm-server/src/main/java/com/gsc/bm/model/game/Move.java).

## Fine partita

**V:** `Game.isOver` è vero quando almeno N−1 personaggi sono morti. `getWinner` restituisce il superstite, altrimenti Optional vuoto; le viste lo rappresentano con `winner="NONE"`, anche prima della fine. Nessun premio o aggiornamento ranking è eseguito. La fine logica non rimuove automaticamente la sessione: serve che tutti gli utenti effettuino leave. [Game](../../bm-server/src/main/java/com/gsc/bm/model/game/Game.java), [GameSessionServiceImpl.leaveGame](../../bm-server/src/main/java/com/gsc/bm/service/session/GameSessionServiceImpl.java).

## Divergenze da non trasformare in nuove regole

| Evidenza | Divergenza e incertezza |
|---|---|
| [rules.md](../../bm-web-client/src/assets/docs/rules.md), sezione Resources | Dice HEALTH sotto 0; il codice usa <= 0. |
| Stesso regolamento, Moves Resolution | Descrive ALERTNESS, ma il codice ordina prima per priorità e paga prima tutti i costi. |
| Stesso regolamento, Regular Action Cards | Dice che hanno sempre un costo; `Glare`, `MadeOfStone` e altre hanno costo vuoto. |
| SQLite `CRD001_GUI`, chiave `bruiser.CantFeelAnything`; [classe](../../bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/CantFeelAnything.java) | Testo dice danno dimezzato; codice moltiplica per 0,35 e aggiunge 10 ALERTNESS. |
| SQLite `junkie.AmphetamineReflexes`; classe sopra | Testo promette +5 ALERTNESS, assente dal codice. |
| SQLite `com.items.RottenBeer`; [RottenBeer](../../bm-server/src/main/java/com/gsc/bm/model/cards/com/items/RottenBeer.java) e Grab | L'equip è aggiunto nell'hook che Grab non chiama: il percorso di consumo non lo applica. |
| [GoingBerserk](../../bm-server/src/main/java/com/gsc/bm/model/cards/junkie/GoingBerserk.java) | Due `setCost` successivi: il costo effettivo è solo ALCOHOL 10; non si sommano i costi. |
| [ToxicBloodDrain](../../bm-server/src/main/java/com/gsc/bm/model/cards/junkie/ToxicBloodDrain.java) | Rimuove immunità al target, ma aggiunge al lanciatore il timer che la ripristina. |
| [LethalHeroinDose](../../bm-server/src/main/java/com/gsc/bm/model/cards/junkie/LethalHeroinDose.java) e `gainResource` | Con TOXICITY t, aggiunge abs(t−30); per t>=30 non si limita a portarla a 30. |
| [Status.invertViewPoint](../../bm-server/src/main/java/com/gsc/bm/model/game/status/Status.java) | `ALL.containsAll(s)` restituisce ALL anche per sottoinsiemi validi: il filtraggio degli stati sul target non segue un'inversione selettiva. |

**M:** da chiarire ordine in caso di parità, valori negativi, stack degli stati, durata effettiva single-use, risoluzione dopo morte, effetti sui morti, target divenuto invalido, immobilità senza carte giocabili, resa/timeout e limiti di composizione mazzo. I comportamenti osservati sopra non sostituiscono queste decisioni del proprietario.

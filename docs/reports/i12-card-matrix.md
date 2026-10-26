# I12 — Matrice carta / regola / caso / test

24 ottobre 2026. Attesi da **regolamento 1.3 R07**, con R02–R06 per il ciclo della carta. Tutte le 39 carte del set e il token sono elencati sotto. Nessuna nuova regola o modifica di bilanciamento.

Abbreviazioni dei file in `bm-server/src/test/java/com/gsc/bm/`:

- **E**: `model/game/CatalogEffectsTest.java` (nuove prove dirette).
- **R**: `model/game/RulesConformanceTest.java` (prove conservate).
- **P**: `model/game/PlayerTest.java`; **I**: `model/game/RoundIsolationTest.java` (conservate).
- **C**: `model/game/CardRulesContractTest.java`; **K**: `CatalogRuntimeTest.java`.
- **W**: `WebSocketIdentityTest.java`, metodo `cliCardChoicesResolveItemsDiscardAndTokenAcrossThreeRounds`, scenario `scripts/cli-card-choices-test.cjs`.

Per **ogni riga** C.r07_cardTypes verifica tipologia/sottotipo; per tutte le 33 azioni C.r07_costPriorityAndTarget confronta costi/priorità/bersagli con il TSV normativo. E.lot3_costAvailabilitySubmitAndPayment prova tutte le 33 azioni: ogni risorsa insufficiente rifiutata separatamente, invio senza pagamento, pagamento effettivo di tutte le risorse. K.everyCatalogBindingLoads verifica le 37 righe SQLite non personaggio; K.startersAndOpeningHand carica entrambi i personaggi e i loro starter runtime. `check-rules.py` confronta R07 con descrizioni, classificazioni, starter e personaggi SQLite, allegato e copia client. Il token è generato, non è una riga del mazzo/catalogo SQLite.

| Carta | Regola e caso con atteso | Test degli effetti / interazioni |
|---|---|---|
| BigBadBruiser | R01/R07: H100 A20 V25, capacità 1, nessuna immunità | R.r01_initialCharacters; K.startersAndOpeningHand |
| ToxicJunkie | R01/R07: H100 A35 T10, capacità 3, immunità periodica T | R.r01_initialCharacters; K.startersAndOpeningHand; E.lot3_damageTypesAndSelfDamageTraverseBothFlows |
| LittleSmack | R02/R07: +5 A, 5 HIT, scarto regolare, bound persistente | E.lot1_boundEffectsDiscardAndPersist; E.lot3_boundRejectsEveryForbiddenDiscardWithoutMutation; W |
| LittleRage | R05/R07: +5 V, HIT×0,75 con troncamento, rimozione al primo fine turno | E.lot1_boundEffectsDiscardAndPersist |
| PatheticBlade | R02/R07: +5 T autore, 5 CUT e +5 T bersaglio; scarto e persistenza | E.lot1_boundEffectsDiscardAndPersist; E.lot3_damageTypesAndSelfDamageTraverseBothFlows |
| RottenSmile | R02/R07: +5 A autore, −5 A bersaglio, scarto e persistenza | E.lot1_boundEffectsDiscardAndPersist |
| BruiserGrab | R02/R04/R07: consumo di ciascuno dei cinque oggetti/token; persiste, oggetto scomparso senza effetto | E.lot2_grabConsumesEveryObjectAndBasicPersists; E.lot3_missingItemAtResolutionKeepsCostsAndExtraEffects |
| ToxicGrab | R02/R04/R07: come Grab, prima perde abs(A/2), anche con oggetto scomparso | E.lot2_grabConsumesEveryObjectAndBasicPersists; E.lot3_missingItemAtResolutionKeepsCostsAndExtraEffects; W |
| Struggle | R02/R07: 5 HIT self, 10 HIT target, scarto e ritorno unico a mazzo vuoto | E.lot1_plainAttackEffects; E.lot3_damageTypesAndSelfDamageTraverseBothFlows; P.emptyDeckSuppliesOnlyOneLastResortUntilUsed; W |
| Grab | R04/R07: rimuove oggetto, usa effetti senza hook speciale, gratuita e scartata | E.lot2_grabConsumesEveryObjectAndBasicPersists; R.r07_rottenBeerViaGrabDoesNotEquip; E.lot3_missingItemAtResolutionKeepsCostsAndExtraEffects |
| Steal | R02/R04/R07: −10 A, trasferisce senza consumo, capacità FIFO; se oggetto scomparso paga/scarta/pesca | E.lot2_stealSwapAndBeggingRespectCapacityWithoutConsumption; E.lot3_missingItemAtResolutionKeepsCostsAndExtraEffects; W |
| ShuffleFeet | R02/R07: scambia tutti gli oggetti, capacità dei destinatari | E.lot2_stealSwapAndBeggingRespectCapacityWithoutConsumption |
| BadEducation | R05/R07: toglie soltanto equip prima dei 10 HIT; conserva Glare che amplifica a 15 | E.lot2_badEducationRemovesOnlyEquipsBeforeDamage |
| BreakYourToy | R04/R07: distrugge senza consumo; se oggetto scomparso paga/scarta/pesca | E.lot3_destroyAndDrugConsumeWithoutItemEffects; E.lot3_missingItemAtResolutionKeepsCostsAndExtraEffects |
| CantFeelAnything | R05/R07: +10 A, 10 HIT diventano 3, durata 0 | R.r07_cantFeelAnythingUsesPoint35AndAddsAlertness |
| ExtremelyViolentBlow | R04/R07: V31−20=11, danno 20+11/2=25 HIT | E.lot1_extremeUsesResidualViolenceAfterPayment; E.lot3_damageTypesAndSelfDamageTraverseBothFlows |
| Glare | R05/R07: +15 V/A, 5 HIT diventano 7; durata 1 copre due turni | E.lot2_glareAndStoneActualDamageAndExpiry |
| HealingBlow | R05/R07: 30 HIT poi T/L a zero, anche negative e con modificatore risorsa | E.lot1_plainAttackEffects; E.lot1_healingEmptiesBothResourcesWithoutModifiers |
| MadeOfStone | R05/R07: +10 V, 5 CUT diventano 2, durata 3 copre quattro turni; applicazioni indipendenti | E.lot2_glareAndStoneActualDamageAndExpiry; I.statesAreIndependentAcrossGamesAndRepeatedApplications |
| SeagullFly | R05/R07: solo GOOD autore; 15→22 CUT via bottle, INPUT GOOD e BAD bersaglio entrambi applicati | E.lot2_seagullFiltersOnlyActorAndBottleConvertsBeforeInput; E.lot3_damageTypesAndSelfDamageTraverseBothFlows |
| SickeningBlow | R07: 10 HIT e +10 T | E.lot1_plainAttackEffects; E.lot3_damageTypesAndSelfDamageTraverseBothFlows |
| StunningBlow | R07: −10 A e 10 HIT | E.lot1_plainAttackEffects; E.lot3_damageTypesAndSelfDamageTraverseBothFlows |
| SuperImpact | R07: 40 HIT, costo 25 V | E.lot1_plainAttackEffects; E.lot3_damageTypesAndSelfDamageTraverseBothFlows; WebSocketIdentityTest.cliAuthenticatesReadsCatalogAndResolvesFixtureRound (I26) |
| YouStop | R04/R07: annulla soltanto successiva, +10 A solo se trovata; costi/scarto del counterato, bound conserva scarto aggiuntivo | R.r04_counterStillPaysAndDiscards; R.r04_counteredBoundKeepsAdditionalDiscard; E.lot3_countersDoNotCancelEarlierMoves |
| WhatchaDoin | R04/R07: paga V10/A10, copia soltanto target di MethDrivenRage (15 HIT), niente self/costo T replicato; nessun counter di mosse precedenti | E.lot3_whatchaCopiesTargetOnlyAfterBothCosts; E.lot3_countersDoNotCancelEarlierMoves |
| AmphetamineReflexes | R04/R07: annulla più mosse successive verso autore, lascia altri target/SELF e mosse precedenti; nessun +A | R.r07_amphetamineCountersWithoutAlertnessGain; E.lot3_reflexesMultipleOpponentsAndOtherTargets; E.lot3_reflexesIgnoresEarlierMoveAndOpponentSelfTarget |
| BadTrip | R06/R07: costo A10, T11→22, tre danni periodici da 11 prima del ritorno immunità al tick 3; T negativo | E.lot2_badTripThreeTicksIncludingCreationAndNegativeT |
| BeggingMoney | R02/R07: costo T25, copia oggetto senza rimuoverlo, capacità FIFO, −10 A anche senza oggetti, niente recupero alcol | E.lot2_stealSwapAndBeggingRespectCapacityWithoutConsumption; R.r07_beggingCopiesWithoutTakingOrSobering |
| Cough | R07: +5 T, −5 A bersaglio | E.lot1_plainAttackEffects |
| EverythingIsDrug | R04/R07: consuma senza effetto oggetto, +20 T anche se scomparso | E.lot3_destroyAndDrugConsumeWithoutItemEffects; E.lot3_missingItemAtResolutionKeepsCostsAndExtraEffects |
| GoingBerserk | R07: costo soltanto L10, 30 HIT | E.lot1_plainAttackEffects; E.lot3_costAvailabilitySubmitAndPayment; R.r07_goingBerserkOnlyCostsAlcohol |
| LethalHeroinDose | R07: sotto/al/sopra 30: T10→30/H100; T30→30/H70; T40→50/H60 | R.r07_heroinBelowAtAndAboveThirty |
| MethDrivenRage | R05/R07: costo T5, 5 HIT self attraverso OUTPUT e INPUT, 15 HIT target | E.lot1_plainAttackEffects; E.lot3_damageTypesAndSelfDamageTraverseBothFlows; E.lot3_whatchaCopiesTargetOnlyAfterBothCosts |
| PervertedMetabolism | R05/R07: T11/0/−11: cura 5/0/5 e T0/0/−22 | E.lot1_metabolismPositiveOddZeroAndNegativeToxicity |
| ToxicBloodDrain | R06/R07: T30−10, trasferisce 20; rimuove immunità bersaglio, timer1 restituisce immunità solo autore | R.r07_toxicDrainRestoresImmunityToActorOnly |
| CocktailOnTheGround | R02/R07: consumo +20 V/+15 L/+5 T | E.lot2_grabConsumesEveryObjectAndBasicPersists; E.lot2_drawingObjectsDoesNotActivateThem |
| RottenBeer | R04/R07: consumo +5 L, nessun equip perché hook speciale escluso | E.lot2_grabConsumesEveryObjectAndBasicPersists; R.r07_rottenBeerViaGrabDoesNotEquip |
| AnotherRottenBeer | R02/R07: consumo +10 L, token sul campo, limite capacità anche alla creazione | E.lot2_grabConsumesEveryObjectAndBasicPersists; E.lot2_tokenCreationEvictsOldestAndCanBeConsumed; W |
| MarvelousCocktail | R06/R07: consumo immunità T/L, +20 T/L; tick5 cancella stati/immunità prima dei 20 POISON | E.lot2_grabConsumesEveryObjectAndBasicPersists; R.r07_marvelousCocktailExpiresOnFifthTick |
| BrokenBeerBottle (token) | R05/R07: consumo equip GOOD OUTPUT, HIT×1,5→CUT, troncamenti e singleUse riapplicabile nel turno, indipendenza | E.lot2_grabConsumesEveryObjectAndBasicPersists; E.lot2_seagullFiltersOnlyActorAndBottleConvertsBeforeInput; I.statesAreIndependentAcrossGamesAndRepeatedApplications; W |

## Casi trasversali conservati e aggiunti

- R02: P.drawingItemsPlacesThemOnFieldAndContinuesUntilAction verifica la catena oggetto→azione e il collocamento sul campo; E.lot2_drawingObjectsDoesNotActivateThem prova per tutti i quattro oggetti del set che la pesca non attiva risorse, stati, timer, immunità o token.
- R02: P.excessItemsAreForgottenInFifoOrder, P.emptyDeckSuppliesOnlyOneLastResortUntilUsed, P.basicAndBoundCardsStayInHandButRegularActionsAreDiscarded; R.r02_boundDiscardsAndOnlyDrawsOne.
- R04: priorità, ALERTNESS dopo tutti i costi, parità per inserimento e morte reciproca in R; E.lot3_deadPhaseSkippedButPhaseStartedAliveFinishes controlla fasi, timer e durate dei morti e la fase iniziata viva che prosegue dopo veleno letale.
- R05/R06: stacking, primo modificatore risorsa, durata/singleUse, risorse senza limiti e ordine veleno/alcol/timer in R; E aggiunge trasformazione di tipo e autodanno su entrambi i flussi.
- R08/I11: tutti i cinque metodi di I restano intatti: isolamento tra partite/applicazioni, rollback dell'intero grafo e retry, rollback timer/costi/danni, letture coerenti durante risoluzione, fallimenti post-commit senza annullamento.
- CLI: W verifica errori recuperabili di TARGET_ITEM e DISCARD_ONE, due account reali, tre round e viste con attesi numerici; conservati scenari I26 di identità/duplicato/estraneo e primo round.

La matrice chiude i casi base e le interazioni richieste da I12; non pretende di enumerare tutte le permutazioni tra carte o di stabilire precedenze fra timer simultanei (R06 non ne garantisce). SoberUp resta esclusa. Nessuna prova UX nuova, partita completa o funzione degli incrementi seguenti è implicata.

-- SB-28 (D182 (3)): at the switch to the Set Base 1.0, the saved custom decks that contain a card of the Set Base 0.1 that left
-- the set are deleted. Nothing else is touched: a deck without those cards stays, even if R02 now refuses it (D20).
-- The six cards that left: bruiser.WhatchaDoin, com.ShuffleFeet, junkie.BadTrip, junkie.BeggingMoney, junkie.EverythingIsDrug,
-- junkie.GoingBerserk (docs/reports/set-base/sb-28-report.md, Fase B).
DELETE FROM USR002_DECKS WHERE
    json_extract(J_DECK, '$.basicActionCardClazz') IN ('bruiser.WhatchaDoin', 'com.ShuffleFeet', 'junkie.BadTrip',
        'junkie.BeggingMoney', 'junkie.EverythingIsDrug', 'junkie.GoingBerserk')
 OR json_extract(J_DECK, '$.lastResortCardClazz') IN ('bruiser.WhatchaDoin', 'com.ShuffleFeet', 'junkie.BadTrip',
        'junkie.BeggingMoney', 'junkie.EverythingIsDrug', 'junkie.GoingBerserk')
 OR EXISTS (SELECT 1 FROM json_each(J_DECK, '$.characterBoundCardsClazz') WHERE value IN ('bruiser.WhatchaDoin',
        'com.ShuffleFeet', 'junkie.BadTrip', 'junkie.BeggingMoney', 'junkie.EverythingIsDrug', 'junkie.GoingBerserk'))
 OR EXISTS (SELECT 1 FROM json_each(J_DECK, '$.regularCardsClazz') WHERE value IN ('bruiser.WhatchaDoin',
        'com.ShuffleFeet', 'junkie.BadTrip', 'junkie.BeggingMoney', 'junkie.EverythingIsDrug', 'junkie.GoingBerserk'));;

package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * Confronto di due carte fuori dalle partite (nato in SB-5 dentro DataCardsTest, condiviso da SB-6a): stessi campi e stesso
 * risultato su 200 stati casuali, con stati attivi, immunità e risorse mancanti. I giocatori degli scenari vengono dagli starter del catalogo.
 */
final class CardScenarios {
    static final int SCENARIOS = 200;
    private final SimulationCatalog java;

    /** Crea una nuova istanza della carta a ogni chiamata. */
    interface Maker {
        Card make() throws Exception;
    }

    CardScenarios(SimulationCatalog java) { this.java = java; }

    /** La prima differenza fra le carte create dai due costruttori, o null. */
    String difference(Maker expectedCard, Maker actualCard) throws Exception {
        String expected = shape(expectedCard.make()), actual = shape(actualCard.make());
        if (!expected.equals(actual)) return "Campi: " + expected + " invece di " + actual;
        for (long seed = 0; seed < SCENARIOS; seed++) {
            expected = outcome(expectedCard.make(), seed);
            actual = outcome(actualCard.make(), seed);
            if (!expected.equals(actual)) return "Scenario " + seed + ": " + expected + " invece di " + actual;
        }
        return null;
    }

    static String shape(Card card) {
        return card.getBindingName() + "|" + card.isItem() + "|" + card.isBasicAction() + "|" + card.isLastResort()
                + "|" + card.getBoundToCharacter() + "|" + card.getPriority() + "|" + new TreeSet<>(card.getCanTarget())
                + "|" + new TreeMap<>(card.getCost());
    }

    /** Applica la carta a uno stato ricavato dal seme e descrive tutto ciò che ne risulta. */
    private String outcome(Card card, long seed) throws Exception {
        Random random = new Random(seed);
        ComPlayer a = java.player(random.nextBoolean() ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, "seat-1", new Random(seed));
        ComPlayer b = java.player(random.nextBoolean() ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, "seat-2", new Random(seed + 1));
        Game game = new Game(List.of(a, b), "sim", false);
        arrange(a.getCharacter(), random);
        arrange(b.getCharacter(), random);
        String report;
        try {
            report = card.isItem() ? consume((AbstractCard) card, a.getCharacter(), b.getCharacter()) : play(card, game, a);
        } catch (RuntimeException failure) {
            report = failure.getClass().getSimpleName();
        }
        return report + " " + describe(a) + " " + describe(b);
    }

    /** Gli oggetti non stanno mai in mano: nel gioco li consuma solo Grab, che ne chiama gli effetti direttamente. */
    private static String consume(AbstractCard item, Character self, Character other) {
        return item.applyEffectOnSelf(self) + "/" + item.applyEffectOnTarget(self, other);
    }

    private static String play(Card card, Game game, ComPlayer player) {
        player.getCardsInHand().add(card);
        String target = card.getCanTarget().contains(Card.CardTarget.OPPONENT) ? "seat-2" : "SELF";
        Map<Move.AdditionalAction, String> choices = new HashMap<>();
        if (card.isCharacterBound()) {
            String discard = player.getCardsInHand().stream().map(Card::getName)
                    .filter(name -> !name.equals(card.getName())).findFirst().orElseThrow();
            choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
        }
        Move move = new Move(card.getName(), player.getPlayerId(), target, game.getGameId(), choices);
        return new TreeMap<>(card.resolve(game, move)).toString();
    }

    private static void arrange(Character character, Random random) {
        Map<Resource, Integer> resources = character.getResources();
        for (Resource resource : List.of(Resource.VIOLENCE, Resource.ALERTNESS, Resource.TOXICITY, Resource.ALCOHOL)) {
            if (random.nextInt(8) == 0) resources.remove(resource);
            else resources.put(resource, random.nextInt(60));
        }
        resources.put(Resource.HEALTH, 1 + random.nextInt(100));
        for (Resource immunity : List.of(Resource.TOXICITY, Resource.ALCOHOL))
            if (random.nextInt(4) == 0) character.getImmunities().add(immunity);
        int statuses = random.nextInt(4);
        for (int i = 0; i < statuses; i++) {
            final float factor = new float[] {0.5f, 1.5f, 2f}[random.nextInt(3)];
            character.getStatuses().add(Status.builder().name("arranged " + i)
                    .type(random.nextBoolean() ? StatusType.GOOD : StatusType.BAD)
                    .flow(random.nextBoolean() ? StatusFlow.INPUT : StatusFlow.OUTPUT)
                    .impactedProperty(Damage.DamageType.values()[random.nextInt(3)])
                    .amountFunction((StatusAmountFunction) n -> n * factor)
                    .singleUse(random.nextBoolean()).lastsForTurns(random.nextInt(3)).build());
        }
    }

    private static String describe(ComPlayer player) {
        Character character = player.getCharacter();
        List<String> statuses = character.getStatuses().stream().map(status -> status.getName() + "," + status.getDescription()
                + "," + status.getType() + "," + status.getFlow() + "," + status.getImpactedProperty() + "," + status.isSingleUse()
                + "," + status.isEquip() + "," + status.getLastsForTurns() + "," + status.getAmountFunction().apply(100f)
                + "," + status.getTypeFunction().apply(Damage.DamageType.HIT)).collect(Collectors.toList());
        return new TreeMap<>(character.getResources()) + " " + new TreeSet<>(character.getImmunities()) + " " + statuses
                + " " + character.getTimers().stream().map(t -> t.getName() + t.getTimer()).collect(Collectors.toList())
                + " " + character.getItems().stream().map(Card::getBindingName).collect(Collectors.toList())
                + " " + player.getCardsInHand().stream().map(Card::getBindingName).collect(Collectors.toList())
                + " " + player.getDeckSize();
    }
}

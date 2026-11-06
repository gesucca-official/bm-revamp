package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
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
import java.util.Queue;
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
    /** SB-11a: nelle carte che bersagliano un oggetto vicino, il giocatore ha oggetti sul campo e ne sceglie uno. */
    private final boolean withItems;

    /** Crea una nuova istanza della carta a ogni chiamata. */
    interface Maker {
        Card make() throws Exception;
    }

    CardScenarios(SimulationCatalog java) { this(java, false); }

    private CardScenarios(SimulationCatalog java, boolean withItems) {
        this.java = java;
        this.withItems = withItems;
    }

    /**
     * Gli stessi 200 scenari, ma le carte che bersagliano un oggetto vicino trovano oggetti sul campo (RottenBeer, CocktailOnTheGround,
     * MarvelousCocktail, AnotherRottenBeer e il token BrokenBeerBottle, tutte classi Java). Per seme: oggetto presente da solo, scelto
     * ma assente dal campo, sparito fra la scelta e la risoluzione, presente accanto a un altro. Le altre carte restano come prima.
     */
    CardScenarios withItems() { return new CardScenarios(java, true); }

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
    String outcome(Card card, long seed) throws Exception {
        Random random = new Random(seed);
        ComPlayer a = java.player(random.nextBoolean() ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, "seat-1", new Random(seed));
        ComPlayer b = java.player(random.nextBoolean() ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, "seat-2", new Random(seed + 1));
        Game game = new Game(List.of(a, b), "sim", false);
        arrange(a.getCharacter(), random);
        arrange(b.getCharacter(), random);
        String report;
        try {
            report = card.isItem() ? consume((AbstractCard) card, a.getCharacter(), b.getCharacter())
                    : withItems && card.getCanTarget().contains(Card.CardTarget.NEAR_ITEM) ? grab(card, game, a, seed) : play(card, game, a);
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

    /** La carta sceglie un oggetto vicino. Il modo dipende dal seme: 0 presente, 1 assente, 2 sparito alla risoluzione, 3 presente con un altro. */
    private String grab(Card card, Game game, ComPlayer player, long seed) throws Exception {
        List<Card> pool = List.of(java.card("com.items.RottenBeer"), java.card("com.items.CocktailOnTheGround"),
                java.card("com.items.MarvelousCocktail"), java.card("com.items.AnotherRottenBeer"), new BrokenBeerBottle());
        Random random = new Random(seed * 31 + 7);
        Card item = pool.get(random.nextInt(pool.size()));
        Card other = pool.get((pool.indexOf(item) + 1 + random.nextInt(pool.size() - 1)) % pool.size());
        int mode = (int) (seed % 4);
        Queue<Card> items = player.getCharacter().getItems();
        if (mode == 1 || mode == 3) items.add(other);
        if (mode != 1) items.add(item);
        player.getCardsInHand().add(card);
        Map<Move.AdditionalAction, String> choices = new HashMap<>();
        choices.put(Move.AdditionalAction.TARGET_ITEM, item.getName());
        Move move = new Move(card.getName(), player.getPlayerId(), "SELF", game.getGameId(), choices);
        if (mode == 2) items.remove(item);
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

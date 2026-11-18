package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Damage.DamageType;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ViewTableTest {
    private static final ViewTable.Flags FOUND = new ViewTable.Flags(true, true, true);

    private static BotView.CardSeen card(String name, boolean item, PrintedEffects.Step... steps) {
        return new BotView.CardSeen(name, name, item, false, false, false, 1,
                Set.of(Card.CardTarget.SELF, Card.CardTarget.OPPONENT), Map.of(), "", "", "", "", false,
                new PrintedEffects(List.of(steps)));
    }

    private static BotView.Seat seat(String id, List<BotView.CardSeen> items, Map<Resource, Integer> resources) {
        Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) res.put(r, 0);
        res.put(Resource.HEALTH, 100); res.putAll(resources);
        return new BotView.Seat(id, "public", false, false, res, Set.of(), List.of(), List.of(), 1, items);
    }

    private static BotView view(List<BotView.CardSeen> hand, List<BotView.CardSeen> items, Map<Resource, Integer> res) {
        return new BotView(1, new BotView.Self(seat("a", items, res), hand, 3, List.of()),
                List.of(new BotView.Opponent(seat("b", List.of(), Map.of()), 6, 3, List.of())), List.of(), Map.of(), Ruleset.D50);
    }

    private static void play(ViewTable table, String who, BotView.CardSeen card, String target, String item) {
        table.playTurn(List.of(new ViewTable.Play(who, card, target, null, item)), FOUND);
    }

    @Test void statusDurationAndCopiesCarryIntoTheNextTurn() {
        BotView.CardSeen defence = card("defence", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.STATUS)
                .damageType(DamageType.HIT).flow(StatusFlow.INPUT).statusType(StatusType.GOOD).factor(.5f).turns(1).build());
        BotView.CardSeen hit = card("hit", false, PrintedEffects.damage(true, DamageType.HIT, 10));
        BotView input = view(List.of(defence), List.of(), Map.of());
        ViewTable table = ViewTable.forecast(input, Map.of());
        play(table, "a", defence, "SELF", null);
        ViewTable branch = table.copy();
        play(branch, "b", hit, "a", null);
        assertEquals(95, branch.health().get("a"));
        assertTrue(branch.view("a").getSelf().getSeat().getStatuses().isEmpty());
        play(branch, "b", hit, "a", null);
        assertEquals(85, branch.health().get("a"));
        assertEquals(100, table.health().get("a"));
        assertEquals(0, table.view("a").getSelf().getSeat().getStatuses().get(0).getTurnsLeft());
        assertTrue(input.getSelf().getSeat().getStatuses().isEmpty());
    }

    @Test void singleUseConvertsEveryHitInItsTurnThenExpires() {
        BotView.CardSeen item = card("bottle", true, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.STATUS)
                .damageType(DamageType.HIT).flow(StatusFlow.OUTPUT).statusType(StatusType.GOOD).factor(1.5f)
                .convertTo(DamageType.CUT).singleUse(true).equip(true).build());
        BotView.CardSeen consume = card("consume", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.CONSUME).build());
        BotView.CardSeen hit = card("two hits", false, PrintedEffects.damage(true, DamageType.HIT, 3),
                PrintedEffects.damage(true, DamageType.HIT, 3));
        ViewTable table = ViewTable.forecast(view(List.of(consume, hit), List.of(item), Map.of()), Map.of());
        play(table, "a", consume, "SELF", item.getName());
        assertTrue(table.view("a").getSelf().getSeat().getStatuses().get(0).isSingleUse());
        play(table, "a", hit, "b", null);
        assertEquals(92, table.health().get("b"));
        assertTrue(table.view("a").getSelf().getSeat().getStatuses().isEmpty());
        play(table, "a", hit, "b", null);
        assertEquals(86, table.health().get("b"));
    }

    @Test void searchUsesItsPrintedTypesAndKeepsTheTokenThroughPeriodicDamage() {
        BotView.CardSeen hit = card("hit", false, PrintedEffects.damage(true, DamageType.HIT, 10));
        BotView.CardSeen search = card("search", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SEARCH)
                .searchedCard(hit.getBinding()).factor(2f).tokenDamage(Set.of(DamageType.POISON))
                .foundGains(Map.of(Resource.ALERTNESS, 7)).missedGains(Map.of(Resource.ALERTNESS, 1)).build());
        ViewTable table = ViewTable.forecast(view(List.of(search), List.of(), Map.of(Resource.TOXICITY, 10)), Map.of("hit", hit));
        play(table, "a", search, "SELF", null);
        assertEquals(90, table.health().get("a"));
        assertEquals(7, table.resources().get("a").get(Resource.ALERTNESS));
        assertEquals(1, table.view("a").getSelf().getRevealed().size());
        play(table, "b", hit, "a", null);
        assertEquals(70, table.health().get("a")); // the token amplifies POISON only
        play(table, "a", hit, "b", null);
        assertEquals(60, table.health().get("a"));
        assertTrue(table.view("a").getSelf().getSeat().getStatuses().isEmpty());
        play(table, "b", hit, "a", null);
        assertEquals(45, table.health().get("a")); // HIT is never amplified; next periodic POISON is plain.

        ViewTable missed = ViewTable.forecast(view(List.of(search), List.of(), Map.of()), Map.of("hit", hit));
        missed.playTurn(List.of(new ViewTable.Play("a", search, "SELF", null, null)), new ViewTable.Flags(true, false, false));
        assertEquals(1, missed.resources().get("a").get(Resource.ALERTNESS));
        assertTrue(missed.view("a").getSelf().getRevealed().isEmpty());
    }

    @Test void worldDrawsConcreteCardsAndReplacesTheOldestItem() {
        BotView.CardSeen action = card("action", false), old = card("old", true), fresh = card("fresh", true),
                next = card("next", false), last = card("last", false);
        BotView input = view(List.of(action), List.of(old), Map.of());
        List<BotView.CardSeen> deck = new ArrayList<>(List.of(next, fresh));
        ViewTable table = ViewTable.world(input, Map.of(), Map.of("a", List.of(action), "b", List.of()),
                Map.of("a", deck, "b", List.of()), Map.of("a", last, "b", last));
        play(table, "a", action, "SELF", null);
        assertEquals(List.of(fresh), table.view("a").getSelf().getSeat().getItems());
        assertEquals(List.of(next), table.view("a").getSelf().getHand());
        assertEquals(0, table.view("a").getSelf().getDeckSize());
        assertEquals(2, deck.size());
        play(table, "a", next, "SELF", null);
        assertEquals(List.of(last), table.view("a").getSelf().getHand());
    }

    @Test void aSuccessfulSearchRevealsItsCopyEvenWithoutAToken() {
        BotView.CardSeen hit = card("hit", false);
        BotView.CardSeen search = card("search", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SEARCH)
                .searchedCard("hit").build());
        ViewTable table = ViewTable.world(view(List.of(search), List.of(), Map.of()), Map.of("hit", hit),
                Map.of("a", List.of(search), "b", List.of()), Map.of("a", List.of(hit), "b", List.of()), Map.of());
        play(table, "a", search, "SELF", null);
        assertEquals(1, table.view("b").getOpponents().get(0).getRevealed().size());
        assertTrue(table.view("a").getSelf().getSeat().getStatuses().isEmpty());
    }

    @Test void losingTheLastCopyKeepsOneWholeTurnOfExposure() {
        BotView.CardSeen hit = card("hit", false);
        BotView.CardSeen search = card("search", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SEARCH)
                .searchedCard("hit").factor(2f).tokenDamage(Set.of(DamageType.POISON)).build());
        ViewTable table = ViewTable.world(view(List.of(search), List.of(), Map.of(Resource.TOXICITY, 10)), Map.of("hit", hit),
                Map.of("a", List.of(search), "b", List.of()), Map.of("a", List.of(hit), "b", List.of()), Map.of());
        play(table, "a", search, "SELF", null);
        table.sides.get("a").hand.clear(); // discarded, without playing the named hit
        table.playTurn(List.of(), FOUND);
        assertEquals(80, table.health().get("a"));
        assertEquals(0, table.view("a").getSelf().getSeat().getStatuses().get(0).getTurnsLeft());
        ViewTable copy = table.copy();
        copy.playTurn(List.of(), FOUND);
        assertEquals(70, copy.health().get("a"));
        assertTrue(copy.view("a").getSelf().getSeat().getStatuses().isEmpty());
        assertFalse(table.view("a").getSelf().getSeat().getStatuses().isEmpty());
        copy.playTurn(List.of(), FOUND);
        assertEquals(65, copy.health().get("a"));
    }

    // ---- SB-19 B2a (D133): timers ----

    private static PrintedEffects.TimerText timer(String name, int turns, List<Resource> grants, List<Resource> revokes, boolean clears, int poison) {
        return PrintedEffects.TimerText.builder().name(name).turns(turns).grants(grants).revokes(revokes).clears(clears).poison(poison).build();
    }

    /** A card that starts the given timers on its author. */
    private static BotView.CardSeen timed(String name, boolean item, List<PrintedEffects.TimerText> timers, PrintedEffects.Step... steps) {
        return new BotView.CardSeen(name, name, item, false, false, false, 1, Set.of(Card.CardTarget.SELF, Card.CardTarget.OPPONENT),
                Map.of(), "", "", "", "", false, new PrintedEffects(List.of(steps), List.of(), timers));
    }

    private static BotView.Seat seatWith(String id, Set<Resource> immunities, List<BotView.StatusSeen> statuses, List<BotView.TimerSeen> timers,
                                         Map<Resource, Integer> resources, List<BotView.CardSeen> items) {
        Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) res.put(r, 0);
        res.put(Resource.HEALTH, 100); res.putAll(resources);
        return new BotView.Seat(id, "public", false, false, res, immunities, statuses, timers, 1, items);
    }

    private static BotView twoSeats(BotView.Seat a, BotView.Seat b, List<BotView.CardSeen> hand) {
        return new BotView(1, new BotView.Self(a, hand, 3, List.of()), List.of(new BotView.Opponent(b, 6, 3, List.of())), List.of(), Map.of(),
                Ruleset.D50);
    }

    private static Map<String, BotView.CardSeen> catalogOf(BotView.CardSeen... cards) {
        Map<String, BotView.CardSeen> catalog = new HashMap<>();
        for (BotView.CardSeen c : cards) catalog.put(c.getBinding(), c);
        return catalog;
    }

    private static List<String> timersOf(ViewTable table, String id) {
        List<String> names = new ArrayList<>();
        for (BotView.TimerSeen t : table.view(id).getSelf().getSeat().getTimers()) names.add(t.getName() + ":" + t.getTurnsLeft());
        return names;
    }

    @Test void aTimerInTheViewTicksEveryEndOfTurnAndFiresAtZero() {
        BotView.CardSeen source = timed("source", false, List.of(timer("grace", 2, List.of(Resource.TOXICITY), List.of(), false, 0)));
        BotView input = twoSeats(seatWith("a", Set.of(), List.of(), List.of(new BotView.TimerSeen("grace", 2)), Map.of(), List.of()),
                seatWith("b", Set.of(), List.of(), List.of(), Map.of(), List.of()), List.of());
        ViewTable table = ViewTable.forecast(input, catalogOf(source));
        table.playTurn(List.of(), FOUND);
        assertEquals(List.of("grace:1"), timersOf(table, "a"));
        assertTrue(table.view("a").getSelf().getSeat().getImmunities().isEmpty());
        ViewTable branch = table.copy();
        branch.playTurn(List.of(), FOUND);
        assertTrue(timersOf(branch, "a").isEmpty());
        assertEquals(Set.of(Resource.TOXICITY), branch.view("a").getSelf().getSeat().getImmunities());
        // The copy ticked, the table did not: a branch never changes the table it came from, nor the view it was built from.
        assertEquals(List.of("grace:1"), timersOf(table, "a"));
        assertEquals(2, input.getSelf().getSeat().getTimers().get(0).getTurnsLeft());
    }

    @Test void aTimerFiresAfterThePeriodicEffectsOfItsTurn() {
        BotView.CardSeen source = timed("source", false, List.of(timer("grace", 1, List.of(Resource.TOXICITY), List.of(), false, 0)));
        BotView input = twoSeats(seatWith("a", Set.of(), List.of(), List.of(new BotView.TimerSeen("grace", 1)), Map.of(Resource.TOXICITY, 10), List.of()),
                seatWith("b", Set.of(), List.of(), List.of(), Map.of(), List.of()), List.of());
        ViewTable table = ViewTable.forecast(input, catalogOf(source));
        table.playTurn(List.of(), FOUND);
        assertEquals(95, table.health().get("a")); // the poison of this turn comes first, then the immunity
        assertEquals(Set.of(Resource.TOXICITY), table.view("a").getSelf().getSeat().getImmunities());
        table.playTurn(List.of(), FOUND);
        assertEquals(95, table.health().get("a"));
    }

    @Test void aCardStartsATimerOnItsAuthorAndTheTurnItIsPlayedCounts() {
        PrintedEffects.Step notImmune = PrintedEffects.Step.builder().kind(PrintedEffects.Kind.NOT_IMMUNE).onTarget(true)
                .resource(Resource.TOXICITY).build();
        BotView.CardSeen drainNow = timed("drain 1", false, List.of(timer("Blood Drain", 1, List.of(Resource.TOXICITY), List.of(), false, 0)), notImmune);
        BotView.CardSeen drainLater = timed("drain 2", false, List.of(timer("Blood Drain", 2, List.of(Resource.TOXICITY), List.of(), false, 0)), notImmune);
        BotView input = twoSeats(seatWith("a", Set.of(), List.of(), List.of(), Map.of(), List.of()),
                seatWith("b", Set.of(Resource.TOXICITY), List.of(), List.of(), Map.of(), List.of()), List.of(drainNow, drainLater));
        Map<String, BotView.CardSeen> catalog = catalogOf(drainNow, drainLater);
        ViewTable one = ViewTable.forecast(input, catalog);
        play(one, "a", drainNow, "b", null);
        assertTrue(timersOf(one, "a").isEmpty()); // one turn: it fires at the end of the turn it was played
        assertEquals(Set.of(Resource.TOXICITY), one.view("a").getSelf().getSeat().getImmunities());
        assertTrue(one.view("b").getSelf().getSeat().getImmunities().isEmpty()); // the target stays without it
        ViewTable two = ViewTable.forecast(input, catalog);
        play(two, "a", drainLater, "b", null);
        assertEquals(List.of("Blood Drain:1"), timersOf(two, "a"));
        assertTrue(two.view("a").getSelf().getSeat().getImmunities().isEmpty());
        two.playTurn(List.of(), FOUND);
        assertTrue(timersOf(two, "a").isEmpty());
        assertEquals(Set.of(Resource.TOXICITY), two.view("a").getSelf().getSeat().getImmunities());
    }

    @Test void aVoidedCardStartsNoTimer() {
        PrintedEffects.Step notImmune = PrintedEffects.Step.builder().kind(PrintedEffects.Kind.NOT_IMMUNE).onTarget(true)
                .resource(Resource.TOXICITY).build();
        BotView.CardSeen drain = timed("drain", false, List.of(timer("Blood Drain", 3, List.of(Resource.TOXICITY), List.of(), false, 0)), notImmune);
        BotView.CardSeen stop = card("stop", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).build());
        BotView input = twoSeats(seatWith("a", Set.of(), List.of(), List.of(), Map.of(), List.of()),
                seatWith("b", Set.of(), List.of(), List.of(), Map.of(Resource.ALERTNESS, 10), List.of()), List.of(drain));
        ViewTable countered = ViewTable.forecast(input, catalogOf(drain, stop));
        countered.playTurn(List.of(new ViewTable.Play("a", drain, "b", null, null), new ViewTable.Play("b", stop, "a", null, null)), FOUND);
        assertTrue(timersOf(countered, "a").isEmpty());
        ViewTable free = ViewTable.forecast(input, catalogOf(drain, stop));
        free.playTurn(List.of(new ViewTable.Play("a", drain, "b", null, null)), FOUND);
        assertEquals(List.of("Blood Drain:2"), timersOf(free, "a"));
    }

    @Test void aConsumedItemStartsItsTimerAndItsEndTakesTheImmunityAway() {
        BotView.CardSeen santino = timed("santino", true, List.of(timer("Santino", 2, List.of(), List.of(Resource.ALCOHOL), false, 0)),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.IMMUNE).resource(Resource.ALCOHOL).build());
        BotView.CardSeen consume = card("consume", false, PrintedEffects.Step.builder().kind(PrintedEffects.Kind.CONSUME).build());
        BotView input = twoSeats(seatWith("a", Set.of(), List.of(), List.of(), Map.of(), List.of(santino)),
                seatWith("b", Set.of(), List.of(), List.of(), Map.of(), List.of()), List.of(consume));
        ViewTable table = ViewTable.forecast(input, catalogOf(santino, consume));
        play(table, "a", consume, "SELF", "santino");
        assertEquals(Set.of(Resource.ALCOHOL), table.view("a").getSelf().getSeat().getImmunities());
        assertEquals(List.of("Santino:1"), timersOf(table, "a"));
        table.playTurn(List.of(), FOUND);
        assertTrue(table.view("a").getSelf().getSeat().getImmunities().isEmpty());
        assertTrue(timersOf(table, "a").isEmpty());
    }

    @Test void aTimerThatClearsTakesEveryImmunityAndStatusThenPoisons() {
        BotView.CardSeen cocktail = timed("cocktail", true, List.of(timer("Cocktail", 1, List.of(), List.of(), true, 20)));
        BotView.StatusSeen status = new BotView.StatusSeen("guard", "", StatusType.GOOD, StatusFlow.INPUT, false, false, 5, null, null, null,
                DamageType.HIT, .5f, null);
        BotView input = twoSeats(seatWith("a", Set.of(Resource.TOXICITY, Resource.ALCOHOL), List.of(status), List.of(new BotView.TimerSeen("Cocktail", 1)),
                Map.of(), List.of()), seatWith("b", Set.of(), List.of(), List.of(), Map.of(), List.of()), List.of());
        ViewTable table = ViewTable.forecast(input, catalogOf(cocktail));
        table.playTurn(List.of(), FOUND);
        assertEquals(80, table.health().get("a"));
        assertTrue(table.view("a").getSelf().getSeat().getImmunities().isEmpty());
        assertTrue(table.view("a").getSelf().getSeat().getStatuses().isEmpty());
        assertTrue(timersOf(table, "a").isEmpty());
    }

    @Test void theTimerTextsOfTheCardsNameAndMeasureTheEngineTimers() {
        com.gsc.bm.model.Character a = new com.gsc.bm.model.cards.junkie.character.ToxicJunkie(),
                b = new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser();
        new com.gsc.bm.model.cards.junkie.ToxicBloodDrain().applyEffectOnTarget(a, b);
        new com.gsc.bm.model.cards.com.items.MarvelousCocktail().applyEffectOnSelf(b);
        new com.gsc.bm.model.cards.base.items.SantinoDellaPortinaia().applyEffectOnSelf(b);
        Map<String, Integer> engine = new TreeMap<>();
        for (com.gsc.bm.model.game.Timer timer : a.getTimers()) engine.put(timer.getName(), timer.getTimer());
        for (com.gsc.bm.model.game.Timer timer : b.getTimers()) engine.put(timer.getName(), timer.getTimer());
        Map<String, Integer> text = new TreeMap<>();
        for (PrintedEffects effects : List.of(new com.gsc.bm.model.cards.junkie.ToxicBloodDrain().printedEffects(),
                new com.gsc.bm.model.cards.com.items.MarvelousCocktail().printedEffects(),
                new com.gsc.bm.model.cards.base.items.SantinoDellaPortinaia().printedEffects()))
            for (PrintedEffects.TimerText timer : effects.getTimers()) text.put(timer.getName(), timer.getTurns());
        assertEquals(3, engine.size());
        assertEquals(engine, text);
    }

    @Test void aTimerTheCatalogDoesNotKnowOnlyTicksAndGoes() {
        BotView input = twoSeats(seatWith("a", Set.of(Resource.TOXICITY), List.of(), List.of(new BotView.TimerSeen("mystery", 1)), Map.of(), List.of()),
                seatWith("b", Set.of(), List.of(), List.of(), Map.of(), List.of()), List.of());
        ViewTable table = ViewTable.forecast(input, Map.of());
        table.playTurn(List.of(), FOUND);
        assertTrue(timersOf(table, "a").isEmpty());
        assertEquals(Set.of(Resource.TOXICITY), table.view("a").getSelf().getSeat().getImmunities());
        assertEquals(100, table.health().get("a"));
    }

    @Test void tableCannotImportEngineOrReflection() throws Exception {
        String source = Files.readString(Path.of("src/main/java/com/gsc/bm/model/game/bot/ViewTable.java"));
        assertFalse(java.util.regex.Pattern.compile("(?m)^import .*\\b(Game|Player|ComPlayer|Character|Move);|java\\.lang\\.reflect")
                .matcher(source).find());
    }
}

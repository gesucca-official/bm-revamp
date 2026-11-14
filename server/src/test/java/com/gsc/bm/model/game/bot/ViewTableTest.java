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

    @Test void tableCannotImportEngineOrReflection() throws Exception {
        String source = Files.readString(Path.of("src/main/java/com/gsc/bm/model/game/bot/ViewTable.java"));
        assertFalse(java.util.regex.Pattern.compile("(?m)^import .*\\b(Game|Player|ComPlayer|Character|Move);|java\\.lang\\.reflect")
                .matcher(source).find());
    }
}

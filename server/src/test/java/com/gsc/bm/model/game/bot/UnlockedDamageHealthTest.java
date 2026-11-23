package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.Ruleset;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.Card;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-18 B2 (D126 (2), proposal § 3): {@link StyleSupport.Situation#unlockedDamage} reads a HEALTH cost as the engine does. With d50 a card
 * is payable only with health above its cost (RP-2) and «Ultimo colpo» always (RP-3); with the live rules, and for the other resources,
 * {@code have >= cost} as before. On Duccio's real Capocciata of {@code bozza.json} (cost C in HEALTH, damage D in HIT, read from the file).
 */
class UnlockedDamageHealthTest {
    private static BotView.CardSeen capocciata;
    private static int c;
    private static double d;

    @BeforeAll
    static void load() throws Exception {
        // The draft loader is package-private in com.gsc.bm.sim: the public text is read from the file, as BotView would show it.
        JsonNode card = null;
        try (var in = UnlockedDamageHealthTest.class.getResourceAsStream("/set-base/bozza.json")) {
            for (JsonNode c : new ObjectMapper().readTree(in).get("cards")) if (c.path("binding").asText().equals("base.rocco.Capocciata")) card = c;
        }
        assertNotNull(card);
        JsonNode gui = card.get("gui");
        capocciata = new BotView.CardSeen(gui.get("name").asText(), "base.rocco.Capocciata", false, false, false, false, card.get("priority").asInt(),
                Set.of(Card.CardTarget.OPPONENT), Map.of(Resource.HEALTH, card.get("cost").get("HEALTH").asInt()), gui.get("role").asText(),
                gui.get("gains").asText(), gui.get("damage").asText(), gui.get("damageAmount").asText(), card.path("lastBlow").asBoolean(false), null);
        c = capocciata.getCost().get(Resource.HEALTH);
        d = StyleSupport.damageOf(capocciata);
        assertTrue(c > 7 && d > 0, c + " HEALTH, " + d + " HIT");
    }

    private static BotView.Seat seat(String id, int health, int violence) {
        Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) res.put(r, 0);
        res.put(Resource.HEALTH, health);
        res.put(Resource.VIOLENCE, violence);
        return new BotView.Seat(id, id, false, false, res, Set.of(), List.of(), List.of(), 1, List.of());
    }

    private static double unlocked(Ruleset rules, int health, BotView.CardSeen card, Resource resource, double gain) {
        BotView v = new BotView(4, new BotView.Self(seat("me", health, 10), List.of(card), 10, List.of()),
                List.of(new BotView.Opponent(seat("foe", 80, 0), 5, 10, List.of())), List.of(), Map.of(), rules);
        return new StyleSupport.Situation(v).unlockedDamage(Map.of(resource, gain));
    }

    private static BotView.CardSeen withLastBlow(BotView.CardSeen c) {
        return new BotView.CardSeen(c.getName(), c.getBinding(), false, false, false, false, c.getPriority(), c.getCanTarget(), c.getCost(),
                c.getRole(), c.getGains(), c.getDamage(), c.getDamageAmount(), true, c.getEffects());
    }

    private static BotView.CardSeen costingViolence(BotView.CardSeen c) {
        return new BotView.CardSeen(c.getName(), c.getBinding(), false, false, false, false, c.getPriority(), c.getCanTarget(),
                Map.of(Resource.VIOLENCE, UnlockedDamageHealthTest.c), c.getRole(), c.getGains(), c.getDamage(), c.getDamageAmount(), false, c.getEffects());
    }

    @Test
    void withD50HealthEqualToTheCostDoesNotPay() {
        assertEquals(d, unlocked(Ruleset.D50, c, capocciata, Resource.HEALTH, 1), 1e-9, "C does not pay C, C + 1 does: +1 unlocks it");
        assertEquals(0, unlocked(Ruleset.D50, c - 6, capocciata, Resource.HEALTH, 6), 1e-9, "C − 6 + 6 = C still does not pay C");
        assertEquals(d, unlocked(Ruleset.D50, c - 6, capocciata, Resource.HEALTH, 7), 1e-9);
        assertEquals(0, unlocked(Ruleset.D50, c + 1, capocciata, Resource.HEALTH, 5), 1e-9, "already payable: nothing to unlock");
    }

    @Test
    void withTheLiveRulesAndForOtherResourcesTheCostIsReachedAtEquality() {
        assertEquals(0, unlocked(Ruleset.LEGACY, c, capocciata, Resource.HEALTH, 1), 1e-9, "1.13: C pays C");
        assertEquals(d, unlocked(Ruleset.LEGACY, c - 6, capocciata, Resource.HEALTH, 6), 1e-9);
        BotView.CardSeen violent = costingViolence(capocciata);
        assertEquals(d, unlocked(Ruleset.D50, 80, violent, Resource.VIOLENCE, c - 10), 1e-9, "10 + (C − 10) V = C pays C V under d50 too");
        assertEquals(0, unlocked(Ruleset.D50, 80, violent, Resource.VIOLENCE, c - 11), 1e-9);
    }

    @Test
    void ultimoColpoIsAlwaysPayableUnderD50() {
        BotView.CardSeen last = withLastBlow(capocciata);
        assertEquals(0, unlocked(Ruleset.D50, 10, last, Resource.HEALTH, c), 1e-9, "payable now: nothing to unlock");
        assertEquals(d, unlocked(Ruleset.LEGACY, 10, last, Resource.HEALTH, c), 1e-9, "1.13 knows no «Ultimo colpo»");
    }
}

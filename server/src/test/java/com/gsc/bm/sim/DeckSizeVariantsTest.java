package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.game.bot.*;
import com.gsc.bm.service.account.DeckRules;
import com.gsc.bm.service.account.InvalidDeckException;
import org.junit.jupiter.api.Test;
import java.lang.reflect.Field;
import java.util.*;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;
import static org.junit.jupiter.api.Assertions.*;

class DeckSizeVariantsTest {
    static Draft reference() throws Exception { return SetBaseArms.arm("B", Draft.fromClasspath("/set-base/bozza.json")); }

    @Test void approvedListsAreStrictValidNestedAndKeepEveryFixedPart() throws Exception {
        Draft base = reference();
        for (String name : DeckSizeVariants.NAMES) {
            Draft d = DeckSizeVariants.apply(base, name);
            assertEquals(Integer.parseInt(name.substring(0, 2)), d.rules.deckSize);
            assertEquals(Integer.parseInt(name.substring(3)), d.rules.maxCopies);
            for (String section : List.of("characters", "cards", "format", "set")) assertEquals(base.json().get(section), d.json().get(section));
            for (String deck : DECKS) {
                assertEquals(base.characterOf(deck), d.characterOf(deck));
                assertEquals(base.basicOf(deck), d.basicOf(deck));
                assertEquals(base.boundOf(deck), d.boundOf(deck));
                assertEquals(base.lastResortOf(deck), d.lastResortOf(deck));
                assertEquals(d.rules.deckSize, d.cardsOf(deck).values().stream().mapToInt(Integer::intValue).sum());
                assertTrue(d.cardsOf(deck).values().stream().allMatch(n -> n <= d.rules.maxCopies));
                for (int i = 0; i < ChargeFrequency.PAIRS.length; i++) if (base.cardsOf(deck).containsKey(ChargeFrequency.PAIRS[i][0])) {
                    String[] pair = ChargeFrequency.PAIRS[i];
                    int count = i % 2 == 1 ? 1 : d.rules.maxCopies;
                    assertEquals(count, d.cardsOf(deck).get(pair[0]));
                    assertEquals(count, d.cardsOf(deck).get(pair[1]));
                }
                for (String binding : d.cardsOf(deck).keySet())
                    if (StarterBalanceMeasureTest.card(d.json(), binding).path("rarity").asText().equals("RARE"))
                        assertEquals(1, d.cardsOf(deck).get(binding));
            }
        }
        assertEquals(base.json(), DeckSizeVariants.apply(base, "20-2").json());
        assertEquals(Bench.sha256(base), Bench.sha256(DeckSizeVariants.apply(base, "20-2")));
        for (String copies : List.of("2", "3")) {
            Draft small = DeckSizeVariants.apply(base, "25-" + copies), big = DeckSizeVariants.apply(base, "30-" + copies);
            for (String deck : DECKS) small.cardsOf(deck).forEach((card, n) -> assertTrue(big.cardsOf(deck).getOrDefault(card, 0) >= n));
        }
        assertThrows(IllegalArgumentException.class, () -> DeckSizeVariants.apply(base, "20-3"));
    }

    @Test void liveDeckRulesStillRejectTwentyFive() throws Exception {
        Draft base = reference(), bigger = DeckSizeVariants.apply(base, "25-2");
        String deck = DECKS[0];
        List<Card> bound = new ArrayList<>(), regular = new ArrayList<>();
        bound.add(new com.gsc.bm.model.cards.bruiser.character.LittleRage());
        bound.add(new com.gsc.bm.model.cards.bruiser.character.LittleSmack());
        LoadableCard basic = new com.gsc.bm.model.cards.com.basic.BruiserGrab();
        basic.setGuiExclusiveTo(base.characterOf(deck));
        Card last = new com.gsc.bm.model.cards.com.last.Struggle();
        base.cardsOf(deck).forEach((binding, n) -> { for (int i=0;i<n;i++) regular.add(base.card(binding)); });
        DeckRules.check(base.characterOf(deck), basic, bound, last, regular);
        regular.clear();
        bigger.cardsOf(deck).forEach((binding, n) -> { for (int i=0;i<n;i++) regular.add(base.card(binding)); });
        InvalidDeckException e = assertThrows(InvalidDeckException.class, () -> DeckRules.check(base.characterOf(deck),
                basic, bound, last, regular));
        assertEquals("Exactly 20 regular cards required, found 25", e.getMessage());
        assertEquals(20, DeckRules.REGULAR_CARDS); assertEquals(2, DeckRules.MAX_COPIES);
    }

    static Player measured(Draft d, String deck, String id, Random rng, BotPolicy policy, String style) throws Exception {
        Player p = d.player(deck, id, rng, policy);
        Field f = Player.class.getDeclaredField("character"); f.setAccessible(true);
        f.set(p, new ChargeMeasureTest.Measured(p.getCharacter(), deck + "|" + style));
        return p;
    }

    @Test void newObservationPreservesFullTracesForEveryVariant() throws Exception {
        for (String variant : DeckSizeVariants.NAMES) {
            Draft d = DeckSizeVariants.apply(reference(), variant);
            PlayerSource source = (deck,id,rng,policy) -> measured(d,deck,id,rng,policy,"ALWAYS/risorse");
            for (int i=0;i<5;i++) {
                BotPolicy policy = new LethalAwarePolicy(new SoughtHitPolicy(new ResourceAwarePolicy(), SoughtHitPolicy.Timing.ALWAYS));
                SimulationRunner.Contender a = new SimulationRunner.Contender(DECKS[i], policy),
                        b = new SimulationRunner.Contender(DECKS[(i+1)%5], policy);
                long seed = 7_000_000 + i;
                SimulationRunner plain = new SimulationRunner(d, Ruleset.D50), watched = new SimulationRunner(source, Ruleset.D50);
                String expected = plain.continueGame(plain.newGame(seed,a,b),seed,true,g -> {}).jsonl();
                DeckSizeObserve observer = new DeckSizeObserve();
                String actual = watched.continueGame(watched.newGame(seed,a,b),seed,true,g -> {},observer).jsonl();
                assertEquals(expected, actual, variant + "/" + i);
                for (DeckSizeObserve.Seat seat : observer.seats.values()) assertEquals(1L,seat.counts.get("games"));
            }
        }
    }

    static void turn(Game g, int n) throws Exception {
        Field f=Game.class.getDeclaredField("turn"); f.setAccessible(true); f.setInt(g,n);
    }

    @Test void countersKeepFirstTurnCountTitlesOnceAndObserveTerminalDepletion() throws Exception {
        Draft d=reference(); Player a=measured(d,DECKS[0],"a",new Random(1),null,"ALWAYS/risorse"),
                b=measured(d,DECKS[1],"b",new Random(2),null,"ALWAYS/com");
        Game g=new Game(List.of(a,b),"counter-fixture",false);
        Card hit=d.card("bruiser.SuperImpact"); a.getCardsInHand().clear(); a.getCardsInHand().add(hit); a.getCardsInHand().add(d.card(hit.getBindingName()));
        Move move=new Move(hit.getName(),"a","b",g.getGameId(),Map.of()); g.getPendingMoves().add(move);
        DeckSizeObserve o=new DeckSizeObserve(); o.accept("ROUND_READY",g);
        turn(g,1); o.accept("ROUND_COMMITTED",g);
        o.accept("ROUND_READY",g); // same title chosen again on turn 2
        a.getDeck().clear(); b.getResources().put(Resource.HEALTH,0); turn(g,2);
        o.accept("ROUND_COMMITTED",g);
        var c=o.seats.get("a").counts;
        assertEquals(2L,c.get("card/bruiser.SuperImpact/handTurns"));
        assertEquals(1L,c.get("card/bruiser.SuperImpact/playedGames"));
        assertEquals(1L,c.get("first/bruiser.SuperImpact/1"));
        assertFalse(c.containsKey("first/bruiser.SuperImpact/2"));
        assertEquals(1L,c.get("exhausted")); assertEquals(1L,c.get("exhaustionTurn/2"));
        assertFalse(c.containsKey("endWithAnyLastResort"));
        assertEquals("mixed",DeckSizeObserve.group("ALWAYS/risorse","WAIT/com"));
        assertEquals("heur",DeckSizeObserve.group("ALWAYS/risorse","WAIT/prudente"));
        assertEquals("com",DeckSizeObserve.group("ALWAYS/com","WAIT/com"));
    }

    @Test void mixedAliasesUseActualDecksAndExplicitCells() throws Exception {
        Draft d=reference(), big=DeckSizeVariants.apply(d,"30-3");
        Map<String,BotPolicy> styles=Map.of("risorse",new ResourceAwarePolicy());
        Bench.Settings s=new Bench.Settings(2,7_000_000,List.of("small","big"),styles,1,BoundCap.Params.DEFAULT,null,Ruleset.D50);
        s.deckSources.put("small",new Bench.DeckRef(d,DECKS[0]));s.deckSources.put("big",new Bench.DeckRef(big,DECKS[0]));
        PlayerSource source=(alias,id,rng,policy)->{Bench.DeckRef r=s.deck(d,alias);return r.draft.player(r.id,id,rng,policy);};
        Player small=source.player("small","s",new Random(1),null), large=source.player("big","l",new Random(1),null);
        assertEquals(20,regularCount(small));assertEquals(30,regularCount(large));
        Bench.Report r=Bench.runCells(d,s,List.of(new Bench.Cell("small","risorse","big","risorse")),source,(stage,g)->{});
        assertEquals(2,r.games());assertEquals(1,r.cells.size());assertEquals(0,r.checks.total());
        JsonNode head=StarterBalanceMeasureTest.JSON.readTree(r.json()).get("intestazione");
        assertEquals(30,head.path("variantiMiste").path("big").path("deckSize").asInt());
        List<String> fields=new ArrayList<>();head.path("variantiMiste").path("big").fieldNames().forEachRemaining(fields::add);
        assertEquals(List.of("deck","deckSize","maxCopies"),fields,"stable metadata order across JVMs");
        assertTrue(r.markdown().contains("small"));
    }

    @Test void terminalLastResortRequiresExecutionAndSearchesKeepTheirDistribution() throws Exception {
        for(boolean voided:List.of(false,true)) {
            Draft d=reference(); Player a=measured(d,DECKS[0],"a",new Random(1),null,"ALWAYS/risorse"),
                    b=measured(d,DECKS[1],"b",new Random(2),null,"ALWAYS/risorse");
            Game g=new Game(List.of(a,b),"terminal-fixture",false);
            Card lr=d.card("com.last.Struggle");a.getCardsInHand().add(lr);
            Move move=new Move(lr.getName(),"a","b",g.getGameId(),Map.of());g.getPendingMoves().add(move);
            DeckSizeObserve o=new DeckSizeObserve();o.accept("ROUND_READY",g);
            move.setVoid(voided);g.getResolvedMoves().add(move);
            move.recordSearch("bruiser.SuperImpact",voided?null:d.card("bruiser.SuperImpact"));
            b.getResources().put(Resource.HEALTH,0);turn(g,1);o.accept("ROUND_COMMITTED",g);
            var c=o.seats.get("a").counts;
            assertEquals(voided?0L:1L,c.getOrDefault("endWithAnyLastResort",0L));
            assertEquals(1L,c.get("endWithAnyChosenLastResort"));
            assertEquals(voided?0L:1L,c.getOrDefault("endAfterAnyLastResort",0L));
            assertEquals(1L,c.get(voided?"searchMissed":"searchFound"));
            assertEquals(1L,c.get("announcements-1"));
            assertEquals(1L,c.get("announcements"));
        }
    }
    static int regularCount(Player p) {
        return p.getInitialDeckDrawOrder().size();
    }
}

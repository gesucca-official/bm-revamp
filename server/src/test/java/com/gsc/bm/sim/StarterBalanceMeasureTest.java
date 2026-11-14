package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.BiConsumer;

import static org.junit.jupiter.api.Assertions.*;

/** SB-16e: opt-in measurements, never used by the application. No policy or engine changes. */
class StarterBalanceMeasureTest {
    static final ObjectMapper JSON = new ObjectMapper();
    static final String[] DECKS = {"starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi"};
    static final String[] CHARGES = {"bruiser.Glare", "base.mara.Slalom", "junkie.MethDrivenRage", "base.pino.OffroIo", "base.gigi.ColpoDiChiaveInglese"};
    static final String[] HITS = {"bruiser.SuperImpact", "base.mara.Sgommata", "junkie.Cough", "base.pino.GoingBerserk", "base.gigi.LavoroFattoBene"};
    static final ThreadLocal<Observed> SOURCE = new ThreadLocal<>();

    static class Counts extends TreeMap<String, Long> {
        void add(String key) { add(key, 1); }
        void add(String key, long n) { merge(key, n, Long::sum); }
        void merge(Counts other) { other.forEach(this::add); }
    }

    /** Copies initial data, then calls the real implementation once. Counterfactuals only evaluate pure status functions. */
    static final class Observed extends Character {
        final Counts counts;
        final int pair;
        String chosen;
        String speed, lethalCause = "other", lethalSpeed;
        boolean endOfTurn;
        int window, punishedWindow = -1;
        Observed(Character original, Counts counts, int pair) {
            super(original.getBindingName(), 0, 0, original.getItemsSize());
            this.counts = counts; this.pair = pair;
            getResources().putAll(original.getResources());
            getItems().addAll(original.getItems());
            getStatuses().addAll(original.getStatuses());
            getTimers().addAll(original.getTimers());
            getImmunities().addAll(original.getImmunities());
        }
        @Override public void requestSearch(String binding) { window++; super.requestSearch(binding); }
        @Override public List<String> resolveTimeBasedEffects() {
            endOfTurn = true;
            try { return super.resolveTimeBasedEffects(); }
            finally { endOfTurn = false; }
        }
        @Override public String inflictDamage(Character target, Damage damage, Set<StatusType> types) {
            Observed previous = SOURCE.get();
            SOURCE.set(this);
            try { return super.inflictDamage(target, damage, types); }
            finally { if (previous == null) SOURCE.remove(); else SOURCE.set(previous); }
        }
        int received(Damage incoming, Set<StatusType> types, boolean omitDefense, boolean omitExposure, boolean omitArmor) {
            Damage d = new Damage(incoming.getType(), incoming.getAmount());
            for (Status s : getStatuses()) {
                if (s.getFlow() != StatusFlow.INPUT || s.getImpactedProperty() != d.getType() || !types.contains(s.getType())) continue;
                if (omitDefense && s.getType() == StatusType.GOOD) continue;
                if (omitExposure && s.getName().contains("→")) continue;
                d.setType((Damage.DamageType) s.getTypeFunction().apply(d.getType()));
                d.setAmount(s.getAmountFunction().apply((float) d.getAmount()).intValue());
            }
            if (!omitArmor && ruleset().playground() && d.getType() == Damage.DamageType.HIT)
                d.setAmount(Math.max(0, d.getAmount() - getResources().get(Resource.ALCOHOL) / Ruleset.ALCOHOL_ARMOR_DIVISOR));
            return d.getAmount();
        }
        @Override public String takeDamage(Damage incoming, Set<StatusType> types) {
            int actual = received(incoming, types, false, false, false);
            int noDefense = received(incoming, types, true, false, false);
            int noExposure = received(incoming, types, false, true, false);
            int noArmor = received(incoming, types, false, false, true);
            Observed source = SOURCE.get();
            if (source != null && source != this) {
                if (actual > noExposure) {
                    counts.add("exposureDamageEvents"); counts.add("exposureExtraDamage", actual - noExposure);
                    if (punishedWindow != window) { counts.add("exposureWindowsPunished"); punishedWindow = window; }
                }
                if (HITS[source.pair].equals(source.chosen)) {
                    source.counts.add("hitDamageEvents"); source.counts.add("hitDamageAfterMitigation", actual);
                    if (noDefense > actual) { source.counts.add("hitParried"); source.counts.add("hitDefenseAbsorbed", noDefense - actual); }
                    if (noArmor > actual) { source.counts.add("hitArmored"); source.counts.add("hitArmorAbsorbed", noArmor - actual); }
                }
            } else if (actual > noExposure) { counts.add("exposureSelfOrEndDamageEvents"); counts.add("exposureSelfOrEndExtraDamage", actual - noExposure); }
            boolean alive = !isDead();
            String report = super.takeDamage(incoming, types);
            if (alive && isDead()) {
                lethalCause = endOfTurn ? "end" : source != null && source != this ? "opponent" : "self";
                lethalSpeed = source == null ? null : source.speed;
            }
            return report;
        }
    }

    static PlayerSource observedSource(Draft draft, Map<String, Counts> counts) {
        return (deck, id, rng, policy) -> {
            Player p = draft.player(deck, id, rng, policy);
            int pair = Arrays.asList(DECKS).indexOf(deck);
            Field f = Player.class.getDeclaredField("character"); f.setAccessible(true);
            f.set(p, new Observed(p.getCharacter(), counts.computeIfAbsent(id, k -> new Counts()), pair));
            return p;
        };
    }

    static final class Watch implements BiConsumer<String, Game> {
        final Map<String, Counts> counts;
        final Map<String, IdentityHashMap<Card, Integer>> found = new HashMap<>();
        final Map<String, Card> chosen = new HashMap<>(), discarded = new HashMap<>();
        final Map<String, Boolean> already = new HashMap<>();
        final Set<String> exhausted = new HashSet<>(), lr = new HashSet<>();
        final Map<String, Long> finalA = new TreeMap<>();
        Game game;
        Watch(Map<String, Counts> counts) { this.counts = counts; }
        Counts c(String id) { return counts.computeIfAbsent(id, k -> new Counts()); }
        @Override public void accept(String stage, Game g) {
            game = g;
            if (stage.equals("ROUND_READY")) {
                chosen.clear(); discarded.clear(); already.clear();
                for (Player p : g.getPlayers().values()) {
                    String id = p.getPlayerId(); Observed o = (Observed) p.getCharacter(); o.chosen = null;
                    o.speed = null;
                    if (p.getDeckSize() == 0) exhausted.add(id);
                    if (p.getCardsInHand().stream().anyMatch(Card::isLastResort)) lr.add(id);
                    already.put(id, p.getCardsInHand().stream().anyMatch(x -> x.getBindingName().equals(HITS[o.pair])));
                    found.computeIfAbsent(id, k -> new IdentityHashMap<>());
                }
                for (Move m : g.getPendingMoves()) {
                    Player p = g.getPlayers().get(m.getPlayerId()); Observed o = (Observed) p.getCharacter();
                    for (Card card : p.getCardsInHand()) {
                        if (card.getName().equals(m.getPlayedCardName())) { chosen.putIfAbsent(m.getPlayerId(), card); o.chosen = card.getBindingName(); }
                        if (m.getChoices() != null && card.getName().equals(m.getChoices().get(Move.AdditionalAction.DISCARD_ONE))) discarded.putIfAbsent(m.getPlayerId(), card);
                    }
                    Card selected = chosen.get(m.getPlayerId());
                    if (selected != null) o.speed = selected.getPriority() + "@" + (o.getResources().get(Resource.ALERTNESS) - selected.getCost().getOrDefault(Resource.ALERTNESS, 0));
                }
            } else {
                for (Move m : g.getResolvedMoves()) {
                    String id = m.getPlayerId(); Card card = chosen.get(id); if (card == null) continue;
                    Observed o = (Observed) g.getPlayers().get(id).getCharacter(); Counts c = c(id);
                    if (card.getBindingName().equals(CHARGES[o.pair])) {
                        c.add("chargeChosen"); if (!m.isVoid()) { c.add("chargeResolved"); if (!o.isDead()) c.add("chargeSurvivedTurn"); }
                        if (already.get(id)) c.add("hitAlreadyInHandAtCharge");
                    }
                    if (card.getBindingName().equals(HITS[o.pair])) {
                        c.add("hitChosen");
                        if (!m.isVoid()) c.add("hitResolved");
                        else c.add(Move.DOWN.equals(m.getVoidReason()) ? "hitVoidedDown" : "hitVoidedCounter");
                    }
                    Integer at = found.get(id).remove(card);
                    if (at != null) { c.add("foundChosen"); c.add("foundDelayTurns", g.getTurn() - at); if (m.isVoid()) c.add("foundVoided"); else c.add("foundResolved"); }
                    Card discard = discarded.get(id);
                    boolean leftHand = discard != null && g.getPlayers().get(id).getCardsInHand().stream().noneMatch(x -> x == discard);
                    if (leftHand && found.get(id).remove(discard) != null) c.add("foundDiscardedForBound");
                    if (m.getSearchedFor() != null) {
                        c.add("searchAttempt");
                        if (m.getSearchFound() != null) { c.add("searchFound"); found.get(id).put(m.getSearchFound(), g.getTurn()); }
                        else c.add("searchMissed");
                    }
                    int a = o.getResources().get(Resource.ALERTNESS);
                    finalA.put(id, (long) a);
                }
            }
        }
        void finish(SimulationRunner.Result result) {
            for (String id : game.getPlayers().keySet()) {
                Counts c = c(id); c.add("seatGames");
                c.add("foundUnusedAtEnd", found.get(id).size());
                if (exhausted.contains(id) || game.getPlayers().get(id).getDeckSize() == 0) c.add("deckExhaustedGames");
                if (lr.contains(id)) c.add("lastResortReachedGames");
            }
            if (result.outcome == SimulationRunner.Outcome.DRAW) {
                Counts a = c("seat-1"); a.add("drawGames");
                boolean bothZero = game.getPlayers().values().stream().allMatch(p -> p.getCharacter().getResources().get(Resource.ALERTNESS) == 0);
                if (bothZero) a.add("drawBothAZero");
                Observed x = (Observed) game.getPlayers().get("seat-1").getCharacter();
                Observed y = (Observed) game.getPlayers().get("seat-2").getCharacter();
                List<String> causes = new ArrayList<>(List.of(x.lethalCause, y.lethalCause)); Collections.sort(causes);
                String cause = String.join("+", causes);
                if (cause.equals("opponent+opponent")) cause += Objects.equals(x.lethalSpeed, y.lethalSpeed) ? "-same-group" : "-different-groups";
                a.add("drawLethal-" + cause);
                // Mutually exclusive observable cause: final end-of-turn damage, otherwise self damage, otherwise reciprocal moves.
                boolean end = game.getTimeBasedEffects().values().stream().flatMap(Collection::stream).anyMatch(s -> s.contains("HEALTH:") && s.contains("(-"));
                boolean self = game.getResolvedMoves().stream().flatMap(m -> m.getMoveReport().getOrDefault(Card.CardTarget.SELF, List.of()).stream()).anyMatch(s -> s.contains("HEALTH:") && s.contains("(-"));
                a.add(end ? "drawWithEndDamage" : self ? "drawWithSelfDamage" : "drawReciprocalMoves");
            }
            long delta = Math.abs(finalA.getOrDefault("seat-1", 0L) - finalA.getOrDefault("seat-2", 0L));
            c("seat-1").add("finalAbsADelta-" + (delta == 0 ? "0" : delta <= 5 ? "1-5" : delta <= 15 ? "6-15" : "16+"));
        }
    }

    @Test void observationPreservesGames() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        SimulationRunner plain = new SimulationRunner(draft, Ruleset.D50);
        for (int i = 0; i < 20; i++) {
            SimulationRunner.Contender a = new SimulationRunner.Contender(DECKS[i % 5], PlaygroundTest.styles().get("risorse"));
            SimulationRunner.Contender b = new SimulationRunner.Contender(DECKS[(i / 5) % 5], PlaygroundTest.styles().get("prudente"));
            Map<String, Counts> counts = new HashMap<>(); Watch watch = new Watch(counts);
            long seed = 7_000_000L + i;
            SimulationRunner observed = new SimulationRunner(observedSource(draft, counts), Ruleset.D50);
            SimulationRunner.Result expected = plain.continueGame(plain.newGame(seed, a, b), seed, true, g -> {});
            SimulationRunner.Result actual = observed.continueGame(observed.newGame(seed, a, b), seed, true, g -> {}, watch);
            watch.finish(actual);
            assertEquals(expected.outcome, actual.outcome); assertEquals(expected.turns, actual.turns); assertEquals(expected.emptyMoves, actual.emptyMoves);
            assertEquals(expected.jsonl(), actual.jsonl());
            for (Counts c : counts.values()) {
                assertEquals(c.getOrDefault("searchFound", 0L).longValue(), c.getOrDefault("foundChosen", 0L)
                        + c.getOrDefault("foundDiscardedForBound", 0L) + c.getOrDefault("foundUnusedAtEnd", 0L), "Every found copy has one fate");
                assertEquals(c.getOrDefault("foundChosen", 0L).longValue(), c.getOrDefault("foundResolved", 0L) + c.getOrDefault("foundVoided", 0L));
            }
        }
    }

    /**
     * SB-16f0 (D56, «si a entrambe» alla domanda 2 di SB-16e): until SB-16e the client received search and void reason only in the
     * server's English text; now they are also optional structured fields of the public move, and the English text stays as it was.
     */
    @Test void clientReceivesSearchAndVoidAsStructuredFields() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        Move search = new Move("charge", "a", "SELF", "g", Map.of());
        search.recordSearch(HITS[0], draft.card(HITS[0]));
        JsonNode publicSearch = JSON.readTree(JSON.writeValueAsString(search));
        assertFalse(publicSearch.has("searchedFor")); assertFalse(publicSearch.has("searchFound"));
        assertEquals(HITS[0], publicSearch.path("search").path("card").asText());
        assertTrue(publicSearch.path("search").path("found").asBoolean());
        assertEquals(draft.card(HITS[0]).getName(), publicSearch.path("search").path("revealed").path("name").asText());
        assertFalse(publicSearch.has("voidReason"));
        assertTrue(publicSearch.path("moveReport").toString().contains("shown to everyone"));
        assertTrue(JSON.writeValueAsString(search.getSlimView()).contains(draft.card(HITS[0]).getName()));
        Move missed = new Move("charge", "a", "SELF", "g", Map.of());
        missed.recordSearch(HITS[0], null);
        JsonNode publicMissed = JSON.readTree(JSON.writeValueAsString(missed)).path("search");
        assertFalse(publicMissed.path("found").asBoolean()); assertFalse(publicMissed.has("revealed"));
        Move down = new Move("hit", "a", "b", "g", Map.of());
        down.setVoid(true); down.setVoidReason(Move.DOWN); down.applyEffectTo(null);
        JsonNode publicDown = JSON.readTree(JSON.writeValueAsString(down));
        assertEquals("a terra", publicDown.path("voidReason").asText()); assertTrue(publicDown.path("void").asBoolean());
        assertFalse(publicDown.has("search"));
        assertTrue(publicDown.path("moveReport").toString().contains("voided: a terra"));
        JsonNode plain = JSON.readTree(JSON.writeValueAsString(new Move("hit", "a", "b", "g", Map.of())));
        assertFalse(plain.has("search")); assertFalse(plain.has("voidReason"));
    }

    @Test void damageCountersSeparateExposureDefenseArmorAndOverkill() {
        Counts attack = new Counts(), defend = new Counts();
        Observed a = new Observed(new Character("a", 100, 10, 1) {}, attack, 0);
        Observed b = new Observed(new Character("b", 100, 10, 1) {}, defend, 1);
        a.useRuleset(Ruleset.D50); b.useRuleset(Ruleset.D50); a.chosen = HITS[0];
        b.getResources().put(Resource.ALCOHOL, 20);
        b.getStatuses().add(Status.builder().name("charge → hit").type(StatusType.BAD).flow(StatusFlow.INPUT)
                .impactedProperty(Damage.DamageType.HIT).amountFunction(x -> x * 1.5f).lastsForTurns(1).build());
        Status parry = Status.builder().name("parry").type(StatusType.GOOD).flow(StatusFlow.INPUT)
                .impactedProperty(Damage.DamageType.HIT).amountFunction(x -> x * .5f).singleUse(true).lastsForTurns(4).build();
        b.getStatuses().add(parry); b.requestSearch(HITS[1]);
        assertEquals(10, b.received(new Damage(Damage.DamageType.HIT, 20), Status.ALL, false, false, false));
        assertEquals(4, parry.getLastsForTurns(), "Counterfactual must not expend single-use statuses");
        a.inflictDamage(b, new Damage(Damage.DamageType.HIT, 20));
        assertEquals(90, b.getResources().get(Resource.HEALTH));
        assertEquals(1L, attack.get("hitParried")); assertEquals(15L, attack.get("hitDefenseAbsorbed"));
        assertEquals(5L, attack.get("hitArmorAbsorbed")); assertEquals(5L, defend.get("exposureExtraDamage"));
        assertEquals(0, parry.getLastsForTurns());
        a.inflictDamage(b, new Damage(Damage.DamageType.HIT, 20));
        assertEquals(1L, defend.get("exposureWindowsPunished"), "A window is counted once despite multiple damage events");
        b.getResources().put(Resource.HEALTH, 1);
        a.inflictDamage(b, new Damage(Damage.DamageType.HIT, 20));
        assertEquals(0, b.getResources().get(Resource.HEALTH));
        assertEquals(30L, attack.get("hitDamageAfterMitigation"), "Damage potential is separate from HP lost to overkill");
        assertEquals("opponent", b.lethalCause);
        b.getResources().put(Resource.HEALTH, 1); b.getResources().put(Resource.TOXICITY, 2);
        b.resolveTimeBasedEffects(); assertEquals("end", b.lethalCause);
    }

    @Test void ablationsKeepDeckCompositionAndOtherPairs() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        // Only the replaced slot is read from this reference in the test.
        ObjectNode old = (ObjectNode) draft.json();
        card(old, CHARGES[0]).put("priority", -1);
        Draft off = ablation(draft, old, "pair-off-0");
        assertEquals(draft.json().get("decks"), off.json().get("decks"));
        assertEquals(-1, card(off.json(), CHARGES[0]).get("priority").asInt());
        for (int i = 1; i < 5; i++) assertEquals(card(draft.json(), CHARGES[i]), card(off.json(), CHARGES[i]));
        for (String variant : List.of("p3-off", "poison-8", "piera-no-a", "piera-no-search"))
            assertEquals(draft.json().get("decks"), ablation(draft, old, variant).json().get("decks"));
    }

    @Test void timingListCanCoverAllFiveStartersWithoutChangingHistoricalDefaults() throws Exception {
        String previous = System.getProperty("sim.sb16eTiming");
        try {
            // D79: this tests the historical SB-16e timing probes on their original double slots.
            Draft base = Listino.setBaseContexts(Draft.fromFile(Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json")), Listino.ANCHOR);
            Listino list = new Listino(base, new Listino.Params(1, 1, 1, 1), PlaygroundTest.styles());
            System.clearProperty("sim.sb16eTiming");
            assertEquals(6, list.bisections().stream().filter(b -> b.group.equals("priorita")).count());
            assertEquals(18, list.curves().stream().filter(c -> c.group.equals("allerta")).count());
            Listino.Bisection historical = list.bisections().stream().filter(b -> b.group.equals("priorita")).findFirst().orElseThrow();
            Listino.Point oldPoint = list.evaluate(historical.builder.build(10), 1, 8_000_000L, false, 10);
            assertEquals(new HashSet<>(Listino.STYLES), oldPoint.byStyle.keySet(), "Historical mode keeps its three styles");
            System.setProperty("sim.sb16eTiming", "true");
            assertEquals(10, list.bisections().stream().filter(b -> b.group.equals("priorita")).count());
            assertEquals(30, list.curves().stream().filter(c -> c.group.equals("allerta")).count());
            assertTrue(list.bisections().stream().filter(b -> b.group.equals("priorita")).allMatch(b -> base.deckIds().contains(b.context)));
            Listino.Bisection probe = list.bisections().stream().filter(b -> b.group.equals("priorita")).findFirst().orElseThrow();
            Listino.Point point = list.evaluate(probe.builder.build(10), 1, 8_000_000L, false, 10);
            assertEquals(PlaygroundTest.styles().keySet(), point.byStyle.keySet(), "Opt-in measures every declared style, including com");
        } finally {
            if (previous == null) System.clearProperty("sim.sb16eTiming"); else System.setProperty("sim.sb16eTiming", previous);
        }
    }

    @Test void aVoidedBoundKeepsTheFoundCopyTracked() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json"); Map<String, Counts> counts = new HashMap<>();
        Game g = new SimulationRunner(observedSource(draft, counts), Ruleset.D50).newGame(7_000_000,
                new SimulationRunner.Contender(DECKS[0], null), new SimulationRunner.Contender(DECKS[1], null));
        Player a = g.getPlayers().get("seat-1");
        a.getCardsInHand().removeIf(c -> c.getBindingName().equals(HITS[0]));
        Card hit = draft.card(HITS[0]); a.getCardsInHand().add(hit);
        Card bound = a.getCardsInHand().stream().filter(Card::isCharacterBound).findFirst().orElseThrow();
        Move move = new Move(bound.getName(), "seat-1", "SELF", g.getGameId(), Map.of(Move.AdditionalAction.DISCARD_ONE, hit.getName()));
        g.getPendingMoves().clear(); g.getPendingMoves().add(move);
        Watch watch = new Watch(counts); watch.accept("ROUND_READY", g); watch.found.get("seat-1").put(hit, 0);
        move.setVoid(true); g.getResolvedMoves().add(move); watch.accept("ROUND_COMMITTED", g);
        assertTrue(watch.found.get("seat-1").containsKey(hit));
        assertEquals(0L, counts.get("seat-1").getOrDefault("foundDiscardedForBound", 0L));
        // A resolved bound really removes the selected copy.
        a.getCardsInHand().remove(hit); move.setVoid(false); watch.accept("ROUND_COMMITTED", g);
        assertFalse(watch.found.get("seat-1").containsKey(hit));
        assertEquals(1L, counts.get("seat-1").get("foundDiscardedForBound"));
    }

    @Test void duplicateCopiesFollowTheSameFirstMatchAsTheEngine() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json"); Map<String, Counts> counts = new HashMap<>();
        Game g = new SimulationRunner(observedSource(draft, counts), Ruleset.D50).newGame(7_000_000,
                new SimulationRunner.Contender(DECKS[0], null), new SimulationRunner.Contender(DECKS[1], null));
        Player a = g.getPlayers().get("seat-1"); a.getCardsInHand().removeIf(c -> c.getBindingName().equals(HITS[0]));
        Card first = draft.card(HITS[0]), found = draft.card(HITS[0]); a.getCardsInHand().add(first); a.getCardsInHand().add(found);
        Move move = new Move(first.getName(), "seat-1", "seat-2", g.getGameId(), Map.of());
        g.getPendingMoves().clear(); g.getPendingMoves().add(move);
        Watch watch = new Watch(counts); watch.accept("ROUND_READY", g); watch.found.get("seat-1").put(found, 0);
        assertSame(g.getCardFromHand("seat-1", first.getName()), watch.chosen.get("seat-1"));
        a.getCardsInHand().remove(first); g.getResolvedMoves().add(move); watch.accept("ROUND_COMMITTED", g);
        assertTrue(watch.found.get("seat-1").containsKey(found));
        assertEquals(0L, counts.get("seat-1").getOrDefault("foundChosen", 0L));
    }

    @Test
    @EnabledIfSystemProperty(named = "sim.sb16eObserve", matches = ".+")
    void observations() throws Exception {
        Path out = Path.of(System.getProperty("sim.sb16eObserve"));
        Files.copy(out.resolve("pairs.json"), Path.of(System.getProperty("java.io.tmpdir"), "bm-sb16e", out.getFileName() + "-pairs-before-discard-fix.json"));
        observe(Draft.selected(), out);
    }

    static ObjectNode card(JsonNode root, String binding) {
        for (JsonNode c : root.path("cards")) if (binding.equals(c.path("binding").asText())) return (ObjectNode) c;
        throw new IllegalArgumentException(binding);
    }
    static void removeSteps(ObjectNode c, String op, String resource) {
        ArrayNode self = (ArrayNode) c.get("self");
        for (int i = self.size() - 1; i >= 0; i--) if (self.get(i).path("op").asText().equals(op)
                && (resource == null || self.get(i).path("resource").asText().equals(resource))) self.remove(i);
    }
    static Draft ablation(Draft base, JsonNode old, String name) {
        ObjectNode root = (ObjectNode) base.json();
        if (name.startsWith("pair-off-")) {
            int n = Integer.parseInt(name.substring(9));
            ArrayNode cards = (ArrayNode) root.get("cards");
            for (int i = 0; i < cards.size(); i++) if (cards.get(i).path("binding").asText().equals(CHARGES[n])) cards.set(i, card(old, CHARGES[n]).deepCopy());
        } else if (name.equals("p3-off")) {
            removeSteps(card(root, "base.com.TartarugaSulMarciapiede"), "gain", "HEALTH");
            removeSteps(card(root, "base.mara.TraDueParaurti"), "gain", "ALERTNESS");
            removeSteps(card(root, "base.gigi.SottoIlCofano"), "gain", "VIOLENCE");
        } else if (name.equals("poison-8")) {
            for (JsonNode s : card(root, HITS[2]).path("target")) if (s.path("op").asText().equals("damage")) ((ObjectNode) s).put("amount", 8);
            ((ObjectNode) card(root, HITS[2]).get("gui")).put("damageAmount", "POISON 8");
        } else if (name.equals("piera-no-a")) removeSteps(card(root, CHARGES[3]), "gain", "ALERTNESS");
        else if (name.equals("piera-no-search")) removeSteps(card(root, CHARGES[3]), "search", null);
        else throw new IllegalArgumentException(name);
        // Metadata used by bots must follow the experimental effects as well.
        if (name.equals("p3-off")) {
            ((ObjectNode) card(root, "base.com.TartarugaSulMarciapiede").get("gui")).put("gains", "—");
            ((ObjectNode) card(root, "base.mara.TraDueParaurti").get("gui")).put("gains", "—");
            ((ObjectNode) card(root, "base.gigi.SottoIlCofano").get("gui")).put("gains", "—");
        }
        if (name.equals("piera-no-a")) ((ObjectNode) card(root, CHARGES[3]).get("gui")).put("gains", "+15 L");
        return base.derive(base.source + " [" + name + "]", root);
    }

    @Test
    @EnabledIfSystemProperty(named = "sim.sb16e", matches = "[123]")
    void round() throws Exception {
        assertEquals(Ruleset.D50, SimulationRunner.selectedRuleset());
        Path out = Path.of(System.getProperty("sim.sb16eOut")); Files.createDirectories(out);
        long start = System.nanoTime(); Draft draft = Draft.selected();
        Files.writeString(out.resolve("draft.json"), JSON.writeValueAsString(draft.json()));
        measureBench(draft, out, "matrix", 2000);
        observe(draft, out);
        JsonNode old = JSON.readTree(Path.of(System.getProperty("sim.sb16eReference")).toFile());
        for (String name : List.of("pair-off-0", "pair-off-1", "pair-off-2", "pair-off-3", "pair-off-4", "p3-off", "poison-8", "piera-no-a", "piera-no-search"))
            measureBench(ablation(draft, old, name), out, name, 500);
        // Same seeds/sample size as ablations, avoids comparing different sampling error.
        measureBench(draft, out, "control-500", 500);
        Files.writeString(out.resolve("seconds.txt"), Double.toString((System.nanoTime() - start) / 1e9));
    }
    static void measureBench(Draft draft, Path out, String name, int games) throws Exception {
        Bench.Settings settings = new Bench.Settings(games, 7_000_000L, Arrays.asList(DECKS), BenchMeasureTest.styles(), 8, BoundCap.Params.DEFAULT, "SB-16e " + name, Ruleset.D50);
        Bench.Report r;
        if (name.equals("matrix") || name.equals("control-500")) r = Bench.run(draft, settings);
        else {
            Set<String> affected = affected(name);
            List<Bench.Cell> cells = new ArrayList<>();
            for (int i = 0; i < DECKS.length; i++) for (int j = i; j < DECKS.length; j++)
                if (affected.contains(DECKS[i]) || affected.contains(DECKS[j]))
                    for (String a : settings.styles.keySet()) for (String b : settings.styles.keySet())
                        cells.add(new Bench.Cell(DECKS[i], a, DECKS[j], b));
            Bench.playCells(draft, settings, cells, draft);
            r = new Bench.Report(draft, Bench.sha256(draft), settings, cells, BoundCap.run(draft, settings.cap));
            for (Bench.Cell c : cells) r.checks.merge(c.checks);
            for (String binding : draft.cardBindings())
                if (draft.card(binding).isCharacterBound()) assertTrue(draft.card(binding).getCost().isEmpty());
        }
        Files.writeString(out.resolve(name + ".json"), JSON.writeValueAsString(JSON.readTree(r.json())));
        if (name.equals("matrix")) Files.writeString(out.resolve(name + ".md"), r.markdown());
        assertEquals(0, r.checks.total(), r.failures()); assertEquals(0, r.boundViolations(), r.failures());
    }
    static Set<String> affected(String name) {
        if (name.startsWith("pair-off-")) return Set.of(DECKS[Integer.parseInt(name.substring(9))]);
        if (name.equals("p3-off")) return Set.of(DECKS[0], DECKS[1], DECKS[4]);
        if (name.equals("poison-8")) return Set.of(DECKS[2]);
        if (name.startsWith("piera-")) return Set.of(DECKS[3]);
        throw new IllegalArgumentException(name);
    }
    static void observe(Draft draft, Path out) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(8);
        List<Future<Object>> futures = new ArrayList<>();
        try {
            for (int i = 0; i < 5; i++) for (int j = i; j < 5; j++)
                for (String sa : BenchMeasureTest.styles().keySet()) for (String sb : BenchMeasureTest.styles().keySet()) {
                    final int a = i, b = j;
                    futures.add(pool.submit(() -> {
                        Counts ca = new Counts(), cb = new Counts();
                        for (long seed = 7_000_000; seed < 7_000_400; seed++) {
                            boolean first = seed % 2 == 0;
                            Map<String, Counts> counts = new HashMap<>(); Watch watch = new Watch(counts);
                            SimulationRunner runner = new SimulationRunner(observedSource(draft, counts), Ruleset.D50);
                            SimulationRunner.Contender x = new SimulationRunner.Contender(DECKS[a], BenchMeasureTest.styles().get(sa));
                            SimulationRunner.Contender y = new SimulationRunner.Contender(DECKS[b], BenchMeasureTest.styles().get(sb));
                            SimulationRunner.Result r = runner.run(seed, first ? x : y, first ? y : x, watch); watch.finish(r);
                            ca.merge(counts.get(first ? "seat-1" : "seat-2")); cb.merge(counts.get(first ? "seat-2" : "seat-1"));
                        }
                        Map<String, Object> row = new LinkedHashMap<>(); row.put("a", DECKS[a]); row.put("b", DECKS[b]); row.put("styleA", sa); row.put("styleB", sb); row.put("aCounts", ca); row.put("bCounts", cb); return row;
                    }));
                }
            List<Object> rows = new ArrayList<>(); for (Future<Object> f : futures) rows.add(f.get());
            Files.writeString(out.resolve("pairs.json"), JSON.writeValueAsString(rows));
        } finally { pool.shutdownNow(); }
    }
}

package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.junkie.ToxicBloodDrain;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.TurnForecast;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static com.gsc.bm.sim.StarterRedesignTest.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16g passo 3: the power of proposal 1.4 (D82) with the targeted support of D84, and the two arms of the final round. The cards
 * are the draft's; each effect is resolved by the d50 engine and compared with the public forecast of the bots (D76).
 */
class PotenzaD82Test {
    static final ObjectMapper JSON = new ObjectMapper();
    static Draft a, b;
    static JsonNode stepTwo;

    static final String IMPATTO = "bruiser.SuperImpact", TI_STRINGO = "base.mara.TiStringoLaCurva", CINGHIATA = "base.mara.CinghiataDiTraverso",
            DOSE = "junkie.MethDrivenRage", TOSSICONE = "junkie.Cough", ASSAGGINO = "base.tossico.UnAssaggino",
            TRAVASO = "junkie.ToxicBloodDrain", ESTASI = "base.pino.GoingBerserk", RUTTO = "base.pino.RuttoADistanzaSociale",
            PREPARO = "base.gigi.ColpoDiChiaveInglese", CHIAVE = "base.gigi.ChiaveDaTredici", STRETTA = "base.gigi.UnaStrettaDiProva",
            LAVORO = "base.gigi.LavoroFattoBene", COFANO = "base.gigi.SottoIlCofano";
    static final Set<String> CHANGED = Set.of(IMPATTO, TI_STRINGO, CINGHIATA, DOSE, TOSSICONE, ASSAGGINO, TRAVASO, ESTASI, RUTTO, PREPARO,
            CHIAVE, STRETTA, LAVORO, COFANO);

    @BeforeAll static void load() throws Exception {
        StarterRedesignTest.load();
        a = Draft.fromClasspath("/set-base/bozza.json");
        b = SetBaseArms.arm("B", a);
        stepTwo = JSON.readTree(Files.readString(Path.of("../docs/reports/set-base/sb-16g-2b2/draft.json")));
    }

    static JsonNode card(JsonNode root, String binding) { return StarterBalanceMeasureTest.card(root, binding); }

    static JsonNode json(String text) {
        try { return JSON.readTree(text.replace('\'', '"')); } catch (Exception e) { throw new IllegalStateException(e); }
    }

    // --- Data: exactly the table «Carte che cambiano» of 1.4 -------------------------------------------------------------

    @Test void onlyTheFourteenCardsOfProposal14ChangeAndTheD79ListsStay() {
        JsonNode now = a.json();
        for (String key : List.of("characters", "decks", "rules", "format", "set")) assertEquals(stepTwo.path(key), now.path(key), key);
        assertEquals(stepTwo.path("cards").size(), now.path("cards").size());
        Set<String> changed = new TreeSet<>();
        for (JsonNode c : stepTwo.path("cards")) {
            String binding = c.path("binding").asText();
            JsonNode after = card(now, binding);
            if (!c.equals(after)) changed.add(binding);
            assertEquals(c.path("rarity"), after.path("rarity"), binding);
            assertEquals(c.path("priority"), after.path("priority"), binding);
            assertEquals(c.path("gui").path("name"), after.path("gui").path("name"), binding);
        }
        assertEquals(new TreeSet<>(CHANGED), changed);
    }

    @Test void theNumbersAreThoseOfProposal14() {
        JsonNode now = a.json();
        assertEquals(json("[{'op':'damage','type':'HIT','amount':30}]"), card(now, IMPATTO).get("target"));
        assertEquals(json("{'ALERTNESS':20}"), card(now, TI_STRINGO).get("self").get(0).get("foundGains"));
        assertEquals(json("{'ALERTNESS':5}"), card(now, TI_STRINGO).get("self").get(0).get("missedGains"));
        assertEquals(json("{'ALERTNESS':20}"), card(now, CINGHIATA).get("cost"));
        assertEquals(json("[{'op':'damage','type':'CUT','amount':{'base':18,'of':'ALERTNESS','divide':2}}]"), card(now, CINGHIATA).get("target"));
        assertEquals(json("{'TOXICITY':10,'ALERTNESS':5}"), card(now, DOSE).get("self").get(0).get("foundGains"));
        assertEquals(json("{'TOXICITY':5}"), card(now, DOSE).get("self").get(0).get("missedGains"));
        assertEquals(json("[{'op':'damage','type':'POISON','amount':18},{'op':'gain','resource':'TOXICITY','amount':5}]"), card(now, TOSSICONE).get("target"));
        assertEquals(json("{'TOXICITY':20}"), card(now, ASSAGGINO).get("self").get(0).get("foundGains"));
        assertEquals(json("{'turns':1,'poison':12}"), card(now, TRAVASO).get("params"));
        assertEquals(json("{'TOXICITY':10}"), card(now, TRAVASO).get("cost"));
        assertEquals(json("{'base':18,'selfHit':0}"), card(now, ESTASI).get("params"));
        assertTrue(card(now, RUTTO).get("java").asBoolean());
        assertEquals(json("{'base':14,'perAlcohol':2}"), card(now, RUTTO).get("params"));
        assertEquals(json("{'ALCOHOL':5}"), card(now, RUTTO).get("cost"));
        for (String charge : List.of(PREPARO, STRETTA)) {
            assertEquals(json("['OPPONENT']"), card(now, charge).get("targets"), charge);
            assertEquals(json("[{'op':'damage','type':'CUT','amount':4}]"), card(now, charge).get("target"), charge);
            assertEquals(json("{'VIOLENCE':5}"), card(now, charge).get("self").get(0).get("missedGains"), charge);
        }
        assertEquals(json("{'VIOLENCE':15}"), card(now, PREPARO).get("self").get(0).get("foundGains"));
        assertEquals(json("{'VIOLENCE':10}"), card(now, STRETTA).get("self").get(0).get("foundGains"));
        assertEquals(json("{'VIOLENCE':10}"), card(now, CHIAVE).get("cost"));
        assertEquals(json("[{'op':'damage','type':'CUT','amount':22}]"), card(now, CHIAVE).get("target"));
        assertEquals(json("{'VIOLENCE':10}"), card(now, LAVORO).get("cost"));
        assertEquals(json("{'base':14,'perItem':7}"), card(now, LAVORO).get("params"));
        JsonNode cofano = card(now, COFANO).get("self");
        assertEquals(json("{'op':'gain','resource':'ALERTNESS','amount':5}"), cofano.get(cofano.size() - 1));
        assertEquals(json("{'op':'gain','resource':'VIOLENCE','amount':5}"), cofano.get(cofano.size() - 2));
    }

    // --- Arms: B differs from A only by POISON ×0.5 on the Bancone ---------------------------------------------------------

    @Test void armBDiffersFromArmAOnlyByThePoisonOfTheBancone() {
        JsonNode armA = a.json(), armB = b.json();
        for (String key : List.of("characters", "decks", "rules", "format", "set")) assertEquals(armA.path(key), armB.path(key), key);
        assertEquals(armA.path("cards").size(), armB.path("cards").size());
        for (int i = 0; i < armA.path("cards").size(); i++) {
            JsonNode x = armA.path("cards").get(i), y = armB.path("cards").get(i);
            assertEquals(x.path("binding"), y.path("binding"));
            if (!x.path("binding").asText().equals(SetBaseArms.BANCONE)) { assertEquals(x, y, x.path("binding").asText()); continue; }
            ObjectNode withoutPoison = y.deepCopy(), sameText = x.deepCopy();
            com.fasterxml.jackson.databind.node.ArrayNode self = (com.fasterxml.jackson.databind.node.ArrayNode) withoutPoison.get("self");
            assertEquals(json("{'op':'status','name':'BANCONE - POISON','description':'Poison Damage taken: x0.5','statusType':'GOOD',"
                    + "'flow':'INPUT','property':'POISON','factor':0.5,'turns':0}"), self.get(1));
            self.remove(1);
            ((ObjectNode) withoutPoison.get("gui")).remove("description");
            ((ObjectNode) sameText.get("gui")).remove("description");
            assertEquals(sameText, withoutPoison, "only the POISON status and its text");
            assertTrue(y.path("gui").path("description").asText().endsWith(
                    "In questo turno moltiplica per 0,5 i danni da colpo e da veleno che ricevi. Guadagni 5 L."));
        }
    }

    @Test void theArmPropertyIsStrict() throws Exception {
        assertSame(a, SetBaseArms.arm("A", a));
        // The bench names and fingerprints both arms (the first step 0 of arm B failed here: its source looked like a classpath).
        assertEquals("bozza.json + bancone-b.json", Bench.draftName(b));
        assertNotEquals(Bench.sha256(a), Bench.sha256(b));
        assertThrows(IllegalArgumentException.class, () -> SetBaseArms.arm("C", a));
    }

    // --- Effects against the engine and the public forecast ---------------------------------------------------------------

    static Player seat(String deck, String id, Card card, Map<Resource, Integer> resources) {
        Player p = player(deck, id, card == null ? List.of() : List.of(card), List.of(StarterRedesignTest.draftCard("base.com.Spintone")));
        resources.forEach((r, n) -> p.getResources().put(r, n));
        return p;
    }

    /** Plays the turn and checks that the public forecast had the engine's end among its variants. Returns the game. */
    static Game playAndForecast(Player me, Card mine, Player foe, Card theirs) {
        Game g = game(me, foe);
        BotView v = BotView.of(g, me.getPlayerId());
        LegalMove chosen = v.legalMoves().stream().filter(m -> m.getCard().getBinding().equals(mine.getBindingName())).findFirst().orElseThrow();
        TurnForecast.Threat threat = theirs == null ? null
                : new TurnForecast.Threat(v.getOpponents().get(0).getSeat(), BotView.publicText(theirs), me.getPlayerId(), null);
        List<Map<String, Integer>> predicted = TurnForecast.variants(v, chosen, threat);
        turn(g, move(g, me, mine, chosen.getTargetId()), theirs == null ? waitMove(g, foe) : move(g, foe, theirs, me.getPlayerId()));
        Map<String, Integer> actual = Map.of(me.getPlayerId(), me.getResources().get(Resource.HEALTH), foe.getPlayerId(),
                foe.getResources().get(Resource.HEALTH));
        assertTrue(predicted.contains(actual), mine.getBindingName() + ": " + actual + " not in " + predicted);
        return g;
    }

    @Test void cinghiataReadsTheAlertnessLeftAfterItsCost() {
        for (int[] c : new int[][]{{40, 28}, {25, 20}, {20, 18}}) {
            Player me = seat("starter-mara", "a", a.card(CINGHIATA), Map.of(Resource.ALERTNESS, c[0]));
            Player foe = foe();
            playAndForecast(me, a.card(CINGHIATA), foe, null);
            assertEquals(500 - c[1], foe.getResources().get(Resource.HEALTH), "A " + c[0]);
            assertEquals(c[0] - 20, me.getResources().get(Resource.ALERTNESS));
        }
        Player poor = seat("starter-mara", "a", a.card(CINGHIATA), Map.of(Resource.ALERTNESS, 19));
        assertTrue(BotView.of(game(poor, foe()), "a").legalMoves().stream().noneMatch(m -> m.getCard().getBinding().equals(CINGHIATA)));
    }

    @Test void ruttoSpendsTheAlcoholLeftAfterItsCostOnBothEffects() {
        for (int[] c : new int[][]{{12, 7}, {5, 0}, {20, 15}}) {
            Player me = seat("starter-pino", "a", a.card(RUTTO), Map.of(Resource.ALCOHOL, c[0]));
            Player foe = foe();
            playAndForecast(me, a.card(RUTTO), foe, null);
            assertEquals(40 - c[1], foe.getResources().get(Resource.ALERTNESS), "L " + c[0]);
            assertEquals(500 - (14 + 2 * c[1]), foe.getResources().get(Resource.HEALTH), "L " + c[0]);
            assertEquals(0, me.getResources().get(Resource.ALCOHOL), "L azzerata");
        }
        PrintedEffects printed = ((PrintedEffects.Source) a.card(RUTTO)).printedEffects();
        assertEquals(2, printed.getSteps().get(2).getTimes());
    }

    @Test void ruttoLosesTheArmourOfTheSpentAlcohol() {
        Card hit = StarterRedesignTest.probeHit(20, 0);
        Player me = seat("starter-pino", "a", a.card(RUTTO), Map.of(Resource.ALCOHOL, 25));
        Player foe = seat("starter-tossico", "b", hit, Map.of());
        playAndForecast(me, a.card(RUTTO), foe, hit);
        assertEquals(480, me.getResources().get(Resource.HEALTH), "L spesa prima del colpo avversario: nessuna corazza");
    }

    @Test void theBloodDrainAddsItsDirectPoisonAndTheLiveCardDoesNot() {
        Player me = seat("starter-tossico", "a", a.card(TRAVASO), Map.of(Resource.TOXICITY, 25));
        Player foe = foe();
        playAndForecast(me, a.card(TRAVASO), foe, null);
        Player plainMe = seat("starter-tossico", "a", noPoison(), Map.of(Resource.TOXICITY, 25));
        Player plainFoe = foe();
        playAndForecast(plainMe, noPoison(), plainFoe, null);
        assertEquals(plainFoe.getResources().get(Resource.HEALTH) - 12, foe.getResources().get(Resource.HEALTH), "12 POISON diretti");
        assertEquals(plainFoe.getResources().get(Resource.TOXICITY), foe.getResources().get(Resource.TOXICITY));
        assertEquals(0, me.getResources().get(Resource.TOXICITY));
        // The live class keeps its single report line and three printed steps: poison is 0 there (D84).
        ToxicBloodDrain live = new ToxicBloodDrain();
        com.gsc.bm.model.Character x = a.character("junkie.character.ToxicJunkie"), y = a.character("base.character.Mara");
        int health = y.getResources().get(Resource.HEALTH);
        assertEquals(1, live.applyEffectOnTarget(x, y).size());
        assertEquals(health, y.getResources().get(Resource.HEALTH));
        assertEquals(3, live.printedEffects().getSteps().size());
    }

    /** The draft's blood drain without its optional poison: the live value 0 (D84). */
    static Card noPoison() {
        try {
            ObjectNode root = a.json().deepCopy();
            for (JsonNode c : root.get("cards"))
                if (c.get("binding").asText().equals(TRAVASO)) ((ObjectNode) c.get("params")).remove("poison");
            return Draft.parse("senza poison", root).card(TRAVASO);
        } catch (Exception e) { throw new IllegalStateException(e); }
    }

    @Test void beppesChargesCutAnOpponentWhetherTheSearchFindsOrNot() {
        for (String charge : List.of(PREPARO, STRETTA)) for (boolean found : List.of(true, false)) {
            Card c = a.card(charge), hit = a.card(ChargeFrequency.hit(charge));
            Player me = player("starter-gigi", "a", List.of(c), found ? List.of(hit) : List.of(StarterRedesignTest.draftCard("base.com.Spintone")));
            Player foe = foe();
            Game g = playAndForecast(me, c, foe, null);
            assertEquals(496, foe.getResources().get(Resource.HEALTH), charge + " found=" + found);
            assertEquals(found, resolved(g, "a").getSearchFound() != null);
            int gain = found ? (charge.equals(PREPARO) ? 15 : 10) : 5;
            assertEquals(40 + gain, me.getResources().get(Resource.VIOLENCE));
            assertEquals(found ? 3 : 0, me.getCharacter().getStatuses().size(), "gettone solo se trova");
        }
    }

    @Test void theBanconeOfArmBHalvesDirectAndPeriodicPoisonOnlyInItsTurn() {
        int[] lost = new int[2], nextTurn = new int[2];
        for (int arm = 0; arm < 2; arm++) {
            Draft d = arm == 0 ? a : b;
            Card bancone = d.card(SetBaseArms.BANCONE), tossicone = d.card(TOSSICONE);
            Player me = seat("starter-pino", "a", bancone, Map.of());
            Player foe = seat("starter-tossico", "b", tossicone, Map.of(Resource.TOXICITY, 10));
            Game g = playAndForecast(me, bancone, foe, tossicone);
            lost[arm] = 500 - me.getResources().get(Resource.HEALTH);
            assertTrue(me.getCharacter().getStatuses().isEmpty(), "la difesa dura solo il turno");
            int before = me.getResources().get(Resource.HEALTH);
            turn(g, waitMove(g, me), waitMove(g, foe));
            nextTurn[arm] = before - me.getResources().get(Resource.HEALTH);
        }
        assertEquals(18 + 5 / 2, lost[0], "A: Tossicone 18 e periodico di 5 T");
        assertEquals(9 + 1, lost[1], "B: entrambi ×0,5 nel turno");
        assertEquals(nextTurn[0], nextTurn[1], "dal turno dopo il periodico non è più ridotto");
        assertTrue(nextTurn[0] > 0);
    }

    @Test void theBanconeStillHalvesHitAndLeavesCutInBothArms() {
        for (Draft d : List.of(a, b)) {
            Card bancone = d.card(SetBaseArms.BANCONE), hit = StarterRedesignTest.probeHit(20, 0);
            Player me = seat("starter-pino", "a", bancone, Map.of());
            Player foe = seat("starter-tossico", "b", hit, Map.of());
            playAndForecast(me, bancone, foe, hit);
            assertEquals(500 - (10 - 5 / 4), me.getResources().get(Resource.HEALTH), "HIT 20 ×0,5, poi la corazza dei 5 L appena presi");
        }
    }

    @Test void theOtherChangedHitsResolveWithTheirNumbersAndForecast() {
        Object[][] cases = {
                {"starter-spazienzio", IMPATTO, Map.of(Resource.VIOLENCE, 25), 30},
                {"starter-tossico", TOSSICONE, Map.of(Resource.TOXICITY, 10), 18},
                {"starter-pino", ESTASI, Map.of(Resource.ALCOHOL, 9), 27},
                {"starter-gigi", CHIAVE, Map.of(Resource.VIOLENCE, 10), 22},
                {"starter-gigi", LAVORO, Map.of(Resource.VIOLENCE, 10), 14 + 7 * 2},
        };
        for (Object[] c : cases) {
            @SuppressWarnings("unchecked") Map<Resource, Integer> res = (Map<Resource, Integer>) c[2];
            Card card = a.card((String) c[1]);
            Player me = seat((String) c[0], "a", card, res);
            if (c[1].equals(LAVORO)) {
                me.getCharacter().getItems().clear();
                for (int i = 0; i < 2; i++) me.getCharacter().getItems().add(StarterRedesignTest.draftCard("base.items.CascoDaLavoro"));
            }
            Player foe = foe();
            playAndForecast(me, card, foe, null);
            assertEquals(500 - (int) c[3], foe.getResources().get(Resource.HEALTH), (String) c[1]);
        }
    }

    @Test void sottoIlCofanoGivesFiveAlertnessOnTopOfItsRefund() {
        Card cofano = a.card(COFANO);
        Player me = seat("starter-gigi", "a", cofano, Map.of(Resource.VIOLENCE, 5, Resource.ALERTNESS, 0));
        playAndForecast(me, cofano, foe(), null);
        assertEquals(5, me.getResources().get(Resource.VIOLENCE));
        assertEquals(5, me.getResources().get(Resource.ALERTNESS));
    }

    @Test void theLiveToxicBloodDrainHasNoTunablePoisonInItsDraftsUnlessWritten() throws Exception {
        // Historical drafts without params.poison still load (optional @Tunable, D84); a typo is still refused.
        Draft.fromClasspath("/sb-6a/attuale.json");
        ObjectNode root = a.json().deepCopy();
        for (JsonNode c : root.get("cards"))
            if (c.get("binding").asText().equals(TRAVASO)) ((ObjectNode) c.get("params")).put("poisn", 12);
        IllegalArgumentException e = assertThrows(IllegalArgumentException.class, () -> Draft.parse("refuso", root));
        assertTrue(e.getMessage().contains("parametro sconosciuto params.poisn"), e.getMessage());
        ObjectNode noTurns = a.json().deepCopy();
        for (JsonNode c : noTurns.get("cards"))
            if (c.get("binding").asText().equals(TRAVASO)) ((ObjectNode) c.get("params")).remove("turns");
        e = assertThrows(IllegalArgumentException.class, () -> Draft.parse("senza turns", noTurns));
        assertTrue(e.getMessage().contains("parametro mancante params.turns"), e.getMessage());
        AbstractCard rutto = (AbstractCard) a.card(RUTTO);
        assertEquals(Set.of(Card.CardTarget.OPPONENT), rutto.getCanTarget());
    }
}

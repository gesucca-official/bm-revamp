package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.TurnForecast;
import com.gsc.bm.model.game.bot.ViewTable;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.List;
import java.util.Map;

import static com.gsc.bm.sim.StarterRedesignTest.foe;
import static com.gsc.bm.sim.StarterRedesignTest.game;
import static com.gsc.bm.sim.StarterRedesignTest.move;
import static com.gsc.bm.sim.StarterRedesignTest.player;
import static org.junit.jupiter.api.Assertions.assertEquals;

class EstasiDamageCapTest {
    private static final String ESTASI = "base.pino.GoingBerserk";
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception {
        StarterRedesignTest.load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    @ParameterizedTest
    @CsvSource(value = {
            "omesso, 20, 50",
            "0,      20, 50",
            "35,      6, 22",
            "30,     10, 30",
            "35,     20, 35",
            "30,     20, 30"
    }, nullValues = "omesso")
    void capsD149DamageInTheEngineAndBothBotModels(Integer cap, int alcohol, int expectedHit) {
        ObjectNode json = draft.json().deepCopy();
        ObjectNode params = (ObjectNode) StarterBalanceMeasureTest.card(json, ESTASI).get("params");
        params.remove("maxDamage");
        if (cap != null) params.put("maxDamage", cap);
        Card card = Draft.parse("Estasi D150", json).card(ESTASI);

        Player author = player("starter-pino", "a", List.of(card), List.of());
        author.getResources().put(Resource.ALCOHOL, alcohol);
        Player target = foe();
        Game game = game(author, target);

        BotView view = BotView.of(game, author.getPlayerId());
        LegalMove legal = view.legalMoves().stream()
                .filter(candidate -> candidate.getCard().getName().equals(card.getName())
                        && candidate.getTargetId().equals(target.getPlayerId()))
                .findFirst().orElseThrow();
        ViewTable table = ViewTable.forecast(view, Map.of());
        table.playTurn(List.of(ViewTable.Play.of(author.getPlayerId(), legal)), new ViewTable.Flags(true, false, false));
        List<Map<String, Integer>> variants = TurnForecast.variants(view, legal, null);
        card.resolve(game, move(game, author, card, target.getPlayerId()));

        PrintedEffects.Step hit = ((PrintedEffects.Source) card).printedEffects().getSteps().stream()
                .filter(step -> step.isOnTarget() && step.getKind() == PrintedEffects.Kind.DAMAGE)
                .findFirst().orElseThrow();
        assertEquals(cap == null ? 0 : cap, hit.getCap());
        assertEquals(500 - expectedHit, target.getResources().get(Resource.HEALTH), "motore");
        assertEquals(0, author.getResources().get(Resource.ALCOHOL), "motore");
        assertEquals(List.of(Map.of(author.getPlayerId(), 500, target.getPlayerId(), 500 - expectedHit)), variants,
                "TurnForecast");
        assertEquals(500 - expectedHit, table.health().get(target.getPlayerId()), "ViewTable");
        assertEquals(0, table.resources().get(author.getPlayerId()).get(Resource.ALCOHOL), "ViewTable");
    }
}

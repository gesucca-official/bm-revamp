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
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

class EstasiDamageCapTest {
    private static final String ESTASI = DOWN_IN_ONE;
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception {
        StarterRedesignTest.load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    // SB-27 (D177 (1), owner's answer to STOP 1/2): the maxDamage cap is gone with its parameter; the five cases with a cap (and the
    // one with maxDamage 0) are deleted. The uncapped case stays: engine and both bot models agree on 10 + 2 x the L spent.
    @ParameterizedTest
    @CsvSource(value = {
            "20, 50"
    })
    void uncappedDamageAgreesInTheEngineAndBothBotModels(int alcohol, int expectedHit) {
        ObjectNode json = draft.json().deepCopy();
        ObjectNode params = (ObjectNode) StarterBalanceMeasureTest.card(json, ESTASI).get("params");
        // D156 changes the delivered draft. Keep the D149 input for this cap experiment.
        params.put("perAlcohol", 2);
        Card card = Draft.parse("Estasi D150", json).card(ESTASI);

        Player author = player(STARTER_PIERA, "a", List.of(card), List.of());
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
        assertEquals(0, hit.getCap());
        assertEquals(500 - expectedHit, target.getResources().get(Resource.HEALTH), "motore");
        assertEquals(0, author.getResources().get(Resource.ALCOHOL), "motore");
        assertEquals(List.of(Map.of(author.getPlayerId(), 500, target.getPlayerId(), 500 - expectedHit)), variants,
                "TurnForecast");
        assertEquals(500 - expectedHit, table.health().get(target.getPlayerId()), "ViewTable");
        assertEquals(0, table.resources().get(author.getPlayerId()).get(Resource.ALCOHOL), "ViewTable");
    }
}

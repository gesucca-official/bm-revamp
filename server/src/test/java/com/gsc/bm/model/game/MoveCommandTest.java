package com.gsc.bm.model.game;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.api.ws.MoveCommandValidator;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.com.items.RottenBeer;
import com.gsc.bm.model.cards.com.Steal;
import org.junit.jupiter.api.Test;
import java.util.Map;
import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;

class MoveCommandTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private final MoveCommandValidator validator = new MoveCommandValidator();
    private Move command(Game g, String card, String target, Object choices) {
        var body = mapper.valueToTree(Map.of("playedCardName",card,"playerId","alice","targetId",target,"gameId",g.getGameId(),"choices", choices));
        return validator.validate(g,"alice",g.getGameId(),body);
    }
    @Test void malformedCommandsNeverReachEngine() throws Exception {
        var alice = player("alice"); var game = duel(alice, player("bob"));
        var good = mapper.valueToTree(Map.of("playedCardName","last-resort","playerId","alice","targetId","bob","gameId",game.getGameId()));
        for (String field : new String[]{"playedCardName","playerId","targetId","gameId"}) {
            var bad = good.deepCopy(); ((com.fasterxml.jackson.databind.node.ObjectNode)bad).putNull(field);
            assertThrows(IllegalMoveException.class, () -> validator.validate(game,"alice",game.getGameId(),bad));
        }
        for (String extra : new String[]{"isVoid","void","moveReport"}) {
            var bad = good.deepCopy(); ((com.fasterxml.jackson.databind.node.ObjectNode)bad).put(extra,true);
            assertThrows(IllegalMoveException.class, () -> validator.validate(game,"alice",game.getGameId(),bad));
        }
        assertThrows(IllegalMoveException.class, () -> validator.validate(game,"alice",game.getGameId(),mapper.readTree("null")));
        assertThrows(IllegalMoveException.class, () -> command(game,"last-resort","missing", Map.of()));
        assertThrows(IllegalMoveException.class, () -> command(game,"last-resort","SELF", Map.of()));
        assertThrows(IllegalMoveException.class, () -> command(game,"last-resort","bob", Map.of("UNKNOWN","x")));
        assertTrue(game.getPendingMoves().isEmpty()); assertEquals(100,alice.getResources().get(Resource.HEALTH));
    }
    @Test void boundDiscardAndItemsKeepExistingChecksAndSelfConvention() {
        var alice = player("alice"); var bob = player("bob"); var g = duel(alice,bob);
        assertThrows(IllegalMoveException.class, () -> command(g,"bound-two","SELF",Map.of()));
        assertThrows(IllegalMoveException.class, () -> g.submitMove(command(g,"bound-two","SELF",Map.of("DISCARD_ONE","last-resort"))));
        alice.getCardsInHand().add(named(new com.gsc.bm.model.cards.bruiser.SuperImpact(),"spare"));
        g.submitMove(command(g,"bound-two","SELF",Map.of("DISCARD_ONE","spare")));
        assertEquals(1,g.getPendingMoves().size());
    }
    @Test void nearAndFarItemsRequireRealChoiceWithoutChangingResources() {
        var alice = player("alice"); var bob = player("bob"); var g = duel(alice,bob);
        alice.getCharacter().getItems().add(named(new RottenBeer(),"near"));
        bob.getCharacter().getItems().add(named(new RottenBeer(),"far"));
        alice.getCardsInHand().add(named(new Steal(),"steal"));
        assertThrows(IllegalMoveException.class, () -> command(g,"basic","SELF",Map.of()));
        assertThrows(IllegalMoveException.class, () -> g.submitMove(command(g,"basic","SELF",Map.of("TARGET_ITEM","missing"))));
        Move near = command(g,"basic","SELF",Map.of("TARGET_ITEM","near"));
        assertEquals("SELF",near.getTargetId());
        Move far = command(g,"steal","bob",Map.of("TARGET_ITEM","far"));
        assertEquals("far",far.getChoices().get(Move.AdditionalAction.TARGET_ITEM));
        assertTrue(g.getPendingMoves().isEmpty()); assertEquals(20,alice.getResources().get(Resource.ALERTNESS));
        g.submitMove(near);
        assertEquals(1,g.getPendingMoves().size());
        var second = duel(alice,bob);
        second.submitMove(command(second,"steal","bob",Map.of("TARGET_ITEM","far")));
        assertEquals(1,second.getPendingMoves().size());
        assertEquals(20,alice.getResources().get(Resource.ALERTNESS));
    }
}

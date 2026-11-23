package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.sim.StarterRedesignTest.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

class GoingBerserkTest {
    private static final String ESTASI = "base.pino.GoingBerserk";
    private static final String ULTIMO_GIRO = "base.pino.UltimoGiro";
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        StarterRedesignTest.load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    // SB-27 (D177 (1), owner's answer to STOP 1/2): perAlcohol is no longer optional; the case with the parameter omitted is deleted.
    @Test
    void estasiUsesOneHitPerAlcoholWithTheParameterAtOne() {
        assertEstasi(estasiWith(1), 1, 30);
    }

    @Test
    void estasiUsesTwoHitsPerAlcoholWithTheD147Multiplier() {
        assertEstasi(estasiWith(2), 2, 42);
    }

    @Test
    void ultimoGiroKeepsItsAlcoholDamageSelfDamageAndRincara() {
        Card card = draft.card(ULTIMO_GIRO);
        Player author = pieraWith(card, 3); // Sotto la soglia della corazza di L in d50.
        Player target = foe();
        Game game = game(author, target);
        author.getCharacter().countPlay(card.getName());
        card.resolve(game, move(game, author, card, target.getPlayerId()));

        // SB-21z (D162): base 10 (era 12), rincaro a se' 2 (era 1).
        assertEquals(500 - (10 + 3 + 4), target.getResources().get(Resource.HEALTH));
        assertEquals(500 - (2 + 2), author.getResources().get(Resource.HEALTH));
        assertEquals(0, author.getResources().get(Resource.ALCOHOL));
        assertEquals(List.of(
                damage(false, 2).perPlay(2).build(),
                emptyAlcohol(),
                damage(true, 10).of(Resource.ALCOHOL).times(1).atStart(true).perPlay(4).build()
        ), ((PrintedEffects.Source) card).printedEffects().getSteps());
    }

    private static Card estasiWith(Integer perAlcohol) {
        ObjectNode json = draft.json().deepCopy();
        ObjectNode card = (ObjectNode) StarterBalanceMeasureTest.card(json, ESTASI);
        card.putObject("cost");
        ObjectNode params = (ObjectNode) card.get("params");
        params.put("base", 18);
        params.remove("perAlcohol");
        if (perAlcohol != null) params.put("perAlcohol", perAlcohol);
        return Draft.parse("Estasi D147", json).card(ESTASI);
    }

    private static void assertEstasi(Card card, int multiplier, int total) {
        Player author = pieraWith(card, 12);
        Player target = foe();
        Game game = game(author, target);
        card.resolve(game, move(game, author, card, target.getPlayerId()));

        assertEquals(500 - total, target.getResources().get(Resource.HEALTH));
        assertEquals(500, author.getResources().get(Resource.HEALTH));
        assertEquals(0, author.getResources().get(Resource.ALCOHOL));
        assertEquals(List.of(
                emptyAlcohol(),
                damage(true, 18).of(Resource.ALCOHOL).times(multiplier).atStart(true).build()
        ), ((PrintedEffects.Source) card).printedEffects().getSteps());
    }

    private static Player pieraWith(Card card, int alcohol) {
        Player author = player("starter-pino", "a", List.of(card), List.of());
        author.getResources().put(Resource.ALCOHOL, alcohol);
        return author;
    }

    private static PrintedEffects.Step emptyAlcohol() {
        return PrintedEffects.Step.builder().kind(PrintedEffects.Kind.EMPTY).resource(Resource.ALCOHOL).build();
    }

    private static PrintedEffects.Step.StepBuilder damage(boolean onTarget, int base) {
        return PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE)
                .onTarget(onTarget).damageType(Damage.DamageType.HIT).base(base);
    }
}

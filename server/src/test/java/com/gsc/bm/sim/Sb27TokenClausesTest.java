package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.gsc.bm.model.Resource.VIOLENCE;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Clausole dell'equipaggiamento del TOKEN, con il nome selezionabile rinviato a SB-28. */
class Sb27TokenClausesTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void conversionAffectsSelfDamageAndSubsequentCutModifiersButNotHitModifiers() {
        Card self = data("Colpo a sé", "{'binding':'t.ColpoASe','kind':'ACTION','targets':['SELF'],'self':"
                + "[{'op':'damage','type':'HIT','amount':9}]}");
        Game game = game(s(consume(), consume(), self), b());
        createAndConsume(game);
        apply(card("base.items.GuantiDaOfficina"), ch(game, "s"));
        apply(data("Modificatore CUT", "{'binding':'t.ModificatoreCut','kind':'ACTION','targets':['SELF'],'self':"
                + "[{'op':'status','name':'meno CUT','description':'prova','statusType':'BAD','flow':'OUTPUT',"
                + "'property':'CUT','factor':0.5,'turns':1}]}"), ch(game, "s"));

        assertEquals(6, turn(game, move(game, "s", "Colpo a sé", "SELF"), rest(game, "b"))[0],
                "9 HIT diventano 13 CUT, i Guanti sui HIT non si applicano, il malus CUT dimezza");
        assertTrue(ch(game, "s").getStatuses().stream().noneMatch(status -> status.isSingleUse()));
    }

    @Test
    void permessoRemovesTheBottleEquipmentBeforeItCanConvertTheNextHit() {
        Card attack = hit("Colpo di prova", 0, null, "HIT 7");
        Player opponent = b(card("bruiser.BadEducation"));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(s(consume(), consume(), attack), opponent);
        createAndConsume(game);
        assertEquals(1, ch(game, "s").getStatuses().size());
        assertTrue(ch(game, "s").getStatuses().get(0).isEquip());

        assertEquals(7, turn(game, move(game, "s", "Colpo di prova", "b"),
                move(game, "b", "PERMESSO SCUSA PUOI SMETTERLA", "s"))[1]);
        assertTrue(ch(game, "s").getStatuses().isEmpty());
    }

    private static void createAndConsume(Game game) {
        ch(game, "s").getItems().add(card("com.items.AnotherRottenBeer"));
        turn(game, onItem(game, "s", "Consuma", "s", "Doppio Malto da Discount"), rest(game, "b"));
        Card bottle = ch(game, "s").getItems().element();
        turn(game, onItem(game, "s", "Consuma", "s", bottle.getName()), rest(game, "b"));
    }
}

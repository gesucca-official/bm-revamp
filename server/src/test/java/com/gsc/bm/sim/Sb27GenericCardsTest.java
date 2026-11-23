package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Attesi dalle schede delle azioni generiche a dati del Set Base 1.0 candidato. */
class Sb27GenericCardsTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    private static Game with(String binding, Resource resource, int amount, Player opponent) {
        Player actor = s(card(binding));
        actor.getCharacter().getResources().put(resource, amount);
        return game(actor, opponent);
    }

    private static int[] play(Game game, String card, String target) {
        return turn(game, move(game, "s", card, target), rest(game, "b"));
    }

    @Test
    void afferrareConsumesOnlyTheSelectedItemAndDiscardsTheAction() {
        Game game = game(s(card("com.Grab")), b());
        ch(game, "s").getItems().addAll(List.of(card("base.items.EspressoDelDistributore"), card("com.items.RottenBeer")));
        turn(game, onItem(game, "s", "Afferrare", "s", "Espresso della Macchinetta"), rest(game, "b"));
        assertEquals(75, res(game, "s", ALERTNESS));
        assertEquals(List.of("Bionda da 66, Calda"), items(game, "s"));
        assertFalse(inHand(game, "s", "Afferrare"));
    }

    @Test
    void afferrareDoesNothingIfTheChosenItemWasDestroyedByAnEarlierMove() {
        Player destroyer = player("b", 90, card("bruiser.BreakYourToy"));
        destroyer.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(s(card("com.Grab")), destroyer);
        ch(game, "s").getItems().add(card("base.items.EspressoDelDistributore"));
        turn(game, onItem(game, "s", "Afferrare", "s", "Espresso della Macchinetta"),
                onItem(game, "b", "Disassemblare", "s", "Espresso della Macchinetta"));
        assertEquals(60, res(game, "s", ALERTNESS));
        assertTrue(items(game, "s").isEmpty());
        assertFalse(inHand(game, "s", "Afferrare"));
    }

    @Test
    void gabbianoPaysTenAndUsesOnlyPositiveOutgoingStatesButAllIncomingStates() {
        Game plain = with("bruiser.SeagullFly", VIOLENCE, 15, b());
        assertArrayEquals(new int[]{0, 20}, play(plain, "GABBIANO, DUNQUE VOLIAMOTI", "b"));
        assertEquals(5, res(plain, "s", VIOLENCE));

        Game game = with("bruiser.SeagullFly", VIOLENCE, 15, b());
        apply(card("base.items.GuantiDaOfficina"), ch(game, "s"));
        apply(data("Malus del colpitore",
                "{'binding':'t.MalusColpitore','kind':'ACTION','targets':['SELF'],'self':["
                + "{'op':'status','name':'malus','description':'prova','statusType':'BAD','flow':'OUTPUT','property':'HIT','factor':0.5,'turns':1}]}"), ch(game, "s"));
        apply(status("Parata", 0.5, false), ch(game, "b"));
        apply(data("Malus del bersaglio",
                "{'binding':'t.MalusBersaglio','kind':'ACTION','targets':['SELF'],'self':["
                + "{'op':'status','name':'malus','description':'prova','statusType':'BAD','flow':'INPUT','property':'HIT','factor':1.5,'turns':1}]}"), ch(game, "b"));
        assertArrayEquals(new int[]{0, 18}, play(game, "GABBIANO, DUNQUE VOLIAMOTI", "b"),
                "i Guanti portano a 25, la parata a 12 e il malus del bersaglio a 18");
    }

    @Test
    void foratonePaysFifteenVAndDealsTwentyFiveHit() {
        Game game = with("base.com.MattoneDelCantiere", VIOLENCE, 19, b());
        assertArrayEquals(new int[]{0, 25}, play(game, "Foratone da 28", "b"));
        assertEquals(4, res(game, "s", VIOLENCE));
    }

    @Test
    void ormaleHitsBeforeItEmptiesTheTargetTAndL() {
        Game game = with("bruiser.HealingBlow", VIOLENCE, 20, b());
        ch(game, "b").getResources().put(TOXICITY, 15);
        ch(game, "b").getResources().put(ALCOHOL, 12);
        assertArrayEquals(new int[]{0, 27}, play(game, "ORMALE GUARIAMOTI", "b"),
                "L assorbe 3 HIT prima che venga azzerata");
        assertEquals(0, res(game, "s", VIOLENCE));
        assertEquals(0, res(game, "b", TOXICITY));
        assertEquals(0, res(game, "b", ALCOHOL));
        assertEquals(10, res(game, "b", ALERTNESS));
    }

    @Test
    void ammaliamotiPaysFifteenHitsForTenAndAddsTenT() {
        Game game = with("bruiser.SickeningBlow", VIOLENCE, 17, b());
        assertArrayEquals(new int[]{0, 15}, play(game, "AMMALIAMOTI DI BOTTE", "b"), "10 HIT e 5 POISON periodici");
        assertEquals(2, res(game, "s", VIOLENCE));
        assertEquals(10, res(game, "b", TOXICITY));
    }

    @Test
    void stordiamotiPaysTenTakesUpToTenAAndHitsForTen() {
        Game game = with("bruiser.StunningBlow", VIOLENCE, 13, player("b", 7));
        assertArrayEquals(new int[]{0, 10}, play(game, "STORDIAMOTI HO DETTO", "b"));
        assertEquals(3, res(game, "s", VIOLENCE));
        assertEquals(0, res(game, "b", ALERTNESS));
    }

    @Test
    void gentileCostsFiveGainsFiveAAndQuartersOnlyHitThroughThisTurn() {
        Game game = with("bruiser.CantFeelAnything", VIOLENCE, 5, b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        assertArrayEquals(new int[]{15, 0}, turn(game, move(game, "s", "GENTILE IL TUO CAREZZO", "SELF"),
                move(game, "b", "Tre danni", "s")));
        assertEquals(0, res(game, "s", VIOLENCE));
        assertEquals(65, res(game, "s", ALERTNESS));
        assertTrue(ch(game, "s").getStatuses().isEmpty());
    }

    @Test
    void estremaFrettaPaysTenAGainsFiveVAndHitsForTen() {
        Game game = game(s(card("base.com.RincorsaDalMarciapiede")), b());
        assertArrayEquals(new int[]{0, 10}, play(game, "Estrema Fretta di Alcolizzarsi", "b"));
        assertEquals(50, res(game, "s", ALERTNESS));
        assertEquals(5, res(game, "s", VIOLENCE));
    }

    @Test
    void carapacePaysFiveAHealsTwoAndHalvesOnlyIncomingHitAndCut() {
        Game game = game(s(card("base.com.TartarugaSulMarciapiede")), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        assertArrayEquals(new int[]{11, 0}, turn(game, move(game, "s", "Tecnica del Carapace Mentale", "SELF"),
                move(game, "b", "Tre danni", "s")), "3 HIT, 3 CUT, 7 POISON meno 2 H");
        assertEquals(55, res(game, "s", ALERTNESS));
        assertTrue(ch(game, "s").getStatuses().isEmpty());
    }

    @Test
    void dentiStrettiLosesAtMostFiveAAndGainsTenV() {
        Game game = with("base.com.DentiStretti", ALERTNESS, 3, b());
        assertArrayEquals(new int[]{0, 0}, play(game, "Denti Stretti", "SELF"));
        assertEquals(0, res(game, "s", ALERTNESS));
        assertEquals(10, res(game, "s", VIOLENCE));
    }

    @Test
    void dueDitaHitsSelfBeforeItEmptiesTAndL() {
        Game game = game(s(card("base.com.DueDitaInGola")), b());
        ch(game, "s").getResources().put(TOXICITY, 15);
        ch(game, "s").getResources().put(ALCOHOL, 12);
        assertArrayEquals(new int[]{2, 0}, play(game, "Due Dita in Gola", "SELF"));
        assertEquals(0, res(game, "s", TOXICITY));
        assertEquals(0, res(game, "s", ALCOHOL));
        assertEquals(60, res(game, "s", ALERTNESS));
    }

    @Test
    void fasciaturaLosesAtMostFiveAAndHealsEight() {
        Game game = with("base.com.FasciaturaColFazzolettaccio", ALERTNESS, 3, b());
        assertArrayEquals(new int[]{-8, 0}, play(game, "Fasciatura d'Emergenza", "SELF"));
        assertEquals(0, res(game, "s", ALERTNESS));
    }

    @Test
    void sputoPaysFiveAndItsTenPoisonBypassAlcoholArmourAndTImmunity() {
        Player opponent = player(character("b", 10, 3, TOXICITY), List.of(), fillers(10), null);
        opponent.getCharacter().getResources().put(ALCOHOL, 12);
        Game game = game(s(card("base.com.SputoDaPosacenere")), opponent);
        assertArrayEquals(new int[]{0, 10}, play(game, "Sputo nel Posacenere", "b"));
        assertEquals(55, res(game, "s", ALERTNESS));
    }

    @Test
    void spintoneDealsEightHitBeforeAlcoholArmour() {
        Game game = game(s(card("base.com.Spintone")), b());
        ch(game, "b").getResources().put(ALCOHOL, 12);
        assertArrayEquals(new int[]{0, 5}, play(game, "Spintone", "b"));
    }

    @Test
    void manoLestaGainsFiveAAndTakesUpToFiveFromTheOpponent() {
        Game game = game(s(card("base.com.ManoLesta")), player("b", 3));
        assertArrayEquals(new int[]{0, 0}, play(game, "Mano Lesta", "b"));
        assertEquals(65, res(game, "s", ALERTNESS));
        assertEquals(0, res(game, "b", ALERTNESS));
    }

    @Test
    void riprendereHealsTenAndAmplifiesHitAndCutForTwoTurnsOnly() {
        Card attack = hit("Tre danni", -1, null, "HIT 7", "CUT 7", "POISON 7");
        Game game = game(s(card("base.com.SecondoFiato")), player(character("b", 10, 3), List.of(attack),
                List.of(attack, attack), null));
        assertArrayEquals(new int[]{13, 0}, turn(game, move(game, "s", "Riprendere Fiato", "SELF"), move(game, "b", "Tre danni", "s")),
                "8 HIT, 8 CUT e 7 POISON meno cura di 10");
        assertEquals(23, turn(game, rest(game, "s"), move(game, "b", "Tre danni", "s"))[0]);
        assertEquals(21, turn(game, rest(game, "s"), move(game, "b", "Tre danni", "s"))[0]);
    }

    @Test
    void coccioPersistsUntilTheFirstHitConvertsBothHitsThenExpires() {
        Card attack = hit("Doppio HIT", 0, null, "HIT 7", "HIT 5");
        Player actor = player(character("s", 60, 3), List.of(card("base.com.CoccioDiBottiglia"), attack),
                List.of(filler(), filler(), attack), null);
        actor.getCharacter().getResources().put(VIOLENCE, 5);
        Player opponent = player(character("b", 10, 3, ALCOHOL), List.of(), fillers(10), null);
        opponent.getCharacter().getResources().put(ALCOHOL, 12);
        Game game = game(actor, opponent);
        play(game, "Coccio di Bottiglia", "SELF");
        assertEquals(0, res(game, "s", VIOLENCE));
        play(game, "Riempitivo", "SELF");
        assertEquals(1, ch(game, "s").getStatuses().size());
        assertEquals(17, play(game, "Doppio HIT", "b")[1], "10 e 7 CUT, la corazza non li riduce");
        assertTrue(ch(game, "s").getStatuses().isEmpty());
        assertEquals(6, play(game, "Doppio HIT", "b")[1], "4 e 2 HIT dopo corazza");
    }

    @Test
    void svegliaEmptiesOpponentLBeforeItsFourHit() {
        Game game = game(s(card("base.com.AcquaInFaccia")), b());
        ch(game, "b").getResources().put(ALCOHOL, 20);
        assertArrayEquals(new int[]{0, 4}, play(game, "Svegliaaah!", "b"));
        assertEquals(55, res(game, "s", ALERTNESS));
        assertEquals(0, res(game, "b", ALCOHOL));
        assertEquals(10, res(game, "b", ALERTNESS));
    }

    @Test
    void sgambettoPaysTenALowersOpponentVAndDealsFiveHit() {
        Game game = game(s(card("base.com.Sgambetto")), b());
        ch(game, "b").getResources().put(VIOLENCE, 8);
        assertArrayEquals(new int[]{0, 5}, play(game, "Sgambetto", "b"));
        assertEquals(50, res(game, "s", ALERTNESS));
        assertEquals(1, res(game, "b", VIOLENCE), "0 dopo Sgambetto, poi 1 del riempitivo");
    }

    @Test
    void estasiRequiresBothResourcesAndPaysBothBeforeItsFortyHit() {
        Card card = card("base.com.EstasiDaCocaEtilene");
        Game game = game(s(card), b());
        ch(game, "s").getResources().put(TOXICITY, 10);
        ch(game, "s").getResources().put(ALCOHOL, 9);
        assertEquals(Map.of(TOXICITY, 10, ALCOHOL, 10), card.getCost());
        assertThrows(IllegalMoveException.class, () -> game.submitMove(move(game, "s", "Estasi da Coca Etilene", "b")));
        ch(game, "s").getResources().put(ALCOHOL, 10);
        assertArrayEquals(new int[]{0, 40}, play(game, "Estasi da Coca Etilene", "b"));
        assertEquals(0, res(game, "s", TOXICITY));
        assertEquals(0, res(game, "s", ALCOHOL));
    }

    @Test
    void addossoIncreasesDamageToBothPlayersOnTheNextPlay() {
        Card action = card("com.last.Struggle");
        Game game = game(player(character("s", 60, 3), List.of(), List.of(), action), b());
        assertTrue(action.isLastResort());
        assertArrayEquals(new int[]{5, 10}, play(game, "Addosso!!!", "b"));
        assertArrayEquals(new int[]{7, 15}, play(game, "Addosso!!!", "b"));
    }
}

package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.SplittableRandom;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

/**
 * SB-7b: gli stili euristici e il costo in HEALTH. Partite vere della bozza di prova di SB-9, con la mano e la salute di Rocco
 * impostate a mano: nessuno stile si uccide pagando, la salute spesa pesa come danno subito, l'aggressivo paga ancora quando conviene.
 */
class BotHealthCostTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String PAID = "prova.rocco.ColpoPagato", FREE = "prova.ColpoGratis";
    private static final int TRIES = 50;

    private static Map<String, BotPolicy> styles() {
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        styles.put("aggressivo", new AggressivePolicy());
        styles.put("prudente", new PrudentPolicy());
        styles.put("risorse", new ResourceAwarePolicy());
        return styles;
    }

    /** La bozza di prova con un gemello gratuito del colpo pagato di Rocco: stesso danno, stessa priorità, stesso ruolo. */
    private static Draft draft() throws Exception {
        ObjectNode root = (ObjectNode) Draft.fromClasspath("/sb-6a/prova-sb9.json").json();
        ObjectNode twin = null;
        for (com.fasterxml.jackson.databind.JsonNode card : root.get("cards"))
            if (PAID.equals(card.get("binding").asText())) twin = card.deepCopy();
        twin.put("binding", FREE);
        twin.putObject("cost");
        ((ObjectNode) twin.get("gui")).put("name", "PROVA COLPO GRATIS");
        ((ArrayNode) root.get("cards")).add(twin);
        return Draft.parse("prova-sb7b.json", root);
    }

    /** Rocco al primo posto con la mano data (oltre a basic, bound e last resort se richiesti) e la salute data; Mara di fronte. */
    private static Game table(Draft draft, int roccoHealth, int maraHealth, boolean fixedCards, String... regular) throws Exception {
        Game game = new SimulationRunner(draft).newGame(0, new SimulationRunner.Contender("prova-rocco", new AggressivePolicy()),
                new SimulationRunner.Contender("prova-mara", new AggressivePolicy()));
        Player rocco = game.getPlayers().get("seat-1");
        List<Card> hand = rocco.getCardsInHand();
        hand.removeIf(card -> !fixedCards || !(card.isBasicAction() || card.isCharacterBound() || card.isLastResort()));
        for (String binding : regular) hand.add(draft.card(binding));
        rocco.getCharacter().getResources().put(Resource.HEALTH, roccoHealth);
        game.getPlayers().get("seat-2").getCharacter().getResources().put(Resource.HEALTH, maraHealth);
        return game;
    }

    private static String choice(BotPolicy policy, Game game, long seed) {
        BotView view = BotView.of(game, "seat-1");
        List<LegalMove> legal = view.legalMoves();
        // Semi mescolati: con new Random(seed) e semi consecutivi piccoli il primo nextInt(2) è quasi sempre lo stesso, e un pareggio
        // fra due mosse non si vedrebbe.
        return policy.choose(view, legal, new Random(new SplittableRandom(seed).nextLong())).getCard().getName();
    }

    @Test
    void noStylePaysWithItsLastHealthEvenToKill() throws Exception {
        Draft draft = draft();
        // Un costo si paga solo se non supera la salute: la mossa suicida è quella che costa esattamente la salute rimasta.
        // Salute 15: il colpo da 15 HEALTH (35 HIT, Mara a 10 ne morirebbe). Salute 10: il contrattacco da 10 HEALTH.
        Map<Integer, String> suicidal = Map.of(15, PAID, 10, "prova.rocco.Contrattacco");
        for (Map.Entry<Integer, String> e : suicidal.entrySet()) {
            String name = draft.card(e.getValue()).getName();
            Game game = table(draft, e.getKey(), 10, true, PAID, "prova.rocco.Contrattacco", "prova.rocco.Incassare");
            assertEquals(true, BotView.of(game, "seat-1").legalMoves().stream().anyMatch(m -> m.getCard().getName().equals(name)),
                    e.getValue() + " deve essere legale: costa quanto la salute");
            for (Map.Entry<String, BotPolicy> style : styles().entrySet())
                for (long seed = 0; seed < TRIES; seed++)
                    assertNotEquals(name, choice(style.getValue(), game, seed), style.getKey() + " si uccide pagando con salute " + e.getKey());
        }
    }

    @Test
    void healthPaidWeighsLikeDamageTaken() throws Exception {
        Draft draft = draft();
        String free = draft.card(FREE).getName();
        // Le due carte in entrambi gli ordini della mano: un pareggio non può passare per una preferenza.
        for (Game game : List.of(table(draft, 100, 100, true, PAID, FREE, "prova.rocco.Incassare"),
                table(draft, 100, 100, true, FREE, PAID, "prova.rocco.Incassare")))
            for (Map.Entry<String, BotPolicy> style : styles().entrySet())
                for (long seed = 0; seed < TRIES; seed++)
                    assertEquals(free, choice(style.getValue(), game, seed), style.getKey() + ": fra due colpi uguali sceglie quello gratuito");
    }

    @Test
    void aggressiveStillPaysHealthForAStrongHit() throws Exception {
        Draft draft = draft();
        String paid = draft.card(PAID).getName();
        Game game = table(draft, 100, 100, true, PAID, "prova.rocco.Incassare");
        for (long seed = 0; seed < TRIES; seed++)
            assertEquals(paid, choice(new AggressivePolicy(), game, seed), "con 100 di salute il colpo da 35 vale i 15 pagati");
    }

    @Test
    void aSuicidalMoveIsStillChosenWhenItIsTheOnlyOne() throws Exception {
        Draft draft = draft();
        String paid = draft.card(PAID).getName();
        Game game = table(draft, 15, 100, false, PAID);
        assertEquals(1, BotView.of(game, "seat-1").legalMoves().size());
        for (BotPolicy policy : styles().values()) assertEquals(paid, choice(policy, game, 0));
    }
}

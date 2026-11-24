package com.gsc.bm.model.game;

import com.gsc.bm.LiveFixtures;
import com.gsc.bm.model.cards.AbstractCard;

import java.util.List;

/**
 * Synthetic GUI names replace catalog loading; no Spring or repositories. SB-28, D184 (1): the matches are those of the live
 * game, regulation 2.0 ({@link Ruleset#LIVE}), and the players are Spazienzio of the Set Base 1.0 with the basic action, the two
 * bound cards and the last resort of his starter, under the names the tests address.
 */
final class GameFixtures {
    static <T extends AbstractCard> T named(T card, String name) {
        card.setGuiName(name);
        return card;
    }

    static Player player(String id) {
        var starter = LiveFixtures.SPAZIENZIO;
        // As in the 0.1 fixture: "bound-one" is «Svegliamoci - Ma Tu No» (against the opponent), "bound-two" «Lieve Fastidio» (on oneself).
        var bound = new java.util.ArrayList<>(LiveFixtures.bound(starter));
        for (var card : bound) {
            var loadable = (com.gsc.bm.model.cards.LoadableCard) card;
            loadable.setGuiName(card.getCanTarget().contains(com.gsc.bm.model.cards.Card.CardTarget.SELF) ? "bound-two" : "bound-one");
        }
        return new Player(id, LiveFixtures.character(LiveFixtures.set().characterOf(starter)),
                LiveFixtures.card(LiveFixtures.set().basicOf(starter), "basic"), bound,
                LiveFixtures.card(LiveFixtures.set().lastResortOf(starter), "last-resort"), List.of());
    }

    static Game duel(Player first, Player second) {
        return LiveFixtures.live(new Game(List.of(first, second), "unit-fixture", false));
    }
}

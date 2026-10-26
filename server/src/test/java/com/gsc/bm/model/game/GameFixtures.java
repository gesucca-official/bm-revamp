package com.gsc.bm.model.game;

import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.com.basic.BruiserGrab;
import com.gsc.bm.model.cards.bruiser.character.LittleSmack;
import com.gsc.bm.model.cards.bruiser.character.LittleRage;
import com.gsc.bm.model.cards.com.last.Struggle;

import java.util.List;

/** Synthetic GUI names replace catalog loading; no Spring or repositories. */
final class GameFixtures {
    static <T extends AbstractCard> T named(T card, String name) {
        card.setGuiName(name);
        return card;
    }

    static Player player(String id) {
        return new Player(id, new BigBadBruiser(),
                named(new BruiserGrab(), "basic"),
                List.of(named(new LittleSmack(), "bound-one"), named(new LittleRage(), "bound-two")),
                named(new Struggle(), "last-resort"), List.of());
    }

    static Game duel(Player first, Player second) {
        return new Game(List.of(first, second), "unit-fixture", false);
    }
}

package com.gsc.bm.model.game;

import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.bruiser.character.LittleRage;
import com.gsc.bm.model.cards.bruiser.character.LittleSmack;
import com.gsc.bm.model.cards.com.basic.BruiserGrab;
import com.gsc.bm.model.cards.com.last.Struggle;

import java.util.List;

/**
 * SB-28, D184 (1): the old fixtures of the tests that exercise the historical engine, regulation 1.13 ({@link Ruleset#LEGACY}),
 * with the Java characters and cards of the Set Base 0.1 (100 HEALTH). They are not live matches: the live game is
 * {@link GameFixtures} (regulation 2.0, Set Base 1.0). The classes live in the test sources, where the historical drafts and
 * the measurements that run on 1.13 (-Dsim.rules=1.13) read them. See docs/reports/set-base/sb-28-report.md, «Rifinitura».
 */
final class LegacyFixtures {
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

    static Game legacy(Game game) {
        game.useRuleset(Ruleset.LEGACY);
        return game;
    }

    static Game duel(Player first, Player second) {
        Game game = new Game(List.of(first, second), "unit-fixture", false);
        game.useRuleset(Ruleset.LEGACY);
        return game;
    }
}

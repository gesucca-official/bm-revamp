package com.gsc.bm;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.sim.DraftSource;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * SB-28, D184 (1): the fixtures that build a {@link Game} by hand play the live game, regulation 2.0 ({@link Ruleset#LIVE}) with
 * the characters and cards of the live set (Set Base 1.0, file {@code sets/base.json}), as the factory does. Only the tests that
 * read archived matches (regulation 1.13) stay on {@link Ruleset#LEGACY}, and their archive header says 1.13.
 */
public final class LiveFixtures {
    private LiveFixtures() { }

    public static final String SPAZIENZIO = "starter-spazienzio";
    public static final String MARA = "starter-mara";
    public static final String CELESTINA = "starter-tossico";

    private static DraftSource set;

    /** The live set, loaded once: it only creates new cards and characters on request. */
    public static synchronized DraftSource set() {
        if (set == null) {
            try {
                set = new LiveSet().set();
            } catch (Exception e) {
                throw new IllegalStateException("Cannot load the live set", e);
            }
        }
        return set;
    }

    /** A new character of the live set, by its id (for example {@code bruiser.character.BigBadBruiser}). */
    public static Character character(String id) { return set().character(id); }

    /** A new card of the live set, by binding, with the GUI name given (tests address moves by name). */
    public static Card card(String binding, String guiName) {
        LoadableCard card = set().card(binding);
        if (guiName != null) card.setGuiName(guiName);
        return card;
    }

    public static Card card(String binding) { return card(binding, null); }

    /** A player with the character, basic, bound and last resort of the starter and the given regular cards (none by default). */
    public static Player player(String id, String starter) {
        return new Player(id, character(set().characterOf(starter)), card(set().basicOf(starter), "basic"), bound(starter),
                card(set().lastResortOf(starter), "last-resort"), List.of());
    }

    /** The same, with the given regular cards (the deck). */
    public static Player player(String id, String starter, List<Card> regular) {
        return new Player(id, character(set().characterOf(starter)), card(set().basicOf(starter), "basic"), bound(starter),
                card(set().lastResortOf(starter), "last-resort"), regular);
    }

    /** The same, with the whole regular deck of the starter. */
    public static Player playerWithDeck(String id, String starter) {
        return new Player(id, character(set().characterOf(starter)), card(set().basicOf(starter)), bound(starter),
                card(set().lastResortOf(starter)), regular(starter));
    }

    public static ComPlayer computer(String id, String starter, long seed) {
        return new ComPlayer(id, character(set().characterOf(starter)), card(set().basicOf(starter), "basic"), bound(starter),
                card(set().lastResortOf(starter), "last-resort"), List.of(), new Random(seed));
    }

    public static List<Card> bound(String starter) {
        return set().boundOf(starter).stream().map(b -> card(b)).collect(Collectors.toList());
    }

    public static List<Card> regular(String starter) {
        return set().regularOf(starter).stream().map(b -> card(b)).collect(Collectors.toList());
    }

    /** The match as the live factory builds it: regulation 2.0. */
    public static Game live(Game game) {
        game.useRuleset(Ruleset.LIVE);
        return game;
    }

    /**
     * The match of the historical simulator (the frozen Set Base 0.1 catalog and the historical drafts, regulation 1.13): the only
     * hand-built matches that are not live, D184 (1). Explicit, so that no test gets the 1.13 engine by default.
     */
    public static Game legacy(Game game) {
        game.useRuleset(Ruleset.LEGACY);
        return game;
    }

    public static Game game(String type, Player... players) {
        return live(new Game(List.of(players), type, false));
    }
}

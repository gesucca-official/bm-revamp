package com.gsc.bm.service.factories;

import com.gsc.bm.bozza.BozzaDraft;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.ComLevel;
import com.gsc.bm.service.session.model.QueuedPlayer;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class GameFactoryServiceImpl implements GameFactoryService {

    private final Environment env;
    private final PlayerFactoryService playerFactoryService;
    /** The rules of the matches: SB-28, {@link Ruleset#LIVE} (regulation 2.0), or those the profile bozza chooses (SB-16c). */
    private final Ruleset ruleset;

    @Autowired
    public GameFactoryServiceImpl(Environment env,
                                  PlayerFactoryService playerFactoryService,
                                  ObjectProvider<BozzaDraft> bozza) {
        this.env = env;
        this.playerFactoryService = playerFactoryService;
        BozzaDraft draft = bozza.getIfAvailable();
        this.ruleset = draft == null ? Ruleset.LIVE : draft.ruleset();
    }

    private Game withRules(Game game) {
        game.useRuleset(ruleset); // SB-28: always explicit, the engine's default is the legacy 1.13 of the old tests
        return game;
    }

    @Override
    public Game craftQuick1vComGame(String playerId, String category, ComLevel level) {
        return withRules(new Game(List.of(
                playerFactoryService.craftRandomPlayer(playerId, category),
                playerFactoryService.craftComPlayer(category, level)
        ), "quick1vCom", Objects.equals(env.getProperty("log.db"), "N")));
    }

    @Override
    public Game craftOpen1vComGame(String username, String deckId, ComLevel level) {
        return withRules(new Game(List.of(
                playerFactoryService.craftOpenPlayer(username, deckId),
                playerFactoryService.craftComPlayer(null, level)
        ), "open1vCom", Objects.equals(env.getProperty("log.db"), "N")));
    }

    @Override
    public Game craftQuickMultiPlayerGame(List<QueuedPlayer> queuedPlayers, String type) {
        List<Player> players = new ArrayList<>(queuedPlayers.size());
        for (QueuedPlayer qp : queuedPlayers)
            players.add(
                    qp.isHuman()
                            ? playerFactoryService.craftRandomPlayer(qp.getPlayerId(), qp.getCategory())
                            // FFA computers: any starter (Q1, D190), at Normale (R01 2.2, D203 (1))
                            : playerFactoryService.craftComPlayer(null, ComLevel.NORMALE)
            );
        return withRules(new Game(players, type, Objects.equals(env.getProperty("log.db"), "N")));
    }

}

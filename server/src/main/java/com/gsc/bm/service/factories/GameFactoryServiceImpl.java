package com.gsc.bm.service.factories;

import com.gsc.bm.bozza.BozzaDraft;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
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
    /** SB-16c: the rules of the matches, {@link Ruleset#LIVE} unless the profile bozza chooses the playground ones. */
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
        if (ruleset != Ruleset.LIVE) game.useRuleset(ruleset);
        return game;
    }

    @Override
    public Game craftQuick1vComGame(String playerId) {
        return withRules(new Game(List.of(
                playerFactoryService.craftRandomPlayer(playerId),
                playerFactoryService.craftRandomComPlayer()
        ), "quick1vCom", Objects.equals(env.getProperty("log.db"), "N")));
    }

    @Override
    public Game craftOpen1vComGame(String username, String deckId) {
        return withRules(new Game(List.of(
                playerFactoryService.craftOpenPlayer(username, deckId),
                playerFactoryService.craftRandomComPlayer()
        ), "open1vCom", Objects.equals(env.getProperty("log.db"), "N")));
    }

    @Override
    public Game craftQuickMultiPlayerGame(List<QueuedPlayer> queuedPlayers, String type) {
        List<Player> players = new ArrayList<>(queuedPlayers.size());
        for (QueuedPlayer qp : queuedPlayers)
            players.add(
                    qp.isHuman()
                            ? playerFactoryService.craftRandomPlayer(qp.getPlayerId())
                            : playerFactoryService.craftRandomComPlayer()
            );
        return withRules(new Game(players, type, Objects.equals(env.getProperty("log.db"), "N")));
    }

}

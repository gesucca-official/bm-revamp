package com.gsc.bm.service.view;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.service.catalog.CatalogSource;
import com.gsc.bm.service.view.model.client.*;
import com.gsc.bm.service.view.model.deck.CharacterCardView;
import com.gsc.bm.service.view.model.logging.SlimCharacterView;
import com.gsc.bm.service.view.model.logging.SlimGameView;
import com.gsc.bm.service.view.model.logging.SlimPlayerView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.SerializationUtils;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ViewExtractorServiceImpl implements ViewExtractorService {

    // SB-8: names and sprites by binding from the catalog source. For the live classes the binding is the class name without
    // the cards package, the key used before; a character described as data (profile bozza) has no class of its own.
    private final CatalogSource catalog;

    @Autowired
    public ViewExtractorServiceImpl(CatalogSource catalog) {
        this.catalog = catalog;
    }

    private CatalogSource.CharacterGui gui(Character character) {
        String binding = character.getBindingName();
        return catalog.characterGui(binding)
                .orElseThrow(() -> new RuntimeException("Couldn't load Character from internal DB! " + binding));
    }

    @Override
    public SlimGameView extractGlobalSlimView(Game game) {
        byte[] bytes = SerializationUtils.serialize(game);
        Game gameClone = (Game) SerializationUtils.deserialize(bytes);

        assert gameClone != null;
        List<SlimPlayerView> slimPlayers = gameClone.getPlayers().values()
                .stream()
                .map(p -> SlimPlayerView.builder()
                        .playerId(p.getPlayerId())
                        .character(toSlimView(p.getCharacter()))
                        .cardsInHand(p.getCardsInHand()
                                .stream()
                                .map(Card::getName)
                                .collect(Collectors.toList())
                        ).deck(p.getDeck()
                                .stream()
                                .map(Card::getName)
                                .collect(Collectors.toList())
                        ).build())
                .collect(Collectors.toList());

        return SlimGameView.builder()
                .gameId(gameClone.getGameId())
                .players(slimPlayers)
                .resolvedMoves(gameClone.getResolvedMoves()
                        .stream()
                        .map(Move::getSlimView)
                        .collect(Collectors.toList())
                ).timeBasedEffects(gameClone.getTimeBasedEffects())
                .over(game.isOver())
                .winner(game.getWinner().orElse("NONE"))
                .build();
    }

    private SlimCharacterView toSlimView(Character character) {
        CatalogSource.CharacterGui record = gui(character);
        return SlimCharacterView.builder()
                .name(record.getName())
                .items(character.getItems().stream()
                        .map(Card::getName)
                        .collect(Collectors.toList()))
                .resources(character.getResources())
                .statuses(character.getStatuses().stream()
                        .map(Status::getName)
                        .collect(Collectors.toList())
                ).immunities(character.getImmunities())
                .build();
    }

    @Override
    public ClientGameView extractViewFor(Game game, String playerId) {
        byte[] bytes = SerializationUtils.serialize(game);
        Game gameClone = (Game) SerializationUtils.deserialize(bytes);
        assert gameClone != null;

        return ClientGameView.builder()
                .gameId(gameClone.getGameId())
                .players(gameClone.getPlayers().values()
                        .stream()
                        .map(p -> {
                            if (!p.getPlayerId().equals(playerId))
                                return toClientViewForOpponents(p);
                            else return toClientViewForSelf(p);
                        })
                        .collect(Collectors.toMap(AbstractClientPlayerView::getPlayerId, Function.identity()))
                )
                .resolvedMoves(gameClone.getResolvedMoves())
                .timeBasedEffects(gameClone.getTimeBasedEffects())
                .over(gameClone.isOver())
                .winner(gameClone.getWinner().orElse("NONE"))
                .turn(gameClone.getTurn())
                .pendingMove(gameClone.getPendingMoves().stream().filter(m -> playerId.equals(m.getPlayerId())).findFirst().orElse(null))
                .forfeits(gameClone.getForfeits())
                .moveDeadlines(gameClone.getMoveDeadlines())
                .reconnectDeadlines(gameClone.getReconnectDeadlines())
                .outcomeReason(gameClone.getOutcomeReason())
                .build();
    }

    private ClientSelfPlayerView toClientViewForSelf(Player player) {
        byte[] bytes = SerializationUtils.serialize(player);
        Player p = (Player) SerializationUtils.deserialize(bytes);
        assert p != null;
        return ClientSelfPlayerView.builder()
                .playerId(p.getPlayerId())
                .character(toClientView(p.getCharacter()))
                .cardsInHand(p.getCardsInHand())
                .revealed(revealed(p, true))
                .deck(p.getDeck().size())
                .build();
    }

    private ClientOpponentView toClientViewForOpponents(Player player) {
        byte[] bytes = SerializationUtils.serialize(player);
        Player p = (Player) SerializationUtils.deserialize(bytes);
        assert p != null;
        return ClientOpponentView.builder()
                .playerId(p.getPlayerId())
                .character(toClientView(p.getCharacter()))
                .cardsInHand(p.getCardsInHand().size())
                .revealed(revealed(p, false))
                .deck(p.getDeck().size())
                .build();
    }

    /**
     * SB-16g 2a (D58): the face-up copies of a hand, for everyone; the owner also gets their place in the hand. Rebuilt from the
     * match at every view, so a reconnection shows them again. Empty, hence absent, with the live rules.
     */
    private static List<RevealedCardView> revealed(Player p, boolean own) {
        List<RevealedCardView> shown = new java.util.ArrayList<>();
        for (Player.Revealed r : p.getRevealed()) {
            int slot = -1;
            for (int i = 0; i < p.getCardsInHand().size(); i++) if (p.getCardsInHand().get(i) == r.getCard()) slot = i;
            if (slot < 0) continue;
            shown.add(RevealedCardView.builder().copy(r.getId()).slot(own ? slot : null).card(r.getCard()).turn(r.getTurn()).build());
        }
        return shown;
    }


    // TODO duplicate code come on g

    private ClientCharacterView toClientView(Character character) {
        byte[] bytes = SerializationUtils.serialize(character);
        Character c = (Character) SerializationUtils.deserialize(bytes);
        assert c != null;

        CatalogSource.CharacterGui record = gui(character);
        return ClientCharacterView.builder()
                .name(record.getName())
                .bindingName(c.getBindingName())
                .dead(c.isDead())
                .itemsSize(c.getItemsSize())
                .items(c.getItems())
                .resources(c.getResources())
                .statuses(c.getStatuses())
                .immunities(c.getImmunities())
                .timers(c.getTimers())
                .sprite(record.getSprite()) // TODO load this at once in a character factory??
                .build();
    }

    @Override
    public CharacterCardView extractDeckBuildingView(Character character) {
        byte[] bytes = SerializationUtils.serialize(character);
        Character c = (Character) SerializationUtils.deserialize(bytes);
        assert c != null;

        CatalogSource.CharacterGui record = gui(character);
        return CharacterCardView.builder()
                .name(record.getName())
                .bindingName(character.getBindingName())
                .sprite(record.getSprite())
                .itemsSize(c.getItemsSize())
                .resources(c.getResources())
                .immunities(c.getImmunities())
                .build();
    }
}

package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotView;

import java.util.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;

/**
 * SB-30b B5b: the public text of the draft's cards by binding, as the {@link com.gsc.bm.model.game.bot.ViewTable} catalog reads
 * it (built as in {@code ViewTableFidelityTest}, left unchanged). Card text is public: no player, game or hand enters a policy.
 */
final class PublicCatalog {

    private PublicCatalog() { }

    static Map<String, BotView.CardSeen> of(PlayerSource draft) throws Exception {
        Map<String, BotView.CardSeen> text = new HashMap<>();
        for (String deck : DECKS) {
            Player p = draft.player(deck, "text", new Random(0), null);
            List<Card> cards = new ArrayList<>(p.getCardsInHand());
            cards.addAll(p.getDeck()); cards.addAll(p.getCharacter().getItems()); cards.add(p.getLastResortCard());
            cards.add(new BrokenBeerBottle());
            for (Card c : cards) {
                BotView.CardSeen seen = BotView.publicText(c);
                PrintedEffects effects = c.isItem() ? PrintedEffects.consumedText(c) : seen.getEffects();
                text.putIfAbsent(c.getBindingName(), new BotView.CardSeen(seen.getName(), seen.getBinding(), seen.isItem(),
                        seen.isBasicAction(), seen.isLastResort(), seen.isCharacterBound(), seen.getPriority(), seen.getCanTarget(),
                        seen.getCost(), seen.getRole(), seen.getGains(), seen.getDamage(), seen.getDamageAmount(), seen.isLastBlow(), effects));
            }
        }
        return Map.copyOf(text);
    }
}

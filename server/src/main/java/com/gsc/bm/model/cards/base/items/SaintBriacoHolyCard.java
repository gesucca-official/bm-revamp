package com.gsc.bm.model.cards.base.items;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractItemCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Timer;

import java.util.List;

/**
 * «Santino di San Briaco», slot OGG-15 del Set Base: la scheda è quella del documento del set. Quando lo consumi diventi immune a L;
 * un timer di {@code turns} turni, contando questo, toglie l'immunità a L alla fine dell'ultimo, dopo l'effetto di fine turno della L,
 * anche se nel frattempo ne avevi un'altra. Il numero è nel file del set.
 */
@CardId("base.items.SantinoDellaPortinaia")
public class SaintBriacoHolyCard extends AbstractItemCard implements PrintedEffects.Source {

    /** I turni dell'immunità, contando quello in cui lo consumi. */
    @Tunable
    private int turns;

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        self.getImmunities().add(Resource.ALCOHOL);
        self.getTimers().add(new Timer("Santino della portinaia", c -> c.getImmunities().remove(Resource.ALCOHOL), turns));
        return List.of("Gained a temporary immunity to ALCOHOL");
    }

    /** Immunity to ALCOHOL; the timer that ends it is written apart, as data ({@link PrintedEffects#getTimers()}), for the bots. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.IMMUNE).resource(Resource.ALCOHOL).build()),
                List.of(), List.of(PrintedEffects.TimerText.builder().name("Santino della portinaia").turns(turns)
                        .revokes(List.of(Resource.ALCOHOL)).build()));
    }
}

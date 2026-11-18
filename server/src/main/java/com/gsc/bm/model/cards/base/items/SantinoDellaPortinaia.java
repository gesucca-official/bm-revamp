package com.gsc.bm.model.cards.base.items;

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
 * SB-17, OGG-15 del Set Base («Santino della portinaia», D107): consumato, immunità all'effetto periodico di L; un timer di
 * {@code turns} turni la toglie. È la logica di {@code MarvelousCocktail} ristretta a ciò che la griglia scrive: la classe viva
 * darebbe anche l'immunità a T e alla fine toglierebbe ogni stato, quindi qui c'è una classe della bozza invece di riusarla.
 * Solo bozza del Set Base (SB-28).
 */
public class SantinoDellaPortinaia extends AbstractItemCard implements PrintedEffects.Source {

    @Tunable
    private int turns = 3;

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        self.getImmunities().add(Resource.ALCOHOL);
        self.getTimers().add(new Timer("Santino della portinaia", c -> c.getImmunities().remove(Resource.ALCOHOL), turns));
        return List.of("Gained a temporary immunity to ALCOHOL");
    }

    /**
     * SB-17: immunity to ALCOHOL. SB-19 B2a (D133): the timer that ends it is written apart, as data ({@link PrintedEffects#getTimers()}),
     * for the bots' table; the engine's timer above is unchanged.
     */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.IMMUNE).resource(Resource.ALCOHOL).build()),
                List.of(), List.of(PrintedEffects.TimerText.builder().name("Santino della portinaia").turns(turns)
                        .revokes(List.of(Resource.ALCOHOL)).build()));
    }
}

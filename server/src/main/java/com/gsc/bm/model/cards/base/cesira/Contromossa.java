package com.gsc.bm.model.cards.base.cesira;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * SB-17, contromosse di Sergio (CES-AR2 «Ricatto», CES-AR3 «Lo sapevo»): annullano la mossa del bersaglio se arriva dopo, come
 * {@code YouStop}, con un effetto stampato in più che la sottoclasse dichiara. Solo bozza del Set Base: la partita viva non le conosce
 * (SB-28). Costo e priorità arrivano dalla bozza.
 * <p>
 * Una mossa già annullata (per esempio da un'altra contromossa) non si annulla di nuovo e non dà l'effetto in più.
 */
public abstract class Contromossa extends AbstractCard implements PrintedEffects.Source {

    /** La carta annullata in questa risoluzione, o null. */
    private Card countered;

    protected Contromossa() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setPriority(2);
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        countered = null;
        g.getPendingMoveOfTargetIfMovesAfterPlayer(m.getPlayerId(), m.getTargetId())
                .ifPresent(move -> {
                    if (move.isVoid()) return;
                    Card pending = g.getCardFromHand(move.getPlayerId(), move.getPlayedCardName());
                    if (!voids(pending)) return;
                    countered = pending;
                    move.setVoid(true);
                    onVoided(move);
                });
    }

    /** SB-21h: whether the card voids this pending card; every pending card by default («Ricatto», «Lo sapevo»). */
    protected boolean voids(Card pending) { return true; }

    /** What the card prints beyond the void, on the move just voided. */
    protected void onVoided(Move voided) { }

    /** The damage the card deals to the target after a void, by type; none by default. */
    protected Map<Damage.DamageType, Integer> afterVoid(Card voided) { return Map.of(); }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        if (countered == null) return List.of("You were too slow and didn't countered anything.");
        List<String> report = new ArrayList<>(List.of("Countered Target's own Move: " + countered.getName()));
        afterVoid(countered).forEach((type, amount) -> {
            if (amount > 0) report.add(self.inflictDamage(target, new Damage(type, amount)));
        });
        return report;
    }

    /** The base damage of a card as printed (engine and bots read it the same way), or from its public text. */
    static Map<Damage.DamageType, Integer> baseDamage(Card card) {
        if (card instanceof PrintedEffects.Source) {
            PrintedEffects effects = ((PrintedEffects.Source) card).printedEffects();
            if (effects != null) return PrintedEffects.baseDamage(effects);
        }
        if (!(card instanceof AbstractCard)) return Map.of();
        return PrintedEffects.nominalDamage(((AbstractCard) card).getDamage(), ((AbstractCard) card).getDamageAmount());
    }
}

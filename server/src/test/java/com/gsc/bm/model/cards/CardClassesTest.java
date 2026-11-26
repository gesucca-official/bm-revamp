package com.gsc.bm.model.cards;

import com.gsc.bm.model.cards.base.items.DiscountDoubleMalt;
import com.gsc.bm.model.cards.base.items.WarmBlonde66;
import com.gsc.bm.model.cards.base.sergio.Countermove;
import com.gsc.bm.model.cards.base.spazienzio.ThatsEnough;
import com.gsc.bm.model.cards.bruiser.SuperImpact;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.bruiser.character.LittleSmack;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** SB-34 B1 (D213): the two ways from an id to a class, and the ids the classes and helpers return. */
class CardClassesTest {

    /** A test-only class carrying an id that the historical rule also reaches. */
    @CardId("bruiser.SuperImpact")
    public static class Shadow extends SuperImpact {
    }

    @Test
    void aLiveClassReturnsItsDeclaredIdNotItsName() {
        assertEquals("bruiser.YouStop", new ThatsEnough().getBindingName());
        assertEquals("com.items.AnotherRottenBeer", new DiscountDoubleMalt().getBindingName());
        assertEquals("com.items.RottenBeer", new WarmBlonde66().getBindingName(), "the superclass keeps its own id");
        assertEquals("bruiser.YouStop", CardClasses.idOf(ThatsEnough.class));
    }

    @Test
    void aHistoricalClassKeepsTheRuleOfItsName() {
        assertEquals("bruiser.SuperImpact", new SuperImpact().getBindingName());
        assertEquals("bruiser.character.BigBadBruiser", new BigBadBruiser().getBindingName());
        assertEquals("bruiser.character.BigBadBruiser", new LittleSmack().getBoundToCharacter());
    }

    @Test
    void theRegistryComesFirstThenTheRule() throws Exception {
        assertEquals(ThatsEnough.class, CardClasses.forId("bruiser.YouStop"));
        assertEquals(SuperImpact.class, CardClasses.forId("bruiser.SuperImpact"));
        assertThrows(ClassNotFoundException.class, () -> CardClasses.forId("bruiser.Missing"));
    }

    @Test
    void anIdResolvedBothWaysIsALoadError() {
        Map<String, Class<? extends AbstractCard>> registry = CardClasses.registry(List.of(Shadow.class));
        IllegalStateException error = assertThrows(IllegalStateException.class,
                () -> CardClasses.forId("bruiser.SuperImpact", registry));
        assertTrue(error.getMessage().contains("sia dal registro"), error.getMessage());
    }

    @Test
    void aLiveClassReachedByItsClassNameIsALoadError() {
        IllegalStateException error = assertThrows(IllegalStateException.class,
                () -> CardClasses.forId("base.spazienzio.ThatsEnough"));
        assertTrue(error.getMessage().contains("bruiser.YouStop"), error.getMessage());
    }

    @Test
    void theRegistryRefusesClassesWithoutIdAbstractOrRepeated() {
        assertThrows(IllegalStateException.class, () -> CardClasses.registry(List.of(SuperImpact.class)));
        assertThrows(IllegalStateException.class, () -> CardClasses.registry(List.of(Countermove.class)));
        assertThrows(IllegalStateException.class, () -> CardClasses.registry(List.of(ThatsEnough.class, ThatsEnough.class)));
    }
}

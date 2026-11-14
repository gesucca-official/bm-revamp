package com.gsc.bm.sim;

import com.gsc.bm.model.Damage.DamageType;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.com.items.AnotherRottenBeer;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import com.gsc.bm.model.game.status.Vulnerability;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class PrintedEffectsCompletionTest {
    @Test void dataTextCopiesDurationUseSearchAndTokenTypes() {
        DataCards.StatusStep status = new DataCards.StatusStep();
        status.name = "public status"; status.description = "printed description";
        status.statusType = StatusType.GOOD; status.flow = StatusFlow.OUTPUT; status.property = DamageType.HIT;
        status.factor = 1.25f; status.turns = 2; status.singleUse = true; status.equip = true; status.convertTo = DamageType.CUT;
        DataCards.SearchStep search = new DataCards.SearchStep();
        search.card = "public.binding"; search.vulnerability = new Vulnerability();
        search.vulnerability.factor = 1.5f; search.vulnerability.damage = EnumSet.of(DamageType.CUT);
        search.foundGains = new EnumMap<>(Map.of(Resource.ALERTNESS, 7));
        DataCards.Definition definition = new DataCards.Definition(); definition.self = List.of(status, search);
        List<PrintedEffects.Step> text = DataCards.printed(definition).getSteps();
        assertEquals(2, text.get(0).getTurns());
        assertTrue(text.get(0).isSingleUse()); assertTrue(text.get(0).isEquip());
        assertEquals(status.name, text.get(0).getName()); assertEquals(status.description, text.get(0).getDescription());
        assertEquals(DamageType.CUT, text.get(0).getConvertTo());
        assertEquals(search.card, text.get(1).getSearchedCard());
        assertEquals(Set.of(DamageType.CUT), text.get(1).getTokenDamage());
        search.vulnerability.damage.clear(); search.foundGains.clear();
        assertEquals(Set.of(DamageType.CUT), text.get(1).getTokenDamage());
        assertEquals(Map.of(Resource.ALERTNESS, 7), text.get(1).getFoundGains());
    }

    @Test void supplementalJavaItemTextLeavesOldSourcesUntouched() {
        AnotherRottenBeer beer = new AnotherRottenBeer(); beer.setGuiRole("RESOURCES", "+17 L");
        assertFalse(beer instanceof PrintedEffects.Source);
        PrintedEffects.Step gain = PrintedEffects.consumedText(beer).getSteps().get(0);
        assertEquals(17, gain.getBase()); assertEquals(Resource.ALCOHOL, gain.getResource());
        assertEquals(new BrokenBeerBottle().getBindingName(), gain.getSpawnedItem());
        PrintedEffects.Step bottle = PrintedEffects.consumedText(new BrokenBeerBottle()).getSteps().get(0);
        assertEquals(DamageType.CUT, bottle.getConvertTo()); assertEquals(1.5f, bottle.getFactor());
        assertTrue(bottle.isSingleUse()); assertTrue(bottle.isEquip()); assertNull(bottle.getTurns());
    }
}

package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.CardClasses;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.factories.CardFactoryService;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeSet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * SB-34 B1 (D213): every {@code java: true} card of the live set and of the historical drafts 0.1 and 1.5 loads, through the real
 * loader, with its unchanged id and the expected class: a registered id gets the class of the approved table, any other id the
 * historical class at package + id. Removing a class from the registry makes these loads fail.
 */
class CardClassesLoadTest {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String PKG = CardFactoryService.BASE_CARDS_PKG;

    /** The approved table (docs/design/set-base/sb-34/tabella.json): id → class, for the live classes. */
    static final Map<String, String> APPROVED = new LinkedHashMap<>();

    static {
        APPROVED.put("bruiser.YouStop", "base.spazienzio.ThatsEnough");
        APPROVED.put("junkie.AmphetamineReflexes", "base.celestina.SpeedBoostedReflexes");
        APPROVED.put("junkie.ToxicBloodDrain", "base.celestina.DragIntoTheTunnel");
        APPROVED.put("base.pino.UltimoGiro", "base.piera.LastRound");
        APPROVED.put("base.pino.GoingBerserk", "base.piera.DownInOne");
        APPROVED.put("base.pino.RuttoADistanzaSociale", "base.piera.PointBlankBurp");
        APPROVED.put("bruiser.BreakYourToy", "base.beppe.Disassemble");
        APPROVED.put("base.gigi.LavoroFattoBene", "base.beppe.JobWellDone");
        APPROVED.put("base.cesira.bound.NeRiparliamoFuori", "base.sergio.bound.LetUsDiscussInPrivate");
        APPROVED.put("base.cesira.Ricatto", "base.sergio.GoodOldBlackmail");
        APPROVED.put("base.cesira.LoSapevo", "base.sergio.SeenThatScript");
        APPROVED.put("base.rocco.bound.MiRialzo", "base.duccio.bound.LetUsGetUpAndYouGo");
        APPROVED.put("com.Steal", "base.common.SleightOfHandTheft");
        APPROVED.put("base.com.ShuffleFeet", "base.common.SuddenDash");
        APPROVED.put("base.com.BeggingMoney", "base.common.GotAnySpareChange");
        APPROVED.put("bruiser.BadEducation", "base.common.ExcuseMeSorryCanYouStop");
        APPROVED.put("com.items.AnotherRottenBeer", "base.items.DiscountDoubleMalt");
        APPROVED.put("com.items.MarvelousCocktail", "base.items.LethalMix");
        APPROVED.put("base.items.SantinoDellaPortinaia", "base.items.SaintBriacoHolyCard");
        APPROVED.put("com.tokens.BrokenBeerBottle", "base.tokens.BrokenBottle");
        // The concrete superclass of DiscountDoubleMalt; a data card in the live set.
        APPROVED.put("com.items.RottenBeer", "base.items.WarmBlonde66");
    }

    @Test
    void theRegistryIsTheApprovedTable() {
        Map<String, String> registered = new LinkedHashMap<>();
        CardClasses.registered().forEach((id, type) -> registered.put(id, type.getName().replace(PKG, "")));
        assertEquals(APPROVED, registered);
    }

    @Test
    void theLiveSetLoadsEveryJavaCardWithItsIdAndClass() throws Exception {
        LiveSet live = new LiveSet();
        TreeSet<String> ids = javaIds(LiveSet.RESOURCE.replace("classpath:", ""));
        assertEquals(19, ids.size());
        TreeSet<String> expected = new TreeSet<>(APPROVED.keySet());
        expected.remove("com.items.RottenBeer");
        expected.remove("com.tokens.BrokenBeerBottle");
        assertEquals(expected, ids, "the live java cards are exactly the registered ones, but the token and the superclass");
        for (String id : ids) check(id, live.set().card(id));
        // The token is not in the set file: the code creates it, and the registry gives its class.
        check("com.tokens.BrokenBeerBottle", uncheckedForId("com.tokens.BrokenBeerBottle").getConstructor().newInstance());
        check("com.items.RottenBeer", uncheckedForId("com.items.RottenBeer").getConstructor().newInstance());
    }

    @Test
    void theHistoricalDraftsLoadEveryJavaCardWithItsIdAndClass() throws Exception {
        int registered = 0, historical = 0;
        for (String resource : new String[]{"/set-base/storico/0.1/attuale.json", "/set-base/storico/1.5/bozza.json"}) {
            Draft draft = BozzeStoriche.fromClasspath(resource);
            for (String id : javaIds(resource)) {
                check(id, draft.card(id));
                if (APPROVED.containsKey(id)) registered++; else historical++;
            }
        }
        assertEquals(8 + 11, registered);
        assertEquals(9, historical);
    }

    private static void check(String id, Object loaded) {
        AbstractCard card = (AbstractCard) loaded;
        assertNotNull(card, id);
        String expected = PKG + APPROVED.getOrDefault(id, id);
        assertEquals(expected, card.getClass().getName(), id);
        assertEquals(id, card.getBindingName(), expected);
        assertEquals(card.getClass(), uncheckedForId(id), id);
    }

    private static Class<?> uncheckedForId(String id) {
        try {
            return CardClasses.forId(id);
        } catch (ClassNotFoundException error) {
            throw new AssertionError(error);
        }
    }

    private static TreeSet<String> javaIds(String resource) throws Exception {
        TreeSet<String> ids = new TreeSet<>();
        try (InputStream input = CardClassesLoadTest.class.getResourceAsStream(resource)) {
            assertNotNull(input, resource);
            for (JsonNode card : JSON.readTree(input).path("cards"))
                if (card.path("java").asBoolean()) ids.add(card.path("binding").asText());
        }
        return ids;
    }
}

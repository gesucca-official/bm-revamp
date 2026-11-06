package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.AbstractItemCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.bruiser.BadEducation;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-11a, stati costruiti a mano: ciò che il set di oggi non copre (equip in entrata, uso singolo senza conversione, durata che scade
 * secondo R05, BadEducation) e l'ordine dei passi attorno a consume. Le carte «prova.*» sono attrezzi di test, non carte del set.
 */
class ConsumeEquipStatesTest {
    private static DataCards fixtures;
    private static SimulationCatalog java;
    private static Draft draft;
    private static String cocktail;

    @BeforeAll static void load() throws Exception {
        fixtures = DataCards.parse(ConsumeEquipFixtures.read(ConsumeEquipFixtures.PROVE));
        java = new SimulationCatalog();
        draft = Draft.parse("attuale con consume", ConsumeEquipFixtures.convertedCurrent());
        cocktail = java.card("com.items.CocktailOnTheGround").getName();
    }

    // ---- equip in entrata: il Giubbotto ----

    /** CUT ricevuto ×0,75 per 3 turni: il turno in cui si consuma e i due successivi (R05, durata 2). */
    @Test void vestCutsTheCutDamageTakenForThreeTurns() {
        Character wearer = fighter(), attacker = fighter();
        wear(wearer, "prova.giubbotto");
        Status vest = wearer.getStatuses().get(0);
        assertTrue(vest.isEquip());
        assertFalse(vest.isSingleUse());
        assertEquals(StatusFlow.INPUT, vest.getFlow());
        assertEquals(2, vest.getLastsForTurns());

        // Turno 1: solo il CUT che si riceve cambia.
        assertEquals(15, dealt(attacker, wearer, Damage.DamageType.CUT, 20));
        assertEquals(20, dealt(attacker, wearer, Damage.DamageType.HIT, 20), "Un altro tipo non cambia");
        assertEquals(20, dealt(attacker, wearer, Damage.DamageType.POISON, 20), "Un altro tipo non cambia");
        assertEquals(20, dealt(wearer, attacker, Damage.DamageType.CUT, 20), "L'equip in entrata non tocca ciò che chi lo porta infligge");
        assertEquals(List.of(), endTurn(wearer));
        // Turno 2 e turno 3: ancora attivo (d=1, d=0).
        assertEquals(15, dealt(attacker, wearer, Damage.DamageType.CUT, 20));
        assertEquals(List.of(), endTurn(wearer));
        assertEquals(15, dealt(attacker, wearer, Damage.DamageType.CUT, 20));
        // A fine del terzo turno scade (R05: scompare solo sotto zero) e il rapporto lo dice.
        assertEquals(List.of("Cleared out of FINTA PELLE status"), endTurn(wearer));
        assertTrue(wearer.getStatuses().isEmpty());
        // Turno 4.
        assertEquals(20, dealt(attacker, wearer, Damage.DamageType.CUT, 20));
    }

    /** Anche i danni che chi lo porta si fa da solo passano dall'equip in entrata (R05: gli autodanni attraversano entrambi i passaggi). */
    @Test void inputEquipAppliesToSelfInflictedDamageToo() {
        Character wearer = fighter();
        wear(wearer, "prova.giubbotto");
        int before = health(wearer);
        wearer.inflictDamage(wearer, new Damage(Damage.DamageType.CUT, 20));
        assertEquals(15, before - health(wearer));
    }

    // ---- equip in uscita: Guanti e Posacenere ----

    /** OUTPUT con durata, senza uso singolo: ×1,25 a ogni HIT inflitto per 3 turni. */
    @Test void glovesRaiseEveryHitDealtForThreeTurns() {
        Character wearer = fighter(), victim = fighter();
        wear(wearer, "prova.guanti");
        for (int turn = 1; turn <= 3; turn++) {
            assertEquals(12, dealt(wearer, victim, Damage.DamageType.HIT, 10), "turno " + turn + ", primo colpo (10 × 1,25 troncato)");
            assertEquals(12, dealt(wearer, victim, Damage.DamageType.HIT, 10), "turno " + turn + ", secondo colpo: non è a uso singolo");
            assertEquals(10, dealt(wearer, victim, Damage.DamageType.CUT, 10), "un altro tipo non cambia");
            assertEquals(10, dealt(victim, wearer, Damage.DamageType.HIT, 10), "i colpi ricevuti non cambiano");
            endTurn(wearer);
        }
        assertEquals(10, dealt(wearer, victim, Damage.DamageType.HIT, 10), "dopo tre turni è scaduto");
    }

    /** Il prossimo HIT inflitto ×1,5, uso singolo, nessuna conversione e nessuna durata: nulla scade finché non lo si usa. */
    @Test void ashtrayRaisesTheNextHitOnceWithoutConvertingIt() {
        Character wearer = fighter(), victim = fighter();
        wear(wearer, "prova.posacenere");
        Status ashtray = wearer.getStatuses().get(0);
        assertTrue(ashtray.isEquip());
        assertTrue(ashtray.isSingleUse());
        assertNull(ashtray.getLastsForTurns(), "Senza durata");
        assertEquals(Damage.DamageType.HIT, ashtray.getTypeFunction().apply(Damage.DamageType.HIT), "Nessuna conversione");
        assertEquals(Damage.DamageType.CUT, ashtray.getTypeFunction().apply(Damage.DamageType.CUT));

        assertEquals(10, dealt(wearer, victim, Damage.DamageType.CUT, 10), "Un altro tipo non lo consuma");
        assertNull(ashtray.getLastsForTurns());
        // Non usato, non scade: dopo cinque fine turno è ancora lì.
        for (int turn = 0; turn < 5; turn++) assertEquals(List.of(), endTurn(wearer));
        assertEquals(1, wearer.getStatuses().size());

        assertEquals(15, dealt(wearer, victim, Damage.DamageType.HIT, 10));
        assertEquals(0, ashtray.getLastsForTurns(), "Uso singolo: durata zero dopo l'uso");
        assertEquals(15, dealt(wearer, victim, Damage.DamageType.HIT, 10), "R05: può applicarsi ancora nello stesso turno");
        assertEquals(List.of("Cleared out of POSACENERE status"), endTurn(wearer));
        assertTrue(wearer.getStatuses().isEmpty());
        assertEquals(10, dealt(wearer, victim, Damage.DamageType.HIT, 10), "Dal turno dopo, niente");
    }

    /** Equip che converte (come il token): il HIT diventa CUT e si applicano gli stati del CUT del bersaglio, non quelli del HIT. */
    @Test void convertedHitMeetsTheTargetsCutStatuses() {
        Character wearer = fighter(), victim = fighter();
        armor(victim, Damage.DamageType.CUT, 0.5f);
        armor(victim, Damage.DamageType.HIT, 0.2f);
        assertEquals(2, dealt(wearer, victim, Damage.DamageType.HIT, 10), "Senza equip vale lo stato sul HIT");
        // L'equip viene da un'azione: prova.coccio.
        ((AbstractCard) fixtures.create("prova.coccio")).applyEffectOnSelf(wearer);
        assertEquals(7, dealt(wearer, victim, Damage.DamageType.HIT, 10), "10 × 1,5 = 15 CUT, poi ×0,5 troncato: 7");
        assertEquals(7, dealt(wearer, victim, Damage.DamageType.HIT, 10), "Uso singolo: ancora nello stesso turno");
        endTurn(wearer);
        assertEquals(2, dealt(wearer, victim, Damage.DamageType.HIT, 10), "Il turno dopo non c'è più");
    }

    // ---- BadEducation ----

    /** BadEducation toglie tutti gli equip del bersaglio, di ogni forma, e solo quelli; poi infligge i suoi 10 HIT. */
    @Test void badEducationRemovesEveryDataEquipAndOnlyEquips() {
        Character victim = fighter(), attacker = fighter();
        wear(victim, "prova.giubbotto");
        wear(victim, "prova.posacenere");
        wear(victim, "prova.guanti");
        ((AbstractCard) fixtures.create("prova.coccio")).applyEffectOnSelf(victim);
        ((AbstractCard) fixtures.create("prova.pelle")).applyEffectOnSelf(victim); // stato non equip
        new BrokenBeerBottle().applyEffectOnSelf(victim);                          // equip del motore
        assertEquals(6, victim.getStatuses().size());

        List<String> report = new BadEducation().applyEffectOnTarget(attacker, victim);
        assertEquals(List.of("Removed FINTA PELLE status!", "Removed POSACENERE status!", "Removed GUANTI DA OFFICINA status!",
                "Removed COCCIO status!", "Removed BROKEN BEER status!"), report.subList(0, 5));
        assertEquals(6, report.size(), "Cinque equip tolti, poi il danno");
        assertEquals(List.of("PELLE DURA"), victim.getStatuses().stream().map(Status::getName).collect(Collectors.toList()));
        assertFalse(victim.getStatuses().get(0).isEquip());
    }

    // ---- gli stati dei dati sono quelli del motore ----

    /**
     * Ogni equip a dati si comporta come lo stesso stato costruito con il builder del motore: stessi campi e stessa sequenza di colpi e
     * di fine turno, con i numeri di R05. Il token a dati contro lo stato di BrokenBeerBottle.newStatus().
     */
    @Test void dataEquipsBehaveLikeEngineStatuses() throws Exception {
        Map<String, Status> engine = new java.util.LinkedHashMap<>();
        engine.put("prova.giubbotto", status("FINTA PELLE", "Cut Damage taken: x0.75", StatusFlow.INPUT, Damage.DamageType.CUT, 0.75f, 2, false, null));
        engine.put("prova.guanti", status("GUANTI DA OFFICINA", "Hit Damage dealt: x1.25", StatusFlow.OUTPUT, Damage.DamageType.HIT, 1.25f, 2, false, null));
        engine.put("prova.posacenere", status("POSACENERE", "Next Hit Damage dealt: x1.5", StatusFlow.OUTPUT, Damage.DamageType.HIT, 1.5f, null, true, null));
        engine.put("prova.coccio", status("COCCIO", "Hit Damage dealt x1.5 and turned to Cut Damage", StatusFlow.OUTPUT, Damage.DamageType.HIT, 1.5f, null, true, Damage.DamageType.CUT));
        engine.put(ConsumeEquipFixtures.TOKEN, BrokenBeerBottle.newStatus());
        DataCards all = DataCards.parse(ConsumeEquipFixtures.read(ConsumeEquipFixtures.CARDS));
        for (Map.Entry<String, Status> entry : engine.entrySet()) {
            Character viaData = fighter(), viaEngine = fighter();
            Card card = entry.getKey().equals(ConsumeEquipFixtures.TOKEN) ? all.create(entry.getKey()) : fixtures.create(entry.getKey());
            ((AbstractCard) card).applyEffectOnSelf(viaData);
            viaEngine.getStatuses().add(entry.getValue());
            assertEquals(describe(viaEngine.getStatuses().get(0)), describe(viaData.getStatuses().get(0)), entry.getKey());
            assertEquals(script(viaEngine), script(viaData), entry.getKey());
        }
    }

    // ---- consume con altri passi ----

    /** «−5 A a sé, poi consuma» (Mara), «consuma, poi +3 HEALTH» (Rocco) e un passo prima e uno dopo: l'ordine è quello scritto. */
    @Test void stepsAroundConsumeRunInTheWrittenOrder() throws Exception {
        List<String> mara = play("prova.basicMara", true);
        assertEquals("ALERTNESS: 20->15 (-5)", mara.get(0));
        assertEquals("Grabbed and consumed Item " + cocktail, mara.get(1));
        assertTrue(mara.size() > 2 && mara.get(2).startsWith("VIOLENCE: "), mara.toString());

        List<String> rocco = play("prova.basicRocco", true);
        assertEquals("Grabbed and consumed Item " + cocktail, rocco.get(0));
        assertEquals("HEALTH: 100->103 (3)", rocco.get(rocco.size() - 1));

        List<String> between = play("prova.basicTraDue", true);
        assertEquals("ALERTNESS: 20->18 (-2)", between.get(0));
        assertEquals("Grabbed and consumed Item " + cocktail, between.get(1));
        assertTrue(between.get(between.size() - 1).startsWith("VIOLENCE: "), between.toString());
    }

    /** L'oggetto sparito prima della risoluzione: i passi prima e dopo valgono ancora, con la riga di Grab. */
    @Test void stepsAroundConsumeStillRunWhenTheItemVanished() throws Exception {
        assertEquals(List.of("ALERTNESS: 20->15 (-5)", "Couldn't Grab that Item!"), play("prova.basicMara", false));
        assertEquals(List.of("Couldn't Grab that Item!", "HEALTH: 100->103 (3)"), play("prova.basicRocco", false));
        assertEquals(List.of("ALERTNESS: 20->18 (-2)", "Couldn't Grab that Item!", "VIOLENCE: 25->29 (4)"), play("prova.basicTraDue", false));
    }

    /** La carta resta in mano fra un turno e l'altro: la risoluzione dopo un oggetto preso non ricorda quell'oggetto. */
    @Test void aReusedCardDoesNotRememberTheLastItem() throws Exception {
        Card card = named("prova.basicRocco");
        Game game = game();
        Player self = game.getPlayers().get("seat-1");
        self.getCharacter().getItems().add(java.card("com.items.CocktailOnTheGround"));
        List<String> first = resolve(card, game, cocktail);
        assertEquals("Grabbed and consumed Item " + cocktail, first.get(0));
        assertTrue(self.getCharacter().getItems().isEmpty(), "L'oggetto esce dal campo");
        List<String> second = resolve(card, game, cocktail);
        assertEquals(List.of("Couldn't Grab that Item!", "HEALTH: 103->106 (3)"), second);
    }

    // ---- serializzazione ----

    /** Gli stati dei passi nuovi e una carta con un oggetto consumato sopravvivono alla serializzazione, e dopo si comportano allo stesso modo. */
    @Test void newStatusesAndConsumedStateSurviveSerialization() throws Exception {
        Character wearer = fighter(), attacker = fighter();
        wear(wearer, "prova.giubbotto");
        wear(wearer, "prova.posacenere");
        ((AbstractCard) fixtures.create("prova.coccio")).applyEffectOnSelf(wearer);
        Card card = named("prova.basicRocco");
        Game game = game();
        game.getPlayers().get("seat-1").getCharacter().getItems().add(java.card("com.items.CocktailOnTheGround"));
        resolve(card, game, cocktail);

        Object[] copy = (Object[]) roundTrip(new Object[] {wearer, card});
        Character copied = (Character) copy[0];
        assertEquals(script(wearer), script(copied));
        assertEquals(List.of("Couldn't Grab that Item!", "HEALTH: 103->106 (3)"), resolve((Card) copy[1], game, cocktail));
    }

    // ---- strumenti ----

    private static Character fighter() {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 1000);
        resources.put(Resource.ALERTNESS, 20);
        resources.put(Resource.VIOLENCE, 25);
        return new Draft.DraftCharacter("prova", resources, 2, Set.of());
    }

    private static int health(Character character) { return character.getResources().get(Resource.HEALTH); }

    /** La salute persa dal bersaglio. */
    private static int dealt(Character from, Character to, Damage.DamageType type, int amount) {
        int before = health(to);
        from.inflictDamage(to, new Damage(type, amount));
        return before - health(to);
    }

    private static List<String> endTurn(Character character) { return character.resolveTimeBasedEffects(); }

    private static void wear(Character character, String binding) {
        ((AbstractItemCard) fixtures.create(binding)).applyEffectOnSelf(character);
    }

    private static void armor(Character character, Damage.DamageType type, float factor) {
        character.getStatuses().add(Status.builder().name("armatura " + type).description("").type(StatusType.GOOD).flow(StatusFlow.INPUT)
                .impactedProperty(type).amountFunction((StatusAmountFunction) n -> n * factor).build());
    }

    private static Status status(String name, String description, StatusFlow flow, Damage.DamageType property, float factor, Integer turns,
                                 boolean singleUse, Damage.DamageType convertTo) {
        Status.StatusBuilder builder = Status.builder().name(name).description(description).type(StatusType.GOOD).flow(flow)
                .impactedProperty(property).amountFunction((StatusAmountFunction) n -> n * factor).equip(true).singleUse(singleUse)
                .lastsForTurns(turns);
        if (convertTo != null)
            builder.typeFunction((com.gsc.bm.model.game.status.StatusAmountTypeFunction) type -> type == property ? convertTo : type);
        return builder.build();
    }

    private static String describe(Status status) {
        return status.getName() + "," + status.getDescription() + "," + status.getType() + "," + status.getFlow() + ","
                + status.getImpactedProperty() + "," + status.isSingleUse() + "," + status.isEquip() + "," + status.getLastsForTurns()
                + "," + status.getAmountFunction().apply(100f) + "," + status.getTypeFunction().apply(Damage.DamageType.HIT);
    }

    /** Cinque turni di colpi di ogni tipo, in entrambe le direzioni, e fine turno: la sequenza delle perdite e dei rapporti. */
    private static String script(Character wearer) {
        Character other = fighter();
        StringBuilder out = new StringBuilder();
        for (int turn = 1; turn <= 5; turn++) {
            for (Damage.DamageType type : Damage.DamageType.values()) {
                out.append(dealt(other, wearer, type, 20)).append(',').append(dealt(wearer, other, type, 20)).append(',')
                        .append(dealt(wearer, other, type, 20)).append(';');
            }
            out.append(endTurn(wearer)).append('|');
        }
        return out.toString();
    }

    /** Una carta di prova con un nome, che la mano e la mossa richiedono. */
    private static Card named(String binding) {
        LoadableCard card = fixtures.create(binding);
        card.setGuiName(binding);
        return card;
    }

    private static Game game() throws Exception {
        Player a = draft.player("starter-bruiser", "seat-1", new Random(1), null);
        Player b = draft.player("starter-junkie", "seat-2", new Random(2), null);
        return new Game(List.of(a, b), "sim", false);
    }

    /** Gioca una carta di prova che consuma il Cocktail, presente sul campo oppure sparito prima della risoluzione. */
    private static List<String> play(String binding, boolean present) throws Exception {
        Card card = named(binding);
        Game game = game();
        Character self = game.getPlayers().get("seat-1").getCharacter();
        Card item = java.card("com.items.CocktailOnTheGround");
        self.getItems().add(item);
        Move move = move(card, game, item.getName());
        if (!present) self.getItems().remove(item);
        return card.resolve(game, move).get(Card.CardTarget.SELF);
    }

    private static List<String> resolve(Card card, Game game, String itemName) {
        return card.resolve(game, move(card, game, itemName)).get(Card.CardTarget.SELF);
    }

    private static Move move(Card card, Game game, String itemName) {
        Map<Move.AdditionalAction, String> choices = new HashMap<>();
        choices.put(Move.AdditionalAction.TARGET_ITEM, itemName);
        game.getPlayers().get("seat-1").getCardsInHand().add(card);
        return new Move(card.getName(), "seat-1", "SELF", game.getGameId(), choices);
    }

    private static Object roundTrip(Object value) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(value); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) { return in.readObject(); }
    }
}

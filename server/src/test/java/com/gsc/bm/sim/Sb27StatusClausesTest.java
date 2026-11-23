package com.gsc.bm.sim;

import com.gsc.bm.model.Damage.DamageType;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static com.gsc.bm.model.Damage.DamageType.*;
import static com.gsc.bm.model.Resource.VIOLENCE;
import static com.gsc.bm.model.cards.Card.CardTarget.SELF;
import static com.gsc.bm.model.game.status.StatusFlow.INPUT;
import static com.gsc.bm.model.game.status.StatusFlow.OUTPUT;
import static com.gsc.bm.model.game.status.StatusType.BAD;
import static com.gsc.bm.model.game.status.StatusType.GOOD;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Stato effettivo durante R04 e durata separata di due applicazioni della stessa carta (R05). */
class Sb27StatusClausesTest {
    private static final String PROBE = "Osserva stato";
    private static final String ATTACK = "HIT di prova";

    enum Play { SELF, BOUND, OPPONENT, CONSUME }

    static final class Modifier {
        final DamageType input;
        final DamageType output;
        final int fromTwenty;

        Modifier(DamageType input, DamageType output, int fromTwenty) {
            this.input = input;
            this.output = output;
            this.fromTwenty = fromTwenty;
        }
    }

    static final class Sheet {
        final String slot;
        final String binding;
        final String name;
        final Play play;
        final StatusType type;
        final StatusFlow flow;
        final Integer turns;
        final boolean equip;
        final List<Modifier> modifiers;

        Sheet(String slot, String binding, String name, Play play, StatusType type, StatusFlow flow, Integer turns,
              boolean equip, Modifier... modifiers) {
            this.slot = slot;
            this.binding = binding;
            this.name = name;
            this.play = play;
            this.type = type;
            this.flow = flow;
            this.turns = turns;
            this.equip = equip;
            this.modifiers = List.of(modifiers);
        }

        @Override public String toString() { return slot; }
    }

    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    private static Modifier damage(DamageType type, int amount) { return new Modifier(type, type, amount); }

    private static Sheet guard(String slot, String binding, String name, Play play, Integer turns, boolean equip,
                               Modifier... modifiers) {
        return new Sheet(slot, binding, name, play, GOOD, INPUT, turns, equip, modifiers);
    }

    private static Sheet threeQuarters(String slot, String binding, String name) {
        return guard(slot, binding, name, Play.BOUND, 0, false, damage(HIT, 15), damage(CUT, 15), damage(POISON, 15));
    }

    static Stream<Sheet> sheets() {
        return Stream.of(
                threeQuarters("SPA-BO1", "bruiser.character.LittleRage", "LIEVE FASTIDIO"),
                guard("SPA-AR4", "bruiser.MadeOfStone", "NON GIOCARE COL COLTELLO NO", Play.SELF, 3, false, damage(CUT, 10)),
                threeQuarters("MAR-BO2", "base.mara.bound.CambioMarcia", "Semaforo Rosso"),
                new Sheet("MAR-AR2", "base.mara.Sgommata", "Sgommata", Play.OPPONENT, BAD, OUTPUT, 0, false,
                        damage(HIT, 15), damage(CUT, 15), damage(POISON, 15)),
                guard("MAR-AR4", "base.mara.TraDueParaurti", "Unta e Bisunta", Play.SELF, 0, false, damage(HIT, 10), damage(CUT, 10)),
                threeQuarters("TOS-BO2", "base.tossico.bound.RaschiareIlFondo", "Rintanarsi nel Cappotto"),
                threeQuarters("PIN-BO1", "base.pino.bound.CinqueMinutiEVado", "Posto Fisso"),
                guard("PIN-AR3", "base.pino.IlBanconeRegge", "Avamposto Fortificato al Bancone", Play.SELF, 0, false,
                        damage(HIT, 15), damage(POISON, 10)),
                threeQuarters("GIG-BO1", "base.gigi.bound.UnaStrettaEPassa", "Cuffie e Testa Bassa"),
                new Sheet("GIG-BO3", "base.gigi.bound.Lima", "Affilare gli Utensili", Play.BOUND, GOOD, OUTPUT, 1, true, new Modifier(HIT, CUT, 15)),
                guard("GIG-AR4", "base.gigi.SottoIlCofano", "Secondo Bagagliaio", Play.SELF, 0, false, damage(HIT, 10), damage(CUT, 15)),
                threeQuarters("CES-BO3", "base.cesira.bound.FareIlVago", "Fare il Vago"),
                threeQuarters("ROC-BO3", "base.rocco.bound.AlzoLaVoce", "(Dis)onore alla Bandiera"),
                guard("ROC-AR2", "base.rocco.Incassare", "Stoico come un Busto di Bronzo", Play.SELF, 0, false, damage(HIT, 10)),
                guard("ROC-AR3", "base.rocco.EAllora", "E Allora...?", Play.OPPONENT, 0, false, damage(HIT, 10)),
                guard("GEN-11", "bruiser.CantFeelAnything", "GENTILE IL TUO CAREZZO", Play.SELF, 0, false, damage(HIT, 5)),
                guard("GEN-13", "base.com.TartarugaSulMarciapiede", "Tecnica del Carapace Mentale", Play.SELF, 0, false,
                        damage(HIT, 10), damage(CUT, 10)),
                new Sheet("GEN-20", "base.com.SecondoFiato", "Riprendere Fiato", Play.SELF, BAD, INPUT, 1, false,
                        damage(HIT, 25), damage(CUT, 25)),
                new Sheet("GEN-21", "base.com.CoccioDiBottiglia", "Coccio di Bottiglia", Play.SELF, GOOD, OUTPUT, null, true,
                        new Modifier(HIT, CUT, 30)),
                new Sheet("OGG-09", "base.items.GuantiDaOfficina", "Guanti da Officina", Play.CONSUME, GOOD, OUTPUT, 2, true, damage(HIT, 25)),
                guard("OGG-10", "base.items.GiubbottoDiFintaPelle", "Giubbotto di Finta Pelle", Play.CONSUME, 2, true, damage(CUT, 15)),
                guard("OGG-11", "base.items.CascoDaLavoro", "Casco da Cantiere", Play.CONSUME, 2, true, damage(HIT, 15)),
                new Sheet("OGG-13", "base.items.PosacenereDiVetro", "Posacenere di Vetro", Play.CONSUME, GOOD, OUTPUT, null, true, damage(HIT, 30)));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void appliesOnlyTheNamedStatusesAndASecondApplicationHasItsOwnDuration(Sheet sheet) {
        Card original = card(sheet.binding);
        Probe firstProbe = new Probe(sheet);
        Probe secondProbe = new Probe(sheet);
        Game first = applyInGame(sheet, original, firstProbe);
        Game second = applyInGame(sheet, original, secondProbe);
        assertEquals(sheet.modifiers.size(), firstProbe.active.size());
        assertEquals(sheet.modifiers.size(), secondProbe.active.size());
        for (int i = 0; i < firstProbe.active.size(); i++) {
            assertNotSame(firstProbe.active.get(i), secondProbe.active.get(i));
        }

        if (sheet.turns == null) {
            turn(first, rest(first, "s"), rest(first, "b"), rest(first, "c"));
            assertEquals(1, ch(first, subject(sheet)).getStatuses().size(), "senza HIT dura ancora");
            turn(first, move(first, "s", ATTACK, "b"), rest(first, "b"), rest(first, "c"));
            assertTrue(ch(first, subject(sheet)).getStatuses().isEmpty());
            assertEquals(1, ch(second, subject(sheet)).getStatuses().size());
        } else {
            for (int left = sheet.turns; left > 0; left--) {
                assertEquals(sheet.modifiers.size(), ch(first, subject(sheet)).getStatuses().size());
                turn(first, rest(first, "s"), rest(first, "b"), rest(first, "c"));
            }
            assertTrue(ch(first, subject(sheet)).getStatuses().isEmpty());
            if (sheet.turns > 0) {
                assertEquals(sheet.modifiers.size(), ch(second, subject(sheet)).getStatuses().size());
                assertTrue(ch(second, subject(sheet)).getStatuses().stream().allMatch(status -> status.getLastsForTurns() == sheet.turns - 1));
            }
        }
    }

    private static String subject(Sheet sheet) { return sheet.binding.equals("base.mara.Sgommata") ? "b" : "s"; }

    private static Game applyInGame(Sheet sheet, Card original, Probe probe) {
        Player actor = s(sheet.play == Play.CONSUME ? consume() : original, hit(ATTACK, 0, null, "HIT 7"));
        actor.getCharacter().getResources().put(VIOLENCE, 25);
        if (sheet.play == Play.CONSUME) actor.getCharacter().getItems().add(original);
        Game game = game(actor, b(), c(probe));
        Move play;
        switch (sheet.play) {
            case BOUND: play = bound(game, "s", sheet.name, "SELF"); break;
            case OPPONENT: play = move(game, "s", sheet.name, "b"); break;
            case CONSUME: play = onItem(game, "s", "Consuma", "s", sheet.name); break;
            default: play = move(game, "s", sheet.name, "SELF");
        }
        turn(game, play, rest(game, "b"), move(game, "c", PROBE, "SELF"));
        return game;
    }

    private static final class Probe extends AbstractCard {
        private final Sheet sheet;
        List<Status> active = List.of();

        Probe(Sheet sheet) {
            this.sheet = sheet;
            setGuiName(PROBE);
            setCanTarget(Set.of(SELF));
            setCost(Map.of());
            setPriority(-5);
        }

        @Override public void applyOtherUnfathomableLogic(Game game, Move move) {
            active = List.copyOf(ch(game, subject(sheet)).getStatuses());
            assertTrue(ch(game, subject(sheet).equals("s") ? "b" : "s").getStatuses().isEmpty());
            assertEquals(sheet.modifiers.size(), active.size());
            for (Modifier expected : sheet.modifiers) {
                Status status = active.stream().filter(candidate -> candidate.getImpactedProperty() == expected.input)
                        .findFirst().orElseThrow(() -> new AssertionError("Stato mancante per " + expected.input));
                assertEquals(sheet.name, status.getName());
                assertEquals(sheet.type, status.getType());
                assertEquals(sheet.flow, status.getFlow());
                assertEquals(sheet.turns, status.getLastsForTurns());
                assertEquals(sheet.equip, status.isEquip());
                assertEquals(sheet.turns == null, status.isSingleUse());
                assertEquals(expected.input, status.getImpactedProperty());
                assertEquals(expected.output, status.getTypeFunction().apply(expected.input));
                assertEquals((float) expected.fromTwenty, status.getAmountFunction().apply(20f));
            }
        }

        @Override public List<String> applyEffectOnSelf(com.gsc.bm.model.Character self) { return null; }
        @Override public List<String> applyEffectOnTarget(com.gsc.bm.model.Character self, com.gsc.bm.model.Character target) { return null; }
    }
}

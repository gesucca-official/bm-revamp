package com.gsc.bm.sim;

import com.gsc.bm.model.Damage.DamageType;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.status.Status;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static com.gsc.bm.model.Damage.DamageType.*;
import static com.gsc.bm.model.game.status.StatusFlow.INPUT;
import static com.gsc.bm.model.game.status.StatusType.GOOD;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.params.provider.Arguments.arguments;

/** Metà per difetto del danno fisso dichiarato in ciascuna scheda. */
class Sb27FixedDamageTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    static Stream<Arguments> printedDamage() {
        return Stream.of(
                arguments("SPA-BO2", "bruiser.character.LittleSmack", HIT, 1),
                arguments("SPA-AR1", "bruiser.SuperImpact", HIT, 17),
                arguments("SPA-AR2", "bruiser.ExtremelyViolentBlow", HIT, 3),
                arguments("MAR-BO1", "base.mara.bound.PassoStretto", CUT, 1),
                arguments("MAR-AR1", "base.mara.CinghiataDiTraverso", CUT, 10),
                arguments("MAR-AR2", "base.mara.Sgommata", CUT, 12),
                arguments("MAR-AR3", "base.mara.SorpassoInCurva", CUT, 2),
                arguments("TOS-BO1", "junkie.character.PatheticBlade", CUT, 1),
                arguments("LR-TOS", "junkie.LethalHeroinDose", POISON, 4),
                arguments("TOS-AR2", "junkie.Cough", POISON, 10),
                arguments("TOS-AR5", "junkie.ToxicBloodDrain", POISON, 5),
                arguments("PIN-BO2", "base.pino.bound.SpallataAlBancone", HIT, 1),
                arguments("LR-PIN", "base.pino.UltimoGiro", HIT, 5),
                arguments("PIN-AR1", "base.pino.TestataDaUltimoGiro", HIT, 17),
                arguments("PIN-AR2", "base.pino.GoingBerserk", HIT, 5),
                arguments("PIN-AR5", "base.pino.RuttoADistanzaSociale", HIT, 7),
                arguments("GIG-BO2", "base.gigi.bound.ColpoDiCacciavite", HIT, 1),
                arguments("GIG-AR2", "base.gigi.ChiaveDaTredici", CUT, 10),
                arguments("GIG-AR3", "base.gigi.ColpoDiChiaveInglese", CUT, 2),
                arguments("GIG-AR5", "base.gigi.LavoroFattoBene", HIT, 7),
                arguments("GIG-AR6", "base.gigi.UnaStrettaDiProva", CUT, 2),
                arguments("CES-BO2", "base.cesira.bound.Battutina", HIT, 1),
                arguments("CES-AR1", "base.cesira.OhGuardaLa", HIT, 2),
                arguments("CES-AR4", "base.cesira.ContoSalato", HIT, 4),
                arguments("CES-AR5", "base.cesira.LoSannoTutti", HIT, 12),
                arguments("CES-AR6", "base.cesira.Malelingue", HIT, 2),
                arguments("ROC-BO1", "base.rocco.bound.Colpetto", HIT, 1),
                arguments("LR-ROC", "base.rocco.NeHoPreseDiPeggio", HIT, 5),
                arguments("ROC-AR1", "base.rocco.NoccheSbucciate", HIT, 10),
                arguments("ROC-AR3", "base.rocco.EAllora", HIT, 4),
                arguments("ROC-AR4", "base.rocco.Capocciata", HIT, 12),
                arguments("ROC-AR5", "base.rocco.TeLoSpiegoIo", HIT, 2),
                arguments("ROC-AR6", "base.rocco.TestaDura", HIT, 15),
                arguments("GEN-05", "bruiser.SeagullFly", HIT, 10),
                arguments("GEN-06", "base.com.MattoneDelCantiere", HIT, 12),
                arguments("GEN-07", "bruiser.HealingBlow", HIT, 15),
                arguments("GEN-08", "bruiser.SickeningBlow", HIT, 5),
                arguments("GEN-09", "bruiser.StunningBlow", HIT, 5),
                arguments("GEN-10", "bruiser.BadEducation", HIT, 4),
                arguments("GEN-12", "base.com.RincorsaDalMarciapiede", HIT, 5),
                arguments("GEN-17", "base.com.SputoDaPosacenere", POISON, 5),
                arguments("GEN-18", "base.com.Spintone", HIT, 4),
                arguments("GEN-22", "base.com.AcquaInFaccia", HIT, 2),
                arguments("GEN-23", "base.com.Sgambetto", HIT, 2),
                arguments("GEN-24", "base.com.EstasiDaCocaEtilene", HIT, 20),
                arguments("LR-STR", "com.last.Struggle", HIT, 5));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("printedDamage")
    void ricattoReturnsThePrintedFixedPart(String slot, String binding, DamageType type, int half) {
        Card attack = card(binding);
        Card ricatto = card("base.cesira.Ricatto");
        var attacker = character("b", 60, 3);
        // Le risorse non iniziali coprono esattamente il costo e si esauriscono prima di Ricatto.
        for (Resource resource : List.of(Resource.VIOLENCE, Resource.TOXICITY, Resource.ALCOHOL)) {
            attacker.getResources().put(resource, attack.getCost().getOrDefault(resource, 0));
        }
        Map<DamageType, Integer> received = new EnumMap<>(DamageType.class);
        for (DamageType watched : DamageType.values()) {
            attacker.getStatuses().add(Status.builder().name("Misura " + watched).type(GOOD).flow(INPUT)
                    .impactedProperty(watched).amountFunction(amount -> {
                        received.merge(watched, amount.intValue(), Integer::sum);
                        return amount;
                    }).build());
        }
        Player b = attack.isLastResort()
                ? player(attacker, List.of(), fillers(10), attack)
                : player(attacker, List.of(attack), fillers(10), null);
        Game game = game(player("s", 90, ricatto), b);
        Move target = attack.isCharacterBound()
                ? bound(game, "b", attack.getName(), "s")
                : move(game, "b", attack.getName(), "s");

        turn(game, move(game, "s", ricatto.getName(), "b"), target);

        assertTrue(voided(game, "b"));
        assertEquals(Map.of(type, half), received);
    }
}

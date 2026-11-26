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
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Metà per difetto del danno fisso dichiarato in ciascuna scheda. */
class Sb27FixedDamageTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    static Stream<Arguments> printedDamage() {
        return Stream.of(
                arguments("SPA-BO2", WAKE_UP_BUT_NOT_YOU, HIT, 1),
                arguments("SPA-AR1", GARGANTUAN_IMPACT_ON_YOU, HIT, 17),
                arguments("SPA-AR2", SHIP_YOU_TO_OUCHIO, HIT, 3),
                arguments("MAR-BO1", FOIL_THE_ASSASSINATION, CUT, 1),
                arguments("MAR-AR1", RIDERS_LASSO, CUT, 10),
                arguments("MAR-AR2", BURNOUT, CUT, 12),
                arguments("MAR-AR3", UNNATURAL_AGILITY, CUT, 2),
                arguments("TOS-BO1", ASHTRAY_BOTTOM, CUT, 1),
                arguments("LR-TOS", THE_LAST_DRAG, POISON, 4),
                arguments("TOS-AR2", PHLEGMY_COUGH, POISON, 10),
                arguments("TOS-AR5", DRAG_INTO_THE_TUNNEL, POISON, 5),
                arguments("PIN-BO2", VIOLENT_SELTZER_SPRAY, HIT, 1),
                arguments("LR-PIN", LAST_ROUND, HIT, 5),
                arguments("PIN-AR1", LAST_ROUND_CRASH, HIT, 17),
                arguments("PIN-AR2", DOWN_IN_ONE, HIT, 5),
                arguments("PIN-AR5", POINT_BLANK_BURP, HIT, 7),
                arguments("GIG-BO2", SCREWDRIVER_HIT, HIT, 1),
                arguments("GIG-AR2", THIRTEEN_WRENCH, CUT, 10),
                arguments("GIG-AR3", PREPARE_THE_JOB, CUT, 2),
                arguments("GIG-AR5", JOB_WELL_DONE, HIT, 7),
                arguments("GIG-AR6", EMPIRICAL_METHOD, CUT, 2),
                arguments("CES-BO2", MANIPULATIVE_TECHNIQUE, HIT, 1),
                arguments("CES-AR1", TIMELY_DISTRACTION, HIT, 2),
                arguments("CES-AR4", STEEP_BILL, HIT, 4),
                arguments("CES-AR5", OPEN_SECRET, HIT, 12),
                arguments("CES-AR6", PRANK_TOO_FAR, HIT, 2),
                arguments("ROC-BO1", ARROGANT_REFRESH, HIT, 1),
                arguments("LR-ROC", YOU_DID_NOTHING_TO_ME, HIT, 5),
                arguments("ROC-AR1", SKINNED_KNUCKLES, HIT, 10),
                arguments("ROC-AR3", SO_WHAT, HIT, 4),
                arguments("ROC-AR4", PATRIOTIC_HEADBUTT, HIT, 12),
                arguments("ROC-AR5", HISTORY_IS_WRITTEN_BY_THE_VICTORS, HIT, 2),
                arguments("ROC-AR6", HARDHEAD, HIT, 15),
                arguments("GEN-05", SEAGULL_SO_LET_US_FLY_YOU, HIT, 10),
                arguments("GEN-06", BIG_HOLLOW_BRICK_28, HIT, 12),
                arguments("GEN-07", NOW_LET_US_HEAL_YOU, HIT, 15),
                arguments("GEN-08", CHARM_YOU_WITH_BLOWS, HIT, 5),
                arguments("GEN-09", STUN_YOU_I_SAID, HIT, 5),
                arguments("GEN-10", EXCUSE_ME_SORRY_CAN_YOU_STOP, HIT, 4),
                arguments("GEN-12", EXTREME_HURRY_TO_GET_DRUNK, HIT, 5),
                arguments("GEN-17", SPIT_IN_THE_ASHTRAY, POISON, 5),
                arguments("GEN-18", SHOVE, HIT, 4),
                arguments("GEN-22", WAKE_UUUP, HIT, 2),
                arguments("GEN-23", TRIP, HIT, 2),
                arguments("GEN-24", COCAETHYLENE_ECSTASY, HIT, 20),
                arguments("LR-STR", AT_HIM, HIT, 5));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("printedDamage")
    void ricattoReturnsThePrintedFixedPart(String slot, String binding, DamageType type, int half) {
        Card attack = card(binding);
        Card ricatto = card(GOOD_OLD_BLACKMAIL);
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

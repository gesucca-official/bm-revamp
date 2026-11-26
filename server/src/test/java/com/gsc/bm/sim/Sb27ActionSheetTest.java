package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.Card.CardTarget;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.model.cards.Card.CardTarget.*;
import static com.gsc.bm.sim.Sb27ActionSheetTest.Kind.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Intestazione e bersaglio trascritti dalle 99 schede delle azioni del candidato. */
class Sb27ActionSheetTest {
    enum Kind { REGULAR, BASIC, BOUND, LAST_RESORT }

    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    // GEN-04: SB-28 (D181 (3)) toglie il costo «A 0», che non si scrive più: la carta resta gratuita.
    static Stream<Arguments> actions() {
        return Stream.of(
                arguments("SPA-BA", LET_US_USE_YOU, "ADOPERIAMOTI", BASIC, NEAR_ITEM, -1, Map.of()),
                arguments("SPA-BO1", SLIGHT_ANNOYANCE, "LIEVE FASTIDIO", BOUND, SELF, 2, Map.of()),
                arguments("SPA-BO2", WAKE_UP_BUT_NOT_YOU, "SVEGLIAMOCI - MA TU NO", BOUND, OPPONENT, 1, Map.of()),
                arguments("SPA-BO3", VIOLENTIZATION, "VIOLENZAZIONE", BOUND, SELF, 0, Map.of()),
                arguments("SPA-AR1", GARGANTUAN_IMPACT_ON_YOU, "GARGANTUESCO IMPATTO SUL TU", REGULAR, OPPONENT, 0, Map.of(VIOLENCE, 25)),
                arguments("SPA-AR2", SHIP_YOU_TO_OUCHIO, "SPEDIAMOTI DUNQUE IN O-AHIO", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("SPA-AR3", PATIENCE_OVER, "PAZIENZA: FINITA", REGULAR, SELF, 0, Map.of()),
                arguments("SPA-AR4", DONT_PLAY_WITH_THE_KNIFE, "NON GIOCARE COL COLTELLO NO", REGULAR, SELF, 0, Map.of()),
                arguments("SPA-AR5", THATS_ENOUGH, "FAI BASTA", REGULAR, OPPONENT, 2, Map.of(VIOLENCE, 5)),
                arguments("SPA-AR6", LET_US_CLEAR_YOU_OUT, "SGOMBERIAMOVI", REGULAR, SELF, 0, Map.of()),
                arguments("MAR-BA", REQUISITION_ON_THE_FLY, "Requisire al Volo", BASIC, NEAR_ITEM, 2, Map.of()),
                arguments("MAR-BO1", FOIL_THE_ASSASSINATION, "Sventare l'Assassinio", BOUND, OPPONENT, 1, Map.of()),
                arguments("MAR-BO2", RED_LIGHT, "Semaforo Rosso", BOUND, SELF, 2, Map.of()),
                arguments("MAR-BO3", CUT_OFF, "Tagliare la Strada", BOUND, OPPONENT, 2, Map.of()),
                arguments("MAR-AR1", RIDERS_LASSO, "Lazo del Rider", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 20)),
                arguments("MAR-AR2", BURNOUT, "Sgommata", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 15)),
                arguments("MAR-AR3", UNNATURAL_AGILITY, "Agilità Innaturale", REGULAR, OPPONENT, 2, Map.of()),
                arguments("MAR-AR4", GREASY_AND_GRIMY, "Unta e Bisunta", REGULAR, SELF, 2, Map.of(ALERTNESS, 5)),
                arguments("MAR-AR5", APPROACH_SLALOM, "Slalom d'Avvicinamento", REGULAR, SELF, 2, Map.of()),
                arguments("MAR-AR6", UNPREDICTABLE_TRAJECTORY, "Traiettoria Imprevedibile", REGULAR, SELF, 2, Map.of()),
                arguments("TOS-BA", UNCONTROLLABLE_CRAVING, "Desiderio Incontrollabile", BASIC, NEAR_ITEM, 1, Map.of()),
                arguments("TOS-BO1", ASHTRAY_BOTTOM, "Fondo del Posacenere", BOUND, OPPONENT, 1, Map.of()),
                arguments("TOS-BO2", BURROW_INTO_THE_COAT, "Rintanarsi nel Cappotto", BOUND, SELF, 2, Map.of()),
                arguments("TOS-BO3", CUT_THE_DOSE, "Tagliare la Dose", BOUND, SELF, 0, Map.of()),
                arguments("LR-TOS", THE_LAST_DRAG, "L'Ultimo Tiro", LAST_RESORT, OPPONENT, 1, Map.of()),
                arguments("TOS-AR1", TAKE_INVENTORY, "Fare l'Inventario", REGULAR, SELF, 1, Map.of()),
                arguments("TOS-AR2", PHLEGMY_COUGH, "Tossicone Scatarrante", REGULAR, OPPONENT, 1, Map.of(TOXICITY, 10)),
                arguments("TOS-AR3", CORRUPTED_METABOLISM, "Metabolismo Corrotto", REGULAR, SELF, 1, Map.of()),
                arguments("TOS-AR4", SPEED_BOOSTED_REFLEXES, "Riflessi Aumentati dalla Speed", REGULAR, SELF, 2, Map.of(TOXICITY, 10)),
                arguments("TOS-AR5", DRAG_INTO_THE_TUNNEL, "Trascinare nel Tunnel", REGULAR, OPPONENT, 1, Map.of(TOXICITY, 10)),
                arguments("TOS-AR6", JUST_A_TASTE, "Un Assaggino", REGULAR, SELF, 1, Map.of()),
                arguments("PIN-BA", TO_THE_LAST_DROP, "Fino all'Ultima Goccia", BASIC, NEAR_ITEM, 0, Map.of()),
                arguments("PIN-BO1", REGULAR_SPOT, "Posto Fisso", BOUND, SELF, 2, Map.of()),
                arguments("PIN-BO2", VIOLENT_SELTZER_SPRAY, "Violenta Spruzzata di Seltz", BOUND, OPPONENT, 1, Map.of()),
                arguments("PIN-BO3", CLEAR_THE_HEAD, "Schiarirsi le Idee", BOUND, SELF, 0, Map.of()),
                arguments("LR-PIN", LAST_ROUND, "Ultimo Giro", LAST_RESORT, OPPONENT, 1, Map.of()),
                arguments("PIN-AR1", LAST_ROUND_CRASH, "Scompenso da Ultimo Giro", REGULAR, OPPONENT, 1, Map.of(ALCOHOL, 5)),
                arguments("PIN-AR2", DOWN_IN_ONE, "Alla Goccia", REGULAR, OPPONENT, 1, Map.of()),
                arguments("PIN-AR3", FORTIFIED_BAR_OUTPOST, "Avamposto Fortificato al Bancone", REGULAR, SELF, 2, Map.of()),
                arguments("PIN-AR4", ONE_MORE_AND_IM_COMING, "Un Altro e Arrivo", REGULAR, SELF, 1, Map.of()),
                arguments("PIN-AR5", POINT_BLANK_BURP, "Rutto a Bruciapelo", REGULAR, OPPONENT, 1, Map.of(ALCOHOL, 5)),
                arguments("PIN-AR6", ANOTHER_LITTLE_GRAPPA, "Un Altro... Grappino...", REGULAR, SELF, 1, Map.of()),
                arguments("GIG-BA", THIS_COMES_IN_HANDY, "Questo Torna Utile", BASIC, NEAR_ITEM, 0, Map.of()),
                arguments("GIG-BO1", HEADPHONES_AND_HEAD_DOWN, "Cuffie e Testa Bassa", BOUND, SELF, 2, Map.of()),
                arguments("GIG-BO2", SCREWDRIVER_HIT, "Colpo col Cacciavite", BOUND, OPPONENT, 1, Map.of()),
                arguments("GIG-BO3", SHARPEN_THE_TOOLS, "Affilare gli Utensili", BOUND, SELF, 0, Map.of()),
                arguments("GIG-AR1", DISASSEMBLE, "Disassemblare", REGULAR, FAR_ITEM, 1, Map.of(VIOLENCE, 5)),
                arguments("GIG-AR2", THIRTEEN_WRENCH, "Chiave da Tredici", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GIG-AR3", PREPARE_THE_JOB, "Preparare il Lavoro", REGULAR, OPPONENT, 1, Map.of()),
                arguments("GIG-AR4", SECOND_TRUNK, "Secondo Bagagliaio", REGULAR, SELF, 2, Map.of(VIOLENCE, 5)),
                arguments("GIG-AR5", JOB_WELL_DONE, "Lavoro Fatto Bene", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GIG-AR6", EMPIRICAL_METHOD, "Metodo Empirico", REGULAR, OPPONENT, 1, Map.of()),
                arguments("CES-BA", PUT_ON_THE_TAB, "Messo in Conto", BASIC, NEAR_ITEM, 1, Map.of()),
                arguments("CES-BO1", LET_US_DISCUSS_IN_PRIVATE, "Discutiamone in Privato", BOUND, OPPONENT, 2, Map.of()),
                arguments("CES-BO2", MANIPULATIVE_TECHNIQUE, "Tecnica Manipolatoria", BOUND, OPPONENT, 1, Map.of()),
                arguments("CES-BO3", ACT_VAGUE, "Fare il Vago", BOUND, SELF, 2, Map.of()),
                arguments("CES-AR1", TIMELY_DISTRACTION, "Opportuna Distrazione", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 5)),
                arguments("CES-AR2", GOOD_OLD_BLACKMAIL, "Buon Vecchio Ricatto", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 15)),
                arguments("CES-AR3", SEEN_THAT_SCRIPT, "Copione Già Visto", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 10)),
                arguments("CES-AR4", STEEP_BILL, "Conto Salato", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 5)),
                arguments("CES-AR5", OPEN_SECRET, "Segreto di Pulcinella", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 15)),
                arguments("CES-AR6", PRANK_TOO_FAR, "Scherzo Oltre il Limite", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 10)),
                arguments("CES-AR7", NOSE_FOR_BUSINESS, "Fiuto per gli Affari", REGULAR, NEAR_ITEM, 1, Map.of()),
                arguments("ROC-BA", ITALIANS_FIRST, "Prima gli Italiani", BASIC, NEAR_ITEM, 0, Map.of()),
                arguments("ROC-BO1", ARROGANT_REFRESH, "Rinfrescata Arrogante", BOUND, OPPONENT, 1, Map.of()),
                arguments("ROC-BO2", LET_US_GET_UP_AND_YOU_GO, "Rialziamoci e Partite!", BOUND, SELF, 0, Map.of()),
                arguments("ROC-BO3", DISHONOUR_TO_THE_FLAG, "(Dis)onore alla Bandiera", BOUND, SELF, 2, Map.of()),
                arguments("LR-ROC", YOU_DID_NOTHING_TO_ME, "Non Mi Hai Fatto Niente", LAST_RESORT, OPPONENT, 0, Map.of()),
                arguments("ROC-AR1", SKINNED_KNUCKLES, "Nocche Sbucciate", REGULAR, OPPONENT, 0, Map.of(HEALTH, 15)),
                arguments("ROC-AR2", STOIC_AS_A_BRONZE_BUST, "Stoico come un Busto di Bronzo", REGULAR, SELF, 2, Map.of()),
                arguments("ROC-AR3", SO_WHAT, "E Allora...?", REGULAR, OPPONENT, 2, Map.of(HEALTH, 10)),
                arguments("ROC-AR4", PATRIOTIC_HEADBUTT, "Craniata Patriottica", REGULAR, OPPONENT, 0, Map.of(HEALTH, 30)),
                arguments("ROC-AR5", HISTORY_IS_WRITTEN_BY_THE_VICTORS, "La Storia la Scrivono i Vincitori", REGULAR, OPPONENT, 1, Map.of()),
                arguments("ROC-AR6", HARDHEAD, "Testa Dura", REGULAR, OPPONENT, 0, Map.of(HEALTH, 35)),
                arguments("GEN-01", SetBaseIds.GRAB, "Afferrare", REGULAR, NEAR_ITEM, 1, Map.of()),
                arguments("GEN-02", SLEIGHT_OF_HAND_THEFT, "Furto con Destrezza", REGULAR, FAR_ITEM, 0, Map.of(ALERTNESS, 10)),
                arguments("GEN-03", SUDDEN_DASH, "Scatto Repentino", REGULAR, OPPONENT, -1, Map.of()),
                arguments("GEN-04", GOT_ANY_SPARE_CHANGE, "Ce l'Hai Due Spicci?", REGULAR, OPPONENT, 0, Map.of()),
                arguments("GEN-05", SEAGULL_SO_LET_US_FLY_YOU, "GABBIANO, DUNQUE VOLIAMOTI", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GEN-06", BIG_HOLLOW_BRICK_28, "Foratone da 28", REGULAR, OPPONENT, 0, Map.of(VIOLENCE, 15)),
                arguments("GEN-07", NOW_LET_US_HEAL_YOU, "ORMALE GUARIAMOTI", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 20)),
                arguments("GEN-08", CHARM_YOU_WITH_BLOWS, "AMMALIAMOTI DI BOTTE", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 15)),
                arguments("GEN-09", STUN_YOU_I_SAID, "STORDIAMOTI HO DETTO", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GEN-10", EXCUSE_ME_SORRY_CAN_YOU_STOP, "PERMESSO SCUSA PUOI SMETTERLA", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 5)),
                arguments("GEN-11", KIND_YOUR_CARESS, "GENTILE IL TUO CAREZZO", REGULAR, SELF, 2, Map.of(VIOLENCE, 5)),
                arguments("GEN-12", EXTREME_HURRY_TO_GET_DRUNK, "Estrema Fretta di Alcolizzarsi", REGULAR, OPPONENT, 0, Map.of(ALERTNESS, 10)),
                arguments("GEN-13", MENTAL_CARAPACE_TECHNIQUE, "Tecnica del Carapace Mentale", REGULAR, SELF, 2, Map.of(ALERTNESS, 5)),
                arguments("GEN-14", GRITTED_TEETH, "Denti Stretti", REGULAR, SELF, 0, Map.of()),
                arguments("GEN-15", TWO_FINGERS_DOWN_THE_THROAT, "Due Dita in Gola", REGULAR, SELF, 1, Map.of()),
                arguments("GEN-16", EMERGENCY_BANDAGE, "Fasciatura d'Emergenza", REGULAR, SELF, 0, Map.of()),
                arguments("GEN-17", SPIT_IN_THE_ASHTRAY, "Sputo nel Posacenere", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 5)),
                arguments("GEN-18", SHOVE, "Spintone", REGULAR, OPPONENT, 1, Map.of()),
                arguments("GEN-19", LIGHT_FINGERS, "Mano Lesta", REGULAR, OPPONENT, 1, Map.of()),
                arguments("GEN-20", CATCH_YOUR_BREATH, "Riprendere Fiato", REGULAR, SELF, 0, Map.of()),
                arguments("GEN-21", BOTTLE_SHARD, "Coccio di Bottiglia", REGULAR, SELF, 1, Map.of(VIOLENCE, 5)),
                arguments("GEN-22", WAKE_UUUP, "Svegliaaah!", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 5)),
                arguments("GEN-23", TRIP, "Sgambetto", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 10)),
                arguments("GEN-24", COCAETHYLENE_ECSTASY, "Estasi da Coca Etilene", REGULAR, OPPONENT, 1, Map.of(TOXICITY, 10, ALCOHOL, 10)),
                arguments("LR-STR", AT_HIM, "Addosso!!!", LAST_RESORT, OPPONENT, 1, Map.of()));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("actions")
    void actionHasItsPrintedNameKindTargetPriorityAndCost(
            String slot, String binding, String name, Kind kind, CardTarget target, int priority, Map<Resource, Integer> cost) {
        Card action = card(binding);
        assertAll(slot,
                () -> assertEquals(binding, action.getBindingName()),
                () -> assertEquals(name, action.getName()),
                () -> assertFalse(action.isItem()),
                () -> assertEquals(kind == BASIC, action.isBasicAction()),
                () -> assertEquals(kind == BOUND, action.isCharacterBound()),
                () -> assertEquals(kind == LAST_RESORT, action.isLastResort()),
                () -> assertEquals(Set.of(target), action.getCanTarget()),
                () -> assertEquals(priority, action.getPriority()),
                () -> assertEquals(cost, action.getCost()));
    }
}

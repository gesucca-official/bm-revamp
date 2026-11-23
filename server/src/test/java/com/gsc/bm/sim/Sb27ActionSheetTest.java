package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.Card.CardTarget;
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

/** Intestazione e bersaglio trascritti dalle 99 schede delle azioni del candidato. */
class Sb27ActionSheetTest {
    enum Kind { REGULAR, BASIC, BOUND, LAST_RESORT }

    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    // GEN-04: SB-28 (D181 (3)) toglie il costo «A 0», che non si scrive più: la carta resta gratuita.
    static Stream<Arguments> actions() {
        return Stream.of(
                arguments("SPA-BA", "com.basic.BruiserGrab", "ADOPERIAMOTI", BASIC, NEAR_ITEM, -1, Map.of()),
                arguments("SPA-BO1", "bruiser.character.LittleRage", "LIEVE FASTIDIO", BOUND, SELF, 2, Map.of()),
                arguments("SPA-BO2", "bruiser.character.LittleSmack", "SVEGLIAMOCI - MA TU NO", BOUND, OPPONENT, 1, Map.of()),
                arguments("SPA-BO3", "base.spazienzio.bound.TestaAlMuro", "VIOLENZAZIONE", BOUND, SELF, 0, Map.of()),
                arguments("SPA-AR1", "bruiser.SuperImpact", "GARGANTUESCO IMPATTO SUL TU", REGULAR, OPPONENT, 0, Map.of(VIOLENCE, 25)),
                arguments("SPA-AR2", "bruiser.ExtremelyViolentBlow", "SPEDIAMOTI DUNQUE IN O-AHIO", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("SPA-AR3", "bruiser.Glare", "PAZIENZA: FINITA", REGULAR, SELF, 0, Map.of()),
                arguments("SPA-AR4", "bruiser.MadeOfStone", "NON GIOCARE COL COLTELLO NO", REGULAR, SELF, 0, Map.of()),
                arguments("SPA-AR5", "bruiser.YouStop", "FAI BASTA", REGULAR, OPPONENT, 2, Map.of(VIOLENCE, 5)),
                arguments("SPA-AR6", "base.bruiser.TiFaccioSpazio", "SGOMBERIAMOVI", REGULAR, SELF, 0, Map.of()),
                arguments("MAR-BA", "base.mara.PresoAlVolo", "Requisire al Volo", BASIC, NEAR_ITEM, 2, Map.of()),
                arguments("MAR-BO1", "base.mara.bound.PassoStretto", "Sventare l'Assassinio", BOUND, OPPONENT, 1, Map.of()),
                arguments("MAR-BO2", "base.mara.bound.CambioMarcia", "Semaforo Rosso", BOUND, SELF, 2, Map.of()),
                arguments("MAR-BO3", "base.mara.bound.ColpoDiStriscio", "Tagliare la Strada", BOUND, OPPONENT, 2, Map.of()),
                arguments("MAR-AR1", "base.mara.CinghiataDiTraverso", "Lazo del Rider", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 20)),
                arguments("MAR-AR2", "base.mara.Sgommata", "Sgommata", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 15)),
                arguments("MAR-AR3", "base.mara.SorpassoInCurva", "Agilità Innaturale", REGULAR, OPPONENT, 2, Map.of()),
                arguments("MAR-AR4", "base.mara.TraDueParaurti", "Unta e Bisunta", REGULAR, SELF, 2, Map.of(ALERTNESS, 5)),
                arguments("MAR-AR5", "base.mara.Slalom", "Slalom d'Avvicinamento", REGULAR, SELF, 2, Map.of()),
                arguments("MAR-AR6", "base.mara.TiStringoLaCurva", "Traiettoria Imprevedibile", REGULAR, SELF, 2, Map.of()),
                arguments("TOS-BA", "com.basic.ToxicGrab", "Desiderio Incontrollabile", BASIC, NEAR_ITEM, 1, Map.of()),
                arguments("TOS-BO1", "junkie.character.PatheticBlade", "Fondo del Posacenere", BOUND, OPPONENT, 1, Map.of()),
                arguments("TOS-BO2", "base.tossico.bound.RaschiareIlFondo", "Rintanarsi nel Cappotto", BOUND, SELF, 2, Map.of()),
                arguments("TOS-BO3", "junkie.character.RottenSmile", "Tagliare la Dose", BOUND, SELF, 0, Map.of()),
                arguments("LR-TOS", "junkie.LethalHeroinDose", "L'Ultimo Tiro", LAST_RESORT, OPPONENT, 1, Map.of()),
                arguments("TOS-AR1", "junkie.MethDrivenRage", "Fare l'Inventario", REGULAR, SELF, 1, Map.of()),
                arguments("TOS-AR2", "junkie.Cough", "Tossicone Scatarrante", REGULAR, OPPONENT, 1, Map.of(TOXICITY, 10)),
                arguments("TOS-AR3", "junkie.PervertedMetabolism", "Metabolismo Corrotto", REGULAR, SELF, 1, Map.of()),
                arguments("TOS-AR4", "junkie.AmphetamineReflexes", "Riflessi Aumentati dalla Speed", REGULAR, SELF, 2, Map.of(TOXICITY, 10)),
                arguments("TOS-AR5", "junkie.ToxicBloodDrain", "Trascinare nel Tunnel", REGULAR, OPPONENT, 1, Map.of(TOXICITY, 10)),
                arguments("TOS-AR6", "base.tossico.UnAssaggino", "Un Assaggino", REGULAR, SELF, 1, Map.of()),
                arguments("PIN-BA", "base.pino.QuestoLoFiniscoIo", "Fino all'Ultima Goccia", BASIC, NEAR_ITEM, 0, Map.of()),
                arguments("PIN-BO1", "base.pino.bound.CinqueMinutiEVado", "Posto Fisso", BOUND, SELF, 2, Map.of()),
                arguments("PIN-BO2", "base.pino.bound.SpallataAlBancone", "Violenta Spruzzata di Seltz", BOUND, OPPONENT, 1, Map.of()),
                arguments("PIN-BO3", "base.pino.bound.Coccio", "Schiarirsi le Idee", BOUND, SELF, 0, Map.of()),
                arguments("LR-PIN", "base.pino.UltimoGiro", "Ultimo Giro", LAST_RESORT, OPPONENT, 1, Map.of()),
                arguments("PIN-AR1", "base.pino.TestataDaUltimoGiro", "Scompenso da Ultimo Giro", REGULAR, OPPONENT, 1, Map.of(ALCOHOL, 5)),
                arguments("PIN-AR2", "base.pino.GoingBerserk", "Alla Goccia", REGULAR, OPPONENT, 1, Map.of()),
                arguments("PIN-AR3", "base.pino.IlBanconeRegge", "Avamposto Fortificato al Bancone", REGULAR, SELF, 2, Map.of()),
                arguments("PIN-AR4", "base.pino.OffroIo", "Un Altro e Arrivo", REGULAR, SELF, 1, Map.of()),
                arguments("PIN-AR5", "base.pino.RuttoADistanzaSociale", "Rutto a Bruciapelo", REGULAR, OPPONENT, 1, Map.of(ALCOHOL, 5)),
                arguments("PIN-AR6", "base.pino.PrimaIlBrindisi", "Un Altro... Grappino...", REGULAR, SELF, 1, Map.of()),
                arguments("GIG-BA", "base.gigi.QuestoTornaUtile", "Questo Torna Utile", BASIC, NEAR_ITEM, 0, Map.of()),
                arguments("GIG-BO1", "base.gigi.bound.UnaStrettaEPassa", "Cuffie e Testa Bassa", BOUND, SELF, 2, Map.of()),
                arguments("GIG-BO2", "base.gigi.bound.ColpoDiCacciavite", "Colpo col Cacciavite", BOUND, OPPONENT, 1, Map.of()),
                arguments("GIG-BO3", "base.gigi.bound.Lima", "Affilare gli Utensili", BOUND, SELF, 0, Map.of()),
                arguments("GIG-AR1", "bruiser.BreakYourToy", "Disassemblare", REGULAR, FAR_ITEM, 1, Map.of(VIOLENCE, 5)),
                arguments("GIG-AR2", "base.gigi.ChiaveDaTredici", "Chiave da Tredici", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GIG-AR3", "base.gigi.ColpoDiChiaveInglese", "Preparare il Lavoro", REGULAR, OPPONENT, 1, Map.of()),
                arguments("GIG-AR4", "base.gigi.SottoIlCofano", "Secondo Bagagliaio", REGULAR, SELF, 2, Map.of(VIOLENCE, 5)),
                arguments("GIG-AR5", "base.gigi.LavoroFattoBene", "Lavoro Fatto Bene", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GIG-AR6", "base.gigi.UnaStrettaDiProva", "Metodo Empirico", REGULAR, OPPONENT, 1, Map.of()),
                arguments("CES-BA", "base.cesira.LoMettoInConto", "Messo in Conto", BASIC, NEAR_ITEM, 1, Map.of()),
                arguments("CES-BO1", "base.cesira.bound.NeRiparliamoFuori", "Discutiamone in Privato", BOUND, OPPONENT, 2, Map.of()),
                arguments("CES-BO2", "base.cesira.bound.Battutina", "Tecnica Manipolatoria", BOUND, OPPONENT, 1, Map.of()),
                arguments("CES-BO3", "base.cesira.bound.FareIlVago", "Fare il Vago", BOUND, SELF, 2, Map.of()),
                arguments("CES-AR1", "base.cesira.OhGuardaLa", "Opportuna Distrazione", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 5)),
                arguments("CES-AR2", "base.cesira.Ricatto", "Buon Vecchio Ricatto", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 15)),
                arguments("CES-AR3", "base.cesira.LoSapevo", "Copione Già Visto", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 10)),
                arguments("CES-AR4", "base.cesira.ContoSalato", "Conto Salato", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 5)),
                arguments("CES-AR5", "base.cesira.LoSannoTutti", "Segreto di Pulcinella", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 15)),
                arguments("CES-AR6", "base.cesira.Malelingue", "Scherzo Oltre il Limite", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 10)),
                arguments("CES-AR7", "base.cesira.LoRivendo", "Fiuto per gli Affari", REGULAR, NEAR_ITEM, 1, Map.of()),
                arguments("ROC-BA", "base.rocco.PrimaIo", "Prima gli Italiani", BASIC, NEAR_ITEM, 0, Map.of()),
                arguments("ROC-BO1", "base.rocco.bound.Colpetto", "Rinfrescata Arrogante", BOUND, OPPONENT, 1, Map.of()),
                arguments("ROC-BO2", "base.rocco.bound.MiRialzo", "Rialziamoci e Partite!", BOUND, SELF, 0, Map.of()),
                arguments("ROC-BO3", "base.rocco.bound.AlzoLaVoce", "(Dis)onore alla Bandiera", BOUND, SELF, 2, Map.of()),
                arguments("LR-ROC", "base.rocco.NeHoPreseDiPeggio", "Non Mi Hai Fatto Niente", LAST_RESORT, OPPONENT, 0, Map.of()),
                arguments("ROC-AR1", "base.rocco.NoccheSbucciate", "Nocche Sbucciate", REGULAR, OPPONENT, 0, Map.of(HEALTH, 15)),
                arguments("ROC-AR2", "base.rocco.Incassare", "Stoico come un Busto di Bronzo", REGULAR, SELF, 2, Map.of()),
                arguments("ROC-AR3", "base.rocco.EAllora", "E Allora...?", REGULAR, OPPONENT, 2, Map.of(HEALTH, 10)),
                arguments("ROC-AR4", "base.rocco.Capocciata", "Craniata Patriottica", REGULAR, OPPONENT, 0, Map.of(HEALTH, 30)),
                arguments("ROC-AR5", "base.rocco.TeLoSpiegoIo", "La Storia la Scrivono i Vincitori", REGULAR, OPPONENT, 1, Map.of()),
                arguments("ROC-AR6", "base.rocco.TestaDura", "Testa Dura", REGULAR, OPPONENT, 0, Map.of(HEALTH, 35)),
                arguments("GEN-01", "com.Grab", "Afferrare", REGULAR, NEAR_ITEM, 1, Map.of()),
                arguments("GEN-02", "com.Steal", "Furto con Destrezza", REGULAR, FAR_ITEM, 0, Map.of(ALERTNESS, 10)),
                arguments("GEN-03", "base.com.ShuffleFeet", "Scatto Repentino", REGULAR, OPPONENT, -1, Map.of()),
                arguments("GEN-04", "base.com.BeggingMoney", "Ce l'Hai Due Spicci?", REGULAR, OPPONENT, 0, Map.of()),
                arguments("GEN-05", "bruiser.SeagullFly", "GABBIANO, DUNQUE VOLIAMOTI", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GEN-06", "base.com.MattoneDelCantiere", "Foratone da 28", REGULAR, OPPONENT, 0, Map.of(VIOLENCE, 15)),
                arguments("GEN-07", "bruiser.HealingBlow", "ORMALE GUARIAMOTI", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 20)),
                arguments("GEN-08", "bruiser.SickeningBlow", "AMMALIAMOTI DI BOTTE", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 15)),
                arguments("GEN-09", "bruiser.StunningBlow", "STORDIAMOTI HO DETTO", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 10)),
                arguments("GEN-10", "bruiser.BadEducation", "PERMESSO SCUSA PUOI SMETTERLA", REGULAR, OPPONENT, 1, Map.of(VIOLENCE, 5)),
                arguments("GEN-11", "bruiser.CantFeelAnything", "GENTILE IL TUO CAREZZO", REGULAR, SELF, 2, Map.of(VIOLENCE, 5)),
                arguments("GEN-12", "base.com.RincorsaDalMarciapiede", "Estrema Fretta di Alcolizzarsi", REGULAR, OPPONENT, 0, Map.of(ALERTNESS, 10)),
                arguments("GEN-13", "base.com.TartarugaSulMarciapiede", "Tecnica del Carapace Mentale", REGULAR, SELF, 2, Map.of(ALERTNESS, 5)),
                arguments("GEN-14", "base.com.DentiStretti", "Denti Stretti", REGULAR, SELF, 0, Map.of()),
                arguments("GEN-15", "base.com.DueDitaInGola", "Due Dita in Gola", REGULAR, SELF, 1, Map.of()),
                arguments("GEN-16", "base.com.FasciaturaColFazzolettaccio", "Fasciatura d'Emergenza", REGULAR, SELF, 0, Map.of()),
                arguments("GEN-17", "base.com.SputoDaPosacenere", "Sputo nel Posacenere", REGULAR, OPPONENT, 1, Map.of(ALERTNESS, 5)),
                arguments("GEN-18", "base.com.Spintone", "Spintone", REGULAR, OPPONENT, 1, Map.of()),
                arguments("GEN-19", "base.com.ManoLesta", "Mano Lesta", REGULAR, OPPONENT, 1, Map.of()),
                arguments("GEN-20", "base.com.SecondoFiato", "Riprendere Fiato", REGULAR, SELF, 0, Map.of()),
                arguments("GEN-21", "base.com.CoccioDiBottiglia", "Coccio di Bottiglia", REGULAR, SELF, 1, Map.of(VIOLENCE, 5)),
                arguments("GEN-22", "base.com.AcquaInFaccia", "Svegliaaah!", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 5)),
                arguments("GEN-23", "base.com.Sgambetto", "Sgambetto", REGULAR, OPPONENT, 2, Map.of(ALERTNESS, 10)),
                arguments("GEN-24", "base.com.EstasiDaCocaEtilene", "Estasi da Coca Etilene", REGULAR, OPPONENT, 1, Map.of(TOXICITY, 10, ALCOHOL, 10)),
                arguments("LR-STR", "com.last.Struggle", "Addosso!!!", LAST_RESORT, OPPONENT, 1, Map.of()));
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

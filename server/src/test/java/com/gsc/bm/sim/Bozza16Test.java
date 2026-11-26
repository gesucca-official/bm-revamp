package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16i (D97): the 1.6 in {@code bozza.json} against the 1.5 frozen in {@code storico/1.5/bozza.json} (with arm B's Bancone).
 * The changes of the approved proposal (D97) and the subsequent decisions cited below. The frozen copy is the 1.5 byte for byte.
 */
class Bozza16Test {
    static final ObjectMapper JSON = new ObjectMapper();
    static final Map<String, List<String>> PAIRS = new LinkedHashMap<>();
    static {
        PAIRS.put("bruiser.Glare", List.of("bruiser.SuperImpact", "bruiser.ExtremelyViolentBlow"));
        PAIRS.put("base.bruiser.TiFaccioSpazio", List.of("bruiser.ExtremelyViolentBlow", "bruiser.SuperImpact"));
        PAIRS.put("base.mara.Slalom", List.of("base.mara.Sgommata", "base.mara.CinghiataDiTraverso"));
        PAIRS.put("base.mara.TiStringoLaCurva", List.of("base.mara.CinghiataDiTraverso", "base.mara.Sgommata"));
        PAIRS.put("junkie.MethDrivenRage", List.of("junkie.Cough", "junkie.ToxicBloodDrain"));
        PAIRS.put("base.tossico.UnAssaggino", List.of("junkie.ToxicBloodDrain", "junkie.Cough"));
        PAIRS.put("base.pino.OffroIo", List.of("base.pino.GoingBerserk", "base.pino.RuttoADistanzaSociale"));
        PAIRS.put("base.pino.PrimaIlBrindisi", List.of("base.pino.RuttoADistanzaSociale", "base.pino.GoingBerserk"));
        PAIRS.put("base.gigi.ColpoDiChiaveInglese", List.of("base.gigi.ChiaveDaTredici", "base.gigi.LavoroFattoBene"));
        PAIRS.put("base.gigi.UnaStrettaDiProva", List.of("base.gigi.LavoroFattoBene", "base.gigi.ChiaveDaTredici"));
    }
    // SB-20b (D139, D140): numbers cleaned after the 1.6b (Impatto 35 HIT, Paraurti and Tartaruga x0.5, Casco x0.75); the checks on
    // rarity, kind, priority, targets, cost, java and exclusiveTo below still hold for them.
    static final Set<String> D139 = Set.of("bruiser.SuperImpact", "base.mara.TraDueParaurti", "base.com.TartarugaSulMarciapiede",
            "base.items.CascoDaLavoro");
    static final Set<String> CHANGED = new TreeSet<>(PAIRS.keySet());
    static {
        CHANGED.addAll(List.of("base.mara.SorpassoInCurva", "base.mara.Sgommata", "base.mara.CinghiataDiTraverso", "com.last.Struggle",
                "junkie.LethalHeroinDose", "base.pino.UltimoGiro", SetBaseArms.BANCONE));
        CHANGED.addAll(D139);
    }

    static JsonNode resource(String path) throws Exception {
        try (InputStream in = Bozza16Test.class.getResourceAsStream(path)) { return JSON.readTree(Objects.requireNonNull(in, path)); }
    }

    static JsonNode card(JsonNode draft, String binding) {
        for (JsonNode c : draft.path("cards")) if (c.path("binding").asText().equals(binding)) return c;
        return null;
    }

    /** SB-24 Fase B (D166): the draft without what the freeze 1.7 writes (version, names, flavour, characters' rarity). */
    static JsonNode withoutSb24(JsonNode draft) {
        ObjectNode copy = draft.deepCopy();
        ((ObjectNode) copy.path("set")).remove("version");
        // SB-30a B1 (D203): botStyle is a descriptive field added after the freeze, left out like name, flavour and rarity.
        for (JsonNode c : copy.path("characters")) ((ObjectNode) c).remove(List.of("name", "flavour", "rarity", "botStyle"));
        for (JsonNode c : copy.path("cards")) ((ObjectNode) c.path("gui")).remove(List.of("name", "flavour"));
        return copy;
    }

    private static JsonNode withoutPrintedText(JsonNode card) {
        ObjectNode comparable = card.deepCopy();
        ((ObjectNode) comparable.get("gui")).remove(List.of("description", "gains", "damageAmount"));
        withoutStatusText(comparable); // SB-25 B1 (D169 (4)): the statuses' name and description come from the generator too.
        return comparable;
    }

    private static void withoutStatusText(JsonNode node) {
        if (node.isObject() && node.path("op").asText().equals("status")) ((ObjectNode) node).remove(List.of("name", "description"));
        for (JsonNode child : node) withoutStatusText(child);
    }

    @Test
    void theFrozenCopyIsThe15() throws Exception {
        // The 1.5 as committed before SB-16i (370a364): byte for byte, so the historical measures are reproduced exactly.
        byte[] frozen = Files.readAllBytes(Path.of("src/test/resources/set-base/storico/1.5/bozza.json"));
        assertEquals("6f705bacf1a9", DeckSizePhaseTest.hash(frozen).substring(0, 12), "the SHA-256 written in bozza-di-riferimento 1.5");
        assertFalse(resource(SetBaseArms.FROZEN_15).path("rules").has("searchShuffle"));
        assertFalse(SetBaseArms.carriesArmB(resource(SetBaseArms.FROZEN_15)));
    }

    /** SB-21z (D161/D162): the cards the z2 candidate rewrote; their values are checked by SetBaseDraftTest and the reference draft. */
    static final Set<String> SB21Z = Set.of(
            "bruiser.character.LittleRage", "bruiser.character.LittleSmack", "base.spazienzio.bound.TestaAlMuro",
            "base.mara.bound.PassoStretto", "base.mara.bound.CambioMarcia", "base.mara.bound.ColpoDiStriscio",
            "base.mara.CinghiataDiTraverso", "base.mara.SorpassoInCurva", "bruiser.SeagullFly", "base.com.MattoneDelCantiere",
            "base.com.TartarugaSulMarciapiede", "base.com.SputoDaPosacenere", "com.items.CocktailOnTheGround",
            "base.items.PaninoDelKebab", "junkie.character.PatheticBlade", "base.tossico.bound.RaschiareIlFondo",
            "junkie.character.RottenSmile", "junkie.LethalHeroinDose", "junkie.ToxicBloodDrain", "base.com.RincorsaDalMarciapiede",
            "base.items.PasticcaTrovataSulBancone", "base.pino.bound.CinqueMinutiEVado", "base.pino.bound.SpallataAlBancone",
            "base.pino.bound.Coccio", "base.pino.UltimoGiro", "base.pino.RuttoADistanzaSociale",
            "base.gigi.bound.UnaStrettaEPassa", "base.gigi.bound.ColpoDiCacciavite", "base.gigi.bound.Lima",
            "base.gigi.ChiaveDaTredici", "base.gigi.LavoroFattoBene", "base.cesira.bound.Battutina",
            "base.cesira.bound.FareIlVago", "bruiser.StunningBlow", "base.com.AcquaInFaccia", "base.rocco.PrimaIo",
            "base.rocco.bound.Colpetto", "base.rocco.bound.AlzoLaVoce", "base.rocco.NeHoPreseDiPeggio",
            "base.rocco.NoccheSbucciate", "base.rocco.Incassare", "base.rocco.Capocciata", "base.com.SecondoFiato",
            "base.items.ContoDelTavoloSei");

    @Test
    void the16ChangesExactlyWhatD97Approved() throws Exception {
        // SB-17 (D106, D107): Sergio, his cards and prova-sergio are stripped; the rest is the 1.6b as approved.
        // SB-18 B2 (D126): Duccio, his cards and prova-duccio too.
        // SB-19 B1 (D129): the nine cards of the missing slots and the nine decks with the additions too.
        JsonNode old = SetBaseArms.armB(resource(SetBaseArms.FROZEN_15)), now = Sb19.without(Sb18.without(Sb17.without(resource("/set-base/bozza.json"))));
        // SB-24 Fase B (D166): names, flavour, the characters' P rarity and the version 1.7 are the owner's, not D97's; the rest is compared.
        old = withoutSb24(old);
        now = withoutSb24(now);
        assertTrue(SetBaseArms.carriesArmB(now), "arm B inside");
        ObjectNode rules = old.path("rules").deepCopy();
        rules.put("searchShuffle", true);
        assertEquals(rules, now.path("rules"));
        for (String key : List.of("format", "set")) assertEquals(old.path(key), now.path(key), key);
        // Characters: D97 adjusted Piera's health. D149 adjusts Piera, Mara and Celestina. SB-21z (D162): the z2 values.
        for (JsonNode c : now.path("characters")) {
            JsonNode before = null;
            for (JsonNode o : old.path("characters")) if (o.path("id").equals(c.path("id"))) before = o;
            ObjectNode expected = before.deepCopy();
            ObjectNode resources = (ObjectNode) expected.get("resources");
            String id = c.path("id").asText();
            if (id.equals("base.character.Pino")) resources.put("HEALTH", 80).put("ALCOHOL", 15);
            if (id.equals("base.character.Mara")) resources.put("HEALTH", 65).put("ALERTNESS", 45);
            if (id.equals("base.character.Gigi")) resources.put("HEALTH", 75);
            if (id.equals("bruiser.character.BigBadBruiser")) resources.put("HEALTH", 70);
            if (id.equals("junkie.character.ToxicJunkie")) resources.put("HEALTH", 65).put("TOXICITY", 20);
            assertEquals(expected, c, c.path("id").asText());
        }
        // D152 adds GEN-24 and renames the existing PIN-AR2 binding.
        Set<String> seen = new TreeSet<>();
        for (JsonNode c : now.path("cards")) {
            String b = c.path("binding").asText();
            JsonNode before = card(old, b);
            if (before == null) { seen.add(b); continue; }
            // D142: i tre campi stampati ora hanno come riferimento il generatore, controllato da controlla-testi.py.
            if (SB21Z.contains(b)) { assertNotEquals(before, c, b); continue; } // SB-21z (D162)
            if (!CHANGED.contains(b)) {
                ObjectNode expected = (ObjectNode) withoutPrintedText(before);
                // D149 and SB-21f: exact changes to the draft cards, with the rest of each card still checked.
                if (b.equals("base.pino.GoingBerserk")) {
                    ((ObjectNode) expected.path("params")).put("base", 10).put("perAlcohol", 1);
                    // SB-27 (D177 (1)): selfHit 0 only switched the self-damage off; it left the draft with its logic.
                    ((ObjectNode) expected.path("params")).remove("selfHit");
                }
                // SB-28 (D181 (3), lista di SB-27): alertnessToTarget 0 di «FAI BASTA» è uscito con la sua logica.
                if (b.equals("bruiser.YouStop")) ((ObjectNode) expected.path("params")).remove("alertnessToTarget");
                if (b.equals("base.pino.QuestoLoFiniscoIo"))
                    ((ObjectNode) expected.path("self").path(0)).put("amount", 15);
                if (b.equals("base.pino.TestataDaUltimoGiro"))
                    ((ObjectNode) expected.path("target").path(0)).put("amount", 35);
                // SB-21g (D158): compliant imports and the kept compensation to the toxic starter.
                if (b.equals("base.com.Spintone"))
                    ((ObjectNode) expected.path("target").path(0)).put("amount", 8);
                if (b.equals("base.tossico.bound.RaschiareIlFondo"))
                    ((ObjectNode) expected.path("self").path(0)).put("amount", 6);
                if (b.equals("junkie.Cough"))
                    ((ObjectNode) expected.path("target").path(0)).put("amount", 20);
                assertEquals(expected, withoutPrintedText(c), b);
            } else {
                assertNotEquals(before, c, b);
                for (String key : List.of("rarity", "kind", "priority", "targets", "cost", "java", "exclusiveTo"))
                    assertEquals(before.path(key), c.path(key), b + " " + key);
                assertEquals(before.path("gui").path("name"), c.path("gui").path("name"));
            }
        }
        assertEquals(Set.of("base.items.GhiaccioNelTovagliolo", "base.com.DueDitaInGola", "base.com.EstasiDaCocaEtilene"), seen);
        assertEquals(old.path("cards").size() + 3, now.path("cards").size());
        // Charges: second name, rewards and token of the 1.5 unchanged (D97 (3)-(4)).
        for (Map.Entry<String, List<String>> e : PAIRS.entrySet()) {
            JsonNode before = card(old, e.getKey()).path("self"), after = card(now, e.getKey()).path("self");
            JsonNode s0 = null, s1 = null;
            for (JsonNode s : before) if (s.path("op").asText().equals("search")) s0 = s;
            for (JsonNode s : after) if (s.path("op").asText().equals("search")) s1 = s;
            assertEquals(e.getValue().get(0), s0.path("card").asText());
            assertEquals(JSON.valueToTree(e.getValue()), s1.path("cards"));
            for (String key : List.of("vulnerability", "foundGains", "missedGains")) assertEquals(s0.path(key), s1.path(key), e.getKey() + key);
        }
        // Decks: Mara Steal -> Ghiaccio, Piera one Grab -> Due dita, Beppe one Steal -> Due dita.
        Map<String, Map<String, Integer>> delta = Map.of(
                "starter-mara", Map.of("com.Steal", -1, "base.items.GhiaccioNelTovagliolo", 1),
                "starter-pino", Map.of("com.Grab", -1, "base.com.DueDitaInGola", 1),
                "starter-gigi", Map.of("com.Steal", -1, "base.com.DueDitaInGola", 1));
        for (JsonNode d : now.path("decks")) {
            JsonNode before = null;
            for (JsonNode o : old.path("decks")) if (o.path("id").equals(d.path("id"))) before = o;
            for (String key : List.of("character", "bound", "lastResort", "basic")) assertEquals(before.path(key), d.path(key));
            Map<String, Integer> expected = new TreeMap<>();
            before.path("cards").fields().forEachRemaining(f -> expected.put(f.getKey(), f.getValue().asInt()));
            delta.getOrDefault(d.path("id").asText(), Map.of()).forEach((b, n) -> expected.merge(b, n, Integer::sum));
            expected.values().removeIf(n -> n == 0);
            Map<String, Integer> actual = new TreeMap<>();
            d.path("cards").fields().forEachRemaining(f -> actual.put(f.getKey(), f.getValue().asInt()));
            assertEquals(expected, actual, d.path("id").asText());
        }
    }

    @Test
    void theNewTextsAreReadByTheEngine() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        for (Map.Entry<String, List<String>> e : PAIRS.entrySet())
            assertEquals(e.getValue(), PrintedEffects.searchedNames(draft.card(e.getKey())), e.getKey());
        for (String b : List.of("base.mara.SorpassoInCurva", "base.mara.Sgommata", "base.mara.CinghiataDiTraverso"))
            assertTrue(PrintedEffects.hasAhead(draft.card(b)), b);
        for (String b : List.of("com.last.Struggle", "junkie.LethalHeroinDose", "base.pino.UltimoGiro"))
            assertTrue(PrintedEffects.hasPerPlay(draft.card(b)), b);
        Map<String, int[]> perPlay = Map.of("com.last.Struggle", new int[]{2, 5}, "junkie.LethalHeroinDose", new int[]{0, 5},
                "base.pino.UltimoGiro", new int[]{2, 4}); // SB-21z (D162): niente rincaro a se' per Celestina, 2 a se' per Piera
        perPlay.forEach((b, n) -> {
            Card c = draft.card(b);
            List<PrintedEffects.Step> damage = new ArrayList<>();
            for (PrintedEffects.Step s : ((PrintedEffects.Source) c).printedEffects().getSteps())
                if (s.getKind() == PrintedEffects.Kind.DAMAGE) damage.add(s);
            assertEquals(n[0], damage.stream().filter(s -> !s.isOnTarget()).findFirst().orElseThrow().getPerPlay(), b + " to self");
            assertEquals(n[1], damage.stream().filter(PrintedEffects.Step::isOnTarget).findFirst().orElseThrow().getPerPlay(), b);
        });
        assertTrue(draft.character("base.character.Mara").searchShuffle(), "the setting reaches the characters of the draft");
        assertFalse(BozzeStoriche.fromClasspath(SetBaseArms.FROZEN_15).character("base.character.Mara").searchShuffle());
    }
}

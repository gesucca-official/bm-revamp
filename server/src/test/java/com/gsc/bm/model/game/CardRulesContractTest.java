package com.gsc.bm.model.game;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.*;
import static org.junit.jupiter.api.Assertions.*;

class CardRulesContractTest {
    /** Every set entry has an explicit type in R07, including characters and the generated token. */
    @TestFactory Stream<DynamicTest> r07_cardTypes() throws IOException {
        List<String> lines;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(getClass().getResourceAsStream("/rules-card-types.tsv")), StandardCharsets.UTF_8))) {
            lines = reader.lines().collect(Collectors.toList());
        }
        assertEquals(40, lines.size());
        return lines.stream().map(line -> DynamicTest.dynamicTest("type: " + line.split("\t")[0], () -> {
            String[] fields = line.split("\t", -1);
            Object instance = Class.forName("com.gsc.bm.model.cards." + fields[0]).getDeclaredConstructor().newInstance();
            if (fields[1].equals("Personaggio")) {
                assertTrue(instance instanceof com.gsc.bm.model.Character);
                assertEquals("—", fields[2]);
                return;
            }
            assertTrue(instance instanceof Card);
            Card card = (Card) instance;
            assertEquals(fields[1].equals("Oggetto"), card.isItem());
            assertEquals(fields[2].equals("Base"), card.isBasicAction());
            assertEquals(fields[2].equals("Legata al personaggio"), card.isCharacterBound());
            assertEquals(fields[2].equals("Ultima risorsa"), card.isLastResort());
            if (fields[2].equals("Token")) {
                assertTrue(card.isItem());
                assertEquals("Broken Beer Bottle", card.getName());
            }
        }));
    }

    /** R07a roles are descriptive: the token declares its own, catalog cards receive the SQLite columns unchanged. */
    @Test void r07a_rolesReachTheCards() throws IOException {
        Map<String, String[]> roles = new LinkedHashMap<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(getClass().getResourceAsStream("/rules-card-roles.tsv")), StandardCharsets.UTF_8))) {
            reader.lines().forEach(line -> roles.put(line.split("	")[0], line.split("	", -1)));
        }
        assertEquals(38, roles.size());
        var token = new com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle();
        assertEquals(roles.get("com.tokens.BrokenBeerBottle")[1], token.getRole());
        assertEquals(roles.get("com.tokens.BrokenBeerBottle")[2], token.getGains());
        assertEquals(roles.get("com.tokens.BrokenBeerBottle")[3], token.getDamage());
        assertEquals("—", token.getDamage(), "the conversion is not the token's own damage (R07a 1.9)");
        var repo = org.mockito.Mockito.mock(com.gsc.bm.repo.internal.CardsGuiRepository.class);
        var record = org.mockito.Mockito.mock(com.gsc.bm.repo.internal.CardsGuiRecord.class);
        org.mockito.Mockito.when(repo.findById("bruiser.HealingBlow")).thenReturn(Optional.of(record));
        org.mockito.Mockito.when(record.getGuiName()).thenReturn("ORMALE GUARIAMOTI");
        org.mockito.Mockito.when(record.getGuiDescription()).thenReturn("");
        org.mockito.Mockito.when(record.getGuiRole()).thenReturn(roles.get("bruiser.HealingBlow")[1]);
        org.mockito.Mockito.when(record.getGuiGains()).thenReturn(roles.get("bruiser.HealingBlow")[2]);
        org.mockito.Mockito.when(record.getGuiDamage()).thenReturn(roles.get("bruiser.HealingBlow")[3]);
        var factory = new com.gsc.bm.service.factories.CardFactoryServiceImpl(repo,
                org.mockito.Mockito.mock(com.gsc.bm.repo.internal.CardKeywordsRepository.class));
        var blow = (com.gsc.bm.model.cards.AbstractCard) factory.craftCard("bruiser.HealingBlow");
        assertEquals("DAMAGE", blow.getRole());
        assertEquals("—", blow.getGains());
        assertEquals("HIT", blow.getDamage());
    }

    /** R07a 1.9 nominal damage: one of the allowed forms for every card and the token, never for characters. */
    @Test void r07a_damageHasTheRegulationForm() throws IOException {
        List<String[]> rows;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(getClass().getResourceAsStream("/rules-card-roles.tsv")), StandardCharsets.UTF_8))) {
            rows = reader.lines().map(line -> line.split("\t", -1)).collect(Collectors.toList());
        }
        assertEquals(38, rows.size());
        for (String[] row : rows) {
            assertEquals(4, row.length, row[0]);
            assertTrue(row[3].matches("—|(HIT|CUT|POISON)(, (HIT|CUT|POISON))*"), row[0] + ": " + row[3]);
        }
        assertEquals("CUT", rows.stream().filter(r -> r[0].equals("junkie.character.PatheticBlade")).findFirst().orElseThrow()[3]);
        assertEquals("—", rows.stream().filter(r -> r[0].equals("com.items.MarvelousCocktail")).findFirst().orElseThrow()[3],
                "timer poison is excluded by R07a 1.9");
    }

    /** Fixed expectations transcribed from regulation R07, never regenerated from production code. */
    @TestFactory Stream<DynamicTest> r07_costPriorityAndTarget() throws IOException {
        List<String> lines;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(getClass().getResourceAsStream("/rules-v1-cards.tsv")), StandardCharsets.UTF_8))) {
            lines = reader.lines().collect(Collectors.toList());
        }
        assertEquals(33, lines.size());
        return lines.stream().map(line -> DynamicTest.dynamicTest(line.split("\t")[0], () -> {
            String[] fields = line.split("\t", -1);
            Card card = (Card) Class.forName("com.gsc.bm.model.cards." + fields[0]).getDeclaredConstructor().newInstance();
            Map<Resource,Integer> cost = new EnumMap<>(Resource.class);
            if (!fields[3].isEmpty()) for (String entry : fields[3].split(",")) {
                String[] pair = entry.split("="); cost.put(Resource.valueOf(pair[0]), Integer.valueOf(pair[1]));
            }
            assertEquals(cost,card.getCost());
            assertEquals(Integer.parseInt(fields[1]),card.getPriority());
            assertEquals(Set.of(Card.CardTarget.valueOf(fields[2])),card.getCanTarget());
        }));
    }
}

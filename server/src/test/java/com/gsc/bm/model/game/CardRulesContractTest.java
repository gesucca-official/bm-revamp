package com.gsc.bm.model.game;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import org.junit.jupiter.api.DynamicTest;
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

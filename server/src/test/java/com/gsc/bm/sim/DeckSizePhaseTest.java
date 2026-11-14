package com.gsc.bm.sim;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.JSON;
import static org.junit.jupiter.api.Assertions.*;

/** D83: six sequential arms in one JVM, one step 0 and one round, with frozen lists and an immediate identity gate. */
class DeckSizePhaseTest {
    static String hash(byte[] bytes) throws Exception {
        StringBuilder out=new StringBuilder();
        for(byte b:MessageDigest.getInstance("SHA-256").digest(bytes))out.append(String.format("%02x",b));
        return out.toString();
    }

    @Test @EnabledIfSystemProperty(named="sim.deckPhase",matches="step0|round")
    void measurePhase() throws Exception {
        String phase=System.getProperty("sim.deckPhase");
        Path root=Path.of(System.getProperty("sim.deckRoot")); Files.createDirectories(root);
        Map<String,String> frozen=new TreeMap<>();
        frozen.put("reference",Bench.sha256(DeckSizeVariantsTest.reference()));
        for(String v:DeckSizeVariants.NAMES)frozen.put(v,hash(JSON.writeValueAsBytes(DeckSizeVariants.specification(v))));
        String freeze=JSON.writeValueAsString(frozen);
        if(phase.equals("step0")) {
            assertFalse(Files.exists(root.resolve("freeze.json")),"step 0 already started: no automatic rerun");
            Files.writeString(root.resolve("freeze.json"),freeze);
            assertEquals("4",System.getProperty("sim.chargeGames"));
        } else {
            assertEquals(Files.readString(root.resolve("freeze.json")),freeze,"lists/reference changed after step 0");
            assertTrue(List.of("150","300").contains(System.getProperty("sim.chargeGames")));
        }
        long started=System.nanoTime();
        for(String v:List.of("20-2","25-2","25-3","30-2","30-3","mixed")) {
            Path out=root.resolve(phase).resolve(v);
            assertFalse(Files.exists(out.resolve("matrix.json")),"arm already measured: no automatic rerun");
            System.setProperty("sim.deckVariant",v); System.setProperty("sim.chargeOut",out.toString());
            System.out.println("SB-16h starting "+phase+" "+v);
            new ChargeMeasureTest().measure();
            if(phase.equals("step0")&&v.equals("20-2")) {
                Path historical=Path.of(System.getProperty("sim.deckIdentity"));
                Map<String,Object> identity=new TreeMap<>();
                for(String name:List.of("matrix.json","matrix.md","observations.json","draft.json")) {
                    byte[] before=Files.readAllBytes(historical.resolve(name)),after=Files.readAllBytes(out.resolve(name));
                    identity.put(name,Map.of("bytes",after.length,"historicalSha256",hash(before),"sha256",hash(after),
                            "identical",Arrays.equals(before,after)));
                    Files.writeString(root.resolve("identity.json"),JSON.writeValueAsString(identity));
                    assertArrayEquals(before,after,"STOP: 20/2 does not match the historical 1.5 step 0: "+name);
                }
                System.out.println("SB-16h identity: all four historical files byte-identical");
            }
        }
        Files.writeString(root.resolve(phase+"-seconds.txt"),String.valueOf((System.nanoTime()-started)/1e9));
    }
}

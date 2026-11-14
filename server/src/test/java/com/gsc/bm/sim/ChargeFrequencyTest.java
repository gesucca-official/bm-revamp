package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.*;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.*;
import java.nio.file.*;
import java.util.*;
import static com.gsc.bm.sim.StarterRedesignTest.*;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.*;
import static org.junit.jupiter.api.Assertions.*;

/** D79: all ten real charges, including both resource outcomes and public-only forecasting/timing. */
class ChargeFrequencyTest {
    static Draft draft;
    static final String OTHER="base.com.Spintone";
    static final Resource[] RES={Resource.VIOLENCE,Resource.ALERTNESS,Resource.TOXICITY,Resource.ALCOHOL};
    // Expected at N+1 from zero, after periodic L decay (independent of card parsing).
    static final int[][] FULL={{25,15,0,0},{15,15,0,0},{0,15,0,0},{0,15,0,0},{0,0,10,0},{0,0,10,0},{0,28,0,7},{0,28,0,7},{10,0,0,0},{10,0,0,0}};
    static final int[][] MISS={{5,5,0,0},{5,5,0,0},{0,5,0,0},{0,5,0,0},{0,0,5,0},{0,0,5,0},{0,8,0,2},{0,8,0,2},{5,0,0,0},{5,0,0,0}};
    @BeforeAll static void load() throws Exception {draft=Draft.fromClasspath("/set-base/bozza.json");StarterRedesignTest.load();}
    static Player zero(int i,List<Card> hand,List<Card> deck) {
        Player p=player(DECKS[i/2],"a",hand,deck);
        for(Resource r:RES)p.getResources().put(r,0);
        return p;
    }
    @Test void tenChargesFindExactlyTheirNameOrDrawWithTheApprovedAlternativeGains() {
        for(int i=0;i<10;i++)for(boolean found:List.of(false,true)) {
            String[] pair=ChargeFrequency.PAIRS[i];Card charge=draft.card(pair[0]),hit=draft.card(pair[1]);
            Player a=zero(i,List.of(charge),found?List.of(draft.card(OTHER),hit):List.of(draft.card(OTHER)));
            Player b=foe();Game g=game(a,b);
            turn(g,move(g,a,charge,"SELF"),waitMove(g,b));
            assertEquals(pair[1],resolved(g,"a").getSearchedFor(),pair[0]);
            assertEquals(found,resolved(g,"a").getSearchFound()!=null,pair[0]);
            for(int r=0;r<RES.length;r++)assertEquals((found?FULL:MISS)[i][r],a.getResources().get(RES[r]),pair[0]+found+RES[r]);
            BotView v=BotView.of(g,"b");BotView.Opponent seen=v.getOpponents().get(0);
            assertEquals(found?1:0,seen.getRevealed().size());
            assertEquals(found?3:0,seen.getSeat().getStatuses().size());
            seen.getSeat().getStatuses().forEach(s->{assertEquals(hit.getName(),s.getUntilPlayed());assertEquals(1.5f,s.getFactor());});
            if(found) {
                assertTrue(BotView.of(g,"a").legalMoves().stream().anyMatch(m->m.getCard().getBinding().equals(pair[1])),"D63 "+pair[0]);
                turn(g,move(g,a,hit,"b"),waitMove(g,b));
                assertFalse(resolved(g,"a").isVoid());assertTrue(a.getCharacter().getStatuses().isEmpty(),pair[0]);
            }
        }
    }
    @Test void preparoSearchesChiaveEvenWhenLavoroIsOnTopAndAnotherChiaveIsHeld() {
        Card charge=draft.card("base.gigi.ColpoDiChiaveInglese"),chiave=draft.card("base.gigi.ChiaveDaTredici");
        Player a=zero(8,List.of(charge,chiave),List.of(draft.card("base.gigi.LavoroFattoBene"),draft.card("base.gigi.ChiaveDaTredici")));
        Player b=foe();Game g=game(a,b);turn(g,move(g,a,charge,"SELF"),waitMove(g,b));
        assertEquals("base.gigi.ChiaveDaTredici",resolved(g,"a").getSearchedFor());
        assertEquals(2,a.getCardsInHand().stream().filter(c->c.getName().equals(chiave.getName())).count());
        turn(g,move(g,a,chiave,"b"),waitMove(g,b));assertTrue(a.getCharacter().getStatuses().isEmpty());
    }
    @Test void thePublicForecastContainsBothActualSearchOutcomesForAllTenCharges() {
        for(int i=0;i<10;i++)for(boolean found:List.of(false,true)) {
            String[] pair=ChargeFrequency.PAIRS[i];Card charge=draft.card(pair[0]),attack=draft.card(OTHER);
            Player a=zero(i,List.of(charge),found?List.of(draft.card(pair[1])):List.of(draft.card(OTHER)));
            Player b=player("starter-tossico","b",List.of(attack),List.of());b.getResources().put(Resource.ALERTNESS,0);
            Game g=game(a,b);BotView v=BotView.of(g,"a");
            LegalMove chosen=v.legalMoves().stream().filter(m->m.getCard().getBinding().equals(pair[0])).findFirst().orElseThrow();
            List<Map<String,Integer>> predicted=TurnForecast.variants(v,chosen,new TurnForecast.Threat(v.getOpponents().get(0).getSeat(),BotView.publicText(attack),"a",null));
            turn(g,move(g,a,charge,"SELF"),move(g,b,attack,"a"));
            assertTrue(predicted.contains(Map.of("a",a.getResources().get(Resource.HEALTH),"b",b.getResources().get(Resource.HEALTH))),pair[0]+" found="+found);
        }
    }
    @Test void everyNewChargeHasPublicPrintedSearchAndThePoliciesFollowTheRightName() {
        for(int i=0;i<10;i++) {
            String[] pair=ChargeFrequency.PAIRS[i]; Card charge=draft.card(pair[0]),hit=draft.card(pair[1]);
            BotView.CardSeen text=BotView.publicText(charge);
            assertNotNull(text.getEffects());
            Player a=zero(i,List.of(charge),List.of(hit));Player b=foe();Game g=game(a,b);
            // Opponent's move is a public threat only in this fidelity test, never read by a policy.
            BotView v=BotView.of(g,"a");LegalMove legal=v.legalMoves().stream().filter(m->m.getCard().getBinding().equals(pair[0])).findFirst().orElseThrow();
            TurnForecast.Threat threat=new TurnForecast.Threat(v.getOpponents().get(0).getSeat(),BotView.publicText(draft.card(OTHER)),"a",null);
            List<Map<String,Integer>> outcomes=TurnForecast.variants(v,legal,threat);
            assertFalse(outcomes.isEmpty());
            turn(g,move(g,a,charge,"SELF"),waitMove(g,b));
            BotView after=BotView.of(g,"a");
            for(SoughtHitPolicy.Timing timing:SoughtHitPolicy.Timing.values()) {
                BotPolicy first=(view,moves,rng)->moves.get(0);
                BotPolicy policy=new LethalAwarePolicy(new SoughtHitPolicy(first,timing));
                Set<String> chosen=new HashSet<>();
                for(int seed=0;seed<32;seed++)chosen.add(policy.choose(after,after.legalMoves(),new Random(seed*7919)).getCard().getName());
                assertTrue(chosen.contains(hit.getName()),pair[0]+timing);
                if(timing!=SoughtHitPolicy.Timing.RANDOM)assertEquals(Set.of(hit.getName()),chosen);
            }
        }
    }
    @Test void d79ChangesOnlyTheApprovedCardsAndCopiesAndNeverTheHitsPower() throws Exception {
        com.fasterxml.jackson.databind.JsonNode old=JSON.readTree(Files.readString(Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json")));
        com.fasterxml.jackson.databind.JsonNode now=draft.json();
        for(String key:List.of("characters","rules","format","set"))assertEquals(old.path(key),now.path(key));
        for(String[] pair:ChargeFrequency.PAIRS) {
            com.fasterxml.jackson.databind.node.ObjectNode before=(com.fasterxml.jackson.databind.node.ObjectNode)StarterBalanceMeasureTest.card(old,pair[1]).deepCopy();
            com.fasterxml.jackson.databind.node.ObjectNode after=(com.fasterxml.jackson.databind.node.ObjectNode)StarterBalanceMeasureTest.card(now,pair[1]).deepCopy();
            before.remove("rarity");after.remove("rarity");assertEquals(before,after,pair[1]);
        }
        Set<String> allowed=new HashSet<>();for(String[] pair:ChargeFrequency.PAIRS)Collections.addAll(allowed,pair);
        for(com.fasterxml.jackson.databind.JsonNode c:old.path("cards"))if(!allowed.contains(c.path("binding").asText()))
            assertEquals(c,StarterBalanceMeasureTest.card(now,c.path("binding").asText()),c.path("binding").asText());
        assertEquals(76,now.path("cards").size());
        for(int i=0;i<5;i++)for(int j=0;j<2;j++) {
            String[] pair=ChargeFrequency.PAIRS[i*2+j];
            assertEquals(j==0?2:1,draft.cardsOf(DECKS[i]).get(pair[0]));
            assertEquals(j==0?2:1,draft.cardsOf(DECKS[i]).get(pair[1]));
            assertEquals("UNCOMMON",draft.rarityOf(pair[0]));
            assertEquals(j==0?"UNCOMMON":"RARE",draft.rarityOf(pair[1]));
            assertTrue(draft.card(pair[0]).getEffect().contains("Annuncia "));
        }
    }
}

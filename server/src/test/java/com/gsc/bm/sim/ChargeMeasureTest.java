package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.game.bot.*;
import com.gsc.bm.model.game.status.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import java.lang.reflect.Field;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiConsumer;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.*;
import static org.junit.jupiter.api.Assertions.*;

/** D74, one opt-in round: full matrix, paired policy comparison and event-level token damage. */
class ChargeMeasureTest {
    static final ThreadLocal<Measured> SOURCE = new ThreadLocal<>();
    static final class Measured extends Character {
        final String key;
        final Counts counts = new Counts();
        final int initialHealth;
        boolean periodic, parried;
        Measured(Character c, String key) {
            super(c.getBindingName(), 0, 0, c.getItemsSize()); this.key = key;
            getResources().putAll(c.getResources()); getItems().addAll(c.getItems());
            getStatuses().addAll(c.getStatuses()); getTimers().addAll(c.getTimers()); getImmunities().addAll(c.getImmunities());
            initialHealth = getResources().get(Resource.HEALTH);
        }
        @Override public List<String> resolveTimeBasedEffects() {
            periodic=true; try { return super.resolveTimeBasedEffects(); } finally { periodic=false; }
        }
        @Override public String inflictDamage(Character target, Damage d, Set<StatusType> types) {
            Measured before = SOURCE.get(); SOURCE.set(this);
            try { return super.inflictDamage(target, d, types); }
            finally { if (before == null) SOURCE.remove(); else SOURCE.set(before); }
        }
        int amount(Damage input, Set<StatusType> types, boolean omitToken) {
            Damage d = new Damage(input.getType(), input.getAmount());
            for (Status s : getStatuses()) {
                if (s.getFlow() != StatusFlow.INPUT || s.getImpactedProperty() != d.getType() || !types.contains(s.getType())) continue;
                if (omitToken && s.getExposure() != null) continue;
                d.setType((Damage.DamageType)s.getTypeFunction().apply(d.getType()));
                d.setAmount(s.getAmountFunction().apply((float)d.getAmount()).intValue());
            }
            if (d.getType() == Damage.DamageType.HIT) d.setAmount(Math.max(0,d.getAmount()-getResources().get(Resource.ALCOHOL)/4));
            return d.getAmount();
        }
        @Override public String takeDamage(Damage d, Set<StatusType> types) {
            Measured source=SOURCE.get();
            if(source!=null&&source!=this&&getStatuses().stream().anyMatch(s->s.getFlow()==StatusFlow.INPUT
                    &&s.getImpactedProperty()==d.getType()&&types.contains(s.getType())&&!s.isEquip()
                    &&s.getExposure()==null&&s.getAmountFunction().apply(100f)<100f))source.parried=true;
            if (getStatuses().stream().anyMatch(s -> s.getExposure() != null)) {
                int actual = amount(d,types,false), plain = amount(d,types,true);
                String who = SOURCE.get() != null && SOURCE.get() != this ? "opponent" : "selfOrPeriodic";
                counts.add("tokenDamageEvents-"+who); counts.add("tokenDamage-"+who,actual);
                counts.add("tokenExtra-"+who,actual-plain);
                String kind=periodic?"periodic":SOURCE.get()==this?"self":"opponent";
                counts.add("tokenDamage-"+kind+"-"+d.getType(),actual);
                counts.add("tokenExtra-"+kind+"-"+d.getType(),actual-plain);
            }
            return super.takeDamage(d, types);
        }
    }

    static final class Observe implements BiConsumer<String, Game> {
        final Map<String, Counts> totals = new TreeMap<>();
        final Map<String, Integer> before = new HashMap<>();
        final Map<String, Card> played = new HashMap<>();
        final Map<String, Integer> tokensAtStart = new HashMap<>();
        boolean halfTurn, finalHalfTurn;
        final ChargeFrequency frequency=new ChargeFrequency();
        synchronized void merge(Measured c) { totals.computeIfAbsent(c.key,k->new Counts()).merge(c.counts); }
        // A separate instance per running game, used through the ThreadLocal below.
        @Override public void accept(String stage, Game g) {
            if (stage.equals("ROUND_READY")) {
                frequency.ready(g);
                before.clear(); played.clear(); tokensAtStart.clear();
                for (Player p:g.getPlayers().values()) {
                    before.put(p.getPlayerId(),p.getResources().get(Resource.HEALTH));
                    tokensAtStart.put(p.getPlayerId(),(int)p.getCharacter().getStatuses().stream().filter(s->s.getExposure()!=null)
                            .map(Status::getExposure).distinct().count());
                }
                for (Move m:g.getPendingMoves()) if(!m.isVoid()) played.put(m.getPlayerId(),g.getCardFromHand(m.getPlayerId(),m.getPlayedCardName()));
            } else {
                frequency.committed(g);
                boolean half = false;
                for(Player p:g.getPlayers().values()) {
                    Measured c=(Measured)p.getCharacter(); String id=p.getPlayerId();
                    int lost=before.get(id)-p.getResources().get(Resource.HEALTH);
                    boolean big=lost*2>=c.initialHealth; half|=big;
                    int tokens=tokensAtStart.get(id); if(tokens>0) {c.counts.add("tokenSeatTurns");c.counts.add("tokenSeatTurnHealthLost",lost);}
                    Card card=played.get(id);
                    if(card!=null && ChargeFrequency.isHit(card.getBindingName()) && tokens>0)c.counts.add("soughtHitChosenWithToken");
                    if(tokens>0 && (card==null || !ChargeFrequency.isHit(card.getBindingName())))c.counts.add("tokenHeldTurns");
                }
                halfTurn|=half; finalHalfTurn=half&&g.isOver();
                for(Move m:g.getResolvedMoves()) if(m.getSearchedFor()!=null) {
                    Measured c=(Measured)g.getPlayers().get(m.getPlayerId()).getCharacter(); boolean found=m.getSearchFound()!=null;
                    c.counts.add("searches");c.counts.add(found?"found":"missed");
                    c.counts.add(found?"healthLostFoundTurn":"healthLostMissedTurn",before.get(m.getPlayerId())-c.getResources().get(Resource.HEALTH));
                }
                if(g.isOver())for(Player p:g.getPlayers().values()) {
                    Measured c=(Measured)p.getCharacter(); c.counts.add("seatGames");
                    c.counts.add("turns",g.getTurn());
                    if(g.getWinner().isEmpty())c.counts.add("draws");
                    else if(g.getWinner().get().equals(p.getPlayerId()))c.counts.add("wins");
                    if(halfTurn)c.counts.add("gamesWithHalfHealthTurn");if(finalHalfTurn)c.counts.add("gamesEndedInHalfHealthTurn");
                }
            }
        }
    }

    @Test @EnabledIfSystemProperty(named="sim.chargeOut", matches=".+")
    void measure() throws Exception {
        assertEquals(Ruleset.D50,SimulationRunner.selectedRuleset());
        Path out=Path.of(System.getProperty("sim.chargeOut")); Files.createDirectories(out);
        Draft draft=Draft.selected(); Map<String,BotPolicy> styles=new LinkedHashMap<>();
        for(SoughtHitPolicy.Timing t:SoughtHitPolicy.Timing.values())for(Map.Entry<String,BotPolicy> s:PlaygroundTest.styles().entrySet()) {
            if(s.getKey().equals("casuale"))continue;
            BotPolicy base=s.getValue()==null?new RandomPolicy():s.getValue();
            // D76: steps 2 and 3 measure with the lethal-aware bots; -Dsim.bots=passo1 reproduces the round of step 1.
            BotPolicy timed=new SoughtHitPolicy(base,t);
            styles.put(t.name()+"/"+s.getKey(),"passo1".equals(System.getProperty("sim.bots"))?timed:new LethalAwarePolicy(timed));
        }
        // Exactly the four historical styles (com is wrapped, with the same seeded Random API).
        assertEquals(12,styles.size());
        ThreadLocal<Observe> watches=new ThreadLocal<>(); Observe aggregate=new Observe();
        PlayerSource source=(deck,id,rng,policy)-> {
            Player p=draft.player(deck,id,rng,policy);
            String style=styles.entrySet().stream().filter(e->e.getValue()==policy).findFirst().orElseThrow().getKey();
            Field f=Player.class.getDeclaredField("character");f.setAccessible(true); f.set(p,new Measured(p.getCharacter(),deck+"|"+style));
            return p;
        };
        long started=System.nanoTime();
        Bench.Settings settings=new Bench.Settings(Integer.getInteger("sim.chargeGames",300),7_000_000L,List.of(DECKS),styles,
                Integer.getInteger("sim.threads",8),BoundCap.Params.DEFAULT,"SB-16g 2b2: D79 frequency, one round");
        Bench.Report report=Bench.run(draft,settings,source,(stage,g)-> {
            if(stage.equals("ROUND_READY")&&g.getTurn()==0)watches.set(new Observe());
            Observe watch=watches.get();if(watch==null){watch=new Observe();watches.set(watch);} watch.accept(stage,g);
            if(stage.equals("ROUND_COMMITTED")&&g.isOver()) {
                for(Player p:g.getPlayers().values())aggregate.merge((Measured)p.getCharacter()); watches.remove();
            }
        });
        double seconds=(System.nanoTime()-started)/1e9;
        Files.writeString(out.resolve("matrix.json"),JSON.writeValueAsString(JSON.readTree(report.json())));
        Files.writeString(out.resolve("matrix.md"),report.markdown());
        Files.writeString(out.resolve("observations.json"),JSON.writeValueAsString(aggregate.totals));
        Files.writeString(out.resolve("draft.json"),JSON.writeValueAsString(draft.json()));
        Files.writeString(out.resolve("seconds.txt"),String.valueOf(seconds));
        for(Counts c:aggregate.totals.values())for(String[] pair:ChargeFrequency.PAIRS) {
            String pre="charge/"+pair[0]+"/";
            assertEquals(c.getOrDefault(pre+"played",0L).longValue(),c.getOrDefault(pre+"resolved",0L)+c.getOrDefault(pre+"notExecuted",0L),pre);
            assertEquals(c.getOrDefault(pre+"resolved",0L).longValue(),c.getOrDefault(pre+"found",0L)+c.getOrDefault(pre+"missed",0L),pre);
            assertEquals(c.getOrDefault(pre+"found",0L).longValue(),c.getOrDefault(pre+"foundCopyPlayed",0L)+c.getOrDefault(pre+"foundCopyDiscarded",0L)+c.getOrDefault(pre+"foundCopyHeldAtEnd",0L),pre);
            assertEquals(c.getOrDefault(pre+"tokensCreated",0L).longValue(),c.getOrDefault(pre+"tokenSatisfied",0L)+c.getOrDefault(pre+"tokenExitD71",0L)+c.getOrDefault(pre+"tokenClosedAtEnd",0L),pre);
        }
        assertEquals(0,report.checks.total(),report.failures());assertEquals(0,report.boundViolations(),report.failures());
        System.out.println("charge round: "+report.games()+" games, "+seconds+" seconds");
    }

    @Test void damageObservationPreservesTheTrace() throws Exception {
        Draft draft=Draft.fromClasspath("/set-base/bozza.json");
        PlayerSource source=(deck,id,rng,policy)->{Player p=draft.player(deck,id,rng,policy);Field f=Player.class.getDeclaredField("character");
            f.setAccessible(true);f.set(p,new Measured(p.getCharacter(),deck));return p;};
        SimulationRunner a=new SimulationRunner(draft,Ruleset.D50), b=new SimulationRunner(source,Ruleset.D50);
        for(long seed=7_000_000;seed<7_000_020;seed++) {
            SimulationRunner.Contender x=new SimulationRunner.Contender(DECKS[(int)(seed%5)],new SoughtHitPolicy(new ResourceAwarePolicy(),SoughtHitPolicy.Timing.ALWAYS));
            SimulationRunner.Contender y=new SimulationRunner.Contender(DECKS[(int)((seed+2)%5)],new SoughtHitPolicy(new AggressivePolicy(),SoughtHitPolicy.Timing.RANDOM));
            Observe observer=new Observe();
            assertEquals(a.continueGame(a.newGame(seed,x,y),seed,true,g->{}).jsonl(), b.continueGame(b.newGame(seed,x,y),seed,true,g->{},observer).jsonl());
        }
    }

    @Test void theHistoricalStepOneChangesOnlyTheFiveExistingCharges() throws Exception {
        com.fasterxml.jackson.databind.JsonNode old=JSON.readTree(Files.readString(Path.of("../docs/reports/set-base/sb-16e2/c/draft.json")));
        com.fasterxml.jackson.databind.JsonNode now=JSON.readTree(Files.readString(Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json")));
        for(String key:List.of("characters","decks","rules","set","format"))assertEquals(old.path(key),now.path(key),key);
        int changed=0;
        for(com.fasterxml.jackson.databind.JsonNode card:now.path("cards")) {
            String binding=card.path("binding").asText(); com.fasterxml.jackson.databind.JsonNode before=StarterBalanceMeasureTest.card(old,binding);
            if(card.equals(before))continue;
            changed++; assertTrue(Arrays.asList(CHARGES).contains(binding));
            for(String key:List.of("kind","priority","targets","cost","rarity","target","params"))assertEquals(before.path(key),card.path(key),binding+key);
            for(String key:List.of("name","role","gains","damage","damageAmount"))assertEquals(before.path("gui").path(key),card.path("gui").path(key));
            assertEquals(1,card.path("self").size()); com.fasterxml.jackson.databind.JsonNode search=card.path("self").get(0);
            assertEquals("search",search.path("op").asText());assertEquals(1.5,search.path("vulnerability").path("factor").asDouble());
            Map<String,Integer> gains=new HashMap<>();for(com.fasterxml.jackson.databind.JsonNode step:before.path("self"))
                if(step.path("op").asText().equals("gain"))gains.put(step.path("resource").asText(),step.path("amount").asInt());
            gains.forEach((r,n)->{assertEquals(n,search.path("foundGains").path(r).asInt());
                assertEquals(5*(int)(n/15.0+0.5),search.path("missedGains").path(r).asInt());});
        }
        assertEquals(5,changed);assertEquals(old.path("cards").size(),now.path("cards").size());
    }

    @Test @EnabledIfSystemProperty(named="sim.liveReference",matches=".+")
    void liveBenchOnTheSameHistoricalDraft() throws Exception {
        assertEquals(Ruleset.LIVE,SimulationRunner.selectedRuleset());
        Path root=Path.of(System.getProperty("sim.liveReference"));
        Draft draft=Draft.fromFile(root.resolve("base-draft.json"));
        Map<String,BotPolicy> styles=new LinkedHashMap<>();
        for(String name:List.of("aggressivo","prudente","risorse","com"))styles.put(name,PlaygroundTest.styles().get(name));
        Bench.Report report=Bench.run(draft,new Bench.Settings(2000,7_000_000L,List.of(DECKS),styles,8,BoundCap.Params.DEFAULT,null));
        Files.writeString(root.resolve("final-live.json"),report.json());Files.writeString(root.resolve("final-live.md"),report.markdown());
        assertEquals(0,report.checks.total());
    }
}

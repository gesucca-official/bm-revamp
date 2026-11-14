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

/**
 * D74, one opt-in round: full matrix, paired policy comparison and event-level token damage. SB-16g passo 3 (D80, D82): the arm is
 * chosen with -Dsim.arm=A|B ({@link SetBaseArms}); the turn counters of proposal 1.4 («Giro finale D80») are kept per seat, with the
 * opponent's deck in the key where the matchup matters. They only read the game: the trace test below covers them.
 */
class ChargeMeasureTest {
    static final ThreadLocal<Measured> SOURCE = new ThreadLocal<>();
    static final class Measured extends Character {
        final String key;
        final Counts counts = new Counts();
        final int initialHealth;
        boolean periodic, parried;
        // D80 turn counters, reset at every ROUND_READY. Kinds: 0 opponent, 1 self, 2 periodic, 3 other (timers).
        static final String[] KINDS = {"opponent", "self", "periodic", "timer"};
        final int[] lostBy = new int[4];
        /** POISON received this turn, [0] direct and [1] periodic: nominal, after statuses and armour, health actually lost. */
        final int[][] poison = new int[2][3];
        String lethal; int cut4Dealt; boolean usedLastResort;
        void resetTurn() { Arrays.fill(lostBy, 0); for (int[] p : poison) Arrays.fill(p, 0); lethal = null; cut4Dealt = 0; }
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
            int kind = periodic ? 2 : source == null ? 3 : source == this ? 1 : 0;
            int nominal = d.getAmount(), modified = amount(d, types, false), before = getResources().get(Resource.HEALTH);
            String out = super.takeDamage(d, types);
            int lost = before - getResources().get(Resource.HEALTH);
            lostBy[kind] += lost;
            if (d.getType() == Damage.DamageType.POISON && kind != 1 && kind != 3) {
                int[] p = poison[kind == 2 ? 1 : 0]; p[0] += nominal; p[1] += modified; p[2] += lost;
            }
            if (before > 0 && getResources().get(Resource.HEALTH) <= 0) lethal = KINDS[kind];
            if (kind == 0 && d.getType() == Damage.DamageType.CUT && nominal == 4) source.cut4Dealt += lost;
            return out;
        }
    }

    static final class Observe implements BiConsumer<String, Game> {
        final Map<String, Counts> totals = new TreeMap<>();
        final Map<String, Integer> before = new HashMap<>();
        final Map<String, Card> played = new HashMap<>();
        final Map<String, Integer> tokensAtStart = new HashMap<>();
        final Map<String, Integer> alertAtStart = new HashMap<>();
        final Map<String, int[]> group = new HashMap<>();
        boolean halfTurn, finalHalfTurn;
        final ChargeFrequency frequency=new ChargeFrequency();
        synchronized void merge(Measured c) { totals.computeIfAbsent(c.key,k->new Counts()).merge(c.counts); }
        // A separate instance per running game, used through the ThreadLocal below.
        @Override public void accept(String stage, Game g) {
            if (stage.equals("ROUND_READY")) {
                frequency.ready(g);
                before.clear(); played.clear(); tokensAtStart.clear(); alertAtStart.clear(); group.clear();
                for (Player p:g.getPlayers().values()) {
                    ((Measured)p.getCharacter()).resetTurn();
                    alertAtStart.put(p.getPlayerId(),p.getResources().get(Resource.ALERTNESS));
                    before.put(p.getPlayerId(),p.getResources().get(Resource.HEALTH));
                    tokensAtStart.put(p.getPlayerId(),(int)p.getCharacter().getStatuses().stream().filter(s->s.getExposure()!=null)
                            .map(Status::getExposure).distinct().count());
                }
                for (Move m:g.getPendingMoves()) if(!m.isVoid()) played.put(m.getPlayerId(),g.getCardFromHand(m.getPlayerId(),m.getPlayedCardName()));
                // The speed group as fixed after costs (D50): priority, then ALERTNESS minus the A cost of the card.
                played.forEach((id,card)->group.put(id,new int[]{card.getPriority(),
                        alertAtStart.get(id)-card.getCost().getOrDefault(Resource.ALERTNESS,0)}));
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
                turnCounters(g);
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
        static final Set<String> OFFENSIVE=Set.of("base.gigi.ColpoDiChiaveInglese","base.gigi.UnaStrettaDiProva");

        static String bucket(int a) { return a<=0?"0":a<10?"1-9":a<20?"10-19":a<40?"20-39":"40+"; }

        /** D80 («Giro finale D80», proposal 1.4): half-health and one-turn ends, terminal reasons, Bancone and Beppe's 4 CUT. */
        void turnCounters(Game g) {
            List<Player> seats=new ArrayList<>(g.getPlayers().values());
            boolean over=g.isOver(), draw=over&&g.getWinner().isEmpty();
            int[] ga=group.get(seats.get(0).getPlayerId()), gb=seats.size()>1?group.get(seats.get(1).getPlayerId()):null;
            boolean sameGroup=ga!=null&&gb!=null&&Arrays.equals(ga,gb);
            for(Player p:seats) {
                Measured c=(Measured)p.getCharacter(); String id=p.getPlayerId();
                Player o=seats.stream().filter(x->x!=p).findFirst().orElseThrow();
                String vs="vs/"+((Measured)o.getCharacter()).key.split("\\|")[0]+"/";
                Card mine=played.get(id), theirs=played.get(o.getPlayerId());
                String by=theirs==null?"none":theirs.getBindingName();
                int start=before.get(id), health=p.getResources().get(Resource.HEALTH), lost=start-health;
                boolean token=tokensAtStart.get(id)>0;
                c.counts.add("playerTurns"); if(token)c.counts.add("playerTurnsWithToken");
                for(int k=0;k<4;k++)c.counts.add("lost-"+Measured.KINDS[k],c.lostBy[k]);
                for(int t=0;t<2;t++)for(int v=0;v<3;v++)
                    c.counts.add("poison-"+(t==0?"direct":"periodic")+"-"+new String[]{"nominal","modified","lost"}[v],c.poison[t][v]);
                if(lost*2>=c.initialHealth) {
                    for(String pre:List.of("",vs)) {
                        c.counts.add(pre+"halfTurn"); if(token)c.counts.add(pre+"halfTurn-withToken");
                        if(over)c.counts.add(pre+"halfTurn-endedGame");
                    }
                    for(int k=0;k<4;k++)c.counts.add("halfTurn-lost-"+Measured.KINDS[k],c.lostBy[k]);
                    c.counts.add("halfTurn-by/"+by);
                }
                if(start*2>=c.initialHealth&&health<=0) {
                    for(String pre:List.of("",vs)) {
                        c.counts.add(pre+"oneTurnKO"); c.counts.add(pre+(draw?"oneTurnKO-draw":"oneTurnKO-lost"));
                        if(sameGroup)c.counts.add(pre+"oneTurnKO-sameGroup");
                    }
                    for(int k=0;k<4;k++)c.counts.add("oneTurnKO-lost-"+Measured.KINDS[k],c.lostBy[k]);
                    c.counts.add("oneTurnKO-by/"+by); c.counts.add("oneTurnKO-lethal-"+c.lethal);
                    if(token)c.counts.add("oneTurnKO-withToken");
                }
                if(mine!=null) {
                    if(mine.isLastResort()){c.counts.add("lastResortPlayed");c.usedLastResort=true;}
                    if(mine.getBindingName().equals("base.gigi.SottoIlCofano"))c.counts.add("cofanoPlayed");
                    if(mine.getBindingName().equals(SetBaseArms.BANCONE)) {
                        c.counts.add("bancone-turns");
                        for(int t=0;t<2;t++)for(int v=0;v<3;v++)
                            c.counts.add("bancone-poison-"+(t==0?"direct":"periodic")+"-"+new String[]{"nominal","modified","lost"}[v],c.poison[t][v]);
                        c.counts.add("bancone-lost",lost);
                    }
                    if(OFFENSIVE.contains(mine.getBindingName()))
                        for(Move m:g.getResolvedMoves()) if(m.getPlayerId().equals(id)&&!m.isVoid()&&m.getSearchedFor()!=null) {
                            String pre="charge/"+mine.getBindingName()+"/cut4-"+(m.getSearchFound()!=null?"found":"missed");
                            c.counts.add(pre+"-moves"); c.counts.add(pre+"-lost",c.cut4Dealt);
                        }
                }
                if(over) {
                    c.counts.add("finalA-"+bucket(alertAtStart.get(id)));
                    if(sameGroup)c.counts.add("finalSameGroup");
                    if(c.usedLastResort)c.counts.add("gamesWithLastResort");
                    if(draw) {
                        c.counts.add(vs+"draw-lethal-"+(c.lethal==null?"alive":c.lethal));
                        c.counts.add("draw-lethal-"+(c.lethal==null?"alive":c.lethal));
                        if(sameGroup)c.counts.add("draw-sameGroup");
                    }
                }
            }
        }
    }

    @Test @EnabledIfSystemProperty(named="sim.chargeOut", matches=".+")
    void measure() throws Exception {
        assertEquals(Ruleset.D50,SimulationRunner.selectedRuleset());
        Path out=Path.of(System.getProperty("sim.chargeOut")); Files.createDirectories(out);
        // SB-16g passo 3 (D82): arm A is the draft, arm B the draft with the Bancone of D67; the rest of the bench is the one of step 2.
        String arm=SetBaseArms.selected(); Draft draft=SetBaseArms.arm(arm,Draft.selected()); Map<String,BotPolicy> styles=new LinkedHashMap<>();
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
                Integer.getInteger("sim.threads",8),BoundCap.Params.DEFAULT,"SB-16g 2b3: D82 power, final round, arm "+arm);
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
        Files.writeString(out.resolve("arm.txt"),arm);
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

package com.gsc.bm.model.game;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.*;
import com.gsc.bm.model.cards.bruiser.*;
import com.gsc.bm.model.cards.bruiser.character.*;
import com.gsc.bm.model.cards.junkie.*;
import com.gsc.bm.model.cards.junkie.character.*;
import com.gsc.bm.model.cards.com.*;
import com.gsc.bm.model.cards.com.basic.*;
import com.gsc.bm.model.cards.com.items.*;
import com.gsc.bm.model.cards.com.last.Struggle;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.status.*;
import org.junit.jupiter.api.*;
import java.util.*;
import java.util.stream.Stream;
import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;

/** Small independent lots. Numeric expectations transcribed from R02/R04-R07 v1.3. */
class CatalogEffectsTest {
    private int value(Character c, Resource r) { return c.getResources().getOrDefault(r,0); }
    private void effect(AbstractCard card, Character a, Character b) {
        card.applyEffectOnSelf(a); card.applyEffectOnTarget(a,b);
    }
    private Move move(Game g, Player p, String card, String target, Map<Move.AdditionalAction,String> choices) {
        return new Move(card,p.getPlayerId(),target,g.getGameId(),choices);
    }
    private void round(Game g) { g.resolveMoves(x->{},(n,e)->{}); }
    private Move play(Game g, Player p, AbstractCard card, String target, Map<Move.AdditionalAction,String> choices) {
        named(card,card.getClass().getSimpleName()); p.getCardsInHand().add(card);
        Move m=move(g,p,card.getName(),target,choices); assertTrue(m.isValidFor(g).isValid());
        m.applyCostTo(g); m.applyEffectTo(g); return m;
    }
    private Status modifier(StatusType type, StatusFlow flow, Damage.DamageType damage, float factor) {
        return Status.builder().name("synthetic modifier").type(type).flow(flow).impactedProperty(damage)
            .amountFunction(n->n*factor).build();
    }

    @TestFactory Stream<DynamicTest> lot1_plainAttackEffects() {
        // card, self health, target health, target alertness, target toxicity
        Object[][] cases={
            {new SuperImpact(),100,60,20,0}, {new HealingBlow(),100,70,20,0},
            {new SickeningBlow(),100,90,20,10}, {new StunningBlow(),100,90,10,0},
            {new GoingBerserk(),100,70,20,0}, {new MethDrivenRage(),95,85,20,0},
            {new Cough(),100,100,15,5}, {new Struggle(),95,90,20,0}
        };
        return Arrays.stream(cases).map(row->DynamicTest.dynamicTest(row[0].getClass().getSimpleName(),()->{
            Character a=new BigBadBruiser(), b=new BigBadBruiser();
            effect((AbstractCard)row[0],a,b);
            assertEquals(row[1],value(a,Resource.HEALTH)); assertEquals(row[2],value(b,Resource.HEALTH));
            assertEquals(row[3],value(b,Resource.ALERTNESS)); assertEquals(row[4],value(b,Resource.TOXICITY));
        }));
    }
    @Test void lot1_healingEmptiesBothResourcesWithoutModifiers() {
        Character a=new BigBadBruiser(), b=new BigBadBruiser();
        b.getResources().put(Resource.TOXICITY,-9); b.getResources().put(Resource.ALCOHOL,17);
        b.getStatuses().add(Status.builder().name("resource modifier").type(StatusType.BAD).flow(StatusFlow.INPUT)
            .impactedProperty(Resource.TOXICITY).amountFunction(n->n*2).build());
        effect(new HealingBlow(),a,b);
        assertEquals(70,value(b,Resource.HEALTH)); assertEquals(0,value(b,Resource.TOXICITY)); assertEquals(0,value(b,Resource.ALCOHOL));
    }
    @Test void lot1_extremeUsesResidualViolenceAfterPayment() {
        Player a=player("a"),b=player("b"); a.getResources().put(Resource.VIOLENCE,31);
        play(duel(a,b),a,new ExtremelyViolentBlow(),"b",null);
        assertEquals(11,value(a.getCharacter(),Resource.VIOLENCE)); assertEquals(75,value(b.getCharacter(),Resource.HEALTH));
    }
    @TestFactory Stream<DynamicTest> lot1_boundEffectsDiscardAndPersist() {
        Object[][] cases={
            {new LittleSmack(),25,0,25,100,95,20,0},
            {new LittleRage(),20,0,30,100,100,20,0},
            {new PatheticBlade(),35,15,0,100,95,20,5},
            {new RottenSmile(),40,10,0,100,100,15,0}
        };
        return Arrays.stream(cases).map(row->DynamicTest.dynamicTest(row[0].getClass().getSimpleName(),()->{
            AbstractCard card=(AbstractCard)row[0];
            Character c=card instanceof PatheticBlade || card instanceof RottenSmile ? new ToxicJunkie():new BigBadBruiser();
            Player a=new Player("a",c,named(new BruiserGrab(),"basic"),List.of(),named(new Struggle(),"last"),List.of());
            Player b=player("b"); Card spare=named(new Glare(),"spare"); a.getCardsInHand().add(spare);
            play(duel(a,b),a,card,card instanceof LittleRage?"SELF":"b",Map.of(Move.AdditionalAction.DISCARD_ONE,"spare"));
            assertFalse(a.getCardsInHand().contains(spare)); a.discardCard(card); assertTrue(a.getCardsInHand().contains(card));
            assertEquals(row[1],value(c,Resource.ALERTNESS)); assertEquals(row[2],value(c,Resource.TOXICITY));
            assertEquals(row[3],value(c,Resource.VIOLENCE)); assertEquals(row[4],value(c,Resource.HEALTH));
            assertEquals(row[5],value(b.getCharacter(),Resource.HEALTH)); assertEquals(row[6],value(b.getCharacter(),Resource.ALERTNESS));
            assertEquals(row[7],value(b.getCharacter(),Resource.TOXICITY));
            if(card instanceof LittleRage) {
                c.takeDamage(new Damage(Damage.DamageType.HIT,7)); assertEquals(95,value(c,Resource.HEALTH));
                c.resolveTimeBasedEffects(); assertTrue(c.getStatuses().isEmpty());
            }
        }));
    }
    @Test void lot1_metabolismPositiveOddZeroAndNegativeToxicity() {
        for(int t:new int[]{11,0,-11}) {
            Character c=new ToxicJunkie(); c.getResources().put(Resource.TOXICITY,t);
            new PervertedMetabolism().applyEffectOnSelf(c);
            assertEquals(100+Math.abs(t/2),value(c,Resource.HEALTH)); assertEquals(t-Math.abs(t),value(c,Resource.TOXICITY));
        }
    }

    @Test void lot2_glareAndStoneActualDamageAndExpiry() {
        Character c=new BigBadBruiser(); new Glare().applyEffectOnSelf(c);
        assertEquals(40,value(c,Resource.VIOLENCE)); assertEquals(35,value(c,Resource.ALERTNESS));
        c.takeDamage(new Damage(Damage.DamageType.HIT,5)); assertEquals(93,value(c,Resource.HEALTH));
        c.resolveTimeBasedEffects(); c.takeDamage(new Damage(Damage.DamageType.HIT,5)); assertEquals(86,value(c,Resource.HEALTH));
        c.resolveTimeBasedEffects(); c.takeDamage(new Damage(Damage.DamageType.HIT,5)); assertEquals(81,value(c,Resource.HEALTH));
        new MadeOfStone().applyEffectOnSelf(c); assertEquals(50,value(c,Resource.VIOLENCE));
        for(int i=0;i<4;i++) {
            c.takeDamage(new Damage(Damage.DamageType.CUT,5)); assertEquals(79-2*i,value(c,Resource.HEALTH));
            c.resolveTimeBasedEffects(); assertEquals(i<3?1:0,c.getStatuses().size());
        }
        c.takeDamage(new Damage(Damage.DamageType.CUT,5)); assertEquals(68,value(c,Resource.HEALTH));
    }
    @Test void lot2_seagullFiltersOnlyActorAndBottleConvertsBeforeInput() {
        Character a=new BigBadBruiser(),b=new BigBadBruiser();
        a.getStatuses().add(modifier(StatusType.BAD,StatusFlow.OUTPUT,Damage.DamageType.HIT,4));
        new BrokenBeerBottle().applyEffectOnSelf(a); new MadeOfStone().applyEffectOnSelf(b);
        b.getStatuses().add(modifier(StatusType.BAD,StatusFlow.INPUT,Damage.DamageType.CUT,2));
        new SeagullFly().applyEffectOnTarget(a,b);
        // GOOD OUTPUT: 15 -> 22 CUT; target GOOD INPUT ->11, BAD INPUT ->22.
        assertEquals(78,value(b,Resource.HEALTH));
        a.getStatuses().remove(0);
        a.inflictDamage(b,new Damage(Damage.DamageType.HIT,5)); // same-turn singleUse: 5->7->3->6
        assertEquals(72,value(b,Resource.HEALTH));
        a.resolveTimeBasedEffects(); assertTrue(a.getStatuses().isEmpty());
    }
    @Test void lot2_badEducationRemovesOnlyEquipsBeforeDamage() {
        Character a=new BigBadBruiser(),b=new BigBadBruiser();
        new BrokenBeerBottle().applyEffectOnSelf(b); new Glare().applyEffectOnSelf(b);
        effect(new BadEducation(),a,b);
        assertEquals(85,value(b,Resource.HEALTH)); assertEquals(1,b.getStatuses().size()); assertFalse(b.getStatuses().get(0).isEquip());
    }
    @Test void lot2_badTripThreeTicksIncludingCreationAndNegativeT() {
        Player a=player("a"),b=player("b"); Character c=a.getCharacter();
        c.getImmunities().add(Resource.TOXICITY); c.getResources().put(Resource.TOXICITY,11);
        play(duel(a,b),a,new BadTrip(),"SELF",null);
        assertEquals(10,value(c,Resource.ALERTNESS)); assertEquals(22,value(c,Resource.TOXICITY));
        assertFalse(c.getImmunities().contains(Resource.TOXICITY));
        for(int i=1;i<=3;i++) { c.resolveTimeBasedEffects(); assertEquals(100-11*i,value(c,Resource.HEALTH));
            assertEquals(i==3,c.getImmunities().contains(Resource.TOXICITY)); }
        assertTrue(c.getTimers().isEmpty()); c.resolveTimeBasedEffects(); assertEquals(67,value(c,Resource.HEALTH));
        c.getResources().put(Resource.TOXICITY,-11); new BadTrip().applyEffectOnSelf(c);
        assertEquals(0,value(c,Resource.TOXICITY));
    }
    @TestFactory Stream<DynamicTest> lot2_grabConsumesEveryObjectAndBasicPersists() {
        return Stream.of(new CocktailOnTheGround(),new RottenBeer(),new AnotherRottenBeer(),new MarvelousCocktail(),new BrokenBeerBottle())
            .flatMap(item->Stream.of(new Grab(),new BruiserGrab(),new ToxicGrab()).map(grab->
            DynamicTest.dynamicTest(grab.getClass().getSimpleName()+" / "+item.getClass().getSimpleName(),()->{
                Player a=player("a"),b=player("b"); Character c=a.getCharacter();
                named(item,"item"); c.getItems().add(item);
                play(duel(a,b),a,grab,"SELF",Map.of(Move.AdditionalAction.TARGET_ITEM,"item"));
                assertEquals(grab instanceof ToxicGrab?10:20,value(c,Resource.ALERTNESS));
                assertFalse(c.getItems().contains(item));
                assertEquals(item instanceof CocktailOnTheGround?45:25,value(c,Resource.VIOLENCE));
                int alcohol=item instanceof AnotherRottenBeer?10:item instanceof RottenBeer?5:item instanceof CocktailOnTheGround?15:item instanceof MarvelousCocktail?20:0;
                assertEquals(alcohol,value(c,Resource.ALCOHOL));
                assertEquals(item instanceof CocktailOnTheGround?5:item instanceof MarvelousCocktail?20:0,value(c,Resource.TOXICITY));
                assertEquals(item instanceof BrokenBeerBottle?1:0,c.getStatuses().size());
                assertEquals(item instanceof MarvelousCocktail?Set.of(Resource.TOXICITY,Resource.ALCOHOL):Set.of(),c.getImmunities());
                assertEquals(item instanceof MarvelousCocktail?1:0,c.getTimers().size());
                if(item instanceof AnotherRottenBeer) assertTrue(c.getItems().peek() instanceof BrokenBeerBottle);
                else assertTrue(c.getItems().isEmpty());
                a.discardCard(grab); assertEquals(grab.isBasicAction(),a.getCardsInHand().contains(grab));
            })));
    }
    @Test void lot2_tokenCreationEvictsOldestAndCanBeConsumed() {
        Player a=player("a"),b=player("b"); Character c=a.getCharacter(); c.getItems().add(named(new RottenBeer(),"old"));
        new AnotherRottenBeer().applyEffectOnSelf(c); assertEquals(1,c.getItems().size());
        Card token=c.getItems().peek(); assertTrue(token instanceof BrokenBeerBottle);
        play(duel(a,b),a,new BruiserGrab(),"SELF",Map.of(Move.AdditionalAction.TARGET_ITEM,token.getName()));
        assertTrue(c.getItems().isEmpty()); assertTrue(c.getStatuses().get(0).isEquip());
    }
    @TestFactory Stream<DynamicTest> lot2_drawingObjectsDoesNotActivateThem() {
        return Stream.of(new CocktailOnTheGround(),new RottenBeer(),new AnotherRottenBeer(),new MarvelousCocktail())
            .map(item->DynamicTest.dynamicTest("draw: "+item.getClass().getSimpleName(),()->{
                Player a=player("a"); var before=new EnumMap<Resource,Integer>(a.getResources());
                Card action=named(new Glare(),"drawn action"); named(item,"drawn item");
                a.getDeck().push(action); a.getDeck().push(item); a.drawCard();
                assertEquals(before,a.getResources()); assertEquals(List.of(item),new ArrayList<>(a.getCharacter().getItems()));
                assertTrue(a.getCardsInHand().contains(action)); assertFalse(a.getCardsInHand().contains(item));
                assertTrue(a.getCharacter().getStatuses().isEmpty()); assertTrue(a.getCharacter().getTimers().isEmpty());
                assertTrue(a.getCharacter().getImmunities().isEmpty()); assertTrue(a.getDeck().isEmpty());
            }));
    }
    @Test void lot2_stealSwapAndBeggingRespectCapacityWithoutConsumption() {
        Player a=player("a"); Character junkie=new ToxicJunkie();
        Player b=new Player("b",junkie,named(new ToxicGrab(),"basic"),List.of(),named(new Struggle(),"last"),List.of());
        Card old=named(new RottenBeer(),"old"), one=named(new RottenBeer(),"one"),two=named(new RottenBeer(),"two");
        a.getCharacter().getItems().add(old); junkie.getItems().add(one); junkie.getItems().add(two);
        Game g=duel(a,b); play(g,a,new Steal(),"b",Map.of(Move.AdditionalAction.TARGET_ITEM,"one"));
        assertEquals(List.of(one),new ArrayList<>(a.getCharacter().getItems())); assertEquals(List.of(two),new ArrayList<>(junkie.getItems()));
        assertEquals(10,value(a.getCharacter(),Resource.ALERTNESS)); assertEquals(0,value(a.getCharacter(),Resource.ALCOHOL));
        junkie.getItems().add(old); new ShuffleFeet().applyEffectOnTarget(a.getCharacter(),junkie);
        assertEquals(List.of(old),new ArrayList<>(a.getCharacter().getItems())); assertEquals(List.of(one),new ArrayList<>(junkie.getItems()));
        a.getResources().put(Resource.TOXICITY,25); play(g,a,new BeggingMoney(),"b",null);
        assertEquals(List.of(one),new ArrayList<>(a.getCharacter().getItems())); assertEquals(List.of(one),new ArrayList<>(junkie.getItems()));
        assertEquals(25,value(junkie,Resource.ALERTNESS)); assertEquals(0,value(a.getCharacter(),Resource.TOXICITY));
        junkie.getItems().clear(); new BeggingMoney().resolve(g,move(g,a,"unused","b",null));
        assertEquals(15,value(junkie,Resource.ALERTNESS)); assertEquals(List.of(one),new ArrayList<>(a.getCharacter().getItems()));
    }

    @TestFactory Stream<DynamicTest> lot3_missingItemAtResolutionKeepsCostsAndExtraEffects() {
        return Stream.of(new Grab(),new BruiserGrab(),new ToxicGrab(),new EverythingIsDrug(),new Steal(),new BreakYourToy())
            .map(card->DynamicTest.dynamicTest(card.getClass().getSimpleName(),()->{
                Player a=player("a"),b=player("b"); Game g=duel(a,b);
                boolean far=card.getCanTarget().contains(Card.CardTarget.FAR_ITEM);
                Character owner=far?b.getCharacter():a.getCharacter(); owner.getItems().add(named(new CocktailOnTheGround(),"item"));
                named(card,"played"); a.getCardsInHand().add(card);
                Move m=move(g,a,"played",far?"b":"SELF",Map.of(Move.AdditionalAction.TARGET_ITEM,"item"));
                assertTrue(m.isValidFor(g).isValid()); g.submitMove(m); g.submitMove(Move.voidMove("b"));
                owner.getItems().clear(); round(g);
                assertEquals(card instanceof Steal || card instanceof ToxicGrab?10:20,value(a.getCharacter(),Resource.ALERTNESS));
                assertEquals(card instanceof BreakYourToy?15:25,value(a.getCharacter(),Resource.VIOLENCE));
                assertEquals(card instanceof EverythingIsDrug?20:0,value(a.getCharacter(),Resource.TOXICITY));
                assertEquals(card instanceof EverythingIsDrug?90:100,value(a.getCharacter(),Resource.HEALTH)); // R06 poison
                assertEquals(0,value(a.getCharacter(),Resource.ALCOHOL)); assertTrue(owner.getItems().isEmpty());
                assertEquals(card.isBasicAction(),a.getCardsInHand().contains(card));
            }));
    }
    @Test void lot3_destroyAndDrugConsumeWithoutItemEffects() {
        Player a=player("a"),b=player("b"); Game g=duel(a,b);
        b.getCharacter().getItems().add(named(new MarvelousCocktail(),"item"));
        play(g,a,new BreakYourToy(),"b",Map.of(Move.AdditionalAction.TARGET_ITEM,"item"));
        assertTrue(b.getCharacter().getItems().isEmpty()); assertTrue(b.getCharacter().getTimers().isEmpty());
        a.getCharacter().getItems().add(named(new MarvelousCocktail(),"item"));
        play(g,a,new EverythingIsDrug(),"SELF",Map.of(Move.AdditionalAction.TARGET_ITEM,"item"));
        assertTrue(a.getCharacter().getItems().isEmpty()); assertTrue(a.getCharacter().getTimers().isEmpty());
        assertTrue(a.getCharacter().getImmunities().isEmpty()); assertEquals(20,value(a.getCharacter(),Resource.TOXICITY));
        assertEquals(0,value(a.getCharacter(),Resource.ALCOHOL));
    }
    @Test void lot3_whatchaCopiesTargetOnlyAfterBothCosts() {
        Player a=player("a"),b=player("b"); a.getCardsInHand().add(named(new WhatchaDoin(),"copy"));
        b.getResources().put(Resource.TOXICITY,10); b.getCardsInHand().add(named(new MethDrivenRage(),"rage"));
        Game g=duel(a,b); g.submitMove(move(g,a,"copy","b",null)); g.submitMove(move(g,b,"rage","a",null)); round(g);
        assertEquals(100,value(a.getCharacter(),Resource.HEALTH)); assertEquals(83,value(b.getCharacter(),Resource.HEALTH)); //15 HIT +2 poison
        assertEquals(15,value(a.getCharacter(),Resource.VIOLENCE)); assertEquals(10,value(a.getCharacter(),Resource.ALERTNESS));
        assertEquals(5,value(b.getCharacter(),Resource.TOXICITY)); assertTrue(g.getResolvedMoves().get(1).isVoid());
    }
    @Test void lot3_countersDoNotCancelEarlierMoves() {
        for(AbstractCard card:List.of(new YouStop(),new WhatchaDoin())) {
            Player a=new Player("a",new ToxicJunkie(),named(new ToxicGrab(),"basic"),List.of(),named(new Struggle(),"last"),List.of()),b=player("b");
            a.getResources().put(Resource.ALERTNESS,50); a.getCardsInHand().add(named(new RottenSmile(),"early"));
            a.getCardsInHand().add(named(new Glare(),"spare")); b.getCardsInHand().add(named(card,"late"));
            Game g=duel(a,b); g.submitMove(move(g,a,"early","b",Map.of(Move.AdditionalAction.DISCARD_ONE,"spare")));
            g.submitMove(move(g,b,"late","a",null)); round(g);
            assertFalse(g.getResolvedMoves().get(0).isVoid()); assertEquals(55,value(a.getCharacter(),Resource.ALERTNESS));
            assertEquals(card instanceof WhatchaDoin?5:15,value(b.getCharacter(),Resource.ALERTNESS));
        }
    }
    @Test void lot3_reflexesMultipleOpponentsAndOtherTargets() {
        Player a=player("a"),b=player("b"),c=player("c"),d=player("d"); a.getResources().put(Resource.TOXICITY,10);
        a.getCardsInHand().add(named(new AmphetamineReflexes(),"reflex"));
        Game g=new Game(List.of(a,b,c,d),"synthetic ffa",false);
        g.submitMove(move(g,a,"reflex","SELF",null)); g.submitMove(move(g,b,"last-resort","a",null));
        g.submitMove(move(g,c,"last-resort","a",null)); g.submitMove(move(g,d,"last-resort","b",null)); round(g);
        assertEquals(100,value(a.getCharacter(),Resource.HEALTH)); assertEquals(90,value(b.getCharacter(),Resource.HEALTH));
        assertEquals(100,value(c.getCharacter(),Resource.HEALTH)); assertEquals(95,value(d.getCharacter(),Resource.HEALTH));
        assertEquals(2,g.getResolvedMoves().stream().filter(Move::isVoid).count()); assertEquals(20,value(a.getCharacter(),Resource.ALERTNESS));
    }
    @Test void lot3_reflexesIgnoresEarlierMoveAndOpponentSelfTarget() {
        Player a=player("a"),c=player("c"),d=player("d");
        Player b=new Player("b",new ToxicJunkie(),named(new ToxicGrab(),"basic"),List.of(),named(new Struggle(),"last"),List.of());
        a.getResources().put(Resource.TOXICITY,10); a.getCardsInHand().add(named(new AmphetamineReflexes(),"reflex"));
        b.getCardsInHand().add(named(new RottenSmile(),"early")); b.getCardsInHand().add(named(new Glare(),"spare"));
        c.getCardsInHand().add(named(new Glare(),"spare"));
        Game g=new Game(List.of(a,b,c,d),"counter boundaries",false);
        g.submitMove(move(g,a,"reflex","SELF",null)); g.submitMove(move(g,b,"early","a",Map.of(Move.AdditionalAction.DISCARD_ONE,"spare")));
        g.submitMove(move(g,c,"bound-two","SELF",Map.of(Move.AdditionalAction.DISCARD_ONE,"spare")));
        g.submitMove(move(g,d,"last-resort","a",null)); round(g);
        assertEquals("b",g.getResolvedMoves().get(0).getPlayerId());
        assertEquals(1,g.getResolvedMoves().stream().filter(Move::isVoid).count());
        assertTrue(g.getResolvedMoves().stream().filter(m->m.getPlayerId().equals("d")).findFirst().orElseThrow().isVoid());
        assertEquals(15,value(a.getCharacter(),Resource.ALERTNESS)); assertEquals(100,value(a.getCharacter(),Resource.HEALTH));
        assertEquals(30,value(c.getCharacter(),Resource.VIOLENCE));
    }
    @Test void lot3_deadPhaseSkippedButPhaseStartedAliveFinishes() {
        Player a=player("a"),b=player("b"),c=player("c");
        a.getResources().put(Resource.HEALTH,0); a.getResources().put(Resource.ALCOHOL,10);
        a.getCharacter().getTimers().add(new Timer("dead",x->fail("dead timer"),1)); new MadeOfStone().applyEffectOnSelf(a.getCharacter());
        b.getResources().put(Resource.HEALTH,1); b.getResources().put(Resource.TOXICITY,10); b.getResources().put(Resource.ALCOHOL,4);
        b.getCharacter().getTimers().add(new Timer("alive phase",x->x.gainResource(Resource.VIOLENCE,7),1));
        Game g=new Game(List.of(a,b,c),"phase fixture",false); g.submitMove(Move.voidMove("b")); g.submitMove(Move.voidMove("c")); round(g);
        assertEquals(3,a.getCharacter().getStatuses().get(0).getLastsForTurns()); assertEquals(1,a.getCharacter().getTimers().iterator().next().getTimer());
        assertEquals(10,value(a.getCharacter(),Resource.ALCOHOL)); assertEquals(-4,value(b.getCharacter(),Resource.HEALTH));
        assertEquals(18,value(b.getCharacter(),Resource.ALERTNESS)); assertEquals(1,value(b.getCharacter(),Resource.ALCOHOL));
        assertEquals(32,value(b.getCharacter(),Resource.VIOLENCE)); assertTrue(b.getCharacter().getTimers().isEmpty());
    }
    @TestFactory Stream<DynamicTest> lot3_costAvailabilitySubmitAndPayment() throws Exception {
        // Independently maintained normative table, checked against R07 by check-rules.py.
        var reader=new java.io.BufferedReader(new java.io.InputStreamReader(
            Objects.requireNonNull(getClass().getResourceAsStream("/rules-v1-cards.tsv")),java.nio.charset.StandardCharsets.UTF_8));
        List<String> lines; try(reader) { lines=reader.lines().collect(java.util.stream.Collectors.toList()); }
        assertEquals(33,lines.size());
        return lines.stream().map(line->DynamicTest.dynamicTest("payment: "+line.split("\t")[0],()->{
            String[] f=line.split("\t",-1); AbstractCard card=(AbstractCard)Class.forName("com.gsc.bm.model.cards."+f[0]).getDeclaredConstructor().newInstance();
            Map<Resource,Integer> costs=new EnumMap<>(Resource.class);
            if(!f[3].isEmpty()) for(String pair:f[3].split(",")) { String[] bits=pair.split("="); costs.put(Resource.valueOf(bits[0]),Integer.valueOf(bits[1])); }
            Character character=card.getBoundToCharacter()!=null && card.getBoundToCharacter().contains("ToxicJunkie")?new ToxicJunkie():new BigBadBruiser();
            Player a=new Player("a",character,named(new BruiserGrab(),"basic"),List.of(),named(new Struggle(),"last"),List.of()),b=player("b");
            for(Resource r:Resource.values()) a.getResources().put(r,50);
            named(card,"paid"); a.getCardsInHand().add(card); a.getCardsInHand().add(named(new Glare(),"spare"));
            a.getCharacter().getItems().add(named(new RottenBeer(),"item")); b.getCharacter().getItems().add(named(new RottenBeer(),"item"));
            String target=f[2].equals("SELF") || f[2].equals("NEAR_ITEM")?"SELF":"b";
            Game g=duel(a,b); Move m=move(g,a,"paid",target,Map.of(Move.AdditionalAction.DISCARD_ONE,"spare",Move.AdditionalAction.TARGET_ITEM,"item"));
            for(var cost:costs.entrySet()) { a.getResources().put(cost.getKey(),cost.getValue()-1); assertFalse(m.isValidFor(g).isValid()); a.getResources().put(cost.getKey(),50); }
            g.submitMove(m); for(Resource r:Resource.values()) assertEquals(50,value(character,r),"submit does not pay");
            m.applyCostTo(g); for(Resource r:Resource.values()) assertEquals(50-costs.getOrDefault(r,0),value(character,r));
        }));
    }
    @Test void lot3_boundRejectsEveryForbiddenDiscardWithoutMutation() {
        Player a=player("a"),b=player("b"); Game g=duel(a,b);
        for(String discard:List.of("basic","bound-one","bound-two","last-resort","absent")) {
            Move m=move(g,a,"bound-one","b",Map.of(Move.AdditionalAction.DISCARD_ONE,discard));
            assertFalse(m.isValidFor(g).isValid()); assertThrows(IllegalMoveException.class,()->g.submitMove(m));
            assertEquals(4,a.getCardsInHand().size()); assertTrue(g.getPendingMoves().isEmpty());
        }
        assertFalse(move(g,a,"bound-one","b",null).isValidFor(g).isValid());
        assertEquals(100,value(b.getCharacter(),Resource.HEALTH));
    }
    @Test void lot3_damageTypesAndSelfDamageTraverseBothFlows() {
        for(AbstractCard card:List.of(new LittleSmack(),new SuperImpact(),new HealingBlow(),new SickeningBlow(),
            new StunningBlow(),new GoingBerserk(),new MethDrivenRage(),new Struggle(),new ExtremelyViolentBlow(),new SeagullFly())) {
            Character a=new BigBadBruiser(),b=new BigBadBruiser();
            b.getStatuses().add(modifier(StatusType.GOOD,StatusFlow.INPUT,Damage.DamageType.HIT,0));
            card.applyEffectOnTarget(a,b); assertEquals(100,value(b,Resource.HEALTH),card.getClass().getSimpleName()+" must deal HIT");
        }
        Character a=new ToxicJunkie(),b=new BigBadBruiser();
        b.getStatuses().add(modifier(StatusType.GOOD,StatusFlow.INPUT,Damage.DamageType.HIT,0));
        new PatheticBlade().applyEffectOnTarget(a,b); assertEquals(95,value(b,Resource.HEALTH));
        a.getStatuses().add(modifier(StatusType.GOOD,StatusFlow.OUTPUT,Damage.DamageType.HIT,2));
        a.getStatuses().add(modifier(StatusType.GOOD,StatusFlow.INPUT,Damage.DamageType.HIT,.5f));
        new MethDrivenRage().applyEffectOnSelf(a); assertEquals(95,value(a,Resource.HEALTH));
        a.getImmunities().add(Resource.TOXICITY); a.takeDamage(new Damage(Damage.DamageType.POISON,7));
        assertEquals(88,value(a,Resource.HEALTH)); // resource immunity does not protect against direct POISON
    }
}

package com.gsc.bm.model.game;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.*;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.junkie.*;
import com.gsc.bm.model.cards.junkie.character.ToxicJunkie;
import com.gsc.bm.model.cards.com.*;
import com.gsc.bm.model.cards.com.items.*;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.status.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;

/** Normative regression scenarios for docs/game-rules.md v1.1; no Spring/DB. */
class RulesConformanceTest {
    private Move move(Game g, Player p, String card, String target, Map<Move.AdditionalAction,String> choices) {
        return new Move(card, p.getPlayerId(), target, g.getGameId(), choices);
    }
    private void round(Game g) { g.resolveMoves(x -> {}, (n, events) -> {}); }
    private Status status(Object property, float factor, Integer duration, boolean once) {
        return Status.builder().name("rule fixture").type(StatusType.GOOD).flow(StatusFlow.INPUT)
            .impactedProperty((com.gsc.bm.model.Statistic) property).amountFunction(n -> n * factor)
            .lastsForTurns(duration).singleUse(once).build();
    }
    // Controlled actions expose ordering through the real Game pipeline.
    private AbstractCard action(String name, int priority, int alertnessCost, List<String> order) {
        return named(new AbstractCard() {
            { setPriority(priority); setCost(Map.of(Resource.ALERTNESS, alertnessCost)); setCanTarget(Set.of(Card.CardTarget.OPPONENT)); }
            public void applyOtherUnfathomableLogic(Game g, Move m) { order.add(name); }
            public List<String> applyEffectOnSelf(Character c) { return null; }
            public List<String> applyEffectOnTarget(Character c, Character t) { return null; }
        }, name);
    }
    @Test void r01_initialCharacters() {
        Character b = new BigBadBruiser(), j = new ToxicJunkie();
        assertEquals(Map.of(Resource.HEALTH,100,Resource.ALERTNESS,20,Resource.VIOLENCE,25), b.getResources());
        assertEquals(Map.of(Resource.HEALTH,100,Resource.ALERTNESS,35,Resource.TOXICITY,10), j.getResources());
        assertEquals(1,b.getItemsSize()); assertEquals(3,j.getItemsSize());
        assertTrue(b.getImmunities().isEmpty()); assertEquals(Set.of(Resource.TOXICITY),j.getImmunities());
    }
    @Test void r04_priorityBeatsAlertness() {
        Player a=player("a"), b=player("b"); List<String> order=new ArrayList<>();
        a.getResources().put(Resource.ALERTNESS,1); b.getResources().put(Resource.ALERTNESS,100);
        a.getCardsInHand().add(action("fast",2,0,order)); b.getCardsInHand().add(action("slow",1,0,order));
        Game g=duel(a,b); g.submitMove(move(g,b,"slow","a",null)); g.submitMove(move(g,a,"fast","b",null)); round(g);
        assertEquals(List.of("fast","slow"),order);
    }
    @Test void r04_alertnessIsMeasuredAfterAllCosts() {
        Player a=player("a"), b=player("b"); List<String> order=new ArrayList<>();
        a.getResources().put(Resource.ALERTNESS,25);
        a.getCardsInHand().add(action("paid",1,10,order)); b.getCardsInHand().add(action("free",1,0,order));
        Game g=duel(a,b); g.submitMove(move(g,a,"paid","b",null)); g.submitMove(move(g,b,"free","a",null)); round(g);
        assertEquals(List.of("free","paid"),order);
    }
    @Test void r04_exactTieUsesPlayerInsertionOrder() {
        Player a=player("a"), b=player("b"); List<String> order=new ArrayList<>();
        a.getCardsInHand().add(action("first",1,0,order)); b.getCardsInHand().add(action("second",1,0,order));
        Game g=duel(a,b); g.submitMove(move(g,b,"second","a",null)); g.submitMove(move(g,a,"first","b",null)); round(g);
        assertEquals(List.of("first","second"),order);
    }
    @Test void r04_counterStillPaysAndDiscards() {
        Player a=player("a"), b=player("b");
        a.getCardsInHand().add(named(new YouStop(),"stop")); Card impact=named(new SuperImpact(),"impact"); b.getCardsInHand().add(impact);
        Game g=duel(a,b); g.submitMove(move(g,a,"stop","b",null)); g.submitMove(move(g,b,"impact","a",null)); round(g);
        assertEquals(100,a.getResources().get(Resource.HEALTH)); assertEquals(0,b.getResources().get(Resource.VIOLENCE));
        assertEquals(30,b.getResources().get(Resource.ALERTNESS)); assertFalse(b.getCardsInHand().contains(impact));
        assertTrue(g.getResolvedMoves().get(1).isVoid());
    }
    @Test void r04_counteredBoundKeepsAdditionalDiscard() {
        Player a=player("a"), b=player("b");
        a.getCardsInHand().add(named(new YouStop(),"stop")); Card spare=named(new SuperImpact(),"spare"); b.getCardsInHand().add(spare);
        Game g=duel(a,b); g.submitMove(move(g,a,"stop","b",null));
        g.submitMove(move(g,b,"bound-one","a",Map.of(Move.AdditionalAction.DISCARD_ONE,"spare"))); round(g);
        assertTrue(b.getCardsInHand().contains(spare)); assertEquals(100,a.getResources().get(Resource.HEALTH));
    }
    @Test void r02_boundDiscardsAndOnlyDrawsOne() {
        Player a=player("a"), b=player("b"); Card spare=named(new SuperImpact(),"spare"), draw=named(new Glare(),"draw");
        a.getCardsInHand().add(spare); a.getDeck().push(named(new Glare(),"still-in-deck")); a.getDeck().push(draw);
        Game g=duel(a,b); g.submitMove(move(g,a,"bound-one","b",Map.of(Move.AdditionalAction.DISCARD_ONE,"spare")));
        g.submitMove(move(g,b,"last-resort","a",null)); round(g);
        assertFalse(a.getCardsInHand().contains(spare)); assertTrue(a.getCardsInHand().contains(draw));
        assertEquals(1,a.getDeckSize()); assertEquals(5,a.getCardsInHand().size());
    }
    @Test void r04_deadActorStillActsAndMutualDeathIsDraw() {
        Player a=player("a"), b=player("b"); a.getResources().put(Resource.HEALTH,10); b.getResources().put(Resource.HEALTH,10);
        Game g=duel(a,b); g.submitMove(move(g,a,"last-resort","b",null)); g.submitMove(move(g,b,"last-resort","a",null)); round(g);
        assertEquals(-5,a.getResources().get(Resource.HEALTH)); assertEquals(-5,b.getResources().get(Resource.HEALTH));
        assertTrue(g.isOver()); assertTrue(g.getWinner().isEmpty()); assertEquals(2,g.getResolvedMoves().size());
    }
    @Test void r06_zeroHealthIsDeadAndSurvivorWins() {
        Player a=player("a"), b=player("b"); Game g=duel(a,b);
        assertFalse(g.isOver()); a.getResources().put(Resource.HEALTH,0);
        assertTrue(a.getCharacter().isDead()); assertTrue(g.isOver()); assertEquals(Optional.of("b"),g.getWinner());
    }
    @Test void r06_poisonAlcoholAndTimerOrder() {
        Character c=new BigBadBruiser(); c.getResources().put(Resource.TOXICITY,5); c.getResources().put(Resource.ALCOHOL,5);
        c.getTimers().add(new Timer("immunity after poison", x -> x.getImmunities().add(Resource.TOXICITY),1));
        c.resolveTimeBasedEffects();
        assertEquals(98,c.getResources().get(Resource.HEALTH)); assertEquals(18,c.getResources().get(Resource.ALERTNESS));
        assertEquals(2,c.getResources().get(Resource.ALCOHOL)); assertEquals(5,c.getResources().get(Resource.TOXICITY));
        assertTrue(c.getTimers().isEmpty()); c.resolveTimeBasedEffects(); assertEquals(98,c.getResources().get(Resource.HEALTH));
    }
    @Test void r05_durationZeroOneAndSingleUse() {
        Character c=new BigBadBruiser();
        Status one=status(Damage.DamageType.HIT,.5f,1,false); c.getStatuses().add(one);
        c.resolveTimeBasedEffects(); assertTrue(c.getStatuses().contains(one)); c.resolveTimeBasedEffects(); assertTrue(c.getStatuses().isEmpty());
        c.getStatuses().add(status(Damage.DamageType.HIT,.5f,null,true));
        c.takeDamage(new Damage(Damage.DamageType.HIT,5)); c.takeDamage(new Damage(Damage.DamageType.HIT,5));
        assertEquals(96,c.getResources().get(Resource.HEALTH)); c.resolveTimeBasedEffects(); assertTrue(c.getStatuses().isEmpty());
    }
    @Test void r05_damageStacksButResourceUsesFirstMatch() {
        Character c=new BigBadBruiser(); c.getStatuses().add(status(Damage.DamageType.HIT,.5f,null,false));
        c.getStatuses().add(status(Damage.DamageType.HIT,.5f,null,false)); c.takeDamage(new Damage(Damage.DamageType.HIT,11));
        assertEquals(98,c.getResources().get(Resource.HEALTH));
        c.getStatuses().add(status(Resource.ALERTNESS,2,null,false)); c.getStatuses().add(status(Resource.ALERTNESS,3,null,false));
        c.gainResource(Resource.ALERTNESS,5); assertEquals(30,c.getResources().get(Resource.ALERTNESS));
    }
    @Test void r05_negativeAmountsAndUnboundedResources() {
        Character c=new BigBadBruiser(); c.gainResource(Resource.HEALTH,-10); c.loseResource(Resource.ALERTNESS,-30);
        assertEquals(110,c.getResources().get(Resource.HEALTH)); assertEquals(-10,c.getResources().get(Resource.ALERTNESS));
        assertEquals(Status.ALL,Status.invertViewPoint(Set.of(StatusType.GOOD)));
        assertEquals(Status.ALL,Status.invertViewPoint(Set.of()));
    }
    @Test void r07_cantFeelAnythingUsesPoint35AndAddsAlertness() {
        Character c=new BigBadBruiser(); new CantFeelAnything().applyEffectOnSelf(c); c.takeDamage(new Damage(Damage.DamageType.HIT,10));
        assertEquals(97,c.getResources().get(Resource.HEALTH)); assertEquals(30,c.getResources().get(Resource.ALERTNESS));
        c.resolveTimeBasedEffects(); assertTrue(c.getStatuses().isEmpty());
    }
    @Test void r07_goingBerserkOnlyCostsAlcohol() {
        assertEquals(Map.of(Resource.ALCOHOL,10),new GoingBerserk().getCost());
    }
    @Test void r07_heroinBelowAtAndAboveThirty() {
        for(int t : new int[]{10,30,40}) {
            Character c=new ToxicJunkie(); c.getResources().put(Resource.TOXICITY,t); new LethalHeroinDose().applyEffectOnSelf(c);
            assertEquals(t+Math.abs(t-30),c.getResources().get(Resource.TOXICITY));
            assertEquals(t>=30?100-t:100,c.getResources().get(Resource.HEALTH));
        }
    }
    @Test void r07_rottenBeerViaGrabDoesNotEquip() {
        Player a=player("a"); a.getCharacter().getItems().add(named(new RottenBeer(),"beer")); Game g=duel(a,player("b"));
        Move m=move(g,a,"basic","SELF",Map.of(Move.AdditionalAction.TARGET_ITEM,"beer")); m.applyEffectTo(g);
        assertTrue(a.getCharacter().getItems().isEmpty()); assertTrue(a.getCharacter().getStatuses().isEmpty());
        assertEquals(5,a.getResources().get(Resource.ALCOHOL));
    }
    @Test void r07_beggingCopiesWithoutTakingOrSobering() {
        Player a=player("a"), b=player("b"); Card beer=named(new RottenBeer(),"beer"); b.getCharacter().getItems().add(beer);
        a.getResources().put(Resource.ALCOHOL,8); Game g=duel(a,b); BeggingMoney card=new BeggingMoney();
        Move m=move(g,a,"unused","b",null); card.resolve(g,m);
        assertSame(beer,a.getCharacter().getItems().peek()); assertSame(beer,b.getCharacter().getItems().peek());
        assertEquals(8,a.getResources().get(Resource.ALCOHOL)); assertEquals(10,b.getResources().get(Resource.ALERTNESS));
    }
    @Test void r07_toxicDrainRestoresImmunityToActorOnly() {
        Player a=player("a"), b=player("b"); a.getResources().put(Resource.TOXICITY,30); b.getCharacter().getImmunities().add(Resource.TOXICITY);
        a.getCardsInHand().add(named(new ToxicBloodDrain(),"drain")); Game g=duel(a,b); Move m=move(g,a,"drain","b",null);
        m.applyCostTo(g); m.applyEffectTo(g);
        assertEquals(0,a.getResources().get(Resource.TOXICITY)); assertEquals(20,b.getResources().get(Resource.TOXICITY));
        assertFalse(b.getCharacter().getImmunities().contains(Resource.TOXICITY)); a.getCharacter().resolveTimeBasedEffects();
        assertTrue(a.getCharacter().getImmunities().contains(Resource.TOXICITY)); assertFalse(b.getCharacter().getImmunities().contains(Resource.TOXICITY));
    }
    @Test void r07_amphetamineCountersWithoutAlertnessGain() {
        Player a=player("a"), b=player("b"); a.getResources().put(Resource.TOXICITY,10); a.getCardsInHand().add(named(new AmphetamineReflexes(),"reflex"));
        Game g=duel(a,b); g.submitMove(move(g,b,"last-resort","a",null)); g.submitMove(move(g,a,"reflex","SELF",null)); round(g);
        assertEquals(100,a.getResources().get(Resource.HEALTH)); assertEquals(20,a.getResources().get(Resource.ALERTNESS));
    }
    @Test void r07_marvelousCocktailExpiresOnFifthTick() {
        Character c=new BigBadBruiser(); new MarvelousCocktail().applyEffectOnSelf(c);
        c.getStatuses().add(status(Damage.DamageType.HIT,.5f,null,false));
        for(int i=0;i<4;i++) c.resolveTimeBasedEffects(); assertEquals(100,c.getResources().get(Resource.HEALTH));
        c.resolveTimeBasedEffects(); assertEquals(80,c.getResources().get(Resource.HEALTH));
        assertTrue(c.getStatuses().isEmpty()); assertTrue(c.getImmunities().isEmpty()); assertTrue(c.getTimers().isEmpty());
    }
    @Test void r05_statesHaveIndependentIdentityAcrossCharacters() {
        Character a=new BigBadBruiser(), b=new BigBadBruiser();
        new MadeOfStone().applyEffectOnSelf(a); new MadeOfStone().applyEffectOnSelf(b);
        assertNotSame(a.getStatuses().get(0),b.getStatuses().get(0));
        a.getStatuses().clear(); b.getStatuses().clear();
        new BrokenBeerBottle().applyEffectOnSelf(a); new BrokenBeerBottle().applyEffectOnSelf(b);
        assertNotSame(a.getStatuses().get(0),b.getStatuses().get(0));
    }
}

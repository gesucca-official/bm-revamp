package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.game.bot.*;
import com.gsc.bm.model.game.status.Status;
import java.util.*;

/** D79 bench diagnostics only. Hidden hand/deck checks never reach a bot or change its random stream. */
final class ChargeFrequency {
    static final String[][] PAIRS = {
        {"bruiser.Glare", "bruiser.SuperImpact"},
        {"base.bruiser.TiFaccioSpazio", "bruiser.ExtremelyViolentBlow"},
        {"base.mara.Slalom", "base.mara.Sgommata"},
        {"base.mara.TiStringoLaCurva", "base.mara.CinghiataDiTraverso"},
        {"junkie.MethDrivenRage", "junkie.Cough"},
        {"base.tossico.UnAssaggino", "junkie.ToxicBloodDrain"},
        {"base.pino.OffroIo", "base.pino.GoingBerserk"},
        {"base.pino.PrimaIlBrindisi", "base.pino.RuttoADistanzaSociale"},
        {"base.gigi.ColpoDiChiaveInglese", "base.gigi.ChiaveDaTredici"},
        {"base.gigi.UnaStrettaDiProva", "base.gigi.LavoroFattoBene"}
    };
    static String hit(String binding) {
        for (String[] pair : PAIRS) if (pair[0].equals(binding)) return pair[1];
        return null;
    }
    static boolean isHit(String binding) {
        for (String[] pair : PAIRS) if (pair[1].equals(binding)) return true;
        return false;
    }
    static final class Found {
        final Card card;
        final String prefix;
        final int nextTurn;
        boolean hadLegal;
        Found(Card card, String prefix, int nextTurn) { this.card=card; this.prefix=prefix; this.nextTurn=nextTurn; }
    }
    static final class Token {
        final int id, born;
        final String name, prefix;
        Integer absentSince;
        Token(int id, int born, String name, String prefix) {this.id=id;this.born=born;this.name=name;this.prefix=prefix;}
    }
    static final class Seat {
        final Set<Card> seen=Collections.newSetFromMap(new IdentityHashMap<>());
        final List<Found> found=new ArrayList<>();
        final List<Token> tokens=new ArrayList<>();
        Card played;
        String searchPrefix;
        boolean hitInHand, hitInDeck;
        Card fallbackHit;
        String fallbackPrefix;
        int announcements;
    }
    final Map<String,Seat> seats=new HashMap<>();
    void ready(Game g) {
        for(Player p:g.getPlayers().values()) {
            Seat s=seats.computeIfAbsent(p.getPlayerId(),k->new Seat());
            ChargeMeasureTest.Measured c=(ChargeMeasureTest.Measured)p.getCharacter();
            c.parried=false;
            s.played=null;s.searchPrefix=null;
            for(Move m:g.getPendingMoves()) if(m.getPlayerId().equals(p.getPlayerId())&&!m.isVoid())
                s.played=g.getCardFromHand(p.getPlayerId(),m.getPlayedCardName());
            if(s.fallbackHit!=null) {
                String pre=s.fallbackPrefix;
                c.counts.add(pre+"fallbackHeldHitNextTurn");
                if(BotView.of(g,p.getPlayerId()).legalMoves().stream().anyMatch(m->m.getCard().getName().equals(s.fallbackHit.getName())))
                    c.counts.add(pre+"fallbackHeldHitPlayable");
                if(s.played!=null&&s.played.getName().equals(s.fallbackHit.getName()))c.counts.add(pre+"fallbackHeldHitChosen");
                s.fallbackHit=null;
            }
            for(Card card:p.getCardsInHand()) if(hit(card.getBindingName())!=null) {
                String pre="charge/"+card.getBindingName()+"/";
                if(s.seen.add(card))c.counts.add(pre+"seenCopies");
                c.counts.add(pre+"handTurns");
                if(card!=s.played)c.counts.add(pre+"unchosenHandTurns");
            }
            if(s.played!=null && hit(s.played.getBindingName())!=null) {
                s.searchPrefix="charge/"+s.played.getBindingName()+"/";
                String target=hit(s.played.getBindingName());
                s.hitInHand=p.getCardsInHand().stream().anyMatch(x->target.equals(x.getBindingName()));
                s.hitInDeck=p.getDeck().stream().anyMatch(x->target.equals(x.getBindingName()));
                c.counts.add(s.searchPrefix+"played");
                c.counts.add(s.searchPrefix+(s.hitInHand?"targetInHand":"targetNotInHand"));
            }
            Set<String> legal=null;
            for(Found f:s.found) if(p.holds(f.card)) {
                if(legal==null) {legal=new HashSet<>();for(LegalMove m:BotView.of(g,p.getPlayerId()).legalMoves())legal.add(m.getCard().getName());}
                boolean payable=legal.contains(f.card.getName());
                if(g.getTurn()==f.nextTurn) {
                    c.counts.add(f.prefix+"nextTurnObserved");
                    for(Resource r:Resource.values())c.counts.add(f.prefix+"nextResource-"+r,p.getResources().get(r));
                }
                if(!payable)c.counts.add(f.prefix+"unplayableTurns");
                if(payable&&!f.hadLegal) {
                    c.counts.add(f.prefix+(s.played==f.card?"playedFirstLegal":"heldFirstLegal"));f.hadLegal=true;
                }
                if(payable&&s.played!=f.card)c.counts.add(f.prefix+"heldLegalTurns");
                if(s.played!=null&&s.played!=f.card)for(Map.Entry<Resource,Integer> cost:s.played.getCost().entrySet())
                    c.counts.add(f.prefix+"spentElsewhere-"+cost.getKey(),cost.getValue());
            }
            for(Token t:s.tokens) for(Player.Revealed r:p.getRevealed())if(r.getId()==t.id)t.absentSince=r.getAbsentSince();
        }
    }
    void committed(Game g) {
        for(Player p:g.getPlayers().values()) {
            Seat s=seats.get(p.getPlayerId()); ChargeMeasureTest.Measured c=(ChargeMeasureTest.Measured)p.getCharacter();
            Move resolved=g.getResolvedMoves().stream().filter(m->m.getPlayerId().equals(p.getPlayerId())).findFirst().orElse(null);
            for(Iterator<Found> it=s.found.iterator();it.hasNext();) {
                Found f=it.next();
                if(s.played==f.card) {
                    c.counts.add(f.prefix+"foundCopyPlayed");
                    if(resolved!=null&&resolved.isVoid())c.counts.add(f.prefix+"foundCopyVoided");
                    if(c.parried)c.counts.add(f.prefix+"foundCopyParried");
                    it.remove();
                } else if(!p.holds(f.card)) {c.counts.add(f.prefix+"foundCopyDiscarded");it.remove();}
                else if(g.isOver()) {c.counts.add(f.prefix+"foundCopyHeldAtEnd");it.remove();}
            }
            boolean satisfied=false;
            for(Iterator<Token> it=s.tokens.iterator();it.hasNext();) {
                Token t=it.next();
                boolean active=p.getCharacter().getStatuses().stream().anyMatch(x->Objects.equals(x.getExposure(),t.id));
                if(!active) {
                    boolean played=!satisfied&&s.played!=null&&s.played.getName().equals(t.name);
                    if(played)satisfied=true;
                    c.counts.add(t.prefix+(played?"tokenSatisfied":t.absentSince!=null&&g.getTurn()>t.absentSince+1?"tokenExitD71":"tokenClosedAtEnd"));
                    c.counts.add(t.prefix+"tokenDurationTurns",g.getTurn()-t.born);
                    it.remove();
                }
            }
            if(s.searchPrefix!=null) {
                String pre=s.searchPrefix;
                if(resolved==null||resolved.isVoid())c.counts.add(pre+"notExecuted");
                else c.counts.add(pre+"resolved");
                if(resolved!=null&&resolved.getSearchedFor()!=null) {
                    boolean ok=resolved.getSearchFound()!=null; s.announcements++;
                    c.counts.add(pre+(ok?"found":"missed"));
                    if(!ok)c.counts.add(pre+(s.hitInHand?"missAlreadyInHand":!s.hitInDeck?"missConsumedOrAbsent":"missOther"));
                    for(Resource r:Resource.values())c.counts.add(pre+(ok?"fullGain-":"fallbackGain-" )+r,
                            gain(s.played,ok,r));
                    c.counts.add(pre+"outcomeNextTurnResources");
                    for(Resource r:Resource.values())c.counts.add(pre+(ok?"foundNext-":"missNext-")+r,p.getResources().get(r));
                    if(!ok&&s.hitInHand)c.counts.add(pre+"fallbackWithHeldHit");
                    if(!ok&&s.hitInHand&&!g.isOver()) {
                        s.fallbackHit=p.getCardsInHand().stream().filter(x->x.getBindingName().equals(resolved.getSearchedFor())).findFirst().orElse(null);
                        s.fallbackPrefix=pre;
                    }
                    if(ok) {
                        Card card=resolved.getSearchFound();
                        c.counts.add(pre+"tokensCreated");
                        if(g.isOver()) {c.counts.add(pre+"foundCopyHeldAtEnd");c.counts.add(pre+"tokenClosedAtEnd");c.counts.add(pre+"tokenDurationTurns");}
                        else {
                            s.found.add(new Found(card,pre,g.getTurn()));
                            Player.Revealed r=p.getRevealed().stream().filter(x->x.getCard()==card).reduce((a,b)->b).orElseThrow();
                            s.tokens.add(new Token(r.getId(),g.getTurn()-1,card.getName(),pre));
                        }
                    }
                }
            }
            if(g.isOver()) {
                c.counts.add("announcements",s.announcements);
                c.counts.add("announcements-"+(s.announcements>=3?"3+":s.announcements));
                for(Card card:p.getCardsInHand())if(hit(card.getBindingName())!=null) {
                    String pre="charge/"+card.getBindingName()+"/";
                    if(s.seen.add(card))c.counts.add(pre+"seenCopies");
                    c.counts.add(pre+"heldAtEnd");
                }
            }
        }
    }
    static int gain(Card card,boolean found,Resource r) {
        return ((com.gsc.bm.model.cards.PrintedEffects.Source)card).printedEffects().getSteps().stream().filter(s->s.getKind()==com.gsc.bm.model.cards.PrintedEffects.Kind.SEARCH)
                .mapToInt(s->(found?s.getFoundGains():s.getMissedGains()).getOrDefault(r,0)).sum();
    }
}

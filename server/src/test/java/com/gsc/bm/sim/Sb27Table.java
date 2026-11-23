package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

/** Banco d50 condiviso dalle verifiche delle schede del Set Base 1.0. */
final class Sb27Table {
    private Sb27Table() { }

    private static final ObjectMapper JSON = new ObjectMapper();
    private static Draft draft;

    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    // ---- test cards ----

    static Card data(String name, String json) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(json.replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole("DAMAGE", "—");
            card.setGuiDamage("—");
            card.setGuiDamageAmount("—");
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    /** A card against the opponent with the given damages («HIT 30»), priority and optional cost («VIOLENCE 5»). */
    static Card hit(String name, int priority, String cost, String... damages) {
        String steps = Arrays.stream(damages).map(d -> "{'op':'damage','type':'" + d.split(" ")[0] + "','amount':" + d.split(" ")[1] + "}")
                .collect(Collectors.joining(","));
        String paid = cost == null ? "" : ",'cost':{'" + cost.split(" ")[0] + "':" + cost.split(" ")[1] + "}";
        return data(name, "{'binding':'t." + name + "','kind':'ACTION','priority':" + priority + paid + ",'targets':['OPPONENT'],'target':[" + steps + "]}");
    }

    static Card filler() {
        return data("Riempitivo", "{'binding':'t.Riempitivo','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    /** Consumes one of the author's items (a card that targets an own item, regolamento R01a). */
    static Card consume() {
        return data("Consuma", "{'binding':'t.Consuma','kind':'ACTION','priority':1,'targets':['NEAR_ITEM'],'self':[{'op':'consume'}]}");
    }

    /** A late card that gives T to its target. */
    static Card giveToxicity() {
        return data("Regalo", "{'binding':'t.Regalo','kind':'ACTION','priority':0,'targets':['OPPONENT'],'target':[{'op':'gain','resource':'TOXICITY','amount':10}]}");
    }

    /** A status of five turns on whoever the card is applied to: HIT received times factor; an equipment or not. */
    static Card status(String name, double factor, boolean equip) {
        return data(name, "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'status','name':'" + name
                + "','description':'prova','statusType':'GOOD','flow':'INPUT','property':'HIT','factor':" + factor
                + ",'turns':5" + (equip ? ",'equip':true" : "") + "}]}");
    }

    static void apply(Card card, Character on) { ((AbstractCard) card).applyEffectOnSelf(on); }

    static List<Card> fillers(int n) {
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < n; i++) cards.add(filler());
        return cards;
    }

    static Card card(String binding) { return draft.card(binding); }

    static String name(String binding) { return draft.card(binding).getName(); }

    // ---- table ----

    static Character character(String id, int alertness, int items, Resource... immunities) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, alertness);
        return new Draft.DraftCharacter(id, resources, items, Set.of(immunities));
    }

    /** Hand: the given cards and two fillers; deck: the first card of the list is the top. */
    static Player player(Character character, List<Card> hand, List<Card> deck, Card lastResort) {
        String id = character.getBindingName() != null ? character.getBindingName() : "?";
        Player p = new Player(id, character, filler(), List.of(), lastResort == null ? filler() : lastResort, List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().addAll(hand);
        if (lastResort != null) p.getCardsInHand().add(lastResort);
        p.getCardsInHand().addAll(fillers(2));
        List<Card> reversed = new ArrayList<>(deck);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    static Player player(String id, int alertness, Card... hand) {
        return player(character(id, alertness, 3), List.of(hand), fillers(10), null);
    }

    static Player s(Card... hand) { return player("s", 60, hand); }

    static Player b(Card... hand) { return player("b", 10, hand); }

    static Player c(Card... hand) { return player("c", 90, hand); }

    static Game game(Player... players) {
        Game game = new Game(List.of(players), "sb-27", false);
        game.useRuleset(Ruleset.D50);
        return game;
    }

    static Character ch(Game game, String id) { return game.getPlayers().get(id).getCharacter(); }

    static int res(Game game, String id, Resource r) { return ch(game, id).getResources().get(r); }

    static int health(Game game, String id) { return res(game, id, Resource.HEALTH); }

    static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    static Move onItem(Game game, String player, String card, String owner, String item) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        return new Move(card, player, owner, game.getGameId(), choices);
    }

    static Move bound(Game game, String player, String card, String target) {
        Map<Move.AdditionalAction, String> discard = new EnumMap<>(Move.AdditionalAction.class);
        discard.put(Move.AdditionalAction.DISCARD_ONE, "Riempitivo");
        return new Move(card, player, target, game.getGameId(), discard);
    }

    static Move rest(Game game, String player) { return move(game, player, "Riempitivo", "SELF"); }

    /** One turn; returns the health lost by each player, in the order of the table. */
    static int[] turn(Game game, Move... moves) {
        List<String> ids = new ArrayList<>(game.getPlayers().keySet());
        int[] before = ids.stream().mapToInt(id -> health(game, id)).toArray();
        for (Move m : moves) game.submitMove(m);
        game.resolveMoves(g -> { }, (t, events) -> { });
        int[] lost = new int[ids.size()];
        for (int i = 0; i < ids.size(); i++) lost[i] = before[i] - health(game, ids.get(i));
        return lost;
    }

    static boolean voided(Game game, String id) {
        return game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals(id) && m.isVoid());
    }

    static List<String> items(Game game, String id) { return names(ch(game, id).getItems()); }

    static List<String> names(java.util.Collection<Card> cards) { return cards.stream().map(Card::getName).collect(Collectors.toList()); }

    static List<Status> tokens(Game game, String id) {
        return ch(game, id).getStatuses().stream().filter(st -> st.getExposure() != null).collect(Collectors.toList());
    }

    static List<String> report(Game game, String id) {
        return game.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals(id)).flatMap(m -> m.getMoveReport().values().stream())
                .flatMap(List::stream).collect(Collectors.toList());
    }

    static boolean inHand(Game game, String id, String card) {
        return game.getPlayers().get(id).getCardsInHand().stream().anyMatch(c -> c.getName().equals(card));
    }
}

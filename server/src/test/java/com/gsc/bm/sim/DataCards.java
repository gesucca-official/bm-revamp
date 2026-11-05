package com.gsc.bm.sim;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.AbstractCharacterBoundCard;
import com.gsc.bm.model.cards.AbstractItemCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import com.gsc.bm.service.factories.CardFactoryService;

import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * Prova SB-5: carte descritte come dati ed eseguite dalle stesse classi base delle carte Java.
 * Vive nei sorgenti di test: la partita viva non la conosce.
 */
final class DataCards {
    private static final ObjectMapper JSON = new ObjectMapper();
    static final String RESOURCE = "/sb-5/cards.json";

    private final Map<String, Definition> definitions = new LinkedHashMap<>();

    static DataCards load() throws Exception {
        try (InputStream input = DataCards.class.getResourceAsStream(RESOURCE)) {
            return parse(JSON.readTree(Objects.requireNonNull(input, RESOURCE)));
        }
    }

    static DataCards parse(JsonNode cards) throws Exception {
        DataCards result = new DataCards();
        for (JsonNode card : cards) {
            Definition definition = JSON.treeToValue(card, Definition.class);
            definition.check();
            if (result.definitions.put(definition.binding, definition) != null)
                throw new IllegalArgumentException("Carta ripetuta: " + definition.binding);
        }
        return result;
    }

    Set<String> bindings() { return definitions.keySet(); }

    LoadableCard create(String binding) {
        Definition definition = definitions.get(binding);
        if (definition == null) throw new IllegalArgumentException("Carta non a dati: " + binding);
        switch (definition.kind) {
            case ITEM: return new ItemCard(definition);
            case BOUND: return new BoundCard(definition);
            default: return new ActionCard(definition);
        }
    }

    enum Kind { ACTION, ITEM, BOUND }

    /** Una voce di cards.json. Un campo sconosciuto fa fallire la lettura. */
    public static final class Definition implements Serializable {
        public String binding;
        public Kind kind;
        public String boundTo;
        public boolean lastResort;
        public Integer priority;
        public Set<Card.CardTarget> targets;
        public Map<Resource, Integer> cost = Map.of();
        public List<Step> self = List.of();
        public List<Step> target = List.of();

        void check() {
            if (binding == null || kind == null) throw invalid("binding e kind sono obbligatori");
            if ((kind == Kind.BOUND) != (boundTo != null)) throw invalid("boundTo vale per le carte BOUND, e solo per quelle");
            if (lastResort && kind != Kind.ACTION) throw invalid("lastResort vale solo per ACTION");
            if (kind == Kind.ITEM) {
                if (priority != null || targets != null || !cost.isEmpty() || !target.isEmpty())
                    throw invalid("un oggetto ha solo effetti su di sé: priorità, bersaglio e costo sono fissi");
            } else if (targets == null || targets.isEmpty()) throw invalid("targets è obbligatorio");
        }

        private IllegalArgumentException invalid(String message) {
            return new IllegalArgumentException("Carta " + binding + ": " + message);
        }

        int priorityOrDefault() { return priority == null ? 1 : priority; }
    }

    /** Un numero fisso, o base + risorsa dell'autore / divide (divisione intera), letta quando l'effetto si applica. */
    public static final class Amount implements Serializable {
        public int base;
        public Resource of;
        public int divide = 1;

        public Amount() { }

        @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
        public Amount(int fixed) { base = fixed; }

        int value(Character author) { return of == null ? base : base + author.getResources().get(of) / divide; }
    }

    /**
     * Un passo dell'effetto, nell'ordine scritto. Il soggetto è l'autore nella lista self, il bersaglio nella lista target.
     * Restituisce la riga di rapporto, o null se non ne produce.
     */
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "op")
    @JsonSubTypes({
            @JsonSubTypes.Type(value = DamageStep.class, name = "damage"),
            @JsonSubTypes.Type(value = GainStep.class, name = "gain"),
            @JsonSubTypes.Type(value = LoseStep.class, name = "lose"),
            @JsonSubTypes.Type(value = EmptyStep.class, name = "empty"),
            @JsonSubTypes.Type(value = StatusStep.class, name = "status"),
            @JsonSubTypes.Type(value = SayStep.class, name = "say")
    })
    public interface Step extends Serializable {
        String apply(Character author, Character subject);
    }

    public static final class DamageStep implements Step {
        public Damage.DamageType type;
        public Amount amount;
        /** Se presente, i soli tipi di stato che modificano questo danno; altrimenti tutti. */
        public Set<StatusType> applying;

        @Override public String apply(Character author, Character subject) {
            Damage damage = new Damage(type, amount.value(author));
            return applying == null ? author.inflictDamage(subject, damage) : author.inflictDamage(subject, damage, applying);
        }
    }

    public static final class GainStep implements Step {
        public Resource resource;
        public Amount amount;

        @Override public String apply(Character author, Character subject) {
            return subject.gainResource(resource, amount.value(author));
        }
    }

    public static final class LoseStep implements Step {
        public Resource resource;
        public Amount amount;

        @Override public String apply(Character author, Character subject) {
            return subject.loseResource(resource, amount.value(author));
        }
    }

    public static final class EmptyStep implements Step {
        public Resource resource;

        @Override public String apply(Character author, Character subject) { return subject.emptyResource(resource); }
    }

    /** Aggiunge uno stato che moltiplica un tipo di danno. Non produce righe: la riga, se c'è, è un passo say. */
    public static final class StatusStep implements Step {
        public String name;
        public String description;
        public StatusType statusType;
        public StatusFlow flow;
        public Damage.DamageType property;
        public float factor;
        public Integer turns;

        @Override public String apply(Character author, Character subject) {
            final float multiplier = factor;
            subject.getStatuses().add(Status.builder().name(name).description(description).type(statusType).flow(flow)
                    .impactedProperty(property).amountFunction((StatusAmountFunction) n -> n * multiplier)
                    .lastsForTurns(turns).build());
            return null;
        }
    }

    public static final class SayStep implements Step {
        public String text;

        @Override public String apply(Character author, Character subject) { return text; }
    }

    /** Come le carte Java: niente effetti significa null, non una lista vuota. */
    private static List<String> run(List<Step> steps, Character author, Character subject) {
        if (steps.isEmpty()) return null;
        List<String> report = new ArrayList<>();
        for (Step step : steps) {
            String line = step.apply(author, subject);
            if (line != null) report.add(line);
        }
        return report;
    }

    private static final class ActionCard extends AbstractCard {
        private final Definition definition;

        ActionCard(Definition definition) {
            this.definition = definition;
            setLastResort(definition.lastResort);
            setPriority(definition.priorityOrDefault());
            setCanTarget(Set.copyOf(definition.targets));
            setCost(Map.copyOf(definition.cost));
        }

        @Override public String getBindingName() { return definition.binding; }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, self, self); }
        @Override public List<String> applyEffectOnTarget(Character self, Character target) { return run(definition.target, self, target); }
    }

    /** Priorità, bersaglio e costo arrivano da AbstractItemCard. Grab fa il cast a questa classe base. */
    private static final class ItemCard extends AbstractItemCard {
        private final Definition definition;

        ItemCard(Definition definition) { this.definition = definition; }

        @Override public String getBindingName() { return definition.binding; }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, self, self); }
    }

    /** Lo scarto obbligatorio arriva da AbstractCharacterBoundCard. */
    private static final class BoundCard extends AbstractCharacterBoundCard {
        private final Definition definition;

        BoundCard(Definition definition) {
            super(characterClass(definition.boundTo));
            this.definition = definition;
            setPriority(definition.priorityOrDefault());
            setCanTarget(Set.copyOf(definition.targets));
            setCost(Map.copyOf(definition.cost));
        }

        private static Class<? extends Character> characterClass(String binding) {
            try {
                return Class.forName(CardFactoryService.BASE_CARDS_PKG + binding).asSubclass(Character.class);
            } catch (ClassNotFoundException | ClassCastException e) {
                throw new IllegalArgumentException("Personaggio sconosciuto: " + binding, e);
            }
        }

        @Override public String getBindingName() { return definition.binding; }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, self, self); }
        @Override public List<String> applyEffectOnTarget(Character self, Character target) { return run(definition.target, self, target); }
    }
}

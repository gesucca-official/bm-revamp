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
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusAmountTypeFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

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
 * SB-11a aggiunge il passo {@code consume}, il campo {@code basic} e, dentro {@code status}, l'equip (uso singolo, conversione del tipo).
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
            Definition definition = definition(card);
            if (result.definitions.put(definition.binding, definition) != null)
                throw new IllegalArgumentException("Carta ripetuta: " + definition.binding);
        }
        return result;
    }

    /** Una voce letta e controllata: campi sconosciuti, mancanti o incoerenti, anche dentro i passi, fanno fallire la lettura. */
    static Definition definition(JsonNode card) throws Exception {
        Definition definition = JSON.treeToValue(card, Definition.class);
        definition.check();
        return definition;
    }

    Set<String> bindings() { return definitions.keySet(); }

    LoadableCard create(String binding) {
        Definition definition = definitions.get(binding);
        if (definition == null) throw new IllegalArgumentException("Carta non a dati: " + binding);
        return instantiate(definition);
    }

    static LoadableCard instantiate(Definition definition) {
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
        /** Azione base del personaggio (come BruiserGrab): persiste in mano e non si scarta. Solo per ACTION. */
        public boolean basic;
        /**
         * SB-16c (D50, point 2), playground rules only: «Ultimo colpo» written on the card. Its HEALTH cost may be paid down to 0 or
         * below, and its move resolves even if its author is down. Not for items.
         */
        public boolean lastBlow;
        public Integer priority;
        public Set<Card.CardTarget> targets;
        public Map<Resource, Integer> cost = Map.of();
        public List<Step> self = List.of();
        public List<Step> target = List.of();

        void check() {
            if (binding == null || kind == null) throw invalid("binding e kind sono obbligatori");
            if ((kind == Kind.BOUND) != (boundTo != null)) throw invalid("boundTo vale per le carte BOUND, e solo per quelle");
            if (lastResort && kind != Kind.ACTION) throw invalid("lastResort vale solo per ACTION");
            if (basic && kind != Kind.ACTION) throw invalid("basic vale solo per ACTION");
            if (basic && lastResort) throw invalid("basic e lastResort si escludono");
            if (lastBlow && kind == Kind.ITEM) throw invalid("lastBlow non vale per un oggetto: un oggetto non ha costo né bersaglio");
            if (kind == Kind.ITEM) {
                if (priority != null || targets != null || !cost.isEmpty() || !target.isEmpty())
                    throw invalid("un oggetto ha solo effetti su di sé: priorità, bersaglio e costo sono fissi");
            } else if (targets == null || targets.isEmpty()) throw invalid("targets è obbligatorio");
            if (cost == null) throw invalid("cost non può essere null");
            for (Map.Entry<Resource, Integer> entry : cost.entrySet())
                if (entry.getKey() == null || entry.getValue() == null || entry.getValue() < 0)
                    throw invalid("cost: " + entry.getKey() + " deve avere un valore intero non negativo");
            checkSteps("self", self);
            checkSteps("target", target);
            checkConsume();
            checkSearch();
        }

        /**
         * Dove sta il passo search (SB-16c, D50 punto 6): solo in self, una volta, in una carta che lascia la mano e quindi pesca dopo
         * la sua mossa: non in un oggetto, che non si gioca, né in una basic, che resta in mano.
         */
        private void checkSearch() {
            for (int i = 0; i < target.size(); i++)
                if (target.get(i) instanceof SearchStep)
                    throw invalid("target[" + i + "]: search vale solo in self: sostituisce la pesca di chi gioca la carta");
            int seen = 0;
            for (int i = 0; i < self.size(); i++) {
                if (!(self.get(i) instanceof SearchStep)) continue;
                String where = "self[" + i + "]: search ";
                if (kind == Kind.ITEM) throw invalid(where + "non è ammesso in un oggetto: un oggetto non si gioca");
                if (basic) throw invalid(where + "non è ammesso in una basic: resta in mano e non pesca");
                if (++seen > 1) throw invalid(where + "ripetuto: una sola ricerca per carta");
            }
        }

        /** La carta cercata dal passo search, o null. */
        String searches() {
            for (Step step : self) if (step instanceof SearchStep) return ((SearchStep) step).card;
            return null;
        }
        /** Dove sta il passo consume: solo in self, una volta, in un'azione regolare o basic che bersaglia un oggetto vicino. */
        private void checkConsume() {
            for (int i = 0; i < target.size(); i++)
                if (target.get(i) instanceof ConsumeStep)
                    throw invalid("target[" + i + "]: consume vale solo in self: consuma l'oggetto per chi gioca la carta");
            int seen = 0;
            for (int i = 0; i < self.size(); i++) {
                if (!(self.get(i) instanceof ConsumeStep)) continue;
                String where = "self[" + i + "]: consume ";
                if (kind == Kind.ITEM) throw invalid(where + "non è ammesso in un oggetto");
                if (kind == Kind.BOUND) throw invalid(where + "non è ammesso in una bound: una bound non può bersagliare oggetti");
                if (lastResort) throw invalid(where + "non è ammesso in una last resort: deve essere sempre giocabile");
                if (!targets.contains(Card.CardTarget.NEAR_ITEM))
                    throw invalid(where + "richiede targets NEAR_ITEM: il giocatore sceglie l'oggetto da consumare");
                if (++seen > 1) throw invalid(where + "ripetuto: un solo passo consume per carta");
            }
        }

        boolean consumes() { return self.stream().anyMatch(step -> step instanceof ConsumeStep); }

        private void checkSteps(String list, List<Step> steps) {
            if (steps == null) throw invalid(list + " non può essere null");
            for (int i = 0; i < steps.size(); i++) {
                Step step = steps.get(i);
                if (step == null) throw invalid(list + "[" + i + "] è null");
                String missing = step.missing();
                if (missing != null) throw invalid(list + "[" + i + "]: " + missing);
            }
        }

        private IllegalArgumentException invalid(String message) {
            return new IllegalArgumentException("Carta " + binding + ": " + message);
        }

        int priorityOrDefault() { return priority == null ? 1 : priority; }
    }

    /** Un numero fisso, o base + risorsa dell'autore / divide (divisione intera), letta quando l'effetto si applica. */
    public static final class Amount implements Serializable {
        public Integer base;
        public Resource of;
        public int divide = 1;

        public Amount() { }

        @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
        public Amount(int fixed) { base = fixed; }

        int value(Character author) { return of == null ? base : base + author.getResources().get(of) / divide; }

        /** Il campo mancante o non valido, o null. */
        String missing(String field) {
            if (base == null) return "campo " + field + ".base mancante";
            if (divide <= 0) return "campo " + field + ".divide deve essere positivo";
            return null;
        }
    }

    private static String required(Object value, String field) { return value == null ? "campo " + field + " mancante" : null; }

    private static String amount(Amount amount) {
        return amount == null ? "campo amount mancante" : amount.missing("amount");
    }

    private static String first(String... problems) {
        for (String problem : problems) if (problem != null) return problem;
        return null;
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
            @JsonSubTypes.Type(value = SayStep.class, name = "say"),
            @JsonSubTypes.Type(value = ConsumeStep.class, name = "consume"),
            @JsonSubTypes.Type(value = SearchStep.class, name = "search")
    })
    public interface Step extends Serializable {
        String apply(Character author, Character subject);

        /**
         * Le righe del passo. Quasi tutti i passi ne scrivono al più una e ignorano l'oggetto; consume (SB-11a) ne scrive di più e
         * ha bisogno dell'oggetto che la carta ha preso dal campo, che qui è null se non l'ha preso.
         */
        default List<String> lines(Card consumed, Character author, Character subject) {
            String line = apply(author, subject);
            return line == null ? List.of() : List.of(line);
        }

        /** Il primo campo obbligatorio mancante o non valido, o null: un passo incompleto si rifiuta alla lettura. */
        String missing();
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

        @Override public String missing() { return first(required(type, "type"), amount(amount)); }
    }

    public static final class GainStep implements Step {
        public Resource resource;
        public Amount amount;

        @Override public String apply(Character author, Character subject) {
            return subject.gainResource(resource, amount.value(author));
        }

        @Override public String missing() { return first(required(resource, "resource"), amount(amount)); }
    }

    public static final class LoseStep implements Step {
        public Resource resource;
        public Amount amount;

        @Override public String apply(Character author, Character subject) {
            return subject.loseResource(resource, amount.value(author));
        }

        @Override public String missing() { return first(required(resource, "resource"), amount(amount)); }
    }

    public static final class EmptyStep implements Step {
        public Resource resource;

        @Override public String apply(Character author, Character subject) { return subject.emptyResource(resource); }

        @Override public String missing() { return required(resource, "resource"); }
    }

    /**
     * Aggiunge uno stato che moltiplica un tipo di danno. Non produce righe: la riga, se c'è, è un passo say.
     * Con {@code equip: true} (SB-11a) è un equipaggiamento: lo stato che BadEducation sa togliere. Un equip ha sempre una durata
     * ({@code turns}) o l'uso singolo ({@code singleUse}, durata zero dopo l'uso, R05), e può convertire il tipo di danno
     * ({@code convertTo}). {@code singleUse} e {@code convertTo} valgono solo per gli equip.
     */
    public static final class StatusStep implements Step {
        public String name;
        public String description;
        public StatusType statusType;
        public StatusFlow flow;
        public Damage.DamageType property;
        public Float factor;
        public Integer turns;
        public boolean equip;
        public boolean singleUse;
        public Damage.DamageType convertTo;

        @Override public String apply(Character author, Character subject) {
            final float multiplier = factor;
            Status.StatusBuilder status = Status.builder().name(name).description(description).type(statusType).flow(flow)
                    .impactedProperty(property).amountFunction((StatusAmountFunction) n -> n * multiplier)
                    .lastsForTurns(turns);
            if (equip) status.equip(true);
            if (singleUse) status.singleUse(true);
            if (convertTo != null) {
                final Damage.DamageType from = property, to = convertTo;
                status.typeFunction((StatusAmountTypeFunction) type -> type == from ? to : type);
            }
            subject.getStatuses().add(status.build());
            return null;
        }

        @Override public String missing() {
            String problem = first(required(name, "name"), required(description, "description"), required(statusType, "statusType"),
                    required(flow, "flow"), required(property, "property"), required(factor, "factor"));
            if (problem != null) return problem;
            if (!(factor > 0)) return "campo factor deve essere positivo, trovato " + factor;
            if (!equip && singleUse) return "campo singleUse vale solo con equip: true";
            if (!equip && convertTo != null) return "campo convertTo vale solo con equip: true";
            if (convertTo == property) return "campo convertTo converte " + property + " in se stesso";
            if (turns == null && !singleUse)
                return equip ? "equip senza durata né uso singolo: serve turns oppure singleUse" : "campo turns mancante";
            return null;
        }
    }

    /**
     * Consuma l'oggetto vicino scelto dal giocatore, come Grab (SB-11a): applica gli effetti dell'oggetto a chi lo consuma, con la riga
     * «Grabbed and consumed Item …», oppure scrive «Couldn't Grab that Item!» se l'oggetto è sparito prima della risoluzione. I passi
     * scritti prima e dopo valgono comunque. Solo in self, solo nelle azioni che bersagliano un oggetto vicino.
     */
    public static final class ConsumeStep implements Step {
        @Override public String apply(Character author, Character subject) {
            throw new IllegalStateException("consume ha bisogno dell'oggetto scelto: si esegue con lines()");
        }

        @Override public List<String> lines(Card consumed, Character author, Character subject) {
            if (consumed == null) return List.of("Couldn't Grab that Item!");
            List<String> report = new ArrayList<>();
            report.add("Grabbed and consumed Item " + consumed.getName());
            List<String> effects = ((AbstractItemCard) consumed).applyEffectOnSelf(author);
            if (effects != null) report.addAll(effects);
            return report;
        }

        @Override public String missing() { return null; }
    }

    /**
     * SB-16c (D50, punto 6), solo con le regole del playground: la pesca che segue la mossa diventa la ricerca nel mazzo della carta
     * indicata ({@code card}, un binding). La carta trovata si mostra a tutti nel rapporto della mossa; se non c'è si pesca
     * normalmente. Il passo non scrive righe: la riga la scrive la partita quando pesca. Con le regole 1.13 non fa nulla.
     */
    public static final class SearchStep implements Step {
        public String card;

        @Override public String apply(Character author, Character subject) {
            subject.requestSearch(card);
            return null;
        }

        @Override public String missing() { return card == null || card.isBlank() ? "campo card mancante" : null; }
    }

    public static final class SayStep implements Step {
        public String text;

        @Override public String apply(Character author, Character subject) { return text; }

        @Override public String missing() { return required(text, "text"); }
    }

    /** Come le carte Java: niente effetti significa null, non una lista vuota. */
    private static List<String> run(List<Step> steps, Card consumed, Character author, Character subject) {
        if (steps.isEmpty()) return null;
        List<String> report = new ArrayList<>();
        for (Step step : steps) report.addAll(step.lines(consumed, author, subject));
        return report;
    }

    private static final class ActionCard extends AbstractCard {
        private final Definition definition;
        /** L'oggetto preso dal campo in questa risoluzione (come Grab.targetItem), o null se non c'era più. Solo con consume. */
        private Card consumed;

        ActionCard(Definition definition) {
            this.definition = definition;
            setLastResort(definition.lastResort);
            setBasicAction(definition.basic);
            setPriority(definition.priorityOrDefault());
            setCanTarget(Set.copyOf(definition.targets));
            setCost(Map.copyOf(definition.cost));
        }

        @Override public String getBindingName() { return definition.binding; }

        @com.fasterxml.jackson.annotation.JsonIgnore @Override public boolean isLastBlow() { return definition.lastBlow; }

        /** Come Grab: l'oggetto si ricontrolla alla risoluzione e, se c'è ancora, esce dal campo. */
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) {
            if (!definition.consumes()) return;
            try {
                consumed = g.getItem(m.getPlayerId(), m.getChoices().get(Move.AdditionalAction.TARGET_ITEM));
            } catch (IllegalMoveException e) {
                consumed = null;
                return;
            }
            g.getSelf(m).getCharacter().getItems().remove(consumed);
        }

        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, consumed, self, self); }

        /** Gli effetti sul bersaglio dell'oggetto consumato seguono quelli della carta, come in Grab. */
        @Override public List<String> applyEffectOnTarget(Character self, Character target) {
            List<String> own = run(definition.target, consumed, self, target);
            List<String> fromItem = consumed == null ? null : ((AbstractItemCard) consumed).applyEffectOnTarget(self, target);
            if (fromItem == null) return own;
            if (own == null) return fromItem;
            List<String> both = new ArrayList<>(own);
            both.addAll(fromItem);
            return both;
        }
    }

    /** Priorità, bersaglio e costo arrivano da AbstractItemCard. Grab fa il cast a questa classe base. */
    private static final class ItemCard extends AbstractItemCard {
        private final Definition definition;

        ItemCard(Definition definition) { this.definition = definition; }

        @Override public String getBindingName() { return definition.binding; }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, null, self, self); }
    }

    /** Lo scarto obbligatorio arriva da AbstractCharacterBoundCard. */
    private static final class BoundCard extends AbstractCharacterBoundCard {
        private final Definition definition;

        BoundCard(Definition definition) {
            super(Character.class); // Il legame vero è l'id, anche di un personaggio che esiste solo in una bozza (SB-6a).
            setBoundToCharacter(definition.boundTo);
            this.definition = definition;
            setPriority(definition.priorityOrDefault());
            setCanTarget(Set.copyOf(definition.targets));
            setCost(Map.copyOf(definition.cost));
        }

        @Override public String getBindingName() { return definition.binding; }
        @com.fasterxml.jackson.annotation.JsonIgnore @Override public boolean isLastBlow() { return definition.lastBlow; }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, null, self, self); }
        @Override public List<String> applyEffectOnTarget(Character self, Character target) { return run(definition.target, null, self, target); }
    }
}

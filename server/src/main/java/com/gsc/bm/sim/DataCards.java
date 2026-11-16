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
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusAmountTypeFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import com.gsc.bm.model.game.status.Vulnerability;

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
        /** SB-16i: the printed effects, built once (a definition does not change after it is read). Not a JSON field. */
        private transient PrintedEffects printedCache;

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
            checkVendi();
            for (int i = 0; i < self.size(); i++)
                if (self.get(i) instanceof GettoneStep)
                    throw invalid("self[" + i + "]: gettone vale solo in target: la condizione è sul bersaglio");
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

        /** La carta cercata dal passo search (la prima stampata), o null. */
        String searches() {
            List<String> all = searchesAll();
            return all.isEmpty() ? null : all.get(0);
        }

        /** SB-16i: tutte le carte che il passo search può cercare, nell'ordine stampato; vuota senza ricerca. */
        List<String> searchesAll() {
            for (Step step : self) if (step instanceof SearchStep) return ((SearchStep) step).names();
            return List.of();
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

        /**
         * SB-17 («Lo rivendo», regole del playground 1.3, RP-25, RP-26): dove sta il passo vendi. Solo in self, una volta, in una basic
         * che bersaglia solo NEAR_ITEM e non consuma: si vende l'oggetto bersagliato, come una presa senza l'effetto. Mai in una bound
         * (come consume: una bound non può bersagliare oggetti), né in un'azione regolare o in un oggetto.
         */
        private void checkVendi() {
            for (int i = 0; i < target.size(); i++)
                if (target.get(i) instanceof VendiStep)
                    throw invalid("target[" + i + "]: vendi vale solo in self: vende un oggetto di chi gioca la carta");
            int seen = 0;
            for (int i = 0; i < self.size(); i++) {
                if (!(self.get(i) instanceof VendiStep)) continue;
                String where = "self[" + i + "]: vendi ";
                if (kind == Kind.ITEM) throw invalid(where + "non è ammesso in un oggetto: un oggetto non si gioca");
                if (kind == Kind.BOUND) throw invalid(where + "non è ammesso in una bound: una bound non può bersagliare oggetti");
                // SB-17 B5e (D120, deroga del playground, sim): ammessa anche in una regolare (non last resort) col solo bersaglio NEAR_ITEM.
                if (lastResort) throw invalid(where + "non è ammesso in una last resort: deve essere sempre giocabile");
                if (!Set.of(Card.CardTarget.NEAR_ITEM).equals(targets))
                    throw invalid(where + "richiede targets solo NEAR_ITEM: si vende l'oggetto bersagliato");
                if (consumes()) throw invalid(where + "e consume si escludono");
                if (++seen > 1) throw invalid(where + "ripetuto: una sola vendita per carta");
            }
        }

        boolean sells() { return self.stream().anyMatch(step -> step instanceof VendiStep); }

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

    /**
     * Un numero fisso, o base + risorsa dell'autore / divide (divisione intera), letta quando l'effetto si applica.
     * SB-16i («Rincara X»): {@code perPlay}, facoltativo e 0 se manca, si aggiunge una volta per ogni giocata precedente della
     * carta da parte del suo autore nella partita (solo con le regole del playground, che contano le giocate).
     */
    public static final class Amount implements Serializable {
        public Integer base;
        public Resource of;
        public int divide = 1;
        public int perPlay;

        public Amount() { }

        @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
        public Amount(int fixed) { base = fixed; }

        int value(Character author) { return value(author, 0); }

        int value(Character author, int plays) {
            return (of == null ? base : base + author.getResources().get(of) / divide) + perPlay * plays;
        }

        /** Il campo mancante o non valido, o null. */
        String missing(String field) {
            if (base == null) return "campo " + field + ".base mancante";
            if (divide <= 0) return "campo " + field + ".divide deve essere positivo";
            if (perPlay < 0) return "campo " + field + ".perPlay non può essere negativo";
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
            @JsonSubTypes.Type(value = SearchStep.class, name = "search"),
            @JsonSubTypes.Type(value = AnticipoStep.class, name = "anticipo"),
            @JsonSubTypes.Type(value = GettoneStep.class, name = "gettone"),
            @JsonSubTypes.Type(value = VendiStep.class, name = "vendi")
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

        /** SB-16i («Rincara»): as above, knowing the earlier plays of the card by its author; only the amounts read them. */
        default List<String> lines(Card consumed, Character author, Character subject, int plays) {
            return lines(consumed, author, subject);
        }

        /** Il primo campo obbligatorio mancante o non valido, o null: un passo incompleto si rifiuta alla lettura. */
        String missing();
    }

    public static final class DamageStep implements Step {
        public Damage.DamageType type;
        public Amount amount;
        /** Se presente, i soli tipi di stato che modificano questo danno; altrimenti tutti. */
        public Set<StatusType> applying;

        @Override public String apply(Character author, Character subject) { return apply(author, subject, 0); }

        String apply(Character author, Character subject, int plays) {
            Damage damage = new Damage(type, amount.value(author, plays));
            return applying == null ? author.inflictDamage(subject, damage) : author.inflictDamage(subject, damage, applying);
        }

        @Override public List<String> lines(Card consumed, Character author, Character subject, int plays) {
            return List.of(apply(author, subject, plays));
        }

        @Override public String missing() { return first(required(type, "type"), amount(amount)); }
    }

    public static final class GainStep implements Step {
        public Resource resource;
        public Amount amount;

        @Override public String apply(Character author, Character subject) { return subject.gainResource(resource, amount.value(author)); }

        @Override public List<String> lines(Card consumed, Character author, Character subject, int plays) {
            return List.of(subject.gainResource(resource, amount.value(author, plays)));
        }

        @Override public String missing() { return first(required(resource, "resource"), amount(amount)); }
    }

    public static final class LoseStep implements Step {
        public Resource resource;
        public Amount amount;

        @Override public String apply(Character author, Character subject) { return subject.loseResource(resource, amount.value(author)); }

        @Override public List<String> lines(Card consumed, Character author, Character subject, int plays) {
            return List.of(subject.loseResource(resource, amount.value(author, plays)));
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
     * indicata ({@code card}, un binding: il colpo cercato; mai un oggetto, D70, controllato dal caricatore della bozza).
     * La carta trovata si mostra a tutti nel rapporto della mossa e, da SB-16g
     * 2a (D58, D69), resta disegnata a faccia in su nella mano finché il giocatore non gioca una carta con il suo nome o finché quella
     * copia non esce; se non c'è si pesca normalmente. Il passo non scrive righe: la riga la scrive la partita quando pesca. Con le
     * regole 1.13 non fa nulla.
     * <p>
     * D71–D72: {@code vulnerability} creates a named token only on success, ending after all turn-end effects on play,
     * or one whole turn after the last copy leaves hand and deck. {@code foundGains}/{@code missedGains} are explicit resource
     * maps, applied once after the search according to its outcome. A miss draws normally and never creates a token.
     * Legacy {@code turnsIfNotFound} is accepted but unused.
     */
    public static final class SearchStep implements Step {
        public String card;
        /**
         * SB-16i (D94, D97): «Annuncia X o Y», uno o due binding distinti nell'ordine stampato, al posto di {@code card}; il
         * giocatore sceglie, quando gioca la carta, fra quelli con almeno una copia nel mazzo.
         */
        public List<String> cards;
        public Vulnerability vulnerability;
        /** D72: conditional resources printed on the card, not unconditional gain steps. */
        public Map<Resource, Integer> foundGains = Map.of();
        public Map<Resource, Integer> missedGains = Map.of();

        /** I binding cercati, nell'ordine stampato. */
        List<String> names() { return cards != null ? List.copyOf(cards) : card == null ? List.of() : List.of(card); }

        @Override public String apply(Character author, Character subject) {
            if (cards == null) subject.requestSearch(card);
            else subject.requestSearchAmong(cards);
            subject.requestSearchGains(foundGains, missedGains);
            if (vulnerability != null) subject.requestVulnerability(vulnerability);
            return null;
        }

        @Override public String missing() {
            if (cards != null) {
                if (card != null) return "campi card e cards insieme: uno solo";
                if (cards.isEmpty() || cards.size() > 2) return "campo cards: uno o due binding";
                for (String c : cards) if (c == null || c.isBlank()) return "campo cards: binding vuoto";
                if (cards.size() == 2 && cards.get(0).equals(cards.get(1))) return "campo cards: due binding uguali";
            } else if (card == null || card.isBlank()) return "campo card mancante";
            for (Map<Resource, Integer> gains : java.util.Arrays.asList(foundGains, missedGains)) {
                if (gains == null) return "search gains non possono essere null";
                for (Map.Entry<Resource, Integer> gain : gains.entrySet())
                    if (gain.getKey() == null || gain.getValue() == null || gain.getValue() < 0)
                        return "search gains devono essere risorse non negative";
            }
            return vulnerability == null ? null : vulnerability.missing();
        }
    }

    /**
     * SB-16i (D97), «Gioca d'anticipo: E», solo con le regole del playground: i passi annidati ({@code steps}) si applicano, dopo
     * quelli scritti prima, solo se la mossa si risolve in un gruppo di velocità precedente a quello della mossa del bersaglio;
     * lo decide la partita ({@link Character#isAhead()}). Non contiene ricerche, consumi né altri anticipi.
     */
    public static final class AnticipoStep implements Step {
        public List<Step> steps;

        @Override public String apply(Character author, Character subject) {
            throw new IllegalStateException("anticipo si esegue con lines()");
        }

        @Override public List<String> lines(Card consumed, Character author, Character subject) {
            return lines(consumed, author, subject, 0);
        }

        @Override public List<String> lines(Card consumed, Character author, Character subject, int plays) {
            if (!author.isAhead()) return List.of();
            List<String> report = new ArrayList<>();
            for (Step step : steps) report.addAll(step.lines(consumed, author, subject, plays));
            return report;
        }

        @Override public String missing() {
            if (steps == null || steps.isEmpty()) return "campo steps mancante o vuoto";
            for (int i = 0; i < steps.size(); i++) {
                Step step = steps.get(i);
                if (step == null) return "steps[" + i + "] è null";
                if (step instanceof SearchStep || step instanceof ConsumeStep || step instanceof AnticipoStep || step instanceof VendiStep)
                    return "steps[" + i + "]: anticipo non contiene search, consume, vendi né anticipo";
                String missing = step.missing();
                if (missing != null) return "steps[" + i + "]: " + missing;
            }
            return null;
        }
    }

    /**
     * SB-17 («se il bersaglio ha un gettone», Conto salato), solo nella lista target: i passi annidati ({@code steps}) si applicano,
     * dopo quelli scritti prima, solo se il bersaglio ha un gettone di vulnerabilità quando il passo si applica. Con le regole 1.13
     * non ci sono gettoni e i passi annidati non si applicano mai. Non contiene ricerche, consumi, anticipi né altri gettoni.
     */
    public static final class GettoneStep implements Step {
        public List<Step> steps;

        @Override public String apply(Character author, Character subject) {
            throw new IllegalStateException("gettone si esegue con lines()");
        }

        @Override public List<String> lines(Card consumed, Character author, Character subject) {
            return lines(consumed, author, subject, 0);
        }

        @Override public List<String> lines(Card consumed, Character author, Character subject, int plays) {
            if (!hasToken(subject)) return List.of();
            List<String> report = new ArrayList<>();
            for (Step step : steps) report.addAll(step.lines(consumed, author, subject, plays));
            return report;
        }

        static boolean hasToken(Character subject) {
            return subject.getStatuses().stream().anyMatch(s -> s.getExposure() != null);
        }

        @Override public String missing() {
            if (steps == null || steps.isEmpty()) return "campo steps mancante o vuoto";
            for (int i = 0; i < steps.size(); i++) {
                Step step = steps.get(i);
                if (step == null) return "steps[" + i + "] è null";
                if (step instanceof SearchStep || step instanceof ConsumeStep || step instanceof AnticipoStep || step instanceof GettoneStep
                        || step instanceof VendiStep)
                    return "steps[" + i + "]: gettone non contiene search, consume, vendi, anticipo né gettone";
                String missing = step.missing();
                if (missing != null) return "steps[" + i + "]: " + missing;
            }
            return null;
        }
    }

    /**
     * SB-17 («Lo rivendo», regole del playground 1.3, RP-25), solo in self di una basic: la carta ha già tolto dal campo l'oggetto
     * bersagliato, senza il suo effetto, se c'era ancora. Con l'oggetto scrive «Sold Item X» e applica {@code seHai}, il ricavato;
     * se l'oggetto è sparito scrive «Nothing to sell» e non applica nulla (D118 (2)). I passi annidati sono soli guadagni e perdite
     * di chi gioca ({@code gain}, {@code lose}, {@code say}). Il campo {@code seNo} della 1.2 non c'è più.
     */
    public static final class VendiStep implements Step {
        public List<Step> seHai;

        @Override public String apply(Character author, Character subject) {
            throw new IllegalStateException("vendi ha bisogno dell'oggetto venduto: si esegue con lines()");
        }

        @Override public List<String> lines(Card sold, Character author, Character subject) {
            return lines(sold, author, subject, 0);
        }

        @Override public List<String> lines(Card sold, Character author, Character subject, int plays) {
            List<String> report = new ArrayList<>();
            if (sold == null) {
                report.add("Nothing to sell");
                return report;
            }
            report.add("Sold Item " + sold.getName());
            for (Step step : seHai) report.addAll(step.lines(null, author, subject, plays));
            return report;
        }

        @Override public String missing() {
            if (seHai == null || seHai.isEmpty()) return "campo seHai mancante o vuoto";
            for (int i = 0; i < seHai.size(); i++) {
                Step step = seHai.get(i);
                if (step == null) return "seHai[" + i + "] è null";
                if (!(step instanceof GainStep || step instanceof LoseStep || step instanceof SayStep))
                    return "seHai[" + i + "]: vendi contiene solo gain, lose e say";
                String missing = step.missing();
                if (missing != null) return "seHai[" + i + "]: " + missing;
            }
            return null;
        }
    }

    /**
     * SB-17 («Lo rivendo», RP-25, 1.3): l'oggetto da vendere, tolto dal campo alla risoluzione: il bersaglio della mossa
     * ({@code TARGET_ITEM}) se è ancora fra gli oggetti di chi gioca, altrimenti nessuno; nessun ripiego. Non passa da
     * {@link Game#getItem}, che scrive nel registro un tentativo illegale: un oggetto sparito qui è un esito previsto.
     */
    static Card sell(Game g, Move m) {
        java.util.Queue<Card> items = g.getSelf(m).getCharacter().getItems();
        String choice = m.getChoices() == null ? null : m.getChoices().get(Move.AdditionalAction.TARGET_ITEM);
        Card sold = null;
        if (choice != null) for (Card item : items) if (item.getName().equals(choice)) { sold = item; break; }
        if (sold != null) items.remove(sold);
        return sold;
    }

    public static final class SayStep implements Step {
        public String text;

        @Override public String apply(Character author, Character subject) { return text; }

        @Override public String missing() { return required(text, "text"); }
    }

    /** D76: the printed steps of a definition as plain numbers, self steps first, as {@link AbstractCard#resolve} applies them. */
    static PrintedEffects printed(Definition definition) {
        PrintedEffects cached = definition.printedCache;
        if (cached == null) definition.printedCache = cached = build(definition);
        return cached;
    }

    private static PrintedEffects build(Definition definition) {
        List<PrintedEffects.Step> steps = new ArrayList<>();
        for (Step step : definition.self) printed(step, false, false, false, null, steps);
        for (Step step : definition.target) printed(step, true, false, false, null, steps);
        return new PrintedEffects(List.copyOf(steps));
    }

    private static void printed(Step step, boolean onTarget, boolean ahead, boolean ifToken, Boolean sold, List<PrintedEffects.Step> steps) {
        if (step instanceof AnticipoStep) {
            for (Step nested : ((AnticipoStep) step).steps) printed(nested, onTarget, true, ifToken, sold, steps);
            return;
        }
        if (step instanceof GettoneStep) {
            for (Step nested : ((GettoneStep) step).steps) printed(nested, onTarget, ahead, true, sold, steps);
            return;
        }
        if (step instanceof VendiStep) {
            // SB-17 (RP-25, 1.3): the sale first, then the proceeds, marked; the reader applies them only if an item was sold.
            steps.add(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SELL).onTarget(onTarget).build());
            for (Step nested : ((VendiStep) step).seHai) printed(nested, onTarget, ahead, ifToken, Boolean.TRUE, steps);
            return;
        }
        PrintedEffects.Step.StepBuilder b = PrintedEffects.Step.builder().onTarget(onTarget).ahead(ahead).ifToken(ifToken).sold(sold);
        if (step instanceof DamageStep) {
            DamageStep d = (DamageStep) step;
            amount(b.kind(PrintedEffects.Kind.DAMAGE).damageType(d.type).applying(d.applying == null ? null : Set.copyOf(d.applying)), d.amount);
        } else if (step instanceof GainStep) {
            amount(b.kind(PrintedEffects.Kind.GAIN).resource(((GainStep) step).resource), ((GainStep) step).amount);
        } else if (step instanceof LoseStep) {
            amount(b.kind(PrintedEffects.Kind.LOSE).resource(((LoseStep) step).resource), ((LoseStep) step).amount);
        } else if (step instanceof EmptyStep) {
            b.kind(PrintedEffects.Kind.EMPTY).resource(((EmptyStep) step).resource);
        } else if (step instanceof StatusStep) {
            StatusStep s = (StatusStep) step;
            b.kind(PrintedEffects.Kind.STATUS).damageType(s.property).flow(s.flow).statusType(s.statusType).factor(s.factor)
                    .convertTo(s.convertTo).name(s.name).description(s.description).turns(s.turns).singleUse(s.singleUse).equip(s.equip);
        } else if (step instanceof SearchStep) {
            SearchStep s = (SearchStep) step;
            b.kind(PrintedEffects.Kind.SEARCH).factor(s.vulnerability == null ? null : s.vulnerability.factor)
                    .searchedCard(s.names().get(0)).searchedCards(s.cards == null ? null : List.copyOf(s.cards)).tokenDamage(s.vulnerability == null ? Set.of() : Set.copyOf(s.vulnerability.damage))
                    .foundGains(Map.copyOf(s.foundGains)).missedGains(Map.copyOf(s.missedGains));
        } else if (step instanceof ConsumeStep) {
            b.kind(PrintedEffects.Kind.CONSUME);
        } else return; // say: no effect
        steps.add(b.build());
    }

    private static void amount(PrintedEffects.Step.StepBuilder b, Amount amount) {
        b.base(amount.base).of(amount.of).divide(amount.divide).perPlay(amount.perPlay);
    }

    /** Come le carte Java: niente effetti significa null, non una lista vuota. */
    private static List<String> run(List<Step> steps, Card consumed, Character author, Character subject) {
        return run(steps, consumed, author, subject, 0);
    }

    /** SB-16i: {@code plays}, the earlier plays of the card by its author, reaches the amounts with «Rincara». */
    private static List<String> run(List<Step> steps, Card consumed, Character author, Character subject, int plays) {
        if (steps.isEmpty()) return null;
        List<String> report = new ArrayList<>();
        for (Step step : steps) report.addAll(step.lines(consumed, author, subject, plays));
        return report;
    }

    private static final class ActionCard extends AbstractCard implements PrintedEffects.Source {
        private final Definition definition;
        /** L'oggetto preso dal campo in questa risoluzione (come Grab.targetItem), o null se non c'era più. Solo con consume. */
        private Card consumed;
        /** SB-17: l'oggetto venduto in questa risoluzione, o null. Solo con vendi. */
        private Card sold;

        ActionCard(Definition definition) {
            this.definition = definition;
            setLastResort(definition.lastResort);
            setBasicAction(definition.basic);
            setPriority(definition.priorityOrDefault());
            setCanTarget(Set.copyOf(definition.targets));
            setCost(Map.copyOf(definition.cost));
        }

        @Override public String getBindingName() { return definition.binding; }

        @Override public PrintedEffects printedEffects() { return printed(definition); }

        @com.fasterxml.jackson.annotation.JsonIgnore @Override public boolean isLastBlow() { return definition.lastBlow; }

        /** Come Grab: l'oggetto si ricontrolla alla risoluzione e, se c'è ancora, esce dal campo. */
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) {
            sold = definition.sells() ? sell(g, m) : null;
            if (!definition.consumes()) return;
            try {
                consumed = g.getItem(m.getPlayerId(), m.getChoices().get(Move.AdditionalAction.TARGET_ITEM));
            } catch (IllegalMoveException e) {
                consumed = null;
                return;
            }
            g.getSelf(m).getCharacter().getItems().remove(consumed);
        }

        @Override public List<String> applyEffectOnSelf(Character self) {
            return run(definition.self, definition.sells() ? sold : consumed, self, self, self.playsOf(getName()));
        }

        /** Gli effetti sul bersaglio dell'oggetto consumato seguono quelli della carta, come in Grab. */
        @Override public List<String> applyEffectOnTarget(Character self, Character target) {
            List<String> own = run(definition.target, consumed, self, target, self.playsOf(getName()));
            List<String> fromItem = consumed == null ? null : ((AbstractItemCard) consumed).applyEffectOnTarget(self, target);
            if (fromItem == null) return own;
            if (own == null) return fromItem;
            List<String> both = new ArrayList<>(own);
            both.addAll(fromItem);
            return both;
        }
    }

    /** Priorità, bersaglio e costo arrivano da AbstractItemCard. Grab fa il cast a questa classe base. */
    private static final class ItemCard extends AbstractItemCard implements PrintedEffects.Source {
        private final Definition definition;

        ItemCard(Definition definition) { this.definition = definition; }

        @Override public String getBindingName() { return definition.binding; }

        @Override public PrintedEffects printedEffects() { return printed(definition); }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, null, self, self); }
    }

    /** Lo scarto obbligatorio arriva da AbstractCharacterBoundCard. */
    private static final class BoundCard extends AbstractCharacterBoundCard implements PrintedEffects.Source {
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

        @Override public PrintedEffects printedEffects() { return printed(definition); }
        @com.fasterxml.jackson.annotation.JsonIgnore @Override public boolean isLastBlow() { return definition.lastBlow; }
        @Override public void applyOtherUnfathomableLogic(Game g, Move m) { }
        @Override public List<String> applyEffectOnSelf(Character self) { return run(definition.self, null, self, self, self.playsOf(getName())); }
        @Override public List<String> applyEffectOnTarget(Character self, Character target) {
            return run(definition.target, null, self, target, self.playsOf(getName()));
        }
    }
}

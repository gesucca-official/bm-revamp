package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.service.factories.CardFactoryService;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;

/**
 * SB-6a: una bozza di set in un file JSON, con carte a dati e carte Java parametriche, personaggi, mazzi e parametri del formato.
 * Tutto si controlla alla lettura; un errore indica file, voce e campo. Vive nei sorgenti di test: la partita viva non la conosce.
 */
final class Draft implements PlayerSource {
    static final String FORMAT = "sb-6a/1";
    /** Il set di oggi scritto come bozza. */
    static final String CURRENT = "/sb-6a/attuale.json";
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Set<Card.CardTarget> ITEM_TARGETS = EnumSet.of(Card.CardTarget.NEAR_ITEM, Card.CardTarget.FAR_ITEM);

    /** Un errore della bozza: il messaggio dice dove. */
    static final class Invalid extends IllegalArgumentException {
        Invalid(String message) { super(message); }
    }

    /** Parametri del formato. */
    static final class Rules {
        final int deckSize, maxCopies, boundChoices;
        final boolean basicFixedPerCharacter, lastResortRequired;

        Rules(int deckSize, int maxCopies, boolean basicFixedPerCharacter, int boundChoices, boolean lastResortRequired) {
            this.deckSize = deckSize;
            this.maxCopies = maxCopies;
            this.basicFixedPerCharacter = basicFixedPerCharacter;
            this.boundChoices = boundChoices;
            this.lastResortRequired = lastResortRequired;
        }
    }

    /** I testi e i dati descrittivi che i bot e la traccia leggono. */
    static final class Gui {
        final String name, description, image, sprite, role, gains, damage, damageAmount;

        Gui(String name, String description, String image, String sprite, String role, String gains, String damage, String damageAmount) {
            this.name = name;
            this.description = description;
            this.image = image;
            this.sprite = sprite;
            this.role = role;
            this.gains = gains;
            this.damage = damage;
            this.damageAmount = damageAmount;
        }
    }

    /** Una carta della bozza: a dati, oppure una classe Java con costo, priorità e parametri scritti nel file. */
    private static final class CardSpec {
        final String binding;
        final Gui gui;
        final String exclusiveTo;
        final DataCards.Definition data;
        final Class<? extends AbstractCard> java;
        final Map<Resource, Integer> cost;
        final Integer priority;
        final Map<String, Integer> params;

        CardSpec(String binding, Gui gui, String exclusiveTo, DataCards.Definition data, Class<? extends AbstractCard> java,
                 Map<Resource, Integer> cost, Integer priority, Map<String, Integer> params) {
            this.binding = binding;
            this.gui = gui;
            this.exclusiveTo = exclusiveTo;
            this.data = data;
            this.java = java;
            this.cost = cost;
            this.priority = priority;
            this.params = params;
        }
    }

    private static final class CharacterSpec {
        final String id, name, basic;
        final Map<Resource, Integer> resources;
        final int items;
        final Set<Resource> immunities;

        CharacterSpec(String id, String name, Map<Resource, Integer> resources, int items, Set<Resource> immunities, String basic) {
            this.id = id;
            this.name = name;
            this.resources = resources;
            this.items = items;
            this.immunities = immunities;
            this.basic = basic;
        }
    }

    private static final class DeckSpec {
        final String id, character, basic, lastResort;
        final List<String> bound;
        final Map<String, Integer> cards;

        DeckSpec(String id, String character, String basic, List<String> bound, String lastResort, Map<String, Integer> cards) {
            this.id = id;
            this.character = character;
            this.basic = basic;
            this.bound = bound;
            this.lastResort = lastResort;
            this.cards = cards;
        }
    }

    /** Un personaggio scritto come dati: id, risorse iniziali (assente resta assente), capacità e immunità. */
    static final class DraftCharacter extends Character {
        DraftCharacter(String id, Map<Resource, Integer> resources, int items, Collection<Resource> immunities) {
            super(id, resources.get(Resource.HEALTH), resources.get(Resource.ALERTNESS), items);
            resources.forEach((resource, value) -> getResources().put(resource, value));
            getImmunities().addAll(immunities);
        }
    }

    final String source;
    final Rules rules;
    private final Map<String, CharacterSpec> characters = new LinkedHashMap<>();
    private final Map<String, CardSpec> cards = new LinkedHashMap<>();
    private final Map<String, DeckSpec> decks = new LinkedHashMap<>();

    /** La bozza scelta con -Dsim.draft=<percorso>, altrimenti quella del set di oggi. */
    static Draft selected() throws Exception {
        String path = System.getProperty("sim.draft");
        return path == null || path.isBlank() ? fromClasspath(CURRENT) : fromFile(Path.of(path));
    }

    static Draft fromClasspath(String resource) throws Exception {
        try (InputStream input = Draft.class.getResourceAsStream(resource)) {
            if (input == null) throw new Invalid(resource + ": file assente");
            return parse("classpath:" + resource, read(resource, input.readAllBytes()));
        }
    }

    static Draft fromFile(Path path) throws Exception {
        if (!Files.isRegularFile(path)) throw new Invalid(path + ": file assente");
        return parse(path.toString(), read(path.toString(), Files.readAllBytes(path)));
    }

    private static JsonNode read(String source, byte[] bytes) {
        try {
            return JSON.readTree(bytes);
        } catch (Exception error) {
            throw new Invalid(source + ": JSON non valido: " + error.getMessage());
        }
    }

    static Draft parse(String source, JsonNode root) {
        return new Draft(source, root);
    }

    private Draft(String source, JsonNode root) {
        this.source = source;
        ObjectNode top = object(root, "bozza");
        fields(top, "bozza", Set.of("format", "rules", "characters", "cards", "decks"), Set.of());
        String format = text(top, "format", "bozza");
        if (!FORMAT.equals(format)) throw invalid("bozza", "format vale " + format + ", atteso " + FORMAT);
        rules = rules(object(top.get("rules"), "rules"));
        for (JsonNode node : array(top, "characters", "bozza")) {
            CharacterSpec character = character(node);
            if (characters.put(character.id, character) != null) throw invalid("personaggio " + character.id, "id ripetuto");
        }
        for (JsonNode node : array(top, "cards", "bozza")) {
            CardSpec card = card(node);
            if (characters.containsKey(card.binding)) throw invalid("carta " + card.binding, "id già usato da un personaggio");
            if (cards.put(card.binding, card) != null) throw invalid("carta " + card.binding, "binding ripetuto");
        }
        checkCards();
        for (CharacterSpec character : characters.values()) checkCharacter(character);
        for (JsonNode node : array(top, "decks", "bozza")) {
            DeckSpec deck = deck(node);
            if (decks.put(deck.id, deck) != null) throw invalid("mazzo " + deck.id, "id ripetuto");
        }
        if (decks.isEmpty()) throw invalid("bozza", "nessun mazzo");
    }

    Set<String> deckIds() { return Collections.unmodifiableSet(decks.keySet()); }

    Set<String> cardBindings() { return Collections.unmodifiableSet(cards.keySet()); }

    String characterOf(String deck) { return decks.get(deck).character; }

    /** Le carte che almeno un mazzo usa: basic, bound, last resort e regolari. */
    Set<String> deckCards() {
        Set<String> used = new java.util.TreeSet<>();
        for (DeckSpec deck : decks.values()) {
            used.add(deck.basic);
            used.addAll(deck.bound);
            used.add(deck.lastResort);
            used.addAll(deck.cards.keySet());
        }
        return used;
    }

    /** Una nuova istanza della carta, coi numeri e i testi della bozza. */
    Card card(String binding) {
        CardSpec spec = cards.get(binding);
        if (spec == null) throw new IllegalArgumentException(source + ": carta assente: " + binding);
        return create(spec);
    }

    @Override
    public Player player(String deckId, String id, Random random, BotPolicy policy) {
        DeckSpec deck = decks.get(deckId);
        if (deck == null) throw new IllegalArgumentException(source + ": mazzo assente: " + deckId);
        CharacterSpec spec = characters.get(deck.character);
        // Stesso ordine del catalogo SB-3: carte del mazzo per binding, poi personaggio, bound, basic e last resort.
        List<Card> regular = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : deck.cards.entrySet())
            for (int i = 0; i < entry.getValue(); i++) regular.add(card(entry.getKey()));
        Character character = new DraftCharacter(spec.id, spec.resources, spec.items, spec.immunities);
        List<Card> bound = new ArrayList<>();
        for (String binding : deck.bound) bound.add(card(binding));
        Card basic = card(deck.basic), lastResort = card(deck.lastResort);
        if (policy != null) return new BotPlayer(id, character, basic, List.copyOf(bound), lastResort, regular, random, policy);
        return new ComPlayer(id, character, basic, List.copyOf(bound), lastResort, regular, random);
    }

    // ---- lettura delle voci ----

    private Rules rules(ObjectNode node) {
        String where = "rules";
        fields(node, where, Set.of("deckSize", "maxCopies", "basicFixedPerCharacter", "boundChoices", "lastResortRequired"), Set.of());
        int deckSize = integer(node, "deckSize", where), maxCopies = integer(node, "maxCopies", where);
        int boundChoices = integer(node, "boundChoices", where);
        boolean basicFixed = bool(node, "basicFixedPerCharacter", where), lastResort = bool(node, "lastResortRequired", where);
        if (deckSize < 1) throw invalid(where, "deckSize deve essere almeno 1");
        if (maxCopies < 1) throw invalid(where, "maxCopies deve essere almeno 1");
        // La mano ha Player.CARDS_IN_HAND carte: basic e bound devono lasciare almeno un posto alle regolari.
        if (boundChoices < 0 || 1 + boundChoices > Player.CARDS_IN_HAND - 1)
            throw invalid(where, "boundChoices deve stare fra 0 e " + (Player.CARDS_IN_HAND - 2) + " (mano da " + Player.CARDS_IN_HAND + ")");
        if (!lastResort) throw invalid(where, "lastResortRequired false non è giocabile: il motore richiede una last resort (Player)");
        return new Rules(deckSize, maxCopies, basicFixed, boundChoices, true);
    }

    private CharacterSpec character(JsonNode raw) {
        ObjectNode node = object(raw, "personaggio");
        String id = text(node, "id", "personaggio");
        String where = "personaggio " + id;
        fields(node, where, Set.of("id", "name", "resources", "items", "immunities"), Set.of("basic"));
        String name = text(node, "name", where);
        ObjectNode resourcesNode = object(node.get("resources"), where + ": resources");
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resourcesNode.fields().forEachRemaining(entry -> {
            Resource resource = resource(entry.getKey(), where + ": resources");
            resources.put(resource, intValue(entry.getValue(), where + ": resources." + entry.getKey()));
            if (resources.get(resource) < 0) throw invalid(where, "resources." + entry.getKey() + " non può essere negativo");
        });
        if (!resources.containsKey(Resource.HEALTH)) throw invalid(where, "resources.HEALTH mancante");
        if (!resources.containsKey(Resource.ALERTNESS)) throw invalid(where, "resources.ALERTNESS mancante");
        if (resources.get(Resource.HEALTH) < 1) throw invalid(where, "resources.HEALTH deve essere almeno 1");
        int items = integer(node, "items", where);
        if (items < 1) throw invalid(where, "items deve essere almeno 1");
        Set<Resource> immunities = new LinkedHashSet<>();
        for (JsonNode immunity : array(node, "immunities", where)) {
            if (!immunity.isTextual()) throw invalid(where, "immunities contiene un valore non testuale: " + immunity);
            if (!immunities.add(resource(immunity.asText(), where + ": immunities")))
                throw invalid(where, "immunities: " + immunity.asText() + " ripetuta");
        }
        String basic = node.has("basic") ? text(node, "basic", where) : null;
        if (rules.basicFixedPerCharacter && basic == null) throw invalid(where, "campo basic mancante: la basic è fissa per personaggio");
        return new CharacterSpec(id, name, Collections.unmodifiableMap(resources), items, Collections.unmodifiableSet(immunities), basic);
    }

    private CardSpec card(JsonNode raw) {
        ObjectNode node = object(raw, "carta");
        String binding = text(node, "binding", "carta");
        String where = "carta " + binding;
        Gui gui = gui(node.get("gui"), where);
        String exclusiveTo = node.has("exclusiveTo") ? text(node, "exclusiveTo", where) : null;
        if (node.has("java")) {
            fields(node, where, Set.of("binding", "java", "gui"), Set.of("cost", "priority", "params", "exclusiveTo"));
            if (!node.get("java").isBoolean() || !node.get("java").asBoolean()) throw invalid(where, "java, se presente, vale true");
            return javaCard(node, binding, where, gui, exclusiveTo);
        }
        ObjectNode definition = node.deepCopy();
        definition.remove("gui");
        definition.remove("exclusiveTo");
        try {
            return new CardSpec(binding, gui, exclusiveTo, DataCards.definition(definition), null, null, null, null);
        } catch (JsonMappingException error) {
            StringBuilder path = new StringBuilder();
            for (JsonMappingException.Reference reference : error.getPath()) {
                if (reference.getFieldName() != null) path.append(path.length() == 0 ? "" : ".").append(reference.getFieldName());
                else path.append('[').append(reference.getIndex()).append(']');
            }
            throw invalid(where, "campo " + (path.length() == 0 ? "?" : path) + ": " + error.getOriginalMessage().split("\n")[0]);
        } catch (IllegalArgumentException error) {
            throw invalid(where, error.getMessage().replace("Carta " + binding + ": ", ""));
        } catch (Exception error) {
            throw invalid(where, error.getMessage());
        }
    }

    private CardSpec javaCard(ObjectNode node, String binding, String where, Gui gui, String exclusiveTo) {
        Class<? extends AbstractCard> type;
        try {
            Class<?> found = Class.forName(CardFactoryService.BASE_CARDS_PKG + binding);
            if (!AbstractCard.class.isAssignableFrom(found) || Modifier.isAbstract(found.getModifiers()))
                throw invalid(where, "la classe non è una carta concreta");
            type = found.asSubclass(AbstractCard.class);
            type.getConstructor();
        } catch (ClassNotFoundException error) {
            throw invalid(where, "nessuna classe Java " + CardFactoryService.BASE_CARDS_PKG + binding);
        } catch (NoSuchMethodException error) {
            throw invalid(where, "la classe non ha un costruttore pubblico senza argomenti");
        }
        AbstractCard probe = instantiate(type, where);
        Map<String, Field> tunable = tunableFields(type, where);
        Map<String, Integer> params = new TreeMap<>();
        ObjectNode paramsNode = object(node.get("params"), where + ": params");
        paramsNode.fields().forEachRemaining(entry -> {
            if (!tunable.containsKey(entry.getKey()))
                throw invalid(where, "parametro sconosciuto params." + entry.getKey() + " (noti: " + new TreeMap<>(tunable).keySet() + ")");
            params.put(entry.getKey(), intValue(entry.getValue(), where + ": params." + entry.getKey()));
        });
        for (String name : tunable.keySet())
            if (!params.containsKey(name)) throw invalid(where, "parametro mancante params." + name);
        Map<Resource, Integer> cost = null;
        Integer priority = null;
        if (probe.isItem()) {
            if (node.has("cost") || node.has("priority"))
                throw invalid(where, "un oggetto ha costo e priorità fissi: cost e priority non sono ammessi");
        } else {
            if (!node.has("cost")) throw invalid(where, "campo cost mancante");
            if (!node.has("priority")) throw invalid(where, "campo priority mancante");
            cost = new EnumMap<>(Resource.class);
            Map<Resource, Integer> costs = cost;
            object(node.get("cost"), where + ": cost").fields().forEachRemaining(entry -> {
                Resource resource = resource(entry.getKey(), where + ": cost");
                int value = intValue(entry.getValue(), where + ": cost." + entry.getKey());
                if (value < 0) throw invalid(where, "cost." + entry.getKey() + " non può essere negativo");
                costs.put(resource, value);
            });
            cost = Collections.unmodifiableMap(cost);
            priority = intValue(node.get("priority"), where + ": priority");
        }
        return new CardSpec(binding, gui, exclusiveTo, null, type, cost, priority, Collections.unmodifiableMap(params));
    }

    private Gui gui(JsonNode raw, String where) {
        String at = where + ": gui";
        if (raw == null) throw invalid(where, "campo gui mancante");
        ObjectNode node = object(raw, at);
        fields(node, at, Set.of("name", "role", "gains", "damage", "damageAmount"), Set.of("description", "image", "sprite"));
        return new Gui(text(node, "name", at), optional(node, "description", at), optional(node, "image", at), optional(node, "sprite", at),
                text(node, "role", at), text(node, "gains", at), text(node, "damage", at), text(node, "damageAmount", at));
    }

    private DeckSpec deck(JsonNode raw) {
        ObjectNode node = object(raw, "mazzo");
        String id = text(node, "id", "mazzo");
        String where = "mazzo " + id;
        fields(node, where, Set.of("id", "character", "bound", "lastResort", "cards"), Set.of("basic"));
        String characterId = text(node, "character", where);
        CharacterSpec character = characters.get(characterId);
        if (character == null) throw invalid(where, "personaggio sconosciuto: " + characterId);
        String basic = node.has("basic") ? text(node, "basic", where) : null;
        if (rules.basicFixedPerCharacter) {
            if (basic != null && !basic.equals(character.basic))
                throw invalid(where, "basic " + basic + " diversa da quella fissa del personaggio, " + character.basic);
            basic = character.basic;
        } else if (basic == null) throw invalid(where, "campo basic mancante");
        Card basicCard = probe(basic, where + ": basic");
        if (!basicCard.isBasicAction()) throw invalid(where, "basic " + basic + " non è una carta basic");

        List<String> bound = new ArrayList<>();
        for (JsonNode entry : array(node, "bound", where)) {
            if (!entry.isTextual()) throw invalid(where, "bound contiene un valore non testuale: " + entry);
            String binding = entry.asText();
            Card card = probe(binding, where + ": bound");
            if (!card.isCharacterBound()) throw invalid(where, "bound " + binding + " non è una carta bound");
            if (!characterId.equals(card.getBoundToCharacter()))
                throw invalid(where, "bound " + binding + " è legata a " + card.getBoundToCharacter() + ", non a " + characterId);
            if (bound.contains(binding)) throw invalid(where, "bound " + binding + " ripetuta: servono bound diverse");
            bound.add(binding);
        }
        if (bound.size() != rules.boundChoices)
            throw invalid(where, "bound sono " + bound.size() + ", il formato ne chiede " + rules.boundChoices);

        String lastResort = text(node, "lastResort", where);
        Card lastResortCard = probe(lastResort, where + ": lastResort");
        if (!lastResortCard.isLastResort()) throw invalid(where, "lastResort " + lastResort + " non è una last resort");
        String exclusive = cards.get(lastResort).exclusiveTo;
        if (exclusive != null && !exclusive.equals(characterId))
            throw invalid(where, "lastResort " + lastResort + " è riservata a " + exclusive + ", non a " + characterId);

        Map<String, Integer> regular = new TreeMap<>(); // Ordine per binding, come il catalogo SB-3.
        int total = 0;
        Iterator<Map.Entry<String, JsonNode>> entries = object(node.get("cards"), where + ": cards").fields();
        while (entries.hasNext()) {
            Map.Entry<String, JsonNode> entry = entries.next();
            String binding = entry.getKey();
            Card card = probe(binding, where + ": cards");
            if (card.isBasicAction() || card.isCharacterBound() || card.isLastResort())
                throw invalid(where, "cards." + binding + ": basic, bound e last resort non vanno fra le carte regolari");
            int copies = intValue(entry.getValue(), where + ": cards." + binding);
            if (copies < 1) throw invalid(where, "cards." + binding + ": almeno una copia");
            if (copies > rules.maxCopies)
                throw invalid(where, "cards." + binding + ": " + copies + " copie, il formato ne ammette al massimo " + rules.maxCopies);
            regular.put(binding, copies);
            total += copies;
        }
        if (total != rules.deckSize)
            throw invalid(where, "le carte regolari sono " + total + ", il formato ne chiede esattamente " + rules.deckSize);
        return new DeckSpec(id, characterId, basic, List.copyOf(bound), lastResort, Collections.unmodifiableMap(regular));
    }

    // ---- controlli sull'insieme ----

    private void checkCards() {
        Map<String, String> names = new HashMap<>();
        for (CardSpec spec : cards.values()) {
            String where = "carta " + spec.binding;
            String previous = names.put(spec.gui.name.toLowerCase(java.util.Locale.ROOT), spec.binding);
            if (previous != null) throw invalid(where, "gui.name «" + spec.gui.name + "» già usato da " + previous + " (la mano cerca le carte per nome)");
            Card card = probe(spec.binding, where);
            if (card.isCharacterBound()) {
                if (!characters.containsKey(card.getBoundToCharacter()))
                    throw invalid(where, "boundTo " + card.getBoundToCharacter() + " non è un personaggio della bozza");
                if (!Collections.disjoint(card.getCanTarget(), ITEM_TARGETS))
                    throw invalid(where, "una bound non può bersagliare oggetti: deve avere sempre un bersaglio valido");
            }
            if (card.isLastResort()) {
                if (!card.getCost().isEmpty()) throw invalid(where, "una last resort non può avere un costo: deve essere sempre giocabile");
                if (!Collections.disjoint(card.getCanTarget(), ITEM_TARGETS))
                    throw invalid(where, "una last resort non può bersagliare oggetti: deve essere sempre giocabile");
            }
            if (spec.exclusiveTo != null) {
                if (!card.isLastResort()) throw invalid(where, "exclusiveTo vale solo per le last resort");
                if (!characters.containsKey(spec.exclusiveTo)) throw invalid(where, "exclusiveTo " + spec.exclusiveTo + " non è un personaggio della bozza");
            }
        }
    }

    private void checkCharacter(CharacterSpec character) {
        if (character.basic == null) return;
        Card basic = probe(character.basic, "personaggio " + character.id + ": basic");
        if (!basic.isBasicAction()) throw invalid("personaggio " + character.id, "basic " + character.basic + " non è una carta basic");
    }

    // ---- istanze ----

    private Card probe(String binding, String where) {
        if (!cards.containsKey(binding)) throw invalid(where, "carta sconosciuta: " + binding);
        return create(cards.get(binding));
    }

    private Card create(CardSpec spec) {
        LoadableCard card;
        if (spec.data != null) card = DataCards.instantiate(spec.data);
        else {
            AbstractCard java = instantiate(spec.java, "carta " + spec.binding);
            Map<String, Field> tunable = tunableFields(spec.java, "carta " + spec.binding);
            try {
                for (Map.Entry<String, Integer> param : spec.params.entrySet()) tunable.get(param.getKey()).setInt(java, param.getValue());
                if (spec.cost != null) {
                    COST.set(java, spec.cost);
                    PRIORITY.setInt(java, spec.priority);
                }
            } catch (IllegalAccessException error) {
                throw new IllegalStateException(error);
            }
            card = java;
        }
        Gui gui = spec.gui;
        card.setGuiName(gui.name);
        card.setGuiEffectDescription(gui.description);
        card.setGuiImage(gui.image);
        card.setGuiSprite(gui.sprite);
        card.setGuiRole(gui.role, gui.gains);
        card.setGuiDamage(gui.damage);
        card.setGuiDamageAmount(gui.damageAmount);
        return card;
    }

    private static final Field COST = abstractCardField("cost");
    private static final Field PRIORITY = abstractCardField("priority");

    private static Field abstractCardField(String name) {
        try {
            Field field = AbstractCard.class.getDeclaredField(name);
            field.setAccessible(true);
            return field;
        } catch (NoSuchFieldException error) {
            throw new IllegalStateException("AbstractCard senza il campo " + name, error);
        }
    }

    private AbstractCard instantiate(Class<? extends AbstractCard> type, String where) {
        try {
            return type.getConstructor().newInstance();
        } catch (Exception error) {
            throw invalid(where, "la classe non si istanzia: " + error);
        }
    }

    /** I campi @Tunable della classe e delle superclassi, per nome; solo int. */
    private Map<String, Field> tunableFields(Class<?> type, String where) {
        Map<String, Field> fields = new TreeMap<>();
        for (Class<?> c = type; c != null && c != Object.class; c = c.getSuperclass())
            for (Field field : c.getDeclaredFields()) {
                if (!field.isAnnotationPresent(Tunable.class)) continue;
                if (field.getType() != int.class || Modifier.isStatic(field.getModifiers()) || Modifier.isFinal(field.getModifiers()))
                    throw invalid(where, "@Tunable " + c.getSimpleName() + "." + field.getName() + " deve essere un int d'istanza non final");
                if (fields.containsKey(field.getName())) throw invalid(where, "@Tunable " + field.getName() + " ripetuto nella gerarchia");
                field.setAccessible(true);
                fields.put(field.getName(), field);
            }
        return fields;
    }

    // ---- lettura stretta ----

    private Invalid invalid(String where, String message) {
        return new Invalid(source + ": " + where + ": " + message);
    }

    private ObjectNode object(JsonNode node, String where) {
        if (node == null || node.isNull()) throw invalid(where, "oggetto mancante");
        if (!node.isObject()) throw invalid(where, "atteso un oggetto, trovato " + node.getNodeType());
        return (ObjectNode) node;
    }

    private void fields(ObjectNode node, String where, Set<String> required, Set<String> optional) {
        Iterator<String> names = node.fieldNames();
        while (names.hasNext()) {
            String name = names.next();
            if (!required.contains(name) && !optional.contains(name)) throw invalid(where, "campo sconosciuto " + name);
        }
        for (String name : new java.util.TreeSet<>(required))
            if (!node.has(name) || node.get(name).isNull()) throw invalid(where, "campo " + name + " mancante");
    }

    private Iterable<JsonNode> array(ObjectNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) throw invalid(where, "campo " + field + " mancante");
        if (!value.isArray()) throw invalid(where, field + " deve essere una lista");
        return value;
    }

    private String text(ObjectNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) throw invalid(where, "campo " + field + " mancante");
        if (!value.isTextual() || value.asText().isBlank()) throw invalid(where, field + " deve essere un testo non vuoto");
        return value.asText();
    }

    private String optional(ObjectNode node, String field, String where) {
        return node.has(field) ? text(node, field, where) : null;
    }

    private int integer(ObjectNode node, String field, String where) {
        if (!node.has(field) || node.get(field).isNull()) throw invalid(where, "campo " + field + " mancante");
        return intValue(node.get(field), where + ": " + field);
    }

    private int intValue(JsonNode value, String where) {
        if (value == null || !value.isIntegralNumber() || !value.canConvertToInt())
            throw new Invalid(source + ": " + where + ": atteso un intero, trovato " + value);
        return value.intValue();
    }

    private boolean bool(ObjectNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || !value.isBoolean()) throw invalid(where, field + " deve essere true o false");
        return value.asBoolean();
    }

    private Resource resource(String name, String where) {
        try {
            return Resource.valueOf(name);
        } catch (IllegalArgumentException error) {
            throw new Invalid(source + ": " + where + ": risorsa sconosciuta " + name);
        }
    }
}
